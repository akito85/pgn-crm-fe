import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../../utils";

const initialState = {
  data: null,
  loading: false,
  data_detail: null,
  message: "",
};

export const getAccountingRulesPaginate = createAsyncThunk(
  "GET_ACCOUNTING_RULES_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/accounting-rules/paging?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response.data;
    } catch (error) {
      // const message =
      //     error?.response?.data?.message || error?.message || error?.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //     thunkAPI.dispatch(setBodyError(error));
      // } else {
      //     const errorBody = {
      //         title: "Failed",
      //         description: `${message}`,
      //     };
      //     thunkAPI.dispatch(showModalError(errorBody))
      // }
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ACCOUNTING_RULES_PAGINATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const downloadAccountingRules = createAsyncThunk(
  "DOWNLOAD_ACCOUNTING_RULES",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/accounting-rules/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_ACCOUNTING_RULES",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getDetailAccountingRules = createAsyncThunk(
  "GET_DETAIL_ACCOUNTING_RULES",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounting-rules/detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      // const message =
      //     error?.response?.data?.message || error?.message || error?.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //     thunkAPI.dispatch(setBodyError(error));
      // } else {
      //     const errorBody = {
      //         title: "Failed",
      //         description: `${message}`,
      //     };
      //     thunkAPI.dispatch(showModalError(errorBody))
      // }
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DETAIL_ACCOUNTING_RULES",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);
export const createAccountingRules = createAsyncThunk(
  "CREATE_ACCOUNTING_RULES",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/accounting-rules/create";
      const response = await accountManagementService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been created.",
        // return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      // const message =
      //     (error.response &&
      //         error.response.data &&
      //         error.response.data.message) ||
      //     error.message ||
      //     error.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //     thunkAPI.dispatch(setBodyError(error));
      // } else {
      //     const errorBody = {
      //         title: "Failed",
      //         description: `Your data was not created. ${message}. Please try again.`,
      //         return: false,
      //     };
      //     thunkAPI.dispatch(showModalError(errorBody));
      // }
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "CREATE_ACCOUNTING_RULES",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
export const updateAccountingRules = createAsyncThunk(
  "UPDATE_ACCOUNTING_RULES",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/accounting-rules/update";
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been updated.",
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "updated", errorMessage(error)),
          action: "UPDATE_ACCOUNTING_RULES",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const activationAccountingRules = createAsyncThunk(
  "ACTIVATION_ACCOUNTING_RULES",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/accounting-rules/active-inactive";
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: response?.message,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      // const message =
      //     (error.response &&
      //         error.response.data &&
      //         error.response.data.message) ||
      //     error.message ||
      //     error.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //     thunkAPI.dispatch(setBodyError(error));
      // } else {
      //     const errorBody = {
      //         title: "Failed",
      //         description: `Your data was not updated. ${message}. Please try again.`,
      //         return: false,
      //     };
      //     thunkAPI.dispatch(showModalError(errorBody));
      // }
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "ACTIVATION_ACCOUNTING_RULES",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

const accountingRulesSlice = createSlice({
  name: "accounting_rules_slice",
  initialState,
  extraReducers: {
    // pagination
    [getAccountingRulesPaginate.pending]: (state, action) => {
      state.loading = true;
    },
    [getAccountingRulesPaginate.rejected]: (state, action) => {
      state.loading = false;
    },
    [getAccountingRulesPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // download
    [downloadAccountingRules.pending]: (state, action) => {
      state.loading = true;
    },
    [downloadAccountingRules.rejected]: (state, action) => {
      state.loading = false;
    },
    [downloadAccountingRules.fulfilled]: (state, action) => {
      state.loading = false;
    },
    // detail
    [getDetailAccountingRules.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailAccountingRules.rejected]: (state, action) => {
      state.loading = false;
    },
    [getDetailAccountingRules.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    // create
    [createAccountingRules.pending]: (state, action) => {
      state.loading = true;
    },
    [createAccountingRules.rejected]: (state, action) => {
      state.loading = false;
    },
    [createAccountingRules.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // update
    [updateAccountingRules.pending]: (state, action) => {
      state.loading = true;
    },
    [updateAccountingRules.rejected]: (state, action) => {
      state.loading = false;
    },
    [updateAccountingRules.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // activation
    [activationAccountingRules.pending]: (state, action) => {
      state.loading = true;
    },
    [activationAccountingRules.rejected]: (state, action) => {
      state.loading = false;
    },
    [activationAccountingRules.fulfilled]: (state, action) => {
      state.loading = false;
      // state.data = action.payload;
    },
  },
});

const { reducer } = accountingRulesSlice;
export default reducer;
