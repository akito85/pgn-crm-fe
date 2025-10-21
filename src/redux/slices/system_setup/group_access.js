import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userHttpService from "../../services/userHttpService";
import { showModalSuccess, validateError } from "../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../utils";

const initialState = {
  data: [],
  dataMenu: [],
  dataUserLevel: [],
  dataStatus: {},
  loading: false,
  message: "",
  isSuccess: false,
  isFailed: false,
  loading_group_access: false,
};

export const getAllGroupAccessPaginate = createAsyncThunk(
  "GET_ALL_GROUP_ACCESS_PAGINATE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "gaId~desc" : sort;
      const url = `/v1/dbs/api/ga/viewPaging?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_GROUP_ACCESS_MENU",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getAllGroupAccessMenu = createAsyncThunk(
  "GET_ALL_GROUP_ACCESS_MENU",
  async (_, thunkAPI) => {
    try {
      // const url = "/v1/dbs/api/ga/menu/access";
      const url = "/v1/dbs/api/ga/menu-action";
      const response = await userHttpService.getAll(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "GET_ALL_GROUP_ACCESS_MENU",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getAllUserLevel = createAsyncThunk(
  "GET_ALL_USER_LEVEL_MENU",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/ga/user/level";
      const response = await userHttpService.getAll(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "GET_ALL_USER_LEVEL_MENU",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const activeAndInactiveGroupAccess = createAsyncThunk(
  "ACTIVE_GROUP_ACCESS",
  async ({ id, status }, thunkAPI) => {
    let statusData = status === "ACTIVE" ? "inactivated" : "activated";
    try {
      const url = `/v1/dbs/api/ga/active/inactive/${id}`;
      const response = await userHttpService.activationWithDelete(url);
      const message = response.message;
      const successMessage = {
        title: "Successfull",
        description: `${message}`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            statusData,
            errorMessage(response),
          ),
          action: "ACTIVE_GROUP_ACCESS",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const downloadGroupAccess = createAsyncThunk(
  "DOWNLOAD_ACTION",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "gaId~desc" : sort;
      const url = `/v1/dbs/api/ga/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_ACTION",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const createGroupAccess = createAsyncThunk(
  "CREATE_GROUP_ACCESS",
  async ({ body, responseSuccess }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/ga/create";
      const response = await userHttpService.createData(url, body);
      const successBody = {
        title: "Successfull",
        description: `Your data has been Created`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "CREATE_GROUP_ACCESS",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const updateGroupAccess = createAsyncThunk(
  "UPDATE_GROUP_ACCESS",
  async ({ body, responseSuccess }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/ga//update-group-access";
      const response = await userHttpService.updateData(url, body);
      const successBody = {
        title: "Successfull",
        description: `Your data has been updated`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "updated", errorMessage(error)),
          action: "UPDATE_GROUP_ACCESS",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const detailGroupAccess = createAsyncThunk(
  "GET_GROUP_ACCESS_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/ga/detail/${id}`;
      const response = await userHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_GROUP_ACCESS_DETAIL",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

const groupAccessSlice = createSlice({
  name: "groupAccess",
  initialState,
  extraReducers: {
    // get all ga paginate
    [getAllGroupAccessPaginate.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data = action.payload;
    },
    [getAllGroupAccessPaginate.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data = action.payload;
      state.loading = false;
    },
    [getAllGroupAccessPaginate.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    // get all ga menu
    [getAllGroupAccessMenu.pending]: (state, action) => {
      state.loading = true;
      state.dataMenu = action.payload;
    },
    [getAllGroupAccessMenu.fulfilled]: (state, action) => {
      state.dataMenu = action.payload;
      state.loading = false;
    },
    [getAllGroupAccessMenu.rejected]: (state, action) => {
      state.dataMenu = action.payload;
      state.loading = false;
    },
    // get all user level
    [getAllUserLevel.pending]: (state, action) => {
      state.loading = true;
      state.dataUserLevel = action.payload;
    },
    [getAllUserLevel.fulfilled]: (state, action) => {
      state.dataUserLevel = action.payload;
      state.loading = false;
    },
    [getAllUserLevel.rejected]: (state, action) => {
      state.dataUserLevel = action.payload;
      state.loading = false;
    },
    // inactive ga
    [activeAndInactiveGroupAccess.pending]: (state, action) => {
      state.loading = true;
    },
    [activeAndInactiveGroupAccess.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [activeAndInactiveGroupAccess.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
    },
    // create group access
    [createGroupAccess.pending]: (state, action) => {
      state.loading = true;
      state.dataStatus = action.payload;
    },
    [createGroupAccess.fulfilled]: (state, action) => {
      state.dataStatus = action.payload;
      state.loading = false;
    },
    [createGroupAccess.rejected]: (state, action) => {
      state.dataStatus = action.payload;
      state.loading = false;
    },
    // create group access
    [updateGroupAccess.pending]: (state, action) => {
      state.loading = true;
      state.dataStatus = action.payload;
    },
    [updateGroupAccess.fulfilled]: (state, action) => {
      state.dataStatus = action.payload;
      state.loading = false;
    },
    [updateGroupAccess.rejected]: (state, action) => {
      state.dataStatus = action.payload;
      state.loading = false;
    },

    //download

    [downloadGroupAccess.pending]: (state, action) => {
      state.loading = true;
    },
    [downloadGroupAccess.fulfilled]: (state, action) => {
      state.data_download = action.payload;
      // state.isSuccess = true;
      state.loading = false;
    },
    [downloadGroupAccess.rejected]: (state, action) => {
      // state.isFailed = true;
      state.data_download = action.payload;
      state.loading = false;
    },

    // get group access detail
    [detailGroupAccess.pending]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = true;
      state.loading_group_access = true;
    },
    [detailGroupAccess.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
      state.loading_group_access = false;
    },
    [detailGroupAccess.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = groupAccessSlice;
export default reducer;
