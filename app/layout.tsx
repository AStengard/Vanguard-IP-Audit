import type { Metadata } from "next";
import "./globals.css";
import { DealProvider } from "@/components/DealContext";
import { RecruiterDemoProvider } from "@/components/RecruiterDemoContext";
import Navbar from "@/components/Navbar";
import DemoPlayerBar from "@/components/DemoPlayerBar";
import AuditScannerModal from "@/components/AuditScannerModal";
import DemoCompletionModal from "@/components/DemoCompletionModal";
import DemoNarratorBox from "@/components/DemoNarratorBox";

export const metadata: Metadata = {
  title: "Vanguard IP Audit — M&A Patent Due Diligence Suite",
  description: "Automated European Patent Convention (EPC) Statutory Risk & Chain-of-Title Auditor for M&A and Private Equity",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F8FAFC] text-slate-900 min-h-screen flex flex-col font-sans">
        <DealProvider>
          <RecruiterDemoProvider>
            <Navbar />
            <div className="flex-1 pb-28 sm:pb-24">
              {children}
            </div>
            <DemoPlayerBar />
            <DemoNarratorBox />
            <AuditScannerModal />
            <DemoCompletionModal />
            <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 print:hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-800 tracking-tight">Vanguard IP Audit</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">European Patent M&amp;A Due Diligence Suite</span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  By <strong className="text-slate-900 font-bold">Alfred Stengard</strong>
                </div>
              </div>
            </footer>
          </RecruiterDemoProvider>
        </DealProvider>
      </body>
    </html>
  );
}
