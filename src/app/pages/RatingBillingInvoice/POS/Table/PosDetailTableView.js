import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Tooltip } from "antd";
import SVGIcon from "../../../../../assets/Icon/index";
import {
  getColumnSearchPropsPaging,
  getColumnSearchPropsUseFilteredValue,
} from "../../../../../utils/getColumnSearchProps";
import Highlighter from "react-highlight-words";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import TablePaginationNewTablePOS from "./TablePaginationNewTablePOS";
import { hasValue, renderColumn } from "../../../../../utils";
import { separatorCurrency } from "../Utils";

const onFilter = (dataIndex, value, record) => {
  const fixSearchText = value?.toLowerCase();
  switch (dataIndex) {
    case "price":
    case "quantity":
    case "amount":
    case "amountEqvIdr":
    case "amountEqvUsd":
    case "eqvIdrTaxPurpose":
    case "discount":
    case "total":
    case "totalEqvIdr":
    case "totalEqvUsd":
      const tempValue = record[dataIndex]
        ? (record[dataIndex] + "").split(".")
        : [];
      const thousandSeparator = ".";
      const decimalSeparator = ",";
      const descimal = tempValue[1]
        ? `${decimalSeparator}${tempValue[1]}`
        : `${decimalSeparator}00`;
      const format =
        tempValue.length > 0
          ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
            descimal
          : "";
      return format.toLowerCase().includes(fixSearchText);

    default:
      return record[dataIndex]?.toLowerCase().includes(fixSearchText);
  }
};

// Sorting Table
const sorter = (fieldSort, a, b) => {
  // console.log(fieldSort, a, b, "sprter");
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "price":
      case "quantity":
      case "amount":
      case "amountEqvIdr":
      case "amountEqvUsd":
      case "eqvIdrTaxPurpose":
      case "discount":
      case "total":
      case "totalEqvIdr":
      case "totalEqvUsd":
        // const tempValue = obj[fieldSort]
        //   ? (obj[fieldSort] + "").split(".")
        //   : [];
        // const thousandSeparator = ".";
        // const decimalSeparator = ",";
        // const descimal = tempValue[1]
        //   ? `${decimalSeparator}${tempValue[1]}`
        //   : `${decimalSeparator}00`;
        // const format =
        //   tempValue.length > 0
        //     ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
        //       descimal
        //     : "";
        return obj[fieldSort]
          ? (obj[fieldSort] || 0)?.toString()?.toLowerCase()
          : "0";

      default:
        return obj[fieldSort]?.toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);

  const handleCompare = (a, b) => {
    switch (fieldSort) {
      case "price":
      case "quantity":
      case "amount":
      case "amountEqvIdr":
      case "amountEqvUsd":
      case "eqvIdr":
      case "discount":
      case "total":
      case "totalEqvIdr":
      case "totalEqvUsd":
        return Math.sign(
          parseInt(a.replace(/,/g, "")) - parseInt(b.replace(/,/g, "")),
        );
      default:
        return a.localeCompare(b);
    }
  };

  return handleCompare(fa, fb);
};

const columnDetail = (
  search,
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  type,
  handleDelete = () => {},
  handleUpdate = () => {},
  onFilter,
  sorter,
  data = [],
) => {
  const column = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "TYPE",
      dataIndex: "type",
      align: "center",
      // onFilter: (value, record) => onFilter("type", value, record),
      // sorter: (a, b) => sorter("type", a, b),
      sorter: true,
      // ...getColumnSearchPropsPaging(
      //   "type",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "type",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "type",
          hasValue(search["type"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "ITEM",
      dataIndex: "item",
      // onFilter: (value, record) => onFilter("item", value, record),
      // sorter: (a, b) => sorter("item", a, b),
      sorter: true,
      // ...getColumnSearchPropsPaging(
      //   "item",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "item",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "item",
          hasValue(search["item"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "CURRENCY",
      dataIndex: "currency",
      align: "center",
      // onFilter: (value, record) => onFilter("currency", value, record),
      // sorter: (a, b) => sorter("currency", a, b),
      sorter: true,
      // ...getColumnSearchPropsPaging(
      //   "currency",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "currency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "currency",
          hasValue(search["currency"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "QUANTITY",
      dataIndex: "quantity",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "quantity",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "quantity",
          hasValue(search["quantity"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
      // onFilter: (value, record) => onFilter("quantity", value, record),
      // sorter: (a, b) => sorter("quantity", a, b),
      // ...getColumnSearchPropsPaging(
      //   "quantity",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
    },
    {
      title: "PRICE",
      dataIndex: "price",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "price",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "price",
          hasValue(search["price"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
      // onFilter: (value, record) => onFilter("price", value, record),
      // sorter: (a, b) => sorter("price", a, b),
      // ...getColumnSearchPropsPaging(
      //   "price",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text, record) => {
      //   if (typeof text === "string") {
      //     return text;
      //   } else {
      //     const tempValue = text ? (text + "").split(".") : [];
      //     const thousandSeparator = ".";
      //     const decimalSeparator = ",";
      //     const descimal = tempValue[1]
      //       ? `${decimalSeparator}${tempValue[1]}`
      //       : `${decimalSeparator}00`;
      //     const value =
      //       tempValue.length > 0
      //         ? tempValue[0].replace(
      //             /\B(?=(\d{3})+(?!\d))/g,
      //             thousandSeparator
      //           ) + descimal
      //         : "";
      //     if (searchedColumn === "value") {
      //       const highlight = (
      //         <Highlighter
      //           highlightStyle={{
      //             backgroundColor: "#ffc069",
      //             padding: 0,
      //           }}
      //           searchWords={[searchText]}
      //           autoEscape
      //           textToHighlight={value || ""}
      //         />
      //       );
      //       if (value) {
      //         return highlight;
      //       }
      //       return highlight;
      //     } else {
      //       if (value) {
      //         return value;
      //       }
      //       return "" || 0;
      //     }
      //   }
      // },
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "amount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "amount",
          hasValue(search["amount"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
      // onFilter: (value, record) => onFilter("amount", value, record),
      // sorter: (a, b) => sorter("amount", a, b),
      // ...getColumnSearchPropsPaging(
      //   "amount",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text, record) => {
      //   if (typeof text === "string") {
      //     return text;
      //   } else {
      //     const tempValue = text ? (text + "").split(".") : [];
      //     const thousandSeparator = recor== "IDR" ? "." : ",";
      //     const decimalSeparator = recor== "IDR" ? "," : ".";
      //     const descimal = tempValue[1]
      //       ? `${decimalSeparator}${tempValue[1]}`
      //       : `${decimalSeparator}00`;
      //     const value =
      //       tempValue.length > 0
      //         ? tempValue[0].replace(
      //             /\B(?=(\d{3})+(?!\d))/g,
      //             thousandSeparator
      //           ) + descimal
      //         : "";
      //     if (searchedColumn === "value") {
      //       const highlight = (
      //         <Highlighter
      //           highlightStyle={{
      //             backgroundColor: "#ffc069",
      //             padding: 0,
      //           }}
      //           searchWords={[searchText]}
      //           autoEscape
      //           textToHighlight={value || ""}
      //         />
      //       );
      //       if (value) {
      //         return highlight;
      //       }
      //       return highlight;
      //     } else {
      //       if (value) {
      //         return value;
      //       }
      //       return "" || 0;
      //     }
      //   }
      // },
    },
    {
      title: "REFERENCE",
      dataIndex: "referenceName",
      // sorter: true,
      // ...getColumnSearchPropsPaging(
      //   "reference",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      align: searchedColumn !== "" ? "left" : "center",
      ellipsis: {
        showTitle: false,
      },
      render: (v, r, i) => {
        let text;
        // if (searchedColumn !== "") {
        //   text = r.referenceName;
        //   return (
        //     <Highlighter
        //       highlightStyle={{
        //         backgroundColor: "#ffc069",
        //         padding: 0,
        //       }}
        //       searchWords={[searchText]}
        //       autoEscape
        //       textToHighlight={text ? text.toString() : ""}
        //     />
        //   );
        // } else {
        text =
          // data.findIndex(
          //   (item) => parseInt(item.itemId) === parseInt(r.reference)
          // ) !== -1
          //   ? (page - 1) * pageSize +
          data.findIndex(
            (item) => parseInt(item.itemId) === parseInt(r.reference),
          ) + 1;
        // : r.referenceName;
        if (text) {
          return text;
        }
        return "";
        // }
      },
    },
    {
      title: "UOM",
      dataIndex: "uom",
      align: "center",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "uom",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "uom",
          hasValue(search["uom"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
      // onFilter: (value, record) => onFilter("uom", value, record),
      // sorter: (a, b) => sorter("uom", a, b),
      // ...getColumnSearchPropsPaging(
      //   "uom",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
    },
    {
      title: "POS NUMBER",
      dataIndex: "posNumber",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "posNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "posNumber",
          hasValue(search["posNumber"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
      // onFilter: (value, record) => onFilter("posNumber", value, record),
      // sorter: (a, b) => sorter("posNumber", a, b),
      // ...getColumnSearchPropsPaging(
      //   "posNumber",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
    },
    {
      title: "AMOUNT EQV IDR",
      dataIndex: "amountEqvIdr",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "amountEqvIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "amountEqvIdr",
          hasValue(search["amountEqvIdr"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
      // onFilter: (value, record) => onFilter("amountEqvIdr", value, record),
      // sorter: (a, b) => sorter("amountEqvIdr", a, b),
      // ...getColumnSearchPropsPaging(
      //   "amountEqvIdr",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text, record) => {
      //   if (typeof text === "string") {
      //     return text;
      //   } else {
      //     const tempValue = text ? (text + "").split(".") : [];
      //     const thousandSeparator = ".";
      //     const decimalSeparator = ",";
      //     const descimal = tempValue[1]
      //       ? `${decimalSeparator}${tempValue[1]}`
      //       : `${decimalSeparator}00`;
      //     const value =
      //       tempValue.length > 0
      //         ? tempValue[0].replace(
      //             /\B(?=(\d{3})+(?!\d))/g,
      //             thousandSeparator
      //           ) + descimal
      //         : "";
      //     if (searchedColumn === "value") {
      //       const highlight = (
      //         <Highlighter
      //           highlightStyle={{
      //             backgroundColor: "#ffc069",
      //             padding: 0,
      //           }}
      //           searchWords={[searchText]}
      //           autoEscape
      //           textToHighlight={value || ""}
      //         />
      //       );
      //       if (value) {
      //         return highlight;
      //       }
      //       return highlight;
      //     } else {
      //       if (value) {
      //         return value;
      //       }
      //       return "" || 0;
      //     }
      //   }
      // },
    },
    {
      title: "AMOUNT EQV USD",
      dataIndex: "amountEqvUsd",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "amountEqvUsd",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "amountEqvUsd",
          hasValue(search["amountEqvUsd"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
      // onFilter: (value, record) => onFilter("amountEqvUsd", value, record),
      // sorter: (a, b) => sorter("amountEqvUsd", a, b),
      // ...getColumnSearchPropsPaging(
      //   "amountEqvUsd",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text, record) => {
      //   if (typeof text === "string") {
      //     return text;
      //   } else {
      //     const tempValue = text ? (text + "").split(".") : [];
      //     const thousandSeparator = ",";
      //     const decimalSeparator = ".";
      //     const descimal = tempValue[1]
      //       ? `${decimalSeparator}${tempValue[1]}`
      //       : `${decimalSeparator}00`;
      //     const value =
      //       tempValue.length > 0
      //         ? tempValue[0].replace(
      //             /\B(?=(\d{3})+(?!\d))/g,
      //             thousandSeparator
      //           ) + descimal
      //         : "";
      //     if (searchedColumn === "value") {
      //       const highlight = (
      //         <Highlighter
      //           highlightStyle={{
      //             backgroundColor: "#ffc069",
      //             padding: 0,
      //           }}
      //           searchWords={[searchText]}
      //           autoEscape
      //           textToHighlight={value || ""}
      //         />
      //       );
      //       if (value) {
      //         return Number(highlight).toFixed(2);
      //       }
      //       return highlight;
      //     } else {
      //       if (value) {
      //         // console.log(typeof value, "value");
      //         return Number(value).toFixed(2);
      //       }
      //       return "" || 0;
      //     }
      //   }
      // },
    },
    {
      title: "AMOUNT IDR ( TAX PURPOSE )",
      dataIndex: "eqvIdr",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "eqvIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "eqvIdr",
          hasValue(search["eqvIdr"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
      // onFilter: (value, record) => onFilter("eqvIdr", value, record),
      // sorter: (a, b) => sorter("eqvIdr", a, b),
      // ...getColumnSearchPropsPaging(
      //   "eqvIdr",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text, record) => {
      //   if (typeof text === "string") {
      //     return text;
      //   } else {
      //     const tempValue = text ? (text + "").split(".") : [];
      //     const thousandSeparator = ",";
      //     const decimalSeparator = ".";
      //     const descimal = tempValue[1]
      //       ? `${decimalSeparator}${tempValue[1]}`
      //       : `${decimalSeparator}00`;
      //     const value =
      //       tempValue.length > 0
      //         ? tempValue[0].replace(
      //             /\B(?=(\d{3})+(?!\d))/g,
      //             thousandSeparator
      //           ) + descimal
      //         : "";
      //     if (searchedColumn === "value") {
      //       const highlight = (
      //         <Highlighter
      //           highlightStyle={{
      //             backgroundColor: "#ffc069",
      //             padding: 0,
      //           }}
      //           searchWords={[searchText]}
      //           autoEscape
      //           textToHighlight={value || ""}
      //         />
      //       );
      //       if (value) {
      //         return highlight;
      //       }
      //       return highlight;
      //     } else {
      //       if (value) {
      //         // console.log(typeof value, "value");
      //         return value;
      //       }
      //       return "";
      //     }
      //   }
      // },
    },
    {
      title: "DISCOUNT",
      dataIndex: "discount",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "discount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "discount",
          hasValue(search["discount"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
      // onFilter: (value, record) => onFilter("discount", value, record),
      // sorter: (a, b) => sorter("discount", a, b),
      // ...getColumnSearchPropsPaging(
      //   "discount",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text, record) => {
      //   if (typeof text === "string") {
      //     return text;
      //   } else {
      //     const tempValue = text ? (text + "").split(".") : [];
      //     const thousandSeparator = recor== "IDR" ? "." : ",";
      //     const decimalSeparator = recor== "IDR" ? "," : ".";
      //     const descimal = tempValue[1]
      //       ? `${decimalSeparator}${tempValue[1]}`
      //       : `${decimalSeparator}00`;
      //     const value =
      //       tempValue.length > 0
      //         ? tempValue[0].replace(
      //             /\B(?=(\d{3})+(?!\d))/g,
      //             thousandSeparator
      //           ) + descimal
      //         : "";
      //     if (searchedColumn === "value") {
      //       const highlight = (
      //         <Highlighter
      //           highlightStyle={{
      //             backgroundColor: "#ffc069",
      //             padding: 0,
      //           }}
      //           searchWords={[searchText]}
      //           autoEscape
      //           textToHighlight={value || ""}
      //         />
      //       );
      //       if (value) {
      //         return highlight;
      //       }
      //       return highlight;
      //     } else {
      //       if (value) {
      //         return value;
      //       }
      //       return "" || 0;
      //     }
      //   }
      // },
    },
    {
      title: "TOTAL",
      dataIndex: "total",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "total",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "total",
          hasValue(search["total"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
      // onFilter: (value, record) => onFilter("total", value, record),
      // sorter: (a, b) => sorter("total", a, b),
      // ...getColumnSearchPropsPaging(
      //   "total",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text, record) => {
      //   if (typeof text === "string") {
      //     return text;
      //   } else {
      //     const tempValue = text ? (text + "").split(".") : [];
      //     const thousandSeparator = recor== "IDR" ? "." : ",";
      //     const decimalSeparator = record?.currency === "IDR" ? "," : ".";
      //     const descimal = tempValue[1]
      //       ? `${decimalSeparator}${tempValue[1]}`
      //       : `${decimalSeparator}00`;
      //     const value =
      //       tempValue.length > 0
      //         ? tempValue[0].replace(
      //             /\B(?=(\d{3})+(?!\d))/g,
      //             thousandSeparator
      //           ) + descimal
      //         : "";
      //     if (searchedColumn === "value") {
      //       const highlight = (
      //         <Highlighter
      //           highlightStyle={{
      //             backgroundColor: "#ffc069",
      //             padding: 0,
      //           }}
      //           searchWords={[searchText]}
      //           autoEscape
      //           textToHighlight={value || ""}
      //         />
      //       );
      //       if (value) {
      //         return highlight;
      //       }
      //       return highlight;
      //     } else {
      //       if (value) {
      //         return value;
      //       }
      //       return "" || 0;
      //     }
      //   }
      // },
    },
    {
      title: "TOTAL EQUIVALENT IDR",
      dataIndex: "totalEqvIdr",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "totalEqvIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "totalEqvIdr",
          hasValue(search["totalEqvIdr"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
      // onFilter: (value, record) => onFilter("totalEqvIdr", value, record),
      // sorter: (a, b) => sorter("totalEqvIdr", a, b),
      // ...getColumnSearchPropsPaging(
      //   "totalEqvIdr",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text, record) => {
      //   if (typeof text === "string") {
      //     return text;
      //   } else {
      //     const tempValue = text ? (text + "").split(".") : [];
      //     const thousandSeparator = ".";
      //     const decimalSeparator = ",";
      //     const descimal = tempValue[1]
      //       ? `${decimalSeparator}${tempValue[1]}`
      //       : `${decimalSeparator}00`;
      //     const value =
      //       tempValue.length > 0
      //         ? tempValue[0].replace(
      //             /\B(?=(\d{3})+(?!\d))/g,
      //             thousandSeparator
      //           ) + descimal
      //         : "";
      //     if (searchedColumn === "value") {
      //       const highlight = (
      //         <Highlighter
      //           highlightStyle={{
      //             backgroundColor: "#ffc069",
      //             padding: 0,
      //           }}
      //           searchWords={[searchText]}
      //           autoEscape
      //           textToHighlight={value || ""}
      //         />
      //       );
      //       if (value) {
      //         return highlight;
      //       }
      //       return highlight;
      //     } else {
      //       if (value) {
      //         return value;
      //       }
      //       return "" || 0;
      //     }
      //   }
      // },
    },
    {
      title: "TOTAL EQUIVALENT USD",
      dataIndex: "totalEqvUsd",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "totalEqvUsd",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "totalEqvUsd",
          hasValue(search["totalEqvUsd"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
      // onFilter: (value, record) => onFilter("totalEqvUsd", value, record),
      // sorter: (a, b) => sorter("totalEqvUsd", a, b),
      // ...getColumnSearchPropsPaging(
      //   "totalEqvUsd",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text, record) => {
      //   if (typeof text === "string") {
      //     return text;
      //   } else {
      //     const tempValue = text ? (text + "").split(".") : [];
      //     const thousandSeparator = ",";
      //     const decimalSeparator = ".";
      //     const descimal = tempValue[1]
      //       ? `${decimalSeparator}${tempValue[1]}`
      //       : `${decimalSeparator}00`;
      //     const value =
      //       tempValue.length > 0
      //         ? tempValue[0].replace(
      //             /\B(?=(\d{3})+(?!\d))/g,
      //             thousandSeparator
      //           ) + descimal
      //         : "";
      //     if (searchedColumn === "value") {
      //       const highlight = (
      //         <Highlighter
      //           highlightStyle={{
      //             backgroundColor: "#ffc069",
      //             padding: 0,
      //           }}
      //           searchWords={[searchText]}
      //           autoEscape
      //           textToHighlight={value || ""}
      //         />
      //       );
      //       if (value) {
      //         return Number(highlight).toFixed(2);
      //       }
      //       return highlight;
      //     } else {
      //       if (value) {
      //         return Number(value).toFixed(2);
      //       }
      //       return "" || 0;
      //     }
      //   }
      // },
    },
    {
      title: "REMARK",
      dataIndex: "remark",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "remark",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "remark",
          hasValue(search["remark"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
      // onFilter: (value, record) => onFilter("remark", value, record),
      // sorter: (a, b) => sorter("remark", a, b),
      // ...getColumnSearchPropsPaging(
      //   "remark",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text) => {
      //   if (searchedColumn === "remark") {
      //     return (
      //       <Tooltip placement="topLeft" title={text}>
      //         <Highlighter
      //           highlightStyle={{
      //             backgroundColor: "#ffc069",
      //             padding: 0,
      //           }}
      //           searchWords={[searchText]}
      //           autoEscape
      //           textToHighlight={text ? text.toString() : ""}
      //         />
      //       </Tooltip>
      //     );
      //   } else {
      //     if (text) {
      //       return (
      //         <Tooltip placement="topLeft" title={text}>
      //           {text}
      //         </Tooltip>
      //       );
      //     }
      //     return "";
      //   }
      // },
    },
    {
      title: "ACTION",
      dataIndex: "action",
      fixed: "right",
      align: "center",
      width: 100,
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-4">
            <Tooltip title="Update">
              <div
                className={`pt-1 ${
                  r.item === "PPN" || r.item === "PPH"
                    ? " cursor-not-allowed"
                    : ""
                }`}
              >
                <SVGIcon
                  name="IconEdit"
                  color={
                    r.item !== "PPN" && r.item !== "PPH" ? "#ACC424" : "#8D91A0"
                  }
                  width={24}
                  className={
                    r.item === "PPN" || r.item === "PPH"
                      ? "disabled"
                      : undefined
                  }
                  onClick={() =>
                    r.item !== "PPN" && r.item !== "PPH"
                      ? handleUpdate(r, i)
                      : undefined
                  }
                />
              </div>
            </Tooltip>

            <Tooltip title="Delete">
              <div
                className={`pt-1 ${
                  r.item === "PPN" || r.item === "PPH"
                    ? " cursor-not-allowed"
                    : ""
                }`}
              >
                <SVGIcon
                  name="IconDelete"
                  color={
                    r.item !== "PPN" && r.item !== "PPH" ? "#D90000" : "#8D91A0"
                  }
                  width={24}
                  className={
                    r.item === "PPN" || r.item === "PPH"
                      ? "disabled"
                      : undefined
                  }
                  onClick={() =>
                    r.item !== "PPN" && r.item !== "PPH"
                      ? handleDelete(r)
                      : undefined
                  }
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  if (type === "detail") {
    return column.filter(
      (column) =>
        column.title !== "ACTION" &&
        column.title !== "AMOUNT EQV IDR" &&
        column.title !== "AMOUNT EQV USD" &&
        column.title !== "EQV IDR ( TAX PURPOSE )" &&
        column.title !== "POS NUMBER",
    );
  } else if (type === "confirm") {
    //confirm
    return column.filter(
      (column) => column.title !== "ACTION" && column.title !== "POS NUMBER",
    );
  } else if (type === "calculate") {
    return column.filter((column) => column.title !== "POS NUMBER");
  } else {
    return column;
  }
};

const PosDetailTableView = ({
  data = [],
  handleChange = {},
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  onSort = {},
  type,
  handleDelete = () => {},
  handleUpdate = () => {},
  totalElement,
  search,
}) => {
  const [dataTemp, setDataTemp] = useState([]);

  useEffect(() => {
    setDataTemp(data);
  }, [data]);
  return (
    <Fragment>
      <TablePaginationNewTablePOS
        // type="FE"
        setData={setDataTemp}
        dataSource={data}
        totalData={totalElement}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        tableScrolled={{
          x: 4500,
          y: 300,
        }}
        onSort={onSort}
        columns={columnDetail(
          search,
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          type,
          handleDelete,
          handleUpdate,
          onFilter,
          sorter,
          dataTemp,
        )}
      />
    </Fragment>
  );
};

export default PosDetailTableView;
