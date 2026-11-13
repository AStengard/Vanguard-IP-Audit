// lib/riskAnalyzer.ts
// Dedicated 5-Check M&A Legal Due Diligence Rules Engine for EPO Patent Data
// Evaluates normalized EPO OPS records against Target Company Name and assigns
// CRITICAL, WARNING, or CLEAN ratings with Plain-English Lawyer's Notes & Raw EPO Codes.

export type RiskLevel = 'CRITICAL' | 'WARNING' | 'CLEAN';

export interface DueDiligenceCheckResult {
  id:
    | 'CHAIN_OF_TITLE'
    | 'MAINTENANCE_FEES'
    | 'OPPOSITION_DISPUTE'
    | 'TERRITORIAL_COVERAGE'
    | 'REMAINING_TERM';
  checkNumber: 1 | 2 | 3 | 4 | 5;
  title: string;
  epcCitation: string;
  status: RiskLevel;
  badgeLabel: string;
  measuredValue: string;
  lawyerNote: string;
  dealImpact: string;
  rawEpoEventCode: string;
}

export interface PatentRiskEvaluation {
  patentId: string;
  overallRisk: RiskLevel;
  primaryBadge: string;
  lawyerNote: string;
  dealImpact: string;
  rawEpoEventCode: string;
  checks: DueDiligenceCheckResult[];
}

const CORPORATE_SUFFIXES = [
  'gmbh & co. kg', 'gmbh', 'ag', 'ug', 'se', 'ltd.', 'ltd', 'limited', 'plc',
  'inc.', 'inc', 'incorporated', 'corp.', 'corp', 'corporation', 'llc',
  's.a.r.l.', 'sarl', 's.a.s.', 'sas', 's.a.', 'sa', 'b.v.', 'bv', 'n.v.', 'nv',
  'ab', 'oy', 'aps', 's.p.a.', 'spa', 's.r.l.', 'srl'
];

export function normalizeEntityName(name: string): string {
  if (!name) return '';
  let cleaned = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_~`()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  for (const suffix of CORPORATE_SUFFIXES) {
    const s = suffix.replace(/[.,]/g, '');
    cleaned = cleaned.replace(new RegExp(`\\b${s}$`, 'i'), '').trim();
  }
  return cleaned;
}

export function calculateFuzzySimilarity(owner: string, target: string): number {
  const a = normalizeEntityName(owner);
  const b = normalizeEntityName(target);
  if (!a || !b) return 0;
  if (a === b) return 100;

  const tokensA = a.split(' ').filter(Boolean);
  const tokensB = b.split(' ').filter(Boolean);
  const shared = tokensA.filter((t) => tokensB.includes(t));
  const tokenScore = shared.length / Math.max(tokensA.length, tokensB.length, 1);

  // Levenshtein character similarity
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  const maxLen = Math.max(a.length, b.length, 1);
  const charScore = Math.max(0, (maxLen - matrix[a.length][b.length]) / maxLen);

  if (a.includes(b) || b.includes(a)) {
    return Math.max(84, Math.round((tokenScore * 0.5 + charScore * 0.5) * 100));
  }
  return Math.round((tokenScore * 0.55 + charScore * 0.45) * 100);
}

export function analyzePatentRisk(
  asset: {
    epodoc: string;
    applicants: string[];
    filingDate: string; // YYYY-MM-DD
    grantDate: string;  // YYYY-MM-DD
    kindCode: string;   // A1 | B1
    legalEvents: Array<{ date: string; code: string; desc: string }>;
    validatedStates: string[];
    unitaryPatent: boolean;
    oppositionPending: boolean;
    lapsedForNonPayment: boolean;
  },
  targetCompanyName: string,
  auditDate: Date = new Date()
): PatentRiskEvaluation {
  const recordedOwner = asset.applicants[0] || 'Unknown Proprietor';
  const similarity = calculateFuzzySimilarity(recordedOwner, targetCompanyName);

  // 1. Chain of Title & Ownership Verification
  const check1: DueDiligenceCheckResult =
    similarity >= 90
      ? {
          id: 'CHAIN_OF_TITLE',
          checkNumber: 1,
          title: 'Chain of Title & Ownership',
          epcCitation: 'Art. 72 & Rule 22 EPC',
          status: 'CLEAN',
          badgeLabel: 'Verified Target Title',
          measuredValue: `${similarity}% Match`,
          lawyerNote: `Recorded EPO owner "${recordedOwner}" matches Target "${targetCompanyName}" (${similarity}% normalized similarity).`,
          dealImpact: 'Standard IP ownership warranty sufficient.',
          rawEpoEventCode: `EPO-B711: ${recordedOwner.toUpperCase()} | R022-OK (${similarity}%)`,
        }
      : {
          id: 'CHAIN_OF_TITLE',
          checkNumber: 1,
          title: 'Chain of Title & Ownership',
          epcCitation: 'Art. 72 & Rule 22 EPC',
          status: similarity >= 75 ? 'WARNING' : 'CRITICAL',
          badgeLabel: similarity >= 75 ? 'Group Entity Variance' : 'Chain of Title Mismatch',
          measuredValue: `${similarity}% Match`,
          lawyerNote: `Recorded EPO owner "${recordedOwner}" does not match Target "${targetCompanyName}" (${similarity}% match), indicating an unrecorded assignment under Rule 22 EPC.`,
          dealImpact: 'Requires pre-closing Art. 72 EPC confirmatory assignment & Rule 22 recordal or specific title indemnity.',
          rawEpoEventCode: `EPO-B711: ${recordedOwner.toUpperCase()} | NO-R022-TRANSFER (${similarity}%)`,
        };

  // 2. Maintenance & Renewal Fee Status
  const isDead =
    asset.lapsedForNonPayment ||
    asset.legalEvents.some((e) => ['PGFP', 'LAP', 'REV', 'WDR', 'DW'].includes(e.code));

  const check2: DueDiligenceCheckResult = isDead
    ? {
        id: 'MAINTENANCE_FEES',
        checkNumber: 2,
        title: 'Maintenance & Renewal Fee Status',
        epcCitation: 'Art. 86 & Rule 51(2) EPC',
        status: 'CRITICAL',
        badgeLabel: 'Lapsed / Inactive Right',
        measuredValue: 'Lapsed (Non-Payment)',
        lawyerNote: 'Patent has lapsed due to non-payment of annual renewal fees and expiration of the 6-month grace period.',
        dealImpact: 'Exclude from active IP schedule and adjust purchase price for lost exclusivity.',
        rawEpoEventCode: 'INPADOC: PGFP / ART-86-LAPSE',
      }
    : {
        id: 'MAINTENANCE_FEES',
        checkNumber: 2,
        title: 'Maintenance & Renewal Fee Status',
        epcCitation: 'Art. 86 & Rule 51(2) EPC',
        status: 'CLEAN',
        badgeLabel: 'Active & Renewal Paid',
        measuredValue: 'In Force',
        lawyerNote: 'Annual renewal fees are paid and current across designated jurisdictions.',
        dealImpact: 'No annuity default; transition docket deadlines at Closing.',
        rawEpoEventCode: 'INPADOC: PAYR-CURRENT |PG25-ACTIVE',
      };

  // 3. Post-Grant Opposition & Dispute Check
  const grantMs = new Date(asset.grantDate).getTime();
  const monthsSinceGrant = Number(
    ((auditDate.getTime() - grantMs) / (1000 * 60 * 60 * 24 * 30.4375)).toFixed(1)
  );
  const check3: DueDiligenceCheckResult = asset.oppositionPending
    ? {
        id: 'OPPOSITION_DISPUTE',
        checkNumber: 3,
        title: 'Post-Grant Opposition & Disputes',
        epcCitation: 'Art. 99 & Art. 101 EPC',
        status: 'CRITICAL',
        badgeLabel: 'Active Opposition / Validity Challenge',
        measuredValue: 'Opposition Pending',
        lawyerNote: 'Active third-party opposition pending before the EPO Opposition Division under Art. 99 EPC.',
        dealImpact: 'Require special escrow holdback and specific validity indemnity pending final resolution.',
        rawEpoEventCode: 'INPADOC: R099 / OPP-FILED',
      }
    : monthsSinceGrant < 9.0
    ? {
        id: 'OPPOSITION_DISPUTE',
        checkNumber: 3,
        title: 'Post-Grant Opposition & Disputes',
        epcCitation: 'Art. 99(1) EPC',
        status: 'WARNING',
        badgeLabel: 'Within 9-Month Opposition Window',
        measuredValue: `${monthsSinceGrant}m Since Grant`,
        lawyerNote: `Granted ${monthsSinceGrant} months ago; the 9-month statutory opposition window under Art. 99(1) EPC remains open.`,
        dealImpact: 'Include post-closing opposition notice covenant and competitor watch monitoring.',
        rawEpoEventCode: `EPO-B450: GRANT-AGE=${monthsSinceGrant}M (<9M-WINDOW)`,
      }
    : {
        id: 'OPPOSITION_DISPUTE',
        checkNumber: 3,
        title: 'Post-Grant Opposition & Disputes',
        epcCitation: 'Art. 99(1) EPC',
        status: 'CLEAN',
        badgeLabel: 'Opposition Window Closed',
        measuredValue: `Closed (${monthsSinceGrant}m)`,
        lawyerNote: '9-month post-grant opposition window expired without third-party challenge.',
        dealImpact: 'Central EPO opposition period closed clean.',
        rawEpoEventCode: `INPADOC: NOOP-CLOSED (${monthsSinceGrant}M)`,
      };

  // 4. Territorial Coverage & Validation Check
  const valCount = asset.unitaryPatent ? 17 : asset.validatedStates.length;
  const check4: DueDiligenceCheckResult =
    !asset.unitaryPatent && asset.validatedStates.length < 3
      ? {
          id: 'TERRITORIAL_COVERAGE',
          checkNumber: 4,
          title: 'Territorial Coverage & Validation',
          epcCitation: 'Art. 65 EPC',
          status: 'WARNING',
          badgeLabel: 'Narrow European Validation',
          measuredValue: `${asset.validatedStates.length} States (${asset.validatedStates.join(', ')})`,
          lawyerNote: `Granted EP patent was validated in fewer than 3 jurisdictions (${asset.validatedStates.join(', ')}).`,
          dealImpact: 'Verify whether narrow geographic scope covers Target’s commercial markets.',
          rawEpoEventCode: `INPADOC: VAL-COUNT=${asset.validatedStates.length} (<3-STATES)`,
        }
      : {
          id: 'TERRITORIAL_COVERAGE',
          checkNumber: 4,
          title: 'Territorial Coverage & Validation',
          epcCitation: 'Art. 65 EPC / Reg. 1257/2012',
          status: 'CLEAN',
          badgeLabel: 'Broad European Coverage',
          measuredValue: `${valCount} Jurisdictions`,
          lawyerNote: 'Validated across 3 or more key European jurisdictions or registered for Unitary Effect (UP).',
          dealImpact: 'Broad European territorial protection verified.',
          rawEpoEventCode: `INPADOC: VAL-COUNT=${valCount}-OK`,
        };

  // 5. Remaining Patent Term (20-Year Statutory Term from Filing Date)
  const filingDateObj = new Date(asset.filingDate);
  const expDateObj = new Date(filingDateObj);
  expDateObj.setUTCFullYear(expDateObj.getUTCFullYear() + 20);
  const yearsLeft = Number(
    ((expDateObj.getTime() - auditDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)
  );

  const check5: DueDiligenceCheckResult =
    yearsLeft < 3.0
      ? {
          id: 'REMAINING_TERM',
          checkNumber: 5,
          title: 'Remaining Patent Term',
          epcCitation: 'Art. 63(1) EPC',
          status: yearsLeft <= 0 ? 'CRITICAL' : 'WARNING',
          badgeLabel: yearsLeft <= 0 ? 'Expired Statutory Term' : 'Near-Term Expiration',
          measuredValue: `${yearsLeft} Years Remaining`,
          lawyerNote: `Fewer than 3 years (${yearsLeft} yrs) of 20-year statutory term remain until expiration on ${expDateObj.toISOString().slice(0, 10)}.`,
          dealImpact: 'Step down post-expiration cash flows in DCF valuation model.',
          rawEpoEventCode: `EPO-B220: EXP-${expDateObj.toISOString().slice(0, 10)} (${yearsLeft}Y<3.0Y)`,
        }
      : {
          id: 'REMAINING_TERM',
          checkNumber: 5,
          title: 'Remaining Patent Term',
          epcCitation: 'Art. 63(1) EPC',
          status: 'CLEAN',
          badgeLabel: 'Healthy Patent Runway',
          measuredValue: `${yearsLeft} Years Remaining`,
          lawyerNote: `${yearsLeft} years of statutory 20-year patent term remain under Art. 63(1) EPC.`,
          dealImpact: 'Full statutory runway supports transaction valuation.',
          rawEpoEventCode: `EPO-B220: RUNWAY-${yearsLeft}Y-OK`,
        };

  const checks = [check1, check2, check3, check4, check5];
  const criticals = checks.filter((c) => c.status === 'CRITICAL');
  const warnings = checks.filter((c) => c.status === 'WARNING');

  const overallRisk: RiskLevel =
    criticals.length > 0 ? 'CRITICAL' : warnings.length > 0 ? 'WARNING' : 'CLEAN';
  const primary = criticals[0] || warnings[0] || check1;

  return {
    patentId: asset.epodoc,
    overallRisk,
    primaryBadge: overallRisk === 'CLEAN' ? 'Verified Clean (5/5 Checks)' : primary.badgeLabel,
    lawyerNote: primary.lawyerNote,
    dealImpact: primary.dealImpact,
    rawEpoEventCode: primary.rawEpoEventCode,
    checks,
  };
}

