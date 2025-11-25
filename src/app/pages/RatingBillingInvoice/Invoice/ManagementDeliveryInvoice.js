// components/ManagementDeliveryInvoice.js
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import SummaryStatistics from "./_components/ManagementDeliveryComponent/SummaryStatistics";
import CreateFormDelivery from "./_components/ManagementDeliveryComponent/CreateFormDelivery";
import DetailInvoiceModal from "./_components/DetailnvoiceModal";
import PreviewMessageModal from "./_components/ManagementDeliveryComponent/PreviewMessageModal";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import StatusComponent from "../../../../components/StatusComponent";

import {
  getDeliveryList,
  getDeliverySummary,
} from "../../../../redux/slices/rating_billing_invoice/managementDeliveryInvoice";

const ManagementDeliveryInvoice = () => {
  const dispatch = useDispatch();

  // Redux state
  const { data_list, data_summary, loading } = useSelector(
    (state) => state.managementDeliveryInvoice
  );

  // Modal & selection
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fixed column settings
  const [fixedColumns, setFixedColumns] = useState({
    left: [],
    right: [],
  });

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
      key: "customerName",
      title: "CUSTOMER",
      dataIndex: "customerName",
      width: 220,
    },
    {
      key: "deliveryService",
      title: "DELIVERY SERVICE",
      dataIndex: "deliveryService",
      width: 150,
    },
    {
      key: "status",
      title: "STATUS",
      dataIndex: "status",
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
              onClick={() => setModalVisible(true)}
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

        {/* Create Job Modal */}
        <CreateFormDelivery
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
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
