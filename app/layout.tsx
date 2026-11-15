import type { Metadata } from "next";
import "./globals.css";
import { DealProvider } from "@/components/DealContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Vanguard IP Audit — M&A Patent Due Diligence Suite",
  description: "Automated European Patent Convention (EPC) Statutory Risk & Chain-of-Title Auditor for M&A and Private Equity",
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
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
        </DealProvider>
      </body>
    </html>
  );
}
