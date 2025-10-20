import React, { useState } from "react";
import {
  Spin,
  Input,
  Select,
  Button,
  Table,
  Alert,
  Radio,
  Space,
  Row,
  Col,
  message,
} from "antd";
import { SearchOutlined, WarningOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import { useNavigate } from "react-router-dom";
import BaseContainer from "../../../../components/BaseContainer";

const { Option } = Select;

const CreateInstallmentBillingPage = () => {
  const navigate = useNavigate();
  const loading = false;

  // Form States
  const [customerId, setCustomerId] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [installmentTenor, setInstallmentTenor] = useState("12");

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
    {
      path: "",
      breadcrumbName: "Create New",
    },
  ];

  // Sample customer data - Replace with API call
  const searchCustomer = () => {
    // Simulate API call
    if (customerId) {
      setCustomerData({
        customerId: "CUST-001",
        customerName: "PT. Sejahtera Bersama",
        customerType: "Commercial",
      });
    }
  };

  // Sample invoices data - Replace with API call
  const availableInvoices = [
    {
      id: 1,
      invoiceNumber: "INV/2023/101",
      dueDate: "15-10-2023",
      amount: "Rp 5.000.000",
      amountValue: 5000000,
    },
    {
      id: 2,
      invoiceNumber: "INV/2023/105",
      dueDate: "25-10-2023",
      amount: "Rp 10.000.000",
      amountValue: 10000000,
    },
  ];

  // Check if customer has overdue invoice
  const hasOverdueInvoice = true;
  const overdueInvoiceNumber = "INV/2023/099";

  // Calculate total selected amount
  const totalSelectedAmount = selectedInvoices.reduce((sum, id) => {
    const invoice = availableInvoices.find((inv) => inv.id === id);
    return sum + (invoice?.amountValue || 0);
  }, 0);

  // Generate installment schedule
  const generateInstallmentSchedule = () => {
    if (totalSelectedAmount === 0) return [];

    const tenor = parseInt(installmentTenor);
    const monthlyAmount = Math.floor(totalSelectedAmount / tenor);
    const lastMonthAmount = totalSelectedAmount - monthlyAmount * (tenor - 1);

    const schedule = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() + 1);

    for (let i = 0; i < tenor; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(startDate.getMonth() + i);

      schedule.push({
        key: i + 1,
        installmentNumber: i + 1,
        dueDate: dueDate.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        amount: i === tenor - 1 ? lastMonthAmount : monthlyAmount,
      });
    }

    return schedule;
  };

  const installmentSchedule = generateInstallmentSchedule();

  // Format currency
  const formatCurrency = (value) => {
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  // Handle invoice selection
  const handleInvoiceSelect = (e, invoiceId) => {
    if (e.target.checked) {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    } else {
      setSelectedInvoices(selectedInvoices.filter((id) => id !== invoiceId));
    }
  };

  // Handle submit
  const handleSubmit = () => {
    if (!customerData) {
      message.error("Please search and select a customer first");
      return;
    }
    if (selectedInvoices.length === 0) {
      message.error("Please select at least one invoice");
      return;
    }

    message.success("Installment request submitted successfully");
    // navigate(RBI_ROUTES.MANAGEMENT_BILLING_INSTALLMENT_VIEW);
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(RBI_ROUTES.MANAGEMENT_BILLING_INSTALLMENT_VIEW);
  };

  // Installment schedule columns
  const scheduleColumns = [
    {
      title: "#",
      dataIndex: "installmentNumber",
      key: "installmentNumber",
      width: 60,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => formatCurrency(amount),
    },
  ];

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <BaseContainer
          header={
            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#262626",
              }}
            >
              Create New Installment Request
            </p>
          }
        >
          {/* Customer Information Section */}
          <div
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "8px",
              marginBottom: "24px",
              border: "1px solid #f0f0f0",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  fontSize: "15px",
                  color: "#262626",
                }}
              >
                Customer ID:
              </label>
              <Space.Compact
                style={{ width: "400px", display: "flex", gap: "8px" }}
              >
                <Input
                  placeholder="Enter Customer ID"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  onPressEnter={searchCustomer}
                  size="large"
                />
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={searchCustomer}
                  size="large"
                >
                  Search Customer
                </Button>
              </Space.Compact>
            </div>

            {customerData && (
              <div
                style={{
                  marginTop: "24px",
                  paddingTop: "24px",
                  borderTop: "1px solid #f0f0f0",
                }}
              >
                <Row gutter={[48, 16]}>
                  <Col xs={24} md={12}>
                    <div
                      style={{
                        marginBottom: "6px",
                        color: "#8c8c8c",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      Customer Name:
                    </div>
                    <div
                      style={{
                        fontWeight: "500",
                        fontSize: "16px",
                        color: "#262626",
                      }}
                    >
                      {customerData.customerName}
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div
                      style={{
                        marginBottom: "6px",
                        color: "#8c8c8c",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      Customer Type:
                    </div>
                    <div
                      style={{
                        fontWeight: "500",
                        fontSize: "16px",
                        color: "#262626",
                      }}
                    >
                      {customerData.customerType}
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </div>

          {/* Invoice Selection Section */}
          {customerData && (
            <>
              <div
                style={{
                  background: "#fff",
                  padding: "24px",
                  borderRadius: "8px",
                  marginBottom: "24px",
                  border: "1px solid #f0f0f0",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "20px",
                    color: "#262626",
                  }}
                >
                  Select Invoice to Install:
                </h3>

                <div style={{ marginBottom: "16px" }}>
                  <Row
                    style={{
                      padding: "12px 16px",
                      background: "#fafafa",
                      fontWeight: "600",
                      fontSize: "14px",
                      borderRadius: "4px 4px 0 0",
                      color: "#595959",
                    }}
                  >
                    <Col span={2}>Select</Col>
                    <Col span={8}>Invoice #</Col>
                    <Col span={6}>Due Date</Col>
                    <Col span={8}>Amount</Col>
                  </Row>

                  {availableInvoices.map((invoice) => (
                    <Row
                      key={invoice.id}
                      style={{
                        padding: "16px",
                        borderBottom: "1px solid #f0f0f0",
                        alignItems: "center",
                        background: "#fff",
                        transition: "background 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#fafafa")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "#fff")
                      }
                    >
                      <Col span={2}>
                        <Radio
                          checked={selectedInvoices.includes(invoice.id)}
                          onChange={(e) => handleInvoiceSelect(e, invoice.id)}
                        />
                      </Col>
                      <Col
                        span={8}
                        style={{ fontSize: "15px", fontWeight: "500" }}
                      >
                        {invoice.invoiceNumber}
                      </Col>
                      <Col span={6} style={{ fontSize: "15px" }}>
                        {invoice.dueDate}
                      </Col>
                      <Col
                        span={8}
                        style={{ fontSize: "15px", fontWeight: "500" }}
                      >
                        {invoice.amount}
                      </Col>
                    </Row>
                  ))}
                </div>

                {/* Outstanding Invoice Warning */}
                {hasOverdueInvoice && (
                  <Alert
                    message={
                      <span
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                          fontSize: "14px",
                        }}
                      >
                        <WarningOutlined />
                        <strong>Warning:</strong> Customer has 1 overdue invoice
                        ({overdueInvoiceNumber})
                      </span>
                    }
                    type="error"
                    style={{ marginTop: "16px" }}
                  />
                )}
              </div>

              {/* Installment Configuration */}
              <div
                style={{
                  background: "#fff",
                  padding: "24px",
                  borderRadius: "8px",
                  marginBottom: "24px",
                  border: "1px solid #f0f0f0",
                }}
              >
                <Row gutter={[48, 24]}>
                  <Col xs={24} md={12}>
                    <div
                      style={{
                        marginBottom: "10px",
                        fontWeight: "500",
                        fontSize: "15px",
                        color: "#595959",
                      }}
                    >
                      Total Selected Amount:
                    </div>
                    <div
                      style={{
                        fontSize: "32px",
                        fontWeight: "bold",
                        color: "#1890ff",
                      }}
                    >
                      {formatCurrency(totalSelectedAmount)}
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div
                      style={{
                        marginBottom: "10px",
                        fontWeight: "500",
                        fontSize: "15px",
                        color: "#595959",
                      }}
                    >
                      Installment Tenor:
                    </div>
                    <Select
                      value={installmentTenor}
                      onChange={setInstallmentTenor}
                      style={{ width: "220px" }}
                      size="large"
                    >
                      <Option value="3">3 Months</Option>
                      <Option value="6">6 Months</Option>
                      <Option value="12">12 Months</Option>
                      <Option value="18">18 Months</Option>
                      <Option value="24">24 Months</Option>
                    </Select>
                  </Col>
                </Row>
              </div>

              {/* Installment Schedule Preview */}
              {selectedInvoices.length > 0 && (
                <div
                  style={{
                    background: "#fff",
                    padding: "24px",
                    borderRadius: "8px",
                    marginBottom: "32px",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      marginBottom: "20px",
                      color: "#262626",
                    }}
                  >
                    Installment Schedule Preview:
                  </h3>
                  <Table
                    columns={scheduleColumns}
                    dataSource={installmentSchedule}
                    pagination={false}
                    bordered
                    size="middle"
                    scroll={{ y: 400 }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                  paddingTop: "8px",
                }}
              >
                <Button
                  size="large"
                  onClick={handleCancel}
                  style={{ minWidth: "120px" }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSubmit}
                  disabled={selectedInvoices.length === 0}
                  style={{ minWidth: "180px" }}
                >
                  Submit for Approval
                </Button>
              </div>
            </>
          )}
        </BaseContainer>
      </Spin>
    </LayoutMenu>
  );
};

export default CreateInstallmentBillingPage;
