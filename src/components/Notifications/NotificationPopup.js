import React from 'react';
import { Modal, Button, Space, Typography } from 'antd';
import {
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  AuditOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import {
  formatNotificationTitle,
  formatNotificationMessage,
  getColorForType,
} from './constants/displayTypes';
import './NotificationPopup.css';

const { Text } = Typography;

/**
 * Popup Notification Component
 * Modal dialog that requires user acknowledgment
 * Blocks UI interaction until dismissed
 */

// Icon mapping for notification types
const ICON_MAP = {
  info: InfoCircleOutlined,
  success: CheckCircleOutlined,
  warning: ExclamationCircleOutlined,
  error: CloseCircleOutlined,
  approval: AuditOutlined,
  broadcast: NotificationOutlined,
};

/**
 * NotificationPopup Component
 *
 * @param {Object} props - Component props
 * @param {Object} props.notification - Notification object to display
 * @param {boolean} props.visible - Whether popup is visible
 * @param {Function} props.onClose - Callback when popup is closed/dismissed
 * @param {Function} props.onViewDetails - Callback when "View Details" is clicked (optional)
 */
const NotificationPopup = ({
  notification,
  visible = false,
  onClose,
  onViewDetails,
}) => {
  if (!notification) return null;

  const notificationType = notification.notificationType || 'info';
  const title = formatNotificationTitle(notification);
  const message = formatNotificationMessage(notification);
  const color = getColorForType(notificationType);
  const IconComponent = ICON_MAP[notificationType] || ICON_MAP.info;

  // Handle View Details click
  const handleViewDetails = () => {
    if (onViewDetails && typeof onViewDetails === 'function') {
      onViewDetails(notification);
    }
    onClose();
  };

  // Handle Dismiss click
  const handleDismiss = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onCancel={handleDismiss}
      footer={null}
      closable={false}
      centered
      width={500}
      className="notification-popup-modal"
      maskClosable={false}
      keyboard={true} // Allow ESC key to close
    >
      <div className="notification-popup-content">
        {/* Icon Section */}
        <div className="notification-popup-icon" style={{ color }}>
          <IconComponent style={{ fontSize: '48px' }} />
        </div>

        {/* Title Section */}
        <div className="notification-popup-title">
          <Text strong style={{ fontSize: '18px', color: '#262626' }}>
            {title}
          </Text>
        </div>

        {/* Message Section */}
        <div className="notification-popup-message">
          <Text style={{ fontSize: '14px', color: '#595959' }}>
            {message}
          </Text>
        </div>

        {/* Metadata Section (Optional) */}
        {notification.metadata && (
          <div className="notification-popup-metadata">
            {notification.metadata.module && (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Module: {notification.metadata.module}
              </Text>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="notification-popup-actions">
          <Space size="middle">
            <Button onClick={handleDismiss} size="large">
              Dismiss
            </Button>
            {notification.redirectUrl && (
              <Button
                type="primary"
                onClick={handleViewDetails}
                size="large"
              >
                View Details
              </Button>
            )}
          </Space>
        </div>
      </div>
    </Modal>
  );
};

/**
 * Show a popup notification programmatically
 * Uses Ant Design Modal.info/success/warning/error
 *
 * @param {Object} notificationData - Notification object
 * @param {Function} onViewDetails - Callback for View Details action
 */
export const showPopupNotification = (notificationData, onViewDetails) => {
  if (!notificationData) return;

  const notificationType = notificationData.notificationType || 'info';
  const title = formatNotificationTitle(notificationData);
  const message = formatNotificationMessage(notificationData);
  const IconComponent = ICON_MAP[notificationType] || ICON_MAP.info;
  const color = getColorForType(notificationType);

  const modalConfig = {
    title: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <IconComponent style={{ fontSize: '24px', color }} />
        <span>{title}</span>
      </div>
    ),
    content: message,
    centered: true,
    okText: notificationData.redirectUrl ? 'View Details' : 'Dismiss',
    cancelText: notificationData.redirectUrl ? 'Dismiss' : undefined,
    onOk: () => {
      if (notificationData.redirectUrl && onViewDetails) {
        onViewDetails(notificationData);
      }
    },
    maskClosable: false,
  };

  // Choose modal type based on notification type
  switch (notificationType) {
    case 'success':
      Modal.success(modalConfig);
      break;
    case 'warning':
    case 'approval':
      Modal.warning(modalConfig);
      break;
    case 'error':
      Modal.error(modalConfig);
      break;
    case 'info':
    case 'broadcast':
    default:
      Modal.info(modalConfig);
      break;
  }
};

export default NotificationPopup;
