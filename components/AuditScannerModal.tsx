"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Database,
  ShieldAlert,
  Sparkles,
  Server,
} from "lucide-react";
import { useRecruiterDemo } from "./RecruiterDemoContext";

interface ScannerCheck {
  id: string;
  label: string;
  subtext: string;
  type: "success" | "warning";
  revealAtMs: number;
}

const SCANNER_CHECKS: ScannerCheck[] = [
  {
    id: "check-1",
    label: "Connecting to EPO OPS v3.2 REST API",
    subtext: "OAuth2 Client Credentials authenticated • developers.epo.org (200 OK)",
    type: "success",
    revealAtMs: 1000,
  },
  {
    id: "check-2",
    label: "Verifying Chain of Title under Art. 72 EPC",
    subtext: "Cross-referencing recorded proprietors against Target corporate entities",
    type: "success",
    revealAtMs: 2400,
  },
  {
    id: "check-3",
    label: "Checking Maintenance Fees under Art. 86 EPC (Lapse found)",
    subtext: "Rule 51(2) EPC 6-month surcharge grace period active for EP3800201",
    type: "warning",
    revealAtMs: 3800,
  },
  {
    id: "check-4",
    label: "Inspecting Opposition Register under Art. 99 EPC (Dispute found)",
    subtext: "Article 99(1) EPC formal revocation challenge pending by Siemens Healthcare",
    type: "warning",
    revealAtMs: 5200,
  },
  {
    id: "check-5",
    label: "Generating Statutory M&A Risk Matrix",
    subtext: "Formulating Closing Conditions Precedent (CP) and Specific Indemnity clauses",
    type: "success",
    revealAtMs: 6600,
  },
];

export default function AuditScannerModal() {
  const { isDemoActive, currentStepIndex, playbackSpeed, elapsedTime } =
    useRecruiterDemo();

  const [activeChecks, setActiveChecks] = useState<Record<string, "pending" | "running" | "done">>({});
  const [localElapsedSec, setLocalElapsedSec] = useState<number>(0);

  // Only render when demo is active and at Step 2 (Scanner step)
  const isVisible = isDemoActive && currentStepIndex === 1;
  const totalDuration = 8.0;

  // Run a local visual scan progression so Step 2 still animates smoothly even when auto-advance is paused
  useEffect(() => {
    if (!isVisible) {
      setLocalElapsedSec(0);
      return;
    }

    const tickMs = 100;
    const deltaSec = (tickMs / 1000) * playbackSpeed;
    const interval = setInterval(() => {
      setLocalElapsedSec((prev) => {
        if (prev >= totalDuration) {
          clearInterval(interval);
          return totalDuration;
        }
        return Math.min(totalDuration, prev + deltaSec);
      });
    }, tickMs);

    return () => clearInterval(interval);
  }, [isVisible, playbackSpeed]);

  const effectiveElapsedSec = Math.max(elapsedTime, localElapsedSec);

  // Track progress and update check statuses dynamically
  useEffect(() => {
    if (!isVisible) {
      setActiveChecks({});
      return;
    }

    const effectiveElapsedMs = effectiveElapsedSec * 1000;

    const newStatuses: Record<string, "pending" | "running" | "done"> = {};

    SCANNER_CHECKS.forEach((check, index) => {
      const threshold = check.revealAtMs;
      const priorThreshold = index > 0 ? SCANNER_CHECKS[index - 1].revealAtMs : 0;

      if (effectiveElapsedMs >= threshold) {
        newStatuses[check.id] = "done";
      } else if (effectiveElapsedMs >= priorThreshold) {
        newStatuses[check.id] = "running";
      } else {
        newStatuses[check.id] = "pending";
      }
    });

    setActiveChecks(newStatuses);
  }, [isVisible, effectiveElapsedSec]);

  if (!isVisible) return null;

  const progressPct = Math.min(100, Math.round((effectiveElapsedSec / totalDuration) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 pb-28 sm:pb-32 animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="relative w-full max-w-xl max-h-[82vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-8 text-white shadow-2xl space-y-6">
        {/* Animated Scanning Laser Line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 font-mono">
                Real-Time EPO OPS Registry Scan
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Statutory Due Diligence Engine
            </h2>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Server className="w-3.5 h-3.5 text-slate-500" />
              <span>Target:</span>
              <strong className="text-slate-200">Aetheris MedTech GmbH</strong>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">5 Disclosed Patents</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-mono font-black text-emerald-400">
              {progressPct}%
            </div>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              {playbackSpeed}x Speed
            </span>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-150"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Querying European Patent Register...</span>
            <span>EPC Statutory Modules 1–5</span>
          </div>
        </div>

        {/* 5 Real-Time Backend Checks List */}
        <div className="space-y-2.5">
          {SCANNER_CHECKS.map((check) => {
            const status = activeChecks[check.id] || "pending";
            const isDone = status === "done";
            const isRunning = status === "running";

            return (
              <div
                key={check.id}
                className={`p-3 rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                  isDone
                    ? check.type === "warning"
                      ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
                      : "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                    : isRunning
                    ? "bg-slate-800/80 border-slate-600 text-white shadow-xs"
                    : "bg-slate-800/30 border-slate-800/60 text-slate-500"
                }`}
              >
                {/* Status Indicator Icon */}
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    check.type === "warning" ? (
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                        <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    )
                  ) : isRunning ? (
                    <div className="w-5 h-5 rounded-full bg-slate-700 text-emerald-400 flex items-center justify-center">
                      <Loader2 className="w-3 h-3 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-bold tracking-tight ${
                        isDone
                          ? check.type === "warning"
                            ? "text-amber-300"
                            : "text-emerald-300"
                          : isRunning
                          ? "text-white"
                          : "text-slate-500"
                      }`}
                    >
                      {check.label}
                    </span>

                    {isDone && (
                      <span
                        className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded font-bold shrink-0 ${
                          check.type === "warning"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {check.type === "warning" ? "Flagged" : "Verified"}
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-[11px] mt-0.5 line-clamp-1 font-serif ${
                      isDone
                        ? check.type === "warning"
                          ? "text-amber-200/80"
                          : "text-slate-300"
                        : "text-slate-500"
                    }`}
                  >
                    {check.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Footer Note */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Building executive transaction audit matrix...</span>
          </div>
          <span className="text-slate-500 font-mono text-[10px]">
            Step 2/5 • Live Simulation
          </span>
        </div>
      </div>
    </div>
  );
}
