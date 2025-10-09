// components/InvoiceProcessingTable.js
import { useState } from "react";
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

  // Get status color with black text
  const getStampingStatusColor = (status) => {
    const statusMap = {
      "Pending Approval": "orange",
      Success: "green",
      Failed: "red",
      "Not Processed": "default",
    };
    return statusMap[status] || "default";
  };

  const getSigningStatusColor = (status) => {
    const statusMap = {
      "Not Processed": "default",
      Success: "green",
    };
    return statusMap[status] || "default";
  };

  // Table columns
  const columns = [
    {
      title: "Invoice #",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      width: 130,
      fixed: "left",
      render: (text) => <span style={{ fontWeight: "600" }}>{text}</span>,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Issue Date",
      dataIndex: "issueDate",
      key: "issueDate",
      width: 120,
      align: "center",
    },
    {
      title: "Amount (IDR)",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      align: "right",
      render: (amount) => (
        <span style={{ fontWeight: "600", color: "#1890ff" }}>
          {new Intl.NumberFormat("id-ID").format(amount)}
        </span>
      ),
    },
    {
      title: "Stamping Status",
      dataIndex: "stampingStatus",
      key: "stampingStatus",
      width: 160,
      fixed: "right",
      align: "center",
      render: (status) => (
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
      ),
    },
    {
      title: "Signing Status",
      dataIndex: "signingStatus",
      key: "signingStatus",
      width: 150,
      fixed: "right",
      align: "center",
      render: (status) => (
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
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
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

  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setPage(1);
    }
  };

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
