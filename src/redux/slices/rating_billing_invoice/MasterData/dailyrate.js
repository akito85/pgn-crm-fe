import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../../services/ratingBillingHttpService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../../general_slice";

const initialState = {
  data_list: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
  message: "",
  data_cur: [],
  data_detail: {},
  data_detail_draft: [],
  data_rate: [],
  dataApprovalHistory: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataListCategory: [],
};

export const getDailyRatePaginate = createAsyncThunk(
  "GET_DAILYRATE__PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/daily-rate/list-daily-rate?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

//get currency
export const getCurrencyDDL = createAsyncThunk(
  "GET_CURRENCY_DAILY_RATE_DDL",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/daily-rate/list-currency`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

//get ratype create
export const getRateTypeDDL = createAsyncThunk(
  "GET_RATE_TYPE_DAILY_RATE_DDL",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/daily-rate/list-rate-type`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY_DR",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/daily-rate/list-attachment-category";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.map((item) => ({
        Id: item.id,
        text: item.text,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

//list approval hierarchy
export const getAllApprovalList = createAsyncThunk(
  "GET_ALL_APPROVAL_LIST_DR",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/daily-rate/list-apphier`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getListApprovalById = createAsyncThunk(
  "GET_LIST_APPROVAL_BY_ID_DR",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/daily-rate/list-apphier/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const createMasterDailyRates = createAsyncThunk(
  "CREATE_MASTER_DR",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/daily-rate/create`;
      const data = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.submit === false ? "created" : "submitted"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return data.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${
            body.submit === false ? "created" : "submitted"
          }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateMasterDailyRates = createAsyncThunk(
  "UPDATE_MASTER_DR",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/daily-rate/update`;
      const data = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.submit === false ? "updated" : "submitted"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return data.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${
            body.submit === false ? "updated" : "submitted"
          }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getDetailDR = createAsyncThunk(
  "GET_DETAIL_DR",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/daily-rate/detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getDetailDraftDR = createAsyncThunk(
  "GET_DETAIL_DR_DRAFT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/daily-rate/detail-draft/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return Array.isArray(response?.data) ? null : response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const inactiveDailyRates = createAsyncThunk(
  "INACTIVE_DAILY_RATES",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/daily-rate/inactive`;
      const response = await ratingBillingHttpService.activationRemarkWithPut(
        url,
        body
      );
      const messageBody = {
        title: `Successful`,
        description: `Your data has been submitted`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(messageBody));
      return response.data;
    } catch (response) {
      const message =
        (response.response &&
          response.response.data &&
          response.response.data.message) ||
        response.message ||
        response.toString();
      const errorBody = {
        title: "Failed",
        description: `${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const getDowloadDailyRate = createAsyncThunk(
  "DOWNLOAD_DAILY_RATE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/daily-rate/download-filter?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_DAILY_RATE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_DR",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/daily-rate/approval-history/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

//approve or reject create
export const approveCreate = createAsyncThunk(
  "APPROVE_OR_REJECT_CREATE_DAILYRATES",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/daily-rate/approve-reject";
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body
      );
      const messageBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.action === "APPROVE" ? "Approved" : "Rejected"
        }.`,
        return: true,
      };
      thunkAPI.dispatch(showModalSuccess(messageBody));
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
          description: `Your data was not ${
            body.action === "APPROVE" ? "Approved" : "Rejected"
          }. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

//approve or reject INACTIVE
export const approveRejectInactive = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_DAILYRATES",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/daily-rate/approve-inactive";
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body
      );
      const messageBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.action === "APPROVE" ? "Approved" : "Rejected"
        }.`,
        return: true,
      };
      thunkAPI.dispatch(showModalSuccess(messageBody));
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
          description: `Your data was not ${
            body.action === "APPROVE" ? "Approved" : "Rejected"
          }. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const dailyrateSlice = createSlice({
  name: "daily_rate",
  initialState,
  extraReducers: {
    // Get All Rate Type Pagination
    [getDailyRatePaginate.pending]: (state) => {
      state.loading = true;
    },
    [getDailyRatePaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_list = action.payload;
    },
    [getDailyRatePaginate.rejected]: (state, action) => {
      state.loading = false;
      state.data_list = action.payload;
    },

    // inactive app
    [inactiveDailyRates.pending]: (state) => {
      state.loading = true;
    },
    [inactiveDailyRates.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveDailyRates.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },

    /** Get Approval History */
    [getApprovalHistory.pending]: (state, action) => {
      state.loadingCalender = true;
      state.dataApprovalHistory = action.payload;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loadingCalender = false;
    },
    [getApprovalHistory.rejected]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loadingCalender = false;
    },

    // create  daily rates
    [createMasterDailyRates.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createMasterDailyRates.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createMasterDailyRates.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // create  daily rates
    [updateMasterDailyRates.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [updateMasterDailyRates.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [updateMasterDailyRates.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    //get ddl currency
    [getCurrencyDDL.pending]: (state, action) => {
      state.data_cur = action.payload;
      state.loadingCur = true;
    },
    [getCurrencyDDL.fulfilled]: (state, action) => {
      state.data_cur = action.payload;
      state.loadingCur = false;
    },
    [getCurrencyDDL.rejected]: (state, action) => {
      state.data_cur = action.payload;
      state.loadingCur = false;
    },

    //get ddl rateType
    [getRateTypeDDL.pending]: (state, action) => {
      state.data_rate = action.payload;
      state.loadingRate = true;
    },
    [getRateTypeDDL.fulfilled]: (state, action) => {
      state.data_rate = action.payload;
      state.loadingRate = false;
    },
    [getRateTypeDDL.rejected]: (state, action) => {
      state.data_rate = action.payload;
      state.loadingRate = false;
    },

    // Get Approve Hierarchy List
    [getAllApprovalList.pending]: (state, action) => {
      state.loading = true;
      state.dataListAppHierId = action.payload;
    },
    [getAllApprovalList.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    [getAllApprovalList.rejected]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },

    // Get List Approval By Id
    [getListApprovalById.pending]: (state, action) => {
      state.loading = true;
      state.dataListAppHierDetail = action.payload;
    },
    [getListApprovalById.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },
    [getListApprovalById.rejected]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },

    /** Get Approval History */
    [getApprovalHistory.pending]: (state, action) => {
      state.loadingCalender = true;
      state.dataApprovalHistory = action.payload;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loadingCalender = false;
    },
    [getApprovalHistory.rejected]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loadingCalender = false;
    },

    // get detail
    [getDetailDR.pending]: (state) => {
      state.loading = true;
    },
    [getDetailDR.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailDR.rejected]: (state) => {
      state.loading = true;
    },

    // get detail draft
    [getDetailDraftDR.pending]: (state) => {
      state.loading = true;
    },
    [getDetailDraftDR.fulfilled]: (state, action) => {
      state.data_detail_draft = action.payload;
      state.loading = false;
    },
    [getDetailDraftDR.rejected]: (state) => {
      state.loading = true;
    },

    //download ratetype

    [getDowloadDailyRate.fulfilled]: (state, action) => {
      state.data_download_daily_rate = action.payload;
      // state.isSuccess = true;
      state.loading = false;
    },
    [getDowloadDailyRate.rejected]: (state, action) => {
      state.isFailed = true;
      state.data_download_daily_rate = action.payload;
      state.loading = false;
    },

    /** Get List Category */
    [getListCategory.pending]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingDR = true;
    },
    [getListCategory.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingDR = false;
    },
    [getListCategory.rejected]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingDR = false;
    },

    //aproocve reject create
    [approveCreate.pending]: (state) => {
      state.loading = true;
    },
    [approveCreate.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveCreate.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    // approve reject inactive
    [approveRejectInactive.pending]: (state) => {
      state.loading = true;
    },
    [approveRejectInactive.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveRejectInactive.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },
  },
});

const { reducer } = dailyrateSlice;
export default reducer;
