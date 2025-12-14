/**
 * Promo Helpers
 * Utility functions for promo operations
 */

import { PROMO_STATUS, DATE_FORMAT } from '../constants/promoConstants';
import moment from 'moment';

/**
 * Format promo status for display
 */
export const formatPromoStatus = (status) => {
  const statusMap = {
    [PROMO_STATUS.ACTIVE]: { text: 'Active', color: 'green' },
    [PROMO_STATUS.INACTIVE]: { text: 'Inactive', color: 'gray' },
    [PROMO_STATUS.EXPIRED]: { text: 'Expired', color: 'red' },
    [PROMO_STATUS.PENDING]: { text: 'Pending', color: 'orange' },
    [PROMO_STATUS.CANCELLED]: { text: 'Cancelled', color: 'red' },
  };

  return statusMap[status] || { text: status, color: 'default' };
};

/**
 * Check if promo is active
 */
export const isPromoActive = (promo) => {
  if (!promo) return false;
  
  const now = moment();
  const startDate = moment(promo.startDate);
  const endDate = moment(promo.endDate);

  return (
    promo.status === PROMO_STATUS.ACTIVE &&
    now.isSameOrAfter(startDate) &&
    now.isSameOrBefore(endDate)
  );
};

/**
 * Check if promo is expired
 */
export const isPromoExpired = (promo) => {
  if (!promo) return false;
  
  const now = moment();
  const endDate = moment(promo.endDate);

  return now.isAfter(endDate);
};

/**
 * Format date for display
 */
export const formatDate = (date, format = DATE_FORMAT.DISPLAY) => {
  if (!date) return '-';
  return moment(date).format(format);
};

/**
 * Format date range
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '-';
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

/**
 * Calculate promo validity days
 */
export const calculateValidityDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  const start = moment(startDate);
  const end = moment(endDate);
  
  return end.diff(start, 'days') + 1;
};

/**
 * Calculate remaining days
 */
export const calculateRemainingDays = (endDate) => {
  if (!endDate) return 0;
  
  const now = moment();
  const end = moment(endDate);
  
  const days = end.diff(now, 'days');
  return days > 0 ? days : 0;
};

/**
 * Format discount value
 */
export const formatDiscountValue = (value, type = 'percentage') => {
  if (!value && value !== 0) return '-';
  
  return type === 'percentage' ? `${value}%` : `Rp ${value.toLocaleString('id-ID')}`;
};

/**
 * Validate promo data
 */
export const validatePromoData = (promo) => {
  const errors = {};

  if (!promo.promoCode) {
    errors.promoCode = 'Promo code is required';
  }

  if (!promo.promoName) {
    errors.promoName = 'Promo name is required';
  }

  if (!promo.startDate) {
    errors.startDate = 'Start date is required';
  }

  if (!promo.endDate) {
    errors.endDate = 'End date is required';
  }

  if (promo.startDate && promo.endDate) {
    const start = moment(promo.startDate);
    const end = moment(promo.endDate);
    
    if (end.isBefore(start)) {
      errors.endDate = 'End date must be after start date';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Parse query params for API
 */
export const parsePromoQueryParams = (filters, pagination) => {
  const params = {};

  // Add filters
  if (filters.searchText) {
    params.search = filters.searchText;
  }

  if (filters.status) {
    params.status = filters.status;
  }

  if (filters.dateRange && filters.dateRange.length === 2) {
    params.startDate = moment(filters.dateRange[0]).format(DATE_FORMAT.API);
    params.endDate = moment(filters.dateRange[1]).format(DATE_FORMAT.API);
  }

  // Add pagination
  if (pagination) {
    params.page = pagination.current || 1;
    params.pageSize = pagination.pageSize || 10;
  }

  return params;
};

/**
 * Convert column value to field name (camelCase)
 * e.g., "SUB DISTRICT" -> "subDistrict"
 * @param {string} value - Column value from API
 * @returns {string} - Field name in camelCase
 */
const convertValueToFieldName = (value) => {
  if (!value) return '';
  
  return value
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
};

/**
 * Transform API columns to table columns format
 * @param {Array} apiColumns - Columns from API (advancedSearchMetadata)
 * @param {Function} onViewDetail - Callback when action button clicked
 * @returns {Array} - Transformed columns for table
 */
export const transformApiColumnsToTable = (apiColumns, onViewDetail) => {
  if (!apiColumns || !Array.isArray(apiColumns)) {
    return [];
  }

  console.log('API Columns:', apiColumns);

  const transformedColumns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 60,
      fixed: 'left',
      disableFilter: true,
      disableSorter: true,
      render: (_, __, index) => index + 1,
    },
    ...apiColumns.map((col) => {
      // Get field name from API response
      const fieldName = convertValueToFieldName(col.value || col.column || col.name);
      const title = col.value || col.label || col.column || col.name;
      
      // Set default width based on column type
      let width = 150;
      if (title.toLowerCase().includes('date')) {
        width = 120;
      } else if (title.toLowerCase().includes('name') || title.toLowerCase().includes('description')) {
        width = 200;
      } else if (title.toLowerCase().includes('status')) {
        width = 100;
      } else if (title.toLowerCase().includes('type') || title.toLowerCase().includes('category')) {
        width = 130;
      }
      
      return {
        title: title,
        dataIndex: fieldName,
        key: fieldName,
        width: width,
        ellipsis: true,
      };
    }),
  ];

  // Add action column if callback provided
  if (onViewDetail) {
    transformedColumns.push({
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 80,
      fixed: 'right',
      disableFilter: true,
      disableSorter: true,
      render: (_, record) => onViewDetail(record),
    });
  }

  console.log('Transformed Columns:', transformedColumns);

  return transformedColumns;
};

/**
 * Transform API data to table data source
 * @param {Array} apiData - Data from API
 * @returns {Array} - Transformed data for table
 */
export const transformApiDataToTable = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) {
    return [];
  }

  return apiData.map((item, index) => ({
    key: item.id || index,
    no: index + 1,
    ...item,
  }));
};

/**
 * Transform Valid Promo API response to table format
 * @param {Object} apiResponse - Full API response with data, page, links
 * @returns {Object} - { dataSource, pagination }
 */
export const transformValidPromoResponse = (apiResponse) => {
  if (!apiResponse || !apiResponse.data) {
    return {
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    };
  }

  const { result = [], page = {} } = apiResponse.data;

  // Transform data for table
  const dataSource = result.map((item, index) => ({
    key: item.id || index,
    no: (page.number || 0) * (page.size || 10) + index + 1,
    id: item.id,
    name: item.name || '-',
    promotionType: item.promotionType || '-',
    typeName: item.typeName || '-',
    categoryName: item.categoryName || '-',
    criteria: item.criteria || '-',
    startDate: formatDate(item.startDate),
    endDate: item.endDate ? formatDate(item.endDate) : '-',
    description: item.description || '-',
    status: item.status || '-',
    statusDisplay: formatPromoStatus(item.status),
  }));

  // Transform pagination
  const pagination = {
    current: (page.number || 0) + 1, // API uses 0-based index
    pageSize: page.size || 10,
    total: page.totalElements || 0,
    totalPages: page.totalPages || 0,
  };

  return {
    dataSource,
    pagination,
  };
};

/**
 * Transform Promo Criteria API response to table format
 * @param {Object} apiResponse - API response for criteria list
 * @returns {Object} - { dataSource, pagination }
 */
export const transformPromoCriteriaResponse = (apiResponse) => {
  if (!apiResponse || !apiResponse.data) {
    return {
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    };
  }

  const { result = [], page = {} } = apiResponse.data;

  const dataSource = result.map((item, index) => ({
    key: item.id || index,
    no: (page.number || 0) * (page.size || 10) + index + 1,
    ...item,
  }));

  const pagination = {
    current: (page.number || 0) + 1,
    pageSize: page.size || 10,
    total: page.totalElements || 0,
    totalPages: page.totalPages || 0,
  };

  return {
    dataSource,
    pagination,
  };
};

/**
 * Transform Promo Condition API response to table format
 * @param {Object} apiResponse - API response for condition list
 * @returns {Object} - { dataSource, pagination }
 */
export const transformPromoConditionResponse = (apiResponse) => {
  if (!apiResponse || !apiResponse.data) {
    return {
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    };
  }

  const { result = [], page = {} } = apiResponse.data;

  const dataSource = result.map((item, index) => ({
    key: item.id || index,
    no: (page.number || 0) * (page.size || 10) + index + 1,
    ...item,
  }));

  const pagination = {
    current: (page.number || 0) + 1,
    pageSize: page.size || 10,
    total: page.totalElements || 0,
    totalPages: page.totalPages || 0,
  };

  return {
    dataSource,
    pagination,
  };
};

/**
 * Transform Promo History API response to table format
 * @param {Object} apiResponse - API response for history list
 * @returns {Object} - { dataSource, pagination }
 */
export const transformPromoHistoryResponse = (apiResponse) => {
  if (!apiResponse || !apiResponse.data) {
    return {
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    };
  }

  const { result = [], page = {} } = apiResponse.data;

  const dataSource = result.map((item, index) => ({
    key: item.id || index,
    no: (page.number || 0) * (page.size || 10) + index + 1,
    ...item,
  }));

  const pagination = {
    current: (page.number || 0) + 1,
    pageSize: page.size || 10,
    total: page.totalElements || 0,
    totalPages: page.totalPages || 0,
  };

  return {
    dataSource,
    pagination,
  };
};

/**
 * Build advanced search body for API
 * @param {Object} searchCriteria - Search criteria object
 * @returns {Object} - Advanced search body
 */
export const buildAdvancedSearchBody = (searchCriteria = {}) => {
  const inputFields = [];

  Object.keys(searchCriteria).forEach((key) => {
    const value = searchCriteria[key];
    
    if (value !== null && value !== undefined && value !== '') {
      inputFields.push({
        condition: searchCriteria.condition || 'AND',
        column: key,
        operator: searchCriteria.operator || 'EQUALS',
        value: value,
      });
    }
  });

  return {
    inputFields: inputFields.length > 0 ? inputFields : [],
  };
};

/**
 * Format promo criteria display
 * @param {string} criteria - Criteria string (comma-separated)
 * @returns {Array} - Array of criteria items
 */
export const formatPromoCriteria = (criteria) => {
  if (!criteria || criteria === 'All') {
    return ['All'];
  }

  return criteria
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

/**
 * Get promo type badge color
 * @param {string} typeName - Type name (RATING, BILLING, RATING & BILLING)
 * @returns {string} - Color class or hex
 */
export const getPromoTypeBadgeColor = (typeName) => {
  const typeColorMap = {
    'RATING': 'blue',
    'BILLING': 'green',
    'RATING & BILLING': 'purple',
  };

  return typeColorMap[typeName] || 'default';
};

/**
 * Get promo category badge color
 * @param {string} categoryName - Category name (ALL, SPECIFIED)
 * @returns {string} - Color class or hex
 */
export const getPromoCategoryBadgeColor = (categoryName) => {
  const categoryColorMap = {
    'ALL': 'cyan',
    'SPECIFIED': 'orange',
  };

  return categoryColorMap[categoryName] || 'default';
};
