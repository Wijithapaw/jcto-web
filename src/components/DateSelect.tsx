import React from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

interface Props {
  value?: Date;
  onChange: (value: Date) => void;
  placeHolder?: string;
  isClearable?: boolean;
  disabled?: boolean;
}

export default function DateSelect({ value, onChange, placeHolder, isClearable, disabled }: Props) {
  return <DatePicker selected={value}
    disabled={disabled}
    placeholderText={placeHolder}
    className="form-control"
    dateFormat="yyyy-MM-dd"
    dropdownMode="select"
    showMonthDropdown
    showYearDropdown
    useShortMonthInDropdown
    isClearable={isClearable}
    onChange={onChange} />
}
