import React from "react";
import { Tooltip } from "antd";
import SVGIcon from "../../../../../assets/Icon/index";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../../utils";

export const getColumnsGapPraBillingMaster = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  search,
  handleSyncData,
  handleCreateTicket
) => {
  return [
    {
      key: "no",
      title: "NO",
      width: 60,
      isClassification: true,
      render: (text, record, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "customerId",
      title: "CUSTOMER ID",
      dataIndex: "customerId",
      sorter: true,
      width: 150,
      filteredValue: [search?.customerId] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "customerId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "customerId",
          hasValue(search["customerId"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "customerName",
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      sorter: true,
      width: 250,
      filteredValue: [search?.customerName] || null,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "customerName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "customerName",
          hasValue(search["customerName"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      key: "billingPeriod",
      title: "BILLING PERIOD",
      dataIndex: "billingPeriod",
      sorter: true,
      isClassification: true,
      width: 150,
      filteredValue: [search?.billingPeriod] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingPeriod",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "billingPeriod",
          hasValue(search["billingPeriod"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "fieldMismatch",
      title: "FIELD MISMATCH",
      dataIndex: "fieldMismatch",
      sorter: true,
      width: 200,
      filteredValue: [search?.fieldMismatch] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "fieldMismatch",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "fieldMismatch",
          hasValue(search["fieldMismatch"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "praBillingValue",
      title: "PRA-BILLING VALUE",
      dataIndex: "praBillingValue",
      sorter: true,
      width: 220,
      filteredValue: [search?.praBillingValue] || null,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "praBillingValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => (
        <span style={{ fontWeight: 500, color: "#fa8c16" }}>
          {renderColumn(
            "praBillingValue",
            hasValue(search["praBillingValue"]),
            searchText,
            text || "-",
            true,
            "input",
            search
          )}
        </span>
      ),
    },
    {
      key: "masterValue",
      title: "MASTER VALUE",
      dataIndex: "masterValue",
      sorter: true,
      width: 220,
      filteredValue: [search?.masterValue] || null,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "masterValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => (
        <span style={{ fontWeight: 500, color: "#52c41a" }}>
          {renderColumn(
            "masterValue",
            hasValue(search["masterValue"]),
            searchText,
            text || "-",
            true,
            "input",
            search
          )}
        </span>
      ),
    },
    {
      key: "area",
      title: "AREA",
      dataIndex: "area",
      sorter: true,
      isClassification: true,
      width: 130,
      filteredValue: [search?.area] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "area",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "area",
          hasValue(search["area"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "status",
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
      isClassification: true,
      width: 150,
      filteredValue: [search?.status] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "status",
          hasValue(search["status"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "action",
      title: "ACTION",
      width: 120,
      isClassification: true,
      render: (record) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <Tooltip title="Sync dengan Master Data">
            <div 
              className="cursor-pointer"
              onClick={() => handleSyncData(record)}
            >
              <SVGIcon name="IconSync" width={20} />
            </div>
          </Tooltip>
          <Tooltip title="Buat Tiket">
            <div 
              className="cursor-pointer"
              onClick={() => handleCreateTicket(record)}
            >
              <SVGIcon name="IconTicket" width={20} />
            </div>
          </Tooltip>
        </div>
      ),
    },
  ];
};