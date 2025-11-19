// components/ManagementDeliveryInvoice.js
import React, { useState, useMemo } from "react";
import { Button, Tag } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import SummaryStatistics from "./_components/ManagementDeliveryComponent/SummaryStatistics";
import CreateJobModal from "./_components/CreateJobModal";
import DetailInvoiceModal from "./_components/DetailnvoiceModal";
import PreviewMessageModal from "./_components/ManagementDeliveryComponent/PreviewMessageModal";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import StatusComponent from "../../../../components/StatusComponent";
import CreateFormDelivery from "./_components/ManagementDeliveryComponent/CreateFormDelivery";

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
      status: "Sent",
      lastUpdate: "02/10/2025 14:30",
    },
    {
      key: "2",
      invoiceNo: "INV-001",
      customer: "PT. JAYA",
      channel: "SMS",
      status: "Sent",
      lastUpdate: "02/10/2025 14:32",
    },
    {
      key: "3",
      invoiceNo: "INV-002",
      customer: "PT. MAKMUR",
      channel: "WhatsApp",
      status: "Failed",
      lastUpdate: "02/10/2025 14:31",
    },
    {
      key: "4",
      invoiceNo: "INV-002",
      customer: "PT. MAKMUR",
      channel: "SMS",
      status: "Failed",
      lastUpdate: "02/10/2025 14:31",
    },
    {
      key: "5",
      invoiceNo: "INV-003",
      customer: "Bpk. Budi",
      channel: "SMS",
      status: "Sent",
      lastUpdate: "02/10/2025 14:32",
    },
    {
      key: "6",
      invoiceNo: "INV-004",
      customer: "PT. SEJAHTERA",
      channel: "Kurir",
      status: "Scheduled",
      lastUpdate: "02/10/2025 14:33",
    },
    {
      key: "7",
      invoiceNo: "INV-005",
      customer: "PT. ABADI",
      channel: "Email",
      status: "Sent",
      lastUpdate: "02/10/2025 14:35",
    },
    {
      key: "8",
      invoiceNo: "INV-006",
      customer: "CV. MAJU",
      channel: "WhatsApp",
      status: "Scheduled",
      lastUpdate: "02/10/2025 14:36",
    },
  ];

  // Column definitions
  const columnDefinitions = [
    {
      key: "no",
      title: "NO",
      width: 60,
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
      width: 150,
    },
    {
      key: "customer",
      title: "CUSTOMER",
      dataIndex: "customer",
      width: 200,
    },
    {
      key: "channel",
      title: "DELIVERY SERVICE",
      dataIndex: "channel",
      width: 150,
    },
    {
      key: "status",
      title: "STATUS",
      dataIndex: "status",
      width: 120,
      render: (status) => (
        <div className={"flex justify-center"}>
          <StatusComponent colour={status}>{status}</StatusComponent>
        </div>
      ),
    },
    {
      key: "actions",
      title: "ACTION",
      width: 100,
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

  // Apply fixed columns and reorder
  const columns = useMemo(() => {
    // Separate columns into categories while preserving original order
    const leftFixed = [];
    const rightFixed = [];
    const normal = [];

    // First pass: categorize columns based on their ORIGINAL order in columnDefinitions
    columnDefinitions.forEach((col) => {
      if (fixedColumns.left.includes(col.key)) {
        leftFixed.push(col);
      } else if (fixedColumns.right.includes(col.key)) {
        rightFixed.push(col);
      } else {
        normal.push(col);
      }
    });

    // Reorder: left fixed → normal → right fixed
    const reorderedColumns = [...leftFixed, ...normal, ...rightFixed];

    // Apply fixed property
    return reorderedColumns.map((col) => {
      const newCol = { ...col };

      if (fixedColumns.left.includes(col.key)) {
        newCol.fixed = "left";
      } else if (fixedColumns.right.includes(col.key)) {
        newCol.fixed = "right";
      } else {
        delete newCol.fixed;
      }

      return newCol;
    });
  }, [fixedColumns, currentPage, pageSize]);

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
          tableScrolled={{ x: 1200 }}
          useSelect={true}
          usePagination={true}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
        />

        {/* Create Job Modal */}
        <CreateFormDelivery
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
