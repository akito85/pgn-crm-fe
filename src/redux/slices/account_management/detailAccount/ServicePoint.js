import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import { showModalError, showModalSuccess } from "../../general_slice";

const initialState = {
  data_detailServicePoint: [],
  data_assetAssignment: [],
  data_choose_asset: [],
  data_globalTypeAssetName: [],
  data_globalTypeListType: [],
  data_globalTypeListBrand: [],
  data_globalTypeListServiceType: [],
  data_globalTypeListGsize: [],
  data_globalTypeListProductName: [],
  data_globalTypeListAnsi: [],
};

//Service Point
export const getDetailServicePoint = createAsyncThunk(
  "GET_DETAIL_SERVICE_POINT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/premise/servicePoint/assets/view/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getAssetAssignment = createAsyncThunk(
  "GET_ASSET_ASSIGNMENT",
  async ({ id, page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/premise/servicePoint/assets/view/list/${id}?page=${page}&size=${pageSize}${sort ? `&sort=${sort}` : ""}${search ? `&searchs=${search}` : ""}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

// ASSET
export const getChooseAsset = createAsyncThunk(
  "GET_CHOOSE_ASSET",
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    try {
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/premise/servicePoint/assets/choose?searchs=${search}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const createAsset = createAsyncThunk(
  "CREATE_ASSET",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/premise/servicePoint/assets/assign`;
      const response = await accountManagementService.createData(url, body);
      return response;
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

export const checkSerialAsset = createAsyncThunk(
  "CHECK-SERIAL_ASSET",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/premise/servicePoint/assets/serialnumber-brand`;
      const response = await accountManagementService.activationWithRemark(
        url,
        body,
      );
      return response;
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
          description: `${message}`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const inActiveAsset = createAsyncThunk(
  "INACTIVE_ASSET",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/premise/servicePoint/assets/inactive`;
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

//global type
export const getGlobalTypeListAssetName = createAsyncThunk(
  "GET_GLOBAL_TYPE_LIST_ASSET_NAME",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/assets/assetName`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getGlobalTypeListType = createAsyncThunk(
  "GET_GLOBAL_TYPE_LIST_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/assets/assetType`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getGlobalTypeListBrand = createAsyncThunk(
  "GET_GLOBAL_TYPE_LIST_BRAND",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/assets/assetBrand`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getGlobalListServiceType = createAsyncThunk(
  "GET_GLOBAL_TYPE_LIST_SERVICE_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/assets/assetServiceType`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getGlobalListGsize = createAsyncThunk(
  "GET_GLOBAL_TYPE_LIST_GSIZE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/assets/getGsizes`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getGlobalListProductName = createAsyncThunk(
  "GET_GLOBAL_TYPE_LIST_PRODUCT_NAME",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/premise/productName`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getGlobalListAnsi = createAsyncThunk(
  "GET_GLOBAL_TYPE_LIST_ANSI",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/premise/ansi`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

const servicePointSlice = createSlice({
  name: "servicePoint",
  initialState,
  extraReducers: {
    //service point
    [getDetailServicePoint.pending]: (state, action) => {
      state.data_detailServicePoint = action.payload;
      state.loading = true;
    },
    [getDetailServicePoint.fulfilled]: (state, action) => {
      state.data_detailServicePoint = action.payload;
      state.loading = false;
    },
    [getDetailServicePoint.rejected]: (state, action) => {
      state.data_detailServicePoint = action.payload;
      state.loading = false;
    },

    [getAssetAssignment.pending]: (state, action) => {
      state.data_assetAssignment = action.payload;
      state.loading = true;
    },
    [getAssetAssignment.fulfilled]: (state, action) => {
      state.data_assetAssignment = action.payload;
      state.loading = false;
    },
    [getAssetAssignment.rejected]: (state, action) => {
      state.data_assetAssignment = action.payload;
      state.loading = false;
    },

    [getChooseAsset.pending]: (state, action) => {
      state.data_choose_asset = action.payload;
      state.loading = true;
    },
    [getChooseAsset.fulfilled]: (state, action) => {
      state.data_choose_asset = action.payload;
      state.loading = false;
    },
    [getChooseAsset.rejected]: (state, action) => {
      state.data_choose_asset = action.payload;
      state.loading = false;
    },

    //GLOBAL TYPE
    [getGlobalTypeListAssetName.pending]: (state, action) => {
      state.data_globalTypeAssetName = action.payload;
      state.loading = true;
    },
    [getGlobalTypeListAssetName.fulfilled]: (state, action) => {
      state.data_globalTypeAssetName = action.payload;
      state.loading = false;
    },
    [getGlobalTypeListAssetName.rejected]: (state, action) => {
      state.data_globalTypeAssetName = action.payload;
      state.loading = false;
    },

    [getGlobalTypeListType.pending]: (state, action) => {
      state.data_globalTypeListType = action.payload;
      state.loading = true;
    },
    [getGlobalTypeListType.fulfilled]: (state, action) => {
      state.data_globalTypeListType = action.payload;
      state.loading = false;
    },
    [getGlobalTypeListType.rejected]: (state, action) => {
      state.data_globalTypeListType = action.payload;
      state.loading = false;
    },

    [getGlobalTypeListBrand.pending]: (state, action) => {
      state.data_globalTypeListBrand = action.payload;
      state.loading = true;
    },
    [getGlobalTypeListBrand.fulfilled]: (state, action) => {
      state.data_globalTypeListBrand = action.payload;
      state.loading = false;
    },
    [getGlobalTypeListBrand.rejected]: (state, action) => {
      state.data_globalTypeListBrand = action.payload;
      state.loading = false;
    },

    [getGlobalListServiceType.pending]: (state, action) => {
      state.data_globalTypeListServiceType = action.payload;
      state.loading = true;
    },
    [getGlobalListServiceType.fulfilled]: (state, action) => {
      state.data_globalTypeListServiceType = action.payload;
      state.loading = false;
    },
    [getGlobalListServiceType.rejected]: (state, action) => {
      state.data_globalTypeListServiceType = action.payload;
      state.loading = false;
    },

    [getGlobalListGsize.pending]: (state, action) => {
      state.data_globalTypeListGsize = action.payload;
      state.loading = true;
    },
    [getGlobalListGsize.fulfilled]: (state, action) => {
      state.data_globalTypeListGsize = action.payload;
      state.loading = false;
    },
    [getGlobalListGsize.rejected]: (state, action) => {
      state.data_globalTypeListGsize = action.payload;
      state.loading = false;
    },

    [getGlobalListProductName.pending]: (state, action) => {
      state.data_globalTypeListProductName = action.payload;
      state.loading = true;
    },
    [getGlobalListProductName.fulfilled]: (state, action) => {
      state.data_globalTypeListProductName = action.payload;
      state.loading = false;
    },
    [getGlobalListProductName.rejected]: (state, action) => {
      state.data_globalTypeListProductName = action.payload;
      state.loading = false;
    },

    [getGlobalListAnsi.pending]: (state, action) => {
      state.data_globalTypeListAnsi = action.payload;
      state.loading = true;
    },
    [getGlobalListAnsi.fulfilled]: (state, action) => {
      state.data_globalTypeListAnsi = action.payload;
      state.loading = false;
    },
    [getGlobalListAnsi.rejected]: (state, action) => {
      state.data_globalTypeListProductName = action.payload;
      state.loading = false;
    },
  },
});
const { reducer } = servicePointSlice;
export default reducer;
