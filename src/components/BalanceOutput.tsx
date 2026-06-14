import { useMemo, useState } from "react";
import {
  generateAbbreviatedBalanceSheet,
  generateAbbreviatedIncomeStatement,
  generateFinancialReclassifiedBalanceSheet,
  generateOrdinaryBalanceSheet,
  generateOrdinaryIncomeStatement,
  generateValueAddedIncomeStatement
} from "../lib/calculations";
import { formatCurrency } from "../lib/formatters";
import type { FiscalYearData, StatementKind, StatementOutput, StatementRow } from "../types/accounting";
import { ExportButtons } from "./ExportButtons";

type BalanceOutputProps = {
  data: FiscalYearData;
  onImport: (data: FiscalYearData) => void;
};

const tabLabels: Record<StatementKind, string> = {
  "ordinary-balance-sheet": "Stato patrimoniale ordinario",
  "ordinary-income-statement": "Conto economico ordinario",
  "abbreviated-balance-sheet": "Stato patrimoniale abbreviato",
  "abbreviated-income-statement": "Conto economico abbreviato",
  "financial-reclassified-balance-sheet": "Riclassificato finanziario",
  "value-added-income-statement": "CE valore aggiunto"
};

export function BalanceOutput({ data, onImport }: BalanceOutputProps) {
  const outputs = useMemo(
    () => [
      generateOrdinaryBalanceSheet(data),
      generateOrdinaryIncomeStatement(data),
      generateAbbreviatedBalanceSheet(data),
      generateAbbreviatedIncomeStatement(data),
      generateFinancialReclassifiedBalanceSheet(data),
      generateValueAddedIncomeStatement(data)
    ],
    [data]
  );
  const defaultTab = data.settings.mode === "abbreviato"
    ? "abbreviated-balance-sheet"
    : data.settings.mode === "riclassificato"
      ? "financial-reclassified-balance-sheet"
      : "ordinary-balance-sheet";
  const [selectedId, setSelectedId] = useState<StatementKind>(defaultTab);
  const activeOutput = outputs.find((output) => output.id === selectedId) ?? outputs[0];

  return (
    <section className="grid gap-4 rounded-lg border border-line bg-white p-4 shadow-soft dark:border-stone-800 dark:bg-stone-900">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-bold">Output</h2>
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Tabelle pronte da copiare, esportare o stampare.
          </p>
        </div>
        <ExportButtons data={data} output={activeOutput} onImport={onImport} />
      </div>

      <div className="no-print flex flex-wrap gap-2">
        {outputs.map((output) => (
          <button
            key={output.id}
            type="button"
            onClick={() => setSelectedId(output.id)}
            className={`rounded-lg px-3 py-2 text-sm font-bold ${
              selectedId === output.id
                ? "bg-mint text-white"
                : "border border-line bg-white text-stone-700 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
            }`}
          >
            {tabLabels[output.id]}
          </button>
        ))}
      </div>

      <StatementTable output={activeOutput} data={data} />
    </section>
  );
}

function StatementTable({ output, data }: { output: StatementOutput; data: FiscalYearData }) {
  return (
    <article className="print-panel overflow-hidden rounded-lg border border-line dark:border-stone-800">
      <div className="border-b border-line bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-950">
        <h3 className="text-lg font-bold">{output.title}</h3>
        <p className="text-sm text-stone-600 dark:text-stone-300">
          {data.companyName || "Azienda"} · esercizio {data.year}
        </p>
        {output.subtitle && (
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{output.subtitle}</p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-white text-left text-xs uppercase tracking-wide text-stone-500 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400">
              <th className="p-3">Voce</th>
              <th className="p-3">Codice</th>
              <th className="p-3 text-right">Importo</th>
              <th className="p-3">Spiegazione sintetica</th>
            </tr>
          </thead>
          <tbody>
            {output.rows.map((statementRow) => (
              <StatementTableRow
                key={statementRow.id}
                row={statementRow}
                currency={data.currency}
                rounding={data.settings.rounding}
              />
            ))}
          </tbody>
        </table>
      </div>

      {output.warnings && output.warnings.length > 0 && (
        <div className="border-t border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
          {output.warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      )}
    </article>
  );
}

function StatementTableRow({
  row,
  currency,
  rounding
}: {
  row: StatementRow;
  currency: "EUR";
  rounding: FiscalYearData["settings"]["rounding"];
}) {
  const padding =
    row.level === 0 ? "pl-3" : row.level === 1 ? "pl-7" : row.level === 2 ? "pl-11" : "pl-14";

  return (
    <tr
      className={`border-b border-line last:border-0 dark:border-stone-800 statement-row-${row.type}`}
    >
      <td className={`p-3 ${padding}`}>{row.label}</td>
      <td className="p-3 text-xs text-stone-500 dark:text-stone-400">{row.code ?? ""}</td>
      <td className="table-number p-3 font-semibold">
        {formatCurrency(row.amount, currency, rounding)}
      </td>
      <td className="p-3 text-xs text-stone-600 dark:text-stone-300">{row.notes ?? ""}</td>
    </tr>
  );
}
