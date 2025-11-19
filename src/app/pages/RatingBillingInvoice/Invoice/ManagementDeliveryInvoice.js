// components/ManagementDeliveryInvoice.js
import React, { useState } from "react";
import { Card, Button, Tag } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import SummaryStatistics from "./_components/ManagementDeliveryComponent/SummaryStatistics";
import CreateJobModal from "./_components/CreateJobModal";
import DetailInvoiceModal from "./_components/DetailnvoiceModal";
import PreviewMessageModal from "./_components/ManagementDeliveryComponent/PreviewMessageModal";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";

// Main Component
const ManagementDeliveryInvoice = () => {
  const [dateRange, setDateRange] = useState(null);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fixed columns state
  const [fixedColumns, setFixedColumns] = useState({
    left: [],
    right: [],
  });

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
    {
      key: "7",
      invoiceNo: "INV-005",
      customer: "PT. ABADI",
      channel: "Email",
      status: "Terkirim",
      lastUpdate: "02/10/2025 14:35",
    },
    {
      key: "8",
      invoiceNo: "INV-006",
      customer: "CV. MAJU",
      channel: "WhatsApp",
      status: "Menunggu",
      lastUpdate: "02/10/2025 14:36",
    },
  ];

  const columnDefinitions = [
    {
      key: "no",
      title: "NO",
      width: 10,
      render: (_, __, index) => (
        <div className="text-center">
          {(currentPage - 1) * pageSize + index + 1}
        </div>
      ),
    },
    {
      key: "invoiceNo",
      title: "INVOICE NUMBER",
      dataIndex: "invoiceNo",
      width: 60,
    },
    {
      key: "customer",
      title: "CUSTOMER",
      dataIndex: "customer",
      width: 50,
    },
    {
      key: "channel",
      title: "DELIVERY SERVICE",
      dataIndex: "channel",
      width: 60,
    },
    {
      key: "status",
      title: "STATUS",
      dataIndex: "status",
      width: 35,
      render: (status) => {
        let color = "default";
        if (status === "Terkirim") color = "success";
        else if (status === "Gagal") color = "error";
        else if (status === "Menunggu") color = "warning";

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      key: "actions",
      title: "ACTION",
      width: 18,
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Button
            type="link"
            size="small"
            onClick={() => handleViewDetail(record)}
          >
            <EyeOutlined style={{ fontSize: "20px" }} />
          </Button>
        </div>
      ),
    },
  ];

  // Apply fixed columns
  const columns = columnDefinitions.map((col) => {
    const newCol = { ...col };

    if (fixedColumns.left.includes(col.key)) {
      newCol.fixed = "left";
    } else if (fixedColumns.right.includes(col.key)) {
      newCol.fixed = "right";
    }

    return newCol;
  });

  const handleApplyFilter = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleResetFilter = () => {
    setDateRange(null);
    setStatus("all");
  };

  const handleViewDetail = (record) => {
    setSelectedInvoice(record);
    setDetailModalVisible(true);
  };

  const handlePreview = (record) => {
    setSelectedInvoice(record);
    setPreviewModalVisible(true);
  };

  const handleCreateJob = (jobData) => {
    setModalVisible(false);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleSizeChange = (current, size) => {
    setCurrentPage(1);
    setPageSize(size);
  };

  return (
    <LayoutMenu>
      <CardContainer
        header={
          <div className="flex sm:flex-cols justify-between md:gap-2 md:items-center">
            <h2 className="text-2xl font-semibold">
              Management Delivery Invoice
            </h2>
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
              }}
            >
              Create Delivery Job
            </Button>
          </div>
        }
      >
        {/* Summary Statistics */}
        <SummaryStatistics
          totalSent={summaryData.totalSent}
          failed={summaryData.failed}
          pending={summaryData.pending}
          notProcessed={summaryData.notProcessed}
        />

        <TableRBI
          idTable="delivery-invoice-table"
          dataSource={invoiceData}
          columns={columns}
          pageSize={pageSize}
          current={currentPage}
          loading={loading}
          onChange={handlePageChange}
          onSizeChanger={handleSizeChange}
          totalData={invoiceData.length}
          useSelect={true}
          usePagination={true}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
        />

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
      </CardContainer>
    </LayoutMenu>
  );
};

export default ManagementDeliveryInvoice;
