import React from "react";
import { Input, Button, Space, Tooltip } from "antd";
import { SearchOutlined, ReloadOutlined, EyeOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";


export const columnsPendingTransactions = (
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
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 180,
      sorter: true,
      ...getColumnSearchProps("address", "Address"),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 130,
      sorter: true,
      filters: [
        { text: "Rumah Tangga", value: "Rumah Tangga" },
        { text: "Komersial", value: "Komersial" },
        { text: "Industri", value: "Industri" },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "Period",
      dataIndex: "period",
      key: "period",
      width: 110,
      sorter: true,
      align: "center",
    },
    {
      title: "Volume (m³)",
      dataIndex: "volume",
      key: "volume",
      width: 130,
      sorter: true,
      align: "right",
      render: (text) => (
        <span style={{ fontWeight: 500 }}>
          {text ? text.toLocaleString("id-ID") : "-"}
        </span>
      ),
    },
    {
      title: "Received At",
      dataIndex: "receivedAt",
      key: "receivedAt",
      width: 130,
      sorter: true,
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      fixed: "right",
      align: "center",
      render: (text, record) => (
        <Space size="small">
          <Tooltip title="Recalculate">
            <Button
              type="primary"
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => handleRecalculate(record)}
            >
              Recalculate
            </Button>
          </Tooltip>
          <Tooltip title="Investigate">
            <Button
              type="default"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleInvestigate(record)}
              style={{ 
                borderColor: "#faad14",
                color: "#faad14"
              }}
            >
              Investigate
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];
};