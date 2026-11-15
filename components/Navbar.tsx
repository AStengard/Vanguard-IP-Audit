"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Scale,
  FileSpreadsheet,
  FileText,
  Upload,
  HelpCircle,
  Layers,
  Building2,
  ChevronRight
} from 'lucide-react';
import { useDeal } from './DealContext';

export default function Navbar() {
  const pathname = usePathname();
  const { targetCompany, downloadCsv } = useDeal();

  const navLinks = [
    { href: '/', label: 'Overview', icon: Scale },
    { href: '/portfolio', label: 'Portfolio Schedule', icon: Layers },
    { href: '/memo', label: 'Executive Memo (PDF)', icon: FileText },
    { href: '/guide', label: 'How It Works', icon: HelpCircle },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:bg-slate-800 transition">
              <Scale className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-900">
                  Vanguard IP Audit
                </span>
                <span className="hidden md:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  M&amp;A Suite
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Deal Target & Quick Actions */}
        <div className="flex items-center gap-2.5">
          {/* Active Target Indicator */}
          <Link
            href="/new-audit"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold transition"
            title="Click to change target company or run a new audit"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Target:</span>
            <span className="font-bold text-slate-900 max-w-[130px] truncate">{targetCompany}</span>
          </Link>

          {/* New Audit CTA */}
          <Link
            href="/new-audit"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-2xs transition"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>New Audit</span>
          </Link>

          {/* Export CSV CTA */}
          <button
            onClick={downloadCsv}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-2xs transition cursor-pointer"
            title="Download Schedule 3.14 spreadsheet for Share Purchase Agreement"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          {/* Quick PDF Memo Link */}
          <Link
            href="/memo"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Executive Memo</span>
            <span className="sm:hidden">Memo</span>
          </Link>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden border-t border-slate-100 bg-slate-50/80 px-4 py-2 flex items-center justify-around text-xs">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-2 py-1 rounded font-bold ${
                isActive ? 'text-slate-900 bg-white shadow-2xs' : 'text-slate-600'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}

