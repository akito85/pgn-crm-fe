import Highlighter from "react-highlight-words";
import { InputNumber } from "antd";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../../utils/getColumnSearchProps";
import { Form } from "antd";
import DateComponent from "../../../../../../../components/DateComponent";
import InputComponent from "../../../../../../../components/InputComponent";

export const columnsHoldInfo = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  holdAmountData = {},
  handleHoldAmountChange = () => {},
  refundDateData = {},
  handleHoldDateChange = () => {}
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
    key: "holdAmount",
    title: "HOLD AMOUNT",
    dataIndex: "holdAmount",
    width: 120,
    sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
    ...getColumnSearchPropsPaging(
      "holdAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["holdAmount"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    render: (_, record) => (
      <InputNumber
        style={{ width: '100%' }}
        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
        parser={value => value.replace(/\$\s?|(\.*)/g, '')}
        value={holdAmountData[record.key]}
        onChange={(val) => handleHoldAmountChange(val, record.key)}
        controls={false}
      />
    )
  }
];