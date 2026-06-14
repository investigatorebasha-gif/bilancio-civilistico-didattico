import type { BalanceSettings } from "../types/accounting";

type FormatSelectorProps = {
  settings: BalanceSettings;
  onChange: (settings: BalanceSettings) => void;
};

const toggleClass =
  "inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold shadow-sm dark:border-stone-800 dark:bg-stone-900";

export function FormatSelector({ settings, onChange }: FormatSelectorProps) {
  const update = <K extends keyof BalanceSettings>(key: K, value: BalanceSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <section className="grid gap-3 rounded-lg border border-line bg-white p-4 shadow-soft dark:border-stone-800 dark:bg-stone-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold">Impostazioni output</h2>
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Controlla righe a zero, modalita scuola e opzioni della forma abbreviata.
          </p>
        </div>
        <select
          value={settings.mode}
          onChange={(event) => update("mode", event.target.value as BalanceSettings["mode"])}
          className="rounded-lg border border-line bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-950"
        >
          <option value="ordinario">Forma ordinaria</option>
          <option value="abbreviato">Forma abbreviata</option>
          <option value="riclassificato">Riclassificato finanziario</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <label className={toggleClass}>
          <input
            type="checkbox"
            checked={settings.showZeroRows}
            onChange={(event) => update("showZeroRows", event.target.checked)}
          />
          Mostra righe a zero
        </label>
        <label className={toggleClass}>
          <input
            type="checkbox"
            checked={settings.schoolMode}
            onChange={(event) => update("schoolMode", event.target.checked)}
          />
          Modalita scuola
        </label>
        <label className={toggleClass}>
          <input
            type="checkbox"
            checked={settings.includePreviousYearColumn}
            onChange={(event) => update("includePreviousYearColumn", event.target.checked)}
          />
          Colonna esercizio precedente
        </label>
        <label className={toggleClass}>
          Arrotondamento
          <select
            value={settings.rounding}
            onChange={(event) => update("rounding", event.target.value as BalanceSettings["rounding"])}
            className="rounded-md border border-line bg-white px-2 py-1 dark:border-stone-700 dark:bg-stone-950"
          >
            <option value="euro">Euro</option>
            <option value="none">Decimali</option>
          </select>
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold">
          Attivo abbreviato
          <select
            value={settings.abbreviatedAssetPresentation}
            onChange={(event) =>
              update(
                "abbreviatedAssetPresentation",
                event.target.value as BalanceSettings["abbreviatedAssetPresentation"]
              )
            }
            className="rounded-lg border border-line bg-white px-3 py-2 font-normal dark:border-stone-700 dark:bg-stone-950"
          >
            <option value="separate">Mostra separatamente A e D</option>
            <option value="includeInReceivables">Comprendi A e D in CII</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Passivo abbreviato
          <select
            value={settings.abbreviatedLiabilityPresentation}
            onChange={(event) =>
              update(
                "abbreviatedLiabilityPresentation",
                event.target.value as BalanceSettings["abbreviatedLiabilityPresentation"]
              )
            }
            className="rounded-lg border border-line bg-white px-3 py-2 font-normal dark:border-stone-700 dark:bg-stone-950"
          >
            <option value="separate">Mostra E separata</option>
            <option value="includeInDebts">Comprendi E in D</option>
          </select>
        </label>
      </div>
    </section>
  );
}
