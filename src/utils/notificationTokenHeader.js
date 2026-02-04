/**
 * Notification Token Header Utility
 *
 * Properly configured notification token header function
 * Supports multiple authentication methods based on backend requirements
 */
export const notificationTokenHeader = () => {
  try {
    // Method 1: Try to get token from localStorage or sessionStorage
    let token = null;
    let tokenType = null;
    
    // Check for JWT token in storage
    const jwtToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (jwtToken) {
      try {
        // Parse JWT to extract user information
        const parsedToken = JSON.parse(jwtToken);
        token = parsedToken;
        tokenType = 'JWT';
      } catch (e) {
        // If it's not JSON, treat as raw JWT string
        token = jwtToken;
        tokenType = 'RAW_JWT';
      }
    }
    
    // Method 2: Check for custom token headers
    const customToken = localStorage.getItem("dbs-access-token") || sessionStorage.getItem("dbs-access-token");
    if (customToken) {
      token = customToken;
      tokenType = 'CUSTOM';
    }
    
    // Method 3: Check for alternative access token
    const altToken = localStorage.getItem("access-token") || sessionStorage.getItem("access-token");
    if (altToken) {
      token = altToken;
      tokenType = 'ALT_TOKEN';
    }
    
    if (!token) {
      console.warn("[notificationTokenHeader] No authentication token found in storage");
      return {};
    }
    
    // Prepare headers based on token type
    const headers = {};
    
    if (tokenType === 'JWT' || typeof token === 'object') {
      // Handle parsed JWT object
      const userId = token?.userId || token?.id || token?.username;
      
      if (userId) {
        headers["X-User-Id"] = userId;
        headers["X-Auth-Type"] = "jwt-payload";
      } else {
        console.warn("[notificationTokenHeader] No user identifier found in JWT payload");
        return {};
      }
      
      // Also include Authorization header for JWT
      if (token?.accessToken || token?.token) {
        headers["Authorization"] = `Bearer ${token.accessToken || token.token}`;
      }
    } else if (tokenType === 'RAW_JWT') {
      // Handle raw JWT string - decode to get user info if possible
      try {
        const userId = extractUserIdFromJWT(token);
        if (userId) {
          headers["X-User-Id"] = userId;
          headers["X-Auth-Type"] = "jwt-header";
          headers["Authorization"] = `Bearer ${token}`;
        } else {
          // If we can't decode the JWT, just send it as Authorization header
          headers["Authorization"] = `Bearer ${token}`;
        }
      } catch (e) {
        console.warn("[notificationTokenHeader] Could not decode JWT, sending as Authorization header", e);
        headers["Authorization"] = `Bearer ${token}`;
      }
    } else if (tokenType === 'CUSTOM' || tokenType === 'ALT_TOKEN') {
      // Handle custom token - could be encrypted or plain
      if (token.startsWith('ENC:')) {
        // If it's encrypted, use the helper function
        Object.assign(headers, handleEncryptedToken(token));
      } else {
        // Plain token - could be JWT or other format
        headers["access-token"] = token;
        headers["X-Auth-Type"] = "custom";

        // Try to extract user ID if it's a JWT-like token
        try {
          const userId = extractUserIdFromJWT(token);
          if (userId) {
            headers["X-User-Id"] = userId;
          }
        } catch (e) {
          // If not a JWT, skip user ID extraction
        }
      }
    }
    
    // Add common headers for all authentication types
    headers["Content-Type"] = "application/json";
    
    return headers;
  } catch (error) {
    console.error("[notificationTokenHeader] Error processing authentication:", error);
    return {};
  }
};

/**
 * Helper function to extract user ID from JWT token
 * @param {string} token - JWT token string
 * @returns {string|null} - User ID or null if not found/extrable
 */
function extractUserIdFromJWT(token) {
  try {
    // Split the JWT token to get the payload
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    // Decode the payload (second part)
    const payload = parts[1];
    // Add padding if needed
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    const decodedPayload = atob(paddedPayload);
    const parsedPayload = JSON.parse(decodedPayload);

    // Extract user ID from various possible fields
    return parsedPayload.userId || parsedPayload.sub || parsedPayload.username || null;
  } catch (error) {
    console.warn('[extractUserIdFromJWT] Could not extract user ID from token:', error.message);
    return null;
  }
}

/**
 * Helper function to handle encrypted tokens
 * @param {string} encryptedToken - Encrypted token starting with ENC:
 * @returns {Object} - Headers with encrypted token
 */
function handleEncryptedToken(encryptedToken) {
  // Backend expects encrypted tokens in specific headers
  if (encryptedToken.startsWith('ENC:')) {
    return {
      "nxs-access-token": encryptedToken,
      "X-Auth-Type": "encrypted"
    };
  }

  return {
    "access-token": encryptedToken,
    "X-Auth-Type": "custom"
  };
}

/**
 * Alternative implementation that prioritizes session-based authentication
 * Use this if your app maintains server-side sessions
 */
export const notificationTokenHeaderWithSession = () => {
  try {
    const headers = {};
    
    // First, try to get user ID from stored token (for header-based auth)
    const token = JSON.parse(
      localStorage.getItem("token") || sessionStorage.getItem("token") || "{}"
    );
    
    const userId = token?.userId || token?.id || token?.username || token?.sub;
    
    if (userId) {
      headers["X-User-Id"] = userId;
      headers["X-Auth-Type"] = "session-compatible";
    }
    
    // Include JWT token if available for additional validation
    const jwtToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (jwtToken && typeof jwtToken === 'string' && !jwtToken.startsWith('{')) {
      headers["Authorization"] = `Bearer ${jwtToken}`;
    }
    
    headers["Content-Type"] = "application/json";
    
    return headers;
  } catch (error) {
    console.error("[notificationTokenHeaderWithSession] Error processing authentication:", error);
    return {};
  }
};/**
 * Alternative: If backend supports cookie-based authentication,
 * use this function which sends no auth headers (relies on httpOnly cookies)
 */
export const notificationCookieAuth = () => {
  // No headers needed - authentication via cookies
  // Axios will automatically send cookies if withCredentials: true
  return {};
};
