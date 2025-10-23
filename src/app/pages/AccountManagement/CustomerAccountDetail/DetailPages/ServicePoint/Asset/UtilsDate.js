import { DatePicker } from "antd";
import React from "react";
import moment from "moment/moment";

const UtilsDate = (props) => {
  const {
    picker,
    label,
    onChange = () => {},
    mandatory,
    value,
    format = "DD MMM YYYY",
    disabled = false,
    placeholder,
    disabledBeforeToday = false,
  } = props;
  const wrapper = "flex flex-col";
  const style = {
    borderRadius: "6px",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    padding: "4px 12px",
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return moment().add(-1, "days") >= current
  };

  return (
    <div className={wrapper}>
      <DatePicker
        onChange={onChange}
        picker={picker}
        value={value}
        disabled={disabled}
        disabledDate={disabledBeforeToday ? disabledDate : null}
        style={style}
        placeholder={placeholder}
        allowClear
        format={format}
      />
    </div>
  );
};

export default UtilsDate;
