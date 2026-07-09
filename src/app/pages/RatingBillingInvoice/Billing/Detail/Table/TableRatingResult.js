import {
  hasValue,
  renderColumn,
  renderDateColumn,
  separatorNumber,
} from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";

export const columnsRatingResult = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search
) => [
  {
    key: "no",
    title: "NO",
    isClassification: true,
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    key: "lineNumber",
    title: "LINE NUMBER",
    dataIndex: "lineNumber",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "lineNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "lineNumber",
        hasValue(search["lineNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "groupId",
    title: "GROUP ID",
    dataIndex: "groupId",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "groupId",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "groupId",
        hasValue(search["groupId"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "referenceGroupId",
    title: "REFERENCE GROUP ID",
    dataIndex: "referenceGroupId",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "referenceGroupId",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "referenceGroupId",
        hasValue(search["referenceGroupId"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "ratingCode",
    title: "RATING CODE",
    dataIndex: "ratingCode",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "ratingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "ratingCode",
        hasValue(search["ratingCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "billingItemCode",
    title: "BILLING ITEM CODE",
    dataIndex: "billingItemCode",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billingItemCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "billingItemCode",
        hasValue(search["billingItemCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "item",
    title: "ITEM",
    dataIndex: "item",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "item",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "item",
        hasValue(search["item"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "quantity",
    title: "QUANTITY",
    dataIndex: "quantity",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "quantity",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text, record) =>
      renderColumn(
        "quantity",
        hasValue(search["quantity"]),
        searchText,
        separatorNumber(text),
        false,
        "input",
        search,
        record.uom === "MMBTU" ? "energi" : "volume",
      ),
  },
  {
    key: "uom",
    title: "UOM",
    dataIndex: "uom",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "uom",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "uom",
        hasValue(search["uom"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "currency",
    title: "CURRENCY",
    dataIndex: "currency",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "currency",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "currency",
        hasValue(search["currency"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "priceCode",
    title: "PRICE CODE",
    dataIndex: "priceCode",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "priceCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "priceCode",
        hasValue(search["priceCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "price",
    title: "PRICE",
    dataIndex: "price",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "price",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text, record) =>
      renderColumn(
        "price",
        hasValue(search["price"]),
        searchText,
        separatorNumber(text),
        false,
        "input",
        search,
        record.currency === "USD" ? "currency-usd" : "currency-idr",
      ),
  },
  {
    key: "amount",
    title: "AMOUNT",
    dataIndex: "amount",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "amount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text, record) =>
      renderColumn(
        "amount",
        hasValue(search["amount"]),
        searchText,
        separatorNumber(text),
        false,
        "input",
        search,
        record.currency === "USD" ? "currency-usd" : "currency-idr",
      ),
  },
  {
    key: "discountAmount",
    title: "DISCOUNT AMOUNT",
    dataIndex: "discountAmount",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "discountAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text, record) =>
      renderColumn(
        "discountAmount",
        hasValue(search["discountAmount"]),
        searchText,
        separatorNumber(text),
        false,
        "input",
        search,
        record.currency === "USD" ? "currency-usd" : "currency-idr",
      ),
  },
  {
    key: "totalAmount",
    title: "TOTAL AMOUNT",
    dataIndex: "totalAmount",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text,record) =>
      renderColumn(
        "totalAmount",
        hasValue(search["totalAmount"]),
        searchText,
        separatorNumber(text),
        false,
        "input",
        search,
        record.currency === "USD" ? "currency-usd" : "currency-idr",
      ),
  },
  {
    key: "vatBasis",
    title: "VAT BASIS",
    dataIndex: "vatBasis",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "vatBasis",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text, record) =>
      renderColumn(
        "vatBasis",
        hasValue(search["vatBasis"]),
        searchText,
        separatorNumber(text),
        false,
        "input",
        search,
        record.currency === "USD" ? "currency-usd" : "currency-idr",
      ),
  },
  {
    key: "vatBasisEqv",
    title: "VAT BASIS EQV",
    dataIndex: "vatBasisEqv",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "vatBasisEqv",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text, record) =>
      renderColumn(
        "vatBasisEqv",
        hasValue(search["vatBasisEqv"]),
        searchText,
        separatorNumber(text),
        false,
        "input",
        search,
        record.convertedCurrency === "USD" ? "currency-usd" : "currency-idr",
      ),
  },
  {
    key: "vatRate",
    title: "VAT RATE",
    dataIndex: "vatRate",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "vatRate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "vatRate",
        hasValue(search["vatRate"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "vatCode",
    title: "VAT CODE",
    dataIndex: "vatCode",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "vatCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "vatCode",
        hasValue(search["vatCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "vat",
    title: "VAT",
    dataIndex: "vat",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "vat",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text, record) =>
      renderColumn(
        "vat",
        hasValue(search["vat"]),
        searchText,
        separatorNumber(text),
        false,
        "input",
        search,
        record.currency === "USD" ? "currency-usd" : "currency-idr",
      ),
  },
  {
    key: "vatEqv",
    title: "VAT EQV",
    dataIndex: "vatEqv",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "vatEqv",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text, record) =>
      renderColumn(
        "vatEqv",
        hasValue(search["vatEqv"]),
        searchText,
        separatorNumber(text),
        false,
        "input",
        search,
        record.convertedCurrency === "USD" ? "currency-usd" : "currency-idr",
      ),
  },
  {
    key: "withholdingTaxCode",
    title: "WITHHOLDING TAX CODE",
    dataIndex: "withholdingTaxCode",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "withholdingTaxCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "withholdingTaxCode",
        hasValue(search["withholdingTaxCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "withholdingTaxRate",
    title: "WITHHOLDING TAX RATE",
    dataIndex: "withholdingTaxRate",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "withholdingTaxRate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "withholdingTaxRate",
        hasValue(search["withholdingTaxRate"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "withholdingTax",
    title: "WITHHOLDING TAX",
    dataIndex: "withholdingTax",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "withholdingTax",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "withholdingTax",
        hasValue(search["withholdingTax"]),
        searchText,
        separatorNumber(text),
        false,
        "input",
        search
      ),
  },
  {
    key: "vatExchangeRateType",
    title: "VAT EXCHANGE RATE TYPE",
    dataIndex: "vatExchangeRateType",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "vatExchangeRateType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "vatExchangeRateType",
        hasValue(search["vatExchangeRateType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "vatExchangeRateDate",
    title: "VAT EXCHANGE RATE DATE",
    dataIndex: "vatExchangeRateDate",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "vatExchangeRateDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "vatExchangeRateDate",
        hasValue(search["vatExchangeRateDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    key: "vatExchangeRate",
    title: "VAT EXCHANGE RATE",
    dataIndex: "vatExchangeRate",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "vatExchangeRate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "vatExchangeRate",
        hasValue(search["vatExchangeRate"]),
        searchText,
        separatorNumber(text),
        false,
        "input",
        search
      ),
  },
  {
    key: "convertedCurrency",
    title: "CONVERTED CURRENCY",
    dataIndex: "convertedCurrency",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "convertedCurrency",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "convertedCurrency",
        hasValue(search["convertedCurrency"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalAmountEqv",
    title: "TOTAL AMOUNT EQV",
    dataIndex: "totalAmountEqv",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountEqv",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text,record) =>
      renderColumn(
        "totalAmountEqv",
        hasValue(search["totalAmountEqv"]),
        searchText,
        separatorNumber(text),
        false,
        "input",
        search,
        record.convertedCurrency === "USD" ? "currency-usd" : "currency-idr",
      ),
  },
  {
    key: "rateType",
    title: "RATE TYPE",
    dataIndex: "rateType",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "rateType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "rateType",
        hasValue(search["rateType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "rateDate",
    title: "RATE DATE",
    dataIndex: "rateDate",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "rateDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "rateDate",
        hasValue(search["rateDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    key: "rate",
    title: "RATE",
    dataIndex: "rate",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "rate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "rate",
        hasValue(search["rate"]),
        searchText,
        separatorNumber(text),
        false,
        "input",
        search
      ),
  },
  {
    key: "printSwitch",
    title: "PRINT SWITCH",
    dataIndex: "printSwitch",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "printSwitch",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "printSwitch",
        hasValue(search["printSwitch"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "applyChargeSwitch",
    title: "APPLY CHARGE SWITCH",
    dataIndex: "applyChargeSwitch",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "applyChargeSwitch",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "applyChargeSwitch",
        hasValue(search["applyChargeSwitch"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "balance",
    title: "BALANCE",
    dataIndex: "balance",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "balance",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "balance",
        hasValue(search["balance"]),
        searchText,
        separatorNumber(text),
        false,
        "input",
        search
      ),
  },
  {
    key: "paymentStatus",
    title: "PAYMENT STATUS",
    dataIndex: "paymentStatus",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "paymentStatus",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "paymentStatus",
        hasValue(search["paymentStatus"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "status",
        hasValue(search["status"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "transferedFrom",
    title: "TRANSFERRED FROM",
    dataIndex: "transferedFrom",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "transferedFrom",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "transferedFrom",
        hasValue(search["transferedFrom"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "transferedTo",
    title: "TRANSFERRED TO",
    dataIndex: "transferedTo",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "transferedTo",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "transferedTo",
        hasValue(search["transferedTo"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "source",
    title: "SOURCE",
    dataIndex: "source",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "source",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "source",
        hasValue(search["source"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
];