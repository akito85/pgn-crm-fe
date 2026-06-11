import React from "react";
import moment from "moment";
import { hasValue, renderColumn } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { numberFormatting } from "../../../../../utils/formatCurrency";
import StatusComponent from "../../../../../components/StatusComponent";

const mkSearchCol = (key, title, width, searchCtx) => {
  const { searchInput, searchedColumn, searchText, handleSearch, search } = searchCtx;
  return {
    key,
    title,
    dataIndex: key,
    isClassification: true,
    width,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(search, key, searchInput, searchedColumn, searchText, handleSearch, true),
    render: (text) => renderColumn(key, hasValue(search[key]), searchText, text, false, "input", search),
  };
};

const mkNumCol = (key, title, width) => ({
  key,
  title,
  dataIndex: key,
  isClassification: true,
  width,
  sorter: true,
  align: "right",
  render: (text) => (text !== null && text !== undefined ? numberFormatting(text) : "-"),
});

const mkDateCol = (key, title, width) => ({
  key,
  title,
  dataIndex: key,
  isClassification: true,
  width,
  sorter: true,
  render: (text) => {
    if (!text) return "-";
    const m = moment(text);
    return m.isValid() ? m.format("D-MMM-YY") : String(text);
  },
});

const mkStatusCol = (key, title, width) => ({
  key,
  title,
  dataIndex: key,
  isClassification: true,
  width,
  align: "center",
  render: (text) =>
    text ? (
      <div className="flex justify-center">
        <StatusComponent colour={text?.toLowerCase()}>{text}</StatusComponent>
      </div>
    ) : (
      "-"
    ),
});

export const columnsPayMutationDetail = ({
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search,
  actionRenderer,
} = {}) => {
  const ctx = { searchInput, searchedColumn, searchText, handleSearch, search };

  return [
    {
      key: "no",
      title: "NO",
      isClassification: true,
      width: 50,
      align: "center",
      render: (text, object, index) => index + 1,
    },

    mkSearchCol("documentNumber", "DOCUMENT NUMBER", 180, ctx),
    mkSearchCol("type",           "TYPE",            110, ctx),
    mkSearchCol("category",       "CATEGORY",        140, ctx),
    mkDateCol("mutationDate",     "MUTATION DATE",   140),
    mkSearchCol("rateType",       "RATE TYPE",       110, ctx),
    mkDateCol("rateDate",         "RATE DATE",       120),
    mkNumCol("rate",              "RATE",            110),
    mkNumCol("amount",            "AMOUNT",          140),
    mkNumCol("eqvAmount",         "EQV BALANCE",     150),
    mkSearchCol("source",         "SOURCE",          110, ctx),
    mkSearchCol("billingPeriod",  "PERIOD",          110, ctx),
    mkSearchCol("description",    "DESCRIPTION",     180, ctx),

    mkStatusCol("status",         "STATUS",          120),
    mkStatusCol("statusApproval", "STATUS APPROVAL", 160),

    {
      key: "action",
      title: "ACTION",
      dataIndex: "action",
      isClassification: true,
      width: 80,
      align: "center",
      render: (_, record) =>
        typeof actionRenderer === "function" ? actionRenderer(record) : null,
    },
  ];
};
