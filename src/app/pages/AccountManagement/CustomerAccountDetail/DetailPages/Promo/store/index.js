/**
 * Promo Store Index
 * Export all slices and configure local store if needed
 */

import { combineReducers } from '@reduxjs/toolkit';
import promoReducer from './slices/promoSlice';

// Combine all promo-related reducers
export const promoReducers = combineReducers({
  promo: promoReducer,
  // Add more slices here as needed
  // criteria: criteriaReducer,
  // condition: conditionReducer,
});

// Export individual slices
export * from './slices/promoSlice';

// Export default for easy integration with main store
export default promoReducers;
