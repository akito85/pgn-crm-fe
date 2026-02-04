/**
 * Notification API Service
 * Handle all API calls for notification operations
 */

import axios from "axios";
import { NOTIFICATION_CONFIG } from "../constants/configApp";
import { notificationTokenHeader } from "../utils/notificationTokenHeader";

// Use relative path for notification API to go through configured proxy
const NOTIFICATION_API_URL = NOTIFICATION_CONFIG.NOTIFICATION_SERVICE + "/v1/api/notification";

const notificationApi = {
  /**
   * Get user notifications with pagination and filtering
   * GET /v1/api/notification
   * @param {Object} params - Query parameters (page, size, sort, status, type, priority)
   */
  getUserNotifications: async (params = {}) => {
    try {
      // Remove userId from params since it's passed in the X-User-Id header
      const { userId, ...otherParams } = params;
      const config = {
        params: otherParams,
        headers: notificationTokenHeader(),
        withCredentials: true,
      };
      const response = await axios.get(NOTIFICATION_API_URL, config);
      return response?.data;
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  },

  /**
   * Get all user notifications (list endpoint)
   * GET /v1/api/notification/list
   * @param {string} userId - User ID to fetch notifications for
   * @param {Object} params - Query parameters (page, size, sort, status, type, priority)
   */
  getAllUserNotifications: async (userId, params = {}) => {
    try {
      const config = {
        params: {
          ...params,
          toUserId: userId
        },
        headers: notificationTokenHeader(),
        withCredentials: true,
      };
      const response = await axios.get(`${NOTIFICATION_API_URL}/list`, config);
      return response?.data;
    } catch (error) {
      console.error('Error fetching all user notifications:', error);
      throw error;
    }
  },

  /**
   * Get user's unread notifications count
   * GET /v1/api/notification/unread-count
   */
  getUnreadNotificationsCount: async () => {
    try {
      const headers = {
        ...notificationTokenHeader(),
        'Content-Type': 'application/json',
      };
      const config = {
        headers,
        withCredentials: true,
      };
      const response = await axios.get(`${NOTIFICATION_API_URL}/unread-count`, config);
      return response?.data;
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
      throw error;
    }
  },

  /**
   * Get user's unread notifications only
   * GET /v1/api/notification/unread
   * @param {Object} params - Query parameters (page, size, sort)
   */
  getUnreadNotifications: async (params = {}) => {
    try {
      // Remove userId from params since it's passed in the X-User-Id header
      const { userId, ...otherParams } = params;

      const config = {
        params: otherParams,
        headers: notificationTokenHeader(),
        withCredentials: true,
      };
      const response = await axios.get(`${NOTIFICATION_API_URL}/unread`, config);
      return response?.data;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      throw error;
    }
  },

  /**
   * Mark a single notification as read
   * PATCH /v1/api/notification/{id}/read
   * @param {number} notificationId - Notification ID
   */
  markNotificationAsRead: async (notificationId) => {
    try {
      const config = {
        headers: {
          ...notificationTokenHeader(),
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };
      const response = await axios.patch(`${NOTIFICATION_API_URL}/${notificationId}/read`, {}, config);
      return response?.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark multiple notification as read
   * PUT /v1/api/notification/mark-read
   * @param {Array} notificationIds - Array of notification IDs
   */
  markNotificationsAsRead: async (notificationIds) => {
    try {
      const headers = {
        ...notificationTokenHeader(),
        'Content-Type': 'application/json',
      };
      const config = {
        headers,
        withCredentials: true,
      };
      const response = await axios.put(
        `${NOTIFICATION_API_URL}/mark-read`,
        { notificationIds },
        config
      );
      return response?.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark all user notification as read
   * PATCH /v1/api/notification/read-all
   */
  markAllNotificationsAsRead: async () => {
    try {
      const headers = {
        ...notificationTokenHeader(),
        'Content-Type': 'application/json',
      };
      const config = {
        headers,
        withCredentials: true,
      };
      const response = await axios.patch(`${NOTIFICATION_API_URL}/read-all`, {}, config);
      return response?.data;
    } catch (error) {
      console.error('Error marking all notification as read:', error);
      throw error;
    }
  },

  /**
   * Delete a single notification
   * DELETE /v1/api/notification/{id}
   * @param {number} notificationId - Notification ID
   */
  deleteNotification: async (notificationId) => {
    try {
      const config = {
        headers: notificationTokenHeader(),
        withCredentials: true,
      };
      const response = await axios.delete(`${NOTIFICATION_API_URL}/${notificationId}`, config);
      return response?.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  /**
   * Delete multiple notification
   * DELETE /v1/api/notification
   * @param {Array} notificationIds - Array of notification IDs
   */
  deleteNotifications: async (notificationIds) => {
    try {
      const headers = {
        ...notificationTokenHeader(),
        'Content-Type': 'application/json',
      };
      const config = {
        data: { notificationIds },
        headers,
        withCredentials: true,
      };
      const response = await axios.delete(NOTIFICATION_API_URL, config);
      return response?.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  /**
   * Delete all user notification
   * DELETE /v1/api/notification/all
   */
  deleteAllNotifications: async () => {
    try {
      const headers = {
        ...notificationTokenHeader(),
        'Content-Type': 'application/json',
      };
      const config = {
        headers,
        withCredentials: true,
      };
      const response = await axios.delete(`${NOTIFICATION_API_URL}/all`, config);
      return response?.data;
    } catch (error) {
      console.error('Error deleting all notification:', error);
      throw error;
    }
  },

  /**
   * Bulk update notification (mark as read, delete, etc.)
   * PUT /v1/api/notification/bulk
   * @param {Object} bulkAction - Bulk action object { action: 'read'|'delete', notificationIds: [] }
   */
  bulkUpdateNotifications: async (bulkAction) => {
    try {
      const headers = {
        ...notificationTokenHeader(),
        'Content-Type': 'application/json',
      };
      const config = {
        headers,
        withCredentials: true,
      };
      const response = await axios.put(`${NOTIFICATION_API_URL}/bulk`, bulkAction, config);
      return response?.data;
    } catch (error) {
      console.error('Error performing bulk update on notification:', error);
      throw error;
    }
  },

  /**
   * Send a new notification (for admin/sender functionality)
   * POST /v1/api/notification
   * @param {Object} notificationData - Notification data to send
   */
  sendNotification: async (notificationData) => {
    try {
      const config = {
        headers: notificationTokenHeader(),
        withCredentials: true,
      };
      const response = await axios.post(NOTIFICATION_API_URL, notificationData, config);
      return response?.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  },

  /**
   * Get notification settings for user
   * GET /v1/api/notification/settings
   */
  getNotificationSettings: async () => {
    try {
      const config = {
        headers: notificationTokenHeader(),
        withCredentials: true,
      };
      const response = await axios.get(`${NOTIFICATION_API_URL}/settings`, config);
      return response?.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  },

  /**
   * Update notification settings for user
   * PUT /v1/api/notification/settings
   * @param {Object} settings - Notification settings to update
   */
  updateNotificationSettings: async (settings) => {
    try {
      const config = {
        headers: notificationTokenHeader(),
        withCredentials: true,
      };
      const response = await axios.put(`${NOTIFICATION_API_URL}/settings`, settings, config);
      return response?.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },

  /**
   * Get global notification settings
   * GET /v1/api/notification/settings/global
   * Returns system-wide defaults, available modules, and notification types
   */
  getGlobalSettings: async () => {
    try {
      const config = {
        headers: notificationTokenHeader(),
        withCredentials: true,
      };
      const response = await axios.get(`${NOTIFICATION_API_URL}/settings/global`, config);
      return response?.data;
    } catch (error) {
      console.error('Error fetching global notification settings:', error);
      throw error;
    }
  },

  /**
   * Update global notification settings (Admin only)
   * PUT /v1/api/notification/settings/global
   * @param {Object} settings - Global settings to update
   */
  updateGlobalSettings: async (settings) => {
    try {
      const config = {
        headers: notificationTokenHeader(),
        withCredentials: true,
      };
      const response = await axios.put(`${NOTIFICATION_API_URL}/settings/global`, settings, config);
      return response?.data;
    } catch (error) {
      console.error('Error updating global notification settings:', error);
      throw error;
    }
  },

  /**
   * Register session for notification authentication
   * POST /v1/api/notification/register
   * Creates HttpSession and returns session cookie
   * @param {string} userId - User ID to register session for
   */
  registerSession: async (userId) => {
    try {
      const config = {
        headers: notificationTokenHeader(),
        withCredentials: true,
      };
      const response = await axios.post(
        `${NOTIFICATION_API_URL}/register`,
        { userId },
        config
      );
      return response?.data;
    } catch (error) {
      console.error('[NotificationApi] Error registering session:', error);
      throw error;
    }
  },

  /**
   * Validate current session
   * GET /v1/api/notification/validate
   * Checks if session cookie is valid
   */
  validateSession: async () => {
    try {
      const config = {
        headers: notificationTokenHeader(),
        withCredentials: true,
      };
      const response = await axios.get(`${NOTIFICATION_API_URL}/validate`, config);
      return response?.data;
    } catch (error) {
      console.error('[NotificationApi] Error validating session:', error);
      throw error;
    }
  },

  /**
   * Get current session info
   * GET /v1/api/notification/session
   * Returns session details (userId, expiresIn, etc.)
   */
  getSessionInfo: async () => {
    try {
      const config = {
        headers: notificationTokenHeader(),
        withCredentials: true,
      };
      const response = await axios.get(`${NOTIFICATION_API_URL}/session`, config);
      return response?.data;
    } catch (error) {
      console.error('[NotificationApi] Error getting session info:', error);
      throw error;
    }
  },

  /**
   * Unregister/invalidate current session
   * POST /v1/api/notification/unregister
   * Invalidates HttpSession and clears session cookie
   */
  unregisterSession: async () => {
    try {
      const config = {
        headers: notificationTokenHeader(),
        withCredentials: true,
      };
      const response = await axios.post(`${NOTIFICATION_API_URL}/unregister`, {}, config);
      return response?.data;
    } catch (error) {
      console.error('[NotificationApi] Error unregistering session:', error);
      throw error;
    }
  },
};

export default notificationApi;
