import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  showModalError,
  showModalSuccess,
  setBodyError,
  validateError,
} from "../general_slice";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";

const initialState = {
  data: [],
  data_approval_history: [],
  data_attachments: [],
  accounting_from_billing: null,
  loading: false,
  loading_form: false,
  loading_attachments: false,
  message: "",
};

export const getAccountingList = createAsyncThunk(
  "GET_ACCOUNTING_LIST",
  async ({ search, page, pageSize, sort, isLoadMore }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rbi/accounting/get-accounting-list?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return { ...response.data, isLoadMore };
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
    }
  }
);

export const getAccountingDetailList = createAsyncThunk(
  "GET_ACCOUNTING_DETAIL_LIST",
  async ({ search, page, pageSize, sort, isLoadMore }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "journal.entryId~desc" : sort;
      const url = `/v1/dbs/api/rbi/accounting/get-accounting-detail-list?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return { ...response.data, isLoadMore };
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
    }
  }
);

export const downloadAccounting = createAsyncThunk(
  "DOWNLOAD_ACCOUNTING",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rbi/accounting/downloadFilter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_ACCOUNTING",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const inactivateAccounting = createAsyncThunk(
  "INACTIVATE_ACCOUNTING",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/accounting/inactivate/${id}`;
      const response = await ratingBillingHttpService.createData(url, {});
      const successBody = {
        title: "Successful",
        description: "Your data has been inactivated.",
        return: false,
        icon: "icon_error_delete",
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
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
        if (error.response?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not inactivated. ${message}.`,
            return: false,
            icon: "icon_error_delete",
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  }
);

export const getAccountingApprovalHistory = createAsyncThunk(
  "GET_ACCOUNTING_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/accounting/getApprovalHistory/${id}`;
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
    }
  }
);

export const getAccountingFromBilling = createAsyncThunk(
  "GET_ACCOUNTING_FROM_BILLING",
  async (billCode, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/accounting/generate-from-billing/${billCode}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data?.data || response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(
          showModalError({ title: "Failed", description: `${message}` })
        );
      }
    }
  }
);

export const createAccountingData = createAsyncThunk(
  "CREATE_ACCOUNTING_DATA",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/accounting/create`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: "Successful",
        description: body.submit
          ? "Accounting has been successfully submitted."
          : "Accounting saved as draft.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data?.data || response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response?.data?.code || 0) / 100) === 5) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your accounting was not saved. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getAccountingAttachments = createAsyncThunk(
  "GET_ACCOUNTING_ATTACHMENTS",
  async (entryId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/accounting/list-attachment/${entryId}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response?.data || [];
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(
          showModalError({ title: "Failed", description: `${message}` })
        );
      }
      return thunkAPI.rejectWithValue([]);
    }
  }
);

export const createAccountingJournal = createAsyncThunk(
  "CREATE_ACCOUNTING_JOURNAL",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/accounting/create-journal`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: "Successful",
        description: body.submit
          ? "Accounting has been successfully submitted."
          : "Accounting saved as draft.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data?.data || response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response?.data?.code || 0) / 100) === 5) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your accounting journal was not saved. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const checkAccountingExists = createAsyncThunk(
  "CHECK_ACCOUNTING_EXISTS",
  async (billCode, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/accounting/check-exists/${billCode}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data?.data || response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        description: `${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

const accountingSlice = createSlice({
  name: "accounting",
  initialState,
  extraReducers: {
    [getAccountingList.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getAccountingList.fulfilled]: (state, action) => {
      state.loading = false;
      const isLoadMore = action.payload?.isLoadMore;
      const newResult = action.payload?.result || [];

      if (isLoadMore) {
        const existingIds = new Set(
          (state.data?.result || []).map((item) => item.id)
        );
        const uniqueNewData = newResult.filter(
          (item) => !existingIds.has(item.id)
        );
        state.data = {
          ...action.payload,
          result: [...(state.data?.result || []), ...uniqueNewData],
        };
      } else {
        state.data = action.payload;
      }
    },
    [getAccountingList.rejected]: (state, action) => {
      state.loading = false;
      if (!action.meta.arg?.isLoadMore) {
        state.data = { result: [], page: {} };
      }
    },

    [getAccountingDetailList.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getAccountingDetailList.fulfilled]: (state, action) => {
      state.loading = false;
      const isLoadMore = action.payload?.isLoadMore;
      const newResult = action.payload?.result || [];

      if (isLoadMore) {
        const existingIds = new Set(
          (state.data?.result || []).map((item) => item.id)
        );
        const uniqueNewData = newResult.filter(
          (item) => !existingIds.has(item.id)
        );
        state.data = {
          ...action.payload,
          result: [...(state.data?.result || []), ...uniqueNewData],
        };
      } else {
        state.data = action.payload;
      }
    },
    [getAccountingDetailList.rejected]: (state, action) => {
      state.loading = false;
      if (!action.meta.arg?.isLoadMore) {
        state.data = { result: [], page: {} };
      }
    },

    [downloadAccounting.pending]: (state) => {
      state.loading = true;
    },
    [downloadAccounting.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadAccounting.rejected]: (state) => {
      state.loading = false;
    },

    [inactivateAccounting.pending]: (state) => {
      state.loading = true;
    },
    [inactivateAccounting.fulfilled]: (state) => {
      state.loading = false;
    },
    [inactivateAccounting.rejected]: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },

    [getAccountingApprovalHistory.pending]: (state) => {
      state.loading = true;
      state.data_approval_history = null;
    },
    [getAccountingApprovalHistory.fulfilled]: (state, action) => {
      state.data_approval_history = action.payload;
      state.loading = false;
    },
    [getAccountingApprovalHistory.rejected]: (state) => {
      state.data_approval_history = null;
      state.loading = false;
    },

    [getAccountingFromBilling.pending]: (state) => {
      state.loading_form = true;
      state.accounting_from_billing = null;
    },
    [getAccountingFromBilling.fulfilled]: (state, action) => {
      state.accounting_from_billing = action.payload;
      state.loading_form = false;
    },
    [getAccountingFromBilling.rejected]: (state) => {
      state.accounting_from_billing = null;
      state.loading_form = false;
    },

    [createAccountingData.pending]: (state) => {
      state.loading_form = true;
    },
    [createAccountingData.fulfilled]: (state) => {
      state.loading_form = false;
    },
    [createAccountingData.rejected]: (state) => {
      state.loading_form = false;
    },

    [createAccountingJournal.pending]: (state) => {
      state.loading_form = true;
    },
    [createAccountingJournal.fulfilled]: (state) => {
      state.loading_form = false;
    },
    [createAccountingJournal.rejected]: (state) => {
      state.loading_form = false;
    },

    [getAccountingAttachments.pending]: (state) => {
      state.loading_attachments = true;
      state.data_attachments = [];
    },
    [getAccountingAttachments.fulfilled]: (state, action) => {
      state.loading_attachments = false;
      state.data_attachments = Array.isArray(action.payload) ? action.payload : [];
    },
    [getAccountingAttachments.rejected]: (state) => {
      state.loading_attachments = false;
      state.data_attachments = [];
    },
  },
});

export default accountingSlice.reducer;
