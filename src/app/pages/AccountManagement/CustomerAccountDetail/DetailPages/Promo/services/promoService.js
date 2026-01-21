/**
 * Promo Service
 * Handle business logic for promo operations under Account Management
 */

import promoRepository from '../repository/promoRepository';

export const promoService = {
  // ==================== PROMO OPERATIONS ====================

  /**
   * Get list of valid promos with pagination and advanced search
   */
  async getListValidPromo(params, advancedSearch = null) {
    try {
      const response = await promoRepository.getListValidPromo(params, advancedSearch);
      return response;
    } catch (error) {
      console.error('Error fetching valid promo list:', error);
      throw error;
    }
  },

  /**
   * Get detail of valid promo by ID
   */
  async getDetailValidPromoById(promoId) {
    try {
      const response = await promoRepository.getDetailValidPromoById(promoId);
      return response;
    } catch (error) {
      console.error('Error fetching valid promo detail:', error);
      throw error;
    }
  },

  /**
   * Download list of valid promos
   */
  async downloadListValidPromo(params, advancedSearch = null) {
    try {
      const response = await promoRepository.downloadListValidPromo(params, advancedSearch);
      return response;
    } catch (error) {
      console.error('Error downloading valid promo list:', error);
      throw error;
    }
  },

  // ==================== PROMO CRITERIA OPERATIONS ====================

  /**
   * Get list of valid promo criteria by promo ID
   */
  async getListValidPromoCriteriaByPromoId(params, advancedSearch = null) {
    try {
      const response = await promoRepository.getListValidPromoCriteriaByPromoId(params, advancedSearch);
      return response;
    } catch (error) {
      console.error('Error fetching valid promo criteria list:', error);
      throw error;
    }
  },

  /**
   * Get detail of valid promo criteria by ID
   */
  async getDetailValidPromoCriteria(criteriaId) {
    try {
      const response = await promoRepository.getDetailValidPromoCriteria(criteriaId);
      return response;
    } catch (error) {
      console.error('Error fetching valid promo criteria detail:', error);
      throw error;
    }
  },

  /**
   * Download list of valid promo criteria
   */
  async downloadListValidPromoCriteria(params, advancedSearch = null) {
    try {
      const response = await promoRepository.downloadListValidPromoCriteria(params, advancedSearch);
      return response;
    } catch (error) {
      console.error('Error downloading valid promo criteria list:', error);
      throw error;
    }
  },

  // ==================== PROMO CONDITION OPERATIONS ====================

  /**
   * Get list of valid promo conditions by promo ID
   */
  async getListValidPromoConditionByPromoId(params, advancedSearch = null) {
    try {
      const response = await promoRepository.getListValidPromoConditionByPromoId(params, advancedSearch);
      return response;
    } catch (error) {
      console.error('Error fetching valid promo condition list:', error);
      throw error;
    }
  },

  /**
   * Get detail of valid promo condition by ID
   */
  async getDetailValidPromoCondition(conditionId) {
    try {
      const response = await promoRepository.getDetailValidPromoCondition(conditionId);
      return response;
    } catch (error) {
      console.error('Error fetching valid promo condition detail:', error);
      throw error;
    }
  },

  /**
   * Download list of valid promo conditions
   */
  async downloadListValidPromoCondition(params, advancedSearch = null) {
    try {
      const response = await promoRepository.downloadListValidPromoCondition(params, advancedSearch);
      return response;
    } catch (error) {
      console.error('Error downloading valid promo condition list:', error);
      throw error;
    }
  },

  // ==================== ADVANCED SEARCH HELPERS ====================

  /**
   * Get advance search condition list
   */
  async getAdvanceSearchCondition() {
    try {
      const response = await promoRepository.getAdvanceSearchCondition();
      return response.data || [];
    } catch (error) {
      console.error('Error fetching advance search conditions:', error);
      throw error;
    }
  },

  /**
   * Get advance search operator list
   */
  async getAdvanceSearchOperator() {
    try {
      const response = await promoRepository.getAdvanceSearchOperator();
      return response.data || [];
    } catch (error) {
      console.error('Error fetching advance search operators:', error);
      throw error;
    }
  },

  /**
   * Get advance search promo column list
   */
  async getAdvancePromoColumn() {
    try {
      const response = await promoRepository.getAdvancePromoColumn();
      return response.data || [];
    } catch (error) {
      console.error('Error fetching advance promo columns:', error);
      throw error;
    }
  },

  /**
   * Get advance search promo criteria column list
   */
  async getAdvancePromoCriteriaColumn() {
    try {
      const response = await promoRepository.getAdvancePromoCriteriaColumn();
      return response.data || [];
    } catch (error) {
      console.error('Error fetching advance promo criteria columns:', error);
      throw error;
    }
  },

  /**
   * Get advance search promo condition column list
   */
  async getAdvancePromoConditionColumn() {
    try {
      const response = await promoRepository.getAdvancePromoConditionColumn();
      return response.data || [];
    } catch (error) {
      console.error('Error fetching advance promo condition columns:', error);
      throw error;
    }
  },

  /**
   * Get advance search promo history column list
   */
  async getAdvancePromoHistoryColumn() {
    try {
      const response = await promoRepository.getAdvancePromoHistoryColumn();
      return response.data || [];
    } catch (error) {
      console.error('Error fetching advance promo history columns:', error);
      throw error;
    }
  },

  // ==================== PROMO HISTORY OPERATIONS ====================

  /**
   * Get list of promo history with pagination and advanced search
   */
  async getListPromoHistory(params, advancedSearch = null) {
    try {
      const response = await promoRepository.getListPromoHistory(params, advancedSearch);
      return response;
    } catch (error) {
      console.error('Error fetching promo history list:', error);
      throw error;
    }
  },

  /**
   * Get detail of promo history by billing code
   */
  async getDetailPromoHistoryById(billingCode, accountId) {
    try {
      console.log('Service layer - billingCode:', billingCode, 'accountId:', accountId);
      const response = await promoRepository.getDetailPromoHistoryById(billingCode, accountId);
      return response;
    } catch (error) {
      console.error('Error fetching promo history detail:', error);
      throw error;
    }
  },

  /**
   * Get detail of promo history detail by billing code and detail ID
   */
  async getDetailDetailPromoHistoryById(billingCode, detailId, accountId) {
    try {
      const response = await promoRepository.getDetailDetailPromoHistoryById(billingCode, detailId, accountId);
      return response;
    } catch (error) {
      console.error('Error fetching promo history detail:', error);
      throw error;
    }
  },

  /**
   * Download list of promo history
   */
  async downloadListPromoHistory(params, advancedSearch = null) {
    try {
      const response = await promoRepository.downloadListPromoHistory(params, advancedSearch);
      return response;
    } catch (error) {
      console.error('Error downloading promo history list:', error);
      throw error;
    }
  },
};
