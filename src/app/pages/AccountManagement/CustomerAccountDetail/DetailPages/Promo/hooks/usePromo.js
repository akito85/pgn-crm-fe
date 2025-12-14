/**
 * usePromo Hook
 * Custom hook for promo operations
 */

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPromoList,
  fetchPromoDetail,
  fetchPromoHistory,
  setPromoFilters,
  clearPromoFilters,
  clearPromoDetail,
  selectPromoList,
  selectPromoDetail,
  selectPromoHistory,
  selectPromoFilters,
} from '../store/slices/promoSlice';

export const usePromo = () => {
  const dispatch = useDispatch();
  const promoList = useSelector(selectPromoList);
  const promoDetail = useSelector(selectPromoDetail);
  const promoHistory = useSelector(selectPromoHistory);
  const filters = useSelector(selectPromoFilters);

  /**
   * Load promo list
   */
  const loadPromoList = useCallback(
    (params = {}) => {
      const queryParams = {
        ...filters,
        ...params,
      };
      dispatch(fetchPromoList(queryParams));
    },
    [dispatch, filters]
  );

  /**
   * Load promo detail
   */
  const loadPromoDetail = useCallback(
    (promoId) => {
      dispatch(fetchPromoDetail(promoId));
    },
    [dispatch]
  );

  /**
   * Load promo history
   */
  const loadPromoHistory = useCallback(
    (params = {}) => {
      dispatch(fetchPromoHistory(params));
    },
    [dispatch]
  );

  /**
   * Update filters
   */
  const updateFilters = useCallback(
    (newFilters) => {
      dispatch(setPromoFilters(newFilters));
    },
    [dispatch]
  );

  /**
   * Reset filters
   */
  const resetFilters = useCallback(() => {
    dispatch(clearPromoFilters());
  }, [dispatch]);

  /**
   * Clear detail
   */
  const clearDetail = useCallback(() => {
    dispatch(clearPromoDetail());
  }, [dispatch]);

  return {
    // State
    promoList,
    promoDetail,
    promoHistory,
    filters,

    // Actions
    loadPromoList,
    loadPromoDetail,
    loadPromoHistory,
    updateFilters,
    resetFilters,
    clearDetail,
  };
};

export default usePromo;
