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
  list_productClass: [],
  pagination_productClass: { totalPage: 0, totalElement: 0 },
  loading_listProductClass: false,
  latestListReqId_productClass: null,
};

export const getAllProductClassPaginate = createAsyncThunk(
  "GET_ALL_PRODUCT_CLASS_PAGINATE",
  async ({ page, pageSize, sort, search, searchText, filters = [], filterRules = [], isLoadMore = false }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/productClass/list-product-class`;
      const body = {
        page,
        size: pageSize,
        sort: sort || "createdDate~desc",
        search: searchText || null,
        searchs: search || {},
        filters,
        filterRules,
      };
      const response = await productPromoHttpService.createData(url, body);
      return { ...response.data, isLoadMore };
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
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
        validateError({ error, action: "DOWNLOAD_PRODUCT_CLASS", back: false })
      );
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
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
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const updateProductClass = createAsyncThunk(
  "UPDATE_PRODUCT_CLASS",
  async ({ body, responseSuccess }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/productClass/update";
      const response = await productPromoHttpService.updateDataWithMethodPost(
        url,
        body
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
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const inactiveProductClass = createAsyncThunk(
  "INACTIVE_PRODUCT_CLASS",
  async ({ id, activeOrInactive }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/productClass/${id}/activate`;
      const response = await productPromoHttpService.activationWithOutRemark(
        url,
        id
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
  }
);

export const downloadProductClass = createAsyncThunk(
  "DOWNLOAD_PRODUCT_CLASS",
  async ({ page, pageSize, sort, search, searchText, filters = [], filterRules = [] }, thunkAPI) => {
    try {
      const url = '/v1/dbs/api/productClass/downloadFilter';
      const body = {
        page,
        size: pageSize,
        sort: sort || "createdDate~desc",
        search: searchText || null,
        searchs: search || {},
        filters,
        filterRules,
      }
      const response = await productPromoHttpService.downloadDataPost(url, body);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "DOWNLOAD_PRODUCT_CLASS", back: false })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
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
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listProductClass = true;
        state.list_productClass = [];
        state.latestListReqId_productClass = action.meta.requestId;
      }
    },
    [getAllProductClassPaginate.fulfilled]: (state, action) => {
      const { result, page, isLoadMore } = action.payload || {};
      // Drop stale replace responses (out-of-order race when filters/search
      // change quickly); only the most recent request owns the list.
      if (
        !isLoadMore &&
        action.meta.requestId !== state.latestListReqId_productClass
      )
        return;
      state.isFailed = false;
      state.isSuccess = false;
      state.data = action.payload;
      state.loading = false;
      state.loading_listProductClass = false;
      if (Array.isArray(result)) {
        if (isLoadMore) {
          const existingIds = new Set(
            state.list_productClass.map((it) => it.productClassId)
          );
          state.list_productClass = [
            ...state.list_productClass,
            ...result.filter((it) => !existingIds.has(it.productClassId)),
          ];
        } else {
          state.list_productClass = result;
        }
      }
      state.pagination_productClass = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
      };
    },
    [getAllProductClassPaginate.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.loading_listProductClass = false;
    },

    // Get Detail Product Class
    [getDetailProductClass.pending]: (state) => {
      state.loading = true;
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
    [createProductClass.pending]: (state) => {
      state.loading = true;
    },
    [createProductClass.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [createProductClass.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    // Update Product Class
    [updateProductClass.pending]: (state) => {
      state.loading = true;
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
    [inactiveProductClass.pending]: (state) => {
      state.loading = true;
    },
    [inactiveProductClass.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveProductClass.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    // Download Product Class
    [downloadProductClass.pending]: (state) => {
      state.loading = true;
    },
    [downloadProductClass.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadProductClass.rejected]: (state) => {
      state.loading = false;
    },
  },
});

const { reducer } = productClassSlice;
export default reducer;
