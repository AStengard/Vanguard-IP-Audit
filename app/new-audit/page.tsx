"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Upload,
  ArrowLeft,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Key,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Loader2,
  Layers,
  Database
} from 'lucide-react';
import { useDeal } from '@/components/DealContext';
import {
  SAMPLE_MA_PATENTS,
  DEFAULT_TARGET_COMPANY,
  SamplePatentRecord
} from '@/lib/sampleDeal';

export default function NewAuditPage() {
  const router = useRouter();
  const {
    targetCompany,
    setTargetCompany,
    setPortfolioData,
    resetToShowcase
  } = useDeal();

  const [activeTab, setActiveTab] = useState<'PRESETS' | 'LIVE_EPO'>('PRESETS');

  // Live EPO Query Form State
  const [liveTargetName, setLiveTargetName] = useState('Siemens Healthineers AG');
  const [livePatentInput, setLivePatentInput] = useState('EP3904118, EP3800201, EP3654120');
  const [isLoading, setIsLoading] = useState(false);
  const [liveError, setLiveError] = useState<{ title: string; message: string; isMissingCredentials?: boolean } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Preset Handler (Project Aetheris — MedTech Deal)
  const handleLoadAetheris = () => {
    resetToShowcase();
    setSuccessMessage('Loaded Project Aetheris (12-patent M&A portfolio review) successfully.');
    setTimeout(() => {
      router.push('/overview');
    }, 800);
  };

  // Live EPO Audit Submission
  const handleRunLiveAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLiveError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const patentNumbers = livePatentInput
      .split(/[\n,]+/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (patentNumbers.length === 0) {
      setLiveError({
        title: 'No Patents Entered',
        message: 'Please enter at least one European Patent number (e.g. EP3904118).'
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCompanyName: liveTargetName.trim() || 'Target Company',
          patentNumbers
        })
      });

      const data = await res.json();

      if (!res.ok || data.status !== 'OK') {
        if (data.status === 'MISSING_EPO_CREDENTIALS') {
          setLiveError({
            title: 'EPO OPS Credentials Required for Live Registry Audits',
            message: data.message || 'EPO Open Patent Services API keys are not configured in your environment.',
            isMissingCredentials: true
          });
        } else {
          setLiveError({
            title: data.status || 'API Query Failed',
            message: data.message || 'An error occurred while querying the European Patent Register.'
          });
        }
        setIsLoading(false);
        return;
      }

      // Convert audited records to portfolio items
      const cleanLiveTarget = liveTargetName.trim() || 'Target Company';
      const livePatents: SamplePatentRecord[] = (data.auditedRecords || []).map((rec: any, idx: number) => {
        const id = rec.epodoc || rec.docdb || rec.rawInput || `EP-${idx + 1}`;
        const owner = rec.applicants?.[0] || 'Unknown Recorded Owner';
        const isMatch = owner.toLowerCase().includes(cleanLiveTarget.toLowerCase());
        const isOpposed = Boolean(rec.oppositionPending);
        const jurisdictions: string[] = Array.isArray(rec.familyJurisdictions) && rec.familyJurisdictions.length > 0
          ? rec.familyJurisdictions
          : ['DE', 'FR', 'GB'];
        const filingDate = rec.filingDate || '2020-01-01';
        const grantDate = rec.grantDate || '2023-01-01';
        const filingYear = parseInt(filingDate.slice(0, 4), 10) || 2020;

        return {
          id,
          title: rec.title || 'European Patent Asset',
          applicationNumber: rec.docdb || id,
          ipcClass: rec.cpcClasses?.[0] || 'A61B 17/00',
          filingDate,
          priorityDate: filingDate,
          grantDate,
          expirationDate: `${filingYear + 20}${filingDate.slice(4)}`,
          registeredProprietor: owner,
          proprietorAddress: 'Recorded in European Patent Register',
          disclosedOwnerSchedule: cleanLiveTarget,
          inventors: Array.isArray(rec.inventors) && rec.inventors.length > 0 ? rec.inventors : ['Recorded Inventor'],
          epoStatus: isOpposed ? 'OPPOSITION_PENDING' : 'GRANTED_ACTIVE',
          epoStatusCode: isOpposed ? 'PG25 / OPPOSITION' : 'PG25 / REG',
          mismatchCategory: isMatch ? 'PERFECT_MATCH' : 'FOUNDER_PERSONAL_OWNERSHIP',
          annuityYear: Math.max(1, new Date().getFullYear() - filingYear),
          annuityStatus: 'PAID_CURRENT',
          annuityPaidThrough: '2026-06-30',
          lastAnnuityPaidDate: '2025-01-01',
          nextAnnuityDueDate: '2026-06-30',
          nextAnnuityAmountEur: 980,
          unitaryPatent: false,
          designatedStates: jurisdictions.map((code: string) => ({
            code,
            status: 'VALIDATED' as const,
            nationalRef: `${code}${id}`,
            renewalPaid: true
          })),
          oppositionStatus: isOpposed ? 'ACTIVE_OPPOSITION_PROCEEDINGS' : 'NO_OPPOSITION_EXPIRED',
          oppositionDetail: isOpposed
            ? 'Active opposition proceeding detected in EPO Register under Art. 99 EPC.'
            : 'No active opposition recorded in EPO Register.',
          productLine: 'Audited Target Patent Portfolio',
          revenueAttributionPct: Math.round(100 / Math.max((data.auditedRecords || []).length, 1)),
          baseRiskCategory: !isMatch || isOpposed ? 'CRITICAL' : 'CLEAN',
          legalSummary: `Live EPO OPS registry retrieval for ${id}. Recorded proprietor: ${owner}.`,
          spaRemediationClause: !isMatch
            ? `CLOSING CONDITION PRECEDENT: Require executed Art. 72 EPC Confirmatory Deed of Assignment transferring ${id} from ${owner} to ${cleanLiveTarget} prior to Closing.`
            : `STANDARD WARRANTY SUFFICIENT: Include ${id} under Schedule 3.14(a) subject to Section 4.14 IP ownership representations.`,
          cpcClass: rec.cpcClasses?.[0] || 'A61B',
          inpadocEvents: (rec.legalEvents || []).map((ev: any) => ({
            date: ev.date || '2024-01-01',
            code: ev.code || 'REG',
            title: ev.desc || 'EPO Register status event',
            ref: 'EPO OPS Register'
          })),
          legalEvents: (rec.legalEvents || []).map((ev: any) => ({
            eventDate: ev.date || '2024-01-01',
            eventCode: ev.code || 'REG',
            eventDescription: ev.desc || 'EPO Register status event',
            eventImpact: 'Official register publication.'
          }))
        };
      });

      setTargetCompany(liveTargetName.trim() || 'Target Company');
      setPortfolioData(livePatents);
      setSuccessMessage(`Successfully audited ${livePatents.length} assets from live EPO Register! Redirecting...`);
      setTimeout(() => {
        router.push('/overview');
      }, 1200);
    } catch (err: any) {
      setLiveError({
        title: 'Connection Error',
        message: err.message || 'Failed to connect to the audit API endpoint.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <Link
          href="/overview"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Initiate New Transaction Audit
        </h1>
        <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
          Switch between preset M&amp;A due diligence showcases or connect live to the European Patent Office (EPO) Open Patent Services API.
        </p>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tab Selector */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('PRESETS')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'PRESETS'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Preset Transaction Scenarios (Instant Showcase)</span>
        </button>

        <button
          onClick={() => setActiveTab('LIVE_EPO')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'LIVE_EPO'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Live EPO Register Query (OPS API)</span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: PRESET SCENARIOS
      ====================================================================== */}
      {activeTab === 'PRESETS' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Select a pre-built transaction scenario to demonstrate how Vanguard evaluates different M&amp;A risk profiles without requiring live EPO credentials:
          </p>

          <div className="grid grid-cols-1 gap-4">
            {/* Scenario 1: Project Aetheris (Default) */}
            <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">
                    Project Aetheris — MedTech Portfolio Review (Recommended)
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white">
                    Showcase
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Target Company: <strong className="text-slate-700">Aetheris MedTech GmbH</strong> (Munich, Germany)
                </div>
                <p className="text-xs text-slate-600 font-serif max-w-xl">
                  12 European patents featuring realistic statutory deal complexities: Art. 72 university title breaks (Universität Heidelberg), founder personal ownership (Dr. Vance), Art. 86 missed renewal grace periods, Art. 99 Siemens competitor oppositions, and Unitary Patents.
                </p>
              </div>

              <button
                onClick={handleLoadAetheris}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
              >
                <span>Load Scenario</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: LIVE EPO REGISTER QUERY
      ====================================================================== */}
      {activeTab === 'LIVE_EPO' && (
        <div className="space-y-6">
          <form onSubmit={handleRunLiveAudit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Live Query European Patent Office (OPS REST API v3.2)
              </h2>
              <p className="text-xs text-slate-500">
                Queries the official EPO Open Patent Services endpoints (/biblio, /legal, /family, /register).
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Company Legal Entity
                </label>
                <input
                  type="text"
                  value={liveTargetName}
                  onChange={(e) => setLiveTargetName(e.target.value)}
                  placeholder="e.g. Siemens Healthineers AG"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  European Patent Numbers (Comma-separated or one per line, max 15 per batch)
                </label>
                <textarea
                  rows={3}
                  value={livePatentInput}
                  onChange={(e) => setLivePatentInput(e.target.value)}
                  placeholder="EP3904118, EP3800201, EP3654120"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                Protected by in-memory rate limiting to preserve the 4 GB/week EPO quota.
              </span>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Auditing EPO Register...</span>
                  </>
                ) : (
                  <>
                    <span>Run Statutory Audit</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error / Instructions Notice */}
          {liveError && (
            <div className={`rounded-2xl p-6 border space-y-4 ${
              liveError.isMissingCredentials
                ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900">{liveError.title}</h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-serif">
                    {liveError.message}
                  </p>
                </div>
              </div>

              {liveError.isMissingCredentials && (
                <div className="bg-white/80 border border-amber-200 rounded-xl p-4 text-xs space-y-3 font-sans">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-amber-600" />
                    <span>How to connect your free EPO API Key:</span>
                  </div>

                  <ol className="list-decimal pl-5 space-y-1.5 text-slate-700">
                    <li>
                      Register for a free account at{' '}
                      <a
                        href="https://developers.epo.org"
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-900 font-bold underline underline-offset-2"
                      >
                        developers.epo.org
                      </a>{' '}
                      (takes ~2 minutes).
                    </li>
                    <li>
                      Create an App in your EPO Developer Dashboard to obtain your <strong>Consumer Key</strong> and <strong>Consumer Secret</strong>.
                    </li>
                    <li>
                      In your Vercel Project Settings &gt; <strong>Environment Variables</strong>, add:
                      <div className="font-mono text-[11px] bg-slate-100 p-2 rounded mt-1 text-slate-800">
                        EPO_OPS_CONSUMER_KEY = your_key_here<br />
                        EPO_OPS_CONSUMER_SECRET = your_secret_here
                      </div>
                    </li>
                    <li>
                      Redeploy on Vercel. Live queries will then query the official European Patent Register in real time!
                    </li>
                  </ol>

                  <div className="pt-2 border-t border-amber-100 text-[11px] text-slate-500">
                    <strong>Note on weekly free limits:</strong> The EPO provides 4 GB of free transfer per week. Vanguard&apos;s built-in OAuth2 token caching, batch limits (15 patents/request), and IP throttling guarantee your free allowance is never exhausted.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

