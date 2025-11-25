import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import debtAndCollectionHttpService from "../../services/debtAndCollectionHttpService";

const initialState = {
  loading: false,
  dataTransactionReport: null,
  dataDetailTransactionReport: null,
};

export const getTransactionReport = createAsyncThunk(
  "transactionReport/getTransactionReport",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/report/transaction/summary`;
      const response = await debtAndCollectionHttpService.get(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getDetailTransactionReport = createAsyncThunk(
  "transactionReport/getDetailTransactionReport",
  async ({arAge,accountType,area}, thunkAPI) => {
    try {
      // params = { arAge, accountType, area }
      const url = `/v1/dbs/api/report/transaction/detail?arAge=${arAge}&accountType=${accountType}&area=${area}`;
      const response = await debtAndCollectionHttpService.get(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

const transactionReportSlice = createSlice({
  name: "transactionReport",
  initialState,
  extraReducers: (builder) => {
    builder
      // Get Transaction Report
      .addCase(getTransactionReport.pending, (state) => {
        // state.loading = true;
      })
      .addCase(getTransactionReport.fulfilled, (state, action) => {
        // state.loading = false;
        state.dataTransactionReport = action.payload;
      })
      .addCase(getTransactionReport.rejected, (state) => {
        // state.loading = false;
        state.dataTransactionReport = null;
      })

      // Get Detail Transaction Report
      .addCase(getDetailTransactionReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDetailTransactionReport.fulfilled, (state, action) => {
        state.loading = false;
        state.dataDetailTransactionReport = action.payload;
      })
      .addCase(getDetailTransactionReport.rejected, (state) => {
        state.loading = false;
        state.dataDetailTransactionReport = null;
      });
  },
});

export default transactionReportSlice.reducer;