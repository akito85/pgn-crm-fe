import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showModalError, validateError } from "../../general_slice";
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
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
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
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
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
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
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
        description: "Your data has been created.",
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
        }),
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  },
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
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
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
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

const accountGasUtilizationSlice = createSlice({
  name: "accountgasUtilization",
  initialState,
  extraReducers: {
    // Get All Pricing Rule Pagination
    [getListGasUtilizationHistory.pending]: (state, action) => {
      state.loading = true;
    },
    [getListGasUtilizationHistory.rejected]: (state, action) => {
      state.loading = false;
    },
    [getListGasUtilizationHistory.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // Get Current
    [getCurrentGasUtilization.pending]: (state, action) => {
      state.loading = true;
    },
    [getCurrentGasUtilization.rejected]: (state, action) => {
      state.loading = false;
    },
    [getCurrentGasUtilization.fulfilled]: (state, action) => {
      state.data_current = action.payload;
      state.loading = false;
    },

    // Get Detail Gas Utilization History
    [getDetailGasUtilization.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailGasUtilization.rejected]: (state, action) => {
      state.loading = false;
    },
    [getDetailGasUtilization.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },

    // Create Gas Utilization
    [createUpdateGasUtilization.pending]: (state, action) => {
      state.loading = true;
    },
    [createUpdateGasUtilization.rejected]: (state, action) => {
      state.loading = false;
    },
    [createUpdateGasUtilization.fulfilled]: (state, action) => {
      state.loading = false;
    },

    // Ddl Gas Utilization Name
    [getDdlUtilizationName.pending]: (state, action) => {
      state.loading = true;
    },
    [getDdlUtilizationName.rejected]: (state, action) => {
      state.loading = false;
    },
    [getDdlUtilizationName.fulfilled]: (state, action) => {
      state.ddlUtilizationName = action.payload;
      state.loading = false;
    },

    // Ddl Gas Utilization Name
    [deleteGasUtilization.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteGasUtilization.rejected]: (state, action) => {
      state.loading = false;
    },
    [deleteGasUtilization.fulfilled]: (state, action) => {
      state.loading = false;
    },
  },
});

const { reducer } = accountGasUtilizationSlice;
export default reducer;
