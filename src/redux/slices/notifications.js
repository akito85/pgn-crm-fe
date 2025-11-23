import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notificationService from "../services/notificationService";

/**
 * Notification Types (extend as needed)
 */
export const NOTIFICATION_TYPES = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
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
      console.log(`[Notifications Slice] Connecting for user: ${userId}`);

      return new Promise((resolve, reject) => {
        notificationService.connect(userId, {
          onMessage: (notification) => {
            console.log("[Notifications Slice] Received notification:", notification);
            dispatch(addNotification(notification));
          },
          onError: (error) => {
            console.error("[Notifications Slice] Connection error:", error);
            dispatch(setConnectionError(error));
          },
          onConnect: (data) => {
            console.log("[Notifications Slice] Connected:", data);
            resolve(data);
          },
          onDisconnect: (data) => {
            console.log("[Notifications Slice] Disconnected:", data);
            dispatch(setConnectionStatus("disconnected"));
          },
        });

        // Set connecting status immediately
        dispatch(setConnectionStatus("connecting"));
      });
    } catch (error) {
      console.error("[Notifications Slice] Connect error:", error);
      return rejectWithValue({
        message: error.message || "Failed to connect to notification stream",
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
    console.log("[Notifications Slice] Disconnecting");
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
        console.log("[Notifications Slice] Notification already exists:", notification.id);
        return;
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

      console.log("[Notifications Slice] Notification added:", notification.id);
    },

    /**
     * Mark notification as read
     */
    markAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find((n) => n.id === notificationId);

      if (notification && !notification.read) {
        notification.read = true;
        notification.readAt = new Date().toISOString();
        state.unreadCount = Math.max(0, state.unreadCount - 1);

        console.log("[Notifications Slice] Marked as read:", notificationId);
      }
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        if (!notification.read) {
          notification.read = true;
          notification.readAt = new Date().toISOString();
        }
      });
      state.unreadCount = 0;

      console.log("[Notifications Slice] Marked all as read");
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

        console.log("[Notifications Slice] Notification removed:", notificationId);
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

      console.log("[Notifications Slice] All notifications cleared");
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

      console.log(`[Notifications Slice] Cleared ${direction} notifications`);
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

      console.log("[Notifications Slice] Connection status:", action.payload);
    },

    /**
     * Set connection error
     */
    setConnectionError: (state, action) => {
      state.connectionError = action.payload;
      state.connectionStatus = "error";
      state.reconnectAttempts += 1;

      console.error("[Notifications Slice] Connection error:", action.payload);
    },

    /**
     * Update filters
     */
    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };

      console.log("[Notifications Slice] Filters updated:", state.filters);
    },

    /**
     * Reset filters
     */
    resetFilters: (state) => {
      state.filters = initialState.filters;

      console.log("[Notifications Slice] Filters reset");
    },

    /**
     * Update settings
     */
    updateSettings: (state, action) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };

      console.log("[Notifications Slice] Settings updated:", state.settings);
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

        console.log("[Notifications Slice] Connected successfully");
      })
      .addCase(connectNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.connectionStatus = "error";
        state.error = action.payload?.message || "Failed to connect";
        state.connectionError = action.payload;

        console.error("[Notifications Slice] Connect failed:", action.payload);
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

        console.log("[Notifications Slice] Disconnected successfully");
      })
      .addCase(disconnectNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to disconnect";

        console.error("[Notifications Slice] Disconnect failed:", action.payload);
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
export const selectAllNotifications = (state) => state.notifications.notifications;

// Get filtered notifications
export const selectFilteredNotifications = (state) => {
  const { notifications, filters } = state.notifications;

  return notifications.filter((notification) => {
    // Filter by type
    if (filters.type && notification.type !== filters.type) {
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

    return true;
  });
};

// Get broadcast notifications
export const selectBroadcastNotifications = (state) =>
  state.notifications.broadcastNotifications;

// Get direct notifications
export const selectDirectNotifications = (state) =>
  state.notifications.directNotifications;

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
