import { useEffect, useMemo, useState } from "react";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Results } from "./pages/Results";
import { Wizard } from "./pages/Wizard";
import { sampleData } from "./data/sampleData";
import type { FiscalYearData } from "./types/accounting";

type View = "home" | "wizard" | "results";

const STORAGE_KEY = "bilancio-civilistico-didattico-v1";
const THEME_KEY = "bilancio-civilistico-theme";

const cloneData = (data: FiscalYearData): FiscalYearData =>
  JSON.parse(JSON.stringify(data)) as FiscalYearData;

const loadStoredProject = (): FiscalYearData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return cloneData(sampleData);
  }

  try {
    return JSON.parse(stored) as FiscalYearData;
  } catch {
    return cloneData(sampleData);
  }
};

function App() {
  const [view, setView] = useState<View>("home");
  const [project, setProject] = useState<FiscalYearData>(() => loadStoredProject());
  const [isDark, setIsDark] = useState(() => localStorage.getItem(THEME_KEY) === "dark");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }, [project]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  const projectStats = useMemo(
    () => ({
      accounts: project.accounts.length,
      company: project.companyName || "Azienda senza nome",
      year: project.year
    }),
    [project]
  );

  const loadSample = () => {
    setProject(cloneData(sampleData));
    setView("wizard");
  };

  const resetProject = () => {
    setProject({
      ...cloneData(sampleData),
      companyName: "",
      legalForm: "",
      accounts: [],
      thresholds: {},
      previousYear: undefined
    });
    setView("wizard");
  };

  return (
    <Layout
      currentView={view}
      isDark={isDark}
      onNavigate={setView}
      onToggleTheme={() => setIsDark((value) => !value)}
      stats={projectStats}
    >
      {view === "home" && (
        <Home
          data={project}
          onLoadSample={loadSample}
          onStart={() => setView("wizard")}
          onReset={resetProject}
        />
      )}
      {view === "wizard" && (
        <Wizard
          data={project}
          onChange={setProject}
          onLoadSample={loadSample}
          onShowResults={() => setView("results")}
        />
      )}
      {view === "results" && (
        <Results data={project} onChange={setProject} onEdit={() => setView("wizard")} />
      )}
    </Layout>
  );
}

export default App;
