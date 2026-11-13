"use client";

import React, { useState, useMemo } from 'react';
import {
  Scale,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  Search,
  Building2,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Copy,
  Check,
  Upload,
  Download,
  Gavel,
  Filter,
  ExternalLink,
  Layers,
  Info,
  X,
  Sparkles,
  Briefcase,
  Calendar,
  ArrowUpRight,
  Printer,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
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
// STATUTORY DUE DILIGENCE EVALUATOR
// ============================================================================
interface AuditCheck {
  id: string;
  number: number;
  title: string;
  citation: string;
  status: 'CLEAN' | 'WARNING' | 'CRITICAL';
  headline: string;
  lawyerNote: string;
  dealImpact: string;
}

interface EvaluatedAsset extends SamplePatentRecord {
  overallRisk: 'CLEAN' | 'WARNING' | 'CRITICAL';
  primaryIssue: string;
  recommendedAction: string;
  checks: AuditCheck[];
  titleMatchPct: number;
  yearsRemaining: number;
  monthsRemaining: number;
  activeJurisdictionsCount: number;
}

function evaluatePatentAsset(patent: SamplePatentRecord, targetCompany: string): EvaluatedAsset {
  const auditDate = new Date();
  const recordedOwner = patent.registeredProprietor;
  const similarity = computeSimilarity(recordedOwner, targetCompany);

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
  const isLapsed = patent.annuityStatus === 'LAPSED_NON_PAYMENT' || patent.epoStatus.includes('LAPSED');
  const inGrace = patent.annuityStatus === 'GRACE_PERIOD_SURCHARGE';

  let check2Status: 'CLEAN' | 'WARNING' | 'CRITICAL' = 'CLEAN';
  let check2Headline = `Year ${patent.annuityYear} Paid & In Force`;
  let check2LawyerNote = `Annual renewal fee for Year ${patent.annuityYear} is fully settled. Right is active and in force through ${patent.annuityPaidThrough}.`;
  let check2Impact = 'No maintenance defect. Transfer upcoming docket deadlines to Buyer counsel at Closing.';

  if (isLapsed) {
    check2Status = 'CRITICAL';
    check2Headline = 'Lapsed / Dead Asset (Unpaid Fees)';
    check2LawyerNote = `Patent has ceased to have legal effect due to non-payment of Year ${patent.annuityYear} renewal fees. The 6-month statutory grace period under Rule 51(2) EPC has expired.`;
    check2Impact = 'Remove asset from active IP schedule; reduce purchase price for loss of exclusivity.';
  } else if (inGrace) {
    check2Status = 'WARNING';
    check2Headline = 'Annuity Grace Period Open (Surcharge Due)';
    check2LawyerNote = `Year ${patent.annuityYear} renewal fee is past its primary due date and currently in the 6-month statutory grace period requiring a 50% surcharge under Rule 51(2) EPC.`;
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
  const isOpposed = patent.oppositionStatus === 'ACTIVE_OPPOSITION_PROCEEDINGS' || patent.epoStatus.includes('OPPOSITION');
  const grantDate = new Date(patent.grantDate);
  const monthsSinceGrant = Math.max(0, Math.round((auditDate.getTime() - grantDate.getTime()) / (1000 * 60 * 60 * 24 * 30.4375)));
  const oppWindowOpen = !isOpposed && monthsSinceGrant < 9;

  let check3Status: 'CLEAN' | 'WARNING' | 'CRITICAL' = 'CLEAN';
  let check3Headline = 'Opposition Window Closed Clean';
  let check3LawyerNote = `Statutory 9-month opposition period under Art. 99(1) EPC expired without any competitor filing. Central EPO validity is unchallengeable.`;
  let check3Impact = 'Central EPO revocation risk is extinguished.';

  if (isOpposed) {
    check3Status = 'CRITICAL';
    check3Headline = 'Active Opposition / Validity Challenge';
    check3LawyerNote = `Patent is currently contested under Art. 99 EPC before the EPO Opposition Division. ${patent.oppositionDetail}`;
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
  const activeStates = (patent.designatedStates || []).filter(s => s.status === 'VALIDATED' || s.status === 'UNITARY_PATENT');
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
  const filingDate = new Date(patent.filingDate);
  const expDate = new Date(filingDate);
  expDate.setFullYear(expDate.getFullYear() + 20);
  const diffMs = expDate.getTime() - auditDate.getTime();
  const monthsRemaining = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24 * 30.4375)));
  const yearsRemaining = Number((monthsRemaining / 12).toFixed(1));

  let check5Status: 'CLEAN' | 'WARNING' | 'CRITICAL' = 'CLEAN';
  let check5Headline = `${yearsRemaining} Years Remaining (Expires ${expDate.toISOString().slice(0, 10)})`;
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
// MAIN EXECUTIVE INTERFACE
// ============================================================================
export default function VanguardIpAuditApp() {
  const [targetCompany, setTargetCompany] = useState<string>(DEFAULT_TARGET_COMPANY);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState(DEFAULT_TARGET_COMPANY);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'CLEAN'>('ALL');
  
  const [selectedAsset, setSelectedAsset] = useState<EvaluatedAsset | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Evaluate all 12 sample patents against the active target company
  const evaluatedPortfolio = useMemo(() => {
    return SAMPLE_MA_PATENTS.map((p) => evaluatePatentAsset(p, targetCompany));
  }, [targetCompany]);

  // Filtered portfolio for table
  const displayedAssets = useMemo(() => {
    return evaluatedPortfolio.filter((item) => {
      const matchesFilter = statusFilter === 'ALL' || item.overallRisk === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.registeredProprietor.toLowerCase().includes(q) ||
        item.productLine.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [evaluatedPortfolio, statusFilter, searchQuery]);

  // Key Transaction Metrics
  const metrics = useMemo(() => {
    const total = evaluatedPortfolio.length;
    const critical = evaluatedPortfolio.filter((p) => p.overallRisk === 'CRITICAL').length;
    const warning = evaluatedPortfolio.filter((p) => p.overallRisk === 'WARNING').length;
    const clean = evaluatedPortfolio.filter((p) => p.overallRisk === 'CLEAN').length;
    const cleanPct = Math.round((clean / total) * 100);
    return { total, critical, warning, clean, cleanPct };
  }, [evaluatedPortfolio]);

  const handleOpenAsset = (asset: EvaluatedAsset) => {
    setSelectedAsset(asset);
    setDrawerOpen(true);
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadCsv = () => {
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
      p.id,
      p.applicationNumber,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.registeredProprietor.replace(/"/g, '""')}"`,
      `"${targetCompany.replace(/"/g, '""')}"`,
      p.overallRisk,
      `"${p.primaryIssue.replace(/"/g, '""')}"`,
      `"${p.recommendedAction.replace(/"/g, '""')}"`,
      p.yearsRemaining,
      p.unitaryPatent ? 'Yes' : 'No'
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SPA_Schedule_3.14_${targetCompany.replace(/\s+/g, '_')}_IP_Audit.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* =====================================================================
          1. TOP EXECUTIVE HEADER
      ====================================================================== */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Scale className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                  Vanguard IP Audit
                </h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  M&amp;A Due Diligence
                </span>
              </div>
              <p className="text-xs text-slate-600 hidden sm:block">
                Automated European Patent Convention (EPC) Statutory Risk &amp; Chain-of-Title Auditor
              </p>
            </div>
          </div>

          {/* Primary Executive Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">New Audit / Upload</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition cursor-pointer"
              title="Download structured spreadsheet for Share Purchase Agreement Schedule 3.14"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Export CSV (Schedule 3.14)</span>
            </button>

            <button
              onClick={() => setShowMemoModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Generate Executive Memo (PDF)</span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          2. TRANSACTION CONTEXT & KPI DASHBOARD
      ====================================================================== */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Deal Context Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>Active M&amp;A Transaction File</span>
              <span>•</span>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Reference Date: November 2026</span>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-slate-700">Target Legal Entity:</span>
              {isEditingTarget ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={targetInput}
                    onChange={(e) => setTargetInput(e.target.value)}
                    className="px-2.5 py-1 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                    placeholder="Enter Target Legal Name..."
                  />
                  <button
                    onClick={() => {
                      setTargetCompany(targetInput.trim() || DEFAULT_TARGET_COMPANY);
                      setIsEditingTarget(false);
                    }}
                    className="px-2.5 py-1 text-xs font-bold bg-slate-900 text-white rounded-md"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setTargetInput(targetCompany);
                      setIsEditingTarget(false);
                    }}
                    className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setTargetInput(targetCompany);
                    setIsEditingTarget(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm border border-slate-300 transition"
                  title="Click to edit target entity name to test live Chain-of-Title matching"
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{targetCompany}</span>
                  <span className="text-[10px] text-slate-400 font-normal underline ml-1">Edit</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 self-start md:self-auto">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span><strong>Statutory Standard:</strong> EPC Articles 63, 65, 72, 86, 99 &amp; UP Reg. 1257/2012</span>
            </div>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Portfolio */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Portfolio</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{metrics.total}</div>
              <div className="text-xs text-slate-600 mt-1">Disclosed European Patents</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Layers className="w-6 h-6 text-slate-600" />
            </div>
          </div>

          {/* Card 2: Critical Red Flags */}
          <div className="bg-white border border-rose-200 bg-linear-to-b from-rose-50/30 to-white rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Critical Red Flags</span>
              </div>
              <div className="text-3xl font-extrabold text-rose-900 mt-1">{metrics.critical}</div>
              <div className="text-xs text-rose-700 font-medium mt-1">Require Closing CP / Escrow</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-rose-600" />
            </div>
          </div>

          {/* Card 3: Material Warnings */}
          <div className="bg-white border border-amber-200 bg-linear-to-b from-amber-50/30 to-white rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Material Warnings</span>
              </div>
              <div className="text-3xl font-extrabold text-amber-950 mt-1">{metrics.warning}</div>
              <div className="text-xs text-amber-800 font-medium mt-1">Require Specific Indemnity</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
          </div>

          {/* Card 4: Verified Clean */}
          <div className="bg-white border border-emerald-200 bg-linear-to-b from-emerald-50/30 to-white rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Good Standing</span>
              </div>
              <div className="text-3xl font-extrabold text-emerald-950 mt-1">{metrics.clean}</div>
              <div className="text-xs text-emerald-800 font-medium mt-1">
                {metrics.cleanPct}% Clean Title Runway
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* =====================================================================
            3. AUDIT SCHEDULE TABLE
        ====================================================================== */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {/* Controls Bar: Search & Filter Pills */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  statusFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Assets ({metrics.total})
              </button>
              <button
                onClick={() => setStatusFilter('CRITICAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === 'CRITICAL'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-rose-700 hover:bg-rose-100/60'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-300"></span>
                Critical Red Flags ({metrics.critical})
              </button>
              <button
                onClick={() => setStatusFilter('WARNING')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === 'WARNING'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-amber-800 hover:bg-amber-100/60'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span>
                Warnings ({metrics.warning})
              </button>
              <button
                onClick={() => setStatusFilter('CLEAN')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === 'CLEAN'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-emerald-800 hover:bg-emerald-100/60'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                Good Standing ({metrics.clean})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patent, title, owner..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3 px-4">Patent Ref</th>
                  <th className="py-3 px-4">Invention &amp; Product Line</th>
                  <th className="py-3 px-4">Ownership Standing</th>
                  <th className="py-3 px-4">Legal Finding &amp; Statutory Risk</th>
                  <th className="py-3 px-4">Recommended M&amp;A Remedy</th>
                  <th className="py-3 px-4 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedAssets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No patent assets matched your current search and filter criteria.
                    </td>
                  </tr>
                ) : (
                  displayedAssets.map((asset) => {
                    const isCritical = asset.overallRisk === 'CRITICAL';
                    const isWarning = asset.overallRisk === 'WARNING';
                    const isClean = asset.overallRisk === 'CLEAN';

                    return (
                      <tr
                        key={asset.id}
                        onClick={() => handleOpenAsset(asset)}
                        className="hover:bg-slate-50/80 transition cursor-pointer group"
                      >
                        {/* Patent ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span>{asset.id}</span>
                            {asset.unitaryPatent && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                UP
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-normal text-slate-400 font-sans mt-0.5">
                            App: {asset.applicationNumber}
                          </div>
                        </td>

                        {/* Title & Product */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-semibold text-slate-900 line-clamp-1 group-hover:text-slate-950">
                            {asset.title}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            <span>{asset.productLine}</span>
                          </div>
                        </td>

                        {/* Ownership Standing */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex items-center gap-1.5 font-medium text-slate-800">
                            {asset.titleMatchPct >= 90 ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : asset.titleMatchPct >= 70 ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            )}
                            <span className="truncate">{asset.registeredProprietor}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Match: <strong>{asset.titleMatchPct}%</strong> with Target Entity
                          </div>
                        </td>

                        {/* Legal Finding */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                isCritical
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : isWarning
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {asset.primaryIssue}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                            {asset.checks.find((c) => c.status === asset.overallRisk)?.citation || 'Statutory EPC Check'}
                          </div>
                        </td>

                        {/* Recommended Remedy */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`font-semibold text-xs ${
                              isCritical
                                ? 'text-rose-700 font-bold'
                                : isWarning
                                ? 'text-amber-800 font-bold'
                                : 'text-slate-600'
                            }`}
                          >
                            {asset.recommendedAction}
                          </span>
                        </td>

                        {/* Review Action */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-700 font-bold text-xs transition"
                          >
                            <span>Dossier</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* =====================================================================
          4. ASSET REVIEW SLIDE-OVER DRAWER
      ====================================================================== */}
      {drawerOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div
            className="w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50/50">
              <div className="space-y-1.5 max-w-lg">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-extrabold text-slate-900">
                    {selectedAsset.id}
                  </span>
                  {selectedAsset.unitaryPatent && (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      Unitary Patent (UP)
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      selectedAsset.overallRisk === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : selectedAsset.overallRisk === 'WARNING'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {selectedAsset.overallRisk === 'CRITICAL'
                      ? 'Critical Red Flag'
                      : selectedAsset.overallRisk === 'WARNING'
                      ? 'Material Warning'
                      : 'Verified Clean'}
                  </span>
                </div>
                <h2 className="text-sm font-bold text-slate-900 leading-snug">
                  {selectedAsset.title}
                </h2>
                <div className="text-xs text-slate-500 font-medium flex items-center gap-3">
                  <span>Product: <strong>{selectedAsset.productLine}</strong></span>
                  <span>•</span>
                  <span>Revenue: <strong>{selectedAsset.revenueAttributionPct}%</strong></span>
                </div>
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* SPA Remediation Clause Box */}
              <div className="rounded-xl border border-slate-300 bg-slate-50 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Gavel className="w-4 h-4 text-slate-700" />
                    <span>Recommended SPA Contract Remediation</span>
                  </div>
                  <button
                    onClick={() => handleCopyText(selectedAsset.spaRemediationClause, 'DRAWER_CLAUSE')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 shadow-2xs transition"
                  >
                    {copiedKey === 'DRAWER_CLAUSE' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied to Clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy Draft Clause</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-mono bg-white p-3 rounded-lg border border-slate-200">
                  {selectedAsset.spaRemediationClause}
                </p>
              </div>

              {/* 5 Statutory EPC Due Diligence Checks */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Statutory 5-Pillar Due Diligence Scorecard
                </h3>

                <div className="space-y-2.5">
                  {selectedAsset.checks.map((check) => {
                    const isPass = check.status === 'CLEAN';
                    const isWarn = check.status === 'WARNING';
                    const isFail = check.status === 'CRITICAL';

                    return (
                      <div
                        key={check.id}
                        className={`rounded-xl p-4 border transition ${
                          isFail
                            ? 'bg-rose-50/50 border-rose-200'
                            : isWarn
                            ? 'bg-amber-50/50 border-amber-200'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {isPass ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : isWarn ? (
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                            <div>
                              <div className="font-bold text-xs text-slate-900">
                                {check.number}. {check.title}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {check.citation}
                              </div>
                            </div>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              isPass
                                ? 'bg-emerald-100 text-emerald-800'
                                : isWarn
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {check.headline}
                          </span>
                        </div>

                        <div className="mt-2 text-xs text-slate-700 leading-relaxed">
                          {check.lawyerNote}
                        </div>

                        <div className="mt-2 pt-2 border-t border-slate-200/60 text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">Deal Action:</span>
                          <span>{check.dealImpact}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legal Timeline Events */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  INPADOC Legal History Timeline
                </h3>
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                  {selectedAsset.inpadocEvents.map((evt, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <span className="font-mono text-[11px] font-bold text-slate-500 w-24 shrink-0">
                        {evt.date}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">{evt.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono">Ref: {evt.ref}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. EXECUTIVE MEMORANDUM MODAL (Print / PDF)
      ====================================================================== */}
      {showMemoModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white">
          <div
            className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden print:border-none print:shadow-none print:rounded-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Controls (Hidden in Print) */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Print-Formatted Executive Due Diligence Memorandum</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => setShowMemoModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Law Firm Memo Content */}
            <div className="p-8 sm:p-12 space-y-8 font-serif text-slate-900 leading-relaxed text-sm">
              {/* Memo Letterhead */}
              <div className="border-b-2 border-slate-900 pb-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold font-sans tracking-tight text-slate-950 uppercase">
                      CONFIDENTIAL M&amp;A IP DUE DILIGENCE MEMORANDUM
                    </h1>
                    <p className="text-xs font-sans text-slate-500 mt-0.5">
                      European Patent Convention (EPC) Statutory Portfolio Audit
                    </p>
                  </div>
                  <div className="text-right text-xs font-sans text-slate-500">
                    <div><strong>Date:</strong> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    <div><strong>Ref:</strong> VDR-3.14-AUDIT</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-sans bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500">Target Company:</span>
                    <div className="font-bold text-slate-900 text-sm">{targetCompany}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Audited Schedule:</span>
                    <div className="font-bold text-slate-900 text-sm">Schedule 3.14 (Registered Intellectual Property)</div>
                  </div>
                </div>
              </div>

              {/* Memo Executive Summary */}
              <div className="space-y-3">
                <h2 className="text-base font-bold font-sans text-slate-950 uppercase tracking-wider">
                  1. Executive Summary &amp; Key Findings
                </h2>
                <p className="text-xs leading-relaxed font-sans text-slate-700">
                  We have completed an automated European patent statutory due diligence review of the <strong>{metrics.total} disclosed European patent assets</strong> listed under Schedule 3.14 for the proposed acquisition of <strong>{targetCompany}</strong>. 
                  Assets were audited against European Patent Office (EPO) Register data across five statutory pillars: Chain of Title (Art. 72 EPC), Annuity Maintenance (Art. 86 EPC), Post-Grant Opposition Status (Art. 99 EPC), Territorial Validation (Art. 65 EPC / UP), and 20-Year Statutory Term Runway (Art. 63(1) EPC).
                </p>

                {/* Score Summary Box */}
                <div className="grid grid-cols-3 gap-3 font-sans text-center">
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
                    <div className="text-2xl font-bold text-rose-800">{metrics.critical}</div>
                    <div className="text-xs text-rose-700 font-semibold">Critical Red Flags</div>
                    <div className="text-[10px] text-rose-600">Require Closing CPs / Escrow</div>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="text-2xl font-bold text-amber-900">{metrics.warning}</div>
                    <div className="text-xs text-amber-800 font-semibold">Material Warnings</div>
                    <div className="text-[10px] text-amber-700">Require Specific Representations</div>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="text-2xl font-bold text-emerald-900">{metrics.clean}</div>
                    <div className="text-xs text-emerald-800 font-semibold">Verified Clean Title</div>
                    <div className="text-[10px] text-emerald-700">{metrics.cleanPct}% of Disclosed Portfolio</div>
                  </div>
                </div>
              </div>

              {/* Itemized Red Flags Schedule */}
              <div className="space-y-4">
                <h2 className="text-base font-bold font-sans text-slate-950 uppercase tracking-wider">
                  2. Schedule of Actionable Red Flags &amp; SPA Remedies
                </h2>

                <div className="space-y-3 font-sans">
                  {evaluatedPortfolio
                    .filter((p) => p.overallRisk !== 'CLEAN')
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {item.id} — {item.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                              item.overallRisk === 'CRITICAL'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.overallRisk}
                          </span>
                        </div>
                        <div className="text-slate-600">
                          <strong>Finding:</strong> {item.primaryIssue}. Recorded proprietor: <em>"{item.registeredProprietor}"</em>.
                        </div>
                        <div className="p-2.5 rounded bg-white border border-slate-300 font-mono text-[11px] text-slate-800">
                          <strong>SPA Remedy:</strong> {item.spaRemediationClause}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="pt-6 border-t border-slate-200 text-[11px] font-sans text-slate-400 leading-relaxed">
                <strong>LEGAL DISCLAIMER:</strong> This memorandum is an automated preliminary decision-support deliverable generated by Vanguard IP Audit. It does not constitute a certified European Patent Register extract or formal legal opinion. Binding M&amp;A transaction documents should be cross-verified by qualified European Patent Attorneys.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          6. NEW AUDIT / CSV UPLOAD MODAL
      ====================================================================== */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-slate-700" />
                <h3 className="font-bold text-sm text-slate-900">New Transaction Audit</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Company Legal Name</label>
                <input
                  type="text"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  placeholder="e.g. Aetheris MedTech GmbH"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Preset M&amp;A Portfolio Demonstrations
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => {
                      setTargetCompany('Aetheris MedTech GmbH');
                      setTargetInput('Aetheris MedTech GmbH');
                      setShowUploadModal(false);
                    }}
                    className="p-3 text-left rounded-xl border border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100/50 transition cursor-pointer"
                  >
                    <div className="font-bold text-slate-900">Aetheris MedTech GmbH (Recommended Showcase)</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      12 European patents showcasing unrecorded university transfers, founder personal ownership, lapsed renewal fees, and pending oppositions.
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setTargetCompany('Bavaria BioPharma AG');
                      setTargetInput('Bavaria BioPharma AG');
                      setShowUploadModal(false);
                    }}
                    className="p-3 text-left rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <div className="font-bold text-slate-900">Bavaria BioPharma AG (Test Alternate Entity)</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Tests live Chain-of-Title recalculation against an alternate target entity name.
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setTargetCompany(targetInput.trim() || DEFAULT_TARGET_COMPANY);
                    setShowUploadModal(false);
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-xs"
                >
                  Apply &amp; Refresh Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
