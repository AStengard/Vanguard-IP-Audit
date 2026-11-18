"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  Scale,
  ShieldAlert,
  FileText,
  Database,
} from "lucide-react";
import { useRecruiterDemo } from "./RecruiterDemoContext";

interface StepNarration {
  tag: string;
  tagColor: string;
  icon: React.ElementType;
  title: string;
  body: string;
  bullets?: string[];
  dealImpact: string;
}

const STEP_NARRATIONS: Record<number, StepNarration> = {
  0: {
    tag: "Target Ingestion",
    tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    icon: Database,
    title: "Automated Target & Portfolio Ingestion",
    body: "The auditor simulates ingestion of target entity 'Aetheris MedTech GmbH' and all 12 European patent assets, preparing to cross-examine company disclosures against official European Patent Register records.",
    dealImpact: "Buyers routinely discover target companies don't legally own the patents disclosed on Schedule 3.14 due to missing written assignment deeds.",
  },
  1: {
    tag: "Live EPO Query",
    tagColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    icon: Scale,
    title: "EPC Due Diligence Registry Scanner",
    body: "Querying simulated EPO OPS v3.2 REST endpoints across five core EPC due diligence checks: Art. 72 (Chain of Title), Art. 86 (Annuity Maintenance), Art. 99 (Opposition Period), and Unitary Patent standing.",
    dealImpact: "Manual patent register inspection across 39 member states takes days. Vanguard's statutory engine parses legal status and INPADOC legal events in seconds.",
  },
  2: {
    tag: "4 Critical Red Flags",
    tagColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    icon: ShieldAlert,
    title: "4 Distinct Critical Red Flags Detected",
    body: "Across the 12-asset portfolio, the statutory engine surfaces 4 critical deal blockers (plus material warnings) that cannot close on standard warranties:",
    bullets: [
      "EP3491024B1 — Unrecorded university transfer (Charité Berlin, Art. 72 EPC)",
      "EP3589102B1 — Active post-grant opposition proceedings (Art. 99 EPC)",
      "EP3305198B1 — Statutory lapse from unpaid renewal fees (Art. 86 EPC)",
      "EP3618440B1 — Founder personal ownership (Dr. Lukas Vance, Art. 72 EPC)",
    ],
    dealImpact: "Each flag triggers its own tailored SPA safeguard: Confirmatory Assignment CPs for title breaks, a Special Escrow Holdback & Indemnity for active opposition, and a purchase price cut for the lapsed patent.",
  },
  3: {
    tag: "Schedule 3.14 Table",
    tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    icon: FileText,
    title: "Schedule 3.14 Portfolio Breakdown",
    body: "Displaying the complete 12-asset audited patent schedule with legal standing, national validation status across DE/FR/GB/IT, Unitary Patent coverage, and Rule 51(2) renewal grace periods.",
    dealImpact: "Generates audit-ready Schedule 3.14 disclosures for the Share Purchase Agreement (SPA) and provides instant 1-click CSV spreadsheet export for investment committees.",
  },
  4: {
    tag: "Executive Deliverables",
    tagColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    icon: Sparkles,
    title: "Law Firm Memo & SPA Covenants",
    body: "Reviewing the formal partner-level Legal Due Diligence Memorandum, complete with tailored SPA warranty clauses (Section 3.14), specific indemnity protections, and closing escrow retentions.",
    dealImpact: "Bridges the gap between patent data and corporate law: translates complex patent register defects directly into binding transactional contract clauses.",
  },
};

export default function DemoNarratorBox() {
  const { isDemoActive, currentStepIndex, isCompleted } = useRecruiterDemo();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Only display when demo is active and before the final completion celebration card
  if (!isDemoActive || isCompleted) return null;

  const narration = STEP_NARRATIONS[currentStepIndex] || STEP_NARRATIONS[0];
  const Icon = narration.icon;

  return (
    <aside
      aria-label="Recruiter Demo Explainer Box"
      className="fixed top-20 right-3 sm:right-6 z-40 w-[94%] sm:w-92 md:w-96 transition-all duration-300 animate-in fade-in slide-in-from-right-4 duration-300 print:hidden"
    >
      <div className="relative bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Subtle glowing top accent line */}
        <div className="h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

        {/* Header Row */}
        <div className="p-3 sm:px-4 sm:py-3 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 truncate">
                Tour Commentary
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                Step {currentStepIndex + 1}/5
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Collapse / Expand Toggle */}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[10px] font-mono transition cursor-pointer flex items-center gap-1"
              title={isCollapsed ? "Expand explanation box" : "Collapse explanation box"}
            >
              {isCollapsed ? (
                <>
                  <span>Show</span>
                  <ChevronDown className="w-3 h-3" />
                </>
              ) : (
                <>
                  <span>Hide</span>
                  <ChevronUp className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Body Content (Collapsible) */}
        {!isCollapsed && (
          <div
            key={currentStepIndex}
            className="p-3.5 sm:p-4 space-y-3 animate-in fade-in duration-200"
          >
            {/* Category Tag & Step Title */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${narration.tagColor}`}
                >
                  {narration.tag}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-black tracking-tight text-white">
                {narration.title}
              </h3>
            </div>

            {/* What is happening explanation */}
            <p className="text-[11px] text-slate-300 leading-relaxed font-serif">
              {narration.body}
            </p>

            {/* Optional multi-flag breakdown list */}
            {narration.bullets && narration.bullets.length > 0 && (
              <ul className="space-y-1.5 text-[11px] text-slate-200 font-sans bg-slate-800/60 border border-slate-700/70 rounded-xl p-2.5">
                {narration.bullets.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-snug">
                    <span className="text-rose-400 font-mono font-bold shrink-0">
                      {idx + 1}.
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
