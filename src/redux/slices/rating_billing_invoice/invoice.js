import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import { showModalError, validateError } from "../general_slice";
import { showModalSuccess } from "../general_slice";
import axios from "axios";

const BASE_URL = "https://d28a5698909b.ngrok-free.app/api/v1/invoices";

const initialState = {
  data: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
  message: "",
  data_detail: null,
  data_format: null,
  data_billing: null,
};

export const getAllInvoicePaginate = createAsyncThunk(
  "GET_ALL_INVOICE_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const sortParams =
        sort === undefined || sort === "" ? "createdDate,desc" : sort;
      const url = `${BASE_URL}?page=0&size=${pageSize}&sort=${sortParams}&search=${
        search || ""
      }`;
      const response = await axios.get(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      console.log("response", response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);
export const getDetailInvoice = createAsyncThunk(
  "GET_DETAIL_INVOICE",
  async (invoiceNumber, thunkAPI) => {
    try {
      const url = `${BASE_URL}/${invoiceNumber}`;
      const response = await axios.get(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = response?.data;
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
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
  "DOWNLOAD_INVOICE",
  async (invoiceNumber, thunkAPI) => {
    try {
      const url = `${BASE_URL}/download/${invoiceNumber}`;
      const response = await axios.get(url, { responseType: "blob" });
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error,
          action: "DOWNLOAD_INVOICE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);
const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  extraReducers: {
    // Get All Billing Item Pagination
    [getAllInvoicePaginate.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllInvoicePaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getAllInvoicePaginate.rejected]: (state, action) => {
      state.loading = false;
    },
    // get detail
    [getDetailInvoice.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailInvoice.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    [getDetailInvoice.rejected]: (state, action) => {
      state.loading = false;
    },
    // get format type
    [getFormatType.pending]: (state, action) => {
      state.loading = true;
    },
    [getFormatType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_format = action.payload;
    },
    [getFormatType.rejected]: (state, action) => {
      state.loading = false;
    },
    // get billing approval
    [getBillingApproval.pending]: (state, action) => {
      state.loading = true;
    },
    [getBillingApproval.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_billing = action.payload;
    },
    [getBillingApproval.rejected]: (state, action) => {
      state.loading = false;
    },
    // create generate
    [createGenerate.pending]: (state, action) => {
      state.loading = true;
    },
    [createGenerate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_billing = action.payload;
    },
    [createGenerate.rejected]: (state, action) => {
      state.loading = false;
    },

    // download list invoice
    [getDownloadList.pending]: (state, action) => {
      state.loading = true;
    },
    [getDownloadList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_billing = action.payload;
    },
    [getDownloadList.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

const { reducer } = invoiceSlice;
export default reducer;
