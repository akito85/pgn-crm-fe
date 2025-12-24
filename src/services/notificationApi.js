/**
 * Notification API Service
 * Handle all API calls for notification operations
 *
 * NOTE: Uses lightweight authentication headers to avoid "Request Header Too Large" errors
 * caused by oversized JWT tokens in the Authorization header.
 */

import axios from "axios";
import { configApp } from "../constants/configApp";
import { notificationTokenHeader } from "../utils/notificationTokenHeader";

const BASE_URL = configApp.NOTIFICATION_SERVICE;
const API_PATH = "/v1/dbs/api/notifications";

// Construct the full API endpoint URL
const NOTIFICATION_API_URL = `${BASE_URL}${API_PATH}`;

/**
 * Create axios config with lightweight auth headers
 * Avoids sending the full JWT token which causes header size issues
 */
const createConfig = (additionalConfig = {}) => {
  return {
    ...additionalConfig,
    headers: {
      ...notificationTokenHeader(),
      ...additionalConfig.headers,
    },
    // Enable credentials for cookie-based auth if backend uses it
    withCredentials: true,
  };
};

const notificationApi = {
  /**
   * Get user notifications with pagination and filtering
   * GET /v1/dbs/api/notifications
   * @param {Object} params - Query parameters (page, size, sort, status, type, priority)
   */
  getUserNotifications: async (params = {}) => {
    try {
      const config = createConfig({ params });
      const response = await axios.get(NOTIFICATION_API_URL, config);
      return response?.data;
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  },

  /**
   * Get user's unread notifications count
   * GET /v1/dbs/api/notifications/unread-count
   */
  getUnreadNotificationsCount: async () => {
    try {
      const config = createConfig();
      const response = await axios.get(`${NOTIFICATION_API_URL}/unread-count`, config);
      return response?.data;
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
      throw error;
    }
  },

  /**
   * Get user's unread notifications only
   * GET /v1/dbs/api/notifications/unread
   * @param {Object} params - Query parameters (page, size, sort)
   */
  getUnreadNotifications: async (params = {}) => {
    try {
      const config = createConfig({ params });
      const response = await axios.get(`${NOTIFICATION_API_URL}/unread`, config);
      return response?.data;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      throw error;
    }
  },

  /**
   * Mark a single notification as read
   * PUT /v1/dbs/api/notifications/{id}/read
   * @param {number} notificationId - Notification ID
   */
  markNotificationAsRead: async (notificationId) => {
    try {
      const config = createConfig();
      const response = await axios.put(`${NOTIFICATION_API_URL}/${notificationId}/read`, {}, config);
      return response?.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark multiple notifications as read
   * PUT /v1/dbs/api/notifications/mark-read
   * @param {Array} notificationIds - Array of notification IDs
   */
  markNotificationsAsRead: async (notificationIds) => {
    try {
      const config = createConfig();
      const response = await axios.put(
        `${NOTIFICATION_API_URL}/mark-read`,
        { notificationIds },
        config
      );
      return response?.data;
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  },

  /**
   * Mark all user notifications as read
   * PUT /v1/dbs/api/notifications/mark-all-read
   */
  markAllNotificationsAsRead: async () => {
    try {
      const config = createConfig();
      const response = await axios.put(`${NOTIFICATION_API_URL}/mark-all-read`, {}, config);
      return response?.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Delete a single notification
   * DELETE /v1/dbs/api/notifications/{id}
   * @param {number} notificationId - Notification ID
   */
  deleteNotification: async (notificationId) => {
    try {
      const config = createConfig();
      const response = await axios.delete(`${NOTIFICATION_API_URL}/${notificationId}`, config);
      return response?.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  /**
   * Delete multiple notifications
   * DELETE /v1/dbs/api/notifications
   * @param {Array} notificationIds - Array of notification IDs
   */
  deleteNotifications: async (notificationIds) => {
    try {
      const config = createConfig({ data: { notificationIds } });
      const response = await axios.delete(NOTIFICATION_API_URL, config);
      return response?.data;
    } catch (error) {
      console.error('Error deleting notifications:', error);
      throw error;
    }
  },

  /**
   * Delete all user notifications
   * DELETE /v1/dbs/api/notifications/all
   */
  deleteAllNotifications: async () => {
    try {
      const config = createConfig();
      const response = await axios.delete(`${NOTIFICATION_API_URL}/all`, config);
      return response?.data;
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  },

  /**
   * Bulk update notifications (mark as read, delete, etc.)
   * PUT /v1/dbs/api/notifications/bulk
   * @param {Object} bulkAction - Bulk action object { action: 'read'|'delete', notificationIds: [] }
   */
  bulkUpdateNotifications: async (bulkAction) => {
    try {
      const config = createConfig();
      const response = await axios.put(`${NOTIFICATION_API_URL}/bulk`, bulkAction, config);
      return response?.data;
    } catch (error) {
      console.error('Error performing bulk update on notifications:', error);
      throw error;
    }
  },

  /**
   * Send a new notification (for admin/sender functionality)
   * POST /v1/dbs/api/notifications
   * @param {Object} notificationData - Notification data to send
   */
  sendNotification: async (notificationData) => {
    try {
      const config = createConfig();
      const response = await axios.post(NOTIFICATION_API_URL, notificationData, config);
      return response?.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  },

  /**
   * Get notification settings for user
   * GET /v1/dbs/api/notifications/settings
   */
  getNotificationSettings: async () => {
    try {
      const config = createConfig();
      const response = await axios.get(`${NOTIFICATION_API_URL}/settings`, config);
      return response?.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  },

  /**
   * Update notification settings for user
   * PUT /v1/dbs/api/notifications/settings
   * @param {Object} settings - Notification settings to update
   */
  updateNotificationSettings: async (settings) => {
    try {
      const config = createConfig();
      const response = await axios.put(`${NOTIFICATION_API_URL}/settings`, settings, config);
      return response?.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },
};

export default notificationApi;