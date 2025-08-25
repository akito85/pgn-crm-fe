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
  handleSearch = () => { },
  handleDetail
) => [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "TYPE",
      dataIndex: "type",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "type",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "UOM",
      dataIndex: "uom",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsPaging(
        "uom",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "USAGE",
      dataIndex: "usage",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "usage",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "CONVERTED USAGE M3",
      dataIndex: "convUsageM3",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "convUsageM3",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "CONVERTED USAGE MMBTU",
      dataIndex: "convUsageMmbtu",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "convUsageMmbtu",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "DISCOUNT USAGE",
      dataIndex: "discountUsage",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "discountUsage",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "DISCOUNT USAGE M3",
      dataIndex: "discountUsageM3",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "discountUsageM3",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "DISCOUNT USAGE MMBTU",
      dataIndex: "discountUsageMmbtu",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "discountUsageMmbtu",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "TOTAL USAGE",
      dataIndex: "totalUsage",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "totalUsage",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "CONVERTED TOTAL USAGE M3",
      dataIndex: "convTotalUsageM3",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "convTotalUsageM3",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "CONVERTED TOTAL USAGE MMBTU",
      dataIndex: "convTotalUsageMmbtu",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "convTotalUsageMmbtu",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "PRICE CODE",
      dataIndex: "priceCode",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "priceCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "CURRENCY",
      dataIndex: "currency",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsPaging(
        "currency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "PRICE",
      dataIndex: "price",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "price",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "amount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "AMOUNT EQV IDR",
      dataIndex: "amountEqvIdr",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "amountEqvIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "AMOUNT EQV USD",
      dataIndex: "amountEqvUsd",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "amountEqvUsd",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "DISCOUNT AMOUNT",
      dataIndex: "discountAmount",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "discountAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "DISCOUNT AMOUNT EQV IDR",
      dataIndex: "discountAmountEqvIdr",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "discountAmountEqvIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "DISCOUNT AMOUNT EQV USD",
      dataIndex: "discountAmountEqvUsd",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "discountAmountEqvUsd",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "totalAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    // {
    //   title: "TOTAL AMOUNT EQV IDR",
    //   dataIndex: "totalAmountEqvIdr",
    //   sorter: true,
    //   align: "right",
    //   ...getColumnSearchPropsPaging(
    //     "totalAmountEqvIdr",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch
    //   ),
    // },
    // {
    //   title: "TOTAL AMOUNT EQV USD",
    //   dataIndex: "totalAmountEqvUsd",
    //   sorter: true,
    //   align: "right",
    //   ...getColumnSearchPropsPaging(
    //     "totalAmountEqvUsd",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch
    //   ),
    // },
    {
      title: "CREATED DATE",
      sorter: true,
      align: "center",
      dataIndex: "createdDate",
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
            textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
          />
        ) : text === null ? (
          "-"
        ) : (
          moment(text).format(dateFormatting.date)
        ),
    },
    {
      sorter: true,
      title: "REMARK",
      dataIndex: "remark",
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
      title: "ACTION",
      // dataIndex: "remark",
      fixed: 'right',
      width: 120,
      align:'center',
      render: (record) => {
        return (
          <Tooltip title="Detail">
            <div className="pt-1">
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
