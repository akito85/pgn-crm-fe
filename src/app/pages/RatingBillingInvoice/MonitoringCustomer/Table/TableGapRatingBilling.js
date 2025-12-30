import React from "react";
import { Tag } from "antd";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../../utils";

export const getColumnsGapRatingBilling = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  search
) => {
  return [
    {
      key: "no",
      title: "NO",
    isClassification: true,
      width: 60,
      render: (text, record, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "accountNumber",
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      sorter: true,
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
      key: "ratingCode",
      title: "RATING CODE",
      dataIndex: "ratingCode",
      sorter: true,
      width: 130,
      filteredValue: [search?.ratingCode] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "ratingCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "ratingCode",
          hasValue(search["ratingCode"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "ratingValue",
      title: "RATING VALUE",
      dataIndex: "ratingValue",
      sorter: true,
    isNumber: true,
      width: 170,
      filteredValue: [search?.ratingValue] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "ratingValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        const displayText = text ? `Rp ${text.toLocaleString("id-ID")}` : "-";
        return (
          <span style={{ fontWeight: 500 }}>
            {renderColumn(
              "ratingValue",
              hasValue(search["ratingValue"]),
              searchText,
              displayText,
              false,
              "input",
              search
            )}
          </span>
        );
      },
    },
    {
      key: "billingCode",
      title: "BILLING CODE",
      dataIndex: "billingCode",
      sorter: true,
      width: 130,
      filteredValue: [search?.billingCode] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "billingCode",
          hasValue(search["billingCode"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "billingValue",
      title: "BILLING VALUE",
      dataIndex: "billingValue",
      sorter: true,
    isNumber: true,
      width: 170,
      filteredValue: [search?.billingValue] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        const displayText = text ? `Rp ${text.toLocaleString("id-ID")}` : "-";
        return (
          <span style={{ fontWeight: 500 }}>
            {renderColumn(
              "billingValue",
              hasValue(search["billingValue"]),
              searchText,
              displayText,
              false,
              "input",
              search
            )}
          </span>
        );
      },
    },
    {
      key: "gap",
      title: "GAP AMOUNT",
      dataIndex: "gap",
      sorter: true,
      width: 170,
      filteredValue: [search?.gap] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "gap",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (gap) => {
        const isPositive = gap > 0;
        const isNegative = gap < 0;
        const displayText = gap ? `Rp ${gap.toLocaleString("id-ID")}` : "Rp 0";
        
        return (
          <span
            style={{
              fontWeight: 600,
              color: isPositive ? "#52c41a" : isNegative ? "#ff4d4f" : "#000",
            }}
          >
            {renderColumn(
              "gap",
              hasValue(search["gap"]),
              searchText,
              displayText,
              false,
              "input",
              search
            )}
          </span>
        );
      },
    },
    {
      key: "gapPercentage",
      title: "GAP (%)",
      dataIndex: "gapPercentage",
      sorter: true,
      width: 120,
      filteredValue: [search?.gapPercentage] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "gapPercentage",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (percentage) => {
        const value = parseFloat(percentage);
        const isPositive = value > 0;
        const isNegative = value < 0;
        const displayText = `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
        
        return (
          <Tag color={isPositive ? "success" : isNegative ? "error" : "default"}>
            {displayText}
          </Tag>
        );
      },
    },
    {
      key: "detectedAt",
      title: "DETECTED AT",
      dataIndex: "detectedAt",
      sorter: true,
      width: 180,
      filteredValue: [search?.detectedAt] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "detectedAt",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        renderColumn(
          "detectedAt",
          hasValue(search["detectedAt"]),
          searchText,
          text,
          false,
          "date",
          search
        ),
    },
  ];
};