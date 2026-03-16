import React, { useEffect, useState } from "react";
import { Modal, Button, Spin, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined, DownOutlined } from "@ant-design/icons";
import CollapsibleContainer from "../../../../../components/CollapsibleContainer";
import StatusComponent from "../../../../../components/StatusComponent";
import LogDetailModal from "./ManagementDeliveryComponent/LogDetailModal";
import { getDeliveryDetail, resendDelivery } from "../../../../../redux/slices/rating_billing_invoice/managementDeliveryInvoice";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount, prefix = "Rp") => {
  if (amount == null) return "-";
  return `${prefix} ${Number(amount).toLocaleString("id-ID")}`;
};

const InfoField = ({ label, value }) => (
  <div className="mb-3">
    <div className="text-xs text-gray-400 mb-1">{label}</div>
    <div className="text-sm font-medium text-gray-800">{value || "-"}</div>
  </div>
);

const DeliveryCard = ({ delivery, index, onViewLog, onResend }) => {
  const [open, setOpen] = useState(true);
  const isFailed = delivery.deliveryStatus?.toUpperCase() === "FAILED";
  const borderColor = isFailed ? "#ff4d4f" : "#52c41a";

  return (
    <div
      className="rounded-lg mb-3 overflow-hidden"
      style={{
        border: "1px solid #E5E7EB",
        borderLeft: `4px solid ${borderColor}`,
      }}
    >
      {/* Card Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
        style={{ backgroundColor: "#FAFAFA" }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span
          className="text-sm font-bold"
          style={{ color: borderColor, minWidth: 48 }}
        >
          #{delivery.deliveryId}
        </span>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onViewLog(delivery);
            }}
          >
            Log History
          </Button>
          <Tooltip
            title={!isFailed ? "Resend hanya tersedia untuk status FAILED" : ""}
          >
            <Button
              size="small"
              type="primary"
              danger
              disabled={!isFailed}
              onClick={(e) => {
                e.stopPropagation();
                onResend(delivery);
              }}
            >
              Resend
            </Button>
          </Tooltip>
          <DownOutlined
            style={{
              fontSize: 11,
              color: "#6B7280",
              transition: "transform 0.2s ease",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              marginLeft: 4,
            }}
          />
        </div>
      </div>

      {/* Card Content */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? "500px" : "0px",
          transition: "max-height 0.3s ease",
          backgroundColor: "#fff",
        }}
      >
        <div className="grid grid-cols-4 gap-x-6 gap-y-2 px-4 py-3">
          <InfoField
            label="Delivery Services"
            value={delivery.deliveryChannel}
          />
          <InfoField label="Receiver" value={delivery.recipientAddress} />
          <InfoField
            label="Status"
            value={
              delivery.deliveryStatus ? (
                <StatusComponent size="small" colour={delivery.deliveryStatus}>
                  {delivery.deliveryStatus}
                </StatusComponent>
              ) : (
                ""
              )
            }
          />
          <InfoField
            label="Send Date"
            value={formatDateTime(delivery.sentDtm)}
          />
        </div>

        {delivery.responseMessage && (
          <div className="mx-4 mb-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            <strong>Response:</strong> {delivery.responseMessage}
          </div>
        )}
      </div>
    </div>
  );
};

const DetailInvoiceModal = ({ visible, onCancel, invoiceData }) => {
  const dispatch = useDispatch();
  const { data_detail, loading_detail } = useSelector(
    (state) => state.managementDeliveryInvoice,
  );

  const [logModalVisible, setLogModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    if (visible && invoiceData?.invoiceNumber) {
      dispatch(getDeliveryDetail(invoiceData.invoiceNumber));
    }
  }, [visible, invoiceData?.invoiceNumber, dispatch]);

  const { customerInfo, invoiceInfo, deliveryDetails } = data_detail || {};

  const handleResend = (delivery) => {
    Modal.confirm({
      title: "Konfirmasi Kirim Ulang",
      content: `Kirim ulang invoice ke ${delivery.recipientAddress} via ${delivery.deliveryChannel}?`,
      okText: "Ya, Kirim Ulang",
      cancelText: "Batal",
      onOk() {
        return dispatch(resendDelivery(delivery.deliveryId)).then((action) => {
          if (action.meta.requestStatus === "fulfilled") {
            dispatch(getDeliveryDetail(invoiceData.invoiceNumber));
          }
        });
      },
    });
  };

  return (
    <Modal
      title={
        <span className="text-base font-semibold text-primary">
          Detail Invoice: {invoiceData?.invoiceNumber || "-"}
        </span>
      }
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={
        <Button type="primary" onClick={onCancel}>
          Cancel
        </Button>
      }
      closable={true}
      style={{ top: 20 }}
      styles={{
        header: { backgroundColor: "#F5F5F5" },
        body: { maxHeight: "calc(100vh - 200px)", overflowY: "auto" },
      }}
    >
      <Spin spinning={loading_detail} indicator={<LoadingOutlined spin />}>
        {/* ── Section 1: Customer Information ── */}
        <CollapsibleContainer
          border
          header="Customer Information"
          className="mb-4"
        >
          <div className="grid grid-cols-4 gap-x-6 gap-y-2 py-3">
            <InfoField
              label="Customer Name"
              value={customerInfo?.customerName}
            />
            <InfoField label="SOR" value={customerInfo?.sor} />
            <InfoField label="Cost Center" value={customerInfo?.costCenter} />
            <InfoField
              label="Meter Reading Code"
              value={customerInfo?.meterReadingCode}
            />
            <InfoField
              label="Account Group Type"
              value={customerInfo?.accountGroupType}
            />
            <InfoField
              label="Account Segment"
              value={customerInfo?.accountSegment}
            />
          </div>
        </CollapsibleContainer>

        {/* ── Section 2: Invoice Information ── */}
        <CollapsibleContainer
          border
          header="Invoice Information"
          className="mb-4"
        >
          <div className="grid grid-cols-4 gap-x-6 gap-y-2 py-3">
            <InfoField
              label="Invoice Number"
              value={invoiceInfo?.invoiceNumber}
            />
            <InfoField
              label="Invoice Date"
              value={formatDate(invoiceInfo?.invoiceDate)}
            />
            <InfoField
              label="Due Date"
              value={formatDate(invoiceInfo?.dueDate)}
            />
            <InfoField
              label="Total Amount (IDR)"
              value={formatCurrency(invoiceInfo?.totalAmount)}
            />
            <InfoField
              label="Total Amount (USD)"
              value={formatCurrency(invoiceInfo?.totalAmountEqv, "$")}
            />
            <InfoField
              label="Status Invoice"
              value={
                invoiceInfo?.paymentStatus ? (
                  <StatusComponent
                    size="small"
                    colour={invoiceInfo.paymentStatus}
                  >
                    {invoiceInfo.paymentStatus}
                  </StatusComponent>
                ) : (
                  "-"
                )
              }
            />
          </div>
        </CollapsibleContainer>

        {/* ── Section 3: Delivery History ── */}
        <CollapsibleContainer border header="Delivery History" className="mb-4">
          <div className="py-3">
            {!deliveryDetails?.length ? (
              <div className="text-center text-gray-400 py-4 text-sm">
                No delivery history found.
              </div>
            ) : (
              deliveryDetails.map((delivery, idx) => (
                <DeliveryCard
                  key={delivery.deliveryId ?? idx}
                  delivery={delivery}
                  index={idx}
                  onViewLog={(d) => {
                    setSelectedLog(d);
                    setLogModalVisible(true);
                  }}
                  onResend={handleResend}
                />
              ))
            )}
          </div>
        </CollapsibleContainer>
      </Spin>

      <LogDetailModal
        visible={logModalVisible}
        onCancel={() => {
          setLogModalVisible(false);
          setSelectedLog(null);
        }}
        logData={selectedLog}
      />
    </Modal>
  );
};

export default DetailInvoiceModal;
