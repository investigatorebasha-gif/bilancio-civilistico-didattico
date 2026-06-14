import type { FiscalYearData, ValidationIssue } from "../types/accounting";
import {
  generateFinancialReclassifiedBalanceSheet,
  generateOrdinaryBalanceSheet,
  generateOrdinaryIncomeStatement,
  generateValueAddedIncomeStatement
} from "./calculations";
import { accountNeedsDueInformation, findUnmappedAccounts, hasDueInformation } from "./mappings";
import { checkAbbreviatedEligibility } from "./validators";

const EPSILON = 0.01;

export const validateProfessionalReadiness = (data: FiscalYearData): ValidationIssue[] => {
  const ordinary = generateOrdinaryBalanceSheet(data);
  const reclassified = generateFinancialReclassifiedBalanceSheet(data);
  const income = generateOrdinaryIncomeStatement(data);
  const valueAdded = generateValueAddedIncomeStatement(data);
  const eligibility = checkAbbreviatedEligibility(data);
  const unmapped = findUnmappedAccounts(data);
  const missingDueInfo = data.accounts.filter(
    (account) => accountNeedsDueInformation(account) && !hasDueInformation(account)
  );
  const imported = data.accounts.filter((account) => account.importSource);
  const lowConfidence = data.accounts.filter(
    (account) => account.importConfidence !== undefined && account.importConfidence < 85
  );
  const duplicateNames = findDuplicateNames(data);
  const issues: ValidationIssue[] = [
    {
      id: "professional-traceability",
      label: "Tracciabilita dati",
      message:
        imported.length > 0
          ? `${imported.length} voce/i hanno origine tracciata da testo, PDF o OCR.`
          : "Le voci sono manuali: va bene, ma conserva la traccia o il prospetto di origine.",
      severity: imported.length > 0 ? "success" : "warning",
      suggestions:
        imported.length > 0
          ? []
          : ["Per un lavoro piu controllabile, importa la traccia o compila note/origine delle voci principali."]
    },
    {
      id: "professional-consistency",
      label: "Coerenza tra schemi",
      message:
        Math.abs((income.totals.netIncome ?? 0) - (valueAdded.totals.netIncome ?? 0)) <= EPSILON
          ? "Utile del CE ordinario e del CE a valore aggiunto coincidono."
          : "Utile del CE ordinario e del CE a valore aggiunto non coincidono.",
      severity:
        Math.abs((income.totals.netIncome ?? 0) - (valueAdded.totals.netIncome ?? 0)) <= EPSILON
          ? "success"
          : "error",
      amount: (income.totals.netIncome ?? 0) - (valueAdded.totals.netIncome ?? 0),
      suggestions: [
        "Se non coincidono, controlla interessi, rettifiche finanziarie, imposte e costi esterni."
      ]
    },
    {
      id: "professional-readiness-score",
      label: "Prontezza consegna",
      message: `Punteggio qualita dati: ${calculateReadinessScore({
        ordinaryDifference: ordinary.totals.balanceDifference ?? 0,
        reclassifiedDifference: reclassified.totals.balanceDifference ?? 0,
        unmappedCount: unmapped.length,
        missingDueCount: missingDueInfo.length,
        lowConfidenceCount: lowConfidence.length,
        duplicateCount: duplicateNames.length,
        eligibilityUnknown: eligibility.status === "unknown"
      })}/100.`,
      severity:
        unmapped.length === 0 &&
        missingDueInfo.length === 0 &&
        lowConfidence.length === 0 &&
        Math.abs(ordinary.totals.balanceDifference ?? 0) <= EPSILON &&
        Math.abs(reclassified.totals.balanceDifference ?? 0) <= EPSILON
          ? "success"
          : "warning",
      suggestions: buildReadinessSuggestions({
        unmappedCount: unmapped.length,
        missingDueCount: missingDueInfo.length,
        lowConfidenceCount: lowConfidence.length,
        duplicateNames,
        eligibilityUnknown: eligibility.status === "unknown"
      })
    }
  ];

  if (duplicateNames.length > 0) {
    issues.push({
      id: "professional-duplicates",
      label: "Possibili duplicati",
      message: `${duplicateNames.length} descrizione/i compaiono piu volte.`,
      severity: "warning",
      suggestions: duplicateNames
        .slice(0, 5)
        .map((name) => `Controlla se "${name}" e un duplicato o una voce distinta.`)
    });
  }

  return issues;
};

const findDuplicateNames = (data: FiscalYearData): string[] => {
  const counts = new Map<string, number>();
  data.accounts.forEach((account) => {
    const key = account.name.trim().toLowerCase();
    if (key) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  });

  return Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .map(([name]) => name);
};

const calculateReadinessScore = ({
  ordinaryDifference,
  reclassifiedDifference,
  unmappedCount,
  missingDueCount,
  lowConfidenceCount,
  duplicateCount,
  eligibilityUnknown
}: {
  ordinaryDifference: number;
  reclassifiedDifference: number;
  unmappedCount: number;
  missingDueCount: number;
  lowConfidenceCount: number;
  duplicateCount: number;
  eligibilityUnknown: boolean;
}): number => {
  let score = 100;
  if (Math.abs(ordinaryDifference) > EPSILON) score -= 25;
  if (Math.abs(reclassifiedDifference) > EPSILON) score -= 20;
  score -= Math.min(unmappedCount * 8, 24);
  score -= Math.min(missingDueCount * 5, 15);
  score -= Math.min(lowConfidenceCount * 4, 16);
  score -= Math.min(duplicateCount * 4, 12);
  if (eligibilityUnknown) score -= 8;
  return Math.max(score, 0);
};

const buildReadinessSuggestions = ({
  unmappedCount,
  missingDueCount,
  lowConfidenceCount,
  duplicateNames,
  eligibilityUnknown
}: {
  unmappedCount: number;
  missingDueCount: number;
  lowConfidenceCount: number;
  duplicateNames: string[];
  eligibilityUnknown: boolean;
}): string[] => {
  const suggestions: string[] = [];
  if (unmappedCount > 0) suggestions.push("Completa tutte le voci civilistiche e riclassificate mancanti.");
  if (missingDueCount > 0) suggestions.push("Indica entro/oltre 12 mesi per crediti, debiti e mutui.");
  if (lowConfidenceCount > 0) suggestions.push("Conferma manualmente le mappature con confidenza bassa.");
  if (duplicateNames.length > 0) suggestions.push("Verifica i possibili duplicati prima di esportare.");
  if (eligibilityUnknown) suggestions.push("Inserisci attivo, ricavi e dipendenti medi per la forma abbreviata.");
  if (suggestions.length === 0) suggestions.push("Dati coerenti per una consegna didattica ordinata.");
  return suggestions;
};
