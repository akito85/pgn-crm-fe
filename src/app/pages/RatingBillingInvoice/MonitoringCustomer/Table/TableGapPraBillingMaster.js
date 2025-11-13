import React from "react";
import { Input, Button, Space, Tooltip } from "antd";
import { SearchOutlined, SyncOutlined, FileTextOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

export const columnsGapPraBillingMaster = (
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
      title: "Customer ID",
      dataIndex: "customerId",
      key: "customerId",
      width: 130,
      fixed: "left",
      sorter: true,
      ...getColumnSearchProps("customerId", "Customer ID"),
    },
    {
      title: "Name",
      dataIndex: "customerName",
      key: "customerName",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("customerName", "Name"),
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
      title: "Field Mismatch",
      dataIndex: "fieldMismatch",
      key: "fieldMismatch",
      width: 180,
      sorter: true,
      render: (text) => text || "-",
    },
    {
      title: "Pra-Billing Value",
      dataIndex: "praBillingValue",
      key: "praBillingValue",
      width: 200,
      sorter: true,
      render: (text) => (
        <span style={{ fontWeight: 500, color: "#fa8c16" }}>
          {text || "-"}
        </span>
      ),
    },
    {
      title: "Master Value",
      dataIndex: "masterValue",
      key: "masterValue",
      width: 200,
      sorter: true,
      render: (text) => (
        <span style={{ fontWeight: 500, color: "#52c41a" }}>
          {text || "-"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 180,
      fixed: "right",
      align: "center",
      render: (text, record) => (
        <Space size="small">
          <Tooltip title="Sync dengan Master Data">
            <Button
              type="primary"
              size="small"
              icon={<SyncOutlined />}
              onClick={() => handleSyncData(record)}
            >
              Sync
            </Button>
          </Tooltip>
          <Tooltip title="Buat Tiket">
            <Button
              type="default"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => handleCreateTicket(record)}
            >
              Tiket
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];
};