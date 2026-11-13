import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vanguard IP Audit — M&A and Venture Capital Patent Due Diligence Auditor",
  description: "Automated European Patent Office (EPO) Legal Risk & Chain-of-Title Auditor for M&A and Private Equity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F8FAFC] text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}

