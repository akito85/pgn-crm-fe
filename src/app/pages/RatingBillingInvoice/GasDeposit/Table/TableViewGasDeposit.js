import React from "react";
import moment from "moment";
import { hasValue, renderColumn } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { numberFormatting } from "../../../../../utils/formatCurrency";
import StatusComponent from "../../../../../components/StatusComponent";

const toMoment = (value) => {
  if (!value) return null;
  const parsed = moment(value);
  return parsed.isValid() ? parsed : null;
};

const formatShortDate = (value) => {
  const parsed = toMoment(value);
  return parsed ? parsed.format("D-MMM-YY") : "-";
};

const formatShortPeriod = (value) => {
  if (typeof value === "string" && value.includes(" - ")) {
    const [startValue] = value.split(" - ");
    const parsedStart = toMoment(startValue);
    return parsedStart ? parsedStart.format("MMM YY") : value;
  }
  const parsed = toMoment(value);
  return parsed ? parsed.format("MMM YY") : "-";
};

const formatPeriodEarnRange = (startValue, endValue) => {
  const start = toMoment(startValue);
  const end = toMoment(endValue);

  if (start && end) {
    if (start.year() === end.year()) {
      return `${start.format("MMM")}-${end.format("MMM YYYY")}`;
    }
    return `${start.format("MMM YYYY")} - ${end.format("MMM YYYY")}`;
  }

  if (start) return start.format("MMM YYYY");
  if (end) return end.format("MMM YYYY");
  return "-";
};

export const columnsGasDeposit = (
  page = 0,
  pageSize = 0,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search,
) => [
  {
    key: "no",
    title: "NO",
    isClassification: true,
    width: 15,
    align: "center",
    render: (text, object, index) => index + 1,
  },
  {
    key: "customerNumber",
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    isClassification: true,
    width: 80,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "customerNumber",
        hasValue(search["customerNumber"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    key: "customerName",
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    isClassification: true,
    width: 100,
    sorter: true,
    align: "left",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "customerName",
        hasValue(search["customerName"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    key: "accountNumber",
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    isClassification: true,
    width: 80,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "accountNumber",
        hasValue(search["accountNumber"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    key: "accountName",
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    isClassification: true,
    width: 100,
    sorter: true,
    align: "left",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "accountName",
        hasValue(search["accountName"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    key: "accountGroupType",
    title: "ACCOUNT GROUP TYPE",
    dataIndex: "accountGroupType",
    isClassification: true,
    width: 80,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountGroupType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "accountGroupType",
        hasValue(search["accountGroupType"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    key: "sor",
    title: "SOR",
    dataIndex: "sor",
    isClassification: true,
    width: 60,
    sorter: true,
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
        hasValue(search["sor"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    key: "costCenter",
    title: "COST CENTER",
    dataIndex: "costCenter",
    isClassification: true,
    width: 70,
    sorter: true,
    align: "left",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "costCenter",
        hasValue(search["costCenter"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    key: "accountSegment",
    title: "ACCOUNT SEGMENT",
    dataIndex: "accountSegment",
    isClassification: true,
    width: 80,
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
        hasValue(search["accountSegment"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    key: "meterReadingCode",
    title: "METER READING CODE",
    dataIndex: "meterReadingCode",
    isClassification: true,
    width: 80,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "meterReadingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "meterReadingCode",
        hasValue(search["meterReadingCode"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    key: "currency",
    title: "CURRENCY",
    dataIndex: "currency",
    isClassification: true,
    width: 60,
    sorter: true,
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
    key: "uom",
    title: "UOM",
    dataIndex: "uom",
    isClassification: true,
    width: 50,
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
  },
  {
    key: "termsEarn",
    title: "TERMS EARN",
    dataIndex: "termsEarn",
    isClassification: true,
    width: 80,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "termsEarn",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) => text ?? "-",
  },
  {
    key: "termsRedeem",
    title: "TERMS REDEEM",
    dataIndex: "termsRedeem",
    isClassification: true,
    width: 80,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "termsRedeem",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) => text ?? "-",
  },
  {
    key: "periodEarn",
    title: "PERIOD EARN",
    dataIndex: "periodEarn",
    isClassification: true,
    width: 80,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "periodEarn",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (_, record) => formatPeriodEarnRange(
      record?.periodEarn || record?.earnStartDate,
      record?.periodEarnEnd || record?.earnEndDate,
    ),
  },
  {
    key: "periodRedeem",
    title: "PERIOD REDEEM",
    children: [
      {
        key: "periodRedeemStart",
        title: "START",
        dataIndex: "periodRedeemStart",
        isClassification: true,
        width: 70,
        render: (text) => formatShortDate(text),
      },
      {
        key: "periodRedeemEnd",
        title: "END",
        dataIndex: "periodRedeemEnd",
        isClassification: true,
        width: 70,
        render: (text) => formatShortDate(text),
      },
    ],
  },
  {
    key: "period",
    title: "PERIOD",
    dataIndex: "period",
    isClassification: true,
    width: 70,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "period",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) => formatShortPeriod(text),
  },
  {
    key: "timeUnit",
    title: "TIME UNIT",
    dataIndex: "timeUnit",
    isClassification: true,
    width: 70,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "timeUnit",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) => text ?? "-",
  },
  {
    key: "quantity",
    title: "QUANTITY",
    dataIndex: "quantity",
    isClassification: true,
    width: 90,
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "quantity",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) => (text !== null && text !== undefined ? numberFormatting(text) : "-"),
  },
  {
    key: "amount",
    title: "AMOUNT",
    dataIndex: "amount",
    isClassification: true,
    width: 90,
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "amount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) => (text !== null && text !== undefined ? numberFormatting(text) : "-"),
  },
  {
    key: "cashBalance",
    title: "CASH BALANCE",
    dataIndex: "cashBalance",
    isClassification: true,
    width: 90,
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "cashBalance",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) => (text !== null && text !== undefined ? numberFormatting(text) : "-"),
  },
  {
    key: "type",
    title: "TYPE",
    dataIndex: "type",
    isClassification: true,
    width: 70,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "type",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) => text ?? "-",
  },
  {
    key: "accountType",
    title: "ACCOUNT TYPE",
    dataIndex: "accountType",
    isClassification: true,
    width: 80,
    sorter: true,
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
        hasValue(search["accountType"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    key: "classificationType",
    title: "CLASSIFICATION TYPE",
    dataIndex: "classificationType",
    isClassification: true,
    width: 80,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "classificationType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "classificationType",
        hasValue(search["classificationType"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    key: "source",
    title: "SOURCE",
    dataIndex: "source",
    isClassification: true,
    width: 80,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "source",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) => text ?? "-",
  },
  {
    key: "description",
    title: "DESCRIPTION",
    dataIndex: "description",
    isClassification: true,
    width: 120,
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
    render: (text) => text ?? "-",
  },
  {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    isClassification: true,
    width: 70,
    sorter: true,
    align: "center",
    render: (text) =>
      text ? (
        <div className="flex justify-center">
          <StatusComponent colour={text?.toLowerCase()}>{text}</StatusComponent>
        </div>
      ) : (
        "-"
      ),
  },
  {
    key: "statusApproval",
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    isClassification: true,
    width: 100,
    sorter: true,
    align: "center",
    render: (text) =>
      text ? (
        <div className="flex justify-center">
          <StatusComponent colour={text?.toLowerCase()?.replaceAll(" ", "_")}>
            {text}
          </StatusComponent>
        </div>
      ) : (
        "-"
      ),
  },
];
