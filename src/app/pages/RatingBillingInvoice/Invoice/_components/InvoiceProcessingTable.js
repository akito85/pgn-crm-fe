// components/InvoiceProcessingTable.js (FIXED PAGINATION)
import { useState, useMemo } from "react";
import {
  Table,
  Button,
  DatePicker,
  Select,
  Tag,
  Pagination,
  Card,
  Row,
  Col,
  Dropdown,
  Menu,
} from "antd";
import dayjs from "dayjs";
import {
  EllipsisOutlined,
  EditOutlined,
  RedoOutlined,
  EyeOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import ColumnFixDropdown from "../../../../../components/ColumnFixDropdown/ColumnFixDropdown";
import StatusComponent from "../../../../../components/StatusComponent";

const { RangePicker } = DatePicker;
const { Option } = Select;

const InvoiceProcessingTable = ({
  dataSource = [],
  loading = false,
  pagination = {},
  onDetails = () => {},
  onProcessSigning = () => {},
  onRetry = () => {},
  onProcessStamping = () => {},
  onFilterChange = () => {},
}) => {
  const [dateRange, setDateRange] = useState([
    dayjs("2025-10-01"),
    dayjs("2025-10-31"),
  ]);
  const [stampingStatusFilter, setStampingStatusFilter] = useState("all");
  const [signingStatusFilter, setSigningStatusFilter] = useState("all");

  // ✅ Simplified: Only store fixed columns configuration
  const [fixedColumns, setFixedColumns] = useState({
    invoiceNumber: "left",
  });

  // Available columns definition (in order)
  const allColumnDefinitions = [
    {
      key: "invoiceNumber",
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      width: 180,
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
      render: (index) => {
        const text = index
          ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
          : index;
        return text ? (
          <div className={" flex justify-center"}>
            <StatusComponent colour={index}>{text}</StatusComponent>
          </div>
        ) : (
          text
        );
      },
    },
    {
      key: "signingStatus",
      title: "Signing Status",
      dataIndex: "signingStatus",
      width: 150,
      align: "center",
      render: (index) => {
        const text = index
          ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
          : index;
        return text ? (
          <div className={" flex justify-center"}>
            <StatusComponent colour={index}>{text}</StatusComponent>
          </div>
        ) : (
          text
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
            disabled: record.stampStatus === "SUCCESS",
            onClick: () => onProcessStamping(record),
          },
          {
            key: "process-signing",
            label: "Process Signing",
            icon: <EditOutlined />,
            disabled:
              record.stampStatus === null ||
              record.stampStatus === "FAILED" ||
              record.signStatus === "SUCCESS",
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

  // ✅ Simplified: Use utility function to apply fixed columns
  const columns = useMemo(() => {
    return applyFixedColumns(allColumnDefinitions, fixedColumns);
  }, [fixedColumns]);

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

  // Handle filter changes
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates && dates.length === 2) {
      onFilterChange({
        dateRange: dates,
        stampStatus: stampingStatusFilter,
        signStatus: signingStatusFilter,
      });
    }
  };

  const handleStampingStatusChange = (value) => {
    setStampingStatusFilter(value);
    onFilterChange({
      dateRange: dateRange,
      stampStatus: value,
      signStatus: signingStatusFilter,
    });
  };

  const handleSigningStatusChange = (value) => {
    setSigningStatusFilter(value);
    onFilterChange({
      dateRange: dateRange,
      stampStatus: stampingStatusFilter,
      signStatus: value,
    });
  };

  // Get pagination values from parent
  const currentPage = pagination.current || 1;
  const currentPageSize = pagination.pageSize || 20;
  const totalRecords = pagination.total || 0;

  // Calculate display text
  const startRecord =
    totalRecords > 0 ? (currentPage - 1) * currentPageSize + 1 : 0;
  const endRecord = Math.min(currentPage * currentPageSize, totalRecords);

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
          Invoice Processing Status ({totalRecords} total)
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
              onChange={handleDateRangeChange}
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
              onChange={handleStampingStatusChange}
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
              onChange={handleSigningStatusChange}
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

            <ColumnFixDropdown
              columns={allColumnDefinitions}
              fixedColumns={fixedColumns}
              onFixedColumnsChange={setFixedColumns}
              buttonText="Fix Columns"
              showCount={true}
            />
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
              value={currentPageSize}
              onChange={(value) => pagination.onChange(1, value)}
              style={{ width: 80 }}
            >
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
            <span style={{ fontSize: "14px", color: "#595959" }}>
              Showing {startRecord} to {endRecord} of {totalRecords} entries
            </span>
          </div>

          <Pagination
            current={currentPage}
            pageSize={currentPageSize}
            total={totalRecords}
            onChange={pagination.onChange}
            showSizeChanger={false}
            showTotal={false}
            className="[&_.ant-pagination-item]:mx-2 [&_.ant-pagination-prev]:mx-2 [&_.ant-pagination-next]:mx-2"
          />
        </div>
      </Card>
    </div>
  );
};

export default InvoiceProcessingTable;
