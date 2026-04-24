import { NumericFormat } from "react-number-format";
import { useSelector } from "react-redux";

// ngambil state dari data yang di dispatch di layoutMenu
const useFormatConfig = () => {
  return useSelector((state) => state.globalProp.globalProp);
};

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

export const currencyFormatting = (value, type) => {
  return <CurrencyFormatting value={value} type={type} />;
};

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


// Temperatur - 2 desimal
export const TemperaturFormatting = ({ value }) => {
  const config = useFormatConfig();
  return (
    <NumericFormat
      value={value || 0}
      displayType="text"
      decimalScale={config.DECIMAL_SCALE_TEMPERATUR ?? 2}
      fixedDecimalScale={config.FIXED_DECIMAL_SCALE_TEMPERATUR ?? true}
      thousandsGroupStyle={config.THOUSAND_GROUP_STYLE_TEMPERATUR ?? "thousand"}
      thousandSeparator={config.THOUSAND_SEPARATOR_TEMPERATUR ?? ","}
      decimalSeparator={config.DECIMAL_SEPARATOR_TEMPERATUR ?? "."}
    />
  );
};
export const temperaturFormatting = (value) => <TemperaturFormatting value={value} />;

// Tekanan - 2 desimal
export const TekananFormatting = ({ value }) => {
  const config = useFormatConfig();
  return (
    <NumericFormat
      value={value || 0}
      displayType="text"
      decimalScale={config.DECIMAL_SCALE_TEKANAN ?? 2}
      fixedDecimalScale={config.FIXED_DECIMAL_SCALE_TEKANAN ?? true}
      thousandsGroupStyle={config.THOUSAND_GROUP_STYLE_TEKANAN ?? "thousand"}
      thousandSeparator={config.THOUSAND_SEPARATOR_TEKANAN ?? ","}
      decimalSeparator={config.DECIMAL_SEPARATOR_TEKANAN ?? "."}
    />
  );
};
export const tekananFormatting = (value) => <TekananFormatting value={value} />;

// Volume - 2 desimal
export const VolumeFormatting = ({ value }) => {
  const config = useFormatConfig();
  return (
    <NumericFormat
      value={value || 0}
      displayType="text"
      decimalScale={config.DECIMAL_SCALE_VOLUME ?? 2}
      fixedDecimalScale={config.FIXED_DECIMAL_SCALE_VOLUME ?? true}
      thousandsGroupStyle={config.THOUSAND_GROUP_STYLE_VOLUME ?? "thousand"}
      thousandSeparator={config.THOUSAND_SEPARATOR_VOLUME ?? ","}
      decimalSeparator={config.DECIMAL_SEPARATOR_VOLUME ?? "."}
    />
  );
};
export const volumeFormatting = (value) => <VolumeFormatting value={value} />;

// GHV - 4 desimal
export const GhvFormatting = ({ value }) => {
  const config = useFormatConfig();
  return (
    <NumericFormat
      value={value || 0}
      displayType="text"
      decimalScale={config.DECIMAL_SCALE_GHV ?? 4}
      fixedDecimalScale={config.FIXED_DECIMAL_SCALE_GHV ?? true}
      thousandsGroupStyle={config.THOUSAND_GROUP_STYLE_GHV ?? "thousand"}
      thousandSeparator={config.THOUSAND_SEPARATOR_GHV ?? ","}
      decimalSeparator={config.DECIMAL_SEPARATOR_GHV ?? "."}
    />
  );
};
export const ghvFormatting = (value) => <GhvFormatting value={value} />;

// Energi - 4 desimal
export const EnergiFormatting = ({ value }) => {
  const config = useFormatConfig();
  return (
    <NumericFormat
      value={value || 0}
      displayType="text"
      decimalScale={config.DECIMAL_SCALE_ENERGI ?? 4}
      fixedDecimalScale={config.FIXED_DECIMAL_SCALE_ENERGI ?? true}
      thousandsGroupStyle={config.THOUSAND_GROUP_STYLE_ENERGI ?? "thousand"}
      thousandSeparator={config.THOUSAND_SEPARATOR_ENERGI ?? ","}
      decimalSeparator={config.DECIMAL_SEPARATOR_ENERGI ?? "."}
    />
  );
};
export const energiFormatting = (value) => <EnergiFormatting value={value} />;