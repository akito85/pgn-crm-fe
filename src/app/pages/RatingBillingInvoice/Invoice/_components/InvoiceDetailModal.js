// _components/InvoiceDetailModal.js
import React, { useState, useMemo, useEffect } from "react";
import { Modal, Button, Divider, Tag, Space, Table, Spin } from "antd";
import {
  CloseOutlined,
  DownloadOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  getInvoiceActivityLogs,
  resetLogData,
  downloadOriginalInvoice,
  downloadStampedInvoice,
  downloadSignedInvoice,
} from "../../../../../redux/slices/rating_billing_invoice/emeterai";
import moment from "moment";

const InvoiceDetailModal = ({ visible, onClose, invoiceData }) => {
  const dispatch = useDispatch();
  const [currentView, setCurrentView] = useState("details"); // 'details' or 'logs'
  const [downloadingDoc, setDownloadingDoc] = useState(null); // Track which document is downloading

  // Redux state for logs and downloads
  const { logData, logLoading, logPageInfo, downloadLoading } = useSelector(
    (state) => state.emeterai
  );

  // Safe invoice data with proper fallback using useMemo
  const invoice = useMemo(() => {
    if (!invoiceData) {
      return {
        invoiceNumber: "-",
        customer: "-",
        issueDate: "-",
        dueDate: "-",
        amount: 0,
        stamping: {
          status: "Not Processed",
          method: "",
          requested: "",
        },
        signing: {
          status: "Not Processed",
        },
        approval: {
          status: "",
          by: "",
          date: "",
          reason: "",
        },
        documents: [],
      };
    }

    return {
      invoiceNumber: invoiceData.invoiceNumber || "-",
      customer: invoiceData.customer || invoiceData.customerName || "-",
      issueDate: invoiceData.issueDate || invoiceData.billingPeriod || "-",
      dueDate: invoiceData.dueDate || "-",
      amount: invoiceData.amount || invoiceData.totalAmountEqvIdr || 0,
      stamping: {
        status:
          invoiceData.stampingStatus ||
          invoiceData.stamping?.status ||
          "Not Processed",
        method: invoiceData.stampType || invoiceData.stamping?.method || "",
        requested:
          invoiceData.stampRequestDate || invoiceData.stamping?.requested || "",
        completed:
          invoiceData.stampCompletionDate ||
          invoiceData.stamping?.completed ||
          "",
        remark: invoiceData.stampRemark || invoiceData.stamping?.remark || "",
      },
      signing: {
        status:
          invoiceData.signingStatus ||
          invoiceData.signing?.status ||
          "Not Processed",
        requested:
          invoiceData.signRequestDate || invoiceData.signing?.requested || "",
        completed:
          invoiceData.signCompletionDate ||
          invoiceData.signing?.completed ||
          "",
        remark: invoiceData.signRemark || invoiceData.signing?.remark || "",
      },
      approval: invoiceData.approval || {
        status: "",
        by: "",
        date: "",
        reason: "",
      },
      documents: [
        {
          type: "original",
          name: "Original Invoice",
          disabled: false,
        },
        {
          type: "stamped",
          name: "Stamped Document",
          disabled: !invoiceData.stampCompletionDate,
        },
        {
          type: "signed",
          name: "Final Document",
          disabled: !invoiceData.signCompletionDate,
        },
      ],
    };
  }, [invoiceData]);

  // Fetch logs when switching to log view
  useEffect(() => {
    if (
      currentView === "logs" &&
      invoice.invoiceNumber &&
      invoice.invoiceNumber !== "-"
    ) {
      console.log("🔄 Fetching activity logs for:", invoice.invoiceNumber);
      dispatch(
        getInvoiceActivityLogs({
          invoiceNumber: invoice.invoiceNumber,
          page: 0,
          pageSize: 100, // Get all logs
        })
      );
    }
  }, [currentView, invoice.invoiceNumber, dispatch]);

  // Clean up logs when modal closes
  useEffect(() => {
    if (!visible) {
      dispatch(resetLogData());
      setCurrentView("details");
      setDownloadingDoc(null);
    }
  }, [visible, dispatch]);

  // Reset downloading state when download completes
  useEffect(() => {
    if (!downloadLoading && downloadingDoc) {
      setDownloadingDoc(null);
    }
  }, [downloadLoading, downloadingDoc]);

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

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return moment(dateString).format("DD MMM YYYY HH:mm:ss");
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

  // Handle document download
  const handleDownloadDocument = async (docType) => {
    if (!invoice.invoiceNumber || invoice.invoiceNumber === "-") {
      console.error("❌ Invalid invoice number");
      return;
    }

    setDownloadingDoc(docType);

    try {
      console.log(
        `📥 Downloading ${docType} document for:`,
        invoice.invoiceNumber
      );

      switch (docType) {
        case "original":
          await dispatch(
            downloadOriginalInvoice({ invoiceNumber: invoice.invoiceNumber })
          ).unwrap();
          break;
        case "stamped":
          await dispatch(
            downloadStampedInvoice({ invoiceNumber: invoice.invoiceNumber })
          ).unwrap();
          break;
        case "signed":
          await dispatch(
            downloadSignedInvoice({ invoiceNumber: invoice.invoiceNumber })
          ).unwrap();
          break;
        default:
          console.error("❌ Unknown document type:", docType);
      }

      console.log(`✅ ${docType} document downloaded successfully`);
    } catch (error) {
      console.error(`❌ Error downloading ${docType} document:`, error);
      // Error message already handled in slice
    } finally {
      setDownloadingDoc(null);
    }
  };

  // Activity Log Columns
  const logColumns = [
    {
      title: "Timestamp",
      dataIndex: "createdDtm",
      key: "createdDtm",
      width: 200,
      render: (text) => (
        <span style={{ fontSize: "13px", color: "#262626" }}>
          {formatDateTime(text)}
        </span>
      ),
    },
    {
      title: "User",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 180,
      render: (text) => (
        <span style={{ fontSize: "13px", fontWeight: "500", color: "#262626" }}>
          {text || "-"}
        </span>
      ),
    },
    {
      title: "Activity",
      dataIndex: "activity",
      key: "activity",
      render: (text, record) => (
        <div>
          <div
            style={{ fontSize: "13px", color: "#595959", marginBottom: "4px" }}
          >
            {text}
          </div>
        </div>
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
                Billing Period:
              </span>
              <span style={{ fontWeight: "500", fontSize: "14px" }}>
                {invoice.issueDate}
              </span>
            </div>
            {invoice.dueDate && invoice.dueDate !== "-" && (
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
            )}
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
                <div style={{ marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
                    Requested:{" "}
                  </span>
                  <span style={{ fontSize: "13px" }}>
                    {invoice.stamping.requested}
                  </span>
                </div>
              )}
              {invoice.stamping.completed && (
                <div style={{ marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
                    Completed:{" "}
                  </span>
                  <span style={{ fontSize: "13px" }}>
                    {invoice.stamping.completed}
                  </span>
                </div>
              )}
              {invoice.stamping.remark && (
                <div>
                  <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
                    Remark:{" "}
                  </span>
                  <span style={{ fontSize: "13px" }}>
                    {invoice.stamping.remark}
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
              <div style={{ marginBottom: "6px" }}>
                <Tag color={getStatusColor(invoice.signing.status)}>
                  {invoice.signing.status}
                </Tag>
              </div>
              {invoice.signing.requested && (
                <div style={{ marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
                    Requested:{" "}
                  </span>
                  <span style={{ fontSize: "13px" }}>
                    {invoice.signing.requested}
                  </span>
                </div>
              )}
              {invoice.signing.completed && (
                <div style={{ marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
                    Completed:{" "}
                  </span>
                  <span style={{ fontSize: "13px" }}>
                    {invoice.signing.completed}
                  </span>
                </div>
              )}
              {invoice.signing.remark && (
                <div>
                  <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
                    Remark:{" "}
                  </span>
                  <span style={{ fontSize: "13px" }}>
                    {invoice.signing.remark}
                  </span>
                </div>
              )}
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
        {invoice.documents && invoice.documents.length > 0 ? (
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
                loading={downloadingDoc === doc.type}
                onClick={() => handleDownloadDocument(doc.type)}
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
                {downloadingDoc === doc.type
                  ? "Downloading..."
                  : `Download ${doc.name}`}
                {doc.disabled && (
                  <span style={{ marginLeft: "8px", color: "#bfbfbf" }}>
                    (Not Available)
                  </span>
                )}
              </Button>
            ))}
          </Space>
        ) : (
          <div
            style={{ padding: "20px", textAlign: "center", color: "#8c8c8c" }}
          >
            No documents available
          </div>
        )}
      </div>
    </>
  );

  // Render Activity Log View
  const renderLogView = () => {
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
        <Spin spinning={logLoading}>
          <Table
            dataSource={logData}
            columns={logColumns}
            pagination={false}
            rowKey={(record) => record.id}
            bordered
            size="middle"
            style={{
              background: "#ffffff",
            }}
            locale={{
              emptyText: logLoading
                ? "Loading..."
                : "No activity logs available",
            }}
          />
        </Spin>
        {logData.length > 0 && (
          <div
            style={{
              marginTop: "12px",
              textAlign: "right",
              color: "#8c8c8c",
              fontSize: "12px",
            }}
          >
            Total {logPageInfo.totalElements} log
            {logPageInfo.totalElements !== 1 ? "s" : ""}
          </div>
        )}
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
      destroyOnClose
    >
      {!invoiceData ? (
        // Loading state when no invoice data
        <div style={{ padding: "40px", textAlign: "center" }}>
          <p>Loading invoice details...</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "2px solid #e8e8e8",
              background: "#fafafa",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
              {currentView === "details"
                ? "Invoice Details"
                : "Activity History"}
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
              justifyContent:
                currentView === "logs" ? "space-between" : "flex-end",
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
        </>
      )}
    </Modal>
  );
};

export default InvoiceDetailModal;
