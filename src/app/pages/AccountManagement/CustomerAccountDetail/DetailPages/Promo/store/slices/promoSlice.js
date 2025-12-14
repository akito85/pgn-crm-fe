/**
 * Promo Slice
 * Redux slice for promo state management
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { promoService } from '../../services/promoService';

// Initial state
const initialState = {
  promoList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  },
  promoDetail: {
    data: null,
    loading: false,
    error: null,
  },
  promoHistory: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  },
  filters: {
    searchText: '',
    status: null,
    dateRange: null,
  },
};

// Async thunks
export const fetchPromoList = createAsyncThunk(
  'promo/fetchPromoList',
  async (params, { rejectWithValue }) => {
    try {
      const response = await promoService.getPromoList(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPromoDetail = createAsyncThunk(
  'promo/fetchPromoDetail',
  async (promoId, { rejectWithValue }) => {
    try {
      const response = await promoService.getPromoDetail(promoId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPromoHistory = createAsyncThunk(
  'promo/fetchPromoHistory',
  async (params, { rejectWithValue }) => {
    try {
      const response = await promoService.getPromoHistory(params);
      return response;
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
    setPromoFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearPromoFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearPromoDetail: (state) => {
      state.promoDetail = initialState.promoDetail;
    },
    resetPromoState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch promo list
    builder
      .addCase(fetchPromoList.pending, (state) => {
        state.promoList.loading = true;
        state.promoList.error = null;
      })
      .addCase(fetchPromoList.fulfilled, (state, action) => {
        state.promoList.loading = false;
        state.promoList.data = action.payload.data || [];
        state.promoList.pagination = {
          current: action.payload.currentPage || 1,
          pageSize: action.payload.pageSize || 10,
          total: action.payload.total || 0,
        };
      })
      .addCase(fetchPromoList.rejected, (state, action) => {
        state.promoList.loading = false;
        state.promoList.error = action.payload;
      });

    // Fetch promo detail
    builder
      .addCase(fetchPromoDetail.pending, (state) => {
        state.promoDetail.loading = true;
        state.promoDetail.error = null;
      })
      .addCase(fetchPromoDetail.fulfilled, (state, action) => {
        state.promoDetail.loading = false;
        state.promoDetail.data = action.payload;
      })
      .addCase(fetchPromoDetail.rejected, (state, action) => {
        state.promoDetail.loading = false;
        state.promoDetail.error = action.payload;
      });

    // Fetch promo history
    builder
      .addCase(fetchPromoHistory.pending, (state) => {
        state.promoHistory.loading = true;
        state.promoHistory.error = null;
      })
      .addCase(fetchPromoHistory.fulfilled, (state, action) => {
        state.promoHistory.loading = false;
        state.promoHistory.data = action.payload.data || [];
        state.promoHistory.pagination = {
          current: action.payload.currentPage || 1,
          pageSize: action.payload.pageSize || 10,
          total: action.payload.total || 0,
        };
      })
      .addCase(fetchPromoHistory.rejected, (state, action) => {
        state.promoHistory.loading = false;
        state.promoHistory.error = action.payload;
      });
  },
});

// Actions
export const {
  setPromoFilters,
  clearPromoFilters,
  clearPromoDetail,
  resetPromoState,
} = promoSlice.actions;

// Selectors
export const selectPromoList = (state) => state.promo.promoList;
export const selectPromoDetail = (state) => state.promo.promoDetail;
export const selectPromoHistory = (state) => state.promo.promoHistory;
export const selectPromoFilters = (state) => state.promo.filters;

// Reducer
export default promoSlice.reducer;
