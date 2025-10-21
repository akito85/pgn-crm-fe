import React from "react";
import { Input, Button, Space, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

export const columnsGapRatingBilling = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  search
) => {
  // Get Column Search Props
  const getColumnSearchProps = (dataIndex, name) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${name}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters();
              handleSearch([""], confirm, dataIndex);
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  return [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 60,
      fixed: "left",
      render: (text, record, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: 150,
      fixed: "left",
      sorter: true,
      ...getColumnSearchProps("accountNumber", "Account Number"),
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("customerName", "Customer Name"),
    },
    {
      title: "Billing Period",
      dataIndex: "billingPeriod",
      key: "billingPeriod",
      width: 130,
      sorter: true,
      align: "center",
    },
    {
      title: "Rating Code",
      dataIndex: "ratingCode",
      key: "ratingCode",
      width: 120,
      sorter: true,
      align: "center",
    },
    {
      title: "Rating Value",
      dataIndex: "ratingValue",
      key: "ratingValue",
      width: 150,
      sorter: true,
      align: "right",
      render: (text) => (
        <span style={{ fontWeight: 500 }}>
          {text ? `Rp ${text.toLocaleString("id-ID")}` : "-"}
        </span>
      ),
    },
    {
      title: "Billing Code",
      dataIndex: "billingCode",
      key: "billingCode",
      width: 120,
      sorter: true,
      align: "center",
    },
    {
      title: "Billing Value",
      dataIndex: "billingValue",
      key: "billingValue",
      width: 150,
      sorter: true,
      align: "right",
      render: (text) => (
        <span style={{ fontWeight: 500 }}>
          {text ? `Rp ${text.toLocaleString("id-ID")}` : "-"}
        </span>
      ),
    },
    {
      title: "Gap Amount",
      dataIndex: "gap",
      key: "gap",
      width: 150,
      sorter: true,
      align: "right",
      render: (gap) => {
        const isPositive = gap > 0;
        const isNegative = gap < 0;
        return (
          <span
            style={{
              fontWeight: 600,
              color: isPositive ? "#52c41a" : isNegative ? "#ff4d4f" : "#000",
            }}
          >
            {gap ? `Rp ${gap.toLocaleString("id-ID")}` : "Rp 0"}
          </span>
        );
      },
    },
    {
      title: "Gap (%)",
      dataIndex: "gapPercentage",
      key: "gapPercentage",
      width: 110,
      sorter: true,
      align: "center",
      render: (percentage) => {
        const value = parseFloat(percentage);
        const isPositive = value > 0;
        const isNegative = value < 0;
        return (
          <Tag color={isPositive ? "success" : isNegative ? "error" : "default"}>
            {value > 0 ? "+" : ""}{value.toFixed(2)}%
          </Tag>
        );
      },
    },
    {
      title: "Detected At",
      dataIndex: "detectedAt",
      key: "detectedAt",
      width: 170,
      sorter: true,
      align: "center",
    },
  ];
};