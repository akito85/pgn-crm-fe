import React from "react";
import { hasValue, renderColumn } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { numberFormatting } from "../../../../../utils/formatCurrency";
import StatusComponent from "../../../../../components/StatusComponent";

const mkCol = (key, title, width, extra = {}) => ({
  key,
  title,
  dataIndex: key,
  isClassification: true,
  width,
  sorter: true,
  ...extra,
});

// searchCtx = { searchInput, searchedColumn, searchText, handleSearch, search }
const mkSearchCol = (key, title, width, searchCtx, extra = {}) => {
  const { searchInput, searchedColumn, searchText, handleSearch, search } = searchCtx;
  return {
    ...mkCol(key, title, width, extra),
    ...getColumnSearchPropsUseFilteredValue(search, key, searchInput, searchedColumn, searchText, handleSearch, true),
    render: (text) => renderColumn(key, hasValue(search[key]), searchText, text, false, "input", search),
  };
};

const mkNumCol = (key, title, width, searchCtx) => {
  const { searchInput, searchedColumn, searchText, handleSearch, search } = searchCtx;
  return {
    ...mkCol(key, title, width, { align: "right" }),
    ...getColumnSearchPropsUseFilteredValue(search, key, searchInput, searchedColumn, searchText, handleSearch, true),
    render: (text) => (text !== null && text !== undefined ? numberFormatting(text) : "-"),
  };
};

const mkStatusCol = (key, title, width) => ({
  ...mkCol(key, title, width, { align: "center" }),
  render: (text) =>
    text ? (
      <div className="flex justify-center">
        <StatusComponent colour={text?.toLowerCase()}>{text}</StatusComponent>
      </div>
    ) : (
      "-"
    ),
});

export const columnsSummaryBalance = (
  page = 0,
  pageSize = 0,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search,
) => {
  const ctx = { searchInput, searchedColumn, searchText, handleSearch, search };

  return [
    {
      key: "no",
      title: "NO",
      width: 50,
      align: "center",
      render: (text, object, index) => index + 1,
    },

    // ── Account Info (from M_ACCOUNT + M_CUSTOMER) ────────────────────────────
    mkSearchCol("customerNumber",      "CUSTOMER NUMBER",       160, ctx),
    mkSearchCol("customerName",        "CUSTOMER NAME",         180, ctx),
    mkSearchCol("accountNumber",       "ACCOUNT NUMBER",        160, ctx),
    mkSearchCol("accountName",         "ACCOUNT NAME",          180, ctx),
    mkSearchCol("accountGroupType",    "ACCOUNT GROUP TYPE",    160, ctx),
    mkSearchCol("sor",                 "SOR",                   100, ctx),
    mkSearchCol("costCenter",          "COST CENTER",           130, ctx),
    mkSearchCol("accountSegment",      "ACCOUNT SEGMENT",       150, ctx),
    mkSearchCol("meterReadingCode",    "METER READING CODE",    160, ctx),

    { ...mkCol("termsEarn",    "TERMS EARN",    120), render: (text) => text ?? "-" },
    { ...mkCol("termsRedeem",  "TERMS REDEEM",  130), render: (text) => text ?? "-" },
    { ...mkCol("earnPeriod",   "EARN PERIOD",   120), render: (text) => text ?? "-" },

    // ── Period Redeem (grouped) ───────────────────────────────────────────────
    {
      key: "periodRedeem",
      title: "PERIOD REDEEM",
      isClassification: true,
      children: [
        { ...mkCol("redeemStartDate", "START", 130), render: (text) => text ?? "-" },
        { ...mkCol("redeemEndDate",   "END",   130), render: (text) => text ?? "-" },
      ],
    },

    // ── Billing / Scheme Period ───────────────────────────────────────────────
    { ...mkCol("billingPeriod",   "BILLING PERIOD",   130), render: (text) => text ?? "-" },
    { ...mkCol("timeUnit",        "TIME UNIT",         110), render: (text) => text ?? "-" },
    mkSearchCol("currency",       "CURRENCY",          100, ctx),
    mkSearchCol("uom",            "UOM",                90, ctx),

    // ── Balance / Amount ─────────────────────────────────────────────────────
    mkNumCol("quantity",          "QUANTITY",           130, ctx),
    mkNumCol("balanceAmount",     "BALANCE AMOUNT",     150, ctx),

    { ...mkCol("headerType",          "HEADER TYPE",          130), render: (text) => text ?? "-" },
    mkSearchCol("accountType",        "ACCOUNT TYPE",         130, ctx),
    { ...mkCol("classificationType",  "CLASSIFICATION TYPE",  170), render: (text) => text ?? "-" },
    { ...mkCol("source",              "SOURCE",               110), render: (text) => text ?? "-" },
    mkSearchCol("sapCustId",          "SAP CUST ID",          130, ctx),

    { ...mkCol("period",         "PERIOD",          110), render: (text) => text ?? "-" },
    { ...mkCol("mutationDate",   "MUTATION DATE",   140), render: (text) => text ?? "-" },
    { ...mkCol("mutationType",   "MUTATION TYPE",   140), render: (text) => text ?? "-" },
    { ...mkNumCol("volume",  "VOLUME", 120, ctx), render: (text) => (text !== null && text !== undefined ? numberFormatting(text) : "-") },
    { ...mkNumCol("price",   "PRICE",  130, ctx), render: (text) => (text !== null && text !== undefined ? numberFormatting(text) : "-") },
    { ...mkNumCol("amount",  "AMOUNT", 130, ctx), render: (text) => (text !== null && text !== undefined ? numberFormatting(text) : "-") },


    // ── Status ────────────────────────────────────────────────────────────────
    mkStatusCol("status",                 "STATUS",                  120),
    mkStatusCol("statusApproval",         "STATUS APPROVAL",         160),
    mkStatusCol("mutationStatus",         "MUTATION STATUS",         140),
    mkStatusCol("mutationApprovalStatus", "MUTATION APPROVAL STATUS", 180),
  ];
};
