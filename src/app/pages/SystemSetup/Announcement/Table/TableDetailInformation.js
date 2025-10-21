import { Tooltip } from "antd";
import {
  dateFormatting,
  renderColumn,
  renderDateColumn,
  renderDateConverter,
} from "../../../../../utils";
import { getColumnSearchProps } from "../../../../../utils/getColumnSearchProps";
import moment from "moment";
import Highlighter from "react-highlight-words";
import { sorterFunction } from "../../../../../utils/sorterFunction";

export const detailAnnouncement = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleInactive = () => {},
) => [
  {
    title: "NO",
    dataIndex: "no",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "ACTOR",
    dataIndex: "createdBy",
    key: "createdBy",
    sorter: (a, b) => sorterFunction("createdBy", a, b),
    align: "left",
    ...getColumnSearchProps(
      "createdBy",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      false,
    ),
    render: (text) =>
      renderColumn(
        "createdBy",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "ACTION",
    dataIndex: "operation",
    key: "operation",
    sorter: (a, b) => sorterFunction("operation", a, b),
    align: "center",
    ...getColumnSearchProps(
      "operation",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      false,
      "status",
    ),
    render: (text) =>
      renderColumn(
        "operation",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "ACTION DATE",
    dataIndex: "createdDate",
    key: "createdDate",
    align: "center",
    sorter: (a, b) => sorterFunction("createdDate", a, b, "date"),
    ...getColumnSearchProps(
      "createdDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datetime",
    ),
    render: (text) =>
      renderDateColumn(
        "createdDate",
        searchedColumn,
        searchText,
        text,
        "datetime",
        search,
      ),
  },
  {
    title: "REMARK",
    dataIndex: "remark",
    align: "left",
    sorter: (a, b) => sorterFunction("remark", a, b),
    ...getColumnSearchProps(
      "remark",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    ellipsis: {
      showTitle: false,
    },
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
];
