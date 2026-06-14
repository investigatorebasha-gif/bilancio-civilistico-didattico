import { describe, expect, it } from "vitest";
import { sampleData } from "../data/sampleData";
import { validateProfessionalReadiness } from "../lib/professionalChecks";
import type { FiscalYearData } from "../types/accounting";

const clone = (data: FiscalYearData): FiscalYearData =>
  JSON.parse(JSON.stringify(data)) as FiscalYearData;

describe("controlli professionali", () => {
  it("segnala prontezza positiva sui dati di esempio coerenti", () => {
    const issues = validateProfessionalReadiness(sampleData);
    const readiness = issues.find((issue) => issue.id === "professional-readiness-score");

    expect(readiness?.severity).toBe("success");
    expect(readiness?.message).toContain("100/100");
  });

  it("segnala mappature a bassa confidenza e duplicati", () => {
    const data = clone(sampleData);
    data.accounts.push({
      id: "duplicate-low-confidence",
      name: "Servizi",
      amount: 100,
      nature: "cost",
      civilCodeCode: "CE.B.7",
      reclassifiedCode: "CE.VA.ESTERNI",
      importConfidence: 70,
      importSource: "traccia.txt"
    });
    data.accounts.push({
      id: "duplicate-low-confidence-2",
      name: "Servizi",
      amount: 200,
      nature: "cost",
      civilCodeCode: "CE.B.7",
      reclassifiedCode: "CE.VA.ESTERNI"
    });

    const issues = validateProfessionalReadiness(data);

    expect(issues.find((issue) => issue.id === "professional-readiness-score")?.severity).toBe(
      "warning"
    );
    expect(issues.find((issue) => issue.id === "professional-duplicates")?.severity).toBe(
      "warning"
    );
  });
});
