// lib/epoClient.ts
// EPO OPS v3.2 REST Client: Number Service Normalization, Exponential Backoff,
// Parallel Endpoint Retrieval (/biblio, /legal, /family, /register), & XML Parser
import { getEpoAccessToken } from './epoAuth';

const OPS_BASE = process.env.EPO_OPS_BASE_URL || 'https://ops.epo.org/3.2/rest-services';

export interface NormalizedPatentId {
  rawInput: string;
  isValid: boolean;
  docdb?: string;   // e.g. "EP.3491024.B1"
  epodoc?: string;  // e.g. "EP3491024"
  country?: string;
  docNumber?: string;
  kind?: string;
  error?: string;
}

export interface AuditedEpoAsset {
  rawInput: string;
  docdb: string;
  epodoc: string;
  title: string;
  applicants: string[];
  inventors: string[];
  filingDate: string;
  grantDate: string;
  kindCode: string;
  cpcClasses: string[];
  legalEvents: Array<{ date: string; code: string; desc: string }>;
  familySize: number;
  familyJurisdictions: string[];
  registerStatus: string;
  notFoundInEpo: boolean;
  notFoundReason?: string;
  oppositionPending: boolean;
  unitaryPatent: boolean;
  unitaryPatentEvidence?: string;
  throttlingHeader: string;
}

// Fetch wrapper with 401/403 Token Refresh & 429/503 Exponential Backoff
async function fetchOpsXmlWithRetry(
  path: string,
  maxRetries = 3
): Promise<{ xml: string; throttlingControl: string; status: number }> {
  let attempt = 0;
  let forceTokenRefresh = false;

  while (attempt <= maxRetries) {
    const { accessToken } = await getEpoAccessToken(forceTokenRefresh);
    forceTokenRefresh = false;

    const res = await fetch(`${OPS_BASE}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/xml',
      },
      cache: 'no-store',
    });

    const throttlingControl = res.headers.get('X-Throttling-Control') || 'idle (retrieval=green:200)';

    // Immediate token refresh if EPO rejects bearer token
    if ((res.status === 401 || res.status === 403) && attempt < maxRetries) {
      forceTokenRefresh = true;
      attempt++;
      continue;
    }

    // Exponential backoff + jitter if EPO throttles (HTTP 429 or 503)
    if ((res.status === 429 || res.status === 503) && attempt < maxRetries) {
      const retryAfterSec = Number(res.headers.get('Retry-After')) || Math.pow(2, attempt + 1);
      const jitterMs = Math.floor(Math.random() * 350);
      await new Promise((r) => setTimeout(r, retryAfterSec * 1000 + jitterMs));
      attempt++;
      continue;
    }

    const xml = await res.text();
    return { xml, throttlingControl, status: res.status };
  }

  throw new Error(`EPO OPS request exhausted retries for path: ${path}`);
}

// 1. Standardize messy patent numbers via EPO OPS Number Service
export async function normalizePatentNumber(rawInput: string): Promise<NormalizedPatentId> {
  const cleaned = rawInput.trim();
  if (!cleaned) {
    return { rawInput, isValid: false, error: 'Empty patent identifier' };
  }

  // Detect whether input is an application number (e.g. 18192044.8) or publication number
  const isAppNum = /^(?:EP\s*)?\d{8}\.\d$/i.test(cleaned);
  const typeSegment = isAppNum ? 'application' : 'publication';
  const formattedQuery = encodeURIComponent(cleaned.replace(/\s+/g, ''));

  try {
    const { xml, status } = await fetchOpsXmlWithRetry(
      `/number-service/${typeSegment}/original/${formattedQuery}/docdb`
    );

    if (status !== 200 || xml.includes('SERVER.EntityNotFound') || xml.includes('CLIENT.InvalidNumber')) {
      return {
        rawInput,
        isValid: false,
        error: `EPO Number Service could not normalize "${rawInput}" into docdb format.`,
      };
    }

    const country = xml.match(/<country>([^<]+)<\/country>/)?.[1] || 'EP';
    const docNumber = xml.match(/<doc-number>([^<]+)<\/doc-number>/)?.[1] || '';
    const kind = xml.match(/<kind>([^<]+)<\/kind>/)?.[1] || 'B1';

    if (!docNumber) {
      return { rawInput, isValid: false, error: 'Missing <doc-number> in EPO Number Service XML' };
    }

    return {
      rawInput,
      isValid: true,
      country,
      docNumber,
      kind,
      docdb: `${country}.${docNumber}.${kind}`,
      epodoc: `${country}${docNumber}`,
    };
  } catch (err: any) {
    return { rawInput, isValid: false, error: err.message };
  }
}

function formatEpoDate(raw?: string): string {
  if (!raw || raw.length !== 8) return '';
  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
}

// 2. Parallel Retrieval & XML Parsing for a Normalized Patent
export async function fetchFullPatentAuditRecord(norm: NormalizedPatentId): Promise<AuditedEpoAsset> {
  const docdbId = norm.docdb!;
  const epodocId = norm.epodoc!;

  const [biblioRes, legalRes, familyRes, registerRes] = await Promise.all([
    fetchOpsXmlWithRetry(`/published-data/publication/docdb/${docdbId}/biblio`),
    fetchOpsXmlWithRetry(`/legal/publication/docdb/${docdbId}`),
    fetchOpsXmlWithRetry(`/family/publication/docdb/${docdbId}`),
    fetchOpsXmlWithRetry(`/register/publication/epodoc/${epodocId}/biblio`),
  ]);

  // Extract English title or fallback to first invention-title
  const titleMatch =
    biblioRes.xml.match(/<invention-title[^>]*lang="en"[^>]*>([^<]+)<\/invention-title>/i) ||
    biblioRes.xml.match(/<invention-title[^>]*>([^<]+)<\/invention-title>/i);

  // Extract applicants / proprietors
  const applicants = Array.from(
    biblioRes.xml.matchAll(/<applicant-name[^>]*>\s*<name>([^<]+)<\/name>/gi)
  ).map((m) => m[1].trim());

  // Extract CPC classification symbols
  const cpcClasses = Array.from(
    biblioRes.xml.matchAll(/<classification-cpc>([\s\S]*?)<\/classification-cpc>/gi)
  ).map((m) => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());

  // Extract INPADOC legal status events
  const legalEvents = Array.from(
    legalRes.xml.matchAll(/<ops:legal[^>]*code="([^"]+)"[^>]*desc="([^"]+)"[\s\S]*?<ops:date>([^<]+)<\/ops:date>/gi)
  ).map((m) => ({ code: m[1], desc: m[2], date: m[3] }));

  // Extract INPADOC family jurisdictions
  const familyCountries = Array.from(
    familyRes.xml.matchAll(/<family-member[\s\S]*?<country>([^<]+)<\/country>/gi)
  ).map((m) => m[1].trim());
  const uniqueJurisdictions = Array.from(new Set(familyCountries));

  // Detect EP Register opposition or lapse indicators
  const oppositionPending =
    registerRes.xml.includes('Opposition filed') || legalEvents.some((e) => e.code.includes('OPP'));

  // Detect Unitary Patent (UP / Reg. 1257/2012) status from EPO OPS /legal, /register, /biblio & /family XML:
  // - Official INPADOC codes: EP U07 (Unitary effect registered), U08 (Positive decision corrected)
  // - Negative/revocation guard: U09 (Positive decision deleted) cancels an earlier U07 if it occurs later
  // - Official EPO kind code marker: EP C0 (<kind>C0</kind>) in biblio or family records
  // - EPO Register XML phrases: "Unitary effect registered" / "Registration of unitary effect"
  const legalCodesOrdered = legalEvents.map((e) => e.code.trim().toUpperCase());
  const lastPositiveUpIdx = Math.max(
    legalCodesOrdered.lastIndexOf('U07'),
    legalCodesOrdered.lastIndexOf('U08')
  );
  const lastDeletedUpIdx = legalCodesOrdered.lastIndexOf('U09');
  const hasLegalUpCode =
    (lastPositiveUpIdx !== -1 && lastPositiveUpIdx > lastDeletedUpIdx) ||
    (/code="U0[78]"/i.test(legalRes.xml) && !/code="U09"/i.test(legalRes.xml));

  const hasLegalUpDescription = legalEvents.some(
    (e) =>
      /unitary effect registered|registration of unitary effect/i.test(e.desc) &&
      !/deleted|rejected|refused|withdrawn/i.test(e.desc)
  );

  const hasC0KindMarker =
    (norm.kind || '').toUpperCase() === 'C0' ||
    /<country>EP<\/country>\s*<doc-number>[^<]+<\/doc-number>\s*<kind>C0<\/kind>/i.test(biblioRes.xml) ||
    /<country>EP<\/country>\s*<doc-number>[^<]+<\/doc-number>\s*<kind>C0<\/kind>/i.test(familyRes.xml);

  const hasRegisterUpRegistration =
    /unitary effect registered|registration of unitary effect|<[^>]*unitary-effect[^>]*status="registered"/i.test(
      registerRes.xml
    ) && !/unitary effect not registered|request for unitary effect (?:rejected|deleted|withdrawn)/i.test(registerRes.xml);

  const unitaryPatent =
    hasLegalUpCode || hasLegalUpDescription || hasC0KindMarker || hasRegisterUpRegistration;

  const unitaryPatentEvidence = hasLegalUpCode
    ? 'EPO INPADOC legal event U07/U08 (Unitary effect registered)'
    : hasC0KindMarker
    ? 'EPO bibliographic C0 Unitary Patent kind-code marker'
    : hasRegisterUpRegistration || hasLegalUpDescription
    ? 'EPO Register Unitary Effect registration record'
    : undefined;

  const biblioNotFound =
    biblioRes.status !== 200 ||
    biblioRes.xml.includes('SERVER.EntityNotFound') ||
    biblioRes.xml.includes('CLIENT.InvalidNumber');
  const registerNotFound =
    registerRes.status !== 200 ||
    registerRes.xml.includes('SERVER.EntityNotFound') ||
    registerRes.xml.includes('CLIENT.InvalidNumber');
  const notFoundInEpo = biblioNotFound && registerNotFound;

  const rawFiling = biblioRes.xml.match(/<application-reference[\s\S]*?<date>(\d{8})<\/date>/)?.[1];
  const rawGrant = biblioRes.xml.match(/<publication-reference[\s\S]*?<date>(\d{8})<\/date>/)?.[1];

  return {
    rawInput: norm.rawInput,
    docdb: docdbId,
    epodoc: epodocId,
    title: notFoundInEpo
      ? 'Patent Number Not Found in EPO Register'
      : titleMatch?.[1]?.trim() || `European Patent ${epodocId}`,
    applicants: notFoundInEpo
      ? ['No Matching EPO Record']
      : applicants.length
      ? applicants
      : ['Unknown Proprietor'],
    inventors: [],
    filingDate: formatEpoDate(rawFiling),
    grantDate: formatEpoDate(rawGrant),
    kindCode: norm.kind || 'B1',
    cpcClasses,
    legalEvents,
    familySize: notFoundInEpo ? 0 : familyCountries.length || 1,
    familyJurisdictions: notFoundInEpo ? [] : uniqueJurisdictions,
    registerStatus: notFoundInEpo
      ? 'NOT_FOUND_IN_EPO'
      : registerRes.status === 200
      ? 'EP_REGISTER_VERIFIED'
      : 'PUBLISHED_DATA_ONLY',
    notFoundInEpo,
    notFoundReason: notFoundInEpo
      ? `No matching publication or register record was found in the EPO OPS v3.2 database for "${norm.rawInput}".`
      : undefined,
    oppositionPending: notFoundInEpo ? false : oppositionPending,
    unitaryPatent: notFoundInEpo ? false : unitaryPatent,
    unitaryPatentEvidence: notFoundInEpo ? undefined : unitaryPatentEvidence,
    throttlingHeader: biblioRes.throttlingControl,
  };
}

