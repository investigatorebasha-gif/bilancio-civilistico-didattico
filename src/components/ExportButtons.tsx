import { Copy, Download, FileJson, Printer, Upload } from "lucide-react";
import { useRef, useState } from "react";
import {
  copyTableToClipboard,
  downloadTextFile,
  exportToCSV,
  exportToJSON
} from "../lib/exports";
import type { FiscalYearData, StatementOutput } from "../types/accounting";

type ExportButtonsProps = {
  data: FiscalYearData;
  output: StatementOutput;
  onImport: (data: FiscalYearData) => void;
};

const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold text-stone-700 hover:border-mint dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100";

export function ExportButtons({ data, output, onImport }: ExportButtonsProps) {
  const [status, setStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const safeName = output.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleCopy = async () => {
    await copyTableToClipboard(output);
    setStatus("Tabella copiata negli appunti.");
  };

  const handleImport = (file: File | undefined) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        onImport(JSON.parse(String(reader.result)) as FiscalYearData);
        setStatus("Progetto caricato da JSON.");
      } catch {
        setStatus("JSON non valido: caricamento annullato.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <button type="button" onClick={handleCopy} className={buttonClass}>
        <Copy size={16} aria-hidden="true" />
        Copia tabella
      </button>
      <button
        type="button"
        onClick={() => downloadTextFile(`${safeName}.csv`, exportToCSV(output), "text/csv")}
        className={buttonClass}
      >
        <Download size={16} aria-hidden="true" />
        Export CSV
      </button>
      <button
        type="button"
        onClick={() =>
          downloadTextFile(`${safeName}.json`, exportToJSON(output), "application/json")
        }
        className={buttonClass}
      >
        <FileJson size={16} aria-hidden="true" />
        Export JSON output
      </button>
      <button
        type="button"
        onClick={() =>
          downloadTextFile("progetto-bilancio.json", exportToJSON(data), "application/json")
        }
        className={buttonClass}
      >
        <FileJson size={16} aria-hidden="true" />
        Salva progetto
      </button>
      <button type="button" onClick={() => fileInputRef.current?.click()} className={buttonClass}>
        <Upload size={16} aria-hidden="true" />
        Carica JSON
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(event) => handleImport(event.target.files?.[0])}
      />
      <button type="button" onClick={() => window.print()} className={buttonClass}>
        <Printer size={16} aria-hidden="true" />
        Stampa/PDF
      </button>
      {status && <span className="text-sm font-semibold text-mint">{status}</span>}
    </div>
  );
}
