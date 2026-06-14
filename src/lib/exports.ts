import type { FiscalYearData, StatementOutput } from "../types/accounting";

const escapeCsv = (value: string | number | undefined): string => {
  const text = String(value ?? "");
  if (/[",\n;]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
};

export const exportToCSV = (output: StatementOutput): string => {
  const rows = [
    ["Voce", "Codice", "Importo", "Note"].map(escapeCsv).join(";"),
    ...output.rows.map((row) =>
      [row.label, row.code, row.amount, row.notes].map(escapeCsv).join(";")
    )
  ];

  return rows.join("\n");
};

export const exportToJSON = (value: StatementOutput | FiscalYearData): string =>
  JSON.stringify(value, null, 2);

export const tableToClipboardText = (output: StatementOutput): string =>
  [output.title, ...output.rows.map((row) => `${row.label}\t${row.amount}`)].join("\n");

export const copyTableToClipboard = async (output: StatementOutput): Promise<string> => {
  const text = tableToClipboardText(output);
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  }

  return text;
};

export const downloadTextFile = (fileName: string, contents: string, mimeType: string): void => {
  const blob = new Blob([contents], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};
