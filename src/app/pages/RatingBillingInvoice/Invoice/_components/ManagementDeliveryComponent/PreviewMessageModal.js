// components/ManagementDeliveryInvoice/PreviewMessageModal.js
import React from "react";
import { Modal, Button, Card, Divider, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

const PreviewMessageModal = ({ visible, onCancel, messageData }) => {
  if (!messageData) return null;

  // Mock preview data - Replace with actual data from API
  const previewData = {
    channel: messageData.channel || "Email",
    to: "cs@ptjaya.com",
    subject: "Tagihan Gas Anda No. INV-001",
    body: `Yth. Bapak/Ibu Pelanggan PT. JAYA,

Berikut kami sampaikan tagihan pemakaian gas Anda untuk periode September 2025.

Total Tagihan: Rp 15.000.000
Jatuh Tempo: 20/10/2025

Silakan lihat lampiran untuk detail dan panduan pembayaran.

Terima kasih.`,
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case "Email":
        return "📧";
      case "WhatsApp":
        return "📱";
      case "SMS":
        return "💬";
      default:
        return "📄";
    }
  };

  const getChannelColor = (channel) => {
    switch (channel) {
      case "Email":
        return "#1890ff";
      case "WhatsApp":
        return "#25D366";
      case "SMS":
        return "#52c41a";
      default:
        return "#595959";
    }
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: "18px", fontWeight: "600", color: "#262626" }}>
          <MailOutlined
            style={{
              marginRight: "8px",
              color: getChannelColor(previewData.channel),
            }}
          />
          Pratinjau Pesan - {previewData.channel}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="close" type="primary" size="large" onClick={onCancel}>
          Tutup
        </Button>,
      ]}
      style={{ top: 20 }}
      bodyStyle={{ padding: "24px" }}
    >
      {/* Message Header Card */}
      <Card
        style={{
          backgroundColor: "#f9fafb",
          border: `2px solid ${getChannelColor(previewData.channel)}`,
          borderRadius: "8px",
          marginBottom: "16px",
          padding: "16px",
        }}
        bodyStyle={{ padding: "16px" }}
      >
        <div style={{ marginBottom: "12px" }}>
          <Text
            style={{
              fontSize: "12px",
              color: "#8c8c8c",
              fontWeight: "500",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Kepada:
          </Text>
          <Text
            style={{
              fontSize: "15px",
              color: "#262626",
              fontWeight: "600",
            }}
          >
            {previewData.to}
          </Text>
        </div>

        {previewData.channel === "Email" && (
          <div>
            <Text
              style={{
                fontSize: "12px",
                color: "#8c8c8c",
                fontWeight: "500",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Subjek:
            </Text>
            <Text
              style={{
                fontSize: "15px",
                color: "#262626",
                fontWeight: "600",
              }}
            >
              {previewData.subject}
            </Text>
          </div>
        )}
      </Card>

      {/* Message Body */}
      <Divider
        orientation="left"
        style={{ fontSize: "14px", fontWeight: "600", margin: "16px 0" }}
      >
        {getChannelIcon(previewData.channel)} Isi Pesan
      </Divider>

      <Card
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          minHeight: "250px",
          padding: "16px",
        }}
        bodyStyle={{ padding: "20px" }}
      >
        <Paragraph
          style={{
            fontSize: "14px",
            lineHeight: "1.8",
            color: "#262626",
            whiteSpace: "pre-wrap",
            margin: 0,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          {previewData.body}
        </Paragraph>
      </Card>

      {/* Footer Info */}
      <div
        style={{
          marginTop: "16px",
          padding: "12px 16px",
          backgroundColor: "#e6f7ff",
          border: "1px solid #91d5ff",
          borderRadius: "6px",
          fontSize: "12px",
          color: "#0958d9",
        }}
      >
        <strong>💡 Info:</strong> Ini adalah pratinjau pesan yang akan dikirim
        ke pelanggan. Pastikan semua informasi sudah benar sebelum mengirim.
      </div>
    </Modal>
  );
};

export default PreviewMessageModal;
