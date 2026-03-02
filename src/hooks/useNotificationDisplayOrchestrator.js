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
 * Sound/display routing triggers ONLY for real-time SSE notifications that arrive
 * AFTER this hook mounts. Notifications from API fetches or Redux state that existed
 * before mount are silently ignored.
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

  // Record mount time — only SSE notifications arriving AFTER this timestamp trigger sound.
  // This prevents replaying stale lastRealtimeNotification from Redux on LayoutMenu remount.
  const mountTimeRef = useRef(Date.now());

  // Watch real-time notification + its timestamp from Redux (set only by SSE addNotification)
  const lastRealtimeNotification = useSelector(
    (state) => state.notifications?.lastRealtimeNotification
  );
  const lastRealtimeNotificationTime = useSelector(
    (state) => state.notifications?.lastRealtimeNotificationTime
  );

  // Get user settings from Redux
  const settings = useSelector((state) => state.notifications?.settings || {});

  // Sound enabled flag
  const soundEnabled = settings.soundEnabled !== false;

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) return;

    try {
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
        return;
      }

      // Determine display type
      const displayType = getDisplayTypeForNotification(notification, settings);

      if (!displayType) {
        return;
      }

      // Route based on display type
      switch (displayType) {
        case DISPLAY_TYPES.TOAST:
          showToastNotification(notification, onNavigate);
          playNotificationSound();
          break;

        case DISPLAY_TYPES.POPUP:
          if (onPopupNotification && typeof onPopupNotification === 'function') {
            onPopupNotification(notification);
            playNotificationSound();
          }
          break;

        case DISPLAY_TYPES.INLINE:
          if (onInlineNotification && typeof onInlineNotification === 'function') {
            onInlineNotification(notification);
            playNotificationSound();
          }
          break;

        case DISPLAY_TYPES.STANDARD:
        default:
          if (soundEnabled) {
            playNotificationSound();
          }
          break;
      }
    },
    [settings, onPopupNotification, onInlineNotification, onNavigate, playNotificationSound, soundEnabled]
  );

  // Process only real-time SSE notifications that arrived AFTER this hook mounted.
  // On LayoutMenu remount (page navigation):
  //   - lastRealtimeNotificationTime is from BEFORE mount → skip (stale)
  //   - processedNotificationsRef is fresh but we never reach processNotification
  // When a new SSE notification arrives:
  //   - lastRealtimeNotificationTime is set to Date.now() > mountTimeRef → process → sound plays
  useEffect(() => {
    if (!enabled) return;
    if (!lastRealtimeNotification) return;
    if (!lastRealtimeNotificationTime || lastRealtimeNotificationTime <= mountTimeRef.current) return;

    processNotification(lastRealtimeNotification);
  }, [lastRealtimeNotification, lastRealtimeNotificationTime, enabled, processNotification]);

  const clearProcessedNotifications = useCallback(() => {
    processedNotificationsRef.current.clear();
  }, []);

  const getProcessedCount = useCallback(() => {
    return processedNotificationsRef.current.size;
  }, []);

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
