import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  showModalError,
  showModalSuccess,
  validateError,
} from "../general_slice";
import userHttpService from "../../services/userHttpService";

const initialState = {
  loading: false,
  data_MaintenanceMode: [],
  detail_MaintenanceMode: [],
};

export const getMaintenanceMode = createAsyncThunk(
  "GET_MAINTENANCE_MODE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/maintenance/paging?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await userHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_MAINTENANCE_MODE" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getMaintenanceModeDetail = createAsyncThunk(
  "GET_MAINTENANCE_MODE_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintenance/detail/${id}`;
      const response = await userHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_MAINTENANCE_MODE_DETAIL" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const createMaintenanceMode = createAsyncThunk(
  "CREATE_MAINTENANCE_MODE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintenance/create`;
      const response = await userHttpService.createData(url, body);
      const successBody = {
        title: "Successful",
        description: `Your data has been created.`,
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
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(
            validateError({ error, action: "CREATE_MAINTENANCE_MODE" }),
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not created ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const updateMaintenanceMode = createAsyncThunk(
  "UPDATE_MAINTENANCE_MODE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintenance/update`;
      const response = await userHttpService.updateData(url, body);
      const successBody = {
        title: "Successful",
        description: `Your data has been updated.`,
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
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(
            validateError({ error, action: "UPDATE_MAINTENANCE_MODE" }),
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not updated ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

const maintenanceModeSlice = createSlice({
  name: "maintenanceMode",
  initialState,
  extraReducers: {
    //GET MAINTENANCE MODE
    [getMaintenanceMode.pending]: (state, action) => {
      state.loading = true;
    },
    [getMaintenanceMode.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_MaintenanceMode = action.payload;
    },
    [getMaintenanceMode.rejected]: (state, action) => {
      state.loading = false;
    },

    //GET MAINTENANCE MODE DETAIL
    [getMaintenanceModeDetail.pending]: (state, action) => {
      state.loading = true;
    },
    [getMaintenanceModeDetail.fulfilled]: (state, action) => {
      state.loading = false;
      state.detail_MaintenanceMode = action.payload;
    },
    [getMaintenanceModeDetail.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

const { reducer } = maintenanceModeSlice;
export default reducer;
