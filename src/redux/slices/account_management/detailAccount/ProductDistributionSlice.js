import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showModalSuccess, validateError } from "../../general_slice";
import {
  errorBody,
  errorCode,
  errorMessage,
  hasValue,
} from "../../../../utils";
import accountManagementService from "../../../services/account_management/accountManagementService";

const initialState = {
  loading: false,
  data_current: {},
  data: [],
  data_detail: {},
  data_detail_history: {},
  data_country: {},
  dataDelete: {},
  list_productDistributionHistory: [],
  pagination_productDistributionHistory: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },
};

export const createPD = createAsyncThunk(
  "CREATE_PD",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/source-distribution/create-update`;
      const data = await accountManagementService.createData(url, body);
      const successBody = {
        title: "Successfully",
        description: `Your data has been created`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "CREATE_PD",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updatePD = createAsyncThunk(
  "UPDATE_PD",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/source-distribution/create-update`;
      const data = await accountManagementService.createData(url, body);
      const successBody = {
        title: "Successfully",
        description: `Your data has been updated`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "UPDATE_PD",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAllPDHistoryPaginate = createAsyncThunk(
  "GET_ALL_PBHistory_PAGINATE",
  async ({ id, search, page, pageSize, sort, isLoadMore }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/account-detail/source-distribution/view-paging/product-distribution/${id}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getAll(url);
      return {
        ...response.data,
        isLoadMore
      };
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_PBHistory_PAGINATE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getCurrentPB = createAsyncThunk(
  "GET_CURRENT_PRODUCT_DISTRIBUTION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/source-distribution/view-detail-current/product-distribution/${id}`;
      if (hasValue(id)) {
        const response = await accountManagementService.getDetail(url);
        return response.data;
      }
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_CURRENT_PRODUCT_DISTRIBUTION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getDetailPDHistory = createAsyncThunk(
  "GET_DETAIL_PDHistory",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/source-distribution/view-detail/product-distribution/${id}`;
      if (hasValue(id)) {
        const response = await accountManagementService.getDetail(url);
        return response.data;
      }
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_DETAIL_PDHistory" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const deletePD = createAsyncThunk("DELETE_PD", async (id, thunkAPI) => {
  try {
    const url = `/v1/dbs/api/account-detail/source-distribution/soft-delete/product-distribution/${id}`;
    if (hasValue(id)) {
      const response = await accountManagementService.deleteData(url);
      thunkAPI.dispatch(showModalSuccess({
        return: false,
        title: "Successfully",
        description: `Your data has been deleted`,
      }));
      return response.data;
    }
  } catch (error) {
    thunkAPI.dispatch(validateError({ error, action: "DELETE_PD" }));
    return thunkAPI.rejectWithValue(
      error.response.data.code === 419 ? null : error.response.data
    );
  }
});

export const getCountryPD = createAsyncThunk(
  "GET_COUNTRY_PD",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/source-distribution/drop-down-list/country-name`;
      const data = await accountManagementService.getAll(url);
      return data.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_COUNTRY_PD",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

const productDistributionSlice = createSlice({
  name: "productDistribution",
  initialState,
  extraReducers: {
    // create PD
    [createPD.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createPD.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createPD.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // Update PD
    [updatePD.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [updatePD.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [updatePD.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    //get all Product Distribution paginate
    [getAllPDHistoryPaginate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getAllPDHistoryPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_productDistributionHistory.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_productDistributionHistory = [
            ...state.list_productDistributionHistory,
            ...filteredResult,
          ];
        } else {
          state.list_productDistributionHistory = result;
        }
        state.pagination_productDistributionHistory = {
          totalPages: page?.totalPages || 0,
          totalElements: page?.totalElements || 0,
          currentPage: page?.currentPage || 0,
          pageSize: page?.pageSize || 10,
        }
      }
    },
    [getAllPDHistoryPaginate.rejected]: (state, action) => {
      state.loading = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_productDistributionHistory = [];
        state.pagination_productDistributionHistory = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    // Get Current Product Distribution
    [getCurrentPB.pending]: (state) => {
      state.loading = true;
    },
    [getCurrentPB.fulfilled]: (state, action) => {
      state.data_current = action.payload;
      state.loading = false;
    },
    [getCurrentPB.rejected]: (state) => {
      state.loading = false;
    },

    // get detail PD History
    [getDetailPDHistory.pending]: (state) => {
      state.loading = true;
    },
    [getDetailPDHistory.fulfilled]: (state, action) => {
      state.data_detail_history = action.payload;
      state.loading = false;
    },
    [getDetailPDHistory.rejected]: (state) => {
      state.loading = false;
    },

    // delete pd
    [deletePD.pending]: (state) => {
      state.loading = true;
    },
    [deletePD.fulfilled]: (state, action) => {
      state.dataDelete = action.payload;
      state.loading = false;
    },
    [deletePD.rejected]: (state) => {
      state.loading = false;
    },

    // Get Country PD
    [getCountryPD.pending]: (state) => {
      state.loading = true;
    },
    [getCountryPD.fulfilled]: (state, action) => {
      state.data_country = action.payload;
      state.loading = false;
    },
    [getCountryPD.rejected]: (state) => {
      state.loading = false;
    },
  },
});

const { reducer } = productDistributionSlice;
export default reducer;
