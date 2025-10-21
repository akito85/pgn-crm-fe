// components/ManagementDeliveryInvoice.js
import React, { useState } from "react";
import { Card, Button, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import SummaryStatistics from "./_components/ManagementDeliveryComponent/SummaryStatistics";
import FilterSection from "./_components/ManagementDeliveryComponent/FilterSection";
import DeliveryTable from "./_components/ManagementDeliveryComponent/DeliveryTable";
import CreateJobModal from "./_components/CreateJobModal";
import DetailInvoiceModal from "./_components/DetailnvoiceModal";
import PreviewMessageModal from "./_components/ManagementDeliveryComponent/PreviewMessageModal";

// Import modular components

// Main Component
const ManagementDeliveryInvoice = () => {
  const [dateRange, setDateRange] = useState(null);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Summary data
  const summaryData = {
    totalSent: 10450,
    failed: 15,
    pending: 250,
    notProcessed: 88,
  };

  // Table data
  const invoiceData = [
    {
      key: "1",
      invoiceNo: "INV-001",
      customer: "PT. JAYA",
      channel: "Email",
      status: "Terkirim",
      lastUpdate: "02/10/2025 14:30",
    },
    {
      key: "2",
      invoiceNo: "INV-001",
      customer: "PT. JAYA",
      channel: "SMS",
      status: "Terkirim",
      lastUpdate: "02/10/2025 14:32",
    },
    {
      key: "3",
      invoiceNo: "INV-002",
      customer: "PT. MAKMUR",
      channel: "WhatsApp",
      status: "Gagal",
      lastUpdate: "02/10/2025 14:31",
    },
    {
      key: "4",
      invoiceNo: "INV-002",
      customer: "PT. MAKMUR",
      channel: "SMS",
      status: "Gagal",
      lastUpdate: "02/10/2025 14:31",
    },
    {
      key: "5",
      invoiceNo: "INV-003",
      customer: "Bpk. Budi",
      channel: "SMS",
      status: "Terkirim",
      lastUpdate: "02/10/2025 14:32",
    },
    {
      key: "6",
      invoiceNo: "INV-004",
      customer: "PT. SEJAHTERA",
      channel: "Kurir",
      status: "Menunggu",
      lastUpdate: "02/10/2025 14:33",
    },
  ];

  const handleApplyFilter = () => {
    setLoading(true);
    console.log("Applying filters:", {
      dateRange,
      status,
    });
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleResetFilter = () => {
    setDateRange(null);
    setStatus("all");
  };

  const handleViewDetail = (record) => {
    console.log("View detail for:", record);
    setSelectedInvoice(record);
    setDetailModalVisible(true);
  };

  const handlePreview = (record) => {
    console.log("Preview message for:", record);
    setSelectedInvoice(record);
    setPreviewModalVisible(true);
  };

  const handleCreateJob = (jobData) => {
    console.log("Creating job with data:", jobData);
    setModalVisible(false);
  };

  return (
    <LayoutMenu>
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
        {/* Page Header with Button */}
        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#262626",
                margin: 0,
                marginBottom: "8px",
              }}
            >
              Management Delivery Invoice
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#8c8c8c",
                margin: 0,
              }}
            >
              Monitor dan kelola pengiriman invoice kepada pelanggan secara
              realtime
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
            style={{
              height: "48px",
              fontSize: "15px",
              fontWeight: "500",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(24, 144, 255, 0.3)",
            }}
          >
            Buat Job Pengiriman
          </Button>
        </div>

        {/* Summary Statistics */}
        <SummaryStatistics
          totalSent={summaryData.totalSent}
          failed={summaryData.failed}
          pending={summaryData.pending}
          notProcessed={summaryData.notProcessed}
        />

        {/* Filter Section */}
        <FilterSection
          dateRange={dateRange}
          setDateRange={setDateRange}
          status={status}
          setStatus={setStatus}
          onApplyFilter={handleApplyFilter}
          onResetFilter={handleResetFilter}
        />

        {/* Invoice Table */}
        <Card
          title={
            <span style={{ fontSize: "16px", fontWeight: "600" }}>
              📋 Daftar Pengiriman Invoice
            </span>
          }
          extra={
            <Tag color="blue" style={{ fontSize: "13px", padding: "4px 12px" }}>
              Total: {invoiceData.length} data
            </Tag>
          }
          bordered={false}
          style={{
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div className="p-5">
            <DeliveryTable
              dataSource={invoiceData}
              loading={loading}
              onViewDetail={handleViewDetail}
              onPreview={handlePreview}
            />
          </div>
        </Card>

        {/* Create Job Modal */}
        <CreateJobModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSubmit={handleCreateJob}
        />

        {/* Detail Invoice Modal */}
        <DetailInvoiceModal
          visible={detailModalVisible}
          onCancel={() => {
            setDetailModalVisible(false);
            setSelectedInvoice(null);
          }}
          invoiceData={selectedInvoice}
        />

        {/* Preview Message Modal */}
        <PreviewMessageModal
          visible={previewModalVisible}
          onCancel={() => {
            setPreviewModalVisible(false);
            setSelectedInvoice(null);
          }}
          messageData={selectedInvoice}
        />
      </div>
    </LayoutMenu>
  );
};

export default ManagementDeliveryInvoice;
