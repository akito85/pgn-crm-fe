import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import { getColumnSearchProps } from "../../../../../utils/getColumnSearchProps";
import { sorterFunction } from "../../../../../utils/sorterFunction";

export const columnGenerateHistory = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
) => {
  return [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "LINK",
      dataIndex: "link",
      width: 350,
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => sorterFunction("link", a, b),
      ...getColumnSearchProps(
        "link",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "link",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      width: 140,
      align: "center",
      sorter: (a, b) => sorterFunction("startDate", a, b, "date"),
      ...getColumnSearchProps(
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
      ),
      render: (v) =>
        renderDateColumn(
          "startDate",
          hasValue(search["startDate"]),
          searchText,
          v,
          "date",
          search,
        ),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      width: 140,
      align: "center",
      sorter: (a, b) => sorterFunction("endDate", a, b, "date"),
      ...getColumnSearchProps(
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "date",
      ),
      render: (v) =>
        renderDateColumn(
          "endDate",
          hasValue(search["endDate"]),
          searchText,
          v,
          "date",
          search,
        ),
    },
    {
      title: "GENERATE BY",
      dataIndex: "createdBy",
      width: 350,
      sorter: (a, b) => sorterFunction("createdBy", a, b),
      ...getColumnSearchProps(
        "createdBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
      ),
    },
    {
      title: "GENERATE DATE",
      dataIndex: "createdDate",
      width: 180,
      sorter: (a, b) => sorterFunction("createdDate", a, b, "date"),
      align: "center",
      ...getColumnSearchProps(
        "createdDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
      ),
      render: (v) =>
        renderDateColumn(
          "createdDate",
          hasValue(search["createdDate"]),
          searchText,
          v,
          "date",
          search,
        ),
    },
    {
      title: "REMARK",
      dataIndex: "remark",
      width: 350,
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => sorterFunction("remark", a, b),
      ...getColumnSearchProps(
        "remark",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "remark",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 120,
      align: "center",
      fixed: "right",
      sorter: (a, b) => sorterFunction("status", a, b),
      ...getColumnSearchProps(
        "remark",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "status",
      ),
      render: (text) =>
        renderColumn(
          "status",
          searchedColumn,
          searchText,
          text,
          false,
          "status",
          search,
        ),
    },
  ];
};
