# Vanguard IP Audit — M&A and Venture Capital Patent Due Diligence Auditor

> **Enterprise Legal Tech Portfolio Project** | Powered by the **European Patent Office (EPO) Open Patent Services (OPS) REST API v3.2**, **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## 1. Executive Overview: The Real-World M&A Legal Bottleneck

In technology, medtech, and life-sciences M&A transactions (as well as Series B/C venture capital financings), the Seller provides an **Intellectual Property Disclosure Schedule (typically Schedule 3.14 of the Share Purchase Agreement)** listing dozens of European patents represented as *"solely owned, validly subsisting, and in full force and effect."*

In practice, M&A IP associates and patent attorneys spend dozens of billable hours manually cross-checking each patent number across **Espacenet**, the **European Patent Register**, and **INPADOC Legal Status** tables—frequently uncovering deal-critical defects days before signing:
- **Unrecorded Assignments (Chain-of-Title Breaks)**: Patents developed via university sponsored research or by co-founders personally that were never formally assigned in writing under **Article 72 EPC** or recorded under **Rule 22 EPC**.
- **Silent Statutory Lapses**: Patents listed as "Active" on Seller schedules that actually lapsed months earlier due to missed annual renewal fees and expired 6-month grace periods (**Article 86 & Rule 51(2) EPC**).
- **Active Post-Grant Oppositions**: Core commercial patents facing pending **Article 99 EPC** revocation proceedings initiated by competitors, or newly granted `B1` patents still inside the vulnerable 9-month opposition window.

**Vanguard IP Audit** eliminates this manual bottleneck. It ingests raw patent lists or VDR spreadsheets, queries the official **EPO OPS v3.2 REST API** through a zero-leakage server proxy, evaluates every asset across **5 statutory M&A risk pillars**, and generates partner-ready **Executive Due Diligence Memoranda (Print/PDF)** and **SPA Disclosure Schedules (CSV)** in one click.

---

## 2. Key Legal Due Diligence Features

### A. Automated 5-Pillar Statutory Rules Engine (`lib/riskAnalyzer.ts`)
1. **Chain of Title & Ownership Verification (Art. 72 & Rule 22 EPC)**:
   - Strips corporate suffixes (`GmbH`, `AG`, `Ltd`, `Inc`, `AB`, `SAS`, `BV`, `S.r.l.`) and runs fuzzy string similarity matching (token overlap + Levenshtein edit distance) between the EPO Register proprietor and the acquirer's **Target Company Legal Name**.
   - Flags `CRITICAL` (*"Chain of Title Mismatch"*) when title remains registered to a university, prior entity, or individual founder.
2. **Maintenance & Renewal Fee Standing (Art. 86 & Rule 51(2) EPC)**:
   - Parses INPADOC legal status event codes (`PGFP`, `LAP`, `REV`, `WDR`, `PAYR`) to verify whether annual renewal fees are paid and current.
   - Flags `CRITICAL` (*"Lapsed / Inactive Right"*) if the patent is dead or abandoned.
3. **Post-Grant Opposition & Dispute Detection (Art. 99 & Art. 101 EPC)**:
   - Inspects EP Register procedural events and `B1` grant dates.
   - Flags `CRITICAL` (*"Active Opposition / Validity Challenge"*) if a third-party opposition has been filed, and `WARNING` (*"Within 9-Month Opposition Window"*) if granted fewer than 9 months ago.
4. **Territorial Coverage & European Validation Check (Art. 65 EPC & Reg. 1257/2012)**:
   - Evaluates INPADOC family jurisdictions (`DE`, `FR`, `GB`, `CH`, `NL`, `IT`, `SE`) and Unitary Patent (`UP`) registration.
   - Flags `WARNING` (*"Narrow European Validation"*) if a granted EP patent was validated in fewer than 3 contracting states without Unitary Effect.
5. **Remaining Statutory Patent Term (Art. 63(1) EPC)**:
   - Calculates the 20-year statutory expiration date from the earliest filing date and flags `WARNING` (*"Near-Term Expiration"*) when fewer than 3 years remain.

### B. 1-Click Law Firm Deliverable Exports
- **Download Executive Memo (Print / PDF)**: Generates a print-formatted M&A IP Due Diligence Summary Report containing the Target Company name, audit timestamp, Executive Risk Summary table, and itemized Red Flag Schedule with plain-English **Lawyer's Notes** and draft **SPA Remediation Clauses** (Conditions Precedent, Special Escrow Holdbacks, and Valuation Adjustments).
- **Download CSV Schedule**: Exports a structured spreadsheet suitable for attaching directly to an M&A Share Purchase Agreement (SPA) IP Disclosure Schedule.

---

## 3. Zero-Leakage Security Architecture

This repository is engineered so the source code can be published publicly on GitHub while keeping EPO OAuth2 credentials (`EPO_OPS_CONSUMER_KEY` and `EPO_OPS_SECRET`) 100% private on the server.

```text
+-------------------------------------------------------------------------+
| CLIENT BROWSER (Next.js App Router UI - app/page.tsx)                   |
| - Zero API keys in client bundle (NEXT_PUBLIC_ is strictly forbidden)   |
| - Sends { targetCompanyName, patentNumbers[] } via HTTPS POST           |
+------------------------------------+------------------------------------+
                                     |
                                     v  POST /api/audit
+-------------------------------------------------------------------------+
| SERVER-ONLY API ROUTE (app/api/audit/route.ts)                          |
| - Enforces In-Memory IP Rate Limiting (Max 10 req/IP/hr, 15/batch)      |
| - Reads process.env.EPO_OPS_CONSUMER_KEY & EPO_OPS_SECRET (.env.local)  |
| - Returns graceful JSON fallback if keys are absent (no server crash)   |
+-----------------+------------------------------------+------------------+
                  |                                    |
                  v                                    v
+----------------------------------+  +-----------------------------------+
| OAUTH2 MANAGER (lib/epoAuth.ts)  |  | EPO OPS CLIENT (lib/epoClient.ts) |
| - Base64 Basic Auth exchange     |  | - /number-service (.../docdb)     |
| - 20-min server memory token     |  | - /published-data/.../biblio      |
|   cache (90s pre-expiry refresh) |  | - /legal/publication/docdb        |
| - Auto-refresh on HTTP 401/403   |  | - /family & /register XML parser  |
+-----------------+----------------+  +----------------+------------------+
                  |                                    |
                  +-----------------+------------------+
                                    |  HTTPS (Bearer Token)
                                    v
            +------------------------------------------------+
            | EUROPEAN PATENT OFFICE (EPO) OPS REST API v3.2 |
            | https://ops.epo.org/3.2/rest-services          |
            +------------------------------------------------+
```

---

## 4. Repository Structure

```text
vanguard-ip-audit/
├── .env.local               <-- Your REAL secret EPO keys (strictly git-ignored, never uploaded to GitHub)
├── .env.example             <-- Blank placeholder keys (safe to commit to GitHub)
├── .gitignore               <-- Blocks .env.local, .env*, and secret files from Git
├── README.md                <-- Recruiter & partner documentation
├── package.json             <-- Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide Icons
├── app/
│   ├── page.tsx             <-- Main M&A Virtual Data Room webpage & deliverable exporter
│   └── api/
│       └── audit/
│           └── route.ts     <-- Server-only route talking to EPO OPS with IP rate limiting
└── lib/
    ├── sampleDeal.ts        <-- 12 European patents for fictional target "Aetheris MedTech GmbH"
    ├── epoAuth.ts           <-- Handles 20-minute OAuth2 token caching & refresh
    ├── epoClient.ts         <-- Normalizes messy numbers via Number Service & parses EPO XML
    └── riskAnalyzer.ts      <-- 5-Check Legal Due Diligence Rules Engine & Lawyer's Note generator
```

---

## 5. Step-by-Step Instructions: Running Locally or Testing Immediately

### Option A: Test Immediately in "Sample M&A Deal Mode" (No API Keys Required)
Recruiters and reviewers can evaluate the full platform immediately without registering for EPO credentials:
1. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```
2. Open `http://localhost:3000` in your browser.
3. Ensure the top navigation toggle is set to **[Sample M&A Deal Mode]** and click **"Load Sample M&A Target (12 Patents — Aetheris MedTech GmbH)"**.
4. Click any patent row to inspect the **5-Check Statutory Scorecard**, test live Chain-of-Title re-evaluation by changing the **Target Company Legal Name**, or click **"Export IP Due Diligence Schedule"** to generate the print-ready Executive Memo or SPA CSV Schedule.

### Option B: Connect Live EPO Open Patent Services (OPS) v3.2 Credentials
1. Register for a free developer account at **[https://developers.epo.org/](https://developers.epo.org/)** and create an app to obtain your **Consumer Key** and **Consumer Secret**.
2. Copy `.env.example` to `.env.local` in the project root:
   ```bash
   cp .env.example .env.local
   ```
3. Paste your credentials into `.env.local` (which is automatically ignored by `.gitignore`):
   ```env
   EPO_OPS_CONSUMER_KEY=your_real_epo_consumer_key_here
   EPO_OPS_SECRET=your_real_epo_consumer_secret_here
   ```
4. Switch the top bar toggle to **[Live EPO API Mode]** and click **"Verify Assets Against EPO Register"**.

---

## 6. Legal Disclaimer

*Vanguard IP Audit is a legal technology decision-support and engineering portfolio system designed to assist qualified legal professionals during preliminary M&A and venture capital due diligence. Automated outputs from this tool do not constitute formal legal advice, a formal freedom-to-operate (FTO) or validity opinion, or a substitute for certified extracts from the European Patent Register.*
].join('\n');
