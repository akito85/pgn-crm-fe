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
};

export const getAllInvoicePaginate = createAsyncThunk(
  "GET_ALL_INVOICE_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rbi/invoice?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
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
  }
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
  }
);
export const getBillingApproval = createAsyncThunk(
  "GET_BILLING_APPROVAL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/billing`;
      const response = await ratingBillingHttpService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
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
  }
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
  }
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
        "invoice_list"
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
        })
      );

      const errorBody = {
        title: "Failed",
        description: `Failed to download list. ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  extraReducers: {
    // Get All Billing Item Pagination
    [getAllInvoicePaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllInvoicePaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getAllInvoicePaginate.rejected]: (state) => {
      state.loading = false;
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
  },
});

const { reducer } = invoiceSlice;
export default reducer;
