import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notificationService from "../services/notificationService";
import notificationApi from "../../services/notificationApi";

/**
 * Notification Types (aligned with Oracle schema)
 */
export const NOTIFICATION_TYPES = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
  APPROVAL: "approval",
  SYSTEM: "system",
  MESSAGE: "message",
  ALERT: "alert",
};

/**
 * Notification Priority
 */
export const NOTIFICATION_PRIORITY = {
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
  URGENT: "urgent",
};

/**
 * Initial State
 */
const initialState = {
  // Connection state
  connectionStatus: "disconnected", // 'disconnected', 'connecting', 'connected', 'error'
  connectionError: null,
  reconnectAttempts: 0,
  lastConnected: null,

  // Notifications
  notifications: [], // All notifications
  unreadCount: 0,
  broadcastNotifications: [], // Notifications for all users
  directNotifications: [], // Notifications for specific user

  // UI State
  isLoading: false,
  error: null,

  // Filters
  filters: {
    type: null, // Filter by notification type
    priority: null, // Filter by priority
    unreadOnly: false, // Show only unread
    direction: "all", // 'all', 'broadcast', 'direct'
    module: null, // Filter by module (user-management, account-management, etc.)
    entityType: null, // Filter by entity type (user, sa, payment-relation, etc.)
  },

  // Settings
  settings: {
    soundEnabled: true,
    desktopNotificationsEnabled: false,
    maxNotifications: 100, // Maximum notifications to keep in state
  },
};

/**
 * Async Thunks
 */

/**
 * Connect to notification stream
 */
export const connectNotifications = createAsyncThunk(
  "notifications/connect",
  async ({ userId }, { dispatch, rejectWithValue }) => {
    try {

      return new Promise((resolve, reject) => {

        notificationService.connect(userId, {
          onMessage: (notification) => {
            dispatch(addNotification(notification));
          },
          onError: (error) => {
            dispatch(setConnectionError(error));
          },
          onConnect: (data) => {
            resolve(data);
          },
          onDisconnect: (data) => {
            dispatch(setConnectionStatus("disconnected"));
          },
        });

        // Set connecting status immediately
        dispatch(setConnectionStatus("connecting"));
      });
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Failed to connect to notification stream",
        error,
      });
    }
  }
);

/**
 * Fetch user notifications from API
 */
export const fetchUserNotifications = createAsyncThunk(
  "notifications/fetchUserNotifications",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getUserNotifications(params);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Failed to fetch notifications",
        error,
      });
    }
  }
);

/**
 * Fetch all user notifications from API (list endpoint)
 */
export const fetchAllUserNotifications = createAsyncThunk(
  "notifications/fetchAllUserNotifications",
  async ({ userId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getAllUserNotifications(userId, params);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Failed to fetch all notifications",
        error,
      });
    }
  }
);

/**
 * Fetch unread notifications count from API
 */
export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getUnreadNotificationsCount();
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Failed to fetch unread count",
        error,
      });
    }
  }
);

/**
 * Fetch unread notifications from API
 */
export const fetchUnreadNotifications = createAsyncThunk(
  "notifications/fetchUnreadNotifications",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getUnreadNotifications(params);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Failed to fetch unread notifications",
        error,
      });
    }
  }
);

/**
 * Mark notification as read via API
 */
export const markNotificationAsReadApi = createAsyncThunk(
  "notifications/markNotificationAsReadApi",
  async (notificationId, { dispatch, rejectWithValue }) => {
    try {
      const response = await notificationApi.markNotificationAsRead(notificationId);
      // Update local state as well
      dispatch(markAsRead(notificationId));
      // Return a simple success indicator instead of the full response to avoid rendering issues
      return { success: true };
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Failed to mark notification as read",
        error,
      });
    }
  }
);

/**
 * Mark all notifications as read via API
 */
export const markAllNotificationsAsReadApi = createAsyncThunk(
  "notifications/markAllNotificationsAsReadApi",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await notificationApi.markAllNotificationsAsRead();
      // Update local state as well
      dispatch(markAllAsRead());
      // Return a simple success indicator instead of the full response to avoid rendering issues
      return { success: true };
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Failed to mark all notifications as read",
        error,
      });
    }
  }
);

/**
 * Delete notification via API
 */
export const deleteNotificationApi = createAsyncThunk(
  "notifications/deleteNotificationApi",
  async (notificationId, { dispatch, rejectWithValue }) => {
    try {
      const response = await notificationApi.deleteNotification(notificationId);
      // Update local state as well
      dispatch(removeNotification(notificationId));
      // Return a simple success indicator instead of the full response to avoid rendering issues
      return { success: true };
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Failed to delete notification",
        error,
      });
    }
  }
);

/**
 * Disconnect from notification stream
 */
export const disconnectNotifications = createAsyncThunk(
  "notifications/disconnect",
  async (_, { dispatch }) => {
    notificationService.disconnect();
    dispatch(setConnectionStatus("disconnected"));
    return { disconnected: true };
  }
);

/**
 * Slice
 */
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    /**
     * Add a new notification
     */
    addNotification: (state, action) => {
      const notification = action.payload;

      // Check if notification already exists
      const exists = state.notifications.some((n) => n.id === notification.id);
      if (exists) {
        return;
      }

      // Ensure status properties are set for UI compatibility
      if (notification.read) {
        notification.STATUS = "read";
        notification.status = "read";
      } else {
        notification.STATUS = "unread";
        notification.status = "unread";
      }

      // Add to main notifications array
      state.notifications.unshift(notification);

      // Add to direction-specific arrays
      if (notification.direction === "broadcast") {
        state.broadcastNotifications.unshift(notification);
      } else {
        state.directNotifications.unshift(notification);
      }

      // Update unread count
      if (!notification.read) {
        state.unreadCount += 1;
      }

      // Enforce max notifications limit
      const maxNotifications = state.settings.maxNotifications;
      if (state.notifications.length > maxNotifications) {
        const removed = state.notifications.pop();

        // Remove from direction-specific arrays
        if (removed.direction === "broadcast") {
          const index = state.broadcastNotifications.findIndex((n) => n.id === removed.id);
          if (index !== -1) state.broadcastNotifications.splice(index, 1);
        } else {
          const index = state.directNotifications.findIndex((n) => n.id === removed.id);
          if (index !== -1) state.directNotifications.splice(index, 1);
        }
      }

    },

    /**
     * Mark notification as read
     */
    markAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find((n) => n.id === notificationId);

      if (notification && !notification.read) {
        notification.read = true;
        notification.STATUS = "read"; // Set STATUS for UI compatibility
        notification.status = "read"; // Set status for UI compatibility
        notification.readAt = new Date().toISOString();
        state.unreadCount = Math.max(0, state.unreadCount - 1);

      }
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        if (!notification.read) {
          notification.read = true;
          notification.STATUS = "read"; // Set STATUS for UI compatibility
          notification.status = "read"; // Set status for UI compatibility
          notification.readAt = new Date().toISOString();
        }
      });
      state.unreadCount = 0;

    },

    /**
     * Remove notification
     */
    removeNotification: (state, action) => {
      const notificationId = action.payload;
      const index = state.notifications.findIndex((n) => n.id === notificationId);

      if (index !== -1) {
        const removed = state.notifications[index];

        // Update unread count
        if (!removed.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }

        // Remove from main array
        state.notifications.splice(index, 1);

        // Remove from direction-specific arrays
        if (removed.direction === "broadcast") {
          const broadcastIndex = state.broadcastNotifications.findIndex((n) => n.id === notificationId);
          if (broadcastIndex !== -1) state.broadcastNotifications.splice(broadcastIndex, 1);
        } else {
          const directIndex = state.directNotifications.findIndex((n) => n.id === notificationId);
          if (directIndex !== -1) state.directNotifications.splice(directIndex, 1);
        }

      }
    },

    /**
     * Clear all notifications
     */
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.broadcastNotifications = [];
      state.directNotifications = [];
      state.unreadCount = 0;

    },

    /**
     * Clear notifications by direction
     */
    clearNotificationsByDirection: (state, action) => {
      const direction = action.payload; // 'broadcast' or 'direct'

      if (direction === "broadcast") {
        // Remove broadcast notifications from main array
        state.notifications = state.notifications.filter((n) => n.direction !== "broadcast");
        // Update unread count
        const unreadBroadcasts = state.broadcastNotifications.filter((n) => !n.read).length;
        state.unreadCount = Math.max(0, state.unreadCount - unreadBroadcasts);
        // Clear broadcast array
        state.broadcastNotifications = [];
      } else if (direction === "direct") {
        // Remove direct notifications from main array
        state.notifications = state.notifications.filter((n) => n.direction !== "direct");
        // Update unread count
        const unreadDirect = state.directNotifications.filter((n) => !n.read).length;
        state.unreadCount = Math.max(0, state.unreadCount - unreadDirect);
        // Clear direct array
        state.directNotifications = [];
      }

    },

    /**
     * Set connection status
     */
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;

      if (action.payload === "connected") {
        state.lastConnected = new Date().toISOString();
        state.connectionError = null;
        state.reconnectAttempts = 0;
      }

    },

    /**
     * Set connection error
     */
    setConnectionError: (state, action) => {
      state.connectionError = action.payload;
      state.connectionStatus = "error";
      state.reconnectAttempts += 1;
    },

    /**
     * Update filters
     */
    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };

    },

    /**
     * Reset filters
     */
    resetFilters: (state) => {
      state.filters = initialState.filters;

    },

    /**
     * Update settings
     */
    updateSettings: (state, action) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };

    },
  },

  extraReducers: (builder) => {
    // Connect notifications
    builder
      .addCase(connectNotifications.pending, (state) => {
        state.isLoading = true;
        state.connectionStatus = "connecting";
        state.error = null;
      })
      .addCase(connectNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.connectionStatus = "connected";
        state.lastConnected = action.payload.timestamp;
        state.connectionError = null;
        state.reconnectAttempts = 0;

      })
      .addCase(connectNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.connectionStatus = "error";
        state.error = action.payload?.message || "Failed to connect";
        state.connectionError = action.payload;
      });

    // Fetch user notifications
    builder
      .addCase(fetchUserNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update notifications array with API response
        // API returns { data: { content: [...], ...pagination } }, so get the content array
        state.notifications = action.payload.data?.content || action.payload.data || action.payload || [];
      })
      .addCase(fetchUserNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch notifications";
      })
      .addCase(fetchAllUserNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUserNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update notifications array with API response from list endpoint
        // API returns { data: { content: [...], ...pagination } }, so get the content array
        state.notifications = action.payload.data?.content || action.payload.data || action.payload || [];
      })
      .addCase(fetchAllUserNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch all notifications";
      });

    // Fetch unread count
    builder
      .addCase(fetchUnreadCount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update unread count from API response
        // Use nullish coalescing (??) to properly handle 0 as a valid count
        state.unreadCount = action.payload?.count ?? action.payload?.unreadCount ?? 0;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch unread count";
      });

    // Fetch unread notifications
    builder
      .addCase(fetchUnreadNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update notifications array with unread notifications
        const unreadNotifications = action.payload.data || action.payload;
        // Add to state, ensuring no duplicates
        unreadNotifications.forEach(notification => {
          const exists = state.notifications.some(n => n.id === notification.id);
          if (!exists) {
            state.notifications.unshift(notification);
          }
        });
      })
      .addCase(fetchUnreadNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch unread notifications";
      });

    // Mark notification as read via API
    builder
      .addCase(markNotificationAsReadApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(markNotificationAsReadApi.fulfilled, (state, action) => {
        state.isLoading = false;
        // State is already updated via dispatch in the thunk
      })
      .addCase(markNotificationAsReadApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to mark notification as read";
      });

    // Mark all notifications as read via API
    builder
      .addCase(markAllNotificationsAsReadApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(markAllNotificationsAsReadApi.fulfilled, (state, action) => {
        state.isLoading = false;
        // State is already updated via dispatch in the thunk
      })
      .addCase(markAllNotificationsAsReadApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to mark all notifications as read";
      });

    // Delete notification via API
    builder
      .addCase(deleteNotificationApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteNotificationApi.fulfilled, (state, action) => {
        state.isLoading = false;
        // State is already updated via dispatch in the thunk
      })
      .addCase(deleteNotificationApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to delete notification";
      });

    // Disconnect notifications
    builder
      .addCase(disconnectNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(disconnectNotifications.fulfilled, (state) => {
        state.isLoading = false;
        state.connectionStatus = "disconnected";
        state.connectionError = null;

      })
      .addCase(disconnectNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to disconnect";
      });
  },
});

/**
 * Actions
 */
export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  clearNotificationsByDirection,
  setConnectionStatus,
  setConnectionError,
  updateFilters,
  resetFilters,
  updateSettings,
} = notificationsSlice.actions;

/**
 * Selectors
 */

// Get all notifications
export const selectAllNotifications = (state) => {
  const notifications = state.notifications?.notifications;
  return Array.isArray(notifications) ? notifications : [];
};

// Get filtered notifications
export const selectFilteredNotifications = (state) => {
  const { notifications, filters } = state.notifications;

  // Ensure notifications is an array before filtering
  if (!Array.isArray(notifications)) {
    return [];
  }

  return notifications.filter((notification) => {
    // Filter by type
    if (filters.type && notification.notificationType !== filters.type) {
      return false;
    }

    // Filter by priority
    if (filters.priority && notification.priority !== filters.priority) {
      return false;
    }

    // Filter by read status
    if (filters.unreadOnly && notification.read) {
      return false;
    }

    // Filter by direction
    if (filters.direction !== "all") {
      if (filters.direction !== notification.direction) {
        return false;
      }
    }

    // Filter by module
    if (filters.module && notification.module !== filters.module) {
      return false;
    }

    // Filter by entity type
    if (filters.entityType && notification.entityType !== filters.entityType) {
      return false;
    }

    return true;
  });
};

// Get broadcast notifications
export const selectBroadcastNotifications = (state) => {
  const notifications = state.notifications?.broadcastNotifications;
  return Array.isArray(notifications) ? notifications : [];
};

// Get direct notifications
export const selectDirectNotifications = (state) => {
  const notifications = state.notifications?.directNotifications;
  return Array.isArray(notifications) ? notifications : [];
};

// Get unread count
export const selectUnreadCount = (state) => state.notifications.unreadCount;

// Get connection status
export const selectConnectionStatus = (state) =>
  state.notifications.connectionStatus;

// Get connection error
export const selectConnectionError = (state) =>
  state.notifications.connectionError;

// Get filters
export const selectFilters = (state) => state.notifications.filters;

// Get settings
export const selectSettings = (state) => state.notifications.settings;

// Check if connected
export const selectIsConnected = (state) =>
  state.notifications.connectionStatus === "connected";

// Get latest notification
export const selectLatestNotification = (state) =>
  state.notifications.notifications[0] || null;

/**
 * Export reducer
 */
export default notificationsSlice.reducer;
