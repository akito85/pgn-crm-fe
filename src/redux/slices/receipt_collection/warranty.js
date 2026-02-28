import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
  showModalError,
  setBodyError,
  showModalSuccess,
  validateError,
} from "../general_slice";


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
      const url = `/v1/dbs/api/payment-warranty/customer/get-list?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
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
  async ({ page, pageSize, search, sort, transTypeName }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortValue = sort === undefined || sort === "" ? "updatedDate~desc" : sort;
      const [orderBy, order] = sortValue.split("~");

      let url = `/v1/dbs/api/payment-warranty/get-list?page=${page}&size=${pageSize}&order=${order || 'desc'}&orderBy=${orderBy || 'updatedDate'}&searchs=${searchParams}`;

      if (transTypeName) {
        url += `&transTypeName=${transTypeName}`;
      }

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
      const url = `/v1/dbs/api/payment-warranty/approval-history-get/${id}`;
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

export const createPaymentWarranty = createAsyncThunk(
  "CREATE_PAYMENT_WARRANTY",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-warranty/create";
      const response = await receiptCollectionHttpService.createData(url, body);

      const successBody = {
        title: `Successful`,
        description: "Your request has been submitted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        error?.toString();

      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Submission failed. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const submitWarrantyRequest = createAsyncThunk(
  "SUBMIT_WARRANTY_REQUEST",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-warranty/request-submit";
      const response = await receiptCollectionHttpService.createData(url, body);

      const successBody = {
        title: `Successful`,
        description: "Your request has been submitted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        error?.toString();

      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Submission failed. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const submitApproval = createAsyncThunk(
  "SUBMIT_APPROVAL_WARRANTY",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-warranty/approval-submit";
      const response = await receiptCollectionHttpService.createData(url, body);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${body.action === "APPROVE" ? "approved" : "rejected"
          }.`,
        return: true,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        error?.toString();

      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${body.action === "APPROVE" ? "approved" : "rejected"
            }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response);
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
      const url = `/v1/dbs/api/payment-warranty/download?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
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
      const url = `/v1/dbs/api/payment-warranty/delete/${id}`;
      const response = await receiptCollectionHttpService.deleteData(url);

      const successBody = {
        title: `Successful`,
        description: "Your data has been deleted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not deleted. ${message}. Please try again.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response);
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

    /** Get Approval History */
    [getApprovalHistory.pending]: (state) => {
      state.loading = true;
      state.dataApprovalHistory = null;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataApprovalHistory = action.payload;
    },
    [getApprovalHistory.rejected]: (state) => {
      state.loading = false;
      state.dataApprovalHistory = null;
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

    // Create Payment Warranty
    [createPaymentWarranty.pending]: (state) => {
      state.loading = true;
    },
    [createPaymentWarranty.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [createPaymentWarranty.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.result = action.payload;
    },

    // Submit Warranty Request (Unified Hold, Release, Refund)
    [submitWarrantyRequest.pending]: (state) => {
      state.loading = true;
    },
    [submitWarrantyRequest.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [submitWarrantyRequest.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.result = action.payload;
    },

    // Submit Approval (Approve / Reject)
    [submitApproval.pending]: (state) => {
      state.loading = true;
    },
    [submitApproval.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [submitApproval.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.result = action.payload;
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

