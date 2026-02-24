import { RECEIPT_AND_COLLECTION_ROUTES } from "../routes/Receipt&Collection/rc_routes";
import { RBI_ROUTES } from "../routes/rating_billing/rbi_routes";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../routes/account_management/customer_account_routes";
import { PRODUCT_PROMO_ROUTES } from "../routes/product_promo/pp_routes";

// Maps MODULE_CATEGORY (or MODULE-only) keys to approval route constants
const APPROVAL_ROUTE_MAP = {
  RECEIPT_HOLD: RECEIPT_AND_COLLECTION_ROUTES.APPROVAL_RECEIPT_HOLD,
  RECEIPT_RELEASE: RECEIPT_AND_COLLECTION_ROUTES.APPROVAL_RECEIPT_RELEASE,
  RECEIPT_REFUND: RECEIPT_AND_COLLECTION_ROUTES.APPROVAL_RECEIPT_REFUND,
  RECEIPT_REVERSE: RECEIPT_AND_COLLECTION_ROUTES.APPROVAL_RECEIPT_REVERSE,
  BILLING: RBI_ROUTES.BILLING_VIEW_DETAIL,
  INVOICE: RBI_ROUTES.BILLING_VIEW_DETAIL,
  POS: RBI_ROUTES.POS_DETAIL,
  USAGE: RBI_ROUTES.MONITORING_USAGE_DETAIL,
  INVOICE_RELATION: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_INVOICE_RELATION,
  PAYMENT_RELATION: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_PAYMENT_RELATION,
  MULTI_DESTINATION: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_MULTI_DESTINATION,
  SERVICE_AGREEMENT: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_AGREEMENT,
  PRICING: PRODUCT_PROMO_ROUTES.DETAIL_PRICING,
  PRICING_ADJUSTMENT: PRODUCT_PROMO_ROUTES.DETAIL_PRICING_ADJUSTMENT,
  PROMO: PRODUCT_PROMO_ROUTES.DETAIL_PROMO_DISCOUNT,
  PRODUCT: PRODUCT_PROMO_ROUTES.DETAIL_PRODUCT,
  DEFAULT: "/approval/:id",
};

// Resolves approval route by MODULE_CATEGORY → MODULE → CATEGORY, falls back to DEFAULT
export const getApprovalRoute = (module, category, tappId) => {
  const moduleKey = module?.toString().toUpperCase() || '';
  const categoryKey = category?.toString().toUpperCase() || '';

  const lookup = (key) => APPROVAL_ROUTE_MAP[key]?.replace(':id', tappId || '');

  return (
    (categoryKey && lookup(`${moduleKey}_${categoryKey}`)) ||
    (moduleKey && lookup(moduleKey)) ||
    (categoryKey && lookup(categoryKey)) ||
    lookup('DEFAULT')
  );
};

// Parses navigationState safely — handles both JSON string and plain object forms
const parseNavigationState = (navState) => {
  if (!navState) return {};
  if (typeof navState === 'string') {
    try { return JSON.parse(navState); } catch { return {}; }
  }
  return navState;
};

// Builds standardized navigation state for approval pages from either a task or notification
export const buildApprovalState = (task = null, notification = null) => {
  if (notification) {
    return {
      id: notification.entityId || notification.ENTITY_ID,
      type: notification.entityType || notification.ENTITY_TYPE,
      tappId: notification.tappId || notification.TAPP_ID,
      appHierId: notification.appHierId || notification.APP_HIER_ID,
      approvalAction: notification.approvalAction || notification.APPROVAL_ACTION,
      approvalLevel: notification.approvalLevel || notification.APPROVAL_LEVEL,
      ...parseNavigationState(notification.navigationState || notification.NAVIGATION_STATE),
    };
  }

  if (task) {
    return {
      id: task.ENTITY_ID || task.entityId || task.TAPP_ID || task.tappId,
      type: task.CATEGORY || task.category || task.MODULE || task.module,
      tappId: task.TAPP_ID || task.tappId,
      appHierId: task.APP_HIER_ID || task.appHierId,
      approvalAction: task.APPROVAL_ACTION || task.approvalAction,
      approvalLevel: task.APPROVAL_LEVEL || task.approvalLevel,
      taskId: task.TASK_ID || task.taskId,
      taskSubject: task.TASK_SUBJECT || task.taskSubject,
      taskStatus: task.TASK_STATUS || task.taskStatus,
      priority: task.PRIORITY || task.priority,
      module: task.MODULE || task.module,
      category: task.CATEGORY || task.category,
      returnTo: '/dashboard',
    };
  }

  return {};
};

// Returns backend-provided link or builds from module/category via getApprovalRoute
export const getNotificationLink = (notification) => {
  if (notification.link || notification.LINK) {
    return notification.link || notification.LINK;
  }

  return getApprovalRoute(
    notification.module || notification.MODULE,
    notification.category || notification.CATEGORY,
    notification.tappId || notification.TAPP_ID
  );
};
