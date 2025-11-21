// EMeteraiManagement.js
import React, { useState, useEffect } from "react";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import StampingRequestModal from "./_components/StampingRequestModal";
import ProcessSigningModal from "./_components/ProcessingSigningModal";
import InvoiceDetailModal from "./_components/InvoiceDetailModal";
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

  // Modal states
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [stampingModalVisible, setStampingModalVisible] = useState(false);
  const [signingModalVisible, setSigningModalVisible] = useState(false);

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
  }, [page, pageSize]);

  const fetchInvoices = () => {
    dispatch(
      getAllEMeteraiInvoices({
        page: page,
        pageSize,
        search: "",
        sort: "billingPeriod~desc",
      })
    );
  };

  // Transform API data to match table format
  // const getTransformedData = () => {
  //   return data.map((invoice, index) => ({
  //     ...invoice,
  //     key: invoice.invoiceNumber || index,
  //     invoiceNumber: invoice.invoiceNumber,
  //     customer: invoice.customerName,
  //     customerNumber: invoice.customerNumber,
  //     accountNumber: invoice.accountNumber,
  //     accountName: invoice.accountName,
  //     issueDate: invoice.billingPeriod || "-",
  //     amount: invoice.totalAmountEqvIdr,
  //     stampingStatus: invoice.stampStatus || "Not Processed",
  //     stampType: invoice.stampType,
  //     stampRequestDate: invoice.stampRequestDate,
  //     stampCompletionDate: invoice.stampCompletionDate,
  //     stampRemark: invoice.stampRemark,
  //     signingStatus: invoice.signStatus || "Not Processed",
  //     signType: invoice.signType,
  //     signRequestDate: invoice.signRequestDate,
  //     signCompletionDate: invoice.signCompletionDate,
  //     signRemark: invoice.signRemark,
  //     stamping: {
  //       status: invoice.stampStatus || "Not Processed",
  //       method: invoice.stampType,
  //       requested: invoice.stampRequestDate,
  //       completed: invoice.stampCompletionDate,
  //       remark: invoice.stampRemark,
  //     },
  //     signing: {
  //       status: invoice.signStatus || "Not Processed",
  //       requested: invoice.signRequestDate,
  //       completed: invoice.signCompletionDate,
  //       remark: invoice.signRemark,
  //     },
  //   }));
  // };

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
          file: submissionData.file,
          remark: submissionData.remark,
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
    const { invoiceNumber, signingMethod, file, remark } = signingData;

    try {
      if (signingMethod === "e-signing") {
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

  // const transformedData = getTransformedData();

  // Get columns with handlers
  const columnDefinitions = getEMeteraiColumns({
    onDetails: handleDetails,
    onProcessStamping: handleProcessStamping,
    onProcessSigning: handleProcessSigning,
    onRetry: handleRetry,
  });

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold">E-Meterai Management</p>
          </div>
        }
      >
        {/* Table with TableRBI */}
        <TableRBI
          idTable="emeterai-management-table"
          dataSource={DATA_INVOICE.result || []}
          columns={columnDefinitions}
          loading={loading}
          pageSize={pageSize}
          current={page}
          onChange={handlePageChange}
          onSizeChanger={handleSizeChange}
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
    </LayoutMenu>
  );
};

export default EMeteraiManagement;
