import { ArrowRight, FileText, RotateCcw } from "lucide-react";
import { generateOrdinaryBalanceSheet, generateOrdinaryIncomeStatement } from "../lib/calculations";
import { formatCurrency } from "../lib/formatters";
import type { FiscalYearData } from "../types/accounting";

type HomeProps = {
  data: FiscalYearData;
  onStart: () => void;
  onLoadSample: () => void;
  onReset: () => void;
};

export function Home({ data, onStart, onLoadSample, onReset }: HomeProps) {
  const balanceSheet = generateOrdinaryBalanceSheet(data);
  const incomeStatement = generateOrdinaryIncomeStatement(data);

  return (
    <div className="grid gap-5">
      <section className="grid gap-5 rounded-lg border border-line bg-white p-5 shadow-soft dark:border-stone-800 dark:bg-stone-900 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid content-start gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-mint">Uso didattico</p>
            <h1 className="mt-1 text-2xl font-extrabold md:text-3xl">
              Generatore di bilancio civilistico italiano
            </h1>
            <p className="mt-2 max-w-3xl text-stone-700 dark:text-stone-200">
              Inserisci dati aziendali e voci contabili per generare stato patrimoniale,
              conto economico, forme abbreviate, riclassificato finanziario e conto economico a
              valore aggiunto.
            </p>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
            Questo progetto e didattico e non sostituisce commercialista, revisore o consulente
            fiscale.
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center gap-2 rounded-lg bg-mint px-4 py-2 text-sm font-bold text-white"
            >
              Inserisci dati
              <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onLoadSample}
              className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-bold hover:border-mint dark:border-stone-700"
            >
              <FileText size={16} aria-hidden="true" />
              Apri esempio didattico
            </button>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-bold hover:border-mint dark:border-stone-700"
            >
              <RotateCcw size={16} aria-hidden="true" />
              Nuovo progetto
            </button>
          </div>
        </div>

        <div className="grid gap-3">
          <SummaryCard
            label="Totale attivo"
            value={formatCurrency(balanceSheet.totals.totalAssets ?? 0, data.currency, data.settings.rounding)}
          />
          <SummaryCard
            label="Totale passivo"
            value={formatCurrency(
              balanceSheet.totals.totalLiabilities ?? 0,
              data.currency,
              data.settings.rounding
            )}
          />
          <SummaryCard
            label="Utile/perdita CE"
            value={formatCurrency(
              incomeStatement.totals.netIncome ?? 0,
              data.currency,
              data.settings.rounding
            )}
          />
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <InfoCard
          title="6 output automatici"
          text="Ordinario, abbreviato, riclassificato finanziario e conto economico a valore aggiunto."
        />
        <InfoCard
          title="Controlli finali"
          text="Quadratura, utile CE, scadenze, voci non mappate, soglie abbreviato e segni sospetti."
        />
        <InfoCard
          title="Esporta e copia"
          text="Clipboard, CSV, JSON progetto, stampa/PDF e salvataggio locale con localStorage."
        />
      </section>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-950">
      <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">{label}</p>
      <p className="table-number text-2xl font-extrabold">{value}</p>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-lg border border-line bg-white p-4 shadow-soft dark:border-stone-800 dark:bg-stone-900">
      <h2 className="font-bold">{title}</h2>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{text}</p>
    </article>
  );
}
