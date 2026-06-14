import { describe, expect, it } from "vitest";
import { extractTextFromFile } from "../lib/fileImport";

describe("importazione file", () => {
  it("estrae testo da un file TXT lato client", async () => {
    const file = new File(["Banca c/c attivo 37.000"], "traccia.txt", {
      type: "text/plain"
    });

    const result = await extractTextFromFile(file);

    expect(result.fileType).toBe("text");
    expect(result.fileName).toBe("traccia.txt");
    expect(result.text).toContain("Banca c/c attivo");
  });
});
