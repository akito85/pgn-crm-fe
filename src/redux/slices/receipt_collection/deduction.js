import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../utils";

const initialState = {
  loading: false,
  data: null,
  data_detail: null,
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataListCategory: [],
  dataApprovalHistory: [],
  dataType: [],
  // custom
  customerData: null,
  dataPeriod: [],
  loadingHistory: false,
  loadingType: false,
  loadingPeriod: false,
  loadingAppHier: false,
  loadingAppHierDetail: false,
  loadingCustomerList: false,
  loadingDetail: false,
  loadingSearchCustomer: false,
};

export const getPaginateDeduction = createAsyncThunk(
  "GET_ALL_DEDUCTION",
  async ({ search, page, pageSize, sort, isLoadMore }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/deduction/get-list?searchs=${searchParams}&page=${page - 1}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return { ...response.data, isLoadMore: !!isLoadMore };
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_DEDUCTION_PAGING",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getDownloadDeduction = createAsyncThunk(
  "DOWNLOAD_DEDUCTION",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/deduction/download?searchs=${searchParams}&page=${page - 1}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_DEDUCTION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response);
    }
  }
);

export const getDetailDeduction = createAsyncThunk(
  "GET_DETAIL_DEDUCTION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/deduction/detail/${id}`;
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

export const createDeduction = createAsyncThunk(
  "CREATE_DEDUCTION",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/deduction/save";
      const data = await receiptCollectionHttpService.createData(url, body);
      return data.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        data: error.response.data.data,
        description: `Your data was not created. ${message}.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteDeduction = createAsyncThunk(
  "DELETE_DEDUCTION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/deduction/delete/${id}`;
      const response = await receiptCollectionHttpService.deleteData(url);
      const successBody = {
        title: "Successfull",
        description: `Your data has been deleted`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        description: `Your data was not deleted. ${message}.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_METHOD",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/deduction/get-approval-history/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_APPROVAL_HISTORY",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const searchCustomerDeduction = createAsyncThunk(
  "SEARCH_CUSTOMER_DEDUCTION",
  async ({ page, pageSize, searchs }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/deduction/search-customer?page=${page - 1}&size=${pageSize}${searchs ? `&searchs=${searchs}` : ""}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getTypeDDL = createAsyncThunk(
  "GET_LIST_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/deduction/get-type-list`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response;
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

export const getPeriodDDL = createAsyncThunk(
  "GET_LIST_PERIOD",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/deduction/get-period-list`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response;
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

export const getAllApprovalList = createAsyncThunk(
  "GET_ALL_APPROVAL_LIST_METHOD",
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
  "GET_LIST_APPROVAL_BY_ID_METHOD",
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

export const getCustomerDeductionList = createAsyncThunk(
  "GET_CUSTOMER_DEDUCTION_LIST",
  async ({ page, pageSize, id }, thunkAPI) => {
    try {
      if (!id) return { data: { result: [], page: { totalElements: 0 } } };
      const url = `/v1/dbs/api/deduction/get-customer-list/${id}?page=${page - 1}&size=${pageSize}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const approveOrRejectDeduction = createAsyncThunk(
  "APPROVE_OR_REJECT_DEDUCTION",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/deduction/approve-reject";
      const response = await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      const message = response?.message || "Action processed successfully";
      const successMessage = {
        title: "Successfull",
        description: `${message}`,
        return: true,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not processed. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const deductionSlice = createSlice({
  name: "deduction",
  initialState,
  extraReducers: {
    [getPaginateDeduction.pending]: (state) => {
      state.loading = true;
    },
    [getPaginateDeduction.fulfilled]: (state, action) => {
      const { isLoadMore, ...rest } = action.payload || {};
      const actualData = rest.data || rest;
      if (isLoadMore && state.data?.result) {
        const existingIds = new Set(state.data.result.map((item) => item.id));
        const newItems = (actualData.result || []).filter((item) => !existingIds.has(item.id));
        state.data = {
          ...actualData,
          result: [...state.data.result, ...newItems],
        };
      } else {
        state.data = actualData;
      }
      state.loading = false;
    },
    [getPaginateDeduction.rejected]: (state) => {
      state.loading = false;
    },

    [getDownloadDeduction.fulfilled]: (state) => {
      state.loading = false;
    },
    [getDownloadDeduction.rejected]: (state) => {
      state.loading = false;
    },

    [getDetailDeduction.pending]: (state) => {
      state.loadingDetail = true;
    },
    [getDetailDeduction.fulfilled]: (state, action) => {
      state.data_detail = action.payload.data || action.payload;
      state.loadingDetail = false;
    },
    [getDetailDeduction.rejected]: (state) => {
      state.loadingDetail = false;
    },

    [createDeduction.pending]: (state) => {
      state.loading = true;
    },
    [createDeduction.fulfilled]: (state) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [createDeduction.rejected]: (state) => {
      state.loading = false;
    },

    [deleteDeduction.pending]: (state) => {
      state.loading = true;
    },
    [deleteDeduction.fulfilled]: (state) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [deleteDeduction.rejected]: (state) => {
      state.loading = false;
    },

    [getApprovalHistory.pending]: (state) => {
      state.loadingHistory = true;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.dataApprovalHistory = action.payload.data || action.payload;
      state.loadingHistory = false;
    },
    [getApprovalHistory.rejected]: (state) => {
      state.loadingHistory = false;
    },

    [searchCustomerDeduction.pending]: (state) => {
      state.loadingSearchCustomer = true;
    },
    [searchCustomerDeduction.fulfilled]: (state, action) => {
      state.customerData = action.payload.data || action.payload;
      state.loadingSearchCustomer = false;
    },
    [searchCustomerDeduction.rejected]: (state) => {
      state.loadingSearchCustomer = false;
    },

    [getTypeDDL.pending]: (state) => {
      state.loadingType = true;
    },
    [getTypeDDL.fulfilled]: (state, action) => {
      const actualData = action.payload?.data?.result || action.payload?.data || action.payload;
      state.dataType = Array.isArray(actualData) ? actualData.map(item => ({
        ...item,
        label: item.name || item.label || item.p_label,
        value: item.name || item.label || item.p_label
      })) : [];
      state.loadingType = false;
    },
    [getTypeDDL.rejected]: (state) => {
      state.loadingType = false;
    },

    [getPeriodDDL.pending]: (state) => {
      state.loadingPeriod = true;
    },
    [getPeriodDDL.fulfilled]: (state, action) => {
      const actualData = action.payload?.data?.result || action.payload?.data || action.payload;
      state.dataPeriod = Array.isArray(actualData) ? actualData.map(item => ({
        ...item,
        label: item.name || item.label || item.p_label,
        value: item.id || item.value || item.p_value
      })) : [];
      state.loadingPeriod = false;
    },
    [getPeriodDDL.rejected]: (state) => {
      state.loadingPeriod = false;
    },

    [getAllApprovalList.pending]: (state) => {
      state.loadingAppHier = true;
    },
    [getAllApprovalList.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload.data || action.payload;
      state.loadingAppHier = false;
    },
    [getAllApprovalList.rejected]: (state) => {
      state.loadingAppHier = false;
    },

    [getListApprovalById.pending]: (state) => {
      state.loadingAppHierDetail = true;
    },
    [getListApprovalById.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload.data || action.payload;
      state.loadingAppHierDetail = false;
    },
    [getListApprovalById.rejected]: (state) => {
      state.loadingAppHierDetail = false;
    },

    [getListCategory.pending]: (state) => {
      state.loadingProduct = true;
    },
    [getListCategory.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload.data || action.payload;
      state.loadingProduct = false;
    },
    [getListCategory.rejected]: (state) => {
      state.loadingProduct = false;
    },

    [getCustomerDeductionList.pending]: (state) => {
      state.loadingCustomerList = true;
    },
    [getCustomerDeductionList.fulfilled]: (state, action) => {
      state.customerData = action.payload.data || action.payload;
      state.loadingCustomerList = false;
    },
    [getCustomerDeductionList.rejected]: (state) => {
      state.loadingCustomerList = false;
    },


    [approveOrRejectDeduction.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectDeduction.fulfilled]: (state) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [approveOrRejectDeduction.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.message = action.payload;
    },
  },
});

export default deductionSlice.reducer;
