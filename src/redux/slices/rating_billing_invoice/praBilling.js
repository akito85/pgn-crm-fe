import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import userHttpService from "../../services/userHttpService";
import {
  showModalSuccess,
  setBodyError,
  showModalError,
  validateError,
} from "../general_slice";

const CUSTOM_BASE_URL = process.env.REACT_APP_BASE_URL_NGROK;

const initialState = {
  data: [],
  loading: false,
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
  loading_specific_customer: false,
  specific_customer_message: "",
  list_billing_cycle: [],
  list_billing_period: [],
  detail_calculation_job: null,
  list_calculation_log: [],
  list_calculation_result: [],
  list_calculation_no_paging: [],
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
  loading_list_prabilling: false,
  list_log_activities: [],
  loading_log: false,
  detail_log_activity: null,
  loading_detail_log: false,

  customer_account_detail: {
    content: [],
    groupedByDate: {},
    totalElements: 0,
    totalPages: 0,
    pageable: {},
  },
  loading_customer_detail: false,

  detail_prabilling_init: null,
  detail_prabilling_result: { result: [], page: {} },
  detail_prabilling_log: {
    content: [],
    pageable: {},
    totalPages: 0,
    totalElements: 0,
  },
  loading_log: false,
  loading_detail_prabilling: false,
};

// pagination slice
export const getCalculationPaginate = createAsyncThunk(
  "GET_CALCULATION_PAGINATE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "generateDate~desc";
      const url = `/v1/dbs/api/rbi/calculation/list-calculationjob?sort=${sortParams}&size=${pageSize}&page=${page}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
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

// pagination history
export const getHistoryCalculationPaginate = createAsyncThunk(
  "GET_HISTORY_CALCULATION_PAGINATE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "resultId~desc";
      const url = `/v1/dbs/api/rbi/calculation/list-calculationhistory?sort=${sortParams}&size=${pageSize}&page=${page}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
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

      const response = await ratingBillingHttpService.getAll(
        url,
        CUSTOM_BASE_URL
      );

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

export const getUserProfile = createAsyncThunk(
  "GET_USER_PROFILE_FOR_PRABILLING",
  async (thunkAPI) => {
    try {
      const url = '/v1/dbs/api/profile/view-profile';
      const response = await userHttpService.getAll(url);
      // Ambil data langsung dari response
      return response.data?.data || response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      console.error('Error fetching user profile:', message);
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
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
      const url = `/v1/dbs/api/customer-accounts`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
        CUSTOM_BASE_URL
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
      const response = await ratingBillingHttpService.getAll(
        url,
        CUSTOM_BASE_URL
      );

      console.log("Raw Response:", response); // Debug log

      // Ambil array data dari response
      const rawData = response.data?.data || response.data || [];

      console.log("Raw Data Array:", rawData); // Debug log

      // Transform setiap item
      const transformedData = rawData.map((item) => ({
        ...item,
        id: item.billingCycleId,
        name: `${item.beginCycle} - ${item.endCycle} ${item.timeUnit}`,
      }));

      console.log("Transformed Data:", transformedData); // Debug log

      // Return dalam format yang sama dengan response asli
      return {
        ...response.data,
        data: transformedData,
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
  "GET_LIST_BILLING_PERIOD",
  async (billingCycleId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/billingperiod/${billingCycleId}`;
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
export const createPrabilling = createAsyncThunk(
  "CREATE_PRABILLING",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/prabill/create";

      const response = await ratingBillingHttpService.createData(
        url,
        body,
        CUSTOM_BASE_URL
      );

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
  }
);

// Update bagian getListPrabillingInitPopulate thunk
export const getListPrabillingInitPopulate = createAsyncThunk(
  "GET_LIST_PRABILLING_INIT_POPULATE",
  async (
    { page = 0, size = 10, searchs = {}, sort = "createdDtm,desc" },
    thunkAPI
  ) => {
    try {
      const searchParam =
        Object.keys(searchs).length > 0
          ? `&searchs=${encodeURIComponent(JSON.stringify(searchs))}`
          : "&searchs=%7B%7D";
      const url = `/v1/dbs/api/prabill-init-populate/list?page=${page}&size=${size}&sort=${sort}${searchParam}`;
      const response = await ratingBillingHttpService.getAll(
        url,
        CUSTOM_BASE_URL
      );
      const contentType = response.headers?.["content-type"];
      if (contentType && contentType.includes("text/html")) {
        throw new Error("Received HTML response instead of JSON");
      }
      const responseData = response.data?.data || response.data;

      if (!responseData || !Array.isArray(responseData.content)) {
        console.error("Invalid response structure:", responseData);
        throw new Error("Invalid data format received from server");
      }

      console.log("✅ Extracted Data:", {
        content: responseData.content.length,
        totalPages: responseData.totalPages,
        totalElements: responseData.totalElements,
        currentPage: responseData.pageable?.pageNumber,
      });

      return {
        content: responseData.content,
        pageable: responseData.pageable,
        totalPages: responseData.totalPages,
        totalElements: responseData.totalElements,
      };
    } catch (error) {
      console.error("Error in getListPrabillingInitPopulate:", error);

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
          description: `Failed to fetch prabilling list: ${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Log Activities
export const getLogActivities = createAsyncThunk(
  "GET_LOG_ACTIVITIES",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/log/view-activity";

      const response = await ratingBillingHttpService.getAll(
        url,
        CUSTOM_BASE_URL
      );
      console.log("Log Activities Response:", response);
      return response.data || response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();

      const errorBody = {
        title: "Failed",
        description: `${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Get Log Activity Detail
export const getLogActivityDetail = createAsyncThunk(
  "GET_LOG_ACTIVITY_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/log/view-activity-detail/${id}`;

      const response = await ratingBillingHttpService.getDetail(
        url,
        CUSTOM_BASE_URL
      );
      console.log("Log Activity Detail Response:", response);
      return response.data || response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();

      const errorBody = {
        title: "Failed",
        description: `Failed to fetch log detail: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Update untuk getDetailPrabillingInit thunk
export const getDetailPrabillingInit = createAsyncThunk(
  "GET_DETAIL_PRABILLING_INIT",
  async (initCode, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/prabill/${initCode}`;
      const response = await ratingBillingHttpService.getDetail(
        url,
        CUSTOM_BASE_URL
      );
      const contentType = response.headers?.["content-type"];
      if (contentType && contentType.includes("text/html")) {
        throw new Error(
          "Received HTML response - Server may be in maintenance mode"
        );
      }
      const responseData = response.data?.data || response.data || response;
      const details = responseData.details || [];
      const accountGroupTypes = [];
      const accountSegments = [];
      const costCenters = [];
      const meterReadingCodes = [];

      const accountGroupMap = new Map();
      const accountSegmentMap = new Map();
      const costCenterMap = new Map();
      const meterReadingMap = new Map();

      details.forEach((detail) => {
        // Account Group Type
        if (
          detail.accountGroupTypeId &&
          !accountGroupMap.has(detail.accountGroupTypeId)
        ) {
          accountGroupMap.set(detail.accountGroupTypeId, {
            id: detail.accountGroupTypeId,
            accountGroupType: detail.accountGroupType,
            initCode: detail.initCode,
            createdBy: detail.createdBy,
            createdDate: detail.createdDtm,
            updatedBy: null,
            updatedDate: null,
          });
        }

        // Account Segment
        if (
          detail.accountSegmentId &&
          !accountSegmentMap.has(detail.accountSegmentId)
        ) {
          accountSegmentMap.set(detail.accountSegmentId, {
            id: detail.accountSegmentId,
            accountSegment: detail.accountSegment,
            initCode: detail.initCode,
            createdBy: detail.createdBy,
            createdDate: detail.createdDtm,
            updatedBy: null,
            updatedDate: null,
          });
        }

        // Cost Center
        if (detail.costCenterId && !costCenterMap.has(detail.costCenterId)) {
          costCenterMap.set(detail.costCenterId, {
            id: detail.costCenterId,
            costCenter: detail.costCenter,
            initCode: detail.initCode,
            createdBy: detail.createdBy,
            createdDate: detail.createdDtm,
            updatedBy: null,
            updatedDate: null,
          });
        }

        // Meter Reading Code
        if (
          detail.meterReadingCodeId &&
          !meterReadingMap.has(detail.meterReadingCodeId)
        ) {
          meterReadingMap.set(detail.meterReadingCodeId, {
            id: detail.meterReadingCodeId,
            meterReadingCode: detail.meterReadingCode,
            initCode: detail.initCode,
            createdBy: detail.createdBy,
            createdDate: detail.createdDtm,
            updatedBy: null,
            updatedDate: null,
          });
        }
      });

      // Convert Maps to Arrays
      const accountGroupTypesArray = Array.from(accountGroupMap.values());
      const accountSegmentsArray = Array.from(accountSegmentMap.values());
      const costCentersArray = Array.from(costCenterMap.values());
      const meterReadingCodesArray = Array.from(meterReadingMap.values());

      const transformedData = {
        initId: responseData.prabillInitPopulate?.initId,
        initCode: responseData.prabillInitPopulate?.initCode,
        processName: responseData.prabillInitPopulate?.processName,
        billingCycle: responseData.prabillInitPopulate?.billingCycle,
        billPeriod: responseData.prabillInitPopulate?.billPeriod,
        sor: responseData.prabillInitPopulate?.sor,
        sorId: responseData.prabillInitPopulate?.sorId,
        totalCustomer: responseData.prabillInitPopulate?.totalCustomer,
        status: responseData.prabillInitPopulate?.status,
        message: responseData.prabillInitPopulate?.message,
        remark: responseData.prabillInitPopulate?.remark,
        createdBy: responseData.prabillInitPopulate?.createdBy,
        createdDtm: responseData.prabillInitPopulate?.createdDtm,
        updateDtm: responseData.prabillInitPopulate?.updateDtm,
        billPeriodId: responseData.prabillInitPopulate?.billPeriodId,
        billingCycleId: responseData.prabillInitPopulate?.billingCycleId,
        shceduleTypeId: responseData.prabillInitPopulate?.shceduleTypeId,

        accountGroupType: accountGroupTypesArray,
        accountSegment: accountSegmentsArray,
        costCenter: costCentersArray,
        meterReadingCode: meterReadingCodesArray,
      };

      return transformedData;
    } catch (error) {
      console.error("Error in getDetailPrabillingInit:", error);

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
          description: `Failed to fetch prabilling detail: ${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Update thunk getDetailPrabillingResult - dengan pagination dari backend
export const getDetailPrabillingResult = createAsyncThunk(
  "GET_DETAIL_PRABILLING_RESULT",
  async ({ initCode, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search
        ? `&searchs=${encodeURIComponent(JSON.stringify(search))}`
        : "";
      const sortParams = sort ? `&sort=${sort}` : "";

      const backendPage = page - 1;
      let url = `/v1/dbs/api/prabill/detail?search=${encodeURIComponent(
        initCode
      )}&page=${backendPage}&size=${pageSize}`;

      if (sort) {
        url += `&sort=${sort}`;
      }

      if (search && Object.keys(search).length > 0) {
        url += `&searchs=${encodeURIComponent(JSON.stringify(search))}`;
      }
      const response = await ratingBillingHttpService.getPagination(
        url,
        CUSTOM_BASE_URL
      );
      console.log("Detail Prabilling Result Response:", response);

      const responseData = response.data || response;

      return {
        result: responseData.content || [],
        page: {
          totalElements: responseData.totalElements || 0,
          totalPages: responseData.totalPages || 0,
          currentPage: page,
          pageSize: pageSize,
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
          description: `Failed to fetch prabilling result: ${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Get Detail Prabilling Log
export const getDetailPrabillingLog = createAsyncThunk(
  "GET_DETAIL_PRABILLING_LOG",
  async ({ initCode, page = 0, size = 10 }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/logs/prabill-init-populate?initCode=${encodeURIComponent(
        initCode
      )}&page=${page}&size=${size}`;
      const response = await ratingBillingHttpService.getAll(
        url,
        CUSTOM_BASE_URL
      );
      const contentType = response.headers?.["content-type"];
      if (contentType && contentType.includes("text/html")) {
        throw new Error("Received HTML response instead of JSON");
      }
      const responseData = response.data?.data || response.data;

      if (!responseData || !Array.isArray(responseData.content)) {
        console.error("Invalid log response structure:", responseData);
        throw new Error("Invalid log data format received from server");
      }

      console.log("Extracted Log Data:", {
        content: responseData.content.length,
        totalPages: responseData.totalPages,
        totalElements: responseData.totalElements,
      });

      return {
        content: responseData.content,
        pageable: responseData.pageable,
        totalPages: responseData.totalPages,
        totalElements: responseData.totalElements,
      };
    } catch (error) {
      console.error("Error in getDetailPrabillingLog:", error);

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
  }
);

// customer account detail
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
          "Missing required parameters: customerNumber, billPeriod, or inSor"
        );
      }

      let url = `/v1/dbs/api/customer-data?customerNumber=${encodeURIComponent(
        customerNumber
      )}&billPeriod=${encodeURIComponent(
        billPeriod
      )}&inSor=${encodeURIComponent(inSor)}`;

      if (accNumber) {
        url += `&accNumber=${encodeURIComponent(accNumber)}`;
      }
      if (saNumber) {
        url += `&saNumber=${encodeURIComponent(saNumber)}`;
      }

      url += `&page=${page}&size=${size}`;

      console.log("Fetching customer account detail:", url);

      const response = await ratingBillingHttpService.getAll(
        url,
        CUSTOM_BASE_URL
      );

      console.log("Customer Account Detail Response:", response);

      const responseData = response.data?.data || response.data;

      // Validasi struktur response baru
      if (!responseData) {
        console.error("Invalid response structure:", responseData);
        throw new Error("Invalid data format received from server");
      }

      const dataDetail = responseData.dataDetail || [];
      const dataUsage = responseData.dataUsage || [];
      const dataTaxImp = responseData.dataTaxImp || [];
      const dataSaPrcrule = responseData.dataSaPrcrule || [];

      console.log("Data Summary:", {
        totalDetailRecords: dataDetail.length,
        totalUsageRecords: dataUsage.length,
        totalTaxRecords: dataTaxImp.length,
        totalPricingTiers: dataSaPrcrule.length,
      });

      const usageMap = new Map();
      dataUsage.forEach((item) => {
        const key = item.measDate;
        if (!usageMap.has(key)) {
          usageMap.set(key, item);
        }
      });
      const uniqueUsageData = Array.from(usageMap.values());

      const taxData = dataTaxImp.map((item) => ({
        category: item.category,
        taxImpName: item.taxImpName,
        serviceType: item.serviceType,
        impType: item.impType,
        gunggung: item.gunggung,
        ratingCode: item.ratingCode || "-",
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

      console.log("Processed Data Summary:", {
        uniqueUsageData: uniqueUsageData.length,
        taxData: taxData.length,
        pricingData: pricingData.length,
        saData: saData.length,
      });

      return {
        rawContent: dataDetail,
        usageData: uniqueUsageData,
        taxData: taxData,
        pricingData: pricingData,
        saData: saData,
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
  }
);
// Update download function
export const downloadPrabillingResult = createAsyncThunk(
  "DOWNLOAD_PRABILLING_RESULT",
  async ({ initCode }, thunkAPI) => {
    try {
      // Download semua data tanpa pagination
      const url = `/v1/dbs/api/prabill/detail?search=${encodeURIComponent(
        initCode
      )}`;

      const response = await ratingBillingHttpService.downloadData(
        url,
        CUSTOM_BASE_URL
      );
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_PRABILLING_RESULT",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);


const prabillingSlice = createSlice({
  name: "prabilling",
  initialState,
  extraReducers: {
    [getCustomerAccountDetail.pending]: (state) => {
      state.loading_customer_detail = true;
      state.customer_account_detail = {
        content: [],
        groupedByDate: {},
        totalElements: 0,
        totalPages: 0,
        pageable: {},
      };
    },
    [getCustomerAccountDetail.fulfilled]: (state, action) => {
      state.loading_customer_detail = false;
      state.customer_account_detail = action.payload;
    },
    [getCustomerAccountDetail.rejected]: (state) => {
      state.loading_customer_detail = false;
      state.customer_account_detail = {
        content: [],
        groupedByDate: {},
        totalElements: 0,
        totalPages: 0,
        pageable: {},
      };
    },

    // Get Detail Prabilling Init
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

    // Get Detail Prabilling Result
    [getDetailPrabillingResult.pending]: (state) => {
      state.loading = true;
    },
    [getDetailPrabillingResult.fulfilled]: (state, action) => {
      state.loading = false;
      state.detail_prabilling_result = action.payload;
    },
    [getDetailPrabillingResult.rejected]: (state) => {
      state.loading = false;
      state.detail_prabilling_result = { result: [], page: {} };
    },

    // Get Detail Prabilling Log
    [getDetailPrabillingLog.pending]: (state) => {
      state.loading_log = true;
    },
    [getDetailPrabillingLog.fulfilled]: (state, action) => {
      state.loading_log = false;
      state.detail_prabilling_log = action.payload;
    },
    [getDetailPrabillingLog.rejected]: (state) => {
      state.loading_log = false;
      state.detail_prabilling_log = {
        content: [],
        pageable: {},
        totalPages: 0,
        totalElements: 0,
      };
    },

    // Download Prabilling Result
    [downloadPrabillingResult.pending]: (state) => {
      state.loading = true;
    },
    [downloadPrabillingResult.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadPrabillingResult.rejected]: (state) => {
      state.loading = false;
    },

    // Get Log Activity Detail
    [getLogActivityDetail.pending]: (state) => {
      state.loading_detail_log = true;
      state.detail_log_activity = null;
    },
    [getLogActivityDetail.fulfilled]: (state, action) => {
      state.loading_detail_log = false;
      state.detail_log_activity = action.payload;
    },
    [getLogActivityDetail.rejected]: (state) => {
      state.loading_detail_log = false;
      state.detail_log_activity = null;
    },

    // Get list prabilling init populate
    [getListPrabillingInitPopulate.pending]: (state) => {
      state.loading = true;
      state.list_prabilling_init = [];
    },
    [getListPrabillingInitPopulate.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_prabilling_init = action.payload.content || [];
      state.prabilling_pagination = {
        totalPages: action.payload.totalPages || 0,
        totalElements: action.payload.totalElements || 0,
        currentPage: action.payload.pageable?.pageNumber || 0,
        pageSize: action.payload.pageable?.pageSize || 10,
      };
    },
    [getListPrabillingInitPopulate.rejected]: (state) => {
      state.loading = false;
      state.list_prabilling_init = [];
      state.prabilling_pagination = {
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        pageSize: 10,
      };
    },

    // Get Log Activities
    [getLogActivities.pending]: (state) => {
      state.loading_log = true;
    },
    [getLogActivities.fulfilled]: (state, action) => {
      state.loading_log = false;
      state.list_log_activities = action.payload || [];
    },
    [getLogActivities.rejected]: (state) => {
      state.loading_log = false;
      state.list_log_activities = [];
    },

    // get pagination calculation
    [getCalculationPaginate.pending]: (state, action) => {
      state.loading = true;
    },
    [getCalculationPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getCalculationPaginate.rejected]: (state, action) => {
      state.loading = false;
    },
    // get pagination calculation history
    [getHistoryCalculationPaginate.pending]: (state, action) => {
      state.loading = true;
    },
    [getHistoryCalculationPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getHistoryCalculationPaginate.rejected]: (state, action) => {
      state.loading = false;
    },
    // download excel
    [donwloadedExcel.pending]: (state, action) => {
      state.loading = true;
    },
    [donwloadedExcel.fulfilled]: (state, action) => {
      state.loading = false;
      // state.data = action.payload;
    },
    [donwloadedExcel.rejected]: (state, action) => {
      state.loading = false;
    },
    // download excel
    [donwloadedHistoryExcel.pending]: (state, action) => {
      state.loading = true;
    },
    [donwloadedHistoryExcel.fulfilled]: (state, action) => {
      state.loading = false;
      // state.data = action.payload;
    },
    [donwloadedHistoryExcel.rejected]: (state, action) => {
      state.loading = false;
    },
    // lov sor
    [getListSor.pending]: (state, action) => {
      state.loading = true;
    },
    [getListSor.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_sor = action.payload;
    },
    [getListSor.rejected]: (state, action) => {
      state.loading = false;
    },
    // lov service type
    [getListServiceType.pending]: (state, action) => {
      state.loading = true;
    },
    [getListServiceType.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_service_type = action.payload;
    },
    [getListServiceType.rejected]: (state, action) => {
      state.loading = false;
    },
    // lov scheduler type
    [getListSchedulerType.pending]: (state, action) => {
      state.loading = true;
    },
    [getListSchedulerType.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_scheduler_type = action.payload;
    },
    [getListSchedulerType.rejected]: (state, action) => {
      state.loading = false;
    },
    // lov meter reading code
    [getListMeterReadingCode.pending]: (state, action) => {
      state.loading = true;
    },
    [getListMeterReadingCode.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_meter_reading_code = action.payload;
    },
    [getListMeterReadingCode.rejected]: (state, action) => {
      state.loading = false;
    },
    // lov customer segment
    [getListCustomerSegment.pending]: (state, action) => {
      state.loading = true;
    },
    [getListCustomerSegment.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_customer_segment = action.payload;
    },
    [getListCustomerSegment.rejected]: (state, action) => {
      state.loading = false;
    },
    // lov cost center
    [getListCostCenter.pending]: (state, action) => {
      state.loading = true;
    },
    [getListCostCenter.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_cost_center = action.payload;
    },
    [getListCostCenter.rejected]: (state, action) => {
      state.loading = false;
    },
    // lov calculation type
    [getListCalculationType.pending]: (state, action) => {
      state.loading = true;
    },
    [getListCalculationType.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_calculation_type = action.payload;
    },
    [getListCalculationType.rejected]: (state, action) => {
      state.loading = false;
    },
//profile
    [getUserProfile.pending]: (state) => {
  state.loading_user_profile = true;
},
[getUserProfile.fulfilled]: (state, action) => {
  state.loading_user_profile = false;
  state.user_profile = action.payload;
  console.log('✅ User Profile Loaded:', action.payload);
},
[getUserProfile.rejected]: (state) => {
  state.loading_user_profile = false;
  state.user_profile = null;
},
    // lov account group
    [getListAccountGroup.pending]: (state, action) => {
      state.loading = true;
      state.list_account_group = [];
    },
    [getListAccountGroup.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_account_group = action.payload || [];
    },
    [getListAccountGroup.rejected]: (state, action) => {
      state.loading = false;
      state.list_account_group = [];
    },
    // lov specific customer
    [getListSpecificCustomer.pending]: (state, action) => {
      state.loading_specific_customer = true;
    },
    [getListSpecificCustomer.fulfilled]: (state, action) => {
      state.loading_specific_customer = false;
      // Pastikan mengambil data dari response.data atau response
      const responseData = action.payload?.data || action.payload || [];
      state.list_specific_customer = Array.isArray(responseData) ? responseData : [];
      state.specific_customer_message = action.payload?.message || "";
      
      console.log("✅ Customer Data Received:", state.list_specific_customer);
    },
    [getListSpecificCustomer.rejected]: (state, action) => {
      state.loading_specific_customer = false;
      state.list_specific_customer = [];
      state.specific_customer_message = "";
    },
    
    // lov billing cycle
    [getListBillingCycle.pending]: (state, action) => {
      state.loading = true;
    },
    [getListBillingCycle.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_billing_cycle = action.payload;
    },
    [getListBillingCycle.rejected]: (state, action) => {
      state.loading = false;
    },
    // lov billing period
    [getListBillingPeriod.pending]: (state, action) => {
      state.loading = true;
    },
    [getListBillingPeriod.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_billing_period = action.payload;
    },
    [getListBillingPeriod.rejected]: (state, action) => {
      state.loading = false;
    },
    // lov user detail calculation
    [getUserDetailCalculation.pending]: (state, action) => {
      state.loading = true;
    },
    [getUserDetailCalculation.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_user_calculation = action.payload;
    },
    [getUserDetailCalculation.rejected]: (state, action) => {
      state.loading = false;
    },

    // create calculation
    [createPrabilling.pending]: (state, action) => {
      state.loading = true;
    },
    [createPrabilling.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [createPrabilling.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

const { reducer } = prabillingSlice;
export default reducer;
