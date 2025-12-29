import Highlighter from "react-highlight-words";
import { Tooltip } from "antd";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../../utils/getColumnSearchProps";

export const columnsRefundInfo = (
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
    key: "areaCode",
    title: "AREA CODE",
    dataIndex: "areaCode",
    width: 120,
    sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
    ...getColumnSearchPropsPaging(
      "areaCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["areaCode"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "areaName",
    title: "AREA NAME",
    dataIndex: "areaName",
    width: 120,
    sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
    ...getColumnSearchPropsPaging(
      "areaName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["areaName"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "customerId",
    title: "CUSTOMER ID",
    dataIndex: "customerId",
    width: 120,
    sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
    ...getColumnSearchPropsPaging(
      "customerId",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["customerId"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "date",
    title: "DATE",
    dataIndex: "date",
    width: 120,
    sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
    ...getColumnSearchPropsPaging(
      "date",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["date"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    render: (text) =>
      searchedColumn === "date" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[
            searchText
              ? moment(searchText, "YYYY-MMM-DD").format(dateFormatting.dateCapital)
              : "",
          ]}
          autoEscape
          textToHighlight={
            text ? moment(text).format(dateFormatting.dateCapital) : ""
          }
        />
      ) : text === null ? (
        ""
      ) : (
        moment(text).format(dateFormatting.dateCapital)
      ),
  },
  {
    key: "refundAmount",
    title: "REFUND AMOUNT",
    dataIndex: "refundAmount",
    width: 120,
    sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
    ...getColumnSearchPropsPaging(
      "refundAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["refundAmount"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  }
];