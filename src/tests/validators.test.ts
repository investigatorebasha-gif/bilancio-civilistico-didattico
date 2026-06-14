import { describe, expect, it } from "vitest";
import { sampleData } from "../data/sampleData";
import { checkAbbreviatedEligibility, validateIncomeStatement } from "../lib/validators";
import type { FiscalYearData } from "../types/accounting";

const clone = (data: FiscalYearData): FiscalYearData =>
  JSON.parse(JSON.stringify(data)) as FiscalYearData;

describe("validazioni", () => {
  it("se mancano i dati soglia la forma abbreviata non e verificabile", () => {
    const data = clone(sampleData);
    data.thresholds = {};

    const result = checkAbbreviatedEligibility(data);

    expect(result.status).toBe("unknown");
    expect(result.message).toContain("Requisiti non verificabili");
  });

  it("una societa quotata non puo usare la forma abbreviata", () => {
    const data = clone(sampleData);
    data.isListed = true;

    const result = checkAbbreviatedEligibility(data);

    expect(result.status).toBe("not_eligible");
  });

  it("un costo negativo sospetto produce avviso", () => {
    const data = clone(sampleData);
    data.accounts.push({
      id: "bad-cost",
      name: "Costo con segno errato",
      amount: -500,
      nature: "cost",
      civilCodeCode: "CE.B.7",
      reclassifiedCode: "CE.VA.ESTERNI"
    });

    const issue = validateIncomeStatement(data).find((item) => item.id === "negative-costs");

    expect(issue?.severity).toBe("warning");
  });
});
