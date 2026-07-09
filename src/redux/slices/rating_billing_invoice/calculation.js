import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import {
  showModalSuccess,
  setBodyError,
  showModalError,
  validateError,
} from "../general_slice";

const initialState = {
  data: [],
  loading: false,
  loadingResult: false,
  loadingLog: false,
  loadingCreate: false,
  loadingModal: false,
  list_sor: [],
  list_service_type: [],
  list_account_group: [],
  list_customer_segment: [],
  list_calculation_type: [],
  list_scheduler_type: [],
  list_cost_center: [],
  list_meter_reading_code: [],
  list_specific_customer: [],
  list_billing_cycle: [],
  list_billing_period: [],
  detail_calculation_job: null,
  list_calculation_log: [],
  list_calculation_logp: [],
  list_calculation_result: [],
  list_calculation_no_paging: [],
  data_user_calculation: {},
  filters: {
    calculation_list: {
      search: {},
      sort: "",
      searchText: "",
      searchedColumn: "",
      page: 1,
    },
    calculation_history: {
      search: {},
      sort: "",
      searchText: "",
      searchedColumn: "",
      page: 1,
    },
  },
};

// pagination slice
export const getCalculationPaginate = createAsyncThunk(
  "GET_CALCULATION_PAGINATE",
  async ({ search, page, pageSize, sort, isLoadMore = false }, thunkAPI) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "generateDate~desc";
      const url = `/v1/dbs/api/rbi/calculation/list-calculationjob?sort=${sortParams}&size=${pageSize}&page=${page}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);

      // Return data dengan flag isLoadMore
      return {
        ...response.data,
        isLoadMore, // Pass the flag to reducer
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
      return error;
    }
  }
);
// pagination history
export const getHistoryCalculationPaginate = createAsyncThunk(
  "GET_HISTORY_CALCULATION_PAGINATE",
  async ({ search, page, pageSize, sort, isLoadMore = false }, thunkAPI) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "resultId~desc";
      const url = `/v1/dbs/api/rbi/calculation/list-calculationhistory?sort=${sortParams}&size=${pageSize}&page=${page}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);

      // Return data dengan flag isLoadMore
      return {
        ...response.data,
        isLoadMore, // Pass the flag to reducer
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
      return error;
    }
  }
);
// pagination Log
export const getCalculateLogPaginate = createAsyncThunk(
  "GET_CALCULATE_LOG_PAGINATE",
  async (
    { search, page, pageSize, sort, calCode, isLoadMore = false },
    thunkAPI
  ) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "logId~desc";
      const url = `/v1/dbs/api/rbi/calculation/list-calculatelog?sort=${sortParams}&size=${pageSize}&page=${page}&searchs=${searchParams}&calCode=${calCode}`;
      const response = await ratingBillingHttpService.getPagination(url);

      return {
        ...response.data,
        isLoadMore, // Pass the flag to reducer
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
      return error;
    }
  }
);

// downlaod slice
export const donwloadedExcel = createAsyncThunk(
  "DOWNLOAD_CALCULATION_EXCEL",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "generateDate~desc";
      const url = `/v1/dbs/api/rbi/calculation/download-filter?size=${pageSize}&page=${page}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_CALCULATION_EXCEL",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const donwloadedHistoryExcel = createAsyncThunk(
  "DOWNLOAD_CALCULATION_HISTORY_EXCEL",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "createdDate~desc";
      const url = `/v1/dbs/api/rbi/calculation/download-filter-history?size=${pageSize}&page=${page}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_CALCULATION_HISTORY_EXCEL",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// get lov slice
export const getListSor = createAsyncThunk("GET_LIST_SOR", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/rbi/calculation/sor?ccType=SOR`;
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
      const errorBody = {
        title: "Failed",
        description: `${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
    }
    return error;
  }
});

export const getListServiceType = createAsyncThunk(
  "GET_LIST_SERVICE_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/servicetype`;
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
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return error;
    }
  }
);

export const getListAccountGroup = createAsyncThunk(
  "GET_LIST_ACCOUNT_GROUP",
  async (segmentIds, thunkAPI) => {
    try {
      let queryParams = "";
      if (segmentIds && Array.isArray(segmentIds) && segmentIds.length > 0) {
        queryParams = segmentIds.map((id) => `idSegment=${id}`).join("&");
      }

      const url = `/v1/dbs/api/account-group-type/list${
        queryParams ? `?${queryParams}` : ""
      }`;

      const response = await ratingBillingHttpService.getAll(url);

      const accountGroups = Array.isArray(response)
        ? response
        : Array.isArray(response.data)
        ? response.data
        : [];

      return accountGroups;
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
export const getListCustomerSegment = createAsyncThunk(
  "GET_LIST_CUSTOMER_SEGMENT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/accountsegment`;
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
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return error;
    }
  }
);
export const getListCalculationType = createAsyncThunk(
  "GET_LIST_CALCULATION_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/calculationtype`;
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
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return error;
    }
  }
);
export const getListSchedulerType = createAsyncThunk(
  "GET_LIST_SCHEDULER_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/schedulertype`;
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
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return error;
    }
  }
);
export const getListCostCenter = createAsyncThunk(
  "GET_LIST_COST_CENTER",
  async (sorId, thunkAPI) => {
    try {
      const url = sorId
        ? `/v1/dbs/api/rbi/calculation/costcenter?sorId=${sorId}`
        : `/v1/dbs/api/rbi/calculation/costcenter`;
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
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return error;
    }
  }
);
export const getListMeterReadingCode = createAsyncThunk(
  "GET_LIST_METER_READING_CODE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/meterreadingcode`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body
      );
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
      return error;
    }
  }
);
export const getListSpecificCustomer = createAsyncThunk(
  "GET_LIST_SPECIFIC_CUSTOMER",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/customer-accounts`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body
      );
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);
export const getListBillingCycle = createAsyncThunk(
  "GET_LIST_BILLING_CYCLE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing-cycle/list`;
      const response = await ratingBillingHttpService.getAll(url);

      const rawData = response?.body?.data?.data || response?.data?.data || [];

      const transformedData = rawData.map((item) => ({
        id: item.id,
        name: item.name,
        ...item,
      }));

      return transformedData;
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
  "GET_LIST_BILLING_PERIOD",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/billingperiod/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
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
      return error;
    }
  }
);

export const getUserDetailCalculation = createAsyncThunk(
  "GET_USER_DETAIL_CALCULATION_JOB",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/user-detail`;
      const response = await ratingBillingHttpService.getDetail(url);
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
      return error;
    }
  }
);

// create calculation slice
export const createCalculation = createAsyncThunk(
  "CREATE_CALCULATION",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/test-create `;
      const response = await ratingBillingHttpService.createData(url, body);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error?.response?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not created. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error.response.data);
      }
    }
  }
);

// detail calulation slice
export const getDetailCalculationJob = createAsyncThunk(
  "GET_DETAIL_CALCULATION_JOB",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/list-detailcalculation/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
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
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// detail calculation log
export const getDetailCalculationLog = createAsyncThunk(
  "GET_DETAIL_CALCULATION_LOG",
  async (
    { calCode, search, page, pageSize, sort, isLoadMore = false },
    thunkAPI
  ) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rbi/calculation/list-detailcalculationlog?sort=${sortParams}&size=${pageSize}&page=${page}&searchs=${searchParams}&calCode=${calCode}`;
      const response = await ratingBillingHttpService.getListPagination(url);

      return {
        ...response.data,
        isLoadMore, // Pass the flag to reducer
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
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// detail calcultaion result
export const getDetailCalculationResult = createAsyncThunk(
  "GET_DETAIL_CALCULATION_RESULT",
  async (
    { calCode, calType, search, page, pageSize, sort, isLoadMore = false },
    thunkAPI
  ) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rbi/calculation/list-detailcalculationresult?calCode=${calCode}&calType=${calType}&sort=${sortParams}&page=${page}&size=${pageSize}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);

      return {
        ...response.data,
        isLoadMore, // Pass the flag to reducer
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
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
// detail calcultaion result no paging
export const getDetailCalculationResultNoPaging = createAsyncThunk(
  "GET_DETAIL_CALCULATION_LOG_NO_PAGING",
  async ({ calCode, calType }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/list-detailresultrecalculate`;
      const params = { calCode, calType };
      const response = await ratingBillingHttpService.getListPagination(
        url,
        params
      );
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
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

//recalculate di detail
export const recalculateData = createAsyncThunk(
  "RECALCULATE_DATA_DETAIL",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/calculation/recalculate";
      const response = await ratingBillingHttpService.createData(url, body);
      const messsage = response?.message;
      const successBody = {
        title: "Successful",
        description: `${messsage}`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error?.response?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not recalculated. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error.response.data);
      }
    }
  }
);

//retry data calculate
export const retryData = createAsyncThunk(
  "RETRTY_DATA",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/calculation/retry";
      const response = await ratingBillingHttpService.createData(url, body);
      const messsage = response?.message;
      const successBody = {
        title: "Successful",
        description: `${messsage}`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error?.response?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not retried. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error.response.data);
      }
    }
  }
);

const calculationSlice = createSlice({
  name: "calculation",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      const { tab, filters } = action.payload;
      state.filters[tab] = { ...state.filters[tab], ...filters };
    },
    clearFilters: (state, action) => {
      const { tab } = action.payload;
      state.filters[tab] = {
        search: {},
        sort: "",
        searchText: "",
        searchedColumn: "",
        page: 1,
      };
    },
    resetCalculationData: (state) => {
      state.data = [];
    },
  },
  extraReducers: {
    [getCalculationPaginate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getCalculationPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      const isLoadMore = action.payload.isLoadMore;
      const newResult = action.payload?.result || [];

      if (isLoadMore) {
        const existingIds = new Set(
          (state.data?.result || []).map((item) => item.calJobId)
        );
        const uniqueNewData = newResult.filter(
          (item) => !existingIds.has(item.calJobId)
        );
        state.data = {
          ...action.payload,
          result: [...(state.data?.result || []), ...uniqueNewData],
        };
      } else {
        state.data = action.payload;
      }
    },
    [getCalculationPaginate.rejected]: (state, action) => {
      state.loading = false;
      if (!action.meta.arg?.isLoadMore) {
        state.data = [];
      }
    },
    [getHistoryCalculationPaginate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getHistoryCalculationPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      const isLoadMore = action.payload.isLoadMore;
      const newResult = action.payload?.result || [];

      if (isLoadMore) {
        const existingIds = new Set(
          (state.data?.result || []).map((item) => item.resultId)
        );
        const uniqueNewData = newResult.filter(
          (item) => !existingIds.has(item.resultId)
        );
        state.data = {
          ...action.payload,
          result: [...(state.data?.result || []), ...uniqueNewData],
        };
      } else {
        state.data = action.payload;
      }
    },
    [getHistoryCalculationPaginate.rejected]: (state, action) => {
      state.loading = false;
      if (!action.meta.arg?.isLoadMore) {
        state.data = [];
      }
    },
    [getCalculateLogPaginate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getCalculateLogPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      const newData = action.payload.result || [];
      const isLoadMore = action.payload.isLoadMore;

      // If it's load more, append data. Otherwise, replace data
      if (isLoadMore) {
        state.list_calculation_logp = {
          result: [...(state.list_calculation_logp?.result || []), ...newData],
          page: action.payload.page || {
            size: 10,
            totalElements: 0,
            totalPages: 0,
            number: 0,
          },
        };
      } else {
        state.list_calculation_logp = {
          result: newData,
          page: action.payload.page || {
            size: 10,
            totalElements: 0,
            totalPages: 0,
            number: 0,
          },
        };
      }
    },
    [getCalculateLogPaginate.rejected]: (state, action) => {
      state.loading = false;
      // Only clear data on initial fetch failure, not on load more failure
      if (!action.meta.arg?.isLoadMore) {
        state.list_calculation_logp = {
          result: [],
          page: {
            size: 10,
            totalElements: 0,
            totalPages: 0,
            number: 0,
          },
        };
      }
    },
    // download excel
    [donwloadedExcel.pending]: (state) => {
      state.loading = true;
    },
    [donwloadedExcel.fulfilled]: (state) => {
      state.loading = false;
      // state.data = action.payload;
    },
    [donwloadedExcel.rejected]: (state) => {
      state.loading = false;
    },
    // download excel
    [donwloadedHistoryExcel.pending]: (state) => {
      state.loading = true;
    },
    [donwloadedHistoryExcel.fulfilled]: (state) => {
      state.loading = false;
      // state.data = action.payload;
    },
    [donwloadedHistoryExcel.rejected]: (state) => {
      state.loading = false;
    },
    // lov sor
    [getListSor.pending]: (state) => {
      state.loading = true;
    },
    [getListSor.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_sor = action.payload;
    },
    [getListSor.rejected]: (state) => {
      state.loading = false;
    },
    // lov service type
    [getListServiceType.pending]: (state) => {
      state.loading = true;
    },
    [getListServiceType.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_service_type = action.payload;
    },
    [getListServiceType.rejected]: (state) => {
      state.loading = false;
    },
    // lov scheduler type
    [getListSchedulerType.pending]: (state) => {
      state.loading = true;
    },
    [getListSchedulerType.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_scheduler_type = action.payload;
    },
    [getListSchedulerType.rejected]: (state) => {
      state.loading = false;
    },
    // lov meter reading code
    [getListMeterReadingCode.pending]: (state) => {
      state.loading = true;
    },
    [getListMeterReadingCode.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_meter_reading_code = action.payload;
    },
    [getListMeterReadingCode.rejected]: (state) => {
      state.loading = false;
    },
    // lov customer segment
    [getListCustomerSegment.pending]: (state) => {
      state.loading = true;
    },
    [getListCustomerSegment.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_customer_segment = action.payload;
    },
    [getListCustomerSegment.rejected]: (state) => {
      state.loading = false;
    },
    // lov cost center
    [getListCostCenter.pending]: (state) => {
      state.loading = true;
    },
    [getListCostCenter.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_cost_center = action.payload;
    },
    [getListCostCenter.rejected]: (state) => {
      state.loading = false;
    },
    // lov calculation type
    [getListCalculationType.pending]: (state) => {
      state.loading = true;
    },
    [getListCalculationType.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_calculation_type = action.payload;
    },
    [getListCalculationType.rejected]: (state) => {
      state.loading = false;
    },
    // lov account group
    [getListAccountGroup.pending]: (state) => {
      state.loading = true;
      state.list_account_group = [];
    },
    [getListAccountGroup.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_account_group = action.payload || [];
    },
    [getListAccountGroup.rejected]: (state) => {
      state.loading = false;
      state.list_account_group = [];
    },
    // lov specific customer
    [getListSpecificCustomer.pending]: (state) => {
      state.loading_specific_customer = true;
    },
    [getListSpecificCustomer.fulfilled]: (state, action) => {
      state.loading_specific_customer = false;
      const responseData = action.payload?.data || action.payload || [];
      state.list_specific_customer = Array.isArray(responseData)
        ? responseData
        : [];
      state.specific_customer_message = action.payload?.message || "";
    },
    [getListSpecificCustomer.rejected]: (state) => {
      state.loading_specific_customer = false;
      state.list_specific_customer = [];
      state.specific_customer_message = "";
    },
    // lov billing cycle
    [getListBillingCycle.pending]: (state) => {
      state.loading = true;
    },
    [getListBillingCycle.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_billing_cycle = action.payload;
    },
    [getListBillingCycle.rejected]: (state) => {
      state.loading = false;
      state.list_billing_cycle = [];
    },
    //get detail calculatin result
    [getDetailCalculationResult.pending]: (state, action) => {
      // Hanya show loading saat initial fetch
      if (!action.meta.arg?.isLoadMore) {
        state.loadingResult = true;
      }
    },
    [getDetailCalculationResult.fulfilled]: (state, action) => {
      state.loadingResult = false;
      const isLoadMore = action.payload.isLoadMore;
      const newResult = action.payload?.result || [];

      if (isLoadMore) {
        // Append new data
        state.list_calculation_result = {
          ...action.payload,
          result: [
            ...(state.list_calculation_result?.result || []),
            ...newResult,
          ],
        };
      } else {
        // Replace with new data
        state.list_calculation_result = action.payload;
      }
    },
    [getDetailCalculationResult.rejected]: (state, action) => {
      state.loadingResult = false;
      // Jangan clear data saat load more gagal
      if (!action.meta.arg?.isLoadMore) {
        state.list_calculation_result = { result: [], page: {} };
      }
    },
    // lov billing period
    [getListBillingPeriod.pending]: (state) => {
      state.loading = true;
    },
    [getListBillingPeriod.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_billing_period = action.payload;
    },
    [getListBillingPeriod.rejected]: (state) => {
      state.loading = false;
    },
    // lov user detail calculation
    [getUserDetailCalculation.pending]: (state) => {
      state.loading = true;
    },
    [getUserDetailCalculation.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_user_calculation = action.payload;
    },
    [getUserDetailCalculation.rejected]: (state) => {
      state.loading = false;
    },

    // create calculation
    [createCalculation.pending]: (state) => {
      state.loadingCreate = true;
    },
    [createCalculation.fulfilled]: (state, action) => {
      state.loadingCreate = false;
      state.data = action.payload;
    },
    [createCalculation.rejected]: (state) => {
      state.loadingCreate = false;
    },
    // get detail calculation job
    [getDetailCalculationJob.pending]: (state) => {
      state.loading = true;
    },
    [getDetailCalculationJob.fulfilled]: (state, action) => {
      state.loading = false;
      state.detail_calculation_job = action.payload;
    },
    [getDetailCalculationJob.rejected]: (state) => {
      state.loading = false;
    },
    // get detail calculation log
    [getDetailCalculationLog.pending]: (state, action) => {
      // Only show loading on initial fetch, not on load more
      if (!action.meta.arg?.isLoadMore) {
        state.loadingLog = true;
      }
    },
    [getDetailCalculationLog.fulfilled]: (state, action) => {
      state.loadingLog = false;
      const newData = action.payload.result || [];
      const isLoadMore = action.payload.isLoadMore;

      // If it's load more, append data. Otherwise, replace data
      if (isLoadMore) {
        state.list_calculation_log = {
          result: [...(state.list_calculation_log?.result || []), ...newData],
          page: action.payload.page || {
            size: 10,
            totalElements: 0,
            totalPages: 0,
            number: 0,
          },
        };
      } else {
        state.list_calculation_log = {
          result: newData,
          page: action.payload.page || {
            size: 10,
            totalElements: 0,
            totalPages: 0,
            number: 0,
          },
        };
      }
    },
    [getDetailCalculationLog.rejected]: (state, action) => {
      state.loadingLog = false;
      // Only clear data on initial fetch failure, not on load more failure
      if (!action.meta.arg?.isLoadMore) {
        state.list_calculation_log = {
          result: [],
          page: {
            size: 10,
            totalElements: 0,
            totalPages: 0,
            number: 0,
          },
        };
      }
    },

    // get detail calculation log no paigng
    [getDetailCalculationResultNoPaging.pending]: (state) => {
      state.loadingResult = true;
    },
    [getDetailCalculationResultNoPaging.fulfilled]: (state, action) => {
      state.loadingResult = false;
      state.list_calculation_no_paging = action.payload;
    },
    [getDetailCalculationResultNoPaging.rejected]: (state) => {
      state.loadingResult = false;
    },

    //DETAIL MATCH FORCE
    // [getTableForce.pending]: (state, action) => {
    //   state.loading = true;
    // },
    // [getTableForce.fulfilled]: (state, action) => {
    //   state.data_force = action.payload;
    //   state.loading = false;
    // },
    // [getTableForce.rejected]: (state, action) => {
    //   state.loading = true;
    // },

    /** recalculate data */
    [recalculateData.pending]: (state, action) => {
      state.loading = true;
      state.dataRequest = action.payload;
    },
    [recalculateData.fulfilled]: (state, action) => {
      state.dataRequest = action.payload;
      state.loading = false;
    },
    [recalculateData.rejected]: (state, action) => {
      state.dataRequest = action.payload;
      state.loading = false;
    },

    //retry dataa
    [retryData.pending]: (state, action) => {
      state.loadingModal = true;
      state.dataRetry = action.payload;
    },
    [retryData.fulfilled]: (state, action) => {
      state.dataRetry = action.payload;
      state.loadingModal = false;
    },
    [retryData.rejected]: (state, action) => {
      state.dataRetry = action.payload;
      state.loadingModal = false;
    },
  },
});

export const { setFilters, clearFilters, resetCalculationData } = calculationSlice.actions;
const { reducer } = calculationSlice;
export default reducer;
