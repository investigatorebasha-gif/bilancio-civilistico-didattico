import type {
  AccountInput,
  AccountNature,
  TextImportDetection,
  TextImportResult
} from "../types/accounting";

type MappingRule = {
  keywords: RegExp[];
  nature: AccountNature;
  civilCodeCode: string;
  reclassifiedCode: string;
  dueWithin12Months?: boolean;
  dueBeyond12Months?: boolean;
  note?: string;
};

const incomeRules: MappingRule[] = [
  rule(["ricavi", "vendite|prestazioni"], "revenue", "CE.A.1", "CE.VA.RICAVI"),
  rule(["varia", "rimanenze", "prodott|semilavor|finiti"], "revenue", "CE.A.2", "CE.VA.RICAVI"),
  rule(["lavori in corso"], "revenue", "CE.A.3", "CE.VA.RICAVI"),
  rule(["increment", "immobilizzazioni", "lavori interni"], "revenue", "CE.A.4", "CE.VA.RICAVI"),
  rule(["altri ricavi|proventi"], "revenue", "CE.A.5", "CE.VA.RICAVI"),
  rule(["acquisti|materie c/acquisti|merci c/acquisti|consumo"], "cost", "CE.B.6", "CE.VA.ESTERNI"),
  rule(["servizi"], "cost", "CE.B.7", "CE.VA.ESTERNI"),
  rule(["leasing|canoni|godimento"], "cost", "CE.B.8", "CE.VA.ESTERNI", {
    note: "Leasing/OIC: canoni in B8 con metodo patrimoniale."
  }),
  rule(["personale|salari|stipendi|tfr conto economico"], "cost", "CE.B.9", "CE.VA.PERSONALE"),
  rule(["ammort|svalutazioni produzione"], "cost", "CE.B.10", "CE.VA.AMMORTAMENTI"),
  rule(["varia", "rimanenze", "materie|merci"], "cost", "CE.B.11", "CE.VA.ESTERNI"),
  rule(["accantonamenti", "rischi"], "cost", "CE.B.12", "CE.VA.ACCANTONAMENTI"),
  rule(["altri accantonamenti"], "cost", "CE.B.13", "CE.VA.ACCANTONAMENTI"),
  rule(["oneri diversi"], "cost", "CE.B.14", "CE.VA.ESTERNI"),
  rule(["proventi", "partecipazioni"], "revenue", "CE.C.15", "CE.VA.FINANZIARIA"),
  rule(["proventi finanziari"], "revenue", "CE.C.16", "CE.VA.FINANZIARIA"),
  rule(["interessi passivi|oneri finanziari"], "cost", "CE.C.17", "CE.VA.FINANZIARIA"),
  rule(["cambi"], "revenue", "CE.C.17-bis", "CE.VA.FINANZIARIA"),
  rule(["rivalut"], "revenue", "CE.D.18", "CE.VA.FINANZIARIA"),
  rule(["svalut"], "cost", "CE.D.19", "CE.VA.FINANZIARIA"),
  rule(["imposte|ires|irap"], "cost", "CE.20", "CE.VA.IMPOSTE")
];

const balanceRules: MappingRule[] = [
  rule(["crediti", "soci|versamenti"], "asset", "SP.A.A", "RF.AC.LD", {
    dueWithin12Months: true
  }),
  rule(["immobilizzazioni immateriali|software|marchi|brevetti"], "asset", "SP.A.B.I", "RF.AI.I"),
  rule(["immobilizzazioni materiali|impianti|macchinari|attrezzature|fabbricati"], "asset", "SP.A.B.II", "RF.AI.II"),
  rule(["immobilizzazioni finanziarie|partecipazioni immobilizzate"], "asset", "SP.A.B.III", "RF.AI.III"),
  rule(["rimanenze|magazzino|prodotti finiti|materie prime"], "asset", "SP.A.C.I", "RF.AC.R"),
  rule(["crediti.*oltre|crediti", "oltre 12|oltre l.esercizio"], "asset", "SP.A.C.II", "RF.AI.III", {
    dueBeyond12Months: true
  }),
  rule(["crediti|clienti|cambiali attive"], "asset", "SP.A.C.II", "RF.AC.LD", {
    dueWithin12Months: true
  }),
  rule(["titoli|attivita finanziarie non immobilizzate"], "asset", "SP.A.C.III", "RF.AC.LD"),
  rule(["banca|cassa|liquidita|disponibilita liquide"], "asset", "SP.A.C.IV", "RF.AC.LI"),
  rule(["ratei.*attivi|risconti.*attivi"], "asset", "SP.A.D", "RF.AC.LD", {
    dueWithin12Months: true
  }),
  rule(["capitale sociale|capitale"], "equity", "SP.P.A.I", "RF.CN"),
  rule(["riserva legale"], "equity", "SP.P.A.IV", "RF.CN"),
  rule(["altre riserve|riserve"], "equity", "SP.P.A.VI", "RF.CN"),
  rule(["utili.*nuovo|perdite.*nuovo"], "equity", "SP.P.A.VIII", "RF.CN"),
  rule(["utile.*esercizio|perdita.*esercizio"], "equity", "SP.P.A.IX", "RF.CN"),
  rule(["fondi.*rischi|fondi.*oneri"], "liability", "SP.P.B", "RF.PCONS"),
  rule(["trattamento fine rapporto|\\btfr\\b"], "liability", "SP.P.C", "RF.PCONS"),
  rule(["mutui.*entro|quota mutui|debiti.*entro"], "liability", "SP.P.D", "RF.PC", {
    dueWithin12Months: true
  }),
  rule(["mutui.*oltre|debiti.*oltre|prestiti obbligazionari|obbligazioni"], "liability", "SP.P.D", "RF.PCONS", {
    dueBeyond12Months: true
  }),
  rule(["debiti|fornitori|tributari|banche"], "liability", "SP.P.D", "RF.PC", {
    dueWithin12Months: true
  }),
  rule(["ratei.*passivi|risconti.*passivi"], "liability", "SP.P.E", "RF.PC", {
    dueWithin12Months: true
  })
];

const allRules = [...incomeRules, ...balanceRules];

export const parseAccountingText = (text: string, idPrefix = "text"): TextImportResult => {
  const lines = text
    .split(/\r?\n|;/)
    .map((line) => line.replace(/^[\s\-*•]+/, "").trim())
    .filter(Boolean);
  const detection = detectProjectData(text);
  const accounts: AccountInput[] = [];
  const ignoredLines: string[] = [];
  const warnings: string[] = [];

  lines.forEach((line) => {
    if (isMetadataLine(line)) {
      return;
    }

    const amount = extractAmount(line);
    if (!amount) {
      ignoredLines.push(line);
      return;
    }

    const mapping = findMapping(line);
    if (!mapping) {
      ignoredLines.push(line);
      warnings.push(`Riga non riconosciuta: "${line}"`);
      return;
    }

    accounts.push({
      id: `${idPrefix}-${accounts.length + 1}`,
      name: cleanAccountName(line, amount.raw),
      amount: amount.value,
      nature: mapping.nature,
      civilCodeCode: mapping.civilCodeCode,
      reclassifiedCode: mapping.reclassifiedCode,
      dueWithin12Months: mapping.dueWithin12Months,
      dueBeyond12Months: mapping.dueBeyond12Months,
      notes: mapping.note ? `${mapping.note} Estratta da testo.` : "Estratta da testo."
    });
  });

  if (accounts.length === 0) {
    warnings.push("Nessuna voce contabile riconosciuta: controllare che ogni riga abbia descrizione e importo.");
  }

  return { accounts, detection, ignoredLines, warnings: unique(warnings) };
};

const detectProjectData = (text: string): TextImportDetection => {
  const detection: TextImportDetection = {};
  const companyMatch = text.match(/(?:azienda|societa|società|nome azienda)\s*[:-]\s*([^\n\r]+)/i);
  const yearMatch = text.match(/(?:esercizio|anno)\s*[:-]?\s*(20\d{2}|19\d{2})/i);
  const legalFormMatch = text.match(/\b(s\.?r\.?l\.?|s\.?p\.?a\.?|snc|sas|societa cooperativa)\b/i);
  const listedMatch = text.match(/quotata\s*[:-]?\s*(si|sì|no)/i);

  if (companyMatch?.[1]) {
    detection.companyName = companyMatch[1].trim();
  }
  if (yearMatch?.[1]) {
    detection.year = Number(yearMatch[1]);
  }
  if (legalFormMatch?.[1]) {
    detection.legalForm = legalFormMatch[1].trim();
  }
  if (listedMatch?.[1]) {
    detection.isListed = /^s/i.test(listedMatch[1]);
  }

  const totalAssets = extractLabeledNumber(text, /totale\s+attivo/i);
  const salesRevenue = extractLabeledNumber(text, /ricavi\s+(?:vendite|vendite\/prestazioni|delle vendite)/i);
  const averageEmployees = extractLabeledNumber(text, /dipendenti\s+medi/i);
  if (
    totalAssets !== undefined ||
    salesRevenue !== undefined ||
    averageEmployees !== undefined
  ) {
    detection.thresholds = {
      totalAssets,
      salesRevenue,
      averageEmployees
    };
  }

  return detection;
};

function rule(
  keywordSources: string[],
  nature: AccountNature,
  civilCodeCode: string,
  reclassifiedCode: string,
  options: Partial<MappingRule> = {}
): MappingRule {
  return {
    keywords: keywordSources.map((source) => new RegExp(source, "i")),
    nature,
    civilCodeCode,
    reclassifiedCode,
    dueWithin12Months: options.dueWithin12Months,
    dueBeyond12Months: options.dueBeyond12Months,
    note: options.note
  };
}

const findMapping = (line: string): MappingRule | undefined =>
  allRules.find((mappingRule) => mappingRule.keywords.every((keyword) => keyword.test(line)));

const extractAmount = (line: string): { raw: string; value: number } | undefined => {
  const matches = Array.from(
    line.matchAll(/\(?[-+]?€?\s*\d{1,3}(?:[.\s]\d{3})*(?:,\d{1,2})?\)?|\(?[-+]?€?\s*\d+(?:,\d{1,2})?\)?/g)
  )
    .map((match) => match[0])
    .filter((value) => !(line.match(/\b12\s+mesi\b/i) && /^12$/.test(value.trim())));
  const raw = matches.at(-1);

  if (!raw) {
    return undefined;
  }

  return { raw, value: parseItalianMoney(raw) };
};

const extractLabeledNumber = (text: string, label: RegExp): number | undefined => {
  const line = text
    .split(/\r?\n/)
    .find((candidate) => label.test(candidate) && extractAmount(candidate));
  const amount = line ? extractAmount(line) : undefined;
  return amount?.value;
};

const parseItalianMoney = (raw: string): number => {
  const negativeByParentheses = raw.includes("(") && raw.includes(")");
  const negativeBySign = raw.trim().startsWith("-");
  const cleaned = raw
    .replace(/[€()\s]/g, "")
    .replace(/^\+/, "")
    .replace(/^-/, "");
  const normalized = cleaned.includes(",")
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : cleaned.replace(/\./g, "");
  const parsed = Number(normalized);
  const sign = negativeByParentheses || negativeBySign ? -1 : 1;

  return Number.isFinite(parsed) ? parsed * sign : 0;
};

const cleanAccountName = (line: string, amount: string): string =>
  line
    .replace(amount, "")
    .replace(/[:-=]+$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();

const isMetadataLine = (line: string): boolean =>
  /^(azienda|societa|società|nome azienda|esercizio|anno|forma giuridica|quotata|totale attivo|dipendenti medi)\b/i.test(
    line
  );

const unique = (values: string[]): string[] => Array.from(new Set(values));
