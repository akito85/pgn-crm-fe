import { BASE_URL } from "../../constants/configApp";
import { tokenHeader } from "../../utils/tokenHeader";

/**
 * Notification Service
 *
 * Handles SSE (Server-Sent Events) connection for real-time notifications
 * Endpoint: /api/notifications/user/${userId}
 */

class NotificationService {
  constructor() {
    this.eventSource = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000; // 3 seconds
    this.userId = null;
    this.onMessageCallback = null;
    this.onErrorCallback = null;
    this.onConnectCallback = null;
    this.onDisconnectCallback = null;
  }

  /**
   * Connect to SSE notification stream
   * @param {string} userId - User ID to subscribe to notifications
   * @param {object} callbacks - Event callbacks
   * @param {function} callbacks.onMessage - Callback for receiving messages
   * @param {function} callbacks.onError - Callback for errors
   * @param {function} callbacks.onConnect - Callback when connected
   * @param {function} callbacks.onDisconnect - Callback when disconnected
   */
  connect(userId, callbacks = {}) {
    console.log(`[NotificationService] Connecting to SSE for user: ${userId}`);
    // Placeholder URL - will be updated with actual backend endpoint
    const sseBaseUrl = BASE_URL || "http://localhost:8911";

    this.userId = userId;
    this.onMessageCallback = callbacks.onMessage;
    this.onErrorCallback = callbacks.onError;
    this.onConnectCallback = callbacks.onConnect;
    this.onDisconnectCallback = callbacks.onDisconnect;

    // Close existing connection if any
    if (this.eventSource) {
      this.disconnect();
    }

    try {
      // Get auth token for SSE connection
      const headers = tokenHeader();
      const token = headers.Authorization;

      // SSE endpoint: /v1/dbs/api/notifications
      // EventSource doesn't support custom headers, pass token via query param
      const url = `${sseBaseUrl}/v1/dbs/api/notifications?token=${encodeURIComponent(token)}`;

      // Create EventSource connection
      this.eventSource = new EventSource(url);

      // Handle connection opened
      this.eventSource.onopen = (event) => {
        console.log("[NotificationService] SSE Connection opened", event);
        this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection

        if (this.onConnectCallback) {
          this.onConnectCallback({
            userId,
            timestamp: new Date().toISOString(),
            status: "connected"
          });
        }
      };

      // Handle incoming messages
      this.eventSource.onmessage = (event) => {
        console.log("[NotificationService] Message received:", event.data);

        try {
          const rawNotification = JSON.parse(event.data);

          // Transform Oracle schema fields to camelCase
          const notification = this._transformNotification(rawNotification);

          // Validate required fields
          if (!notification.id || !notification.notificationType) {
            console.warn("[NotificationService] Invalid notification format:", notification);
            return;
          }

          // Determine message direction
          const isForUser = notification.toUserId === userId;
          const isForAll = notification.toUserId === "ALL" || notification.broadcast === true;

          // Enrich notification with metadata
          const enrichedNotification = {
            ...notification,
            direction: isForAll ? "broadcast" : "direct",
            isForCurrentUser: isForUser || isForAll,
            receivedAt: new Date().toISOString(),
            read: notification.status === "read",
          };

          console.log("[NotificationService] Processed notification:", enrichedNotification);

          if (this.onMessageCallback) {
            this.onMessageCallback(enrichedNotification);
          }
        } catch (error) {
          console.error("[NotificationService] Failed to parse notification:", error);
          if (this.onErrorCallback) {
            this.onErrorCallback({
              type: "PARSE_ERROR",
              message: "Failed to parse notification data",
              error,
            });
          }
        }
      };

      // Handle errors
      this.eventSource.onerror = (event) => {
        console.error("[NotificationService] SSE Error:", event);

        const errorPayload = {
          type: "CONNECTION_ERROR",
          message: "Notification stream error",
          event,
          reconnectAttempts: this.reconnectAttempts,
        };

        if (this.onErrorCallback) {
          this.onErrorCallback(errorPayload);
        }

        // Attempt to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          console.log(
            `[NotificationService] Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})...`
          );
          this.reconnectAttempts++;

          // Close current connection
          if (this.eventSource) {
            this.eventSource.close();
          }

          // Reconnect after delay
          setTimeout(() => {
            this.connect(this.userId, {
              onMessage: this.onMessageCallback,
              onError: this.onErrorCallback,
              onConnect: this.onConnectCallback,
              onDisconnect: this.onDisconnectCallback,
            });
          }, this.reconnectDelay);
        } else {
          console.error("[NotificationService] Max reconnect attempts reached");
          this.disconnect();

          if (this.onDisconnectCallback) {
            this.onDisconnectCallback({
              reason: "MAX_RECONNECT_ATTEMPTS",
              timestamp: new Date().toISOString(),
            });
          }
        }
      };

      // Handle custom event types (if server sends them)
      // Server can send events like: event: notification-update
      this.eventSource.addEventListener("notification-update", (event) => {
        console.log("[NotificationService] Notification update:", event.data);
        // Handle notification updates (e.g., mark as read)
        try {
          const update = JSON.parse(event.data);
          if (this.onMessageCallback) {
            this.onMessageCallback({
              ...update,
              eventType: "update",
            });
          }
        } catch (error) {
          console.error("[NotificationService] Failed to parse notification update:", error);
        }
      });

      this.eventSource.addEventListener("notification-delete", (event) => {
        console.log("[NotificationService] Notification delete:", event.data);
        // Handle notification deletions
        try {
          const deleteEvent = JSON.parse(event.data);
          if (this.onMessageCallback) {
            this.onMessageCallback({
              ...deleteEvent,
              eventType: "delete",
            });
          }
        } catch (error) {
          console.error("[NotificationService] Failed to parse notification delete:", error);
        }
      });

    } catch (error) {
      console.error("[NotificationService] Failed to create SSE connection:", error);
      if (this.onErrorCallback) {
        this.onErrorCallback({
          type: "INIT_ERROR",
          message: "Failed to initialize notification stream",
          error,
        });
      }
    }
  }

  /**
   * Transform Oracle schema notification to frontend format
   * @param {object} raw - Raw notification from Oracle DB
   * @returns {object} Transformed notification
   */
  _transformNotification(raw) {
    // Parse NAVIGATION_STATE CLOB if it's a JSON string
    let navigationState = {};
    if (raw.NAVIGATION_STATE || raw.navigationState) {
      try {
        const stateValue = raw.NAVIGATION_STATE || raw.navigationState;
        navigationState = typeof stateValue === 'string'
          ? JSON.parse(stateValue)
          : stateValue;
      } catch (e) {
        console.warn("[NotificationService] Failed to parse NAVIGATION_STATE:", e);
      }
    }

    // Parse ADDITIONAL_DATA CLOB if present
    let additionalData = {};
    if (raw.ADDITIONAL_DATA || raw.additionalData) {
      try {
        const dataValue = raw.ADDITIONAL_DATA || raw.additionalData;
        additionalData = typeof dataValue === 'string'
          ? JSON.parse(dataValue)
          : dataValue;
      } catch (e) {
        console.warn("[NotificationService] Failed to parse ADDITIONAL_DATA:", e);
      }
    }

    // Transform Oracle UPPERCASE fields to camelCase
    return {
      id: raw.ID || raw.id,
      title: raw.TITLE || raw.title,
      message: raw.MESSAGE || raw.message,
      notificationType: raw.NOTIFICATION_TYPE || raw.notificationType || raw.type,
      status: raw.STATUS || raw.status,
      priority: raw.PRIORITY || raw.priority,

      // User identification
      fromUserId: raw.FROM_USER_ID || raw.fromUserId,
      toUserId: raw.TO_USER_ID || raw.toUserId,

      // Navigation fields
      module: raw.MODULE || raw.module,
      page: raw.PAGE || raw.page,
      link: raw.LINK || raw.link,

      // Entity identification
      entityId: raw.ENTITY_ID || raw.entityId,
      entityType: raw.ENTITY_TYPE || raw.entityType,

      // Approval fields
      tappId: raw.TAPP_ID || raw.tappId,
      appHierId: raw.APP_HIER_ID || raw.appHierId,
      approvalAction: raw.APPROVAL_ACTION || raw.approvalAction,
      approvalLevel: raw.APPROVAL_LEVEL || raw.approvalLevel,

      // State and data
      navigationState,
      additionalData,

      // Timestamps
      createdAt: raw.CREATED_AT || raw.createdAt,
      updatedAt: raw.UPDATED_AT || raw.updatedAt,
      expiresAt: raw.EXPIRES_AT || raw.expiresAt,
    };
  }

  /**
   * Disconnect from SSE stream
   */
  disconnect() {
    console.log("[NotificationService] Disconnecting from SSE");

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;

      if (this.onDisconnectCallback) {
        this.onDisconnectCallback({
          reason: "MANUAL_DISCONNECT",
          timestamp: new Date().toISOString(),
        });
      }
    }

    this.userId = null;
    this.reconnectAttempts = 0;
  }

  /**
   * Check if currently connected
   * @returns {boolean}
   */
  isConnected() {
    return this.eventSource !== null && this.eventSource.readyState === EventSource.OPEN;
  }

  /**
   * Get connection state
   * @returns {string} - 'connected', 'connecting', 'disconnected'
   */
  getConnectionState() {
    if (!this.eventSource) return "disconnected";

    switch (this.eventSource.readyState) {
      case EventSource.CONNECTING:
        return "connecting";
      case EventSource.OPEN:
        return "connected";
      case EventSource.CLOSED:
        return "disconnected";
      default:
        return "unknown";
    }
  }
}

// Export singleton instance
export default new NotificationService();
