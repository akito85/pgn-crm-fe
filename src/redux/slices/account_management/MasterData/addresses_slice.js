import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../../general_slice";
import {
  errorBody,
  errorCode,
  errorMessage,
  hasValue,
} from "../../../../utils";

const initialState = {
  data: null,
  loading: false,
  data_detail: null,
  message: "",
  data_country: null,
  data_province: null,
  data_city: null,
  data_district: null,
  data_sub_district: null,
  data_postal_code: null,
  data_type: null,
};

export const getAddressesPaginate = createAsyncThunk(
  "GET_ADDRESS_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/master/address?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
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
          action: "GET_ADDRESS_PAGINATE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const downloadAddress = createAsyncThunk(
  "DOWNLOAD_ADDRESS",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/master/address/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_ADDRESS",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const getDetailAddress = createAsyncThunk(
  "GET_DETAIL_ADDRESS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/address/detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DETAIL_ADDRESS",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);
export const createAddress = createAsyncThunk(
  "CREATE_ADDRESS",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/address/create";
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
          action: "CREATE_ADDRESS",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updateAddress = createAsyncThunk(
  "UPDATE_ADDRESS",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/address/update";
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
          action: "UPDATE_ADDRESS",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const activationAddress = createAsyncThunk(
  "ACTIVATION_ADDRESS",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/address/activate-inactive";
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: response?.message,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "ACTIVATION_ADDRESS",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// lov
export const getListCountry = createAsyncThunk(
  "GET_LIST_COUNTRY",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/address/list-country";
      const response = await accountManagementService.getAll(url);
      const responseMap = response?.data?.map((item) => ({
        name: item?.locationName,
        value: item?.locationId,
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
  }
);
export const getListProvince = createAsyncThunk(
  "GET_LIST_PROVINCE",
  async (id, thunkAPI) => {
    try {
      if (hasValue(id)) {
        const url = `/v1/dbs/api/master/address/list-province/${id}`;
        const response = await accountManagementService.getDetail(url);
        const responseMap = response?.data?.map((item) => ({
          name: item?.locationName,
          value: item?.locationId,
        }));
        return responseMap;
      } else {
        thunkAPI.dispatch(setClearProvince());
      }
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
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getListCity = createAsyncThunk(
  "GET_LIST_CITY",
  async (id, thunkAPI) => {
    try {
      if (hasValue(id)) {
        const url = `/v1/dbs/api/master/address/list-city/${id}`;
        const response = await accountManagementService.getAll(url);
        const responseMap = response?.data?.map((item) => ({
          name: item?.locationName,
          value: item?.locationId,
        }));
        return responseMap;
      } else {
        thunkAPI.dispatch(setClearCity());
      }
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
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getListDistrict = createAsyncThunk(
  "GET_LIST_DISTRICT",
  async (id, thunkAPI) => {
    try {
      if (hasValue(id)) {
        const url = `/v1/dbs/api/master/address/list-district/${id}`;
        const response = await accountManagementService.getAll(url);
        const responseMap = response?.data?.map((item) => ({
          name: item?.locationName,
          value: item?.locationId,
        }));
        return responseMap;
      } else {
        thunkAPI.dispatch(setClearDistrict());
      }
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
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getListSubDistrict = createAsyncThunk(
  "GET_LIST_SUB_DISTRICT",
  async (id, thunkAPI) => {
    try {
      if (hasValue(id)) {
        const url = `/v1/dbs/api/master/address/list-sub-district/${id}`;
        const response = await accountManagementService.getAll(url);
        const responseMap = response?.data?.map((item) => ({
          name: item?.locationName,
          value: item?.locationId,
        }));
        return responseMap;
      } else {
        thunkAPI.dispatch(setClearDistrict());
      }
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
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getListPostalCode = createAsyncThunk(
  "GET_LIST_POSTAL_CODE",
  async (id, thunkAPI) => {
    try {
      if (hasValue(id)) {
        const url = `/v1/dbs/api/master/address/list-postal-code/${id}`;
        const response = await accountManagementService.getAll(url);
        const responseMap = response?.data?.map((item) => ({
          name: item?.locationName,
          value: item?.locationId,
        }));
        return responseMap;
      } else {
        thunkAPI.dispatch(setClearSubDistrict());
      }
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
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getTypeAddress = createAsyncThunk(
  "GET_TYPE_ADDRESS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/address/list/type`;
      const response = await accountManagementService.getAll(url);
      const responseMap = response?.data?.map((item) => ({
        name: item?.name,
        value: item?.id,
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
  }
);

const addressSlice = createSlice({
  name: "address_slice",
  initialState,
  reducers: {
    setClearProvince: (state) => {
      state.data_province = null;
      state.data_city = null;
      state.data_district = null;
      state.data_sub_district = null;
      state.data_postal_code = null;
    },
    setClearCity: (state) => {
      state.data_city = null;
      state.data_district = null;
      state.data_sub_district = null;
      state.data_postal_code = null;
    },
    setClearDistrict: (state) => {
      state.data_sub_district = null;
      state.data_postal_code = null;
    },
    setClearSubDistrict: (state) => {
      state.data_postal_code = null;
    },
  },
  extraReducers: {
    // pagination
    [getAddressesPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAddressesPaginate.rejected]: (state) => {
      state.loading = false;
    },
    [getAddressesPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // download
    [downloadAddress.pending]: (state) => {
      state.loading = true;
    },
    [downloadAddress.rejected]: (state) => {
      state.loading = false;
    },
    [downloadAddress.fulfilled]: (state) => {
      state.loading = false;
      // state.data = action.payload;
    },
    // detail
    [getDetailAddress.pending]: (state) => {
      state.loading = true;
    },
    [getDetailAddress.rejected]: (state) => {
      state.loading = false;
    },
    [getDetailAddress.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    // create
    [createAddress.pending]: (state) => {
      state.loading = true;
    },
    [createAddress.rejected]: (state) => {
      state.loading = false;
    },
    [createAddress.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // update
    [updateAddress.pending]: (state) => {
      state.loading = true;
    },
    [updateAddress.rejected]: (state) => {
      state.loading = false;
    },
    [updateAddress.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // activation
    [activationAddress.pending]: (state) => {
      state.loading = true;
    },
    [activationAddress.rejected]: (state) => {
      state.loading = false;
      // state.data = action.payload;
    },
    [activationAddress.fulfilled]: (state) => {
      state.loading = false;
      // state.data = action.payload;
    },

    // lov

    // country
    [getListCountry.pending]: (state) => {
      state.loading = true;
    },
    [getListCountry.rejected]: (state, action) => {
      state.loading = false;
      state.data_country = action.payload;
    },
    [getListCountry.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_country = action.payload;
    },

    // province
    [getListProvince.pending]: (state) => {
      state.loading = true;
    },
    [getListProvince.rejected]: (state, action) => {
      state.loading = false;
      state.data_province = action.payload;
    },
    [getListProvince.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_province = action.payload;
    },

    // city
    [getListCity.pending]: (state) => {
      state.loading = true;
    },
    [getListCity.rejected]: (state, action) => {
      state.loading = false;
      state.data_city = action.payload;
    },
    [getListCity.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_city = action.payload;
    },

    // district
    [getListDistrict.pending]: (state) => {
      state.loading = true;
    },
    [getListDistrict.rejected]: (state, action) => {
      state.loading = false;
      state.data_district = action.payload;
    },
    [getListDistrict.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_district = action.payload;
    },

    // sub district
    [getListSubDistrict.pending]: (state) => {
      state.loading = true;
    },
    [getListSubDistrict.rejected]: (state, action) => {
      state.loading = false;
      state.data_sub_district = action.payload;
    },
    [getListSubDistrict.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_sub_district = action.payload;
    },

    // postal code
    [getListPostalCode.pending]: (state) => {
      state.loading = true;
    },
    [getListPostalCode.rejected]: (state, action) => {
      state.loading = false;
      state.data_postal_code = action.payload;
    },
    [getListPostalCode.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_postal_code = action.payload;
    },
    // postal code
    [getTypeAddress.pending]: (state) => {
      state.loading = true;
    },
    [getTypeAddress.rejected]: (state, action) => {
      state.loading = false;
      state.data_type = action.payload;
    },
    [getTypeAddress.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_type = action.payload;
    },
  },
});

const { reducer } = addressSlice;
export const {
  setClearProvince,
  setClearCity,
  setClearDistrict,
  setClearSubDistrict,
} = addressSlice.actions;
export default reducer;
