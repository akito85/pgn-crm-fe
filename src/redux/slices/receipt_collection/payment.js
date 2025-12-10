import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import { validateError } from "../general_slice";

const initialState = {
  loading: false,
  data: null,
  dataDownload: null,
};

export const getPaymentPagging = createAsyncThunk(
  "GET_ALL_PAYMENT",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "custNum~desc" : sort;
      const url = `/v1/dbs/api/payment/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_PAYMENT_PAGING",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);



export const downloadPayment = createAsyncThunk(
  "DOWNLOAD_PAYMENT",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "custNum~desc" : sort;
      const url = `/v1/dbs/api/payment/download?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "PAYMENT_DOWNLOAD",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);



const paymentMasterDataReducer = createSlice({
  name: "paymentMasterData",
  initialState,
  extraReducers: {
    //get all payment paginate reducer
    [getPaymentPagging.pending]: (state, action) => {
      state.dataPayment = action.payload;
      state.loading = true;
    },
    [getPaymentPagging.fulfilled]: (state, action) => {
      state.dataPayment = action.payload;
      state.loading = false;
    },
    [getPaymentPagging.rejected]: (state, action) => {
      state.dataPayment = action.payload;
      state.loading = false;
    },

    //download
    [downloadPayment.fulfilled]: (state, action) => {
      state.dataDownload = action.payload;
      // state.isSuccess = true;
      state.loading = false;
    },
    [downloadPayment.rejected]: (state, action) => {
      // state.isFailed = true;
      state.dataDownload = action.payload;
      state.loading = false;
    },
    
  },
});

const { reducer } = paymentMasterDataReducer;
export default reducer;
