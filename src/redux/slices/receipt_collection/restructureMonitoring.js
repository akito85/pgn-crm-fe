import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";

const initialState = {
  periods: [],
  kpiData: [],
  chartData: null,
  statusDistribution: [],
  detailData: {
    result: [],
    page: { number: 0, size: 10, totalElements: 0, totalPages: 0 }
  },
  yearData: [],
  monthData: [],
  
  loadingPeriods: false,
  loadingKpi: false,
  loadingChart: false,
  loadingStatus: false,
  loadingDetail: false,
  loadingYear: false,
  loadingMonth: false,
};

export const fetchPeriods = createAsyncThunk(
  "restructureMonitoring/fetchPeriods",
  async (_, { rejectWithValue }) => {
    try {
      const response = await receiptCollectionHttpService.getAll("/v1/dbs/api/restructure-monitoring/periods");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch periods");
    }
  }
);

export const fetchKpi = createAsyncThunk(
  "restructureMonitoring/fetchKpi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await receiptCollectionHttpService.getAll("/v1/dbs/api/restructure-monitoring/kpi");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch KPI");
    }
  }
);

export const fetchChart = createAsyncThunk(
  "restructureMonitoring/fetchChart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await receiptCollectionHttpService.getAll("/v1/dbs/api/restructure-monitoring/chart");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch Chart");
    }
  }
);

export const fetchStatusDistribution = createAsyncThunk(
  "restructureMonitoring/fetchStatusDistribution",
  async (_, { rejectWithValue }) => {
    try {
      const response = await receiptCollectionHttpService.getAll("/v1/dbs/api/restructure-monitoring/status-distribution");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch Status Distribution");
    }
  }
);

export const fetchDetailList = createAsyncThunk(
  "restructureMonitoring/fetchDetailList",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await receiptCollectionHttpService.createData("/v1/dbs/api/restructure-monitoring/detail-list", payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch Detail List");
    }
  }
);

export const fetchYearList = createAsyncThunk(
  "restructureMonitoring/fetchYearList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await receiptCollectionHttpService.getAll("/v1/dbs/api/restructure-monitoring/year-list");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch Year List");
    }
  }
);

export const fetchMonthList = createAsyncThunk(
  "restructureMonitoring/fetchMonthList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await receiptCollectionHttpService.getAll("/v1/dbs/api/restructure-monitoring/month-list");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch Month List");
    }
  }
);

export const downloadDetailList = createAsyncThunk(
  "restructureMonitoring/downloadDetailList",
  async (payload, { rejectWithValue }) => {
    try {
      const searchParams = payload?.searchs ? encodeURIComponent(payload.searchs) : "";
      const sortValue = payload?.sort ? payload.sort : "id~desc";
      const url = `/v1/dbs/api/restructure-monitoring/download-detail?searchs=${searchParams}&sort=${sortValue}`;
      const response = await receiptCollectionHttpService.downloadXlsx(url, "restructure_detail_monitoring");
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to download detail list");
    }
  }
);

export const downloadYearList = createAsyncThunk(
  "restructureMonitoring/downloadYearList",
  async (payload, { rejectWithValue }) => {
    try {
      const url = `/v1/dbs/api/restructure-monitoring/download-year`;
      const response = await receiptCollectionHttpService.downloadXlsx(url, "restructure_year_monitoring");
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to download year list");
    }
  }
);

export const downloadMonthList = createAsyncThunk(
  "restructureMonitoring/downloadMonthList",
  async (payload, { rejectWithValue }) => {
    try {
      const url = `/v1/dbs/api/restructure-monitoring/download-month`;
      const response = await receiptCollectionHttpService.downloadXlsx(url, "restructure_month_monitoring");
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to download month list");
    }
  }
);

const restructureMonitoringSlice = createSlice({
  name: "restructureMonitoring",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Periods
      .addCase(fetchPeriods.pending, (state) => { state.loadingPeriods = true; })
      .addCase(fetchPeriods.fulfilled, (state, action) => {
        state.loadingPeriods = false;
        state.periods = action.payload || [];
      })
      .addCase(fetchPeriods.rejected, (state) => { state.loadingPeriods = false; })
      
      // KPI
      .addCase(fetchKpi.pending, (state) => { state.loadingKpi = true; })
      .addCase(fetchKpi.fulfilled, (state, action) => {
        state.loadingKpi = false;
        state.kpiData = action.payload || [];
      })
      .addCase(fetchKpi.rejected, (state) => { state.loadingKpi = false; })
      
      // Chart
      .addCase(fetchChart.pending, (state) => { state.loadingChart = true; })
      .addCase(fetchChart.fulfilled, (state, action) => {
        state.loadingChart = false;
        state.chartData = action.payload || {};
      })
      .addCase(fetchChart.rejected, (state) => { state.loadingChart = false; })
      
      // Status Distribution
      .addCase(fetchStatusDistribution.pending, (state) => { state.loadingStatus = true; })
      .addCase(fetchStatusDistribution.fulfilled, (state, action) => {
        state.loadingStatus = false;
        state.statusDistribution = action.payload || [];
      })
      .addCase(fetchStatusDistribution.rejected, (state) => { state.loadingStatus = false; })
      
      // Detail List
      .addCase(fetchDetailList.pending, (state) => { state.loadingDetail = true; })
      .addCase(fetchDetailList.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.detailData = action.payload || { result: [], page: {} };
      })
      .addCase(fetchDetailList.rejected, (state) => { state.loadingDetail = false; })
      
      // Year List
      .addCase(fetchYearList.pending, (state) => { state.loadingYear = true; })
      .addCase(fetchYearList.fulfilled, (state, action) => {
        state.loadingYear = false;
        state.yearData = action.payload || [];
      })
      .addCase(fetchYearList.rejected, (state) => { state.loadingYear = false; })
      
      // Month List
      .addCase(fetchMonthList.pending, (state) => { state.loadingMonth = true; })
      .addCase(fetchMonthList.fulfilled, (state, action) => {
        state.loadingMonth = false;
        state.monthData = action.payload || [];
      })
      .addCase(fetchMonthList.rejected, (state) => { state.loadingMonth = false; });
  },
});

export default restructureMonitoringSlice.reducer;
