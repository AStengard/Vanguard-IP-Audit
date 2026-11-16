"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  Scale,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  ChevronRight,
  Building2,
  Calendar,
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  Gavel,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  Plus,
  History
} from 'lucide-react';
import { useDeal } from '@/components/DealContext';
import { useRecruiterDemo } from '@/components/RecruiterDemoContext';
import DemoSpotlight from '@/components/DemoSpotlight';

export default function OverviewPage() {
  const { targetCompany, evaluatedPortfolio, metrics, downloadCsv, resetToShowcase } = useDeal();
  const { isDemoActive, currentStepIndex, playbackSpeed } = useRecruiterDemo();

  // Find the critical red flags to feature on the executive action center
  const criticalAssets = evaluatedPortfolio.filter((p) => p.overallRisk === 'CRITICAL');
  const warningAssets = evaluatedPortfolio.filter((p) => p.overallRisk === 'WARNING');

  // Recruiter Demo: Smoothly scroll to the Critical Red Flags section during Step 3
  useEffect(() => {
    if (!isDemoActive || currentStepIndex !== 2) return;

    const scrollTimer = setTimeout(() => {
      const el = document.getElementById('demo-critical-flags-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 400 / playbackSpeed);

    return () => clearTimeout(scrollTimer);
  }, [isDemoActive, currentStepIndex, playbackSpeed]);

  if (!targetCompany || evaluatedPortfolio.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
          <Building2 className="w-7 h-7 text-slate-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            No Active Transaction Audit
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto font-serif leading-relaxed">
            No target company or patent portfolio is currently loaded. You can configure a new transaction audit with your own assets or launch the pre-configured 12-patent showcase.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow-xs"
          >
            <span>Start a New Audit</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </Link>
          <button
            onClick={() => resetToShowcase()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition cursor-pointer"
          >
            <span>Load Showcase Template</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* =====================================================================
          1. DEAL CONTEXT BANNER
      ====================================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              Active Transaction File
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Reference Date: November 2026
            </span>
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Transaction Due Diligence — {targetCompany}
            </h1>
          </div>

          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Automated statutory European Patent Convention (EPC) legal risk audit for the acquisition of{' '}
            <strong className="text-slate-900">{targetCompany}</strong>. Evaluates Chain of Title (Art. 72), Maintenance Standing (Art. 86), Opposition Vulnerability (Art. 99), and Territorial Scope (Art. 65 / UP).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
          >
            <span>View Full Schedule ({metrics.total} Assets)</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </Link>

          <Link
            href="/memo"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs shadow-2xs transition"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Executive Memo (PDF)</span>
          </Link>

          <Link
            href="/history"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            title="View saved scans in Audit History"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>Audit Vault</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            title="Start a new audit or switch deal"
          >
            <Plus className="w-4 h-4" />
            <span>New Audit</span>
          </Link>
        </div>
      </div>

      {/* =====================================================================
          2. THE 4 EXECUTIVE KPI SUMMARY CARDS
      ====================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Portfolio */}
        <Link
          href="/portfolio"
          className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Disclosed Portfolio
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-700 flex items-center justify-center transition">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{metrics.total}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>European Patent Assets</span>
            <span className="text-slate-700 font-bold group-hover:translate-x-0.5 transition">View All →</span>
          </div>
        </Link>

        {/* Critical Red Flags */}
        <Link
          href="/portfolio"
          className="bg-white border border-rose-200 bg-linear-to-b from-rose-50/40 to-white hover:border-rose-300 rounded-2xl p-5 shadow-xs transition group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Critical Red Flags</span>
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-900 mt-2">{metrics.critical}</div>
          <div className="text-xs text-rose-700 font-semibold mt-1">
            Require Closing CPs / Escrow
          </div>
        </Link>

        {/* Material Warnings */}
        <Link
          href="/portfolio"
          className="bg-white border border-amber-200 bg-linear-to-b from-amber-50/40 to-white hover:border-amber-300 rounded-2xl p-5 shadow-xs transition group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Material Warnings</span>
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-950 mt-2">{metrics.warning}</div>
          <div className="text-xs text-amber-800 font-semibold mt-1">
            Require Specific Representations
          </div>
        </Link>

        {/* Good Standing */}
        <Link
          href="/portfolio"
          className="bg-white border border-emerald-200 bg-linear-to-b from-emerald-50/40 to-white hover:border-emerald-300 rounded-2xl p-5 shadow-xs transition group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Clean</span>
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-950 mt-2">{metrics.clean}</div>
          <div className="text-xs text-emerald-800 font-semibold mt-1">
            {metrics.cleanPct}% Clean Title Exclusivity
          </div>
        </Link>
      </div>

      {/* =====================================================================
          3. IMMEDIATE ACTION CENTER: CRITICAL RED FLAGS REQUIRING SPA REMEDIES
      ====================================================================== */}
      <div id="demo-critical-flags-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>Priority Red Flags Requiring M&amp;A Remediation</span>
              </h2>
              {isDemoActive && currentStepIndex === 2 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider animate-bounce shadow-md">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Spotlight Active</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              These items cannot be closed on standard representations and require specific contractual safeguards.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="text-xs font-bold text-slate-700 hover:text-slate-950 flex items-center gap-1"
          >
            <span>View All Assets</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {criticalAssets.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm text-emerald-900">Zero Critical Red Flags Detected</h3>
            <p className="text-xs text-emerald-700">
              All disclosed patents currently match the target legal entity and are in good standing before the EPO.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {criticalAssets.map((asset, idx) => {
              const isFirst = idx === 0;

              const cardBody = (
                <div
                  className={`bg-white rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all duration-500 h-full ${
                    isFirst && isDemoActive && currentStepIndex === 2
                      ? 'border border-rose-300 bg-linear-to-b from-rose-50/30 to-white'
                      : 'border border-rose-200 hover:border-rose-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-extrabold text-slate-900">
                        {asset.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        Critical Red Flag
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-xs text-slate-900 line-clamp-1">
                        {asset.title}
                      </h3>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Recorded Owner: <strong>{asset.registeredProprietor}</strong>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 space-y-1">
                      <span className="text-[11px] font-bold text-rose-900 block">
                        {asset.primaryIssue}
                      </span>
                      <span className="text-[11px] text-rose-800 block leading-relaxed">
                        Registered to <em>&quot;{asset.registeredProprietor}&quot;</em> rather than target.
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Recommended SPA Remedy:
                      </span>
                      <span className="text-xs font-semibold text-slate-800 block">
                        {asset.recommendedAction}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
                    <Link
                      href={`/patent/${asset.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-emerald-700 transition"
                    >
                      <span>Review Dossier &amp; SPA Clause</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );

              if (isFirst) {
                return (
                  <DemoSpotlight
                    key={asset.id}
                    stepIndex={2}
                    badgeText="⚡ Art. 72 EPC Title Break"
                    badgeSubtext="Unrecorded university transfer requires Closing CP"
                    variant="rose"
                    badgePosition="top-left"
                    className="h-full"
                  >
                    {cardBody}
                  </DemoSpotlight>
                );
              }

              return <div key={asset.id}>{cardBody}</div>;
            })}
          </div>
        )}
      </div>

      {/* =====================================================================
          4. SCHEDULE PREVIEW (TOP 5 ASSETS)
      ====================================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden space-y-0">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Schedule 3.14 (Registered Intellectual Property) — Preview
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing disclosed patent assets for {targetCompany}.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
          >
            <span>Open Full Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-bold">
                <th className="py-3 px-4">Patent Ref</th>
                <th className="py-3 px-4">Invention Title</th>
                <th className="py-3 px-4">Registered Proprietor</th>
                <th className="py-3 px-4">Due Diligence Standing</th>
                <th className="py-3 px-4">Recommended Contract Remedy</th>
                <th className="py-3 px-4 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {evaluatedPortfolio.slice(0, 5).map((asset) => {
                const isCritical = asset.overallRisk === 'CRITICAL';
                const isWarning = asset.overallRisk === 'WARNING';
                return (
                  <tr key={asset.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {asset.id}
                      {asset.unitaryPatent && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-sans">
                          UP
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate font-medium text-slate-800">
                      {asset.title}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-700">
                      {asset.registeredProprietor}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
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
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-semibold">
                      {asset.recommendedAction}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Link
                        href={`/patent/${asset.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 font-bold text-xs transition"
                      >
                        <span>Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          5. QUICK NAVIGATION CARDS (HOW IT WORKS & MEMO)
      ====================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/memo"
          className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 shadow-xs flex items-center justify-between group transition cursor-pointer"
        >
          <div className="space-y-1 max-w-md">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
              <FileText className="w-4 h-4" />
              <span>Investment Committee Deliverable</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition">
              Executive Due Diligence Memorandum (PDF)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Print-formatted law firm memorandum summarizing findings, red flag schedules, and closing conditions.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center transition shrink-0 ml-4">
            <ArrowRight className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href="/guide"
          className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 shadow-xs flex items-center justify-between group transition cursor-pointer"
        >
          <div className="space-y-1 max-w-md">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
              <HelpCircle className="w-4 h-4" />
              <span>Non-Technical Walkthrough</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-700 transition">
              How It Works &amp; Legal Framework
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Step-by-step explanation of the 5 European Patent Convention (EPC) statutory checks.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center transition shrink-0 ml-4">
            <ArrowRight className="w-5 h-5" />
          </div>
        </Link>
      </div>
    </div>
  );
}

