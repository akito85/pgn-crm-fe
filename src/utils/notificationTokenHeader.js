/**
 * Notification Token Header Utility
 *
 * Creates a lightweight authentication header for notification API calls
 * to avoid "Request Header Too Large" errors caused by oversized JWT tokens.
 *
 * Instead of sending the full accessToken (which can be very large),
 * this sends only the essential user identifier.
 */

export const notificationTokenHeader = () => {
  try {
    const token = JSON.parse(
      localStorage.getItem("token") || window.sessionStorage.getItem("token") || "{}"
    );

    // Extract user identifier (prefer userId, fallback to username)
    const userId = token?.userId || token?.id || token?.username;

    if (!userId) {
      console.warn("[notificationTokenHeader] No user identifier found in token");
      return {};
    }

    // Return lightweight headers with just the user identifier
    // The backend should validate this against the session or use cookies for auth
    return {
      "X-User-Id": userId,
      // If the backend requires a token type indicator
      "X-Auth-Type": "session",
    };
  } catch (error) {
    console.error("[notificationTokenHeader] Error parsing token:", error);
    return {};
  }
};

/**
 * Alternative: If backend supports cookie-based authentication,
 * use this function which sends no auth headers (relies on httpOnly cookies)
 */
export const notificationCookieAuth = () => {
  // No headers needed - authentication via cookies
  // Axios will automatically send cookies if withCredentials: true
  return {};
};
