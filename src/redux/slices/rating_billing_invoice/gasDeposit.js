import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import productPromoHttpService from "../../services/productPromoHttpService";
import {
  showModalError,
  setBodyError,
  showModalSuccess,
} from "../general_slice";

// ===================== DUMMY DATA =====================
const dummyGasDepositData = {
  result: [
    {
      gasDepositId: "GD-001",
      customerNumber: "CUST-001",
      customerName: "PT. Gas Alam Nusantara",
      accountNumber: "ACC-10001",
      accountName: "Gas Alam Nusantara - Main",
      accountGroupType: "Industrial",
      paymentGuaranteeCode: "PGC-001",
      sor: "SOR-001",
      costCenter: "CC-1001",
      accountSegment: "Segment A",
      meterReadingCode: "MRC-001",
      currency: "IDR",
      uom: "MMBTU",
      period: "2026-01",
      currentPeriodVolume: 15000,
      currentPeriodAmount: 750000000,
      accountType: "Prepaid",
      classificationType: "Type A",
    },
    {
      gasDepositId: "GD-002",
      customerNumber: "CUST-002",
      customerName: "PT. Energi Mandiri",
      accountNumber: "ACC-10002",
      accountName: "Energi Mandiri - Branch 1",
      accountGroupType: "Commercial",
      paymentGuaranteeCode: "PGC-002",
      sor: "SOR-002",
      costCenter: "CC-1002",
      accountSegment: "Segment B",
      meterReadingCode: "MRC-002",
      currency: "USD",
      uom: "MMBTU",
      period: "2026-01",
      currentPeriodVolume: 8500,
      currentPeriodAmount: 425000,
      accountType: "Postpaid",
      classificationType: "Type B",
    },
    {
      gasDepositId: "GD-003",
      customerNumber: "CUST-003",
      customerName: "PT. Bumi Gas Indonesia",
      accountNumber: "ACC-10003",
      accountName: "Bumi Gas Indonesia - HQ",
      accountGroupType: "Industrial",
      paymentGuaranteeCode: "PGC-003",
      sor: "SOR-003",
      costCenter: "CC-1003",
      accountSegment: "Segment A",
      meterReadingCode: "MRC-003",
      currency: "IDR",
      uom: "MMBTU",
      period: "2026-02",
      currentPeriodVolume: 22000,
      currentPeriodAmount: 1100000000,
      accountType: "Prepaid",
      classificationType: "Type A",
    },
    {
      gasDepositId: "GD-004",
      customerNumber: "CUST-004",
      customerName: "PT. Surya Gas Perkasa",
      accountNumber: "ACC-10004",
      accountName: "Surya Gas Perkasa - Plant",
      accountGroupType: "Residential",
      paymentGuaranteeCode: "PGC-004",
      sor: "SOR-004",
      costCenter: "CC-1004",
      accountSegment: "Segment C",
      meterReadingCode: "MRC-004",
      currency: "IDR",
      uom: "MMBTU",
      period: "2026-02",
      currentPeriodVolume: 5000,
      currentPeriodAmount: 250000000,
      accountType: "Postpaid",
      classificationType: "Type C",
    },
    {
      gasDepositId: "GD-005",
      customerNumber: "CUST-005",
      customerName: "PT. Nusantara Energy Corp",
      accountNumber: "ACC-10005",
      accountName: "Nusantara Energy - Main",
      accountGroupType: "Industrial",
      paymentGuaranteeCode: "PGC-005",
      sor: "SOR-005",
      costCenter: "CC-1005",
      accountSegment: "Segment A",
      meterReadingCode: "MRC-005",
      currency: "USD",
      uom: "MMBTU",
      period: "2026-03",
      currentPeriodVolume: 30000,
      currentPeriodAmount: 1500000,
      accountType: "Prepaid",
      classificationType: "Type A",
    },
    {
      gasDepositId: "GD-006",
      customerNumber: "CUST-006",
      customerName: "PT. Cahaya Gas Utama",
      accountNumber: "ACC-10006",
      accountName: "Cahaya Gas Utama - Depot",
      accountGroupType: "Commercial",
      paymentGuaranteeCode: "PGC-006",
      sor: "SOR-006",
      costCenter: "CC-1006",
      accountSegment: "Segment B",
      meterReadingCode: "MRC-006",
      currency: "IDR",
      uom: "MMBTU",
      period: "2026-03",
      currentPeriodVolume: 12000,
      currentPeriodAmount: 600000000,
      accountType: "Prepaid",
      classificationType: "Type B",
    },
    {
      gasDepositId: "GD-007",
      customerNumber: "CUST-007",
      customerName: "PT. Mitra Gas Sejahtera",
      accountNumber: "ACC-10007",
      accountName: "Mitra Gas Sejahtera - Branch",
      accountGroupType: "Residential",
      paymentGuaranteeCode: "PGC-007",
      sor: "SOR-007",
      costCenter: "CC-1007",
      accountSegment: "Segment C",
      meterReadingCode: "MRC-007",
      currency: "IDR",
      uom: "MMBTU",
      period: "2026-01",
      currentPeriodVolume: 3500,
      currentPeriodAmount: 175000000,
      accountType: "Postpaid",
      classificationType: "Type C",
    },
    {
      gasDepositId: "GD-008",
      customerNumber: "CUST-008",
      customerName: "PT. Pertamina Gas Niaga",
      accountNumber: "ACC-10008",
      accountName: "Pertamina Gas Niaga - Dist",
      accountGroupType: "Industrial",
      paymentGuaranteeCode: "PGC-008",
      sor: "SOR-008",
      costCenter: "CC-1008",
      accountSegment: "Segment A",
      meterReadingCode: "MRC-008",
      currency: "USD",
      uom: "MMBTU",
      period: "2026-02",
      currentPeriodVolume: 45000,
      currentPeriodAmount: 2250000,
      accountType: "Prepaid",
      classificationType: "Type A",
    },
    {
      gasDepositId: "GD-009",
      customerNumber: "CUST-009",
      customerName: "PT. Jaya Gas Pratama",
      accountNumber: "ACC-10009",
      accountName: "Jaya Gas Pratama - Office",
      accountGroupType: "Commercial",
      paymentGuaranteeCode: "PGC-009",
      sor: "SOR-009",
      costCenter: "CC-1009",
      accountSegment: "Segment B",
      meterReadingCode: "MRC-009",
      currency: "IDR",
      uom: "MMBTU",
      period: "2026-03",
      currentPeriodVolume: 9800,
      currentPeriodAmount: 490000000,
      accountType: "Postpaid",
      classificationType: "Type B",
    },
    {
      gasDepositId: "GD-010",
      customerNumber: "CUST-010",
      customerName: "PT. Harapan Gas Abadi",
      accountNumber: "ACC-10010",
      accountName: "Harapan Gas Abadi - Main",
      accountGroupType: "Industrial",
      paymentGuaranteeCode: "PGC-010",
      sor: "SOR-010",
      costCenter: "CC-1010",
      accountSegment: "Segment A",
      meterReadingCode: "MRC-010",
      currency: "IDR",
      uom: "MMBTU",
      period: "2026-01",
      currentPeriodVolume: 18000,
      currentPeriodAmount: 900000000,
      accountType: "Prepaid",
      classificationType: "Type A",
    },
  ],
  page: {
    totalElements: 10,
    totalPages: 1,
    currentPage: 1,
    size: 100,
  },
};

// ===================== DUMMY DATA: MUTATION SUMMARY =====================
const dummyMutationSummaryData = {
  result: [
    {
      id: "MS-001",
      source: "Billing",
      period: "2026-01",
      currency: "IDR",
      uom: "MMBTU",
      timeUnit: "Monthly",
      balanceVolume: 15000,
      balanceAmount: 750000000,
      startDate: "2026-01-01",
      endDate: "2026-01-31",
      redemPeriod: "2026-02",
      status: "Active",
      statusApproval: "Approved",
    },
    {
      id: "MS-002",
      source: "Rating",
      period: "2026-02",
      currency: "IDR",
      uom: "MMBTU",
      timeUnit: "Monthly",
      balanceVolume: 12000,
      balanceAmount: 600000000,
      startDate: "2026-02-01",
      endDate: "2026-02-28",
      redemPeriod: "2026-03",
      status: "Active",
      statusApproval: "Approved",
    },
    {
      id: "MS-003",
      source: "Adjustment",
      period: "2026-03",
      currency: "USD",
      uom: "MMBTU",
      timeUnit: "Monthly",
      balanceVolume: 8500,
      balanceAmount: 425000,
      startDate: "2026-03-01",
      endDate: "2026-03-31",
      redemPeriod: "2026-04",
      status: "Pending",
      statusApproval: "Waiting",
    },
    {
      id: "MS-004",
      source: "Billing",
      period: "2026-03",
      currency: "IDR",
      uom: "MMBTU",
      timeUnit: "Quarterly",
      balanceVolume: 25000,
      balanceAmount: 1250000000,
      startDate: "2026-01-01",
      endDate: "2026-03-31",
      redemPeriod: "2026-04",
      status: "Active",
      statusApproval: "Approved",
    },
    {
      id: "MS-005",
      source: "Rating",
      period: "2026-01",
      currency: "USD",
      uom: "MMBTU",
      timeUnit: "Monthly",
      balanceVolume: 5000,
      balanceAmount: 250000,
      startDate: "2026-01-01",
      endDate: "2026-01-31",
      redemPeriod: "2026-02",
      status: "Closed",
      statusApproval: "Approved",
    },
  ],
  page: {
    totalElements: 5,
    totalPages: 1,
    currentPage: 1,
    size: 100,
  },
};

// ===================== DUMMY DATA: MUTATION DETAIL =====================
const dummyMutationDetailData = {
  result: [
    {
      id: "MD-001",
      source: "Billing",
      period: "2026-01",
      mutationDate: "2026-01-15",
      mutationType: "Deposit",
      uom: "MMBTU",
      volume: 5000,
      price: 50000,
      amount: 250000000,
      type: "Credit",
      statusApproval: "Approved",
    },
    {
      id: "MD-002",
      source: "Billing",
      period: "2026-01",
      mutationDate: "2026-01-20",
      mutationType: "Withdrawal",
      uom: "MMBTU",
      volume: 2000,
      price: 50000,
      amount: 100000000,
      type: "Debit",
      statusApproval: "Approved",
    },
    {
      id: "MD-003",
      source: "Rating",
      period: "2026-02",
      mutationDate: "2026-02-10",
      mutationType: "Deposit",
      uom: "MMBTU",
      volume: 8000,
      price: 50000,
      amount: 400000000,
      type: "Credit",
      statusApproval: "Approved",
    },
    {
      id: "MD-004",
      source: "Adjustment",
      period: "2026-03",
      mutationDate: "2026-03-05",
      mutationType: "Adjustment",
      uom: "MMBTU",
      volume: 1500,
      price: 50,
      amount: 75000,
      type: "Debit",
      statusApproval: "Waiting",
    },
    {
      id: "MD-005",
      source: "Billing",
      period: "2026-02",
      mutationDate: "2026-02-25",
      mutationType: "Deposit",
      uom: "MMBTU",
      volume: 10000,
      price: 50000,
      amount: 500000000,
      type: "Credit",
      statusApproval: "Approved",
    },
    {
      id: "MD-006",
      source: "Rating",
      period: "2026-03",
      mutationDate: "2026-03-12",
      mutationType: "Withdrawal",
      uom: "MMBTU",
      volume: 3000,
      price: 50,
      amount: 150000,
      type: "Debit",
      statusApproval: "Approved",
    },
    {
      id: "MD-007",
      source: "Billing",
      period: "2026-01",
      mutationDate: "2026-01-28",
      mutationType: "Redemption",
      uom: "MMBTU",
      volume: 4000,
      price: 50000,
      amount: 200000000,
      type: "Debit",
      statusApproval: "Approved",
    },
  ],
  page: {
    totalElements: 7,
    totalPages: 1,
    currentPage: 1,
    size: 100,
  },
};

// ===================== DUMMY DATA: DROPDOWN OPTIONS =====================
const dummyPeriodOptions = [
  { label: "2026-01", value: "2026-01" },
  { label: "2026-02", value: "2026-02" },
  { label: "2026-03", value: "2026-03" },
  { label: "2026-04", value: "2026-04" },
  { label: "2026-05", value: "2026-05" },
  { label: "2026-06", value: "2026-06" },
  { label: "2026-07", value: "2026-07" },
  { label: "2026-08", value: "2026-08" },
  { label: "2026-09", value: "2026-09" },
  { label: "2026-10", value: "2026-10" },
  { label: "2026-11", value: "2026-11" },
  { label: "2026-12", value: "2026-12" },
];

const dummyCurrencyOptions = [
  { label: "IDR", value: "IDR" },
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
  { label: "SGD", value: "SGD" },
  { label: "JPY", value: "JPY" },
];

const dummyUomOptions = [
  { label: "MMBTU", value: "MMBTU" },
  { label: "MCF", value: "MCF" },
  { label: "BBL", value: "BBL" },
  { label: "MT", value: "MT" },
];

const dummyTimeUnitOptions = [
  { label: "Monthly", value: "Monthly" },
  { label: "Quarterly", value: "Quarterly" },
  { label: "Semi Annual", value: "Semi Annual" },
  { label: "Annual", value: "Annual" },
];

const dummyRedemPeriodOptions = [
  { label: "2026-01", value: "2026-01" },
  { label: "2026-02", value: "2026-02" },
  { label: "2026-03", value: "2026-03" },
  { label: "2026-04", value: "2026-04" },
  { label: "2026-05", value: "2026-05" },
  { label: "2026-06", value: "2026-06" },
  { label: "2026-07", value: "2026-07" },
  { label: "2026-08", value: "2026-08" },
  { label: "2026-09", value: "2026-09" },
  { label: "2026-10", value: "2026-10" },
  { label: "2026-11", value: "2026-11" },
  { label: "2026-12", value: "2026-12" },
];

const dummyMutationTypeOptions = [
  { label: "Deposit", value: "EARN" },
  { label: "Withdrawal", value: "EXPIRE" },
  { label: "Adjustment", value: "ADJUSTMENT" },
  { label: "Redemption", value: "REDEEM" },
];

const dummyTypeOptions = [
  { label: "Credit", value: "Credit" },
  { label: "Debit", value: "Debit" },
];

// ===================== INITIAL STATE =====================
const initialState = {
  data: [],
  data_detail: [],
  data_mutation_summary: [],
  data_mutation_detail: [],
  data_approval_expired_list: [],
  data_history: [],
  summary_notice: null,
  data_approval_history: {},
  data_period_options: [],
  data_currency_options: [],
  data_uom_options: [],
  data_time_unit_options: [],
  data_redem_period_options: [],
  data_account_options: { result: [], page: {} },
  data_mutation_type_options: [],
  data_mutation_category_options: [],
  data_type_options: [],
  dataListCategory: [],
  loading: false,
  loading_mutation_summary: false,
  loading_mutation_detail: false,
  loading_approval_expired_list: false,
  loading_process_approval: false,
  loading_history: false,
  loading_history_list: false,
  loading_attachment: false,
  loading_dropdown: false,
  loading_account_options: false,
  isFailed: false,
  isSuccess: false,
  message: "",
  currentRequestId: null,
  filters: {
    search: {},
    sort: "",
    page: 1,
  },
};

// ===================== ASYNC THUNKS =====================
export const getAllGasDepositPaginate = createAsyncThunk(
  "GET_ALL_GAS_DEPOSIT_PAGINATE",
  async ({ page, pageSize, search, sort, isLoadMore = false }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "accountNumber~asc" : sort;
      const url = `/v1/dbs/api/gas-deposit/list?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      const responseData = response?.data ?? response;
      return { ...responseData, isLoadMore };
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
      return error;
    }
  },
);

export const getHistoryGasDepositPaginate = createAsyncThunk(
  "GET_HISTORY_GAS_DEPOSIT_PAGINATE",
  async ({ page, pageSize, search, sort, isLoadMore = false } = {}, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "accountNumber~asc" : sort;
      const url = `/v1/dbs/api/gas-deposit/history?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      const responseData = response?.data ?? response;
      return { ...responseData, isLoadMore };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = { title: "Failed", description: `${message}` };
      thunkAPI.dispatch(showModalError(errorBody));
      return error;
    }
  },
);

export const getMutationSummaryPaginate = createAsyncThunk(
  "GET_MUTATION_SUMMARY_PAGINATE",
  async ({ gasDepositId, page, pageSize, search, sort } = {}, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "accountNumber~asc" : sort;
      const gasDepositParam = gasDepositId != null ? `&gasDepositId=${gasDepositId}` : "";
      const url = `/v1/dbs/api/gas-deposit/mutation-summary?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}${gasDepositParam}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return response?.data ?? response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = { title: "Failed", description: `${message}` };
      thunkAPI.dispatch(showModalError(errorBody));
      return error;
    }
  },
);

export const getMutationDetailPaginate = createAsyncThunk(
  "GET_MUTATION_DETAIL_PAGINATE",
  async ({ gasDepositId, page, pageSize, search, sort } = {}, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "mutationId~desc" : sort;
      const url = `/v1/dbs/api/gas-deposit/mutation-detail?gasDepositId=${gasDepositId}&page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return response?.data ?? response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return error;
    }
  },
);

// ===================== DROPDOWN THUNKS =====================
export const getPeriodOptions = createAsyncThunk(
  "GET_GAS_DEPOSIT_PERIOD_OPTIONS",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/billingperiod/1`;
      const response = await ratingBillingHttpService.getAll(url);
      const rawData = response?.data?.data || response?.data || [];
      return Array.isArray(rawData) ? rawData.map(item => ({ label: item.name, value: item.name })) : [];
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getAccountOptions = createAsyncThunk(
  "GET_GAS_DEPOSIT_ACCOUNT_OPTIONS",
  async ({ page = 1, pageSize = 20, search = "", isLoadMore = false } = {}, thunkAPI) => {
    try {
      const searchParams = search
        ? encodeURIComponent(JSON.stringify({ accountNumber: search }))
        : "";
      const url = `/v1/dbs/api/gas-deposit/account-options?page=${page}&size=${pageSize}&sort=accountNumber~asc&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      const responseData = response?.data ?? response;
      return { ...responseData, isLoadMore };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return thunkAPI.rejectWithValue(error?.response?.data || error);
    }
  },
);

export const getCurrencyOptions = createAsyncThunk(
  "GET_GAS_DEPOSIT_CURRENCY_OPTIONS",
  async (_, thunkAPI) => {
    try {
      // TODO: Replace with actual API call
      // const url = `/v1/dbs/api/gas-deposit/currency-options`;
      // const response = await ratingBillingHttpService.getAll(url);
      // return response.data?.data ?? response.data;

      await new Promise((resolve) => setTimeout(resolve, 200));
      return dummyCurrencyOptions;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return error;
    }
  },
);

export const getUomOptions = createAsyncThunk(
  "GET_GAS_DEPOSIT_UOM_OPTIONS",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/list-uom`;
      const response = await productPromoHttpService.getAll(url);
      const rawData = response?.data?.data || response?.data || [];
      return Array.isArray(rawData) 
        ? rawData
            .filter(item => {
              const val = (item.name || item.text || "").toUpperCase();
              return val === "MMBTU" || val === "M3";
            })
            .map(item => ({ label: item.name || item.text, value: item.name || item.text })) 
        : [];
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getTimeUnitOptions = createAsyncThunk(
  "GET_GAS_DEPOSIT_TIME_UNIT_OPTIONS",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingcycle/timeunit-get`;
      const response = await ratingBillingHttpService.getAll(url);
      const rawData = response?.data?.data || response?.data || [];
      return Array.isArray(rawData) ? rawData.map(item => ({ label: item.name || item.text, value: item.name || item.text })) : [];
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return thunkAPI.rejectWithValue(error);
    }
  },
);



export const getRedemPeriodOptions = createAsyncThunk(
  "GET_GAS_DEPOSIT_REDEM_PERIOD_OPTIONS",
  async (_, thunkAPI) => {
    try {
      // TODO: Replace with actual API call
      // const url = `/v1/dbs/api/gas-deposit/redem-period-options`;
      // const response = await ratingBillingHttpService.getAll(url);
      // return response.data?.data ?? response.data;

      await new Promise((resolve) => setTimeout(resolve, 200));
      return dummyRedemPeriodOptions;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return error;
    }
  },
);

export const createMutationSummary = createAsyncThunk(
  "CREATE_MUTATION_SUMMARY",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/mutation-summary/create-update`;
      const response = await ratingBillingHttpService.createData(url, body);
      const responseData = response?.data ?? response;
      thunkAPI.dispatch(
        showModalSuccess({
          title: "Success",
          description: body.id && body.id > 0 
            ? "Mutation Summary updated successfully"
            : "Mutation Summary created successfully",
          return: false,
        }),
      );
      return responseData;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getCategoryListGasDeposit = createAsyncThunk(
  "GET_CATEGORY_LIST_GAS_DEPOSIT",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/get-category-attachment`;
      const response = await ratingBillingHttpService.getAll(url);
      const data = response?.data ?? response;
      return Array.isArray(data)
        ? data.map((item) => ({ Id: item.Id, text: item.text }))
        : data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const getMutationTypeOptions = createAsyncThunk(
  "GET_GAS_DEPOSIT_MUTATION_TYPE_OPTIONS",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/mutation-type-options`;
      const response = await ratingBillingHttpService.getAll(url);
      const rawData = response?.data?.data || response?.data || [];
      return Array.isArray(rawData)
        ? rawData.map((item) => ({
            label: item.label || item.name,
            value: item.value || item.id || item.name,
          }))
        : [];
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return dummyMutationTypeOptions;
    }
  },
);

export const getMutationCategoryOptions = createAsyncThunk(
  "GET_GAS_DEPOSIT_MUTATION_CATEGORY_OPTIONS",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/mutation-category-options`;
      const response = await ratingBillingHttpService.getAll(url);
      const rawData = response?.data?.data || response?.data || [];
      return Array.isArray(rawData)
        ? rawData.map((item) => ({
            label: item.label || item.name,
            value: item.value || item.id || item.name,
          }))
        : [];
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return thunkAPI.rejectWithValue(error?.response?.data || error);
    }
  },
);

export const getTypeOptions = createAsyncThunk(
  "GET_GAS_DEPOSIT_TYPE_OPTIONS",
  async (_, thunkAPI) => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 200));
      return dummyTypeOptions;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return error;
    }
  },
);

export const createMutationDetail = createAsyncThunk(
  "CREATE_MUTATION_DETAIL",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/mutation-detail/create`;
      const response = await ratingBillingHttpService.createData(url, body);
      const responseData = response?.data ?? response;
      thunkAPI.dispatch(
        showModalSuccess({
          title: "Success",
          description: "Mutation Detail created successfully",
          return: false,
        }),
      );
      return responseData;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getApprovalHistory = createAsyncThunk(
  "GET_GAS_DEPOSIT_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/approval-history/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return Array.isArray(response.data) ? {} : response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return thunkAPI.rejectWithValue(error?.response?.data || error);
    }
  },
);

export const getAttachmentList = createAsyncThunk(
  "GET_GAS_DEPOSIT_ATTACHMENT_LIST",
  async ({ referenceId, category = "GAS_DEPOSIT_SUMMARY" } = {}, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/attachments?referenceId=${referenceId}&category=${category}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response?.data ?? response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return thunkAPI.rejectWithValue(error?.response?.data || error);
    }
  },
);

export const getPriceByBillingPeriod = createAsyncThunk(
  "GET_GAS_DEPOSIT_PRICE_BY_PERIOD",
  async ({ accountNumber, billingPeriod, page = 1, pageSize = 20, search = "", isLoadMore = false }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/price-by-period?accountNumber=${encodeURIComponent(accountNumber)}&billingPeriod=${encodeURIComponent(billingPeriod)}&page=${page}&size=${pageSize}&search=${encodeURIComponent(search || "")}`;
      const response = await ratingBillingHttpService.getDetail(url);
      const payload = response?.data ?? response;

      if (Array.isArray(payload?.result)) {
        const result = payload.result
          .filter((item) => item?.value !== undefined && item?.value !== null && item?.value !== "")
          .map((item) => ({
            label:
              item?.label ??
              [item?.priceCode, item?.price, item?.currency, item?.uom]
                .filter((part) => part !== undefined && part !== null && part !== "")
                .join("/"),
            value: item?.value ?? item?.price,
            price: item?.price ?? item?.value,
            priceCode: item?.priceCode,
            currency: item?.currency,
            uom: item?.uom,
            id: item?.id,
          }));
        return {
          result,
          page: payload?.page || {},
          isLoadMore,
        };
      }

      return {
        result: [],
        page: payload?.page || {},
        isLoadMore,
      };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return thunkAPI.rejectWithValue(error?.response?.data || error);
    }
  },
);

export const getApprovalExpiredList = createAsyncThunk(
  "GET_GAS_DEPOSIT_APPROVAL_EXPIRED_LIST",
  async ({ page, pageSize, search, sort } = {}, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/gas-deposit/approval-expired-list?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return response?.data ?? response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return thunkAPI.rejectWithValue(error?.response?.data || error);
    }
  },
);

export const processGasDepositApproval = createAsyncThunk(
  "PROCESS_GAS_DEPOSIT_APPROVAL",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/approval`;
      const response = await ratingBillingHttpService.createData(url, body);
      const responseData = response?.data ?? response;
      thunkAPI.dispatch(
        showModalSuccess({
          title: "Success",
          description: `Gas Deposit ${String(body?.action || "").toLowerCase()} successfully`,
          return: false,
        }),
      );
      return responseData;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return thunkAPI.rejectWithValue(error?.response?.data || error);
    }
  },
);

// ===================== SLICE =====================
const gasDepositSlice = createSlice({
  name: "gasDeposit",
  initialState,
  reducers: {
    setGasDepositFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetGasDepositData: (state) => {
      state.data = [];
      state.currentRequestId = null;
    },
  },
  extraReducers: {
    [getAllGasDepositPaginate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
        state.currentRequestId = action.meta.requestId;
      }
    },
    [getAllGasDepositPaginate.fulfilled]: (state, action) => {
      const isLoadMore = action.payload?.isLoadMore;
      if (!isLoadMore && action.meta.requestId !== state.currentRequestId) {
        return;
      }
      state.loading = false;
      if (isLoadMore) {
        const existing = state.data?.result || [];
        const newResult = action.payload?.result || [];
        const existingIds = new Set(existing.map((item) => item.gasDepositId));
        const uniqueNewData = newResult.filter(
          (item) => !existingIds.has(item.gasDepositId),
        );
        state.data = {
          ...action.payload,
          result: [...existing, ...uniqueNewData],
        };
      } else {
        state.data = action.payload;
      }
    },
    [getAllGasDepositPaginate.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    // Mutation Summary
    [getMutationSummaryPaginate.pending]: (state) => {
      state.loading_mutation_summary = true;
    },
    [getMutationSummaryPaginate.fulfilled]: (state, action) => {
      state.loading_mutation_summary = false;
      state.data_mutation_summary = action.payload;
    },
    [getMutationSummaryPaginate.rejected]: (state) => {
      state.loading_mutation_summary = false;
      state.isFailed = true;
    },

    // Mutation Detail
    [getMutationDetailPaginate.pending]: (state) => {
      state.loading_mutation_detail = true;
    },
    [getMutationDetailPaginate.fulfilled]: (state, action) => {
      state.loading_mutation_detail = false;
      state.data_mutation_detail = action.payload;
    },
    [getMutationDetailPaginate.rejected]: (state) => {
      state.loading_mutation_detail = false;
      state.isFailed = true;
    },

    // Period Options
    [getPeriodOptions.pending]: (state) => {
      state.loading_dropdown = true;
    },
    [getPeriodOptions.fulfilled]: (state, action) => {
      state.loading_dropdown = false;
      state.data_period_options = action.payload;
    },
    [getPeriodOptions.rejected]: (state) => {
      state.loading_dropdown = false;
    },

    // Account Options
    [getAccountOptions.pending]: (state) => {
      state.loading_account_options = true;
    },
    [getAccountOptions.fulfilled]: (state, action) => {
      state.loading_account_options = false;
      const isLoadMore = action.payload?.isLoadMore;
      if (isLoadMore) {
        const existing = state.data_account_options?.result || [];
        const newResult = action.payload?.result || [];
        const existingIds = new Set(existing.map((item) => item.accountId));
        const uniqueNewData = newResult.filter(
          (item) => !existingIds.has(item.accountId),
        );
        state.data_account_options = {
          ...action.payload,
          result: [...existing, ...uniqueNewData],
        };
      } else {
        state.data_account_options = action.payload || { result: [], page: {} };
      }
    },
    [getAccountOptions.rejected]: (state) => {
      state.loading_account_options = false;
      state.data_account_options = { result: [], page: {} };
    },

    // Currency Options
    [getCurrencyOptions.pending]: (state) => {
      state.loading_dropdown = true;
    },
    [getCurrencyOptions.fulfilled]: (state, action) => {
      state.loading_dropdown = false;
      state.data_currency_options = action.payload;
    },
    [getCurrencyOptions.rejected]: (state) => {
      state.loading_dropdown = false;
    },

    // UOM Options
    [getUomOptions.pending]: (state) => {
      state.loading_dropdown = true;
    },
    [getUomOptions.fulfilled]: (state, action) => {
      state.loading_dropdown = false;
      state.data_uom_options = action.payload;
    },
    [getUomOptions.rejected]: (state) => {
      state.loading_dropdown = false;
    },

    // Time Unit Options
    [getTimeUnitOptions.pending]: (state) => {
      state.loading_dropdown = true;
    },
    [getTimeUnitOptions.fulfilled]: (state, action) => {
      state.data_time_unit_options = action.payload;
      state.loading_dropdown = false;
    },
    [getTimeUnitOptions.rejected]: (state) => {
      state.loading_dropdown = false;
    },

    // getRedemPeriodOptions
    [getRedemPeriodOptions.pending]: (state) => {
      state.loading_dropdown = true;
    },
    [getRedemPeriodOptions.fulfilled]: (state, action) => {
      state.loading_dropdown = false;
      state.data_redem_period_options = action.payload;
    },
    [getRedemPeriodOptions.rejected]: (state) => {
      state.loading_dropdown = false;
    },

    // Category List
    [getCategoryListGasDeposit.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload || [];
    },

    // Create Mutation Summary
    [createMutationSummary.pending]: (state) => {
      state.loading = true;
    },
    [createMutationSummary.fulfilled]: (state) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [createMutationSummary.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    // Mutation Type Options
    [getMutationTypeOptions.pending]: (state) => {
      state.loading_dropdown = true;
    },
    [getMutationTypeOptions.fulfilled]: (state, action) => {
      state.loading_dropdown = false;
      state.data_mutation_type_options = action.payload;
    },
    [getMutationTypeOptions.rejected]: (state) => {
      state.loading_dropdown = false;
    },

    // Mutation Category Options
    [getMutationCategoryOptions.pending]: (state) => {
      state.loading_dropdown = true;
    },
    [getMutationCategoryOptions.fulfilled]: (state, action) => {
      state.loading_dropdown = false;
      state.data_mutation_category_options = action.payload;
    },
    [getMutationCategoryOptions.rejected]: (state) => {
      state.loading_dropdown = false;
    },

    // Type Options
    [getTypeOptions.pending]: (state) => {
      state.loading_dropdown = true;
    },
    [getTypeOptions.fulfilled]: (state, action) => {
      state.loading_dropdown = false;
      state.data_type_options = action.payload;
    },
    [getTypeOptions.rejected]: (state) => {
      state.loading_dropdown = false;
    },

    // Create Mutation Detail
    [createMutationDetail.pending]: (state) => {
      state.loading = true;
    },
    [createMutationDetail.fulfilled]: (state) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [createMutationDetail.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    // Approval History
    [getApprovalHistory.pending]: (state) => {
      state.loading_history = true;
      state.data_approval_history = {};
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.loading_history = false;
      state.data_approval_history = action.payload || {};
    },
    [getApprovalHistory.rejected]: (state) => {
      state.loading_history = false;
      state.data_approval_history = {};
    },

    // Attachment List
    [getAttachmentList.pending]: (state) => {
      state.loading_attachment = true;
    },
    [getAttachmentList.fulfilled]: (state, action) => {
      state.loading_attachment = false;
      state.data_attachment = action.payload?.data ?? action.payload ?? [];
    },
    [getAttachmentList.rejected]: (state) => {
      state.loading_attachment = false;
      state.data_attachment = [];
    },

    // History Gas Deposit List
    [getHistoryGasDepositPaginate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_history_list = true;
      }
    },
    [getHistoryGasDepositPaginate.fulfilled]: (state, action) => {
      state.loading_history_list = false;
      const isLoadMore = action.payload?.isLoadMore;
      if (isLoadMore) {
        const existing = state.data_history?.result || [];
        const newResult = action.payload?.result || [];
        const existingKeys = new Set(existing.map((item) => item.accountNumber));
        const uniqueNewData = newResult.filter(
          (item) => !existingKeys.has(item.accountNumber),
        );
        state.data_history = {
          ...action.payload,
          result: [...existing, ...uniqueNewData],
        };
      } else {
        state.data_history = action.payload;
      }
    },
    [getHistoryGasDepositPaginate.rejected]: (state) => {
      state.loading_history_list = false;
      state.isFailed = true;
    },

    // Approval Expired List
    [getApprovalExpiredList.pending]: (state) => {
      state.loading_approval_expired_list = true;
    },
    [getApprovalExpiredList.fulfilled]: (state, action) => {
      state.loading_approval_expired_list = false;
      state.data_approval_expired_list = action.payload || { result: [], page: {} };
    },
    [getApprovalExpiredList.rejected]: (state) => {
      state.loading_approval_expired_list = false;
      state.data_approval_expired_list = { result: [], page: {} };
    },

    // Process Approval
    [processGasDepositApproval.pending]: (state) => {
      state.loading_process_approval = true;
    },
    [processGasDepositApproval.fulfilled]: (state) => {
      state.loading_process_approval = false;
    },
    [processGasDepositApproval.rejected]: (state) => {
      state.loading_process_approval = false;
    },
  },
});

export const { setGasDepositFilters, resetGasDepositData } =
  gasDepositSlice.actions;
export default gasDepositSlice.reducer;
