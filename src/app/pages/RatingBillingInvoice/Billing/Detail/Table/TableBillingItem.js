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
    key: "type",
    title: "TYPE",
    dataIndex: "type",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "type",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "type",
        hasValue(searchBI["type"]),
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
    key: "itemCode",
    title: "ITEM CODE",
    dataIndex: "itemCode",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "itemCode",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "itemCode",
        hasValue(searchBI["itemCode"]),
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
    render: (text) =>
      renderColumn(
        "quantity",
        hasValue(searchBI["quantity"]),
        searchTextBI,
        separatorNumber(text),
        false,
        "input",
        searchBI
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
        searchBI
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
    render: (text) =>
      renderColumn(
        "amount",
        hasValue(searchBI["amount"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
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
    render: (text) =>
      renderColumn(
        "discountAmount",
        hasValue(searchBI["discountAmount"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
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
    render: (text) =>
      renderColumn(
        "totalAmount",
        hasValue(searchBI["totalAmount"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
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
    render: (text) =>
      renderColumn(
        "vatBasis",
        hasValue(searchBI["vatBasis"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
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
    render: (text) =>
      renderColumn(
        "vatBasisEqv",
        hasValue(searchBI["vatBasisEqv"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
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
    render: (text) =>
      renderColumn(
        "vat",
        hasValue(searchBI["vat"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
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
    render: (text) =>
      renderColumn(
        "vatEqv",
        hasValue(searchBI["vatEqv"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "withHoldingTaxCode",
    title: "WITHHOLDING TAX CODE",
    dataIndex: "withHoldingTaxCode",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "withHoldingTaxCode",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "withHoldingTaxCode",
        hasValue(searchBI["withHoldingTaxCode"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "withHoldingTaxRate",
    title: "WITHHOLDING TAX RATE",
    dataIndex: "withHoldingTaxRate",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "withHoldingTaxRate",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "withHoldingTaxRate",
        hasValue(searchBI["withHoldingTaxRate"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "withHoldingTax",
    title: "WITHHOLDING TAX",
    dataIndex: "withHoldingTax",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "withHoldingTax",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "withHoldingTax",
        hasValue(searchBI["withHoldingTax"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "vatExchRateType",
    title: "VAT EXCH RATE TYPE",
    dataIndex: "vatExchRateType",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "vatExchRateType",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "vatExchRateType",
        hasValue(searchBI["vatExchRateType"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "vatExchRateDate",
    title: "VAT EXCH RATE DATE",
    dataIndex: "vatExchRateDate",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "vatExchRateDate",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "vatExchRateDate",
        hasValue(searchBI["vatExchRateDate"]),
        searchTextBI,
        text,
        "date",
        searchBI
      ),
  },
  {
    key: "vatExchRate",
    title: "VAT EXCH RATE",
    dataIndex: "vatExchRate",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "vatExchRate",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "vatExchRate",
        hasValue(searchBI["vatExchRate"]),
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
    render: (text) =>
      renderColumn(
        "totalAmountEqv",
        hasValue(searchBI["totalAmountEqv"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
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