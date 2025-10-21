import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  setBodyError,
  showModalError,
  validateError,
} from "../../general_slice";
import { showModalSuccess } from "../../general_slice";
import accountManagementService from "../../../services/account_management/accountManagementService";
import { validateCaptcha } from "react-simple-captcha";
import { errorBody, errorCode, errorMessage } from "../../../../utils";

const initialState = {
  data: [],
  dataQuality: [],
  data_detail: [],
  data_detail_quality: [],
  data_uom: [],
  data_cost_center: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
  message: "",
};

export const getAllGasSourcePaginate = createAsyncThunk(
  "GET_ALL_GAS_SOURCE_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/gas-source/paging?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response.data;
    } catch (error) {
      // const message =
      //   error?.response?.data?.message || error?.message || error?.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //   thunkAPI.dispatch(setBodyError(error));
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `${message}`,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody))
      // }
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_GAS_SOURCE_PAGINATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getAllGasSourceQualityPaginate = createAsyncThunk(
  "GET_ALL_GAS_SOURCE_QUALITY_PAGINATE",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/gas-source/paging-quality/${id}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response.data;
    } catch (error) {
      // const message =
      //   error?.response?.data?.message || error?.message || error?.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //   thunkAPI.dispatch(setBodyError(error));
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `${message}`,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody))
      // }
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_GAS_SOURCE_QUALITY_PAGINATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getUOM = createAsyncThunk("GET_UOM", async (_, thunkAPI) => {
  try {
    const url = `/v1/dbs/api/gas-source/get-UOM`;
    const response = await accountManagementService.getAll(url);
    return response.data;
  } catch (error) {
    // const message =
    //   error?.response?.data?.message || error?.message || error?.toString();
    // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
    //   thunkAPI.dispatch(setBodyError(error));
    // } else {
    //   const errorBody = {
    //     title: "Failed",
    //     description: `${message}`,
    //   };
    //   thunkAPI.dispatch(showModalError(errorBody))
    // }
    thunkAPI.dispatch(
      validateError({ error: error, action: "GET_UOM", back: false }),
    );
    return thunkAPI.rejectWithValue(error?.response);
  }
});

export const getCostCenter = createAsyncThunk(
  "GET_COST_CENTER",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-source/cost-center`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      // const message =
      //   error?.response?.data?.message || error?.message || error?.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //   thunkAPI.dispatch(setBodyError(error));
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `${message}`,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody))
      // }
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_COST_CENTER", back: false }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const downloadGasSource = createAsyncThunk(
  "DOWNLOAD_GAS_SOURCE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/gas-source/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_GAS_SOURCE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const createGasSource = createAsyncThunk(
  "CREATE_GAS_SOURCE",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/gas-source/create";
      const response = await accountManagementService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been created.",
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      // const message =
      //   (error.response &&
      //     error.response.data &&
      //     error.response.data.message) ||
      //   error.message ||
      //   error.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //   thunkAPI.dispatch(setBodyError(error));
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `Your data was not created. ${message}. Please try again.`,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody));
      // }
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "CREATE_GAS_SOURCE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const createGasSourceQuality = createAsyncThunk(
  "CREATE_GAS_SOURCE_QUALITY",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/gas-source/create-quality";
      const response = await accountManagementService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been created.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      // const message =
      //   (error.response &&
      //     error.response.data &&
      //     error.response.data.message) ||
      //   error.message ||
      //   error.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //   thunkAPI.dispatch(setBodyError(error));
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `Your data was not created. ${message}. Please try again.`,
      //     return: false,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody));
      // }
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "CREATE_GAS_SOURCE_QUALITY",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
export const updateEnDateGasSourceQuality = createAsyncThunk(
  "UPDATE_END_DATE_GAS_SOURCE_QUALITY",
  async (body, thunkAPI) => {
    // console.log("🚀 ~ body:", body)
    try {
      const url = "/v1/dbs/api/gas-source/update-quality";
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been updated.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "UPDATE_END_DATE_GAS_SOURCE_QUALITY",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const updateGasSource = createAsyncThunk(
  "UPDATE_GAS_SOURCE",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/gas-source/update";
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been updated.",
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      // const message =
      //   (error.response &&
      //     error.response.data &&
      //     error.response.data.message) ||
      //   error.message ||
      //   error.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //   thunkAPI.dispatch(setBodyError(error));
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `Your data was not updated. ${message}. Please try again.`,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody));
      // }
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "updated", errorMessage(error)),
          action: "UPDATE_GAS_SOURCE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const activeOrInactiveGasSource = createAsyncThunk(
  "ACTIVE_OR_INACTIVE_GAS_SOURCE",
  async ({ body, activeOrInactive }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/gas-source/active-inactive";
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${activeOrInactive}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      // const message =
      //   (error.response &&
      //     error.response.data &&
      //     error.response.data.message) ||
      //   error.message ||
      //   error.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //   thunkAPI.dispatch(setBodyError(error));
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `Your data was not ${activeOrInactive}. ${message}. Please try again.`,
      //     return: false,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody));
      // }
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "ACTIVE_OR_INACTIVE_GAS_SOURCE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const activeOrInactiveGasSourceQuality = createAsyncThunk(
  "ACTIVE_OR_INACTIVE_GAS_SOURCE_QUALITY",
  async ({ body, activeOrInactive }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/gas-source/active-inactive-quality";
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${activeOrInactive}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      // const message =
      //   (error.response &&
      //     error.response.data &&
      //     error.response.data.message) ||
      //   error.message ||
      //   error.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //   thunkAPI.dispatch(setBodyError(error));
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `Your data was not ${activeOrInactive}. ${message}. Please try again.`,
      //     return: false,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody))
      // };
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "ACTIVE_OR_INACTIVE_GAS_SOURCE_QUALITY",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getDetailGasSource = createAsyncThunk(
  "GET_DETAIL_GAS_SOURCE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-source/detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      // const message =
      //   error?.response?.data?.message || error?.message || error?.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //   thunkAPI.dispatch(setBodyError(error));
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `${message}`,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody))
      // }
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DETAIL_GAS_SOURCE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const getDetailGasSourceQuality = createAsyncThunk(
  "GET_DETAIL_GAS_SOURCE_QUALITY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-source/detail-quality/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      // const message =
      //   error?.response?.data?.message || error?.message || error?.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //   thunkAPI.dispatch(setBodyError(error));
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `${message}`,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody))
      // }
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DETAIL_GAS_SOURCE_QUALITY",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

const gasSourceSlice = createSlice({
  name: "gasSource",
  initialState,
  extraReducers: {
    // Get All Gas Source Pagination
    [getAllGasSourcePaginate.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [getAllGasSourcePaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getAllGasSourcePaginate.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // Get All Gas Source Quality Pagination
    [getAllGasSourceQualityPaginate.pending]: (state, action) => {
      state.loading = true;
      state.dataQuality = action.payload;
    },
    [getAllGasSourceQualityPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataQuality = action.payload;
    },
    [getAllGasSourceQualityPaginate.rejected]: (state, action) => {
      state.loading = false;
      state.dataQuality = action.payload;
    },

    // Get UOM
    [getUOM.pending]: (state, action) => {
      state.loading = true;
      state.data_uom = action.payload;
    },
    [getUOM.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_uom = action.payload;
    },
    [getUOM.rejected]: (state, action) => {
      state.loading = false;
      state.data_uom = action.payload;
    },

    // Get Cost Center
    [getCostCenter.pending]: (state, action) => {
      state.loading = true;
      state.data_cost_center = action.payload;
    },
    [getCostCenter.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_cost_center = action.payload;
    },
    [getCostCenter.rejected]: (state, action) => {
      state.loading = false;
      state.data_cost_center = action.payload;
    },

    // Create Gas Source
    [createGasSource.pending]: (state, action) => {
      state.loading = true;
    },
    [createGasSource.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [createGasSource.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
    },

    // Create Gas Source Quality
    [createGasSourceQuality.pending]: (state, action) => {
      state.loading = true;
    },
    [createGasSourceQuality.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [createGasSourceQuality.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
    },

    // Update Gas Source
    [updateGasSource.pending]: (state, action) => {
      state.loading = true;
    },
    [updateGasSource.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [updateGasSource.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
    },

    // Update End Date Gas Source Quality
    [updateEnDateGasSourceQuality.pending]: (state, action) => {
      state.loading = true;
    },
    [updateEnDateGasSourceQuality.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [updateEnDateGasSourceQuality.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
    },

    /* Get Detail Gas Source */
    [getDetailGasSource.pending]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = true;
    },
    [getDetailGasSource.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailGasSource.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },

    /* Get Detail Gas Source Quality */
    [getDetailGasSourceQuality.pending]: (state, action) => {
      state.data_detail_quality = action.payload;
      state.loading = true;
    },
    [getDetailGasSourceQuality.fulfilled]: (state, action) => {
      state.data_detail_quality = action.payload;
      state.loading = false;
    },
    [getDetailGasSourceQuality.rejected]: (state, action) => {
      state.data_detail_quality = action.payload;
      state.loading = false;
    },

    /* Active/Inactive Gas Source */
    [activeOrInactiveGasSource.pending]: (state, action) => {
      state.loading = true;
    },
    [activeOrInactiveGasSource.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [activeOrInactiveGasSource.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
    },

    /* Active/Inactive Gas Source Quality*/
    [activeOrInactiveGasSourceQuality.pending]: (state, action) => {
      state.loading = true;
    },
    [activeOrInactiveGasSourceQuality.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [activeOrInactiveGasSourceQuality.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
    },

    /* Download Gas Source */
    [downloadGasSource.pending]: (state, action) => {
      state.loading = true;
    },
    [downloadGasSource.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [downloadGasSource.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

const { reducer } = gasSourceSlice;
export default reducer;
