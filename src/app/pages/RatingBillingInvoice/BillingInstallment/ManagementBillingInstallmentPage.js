import React, { useState } from "react";
import { Spin, Input, Select, Button, Table, Tag, Space, Tooltip } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../components/BreadCrumb";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import BaseContainer from "../../../../components/BaseContainer";

const { Option } = Select;

const ManagementBillingInstallmentPage = () => {
  const loading = false;
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Rating & Billing",
    },
    {
      path: RBI_ROUTES.MANAGEMENT_BILLING_INSTALLMENT_VIEW,
      breadcrumbName: "Management Billing Installment",
    },
  ];

  // Sample data - Ganti dengan data dari Redux/API
  const [installments] = useState([
    {
      id: 1,
      customerId: "CUST-001",
      customerName: "PT. Maju Jaya",
      totalInvoice: "Rp 15.000.000",
      tenor: "12 Bulan",
      status: "Approved",
    },
    {
      id: 2,
      customerId: "CUST-002",
      customerName: "Rumah Tangga A",
      totalInvoice: "Rp 2.500.000",
      tenor: "6 Bulan",
      status: "Pending Approval",
    },
    {
      id: 3,
      customerId: "CUST-003",
      customerName: "CV. Berkah Abadi",
      totalInvoice: "Rp 8.000.000",
      tenor: "8 Bulan",
      status: "Rejected",
    },
  ]);

  // Filter data based on search and status
  const filteredData = installments.filter((item) => {
    const matchesSearch =
      item.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Status tag color
  const getStatusTag = (status) => {
    switch (status) {
      case "Approved":
        return <Tag color="success">{status}</Tag>;
      case "Pending Approval":
        return <Tag color="warning">{status}</Tag>;
      case "Rejected":
        return <Tag color="error">{status}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const handleNewRequest = () => {
    navigate(RBI_ROUTES.MANAGEMENT_BILLING_INSTALLMENT_CREATE);
  };

  // Table columns
  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "CUSTOMER ID",
      dataIndex: "customerId",
      key: "customerId",
      width: 150,
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      key: "customerName",
      width: 200,
    },
    {
      title: "TOTAL INVOICE",
      dataIndex: "totalInvoice",
      key: "totalInvoice",
      width: 180,
    },
    {
      title: "TENOR",
      dataIndex: "tenor",
      key: "tenor",
      width: 120,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 180,
      render: (status) => getStatusTag(status),
    },
    {
      title: "ACTIONS",
      key: "actions",
      align: "center",
      width: 120,
      render: (text, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button type="default" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="View Document">
            <Button type="default" icon={<FileTextOutlined />} size="small" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <BaseContainer
          header={
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              Billing Installment - List
            </h2>
          }
        >
          {/* Search and Filter Section */}
          <div
            style={{
              marginBottom: "24px",
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Input
              placeholder="Search by Customer ID/Name..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />

            <Space size="middle">
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 200 }}
              >
                <Option value="All">Filter by Status: All</Option>
                <Option value="Approved">Approved</Option>
                <Option value="Pending Approval">Pending Approval</Option>
                <Option value="Rejected">Rejected</Option>
              </Select>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleNewRequest}
              >
                New Installment Request
              </Button>
            </Space>
          </div>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: filteredData.length,
              onChange: (page) => setCurrentPage(page),
              showSizeChanger: false,
              showTotal: (total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} entries`,
            }}
            bordered
            size="middle"
            scroll={{ x: 1000 }}
          />
        </BaseContainer>
      </Spin>
    </div>
  );
};

export default ManagementBillingInstallmentPage;
