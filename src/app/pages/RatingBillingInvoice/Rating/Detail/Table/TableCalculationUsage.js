import Highlighter from "react-highlight-words";
import moment from "moment";
import { Tooltip } from "antd";
import { dateFormatting } from "../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../../assets/Icon/index"

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
    width: 20,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    key: "ratingType",
    title: "RATING TYPE",
    dataIndex: "ratingType",
    sorter: true,
    isClassification: true,
    width: 80,
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
    isClassification:true,
    sorter: true,
    width: 80,
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
    isClassification:true,
    sorter: true,
    width: 90,
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
    isClassification:true,
    sorter: true,
    width: 100,
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
    isClassification:true,
    sorter: true,
    width: 60,
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
    isClassification:true,
    sorter: true,
    width: 70,
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
    width: 80,
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
    width: 100,
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
    width: 50,
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
    width: 40,
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
    width: 80,
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
    width: 100,
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
    width: 60,
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
    width: 60,
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
    width: 50,
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
    width: 80,
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
    width: 60,
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
    width: 50,
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
    width: 80,
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
    width: 60,
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
    isClassification:true,
    sorter: true,
    width: 100,
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
    width: 100,
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
    width: 30,
    fixed: "right",
    render: (record) => {
      return (
        <Tooltip title="Detail">
          <div className="pt-1 cursor-pointer">
            <SVGIcon name="IconDetail" width={20}  onClick={() => handleDetail(record)} />
          </div>
        </Tooltip>
      );
    },
  },
];