import React from "react";
import { Tooltip } from "antd";
import SVGIcon from "../../../../../assets/Icon/index";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../../utils";

export const getColumnsPendingTransactions = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  search,
  handleRecalculate,
  handleInvestigate
) => {
  return [
    {
      key: "no",
      title: "NO",
      width: 60,
      align: "center",
      render: (text, record, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "customerId",
      title: "CUSTOMER ID",
      dataIndex: "customerId",
      sorter: true,
      align: "left",
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
      align: "left",
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
      key: "address",
      title: "ADDRESS",
      dataIndex: "address",
      sorter: true,
      align: "left",
      width: 250,
      filteredValue: [search?.address] || null,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "address",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "address",
          hasValue(search["address"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      key: "accountNumber",
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      sorter: true,
      align: "left",
      width: 180,
      filteredValue: [search?.accountNumber] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "accountNumber",
          hasValue(search["accountNumber"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "type",
      title: "TYPE",
      dataIndex: "type",
      sorter: true,
      align: "center",
      width: 120,
      filteredValue: [search?.type] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "type",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "type",
          hasValue(search["type"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "area",
      title: "AREA",
      dataIndex: "area",
      sorter: true,
      align: "center",
      width: 150,
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
      key: "period",
      title: "PERIOD",
      dataIndex: "period",
      sorter: true,
      align: "center",
      width: 120,
      filteredValue: [search?.period] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "period",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "period",
          hasValue(search["period"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "volume",
      title: "VOLUME (m³)",
      dataIndex: "volume",
      sorter: true,
      align: "right",
      width: 140,
      filteredValue: [search?.volume] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "volume",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        const displayText = text?.toLocaleString("id-ID") || "-";
        return renderColumn(
          "volume",
          hasValue(search["volume"]),
          searchText,
          displayText,
          false,
          "input",
          search
        );
      },
    },
    {
      key: "pendingAmount",
      title: "PENDING AMOUNT",
      dataIndex: "pendingAmount",
      sorter: true,
      align: "right",
      width: 150,
      filteredValue: [search?.pendingAmount] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "pendingAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        const displayText = text?.toLocaleString("id-ID") || "-";
        return renderColumn(
          "pendingAmount",
          hasValue(search["pendingAmount"]),
          searchText,
          displayText,
          false,
          "input",
          search
        );
      },
    },
    {
      key: "receivedAt",
      title: "RECEIVED AT",
      dataIndex: "receivedAt",
      sorter: true,
      align: "center",
      width: 150,
      filteredValue: [search?.receivedAt] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "receivedAt",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        renderColumn(
          "receivedAt",
          hasValue(search["receivedAt"]),
          searchText,
          text,
          false,
          "date",
          search
        ),
    },
    {
      key: "status",
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
      align: "center",
      width: 130,
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
      align: "center",
      render: (record) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <Tooltip title="Recalculate">
            <div 
              className="cursor-pointer"
              onClick={() => handleRecalculate(record)}
            >
              <SVGIcon name="IconRefresh" width={20} />
            </div>
          </Tooltip>
          <Tooltip title="Investigate">
            <div 
              className="cursor-pointer"
              onClick={() => handleInvestigate(record)}
            >
              <SVGIcon name="IconSearch" width={20} />
            </div>
          </Tooltip>
        </div>
      ),
    },
  ];
};