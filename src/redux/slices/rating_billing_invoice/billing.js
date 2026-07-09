import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import {
  showModalError,
  setBodyError,
  showModalSuccess,
  validateError,
} from "../general_slice";

const initialState = {
  data: [],
  data_detail: [],
  data_approval_history: [],
  data_billingItem: [],
  data_ratingResult: [],
  data_adjustment: [],
  data_Payment: [],
  data_PrevPayment: [],
  data_approval: [],
  data_approval_list: [],
  data_list_billing_request_approval: [],
  data_list_billing_approval: [],
  data_list_billing_approved: [],
  data_prevBilling: [],
  data_cancel_billing: [],
  dataListCategory: [],
  list_billing_period: [],
  loadingList: false,
  loadingPeriod: false,
  loadingRequest: false,
  loadingApproval: false,
  loadingDetail: false,
  loadingHistory: false,
  loadingDownload: false,
  loadingCancel: false,
  isFailed: false,
  isSuccess: false,
  message: "",
  // TAMBAHAN: untuk fix race condition
  currentRequestId: null,
  // TAMBAHAN: simpan filters seperti pattern Prabilling
  filters: {
    search: {},
    sort: "",
    page: 1,
  },
};

export const requestedBilling = createAsyncThunk(
  "REQUESTED_BILLING",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billing/create-request-approve";
      const response = await ratingBillingHttpService.createData(url, body);
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
  },
);

export const approvedBilling = createAsyncThunk(
  "APPROVED_BILLING",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billing/approval-billing";
      const response = await ratingBillingHttpService.createData(url, body);
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
  },
);

export const cancelApprovalBilling = createAsyncThunk(
  "CANCEL_APPROVAL_BILLING",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billing/cancel-approval";
      const response = await ratingBillingHttpService.createData(url, body);
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
  },
);

export const getAllBillingPaginate = createAsyncThunk(
  "GET_ALL_BILLING_PAGINATE",
  async ({ page, pageSize, search, sort, billPeriod, isLoadMore = false }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billing/list-billing-gas?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}${billPeriod ? `&billPeriod=${encodeURIComponent(billPeriod)}` : ""}`;
      const response = await ratingBillingHttpService.getPagination(url);
      const responseData = response.data?.data ?? response.data;

      return {
        ...responseData,
        isLoadMore,
      };
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
  },
);

export const getAllBillingRequestPaginate = createAsyncThunk(
  "GET_ALL_BILLING_REQUEST_PAGINATE",
  async ({ page, pageSize, search, sort, isLoadMore = false } = {}, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billing/request-billing-list?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      const responseData = response.data?.data ?? response.data;
      return { ...responseData, isLoadMore };
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
  },
);

export const getAllBillingApprovePaginate = createAsyncThunk(
  "GET_ALL_BILLING_APPROVE_PAGINATE",
  async ({ page, pageSize, search, sort, isLoadMore = false } = {}, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billing/approval-billing-list?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      const responseData = response.data?.data ?? response.data;
      return {
        ...responseData,
        isLoadMore,
      };
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
  },
);

export const getAllBillingCancelTaskPaginate = createAsyncThunk(
  "GET_ALL_BILLING_CANCEL_TASK_PAGINATE",
  async ({ page, pageSize, search, sort, isLoadMore = false } = {}, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billing//cancel-tasks?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      const responseData = response.data?.data ?? response.data;
      return {
        ...responseData,
        isLoadMore,
      };
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
  },
);

export const getAllBillingItemPaginate = createAsyncThunk(
  "GET_ALL_BILLING_ITEM_PAGINATE",
  async ({ billHeaderId, pageBI, pageSizeBI, searchBI, sortBI, isLoadMore = false }, thunkAPI) => {
    try {
      const searchParams = searchBI === undefined ? "" : searchBI;
      const sortParams =
        sortBI === undefined || sortBI === "" ? "lineNumber~asc" : sortBI;
      const url = `/v1/dbs/api/billing/billing-item/${billHeaderId}?page=${pageBI}&size=${pageSizeBI}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      const responseData = response.data?.data ?? response.data;
      return { ...responseData, isLoadMore };
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
  },
);

export const getAllRatingResultPaginate = createAsyncThunk(
  "GET_ALL_RATING_RESULT_PAGINATE",
  async ({ id, page, pageSize, search, sort, isLoadMore = false }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "id~desc" : sort;
      const url = `/v1/dbs/api/billing/rating-result/${id}?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      const responseData = response.data?.data ?? response.data;
      return { ...responseData, isLoadMore };
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
  },
);

export const getAllAdjustmentPaginate = createAsyncThunk(
  "GET_ALL_ADJUSTMENT_PAGINATE",
  async ({ id, page, pageSize, search, sort, isLoadMore = false }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "lineNumber~asc" : sort;
      const url = `/v1/dbs/api/billing/adjustment-item/${id}?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      const responseData = response.data?.data ?? response.data;
      return { ...responseData, isLoadMore };
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
  },
);

export const downloadBillingList = createAsyncThunk(
  "DOWNLOAD_BILLING_LIST",
  async ({ page, pageSize, search, sort, billPeriod }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billing/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}${billPeriod ? `&billPeriod=${encodeURIComponent(billPeriod)}` : ""}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_BILLING_LIST",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing/approval-history/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      const responseData = response.data?.data ?? response.data;
      return Array.isArray(responseData) ? null : responseData;
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
  },
);

export const getPaymentBilling = createAsyncThunk(
  "GET_PAYMENT_BILLING",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing/payment/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      const responseData = response.data?.data ?? response.data;
      return responseData;
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
  },
);

export const getPrevPaymentBilling = createAsyncThunk(
  "GET_PREV_PAYMENT_BILLING",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing/previous-payment/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      const responseData = response.data?.data ?? response.data;
      return responseData;
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
  },
);

export const getPrevBilling = createAsyncThunk(
  "GET_PREV_BILLING",
  async ({ idBillingCode, idAccountNumber, idSaNumber }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing/previous-billing-information?billingCode=${idBillingCode}&accountNumber=${idAccountNumber}&saNumber=${idSaNumber}`;
      const response = await ratingBillingHttpService.getDetail(url);
      const responseData = response.data?.data ?? response.data;
      return responseData;
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
  },
);

export const getAllApprovalList = createAsyncThunk(
  "GET_ALL_APPROVAL_LIST",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing/approval-hierarchy-list`;
      const response = await ratingBillingHttpService.getAll(url);
      const responseData = response.data?.data ?? response.data;
      return responseData;
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
  },
);

export const getListApprovalById = createAsyncThunk(
  "GET_LIST_APPROVAL_BY_ID",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing/approval-hierarchy-detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      const responseData = response.data?.data ?? response.data;
      return responseData;
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
  },
);

export const cancelBilling = createAsyncThunk(
  "CANCEL_BILLING",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billing/cancel-request";
      // Payload structure:
      // - billHeaderId: number
      // - cancelDate: string (yyyy-MM-dd)
      // - reasonCode: string
      // - accountingDate: string (yyyy-MM-dd)
      // - remark: string
      // - apphierId: number
      const response = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your billing has been cancelled.",
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
            description: `Your billing was not cancelled. ${message}. Please try again.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(response);
      }
    }
  },
);

export const getAttachmentCategoryBilling = createAsyncThunk(
  "GET_ATTACHMENT_CATEGORY_BILLING",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-attachment-category`;
      const response = await ratingBillingHttpService.getAll(url);
      return (response.data || []).map((item) => ({
        Id: item.id,
        text: item.text,
      }));
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
      return [];
    }
  },
);

export const getListBillingPeriodForBilling = createAsyncThunk(
  "GET_LIST_BILLING_PERIOD_FOR_BILLING",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingperiod/open-lov`;
      const response = await ratingBillingHttpService.getAll(url);

      const rawData =
        response?.body?.data?.data ||
        response?.data?.data ||
        response?.data ||
        [];

      const transformedData = Array.isArray(rawData)
        ? rawData.map((item) => ({
            id: item.id,
            name: item.name,
            code: item.code,
            ...item,
          }))
        : [];

      return transformedData;
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    // TAMBAHAN: set filters seperti pattern Prabilling
    setBillingFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // TAMBAHAN: reset data billing (untuk dipakai saat ganti tab)
    resetBillingData: (state) => {
      state.data = [];
      state.currentRequestId = null;
    },
    // TAMBAHAN: reset data billing request approval (untuk modal request)
    resetBillingRequestData: (state) => {
      state.data_list_billing_request_approval = [];
    },
    // TAMBAHAN: reset data cancel billing (untuk modal cancel)
    resetCancelBillingData: (state) => {
      state.data_cancel_billing = [];
    },
  },
  extraReducers: {
    // Requested Billing
    [requestedBilling.pending]: (state) => {
      state.loadingRequest = true;
    },
    [requestedBilling.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loadingRequest = false;
    },
    [requestedBilling.rejected]: (state, action) => {
      state.loadingRequest = false;
      state.isFailed = true;
      state.result = action.payload;
    },

    // Approved Billing
    [approvedBilling.pending]: (state) => {
      state.loadingApproval = true;
    },
    [approvedBilling.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loadingApproval = false;
    },
    [approvedBilling.rejected]: (state, action) => {
      state.loadingApproval = false;
      state.isFailed = true;
      state.result = action.payload;
    },

    // Cancel Approval Billing
    [cancelApprovalBilling.pending]: (state) => {
      state.loadingApproval = true;
    },
    [cancelApprovalBilling.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loadingApproval = false;
    },
    [cancelApprovalBilling.rejected]: (state, action) => {
      state.loadingApproval = false;
      state.isFailed = true;
      state.result = action.payload;
    },

    // Get All Billing Pagination
    [getAllBillingPaginate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loadingList = true;
        // TAMBAHAN: simpan requestId terbaru untuk deteksi stale response
        state.currentRequestId = action.meta.requestId;
      }
    },
    [getAllBillingPaginate.fulfilled]: (state, action) => {
      const isLoadMore = action.payload?.isLoadMore;

      // TAMBAHAN: ignore response lama (stale) jika bukan load more
      // Ini fix utama untuk race condition saat search berubah cepat
      if (
        !isLoadMore &&
        action.meta.requestId !== state.currentRequestId
      ) {
        return;
      }

      state.loadingList = false;
      const newResult = action.payload?.result || [];

      if (isLoadMore) {
        // Gunakan billCode sebagai unique identifier
        const existingIds = new Set(
          (state.data?.result || []).map((item) => item.billCode),
        );
        const uniqueNewData = newResult.filter(
          (item) => !existingIds.has(item.billCode),
        );
        state.data = {
          ...action.payload,
          result: [...(state.data?.result || []), ...uniqueNewData],
        };
      } else {
        state.data = action.payload;
      }
    },
    [getAllBillingPaginate.rejected]: (state, action) => {
      state.loadingList = false;
      if (!action.meta.arg?.isLoadMore) {
        state.data = [];
      }
    },

    // Get All Billing Request Pagination
    [getAllBillingRequestPaginate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loadingRequest = true;
      }
    },
    [getAllBillingRequestPaginate.fulfilled]: (state, action) => {
      state.loadingRequest = false;
      const isLoadMore = action.payload?.isLoadMore;
      const newResult = action.payload?.result || [];

      if (isLoadMore) {
        const existing = state.data_list_billing_request_approval?.result || [];
        const existingIds = new Set(existing.map((item) => item.billCode));
        const uniqueNewData = newResult.filter(
          (item) => !existingIds.has(item.billCode),
        );
        state.data_list_billing_request_approval = {
          ...action.payload,
          result: [...existing, ...uniqueNewData],
        };
      } else {
        state.data_list_billing_request_approval = action.payload;
      }
    },
    [getAllBillingRequestPaginate.rejected]: (state, action) => {
      state.loadingRequest = false;
      if (!action.meta.arg?.isLoadMore) {
        state.data_list_billing_request_approval = [];
      }
    },

    // Get All Billing Approve Pagination
    [getAllBillingApprovePaginate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loadingApproval = true;
      }
    },
    [getAllBillingApprovePaginate.fulfilled]: (state, action) => {
      state.loadingApproval = false;
      const newData = action.payload?.result || [];
      const isLoadMore = action.payload?.isLoadMore;

      if (isLoadMore) {
        state.data_list_billing_approval = {
          result: [
            ...(state.data_list_billing_approval?.result || []),
            ...newData,
          ],
          page: {
            totalElements: action.payload.page?.totalElements || 0,
            totalPages: action.payload.page?.totalPages || 0,
            number: action.payload.page?.number || 0,
            size: action.payload.page?.size || 10,
          },
        };
      } else {
        state.data_list_billing_approval = {
          result: newData,
          page: {
            totalElements: action.payload?.page?.totalElements || 0,
            totalPages: action.payload?.page?.totalPages || 0,
            number: action.payload?.page?.number || 0,
            size: action.payload?.page?.size || 10,
          },
        };
      }
    },
    [getAllBillingApprovePaginate.rejected]: (state, action) => {
      state.loadingApproval = false;
      if (!action.meta.arg?.isLoadMore) {
        state.data_list_billing_approval = {
          result: [],
          page: {
            totalElements: 0,
            totalPages: 0,
            number: 0,
            size: 10,
          },
        };
      }
    },

    // Get All Billing Cancel Task Pagination
    [getAllBillingCancelTaskPaginate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loadingApproval = true;
      }
    },
    [getAllBillingCancelTaskPaginate.fulfilled]: (state, action) => {
      state.loadingApproval = false;
      const newData = action.payload?.result || [];
      const isLoadMore = action.payload?.isLoadMore;

      if (isLoadMore) {
        state.data_list_billing_approval = {
          result: [
            ...(state.data_list_billing_approval?.result || []),
            ...newData,
          ],
          page: {
            totalElements: action.payload.page?.totalElements || 0,
            totalPages: action.payload.page?.totalPages || 0,
            number: action.payload.page?.number || 0,
            size: action.payload.page?.size || 10,
          },
        };
      } else {
        state.data_list_billing_approval = {
          result: newData,
          page: {
            totalElements: action.payload?.page?.totalElements || 0,
            totalPages: action.payload?.page?.totalPages || 0,
            number: action.payload?.page?.number || 0,
            size: action.payload?.page?.size || 10,
          },
        };
      }
    },
    [getAllBillingCancelTaskPaginate.rejected]: (state, action) => {
      state.loadingApproval = false;
      if (!action.meta.arg?.isLoadMore) {
        state.data_list_billing_approval = {
          result: [],
          page: {
            totalElements: 0,
            totalPages: 0,
            number: 0,
            size: 10,
          },
        };
      }
    },

    // Get All Billing Item Pagination
    [getAllBillingItemPaginate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loadingDetail = true;
      }
    },
    [getAllBillingItemPaginate.fulfilled]: (state, action) => {
      state.loadingDetail = false;
      const isLoadMore = action.payload?.isLoadMore;
      const newResult = action.payload?.result || [];
      if (isLoadMore) {
        const existingIds = new Set(
          (state.data_billingItem?.result || []).map((item) => item.id)
        );
        const uniqueNew = newResult.filter((item) => !existingIds.has(item.id));
        state.data_billingItem = {
          ...action.payload,
          result: [...(state.data_billingItem?.result || []), ...uniqueNew],
        };
      } else {
        state.data_billingItem = action.payload;
      }
    },
    [getAllBillingItemPaginate.rejected]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loadingDetail = false;
      }
    },

    // Get All Rating Result Pagination
    [getAllRatingResultPaginate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loadingDetail = true;
      }
    },
    [getAllRatingResultPaginate.fulfilled]: (state, action) => {
      state.loadingDetail = false;
      const isLoadMore = action.payload?.isLoadMore;
      const newResult = action.payload?.result || [];
      if (isLoadMore) {
        const existingIds = new Set(
          (state.data_ratingResult?.result || []).map((item) => item.id)
        );
        const uniqueNew = newResult.filter((item) => !existingIds.has(item.id));
        state.data_ratingResult = {
          ...action.payload,
          result: [...(state.data_ratingResult?.result || []), ...uniqueNew],
        };
      } else {
        state.data_ratingResult = action.payload;
      }
    },
    [getAllRatingResultPaginate.rejected]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loadingDetail = false;
      }
    },

    // Get All Adjustment Pagination
    [getAllAdjustmentPaginate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loadingDetail = true;
      }
    },
    [getAllAdjustmentPaginate.fulfilled]: (state, action) => {
      state.loadingDetail = false;
      const isLoadMore = action.payload?.isLoadMore;
      const newResult = action.payload?.result || [];
      if (isLoadMore) {
        const existingIds = new Set(
          (state.data_adjustment?.result || []).map((item) => item.id)
        );
        const uniqueNew = newResult.filter((item) => !existingIds.has(item.id));
        state.data_adjustment = {
          ...action.payload,
          result: [...(state.data_adjustment?.result || []), ...uniqueNew],
        };
      } else {
        state.data_adjustment = action.payload;
      }
    },
    [getAllAdjustmentPaginate.rejected]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loadingDetail = false;
      }
    },

    // Download Billing
    [downloadBillingList.pending]: (state) => {
      state.loadingDownload = true;
    },
    [downloadBillingList.fulfilled]: (state) => {
      state.loadingDownload = false;
    },
    [downloadBillingList.rejected]: (state) => {
      state.loadingDownload = false;
    },

    // Get Approval History
    [getApprovalHistory.pending]: (state, action) => {
      state.loadingHistory = true;
      state.data_approval_history = action.payload;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.data_approval_history = action.payload;
      state.loadingHistory = false;
    },
    [getApprovalHistory.rejected]: (state, action) => {
      state.data_approval_history = action.payload;
      state.loadingHistory = false;
    },

    // Get Detail Payment
    [getPaymentBilling.pending]: (state, action) => {
      state.loadingDetail = true;
      state.data_Payment = action.payload;
    },
    [getPaymentBilling.fulfilled]: (state, action) => {
      state.loadingDetail = false;
      state.data_Payment = action.payload;
    },
    [getPaymentBilling.rejected]: (state, action) => {
      state.loadingDetail = false;
      state.data_Payment = action.payload;
    },

    // Get Detail Prev Payment
    [getPrevPaymentBilling.pending]: (state, action) => {
      state.loadingDetail = true;
      state.data_PrevPayment = action.payload;
    },
    [getPrevPaymentBilling.fulfilled]: (state, action) => {
      state.loadingDetail = false;
      state.data_PrevPayment = action.payload;
    },
    [getPrevPaymentBilling.rejected]: (state, action) => {
      state.loadingDetail = false;
      state.data_PrevPayment = action.payload;
    },

    // Get Detail Prev Billing
    [getPrevBilling.pending]: (state, action) => {
      state.loadingDetail = true;
      state.data_prevBilling = action.payload;
    },
    [getPrevBilling.fulfilled]: (state, action) => {
      state.loadingDetail = false;
      state.data_prevBilling = action.payload;
    },
    [getPrevBilling.rejected]: (state, action) => {
      state.loadingDetail = false;
      state.data_prevBilling = action.payload;
    },

    // Get Approve Hierarchy List
    [getAllApprovalList.pending]: (state) => {
      state.loadingApproval = true;
    },
    [getAllApprovalList.fulfilled]: (state, action) => {
      // Guard: pastikan selalu array meskipun API return object atau null
      const payload = action.payload;
      if (Array.isArray(payload)) {
        state.data_approval = payload;
      } else if (payload?.result && Array.isArray(payload.result)) {
        state.data_approval = payload.result;
      } else {
        state.data_approval = [];
      }
      state.loadingApproval = false;
    },
    [getAllApprovalList.rejected]: (state) => {
      state.data_approval = [];
      state.loadingApproval = false;
    },

    // Get List Approval By Id
    [getListApprovalById.pending]: (state) => {
      state.loadingApproval = true;
    },
    [getListApprovalById.fulfilled]: (state, action) => {
      const payload = action.payload;
      if (Array.isArray(payload)) {
        state.data_approval_list = payload;
      } else if (payload?.result && Array.isArray(payload.result)) {
        state.data_approval_list = payload.result;
      } else {
        state.data_approval_list = [];
      }
      state.loadingApproval = false;
    },
    [getListApprovalById.rejected]: (state) => {
      state.data_approval_list = [];
      state.loadingApproval = false;
    },

    // Cancel Billing
    [cancelBilling.pending]: (state) => {
      state.loadingCancel = true;
    },
    [cancelBilling.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loadingCancel = false;
    },
    [cancelBilling.rejected]: (state, action) => {
      state.loadingCancel = false;
      state.isFailed = true;
      state.result = action.payload;
    },

    // Attachment Category for Cancel Billing
    [getAttachmentCategoryBilling.pending]: (state) => {
      state.dataListCategory = [];
    },
    [getAttachmentCategoryBilling.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
    },
    [getAttachmentCategoryBilling.rejected]: (state) => {
      state.dataListCategory = [];
    },

    // Get List Billing Period
    [getListBillingPeriodForBilling.pending]: (state) => {
      state.loadingPeriod = true;
    },
    [getListBillingPeriodForBilling.fulfilled]: (state, action) => {
      state.loadingPeriod = false;
      state.list_billing_period = action.payload;
    },
    [getListBillingPeriodForBilling.rejected]: (state) => {
      state.loadingPeriod = false;
      state.list_billing_period = [];
    },
  },
});

export const { setBillingFilters, resetBillingData, resetBillingRequestData, resetCancelBillingData } = billingSlice.actions;
const { reducer } = billingSlice;
export default reducer;