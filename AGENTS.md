# Istruzioni per futuri interventi Codex

- Non cambiare gli schemi civilistici senza aggiungere o aggiornare test.
- Mantieni separata la logica contabile dalla UI: calcoli e validazioni stanno in `src/lib`.
- Ogni nuova formula deve avere test Vitest dedicati.
- Non inventare valori se i dati sono mancanti: mostra avvisi o righe a zero in base alle impostazioni.
- Mantieni lingua italiana per interfaccia, README, messaggi e spiegazioni.
- Le tabelle devono essere generate da dati e funzioni, non duplicate manualmente nei componenti.
- L'importazione da testo libero deve restare deterministica lato client; se aggiungi parole chiave, confidenza o spiegazioni in `src/lib/textImport.ts`, aggiungi test.
- L'assistente di quadratura deve suggerire controlli e cause probabili, non inventare valori di pareggio.
- Prima di consegnare una modifica esegui almeno `npm run test` e `npm run build`.
