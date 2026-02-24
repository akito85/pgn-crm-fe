import React from 'react';
import { Alert, Space, Button, Typography } from 'antd';
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
import './NotificationInline.css';

const { Text } = Typography;

/**
 * Inline Notification Component
 * Displays as an alert banner at the top of content
 * Dismissible with max 5 visible at once
 */

// Icon mapping for notification types
const ICON_MAP = {
  info: <InfoCircleOutlined />,
  success: <CheckCircleOutlined />,
  warning: <ExclamationCircleOutlined />,
  error: <CloseCircleOutlined />,
  approval: <AuditOutlined />,
  broadcast: <NotificationOutlined />,
};

/**
 * Single Inline Notification Item
 *
 * @param {Object} props - Component props
 * @param {Object} props.notification - Notification object
 * @param {Function} props.onDismiss - Callback when dismissed
 * @param {Function} props.onViewDetails - Callback when "View Details" is clicked (optional)
 */
const InlineNotificationItem = ({
  notification,
  onDismiss,
  onViewDetails,
}) => {
  if (!notification) return null;

  const notificationType = notification.notificationType || 'info';
  const title = formatNotificationTitle(notification);
  const message = formatNotificationMessage(notification, 200); // Limit to 200 chars
  const antdType = getAntdMessageType(notificationType);
  const icon = ICON_MAP[notificationType] || ICON_MAP.info;

  // Handle View Details click
  const handleViewDetails = () => {
    if (onViewDetails && typeof onViewDetails === 'function') {
      onViewDetails(notification);
    }
    onDismiss(notification.id);
  };

  // Alert message content
  const alertMessage = (
    <div className="inline-notification-content">
      <div className="inline-notification-text">
        <Text strong style={{ fontSize: '14px', marginRight: '8px' }}>
          {title}
        </Text>
        <Text style={{ fontSize: '14px' }}>{message}</Text>
      </div>
      {notification.redirectUrl && (
        <Button
          type="link"
          size="small"
          onClick={handleViewDetails}
          className="inline-notification-action"
        >
          View Details
        </Button>
      )}
    </div>
  );

  return (
    <Alert
      message={alertMessage}
      type={antdType}
      icon={icon}
      closable
      onClose={() => onDismiss(notification.id)}
      className="inline-notification-alert"
      showIcon
      banner={false}
    />
  );
};

/**
 * Inline Notifications Container
 *
 * @param {Object} props - Component props
 * @param {Array} props.notifications - Array of notification objects (max 5)
 * @param {Function} props.onDismiss - Callback when a notification is dismissed
 * @param {Function} props.onViewDetails - Callback when "View Details" is clicked
 * @param {Function} props.onDismissAll - Callback when "Dismiss All" is clicked (optional)
 */
const NotificationInline = ({
  notifications = [],
  onDismiss,
  onViewDetails,
  onDismissAll,
}) => {
  // Limit to 5 visible notifications
  const visibleNotifications = notifications.slice(0, 5);

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="inline-notifications-container">
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        {visibleNotifications.map((notification) => (
          <InlineNotificationItem
            key={notification.id}
            notification={notification}
            onDismiss={onDismiss}
            onViewDetails={onViewDetails}
          />
        ))}

        {/* Dismiss All button if multiple notifications */}
        {visibleNotifications.length > 1 && onDismissAll && (
          <div className="inline-notifications-footer">
            <Button
              type="text"
              size="small"
              onClick={onDismissAll}
              className="inline-notifications-dismiss-all"
            >
              Dismiss All ({visibleNotifications.length})
            </Button>
          </div>
        )}

        {/* Show count if more than 5 */}
        {notifications.length > 5 && (
          <div className="inline-notifications-overflow">
            <Text type="secondary" style={{ fontSize: '12px' }}>
              +{notifications.length - 5} more notifications
            </Text>
          </div>
        )}
      </Space>
    </div>
  );
};

/**
 * Compact Inline Notification (for space-constrained areas)
 *
 * @param {Object} props - Component props
 * @param {Object} props.notification - Notification object
 * @param {Function} props.onDismiss - Callback when dismissed
 */
export const CompactInlineNotification = ({ notification, onDismiss }) => {
  if (!notification) return null;

  const notificationType = notification.notificationType || 'info';
  const title = formatNotificationTitle(notification);
  const antdType = getAntdMessageType(notificationType);

  return (
    <Alert
      message={title}
      type={antdType}
      closable
      onClose={() => onDismiss(notification.id)}
      className="inline-notification-compact"
      showIcon
      banner
    />
  );
};

/**
 * Inline Notification with Custom Actions
 *
 * @param {Object} props - Component props
 * @param {Object} props.notification - Notification object
 * @param {Array} props.actions - Array of action buttons {label, onClick}
 * @param {Function} props.onDismiss - Callback when dismissed
 */
export const InlineNotificationWithActions = ({
  notification,
  actions = [],
  onDismiss,
}) => {
  if (!notification) return null;

  const notificationType = notification.notificationType || 'info';
  const title = formatNotificationTitle(notification);
  const message = formatNotificationMessage(notification, 150);
  const antdType = getAntdMessageType(notificationType);

  const alertAction = (
    <Space size="small">
      {actions.map((action, index) => (
        <Button
          key={index}
          type={action.type || 'link'}
          size="small"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
    </Space>
  );

  return (
    <Alert
      message={title}
      description={message}
      type={antdType}
      closable
      onClose={() => onDismiss(notification.id)}
      action={alertAction}
      className="inline-notification-with-actions"
      showIcon
    />
  );
};

export default NotificationInline;
