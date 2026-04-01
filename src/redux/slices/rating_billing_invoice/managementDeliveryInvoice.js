import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import { showModalError, showModalSuccess } from "../general_slice";

const initialState = {
  data_list: [],
  data_summary: null,
  data_detail: null,
  data_logs: [],
  create_result: null,
  loading: false,
  loading_detail: false,
  loading_logs: false,
  loading_resend: false,
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
  },
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
  },
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
        }),
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
        }),
      );

      return thunkAPI.rejectWithValue(error?.response);
    }
  },
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
  },
);
export const getDeliveryDetail = createAsyncThunk(
  "DELIVERY/GET_DETAIL",
  async (invoiceNumber, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/delivery/invoice/${invoiceNumber}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getDeliveryLogs = createAsyncThunk(
  "DELIVERY/GET_LOGS",
  async (deliveryId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/delivery/logs/${deliveryId}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const resendDelivery = createAsyncThunk(
  "DELIVERY/RESEND",
  async (deliveryId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/delivery/resend/${deliveryId}`;
      const response = await ratingBillingHttpService.createData(url, {});

      thunkAPI.dispatch(
        showModalSuccess({
          title: "Success",
          description: "Invoice berhasil dikirim ulang",
          return: false,
        }),
      );

      return response?.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Gagal mengirim ulang invoice";

      thunkAPI.dispatch(
        showModalError({
          title: "Failed",
          description: message,
        }),
      );

      return thunkAPI.rejectWithValue(error?.response);
    }
  },
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

    /* ---------- GET DETAIL ---------- */
    [getDeliveryDetail.pending]: (state) => {
      state.loading_detail = true;
      state.data_detail = null;
    },
    [getDeliveryDetail.fulfilled]: (state, action) => {
      state.loading_detail = false;
      state.data_detail = action.payload;
    },
    [getDeliveryDetail.rejected]: (state) => {
      state.loading_detail = false;
    },

    /* ---------- GET LOGS ---------- */
    [getDeliveryLogs.pending]: (state) => {
      state.loading_logs = true;
      state.data_logs = [];
    },
    [getDeliveryLogs.fulfilled]: (state, action) => {
      state.loading_logs = false;
      state.data_logs = action.payload?.result ?? [];
    },
    [getDeliveryLogs.rejected]: (state) => {
      state.loading_logs = false;
    },

    /* ---------- RESEND ---------- */
    [resendDelivery.pending]: (state) => {
      state.loading_resend = true;
    },
    [resendDelivery.fulfilled]: (state) => {
      state.loading_resend = false;
    },
    [resendDelivery.rejected]: (state) => {
      state.loading_resend = false;
    },
  },
});

const { reducer } = managementDeliveryInvoiceSlice;
export default reducer;
