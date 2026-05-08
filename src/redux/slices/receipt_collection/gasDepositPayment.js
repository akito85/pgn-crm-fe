import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import { validateError } from "../general_slice";

const initialState = {
  loading_list: false,
  loading_summary_balance: false,
  loading_mutation_detail: false,
  loading_history: false,
  loading_expired: false,
  loading_expired_source: false,
  loading_expired_history: false,
  loading_expired_action: false,
  data_list: null,
  data_summary_balance: null,
  data_mutation_detail: null,
  data_approval_history: null,
  data_expired: null,
  data_expired_source: null,
  data_expired_history: null,
  filters: {
    search: {},
    sort: "",
    page: 1,
  },
};

export const getPayGasDepositPaginate = createAsyncThunk(
  "GET_PAY_GAS_DEPOSIT_LIST",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "accountNumber~asc" : sort;
      const url = `/v1/dbs/api/pay-gas-deposit/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_PAY_GAS_DEPOSIT_LIST" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const getPayGasDepositSummaryBalancePaginate = createAsyncThunk(
  "GET_PAY_GAS_DEPOSIT_SUMMARY_BALANCE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "mutationDate~desc" : sort;
      const url = `/v1/dbs/api/pay-gas-deposit/summary-balance?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_PAY_GAS_DEPOSIT_SUMMARY_BALANCE" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const getPayGasDepositMutationDetailPaginate = createAsyncThunk(
  "GET_PAY_GAS_DEPOSIT_MUTATION_DETAIL",
  async ({ gasDepositId, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "mutationDate~desc" : sort;
      const url = `/v1/dbs/api/pay-gas-deposit/mutation-detail/${gasDepositId}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_PAY_GAS_DEPOSIT_MUTATION_DETAIL" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const getPayGasDepositApprovalHistory = createAsyncThunk(
  "GET_PAY_GAS_DEPOSIT_APPROVAL_HISTORY",
  async ({ accountId, summaryRefId }, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (summaryRefId) {
        params.append("summaryRefId", summaryRefId);
      }
      const queryString = params.toString() ? `?${params.toString()}` : "";
      const url = `/v1/dbs/api/pay-gas-deposit/approval-history-get/${accountId}${queryString}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_PAY_GAS_DEPOSIT_APPROVAL_HISTORY" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const getPayGasDepositExpiredList = createAsyncThunk(
  "GET_PAY_GAS_DEPOSIT_EXPIRED_LIST",
  async (_, thunkAPI) => {
    try {
      const response = await receiptCollectionHttpService.getAll("/v1/dbs/api/pay-gas-deposit/expired");
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_PAY_GAS_DEPOSIT_EXPIRED_LIST" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const getPayGasDepositExpiredSourceList = createAsyncThunk(
  "GET_PAY_GAS_DEPOSIT_EXPIRED_SOURCE_LIST",
  async ({ expiredDate, currency }, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (expiredDate) params.append("expiredDate", expiredDate);
      if (currency) params.append("currency", currency);
      const response = await receiptCollectionHttpService.getAll(
        `/v1/dbs/api/pay-gas-deposit/expired/source?${params.toString()}`,
      );
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_PAY_GAS_DEPOSIT_EXPIRED_SOURCE_LIST" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const getPayGasDepositExpiredHistory = createAsyncThunk(
  "GET_PAY_GAS_DEPOSIT_EXPIRED_HISTORY",
  async (_, thunkAPI) => {
    try {
      const response = await receiptCollectionHttpService.getAll("/v1/dbs/api/pay-gas-deposit/expired/history");
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_PAY_GAS_DEPOSIT_EXPIRED_HISTORY" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const approvePayGasDepositExpired = createAsyncThunk(
  "APPROVE_PAY_GAS_DEPOSIT_EXPIRED",
  async ({ payExpId, remarks }, thunkAPI) => {
    try {
      const response = await receiptCollectionHttpService.createData(
        `/v1/dbs/api/pay-gas-deposit/expired/${payExpId}/approve`,
        { remarks },
      );
      return response;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "APPROVE_PAY_GAS_DEPOSIT_EXPIRED" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const rejectPayGasDepositExpired = createAsyncThunk(
  "REJECT_PAY_GAS_DEPOSIT_EXPIRED",
  async ({ payExpId, remarks }, thunkAPI) => {
    try {
      const response = await receiptCollectionHttpService.createData(
        `/v1/dbs/api/pay-gas-deposit/expired/${payExpId}/reject`,
        { remarks },
      );
      return response;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "REJECT_PAY_GAS_DEPOSIT_EXPIRED" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

const gasDepositPaymentSlice = createSlice({
  name: "gasDepositPayment",
  initialState,
  reducers: {
    setPayGasDepositFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    resetPayGasDepositApprovalHistory: (state) => {
      state.data_approval_history = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPayGasDepositPaginate.pending, (state) => {
        state.loading_list = true;
      })
      .addCase(getPayGasDepositPaginate.fulfilled, (state, action) => {
        state.loading_list = false;
        state.data_list = action.payload;
      })
      .addCase(getPayGasDepositPaginate.rejected, (state) => {
        state.loading_list = false;
      })
      .addCase(getPayGasDepositSummaryBalancePaginate.pending, (state) => {
        state.loading_summary_balance = true;
      })
      .addCase(getPayGasDepositSummaryBalancePaginate.fulfilled, (state, action) => {
        state.loading_summary_balance = false;
        state.data_summary_balance = action.payload;
      })
      .addCase(getPayGasDepositSummaryBalancePaginate.rejected, (state) => {
        state.loading_summary_balance = false;
      })
      .addCase(getPayGasDepositMutationDetailPaginate.pending, (state) => {
        state.loading_mutation_detail = true;
      })
      .addCase(getPayGasDepositMutationDetailPaginate.fulfilled, (state, action) => {
        state.loading_mutation_detail = false;
        state.data_mutation_detail = action.payload;
      })
      .addCase(getPayGasDepositMutationDetailPaginate.rejected, (state) => {
        state.loading_mutation_detail = false;
      })
      .addCase(getPayGasDepositApprovalHistory.pending, (state) => {
        state.loading_history = true;
      })
      .addCase(getPayGasDepositApprovalHistory.fulfilled, (state, action) => {
        state.loading_history = false;
        state.data_approval_history = action.payload;
      })
      .addCase(getPayGasDepositApprovalHistory.rejected, (state) => {
        state.loading_history = false;
      })
      .addCase(getPayGasDepositExpiredList.pending, (state) => {
        state.loading_expired = true;
      })
      .addCase(getPayGasDepositExpiredList.fulfilled, (state, action) => {
        state.loading_expired = false;
        state.data_expired = action.payload;
      })
      .addCase(getPayGasDepositExpiredList.rejected, (state) => {
        state.loading_expired = false;
      })
      .addCase(getPayGasDepositExpiredSourceList.pending, (state) => {
        state.loading_expired_source = true;
      })
      .addCase(getPayGasDepositExpiredSourceList.fulfilled, (state, action) => {
        state.loading_expired_source = false;
        state.data_expired_source = action.payload;
      })
      .addCase(getPayGasDepositExpiredSourceList.rejected, (state) => {
        state.loading_expired_source = false;
      })
      .addCase(getPayGasDepositExpiredHistory.pending, (state) => {
        state.loading_expired_history = true;
      })
      .addCase(getPayGasDepositExpiredHistory.fulfilled, (state, action) => {
        state.loading_expired_history = false;
        state.data_expired_history = action.payload;
      })
      .addCase(getPayGasDepositExpiredHistory.rejected, (state) => {
        state.loading_expired_history = false;
      })
      .addCase(approvePayGasDepositExpired.pending, (state) => {
        state.loading_expired_action = true;
      })
      .addCase(approvePayGasDepositExpired.fulfilled, (state) => {
        state.loading_expired_action = false;
      })
      .addCase(approvePayGasDepositExpired.rejected, (state) => {
        state.loading_expired_action = false;
      })
      .addCase(rejectPayGasDepositExpired.pending, (state) => {
        state.loading_expired_action = true;
      })
      .addCase(rejectPayGasDepositExpired.fulfilled, (state) => {
        state.loading_expired_action = false;
      })
      .addCase(rejectPayGasDepositExpired.rejected, (state) => {
        state.loading_expired_action = false;
      });
  },
});

export const {
  setPayGasDepositFilters,
  resetPayGasDepositApprovalHistory,
} = gasDepositPaymentSlice.actions;

export default gasDepositPaymentSlice.reducer;
