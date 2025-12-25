import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import { showModalError, setBodyError, validateError } from "../general_slice";

const initialState = {
  data: [],
  data_calculationUsage: [],
  data_serviceAgreement: [],
  data_detailServiceAgreement: [],
  data_calculationRuleServiceAgreement: [],
  data_termOfServiceSA: [],
  data_pricing: [],
  data_pricingRule: [],
  data_usageSA: [],
  loading: false,
  data_detail: null,
  data_downlaod: null,
};

// list gas
export const getListRatingGasPaginate = createAsyncThunk(
  "GET_LIST_RATING_GAS_PAGINATE",
  async ({ search, page, pageSize, sort, isLoadMore = false }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rating/list-rating-gas?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
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
  }
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
  }
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
  }
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
  }
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
  }
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
  }
);

export const getDetailPricing = createAsyncThunk(
  "GET_PRICING",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rating/list-sa-pricing/${id}`;
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
  }
);

export const getAllPricingRuleSAPaginate = createAsyncThunk(
  "GET_ALL_PRICING_RULE_SA_PAGINATE",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "" : sort;
      const url = `/v1/dbs/api/rating/list-sa-pricing-rule/${id}?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
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
  }
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
    }
  }
);

// download feat
export const downloadRatingGas = createAsyncThunk(
  "DOWNLOAD_LIST",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rating/download-filter-gas?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "DOWNLOAD_LIST", back: false })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
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
  }
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
          result: [
            ...(state.data?.result || []),
            ...newResult
          ]
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
      action
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
  },
});

const { reducer } = ratingSlice;
export default reducer;
