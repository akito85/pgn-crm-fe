import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import { showModalError, showModalSuccess } from "../../general_slice";

const initialState = {
  data_distribution: [],
  data_product: [],
};

//Distribution Media
export const getDistributionMedia = createAsyncThunk(
  "GET_DISTRIBUTION_MEDIA",
  async ({ id, page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/distribution-media/view/${id}?page=${page}&size=${pageSize}${sort ? `&sort=${sort}` : ""}${search ? `&searchs=${search}` : ""}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const createDistributionMedia = createAsyncThunk(
  "CREATE_DISTRIBUTION_MEDIA",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/distribution-media/create`;
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

export const inActiveDistributionMedia = createAsyncThunk(
  "INACTIVE_DISTRIBUTION_MEDIA",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/distribution-media/inactive`;
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

//external
export const getProductDetail = createAsyncThunk(
  "GET_PRODUCT_DETAIL_FOR_DISTRIBUTION_MEDIA",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/distribution-media/getDistributionMedia`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

const distributionMediaSlice = createSlice({
  name: "distributionMedia",
  initialState,
  extraReducers: {
    //distribution media
    [getDistributionMedia.pending]: (state, action) => {
      state.data_distribution = action.payload;
      state.loading = true;
    },
    [getDistributionMedia.fulfilled]: (state, action) => {
      state.data_distribution = action.payload;
      state.loading = false;
    },
    [getDistributionMedia.rejected]: (state, action) => {
      state.data_distribution = action.payload;
      state.loading = false;
    },

    //external
    [getProductDetail.pending]: (state, action) => {
      state.data_product = action.payload;
      state.loading = true;
    },
    [getProductDetail.fulfilled]: (state, action) => {
      state.data_product = action.payload;
      state.loading = false;
    },
    [getProductDetail.rejected]: (state, action) => {
      state.data_product = action.payload;
      state.loading = false;
    },
  },
});
const { reducer } = distributionMediaSlice;
export default reducer;
