import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { validateError } from "../../general_slice";
import { showModalSuccess } from "../../general_slice";
import accountManagementService from "../../../services/account_management/accountManagementService";
import { errorBody, errorCode, errorMessage } from "../../../../utils";

const initialState = {
  data: [],
  data_current: {},
  data_detail: {},
  loading: false,
  message: "",
  ddlUtilizationName: [],
  list_gasUtilizationHistory: [],
  pagination_gasUtilizationHistory: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },
};

// Get list pagination address
export const getListGasUtilizationHistory = createAsyncThunk(
  "GET_LIST_GAS_UTILIZATION",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "effectiveDate~desc" : sort;
      const url = `/v1/dbs/api/account-detail/gas-utilization/view-paging/${id}?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await accountManagementService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_LIST_GAS_UTILIZATION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getListGasUtilizationHistoryNew = createAsyncThunk(
  "GET_LIST_GAS_UTILIZATION",
  async ({ id, page, pageSize, search, sort, isLoadMore }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "effectiveDate~desc" : sort;
      
        const url = `/v1/dbs/api/account-detail/gas-utilization/view-paging/${id}?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await accountManagementService.getPagination(url);
      return {
        ...response.data,
        isLoadMore
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get list pagination address
export const getCurrentGasUtilization = createAsyncThunk(
  "GET_CURRENT_GAS_UTILIZATION",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/gas-utilization/view-detail-current/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_CURRENT_GAS_UTILIZATION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get list pagination address
export const getDetailGasUtilization = createAsyncThunk(
  "GET_DETAIL_GAS_UTILIZATION",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/gas-utilization/view-detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DETAIL_GAS_UTILIZATION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Create Gas Utilization
export const createUpdateGasUtilization = createAsyncThunk(
  "CREATE_UPDATE_EQUIPMENT",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/gas-utilization/create-update`;
      const response = await accountManagementService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: body?.id ? "Your data has been updated." : "Your data has been created.",
        return: true,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "CREATE_UPDATE_EQUIPMENT",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

// Get Ddl Fuel Type Equipment
export const getDdlUtilizationName = createAsyncThunk(
  "GET_DDL_UTILIZATION_NAME",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/gas-utilization/drop-down-list/utilization-name`;
      const response = await accountManagementService.getAll(url);
      const result = response.data.map((item) => ({
        label: item.name.toUpperCase(),
        value: item.id,
      }));
      return result;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DDL_UTILIZATION_NAME",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Delete
export const deleteGasUtilization = createAsyncThunk(
  "DELETE_GAS_UTILIZATION",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/gas-utilization/soft-delete/${id}`;
      const response = await accountManagementService.deleteData(url);
      const successBody = {
        title: `Successful`,
        description: "Your data has been deleted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DELETE_GAS_UTILIZATION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const accountGasUtilizationSlice = createSlice({
  name: "accountgasUtilization",
  initialState,
  extraReducers: {
    // Get All Pricing Rule Pagination
    [getListGasUtilizationHistory.pending]: (state) => {
      state.loading = true;
    },
    [getListGasUtilizationHistory.rejected]: (state) => {
      state.loading = false;
    },
    [getListGasUtilizationHistory.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // Get All Gas Utilization History New
    [getListGasUtilizationHistoryNew.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getListGasUtilizationHistoryNew.rejected]: (state, action) => {
      state.loading = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_gasUtilizationHistory = [];
        state.pagination_gasUtilizationHistory = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },
    [getListGasUtilizationHistoryNew.fulfilled]: (state, action) => {
      state.loading = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_gasUtilizationHistory.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_gasUtilizationHistory = [
            ...state.list_gasUtilizationHistory,
            ...filteredResult,
          ];
        }
        else
          state.list_gasUtilizationHistory = result;        
      }

      state.pagination_gasUtilizationHistory = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },

    // Get Current
    [getCurrentGasUtilization.pending]: (state) => {
      state.loading = true;
    },
    [getCurrentGasUtilization.rejected]: (state) => {
      state.loading = false;
    },
    [getCurrentGasUtilization.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_current = action.payload;
    },

    // Get Detail Gas Utilization History
    [getDetailGasUtilization.pending]: (state) => {
      state.loading = true;
    },
    [getDetailGasUtilization.rejected]: (state) => {
      state.loading = false;
    },
    [getDetailGasUtilization.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },

    // Create Gas Utilization
    [createUpdateGasUtilization.pending]: (state) => {
      state.loading = true;
    },
    [createUpdateGasUtilization.rejected]: (state) => {
      state.loading = false;
    },
    [createUpdateGasUtilization.fulfilled]: (state) => {
      state.loading = false;
    },

    // Ddl Gas Utilization Name
    [getDdlUtilizationName.pending]: (state) => {
      state.loading = true;
    },
    [getDdlUtilizationName.rejected]: (state) => {
      state.loading = false;
    },
    [getDdlUtilizationName.fulfilled]: (state, action) => {
      state.ddlUtilizationName = action.payload;
      state.loading = false;
    },

    // Ddl Gas Utilization Name
    [deleteGasUtilization.pending]: (state) => {
      state.loading = true;
    },
    [deleteGasUtilization.rejected]: (state) => {
      state.loading = false;
    },
    [deleteGasUtilization.fulfilled]: (state) => {
      state.loading = false;
    },
  },
});

const { reducer } = accountGasUtilizationSlice;
export default reducer;
