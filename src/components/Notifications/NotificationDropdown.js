import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Badge, Empty, List, Popover, Typography, Tag, Button } from "antd";
import {
  BellOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  MessageOutlined,
  BellFilled,
} from "@ant-design/icons";
import {
  connectNotifications,
  disconnectNotifications,
  markAsRead,
  markAllAsRead,
  selectUnreadCount,
  selectFilteredNotifications,
  selectIsConnected,
  updateFilters,
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITY,
} from "../../redux/slices/notifications";
import moment from "moment";

const { Text } = Typography;

/**
 * NotificationDropdown Component
 *
 * Displays a bell icon with unread count badge and a dropdown/popover
 * showing recent notifications. Connects to notification SSE stream.
 */
const NotificationDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user ID from auth state
  const { user } = useSelector((state) => state.auth);
  const userId = user?.userId || user?.id;

  // Get notification state
  const unreadCount = useSelector(selectUnreadCount);
  const notifications = useSelector(selectFilteredNotifications);
  const isConnected = useSelector(selectIsConnected);

  // Connect to notification stream on mount
  useEffect(() => {
    if (userId) {
      console.log("[NotificationDropdown] Connecting to notifications for user:", userId);
      dispatch(connectNotifications({ userId }));
    }

    // Cleanup: Disconnect on unmount
    return () => {
      console.log("[NotificationDropdown] Disconnecting from notifications");
      dispatch(disconnectNotifications());
    };
  }, [dispatch, userId]);

  /**
   * Get icon based on notification type
   */
  const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case NOTIFICATION_TYPES.WARNING:
        return <WarningOutlined style={{ color: "#faad14" }} />;
      case NOTIFICATION_TYPES.ERROR:
        return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
      case NOTIFICATION_TYPES.APPROVAL:
        return <CheckOutlined style={{ color: "#1890ff" }} />;
      case NOTIFICATION_TYPES.MESSAGE:
        return <MessageOutlined style={{ color: "#1890ff" }} />;
      case NOTIFICATION_TYPES.SYSTEM:
        return <BellFilled style={{ color: "#722ed1" }} />;
      case NOTIFICATION_TYPES.ALERT:
        return <WarningOutlined style={{ color: "#fa8c16" }} />;
      default:
        return <InfoCircleOutlined style={{ color: "#1890ff" }} />;
    }
  };

  /**
   * Get tag color based on priority
   */
  const getPriorityColor = (priority) => {
    switch (priority) {
      case NOTIFICATION_PRIORITY.URGENT:
        return "red";
      case NOTIFICATION_PRIORITY.HIGH:
        return "orange";
      case NOTIFICATION_PRIORITY.NORMAL:
        return "blue";
      case NOTIFICATION_PRIORITY.LOW:
        return "default";
      default:
        return "default";
    }
  };

  /**
   * Handle notification click - State-based navigation
   */
  const handleNotificationClick = (notification) => {
    // Mark as read if not already read
    if (!notification.read) {
      dispatch(markAsRead(notification.id));
    }

    // Navigate using state-based routing pattern
    if (notification.link) {
      // Build route state object
      const routeState = {
        id: notification.entityId,
        type: notification.entityType,
        ...notification.navigationState, // Spread additional state (idAccount, idCustomer, etc.)
      };

      // Add approval context if present
      if (notification.tappId) {
        routeState.tappId = notification.tappId;
        routeState.appHierId = notification.appHierId;
        routeState.approvalAction = notification.approvalAction;
        routeState.approvalLevel = notification.approvalLevel;
      }

      // Navigate based on presence of entity_id
      if (notification.entityId) {
        navigate(notification.link, { state: routeState });
      } else {
        // General page navigation (might still have state for bulk operations)
        navigate(notification.link, {
          state: Object.keys(notification.navigationState || {}).length > 0
            ? notification.navigationState
            : undefined
        });
      }
    }
  };

  /**
   * Handle mark all as read
   */
  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  /**
   * Handle view all notifications
   */
  const handleViewAll = () => {
    navigate("/notifications");
  };

  /**
   * Format notification timestamp
   */
  const formatTimestamp = (timestamp) => {
    const now = moment();
    const notificationTime = moment(timestamp);
    const diffMinutes = now.diff(notificationTime, "minutes");
    const diffHours = now.diff(notificationTime, "hours");
    const diffDays = now.diff(notificationTime, "days");

    if (diffMinutes < 1) {
      return "Just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return notificationTime.format("MMM D, YYYY");
    }
  };

  /**
   * Render notification content
   */
  const notificationContent = (
    <div className="notification-dropdown" style={{ width: 380, maxHeight: 500 }}>
      {/* Header */}
      <div
        className="notification-header"
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text strong style={{ fontSize: 16 }}>
          Notifications
        </Text>
        {unreadCount > 0 && (
          <Button
            type="link"
            size="small"
            icon={<CheckOutlined />}
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notification List */}
      <div
        className="notification-list"
        style={{ maxHeight: 380, overflowY: "auto" }}
      >
        {notifications.length === 0 ? (
          <div style={{ padding: "40px 16px" }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No notifications"
            />
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={notifications.slice(0, 10)} // Show only first 10
            renderItem={(notification) => (
              <List.Item
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                style={{
                  padding: "12px 16px",
                  cursor: notification.link ? "pointer" : "default",
                  backgroundColor: notification.read ? "#ffffff" : "#f0f7ff",
                  borderBottom: "1px solid #f0f0f0",
                }}
                className="notification-item hover:bg-gray-50"
              >
                <List.Item.Meta
                  avatar={getNotificationIcon(notification.notificationType)}
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        strong={!notification.read}
                        style={{ fontSize: 14 }}
                        ellipsis
                      >
                        {notification.title}
                      </Text>
                      {notification.priority &&
                        notification.priority !== NOTIFICATION_PRIORITY.NORMAL && (
                          <Tag
                            color={getPriorityColor(notification.priority)}
                            style={{ marginLeft: 8, fontSize: 10 }}
                          >
                            {notification.priority.toUpperCase()}
                          </Tag>
                        )}
                    </div>
                  }
                  description={
                    <div>
                      <Text
                        type="secondary"
                        style={{ fontSize: 13, display: "block" }}
                        ellipsis={{ rows: 2 }}
                      >
                        {notification.message}
                      </Text>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: 4,
                        }}
                      >
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatTimestamp(
                            notification.receivedAt || notification.createdAt
                          )}
                        </Text>
                        {notification.direction === "broadcast" && (
                          <Tag color="purple" style={{ fontSize: 10 }}>
                            BROADCAST
                          </Tag>
                        )}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div
          className="notification-footer"
          style={{
            padding: "8px 16px",
            borderTop: "1px solid #f0f0f0",
            textAlign: "center",
          }}
        >
          <Button type="link" onClick={handleViewAll} block>
            View All Notifications
          </Button>
        </div>
      )}

      {/* Connection Status Indicator (for debugging) */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            padding: "4px 16px",
            borderTop: "1px solid #f0f0f0",
            backgroundColor: isConnected ? "#f6ffed" : "#fff1f0",
            fontSize: 11,
            textAlign: "center",
          }}
        >
          <Text type={isConnected ? "success" : "danger"}>
            {isConnected ? "● Connected" : "● Disconnected"}
          </Text>
        </div>
      )}
    </div>
  );

  return (
    <Popover
      content={notificationContent}
      trigger="click"
      placement="bottomRight"
      overlayClassName="notification-popover"
    >
      <Badge count={unreadCount} offset={[-5, 5]} overflowCount={99}>
        <a onClick={(e) => e.preventDefault()} className="pt-2.5">
          <BellOutlined
            style={{
              fontSize: "24px",
              color: "#FFFFFF",
            }}
          />
        </a>
      </Badge>
    </Popover>
  );
};

export default NotificationDropdown;
