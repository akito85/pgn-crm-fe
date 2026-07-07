import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import {
  numberFormatting,
} from "../../../../../utils/formatCurrency";

export const columnsBilling = (
  page = 0,
  pageSize = 0,
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
    width: 15,
    render: (text, object, index) => index + 1,
  },
  {
    key: "invoiceNumber",
    title: "INVOICE NUMBER",
    dataIndex: "invoiceNumber",
    isClassification: true,
    width: 80,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "invoiceNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "invoiceNumber",
        hasValue(search["invoiceNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "proformaInvoiceNumber",
    title: "PROFORMA INVOICE NUMBER",
    dataIndex: "proformaInvoiceNumber",
    isClassification: true,
    width: 100,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "proformaInvoiceNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "proformaInvoiceNumber",
        hasValue(search["proformaInvoiceNumber"]),
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
    isClassification: true,
    width: 70,
    sorter: true,
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
  {
    key: "sourceNumber",
    title: "SOURCE NUMBER",
    dataIndex: "sourceNumber",
    isClassification: true,
    width: 80,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "sourceNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "sourceNumber",
        hasValue(search["sourceNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "category",
    title: "CATEGORY",
    dataIndex: "category",
    isClassification: true,
    width: 70,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "category",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "category",
        hasValue(search["category"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "billCode",
    title: "BILLING CODE",
    dataIndex: "billCode",
    isClassification: true,
    width: 71,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "billCode",
        hasValue(search["billCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "calculationCode",
    title: "CALCULATION CODE",
    dataIndex: "calculationCode",
    isClassification: true,
    width: 71,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "calculationCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "calculationCode",
        hasValue(search["calculationCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "saNumber",
    title: "SA NUMBER",
    dataIndex: "saNumber",
    width: 70,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "saNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "saNumber",
        hasValue(search["saNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "billingCycle",
    title: "BILLING CYCLE",
    dataIndex: "billingCycle",
    width: 60,
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billingCycle",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "billingCycle",
        hasValue(search["billingCycle"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "billingPeriod",
    title: "BILLING PERIOD",
    width: 62,
    sorter: true,
    isClassification: true,
    dataIndex: "billingPeriod",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billingPeriod",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datePeriod"
    ),
    // billingPeriod sekarang berupa string "Dec 2025", bukan ISO date
    render: (text) => text || "",
  },
  {
    key: "accountRegistrationNumber",
    title: "ACCOUNT REGISTRATION NUMBER",
    dataIndex: "accountRegistrationNumber",
    width: 110,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountRegistrationNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "accountRegistrationNumber",
        hasValue(search["accountRegistrationNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "customerNumber",
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    width: 70,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "customerNumber",
        hasValue(search["customerNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "customerName",
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    width: 70,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "customerName",
        hasValue(search["customerName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "accountNumber",
    title: "ACCOUNT NUMBER",
    width: 70,
    dataIndex: "accountNumber",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "accountNumber",
        hasValue(search["accountNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "accountName",
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    width: 70,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "accountName",
        hasValue(search["accountName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "accountGroupType",
    title: "ACCOUNT GROUP TYPE",
    dataIndex: "accountGroupType",
    width: 80,
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountGroupType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "accountGroupType",
        hasValue(search["accountGroupType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "serviceType",
    title: "SERVICE TYPE",
    dataIndex: "serviceType",
    width: 70,
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "serviceType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "serviceType",
        hasValue(search["serviceType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "sor",
    title: "SOR",
    dataIndex: "sor",
    isClassification: true,
    sorter: true,
    width: 70,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "sor",
        hasValue(search["sor"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "costCenter",
    title: "COST CENTER",
    width: 70,
    isClassification: true,
    dataIndex: "costCenter",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "costCenter",
        hasValue(search["costCenter"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "accountSegment",
    title: "ACCOUNT SEGMENT",
    width: 70,
    isClassification: true,
    dataIndex: "accountSegment",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountSegment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "accountSegment",
        hasValue(search["accountSegment"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "meterReadingCode",
    title: "METER READING CODE",
    width: 75,
    isClassification: true,
    dataIndex: "meterReadingCode",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "meterReadingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "meterReadingCode",
        hasValue(search["meterReadingCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "product",
    title: "PRODUCT",
    isClassification: true,
    dataIndex: "product",
    sorter: true,
    width: 70,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "product",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "product",
        hasValue(search["product"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "timeUnit",
    title: "TIME UNIT",
    dataIndex: "timeUnit",
    width: 70,
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "timeUnit",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "timeUnit",
        hasValue(search["timeUnit"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "uom",
    title: "UOM",
    dataIndex: "uom",
    width: 50,
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
    key: "quantity",
    title: "QUANTITY",
    dataIndex: "quantity",
    width: 70,
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
    render: (text,record) => {
        return renderColumn(
          "quantity",
          hasValue(search["quantity"]),
          searchText,
          text,
          false,
          "input",
          search,
          record.uom === "MMBTU" ? "energi" : "volume"
        );
    },
  },
  {
    key: "currency",
    title: "CURRENCY",
    dataIndex: "currency",
    width: 70,
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
    key: "amount",
    title: "AMOUNT",
    dataIndex: "amount",
    width: 70,
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
        text,
        false,
        "input",
        search,
        record.currency === "USD" ? "currency-usd" : "currency-idr"
      ),
  },
  {
    key: "adjustment",
    title: "ADJUSTMENT",
    dataIndex: "adjustment",
    width: 70,
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "adjustment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text,record) =>
      renderColumn(
        "adjustment",
        hasValue(search["adjustment"]),
        searchText,
        text,
        false,
        "input",
        search,
        record.currency === "USD" ? "currency-usd" : "currency-idr"
      ),
  },
  {
    key: "vat",
    title: "VAT",
    dataIndex: "vat",
    width: 70,
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
    render: (text,record) =>
      renderColumn(
        "vat",
        hasValue(search["vat"]),
        searchText,
        text,
        false,
        "input",
        search,
        record.currency === "USD" ? "currency-usd" : "currency-idr"
      ),
  },
  {
    key: "vatEqv",
    title: "VAT EQV",
    dataIndex: "vatEqv",
    width: 70,
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
    render: (text) =>
      renderColumn(
        "vatEqv",
        hasValue(search["vatEqv"]),
        searchText,
        text,
        false,
        "input",
        search,
        "number"
      ),
  },
  {
    key: "withholdingTaxCode",
    title: "WITHHOLDING TAX CODE",
    dataIndex: "withholdingTaxCode",
    width: 85,
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
    width: 85,
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
        search,
        "number"
      ),
  },
  {
    key: "withholdingTax",
    title: "WITHHOLDING TAX",
    width: 70,
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
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "prevBalance",
    title: "PREV BALANCE",
    dataIndex: "prevBalance",
    width: 75,
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "prevBalance",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "prevBalance",
        hasValue(search["prevBalance"]),
        searchText,
        text,
        false,
        "input",
        search,
        "number"
      ),
  },
  {
    key: "balance",
    title: "BALANCE",
    dataIndex: "balance",
    width: 70,
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
        text,
        false,
        "input",
        search,
        "number"
      ),
  },
  {
    key: "totalAmount",
    title: "TOTAL AMOUNT",
    dataIndex: "totalAmount",
    width: 75,
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
    render: (text, record) =>
      renderColumn(
        "totalAmount",
        hasValue(search["totalAmount"]),
        searchText,
        text,
        false,
        "input",
        search,
        record.currency === "USD" ? "currency-usd" : "currency-idr"
      ),
  },
  {
    key: "convertedCurrency",
    title: "CONVERTED CURRENCY",
    dataIndex: "convertedCurrency",
    width: 85,
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
    width: 85,
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
        text,
        false,
        "input",
        search,
        record.convertedCurrency === "USD" ? "currency-usd" : "currency-idr"
      ),
  },
  {
    key: "rateType",
    title: "RATE TYPE",
    dataIndex: "rateType",
    width: 70,
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
    width: 70,
    sorter: true,
    isClassification: true,
    dataIndex: "rateDate",
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
    width: 70,
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
        text,
        false,
        "input",
        search,
        "number"
      ),
  },
  {
    key: "transactionDate",
    title: "TRANSACTION DATE",
    width: 80,
    sorter: true,
    isClassification: true,
    dataIndex: "transactionDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "transactionDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "transactionDate",
        hasValue(search["transactionDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    key: "accountingDate",
    title: "ACCOUNTING DATE",
    width: 70,
    sorter: true,
    isClassification: true,
    dataIndex: "accountingDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountingDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "accountingDate",
        hasValue(search["accountingDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    key: "invoiceDate",
    title: "INVOICE DATE",
    width: 70,
    sorter: true,
    isClassification: true,
    dataIndex: "invoiceDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "invoiceDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "invoiceDate",
        hasValue(search["invoiceDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    key: "dueDate",
    title: "DUE DATE",
    width: 70,
    sorter: true,
    isClassification: true,
    dataIndex: "dueDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "dueDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "dueDate",
        hasValue(search["dueDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    key: "paymentCode",
    title: "PAYMENT CODE",
    dataIndex: "paymentCode",
    width: 70,
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "paymentCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "paymentCode",
        hasValue(search["paymentCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "remark",
    sorter: true,
    title: "REMARK",
    width: 70,
    dataIndex: "remark",
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "remark",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "remark",
        hasValue(search["remark"]),
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    key: "generatedInvoiceStatus",
    title: "GENERATED INVOICE STATUS",
    dataIndex: "generatedInvoiceStatus",
    width: 100,
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "generatedInvoiceStatus",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (index) => {
      const text = index
        ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
        : index;
      return text
        ? renderColumn(
            "generatedInvoiceStatus",
            hasValue(search["generatedInvoiceStatus"]),
            searchText,
            text,
            false,
            "status",
            search
          )
        : text;
    },
  },
  {
    key: "accountingStatus",
    title: "ACCOUNTING STATUS",
    dataIndex: "accountingStatus",
    width: 85,
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountingStatus",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (index) => {
      const text = index
        ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
        : index;
      return text
        ? renderColumn(
            "accountingStatus",
            hasValue(search["accountingStatus"]),
            searchText,
            text,
            false,
            "status",
            search
          )
        : text;
    },
  },
  {
    key: "postedDate",
    title: "POSTED DATE",
    width: 70,
    sorter: true,
    isClassification: true,
    dataIndex: "postedDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "postedDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "postedDate",
        hasValue(search["postedDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    key: "postingStatus",
    title: "POSTING STATUS",
    dataIndex: "postingStatus",
    width: 75,
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "postingStatus",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (index) => {
      const text = index
        ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
        : index;
      return text
        ? renderColumn(
            "postingStatus",
            hasValue(search["postingStatus"]),
            searchText,
            text,
            false,
            "status",
            search
          )
        : text;
    },
  },
  {
    key: "paymentStatus",
    title: "PAYMENT STATUS",
    width: 70,
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
            hasValue(search["paymentStatus"]),
            searchText,
            text,
            false,
            "status",
            search
          )
        : text;
    },
  },
  {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    width: 70,
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
    render: (index) => {
      const text = index
        ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
        : index;
      return text
        ? renderColumn(
            "status",
            hasValue(search["status"]),
            searchText,
            text,
            false,
            "status",
            search
          )
        : text;
    },
  },
  {
    key: "statusApproval",
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    isClassification: true,
    fixed: "right",
    width: 70,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "statusApproval",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "select",
      [
        { value: "DRAFT", label: "Draft" },
        { value: "APPROVED", label: "Approved" },
        { value: "NEED REVIEW", label: "Need Review" },
        { value: "WAITING APPROVAL", label: "Waiting Approval" },
      ]
    ),
    render: (index) => {
      let text;
      switch (index) {
        case "WAITING APPROVAL":
          text = "Waiting Approval";
          break;
        case "NEED REVIEW":
          text = "Need Review";
          break;
        case "DRAFT":
          text = "Draft";
          break;
        default:
          text = index
            ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
            : index;
          break;
      }
      return text
        ? renderColumn(
            "statusApproval",
            hasValue(search["statusApproval"]),
            searchText,
            text,
            false,
            "status",
            search
          )
        : text;
    },
  },
];