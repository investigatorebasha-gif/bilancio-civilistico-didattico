import type { FiscalYearData } from "../types/accounting";

export const defaultSettings: FiscalYearData["settings"] = {
  mode: "ordinario",
  showZeroRows: false,
  schoolMode: true,
  includePreviousYearColumn: false,
  rounding: "euro",
  abbreviatedAssetPresentation: "separate",
  abbreviatedLiabilityPresentation: "separate"
};

export const sampleData: FiscalYearData = {
  year: 2026,
  companyName: "Alfa Didattica S.r.l.",
  legalForm: "S.r.l.",
  currency: "EUR",
  isListed: false,
  thresholds: {
    totalAssets: 350000,
    salesRevenue: 280000,
    averageEmployees: 12
  },
  previousYear: {
    year: 2025,
    totalAssets: 320000,
    salesRevenue: 260000,
    averageEmployees: 11
  },
  settings: defaultSettings,
  accounts: [
    {
      id: "bs-001",
      name: "Crediti verso soci per versamenti dovuti",
      amount: 5000,
      nature: "asset",
      civilCodeCode: "SP.A.A",
      reclassifiedCode: "RF.AC.LD",
      dueWithin12Months: true
    },
    {
      id: "bs-002",
      name: "Software e marchi",
      amount: 12000,
      nature: "asset",
      civilCodeCode: "SP.A.B.I",
      reclassifiedCode: "RF.AI.I"
    },
    {
      id: "bs-003",
      name: "Impianti e macchinari",
      amount: 150000,
      nature: "asset",
      civilCodeCode: "SP.A.B.II",
      reclassifiedCode: "RF.AI.II"
    },
    {
      id: "bs-004",
      name: "Partecipazioni immobilizzate",
      amount: 18000,
      nature: "asset",
      civilCodeCode: "SP.A.B.III",
      reclassifiedCode: "RF.AI.III"
    },
    {
      id: "bs-005",
      name: "Rimanenze di merci",
      amount: 42000,
      nature: "asset",
      civilCodeCode: "SP.A.C.I",
      reclassifiedCode: "RF.AC.R"
    },
    {
      id: "bs-006",
      name: "Crediti verso clienti entro 12 mesi",
      amount: 65000,
      nature: "asset",
      civilCodeCode: "SP.A.C.II",
      reclassifiedCode: "RF.AC.LD",
      dueWithin12Months: true
    },
    {
      id: "bs-007",
      name: "Crediti verso clienti oltre 12 mesi",
      amount: 10000,
      nature: "asset",
      civilCodeCode: "SP.A.C.II",
      reclassifiedCode: "RF.AI.III",
      dueBeyond12Months: true
    },
    {
      id: "bs-008",
      name: "Titoli non immobilizzati",
      amount: 8000,
      nature: "asset",
      civilCodeCode: "SP.A.C.III",
      reclassifiedCode: "RF.AC.LD"
    },
    {
      id: "bs-009",
      name: "Banca c/c attivo e cassa",
      amount: 37000,
      nature: "asset",
      civilCodeCode: "SP.A.C.IV",
      reclassifiedCode: "RF.AC.LI"
    },
    {
      id: "bs-010",
      name: "Ratei e risconti attivi",
      amount: 3000,
      nature: "asset",
      civilCodeCode: "SP.A.D",
      reclassifiedCode: "RF.AC.LD",
      dueWithin12Months: true
    },
    {
      id: "bs-011",
      name: "Capitale sociale",
      amount: 120000,
      nature: "equity",
      civilCodeCode: "SP.P.A.I",
      reclassifiedCode: "RF.CN"
    },
    {
      id: "bs-012",
      name: "Riserva legale",
      amount: 10000,
      nature: "equity",
      civilCodeCode: "SP.P.A.IV",
      reclassifiedCode: "RF.CN"
    },
    {
      id: "bs-013",
      name: "Altre riserve",
      amount: 35000,
      nature: "equity",
      civilCodeCode: "SP.P.A.VI",
      reclassifiedCode: "RF.CN"
    },
    {
      id: "bs-014",
      name: "Utili portati a nuovo",
      amount: 5000,
      nature: "equity",
      civilCodeCode: "SP.P.A.VIII",
      reclassifiedCode: "RF.CN"
    },
    {
      id: "bs-015",
      name: "Utile dell'esercizio",
      amount: 27000,
      nature: "equity",
      civilCodeCode: "SP.P.A.IX",
      reclassifiedCode: "RF.CN"
    },
    {
      id: "bs-016",
      name: "Fondo rischi e oneri",
      amount: 8000,
      nature: "liability",
      civilCodeCode: "SP.P.B",
      reclassifiedCode: "RF.PCONS"
    },
    {
      id: "bs-017",
      name: "Trattamento fine rapporto",
      amount: 22000,
      nature: "liability",
      civilCodeCode: "SP.P.C",
      reclassifiedCode: "RF.PCONS"
    },
    {
      id: "bs-018",
      name: "Debiti verso fornitori entro 12 mesi",
      amount: 52000,
      nature: "liability",
      civilCodeCode: "SP.P.D",
      reclassifiedCode: "RF.PC",
      dueWithin12Months: true
    },
    {
      id: "bs-019",
      name: "Quota mutui entro 12 mesi",
      amount: 18000,
      nature: "liability",
      civilCodeCode: "SP.P.D",
      reclassifiedCode: "RF.PC",
      dueWithin12Months: true
    },
    {
      id: "bs-020",
      name: "Mutui oltre 12 mesi",
      amount: 42000,
      nature: "liability",
      civilCodeCode: "SP.P.D",
      reclassifiedCode: "RF.PCONS",
      dueBeyond12Months: true
    },
    {
      id: "bs-021",
      name: "Ratei e risconti passivi",
      amount: 11000,
      nature: "liability",
      civilCodeCode: "SP.P.E",
      reclassifiedCode: "RF.PC",
      dueWithin12Months: true
    },
    {
      id: "is-001",
      name: "Ricavi delle vendite",
      amount: 280000,
      nature: "revenue",
      civilCodeCode: "CE.A.1",
      reclassifiedCode: "CE.VA.RICAVI"
    },
    {
      id: "is-002",
      name: "Variazione rimanenze prodotti finiti",
      amount: 4000,
      nature: "revenue",
      civilCodeCode: "CE.A.2",
      reclassifiedCode: "CE.VA.RICAVI"
    },
    {
      id: "is-003",
      name: "Incrementi immobilizzazioni per lavori interni",
      amount: 3000,
      nature: "revenue",
      civilCodeCode: "CE.A.4",
      reclassifiedCode: "CE.VA.RICAVI"
    },
    {
      id: "is-004",
      name: "Altri ricavi",
      amount: 6000,
      nature: "revenue",
      civilCodeCode: "CE.A.5",
      reclassifiedCode: "CE.VA.RICAVI"
    },
    {
      id: "is-005",
      name: "Acquisti materie e merci",
      amount: 96000,
      nature: "cost",
      civilCodeCode: "CE.B.6",
      reclassifiedCode: "CE.VA.ESTERNI"
    },
    {
      id: "is-006",
      name: "Servizi",
      amount: 42000,
      nature: "cost",
      civilCodeCode: "CE.B.7",
      reclassifiedCode: "CE.VA.ESTERNI"
    },
    {
      id: "is-007",
      name: "Canoni leasing metodo patrimoniale",
      amount: 9000,
      nature: "cost",
      civilCodeCode: "CE.B.8",
      reclassifiedCode: "CE.VA.ESTERNI",
      notes: "Leasing civilistico/OIC: canoni in B8 fino al riscatto."
    },
    {
      id: "is-008",
      name: "Costi per il personale",
      amount: 68000,
      nature: "cost",
      civilCodeCode: "CE.B.9",
      reclassifiedCode: "CE.VA.PERSONALE"
    },
    {
      id: "is-009",
      name: "Ammortamenti",
      amount: 21000,
      nature: "cost",
      civilCodeCode: "CE.B.10",
      reclassifiedCode: "CE.VA.AMMORTAMENTI"
    },
    {
      id: "is-010",
      name: "Variazione rimanenze materie prime",
      amount: 2000,
      nature: "cost",
      civilCodeCode: "CE.B.11",
      reclassifiedCode: "CE.VA.ESTERNI"
    },
    {
      id: "is-011",
      name: "Accantonamenti per rischi",
      amount: 3000,
      nature: "cost",
      civilCodeCode: "CE.B.12",
      reclassifiedCode: "CE.VA.ACCANTONAMENTI"
    },
    {
      id: "is-012",
      name: "Oneri diversi di gestione",
      amount: 4000,
      nature: "cost",
      civilCodeCode: "CE.B.14",
      reclassifiedCode: "CE.VA.ESTERNI"
    },
    {
      id: "is-013",
      name: "Altri proventi finanziari",
      amount: 1500,
      nature: "revenue",
      civilCodeCode: "CE.C.16",
      reclassifiedCode: "CE.VA.FINANZIARIA"
    },
    {
      id: "is-014",
      name: "Interessi passivi su mutui e obbligazioni",
      amount: 7000,
      nature: "cost",
      civilCodeCode: "CE.C.17",
      reclassifiedCode: "CE.VA.FINANZIARIA",
      notes: "Include interessi su mutui e prestiti obbligazionari."
    },
    {
      id: "is-015",
      name: "Perdita su cambi",
      amount: -500,
      nature: "cost",
      civilCodeCode: "CE.C.17-bis",
      reclassifiedCode: "CE.VA.FINANZIARIA"
    },
    {
      id: "is-016",
      name: "Svalutazioni attivita finanziarie",
      amount: 2000,
      nature: "cost",
      civilCodeCode: "CE.D.19",
      reclassifiedCode: "CE.VA.FINANZIARIA"
    },
    {
      id: "is-017",
      name: "Imposte sul reddito",
      amount: 13000,
      nature: "cost",
      civilCodeCode: "CE.20",
      reclassifiedCode: "CE.VA.IMPOSTE"
    }
  ]
};
