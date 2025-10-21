import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  setBodyError,
  showModalError,
  validateError,
} from "../../general_slice";
import { showModalSuccess } from "../../general_slice";
import productPromoHttpService from "../../../services/productPromoHttpService";

const initialState = {
  data: [],
  data_detail: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
  message: "",
};

export const getAllProductClassPaginate = createAsyncThunk(
  "GET_ALL_PRODUCT_CLASS_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/productClass/view/paging?page=${page}&size=${pageSize}&search=${searchParams}&sort=${sortParams}`;
      const response = await productPromoHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getDetailProductClass = createAsyncThunk(
  "GET_DETAIL_PRODUCT_CLASS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/productClass/view/${id}/header`;
      const data = await productPromoHttpService.getDetail(url);
      return data?.data;
    } catch (error) {
      //if error code for with validation
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      thunkAPI.dispatch(
        validateError({ error, action: "DOWNLOAD_PRODUCT_CLASS", back: false }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const createProductClass = createAsyncThunk(
  "CREATE_PRODUCT_CLASS",
  async ({ body, responseSuccess }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/productClass/create";
      const response = await productPromoHttpService.createData(url, body);
      thunkAPI.dispatch(showModalSuccess(responseSuccess));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not created. ${message}. Please try again.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const updateProductClass = createAsyncThunk(
  "UPDATE_PRODUCT_CLASS",
  async ({ body, responseSuccess }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/productClass/update";
      const response = await productPromoHttpService.updateDataWithMethodPost(
        url,
        body,
      );
      thunkAPI.dispatch(showModalSuccess(responseSuccess));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not updated. ${message}. Please try again.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const inactiveProductClass = createAsyncThunk(
  "INACTIVE_PRODUCT_CLASS",
  async ({ id, activeOrInactive }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/productClass/${id}/activate`;
      const response = await productPromoHttpService.activationWithOutRemark(
        url,
        id,
      );
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${activeOrInactive}.`,
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
      //if error code for with validation
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${activeOrInactive}. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const downloadProductClass = createAsyncThunk(
  "DOWNLOAD_PRODUCT_CLASS",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/productClass/downloadFilter?page=${page}&size=${pageSize}&search=${searchParams}&sort=${sortParams}`;
      const response = await productPromoHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "DOWNLOAD_PRODUCT_CLASS", back: false }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

const productClassSlice = createSlice({
  name: "productClass",
  initialState,
  extraReducers: {
    // Get All Product Class Pagination
    [getAllProductClassPaginate.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data = action.payload;
    },
    [getAllProductClassPaginate.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data = action.payload;
      state.loading = false;
    },
    [getAllProductClassPaginate.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // Get Detail Product Class
    [getDetailProductClass.pending]: (state, action) => {
      state.loading = true;
      state.data_detail = action.payload;
    },
    [getDetailProductClass.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailProductClass.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },

    // Create Product Class
    [createProductClass.pending]: (state, action) => {
      state.loading = true;
    },
    [createProductClass.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [createProductClass.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
    },

    // Update Product Class
    [updateProductClass.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [updateProductClass.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.isSuccess = true;
    },
    [updateProductClass.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.data = action.payload;
    },

    // Inactive Product Class
    [inactiveProductClass.pending]: (state, action) => {
      state.loading = true;
    },
    [inactiveProductClass.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveProductClass.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    // Download Product Class
    [downloadProductClass.pending]: (state, action) => {
      state.loading = true;
    },
    [downloadProductClass.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [downloadProductClass.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

const { reducer } = productClassSlice;
export default reducer;
