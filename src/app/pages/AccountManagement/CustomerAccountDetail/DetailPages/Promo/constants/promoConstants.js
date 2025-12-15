/**
 * Promo Constants
 * Define constants for promo module
 */

// Promo status
export const PROMO_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  EXPIRED: 'EXPIRED',
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED',
};

// Promo types
export const PROMO_TYPE = {
  DISCOUNT: 'DISCOUNT',
  CASHBACK: 'CASHBACK',
  FREE_ITEM: 'FREE_ITEM',
  BUNDLE: 'BUNDLE',
};

// Table columns configuration
export const PROMO_TABLE_COLUMNS = {
  PROMO_CODE: 'promoCode',
  PROMO_NAME: 'promoName',
  DESCRIPTION: 'description',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  STATUS: 'status',
  TYPE: 'type',
  DISCOUNT_VALUE: 'discountValue',
};

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: ['10', '20', '50', '100'],
  SHOW_SIZE_CHANGER: true,
  SHOW_QUICK_JUMPER: true,
};

// API endpoints (if needed)
export const PROMO_ENDPOINTS = {
  GET_LIST: '/api/promo/list',
  GET_DETAIL: '/api/promo/detail',
  GET_HISTORY: '/api/promo/history',
  EXPORT: '/api/promo/export',
};

// Filter options
export const FILTER_OPTIONS = {
  STATUS: [
    { label: 'All', value: null },
    { label: 'Active', value: PROMO_STATUS.ACTIVE },
    { label: 'Inactive', value: PROMO_STATUS.INACTIVE },
    { label: 'Expired', value: PROMO_STATUS.EXPIRED },
    { label: 'Pending', value: PROMO_STATUS.PENDING },
    { label: 'Cancelled', value: PROMO_STATUS.CANCELLED },
  ],
  TYPE: [
    { label: 'All', value: null },
    { label: 'Discount', value: PROMO_TYPE.DISCOUNT },
    { label: 'Cashback', value: PROMO_TYPE.CASHBACK },
    { label: 'Free Item', value: PROMO_TYPE.FREE_ITEM },
    { label: 'Bundle', value: PROMO_TYPE.BUNDLE },
  ],
};

// Date format
export const DATE_FORMAT = {
  DISPLAY: 'DD MMM YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD MMM YYYY HH:mm:ss',
};
