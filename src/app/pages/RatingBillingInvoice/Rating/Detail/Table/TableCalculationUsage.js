import Highlighter from "react-highlight-words";
import moment from "moment";
import { Tooltip } from "antd";
import { dateFormatting } from "../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import { EyeOutlined } from "@ant-design/icons";

export const columnsCalculationUsage = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleDetail
) => [
  {
    key: "no",
    title: "NO",
    isClassification: true,
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    key: "ratingType",
    title: "RATING TYPE",
    dataIndex: "ratingType",
    sorter: true,
    isClassification: true,
    width: 120,
    ...getColumnSearchPropsPaging(
      "ratingType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "ratingCode",
    title: "RATING CODE",
    dataIndex: "ratingCode",
    sorter: true,
    width: 180,
    ...getColumnSearchPropsPaging(
      "ratingCode",
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
    sorter: true,
    width: 150,
    ...getColumnSearchPropsPaging(
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "accountName",
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    sorter: true,
    width: 200,
    ...getColumnSearchPropsPaging(
      "accountName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "billPeriod",
    title: "BILL PERIOD",
    dataIndex: "billPeriod",
    sorter: true,
    width: 120,
    ...getColumnSearchPropsPaging(
      "billPeriod",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "saNumber",
    title: "SA NUMBER",
    dataIndex: "saNumber",
    sorter: true,
    width: 200,
    ...getColumnSearchPropsPaging(
      "saNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "saType",
    title: "SA TYPE",
    dataIndex: "saType",
    sorter: true,
    isClassification: true,
    width: 100,
    ...getColumnSearchPropsPaging(
      "saType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "calculatedUsage",
    title: "CALCULATED USAGE",
    dataIndex: "calculatedUsage",
    sorter: true,
    isNumber: true,
    width: 160,
    ...getColumnSearchPropsPaging(
      "calculatedUsage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "usage",
    title: "USAGE",
    dataIndex: "usage",
    sorter: true,
    isNumber: true,
    width: 100,
    ...getColumnSearchPropsPaging(
      "usage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "uom",
    title: "UOM",
    dataIndex: "uom",
    sorter: true,
    isClassification: true,
    width: 80,
    ...getColumnSearchPropsPaging(
      "uom",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "periodicMinUsage",
    title: "PERIODIC MIN USAGE",
    dataIndex: "periodicMinUsage",
    sorter: true,
    isNumber: true,
    width: 180,
    ...getColumnSearchPropsPaging(
      "periodicMinUsage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => text ?? "-",
  },
  {
    key: "periodicMaxUsage",
    title: "PERIODIC MAX USAGE",
    dataIndex: "periodicMaxUsage",
    sorter: true,
    isNumber: true,
    width: 180,
    ...getColumnSearchPropsPaging(
      "periodicMaxUsage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => text ?? "-",
  },
  {
    key: "minContract",
    title: "MIN CONTRACT",
    dataIndex: "minContract",
    sorter: true,
    isNumber: true,
    width: 130,
    ...getColumnSearchPropsPaging(
      "minContract",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "maxContract",
    title: "MAX CONTRACT",
    dataIndex: "maxContract",
    sorter: true,
    isNumber: true,
    width: 130,
    ...getColumnSearchPropsPaging(
      "maxContract",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "priceMin",
    title: "PRICE MIN",
    dataIndex: "priceMin",
    sorter: true,
    isNumber: true,
    width: 120,
    ...getColumnSearchPropsPaging(
      "priceMin",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "priceNormal",
    title: "PRICE NORMAL",
    dataIndex: "priceNormal",
    sorter: true,
    isNumber: true,
    width: 140,
    ...getColumnSearchPropsPaging(
      "priceNormal",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "priceOup",
    title: "PRICE OUP",
    dataIndex: "priceOup",
    sorter: true,
    isNumber: true,
    width: 120,
    ...getColumnSearchPropsPaging(
      "priceOup",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "amount",
    title: "AMOUNT",
    dataIndex: "amount",
    sorter: true,
    isNumber: true,
    width: 150,
    ...getColumnSearchPropsPaging(
      "amount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "totalAmount",
    title: "TOTAL AMOUNT",
    dataIndex: "totalAmount",
    sorter: true,
    isNumber: true,
    width: 150,
    ...getColumnSearchPropsPaging(
      "totalAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "currency",
    title: "CURRENCY",
    dataIndex: "currency",
    sorter: true,
    isClassification: true,
    width: 100,
    ...getColumnSearchPropsPaging(
      "currency",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "createdBy",
    title: "CREATED BY",
    dataIndex: "createdBy",
    sorter: true,
    width: 150,
    ...getColumnSearchPropsPaging(
      "createdBy",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "createdDate",
    title: "CREATED DATE",
    sorter: true,
    isClassification: true,
    dataIndex: "createdDate",
    width: 150,
    ...getColumnSearchPropsPaging(
      "createdDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      searchedColumn === "createdDate" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[
            searchText
              ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
              : "",
          ]}
          autoEscape
          textToHighlight={
            text ? moment(text).format(dateFormatting.date) : ""
          }
        />
      ) : text === null ? (
        "-"
      ) : (
        moment(text).format(dateFormatting.date)
      ),
  },
  {
    key: "action",
    title: "ACTION",
    isClassification: true,
    width: 100,
    fixed: "right",
    render: (record) => {
      return (
        <Tooltip title="Detail">
          <div className="pt-1 cursor-pointer">
            <EyeOutlined 
              onClick={() => handleDetail(record)} 
              style={{ fontSize: "20px" }} 
            />
          </div>
        </Tooltip>
      );
    },
  },
];