const BASE_URL = process.env.REACT_APP_PGN_SERVER;
// const BASE_URL = process.env.REACT_APP_LOCAL;

// explort constant app service
export const configApp = {
  USER_MANAGEMENT_SERVICE: `${BASE_URL}/um`,
  MASTER_MANAGEMENT: `${BASE_URL}/mst`,
  PRODUCT_SERVICE: `${BASE_URL}/service/product`,
  RATING_BILLING_SERVICE: `${BASE_URL}/rbi`,
  ACCOUNT_SERVICE: `${BASE_URL}/acc`,
  INVOICE_SERVICE: `${BASE_URL}/invoice`,
  WORKFLOW_SERVICE: `${BASE_URL}/service/workflow`,
  SYSTEM_SERVICE: `${BASE_URL}/service/system`,
  FAKTUR_SERVICE: `${BASE_URL}/service/faktur`,
  URL_PDF_SERVICE: `${BASE_URL}/service/pdf`,
  UPLOAD_DOCUMENT_SERVICE: `${BASE_URL}/service/upload`,
  PAYMENT_SERVICE: `${BASE_URL}/payment`,
  INTEGRATION_SERVICE: `${BASE_URL}/service/integration`,
  JP_SERVICE: `${BASE_URL}/service/jp`,
  REPORT_SERVICE: `${BASE_URL}/rpt`,
};
