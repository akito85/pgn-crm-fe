/**
 * Notification Display Types Constants and Utilities
 * Defines available display types and routing logic for notifications
 */

export const DISPLAY_TYPES = {
  STANDARD: 'standard',
  TOAST: 'toast',
  POPUP: 'popup',
  INLINE: 'inline',
};

export const DISPLAY_TYPE_OPTIONS = [
  {
    value: 'standard',
    label: 'Standard',
    description: 'Shows in notification dropdown'
  },
  {
    value: 'toast',
    label: 'Toast',
    description: 'Corner popup, auto-dismisses'
  },
  {
    value: 'popup',
    label: 'Popup',
    description: 'Modal dialog, requires acknowledgment'
  },
  {
    value: 'inline',
    label: 'Inline',
    description: 'Banner at top of content'
  },
];

/**
 * Determine the display type for a notification based on user settings
 * Supports both legacy boolean format and new object format {enabled, displayType}
 *
 * @param {Object} notification - The notification object with notificationType and module
 * @param {Object} settings - User's notification settings
 * @returns {string|null} Display type or null if notification should be filtered
 */
export function getDisplayTypeForNotification(notification, settings) {
  if (!notification || !settings) {
    return DISPLAY_TYPES.STANDARD; // Default fallback
  }

  const notificationType = notification.notificationType || 'info';
  const module = notification.module;

  // Check if module is disabled
  if (module && settings.modulePreferences && settings.modulePreferences[module] === false) {
    return null; // Filter out this notification
  }

  // Get type preferences
  const typePrefs = settings.typePreferences?.[notificationType];

  // Handle object format {enabled, displayType}
  if (typePrefs && typeof typePrefs === 'object') {
    if (typePrefs.enabled === false) {
      return null; // Filter out this notification
    }
    return typePrefs.displayType || settings.displayType || DISPLAY_TYPES.STANDARD;
  }

  // Handle legacy boolean format
  if (typeof typePrefs === 'boolean' && !typePrefs) {
    return null; // Filter out this notification
  }

  // Return global display type as fallback
  return settings.displayType || DISPLAY_TYPES.STANDARD;
}

/**
 * Check if a notification is a broadcast notification
 *
 * @param {Object} notification - The notification object
 * @returns {boolean} True if broadcast notification
 */
export function isBroadcastNotification(notification) {
  if (!notification) return false;

  return (
    notification.toUserId === 'BROADCAST' ||
    notification.isBroadcast === true ||
    notification.notificationType === 'broadcast'
  );
}

/**
 * Get icon name for notification type
 *
 * @param {string} type - Notification type (info, success, warning, error, approval, broadcast)
 * @returns {string} Ant Design icon name
 */
export function getIconForType(type) {
  const iconMap = {
    info: 'InfoCircleOutlined',
    success: 'CheckCircleOutlined',
    warning: 'ExclamationCircleOutlined',
    error: 'CloseCircleOutlined',
    approval: 'AuditOutlined',
    broadcast: 'NotificationOutlined',
  };
  return iconMap[type] || 'InfoCircleOutlined';
}

/**
 * Get color for notification type
 *
 * @param {string} type - Notification type
 * @returns {string} Color hex code
 */
export function getColorForType(type) {
  const colorMap = {
    info: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    approval: '#722ed1',
    broadcast: '#13c2c2',
  };
  return colorMap[type] || '#1890ff';
}

/**
 * Get Ant Design message type for notification
 *
 * @param {string} type - Notification type
 * @returns {string} Ant Design message type (success, info, warning, error)
 */
export function getAntdMessageType(type) {
  const typeMap = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error',
    approval: 'info',
    broadcast: 'info',
  };
  return typeMap[type] || 'info';
}

/**
 * Format notification title for display
 *
 * @param {Object} notification - The notification object
 * @returns {string} Formatted title
 */
export function formatNotificationTitle(notification) {
  if (!notification) return 'Notification';
  return notification.title || notification.message || 'Notification';
}

/**
 * Format notification message for display
 *
 * @param {Object} notification - The notification object
 * @param {number} maxLength - Maximum length (0 = no limit)
 * @returns {string} Formatted message
 */
export function formatNotificationMessage(notification, maxLength = 0) {
  if (!notification) return '';

  const message = notification.body || notification.message || notification.description || '';

  if (maxLength > 0 && message.length > maxLength) {
    return message.substring(0, maxLength) + '...';
  }

  return message;
}

/**
 * Check if notification should be filtered based on settings
 *
 * @param {Object} notification - The notification object
 * @param {Object} settings - User's notification settings
 * @returns {boolean} True if notification should be shown, false if filtered
 */
export function shouldShowNotification(notification, settings) {
  const displayType = getDisplayTypeForNotification(notification, settings);
  return displayType !== null;
}

export default {
  DISPLAY_TYPES,
  DISPLAY_TYPE_OPTIONS,
  getDisplayTypeForNotification,
  isBroadcastNotification,
  getIconForType,
  getColorForType,
  getAntdMessageType,
  formatNotificationTitle,
  formatNotificationMessage,
  shouldShowNotification,
};
