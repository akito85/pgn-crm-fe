import Highlighter from "react-highlight-words";
import moment from "moment";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";

export const columnsAdjustmentBilling = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search
  // handleApprovalHistory = () => {},
  // handleDelete = () => {}
) => [
  {
    key: "no",
    title: "NO",
    isClassification: true,
    width: 60,
    render: (text, object, index) => index + 1,
  },
  {
    key: "referenceInvoiceNumber",
    title: "INVOICE NUMBER",
    dataIndex: "referenceInvoiceNumber",
    isClassification: true,
    width: 170,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "referenceInvoiceNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "referenceInvoiceNumber",
        hasValue(search["referenceInvoiceNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "referenceInvoiceNumber",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "adjustmentNumber",
    title: "ADJUSTMENT NUMBER",
    dataIndex: "adjustmentNumber",
    isClassification: true,
    sorter: true,
    width: 200,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "adjustmentNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "adjustmentNumber",
        hasValue(search["adjustmentNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "adjustmentNumber",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "adjustmentTypeName",
    title: "TYPE",
    dataIndex: "adjustmentTypeName",
    sorter: true,
    width: 100,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "adjustmentTypeName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "adjustmentTypeName",
        hasValue(search["adjustmentTypeName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "adjustmentTypeName",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "billingCycleName",
    title: "BILLING CYCLE",
    dataIndex: "billingCycleName",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billingCycleName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "billingCycleName",
        hasValue(search["billingCycleName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "billingCycleName",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "billingPeriodName",
    title: "BILLING PERIOD",
    sorter: true,
    width: 170,
    dataIndex: "billingPeriodName",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billingPeriodName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datePeriod"
    ),
    render: (text) =>
      renderDateColumn(
        "billingPeriodName",
        hasValue(search["billingPeriodName"]),
        searchText,
        text,
        "datePeriod",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "billingPeriodName",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "customerNumber",
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    sorter: true,
    width: 190,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "customerNumber",
        hasValue(search["customerNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "customerNumber",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "customerName",
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    sorter: true,
    width: 185,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "customerName",
        hasValue(search["customerName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "customerName",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "accountNumber",
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    sorter: true,
    width: 185,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "accountNumber",
        hasValue(search["accountNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "accountNumber",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "accountName",
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    sorter: true,
    width: 165,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "accountName",
        hasValue(search["accountName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "accountName",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "accountGroupType",
    title: "ACCOUNT GROUP TYPE",
    dataIndex: "accountGroupType",
    sorter: true,
    width: 200,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountGroupType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "accountGroupType",
        hasValue(search["accountGroupType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "accountGroupType",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "sor",
    title: "SOR",
    dataIndex: "sor",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "sor",
        hasValue(search["sor"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "sor",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "costCenter",
    title: "COST CENTER",
    dataIndex: "costCenter",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "costCenter",
        hasValue(search["costCenter"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "costCenter",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "accountSegment",
    title: "ACCOUNT SEGMENT",
    dataIndex: "accountSegment",
    sorter: true,
    width: 185,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountSegment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "accountSegment",
        hasValue(search["accountSegment"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "accountSegment",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "meterReadingCode",
    title: "METER READING CODE",
    dataIndex: "meterReadingCode",
    sorter: true,
    width: 200,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "meterReadingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "meterReadingCode",
        hasValue(search["meterReadingCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "currency",
    title: "CURRENCY",
    dataIndex: "currency",
    sorter: true,
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
    key: "totalAdjustmentAmountIdr",
    title: "TOTAL ADJUSTMENT AMOUNT IDR",
    dataIndex: "totalAdjustmentAmountIdr",
    sorter: true,
    width: 260,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAdjustmentAmountIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "totalAdjustmentAmountIdr",
        hasValue(search["totalAdjustmentAmountIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalAdjustmentAmountUsd",
    title: "TOTAL ADJUSTMENT AMOUNT USD",
    dataIndex: "totalAdjustmentAmountUsd",
    width: 270,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAdjustmentAmountUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "totalAdjustmentAmountUsd",
        hasValue(search["totalAdjustmentAmountUsd"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "termsOfPayment",
    title: "TERMS OF PAYMENT",
    dataIndex: "termsOfPayment",
    width: 190,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "termsOfPayment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    // render: (text) =>
    //   renderColumn(
    //     "termsOfPayment",
    //     hasValue(search["termsOfPayment"]),
    //     searchText,
    //     text,
    //     false,
    //     "input",
    //     search
    //   ),
    render: (index) => {
      const isValidDate = (dateString) => {
        const date = new Date(dateString);
        return !isNaN(date);
      };
      const text = isValidDate(index)
        ? moment(index).format("DD MMM YYYY")
        : index;
      if (searchedColumn === "termsOfPayment") {
        return (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={
              Object.values(search)?.includes(searchText)
                ? [search["termsOfPayment"]]
                : []
            }
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        );
      } else {
        return text || "";
      }
    },
  },
  {
    key: "transactionDate",
    title: "TRANSACTION DATE",
    sorter: true,
    width: 180,
    dataIndex: "transactionDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "transactionDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "generateDate",
        hasValue(search["generateDate"]),
        searchText,
        text,
        "date",
        search
      ),
    // render: (text) =>
    //   searchedColumn === "transactionDate" ? (
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
    key: "documentDate",
    title: "DOCUMENT DATE",
    sorter: true,
    width: 180,
    dataIndex: "documentDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "documentDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "documentDate",
        hasValue(search["documentDate"]),
        searchText,
        text,
        "date",
        search
      ),
    // render: (text) =>
    //   searchedColumn === "documentDate" ? (
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
    key: "adjustmentReasonName",
    title: "ADJUSTMENT REASON",
    dataIndex: "adjustmentReasonName",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "adjustmentReasonName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "adjustmentReasonName",
        hasValue(search["adjustmentReasonName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "rateType",
    title: "RATE TYPE",
    dataIndex: "rateType",
    sorter: true,
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
    key: "rate",
    title: "RATE",
    dataIndex: "rate",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "rate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "rate",
        hasValue(search["rate"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "rateDate",
    title: "RATE DATE",
    sorter: true,
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
    key: "remark",
    dataIndex: "remark",
    title: "REMARK",
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
      true
    ),
    render: (text) =>
      renderColumn(
        "remark",
        hasValue(search["remark"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // render: (text) =>
    //   searchedColumn === "remark" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
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
  {
    key: "classification",
    title: "CLASSIFICATION ADJUSTMENT",
    dataIndex: "classification",
    sorter: true,
    width: 230,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "classification",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "classification",
        hasValue(search["classification"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "postInvoice",
    title: "POST INVOICE",
    dataIndex: "postInvoice",
    sorter: true,
    width: 150,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "postInvoice",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "postInvoice",
        hasValue(search["postInvoice"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "onDemand",
    title: "ON DEMAND",
    dataIndex: "onDemand",
    sorter: true,
    width: 140,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "onDemand",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "onDemand",
        hasValue(search["onDemand"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (index) => {
      let text;
      switch (index) {
        case "WAITING APPROVAL":
          text = "Waiting Approval";
          break;
        default:
          text = index
            ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
            : index;
          break;
      }
      return text
        ? renderColumn(
            "status",
            hasValue(search["status"]),
            searchText,
            text,
            false,
            "status",
            search
          )
        : text;
    },
  },
  {
    key: "statusApproval",
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "statusApproval",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (index) => {
      let text;
      switch (index) {
        case "WAITING APPROVAL":
          text = "Waiting Approval";
          break;
        default:
          text = index
            ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
            : index;
          break;
      }
      return text
        ? renderColumn(
            "statusApproval",
            hasValue(search["statusApproval"]),
            searchText,
            text,
            false,
            "status",
            search
          )
        : text;
    },
  },
  // {
  //   title: "ACTION",
  //
  //   width: 100,
  //   dataIndex: "id",
  //   fixed: "right",
  //   render: (id, record) => {
  //     return (
  //       <div className="flex w-full justify-center gap-4">
  //         <Popover
  //           trigger={"click"}
  //           placement="bottomRight"
  //           content={
  //             <Space direction="vertical">
  //               <Link
  //                 to={RBI_ROUTES.ADJUSTMENT_BILLING_DETAIL}
  //                 state={{ id: id }}
  //               >
  //                 <ButtonComponent
  //                   icon={<SVGIcon name="IconDetail" width={24} />}
  //                   border={false}
  //                 >
  //                   <span className={"text-black ml-3"}> Detail</span>
  //                 </ButtonComponent>
  //               </Link>

  //               {record.statusApproval === "DRAFT" ||
  //               record.statusApproval === "REJECTED" ? (
  //                 <Link
  //                   to={RBI_ROUTES.ADJUSTMENT_BILLING_UPDATE}
  //                   state={{
  //                     id: id,
  //                     adjustmentNumber: record.adjustmentNumber,
  //                   }}
  //                 >
  //                   <ButtonComponent
  //                     icon={
  //                       <SVGIcon name="IconEdit" color={"#0075bf"} width={24} />
  //                     }
  //                     border={false}
  //                   >
  //                     <span className={"text-black ml-3"}> Update</span>
  //                   </ButtonComponent>
  //                 </Link>
  //               ) : (
  //                 <ButtonComponent
  //                   icon={
  //                     <SVGIcon name="IconEdit" color={"#0075bf"} width={24} />
  //                   }
  //                   border={false}
  //                   disabled={true}
  //                 >
  //                   <span className={"text-black ml-3"}> Update</span>
  //                 </ButtonComponent>
  //               )}

  //               <ButtonComponent
  //                 icon={
  //                   <SVGIcon
  //                     name="IconLogHistory"
  //                     color={"#0075bf"}
  //                     width={24}
  //                   />
  //                 }
  //                 border={false}
  //                 onClick={() => handleApprovalHistory(id)}
  //               >
  //                 <span className={"text-black ml-3"}>Approval History</span>
  //               </ButtonComponent>
  //             </Space>
  //           }
  //         >
  //           <div className="pt-1">
  //             <MoreOutlined
  //               style={{
  //                 fontSize: "24px",
  //                 color: "#0075bf",
  //                 cursor: "pointer",
  //               }}
  //             />
  //           </div>
  //         </Popover>

  //         {record.statusApproval === "DRAFT" ||
  //         record.statusApproval === "REJECTED" ? (
  //           <Tooltip title="Delete">
  //             <div className="pt-1">
  //               <SVGIcon
  //                 name="IconDelete"
  //                 color={"#D90000"}
  //                 width={24}
  //                 onClick={() => handleDelete(id)}
  //               />
  //             </div>
  //           </Tooltip>
  //         ) : (
  //           <Tooltip title="Delete">
  //             <div className="pt-1">
  //               <SVGIcon
  //                 name="IconDelete"
  //                 color={"#8D91A0"}
  //                 width={24}
  //                 className="disabled cursor-not-allowed"
  //               />
  //             </div>
  //           </Tooltip>
  //         )}
  //       </div>
  //     );
  //   },
  // },
];
