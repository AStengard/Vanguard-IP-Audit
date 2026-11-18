"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  History,
  Building2,
  Calendar,
  Layers,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Pencil,
  Trash2,
  Check,
  X,
  ArrowRight,
  ExternalLink,
  FileSpreadsheet,
  Plus,
  Play,
  RotateCcw
} from 'lucide-react';
import { useDeal, SavedAuditRecord } from '@/components/DealContext';

export default function HistoryPage() {
  const router = useRouter();
  const {
    savedAudits,
    activeAuditId,
    targetCompany,
    loadSavedAudit,
    renameSavedAudit,
    deleteSavedAudit,
    clearAllSavedAudits,
    resetToShowcase,
    clearDeal,
    downloadCsv
  } = useDeal();

  // State for inline renaming
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameText, setEditNameText] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const startEditing = (audit: SavedAuditRecord) => {
    setEditingId(audit.id);
    setEditNameText(audit.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditNameText('');
  };

  const handleSaveRename = (id: string) => {
    if (editNameText.trim()) {
      renameSavedAudit(id, editNameText.trim());
    }
    setEditingId(null);
    setEditNameText('');
  };

  const handleLoadAndOpen = (id: string) => {
    loadSavedAudit(id);
    router.push('/overview');
  };

  // Export CSV for an archived audit
  const handleExportAuditCsv = (audit: SavedAuditRecord) => {
    const headers = [
      'Schedule_Ref',
      'Patent_ID',
      'Application_No',
      'Title',
      'Registered_Proprietor',
      'Target_Entity',
      'Remaining_Term_Years',
      'Unitary_Patent'
    ];

    const rows = audit.portfolioData.map((p, idx) => [
      `3.14(a)-${String(idx + 1).padStart(2, '0')}`,
      p.id,
      p.applicationNumber,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.registeredProprietor.replace(/"/g, '""')}"`,
      `"${audit.targetCompany.replace(/"/g, '""')}"`,
      p.yearsRemaining || 10,
      p.unitaryPatent ? 'Yes' : 'No'
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SPA_Schedule_3.14_${audit.targetCompany.replace(/\s+/g, '_')}_Audit.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* =====================================================================
          1. HEADER & ACTIONS
      ====================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/overview" className="hover:text-slate-900 transition">
              Overview
            </Link>
            <span>/</span>
            <span className="text-slate-900">Audit History &amp; Deal Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Diligence History &amp; Deal Vault
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Archived European Patent M&amp;A scans. Re-open previous transaction audits, rename transaction files, or delete completed records.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {targetCompany && (
            <button
              onClick={downloadCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs shadow-2xs transition cursor-pointer"
              title="Download Schedule 3.14 spreadsheet for currently active deal"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>
          )}

          <Link
            href="/"
            onClick={() => {
              clearDeal();
              try {
                sessionStorage.setItem('vanguard_focus_new_audit', '1');
              } catch {
                // Ignore storage restrictions
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>New Diligence Audit</span>
          </Link>

          {savedAudits.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all archived scans from your history?')) {
                  clearAllSavedAudits();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 text-xs font-semibold shadow-2xs transition cursor-pointer"
              title="Clear all saved scans from browser storage"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* =====================================================================
          2. EMPTY STATE (When no scans exist yet)
      ====================================================================== */}
      {savedAudits.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-6 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <History className="w-7 h-7 text-slate-500" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">No Diligence Scans Archived Yet</h2>
            <p className="text-xs text-slate-500 font-serif leading-relaxed">
              When you run an audit on a European patent portfolio or launch the showcase deal, your scans are automatically saved here so you can review and rename them anytime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow-xs"
            >
              <span>Start Your First Audit</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>

            <button
              onClick={() => {
                resetToShowcase();
                router.push('/overview');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Load Showcase Deal</span>
            </button>
          </div>
        </div>
      ) : (
        /* ===================================================================
            3. SAVED SCANS REGISTRY LIST
        ==================================================================== */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong className="text-slate-900">{savedAudits.length}</strong> archived transaction {savedAudits.length === 1 ? 'scan' : 'scans'}
            </span>
            <span className="text-[11px] text-slate-400">
              Saved locally in browser storage
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {savedAudits.map((audit) => {
              const isActive = activeAuditId === audit.id || (targetCompany && targetCompany.toLowerCase() === audit.targetCompany.toLowerCase());
              const isEditing = editingId === audit.id;
              const isDeleting = deleteConfirmId === audit.id;

              const formattedDate = new Date(audit.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={audit.id}
                  className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-xs transition space-y-4 ${
                    isActive
                      ? 'border-emerald-300 ring-1 ring-emerald-500/20 bg-gradient-to-r from-emerald-50/20 to-white'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top Bar: Title, Active Badge, and Timestamp */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-wrap flex-1">
                      {/* Active Status Badge */}
                      {isActive && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span>Active Session</span>
                        </span>
                      )}

                      {/* Editable Scan Name */}
                      {isEditing ? (
                        <div className="flex items-center gap-2 flex-1 max-w-md">
                          <input
                            type="text"
                            value={editNameText}
                            onChange={(e) => setEditNameText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRename(audit.id);
                              if (e.key === 'Escape') cancelEditing();
                            }}
                            autoFocus
                            className="px-3 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 w-full"
                          />
                          <button
                            onClick={() => handleSaveRename(audit.id)}
                            className="p-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                            title="Save new name"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-slate-900">
                            {audit.name}
                          </h3>
                          <button
                            onClick={() => startEditing(audit)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            title="Rename this scan"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  {/* Metadata Row: Target, Total, Risk Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Target Company
                      </span>
                      <span className="font-bold text-slate-800 line-clamp-1">{audit.targetCompany}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Disclosed Assets
                      </span>
                      <span className="font-semibold text-slate-800">{audit.portfolioData.length} European Patents</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Statutory Standing
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {audit.metrics.critical > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                            {audit.metrics.critical} Critical
                          </span>
                        )}
                        {audit.metrics.warning > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            {audit.metrics.warning} Warnings
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {audit.metrics.clean} Clean
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Title Cleanliness
                      </span>
                      <span className="font-semibold text-emerald-700">{audit.metrics.cleanPct}% Clean Exclusivity</span>
                    </div>
                  </div>

                  {/* Actions Toolbar: Open, Rename, Export, Delete */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLoadAndOpen(audit.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                      >
                        <span>Open &amp; Review Scan</span>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                      </button>

                      <button
                        onClick={() => handleExportAuditCsv(audit)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs shadow-2xs transition cursor-pointer"
                        title="Download Schedule 3.14 spreadsheet for this audit"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="hidden sm:inline">Export CSV</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => startEditing(audit)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs transition cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5 text-slate-400" />
                        <span>Rename</span>
                      </button>

                      {isDeleting ? (
                        <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 p-1 px-2 rounded-xl text-xs">
                          <span className="text-rose-800 font-bold text-[11px]">Delete?</span>
                          <button
                            onClick={() => {
                              deleteSavedAudit(audit.id);
                              setDeleteConfirmId(null);
                            }}
                            className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] cursor-pointer"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[10px] cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(audit.id)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-700 border border-slate-200 font-semibold text-xs transition cursor-pointer"
                          title="Remove this scan from history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
