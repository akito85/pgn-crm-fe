import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import userHttpService from "../../services/userHttpService";
import { setBodyError, showModalError, validateError } from "../general_slice";

const initialState = {
  created_prabilling_data: [],
  loadingCreate: false,
  loading: false,
  loadingModal: false,
  list_period_summary: [],
  list_sor: [],
  list_account_group: [],
  list_customer_segment: [],
  list_scheduler_type: [],
  list_cost_center: [],
  list_meter_reading_code: [],
  list_specific_customer: [],
  loading_specific_customer: false,
  specific_customer_message: "",
  list_billing_cycle: [],
  list_billing_period: [],
  list_component_prabilling: [],
  data_user_calculation: {},
  list_prabilling_init: [],
  user_profile: null,
  loading_user_profile: false,
  prabilling_pagination: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },
  customer_account_detail: {
    headerData: null,
    saData: { result: [], page: {} },
    usageData: { result: [], page: {} },
    taxData: { result: [], page: {} },
    promoData: { result: [], page: {} },
    pricingData: { result: [], page: {} },
    saTosDet: { result: [], page: {} },
    tosSubDet: { result: [], page: {} },
    billingBucketData: { result: [], page: {} },
    billingItemData: { result: [], page: {} },
    saPrcRuleDetData: { result: [], page: {} },
  },
  loading_customer_detail: {
    header: false,
    sa: false,
    usage: false,
    tax: false,
    promo: false,
    pricing: false,
    saTos: false,
    tosSub: false,
    billingBucket: false,
    billingItem: false,
    saPrcRuleDet: false,
  },
  loading_customer_account_detail: false,
  loading_list_prabilling: false,
  loading_log: false,
  loading_detail_log: false,
  detail_prabilling_init: null,
  detail_prabilling_result: { result: [], page: {} },
  detail_prabilling_log: {
    content: [],
    pageable: {},
    totalPages: 0,
    totalElements: 0,
  },
  prabill_sa_detail: {
    saDetail: { result: [], page: {} },
    saCalcRule: { result: [], page: {} },
    saPriceRule: { result: [], page: {} },
    saPriceDet: null,
    saTosDetail: { result: [], page: {} },
    saTos: { result: [], page: {} },
  },
  loading_prabill_sa: {
    saDetail: false,
    saCalcRule: false,
    saPriceRule: false,
    saPriceDet: false,
    saTosDetail: false,
    saTos: false,
  },
  loading_detail_prabilling: false,
  account_log_data: {
    summary: {
      success: null,
      failed: null,
      inProgress: null,
      open: null,
    },
    listAccountResult: {
      result: [],
      page: {},
    },
  },
  loading_account_log: false,
  list_prabilling_summary: [],
  summary_pagination: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },
  data_prabilling_sa: {
    result: [],
    page: {},
  },
  data_prabilling_usage: {
    result: [],
    page: {},
  },
  loading_sa: false,
  loading_usage: false,
  filters: {
    all_tab: {
      search: {},
      sort: "",
      searchText: "",
      searchedColumn: "",
      page: 1,
      selectedBillingPeriod: null,
    },
    summary_tab: {
      search: {},
      sort: "",
      searchText: "",
      searchedColumn: "",
      page: 1,
      selectedBillingPeriod: null,
    },
  },
};

// Get Prabill Summary Service Agreement
export const getPrabillSummaryServiceAgreement = createAsyncThunk(
  "GET_PRABILL_SUMMARY_SERVICE_AGREEMENT",
  async ({ id, search, page, pageSize, sort }, thunkAPI) => {
    try {
      let url = `/v1/dbs/api/prabill/summary/service-agreement/${id}?page=${page - 1
        }&size=${pageSize}`;

      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (sort) url += `&sort=${sort}`;

      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.data || response.data;
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
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Get Prabill Summary Usage
export const getPrabillSummaryUsage = createAsyncThunk(
  "GET_PRABILL_SUMMARY_USAGE",
  async (
    { billPeriod, customerNumber, search, page, pageSize, sort },
    thunkAPI,
  ) => {
    try {
      let url = `/v1/dbs/api/prabill/summary/usage?billPeriod=${encodeURIComponent(
        billPeriod,
      )}&customerNumber=${encodeURIComponent(customerNumber)}&page=${page - 1
        }&size=${pageSize}`;

      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (sort) url += `&sort=${sort}`;

      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.data || response.data;
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
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const getListBillingPeriodForPrabilling = createAsyncThunk(
  "GET_LIST_BILLING_PERIOD_FOR_RATING",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingperiod/open-lov`;
      const response = await ratingBillingHttpService.getAll(url);
      const rawData =
        response?.body?.data?.data ||
        response?.data?.data ||
        response?.data ||
        [];

      const transformedData = Array.isArray(rawData)
        ? rawData.map((item) => ({
          id: item.id,
          name: item.name,
          code: item.code,
          ...item,
        }))
        : [];

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
  },
);

export const getListPrabillingSummary = createAsyncThunk(
  "GET_LIST_PRABILLING_SUMMARY",
  async (
    { billPeriod, search, page, pageSize, sort, isLoadMore = false },
    thunkAPI,
  ) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "prabillCustId~asc";

      const url = `/v1/dbs/api/prabill/summary?billPeriod=${encodeURIComponent(
        billPeriod,
      )}&sort=${sortParams}&size=${pageSize}&page=${page}&searchs=${searchParams}`;

      const response = await ratingBillingHttpService.getPagination(url);

      return {
        ...response.data,
        isLoadMore,
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
  },
);

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

export const getListAccountGroup = createAsyncThunk(
  "GET_LIST_ACCOUNT_GROUP",
  async (segmentIds, thunkAPI) => {
    try {
      let queryParams = "";
      if (segmentIds && Array.isArray(segmentIds) && segmentIds.length > 0) {
        queryParams = segmentIds.map((id) => `idSegment=${id}`).join("&");
      }

      const url = `/v1/dbs/api/account-group-type/list${queryParams ? `?${queryParams}` : ""
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
  },
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
  },
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
  },
);

export const getUserProfile = createAsyncThunk(
  "GET_USER_PROFILE_FOR_PRABILLING",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/profile/view-profile";
      const response = await userHttpService.getAll(url);
      return response.data?.data || response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      console.error("Error fetching user profile:", message);
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const getListCostCenter = createAsyncThunk(
  "GET_LIST_COST_CENTER",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/costcenter`;
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
  },
);

export const getListMeterReadingCode = createAsyncThunk(
  "GET_LIST_METER_READING_CODE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/meterreadingcode`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
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
  },
);

export const getListSpecificCustomer = createAsyncThunk(
  "GET_LIST_SPECIFIC_CUSTOMER",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/customer-accounts`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
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
  },
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
  },
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
  },
);

export const getListComponentPrabilling = createAsyncThunk(
  "GET_LIST_COMPONENT_PRABILLING",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/prabill/component`;
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
  },
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
  },
);

export const createPrabilling = createAsyncThunk(
  "CREATE_PRABILLING",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/create";
      const response = await ratingBillingHttpService.createData(url, body);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();

      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
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

      throw error;
    }
  },
);

export const getListPrabillingInitPopulate = createAsyncThunk(
  "GET_LIST_PRABILLING_INIT_POPULATE",
  async (
    { search, page, pageSize, sort, billPeriodId, isLoadMore = false },
    thunkAPI,
  ) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "createdDtm~desc";
      const url = `/v1/dbs/api/prabill-init-populate/list?sort=${sortParams}&size=${pageSize}&page=${page}&searchs=${searchParams}&billPeriodId=${billPeriodId}`;

      const response = await ratingBillingHttpService.getPagination(url);

      return {
        ...response.data,
        isLoadMore,
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
  },
);

export const getDetailPrabillingInit = createAsyncThunk(
  "GET_DETAIL_PRABILLING_INIT",
  async (initCode, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/prabill/${initCode}`;
      const response = await ratingBillingHttpService.getDetail(url);

      const contentType = response.headers?.["content-type"];
      if (contentType && contentType.includes("text/html")) {
        throw new Error("Received HTML response - Server may be in maintenance mode");
      }

      return response.data;

    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(showModalError({
          title: "Failed",
          description: `Failed to fetch prabilling detail: ${message}`,
        }));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getDetailPrabillingResult = createAsyncThunk(
  "GET_DETAIL_PRABILLING_RESULT",
  async (
    { initCode, search, page, pageSize, sort, isLoadMore = false },
    thunkAPI,
  ) => {
    try {
      let url = `/v1/dbs/api/prabill/detail?initCode=${encodeURIComponent(
        initCode,
      )}&page=${page}&size=${pageSize}`;

      if (sort) {
        url += `&sort=${sort}`;
      }

      if (search && Object.keys(search).length > 0) {
        url += `&searchs=${encodeURIComponent(JSON.stringify(search))}`;
      }

      const response = await ratingBillingHttpService.getPagination(url);

      const apiData = response.data?.data || response.data;

      return {
        result: apiData?.result || [],
        page: apiData?.page || {
          size: 10,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
        isLoadMore,
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
          description: `Failed to fetch prabilling result: ${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const getDetailPrabillingLog = createAsyncThunk(
  "GET_DETAIL_PRABILLING_LOG",
  async (
    {
      initCode,
      page = 0,
      size = 10,
      sort = "",
      search = "",
      isLoadMore = false,
    },
    thunkAPI,
  ) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "createdDtm~desc";

      const url = `/v1/dbs/api/logs/prabill-init-populate/${encodeURIComponent(
        initCode,
      )}?page=${page}&size=${size}&sort=${sortParams}&searchs=${searchParams}`;

      const response = await ratingBillingHttpService.getAll(url);

      const apiData = response.data?.data || response.data;

      return {
        result: apiData?.result || [],
        page: apiData?.page || {
          size: 10,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
        isLoadMore,
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
          description: `Failed to fetch prabilling log: ${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const getPrabillingAccountLog = createAsyncThunk(
  "GET_PRABILLING_ACCOUNT_LOG",
  async (
    {
      initCode,
      page = 0,
      size = 10,
      sort = "",
      search = "",
      isLoadMore = false,
    },
    thunkAPI,
  ) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "createdDate~desc";

      const url = `/v1/dbs/api/prabill/status-account?initCode=${encodeURIComponent(
        initCode,
      )}&page=${page}&size=${size}&sort=${sortParams}&searchs=${searchParams}`;

      const response = await ratingBillingHttpService.getAll(url);

      const apiData = response.data?.data || response.data;

      return {
        summary: apiData?.summary || {
          success: null,
          failed: null,
          inProgress: null,
          open: null,
        },
        listAccountResult: {
          result: apiData?.listAccountResult?.result || [],
          page: apiData?.listAccountResult?.page || {
            size: 10,
            totalElements: 0,
            totalPages: 0,
            number: 0,
          },
        },
        isLoadMore,
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
          description: `Failed to fetch prabilling account log: ${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const getCustomerAccountDetail = createAsyncThunk(
  "GET_CUSTOMER_ACCOUNT_DETAIL",
  async (params, thunkAPI) => {
    try {
      const {
        customerNumber,
        billPeriod,
        inSor,
        accNumber,
        saNumber,
        page = 0,
        size = 10,
      } = params;

      if (!customerNumber || !billPeriod || !inSor) {
        throw new Error(
          "Missing required parameters: customerNumber, billPeriod, or inSor",
        );
      }

      let url = `/v1/dbs/api/customer-data?customerNumber=${encodeURIComponent(
        customerNumber,
      )}&billPeriod=${encodeURIComponent(
        billPeriod,
      )}&inSor=${encodeURIComponent(inSor)}`;

      if (accNumber) {
        url += `&accNumber=${encodeURIComponent(accNumber)}`;
      }
      if (saNumber) {
        url += `&saNumber=${encodeURIComponent(saNumber)}`;
      }

      url += `&page=${page}&size=${size}`;

      const response = await ratingBillingHttpService.getAll(url);

      const responseData = response.data?.data || response.data;

      if (!responseData) {
        console.error("Invalid response structure:", responseData);
        throw new Error("Invalid data format received from server");
      }

      const dataDetail = responseData.dataDetail || [];
      const dataUsage = responseData.dataUsage || [];
      const dataTaxImp = responseData.dataTaxImp || [];
      const dataSaPrcrule = responseData.dataSaPrcrule || [];
      const dataSATosDet = responseData.dataSATosDet || [];
      const dataTosSubDet = responseData.dataTosSubDet || [];
      const dataBillingBucket = responseData.dataBillingBucket || [];
      const dataBillingItem = responseData.dataBillingItem || [];
      const dataSAPrcRuleDet = responseData.dataSAPrcRuleDet || [];

      const usageData = dataUsage.map((item) => ({
        assetSerialNum: item.assetSerialNum,
        assetType: item.assetType,
        stream: item.stream,
        temperature: item.temperature,
        pressure: item.pressure,
        correctionFactor: item.correctionFactor,
        calorie: item.calorie,
        beginStand: item.beginStand,
        endStand: item.endStand,
        engMeasured: item.engMeasured,
        energy: item.energy,
        ghv: item.ghv,
        description: item.description,
        taxation: item.taxation,
        volMeasured27: item.volMeasured27,
        volMeasured60: item.volMeasured60,
        volMscf: item.volMscf,
        measDate: item.measDate,
        costCenter: item.costCenter,
        usageInitCode: item.usageInitCode,
        uncorrectedValue: item.uncorrectedValue,
        ratingCode: item.ratingCode,
      }));

      const taxData = dataTaxImp.map((item) => ({
        category: item.category,
        taxImpName: item.taxImpName,
        serviceType: item.serviceType,
        impType: item.impType,
        gunggung: item.gunggung,
        ratingCode: item.ratingCode,
      }));

      const pricingData = dataSaPrcrule.map((item) => ({
        lineNumber: item.lineNumber,
        priceCode: item.priceCodeRule || item.priceCode,
        min: item.min,
        max: item.max,
        value: item.priceValue,
        uom: item.priceUom,
        priceCurrency: item.priceCurrency,
      }));

      const saMap = new Map();
      dataDetail.forEach((item) => {
        if (!saMap.has(item.saNumber)) {
          saMap.set(item.saNumber, {
            saNumber: item.saNumber,
            saReferenceNumber: item.saReferenceNumber,
            saDate: item.saDate,
            commitmentDate: item.commitmentDate,
            saServiceType: item.saServiceType,
            saType: item.saType,
            productName: item.productName,
            productType: item.productType,
            termOfPayment: item.termOfPayment,
            pricingRule: item.pricingRule,
            mpricingCode: item.mpricingCode,
            idrValue: item.idrValue,
            idrUom: item.idrUom,
            usdValue: item.usdValue,
            usdUom: item.usdUom,
            minUsage: item.minUsage,
            maxUsage: item.maxUsage,
            fullPriceCode: item.fullPriceCode,
            idrFullPriceCode: item.idrFullPriceCode,
            usdFullPriceCode: item.usdFullPriceCode,
          });
        }
      });
      const saData = Array.from(saMap.values());

      const saTosDet = dataSATosDet.map((item) => ({
        saTosName: item.saTosName,
        attributeName: item.attributeName,
        value: item.value,
      }));

      const tosSubDet = dataTosSubDet.map((item) => ({
        tosName: item.tosName,
        attributeName: item.attributeName,
        unit: item.unit,
        value: item.value,
        fromItem: item.fromItem,
      }));

      const billingBucketData = dataBillingBucket.map((item) => ({
        bucketCode: item.bucketCode,
        bucketName: item.bucketName,
        bucketPriority: item.bucketPriority,
        validStartDate: item.validStartDate,
        validEndDate: item.validEndDate,
      }));

      const billingItemData = dataBillingItem.map((item) => ({
        bucketCode: item.bucketCode,
        bucketName: item.bucketName,
        itemCode: item.itemCode,
        itemName: item.itemName,
        billingType: item.billingType,
        itemCategory: item.itemCategory,
        isLateCharge: item.isLateCharge,
        sequence: item.sequence,
        currencyId: item.currencyId,
        itemPriority: item.itemPriority,
      }));

      const saPrcRuleDetData = dataSAPrcRuleDet.map((item) => ({
        currencyCode: item.currencyCode,
        fullPriceCode: item.fullPriceCode,
        uomName: item.uomName,
        priceValue: item.priceValue,
        lateChargeVal: item.lateChargeVal,
      }));

      return {
        rawContent: dataDetail,
        usageData: usageData,
        taxData: taxData,
        pricingData: pricingData,
        saData: saData,
        saTosDet: saTosDet,
        tosSubDet: tosSubDet,
        billingBucketData: billingBucketData,
        billingItemData: billingItemData,
        saPrcRuleDetData: saPrcRuleDetData,
        totalPages: 1,
        totalElements: dataUsage.length,
      };
    } catch (error) {
      console.error("Error in getCustomerAccountDetail:", error);

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
          description: `Failed to fetch customer account detail: ${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const downloadPrabillingResult = createAsyncThunk(
  "DOWNLOAD_PRABILLING_RESULT",
  async ({ initCode }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/download?search=${encodeURIComponent(initCode)}`;
      const response = await ratingBillingHttpService.downloadDataPrabill(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_PRABILLING_RESULT",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const getCustomerHeaderData = createAsyncThunk(
  "GET_CUSTOMER_HEADER_DATA",
  async (params, thunkAPI) => {
    try {
      const { customerNumber, billPeriod, inSor, accNumber, saNumber } = params;

      if (!customerNumber || !billPeriod || !inSor) {
        throw new Error("Missing required parameters");
      }

      let url = `/v1/dbs/api/customer-data?customerNumber=${encodeURIComponent(
        customerNumber,
      )}&billPeriod=${encodeURIComponent(
        billPeriod,
      )}&inSor=${encodeURIComponent(inSor)}`;

      if (accNumber) url += `&accNumber=${encodeURIComponent(accNumber)}`;
      if (saNumber) url += `&saNumber=${encodeURIComponent(saNumber)}`;

      const response = await ratingBillingHttpService.getAll(url);
      const responseData = response.data?.data || response.data;

      return Array.isArray(responseData)
        ? responseData
        : responseData
          ? [responseData]
          : [];
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getCustomerUsageData = createAsyncThunk(
  "GET_CUSTOMER_USAGE_DATA",
  async (params, thunkAPI) => {
    try {
      const {
        customerNumber,
        billPeriod,
        inSor,
        accNumber,
        saNumber,
        page = 0,
        size = 10,
        sort = "measDate~desc",
      } = params;

      let url = `/v1/dbs/api/data-usage?page=${page}&size=${size}&sort=${sort}&customerNumber=${encodeURIComponent(
        customerNumber,
      )}&billPeriod=${encodeURIComponent(
        billPeriod,
      )}&inSor=${encodeURIComponent(inSor)}`;

      if (accNumber) url += `&accNumber=${encodeURIComponent(accNumber)}`;
      if (saNumber) url += `&saNumber=${encodeURIComponent(saNumber)}`;

      const response = await ratingBillingHttpService.getAll(url);
      const apiData = response.data?.data || response.data;

      return {
        result: apiData?.result || [],
        page: apiData?.page || {
          size: 10,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
      };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getCustomerTaxData = createAsyncThunk(
  "GET_CUSTOMER_TAX_DATA",
  async (params, thunkAPI) => {
    try {
      const {
        customerNumber,
        billPeriod,
        inSor,
        accNumber,
        saNumber,
        page = 0,
        size = 10,
      } = params;

      let url = `/v1/dbs/api/data-tax-imp?page=${page}&size=${size}&customerNumber=${encodeURIComponent(
        customerNumber,
      )}&billPeriod=${encodeURIComponent(
        billPeriod,
      )}&inSor=${encodeURIComponent(inSor)}`;

      if (accNumber) url += `&accNumber=${encodeURIComponent(accNumber)}`;
      if (saNumber) url += `&saNumber=${encodeURIComponent(saNumber)}`;

      const response = await ratingBillingHttpService.getAll(url);
      const apiData = response.data?.data || response.data;

      return {
        result: apiData?.result || [],
        page: apiData?.page || {
          size: 10,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
      };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getCustomerBillingBucketData = createAsyncThunk(
  "GET_CUSTOMER_BILLING_BUCKET_DATA",
  async (params, thunkAPI) => {
    try {
      const {
        customerNumber,
        billPeriod,
        inSor,
        accNumber,
        saNumber,
        page = 0,
        size = 10,
      } = params;

      let url = `/v1/dbs/api/data-billing-bucket?page=${page}&size=${size}&customerNumber=${encodeURIComponent(
        customerNumber,
      )}&billPeriod=${encodeURIComponent(
        billPeriod,
      )}&inSor=${encodeURIComponent(inSor)}`;

      if (accNumber) url += `&accNumber=${encodeURIComponent(accNumber)}`;
      if (saNumber) url += `&saNumber=${encodeURIComponent(saNumber)}`;

      const response = await ratingBillingHttpService.getAll(url);
      const apiData = response.data?.data || response.data;

      return {
        result: apiData?.result || [],
        page: apiData?.page || {
          size: 10,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
      };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getCustomerBillingItemData = createAsyncThunk(
  "GET_CUSTOMER_BILLING_ITEM_DATA",
  async (params, thunkAPI) => {
    try {
      const {
        customerNumber,
        billPeriod,
        inSor,
        accNumber,
        saNumber,
        page = 0,
        size = 10,
      } = params;

      let url = `/v1/dbs/api/data-billing-item?page=${page}&size=${size}&customerNumber=${encodeURIComponent(
        customerNumber,
      )}&billPeriod=${encodeURIComponent(
        billPeriod,
      )}&inSor=${encodeURIComponent(inSor)}`;

      if (accNumber) url += `&accNumber=${encodeURIComponent(accNumber)}`;
      if (saNumber) url += `&saNumber=${encodeURIComponent(saNumber)}`;

      const response = await ratingBillingHttpService.getAll(url);
      const apiData = response.data?.data || response.data;

      return {
        result: apiData?.result || [],
        page: apiData?.page || {
          size: 10,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
      };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getCustomerPromoData = createAsyncThunk(
  "GET_CUSTOMER_PROMO_DATA",
  async (params, thunkAPI) => {
    try {
      const {
        customerNumber,
        accountNumber,
        sor,
        saNumber,
        billPeriod,
        page = 0,
        size = 10,
      } = params;

      let url = `/v1/dbs/api/prabill/promo-summary?page=${page}&size=${size}&customerNumber=${encodeURIComponent(
        customerNumber,
      )}&accountNumber=${encodeURIComponent(
        accountNumber,
      )}&sor=${encodeURIComponent(sor)}&saNumber=${encodeURIComponent(
        saNumber,
      )}&billPeriod=${encodeURIComponent(billPeriod)}`;

      const response = await ratingBillingHttpService.getAll(url);
      const apiData = response.data?.data || response.data;

      return {
        result: apiData?.result || [],
        page: apiData?.page || {
          size: 10,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
      };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getCustomerSaPrcRuleDetData = createAsyncThunk(
  "GET_CUSTOMER_SA_PRC_RULE_DET_DATA",
  async (params, thunkAPI) => {
    try {
      const {
        customerNumber,
        billPeriod,
        inSor,
        accNumber,
        saNumber,
        page = 0,
        size = 10,
      } = params;

      let url = `/v1/dbs/api/data-sa-prcrule-det?page=${page}&size=${size}&customerNumber=${encodeURIComponent(
        customerNumber,
      )}&billPeriod=${encodeURIComponent(
        billPeriod,
      )}&inSor=${encodeURIComponent(inSor)}`;

      if (accNumber) url += `&accNumber=${encodeURIComponent(accNumber)}`;
      if (saNumber) url += `&saNumber=${encodeURIComponent(saNumber)}`;

      const response = await ratingBillingHttpService.getAll(url);
      const apiData = response.data?.data || response.data;

      return {
        result: apiData?.result || [],
        page: apiData?.page || {
          size: 10,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
      };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getCustomerSaData = createAsyncThunk(
  "GET_CUSTOMER_SA_DATA",
  async (params, thunkAPI) => {
    try {
      const {
        customerNumber,
        billPeriod,
        page = 0,
        size = 10,
        sort = "saNumber~asc",
      } = params;

      if (!customerNumber || !billPeriod) {
        throw new Error(
          "Missing required parameters: customerNumber or billPeriod",
        );
      }

      let url = `/v1/dbs/api/prabill/service-agreement?customerNumber=${encodeURIComponent(
        customerNumber,
      )}&billPeriod=${encodeURIComponent(
        billPeriod,
      )}&page=${page}&size=${size}&sort=${sort}`;

      const response = await ratingBillingHttpService.getAll(url);
      const apiData = response.data?.data || response.data;

      return {
        result: apiData?.result || [],
        page: apiData?.page || {
          size: 10,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
      };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getPrabillSaDetail = createAsyncThunk(
  "GET_PRABILL_SA_DETAIL",
  async (
    { prabillSaId, page = 0, size = 10, search = "", sort = "" },
    thunkAPI,
  ) => {
    try {
      const searchParams = search
        ? `&searchs=${encodeURIComponent(search)}`
        : "";
      const sortParams = sort ? `&sort=${sort}` : "";

      const url = `/v1/dbs/api/prabill/sa-detail/${prabillSaId}?page=${page}&size=${size}${searchParams}${sortParams}`;
      const response = await ratingBillingHttpService.getAll(url);
      const apiData = response.data?.data || response.data;

      return {
        result: apiData?.result || [],
        page: apiData?.page || {
          size: 10,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
      };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getPrabillSaCalcRule = createAsyncThunk(
  "GET_PRABILL_SA_CALC_RULE",
  async (
    { prabillSaId, page = 0, size = 10, search = "", sort = "" },
    thunkAPI,
  ) => {
    try {
      const searchParams = search
        ? `&searchs=${encodeURIComponent(search)}`
        : "";
      const sortParams = sort ? `&sort=${sort}` : "";

      const url = `/v1/dbs/api/prabill/sa-calcrule/${prabillSaId}?page=${page}&size=${size}${searchParams}${sortParams}`;
      const response = await ratingBillingHttpService.getAll(url);
      const apiData = response.data?.data || response.data;

      return {
        result: apiData?.result || [],
        page: apiData?.page || {
          size: 10,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
      };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getPrabillSaPriceRule = createAsyncThunk(
  "GET_PRABILL_SA_PRICE_RULE",
  async (
    { prabillSaId, page = 0, size = 10, search = "", sort = "" },
    thunkAPI,
  ) => {
    try {
      const searchParams = search
        ? `&searchs=${encodeURIComponent(search)}`
        : "";
      const sortParams = sort ? `&sort=${sort}` : "";

      const url = `/v1/dbs/api/prabill/sa-prcrule/${prabillSaId}?page=${page}&size=${size}${searchParams}${sortParams}`;
      const response = await ratingBillingHttpService.getAll(url);
      const apiData = response.data?.data || response.data;

      return {
        result: apiData?.result || [],
        page: apiData?.page || {
          size: 10,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
      };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getPrabillSummarySaPriceRule = createAsyncThunk(
  "GET_PRABILL_SUMMARY_SA_PRICE_RULE",
  async (
    { prabillSaId, page = 0, size = 10, search = "", sort = "" },
    thunkAPI,
  ) => {
    try {
      const searchParams = search
        ? `&searchs=${encodeURIComponent(search)}`
        : "";
      const sortParams = sort ? `&sort=${sort}` : "";

      const url = `/v1/dbs/api/prabill/summary/sa-prcrule/${prabillSaId}?page=${page}&size=${size}${searchParams}${sortParams}`;
      const response = await ratingBillingHttpService.getAll(url);
      const apiData = response.data?.data || response.data;

      return {
        result: apiData?.result || [],
        page: apiData?.page || {
          size: 10,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
      };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getPrabillSaPriceDet = createAsyncThunk(
  "GET_PRABILL_SA_PRICE_DET",
  async (prabillSaId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/prabill/sa-pricedet/${prabillSaId}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data?.data || response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getPrabillSummarySaPriceDet = createAsyncThunk(
  "GET_PRABILL_SUMMARY_SA_PRICE_DET",
  async (prabillSaId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/prabill/summary/sa-price-det/${prabillSaId}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data?.data || response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getPrabillSaTosDetail = createAsyncThunk(
  "GET_PRABILL_SA_TOS_DETAIL",
  async (
    { prabillSaId, page = 0, size = 10, search = "", sort = "" },
    thunkAPI,
  ) => {
    try {
      const searchParams = search
        ? `&searchs=${encodeURIComponent(search)}`
        : "";
      const sortParams = sort ? `&sort=${sort}` : "";

      const url = `/v1/dbs/api/prabill/sa-tos-det/${prabillSaId}?page=${page}&size=${size}${searchParams}${sortParams}`;
      const response = await ratingBillingHttpService.getAll(url);
      const apiData = response.data?.data || response.data;

      return {
        result: apiData?.result || [],
        page: apiData?.page || {
          size: 10,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
      };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getPrabillSaTos = createAsyncThunk(
  "GET_PRABILL_SA_TOS",
  async (
    { prabillSaId, page = 0, size = 10, search = "", sort = "" },
    thunkAPI,
  ) => {
    try {
      const searchParams = search
        ? `&searchs=${encodeURIComponent(search)}`
        : "";
      const sortParams = sort ? `&sort=${sort}` : "";

      const url = `/v1/dbs/api/prabill/sa-tos/${prabillSaId}?page=${page}&size=${size}${searchParams}${sortParams}`;
      const response = await ratingBillingHttpService.getAll(url);
      const apiData = response.data?.data || response.data;

      return {
        result: apiData?.result || [],
        page: apiData?.page || {
          size: 10,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
      };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const prabillingSlice = createSlice({
  name: "prabilling",
  initialState,
  reducers: {
    resetCustomerDetail: (state) => {
      state.customer_account_detail = {
        headerData: null,
        saData: { result: [], page: {} },
        usageData: { result: [], page: {} },
        taxData: { result: [], page: {} },
        pricingData: { result: [], page: {} },
        saTosDet: { result: [], page: {} },
        tosSubDet: { result: [], page: {} },
        billingBucketData: { result: [], page: {} },
        billingItemData: { result: [], page: {} },
        saPrcRuleDetData: { result: [], page: {} },
      };
      state.loading_customer_detail = {
        header: false,
        sa: false,
        usage: false,
        tax: false,
        pricing: false,
        saTos: false,
        tosSub: false,
        billingBucket: false,
        billingItem: false,
        saPrcRuleDet: false,
      };
      state.prabill_sa_detail = {
        saDetail: { result: [], page: {} },
        saCalcRule: { result: [], page: {} },
        saPriceRule: { result: [], page: {} },
        saPriceDet: null,
        saTosDetail: { result: [], page: {} },
        saTos: { result: [], page: {} },
      };
      state.loading_prabill_sa = {
        saDetail: false,
        saCalcRule: false,
        saPriceRule: false,
        saPriceDet: false,
        saTosDetail: false,
        saTos: false,
      };
    },
    resetSummaryData: (state) => {
      state.list_prabilling_summary = [];
      state.summary_pagination = {
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        pageSize: 10,
      };
    },
    resetAllTabData: (state) => {
      state.list_prabilling_init = [];
      state.prabilling_pagination = {
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        pageSize: 10,
      };
    },
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
        selectedBillingPeriod: null,
      };
    },
  },
  extraReducers: {
    // Get List Billing Period for Prabilling
    [getListBillingPeriodForPrabilling.pending]: (state) => {
      state.loading = true;
    },
    [getListBillingPeriodForPrabilling.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_period_summary = action.payload;
    },
    [getListBillingPeriodForPrabilling.rejected]: (state) => {
      state.loading = false;
      state.list_period_summary = [];
    },
    // Get List Prabilling Summary
    [getListPrabillingSummary.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getListPrabillingSummary.fulfilled]: (state, action) => {
      state.loading = false;
      const newData = action.payload.result || [];
      const isLoadMore = action.payload.isLoadMore;

      if (isLoadMore) {
        const existingIds = new Set(
          state.list_prabilling_summary.map((item) => item.prabillCustId),
        );
        const uniqueNewData = newData.filter(
          (item) => !existingIds.has(item.prabillCustId),
        );
        state.list_prabilling_summary = [
          ...state.list_prabilling_summary,
          ...uniqueNewData,
        ];
      } else {
        state.list_prabilling_summary = newData;
      }

      state.summary_pagination = {
        totalPages: action.payload.page?.totalPages || 0,
        totalElements: action.payload.page?.totalElements || 0,
        currentPage: action.payload.page?.number || 0,
        pageSize: action.payload.page?.size || 10,
      };
    },
    [getListPrabillingSummary.rejected]: (state, action) => {
      state.loading = false;
      if (!action.meta.arg?.isLoadMore) {
        state.list_prabilling_summary = [];
        state.summary_pagination = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 10,
        };
      }
    },
    [getCustomerSaData.pending]: (state) => {
      state.loading_customer_detail.sa = true;
    },
    [getCustomerSaData.fulfilled]: (state, action) => {
      state.loading_customer_detail.sa = false;
      state.customer_account_detail.saData = action.payload;
    },
    [getCustomerSaData.rejected]: (state) => {
      state.loading_customer_detail.sa = false;
      state.customer_account_detail.saData = { result: [], page: {} };
    },
    [getPrabillSaDetail.pending]: (state) => {
      state.loading_prabill_sa.saDetail = true;
    },
    [getPrabillSaDetail.fulfilled]: (state, action) => {
      state.loading_prabill_sa.saDetail = false;
      state.prabill_sa_detail.saDetail = action.payload;
    },
    [getPrabillSaDetail.rejected]: (state) => {
      state.loading_prabill_sa.saDetail = false;
      state.prabill_sa_detail.saDetail = { result: [], page: {} };
    },
    [getPrabillSaCalcRule.pending]: (state) => {
      state.loading_prabill_sa.saCalcRule = true;
    },
    [getPrabillSaCalcRule.fulfilled]: (state, action) => {
      state.loading_prabill_sa.saCalcRule = false;
      state.prabill_sa_detail.saCalcRule = action.payload;
    },
    [getPrabillSaCalcRule.rejected]: (state) => {
      state.loading_prabill_sa.saCalcRule = false;
      state.prabill_sa_detail.saCalcRule = { result: [], page: {} };
    },
    [getPrabillSaPriceRule.pending]: (state) => {
      state.loading_prabill_sa.saPriceRule = true;
    },
    [getPrabillSaPriceRule.fulfilled]: (state, action) => {
      state.loading_prabill_sa.saPriceRule = false;
      state.prabill_sa_detail.saPriceRule = action.payload;
    },
    [getPrabillSaPriceRule.rejected]: (state) => {
      state.loading_prabill_sa.saPriceRule = false;
      state.prabill_sa_detail.saPriceRule = { result: [], page: {} };
    },
    [getPrabillSummarySaPriceRule.pending]: (state) => {
      state.loading_prabill_sa.saPriceRule = true;
    },
    [getPrabillSummarySaPriceRule.fulfilled]: (state, action) => {
      state.loading_prabill_sa.saPriceRule = false;
      state.prabill_sa_detail.saPriceRule = action.payload;
    },
    [getPrabillSummarySaPriceRule.rejected]: (state) => {
      state.loading_prabill_sa.saPriceRule = false;
      state.prabill_sa_detail.saPriceRule = { result: [], page: {} };
    },
    [getPrabillSaPriceDet.pending]: (state) => {
      state.loading_prabill_sa.saPriceDet = true;
    },
    [getPrabillSaPriceDet.fulfilled]: (state, action) => {
      state.loading_prabill_sa.saPriceDet = false;
      state.prabill_sa_detail.saPriceDet = action.payload;
    },
    [getPrabillSaPriceDet.rejected]: (state) => {
      state.loading_prabill_sa.saPriceDet = false;
      state.prabill_sa_detail.saPriceDet = null;
    },
    [getPrabillSummarySaPriceDet.pending]: (state) => {
      state.loading_prabill_sa.saPriceDet = true;
    },
    [getPrabillSummarySaPriceDet.fulfilled]: (state, action) => {
      state.loading_prabill_sa.saPriceDet = false;
      state.prabill_sa_detail.saPriceDet = action.payload;
    },
    [getPrabillSummarySaPriceDet.rejected]: (state) => {
      state.loading_prabill_sa.saPriceDet = false;
      state.prabill_sa_detail.saPriceDet = null;
    },
    [getPrabillSaTosDetail.pending]: (state) => {
      state.loading_prabill_sa.saTosDetail = true;
    },
    [getPrabillSaTosDetail.fulfilled]: (state, action) => {
      state.loading_prabill_sa.saTosDetail = false;
      state.prabill_sa_detail.saTosDetail = action.payload;
    },
    [getPrabillSaTosDetail.rejected]: (state) => {
      state.loading_prabill_sa.saTosDetail = false;
      state.prabill_sa_detail.saTosDetail = { result: [], page: {} };
    },
    [getPrabillSaTos.pending]: (state) => {
      state.loading_prabill_sa.saTos = true;
    },
    [getPrabillSaTos.fulfilled]: (state, action) => {
      state.loading_prabill_sa.saTos = false;
      state.prabill_sa_detail.saTos = action.payload;
    },
    [getPrabillSaTos.rejected]: (state) => {
      state.loading_prabill_sa.saTos = false;
      state.prabill_sa_detail.saTos = { result: [], page: {} };
    },
    [getCustomerHeaderData.pending]: (state) => {
      state.loading_customer_detail.header = true;
    },
    [getCustomerHeaderData.fulfilled]: (state, action) => {
      state.loading_customer_detail.header = false;
      state.customer_account_detail.headerData = action.payload;
    },
    [getCustomerHeaderData.rejected]: (state) => {
      state.loading_customer_detail.header = false;
      state.customer_account_detail.headerData = null;
    },
    [getCustomerUsageData.pending]: (state) => {
      state.loading_customer_detail.usage = true;
    },
    [getCustomerUsageData.fulfilled]: (state, action) => {
      state.loading_customer_detail.usage = false;
      state.customer_account_detail.usageData = action.payload;
    },
    [getCustomerUsageData.rejected]: (state) => {
      state.loading_customer_detail.usage = false;
      state.customer_account_detail.usageData = { result: [], page: {} };
    },
    [getCustomerTaxData.pending]: (state) => {
      state.loading_customer_detail.tax = true;
    },
    [getCustomerTaxData.fulfilled]: (state, action) => {
      state.loading_customer_detail.tax = false;
      state.customer_account_detail.taxData = action.payload;
    },
    [getCustomerTaxData.rejected]: (state) => {
      state.loading_customer_detail.tax = false;
      state.customer_account_detail.taxData = { result: [], page: {} };
    },
    [getCustomerPromoData.pending]: (state) => {
      state.loading_customer_detail.promo = true;
    },
    [getCustomerPromoData.fulfilled]: (state, action) => {
      state.loading_customer_detail.promo = false;
      state.customer_account_detail.promoData = action.payload;
    },
    [getCustomerPromoData.rejected]: (state) => {
      state.loading_customer_detail.promo = false;
      state.customer_account_detail.promoData = { result: [], page: {} };
    },
    [getCustomerBillingBucketData.pending]: (state) => {
      state.loading_customer_detail.billingBucket = true;
    },
    [getCustomerBillingBucketData.fulfilled]: (state, action) => {
      state.loading_customer_detail.billingBucket = false;
      state.customer_account_detail.billingBucketData = action.payload;
    },
    [getCustomerBillingBucketData.rejected]: (state) => {
      state.loading_customer_detail.billingBucket = false;
      state.customer_account_detail.billingBucketData = {
        result: [],
        page: {},
      };
    },
    [getCustomerBillingItemData.pending]: (state) => {
      state.loading_customer_detail.billingItem = true;
    },
    [getCustomerBillingItemData.fulfilled]: (state, action) => {
      state.loading_customer_detail.billingItem = false;
      state.customer_account_detail.billingItemData = action.payload;
    },
    [getCustomerBillingItemData.rejected]: (state) => {
      state.loading_customer_detail.billingItem = false;
      state.customer_account_detail.billingItemData = { result: [], page: {} };
    },
    [getCustomerSaPrcRuleDetData.pending]: (state) => {
      state.loading_customer_detail.saPrcRuleDet = true;
    },
    [getCustomerSaPrcRuleDetData.fulfilled]: (state, action) => {
      state.loading_customer_detail.saPrcRuleDet = false;
      state.customer_account_detail.saPrcRuleDetData = action.payload;
    },
    [getCustomerSaPrcRuleDetData.rejected]: (state) => {
      state.loading_customer_detail.saPrcRuleDet = false;
      state.customer_account_detail.saPrcRuleDetData = { result: [], page: {} };
    },

    [getCustomerAccountDetail.pending]: (state) => {
      state.loading_customer_account_detail = true;
    },
    [getCustomerAccountDetail.fulfilled]: (state, action) => {
      state.loading_customer_account_detail = false;
      state.customer_account_detail = action.payload;
    },
    [getCustomerAccountDetail.rejected]: (state) => {
      state.loading_customer_account_detail = false;
      state.customer_account_detail = {
        headerData: null,
        saData: { result: [], page: {} },
        usageData: { result: [], page: {} },
        taxData: { result: [], page: {} },
        pricingData: { result: [], page: {} },
        saTosDet: { result: [], page: {} },
        tosSubDet: { result: [], page: {} },
        billingBucketData: { result: [], page: {} },
        billingItemData: { result: [], page: {} },
        saPrcRuleDetData: { result: [], page: {} },
      };
    },
    [getDetailPrabillingInit.pending]: (state) => {
      state.loading_detail_prabilling = true;
      state.detail_prabilling_init = null;
    },
    [getDetailPrabillingInit.fulfilled]: (state, action) => {
      state.loading_detail_prabilling = false;
      state.detail_prabilling_init = action.payload;
    },
    [getDetailPrabillingInit.rejected]: (state) => {
      state.loading_detail_prabilling = false;
      state.detail_prabilling_init = null;
    },
    [getDetailPrabillingResult.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getDetailPrabillingResult.fulfilled]: (state, action) => {
      state.loading = false;
      const newData = action.payload.result || [];
      const isLoadMore = action.payload.isLoadMore;

      if (isLoadMore) {
        state.detail_prabilling_result = {
          result: [
            ...(state.detail_prabilling_result?.result || []),
            ...newData,
          ],
          page: {
            totalElements: action.payload.page?.totalElements || 0,
            totalPages: action.payload.page?.totalPages || 0,
            currentPage: action.payload.page?.number || 0,
            pageSize: action.payload.page?.size || 10,
          },
        };
      } else {
        state.detail_prabilling_result = {
          result: newData,
          page: {
            totalElements: action.payload.page?.totalElements || 0,
            totalPages: action.payload.page?.totalPages || 0,
            currentPage: action.payload.page?.number || 0,
            pageSize: action.payload.page?.size || 10,
          },
        };
      }
    },
    [getDetailPrabillingResult.rejected]: (state, action) => {
      state.loading = false;
      if (!action.meta.arg?.isLoadMore) {
        state.detail_prabilling_result = {
          result: [],
          page: {
            totalElements: 0,
            totalPages: 0,
            currentPage: 0,
            pageSize: 10,
          },
        };
      }
    },
    [getDetailPrabillingLog.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_log = true;
      }
    },
    [getDetailPrabillingLog.fulfilled]: (state, action) => {
      state.loading_log = false;
      const newData = action.payload.result || [];
      const isLoadMore = action.payload.isLoadMore;

      if (isLoadMore) {
        state.detail_prabilling_log = {
          content: [
            ...(state.detail_prabilling_log?.content || []),
            ...newData,
          ],
          totalPages: action.payload.page?.totalPages || 0,
          totalElements: action.payload.page?.totalElements || 0,
          pageable: {
            pageNumber: action.payload.page?.number || 0,
            pageSize: action.payload.page?.size || 10,
          },
        };
      } else {
        state.detail_prabilling_log = {
          content: newData,
          totalPages: action.payload.page?.totalPages || 0,
          totalElements: action.payload.page?.totalElements || 0,
          pageable: {
            pageNumber: action.payload.page?.number || 0,
            pageSize: action.payload.page?.size || 10,
          },
        };
      }
    },
    [getDetailPrabillingLog.rejected]: (state, action) => {
      state.loading_log = false;
      if (!action.meta.arg?.isLoadMore) {
        state.detail_prabilling_log = {
          content: [],
          pageable: {},
          totalPages: 0,
          totalElements: 0,
        };
      }
    },
    [getPrabillingAccountLog.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_account_log = true;
      }
    },
    [getPrabillingAccountLog.fulfilled]: (state, action) => {
      state.loading_account_log = false;
      const newData = action.payload.listAccountResult.result || [];
      const isLoadMore = action.payload.isLoadMore;

      state.account_log_data.summary = action.payload.summary;

      if (isLoadMore) {
        state.account_log_data.listAccountResult = {
          result: [
            ...(state.account_log_data.listAccountResult?.result || []),
            ...newData,
          ],
          page: action.payload.listAccountResult.page,
        };
      } else {
        state.account_log_data.listAccountResult = {
          result: newData,
          page: action.payload.listAccountResult.page,
        };
      }
    },
    [getPrabillingAccountLog.rejected]: (state, action) => {
      state.loading_account_log = false;
      if (!action.meta.arg?.isLoadMore) {
        state.account_log_data = {
          summary: {
            success: null,
            failed: null,
            inProgress: null,
            open: null,
          },
          listAccountResult: {
            result: [],
            page: {},
          },
        };
      }
    },
    [downloadPrabillingResult.pending]: (state) => {
      state.loading = true;
    },
    [downloadPrabillingResult.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadPrabillingResult.rejected]: (state) => {
      state.loading = false;
    },
    [getListPrabillingInitPopulate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getListPrabillingInitPopulate.fulfilled]: (state, action) => {
      state.loading = false;
      const newData = action.payload.result || [];
      const isLoadMore = action.payload.isLoadMore;

      if (isLoadMore) {
        const existingIds = new Set(
          state.list_prabilling_init.map((item) => item.initId),
        );
        const uniqueNewData = newData.filter(
          (item) => !existingIds.has(item.initId),
        );
        state.list_prabilling_init = [
          ...state.list_prabilling_init,
          ...uniqueNewData,
        ];
      } else {
        state.list_prabilling_init = newData;
      }

      state.prabilling_pagination = {
        totalPages: action.payload.page?.totalPages || 0,
        totalElements: action.payload.page?.totalElements || 0,
        currentPage: action.payload.page?.number || 0,
        pageSize: action.payload.page?.size || 10,
      };
    },
    [getListPrabillingInitPopulate.rejected]: (state, action) => {
      state.loading = false;
      if (!action.meta.arg?.isLoadMore) {
        state.list_prabilling_init = [];
        state.prabilling_pagination = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 10,
        };
      }
    },
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
    [getUserProfile.pending]: (state) => {
      state.loading_user_profile = true;
    },
    [getUserProfile.fulfilled]: (state, action) => {
      state.loading_user_profile = false;
      state.user_profile = action.payload;
    },
    [getUserProfile.rejected]: (state) => {
      state.loading_user_profile = false;
      state.user_profile = null;
    },
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
    [getListComponentPrabilling.pending]: (state) => {
      state.loading = true;
    },
    [getListComponentPrabilling.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_component_prabilling = action.payload;
    },
    [getListComponentPrabilling.rejected]: (state) => {
      state.loading = false;
    },
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
    [createPrabilling.pending]: (state) => {
      state.loadingCreate = true;
    },
    [createPrabilling.fulfilled]: (state, action) => {
      state.loadingCreate = false;
      state.created_prabilling_data = action.payload;
    },
    [createPrabilling.rejected]: (state) => {
      state.loadingCreate = false;
    },
    [getPrabillSummaryServiceAgreement.pending]: (state) => {
      state.loading_sa = true;
    },
    [getPrabillSummaryServiceAgreement.fulfilled]: (state, action) => {
      state.loading_sa = false;
      state.data_prabilling_sa = {
        result: action.payload?.result || [],
        page: action.payload?.page || {
          size: 10,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
      };
    },
    [getPrabillSummaryServiceAgreement.rejected]: (state) => {
      state.loading_sa = false;
      state.data_prabilling_sa = {
        result: [],
        page: {},
      };
    },
    [getPrabillSummaryUsage.pending]: (state) => {
      state.loading_usage = true;
    },
    [getPrabillSummaryUsage.fulfilled]: (state, action) => {
      state.loading_usage = false;
      state.data_prabilling_usage = {
        result: action.payload?.result || [],
        page: action.payload?.page || {
          size: 10,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
      };
    },
    [getPrabillSummaryUsage.rejected]: (state) => {
      state.loading_usage = false;
      state.data_prabilling_usage = {
        result: [],
        page: {},
      };
    },
  },
});

export const {
  resetCustomerDetail,
  resetSummaryData,
  resetAllTabData,
  setFilters,
  clearFilters,
} = prabillingSlice.actions;
const { reducer } = prabillingSlice;
export default reducer;
