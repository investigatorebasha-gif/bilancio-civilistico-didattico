export type Money = number;

export type AccountNature = "asset" | "liability" | "equity" | "revenue" | "cost";

export type BalanceMode = "ordinario" | "abbreviato" | "riclassificato";

export type RoundingMode = "none" | "euro";

export type ValidationSeverity = "success" | "warning" | "error";

export type AbbreviatedAssetPresentation = "separate" | "includeInReceivables";

export type AbbreviatedLiabilityPresentation = "separate" | "includeInDebts";

export type BalanceSettings = {
  mode: BalanceMode;
  showZeroRows: boolean;
  schoolMode: boolean;
  includePreviousYearColumn: boolean;
  rounding: RoundingMode;
  abbreviatedAssetPresentation: AbbreviatedAssetPresentation;
  abbreviatedLiabilityPresentation: AbbreviatedLiabilityPresentation;
};

export type ThresholdData = {
  totalAssets?: Money;
  salesRevenue?: Money;
  averageEmployees?: number;
};

export type PreviousYearThresholdData = ThresholdData & {
  year?: number;
};

export type FiscalYearData = {
  year: number;
  companyName: string;
  legalForm?: string;
  currency: "EUR";
  isListed: boolean;
  thresholds: ThresholdData;
  previousYear?: PreviousYearThresholdData;
  accounts: AccountInput[];
  settings: BalanceSettings;
};

export type AccountInput = {
  id: string;
  name: string;
  amount: Money;
  nature: AccountNature;
  civilCodeCode?: string;
  reclassifiedCode?: string;
  dueWithin12Months?: boolean;
  dueBeyond12Months?: boolean;
  notes?: string;
};

export type StatementKind =
  | "ordinary-balance-sheet"
  | "ordinary-income-statement"
  | "abbreviated-balance-sheet"
  | "abbreviated-income-statement"
  | "financial-reclassified-balance-sheet"
  | "value-added-income-statement";

export type StatementRowType =
  | "heading"
  | "section"
  | "line"
  | "subtotal"
  | "total"
  | "calculation";

export type StatementRow = {
  id: string;
  label: string;
  code?: string;
  amount: Money;
  previousAmount?: Money;
  level: number;
  type: StatementRowType;
  notes?: string;
};

export type StatementOutput = {
  id: StatementKind;
  title: string;
  subtitle?: string;
  rows: StatementRow[];
  totals: Record<string, Money>;
  warnings?: string[];
};

export type ValidationIssue = {
  id: string;
  label: string;
  message: string;
  severity: ValidationSeverity;
  amount?: Money;
};

export type AbbreviatedEligibilityStatus = "eligible" | "not_eligible" | "unknown";

export type AbbreviatedEligibilityResult = {
  status: AbbreviatedEligibilityStatus;
  message: string;
  currentExceededLimits: string[];
  previousExceededLimits: string[];
};

export type AccountTemplate = {
  label: string;
  nature: AccountNature;
  civilCodeCode: string;
  reclassifiedCode: string;
  dueWithin12Months?: boolean;
  dueBeyond12Months?: boolean;
};

export type TextImportDetection = {
  companyName?: string;
  year?: number;
  legalForm?: string;
  isListed?: boolean;
  thresholds?: ThresholdData;
};

export type TextImportResult = {
  accounts: AccountInput[];
  detection: TextImportDetection;
  ignoredLines: string[];
  warnings: string[];
};
