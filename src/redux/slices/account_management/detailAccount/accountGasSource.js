import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showModalError } from "../../general_slice";
import { showModalSuccess } from "../../general_slice";
import accountManagementService from "../../../services/account_management/accountManagementService";

const initialState = {
  data: [],
  data_detail: [],
  data_ags: [],
  data_calorie_type: [],
  data_create: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
  message: "",
};

export const getAllAccountGasSourcePaginate = createAsyncThunk(
  "GET_ALL_ACCOUNT_GAS_SOURCE_PAGINATE",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/gas-source/paging-assign/${id}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getCalorieType = createAsyncThunk(
  "GET_CALORIE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-source/get-calorie-type`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getAccountGasSource = createAsyncThunk(
  "GET_ACCOUNT_GAS_SOURCE",
  async (costCenter, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-source/get-gas-source/${costCenter}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const assignGasSource = createAsyncThunk(
  "ASSIGN_GAS_SOURCE",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/gas-source/assign";
      const response = await accountManagementService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been assigned.",
        return: false,
      };
      if (response.data.length === 0) {
        return response.code;
      } else {
        thunkAPI.dispatch(showModalSuccess(successBody));
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const InactiveAccountGasSource = createAsyncThunk(
  "INACTIVE_ACCOUNT_GAS_SOURCE",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/gas-source/inactive-account";
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been inactivate.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        description: `Your data was not inactivate. ${message}. Please try again.`,
        return: false,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getDetailAccountGasSource = createAsyncThunk(
  "GET_DETAIL_ACCOUNT_GAS_SOURCE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-source/detail-assign/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

const accountGasSourceSlice = createSlice({
  name: "accountGasSource",
  initialState,
  extraReducers: {
    // Get All AccountGas Source Pagination
    [getAllAccountGasSourcePaginate.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [getAllAccountGasSourcePaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getAllAccountGasSourcePaginate.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // Get Calorie Type
    [getCalorieType.pending]: (state, action) => {
      state.loading = true;
      state.data_calorie_type = action.payload;
    },
    [getCalorieType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_calorie_type = action.payload;
    },
    [getCalorieType.rejected]: (state, action) => {
      state.loading = false;
      state.data_calorie_type = action.payload;
    },

    // Assign Gas Source
    [assignGasSource.pending]: (state, action) => {
      state.loading = true;
    },
    [assignGasSource.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
      state.data_create = action.payload;
    },
    [assignGasSource.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
    },

    /* Get Account Gas Source */
    [getAccountGasSource.pending]: (state, action) => {
      state.data_ags = action.payload;
      state.loading = true;
    },
    [getAccountGasSource.fulfilled]: (state, action) => {
      state.data_ags = action.payload;
      state.loading = false;
    },
    [getAccountGasSource.rejected]: (state, action) => {
      state.data_ags = action.payload;
      state.loading = false;
    },

    /* Inactive Account Gas Source */
    [InactiveAccountGasSource.pending]: (state, action) => {
      state.loading = true;
    },
    [InactiveAccountGasSource.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [InactiveAccountGasSource.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
    },

    /* Get Detail Account Gas Source */
    [getDetailAccountGasSource.pending]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = true;
    },
    [getDetailAccountGasSource.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailAccountGasSource.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = accountGasSourceSlice;
export default reducer;
