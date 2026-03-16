import React, { useEffect } from "react";
import { Modal, Button, Table, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getDeliveryLogs } from "../../../../../../redux/slices/rating_billing_invoice/managementDeliveryInvoice";

const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 90,
    render: (text) => (
      <span className="font-mono font-semibold text-primary">{text}</span>
    ),
  },
  {
    title: "Activity",
    dataIndex: "activity",
    key: "activity",
    width: 220,
  },
  {
    title: "Created By",
    dataIndex: "createdBy",
    key: "createdBy",
    width: 120,
  },
  {
    title: "Date & Time",
    dataIndex: "createdDtm",
    key: "createdDtm",
    width: 160,
    render: (text) => formatDateTime(text),
  },
  {
    title: "Message",
    dataIndex: "message",
    key: "message",
    render: (text) => (
      <span className="text-xs whitespace-pre-wrap break-all text-gray-700">
        {text || "-"}
      </span>
    ),
  },
];

const LogDetailModal = ({ visible, onCancel, logData }) => {
  const dispatch = useDispatch();
  const { data_logs, loading_logs } = useSelector(
    (state) => state.managementDeliveryInvoice,
  );

  console.log("LogDetailModal - logData:", data_logs);
  useEffect(() => {
    if (visible && logData?.deliveryId) {
      dispatch(getDeliveryLogs(logData.deliveryId));
    }
  }, [visible, logData?.deliveryId, dispatch]);

  if (!logData) return null;

  return (
    <Modal
      title={
        <span className="text-base font-semibold text-primary">
          Log History #{logData.deliveryId || "-"}
        </span>
      }
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={
        <Button type="primary" onClick={onCancel}>
          Close
        </Button>
      }
      style={{ top: 20 }}
      styles={{
        header: { backgroundColor: "#F5F5F5" },
        body: { maxHeight: "calc(100vh - 200px)", overflowY: "auto" },
      }}
      zIndex={1001}
    >
      <Spin spinning={loading_logs} indicator={<LoadingOutlined spin />}>
        <Table
          dataSource={data_logs}
          columns={columns}
          pagination={false}
          bordered
          size="middle"
          rowKey="id"
          style={{ borderRadius: "8px", overflow: "hidden" }}
        />
      </Spin>
    </Modal>
  );
};

export default LogDetailModal;
