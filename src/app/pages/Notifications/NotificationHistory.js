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
  Pagination,
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
import NxDateRangePicker from "../../../components/Nx/NxDateRangePicker";
import NxSearchInput from "../../../components/Nx/NxSearchInput";
import NxDropdownBase from "../../../components/Nx/NxDropdownBase";
import NxTextButton from "../../../components/Nx/NxTextButton";
import LayoutMenu from "../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../components/ButtonComponent";

const { Title, Text } = Typography;

/**
 * NotificationHistory Page
 *
 * Displays full notification history with filtering and management capabilities
 */
const NotificationHistory = () => {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedNotificationType, setSelectedNotificationType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get notification state
  const allNotifications = useSelector(selectAllNotifications) || [];
  const broadcastNotifications = useSelector(selectBroadcastNotifications);
  const directNotifications = useSelector(selectDirectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const connectionStatus = useSelector(selectConnectionStatus);

  // Local state for tab and animations
  const [activeTab, setActiveTab] = useState('all');
  const [lastViewedTime, setLastViewedTime] = useState(null);
  const [clickedTab, setClickedTab] = useState(null);
  const [animatingNotifications, setAnimatingNotifications] = useState(new Set());
  const [animatingDateGroups, setAnimatingDateGroups] = useState(new Set());
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);

  // Get filtered notifications based on all filters
  const getFilteredNotifications = () => {
    let notifications = allNotifications;

    // Filter by tab (all/unread)
    if (activeTab === 'unread') {
      notifications = notifications.filter(notification =>
        (notification.STATUS || notification.status) !== "read"
      );
    }

    // Filter by search (title or message)
    if (search && search.trim()) {
      const searchLower = search.toLowerCase().trim();
      notifications = notifications.filter(notification => {
        const title = (notification.title || notification.TITLE || "").toLowerCase();
        const message = (notification.message || notification.MESSAGE || "").toLowerCase();
        return title.includes(searchLower) || message.includes(searchLower);
      });
    }

    // Filter by date range
    if (startDate && endDate) {
      notifications = notifications.filter(notification => {
        const notificationDate = moment(
          notification.receivedAt || notification.RECEIVED_AT ||
          notification.createdAt || notification.CREATED_AT
        );
        return notificationDate.isBetween(moment(startDate), moment(endDate), 'day', '[]');
      });
    }

    // Filter by notification type dropdown
    if (selectedNotificationType && selectedNotificationType !== "Show All") {
      notifications = notifications.filter(notification => {
        const type = (notification.notificationType || notification.NOTIFICATION_TYPE || "").toLowerCase();
        return type === selectedNotificationType.toLowerCase();
      });
    }

    return notifications;
  };

  const filteredNotifications = getFilteredNotifications();

  // Pagination logic
  const totalNotifications = filteredNotifications.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

  // Calculate counts for tabs
  const allCount = allNotifications.length;
  const unreadCountForTab = allNotifications.filter(notification =>
    (notification.STATUS || notification.status) !== "read"
  ).length;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, startDate, endDate, selectedNotificationType, activeTab]);

  // Safe unread count
  const safeUnreadCount = unreadCount !== undefined ? Math.min(unreadCount, unreadCountForTab) : unreadCountForTab;

  const tabs = [
    { id: 'all', label: 'All', count: allCount, badgeVariant: 'filled' },
    { id: 'unread', label: 'Unread', count: unreadCountForTab, badgeVariant: 'soft' }
  ];

  /**
   * Handle clear all filters
   */
  const handleClearFilters = () => {
    setSearch("");
    setStartDate(null);
    setEndDate(null);
    setSelectedNotificationType(null);
  };

  /**
   * Handle confirm filters (could be used to apply filters or refresh)
   */
  const handleConfirmFilters = () => {
    // Filters are applied automatically via state changes
    // This could be used to log analytics or trigger other actions
    console.log("Filters applied:", {
      search,
      startDate,
      endDate,
      notificationType: selectedNotificationType
    });
  };

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
    // Only animate in unread tab
    if (activeTab === 'unread') {
      const unreadNotifications = filteredNotifications.filter(
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
      const delayBetweenAnimations = 84; // 84ms delay
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

      // After all animations complete, dispatch the API call
      const totalAnimationTime = visualOrderNotifications.length * delayBetweenAnimations + dateGroupAnimationDelay + 400;
      setTimeout(() => {
        dispatch(markAllAsRead());

        // Clear animating notifications and date groups after a delay
        setTimeout(() => {
          setAnimatingNotifications(new Set());
          setAnimatingDateGroups(new Set());
        }, 300);
      }, totalAnimationTime);
    } else {
      // In 'all' tab, just mark as read without animation
      dispatch(markAllAsRead());
    }
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
        <div className="flex items-center gap-2.5 w-full justify-center">
          <div className="flex-1 flex items-center">
            <p className="text-base font-semibold leading-[25.6px] m-0">
              <span className="text-[#74797d]">You have </span>
              <span className="text-[#0075bf]">{safeUnreadCount}</span>
              <span className="text-[#74797d]"> unread notifications</span>
            </p>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={() => {
                setActiveTab('all');
                setClickedTab('all');
                setTimeout(() => setClickedTab(null), 200);
              }}
              className={`w-[146px] px-4 py-2 rounded-md text-[15px] leading-[22px] transition-all ${
                activeTab === 'all'
                  ? 'bg-[#0075bf] text-white font-semibold shadow-none border-none'
                  : 'bg-white text-[#0075bf] font-normal border border-[#0075bf] shadow-none hover:bg-[#0075bf]/5'
              }`}
              style={{ boxShadow: 'none', outline: 'none' }}
            >
              All ({allCount})
            </button>

            <button
              onClick={() => {
                setActiveTab('unread');
                setClickedTab('unread');
                setTimeout(() => setClickedTab(null), 200);
              }}
              className={`w-[131px] px-4 py-2 rounded-md text-[15px] leading-[22px] transition-all ${
                activeTab === 'unread'
                  ? 'bg-[#0075bf] text-white font-semibold shadow-none border-none'
                  : 'bg-white text-[#0075bf] font-normal border border-[#0075bf] shadow-none hover:bg-[#0075bf]/5'
              }`}
              style={{ boxShadow: 'none', outline: 'none' }}
            >
              Unread ({unreadCountForTab})
            </button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex items-center gap-2 w-full justify-center my-5">
          <p className="flex flex-col w-auto m-0 whitespace-nowrap">Filter:</p>
          <NxSearchInput
            className="flex-[8]"
            placeholder="Search by title or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <NxDateRangePicker
            className="flex-[5]"
            value={[startDate, endDate]}
            onChange={([start, end]) => {
              setStartDate(start);
              setEndDate(end);
            }}
            size="middle"
            allowClear
            placeholder={["Start Date", "End Date"]}
          />
          <NxDropdownBase
            className="flex-[2]"
            options={["Show All", "Approval", "Warning", "Error", "Success", "Info", "System"]}
            value={selectedNotificationType || "Show All"}
            onChange={(value) => setSelectedNotificationType(value === "Show All" ? null : value)}
          />
          <NxTextButton
            className="flex-[0.5] text-center"
            variant="primary"
            onClick={handleConfirmFilters}
          >
            Confirm
          </NxTextButton>
          <NxTextButton
            className="flex-[0.5] text-center"
            variant="muted"
            onClick={handleClearFilters}
          >
            Clear
          </NxTextButton>
        </div>

        {/* Notification List */}
        <div
          key={activeTab}
          className="w-full notification-list"
          style={{
            maxHeight: 600,
            overflowY: "auto",
            marginTop: 16,
            animation: 'fadeSlideIn 0.3s ease-in-out',
            position: 'relative',
            // paddingBottom: 60
          }}
        >
          {filteredNotifications.length === 0 ? (
            <div style={{ padding: "40px 16px" }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  search || startDate || endDate || selectedNotificationType
                    ? "No notifications match your filters"
                    : "No notifications"
                }
              />
            </div>
          ) : (
            <div>
              {Object.entries(groupNotificationsByDate(paginatedNotifications)).map(([date, dateNotifications]) => (
                <div className="w-full flex flex-col" key={date}>
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
                        key={notification.id || notification.ID}
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

          {/* Pagination - Sticky at bottom right */}
          {filteredNotifications.length > 0 && (
            <div
              style={{
                position: 'sticky',
                bottom: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '12px 16px',
                backgroundColor: '#ffffff',
                // borderTop: '1px solid #f0f0f0',
                marginTop: '40px',
                zIndex: 10
              }}
            >
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalNotifications}
                onChange={(page, size) => {
                  setCurrentPage(page);
                  if (size !== pageSize) {
                    setPageSize(size);
                  }
                }}
                onShowSizeChange={(current, size) => {
                  setCurrentPage(1);
                  setPageSize(size);
                }}
                showSizeChanger
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} notifications`}
                pageSizeOptions={['10', '20', '50', '100']}
                size="default"
              />
            </div>
          )}
        </div>

      </NxPanel>
      <button
        onClick={() => {
            navigate("/");
        }}
        className={`w-[146px] mb-5 px-4 py-2 rounded-md text-[15px] leading-[22px] transition-all bg-[#0075bf] text-white font-semibold shadow-none border-none`}
        style={{ boxShadow: 'none', outline: 'none' }}
      >
        Back
      </button>
    </div>
  </LayoutMenu>
  );
};

export default NotificationHistory;
