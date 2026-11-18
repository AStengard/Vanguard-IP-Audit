"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useRecruiterDemo } from "./RecruiterDemoContext";

export const SCANNER_MIN_DURATION_MS = 8000;
export const SCANNER_LIVE_HOLD_MS = 2200;
export const SCANNER_POST_API_MIN_MS = 4400;

export interface LiveScanFlags {
  chainOfTitleFlagged: boolean;
  maintenanceFlagged: boolean;
  oppositionFlagged: boolean;
  notFoundCount?: number;
}

export interface AuditScannerModalProps {
  /** Controlled mode: when defined, overrides demo-only visibility */
  isOpen?: boolean;
  /** Target company name displayed in the scanner header */
  targetName?: string;
  /** Number of patents being scanned */
  patentCount?: number;
  /** Whether the underlying data request has resolved and results are ready */
  isApiReady?: boolean;
  /** Actual pillar findings from live EPO or showcase evaluation */
  liveFlags?: LiveScanFlags | null;
  /** Optional short label under percentage (e.g. "Live API" or "Showcase") */
  modeBadge?: string;
  /** Optional footer right-hand tag */
  footerTag?: string;
}

interface ScannerCheck {
  id: string;
  label: string;
  defaultType: "success" | "warning";
  requiresApiData?: boolean;
  revealAtMs: number;
}

const SCANNER_CHECKS: ScannerCheck[] = [
  {
    id: "check-1",
    label: "Connecting to EPO OPS v3.2 REST API",
    defaultType: "success",
    revealAtMs: 1000,
  },
  {
    id: "check-2",
    label: "Verifying Chain of Title under Art. 72 EPC",
    defaultType: "warning",
    requiresApiData: true,
    revealAtMs: 2400,
  },
  {
    id: "check-3",
    label: "Checking Maintenance Fees under Art. 86 EPC",
    defaultType: "warning",
    requiresApiData: true,
    revealAtMs: 3800,
  },
  {
    id: "check-4",
    label: "Inspecting Opposition Register under Art. 99 EPC",
    defaultType: "warning",
    requiresApiData: true,
    revealAtMs: 5200,
  },
  {
    id: "check-5",
    label: "Generating Statutory M&A Risk Matrix",
    defaultType: "success",
    requiresApiData: true,
    revealAtMs: 6600,
  },
];

export default function AuditScannerModal({
  isOpen,
  targetName,
  patentCount,
  isApiReady = true,
  liveFlags = null,
  modeBadge,
  footerTag,
}: AuditScannerModalProps = {}) {
  const { isDemoActive, currentStepIndex, playbackSpeed, elapsedTime } =
    useRecruiterDemo();

  const [activeChecks, setActiveChecks] = useState<Record<string, "pending" | "running" | "done">>({});
  const [localElapsedSec, setLocalElapsedSec] = useState<number>(0);
  const [didWaitForApi, setDidWaitForApi] = useState<boolean>(false);

  const isLiveMode = isOpen !== undefined;
  const isVisible = isLiveMode ? Boolean(isOpen) : isDemoActive && currentStepIndex === 1;
  const totalDuration = SCANNER_MIN_DURATION_MS / 1000;
  const holdCapSec = SCANNER_LIVE_HOLD_MS / 1000;
  // Once the live API finishes after holding on Check 2, step smoothly through Checks 2–5 at 1.4x
  // so every checkpoint reveals Verified/Flagged one by one in ~4.1s without bunching at the end
  const effectiveSpeed = isLiveMode ? (didWaitForApi && isApiReady ? 1.4 : 1) : playbackSpeed;

  // Run a local visual scan progression so Step 2 animates when paused and live audits reveal step-by-step
  useEffect(() => {
    if (!isVisible) {
      setLocalElapsedSec(0);
      setDidWaitForApi(false);
      return;
    }

    const tickMs = 100;
    const deltaSec = (tickMs / 1000) * effectiveSpeed;
    const interval = setInterval(() => {
      setLocalElapsedSec((prev) => {
        const cap = isLiveMode && !isApiReady ? holdCapSec : totalDuration;
        if (prev >= cap) {
          return prev;
        }
        return Math.min(cap, prev + deltaSec);
      });
    }, tickMs);

    return () => clearInterval(interval);
  }, [isVisible, effectiveSpeed, isLiveMode, isApiReady, totalDuration, holdCapSec]);

  // Track if the live scanner had to wait at the hold point for the EPO API response
  useEffect(() => {
    if (isLiveMode && isVisible && !isApiReady && localElapsedSec >= holdCapSec) {
      setDidWaitForApi(true);
    }
  }, [isLiveMode, isVisible, isApiReady, localElapsedSec, holdCapSec]);

  const effectiveElapsedSec = isLiveMode
    ? localElapsedSec
    : Math.max(elapsedTime, localElapsedSec);

  // Track progress and update check statuses sequentially (only one check runs at a time)
  useEffect(() => {
    if (!isVisible) {
      setActiveChecks({});
      return;
    }

    const effectiveElapsedMs = effectiveElapsedSec * 1000;
    const newStatuses: Record<string, "pending" | "running" | "done"> = {};

    SCANNER_CHECKS.forEach((check, index) => {
      const threshold = check.revealAtMs;
      const priorDone = index === 0 || newStatuses[SCANNER_CHECKS[index - 1].id] === "done";
      const canFinish = !isLiveMode || !check.requiresApiData || isApiReady;

      if (priorDone && effectiveElapsedMs >= threshold && canFinish) {
        newStatuses[check.id] = "done";
      } else if (priorDone) {
        newStatuses[check.id] = "running";
      } else {
        newStatuses[check.id] = "pending";
      }
    });

    setActiveChecks(newStatuses);
  }, [isVisible, effectiveElapsedSec, isLiveMode, isApiReady]);

  if (!isVisible) return null;

  const progressPct = Math.min(100, Math.round((effectiveElapsedSec / totalDuration) * 100));
  const displayTarget = targetName || "Aetheris MedTech GmbH";
  const displayCount = patentCount ?? 12;

  const resolveCheckType = (check: ScannerCheck): "success" | "warning" => {
    if (!isLiveMode || !liveFlags) return check.defaultType;
    if (check.id === "check-2") return liveFlags.chainOfTitleFlagged ? "warning" : "success";
    if (check.id === "check-3") return liveFlags.maintenanceFlagged ? "warning" : "success";
    if (check.id === "check-4") return liveFlags.oppositionFlagged ? "warning" : "success";
    if (check.id === "check-5" && (liveFlags.notFoundCount || 0) > 0) return "warning";
    return check.defaultType;
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 ${
        isLiveMode ? "" : "pb-28 sm:pb-32"
      } animate-in fade-in duration-200`}
    >
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
              Live EPO Statutory Audit Scanner
            </h2>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <span>Target:</span>
              <strong className="text-slate-200">{displayTarget}</strong>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">
                {displayCount} Disclosed {displayCount === 1 ? "Patent" : "Patents"}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-mono font-black text-emerald-400">
              {progressPct}%
            </div>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              {isLiveMode ? modeBadge || "Live API" : `${playbackSpeed}x Speed`}
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
            const checkType = resolveCheckType(check);

            return (
              <div
                key={check.id}
                className={`p-3.5 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                  isDone
                    ? checkType === "warning"
                      ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
                      : "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                    : isRunning
                    ? "bg-slate-800/80 border-slate-600 text-white shadow-xs"
                    : "bg-slate-800/30 border-slate-800/60 text-slate-500"
                }`}
              >
                {/* Status Indicator Icon */}
                <div className="shrink-0">
                  {isDone ? (
                    checkType === "warning" ? (
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
                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-bold tracking-tight ${
                      isDone
                        ? checkType === "warning"
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
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold shrink-0 ${
                        checkType === "warning"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {check.id === "check-5" && isLiveMode && (liveFlags?.notFoundCount || 0) > 0
                        ? `${liveFlags?.notFoundCount} Not Found`
                        : checkType === "warning"
                        ? "Flagged"
                        : "Verified"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Footer Note */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Building executive transaction audit matrix...</span>
          <span className="text-slate-500 font-mono text-[10px]">
            {isLiveMode ? footerTag || "EPO OPS v3.2 • Live Query" : "Step 2/5 • Live Simulation"}
          </span>
        </div>
      </div>
    </div>
  );
}
