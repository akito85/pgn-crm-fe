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
      isClassification: true,
      width: 15,
      align: "center",
      render: (text, object, index) => index + 1,
    },

    // ── Account Info ──────────────────────────────────────────────────────────
    mkSearchCol("customerNumber",    "CUSTOMER NUMBER",    80,  ctx),
    mkSearchCol("customerName",      "CUSTOMER NAME",      100, ctx),
    mkSearchCol("accountNumber",     "ACCOUNT NUMBER",     80,  ctx),
    mkSearchCol("accountName",       "ACCOUNT NAME",       120, ctx),
    mkSearchCol("accountGroupType",  "ACCOUNT GROUP TYPE", 80,  ctx),
    mkSearchCol("sor",               "SOR",                90,  ctx),
    mkSearchCol("costCenter",        "COST CENTER",        90,  ctx),
    mkSearchCol("accountSegment",    "ACCOUNT SEGMENT",    90,  ctx),
    mkSearchCol("meterReadingCode",  "METER READING CODE", 90,  ctx),
    mkSearchCol("termsEarn",         "TERMS EARN",         80,  ctx),
    mkSearchCol("termsRedeem",       "TERMS REDEEM",       80,  ctx),
    mkSearchCol("earnPeriod",        "EARN PERIOD",        80,  ctx),
    mkSearchCol("period",            "PERIOD",             80,  ctx),

    // ── Period Redeem (grouped) ───────────────────────────────────────────────
    {
      key: "periodRedeem",
      title: "PERIOD REDEEM",
      isClassification: true,
      children: [
        mkSearchCol("periodRedeemStart", "START", 80, ctx),
        mkSearchCol("periodRedeemEnd",   "END",   80, ctx),
      ],
    },

    // ── Gas Deposit Info ──────────────────────────────────────────────────────
    mkSearchCol("billingPeriod",      "BILLING PERIOD",      80,  ctx),
    mkSearchCol("timeUnit",           "TIME UNIT",           80,  ctx),
    mkSearchCol("currency",           "CURRENCY",            70,  ctx),
    mkSearchCol("uom",                "UOM",                 60,  ctx),
    mkNumCol(   "quantity",           "QUANTITY",            80,  ctx),
    mkNumCol(   "balanceAmount",      "BALANCE AMOUNT",      90,  ctx),
    mkSearchCol("headerType",         "HEADER TYPE",         80,  ctx),
    mkSearchCol("accountType",        "ACCOUNT TYPE",        80,  ctx),
    mkSearchCol("classificationType", "CLASSIFICATION TYPE", 90,  ctx),
    mkSearchCol("source",             "SOURCE",              70,  ctx),
    mkSearchCol("sapCustId",          "SAP CUST ID",         80,  ctx),

    // ── Mutation Info ─────────────────────────────────────────────────────────
    mkSearchCol("mutationDate",   "MUTATION DATE",   90,  ctx),
    mkSearchCol("mutationType",   "MUTATION TYPE",   80,  ctx),
    mkSearchCol("category",       "CATEGORY",        80,  ctx),
    mkNumCol(   "volume",         "VOLUME",          80,  ctx),
    mkNumCol(   "price",          "PRICE",           80,  ctx),
    mkSearchCol("detailType",     "DETAIL TYPE",     80,  ctx),
    mkNumCol(   "amount",         "AMOUNT",          90,  ctx),
    mkSearchCol("description",    "DESCRIPTION",     120, ctx),

    // ── Status ────────────────────────────────────────────────────────────────
    mkStatusCol("status",                  "STATUS",                  60),
    mkStatusCol("statusApproval",          "STATUS APPROVAL",         90),
    mkStatusCol("mutationStatus",          "MUTATION STATUS",         75),
    mkStatusCol("mutationApprovalStatus",  "MUTATION APPROVAL STATUS", 95),
  ];
};
