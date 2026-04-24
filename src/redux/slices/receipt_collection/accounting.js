import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import { validateError } from "../general_slice";

const initialState = {
  loading: false,
  data: null,
  data_reconcile: null,
  accountingAllocation: null, // For Create Accounting feature
  submitResult: null, // For Create Accounting submit
  journalRecommendation: null, // For Journal Recommendation endpoint
  saveDraftResult: null, // For Save as Draft endpoint
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

/**
 * Get journal recommendation from M_PAY_RECEIPT + R_PAY_RECEIPT_ALLOCATION
 * Calls: GET /v1/dbs/api/receipt/accounting/recommendation/{receiptId}
 */
export const getReceiptJournalRecommendation = createAsyncThunk(
  "GET_RECEIPT_JOURNAL_RECOMMENDATION",
  async ({ receiptId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/receipt/accounting/recommendation/${receiptId}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_RECEIPT_JOURNAL_RECOMMENDATION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

/**
 * Save journal recommendation as DRAFT into M_ACCOUNTING_JOURNAL + M_ACCOUNTING_JOURNAL_DETAIL
 * Calls: POST /v1/dbs/api/receipt/accounting/save-draft
 */
export const saveReceiptJournalAsDraft = createAsyncThunk(
  "SAVE_RECEIPT_JOURNAL_DRAFT",
  async ({ receiptId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/receipt/accounting/save-draft`;
      const response = await receiptCollectionHttpService.createData(url, { receiptId });
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "SAVE_RECEIPT_JOURNAL_DRAFT",
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

    // Get Journal Recommendation
    [getReceiptJournalRecommendation.pending]: (state) => {
      state.loading = true;
      state.journalRecommendation = null;
    },
    [getReceiptJournalRecommendation.fulfilled]: (state, action) => {
      state.journalRecommendation = action.payload;
      state.loading = false;
    },
    [getReceiptJournalRecommendation.rejected]: (state) => {
      state.journalRecommendation = null;
      state.loading = false;
    },

    // Save Journal Draft
    [saveReceiptJournalAsDraft.pending]: (state) => {
      state.loading = true;
      state.saveDraftResult = null;
    },
    [saveReceiptJournalAsDraft.fulfilled]: (state, action) => {
      state.saveDraftResult = action.payload;
      state.loading = false;
    },
    [saveReceiptJournalAsDraft.rejected]: (state) => {
      state.saveDraftResult = null;
      state.loading = false;
    },
  },
});

const { reducer } = receiptHistoriesReducer;
export default reducer;
