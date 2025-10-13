import { Button, Table } from "antd";
import ChannelBadge from "./ChannelBadge";
import StatusTag from "./StatusTag";

// Invoice Table Component
const DeliveryTable = ({ dataSource, loading, onViewDetail }) => {
  const columns = [
    {
      title: "No. Invoice",
      dataIndex: "invoiceNo",
      key: "invoiceNo",
      width: 130,
      fixed: "left",
      render: (text) => (
        <span
          style={{
            fontWeight: "600",
            color: "#1890ff",
            fontFamily: "monospace",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Pelanggan",
      dataIndex: "customer",
      key: "customer",
      width: 220,
      ellipsis: true,
      render: (text) => (
        <span style={{ fontWeight: "500", color: "#262626" }}>{text}</span>
      ),
    },
    {
      title: "Kanal",
      dataIndex: "channel",
      key: "channel",
      width: 150,
      render: (channel) => <ChannelBadge channel={channel} />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 160,
      align: "center",
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: "Waktu Update",
      dataIndex: "lastUpdate",
      key: "lastUpdate",
      width: 180,
      render: (text) => (
        <span style={{ color: "#595959", fontSize: "13px" }}>🕐 {text}</span>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      width: 100,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => onViewDetail(record)}
          style={{ borderRadius: "6px" }}
        >
          Detail
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `Menampilkan ${range[0]}-${range[1]} dari ${total} data`,
        pageSizeOptions: ["10", "20", "50", "100"],
      }}
      bordered
      size="middle"
      scroll={{ x: 1100 }}
      rowKey="key"
      style={{ borderRadius: "8px", overflow: "hidden" }}
    />
  );
};

export default DeliveryTable;
