// components/ManagementDeliveryInvoice.js
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import SummaryStatistics from "./_components/ManagementDeliveryComponent/SummaryStatistics";
import DetailInvoiceModal from "./_components/DetailnvoiceModal";
import PreviewMessageModal from "./_components/ManagementDeliveryComponent/PreviewMessageModal";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import StatusComponent from "../../../../components/StatusComponent";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";

import {
  getDeliveryList,
  getDeliverySummary,
} from "../../../../redux/slices/rating_billing_invoice/managementDeliveryInvoice";

const ManagementDeliveryInvoice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { data_list, data_summary, loading } = useSelector(
    (state) => state.managementDeliveryInvoice
  );

  // Modal & selection
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fixed column settings
  const [fixedColumns, setFixedColumns] = useState({
    left: [],
    right: ["actions", "status"],
  });

  /* ----------------------------------------------------------
     FORMAT DATE HELPER
  ------------------------------------------------------------*/
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  /* ----------------------------------------------------------
     FETCH DATA LIST + SUMMARY
  ------------------------------------------------------------*/
  useEffect(() => {
    dispatch(
      getDeliveryList({
        page: currentPage,
        pageSize,
        search: "",
        sort: "createdDate~desc",
      })
    );

    dispatch(getDeliverySummary());
  }, [dispatch, currentPage, pageSize]);

  /* ----------------------------------------------------------
     TABLE COLUMNS
  ------------------------------------------------------------*/
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
      key: "invoiceNumber",
      title: "INVOICE NUMBER",
      dataIndex: "invoiceNumber",
      width: 180,
    },
    {
      key: "customerNumber",
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      width: 180,
    },
    {
      key: "customerName",
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      width: 220,
    },
    {
      key: "accountNumber",
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      width: 180,
    },
    {
      key: "accountName",
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      width: 220,
    },
    {
      key: "sor",
      title: "SOR",
      dataIndex: "sor",
      width: 120,
    },
    {
      key: "costCenter",
      title: "COST CENTER",
      dataIndex: "costCenter",
      width: 150,
    },
    {
      key: "accountSegment",
      title: "ACCOUNT SEGMENT",
      dataIndex: "accountSegment",
      width: 180,
    },
    {
      key: "accountGroupType",
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      width: 200,
    },
    {
      key: "meterReadingCode",
      title: "METER READING CODE",
      dataIndex: "meterReadingCode",
      width: 200,
    },
    {
      key: "accountType",
      title: "ACCOUNT TYPE",
      dataIndex: "accountType",
      width: 150,
    },
    {
      key: "accountStatus",
      title: "ACCOUNT STATUS",
      dataIndex: "accountStatus",
      width: 180,
    },
    {
      key: "customerManagement",
      title: "CUSTOMER MANAGEMENT",
      dataIndex: "customerManagement",
      width: 200,
    },
    {
      key: "corporateCustomer",
      title: "CORPORATE CUSTOMER",
      dataIndex: "corporateCustomer",
      width: 200,
    },
    {
      key: "channel",
      title: "CHANNEL",
      dataIndex: "deliveryChannel",
      width: 120,
    },
    {
      key: "billingPeriod",
      title: "BILLING PERIOD",
      dataIndex: "billingPeriod",
      width: 150,
    },
    {
      key: "deliveryDate",
      title: "DELIVERY DATE",
      dataIndex: "deliveryDate",
      width: 150,
      render: (date) => formatDate(date),
    },
    {
      key: "dateSent",
      title: "DATE SENT",
      dataIndex: "sentDtm",
      width: 150,
      render: (date) => formatDate(date),
    },
    {
      key: "createdBy",
      title: "CREATED BY",
      dataIndex: "createdBy",
      width: 150,
    },
    {
      key: "createdAt",
      title: "CREATED AT",
      dataIndex: "createdAt",
      width: 180,
      render: (date) => formatDate(date),
    },
    {
      key: "status",
      title: "STATUS",
      dataIndex: "deliveryStatus",
      width: 120,
      render: (status) => (
        <div className="flex justify-center">
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

  // Integrate fixed columns
  const columns = useMemo(() => {
    const leftFixed = [];
    const normal = [];
    const rightFixed = [];

    columnDefinitions.forEach((col) => {
      if (fixedColumns.left.includes(col.key)) leftFixed.push(col);
      else if (fixedColumns.right.includes(col.key)) rightFixed.push(col);
      else normal.push(col);
    });

    return [...leftFixed, ...normal, ...rightFixed].map((col) => {
      const newCol = { ...col };
      if (fixedColumns.left.includes(col.key)) newCol.fixed = "left";
      if (fixedColumns.right.includes(col.key)) newCol.fixed = "right";
      return newCol;
    });
  }, [fixedColumns, currentPage, pageSize]);

  /* ----------------------------------------------------------
     HANDLERS
  ------------------------------------------------------------*/
  const handleViewDetail = (record) => {
    setSelectedInvoice(record);
    setDetailModalVisible(true);
  };

  const handlePreview = (record) => {
    setSelectedInvoice(record);
    setPreviewModalVisible(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSizeChange = (current, size) => {
    setCurrentPage(1);
    setPageSize(size);
  };

  return (
    <LayoutMenu>
      <CardContainer
        header={
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-primary">
              Management Delivery Invoice
            </h2>

            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate(INVOICE_ROUTES.CREATE_DELIVERY_JOB)}
              style={{
                height: "48px",
                fontSize: "15px",
                borderRadius: "8px",
              }}
            >
              Create Delivery Job
            </Button>
          </div>
        }
      >
        {/* Summary from API */}
        <SummaryStatistics
          totalSent={data_summary?.success ?? 0}
          failed={data_summary?.failed ?? 0}
          pending={data_summary?.awaitingDelivery ?? 0}
          notProcessed={data_summary?.open ?? 0}
          summaryChannel={data_summary?.summaryChannel}
        />

        {/* Main Table */}
        <TableRBI
          idTable="delivery-invoice-table"
          dataSource={data_list?.result || []}
          columns={columns}
          loading={loading}
          pageSize={pageSize}
          current={currentPage}
          onChange={handlePageChange}
          onSizeChanger={handleSizeChange}
          totalData={data_list?.page?.totalElements || 0}
          tableScrolled={{ x: 1200 }}
          useSelect={true}
          usePagination={true}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
        />

        {/* Detail Modal */}
        <DetailInvoiceModal
          visible={detailModalVisible}
          onCancel={() => {
            setDetailModalVisible(false);
            setSelectedInvoice(null);
          }}
          invoiceData={selectedInvoice}
        />

        {/* Preview Modal */}
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
