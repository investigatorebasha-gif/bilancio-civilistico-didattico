import type { AccountNature } from "../types/accounting";

export type SchemaOption = {
  code: string;
  label: string;
};

export type BalanceSchemaItem = SchemaOption & {
  level: number;
  side: "asset" | "liability";
};

export type IncomeSchemaItem = SchemaOption & {
  level: number;
  nature: "positive" | "negative" | "computed";
};

export type ReclassifiedSchemaItem = SchemaOption & {
  level: number;
  side: "uses" | "sources";
};

export const ordinaryBalanceAssetItems: BalanceSchemaItem[] = [
  {
    code: "SP.A.A",
    label: "A) Crediti verso soci per versamenti ancora dovuti",
    level: 1,
    side: "asset"
  },
  { code: "SP.A.B", label: "B) Immobilizzazioni", level: 1, side: "asset" },
  {
    code: "SP.A.B.I",
    label: "I) Immobilizzazioni immateriali",
    level: 2,
    side: "asset"
  },
  {
    code: "SP.A.B.II",
    label: "II) Immobilizzazioni materiali",
    level: 2,
    side: "asset"
  },
  {
    code: "SP.A.B.III",
    label: "III) Immobilizzazioni finanziarie",
    level: 2,
    side: "asset"
  },
  { code: "SP.A.C", label: "C) Attivo circolante", level: 1, side: "asset" },
  { code: "SP.A.C.I", label: "I) Rimanenze", level: 2, side: "asset" },
  { code: "SP.A.C.II", label: "II) Crediti", level: 2, side: "asset" },
  {
    code: "SP.A.C.III",
    label: "III) Attivita finanziarie che non costituiscono immobilizzazioni",
    level: 2,
    side: "asset"
  },
  { code: "SP.A.C.IV", label: "IV) Disponibilita liquide", level: 2, side: "asset" },
  { code: "SP.A.D", label: "D) Ratei e risconti attivi", level: 1, side: "asset" }
];

export const ordinaryBalanceLiabilityItems: BalanceSchemaItem[] = [
  { code: "SP.P.A", label: "A) Patrimonio netto", level: 1, side: "liability" },
  { code: "SP.P.A.I", label: "I) Capitale", level: 2, side: "liability" },
  {
    code: "SP.P.A.II",
    label: "II) Riserva da soprapprezzo delle azioni",
    level: 2,
    side: "liability"
  },
  {
    code: "SP.P.A.III",
    label: "III) Riserve di rivalutazione",
    level: 2,
    side: "liability"
  },
  { code: "SP.P.A.IV", label: "IV) Riserva legale", level: 2, side: "liability" },
  { code: "SP.P.A.V", label: "V) Riserve statutarie", level: 2, side: "liability" },
  { code: "SP.P.A.VI", label: "VI) Altre riserve", level: 2, side: "liability" },
  {
    code: "SP.P.A.VII",
    label: "VII) Riserva per operazioni di copertura dei flussi finanziari attesi",
    level: 2,
    side: "liability"
  },
  {
    code: "SP.P.A.VIII",
    label: "VIII) Utili/perdite portati a nuovo",
    level: 2,
    side: "liability"
  },
  {
    code: "SP.P.A.IX",
    label: "IX) Utile/perdita dell'esercizio",
    level: 2,
    side: "liability"
  },
  {
    code: "SP.P.A.X",
    label: "X) Riserva negativa per azioni proprie in portafoglio",
    level: 2,
    side: "liability"
  },
  { code: "SP.P.B", label: "B) Fondi per rischi e oneri", level: 1, side: "liability" },
  {
    code: "SP.P.C",
    label: "C) Trattamento di fine rapporto di lavoro subordinato",
    level: 1,
    side: "liability"
  },
  { code: "SP.P.D", label: "D) Debiti", level: 1, side: "liability" },
  { code: "SP.P.E", label: "E) Ratei e risconti passivi", level: 1, side: "liability" }
];

export const ordinaryIncomeItems: IncomeSchemaItem[] = [
  { code: "CE.A", label: "A) Valore della produzione", level: 1, nature: "computed" },
  {
    code: "CE.A.1",
    label: "1) Ricavi delle vendite e delle prestazioni",
    level: 2,
    nature: "positive"
  },
  {
    code: "CE.A.2",
    label: "2) Variazioni rimanenze prodotti in corso, semilavorati e finiti",
    level: 2,
    nature: "positive"
  },
  {
    code: "CE.A.3",
    label: "3) Variazioni lavori in corso su ordinazione",
    level: 2,
    nature: "positive"
  },
  {
    code: "CE.A.4",
    label: "4) Incrementi di immobilizzazioni per lavori interni",
    level: 2,
    nature: "positive"
  },
  {
    code: "CE.A.5",
    label: "5) Altri ricavi e proventi",
    level: 2,
    nature: "positive"
  },
  { code: "CE.B", label: "B) Costi della produzione", level: 1, nature: "computed" },
  {
    code: "CE.B.6",
    label: "6) Per materie prime, sussidiarie, di consumo e merci",
    level: 2,
    nature: "negative"
  },
  { code: "CE.B.7", label: "7) Per servizi", level: 2, nature: "negative" },
  {
    code: "CE.B.8",
    label: "8) Per godimento di beni di terzi",
    level: 2,
    nature: "negative"
  },
  { code: "CE.B.9", label: "9) Per il personale", level: 2, nature: "negative" },
  {
    code: "CE.B.10",
    label: "10) Ammortamenti e svalutazioni",
    level: 2,
    nature: "negative"
  },
  {
    code: "CE.B.11",
    label: "11) Variazioni rimanenze materie prime, sussidiarie, consumo e merci",
    level: 2,
    nature: "negative"
  },
  {
    code: "CE.B.12",
    label: "12) Accantonamenti per rischi",
    level: 2,
    nature: "negative"
  },
  {
    code: "CE.B.13",
    label: "13) Altri accantonamenti",
    level: 2,
    nature: "negative"
  },
  {
    code: "CE.B.14",
    label: "14) Oneri diversi di gestione",
    level: 2,
    nature: "negative"
  },
  {
    code: "CE.C",
    label: "C) Proventi e oneri finanziari",
    level: 1,
    nature: "computed"
  },
  {
    code: "CE.C.15",
    label: "15) Proventi da partecipazioni",
    level: 2,
    nature: "positive"
  },
  {
    code: "CE.C.16",
    label: "16) Altri proventi finanziari",
    level: 2,
    nature: "positive"
  },
  {
    code: "CE.C.17",
    label: "17) Interessi e altri oneri finanziari",
    level: 2,
    nature: "negative"
  },
  {
    code: "CE.C.17-bis",
    label: "17-bis) Utili e perdite su cambi",
    level: 2,
    nature: "positive"
  },
  {
    code: "CE.D",
    label: "D) Rettifiche di valore di attivita e passivita finanziarie",
    level: 1,
    nature: "computed"
  },
  { code: "CE.D.18", label: "18) Rivalutazioni", level: 2, nature: "positive" },
  { code: "CE.D.19", label: "19) Svalutazioni", level: 2, nature: "negative" },
  {
    code: "CE.20",
    label: "20) Imposte sul reddito dell'esercizio",
    level: 1,
    nature: "negative"
  },
  {
    code: "CE.21",
    label: "21) Utile/perdita dell'esercizio",
    level: 1,
    nature: "computed"
  }
];

export const reclassifiedItems: ReclassifiedSchemaItem[] = [
  { code: "RF.AC", label: "A) Attivita correnti", level: 1, side: "uses" },
  { code: "RF.AC.LI", label: "1. Liquidita immediate", level: 2, side: "uses" },
  { code: "RF.AC.LD", label: "2. Liquidita differite", level: 2, side: "uses" },
  { code: "RF.AC.R", label: "3. Rimanenze", level: 2, side: "uses" },
  { code: "RF.AI", label: "B) Attivita immobilizzate", level: 1, side: "uses" },
  { code: "RF.AI.I", label: "1. Immobilizzazioni immateriali", level: 2, side: "uses" },
  { code: "RF.AI.II", label: "2. Immobilizzazioni materiali", level: 2, side: "uses" },
  { code: "RF.AI.III", label: "3. Immobilizzazioni finanziarie", level: 2, side: "uses" },
  { code: "RF.PC", label: "A) Passivita correnti", level: 1, side: "sources" },
  {
    code: "RF.PCONS",
    label: "B) Passivita consolidate",
    level: 1,
    side: "sources"
  },
  { code: "RF.CN", label: "C) Capitale netto", level: 1, side: "sources" }
];

export const civilCodeOptions: SchemaOption[] = [
  ...ordinaryBalanceAssetItems.filter((item) => item.code.split(".").length >= 3),
  ...ordinaryBalanceLiabilityItems.filter((item) => item.code.split(".").length >= 3),
  ...ordinaryIncomeItems.filter((item) => item.nature !== "computed")
].map(({ code, label }) => ({ code, label }));

export const reclassifiedOptions: SchemaOption[] = reclassifiedItems.map(({ code, label }) => ({
  code,
  label
}));

export const accountNatureLabels: Record<AccountNature, string> = {
  asset: "Attivita",
  liability: "Passivita",
  equity: "Patrimonio netto",
  revenue: "Ricavo",
  cost: "Costo"
};
