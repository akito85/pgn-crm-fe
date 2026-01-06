// const BASE_URL = process.env.REACT_APP_PGN_SERVER;
// const BASE_URL = process.env.REACT_APP_LOCAL;

// Notification configuration
export const NOTIFICATION_CONFIG = {
  ENABLED: true, // Set to false to disable notifications globally
  SSE_BASE_URL: "http://167.71.200.144:8080/ntf", // SSE server URL (through configured proxy)
  NOTIFICATION_SERVICE: `http://167.71.200.144:8080/ntf`,
  RECONNECT_DELAY: 30000, // Reconnection delay in ms (30 seconds to prevent spam)
  MAX_RECONNECT_ATTEMPTS: 5, // Maximum reconnection attempts before giving up
};

// explort constant app service
export const configApp = {
  USER_MANAGEMENT_SERVICE: `http://167.71.200.144:8080/um`,
  MASTER_MANAGEMENT: `http://167.71.200.144:8080/mst`,
  PRODUCT_SERVICE: `http://167.71.200.144:8080/service/product`,
  RATING_BILLING_SERVICE: `http://167.71.200.144:8080/rbi`,
  ACCOUNT_SERVICE: `http://167.71.200.144:8080/acc`,
  INVOICE_SERVICE: `http://167.71.200.144:8080/invoice`,
  WORKFLOW_SERVICE: `http://167.71.200.144:8080/service/workflow`,
  SYSTEM_SERVICE: `http://167.71.200.144:8080/service/system`,
  FAKTUR_SERVICE: `http://167.71.200.144:8080/service/faktur`,
  URL_PDF_SERVICE: `http://167.71.200.144:8080/service/pdf`,
  UPLOAD_DOCUMENT_SERVICE: `http://167.71.200.144:8080/service/upload`,
  PAYMENT_SERVICE: `http://167.71.200.144:8080/payment`,
  INTEGRATION_SERVICE: `http://167.71.200.144:8080/service/integration`,
  JP_SERVICE: `http://167.71.200.144:8080/service/jp`,
  REPORT_SERVICE: `http://167.71.200.144:8080/rpt`,
  NOTIFICATION_SERVICE: `http://167.71.200.144:8080/ntf`, // Notification REST API service
};
