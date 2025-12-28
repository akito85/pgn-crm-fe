/**
 * Promo Repository - Real API Example
 * Handle all API calls for promo operations
 */

import axios from "axios";
import { configApp } from "../../../../../constants/configApp";
import { tokenHeader } from "../../../../../utils/tokenHeader";
import FileSaver from "file-saver";
import { hasValue } from "../../../../../utils";

const promoRepository = {
  /**
   * Get promo list with pagination
   */
  getPromoList: async (params) => {
    try {
      const response = await axios.get(
        `${configApp.MASTER_MANAGEMENT}/api/promo/list`,
        {
          params: params,
          headers: tokenHeader(),
        }
      );
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get promo detail by ID
   */
  getPromoDetail: async (promoId) => {
    try {
      const response = await axios.get(
        `${configApp.MASTER_MANAGEMENT}/api/promo/${promoId}`,
        {
          headers: tokenHeader(),
        }
      );
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create new promo
   */
  createPromo: async (data) => {
    try {
      const response = await axios.post(
        `${configApp.MASTER_MANAGEMENT}/api/promo`,
        data,
        {
          headers: tokenHeader(),
        }
      );
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update existing promo
   */
  updatePromo: async (promoId, data) => {
    try {
      const response = await axios.put(
        `${configApp.MASTER_MANAGEMENT}/api/promo/${promoId}`,
        data,
        {
          headers: tokenHeader(),
        }
      );
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete promo
   */
  deletePromo: async (promoId) => {
    try {
      const response = await axios.delete(
        `${configApp.MASTER_MANAGEMENT}/api/promo/${promoId}`,
        {
          headers: tokenHeader(),
        }
      );
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Export promo data to Excel
   */
  exportPromo: async (params) => {
    try {
      const response = await axios.get(
        `${configApp.MASTER_MANAGEMENT}/api/promo/export`,
        {
          params: params,
          headers: tokenHeader(),
          responseType: "blob",
        }
      );

      // Handle file download
      if (hasValue(response.headers?.get("content-disposition"))) {
        const filename = response.headers
          .get("content-disposition")
          .split(";")
          .find((n) => n.includes("filename="))
          .replace("filename=", "")
          .trim();

        const blob = await response?.data;
        FileSaver.saveAs(blob, filename);
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Activate promo
   */
  activatePromo: async (promoId) => {
    try {
      const response = await axios.post(
        `${configApp.MASTER_MANAGEMENT}/api/promo/${promoId}/activate`,
        {},
        {
          headers: tokenHeader(),
        }
      );
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Deactivate promo
   */
  deactivatePromo: async (promoId) => {
    try {
      const response = await axios.post(
        `${configApp.MASTER_MANAGEMENT}/api/promo/${promoId}/deactivate`,
        {},
        {
          headers: tokenHeader(),
        }
      );
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== DUMMY DATA FOR DEVELOPMENT =====
  // Uncomment this section if backend is not ready yet
  /*
  getPromoList: () => [
    {
      key: "1",
      no: 1,
      name: "Summer Sale",
      type: "Percentage",
      category: "Seasonal",
      criteria: "Min Purchase 100k",
      startDate: "2024-06-01",
      endDate: "2024-06-30",
      description: "Summer discount promotion",
      status: "Active",
      item: "Koleksi Musim Panas",
    },
    // ... more dummy data
  ],
  */
};

export default promoRepository;
