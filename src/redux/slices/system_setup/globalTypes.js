import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userHttpService from "../../services/userHttpService";
import {  showModalSuccess, validateError } from "../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../utils";

const initialState = {
  data: null,
  data_detail: null,
  data_detail_value: null,
  dataSortBy: null,
  dataParentAndGroup: null,
  isSuccess: false,
  isFailed: false,
  loading: false,
  result: "",
  global_detail: null,
};

// slices get all global types
export const getAllGlobalTypesPaginate = createAsyncThunk(
  "GET_ALL_GLOBAL_TYPES_PAGINATE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "glbTypeId~desc" : sort;
      const url = `/v1/dbs/api/globaltype/view/paging?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: error, action: "GET_ALL_GLOBAL_TYPES_PAGINATE", back: false }))
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// create global type slice
export const createGlobalType = createAsyncThunk(
  "CREATE_GLOBAL_TYPE",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/globaltype/create";
      const response = await userHttpService.createData(url, body);
      const successMessage = {
        title: "Successfull",
        description: "Your data has been created",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(validateError({ error: errorBody(errorCode(response), 'created', errorMessage(response)), action: "CREATE_GLOBAL_TYPE", back: false }))
      return thunkAPI.rejectWithValue(response);
    }
  }
);

// update global type slice
export const updateGlobalType = createAsyncThunk(
  "UPDATE_GLOBAL_TYPE",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/globaltype/update";
      const response = await userHttpService.updateData(url, body);
      const successMessage = {
        title: "Successfull",
        description: response?.message,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(validateError({ error: errorBody(errorCode(response), 'updated', errorMessage(response)), action: "UPDATE_GLOBAL_TYPE", back: false }))
      return thunkAPI.rejectWithValue(response);
    }
  }
);

// View Detail Global Type
export const getViewDetailGlobalType = createAsyncThunk(
  "GET_VIEW_DETAIL_GLOBAL_TYPE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/globaltype/view/${id}`;
      const response = await userHttpService.getDetail(url);
      return response;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: error, action: "GET_VIEW_DETAIL_GLOBAL_TYPE", back: false }))
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDetailGlobalType = createAsyncThunk(
  "GET_DETAIL_GLOBAL_TYPE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/globaltype/view/${id}`;
      const data = await userHttpService.getDetail(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: error, action: "GET_DETAIL_GLOBAL_TYPE", back: false }))
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Detail Global Type Value
export const getDetailGlobalTypeValue = createAsyncThunk(
  "GET_DETAIL_GLOBAL_TYPE_VALUE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/globaltype/value/view/${id}`;
      const response = await userHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: error, action: "GET_DETAIL_GLOBAL_TYPE_VALUE", back: false }))
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Sort By
export const getSortBy = createAsyncThunk(
  "GET_GLOBAL_TYPE_SORT_BY",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/globaltype/sortBy";
      const response = await userHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: error, action: "GET_GLOBAL_TYPE_SORT_BY", back: false }))
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Parent and Group
export const getParentAndGroup = createAsyncThunk(
  "GET_GLOBAL_TYPE_PARENT_AND_GROUP",
  async (_,thunkAPI) => {
    try {
      const url = "/v1/dbs/api/globaltype/parent/group";
      const response = await userHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: error, action: "GET_GLOBAL_TYPE_PARENT_AND_GROUP", back: false }))
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Inactive
export const inactiveGlobalType = createAsyncThunk(
  "INACTIVE_GLOBAL_TYPE",
  async ({ id, statusData }, thunkAPI) => {
    let status = statusData === "ACTIVE" ? 'inactivated' : 'activated';
    try {
      const url = `/v1/dbs/api/globaltype/inactive/${id}`;
      const response = await userHttpService.deleteData(url);
      // const response = await globalTypesService.inactiveGlobalType(id)
      const successMessage = {
        title: "Successfull",
        description: response.message,
        icon: "icon_success_inactivate",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: errorBody(errorCode(error), status, errorMessage(error)), action: "INACTIVE_GLOBAL_TYPE", back: false }))
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Download
export const downloadExcelGlobalType = createAsyncThunk(
  "DOWNLOAD_GLOBAL_TYPE_EXCEL",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "glbTypeId~desc" : sort;
      const url = `/v1/dbs/api/globaltype/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.downloadData(url);
      return response;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: error, action: "DOWNLOAD_GLOBAL_TYPE_EXCEL", back: false }))
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const globalTypesSlice = createSlice({
  name: "globalTypes",
  initialState,
  extraReducers: {
    // get all gp paginate
    [getAllGlobalTypesPaginate.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [getAllGlobalTypesPaginate.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getAllGlobalTypesPaginate.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // create global type reducer
    [createGlobalType.pending]: (state, action) => {
      state.loading = true;
    },
    [createGlobalType.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [createGlobalType.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.result = action.payload;
    },

    // update global type reducer
    [updateGlobalType.pending]: (state, action) => {
      state.loading = true;
    },
    [updateGlobalType.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [updateGlobalType.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
    },

    // Get View Detail Global Type
    [getViewDetailGlobalType.pending]: (state, action) => {
      state.loading = true;
      state.data_detail = action.payload;
    },
    [getViewDetailGlobalType.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getViewDetailGlobalType.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },

    // Get Detail Global Type Value
    [getDetailGlobalTypeValue.pending]: (state, action) => {
      state.data_detail_value = action.payload;
      state.loading = true;
    },
    [getDetailGlobalTypeValue.fulfilled]: (state, action) => {
      state.data_detail_value = action.payload;
      state.loading = false;
    },
    [getDetailGlobalTypeValue.rejected]: (state, action) => {
      state.loading = false;
    },

    // Sort By
    [getSortBy.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.dataSortBy = action.payload;
    },
    [getSortBy.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.dataSortBy = action.payload;
      state.loading = false;
    },
    [getSortBy.rejected]: (state, action) => {
      state.dataSortBy = action.payload;
      state.loading = false;
    },

    // Parent and Group
    [getParentAndGroup.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.dataParentAndGroup = action.payload;
    },
    [getParentAndGroup.fulfilled]: (state, action) => {
      state.dataParentAndGroup = action.payload;
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = false;
    },
    [getParentAndGroup.rejected]: (state, action) => {
      state.dataParentAndGroup = action.payload;
      state.loading = false;
    },

    // inactive Global Type
    [inactiveGlobalType.pending]: (state, action) => {
      state.loading = true;
    },
    [inactiveGlobalType.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveGlobalType.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
    },

    // Download
    [downloadExcelGlobalType.pending]: (state) => {
      state.loading = true;
    },
    [downloadExcelGlobalType.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [downloadExcelGlobalType.rejected]: (state) => {
      state.loading = false;
    },

    [getDetailGlobalType.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailGlobalType.fulfilled]: (state, action) => {
      state.loading = false;
      state.global_detail = action.payload;
    },
    [getDetailGlobalType.rejected]: (state, action) => {
      state.loading = false;
      state.global_detail = action.payload;
    },
  },
});

const { reducer } = globalTypesSlice;
export default reducer;
