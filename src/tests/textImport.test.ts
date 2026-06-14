import { describe, expect, it } from "vitest";
import { parseAccountingText } from "../lib/textImport";

describe("importazione da testo libero", () => {
  it("estrae dati aziendali, soglie e voci contabili da testo incollato", () => {
    const result = parseAccountingText(
      `Azienda: Beta Scuola S.r.l.
Esercizio: 2026
Totale attivo: 350.000
Ricavi vendite: 280.000
Dipendenti medi: 12
Banca c/c attivo 37.000
Crediti verso clienti entro 12 mesi 65.000
Capitale sociale 120.000
Debiti verso fornitori entro 12 mesi 52.000
Servizi 42.000`,
      "test"
    );

    expect(result.detection.companyName).toBe("Beta Scuola S.r.l.");
    expect(result.detection.year).toBe(2026);
    expect(result.detection.thresholds?.totalAssets).toBe(350000);
    expect(result.detection.thresholds?.salesRevenue).toBe(280000);
    expect(result.detection.thresholds?.averageEmployees).toBe(12);
    expect(result.accounts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Banca c/c attivo",
          amount: 37000,
          civilCodeCode: "SP.A.C.IV",
          reclassifiedCode: "RF.AC.LI"
        }),
        expect.objectContaining({
          name: "Crediti verso clienti entro 12 mesi",
          amount: 65000,
          civilCodeCode: "SP.A.C.II",
          dueWithin12Months: true
        }),
        expect.objectContaining({
          name: "Servizi",
          amount: 42000,
          civilCodeCode: "CE.B.7",
          nature: "cost"
        })
      ])
    );
  });

  it("segnala righe con importo ma senza mappatura riconosciuta", () => {
    const result = parseAccountingText("Voce molto strana 1.234", "test");

    expect(result.accounts).toHaveLength(0);
    expect(result.warnings[0]).toContain("Riga non riconosciuta");
  });
});
