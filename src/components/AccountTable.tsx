import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { accountTemplates } from "../data/accountTemplates";
import {
  accountNatureLabels,
  civilCodeOptions,
  reclassifiedOptions
} from "../data/civilisticSchemas";
import type { AccountInput, AccountNature } from "../types/accounting";

type AccountTableProps = {
  accounts: AccountInput[];
  onChange: (accounts: AccountInput[]) => void;
};

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `account-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const inputClass =
  "w-full rounded-md border border-line bg-white px-2 py-2 text-sm dark:border-stone-700 dark:bg-stone-950";

export function AccountTable({ accounts, onChange }: AccountTableProps) {
  const [templateIndex, setTemplateIndex] = useState("");

  const totals = useMemo(
    () =>
      accounts.reduce(
        (summary, account) => {
          summary[account.nature] += account.amount;
          return summary;
        },
        {
          asset: 0,
          liability: 0,
          equity: 0,
          revenue: 0,
          cost: 0
        } satisfies Record<AccountNature, number>
      ),
    [accounts]
  );

  const updateAccount = <K extends keyof AccountInput>(
    id: string,
    key: K,
    value: AccountInput[K]
  ) => {
    onChange(accounts.map((account) => (account.id === id ? { ...account, [key]: value } : account)));
  };

  const addBlankAccount = () => {
    onChange([
      ...accounts,
      {
        id: makeId(),
        name: "",
        amount: 0,
        nature: "asset",
        civilCodeCode: "SP.A.C.IV",
        reclassifiedCode: "RF.AC.LI"
      }
    ]);
  };

  const addTemplate = () => {
    const template = accountTemplates[Number(templateIndex)];
    if (!template) {
      return;
    }

    onChange([
      ...accounts,
      {
        id: makeId(),
        name: template.label,
        amount: 0,
        nature: template.nature,
        civilCodeCode: template.civilCodeCode,
        reclassifiedCode: template.reclassifiedCode,
        dueWithin12Months: template.dueWithin12Months,
        dueBeyond12Months: template.dueBeyond12Months
      }
    ]);
    setTemplateIndex("");
  };

  const removeAccount = (id: string) => {
    onChange(accounts.filter((account) => account.id !== id));
  };

  return (
    <section className="grid gap-4 rounded-lg border border-line bg-white p-4 shadow-soft dark:border-stone-800 dark:bg-stone-900">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-base font-bold">Voci contabili</h2>
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Inserisci importi positivi per costi, ricavi, attivo, passivo e patrimonio netto.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={templateIndex}
            onChange={(event) => setTemplateIndex(event.target.value)}
            className="rounded-lg border border-line bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-950"
          >
            <option value="">Scegli modello conto</option>
            {accountTemplates.map((template, index) => (
              <option key={template.label} value={index}>
                {template.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addTemplate}
            disabled={templateIndex === ""}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-mint px-3 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            <Plus size={16} aria-hidden="true" />
            Aggiungi modello
          </button>
          <button
            type="button"
            onClick={addBlankAccount}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold text-stone-700 hover:border-mint dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
          >
            <Plus size={16} aria-hidden="true" />
            Nuova voce
          </button>
        </div>
      </div>

      <div className="grid gap-2 text-sm sm:grid-cols-5">
        {Object.entries(totals).map(([nature, amount]) => (
          <div
            key={nature}
            className="rounded-lg border border-line bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-950"
          >
            <div className="font-semibold">{accountNatureLabels[nature as AccountNature]}</div>
            <div className="table-number font-bold">{amount.toLocaleString("it-IT")}</div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1180px] w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-stone-500 dark:border-stone-800 dark:text-stone-400">
              <th className="p-2">Conto inserito</th>
              <th className="p-2 text-right">Importo</th>
              <th className="p-2">Natura</th>
              <th className="p-2">Voce civilistica proposta</th>
              <th className="p-2">Voce riclassificata proposta</th>
              <th className="p-2 text-center">Entro 12 mesi</th>
              <th className="p-2 text-center">Oltre 12 mesi</th>
              <th className="p-2">Note</th>
              <th className="p-2 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id} className="border-b border-line align-top dark:border-stone-800">
                <td className="p-2">
                  <input
                    value={account.name}
                    onChange={(event) => updateAccount(account.id, "name", event.target.value)}
                    className={inputClass}
                    placeholder="Es. Crediti v/clienti"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={account.amount}
                    onChange={(event) =>
                      updateAccount(account.id, "amount", Number(event.target.value))
                    }
                    className={`${inputClass} table-number`}
                  />
                </td>
                <td className="p-2">
                  <select
                    value={account.nature}
                    onChange={(event) =>
                      updateAccount(account.id, "nature", event.target.value as AccountNature)
                    }
                    className={inputClass}
                  >
                    {Object.entries(accountNatureLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <select
                    value={account.civilCodeCode ?? ""}
                    onChange={(event) =>
                      updateAccount(account.id, "civilCodeCode", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Non mappata</option>
                    {civilCodeOptions.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.code} · {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <select
                    value={account.reclassifiedCode ?? ""}
                    onChange={(event) =>
                      updateAccount(account.id, "reclassifiedCode", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Non mappata</option>
                    {reclassifiedOptions.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.code} · {option.label}
                      </option>
                    ))}
                    <option value="CE.VA.RICAVI">CE.VA.RICAVI · Ricavi valore aggiunto</option>
                    <option value="CE.VA.ESTERNI">CE.VA.ESTERNI · Costi esterni</option>
                    <option value="CE.VA.PERSONALE">CE.VA.PERSONALE · Personale</option>
                    <option value="CE.VA.AMMORTAMENTI">CE.VA.AMMORTAMENTI · Ammortamenti</option>
                    <option value="CE.VA.ACCANTONAMENTI">CE.VA.ACCANTONAMENTI · Accantonamenti</option>
                    <option value="CE.VA.FINANZIARIA">CE.VA.FINANZIARIA · Gestione finanziaria</option>
                    <option value="CE.VA.IMPOSTE">CE.VA.IMPOSTE · Imposte</option>
                  </select>
                </td>
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={Boolean(account.dueWithin12Months)}
                    onChange={(event) =>
                      updateAccount(account.id, "dueWithin12Months", event.target.checked)
                    }
                    aria-label="Scadenza entro 12 mesi"
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={Boolean(account.dueBeyond12Months)}
                    onChange={(event) =>
                      updateAccount(account.id, "dueBeyond12Months", event.target.checked)
                    }
                    aria-label="Scadenza oltre 12 mesi"
                  />
                </td>
                <td className="p-2">
                  <input
                    value={account.notes ?? ""}
                    onChange={(event) => updateAccount(account.id, "notes", event.target.value)}
                    className={inputClass}
                    placeholder="Nota opzionale"
                  />
                </td>
                <td className="p-2 text-right">
                  <button
                    type="button"
                    onClick={() => removeAccount(account.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950"
                    aria-label={`Rimuovi ${account.name || "voce"}`}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {accounts.length === 0 && (
        <div className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-stone-600 dark:border-stone-700 dark:text-stone-300">
          Nessuna voce inserita. Usa un modello conto o crea una voce manuale.
        </div>
      )}
    </section>
  );
}
