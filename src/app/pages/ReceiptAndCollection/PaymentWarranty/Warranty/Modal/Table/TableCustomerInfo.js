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
    width: 200,
    sorter: (a, b) => a?.costCenter?.localeCompare(b?.costCenter),
    ...getColumnSearchPropsPaging(
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "customerNumber",
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    width: 200,
    sorter: (a, b) => a?.customerNumber?.localeCompare(b?.customerNumber),
    ...getColumnSearchPropsPaging(
      "customerNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (_, record) => record.customerNumber || record.customerId
  },
  {
    key: "customerName",
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    width: 250,
    sorter: (a, b) => a?.customerName?.localeCompare(b?.customerName),
    ...getColumnSearchPropsPaging(
      "customerName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "accountNumber",
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    width: 200,
    sorter: (a, b) => a?.accountNumber?.localeCompare(b?.accountNumber),
    ...getColumnSearchPropsPaging(
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (_, record) => record.accountNumber || record.accountId || "-"
  },
  {
    key: "unAppliedAmount",
    title: "TOTAL UNAPPLY AMOUNT",
    dataIndex: "unAppliedAmount",
    width: 200,
    align: "right",
    sorter: (a, b) => (a?.unAppliedAmount || 0) - (b?.unAppliedAmount || 0),
    render: (_, record) => {
      const amount = record.unAppliedAmount || record.totalUnAppliedAmount || record.totalUnapplyAmount || 0;
      return amount ? amount.toLocaleString('id-ID') : '0';
    }
  },
];