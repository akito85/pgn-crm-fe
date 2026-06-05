export const WORK_ORDER_ROUTES = {
  // Standalone WO
  WO_LIST: "/work-orders",
  WO_CREATE: "/work-orders/create",
  WO_VIEW: "/work-orders/view/:woId",
  WO_UPDATE: "/work-orders/update/:woId",

  // WO Under Account
  ACCOUNT_WO_LIST: "/account-management/accounts/:accountId/work-orders",
  ACCOUNT_WO_CREATE: "/account-management/accounts/:accountId/work-orders/create",
  ACCOUNT_WO_VIEW: "/account-management/accounts/:accountId/work-orders/view/:woId",
  ACCOUNT_WO_UPDATE: "/account-management/accounts/:accountId/work-orders/update/:woId",

  // WO Under SR Standalone
  SR_WO_CREATE: "/service-requests/:srId/work-orders/create",
  SR_WO_VIEW: "/service-requests/:srId/work-orders/view/:woId",
  SR_WO_UPDATE: "/service-requests/:srId/work-orders/update/:woId",

  // WO Under SR Under Account
  ACCOUNT_SR_WO_CREATE: "/account-management/accounts/:accountId/service-requests/:srId/work-orders/create",
  ACCOUNT_SR_WO_VIEW: "/account-management/accounts/:accountId/service-requests/:srId/work-orders/view/:woId",
  ACCOUNT_SR_WO_UPDATE: "/account-management/accounts/:accountId/service-requests/:srId/work-orders/update/:woId",
};
