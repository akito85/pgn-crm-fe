import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Badge, Empty, List, Popover, Typography, Tag, Button, Tooltip } from "antd";
import {
  BellOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  MessageOutlined,
  BellFilled,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  connectNotifications,
  disconnectNotifications,
  markAsRead,
  markAllAsRead,
  selectUnreadCount,
  selectFilteredNotifications,
  selectAllNotifications,
  selectIsConnected,
  updateFilters,
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITY,
  fetchUnreadCount,
  fetchUserNotifications,
  fetchAllUserNotifications,
  markNotificationAsReadApi,
  markAllNotificationsAsReadApi,
  deleteNotificationApi,
} from "../../redux/slices/notifications";
import { NOTIFICATION_CONFIG } from "../../constants/configApp";
import notificationApi from "../../services/notificationApi";
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

  const [activeTab, setActiveTab] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lastViewedTime, setLastViewedTime] = useState(null);
  const [clickedTab, setClickedTab] = useState(null);
  const [animatingNotifications, setAnimatingNotifications] = useState(new Set());
  const [animatingDateGroups, setAnimatingDateGroups] = useState(new Set());

  // Get notification state
  const allNotifications = useSelector(selectAllNotifications) || [];
  const userUnreadCount = useSelector(selectUnreadCount); // Use Redux state for unread count
  const isConnected = useSelector(selectIsConnected);

  // Get user ID from token
  const tokenJSON = JSON.parse(
    localStorage.getItem("token") || window.sessionStorage.getItem("token") || "{}"
  );
  const userId = tokenJSON?.userId || tokenJSON?.id || tokenJSON?.username;

  // Filter notifications for current user only
  const userNotifications = allNotifications.filter(notification => {
    // Include broadcast notifications (for all users) or notifications directed to this user
    const isForThisUser = notification.direction === "broadcast" ||
           notification.TO_USER_ID === userId ||
           notification.TO_USER_ID === "ALL" ||
           notification.toUserId === userId ||
           notification.toUserId === "ALL";

    // Log warning if backend sent notifications for other users (data leakage detection)
    if (!isForThisUser && process.env.NODE_ENV === 'development') {
      console.warn('[NotificationDropdown] Backend sent notification for different user:', {
        notificationId: notification.id,
        toUserId: notification.toUserId || notification.TO_USER_ID,
        currentUserId: userId,
        title: notification.title || notification.TITLE
      });
    }

    return isForThisUser;
  });

  // Calculate new notifications count (unread notifications that arrived since last view)
  const newNotificationsCount = lastViewedTime
    ? userNotifications.filter(notification => {
        const notificationTime = notification.receivedAt || notification.RECEIVED_AT || notification.createdAt || notification.CREATED_AT;
        return (notification.STATUS || notification.status) !== "read" &&
               notificationTime &&
               new Date(notificationTime) > new Date(lastViewedTime);
      }).length
    : 0;

  // Filter notifications based on active tab
  const notifications = activeTab === 'all'
    ? userNotifications
    : userNotifications.filter(notification => (notification.STATUS || notification.status) !== "read");

  // Calculate counts for tabs
  const allCount = userNotifications.length;
  const unreadCountForTab = userNotifications.filter(notification => (notification.STATUS || notification.status) !== "read").length;

  // Client-side validation: Use client-calculated unread count as fallback
  // This protects against backend returning count for all users
  // If Redux unreadCount doesn't match our filtered count, use the filtered count as it's more reliable
  const safeUnreadCount = userUnreadCount !== undefined ? Math.min(userUnreadCount, unreadCountForTab) : unreadCountForTab;

  // Log warning if counts don't match (potential backend issue)
  if (userUnreadCount !== unreadCountForTab && process.env.NODE_ENV === 'development') {
    console.warn('[NotificationDropdown] Unread count mismatch detected:', {
      reduxUnreadCount: userUnreadCount,
      clientCalculatedCount: unreadCountForTab,
      usingSafeCount: safeUnreadCount,
      possibleCause: 'Backend may be returning count for all users or counts are out of sync'
    });
  }

  const tabs = [
    { id: 'all', label: 'All', count: allCount, badgeVariant: 'filled' },
    { id: 'unread', label: 'Unread', count: unreadCountForTab, badgeVariant: 'soft' }
  ];

  // Connect to notification stream on mount (only once)
  useEffect(() => {
    // Check if notifications are enabled via config
    if (!NOTIFICATION_CONFIG.ENABLED) {
      return;
    }

    // Get user ID from token - parse inside effect to avoid re-renders
    const tokenJSON = JSON.parse(
      localStorage.getItem("token") || window.sessionStorage.getItem("token") || "{}"
    );
    const userId = tokenJSON?.userId || tokenJSON?.id || tokenJSON?.username;

    if (userId) {
      // Initialize notification system with session registration
      const initializeNotifications = async () => {
        try {
          // Step 1: Register session (creates HttpSession and session cookie)
          // TODO: Check if session already exists (validateSession) before registering new one
          // to avoid creating duplicate sessions on component remount
          await notificationApi.registerSession(userId);

          // Step 2: Connect to SSE (now authenticated with session cookie)
          dispatch(connectNotifications({ userId }));

          // Step 3: Fetch unread count from API
          dispatch(fetchUnreadCount());

          // Step 4: Fetch all existing user notifications from API (list endpoint)
          dispatch(fetchAllUserNotifications({ userId }));
        } catch (error) {
          console.error("[NotificationDropdown] Failed to initialize notifications:", error);
          // Continue anyway - user might still see notifications if backend allows
          dispatch(connectNotifications({ userId }));
          dispatch(fetchUnreadCount());
          dispatch(fetchAllUserNotifications({ userId }));
        }
      };

      initializeNotifications();
    } else {
      console.warn("[NotificationDropdown] No userId found in token");
    }

    // Cleanup: Disconnect from SSE on unmount
    // Note: Session is NOT unregistered here - it should only be unregistered on logout
    // Session will expire naturally after timeout (30 minutes per SESSION_AUTH_TESTING.md)
    // In development with React StrictMode, this runs twice - service handles reconnection gracefully
    return () => {
      if (NOTIFICATION_CONFIG.ENABLED) {
        dispatch(disconnectNotifications());
      }
    };
  }, [dispatch]); // Only depend on dispatch, not userId - connect once on mount

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
    // Normalize priority to string if it's a number
    const normalizedPriority = typeof priority === 'number'
      ? getPriorityStringFromNumber(priority)
      : priority;

    // If it's a number string like "1", convert to number
    if (typeof priority === 'string' && !isNaN(priority) && priority.trim() !== '') {
      const priorityNumber = Number(priority);
      const priorityString = getPriorityStringFromNumber(priorityNumber);
      switch (priorityString) {
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
    }

    switch (normalizedPriority) {
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
   * Convert priority (number or string) to display string
   */
  const getPriorityString = (priority) => {
    // Normalize priority to string if it's a number
    const normalizedPriority = typeof priority === 'number'
      ? getPriorityStringFromNumber(priority)
      : priority;

    // If it's a number string like "1", convert to number
    if (typeof priority === 'string' && !isNaN(priority) && priority.trim() !== '') {
      return getPriorityStringFromNumber(Number(priority));
    }

    return normalizedPriority;
  };

  const getPriorityStringFromNumber = (priority) => {
    // If number, map to priority string
    // Assuming: 1=low, 2=normal, 3=high, 4=urgent
    switch (priority) {
      case 1:
        return NOTIFICATION_PRIORITY.LOW;
      case 2:
        return NOTIFICATION_PRIORITY.NORMAL;
      case 3:
        return NOTIFICATION_PRIORITY.HIGH;
      case 4:
        return NOTIFICATION_PRIORITY.URGENT;
      default:
        return NOTIFICATION_PRIORITY.NORMAL;
    }
  };

  /**
   * Handle notification click - State-based navigation
   */
  const handleNotificationClick = (notification) => {
    // Mark as read if not already read via API
    if ((notification.STATUS || notification.status) !== "read") {
      dispatch(markNotificationAsReadApi(notification.id));
    }

    // Navigate using state-based routing pattern
    if (notification.link || notification.LINK) {
      // Build route state object
      const routeState = {
        id: notification.entityId || notification.ENTITY_ID,
        type: notification.entityType || notification.ENTITY_TYPE,
        ...notification.navigationState, // Spread additional state (idAccount, idCustomer, etc.)
      };

      // Add approval context if present
      if (notification.tappId || notification.TAPP_ID) {
        routeState.tappId = notification.tappId || notification.TAPP_ID;
        routeState.appHierId = notification.appHierId || notification.APP_HIER_ID;
        routeState.approvalAction = notification.approvalAction || notification.APPROVAL_ACTION;
        routeState.approvalLevel = notification.approvalLevel || notification.APPROVAL_LEVEL;
      }

      // Navigate based on presence of entity_id
      if (notification.entityId || notification.ENTITY_ID) {
        navigate(notification.link || notification.LINK, { state: routeState });
      } else {
        // General page navigation (might still have state for bulk operations)
        navigate(notification.link || notification.LINK, {
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
    // Only animate in unread tab
    if (activeTab === 'unread') {
      const unreadNotifications = notifications.filter(
        notification => (notification.STATUS || notification.status) !== "read"
      );

      if (unreadNotifications.length === 0) {
        return;
      }

      // Get notifications in actual visual order by flattening the grouped structure
      const groupedNotifications = groupNotificationsByDate(unreadNotifications);
      const visualOrderNotifications = [];
      const dateGroupsOrder = [];

      // Flatten groups in the order they appear on screen
      Object.entries(groupedNotifications).forEach(([date, dateNotifications]) => {
        dateGroupsOrder.push(date);
        visualOrderNotifications.push(...dateNotifications);
      });

      // Sequential animation delay (ms between each notification)
      const delayBetweenAnimations = 84; // 84ms delay - 20 messages complete in ~2s
      const dateGroupAnimationDelay = 100; // Delay for date group header animation

      // Track the last notification index for each date group
      const dateGroupLastIndices = {};
      let currentIndex = 0;

      Object.entries(groupedNotifications).forEach(([date, dateNotifications]) => {
        currentIndex += dateNotifications.length;
        dateGroupLastIndices[date] = currentIndex - 1;
      });

      // Trigger animations sequentially from oldest (bottom) to newest (top)
      visualOrderNotifications.forEach((notification, index) => {
        // Reverse the order: last item (oldest) animates first
        const reverseIndex = visualOrderNotifications.length - 1 - index;
        const delay = reverseIndex * delayBetweenAnimations;

        const notificationId = notification.id || notification.ID;

        console.log(`Scheduling animation for notification ${index + 1}/${visualOrderNotifications.length}:`, {
          id: notificationId,
          title: notification.title || notification.TITLE,
          delay: `${delay}ms`,
          reverseIndex,
        });

        setTimeout(() => {
          console.log(`Animating notification: ${notification.title || notification.TITLE} (ID: ${notificationId})`);
          setAnimatingNotifications(prev => new Set([...prev, notificationId]));
        }, delay);
      });

      // Animate date group headers after their last notification
      Object.entries(groupedNotifications).forEach(([date, dateNotifications]) => {
        const lastNotificationIndex = dateGroupLastIndices[date];
        const reverseIndex = visualOrderNotifications.length - 1 - lastNotificationIndex;
        const lastNotificationDelay = reverseIndex * delayBetweenAnimations;
        const dateGroupDelay = lastNotificationDelay + dateGroupAnimationDelay;

        setTimeout(() => {
          console.log(`Animating date group: ${date}`);
          setAnimatingDateGroups(prev => new Set([...prev, date]));
        }, dateGroupDelay);
      });

      // After all animations complete, dispatch the API call
      const totalAnimationTime = visualOrderNotifications.length * delayBetweenAnimations + dateGroupAnimationDelay + 400; // +400ms for animation duration
      setTimeout(() => {
        dispatch(markAllNotificationsAsReadApi());

        // Clear animating notifications and date groups after a delay to allow Redux state to update
        // This prevents glitch where notifications might briefly reappear
        setTimeout(() => {
          setAnimatingNotifications(new Set());
          setAnimatingDateGroups(new Set());
        }, 300);
      }, totalAnimationTime);
    } else {
      // In 'all' tab, just mark as read without animation
      dispatch(markAllNotificationsAsReadApi());
    }
  };

  /**
   * Handle delete notification
   * @param {Event} e - Click event
   * @param {string} notificationId - Notification ID to delete
   */
  const handleDeleteNotification = (e, notificationId) => {
    // Stop event propagation to prevent notification click
    e.stopPropagation();

    // Dispatch delete action
    dispatch(deleteNotificationApi(notificationId));
  };

  /**
   * Handle view all notifications
   */
  const handleViewAll = () => {
    // Get user ID from token to pass in state
    const tokenJSON = JSON.parse(
      localStorage.getItem("token") || window.sessionStorage.getItem("token") || "{}"
    );
    const userId = tokenJSON?.userId || tokenJSON?.id || tokenJSON?.username;

    navigate("/notifications/view", { state: { userId } });
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
   * Get notification timestamp - handles different property names
   */
  const getNotificationTimestamp = (notification) => {
    return notification.receivedAt ||
           notification.RECEIVED_AT ||
           notification.createdAt ||
           notification.CREATED_AT;
  };

  /**
   * Group notifications by date
   */
  const groupNotificationsByDate = (notifications) => {
    const grouped = {};

    notifications.forEach(notification => {
      const notificationDate = getNotificationTimestamp(notification);
      const date = moment(notificationDate).format("YYYY-MM-DD");
      const dateFormatted = moment(notificationDate).format("MMM D").split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const notificationMoment = moment(notificationDate);
      // Check if today (same day, month, and year)
      const isToday = moment().isSame(notificationMoment, 'day');
      const displayDate = isToday ? "Today" : dateFormatted;

      if (!grouped[displayDate]) {
        grouped[displayDate] = [];
      }
      grouped[displayDate].push(notification);
    });

    return grouped;
  };

  /**
   * Render notification content
   */
  const notificationContent = (
    <div className="notification-dropdown" style={{ width: 380, maxHeight: 750 }}>
      {/* Header */}
      <div
        className="notification-header"
        style={{
          padding: "12px 16px",
          // borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxHeight: "62px"
        }}
      >
        <Text strong style={{ fontSize: 16 }}>
          Notifications
        </Text>
        {(safeUnreadCount > 0) && (
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

      {/* Tabs */}
      <div className="w-full self-stretch border-t-[0.5px] border-b-1 border-l-0 border-r-0 border-b-[#1d1c1d]/10 border-t-[#1d1c1d]/10 border-solid inline-flex justify-center items-center">
        <div className="w-full self-stretch px-5 inline-flex justify-center items-center gap-10">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            
            return (
              <div
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setClickedTab(tab.id);
                  setTimeout(() => setClickedTab(null), 200);
                }}
                className={`${clickedTab === tab.id ? 'tab-item' : ''} flex-1 h-12 min-w-12 min-h-12 flex justify-center items-center gap-2 cursor-pointer ${
                  isSelected ? 'border-solid border-l-0 border-r-0 border-t-0 border-b-2 border-[#000]' : ''
                }`}
              >
                <div className={`justify-start text-sm font-semibold leading-[22px] ${
                  isSelected ? 'text-[#1d1c1d]' : 'text-[#74797d]'
                }`}>
                  {tab.label}
                </div>
                <div className={`h-6 min-w-6 px-1.5 rounded-md flex justify-start items-center gap-1.5 ${
                  tab.badgeVariant === 'filled' ? 'bg-[#1d1c1d]' : 'bg-[#e6f1f9]'
                }`}>
                  <div className={`text-center justify-start text-xs font-bold leading-5 ${
                    tab.badgeVariant === 'filled' ? 'text-white' : 'text-[#0075bf]'
                  }`}>
                    {tab.count}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notification List */}
      <div
        key={activeTab}
        className="notification-list"
        style={{
          maxHeight: 530,
          overflowY: "auto",
          animation: 'fadeSlideIn 0.3s ease-in-out'
        }}
      >
        {notifications.length === 0 ? (
          <div style={{ padding: "40px 16px" }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No notifications"
            />
          </div>
        ) : (
          <div>
            {Object.entries(groupNotificationsByDate(notifications)).map(([date, dateNotifications]) => (
              <div className="flex flex-col" key={date}>
                {/* Date Group Header */}
                <div className={`w-full px-5 py-3 border-b border-[#1d1c1d]/10 inline-flex justify-start items-start gap-4 ${
                  animatingDateGroups.has(date) ? 'date-group-slide-out' : ''
                }`}>
                  <div className="flex-1 justify-start text-[#1d1c1d] text-sm font-bold capitalize">
                    {date}
                  </div>
                </div>

                {/* Notifications for this date */}
                <List
                  itemLayout="horizontal"
                  dataSource={dateNotifications}
                  renderItem={(notification) => (
                    <List.Item
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      style={{
                        padding: "12px 16px",
                        cursor: (notification.LINK || notification.link) ? "pointer" : "default",
                        backgroundColor: ((notification.STATUS || notification.status) === "read") ? "#ffffff" : "#f0f7ff",
                        borderBottom: "1px dashed rgb(29 28 29 / 0.1)",
                        borderTop: "1px dashed rgb(29 28 29 / 0.1)",
                        marginTop: "-1px"
                      }}
                      className={`notification-item hover:bg-gray-50 ${
                        animatingNotifications.has(notification.id || notification.ID) ? 'notification-slide-out' : ''
                      }`}
                    >
                      <List.Item.Meta
                        // avatar={getNotificationIcon(notification.notificationType || notification.NOTIFICATION_TYPE)}
                        title={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                              <Text
                                strong={!(notification.read || notification.STATUS === "read")}
                                style={{ fontSize: 14, flex: 1 }}
                                ellipsis
                              >
                                {notification.title || notification.TITLE}
                              </Text>
                              {(() => {
                                const notificationTime = notification.receivedAt || notification.RECEIVED_AT || notification.createdAt || notification.CREATED_AT;
                                const isNew = notificationTime &&
                                             lastViewedTime &&
                                             new Date(notificationTime) > new Date(lastViewedTime);
                                return isNew ? (
                                  <Tag
                                    color="blue"
                                    style={{ marginLeft: 8, fontSize: 10, height: 'fit-content', alignSelf: 'center' }}
                                  >
                                    New
                                  </Tag>
                                ) : null;
                              })()}
                            </div>
                            {(notification.priority || notification.PRIORITY) &&
                              getPriorityString(notification.priority || notification.PRIORITY) !== NOTIFICATION_PRIORITY.NORMAL && (
                                <Tag
                                  color={getPriorityColor(notification.priority || notification.PRIORITY)}
                                  style={{ marginLeft: 8, fontSize: 10 }}
                                >
                                  {getPriorityString(notification.priority || notification.PRIORITY).toUpperCase()}
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
                              {notification.message || notification.MESSAGE}
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
                                  getNotificationTimestamp(notification)
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
              </div>
            ))}
          </div>
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
            maxHeight: "62px"
          }}
        >
          <Button type="link" onClick={handleViewAll} block>
            View All Notifications
          </Button>
        </div>
      )}

    </div>
  );

  const toggleDropdown = () => {
    const newOpenState = !isDropdownOpen;
    setIsDropdownOpen(newOpenState);
    if (newOpenState) {
      setLastViewedTime(new Date().toISOString());
    }
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Safety check: Don't render if no userId (prevents showing wrong user's data)
  if (!userId) {
    console.warn('[NotificationDropdown] No userId found - notifications disabled');
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes tabClick {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes badgePulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        @keyframes slideOutRight {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        .tab-item {
          animation: tabClick 0.2s ease-in-out;
        }

        .badge-pulse {
          animation: badgePulse 2s ease-in-out infinite;
        }

        .notification-slide-out {
          animation: slideOutRight 0.4s ease-out forwards;
        }

        .date-group-slide-out {
          animation: slideOutRight 0.3s ease-out forwards;
        }

        .notification-dropdown {
          transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .notification-list {
          transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: max-height, height;
        }
      `}</style>
      {isDropdownOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            cursor: 'pointer',
          }}
          onClick={closeDropdown}
        />
      )}
      <div style={{ position: 'relative', display: 'flex' }}>
        <Badge
          count={safeUnreadCount}
          offset={[-5, 10]}
          overflowCount={99}
          style={{ boxShadow: '0 0 0 2px #fff' }}
          className={safeUnreadCount > 0 ? 'badge-pulse' : ''}
        >
          <a
            onClick={(e) => {
              e.preventDefault();
              toggleDropdown();
            }}
            className="pt-2.5"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BellOutlined
              style={{
                fontSize: "24px",
                color: "#FFFFFF",
              }}
            />
          </a>
        </Badge>
        {isDropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              zIndex: 1001,
              width: 380,
              maxHeight: 900,
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent click from closing dropdown
          >
            {notificationContent}
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationDropdown;
