import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import { showModalError, showModalSuccess } from "../../general_slice";

const initialState = {
  data_premise: [],
  data_globalTypeServicePoint: [],
  data_list_address_premise: {},
};

//premise
export const getPremise = createAsyncThunk(
  "GET_PREMISE",
  async ({ id, page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/premise/view/${id}?page=${page}&size=${pageSize}${sort ? `&sort=${sort}` : ""}${
        search ? `&searchs=${search}` : ""
      }`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);
export const getListAddressPremise = createAsyncThunk(
  "GET_LIST_ADDRESS_PREMISE",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/premise/servicePoint/getListAddress/${id}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const createServicePoint = createAsyncThunk(
  "CREATE_SERVICE_POINT",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/premise/servicePoint/create`;
      const response = await accountManagementService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Your data has been created.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      //if error code for with validation
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not created. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const inActiveServicePoint = createAsyncThunk(
  "INACTIVE_SERVICE_POINT",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/premise/servicePoint/inactive`;
      const response = await accountManagementService.updateData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Your data has been inactivate.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      //if error code for with validation
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not inactivate. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const updateServicePoint = createAsyncThunk(
  "UPDATE_SERVICE_POINT",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/premise/servicePoint/update`;
      const response = await accountManagementService.updateData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Your data has been Updated.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      //if error code for with validation
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not updated ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getGlobalTypeListServicePoint = createAsyncThunk(
  "GET_GLOBAL_TYPE_SERVICE_POINT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/premise/servicePoint/getListName`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getPremiseDetail = createAsyncThunk(
  "GET_PREMISE_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/address/view/detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

const premiseSlice = createSlice({
  name: "premise",
  initialState,
  extraReducers: {
    //premise
    [getPremise.pending]: (state, action) => {
      state.data_premise = action.payload;
      state.loading = true;
    },
    [getPremise.fulfilled]: (state, action) => {
      state.data_premise = action.payload;
      state.loading = false;
    },
    [getPremise.rejected]: (state, action) => {
      state.data_premise = action.payload;
      state.loading = false;
    },

    [getPremiseDetail.pending]: (state, action) => {
      state.data_premiseDetail = action.payload;
      state.loading = true;
    },
    [getPremiseDetail.fulfilled]: (state, action) => {
      state.data_premiseDetail = action.payload;
      state.loading = false;
    },
    [getPremiseDetail.rejected]: (state, action) => {
      state.data_premiseDetail = action.payload;
      state.loading = false;
    },

    [getGlobalTypeListServicePoint.pending]: (state, action) => {
      state.data_globalTypeServicePoint = action.payload;
      state.loading = true;
    },
    [getGlobalTypeListServicePoint.fulfilled]: (state, action) => {
      state.data_globalTypeServicePoint = action.payload;
      state.loading = false;
    },
    [getGlobalTypeListServicePoint.rejected]: (state, action) => {
      state.data_globalTypeServicePoint = action.payload;
      state.loading = false;
    },

    [getListAddressPremise.pending]: (state, action) => {
      state.data_list_address_premise = action.payload;
      state.loading = true;
    },
    [getListAddressPremise.fulfilled]: (state, action) => {
      state.data_list_address_premise = action.payload;
      state.loading = false;
    },
    [getListAddressPremise.rejected]: (state, action) => {
      state.data_list_address_premise = action.payload;
      state.loading = false;
    },
  },
});
const { reducer } = premiseSlice;
export default reducer;
