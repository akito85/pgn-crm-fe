import { NumericFormat } from "react-number-format";

export const currencyFormatting = (value, type) => {
  switch (type) {
    case "idr":
      return (
        <NumericFormat
          value={value || 0}
          displayType="text"
          decimalScale={2}
          fixedDecimalScale={true}
          thousandsGroupStyle={"thousand"}
          thousandSeparator={","}
          decimalSeparator={"."}
        />
      );
    case "usd":
      return (
        <NumericFormat
          value={value || 0}
          displayType="text"
          decimalScale={2}
          fixedDecimalScale={true}
          thousandsGroupStyle={"thousand"}
          thousandSeparator={","}
          decimalSeparator={"."}
        />
      );
    default:
      break;
  }
};

export const numberFormatting = (value) => {
  return (
    <NumericFormat value={value} displayType="text" thousandSeparator={","} />
  );
};
