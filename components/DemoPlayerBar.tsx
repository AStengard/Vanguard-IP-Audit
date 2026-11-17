"use client";

import React from "react";
import {
  Play,
  Pause,
  SkipForward,
  X,
  Sparkles,
  RotateCcw,
  FastForward,
} from "lucide-react";
import { useRecruiterDemo } from "./RecruiterDemoContext";

export default function DemoPlayerBar() {
  const {
    isDemoActive,
    isPlaying,
    currentStepIndex,
    playbackSpeed,
    elapsedTime,
    steps,
    currentStep,
    stepProgress,
    isCompleted,
    pauseDemo,
    resumeDemo,
    nextStep,
    exitDemo,
    togglePlaybackSpeed,
    jumpToStep,
  } = useRecruiterDemo();

  // Don't render anything if demo mode is inactive
  if (!isDemoActive) return null;

  return (
    <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[96%] sm:w-auto sm:min-w-[580px] max-w-2xl bg-slate-900/95 text-white backdrop-blur shadow-2xl rounded-2xl border border-slate-700/80 p-2.5 sm:px-5 sm:py-3.5 flex flex-col gap-2 sm:gap-2.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 print:hidden">
      {/* ===================================================================
          TOP ROW: STEP INFO & PLAYBACK CONTROLS
      ==================================================================== */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        {/* LEFT: STEP LABEL & STATUS */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          {/* Animated Status Indicator Dot */}
          <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 shrink-0">
            {isPlaying && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 ${
                isCompleted
                  ? "bg-teal-400"
                  : isPlaying
                  ? "bg-emerald-400"
                  : "bg-amber-400"
              }`}
            />
          </span>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] sm:text-sm font-black tracking-tight text-white truncate max-w-[160px] xs:max-w-[220px] sm:max-w-none">
                {isCompleted ? "Demo Complete — All Steps Finished" : currentStep.label}
              </span>
              <span className="hidden md:inline-flex items-center text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Auto-Tour
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 truncate max-w-[150px] xs:max-w-[200px] sm:max-w-md font-serif">
              {isCompleted
                ? "Click restart to replay tour or explore portfolio freely."
                : currentStep.description}
            </span>
          </div>
        </div>

        {/* RIGHT: CONTROL BUTTONS */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Speed Toggle (1x / 2x) */}
          <button
            type="button"
            onClick={togglePlaybackSpeed}
            className="px-1.5 sm:px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-[10px] sm:text-[11px] font-mono font-bold text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1"
            title={`Playback speed: ${playbackSpeed}x (Click to switch)`}
          >
            <FastForward className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
            <span>{playbackSpeed}x</span>
          </button>

          {/* Play / Pause / Replay Button */}
          <button
            type="button"
            onClick={isPlaying ? pauseDemo : resumeDemo}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold transition shadow-xs cursor-pointer group shrink-0"
            title={
              isCompleted
                ? "Restart demo from beginning"
                : isPlaying
                ? "Pause demo (Space)"
                : "Resume demo"
            }
          >
            {isCompleted ? (
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current stroke-2" />
            ) : isPlaying ? (
              <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Skip Step Button */}
          <button
            type="button"
            onClick={nextStep}
            disabled={isCompleted}
            className="inline-flex items-center gap-1 h-7 sm:h-8 px-2 sm:px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-[11px] sm:text-xs font-semibold text-slate-200 hover:text-white transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            title="Skip to next step"
          >
            <span className="hidden sm:inline">Skip Step</span>
            <SkipForward className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 group-hover:text-white" />
          </button>

          {/* Exit Demo Close Icon (X) */}
          <button
            type="button"
            onClick={exitDemo}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 flex items-center justify-center transition cursor-pointer shrink-0"
            title="Exit Demo (Esc)"
            aria-label="Exit Demo"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* ===================================================================
          BOTTOM ROW: ANIMATED MULTI-SEGMENT PROGRESS BAR
      ==================================================================== */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 w-full">
          {steps.map((step, idx) => {
            let width = "0%";
            if (isCompleted || idx < currentStepIndex) {
              width = "100%";
            } else if (idx === currentStepIndex) {
              width = `${stepProgress}%`;
            }

            const isCurrent = idx === currentStepIndex && !isCompleted;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => jumpToStep(idx)}
                className="flex-1 h-1.5 bg-slate-800 hover:bg-slate-700 rounded-full overflow-hidden transition-all duration-150 cursor-pointer relative group/step focus:outline-none"
                title={`${step.label}: ${step.title} (Click to jump)`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-100 ${
                    isCurrent
                      ? "bg-gradient-to-r from-emerald-500 to-teal-300"
                      : "bg-emerald-500/80"
                  }`}
                  style={{ width }}
                />
              </button>
            );
          })}
        </div>

        {/* BOTTOM METADATA & SHORTCUT HINT */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 px-0.5">
          <div className="flex items-center gap-2">
            <span>
              {isCompleted
                ? "Tour Completed"
                : `${Math.round(elapsedTime)}s / ${currentStep.duration}s`}
            </span>
            <span className="text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-500">
              Click any bar segment to jump
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Press</span>
            <kbd className="px-1 py-0.2 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[9px]">
              Esc
            </kbd>
            <span>to exit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
