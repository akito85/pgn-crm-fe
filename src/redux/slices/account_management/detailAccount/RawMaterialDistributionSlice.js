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
};

export const createRMS = createAsyncThunk(
  "CREATE_RMS",
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
          action: "CREATE_RMS",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const updateRMS = createAsyncThunk(
  "UPDATE_RMS",
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
          action: "UPDATE_RMS",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getCurrentRaw = createAsyncThunk(
  "GET_CURRENT_RAW",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/source-distribution/view-detail-current/raw-material/${id}`;
      if (hasValue(id)) {
        const response = await accountManagementService.getDetail(url);
        return response.data;
      }
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_CURRENT_RAW",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const getAllRMSHistoryPaginate = createAsyncThunk(
  "GET_ALL_RMSHistory_PAGINATE",
  async ({ id, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/account-detail/source-distribution/view-paging/raw-material/${id}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_RMSHistory_PAGINATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getDetailRMSHistory = createAsyncThunk(
  "GET_DETAIL_RMSHistory",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/source-distribution/view-detail/raw-material/${id}`;
      if (hasValue(id)) {
        const response = await accountManagementService.getDetail(url);
        return response.data;
      }
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_DETAIL_RMSHistory" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const deleteRMS = createAsyncThunk(
  "DELETE_RMS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/source-distribution/soft-delete/raw-material/${id}`;
      if (hasValue(id)) {
        const response = await accountManagementService.deleteData(url);
        return response.data;
      }
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "DELETE_RMS" }));
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getCountryRMS = createAsyncThunk(
  "GET_COUNTRY_RMS",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/source-distribution/drop-down-list/country-name`;
      const data = await accountManagementService.getAll(url);
      return data.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_COUNTRY_RMS",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

const rawMaterialSourceSlice = createSlice({
  name: "rawMaterialSource",
  initialState,
  extraReducers: {
    // create RMS
    [createRMS.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createRMS.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createRMS.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // Update RMS
    [updateRMS.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [updateRMS.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [updateRMS.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    //get all Raw Material Source paginate
    [getAllRMSHistoryPaginate.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [getAllRMSHistoryPaginate.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getAllRMSHistoryPaginate.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // Get Current Raw Material Source
    [getCurrentRaw.pending]: (state, action) => {
      state.loading = true;
    },
    [getCurrentRaw.fulfilled]: (state, action) => {
      state.data_current = action.payload;
      state.loading = false;
    },
    [getCurrentRaw.rejected]: (state, action) => {
      state.loading = false;
    },

    // get detail RMS History
    [getDetailRMSHistory.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailRMSHistory.fulfilled]: (state, action) => {
      state.data_detail_history = action.payload;
      state.loading = false;
    },
    [getDetailRMSHistory.rejected]: (state, action) => {
      state.loading = false;
    },

    // delete rms
    [deleteRMS.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteRMS.fulfilled]: (state, action) => {
      state.dataDelete = action.payload;
      state.loading = false;
    },
    [deleteRMS.rejected]: (state, action) => {
      state.loading = false;
    },

    // Get Country RMS
    [getCountryRMS.pending]: (state, action) => {
      state.loading = true;
    },
    [getCountryRMS.fulfilled]: (state, action) => {
      state.data_country = action.payload;
      state.loading = false;
    },
    [getCountryRMS.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

const { reducer } = rawMaterialSourceSlice;
export default reducer;
