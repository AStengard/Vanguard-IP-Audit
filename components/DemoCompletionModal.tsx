"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  FileText,
  RotateCcw,
  Compass,
  ExternalLink,
  Github,
  Sparkles,
  X,
  Building2,
  Scale,
} from "lucide-react";
import { useRecruiterDemo } from "./RecruiterDemoContext";
import { useDeal } from "./DealContext";

export default function DemoCompletionModal() {
  const { isDemoActive, isCompleted, exitDemo, startDemo } = useRecruiterDemo();
  const { targetCompany } = useDeal();

  // Only render when the demo is active and marked as completed
  if (!isDemoActive || !isCompleted) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in zoom-in-95 duration-200">
      {/* Background Decorative Radial Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Celebration Card */}
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-8 text-white shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={exitDemo}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          title="Close and explore app (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Celebration Badge & Title */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tour Completed</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Target: {targetCompany || "Aetheris MedTech GmbH"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20 font-black">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Audit Complete — 5 Assets Verified
              </h2>
              <p className="text-xs text-emerald-400 font-medium mt-0.5">
                European Patent Convention (EPC) Statutory Diligence Executed
              </p>
            </div>
          </div>

          {/* Highlights Summary Banner */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 text-xs text-slate-300 font-serif leading-relaxed">
            <strong className="text-white font-sans block mb-0.5">
              Executive Findings Summary:
            </strong>
            1 Chain-of-Title Break flagged • 1 Statutory Lapse detected • SPA Indemnity Schedule Generated
          </div>
        </div>

        {/* 4 Statutory Result Scorecard Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {/* Tile 1: Chain of Title */}
          <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Art. 72 EPC Title Break</span>
              </span>
              <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Critical
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-serif leading-snug">
              Unrecorded academic assignment to university. Closing CP § 7.02(f) generated requiring confirmatory assignment.
            </p>
          </div>

          {/* Tile 2: Annuities */}
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Art. 86 Maintenance</span>
              </span>
              <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Lapse Window
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-serif leading-snug">
              Year 6 missed annuity in 6-month surcharge grace period (Rule 51(2) EPC). Seller payoff covenant attached.
            </p>
          </div>

          {/* Tile 3: Oppositions */}
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>Art. 99 Oppositions</span>
              </span>
              <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Pending
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-serif leading-snug">
              Revocation challenge pending by Siemens Healthcare. Indemnity and escrow retention allocated.
            </p>
          </div>

          {/* Tile 4: Deliverables */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Contract Deliverables</span>
              </span>
              <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Generated
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-serif leading-snug">
              Executive Legal Memo, Schedule 3.14 spreadsheet (CSV), and draft SPA clauses ready for signature.
            </p>
          </div>
        </div>

        {/* Action Controls & External Links */}
        <div className="pt-2 border-t border-slate-800 space-y-2.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Primary Action: Explore the App Freely */}
            <button
              type="button"
              onClick={exitDemo}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:shadow-xl transition cursor-pointer group"
              title="Close tour and explore all features, filters, and reports with loaded data"
            >
              <Compass className="w-4 h-4 text-slate-950 group-hover:rotate-45 transition-transform" />
              <span>Explore the App Freely</span>
            </button>

            {/* Secondary Action: Restart Demo */}
            <button
              type="button"
              onClick={startDemo}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-slate-700 transition cursor-pointer"
              title="Replay the 5-step auto walkthrough from Step 1"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Demo</span>
            </button>
          </div>

          {/* Contact Alfred Stengard / GitHub */}
          <a
            href="https://github.com/alfredstengard"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/80 transition cursor-pointer"
          >
            <Github className="w-4 h-4 text-slate-400" />
            <span>Contact Alfred Stengard / GitHub Profile</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </div>
      </div>
    </div>
  );
}
