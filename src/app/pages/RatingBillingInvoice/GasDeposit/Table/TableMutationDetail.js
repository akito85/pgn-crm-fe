import { hasValue, renderColumn } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { numberFormatting } from "../../../../../utils/formatCurrency";

export const columnsMutationDetail = (
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
    key: "mutationDate",
    title: "MUTATION DATE",
    dataIndex: "mutationDate",
    isClassification: true,
    width: 70,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "mutationDate", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) =>
      renderColumn("mutationDate", hasValue(search["mutationDate"]), searchText, text, false, "input", search),
  },
  {
    key: "mutationType",
    title: "MUTATION TYPE",
    dataIndex: "mutationType",
    isClassification: true,
    width: 70,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "mutationType", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) =>
      renderColumn("mutationType", hasValue(search["mutationType"]), searchText, text, false, "input", search),
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
    key: "volume",
    title: "VOLUME",
    dataIndex: "volume",
    isClassification: true,
    width: 60,
    sorter: true,
    render: (text) => (text !== null && text !== undefined ? numberFormatting(text) : "-"),
  },
  {
    key: "price",
    title: "PRICE",
    dataIndex: "price",
    isClassification: true,
    width: 60,
    sorter: true,
    render: (text) => (text !== null && text !== undefined ? numberFormatting(text) : "-"),
  },
  {
    key: "amount",
    title: "AMOUNT",
    dataIndex: "amount",
    isClassification: true,
    width: 70,
    sorter: true,
    render: (text) => (text !== null && text !== undefined ? numberFormatting(text) : "-"),
  },
  {
    key: "type",
    title: "TYPE",
    dataIndex: "type",
    isClassification: true,
    width: 60,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "type", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) =>
      renderColumn("type", hasValue(search["type"]), searchText, text, false, "input", search),
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
