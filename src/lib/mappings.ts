import type {
  AccountInput,
  AccountNature,
  FiscalYearData,
  Money,
  StatementRow
} from "../types/accounting";

export const codeMatches = (actualCode: string | undefined, requestedCode: string): boolean => {
  if (!actualCode) {
    return false;
  }

  return actualCode === requestedCode || actualCode.startsWith(`${requestedCode}.`);
};

export const sumByCivilCode = (
  data: FiscalYearData,
  requestedCode: string,
  natures?: AccountNature[]
): Money =>
  data.accounts
    .filter((account) => codeMatches(account.civilCodeCode, requestedCode))
    .filter((account) => !natures || natures.includes(account.nature))
    .reduce((total, account) => total + account.amount, 0);

export const sumByCivilCodes = (
  data: FiscalYearData,
  codes: string[],
  natures?: AccountNature[]
): Money => codes.reduce((total, code) => total + sumByCivilCode(data, code, natures), 0);

export const sumByReclassifiedCode = (
  data: FiscalYearData,
  requestedCode: string,
  natures?: AccountNature[]
): Money =>
  data.accounts
    .filter((account) => codeMatches(account.reclassifiedCode, requestedCode))
    .filter((account) => !natures || natures.includes(account.nature))
    .reduce((total, account) => total + account.amount, 0);

export const getAccountsByCivilCode = (
  data: FiscalYearData,
  requestedCode: string
): AccountInput[] =>
  data.accounts.filter((account) => codeMatches(account.civilCodeCode, requestedCode));

export const keepStatementRow = (
  row: StatementRow,
  showZeroRows: boolean,
  alwaysKeepComputed = true
): boolean => {
  if (showZeroRows) {
    return true;
  }

  if (row.type === "line") {
    return row.amount !== 0;
  }

  if (alwaysKeepComputed) {
    return true;
  }

  return row.amount !== 0;
};

export const findUnmappedAccounts = (data: FiscalYearData): AccountInput[] =>
  data.accounts.filter((account) => !account.civilCodeCode || !account.reclassifiedCode);

export const hasDueInformation = (account: AccountInput): boolean =>
  Boolean(account.dueWithin12Months || account.dueBeyond12Months);

export const accountNeedsDueInformation = (account: AccountInput): boolean =>
  codeMatches(account.civilCodeCode, "SP.A.C.II") ||
  codeMatches(account.civilCodeCode, "SP.P.D");
