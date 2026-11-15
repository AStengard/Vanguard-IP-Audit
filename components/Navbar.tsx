"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileSpreadsheet,
  FileText,
  HelpCircle,
  Layers,
  Building2,
  Plus,
  LayoutDashboard,
  History
} from 'lucide-react';
import { useDeal } from './DealContext';

export default function Navbar() {
  const pathname = usePathname();
  const { targetCompany, downloadCsv, savedAudits } = useDeal();

  const navLinks = [
    { href: '/overview', label: 'Overview', icon: LayoutDashboard },
    { href: '/portfolio', label: 'Portfolio Schedule', icon: Layers },
    { href: '/history', label: 'Audit History', icon: History, count: savedAudits?.length },
    { href: '/memo', label: 'Executive Memo', icon: FileText },
    { href: '/guide', label: 'How It Works', icon: HelpCircle },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* ===================================================================
            LEFT: STYLIZED BRAND WORDMARK (No law emoji)
        ==================================================================== */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[17px] font-black tracking-tight text-slate-900 group-hover:text-slate-700 transition font-sans">
                VANGUARD
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-800 transition font-sans">
                IP AUDIT
              </span>
            </div>
            <span className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              M&amp;A
            </span>
          </Link>

          {/* ===================================================================
              CENTER: MODERN SEGMENTED NAVIGATION TABS (Uniform font, size & height)
          ==================================================================== */}
          <nav className="hidden lg:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.count !== undefined && link.count > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
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
        <div className="flex items-center gap-2">
          {/* Active Target Indicator Pill */}
          {targetCompany ? (
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition"
              title="Click to change target entity or start new audit"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-500">Target:</span>
              <span className="font-bold text-slate-900 max-w-[130px] truncate">{targetCompany}</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg bg-slate-50/70 hover:bg-slate-100 text-slate-500 border border-dashed border-slate-300 text-xs font-medium transition"
              title="No target entity selected yet — click to configure audit"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>No Target Selected</span>
            </Link>
          )}

          {/* Export CSV Button (Only when target is loaded) */}
          {targetCompany && (
            <button
              onClick={downloadCsv}
              className="hidden md:inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition cursor-pointer"
              title="Download Schedule 3.14 spreadsheet (CSV)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Export CSV</span>
            </button>
          )}

          {/* New Audit CTA Button */}
          <Link
            href="/"
            className={`inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg text-xs font-semibold shadow-xs transition shrink-0 ${
              pathname === '/'
                ? 'bg-slate-900 text-white ring-2 ring-emerald-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>New Audit</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
