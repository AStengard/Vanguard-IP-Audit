"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  Printer,
  FileSpreadsheet,
  ArrowLeft,
  Scale,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useDeal } from '@/components/DealContext';
import { useRecruiterDemo } from '@/components/RecruiterDemoContext';
import DemoSpotlight from '@/components/DemoSpotlight';

export default function MemoPage() {
  const { targetCompany, evaluatedPortfolio, metrics, downloadCsv, resetToShowcase } = useDeal();
  const { isDemoActive, currentStepIndex, playbackSpeed } = useRecruiterDemo();

  const criticalAssets = evaluatedPortfolio.filter((p) => p.overallRisk === 'CRITICAL');
  const warningAssets = evaluatedPortfolio.filter((p) => p.overallRisk === 'WARNING');
  const cleanAssets = evaluatedPortfolio.filter((p) => p.overallRisk === 'CLEAN');

  const handlePrint = () => {
    window.print();
  };

  // Recruiter Demo: Smoothly scroll down to showcase Section 2 Contractual Remedies during Step 5
  useEffect(() => {
    if (!isDemoActive || currentStepIndex !== 4) return;

    const scrollTimer = setTimeout(() => {
      const remediesEl = document.getElementById('demo-spa-remedies-section');
      if (remediesEl) {
        const yOffset = -90;
        const y = remediesEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }, 1000 / playbackSpeed);

    return () => clearTimeout(scrollTimer);
  }, [isDemoActive, currentStepIndex, playbackSpeed]);

  if (evaluatedPortfolio.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
          <FileText className="w-7 h-7 text-slate-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            No Memorandum to Generate
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto font-serif leading-relaxed">
            There is currently no active transaction audit to generate a due diligence memorandum for. Please start a new audit or launch the showcase template.
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* =====================================================================
          1. TOP ACTION BAR (Hidden in Print)
      ====================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link
          href="/overview"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            onClick={downloadCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs shadow-2xs transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print / Save as PDF</span>
          </button>

          <a
            href="https://astengard.github.io/cv/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-xs shadow-2xs transition cursor-pointer"
            title="Alfred Stengard — Digital CV"
          >
            <ExternalLink className="w-4 h-4 text-emerald-600" />
            <span>Digital CV</span>
          </a>
        </div>
      </div>

      {/* =====================================================================
          2. THE FORMAL LAW FIRM MEMORANDUM DOCUMENT
      ====================================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm print:border-none print:shadow-none print:p-0 space-y-8 font-serif">
        {/* Formal Header / Letterhead */}
        <div className="border-b-2 border-slate-900 pb-6 space-y-4">
          <div className="flex items-center justify-between font-sans">
            <div>
              <span className="text-xs font-black tracking-widest text-slate-900 uppercase">
                Vanguard Legal Advisory LLP
              </span>
              <div className="text-[10px] text-slate-500 font-medium">
                European Patent Practice &amp; Corporate M&amp;A Due Diligence Group
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-500 font-mono">
              FILE REF: MA-2026-AETH-099
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            LEGAL DUE DILIGENCE MEMORANDUM
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans pt-2 text-slate-700">
            <div><strong>TO:</strong> Lead Transaction Partner / Investment Committee</div>
            <div><strong>DATE:</strong> 15 November 2026</div>
            <div><strong>FROM:</strong> European Patent Audit Practice Group</div>
            <div><strong>TARGET ENTITY:</strong> {targetCompany}</div>
            <div className="sm:col-span-2">
              <strong>TRANSACTION:</strong> Acquisition of 100% of the Share Capital of {targetCompany}
            </div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3 font-sans">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            1. Executive Summary &amp; Risk Rating
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed font-serif">
            We have conducted a statutory European Patent Convention (EPC) registry audit of the twelve (12) patent assets disclosed on Schedule 3.14 of the draft Share Purchase Agreement (SPA) for the acquisition of <strong>{targetCompany}</strong>. Our audit analyzed: (i) Chain of Title and valid assignment under Article 72 and Rule 22 EPC; (ii) Maintenance and renewal fee standing under Article 86 EPC; (iii) Opposition vulnerability under Article 99 EPC; (iv) Territorial scope under Article 65 EPC and Unitary Patent standing; and (v) Remaining patent commercial runway under Article 63 EPC.
          </p>

          {/* Metric Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Audited</span>
              <span className="text-xl font-extrabold text-slate-900">{metrics.total} Assets</span>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Critical Red Flags</span>
              <span className="text-xl font-extrabold text-rose-800">{metrics.critical}</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Material Warnings</span>
              <span className="text-xl font-extrabold text-amber-800">{metrics.warning}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Verified Clean</span>
              <span className="text-xl font-extrabold text-emerald-800">{metrics.clean}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Priority Findings & Contractual Remedies with DemoSpotlight */}
        <DemoSpotlight
          stepIndex={4}
          badgeText="SPA Closing Covenants & Specific Indemnity"
          badgeSubtext="Mandatory Condition Precedent § 7.02(f)"
          variant="emerald"
          badgePosition="top-left"
        >
          <div id="demo-spa-remedies-section" className="space-y-4 font-sans p-2 rounded-2xl">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              2. Priority Red Flags &amp; Mandatory Contractual Remedies
            </h2>
            <p className="text-xs text-slate-700 font-serif">
              The following assets exhibit statutory title breaks or procedural vulnerabilities requiring specific conditions precedent, indemnity protections, or escrow retentions prior to deal closing:
            </p>

            <div className="space-y-4">
              {criticalAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-rose-50/50 border border-rose-200 rounded-xl p-4 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-rose-950 text-sm">{asset.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200/80 text-rose-900">
                        CRITICAL RISK
                      </span>
                    </div>
                    <span className="text-slate-500 font-mono text-[11px]">App: {asset.applicationNumber}</span>
                  </div>

                  <div className="font-bold text-slate-900">{asset.title}</div>
                  <div className="text-slate-700 font-serif">
                    <strong>Deficiency:</strong> {asset.primaryIssue} Recorded owner on the official register is &quot;{asset.registeredProprietor}&quot; rather than the target company &quot;{targetCompany}&quot;.
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-rose-200 text-slate-800 font-serif">
                    <strong>Recommended SPA Provision:</strong> &ldquo;{asset.recommendedAction}&rdquo;
                  </div>
                </div>
              ))}

              {warningAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-950 text-sm">{asset.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/80 text-amber-900">
                        MATERIAL WARNING
                      </span>
                    </div>
                    <span className="text-slate-500 font-mono text-[11px]">App: {asset.applicationNumber}</span>
                  </div>

                  <div className="font-bold text-slate-900">{asset.title}</div>
                  <div className="text-slate-700 font-serif">
                    <strong>Deficiency:</strong> {asset.primaryIssue}
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-amber-200 text-slate-800 font-serif">
                    <strong>Recommended SPA Provision:</strong> &ldquo;{asset.recommendedAction}&rdquo;
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DemoSpotlight>

        {/* Section 3: Recommended Reps & Warranties */}
        <div className="space-y-3 font-sans">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            3. Recommended SPA Warranties (Section 3.14)
          </h2>
          <div className="text-xs text-slate-700 leading-relaxed font-serif space-y-2">
            <p>
              In light of the recorded ownership variances, the Buyer must reject standard &ldquo;knowledge-qualified&rdquo; IP representations. We recommend inserting the following specific warranties:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Sole and Beneficial Ownership:</strong> The Target is the sole legal and beneficial owner of all patents listed on Schedule 3.14, free and clear of all security interests, liens, or unrecorded employee/founder claims.
              </li>
              <li>
                <strong>Valid Subsistence &amp; Maintenance:</strong> All renewal and maintenance fees due on or before Closing have been paid in full, and no patent is subject to pending Article 99 opposition or revocation proceedings except as expressly disclosed.
              </li>
              <li>
                <strong>Assignment of University / Academic Rights:</strong> All rights developed under university collaborations or founder engagements have been fully and irrevocably assigned in writing in accordance with Article 72 EPC and local inventor compensation statutes.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 4: Post-Closing Integration */}
        <div className="space-y-3 font-sans">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            4. Post-Closing Integration Undertakings (Section 5.06)
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed font-serif">
            The Sellers shall covenant that, within thirty (30) business days following Closing, they will cooperate with the Buyer to submit all necessary EPO Form 5055 filings and national validation register changes to record the Target (or Buyer&apos;s designated nominee) as the recorded proprietor of record across all European jurisdictions.
          </p>
        </div>

        {/* Sign-off / Signature Block */}
        <div className="pt-8 border-t border-slate-300 font-sans space-y-4">
          <div className="text-xs text-slate-600 font-serif">
            Respectfully submitted on behalf of the Practice Group,
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="font-serif italic text-base text-slate-900 font-bold">
                Vanguard Legal Advisory LLP
              </div>
              <div className="text-[11px] text-slate-500">
                European Patent Practice Group &bull; Munich &bull; London &bull; Zurich
              </div>
            </div>
            <div className="w-24 h-12 border border-dashed border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-400 font-mono">
              [OFFICIAL STAMP]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

