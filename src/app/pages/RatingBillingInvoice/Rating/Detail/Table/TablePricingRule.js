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
  handleSearch = () => {}
) => [
  {
    title: "NO",
    width: 60,
    align: "center",
    render: (value, row, index) => {
      let obj = {
        children: (page - 1) * pageSize + row.number + 1,
        props: {
          colSpan: 1,
          rowSpan: row.rowSpan,
        },
      };
      return obj;
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
      handleSearch
    ),
    render: (text, row, index) => {
      let obj = {
        children:
          searchedColumn === "min" ? (
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
          ),
        props: {
          colSpan: 1,
          rowSpan: row.rowSpan,
        },
      };
      return obj;
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
      handleSearch
    ),
    render: (text, row, index) => {
      let obj = {
        children:
          searchedColumn === "maximum" ? (
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
            toTitleCase(text) || ""
          ),
        props: {
          colSpan: 1,
          rowSpan: row.rowSpan,
        },
      };
      return obj;
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
      handleSearch
    ),
    render: (text, row, index) => {
      let obj = {
        children:
          searchedColumn === "priceCode" ? (
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
          ),
        props: {
          colSpan: 1,
          rowSpan: row.rowSpan,
        },
      };
      return obj;
    },
  },
  {
    title: "PRICE DETAIL",
    children: [
      {
        // sorter: true,
        title: "VALUE",
        dataIndex: "value",
        align: "right",
        // ...getColumnSearchPropsPaging(
        //   "value",
        //   searchInput,
        //   searchedColumn,
        //   searchText,
        //   handleSearch
        // ),
        render: (value, record) => (
          <NumericFormat
            displayType="text"
            value={value}
            className="text-right"
            thousandSeparator={","}
            decimalSeparator={"."}
            decimalScale={2}
            fixedDecimalScale
          />
        ),
      },
      {
        // sorter: true,
        title: "CURRENCY",
        dataIndex: "currency",
        align: "center",
        // ...getColumnSearchPropsPaging(
        //   "currency",
        //   searchInput,
        //   searchedColumn,
        //   searchText,
        //   handleSearch
        // ),
      },
      {
        // sorter: true,
        title: "UOM",
        dataIndex: "uom",
        align: "center",
        // ...getColumnSearchPropsPaging(
        //   "uom",
        //   searchInput,
        //   searchedColumn,
        //   searchText,
        //   handleSearch
        // ),
      },
    ],
  },
];
