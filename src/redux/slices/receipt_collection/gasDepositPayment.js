import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import { validateError } from "../general_slice";

const initialState = {
  loading_list: false,
  loading_summary_balance: false,
  loading_mutation_detail: false,
  loading_attachment_list: false,
  loading_history: false,
  loading_expired: false,
  loading_expired_source: false,
  loading_expired_history: false,
  loading_expired_action: false,
  loading_pending_mutations: false,
  loading_summary_mutation_rows: false,
  loading_summary_mutations: false,
  loading_earn_action: false,
  loading_daily_rate: false,
  loading_account_options: false,
  loading_billing_period_options: false,
  loading_bank_ddl: false,
  dataListCategory: [],
  data_daily_rate: null,
  data_source_ddl: [],
  data_bank_ddl: [],
  data_billing_period_options: [],
  data_account_options: { result: [], page: {} },
  data_list: null,
  data_summary_balance: null,
  data_mutation_detail: null,
  data_attachment_list: [],
  data_approval_history: null,
  data_expired: null,
  data_expired_source: null,
  data_expired_history: null,
  data_pending_mutations: null,
  data_summary_mutation_rows: [],
  data_summary_mutations: [],
  filters: {
    search: {},
    sort: "",
    page: 1,
  },
};

const mapPayGasDepositAttachment = (item) => ({
  id: item?.id,
  uid: item?.uid || item?.id,
  fileName: item?.fileName,
  fileSize: item?.fileSize,
  fileCategoryName: item?.fileCategoryName,
  createdBy: item?.createdBy,
  createdDate: item?.createdDate,
  fileType: item?.fileType || item?.type,
  type: item?.type,
  urlFile1: `/v1/dbs/api/attachment/download/${item?.id}`,
  dataType: "exist",
});

const resolvePayGasDepId = (payload = {}) => (
  payload?.payGasDepId
  ?? payload?.referenceId
  ?? payload?.summaryRefId
  ?? payload?.id
);

const resolvePayLedgerId = (payload = {}) => (
  payload?.payLedgerId
  ?? payload?.mutationId
  ?? payload?.id
);

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
  async ({ payGasDepId, gasDepositId, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const resolvedPayGasDepId = resolvePayGasDepId({ payGasDepId, gasDepositId });
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "mutationDate~desc" : sort;
      const url = `/v1/dbs/api/pay-gas-deposit/mutation-detail/${resolvedPayGasDepId}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
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
  async ({ accountId, payGasDepId, summaryRefId, billingPeriod }, thunkAPI) => {
    try {
      const resolvedPayGasDepId = resolvePayGasDepId({ payGasDepId, summaryRefId });
      const params = new URLSearchParams();
      if (resolvedPayGasDepId) {
        params.append("payGasDepId", resolvedPayGasDepId);
      }
      if (billingPeriod) {
        params.append("billingPeriod", billingPeriod);
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

export const getPayGasDepositAttachmentList = createAsyncThunk(
  "GET_PAY_GAS_DEPOSIT_ATTACHMENT_LIST",
  async ({ referenceId } = {}, thunkAPI) => {
    try {
      if (!referenceId) {
        return [];
      }

      const url = `/v1/dbs/api/pay-gas-deposit/attachments?referenceId=${referenceId}&page=1&size=100&sort=createdDate~desc`;
      const response = await receiptCollectionHttpService.getPagination(url);
      const rawRows = response?.data?.result || [];
      return rawRows.map(mapPayGasDepositAttachment);
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_PAY_GAS_DEPOSIT_ATTACHMENT_LIST" }));
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

export const createPayGasDepositExpiredBatch = createAsyncThunk(
  "CREATE_PAY_GAS_DEPOSIT_EXPIRED_BATCH",
  async (payload, thunkAPI) => {
    try {
      const response = await receiptCollectionHttpService.createData(
        "/v1/dbs/api/pay-gas-deposit/expired/create",
        payload,
      );
      return response?.data ?? response;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "CREATE_PAY_GAS_DEPOSIT_EXPIRED_BATCH" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const getPayGasDepositExpiredHistory = createAsyncThunk(
  "GET_PAY_GAS_DEPOSIT_EXPIRED_HISTORY",
  async (_, thunkAPI) => {
    try {
      const response = await receiptCollectionHttpService.getAll("/v1/dbs/api/pay-gas-deposit/history");
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_PAY_GAS_DEPOSIT_EXPIRED_HISTORY" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const getPayGasDepositSourceDDL = createAsyncThunk(
  "GET_PAY_GAS_DEPOSIT_SOURCE_DDL",
  async (_, thunkAPI) => {
    try {
      const response = await receiptCollectionHttpService.getAll("/v1/dbs/api/pay-gas-deposit/list-source");
      return response?.data || [];
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_PAY_GAS_DEPOSIT_SOURCE_DDL" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const getPayGasDepositBankDDL = createAsyncThunk(
  "GET_PAY_GAS_DEPOSIT_BANK_DDL",
  async (_, thunkAPI) => {
    try {
      const response = await receiptCollectionHttpService.getAll("/v1/dbs/api/pay-gas-deposit/list-bank");
      return response?.data || [];
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_PAY_GAS_DEPOSIT_BANK_DDL" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const getPayGasDepositBillingPeriodOptions = createAsyncThunk(
  "GET_PAY_GAS_DEPOSIT_BILLING_PERIOD_OPTIONS",
  async (_, thunkAPI) => {
    try {
      const response = await ratingBillingHttpService.getAll("/v1/dbs/api/rbi/calculation/billingperiod/1");
      const rawData = response?.data?.data || response?.data || [];
      return Array.isArray(rawData)
        ? rawData.map((item) => ({
          id: item?.id,
          name: item?.name,
          code: item?.code,
          ...item,
        }))
        : [];
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_PAY_GAS_DEPOSIT_BILLING_PERIOD_OPTIONS" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const getPayGasDepositDailyRate = createAsyncThunk(
  "GET_PAY_GAS_DEPOSIT_DAILY_RATE",
  async ({ fromCurrencyName, toCurrencyName, rateType, rateDate }, thunkAPI) => {
    try {
      // rateDate input: "YYYY-MM-DD" → convert to "dd MMM yyyy" (Java FORMAT_START_END_DATE)
      // Backend's determineSelector() maps "rateDate" → BETWEEN_SELECTOR which parses this format.
      const [yyyy, mm, dd] = rateDate.split("-");
      const dayNum = +dd;
      const monthNum = +mm;
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const rateDateFormatted = `${String(dayNum).padStart(2, "0")} ${months[monthNum - 1]} ${yyyy}`;

      const filterObj = { fromCurrencyName, rateType, rateDate: rateDateFormatted };
      if (toCurrencyName) filterObj.toCurrencyName = toCurrencyName;

      const search = encodeURIComponent(JSON.stringify(filterObj));
      const url = `/v1/dbs/api/daily-rate/list-daily-rate?page=1&size=10&sort=rateDate~desc&searchs=${search}`;
      const response = await ratingBillingHttpService.getPagination(url);
      // getPagination returns response.data directly, so structure is { success, code, data: { result: [] } }
      const result = response?.data?.result || [];

      // Pick ACTIVE+APPROVED record, fallback to first result
      const matched = result.find(
        (r) => r.status === "ACTIVE" && r.statusApproval === "APPROVED",
      ) || result[0];
      return matched || null;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_PAY_GAS_DEPOSIT_DAILY_RATE" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const getListCategory = createAsyncThunk(
  "GET_PAY_GAS_DEPOSIT_ATTACHMENT_CATEGORY_LIST",
  async (_, thunkAPI) => {
    try {
      const response = await receiptCollectionHttpService.getAll("/v1/dbs/api/attachment/list-category");
      // response = { success, code, data: { data: [...] } } or { success, code, data: [...] }
      const rawList = response?.data?.data || response?.data || [];
      return (Array.isArray(rawList) ? rawList : []).map((item) => ({
        Id: item.glbTypeValId ?? item.id,
        text: item.name,
      }));
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_PAY_GAS_DEPOSIT_ATTACHMENT_CATEGORY_LIST" }));
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

export const approvePayGasDepositSummary = createAsyncThunk(
  "APPROVE_PAY_GAS_DEPOSIT_SUMMARY",
  async ({ payGasDepId, remarks }, thunkAPI) => {
    try {
      const resolvedPayGasDepId = resolvePayGasDepId({ payGasDepId });
      const response = await receiptCollectionHttpService.createData(
        `/v1/dbs/api/pay-gas-deposit/summaries/${resolvedPayGasDepId}/approve`,
        { remarks },
      );
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "APPROVE_PAY_GAS_DEPOSIT_SUMMARY" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const rejectPayGasDepositSummary = createAsyncThunk(
  "REJECT_PAY_GAS_DEPOSIT_SUMMARY",
  async ({ payGasDepId, remarks }, thunkAPI) => {
    try {
      const resolvedPayGasDepId = resolvePayGasDepId({ payGasDepId });
      const response = await receiptCollectionHttpService.createData(
        `/v1/dbs/api/pay-gas-deposit/summaries/${resolvedPayGasDepId}/reject`,
        { remarks },
      );
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "REJECT_PAY_GAS_DEPOSIT_SUMMARY" }));
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

// ── EARN MUTATION ─────────────────────────────────────────────────────────────

/**
 * Create an Earn mutation ledger entry (Finance creates receipt).
 * POST /v1/dbs/api/pay-gas-deposit/mutation/create
 */
export const createPayGasDepositEarnMutation = createAsyncThunk(
  "CREATE_PAY_GAS_DEPOSIT_EARN_MUTATION",
  async (payload, thunkAPI) => {
    try {
      const response = await receiptCollectionHttpService.createData(
        "/v1/dbs/api/pay-gas-deposit/mutation/create",
        payload,
      );
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "CREATE_PAY_GAS_DEPOSIT_EARN_MUTATION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

/**
 * Approve an Earn mutation ledger entry.
 * POST /v1/dbs/api/pay-gas-deposit/mutations/{payLedgerId}/approve
 */
export const approvePayGasDepositEarnMutation = createAsyncThunk(
  "APPROVE_PAY_GAS_DEPOSIT_EARN_MUTATION",
  async ({ payLedgerId, remarks }, thunkAPI) => {
    try {
      const resolvedPayLedgerId = resolvePayLedgerId({ payLedgerId });
      const response = await receiptCollectionHttpService.createData(
        `/v1/dbs/api/pay-gas-deposit/mutations/${resolvedPayLedgerId}/approve`,
        { remarks },
      );
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "APPROVE_PAY_GAS_DEPOSIT_EARN_MUTATION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

/**
 * Reject an Earn mutation ledger entry.
 * POST /v1/dbs/api/pay-gas-deposit/mutations/{payLedgerId}/reject
 */
export const rejectPayGasDepositEarnMutation = createAsyncThunk(
  "REJECT_PAY_GAS_DEPOSIT_EARN_MUTATION",
  async ({ payLedgerId, remarks }, thunkAPI) => {
    try {
      const resolvedPayLedgerId = resolvePayLedgerId({ payLedgerId });
      const response = await receiptCollectionHttpService.createData(
        `/v1/dbs/api/pay-gas-deposit/mutations/${resolvedPayLedgerId}/reject`,
        { remarks },
      );
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "REJECT_PAY_GAS_DEPOSIT_EARN_MUTATION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

/**
 * Approve an Expire mutation ledger entry (Finance approves expiry).
 * POST /v1/dbs/api/pay-gas-deposit/mutations/{payLedgerId}/approve-expire
 */
export const approvePayGasDepositExpireMutation = createAsyncThunk(
  "APPROVE_PAY_GAS_DEPOSIT_EXPIRE_MUTATION",
  async ({ payLedgerId, remarks }, thunkAPI) => {
    try {
      const resolvedPayLedgerId = resolvePayLedgerId({ payLedgerId });
      const response = await receiptCollectionHttpService.createData(
        `/v1/dbs/api/pay-gas-deposit/mutations/${resolvedPayLedgerId}/approve-expire`,
        { remarks },
      );
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "APPROVE_PAY_GAS_DEPOSIT_EXPIRE_MUTATION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

/**
 * Get pending mutation list for approval UI.
 * GET /v1/dbs/api/pay-gas-deposit/mutation?transType=EXPIRE&status=WAITING_APPROVAL
 */
export const getPayGasDepositPendingMutations = createAsyncThunk(
  "GET_PAY_GAS_DEPOSIT_PENDING_MUTATIONS",
  async ({ transType, status } = {}, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (transType) params.append("transType", transType);
      if (status) params.append("status", status);
      const qs = params.toString() ? `?${params.toString()}` : "";
      const response = await receiptCollectionHttpService.getAll(
        `/v1/dbs/api/pay-gas-deposit/mutation${qs}`,
      );
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_PAY_GAS_DEPOSIT_PENDING_MUTATIONS" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

/**
 * Get editable mutations for a specific payment gas deposit summary.
 * GET /v1/dbs/api/pay-gas-deposit/summary-mutations/{payGasDepId}
 */
export const getPayGasDepositSummaryMutations = createAsyncThunk(
  "GET_PAY_GAS_DEPOSIT_SUMMARY_MUTATIONS",
  async ({ payGasDepId, summaryRefId }, thunkAPI) => {
    try {
      const resolvedPayGasDepId = resolvePayGasDepId({ payGasDepId, summaryRefId });
      const response = await receiptCollectionHttpService.getAll(
        `/v1/dbs/api/pay-gas-deposit/summary-mutations/${resolvedPayGasDepId}`,
      );
      return response.data?.data ?? response.data ?? [];
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_PAY_GAS_DEPOSIT_SUMMARY_MUTATIONS" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

/**
 * Create or save-as-draft a Payment Gas Deposit summary.
 * POST /v1/dbs/api/pay-gas-deposit/create
 */
export const createPayGasDeposit = createAsyncThunk(
  "CREATE_PAY_GAS_DEPOSIT",
  async (payload, thunkAPI) => {
    try {
      const response = await receiptCollectionHttpService.createData(
        "/v1/dbs/api/pay-gas-deposit/create",
        payload,
      );
      return response?.data ?? response;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "CREATE_PAY_GAS_DEPOSIT" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const getPayAccountOptions = createAsyncThunk(
  "GET_PAY_ACCOUNT_OPTIONS",
  async ({ page = 1, pageSize = 20, search = "", isLoadMore = false } = {}, thunkAPI) => {
    try {
      const searchParams = search
        ? encodeURIComponent(JSON.stringify({ accountNumber: search }))
        : "";
      const url = `/v1/dbs/api/pay-gas-deposit/account-options?page=${page}&size=${pageSize}&sort=accountNumber~asc&searchs=${searchParams}`;
      const response = await receiptCollectionHttpService.getPagination(url);
      const responseData = response?.data ?? response;
      return { ...responseData, isLoadMore };
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_PAY_ACCOUNT_OPTIONS" }));
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
      .addCase(getPayGasDepositAttachmentList.pending, (state) => {
        state.loading_attachment_list = true;
        state.data_attachment_list = [];
      })
      .addCase(getPayGasDepositAttachmentList.fulfilled, (state, action) => {
        state.loading_attachment_list = false;
        state.data_attachment_list = action.payload || [];
      })
      .addCase(getPayGasDepositAttachmentList.rejected, (state) => {
        state.loading_attachment_list = false;
        state.data_attachment_list = [];
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
      .addCase(getListCategory.pending, (state) => {
        state.dataListCategory = [];
      })
      .addCase(getListCategory.fulfilled, (state, action) => {
        state.dataListCategory = action.payload || [];
      })
      .addCase(getListCategory.rejected, (state) => {
        state.dataListCategory = [];
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
      })
      // ── Earn Mutation ────────────────────────────────────────────────────────
      .addCase(createPayGasDepositEarnMutation.pending, (state) => {
        state.loading_earn_action = true;
      })
      .addCase(createPayGasDepositEarnMutation.fulfilled, (state) => {
        state.loading_earn_action = false;
      })
      .addCase(createPayGasDepositEarnMutation.rejected, (state) => {
        state.loading_earn_action = false;
      })
      .addCase(approvePayGasDepositEarnMutation.pending, (state) => {
        state.loading_earn_action = true;
      })
      .addCase(approvePayGasDepositEarnMutation.fulfilled, (state) => {
        state.loading_earn_action = false;
      })
      .addCase(approvePayGasDepositEarnMutation.rejected, (state) => {
        state.loading_earn_action = false;
      })
      .addCase(rejectPayGasDepositEarnMutation.pending, (state) => {
        state.loading_earn_action = true;
      })
      .addCase(rejectPayGasDepositEarnMutation.fulfilled, (state) => {
        state.loading_earn_action = false;
      })
      .addCase(rejectPayGasDepositEarnMutation.rejected, (state) => {
        state.loading_earn_action = false;
      })
      .addCase(approvePayGasDepositExpireMutation.pending, (state) => {
        state.loading_earn_action = true;
      })
      .addCase(approvePayGasDepositExpireMutation.fulfilled, (state) => {
        state.loading_earn_action = false;
      })
      .addCase(approvePayGasDepositExpireMutation.rejected, (state) => {
        state.loading_earn_action = false;
      })
      .addCase(getPayGasDepositPendingMutations.pending, (state) => {
        state.loading_pending_mutations = true;
      })
      .addCase(getPayGasDepositPendingMutations.fulfilled, (state, action) => {
        state.loading_pending_mutations = false;
        state.data_pending_mutations = action.payload;
      })
      .addCase(getPayGasDepositPendingMutations.rejected, (state) => {
        state.loading_pending_mutations = false;
      })
      .addCase(getPayGasDepositSummaryMutations.pending, (state) => {
        state.loading_summary_mutation_rows = true;
        state.loading_summary_mutations = true;
        state.data_summary_mutation_rows = [];
        state.data_summary_mutations = [];
      })
      .addCase(getPayGasDepositSummaryMutations.fulfilled, (state, action) => {
        state.loading_summary_mutation_rows = false;
        state.loading_summary_mutations = false;
        state.data_summary_mutation_rows = action.payload ?? [];
        state.data_summary_mutations = action.payload ?? [];
      })
      .addCase(getPayGasDepositSummaryMutations.rejected, (state) => {
        state.loading_summary_mutation_rows = false;
        state.loading_summary_mutations = false;
        state.data_summary_mutation_rows = [];
        state.data_summary_mutations = [];
      })
      // ── Source DDL ───────────────────────────────────────────────────────────
      .addCase(getPayGasDepositSourceDDL.fulfilled, (state, action) => {
        state.data_source_ddl = action.payload;
      })
      .addCase(getPayGasDepositBankDDL.pending, (state) => {
        state.loading_bank_ddl = true;
        state.data_bank_ddl = [];
      })
      .addCase(getPayGasDepositBankDDL.fulfilled, (state, action) => {
        state.loading_bank_ddl = false;
        state.data_bank_ddl = action.payload || [];
      })
      .addCase(getPayGasDepositBankDDL.rejected, (state) => {
        state.loading_bank_ddl = false;
        state.data_bank_ddl = [];
      })
      .addCase(getPayGasDepositBillingPeriodOptions.pending, (state) => {
        state.loading_billing_period_options = true;
        state.data_billing_period_options = [];
      })
      .addCase(getPayGasDepositBillingPeriodOptions.fulfilled, (state, action) => {
        state.loading_billing_period_options = false;
        state.data_billing_period_options = action.payload || [];
      })
      .addCase(getPayGasDepositBillingPeriodOptions.rejected, (state) => {
        state.loading_billing_period_options = false;
        state.data_billing_period_options = [];
      })
      // ── Daily Rate ───────────────────────────────────────────────────────────
      .addCase(getPayGasDepositDailyRate.pending, (state) => {
        state.loading_daily_rate = true;
        state.data_daily_rate = null;
      })
      .addCase(getPayGasDepositDailyRate.fulfilled, (state, action) => {
        state.loading_daily_rate = false;
        state.data_daily_rate = action.payload;
      })
      .addCase(getPayGasDepositDailyRate.rejected, (state) => {
        state.loading_daily_rate = false;
        state.data_daily_rate = null;
      })
      .addCase(createPayGasDeposit.pending, (state) => { state.loading = true; })
      .addCase(createPayGasDeposit.fulfilled, (state) => { state.loading = false; })
      .addCase(createPayGasDeposit.rejected, (state) => { state.loading = false; })
      // ── Account Options ──────────────────────────────────────────────────────
      .addCase(getPayAccountOptions.pending, (state) => {
        state.loading_account_options = true;
      })
      .addCase(getPayAccountOptions.fulfilled, (state, action) => {
        state.loading_account_options = false;
        const isLoadMore = action.payload?.isLoadMore;
        if (isLoadMore) {
          const existing = state.data_account_options?.result || [];
          const newResult = action.payload?.result || [];
          const existingIds = new Set(existing.map((item) => item.accountId));
          const uniqueNew = newResult.filter((item) => !existingIds.has(item.accountId));
          state.data_account_options = {
            ...action.payload,
            result: [...existing, ...uniqueNew],
          };
        } else {
          state.data_account_options = action.payload || { result: [], page: {} };
        }
      })
      .addCase(getPayAccountOptions.rejected, (state) => {
        state.loading_account_options = false;
        state.data_account_options = { result: [], page: {} };
      });
  },
});

export const {
  setPayGasDepositFilters,
  resetPayGasDepositApprovalHistory,
} = gasDepositPaymentSlice.actions;

export default gasDepositPaymentSlice.reducer;
