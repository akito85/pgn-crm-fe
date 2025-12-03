import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";

export const columnsApproval = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
) => [
  {
    title: "NO",
    width: 50,
    dataIndex: "no",
    align: "center",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "HIERARCHY",
    dataIndex: "approvalLevel",
    sorter: (a, b) => a?.approvalLevel?.localeCompare(b?.approvalLevel),
    ...getColumnSearchPropsPaging(
      "approvalLevel",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    onFilter: (value, record) =>
      record["approvalLevel"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    title: "POSITION",
    dataIndex: "position",
    sorter: (a, b) => a?.position?.localeCompare(b?.position),
    ...getColumnSearchPropsPaging(
      "position",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    onFilter: (value, record) =>
      record["position"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
];

export const columnsExpandApproval = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
) => [
  {
    title: "NO",
    width: 50,
    dataIndex: "no",
    align: "center",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "EMPLOYEE",
    dataIndex: "employeeName",
    sorter: (a, b) => a?.employeeName?.localeCompare(b?.employeeName),
    ...getColumnSearchPropsPaging(
      "employeeName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    onFilter: (value, record) =>
      record["employeeName"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
];
