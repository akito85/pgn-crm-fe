import { Tooltip } from "antd";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../assets/Icon/index";
import { separatorCurrency } from "../Utils";
import { hasValue, renderColumn } from "../../../../../utils";

export const columnsTablePOSDetailInfo = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleUpdate = () => {},
  handleDelete = () => {},
  onFilter = () => {},
  sorter = () => {},
  data = [],
  type,
) => {
  const column = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "TYPE",
      dataIndex: "type",
      align: "center",
      // onFilter: (value, record) => onFilter("type", value, record),
      filteredValue: search?.["type"] ? [search?.["type"]] : null,
      sorter: (a, b) => sorter("type", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "type",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
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
      // ...getColumnSearchPropsPaging(
      //   "type",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
    },
    {
      title: "ITEM",
      dataIndex: "item",
      // onFilter: (value, record) => onFilter("item", value, record),
      filteredValue: search?.["item"] ? [search?.["item"]] : null,
      sorter: (a, b) => sorter("item", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "item",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
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
      // ...getColumnSearchPropsPaging(
      //   "item",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
    },
    {
      title: "CURRENCY",
      dataIndex: "currency",
      align: "center",
      // onFilter: (value, record) => onFilter("currency", value, record),
      filteredValue: search?.["currency"] ? [search?.["currency"]] : null,
      sorter: (a, b) => sorter("currency", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "currency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
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
      // ...getColumnSearchPropsPaging(
      //   "currency",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
    },
    {
      title: "QUANTITY",
      dataIndex: "quantity",
      align: "right",
      // onFilter: (value, record) => onFilter("quantity", value, record),
      filteredValue: search?.["quantity"] ? [search?.["quantity"]] : null,
      sorter: (a, b) => sorter("quantity", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "quantity",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
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
      // ...getColumnSearchPropsPaging(
      //   "quantity",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text) => {
      //   if (searchedColumn === "quantity") {
      //     return (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={text ? text.toString() : ""}
      //       />
      //     );
      //   } else {
      //     if (text) {
      //       return text;
      //     }
      //     return "";
      //   }
      // },
    },
    {
      title: "PRICE",
      dataIndex: "price",
      align: "right",
      // onFilter: (value, record) => onFilter("price", value, record),
      filteredValue: search?.["price"] ? [search?.["price"]] : null,
      sorter: (a, b) => sorter("price", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "price",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "price",
          hasValue(search["price"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search,
        ),
      // ...getColumnSearchPropsPaging(
      //   "price",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text, record) => {
      //   const tempValue = text ? (text + "").split(".") : [];
      //   const thousandSeparator = ",";
      //   const decimalSeparator = ".";
      //   const descimal = tempValue[1]
      //     ? `${decimalSeparator}${formatToTwoDecimalPlaces(tempValue[1])}`
      //     : `${decimalSeparator}00`;
      //   const value =
      //     tempValue.length > 0
      //       ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
      //         descimal
      //       : 0 + descimal;
      //   if (searchedColumn === "price") {
      //     const highlight = (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={value || ""}
      //       />
      //     );
      //     if (value) {
      //       return highlight;
      //     }
      //     return highlight;
      //   } else {
      //     if (value) {
      //       return value;
      //     }
      //     return "";
      //   }
      // },
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      align: "right",
      // onFilter: (value, record) => onFilter("amount", value, record),
      filteredValue: search?.["amount"] ? [search?.["amount"]] : null,
      sorter: (a, b) => sorter("amount", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "amount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "amount",
          hasValue(search["amount"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search,
        ),
      // ...getColumnSearchPropsPaging(
      //   "amount",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text, record) => {
      //   const tempValue = text ? (text + "").split(".") : [];
      //   const thousandSeparator = ",";
      //   const decimalSeparator = ".";
      //   const descimal = tempValue[1]
      //     ? `${decimalSeparator}${formatToTwoDecimalPlaces(tempValue[1])}`
      //     : `${decimalSeparator}00`;
      //   const value =
      //     tempValue.length > 0
      //       ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
      //         descimal
      //       : 0 + descimal;
      //   if (searchedColumn === "amount") {
      //     const highlight = (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={value || ""}
      //       />
      //     );
      //     if (value) {
      //       return highlight;
      //     }
      //     return highlight;
      //   } else {
      //     if (value) {
      //       return value;
      //     }
      //     return "";
      //   }
      // },
    },
    {
      title: "REFERENCE",
      dataIndex: "referenceName",
      // sorter: true,
      // ...getColumnSearchPropsPaging(
      //   "referenceName",
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
        //greater or less than the index on page
        const check =
          data.findIndex(
            (item) => parseInt(item.itemId) === parseInt(r.reference),
          ) !== -1
            ? data.findIndex(
                (item) => parseInt(item.itemId) === parseInt(r.reference),
              ) +
                1 >=
                (page - 1) * pageSize + 1 &&
              data.findIndex(
                (item) => parseInt(item.itemId) === parseInt(r.reference),
              ) +
                1 <=
                page * pageSize
            : false;
        text =
          // !check
          //   ? r.referenceName
          //   :
          data.findIndex(
            (item) => parseInt(item.itemId) === parseInt(r.reference),
          ) + 1;
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
      // onFilter: (value, record) => onFilter("uom", value, record),
      filteredValue: search?.["uom"] ? [search?.["uom"]] : null,
      sorter: (a, b) => sorter("uom", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "uom",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
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
      // ...getColumnSearchPropsPaging(
      //   "uom",
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
      // onFilter: (value, record) => onFilter("amountEqvIdr", value, record),
      sorter: (a, b) => sorter("amountEqvIdr", a, b),
      filteredValue: search?.["amountEqvIdr"]
        ? [search?.["amountEqvIdr"]]
        : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "amountEqvIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "amountEqvIdr",
          hasValue(search["amountEqvIdr"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search,
        ),
      // ...getColumnSearchPropsPaging(
      //   "amountEqvIdr",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text, record) => {
      //   const tempValue = text ? (text + "").split(".") : [];
      //   const thousandSeparator = ",";
      //   const decimalSeparator = ".";
      //   const descimal = tempValue[1]
      //     ? `${decimalSeparator}${formatToTwoDecimalPlaces(tempValue[1])}`
      //     : `${decimalSeparator}00`;
      //   const value =
      //     tempValue.length > 0
      //       ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
      //         descimal
      //       : 0 + descimal;
      //   if (searchedColumn === "amountEqvIdr") {
      //     const highlight = (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={value || ""}
      //       />
      //     );
      //     if (value) {
      //       return highlight;
      //     }
      //     return highlight;
      //   } else {
      //     if (value) {
      //       return value;
      //     }
      //     return "";
      //   }
      // },
    },
    {
      title: "AMOUNT EQV USD",
      dataIndex: "amountEqvUsd",
      align: "right",
      // onFilter: (value, record) => onFilter("amountEqvUsd", value, record),
      filteredValue: search?.["amountEqvUsd"]
        ? [search?.["amountEqvUsd"]]
        : null,
      sorter: (a, b) => sorter("amountEqvUsd", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "amountEqvUsd",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "amountEqvUsd",
          hasValue(search["amountEqvUsd"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search,
        ),
      // ...getColumnSearchPropsPaging(
      //   "amountEqvUsd",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text, record) => {
      //   const tempValue = text ? (text + "").split(".") : [];
      //   const thousandSeparator = ",";
      //   const decimalSeparator = ".";
      //   const descimal = tempValue[1]
      //     ? `${decimalSeparator}${formatToTwoDecimalPlaces(tempValue[1])}`
      //     : `${decimalSeparator}00`;
      //   const value =
      //     tempValue.length > 0
      //       ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
      //         descimal
      //       : 0 + descimal;
      //   if (searchedColumn === "amountEqvUsd") {
      //     const highlight = (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={value || ""}
      //       />
      //     );
      //     if (value) {
      //       return highlight;
      //     }
      //     return highlight;
      //   } else {
      //     if (value) {
      //       return value;
      //     }
      //     return "";
      //   }
      // },
    },
    {
      title: "AMOUNT IDR (TAX PURPOSE)",
      dataIndex: "eqvIdr",
      align: "right",
      // onFilter: (value, record) => onFilter("eqvIdr", value, record),
      filteredValue: search?.["eqvIdr"] ? [search?.["eqvIdr"]] : null,
      sorter: (a, b) => sorter("eqvIdr", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "eqvIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "eqvIdr",
          hasValue(search["eqvIdr"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search,
        ),
      // ...getColumnSearchPropsPaging(
      //   "eqvIdr",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text, record) => {
      //   const tempValue = text ? (text + "").split(".") : [];
      //   const thousandSeparator = ",";
      //   const decimalSeparator = ".";
      //   const descimal = tempValue[1]
      //     ? `${decimalSeparator}${formatToTwoDecimalPlaces(tempValue[1])}`
      //     : `${decimalSeparator}00`;
      //   const value =
      //     tempValue.length > 0
      //       ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
      //         descimal
      //       : 0 + descimal;
      //   if (searchedColumn === "eqvIdr") {
      //     const highlight = (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={value || ""}
      //       />
      //     );
      //     if (value) {
      //       return highlight;
      //     }
      //     return highlight;
      //   } else {
      //     if (value) {
      //       return value;
      //     }
      //     return "";
      //   }
      // },
    },
    {
      title: "DISCOUNT",
      dataIndex: "discount",
      align: "right",
      // onFilter: (value, record) => onFilter("discount", value, record),
      filteredValue: search?.["discount"] ? [search?.["discount"]] : null,
      sorter: (a, b) => sorter("discount", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "discount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "discount",
          hasValue(search["discount"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search,
        ),
      // ...getColumnSearchPropsPaging(
      //   "discount",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text, record) => {
      //   const tempValue = text ? (text + "").split(".") : [];
      //   const thousandSeparator = ",";
      //   const decimalSeparator = ".";
      //   const descimal = tempValue[1]
      //     ? `${decimalSeparator}${formatToTwoDecimalPlaces(tempValue[1])}`
      //     : `${decimalSeparator}00`;
      //   const value =
      //     tempValue.length > 0
      //       ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
      //         descimal
      //       : 0 + descimal;
      //   if (searchedColumn === "discount") {
      //     const highlight = (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={value || ""}
      //       />
      //     );
      //     if (value) {
      //       return highlight;
      //     }
      //     return highlight;
      //   } else {
      //     if (value) {
      //       return value;
      //     }
      //     return "";
      //   }
      // },
    },
    {
      title: "TOTAL",
      dataIndex: "total",
      align: "right",
      // onFilter: (value, record) => onFilter("total", value, record),
      filteredValue: search?.["total"] ? [search?.["total"]] : null,
      sorter: (a, b) => sorter("total", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "total",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "total",
          hasValue(search["total"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search,
        ),
      // ...getColumnSearchPropsPaging(
      //   "total",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text, record) => {
      //   const tempValue = text ? (text + "").split(".") : [];
      //   const thousandSeparator = ",";
      //   const decimalSeparator = ".";
      //   const descimal = tempValue[1]
      //     ? `${decimalSeparator}${formatToTwoDecimalPlaces(tempValue[1])}`
      //     : `${decimalSeparator}00`;
      //   const value =
      //     tempValue.length > 0
      //       ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
      //         descimal
      //       : 0 + descimal;
      //   if (searchedColumn === "total") {
      //     const highlight = (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={value || ""}
      //       />
      //     );
      //     if (value) {
      //       return highlight;
      //     }
      //     return highlight;
      //   } else {
      //     if (value) {
      //       return value;
      //     }
      //     return "";
      //   }
      // },
    },
    {
      title: "TOTAL EQUIVALENT IDR",
      dataIndex: "totalEqvIdr",
      align: "right",
      // onFilter: (value, record) => onFilter("totalEqvIdr", value, record),
      filteredValue: search?.["totalEqvIdr"] ? [search?.["totalEqvIdr"]] : null,
      sorter: (a, b) => sorter("totalEqvIdr", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
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
          separatorCurrency(text),
          false,
          "input",
          search,
        ),
      // ...getColumnSearchPropsPaging(
      //   "totalEqvIdr",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text, record) => {
      //   const tempValue = text ? (text + "").split(".") : [];
      //   const thousandSeparator = ",";
      //   const decimalSeparator = ".";
      //   const descimal = tempValue[1]
      //     ? `${decimalSeparator}${formatToTwoDecimalPlaces(tempValue[1])}`
      //     : `${decimalSeparator}00`;
      //   const value =
      //     tempValue.length > 0
      //       ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
      //         descimal
      //       : 0 + descimal;
      //   if (searchedColumn === "totalEqvIdr") {
      //     const highlight = (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={value || ""}
      //       />
      //     );
      //     if (value) {
      //       return highlight;
      //     }
      //     return highlight;
      //   } else {
      //     if (value) {
      //       return value;
      //     }
      //     return "";
      //   }
      // },
    },
    {
      title: "TOTAL EQUIVALENT USD",
      dataIndex: "totalEqvUsd",
      align: "right",
      // onFilter: (value, record) => onFilter("totalEqvUsd", value, record),
      sorter: (a, b) => sorter("totalEqvUsd", a, b),
      filteredValue: search?.["totalEqvUsd"] ? [search?.["totalEqvUsd"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(
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
          separatorCurrency(text),
          false,
          "input",
          search,
        ),
      // ...getColumnSearchPropsPaging(
      //   "totalEqvUsd",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text, record) => {
      //   const tempValue = text ? (text + "").split(".") : [];
      //   const thousandSeparator = ",";
      //   const decimalSeparator = ".";
      //   const descimal = tempValue[1]
      //     ? `${decimalSeparator}${formatToTwoDecimalPlaces(tempValue[1])}`
      //     : `${decimalSeparator}00`;
      //   const value =
      //     tempValue.length > 0
      //       ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
      //         descimal
      //       : 0 + descimal;
      //     if (searchedColumn === "totalEqvUsd") {
      //     const highlight = (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={value || ""}
      //       />
      //     );
      //     if (value) {
      //       return highlight;
      //     }
      //     return highlight;
      //   } else {
      //     if (value) {
      //       return value;
      //     }
      //     return "";
      //   }
      // },
    },
    {
      title: "REMARK",
      dataIndex: "remark",
      width: 240,
      // onFilter: (value, record) => onFilter("remark", value, record),
      filteredValue: search?.["remark"] ? [search?.["remark"]] : null,
      sorter: (a, b) => sorter("remark", a, b),
      ellipsis: {
        showTitle: false,
      },
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
      //onFilter: (value, record) => //onFilter("remark", value, record),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "remark",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
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
                    r.item !== "PPN" && r.item !== "PPH" && r.item !== "Meterai"
                      ? "#ACC424"
                      : "#8D91A0"
                  }
                  width={24}
                  className={
                    r.item === "PPN" || r.item === "PPH" || r.item === "Meterai"
                      ? "disabled"
                      : undefined
                  }
                  onClick={() =>
                    r.item !== "PPN" && r.item !== "PPH" && r.item !== "Meterai"
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
                    r.item !== "PPN" && r.item !== "PPH" && r.item !== "Meterai"
                      ? "#D90000"
                      : "#8D91A0"
                  }
                  width={24}
                  className={
                    r.item === "PPN" || r.item === "PPH" || r.item === "Meterai"
                      ? "disabled"
                      : undefined
                  }
                  onClick={() =>
                    r.item !== "PPN" && r.item !== "PPH" && r.item !== "Meterai"
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
  if (type !== "editable") {
    // console.log("column");
    return column.filter((item) => item.dataIndex !== "action");
  } else {
    return column;
  }
};
