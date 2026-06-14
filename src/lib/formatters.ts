import type { Money, RoundingMode } from "../types/accounting";

export const roundMoney = (value: Money, rounding: RoundingMode = "none"): Money => {
  if (rounding === "euro") {
    return Math.round(value);
  }

  return Math.round((value + Number.EPSILON) * 100) / 100;
};

export const formatCurrency = (
  value: Money,
  currency: "EUR" = "EUR",
  rounding: RoundingMode = "euro"
): string => {
  const maximumFractionDigits = rounding === "euro" ? 0 : 2;

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
    minimumFractionDigits: maximumFractionDigits,
    maximumFractionDigits
  }).format(roundMoney(value, rounding));
};

export const formatSignedCurrency = (
  value: Money,
  currency: "EUR" = "EUR",
  rounding: RoundingMode = "euro"
): string => {
  if (value === 0) {
    return formatCurrency(0, currency, rounding);
  }

  const prefix = value > 0 ? "+" : "-";
  return `${prefix} ${formatCurrency(Math.abs(value), currency, rounding)}`;
};

export const parseNumberInput = (value: string): number => {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};
