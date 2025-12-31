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

const initialState = {
  data: [],
  data_detail: [],
  data_approval_history: [],
  data_billingItem: [],
  data_ratingResult: [],
  data_Payment: [],
  data_PrevPayment: [],
  data_approval: [],
  data_approval_list: [],
  data_list_billing_request_approval: [],
  data_list_billing_approval: [],
  data_list_billing_approved: [],
  data_prevBilling: [],
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
      // const response = await receiptCollectionHttpService.getPagination(url);
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

export const requestedRefund = createAsyncThunk(
  "REQUESTED_REFUND",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billing/create-request-approvex";
      const response = await receiptCollectionHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been requested.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
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







export const requestedBilling = createAsyncThunk(
  "REQUESTED_BILLING",
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

export const approvedBilling = createAsyncThunk(
  "APPROVED_BILLING",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billing/approval-billing";
      const response = await receiptCollectionHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
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
            description: `Your data was not ${action}. ${message}. Please try again.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(response);
      }
    }
  }
);

export const getAllBillingRequestPaginate = createAsyncThunk(
  "GET_ALL_BILLING_REQUEST_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billing/request-billing-list?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
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

export const getAllBillingApprovePaginate = createAsyncThunk(
  "GET_ALL_BILLING_APPROVE_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billing/approval-billing-list?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
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

export const getAllBillingItemPaginate = createAsyncThunk(
  "GET_ALL_BILLING_ITEM_PAGINATE",
  async ({ billingCodeId, pageBI, pageSizeBI, searchBI, sortBI }, thunkAPI) => {
    try {
      const searchParams = searchBI === undefined ? "" : searchBI;
      const sortParams =
        sortBI === undefined || sortBI === "" ? "lineNumber~asc" : sortBI;
      const url = `/v1/dbs/api/billing/billing-item/${billingCodeId}?page=${pageBI}&size=${pageSizeBI}&sort=${sortParams}&searchs=${searchParams}`;
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

export const getAllRatingResultPaginate = createAsyncThunk(
  "GET_ALL_RATING_RESULT_PAGINATE",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "id~desc" : sort;
      const url = `/v1/dbs/api/billing/rating-result/${id}?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
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

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing/approval-history/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
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

export const getPaymentBilling = createAsyncThunk(
  "GET_PAYMENT_BILLING",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing/payment/${id}`;
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

export const getPrevPaymentBilling = createAsyncThunk(
  "GET_PREV_PAYMENT_BILLING",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing/previous-payment/${id}`;
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

export const getPrevBilling = createAsyncThunk(
  "GET_PREV_BILLING",
  async ({ idBillingCode, idAccountNumber, idSaNumber }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing/previous-billing-information?billingCode=${idBillingCode}&accountNumber=${idAccountNumber}&saNumber=${idSaNumber}`;
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

export const getAllApprovalList = createAsyncThunk(
  "GET_ALL_APPROVAL_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing/approval-hierarchy-list`;
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

export const getListApprovalById = createAsyncThunk(
  "GET_LIST_APPROVAL_BY_ID",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing/approval-hierarchy-detail/${id}`;
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

const billingSlice = createSlice({
  name: "billing",
  initialState,
  extraReducers: {
    // Get All Billing Pagination
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

    // Get All Billing Pagination
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

    // Get All Billing Pagination
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

    // Get All Billing Pagination
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

    // Get All Billing Pagination
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












    // Requested Billing
    [requestedBilling.pending]: (state) => {
      state.loading = true;
    },
    [requestedBilling.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [requestedBilling.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.result = action.payload;
    },

    // Requested Billing
    [approvedBilling.pending]: (state) => {
      state.loading = true;
    },
    [approvedBilling.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approvedBilling.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.result = action.payload;
    },

    // Get All Billing Request Pagination
    [getAllBillingRequestPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllBillingRequestPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_list_billing_request_approval = action.payload;
    },
    [getAllBillingRequestPaginate.rejected]: (state) => {
      state.loading = false;
    },

    // Get All Billing Approve Pagination
    [getAllBillingApprovePaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllBillingApprovePaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_list_billing_approval = action.payload;
    },
    [getAllBillingApprovePaginate.rejected]: (state) => {
      state.loading = false;
    },

    // Get All Billing Item Pagination
    [getAllBillingItemPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllBillingItemPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_billingItem = action.payload;
    },
    [getAllBillingItemPaginate.rejected]: (state) => {
      state.loading = false;
    },

    // Get All Rating Result Pagination
    [getAllRatingResultPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllRatingResultPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_ratingResult = action.payload;
    },
    [getAllRatingResultPaginate.rejected]: (state) => {
      state.loading = false;
    },

    // Download Billing
    [downloadWarrantyList.pending]: (state) => {
      state.loading = true;
    },
    [downloadWarrantyList.fulfilled]: (state) => {
      state.loading = true;
    },
    [downloadWarrantyList.rejected]: (state) => {
      state.loading = false;
    },

    // Get Approval History
    [getApprovalHistory.pending]: (state, action) => {
      state.loading = true;
      state.data_approval_history = action.payload;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.data_approval_history = action.payload;
      state.loading = false;
    },
    [getApprovalHistory.rejected]: (state, action) => {
      state.data_approval_history = action.payload;
      state.loading = false;
    },

    // Get Detail Payment
    [getPaymentBilling.pending]: (state, action) => {
      state.loading = true;
      state.data_Payment = action.payload;
    },
    [getPaymentBilling.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_Payment = action.payload;
    },
    [getPaymentBilling.rejected]: (state, action) => {
      state.loading = false;
      state.data_Payment = action.payload;
    },

    // Get Detail Prev Payment
    [getPrevPaymentBilling.pending]: (state, action) => {
      state.loading = true;
      state.data_PrevPayment = action.payload;
    },
    [getPrevPaymentBilling.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_PrevPayment = action.payload;
    },
    [getPrevPaymentBilling.rejected]: (state, action) => {
      state.loading = false;
      state.data_PrevPayment = action.payload;
    },

    // Get Detail Prev Billing
    [getPrevBilling.pending]: (state, action) => {
      state.loading = true;
      state.data_prevBilling = action.payload;
    },
    [getPrevBilling.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_prevBilling = action.payload;
    },
    [getPrevBilling.rejected]: (state, action) => {
      state.loading = false;
      state.data_prevBilling = action.payload;
    },

    // Get Approve Hierarchy List
    [getAllApprovalList.pending]: (state, action) => {
      state.loading = true;
      state.data_approval = action.payload;
    },
    [getAllApprovalList.fulfilled]: (state, action) => {
      state.data_approval = action.payload;
      state.loading = false;
    },
    [getAllApprovalList.rejected]: (state, action) => {
      state.data_approval = action.payload;
      state.loading = false;
    },

    // Get List Approval By Id
    [getListApprovalById.pending]: (state, action) => {
      state.loading = true;
      state.data_approval_list = action.payload;
    },
    [getListApprovalById.fulfilled]: (state, action) => {
      state.data_approval_list = action.payload;
      state.loading = false;
    },
    [getListApprovalById.rejected]: (state, action) => {
      state.data_approval_list = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = billingSlice;
export default reducer;
