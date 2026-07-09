import {
  hasValue,
  renderColumn,
  renderDateColumn,
  separatorNumber,
} from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";

export const columnsBillingItem = (
  pageBI = 1,
  pageSizeBI = 10,
  searchInput,
  searchedColumnBI,
  searchTextBI,
  handleSearchBI = () => {},
  searchBI
) => [
  {
    key: "no",
    title: "NO",
    isClassification: true,
    width: 60,
    render: (text, object, index) => (pageBI - 1) * pageSizeBI + index + 1,
  },
  {
    key: "lineNumber",
    title: "LINE NUMBER",
    dataIndex: "lineNumber",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "lineNumber",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "lineNumber",
        hasValue(searchBI["lineNumber"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "source",
    title: "SOURCE",
    dataIndex: "source",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "source",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "source",
        hasValue(searchBI["source"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "groupId",
    title: "GROUP ID",
    dataIndex: "groupId",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "groupId",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "groupId",
        hasValue(searchBI["groupId"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "referenceGroupId",
    title: "REFERENCE GROUP ID",
    dataIndex: "referenceGroupId",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "referenceGroupId",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "referenceGroupId",
        hasValue(searchBI["referenceGroupId"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "billingItemCode",
    title: "ITEM CODE",
    dataIndex: "billingItemCode",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "billingItemCode",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "billingItemCode",
        hasValue(searchBI["billingItemCode"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "item",
    title: "ITEM",
    dataIndex: "item",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "item",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "item",
        hasValue(searchBI["item"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "quantity",
    title: "QUANTITY",
    dataIndex: "quantity",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "quantity",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text,record) =>
      renderColumn(
        "quantity",
        hasValue(searchBI["quantity"]),
        searchTextBI,
        separatorNumber(text),
        false,
        "input",
        searchBI,
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
      searchBI,
      "uom",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "uom",
        hasValue(searchBI["uom"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "currency",
    title: "CURRENCY",
    dataIndex: "currency",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "currency",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "currency",
        hasValue(searchBI["currency"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "priceCode",
    title: "PRICE CODE",
    dataIndex: "priceCode",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "priceCode",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "priceCode",
        hasValue(searchBI["priceCode"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "price",
    title: "PRICE",
    dataIndex: "price",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "price",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "price",
        hasValue(searchBI["price"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
        "number"
      ),
  },
  {
    key: "amount",
    title: "AMOUNT",
    dataIndex: "amount",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "amount",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text,record) =>
      renderColumn(
        "amount",
        hasValue(searchBI["amount"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
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
      searchBI,
      "discountAmount",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text,record) =>
      renderColumn(
        "discountAmount",
        hasValue(searchBI["discountAmount"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
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
      searchBI,
      "totalAmount",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text,record) =>
      renderColumn(
        "totalAmount",
        hasValue(searchBI["totalAmount"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
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
      searchBI,
      "vatBasis",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text,record) =>
      renderColumn(
        "vatBasis",
        hasValue(searchBI["vatBasis"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
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
      searchBI,
      "vatBasisEqv",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text,record) =>
      renderColumn(
        "vatBasisEqv",
        hasValue(searchBI["vatBasisEqv"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
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
      searchBI,
      "vatRate",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "vatRate",
        hasValue(searchBI["vatRate"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "vatCode",
    title: "VAT CODE",
    dataIndex: "vatCode",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "vatCode",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "vatCode",
        hasValue(searchBI["vatCode"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "vat",
    title: "VAT",
    dataIndex: "vat",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "vat",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text,record) =>
      renderColumn(
        "vat",
        hasValue(searchBI["vat"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
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
      searchBI,
      "vatEqv",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text,record) =>
      renderColumn(
        "vatEqv",
        hasValue(searchBI["vatEqv"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
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
      searchBI,
      "withholdingTaxCode",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "withholdingTaxCode",
        hasValue(searchBI["withholdingTaxCode"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "withholdingTaxRate",
    title: "WITHHOLDING TAX RATE",
    dataIndex: "withholdingTaxRate",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "withholdingTaxRate",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "withholdingTaxRate",
        hasValue(searchBI["withholdingTaxRate"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "withholdingTax",
    title: "WITHHOLDING TAX",
    dataIndex: "withholdingTax",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "withholdingTax",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "withholdingTax",
        hasValue(searchBI["withholdingTax"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "vatExchangeRateType",
    title: "VAT EXCH RATE TYPE",
    dataIndex: "vatExchangeRateType",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "vatExchangeRateType",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "vatExchangeRateType",
        hasValue(searchBI["vatExchangeRateType"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "vatExchangeRateDate",
    title: "VAT EXCH RATE DATE",
    dataIndex: "vatExchangeRateDate",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "vatExchangeRateDate",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "vatExchangeRateDate",
        hasValue(searchBI["vatExchangeRateDate"]),
        searchTextBI,
        text,
        "date",
        searchBI
      ),
  },
  {
    key: "vatExchangeRate",
    title: "VAT EXCH RATE",
    dataIndex: "vatExchangeRate",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "vatExchangeRate",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "vatExchangeRate",
        hasValue(searchBI["vatExchangeRate"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "convertedCurrency",
    title: "CONVERTED CURRENCY",
    dataIndex: "convertedCurrency",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "convertedCurrency",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "convertedCurrency",
        hasValue(searchBI["convertedCurrency"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "totalAmountEqv",
    title: "TOTAL AMOUNT EQV",
    dataIndex: "totalAmountEqv",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "totalAmountEqv",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text,record) =>
      renderColumn(
        "totalAmountEqv",
        hasValue(searchBI["totalAmountEqv"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
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
      searchBI,
      "rateType",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "rateType",
        hasValue(searchBI["rateType"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "rateDate",
    title: "RATE DATE",
    dataIndex: "rateDate",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "rateDate",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "rateDate",
        hasValue(searchBI["rateDate"]),
        searchTextBI,
        text,
        "date",
        searchBI
      ),
  },
  {
    key: "rate",
    title: "RATE",
    dataIndex: "rate",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "rate",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "rate",
        hasValue(searchBI["rate"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "printSwitch",
    title: "PRINT SWITCH",
    dataIndex: "printSwitch",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "printSwitch",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "printSwitch",
        hasValue(searchBI["printSwitch"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "applyChargeSwitch",
    title: "APPLY CHARGE SWITCH",
    dataIndex: "applyChargeSwitch",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "applyChargeSwitch",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "applyChargeSwitch",
        hasValue(searchBI["applyChargeSwitch"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "balance",
    title: "BALANCE",
    dataIndex: "balance",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "balance",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "balance",
        hasValue(searchBI["balance"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "paymentStatus",
    title: "PAYMENT STATUS",
    dataIndex: "paymentStatus",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "paymentStatus",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (index) => {
      let text;
      switch (index) {
        case "NOT PAID":
          text = "Not Paid";
          break;
        case "PARTIALLY PAID":
          text = "Partially Paid";
          break;
        default:
          text = index
            ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
            : index;
          break;
      }
      return text
        ? renderColumn(
            "paymentStatus",
            hasValue(searchBI["paymentStatus"]),
            searchTextBI,
            text,
            false,
            "status",
            searchBI
          )
        : text;
    },
  },
  {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "status",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (index) => {
      const text = index
        ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
        : index;
      return text
        ? renderColumn(
            "status",
            hasValue(searchBI["status"]),
            searchTextBI,
            text,
            false,
            "status",
            searchBI
          )
        : text;
    },
  },
  {
    key: "transferedFrom",
    title: "TRANSFERED FROM",
    dataIndex: "transferedFrom",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "transferedFrom",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "transferedFrom",
        hasValue(searchBI["transferedFrom"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "transferedTo",
    title: "TRANSFERED TO",
    dataIndex: "transferedTo",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "transferedTo",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "transferedTo",
        hasValue(searchBI["transferedTo"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
];