import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import userHttpService from "../../services/userHttpService";
import { setBodyError, showModalError, validateError } from "../general_slice";

const initialState = {
  data: [],
  loading: false,
  loadingModal: false,
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
    pricing: false,
    saTos: false,
    tosSub: false,
    billingBucket: false,
    billingItem: false,
    saPrcRuleDet: false,
  },
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
};

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
      const url = "/v1/dbs/api/profile/view-profile";
      const response = await userHttpService.getAll(url);
      // Ambil data langsung dari response
      return response.data?.data || response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      console.error("Error fetching user profile:", message);
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
  }
);

// get prabill list
export const getListPrabillingInitPopulate = createAsyncThunk(
  "GET_LIST_PRABILLING_INIT_POPULATE",
  async ({ search, page, pageSize, sort, isLoadMore = false }, thunkAPI) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "createdDtm~desc";
      const url = `/v1/dbs/api/prabill-init-populate/list?sort=${sortParams}&size=${pageSize}&page=${page}&searchs=${searchParams}`;

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

// Update untuk getDetailPrabillingInit thunk
export const getDetailPrabillingInit = createAsyncThunk(
  "GET_DETAIL_PRABILLING_INIT",
  async (initCode, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/prabill/${initCode}`;
      const response = await ratingBillingHttpService.getDetail(url);

      const contentType = response.headers?.["content-type"];
      if (contentType && contentType.includes("text/html")) {
        throw new Error(
          "Received HTML response - Server may be in maintenance mode"
        );
      }

      // Akses data sesuai struktur response
      const responseData = response.data?.data || response.data || response;
      const prabillInitPopulate = responseData.prabillInitPopulate || {};
      const details = responseData.details || [];

      // Proses details untuk mengekstrak data yang unik
      const detailsProcessed = details.map((detail) => ({
        initCode: detail.initCode,
        createdBy: detail.createdBy,
        createdDtm: detail.createdDtm,
        sorId: detail.sorId,
        sor: detail.sor,
        costCenter: detail.costCenter,
        costCenterName: detail.costCenterName,
        meterReadingCode: detail.meterReadingCode,
        meterReadingCodeName: detail.meterReadingCodeName,
        accountSegment: detail.accountSegment,
        accountSegmentName: detail.accountSegmentName,
        accountGroupType: detail.accountGroupType,
        accountGroupTypeName: detail.accountGroupTypeName,
        accountNumber: detail.accountNumber,
        accoutnName: detail.accoutnName, // Typo dari backend
      }));

      // Kembalikan struktur yang lengkap
      return {
        prabillInitPopulate: {
          initId: prabillInitPopulate.initId,
          initCode: prabillInitPopulate.initCode,
          processName: prabillInitPopulate.processName,
          billingCycle: prabillInitPopulate.billingCycle,
          billPeriod: prabillInitPopulate.billPeriod,
          sor: prabillInitPopulate.sor,
          sorId: prabillInitPopulate.sorId,
          totalCustomer: prabillInitPopulate.totalCustomer,
          status: prabillInitPopulate.status,
          message: prabillInitPopulate.message,
          remark: prabillInitPopulate.remark,
          createdBy: prabillInitPopulate.createdBy,
          createdDtm: prabillInitPopulate.createdDtm,
          updateDtm: prabillInitPopulate.updateDtm,
          billPeriodId: prabillInitPopulate.billPeriodId,
          billingCycleId: prabillInitPopulate.billingCycleId,
          shceduleType: prabillInitPopulate.shceduleType,
          schedulerTime: prabillInitPopulate.schedulerTime,
        },
        details: detailsProcessed,
      };
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

export const getDetailPrabillingResult = createAsyncThunk(
  "GET_DETAIL_PRABILLING_RESULT",
  async (
    { initCode, search, page, pageSize, sort, isLoadMore = false },
    thunkAPI
  ) => {
    try {
      let url = `/v1/dbs/api/prabill/detail?search=${encodeURIComponent(
        initCode
      )}&page=${page}&size=${pageSize}`;

      if (sort) {
        url += `&sort=${sort}`;
      }

      if (search && Object.keys(search).length > 0) {
        url += `&searchs=${encodeURIComponent(JSON.stringify(search))}`;
      }

      const response = await ratingBillingHttpService.getPagination(url);

      // Response structure sama dengan log:
      // { success, code, message, data: { result, page, links } }
      const apiData = response.data?.data || response.data;

      return {
        result: apiData?.result || [],
        page: apiData?.page || {
          size: 10,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
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
  async (
    {
      initCode,
      page = 0,
      size = 10,
      sort = "",
      search = "",
      isLoadMore = false,
    },
    thunkAPI
  ) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "createdDtm~desc";

      const url = `/v1/dbs/api/logs/prabill-init-populate/${encodeURIComponent(
        initCode
      )}?page=${page}&size=${size}&sort=${sortParams}&searchs=${searchParams}`;

      const response = await ratingBillingHttpService.getAll(url);

      // Response structure: { success, code, message, data: { result, page } }
      const apiData = response.data?.data || response.data;

      return {
        result: apiData?.result || [],
        page: apiData?.page || {
          size: 10,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
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
          description: `Failed to fetch prabilling log: ${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Prabilling Account Log
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
    thunkAPI
  ) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "createdDate~desc";

      const url = `/v1/dbs/api/prabill/status-account?initCode=${encodeURIComponent(
        initCode
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
  }
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

      // Data baru
      const dataBillingBucket = responseData.dataBillingBucket || [];
      const dataBillingItem = responseData.dataBillingItem || [];
      const dataSAPrcRuleDet = responseData.dataSAPrcRuleDet || [];

      // Process Usage Data
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

      // Process Tax Data
      const taxData = dataTaxImp.map((item) => ({
        category: item.category,
        taxImpName: item.taxImpName,
        serviceType: item.serviceType,
        impType: item.impType,
        gunggung: item.gunggung,
        ratingCode: item.ratingCode,
      }));

      // Process Pricing Data
      const pricingData = dataSaPrcrule.map((item) => ({
        lineNumber: item.lineNumber,
        priceCode: item.priceCodeRule || item.priceCode,
        min: item.min,
        max: item.max,
        value: item.priceValue,
        uom: item.priceUom,
        priceCurrency: item.priceCurrency,
      }));

      // Process SA Data
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

      // Process SA TOS Detail
      const saTosDet = dataSATosDet.map((item) => ({
        saTosName: item.saTosName,
        attributeName: item.attributeName,
        value: item.value,
      }));

      // Process TOS Sub Detail
      const tosSubDet = dataTosSubDet.map((item) => ({
        tosName: item.tosName,
        attributeName: item.attributeName,
        unit: item.unit,
        value: item.value,
        fromItem: item.fromItem,
      }));

      // Process Billing Bucket Data (BARU)
      const billingBucketData = dataBillingBucket.map((item) => ({
        bucketCode: item.bucketCode,
        bucketName: item.bucketName,
        bucketPriority: item.bucketPriority,
        validStartDate: item.validStartDate,
        validEndDate: item.validEndDate,
      }));

      // Process Billing Item Data (BARU)
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

      // Process SA Price Rule Detail Data (BARU)
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
  }
);

// Update download function
export const downloadPrabillingResult = createAsyncThunk(
  "DOWNLOAD_PRABILLING_RESULT",
  async ({ initCode }, thunkAPI) => {
    try {
      // Update endpoint sesuai dengan backend baru
      const url = `/v1/dbs/api/download?search=${encodeURIComponent(initCode)}`;

      const response = await ratingBillingHttpService.downloadDataPrabill(url);
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

// Get Header Data (Customer & Account Info)
export const getCustomerHeaderData = createAsyncThunk(
  "GET_CUSTOMER_HEADER_DATA",
  async (params, thunkAPI) => {
    try {
      const { customerNumber, billPeriod, inSor, accNumber, saNumber } = params;

      if (!customerNumber || !billPeriod || !inSor) {
        throw new Error("Missing required parameters");
      }

      let url = `/v1/dbs/api/customer-data?customerNumber=${encodeURIComponent(
        customerNumber
      )}&billPeriod=${encodeURIComponent(
        billPeriod
      )}&inSor=${encodeURIComponent(inSor)}`;

      if (accNumber) url += `&accNumber=${encodeURIComponent(accNumber)}`;
      if (saNumber) url += `&saNumber=${encodeURIComponent(saNumber)}`;

      const response = await ratingBillingHttpService.getAll(url);
      const responseData = response.data?.data || response.data;

      // Return semua data array, bukan hanya item pertama
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
  }
);

// Get Usage Data
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
        customerNumber
      )}&billPeriod=${encodeURIComponent(
        billPeriod
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
  }
);

// Get Tax Data
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
        customerNumber
      )}&billPeriod=${encodeURIComponent(
        billPeriod
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
  }
);

// Get Billing Bucket Data
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
        customerNumber
      )}&billPeriod=${encodeURIComponent(
        billPeriod
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
  }
);

// Get Billing Item Data
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
        customerNumber
      )}&billPeriod=${encodeURIComponent(
        billPeriod
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
  }
);

// Get SA PRC Rule Detail Data
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
        customerNumber
      )}&billPeriod=${encodeURIComponent(
        billPeriod
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
  }
);

// get sa cust data
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
          "Missing required parameters: customerNumber or billPeriod"
        );
      }

      let url = `/v1/dbs/api/prabill/service-agreement?customerNumber=${encodeURIComponent(
        customerNumber
      )}&billPeriod=${encodeURIComponent(
        billPeriod
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
  }
);

// Get SA Detail
export const getPrabillSaDetail = createAsyncThunk(
  "GET_PRABILL_SA_DETAIL",
  async (
    { prabillSaId, page = 0, size = 10, search = "", sort = "" },
    thunkAPI
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
  }
);

// Get SA Calculation Rule
export const getPrabillSaCalcRule = createAsyncThunk(
  "GET_PRABILL_SA_CALC_RULE",
  async (
    { prabillSaId, page = 0, size = 10, search = "", sort = "" },
    thunkAPI
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
  }
);

// Get SA Price Rule
export const getPrabillSaPriceRule = createAsyncThunk(
  "GET_PRABILL_SA_PRICE_RULE",
  async (
    { prabillSaId, page = 0, size = 10, search = "", sort = "" },
    thunkAPI
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
  }
);

// Get SA Price Detail
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
  }
);

// Get SA TOS Detail
export const getPrabillSaTosDetail = createAsyncThunk(
  "GET_PRABILL_SA_TOS_DETAIL",
  async (
    { prabillSaId, page = 0, size = 10, search = "", sort = "" },
    thunkAPI
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
  }
);

// Get SA TOS
export const getPrabillSaTos = createAsyncThunk(
  "GET_PRABILL_SA_TOS",
  async (
    { prabillSaId, page = 0, size = 10, search = "", sort = "" },
    thunkAPI
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
  }
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
  },
  extraReducers: {
    //sa data
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
    // SA Detail
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

    // SA Calc Rule
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

    // SA Price Rule
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

    // SA Price Det
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

    // SA TOS Detail
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

    // SA TOS
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
    // Header Data
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

    // Usage Data
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

    // Tax Data
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

    // Billing Bucket Data
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

    // Billing Item Data
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

    // SA PRC Rule Det Data
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
    [getDetailPrabillingResult.pending]: (state, action) => {
      // Only show loading on initial fetch, not on load more
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getDetailPrabillingResult.fulfilled]: (state, action) => {
      state.loading = false;
      const newData = action.payload.result || [];
      const isLoadMore = action.payload.isLoadMore;

      // If it's load more, append data. Otherwise, replace data
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
      // Only clear data on initial fetch failure, not on load more failure
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

    // Get Detail Prabilling Log
    [getDetailPrabillingLog.pending]: (state, action) => {
      // Only show loading on initial fetch, not on load more
      if (!action.meta.arg?.isLoadMore) {
        state.loading_log = true;
      }
    },
    [getDetailPrabillingLog.fulfilled]: (state, action) => {
      state.loading_log = false;
      const newData = action.payload.result || [];
      const isLoadMore = action.payload.isLoadMore;

      // If it's load more, append data. Otherwise, replace data
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
      // Only clear data on initial fetch failure, not on load more failure
      if (!action.meta.arg?.isLoadMore) {
        state.detail_prabilling_log = {
          content: [],
          pageable: {},
          totalPages: 0,
          totalElements: 0,
        };
      }
    },

    // Get Prabilling Account Log
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

    // Get list prabilling init populate
    [getListPrabillingInitPopulate.pending]: (state, action) => {
      // Only show loading on initial fetch, not on load more
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getListPrabillingInitPopulate.fulfilled]: (state, action) => {
      state.loading = false;
      const newData = action.payload.result || [];
      const isLoadMore = action.payload.isLoadMore;

      // If it's load more, append data. Otherwise, replace data
      if (isLoadMore) {
        state.list_prabilling_init = [
          ...state.list_prabilling_init,
          ...newData,
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
      // Only clear data on initial fetch failure, not on load more failure
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
    //profile
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
      // Pastikan mengambil data dari response.data atau response
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
      // Data sudah dalam bentuk array yang sudah di-transform
      state.list_billing_cycle = action.payload;
    },
    [getListBillingCycle.rejected]: (state) => {
      state.loading = false;
      state.list_billing_cycle = [];
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
    // lov component prabilling
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
    [createPrabilling.pending]: (state) => {
      state.loading = true;
    },
    [createPrabilling.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [createPrabilling.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export const { resetCustomerDetail } = prabillingSlice.actions;
const { reducer } = prabillingSlice;
export default reducer;
