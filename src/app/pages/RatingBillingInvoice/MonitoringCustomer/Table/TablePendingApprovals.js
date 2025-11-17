import React from "react";
import { Tooltip } from "antd";
import SVGIcon from "../../../../../assets/Icon/index";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../../utils";

export const getColumnsPendingApprovals = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  search,
  handleApprovalDetail
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
      key: "batchId",
      title: "BATCH ID",
      dataIndex: "batchId",
      sorter: true,
      align: "left",
      width: 180,
      filteredValue: [search?.batchId] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "batchId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "batchId",
          hasValue(search["batchId"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "billingPeriod",
      title: "BILLING PERIOD",
      dataIndex: "billingPeriod",
      sorter: true,
      align: "center",
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
      key: "totalCustomers",
      title: "TOTAL CUSTOMERS",
      dataIndex: "totalCustomers",
      sorter: true,
      align: "right",
      width: 150,
      filteredValue: [search?.totalCustomers] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "totalCustomers",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        const displayText = text?.toLocaleString("id-ID") || "-";
        return renderColumn(
          "totalCustomers",
          hasValue(search["totalCustomers"]),
          searchText,
          displayText,
          false,
          "input",
          search
        );
      },
    },
    {
      key: "estimatedAmount",
      title: "EST. AMOUNT (Rp)",
      dataIndex: "estimatedAmount",
      sorter: true,
      align: "right",
      width: 180,
      filteredValue: [search?.estimatedAmount] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "estimatedAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        const displayText = text?.toLocaleString("id-ID") || "-";
        return renderColumn(
          "estimatedAmount",
          hasValue(search["estimatedAmount"]),
          searchText,
          displayText,
          false,
          "input",
          search
        );
      },
    },
    {
      key: "createdBy",
      title: "CREATED BY",
      dataIndex: "createdBy",
      sorter: true,
      align: "center",
      width: 150,
      filteredValue: [search?.createdBy] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "createdBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "createdBy",
          hasValue(search["createdBy"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "createdAt",
      title: "CREATED AT",
      dataIndex: "createdAt",
      sorter: true,
      align: "center",
      width: 180,
      filteredValue: [search?.createdAt] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "createdAt",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        renderColumn(
          "createdAt",
          hasValue(search["createdAt"]),
          searchText,
          text,
          false,
          "date",
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
      width: 100,
      align: "center",
      render: (record) => (
        <Tooltip title="View Detail">
          <div 
            className="cursor-pointer pt-1"
            onClick={() => handleApprovalDetail(record)}
          >
            <SVGIcon name="IconDetail" width={24} />
          </div>
        </Tooltip>
      ),
    },
  ];
};