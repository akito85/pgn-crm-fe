/**
 * Promo Slice
 * Redux slice for promo state management under Account Management
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { promoService } from '../../services/promoService';

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
  advancedSearch: {
    conditions: [],
    operators: [],
    promoColumns: [],
    criteriaColumns: [],
    conditionColumns: [],
    loading: false,
    error: null,
  },
};

// ==================== ASYNC THUNKS ====================

// Valid Promo Operations
export const fetchValidPromoList = createAsyncThunk(
  'promo/fetchValidPromoList',
  async ({ params, advancedSearch }, { rejectWithValue }) => {
    try {
      const response = await promoService.getListValidPromo(params, advancedSearch);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchValidPromoDetail = createAsyncThunk(
  'promo/fetchValidPromoDetail',
  async (promoId, { rejectWithValue }) => {
    try {
      const response = await promoService.getDetailValidPromoById(promoId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const downloadValidPromoList = createAsyncThunk(
  'promo/downloadValidPromoList',
  async ({ params, advancedSearch }, { rejectWithValue }) => {
    try {
      const response = await promoService.downloadListValidPromo(params, advancedSearch);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Promo Criteria Operations
export const fetchPromoCriteriaList = createAsyncThunk(
  'promo/fetchPromoCriteriaList',
  async ({ params, advancedSearch }, { rejectWithValue }) => {
    try {
      const response = await promoService.getListValidPromoCriteriaByPromoId(params, advancedSearch);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPromoCriteriaDetail = createAsyncThunk(
  'promo/fetchPromoCriteriaDetail',
  async (criteriaId, { rejectWithValue }) => {
    try {
      const response = await promoService.getDetailValidPromoCriteria(criteriaId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const downloadPromoCriteriaList = createAsyncThunk(
  'promo/downloadPromoCriteriaList',
  async ({ params, advancedSearch }, { rejectWithValue }) => {
    try {
      const response = await promoService.downloadListValidPromoCriteria(params, advancedSearch);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Promo Condition Operations
export const fetchPromoConditionList = createAsyncThunk(
  'promo/fetchPromoConditionList',
  async ({ params, advancedSearch }, { rejectWithValue }) => {
    try {
      const response = await promoService.getListValidPromoConditionByPromoId(params, advancedSearch);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPromoConditionDetail = createAsyncThunk(
  'promo/fetchPromoConditionDetail',
  async (conditionId, { rejectWithValue }) => {
    try {
      const response = await promoService.getDetailValidPromoCondition(conditionId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const downloadPromoConditionList = createAsyncThunk(
  'promo/downloadPromoConditionList',
  async ({ params, advancedSearch }, { rejectWithValue }) => {
    try {
      const response = await promoService.downloadListValidPromoCondition(params, advancedSearch);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Advanced Search Helpers
export const fetchAdvancedSearchMetadata = createAsyncThunk(
  'promo/fetchAdvancedSearchMetadata',
  async (_, { rejectWithValue }) => {
    try {
      const [conditions, operators, promoColumns, criteriaColumns, conditionColumns] = await Promise.all([
        promoService.getAdvanceSearchCondition(),
        promoService.getAdvanceSearchOperator(),
        promoService.getAdvancePromoColumn(),
        promoService.getAdvancePromoCriteriaColumn(),
        promoService.getAdvancePromoConditionColumn(),
      ]);

      return {
        conditions,
        operators,
        promoColumns,
        criteriaColumns,
        conditionColumns,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const promoSlice = createSlice({
  name: 'promo',
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
        state.advancedSearch.criteriaColumns = action.payload.criteriaColumns || [];
        state.advancedSearch.conditionColumns = action.payload.conditionColumns || [];
      })
      .addCase(fetchAdvancedSearchMetadata.rejected, (state, action) => {
        state.advancedSearch.loading = false;
        state.advancedSearch.error = action.payload;
      });
  },
});

// Actions
export const {
  clearValidPromoDetail,
  clearPromoCriteriaDetail,
  clearPromoConditionDetail,
  resetPromoState,
} = promoSlice.actions;

// Selectors
export const selectValidPromoList = (state) => state.accountPromo.validPromoList;
export const selectValidPromoDetail = (state) => state.accountPromo.validPromoDetail;
export const selectPromoCriteriaList = (state) => state.accountPromo.promoCriteriaList;
export const selectPromoCriteriaDetail = (state) => state.accountPromo.promoCriteriaDetail;
export const selectPromoConditionList = (state) => state.accountPromo.promoConditionList;
export const selectPromoConditionDetail = (state) => state.accountPromo.promoConditionDetail;
export const selectAdvancedSearchMetadata = (state) => state.accountPromo.advancedSearch;

// Reducer
export default promoSlice.reducer;
