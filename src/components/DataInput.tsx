import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { useState } from "react";
import { AccountTable } from "./AccountTable";
import { FormatSelector } from "./FormatSelector";
import { TextImportPanel } from "./TextImportPanel";
import type { FiscalYearData, PreviousYearThresholdData, ThresholdData } from "../types/accounting";

type DataInputProps = {
  data: FiscalYearData;
  onChange: (data: FiscalYearData) => void;
  onLoadSample: () => void;
  onShowResults: () => void;
};

type Step = 1 | 2 | 3;
type EntryMode = "text" | "simple" | "accounts";

const fieldClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-950";

const stepLabels: Record<Step, string> = {
  1: "Dati azienda",
  2: "Inserimento voci",
  3: "Mappatura"
};

const numberOrUndefined = (value: string): number | undefined => {
  if (value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export function DataInput({ data, onChange, onLoadSample, onShowResults }: DataInputProps) {
  const [step, setStep] = useState<Step>(1);
  const [entryMode, setEntryMode] = useState<EntryMode>("text");

  const update = <K extends keyof FiscalYearData>(key: K, value: FiscalYearData[K]) => {
    onChange({ ...data, [key]: value });
  };

  const updateThreshold = <K extends keyof ThresholdData>(key: K, value: ThresholdData[K]) => {
    onChange({ ...data, thresholds: { ...data.thresholds, [key]: value } });
  };

  const updatePreviousThreshold = <K extends keyof PreviousYearThresholdData>(
    key: K,
    value: PreviousYearThresholdData[K]
  ) => {
    onChange({
      ...data,
      previousYear: {
        year: data.year - 1,
        ...data.previousYear,
        [key]: value
      }
    });
  };

  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-line bg-white p-4 shadow-soft dark:border-stone-800 dark:bg-stone-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold">Inserisci dati</h1>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              Compila i passaggi e poi genera gli schemi di bilancio.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(stepLabels) as Array<`${Step}`>).map((key) => {
              const itemStep = Number(key) as Step;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStep(itemStep)}
                  className={`rounded-lg px-3 py-2 text-sm font-bold ${
                    step === itemStep
                      ? "bg-mint text-white"
                      : "border border-line bg-white text-stone-700 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                  }`}
                >
                  {itemStep}. {stepLabels[itemStep]}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {step === 1 && (
        <section className="grid gap-4 rounded-lg border border-line bg-white p-4 shadow-soft dark:border-stone-800 dark:bg-stone-900">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="grid gap-1 text-sm font-semibold lg:col-span-2">
              Nome azienda
              <input
                value={data.companyName}
                onChange={(event) => update("companyName", event.target.value)}
                className={fieldClass}
                placeholder="Es. Alfa S.r.l."
              />
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Esercizio
              <input
                type="number"
                value={data.year}
                onChange={(event) => update("year", Number(event.target.value))}
                className={fieldClass}
              />
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Forma giuridica
              <input
                value={data.legalForm ?? ""}
                onChange={(event) => update("legalForm", event.target.value)}
                className={fieldClass}
                placeholder="S.r.l., S.p.A..."
              />
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Societa quotata
              <select
                value={data.isListed ? "yes" : "no"}
                onChange={(event) => update("isListed", event.target.value === "yes")}
                className={fieldClass}
              >
                <option value="no">No</option>
                <option value="yes">Si</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Totale attivo
              <input
                type="number"
                value={data.thresholds.totalAssets ?? ""}
                onChange={(event) =>
                  updateThreshold("totalAssets", numberOrUndefined(event.target.value))
                }
                className={fieldClass}
              />
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Ricavi vendite/prestazioni
              <input
                type="number"
                value={data.thresholds.salesRevenue ?? ""}
                onChange={(event) =>
                  updateThreshold("salesRevenue", numberOrUndefined(event.target.value))
                }
                className={fieldClass}
              />
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Dipendenti medi
              <input
                type="number"
                value={data.thresholds.averageEmployees ?? ""}
                onChange={(event) =>
                  updateThreshold("averageEmployees", numberOrUndefined(event.target.value))
                }
                className={fieldClass}
              />
            </label>
          </div>

          <div className="rounded-lg border border-line p-4 dark:border-stone-800">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-bold">Dati esercizio precedente</h2>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  Servono per verificare la forma abbreviata sui due esercizi consecutivi.
                </p>
              </div>
              {!data.previousYear ? (
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...data,
                      previousYear: { year: data.year - 1 }
                    })
                  }
                  className="rounded-lg border border-line px-3 py-2 text-sm font-bold hover:border-mint dark:border-stone-700"
                >
                  Aggiungi precedente
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onChange({ ...data, previousYear: undefined })}
                  className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-bold text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300"
                >
                  Rimuovi precedente
                </button>
              )}
            </div>

            {data.previousYear && (
              <div className="grid gap-4 md:grid-cols-4">
                <label className="grid gap-1 text-sm font-semibold">
                  Esercizio precedente
                  <input
                    type="number"
                    value={data.previousYear.year ?? data.year - 1}
                    onChange={(event) =>
                      updatePreviousThreshold("year", numberOrUndefined(event.target.value))
                    }
                    className={fieldClass}
                  />
                </label>
                <label className="grid gap-1 text-sm font-semibold">
                  Totale attivo
                  <input
                    type="number"
                    value={data.previousYear.totalAssets ?? ""}
                    onChange={(event) =>
                      updatePreviousThreshold("totalAssets", numberOrUndefined(event.target.value))
                    }
                    className={fieldClass}
                  />
                </label>
                <label className="grid gap-1 text-sm font-semibold">
                  Ricavi
                  <input
                    type="number"
                    value={data.previousYear.salesRevenue ?? ""}
                    onChange={(event) =>
                      updatePreviousThreshold("salesRevenue", numberOrUndefined(event.target.value))
                    }
                    className={fieldClass}
                  />
                </label>
                <label className="grid gap-1 text-sm font-semibold">
                  Dipendenti medi
                  <input
                    type="number"
                    value={data.previousYear.averageEmployees ?? ""}
                    onChange={(event) =>
                      updatePreviousThreshold(
                        "averageEmployees",
                        numberOrUndefined(event.target.value)
                      )
                    }
                    className={fieldClass}
                  />
                </label>
              </div>
            )}
          </div>
        </section>
      )}

      {step === 2 && (
        <div className="grid gap-4">
          <section className="rounded-lg border border-line bg-white p-4 shadow-soft dark:border-stone-800 dark:bg-stone-900">
            <h2 className="mb-3 text-base font-bold">Modalita inserimento</h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setEntryMode("text")}
                className={`rounded-lg px-3 py-2 text-sm font-bold ${
                  entryMode === "text"
                    ? "bg-mint text-white"
                    : "border border-line dark:border-stone-700"
                }`}
              >
                Incolla testo
              </button>
              <button
                type="button"
                onClick={() => setEntryMode("simple")}
                className={`rounded-lg px-3 py-2 text-sm font-bold ${
                  entryMode === "simple"
                    ? "bg-mint text-white"
                    : "border border-line dark:border-stone-700"
                }`}
              >
                Modalita semplice
              </button>
              <button
                type="button"
                onClick={() => setEntryMode("accounts")}
                className={`rounded-lg px-3 py-2 text-sm font-bold ${
                  entryMode === "accounts"
                    ? "bg-mint text-white"
                    : "border border-line dark:border-stone-700"
                }`}
              >
                Modalita conti
              </button>
            </div>
            <p className="mt-3 text-sm text-stone-600 dark:text-stone-300">
              {entryMode === "text"
                ? "Incolla il testo dell'esercizio: il sito estrae importi e propone le mappature."
                : entryMode === "simple"
                  ? "Usa voci aggregate gia pronte per lo schema civilistico."
                  : "Inserisci conti come Banca c/c, Merci c/acquisti o Crediti v/clienti e correggi la mappatura proposta."}
            </p>
          </section>
          {entryMode === "text" && <TextImportPanel data={data} onChange={onChange} />}
          <AccountTable
            accounts={data.accounts}
            onChange={(accounts) => onChange({ ...data, accounts })}
          />
          <FormatSelector
            settings={data.settings}
            onChange={(settings) => onChange({ ...data, settings })}
          />
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-4">
          <section className="rounded-lg border border-line bg-white p-4 shadow-soft dark:border-stone-800 dark:bg-stone-900">
            <h2 className="text-base font-bold">Mappatura</h2>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              Controlla conto inserito, importo, natura, voce civilistica e voce riclassificata.
              Le modifiche manuali aggiornano subito i risultati.
            </p>
          </section>
          <AccountTable
            accounts={data.accounts}
            onChange={(accounts) => onChange({ ...data, accounts })}
          />
        </div>
      )}

      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStep((value) => Math.max(1, value - 1) as Step)}
            disabled={step === 1}
            className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Indietro
          </button>
          <button
            type="button"
            onClick={() => setStep((value) => Math.min(3, value + 1) as Step)}
            disabled={step === 3}
            className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700"
          >
            Avanti
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-bold hover:border-mint dark:border-stone-700"
          >
            <FileText size={16} aria-hidden="true" />
            Carica esempio
          </button>
          <button
            type="button"
            onClick={onShowResults}
            className="rounded-lg bg-mint px-4 py-2 text-sm font-bold text-white"
          >
            Genera bilancio
          </button>
        </div>
      </div>
    </div>
  );
}
