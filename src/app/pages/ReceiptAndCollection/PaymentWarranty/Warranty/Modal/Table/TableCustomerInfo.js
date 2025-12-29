import Highlighter from "react-highlight-words";
import { Tooltip } from "antd";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../../utils/getColumnSearchProps";

export const columnsCustomerInfo = (
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
    key: "costCenter",
    title: "COST CENTER",
    dataIndex: "costCenter",
    width: 180,
    sorter: (a, b) => a?.costCenter?.localeCompare(b?.costCenter),
    ...getColumnSearchPropsPaging(
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["costCenter"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "customerNumber",
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    width: 150,
    sorter: (a, b) => a?.customerNumber?.localeCompare(b?.customerNumber),
    ...getColumnSearchPropsPaging(
      "customerNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["customerNumber"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "customerName",
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    width: 180,
    sorter: (a, b) => a?.customerName?.localeCompare(b?.customerName),
    ...getColumnSearchPropsPaging(
      "customerName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["customerName"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
];