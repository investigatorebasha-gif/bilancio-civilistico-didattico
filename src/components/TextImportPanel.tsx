import { Brain, ClipboardPaste, Plus, Replace } from "lucide-react";
import { useMemo, useState } from "react";
import { parseAccountingText } from "../lib/textImport";
import type { FiscalYearData, TextImportDetection } from "../types/accounting";

type TextImportPanelProps = {
  data: FiscalYearData;
  onChange: (data: FiscalYearData) => void;
};

const exampleText = `Azienda: Alfa Didattica S.r.l.
Esercizio: 2026
Totale attivo: 350.000
Ricavi vendite: 280.000
Dipendenti medi: 12

Banca c/c attivo 37.000
Crediti verso clienti entro 12 mesi 65.000
Rimanenze merci 42.000
Impianti e macchinari 150.000
Capitale sociale 120.000
Utile dell'esercizio 27.000
Debiti verso fornitori entro 12 mesi 52.000
Mutui oltre 12 mesi 42.000
Ricavi delle vendite 280.000
Acquisti materie e merci 96.000
Servizi 42.000
Costi per il personale 68.000
Imposte 13.000`;

export function TextImportPanel({ data, onChange }: TextImportPanelProps) {
  const [text, setText] = useState("");
  const [lastAction, setLastAction] = useState("");
  const result = useMemo(() => parseAccountingText(text), [text]);
  const hasAccounts = result.accounts.length > 0;

  const applyDetection = (project: FiscalYearData, detection: TextImportDetection): FiscalYearData => ({
    ...project,
    companyName: detection.companyName ?? project.companyName,
    year: detection.year ?? project.year,
    legalForm: detection.legalForm ?? project.legalForm,
    isListed: detection.isListed ?? project.isListed,
    thresholds: {
      ...project.thresholds,
      ...detection.thresholds
    }
  });

  const importAccounts = (mode: "append" | "replace") => {
    const timestamp = Date.now();
    const accounts = result.accounts.map((account, index) => ({
      ...account,
      id: `text-${timestamp}-${index + 1}`
    }));
    const baseProject = applyDetection(data, result.detection);
    onChange({
      ...baseProject,
      accounts: mode === "append" ? [...baseProject.accounts, ...accounts] : accounts
    });
    setLastAction(
      mode === "append"
        ? `${accounts.length} voce/i aggiunte dal testo.`
        : `${accounts.length} voce/i importate sostituendo l'elenco.`
    );
  };

  return (
    <section className="grid gap-4 rounded-lg border border-line bg-white p-4 shadow-soft dark:border-stone-800 dark:bg-stone-900">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="text-mint" size={20} aria-hidden="true" />
            <h2 className="text-base font-bold">Incolla testo e fai estrarre le voci</h2>
          </div>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
            L'analisi e automatica e lato client: riconosce descrizioni, importi, scadenze e
            mappature probabili. Controlla sempre l'anteprima prima di generare il bilancio.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setText(exampleText)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-bold hover:border-mint dark:border-stone-700"
        >
          <ClipboardPaste size={16} aria-hidden="true" />
          Usa esempio testo
        </button>
      </div>

      <textarea
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setLastAction("");
        }}
        className="min-h-48 w-full rounded-lg border border-line bg-white p-3 text-sm leading-6 dark:border-stone-700 dark:bg-stone-950"
        placeholder="Incolla qui il testo dell'esercizio o l'elenco dei conti. Esempio: Banca c/c attivo 37.000"
      />

      <div className="grid gap-3 md:grid-cols-3">
        <Summary label="Voci riconosciute" value={String(result.accounts.length)} />
        <Summary label="Righe non usate" value={String(result.ignoredLines.length)} />
        <Summary
          label="Dati azienda rilevati"
          value={String(
            [
              result.detection.companyName,
              result.detection.year,
              result.detection.legalForm,
              result.detection.thresholds?.totalAssets
            ].filter(Boolean).length
          )}
        />
      </div>

      {hasAccounts && (
        <div className="overflow-x-auto rounded-lg border border-line dark:border-stone-800">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500 dark:border-stone-800 dark:bg-stone-950">
                <th className="p-2">Voce estratta</th>
                <th className="p-2 text-right">Importo</th>
                <th className="p-2">Natura</th>
                <th className="p-2">Civilistico</th>
                <th className="p-2">Riclassificato</th>
                <th className="p-2">Confidenza</th>
                <th className="p-2">Perche</th>
              </tr>
            </thead>
            <tbody>
              {result.accounts.slice(0, 12).map((account) => (
                <tr key={account.id} className="border-b border-line last:border-0 dark:border-stone-800">
                  <td className="p-2">{account.name}</td>
                  <td className="table-number p-2 font-semibold">
                    {account.amount.toLocaleString("it-IT")}
                  </td>
                  <td className="p-2">{account.nature}</td>
                  <td className="p-2">{account.civilCodeCode}</td>
                  <td className="p-2">{account.reclassifiedCode}</td>
                  <td className="p-2">
                    <ConfidenceBadge value={account.importConfidence} />
                  </td>
                  <td className="p-2 text-xs text-stone-600 dark:text-stone-300">
                    {account.importExplanation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(result.warnings.length > 0 || result.ignoredLines.length > 0) && text && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
          {result.warnings.slice(0, 4).map((warning) => (
            <p key={warning} className="font-semibold">
              {warning}
            </p>
          ))}
          {result.ignoredLines.length > 0 && (
            <p className="mt-1">
              Righe ignorate: {result.ignoredLines.slice(0, 5).join(" | ")}
              {result.ignoredLines.length > 5 ? " ..." : ""}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => importAccounts("append")}
          disabled={!hasAccounts}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-mint px-3 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-stone-400"
        >
          <Plus size={16} aria-hidden="true" />
          Aggiungi voci estratte
        </button>
        <button
          type="button"
          onClick={() => importAccounts("replace")}
          disabled={!hasAccounts}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-bold hover:border-mint disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700"
        >
          <Replace size={16} aria-hidden="true" />
          Sostituisci elenco
        </button>
        {lastAction && <span className="text-sm font-semibold text-mint">{lastAction}</span>}
      </div>
    </section>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-950">
      <p className="text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">
        {label}
      </p>
      <p className="text-xl font-extrabold">{value}</p>
    </div>
  );
}

function ConfidenceBadge({ value }: { value?: number }) {
  if (value === undefined) {
    return <span className="text-xs text-stone-500">Manuale</span>;
  }

  const style =
    value >= 90
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
      : value >= 80
        ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100"
        : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-100";

  return <span className={`rounded-full px-2 py-1 text-xs font-bold ${style}`}>{value}%</span>;
}
