const BASE_URL = process.env.REACT_APP_PGN_SERVER;
// const BASE_URL = process.env.REACT_APP_LOCAL;

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
  REPORT_SERVICE: '/rpt'
};
