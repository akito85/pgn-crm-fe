// components/InvoiceProcessingTable.js
import { useState, useMemo, useCallback } from "react";
import {
  Table,
  Button,
  DatePicker,
  Select,
  Space,
  Tag,
  Pagination,
  Card,
  Row,
  Col,
  Divider,
  Dropdown,
  Menu,
  Checkbox,
  Radio,
} from "antd";
import dayjs from "dayjs";
import {
  FilterOutlined,
  ReloadOutlined,
  EllipsisOutlined,
  EditOutlined,
  RedoOutlined,
  EyeOutlined,
  FileProtectOutlined,
  PushpinOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Option } = Select;

const InvoiceProcessingTable = ({
  dataSource = [],
  loading = false,
  onDetails = () => {},
  onProcessSigning = () => {},
  onRetry = () => {},
  onProcessStamping = () => {},
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dateRange, setDateRange] = useState([
    dayjs("2025-10-01"),
    dayjs("2025-10-31"),
  ]);
  const [stampingStatusFilter, setStampingStatusFilter] = useState("all");
  const [signingStatusFilter, setSigningStatusFilter] = useState("all");

  // Column fixing settings
  const [fixedColumns, setFixedColumns] = useState({
    invoiceNumber: "left",
  });
  const [columnFixDropdownVisible, setColumnFixDropdownVisible] =
    useState(false);

  // Available columns definition (in order)
  const allColumnDefinitions = [
    {
      key: "invoiceNumber",
      title: "Invoice #",
      dataIndex: "invoiceNumber",
      width: 130,
      render: (text) => <span style={{ fontWeight: "600" }}>{text}</span>,
    },
    {
      key: "customer",
      title: "Customer",
      dataIndex: "customer",
      width: 220,
      ellipsis: true,
    },
    {
      key: "issueDate",
      title: "Issue Date",
      dataIndex: "issueDate",
      width: 120,
      align: "center",
    },
    {
      key: "amount",
      title: "Amount (IDR)",
      dataIndex: "amount",
      width: 150,
      align: "right",
      render: (amount) => (
        <span style={{ fontWeight: "600", color: "#1890ff" }}>
          {new Intl.NumberFormat("id-ID").format(amount)}
        </span>
      ),
    },
    {
      key: "stampingStatus",
      title: "Stamping Status",
      dataIndex: "stampingStatus",
      width: 160,
      align: "center",
      render: (status) => {
        const getStampingStatusColor = (status) => {
          const statusMap = {
            "Pending Approval": "orange",
            Success: "green",
            Failed: "red",
            "Not Processed": "default",
          };
          return statusMap[status] || "default";
        };

        return (
          <Tag
            color={getStampingStatusColor(status)}
            style={{
              color: "#000",
              fontWeight: "500",
              padding: "4px 12px",
              fontSize: "13px",
            }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      key: "signingStatus",
      title: "Signing Status",
      dataIndex: "signingStatus",
      width: 150,
      align: "center",
      render: (status) => {
        const getSigningStatusColor = (status) => {
          const statusMap = {
            "Not Processed": "default",
            Success: "green",
          };
          return statusMap[status] || "default";
        };

        return (
          <Tag
            color={getSigningStatusColor(status)}
            style={{
              color: "#000",
              fontWeight: "500",
              padding: "4px 12px",
              fontSize: "13px",
            }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      key: "actions",
      title: "Actions",
      width: 80,
      align: "center",
      render: (_, record) => {
        const menuItems = [
          {
            key: "details",
            label: "Details",
            icon: <EyeOutlined />,
            onClick: () => onDetails(record),
          },
          {
            key: "process-stamping",
            label: "Process Stamping",
            icon: <FileProtectOutlined />,
            disabled: record.stampingStatus !== "Not Processed",
            onClick: () => onProcessStamping(record),
          },
          {
            key: "process-signing",
            label: "Process Signing",
            icon: <EditOutlined />,
            disabled: !(
              record.stampingStatus === "Success" &&
              record.signingStatus === "Not Processed"
            ),
            onClick: () => onProcessSigning(record),
          },
          {
            key: "retry",
            label: "Retry",
            icon: <RedoOutlined />,
            disabled: record.stampingStatus !== "Failed",
            onClick: () => onRetry(record),
          },
        ];

        const menu = <Menu items={menuItems} />;

        return (
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <Button
              type="text"
              icon={<EllipsisOutlined style={{ fontSize: "18px" }} />}
            />
          </Dropdown>
        );
      },
    },
  ];

  // Reorder and apply fixed positions to columns
  const columns = useMemo(() => {
    const leftFixed = [];
    const rightFixed = [];
    const normal = [];

    allColumnDefinitions.forEach((col) => {
      const fixedPos = fixedColumns[col.key];
      const colWithFixed = { ...col, fixed: fixedPos || undefined };

      if (fixedPos === "left") {
        leftFixed.push(colWithFixed);
      } else if (fixedPos === "right") {
        rightFixed.push(colWithFixed);
      } else {
        normal.push(colWithFixed);
      }
    });

    return [...leftFixed, ...normal, ...rightFixed];
  }, [fixedColumns]);

  const handleColumnFixChange = (columnKey, checked) => {
    if (checked) {
      // Determine default position based on column index
      const columnIndex = allColumnDefinitions.findIndex(
        (col) => col.key === columnKey
      );
      const isFirstColumn = columnIndex === 0;
      const isLastColumn = columnIndex === allColumnDefinitions.length - 1;

      let defaultPosition = "left";
      if (isLastColumn) {
        defaultPosition = "right";
      }

      setFixedColumns((prev) => ({ ...prev, [columnKey]: defaultPosition }));
    } else {
      const newFixed = { ...fixedColumns };
      delete newFixed[columnKey];
      setFixedColumns(newFixed);
    }
  };

  const handleColumnPositionChange = (columnKey, position) => {
    setFixedColumns((prev) => ({ ...prev, [columnKey]: position }));
  };

  // Filter options
  const stampingStatusOptions = [
    { value: "all", label: "All Stamping Status" },
    { value: "not-processed", label: "Not Processed" },
    { value: "pending-approval", label: "Pending Approval" },
    { value: "success", label: "Success" },
    { value: "failed", label: "Failed" },
  ];

  const signingStatusOptions = [
    { value: "all", label: "All Signing Status" },
    { value: "not-processed", label: "Not Processed" },
    { value: "success", label: "Success" },
  ];

  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setPage(1);
    }
  };

  // Check if column can have specific position
  const canFixLeft = (columnIndex) => {
    return columnIndex !== allColumnDefinitions.length - 1;
  };

  const canFixRight = (columnIndex) => {
    return columnIndex !== 0;
  };

  // Column fixing menu
  const columnFixMenu = (
    <div
      style={{
        padding: "12px",
        marginTop: "30px",
        minWidth: "320px",
        maxHeight: "500px",
        overflowY: "auto",
        border: "1px solid #ddd",
        borderRadius: "6px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{
          marginBottom: "12px",
          fontWeight: "600",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#262626",
        }}
      >
        <PushpinOutlined />
        Fix Columns Position
      </div>
      <Divider style={{ margin: "8px 0" }} />

      {allColumnDefinitions.map((col, index) => {
        const isFixed = !!fixedColumns[col.key];
        const position = fixedColumns[col.key] || "left";
        const isFirstColumn = index === 0;
        const isLastColumn = index === allColumnDefinitions.length - 1;

        return (
          <div
            key={col.key}
            style={{
              marginBottom: "16px",
              padding: "12px",
              backgroundColor: isFixed ? "#f0f5ff" : "#fafafa",
              borderRadius: "6px",
              border: isFixed ? "1px solid #d6e4ff" : "1px solid #f0f0f0",
              transition: "all 0.3s",
            }}
          >
            <div style={{ marginBottom: isFixed ? "8px" : "0" }}>
              <Checkbox
                checked={isFixed}
                onChange={(e) =>
                  handleColumnFixChange(col.key, e.target.checked)
                }
                style={{ fontWeight: "500" }}
              >
                {col.title}
              </Checkbox>
            </div>

            {isFixed && (
              <div
                style={{
                  marginLeft: "24px",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#595959",
                      fontWeight: "500",
                    }}
                  >
                    Position:
                  </span>
                  <Radio.Group
                    value={position}
                    onChange={(e) =>
                      handleColumnPositionChange(col.key, e.target.value)
                    }
                    size="small"
                    buttonStyle="solid"
                    style={{ display: "flex", gap: "6px" }}
                  >
                    <Radio.Button value="left" disabled={!canFixLeft(index)}>
                      Left
                    </Radio.Button>
                    <Radio.Button value="right" disabled={!canFixRight(index)}>
                      Right
                    </Radio.Button>
                  </Radio.Group>
                </div>
                {(isFirstColumn || isLastColumn) && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#8c8c8c",
                      marginTop: "4px",
                      fontStyle: "italic",
                    }}
                  >
                    {isFirstColumn && "* First column can only be fixed left"}
                    {isLastColumn && "* Last column can only be fixed right"}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <Divider style={{ margin: "12px 0" }} />

      <div
        style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}
      >
        <Button
          size="small"
          onClick={() => setFixedColumns({})}
          style={{ flex: 1 }}
        >
          Clear All
        </Button>
        <Button
          size="small"
          type="primary"
          onClick={() => setColumnFixDropdownVisible(false)}
          style={{ flex: 1 }}
        >
          Done
        </Button>
      </div>
    </div>
  );

  return (
    <div style={{ width: "100%" }}>
      {/* Filter Section */}
      <Card style={{ marginBottom: "20px" }} bordered={false}>
        <div
          style={{
            marginBottom: "16px",
            fontSize: "16px",
            fontWeight: "600",
            color: "#262626",
          }}
        >
          Invoice Processing Status ({dataSource.length} total)
        </div>
      </Card>

      {/* Table */}
      <Card bordered={false} style={{ marginBottom: "20px" }}>
        <Row gutter={[16, 16]} className="pb-4">
          <Col xs={24} sm={12} lg={6}>
            <div style={{ marginBottom: "8px", fontWeight: "500" }}>
              Date Range
            </div>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div style={{ marginBottom: "8px", fontWeight: "500" }}>
              Stamping Status
            </div>
            <Select
              placeholder="Select stamping status"
              value={stampingStatusFilter}
              onChange={setStampingStatusFilter}
              style={{ width: "100%" }}
            >
              {stampingStatusOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div style={{ marginBottom: "8px", fontWeight: "500" }}>
              Signing Status
            </div>
            <Select
              placeholder="Select signing status"
              value={signingStatusFilter}
              onChange={setSigningStatusFilter}
              style={{ width: "100%" }}
            >
              {signingStatusOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div
              style={{
                marginBottom: "8px",
                fontWeight: "500",
                color: "transparent",
              }}
            >
              _
            </div>
            <Dropdown
              overlay={columnFixMenu}
              trigger={["click"]}
              visible={columnFixDropdownVisible}
              onVisibleChange={setColumnFixDropdownVisible}
              placement="bottomRight"
            >
              <Button icon={<SettingOutlined />} style={{ width: "100%" }}>
                Fix Columns ({Object.keys(fixedColumns).length})
              </Button>
            </Dropdown>
          </Col>
        </Row>
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          pagination={false}
          scroll={{ x: 1200, y: 500 }}
          bordered
          size="middle"
          rowKey="invoiceNumber"
          locale={{
            emptyText: "No invoices found matching your criteria",
          }}
        />
      </Card>

      {/* Pagination */}
      <Card bordered={false}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "14px", color: "#595959" }}>
              Rows per page:
            </span>
            <Select
              value={pageSize}
              onChange={(value) => handlePageChange(1, value)}
              style={{ width: 80 }}
            >
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
            <span style={{ fontSize: "14px", color: "#595959" }}>
              Showing {dataSource.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
              {Math.min(page * pageSize, dataSource.length)} of{" "}
              {dataSource.length} entries
            </span>
          </div>

          <Pagination
            current={page}
            pageSize={pageSize}
            total={dataSource.length}
            onChange={handlePageChange}
            showSizeChanger={false}
            showTotal={false}
          />
        </div>
      </Card>
    </div>
  );
};

export default InvoiceProcessingTable;
