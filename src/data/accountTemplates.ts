import type { AccountTemplate } from "../types/accounting";

export const accountTemplates: AccountTemplate[] = [
  {
    label: "Banca c/c attivo",
    nature: "asset",
    civilCodeCode: "SP.A.C.IV",
    reclassifiedCode: "RF.AC.LI"
  },
  {
    label: "Cassa",
    nature: "asset",
    civilCodeCode: "SP.A.C.IV",
    reclassifiedCode: "RF.AC.LI"
  },
  {
    label: "Crediti verso clienti entro 12 mesi",
    nature: "asset",
    civilCodeCode: "SP.A.C.II",
    reclassifiedCode: "RF.AC.LD",
    dueWithin12Months: true
  },
  {
    label: "Crediti verso clienti oltre 12 mesi",
    nature: "asset",
    civilCodeCode: "SP.A.C.II",
    reclassifiedCode: "RF.AI.III",
    dueBeyond12Months: true
  },
  {
    label: "Merci / rimanenze",
    nature: "asset",
    civilCodeCode: "SP.A.C.I",
    reclassifiedCode: "RF.AC.R"
  },
  {
    label: "Immobilizzazioni immateriali",
    nature: "asset",
    civilCodeCode: "SP.A.B.I",
    reclassifiedCode: "RF.AI.I"
  },
  {
    label: "Immobilizzazioni materiali",
    nature: "asset",
    civilCodeCode: "SP.A.B.II",
    reclassifiedCode: "RF.AI.II"
  },
  {
    label: "Immobilizzazioni finanziarie",
    nature: "asset",
    civilCodeCode: "SP.A.B.III",
    reclassifiedCode: "RF.AI.III"
  },
  {
    label: "Ratei e risconti attivi",
    nature: "asset",
    civilCodeCode: "SP.A.D",
    reclassifiedCode: "RF.AC.LD",
    dueWithin12Months: true
  },
  {
    label: "Capitale sociale",
    nature: "equity",
    civilCodeCode: "SP.P.A.I",
    reclassifiedCode: "RF.CN"
  },
  {
    label: "Riserva legale",
    nature: "equity",
    civilCodeCode: "SP.P.A.IV",
    reclassifiedCode: "RF.CN"
  },
  {
    label: "Altre riserve",
    nature: "equity",
    civilCodeCode: "SP.P.A.VI",
    reclassifiedCode: "RF.CN"
  },
  {
    label: "Utile dell'esercizio",
    nature: "equity",
    civilCodeCode: "SP.P.A.IX",
    reclassifiedCode: "RF.CN"
  },
  {
    label: "Debiti verso fornitori entro 12 mesi",
    nature: "liability",
    civilCodeCode: "SP.P.D",
    reclassifiedCode: "RF.PC",
    dueWithin12Months: true
  },
  {
    label: "Mutui quota entro 12 mesi",
    nature: "liability",
    civilCodeCode: "SP.P.D",
    reclassifiedCode: "RF.PC",
    dueWithin12Months: true
  },
  {
    label: "Mutui quota oltre 12 mesi",
    nature: "liability",
    civilCodeCode: "SP.P.D",
    reclassifiedCode: "RF.PCONS",
    dueBeyond12Months: true
  },
  {
    label: "Fondi rischi e oneri",
    nature: "liability",
    civilCodeCode: "SP.P.B",
    reclassifiedCode: "RF.PCONS"
  },
  {
    label: "Trattamento fine rapporto",
    nature: "liability",
    civilCodeCode: "SP.P.C",
    reclassifiedCode: "RF.PCONS"
  },
  {
    label: "Ratei e risconti passivi",
    nature: "liability",
    civilCodeCode: "SP.P.E",
    reclassifiedCode: "RF.PC",
    dueWithin12Months: true
  },
  {
    label: "Ricavi vendite e prestazioni",
    nature: "revenue",
    civilCodeCode: "CE.A.1",
    reclassifiedCode: "CE.VA.RICAVI"
  },
  {
    label: "Acquisti materie e merci",
    nature: "cost",
    civilCodeCode: "CE.B.6",
    reclassifiedCode: "CE.VA.ESTERNI"
  },
  {
    label: "Servizi",
    nature: "cost",
    civilCodeCode: "CE.B.7",
    reclassifiedCode: "CE.VA.ESTERNI"
  },
  {
    label: "Canoni leasing / godimento beni di terzi",
    nature: "cost",
    civilCodeCode: "CE.B.8",
    reclassifiedCode: "CE.VA.ESTERNI"
  },
  {
    label: "Salari e stipendi",
    nature: "cost",
    civilCodeCode: "CE.B.9",
    reclassifiedCode: "CE.VA.PERSONALE"
  },
  {
    label: "Ammortamenti",
    nature: "cost",
    civilCodeCode: "CE.B.10",
    reclassifiedCode: "CE.VA.AMMORTAMENTI"
  },
  {
    label: "Interessi passivi su mutui o obbligazioni",
    nature: "cost",
    civilCodeCode: "CE.C.17",
    reclassifiedCode: "CE.VA.FINANZIARIA"
  },
  {
    label: "Imposte sul reddito",
    nature: "cost",
    civilCodeCode: "CE.20",
    reclassifiedCode: "CE.VA.IMPOSTE"
  }
];
