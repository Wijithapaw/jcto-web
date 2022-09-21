import React from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

interface Props {
  value?: Date;
  onChange: (value: Date) => void;
  placeHolder?: string;
  isClearable?: boolean;
  disabled?: boolean;
  timeSelect?: boolean;
}

export default function DateSelect({ value, onChange, placeHolder, isClearable, disabled, timeSelect }: Props) {
  return <DatePicker selected={value}
    disabled={disabled}
    placeholderText={placeHolder}
    className="form-control"
    dateFormat={timeSelect? 'dd/MM/yyyy h:mm aa': 'dd/MM/yyyy'}
    dropdownMode="select"
    showMonthDropdown
    showYearDropdown
    useShortMonthInDropdown
    isClearable={isClearable}
    showTimeSelect={timeSelect}
    onChange={onChange} />    
}
