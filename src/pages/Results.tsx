import { ArrowLeft } from "lucide-react";
import { BalanceOutput } from "../components/BalanceOutput";
import { FormatSelector } from "../components/FormatSelector";
import { ValidationPanel } from "../components/ValidationPanel";
import type { FiscalYearData } from "../types/accounting";

type ResultsProps = {
  data: FiscalYearData;
  onChange: (data: FiscalYearData) => void;
  onEdit: () => void;
};

export function Results({ data, onChange, onEdit }: ResultsProps) {
  return (
    <div className="grid gap-5">
      <section className="no-print flex flex-col gap-3 rounded-lg border border-line bg-white p-4 shadow-soft dark:border-stone-800 dark:bg-stone-900 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Risultati</h1>
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Output pronti da copiare con controlli e avvisi.
          </p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-bold hover:border-mint dark:border-stone-700"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Torna ai dati
        </button>
      </section>

      <FormatSelector
        settings={data.settings}
        onChange={(settings) => onChange({ ...data, settings })}
      />
      <ValidationPanel data={data} />
      <BalanceOutput data={data} onImport={onChange} />
    </div>
  );
}
