import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import {
  showModalSuccess,
  setBodyError,
  showModalError,
} from "../general_slice";

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

  // New: period LOV for the monitoring page dropdown
  periodLov: [],

  // New: consolidated KPI + chart data from dashboard-summary
  dashboardSummary: {
    totalSuccessRating: 0,
    totalFailedRating: 0,
    totPraBilling: 0,
    totRating: 0,
    totBilling: 0,
    needToRate: 0,
    needToBill: 0,
    totalDataChecked: 0,
    totalGapUsage: 0,
    totalGapPrice: 0,
    totalGapPromo: 0,
    grandTotalGap: 0,
    errMaster: 0,
    errPraBill: 0,
    errRating: 0,
    errBilling: 0,
    grandTotalError: 0,
    totMasterCustomer: 0,
    totSuccessCustomer: 0,
    volMasterUsage: 0,
    volRating: 0,
    volBilling: 0,
    totMasterData: 0,
    totProcessedData: 0,
    stageNotApprovedMaster: 0,
    stageNotApprovedPraBilling: 0,
    stageNotApprovedRating: 0,
    stageNotApprovedBilling: 0,
    stageNotApprovedTotal: 0,
  },

  // New: failed customers list (for Rating Failed & Billing Failed tabs)
  failedCustomers: {
    result: [],
    page: {
      totalElements: 0,
      totalPages: 0,
    },
  },

  // Anomalies pending approvals (MV_MONITORING_CUST_ANOMALIES_PENDING_APRV)
  anomaliesPendingAprvData: {
    result: [],
    page: {
      totalElements: 0,
      totalPages: 0,
    },
  },

  // Approval history list (MV_MONITORING_CUST_APPROVAL_HISTORY)
  approvalHistoryListData: {
    result: [],
    page: {
      totalElements: 0,
      totalPages: 0,
    },
  },

  // Approval history detail (MV_MONITORING_CUST_APPROVAL_HISTORY_DETAIL)
  approvalHistoryDetailData: [],

  // Pra-Billing vs Rating (MV_MONITORING_CUST_ANOMALIES_GAP_RAT_BILL)
  gapRatBillData: {
    result: [],
    page: {
      totalElements: 0,
      totalPages: 0,
    },
  },

  loadingKpi: false,
  loadingDashboard: false,
};

export const getSummaryData = createAsyncThunk(
  "GET_MONITORING_SUMMARY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/monitoringcustomer/summary`;
      const response = await ratingBillingHttpService.getAll(url);

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
            {
              date: "2025-09-14",
              pendingTransactions: 3,
              pendingApprovals: 2,
              gapRatingBilling: 5,
              gapPraBillingMaster: 4,
            },
            {
              date: "2025-09-15",
              pendingTransactions: 5,
              pendingApprovals: 3,
              gapRatingBilling: 4,
              gapPraBillingMaster: 6,
            },
            {
              date: "2025-09-16",
              pendingTransactions: 4,
              pendingApprovals: 1,
              gapRatingBilling: 6,
              gapPraBillingMaster: 5,
            },
            {
              date: "2025-09-17",
              pendingTransactions: 6,
              pendingApprovals: 4,
              gapRatingBilling: 3,
              gapPraBillingMaster: 7,
            },
            {
              date: "2025-09-18",
              pendingTransactions: 2,
              pendingApprovals: 2,
              gapRatingBilling: 5,
              gapPraBillingMaster: 4,
            },
            {
              date: "2025-09-19",
              pendingTransactions: 5,
              pendingApprovals: 5,
              gapRatingBilling: 2,
              gapPraBillingMaster: 3,
            },
            {
              date: "2025-09-20",
              pendingTransactions: 5,
              pendingApprovals: 3,
              gapRatingBilling: 4,
              gapPraBillingMaster: 6,
            },
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
  async (period, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/monitoringcustomer/anomalies-top5?period=${period}`;
      const response = await ratingBillingHttpService.getAll(url);

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
  async ({ period, search, page, pageSize, sort, accountNumber }, thunkAPI) => {
    try {
      const acctParam = accountNumber ? `&accountNumber=${accountNumber}` : "";
      const url = `/v1/dbs/api/monitoringcustomer/mv-pending-transactions?period=${period}&size=${pageSize}&page=${page}${acctParam}`;
      const response = await ratingBillingHttpService.getPagination(url);
      const pageData = response?.data ?? {};
      const content = pageData.content ?? [];

      return {
        result: content.map((item) => ({
          id: item.customerId,
          customerId: item.customerId,
          name: item.name || "-",
          address: item.address || "-",
          type: item.type || "-",
          period: item.rawPeriod,
          volume: item.volumeM3,
          receivedAt: item.receivedAt || "-",
          accountNumber: item.accountNumber,
        })),
        page: {
          totalElements: pageData.totalElements ?? content.length,
          totalPages: pageData.totalPages ?? 1,
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
      const response = await ratingBillingHttpService.createData(url, body);

      const successBody = {
        title: "Successful",
        description:
          response?.message || "Investigation flag updated successfully",
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
      const response = await ratingBillingHttpService.getPagination(url);

      return {
        result: response.data.content.map((item) => ({
          id: item.id,
          batchId: `BATCH-${item.id}`,
          billingPeriod: item.billingPeriod,
          accountNumber: item.accountNum,
          totalCustomers: null,
          estimatedAmount: item.estimatedAmount,
          createdBy: item.createdBy,
          createdAt: item.createdAt
            ? new Date(item.createdAt).toLocaleString("id-ID")
            : "-",
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
  async ({ period, page, pageSize, accountNumber }, thunkAPI) => {
    try {
      const acctParam = accountNumber ? `&accountNumber=${accountNumber}` : "";
      const url = `/v1/dbs/api/monitoringcustomer/mv-gap-rating-billing?period=${period}&size=${pageSize}&page=${page}${acctParam}`;
      const response = await ratingBillingHttpService.getPagination(url);
      const pageData = response?.data ?? {};
      const content = pageData.content ?? [];

      return {
        result: content.map((item) => ({
          id: item.accountNumber || item.logId,
          accountNumber: item.accountNumber,
          customerName: item.name || "-",
          billingPeriod: item.rawPeriod,
          ratingCode: item.ratingCode || "-",
          ratingValue: item.ratingValue,
          billingCode: item.billingCode || "-",
          billingValue: item.billingValue,
          gap: item.gap,
          gapPercentage:
            item.ratingValue && item.billingValue
              ? ((item.gap / item.ratingValue) * 100).toFixed(2)
              : 0,
        })),
        page: {
          totalElements: pageData.totalElements ?? content.length,
          totalPages: pageData.totalPages ?? 1,
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
  async ({ period, page, pageSize, accountNumber }, thunkAPI) => {
    try {
      const acctParam = accountNumber ? `&accountNumber=${accountNumber}` : "";
      const url = `/v1/dbs/api/monitoringcustomer/mv-gap-prabilling-master?period=${period}&size=${pageSize}&page=${page}${acctParam}`;
      const response = await ratingBillingHttpService.getPagination(url);
      const pageData = response?.data ?? {};
      const content = pageData.content ?? [];

      return {
        result: content.map((item) => ({
          id: item.logId,
          customerId: item.customerId,
          name: item.name || "-",
          billingPeriod: item.rawPeriod,
          fieldMismatch: item.fieldMismatch || "-",
          praBillingValue: item.praBillingValue || "-",
          masterValue: "-",
        })),
        page: {
          totalElements: pageData.totalElements ?? content.length,
          totalPages: pageData.totalPages ?? 1,
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

export const downloadPendingTransactions = createAsyncThunk(
  "DOWNLOAD_PENDING_TRANSACTIONS",
  async ({ period, accountNumber }, thunkAPI) => {
    try {
      const acctParam = accountNumber ? `&accountNumber=${accountNumber}` : "";
      const url = `/v1/dbs/api/monitoringcustomer/download-pending-transactions?period=${period}${acctParam}`;
      const response = await ratingBillingHttpService.downloadXlsx(url);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(
        showModalError({ title: "Failed", description: `Download gagal. ${message}` })
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const downloadPendingApprovals = createAsyncThunk(
  "DOWNLOAD_PENDING_APPROVALS",
  async ({ search } = {}, thunkAPI) => {
    try {
      const searchParam = search || "";
      const url = `/v1/dbs/api/monitoringcustomer/download-pending-approvals?search=${searchParam}`;
      const response = await ratingBillingHttpService.downloadXlsx(url);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(
        showModalError({ title: "Failed", description: `Download gagal. ${message}` })
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const downloadGapRatingBilling = createAsyncThunk(
  "DOWNLOAD_GAP_RATING_BILLING",
  async ({ period, accountNumber }, thunkAPI) => {
    try {
      const acctParam = accountNumber ? `&accountNumber=${accountNumber}` : "";
      const url = `/v1/dbs/api/monitoringcustomer/download-gap-rating-billing?period=${period}${acctParam}`;
      const response = await ratingBillingHttpService.downloadXlsx(url);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(
        showModalError({ title: "Failed", description: `Download gagal. ${message}` })
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const downloadGapPraBillingMaster = createAsyncThunk(
  "DOWNLOAD_GAP_PRABIL_MASTER",
  async ({ period, accountNumber }, thunkAPI) => {
    try {
      const acctParam = accountNumber ? `&accountNumber=${accountNumber}` : "";
      const url = `/v1/dbs/api/monitoringcustomer/download-gap-prabilling-master?period=${period}${acctParam}`;
      const response = await ratingBillingHttpService.downloadXlsx(url);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(
        showModalError({ title: "Failed", description: `Download gagal. ${message}` })
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const downloadGapRatBill = createAsyncThunk(
  "DOWNLOAD_GAP_RAT_BILL",
  async ({ period, accountNumber }, thunkAPI) => {
    try {
      const acctParam = accountNumber ? `&accountNumber=${accountNumber}` : "";
      const url = `/v1/dbs/api/monitoringcustomer/download-gap-rat-bill?period=${period}${acctParam}`;
      const response = await ratingBillingHttpService.downloadXlsx(url);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(
        showModalError({ title: "Failed", description: `Download gagal. ${message}` })
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const syncGapPraBillingMaster = createAsyncThunk(
  "SYNC_GAP_PRABIL_MASTER",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/monitoringcustomer/refresh-gap-prabilling-master`;
      const response = await ratingBillingHttpService.createData(url, {});
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
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
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

export const getParameters = createAsyncThunk(
  "GET_MONITORING_PARAMETERS",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/monitoringcustomer/parameters`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.periods ?? [];
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getDashboardSummary = createAsyncThunk(
  "GET_MONITORING_DASHBOARD_SUMMARY",
  async (period, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/monitoringcustomer/dashboard-summary?period=${period}`;
      const response = await ratingBillingHttpService.getAll(url);
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
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getFailedCustomers = createAsyncThunk(
  "GET_FAILED_CUSTOMERS",
  async ({ period, page = 0, size = 10 }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/monitoringcustomer/failed-customers?period=${period}&page=${page}&size=${size}`;
      const response = await ratingBillingHttpService.getAll(url);
      const content = response.data?.content ?? [];
      return {
        result: content.map((item) => ({
          no: item.no,
          accountNumber: item.accountNumber ?? "-",
          accountName: item.accountName ?? "-",
          customerNumber: item.customerNumber ?? "-",
          customerName: item.customerName ?? "-",
          customerType: item.customerType ?? "-",
          sor: item.sor ?? "-",
          costCenter: item.costCenter ?? "-",
          meterReadingCode: item.meterReadingCode ?? "-",
          accountSegment: item.accountSegment ?? "-",
          accountGroupType: item.accountGroupType ?? "-",
          category: item.category ?? "-",
          classificationType: item.classificationType ?? "-",
          accountType: item.accountType ?? "-",
          message: item.message ?? "-",
          status: item.status ?? "Failed",
          failPhase: item.failPhase ?? "-",
        })),
        page: {
          totalElements: response.data?.totalElements ?? 0,
          totalPages: response.data?.totalPages ?? 0,
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
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getAnomaliesPendingAprv = createAsyncThunk(
  "GET_ANOMALIES_PENDING_APRV",
  async ({ period, accountNumber, page, pageSize }, thunkAPI) => {
    try {
      const apiPage = page - 1;
      const url = `/v1/dbs/api/monitoringcustomer/mv-anomalies-pending-aprv?period=${period}&accountNumber=${accountNumber}&page=${apiPage}&size=${pageSize}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return {
        result: response.data.content.map((item) => ({
          appId: item.appId,
          customerId: item.customerId ?? "-",
          billing: item.billing ?? "-",
          periodStr: item.periodStr ?? "-",
          rawPeriodYyyymm: item.rawPeriodYyyymm ?? "-",
          accountNumber: item.accountNumber ?? "-",
          estAmount: item.estAmount ?? null,
          createdBy: item.createdBy ?? "-",
          createdAt: item.createdAt ?? "-",
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
        thunkAPI.dispatch(
          showModalError({ title: "Failed", description: `${message}` })
        );
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getApprovalHistoryList = createAsyncThunk(
  "GET_APPROVAL_HISTORY_LIST",
  async ({ period, search, page, pageSize }, thunkAPI) => {
    try {
      const searchParams = search || "";
      const apiPage = page - 1;
      const url = `/v1/dbs/api/monitoringcustomer/list-approval-history?period=${period}&page=${apiPage}&size=${pageSize}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return {
        result: response.data.content.map((item) => ({
          appId: item.appId,
          billingCode: item.billingCode ?? "-",
          accountNumber: item.accountNumber ?? "-",
          customerName: item.customerName ?? "-",
          invoiceNumber: item.invoiceNumber ?? "-",
          currentDocStatus: item.currentDocStatus ?? "-",
          actionType: item.actionType ?? "-",
          actionByName: item.actionByName ?? "-",
          actionByPosition: item.actionByPosition ?? "-",
          actionDate: item.actionDate ?? "-",
          notes: item.notes ?? "-",
          billingPeriodStr: item.billingPeriodStr ?? "-",
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
        thunkAPI.dispatch(
          showModalError({ title: "Failed", description: `${message}` })
        );
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getGapRatBill = createAsyncThunk(
  "GET_GAP_RAT_BILL",
  async ({ period, page, pageSize, accountNumber }, thunkAPI) => {
    try {
      const acctParam = accountNumber ? `&accountNumber=${accountNumber}` : "";
      const url = `/v1/dbs/api/monitoringcustomer/mv-gap-rat-bill?period=${period}&size=${pageSize}&page=${page}${acctParam}`;
      const response = await ratingBillingHttpService.getPagination(url);
      const pageData = response?.data ?? {};
      const content = pageData.content ?? [];

      return {
        result: content.map((item) => ({
          id: item.accountNumber,
          accountNumber: item.accountNumber,
          name: item.name || "-",
          initCode: item.initCode || "-",
          billingPeriod: item.rawPeriod || "-",
          ratingCode: item.ratingCode || "-",
          ratingValue: item.ratingValue,
          gap: item.gap,
        })),
        page: {
          totalElements: pageData.totalElements ?? content.length,
          totalPages: pageData.totalPages ?? 1,
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

export const getApprovalHistoryDetail = createAsyncThunk(
  "GET_APPROVAL_HISTORY_DETAIL",
  async ({ appId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/monitoringcustomer/approval-history-detail?appId=${appId}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data ?? [];
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(
        showModalError({ title: "Failed", description: `${message}` })
      );
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

    // Download Gap Rat Bill (Pra-Billing vs Rating)
    [downloadGapRatBill.pending]: (state) => {
      state.loading = true;
    },
    [downloadGapRatBill.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadGapRatBill.rejected]: (state, action) => {
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

    // Get Parameters (period LOV)
    [getParameters.pending]: (state) => {
      state.loadingKpi = true;
    },
    [getParameters.fulfilled]: (state, action) => {
      state.loadingKpi = false;
      state.periodLov = action.payload ?? [];
    },
    [getParameters.rejected]: (state) => {
      state.loadingKpi = false;
    },

    // Get Dashboard Summary
    [getDashboardSummary.pending]: (state) => {
      state.loadingKpi = true;
      state.loadingDashboard = true;
    },
    [getDashboardSummary.fulfilled]: (state, action) => {
      state.loadingKpi = false;
      state.loadingDashboard = false;
      if (action.payload) {
        state.dashboardSummary = action.payload;
      }
    },
    [getDashboardSummary.rejected]: (state) => {
      state.loadingKpi = false;
      state.loadingDashboard = false;
    },

    // Get Failed Customers
    [getFailedCustomers.pending]: (state) => {
      state.loadingKpi = true;
    },
    [getFailedCustomers.fulfilled]: (state, action) => {
      state.loadingKpi = false;
      state.failedCustomers = action.payload;
    },
    [getFailedCustomers.rejected]: (state) => {
      state.loadingKpi = false;
    },

    // Get Anomalies Pending Approvals
    [getAnomaliesPendingAprv.pending]: (state) => {
      state.loading = true;
    },
    [getAnomaliesPendingAprv.fulfilled]: (state, action) => {
      state.loading = false;
      state.anomaliesPendingAprvData = action.payload;
    },
    [getAnomaliesPendingAprv.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get Approval History List
    [getApprovalHistoryList.pending]: (state) => {
      state.loading = true;
    },
    [getApprovalHistoryList.fulfilled]: (state, action) => {
      state.loading = false;
      state.approvalHistoryListData = action.payload;
    },
    [getApprovalHistoryList.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get Gap Rat Bill (MV_MONITORING_CUST_ANOMALIES_GAP_RAT_BILL)
    [getGapRatBill.pending]: (state) => {
      state.loading = true;
    },
    [getGapRatBill.fulfilled]: (state, action) => {
      state.loading = false;
      state.gapRatBillData = action.payload;
    },
    [getGapRatBill.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get Approval History Detail
    [getApprovalHistoryDetail.pending]: (state) => {
      state.loading = true;
    },
    [getApprovalHistoryDetail.fulfilled]: (state, action) => {
      state.loading = false;
      state.approvalHistoryDetailData = action.payload;
    },
    [getApprovalHistoryDetail.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

const { reducer } = monitoringSlice;
export default reducer;
