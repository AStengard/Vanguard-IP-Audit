"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { useDeal } from "./DealContext";

// ============================================================================
// DEMO STEP DEFINITION & METADATA
// ============================================================================
export interface DemoStep {
  id: string;
  stepNumber: number;
  label: string;
  title: string;
  description: string;
  path: string;
  duration: number; // Duration in seconds at 1x speed
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: "step-1-target",
    stepNumber: 1,
    label: "Step 1/5: Loading Target Entity",
    title: "Target Ingestion & Auto-Fill",
    description: "Simulating form entry for Aetheris MedTech GmbH & 12 European patent numbers.",
    path: "/",
    duration: 11,
  },
  {
    id: "step-2-scanner",
    stepNumber: 2,
    label: "Step 2/5: Real-Time EPO Audit Scanner",
    title: "Statutory Audit Scanner HUD",
    description: "Executing real-time simulated EPO OPS registry checks (Art. 72, Art. 86, Art. 99 EPC).",
    path: "/",
    duration: 8,
  },
  {
    id: "step-3-overview",
    stepNumber: 3,
    label: "Step 3/5: Statutory Risk Scorecard",
    title: "Overview & 4 Critical Red Flags",
    description: "Spotlighting all 4 Critical Red Flags: Art. 72 title breaks, Art. 99 opposition & Art. 86 statutory lapse.",
    path: "/overview",
    duration: 9,
  },
  {
    id: "step-4-portfolio",
    stepNumber: 4,
    label: "Step 4/5: Schedule 3.14 Portfolio Table",
    title: "Portfolio Table & EPC Filters",
    description: "Showcasing patent breakdown schedule, Unitary status, and statutory filtering.",
    path: "/portfolio",
    duration: 10,
  },
  {
    id: "step-5-memo",
    stepNumber: 5,
    label: "Step 5/5: Executive Memo & SPA Covenants",
    title: "Executive Memorandum & Covenants",
    description: "Reviewing partner-level statutory risk memorandum, Closing Conditions Precedent, and Specific Indemnity.",
    path: "/memo",
    duration: 12,
  },
];

// ============================================================================
// CONTEXT INTERFACE
// ============================================================================
export interface RecruiterDemoContextType {
  isDemoActive: boolean;
  isPlaying: boolean;
  currentStepIndex: number;
  playbackSpeed: 1 | 2;
  elapsedTime: number;
  steps: DemoStep[];
  currentStep: DemoStep;
  stepProgress: number; // 0 to 100% of current step
  overallProgress: number; // 0 to 100% of total tour
  isCompleted: boolean;
  isStepReady: boolean;
  setIsStepReady: (ready: boolean) => void;
  startDemo: () => void;
  pauseDemo: () => void;
  resumeDemo: () => void;
  nextStep: () => void;
  prevStep: () => void;
  exitDemo: () => void;
  setPlaybackSpeed: (speed: 1 | 2) => void;
  togglePlaybackSpeed: () => void;
  jumpToStep: (index: number) => void;
}

const RecruiterDemoContext = createContext<RecruiterDemoContextType | null>(null);

// ============================================================================
// PROVIDER IMPLEMENTATION
// ============================================================================
export function RecruiterDemoProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { resetToShowcase } = useDeal();

  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeedState] = useState<1 | 2>(1);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isStepReady, setIsStepReady] = useState<boolean>(false);

  const currentStep = DEMO_STEPS[currentStepIndex] || DEMO_STEPS[0];

  // Actions
  const exitDemo = useCallback(() => {
    setIsDemoActive(false);
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setElapsedTime(0);
    setIsCompleted(false);
    setIsStepReady(false);
  }, []);

  const jumpToStep = useCallback((index: number) => {
    if (index >= 0 && index < DEMO_STEPS.length) {
      setCurrentStepIndex(index);
      setElapsedTime(0);
      setIsCompleted(false);
      setIsStepReady(false);
      router.push(DEMO_STEPS[index].path);
    }
  }, [router]);

  const nextStep = useCallback(() => {
    setIsStepReady(false);
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      if (nextIdx === 2) {
        // Ensure showcase deal is loaded when moving to Overview
        resetToShowcase();
      }
      setCurrentStepIndex(nextIdx);
      setElapsedTime(0);
      setIsCompleted(false);
      router.push(DEMO_STEPS[nextIdx].path);
    } else {
      // Reached the end of the demo
      setIsPlaying(false);
      setIsCompleted(true);
      setElapsedTime(DEMO_STEPS[currentStepIndex].duration);
    }
  }, [currentStepIndex, resetToShowcase, router]);

  const prevStep = useCallback(() => {
    setIsStepReady(false);
    if (isCompleted) {
      setIsCompleted(false);
      setElapsedTime(0);
      return;
    }
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      setElapsedTime(0);
      setIsCompleted(false);
      router.push(DEMO_STEPS[prevIdx].path);
    }
  }, [currentStepIndex, isCompleted, router]);

  const pauseDemo = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resumeDemo = useCallback(() => {
    if (isCompleted) {
      // Restart from Step 1
      setCurrentStepIndex(0);
      setElapsedTime(0);
      setIsCompleted(false);
      setIsStepReady(false);
      router.push(DEMO_STEPS[0].path);
    }
    setIsPlaying(true);
  }, [isCompleted, router]);

  const startDemo = useCallback(() => {
    // 1. Ensure showcase data is freshly loaded with all 12 assets
    resetToShowcase();

    // 2. Initialize demo state to Step 1 (paused by default for self-paced walkthrough)
    setCurrentStepIndex(0);
    setElapsedTime(0);
    setIsCompleted(false);
    setIsStepReady(false);
    setIsDemoActive(true);
    setIsPlaying(false);

    // 3. Navigate to initial target path
    router.push(DEMO_STEPS[0].path);
  }, [resetToShowcase, router]);

  const setPlaybackSpeed = useCallback((speed: 1 | 2) => {
    setPlaybackSpeedState(speed);
  }, []);

  const togglePlaybackSpeed = useCallback(() => {
    setPlaybackSpeedState((prev) => (prev === 1 ? 2 : 1));
  }, []);

  // --------------------------------------------------------------------------
  // ESCAPE KEY LISTENER (Immediately exit demo mode)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!isDemoActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        exitDemo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDemoActive, exitDemo]);

  // --------------------------------------------------------------------------
  // SCENE COMPLETION & READINESS ENGINE
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!isDemoActive || isCompleted) {
      setIsStepReady(false);
      return;
    }

    // Reset readiness on step transition
    setIsStepReady(false);

    // Steps >= 2 (Overview, Portfolio, Memo) become ready after the user has had time
    // to view the spotlighted cards/tables (~2.8s - 3.2s)
    if (currentStepIndex >= 2) {
      const readingDelayMs = (currentStepIndex === 4 ? 3200 : 2800) / playbackSpeed;
      const timer = setTimeout(() => {
        setIsStepReady(true);
      }, readingDelayMs);
      return () => clearTimeout(timer);
    }
  }, [isDemoActive, currentStepIndex, playbackSpeed, isCompleted]);

  // --------------------------------------------------------------------------
  // TIMER & PROGRESSION ENGINE
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!isDemoActive || !isPlaying) return;

    const tickIntervalMs = 100;
    const tickDeltaSec = (tickIntervalMs / 1000) * playbackSpeed;
    const activeStepDuration = DEMO_STEPS[currentStepIndex]?.duration || 8;

    const timer = setInterval(() => {
      setElapsedTime((prevTime) => {
        const nextTime = prevTime + tickDeltaSec;

        if (nextTime >= activeStepDuration) {
          // Current step is complete
          if (currentStepIndex < DEMO_STEPS.length - 1) {
            const nextIdx = currentStepIndex + 1;
            if (nextIdx === 2) {
              resetToShowcase();
            }
            setCurrentStepIndex(nextIdx);
            router.push(DEMO_STEPS[nextIdx].path);
            return 0;
          } else {
            // Last step finished
            setIsPlaying(false);
            setIsCompleted(true);
            return activeStepDuration;
          }
        }

        return nextTime;
      });
    }, tickIntervalMs);

    return () => clearInterval(timer);
  }, [isDemoActive, isPlaying, currentStepIndex, playbackSpeed, resetToShowcase, router]);

  // --------------------------------------------------------------------------
  // PROGRESS CALCULATIONS
  // --------------------------------------------------------------------------
  const stepDuration = currentStep?.duration || 8;
  const stepProgress = Math.min(100, Math.max(0, (elapsedTime / stepDuration) * 100));

  const totalTourDuration = useMemo(
    () => DEMO_STEPS.reduce((sum, s) => sum + s.duration, 0),
    []
  );

  const overallElapsed = useMemo(() => {
    const priorDuration = DEMO_STEPS.slice(0, currentStepIndex).reduce(
      (sum, s) => sum + s.duration,
      0
    );
    return priorDuration + Math.min(elapsedTime, stepDuration);
  }, [currentStepIndex, elapsedTime, stepDuration]);

  const overallProgress = Math.min(
    100,
    Math.max(0, (overallElapsed / totalTourDuration) * 100)
  );

  const value = useMemo<RecruiterDemoContextType>(
    () => ({
      isDemoActive,
      isPlaying,
      currentStepIndex,
      playbackSpeed,
      elapsedTime,
      steps: DEMO_STEPS,
      currentStep,
      stepProgress,
      overallProgress,
      isCompleted,
      isStepReady,
      setIsStepReady,
      startDemo,
      pauseDemo,
      resumeDemo,
      nextStep,
      prevStep,
      exitDemo,
      setPlaybackSpeed,
      togglePlaybackSpeed,
      jumpToStep,
    }),
    [
      isDemoActive,
      isPlaying,
      currentStepIndex,
      playbackSpeed,
      elapsedTime,
      currentStep,
      stepProgress,
      overallProgress,
      isCompleted,
      isStepReady,
      setIsStepReady,
      startDemo,
      pauseDemo,
      resumeDemo,
      nextStep,
      prevStep,
      exitDemo,
      setPlaybackSpeed,
      togglePlaybackSpeed,
      jumpToStep,
    ]
  );

  return (
    <RecruiterDemoContext.Provider value={value}>
      {children}
    </RecruiterDemoContext.Provider>
  );
}

// ============================================================================
// CUSTOM HOOK
// ============================================================================
export function useRecruiterDemo() {
  const context = useContext(RecruiterDemoContext);
  if (!context) {
    throw new Error("useRecruiterDemo must be used within a RecruiterDemoProvider");
  }
  return context;
}
