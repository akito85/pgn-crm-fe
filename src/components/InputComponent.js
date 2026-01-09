import { Input } from "antd";
import InputLabel from "./InputLabel";
import { NumericFormat } from "react-number-format";

const InputComponent = ({
  label,
  mandatory,
  onChange = () => {},
  type,
  typeNumber,
  maxLength = 255,
  value,
  placeholder,
  suffix,
  prefix,
  group,
  disabled,
  rows,
  styleGroup,
  onClick = () => {},
  onInput = (e) => (e.target.value = e.target.value.trimStart()),
  thousandSeparator = ".",
  decimalSeparator = ",",
  decimalScale = 2,
  fixedDecimalScale,
  allowNegative = false,
  numericFormatType,
  ref,
  onPressEnter = () => {},
  isPassingId = false, // Declaratively pass the ID prop to the component's root element
  id,
}) => {
  const style = {
    borderRadius: "6px",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    padding: "4px 12px",
  };

  const styleTextarea = {
    borderRadius: "6px",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    padding: "0px",
  };

  const styleNumeric = {
    borderRadius: "6px",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    padding: "4px 12px",
    border: "1px solid  #d9d9d9",
    height: "32px",
  };

  const styleNumericDisabled = {
    borderRadius: "6px",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    backgroundColor: "#f5f5f5",
    color: "rgba(0,0,0,.25)",
    padding: "4px 12px",
    border: "1px solid  #d9d9d9",
    height: "32px",
  };

  const wrapper = "flex flex-col w-auto";

  return (
    <div className={wrapper} id={isPassingId ? id : false}>
      {!group && <InputLabel text={label} mandatory={mandatory}></InputLabel>}
      {type === "textarea" ? (
        <>
          <Input.TextArea
            rows={rows || 3}
            style={styleTextarea}
            onChange={onChange}
            value={value}
            maxLength={255}
            placeholder={placeholder}
            allowClear
            disabled={disabled}
            onInput={onInput}
          />
          <span className="text-xs mt-1 text-[#92979D]">
            You have{" "}
            {value === undefined || value === null ? 255 : 255 - value?.length}{" "}
            of 255 characters remaining
          </span>
        </>
      ) : type === "numeric" ? (
        <NumericFormat
          allowNegative={allowNegative}
          value={value}
          decimalScale={decimalScale}
          fixedDecimalScale={fixedDecimalScale}
          prefix={prefix}
          suffix={suffix}
          thousandsGroupStyle={"thousand"}
          thousandSeparator={thousandSeparator}
          decimalSeparator={decimalSeparator}
          className={"text-right custom-focus"}
          style={disabled === true ? styleNumericDisabled : styleNumeric}
          onValueChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          type={numericFormatType}
        ></NumericFormat>
      ) : type === "number" ? (
        <NumericFormat
          allowNegative={false}
          value={value}
          // decimalScale={2}
          prefix={prefix}
          suffix={suffix}
          className="text-right custom-focus"
          // fixedDecimalScale={true}
          style={disabled === true ? styleNumericDisabled : styleNumeric}
          onInput={onInput}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        ></NumericFormat>
      ) : (
        <Input
          type={typeNumber}
          className={"text-right"}
          style={style || styleGroup}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          prefix={prefix}
          suffix={suffix}
          disabled={disabled}
          onClick={onClick}
          allowClear
          maxLength={maxLength}
          onInput={onInput}
          // addonBefore={ }
          ref={ref}
          onPressEnter={onPressEnter}
        />
      )}
    </div>
  );
};

export default InputComponent;
