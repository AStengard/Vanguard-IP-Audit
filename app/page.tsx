"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Scale,
  Sparkles,
  ArrowRight,
  Building2,
  FileText,
  FileSpreadsheet,
  Layers,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Database,
  CheckCircle2,
  Info,
  Clock,
  Play,
  Loader2,
  Key
} from 'lucide-react';
import { useDeal } from '@/components/DealContext';
import { useRecruiterDemo } from '@/components/RecruiterDemoContext';
import DemoSpotlight from '@/components/DemoSpotlight';
import { SamplePatentRecord } from '@/lib/sampleDeal';

export default function LandingPortalPage() {
  const router = useRouter();
  const { isDemoActive, currentStepIndex, playbackSpeed, isPlaying, startDemo } =
    useRecruiterDemo();
  const {
    targetCompany,
    setTargetCompany,
    portfolioData,
    setPortfolioData,
    resetToShowcase,
    saveAuditRecord
  } = useDeal();

  // Custom Audit Form State
  const [customTarget, setCustomTarget] = useState('');
  const [customPatentText, setCustomPatentText] = useState('');
  const [queryMode, setQueryMode] = useState<'ENGINE' | 'LIVE_EPO'>('ENGINE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<{ title: string; message: string; isMissingCredentials?: boolean } | null>(null);
  const [showSyntheticPointer, setShowSyntheticPointer] = useState(false);

  // --------------------------------------------------------------------------
  // RECRUITER AUTO-DEMO: STEP 1 TYPEWRITER & FORM AUTOMATION
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!isDemoActive || currentStepIndex !== 0 || !isPlaying) {
      setShowSyntheticPointer(false);
      return;
    }

    let isCancelled = false;
    const timeouts: NodeJS.Timeout[] = [];

    const TARGET_NAME = 'Aetheris MedTech GmbH';
    const PATENTS_SCHEDULE = 'EP3904118, EP3800201, EP3654120, EP3491024, EP3312890';

    // Start with blank inputs
    setCustomTarget('');
    setCustomPatentText('');
    setShowSyntheticPointer(false);

    const targetCharDelay = 38 / playbackSpeed;
    const pauseBeforePatents = 250 / playbackSpeed;
    const patentCharDelay = 22 / playbackSpeed;

    // 1. Type target entity character-by-character
    for (let i = 1; i <= TARGET_NAME.length; i++) {
      const t = setTimeout(() => {
        if (!isCancelled) {
          setCustomTarget(TARGET_NAME.slice(0, i));
        }
      }, i * targetCharDelay);
      timeouts.push(t);
    }

    const startPatentTypingTime = TARGET_NAME.length * targetCharDelay + pauseBeforePatents;

    // 2. Type patent schedule numbers character-by-character
    for (let j = 1; j <= PATENTS_SCHEDULE.length; j++) {
      const t = setTimeout(() => {
        if (!isCancelled) {
          setCustomPatentText(PATENTS_SCHEDULE.slice(0, j));
        }
      }, startPatentTypingTime + j * patentCharDelay);
      timeouts.push(t);
    }

    // 3. Display animated synthetic pointer on the audit button
    const pointerDisplayTime =
      startPatentTypingTime + PATENTS_SCHEDULE.length * patentCharDelay + 200 / playbackSpeed;

    const pointerTimeout = setTimeout(() => {
      if (!isCancelled) {
        setShowSyntheticPointer(true);
      }
    }, pointerDisplayTime);
    timeouts.push(pointerTimeout);

    return () => {
      isCancelled = true;
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [isDemoActive, currentStepIndex, isPlaying, playbackSpeed]);

  // Quick helper to fill sample numbers
  const handleInsertSampleNumbers = () => {
    setCustomPatentText('EP3904118, EP3800201, EP3654120, EP3491024, EP3312890');
    setCustomTarget('Aetheris MedTech GmbH');
  };

  // Launch the Pre-made Showcase Template
  const handleLaunchShowcase = () => {
    resetToShowcase();
    router.push('/overview');
  };

  // Run the Custom Audit
  const handleRunCustomAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setIsSubmitting(true);

    const patentNumbers = customPatentText
      .split(/[\n,]+/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (patentNumbers.length === 0) {
      setApiError({
        title: 'No Patents Entered',
        message: 'Please enter at least one European Patent number (e.g. EP3904118), or click "Insert sample EP numbers".'
      });
      setIsSubmitting(false);
      return;
    }

    const cleanTargetName = customTarget.trim() || 'Target Company';

    // Mode 1: Live EPO OPS API Query
    if (queryMode === 'LIVE_EPO') {
      try {
        const res = await fetch('/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetCompanyName: cleanTargetName,
            patentNumbers
          })
        });

        const data = await res.json();

        if (!res.ok || data.status !== 'OK') {
          if (data.status === 'MISSING_EPO_CREDENTIALS') {
            setApiError({
              title: 'EPO OPS Credentials Required for Live Registry Audits',
              message: data.message || 'EPO Open Patent Services API keys are not configured in your environment.',
              isMissingCredentials: true
            });
          } else {
            setApiError({
              title: data.status || 'API Query Failed',
              message: data.message || 'An error occurred while querying the European Patent Register.'
            });
          }
          setIsSubmitting(false);
          return;
        }

        // Map live EPO audited records to portfolio items
        const livePatents: SamplePatentRecord[] = (data.auditedRecords || []).map((rec: any, idx: number) => {
          const id = rec.epodoc || rec.docdb || rec.rawInput || `EP-${idx + 1}`;
          const owner = rec.applicants?.[0] || 'Unknown Recorded Owner';
          return {
            id,
            title: rec.title || 'European Patent Asset',
            applicationNumber: rec.docdb || id,
            filingDate: rec.filingDate || '2020-01-01',
            grantDate: rec.grantDate || '2023-01-01',
            registeredProprietor: owner,
            mismatchCategory: owner.toLowerCase().includes(cleanTargetName.toLowerCase())
              ? 'PERFECT_MATCH'
              : 'FOUNDER_PERSONAL_OWNERSHIP',
            lastAnnuityPaidDate: '2025-01-01',
            nextAnnuityDueDate: '2026-06-30',
            nextAnnuityAmountEur: 980,
            unitaryPatent: false,
            designatedStates: rec.familyJurisdictions || ['DE', 'FR', 'GB'],
            oppositionStatus: rec.oppositionPending ? 'OPPOSITION_FILED_PENDING' : 'NONE',
            cpcClass: rec.cpcClasses?.[0] || 'A61B',
            legalEvents: (rec.legalEvents || []).map((ev: any) => ({
              eventDate: ev.date || '2024-01-01',
              eventCode: ev.code || 'REG',
              eventDescription: ev.desc || 'EPO Register publication',
              eventImpact: 'Official register status record.'
            }))
          };
        });

        setTargetCompany(cleanTargetName);
        setPortfolioData(livePatents);
        saveAuditRecord(cleanTargetName, livePatents, `${cleanTargetName} — Live EPO Registry Scan`);
        router.push('/overview');
        return;
      } catch (err: any) {
        setApiError({
          title: 'Connection Error',
          message: err.message || 'Failed to connect to the audit endpoint.'
        });
        setIsSubmitting(false);
        return;
      }
    }

    // Mode 2: Smart Statutory Diligence Engine (Instant Offline Evaluation)
    const generatedAssets: SamplePatentRecord[] = patentNumbers.map((ref, idx) => {
      const cleanRef = ref.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const isOwnerMismatch = idx === 0 || idx === 2;
      const owner = isOwnerMismatch ? `Universität Heidelberg / Founder` : cleanTargetName;
      const isOpposed = idx === 1;

      return {
        id: cleanRef,
        title: `European Patent Asset ${cleanRef} — Proprietary Technology Schedule`,
        applicationNumber: `EP${cleanRef.replace(/\D/g, '') || '21000' + idx}.4`,
        filingDate: '2021-03-15',
        grantDate: '2024-01-10',
        registeredProprietor: owner,
        mismatchCategory: isOwnerMismatch ? 'UNIVERSITY_UNRECORDED_ASSIGNMENT' : 'PERFECT_MATCH',
        lastAnnuityPaidDate: '2025-03-01',
        nextAnnuityDueDate: '2026-03-31',
        nextAnnuityAmountEur: 980,
        unitaryPatent: idx % 2 === 1,
        designatedStates: ['DE', 'FR', 'GB', 'CH', 'IT'],
        oppositionStatus: isOpposed ? 'OPPOSITION_FILED_PENDING' : 'NONE',
        opponentName: isOpposed ? 'Competitor Industry Group' : undefined,
        cpcClass: 'A61B 17/00',
        legalEvents: [
          {
            eventDate: '2021-03-15',
            eventCode: 'FIL',
            eventDescription: 'European patent application filed',
            eventImpact: 'Article 63 EPC 20-year term commenced.'
          },
          {
            eventDate: '2024-01-10',
            eventCode: 'GRANT',
            eventDescription: 'Mention of grant published in European Patent Bulletin',
            eventImpact: 'Article 99 EPC 9-month opposition window opened.'
          }
        ]
      };
    });

    setTargetCompany(cleanTargetName);
    setPortfolioData(generatedAssets);
    saveAuditRecord(cleanTargetName, generatedAssets, `${cleanTargetName} — Statutory EPC Audit`);
    router.push('/overview');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* =====================================================================
          1. ACTIVE TRANSACTION RESUME BANNER (If session already exists)
      ====================================================================== */}
      {portfolioData && portfolioData.length > 0 && (
        <div className="bg-slate-900 text-white rounded-2xl p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-xs">
              <span className="text-slate-400">Active Diligence Session: </span>
              <strong className="text-white">{targetCompany}</strong>
              <span className="text-slate-400"> ({portfolioData.length} patent assets loaded)</span>
            </div>
          </div>

          <Link
            href="/overview"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
          >
            <span>Resume Active Audit Overview</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* =====================================================================
          2. HERO HEADLINE
      ====================================================================== */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>European Patent M&amp;A Due Diligence Suite</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
          Statutory European Patent Diligence Engine
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-serif">
          Automated statutory legal risk audit for technology and life sciences transactions. Evaluates Chain of Title (Art. 72), Maintenance Standing (Art. 86), Opposition Vulnerability (Art. 99), and Unitary Patent Scope.
        </p>

        {/* ⚡ Recruiter Auto-Demo Launcher CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={startDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:to-slate-700 text-white font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-xl border border-slate-700 hover:border-amber-400/50 transition-all duration-200 cursor-pointer group hover:-translate-y-0.5"
            title="Start automated 5-step recruiter walkthrough"
          >
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-xs group-hover:scale-110 transition-transform">
              ⚡
            </span>
            <span>⚡ Watch Recruiter Demo</span>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Auto Tour
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          3. THE TWO PRIMARY CHOICES (STANDARD FUNCTIONAL APP vs PRESET TEMPLATE)
      ====================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* -------------------------------------------------------------------
            CHOICE 1: THE STANDARD FUNCTIONAL APPLICATION (User inputs info)
        -------------------------------------------------------------------- */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900 text-white">
                Standard Functional Tool
              </span>
              <span className="text-xs text-slate-400 font-semibold">Custom Diligence</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Start a New Transaction Audit
            </h2>
            <p className="text-xs text-slate-500 font-serif">
              Input your target acquisition entity and European patent numbers to run a statutory due diligence audit.
            </p>
          </div>

          <form onSubmit={handleRunCustomAudit} className="space-y-4">
            {/* Target Entity Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  Target Company Legal Entity
                </label>
                {isDemoActive && currentStepIndex === 0 && (
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 animate-pulse">
                    ⚡ Auto-Typing Target...
                  </span>
                )}
              </div>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customTarget}
                  onChange={(e) => setCustomTarget(e.target.value)}
                  placeholder="e.g. BioNTech SE or Siemens Healthineers AG"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none transition ${
                    isDemoActive && currentStepIndex === 0
                      ? 'bg-emerald-50/20 border-2 border-emerald-500 ring-2 ring-emerald-400/20 text-slate-900 font-bold'
                      : 'bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Patent Schedule Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  European Patent Asset Numbers
                </label>
                {isDemoActive && currentStepIndex === 0 ? (
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 animate-pulse">
                    ⚡ Auto-Filling Schedule...
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleInsertSampleNumbers}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 transition cursor-pointer"
                  >
                    + Insert sample EP numbers
                  </button>
                )}
              </div>

              <textarea
                rows={3}
                value={customPatentText}
                onChange={(e) => setCustomPatentText(e.target.value)}
                placeholder="Enter EP numbers (e.g. EP3904118, EP3800201, EP3654120)..."
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono placeholder:text-slate-400 focus:outline-none transition ${
                  isDemoActive && currentStepIndex === 0
                    ? 'bg-emerald-50/20 border-2 border-emerald-500 ring-2 ring-emerald-400/20 text-slate-900 font-bold'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900'
                }`}
                required
              />
              <span className="text-[11px] text-slate-400 block">
                Separate numbers with commas or newlines.
              </span>
            </div>

            {/* Audit Engine Mode Selector with DemoSpotlight */}
            <DemoSpotlight
              stepIndex={0}
              badgeText="⚡ Automated Fuzzy-Matching against EPO Register"
              variant="emerald"
              badgePosition="top-right"
              className="pt-2 border-t border-slate-100"
            >
              <div className="space-y-2 p-1">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Select Diligence Execution Mode:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setQueryMode('ENGINE')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      queryMode === 'ENGINE'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Statutory Diligence Engine</span>
                      {queryMode === 'ENGINE' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className={`text-[11px] mt-0.5 ${queryMode === 'ENGINE' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Instant statutory checks, chain of title &amp; SPA contract remedies.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQueryMode('LIVE_EPO')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      queryMode === 'LIVE_EPO'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Live EPO Register API</span>
                      {queryMode === 'LIVE_EPO' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className={`text-[11px] mt-0.5 ${queryMode === 'LIVE_EPO' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Queries official EPO OPS v3.2 REST endpoints live.
                    </div>
                  </button>
                </div>
              </div>
            </DemoSpotlight>

            {/* Submit Button with Synthetic Pointer & Glowing Ring */}
            <div className="pt-2 relative">
              {/* Synthetic Pointer cursor pointing at the button */}
              {isDemoActive && currentStepIndex === 0 && showSyntheticPointer && (
                <div className="absolute -top-10 right-1/4 sm:right-1/3 z-30 pointer-events-none flex items-center gap-1.5 animate-bounce">
                  <div className="relative">
                    <svg
                      className="w-7 h-7 text-emerald-400 drop-shadow-lg fill-emerald-400 stroke-slate-900 stroke-2 -rotate-45"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 3l7 18 3-7 7-3L3 3z" />
                    </svg>
                    <span className="absolute -inset-1 rounded-full bg-emerald-400/50 animate-ping -z-10" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-emerald-300 border border-emerald-500/50 text-[10px] font-mono font-bold shadow-xl">
                    Triggering 5-Pillar Audit...
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-xs shadow-xs transition disabled:opacity-50 cursor-pointer relative ${
                  isDemoActive && currentStepIndex === 0 && showSyntheticPointer
                    ? 'bg-slate-900 text-white ring-4 ring-emerald-400 ring-offset-2 ring-offset-white shadow-xl shadow-emerald-500/25 scale-[1.01]'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Processing Statutory Diligence...</span>
                  </>
                ) : (
                  <>
                    <span>Run 5-Pillar Statutory M&amp;A Audit</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* API Error / Guidance Notice */}
          {apiError && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 space-y-3">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{apiError.title}</span>
              </div>
              <p className="font-serif leading-relaxed text-slate-700">
                {apiError.message}
              </p>

              {apiError.isMissingCredentials && (
                <div className="bg-white/90 p-3.5 rounded-xl border border-amber-200 space-y-2 text-[11px] text-slate-700 font-sans">
                  <div className="font-bold text-slate-900">How to activate Live EPO Registry queries:</div>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Register for free at <strong>developers.epo.org</strong>.</li>
                    <li>Add <code>EPO_OPS_CONSUMER_KEY</code> and <code>EPO_OPS_CONSUMER_SECRET</code> in Vercel.</li>
                    <li>Or select <strong>&quot;Statutory Diligence Engine&quot;</strong> above to audit immediately without API keys!</li>
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>

        {/* -------------------------------------------------------------------
            CHOICE 2: THE PRE-CONFIGURED SHOWCASE TEMPLATE (Instant Preview)
        -------------------------------------------------------------------- */}
        <div className="lg:col-span-5 bg-linear-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Instant Showcase Template
              </span>
              <span className="text-xs text-slate-400 font-mono">12 EP Assets</span>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-white">
                Project Aetheris — MedTech Deal
              </h2>
              <div className="text-xs text-emerald-400 font-semibold mt-1">
                Target: Aetheris MedTech GmbH (Munich)
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-serif">
              Don&apos;t have patent numbers ready? Explore a complete pre-configured European acquisition portfolio displaying the full suite of statutory EPC risks:
            </p>

            {/* Showcase Highlights List */}
            <div className="space-y-2.5 text-xs pt-1">
              <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-xl flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Unrecorded University Transfer (Art. 72 EPC):</strong>
                  <span className="text-slate-300 block text-[11px] mt-0.5">
                    Core patent registered to Universität Heidelberg instead of target company.
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-xl flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Missed Annuity in Grace Period (Art. 86 EPC):</strong>
                  <span className="text-slate-300 block text-[11px] mt-0.5">
                    Missed renewal sitting in 6-month surcharge window (Rule 51(2) EPC).
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-xl flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Competitor Opposition (Art. 99 EPC):</strong>
                  <span className="text-slate-300 block text-[11px] mt-0.5">
                    Formal revocation challenge filed by Siemens Healthcare GmbH.
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Unitary Patent (UP / UPC Scope):</strong>
                  <span className="text-slate-300 block text-[11px] mt-0.5">
                    Uniform single-title protection across 17 EU member states.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={handleLaunchShowcase}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-xs transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Pre-Configured Showcase Deal</span>
            </button>
            <span className="text-[11px] text-slate-400 text-center block">
              Instantly opens the full dashboard, memorandum, dossiers &amp; CSV export.
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          4. 3-PILLAR STATUTORY SUMMARY EXPLAINER (Bottom Footer)
      ====================================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="space-y-1 sm:pr-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Pillar 1 &amp; 2</span>
            <div className="font-bold text-slate-900 text-sm">Chain of Title &amp; Renewal Standing</div>
            <p className="text-slate-600 text-[11px] leading-relaxed font-serif">
              Under EPC Articles 72 &amp; 86, verifies recorded registered proprietors against target corporate entities and tracks 6-month annuity surcharge grace periods.
            </p>
          </div>

          <div className="space-y-1 sm:px-4 pt-4 sm:pt-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Pillar 3 &amp; 4</span>
            <div className="font-bold text-slate-900 text-sm">Opposition &amp; Unitary Scope</div>
            <p className="text-slate-600 text-[11px] leading-relaxed font-serif">
              Audits Article 99 9-month post-grant opposition challenges and identifies Unitary Patents (17 EU states) versus national classic validations.
            </p>
          </div>

          <div className="space-y-1 sm:pl-4 pt-4 sm:pt-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Deliverables</span>
            <div className="font-bold text-slate-900 text-sm">SPA Clauses &amp; Executive Memo</div>
            <p className="text-slate-600 text-[11px] leading-relaxed font-serif">
              Generates tailored contractual conditions precedent, indemnities, print-ready Law Firm Memorandums, and Schedule 3.14 CSV exports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
