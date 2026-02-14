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
import hc_approval_history from "./temp_hardcoded_json/warranty/get-approval-history.json"

const initialState = {
  data: [],
  data_detail: {},
  data_customer_info: [],
  data_warranty_info: [],
  data_refund_info: [],
  data_hold_info: [],
  data_release_info: [],
  data_attachment_info: [],
  data_approval_info: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataListCategory: [],
  dataApprovalHistory: null,

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
      // Default sort
      const sortValue = sort === undefined || sort === "" ? "updatedDate~desc" : sort;
      const [orderBy, order] = sortValue.split("~");
      
      // Construct URL per user request: /v1/dbs/api/payment-warranty/get-list?page=...&size=...&order=...&orderBy=...
      // We append searchParams. If searchParams is "key~value", we might need to rely on 'searchs' param or parse it.
      // Based on user curl, standard params are supported. 
      // Using existing pattern searchs=${searchParams} might work if backend supports it, 
      // otherwise we might need to depend on the Filter component to pass "key=value".
      
      const url = `/v1/dbs/api/payment-warranty/get-list?page=${page}&size=${pageSize}&order=${order || 'desc'}&orderBy=${orderBy || 'updatedDate'}&searchs=${searchParams}`;
      
      const response = await receiptCollectionHttpService.getPagination(url);
      // await new Promise((resolve) => setTimeout(resolve, 500));;
      // const response = hc_warranty_list;
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

export const getDetailWarranty = createAsyncThunk(
  "GET_DETAIL_WARRANTY",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/detail-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
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
      const url = `/v1/dbs/api/receipt/customer/get-list?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      const sortValue = sort === undefined || sort === "" ? "updatedDate~desc" : sort;
      const [orderBy, order] = sortValue.split("~");
      
      const url = `/v1/dbs/api/payment-warranty/get-list?page=${page}&size=${pageSize}&order=${order || 'desc'}&orderBy=${orderBy || 'updatedDate'}&searchs=${searchParams}`;
      
      const response = await receiptCollectionHttpService.getPagination(url);
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

export const getAllApprovalList = createAsyncThunk(
  "GET_ALL_APPROVAL_LIST_WARRANTY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/apphier/get-list-approval-hierarchies`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getApprovalListPaginate = createAsyncThunk(
  "GET_APPROVAL_LIST_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billing/list-billing-gas?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      // const response = await receiptCollectionHttpService.getPagination(url);
      await new Promise((resolve) => setTimeout(resolve, 500));;
      // Using warranty list as placeholder for approval data structure if needed, or just empty
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

export const getListApprovalById = createAsyncThunk(
  "GET_LIST_APPROVAL_BY_ID_WARRANTY",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/apphier/get-approval-hierarchies/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_WARRANTY",
  async ({ id }, thunkAPI) => {
    try {
      // const url = `/v1/dbs/api/payment-warranty/approval-history-get/${id}`;
      // const response = await receiptCollectionHttpService.getDetail(url);
      await new Promise((resolve) => setTimeout(resolve, 500));;
      const response = hc_approval_history;
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
      return thunkAPI.rejectWithValue(error.response);
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
      // const url = "/v1/dbs/api/billing/create-request-approve";
      // const response = await receiptCollectionHttpService.createData(url, body);
      
      // Simulate Success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = { data: { id: "DUMMY_ID_REFUND_123" } }; 

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
      // const url = "/v1/dbs/api/billing/create-request-approve";
      // const response = await receiptCollectionHttpService.createData(url, body);

      // Simulate Success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = { data: { id: "DUMMY_ID_HOLD_123" } };
      
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

export const requestedRelease = createAsyncThunk(
  "REQUESTED_RELEASE",
  async ({ body }, thunkAPI) => {
    try {
      // const url = "/v1/dbs/api/billing/create-request-approve";
      // const response = await receiptCollectionHttpService.createData(url, body);

      // Simulate Success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = { data: { id: "DUMMY_ID_RELEASE_123" } };

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

export const deleteWarranty = createAsyncThunk(
  "DELETE_WARRANTY",
  async (id, thunkAPI) => {
    try {
      // const url = `/v1/dbs/api/billing/warranty/${id}`;
      // const response = await receiptCollectionHttpService.deleteData(url);

      // Simulate Success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = { data: { id: id } };

      const successBody = {
        title: `Successful`,
        description: "Your data has been deleted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      await new Promise((resolve) => setTimeout(resolve, 500));
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
            description: `Your data was not deleted. ${message}. Please try again.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(response);
      }
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

    // Get Detail GET_DETAIL_WARRANTY
    [getDetailWarranty.pending]: (state) => {
      state.loading = true;
    },
    [getDetailWarranty.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    [getDetailWarranty.rejected]: (state) => {
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

    // Requested Release
    [requestedRelease.pending]: (state) => {
      state.loading = true;
    },
    [requestedRelease.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [requestedRelease.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.result = action.payload;
    },
    // Get All GET_APPROVAL_LIST_PAGINATE Pagination
    [getApprovalListPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getApprovalListPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_approval_info = action.payload;
    },
    [getApprovalListPaginate.rejected]: (state) => {
      state.loading = false;
    },

    // Get All Approval List
    [getAllApprovalList.pending]: (state) => {
      state.loading = true;
    },
    [getAllApprovalList.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListAppHierId = action.payload;
    },
    [getAllApprovalList.rejected]: (state) => {
      state.loading = false;
    },

    // Get List Approval By Id
    [getListApprovalById.pending]: (state) => {
      state.loading = true;
    },
    [getListApprovalById.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListAppHierDetail = action.payload;
    },
    [getListApprovalById.rejected]: (state) => {
      state.loading = false;
    },

    // Get Approval History
    [getApprovalHistory.pending]: (state) => {
      state.loading = true;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataApprovalHistory = action.payload;
    },
    [getApprovalHistory.rejected]: (state) => {
      state.loading = false;
    },
  },
});

const { reducer } = warrantySlice;
export default reducer;
