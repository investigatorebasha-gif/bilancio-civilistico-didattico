import { BarChart3, ClipboardList, Home, Moon, Sun, Table2 } from "lucide-react";
import type { ReactNode } from "react";

type View = "home" | "wizard" | "results";

type LayoutProps = {
  children: ReactNode;
  currentView: View;
  isDark: boolean;
  stats: {
    company: string;
    year: number;
    accounts: number;
  };
  onNavigate: (view: View) => void;
  onToggleTheme: () => void;
};

const navItems: Array<{ view: View; label: string; icon: typeof Home }> = [
  { view: "home", label: "Home", icon: Home },
  { view: "wizard", label: "Inserisci dati", icon: ClipboardList },
  { view: "results", label: "Genera bilancio", icon: Table2 }
];

export function Layout({
  children,
  currentView,
  isDark,
  stats,
  onNavigate,
  onToggleTheme
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-paper text-ink transition-colors dark:bg-stone-950 dark:text-stone-100">
      <header className="no-print sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur dark:border-stone-800 dark:bg-stone-950/95">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mint text-white">
              <BarChart3 size={22} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Bilancio civilistico didattico</h1>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                {stats.company} · esercizio {stats.year} · {stats.accounts} voci
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <nav className="flex rounded-lg border border-line bg-stone-50 p-1 dark:border-stone-800 dark:bg-stone-900">
              {navItems.map(({ view, label, icon: Icon }) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => onNavigate(view)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                    currentView === view
                      ? "bg-white text-mint shadow-sm dark:bg-stone-800"
                      : "text-stone-600 hover:text-ink dark:text-stone-300 dark:hover:text-white"
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                  {label}
                </button>
              ))}
            </nav>
            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-semibold text-stone-700 shadow-sm hover:border-mint dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
            >
              {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
              {isDark ? "Chiara" : "Scura"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">{children}</main>

      <footer className="border-t border-line px-4 py-5 text-sm text-stone-600 dark:border-stone-800 dark:text-stone-300">
        <div className="mx-auto max-w-7xl">
          Strumento didattico per esercitazioni scolastiche: non sostituisce commercialista,
          revisore o consulente fiscale.
        </div>
      </footer>
    </div>
  );
}
