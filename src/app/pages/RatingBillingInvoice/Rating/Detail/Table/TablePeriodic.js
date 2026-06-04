import { hasValue, renderColumn } from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";

export const columnsPeriodic = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
) => [
  {
    key: "no",
    title: "NO",
    isClassification: true,
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    key: "uom",
    title: "UOM",
    dataIndex: "uom",
    width: 100,
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "uom",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
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
    key: "totalEstUsage",
    title: "TOTAL EST USAGE",
    dataIndex: "totalEstUsage",
    width: 150,
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalEstUsage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "totalEstUsage",
        hasValue(search["totalEstUsage"]),
        searchText,
        text ? text.toLocaleString('en-US', { minimumFractionDigits: 3 }) : "",
        false,
        "input",
        search
      ),
  },
  {
    key: "totalEstAmount",
    title: "TOTAL EST AMOUNT",
    dataIndex: "totalEstAmount",
    width: 180,
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalEstAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "totalEstAmount",
        hasValue(search["totalEstAmount"]),
        searchText,
        text ? text.toLocaleString('en-US', { minimumFractionDigits: 3 }) : "",
        false,
        "input",
        search
      ),
  },
  {
    key: "accMinContract",
    title: "ACC MIN CONTRACT",
    dataIndex: "accMinContract",
    width: 180,
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accMinContract",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "accMinContract",
        hasValue(search["accMinContract"]),
        searchText,
        text ? text.toLocaleString('en-US', { minimumFractionDigits: 3 }) : "",
        false,
        "input",
        search
      ),
  },
  {
    key: "accMaxContract",
    title: "ACC MAX CONTRACT",
    dataIndex: "accMaxContract",
    width: 180,
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accMaxContract",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "accMaxContract",
        hasValue(search["accMaxContract"]),
        searchText,
        text ? text.toLocaleString('en-US', { minimumFractionDigits: 3 }) : "",
        false,
        "input",
        search
      ),
  },
  {
    key: "adjustmentUsage",
    title: "ADJUSTMENT USAGE",
    dataIndex: "adjustmentUsage",
    width: 180,
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "adjustmentUsage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "adjustmentUsage",
        hasValue(search["adjustmentUsage"]),
        searchText,
        text ? text.toLocaleString('en-US', { minimumFractionDigits: 3 }) : "",
        false,
        "input",
        search
      ),
  },
];