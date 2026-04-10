import Highlighter from "react-highlight-words";
import { Tooltip } from "antd";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../../utils";
import { numberFormatting } from "../../../../../utils/formatCurrency";

// Helper render date — return "-" jika null
const renderDate = (text, format = "DD MMM YYYY") => {
  if (!text) return "-";
  const m = moment(text);
  return m.isValid() ? m.format(format) : "-";
};

export const columnsRequestBilling = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search = {},
) => [
  {
    key: "no",
    title: "NO",
    isClassification: true,
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    key: "source",
    title: "SOURCE",
    dataIndex: "source",
    isClassification: true,
    width: 120,
    sorter: (a, b) => a?.source?.localeCompare(b?.source),
    ...getColumnSearchPropsPaging("source", searchInput, searchedColumn, searchText, handleSearch),
    onFilter: (value, record) =>
      record["source"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "sourceNumber",
    title: "SOURCE NUMBER",
    dataIndex: "sourceNumber",
    isClassification: true,
    width: 180,
    sorter: (a, b) => a?.sourceNumber?.localeCompare(b?.sourceNumber),
    ...getColumnSearchPropsPaging("sourceNumber", searchInput, searchedColumn, searchText, handleSearch),
    onFilter: (value, record) =>
      record["sourceNumber"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "category",
    title: "CATEGORY",
    dataIndex: "category",
    isClassification: true,
    width: 120,
    sorter: (a, b) => a?.category?.localeCompare(b?.category),
    ...getColumnSearchPropsPaging("category", searchInput, searchedColumn, searchText, handleSearch),
    onFilter: (value, record) =>
      record["category"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "billCode",
    title: "BILLING CODE",
    dataIndex: "billCode",
    isClassification: true,
    width: 180,
    sorter: (a, b) => a?.billCode?.localeCompare(b?.billCode),
    ...getColumnSearchPropsPaging("billCode", searchInput, searchedColumn, searchText, handleSearch),
    render: (text) => text ?? "-",
    onFilter: (value, record) =>
      record["billCode"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "calculationCode",
    title: "CALCULATION CODE",
    dataIndex: "calculationCode",
    isClassification: true,
    width: 180,
    sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
    ...getColumnSearchPropsPaging("calculationCode", searchInput, searchedColumn, searchText, handleSearch),
    onFilter: (value, record) =>
      record["calculationCode"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "saNumber",
    title: "SA NUMBER",
    dataIndex: "saNumber",
    isClassification: true,
    width: 180,
    sorter: (a, b) => a?.saNumber?.localeCompare(b?.saNumber),
    ...getColumnSearchPropsPaging("saNumber", searchInput, searchedColumn, searchText, handleSearch),
    onFilter: (value, record) =>
      record["saNumber"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "billingCycle",
    title: "BILLING CYCLE",
    dataIndex: "billingCycle",
    isClassification: true,
    width: 150,
    sorter: (a, b) => a?.billingCycle?.localeCompare(b?.billingCycle),
    ...getColumnSearchPropsPaging("billingCycle", searchInput, searchedColumn, searchText, handleSearch),
    onFilter: (value, record) =>
      record["billingCycle"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "billingPeriod",
    title: "BILLING PERIOD",
    dataIndex: "billingPeriod",
    isClassification: true,
    width: 130,
    sorter: (a, b) => a?.billingPeriod?.localeCompare(b?.billingPeriod),
    ...getColumnSearchPropsPaging("billingPeriod", searchInput, searchedColumn, searchText, handleSearch),
    render: (text) => text ?? "-",
    onFilter: (value, record) =>
      record["billingPeriod"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "customerNumber",
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    isClassification: true,
    width: 160,
    sorter: (a, b) => a?.customerNumber?.localeCompare(b?.customerNumber),
    ...getColumnSearchPropsPaging("customerNumber", searchInput, searchedColumn, searchText, handleSearch),
    onFilter: (value, record) =>
      record["customerNumber"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "customerName",
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    width: 200,
    sorter: (a, b) => a?.customerName?.localeCompare(b?.customerName),
    ...getColumnSearchPropsPaging("customerName", searchInput, searchedColumn, searchText, handleSearch),
    onFilter: (value, record) =>
      record["customerName"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "accountNumber",
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    isClassification: true,
    width: 150,
    sorter: (a, b) => a?.accountNumber?.localeCompare(b?.accountNumber),
    ...getColumnSearchPropsPaging("accountNumber", searchInput, searchedColumn, searchText, handleSearch),
    onFilter: (value, record) =>
      record["accountNumber"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },

  {
    key: "accountName",
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    width: 200,
    sorter: (a, b) => a?.accountName?.localeCompare(b?.accountName),
    ...getColumnSearchPropsPaging("accountName", searchInput, searchedColumn, searchText, handleSearch),
    onFilter: (value, record) =>
      record["accountName"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "accountGroupType",
    title: "ACCOUNT GROUP TYPE",
    dataIndex: "accountGroupType",
    isClassification: true,
    width: 180,
    sorter: (a, b) => a?.accountGroupType?.localeCompare(b?.accountGroupType),
    ...getColumnSearchPropsPaging("accountGroupType", searchInput, searchedColumn, searchText, handleSearch),
    onFilter: (value, record) =>
      record["accountGroupType"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "serviceType",
    title: "SERVICE TYPE",
    dataIndex: "serviceType",
    isClassification: true,
    width: 130,
    sorter: (a, b) => a?.serviceType?.localeCompare(b?.serviceType),
    ...getColumnSearchPropsPaging("serviceType", searchInput, searchedColumn, searchText, handleSearch),
    onFilter: (value, record) =>
      record["serviceType"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "sor",
    title: "SOR",
    dataIndex: "sor",
    isClassification: true,
    width: 200,
    sorter: (a, b) => a?.sor?.localeCompare(b?.sor),
    ...getColumnSearchPropsPaging("sor", searchInput, searchedColumn, searchText, handleSearch),
    onFilter: (value, record) =>
      record["sor"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "costCenter",
    title: "COST CENTER",
    dataIndex: "costCenter",
    isClassification: true,
    width: 200,
    sorter: (a, b) => a?.costCenter?.localeCompare(b?.costCenter),
    ...getColumnSearchPropsPaging("costCenter", searchInput, searchedColumn, searchText, handleSearch),
    onFilter: (value, record) =>
      record["costCenter"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "accountSegment",
    title: "ACCOUNT SEGMENT",
    dataIndex: "accountSegment",
    isClassification: true,
    width: 160,
    sorter: (a, b) => a?.accountSegment?.localeCompare(b?.accountSegment),
    ...getColumnSearchPropsPaging("accountSegment", searchInput, searchedColumn, searchText, handleSearch),
    onFilter: (value, record) =>
      record["accountSegment"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "meterReadingCode",
    title: "METER READING CODE",
    dataIndex: "meterReadingCode",
    isClassification: true,
    width: 180,
    sorter: (a, b) => a?.meterReadingCode?.localeCompare(b?.meterReadingCode),
    ...getColumnSearchPropsPaging("meterReadingCode", searchInput, searchedColumn, searchText, handleSearch),
    onFilter: (value, record) =>
      record["meterReadingCode"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "product",
    title: "PRODUCT",
    dataIndex: "product",
    isClassification: true,
    width: 180,
    sorter: (a, b) => a?.product?.localeCompare(b?.product),
    ...getColumnSearchPropsPaging("product", searchInput, searchedColumn, searchText, handleSearch),
    render: (text) => text ?? "-",
    onFilter: (value, record) =>
      record["product"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "timeUnit",
    title: "CONTRACT TIME UNIT",
    dataIndex: "timeUnit",
    isClassification: true,
    width: 170,
    sorter: (a, b) => a?.timeUnit?.localeCompare(b?.timeUnit),
    ...getColumnSearchPropsPaging("timeUnit", searchInput, searchedColumn, searchText, handleSearch),
    onFilter: (value, record) =>
      record["timeUnit"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "uom",
    title: "UOM",
    dataIndex: "uom",
    isClassification: true,
    width: 100,
    sorter: (a, b) => a?.uom?.localeCompare(b?.uom),
    ...getColumnSearchPropsPaging("uom", searchInput, searchedColumn, searchText, handleSearch),
    onFilter: (value, record) =>
      record["uom"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "quantity",
    title: "QUANTITY",
    dataIndex: "quantity",
    isNumber: true,
    width: 130,
    sorter: (a, b) => (a?.quantity ?? 0) - (b?.quantity ?? 0),
    render: (text) => numberFormatting(text),
  },
  {
    key: "currency",
    title: "CURRENCY",
    dataIndex: "currency",
    isClassification: true,
    width: 110,
    sorter: (a, b) => a?.currency?.localeCompare(b?.currency),
    ...getColumnSearchPropsPaging("currency", searchInput, searchedColumn, searchText, handleSearch),
    onFilter: (value, record) =>
      record["currency"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "amount",
    title: "AMOUNT",
    dataIndex: "amount",
    isNumber: true,
    width: 150,
    sorter: (a, b) => (a?.amount ?? 0) - (b?.amount ?? 0),
    render: (text) => numberFormatting(text),
  },
  {
    key: "adjustment",
    title: "ADJUSTMENT",
    dataIndex: "adjustment",
    isNumber: true,
    width: 150,
    sorter: (a, b) => (a?.adjustment ?? 0) - (b?.adjustment ?? 0),
    render: (text) => numberFormatting(text),
  },
  {
    key: "vat",
    title: "VAT",
    dataIndex: "vat",
    isNumber: true,
    width: 150,
    sorter: (a, b) => (a?.vat ?? 0) - (b?.vat ?? 0),
    render: (text) => numberFormatting(text),
  },
  {
    key: "withholdingTaxCode",
    title: "WITHHOLDING TAX CODE",
    dataIndex: "withholdingTaxCode",
    isClassification: true,
    width: 200,
    sorter: (a, b) => a?.withholdingTaxCode?.localeCompare(b?.withholdingTaxCode),
    ...getColumnSearchPropsPaging("withholdingTaxCode", searchInput, searchedColumn, searchText, handleSearch),
    render: (text) => text ?? "-",
    onFilter: (value, record) =>
      record["withholdingTaxCode"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "withholdingTaxRate",
    title: "WITHHOLDING TAX RATE",
    dataIndex: "withholdingTaxRate",
    isNumber: true,
    width: 200,
    sorter: (a, b) => (a?.withholdingTaxRate ?? 0) - (b?.withholdingTaxRate ?? 0),
    render: (text) => numberFormatting(text),
  },
  {
    key: "withholdingTax",
    title: "WITHHOLDING TAX",
    dataIndex: "withholdingTax",
    isNumber: true,
    width: 180,
    sorter: (a, b) => (a?.withholdingTax ?? 0) - (b?.withholdingTax ?? 0),
    render: (text) => numberFormatting(text),
  },
  {
    key: "totalAmount",
    title: "TOTAL AMOUNT",
    dataIndex: "totalAmount",
    isNumber: true,
    width: 160,
    sorter: (a, b) => (a?.totalAmount ?? 0) - (b?.totalAmount ?? 0),
    render: (text) => numberFormatting(text),
  },
  {
    key: "rateType",
    title: "RATE TYPE",
    dataIndex: "rateType",
    isClassification: true,
    width: 120,
    sorter: (a, b) => a?.rateType?.localeCompare(b?.rateType),
    ...getColumnSearchPropsPaging("rateType", searchInput, searchedColumn, searchText, handleSearch),
    render: (text) => text ?? "-",
    onFilter: (value, record) =>
      record["rateType"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "rateDate",
    title: "RATE DATE",
    dataIndex: "rateDate",
    isClassification: true,
    width: 130,
    sorter: (a, b) => a?.rateDate?.localeCompare(b?.rateDate),
    render: (text) => renderDate(text),
  },
  {
    key: "rate",
    title: "RATE",
    dataIndex: "rate",
    isNumber: true,
    width: 130,
    sorter: (a, b) => (a?.rate ?? 0) - (b?.rate ?? 0),
    render: (text) => numberFormatting(text),
  },
  {
    key: "transactionDate",
    title: "TRANSACTION DATE",
    dataIndex: "transactionDate",
    isClassification: true,
    width: 160,
    sorter: (a, b) => a?.transactionDate?.localeCompare(b?.transactionDate),
    render: (text) => renderDate(text),
  },
  {
    key: "accountingDate",
    title: "ACCOUNTING DATE",
    dataIndex: "accountingDate",
    isClassification: true,
    width: 160,
    sorter: (a, b) => a?.accountingDate?.localeCompare(b?.accountingDate),
    render: (text) => renderDate(text),
  },
  {
    key: "invoiceDate",
    title: "INVOICE DATE",
    dataIndex: "invoiceDate",
    isClassification: true,
    width: 130,
    sorter: (a, b) => a?.invoiceDate?.localeCompare(b?.invoiceDate),
    render: (text) => renderDate(text),
  },
  {
    key: "dueDate",
    title: "DUE DATE",
    dataIndex: "dueDate",
    isClassification: true,
    width: 130,
    sorter: (a, b) => a?.dueDate?.localeCompare(b?.dueDate),
    render: (text) => renderDate(text),
  },
  {
    key: "statusApproval",
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    isClassification: true,
    width: 160,
    sorter: (a, b) => a?.statusApproval?.localeCompare(b?.statusApproval),
    ...getColumnSearchPropsPaging(
      "statusApproval",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
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
            search,
          )
        : text;
    },
    onFilter: (value, record) =>
      record["statusApproval"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: "remark",
    title: "REMARK",
    dataIndex: "remark",
    isClassification: true,
    width: 200,
    sorter: (a, b) => a?.remark?.localeCompare(b?.remark),
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsPaging("remark", searchInput, searchedColumn, searchText, handleSearch),
    render: (text) =>
      text ? (
        <Tooltip placement="topLeft" title={text}>
          {searchedColumn === "remark" ? (
            <Highlighter
              highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text.toString()}
            />
          ) : (
            text
          )}
        </Tooltip>
      ) : (
        "-"
      ),
    onFilter: (value, record) =>
      record["remark"]?.toString().toLowerCase().includes(value.toLowerCase()),
  },
];