import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import gpService from "../../services/system_setup/globalProperties";
import { validateError } from "../general_slice";
import { showModalSuccess } from "../general_slice";
import userHttpService from "../../services/userHttpService";
import { errorBody, errorCode, errorMessage } from "../../../utils";

const initialState = {
  data: [],
  data_detail: [],
  dataValue: [],
  data_Type: [],
  data_Type_Detail: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
  message: "",
  result: "",
};

export const getAllGlobalPropertiesPaginate = createAsyncThunk(
  "GET_ALL_GLOBAL_PROPERTIES_PAGINATE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    const searchParams = search === undefined ? "" : search;
    const sortParams =
      sort === undefined || sort === "" ? "createdDate~desc" : sort;
    try {
      const response = await gpService.getAllGlobalPropertiesPaginate(
        searchParams,
        page,
        pageSize,
        sortParams
      );
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_GLOBAL_PROPERTIES_PAGINATE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getGlobalPropertiesDetail = createAsyncThunk(
  "GET_GLOBAL_PROPERTIES_DETAIL",
  async (id, thunkAPI) => {
    try {
      const response = await gpService.getGlobalPropertiesDetail(id);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_GLOBAL_PROPERTIES_DETAIL",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getGlobalPropertiesDetailValue = createAsyncThunk(
  "GET_GLOBAL_PROPERTIES_DETAIL_VALUE",
  async ({ id, page, pageSize, sort, search }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/globalproperties/getDetailValue/${id}?page=${page}&size=${pageSize}&sort=${sortParams}&search=${searchParams}`;
      const response = await userHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_GLOBAL_PROPERTIES_DETAIL_VALUE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const inactiveGlobalProperties = createAsyncThunk(
  "INACTIVE_GLOBAL_PROPERTIES",
  async ({ id, statusData }, thunkAPI) => {
    let status = statusData === "ACTIVE" ? "inactivated" : "activated";
    try {
      const url = `/v1/dbs/api/globalproperties/inactive/detail/${id}`;
      const response = await userHttpService.deleteData(url);
      const successMessage = {
        title: "Successfull",
        description: response.message,
        icon: "icon_success_inactivate",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), status, errorMessage(error)),
          action: "INACTIVE_GLOBAL_PROPERTIES",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteGlobalProperties = createAsyncThunk(
  "DELETE_GLOBAL_PROPERTIES",
  async (id, thunkAPI) => {
    try {
      const response = await gpService.deleteGlobalProperties(id);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DELETE_GLOBAL_PROPERTIES",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const createGlobalProperties = createAsyncThunk(
  "CREATE_GLOBAL_PROPERTIES",
  async ({ body, responseSuccess }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/globalproperties/create`;
      const response = await userHttpService.createData(url, body);
      thunkAPI.dispatch(showModalSuccess(responseSuccess));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "CREATE_GLOBAL_PROPERTIES",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateGlobalProperties = createAsyncThunk(
  "UPDATE_GLOBAL_PROPERTIES",
  async ({ body, responseSuccess }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/globalproperties/update";
      const response = await userHttpService.updateData(url, body);
      thunkAPI.dispatch(showModalSuccess(responseSuccess));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "updated", errorMessage(error)),
          action: "UPDATE_GLOBAL_PROPERTIES",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllTypeGlobalProperties = createAsyncThunk(
  "GET_ALL_GLOBAL_PROPERTIES_TYPE",
  async (thunkAPI) => {
    try {
      const response = await gpService.getAllTypeGlobalProperties();
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_GLOBAL_PROPERTIES_TYPE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDataType = createAsyncThunk(
  "GET_DATA_TYPE_GLOBAL_PROPERTIES",
  async (_, thunkAPI) => {
    try {
      const response = await gpService.getDataType();
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DATA_TYPE_GLOBAL_PROPERTIES",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Download
export const downloadExcelGlobalProperties = createAsyncThunk(
  "DOWNLOAD_GLOBAL_PROPERTIES_EXCEL",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/globalproperties/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.downloadData(url);
      return response;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_GLOBAL_PROPERTIES_EXCEL",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const gpSlice = createSlice({
  name: "globalProperties",
  initialState,
  extraReducers: {
    // get all gp paginate
    [getAllGlobalPropertiesPaginate.pending]: (state) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
    },
    [getAllGlobalPropertiesPaginate.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data = action.payload;
      state.loading = false;
    },
    [getAllGlobalPropertiesPaginate.rejected]: (state) => {
      state.loading = false;
    },
    // get gp detail
    [getGlobalPropertiesDetail.pending]: (state, action) => {
      state.loading = true;
      state.data_detail = action.payload;
    },
    [getGlobalPropertiesDetail.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getGlobalPropertiesDetail.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    // get gp detail value
    [getGlobalPropertiesDetailValue.pending]: (state, action) => {
      state.loading = true;
      state.dataValue = action.payload;
    },
    [getGlobalPropertiesDetailValue.fulfilled]: (state, action) => {
      state.dataValue = action.payload;
      state.loading = false;
    },
    [getGlobalPropertiesDetailValue.rejected]: (state, action) => {
      state.dataValue = action.payload;
      state.loading = false;
    },
    // inactive gp
    [inactiveGlobalProperties.pending]: (state) => {
      state.loading = true;
    },
    [inactiveGlobalProperties.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveGlobalProperties.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.result = action.payload;
    },
    // delete gp
    [deleteGlobalProperties.pending]: (state) => {
      state.loading = true;
    },
    [deleteGlobalProperties.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [deleteGlobalProperties.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },
    // create global properties
    [createGlobalProperties.pending]: (state) => {
      state.loading = true;
    },
    [createGlobalProperties.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [createGlobalProperties.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.result = action.payload;
    },
    // update global properties
    [updateGlobalProperties.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [updateGlobalProperties.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isSuccess = true;
      state.loading = false;
    },
    [updateGlobalProperties.rejected]: (state, action) => {
      state.data = action.payload;
      state.isFailed = true;
      state.loading = false;
    },

    // get all gp type
    [getAllTypeGlobalProperties.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_Type = action.payload;
    },
    [getAllTypeGlobalProperties.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_Type = action.payload;
      state.loading = false;
    },
    [getAllTypeGlobalProperties.rejected]: (state, action) => {
      state.data_Type = action.payload;
      state.loading = false;
    },

    // get data type
    [getDataType.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_Type_Detail = action.payload;
    },
    [getDataType.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_Type_Detail = action.payload;
      state.loading = false;
    },
    [getDataType.rejected]: (state, action) => {
      state.data_Type_Detail = action.payload;
      state.loading = false;
    },

    // Download
    [downloadExcelGlobalProperties.pending]: (state) => {
      state.loading = true;
    },
    [downloadExcelGlobalProperties.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadExcelGlobalProperties.rejected]: (state) => {
      state.loading = false;
    },
  },
});

const { reducer } = gpSlice;
export default reducer;
