import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import { showModalError, showModalSuccess } from "../general_slice";

const initialState = {
  data_list: [],
  data_summary: null,
  create_result: null,
  loading: false,
  isFailed: false,
  isSuccess: false,
  message: "",
  data_billingPeriod: [],
};

export const getDeliveryList = createAsyncThunk(
  "DELIVERY/GET_LIST",
  async ({ page, pageSize, search, sort, isLoadMore }, thunkAPI) => {
    try {
      const searchParams = search ?? "";
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;

      const url = `/v1/dbs/api/rbi/delivery/list?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;

      const response = await ratingBillingHttpService.getPagination(url);
      return { ...response.data, isLoadMore };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDeliverySummary = createAsyncThunk(
  "DELIVERY/GET_SUMMARY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/delivery/summary`;
      const response = await ratingBillingHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const createDeliveryJob = createAsyncThunk(
  "DELIVERY/CREATE_JOB",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/delivery/create-job-delivery`;

      const response = await ratingBillingHttpService.createData(url, body);

      thunkAPI.dispatch(
        showModalSuccess({
          title: "Success",
          description: "Delivery job created successfully",
          return: false,
        })
      );

      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Failed to create delivery job";

      thunkAPI.dispatch(
        showModalError({
          title: "Failed",
          description: message,
        })
      );

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getBillingPeriod = createAsyncThunk(
  "DELIVERY/GET_BILLING_PERIOD",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/delivery/list-billPeriod`;
      const response = await ratingBillingHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const managementDeliveryInvoiceSlice = createSlice({
  name: "managementDeliveryInvoice",
  initialState,
  extraReducers: {
    /* ---------- GET LIST ---------- */
    [getDeliveryList.pending]: (state) => {
      state.loading = true;
    },
    [getDeliveryList.fulfilled]: (state, action) => {
      state.loading = false;
      const { isLoadMore, ...data } = action.payload;

      if (isLoadMore) {
        // Append new data to existing list
        state.data_list = {
          ...data,
          result: [...(state.data_list?.result || []), ...(data.result || [])],
        };
      } else {
        // Replace with new data
        state.data_list = data;
      }
    },
    [getDeliveryList.rejected]: (state) => {
      state.loading = false;
    },

    /* ---------- GET SUMMARY ---------- */
    [getDeliverySummary.pending]: (state) => {
      state.loading = true;
    },
    [getDeliverySummary.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_summary = action.payload;
    },
    [getDeliverySummary.rejected]: (state) => {
      state.loading = false;
    },

    /* ---------- CREATE DELIVERY JOB ---------- */
    [createDeliveryJob.pending]: (state) => {
      state.loading = true;
    },
    [createDeliveryJob.fulfilled]: (state, action) => {
      state.loading = false;
      state.create_result = action.payload;
    },
    [createDeliveryJob.rejected]: (state) => {
      state.loading = false;
    },

    /* ---------- GET BILLING PERIOD ---------- */
    [getBillingPeriod.pending]: (state) => {
      state.loading = true;
    },
    [getBillingPeriod.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_billingPeriod = action.payload;
    },
    [getBillingPeriod.rejected]: (state) => {
      state.loading = false;
    },
  },
});

const { reducer } = managementDeliveryInvoiceSlice;
export default reducer;
