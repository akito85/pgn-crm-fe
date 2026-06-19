import React from "react";
import moment from "moment";
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

const mkSearchCol = (key, title, width, searchCtx, extra = {}) => {
  const { searchInput, searchedColumn, searchText, handleSearch, search } = searchCtx;
  return {
    ...mkCol(key, title, width, extra),
    ...getColumnSearchPropsUseFilteredValue(search, key, searchInput, searchedColumn, searchText, handleSearch, true),
    render: (text) => renderColumn(key, hasValue(search[key]), searchText, text, false, "input", search),
  };
};

const mkNumCol = (key, title, width) => ({
  ...mkCol(key, title, width, { align: "right" }),
  render: (text) => (text !== null && text !== undefined ? numberFormatting(text) : "-"),
});

const mkDateCol = (key, title, width) => ({
  ...mkCol(key, title, width),
  render: (text) => {
    if (!text) return "-";
    const m = moment(text);
    return m.isValid() ? m.format("D-MMM-YY") : "-";
  },
});

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

export const columnsPaySummaryBalance = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  search,
) => {
  const ctx = { searchInput, searchedColumn, searchText, handleSearch: handleSearch || (() => {}), search };

  return [
    {
      key: "no",
      title: "NO",
      width: 50,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },

    // ── Account Info ──────────────────────────────────────────────────────────
    mkSearchCol("customerNumber",   "CUSTOMER NUMBER",    130, ctx),
    mkSearchCol("customerName",     "CUSTOMER NAME",      160, ctx),
    mkSearchCol("accountNumber",    "ACCOUNT NUMBER",     130, ctx),
    mkSearchCol("accountName",      "ACCOUNT NAME",       160, ctx),
    mkSearchCol("accountGroupType", "ACCOUNT GROUP TYPE", 140, ctx),
    mkSearchCol("sor",              "SOR",                 90, ctx),
    mkSearchCol("costCenter",       "COST CENTER",        110, ctx),
    mkSearchCol("accountSegment",   "ACCOUNT SEGMENT",    130, ctx),
    mkSearchCol("meterReadingCode", "METER READING CODE", 130, ctx),

    // ── Financials ────────────────────────────────────────────────────────────
    { ...mkCol("bank", "BANK", 100), render: (text) => text ?? "-" },

    // EXPIRED BALANCE (M_PAY_GASDEPOSIT)
    mkNumCol("expiredBalance",    "EXPIRED BALANCE",     130),
    mkNumCol("eqvExpiredBalance", "EQV EXPIRED BALANCE", 145),

    // RATE info
    { ...mkCol("rateType", "RATE TYPE", 100), render: (text) => text ?? "-" },
    mkDateCol("rateDate", "RATE DATE", 105),
    mkNumCol("rate", "RATE", 95),

    // ── Billing (grouped) ────────────────────────────────────────────────────
    {
      key: "billing",
      title: "BILLING",
      isClassification: true,
      children: [
        { ...mkCol("billingPeriod",       "PERIOD",         95), render: (text) => text ?? "-" },
        { ...mkCol("billingCurrency",      "CURRENCY",      90), render: (text) => text ?? "-" },
        mkNumCol("billingAmountBalance",   "AMOUNT BALANCE", 130),
      ],
    },

    // ── Classification ────────────────────────────────────────────────────────
    mkSearchCol("accountType",        "ACCOUNT TYPE",       115, ctx),
    mkSearchCol("classificationType", "CLASSIFICATION TYPE", 145, ctx),
    mkSearchCol("sapCustId",          "SAP CUST ID",        105, ctx),

    // ── Mutation Detail ────────────────────────────────────────────────────────
    { ...mkCol("type",          "TYPE",          90), render: (text) => text ?? "-" },
    { ...mkCol("category",      "CATEGORY",      105), render: (text) => text ?? "-" },
    mkDateCol("mutationDate",   "MUTATION DATE", 115),
    mkNumCol("amount",           "AMOUNT",       120),
    mkNumCol("eqvAmount",        "EQV AMOUNT",   130),
    { ...mkCol("mutationSource", "MUTATION SOURCE", 120), render: (text) => text ?? "-" },
    { ...mkCol("period",         "PERIOD",          95), render: (text) => text ?? "-" },

    // ── Status ────────────────────────────────────────────────────────────────
    mkStatusCol("status",                 "STATUS",                  95),
    mkStatusCol("statusApproval",         "STATUS APPROVAL",         120),
    mkStatusCol("mutationStatus",         "MUTATION STATUS",         110),
    mkStatusCol("mutationApprovalStatus", "MUTATION APPROVAL STATUS", 135),
  ];
};
