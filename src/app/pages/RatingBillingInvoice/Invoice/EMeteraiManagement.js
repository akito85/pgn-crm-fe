// EMeteraiManagement.js
import React, { useState, useEffect } from "react";
import { message, Dropdown } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { DownOutlined, CheckOutlined, PlusOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../components/BreadCrumb";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import ButtonComponent from "../../../../components/ButtonComponent";
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
} from "../../../../redux/slices/rating_billing_invoice/emeterai";

const EMeteraiManagement = () => {
  const dispatch = useDispatch();

  // Redux state
  const {
    data: DATA_INVOICE,
    loading,
    stampingLoading,
    pageInfo,
  } = useSelector((state) => state.emeterai);

  // Local state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState("billPeriod~desc");

  // Modal states
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [stampingModalVisible, setStampingModalVisible] = useState(false);
  const [signingModalVisible, setSigningModalVisible] = useState(false);
  const [modalApproval, setModalApproval] = useState(false);
  const [modalRequest, setModalRequest] = useState(false);

  // Selected invoice
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Fixed column settings
  const [fixedColumns, setFixedColumns] = useState({
    left: ["invoiceNumber"],
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
    fetchInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sort]);

  const fetchInvoices = () => {
    dispatch(
      getAllEMeteraiInvoices({
        page: page,
        pageSize,
        search: "",
        sort: sort,
      })
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
          : "Manual stamping uploaded successfully!"
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
          })
        ).unwrap();
      } else if (signingMethod === "manual") {
        await dispatch(
          uploadManualSigning({
            invoiceNumber,
            file,
            remark: remark || "Manual signing upload",
            apphierId,
          })
        ).unwrap();
      }

      setSigningModalVisible(false);
      setSelectedInvoice(null);
      fetchInvoices();
    } catch (error) {
      console.error("❌ Signing Submission Error:", error);
    }
  };

  // Handle pagination change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSizeChange = (current, size) => {
    setPage(1);
    setPageSize(size);
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

  const handleRefresh = () => {
    fetchInvoices();
  };

  // const transformedData = getTransformedData();

  // Get columns with handlers
  const columnDefinitions = getEMeteraiColumns({
    onDetails: handleDetails,
    onProcessStamping: handleProcessStamping,
    onProcessSigning: handleProcessSigning,
    onRetry: handleRetry,
  });

  return (
    <>
      <BreadCrumb routes={routes} />

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold">E-Meterai Management</p>
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
                <ButtonComponent type="default">
                  Approval Configuration <DownOutlined />
                </ButtonComponent>
              </Dropdown>
            </div>
          </div>
        }
      >
        {/* Table with TableRBI */}
        <TableRBI
          idTable="emeterai-management-table"
          dataSource={DATA_INVOICE || []}
          columns={columnDefinitions}
          loading={loading}
          pageSize={pageSize}
          current={page}
          onChange={handlePageChange}
          onSizeChanger={handleSizeChange}
          onSort={onSort}
          totalData={pageInfo.totalElements || 0}
          tableScrolled={{ x: 1500, y: 500 }}
          useSelect={true}
          usePagination={true}
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
          handleRefresh();
        }}
      />

      {/* Modal Request Approval E-Meterai */}
      <ModalRequestApprovalEMeterai
        isOpen={modalRequest}
        handleClose={closeModalRequest}
        onSuccess={() => {
          closeModalRequest();
          handleRefresh();
        }}
      />
    </>
  );
};

export default EMeteraiManagement;
