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
  data_asset_name: null,
  data_asset_type: null,
  data_brand_type: null,
  data_service_type: null,
  data_product_name: null,
  data_year: null,
  data_gsize: null,
  data_ansi: null,
};

export const getAssetsPaginate = createAsyncThunk(
  "GET_ASSETS_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/master/assets?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
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
          action: "GET_ASSETS_PAGINATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const downloadAssets = createAsyncThunk(
  "DOWNLOAD_ASSETS",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/master/assets/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_ASSETS",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getDetailAssets = createAsyncThunk(
  "GET_DETAIL_ASSETS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/assets/detail-asset/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DETAIL_ASSETS",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);
export const createAssets = createAsyncThunk(
  "CREATE_ASSETS",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/assets/create";
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
          action: "CREATE_ASSETS",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
export const updateAsstes = createAsyncThunk(
  "UPDATE_ASSETS",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/assets/update-asset";
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
          action: "UPDATE_ASSETS",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
export const activationAssets = createAsyncThunk(
  "ACTIVATION_ASSETS",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/assets/inactive";
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
          action: "ACTIVATION_ASSETS",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getListAssetName = createAsyncThunk(
  "LIST_ASSET_NAME",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/assets/assetName";
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
  },
);
export const getListAssetType = createAsyncThunk(
  "LIST_ASSET_TYPE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/assets/assetType";
      const response = await accountManagementService.getAll(url);
      return response.data;
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
  },
);
export const getListAssetBrand = createAsyncThunk(
  "LIST_ASSET_BRAND",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/assets/assetBrand";
      const response = await accountManagementService.getAll(url);
      return response.data;
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
  },
);
export const getListAssetServiceType = createAsyncThunk(
  "LIST_ASSET_SERVICE_TYPE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/assets/assetServiceType";
      const response = await accountManagementService.getAll(url);
      return response.data;
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
  },
);
export const getListProductName = createAsyncThunk(
  "LIST_PRODUCT_NAME",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/premise/productName";
      const response = await accountManagementService.getAll(url);
      return response.data;
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
  },
);
export const getListServicePointName = createAsyncThunk(
  "LIST_SERVICE_POINT_NAME",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/assets/assetServiceType";
      const response = await accountManagementService.getAll(url);
      return response.data;
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
  },
);
export const getListGsize = createAsyncThunk(
  "LIST_G_SIZE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/assets/getGsizes";
      const response = await accountManagementService.getAll(url);
      return response.data;
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
  },
);
export const getListAnsi = createAsyncThunk("LIST_ANSI", async (thunkAPI) => {
  try {
    const url = "/v1/dbs/api/premise/ansi";
    const response = await accountManagementService.getAll(url);
    return response.data;
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
});
export const getListYear = createAsyncThunk("LIST_ANSI", async (thunkAPI) => {
  try {
    const url = "/v1/dbs/api/premise/ansi";
    const response = await accountManagementService.getAll(url);
    return response.data;
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
});
const assetsSlice = createSlice({
  name: "assets_slice",
  initialState,
  extraReducers: {
    // pagination
    [getAssetsPaginate.pending]: (state, action) => {
      state.loading = true;
    },
    [getAssetsPaginate.rejected]: (state, action) => {
      state.loading = false;
    },
    [getAssetsPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // download
    [downloadAssets.pending]: (state, action) => {
      state.loading = true;
    },
    [downloadAssets.rejected]: (state, action) => {
      state.loading = false;
    },
    [downloadAssets.fulfilled]: (state, action) => {
      state.loading = false;
    },
    // detail
    [getDetailAssets.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailAssets.rejected]: (state, action) => {
      state.loading = false;
    },
    [getDetailAssets.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    // create
    [createAssets.pending]: (state, action) => {
      state.loading = true;
    },
    [createAssets.rejected]: (state, action) => {
      state.loading = false;
    },
    [createAssets.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // update
    [updateAsstes.pending]: (state, action) => {
      state.loading = true;
    },
    [updateAsstes.rejected]: (state, action) => {
      state.loading = false;
    },
    [updateAsstes.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // activation
    [activationAssets.pending]: (state, action) => {
      state.loading = true;
    },
    [activationAssets.rejected]: (state, action) => {
      state.loading = false;
      // state.data = action.payload;
    },
    [activationAssets.fulfilled]: (state, action) => {
      state.loading = false;
      // state.data = action.payload;
    },

    // get list ddl asset name
    [getListAssetName.pending]: (state, action) => {
      state.loading = true;
    },
    [getListAssetName.rejected]: (state, action) => {
      state.loading = false;
      state.data_asset_name = action.payload;
    },
    [getListAssetName.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_asset_name = action.payload;
    },

    // get list ddl asste type
    [getListAssetType.pending]: (state, action) => {
      state.loading = true;
    },
    [getListAssetType.rejected]: (state, action) => {
      state.loading = false;
      state.data_asset_type = action.payload;
    },
    [getListAssetType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_asset_type = action.payload;
    },
    // get list ddl asste brand
    [getListAssetBrand.pending]: (state, action) => {
      state.loading = true;
    },
    [getListAssetBrand.rejected]: (state, action) => {
      state.loading = false;
      state.data_brand_type = action.payload;
    },
    [getListAssetBrand.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_brand_type = action.payload;
    },
    // get list ddl asste service type
    [getListAssetServiceType.pending]: (state, action) => {
      state.loading = true;
    },
    [getListAssetServiceType.rejected]: (state, action) => {
      state.loading = false;
      state.data_service_type = action.payload;
    },
    [getListAssetServiceType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_service_type = action.payload;
    },
    // get list ddl asset product name
    [getListProductName.pending]: (state, action) => {
      state.loading = true;
    },
    [getListProductName.rejected]: (state, action) => {
      state.loading = false;
      state.data_product_name = action.payload;
    },
    [getListProductName.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_product_name = action.payload;
    },
    // get list ddl service point name
    [getListServicePointName.pending]: (state, action) => {
      state.loading = true;
    },
    [getListServicePointName.rejected]: (state, action) => {
      state.loading = false;
      state.data_service_type = action.payload;
    },
    [getListServicePointName.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_service_type = action.payload;
    },
    // get list ddl g size
    [getListGsize.pending]: (state, action) => {
      state.loading = true;
    },
    [getListGsize.rejected]: (state, action) => {
      state.loading = false;
      state.data_gsize = action.payload;
    },
    [getListGsize.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_gsize = action.payload;
    },
    // get list ddl yeAR
    [getListYear.pending]: (state, action) => {
      state.loading = true;
    },
    [getListYear.rejected]: (state, action) => {
      state.loading = false;
      state.data_year = action.payload;
    },
    [getListYear.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_year = action.payload;
    },
    // get list ddl ansi
    [getListYear.pending]: (state, action) => {
      state.loading = true;
    },
    [getListYear.rejected]: (state, action) => {
      state.loading = false;
      state.data_ansi = action.payload;
    },
    [getListYear.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_ansi = action.payload;
    },
  },
});

const { reducer } = assetsSlice;
export default reducer;
