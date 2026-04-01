// _components/InvoiceDetailModal.js
import React, { useMemo, useState, useEffect } from "react";
import { Modal, Button, Table } from "antd";
import {
  CloseOutlined,
  HistoryOutlined,
  DownloadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../components/ButtonComponent";
import {
  getInvoiceActivityLogs,
  getInvoiceDetail,
  downloadOriginalInvoice,
  downloadStampedInvoice,
  downloadSignedInvoice,
} from "../../../../../redux/slices/rating_billing_invoice/emeterai";
import moment from "moment";
import CardContainer from "../../../../../components/CardContainer";
import StatusComponent from "../../../../../components/StatusComponent";

const InvoiceDetailModal = ({ visible, onClose, invoiceData }) => {
  const dispatch = useDispatch();
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [logPage, setLogPage] = useState(1);
  const [logPageSize, setLogPageSize] = useState(10);

  // Get log data from Redux
  const {
    detailData,
    detailLoading,
    logData,
    logLoading,
    logPageInfo,
    downloadLoading,
  } = useSelector((state) => state.emeterai);

  // Fetch detail from API when modal opens
  useEffect(() => {
    if (visible && invoiceData?.invoiceNumber) {
      dispatch(getInvoiceDetail({ invoiceNumber: invoiceData.invoiceNumber }));
    }
  }, [visible, invoiceData?.invoiceNumber, dispatch]);

  // Safe invoice data with proper fallback using useMemo
  const invoice = useMemo(() => {
    const source = detailData;
    if (!source) {
      return {
        invoiceNumber: "-",
        customerName: "-",
        accountNumber: "-",
        accountName: "-",
        billPeriod: "-",
        invoiceDate: "-",
        totalAmountEqvIdr: 0,
        stampStatus: "Not Processed",
        signStatus: "Not Processed",
        recordId: "-",
        createdDate: "-",
        createdBy: "-",
        updatedBy: "-",
      };
    }

    return {
      invoiceNumber: source.invoiceNumber || "-",
      customerName: source.customerName || "-",
      accountNumber: source.accountNumber || "-",
      accountName: source.accountName || "-",
      billPeriod: source.billPeriod || "-",
      invoiceDate: source.invoiceDate || "-",
      totalAmountEqvIdr: source.totalAmountEqvIdr || 0,
      stampStatus: source.stampStatus || "Not Processed",
      signStatus: source.signStatus || "Not Processed",
      recordId: source.recordId || source.id || "-",
      createdDate: source.createdDate || "-",
      createdBy: source.createdBy || "-",
      updatedBy: source.updatedBy || source.modifiedBy || "-",
    };
  }, [detailData]);

  const formatAmount = (amount) => {
    if (typeof amount === "number") {
      return `${new Intl.NumberFormat("id-ID").format(amount)} IDR`;
    }
    return amount;
  };

  const formatDateTime = (dateString) => {
    if (!dateString || dateString === "-") return "-";
    return moment(dateString).format("DD MMM YYYY HH:mm:ss");
  };

  // Fetch activity logs when showing activity log view
  useEffect(() => {
    if (showActivityLog && invoiceData?.invoiceNumber) {
      dispatch(
        getInvoiceActivityLogs({
          invoiceNumber: invoiceData.invoiceNumber,
          page: logPage,
          pageSize: logPageSize,
        }),
      );
    }
  }, [
    showActivityLog,
    invoiceData?.invoiceNumber,
    logPage,
    logPageSize,
    dispatch,
  ]);

  const handleClose = () => {
    setShowActivityLog(false);
    onClose();
  };

  const handleViewLog = () => {
    setShowActivityLog(true);
  };

  const handleBackToDetail = () => {
    setShowActivityLog(false);
  };

  // Handle download functions
  const handleDownloadOriginal = async () => {
    if (invoiceData?.invoiceNumber) {
      await dispatch(
        downloadOriginalInvoice({
          invoiceNumber: invoiceData.invoiceNumber,
        }),
      );
    }
  };

  const handleDownloadStamped = async () => {
    if (invoiceData?.invoiceNumber) {
      await dispatch(
        downloadStampedInvoice({
          invoiceNumber: invoiceData.invoiceNumber,
        }),
      );
    }
  };

  const handleDownloadSigned = async () => {
    if (invoiceData?.invoiceNumber) {
      await dispatch(
        downloadSignedInvoice({
          invoiceNumber: invoiceData.invoiceNumber,
        }),
      );
    }
  };

  // Handle pagination change for logs
  const handleLogTableChange = (pagination) => {
    setLogPage(pagination.current);
    setLogPageSize(pagination.pageSize);
  };

  // Table columns for activity logs
  const logColumns = [
    {
      title: "Timestamp",
      dataIndex: "createdDtm",
      key: "createdDtm",
      width: 180,
      render: (text) => formatDateTime(text),
    },
    {
      title: "User",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 150,
    },
    {
      title: "Activity",
      dataIndex: "activity",
      key: "activity",
      ellipsis: true,
    },
  ];

  // Render information row
  const InfoRow = ({ label, value, valueBold = false, valueColor }) => (
    <div className="flex flex-col mb-2">
      <div className="w-full">
        <p className="text-sm text-gray-600">{label}</p>
      </div>
      <div className="w-full">
        <p
          className={`text-sm ${valueBold ? "font-bold" : "font-normal"}`}
          style={valueColor ? { color: valueColor } : {}}
        >
          {value || "-"}
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      visible={visible}
      onCancel={handleClose}
      width={800}
      footer={null}
      closeIcon={<CloseOutlined />}
      bodyStyle={{ padding: "16px", maxHeight: "80vh", overflowY: "auto" }}
      destroyOnClose
      title={
        <div className="text-md uppercase text-primary">INVOICE DETAIL</div>
      }
    >
      {detailLoading ? (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <p>Loading invoice details...</p>
        </div>
      ) : showActivityLog ? (
        // ACTIVITY LOG VIEW
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <p>Activity Logs</p>

            <Table
              columns={logColumns}
              dataSource={logData}
              loading={logLoading}
              rowKey={(record, index) => record.id || index}
              pagination={{
                current: logPage,
                pageSize: logPageSize,
                total: logPageInfo?.totalElements || 0,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} items`,
                pageSizeOptions: ["10", "20", "50", "100"],
              }}
              onChange={handleLogTableChange}
              scroll={{ x: 800 }}
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 mt-3">
            <ButtonComponent
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={handleBackToDetail}
            >
              Back to Detail
            </ButtonComponent>
            <ButtonComponent type="default" onClick={handleClose}>
              Close
            </ButtonComponent>
          </div>
        </div>
      ) : (
        // DETAIL VIEW
        <div className="space-y-3">
          {/* GENERAL INFORMATION */}
          <BaseContainer header="GENERAL INFORMATION" border={true}>
            <div className="grid grid-cols-5 space-x-2">
              <InfoRow label="Invoice #" value={invoice.invoiceNumber} />
              <InfoRow label="Customer" value={invoice.customerName} />
              <InfoRow label="Issue Date" value={invoice.invoiceDate} />
              <InfoRow label="Due Date" value={invoice.invoiceDate} />
              <InfoRow
                label="Amount"
                value={formatAmount(invoice.totalAmountEqvIdr)}
              />
            </div>
          </BaseContainer>

          {/* PROCESSING STATUS */}
          <BaseContainer header="PROCESSING STATUS" border={true}>
            <div className="grid grid-cols-2 gap-x-4 pb-3">
              <div>
                <p className="text-sm font-semibold mb-1">Stamping Status</p>
                <StatusComponent
                  size="small"
                  colour={invoice.stampStatus?.toLowerCase()}
                >
                  {invoice.stampStatus}
                </StatusComponent>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Signing Status</p>
                <StatusComponent
                  size="small"
                  colour={invoice.signStatus?.toLowerCase()}
                >
                  {invoice.signStatus}
                </StatusComponent>
              </div>
            </div>
          </BaseContainer>

          {/* HISTORY LOG INFORMATION */}
          <BaseContainer header="HISTORY LOG INFORMATION" border={true}>
            <div className="grid grid-cols-2 gap-x-4">
              <div>
                <InfoRow label="Record ID" value={invoice.recordId} />
                <InfoRow label="Created By" value={invoice.createdBy} />
                <InfoRow label="Updated By" value={invoice.updatedBy} />
              </div>
              <div>
                <InfoRow
                  label="Created Date"
                  value={formatDateTime(invoice.createdDate)}
                />
                <InfoRow label="Created By" value={invoice.createdBy} />
              </div>
            </div>
          </BaseContainer>

          {/* DOCUMENT */}
          <BaseContainer header="DOCUMENT" border={true}>
            <div className="space-y-2 pb-3">
              {/* Download Original Document */}
              <Button
                icon={<DownloadOutlined />}
                size="middle"
                block
                loading={downloadLoading}
                onClick={handleDownloadOriginal}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  height: "36px",
                  fontSize: "14px",
                }}
              >
                Download Original Document
              </Button>

              {/* Download Stamped Document - only show if stamped */}
              {invoice.stampStatus === "SUCCESS" && (
                <Button
                  icon={<DownloadOutlined />}
                  size="middle"
                  block
                  loading={downloadLoading}
                  onClick={handleDownloadStamped}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    height: "36px",
                    fontSize: "14px",
                  }}
                >
                  Download Stamped Document
                </Button>
              )}

              {/* Download Signed Document - only show if signed */}
              {invoice.signStatus === "SUCCESS" && (
                <Button
                  icon={<DownloadOutlined />}
                  size="middle"
                  block
                  loading={downloadLoading}
                  onClick={handleDownloadSigned}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    height: "36px",
                    fontSize: "14px",
                  }}
                >
                  Download Signed Document
                </Button>
              )}
            </div>
          </BaseContainer>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 mt-3">
            <ButtonComponent type="default" onClick={handleClose}>
              Cancel
            </ButtonComponent>
            <ButtonComponent
              type="default"
              isPrimary
              icon={
                <HistoryOutlined
                  style={{
                    fontSize: "15px",
                    paddingTop: "5px",
                    paddingRight: "5px",
                  }}
                />
              }
              onClick={handleViewLog}
            >
              View Log
            </ButtonComponent>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default InvoiceDetailModal;
