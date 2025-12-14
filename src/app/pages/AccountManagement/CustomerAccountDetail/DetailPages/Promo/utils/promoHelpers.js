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
