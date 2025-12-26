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
import LayoutMenu from "../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../components/ButtonComponent";

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
  <LayoutMenu>
    <div class="w-full flex flex-col justify-end items-end mb-5">
      <ButtonComponent 
        type={"submit"}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_12115_108332)">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          <defs>
          <clipPath id="clip0_12115_108332">
          <rect width="24" height="24" fill="white"/>
          </clipPath>
          </defs>
          </svg>
        }
          className="p-5"
      >
          Setting
      </ButtonComponent>
    </div>
    
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
  </LayoutMenu>
  );
};

export default NotificationHistory;
