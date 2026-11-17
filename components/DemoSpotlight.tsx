"use client";

import React from "react";
import { useRecruiterDemo } from "./RecruiterDemoContext";

export interface DemoSpotlightProps {
  children: React.ReactNode;
  id?: string;
  stepIndex?: number;
  isActive?: boolean;
  badgeText: string;
  badgeSubtext?: string;
  badgePosition?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right";
  variant?: "emerald" | "rose" | "amber" | "blue";
  className?: string;
  pulse?: boolean;
}

export default function DemoSpotlight({
  children,
  id,
  stepIndex,
  isActive,
  badgeText,
  badgeSubtext,
  badgePosition = "top-right",
  variant = "emerald",
  className = "",
  pulse = true,
}: DemoSpotlightProps) {
  const { isDemoActive, currentStepIndex } = useRecruiterDemo();

  const isHighlighted =
    isDemoActive &&
    (isActive !== undefined ? isActive : stepIndex === currentStepIndex);

  if (!isHighlighted) {
    return <div id={id} className={className}>{children}</div>;
  }

  // Variant styling mapping with solid opaque backgrounds for maximum contrast and visibility
  const variantStyles = {
    emerald: {
      ring: "ring-2 ring-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.35)] border-emerald-500/50",
      badgeBg: "bg-emerald-600 text-white border-2 border-white shadow-xl shadow-emerald-950/20",
    },
    rose: {
      ring: "ring-2 ring-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.35)] border-rose-500/50",
      badgeBg: "bg-rose-600 text-white border-2 border-white shadow-xl shadow-rose-950/20",
    },
    amber: {
      ring: "ring-2 ring-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.35)] border-amber-500/50",
      badgeBg: "bg-amber-600 text-white border-2 border-white shadow-xl shadow-amber-950/20",
    },
    blue: {
      ring: "ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.35)] border-blue-500/50",
      badgeBg: "bg-blue-600 text-white border-2 border-white shadow-xl shadow-blue-950/20",
    },
  }[variant];

  // Position mapping
  const positionStyles = {
    "top-left": "-top-3.5 left-4",
    "top-right": "-top-3.5 right-4",
    "top-center": "-top-3.5 left-1/2 -translate-x-1/2",
    "bottom-left": "-bottom-3.5 left-4",
    "bottom-right": "-bottom-3.5 right-4",
  }[badgePosition];

  // Clean badge text without emojis
  const cleanBadgeText = badgeText.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}⚡▶✓⚠❌]/gu, '').trim();

  return (
    <div
      id={id}
      className={`relative rounded-2xl transition-all duration-500 ${
        variantStyles.ring
      } ${pulse ? "animate-pulse" : ""} ${className}`}
    >
      {/* Floating Explanatory Spotlight Badge (bounces up and down, high contrast, no emojis/icons) */}
      <div
        className={`absolute ${positionStyles} z-40 pointer-events-none flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-xl ${
          variantStyles.badgeBg
        } animate-bounce`}
      >
        <span>{cleanBadgeText}</span>
        {badgeSubtext && (
          <span className="hidden sm:inline opacity-95 font-medium border-l border-white/40 pl-2 normal-case text-[10px]">
            {badgeSubtext}
          </span>
        )}
      </div>

      {children}
    </div>
  );
}
