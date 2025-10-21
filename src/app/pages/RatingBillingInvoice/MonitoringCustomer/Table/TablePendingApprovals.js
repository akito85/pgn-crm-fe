import React from "react";
import { Input, Button, Space, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import SVGIcon from "../../../../../assets/Icon/index";


export const columnsPendingApprovals = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  search,
  handleApprovalDetail
) => {
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
      title: "Batch ID",
      dataIndex: "batchId",
      key: "batchId",
      width: 150,
      fixed: "left",
      sorter: true,
      ...getColumnSearchProps("batchId", "Batch ID"),
    },
    {
      title: "Billing Period",
      dataIndex: "billingPeriod",
      key: "billingPeriod",
      width: 150,
      sorter: true,
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("accountNumber", "Account Number"),
    },
    {
      title: "Total Customers",
      dataIndex: "totalCustomers",
      key: "totalCustomers",
      width: 150,
      sorter: true,
      align: "right",
      render: (text) => (text ? text.toLocaleString("id-ID") : "-"),
    },
    {
      title: "Est. Amount (Rp)",
      dataIndex: "estimatedAmount",
      key: "estimatedAmount",
      width: 180,
      sorter: true,
      align: "right",
      render: (text) => (text ? text.toLocaleString("id-ID") : "-"),
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 130,
      sorter: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      sorter: true,
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      fixed: "right",
      render: (text, record) => (
        <Tooltip title="Approval Detail">
          <div className="pt-1">
            <SVGIcon
              name="IconDetail"
              width={24}
              color="#1890ff"
              onClick={() => handleApprovalDetail(record)}
              style={{ cursor: "pointer" }}
            />
          </div>
        </Tooltip>
      ),
    },
  ];
};