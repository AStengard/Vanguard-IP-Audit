"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Layers,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  FileSpreadsheet,
  Building2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useDeal, EvaluatedAsset } from '@/components/DealContext';

export default function PortfolioPage() {
  const { targetCompany, evaluatedPortfolio, metrics, downloadCsv } = useDeal();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'CLEAN'>('ALL');

  // Filtered list based on search and risk filter
  const filteredAssets = useMemo(() => {
    return evaluatedPortfolio.filter((asset) => {
      // Risk filter
      if (filterRisk !== 'ALL' && asset.overallRisk !== filterRisk) {
        return false;
      }
      // Search query (matches ID, title, app number, proprietor, primary issue)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = asset.id.toLowerCase().includes(query);
        const matchesTitle = asset.title.toLowerCase().includes(query);
        const matchesAppNo = asset.applicationNumber.toLowerCase().includes(query);
        const matchesProprietor = asset.registeredProprietor.toLowerCase().includes(query);
        const matchesIssue = asset.primaryIssue.toLowerCase().includes(query);
        return matchesId || matchesTitle || matchesAppNo || matchesProprietor || matchesIssue;
      }
      return true;
    });
  }, [evaluatedPortfolio, filterRisk, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* =====================================================================
          1. HEADER & ACTION BAR
      ====================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/overview" className="hover:text-slate-900 transition">
              Overview
            </Link>
            <span>/</span>
            <span className="text-slate-900">Portfolio Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Schedule 3.14 — Disclosed Patent Assets
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Statutory legal due diligence audit for <strong className="text-slate-900">{targetCompany}</strong>. 
            Click any patent to review its 5-pillar EPC audit scorecard, legal history, and recommended contract remedy.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={downloadCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs shadow-2xs transition cursor-pointer"
            title="Download Schedule 3.14 spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Schedule 3.14 (CSV)</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          2. SEARCH & FILTER CONTROLS
      ====================================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by EP number, title, recorded owner, issue..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterRisk('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterRisk === 'ALL'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Assets ({metrics.total})
          </button>

          <button
            onClick={() => setFilterRisk('CRITICAL')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterRisk === 'CRITICAL'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Critical Red Flags ({metrics.critical})</span>
          </button>

          <button
            onClick={() => setFilterRisk('WARNING')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterRisk === 'WARNING'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Material Warnings ({metrics.warning})</span>
          </button>

          <button
            onClick={() => setFilterRisk('CLEAN')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterRisk === 'CLEAN'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Clean ({metrics.clean})</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          3. FULL PORTFOLIO TABLE
      ====================================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Patent Identifier &amp; Title</th>
                <th className="py-3.5 px-4">Chain of Title</th>
                <th className="py-3.5 px-4">Due Diligence Standing</th>
                <th className="py-3.5 px-4">Primary Legal Finding</th>
                <th className="py-3.5 px-4">Recommended Contract Action</th>
                <th className="py-3.5 px-4 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No patent assets match your search query or selected filter.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset, index) => {
                  const isCritical = asset.overallRisk === 'CRITICAL';
                  const isWarning = asset.overallRisk === 'WARNING';
                  const isClean = asset.overallRisk === 'CLEAN';

                  return (
                    <tr
                      key={asset.id}
                      className="hover:bg-slate-50/80 transition group"
                    >
                      {/* Schedule Row Index */}
                      <td className="py-4 px-4 text-center font-mono text-[11px] text-slate-400">
                        {String(index + 1).padStart(2, '0')}
                      </td>

                      {/* Patent Identifier & Title */}
                      <td className="py-4 px-4">
                        <div className="space-y-1 max-w-sm">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              href={`/patent/${asset.id}`}
                              className="font-mono font-bold text-slate-900 hover:text-emerald-700 underline underline-offset-2 decoration-slate-300 hover:decoration-emerald-700 transition"
                            >
                              {asset.id}
                            </Link>
                            {asset.unitaryPatent && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                UP (17 States)
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-mono">
                              App: {asset.applicationNumber}
                            </span>
                          </div>
                          <div className="text-slate-700 font-medium line-clamp-1 group-hover:text-slate-900 transition">
                            {asset.title}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {asset.yearsRemaining > 0 ? (
                              <span>Term Runway: ~{asset.yearsRemaining} yrs ({asset.monthsRemaining} mos)</span>
                            ) : (
                              <span className="text-rose-600 font-semibold">Expired / Near Lapse</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Chain of Title & Registered Owner */}
                      <td className="py-4 px-4">
                        <div className="space-y-1 max-w-[200px]">
                          <div className="text-[11px] font-semibold text-slate-800 line-clamp-1" title={asset.registeredProprietor}>
                            {asset.registeredProprietor}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`inline-block w-2 h-2 rounded-full ${
                                asset.titleMatchPct >= 90
                                  ? 'bg-emerald-500'
                                  : asset.titleMatchPct >= 70
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                            />
                            <span className="text-[10px] font-bold text-slate-500">
                              {asset.titleMatchPct}% match to target
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Due Diligence Standing Status Pill */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {isCritical && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-800 border border-rose-200">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                            <span>CRITICAL RISK</span>
                          </span>
                        )}
                        {isWarning && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>WARNING</span>
                          </span>
                        )}
                        {isClean && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>VERIFIED CLEAN</span>
                          </span>
                        )}
                      </td>

                      {/* Primary Legal Finding */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="text-slate-800 font-semibold line-clamp-2">
                          {asset.primaryIssue}
                        </div>
                      </td>

                      {/* Recommended Contract Action */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="text-[11px] text-slate-600 line-clamp-2">
                          {asset.recommendedAction}
                        </div>
                      </td>

                      {/* Action CTA Link */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <Link
                          href={`/patent/${asset.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-700 text-xs font-bold transition shadow-2xs"
                        >
                          <span>Review</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
          <div>
            Showing <strong className="text-slate-900">{filteredAssets.length}</strong> of{' '}
            <strong className="text-slate-900">{metrics.total}</strong> disclosed patent assets in active transaction schedule
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <strong>{metrics.critical}</strong> Critical Red Flags
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <strong>{metrics.warning}</strong> Warnings
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <strong>{metrics.clean}</strong> Clean
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

