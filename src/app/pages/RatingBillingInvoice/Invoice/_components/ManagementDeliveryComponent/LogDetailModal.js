// components/ManagementDeliveryInvoice/LogDetailModal.js
import React from "react";
import { Modal, Button, Card, Row, Col, Divider, Table, Tag } from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const LogDetailModal = ({ visible, onCancel, logData }) => {
  if (!logData) return null;

  // Mock log detail data - Replace with actual API data
  const detailData = {
    deliveryId: "790",
    invoiceNo: "INV-002",
    sentTime: "01/10/2025 10:11:05",
    channel: "WhatsApp",
    recipient: "+628123456789",
    status: "Gagal",
    templateId: "TPL-WA-002",
    gatewayTransactionId: "null",
  };

  const logHistory = [
    {
      logId: "112233",
      error: "invalid_recipient",
      message: "Nomor telepon tidak terdaftar di WhatsApp.",
      action: true,
    },
    {
      logId: "112230",
      error: "begin_whatsapp_send",
      message: "Mengirimkan pesan ke WA GW.",
      action: true,
    },
  ];

  const columns = [
    {
      title: "Log ID",
      dataIndex: "logId",
      key: "logId",
      width: 100,
      render: (text) => (
        <span
          style={{
            fontWeight: "600",
            color: "#1890ff",
            fontFamily: "monospace",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Error",
      dataIndex: "error",
      key: "error",
      width: 200,
      render: (text) => (
        <Tag
          color={text.includes("invalid") ? "error" : "default"}
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            padding: "2px 8px",
          }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
      render: (text) => (
        <span style={{ fontSize: "13px", color: "#262626" }}>{text}</span>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      width: 200,
      align: "center",
      render: (_, record) =>
        record.action && (
          <Button size="small" style={{ fontSize: "12px" }}>
            View Request/Response
          </Button>
        ),
    },
  ];

  const getStatusConfig = (status) => {
    if (status === "Gagal") {
      return {
        color: "#ff4d4f",
        icon: <CloseCircleOutlined />,
        bgColor: "#fff1f0",
      };
    }
    return {
      color: "#52c41a",
      icon: <CheckCircleOutlined />,
      bgColor: "#f6ffed",
    };
  };

  const statusConfig = getStatusConfig(detailData.status);

  return (
    <Modal
      title={
        <div style={{ fontSize: "18px", fontWeight: "600", color: "#262626" }}>
          <FileTextOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
          Log Detail Pengiriman #{detailData.deliveryId}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={[
        <Button key="close" type="primary" size="large" onClick={onCancel}>
          Tutup
        </Button>,
      ]}
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
      zIndex={1001}
    >
      {/* Delivery Information */}
      <Card
        style={{
          marginBottom: "16px",
          backgroundColor: "#f9fafb",
          border: "1px solid #e5e7eb",
          padding: "16px",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#8c8c8c",
                  marginBottom: "4px",
                }}
              >
                ID Pengiriman
              </div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#1890ff",
                }}
              >
                #{detailData.deliveryId}
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
                No. Invoice
              </div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#262626",
                }}
              >
                {detailData.invoiceNo}
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#8c8c8c",
                  marginBottom: "4px",
                }}
              >
                Waktu Kirim
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#262626",
                }}
              >
                🕐 {detailData.sentTime}
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
                Kanal
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#262626",
                }}
              >
                📱 {detailData.channel}
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#8c8c8c",
                  marginBottom: "4px",
                }}
              >
                Penerima
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#262626",
                }}
              >
                {detailData.recipient}
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
                Status
              </div>
              <Tag
                color={statusConfig.color}
                icon={statusConfig.icon}
                style={{
                  fontWeight: "600",
                  padding: "4px 12px",
                  fontSize: "13px",
                }}
              >
                {detailData.status}
              </Tag>
            </div>
          </Col>
        </Row>

        <Divider style={{ margin: "12px 0" }} />

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div style={{ marginBottom: "8px" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#8c8c8c",
                  marginBottom: "4px",
                }}
              >
                Template ID
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#262626",
                  fontFamily: "monospace",
                }}
              >
                {detailData.templateId}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: "8px" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#8c8c8c",
                  marginBottom: "4px",
                }}
              >
                ID Transaksi Gateway
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#8c8c8c",
                  fontFamily: "monospace",
                  fontStyle: "italic",
                }}
              >
                {detailData.gatewayTransactionId}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Log History Table */}
      <Divider
        orientation="left"
        style={{ fontWeight: "600", fontSize: "15px" }}
      >
        📋 Riwayat Log
      </Divider>

      <div style={{ marginTop: "16px" }}>
        <Table
          dataSource={logHistory}
          columns={columns}
          pagination={false}
          bordered
          size="middle"
          rowKey="logId"
          style={{ borderRadius: "8px", overflow: "hidden" }}
        />
      </div>

      {/* Info Box */}
      <div
        style={{
          marginTop: "16px",
          padding: "12px 16px",
          backgroundColor: "#fff7e6",
          border: "1px solid #ffd591",
          borderRadius: "6px",
          fontSize: "12px",
          color: "#ad6800",
        }}
      >
        <strong>💡 Info:</strong> Log menampilkan riwayat detail proses
        pengiriman pesan. Klik "View Request/Response" untuk melihat detail
        request dan response dari gateway.
      </div>
    </Modal>
  );
};

export default LogDetailModal;
