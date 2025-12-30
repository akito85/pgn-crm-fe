// components/ManagementDeliveryInvoice/DetailInvoiceModal.js
import React, { useState } from "react";
import {
  Modal,
  Button,
  Card,
  Row,
  Col,
  Divider,
  Space,
  message,
  Spin,
} from "antd";
import { FileTextOutlined, LoadingOutlined } from "@ant-design/icons";
import LogDetailModal from "./ManagementDeliveryComponent/LogDetailModal";
import StatusComponent from "../../../../../components/StatusComponent";

// Channel Icon Helper
const getChannelIcon = (channel) => {
  const channelLower = channel?.toLowerCase() || "";
  if (channelLower.includes("email")) return "📧";
  if (channelLower.includes("whatsapp") || channelLower.includes("wa"))
    return "📱";
  if (channelLower.includes("sms")) return "💬";
  return "📮";
};

const DetailInvoiceModal = ({ visible, onCancel, invoiceData }) => {
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!invoiceData) return null;

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "Rp 0";
    return `Rp ${Number(amount).toLocaleString("id-ID")}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format datetime
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if status is failed
  const isFailedStatus = (status) => {
    const statusLower = status?.toLowerCase() || "";
    return statusLower.includes("failed") || statusLower.includes("gagal");
  };

  const handleViewLog = (delivery) => {
    setSelectedLog(delivery);
    setLogModalVisible(true);
  };

  const handleResend = (delivery) => {
    Modal.confirm({
      title: "Konfirmasi Kirim Ulang",
      content: `Apakah Anda yakin ingin mengirim ulang invoice ke ${
        delivery.recipientAddress || delivery.contactInfo
      } via ${delivery.deliveryChannel}?`,
      okText: "Ya, Kirim Ulang",
      cancelText: "Batal",
      onOk() {
        setLoading(true);
        // TODO: Implement actual resend API call
        setTimeout(() => {
          message.success("Invoice berhasil dikirim ulang!");
          setLoading(false);
          // Refresh data here if needed
        }, 1000);
      },
    });
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: "18px", fontWeight: "600", color: "#262626" }}>
          <FileTextOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
          Detail Invoice: {invoiceData.invoiceNumber || invoiceData.invoiceNo}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={[
        <Button key="close" type="primary" size="large" onClick={onCancel}>
          Close
        </Button>,
      ]}
      closable={false}
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
    >
      <Spin spinning={loading} indicator={<LoadingOutlined spin />}>
        {/* Invoice Information */}
        <Card
          style={{
            marginBottom: "16px",
            backgroundColor: "#f9fafb",
            border: "1px solid #e5e7eb",
            padding: "16px",
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#8c8c8c",
                    marginBottom: "4px",
                  }}
                >
                  Customer
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#262626",
                  }}
                >
                  {invoiceData.accountName || invoiceData.customer || "-"}
                </div>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#8c8c8c",
                    marginBottom: "4px",
                  }}
                >
                  Total Amount
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#1890ff",
                  }}
                >
                  {formatCurrency(
                    invoiceData.totalAmount || invoiceData.amount
                  )}
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#8c8c8c",
                    marginBottom: "4px",
                  }}
                >
                  Invoice Date
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#262626",
                  }}
                >
                  📅{" "}
                  {formatDate(
                    invoiceData.invoiceDate || invoiceData.createdDate
                  )}
                </div>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#8c8c8c",
                    marginBottom: "4px",
                  }}
                >
                  Due Date
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#262626",
                  }}
                >
                  📅 {formatDate(invoiceData.dueDate)}
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Delivery History */}
        <Divider
          orientation="left"
          style={{ fontWeight: "600", fontSize: "15px" }}
        >
          📨 Delivery History
        </Divider>

        <div style={{ marginTop: "16px" }}>
          {/* Single delivery info from list data */}
          <Card
            style={{
              marginBottom: "12px",
              border: "1px solid #e5e7eb",
              borderLeft: `4px solid ${
                isFailedStatus(invoiceData.deliveryStatus)
                  ? "#ff4d4f"
                  : "#52c41a"
              }`,
              padding: "16px",
            }}
            bodyStyle={{ padding: "16px" }}
          >
            <Row gutter={16} align="middle">
              <Col span={2}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1890ff",
                    textAlign: "center",
                  }}
                >
                  #{invoiceData.id || "001"}
                </div>
              </Col>
              <Col span={4}>
                <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                  Channel
                </div>
                <div style={{ fontWeight: "500", marginTop: "2px" }}>
                  {getChannelIcon(invoiceData.deliveryChannel)}{" "}
                  {invoiceData.deliveryChannel || "-"}
                </div>
              </Col>
              <Col span={6}>
                <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                  Recipient
                </div>
                <div
                  style={{
                    fontWeight: "500",
                    marginTop: "2px",
                    fontSize: "13px",
                  }}
                >
                  {invoiceData.recipientAddress || "-"}
                </div>
              </Col>
              <Col span={4}>
                <div style={{ fontSize: "12px", color: "#8c8c8c" }}>Status</div>
                <div style={{ marginTop: "2px" }}>
                  <StatusComponent colour={invoiceData.deliveryStatus}>
                    {invoiceData.deliveryStatus}
                  </StatusComponent>
                </div>
              </Col>
              <Col span={5}>
                <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                  Sent Time
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#595959",
                    marginTop: "2px",
                  }}
                >
                  🕐{" "}
                  {formatDateTime(
                    invoiceData.sentDate || invoiceData.deliveryDate
                  )}
                </div>
              </Col>
              <Col span={3}>
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Button
                    size="small"
                    onClick={() => handleViewLog(invoiceData)}
                    style={{ width: "100%", fontSize: "12px" }}
                    disabled
                  >
                    View Log
                  </Button>

                  {isFailedStatus(invoiceData.deliveryStatus) && (
                    <Button
                      type="primary"
                      danger
                      size="small"
                      onClick={() => handleResend(invoiceData)}
                      style={{ width: "100%", fontSize: "12px" }}
                    >
                      Resend
                    </Button>
                  )}
                </Space>
              </Col>
            </Row>

            {/* Error Note - Only shown for failed deliveries */}
            {isFailedStatus(invoiceData.deliveryStatus) &&
              invoiceData.errorMessage && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "8px 12px",
                    backgroundColor: "#fff7e6",
                    border: "1px solid #ffd591",
                    borderRadius: "4px",
                    fontSize: "12px",
                    color: "#ad6800",
                  }}
                >
                  <strong>Error:</strong> {invoiceData.errorMessage}
                </div>
              )}

            {/* Additional Notes */}
            {invoiceData.notes && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "8px 12px",
                  backgroundColor: "#e6f7ff",
                  border: "1px solid #91d5ff",
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: "#0050b3",
                }}
              >
                <strong>Note:</strong> {invoiceData.notes}
              </div>
            )}
          </Card>
        </div>

        {/* Log Detail Modal - Nested Modal */}
        <LogDetailModal
          visible={logModalVisible}
          onCancel={() => {
            setLogModalVisible(false);
            setSelectedLog(null);
          }}
          logData={selectedLog}
        />
      </Spin>
    </Modal>
  );
};

export default DetailInvoiceModal;
