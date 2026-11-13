// lib/sampleDeal.ts
// Realistic 12-Patent European Portfolio for Fictional M&A Target "Aetheris MedTech GmbH"

export interface DesignatedStateRecord {
  code: string;
  status: "VALIDATED" | "UNITARY_PATENT" | "LAPSED";
  nationalRef: string;
  renewalPaid: boolean;
}

export interface InpadocLegalEvent {
  date: string;
  code: string;
  title: string;
  ref: string;
}

export interface SamplePatentRecord {
  id: string;
  applicationNumber: string;
  title: string;
  ipcClass: string;
  filingDate: string;
  priorityDate: string;
  grantDate: string;
  expirationDate: string;
  registeredProprietor: string;
  proprietorAddress: string;
  disclosedOwnerSchedule: string;
  inventors: string[];
  epoStatus: string;
  epoStatusCode: string;
  oppositionStatus: string;
  oppositionDetail: string;
  annuityYear: number;
  annuityStatus: string;
  annuityPaidThrough: string;
  nextAnnuityAmountEur: number;
  unitaryPatent: boolean;
  mismatchCategory?: string;
  strictShowcaseUnitary?: boolean;
  strictShowcaseDesignatedStates?: DesignatedStateRecord[];
  strictShowcaseGrantDate?: string;
  designatedStates: DesignatedStateRecord[];
  productLine: string;
  revenueAttributionPct: number;
  baseRiskCategory: string;
  legalSummary: string;
  spaRemediationClause: string;
  inpadocEvents: InpadocLegalEvent[];
  [key: string]: any;
}

export const DEFAULT_TARGET_COMPANY = "Aetheris MedTech GmbH";

export const SAMPLE_MA_PATENTS: SamplePatentRecord[] = [
  {
    id: 'EP3412890B1',
    applicationNumber: 'EP17741209.4',
    title: 'Multi-Electrode Pulsed Field Ablation Catheter with Real-Time Impedance Mapping',
    ipcClass: 'A61B 18/14',
    filingDate: '2017-07-14',
    priorityDate: '2016-07-18',
    grantDate: '2021-04-21',
    expirationDate: '2037-07-14',
    registeredProprietor: 'Aetheris MedTech GmbH',
    proprietorAddress: 'pettenkoferstraße 24, 80336 München, DE',
    disclosedOwnerSchedule: 'Aetheris MedTech GmbH',
    inventors: ['Dr. Lukas Vance', 'Dr. Hannah Lindqvist', 'Dipl.-Ing. Markus Weber'],
    epoStatus: 'GRANTED_ACTIVE',
    epoStatusCode: 'PG25 / REG',
    oppositionStatus: 'NO_OPPOSITION_EXPIRED',
    oppositionDetail: '9-month Art. 99 EPC opposition window closed 2022-01-21 without third-party filing.',
    annuityYear: 10,
    annuityStatus: 'PAID_CURRENT',
    annuityPaidThrough: '2027-07-31',
    nextAnnuityAmountEur: 1460,
    unitaryPatent: false,
    designatedStates: [
      { code: 'DE', status: 'VALIDATED', nationalRef: 'DE602017041289.0', renewalPaid: true },
      { code: 'FR', status: 'VALIDATED', nationalRef: 'FR3412890', renewalPaid: true },
      { code: 'GB', status: 'VALIDATED', nationalRef: 'GB3412890', renewalPaid: true },
      { code: 'CH', status: 'VALIDATED', nationalRef: 'CH3412890', renewalPaid: true },
      { code: 'NL', status: 'VALIDATED', nationalRef: 'NL3412890', renewalPaid: true },
      { code: 'IT', status: 'VALIDATED', nationalRef: 'IT502021000049102', renewalPaid: true },
      { code: 'SE', status: 'VALIDATED', nationalRef: 'SE3412890', renewalPaid: true }
    ],
    productLine: 'AetherPulse PFA Core System (Flagship)',
    revenueAttributionPct: 28.5,
    baseRiskCategory: 'CLEAN',
    legalSummary:
      'Core commercial blocking patent covering the AetherPulse basket catheter geometry. Chain of title is properly recorded in the European Patent Register under Rule 22 EPC. National validations and Year 10 renewals are paid and current in all 7 key European markets.',
    spaRemediationClause:
      'STANDARD WARRANTY SUFFICIENT: Include EP3412890B1 under Schedule 3.14(a) (Core Material Registered IP). Subject to standard Seller representation under Section 4.14(b) confirming valid subsistence and absence of encumbrances.',
    inpadocEvents: [
      { date: '2017-07-14', code: 'AK', title: 'PCT Application Filed (EP Regional Phase Entry)', ref: 'PCT/EP2017/067812' },
      { date: '2021-04-21', code: 'AK/PG25', title: 'Mention of Grant Published in European Patent Bulletin 21/16', ref: 'Art. 97(3) EPC' },
      { date: '2022-01-22', code: 'NOOP', title: 'No Opposition Filed Within 9-Month Statutory Period', ref: 'Art. 99(1) EPC' },
      { date: '2026-06-29', code: 'PAYR', title: 'National Renewal Fees Paid for Year 10 across Designated States', ref: 'Art. 86 / Art. 141 EPC' }
    ]
  },
  {
    id: 'EP3491024B1',
    applicationNumber: 'EP18192044.8',
    title: 'Biphasic Nanosecond Electroporation Waveform Generator with Cardiac Gating Synchronization',
    ipcClass: 'A61N 1/36',
    filingDate: '2018-09-03',
    priorityDate: '2017-09-05',
    grantDate: '2022-08-17',
    expirationDate: '2038-09-03',
    registeredProprietor: 'Charité – Universitätsmedizin Berlin',
    proprietorAddress: 'Charitéplatz 1, 10117 Berlin, DE',
    disclosedOwnerSchedule: 'Aetheris MedTech GmbH (Disclosed as Sole Owner in VDR Schedule 3.14)',
    inventors: ['Prof. Dr. Heinrich Kleist', 'Dr. Lukas Vance'],
    epoStatus: 'GRANTED_ACTIVE',
    epoStatusCode: 'PG25 / UNRECORDED_ASSIGNMENT',
    oppositionStatus: 'NO_OPPOSITION_EXPIRED',
    oppositionDetail: '9-month Art. 99 EPC opposition window closed 2023-05-17 without opposition.',
    annuityYear: 9,
    annuityStatus: 'PAID_CURRENT',
    annuityPaidThrough: '2027-09-30',
    nextAnnuityAmountEur: 1340,
    unitaryPatent: false,
    mismatchCategory: 'UNIVERSITY_UNRECORDED_ASSIGNMENT',
    designatedStates: [
      { code: 'DE', status: 'VALIDATED', nationalRef: 'DE602018055102.4', renewalPaid: true },
      { code: 'FR', status: 'VALIDATED', nationalRef: 'FR3491024', renewalPaid: true },
      { code: 'GB', status: 'VALIDATED', nationalRef: 'GB3491024', renewalPaid: true },
      { code: 'CH', status: 'VALIDATED', nationalRef: 'CH3491024', renewalPaid: true },
      { code: 'NL', status: 'VALIDATED', nationalRef: 'NL3491024', renewalPaid: true }
    ],
    productLine: 'AetherGen Console Waveform Firmware',
    revenueAttributionPct: 22.0,
    baseRiskCategory: 'CRITICAL_CHAIN_OF_TITLE',
    legalSummary:
      'CRITICAL CHAIN OF TITLE DEFECT: Target company disclosed EP3491024B1 as wholly owned in VDR Schedule 3.14. However, live EPO Register inspection reveals legal title remains registered solely in the name of "Charité – Universitätsmedizin Berlin". The 2020 Sponsored Research Option Exercise Agreement was never perfected via a written confirmatory assignment deed signed by both parties as strictly required by Article 72 EPC, nor recorded under Rule 22 EPC.',
    spaRemediationClause:
      'CLOSING CONDITION PRECEDENT (SPA § 7.02(f)): Prior to Closing, Seller shall deliver (i) a fully executed Confirmatory Deed of Assignment between Charité – Universitätsmedizin Berlin and Aetheris MedTech GmbH complying with the wet-ink or qualified electronic signature requirements of Article 72 EPC, (ii) waiver of any residual statutory university royalty claims under § 42 ArbEG, and (iii) proof of filing of EPO Form 5055 (Rule 22 EPC transfer request) together with payment of the administrative fee.',
    inpadocEvents: [
      { date: '2018-09-03', code: 'FIL', title: 'European Patent Application Filed by Charité – Universitätsmedizin Berlin', ref: 'Art. 75 EPC' },
      { date: '2022-08-17', code: 'PG25', title: 'Mention of Grant Published in European Patent Bulletin 22/33', ref: 'Art. 97(3) EPC' },
      { date: '2023-05-18', code: 'NOOP', title: 'Opposition Period Expired Without Third-Party Filing', ref: 'Art. 99 EPC' },
      { date: '2026-11-10', code: 'AUD_ERR', title: 'VDR Audit Alert: No Rule 22 EPC Assignment Recorded on EPO Register', ref: 'Art. 72 / Rule 22 EPC' }
    ]
  },
  {
    id: 'EP3589102B1',
    applicationNumber: 'EP19178310.9',
    title: 'Optical Coherence Tomography (OCT) Tip Sensor for Real-Time Myocardial Lesion Depth Assessment',
    ipcClass: 'A61B 5/00',
    filingDate: '2019-06-04',
    priorityDate: '2018-06-08',
    grantDate: '2025-11-12',
    expirationDate: '2039-06-04',
    registeredProprietor: 'Aetheris MedTech GmbH',
    proprietorAddress: 'Pettenkoferstraße 24, 80336 München, DE',
    disclosedOwnerSchedule: 'Aetheris MedTech GmbH',
    inventors: ['Dr. Hannah Lindqvist', 'Dr. Matteo Rossi'],
    epoStatus: 'OPPOSITION_PENDING',
    epoStatusCode: 'OPP / ART_99',
    oppositionStatus: 'ACTIVE_OPPOSITION_PROCEEDINGS',
    oppositionDetail: 'Opposition filed 2026-07-28 by CardioPulse Corp. (US) under Art. 99 EPC citing Art. 100(a) (lack of novelty Art. 54 & inventive step Art. 56 over D1: WO2017/118402A1) and Art. 100(b) EPC. Summons to Oral Proceedings issued for 2027-03-19 in Munich.',
    annuityYear: 8,
    annuityStatus: 'PAID_CURRENT',
    annuityPaidThrough: '2027-06-30',
    nextAnnuityAmountEur: 1210,
    unitaryPatent: true,
    designatedStates: [
      { code: 'UP', status: 'UNITARY_PATENT', nationalRef: 'EP3589102-UP (17 EU States)', renewalPaid: true },
      { code: 'DE', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'FR', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'IT', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'NL', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'SE', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'GB', status: 'VALIDATED', nationalRef: 'GB3589102', renewalPaid: true },
      { code: 'CH', status: 'VALIDATED', nationalRef: 'CH3589102', renewalPaid: true }
    ],
    productLine: 'OptiSense Ablation Catheter Gen-2',
    revenueAttributionPct: 16.5,
    baseRiskCategory: 'CRITICAL_OPPOSITION',
    legalSummary:
      'CRITICAL VALIDITY CONTEST: Unitary Patent EP3589102B1 is subject to contested Post-Grant Opposition proceedings under Article 99 EPC initiated by principal U.S. competitor CardioPulse Corp. Opponent seeks revocation in entirety across all 17 Unitary Patent states plus GB/CH based on prior art citation D1 (WO2017/118402A1). Preliminary Opinion of the EPO Opposition Division under Rule 116(1) EPC raised formal doubts regarding Claim 1 novelty; Target patent counsel has filed Auxiliary Requests 1 to 3 narrowing claim scope to dual-wavelength interferometry.',
    spaRemediationClause:
      'SPECIFIC INDEMNITY & ESCROW HOLDBACK (SPA § 9.02(d)): Buyer shall withhold EUR 4,500,000 in the IP Special Escrow Account pending final non-appealable resolution of EPO Opposition Proceedings in respect of EP3589102B1 (including any appeal before the Technical Boards of Appeal under Art. 106 EPC). In the event Claim 1 is revoked and Auxiliary Request 1 is not maintained under Art. 101(3)(a) EPC, Buyer shall be entitled to a permanent purchase price reduction of EUR 4,500,000 plus defense costs.',
    inpadocEvents: [
      { date: '2025-11-12', code: 'PG25', title: 'Mention of Grant Published in European Patent Bulletin 25/46', ref: 'Art. 97(3) EPC' },
      { date: '2025-12-03', code: 'UPR', title: 'Unitary Effect Registered in Register for Unitary Patent Protection', ref: 'Reg. (EU) No 1257/2012' },
      { date: '2026-07-28', code: 'OPP1', title: 'Notice of Opposition Filed by Opponent 01: CardioPulse Corp.', ref: 'Art. 99 / Rule 76 EPC' },
      { date: '2026-10-14', code: 'OPPC', title: 'Proprietor Reply & Auxiliary Requests 1–3 Filed by Patent Counsel', ref: 'Rule 79(1) EPC' },
      { date: '2026-11-02', code: 'SUMO', title: 'Summons to Oral Proceedings before Opposition Division (19 Mar 2027)', ref: 'Art. 116 / Rule 115 EPC' }
    ]
  },
  {
    id: 'EP3305198B1',
    applicationNumber: 'EP16814902.1',
    title: 'Steerable Transseptal Sheath with Integrated Magnetic Field Localization Coil Array',
    ipcClass: 'A61M 25/01',
    filingDate: '2016-10-21',
    priorityDate: '2015-10-23',
    grantDate: '2021-09-08',
    expirationDate: '2036-10-21',
    registeredProprietor: 'Aetheris MedTech GmbH',
    proprietorAddress: 'Pettenkoferstraße 24, 80336 München, DE',
    disclosedOwnerSchedule: 'Aetheris MedTech GmbH',
    inventors: ['Dipl.-Ing. Markus Weber', 'Dr. Lukas Vance'],
    epoStatus: 'LAPSED_UNPAID_FEES',
    epoStatusCode: 'LAPSE / ART_86',
    oppositionStatus: 'NO_OPPOSITION_EXPIRED',
    oppositionDetail: 'Opposition period closed 2022-06-08 without opposition.',
    annuityYear: 10,
    annuityStatus: 'LAPSED_NON_PAYMENT',
    annuityPaidThrough: '2025-10-31 (Grace Period Expired 2026-04-30)',
    nextAnnuityAmountEur: 2890,
    unitaryPatent: false,
    designatedStates: [
      { code: 'DE', status: 'LAPSED', nationalRef: 'DE602016061198.2 (Lapsed)', renewalPaid: false },
      { code: 'FR', status: 'LAPSED', nationalRef: 'FR3305198 (Lapsed)', renewalPaid: false },
      { code: 'GB', status: 'LAPSED', nationalRef: 'GB3305198 (Lapsed)', renewalPaid: false },
      { code: 'IT', status: 'LAPSED', nationalRef: 'IT502021000098112 (Lapsed)', renewalPaid: false }
    ],
    productLine: 'AetherGuide Steerable Sheath Accessory',
    revenueAttributionPct: 6.0,
    baseRiskCategory: 'CRITICAL_LAPSED',
    legalSummary:
      'CRITICAL STATUTORY LAPSE: EP3305198B1 is listed as "Active & Subsisting" on Seller’s Schedule 3.14. However, INPADOC legal status verification shows that Year 10 renewal fees due October 31, 2025 were missed, and the 6-month statutory grace period with 50% surcharge (Rule 51(2) EPC / National equivalents) expired on April 30, 2026 following a change of external annuity CPA vendor. The patent is recorded as lapsed for non-payment in DE, FR, GB, and IT. Re-establishment of rights (Restitutio in integrum under Art. 122 EPC / National Patent Laws) is likely time-barred (>2 months from removal of cause of non-compliance).',
    spaRemediationClause:
      'BREACH OF REPRESENTATION REMEDIATION & PRICE ADJUSTMENT (SPA § 2.04(c)): Acknowledge statutory lapse of EP3305198B1 in Disclosure Schedule 3.14(b). Deduct EUR 1,250,000 from Headline Enterprise Value reflecting loss of exclusivity on the AetherGuide Steerable Sheath accessory line, and require Seller to assign any malpractice claim against its former annuity management vendor to Buyer at Closing.',
    inpadocEvents: [
      { date: '2021-09-08', code: 'PG25', title: 'Mention of Grant Published in European Patent Bulletin 21/36', ref: 'Art. 97(3) EPC' },
      { date: '2025-10-31', code: 'RDUE', title: 'Year 10 Renewal Fee Due Date Missed', ref: 'Art. 86(1) / Art. 141 EPC' },
      { date: '2026-04-30', code: 'GEXP', title: 'Expiration of 6-Month Grace Period with 50% Additional Fee', ref: 'Rule 51(2) EPC' },
      { date: '2026-07-15', code: 'PGFP', title: 'Lapse of Patent in Contracting States (DE, FR, GB, IT) for Non-Payment', ref: 'INPADOC Code PGFP' }
    ]
  },
  {
    id: 'EP3618440B1',
    applicationNumber: 'EP19194012.1',
    title: 'Closed-Loop Cryo-Balloon Pressure Regulation System for Pulmonary Vein Isolation',
    ipcClass: 'A61B 18/02',
    filingDate: '2019-08-28',
    priorityDate: '2018-08-30',
    grantDate: '2023-11-29',
    expirationDate: '2039-08-28',
    registeredProprietor: 'Dr. Lukas Vance',
    proprietorAddress: 'Maximilianstraße 41, 80539 München, DE',
    disclosedOwnerSchedule: 'Aetheris MedTech GmbH',
    inventors: ['Dr. Lukas Vance'],
    epoStatus: 'GRANTED_ACTIVE',
    epoStatusCode: 'PG25 / FOUNDER_HELD',
    oppositionStatus: 'NO_OPPOSITION_EXPIRED',
    oppositionDetail: '9-month Art. 99 EPC opposition window closed 2024-08-29 without opposition.',
    annuityYear: 8,
    annuityStatus: 'PAID_CURRENT',
    annuityPaidThrough: '2027-08-31',
    nextAnnuityAmountEur: 1180,
    unitaryPatent: true,
    mismatchCategory: 'FOUNDER_PERSONAL_OWNERSHIP',
    designatedStates: [
      { code: 'UP', status: 'UNITARY_PATENT', nationalRef: 'EP3618440-UP (17 EU States)', renewalPaid: true },
      { code: 'DE', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'FR', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'NL', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'SE', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'CH', status: 'VALIDATED', nationalRef: 'CH3618440', renewalPaid: true }
    ],
    productLine: 'CryoVance Smart Console Module',
    revenueAttributionPct: 9.5,
    baseRiskCategory: 'CRITICAL_CHAIN_OF_TITLE',
    legalSummary:
      'CRITICAL FOUNDER CHAIN-OF-TITLE DEFECT: Unitary Patent EP3618440B1 remains registered personally in the name of Co-Founder & CTO "Dr. Lukas Vance" on the European Patent Register and the Register for Unitary Patent Protection. Although Dr. Vance signed a general Founder Service Agreement in 2019 containing a covenant to assign, German and EPC law distinguish between an obligatory covenant and an in rem transfer of title under Art. 72 EPC. Without an executed, recorded assignment, Dr. Vance holds legal standing as sole proprietor.',
    spaRemediationClause:
      'KEY FOUNDER CLOSING DELIVERABLE (SPA § 7.02(g)): As an express condition to Closing and prior to release of Founder Consideration Shares, Dr. Lukas Vance shall execute an irrevocable, royalty-free In-Rem Patent Assignment Deed under Art. 72 EPC transferring EP3618440B1 and all national/unitary rights to Aetheris MedTech GmbH, waiving all statutory employee inventor compensation claims under the German Employee Inventions Act (ArbEG), with immediate filing of Unitary Patent Register transfer request.',
    inpadocEvents: [
      { date: '2019-08-28', code: 'FIL', title: 'Application Filed in Personal Name of Applicant: Dr. Lukas Vance', ref: 'Art. 58 / Art. 60 EPC' },
      { date: '2023-11-29', code: 'PG25', title: 'Mention of Grant Published in European Patent Bulletin 23/48', ref: 'Art. 97(3) EPC' },
      { date: '2023-12-18', code: 'UPR', title: 'Unitary Effect Registered under Proprietor: Dr. Lukas Vance', ref: 'Rule 6 UPR' },
      { date: '2026-11-10', code: 'AUD_ERR', title: 'VDR Audit Alert: Founder Personal Ownership — Missing Rule 22 EPC Transfer', ref: 'Art. 72 / Rule 22 EPC' }
    ]
  },
  {
    id: 'EP2148705B1',
    applicationNumber: 'EP07849102.4',
    title: 'First-Generation Unipolar Endocardial Mapping Electrode Array and Reference Patch',
    ipcClass: 'A61B 5/287',
    filingDate: '2007-12-18',
    priorityDate: '2006-12-20',
    grantDate: '2013-05-15',
    expirationDate: '2027-12-18',
    registeredProprietor: 'Aetheris MedTech GmbH',
    proprietorAddress: 'Pettenkoferstraße 24, 80336 München, DE',
    disclosedOwnerSchedule: 'Aetheris MedTech GmbH',
    inventors: ['Prof. Dr. Klaus Bergmann', 'Dr. Lukas Vance'],
    epoStatus: 'GRANTED_EXPIRING_SOON',
    epoStatusCode: 'PG25 / EXP_13M',
    oppositionStatus: 'NO_OPPOSITION_EXPIRED',
    oppositionDetail: 'Opposition window expired 2014-02-15 without opposition.',
    annuityYear: 19,
    annuityStatus: 'PAID_CURRENT',
    annuityPaidThrough: '2026-12-31 (Final Year 20 Annuity Due Dec 2026)',
    nextAnnuityAmountEur: 3420,
    unitaryPatent: false,
    designatedStates: [
      { code: 'DE', status: 'VALIDATED', nationalRef: 'DE602007029705.1', renewalPaid: true },
      { code: 'FR', status: 'VALIDATED', nationalRef: 'FR2148705', renewalPaid: true },
      { code: 'GB', status: 'VALIDATED', nationalRef: 'GB2148705', renewalPaid: true }
    ],
    productLine: 'Legacy MapPatch Disposable Kits',
    revenueAttributionPct: 4.5,
    baseRiskCategory: 'WARNING_EXPIRING',
    legalSummary:
      'MATERIAL STATUTORY EXPIRATION HORIZON (<14 MONTHS): EP2148705B1 reaches its maximum 20-year statutory term under Article 63(1) EPC on December 18, 2027 (approx. 13 months from audit date). Because the protected product is a Class III medical device rather than a medicinal product, it is statutorily ineligible for a Supplementary Protection Certificate (SPC) under Regulation (EC) No 469/2009 (as confirmed by CJEU C-527/17 Boston Scientific). Financial valuation models must step down MapPatch disposable gross margins post-2027.',
    spaRemediationClause:
      'VALUATION MODEL ADJUSTMENT (DCF & ROYALTY RUNWAY): No legal title defect; however, Deal Financial Model should adjust terminal royalty assumptions for Legacy MapPatch Disposable Kits to reflect generic disposable entry after December 18, 2027 upon Art. 63(1) EPC expiration.',
    inpadocEvents: [
      { date: '2007-12-18', code: 'FIL', title: 'International Filing Date (Commencement of 20-Year Art. 63(1) EPC Term)', ref: 'Art. 63(1) EPC' },
      { date: '2013-05-15', code: 'PG25', title: 'Mention of Grant Published in European Patent Bulletin 13/20', ref: 'Art. 97(3) EPC' },
      { date: '2020-03-11', code: 'TRA', title: 'Transfer of Rights Recorded to Aetheris MedTech GmbH', ref: 'Rule 22 EPC' },
      { date: '2026-11-10', code: 'TERM_WARN', title: 'Statutory Term Horizon Alert: Less than 14 Months Remaining until Expiry', ref: 'Art. 63(1) EPC' }
    ]
  },
  {
    id: 'EP3702115B1',
    applicationNumber: 'EP20159822.4',
    title: 'High-Density Basket Mapping Catheter with Superelastic Nitinol Spline Architecture',
    ipcClass: 'A61B 18/14',
    filingDate: '2020-02-26',
    priorityDate: '2019-03-01',
    grantDate: '2023-06-14',
    expirationDate: '2040-02-26',
    registeredProprietor: 'Aetheris MedTech GmbH',
    proprietorAddress: 'Pettenkoferstraße 24, 80336 München, DE',
    disclosedOwnerSchedule: 'Aetheris MedTech GmbH',
    inventors: ['Dr. Hannah Lindqvist', 'Dipl.-Ing. Markus Weber'],
    epoStatus: 'GRANTED_ACTIVE',
    epoStatusCode: 'PG25 / UPR',
    oppositionStatus: 'NO_OPPOSITION_EXPIRED',
    oppositionDetail: '9-month Art. 99 EPC opposition window closed 2024-03-14 without opposition.',
    annuityYear: 7,
    annuityStatus: 'PAID_CURRENT',
    annuityPaidThrough: '2027-02-28',
    nextAnnuityAmountEur: 1090,
    unitaryPatent: true,
    designatedStates: [
      { code: 'UP', status: 'UNITARY_PATENT', nationalRef: 'EP3702115-UP (17 EU States)', renewalPaid: true },
      { code: 'DE', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'FR', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'IT', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'NL', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'SE', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'GB', status: 'VALIDATED', nationalRef: 'GB3702115', renewalPaid: true },
      { code: 'CH', status: 'VALIDATED', nationalRef: 'CH3702115', renewalPaid: true },
      { code: 'ES', status: 'VALIDATED', nationalRef: 'ES2948102T3', renewalPaid: true }
    ],
    productLine: 'AetherMap HD 64-Pole Catheter',
    revenueAttributionPct: 4.0,
    baseRiskCategory: 'CLEAN',
    legalSummary:
      'Verified clean Unitary Patent plus GB, CH, and ES national validations. Chain of title is registered directly to Aetheris MedTech GmbH, opposition window has closed clean, and Year 7 Unitary renewal fee is paid.',
    spaRemediationClause:
      'STANDARD WARRANTY SUFFICIENT: Include under Schedule 3.14(a) Verified Registered IP without special closing conditions.',
    inpadocEvents: [
      { date: '2020-02-26', code: 'FIL', title: 'European Application Filed by Aetheris MedTech GmbH', ref: 'Art. 75 EPC' },
      { date: '2023-06-14', code: 'PG25', title: 'Mention of Grant Published in European Patent Bulletin 23/24', ref: 'Art. 97(3) EPC' },
      { date: '2023-07-02', code: 'UPR', title: 'Unitary Effect Registered across 17 Participating EU Member States', ref: 'Reg. (EU) 1257/2012' },
      { date: '2026-02-15', code: 'PAYR', title: 'Year 07 Unitary Renewal Fee & National Renewals Paid in Full', ref: 'Art. 86 EPC' }
    ]
  },
  {
    id: 'EP3819401B1',
    applicationNumber: 'EP20198441.6',
    title: 'Dielectric Tissue Contact Force Sensing Assembly for Endocardial Ablation Catheters',
    ipcClass: 'A61B 18/12',
    filingDate: '2020-09-25',
    priorityDate: '2019-09-27',
    grantDate: '2024-01-10',
    expirationDate: '2040-09-25',
    registeredProprietor: 'Aetheris MedTech GmbH',
    proprietorAddress: 'Pettenkoferstraße 24, 80336 München, DE',
    disclosedOwnerSchedule: 'Aetheris MedTech GmbH',
    inventors: ['Dr. Matteo Rossi', 'Dr. Lukas Vance'],
    epoStatus: 'GRANTED_ACTIVE',
    epoStatusCode: 'PG25 / UPR',
    oppositionStatus: 'NO_OPPOSITION_EXPIRED',
    oppositionDetail: '9-month Art. 99 EPC opposition window closed 2024-10-10 without opposition.',
    annuityYear: 7,
    annuityStatus: 'PAID_CURRENT',
    annuityPaidThrough: '2027-09-30',
    nextAnnuityAmountEur: 1090,
    unitaryPatent: true,
    designatedStates: [
      { code: 'UP', status: 'UNITARY_PATENT', nationalRef: 'EP3819401-UP (17 EU States)', renewalPaid: true },
      { code: 'DE', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'FR', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'NL', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'GB', status: 'VALIDATED', nationalRef: 'GB3819401', renewalPaid: true },
      { code: 'CH', status: 'VALIDATED', nationalRef: 'CH3819401', renewalPaid: true }
    ],
    productLine: 'AetherPulse PFA Core System',
    revenueAttributionPct: 3.0,
    baseRiskCategory: 'CLEAN',
    legalSummary:
      'Verified clean Unitary Patent protecting contact force dielectric sensing. Proprietor matches target entity, opposition window expired without challenge, and annuities are paid through September 2027.',
    spaRemediationClause:
      'STANDARD WARRANTY SUFFICIENT: Include under Schedule 3.14(a) Verified Registered IP.',
    inpadocEvents: [
      { date: '2020-09-25', code: 'FIL', title: 'European Patent Application Filed', ref: 'Art. 75 EPC' },
      { date: '2024-01-10', code: 'PG25', title: 'Mention of Grant Published in European Patent Bulletin 24/02', ref: 'Art. 97(3) EPC' },
      { date: '2024-10-11', code: 'NOOP', title: 'No Opposition Filed Within 9-Month Window', ref: 'Art. 99 EPC' },
      { date: '2026-09-12', code: 'PAYR', title: 'Year 07 Renewal Fees Paid', ref: 'Art. 86 EPC' }
    ]
  },
  {
    id: 'EP3904118B1',
    applicationNumber: 'EP21164209.5',
    title: 'Real-Time Phrenic Nerve Pacing & Diaphragmatic Electromyography Safety Interlock',
    ipcClass: 'A61N 1/08',
    filingDate: '2021-03-23',
    priorityDate: '2020-03-25',
    grantDate: '2024-05-22',
    expirationDate: '2041-03-23',
    registeredProprietor: 'Aetheris MedTech GmbH',
    proprietorAddress: 'Pettenkoferstraße 24, 80336 München, DE',
    disclosedOwnerSchedule: 'Aetheris MedTech GmbH',
    inventors: ['Dr. Hannah Lindqvist', 'Dr. Lukas Vance'],
    epoStatus: 'GRANTED_ACTIVE',
    epoStatusCode: 'PG25 / REG',
    oppositionStatus: 'NO_OPPOSITION_EXPIRED',
    oppositionDetail: '9-month Art. 99 EPC opposition window closed 2025-02-22 without opposition.',
    annuityYear: 6,
    annuityStatus: 'PAID_CURRENT',
    annuityPaidThrough: '2027-03-31',
    nextAnnuityAmountEur: 980,
    unitaryPatent: false,
    strictShowcaseUnitary: false,
    strictShowcaseDesignatedStates: [
      { code: 'DE', status: 'VALIDATED', nationalRef: 'DE602021011418.9', renewalPaid: true },
      { code: 'CH', status: 'VALIDATED', nationalRef: 'CH3904118', renewalPaid: true }
    ],
    designatedStates: [
      { code: 'DE', status: 'VALIDATED', nationalRef: 'DE602021011418.9', renewalPaid: true },
      { code: 'FR', status: 'VALIDATED', nationalRef: 'FR3904118', renewalPaid: true },
      { code: 'GB', status: 'VALIDATED', nationalRef: 'GB3904118', renewalPaid: true },
      { code: 'CH', status: 'VALIDATED', nationalRef: 'CH3904118', renewalPaid: true },
      { code: 'NL', status: 'VALIDATED', nationalRef: 'NL3904118', renewalPaid: true },
      { code: 'ES', status: 'VALIDATED', nationalRef: 'ES2981140T3', renewalPaid: true }
    ],
    productLine: 'AetherGen Console Safety Subsystem',
    revenueAttributionPct: 2.0,
    baseRiskCategory: 'CLEAN',
    legalSummary:
      'European patent protecting the phrenic nerve safety interlock. Under Strict 5-Rule Audit mode, post-grant national validation was only perfected in 2 states (DE and CH) without Unitary Effect, triggering Check 4 WARNING ("Narrow European Validation" < 3 states).',
    spaRemediationClause:
      'TERRITORIAL COVERAGE CONFIRMATION (SPA Schedule 3.14): Confirm that DE and CH national validations cover Target’s manufacturing and DACH commercial footprint, or note absence of FR/GB/IT/ES validation in commercial exclusivity schedule.',
    inpadocEvents: [
      { date: '2021-03-23', code: 'FIL', title: 'European Application Filed by Aetheris MedTech GmbH', ref: 'Art. 75 EPC' },
      { date: '2024-05-22', code: 'PG25', title: 'Mention of Grant Published in European Patent Bulletin 24/21', ref: 'Art. 97(3) EPC' },
      { date: '2025-02-23', code: 'NOOP', title: '9-Month Opposition Window Closed Without Filing', ref: 'Art. 99 EPC' },
      { date: '2026-03-10', code: 'PAYR', title: 'Year 06 Renewal Fees Paid in Validated States', ref: 'Art. 86 EPC' }
    ]
  },
  {
    id: 'EP3988210B1',
    applicationNumber: 'EP21201890.7',
    title: 'Irrigated Micro-Porous Distal Electrode Tip for Thrombus-Free Pulsed Field Delivery',
    ipcClass: 'A61B 18/14',
    filingDate: '2021-10-11',
    priorityDate: '2020-10-14',
    grantDate: '2024-09-18',
    expirationDate: '2041-10-11',
    registeredProprietor: 'Aetheris MedTech GmbH',
    proprietorAddress: 'Pettenkoferstraße 24, 80336 München, DE',
    disclosedOwnerSchedule: 'Aetheris MedTech GmbH',
    inventors: ['Dipl.-Ing. Markus Weber', 'Dr. Matteo Rossi'],
    epoStatus: 'GRANTED_ACTIVE',
    epoStatusCode: 'PG25 / UPR',
    oppositionStatus: 'NO_OPPOSITION_EXPIRED',
    oppositionDetail: '9-month Art. 99 EPC opposition window closed 2025-06-18 without opposition.',
    annuityYear: 6,
    annuityStatus: 'PAID_CURRENT',
    annuityPaidThrough: '2027-10-31',
    nextAnnuityAmountEur: 980,
    unitaryPatent: true,
    designatedStates: [
      { code: 'UP', status: 'UNITARY_PATENT', nationalRef: 'EP3988210-UP (17 EU States)', renewalPaid: true },
      { code: 'DE', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'FR', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'IT', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'NL', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'SE', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'GB', status: 'VALIDATED', nationalRef: 'GB3988210', renewalPaid: true }
    ],
    productLine: 'AetherPulse PFA Core System',
    revenueAttributionPct: 1.5,
    baseRiskCategory: 'CLEAN',
    legalSummary:
      'Verified clean Unitary Patent plus UK national validation. Registered proprietor matches target entity, opposition window expired clean in June 2025, and Year 6 renewal fee was recently settled.',
    spaRemediationClause:
      'STANDARD WARRANTY SUFFICIENT: Include under Schedule 3.14(a) Verified Registered IP.',
    inpadocEvents: [
      { date: '2021-10-11', code: 'FIL', title: 'European Patent Application Filed', ref: 'Art. 75 EPC' },
      { date: '2024-09-18', code: 'PG25', title: 'Mention of Grant Published in European Patent Bulletin 24/38', ref: 'Art. 97(3) EPC' },
      { date: '2025-06-19', code: 'NOOP', title: 'Opposition Period Expired Without Third-Party Filing', ref: 'Art. 99 EPC' },
      { date: '2026-10-04', code: 'PAYR', title: 'Year 06 Unitary & GB Renewal Fees Paid', ref: 'Art. 86 EPC' }
    ]
  },
  {
    id: 'EP4051904B1',
    applicationNumber: 'EP22158012.9',
    title: 'Machine-Learned Intracardiac Electrogram (EGM) Rotor Identification & Ablation Target Scoring',
    ipcClass: 'G16H 50/20',
    filingDate: '2022-02-22',
    priorityDate: '2021-02-24',
    grantDate: '2025-01-08',
    expirationDate: '2042-02-22',
    registeredProprietor: 'Aetheris MedTech GmbH',
    proprietorAddress: 'Pettenkoferstraße 24, 80336 München, DE',
    disclosedOwnerSchedule: 'Aetheris MedTech GmbH',
    inventors: ['Dr. Hannah Lindqvist', 'Dr. Lukas Vance'],
    epoStatus: 'GRANTED_ACTIVE',
    epoStatusCode: 'PG25 / UPR',
    oppositionStatus: 'NO_OPPOSITION_EXPIRED',
    oppositionDetail: '9-month Art. 99 EPC opposition window closed 2025-10-08 without opposition.',
    annuityYear: 5,
    annuityStatus: 'PAID_CURRENT',
    annuityPaidThrough: '2027-02-28',
    nextAnnuityAmountEur: 850,
    unitaryPatent: true,
    designatedStates: [
      { code: 'UP', status: 'UNITARY_PATENT', nationalRef: 'EP4051904-UP (17 EU States)', renewalPaid: true },
      { code: 'DE', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'FR', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'NL', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'SE', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'GB', status: 'VALIDATED', nationalRef: 'GB4051904', renewalPaid: true },
      { code: 'CH', status: 'VALIDATED', nationalRef: 'CH4051904', renewalPaid: true }
    ],
    productLine: 'AetherAI Mapping Cloud Suite',
    revenueAttributionPct: 1.5,
    baseRiskCategory: 'CLEAN',
    legalSummary:
      'Verified clean computer-implemented medical invention (passed EPO G 1/19 technical effect examination). Unitary Patent registered to Aetheris MedTech GmbH; opposition period closed clean in October 2025.',
    spaRemediationClause:
      'STANDARD WARRANTY SUFFICIENT: Include under Schedule 3.14(a) Verified Registered IP.',
    inpadocEvents: [
      { date: '2022-02-22', code: 'FIL', title: 'European Patent Application Filed', ref: 'Art. 52 / G 1/19 EPC' },
      { date: '2025-01-08', code: 'PG25', title: 'Mention of Grant Published in European Patent Bulletin 25/02', ref: 'Art. 97(3) EPC' },
      { date: '2025-10-09', code: 'NOOP', title: 'No Opposition Filed Within 9-Month Window', ref: 'Art. 99 EPC' },
      { date: '2026-02-14', code: 'PAYR', title: 'Year 05 Renewal Fees Paid in Full', ref: 'Art. 86 EPC' }
    ]
  },
  {
    id: 'EP4129805B1',
    applicationNumber: 'EP22189401.7',
    title: 'Zero-Fluoroscopy 3D Magneto-Impedance Catheter Navigation Matrix and Patient Patch Set',
    ipcClass: 'A61B 34/20',
    filingDate: '2022-08-08',
    priorityDate: '2021-08-12',
    grantDate: '2025-02-05',
    strictShowcaseGrantDate: '2026-07-08',
    expirationDate: '2042-08-08',
    registeredProprietor: 'Aetheris MedTech GmbH',
    proprietorAddress: 'Pettenkoferstraße 24, 80336 München, DE',
    disclosedOwnerSchedule: 'Aetheris MedTech GmbH',
    inventors: ['Dipl.-Ing. Markus Weber', 'Dr. Matteo Rossi'],
    epoStatus: 'GRANTED_ACTIVE',
    epoStatusCode: 'PG25 / UPR',
    oppositionStatus: 'NO_OPPOSITION_EXPIRED',
    oppositionDetail: 'In Strict 5-Rule Audit mode, B1 mention of grant published 2026-07-08 (4.2 months ago); statutory 9-month Art. 99(1) EPC opposition period remains open until 2027-04-08.',
    annuityYear: 5,
    annuityStatus: 'PAID_CURRENT',
    annuityPaidThrough: '2027-08-31',
    nextAnnuityAmountEur: 850,
    unitaryPatent: true,
    designatedStates: [
      { code: 'UP', status: 'UNITARY_PATENT', nationalRef: 'EP4129805-UP (17 EU States)', renewalPaid: true },
      { code: 'DE', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'FR', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'IT', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'NL', status: 'VALIDATED', nationalRef: 'Covered by Unitary Patent', renewalPaid: true },
      { code: 'GB', status: 'VALIDATED', nationalRef: 'GB4129805', renewalPaid: true },
      { code: 'CH', status: 'VALIDATED', nationalRef: 'CH4129805', renewalPaid: true },
      { code: 'ES', status: 'VALIDATED', nationalRef: 'ES3004120T3', renewalPaid: true }
    ],
    productLine: 'AetherNav 3D Zero-Fluoro Suite',
    revenueAttributionPct: 1.0,
    baseRiskCategory: 'CLEAN',
    legalSummary:
      'Unitary Patent plus GB, CH, and ES national validations. Under Strict 5-Rule Audit mode, mention of grant occurred 4.2 months ago (2026-07-08), triggering Check 3 WARNING ("Within 9-Month Opposition Window" under Art. 99(1) EPC).',
    spaRemediationClause:
      'POST-GRANT OPPOSITION WINDOW COVENANT (SPA § 6.08): Because the 9-month statutory opposition window under Art. 99(1) EPC remains open until April 8, 2027, Seller warrants it has received no notice of third-party opposition intent and agrees to notify Buyer within 3 Business Days of any EPO Rule 79 communication.',
    inpadocEvents: [
      { date: '2022-08-08', code: 'FIL', title: 'European Patent Application Filed', ref: 'Art. 75 EPC' },
      { date: '2026-07-08', code: 'PG25', title: 'Mention of Grant Published in European Patent Bulletin (9-Month Art. 99 Window Open)', ref: 'Art. 97(3) / Art. 99(1) EPC' },
      { date: '2026-08-03', code: 'PAYR', title: 'Year 05 Unitary & National Renewals Settled', ref: 'Art. 86 EPC' }
    ]
  }
];;
