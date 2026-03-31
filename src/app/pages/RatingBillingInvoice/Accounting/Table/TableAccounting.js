import { hasValue, renderColumn, separatorNumber } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";

/**
 * Computes rowSpan values for each merged field across a flat data array.
 * Returns an object: { [dataIndex]: number[] } where each number[] has length === data.length.
 * rowSpan = 0 means the cell is hidden (covered by an earlier cell with rowSpan > 1).
 */
export const computeRowSpans = (data = [], mergedFields = []) => {
  const result = {};

  mergedFields.forEach((field) => {
    const spans = new Array(data.length).fill(1);
    let i = 0;
    while (i < data.length) {
      let j = i + 1;
      while (j < data.length && data[j][field] === data[i][field]) {
        j++;
      }
      const count = j - i;
      spans[i] = count;
      for (let k = i + 1; k < j; k++) {
        spans[k] = 0;
      }
      i = j;
    }
    result[field] = spans;
  });

  return result;
};

export const ACCOUNTING_MERGED_FIELDS = [
  "pgnOrgSap",
  "year",
  "month",
  "postBatchNumber",
  "transactionNumber",
  "invNumber",
  "accountNumber",
  "accSor",
  "accCostCenterArea",
  "accountSegment",
  "accountGroupType",
  "accountType",
  "billPeriod",
  "rateType",
  "dueDate",
  "custIdSap",
  "categorySap",
  "documentDate",
  "postingDate",
  "currency",
  "transactionReference",
  "reference1",
];

const COLUMN_ALIGN = {
  no: 'center',
  referenceLineNumber: 'center',
  lineNumber: 'center',
  pgnOrgSap: 'left',
  year: 'center',
  month: 'center',
  postBatchNumber: 'left',
  paymentNumber: 'left',
  transactionNumber: 'left',
  invNumber: 'left',
  transactionType: 'center',
  accountNumber: 'right',
  accSor: 'left',
  accCostCenterArea: 'right',
  accountSegment: 'center',
  accountGroupType: 'center',
  accountType: 'center',
  billingItemCode: 'center',
  billPeriod: 'center',
  rateType: 'center',
  dueDate: 'center',
  custIdSap: 'right',
  categorySap: 'center',
  documentDate: 'center',
  postingDate: 'center',
  currency: 'center',
  exchangeRate: 'right',
  transactionGroups: 'center',
  glAccount: 'right',
  amount: 'right',
  equivAmountIdr: 'right',
  equivAmountUsd: 'right',
  specialGl: 'center',
  profitCenter: 'left',
  withholdingTaxType: 'center',
  withholdingTaxCode: 'center',
  costCenterSap: 'center',
  transactionReference: 'left',
  text: 'left',
  reference1: 'left',
  reference2: 'left',
  reference3: 'left',
  meterReadingCode: 'right',
  f: 'right',
};

const makeSearchCol = (dataIndex, search, searchInput, searchedColumn, searchText, handleSearch) => ({
  ...getColumnSearchPropsUseFilteredValue(
    search,
    dataIndex,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch,
    true
  ),
  render: (text, _record, index) =>
    renderColumn(
      dataIndex,
      hasValue(search[dataIndex]),
      searchText,
      text,
      false,
      "input",
      search
    ),
});

const makeNumberSearchCol = (dataIndex, search, searchInput, searchedColumn, searchText, handleSearch) => ({
  ...getColumnSearchPropsUseFilteredValue(
    search,
    dataIndex,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch,
    true
  ),
  render: (text, _record, index) =>
    renderColumn(
      dataIndex,
      hasValue(search[dataIndex]),
      searchText,
      separatorNumber(text),
      false,
      "input",
      search
    ),
});

const makeMergedSearchCol = (dataIndex, rowSpans, search, searchInput, searchedColumn, searchText, handleSearch) => ({
  ...getColumnSearchPropsUseFilteredValue(
    search,
    dataIndex,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch,
    true
  ),
  render: (text, _record, index) => {
    const span = rowSpans?.[dataIndex]?.[index] ?? 1;
    return {
      children: renderColumn(
        dataIndex,
        hasValue(search[dataIndex]),
        searchText,
        text,
        false,
        "input",
        search
      ),
      props: { rowSpan: span },
    };
  },
});

export const columnsAccounting = (
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search = {},
  rowSpans = {},
  groupIndex = 1,
  groupSize = 1
) => {
  const rawColumns = [
  {
    key: "no",
    title: "NO",
    width: 60,
    isClassification: true,
    render: (_text, _record, index) => ({
      children: groupIndex,
      props: { rowSpan: index === 0 ? groupSize : 0 },
    }),
  },
  {
    key: "pgnOrgSap",
    dataIndex: "pgnOrgSap",
    title: "PGN ORGANIZATION IN SAP",
    sorter: true,
    width: 220,
    ...makeMergedSearchCol("pgnOrgSap", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "year",
    dataIndex: "year",
    title: "YEAR",
    sorter: true,
    width: 90,
    isClassification: true,
    ...makeMergedSearchCol("year", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "month",
    dataIndex: "month",
    title: "MONTH",
    sorter: true,
    width: 90,
    isClassification: true,
    ...makeMergedSearchCol("month", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "postBatchNumber",
    dataIndex: "postBatchNumber",
    title: "POST BATCH NUMBER",
    sorter: true,
    width: 180,
    ...makeMergedSearchCol("postBatchNumber", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "transactionNumber",
    dataIndex: "transactionNumber",
    title: "TRANSACTION NUMBER",
    sorter: true,
    width: 190,
    ...makeMergedSearchCol("transactionNumber", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "lineNumber",
    dataIndex: "lineNumber",
    title: "LINE NUMBER",
    sorter: true,
    width: 130,
    isClassification: true,
    ...makeSearchCol("lineNumber", search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "invNumber",
    dataIndex: "invNumber",
    title: "INV NUMBER",
    sorter: true,
    width: 160,
    ...makeMergedSearchCol("invNumber", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "accountNumber",
    dataIndex: "accountNumber",
    title: "ACCOUNT NUMBER",
    sorter: true,
    width: 160,
    ...makeMergedSearchCol("accountNumber", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "accSor",
    dataIndex: "accSor",
    title: "ACC. SOR",
    sorter: true,
    width: 120,
    isClassification: true,
    ...makeMergedSearchCol("accSor", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "accCostCenterArea",
    dataIndex: "accCostCenterArea",
    title: "ACC. COST CENTER/AREA",
    sorter: true,
    width: 210,
    ...makeMergedSearchCol("accCostCenterArea", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "accountSegment",
    dataIndex: "accountSegment",
    title: "ACCOUNT SEGMENT",
    sorter: true,
    width: 170,
    ...makeMergedSearchCol("accountSegment", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "accountGroupType",
    dataIndex: "accountGroupType",
    title: "ACCOUNT GROUP TYPE",
    sorter: true,
    width: 190,
    ...makeMergedSearchCol("accountGroupType", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "accountType",
    dataIndex: "accountType",
    title: "ACCOUNT TYPE",
    sorter: true,
    width: 140,
    ...makeMergedSearchCol("accountType", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "billingItemCode",
    dataIndex: "billingItemCode",
    title: "BILLING ITEM CODE",
    sorter: true,
    width: 170,
    ...makeSearchCol("billingItemCode", search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "billPeriod",
    dataIndex: "billPeriod",
    title: "BILL PERIOD",
    sorter: true,
    width: 130,
    ...makeMergedSearchCol("billPeriod", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "rateType",
    dataIndex: "rateType",
    title: "RATE TYPE",
    sorter: true,
    width: 120,
    isClassification: true,
    ...makeMergedSearchCol("rateType", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "dueDate",
    dataIndex: "dueDate",
    title: "DUE DATE",
    sorter: true,
    width: 130,
    ...makeMergedSearchCol("dueDate", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "custIdSap",
    dataIndex: "custIdSap",
    title: "CUST ID SAP",
    sorter: true,
    width: 130,
    ...makeMergedSearchCol("custIdSap", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "categorySap",
    dataIndex: "categorySap",
    title: "CATEGORY SAP",
    sorter: true,
    width: 150,
    isClassification: true,
    ...makeMergedSearchCol("categorySap", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "documentDate",
    dataIndex: "documentDate",
    title: "DOCUMENT DATE",
    sorter: true,
    width: 160,
    ...makeMergedSearchCol("documentDate", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "postingDate",
    dataIndex: "postingDate",
    title: "POSTING DATE",
    sorter: true,
    width: 150,
    ...makeMergedSearchCol("postingDate", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "currency",
    dataIndex: "currency",
    title: "CURRENCY",
    sorter: true,
    width: 110,
    isClassification: true,
    ...makeMergedSearchCol("currency", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "exchangeRate",
    dataIndex: "exchangeRate",
    title: "EXCHANGE RATE",
    sorter: true,
    width: 150,
    isNumber: true,
    ...makeNumberSearchCol("exchangeRate", search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "transactionGroups",
    dataIndex: "transactionGroups",
    title: "TRANSACTION GROUPS",
    sorter: true,
    width: 190,
    isClassification: true,
    ...makeSearchCol("transactionGroups", search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "glAccount",
    dataIndex: "glAccount",
    title: "GL ACCOUNT",
    sorter: true,
    width: 130,
    isClassification: true,
    ...makeSearchCol("glAccount", search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "amount",
    dataIndex: "amount",
    title: "AMOUNT",
    sorter: true,
    width: 130,
    isNumber: true,
    ...makeNumberSearchCol("amount", search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "equivAmountIdr",
    dataIndex: "equivAmountIdr",
    title: "EQUIV AMOUNT IDR",
    sorter: true,
    width: 170,
    isNumber: true,
    ...makeNumberSearchCol("equivAmountIdr", search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "equivAmountUsd",
    dataIndex: "equivAmountUsd",
    title: "EQUIV AMOUNT USD",
    sorter: true,
    width: 170,
    isNumber: true,
    ...makeNumberSearchCol("equivAmountUsd", search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "specialGl",
    dataIndex: "specialGl",
    title: "SPECIAL GL",
    sorter: true,
    width: 120,
    isClassification: true,
    ...makeSearchCol("specialGl", search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "withholdingTaxType",
    dataIndex: "withholdingTaxType",
    title: "WITHOLDING TAX TYPE",
    sorter: true,
    width: 190,
    isClassification: true,
    ...makeSearchCol("withholdingTaxType", search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "withholdingTaxCode",
    dataIndex: "withholdingTaxCode",
    title: "WITHOLDING TAX CODE",
    sorter: true,
    width: 190,
    isClassification: true,
    ...makeSearchCol("withholdingTaxCode", search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "costCenterSap",
    dataIndex: "costCenterSap",
    title: "COST CENTER SAP",
    sorter: true,
    width: 160,
    ...makeSearchCol("costCenterSap", search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "transactionReference",
    dataIndex: "transactionReference",
    title: "TRANSACTION REFERENCE",
    sorter: true,
    width: 210,
    ...makeMergedSearchCol("transactionReference", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "text",
    dataIndex: "text",
    title: "TEXT",
    sorter: true,
    width: 100,
    ...makeSearchCol("text", search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "reference1",
    dataIndex: "reference1",
    title: "REFERENCE 1",
    sorter: true,
    width: 140,
    ...makeMergedSearchCol("reference1", rowSpans, search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "reference2",
    dataIndex: "reference2",
    title: "REFERENCE 2",
    sorter: true,
    width: 140,
    ...makeSearchCol("reference2", search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "reference3",
    dataIndex: "reference3",
    title: "REFERENCE 3",
    sorter: true,
    width: 140,
    ...makeSearchCol("reference3", search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "meterReadingCode",
    dataIndex: "meterReadingCode",
    title: "METER READING CODE",
    sorter: true,
    width: 190,
    ...makeSearchCol("meterReadingCode", search, searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "f",
    dataIndex: "f",
    title: "F",
    sorter: true,
    width: 70,
    isClassification: true,
    ...makeSearchCol("f", search, searchInput, searchedColumn, searchText, handleSearch),
  },
  ];
  return rawColumns.map((col) => ({
    ...col,
    align: COLUMN_ALIGN[col.key] || 'left',
    onHeaderCell: () => ({ style: { padding: '3px 6px' } }),
    onCell: () => ({ style: { padding: '3px 6px' } }),
  }));
};
