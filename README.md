# Bilancio civilistico didattico

Sito web didattico per studenti di economia aziendale italiani. A partire da dati inseriti
dall'utente genera:

- stato patrimoniale civilistico in forma ordinaria;
- conto economico civilistico in forma ordinaria;
- stato patrimoniale in forma abbreviata;
- conto economico in forma abbreviata;
- stato patrimoniale riclassificato secondo il criterio finanziario;
- conto economico riclassificato a valore aggiunto;
- controlli finali, avvisi, totali, subtotali ed esportazioni.
- importazione da testo libero: l'utente incolla l'esercizio o l'elenco conti e
  l'app propone voci, importi, natura e mappature.

Nota: lo strumento e didattico e non sostituisce commercialista, revisore o consulente
fiscale.

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- localStorage per salvataggio locale
- Vitest per funzioni contabili
- ESLint + Prettier
- GitHub Actions + GitHub Pages

## Installazione

```bash
npm install
```

## Avvio locale

```bash
npm run dev
```

## Test

```bash
npm run test
```

I test coprono quadratura dello stato patrimoniale, conto economico, utile in patrimonio
netto, requisiti del bilancio abbreviato, riclassificato finanziario, export JSON e voci
non mappate.

## Build

```bash
npm run build
```

## Pubblicazione su GitHub Pages

Il workflow `.github/workflows/deploy.yml` esegue installazione, test, build e pubblicazione
su GitHub Pages.

In `vite.config.ts` il valore `base` viene calcolato automaticamente in GitHub Actions da
`GITHUB_REPOSITORY`. Per sovrascriverlo manualmente:

```bash
VITE_BASE_PATH="/nome-repository/" npm run build
```

## Funzioni principali

Le funzioni pure stanno in `src/lib/calculations.ts`:

- `generateOrdinaryBalanceSheet`
- `generateOrdinaryIncomeStatement`
- `generateAbbreviatedBalanceSheet`
- `generateAbbreviatedIncomeStatement`
- `generateFinancialReclassifiedBalanceSheet`
- `generateValueAddedIncomeStatement`

L'importazione da testo libero sta in `src/lib/textImport.ts`:

- riconosce righe con descrizione e importo;
- estrae dati aziendali quando presenti, come azienda, esercizio, totale attivo,
  ricavi e dipendenti medi;
- propone voce civilistica, voce riclassificata, natura e scadenza entro/oltre
  12 mesi tramite regole deterministiche;
- assegna una percentuale di confidenza e una spiegazione leggibile del perche
  ha scelto quella mappatura;
- segnala righe non riconosciute invece di inventare valori.

Le validazioni stanno in `src/lib/validators.ts`:

- quadratura attivo/passivo;
- confronto utile CE e patrimonio netto;
- quadratura impieghi/fonti;
- requisiti forma abbreviata;
- voci non mappate;
- suggerimenti di quadratura quando attivo/passivo o impieghi/fonti non tornano;
- scadenze mancanti per crediti/debiti;
- valori negativi o segni sospetti.

## Esportazioni

L'app supporta copia tabella negli appunti, CSV, JSON dell'output, JSON progetto,
caricamento da JSON e stampa/PDF con `window.print`.
