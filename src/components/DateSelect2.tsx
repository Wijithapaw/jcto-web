import { dateHelpers } from "../app/helpers";
import DateSelect from "./DateSelect";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  placeHolder?: string;
  isClearable?: boolean;
  disabled?: boolean;
  timeSelect?: boolean;
}

export default function DateSelect2({ value, onChange, placeHolder, isClearable, disabled, timeSelect }: Props) {
  return <DateSelect
    disabled={disabled}
    value={dateHelpers.strToDate(value)}
    isClearable={isClearable}
    onChange={(d) => onChange && onChange(dateHelpers.toIsoString(d))}
    timeSelect={timeSelect}
    placeHolder={placeHolder} />
}
