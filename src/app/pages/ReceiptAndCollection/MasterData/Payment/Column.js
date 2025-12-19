import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";

export const columns = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  dataUser = {}
) => {
  return [
    {
      key: "no",
      title: "NO",
      dataIndex: "no",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "custNumber",
      title: "Cust Number",
      sorter: true,
      align: "left",
      dataIndex: "custNumber",
      ...getColumnSearchPropsPaging(
        search,
        "custNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "custNumber",
          hasValue(search["custNumber"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "custName",
      title: "Cust Name",
      sorter: true,
      align: "left",
      dataIndex: "custName",
      ...getColumnSearchPropsPaging(
        search,
        "custName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "custName",
          hasValue(search["custName"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "billAmount",
      title: "Bill Amount",
      sorter: true,
      align: "right",
      dataIndex: "billAmount",
      ...getColumnSearchPropsPaging(
        search,
        "billAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "billAmount",
          hasValue(search["billAmount"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "currency",
      title: "Currency",
      sorter: true,
      align: "left",
      dataIndex: "currency",
      ...getColumnSearchPropsPaging(
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
      key: "usage",
      title: "Usage",
      sorter: true,
      align: "right",
      dataIndex: "usage",
      ...getColumnSearchPropsPaging(
        search,
        "usage",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "usage",
          hasValue(search["usage"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "custType",
      title: "Cust Type",
      sorter: true,
      align: "left",
      dataIndex: "custType",
      ...getColumnSearchPropsPaging(
        search,
        "custType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "custType",
          hasValue(search["custType"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "totalBillPeriod",
      title: "Total Bill Period",
      sorter: true,
      align: "right",
      dataIndex: "totalBillPeriod",
      ...getColumnSearchPropsPaging(
        search,
        "totalBillPeriod",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "totalBillPeriod",
          hasValue(search["totalBillPeriod"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "billPeriod",
      title: "Bill Period",
      sorter: true,
      align: "left",
      dataIndex: "billPeriod",
      ...getColumnSearchPropsPaging(
        search,
        "billPeriod",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "billPeriod",
          hasValue(search["billPeriod"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "billCycle",
      title: "Bill Cycle",
      sorter: true,
      align: "right",
      dataIndex: "billCycle",
      ...getColumnSearchPropsPaging(
        search,
        "billCycle",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "billCycle",
          hasValue(search["billCycle"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "billReference",
      title: "Bill Reference",
      sorter: true,
      align: "left",
      dataIndex: "billReference",
      ...getColumnSearchPropsPaging(
        search,
        "billReference",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "billReference",
          hasValue(search["billReference"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "processStatus",
      title: "Process Status",
      sorter: true,
      align: "left",
      dataIndex: "processStatus",
      ...getColumnSearchPropsPaging(
        search,
        "processStatus",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "processStatus",
          hasValue(search["processStatus"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "processDate",
      title: "Process Date",
      sorter: true,
      align: "center",
      dataIndex: "processDate",
      ...getColumnSearchPropsPaging(
        search,
        "processDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "date"
      ),
      render: (text) =>
        renderDateColumn(
          "processDate",
          hasValue(search["processDate"]),
          searchText,
          text,
          "date",
          search
        ),
    },
    {
      key: "paidAmount",
      title: "Paid Amount",
      sorter: true,
      align: "right",
      dataIndex: "paidAmount",
      ...getColumnSearchPropsPaging(
        search,
        "paidAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "paidAmount",
          hasValue(search["paidAmount"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "receiptNumber",
      title: "Receipt Number",
      sorter: true,
      align: "left",
      dataIndex: "receiptNumber",
      ...getColumnSearchPropsPaging(
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
      key: "stan",
      title: "Stan",
      sorter: true,
      align: "left",
      dataIndex: "stan",
      ...getColumnSearchPropsPaging(
        search,
        "stan",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "stan",
          hasValue(search["stan"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "transDate",
      title: "Trans Date",
      sorter: true,
      align: "left",
      dataIndex: "transDate",
      ...getColumnSearchPropsPaging(
        search,
        "transDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "date"
      ),
      render: (text) =>
        renderDateColumn(
          "transDate",
          hasValue(search["transDate"]),
          searchText,
          text,
          "date",
          search
        ),
    },
    {
      key: "caCode",
      title: "Ca Code",
      sorter: true,
      align: "left",
      dataIndex: "caCode",
      ...getColumnSearchPropsPaging(
        search,
        "caCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "caCode",
          hasValue(search["caCode"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "ciCode",
      title: "Ci Code",
      sorter: true,
      align: "left",
      dataIndex: "ciCode",
      ...getColumnSearchPropsPaging(
        search,
        "ciCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "ciCode",
          hasValue(search["ciCode"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "terminalId",
      title: "Terminal Id",
      sorter: true,
      align: "left",
      dataIndex: "terminalId",
      ...getColumnSearchPropsPaging(
        search,
        "terminalId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "terminalId",
          hasValue(search["terminalId"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "standBegin",
      title: "Stand Begin",
      sorter: true,
      align: "left",
      dataIndex: "standBegin",
      ...getColumnSearchPropsPaging(
        search,
        "standBegin",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "standBegin",
          hasValue(search["standBegin"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "standEnd",
      title: "Stand End",
      sorter: true,
      align: "left",
      dataIndex: "standEnd",
      ...getColumnSearchPropsPaging(
        search,
        "standEnd",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "standEnd",
          hasValue(search["standEnd"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "gopMasterId",
      title: "Gop Master Id",
      sorter: true,
      align: "left",
      dataIndex: "gopMasterId",
      ...getColumnSearchPropsPaging(
        search,
        "gopMasterId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "gopMasterId",
          hasValue(search["gopMasterId"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "sessionId",
      title: "Session Id",
      sorter: true,
      align: "left",
      dataIndex: "sessionId",
      ...getColumnSearchPropsPaging(
        search,
        "sessionId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "sessionId",
          hasValue(search["sessionId"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "partnerCode",
      title: "Partner Code",
      sorter: true,
      align: "left",
      dataIndex: "partnerCode",
      ...getColumnSearchPropsPaging(
        search,
        "partnerCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "partnerCode",
          hasValue(search["partnerCode"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "custSegment",
      title: "Cust Segment",
      sorter: true,
      align: "left",
      dataIndex: "custSegment",
      ...getColumnSearchPropsPaging(
        search,
        "custSegment",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "custSegment",
          hasValue(search["custSegment"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "paymentCode",
      title: "Payment Code",
      sorter: true,
      align: "left",
      dataIndex: "paymentCode",
      ...getColumnSearchPropsPaging(
        search,
        "paymentCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "paymentCode",
          hasValue(search["paymentCode"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "readingMethod",
      title: "Reading Method",
      sorter: true,
      align: "left",
      dataIndex: "readingMethod",
      ...getColumnSearchPropsPaging(
        search,
        "readingMethod",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "readingMethod",
          hasValue(search["readingMethod"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "gasInvAmount",
      title: "Gas Inv Amount",
      sorter: true,
      align: "right",
      dataIndex: "gasInvAmount",
      ...getColumnSearchPropsPaging(
        search,
        "gasInvAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "gasInvAmount",
          hasValue(search["gasInvAmount"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "guaranteeInvAmount",
      title: "Guarantee Inv Amount",
      sorter: true,
      align: "right",
      dataIndex: "guaranteeInvAmount",
      ...getColumnSearchPropsPaging(
        search,
        "guaranteeInvAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "guaranteeInvAmount",
          hasValue(search["guaranteeInvAmount"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "othersInvAmount",
      title: "Others Inv Amount",
      sorter: true,
      align: "right",
      dataIndex: "othersInvAmount",
      ...getColumnSearchPropsPaging(
        search,
        "othersInvAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "othersInvAmount",
          hasValue(search["othersInvAmount"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "totalAmount",
      title: "Total Amount",
      sorter: true,
      align: "right",
      dataIndex: "totalAmount",
      ...getColumnSearchPropsPaging(
        search,
        "totalAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "totalAmount",
          hasValue(search["totalAmount"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "updatedDate",
      title: "Updated Date",
      sorter: true,
      align: "left",
      dataIndex: "updatedDate",
      ...getColumnSearchPropsPaging(
        search,
        "updatedDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "date"
      ),
      render: (text) =>
        renderDateColumn(
          "updatedDate",
          hasValue(search["updatedDate"]),
          searchText,
          text,
          false,
          "date",
          search
        ),
    },
    {
      key: "transactionId",
      title: "Transaction Id",
      sorter: true,
      align: "left",
      dataIndex: "transactionId",
      ...getColumnSearchPropsPaging(
        search,
        "transactionId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "transactionId",
          hasValue(search["transactionId"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
  ];
};
