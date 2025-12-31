import Highlighter from "react-highlight-words";
import { Tooltip } from "antd";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../../../components/StatusComponent";

export const columnsWarrantyInfo = (
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
    key: "paymentWarrantyCode",
    title: "PAYMENT WARRANTY CODE",
    dataIndex: "paymentWarrantyCode",
    width: 120,
    sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
    ...getColumnSearchPropsPaging(
      "paymentWarrantyCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["paymentWarrantyCode"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "currency",
    title: "CURRENCY",
    dataIndex: "currency",
    width: 120,
    sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
    ...getColumnSearchPropsPaging(
      "currency",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["currency"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "currentBalance",
    title: "CURRENT BALANCE",
    dataIndex: "currentBalance",
    width: 120,
    sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
    ...getColumnSearchPropsPaging(
      "currentBalance",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["currentBalance"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  }
];