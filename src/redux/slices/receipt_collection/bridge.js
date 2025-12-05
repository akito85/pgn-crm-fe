import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import { validateError } from "../general_slice";

const initialState = {
  loading: false,
  data: null,
  dataDownload: null,
};

export const getBridgePagging = createAsyncThunk(
  "GET_ALL_BRIDGE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "seqNum~desc" : sort;
      const url = `/v1/dbs/api/bridge/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_BRIDGE_PAGING",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);



export const downloadBridge = createAsyncThunk(
  "DOWNLOAD_BRIDGE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "seqNum~desc" : sort;
      const url = `/v1/dbs/api/bridge/download?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "BRIDGE_DOWNLOAD",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);



const bridgeReducer = createSlice({
  name: "bridge",
  initialState,
  extraReducers: {
    //get all employee paginate reducer
    [getBridgePagging.pending]: (state, action) => {
      state.dataBridge = action.payload;
      state.loading = true;
    },
    [getBridgePagging.fulfilled]: (state, action) => {
      state.dataBridge = action.payload;
      state.loading = false;
    },
    [getBridgePagging.rejected]: (state, action) => {
      state.dataBridge = action.payload;
      state.loading = false;
    },

    //download
    [downloadBridge.fulfilled]: (state, action) => {
      state.dataDownload = action.payload;
      // state.isSuccess = true;
      state.loading = false;
    },
    [downloadBridge.rejected]: (state, action) => {
      // state.isFailed = true;
      state.dataDownload = action.payload;
      state.loading = false;
    },
    
  },
});

const { reducer } = bridgeReducer;
export default reducer;
