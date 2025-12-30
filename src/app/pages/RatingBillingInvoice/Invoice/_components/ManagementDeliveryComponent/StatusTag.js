import { Tag } from "antd";

// Status Tag Component with Icon
const StatusTag = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      Terkirim: {
        color: "success",
        icon: "✅",
        text: "Terkirim",
      },
      Gagal: {
        color: "error",
        icon: "❌",
        text: "Gagal",
      },
      Menunggu: {
        color: "warning",
        icon: "⏳",
        text: "Menunggu",
      },
      "Belum Diproses": {
        color: "default",
        icon: "📋",
        text: "Belum Diproses",
      },
    };
    return configs[status] || configs["Belum Diproses"];
  };

  const config = getStatusConfig(status);

  return (
    <Tag
      color={config.color}
      style={{
        fontWeight: "500",
        padding: "4px 12px",
        fontSize: "13px",
        borderRadius: "6px",
      }}
    >
      {config.icon} {config.text}
    </Tag>
  );
};

export default StatusTag;
