import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
  showModalError,
  setBodyError,
  showModalSuccess,
  validateError,
} from "../general_slice";

// Hard Code
// Warranty List
import hc_warranty_list from "./temp_hardcoded_json/warranty/get-list-warranty.json"
import hc_attachment_list from "./temp_hardcoded_json/warranty/get-list-attachment.json"
import hc_attachment_category_list from "./temp_hardcoded_json/warranty/get-list-attachment.json"

const initialState = {
  data: [],
  data_customer_info: [],
  data_warranty_info: [],
  data_refund_info: [],
  data_hold_info: [],
  data_release_info: [],
  data_attachment_info: [],
  dataListCategory: [],

  loading: false,
  isFailed: false,
  isSuccess: false,
  message: "",
};

export const getAllWarrantyListPaginate = createAsyncThunk(
  "GET_ALL_WARRANTY_LIST_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billing/list-billing-gas?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      // const response = await receiptCollectionHttpService.getPagination(url)
      await new Promise((resolve) => setTimeout(resolve, 500));;
      const response = hc_warranty_list;
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
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return error;
    }
  }
);

export const getAllCustomerInfoPaginate = createAsyncThunk(
  "GET_ALL_CUSTOMER_INFO_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billing/list-billing-gas?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      // const response = await receiptCollectionHttpService.getPagination(url);
      await new Promise((resolve) => setTimeout(resolve, 500));;
      const response = hc_warranty_list;
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
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return error;
    }
  }
);

export const getAllWarrantyInfoPaginate = createAsyncThunk(
  "GET_ALL_WARRANTY_INFO_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billing/list-billing-gas?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      // const response = await receiptCollectionHttpService.getPagination(url);
      await new Promise((resolve) => setTimeout(resolve, 500));;
      const response = hc_warranty_list;
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
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return error;
    }
  }
);

export const getAllRefundInfoPaginate = createAsyncThunk(
  "GET_ALL_REFUND_INFO_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billing/list-billing-gas?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      // const response = await receiptCollectionHttpService.getPagination(url);
      await new Promise((resolve) => setTimeout(resolve, 500));;
      const response = hc_warranty_list;
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
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return error;
    }
  }
);

export const getAllHoldInfoPaginate = createAsyncThunk(
  "GET_ALL_HOLD_INFO_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billing/list-billing-gas?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      // const response = await receiptCollectionHttpService.getPagination(url);
      await new Promise((resolve) => setTimeout(resolve, 500));;
      const response = hc_warranty_list;
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
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return error;
    }
  }
);

export const getAllReleaseInfoPaginate = createAsyncThunk(
  "GET_ALL_RELEASE_INFO_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billing/list-billing-gas?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      // const response = await receiptCollectionHttpService.getPagination(url);
      await new Promise((resolve) => setTimeout(resolve, 500));;
      const response = hc_warranty_list;
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
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return error;
    }
  }
);

export const getAllAttachmentInfoPaginate = createAsyncThunk(
  "GET_ALL_ATTACHMENT_INFO_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billing/list-billing-gas?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      // const response = await receiptCollectionHttpService.getPagination(url);
      await new Promise((resolve) => setTimeout(resolve, 500));;
      const response = hc_attachment_list;
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
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return error;
    }
  }
);

export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/attachment/list-category";
      const response = await receiptCollectionHttpService.getAll(url);
      const mapsCategory = response?.data?.data?.map((item) => ({
        Id: item?.glbTypeValId,
        text: item?.name,
      }));
      return mapsCategory;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const requestedRefund = createAsyncThunk(
  "REQUESTED_REFUND",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billing/create-request-approve";
      const response = await receiptCollectionHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been requested.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      await new Promise((resolve) => setTimeout(resolve, 500));;
      return response.data;
    } catch (response) {
      const message =
        response?.response?.data?.message ||
        response?.message ||
        response?.toString();
      if (Math.floor((response.response.data.code || 0) / 100) === 4) {
        if (response?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(response));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not requested. ${message}. Please try again.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(response);
      }
    }
  }
);

export const requestedHold = createAsyncThunk(
  "REQUESTED_HOLD",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billing/create-request-approve";
      const response = await receiptCollectionHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been requested.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      await new Promise((resolve) => setTimeout(resolve, 500));;
      return response.data;
    } catch (response) {
      const message =
        response?.response?.data?.message ||
        response?.message ||
        response?.toString();
      if (Math.floor((response.response.data.code || 0) / 100) === 4) {
        if (response?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(response));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not requested. ${message}. Please try again.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(response);
      }
    }
  }
);

export const downloadWarrantyList = createAsyncThunk(
  "DOWNLOAD_WARRANTY_LIST",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billing/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_WARRANTY_LIST",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const warrantySlice = createSlice({
  name: "warranty",
  initialState,
  extraReducers: {
    // Get All GET_ALL_WARRANTY_LIST_PAGINATE Pagination
    [getAllWarrantyListPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllWarrantyListPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getAllWarrantyListPaginate.rejected]: (state) => {
      state.loading = false;
    },

    // Get All GET_ALL_CUSTOMER_INFO_PAGINATE Pagination
    [getAllCustomerInfoPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllCustomerInfoPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_customer_info = action.payload;
    },
    [getAllCustomerInfoPaginate.rejected]: (state) => {
      state.loading = false;
    },

    // Get All GET_ALL_WARRANTY_INFO_PAGINATE Pagination
    [getAllWarrantyInfoPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllWarrantyInfoPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_warranty_info = action.payload;
    },
    [getAllWarrantyInfoPaginate.rejected]: (state) => {
      state.loading = false;
    },

    // Get All GET_ALL_REFUND_INFO_PAGINATE Pagination
    [getAllRefundInfoPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllRefundInfoPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_refund_info = action.payload;
    },
    [getAllRefundInfoPaginate.rejected]: (state) => {
      state.loading = false;
    },

    // Get All GET_ALL_HOLD_INFO_PAGINATE Pagination
    [getAllHoldInfoPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllHoldInfoPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_hold_info = action.payload;
    },
    [getAllHoldInfoPaginate.rejected]: (state) => {
      state.loading = false;
    },

    // Get All GET_ALL_RELEASE_INFO_PAGINATE Pagination
    [getAllReleaseInfoPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllReleaseInfoPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_release_info = action.payload;
    },
    [getAllReleaseInfoPaginate.rejected]: (state) => {
      state.loading = false;
    },

    // Get All GET_ALL_ATTACHMENT_INFO_PAGINATE Pagination
    [getAllAttachmentInfoPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllAttachmentInfoPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_attachment_info = action.payload;
    },
    [getAllAttachmentInfoPaginate.rejected]: (state) => {
      state.loading = false;
    },


    /** Get List Category */
    [getListCategory.pending]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingProduct = true;
    },
    [getListCategory.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingProduct = false;
    },
    [getListCategory.rejected]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingProduct = false;
    },

    // Download Warranty
    [downloadWarrantyList.pending]: (state) => {
      state.loading = true;
    },
    [downloadWarrantyList.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadWarrantyList.rejected]: (state) => {
      state.loading = false;
    },

    // Requested Refund
    [requestedRefund.pending]: (state) => {
      state.loading = true;
    },
    [requestedRefund.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [requestedRefund.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.result = action.payload;
    },

    // Requested Hold
    [requestedHold.pending]: (state) => {
      state.loading = true;
    },
    [requestedHold.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [requestedHold.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.result = action.payload;
    },
  },
});

const { reducer } = warrantySlice;
export default reducer;
