import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import { showModalError, setBodyError, validateError } from "../general_slice";

const initialState = {
  data: [],
  list_billing_period: [],
  data_calculationUsage: [],
  data_calculationSummary: [],
  data_calculationSummaryExpand: {},
  data_calculationDetail: [],
  data_adjustment: [],
  data_serviceAgreement: [],
  data_detailServiceAgreement: [],
  data_calculationRuleServiceAgreement: [],
  data_termOfServiceSA: [],
  data_pricing: [],
  data_pricingRule: [],
  data_usageSA: [],
  usage_pagination: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },
  data_promoSA: [],
  data_periodicSA: [],
  loadingList: false,
  loadingPeriod: false,
  loadingCalculation: false,
  loadingUsage: false,
  loadingSA: false,
  loadingPromo: false,
  loadingPeriodic: false,
  loadingRatingDetail: false,
  loadingDownload: false,
  data_detail: null,
  data_downlaod: null,
  loadingExpand: {},
  currentRequestId: null,
};

// list gas
export const getListRatingGasPaginate = createAsyncThunk(
  "GET_LIST_RATING_GAS_PAGINATE",
  async (
    { search, page, pageSize, sort, period, isLoadMore = false },
    thunkAPI,
  ) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;

      const url = `/v1/dbs/api/rating/rating-gas?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}&period=${encodeURIComponent(period)}`;

      const response = await ratingBillingHttpService.getPagination(url);
      const responseData = response.data?.data ?? response.data;

      return {
        ...responseData,
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

export const getListBillingPeriodForRating = createAsyncThunk(
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

export const getAllCalculationUsagePaginate = createAsyncThunk(
  "GET_ALL_CALCULATION_USAGE_PAGINATE",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rating/list-calculation-usage/${id}?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
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
    }
  },
);

export const getAllDetailServiceAgreementPaginate = createAsyncThunk(
  "GET_ALL_DETAIL_SERVICE_AGREEMENT_PAGINATE",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "name~desc" : sort;
      const url = `/v1/dbs/api/rating/list-sa-detail/${id}?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
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
    }
  },
);

export const getAllCalculationRuleServiceAgreementPaginate = createAsyncThunk(
  "GET_ALL_CALCULATION_RULE_SERVICE_AGREEMENT_PAGINATE",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "ratingSaCalculationId~asc" : sort;
      const url = `/v1/dbs/api/rating/list-sa-calculation-rule/${id}?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
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
    }
  },
);

export const getAllTOSServiceAgreementPaginate = createAsyncThunk(
  "GET_ALL_TOS_SERVICE_AGREEMENT_PAGINATE",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "ratingSaTosId~asc" : sort;
      const url = `/v1/dbs/api/rating/list-sa-tos/${id}?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
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
    }
  },
);

export const getAllServiceAgreementPaginate = createAsyncThunk(
  "GET_ALL_SERVICE_AGREEMENT_PAGINATE",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rating/list-service-agreement/${id}?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
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
    }
  },
);

export const getAllUsageServiceAgreementPaginate = createAsyncThunk(
  "GET_ALL_USAGE_SERVICE_AGREEMENT_PAGINATE",
  async (
    {
      id,
      page,
      pageSize,
      search,
      sort,
      billPeriod,
      accountNumber,
      isLoadMore = false,
      calculationCode,
    },
    thunkAPI,
  ) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "recordId~desc" : sort;

      const url = `/v1/dbs/api/rating/list-usage/${id}?billPeriod=${encodeURIComponent(billPeriod)}&accountNumber=${accountNumber}&page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}&calculationCode=${calculationCode}`;

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
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const getDetailPricing = createAsyncThunk(
  "GET_PRICING",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rating/list-sa-pricing?saNumber=${id}`;
      const data = await ratingBillingHttpService.getDetail(url);
      return data?.data;
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
    }
  },
);

export const getAllPricingRuleSAPaginate = createAsyncThunk(
  "GET_ALL_PRICING_RULE_SA_PAGINATE",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "" : sort;
      const url = `/v1/dbs/api/rating/list-sa-pricing-rule?saNumber=${id}?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
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
    }
  },
);

// list non gas
export const getListRatingNonGasPaginate = createAsyncThunk(
  "GET_LIST_RATING_NON_GAS_PAGINATE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rating/list-rating-non-gas`;
      const params = { sortParams, page, pageSize, searchParams };
      const response = await ratingBillingHttpService.getListPagination(
        url,
        params,
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
    }
  },
);

// download feat
export const downloadRatingGas = createAsyncThunk(
  "DOWNLOAD_LIST",
  async ({ search, page, pageSize, sort, billPeriodId }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rating/download-filter-gas?billPeriodId=${billPeriodId}&searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;

      const response = await ratingBillingHttpService.downloadData(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "DOWNLOAD_LIST", back: false }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// get detail rating gas
export const getDetailRatingGas = createAsyncThunk(
  "GET_DETAIL_RATING_GAS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rating/rating-detail/${id}`;
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
    }
  },
);

// Calculation Summary
export const getAllCalculationSummaryPaginate = createAsyncThunk(
  "GET_ALL_CALCULATION_SUMMARY_PAGINATE",
  async (
    {
      ratingCode,
      calculationCode,
      page,
      pageSize,
      search,
      sort,
      isLoadMore = false,
    },
    thunkAPI,
  ) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "transactionDate~desc" : sort;

      const url = `/v1/dbs/api/rating/summary-rating?ratingCode=${ratingCode}&calculationCode=${calculationCode}&page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;

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

// Calculation Summary Expand
export const getAllCalculationSummaryExpandPaginate = createAsyncThunk(
  "GET_ALL_CALCULATION_SUMMARY_EXPAND_PAGINATE",
  async (
    { id, ratingCode, calculationCode, saType, page, pageSize, search, sort },
    thunkAPI,
  ) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "ratingLineId~asc" : sort;

      const url = `/v1/dbs/api/rating/summary-rating-expand?ratingCode=${ratingCode}&calculationCode=${calculationCode}&saType=${saType}&page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;

      const response = await ratingBillingHttpService.getPagination(url);
      return {
        ...response.data,
        id,
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

// GET CALCULATION DETAIL
export const getAllCalculationDetailPaginate = createAsyncThunk(
  "GET_ALL_CALCULATION_DETAIL_PAGINATE",
  async (
    {
      ratingCode,
      calculationCode,
      page,
      pageSize,
      search,
      sort,
      isLoadMore = false,
    },
    thunkAPI,
  ) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "transactionDate~desc" : sort;

      // API endpoint menggunakan calculationCode, bukan id
      const url = `/v1/dbs/api/rating/detail-rating?ratingCode=${ratingCode}&calculationCode=${calculationCode}&page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
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

// GET ADJUSTMENT
export const getAllAdjustmentPaginate = createAsyncThunk(
  "GET_ALL_ADJUSTMENT_PAGINATE",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      // TODO: Ganti dengan API real setelah backend ready
      // const searchParams = search === undefined ? "" : search;
      // const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
      // const url = `/v1/dbs/api/rating/list-adjustment/${id}?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      // const response = await ratingBillingHttpService.getPagination(url);
      // return response.data;
      await new Promise((resolve) => setTimeout(resolve, 500));

      const dummyData = {
        result: [],
        page: {
          totalElements: 0,
          totalPages: 0,
          size: pageSize,
          number: page - 1,
        },
      };

      return dummyData;
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

// GET PROMO
export const getAllPromoServiceAgreementPaginate = createAsyncThunk(
  "GET_ALL_PROMO_SERVICE_AGREEMENT_PAGINATE",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "lineNumber~asc" : sort;
      const url = `/v1/dbs/api/rating/get-rating-promo?ratingCode=${id}&page=${page - 1}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      const responseData = response.data?.data ?? response.data;
      return responseData;
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

// get periodic
export const getAllPeriodicServiceAgreementPaginate = createAsyncThunk(
  "GET_ALL_PERIODIC_SERVICE_AGREEMENT_PAGINATE",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      // TODO: Ganti dengan API real setelah backend ready
      // const searchParams = search === undefined ? "" : search;
      // const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
      // const url = `/v1/dbs/api/rating/list-periodic/${id}?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      // const response = await ratingBillingHttpService.getPagination(url);
      // return response.data;
      await new Promise((resolve) => setTimeout(resolve, 500));

      const allDummyData = [
        {
          id: 1,
          uom: "M3",
          totalEstUsage: 100.0,
          totalEstAmount: 150000.0,
          accMinContract: 300.0,
          accMaxContract: 360.0,
          adjustmentUsage: 70.0,
        },
        {
          id: 2,
          uom: "M3",
          totalEstUsage: 200.0,
          totalEstAmount: 250000.0,
          accMinContract: 400.0,
          accMaxContract: 500.0,
          adjustmentUsage: 80.0,
        },
        {
          id: 3,
          uom: "M3",
          totalEstUsage: 150.0,
          totalEstAmount: 180000.0,
          accMinContract: 350.0,
          accMaxContract: 420.0,
          adjustmentUsage: 65.0,
        },
      ];

      let filteredData = [...allDummyData];

      if (search && Object.keys(search).length > 0) {
        filteredData = filteredData.filter((item) => {
          return Object.keys(search).every((key) => {
            if (!search[key]) return true;
            const itemValue = String(item[key] || "").toLowerCase();
            const searchValue = String(search[key]).toLowerCase();
            return itemValue.includes(searchValue);
          });
        });
      }

      if (sort) {
        const [field, order] = sort.split("~");
        filteredData.sort((a, b) => {
          const aVal = a[field] || "";
          const bVal = b[field] || "";

          if (order === "asc") {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
      }

      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      const dummyResponse = {
        result: paginatedData,
        page: {
          totalElements: filteredData.length,
          totalPages: Math.ceil(filteredData.length / pageSize),
          size: pageSize,
          number: page - 1,
        },
      };

      return dummyResponse;
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

const ratingSlice = createSlice({
  name: "rating",
  initialState,
  extraReducers: {
    [getListRatingGasPaginate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loadingList = true;
        state.currentRequestId = action.meta.requestId;
      }
    },
    [getListRatingGasPaginate.fulfilled]: (state, action) => {
      const isLoadMore = action.payload?.isLoadMore;

      if (!isLoadMore && action.meta.requestId !== state.currentRequestId) {
        return;
      }

      state.loadingList = false;
      const newResult = action.payload?.result || [];

      if (isLoadMore) {
        const existingIds = new Set(
          (state.data?.result || []).map((item) => item.ratingCode),
        );
        const uniqueNewData = newResult.filter(
          (item) => !existingIds.has(item.ratingCode),
        );
        state.data = {
          ...action.payload,
          result: [...(state.data?.result || []), ...uniqueNewData],
        };
      } else {
        state.data = action.payload;
      }
    },
    [getListRatingGasPaginate.rejected]: (state, action) => {
      state.loadingList = false;
      if (!action.meta.arg?.isLoadMore) {
        state.data = [];
      }
    },

    // Get All Calculation Usage Pagination
    [getAllCalculationUsagePaginate.pending]: (state) => {
      state.loadingSA = true;
    },
    [getAllCalculationUsagePaginate.fulfilled]: (state, action) => {
      state.loadingSA = false;
      state.data_calculationUsage = action.payload;
    },
    [getAllCalculationUsagePaginate.rejected]: (state) => {
      state.loadingSA = false;
    },

    // Get All Service Agreement Pagination
    [getAllServiceAgreementPaginate.pending]: (state) => {
      state.loadingSA = true;
    },
    [getAllServiceAgreementPaginate.fulfilled]: (state, action) => {
      state.loadingSA = false;
      state.data_serviceAgreement = action.payload;
    },
    [getAllServiceAgreementPaginate.rejected]: (state) => {
      state.loadingSA = false;
    },

    // Get All Usage Service Agreement Pagination
    [getAllUsageServiceAgreementPaginate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loadingUsage = true;
      }
    },
    [getAllUsageServiceAgreementPaginate.fulfilled]: (state, action) => {
      state.loadingUsage = false;
      const newData = action.payload?.result || [];
      const isLoadMore = action.payload?.isLoadMore;

      if (isLoadMore) {
        const existingIds = new Set(
          (state.data_usageSA?.result || []).map((item) => item.recordId),
        );
        const uniqueNewData = newData.filter(
          (item) => !existingIds.has(item.recordId),
        );
        state.data_usageSA = {
          ...action.payload,
          result: [...(state.data_usageSA?.result || []), ...uniqueNewData],
        };
      } else {
        state.data_usageSA = action.payload;
      }

      state.usage_pagination = {
        totalPages: action.payload?.page?.totalPages || 0,
        totalElements: action.payload?.page?.totalElements || 0,
        currentPage: action.payload?.page?.number || 0,
        pageSize: action.payload?.page?.size || 10,
      };
    },
    [getAllUsageServiceAgreementPaginate.rejected]: (state, action) => {
      state.loadingUsage = false;
      if (!action.meta.arg?.isLoadMore) {
        state.data_usageSA = [];
        state.usage_pagination = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 10,
        };
      }
    },

    // Get All Detail Service Agreement Pagination
    [getAllDetailServiceAgreementPaginate.pending]: (state) => {
      state.loadingSA = true;
    },
    [getAllDetailServiceAgreementPaginate.fulfilled]: (state, action) => {
      state.loadingSA = false;
      state.data_detailServiceAgreement = action.payload;
    },
    [getAllDetailServiceAgreementPaginate.rejected]: (state) => {
      state.loadingSA = false;
    },

    // Get All TOS Service Agreement Pagination
    [getAllTOSServiceAgreementPaginate.pending]: (state) => {
      state.loadingSA = true;
    },
    [getAllTOSServiceAgreementPaginate.fulfilled]: (state, action) => {
      state.loadingSA = false;
      state.data_termOfServiceSA = action.payload;
    },
    [getAllTOSServiceAgreementPaginate.rejected]: (state) => {
      state.loadingSA = false;
    },

    // Get All Pricing Rule Service Agreement Pagination
    [getAllPricingRuleSAPaginate.pending]: (state) => {
      state.loadingSA = true;
    },
    [getAllPricingRuleSAPaginate.fulfilled]: (state, action) => {
      state.loadingSA = false;
      state.data_pricingRule = action.payload;
    },
    [getAllPricingRuleSAPaginate.rejected]: (state) => {
      state.loadingSA = false;
    },

    // Get Pricing Service Agreement
    [getDetailPricing.pending]: (state, action) => {
      state.loadingSA = true;
      state.data_pricing = action.payload;
    },
    [getDetailPricing.fulfilled]: (state, action) => {
      state.data_pricing = action.payload;
      state.loadingSA = false;
    },
    [getDetailPricing.rejected]: (state, action) => {
      state.data_pricing = action.payload;
      state.loadingSA = false;
    },

    // Get All Calculation Rule Service Agreement Pagination
    [getAllCalculationRuleServiceAgreementPaginate.pending]: (state) => {
      state.loadingSA = true;
    },
    [getAllCalculationRuleServiceAgreementPaginate.fulfilled]: (
      state,
      action,
    ) => {
      state.loadingSA = false;
      state.data_calculationRuleServiceAgreement = action.payload;
    },
    [getAllCalculationRuleServiceAgreementPaginate.rejected]: (state) => {
      state.loadingSA = false;
    },

    // Get All Rating Non Gas Pagination
    [getListRatingNonGasPaginate.pending]: (state) => {
      state.loadingList = true;
    },
    [getListRatingNonGasPaginate.fulfilled]: (state, action) => {
      state.loadingList = false;
      state.data = action.payload;
    },
    [getListRatingNonGasPaginate.rejected]: (state) => {
      state.loadingList = false;
    },

    // Download Rating
    [downloadRatingGas.pending]: (state) => {
      state.loadingDownload = true;
    },
    [downloadRatingGas.fulfilled]: (state) => {
      state.loadingDownload = false;
    },
    [downloadRatingGas.rejected]: (state) => {
      state.loadingDownload = false;
    },

    // Get List Billing Period For Rating
    [getListBillingPeriodForRating.pending]: (state) => {
      state.loadingPeriod = true;
    },
    [getListBillingPeriodForRating.fulfilled]: (state, action) => {
      state.loadingPeriod = false;
      state.list_billing_period = action.payload;
    },
    [getListBillingPeriodForRating.rejected]: (state) => {
      state.loadingPeriod = false;
      state.list_billing_period = [];
    },

    // get detail rating gas
    [getDetailRatingGas.pending]: (state) => {
      state.loadingRatingDetail = true;
    },
    [getDetailRatingGas.fulfilled]: (state, action) => {
      state.loadingRatingDetail = false;
      state.data_detail = action.payload;
    },
    [getDetailRatingGas.rejected]: (state) => {
      state.loadingRatingDetail = false;
    },
    // Get All Calculation Summary
    [getAllCalculationSummaryPaginate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loadingCalculation = true;
      }
    },
    [getAllCalculationSummaryPaginate.fulfilled]: (state, action) => {
      state.loadingCalculation = false;
      const isLoadMore = action.payload.isLoadMore;
      const newResult = action.payload?.result || [];

      if (isLoadMore) {
        const existingIds = new Set(
          (state.data_calculationSummary?.result || []).map((item) => item.id),
        );
        const uniqueNewData = newResult.filter(
          (item) => !existingIds.has(item.id),
        );
        state.data_calculationSummary = {
          ...action.payload,
          result: [
            ...(state.data_calculationSummary?.result || []),
            ...uniqueNewData,
          ],
        };
      } else {
        state.data_calculationSummary = action.payload;
      }
    },
    [getAllCalculationSummaryPaginate.rejected]: (state, action) => {
      state.loadingCalculation = false;
      if (!action.meta.arg?.isLoadMore) {
        state.data_calculationSummary = [];
      }
    },

    // Get All Calculation Summary Expand
    [getAllCalculationSummaryExpandPaginate.pending]: (state, action) => {
      const { id } = action.meta.arg;
      state.loadingExpand[id] = true;
    },
    [getAllCalculationSummaryExpandPaginate.fulfilled]: (state, action) => {
      const { id } = action.payload;
      state.loadingExpand[id] = false;
      state.data_calculationSummaryExpand[id] = action.payload;
    },
    [getAllCalculationSummaryExpandPaginate.rejected]: (state, action) => {
      const { id } = action.meta.arg;
      state.loadingExpand[id] = false;
      state.data_calculationSummaryExpand[id] = null;
    },

    // Get All Calculation Detail Pagination
    [getAllCalculationDetailPaginate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loadingCalculation = true;
      }
    },
    [getAllCalculationDetailPaginate.fulfilled]: (state, action) => {
      state.loadingCalculation = false;
      const isLoadMore = action.payload.isLoadMore;
      const newResult = action.payload?.result || [];

      if (isLoadMore) {
        const existingIds = new Set(
          (state.data_calculationDetail?.result || []).map(
            (item) => item.ratingDetailId,
          ),
        );
        const uniqueNewData = newResult.filter(
          (item) => !existingIds.has(item.ratingDetailId),
        );
        state.data_calculationDetail = {
          ...action.payload,
          result: [
            ...(state.data_calculationDetail?.result || []),
            ...uniqueNewData,
          ],
        };
      } else {
        state.data_calculationDetail = action.payload;
      }
    },
    [getAllCalculationDetailPaginate.rejected]: (state, action) => {
      state.loadingCalculation = false;
      if (!action.meta.arg?.isLoadMore) {
        state.data_calculationDetail = [];
      }
    },

    // Get All Adjustment Pagination
    [getAllAdjustmentPaginate.pending]: (state) => {
      state.loadingCalculation = true;
    },
    [getAllAdjustmentPaginate.fulfilled]: (state, action) => {
      state.loadingCalculation = false;
      state.data_adjustment = action.payload;
    },
    [getAllAdjustmentPaginate.rejected]: (state) => {
      state.loadingCalculation = false;
      state.data_adjustment = [];
    },
    // Get All Promo Service Agreement Pagination
    [getAllPromoServiceAgreementPaginate.pending]: (state) => {
      state.loadingPromo = true;
    },
    [getAllPromoServiceAgreementPaginate.fulfilled]: (state, action) => {
      state.loadingPromo = false;
      state.data_promoSA = action.payload;
    },
    [getAllPromoServiceAgreementPaginate.rejected]: (state) => {
      state.loadingPromo = false;
      state.data_promoSA = [];
    },
    // Get All Periodic Service Agreement Pagination
    [getAllPeriodicServiceAgreementPaginate.pending]: (state) => {
      state.loadingPeriodic = true;
    },
    [getAllPeriodicServiceAgreementPaginate.fulfilled]: (state, action) => {
      state.loadingPeriodic = false;
      state.data_periodicSA = action.payload;
    },
    [getAllPeriodicServiceAgreementPaginate.rejected]: (state) => {
      state.loadingPeriodic = false;
      state.data_periodicSA = [];
    },
  },
});

const { reducer } = ratingSlice;
export default reducer;
