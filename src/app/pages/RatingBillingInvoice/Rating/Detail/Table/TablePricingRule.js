import Highlighter from "react-highlight-words";
import { NumericFormat } from "react-number-format";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import { toTitleCase } from "../../../../../../utils";

export const columnsPricingRule = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
) => [
  {
    title: "NO",
    width: 60,
    align: "center",
    render: (value, row, index) => {
      return (page - 1) * pageSize + index + 1;
    },
  },
  {
    sorter: true,
    title: "MINIMUM",
    dataIndex: "min",
    align: "right",
    ...getColumnSearchPropsPaging(
      "min",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text, row, index) => {
      return searchedColumn === "min" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text || ""
      );
    },
  },
  {
    sorter: true,
    title: "MAXIMUM",
    dataIndex: "max",
    align: "right",
    ...getColumnSearchPropsPaging(
      "max",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text, row, index) => {
      return searchedColumn === "max" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text || ""
      );
    },
  },
  {
    sorter: true,
    title: "PRICE CODE",
    dataIndex: "priceCode",
    align: "left",
    ...getColumnSearchPropsPaging(
      "priceCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text, row, index) => {
      return searchedColumn === "priceCode" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text || ""
      );
    },
  },
  {
    title: "PRICE DETAIL",
    children: [
      {
        title: "VALUE",
        dataIndex: "value",
        align: "right",
        render: (value, record) => {
          // Remove comma and convert to number for NumericFormat
          const numericValue =
            typeof value === "string"
              ? parseFloat(value.replace(/,/g, ""))
              : value;

          return (
            <NumericFormat
              displayType="text"
              value={numericValue}
              className="text-right"
              thousandSeparator={","}
              decimalSeparator={"."}
              decimalScale={2}
              fixedDecimalScale
            />
          );
        },
      },
      {
        title: "CURRENCY",
        dataIndex: "currency",
        align: "center",
      },
      {
        title: "UOM",
        dataIndex: "uom",
        align: "center",
      },
    ],
  },
];
