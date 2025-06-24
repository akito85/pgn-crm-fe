import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
  showModalError,
  showModalSuccess,
  validateError,
} from "../general_slice";

const initialState = {
  loading: false,
  data: null,
  data_reconcile: null,
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
  },
});

const { reducer } = receiptHistoriesReducer;
export default reducer;
