"use client";

import React from "react";
import { Sparkles, Zap, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useRecruiterDemo } from "./RecruiterDemoContext";

export interface DemoSpotlightProps {
  children: React.ReactNode;
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
    return <div className={className}>{children}</div>;
  }

  // Variant styling mapping
  const variantStyles = {
    emerald: {
      ring: "ring-2 ring-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.35)] border-emerald-500/50",
      badgeBg: "bg-linear-to-r from-emerald-600 to-teal-600 text-white border-emerald-400/40",
      icon: Sparkles,
      iconColor: "text-amber-300",
    },
    rose: {
      ring: "ring-2 ring-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.35)] border-rose-500/50",
      badgeBg: "bg-linear-to-r from-rose-600 to-red-600 text-white border-rose-400/40",
      icon: ShieldAlert,
      iconColor: "text-rose-200",
    },
    amber: {
      ring: "ring-2 ring-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.35)] border-amber-500/50",
      badgeBg: "bg-linear-to-r from-amber-600 to-orange-600 text-white border-amber-400/40",
      icon: Zap,
      iconColor: "text-amber-200",
    },
    blue: {
      ring: "ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.35)] border-blue-500/50",
      badgeBg: "bg-linear-to-r from-blue-600 to-indigo-600 text-white border-blue-400/40",
      icon: CheckCircle2,
      iconColor: "text-blue-200",
    },
  }[variant];

  // Position mapping
  const positionStyles = {
    "top-left": "-top-3 left-4",
    "top-right": "-top-3 right-4",
    "top-center": "-top-3 left-1/2 -translate-x-1/2",
    "bottom-left": "-bottom-3 left-4",
    "bottom-right": "-bottom-3 right-4",
  }[badgePosition];

  const Icon = variantStyles.icon;

  return (
    <div
      className={`relative rounded-2xl transition-all duration-500 ${
        variantStyles.ring
      } ${pulse ? "animate-pulse" : ""} ${className}`}
    >
      {/* Floating Explanatory Spotlight Badge */}
      <div
        className={`absolute ${positionStyles} z-30 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg border ${
          variantStyles.badgeBg
        } animate-bounce`}
      >
        <Icon className={`w-3.5 h-3.5 ${variantStyles.iconColor}`} />
        <span>{badgeText}</span>
        {badgeSubtext && (
          <span className="hidden sm:inline opacity-85 font-normal border-l border-white/30 pl-1.5 normal-case">
            {badgeSubtext}
          </span>
        )}
      </div>

      {children}
    </div>
  );
}
