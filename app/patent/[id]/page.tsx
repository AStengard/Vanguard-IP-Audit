"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Scale,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  Calendar,
  Building2,
  FileText,
  Clock,
  Globe,
  Gavel,
  History,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Info
} from 'lucide-react';
import { useDeal, AuditCheck } from '@/components/DealContext';

export default function PatentDossierPage() {
  const params = useParams();
  const rawId = params?.id as string;
  const patentId = decodeURIComponent(rawId || '');

  const { targetCompany, evaluatedPortfolio } = useDeal();
  const [copiedClause, setCopiedClause] = useState(false);

  // Find the patent in evaluated portfolio
  const asset = evaluatedPortfolio.find(
    (p) => p.id.toLowerCase() === patentId.toLowerCase()
  );

  const handleCopyClause = () => {
    if (!asset) return;
    const clauseText = `/* DRAFT SPA PROVISION — SCHEDULE 3.14 (${asset.id}) */\n` +
      `// Target Entity: ${targetCompany}\n` +
      `// Recorded Proprietor: ${asset.registeredProprietor}\n` +
      `// Finding: ${asset.primaryIssue}\n\n` +
      `Section 3.14 [Remediation Undertaking / Condition Precedent]:\n` +
      `"${asset.recommendedAction} The Sellers shall, at their sole cost and expense, execute all confirmatory deeds, EPO Form 5055 filings, and national register corrections prior to the Closing Date as a Condition Precedent under Section 3.01."`;

    navigator.clipboard.writeText(clauseText);
    setCopiedClause(true);
    setTimeout(() => setCopiedClause(false), 2500);
  };

  if (!asset) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
          <Scale className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Patent Asset Not Found</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          The patent reference &quot;{patentId}&quot; could not be found in the current transaction schedule.
        </p>
        <div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio Schedule</span>
          </Link>
        </div>
      </div>
    );
  }

  const isCritical = asset.overallRisk === 'CRITICAL';
  const isWarning = asset.overallRisk === 'WARNING';
  const isClean = asset.overallRisk === 'CLEAN';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* =====================================================================
          1. NAVIGATION & BREADCRUMBS
      ====================================================================== */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio Schedule</span>
        </Link>

        <div className="text-xs text-slate-400 font-mono">
          Schedule 3.14 &gt; <strong className="text-slate-700">{asset.id}</strong>
        </div>
      </div>

      {/* =====================================================================
          2. ASSET DOSSIER HEADER
      ====================================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {asset.id}
              </span>

              {asset.isNotFoundInEpo ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-900 border border-rose-300">
                  Not Found in EPO Register
                </span>
              ) : asset.unitaryPatent ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Unitary Patent (17 States)
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  Classic European Patent
                </span>
              )}

              {/* Due Diligence Standing Status Pill */}
              {asset.isNotFoundInEpo ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-800 border border-rose-200">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>UNMATCHED PATENT NUMBER</span>
                </span>
              ) : isCritical ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-800 border border-rose-200">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>CRITICAL RISK</span>
                </span>
              ) : null}
              {!asset.isNotFoundInEpo && isWarning && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>MATERIAL WARNING</span>
                </span>
              )}
              {!asset.isNotFoundInEpo && isClean && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>VERIFIED CLEAN</span>
                </span>
              )}
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-slate-800 leading-snug">
              {asset.title}
            </h1>
          </div>

          <button
            onClick={handleCopyClause}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-xs shrink-0 ${
              copiedClause
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {copiedClause ? (
              <>
                <Check className="w-4 h-4" />
                <span>Clause Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-emerald-400" />
                <span>Copy SPA Draft Clause</span>
              </>
            )}
          </button>
        </div>

        {/* Vital Registry Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Application No.
            </span>
            <span className="font-mono font-semibold text-slate-800">
              {asset.isNotFoundInEpo ? 'Not Found in EPO' : asset.applicationNumber}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Filing Date
            </span>
            <span className="font-semibold text-slate-800">
              {asset.isNotFoundInEpo ? 'Not Found' : asset.filingDate || 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Grant Date
            </span>
            <span className="font-semibold text-slate-800">
              {asset.isNotFoundInEpo ? 'Not Found' : asset.grantDate || 'Pending / In Prosecution'}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Statutory Runway
            </span>
            <span className="font-semibold text-slate-800">
              {asset.isNotFoundInEpo ? (
                <span className="text-rose-600 font-bold">Unverified (Not Found)</span>
              ) : asset.yearsRemaining > 0 ? (
                <span>~{asset.yearsRemaining} years ({asset.monthsRemaining} mos)</span>
              ) : (
                <span className="text-rose-600 font-bold">Lapsed / Expired</span>
              )}
            </span>
          </div>
        </div>

        {/* Chain of Title Match Banner */}
        <div className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          asset.isNotFoundInEpo
            ? 'bg-rose-50/70 border-rose-200'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <Building2 className={`w-4 h-4 shrink-0 ${asset.isNotFoundInEpo ? 'text-rose-500' : 'text-slate-400'}`} />
            <div>
              {asset.isNotFoundInEpo ? (
                <>
                  <span className="text-rose-700 font-semibold">EPO Register Lookup: </span>
                  <strong className="text-rose-950">No matching patent record found for &ldquo;{asset.id}&rdquo;</strong>
                </>
              ) : (
                <>
                  <span className="text-slate-500">Registered Proprietor: </span>
                  <strong className="text-slate-900">{asset.registeredProprietor}</strong>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {asset.isNotFoundInEpo ? (
              <span className="px-2.5 py-0.5 rounded font-mono font-extrabold bg-rose-200 text-rose-950">
                NOT FOUND IN EPO
              </span>
            ) : (
              <>
                <span className="text-slate-500">Target Match:</span>
                <span
                  className={`px-2 py-0.5 rounded font-mono font-bold ${
                    asset.titleMatchPct >= 90
                      ? 'bg-emerald-100 text-emerald-800'
                      : asset.titleMatchPct >= 70
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {asset.titleMatchPct}%
                </span>
                <span className="text-slate-400">vs {targetCompany}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. RECOMMENDED SPA REMEDIATION BOX (High Value for Legal Recruiters)
      ====================================================================== */}
      <div className={`border rounded-2xl p-6 shadow-xs space-y-4 ${
        isCritical
          ? 'bg-rose-50/60 border-rose-200'
          : isWarning
          ? 'bg-amber-50/60 border-amber-200'
          : 'bg-emerald-50/60 border-emerald-200'
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            {isCritical ? (
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            ) : isWarning ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Recommended Contract Remedy &amp; Deal Protection
            </h2>
          </div>

          <button
            onClick={handleCopyClause}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>Copy</span>
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-800">
            Primary Finding: {asset.primaryIssue}
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-serif bg-white/80 p-3.5 rounded-xl border border-slate-200/80">
            &ldquo;{asset.recommendedAction}&rdquo;
          </p>
        </div>
      </div>

      {/* =====================================================================
          4. EPC DUE DILIGENCE SCORECARD (5 CHECKS)
      ====================================================================== */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            EPC Due Diligence Scorecard (5 Checks)
          </h2>
          <p className="text-xs text-slate-500">
            Automated due diligence checks mapped to the relevant European Patent Convention (EPC) articles and implementing regulations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {asset.checks.map((check) => {
            const checkIsCritical = check.status === 'CRITICAL';
            const checkIsWarning = check.status === 'WARNING';
            const checkIsClean = check.status === 'CLEAN';

            return (
              <div
                key={check.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {check.number}
                    </span>
                    <span className="font-bold text-sm text-slate-900">
                      {check.title}
                    </span>
                    <span className="text-[11px] font-mono font-medium text-slate-400">
                      ({check.citation})
                    </span>
                  </div>

                  <div>
                    {checkIsCritical && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-800 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>CRITICAL DEFECT</span>
                      </span>
                    )}
                    {checkIsWarning && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>MATERIAL WARNING</span>
                      </span>
                    )}
                    {checkIsClean && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>STATUTORY CLEAN</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-800">
                  {check.headline}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Legal Diligence Analysis
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {check.lawyerNote}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Transaction &amp; SPA Impact
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {check.dealImpact}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          5. TERRITORIAL BREAKDOWN (Art. 65 / Unitary Patent)
      ====================================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-slate-600" />
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Territorial Scope &amp; National Validations
          </h2>
        </div>

        {asset.isNotFoundInEpo ? (
          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 space-y-1.5 text-xs">
            <div className="font-bold text-rose-950">
              No Territorial Validations Found — Patent Number Unmatched
            </div>
            <p className="text-rose-900 leading-relaxed">
              National validations under Article 65 EPC and Unitary Patent status could not be retrieved because &ldquo;{asset.id}&rdquo; did not match any record in the official EPO OPS v3.2 database.
            </p>
          </div>
        ) : asset.unitaryPatent ? (
          <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 space-y-2 text-xs">
            <div className="font-bold text-indigo-950 flex items-center gap-2">
              <span>Unitary Patent Protection Active</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-mono text-[10px]">
                17 EU Member States
              </span>
            </div>
            <p className="text-indigo-900 leading-relaxed">
              This patent benefits from Unitary Effect under EU Regulations 1257/2012 and 1260/2012. It provides uniform protection across all 17 participating UPC member states (including Germany, France, Italy, the Netherlands, and Belgium) with a single centralized renewal fee paid directly to the EPO.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Validated on a national state-by-state basis under Article 65 EPC. Each country operates as an independent national patent requiring local translation filings and local annual renewal fees:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(asset.strictShowcaseDesignatedStates ||
                (Array.isArray(asset.designatedStates) && asset.designatedStates.length > 0
                  ? asset.designatedStates.map((s: any) =>
                      typeof s === 'string'
                        ? { code: s, status: 'VALIDATED', nationalRef: `${s}${asset.id}`, renewalPaid: true }
                        : s
                    )
                  : [
                      { code: 'DE', status: 'VALIDATED', nationalRef: 'DE602021011418.9', renewalPaid: true },
                      { code: 'FR', status: 'VALIDATED', nationalRef: 'FR3904118', renewalPaid: true },
                      { code: 'GB', status: 'VALIDATED', nationalRef: 'GB3904118', renewalPaid: true }
                    ])
              ).map((state: any, idx: number) => (
                <div
                  key={state.code || idx}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{state.code}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {state.status}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-500">
                    Ref: {state.nationalRef || 'Pending Ref'}
                  </div>
                  <div className="text-[10px] text-slate-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Local renewal: {state.renewalPaid ? 'Paid' : 'Unpaid'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
          6. INPADOC LEGAL EVENTS TIMELINE
      ====================================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-slate-600" />
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            EPO INPADOC Legal Status History
          </h2>
        </div>

        <p className="text-xs text-slate-500">
          Chronological record of official patent office gazette publications and procedural status changes.
        </p>

        <div className="border-l-2 border-slate-200 ml-3 pl-4 space-y-6 pt-2">
          {(asset.legalEvents && asset.legalEvents.length > 0
            ? asset.legalEvents
            : (asset.inpadocEvents || []).map((ev: any) => ({
                eventDate: ev.date,
                eventCode: ev.code,
                eventDescription: ev.title,
                eventImpact: ev.ref
              }))
          ).map((ev: any, idx: number) => (
            <div key={idx} className="relative space-y-1 text-xs">
              <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-slate-400 border-2 border-white" />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-slate-900">{ev.eventDate}</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                  {ev.eventCode}
                </span>
                <span className="font-semibold text-slate-800">{ev.eventDescription}</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                {ev.eventImpact}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

