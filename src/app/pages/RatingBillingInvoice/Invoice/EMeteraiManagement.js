import React, { useState, useEffect } from "react";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import CardContainer from "../../../../components/CardContainer";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import InvoiceProcessingTable from "./_components/InvoiceProcessingTable";
import StampingRequestModal from "./_components/StampingRequestModal";
import ProcessSigningModal from "./_components/ProcessingSigningModal";
import InvoiceDetailModal from "./_components/InvoiceDetailModal";
import {
  getAllEMeteraiInvoices,
  createStampingRequest,
  uploadManualStamping,
  uploadManualSigning,
} from "../../../../redux/slices/rating_billing_invoice/emeterai";

const EMeteraiManagement = () => {
  const dispatch = useDispatch();

  // Redux state
  const { data, loading, stampingLoading, pageInfo } = useSelector(
    (state) => state.emeterai
  );

  // Local state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState(null);

  // Modal states
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [stampingModalVisible, setStampingModalVisible] = useState(false);
  const [signingModalVisible, setSigningModalVisible] = useState(false);

  // Selected invoice
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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
  }, [page, pageSize, filters]);

  const fetchInvoices = () => {
    dispatch(
      getAllEMeteraiInvoices({
        page: page, // API uses 0-based index
        pageSize,
        search: "",
        sort: "billingPeriod~desc",
        filters: filters,
      })
    );
  };

  // Transform API data to match table format
  const getTransformedData = () => {
    return data.map((invoice) => ({
      ...invoice,
      // Map API fields to table display format
      invoiceNumber: invoice.invoiceNumber,
      customer: invoice.customerName,
      customerNumber: invoice.customerNumber,
      accountNumber: invoice.accountNumber,
      accountName: invoice.accountName,
      issueDate: invoice.billingPeriod || "-",
      amount: invoice.totalAmountEqvIdr,

      // Stamping status mapping
      stampingStatus: invoice.stampStatus || "Not Processed",
      stampType: invoice.stampType,
      stampRequestDate: invoice.stampRequestDate,
      stampCompletionDate: invoice.stampCompletionDate,
      stampRemark: invoice.stampRemark,

      // Signing status mapping
      signingStatus: invoice.signStatus || "Not Processed",
      signType: invoice.signType,
      signRequestDate: invoice.signRequestDate,
      signCompletionDate: invoice.signCompletionDate,
      signRemark: invoice.signRemark,

      // For backward compatibility with table component
      stamping: {
        status: invoice.stampStatus || "Not Processed",
        method: invoice.stampType,
        requested: invoice.stampRequestDate,
        completed: invoice.stampCompletionDate,
        remark: invoice.stampRemark,
      },
      signing: {
        status: invoice.signStatus || "Not Processed",
        requested: invoice.signRequestDate,
        completed: invoice.signCompletionDate,
        remark: invoice.signRemark,
      },
    }));
  };

  // Handlers
  const handleDetails = (record) => {
    console.log("👁️ View details:", record);
    if (record) {
      setSelectedInvoice(record);
      setDetailModalVisible(true);
    } else {
      message.error("Invoice data not available");
    }
  };

  const handleProcessSigning = (record) => {
    console.log("✍️ Process signing:", record);
    if (record) {
      setSelectedInvoice(record);
      setSigningModalVisible(true);
    } else {
      message.error("Invoice data not available");
    }
  };

  const handleRetry = (record) => {
    console.log("🔄 Retry stamping:", record);
    if (record) {
      setSelectedInvoice(record);
      setStampingModalVisible(true);
    } else {
      message.error("Invoice data not available");
    }
  };

  const handleProcessStamping = (record) => {
    console.log("📋 Process stamping:", record);
    if (record) {
      setSelectedInvoice(record);
      setStampingModalVisible(true);
    } else {
      message.error("Invoice data not available");
    }
  };

  // Handle stamping submission - UPDATED
  const handleStampingSubmit = async (submissionData) => {
    try {
      console.log("📤 Processing stamping submission:", submissionData);

      if (submissionData.stampingMethod === "e-stamping") {
        // E-Meterai Digital - HARDCODED PAYLOAD
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

        console.log("🌐 Submitting E-Stamping Request with payload:", payload);
        await dispatch(createStampingRequest(payload)).unwrap();
      } else if (submissionData.stampingMethod === "manual") {
        // Manual stamping
        const payload = {
          invoiceNumber: submissionData.invoiceNumber,
          file: submissionData.file,
          remark: submissionData.remark,
        };

        console.log(
          "📁 Submitting Manual Stamping with file:",
          payload.file?.name
        );
        await dispatch(uploadManualStamping(payload)).unwrap();
      }

      // Close modal and reset state
      setStampingModalVisible(false);
      setSelectedInvoice(null);

      // Refresh invoice list
      fetchInvoices();

      message.success(
        submissionData.stampingMethod === "e-stamping"
          ? "E-Stamping request submitted successfully!"
          : "Manual stamping uploaded successfully!"
      );
    } catch (error) {
      console.error("❌ Stamping Submission Error:", error);
      // Error message already shown by slice
    }
  };

  // Handle signing submission
  const handleSigningSubmit = async (signingData) => {
    const { invoiceNumber, signingMethod, file, remark } = signingData;

    try {
      if (signingMethod === "e-signing") {
        console.log("🌐 Submitting E-Signing Request...");

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

      // Close modal
      setSigningModalVisible(false);
      setSelectedInvoice(null);

      // Manually refresh data after successful submission
      fetchInvoices();
    } catch (error) {
      console.error("❌ Signing Submission Error:", error);
      // Error message already shown by slice
    }
  };

  // Handle pagination change
  const handlePageChange = (newPage, newPageSize) => {
    console.log("📄 Page changed:", { newPage, newPageSize });

    // If page size changes, reset to page 1
    if (newPageSize !== pageSize) {
      setPage(1);
      setPageSize(newPageSize);
    } else {
      setPage(newPage);
    }
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    console.log("🔍 Filters changed:", newFilters);
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const transformedData = getTransformedData();

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
        <div className="flex flex-col gap-4 w-full">
          <InvoiceProcessingTable
            dataSource={transformedData}
            loading={loading}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: pageInfo.totalElements,
              onChange: handlePageChange,
            }}
            onDetails={handleDetails}
            onProcessSigning={handleProcessSigning}
            onRetry={handleRetry}
            onProcessStamping={handleProcessStamping}
            onFilterChange={handleFilterChange}
          />
        </div>
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
