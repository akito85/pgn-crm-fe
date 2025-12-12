import { Tag } from "antd";

export const createUsageColumns = (renderValue) => [
  { key: "no", title: "NO", width: 60, align: "center", render: (text, object, index) => index + 1 },
  { key: "measDate", title: "MEAS DATE", dataIndex: "measDate", width: 120, align: "center", render: renderValue },
  { key: "assetSerialNum", title: "ASSET SERIAL", dataIndex: "assetSerialNum", width: 130, align: "center", render: renderValue },
  { key: "assetType", title: "ASSET TYPE", dataIndex: "assetType", width: 120, align: "center", render: renderValue },
  { key: "stream", title: "STREAM", dataIndex: "stream", width: 100, align: "center", render: renderValue },
  { key: "temperature", title: "TEMPERATURE", dataIndex: "temperature", width: 120, align: "right", render: renderValue },
  { key: "pressure", title: "PRESSURE", dataIndex: "pressure", width: 120, align: "right", render: renderValue },
  { key: "correctionFactor", title: "CORRECTION FACTOR", dataIndex: "correctionFactor", width: 150, align: "right", render: renderValue },
  { key: "calorie", title: "CALORIE", dataIndex: "calorie", width: 120, align: "right", render: renderValue },
  { key: "beginStand", title: "BEGIN STAND", dataIndex: "beginStand", width: 130, align: "right", render: renderValue },
  { key: "endStand", title: "END STAND", dataIndex: "endStand", width: 130, align: "right", render: renderValue },
  { key: "engMeasured", title: "ENG MEASURED", dataIndex: "engMeasured", width: 150, align: "right", 
    render: (val) => val ? parseFloat(val).toLocaleString("en-US", { maximumFractionDigits: 4 }) : <Tag color="default">-</Tag> },
  { key: "ghv", title: "GHV", dataIndex: "ghv", width: 120, align: "right", render: renderValue },
  { key: "description", title: "DESCRIPTION", dataIndex: "description", width: 200, render: renderValue },
  { key: "taxation", title: "TAXATION", dataIndex: "taxation", width: 100, align: "center", render: renderValue },
  { key: "volMeasured27", title: "VOL MEASURED 27", dataIndex: "volMeasured27", width: 150, align: "right", 
    render: (val) => val ? parseFloat(val).toLocaleString() : <Tag color="default">-</Tag> },
  { key: "volMeasured60", title: "VOL MEASURED 60", dataIndex: "volMeasured60", width: 150, align: "right", 
    render: (val) => val ? parseFloat(val).toLocaleString() : <Tag color="default">-</Tag> },
  { key: "volMscf", title: "VOL MSCF", dataIndex: "volMscf", width: 150, align: "right", 
    render: (val) => val ? parseFloat(val).toLocaleString() : <Tag color="default">-</Tag> },
  { key: "costCenter", title: "COST CENTER", dataIndex: "costCenter", width: 150, align: "center", render: renderValue },
  { key: "usageInitCode", title: "INIT CODE", dataIndex: "usageInitCode", width: 150, align: "center", render: renderValue },
  { key: "energy", title: "ENERGY", dataIndex: "energy", width: 150, align: "right", 
    render: (val) => val ? parseFloat(val).toLocaleString("en-US", { maximumFractionDigits: 4 }) : <Tag color="default">-</Tag> },
  { key: "uncorrectedValue", title: "UNCORRECTED VALUE", dataIndex: "uncorrectedValue", width: 150, align: "right", render: renderValue },
  { key: "ratingCode", title: "RATING CODE", dataIndex: "ratingCode", width: 120, align: "center", render: renderValue },
];

export const createTaxColumns = (renderValue) => [
  { key: "no", title: "NO", width: 60, align: "center", render: (text, object, index) => index + 1 },
  { key: "category", title: "CATEGORY", dataIndex: "category", width: 100, align: "center", render: renderValue },
  { key: "taxImpName", title: "TAX IMP NAME", dataIndex: "taxImpName", width: 300, render: renderValue },
  { key: "serviceType", title: "SERVICE TYPE", dataIndex: "serviceType", width: 120, align: "center", render: renderValue },
  { key: "impType", title: "IMP TYPE", dataIndex: "impType", width: 120, align: "center", render: renderValue },
  { key: "gunggung", title: "GUNGGUNG", dataIndex: "gunggung", width: 100, align: "center", render: renderValue },
  { key: "ratingCode", title: "RATING CODE", dataIndex: "ratingCode", width: 150, render: renderValue },
];

export const createSaPriceRuleColumns = (renderValue) => [
  { key: "no", title: "NO", width: 60, align: "center", render: (text, object, index) => index + 1 },
  { key: "lineNumber", title: "LINE NUMBER", dataIndex: "lineNumber", width: 100, align: "center", render: renderValue },
  { key: "min", title: "MIN", dataIndex: "min", width: 120, align: "right", 
    render: (val) => val ? parseFloat(val).toLocaleString() : <Tag color="default">-</Tag> },
  { key: "max", title: "MAX", dataIndex: "max", width: 120, align: "right", 
    render: (val) => {
      if (!val) return <Tag color="default">-</Tag>;
      if (isNaN(val)) return val;
      if (val === "0" || parseFloat(val) === 0) return "Unlimited";
      return parseFloat(val).toLocaleString();
    }},
  { key: "priceCode", title: "PRICE CODE", dataIndex: "priceCode", width: 150, align: "center", render: renderValue },
  { key: "priceCodeRule", title: "PRICE CODE RULE", dataIndex: "priceCodeRule", width: 200, render: renderValue },
  { key: "value", title: "VALUE", dataIndex: "value", width: 150, align: "right", 
    render: (val) => val ? parseFloat(val).toLocaleString("en-US", { maximumFractionDigits: 4 }) : <Tag color="default">-</Tag> },
  { key: "uom", title: "UOM", dataIndex: "uom", width: 100, align: "center", render: renderValue },
  { key: "priceCurrency", title: "CURRENCY", dataIndex: "priceCurrency", width: 100, align: "center", render: renderValue },
];

export const createSaTosColumns = (renderValue) => [
  { key: "no", title: "NO", width: 60, align: "center", render: (text, object, index) => index + 1 },
  { key: "saTosName", title: "SA TOS NAME", dataIndex: "saTosName", width: 200, render: renderValue },
  { key: "attributeName", title: "ATTRIBUTE NAME", dataIndex: "attributeName", width: 200, render: renderValue },
  { key: "value", title: "VALUE", dataIndex: "value", width: 200, render: renderValue },
];

export const createTosSubmissionColumns = (renderValue) => [
  { key: "no", title: "NO", width: 60, align: "center", render: (text, object, index) => index + 1 },
  { key: "tosName", title: "TOS NAME", dataIndex: "tosName", width: 200, render: renderValue },
  { key: "startDate", title: "START DATE", dataIndex: "startDate", width: 150, align: "center", render: renderValue },
  { key: "endDate", title: "END DATE", dataIndex: "endDate", width: 150, align: "center", render: renderValue },
  { key: "remark", title: "REMARK", dataIndex: "remark", width: 250, render: renderValue },
];

export const createTosSubColumns = (renderValue) => [
  { key: "no", title: "NO", width: 60, align: "center", render: (text, object, index) => index + 1 },
  { key: "tosName", title: "TOS NAME", dataIndex: "tosName", width: 200, render: renderValue },
  { key: "attributeName", title: "ATTRIBUTE NAME", dataIndex: "attributeName", width: 200, render: renderValue },
  { key: "unit", title: "UNIT", dataIndex: "unit", width: 100, align: "center", render: renderValue },
  { key: "value", title: "VALUE", dataIndex: "value", width: 150, render: renderValue },
  { key: "fromItem", title: "FROM ITEM", dataIndex: "fromItem", width: 150, render: renderValue },
];

export const createBillingBucketColumns = (renderValue) => [
  { key: "no", title: "NO", width: 60, align: "center", render: (text, object, index) => index + 1 },
  { key: "bucketCode", title: "BUCKET CODE", dataIndex: "bucketCode", width: 150, align: "center", render: renderValue },
  { key: "bucketName", title: "BUCKET NAME", dataIndex: "bucketName", width: 200, render: renderValue },
  { key: "bucketPriority", title: "BUCKET PRIORITY", dataIndex: "bucketPriority", width: 150, align: "center", render: renderValue },
  { key: "validStartDate", title: "VALID START DATE", dataIndex: "validStartDate", width: 150, align: "center", render: renderValue },
  { key: "validEndDate", title: "VALID END DATE", dataIndex: "validEndDate", width: 150, align: "center", render: renderValue },
];

export const createBillingItemColumns = (renderValue) => [
  { key: "no", title: "NO", width: 60, align: "center", render: (text, object, index) => index + 1 },
  { key: "bucketCode", title: "BUCKET CODE", dataIndex: "bucketCode", width: 120, align: "center", render: renderValue },
  { key: "bucketName", title: "BUCKET NAME", dataIndex: "bucketName", width: 150, render: renderValue },
  { key: "itemCode", title: "ITEM CODE", dataIndex: "itemCode", width: 120, align: "center", render: renderValue },
  { key: "itemName", title: "ITEM NAME", dataIndex: "itemName", width: 200, render: renderValue },
  { key: "billingType", title: "BILLING TYPE", dataIndex: "billingType", width: 120, align: "center", render: renderValue },
  { key: "itemCategory", title: "ITEM CATEGORY", dataIndex: "itemCategory", width: 150, align: "center", render: renderValue },
  { key: "isLateCharge", title: "IS LATE CHARGE", dataIndex: "isLateCharge", width: 120, align: "center", render: renderValue },
  { key: "sequence", title: "SEQUENCE", dataIndex: "sequence", width: 100, align: "center", render: renderValue },
  { key: "currencyId", title: "CURRENCY ID", dataIndex: "currencyId", width: 120, align: "center", render: renderValue },
  { key: "itemPriority", title: "ITEM PRIORITY", dataIndex: "itemPriority", width: 120, align: "center", render: renderValue },
];

export const createSaPrcRuleDetColumns = (renderValue) => [
  { key: "no", title: "NO", width: 60, align: "center", render: (text, object, index) => index + 1 },
  { key: "currencyCode", title: "CURRENCY CODE", dataIndex: "currencyCode", width: 120, align: "center", render: renderValue },
  { key: "fullPriceCode", title: "FULL PRICE CODE", dataIndex: "fullPriceCode", width: 300, render: renderValue },
  { key: "uomName", title: "UOM NAME", dataIndex: "uomName", width: 120, align: "center", render: renderValue },
  { key: "priceValue", title: "PRICE VALUE", dataIndex: "priceValue", width: 150, align: "right", 
    render: (val) => val ? parseFloat(val).toLocaleString("en-US", { maximumFractionDigits: 2 }) : <Tag color="default">-</Tag> },
  { key: "lateChargeVal", title: "LATE CHARGE VALUE", dataIndex: "lateChargeVal", width: 200, render: renderValue },
];