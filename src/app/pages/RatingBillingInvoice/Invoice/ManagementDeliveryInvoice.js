// components/ManagementDeliveryInvoice.js
import React, { useEffect, useState, useMemo } from "react";
import { Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import SummaryStatistics from "./_components/ManagementDeliveryComponent/SummaryStatistics";
import DetailInvoiceModal from "./_components/DetailnvoiceModal";
import PreviewMessageModal from "./_components/ManagementDeliveryComponent/PreviewMessageModal";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import StatusComponent from "../../../../components/StatusComponent";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import SVGIcon from "../../../../assets/Icon/index";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";

import {
  getDeliveryList,
  getDeliverySummary,
} from "../../../../redux/slices/rating_billing_invoice/managementDeliveryInvoice";
import ButtonComponent from "../../../../components/ButtonComponent";

const ManagementDeliveryInvoice = () => {
  const dispatch = useDispatch();

  // Redux state
  const { data_list, data_summary, loading } = useSelector(
    (state) => state.managementDeliveryInvoice
  );

  // Modal & selection
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Pagination for infinity scroll
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);

  // Fixed column settings
  const [fixedColumns, setFixedColumns] = useState({
    left: [],
    right: ["action", "status"],
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
  // Initial fetch
  useEffect(() => {
    dispatch(
      getDeliveryList({
        page: 1,
        pageSize: 100, // Initial load 100
        search: "",
        sort: "createdDate~desc",
        isLoadMore: false,
      })
    );

    dispatch(getDeliverySummary());
    setPage(1);
  }, [dispatch]);

  // Load more handler
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = data_list?.page?.totalPages || 0;

    // Check if there's more data to load
    if (nextPage <= totalPages) {
      await dispatch(
        getDeliveryList({
          page: nextPage,
          pageSize: loadMoreSize, // Load 20 more
          search: "",
          sort: "createdDate~desc",
          isLoadMore: true,
        })
      );
      setPage(nextPage);
    }
  };

  // Calculate if there's more data
  const hasMore =
    (data_list?.result?.length || 0) < (data_list?.page?.totalElements || 0);

  // Refresh handler
  const handleRefresh = () => {
    dispatch(
      getDeliveryList({
        page: 1,
        pageSize: page * loadMoreSize || 100,
        search: "",
        sort: "createdDate~desc",
        isLoadMore: false,
      })
    );
    setPage(1);
  };

  /* ----------------------------------------------------------
     TABLE COLUMNS
  ------------------------------------------------------------*/
  const baseColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        render: (_, __, index) => (
          <div className="text-center">{index + 1}</div>
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
    ],
    []
  );

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

  /* ----------------------------------------------------------
     ITEM GRANT ACCESS (Actions and Toolbar)
  ------------------------------------------------------------*/
  const itemGrantAccess = [
    {
      action: "Create",
      render: (
        <NavLink to={INVOICE_ROUTES.CREATE_DELIVERY_JOB}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={20} />}
            type={"submit"}
            border={false}
          >
            Create Delivery Job
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Tooltip title="Detail">
          <div
            onClick={() => handleViewDetail(record)}
            style={{ cursor: "pointer", padding: 0, margin: 0 }}
          >
            <SVGIcon name="IconDetail" width={15} />
          </div>
        </Tooltip>
      ),
    },
  ];

  // Generate action columns using useColumnActionPermission
  const actionCols = useColumnActionPermission(["view"], itemGrantAccess).map(
    (col) => ({
      ...col,
      width: 70,
      align: "center",
    })
  );

  // Combine base columns with action columns
  const allColumns = useMemo(() => {
    return [...baseColumns, ...actionCols];
  }, [baseColumns, actionCols]);

  // Integrate fixed columns
  const columns = useMemo(() => {
    const leftFixed = [];
    const normal = [];
    const rightFixed = [];

    allColumns.forEach((col) => {
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
  }, [allColumns, fixedColumns]);

  // Column definitions for TableRBI
  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <LayoutMenu>
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="w-full mt-[15px] text-primary">
              Management Delivery Invoice
            </p>
            <Toolbar items={itemGrantAccess} />
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
          totalData={data_list?.page?.totalElements || 0}
          tableScrolled={{ x: 2000, y: 525 }}
          showExport={false}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          usePagination={false}
          useInfiniteScroll={true}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          showRefresh={true}
          onRefresh={handleRefresh}
          loadMoreThreshold={20}
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
