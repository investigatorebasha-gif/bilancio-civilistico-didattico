import { ordinaryBalanceAssetItems } from "../data/civilisticSchemas";
import type { FiscalYearData, Money, StatementOutput, StatementRow } from "../types/accounting";
import {
  keepStatementRow,
  sumByCivilCode,
  sumByCivilCodes,
  sumByReclassifiedCode
} from "./mappings";

const amountIsRelevant = (amount: Money): boolean => Math.abs(amount) > 0.004;

const row = (
  id: string,
  label: string,
  amount: Money,
  level: number,
  type: StatementRow["type"],
  code?: string,
  notes?: string
): StatementRow => ({ id, label, amount, level, type, code, notes });

const filterRows = (rows: StatementRow[], data: FiscalYearData): StatementRow[] =>
  rows.filter((item) => keepStatementRow(item, data.settings.showZeroRows));

export const generateOrdinaryIncomeStatement = (data: FiscalYearData): StatementOutput => {
  const a1 = sumByCivilCode(data, "CE.A.1");
  const a2 = sumByCivilCode(data, "CE.A.2");
  const a3 = sumByCivilCode(data, "CE.A.3");
  const a4 = sumByCivilCode(data, "CE.A.4");
  const a5 = sumByCivilCode(data, "CE.A.5");
  const valueOfProduction = a1 + a2 + a3 + a4 + a5;

  const b6 = sumByCivilCode(data, "CE.B.6");
  const b7 = sumByCivilCode(data, "CE.B.7");
  const b8 = sumByCivilCode(data, "CE.B.8");
  const b9 = sumByCivilCode(data, "CE.B.9");
  const b10 = sumByCivilCode(data, "CE.B.10");
  const b11 = sumByCivilCode(data, "CE.B.11");
  const b12 = sumByCivilCode(data, "CE.B.12");
  const b13 = sumByCivilCode(data, "CE.B.13");
  const b14 = sumByCivilCode(data, "CE.B.14");
  const productionCosts = b6 + b7 + b8 + b9 + b10 + b11 + b12 + b13 + b14;
  const grossOperatingResult = valueOfProduction - productionCosts;

  const c15 = sumByCivilCode(data, "CE.C.15");
  const c16 = sumByCivilCode(data, "CE.C.16");
  const c17 = sumByCivilCode(data, "CE.C.17");
  const c17bis = sumByCivilCode(data, "CE.C.17-bis");
  const financialResult = c15 + c16 - c17 + c17bis;

  const d18 = sumByCivilCode(data, "CE.D.18");
  const d19 = sumByCivilCode(data, "CE.D.19");
  const financialAdjustments = d18 - d19;

  const preTaxResult = grossOperatingResult + financialResult + financialAdjustments;
  const taxes = sumByCivilCode(data, "CE.20");
  const netIncome = preTaxResult - taxes;

  const rows = filterRows(
    [
      row("ce-a", "A) Valore della produzione", valueOfProduction, 0, "section", "CE.A"),
      row("ce-a1", "1) Ricavi delle vendite e delle prestazioni", a1, 1, "line", "CE.A.1"),
      row(
        "ce-a2",
        "2) Variazioni rimanenze prodotti in corso, semilavorati e finiti",
        a2,
        1,
        "line",
        "CE.A.2"
      ),
      row("ce-a3", "3) Variazioni lavori in corso su ordinazione", a3, 1, "line", "CE.A.3"),
      row("ce-a4", "4) Incrementi di immobilizzazioni per lavori interni", a4, 1, "line", "CE.A.4"),
      row("ce-a5", "5) Altri ricavi e proventi", a5, 1, "line", "CE.A.5"),
      row("ce-b", "B) Costi della produzione", productionCosts, 0, "section", "CE.B"),
      row("ce-b6", "6) Per materie prime, sussidiarie, consumo e merci", b6, 1, "line", "CE.B.6"),
      row("ce-b7", "7) Per servizi", b7, 1, "line", "CE.B.7"),
      row("ce-b8", "8) Per godimento di beni di terzi", b8, 1, "line", "CE.B.8"),
      row("ce-b9", "9) Per il personale", b9, 1, "line", "CE.B.9"),
      row("ce-b10", "10) Ammortamenti e svalutazioni", b10, 1, "line", "CE.B.10"),
      row("ce-b11", "11) Variazioni rimanenze materie prime e merci", b11, 1, "line", "CE.B.11"),
      row("ce-b12", "12) Accantonamenti per rischi", b12, 1, "line", "CE.B.12"),
      row("ce-b13", "13) Altri accantonamenti", b13, 1, "line", "CE.B.13"),
      row("ce-b14", "14) Oneri diversi di gestione", b14, 1, "line", "CE.B.14"),
      row(
        "ce-ab",
        "Differenza tra valore e costi della produzione (A - B)",
        grossOperatingResult,
        0,
        "calculation"
      ),
      row("ce-c", "C) Proventi e oneri finanziari", financialResult, 0, "section", "CE.C"),
      row("ce-c15", "15) Proventi da partecipazioni", c15, 1, "line", "CE.C.15"),
      row("ce-c16", "16) Altri proventi finanziari", c16, 1, "line", "CE.C.16"),
      row("ce-c17", "17) Interessi e altri oneri finanziari", c17, 1, "line", "CE.C.17"),
      row("ce-c17bis", "17-bis) Utili e perdite su cambi", c17bis, 1, "line", "CE.C.17-bis"),
      row(
        "ce-d",
        "D) Rettifiche di valore di attivita e passivita finanziarie",
        financialAdjustments,
        0,
        "section",
        "CE.D"
      ),
      row("ce-d18", "18) Rivalutazioni", d18, 1, "line", "CE.D.18"),
      row("ce-d19", "19) Svalutazioni", d19, 1, "line", "CE.D.19"),
      row("ce-pre-tax", "Risultato prima delle imposte", preTaxResult, 0, "subtotal"),
      row("ce-20", "20) Imposte sul reddito dell'esercizio", taxes, 0, "line", "CE.20"),
      row("ce-21", "21) Utile/perdita dell'esercizio", netIncome, 0, "total", "CE.21")
    ],
    data
  );

  return {
    id: "ordinary-income-statement",
    title: "Conto economico civilistico in forma ordinaria",
    rows,
    totals: {
      valueOfProduction,
      productionCosts,
      grossOperatingResult,
      financialResult,
      financialAdjustments,
      preTaxResult,
      taxes,
      netIncome
    }
  };
};

export const generateOrdinaryBalanceSheet = (data: FiscalYearData): StatementOutput => {
  const assetA = sumByCivilCode(data, "SP.A.A", ["asset"]);
  const assetBI = sumByCivilCode(data, "SP.A.B.I", ["asset"]);
  const assetBII = sumByCivilCode(data, "SP.A.B.II", ["asset"]);
  const assetBIII = sumByCivilCode(data, "SP.A.B.III", ["asset"]);
  const assetB = assetBI + assetBII + assetBIII;
  const assetCI = sumByCivilCode(data, "SP.A.C.I", ["asset"]);
  const assetCII = sumByCivilCode(data, "SP.A.C.II", ["asset"]);
  const assetCIII = sumByCivilCode(data, "SP.A.C.III", ["asset"]);
  const assetCIV = sumByCivilCode(data, "SP.A.C.IV", ["asset"]);
  const assetC = assetCI + assetCII + assetCIII + assetCIV;
  const assetD = sumByCivilCode(data, "SP.A.D", ["asset"]);
  const totalAssets = assetA + assetB + assetC + assetD;

  const equityI = sumByCivilCode(data, "SP.P.A.I", ["equity"]);
  const equityII = sumByCivilCode(data, "SP.P.A.II", ["equity"]);
  const equityIII = sumByCivilCode(data, "SP.P.A.III", ["equity"]);
  const equityIV = sumByCivilCode(data, "SP.P.A.IV", ["equity"]);
  const equityV = sumByCivilCode(data, "SP.P.A.V", ["equity"]);
  const equityVI = sumByCivilCode(data, "SP.P.A.VI", ["equity"]);
  const equityVII = sumByCivilCode(data, "SP.P.A.VII", ["equity"]);
  const equityVIII = sumByCivilCode(data, "SP.P.A.VIII", ["equity"]);
  const equityIX = sumByCivilCode(data, "SP.P.A.IX", ["equity"]);
  const equityX = sumByCivilCode(data, "SP.P.A.X", ["equity"]);
  const equity =
    equityI +
    equityII +
    equityIII +
    equityIV +
    equityV +
    equityVI +
    equityVII +
    equityVIII +
    equityIX +
    equityX;
  const funds = sumByCivilCode(data, "SP.P.B", ["liability"]);
  const tfr = sumByCivilCode(data, "SP.P.C", ["liability"]);
  const debts = sumByCivilCode(data, "SP.P.D", ["liability"]);
  const accruals = sumByCivilCode(data, "SP.P.E", ["liability"]);
  const totalLiabilities = equity + funds + tfr + debts + accruals;

  const incomeStatement = generateOrdinaryIncomeStatement(data);
  const profitFromIncomeStatement = incomeStatement.totals.netIncome ?? 0;
  const profitDifference = equityIX - profitFromIncomeStatement;
  const balanceDifference = totalAssets - totalLiabilities;

  const assetRows = [
    row("sp-attivo", "ATTIVO", totalAssets, 0, "heading"),
    row("sp-aa", ordinaryBalanceAssetItems[0].label, assetA, 1, "line", "SP.A.A"),
    row("sp-ab", "B) Immobilizzazioni", assetB, 1, "section", "SP.A.B"),
    row("sp-abi", "I) Immobilizzazioni immateriali", assetBI, 2, "line", "SP.A.B.I"),
    row("sp-abii", "II) Immobilizzazioni materiali", assetBII, 2, "line", "SP.A.B.II"),
    row("sp-abiii", "III) Immobilizzazioni finanziarie", assetBIII, 2, "line", "SP.A.B.III"),
    row("sp-ac", "C) Attivo circolante", assetC, 1, "section", "SP.A.C"),
    row("sp-aci", "I) Rimanenze", assetCI, 2, "line", "SP.A.C.I"),
    row("sp-acii", "II) Crediti", assetCII, 2, "line", "SP.A.C.II", dueNote(data, "SP.A.C.II")),
    row("sp-aciii", "III) Attivita finanziarie non immobilizzate", assetCIII, 2, "line", "SP.A.C.III"),
    row("sp-aciv", "IV) Disponibilita liquide", assetCIV, 2, "line", "SP.A.C.IV"),
    row("sp-ad", "D) Ratei e risconti attivi", assetD, 1, "line", "SP.A.D"),
    row("sp-total-assets", "Totale attivo", totalAssets, 0, "total")
  ];

  const liabilityRows = [
    row("sp-passivo", "PASSIVO", totalLiabilities, 0, "heading"),
    row("sp-pa", "A) Patrimonio netto", equity, 1, "section", "SP.P.A"),
    row("sp-pai", "I) Capitale", equityI, 2, "line", "SP.P.A.I"),
    row("sp-paii", "II) Riserva da soprapprezzo delle azioni", equityII, 2, "line", "SP.P.A.II"),
    row("sp-paiii", "III) Riserve di rivalutazione", equityIII, 2, "line", "SP.P.A.III"),
    row("sp-paiv", "IV) Riserva legale", equityIV, 2, "line", "SP.P.A.IV"),
    row("sp-pav", "V) Riserve statutarie", equityV, 2, "line", "SP.P.A.V"),
    row("sp-pavi", "VI) Altre riserve", equityVI, 2, "line", "SP.P.A.VI"),
    row(
      "sp-pavii",
      "VII) Riserva per operazioni di copertura dei flussi finanziari attesi",
      equityVII,
      2,
      "line",
      "SP.P.A.VII"
    ),
    row("sp-paviii", "VIII) Utili/perdite portati a nuovo", equityVIII, 2, "line", "SP.P.A.VIII"),
    row("sp-paix", "IX) Utile/perdita dell'esercizio", equityIX, 2, "line", "SP.P.A.IX"),
    row(
      "sp-pax",
      "X) Riserva negativa per azioni proprie in portafoglio",
      equityX,
      2,
      "line",
      "SP.P.A.X"
    ),
    row("sp-pb", "B) Fondi per rischi e oneri", funds, 1, "line", "SP.P.B"),
    row("sp-pc", "C) Trattamento di fine rapporto", tfr, 1, "line", "SP.P.C"),
    row("sp-pd", "D) Debiti", debts, 1, "line", "SP.P.D", dueNote(data, "SP.P.D")),
    row("sp-pe", "E) Ratei e risconti passivi", accruals, 1, "line", "SP.P.E"),
    row("sp-total-liabilities", "Totale passivo", totalLiabilities, 0, "total")
  ];

  return {
    id: "ordinary-balance-sheet",
    title: "Stato patrimoniale civilistico in forma ordinaria",
    rows: filterRows([...assetRows, ...liabilityRows], data),
    totals: {
      totalAssets,
      totalLiabilities,
      balanceDifference,
      profitFromIncomeStatement,
      profitInEquity: equityIX,
      profitDifference
    },
    warnings: amountIsRelevant(profitDifference)
      ? [`Utile CE e utile nel patrimonio netto differiscono di ${profitDifference}.`]
      : []
  };
};

export const generateAbbreviatedBalanceSheet = (data: FiscalYearData): StatementOutput => {
  const assetA = sumByCivilCode(data, "SP.A.A", ["asset"]);
  const assetBI = sumByCivilCode(data, "SP.A.B.I", ["asset"]);
  const assetBII = sumByCivilCode(data, "SP.A.B.II", ["asset"]);
  const assetBIII = sumByCivilCode(data, "SP.A.B.III", ["asset"]);
  const assetCI = sumByCivilCode(data, "SP.A.C.I", ["asset"]);
  const baseAssetCII = sumByCivilCode(data, "SP.A.C.II", ["asset"]);
  const assetCIII = sumByCivilCode(data, "SP.A.C.III", ["asset"]);
  const assetCIV = sumByCivilCode(data, "SP.A.C.IV", ["asset"]);
  const assetD = sumByCivilCode(data, "SP.A.D", ["asset"]);
  const includeAssetAD = data.settings.abbreviatedAssetPresentation === "includeInReceivables";
  const assetCII = baseAssetCII + (includeAssetAD ? assetA + assetD : 0);
  const assetB = assetBI + assetBII + assetBIII;
  const assetC = assetCI + assetCII + assetCIII + assetCIV;
  const totalAssets = (includeAssetAD ? 0 : assetA + assetD) + assetB + assetC;

  const equity = sumByCivilCodes(
    data,
    [
      "SP.P.A.I",
      "SP.P.A.II",
      "SP.P.A.III",
      "SP.P.A.IV",
      "SP.P.A.V",
      "SP.P.A.VI",
      "SP.P.A.VII",
      "SP.P.A.VIII",
      "SP.P.A.IX",
      "SP.P.A.X"
    ],
    ["equity"]
  );
  const funds = sumByCivilCode(data, "SP.P.B", ["liability"]);
  const tfr = sumByCivilCode(data, "SP.P.C", ["liability"]);
  const baseDebts = sumByCivilCode(data, "SP.P.D", ["liability"]);
  const accruals = sumByCivilCode(data, "SP.P.E", ["liability"]);
  const includePassiveE = data.settings.abbreviatedLiabilityPresentation === "includeInDebts";
  const debts = baseDebts + (includePassiveE ? accruals : 0);
  const totalLiabilities = equity + funds + tfr + debts + (includePassiveE ? 0 : accruals);

  const rows = filterRows(
    [
      row("absp-assets", "ATTIVO", totalAssets, 0, "heading"),
      ...(includeAssetAD
        ? []
        : [row("absp-a", "A) Crediti verso soci per versamenti dovuti", assetA, 1, "line", "SP.A.A")]),
      row("absp-b", "B) Immobilizzazioni", assetB, 1, "section", "SP.A.B"),
      row("absp-bi", "I) Immobilizzazioni immateriali", assetBI, 2, "line", "SP.A.B.I"),
      row("absp-bii", "II) Immobilizzazioni materiali", assetBII, 2, "line", "SP.A.B.II"),
      row("absp-biii", "III) Immobilizzazioni finanziarie", assetBIII, 2, "line", "SP.A.B.III"),
      row("absp-c", "C) Attivo circolante", assetC, 1, "section", "SP.A.C"),
      row("absp-ci", "I) Rimanenze", assetCI, 2, "line", "SP.A.C.I"),
      row(
        "absp-cii",
        includeAssetAD ? "II) Crediti, inclusi A e D dell'attivo" : "II) Crediti",
        assetCII,
        2,
        "line",
        "SP.A.C.II",
        dueNote(data, "SP.A.C.II")
      ),
      row("absp-ciii", "III) Attivita finanziarie non immobilizzate", assetCIII, 2, "line", "SP.A.C.III"),
      row("absp-civ", "IV) Disponibilita liquide", assetCIV, 2, "line", "SP.A.C.IV"),
      ...(includeAssetAD ? [] : [row("absp-d", "D) Ratei e risconti attivi", assetD, 1, "line", "SP.A.D")]),
      row("absp-total-assets", "Totale attivo", totalAssets, 0, "total"),
      row("absp-liabilities", "PASSIVO", totalLiabilities, 0, "heading"),
      row("absp-pa", "A) Patrimonio netto", equity, 1, "line", "SP.P.A"),
      row("absp-pb", "B) Fondi per rischi e oneri", funds, 1, "line", "SP.P.B"),
      row("absp-pc", "C) Trattamento di fine rapporto", tfr, 1, "line", "SP.P.C"),
      row(
        "absp-pd",
        includePassiveE ? "D) Debiti, inclusi ratei e risconti passivi" : "D) Debiti",
        debts,
        1,
        "line",
        "SP.P.D",
        dueNote(data, "SP.P.D")
      ),
      ...(includePassiveE ? [] : [row("absp-pe", "E) Ratei e risconti passivi", accruals, 1, "line", "SP.P.E")]),
      row("absp-total-liabilities", "Totale passivo", totalLiabilities, 0, "total")
    ],
    data
  );

  return {
    id: "abbreviated-balance-sheet",
    title: "Stato patrimoniale in forma abbreviata",
    subtitle: "Macro-voci e numeri romani, con evidenza delle scadenze quando disponibili.",
    rows,
    totals: {
      totalAssets,
      totalLiabilities,
      balanceDifference: totalAssets - totalLiabilities
    }
  };
};

export const generateAbbreviatedIncomeStatement = (data: FiscalYearData): StatementOutput => {
  const a1 = sumByCivilCode(data, "CE.A.1");
  const a2a3 = sumByCivilCode(data, "CE.A.2") + sumByCivilCode(data, "CE.A.3");
  const a4 = sumByCivilCode(data, "CE.A.4");
  const a5 = sumByCivilCode(data, "CE.A.5");
  const valueOfProduction = a1 + a2a3 + a4 + a5;

  const b6 = sumByCivilCode(data, "CE.B.6");
  const b7 = sumByCivilCode(data, "CE.B.7");
  const b8 = sumByCivilCode(data, "CE.B.8");
  const b9 = sumByCivilCode(data, "CE.B.9");
  const b10 = sumByCivilCode(data, "CE.B.10");
  const b11 = sumByCivilCode(data, "CE.B.11");
  const b12 = sumByCivilCode(data, "CE.B.12");
  const b13 = sumByCivilCode(data, "CE.B.13");
  const b14 = sumByCivilCode(data, "CE.B.14");
  const productionCosts = b6 + b7 + b8 + b9 + b10 + b11 + b12 + b13 + b14;
  const grossOperatingResult = valueOfProduction - productionCosts;

  const c15 = sumByCivilCode(data, "CE.C.15");
  const c16 = sumByCivilCode(data, "CE.C.16");
  const c17 = sumByCivilCode(data, "CE.C.17");
  const c17bis = sumByCivilCode(data, "CE.C.17-bis");
  const financialResult = c15 + c16 - c17 + c17bis;

  const d18 = sumByCivilCode(data, "CE.D.18");
  const d19 = sumByCivilCode(data, "CE.D.19");
  const financialAdjustments = d18 - d19;
  const preTaxResult = grossOperatingResult + financialResult + financialAdjustments;
  const taxes = sumByCivilCode(data, "CE.20");
  const netIncome = preTaxResult - taxes;

  return {
    id: "abbreviated-income-statement",
    title: "Conto economico in forma abbreviata",
    subtitle: "Raggruppamenti consentiti, con risultati intermedi mantenuti.",
    rows: filterRows(
      [
        row("abce-a", "A) Valore della produzione", valueOfProduction, 0, "section", "CE.A"),
        row("abce-a1", "1) Ricavi vendite e prestazioni", a1, 1, "line", "CE.A.1"),
        row("abce-a23", "2) + 3) Variazioni rimanenze e lavori in corso", a2a3, 1, "line"),
        row("abce-a4", "4) Incrementi immobilizzazioni per lavori interni", a4, 1, "line", "CE.A.4"),
        row("abce-a5", "5) Altri ricavi e proventi", a5, 1, "line", "CE.A.5"),
        row("abce-b", "B) Costi della produzione", productionCosts, 0, "section", "CE.B"),
        row("abce-b6", "6) Materie prime, sussidiarie, consumo e merci", b6, 1, "line", "CE.B.6"),
        row("abce-b7", "7) Servizi", b7, 1, "line", "CE.B.7"),
        row("abce-b8", "8) Godimento beni di terzi", b8, 1, "line", "CE.B.8"),
        row("abce-b9", "9c) + 9d) + 9e) Personale", b9, 1, "line", "CE.B.9"),
        row("abce-b10", "10a) + 10b) + 10c) Ammortamenti e svalutazioni", b10, 1, "line", "CE.B.10"),
        row("abce-b11", "11) Variazione rimanenze materie prime e merci", b11, 1, "line", "CE.B.11"),
        row("abce-b12", "12) Accantonamenti per rischi", b12, 1, "line", "CE.B.12"),
        row("abce-b13", "13) Altri accantonamenti", b13, 1, "line", "CE.B.13"),
        row("abce-b14", "14) Oneri diversi di gestione", b14, 1, "line", "CE.B.14"),
        row("abce-ab", "Differenza tra valore e costi della produzione (A - B)", grossOperatingResult, 0, "calculation"),
        row("abce-c", "C) Proventi e oneri finanziari", financialResult, 0, "section", "CE.C"),
        row("abce-c15", "15) Proventi da partecipazioni", c15, 1, "line", "CE.C.15"),
        row("abce-c16", "16b) + 16c) Altri proventi finanziari", c16, 1, "line", "CE.C.16"),
        row("abce-c17", "17) Interessi e altri oneri finanziari", c17, 1, "line", "CE.C.17"),
        row("abce-c17bis", "17-bis) Utili e perdite su cambi", c17bis, 1, "line", "CE.C.17-bis"),
        row("abce-d", "D) Rettifiche di valore", financialAdjustments, 0, "section", "CE.D"),
        row("abce-d18", "18a) + 18b) + 18c) + 18d) Rivalutazioni", d18, 1, "line", "CE.D.18"),
        row("abce-d19", "19a) + 19b) + 19c) + 19d) Svalutazioni", d19, 1, "line", "CE.D.19"),
        row("abce-pre-tax", "Risultato prima delle imposte", preTaxResult, 0, "subtotal"),
        row("abce-20", "20) Imposte sul reddito", taxes, 0, "line", "CE.20"),
        row("abce-21", "21) Utile/perdita dell'esercizio", netIncome, 0, "total", "CE.21")
      ],
      data
    ),
    totals: {
      valueOfProduction,
      productionCosts,
      grossOperatingResult,
      financialResult,
      financialAdjustments,
      preTaxResult,
      taxes,
      netIncome
    }
  };
};

export const generateFinancialReclassifiedBalanceSheet = (
  data: FiscalYearData
): StatementOutput => {
  const immediateLiquidity = sumByReclassifiedCode(data, "RF.AC.LI", ["asset"]);
  const deferredLiquidity = sumByReclassifiedCode(data, "RF.AC.LD", ["asset"]);
  const inventory = sumByReclassifiedCode(data, "RF.AC.R", ["asset"]);
  const currentAssets = immediateLiquidity + deferredLiquidity + inventory;
  const intangibleFixedAssets = sumByReclassifiedCode(data, "RF.AI.I", ["asset"]);
  const tangibleFixedAssets = sumByReclassifiedCode(data, "RF.AI.II", ["asset"]);
  const financialFixedAssets = sumByReclassifiedCode(data, "RF.AI.III", ["asset"]);
  const fixedAssets = intangibleFixedAssets + tangibleFixedAssets + financialFixedAssets;
  const totalUses = currentAssets + fixedAssets;

  const currentLiabilities = sumByReclassifiedCode(data, "RF.PC", ["liability"]);
  const consolidatedLiabilities = sumByReclassifiedCode(data, "RF.PCONS", ["liability"]);
  const netCapital = sumByReclassifiedCode(data, "RF.CN", ["equity"]);
  const totalSources = currentLiabilities + consolidatedLiabilities + netCapital;

  return {
    id: "financial-reclassified-balance-sheet",
    title: "Stato patrimoniale riclassificato secondo il criterio finanziario",
    rows: filterRows(
      [
        row("rf-uses", "IMPIEGHI", totalUses, 0, "heading"),
        row("rf-ac", "A) Attivita correnti", currentAssets, 1, "section", "RF.AC"),
        row("rf-ac-li", "1. Liquidita immediate", immediateLiquidity, 2, "line", "RF.AC.LI"),
        row("rf-ac-ld", "2. Liquidita differite", deferredLiquidity, 2, "line", "RF.AC.LD"),
        row("rf-ac-r", "3. Rimanenze", inventory, 2, "line", "RF.AC.R"),
        row("rf-ai", "B) Attivita immobilizzate", fixedAssets, 1, "section", "RF.AI"),
        row("rf-ai-i", "1. Immobilizzazioni immateriali", intangibleFixedAssets, 2, "line", "RF.AI.I"),
        row("rf-ai-ii", "2. Immobilizzazioni materiali", tangibleFixedAssets, 2, "line", "RF.AI.II"),
        row("rf-ai-iii", "3. Immobilizzazioni finanziarie", financialFixedAssets, 2, "line", "RF.AI.III"),
        row("rf-total-uses", "Totale impieghi", totalUses, 0, "total"),
        row("rf-sources", "FONTI", totalSources, 0, "heading"),
        row("rf-pc", "A) Passivita correnti", currentLiabilities, 1, "line", "RF.PC"),
        row("rf-pcons", "B) Passivita consolidate", consolidatedLiabilities, 1, "line", "RF.PCONS"),
        row("rf-cn", "C) Capitale netto", netCapital, 1, "line", "RF.CN"),
        row("rf-total-sources", "Totale fonti", totalSources, 0, "total")
      ],
      data
    ),
    totals: {
      totalUses,
      totalSources,
      balanceDifference: totalUses - totalSources
    }
  };
};

export const generateValueAddedIncomeStatement = (data: FiscalYearData): StatementOutput => {
  const netSalesRevenue = sumByCivilCode(data, "CE.A.1");
  const productInventoryChange =
    sumByCivilCode(data, "CE.A.2") + sumByCivilCode(data, "CE.A.3");
  const internalWork = sumByCivilCode(data, "CE.A.4");
  const otherRevenue = sumByCivilCode(data, "CE.A.5");
  const productionValue = netSalesRevenue + productInventoryChange + internalWork + otherRevenue;

  const externalCosts =
    sumByCivilCode(data, "CE.B.6") +
    sumByCivilCode(data, "CE.B.7") +
    sumByCivilCode(data, "CE.B.8") +
    sumByCivilCode(data, "CE.B.11") +
    sumByCivilCode(data, "CE.B.14");
  const valueAdded = productionValue - externalCosts;
  const personnelCosts = sumByCivilCode(data, "CE.B.9");
  const ebitda = valueAdded - personnelCosts;
  const depreciationAndImpairments = sumByCivilCode(data, "CE.B.10");
  const provisions = sumByCivilCode(data, "CE.B.12") + sumByCivilCode(data, "CE.B.13");
  const operatingIncome = ebitda - depreciationAndImpairments - provisions;

  const financialManagement =
    sumByCivilCode(data, "CE.C.15") +
    sumByCivilCode(data, "CE.C.16") -
    sumByCivilCode(data, "CE.C.17") +
    sumByCivilCode(data, "CE.C.17-bis") +
    sumByCivilCode(data, "CE.D.18") -
    sumByCivilCode(data, "CE.D.19");
  const preTaxResult = operatingIncome + financialManagement;
  const taxes = sumByCivilCode(data, "CE.20");
  const netIncome = preTaxResult - taxes;

  return {
    id: "value-added-income-statement",
    title: "Conto economico riclassificato a valore aggiunto",
    rows: filterRows(
      [
        row("va-revenue", "Ricavi netti di vendita", netSalesRevenue, 0, "line", "CE.A.1"),
        row("va-inventory", "+/- Variazione rimanenze prodotti e lavori in corso", productInventoryChange, 0, "line"),
        row("va-internal", "+ Incrementi immobilizzazioni per lavori interni", internalWork, 0, "line", "CE.A.4"),
        row("va-other", "+ Altri ricavi e proventi", otherRevenue, 0, "line", "CE.A.5"),
        row("va-production", "= Produzione ottenuta / valore della produzione", productionValue, 0, "subtotal"),
        row("va-external", "- Costi esterni", externalCosts, 0, "line"),
        row("va-value-added", "= Valore aggiunto", valueAdded, 0, "subtotal"),
        row("va-personnel", "- Costi per il personale", personnelCosts, 0, "line", "CE.B.9"),
        row("va-ebitda", "= MOL / EBITDA", ebitda, 0, "subtotal"),
        row("va-dep", "- Ammortamenti e svalutazioni", depreciationAndImpairments, 0, "line", "CE.B.10"),
        row("va-provisions", "- Accantonamenti", provisions, 0, "line"),
        row("va-operating", "= Reddito operativo", operatingIncome, 0, "subtotal"),
        row("va-financial", "+/- Gestione finanziaria e rettifiche", financialManagement, 0, "line"),
        row("va-pre-tax", "= Risultato ante imposte", preTaxResult, 0, "subtotal"),
        row("va-taxes", "- Imposte", taxes, 0, "line", "CE.20"),
        row("va-net", "= Utile/perdita d'esercizio", netIncome, 0, "total", "CE.21")
      ],
      data
    ),
    totals: {
      productionValue,
      externalCosts,
      valueAdded,
      personnelCosts,
      ebitda,
      depreciationAndImpairments,
      provisions,
      operatingIncome,
      financialManagement,
      preTaxResult,
      taxes,
      netIncome
    }
  };
};

const dueNote = (data: FiscalYearData, requestedCode: string): string | undefined => {
  const accounts = data.accounts.filter((account) => account.civilCodeCode === requestedCode);
  const within = accounts
    .filter((account) => account.dueWithin12Months)
    .reduce((total, account) => total + account.amount, 0);
  const beyond = accounts
    .filter((account) => account.dueBeyond12Months)
    .reduce((total, account) => total + account.amount, 0);

  if (!amountIsRelevant(within) && !amountIsRelevant(beyond)) {
    return undefined;
  }

  return `Entro 12 mesi: ${within}; oltre 12 mesi: ${beyond}.`;
};
