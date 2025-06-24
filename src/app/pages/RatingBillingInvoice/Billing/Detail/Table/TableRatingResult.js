import { hasValue, renderColumn, separatorNumber } from "../../../../../../utils";
import { getColumnSearchPropsPaging, getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";

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
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "description",
        hasValue(search["description"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "VALUE",
    dataIndex: "value",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "value",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "value",
        hasValue(search["value"]),
        searchText,
        separatorNumber(text),
        false,
        "input",
        search
      ),
  },
  {
    title: "UOM",
    dataIndex: "uom",
    sorter: true,
    align: "center",
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
    title: "PRICE",
    dataIndex: "pricing",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "pricing",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "pricing",
        hasValue(search["pricing"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "TOTAL AMOUNT",
    dataIndex: "totalAmount",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "totalAmount",
        hasValue(search["totalAmount"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CURRENCY",
    dataIndex: "currency",
    sorter: true,
    align: "center",
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
];
