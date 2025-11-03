// _components/InvoiceDetailModal.js
import { useState } from "react";
import { Modal, Button, Divider, Tag, Space, Table } from "antd";
import {
  CloseOutlined,
  DownloadOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const InvoiceDetailModal = ({ visible, onClose, invoiceData }) => {
  const [currentView, setCurrentView] = useState("details"); // 'details' or 'logs'

  const defaultInvoice = {
    invoiceNumber: "INV/X/001",
    customer: "PT. Gas Nusantara",
    issueDate: "2025-10-01",
    dueDate: "2025-10-31",
    amount: "IDR 150,000,000",
    stamping: {
      status: "REJECTED",
      method: "E-Stamping",
      requested: "2025-10-01 14:30",
    },
    signing: {
      status: "Not Processed",
    },
    approval: {
      status: "Rejected",
      by: "manager.finance",
      date: "2025-10-01 16:00",
      reason: "Total amount is incorrect, please revise.",
    },
    documents: [
      { name: "Original Invoice", disabled: false },
      { name: "Stamped Document", disabled: true },
      { name: "Final Document", disabled: true },
    ],
  };

  const defaultLogs = [
    {
      timestamp: "2025-10-01 16:30:45",
      user: "system_digital_sign",
      activity: "Digital signing process completed successfully.",
    },
    {
      timestamp: "2025-10-01 16:15:20",
      user: "director.operations",
      activity: "Initiated digital signing request.",
    },
    {
      timestamp: "2025-10-01 15:10:05",
      user: "system_pjap",
      activity: "PJAP Sync: E-Stamping completed successfully.",
    },
    {
      timestamp: "2025-10-01 14:45:20",
      user: "manager.finance",
      activity: "E-Stamping request was approved.",
    },
    {
      timestamp: "2025-10-01 14:30:15",
      user: "staff.billing",
      activity: "Submitted E-Stamping request.",
    },
    {
      timestamp: "2025-10-01 13:45:30",
      user: "staff.billing",
      activity:
        "Invoice details updated - Amount changed from IDR 145,000,000 to IDR 150,000,000.",
    },
    {
      timestamp: "2025-10-01 13:30:10",
      user: "supervisor.billing",
      activity: "Invoice reviewed and verified.",
    },
    {
      timestamp: "2025-10-01 13:00:00",
      user: "system",
      activity: "Invoice was created successfully.",
    },
  ];

  const invoice = invoiceData || defaultInvoice;

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("rejected") || statusLower.includes("failed"))
      return "red";
    if (statusLower.includes("approved") || statusLower.includes("success"))
      return "green";
    if (statusLower.includes("pending")) return "orange";
    return "default";
  };

  const formatAmount = (amount) => {
    if (typeof amount === "number") {
      return `IDR ${new Intl.NumberFormat("id-ID").format(amount)}`;
    }
    return amount;
  };

  const handleViewLog = () => {
    setCurrentView("logs");
  };

  const handleBackToDetails = () => {
    setCurrentView("details");
  };

  const handleClose = () => {
    setCurrentView("details");
    onClose();
  };

  // Activity Log Columns
  const logColumns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 200,
      render: (text) => (
        <span style={{ fontSize: "13px", color: "#262626" }}>{text}</span>
      ),
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      width: 180,
      render: (text) => (
        <span style={{ fontSize: "13px", fontWeight: "500", color: "#262626" }}>
          {text}
        </span>
      ),
    },
    {
      title: "Activity",
      dataIndex: "activity",
      key: "activity",
      render: (text) => (
        <span style={{ fontSize: "13px", color: "#595959" }}>{text}</span>
      ),
    },
  ];

  // Render Details View
  const renderDetailsView = () => (
    <>
      {/* General Information & Processing Status */}
      <div style={{ display: "flex", gap: "40px", marginBottom: "24px" }}>
        {/* General Information */}
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "16px",
              color: "#262626",
            }}
          >
            General Information
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div style={{ display: "flex" }}>
              <span
                style={{
                  width: "120px",
                  color: "#8c8c8c",
                  fontSize: "14px",
                }}
              >
                Invoice #:
              </span>
              <span style={{ fontWeight: "500", fontSize: "14px" }}>
                {invoice.invoiceNumber}
              </span>
            </div>
            <div style={{ display: "flex" }}>
              <span
                style={{
                  width: "120px",
                  color: "#8c8c8c",
                  fontSize: "14px",
                }}
              >
                Customer:
              </span>
              <span style={{ fontWeight: "500", fontSize: "14px" }}>
                {invoice.customer}
              </span>
            </div>
            <div style={{ display: "flex" }}>
              <span
                style={{
                  width: "120px",
                  color: "#8c8c8c",
                  fontSize: "14px",
                }}
              >
                Issue Date:
              </span>
              <span style={{ fontWeight: "500", fontSize: "14px" }}>
                {invoice.issueDate}
              </span>
            </div>
            <div style={{ display: "flex" }}>
              <span
                style={{
                  width: "120px",
                  color: "#8c8c8c",
                  fontSize: "14px",
                }}
              >
                Due Date:
              </span>
              <span style={{ fontWeight: "500", fontSize: "14px" }}>
                {invoice.dueDate}
              </span>
            </div>
            <div style={{ display: "flex" }}>
              <span
                style={{
                  width: "120px",
                  color: "#8c8c8c",
                  fontSize: "14px",
                }}
              >
                Amount:
              </span>
              <span
                style={{
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#0175BF",
                }}
              >
                {formatAmount(invoice.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Processing Status */}
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "16px",
              color: "#262626",
            }}
          >
            Processing Status
          </h3>

          {/* Stamping Status */}
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#595959",
              }}
            >
              Stamping Status:
            </div>
            <div style={{ paddingLeft: "12px" }}>
              <div style={{ marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
                  Status:{" "}
                </span>
                <Tag color={getStatusColor(invoice.stamping.status)}>
                  {invoice.stamping.status}
                </Tag>
              </div>
              {invoice.stamping.method && (
                <div style={{ marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
                    Method:{" "}
                  </span>
                  <span style={{ fontSize: "13px" }}>
                    {invoice.stamping.method}
                  </span>
                </div>
              )}
              {invoice.stamping.requested && (
                <div>
                  <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
                    Requested:{" "}
                  </span>
                  <span style={{ fontSize: "13px" }}>
                    {invoice.stamping.requested}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Signing Status */}
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#595959",
              }}
            >
              Signing Status:
            </div>
            <div style={{ paddingLeft: "12px" }}>
              <Tag color={getStatusColor(invoice.signing.status)}>
                {invoice.signing.status}
              </Tag>
            </div>
          </div>
        </div>
      </div>

      <Divider style={{ margin: "24px 0" }} />

      {/* Approval Status */}
      {invoice.approval && invoice.approval.status && (
        <>
          <div style={{ marginBottom: "24px" }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "16px",
                color: "#262626",
              }}
            >
              Approval Status
            </h3>
            <div
              style={{
                background:
                  invoice.approval.status === "Rejected"
                    ? "#fff1f0"
                    : "#f6ffed",
                border: `1px solid ${
                  invoice.approval.status === "Rejected" ? "#ffccc7" : "#b7eb8f"
                }`,
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <div style={{ display: "flex", gap: "40px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: "12px" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#8c8c8c",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Status:
                    </span>
                    <Tag color={getStatusColor(invoice.approval.status)}>
                      {invoice.approval.status}
                    </Tag>
                    {invoice.approval.by && (
                      <span style={{ fontSize: "13px", marginLeft: "8px" }}>
                        by {invoice.approval.by}
                      </span>
                    )}
                  </div>
                  {invoice.approval.date && (
                    <div>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#8c8c8c",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        Date:
                      </span>
                      <span style={{ fontSize: "13px" }}>
                        {invoice.approval.date}
                      </span>
                    </div>
                  )}
                </div>
                {invoice.approval.reason && (
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#8c8c8c",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Rejection Reason:
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#cf1322",
                        fontWeight: "500",
                      }}
                    >
                      {invoice.approval.reason}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Divider style={{ margin: "24px 0" }} />
        </>
      )}

      {/* Documents */}
      <div>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            marginBottom: "16px",
            color: "#262626",
          }}
        >
          Documents
        </h3>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {invoice.documents.map((doc, index) => (
            <Button
              key={index}
              icon={
                <DownloadOutlined
                  style={{
                    fontSize: "18px",
                    color: doc.disabled ? "#bfbfbf" : "#0175BF",
                  }}
                />
              }
              disabled={doc.disabled}
              size="large"
              block
              style={{
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingLeft: "20px",
                textAlign: "left",
                fontSize: "14px",
                fontWeight: doc.disabled ? "normal" : "500",
                border: "1px solid #d9d9d9",
                borderRadius: "8px",
              }}
            >
              Download {doc.name}
              {doc.disabled && (
                <span style={{ marginLeft: "8px", color: "#bfbfbf" }}>
                  (Not Available)
                </span>
              )}
            </Button>
          ))}
        </Space>
      </div>
    </>
  );

  // Render Activity Log View
  const renderLogView = () => {
    const logs = defaultLogs || [];

    return (
      <div>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            marginBottom: "16px",
            color: "#262626",
          }}
        >
          Activity History - Invoice {invoice.invoiceNumber}
        </h3>
        <Table
          dataSource={logs}
          columns={logColumns}
          pagination={false}
          rowKey={(record, index) => index}
          bordered
          size="middle"
          style={{
            background: "#ffffff",
          }}
          locale={{
            emptyText: "No activity logs available",
          }}
        />
      </div>
    );
  };

  return (
    <Modal
      visible={visible}
      onCancel={handleClose}
      width={900}
      footer={null}
      closeIcon={<CloseOutlined />}
      bodyStyle={{ padding: 0 }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "2px solid #e8e8e8",
          background: "#fafafa",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
          {currentView === "details" ? "Invoice Details" : "Activity History"}
        </h2>
      </div>

      {/* Content */}
      <div style={{ padding: "24px" }}>
        {currentView === "details" ? renderDetailsView() : renderLogView()}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "16px 24px",
          borderTop: "1px solid #e8e8e8",
          background: "#fafafa",
          display: "flex",
          justifyContent: currentView === "logs" ? "space-between" : "flex-end",
          gap: "12px",
        }}
      >
        {currentView === "logs" && (
          <Button
            onClick={handleBackToDetails}
            size="large"
            icon={<ArrowLeftOutlined />}
          >
            Back to Details
          </Button>
        )}

        <div style={{ display: "flex", gap: "12px" }}>
          {currentView === "details" && (
            <>
              <Button onClick={handleClose} size="large">
                Close
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<FileTextOutlined />}
                onClick={handleViewLog}
              >
                View Log
              </Button>
            </>
          )}
          {currentView === "logs" && (
            <Button onClick={handleClose} size="large" type="primary">
              Close
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceDetailModal;
