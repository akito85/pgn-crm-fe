import {
  DownloadOutlined,
} from "@ant-design/icons";
import SVGIcon from "../../../../assets/Icon/index";
import { Tooltip, Spin } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";
import TablePagination from "../../../../components/TablePagination";
import {
  downloadReceiptHistories,
  getReciptHistoriesPagging,
} from "../../../../redux/slices/receipt_collection/receiptHistories";
import { dateFormatting, hasValue, toTitleCase } from "../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../components/StatusComponent";
import { NumericFormat } from "react-number-format";
import { sorterFunction } from "../../../../utils/sorterFunction";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import useGrantAccessHooks from "../../../../components/useGrantAccessHooks";
import Toolbar from "../../../../components/Toolbar";

export const columns = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
) => [
  {
    title: "NO",
    width: 60,
    align: "center",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "RECEIPT CODE",
    dataIndex: "id",
    align: "left",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "id",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      searchedColumn === "id" ? (
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
        ""
      ),
  },
  {
    title: "COST CENTER",
    dataIndex: "costCenter",
    key: "costCenter",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    ellipsis: {
      showTitle: false,
    },
    render: (text) =>
      searchedColumn === "costCenter" ? (
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
        ""
      ),
  },
  {
    title: "CUSTOMER",
    dataIndex: "customer",
    sorter: true,
    align: "left",
    ...getColumnSearchPropsPaging(
      "customer",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      searchedColumn === "customer" ? (
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
        ""
      ),
  },
  {
    title: "ACCOUNT",
    dataIndex: "account",
    key: "account",
    // align: "right",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "account",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "account" ? (
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
        ""
      ),
  },
  {
    title: "RECEIPT NUMBER",
    dataIndex: "receiptNumber",
    key: "receiptNumber",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "receiptNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "receiptNumber" ? (
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
        ""
      ),
  },
  {
    title: "RECEIPT DATE",
    dataIndex: "receiptDate",
    key: "receiptDate",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsPaging(
      "receiptDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      "date"
    ),
    render: (text) =>
      searchedColumn === "startDate" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[
            searchText
              ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.dateTime)
              : "",
          ]}
          autoEscape
          textToHighlight={
            text ? moment(text).format(dateFormatting.dateTime) : ""
          }
        />
      ) : text === null ? (
        "-"
      ) : (
        moment(text).format(dateFormatting.dateTime)
      ),
  },
  {
    title: "CURRENCY",
    dataIndex: "currency",
    key: "currency",
    align: "center",
    sorter: true,
    width: 150,
    ...getColumnSearchPropsPaging(
      "currency",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "currency" ? (
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
        ""
      ),
  },
  {
    title: "AMOUNT",
    dataIndex: "amount",
    key: "amount",
    align: "Right",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "amount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "amount" ? (
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
        ""
      ),
  },
  {
    title: "TYPE",
    dataIndex: "paymentType",
    key: "paymentType",
    sorter: true,
    width: 150,
    align: "center",
    ...getColumnSearchPropsPaging(
      "paymentType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "paymentType" ? (
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
        ""
      ),
  },
  {
    title: "METHOD",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "paymentMethod",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "paymentMethod" ? (
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
        ""
      ),
  },
  {
    title: "RECEIPT CHANNEL",
    dataIndex: "receiptChannel",
    key: "receiptChannel",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "receiptChannel",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "receiptChannel" ? (
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
        ""
      ),
  },
  {
    title: "IS RECONCILED",
    dataIndex: "isReconciled",
    key: "isReconciled",
    sorter: true,
    width: 160,
    align: "center",
    ...getColumnSearchPropsPaging(
      "isReconciled",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
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
      if (searchedColumn === "isReconciled") {
        return (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        );
      } else {
        return <div>{text}</div>;
      }
    },
  },
  {
    title: "BANK",
    dataIndex: "bank",
    key: "bank",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "bank",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "bank" ? (
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
        ""
      ),
  },
  {
    title: "COLLECTING AGENT",
    dataIndex: "collectingAgent",
    key: "collectingAgent",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "collectingAgent",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "collectingAgent" ? (
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
        ""
      ),
  },
  {
    title: "DELIVERY CHANNEL",
    dataIndex: "deliveryChannel",
    key: "deliveryChannel",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "deliveryChannel",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "deliveryChannel" ? (
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
        ""
      ),
  },
  {
    title: "TRANSACTION CALENDAR",
    dataIndex: "paymentCycle",
    key: "paymentCycle",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "paymentCycle",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "paymentCycle" ? (
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
        ""
      ),
  },
  {
    title: "TRANSACTION PERIOD",
    dataIndex: "paymentPeriod",
    key: "paymentPeriod",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "paymentPeriod",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "paymentPeriod" ? (
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
        ""
      ),
  },
  {
    title: "RATE TYPE",
    dataIndex: "rateType",
    key: "rateType",
    sorter: true,
    width: 130,
    align: "center",
    ...getColumnSearchPropsPaging(
      "rateType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "rateType" ? (
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
        ""
      ),
  },
  {
    title: "RATE DATE",
    dataIndex: "rateDate",
    align: "center",
    key: "rateDate",
    sorter: true,
    width: 150,
    ...getColumnSearchPropsPaging(
      "rateDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      searchedColumn === "rateDate" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[
            searchText ? moment(searchText).format("DD MMM YYYY") : "",
          ]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text || " "
      ),
  },
  {
    title: "RATE",
    dataIndex: "rateAmount",
    key: "rateAmount",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "rateAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "rate" ? (
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
        ""
      ),
  },
  {
    title: "CONVERTED CURRENCY",
    dataIndex: "convertedCurrency",
    key: "convertedCurrency",
    align: "center",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "convertedCurrency",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "convertedCurrency" ? (
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
        ""
      ),
  },
  {
    title: "AMOUNT EQUIVALENT",
    dataIndex: "equivalentAmount",
    key: "equivalentAmount",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsPaging(
      "equivalentAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "equivalentAmount" ? (
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
        ""
      ),
  },
  {
    title: "REFERENCE NUMBER",
    dataIndex: "refNumber",
    key: "refNumber",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "refNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "refNumber" ? (
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
        ""
      ),
  },
  {
    title: "BANK STATMENT NAME",
    dataIndex: "bankStatementName",
    key: "bankStatementName",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "bankStatementName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "bankStatementName" ? (
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
        ""
      ),
  },
  {
    title: "SOURCE",
    dataIndex: "source",
    key: "source",
    sorter: true,
    width: 180,
    align: "center",
    ...getColumnSearchPropsPaging(
      "source",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "source" ? (
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
        ""
      ),
  },
  {
    title: "BANK STATEMENT DATE",
    dataIndex: "bankStatementDate",
    key: "bankStatementDate",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsPaging(
      "bankStatementDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      searchedColumn === "bankStatementDate" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[
            searchText
              ? moment(searchText, "YYYY-MM-DD").format("DD MMM YYYY")
              : "",
          ]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text || ""
      ),
  },
  {
    title: "APPLIED AMOUNT",
    dataIndex: "appliedAmount",
    key: "appliedAmount",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "appliedAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
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
    title: "EQUIVALENT APPLIED AMOUNT",
    dataIndex: "equivalentAppliedAmount",
    key: "equivalentAppliedAmount",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "equivalentAppliedAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
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
    title: "UNAPPLY AMOUNT",
    dataIndex: "unAppliedAmount",
    key: "unAppliedAmount",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "unAppliedAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
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
    title: "EQUIVALENT UNAPPLY AMOUNT",
    dataIndex: "equivalentUnAppliedAmount",
    key: "equivalentUnAppliedAmount",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "equivalentUnAppliedAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
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
    ...getColumnSearchPropsPaging(
      "refundAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
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
    title: "TRANSFERED AMOUNT",
    dataIndex: "transferAmount",
    key: "transferAmount",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "transferAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
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
    ...getColumnSearchPropsPaging(
      "createdDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datetime"
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
              ? moment(searchText).format(dateFormatting?.dateTime)
              : "",
          ]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        moment(text).format(dateFormatting?.dateTime) || "-"
      ),
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    key: "remark",
    align: "left",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    ellipsis: {
      showTitle: false,
    },
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
        ""
      ),
  },
  // {
  //   title: "APPROVAL STATUS",
  //   dataIndex: "statusApproval",
  //   key: "statusApproval",
  //   sorter: true,
  //   fixed: "right",
  //   width: 190,
  //   ...getColumnSearchPropsPaging(
  //     "statusApproval",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch,
  //     true
  //   ),
  //   render: (text) =>
  //     searchedColumn === "statusApproval" ? (
  //       <Highlighter
  //         highlightStyle={{
  //           backgroundColor: "#ffc069",
  //           padding: 0,
  //         }}
  //         searchWords={[searchText]}
  //         autoEscape
  //         textToHighlight={text ? text.toString() : ""}
  //       />
  //     ) : text ? (
  //       // <Tooltip placement="topLeft" title={text}>
  //       //   {text}
  //       // </Tooltip>
  //       <div className="flex justify-center">
  //         <StatusComponent colour={text}>{toTitleCase(text)}</StatusComponent>
  //       </div>
  //     ) : (
  //       ""
  //     ),
  //   // render: (approvalStatus) => (
  //   //   <div className="flex justify-center">
  //   //     <StatusComponent colour={approvalStatus}>
  //   //       {approvalStatus}
  //   //     </StatusComponent>
  //   //   </div>
  //   // ),
  // },
  // {
  //   title: "STATUS",
  //   dataIndex: "status",
  //   key: "status",
  //   sorter: true,
  //   fixed: "right",
  //   width: 120,
  //   ...getColumnSearchPropsPaging(
  //     "status",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch,
  //     true
  //   ),
  //   render: (text) =>
  //     searchedColumn === "status" ? (
  //       <Highlighter
  //         highlightStyle={{
  //           backgroundColor: "#ffc069",
  //           padding: 0,
  //         }}
  //         searchWords={[searchText]}
  //         autoEscape
  //         textToHighlight={text ? text.toString() : ""}
  //       />
  //     ) : text ? (
  //       <div className="flex justify-center">
  //         <StatusComponent colour={text}>{text}</StatusComponent>
  //       </div>
  //     ) : (
  //       ""
  //     ),
  // },
  //  {
  //    title: "ACTION",
  //    key: "action",
  //    fixed: 'right',
  //    width: 150,
  //    render: (v, r, i) => {
  //      return (
  //        <div className="flex flex-row justify-center align-middle">
  //          <Link
  //            onClick={() => {
  //              // handleDetail(r?.employeeCode);
  //            }}
  //            to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_RECEIPT_HISTORIES}
  //            // state={{ id: r?.accountNumber }}
  //          >
  //            <ButtonComponent
  //              icon={<SVGIcon name="IconDetail" width={24} />}
  //              border={false}
  //            ></ButtonComponent>
  //          </Link>
  //        </div>
  //      );
  //    },
  //  },
];

const ViewReceiptHistories = () => {
  //selector
  const { data, loading } = useSelector((state) => state.receiptHistories);
  const { bodyError } = useSelector((state) => state?.general);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  // const dataSource = data?.result;
  const access = useGrantAccessHooks();

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const searchInput2 = useRef(null);
  const [searchedColumn2, setSearchedColumn2] = useState("");
  const [searchText2, setSearchText2] = useState("");
  const [currentLog, setCurrentLog] = useState(1);
  const [sizeLog, setSizeLog] = useState(10);

  //dispatch
  const handleFetch = useCallback(() => {
    dispatch(
      getReciptHistoriesPagging({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [dispatch, page, pageSize, search, sort]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const onSort = (_, __, sort) => {
    console.log(sort?.field, " led");
    let column = "";
    switch (sort?.field) {
      case "unAppliedAmount":
        column = "unAppliedAmountReal";
        break;
      case "appliedAmount":
        column = "appliedAmountReal";
        break;
      case "equivalentUnAppliedAmount":
        column = "equivalentUnAppliedAmountReal";
        break;
      case "equivalentAmount":
        column = "equivalentAmountReal";
        break;
      case "rateAmount":
        column = "rateAmountReal";
        break;
      case "equivalentAppliedAmount":
        column = "equivalentAppliedAmountReal";
        break;
      case "refundAmount":
        column = "refundAmountReal";
        break;
      case "transferAmount":
        column = "transferAmountReal";
        break;
      default:
        column = sort?.field;
        break;
    }
    const dataSort =
      sort.order !== undefined
        ? `${column}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };
  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECEIPT,
      breadcrumbName: "Accounting",
    },
  ];

  const dataFinal = data?.result?.map((a, index) => ({
    ...a,
    key: index + 1,
  }));

  const expandedRowRender = (record) => {
    const dataExpanded = record?.allocationHistoryDtoList;
    // handle search2
    const handleSearch2 = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText2(selectedKeys[0]);
      const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
      // if (searchedColumn2 !== tempSearchColumn) {
      //   setCurrentLog(1);
      // }
      setSearchedColumn2(tempSearchColumn);
    };

    // pagination
    const updatePaginationActivationLog = (type = "data") => {
      let result = [...(dataExpanded || [])];
      if (searchedColumn2) {
        console.log(searchedColumn2, " searched");
        const fixSearchText = searchText2?.toLowerCase();
        console.log(result, "result");
        result = result.filter((item) => {
          console.log(typeof item[searchedColumn2]);
          if (searchedColumn2 === "createdDate") {
            const tempDate =
              moment(item[searchedColumn2]).format(dateFormatting.dateTime) ||
              "";
            return tempDate?.toLowerCase()?.includes(fixSearchText);
          } else if (searchedColumn2 === "allocationId") {
            return String(item[searchedColumn2]).includes(fixSearchText);
          } else {
            return item[searchedColumn2]
              ?.toLowerCase()
              ?.includes(fixSearchText);
          }
        });
      }
      const fix = result.slice(
        (currentLog - 1) * sizeLog,
        currentLog * sizeLog
      );
      return type === "data" ? fix : result.length;
    };

    const column = [
      {
        title: "NO",
        width: 107,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "ALLOCATION ID",
        dataIndex: "allocationId",
        sorter: (a, b) => a?.allocationId - b?.allocationId,
        ...getColumnSearchPropsPaging(
          "allocationId",
          searchInput2,
          searchedColumn2,
          searchText2,
          handleSearch2
        ),
      },
      {
        title: "ALLOCATION NUMBER",
        dataIndex: "allocationNumber",
        sorter: (a, b) =>
          a?.allocationNumber?.localeCompare(b?.allocationNumber),
        ...getColumnSearchPropsPaging(
          "allocationNumber",
          searchInput2,
          searchedColumn2,
          searchText2,
          handleSearch2,
          false
        ),
      },
      {
        title: "BILLING ITEM",
        dataIndex: "billingItem",
        align: "center",
        width: 200,
        sorter: (a, b) =>
          (a.billingItem || "").length - (b.billingItem || "").length,
        ...getColumnSearchPropsPaging(
          "billingItem",
          searchInput2,
          searchedColumn2,
          searchText2,
          handleSearch2,
          false
        ),
      },
      {
        title: "BILLING ITEM AMOUNT",
        dataIndex: "billingItemAmount",
        align: "right",
        sorter: (a, b) =>
          (a.billingItem || "").length - (b.billingItem || "").length,
        ...getColumnSearchPropsPaging(
          "billingItemAmount",
          searchInput2,
          searchedColumn2,
          searchText2,
          handleSearch2,
          false
        ),
      },
      {
        title: "ALLOCATION TYPE",
        dataIndex: "allocationType",
        align: "center",
        width: 200,
        sorter: (a, b) => {
          return new Date(a.allocationDate) - new Date(b.allocationDate);
        },
        ...getColumnSearchPropsPaging(
          "allocationType",
          searchInput2,
          searchedColumn2,
          searchText2,
          handleSearch2,
          false
        ),
        // render: (allocateDate) => hasValue(allocateDate) && moment(allocateDate).format("DD MMM YYYY"),
      },
      {
        title: "ALLOCATE DATE",
        dataIndex: "allocationDate",
        align: "center",
        sorter: (a, b) => sorterFunction("allocationDate", a, b, "date"),
        ...getColumnSearchPropsPaging(
          "allocationDate",
          searchInput2,
          searchedColumn2,
          searchText2,
          handleSearch2,
          false,
          "date"
        ),
        render: (allocateDate) =>
          hasValue(allocateDate) && moment(allocateDate).format("DD MMM YYYY"),
      },
      {
        title: "ALLOCATION AMOUNT",
        dataIndex: "allocationAmount",
        align: "right",
        sorter: (a, b) => sorterFunction("allocationAmount", a, b, "number"),
        ...getColumnSearchPropsPaging(
          "allocationAmount",
          searchInput2,
          searchedColumn2,
          searchText2,
          handleSearch2,
          false,
          "number"
        ),
        // render: (allocateDate) => hasValue(allocateDate) && moment(allocateDate).format("DD MMM YYYY"),
      },
      {
        title: "EQUIVALENT AMOUNT",
        dataIndex: "equivalentAmount",
        align: "right",
        sorter: (a, b) => sorterFunction("equivalentAmount", a, b),
        ...getColumnSearchPropsPaging(
          "equivalentAmount",
          searchInput2,
          searchedColumn2,
          searchText2,
          handleSearch2,
          false,
          "number"
        ),
        // render: (allocateDate) => hasValue(allocateDate) && moment(allocateDate).format("DD MMM YYYY"),
      },
      {
        title: "INVOICE NUMBER",
        dataIndex: "invoiceNumber",
        align: "center",
        sorter: (a, b) => sorterFunction("invoiceNumber", a, b),
        ...getColumnSearchPropsPaging(
          "invoiceNumber",
          searchInput2,
          searchedColumn2,
          searchText2,
          handleSearch2,
          false
        ),
      },
      {
        title: "INVOICE CURRENCY",
        dataIndex: "invoiceCurrency",
        align: "center",
        sorter: (a, b) =>
          (a.invoiceCurrency || "").length - (b.invoiceCurrency || "").length,

        ...getColumnSearchPropsPaging(
          "invoiceCurrency",
          searchInput2,
          searchedColumn2,
          searchText2,
          handleSearch2,
          false
        ),
      },
      {
        title: "CONVERTED CURRENCY",
        dataIndex: "convertedCurrency",
        align: "center",
        sorter: (a, b) => sorterFunction("convertedCurrency", a, b),
        ...getColumnSearchPropsPaging(
          "convertedCurrency",
          searchInput2,
          searchedColumn2,
          searchText2,
          handleSearch2,
          false
        ),
      },
      {
        title: "CREATED DATE",
        dataIndex: "createdDate",
        align: "center",
        width: 220,
        sorter: (a, b) => sorterFunction("createdDate", a, b, "date"),
        ...getColumnSearchPropsPaging(
          "createdDate",
          searchInput2,
          searchedColumn2,
          searchText2,
          handleSearch2,
          false
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
                  ? moment(searchText).format(dateFormatting?.dateTime)
                  : "",
              ]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          ) : text ? (
            moment(text).format(dateFormatting?.dateTime)
          ) : (
            ""
          ),
      },
      {
        title: "CREATED BY",
        dataIndex: "createdBy",
        align: "center",
        width: 220,
        sorter: (a, b) => sorterFunction("createdBy", a, b),
        ...getColumnSearchPropsPaging(
          "createdBy",
          searchInput2,
          searchedColumn2,
          searchText2,
          handleSearch2,
          false
        ),
      },
      {
        title: "UPDATED DATE",
        dataIndex: "updatedDate",
        align: "center",
        width: 220,
        sorter: (a, b) => sorterFunction("updatedDate", a, b, "date"),
        ...getColumnSearchPropsPaging(
          "updatedDate",
          searchInput2,
          searchedColumn2,
          searchText2,
          handleSearch2,
          false
        ),
        render: (text) =>
          searchedColumn === "updatedDate" ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[
                searchText
                  ? moment(searchText).format(dateFormatting?.dateTime)
                  : "",
              ]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          ) : text ? (
            moment(text).format(dateFormatting?.dateTime)
          ) : (
            ""
          ),
      },
      {
        title: "UPDATED BY",
        dataIndex: "updatedBy",
        align: "center",
        width: 220,
        sorter: (a, b) => sorterFunction("updatedBy", a, b),
        ...getColumnSearchPropsPaging(
          "updatedBy",
          searchInput2,
          searchedColumn2,
          searchText2,
          handleSearch2,
          false
        ),
      },
      {
        title: "ALLOCATION STATUS",
        dataIndex: "allocationStatus",
        align: "center",
        fixed: "right",
        width: 220,
        sorter: (a, b) => sorterFunction("allocationStatus", a, b),
        ...getColumnSearchPropsPaging(
          "allocationStatus",
          searchInput2,
          searchedColumn2,
          searchText2,
          handleSearch2,
          false
        ),
        render: (text) =>
          searchedColumn === "statusApproval" ? (
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
            // <Tooltip placement="topLeft" title={text}>
            //   {text}
            // </Tooltip>
            <div className="flex justify-center">
              <StatusComponent colour={text}>
                {toTitleCase(text)}
              </StatusComponent>
            </div>
          ) : (
            ""
          ),
      },
    ];

    return (
      <div>
        <TablePagination
          useSelect={false}
          usePagination={false}
          dataSource={updatePaginationActivationLog("data")}
          columns={column}
          tableScrolled={{ x: 4000, y: 525 }}
        />
      </div>
    );
  };

  const handleDownload = () => {
    dispatch(
      downloadReceiptHistories({
        search: encodeURIComponent(JSON.stringify(search)),
        // search: tempSearch,
        page: page,
        pageSize: pageSize,
        sort: sort,
      })
    );
  };

  const itemActions = [
    // toolbar items
    {
      action: "Download",
      render: (
        <ButtonComponent
          onClick={handleDownload}
          type={"submit"}
          border={false}
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Generate",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconSend" color={"#ffffff"} width={24} />}
          type="submit"
          // onClick={handleDownload}
        >
          Send to SAP
        </ButtonComponent>
      ),
    },
    {
      action: "Generate",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonCreate" width={24} />}
          type="submit"
          // onClick={handleDownload}
        >
          Create Accounting
        </ButtonComponent>
      ),
    },
    // {
    //   action: "Create",
    //   render: (
    //     <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_PAYMENT_ITEM}>
    //       <ButtonComponent
    //         icon={<SVGIcon name="IconButtonCreate" width={24} />}
    //         type="submit"
    //       >
    //         Create Payment Method
    //       </ButtonComponent>
    //     </NavLink>
    //   ),
    // },
  ];

  // handle retry modal error
  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "RECEIPT_HISTORY_DOWNLOAD") {
        handleDownload();
        handleFetch();
      }
      // else if (bodyError?.action === "GET_APPROVAL_ITEM") {
      //   dispatch(getApprovalHistory(body));
      // } else if (bodyError?.action === "DOWNLOAD_PAYMENT_METHOD") {
      //   handleDownload();
      // }
      // handleFetch();
    } catch (error) {
      handleFetch();
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <Toolbar actionList={access?.actions} items={itemActions} />
        <BaseContainer header={"ACCOUNTING LIST"}>
          <TablePagination
            dataSource={dataFinal}
            columns={columns(
              page,
              pageSize,
              searchInput,
              searchedColumn,
              searchText,
              handleSearch
            )}
            pageSize={pageSize}
            current={page}
            expandable={{ expandedRowRender }}
            idTable="table-expand"
            tableScrolled={{ x: 11000, y: 525 }}
            totalData={data?.page?.totalElements}
            onSort={onSort}
            onChange={handleChange}
            onShowSizeChange={handleChange}
          />
        </BaseContainer>
      </Spin>
      {renderModal()}
    </LayoutMenu>
  );
};

export default ViewReceiptHistories;
