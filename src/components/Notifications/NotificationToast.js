import React from 'react';
import { notification } from 'antd';
import {
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  AuditOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import {
  getAntdMessageType,
  formatNotificationTitle,
  formatNotificationMessage,
} from './constants/displayTypes';

/**
 * Toast Notification Display
 * Uses Ant Design's notification API to show corner popups
 * Auto-dismisses after 4.5 seconds
 * Maximum 3 stacked notifications
 */

// Configure notification global settings
notification.config({
  placement: 'topRight',
  top: 70,
  duration: 4.5,
  maxCount: 3,
});

// Icon mapping for notification types
const ICON_MAP = {
  info: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
  success: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
  warning: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
  error: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
  approval: <AuditOutlined style={{ color: '#722ed1' }} />,
  broadcast: <NotificationOutlined style={{ color: '#13c2c2' }} />,
};

/**
 * Show a toast notification
 *
 * @param {Object} notificationData - Notification object
 * @param {Function} onNavigate - Callback when notification is clicked (optional)
 * @param {Function} onClose - Callback when notification is closed (optional)
 */
export const showToastNotification = (notificationData, onNavigate, onClose) => {
  if (!notificationData) return;

  const notificationType = notificationData.notificationType || 'info';
  const title = formatNotificationTitle(notificationData);
  const message = formatNotificationMessage(notificationData, 150); // Limit to 150 chars
  const antdType = getAntdMessageType(notificationType);
  const icon = ICON_MAP[notificationType] || ICON_MAP.info;

  // Build notification config
  const config = {
    key: `toast-${notificationData.id || Date.now()}`,
    message: title,
    description: message,
    icon: icon,
    duration: 4.5,
    onClick: () => {
      if (onNavigate && typeof onNavigate === 'function') {
        onNavigate(notificationData);
      }
      notification.close(config.key);
    },
    onClose: () => {
      if (onClose && typeof onClose === 'function') {
        onClose(notificationData);
      }
    },
    style: {
      cursor: 'pointer',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  };

  // Show notification using Ant Design API
  notification[antdType](config);
};

/**
 * Close a specific toast notification
 *
 * @param {string|number} notificationId - ID of notification to close
 */
export const closeToastNotification = (notificationId) => {
  notification.close(`toast-${notificationId}`);
};

/**
 * Close all toast notifications
 */
export const closeAllToastNotifications = () => {
  notification.destroy();
};

/**
 * Show multiple toast notifications in sequence
 *
 * @param {Array} notifications - Array of notification objects
 * @param {Function} onNavigate - Navigation callback
 * @param {number} delay - Delay between notifications in ms (default: 500)
 */
export const showToastSequence = (notifications, onNavigate, delay = 500) => {
  if (!notifications || !Array.isArray(notifications)) return;

  notifications.forEach((notif, index) => {
    setTimeout(() => {
      showToastNotification(notif, onNavigate);
    }, index * delay);
  });
};

/**
 * Show an error toast notification
 * Convenience method for error notifications
 *
 * @param {string} message - Error message
 * @param {string} title - Error title (optional)
 */
export const showErrorToast = (message, title = 'Error') => {
  notification.error({
    message: title,
    description: message,
    icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
    duration: 4.5,
    style: {
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  });
};

/**
 * Show a success toast notification
 * Convenience method for success notifications
 *
 * @param {string} message - Success message
 * @param {string} title - Success title (optional)
 */
export const showSuccessToast = (message, title = 'Success') => {
  notification.success({
    message: title,
    description: message,
    icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    duration: 4.5,
    style: {
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  });
};

/**
 * Show a warning toast notification
 * Convenience method for warning notifications
 *
 * @param {string} message - Warning message
 * @param {string} title - Warning title (optional)
 */
export const showWarningToast = (message, title = 'Warning') => {
  notification.warning({
    message: title,
    description: message,
    icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
    duration: 4.5,
    style: {
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  });
};

/**
 * Show an info toast notification
 * Convenience method for info notifications
 *
 * @param {string} message - Info message
 * @param {string} title - Info title (optional)
 */
export const showInfoToast = (message, title = 'Information') => {
  notification.info({
    message: title,
    description: message,
    icon: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
    duration: 4.5,
    style: {
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  });
};

export default {
  showToastNotification,
  closeToastNotification,
  closeAllToastNotifications,
  showToastSequence,
  showErrorToast,
  showSuccessToast,
  showWarningToast,
  showInfoToast,
};
