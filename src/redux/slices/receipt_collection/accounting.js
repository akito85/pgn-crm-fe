import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import { validateError } from "../general_slice";

const initialState = {
  loading: false,
  data: null,
  data_reconcile: null,
  accountingAllocation: null, // For Create Accounting feature
  submitResult: null, // For Create Accounting submit
  //   data_detail: null,
  //   data_allocation: null,
};

export const getReciptHistoriesPagging = createAsyncThunk(
  "GET_ALL_RECEIPT_HISTORIES",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/receipt/get-history-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_RECEIPT_HISTORIES_PAGING",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getReceiptReconcileHistoriesPaging = createAsyncThunk(
  "GET_HISTORIES_RECONCILE",
  async ({ search, sort, page, pageSize }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/receipt/reconcile-histories-get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL__RECONCILE_RECEIPT_HISTORIES_PAGING",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const downloadReconcileReceiptHistories = createAsyncThunk(
  "DOWNLOAD_RECEIPT_HISTORIES",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/receipt/reconcile-histories/download?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "RECEIPT_RECONCILE_HISTORY_DOWNLOAD",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

/**
 * Get accounting allocation data for Create Accounting
 * Calls: GET /v1/dbs/api/receipt/accounting/{receiptId}?payPeriod=YYYYMM
 */
export const getAccountingAllocation = createAsyncThunk(
  "GET_ACCOUNTING_ALLOCATION",
  async ({ receiptId, payPeriod }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/receipt/accounting/${receiptId}?payPeriod=${payPeriod}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ACCOUNTING_ALLOCATION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

/**
 * Submit accounting allocation for Create Accounting
 * Calls: POST /v1/dbs/api/receipt/accounting/submit
 */
export const submitAccountingAllocation = createAsyncThunk(
  "SUBMIT_ACCOUNTING_ALLOCATION",
  async ({ receiptId, payPeriod }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/receipt/accounting/submit`;
      const body = { receiptId, payPeriod };
      const response = await receiptCollectionHttpService.createData(url, body);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "SUBMIT_ACCOUNTING_ALLOCATION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const downloadReceiptHistories = createAsyncThunk(
  "DOWNLOAD_RECEIPT_HISTORIES",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/receipt/history-download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_RECEIPT_HISTORY",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

const receiptHistoriesReducer = createSlice({
  name: "receipt histories",
  initialState,
  extraReducers: {
    //get all employee paginate reducer
    [getReciptHistoriesPagging.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [getReciptHistoriesPagging.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getReciptHistoriesPagging.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },

    [getReceiptReconcileHistoriesPaging.pending]: (state, action) => {
      state.data_reconcile = action.payload;
      state.loading = true;
    },
    [getReceiptReconcileHistoriesPaging.fulfilled]: (state, action) => {
      state.data_reconcile = action.payload;
      state.loading = false;
    },
    [getReceiptReconcileHistoriesPaging.rejected]: (state, action) => {
      state.data_reconcile = action.payload;
      state.loading = true;
    },
    // get detail
    // [getReceiptDetail.pending]: (state, action) => {
    //   state.loading = true;
    // },
    // [getReceiptDetail.fulfilled]: (state, action) => {
    //   state.data_detail = action.payload;
    //   state.loading = false;
    // },
    // [getReceiptDetail.rejected]: (state, action) => {
    //   state.loading = true;
    // },
    //download
    [downloadReconcileReceiptHistories.fulfilled]: (state, action) => {
      state.data_download_reconcile = action.payload;
      // state.isSuccess = true;
      state.loading = false;
    },
    [downloadReconcileReceiptHistories.rejected]: (state, action) => {
      state.isFailed = true;
      state.data_download_reconcile = action.payload;
      state.loading = false;
    },
    [downloadReceiptHistories.fulfilled]: (state, action) => {
      state.data_download = action.payload;
      // state.isSuccess = true;
      state.loading = false;
    },
    [downloadReceiptHistories.rejected]: (state, action) => {
      state.isFailed = true;
      state.data_download = action.payload;
      state.loading = false;
    },

    // Get Accounting Allocation
    [getAccountingAllocation.pending]: (state, action) => {
      state.loading = true;
      state.accountingAllocation = null;
    },
    [getAccountingAllocation.fulfilled]: (state, action) => {
      state.accountingAllocation = action.payload;
      state.loading = false;
    },
    [getAccountingAllocation.rejected]: (state, action) => {
      state.accountingAllocation = null;
      state.loading = false;
    },

    // Submit Accounting Allocation
    [submitAccountingAllocation.pending]: (state, action) => {
      state.loading = true;
      state.submitResult = null;
    },
    [submitAccountingAllocation.fulfilled]: (state, action) => {
      state.submitResult = action.payload;
      state.loading = false;
    },
    [submitAccountingAllocation.rejected]: (state, action) => {
      state.submitResult = null;
      state.loading = false;
    },
  },
});

const { reducer } = receiptHistoriesReducer;
export default reducer;
