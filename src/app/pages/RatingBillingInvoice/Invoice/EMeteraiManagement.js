import React, { useState } from "react";
import { Spin } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BaseContainer from "../../../../components/BaseContainer";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import InvoiceProcessingTable from "./_components/InvoiceProcessingTable";
import StampingRequestModal from "./_components/StampingRequestModal";
import ProcessSigningModal from "./_components/ProcessingSigningModal";
import InvoiceDetailModal from "./_components/InvoiceDetailModal";

// Data Dummy untuk Invoice Processing
const invoiceProcessingData = [
  {
    invoiceNumber: "INV/X/001",
    customer: "PT. Gas Nusantara",
    issueDate: "01-10-2025",
    dueDate: "31-10-2025",
    amount: 150000000,
    stampingStatus: "Pending Approval",
    signingStatus: "Not Processed",
    stamping: {
      status: "Pending Approval",
      method: "E-Stamping",
      requested: "2025-10-01 14:30",
    },
    signing: {
      status: "Not Processed",
    },
    approval: {
      status: "Pending",
      by: "manager.finance",
      date: "2025-10-01 16:00",
      reason: "",
    },
    documents: [
      { name: "Original Invoice", disabled: false },
      { name: "Stamped Document", disabled: true },
      { name: "Final Document", disabled: true },
    ],
  },
  {
    invoiceNumber: "INV/X/002",
    customer: "CV. Energi Prima",
    issueDate: "01-10-2025",
    dueDate: "31-10-2025",
    amount: 25000000,
    stampingStatus: "Success",
    signingStatus: "Not Processed",
    stamping: {
      status: "Success",
      method: "E-Stamping",
      requested: "2025-10-01 10:00",
    },
    signing: {
      status: "Not Processed",
    },
    approval: {
      status: "Approved",
      by: "manager.finance",
      date: "2025-10-01 11:00",
      reason: "",
    },
    documents: [
      { name: "Original Invoice", disabled: false },
      { name: "Stamped Document", disabled: false },
      { name: "Final Document", disabled: true },
    ],
  },
  {
    invoiceNumber: "INV/X/003",
    customer: "PT. Industri Maju",
    issueDate: "02-10-2025",
    dueDate: "31-10-2025",
    amount: 75000000,
    stampingStatus: "Failed",
    signingStatus: "Not Processed",
    stamping: {
      status: "Failed",
      method: "E-Stamping",
      requested: "2025-10-02 09:00",
    },
    signing: {
      status: "Not Processed",
    },
    approval: {
      status: "Rejected",
      by: "manager.finance",
      date: "2025-10-02 10:00",
      reason: "Stamp verification failed, please retry.",
    },
    documents: [
      { name: "Original Invoice", disabled: false },
      { name: "Stamped Document", disabled: true },
      { name: "Final Document", disabled: true },
    ],
  },
  {
    invoiceNumber: "INV/X/004",
    customer: "PT. Sinergi Gas",
    issueDate: "03-10-2025",
    dueDate: "31-10-2025",
    amount: 10000000,
    stampingStatus: "Not Processed",
    signingStatus: "Not Processed",
    stamping: {
      status: "Not Processed",
      method: "",
      requested: "",
    },
    signing: {
      status: "Not Processed",
    },
    approval: {
      status: "Pending",
      by: "",
      date: "",
      reason: "",
    },
    documents: [
      { name: "Original Invoice", disabled: false },
      { name: "Stamped Document", disabled: true },
      { name: "Final Document", disabled: true },
    ],
  },
  {
    invoiceNumber: "INV/X/005",
    customer: "PT. Telkom Indonesia",
    issueDate: "04-10-2025",
    dueDate: "31-10-2025",
    amount: 200000000,
    stampingStatus: "Success",
    signingStatus: "Success",
    stamping: {
      status: "Success",
      method: "E-Stamping",
      requested: "2025-10-04 08:00",
    },
    signing: {
      status: "Success",
    },
    approval: {
      status: "Approved",
      by: "manager.finance",
      date: "2025-10-04 09:00",
      reason: "",
    },
    documents: [
      { name: "Original Invoice", disabled: false },
      { name: "Stamped Document", disabled: false },
      { name: "Final Document", disabled: false },
    ],
  },
];

const EMeteraiManagement = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource] = useState(invoiceProcessingData);

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

  // Handlers
  const handleDetails = (record) => {
    console.log("View details:", record);
    setSelectedInvoice(record);
    setDetailModalVisible(true);
  };

  const handleProcessSigning = (record) => {
    console.log("Process signing:", record);
    setSelectedInvoice(record);
    setSigningModalVisible(true);
  };

  const handleRetry = (record) => {
    console.log("Retry stamping:", record);
    setSelectedInvoice(record);
    setStampingModalVisible(true);
  };

  const handleProcessStamping = (record) => {
    console.log("Process stamping:", record);
    setSelectedInvoice(record);
    setStampingModalVisible(true);
  };

  return (
    <Spin spinning={loading}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />

        <BaseContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold">E-Meterai Management</p>
            </div>
          }
        >
          <div className="flex flex-col gap-4 w-full">
            <InvoiceProcessingTable
              dataSource={dataSource}
              loading={loading}
              onDetails={handleDetails}
              onProcessSigning={handleProcessSigning}
              onRetry={handleRetry}
              onProcessStamping={handleProcessStamping}
            />
          </div>
        </BaseContainer>

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
        />

        <ProcessSigningModal
          visible={signingModalVisible}
          onClose={() => {
            setSigningModalVisible(false);
            setSelectedInvoice(null);
          }}
          invoiceData={selectedInvoice}
        />
      </LayoutMenu>
    </Spin>
  );
};

export default EMeteraiManagement;
