import { NumericFormat } from "react-number-format";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";

export const columnsReceipt = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleModalApprovalHistory = (id) => {},
  handleDeleteReceipt = (record) => {},
) => [
  {
    title: "NO",
    width: 60,
    align: "center",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "RECEIPT CODE",
    dataIndex: "receiptCode",
    key: "receiptCode",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "receiptCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "receiptCode",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "COST CENTER",
    dataIndex: "costCenter",
    key: "costCenter",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    ellipsis: {
      showTitle: false,
    },
    render: (text) =>
      renderColumn(
        "costCenter",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search,
      ),
  },
  {
    title: "CUSTOMER",
    dataIndex: "customer",
    key: "customer",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customer",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "customer",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "SOR",
    dataIndex: "sor",
    // align: "center",
    sorter: true,
    // width: 150,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "sor",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "ACCOUNT TYPE",
    dataIndex: "accountType",
    align: "center",
    sorter: true,
    width: 180,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "accountType",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "ACCOUNT GROUP",
    dataIndex: "accountGroup",
    align: "center",
    sorter: true,
    width: 180,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountGroup",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "accountGroup",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "ACCOUNT",
    dataIndex: "account",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "account",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "account",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "ACCOUNT SEGMENT",
    dataIndex: "accountSegment",
    align: "center",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountSegment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "accountSegment",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "RECEIPT NUMBER",
    dataIndex: "receiptNumber",
    key: "receiptNumber",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "receiptNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "receiptNumber",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "RECEIPT DATE",
    dataIndex: "receiptDate",
    key: "receiptDate",
    sorter: true,
    align: "center",
    width: 220,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "receiptDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datetime",
    ),
    render: (text) =>
      renderDateColumn(
        "receiptDate",
        hasValue(search["receiptDate"]),
        searchText,
        text,
        "datetime",
        search,
      ),
  },
  {
    title: "PAYMENT TYPE",
    dataIndex: "paymentType",
    key: "paymentType",
    sorter: true,
    width: 180,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "paymentType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "paymentType",
        searchedColumn,
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
    key: "currency",
    align: "center",
    sorter: true,
    width: 150,
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
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "AMOUNT",
    dataIndex: "amount",
    key: "amount",
    align: "Right",
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
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "RECEIPT METHOD",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "paymentMethod",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "paymentMethod",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "RECEIPT CHANNEL",
    dataIndex: "receiptChannel",
    key: "receiptChannel",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "receiptChannel",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "receiptChannel",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "IS RECONCILED",
    dataIndex: "isReconciled",
    key: "isReconciled",
    sorter: true,
    width: 160,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "isReconciled",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (index) => {
      let text;
      switch (index) {
        case true:
          text = "TRUE";
          break;
        case false:
          text = "FALSE";
          break;
        default:
          text = index
            ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
            : index;
          break;
      }
      return renderColumn(
        "isReconciled",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      );
    },
  },
  {
    title: "MISCELLANEOUS",
    dataIndex: "isMisc",
    sorter: true,
    width: 180,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "isMisc",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (index) => {
      let text;
      switch (index) {
        case true:
          text = "TRUE";
          break;
        case false:
          text = "FALSE";
          break;
        default:
          text = index
            ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
            : index;
          break;
      }
      return renderColumn(
        "isMisc",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      );
    },
  },
  {
    title: "BANK",
    dataIndex: "bank",
    key: "bank",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "bank",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "bank",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "COLLECTING AGENT",
    dataIndex: "collectingAgent",
    key: "collectingAgent",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "collectingAgent",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "collectingAgent",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "DELIVERY CHANNEL",
    dataIndex: "deliveryChannel",
    key: "deliveryChannel",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "deliveryChannel",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "deliveryChannel",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "TRANSACTION CALENDAR",
    dataIndex: "paymentCycle",
    key: "paymentCycle",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "paymentCycle",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "paymentCycle",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "TRANSACTION PERIOD",
    dataIndex: "paymentPeriod",
    key: "paymentPeriod",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "paymentPeriod",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "paymentPeriod",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "RATE TYPE",
    dataIndex: "rateType",
    key: "rateType",
    sorter: true,
    width: 130,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "rateType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "rateType",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "RATE DATE",
    dataIndex: "rateDate",
    align: "center",
    key: "rateDate",
    sorter: true,
    width: 150,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "rateDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
    ),
    render: (text) =>
      renderDateColumn(
        "rateDate",
        hasValue(search["rateDate"]),
        searchText,
        text,
        "date",
        search,
      ),
  },
  {
    title: "RATE",
    dataIndex: "rateAmount",
    key: "rateAmount",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "rateAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "rateAmount",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "CONVERTED CURRENCY",
    dataIndex: "convertedCurrency",
    key: "convertedCurrency",
    align: "center",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "convertedCurrency",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "convertedCurrency",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "AMOUNT EQUIVALENT",
    dataIndex: "equivalentAmount",
    key: "equivalentAmount",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "equivalentAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "equivalentAmount",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "REFERENCE",
    dataIndex: "refNumber",
    key: "refNumber",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "refNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "refNumber",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "BANK STATMENT NAME",
    dataIndex: "bankStatementName",
    key: "bankStatementName",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "bankStatementName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "bankStatementName",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "SOURCE",
    dataIndex: "source",
    key: "source",
    sorter: true,
    width: 180,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "source",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "source",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "BANK STATEMENT DATE",
    dataIndex: "bankStatementDate",
    key: "bankStatementDate",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "bankStatementDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
    ),
    render: (text) =>
      renderDateColumn(
        "bankStatementDate",
        hasValue(search["bankStatementDate"]),
        searchText,
        text,
        "date",
        search,
      ),
  },
  {
    title: "APPLIED AMOUNT",
    dataIndex: "appliedAmount",
    key: "appliedAmount",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "appliedAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (appliedAmount) => (
      <NumericFormat
        displayType="text"
        value={appliedAmount}
        className="text-right"
        thousandSeparator={true}
        decimalScale={2}
        fixedDecimalScale
      />
    ),
  },
  {
    title: "APPLIED AMOUNT EQUIVALENT",
    dataIndex: "equivalentAppliedAmount",
    key: "equivalentAppliedAmount",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "equivalentAppliedAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (equivalentAppliedAmount) => (
      <NumericFormat
        displayType="text"
        value={equivalentAppliedAmount}
        className="text-right"
        thousandSeparator={true}
        decimalScale={2}
        fixedDecimalScale
      />
    ),
  },
  {
    title: "UNAPPLIED AMOUNT",
    dataIndex: "unAppliedAmount",
    key: "unAppliedAmount",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "unAppliedAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (unAppliedAmount) => (
      <NumericFormat
        displayType="text"
        value={unAppliedAmount}
        className="text-right"
        thousandSeparator={true}
        decimalScale={2}
        fixedDecimalScale
      />
    ),
  },
  {
    title: "UNAPPLIED AMOUNT EQUIVALENT",
    dataIndex: "equivalentUnAppliedAmount",
    key: "equivalentUnAppliedAmount",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "equivalentUnAppliedAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (equivalentUnApplyAmount) => (
      <NumericFormat
        displayType="text"
        value={equivalentUnApplyAmount}
        className="text-right"
        thousandSeparator={true}
        decimalScale={2}
        fixedDecimalScale
      />
    ),
  },
  {
    title: "REFUND AMOUNT",
    dataIndex: "refundAmount",
    key: "refundAmount",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "refundAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (refundAmount) => (
      <NumericFormat
        displayType="text"
        value={refundAmount}
        className="text-right"
        thousandSeparator={true}
        decimalScale={2}
        fixedDecimalScale
      />
    ),
  },
  {
    title: "TRANSFER AMOUNT",
    dataIndex: "transferAmount",
    key: "transferAmount",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "transferAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (transferAmount) => (
      <NumericFormat
        displayType="text"
        value={transferAmount}
        className="text-right"
        thousandSeparator={true}
        decimalScale={2}
        fixedDecimalScale
      />
    ),
  },
  {
    title: "CREATED DATE",
    dataIndex: "createdDate",
    key: "createdDate",
    align: "center",
    sorter: true,
    width: 220,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "createdDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datetime",
    ),
    render: (text) =>
      renderDateColumn(
        "createdDate",
        hasValue(search["createdDate"]),
        searchText,
        text,
        "datetime",
        search,
      ),
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    key: "remark",
    align: "left",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    ellipsis: {
      showTitle: false,
    },
    render: (text) =>
      renderColumn(
        "description",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search,
      ),
  },
  {
    title: "STATUS",
    dataIndex: "status",
    key: "status",
    sorter: true,
    fixed: "right",
    width: 120,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "status",
        searchedColumn,
        searchText,
        text,
        false,
        "status",
        search,
      ),
  },
  {
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    key: "statusApproval",
    sorter: true,
    fixed: "right",
    width: 190,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "statusApproval",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "statusApproval",
        searchedColumn,
        searchText,
        text,
        false,
        "status",
        search,
      ),
  },

  // {
  //   title: "ACTION",
  //   align: "center",
  //   dataIndex: "receiptId",
  //   fixed: "right",
  //   width: 120,
  //   render: (id, r) => {
  //     return (
  //       <div className="flex w-full justify-center gap-4 mt-1 ">
  //         <Popover
  //           content={
  //             <div>
  //               <Link
  //                 to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_RECEIPT}
  //                 state={{ id: r?.id }}
  //               >
  //                 <ButtonComponent
  //                   className="gap-5"
  //                   icon={<SVGIcon name="IconDetail" width={24} />}
  //                   border={false}
  //                 >
  //                   <span className={"text-black gap-2 text-xl text-center"}>
  //                     Detail
  //                   </span>
  //                 </ButtonComponent>
  //               </Link>

  //               <Link
  //               // to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_RECEIPT}
  //               // state={{ id: id }}
  //               >
  //                 <ButtonComponent
  //                   className="gap-5"
  //                   icon={
  //                     <SVGIcon name="IconEdit" color={"#808080"} width={24} />
  //                   }
  //                   border={false}
  //                   disabled={true}
  //                 >
  //                   <span className={"text-black gap-2 text-xl text-center"}>
  //                     Update
  //                   </span>
  //                 </ButtonComponent>
  //               </Link>

  //               <Link
  //               // to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_RECEIPT}
  //               // state={{ id: id }}
  //               >
  //                 <ButtonComponent
  //                   className="gap-5"
  //                   icon={
  //                     <SVGIcon
  //                       name="IconTransfer"
  //                       color={"#808080"}
  //                       width={24}
  //                     />
  //                   }
  //                   border={false}
  //                   disabled={true}
  //                 >
  //                   <span className={"text-black gap-2 text-xl text-center"}>
  //                     Transfer
  //                   </span>
  //                 </ButtonComponent>
  //               </Link>

  //               <Link
  //               // to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_RECEIPT}
  //               // state={{ id: id }}
  //               >
  //                 <ButtonComponent
  //                   className="gap-5"
  //                   icon={
  //                     <SVGIcon name="IconRevers" color={"#808080"} width={24} />
  //                   }
  //                   border={false}
  //                   disabled={true}
  //                 >
  //                   <span className={"text-black gap-2 text-xl text-center"}>
  //                     Reverse
  //                   </span>
  //                 </ButtonComponent>
  //               </Link>

  //               <Link
  //               // to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_RECEIPT}
  //               // state={{ id: id }}
  //               >
  //                 <ButtonComponent
  //                   className="gap-5"
  //                   icon={
  //                     <SVGIcon name="IconRefund" color={"#808080"} width={24} />
  //                   }
  //                   border={false}
  //                   disabled={true}
  //                 >
  //                   <span className={"text-black gap-2 text-xl text-center"}>
  //                     Refund
  //                   </span>
  //                 </ButtonComponent>
  //               </Link>

  //               <Link
  //               // to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_RECEIPT}
  //               // state={{ id: id }}
  //               >
  //                 <ButtonComponent
  //                   className="gap-5"
  //                   icon={
  //                     <SVGIcon name="IconHold" color={"#808080"} width={24} />
  //                   }
  //                   border={false}
  //                   disabled={true}
  //                 >
  //                   <span className={"text-black gap-2 text-xl text-center"}>
  //                     Hold
  //                   </span>
  //                 </ButtonComponent>
  //               </Link>

  //               <Link
  //               // to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_RECEIPT}
  //               // state={{ id: id }}
  //               >
  //                 <ButtonComponent
  //                   className="gap-5"
  //                   icon={
  //                     <SVGIcon name="IconSend" color={"#808080"} width={24} />
  //                   }
  //                   border={false}
  //                   disabled={true}
  //                 >
  //                   <span className={"text-black gap-2 text-xl text-center"}>
  //                     Release
  //                   </span>
  //                 </ButtonComponent>
  //               </Link>

  //               <Link
  //               // to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_RECEIPT}
  //               // state={{ id: id }}
  //               >
  //                 <ButtonComponent
  //                   className="gap-5"
  //                   icon={
  //                     <SVGIcon
  //                       name="IconLogHistory"
  //                       color={"#0075BF"}
  //                       width={24}
  //                     />
  //                   }
  //                   border={false}
  //                   disabled={false}
  //                   onClick={() => handleModalApprovalHistory(r?.id)}
  //                 >
  //                   <span className={"text-black gap-2 text-xl text-center"}>
  //                     Approval History
  //                   </span>
  //                 </ButtonComponent>
  //               </Link>
  //             </div>
  //           }
  //           trigger={"click"}
  //           placement="bottomRight"
  //         >
  //           {/* <ButtonComponent icon={<MoreOutlined />} border={false} /> */}
  //           {/* <Tooltip title="Detail"> */}
  //           <div>
  //             <MoreOutlined style={{ color: "var(--primary)" }} size={24} />
  //           </div>
  //           {/* </Tooltip> */}
  //         </Popover>
  //         <Tooltip title="Delete">
  //           {r?.status === "Draft" && r?.statusApproval === "Rejected" ? (
  //             <div onClick={() => handleDeleteReceipt(r)}>
  //               <SVGIcon name="IconDelete" width={24} />
  //             </div>
  //           ) : (
  //             <div className={"cursor-not-allowed"}>
  //               <SVGIcon
  //                 name="IconDelete"
  //                 width={24}
  //                 color={"#C0BEC6"}
  //                 className={"cursor-not-allowed"}
  //               />
  //             </div>
  //           )}
  //         </Tooltip>
  //       </div>
  //     );
  //   },
  // },
];
