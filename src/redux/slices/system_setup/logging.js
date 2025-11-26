import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import { showModalError, setBodyError } from "../general_slice";

const initialState = {
  list_logging: [],
  loading_logging: false,
  pagination: {
    page: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
  },
  filters: {
    search: {},
    sort: "createdDtm~desc",
  },
};

// Helper function untuk build search params
// Format: search=value (mencari di semua kolom)
const buildSearchParams = (searchObject) => {
  if (!searchObject || Object.keys(searchObject).length === 0) {
    return "";
  }

  // Ambil value pertama yang ada untuk global search
  const searchValues = Object.entries(searchObject)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(([_, value]) => value);

  // Return value pertama untuk global search
  return searchValues.length > 0 ? searchValues[0] : "";
};

export const getGlobalLogging = createAsyncThunk(
  "logging/getGlobalLogging",
  async (
    { page = 0, pageSize = 10, search = {}, sort = "createdDtm~desc" } = {},
    thunkAPI
  ) => {
    try {
      const searchParam = buildSearchParams(search);
      const sortParams = sort || "createdDtm~desc";

      // Build URL dengan URLSearchParams
      const params = new URLSearchParams({
        page: page.toString(),
        size: pageSize.toString(),
        sort: sortParams,
      });

      // Tambahkan search param jika ada (tanpa key, hanya value)
      if (searchParam) {
        params.append("search", searchParam);
      }

      const url = `/v1/dbs/api/log/view-activity?${params.toString()}`;

      const response = await ratingBillingHttpService.getPagination(url);

      return {
        data: response.data,
        requestParams: { page, pageSize, search, sort },
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
          title: "Failed to Fetch Logging",
          description: message,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }

      return thunkAPI.rejectWithValue({
        message,
        code: error?.response?.data?.code,
      });
    }
  }
);

const loggingSlice = createSlice({
  name: "logging",
  initialState,
  reducers: {
    resetLogging: () => {
      return initialState;
    },
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGlobalLogging.pending, (state) => {
        state.loading_logging = true;
      })
      .addCase(getGlobalLogging.fulfilled, (state, action) => {
        state.loading_logging = false;

        const { data, requestParams } = action.payload;
        const {
          content = [],
          pageable = {},
          totalPages = 0,
          totalElements = 0,
        } = data || {};

        state.list_logging = content;
        state.pagination = {
          page: pageable.pageNumber ?? requestParams.page ?? 0,
          pageSize: pageable.pageSize ?? requestParams.pageSize ?? 10,
          totalPages,
          totalElements,
        };

        state.filters = {
          search: requestParams.search || {},
          sort: requestParams.sort || "createdDtm~desc",
        };
      })
      .addCase(getGlobalLogging.rejected, (state) => {
        state.loading_logging = false;
        state.list_logging = [];
      });
  },
});

export const { resetLogging, setFilters, clearFilters } = loggingSlice.actions;

// Selectors
export const selectLogging = (state) => state.logging.list_logging;
export const selectLoggingLoading = (state) => state.logging.loading_logging;
export const selectLoggingPagination = (state) => state.logging.pagination;
export const selectLoggingFilters = (state) => state.logging.filters;

const { reducer } = loggingSlice;
export default reducer;
