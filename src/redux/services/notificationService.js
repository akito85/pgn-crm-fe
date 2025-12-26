import { NOTIFICATION_CONFIG } from "../../constants/configApp";

/**
 * Notification Service
 *
 * Handles SSE (Server-Sent Events) connection for real-time notifications
 * Endpoint: /v1/dbs/api/notifications
 */

class NotificationService {
  constructor() {
    this.eventSource = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = NOTIFICATION_CONFIG.MAX_RECONNECT_ATTEMPTS;
    this.reconnectDelay = NOTIFICATION_CONFIG.RECONNECT_DELAY;
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
    const sseBaseUrl = NOTIFICATION_CONFIG.SSE_BASE_URL;

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
      // Get raw token from localStorage (avoid tokenHeader to prevent any manipulation)
      const tokenJSON = JSON.parse(
        localStorage.getItem("token") || window.sessionStorage.getItem("token") || "{}"
      );

      // Build URL with manual encoding to preserve token integrity
      // Use encodeURIComponent only for the token value to ensure proper encoding
      let url = `${sseBaseUrl}/v1/dbs/api/notifications`;

      // Add userId only if provided (optional in production)
      // Based on server implementation, userId might be derived from session/authorization
      if (userId) {
        url += `?userId=${encodeURIComponent(userId)}`;
      }


      // Create EventSource connection with credentials for session authentication
      // NOTE: withCredentials ensures session cookies are sent with SSE requests
      this.eventSource = new EventSource(url, { withCredentials: true });


      // Fallback: Check connection state after a delay if onopen doesn't fire
      // Some SSE servers don't trigger onopen immediately
      const connectionCheckTimeout = setTimeout(() => {
        if (this.eventSource && this.eventSource.readyState === EventSource.OPEN) {
          this.reconnectAttempts = 0;

          if (this.onConnectCallback) {
            this.onConnectCallback({
              userId,
              timestamp: new Date().toISOString(),
              status: "connected",
              readyState: this.eventSource.readyState,
              connectedVia: "readyState-check"
            });
          }
        } else if (this.eventSource) {
          console.warn("[NotificationService] Connection check: readyState =", this.eventSource.readyState);
        }
      }, 2000); // Check after 2 seconds

      // Handle connection opened
      this.eventSource.onopen = (event) => {
        clearTimeout(connectionCheckTimeout); // Clear the fallback timeout
        this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection

        if (this.onConnectCallback) {
          this.onConnectCallback({
            userId,
            timestamp: new Date().toISOString(),
            status: "connected",
            readyState: this.eventSource.readyState,
            connectedVia: "onopen-event"
          });
        } else {
          console.warn("[NotificationService] No onConnectCallback registered!");
        }
      };

      // Handle incoming messages
      this.eventSource.onmessage = (event) => {

        try {
          const rawNotification = JSON.parse(event.data);

          // Transform Oracle schema fields to camelCase
          const notification = this._transformNotification(rawNotification);

          // Validate required fields
          if (!notification.id || !notification.notificationType) {
            console.warn("[NotificationService] Invalid notification format:", notification);
            console.warn("[NotificationService] Missing id:", !notification.id);
            console.warn("[NotificationService] Missing notificationType:", !notification.notificationType);
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


          if (this.onMessageCallback) {
            this.onMessageCallback(enrichedNotification);
          } else {
            console.warn("[NotificationService] No onMessageCallback registered!");
          }

        } catch (error) {
          console.error("[NotificationService] Failed to parse notification:", error);
          console.error("[NotificationService] Error stack:", error.stack);
          if (this.onErrorCallback) {
            this.onErrorCallback({
              type: "PARSE_ERROR",
              message: "Failed to parse notification data",
              errorMessage: error.message,
              errorStack: error.stack,
              timestamp: new Date().toISOString(),
            });
          }
        }
      };

      // Handle errors
      this.eventSource.onerror = (event) => {
        console.error("[NotificationService] SSE Error:", event);
        console.error("[NotificationService] EventSource readyState on error:", this.eventSource.readyState);
        console.error("[NotificationService] Event target:", event.target);
        console.error("[NotificationService] Event type:", event.type);

        // Serialize error event for Redux (avoid non-serializable values)
        const errorPayload = {
          type: "CONNECTION_ERROR",
          message: "Notification stream error",
          eventType: event.type,
          timestamp: new Date().toISOString(),
          reconnectAttempts: this.reconnectAttempts,
          readyState: this.eventSource.readyState,
          url: this.eventSource.url,
        };

        if (this.onErrorCallback) {
          this.onErrorCallback(errorPayload);
        }

        // Attempt to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
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
          if (this.onErrorCallback) {
            this.onErrorCallback({
              type: "PARSE_ERROR",
              message: "Failed to parse notification update",
              errorMessage: error.message,
              timestamp: new Date().toISOString(),
            });
          }
        }
      });

      this.eventSource.addEventListener("notification-delete", (event) => {
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
          if (this.onErrorCallback) {
            this.onErrorCallback({
              type: "PARSE_ERROR",
              message: "Failed to parse notification delete",
              errorMessage: error.message,
              timestamp: new Date().toISOString(),
            });
          }
        }
      });

    } catch (error) {
      console.error("[NotificationService] Failed to create SSE connection:", error);
      if (this.onErrorCallback) {
        this.onErrorCallback({
          type: "INIT_ERROR",
          message: "Failed to initialize notification stream",
          errorMessage: error.message,
          errorStack: error.stack,
          timestamp: new Date().toISOString(),
        });
      }
    }
  }

  /**
   * Normalize priority value to string format
   * @param {number|string} priority - Priority value (number 1-4 or string)
   * @returns {string} Normalized priority string
   */
  _normalizePriority(priority) {
    // If already a string, return lowercase version
    if (typeof priority === 'string') {
      return priority.toLowerCase();
    }

    // If number, map to priority string
    // Assuming: 1=low, 2=normal, 3=high, 4=urgent
    switch (priority) {
      case 1:
        return 'low';
      case 2:
        return 'normal';
      case 3:
        return 'high';
      case 4:
        return 'urgent';
      default:
        return 'normal';
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

    // Get and normalize priority
    const rawPriority = raw.PRIORITY || raw.priority;
    const normalizedPriority = rawPriority ? this._normalizePriority(rawPriority) : 'normal';

    // Transform Oracle UPPERCASE fields to camelCase
    return {
      id: raw.ID || raw.id,
      title: raw.TITLE || raw.title,
      message: raw.MESSAGE || raw.message,
      notificationType: raw.NOTIFICATION_TYPE || raw.notificationType || raw.type,
      status: raw.STATUS || raw.status,
      priority: normalizedPriority,

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
