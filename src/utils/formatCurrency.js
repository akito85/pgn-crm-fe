import { NumericFormat } from "react-number-format";
import { useSelector } from "react-redux";

// ✅ Helper function untuk get config
const useFormatConfig = () => {
  return useSelector((state) => state.globalProp.globalProp);
};

// ✅ Component wrapper untuk currency formatting
export const CurrencyFormatting = ({ value, type }) => {
  const config = useFormatConfig();

  switch (type) {
    case "idr":
      return (
        <NumericFormat
          value={value || 0}
          displayType="text"
          decimalScale={config.DECIMAL_SCALE_IDR ?? 0}
          fixedDecimalScale={config.FIXED_DECIMAL_SCALE_IDR ?? false}
          thousandsGroupStyle={config.THOUSAND_GROUP_STYLE_IDR ?? "thousand"}
          thousandSeparator={config.THOUSAND_SEPARATOR_IDR ?? ","}
          decimalSeparator={config.DECIMAL_SEPARATOR_IDR ?? "."}
        />
      );
    case "usd":
      return (
        <NumericFormat
          value={value || 0}
          displayType="text"
          decimalScale={config.DECIMAL_SCALE_USD ?? 2}
          fixedDecimalScale={config.FIXED_DECIMAL_SCALE_USD ?? true}
          thousandsGroupStyle={config.THOUSAND_GROUP_STYLE_USD ?? "thousand"}
          thousandSeparator={config.THOUSAND_SEPARATOR_USD ?? ","}
          decimalSeparator={config.DECIMAL_SEPARATOR_USD ?? "."}
        />
      );
    default:
      return value;
  }
};

// ✅ Untuk backward compatibility (function style)
export const currencyFormatting = (value, type) => {
  return <CurrencyFormatting value={value} type={type} />;
};

// ✅ Number formatting
export const NumberFormatting = ({ value }) => {
  const config = useFormatConfig();
  
  return (
    <NumericFormat 
      value={value} 
      displayType="text" 
      thousandSeparator={config.THOUSAND_SEPARATOR_IDR ?? ","} 
    />
  );
};

export const numberFormatting = (value) => {
  return <NumberFormatting value={value} />;
};

// ✅ Usage formatting
export const UsageFormatting = ({ value }) => {
  const config = useFormatConfig();
  
  return (
    <NumericFormat
      value={value || 0}
      displayType="text"
      decimalScale={config.DECIMAL_SCALE_USAGE ?? 7}
      fixedDecimalScale={config.FIXED_DECIMAL_SCALE_USAGE ?? true}
      thousandsGroupStyle={config.THOUSAND_GROUP_STYLE_USAGE ?? "thousand"}
      thousandSeparator={config.THOUSAND_SEPARATOR_USAGE ?? ","}
      decimalSeparator={config.DECIMAL_SEPARATOR_USAGE ?? "."}
    />
  );
};

export const usageFormatting = (value) => {
  return <UsageFormatting value={value} />;
};