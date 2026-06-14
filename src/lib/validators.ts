import type {
  AbbreviatedEligibilityResult,
  FiscalYearData,
  PreviousYearThresholdData,
  ThresholdData,
  ValidationIssue
} from "../types/accounting";
import {
  generateFinancialReclassifiedBalanceSheet,
  generateOrdinaryBalanceSheet,
  generateOrdinaryIncomeStatement
} from "./calculations";
import {
  accountNeedsDueInformation,
  findUnmappedAccounts,
  hasDueInformation
} from "./mappings";

const EPSILON = 0.01;

type Limit = {
  key: keyof ThresholdData;
  label: string;
  threshold: number;
};

const abbreviatedLimits: Limit[] = [
  { key: "totalAssets", label: "totale attivo", threshold: 5500000 },
  { key: "salesRevenue", label: "ricavi vendite e prestazioni", threshold: 11000000 },
  { key: "averageEmployees", label: "dipendenti medi", threshold: 50 }
];

const missingThresholds = (thresholds: ThresholdData | PreviousYearThresholdData | undefined) =>
  !thresholds ||
  thresholds.totalAssets === undefined ||
  thresholds.salesRevenue === undefined ||
  thresholds.averageEmployees === undefined;

const exceededLimits = (thresholds: ThresholdData | PreviousYearThresholdData): string[] =>
  abbreviatedLimits
    .filter((limit) => Number(thresholds[limit.key] ?? 0) > limit.threshold)
    .map((limit) => limit.label);

export const checkAbbreviatedEligibility = (
  data: FiscalYearData
): AbbreviatedEligibilityResult => {
  if (data.isListed) {
    return {
      status: "not_eligible",
      message: "Forma abbreviata non ammessa: la societa risulta quotata.",
      currentExceededLimits: [],
      previousExceededLimits: []
    };
  }

  if (missingThresholds(data.thresholds)) {
    return {
      status: "unknown",
      message:
        "Requisiti non verificabili: inserire attivo, ricavi e dipendenti medi.",
      currentExceededLimits: [],
      previousExceededLimits: []
    };
  }

  const currentExceededLimits = exceededLimits(data.thresholds);
  const currentEligible = currentExceededLimits.length <= 1;

  if (!data.previousYear) {
    return {
      status: currentEligible ? "eligible" : "not_eligible",
      message: currentEligible
        ? "Forma abbreviata ammessa nel primo esercizio: non supera due dei tre limiti."
        : "Forma abbreviata non ammessa: supera almeno due dei tre limiti.",
      currentExceededLimits,
      previousExceededLimits: []
    };
  }

  if (missingThresholds(data.previousYear)) {
    return {
      status: "unknown",
      message:
        "Requisiti non verificabili: completare anche attivo, ricavi e dipendenti medi dell'esercizio precedente.",
      currentExceededLimits,
      previousExceededLimits: []
    };
  }

  const previousExceededLimits = exceededLimits(data.previousYear);
  const previousEligible = previousExceededLimits.length <= 1;

  return {
    status: currentEligible && previousEligible ? "eligible" : "not_eligible",
    message:
      currentEligible && previousEligible
        ? "Forma abbreviata ammessa: i limiti risultano rispettati per due esercizi consecutivi."
        : "Forma abbreviata non ammessa: almeno un esercizio supera due o tre limiti.",
    currentExceededLimits,
    previousExceededLimits
  };
};

export const validateBalanceSheet = (data: FiscalYearData): ValidationIssue[] => {
  const ordinary = generateOrdinaryBalanceSheet(data);
  const reclassified = generateFinancialReclassifiedBalanceSheet(data);
  const eligibility = checkAbbreviatedEligibility(data);
  const unmapped = findUnmappedAccounts(data);
  const missingDueInfo = data.accounts.filter(
    (account) => accountNeedsDueInformation(account) && !hasDueInformation(account)
  );
  const negativeBalanceAccounts = data.accounts.filter(
    (account) =>
      ["asset", "liability", "equity"].includes(account.nature) && account.amount < 0
  );

  const issues: ValidationIssue[] = [
    {
      id: "ordinary-balance",
      label: "Totale attivo / totale passivo",
      message:
        Math.abs(ordinary.totals.balanceDifference ?? 0) <= EPSILON
          ? "Il bilancio ordinario quadra."
          : "Il bilancio ordinario non quadra: controllare attivo, passivo e patrimonio netto.",
      severity:
        Math.abs(ordinary.totals.balanceDifference ?? 0) <= EPSILON ? "success" : "error",
      amount: ordinary.totals.balanceDifference
    },
    {
      id: "profit-match",
      label: "Utile CE / patrimonio netto",
      message:
        Math.abs(ordinary.totals.profitDifference ?? 0) <= EPSILON
          ? "L'utile del conto economico coincide con l'utile nel patrimonio netto."
          : "L'utile del conto economico non coincide con la voce IX del patrimonio netto.",
      severity:
        Math.abs(ordinary.totals.profitDifference ?? 0) <= EPSILON ? "success" : "error",
      amount: ordinary.totals.profitDifference
    },
    {
      id: "reclassified-balance",
      label: "Impieghi / fonti",
      message:
        Math.abs(reclassified.totals.balanceDifference ?? 0) <= EPSILON
          ? "Il riclassificato finanziario quadra."
          : "Il riclassificato finanziario non quadra: verificare le mappature.",
      severity:
        Math.abs(reclassified.totals.balanceDifference ?? 0) <= EPSILON ? "success" : "error",
      amount: reclassified.totals.balanceDifference
    },
    {
      id: "abbreviated-eligibility",
      label: "Requisiti bilancio abbreviato",
      message: eligibility.message,
      severity:
        eligibility.status === "eligible"
          ? "success"
          : eligibility.status === "unknown"
            ? "warning"
            : "error"
    }
  ];

  if (unmapped.length > 0) {
    issues.push({
      id: "unmapped-accounts",
      label: "Voci non mappate",
      message: `${unmapped.length} voce/i senza voce civilistica o riclassificata.`,
      severity: "warning"
    });
  } else {
    issues.push({
      id: "unmapped-accounts",
      label: "Voci non mappate",
      message: "Tutte le voci hanno una mappatura.",
      severity: "success"
    });
  }

  if (missingDueInfo.length > 0) {
    issues.push({
      id: "missing-due",
      label: "Scadenza crediti/debiti",
      message: `${missingDueInfo.length} credito/debito senza indicazione entro/oltre 12 mesi.`,
      severity: "warning"
    });
  } else {
    issues.push({
      id: "missing-due",
      label: "Scadenza crediti/debiti",
      message: "Crediti e debiti principali hanno una scadenza indicata.",
      severity: "success"
    });
  }

  if (negativeBalanceAccounts.length > 0) {
    issues.push({
      id: "negative-balance-values",
      label: "Valori negativi sospetti",
      message: `${negativeBalanceAccounts.length} voce/i patrimoniali hanno importo negativo.`,
      severity: "warning"
    });
  }

  return issues;
};

export const validateIncomeStatement = (data: FiscalYearData): ValidationIssue[] => {
  const incomeStatement = generateOrdinaryIncomeStatement(data);
  const suspiciousCosts = data.accounts.filter(
    (account) =>
      account.nature === "cost" &&
      account.amount < 0 &&
      account.civilCodeCode !== "CE.C.17-bis"
  );
  const suspiciousRevenue = data.accounts.filter(
    (account) =>
      account.nature === "revenue" &&
      account.amount < 0 &&
      !["CE.A.2", "CE.A.3", "CE.C.17-bis"].includes(account.civilCodeCode ?? "")
  );
  const taxes = incomeStatement.totals.taxes ?? 0;
  const issues: ValidationIssue[] = [
    {
      id: "gross-result",
      label: "Differenza A - B",
      message: `A - B calcolato: ${incomeStatement.totals.grossOperatingResult}.`,
      severity: "success",
      amount: incomeStatement.totals.grossOperatingResult
    },
    {
      id: "net-income",
      label: "Utile/perdita CE",
      message: `Risultato ante imposte: ${incomeStatement.totals.preTaxResult}; utile netto: ${incomeStatement.totals.netIncome}.`,
      severity: "success",
      amount: incomeStatement.totals.netIncome
    }
  ];

  if (taxes === 0) {
    issues.push({
      id: "missing-taxes",
      label: "Imposte",
      message: "Nessuna imposta inserita: va bene solo se l'esercizio didattico lo prevede.",
      severity: "warning"
    });
  }

  if (suspiciousCosts.length > 0) {
    issues.push({
      id: "negative-costs",
      label: "Costi con segno sospetto",
      message: `${suspiciousCosts.length} costo/i sono negativi. Di norma i costi si inseriscono positivi.`,
      severity: "warning"
    });
  }

  if (suspiciousRevenue.length > 0) {
    issues.push({
      id: "negative-revenues",
      label: "Ricavi con segno sospetto",
      message: `${suspiciousRevenue.length} ricavo/i sono negativi. Controllare il segno.`,
      severity: "warning"
    });
  }

  return issues;
};

export const validateProject = (data: FiscalYearData): ValidationIssue[] => [
  ...validateBalanceSheet(data),
  ...validateIncomeStatement(data)
];
