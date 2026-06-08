/**
 * TablePayGasDeposit.js
 *
 * Column definitions for the Payment Gas Deposit — "Gas Deposit" tab.
 * Backend source: GET /v1/dbs/api/pay-gas-deposit/get-list (VW_RBI_GASDEP_SUMMARY)
 *
 * Columns align with the Payment domain ER diagram:
 *   Account info (from VW_RBI_GASDEP_SUMMARY join account tables)
 *   + Payment financials: balance, eqvBalance, billingCurrency, bankInfo, rateInfo
 *   + Status from M_PAY_GASDEPOSIT
 */
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

const mkNumCol = (key, title, width, searchCtx) => ({
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

export const columnsPayGasDeposit = (
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
      render: (text, object, index) => index + 1,
    },

    // ── Account Info ──────────────────────────────────────────────────────────
    mkSearchCol("customerNumber",   "CUSTOMER NUMBER",    160, ctx),
    mkSearchCol("customerName",     "CUSTOMER NAME",      180, ctx),
    mkSearchCol("accountNumber",    "ACCOUNT NUMBER",     160, ctx),
    mkSearchCol("accountName",      "ACCOUNT NAME",       180, ctx),
    mkSearchCol("accountGroupType", "ACCOUNT GROUP TYPE", 160, ctx),
    mkSearchCol("sor",              "SOR",                100, ctx),
    mkSearchCol("costCenter",       "COST CENTER",        130, ctx),
    mkSearchCol("accountSegment",   "ACCOUNT SEGMENT",    150, ctx),
    mkSearchCol("meterReadingCode", "METER READING CODE", 160, ctx),

    // ── Transaction Info ──────────────────────────────────────────────────────
    mkSearchCol("documentNumber", "DOCUMENT NUMBER", 160, ctx),
    mkSearchCol("source",         "SOURCE",          110, ctx),
    mkDateCol("paymentDate",      "PAYMENT DATE",    140),
    mkSearchCol("currency",       "CURRENCY",        110, ctx),
    mkSearchCol("bank",           "BANK",            120, ctx),

    // ── Financials ────────────────────────────────────────────────────────────
    mkNumCol("balance",    "BALANCE",    140),
    mkSearchCol("rateType", "RATE TYPE",  110, ctx),
    mkDateCol("rateDate",   "RATE DATE",  120),
    mkNumCol("rate",        "RATE",       100),
    mkNumCol("eqvBalance",  "EQV BALANCE", 150),

    // ── Billing ───────────────────────────────────────────────────────────────
    mkSearchCol("billingPeriod",      "BILLING PERIOD",       140, ctx),
    mkSearchCol("billingCurrency",    "BILLING CURRENCY",     130, ctx),
    mkNumCol("billingAmountBalance",  "BILLING AMOUNT BALANCE", 180),

    // ── Classification ────────────────────────────────────────────────────────
    mkSearchCol("accountType",        "ACCOUNT TYPE",        130, ctx),
    mkSearchCol("classificationType", "CLASSIFICATION TYPE", 170, ctx),
    mkSearchCol("sapCustId",          "SAP CUST ID",         120, ctx),
    mkSearchCol("description",        "DESCRIPTION",         180, ctx),

    // ── Status ────────────────────────────────────────────────────────────────
    mkStatusCol("status",         "STATUS",          120),
    mkStatusCol("statusApproval", "STATUS APPROVAL", 160),
  ];
};
