/**
 * Promo Service
 * Handle business logic for promo operations
 */

import promoRepository from '../repository/promoRepository';
import promoHistoryRepository from '../repository/promoHistoryRepository';
import promoCriteriaRepository from '../repository/promoCriteriaRepository';
import promoConditionRepository from '../repository/promoConditionRepository';

export const promoService = {
  /**
   * Get promo list
   */
  async getPromoList(params) {
    try {
      const response = await promoRepository.getPromoList(params);
      return response;
    } catch (error) {
      console.error('Error fetching promo list:', error);
      throw error;
    }
  },

  /**
   * Get promo detail
   */
  async getPromoDetail(promoId) {
    try {
      const response = await promoRepository.getPromoDetail(promoId);
      return response;
    } catch (error) {
      console.error('Error fetching promo detail:', error);
      throw error;
    }
  },

  /**
   * Get promo history
   */
  async getPromoHistory(params) {
    try {
      const response = await promoHistoryRepository.getPromoHistory(params);
      return response;
    } catch (error) {
      console.error('Error fetching promo history:', error);
      throw error;
    }
  },

  /**
   * Get promo criteria
   */
  async getPromoCriteria(promoId) {
    try {
      const response = await promoCriteriaRepository.getCriteria(promoId);
      return response;
    } catch (error) {
      console.error('Error fetching promo criteria:', error);
      throw error;
    }
  },

  /**
   * Get promo conditions
   */
  async getPromoConditions(promoId) {
    try {
      const response = await promoConditionRepository.getConditions(promoId);
      return response;
    } catch (error) {
      console.error('Error fetching promo conditions:', error);
      throw error;
    }
  },

  /**
   * Export promo data
   */
  async exportPromoData(params) {
    try {
      const response = await promoRepository.exportPromo(params);
      return response;
    } catch (error) {
      console.error('Error exporting promo data:', error);
      throw error;
    }
  },
};

export default promoService;
