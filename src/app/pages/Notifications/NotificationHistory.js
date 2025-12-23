import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  List,
  Tag,
  Button,
  Space,
  Empty,
  Segmented,
  Statistic,
  Row,
  Col,
  Typography,
  Divider,
  Dropdown,
  Menu,
  Popconfirm,
} from "antd";
import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  MessageOutlined,
  BellFilled,
  MoreOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import {
  selectAllNotifications,
  selectBroadcastNotifications,
  selectDirectNotifications,
  selectUnreadCount,
  selectConnectionStatus,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  clearNotificationsByDirection,
  updateFilters,
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITY,
} from "../../../redux/slices/notifications";
import moment from "moment";
import NxPanel from "../../../components/Nx/NxPanel";

const { Title, Text } = Typography;

/**
 * NotificationHistory Page
 *
 * Displays full notification history with filtering and management capabilities
 */
const NotificationHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get notification state
  const allNotifications = useSelector(selectAllNotifications);
  const broadcastNotifications = useSelector(selectBroadcastNotifications);
  const directNotifications = useSelector(selectDirectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const connectionStatus = useSelector(selectConnectionStatus);

  // Local state
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);

  // Get filtered notifications based on selected filter
  const getFilteredNotifications = () => {
    let notifications = allNotifications;

    // Filter by direction
    if (selectedFilter === "broadcast") {
      notifications = broadcastNotifications;
    } else if (selectedFilter === "direct") {
      notifications = directNotifications;
    }

    // Filter by type
    if (selectedType) {
      notifications = notifications.filter((n) => n.notificationType === selectedType);
    }

    // Filter by priority
    if (selectedPriority) {
      notifications = notifications.filter((n) => n.priority === selectedPriority);
    }

    return notifications;
  };

  const filteredNotifications = getFilteredNotifications();

  /**
   * Get icon based on notification type
   */
  const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 20 }} />;
      case NOTIFICATION_TYPES.WARNING:
        return <WarningOutlined style={{ color: "#faad14", fontSize: 20 }} />;
      case NOTIFICATION_TYPES.ERROR:
        return <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 20 }} />;
      case NOTIFICATION_TYPES.APPROVAL:
        return <CheckOutlined style={{ color: "#1890ff", fontSize: 20 }} />;
      case NOTIFICATION_TYPES.MESSAGE:
        return <MessageOutlined style={{ color: "#1890ff", fontSize: 20 }} />;
      case NOTIFICATION_TYPES.SYSTEM:
        return <BellFilled style={{ color: "#722ed1", fontSize: 20 }} />;
      case NOTIFICATION_TYPES.ALERT:
        return <WarningOutlined style={{ color: "#fa8c16", fontSize: 20 }} />;
      default:
        return <InfoCircleOutlined style={{ color: "#1890ff", fontSize: 20 }} />;
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
   * Format notification timestamp
   */
  const formatTimestamp = (timestamp) => {
    const notificationTime = moment(timestamp);
    return notificationTime.format("MMM D, YYYY HH:mm");
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
   * Handle mark as read
   */
  const handleMarkAsRead = (notificationId) => {
    dispatch(markAsRead(notificationId));
  };

  /**
   * Handle mark all as read
   */
  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  /**
   * Handle delete notification
   */
  const handleDeleteNotification = (notificationId) => {
    dispatch(removeNotification(notificationId));
  };

  /**
   * Handle clear all notifications
   */
  const handleClearAll = () => {
    dispatch(clearAllNotifications());
  };

  /**
   * Handle clear by direction
   */
  const handleClearByDirection = () => {
    if (selectedFilter === "broadcast") {
      dispatch(clearNotificationsByDirection("broadcast"));
    } else if (selectedFilter === "direct") {
      dispatch(clearNotificationsByDirection("direct"));
    }
  };

  /**
   * Handle filter change
   */
  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    dispatch(
      updateFilters({
        direction: value,
      })
    );
  };

  /**
   * Get action menu for each notification
   */
  const getActionMenu = (notification) => (
    <Menu>
      {!notification.read && (
        <Menu.Item
          key="read"
          icon={<CheckOutlined />}
          onClick={() => handleMarkAsRead(notification.id)}
        >
          Mark as read
        </Menu.Item>
      )}
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        danger
        onClick={() => handleDeleteNotification(notification.id)}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="notification-history-page">
      {/* Page Header */}
      <NxPanel title="NOTIFICATION HISTORY">
        {/* Statistics */}
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Notifications"
                value={allNotifications.length}
                prefix={<BellOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Unread"
                value={unreadCount}
                valueStyle={{ color: "#cf1322" }}
                prefix={<BellFilled />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Broadcast"
                value={broadcastNotifications.length}
                prefix={<BellOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Direct"
                value={directNotifications.length}
                prefix={<MessageOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters and Actions */}
        <div className="flex justify-between items-center mb-6">
          <Space size="middle">
            <Segmented
              options={[
                { label: "All", value: "all" },
                { label: "Broadcast", value: "broadcast" },
                { label: "Direct", value: "direct" },
              ]}
              value={selectedFilter}
              onChange={handleFilterChange}
            />

            {/* Type Filter */}
            <Dropdown
              overlay={
                <Menu
                  onClick={({ key }) =>
                    setSelectedType(key === "all" ? null : key)
                  }
                >
                  <Menu.Item key="all">All Types</Menu.Item>
                  <Menu.Divider />
                  {Object.values(NOTIFICATION_TYPES).map((type) => (
                    <Menu.Item key={type}>{type.toUpperCase()}</Menu.Item>
                  ))}
                </Menu>
              }
            >
              <Button icon={<FilterOutlined />}>
                Type: {selectedType ? selectedType.toUpperCase() : "ALL"}
              </Button>
            </Dropdown>

            {/* Priority Filter */}
            <Dropdown
              overlay={
                <Menu
                  onClick={({ key }) =>
                    setSelectedPriority(key === "all" ? null : key)
                  }
                >
                  <Menu.Item key="all">All Priorities</Menu.Item>
                  <Menu.Divider />
                  {Object.values(NOTIFICATION_PRIORITY).map((priority) => (
                    <Menu.Item key={priority}>
                      {priority.toUpperCase()}
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <Button icon={<FilterOutlined />}>
                Priority:{" "}
                {selectedPriority ? selectedPriority.toUpperCase() : "ALL"}
              </Button>
            </Dropdown>
          </Space>

          <Space>
            {unreadCount > 0 && (
              <Button
                icon={<CheckOutlined />}
                onClick={handleMarkAllAsRead}
              >
                Mark All as Read
              </Button>
            )}
            {selectedFilter !== "all" && filteredNotifications.length > 0 && (
              <Popconfirm
                title="Clear all notifications in this category?"
                onConfirm={handleClearByDirection}
                okText="Yes"
                cancelText="No"
              >
                <Button icon={<ClearOutlined />} danger>
                  Clear {selectedFilter}
                </Button>
              </Popconfirm>
            )}
            {allNotifications.length > 0 && (
              <Popconfirm
                title="Are you sure you want to clear all notifications?"
                onConfirm={handleClearAll}
                okText="Yes"
                cancelText="No"
              >
                <Button icon={<DeleteOutlined />} danger>
                  Clear All
                </Button>
              </Popconfirm>
            )}
          </Space>
        </div>

        {/* Connection Status */}
        <div className="mb-4">
          <Tag color={connectionStatus === "connected" ? "success" : "default"}>
            {connectionStatus === "connected" ? "● Connected" : "○ Disconnected"}
          </Tag>
        </div>

        <Divider />

        {/* Notification List */}
        {filteredNotifications.length === 0 ? (
          <div className="py-20">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No notifications"
            />
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={filteredNotifications}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} notifications`,
            }}
            renderItem={(notification) => (
              <List.Item
                key={notification.id}
                style={{
                  backgroundColor: notification.read ? "#ffffff" : "#f0f7ff",
                  padding: "16px",
                  marginBottom: "8px",
                  borderRadius: "4px",
                  border: "1px solid #f0f0f0",
                  cursor: notification.link ? "pointer" : "default",
                }}
                onClick={() =>
                  notification.link && handleNotificationClick(notification)
                }
                actions={[
                  <Dropdown
                    overlay={getActionMenu(notification)}
                    trigger={["click"]}
                  >
                    <Button
                      type="text"
                      icon={<MoreOutlined />}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Dropdown>,
                ]}
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
                      <Text strong={!notification.read} style={{ fontSize: 16 }}>
                        {notification.title}
                      </Text>
                      <Space>
                        {notification.priority &&
                          notification.priority !== NOTIFICATION_PRIORITY.NORMAL && (
                            <Tag color={getPriorityColor(notification.priority)}>
                              {notification.priority.toUpperCase()}
                            </Tag>
                          )}
                        {notification.direction === "broadcast" && (
                          <Tag color="purple">BROADCAST</Tag>
                        )}
                        {!notification.read && <Tag color="blue">UNREAD</Tag>}
                      </Space>
                    </div>
                  }
                  description={
                    <div>
                      <Text style={{ fontSize: 14, display: "block", marginBottom: 8 }}>
                        {notification.message}
                      </Text>
                      <Space split={<Divider type="vertical" />}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <strong>Type:</strong> {notification.notificationType}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <strong>Received:</strong>{" "}
                          {formatTimestamp(
                            notification.receivedAt || notification.createdAt
                          )}
                        </Text>
                        {notification.read && notification.readAt && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <strong>Read:</strong>{" "}
                            {formatTimestamp(notification.readAt)}
                          </Text>
                        )}
                      </Space>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </NxPanel>
    </div>
  );
};

export default NotificationHistory;
