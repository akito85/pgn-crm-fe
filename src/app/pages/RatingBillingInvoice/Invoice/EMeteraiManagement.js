// EMeteraiManagement.js
import React, { useState, useEffect, useCallback } from "react";
import { message, Dropdown } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { DownOutlined, CheckOutlined, PlusOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../components/BreadCrumb";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import ButtonComponent from "../../../../components/ButtonComponent";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import StampingRequestModal from "./_components/StampingRequestModal";
import ProcessSigningModal from "./_components/ProcessingSigningModal";
import InvoiceDetailModal from "./_components/InvoiceDetailModal";
import ModalApprovalEMeterai from "./_components/ModalApprovalEMeterai";
import ModalRequestApprovalEMeterai from "./_components/ModalRequestApprovalEMeterai";
import { getEMeteraiColumns } from "./_components/EMeteraiColumns";
import {
  getAllEMeteraiInvoices,
  createStampingRequest,
  uploadManualStamping,
  uploadManualSigning,
  getApprovalHistory,
} from "../../../../redux/slices/rating_billing_invoice/emeterai";

const EMeteraiManagement = () => {
  const dispatch = useDispatch();

  // Redux state
  const {
    invoice_list,
    invoice_pagination,
    loading,
    stampingLoading,
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
  const [modalRequest, setModalRequest] = useState(false);
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
      // Lowercase keys to match ModalHistory tab lookup behaviour
      const dataApprover = Object.fromEntries(
        Object.entries(rawApprover).map(([k, v]) => [k.toLowerCase(), v]),
      );
      const dataHistory = Object.fromEntries(
        Object.entries(rawHistory).map(([k, v]) => [k.toLowerCase(), v]),
      );
      setDataApprovalHistory({ dataApprover, dataHistory });
    } else {
      setDataApprovalHistory({});
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

  // Handle stamping submission
  const handleStampingSubmit = async (submissionData) => {
    console.log(submissionData.stampingMethod);
    try {
      if (submissionData.stampingMethod === "e-stamping") {
        const payload = {
          invoiceNumber: submissionData.invoiceNumber,
          jenisDoc: "invoice",
          visLLX: "10",
          visLLY: "10",
          visURX: "500",
          visURY: "700",
          pageStamp: "1",
          jenisIdentitas: "Test Jenis",
          noIdentitas: "123456789",
          namaIdentitas: "Test User",
          kopur: "1",
          remark: "Test stamp",
        };

        await dispatch(createStampingRequest(payload)).unwrap();
      } else if (submissionData.stampingMethod === "manual") {
        const payload = {
          invoiceNumber: submissionData.invoiceNumber,
          file: submissionData.files?.[0] || submissionData.file,
          remark: submissionData.remark,
          apphierId: submissionData.apphierId,
        };

        await dispatch(uploadManualStamping(payload)).unwrap();
      }

      setStampingModalVisible(false);
      setSelectedInvoice(null);
      fetchInvoices();

      message.success(
        submissionData.stampingMethod === "e-stamping"
          ? "E-Stamping request submitted successfully!"
          : "Manual stamping uploaded successfully!",
      );
    } catch (error) {
      console.error("❌ Stamping Submission Error:", error);
    }
  };

  // Handle signing submission
  const handleSigningSubmit = async (signingData) => {
    const { invoiceNumber, signingMethod, file, remark, apphierId } =
      signingData;

    try {
      if (signingMethod === "digital") {
        await dispatch(
          createStampingRequest({
            invoiceNumber,
            signingMethod,
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

  // Sort Handler
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter && sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "billingPeriod~desc";
    setSort(dataSort);
  };

  // Bulk Action Handlers
  const handleBulkApproval = () => {
    setModalApproval(true);
  };

  const handleBulkRequest = () => {
    setModalRequest(true);
  };

  const closeModalApproval = () => {
    setModalApproval(false);
  };

  const closeModalRequest = () => {
    setModalRequest(false);
  };

  const handleRefreshBtn = () => {
    fetchInvoices();
  };

  // const transformedData = getTransformedData();

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
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "request",
                      label: "Request Approval",
                      icon: <PlusOutlined style={{ color: "#52c41a" }} />,
                      onClick: handleBulkRequest,
                    },
                    {
                      type: "divider",
                    },
                    {
                      key: "approval",
                      label: "Approval",
                      icon: <CheckOutlined style={{ color: "#1890ff" }} />,
                      onClick: handleBulkApproval,
                    },
                  ],
                }}
                trigger={["click"]}
              >
                <ButtonComponent
                  type="primary"
                  icon={<DownOutlined width={20} />}
                >
                  Approval Configuration
                </ButtonComponent>
              </Dropdown>
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
        loading={stampingLoading}
      />

      {/* Modal Approval E-Meterai */}
      <ModalApprovalEMeterai
        isOpen={modalApproval}
        handleClose={closeModalApproval}
        onSuccess={() => {
          closeModalApproval();
          handleRefreshBtn();
        }}
      />

      {/* Modal Request Approval E-Meterai */}
      <ModalRequestApprovalEMeterai
        isOpen={modalRequest}
        handleClose={closeModalRequest}
        onSuccess={() => {
          closeModalRequest();
          handleRefreshBtn();
        }}
      />

      {/* Modal Approval History */}
      <ModalHistory
        isOpen={modalApprovalHistory}
        handleClose={() => setModalApprovalHistory(false)}
        header={"Approval History"}
        width={1000}
        tabOptions={Object.keys(dataApprovalHistory?.dataApprover || {}).map(
          (key) => ({
            value: key,
            label: key
              .toLowerCase()
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
          }),
        )}
        dataApprover={dataApprovalHistory?.dataApprover}
        dataHistory={dataApprovalHistory?.dataHistory}
      />
    </>
  );
};

export default EMeteraiManagement;
