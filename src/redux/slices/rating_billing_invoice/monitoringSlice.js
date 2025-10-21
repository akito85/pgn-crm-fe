import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import {
  showModalSuccess,
  setBodyError,
  showModalError,
} from "../general_slice";

const CUSTOM_BASE_URL = 'https://b5c5b57639b7.ngrok-free.app';

const initialState = {
  loading: false,
  error: null,
  
  summaryData: {
    pendingTransactions: 0,
    pendingApprovals: 0,
    gapRatingBilling: 0,
    gapPraBillingMaster: 0,
  },
  
  trendData: [],
  
  list_billing_period: [],

  priorityList: {
    priorPendingTransactions: [],
    priorApprovalBatches: [],
    priorGapRatingBilling: [],
    priorGapPrabillingMaster: [],
  },
  
  pendingTransactionsData: {
    result: [],
    page: {
      totalElements: 0,
      totalPages: 0,
    },
  },
  
  pendingApprovalsData: {
    result: [],
    page: {
      totalElements: 0,
      totalPages: 0,
    },
  },
  
  gapRatingBillingData: {
    result: [],
    page: {
      totalElements: 0,
      totalPages: 0,
    },
  },
  
  gapPraBillingMasterData: {
    result: [],
    page: {
      totalElements: 0,
      totalPages: 0,
    },
  },
};


export const getSummaryData = createAsyncThunk(
  "GET_MONITORING_SUMMARY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/monitoringcustomer/summary`;
      const response = await ratingBillingHttpService.getAll(url, CUSTOM_BASE_URL);
      
      return {
        pendingTransactions: response.data.summaryPendingTransaction,
        pendingApprovals: response.data.summaryPendingApproval,
        gapRatingBilling: response.data.summaryGapRatingBilling,
        gapPraBillingMaster: response.data.summaryGapPrabillingMaster,
      };
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getTrendData = createAsyncThunk(
  "GET_MONITORING_TREND",
  async (period, thunkAPI) => {
    try {

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { date: "2025-09-14", pendingTransactions: 3, pendingApprovals: 2, gapRatingBilling: 5, gapPraBillingMaster: 4 },
            { date: "2025-09-15", pendingTransactions: 5, pendingApprovals: 3, gapRatingBilling: 4, gapPraBillingMaster: 6 },
            { date: "2025-09-16", pendingTransactions: 4, pendingApprovals: 1, gapRatingBilling: 6, gapPraBillingMaster: 5 },
            { date: "2025-09-17", pendingTransactions: 6, pendingApprovals: 4, gapRatingBilling: 3, gapPraBillingMaster: 7 },
            { date: "2025-09-18", pendingTransactions: 2, pendingApprovals: 2, gapRatingBilling: 5, gapPraBillingMaster: 4 },
            { date: "2025-09-19", pendingTransactions: 5, pendingApprovals: 5, gapRatingBilling: 2, gapPraBillingMaster: 3 },
            { date: "2025-09-20", pendingTransactions: 5, pendingApprovals: 3, gapRatingBilling: 4, gapPraBillingMaster: 6 },
          ]);
        }, 500);
      });
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getPriorityList = createAsyncThunk(
  "GET_MONITORING_PRIORITY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/monitoringcustomer/anomalies-top5`;
      const response = await ratingBillingHttpService.getAll(url, CUSTOM_BASE_URL);
      
      return {
        priorPendingTransactions: response.data.priorPendingTransactions || [],
        priorApprovalBatches: response.data.priorApprovalBatches || [],
        priorGapRatingBilling: response.data.priorGapRatingBilling || [],
        priorGapPrabillingMaster: response.data.priorGapPrabillingMaster || [],
      };
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getListBillingPeriod = createAsyncThunk(
  "GET_LIST_BILLING_PERIOD_MONITORING",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/billingperiod/1`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data.data;
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getPendingTransactions = createAsyncThunk(
  "GET_PENDING_TRANSACTIONS",
  async ({ period, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "receivedAt~desc";
      const url = `/v1/dbs/api/monitoringcustomer/list-pending-trans?period=${period}&sort=${sortParams}&size=${pageSize}&page=${page}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url, CUSTOM_BASE_URL);
      
      return {
        result: response.data.content.map(item => ({
          id: item.id,
          customerId: item.accountNum,
          customerName: item.customerName || "-", 
          address: item.address || "-", 
          type: item.type || "-",
          period: item.period,
          volume: item.volumeM3,
          receivedAt: item.receivedAt ? new Date(item.receivedAt).toLocaleDateString('id-ID') : "-",
          status: item.status,
        })),
        page: {
          totalElements: response.data.totalElements || response.data.content.length,
          totalPages: response.data.totalPages || 1,
        },
      };
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const updateInvestigationFlag = createAsyncThunk(
  "UPDATE_INVESTIGATION_FLAG",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/monitoringcustomer/update-flag`;
      const body = { id };
      const response = await ratingBillingHttpService.createData(url, body, CUSTOM_BASE_URL);
      
      const successBody = {
        title: "Successful",
        description: response?.message || "Investigation flag updated successfully",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Failed to update investigation flag. ${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getPendingApprovals = createAsyncThunk(
  "GET_PENDING_APPROVALS",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "createdAt~desc";
      const apiPage = page - 1;
      
      const url = `/v1/dbs/api/monitoringcustomer/list-pending-approvals?sort=${sortParams}&size=${pageSize}&page=${apiPage}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url, CUSTOM_BASE_URL);
      
      return {
        result: response.data.content.map(item => ({
          id: item.id,
          batchId: `BATCH-${item.id}`, 
          billingPeriod: item.billingPeriod,
          accountNumber: item.accountNum,
          totalCustomers: null, 
          estimatedAmount: item.estimatedAmount,
          createdBy: item.createdBy,
          createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString('id-ID') : "-",
          status: item.status,
        })),
        page: {
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
        },
      };
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getGapRatingBilling = createAsyncThunk(
  "GET_GAP_RATING_BILLING",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "detectedAt~desc";
      const apiPage = page - 1;
      
      const url = `/v1/dbs/api/monitoringcustomer/list-gap-rating-billing?sort=${sortParams}&size=${pageSize}&page=${apiPage}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url, CUSTOM_BASE_URL);
      
      return {
        result: response.data.content.map(item => ({
          id: item.id,
          accountNumber: item.accountNum,
          customerName: item.customerName || "-", 
          billingPeriod: item.period,
          ratingCode: item.ratingCode || "-", 
          ratingValue: item.valueRating,
          billingCode: item.billingCode || "-", 
          billingValue: item.valueBilling,
          gap: item.diff,
          detectedAt: item.detectedAt ? new Date(item.detectedAt).toLocaleString('id-ID') : "-",
          gapPercentage: item.valueRating && item.valueBilling 
            ? (((item.diff) / item.valueRating) * 100).toFixed(2)
            : 0,
        })),
        page: {
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
        },
      };
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getGapPraBillingMaster = createAsyncThunk(
  "GET_GAP_PRABIL_MASTER",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            result: [
              {
                id: 1,
                customerId: "CUST003",
                customerName: "PT DEF",
                billingPeriod: "202509",
                fieldMismatch: "Golongan Tarif",
                praBillingValue: "I-2",
                masterValue: "I-3",
              },
              {
                id: 2,
                customerId: "CUST011",
                customerName: "PT Makmur",
                billingPeriod: "202509",
                fieldMismatch: "Status Pelanggan",
                praBillingValue: "Aktif",
                masterValue: "Non-Aktif",
              },
              {
                id: 3,
                customerId: "CUST012",
                customerName: "CV Sukses",
                billingPeriod: "202509",
                fieldMismatch: "Jenis Pelanggan",
                praBillingValue: "Komersial",
                masterValue: "Industri",
              },
              {
                id: 4,
                customerId: "CUST013",
                customerName: "Rumah Ibu Ani",
                billingPeriod: "202509",
                fieldMismatch: "Alamat",
                praBillingValue: "Jl. Sudirman No. 10",
                masterValue: "Jl. Sudirman No. 12",
              },
              {
                id: 5,
                customerId: "CUST014",
                customerName: "PT Global",
                billingPeriod: "202509",
                fieldMismatch: "Golongan Tarif",
                praBillingValue: "K-1",
                masterValue: "K-2",
              },
              {
                id: 6,
                customerId: "CUST015",
                customerName: "Toko Berkah",
                billingPeriod: "202509",
                fieldMismatch: "Area Pelayanan",
                praBillingValue: "Jakarta Utara",
                masterValue: "Jakarta Pusat",
              },
            ],
            page: {
              totalElements: 6,
              totalPages: 1,
            },
          });
        }, 500);
      });
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const downloadPendingTransactions = createAsyncThunk(
  "DOWNLOAD_PENDING_TRANSACTIONS",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      
      console.log("Download Pending Transactions");
      return null;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Download failed. ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const downloadPendingApprovals = createAsyncThunk(
  "DOWNLOAD_PENDING_APPROVALS",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      console.log("Download Pending Approvals");
      return null;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Download failed. ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const downloadGapRatingBilling = createAsyncThunk(
  "DOWNLOAD_GAP_RATING_BILLING",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      console.log("Download Gap Rating Billing");
      return null;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Download failed. ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const downloadGapPraBillingMaster = createAsyncThunk(
  "DOWNLOAD_GAP_PRABIL_MASTER",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      console.log("Download Gap Pra-Billing Master");
      return null;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Download failed. ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);


export const asyncDataMart = createAsyncThunk(
  "ASYNC_DATA_MART",
  async (_, thunkAPI) => {
    try {

      return new Promise((resolve) => {
        setTimeout(() => {
          const successBody = {
            title: "Successful",
            description: "Data Mart berhasil disinkronkan!",
            return: false,
          };
          thunkAPI.dispatch(showModalSuccess(successBody));
          resolve(null);
        }, 2000);
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Async Data Mart failed. ${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

const monitoringSlice = createSlice({
  name: "monitoring",
  initialState,
  reducers: {},
  extraReducers: {

    // Get List Billing Period
    [getListBillingPeriod.pending]: (state) => {
      state.loading = true;
    },
    [getListBillingPeriod.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_billing_period = action.payload;
    },
    [getListBillingPeriod.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update Investigation Flag
    [updateInvestigationFlag.pending]: (state) => {
      state.loading = true;
    },
    [updateInvestigationFlag.fulfilled]: (state) => {
      state.loading = false;
    },
    [updateInvestigationFlag.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get Summary Data
    [getSummaryData.pending]: (state) => {
      state.loading = true;
    },
    [getSummaryData.fulfilled]: (state, action) => {
      state.loading = false;
      state.summaryData = action.payload;
    },
    [getSummaryData.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Get Trend Data
    [getTrendData.pending]: (state) => {
      state.loading = true;
    },
    [getTrendData.fulfilled]: (state, action) => {
      state.loading = false;
      state.trendData = action.payload;
    },
    [getTrendData.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Get Priority List
    [getPriorityList.pending]: (state) => {
      state.loading = true;
    },
    [getPriorityList.fulfilled]: (state, action) => {
      state.loading = false;
      state.priorityList = action.payload;
    },
    [getPriorityList.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Get Pending Transactions
    [getPendingTransactions.pending]: (state) => {
      state.loading = true;
    },
    [getPendingTransactions.fulfilled]: (state, action) => {
      state.loading = false;
      state.pendingTransactionsData = action.payload;
    },
    [getPendingTransactions.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Get Pending Approvals
    [getPendingApprovals.pending]: (state) => {
      state.loading = true;
    },
    [getPendingApprovals.fulfilled]: (state, action) => {
      state.loading = false;
      state.pendingApprovalsData = action.payload;
    },
    [getPendingApprovals.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Get Gap Rating Billing
    [getGapRatingBilling.pending]: (state) => {
      state.loading = true;
    },
    [getGapRatingBilling.fulfilled]: (state, action) => {
      state.loading = false;
      state.gapRatingBillingData = action.payload;
    },
    [getGapRatingBilling.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Get Gap Pra-Billing Master
    [getGapPraBillingMaster.pending]: (state) => {
      state.loading = true;
    },
    [getGapPraBillingMaster.fulfilled]: (state, action) => {
      state.loading = false;
      state.gapPraBillingMasterData = action.payload;
    },
    [getGapPraBillingMaster.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Download Pending Transactions
    [downloadPendingTransactions.pending]: (state) => {
      state.loading = true;
    },
    [downloadPendingTransactions.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadPendingTransactions.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Download Pending Approvals
    [downloadPendingApprovals.pending]: (state) => {
      state.loading = true;
    },
    [downloadPendingApprovals.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadPendingApprovals.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Download Gap Rating Billing
    [downloadGapRatingBilling.pending]: (state) => {
      state.loading = true;
    },
    [downloadGapRatingBilling.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadGapRatingBilling.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Download Gap Pra-Billing Master
    [downloadGapPraBillingMaster.pending]: (state) => {
      state.loading = true;
    },
    [downloadGapPraBillingMaster.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadGapPraBillingMaster.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Async Data Mart
    [asyncDataMart.pending]: (state) => {
      state.loading = true;
    },
    [asyncDataMart.fulfilled]: (state) => {
      state.loading = false;
    },
    [asyncDataMart.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

const { reducer } = monitoringSlice;
export default reducer;