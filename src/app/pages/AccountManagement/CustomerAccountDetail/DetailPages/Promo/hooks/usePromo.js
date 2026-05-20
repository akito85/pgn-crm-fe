/**
 * usePromo Hook
 * Custom hook for promo operations under Account Management
 */

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchValidPromoList,
  fetchValidPromoDetail,
  fetchPromoCriteriaList,
  fetchPromoCriteriaDetail,
  fetchPromoConditionList,
  fetchPromoConditionDetail,
  fetchPromoHistoryList,
  fetchPromoHistoryDetail,
  fetchPromoHistoryDetailDetail,
  downloadValidPromoList,
  downloadPromoCriteriaList,
  downloadPromoConditionList,
  downloadPromoHistoryList,
  fetchAdvancedSearchMetadata,
  clearValidPromoDetail,
  clearPromoCriteriaDetail,
  clearPromoConditionDetail,
  clearPromoHistoryDetail,
  clearPromoHistoryDetailDetail,
  selectValidPromoList,
  selectValidPromoDetail,
  selectPromoCriteriaList,
  selectPromoCriteriaDetail,
  selectPromoConditionList,
  selectPromoConditionDetail,
  selectPromoHistoryList,
  selectPromoHistoryDetail,
  selectPromoHistoryDetailDetail,
  selectAdvancedSearchMetadata,
} from "../store/slices/promoSlice";

export const usePromo = () => {
  const dispatch = useDispatch();

  // Selectors
  const validPromoList = useSelector(selectValidPromoList);
  const validPromoDetail = useSelector(selectValidPromoDetail);
  const promoCriteriaList = useSelector(selectPromoCriteriaList);
  const promoCriteriaDetail = useSelector(selectPromoCriteriaDetail);
  const promoConditionList = useSelector(selectPromoConditionList);
  const promoConditionDetail = useSelector(selectPromoConditionDetail);
  const promoHistoryList = useSelector(selectPromoHistoryList);
  const promoHistoryDetail = useSelector(selectPromoHistoryDetail);
  const promoHistoryDetailDetail = useSelector(selectPromoHistoryDetailDetail);
  const advancedSearchMetadata = useSelector(selectAdvancedSearchMetadata);

  // ==================== VALID PROMO OPERATIONS ====================

  /**
   * Load valid promo list
   */
  const loadValidPromoList = useCallback(
    (params = {}, payload = null) => {
      dispatch(fetchValidPromoList({ params, payload }));
    },
    [dispatch],
  );

  /**
   * Load valid promo detail
   */
  const loadValidPromoDetail = useCallback(
    (promoId) => {
      dispatch(fetchValidPromoDetail(promoId));
    },
    [dispatch],
  );

  /**
   * Download valid promo list
   */
  const downloadValidPromo = useCallback(
    (params = {}, advancedSearch = null) => {
      dispatch(downloadValidPromoList({ params, advancedSearch }));
    },
    [dispatch],
  );

  /**
   * Clear valid promo detail
   */
  const clearValidPromo = useCallback(() => {
    dispatch(clearValidPromoDetail());
  }, [dispatch]);

  // ==================== PROMO CRITERIA OPERATIONS ====================

  /**
   * Load promo criteria list
   */
  const loadPromoCriteriaList = useCallback(
    (params = {}, advancedSearch = null) => {
      dispatch(fetchPromoCriteriaList({ params, advancedSearch }));
    },
    [dispatch],
  );

  /**
   * Load promo criteria detail
   */
  const loadPromoCriteriaDetail = useCallback(
    (criteriaId) => {
      dispatch(fetchPromoCriteriaDetail(criteriaId));
    },
    [dispatch],
  );

  /**
   * Download promo criteria list
   */
  const downloadPromoCriteria = useCallback(
    (params = {}, advancedSearch = null) => {
      dispatch(downloadPromoCriteriaList({ params, advancedSearch }));
    },
    [dispatch],
  );

  /**
   * Clear promo criteria detail
   */
  const clearPromoCriteria = useCallback(() => {
    dispatch(clearPromoCriteriaDetail());
  }, [dispatch]);

  // ==================== PROMO CONDITION OPERATIONS ====================

  /**
   * Load promo condition list
   */
  const loadPromoConditionList = useCallback(
    (params = {}, advancedSearch = null) => {
      dispatch(fetchPromoConditionList({ params, advancedSearch }));
    },
    [dispatch],
  );

  /**
   * Load promo condition detail
   */
  const loadPromoConditionDetail = useCallback(
    (conditionId) => {
      dispatch(fetchPromoConditionDetail(conditionId));
    },
    [dispatch],
  );

  /**
   * Download promo condition list
   */
  const downloadPromoCondition = useCallback(
    (params = {}, advancedSearch = null) => {
      dispatch(downloadPromoConditionList({ params, advancedSearch }));
    },
    [dispatch],
  );

  /**
   * Clear promo condition detail
   */
  const clearPromoCondition = useCallback(() => {
    dispatch(clearPromoConditionDetail());
  }, [dispatch]);

  // ==================== PROMO HISTORY OPERATIONS ====================

  /**
   * Load promo history list
   */
  const loadPromoHistoryList = useCallback(
    (params = {}, payload = null) => {
      dispatch(fetchPromoHistoryList({ params, payload }));
    },
    [dispatch],
  );

  /**
   * Load promo history detail
   */
  const loadPromoHistoryDetail = useCallback(
    (billingCode, accountId) => {
      dispatch(fetchPromoHistoryDetail({ billingCode, accountId }));
    },
    [dispatch],
  );

  /**
   * Load promo history detail detail
   */
  const loadPromoHistoryDetailDetail = useCallback(
    (billingCode, detailId, accountId) => {
      dispatch(
        fetchPromoHistoryDetailDetail({ billingCode, detailId, accountId }),
      );
    },
    [dispatch],
  );

  /**
   * Download promo history list
   */
  const downloadPromoHistory = useCallback(
    (params = {}, advancedSearch = null) => {
      dispatch(downloadPromoHistoryList({ params, advancedSearch }));
    },
    [dispatch],
  );

  /**
   * Clear promo history detail
   */
  const clearPromoHistory = useCallback(() => {
    dispatch(clearPromoHistoryDetail());
  }, [dispatch]);

  /**
   * Clear promo history detail detail
   */
  const clearDetailOfPromoHistory = useCallback(() => {
    dispatch(clearPromoHistoryDetailDetail());
  }, [dispatch]);

  // ==================== ADVANCED SEARCH ====================

  /**
   * Load advanced search metadata (conditions, operators, columns)
   */
  const loadAdvancedSearchMetadata = useCallback(() => {
    dispatch(fetchAdvancedSearchMetadata());
  }, [dispatch]);

  return {
    // State
    validPromoList,
    validPromoDetail,
    promoCriteriaList,
    promoCriteriaDetail,
    promoConditionList,
    promoConditionDetail,
    promoHistoryList,
    promoHistoryDetail,
    promoHistoryDetailDetail,
    advancedSearchMetadata,

    // Valid Promo Actions
    loadValidPromoList,
    loadValidPromoDetail,
    downloadValidPromo,
    clearValidPromo,

    // Criteria Actions
    loadPromoCriteriaList,
    loadPromoCriteriaDetail,
    downloadPromoCriteria,
    clearPromoCriteria,

    // Condition Actions
    loadPromoConditionList,
    loadPromoConditionDetail,
    downloadPromoCondition,
    clearPromoCondition,

    // History Actions
    loadPromoHistoryList,
    loadPromoHistoryDetail,
    loadPromoHistoryDetailDetail,
    downloadPromoHistory,
    clearPromoHistory,
    clearDetailOfPromoHistory,

    // Advanced Search Actions
    loadAdvancedSearchMetadata,
  };
};

export default usePromo;
