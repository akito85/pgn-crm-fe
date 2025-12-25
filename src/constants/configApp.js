// const BASE_URL = process.env.REACT_APP_PGN_SERVER;
// const BASE_URL = process.env.REACT_APP_LOCAL;

// Notification configuration
export const NOTIFICATION_CONFIG = {
  ENABLED: true, // Set to false to disable notifications globally
  SSE_BASE_URL: "http://localhost:8080/ntf", // SSE server URL (through Envoy proxy)
  NOTIFICATION_SERVICE: `/ntf`,
  RECONNECT_DELAY: 30000, // Reconnection delay in ms (30 seconds to prevent spam)
  MAX_RECONNECT_ATTEMPTS: 5, // Maximum reconnection attempts before giving up
};

// explort constant app service
export const configApp = {
  USER_MANAGEMENT_SERVICE: `/um`,
  MASTER_MANAGEMENT: `/mst`,
  PRODUCT_SERVICE: `/service/product`,
  RATING_BILLING_SERVICE: `/rbi`,
  ACCOUNT_SERVICE: `/acc`,
  INVOICE_SERVICE: `/invoice`,
  WORKFLOW_SERVICE: `/service/workflow`,
  SYSTEM_SERVICE: `/service/system`,
  FAKTUR_SERVICE: `/service/faktur`,
  URL_PDF_SERVICE: `/service/pdf`,
  UPLOAD_DOCUMENT_SERVICE: `/service/upload`,
  PAYMENT_SERVICE: `/payment`,
  INTEGRATION_SERVICE: `/service/integration`,
  JP_SERVICE: `/service/jp`,
  REPORT_SERVICE: `/rpt`,
  NOTIFICATION_SERVICE: `/ntf`, // Notification REST API service
};
