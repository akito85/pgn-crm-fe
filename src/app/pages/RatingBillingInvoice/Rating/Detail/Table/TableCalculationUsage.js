import Highlighter from "react-highlight-words";
import moment from "moment";
import { Tooltip } from "antd";
import { dateFormatting } from "../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../../assets/Icon/index";

export const columnsCalculationUsage = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleDetail,
) => [
  {
    key: "no",
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    key: "type",
    title: "TYPE",
    dataIndex: "type",
    sorter: true,
    width: 150,
    ...getColumnSearchPropsPaging(
      "type",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "uom",
    title: "UOM",
    dataIndex: "uom",
    sorter: true,
    align: "center",
    width: 100,
    ...getColumnSearchPropsPaging(
      "uom",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "usage",
    title: "USAGE",
    dataIndex: "usage",
    sorter: true,
    align: "right",
    width: 150,
    ...getColumnSearchPropsPaging(
      "usage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "convUsageM3",
    title: "CONVERTED USAGE M3",
    dataIndex: "convUsageM3",
    sorter: true,
    align: "right",
    width: 180,
    ...getColumnSearchPropsPaging(
      "convUsageM3",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "convUsageMmbtu",
    title: "CONVERTED USAGE MMBTU",
    dataIndex: "convUsageMmbtu",
    sorter: true,
    align: "right",
    width: 200,
    ...getColumnSearchPropsPaging(
      "convUsageMmbtu",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "discountUsage",
    title: "DISCOUNT USAGE",
    dataIndex: "discountUsage",
    sorter: true,
    align: "right",
    width: 150,
    ...getColumnSearchPropsPaging(
      "discountUsage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "discountUsageM3",
    title: "DISCOUNT USAGE M3",
    dataIndex: "discountUsageM3",
    sorter: true,
    align: "right",
    width: 180,
    ...getColumnSearchPropsPaging(
      "discountUsageM3",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "discountUsageMmbtu",
    title: "DISCOUNT USAGE MMBTU",
    dataIndex: "discountUsageMmbtu",
    sorter: true,
    align: "right",
    width: 200,
    ...getColumnSearchPropsPaging(
      "discountUsageMmbtu",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "totalUsage",
    title: "TOTAL USAGE",
    dataIndex: "totalUsage",
    sorter: true,
    align: "right",
    width: 150,
    ...getColumnSearchPropsPaging(
      "totalUsage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "convTotalUsageM3",
    title: "CONVERTED TOTAL USAGE M3",
    dataIndex: "convTotalUsageM3",
    sorter: true,
    align: "right",
    width: 220,
    ...getColumnSearchPropsPaging(
      "convTotalUsageM3",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "convTotalUsageMmbtu",
    title: "CONVERTED TOTAL USAGE MMBTU",
    dataIndex: "convTotalUsageMmbtu",
    sorter: true,
    align: "right",
    width: 240,
    ...getColumnSearchPropsPaging(
      "convTotalUsageMmbtu",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "priceCode",
    title: "PRICE CODE",
    dataIndex: "priceCode",
    sorter: true,
    width: 200,
    ...getColumnSearchPropsPaging(
      "priceCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "currency",
    title: "CURRENCY",
    dataIndex: "currency",
    sorter: true,
    align: "center",
    width: 100,
    ...getColumnSearchPropsPaging(
      "currency",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "price",
    title: "PRICE",
    dataIndex: "price",
    sorter: true,
    align: "right",
    width: 150,
    ...getColumnSearchPropsPaging(
      "price",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "amount",
    title: "AMOUNT",
    dataIndex: "amount",
    sorter: true,
    align: "right",
    width: 150,
    ...getColumnSearchPropsPaging(
      "amount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "amountEqvIdr",
    title: "AMOUNT EQV IDR",
    dataIndex: "amountEqvIdr",
    sorter: true,
    align: "right",
    width: 180,
    ...getColumnSearchPropsPaging(
      "amountEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "amountEqvUsd",
    title: "AMOUNT EQV USD",
    dataIndex: "amountEqvUsd",
    sorter: true,
    align: "right",
    width: 180,
    ...getColumnSearchPropsPaging(
      "amountEqvUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "discountAmount",
    title: "DISCOUNT AMOUNT",
    dataIndex: "discountAmount",
    sorter: true,
    align: "right",
    width: 180,
    ...getColumnSearchPropsPaging(
      "discountAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "discountAmountEqvIdr",
    title: "DISCOUNT AMOUNT EQV IDR",
    dataIndex: "discountAmountEqvIdr",
    sorter: true,
    align: "right",
    width: 220,
    ...getColumnSearchPropsPaging(
      "discountAmountEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "discountAmountEqvUsd",
    title: "DISCOUNT AMOUNT EQV USD",
    dataIndex: "discountAmountEqvUsd",
    sorter: true,
    align: "right",
    width: 220,
    ...getColumnSearchPropsPaging(
      "discountAmountEqvUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "totalAmount",
    title: "TOTAL AMOUNT",
    dataIndex: "totalAmount",
    sorter: true,
    align: "right",
    width: 180,
    ...getColumnSearchPropsPaging(
      "totalAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "createdDate",
    title: "CREATED DATE",
    sorter: true,
    align: "center",
    dataIndex: "createdDate",
    width: 150,
    ...getColumnSearchPropsPaging(
      "createdDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
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
          textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
        />
      ) : text === null ? (
        "-"
      ) : (
        moment(text).format(dateFormatting.date)
      ),
  },
  {
    key: "remark",
    sorter: true,
    title: "REMARK",
    dataIndex: "remark",
    width: 200,
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsPaging("remark"),
    render: (text) =>
      searchedColumn === "remark" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : (
        "-"
      ),
  },
  {
    key: "action",
    title: "ACTION",
    width: 100,
    align: "center",
    render: (record) => {
      return (
        <Tooltip title="Detail">
          <div className="pt-1 cursor-pointer">
            <SVGIcon
              name="IconDetail"
              width={24}
              onClick={() => handleDetail(record)}
            />
          </div>
        </Tooltip>
      );
    },
  },
];
