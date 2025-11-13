import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../../utils";

const initialState = {
  data: null,
  loading: false,
  data_detail: null,
  message: "",
  data_cost_center: null,
};

export const getMeterReadingCodePaginate = createAsyncThunk(
  "GET_METER_READING_CODE_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/meter-reading-codes/list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_METER_READING_CODE_PAGINATE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const downloadMeterReadingCode = createAsyncThunk(
  "DOWNLOAD_METER_READING_CODE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/meter-reading-codes/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_METER_READING_CODE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const getDetailMeterReadingCode = createAsyncThunk(
  "GET_DETAIL_METER_READING_CODE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/meter-reading-codes/detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DETAIL_METER_READING_CODE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);
export const createMeterReadingCode = createAsyncThunk(
  "CREATE_METER_READING_CODE",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/meter-reading-codes/create";
      const response = await accountManagementService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been created.",
        // return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "CREATE_METER_READING_CODE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updateMeterReadingCode = createAsyncThunk(
  "UPDATE_METER_READING_CODE",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/meter-reading-codes/update";
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been updated.",
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "updated", errorMessage(error)),
          action: "UPDATE_METER_READING_CODE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const activationMeterReadingCode = createAsyncThunk(
  "ACTIVATION_METER_READING_CODE",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/meter-reading-codes/active-inactive";
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: response?.message,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "ACTIVATION_METER_READING_CODE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getListCostCenterMeterReading = createAsyncThunk(
  "GET_LIST_COST_CENTER_METER_READING",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/meter-reading-codes/list-cost-center";
      const response = await accountManagementService.getAll(url);
      return response?.data;
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
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const meterReadingCodeSlice = createSlice({
  name: "meter_reading_code_slice",
  initialState,
  extraReducers: {
    // pagination
    [getMeterReadingCodePaginate.pending]: (state) => {
      state.loading = true;
    },
    [getMeterReadingCodePaginate.rejected]: (state) => {
      state.loading = false;
    },
    [getMeterReadingCodePaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // download
    [downloadMeterReadingCode.pending]: (state) => {
      state.loading = true;
    },
    [downloadMeterReadingCode.rejected]: (state) => {
      state.loading = false;
    },
    [downloadMeterReadingCode.fulfilled]: (state) => {
      state.loading = false;
    },
    // detail
    [getDetailMeterReadingCode.pending]: (state) => {
      state.loading = true;
    },
    [getDetailMeterReadingCode.rejected]: (state) => {
      state.loading = false;
    },
    [getDetailMeterReadingCode.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    // create
    [createMeterReadingCode.pending]: (state) => {
      state.loading = true;
    },
    [createMeterReadingCode.rejected]: (state) => {
      state.loading = false;
    },
    [createMeterReadingCode.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // update
    [updateMeterReadingCode.pending]: (state) => {
      state.loading = true;
    },
    [updateMeterReadingCode.rejected]: (state) => {
      state.loading = false;
    },
    [updateMeterReadingCode.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // activation
    [activationMeterReadingCode.pending]: (state) => {
      state.loading = true;
    },
    [activationMeterReadingCode.rejected]: (state) => {
      state.loading = false;
    },
    [activationMeterReadingCode.fulfilled]: (state) => {
      state.loading = false;
      // state.data = .payload;
    },
    // ddl meter reading code
    [getListCostCenterMeterReading.pending]: (state) => {
      state.loading = true;
    },
    [getListCostCenterMeterReading.rejected]: (state) => {
      state.loading = false;
    },
    [getListCostCenterMeterReading.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_cost_center = action.payload;
    },
  },
});

const { reducer } = meterReadingCodeSlice;
export default reducer;
