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
 * LocalStorage helpers for tracking read broadcast notifications
 * Since broadcast notifications are shared records, we track per-user read status locally
 */
const BROADCAST_READ_KEY_PREFIX = "broadcast_read_";

const getBroadcastReadKey = (userId) => `${BROADCAST_READ_KEY_PREFIX}${userId}`;

const getReadBroadcastIds = (userId) => {
  try {
    const key = getBroadcastReadKey(userId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.warn("[NotificationDropdown] Error reading broadcast read status:", e);
    return [];
  }
};

const markBroadcastsAsRead = (userId, notificationIds) => {
  try {
    const key = getBroadcastReadKey(userId);
    const existing = getReadBroadcastIds(userId);
    const updated = [...new Set([...existing, ...notificationIds])];
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("[NotificationDropdown] Error saving broadcast read status:", e);
    return [];
  }
};

const isBroadcastNotification = (notification) => {
  return notification.direction === "broadcast" ||
         notification.TO_USER_ID === "BROADCAST" ||
         notification.toUserId === "BROADCAST";
};

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
  const [readBroadcastIds, setReadBroadcastIds] = useState([]);

  // Get notification state
  const allNotifications = useSelector(selectAllNotifications) || [];
  const userUnreadCount = useSelector(selectUnreadCount); // Use Redux state for unread count
  const isConnected = useSelector(selectIsConnected);

  // Defensive check: Ensure allNotifications is always an array
  const safeAllNotifications = Array.isArray(allNotifications) ? allNotifications : [];

  // Get user ID from token
  const tokenJSON = JSON.parse(
    localStorage.getItem("token") || window.sessionStorage.getItem("token") || "{}"
  );
  const userId = tokenJSON?.userId || tokenJSON?.id || tokenJSON?.username;

  // Load read broadcast IDs from localStorage on mount
  useEffect(() => {
    if (userId) {
      const storedReadBroadcasts = getReadBroadcastIds(userId);
      setReadBroadcastIds(storedReadBroadcasts);
    }
  }, [userId]);

  // Filter notifications for current user only
  const userNotifications = safeAllNotifications.filter(notification => {
    // Include broadcast notifications (for all users) or notifications directed to this user
    const isForThisUser = notification.direction === "broadcast" ||
           notification.TO_USER_ID === userId ||
           notification.TO_USER_ID === "ALL" ||
           notification.TO_USER_ID === "BROADCAST" ||
           notification.toUserId === userId ||
           notification.toUserId === "ALL" ||
           notification.toUserId === "BROADCAST";

    return isForThisUser;
  });

  // Check if a broadcast notification has been read locally
  const isBroadcastReadLocally = (notification) => {
    if (!isBroadcastNotification(notification)) return false;
    const notificationId = notification.id || notification.ID;
    return readBroadcastIds.includes(notificationId);
  };

  // Get effective read status (considers local broadcast read tracking)
  const isNotificationRead = (notification) => {
    // Check backend status first
    const backendRead = (notification.STATUS || notification.status) === "read";
    if (backendRead) return true;

    // For broadcasts, also check local storage
    if (isBroadcastNotification(notification)) {
      return isBroadcastReadLocally(notification);
    }

    return false;
  };

  // Calculate new notifications count (unread notifications that arrived since last view)
  const newNotificationsCount = lastViewedTime
    ? userNotifications.filter(notification => {
        const notificationTime = notification.receivedAt || notification.RECEIVED_AT || notification.createdAt || notification.CREATED_AT;
        return !isNotificationRead(notification) &&
               notificationTime &&
               new Date(notificationTime) > new Date(lastViewedTime);
      }).length
    : 0;

  // Filter notifications based on active tab (using effective read status)
  const notifications = activeTab === 'all'
    ? userNotifications
    : userNotifications.filter(notification => !isNotificationRead(notification));

  // Calculate counts for tabs (using effective read status)
  const allCount = userNotifications.length;
  const unreadCountForTab = userNotifications.filter(notification => !isNotificationRead(notification)).length;

  // Client-side validation: Use client-calculated unread count as fallback
  // This protects against backend returning count for all users
  // If Redux unreadCount doesn't match our filtered count, use the filtered count as it's more reliable
  const safeUnreadCount = userUnreadCount !== undefined ? Math.min(userUnreadCount, unreadCountForTab) : unreadCountForTab;

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
          // Continue anyway - user might still see notifications if backend allows
          dispatch(connectNotifications({ userId }));
          dispatch(fetchUnreadCount());
          dispatch(fetchAllUserNotifications({ userId }));
        }
      };

      initializeNotifications();
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
   * Handle notification click - State-based navigation with proper NAVIGATION_STATE parsing
   */
  const handleNotificationClick = (notification) => {
    // Mark as read if not already read
    const notificationId = notification.id || notification.ID;
    const isRead = isNotificationRead(notification);

    if (!isRead && notificationId) {
      // For broadcast notifications, also persist to localStorage
      if (isBroadcastNotification(notification) && userId) {
        const updatedReadBroadcasts = markBroadcastsAsRead(userId, [notificationId]);
        setReadBroadcastIds(updatedReadBroadcasts);
      }
      dispatch(markAsRead(notificationId));
    }

    // Navigate using state-based routing pattern
    const link = notification.link || notification.LINK;

    if (link) {
      // Parse NAVIGATION_STATE if it's a JSON string (Bug fix from NOTIFICATION_DOCUMENTATION_SUMMARY.md)
      let parsedNavigationState = {};
      const navState = notification.navigationState || notification.NAVIGATION_STATE;

      if (navState) {
        try {
          parsedNavigationState = typeof navState === 'string' ? JSON.parse(navState) : navState;
        } catch (e) {
          parsedNavigationState = {};
        }
      }

      // Build route state object
      const routeState = {
        id: notification.entityId || notification.ENTITY_ID,
        type: notification.entityType || notification.ENTITY_TYPE,
        ...parsedNavigationState, // Spread parsed navigation state (idAccount, idCustomer, etc.)
      };

      // Add approval context if present
      const tappId = notification.tappId || notification.TAPP_ID;
      const appHierId = notification.appHierId || notification.APP_HIER_ID;
      const approvalAction = notification.approvalAction || notification.APPROVAL_ACTION;
      const approvalLevel = notification.approvalLevel || notification.APPROVAL_LEVEL;

      if (tappId) {
        routeState.tappId = tappId;
        routeState.appHierId = appHierId;
        routeState.approvalAction = approvalAction;
        routeState.approvalLevel = approvalLevel;
      }

      // Navigate based on presence of entity_id
      if (notification.entityId || notification.ENTITY_ID) {
        navigate(link, { state: routeState });
      } else {
        navigate(link, {
          state: Object.keys(parsedNavigationState).length > 0
            ? parsedNavigationState
            : undefined
        });
      }
    }
  };

  /**
   * Handle mark all as read
   * Also persists broadcast notification IDs to localStorage for local read tracking
   */
  const handleMarkAllAsRead = () => {
    // Collect broadcast notification IDs to mark as read locally
    const broadcastIds = userNotifications
      .filter(notification => isBroadcastNotification(notification) && !isNotificationRead(notification))
      .map(notification => notification.id || notification.ID)
      .filter(Boolean);

    // Only animate in unread tab
    if (activeTab === 'unread') {
      const unreadNotifications = notifications.filter(
        notification => !isNotificationRead(notification)
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

        setTimeout(() => {
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
          setAnimatingDateGroups(prev => new Set([...prev, date]));
        }, dateGroupDelay);
      });

      // After all animations complete, dispatch the API call and persist broadcast read status
      const totalAnimationTime = visualOrderNotifications.length * delayBetweenAnimations + dateGroupAnimationDelay + 400; // +400ms for animation duration
      setTimeout(() => {
        // Persist broadcast read status to localStorage
        if (broadcastIds.length > 0 && userId) {
          const updatedReadBroadcasts = markBroadcastsAsRead(userId, broadcastIds);
          setReadBroadcastIds(updatedReadBroadcasts);
        }

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
      // Persist broadcast read status to localStorage
      if (broadcastIds.length > 0 && userId) {
        const updatedReadBroadcasts = markBroadcastsAsRead(userId, broadcastIds);
        setReadBroadcastIds(updatedReadBroadcasts);
      }

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
                        backgroundColor: isNotificationRead(notification) ? "#ffffff" : "#f0f7ff",
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
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: !isNotificationRead(notification) ? 600 : 400,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {notification.title || notification.TITLE}
                            </span>
                            {/* Priority Badge */}
                            {(notification.priority || notification.PRIORITY) &&
                              getPriorityString(notification.priority || notification.PRIORITY) !== NOTIFICATION_PRIORITY.NORMAL && (
                                <div
                                  style={{
                                    fontSize: 9,
                                    fontWeight: 600,
                                    color: getPriorityColor(notification.priority || notification.PRIORITY) === 'red' ? '#ff4d4f' :
                                           getPriorityColor(notification.priority || notification.PRIORITY) === 'orange' ? '#fa8c16' :
                                           getPriorityColor(notification.priority || notification.PRIORITY) === 'blue' ? '#1890ff' : '#8c8c8c',
                                    verticalAlign: 'super',
                                    lineHeight: 1,
                                    margin: 0,
                                    padding: 0
                                  }}
                                >
                                  {getPriorityString(notification.priority || notification.PRIORITY).toUpperCase()}
                                </div>
                              )}
                            {/* Broadcast Badge */}
                            {notification.direction === "broadcast" && (
                              <div
                                style={{
                                  fontSize: 9,
                                  fontWeight: 600,
                                  color: '#722ed1',
                                  verticalAlign: 'super',
                                  lineHeight: 1,
                                  margin: 0,
                                  padding: 0
                                }}
                              >
                                BROADCAST
                              </div>
                            )}
                            {/* New Badge */}
                            {(() => {
                              const notificationTime = notification.receivedAt || notification.RECEIVED_AT || notification.createdAt || notification.CREATED_AT;
                              const isNew = notificationTime &&
                                           lastViewedTime &&
                                           new Date(notificationTime) > new Date(lastViewedTime);
                              return isNew ? (
                                <Tag
                                  color="blue"
                                  style={{ fontSize: 10, height: 'fit-content' }}
                                >
                                  New
                                </Tag>
                              ) : null;
                            })()}
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
