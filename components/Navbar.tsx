"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FileText,
  HelpCircle,
  Home,
  Layers,
  Plus,
  LayoutDashboard,
  History
} from 'lucide-react';
import { useDeal } from './DealContext';
import { useRecruiterDemo } from './RecruiterDemoContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { savedAudits, clearDeal } = useDeal();
  const { startDemo, exitDemo, isDemoActive } = useRecruiterDemo();

  const handleNewAudit = () => {
    if (isDemoActive) {
      exitDemo();
    }
    // Clear the currently active audit from Overview/Portfolio/Memo while keeping it saved in Audit History
    clearDeal();

    if (pathname === '/') {
      window.dispatchEvent(new CustomEvent('vanguard:new-audit'));
    } else {
      try {
        sessionStorage.setItem('vanguard_focus_new_audit', '1');
      } catch {
        // Ignore storage restrictions
      }
      router.push('/');
    }
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/overview', label: 'Overview', icon: LayoutDashboard },
    { href: '/portfolio', label: 'Portfolio Schedule', icon: Layers },
    { href: '/memo', label: 'Executive Memo', icon: FileText },
    { href: '/history', label: 'Audit History', icon: History, count: savedAudits?.length },
    { href: '/guide', label: 'How It Works', icon: HelpCircle },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5 xl:px-6 2xl:px-8 h-16 flex items-center justify-between gap-2 xl:gap-4">
        {/* ===================================================================
            LEFT: STYLIZED BRAND WORDMARK (No law emoji)
        ==================================================================== */}
        <div className="flex items-center gap-3 xl:gap-5 2xl:gap-6 min-w-0">
          <Link href="/" className="flex flex-col group shrink-0 whitespace-nowrap">
            <div className="flex items-center gap-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[17px] font-black tracking-tight text-slate-900 group-hover:text-slate-700 transition font-sans">
                  VANGUARD
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-800 transition font-sans">
                  IP AUDIT
                </span>
              </div>
            </div>
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-600 transition tracking-wide -mt-0.5">
              By Alfred Stengard
            </span>
          </Link>

          {/* ===================================================================
              CENTER: MODERN SEGMENTED NAVIGATION TABS (Uniform font, size & height)
          ==================================================================== */}
          <nav className="hidden lg:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 shrink-0">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1 xl:gap-1.5 h-7 px-2 xl:px-2.5 rounded-lg text-[11px] xl:text-xs font-semibold transition whitespace-nowrap shrink-0 ${isActive
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                >
                  <Icon className={`hidden xl:block w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.count !== undefined && link.count > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                      {link.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ===================================================================
            RIGHT: UNIFORM ACTION CONTROLS (Identical height, font & radius)
        ==================================================================== */}
        <div className="flex items-center gap-2 xl:gap-2.5 shrink-0">
          {/* Recruiter Auto-Demo Launcher (Polished Green) */}
          <button
            type="button"
            onClick={startDemo}
            className={`inline-flex items-center gap-1.5 xl:gap-2 h-9 px-2.5 xl:px-3.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs border whitespace-nowrap shrink-0 ${isDemoActive
                ? 'bg-emerald-700 text-white border-emerald-800 ring-1 ring-emerald-500'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600/80 hover:shadow-sm'
              }`}
            title="Watch 5-step automated walkthrough of all Vanguard IP Audit features"
          >
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span className="hidden xl:inline font-extrabold tracking-tight">Watch Recruiter Demo</span>
            <span className="hidden sm:inline xl:hidden font-extrabold tracking-tight">Recruiter Demo</span>
            <span className="sm:hidden font-extrabold">Demo</span>
          </button>

          {/* New Audit CTA Button */}
          <button
            type="button"
            onClick={handleNewAudit}
            className="inline-flex items-center gap-1.5 h-9 px-3 xl:px-3.5 rounded-xl text-xs font-bold shadow-xs transition shrink-0 whitespace-nowrap bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white cursor-pointer"
            title="Start a fresh live EPO transaction audit"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>New Audit</span>
          </button>
        </div>
      </div>

      {/* Compact single-row navigation strip for narrow/split windows (< 1024px) */}
      <nav className="lg:hidden border-t border-slate-100 bg-slate-50/80 px-4 py-1.5 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-semibold transition whitespace-nowrap shrink-0 ${isActive
                    ? 'bg-white text-slate-900 shadow-2xs font-bold border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{link.label}</span>
                {link.count !== undefined && link.count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                    {link.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
