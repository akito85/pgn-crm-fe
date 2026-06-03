import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError
} from "../../general_slice";

const initialState = {
  // --- List ---
  loading_listGd: false,
  list_gasDeposit: [],
  pagination_listGd: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10
  },

  // --- Summary Balance List ---
  loading_listSummaryBalance: false,
  list_summaryBalance: [],
  pagination_listSummaryBalance: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10
  },

  // --- Detail ---
  loading_detailGd: false,
  detail_gasDeposit: {},

  // --- History ---
  loading_historyGd: false,
  list_historyGd: [],
  pagination_historyGd: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10
  },

  // --- Mutation List ---
  loading_listMutation: false,
  list_mutation: [],
  pagination_listMutation: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10
  },
};

/**
 * Fetches a paginated list of gas deposits, optionally scoped to an account.
 * Always injects `listType: "all"` into the request body.
 * Supports infinite-scroll load-more by appending to the existing list when `isLoadMore` is true.
 *
 * @param {object}  arg
 * @param {number}  [arg.accountId]  - Account ID to scope the list. Omit to fetch all.
 * @param {object}  arg.body         - Pagination / search / sort body.
 * @param {boolean} arg.isLoadMore   - If true, appends results; otherwise replaces the list.
 */
export const getGasDeposits = createAsyncThunk(
  "GET_GAS_DEPOSITS",
  async ({ accountId, body, isLoadMore }, thunkAPI) => {
    try {
      body = {
        ...body,
      };

      const url =
        "/v1/dbs/api/gas-deposit/list" + (accountId ? `/${accountId}` : "");
      const response = await accountManagementService.updateDataWithMethodPost(
        url,
        body
      );
      return {
        ...response.data,
        isLoadMore
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getSummaryBalance = createAsyncThunk(
  "GET_SUMMARY_BALANCE",
  async ({ accountId, body, isLoadMore }, thunkAPI) => {
    try {
      body = {
        ...body,
      };

      const url = `/v1/dbs/api/gas-deposit/summary-balance/list/${accountId}`;
      const response = await accountManagementService.updateDataWithMethodPost(
        url,
        body
      );
      return {
        ...response.data,
        isLoadMore
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getHistoryGasDeposit = createAsyncThunk(
  "GET_GD_HISTORY",
  async ({ accountId, body, isLoadMore }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/history/list/${accountId}`;
      const response = await accountManagementService.updateDataWithMethodPost(
        url,
        body
      );
      return {
        ...response.data,
        isLoadMore
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getGasDeposit = createAsyncThunk(
  "GET_GAS_DEPOSIT",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getMutationList = createAsyncThunk(
  "GET_MUTATION_LIST",
  async ({ accountId, body, isLoadMore }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/mutation/list/${accountId}`;
      const response = await accountManagementService.updateDataWithMethodPost(
        url,
        body
      );
      return {
        ...response.data,
        isLoadMore
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const downloadGasDeposit = createAsyncThunk(
  "DOWNLOAD_GAS_DEPOSIT",
  async ({ body, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/export-excel/${id}`;
      const response = await accountManagementService.downloadDataAdvanced(
        url,
        body
      );
      return response;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_GAS_DEPOSIT",
          back: false
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

const gasDepositSlice = createSlice({
  name: "gasDeposit",
  initialState,
  reducers: {
    clearGasDepositDetail: (state) => {
      state.detail_gasDeposit = {};
      state.loading_detailGd = false;
    },
  },
  extraReducers: {
    /** Get Gas Deposits */
    [getGasDeposits.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listGd = true;
      }
    },
    [getGasDeposits.fulfilled]: (state, action) => {
      state.loading_listGd = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(
            state.list_gasDeposit.map((item) => item.id)
          );
          const filteredResult = result.filter(
            (item) => !currentIds.has(item.id)
          );
          const mappedResult = filteredResult.map((item) => ({
            ...item,
            list_gasDepositDetail: [],
            pagination_listGdDetail: {
              totalPage: 0,
              totalElement: 0,
              currentPage: 0,
              pageSize: 10
            },
            loading_listGdDetail: false
          }));

          state.list_gasDeposit = [...state.list_gasDeposit, ...mappedResult];
        } else
          state.list_gasDeposit = result.map((item) => ({
            ...item,
            list_gasDepositDetail: [],
            pagination_listGdDetail: {
              totalPage: 0,
              totalElement: 0,
              currentPage: 0,
              pageSize: 10
            },
            loading_listGdDetail: false
          }));
      }

      state.pagination_listGd = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10
      };
    },
    [getGasDeposits.rejected]: (state, action) => {
      if (action.meta.aborted) return;
      state.loading_listGd = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_gasDeposit = [];
        state.pagination_listGd = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10
        };
      }
    },

    /** Get Summary Balance */
    [getSummaryBalance.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listSummaryBalance = true;
      }
    },
    [getSummaryBalance.fulfilled]: (state, action) => {
      state.loading_listSummaryBalance = false;
      const { result, page, isLoadMore } = action.payload;
      
      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(
            state.list_summaryBalance.map((item) => item.id)
          );
          const filteredResult = result.filter(
            (item) => !currentIds.has(item.id)
          );
          state.list_summaryBalance = [...state.list_summaryBalance, ...filteredResult];
        } else {
          state.list_summaryBalance = result;
        }
      }

      state.pagination_listSummaryBalance = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10
      };
    },
    [getSummaryBalance.rejected]: (state, action) => {
      if (action.meta.aborted) return;
      state.loading_listSummaryBalance = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_summaryBalance = [];
        state.pagination_listSummaryBalance = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10
        };
      }
    },

    /** Get History */
    [getHistoryGasDeposit.pending]: (state) => {
      state.loading_historyGd = true;
    },
    [getHistoryGasDeposit.fulfilled]: (state, action) => {
      state.loading_historyGd = false;
      const { result, page } = action.payload;

      if (Array.isArray(result)) {
        state.list_historyGd = result;
      }

      state.pagination_historyGd = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10
      };
    },
    [getHistoryGasDeposit.rejected]: (state) => {
      state.loading_historyGd = false;
      state.list_historyGd = [];
      state.pagination_historyGd = {
        totalPage: 0,
        totalElement: 0,
        currentPage: 0,
        pageSize: 10
      };
    },

    /** Get Gas Deposit Detail */
    [getGasDeposit.pending]: (state) => {
      state.loading_detailGd = true;
      state.detail_gasDeposit = {};
    },
    [getGasDeposit.fulfilled]: (state, action) => {
      state.loading_detailGd = false;
      state.detail_gasDeposit = action.payload || {};
    },
    [getGasDeposit.rejected]: (state) => {
      state.loading_detailGd = false;
      state.detail_gasDeposit = {};
    },

    /** Get Mutation List */
    [getMutationList.pending]: (state) => {
      state.loading_listMutation = true;
    },
    [getMutationList.fulfilled]: (state, action) => {
      state.loading_listMutation = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(
            state.list_mutation.map((item) => item.id)
          );
          const filteredResult = result.filter(
            (item) => !currentIds.has(item.id)
          );
          state.list_mutation = [...state.list_mutation, ...filteredResult];
        } else {
          state.list_mutation = result;
        }
      }

      state.pagination_listMutation = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10
      };
    },
    [getMutationList.rejected]: (state, action) => {
      if (action.meta.aborted) return;
      state.loading_listMutation = false;
      state.list_mutation = [];
      state.pagination_listMutation = {
        totalPage: 0,
        totalElement: 0,
        currentPage: 0,
        pageSize: 10
      };
    },
  }
});
const { reducer, actions: { clearGasDepositDetail } } = gasDepositSlice;
export { clearGasDepositDetail };
export default reducer;
