import { DataInput } from "../components/DataInput";
import type { FiscalYearData } from "../types/accounting";

type WizardProps = {
  data: FiscalYearData;
  onChange: (data: FiscalYearData) => void;
  onLoadSample: () => void;
  onShowResults: () => void;
};

export function Wizard({ data, onChange, onLoadSample, onShowResults }: WizardProps) {
  return (
    <DataInput
      data={data}
      onChange={onChange}
      onLoadSample={onLoadSample}
      onShowResults={onShowResults}
    />
  );
}
