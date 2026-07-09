import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userHttpService from "../../../services/userHttpService";
import { showModalSuccess, validateError } from "../../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../../utils";

const initialState = {
  data: [],
  data_detail: {},
  data_download: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
  status: "",
  data_cost_center: null,
};
export const getListMasterPosition = createAsyncThunk(
  "LIST_MASTER_POSITION",
  async ({ page, pageSize, sort, search, searchText, filters = [], filterRules = [] }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/position/paging`;
      const body = {
        page,
        size: pageSize,
        sort: sort || "createdDate~desc",
        search: searchText || null,
        searchs: search || {},
        filters,
        filterRules,
      };
      const response = await userHttpService.createData(url, body);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "LIST_MASTER_POSITION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);
export const getDetailMasterPosition = createAsyncThunk(
  "GET_DETAIL_MASTER_POSITION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/position/getDetail/${id}`;
      const response = await userHttpService.getDetail(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "GET_DETAIL_MASTER_POSITION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);
export const createMasterPosition = createAsyncThunk(
  "CREATE_MASTER_POSITION",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/position/create`;
      const response = await userHttpService.createData(url, body);
      const successMessage = {
        title: "Successfull",
        description: "Your data has been created",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "created",
            errorMessage(response)
          ),
          action: "CREATE_MASTER_POSITION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const validateCreatePosition = createAsyncThunk(
  "VALIDATE_CREATE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/position/validate-create`;
      const response = await userHttpService.createData(url, body);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "VALIDATE_CREATE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const inactiveMasterPosition = createAsyncThunk(
  "INACTIVE_MASTER_POSITION",
  async (body, thunkAPI) => {
    let status = body?.statusData === "ACTIVE" ? "inactivated" : "activated";
    try {
      const url = `/v1/dbs/api/position/active/inactive`;
      const response = await userHttpService.activationWithRemark(url, body);
      const successMessage = {
        title: "Successfull",
        description: response?.message,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(response), status, errorMessage(response)),
          action: "INACTIVE_MASTER_POSITION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);
export const deleteMasterPosition = createAsyncThunk(
  "DELETE_MASTER_POSITION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/position/${id}/delete`;
      const response = await userHttpService.deleteData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "deleted",
            errorMessage(response)
          ),
          action: "DELETE_MASTER_POSITION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);
export const updateMasterPosition = createAsyncThunk(
  "UPDATE_MASTER_POSITION",
  async (body, thunkApi) => {
    try {
      const url = `/v1/dbs/api/position/update`;
      const response = await userHttpService.updateData(url, body);
      const successMessage = {
        title: "Successfull",
        description: "Your data has been updated",
      };
      thunkApi.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (response) {
      thunkApi.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "updated",
            errorMessage(response)
          ),
          action: "UPDATE_MASTER_POSITION",
          back: false,
        })
      );
      return thunkApi.rejectWithValue(response.response.data);
    }
  }
);

export const downloadMasterPosition = createAsyncThunk(
  "DOWNLOAD_MASTER_POSITION",
  async ({ page, pageSize, sort, search, searchText, filters = [], filterRules = [] }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/position/download-filter`;
      const body = {
        page,
        size: pageSize,
        sort: sort || "createdDate~desc",
        search: searchText || null,
        searchs: search || {},
        filters,
        filterRules,
      };
      const response = await userHttpService.downloadData(url, body);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_MASTER_POSITION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);
export const getAllCostCenterDDL = createAsyncThunk(
  "GET_DDL_COST_CENTER",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/position/getCostCenter`;
      const response = await userHttpService.getAll(url);
      return response;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "GET_DDL_COST_CENTER",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);
const masterPositionSlice = createSlice({
  name: "master_position",
  initialState,
  extraReducers: {
    // get all
    [getListMasterPosition.pending]: (state) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
    },
    [getListMasterPosition.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = false;
    },
    [getListMasterPosition.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    // detail
    [getDetailMasterPosition.pending]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = true;
    },
    [getDetailMasterPosition.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailMasterPosition.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    // inactive position
    [inactiveMasterPosition.pending]: (state) => {
      state.loading = true;
    },
    [inactiveMasterPosition.fulfilled]: (state, action) => {
      state.data = action?.payload;
      state.loading = false;
    },
    [inactiveMasterPosition.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },
    // create position
    [createMasterPosition.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [createMasterPosition.pending]: (state) => {
      state.loading = true;
    },
    [createMasterPosition.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },
    // valdiate create position
    [validateCreatePosition.fulfilled]: (state) => {
      state.loading = false;
    },
    [validateCreatePosition.pending]: (state) => {
      state.loading = true;
    },
    [validateCreatePosition.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },
    // update position
    [updateMasterPosition.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [updateMasterPosition.pending]: (state) => {
      state.loading = true;
    },
    [updateMasterPosition.rejected]: (state, action) => {
      state.isFailed = true;
      state.data = action.payload;
      state.loading = false;
    },

    // update position
    [downloadMasterPosition.pending]: (state) => {
      state.loading = true;
    },
    [downloadMasterPosition.fulfilled]: (state, action) => {
      state.data_download = action.payload;
      state.loading = false;
    },
    [downloadMasterPosition.rejected]: (state, action) => {
      state.isFailed = true;
      state.data_download = action.payload;
      state.loading = false;
    },

    // get cost center ddl
    [getAllCostCenterDDL.pending]: (state, action) => {
      state.data_cost_center = action.payload;
      state.loading = true;
    },
    [getAllCostCenterDDL.fulfilled]: (state, action) => {
      state.data_cost_center = action.payload;
      state.loading = false;
    },
    [getAllCostCenterDDL.rejected]: (state, action) => {
      state.data_cost_center = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = masterPositionSlice;
export default reducer;
