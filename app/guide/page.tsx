"use client";

import React from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Scale,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Layers,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Gavel,
  Clock,
  Globe,
  Building2,
  Sparkles
} from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* =====================================================================
          1. HEADER
      ====================================================================== */}
      <div className="space-y-3">
        <Link
          href="/overview"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            User &amp; Recruiter Guide
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          How Vanguard IP Audit Works
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          A non-technical guide designed for corporate M&amp;A attorneys, patent counsel, and legal recruiters.
          Learn how automated statutory diligence prevents multimillion-euro patent ownership disputes in European acquisitions.
        </p>
      </div>

      {/* =====================================================================
          2. THE M&A PROBLEM (Why this tool exists)
      ====================================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              The Problem: Manual Patent Due Diligence in European M&amp;A
            </h2>
            <p className="text-xs text-slate-500">
              Why traditional due diligence misses critical patent ownership breaks
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-700 leading-relaxed space-y-3 font-serif">
          <p>
            In European life sciences and deep-tech acquisitions, patents often represent up to <strong>70%&ndash;90% of a target company&apos;s enterprise value</strong>. Yet deal teams still rely on manual, error-prone cross-checks between seller-prepared disclosure schedules (SPA Schedule 3.14), the European Patent Register, and fragmented national patent offices.
          </p>
          <p>
            Manual verification across dozens of patent families routinely consumes <strong>substantial billable hours per transaction</strong>&mdash;and still risks missing high-stakes statutory defects:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 font-sans text-xs text-slate-800">
            <li>
              <strong>Unrecorded Assignments (Art. 72 EPC):</strong> Patents still registered to a founder or university tech-transfer office, leaving core IP stranded outside the target entity.
            </li>
            <li>
              <strong>Patents in Grace Periods (Rule 51(2) EPC):</strong> Missed renewal fees sitting inside the EPO&apos;s 6-month surcharge window that will permanently lapse if not cured before closing.
            </li>
            <li>
              <strong>Central Oppositions (Art. 99 EPC):</strong> Active competitor oppositions threatening to revoke protection across up to 39 EPC contracting states in a single proceeding.
            </li>
          </ul>
        </div>
      </div>

      {/* =====================================================================
          3. THE 5 STATUTORY EPC PILLARS
      ====================================================================== */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            The 5 Statutory EPC Audit Pillars
          </h2>
          <p className="text-xs text-slate-500">
            How Vanguard IP Audit automatically applies European patent law to protect the buyer
          </p>
        </div>

        <div className="space-y-4">
          {/* Pillar 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 font-extrabold text-sm flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Chain of Title &amp; Valid Assignment (Article 72 &amp; Rule 22 EPC)
                </h3>
                <span className="text-[11px] text-slate-500">Verifying that the target entity actually owns the asset</span>
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-serif pl-11">
              Under Article 72 EPC, an assignment of a European patent application must be made in writing and signed by both parties. Rule 22 EPC requires the assignment to be recorded on the official register to be effective against third parties. If a patent remains registered to an academic institution (e.g. <em>Universität Heidelberg</em>) or a founder in their personal capacity, Vanguard raises a <strong>CRITICAL RED FLAG</strong> and drafts a mandatory <em>Closing Condition Precedent</em> requiring an executed confirmatory assignment before deal closing.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-extrabold text-sm flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Maintenance &amp; Renewal Fees (Article 86 &amp; Rule 51 EPC)
                </h3>
                <span className="text-[11px] text-slate-500">Guarding against accidental patent abandonment</span>
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-serif pl-11">
              European patents require annual renewal fees (annuities) starting from the 3rd year. If a fee is missed, Rule 51(2) EPC allows a 6-month grace period upon payment of a 50% surcharge. If unpaid after 6 months, the patent is deemed irrevocably withdrawn. Vanguard audits the fee register to alert the deal team if an asset is inside this dangerous surcharge window.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 font-extrabold text-sm flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Opposition Vulnerability (Article 99 EPC)
                </h3>
                <span className="text-[11px] text-slate-500">Assessing post-grant competitor challenges</span>
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-serif pl-11">
              Within nine (9) months from publication of grant, any third party can file a formal opposition under Article 99 EPC. If an opposition is filed by a major industry competitor, the patent is at risk of total revocation. Vanguard flags active oppositions and recommends an indemnity holdback to cover prospective litigation costs.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-extrabold text-sm flex items-center justify-center shrink-0">
                4
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Territorial Scope: Classic EP vs. Unitary Patent (UP / UPC)
                </h3>
                <span className="text-[11px] text-slate-500">Mapping European commercial coverage</span>
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-serif pl-11">
              Under Article 65 EPC, classic European patents must be validated in each individual country (DE, FR, GB, etc.) and renewed locally. The new Unitary Patent (UP) system provides single-title protection across 17 EU member states with centralized jurisdiction before the Unified Patent Court (UPC). Vanguard distinguishes UP assets from classic national bundles to verify territorial coverage.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-sm flex items-center justify-center shrink-0">
                5
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Commercial Runway &amp; Expiry Risk (Article 63 EPC)
                </h3>
                <span className="text-[11px] text-slate-500">Ensuring the patent has sufficient years of exclusivity</span>
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-serif pl-11">
              Under Article 63(1) EPC, the term of a European patent is 20 years from the date of filing. Acquiring an asset with less than 24 months of remaining statutory life rarely justifies premium valuation unless supplemented by Supplementary Protection Certificates (SPCs). Vanguard calculates exact remaining runway down to the month.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================================
          4. HOW TO NAVIGATE THE SITE (Workflow for Recruiters)
      ====================================================================== */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
            Step-by-Step Walkthrough
          </span>
          <h2 className="text-xl font-bold mt-1">
            Navigating Vanguard IP Audit in 4 Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl space-y-1.5">
            <div className="text-emerald-400 font-bold">1. Overview Dashboard</div>
            <p className="text-slate-300 leading-relaxed">
              View the top-line health of the acquisition. The 4 KPI cards and Priority Red Flag center summarize deal-breaker issues in seconds.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl space-y-1.5">
            <div className="text-emerald-400 font-bold">2. Portfolio Schedule 3.14</div>
            <p className="text-slate-300 leading-relaxed">
              Browse the full patent disclosure schedule with instant search and filter pills. See title ownership matches and primary statutory issues.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl space-y-1.5">
            <div className="text-emerald-400 font-bold">3. Patent Dossier &amp; Clause Copy</div>
            <p className="text-slate-300 leading-relaxed">
              Click any patent to open its dedicated dossier. Use the 1-click &ldquo;Copy SPA Draft Clause&rdquo; button to grab ready-to-insert contract protections.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl space-y-1.5">
            <div className="text-emerald-400 font-bold">4. Executive Memo (Print PDF)</div>
            <p className="text-slate-300 leading-relaxed">
              Generate a formal Law Firm Memorandum formatted for printing directly to PDF for senior partners or investment committee presentations.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
          >
            <span>Explore the Portfolio Schedule</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition"
          >
            <span>Run Live EPO Audit / Watch Demo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

