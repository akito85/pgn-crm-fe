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
  data_promoSA: [],
  data_periodicSA: [],
  loading: false,
  data_detail: null,
  data_downlaod: null,
  loadingExpand: {},
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

      // URL dengan parameter period
      const url = `/v1/dbs/api/rating/rating-gas?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}&period=${encodeURIComponent(period)}`;

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

export const getListBillingPeriodForRating = createAsyncThunk(
  "GET_LIST_BILLING_PERIOD_FOR_RATING",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/billingperiod/1`;
      const response = await ratingBillingHttpService.getAll(url);

      // Transform data sesuai struktur response
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
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "recordId~desc" : sort;
      const url = `/v1/dbs/api/rating/list-usage/${id}?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
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

// Calculation Summary - Tabel Utama
export const getAllCalculationSummaryPaginate = createAsyncThunk(
  "GET_ALL_CALCULATION_SUMMARY_PAGINATE",
  async ({ ratingCode, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "transactionDate~desc" : sort;
      
      // Endpoint untuk tabel utama (summary)
      const url = `/v1/dbs/api/rating/summary-rating?ratingCode=${ratingCode}&page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      
      const response = await ratingBillingHttpService.getPagination(url);
      
      // Langsung return response data tanpa grouping
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

// Calculation Summary Expand - Tabel yang di-expand
export const getAllCalculationSummaryExpandPaginate = createAsyncThunk(
  "GET_ALL_CALCULATION_SUMMARY_EXPAND_PAGINATE",
  async ({ ratingCode, transactionDate, saType, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "transactionDate~desc" : sort;
      
      // Endpoint untuk detail expanded
      const url = `/v1/dbs/api/rating/summary-rating-expand?ratingCode=${ratingCode}&page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      
      const response = await ratingBillingHttpService.getPagination(url);
      
      // Return dengan identifier untuk row yang di-expand
      return {
        ...response.data,
        transactionDate,
        saType,
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
  async ({ calculationCode, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "transactionDate~desc" : sort;
      
      // API endpoint menggunakan calculationCode, bukan id
      const url = `/v1/dbs/api/rating/detail-rating?calculationCode=${calculationCode}&page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
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

      // DUMMY DATA - Hapus setelah backend ready
      await new Promise((resolve) => setTimeout(resolve, 500));

      const dummyData = {
        result: [
        ],
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
      // TODO: Ganti dengan API real setelah backend ready
      // const searchParams = search === undefined ? "" : search;
      // const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
      // const url = `/v1/dbs/api/rating/list-promo/${id}?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      // const response = await ratingBillingHttpService.getPagination(url);
      // return response.data;

      // DUMMY DATA - Sesuai dengan gambar yang diberikan
      await new Promise((resolve) => setTimeout(resolve, 500));

      const allDummyData = [
        {
          id: 1,
          name: "Promo Gas Industri Q1",
          type: "Rating",
          promotionType: "Diskon",
          promoCategory: "Volume Discount",
          adjustmentType: "Mark Up",
          adjustmentValue: "5",
        },
        {
          id: 2,
          name: "Program Loyalty 2025",
          type: "Billing",
          promotionType: "Program",
          promoCategory: "Customer Retention",
          adjustmentType: "Mark Down",
          adjustmentValue: "10",
        },
        {
          id: 3,
          name: "Early Payment Discount",
          type: "Rating & Billing",
          promotionType: "Promo",
          promoCategory: "Payment Incentive",
          adjustmentType: "Mark Up",
          adjustmentValue: "3",
        },
        {
          id: 4,
          name: "Seasonal Gas Promo",
          type: "Rating",
          promotionType: "Diskon",
          promoCategory: "Seasonal",
          adjustmentType: "Mark Down",
          adjustmentValue: "15",
        },
        {
          id: 5,
          name: "New Customer Bonus",
          type: "Billing",
          promotionType: "Program",
          promoCategory: "Acquisition",
          adjustmentType: "Mark Up",
          adjustmentValue: "7.5",
        },
        {
          id: 6,
          name: "Bundle Package Discount",
          type: "Rating & Billing",
          promotionType: "Promo",
          promoCategory: "Bundle Offer",
          adjustmentType: "Mark Down",
          adjustmentValue: "12",
        },
        {
          id: 7,
          name: "Corporate Partnership",
          type: "Rating",
          promotionType: "Diskon",
          promoCategory: "B2B Special",
          adjustmentType: "Mark Up",
          adjustmentValue: "8",
        },
        {
          id: 8,
          name: "Year End Clearance",
          type: "Billing",
          promotionType: "Program",
          promoCategory: "Clearance",
          adjustmentType: "Mark Down",
          adjustmentValue: "20",
        },
        {
          id: 9,
          name: "Referral Reward Program",
          type: "Rating & Billing",
          promotionType: "Promo",
          promoCategory: "Referral",
          adjustmentType: "Mark Up",
          adjustmentValue: "4",
        },
        {
          id: 10,
          name: "High Volume Incentive",
          type: "Rating",
          promotionType: "Diskon",
          promoCategory: "Volume Incentive",
          adjustmentType: "Mark Down",
          adjustmentValue: "18",
        },
      ];

      // Terapkan pencarian jika ada
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

      // Terapkan sorting jika ada
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

      // Terapkan pagination
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

      // DUMMY DATA - Sesuai dengan gambar yang diberikan
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

      // Terapkan pencarian jika ada
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

      // Terapkan sorting jika ada
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

      // Terapkan pagination
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
    // Get All Rating Gas Pagination
    [getListRatingGasPaginate.pending]: (state, action) => {
      // Only show loading on initial fetch, not on load more
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getListRatingGasPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      const isLoadMore = action.payload.isLoadMore;
      const newResult = action.payload?.result || [];

      // If it's load more, append data. Otherwise, replace data
      if (isLoadMore) {
        // Append new data to existing data
        state.data = {
          ...action.payload,
          result: [...(state.data?.result || []), ...newResult],
        };
      } else {
        // Replace with new data (initial load or after search/sort)
        state.data = action.payload;
      }
    },
    [getListRatingGasPaginate.rejected]: (state, action) => {
      state.loading = false;
      // Only clear data on initial fetch failure, not on load more failure
      if (!action.meta.arg?.isLoadMore) {
        state.data = [];
      }
    },

    // Get All Calculation Usage Pagination
    [getAllCalculationUsagePaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllCalculationUsagePaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_calculationUsage = action.payload;
    },
    [getAllCalculationUsagePaginate.rejected]: (state) => {
      state.loading = false;
    },

    // Get All Service Agreement Pagination
    [getAllServiceAgreementPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllServiceAgreementPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_serviceAgreement = action.payload;
    },
    [getAllServiceAgreementPaginate.rejected]: (state) => {
      state.loading = false;
    },

    // Get All Usage Service Agreement Pagination
    [getAllUsageServiceAgreementPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllUsageServiceAgreementPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_usageSA = action.payload;
    },
    [getAllUsageServiceAgreementPaginate.rejected]: (state) => {
      state.loading = false;
    },

    // Get All Detail Service Agreement Pagination
    [getAllDetailServiceAgreementPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllDetailServiceAgreementPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detailServiceAgreement = action.payload;
    },
    [getAllDetailServiceAgreementPaginate.rejected]: (state) => {
      state.loading = false;
    },

    // Get All TOS Service Agreement Pagination
    [getAllTOSServiceAgreementPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllTOSServiceAgreementPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_termOfServiceSA = action.payload;
    },
    [getAllTOSServiceAgreementPaginate.rejected]: (state) => {
      state.loading = false;
    },

    // Get All Pricing Rule Service Agreement Pagination
    [getAllPricingRuleSAPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllPricingRuleSAPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_pricingRule = action.payload;
    },
    [getAllPricingRuleSAPaginate.rejected]: (state) => {
      state.loading = false;
    },

    // Get Pricing Service Agreement
    [getDetailPricing.pending]: (state, action) => {
      state.loading = true;
      state.data_pricing = action.payload;
    },
    [getDetailPricing.fulfilled]: (state, action) => {
      state.data_pricing = action.payload;
      state.loading = false;
    },
    [getDetailPricing.rejected]: (state, action) => {
      state.data_pricing = action.payload;
      state.loading = false;
    },

    // Get All Calculation Rule Service Agreement Pagination
    [getAllCalculationRuleServiceAgreementPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllCalculationRuleServiceAgreementPaginate.fulfilled]: (
      state,
      action,
    ) => {
      state.loading = false;
      state.data_calculationRuleServiceAgreement = action.payload;
    },
    [getAllCalculationRuleServiceAgreementPaginate.rejected]: (state) => {
      state.loading = false;
    },
    

    // Get All Rating Non Gas Pagination
    [getListRatingNonGasPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getListRatingNonGasPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getListRatingNonGasPaginate.rejected]: (state) => {
      state.loading = false;
    },

    // Download Rating
    [downloadRatingGas.pending]: (state) => {
      state.loading = true;
    },
    [downloadRatingGas.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadRatingGas.rejected]: (state) => {
      state.loading = false;
    },

    // Get List Billing Period For Rating
    [getListBillingPeriodForRating.pending]: (state) => {
      state.loading = true;
    },
    [getListBillingPeriodForRating.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_billing_period = action.payload;
    },
    [getListBillingPeriodForRating.rejected]: (state) => {
      state.loading = false;
      state.list_billing_period = [];
    },

    // get detail rating gas
    [getDetailRatingGas.pending]: (state) => {
      state.loading = true;
    },
    [getDetailRatingGas.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    [getDetailRatingGas.rejected]: (state) => {
      state.loading = false;
    },
    // Get All Calculation Summary Pagination (Tabel Utama)
    [getAllCalculationSummaryPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllCalculationSummaryPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_calculationSummary = action.payload;
    },
    [getAllCalculationSummaryPaginate.rejected]: (state) => {
      state.loading = false;
      state.data_calculationSummary = [];
    },

    // Get All Calculation Summary Expand (Data di dalam expand)
    [getAllCalculationSummaryExpandPaginate.pending]: (state, action) => {
      const { transactionDate, saType } = action.meta.arg;
      const key = `${transactionDate}-${saType}`;
      state.loadingExpand[key] = true;
    },
    [getAllCalculationSummaryExpandPaginate.fulfilled]: (state, action) => {
      const { transactionDate, saType } = action.payload;
      const key = `${transactionDate}-${saType}`;
      state.loadingExpand[key] = false;
      state.data_calculationSummaryExpand[key] = action.payload;
    },
    [getAllCalculationSummaryExpandPaginate.rejected]: (state, action) => {
      const { transactionDate, saType } = action.meta.arg;
      const key = `${transactionDate}-${saType}`;
      state.loadingExpand[key] = false;
      state.data_calculationSummaryExpand[key] = null;
    },

    // Get All Calculation Detail Pagination
    [getAllCalculationDetailPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllCalculationDetailPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_calculationDetail = action.payload;
    },
    [getAllCalculationDetailPaginate.rejected]: (state) => {
      state.loading = false;
      state.data_calculationDetail = [];
    },

    // Get All Adjustment Pagination
    [getAllAdjustmentPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllAdjustmentPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_adjustment = action.payload;
    },
    [getAllAdjustmentPaginate.rejected]: (state) => {
      state.loading = false;
      state.data_adjustment = [];
    },
    // Get All Promo Service Agreement Pagination
    [getAllPromoServiceAgreementPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllPromoServiceAgreementPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_promoSA = action.payload;
    },
    [getAllPromoServiceAgreementPaginate.rejected]: (state) => {
      state.loading = false;
      state.data_promoSA = [];
    },
    // Get All Periodic Service Agreement Pagination
    [getAllPeriodicServiceAgreementPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllPeriodicServiceAgreementPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_periodicSA = action.payload;
    },
    [getAllPeriodicServiceAgreementPaginate.rejected]: (state) => {
      state.loading = false;
      state.data_periodicSA = [];
    },
  },
});

const { reducer } = ratingSlice;
export default reducer;
