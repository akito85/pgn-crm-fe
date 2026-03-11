import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import { showModalError, validateError } from "../general_slice";
import { showModalSuccess } from "../general_slice";
import axios from "axios";

const initialState = {
  data: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
  message: "",
  data_detail: null,
  data_format: null,
  data_billing: [],
  data_invoice_templates: [],
  data_cost_center_invoice: [],
  data_account_segment_invoice: [],
  data_meter_reading_code_invoice: [],
  data_account_group_type_invoice: [],
};

export const getAllInvoicePaginate = createAsyncThunk(
  "GET_ALL_INVOICE_PAGINATE",
  async ({ page, pageSize, search, sort, isLoadMore = false }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rbi/invoice?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);

      // Return data dengan flag isLoadMore
      return {
        ...response.data,
        isLoadMore, // Pass the flag to reducer
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const getDetailInvoice = createAsyncThunk(
  "GET_DETAIL_INVOICE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response;
      // return Array.isArray(response) ? response : [response];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const getFormatType = createAsyncThunk(
  "GET_FORMAT_TYPE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/format-type`;
      const response = await ratingBillingHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const getInvoiceTemplates = createAsyncThunk(
  "GET_INVOICE_TEMPLATES",
  async (search = "", thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/invoice-template?search=${encodeURIComponent(search)}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const getCostCenterInvoice = createAsyncThunk(
  "GET_COST_CENTER_INVOICE",
  async (_, thunkAPI) => {
    try {
      const response = await ratingBillingHttpService.getAll(
        `/v1/dbs/api/rbi/invoice/costcenter`,
      );
      return Array.isArray(response)
        ? response
        : (response?.data ?? response?.result ?? []);
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const getAccountSegmentInvoice = createAsyncThunk(
  "GET_ACCOUNT_SEGMENT_INVOICE",
  async (_, thunkAPI) => {
    try {
      const response = await ratingBillingHttpService.getAll(
        `/v1/dbs/api/rbi/invoice/accountsegment`,
      );
      return Array.isArray(response)
        ? response
        : (response?.data ?? response?.result ?? []);
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const getMeterReadingCodeInvoice = createAsyncThunk(
  "GET_METER_READING_CODE_INVOICE",
  async (ccids = [], thunkAPI) => {
    try {
      const response = await ratingBillingHttpService.createData(
        `/v1/dbs/api/rbi/invoice/meterreadingcode`,
        ccids,
      );
      return Array.isArray(response)
        ? response
        : (response?.data ?? response?.result ?? []);
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const getAccountGroupTypeInvoice = createAsyncThunk(
  "GET_ACCOUNT_GROUP_TYPE_INVOICE",
  async (segmentIds = [], thunkAPI) => {
    try {
      const params = segmentIds
        .map((id) => `idSegment=${encodeURIComponent(id)}`)
        .join("&");
      const url = `/v1/dbs/api/rbi/invoice/account-group-type${params ? `?${params}` : ""}`;
      const response = await ratingBillingHttpService.getAll(url);
      return Array.isArray(response)
        ? response
        : (response?.data ?? response?.result ?? []);
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const getBillingApproval = createAsyncThunk(
  "GET_BILLING_APPROVAL",
  async (params, thunkAPI) => {
    try {
      const qs =
        params && Object.keys(params).some((k) => params[k] !== undefined)
          ? "?" + new URLSearchParams(params).toString()
          : "";
      const url = `/v1/dbs/api/rbi/invoice/billing${qs}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const createRegenerate = createAsyncThunk(
  "CREATE_REGENRATE",
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/${id}/regenerate`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Your data has been created",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        description: `Your data was not create. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const createGenerate = createAsyncThunk(
  "CREATE_GENERATE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/generate`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Your data has been created",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        description: `Your data was not create. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getDownloadList = createAsyncThunk(
  "DOWNLOAD_INVOICE_LIST",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rbi/invoice/download-filter?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;

      const response = await ratingBillingHttpService.downloadXlsx(
        url,
        "invoice_list",
      );

      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();

      thunkAPI.dispatch(
        validateError({
          error: error?.response,
          action: "DOWNLOAD_INVOICE_LIST",
          back: false,
        }),
      );

      const errorBody = {
        title: "Failed",
        description: `Failed to download list. ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  extraReducers: {
    // Get All Billing Item Pagination
    [getAllInvoicePaginate.pending]: (state, action) => {
      // Hanya show loading saat initial fetch
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getAllInvoicePaginate.fulfilled]: (state, action) => {
      state.loading = false;
      const isLoadMore = action.payload.isLoadMore;
      const newResult = action.payload?.result || [];

      if (isLoadMore) {
        // Append new data
        state.data = {
          ...action.payload,
          result: [...(state.data?.result || []), ...newResult],
        };
      } else {
        // Replace with new data
        state.data = action.payload;
      }
    },
    [getAllInvoicePaginate.rejected]: (state, action) => {
      state.loading = false;
      // Jangan clear data saat load more gagal
      if (!action.meta.arg?.isLoadMore) {
        state.data = [];
      }
    },
    // get detail
    [getDetailInvoice.pending]: (state) => {
      state.loading = true;
    },
    [getDetailInvoice.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    [getDetailInvoice.rejected]: (state) => {
      state.loading = false;
    },
    // get format type
    [getFormatType.pending]: (state) => {
      state.loading = true;
    },
    [getFormatType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_format = action.payload;
    },
    [getFormatType.rejected]: (state) => {
      state.loading = false;
    },
    // get billing approval
    [getBillingApproval.pending]: (state) => {
      state.loading = true;
    },
    [getBillingApproval.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_billing = action.payload.data;
    },
    [getBillingApproval.rejected]: (state) => {
      state.loading = false;
    },
    // create generate
    [createGenerate.pending]: (state) => {
      state.loading = true;
    },
    [createGenerate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_billing = action.payload;
    },
    [createGenerate.rejected]: (state) => {
      state.loading = false;
    },

    // download list invoice
    [getDownloadList.pending]: (state) => {
      state.loading = true;
    },
    [getDownloadList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_billing = action.payload;
    },
    [getDownloadList.rejected]: (state) => {
      state.loading = false;
    },
    // get invoice templates
    [getInvoiceTemplates.fulfilled]: (state, action) => {
      state.data_invoice_templates = action.payload;
    },
    [getInvoiceTemplates.rejected]: (state) => {
      state.data_invoice_templates = [];
    },
    // get cost center invoice
    [getCostCenterInvoice.fulfilled]: (state, action) => {
      state.data_cost_center_invoice = action.payload;
    },
    [getCostCenterInvoice.rejected]: (state) => {
      state.data_cost_center_invoice = [];
    },
    // get account segment invoice
    [getAccountSegmentInvoice.fulfilled]: (state, action) => {
      state.data_account_segment_invoice = action.payload;
    },
    [getAccountSegmentInvoice.rejected]: (state) => {
      state.data_account_segment_invoice = [];
    },
    // get meter reading code invoice
    [getMeterReadingCodeInvoice.fulfilled]: (state, action) => {
      state.data_meter_reading_code_invoice = action.payload;
    },
    [getMeterReadingCodeInvoice.rejected]: (state) => {
      state.data_meter_reading_code_invoice = [];
    },
    // get account group type invoice
    [getAccountGroupTypeInvoice.fulfilled]: (state, action) => {
      state.data_account_group_type_invoice = action.payload;
    },
    [getAccountGroupTypeInvoice.rejected]: (state) => {
      state.data_account_group_type_invoice = [];
    },
  },
});

const { reducer } = invoiceSlice;
export default reducer;
