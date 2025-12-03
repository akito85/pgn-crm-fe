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
  data_location_reference: null,
  data_location_type: null,
  data_location_parent: null,
  data_location_parent_type: null,
};

export const getLocationPaginate = createAsyncThunk(
  "GET_LOCATION_PAGINATE",
  async ({ typeId, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/master/location/paging-location/${typeId}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response.data;
    } catch (error) {
      // const message =
      //     error?.response?.data?.message || error?.message || error?.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //     thunkAPI.dispatch(setBodyError(error));
      // } else {
      //     const errorBody = {
      //         title: "Failed",
      //         description: `${message}`,
      //     };
      //     thunkAPI.dispatch(showModalError(errorBody))
      // }
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_LOCATION_PAGINATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const downloadLocation = createAsyncThunk(
  "DOWNLOAD_LOCATION",
  async ({ parentType, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/master/location/download-filter/${parentType}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_LOCATION",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getDetailLocation = createAsyncThunk(
  "GET_DETAIL_LOCATION",
  async ({ id, locationType }, thunkAPI) => {
    try {
      let url = ``;
      if (locationType === 2346) {
        url = `/v1/dbs/api/master/location/detail-location-all/${id}`;
      } else {
        url = `/v1/dbs/api/master/location/detail-location/${id}`;
      }
      const response = await accountManagementService.getDetail(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);
export const createLocation = createAsyncThunk(
  "CREATE_LOCATION",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/location/create";
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
          action: "CREATE_LOCATION",
          back: false,
        }),
      );
      // const message =
      //     (error.response &&
      //         error.response.data &&
      //         error.response.data.message) ||
      //     error.message ||
      //     error.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //     thunkAPI.dispatch(setBodyError(error));
      // } else {
      //     const errorBody = {
      //         title: "Failed",
      //         description: `Your data was not created. ${message}. Please try again.`,
      //         icon: "icon_error_inactivate",
      //     };
      //     thunkAPI.dispatch(showModalError(errorBody))
      // }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const updateLocation = createAsyncThunk(
  "UPDATE_LOCATION",
  async ({ body, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/location/update/${id}`;
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
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "UPDATE_LOCATION",
          back: false,
        }),
      );
      // const message =
      //     (error.response &&
      //         error.response.data &&
      //         error.response.data.message) ||
      //     error.message ||
      //     error.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //     thunkAPI.dispatch(setBodyError(error));
      // } else {
      //     const errorBody = {
      //         title: "Failed",
      //         description: `Your data was not updated. ${message}. Please try again.`,
      //     };
      //     thunkAPI.dispatch(showModalError(errorBody));
      // }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
export const activationLocation = createAsyncThunk(
  "ACTIVATION_LOCATION",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/location/active-inactive";
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: response?.message,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      // const message =
      //     (error.response &&
      //         error.response.data &&
      //         error.response.data.message) ||
      //     error.message ||
      //     error.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //     thunkAPI.dispatch(setBodyError(error));
      // } else {
      //     const errorBody = {
      //         title: "Failed",
      //         description: `Your data was not updated. ${message}. Please try again.`,
      //         return: false,
      //     };
      //     thunkAPI.dispatch(showModalError(errorBody));
      // }

      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "ACTIVATION_LOCATION",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getLocationReference = createAsyncThunk(
  "GET_LOCATION_REFERENCE",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gt-account/get-LR/${id}`;
      const response = await accountManagementService.getAll(url);
      const responseMap = response?.data?.map((item) => ({
        value: item?.id,
        name: item?.name,
      }));

      return responseMap;
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
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);
export const getLocationType = createAsyncThunk(
  "GET_LOCATION_TYPE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gt-account/get-LT`;
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
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);
export const getLocationParent = createAsyncThunk(
  "GET_LOCATION_PARENT",
  async ({ id, page, pageSize }, thunkAPI) => {
    try {
      // const url = `/v1/dbs/api/master/location/list-location-parent/${id}`;
      const url = `/v1/dbs/api/master/location/paging-location-parent/${id}?page=${page}&size=${pageSize}&sort=createdDate~asc`;
      const response = await accountManagementService.getAll(url);
      const responseMap = response?.data?.result?.map((item) => ({
        value: item?.id,
        name: item?.locationName,
      }));
      return responseMap;
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
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const getLocationParentType = createAsyncThunk(
  "GET_LOCATION_PARENT_TYPE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/location/list-location-parent-type/108`;
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
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);
const locationSlice = createSlice({
  name: "location_slice",
  initialState,
  reducers: {
    setClearLocationParent: (state) => {
      state.data_location_parent = null;
    },
  },
  extraReducers: {
    // pagination
    [getLocationPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getLocationPaginate.rejected]: (state) => {
      state.loading = false;
    },
    [getLocationPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // download
    [downloadLocation.pending]: (state) => {
      state.loading = true;
    },
    [downloadLocation.rejected]: (state) => {
      state.loading = false;
    },
    [downloadLocation.fulfilled]: (state) => {
      state.loading = false;
    },
    // detail
    [getDetailLocation.pending]: (state) => {
      state.loading = true;
    },
    [getDetailLocation.rejected]: (state) => {
      state.loading = false;
    },
    [getDetailLocation.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    // create
    [createLocation.pending]: (state) => {
      state.loading = true;
    },
    [createLocation.rejected]: (state) => {
      state.loading = false;
    },
    [createLocation.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    // update
    [updateLocation.pending]: (state) => {
      state.loading = true;
    },
    [updateLocation.rejected]: (state) => {
      state.loading = false;
    },
    [updateLocation.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // activation
    [activationLocation.pending]: (state) => {
      state.loading = true;
    },
    [activationLocation.rejected]: (state) => {
      state.loading = false;
    },
    [activationLocation.fulfilled]: (state) => {
      state.loading = false;
      // state.data = .payload;
    },
    // get location reference
    [getLocationReference.pending]: (state) => {
      state.loading = true;
    },
    [getLocationReference.rejected]: (state) => {
      state.loading = false;
    },
    [getLocationReference.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_location_reference = action.payload;
    },
    // get location type
    [getLocationType.pending]: (state) => {
      state.loading = true;
    },
    [getLocationType.rejected]: (state) => {
      state.loading = false;
    },
    [getLocationType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_location_type = action.payload;
    },
    // get location parent
    [getLocationParent.pending]: (state) => {
      state.loading = true;
    },
    [getLocationParent.rejected]: (state) => {
      state.loading = false;
    },
    [getLocationParent.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_location_parent = state.data_location_parent
        ? [...state.data_location_parent, ...action.payload]
        : action.payload;
    },
    [getLocationParentType.pending]: (state) => {
      state.loading = true;
    },
    [getLocationParentType.rejected]: (state) => {
      state.loading = false;
    },
    [getLocationParentType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_location_parent_type = action.payload;
    },
  },
});

const { reducer } = locationSlice;
export const { setClearLocationParent } = locationSlice.actions;
export default reducer;
