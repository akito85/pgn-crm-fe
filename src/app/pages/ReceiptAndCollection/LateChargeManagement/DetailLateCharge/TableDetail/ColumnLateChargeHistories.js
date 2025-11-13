import {
    getColumnSearchPropsPaging,
  } from "../../../../../../utils/getColumnSearchProps";
export const columnLateChargeHistories = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
) => [
  {
    title: "NO",
    width: 60,
    align: "center",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "DATE",
    dataIndex: "",
    align: "center",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
  },
  {
    title: "AMOUNT",
    dataIndex: "",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
  },
  {
    title: "TYPE",
    dataIndex: "",
    align: "left",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
  },
  {
    title: "CREATED BY",
    dataIndex: "",
    align: "left",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
  },
];
