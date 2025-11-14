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
  Tag,
  message,
} from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import LogDetailModal from "./ManagementDeliveryComponent/LogDetailModal";

// Status Tag Component
const StatusTag = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      Terkirim: {
        color: "success",
        icon: "✅",
        text: "Terkirim",
      },
      Gagal: {
        color: "error",
        icon: "❌",
        text: "Gagal",
      },
      Menunggu: {
        color: "warning",
        icon: "⏳",
        text: "Menunggu",
      },
      "Belum Diproses": {
        color: "default",
        icon: "📋",
        text: "Belum Diproses",
      },
    };
    return configs[status] || configs["Belum Diproses"];
  };

  const config = getStatusConfig(status);

  return (
    <Tag
      color={config.color}
      style={{
        fontWeight: "500",
        padding: "4px 12px",
        fontSize: "13px",
        borderRadius: "6px",
      }}
    >
      {config.icon} {config.text}
    </Tag>
  );
};

const DetailInvoiceModal = ({ visible, onCancel, invoiceData }) => {
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  if (!invoiceData) return null;

  // Mock detailed data - Replace with actual API data
  const detailData = {
    invoiceNo: invoiceData.invoiceNo,
    customer: invoiceData.customer,
    totalAmount: "Rp 2.500.000",
    invoiceDate: "01/10/2025",
    dueDate: "20/10/2025",
    deliveries: [
      {
        id: "789",
        channel: "Email",
        recipient: "cs@ptmakmur.com",
        status: "Terkirim",
        sentTime: "01/10/2025 10:10",
        hasLog: true,
      },
      {
        id: "790",
        channel: "WhatsApp",
        recipient: "+628123456789",
        status: "Gagal",
        sentTime: "01/10/2025 10:11",
        hasLog: true,
        canResend: true,
        errorNote:
          'Aksi "Kirim Ulang" hanya muncul jika status pengiriman adalah "Gagal".',
      },
    ],
  };

  const handleViewLog = (delivery) => {
    setSelectedLog(delivery);
    setLogModalVisible(true);
  };

  const handleResend = (delivery) => {
    Modal.confirm({
      title: "Konfirmasi Kirim Ulang",
      content: `Apakah Anda yakin ingin mengirim ulang invoice ke ${delivery.recipient} via ${delivery.channel}?`,
      okText: "Ya, Kirim Ulang",
      cancelText: "Batal",
      onOk() {
        message.success("Invoice berhasil dikirim ulang!");
        // Implement actual resend logic here
      },
    });
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: "18px", fontWeight: "600", color: "#262626" }}>
          <FileTextOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
          Detail Invoice: {detailData.invoiceNo}
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
    >
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
                Pelanggan
              </div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#262626",
                }}
              >
                {detailData.customer}
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
                Total Tagihan
              </div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1890ff",
                }}
              >
                {detailData.totalAmount}
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
                Tanggal Invoice
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#262626",
                }}
              >
                📅 {detailData.invoiceDate}
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
                Tanggal Jatuh Tempo
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#262626",
                }}
              >
                📅 {detailData.dueDate}
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
        📨 Riwayat Pengiriman
      </Divider>

      <div style={{ marginTop: "16px" }}>
        {detailData.deliveries.map((delivery) => (
          <Card
            key={delivery.id}
            style={{
              marginBottom: "12px",
              border: "1px solid #e5e7eb",
              borderLeft: `4px solid ${
                delivery.status === "Terkirim" ? "#52c41a" : "#ff4d4f"
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
                  #{delivery.id}
                </div>
              </Col>
              <Col span={4}>
                <div style={{ fontSize: "12px", color: "#8c8c8c" }}>Kanal</div>
                <div style={{ fontWeight: "500", marginTop: "2px" }}>
                  {delivery.channel === "Email" && "📧 Email"}
                  {delivery.channel === "WhatsApp" && "📱 WhatsApp"}
                  {delivery.channel === "SMS" && "💬 SMS"}
                </div>
              </Col>
              <Col span={6}>
                <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                  Penerima
                </div>
                <div
                  style={{
                    fontWeight: "500",
                    marginTop: "2px",
                    fontSize: "13px",
                  }}
                >
                  {delivery.recipient}
                </div>
              </Col>
              <Col span={4}>
                <div style={{ fontSize: "12px", color: "#8c8c8c" }}>Status</div>
                <div style={{ marginTop: "2px" }}>
                  <StatusTag status={delivery.status} />
                </div>
              </Col>
              <Col span={5}>
                <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                  Waktu Kirim
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#595959",
                    marginTop: "2px",
                  }}
                >
                  🕐 {delivery.sentTime}
                </div>
              </Col>
              <Col span={3}>
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  {delivery.hasLog && (
                    <Button
                      size="small"
                      onClick={() => handleViewLog(delivery)}
                      style={{ width: "100%", fontSize: "12px" }}
                    >
                      Lihat Log
                    </Button>
                  )}
                  {delivery.canResend && (
                    <Button
                      type="primary"
                      danger
                      size="small"
                      //   icon={<ReloadOutlined />}
                      onClick={() => handleResend(delivery)}
                      style={{ width: "100%", fontSize: "12px" }}
                    >
                      Kirim Ulang
                    </Button>
                  )}
                </Space>
              </Col>
            </Row>

            {/* Error Note - Only shown for failed deliveries */}
            {delivery.errorNote && (
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
                <strong>Note:</strong> {delivery.errorNote}
              </div>
            )}
          </Card>
        ))}
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
    </Modal>
  );
};

export default DetailInvoiceModal;
