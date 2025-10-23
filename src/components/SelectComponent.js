import { Select } from "antd";
import React from "react";
import InputLabel from "./InputLabel";

const SelectComponent = ({
  label,
  mandatory,
  onChange = () => { },
  value,
  children,
  options,
  placeholder,
  mode,
  tagRender,
  defaultValue,
  allowClear = true,
  disabled,
  width,
  labelInValue = false,
  onSelect = () => { },
  onDeselect = () => { },
  onClear = () => { },
  onPopupScroll = () => { }
}) => {
  const wrapper = "flex flex-col";
  const style = {
    width: width || "auto",
    borderRadius: "6px",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  };

  const filterOption = (input, option) => {
    // console.log(input, option);
    if (options) {
      return option?.label?.toLowerCase()?.includes(input?.toLowerCase());
    } else if (Array?.isArray(option?.children)) {
      return option?.children?.join(' ')?.toLowerCase()?.includes(input?.toLowerCase())
    }
    return option?.props?.children
      ?.toLowerCase()
      ?.includes(input?.toLowerCase());
  };

  return (
    <div className={wrapper}>
      <InputLabel text={label} mandatory={mandatory}></InputLabel>
      <Select
        onPopupScroll={onPopupScroll}
        showSearch
        optionFilterProp="children"
        filterOption={filterOption}
        labelInValue={labelInValue}
        value={value ? value : undefined}
        style={style}
        placeholder={placeholder}
        onChange={onChange}
        mode={mode}
        tagRender={tagRender}
        disabled={disabled}
        allowClear={allowClear}
        defaultValue={defaultValue}
        options={options}
        maxTagCount={mode === "multiple" ? "responsive" : undefined}
        onSelect={onSelect}
        onDeselect={onDeselect}
        onClear={onClear}
      >
        {children}
      </Select>
    </div>
  );
};

export default SelectComponent;
