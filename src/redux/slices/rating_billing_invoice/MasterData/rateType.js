import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../../services/ratingBillingHttpService";
import {
  showModalError,
  showModalSuccess,
  validateError,
} from "../../general_slice";

const initialState = {
  data_list: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
  message: "",
  data_detail: {},
  data_approvalList: [], //ddl
  data_approvalListDetail: {}, //table approval
  data_approval_history: [],
  dataListCategory: [],
};

export const getRateTypePaginate = createAsyncThunk(
  "GET_RATETYPE__PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rate-type/list-rate-type?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const createRateType = createAsyncThunk(
  "CREATE_MASTER_RATE_TYPES",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rate-type/create`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successMessage = {
        title: "Successfull",
        description: "Your data has been created",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      const message =
        (response.response &&
          response.response.data &&
          response.response.data.message) ||
        response.message ||
        response.toString();
      const errorBody = {
        title: "Failed",
        description: `Your data was not created. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const inactiveMasterRateType = createAsyncThunk(
  "INACTIVE_MASTER_RATE_TYPES",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rate-type/inactive`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
      );
      const message = response.message;
      const successMessage = {
        title: "Successfull",
        description: `${message}`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      const message =
        (response.response &&
          response.response.data &&
          response.response.data.message) ||
        response.message ||
        response.toString();
      const errorBody = {
        title: "Failed",
        description: `${message}. Please try again.`,
        return: false,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const updateRateType = createAsyncThunk(
  "UPDATE_MASTER_RATE_TYPES",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rate-type/update`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successMessage = {
        title: "Successfull",
        description: "Your data has been updated",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      const message =
        (response.response &&
          response.response.data &&
          response.response.data.message) ||
        response.message ||
        response.toString();
      const errorBody = {
        title: "Failed",
        description: `Your data was not created. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getDetailRateType = createAsyncThunk(
  "GET_DETAIL_MASTER_RATE_TYPES",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rate-type/detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (response) {
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getDowloadRateType = createAsyncThunk(
  "DOWNLOAD_RATE_TYPES",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rate-type/download-filter?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_RATE_TYPES",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

const rateTypeSlice = createSlice({
  name: "rate_type",
  initialState,
  extraReducers: {
    // Get All Rate Type Pagination
    [getRateTypePaginate.pending]: (state, action) => {
      state.loading = true;
    },
    [getRateTypePaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_list = action.payload;
    },
    [getRateTypePaginate.rejected]: (state, action) => {
      state.loading = false;
      state.data_list = action.payload;
    },

    // create Rate Type
    [createRateType.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [createRateType.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
    },

    // update Rate Type
    [updateRateType.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [updateRateType.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
    },

    //detail
    [getDetailRateType.pending]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = true;
    },
    [getDetailRateType.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },

    // inactive position
    [inactiveMasterRateType.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveMasterRateType.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
    },

    //download ratetype

    [getDowloadRateType.fulfilled]: (state, action) => {
      state.data_download_rate_type = action.payload;
      // state.isSuccess = true;
      state.loading = false;
    },
    [getDowloadRateType.rejected]: (state, action) => {
      state.isFailed = true;
      state.data_download_rate_type = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = rateTypeSlice;
export default reducer;
