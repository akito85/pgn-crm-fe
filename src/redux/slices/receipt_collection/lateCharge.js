import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../general_slice";

const initialState = {
  loading: false,
  data: null,
};

export const getPagingLateCharge = createAsyncThunk(
  "GET_ALL_LATE_CHARGE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/latecharge/get-paging?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_LATE_CHARGE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getDetailLateChargePayment = createAsyncThunk(
  "GET_DETAIL_ITEM_LATE_CHARGE_PAYMENTS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/latecharge/get-detail/${id}`;
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
  },
);

export const downloadLateCharge = createAsyncThunk(
  "DOWNLOAD_LATE_CHARGE_MANAGEMENT",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/latecharge/download?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "LATE_CHARGE_DOWNLOAD",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

const lateCharge = createSlice({
  name: "late",
  initialState,
  extraReducers: {
    //get all employee paginate reducer
    [getPagingLateCharge.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [getPagingLateCharge.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getPagingLateCharge.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // get detail
    [getDetailLateChargePayment.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailLateChargePayment.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailLateChargePayment.rejected]: (state, action) => {
      state.loading = true;
    },

    //download
    [downloadLateCharge.fulfilled]: (state, action) => {
      state.data_download = action.payload;
      // state.isSuccess = true;
      state.loading = false;
    },
    [downloadLateCharge.rejected]: (state, action) => {
      state.isFailed = true;
      state.data_download = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = lateCharge;
export default reducer;
