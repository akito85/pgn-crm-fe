import React, { useEffect, useState, useMemo } from "react";
import { Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
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

const PAGE_SIZE_INIT = 100;
const PAGE_SIZE_MORE = 20;

const formatDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  return [
    String(d.getDate()).padStart(2, "0"),
    String(d.getMonth() + 1).padStart(2, "0"),
    d.getFullYear(),
  ].join(" ");
};

const ManagementDeliveryInvoice = () => {
  const dispatch = useDispatch();
  const { data_list, data_summary, loading } = useSelector(
    (state) => state.managementDeliveryInvoice,
  );

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [page, setPage] = useState(1);
  const [fixedColumns, setFixedColumns] = useState({
    left: [],
    right: ["action", "status"],
  });

  const fetchList = (params) =>
    dispatch(
      getDeliveryList({ search: "", sort: "createdDate~desc", ...params }),
    );

  useEffect(() => {
    dispatch(
      getDeliveryList({
        page: 1,
        pageSize: PAGE_SIZE_INIT,
        isLoadMore: false,
        search: "",
        sort: "createdDate~desc",
      }),
    );
    dispatch(getDeliverySummary());
  }, [dispatch]);

  const hasMore =
    (data_list?.result?.length || 0) < (data_list?.page?.totalElements || 0);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    if (nextPage <= (data_list?.page?.totalPages || 0)) {
      fetchList({ page: nextPage, pageSize: PAGE_SIZE_MORE, isLoadMore: true });
      setPage(nextPage);
    }
  };

  const handleRefresh = () => {
    fetchList({
      page: 1,
      pageSize: page * PAGE_SIZE_MORE || PAGE_SIZE_INIT,
      isLoadMore: false,
    });
    setPage(1);
  };

  const baseColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        render: (_, __, i) => <div className="text-center">{i + 1}</div>,
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
      { key: "sor", title: "SOR", dataIndex: "sor", width: 120 },
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
        render: formatDate,
      },
      {
        key: "dateSent",
        title: "DATE SENT",
        dataIndex: "sentDtm",
        width: 150,
        render: formatDate,
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
        render: formatDate,
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
    [],
  );

  const itemGrantAccess = [
    {
      action: "Create",
      render: (
        <NavLink to={INVOICE_ROUTES.CREATE_DELIVERY_JOB}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={20} />}
            type="submit"
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
            onClick={() => {
              setSelectedInvoice(record);
              setDetailModalVisible(true);
            }}
            style={{ cursor: "pointer" }}
          >
            <SVGIcon name="IconDetail" width={15} />
          </div>
        </Tooltip>
      ),
    },
  ];

  const actionCols = useColumnActionPermission(["view"], itemGrantAccess).map(
    (col) => ({ ...col, width: 70, align: "center" }),
  );

  const columns = useMemo(() => {
    return [...baseColumns, ...actionCols].map((col) => {
      if (fixedColumns.left.includes(col.key)) return { ...col, fixed: "left" };
      if (fixedColumns.right.includes(col.key))
        return { ...col, fixed: "right" };
      return col;
    });
  }, [baseColumns, actionCols, fixedColumns]);

  const columnDefinitions = useMemo(
    () =>
      columns.map(({ key, dataIndex, title }) => ({
        key: key || dataIndex || title,
        title,
      })),
    [columns],
  );

  return (
    <>
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
        {/* GET /v1/dbs/api/rbi/delivery/summary */}
        <SummaryStatistics
          totalSent={data_summary?.success ?? 0}
          failed={data_summary?.failed ?? 0}
          pending={data_summary?.awaitingDelivery ?? 0}
          notProcessed={data_summary?.open ?? 0}
          summaryChannel={data_summary?.summaryChannel}
        />

        {/* GET /v1/dbs/api/rbi/delivery/list */}
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

        <DetailInvoiceModal
          visible={detailModalVisible}
          onCancel={() => {
            setDetailModalVisible(false);
            setSelectedInvoice(null);
          }}
          invoiceData={selectedInvoice}
        />

        <PreviewMessageModal
          visible={previewModalVisible}
          onCancel={() => {
            setPreviewModalVisible(false);
            setSelectedInvoice(null);
          }}
          messageData={selectedInvoice}
        />
      </CardContainer>
    </>
  );
};

export default ManagementDeliveryInvoice;
