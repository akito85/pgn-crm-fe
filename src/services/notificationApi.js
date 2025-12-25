/**
 * Notification API Service
 * Handle all API calls for notification operations
 */

import axios from "axios";
import { notificationTokenHeader } from "../utils/notificationTokenHeader";

// Use full URL for notification API (different from SSE endpoint)
const NOTIFICATION_API_URL = "http://localhost:8080/ntf/v1/dbs/api/notifications";

const notificationApi = {
  /**
   * Get user notifications with pagination and filtering
   * GET /v1/dbs/api/notifications
   * @param {Object} params - Query parameters (page, size, sort, status, type, priority)
   */
  getUserNotifications: async (params = {}) => {
    try {
      const config = {
        params: params,
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
   * Get user's unread notifications count
   * GET /v1/dbs/api/notifications/unread-count
   */
  getUnreadNotificationsCount: async () => {
    try {
      const config = {
        headers: notificationTokenHeader(),
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
   * GET /v1/dbs/api/notifications/unread
   * @param {Object} params - Query parameters (page, size, sort)
   */
  getUnreadNotifications: async (params = {}) => {
    try {
      const config = {
        params: params,
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
   * PATCH /v1/dbs/api/notifications/{id}/read
   * @param {number} notificationId - Notification ID
   */
  markNotificationAsRead: async (notificationId) => {
    try {
      const config = {
        headers: notificationTokenHeader(),
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
   * Mark multiple notifications as read
   * PUT /v1/dbs/api/notifications/mark-read
   * @param {Array} notificationIds - Array of notification IDs
   */
  markNotificationsAsRead: async (notificationIds) => {
    try {
      const config = {
        headers: notificationTokenHeader(),
        withCredentials: true,
      };
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
   * PUT /v1/dbs/api/notifications/read-all
   */
  markAllNotificationsAsRead: async () => {
    try {
      const config = {
        headers: notificationTokenHeader(),
        withCredentials: true,
      };
      const response = await axios.patch(`${NOTIFICATION_API_URL}/read-all`, {}, config);
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
   * Delete multiple notifications
   * DELETE /v1/dbs/api/notifications
   * @param {Array} notificationIds - Array of notification IDs
   */
  deleteNotifications: async (notificationIds) => {
    try {
      const config = {
        data: { notificationIds },
        headers: notificationTokenHeader(),
        withCredentials: true,
      };
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
      const config = {
        headers: notificationTokenHeader(),
        withCredentials: true,
      };
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
      const config = {
        headers: notificationTokenHeader(),
        withCredentials: true,
      };
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
   * GET /v1/dbs/api/notifications/settings
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
   * PUT /v1/dbs/api/notifications/settings
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
   * Register session for notification authentication
   * POST /v1/dbs/api/notifications/register
   * Creates HttpSession and returns session cookie
   * @param {string} userId - User ID to register session for
   */
  registerSession: async (userId) => {
    try {
      console.log('[NotificationApi] Registering session for user:', userId);
      const config = {
        headers: notificationTokenHeader(),
        withCredentials: true,
      };
      const response = await axios.post(
        `${NOTIFICATION_API_URL}/register`,
        { userId },
        config
      );
      console.log('[NotificationApi] Session registered:', response?.data);
      return response?.data;
    } catch (error) {
      console.error('[NotificationApi] Error registering session:', error);
      throw error;
    }
  },

  /**
   * Validate current session
   * GET /v1/dbs/api/notifications/validate
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
   * GET /v1/dbs/api/notifications/session
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
   * POST /v1/dbs/api/notifications/unregister
   * Invalidates HttpSession and clears session cookie
   */
  unregisterSession: async () => {
    try {
      console.log('[NotificationApi] Unregistering session');
      const config = {
        headers: notificationTokenHeader(),
        withCredentials: true,
      };
      const response = await axios.post(`${NOTIFICATION_API_URL}/unregister`, {}, config);
      console.log('[NotificationApi] Session unregistered');
      return response?.data;
    } catch (error) {
      console.error('[NotificationApi] Error unregistering session:', error);
      throw error;
    }
  },
};

export default notificationApi;
