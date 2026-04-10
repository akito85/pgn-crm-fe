import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";

const initialState = {
  data: [],
  loading: false,
  loading_detail: false,
  data_detail: null,
  logs: [],
  logs_page: null,
  loading_logs: false,
};

export const getAllProformaInvoicePaginate = createAsyncThunk(
  "GET_ALL_PROFORMA_INVOICE_PAGINATE",
  async ({ page, pageSize, search, sort, isLoadMore = false }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rbi/proforma-invoice?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);

      return {
        ...response.data,
        isLoadMore,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getDetailProformaInvoice = createAsyncThunk(
  "GET_DETAIL_PROFORMA_INVOICE",
  async (invoiceNumber, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/proforma-invoice/${invoiceNumber}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getLogProformaInvoicePaginate = createAsyncThunk(
  "GET_LOG_PROFORMA_INVOICE_PAGINATE",
  async ({ invoiceNumber, page, pageSize, isLoadMore = false }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/proforma-invoice/${invoiceNumber}/logs?page=${page}&size=${pageSize}&sort=id~desc`;
      const response = await ratingBillingHttpService.getDetail(url);
      return {
        ...(response?.data || {}),
        isLoadMore,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

const proformaInvoiceSlice = createSlice({
  name: "proformaInvoice",
  initialState,
  extraReducers: {
    [getAllProformaInvoicePaginate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getAllProformaInvoicePaginate.fulfilled]: (state, action) => {
      state.loading = false;
      const isLoadMore = action.payload.isLoadMore;
      const newResult = action.payload?.result || [];

      if (isLoadMore) {
        state.data = {
          ...action.payload,
          result: [...(state.data?.result || []), ...newResult],
        };
      } else {
        state.data = action.payload;
      }
    },
    [getAllProformaInvoicePaginate.rejected]: (state, action) => {
      state.loading = false;
      if (!action.meta.arg?.isLoadMore) {
        state.data = [];
      }
    },

    [getDetailProformaInvoice.pending]: (state) => {
      state.loading_detail = true;
    },
    [getDetailProformaInvoice.fulfilled]: (state, action) => {
      state.loading_detail = false;
      state.data_detail = action.payload?.data || null;
    },
    [getDetailProformaInvoice.rejected]: (state) => {
      state.loading_detail = false;
      state.data_detail = null;
    },

    [getLogProformaInvoicePaginate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_logs = true;
      }
    },
    [getLogProformaInvoicePaginate.fulfilled]: (state, action) => {
      state.loading_logs = false;
      const isLoadMore = action.payload?.isLoadMore;
      const newResult = action.payload?.result || [];
      state.logs_page = action.payload?.page || null;

      if (isLoadMore) {
        state.logs = [...(state.logs || []), ...newResult];
      } else {
        state.logs = newResult;
      }
    },
    [getLogProformaInvoicePaginate.rejected]: (state) => {
      state.loading_logs = false;
      state.logs = [];
      state.logs_page = null;
    },
  },
});

const { reducer } = proformaInvoiceSlice;
export default reducer;
