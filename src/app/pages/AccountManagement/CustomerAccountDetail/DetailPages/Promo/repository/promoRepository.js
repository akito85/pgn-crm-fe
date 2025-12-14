/**
 * Promo Repository
 * Handle all API calls for promo operations under Account Management
 */

import axios from "axios";
import { configApp } from "../../../../../../../constants/configApp";
import { tokenHeader } from "../../../../../../../utils/tokenHeader";
import FileSaver from "file-saver";
import { hasValue } from "../../../../../../../utils";

const BASE_URL = configApp.ACCOUNT_SERVICE;
const API_PATH = "/v1/dbs/api/promo";

const promoRepository = {
  // ==================== PROMO OPERATIONS ====================
  
  /**
   * Get list of valid promos with pagination and advanced search
   * POST /v1/dbs/api/promo/valid
   * @param {Object} params - Query parameters (page, size, sort, customerId, search, searchs)
   * @param {Object} advancedSearch - Advanced search criteria: { inputFields: [{condition, column, operator, value}] }
   */
  getListValidPromo: async (params, advancedSearch = null) => {
    try {
      const config = {
        params: params,
        headers: tokenHeader(),
      };

      const body = advancedSearch || { inputFields: [{ condition: "", column: "", operator: "", value: "" }] };
      const response = await axios.post(`${BASE_URL}${API_PATH}/valid`, body, config);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get detail of valid promo by ID
   * GET /v1/dbs/api/promo/valid/{id}
   * @param {number} promoId - Promo ID
   */
  getDetailValidPromoById: async (promoId) => {
    try {
      const response = await axios.get(`${BASE_URL}${API_PATH}/valid/${promoId}`, {
        headers: tokenHeader(),
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Download list of valid promos with advanced search
   * POST /v1/dbs/api/promo/download-valid
   * @param {Object} params - Query parameters (page, size, sort, customerId, search, searchs)
   * @param {Object} advancedSearch - Advanced search criteria
   */
  downloadListValidPromo: async (params, advancedSearch = null) => {
    try {
      const config = {
        params: params,
        headers: tokenHeader(),
        responseType: "blob",
      };

      const body = advancedSearch || { inputFields: [{ condition: "", column: "", operator: "", value: "" }] };
      const response = await axios.post(`${BASE_URL}${API_PATH}/download-valid`, body, config);

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

  // ==================== PROMO CRITERIA OPERATIONS ====================

  /**
   * Get list of valid promo criteria by promo ID
   * POST /v1/dbs/api/promo/criteria
   * @param {Object} params - Query parameters (page, size, promoId, search, searchs)
   * @param {Object} advancedSearch - Advanced search criteria
   */
  getListValidPromoCriteriaByPromoId: async (params, advancedSearch = null) => {
    try {
      const config = {
        params: params,
        headers: tokenHeader(),
      };

      const body = advancedSearch || { inputFields: [{ condition: "", column: "", operator: "", value: "" }] };
      const response = await axios.post(`${BASE_URL}${API_PATH}/criteria`, body, config);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get detail of valid promo criteria by ID
   * GET /v1/dbs/api/promo/criteria/{id}
   * @param {number} criteriaId - Criteria ID
   */
  getDetailValidPromoCriteria: async (criteriaId) => {
    try {
      const response = await axios.get(`${BASE_URL}${API_PATH}/criteria/${criteriaId}`, {
        headers: tokenHeader(),
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Download list of valid promo criteria by promo ID
   * POST /v1/dbs/api/promo/download-criteria
   * @param {Object} params - Query parameters (page, size, promoId, search, searchs)
   * @param {Object} advancedSearch - Advanced search criteria
   */
  downloadListValidPromoCriteria: async (params, advancedSearch = null) => {
    try {
      const config = {
        params: params,
        headers: tokenHeader(),
        responseType: "blob",
      };

      const body = advancedSearch || { inputFields: [{ condition: "", column: "", operator: "", value: "" }] };
      const response = await axios.post(`${BASE_URL}${API_PATH}/download-criteria`, body, config);

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

  // ==================== PROMO CONDITION OPERATIONS ====================

  /**
   * Get list of valid promo conditions by promo ID
   * POST /v1/dbs/api/promo/condition
   * @param {Object} params - Query parameters (page, size, promoId, search, searchs)
   * @param {Object} advancedSearch - Advanced search criteria
   */
  getListValidPromoConditionByPromoId: async (params, advancedSearch = null) => {
    try {
      const config = {
        params: params,
        headers: tokenHeader(),
      };

      const body = advancedSearch || { inputFields: [{ condition: "", column: "", operator: "", value: "" }] };
      const response = await axios.post(`${BASE_URL}${API_PATH}/condition`, body, config);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get detail of valid promo condition by ID
   * GET /v1/dbs/api/promo/condition/{id}
   * @param {number} conditionId - Condition ID
   */
  getDetailValidPromoCondition: async (conditionId) => {
    try {
      const response = await axios.get(`${BASE_URL}${API_PATH}/condition/${conditionId}`, {
        headers: tokenHeader(),
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Download list of valid promo conditions by promo ID
   * POST /v1/dbs/api/promo/download-condition
   * @param {Object} params - Query parameters (page, size, promoId, search, searchs)
   * @param {Object} advancedSearch - Advanced search criteria
   */
  downloadListValidPromoCondition: async (params, advancedSearch = null) => {
    try {
      const config = {
        params: params,
        headers: tokenHeader(),
        responseType: "blob",
      };

      const body = advancedSearch || { inputFields: [{ condition: "", column: "", operator: "", value: "" }] };
      const response = await axios.post(`${BASE_URL}${API_PATH}/download-condition`, body, config);

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

  // ==================== ADVANCED SEARCH HELPERS ====================

  /**
   * Get advance search condition list
   * GET /v1/dbs/api/promo/list-search-condition
   */
  getAdvanceSearchCondition: async () => {
    try {
      const response = await axios.get(`${BASE_URL}${API_PATH}/list-search-condition`, {
        headers: tokenHeader(),
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get advance search operator list
   * GET /v1/dbs/api/promo/list-search-operator
   */
  getAdvanceSearchOperator: async () => {
    try {
      const response = await axios.get(`${BASE_URL}${API_PATH}/list-search-operator`, {
        headers: tokenHeader(),
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get advance search promo column list (under account)
   * GET /v1/dbs/api/promo/list-search-promo-column
   */
  getAdvancePromoColumn: async () => {
    try {
      const response = await axios.get(`${BASE_URL}${API_PATH}/list-search-promo-column`, {
        headers: tokenHeader(),
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get advance search promo criteria column list (under account)
   * GET /v1/dbs/api/promo/list-search-promo-criteria-column
   */
  getAdvancePromoCriteriaColumn: async () => {
    try {
      const response = await axios.get(`${BASE_URL}${API_PATH}/list-search-promo-criteria-column`, {
        headers: tokenHeader(),
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get advance search promo condition column list (under account)
   * GET /v1/dbs/api/promo/list-search-promo-condition-column
   */
  getAdvancePromoConditionColumn: async () => {
    try {
      const response = await axios.get(`${BASE_URL}${API_PATH}/list-search-promo-condition-column`, {
        headers: tokenHeader(),
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get advance search promo history column list (under account)
   * GET /v1/dbs/api/promo/list-search-promo-history-column
   */
  getAdvancePromoHistoryColumn: async () => {
    try {
      const response = await axios.get(`${BASE_URL}${API_PATH}/list-search-promo-history-column`, {
        headers: tokenHeader(),
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== PROMO HISTORY OPERATIONS ====================

  /**
   * Get list of promo history with pagination and advanced search
   * POST /v1/dbs/api/promo/history
   * @param {Object} params - Query parameters (page, size, sort, customerId, search, searchs)
   * @param {Object} advancedSearch - Advanced search criteria: { inputFields: [{condition, column, operator, value}] }
   */
  getListPromoHistory: async (params, advancedSearch = null) => {
    try {
      const config = {
        params: params,
        headers: tokenHeader(),
      };

      const body = advancedSearch || { inputFields: [{ condition: "", column: "", operator: "", value: "" }] };
      const response = await axios.post(`${BASE_URL}${API_PATH}/history`, body, config);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get detail of promo history by invoice number
   * GET /v1/dbs/api/promo/history/{invoiceNumber}
   * @param {string} invoiceNumber - Invoice number
   */
  getDetailPromoHistoryById: async (invoiceNumber) => {
    try {
      const response = await axios.get(`${BASE_URL}${API_PATH}/history/${invoiceNumber}`, {
        headers: tokenHeader(),
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Download list of promo history with advanced search
   * POST /v1/dbs/api/promo/download-history
   * @param {Object} params - Query parameters (page, size, sort, customerId, search, searchs)
   * @param {Object} advancedSearch - Advanced search criteria
   */
  downloadListPromoHistory: async (params, advancedSearch = null) => {
    try {
      const config = {
        params: params,
        headers: tokenHeader(),
        responseType: "blob",
      };

      const body = advancedSearch || { inputFields: [{ condition: "", column: "", operator: "", value: "" }] };
      const response = await axios.post(`${BASE_URL}${API_PATH}/download-history`, body, config);

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

  // ==================== UI HELPERS ====================

  /**
   * Get table columns configuration for Valid Promo List
   * @param {Function} setIsModalVisible - Function to show modal
   * @param {Function} setDetailData - Function to set detail data
   * @returns {Array} - Array of column definitions
   */
  getColumns: (setIsModalVisible, setDetailData) => {
    const { UnorderedListOutlined } = require("@ant-design/icons");
    const { Col } = require("antd");
    const TagStatus = require("../components/TagStatus").default;

    return [
      {
        title: "No",
        dataIndex: "no",
        key: "no",
        width: 60,
        fixed: 'left',
        disableFilter: true,
        disableSorter: true,
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 200,
        ellipsis: true,
      },
      {
        title: "Promotion Type",
        dataIndex: "promotionType",
        key: "promotionType",
        width: 130,
      },
      {
        title: "Type Name",
        dataIndex: "typeName",
        key: "typeName",
        width: 150,
      },
      {
        title: "Category Name",
        dataIndex: "categoryName",
        key: "categoryName",
        width: 130,
      },
      {
        title: "Criteria",
        dataIndex: "criteria",
        key: "criteria",
        width: 200,
        ellipsis: true,
      },
      {
        title: "Start Date",
        dataIndex: "startDate",
        key: "startDate",
        width: 120,
      },
      {
        title: "End Date",
        dataIndex: "endDate",
        key: "endDate",
        width: 120,
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: 200,
        ellipsis: true,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 100,
        render: (status) => <TagStatus status={status === "ACTIVE" ? "Active" : status} />,
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        width: 80,
        fixed: 'right',
        disableFilter: true,
        disableSorter: true,
        render: (_, record) => (
          <Col span={24} className="text-center">
            <UnorderedListOutlined
              style={{ cursor: "pointer" }}
              onClick={() => {
                setIsModalVisible(true);
                setDetailData(record);
              }}
            />
          </Col>
        ),
      },
    ];
  },
};

export default promoRepository;
