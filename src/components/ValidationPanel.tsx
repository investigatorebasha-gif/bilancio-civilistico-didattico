import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { validateProfessionalReadiness } from "../lib/professionalChecks";
import { validateProject } from "../lib/validators";
import type { FiscalYearData, ValidationIssue } from "../types/accounting";
import { formatSignedCurrency } from "../lib/formatters";

type ValidationPanelProps = {
  data: FiscalYearData;
};

const severityStyles: Record<ValidationIssue["severity"], string> = {
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
  warning:
    "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100",
  error:
    "border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100"
};

const icons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle
};

export function ValidationPanel({ data }: ValidationPanelProps) {
  const issues = validateProject(data);
  const professionalIssues = validateProfessionalReadiness(data);
  const allIssues = [...issues, ...professionalIssues];
  const errors = allIssues.filter((issue) => issue.severity === "error").length;
  const warnings = allIssues.filter((issue) => issue.severity === "warning").length;

  return (
    <section className="grid gap-4 rounded-lg border border-line bg-white p-4 shadow-soft dark:border-stone-800 dark:bg-stone-900">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-base font-bold">Controlli</h2>
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Verde corretto, giallo attenzione, rosso errore bloccante.
          </p>
        </div>
        <div className="flex gap-2 text-sm font-bold">
          <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-800 dark:bg-rose-950 dark:text-rose-100">
            Errori {errors}
          </span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-900 dark:bg-amber-950 dark:text-amber-100">
            Avvisi {warnings}
          </span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {allIssues.map((issue) => {
          const Icon = icons[issue.severity];
          return (
            <article
              key={issue.id}
              className={`rounded-lg border p-3 ${severityStyles[issue.severity]}`}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
                <div>
                  <h3 className="font-bold">{issue.label}</h3>
                  <p className="text-sm">{issue.message}</p>
                  {issue.amount !== undefined && issue.amount !== 0 && (
                    <p className="mt-1 text-sm font-bold">
                      Differenza: {formatSignedCurrency(issue.amount, data.currency, data.settings.rounding)}
                    </p>
                  )}
                  {issue.suggestions && issue.suggestions.length > 0 && (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                      {issue.suggestions.map((suggestion) => (
                        <li key={suggestion}>{suggestion}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
