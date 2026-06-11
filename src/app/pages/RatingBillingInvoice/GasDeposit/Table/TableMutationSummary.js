import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { numberFormatting } from "../../../../../utils/formatCurrency";

export const columnsMutationSummary = (
  page = 0,
  pageSize = 0,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search,
) => [
  {
    key: "no",
    title: "NO",
    isClassification: true,
    width: 15,
    render: (text, object, index) => index + 1,
  },
  {
    key: "source",
    title: "SOURCE",
    dataIndex: "source",
    isClassification: true,
    width: 70,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "source", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) =>
      renderColumn("source", hasValue(search["source"]), searchText, text, false, "input", search),
  },
  {
    key: "period",
    title: "PERIOD",
    dataIndex: "period",
    isClassification: true,
    width: 60,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "period", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) =>
      renderColumn("period", hasValue(search["period"]), searchText, text, false, "input", search),
  },
  {
    key: "currency",
    title: "CURRENCY",
    dataIndex: "currency",
    isClassification: true,
    width: 60,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "currency", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) =>
      renderColumn("currency", hasValue(search["currency"]), searchText, text, false, "input", search),
  },
  {
    key: "uom",
    title: "UOM",
    dataIndex: "uom",
    isClassification: true,
    width: 50,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "uom", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) =>
      renderColumn("uom", hasValue(search["uom"]), searchText, text, false, "input", search),
  },
  {
    key: "timeUnit",
    title: "TIME UNIT",
    dataIndex: "timeUnit",
    isClassification: true,
    width: 60,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "timeUnit", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) =>
      renderColumn("timeUnit", hasValue(search["timeUnit"]), searchText, text, false, "input", search),
  },
  {
    key: "balanceVolume",
    title: "BALANCE VOLUME",
    dataIndex: "balanceVolume",
    isClassification: true,
    width: 80,
    sorter: true,
    render: (text) => (text !== null && text !== undefined ? numberFormatting(text) : "-"),
  },
  {
    key: "balanceAmount",
    title: "BALANCE AMOUNT",
    dataIndex: "balanceAmount",
    isClassification: true,
    width: 80,
    sorter: true,
    render: (text) => (text !== null && text !== undefined ? numberFormatting(text) : "-"),
  },
  {
    key: "startDate",
    title: "START DATE",
    dataIndex: "startDate",
    isClassification: true,
    width: 70,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "startDate", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) =>
      renderColumn("startDate", hasValue(search["startDate"]), searchText, text, false, "input", search),
  },
  {
    key: "endDate",
    title: "END DATE",
    dataIndex: "endDate",
    isClassification: true,
    width: 70,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "endDate", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) =>
      renderColumn("endDate", hasValue(search["endDate"]), searchText, text, false, "input", search),
  },
  {
    key: "redemPeriod",
    title: "REDEM PERIOD",
    dataIndex: "redemPeriod",
    isClassification: true,
    width: 70,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "redemPeriod", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) =>
      renderColumn("redemPeriod", hasValue(search["redemPeriod"]), searchText, text, false, "input", search),
  },
  {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    isClassification: true,
    width: 60,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "status", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) =>
      renderColumn("status", hasValue(search["status"]), searchText, text, false, "input", search),
  },
  {
    key: "statusApproval",
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    isClassification: true,
    width: 70,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "statusApproval", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) =>
      renderColumn("statusApproval", hasValue(search["statusApproval"]), searchText, text, false, "input", search),
  },
];
