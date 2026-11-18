# Vanguard IP Audit — European Patent M&A Due Diligence Suite

> **Legal Tech Portfolio Project by [Alfred Stengard](https://astengard.github.io/cv/)** | Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and the **European Patent Office (EPO) Open Patent Services (OPS) REST API v3.2**.

---

## 1. Executive Overview: The Real-World M&A Legal Bottleneck

In European life sciences and deep-tech acquisitions, patents often represent up to **70%–90% of a target company's enterprise value**. Yet deal teams still rely on manual, error-prone cross-checks between seller-prepared disclosure schedules (**SPA Schedule 3.14**), the **European Patent Register**, and fragmented national patent offices.

Manual verification across dozens of patent families routinely consumes **substantial billable hours per transaction**—and still risks missing high-stakes statutory defects:
- **Unrecorded Assignments (Art. 72 EPC):** Patents still registered to a founder or university tech-transfer office, leaving core IP stranded outside the target entity.
- **Patents in Grace Periods (Rule 51(2) EPC):** Missed renewal fees sitting inside the EPO's 6-month surcharge window that will permanently lapse if not cured before closing.
- **Central Oppositions (Art. 99 EPC):** Active competitor oppositions threatening to revoke protection across up to 39 EPC contracting states in a single proceeding.

**Vanguard IP Audit** automates this preliminary legal diligence workflow. It queries the official **EPO OPS v3.2 REST API** through a zero-leakage server proxy, evaluates every patent across **5 statutory EPC risk pillars**, and generates partner-ready **Executive Due Diligence Memoranda (Print/PDF)**, **Individual Patent Dossiers with copyable SPA clauses**, and **Schedule 3.14 CSV spreadsheets**.

---

## 2. Core Features

### A. Interactive Recruiter Demo (Project Aetheris — 12 EP Assets)
Designed so recruiters, M&A partners, and reviewers can explore the complete workflow immediately with **no API keys required**:
- **Compact Landing Launcher & Navbar Trigger:** Starts a 5-step guided walkthrough using the pre-configured **Project Aetheris (Aetheris MedTech GmbH)** 12-patent acquisition portfolio.
- **Self-Paced by Default:** Starts **paused** with dedicated **Back / Next** step buttons, optional **Play / Pause** auto-advance, **1x / 2x** speed toggle, clickable progress segments, and `Esc` to exit.
- **5-Step Guided Walkthrough:**
  1. **Target Ingestion (`/`):** Auto-scrolls to the audit form and simulates target company & patent schedule input with a glowing submit trigger.
  2. **Real-Time EPO Audit Scanner Modal:** Runs an 8-second animated statutory scan across all 5 modules, revealing `Flagged` / `Verified` statuses only as each check completes.
  3. **Statutory Risk Scorecard (`/overview`):** Spotlights all **4 Critical Red Flags** together in a balanced 2×2 grid (2 Art. 72 title breaks, 1 Art. 99 opposition, 1 Art. 86 statutory lapse) with a floating Tour Commentary card.
  4. **Schedule 3.14 Portfolio Table (`/portfolio`):** Searchable and filterable patent breakdown with Unitary Patent (`UP`) vs. classic national validation coverage and CSV export.
  5. **Executive Memo & SPA Covenants (`/memo`):** Formal print/PDF law firm memorandum with **Section 3.14** warranties, Closing Conditions Precedent, Specific Indemnities, and completion summary card.

### B. Live EPO OPS v3.2 API Integration
- **Direct Live Queries (`/`):** Enter any target company name and up to 15 real European patent numbers to query the official European Patent Office (`/number-service`, `/biblio`, `/legal`, `/family`, `/register`).
- **Real-Time Live Scanner Modal:** Displays the animated 5-module Audit Scanner (minimum 8-second scan cadence matching the demo) and dynamically reveals real `Flagged` or `Verified` pillar results from the live EPO records before routing to `/overview`.
- **Smart `New Audit` Action:** Clicking **New Audit** from any page clears previous inputs, scrolls smoothly to the live audit form, focuses the Target Company input, and flashes a subtle confirmation ring.

### C. Automated 5-Pillar Statutory EPC Rules Engine
1. **Chain of Title & Ownership Verification (Art. 72 & Rule 22 EPC):** Strips corporate suffixes (`GmbH`, `AG`, `Ltd`, `Inc`, `AB`, `SAS`, `BV`, `S.r.l.`) and runs fuzzy entity similarity matching between the recorded EPO proprietor and the Target Company Legal Entity.
2. **Maintenance & Renewal Fee Standing (Art. 86 & Rule 51(2) EPC):** Tracks renewal standing, active 6-month surcharge grace periods, and lapsed assets.
3. **Post-Grant Opposition & Dispute Detection (Art. 99 & Art. 101 EPC):** Flags pending competitor oppositions and newly granted `B1` patents still inside the 9-month opposition window.
4. **Territorial Coverage & European Validation Check (Art. 65 EPC & Reg. 1257/2012):** Distinguishes **Unitary Patents (17 EU Member States)** from classic national validations (`DE`, `FR`, `GB`, `CH`, `NL`, `IT`, `SE`) and flags narrow footprints.
5. **Remaining Statutory Patent Term (Art. 63(1) EPC):** Calculates exact remaining 20-year statutory runway and flags near-term expirations (< 3 years).

### D. Law Firm Deliverables & Audit History Vault
- **Executive Legal Due Diligence Memorandum (`/memo`):** Print-ready PDF memorandum with aligned **Section 3.14** warranties and **Schedule 3.14** patent disclosures, Conditions Precedent, and Post-Closing Integration Covenants.
- **Individual Patent Dossiers (`/patent/[id]`):** Complete 5-pillar legal scorecard, national validation grid, INPADOC legal events timeline, and 1-click **Copy SPA Draft Clause**.
- **Schedule 3.14 CSV Export:** Available directly on Overview, Portfolio Schedule, Executive Memo, Audit History, and the Demo Completion summary.
- **Audit History & Deal Vault (`/history`):** Persists completed audits in browser `localStorage` with re-open, rename, CSV export, and delete actions.

---

## 3. Zero-Leakage Security Architecture

EPO OAuth2 credentials (`EPO_OPS_CONSUMER_KEY` and `EPO_OPS_SECRET`) stay 100% server-side and are never exposed to the client bundle.

```text
+-------------------------------------------------------------------------+
| CLIENT BROWSER (Next.js App Router UI)                                  |
| - Zero API keys in client bundle (NEXT_PUBLIC_ is strictly forbidden)   |
| - Sends { targetCompanyName, patentNumbers[] } via HTTPS POST           |
+------------------------------------+------------------------------------+
                                     |
                                     v  POST /api/audit
+-------------------------------------------------------------------------+
| SERVER-ONLY API ROUTE (app/api/audit/route.ts)                          |
| - Enforces In-Memory IP Rate Limiting (Max 10 req/IP/hr, 15/batch)      |
| - Reads process.env.EPO_OPS_CONSUMER_KEY & EPO_OPS_SECRET               |
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
├── .env.example                       # Placeholder env vars (safe to commit)
├── .gitignore                         # Blocks .env.local and secret files
├── README.md                          # Project & architecture documentation
├── package.json                       # Next.js 15, React 19, TypeScript, Tailwind CSS v3, Lucide
├── app/
│   ├── layout.tsx                     # Root layout, Navbar, Demo HUDs, & Footer
│   ├── page.tsx                       # Landing page: Recruiter Demo banner + Live EPO Audit form
│   ├── overview/page.tsx              # Executive KPI dashboard & 4 Critical Red Flags grid
│   ├── portfolio/page.tsx             # Full Schedule 3.14 searchable/filterable table & CSV export
│   ├── patent/[id]/page.tsx           # Individual patent dossier, 5-pillar scorecard & SPA clause copy
│   ├── memo/page.tsx                  # Print/PDF Executive Due Diligence Memorandum (Section 3.14)
│   ├── history/page.tsx               # Audit History & Deal Vault (localStorage persistence)
│   ├── guide/page.tsx                 # Non-technical "How It Works" legal framework guide
│   └── api/audit/route.ts             # Server-only EPO OPS v3.2 proxy with rate limiting
├── components/
│   ├── Navbar.tsx                     # Top navigation bar, Watch Recruiter Demo & New Audit actions
│   ├── DealContext.tsx                # 5-pillar statutory evaluator, state, CSV export & Deal Vault
│   ├── RecruiterDemoContext.tsx       # 5-step walkthrough state (paused by default, Back/Next, Esc)
│   ├── DemoPlayerBar.tsx              # Floating glassmorphism HUD controller (Play/Pause/Back/Next)
│   ├── DemoNarratorBox.tsx            # Floating step-by-step Tour Commentary box
│   ├── DemoSpotlight.tsx              # High-contrast spotlight rings & bouncing callout badges
│   ├── AuditScannerModal.tsx          # Animated 8s statutory scanner (Demo & Live EPO API)
│   └── DemoCompletionModal.tsx        # Final executive summary card & Digital CV link
└── lib/
    ├── sampleDeal.ts                  # 12 European patents for "Aetheris MedTech GmbH"
    ├── epoAuth.ts                     # OAuth2 client-credentials token caching & refresh
    ├── epoClient.ts                   # EPO Number Service & XML response parser
    └── riskAnalyzer.ts                # Core EPC statutory risk analysis utilities
```

---

## 5. Running Locally

### Option A: Explore Immediately via the Recruiter Demo (No API Keys Required)
1. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```
2. Open `http://localhost:3000` in your browser.
3. Click **Watch Recruiter Demo** (in the top bar or compact hero banner) to step through all 5 stages of the **Project Aetheris — MedTech Deal** using **Back / Next** (or press **Play** to auto-advance).

### Option B: Connect Live EPO Open Patent Services (OPS) v3.2 Credentials
1. Register for a free developer account at **[https://developers.epo.org/](https://developers.epo.org/)** and create an app to obtain your **Consumer Key** and **Consumer Secret**.
2. Copy `.env.example` to `.env.local` in the project root:
   ```bash
   cp .env.example .env.local
   ```
3. Add your credentials to `.env.local` (or Vercel Environment Variables for production):
   ```env
   EPO_OPS_CONSUMER_KEY=your_real_epo_consumer_key_here
   EPO_OPS_SECRET=your_real_epo_consumer_secret_here
   ```
4. Enter any Target Company Legal Entity and European Patent numbers on the landing page and click **Run Live EPO 5-Pillar Audit**.

---

## 6. Legal Disclaimer

*Vanguard IP Audit is a legal technology decision-support and engineering portfolio project designed to assist qualified legal professionals during preliminary M&A and venture capital due diligence. Automated outputs from this tool do not constitute formal legal advice, a freedom-to-operate (FTO) or validity opinion, or a substitute for certified extracts from the European Patent Register.*
