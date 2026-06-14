import { describe, expect, it } from "vitest";
import { sampleData } from "../data/sampleData";
import {
  generateFinancialReclassifiedBalanceSheet,
  generateOrdinaryBalanceSheet,
  generateOrdinaryIncomeStatement
} from "../lib/calculations";
import { exportToJSON } from "../lib/exports";
import { checkAbbreviatedEligibility, validateBalanceSheet } from "../lib/validators";
import type { FiscalYearData } from "../types/accounting";

const clone = (data: FiscalYearData): FiscalYearData =>
  JSON.parse(JSON.stringify(data)) as FiscalYearData;

describe("calcoli contabili", () => {
  it("lo stato patrimoniale ordinario quadra quando attivo e passivo coincidono", () => {
    const output = generateOrdinaryBalanceSheet(sampleData);

    expect(output.totals.totalAssets).toBe(350000);
    expect(output.totals.totalLiabilities).toBe(350000);
    expect(output.totals.balanceDifference).toBe(0);
  });

  it("lo stato patrimoniale ordinario segnala errore quando attivo e passivo non coincidono", () => {
    const data = clone(sampleData);
    data.accounts[0].amount += 1000;

    const issue = validateBalanceSheet(data).find((item) => item.id === "ordinary-balance");

    expect(issue?.severity).toBe("error");
    expect(issue?.amount).toBe(1000);
  });

  it("l'utile del conto economico coincide con l'utile nel patrimonio netto", () => {
    const output = generateOrdinaryBalanceSheet(sampleData);

    expect(output.totals.profitFromIncomeStatement).toBe(27000);
    expect(output.totals.profitInEquity).toBe(27000);
    expect(output.totals.profitDifference).toBe(0);
  });

  it("il conto economico calcola correttamente A meno B", () => {
    const output = generateOrdinaryIncomeStatement(sampleData);

    expect(output.totals.valueOfProduction).toBe(293000);
    expect(output.totals.productionCosts).toBe(245000);
    expect(output.totals.grossOperatingResult).toBe(48000);
  });

  it("il conto economico calcola risultato ante imposte e utile netto", () => {
    const output = generateOrdinaryIncomeStatement(sampleData);

    expect(output.totals.preTaxResult).toBe(40000);
    expect(output.totals.taxes).toBe(13000);
    expect(output.totals.netIncome).toBe(27000);
  });

  it("il bilancio abbreviato e ammesso se non supera due limiti", () => {
    const eligibility = checkAbbreviatedEligibility(sampleData);

    expect(eligibility.status).toBe("eligible");
  });

  it("il bilancio abbreviato non e ammesso se supera due limiti per due esercizi consecutivi", () => {
    const data = clone(sampleData);
    data.thresholds = {
      totalAssets: 6000000,
      salesRevenue: 12000000,
      averageEmployees: 40
    };
    data.previousYear = {
      year: 2025,
      totalAssets: 6100000,
      salesRevenue: 12500000,
      averageEmployees: 42
    };

    const eligibility = checkAbbreviatedEligibility(data);

    expect(eligibility.status).toBe("not_eligible");
  });

  it("il riclassificato finanziario quadra con impieghi uguali a fonti", () => {
    const output = generateFinancialReclassifiedBalanceSheet(sampleData);

    expect(output.totals.totalUses).toBe(350000);
    expect(output.totals.totalSources).toBe(350000);
    expect(output.totals.balanceDifference).toBe(0);
  });

  it("l'export JSON contiene tutti i dati del progetto", () => {
    const parsed = JSON.parse(exportToJSON(sampleData)) as FiscalYearData;

    expect(parsed.companyName).toBe(sampleData.companyName);
    expect(parsed.accounts).toHaveLength(sampleData.accounts.length);
    expect(parsed.settings.schoolMode).toBe(true);
  });

  it("le voci non mappate generano un warning", () => {
    const data = clone(sampleData);
    data.accounts.push({
      id: "unmapped",
      name: "Voce da mappare",
      amount: 100,
      nature: "asset"
    });

    const issue = validateBalanceSheet(data).find((item) => item.id === "unmapped-accounts");

    expect(issue?.severity).toBe("warning");
  });
});
