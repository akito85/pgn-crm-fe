import { DatePicker } from "antd";
import React from "react";
import InputLabel from "./InputLabel";
import moment from "moment/moment";
const DateComponent = ({
  picker,
  label,
  onChange = () => {},
  mandatory,
  value,
  dateDisable,
  disabled = false,
  placeholder,
  defaultPickerValue,
  key
}) => {
  const wrapper = "flex flex-col";
  const style = {
    borderRadius: "6px",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    padding: "4px 12px",
  };

  // eslint-disable-next-line arrow-body-style
  const disabledDate = (current) => {
    // Can not select days before today and today
    if (dateDisable) {
      return dateDisable(current);
    }
    return moment().add(-1, "days") >= current;
  };

  return (
    <div className={wrapper}>
      <InputLabel text={label} mandatory={mandatory}></InputLabel>
      <DatePicker
        key={key}
        onChange={onChange}
        picker={picker}
        value={value}
        disabledDate={disabledDate}
        disabled={disabled}
        style={style}
        placeholder={placeholder}
        allowClear
        format={"DD MMM YYYY"}
        defaultPickerValue={defaultPickerValue}
      />
    </div>
  );
};

export default DateComponent;
