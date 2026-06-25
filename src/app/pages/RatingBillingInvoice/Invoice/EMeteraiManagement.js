// EMeteraiManagement.js
import React, { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CheckOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../components/BreadCrumb";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import ButtonComponent from "../../../../components/ButtonComponent";
import Toolbar from "../../../../components/Toolbar";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import StampingRequestModal from "./_components/StampingRequestModal";
import ProcessSigningModal from "./_components/ProcessingSigningModal";
import InvoiceDetailModal from "./_components/InvoiceDetailModal";
import ModalApprovalEMeterai from "./_components/ModalApprovalEMeterai";
import { getEMeteraiColumns } from "./_components/EMeteraiColumns";
import {
  getAllEMeteraiInvoices,
  requestStampingDigital,
  requestSigningDigital,
  uploadManualStamping,
  uploadManualSigning,
  getApprovalHistory,
} from "../../../../redux/slices/rating_billing_invoice/emeterai";

const APPROVAL_HISTORY_TABS = [
  { value: "stamp", label: "Stamp" },
  { value: "sign", label: "Sign" },
];

const getApprovalHistoryGroup = (key) => {
  const normalizedKey = String(key || "").toLowerCase();

  if (normalizedKey.includes("sign") || normalizedKey.includes("esign")) {
    return "sign";
  }

  if (
    normalizedKey.includes("stamp") ||
    normalizedKey.includes("meterai") ||
    normalizedKey.includes("emeterai")
  ) {
    return "stamp";
  }

  return null;
};

const groupApprovalHistoryByProcess = (data = {}) => {
  const groupedData = {
    stamp: [],
    sign: [],
  };

  Object.entries(data || {}).forEach(([key, value]) => {
    const group = getApprovalHistoryGroup(key);
    if (!group) return;

    const values = Array.isArray(value) ? value : [];
    groupedData[group] = [...groupedData[group], ...values];
  });

  return groupedData;
};

const EMeteraiManagement = () => {
  const dispatch = useDispatch();

  // Redux state
  const {
    invoice_list,
    invoice_pagination,
    loading,
    stampingLoading,
    signingLoading,
    data_approval_history,
  } = useSelector((state) => state.emeterai);

  // Local state
  const loadMoreSize = 20;
  const [sort, setSort] = useState("billPeriod~desc");

  // Modal states
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [stampingModalVisible, setStampingModalVisible] = useState(false);
  const [signingModalVisible, setSigningModalVisible] = useState(false);
  const [modalApproval, setModalApproval] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});

  // Selected invoice
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Format approval history data when it changes
  useEffect(() => {
    if (
      data_approval_history?.dataApprover ||
      data_approval_history?.dataHistory
    ) {
      const rawApprover = data_approval_history.dataApprover || {};
      const rawHistory = data_approval_history.dataHistory || {};
      const dataApprover = groupApprovalHistoryByProcess(rawApprover);
      const dataHistory = groupApprovalHistoryByProcess(rawHistory);
      setDataApprovalHistory({ dataApprover, dataHistory });
    } else {
      setDataApprovalHistory({
        dataApprover: { stamp: [], sign: [] },
        dataHistory: { stamp: [], sign: [] },
      });
    }
  }, [data_approval_history]);

  // Fixed column settings
  const [fixedColumns, setFixedColumns] = useState({
    left: ["no"],
    right: ["actions"],
  });

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Invoice",
    },
    {
      path: INVOICE_ROUTES.E_METERAI_MANAGEMENT,
      breadcrumbName: "E-Meterai Management",
    },
  ];

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    dispatch(
      getAllEMeteraiInvoices({
        page: 1,
        pageSize: loadMoreSize,
        search: "",
        sort,
        isLoadMore: false,
      }),
    );
  }, [dispatch, sort]);

  const handleLoadMore = useCallback(() => {
    const nextPage = Math.floor(invoice_list.length / loadMoreSize) + 1;
    dispatch(
      getAllEMeteraiInvoices({
        page: nextPage,
        pageSize: loadMoreSize,
        search: "",
        sort,
        isLoadMore: true,
      }),
    );
  }, [dispatch, sort, invoice_list.length]);

  const handleRefresh = useCallback(() => {
    dispatch(
      getAllEMeteraiInvoices({
        page: 1,
        pageSize: loadMoreSize,
        search: "",
        sort,
        isLoadMore: false,
      }),
    );
  }, [dispatch, sort]);

  const fetchInvoices = () => {
    dispatch(
      getAllEMeteraiInvoices({
        page: 1,
        pageSize: loadMoreSize,
        search: "",
        sort,
        isLoadMore: false,
      }),
    );
  };

  // Handlers
  const handleDetails = (record) => {
    if (record) {
      setSelectedInvoice(record);
      setDetailModalVisible(true);
    } else {
      message.error("Invoice data not available");
    }
  };

  const handleProcessSigning = (record) => {
    if (record) {
      setSelectedInvoice(record);
      setSigningModalVisible(true);
    } else {
      message.error("Invoice data not available");
    }
  };

  const handleRetry = (record) => {
    if (record) {
      setSelectedInvoice(record);
      setStampingModalVisible(true);
    } else {
      message.error("Invoice data not available");
    }
  };

  const handleApprovalHistory = (record) => {
    if (record?.invoiceNumber) {
      dispatch(getApprovalHistory({ invoiceNumber: record.invoiceNumber }));
      setModalApprovalHistory(true);
    } else {
      message.error("Invoice data not available");
    }
  };

  const handleProcessStamping = (record) => {
    if (record) {
      setSelectedInvoice(record);
      setStampingModalVisible(true);
    } else {
      message.error("Invoice data not available");
    }
  };

  const isManualStamp = (record) => {
    const values = [
      record?.stampType,
      record?.stampingMethod,
      record?.stampMethod,
      record?.stampSource,
    ];

    return values.some((value) => {
      if (!value) return false;
      const normalized = String(value).toLowerCase().replace(/[\s-]/g, "_");
      return (
        normalized.includes("manual") ||
        normalized.includes("physical") ||
        normalized === "meterai" ||
        normalized.includes("manual_meterai")
      );
    });
  };

  // Handle stamping submission
  const handleStampingSubmit = async (submissionData) => {
    console.log("Submitting Stamping Data:", submissionData);
    try {
      if (submissionData.stampingMethod === "e-stamping") {
        await dispatch(
          requestStampingDigital({
            invoiceNumber: submissionData.invoiceNumber,
            id: submissionData.id,
            remarks: submissionData.remarks,
          }),
        ).unwrap();
      } else if (submissionData.stampingMethod === "manual") {
        await dispatch(
          uploadManualStamping({
            invoiceNumber: submissionData.invoiceNumber,
            file: submissionData.files?.[0] || submissionData.file,
            remark: submissionData.remark,
            apphierId: submissionData.apphierId,
          }),
        ).unwrap();
      }

      setStampingModalVisible(false);
      setSelectedInvoice(null);
      fetchInvoices();
    } catch (error) {
      console.error("❌ Stamping Submission Error:", error);
    }
  };

  // Handle signing submission
  const handleSigningSubmit = async (signingData) => {
    const {
      invoiceNumber,
      signingMethod,
      file,
      remark,
      apphierId,
      id,
      remarks,
    } = signingData;

    try {
      if (signingMethod === "digital") {
        await dispatch(
          requestSigningDigital({
            invoiceNumber,
            id,
            remarks,
          }),
        ).unwrap();
      } else if (signingMethod === "manual") {
        await dispatch(
          uploadManualSigning({
            invoiceNumber,
            file,
            remark: remark || "Manual signing upload",
            apphierId,
          }),
        ).unwrap();
      }

      setSigningModalVisible(false);
      setSelectedInvoice(null);
      fetchInvoices();
    } catch (error) {
      console.error("❌ Signing Submission Error:", error);
    }
  };

  // Bulk Action Handlers
  const handleBulkApproval = () => {
    setModalApproval(true);
  };

  const closeModalApproval = () => {
    setModalApproval(false);
  };

  // Sort Handler
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter && sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "billingPeriod~desc";
    setSort(dataSort);
  };

  const itemGrantAccess = [
    {
      action: "Approval",
      render: (
        <ButtonComponent
          icon={<CheckOutlined style={{ color: "#ffff" }} />}
          type="primary"
          onClick={handleBulkApproval}
        >
          Bulk Approve
        </ButtonComponent>
      ),
    },
  ];

  // Get columns with handlers
  const columnDefinitions = getEMeteraiColumns({
    onDetails: handleDetails,
    onProcessStamping: handleProcessStamping,
    onProcessSigning: handleProcessSigning,
    onRetry: handleRetry,
    onApprovalHistory: handleApprovalHistory,
  });

  return (
    <>
      <BreadCrumb routes={routes} />

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px]">E-Meterai Management</p>
            <div className="flex gap-2">
              <Toolbar items={itemGrantAccess} />
            </div>
          </div>
        }
      >
        {/* Table with TableRBI */}
        <TableRBI
          idTable="emeterai-management-table"
          dataSource={invoice_list}
          columns={columnDefinitions}
          loading={loading}
          onSort={onSort}
          totalData={invoice_pagination?.totalElements || 0}
          tableScrolled={{ x: 1500, y: 500 }}
          useSelect={true}
          usePagination={false}
          useInfiniteScroll={true}
          onLoadMore={handleLoadMore}
          hasMore={
            invoice_list.length < (invoice_pagination?.totalElements || 0)
          }
          showRefresh={true}
          onRefresh={handleRefresh}
          refreshLabel="Refresh"
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
        />
      </CardContainer>

      {/* Modals */}
      <InvoiceDetailModal
        visible={detailModalVisible}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedInvoice(null);
        }}
        invoiceData={selectedInvoice}
      />

      <StampingRequestModal
        visible={stampingModalVisible}
        onClose={() => {
          setStampingModalVisible(false);
          setSelectedInvoice(null);
        }}
        invoiceData={selectedInvoice}
        onSubmit={handleStampingSubmit}
        loading={stampingLoading}
      />

      <ProcessSigningModal
        visible={signingModalVisible}
        onClose={() => {
          setSigningModalVisible(false);
          setSelectedInvoice(null);
        }}
        invoiceData={selectedInvoice}
        onSubmit={handleSigningSubmit}
        loading={signingLoading}
        requiresApprovalForDigital={isManualStamp(selectedInvoice)}
      />

      {/* Modal Approval E-Meterai */}
      <ModalApprovalEMeterai
        isOpen={modalApproval}
        handleClose={closeModalApproval}
        onSuccess={() => {
          closeModalApproval();
          fetchInvoices();
        }}
      />

      {/* Modal Approval History */}
      <ModalHistory
        isOpen={modalApprovalHistory}
        handleClose={() => setModalApprovalHistory(false)}
        header={"Approval History"}
        width={1000}
        tabOptions={APPROVAL_HISTORY_TABS}
        dataApprover={dataApprovalHistory?.dataApprover}
        dataHistory={dataApprovalHistory?.dataHistory}
      />
    </>
  );
};

export default EMeteraiManagement;
