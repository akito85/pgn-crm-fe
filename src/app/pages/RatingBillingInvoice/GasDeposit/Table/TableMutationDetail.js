import React from "react";
import { hasValue, renderColumn } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { numberFormatting } from "../../../../../utils/formatCurrency";
import StatusComponent from "../../../../../components/StatusComponent";

export const columnsMutationDetail = (
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
    width: 60,
    align: "center",
    render: (text, object, index) => index + 1,
  },
  {
    key: "documentNumber",
    title: "DOCUMENT NUMBER",
    dataIndex: "documentNumber",
    isClassification: true,
    width: 180,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "documentNumber", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) =>
      renderColumn("documentNumber", hasValue(search["documentNumber"]), searchText, text, false, "input", search),
  },
  {
    key: "source",
    title: "SOURCE",
    dataIndex: "source",
    isClassification: true,
    width: 120,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "source", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) =>
      renderColumn("source", hasValue(search["source"]), searchText, text, false, "input", search),
  },
  {
    key: "billingPeriod",
    title: "BILLING PERIOD",
    dataIndex: "billingPeriod",
    isClassification: true,
    width: 140,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "billingPeriod", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) => text ?? "-",
  },
  {
    key: "mutationDate",
    title: "MUTATION DATE",
    dataIndex: "mutationDate",
    isClassification: true,
    width: 140,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "mutationDate", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) => text ?? "-",
  },
  {
    key: "mutationType",
    title: "MUTATION TYPE",
    dataIndex: "mutationType",
    isClassification: true,
    width: 140,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "mutationType", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) =>
      renderColumn("mutationType", hasValue(search["mutationType"]), searchText, text, false, "input", search),
  },
  {
    key: "category",
    title: "CATEGORY",
    dataIndex: "category",
    isClassification: true,
    width: 160,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "category", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) =>
      renderColumn("category", hasValue(search["category"]), searchText, text, false, "input", search),
  },
  {
    key: "uom",
    title: "UOM",
    dataIndex: "uom",
    isClassification: true,
    width: 90,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "uom", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) =>
      renderColumn("uom", hasValue(search["uom"]), searchText, text, false, "input", search),
  },
  {
    key: "quantity",
    title: "QUANTITY",
    dataIndex: "quantity",
    isClassification: true,
    width: 120,
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search, "quantity", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) => (text !== null && text !== undefined ? numberFormatting(text) : "-"),
  },
  {
    key: "price",
    title: "PRICE",
    dataIndex: "price",
    isClassification: true,
    width: 130,
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search, "price", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) => (text !== null && text !== undefined ? numberFormatting(text) : "-"),
  },
  {
    key: "amount",
    title: "AMOUNT",
    dataIndex: "amount",
    isClassification: true,
    width: 130,
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search, "amount", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) => (text !== null && text !== undefined ? numberFormatting(text) : "-"),
  },
  {
    key: "type",
    title: "TYPE",
    dataIndex: "type",
    isClassification: true,
    width: 120,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "type", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) => text ?? "-",
  },
  {
    key: "description",
    title: "DESCRIPTION",
    dataIndex: "description",
    isClassification: true,
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "description", searchInput, searchedColumn, searchText, handleSearch, true,
    ),
    render: (text) => text ?? "-",
  },
  {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    isClassification: true,
    width: 120,
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
    width: 160,
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
