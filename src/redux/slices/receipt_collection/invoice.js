import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import { validateError } from "../general_slice";

const initialState = {
  loading: false,
  data: null,
  dataDownload: null,
};

export const getInvoicePagging = createAsyncThunk(
  "GET_ALL_INVOICE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "custNum~desc" : sort;
      const url = `/v1/dbs/api/invoice/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_INVOICE_PAGING",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);



export const downloadInvoice = createAsyncThunk(
  "DOWNLOAD_INVOICE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "custNum~desc" : sort;
      const url = `/v1/dbs/api/invoice/download?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "INVOICE_DOWNLOAD",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);



const invoiceMasterDataReducer = createSlice({
  name: "invoiceMasterData",
  initialState,
  extraReducers: {
    //get all invoice paginate reducer
    [getInvoicePagging.pending]: (state, action) => {
      state.dataInvoice = action.payload;
      state.loading = true;
    },
    [getInvoicePagging.fulfilled]: (state, action) => {
      state.dataInvoice = action.payload;
      state.loading = false;
    },
    [getInvoicePagging.rejected]: (state, action) => {
      state.dataInvoice = action.payload;
      state.loading = false;
    },

    //download
    [downloadInvoice.fulfilled]: (state, action) => {
      state.dataDownload = action.payload;
      // state.isSuccess = true;
      state.loading = false;
    },
    [downloadInvoice.rejected]: (state, action) => {
      // state.isFailed = true;
      state.dataDownload = action.payload;
      state.loading = false;
    },
    
  },
});

const { reducer } = invoiceMasterDataReducer;
export default reducer;
