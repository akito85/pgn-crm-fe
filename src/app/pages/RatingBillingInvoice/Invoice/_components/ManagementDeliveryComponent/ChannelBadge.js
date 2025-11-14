import { Badge } from "antd";

// Channel Badge Component
const ChannelBadge = ({ channel }) => {
  const getChannelConfig = (channel) => {
    const configs = {
      Email: { color: "#1890ff", icon: "📧" },
      SMS: { color: "#52c41a", icon: "💬" },
      WhatsApp: { color: "#25D366", icon: "📱" },
      Kurir: { color: "#fa8c16", icon: "🚚" },
    };
    return configs[channel] || { color: "#595959", icon: "📄" };
  };

  const config = getChannelConfig(channel);

  return (
    <Badge
      color={config.color}
      text={
        <span style={{ fontWeight: "500" }}>
          {config.icon} {channel}
        </span>
      }
    />
  );
};

export default ChannelBadge;
