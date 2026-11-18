"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  SAMPLE_MA_PATENTS,
  DEFAULT_TARGET_COMPANY,
  SamplePatentRecord,
  DesignatedStateRecord,
  InpadocLegalEvent
} from '@/lib/sampleDeal';

// ============================================================================
// ENTITY NORMALIZATION HELPER (Chain of Title)
// ============================================================================
const CORPORATE_SUFFIXES = [
  'gmbh & co. kg', 'gmbh', 'ag', 'ug', 'se', 'ltd.', 'ltd', 'limited', 'plc',
  'inc.', 'inc', 'incorporated', 'corp.', 'corp', 'corporation', 'llc',
  's.a.r.l.', 'sarl', 's.a.s.', 'sas', 's.a.', 'sa', 'b.v.', 'bv', 'n.v.', 'nv',
  'ab', 'oy', 'aps', 's.p.a.', 'spa', 's.r.l.', 'srl'
];

function cleanEntityName(name: string): string {
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

function computeSimilarity(owner: string, target: string): number {
  const a = cleanEntityName(owner);
  const b = cleanEntityName(target);
  if (!a || !b) return 0;
  if (a === b) return 100;

  const tokensA = a.split(' ').filter(Boolean);
  const tokensB = b.split(' ').filter(Boolean);
  const shared = tokensA.filter((t) => tokensB.includes(t));
  const tokenScore = shared.length / Math.max(tokensA.length, tokensB.length, 1);

  if (a.includes(b) || b.includes(a)) {
    return Math.max(85, Math.round(tokenScore * 100));
  }
  return Math.round(tokenScore * 100);
}

// ============================================================================
// TYPES
// ============================================================================
export interface AuditCheck {
  id: string;
  number: number;
  title: string;
  citation: string;
  status: 'CLEAN' | 'WARNING' | 'CRITICAL';
  headline: string;
  lawyerNote: string;
  dealImpact: string;
}

export interface EvaluatedAsset extends SamplePatentRecord {
  overallRisk: 'CLEAN' | 'WARNING' | 'CRITICAL';
  primaryIssue: string;
  recommendedAction: string;
  checks: AuditCheck[];
  titleMatchPct: number;
  yearsRemaining: number;
  monthsRemaining: number;
  activeJurisdictionsCount: number;
}

export function evaluatePatentAsset(patent: SamplePatentRecord, targetCompany: string): EvaluatedAsset {
  const auditDate = new Date();
  const recordedOwner = patent.registeredProprietor || 'Unknown Recorded Proprietor';
  const similarity = computeSimilarity(recordedOwner, targetCompany);
  const epoStatusStr = String(patent.epoStatus || 'GRANTED_ACTIVE').toUpperCase();

  // 1. Chain of Title (Art. 72 & Rule 22 EPC)
  let check1Status: 'CLEAN' | 'WARNING' | 'CRITICAL' = 'CLEAN';
  let check1Headline = 'Verified Target Ownership';
  let check1LawyerNote = `Recorded proprietor "${recordedOwner}" matches target entity "${targetCompany}" (${similarity}% match).`;
  let check1Impact = 'Standard IP title warranty in SPA Section 4.14(a) is sufficient.';

  if (similarity < 70) {
    check1Status = 'CRITICAL';
    const isAcademic = patent.mismatchCategory === 'UNIVERSITY_UNRECORDED_ASSIGNMENT' || recordedOwner.includes('Universität') || recordedOwner.includes('Universitätsmedizin');
    const isFounder = patent.mismatchCategory === 'FOUNDER_PERSONAL_OWNERSHIP' || recordedOwner.includes('Dr.') || recordedOwner.includes('Vance');
    
    check1Headline = isAcademic ? 'Unrecorded University Transfer' : isFounder ? 'Founder Personal Ownership' : 'Chain of Title Mismatch';
    check1LawyerNote = `Title remains registered to "${recordedOwner}" rather than target "${targetCompany}". Under Art. 72 EPC, patent transfers require a formal written assignment deed, which must be recorded under Rule 22 EPC.`;
    check1Impact = 'Closing Condition Precedent (CP): Require executed Confirmatory Deed of Assignment and EPO Form 5055 recordal prior to closing.';
  } else if (similarity < 90) {
    check1Status = 'WARNING';
    check1Headline = 'Group Affiliate Variance';
    check1LawyerNote = `Recorded owner "${recordedOwner}" shares corporate root with "${targetCompany}" (${similarity}% similarity) but reflects a subsidiary or affiliate entity.`;
    check1Impact = 'Confirm proprietor is a 100% owned subsidiary within the transaction perimeter, or execute an intra-group confirmatory assignment.';
  }

  const check1: AuditCheck = {
    id: 'CHAIN_OF_TITLE',
    number: 1,
    title: 'Chain of Title & Ownership',
    citation: 'Art. 72 & Rule 22 EPC',
    status: check1Status,
    headline: check1Headline,
    lawyerNote: check1LawyerNote,
    dealImpact: check1Impact
  };

  // 2. Maintenance & Renewal Fees (Art. 86 EPC)
  const annuityYear = patent.annuityYear ?? 5;
  const annuityPaidThrough = patent.annuityPaidThrough || patent.nextAnnuityDueDate || '2026-12-31';
  const isLapsed = patent.annuityStatus === 'LAPSED_NON_PAYMENT' || epoStatusStr.includes('LAPSED');
  const inGrace = patent.annuityStatus === 'GRACE_PERIOD_SURCHARGE';

  let check2Status: 'CLEAN' | 'WARNING' | 'CRITICAL' = 'CLEAN';
  let check2Headline = `Year ${annuityYear} Paid & In Force`;
  let check2LawyerNote = `Annual renewal fee for Year ${annuityYear} is fully settled. Right is active and in force through ${annuityPaidThrough}.`;
  let check2Impact = 'No maintenance defect. Transfer upcoming docket deadlines to Buyer counsel at Closing.';

  if (isLapsed) {
    check2Status = 'CRITICAL';
    check2Headline = 'Lapsed / Dead Asset (Unpaid Fees)';
    check2LawyerNote = `Patent has ceased to have legal effect due to non-payment of Year ${annuityYear} renewal fees. The 6-month statutory grace period under Rule 51(2) EPC has expired.`;
    check2Impact = 'Remove asset from active IP schedule; reduce purchase price for loss of exclusivity.';
  } else if (inGrace) {
    check2Status = 'WARNING';
    check2Headline = 'Annuity Grace Period Open (Surcharge Due)';
    check2LawyerNote = `Year ${annuityYear} renewal fee is past its primary due date and currently in the 6-month statutory grace period requiring a 50% surcharge under Rule 51(2) EPC.`;
    check2Impact = 'Require Seller to settle overdue renewal plus 50% surcharge prior to Closing and provide official receipts.';
  }

  const check2: AuditCheck = {
    id: 'MAINTENANCE_FEES',
    number: 2,
    title: 'Maintenance & Renewal Status',
    citation: 'Art. 86 & Rule 51(2) EPC',
    status: check2Status,
    headline: check2Headline,
    lawyerNote: check2LawyerNote,
    dealImpact: check2Impact
  };

  // 3. Post-Grant Opposition & Disputes (Art. 99 EPC)
  const isOpposed =
    patent.oppositionStatus === 'ACTIVE_OPPOSITION_PROCEEDINGS' ||
    patent.oppositionStatus === 'OPPOSITION_FILED_PENDING' ||
    epoStatusStr.includes('OPPOSITION');
  const parsedGrantDate = patent.grantDate ? new Date(patent.grantDate) : null;
  const grantDateValid = parsedGrantDate && !isNaN(parsedGrantDate.getTime());
  const monthsSinceGrant = grantDateValid
    ? Math.max(0, Math.round((auditDate.getTime() - parsedGrantDate.getTime()) / (1000 * 60 * 60 * 24 * 30.4375)))
    : 12;
  const oppWindowOpen = !isOpposed && monthsSinceGrant < 9;
  const oppositionDetail = patent.oppositionDetail || 'Opposition proceedings flagged in patent register under Art. 99 EPC.';

  let check3Status: 'CLEAN' | 'WARNING' | 'CRITICAL' = 'CLEAN';
  let check3Headline = 'Opposition Window Closed Clean';
  let check3LawyerNote = `Statutory 9-month opposition period under Art. 99(1) EPC expired without any competitor filing. Central EPO validity is unchallengeable.`;
  let check3Impact = 'Central EPO revocation risk is extinguished.';

  if (isOpposed) {
    check3Status = 'CRITICAL';
    check3Headline = 'Active Opposition / Validity Challenge';
    check3LawyerNote = `Patent is currently contested under Art. 99 EPC before the EPO Opposition Division. ${oppositionDetail}`;
    check3Impact = 'Require Special Escrow Holdback (e.g. EUR 4.5M) and specific indemnity in SPA Section 9.02 pending final outcome.';
  } else if (oppWindowOpen) {
    check3Status = 'WARNING';
    check3Headline = `Within 9-Month Opposition Window (${monthsSinceGrant}m of 9m)`;
    check3LawyerNote = `European patent B1 grant was published ${monthsSinceGrant} months ago. Third parties may centrally challenge validity until the 9-month window expires.`;
    check3Impact = 'Include post-closing opposition monitoring covenant and validity representations in SPA.';
  }

  const check3: AuditCheck = {
    id: 'OPPOSITION_DISPUTE',
    number: 3,
    title: 'Post-Grant Opposition Standing',
    citation: 'Art. 99 & Art. 101 EPC',
    status: check3Status,
    headline: check3Headline,
    lawyerNote: check3LawyerNote,
    dealImpact: check3Impact
  };

  // 4. Territorial Coverage & Validation (Art. 65 EPC / Unitary Patent)
  const normalizedStates: DesignatedStateRecord[] = (patent.designatedStates || []).map((s: any) => {
    if (typeof s === 'string') {
      return {
        code: s,
        status: patent.unitaryPatent ? 'UNITARY_PATENT' : 'VALIDATED',
        nationalRef: `${s}${patent.id || ''}`,
        renewalPaid: !isLapsed
      };
    }
    return s;
  });
  const activeStates = normalizedStates.filter(s => s && (s.status === 'VALIDATED' || s.status === 'UNITARY_PATENT'));
  const stateCodes = activeStates.map(s => s.code);
  const isNarrow = !patent.unitaryPatent && activeStates.length < 3;

  let check4Status: 'CLEAN' | 'WARNING' | 'CRITICAL' = 'CLEAN';
  let check4Headline = patent.unitaryPatent ? 'Unitary Patent (17 EU Member States)' : `${activeStates.length} Key European Validations`;
  let check4LawyerNote = patent.unitaryPatent
    ? `Registered for Unitary Effect (UP) covering 17 EU Member States under Reg. 1257/2012, supplemented by national validations.`
    : `Maintained across ${activeStates.length} key contracting states (${stateCodes.join(', ')}).`;
  let check4Impact = 'Territorial protection aligns with core European markets.';

  if (isLapsed && activeStates.length === 0) {
    check4Status = 'CRITICAL';
    check4Headline = 'Zero Active Jurisdictions (Lapsed)';
    check4LawyerNote = 'All national validations have ceased to have legal effect due to unpaid maintenance fees.';
    check4Impact = 'Zero territorial exclusivity remaining.';
  } else if (isNarrow) {
    check4Status = 'WARNING';
    check4Headline = `Narrow Validation (${activeStates.length} State${activeStates.length === 1 ? '' : 's'}: ${stateCodes.join(', ')})`;
    check4LawyerNote = `European patent validated in only ${activeStates.length} country(ies) without Unitary Patent protection. Major markets (e.g. FR, GB, IT) were allowed to lapse.`;
    check4Impact = 'Verify whether narrow footprint matches Target’s manufacturing and customer distribution base.';
  }

  const check4: AuditCheck = {
    id: 'TERRITORIAL_COVERAGE',
    number: 4,
    title: 'Territorial Scope & Validation',
    citation: 'Art. 65 EPC / Reg. 1257/2012',
    status: check4Status,
    headline: check4Headline,
    lawyerNote: check4LawyerNote,
    dealImpact: check4Impact
  };

  // 5. Remaining Statutory Term (Art. 63(1) EPC)
  const parsedFilingDate = patent.filingDate ? new Date(patent.filingDate) : new Date('2020-01-01');
  const filingDate = isNaN(parsedFilingDate.getTime()) ? new Date('2020-01-01') : parsedFilingDate;
  const expDate = new Date(filingDate);
  expDate.setFullYear(expDate.getFullYear() + 20);
  const diffMs = expDate.getTime() - auditDate.getTime();
  const monthsRemaining = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24 * 30.4375)));
  const yearsRemaining = Number((monthsRemaining / 12).toFixed(1));
  const expIso = !isNaN(expDate.getTime()) ? expDate.toISOString().slice(0, 10) : '2040-01-01';

  let check5Status: 'CLEAN' | 'WARNING' | 'CRITICAL' = 'CLEAN';
  let check5Headline = `${yearsRemaining} Years Remaining (Expires ${expIso})`;
  let check5LawyerNote = `${yearsRemaining} years (${monthsRemaining} months) of 20-year statutory patent runway remain under Art. 63(1) EPC.`;
  let check5Impact = 'Healthy exclusivity runway supports transaction valuation.';

  if (monthsRemaining <= 0) {
    check5Status = 'CRITICAL';
    check5Headline = 'Expired Statutory Term';
    check5LawyerNote = '20-year statutory term from filing date has expired. Asset is in public domain.';
    check5Impact = 'Assign zero terminal exclusivity value.';
  } else if (yearsRemaining < 3.0) {
    check5Status = 'WARNING';
    check5Headline = `Near-Term Expiry (${yearsRemaining}y / ${monthsRemaining}m Left)`;
    check5LawyerNote = `Fewer than 3 years of patent life remain. As a medical technology device, it is ineligible for SPC extension.`;
    check5Impact = 'Step down post-expiration gross margins in DCF financial valuation model.';
  }

  const check5: AuditCheck = {
    id: 'REMAINING_TERM',
    number: 5,
    title: '20-Year Statutory Term Runway',
    citation: 'Art. 63(1) EPC',
    status: check5Status,
    headline: check5Headline,
    lawyerNote: check5LawyerNote,
    dealImpact: check5Impact
  };

  const checks = [check1, check2, check3, check4, check5];
  const criticals = checks.filter(c => c.status === 'CRITICAL');
  const warnings = checks.filter(c => c.status === 'WARNING');

  let overallRisk: 'CLEAN' | 'WARNING' | 'CRITICAL' = 'CLEAN';
  let primaryIssue = 'All 5 Statutory Checks Verified Clean';
  let recommendedAction = 'Standard Warranty (Schedule 3.14a)';

  if (criticals.length > 0) {
    overallRisk = 'CRITICAL';
    primaryIssue = criticals[0].headline;
    recommendedAction = criticals[0].id === 'CHAIN_OF_TITLE'
      ? 'Condition Precedent: Art. 72 Assignment'
      : criticals[0].id === 'OPPOSITION_DISPUTE'
      ? 'Special Escrow Holdback & Indemnity'
      : 'Exclude Asset / Purchase Price Cut';
  } else if (warnings.length > 0) {
    overallRisk = 'WARNING';
    primaryIssue = warnings[0].headline;
    recommendedAction = warnings[0].id === 'MAINTENANCE_FEES'
      ? 'Closing Deliverable: Settle Surcharge'
      : warnings[0].id === 'OPPOSITION_DISPUTE'
      ? 'Post-Closing Competitor Watch Covenant'
      : 'Verify Territory Footprint in Model';
  }

  return {
    ...patent,
    overallRisk,
    primaryIssue,
    recommendedAction,
    checks,
    titleMatchPct: similarity,
    yearsRemaining,
    monthsRemaining,
    activeJurisdictionsCount: patent.unitaryPatent ? 17 : activeStates.length
  };
}

// ============================================================================
// ============================================================================
// CONTEXT & AUDIT HISTORY
// ============================================================================
export interface SavedAuditRecord {
  id: string;
  name: string;
  targetCompany: string;
  createdAt: string;
  portfolioData: SamplePatentRecord[];
  metrics: {
    total: number;
    critical: number;
    warning: number;
    clean: number;
    cleanPct: number;
  };
}

interface DealContextType {
  targetCompany: string;
  setTargetCompany: (name: string) => void;
  portfolioData: SamplePatentRecord[];
  setPortfolioData: (patents: SamplePatentRecord[]) => void;
  evaluatedPortfolio: EvaluatedAsset[];
  metrics: {
    total: number;
    critical: number;
    warning: number;
    clean: number;
    cleanPct: number;
  };
  downloadCsv: () => void;
  resetToShowcase: () => void;
  clearDeal: () => void;
  isDealLoaded: boolean;
  activeAuditId: string | null;
  savedAudits: SavedAuditRecord[];
  saveAuditRecord: (target: string, patents: SamplePatentRecord[], customName?: string) => string;
  loadSavedAudit: (id: string) => void;
  renameSavedAudit: (id: string, newName: string) => void;
  deleteSavedAudit: (id: string) => void;
  clearAllSavedAudits: () => void;
}

const DealContext = createContext<DealContextType | undefined>(undefined);

export function DealProvider({ children }: { children: React.ReactNode }) {
  const [targetCompany, setTargetCompany] = useState<string>('');
  const [portfolioData, setPortfolioData] = useState<SamplePatentRecord[]>([]);
  const [activeAuditId, setActiveAuditId] = useState<string | null>(null);
  const [savedAudits, setSavedAudits] = useState<SavedAuditRecord[]>([]);

  // Load saved audit history from localStorage on initial client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('vanguard_saved_audits_v1');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setSavedAudits(parsed);
          }
        }
      } catch (err) {
        console.error('Failed to parse saved audits from localStorage', err);
      }
    }
  }, []);

  const persistAudits = (audits: SavedAuditRecord[]) => {
    setSavedAudits(audits);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('vanguard_saved_audits_v1', JSON.stringify(audits));
      } catch (err) {
        console.error('Failed to persist audits to localStorage', err);
      }
    }
  };

  const isDealLoaded = Boolean(targetCompany && portfolioData.length > 0);

  const evaluatedPortfolio = useMemo(() => {
    return portfolioData.map((p) => evaluatePatentAsset(p, targetCompany));
  }, [portfolioData, targetCompany]);

  const metrics = useMemo(() => {
    const total = evaluatedPortfolio.length;
    const critical = evaluatedPortfolio.filter((p) => p.overallRisk === 'CRITICAL').length;
    const warning = evaluatedPortfolio.filter((p) => p.overallRisk === 'WARNING').length;
    const clean = evaluatedPortfolio.filter((p) => p.overallRisk === 'CLEAN').length;
    const cleanPct = total > 0 ? Math.round((clean / total) * 100) : 0;
    return { total, critical, warning, clean, cleanPct };
  }, [evaluatedPortfolio]);

  const saveAuditRecord = (target: string, patents: SamplePatentRecord[], customName?: string): string => {
    if (!target || patents.length === 0) return '';
    const evaluated = patents.map((p) => evaluatePatentAsset(p, target));
    const total = evaluated.length;
    const critical = evaluated.filter((p) => p.overallRisk === 'CRITICAL').length;
    const warning = evaluated.filter((p) => p.overallRisk === 'WARNING').length;
    const clean = evaluated.filter((p) => p.overallRisk === 'CLEAN').length;
    const cleanPct = total > 0 ? Math.round((clean / total) * 100) : 0;

    const newId = `audit_${Date.now()}`;
    const defaultName = customName || `${target} Diligence Scan`;
    const newRecord: SavedAuditRecord = {
      id: newId,
      name: defaultName,
      targetCompany: target,
      createdAt: new Date().toISOString(),
      portfolioData: patents,
      metrics: { total, critical, warning, clean, cleanPct }
    };

    const updated = [newRecord, ...savedAudits.filter((a) => a.id !== newId)];
    persistAudits(updated);
    setActiveAuditId(newId);
    return newId;
  };

  const loadSavedAudit = (id: string) => {
    const audit = savedAudits.find((a) => a.id === id);
    if (audit) {
      setTargetCompany(audit.targetCompany);
      setPortfolioData(audit.portfolioData);
      setActiveAuditId(audit.id);
    }
  };

  const renameSavedAudit = (id: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const updated = savedAudits.map((a) => (a.id === id ? { ...a, name: trimmed } : a));
    persistAudits(updated);
  };

  const deleteSavedAudit = (id: string) => {
    const updated = savedAudits.filter((a) => a.id !== id);
    persistAudits(updated);
    if (activeAuditId === id) {
      setActiveAuditId(null);
    }
  };

  const clearAllSavedAudits = () => {
    persistAudits([]);
    setActiveAuditId(null);
  };

  const resetToShowcase = () => {
    setTargetCompany(DEFAULT_TARGET_COMPANY);
    setPortfolioData(SAMPLE_MA_PATENTS);
    saveAuditRecord(DEFAULT_TARGET_COMPANY, SAMPLE_MA_PATENTS, 'Project Aetheris — MedTech Showcase');
  };

  const clearDeal = () => {
    setTargetCompany('');
    setPortfolioData([]);
    setActiveAuditId(null);
  };

  const downloadCsv = () => {
    if (evaluatedPortfolio.length === 0) return;
    const headers = [
      'Schedule_Ref',
      'Patent_ID',
      'Application_No',
      'Title',
      'Registered_Proprietor',
      'Target_Entity',
      'Due_Diligence_Rating',
      'Primary_Finding',
      'Recommended_SPA_Remedy',
      'Remaining_Term_Years',
      'Unitary_Patent'
    ];

    const rows = evaluatedPortfolio.map((p, idx) => [
      `3.14(a)-${String(idx + 1).padStart(2, '0')}`,
      p.id || '',
      p.applicationNumber || '',
      `"${(p.title || '').replace(/"/g, '""')}"`,
      `"${(p.registeredProprietor || '').replace(/"/g, '""')}"`,
      `"${(targetCompany || '').replace(/"/g, '""')}"`,
      p.overallRisk,
      `"${(p.primaryIssue || '').replace(/"/g, '""')}"`,
      `"${(p.recommendedAction || '').replace(/"/g, '""')}"`,
      p.yearsRemaining,
      p.unitaryPatent ? 'Yes' : 'No'
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SPA_Schedule_3.14_${(targetCompany || 'Target').replace(/\s+/g, '_')}_IP_Audit.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DealContext.Provider
      value={{
        targetCompany,
        setTargetCompany,
        portfolioData,
        setPortfolioData,
        evaluatedPortfolio,
        metrics,
        downloadCsv,
        resetToShowcase,
        clearDeal,
        isDealLoaded,
        activeAuditId,
        savedAudits,
        saveAuditRecord,
        loadSavedAudit,
        renameSavedAudit,
        deleteSavedAudit,
        clearAllSavedAudits
      }}
    >
      {children}
    </DealContext.Provider>
  );
}

export function useDeal() {
  const context = useContext(DealContext);
  if (!context) {
    throw new Error('useDeal must be used within a DealProvider');
  }
  return context;
}

