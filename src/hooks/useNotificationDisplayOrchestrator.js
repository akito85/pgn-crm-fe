import { useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  getDisplayTypeForNotification,
  shouldShowNotification,
  DISPLAY_TYPES,
} from '../components/Notifications/constants/displayTypes';
import { showToastNotification } from '../components/Notifications/NotificationToast';

/**
 * Notification Display Orchestrator Hook
 * Central routing logic for directing notifications to appropriate display components
 *
 * Flow:
 * 1. Subscribe to latest notification from Redux
 * 2. Get user's notification settings
 * 3. Determine display type based on settings
 * 4. Route to appropriate display component:
 *    - standard → NotificationDropdown (no action needed)
 *    - toast → showToastNotification()
 *    - popup → onPopupNotification callback
 *    - inline → onInlineNotification callback
 * 5. Play sound if enabled
 * 6. Track processed notifications to prevent duplicates
 *
 * @param {Object} options - Configuration options
 * @param {Function} options.onPopupNotification - Callback for popup notifications
 * @param {Function} options.onInlineNotification - Callback for inline notifications
 * @param {Function} options.onNavigate - Navigation callback for clicking notifications
 * @param {boolean} options.enabled - Enable/disable the orchestrator (default: true)
 * @returns {Object} Orchestrator state and controls
 */
const useNotificationDisplayOrchestrator = ({
  onPopupNotification,
  onInlineNotification,
  onNavigate,
  enabled = true,
} = {}) => {
  // Track processed notification IDs to prevent duplicates
  const processedNotificationsRef = useRef(new Set());

  // Get latest notification from Redux
  const latestNotification = useSelector((state) => {
    const notifications = state.notifications?.notifications || [];
    return notifications.length > 0 ? notifications[0] : null;
  });

  // Get user settings from Redux
  const settings = useSelector((state) => state.notifications?.settings || {});

  // Sound enabled flag
  const soundEnabled = settings.soundEnabled !== false; // Default to true

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) return;

    try {
      // Use browser's notification sound or a custom audio file
      // For now, using a simple beep (can be replaced with a custom sound file)
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Failed to play notification sound:', error);
    }
  }, [soundEnabled]);

  // Process notification and route to appropriate display
  const processNotification = useCallback(
    (notification) => {
      if (!notification || !notification.id) return;

      // Check if already processed
      if (processedNotificationsRef.current.has(notification.id)) {
        return;
      }

      // Mark as processed
      processedNotificationsRef.current.add(notification.id);

      // Clean up old processed IDs (keep only last 100)
      if (processedNotificationsRef.current.size > 100) {
        const idsArray = Array.from(processedNotificationsRef.current);
        processedNotificationsRef.current = new Set(idsArray.slice(-100));
      }

      // Check if notification should be shown based on settings
      if (!shouldShowNotification(notification, settings)) {
        console.log('Notification filtered by settings:', notification.id);
        return;
      }

      // Determine display type
      const displayType = getDisplayTypeForNotification(notification, settings);

      if (!displayType) {
        console.log('No display type for notification:', notification.id);
        return;
      }

      console.log(`Routing notification ${notification.id} to display type: ${displayType}`);

      // Route based on display type
      switch (displayType) {
        case DISPLAY_TYPES.TOAST:
          // Show as toast notification
          showToastNotification(notification, onNavigate);
          playNotificationSound();
          break;

        case DISPLAY_TYPES.POPUP:
          // Show as popup modal
          if (onPopupNotification && typeof onPopupNotification === 'function') {
            onPopupNotification(notification);
            playNotificationSound();
          } else {
            console.warn('onPopupNotification callback not provided');
          }
          break;

        case DISPLAY_TYPES.INLINE:
          // Show as inline banner
          if (onInlineNotification && typeof onInlineNotification === 'function') {
            onInlineNotification(notification);
            playNotificationSound();
          } else {
            console.warn('onInlineNotification callback not provided');
          }
          break;

        case DISPLAY_TYPES.STANDARD:
        default:
          // Standard dropdown - no action needed, NotificationDropdown handles it
          // Still play sound if enabled
          if (soundEnabled) {
            playNotificationSound();
          }
          break;
      }
    },
    [settings, onPopupNotification, onInlineNotification, onNavigate, playNotificationSound, soundEnabled]
  );

  // Effect to process new notifications
  useEffect(() => {
    if (!enabled) return;

    if (latestNotification) {
      processNotification(latestNotification);
    }
  }, [latestNotification, enabled, processNotification]);

  // Clear processed notifications (useful for testing or reset)
  const clearProcessedNotifications = useCallback(() => {
    processedNotificationsRef.current.clear();
  }, []);

  // Get count of processed notifications
  const getProcessedCount = useCallback(() => {
    return processedNotificationsRef.current.size;
  }, []);

  // Check if a notification was processed
  const isNotificationProcessed = useCallback((notificationId) => {
    return processedNotificationsRef.current.has(notificationId);
  }, []);

  return {
    clearProcessedNotifications,
    getProcessedCount,
    isNotificationProcessed,
    soundEnabled,
  };
};

export default useNotificationDisplayOrchestrator;
