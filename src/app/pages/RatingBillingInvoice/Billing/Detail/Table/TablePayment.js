import {
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../utils";
import {
  getColumnSearchPropsUseFilteredValue,
} from "../../../../../../utils/getColumnSearchProps";

export const columnsPayment = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search
) => [
  {
    title: "NO",
    width: 50,
    dataIndex: "no",
    align: "center",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "RECEIPT CODE",
    dataIndex: "receiptCode",
    sorter: true,
    filteredValue: search?.["receiptCode"] ? [search?.["receiptCode"]] : null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "receiptCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "receiptCode",
        hasValue(search["receiptCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "RECEIPT DATE",
    sorter: true,
    filteredValue: search?.["receiptDate"]
      ? [search?.["receiptDate"]]
      : null,
    align: "center",
    dataIndex: "receiptDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "receiptDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "receiptDate",
        hasValue(search["receiptDate"]),
        searchText,
        text,
        "date",
        search
      ),
    // render: (text) =>
    //   searchedColumn === "receiptDate" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[
    //         searchText
    //           ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
    //           : "",
    //       ]}
    //       autoEscape
    //       textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
    //     />
    //   ) : text === null ? (
    //     ""
    //   ) : (
    //     moment(text).format(dateFormatting.date)
    //   ),
  },
  {
    title: "CURRENCY",
    dataIndex: "currency",
    sorter: true,
    filteredValue: search?.["currency"]
      ? [search?.["currency"]]
      : null,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "currency",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "currency",
        hasValue(search["currency"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "AMOUNT",
    dataIndex: "amount",
    sorter: true,
    filteredValue: search?.["amount"]
      ? [search?.["amount"]]
      : null,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "amount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "amount",
        hasValue(search["amount"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "PAYMENT TYPE",
    dataIndex: "paymentType",
    sorter: true,
    filteredValue: search?.["paymentType"]
      ? [search?.["paymentType"]]
      : null,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "paymentType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "paymentType",
        hasValue(search["paymentType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "METHOD",
    dataIndex: "method",
    sorter: true,
    filteredValue: search?.["method"]
      ? [search?.["method"]]
      : null,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "method",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "method",
        hasValue(search["method"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "RECEIPT NUMBER",
    dataIndex: "receiptNumber",
    sorter: true,
    filteredValue: search?.["receiptNumber"]
      ? [search?.["receiptNumber"]]
      : null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "receiptNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "receiptNumber",
        hasValue(search["receiptNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "RECEIPT CHANNEL",
    dataIndex: "receiptChannel",
    sorter: true,
    filteredValue: search?.["receiptChannel"]
      ? [search?.["receiptChannel"]]
      : null,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "receiptChannel",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "receiptChannel",
        hasValue(search["receiptChannel"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "BANK",
    dataIndex: "bank",
    sorter: true,
    filteredValue: search?.["bank"]
      ? [search?.["bank"]]
      : null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "bank",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "bank",
        hasValue(search["bank"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "COLLECTING AGENT",
    dataIndex: "collectingAgent",
    sorter: true,
    filteredValue: search?.["collectingAgent"]
      ? [search?.["collectingAgent"]]
      : null,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "collectingAgent",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "collectingAgent",
        hasValue(search["collectingAgent"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "DELIVERY CHANNEL",
    dataIndex: "deliveryChannel",
    sorter: true,
    filteredValue: search?.["deliveryChannel"]
      ? [search?.["deliveryChannel"]]
      : null,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "deliveryChannel",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "deliveryChannel",
        hasValue(search["deliveryChannel"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "RATE TYPE",
    dataIndex: "rateType",
    sorter: true,
    filteredValue: search?.["rateType"]
      ? [search?.["rateType"]]
      : null,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "rateType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "rateType",
        hasValue(search["rateType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "RATE DATE",
    sorter: true,
    filteredValue: search?.["rateDate"]
      ? [search?.["rateDate"]]
      : null,
    align: "center",
    dataIndex: "rateDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "rateDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "rateDate",
        hasValue(search["rateDate"]),
        searchText,
        text,
        "date",
        search
      ),
    // render: (text) =>
    //   searchedColumn === "rateDate" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[
    //         searchText
    //           ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
    //           : "",
    //       ]}
    //       autoEscape
    //       textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
    //     />
    //   ) : text === null ? (
    //     ""
    //   ) : (
    //     moment(text).format(dateFormatting.date)
    //   ),
  },
  {
    title: "RATE AMOUNT",
    dataIndex: "rateAmount",
    sorter: true,
    filteredValue: search?.["rateAmount"]
      ? [search?.["rateAmount"]]
      : null,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "rateAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "rateAmount",
        hasValue(search["rateAmount"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  // {
  //   title: "AMOUNT IDR",
  //   dataIndex: "amountIdr",
  //   sorter: true,
  //   filteredValue: search?.["amountIdr"]
  //     ? [search?.["amountIdr"]]
  //     : null,
  //   align: "right",
  //   ...getColumnSearchPropsUseFilteredValue(
  //     search,
  //     "amountIdr",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch,
  //     true
  //   ),
  //   render: (text) =>
  //     renderColumn(
  //       "amountIdr",
  //       hasValue(search["amountIdr"]),
  //       searchText,
  //       text,
  //       false,
  //       "input",
  //       search
  //     ),
  // },
  // {
  //   title: "AMOUNT USD",
  //   dataIndex: "amountUsd",
  //   sorter: true,
  //   filteredValue: search?.["amountUsd"]
  //     ? [search?.["amountUsd"]]
  //     : null,
  //   align: "right",
  //   ...getColumnSearchPropsUseFilteredValue(
  //     search,
  //     "amountUsd",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch,
  //     true
  //   ),
  //   render: (text) =>
  //     renderColumn(
  //       "amountUsd",
  //       hasValue(search["amountUsd"]),
  //       searchText,
  //       text,
  //       false,
  //       "input",
  //       search
  //     ),
  // },
  {
    title: "REFERENCE NUMBER",
    dataIndex: "referenceNumber",
    sorter: true,
    filteredValue: search?.["referenceNumber"]
      ? [search?.["referenceNumber"]]
      : null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "referenceNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "referenceNumber",
        hasValue(search["referenceNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "BANK STATEMENT DATE",
    sorter: true,
    filteredValue: search?.["bankStatementDate"]
      ? [search?.["bankStatementDate"]]
      : null,
    align: "center",
    dataIndex: "bankStatementDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "bankStatementDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "bankStatementDate",
        hasValue(search["bankStatementDate"]),
        searchText,
        text,
        "date",
        search
      ),
    // render: (text) =>
    //   searchedColumn === "bankStatementDate" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[
    //         searchText
    //           ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
    //           : "",
    //       ]}
    //       autoEscape
    //       textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
    //     />
    //   ) : text === null ? (
    //     ""
    //   ) : (
    //     moment(text).format(dateFormatting.date)
    //   ),
  },
  {
    title: "CREATED DATE",
    sorter: true,
    filteredValue: search?.["createdDate"]
      ? [search?.["createdDate"]]
      : null,
    align: "center",
    dataIndex: "createdDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "createdDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "createdDate",
        hasValue(search["createdDate"]),
        searchText,
        text,
        "date",
        search
      ),
    // render: (text) =>
    //   searchedColumn === "createdDate" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[
    //         searchText
    //           ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
    //           : "",
    //       ]}
    //       autoEscape
    //       textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
    //     />
    //   ) : text === null ? (
    //     ""
    //   ) : (
    //     moment(text).format(dateFormatting.date)
    //   ),
  },
];
