/**
 * Promo Slice
 * Redux slice for promo state management under Account Management
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { promoService } from "../../services/promoService";

// Initial state
const initialState = {
  validPromoList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  },
  validPromoDetail: {
    data: null,
    loading: false,
    error: null,
  },
  promoCriteriaList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  },
  promoCriteriaDetail: {
    data: null,
    loading: false,
    error: null,
  },
  promoConditionList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  },
  promoConditionDetail: {
    data: null,
    loading: false,
    error: null,
  },
  promoHistoryList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  },
  promoHistoryDetail: {
    data: null,
    loading: false,
    error: null,
  },
  promoHistoryDetailDetail: {
    data: null,
    loading: false,
    error: null,
  },
  advancedSearch: {
    conditions: [],
    operators: [],
    promoColumns: [],
    criteriaColumns: [],
    conditionColumns: [],
    historyColumns: [],
    loading: false,
    error: null,
  },
};

// ==================== ASYNC THUNKS ====================

// Valid Promo Operations
export const fetchValidPromoList = createAsyncThunk(
  "promo/fetchValidPromoList",
  async ({ params, payload }, { rejectWithValue }) => {
    try {
      const response = await promoService.getListValidPromo(params, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchValidPromoDetail = createAsyncThunk(
  "promo/fetchValidPromoDetail",
  async (promoId, { rejectWithValue }) => {
    try {
      const response = await promoService.getDetailValidPromoById(promoId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const downloadValidPromoList = createAsyncThunk(
  "promo/downloadValidPromoList",
  async ({ params, advancedSearch }, { rejectWithValue }) => {
    try {
      const response = await promoService.downloadListValidPromo(
        params,
        advancedSearch,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Promo Criteria Operations
export const fetchPromoCriteriaList = createAsyncThunk(
  "promo/fetchPromoCriteriaList",
  async ({ params, advancedSearch }, { rejectWithValue }) => {
    try {
      const response = await promoService.getListValidPromoCriteriaByPromoId(
        params,
        advancedSearch,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchPromoCriteriaDetail = createAsyncThunk(
  "promo/fetchPromoCriteriaDetail",
  async (criteriaId, { rejectWithValue }) => {
    try {
      const response =
        await promoService.getDetailValidPromoCriteria(criteriaId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const downloadPromoCriteriaList = createAsyncThunk(
  "promo/downloadPromoCriteriaList",
  async ({ params, advancedSearch }, { rejectWithValue }) => {
    try {
      const response = await promoService.downloadListValidPromoCriteria(
        params,
        advancedSearch,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Promo Condition Operations
export const fetchPromoConditionList = createAsyncThunk(
  "promo/fetchPromoConditionList",
  async ({ params, advancedSearch }, { rejectWithValue }) => {
    try {
      const response = await promoService.getListValidPromoConditionByPromoId(
        params,
        advancedSearch,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchPromoConditionDetail = createAsyncThunk(
  "promo/fetchPromoConditionDetail",
  async (conditionId, { rejectWithValue }) => {
    try {
      const response =
        await promoService.getDetailValidPromoCondition(conditionId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const downloadPromoConditionList = createAsyncThunk(
  "promo/downloadPromoConditionList",
  async ({ params, advancedSearch }, { rejectWithValue }) => {
    try {
      const response = await promoService.downloadListValidPromoCondition(
        params,
        advancedSearch,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Promo History Operations
export const fetchPromoHistoryList = createAsyncThunk(
  "promo/fetchPromoHistoryList",
  async ({ params, advancedSearch }, { rejectWithValue }) => {
    try {
      const response = await promoService.getListPromoHistory(
        params,
        advancedSearch,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchPromoHistoryDetail = createAsyncThunk(
  "promo/fetchPromoHistoryDetail",
  async ({ billingCode, accountId }, { rejectWithValue }) => {
    try {
      const response = await promoService.getDetailPromoHistoryById(
        billingCode,
        accountId,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchPromoHistoryDetailDetail = createAsyncThunk(
  "promo/fetchPromoHistoryDetailDetail",
  async ({ billingCode, detailId, accountId }, { rejectWithValue }) => {
    try {
      const response = await promoService.getDetailDetailPromoHistoryById(
        billingCode,
        detailId,
        accountId,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const downloadPromoHistoryList = createAsyncThunk(
  "promo/downloadPromoHistoryList",
  async ({ params, advancedSearch }, { rejectWithValue }) => {
    try {
      const response = await promoService.downloadListPromoHistory(
        params,
        advancedSearch,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Advanced Search Helpers
export const fetchAdvancedSearchMetadata = createAsyncThunk(
  "promo/fetchAdvancedSearchMetadata",
  async (_, { rejectWithValue }) => {
    try {
      const [
        conditions,
        operators,
        promoColumns,
        criteriaColumns,
        conditionColumns,
        historyColumns,
      ] = await Promise.all([
        promoService.getAdvanceSearchCondition(),
        promoService.getAdvanceSearchOperator(),
        promoService.getAdvancePromoColumn(),
        promoService.getAdvancePromoCriteriaColumn(),
        promoService.getAdvancePromoConditionColumn(),
        promoService.getAdvancePromoHistoryColumn(),
      ]);

      return {
        conditions,
        operators,
        promoColumns,
        criteriaColumns,
        conditionColumns,
        historyColumns,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Slice
const promoSlice = createSlice({
  name: "promo",
  initialState,
  reducers: {
    // Synchronous actions
    clearValidPromoDetail: (state) => {
      state.validPromoDetail = initialState.validPromoDetail;
    },
    clearPromoCriteriaDetail: (state) => {
      state.promoCriteriaDetail = initialState.promoCriteriaDetail;
    },
    clearPromoConditionDetail: (state) => {
      state.promoConditionDetail = initialState.promoConditionDetail;
    },
    clearPromoHistoryDetail: (state) => {
      state.promoHistoryDetail = initialState.promoHistoryDetail;
    },
    clearPromoHistoryDetailDetail: (state) => {
      state.promoHistoryDetailDetail = initialState.promoHistoryDetailDetail;
    },
    resetPromoState: () => initialState,
  },
  extraReducers: (builder) => {
    // ==================== VALID PROMO LIST ====================
    builder
      .addCase(fetchValidPromoList.pending, (state) => {
        state.validPromoList.loading = true;
        state.validPromoList.error = null;
      })
      .addCase(fetchValidPromoList.fulfilled, (state, action) => {
        state.validPromoList.loading = false;
        // Store complete response for helper transformation
        state.validPromoList.data = action.payload;
      })
      .addCase(fetchValidPromoList.rejected, (state, action) => {
        state.validPromoList.loading = false;
        state.validPromoList.error = action.payload;
      });

    // ==================== VALID PROMO DETAIL ====================
    builder
      .addCase(fetchValidPromoDetail.pending, (state) => {
        state.validPromoDetail.loading = true;
        state.validPromoDetail.error = null;
      })
      .addCase(fetchValidPromoDetail.fulfilled, (state, action) => {
        state.validPromoDetail.loading = false;
        state.validPromoDetail.data = action.payload;
      })
      .addCase(fetchValidPromoDetail.rejected, (state, action) => {
        state.validPromoDetail.loading = false;
        state.validPromoDetail.error = action.payload;
      });

    // ==================== PROMO CRITERIA LIST ====================
    builder
      .addCase(fetchPromoCriteriaList.pending, (state) => {
        state.promoCriteriaList.loading = true;
        state.promoCriteriaList.error = null;
      })
      .addCase(fetchPromoCriteriaList.fulfilled, (state, action) => {
        state.promoCriteriaList.loading = false;
        state.promoCriteriaList.data = action.payload.data || [];
        state.promoCriteriaList.pagination = {
          current: action.payload.currentPage || 1,
          pageSize: action.payload.pageSize || 10,
          total: action.payload.total || 0,
        };
      })
      .addCase(fetchPromoCriteriaList.rejected, (state, action) => {
        state.promoCriteriaList.loading = false;
        state.promoCriteriaList.error = action.payload;
      });

    // ==================== PROMO CRITERIA DETAIL ====================
    builder
      .addCase(fetchPromoCriteriaDetail.pending, (state) => {
        state.promoCriteriaDetail.loading = true;
        state.promoCriteriaDetail.error = null;
      })
      .addCase(fetchPromoCriteriaDetail.fulfilled, (state, action) => {
        state.promoCriteriaDetail.loading = false;
        state.promoCriteriaDetail.data = action.payload;
      })
      .addCase(fetchPromoCriteriaDetail.rejected, (state, action) => {
        state.promoCriteriaDetail.loading = false;
        state.promoCriteriaDetail.error = action.payload;
      });

    // ==================== PROMO CONDITION LIST ====================
    builder
      .addCase(fetchPromoConditionList.pending, (state) => {
        state.promoConditionList.loading = true;
        state.promoConditionList.error = null;
      })
      .addCase(fetchPromoConditionList.fulfilled, (state, action) => {
        state.promoConditionList.loading = false;
        state.promoConditionList.data = action.payload.data || [];
        state.promoConditionList.pagination = {
          current: action.payload.currentPage || 1,
          pageSize: action.payload.pageSize || 10,
          total: action.payload.total || 0,
        };
      })
      .addCase(fetchPromoConditionList.rejected, (state, action) => {
        state.promoConditionList.loading = false;
        state.promoConditionList.error = action.payload;
      });

    // ==================== PROMO CONDITION DETAIL ====================
    builder
      .addCase(fetchPromoConditionDetail.pending, (state) => {
        state.promoConditionDetail.loading = true;
        state.promoConditionDetail.error = null;
      })
      .addCase(fetchPromoConditionDetail.fulfilled, (state, action) => {
        state.promoConditionDetail.loading = false;
        state.promoConditionDetail.data = action.payload;
      })
      .addCase(fetchPromoConditionDetail.rejected, (state, action) => {
        state.promoConditionDetail.loading = false;
        state.promoConditionDetail.error = action.payload;
      });

    // ==================== PROMO HISTORY LIST ====================
    builder
      .addCase(fetchPromoHistoryList.pending, (state) => {
        state.promoHistoryList.loading = true;
        state.promoHistoryList.error = null;
      })
      .addCase(fetchPromoHistoryList.fulfilled, (state, action) => {
        state.promoHistoryList.loading = false;
        state.promoHistoryList.data = action.payload;
      })
      .addCase(fetchPromoHistoryList.rejected, (state, action) => {
        state.promoHistoryList.loading = false;
        state.promoHistoryList.error = action.payload;
      });

    // ==================== PROMO HISTORY DETAIL ====================
    builder
      .addCase(fetchPromoHistoryDetail.pending, (state) => {
        state.promoHistoryDetail.loading = true;
        state.promoHistoryDetail.error = null;
      })
      .addCase(fetchPromoHistoryDetail.fulfilled, (state, action) => {
        state.promoHistoryDetail.loading = false;
        state.promoHistoryDetail.data = action.payload;
      })
      .addCase(fetchPromoHistoryDetail.rejected, (state, action) => {
        state.promoHistoryDetail.loading = false;
        state.promoHistoryDetail.error = action.payload;
      });

    // ==================== PROMO HISTORY DETAIL DETAIL ====================
    builder
      .addCase(fetchPromoHistoryDetailDetail.pending, (state) => {
        state.promoHistoryDetailDetail.loading = true;
        state.promoHistoryDetailDetail.error = null;
      })
      .addCase(fetchPromoHistoryDetailDetail.fulfilled, (state, action) => {
        state.promoHistoryDetailDetail.loading = false;
        state.promoHistoryDetailDetail.data = action.payload;
      })
      .addCase(fetchPromoHistoryDetailDetail.rejected, (state, action) => {
        state.promoHistoryDetailDetail.loading = false;
        state.promoHistoryDetailDetail.error = action.payload;
      });

    // ==================== ADVANCED SEARCH METADATA ====================
    builder
      .addCase(fetchAdvancedSearchMetadata.pending, (state) => {
        state.advancedSearch.loading = true;
        state.advancedSearch.error = null;
      })
      .addCase(fetchAdvancedSearchMetadata.fulfilled, (state, action) => {
        state.advancedSearch.loading = false;
        state.advancedSearch.conditions = action.payload.conditions || [];
        state.advancedSearch.operators = action.payload.operators || [];
        state.advancedSearch.promoColumns = action.payload.promoColumns || [];
        state.advancedSearch.criteriaColumns =
          action.payload.criteriaColumns || [];
        state.advancedSearch.conditionColumns =
          action.payload.conditionColumns || [];
        state.advancedSearch.historyColumns =
          action.payload.historyColumns || [];
      })
      .addCase(fetchAdvancedSearchMetadata.rejected, (state, action) => {
        state.advancedSearch.loading = false;
        state.advancedSearch.error = action.payload;
      });

    // ==================== DOWNLOAD OPERATIONS (No state storage - just for tracking) ====================
    // Download Valid Promo List
    builder
      .addCase(downloadValidPromoList.pending, (state) => {
        // Track download in progress if needed
      })
      .addCase(downloadValidPromoList.fulfilled, (state) => {
        // No need to store blob in state
      })
      .addCase(downloadValidPromoList.rejected, (state, action) => {
        console.error("Download failed:", action.payload);
      });

    // Download Promo Criteria List
    builder
      .addCase(downloadPromoCriteriaList.pending, (state) => {
        // Track download in progress if needed
      })
      .addCase(downloadPromoCriteriaList.fulfilled, (state) => {
        // No need to store blob in state
      })
      .addCase(downloadPromoCriteriaList.rejected, (state, action) => {
        console.error("Download criteria failed:", action.payload);
      });

    // Download Promo Condition List
    builder
      .addCase(downloadPromoConditionList.pending, (state) => {
        // Track download in progress if needed
      })
      .addCase(downloadPromoConditionList.fulfilled, (state) => {
        // No need to store blob in state
      })
      .addCase(downloadPromoConditionList.rejected, (state, action) => {
        console.error("Download condition failed:", action.payload);
      });

    // Download Promo History List
    builder
      .addCase(downloadPromoHistoryList.pending, (state) => {
        // Track download in progress if needed
      })
      .addCase(downloadPromoHistoryList.fulfilled, (state) => {
        // No need to store blob in state
      })
      .addCase(downloadPromoHistoryList.rejected, (state, action) => {
        console.error("Download promo history failed:", action.payload);
      });
  },
});

// Actions
export const {
  clearValidPromoDetail,
  clearPromoCriteriaDetail,
  clearPromoConditionDetail,
  clearPromoHistoryDetail,
  clearPromoHistoryDetailDetail,
  resetPromoState,
} = promoSlice.actions;

// Selectors
export const selectValidPromoList = (state) =>
  state.accountPromo.validPromoList;
export const selectValidPromoDetail = (state) =>
  state.accountPromo.validPromoDetail;
export const selectPromoCriteriaList = (state) =>
  state.accountPromo.promoCriteriaList;
export const selectPromoCriteriaDetail = (state) =>
  state.accountPromo.promoCriteriaDetail;
export const selectPromoConditionList = (state) =>
  state.accountPromo.promoConditionList;
export const selectPromoConditionDetail = (state) =>
  state.accountPromo.promoConditionDetail;
export const selectPromoHistoryList = (state) =>
  state.accountPromo.promoHistoryList;
export const selectPromoHistoryDetail = (state) =>
  state.accountPromo.promoHistoryDetail;
export const selectPromoHistoryDetailDetail = (state) =>
  state.accountPromo.promoHistoryDetailDetail;
export const selectAdvancedSearchMetadata = (state) =>
  state.accountPromo.advancedSearch;

// Reducer
export default promoSlice.reducer;
