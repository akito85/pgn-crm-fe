import Highlighter from "react-highlight-words";
import moment from "moment";
import { Tooltip } from "antd";
import {
  dateFormatting,
  hasValue,
  renderColumn,
  renderDateColumn,
  separatorNumber,
} from "../../../../../../utils";
import {
  getColumnSearchPropsPaging,
  getColumnSearchPropsUseFilteredValue,
} from "../../../../../../utils/getColumnSearchProps";

export const columnsBillingItem = (
  pageBI = 1,
  pageSizeBI = 10,
  searchInput,
  searchedColumnBI,
  searchTextBI,
  handleSearchBI = () => {},
  searchBI,
) => [
  {
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (pageBI - 1) * pageSizeBI + index + 1,
  },
  {
    title: "ITEM",
    dataIndex: "item",
    sorter: true,
    align: "left",
    // ...getColumnSearchPropsPaging(
    //   "item",
    //   searchInput,
    //   searchedColumnBI,
    //   searchTextBI,
    //   handleSearchBI
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "item",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true,
    ),
    render: (text) =>
      renderColumn(
        "item",
        hasValue(searchBI["item"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
      ),
  },
  {
    title: "QUANTITY",
    dataIndex: "quantity",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "quantity",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true,
    ),
    render: (text) =>
      renderColumn(
        "quantity",
        hasValue(searchBI["quantity"]),
        searchTextBI,
        separatorNumber(text),
        false,
        "input",
        searchBI,
      ),
  },
  {
    title: "UOM",
    dataIndex: "uom",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "uom",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true,
    ),
    render: (text) =>
      renderColumn(
        "uom",
        hasValue(searchBI["uom"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
      ),
  },
  {
    title: "CURRENCY",
    dataIndex: "currency",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "currency",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true,
    ),
    render: (text) =>
      renderColumn(
        "currency",
        hasValue(searchBI["currency"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
      ),
  },
  {
    title: "PRICE CODE",
    dataIndex: "priceCode",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "priceCode",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true,
    ),
    render: (text) =>
      renderColumn(
        "priceCode",
        hasValue(searchBI["priceCode"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
      ),
  },
  {
    title: "PRICE",
    dataIndex: "price",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "price",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true,
    ),
    render: (text) =>
      renderColumn(
        "price",
        hasValue(searchBI["price"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
      ),
  },
  {
    title: "AMOUNT",
    dataIndex: "amount",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "amount",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true,
    ),
    render: (text) =>
      renderColumn(
        "amount",
        hasValue(searchBI["amount"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
      ),
  },
  {
    title: "DISCOUNT MOUNT",
    dataIndex: "discountAmount",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "discountAmount",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true,
    ),
    render: (text) =>
      renderColumn(
        "discountAmount",
        hasValue(searchBI["discountAmount"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
      ),
  },
  {
    title: "TOTAL AMOUNT",
    dataIndex: "totalAmount",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "totalAmount",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true,
    ),
    render: (text) =>
      renderColumn(
        "totalAmount",
        hasValue(searchBI["totalAmount"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
      ),
  },
  {
    title: "TOTAL AMOUNT EQV IDR",
    dataIndex: "totalAmountEqvIdr",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "totalAmountEqvIdr",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true,
    ),
    render: (text) =>
      renderColumn(
        "totalAmountEqvIdr",
        hasValue(searchBI["totalAmountEqvIdr"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
      ),
  },
  {
    title: "TOTAL AMOUNT EQV USD",
    dataIndex: "totalAmountEqvUsd",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "totalAmountEqvUsd",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true,
    ),
    render: (text) =>
      renderColumn(
        "totalAmountEqvUsd",
        hasValue(searchBI["totalAmountEqvUsd"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
      ),
  },
  // {
  //   title: "RATE TYPE", //
  //   dataIndex: "rateType",
  //   sorter: true,
  //   align: "center",
  //   ...getColumnSearchPropsUseFilteredValue(
  //     searchBI,
  //     "rateType",
  //     searchInput,
  //     searchedColumnBI,
  //     searchTextBI,
  //     handleSearchBI,
  //     true
  //   ),
  //   render: (text) =>
  //     renderColumn(
  //       "rateType",
  //       hasValue(searchBI["rateType"]),
  //       searchTextBI,
  //       text,
  //       false,
  //       "input",
  //       searchBI
  //     ),
  // },
  // {
  //   title: "RATE", //
  //   dataIndex: "rate",
  //   sorter: true,
  //   align: "right",
  //   ...getColumnSearchPropsUseFilteredValue(
  //     searchBI,
  //     "rate",
  //     searchInput,
  //     searchedColumnBI,
  //     searchTextBI,
  //     handleSearchBI,
  //     true
  //   ),
  //   render: (text) =>
  //     renderColumn(
  //       "rate",
  //       hasValue(searchBI["rate"]),
  //       searchTextBI,
  //       text,
  //       false,
  //       "input",
  //       searchBI
  //     ),
  // },
  // {
  //   title: "RATE DATE", //
  //   sorter: true,
  //   align: "center",
  //   dataIndex: "rateDate",
  //   ...getColumnSearchPropsUseFilteredValue(
  //     searchBI,
  //     "rateDate",
  //     searchInput,
  //     searchedColumnBI,
  //     searchTextBI,
  //     handleSearchBI,
  //     true,
  //     "date"
  //   ),
  //   render: (text) =>
  //     renderDateColumn(
  //       "rateDate",
  //       hasValue(searchBI["rateDate"]),
  //       searchTextBI,
  //       text,
  //       "date",
  //       searchBI
  //     ),
  //   // render: (text) =>
  //   //   searchedColumnBI === "rateDate" ? (
  //   //     <Highlighter
  //   //       highlightStyle={{
  //   //         backgroundColor: "#ffc069",
  //   //         padding: 0,
  //   //       }}
  //   //       searchWords={[
  //   //         searchTextBI
  //   //           ? moment(searchTextBI, "YYYY-MM-DD").format(dateFormatting.date)
  //   //           : "",
  //   //       ]}
  //   //       autoEscape
  //   //       textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
  //   //     />
  //   //   ) : text === null ? (
  //   //     ""
  //   //   ) : (
  //   //     moment(text).format(dateFormatting.date)
  //   //   ),
  // },
  {
    title: "REFERENCE",
    dataIndex: "reference",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "reference",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true,
    ),
    render: (text) =>
      renderColumn(
        "reference",
        hasValue(searchBI["reference"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
      ),
  },
  {
    title: "TYPE BASIS",
    dataIndex: "typeBasis",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "typeBasis",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true,
    ),
    render: (text) =>
      renderColumn(
        "typeBasis",
        hasValue(searchBI["typeBasis"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI,
      ),
  },
  {
    sorter: true,
    title: "DESCRIPTION",
    dataIndex: "description",
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "description",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true,
    ),
    render: (text) =>
      renderColumn(
        "description",
        hasValue(searchBI["description"]),
        searchTextBI,
        text,
        true,
        "input",
        searchBI,
      ),
    // ...getColumnSearchPropsPaging("description"),
    // render: (text) =>
    //   searchedColumnBI === "description" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[searchTextBI]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ""}
    //     />
    //   ) : text ? (
    //     <Tooltip placement="topLeft" title={text}>
    //       {text}
    //     </Tooltip>
    //   ) : (
    //     ""
    //   ),
  },
];
