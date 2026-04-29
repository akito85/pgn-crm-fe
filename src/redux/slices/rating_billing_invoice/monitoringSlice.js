import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import {
  showModalError,
  setBodyError,
} from "../general_slice";

const initialState = {
  loading: false,
  error: null,
  periods: [],
  headerSummary: {
    currentPeriod: null,
    previousPeriod: null,
    currMaster: 0, prevMaster: 0, pctMaster: 0,
    currPraBilling: 0, prevPraBilling: 0, pctPraBilling: 0,
    currRating: 0, prevRating: 0, pctRating: 0,
    currBilling: 0, prevBilling: 0, pctBilling: 0,
    currApproved: 0, prevApproved: 0, pctApproved: 0,
  },
  loadingHeader: false,
  masterVsPraBilling: { content: [], totalElements: 0, totalPages: 0 },
  loadingTab1: false,
  praBillingVsRating: { content: [], totalElements: 0, totalPages: 0 },
  loadingTab2: false,
  ratingVsBilling: { content: [], totalElements: 0, totalPages: 0 },
  loadingTab3: false,
  billingVsInvoice: { content: [], totalElements: 0, totalPages: 0 },
  loadingTab4: false,
  billingVsApproval: { content: [], totalElements: 0, totalPages: 0 },
  loadingTab5: false,
  billingVsAdjustment: { content: [], totalElements: 0, totalPages: 0 },
  loadingTab7: false,
};

















export const getParameters = createAsyncThunk(
  "GET_MONITORING_PARAMETERS",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/monitoringcustomer/parameters`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.periods ?? [];
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getHeaderSummary = createAsyncThunk(
  "GET_MONITORING_HEADER_SUMMARY",
  async (period, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/monitoringcustomer/header-summary?period=${period}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getMasterVsPraBilling = createAsyncThunk(
  "GET_MASTER_VS_PRABILLING",
  async ({ period, page = 0, size = 10, search = "" }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/monitoringcustomer/master-vs-prabilling?period=${period}&page=${page}&size=${size}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getPraBillingVsRating = createAsyncThunk(
  "GET_PRABILLING_VS_RATING",
  async ({ period, page = 0, size = 10, search = "" }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/monitoringcustomer/prabilling-vs-rating?period=${period}&page=${page}&size=${size}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getRatingVsBilling = createAsyncThunk(
  "GET_RATING_VS_BILLING",
  async ({ period, page = 0, size = 10, search = "" }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/monitoringcustomer/rating-vs-billing?period=${period}&page=${page}&size=${size}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getBillingVsInvoice = createAsyncThunk(
  "GET_BILLING_VS_INVOICE",
  async ({ period, page = 0, size = 10, search = "" }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/monitoringcustomer/billing-vs-invoice?period=${period}&page=${page}&size=${size}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getBillingVsApproval = createAsyncThunk(
  "GET_BILLING_VS_APPROVAL",
  async ({ period, page = 0, size = 10, search = "" }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/monitoringcustomer/billing-vs-approval?period=${period}&page=${page}&size=${size}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getBillingVsAdjustment = createAsyncThunk(
  "GET_BILLING_VS_ADJUSTMENT",
  async ({ period, page = 0, size = 10, search = "" }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/monitoringcustomer/billing-vs-adjustment?period=${period}&page=${page}&size=${size}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

const monitoringSlice = createSlice({
  name: "monitoring",
  initialState,
  reducers: {},
  extraReducers: {
    // Get Parameters (period LOV)
    [getParameters.pending]: (state) => {
      state.loading = true;
    },
    [getParameters.fulfilled]: (state, action) => {
      state.loading = false;
      state.periods = action.payload;
    },
    [getParameters.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get Header Summary
    [getHeaderSummary.pending]: (state) => {
      state.loadingHeader = true;
    },
    [getHeaderSummary.fulfilled]: (state, action) => {
      state.loadingHeader = false;
      if (action.payload) {
        state.headerSummary = action.payload;
      }
    },
    [getHeaderSummary.rejected]: (state) => {
      state.loadingHeader = false;
    },

    // Get Master vs Pra-Billing
    [getMasterVsPraBilling.pending]: (state) => {
      state.loadingTab1 = true;
    },
    [getMasterVsPraBilling.fulfilled]: (state, action) => {
      state.loadingTab1 = false;
      if (action.payload) state.masterVsPraBilling = action.payload;
    },
    [getMasterVsPraBilling.rejected]: (state) => {
      state.loadingTab1 = false;
    },

    // Get Pra-Billing vs Rating
    [getPraBillingVsRating.pending]: (state) => {
      state.loadingTab2 = true;
    },
    [getPraBillingVsRating.fulfilled]: (state, action) => {
      state.loadingTab2 = false;
      if (action.payload) state.praBillingVsRating = action.payload;
    },
    [getPraBillingVsRating.rejected]: (state) => {
      state.loadingTab2 = false;
    },

    // Get Rating vs Billing
    [getRatingVsBilling.pending]: (state) => { state.loadingTab3 = true; },
    [getRatingVsBilling.fulfilled]: (state, action) => {
      state.loadingTab3 = false;
      if (action.payload) state.ratingVsBilling = action.payload;
    },
    [getRatingVsBilling.rejected]: (state) => { state.loadingTab3 = false; },

    // Get Billing vs Invoice
    [getBillingVsInvoice.pending]: (state) => { state.loadingTab4 = true; },
    [getBillingVsInvoice.fulfilled]: (state, action) => {
      state.loadingTab4 = false;
      if (action.payload) state.billingVsInvoice = action.payload;
    },
    [getBillingVsInvoice.rejected]: (state) => { state.loadingTab4 = false; },

    // Get Billing vs Approval
    [getBillingVsApproval.pending]: (state) => { state.loadingTab5 = true; },
    [getBillingVsApproval.fulfilled]: (state, action) => {
      state.loadingTab5 = false;
      if (action.payload) state.billingVsApproval = action.payload;
    },
    [getBillingVsApproval.rejected]: (state) => { state.loadingTab5 = false; },

    // Get Billing vs Adjustment
    [getBillingVsAdjustment.pending]: (state) => { state.loadingTab7 = true; },
    [getBillingVsAdjustment.fulfilled]: (state, action) => {
      state.loadingTab7 = false;
      if (action.payload) state.billingVsAdjustment = action.payload;
    },
    [getBillingVsAdjustment.rejected]: (state) => { state.loadingTab7 = false; },
  },
});

const { reducer } = monitoringSlice;
export default reducer;
