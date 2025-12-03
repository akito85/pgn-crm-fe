import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userHttpService from "../../services/userHttpService";
import { showModalSuccess, validateError } from "../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../utils";

const initialState = {
  data: [],
  data_detail: {},
  loading: false,
  message: null,
  isFailed: false,
  isSuccess: false,
};

export const getAllActionPaginate = createAsyncThunk(
  "GET_ALL_ACTION_PAGINATE",
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/action/paging?searchs=${searchParams}&page=${page}&size=${pageSize}${
        sort ? `&sort=${sortParams}` : ""
      }`;
      const response = await userHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI?.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_ACTION_PAGINATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getActionList = createAsyncThunk(
  "GET_ACTION_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/action/list`;
      const response = await userHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI?.dispatch(
        validateError({ error: error, action: "GET_ACTION_LIST", back: false }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const createAction = createAsyncThunk(
  "CREATE_ACTION",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/action/`;
      const response = await userHttpService.createData(url, body);
      const successBody = {
        title: "Successfull",
        description: `Your data has been created`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "CREATE_ACTION",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const validateAction = createAsyncThunk(
  "VALIDATE_ACTION",
  async (body, thunkAPI) => {
    const { type, ...keys } = body;
    try {
      let url;
      if (type === "create") {
        url = `/v1/dbs/api/action/validate-create`;
      } else {
        url = `/v1/dbs/api/action/validate-update`;
      }
      const response = await userHttpService.createData(url, keys);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(error),
            type === "update" ? "updated" : "created",
            errorMessage(error),
          ),
          action: "VALIDATE_ACTION",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getDetailAction = createAsyncThunk(
  "GET_DETAIL_ACTION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/action/detail/${id}`;
      const response = await userHttpService.getDetail(url, id);
      return response.data;
    } catch (response) {
      thunkAPI?.dispatch(
        validateError({
          error: response,
          action: "GET_DETAIL_ACTION",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const updateAction = createAsyncThunk(
  "UPDATE_ACTION",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/action/update`;
      const data = await userHttpService.updateData(url, body);
      const successBody = {
        title: "Successfull",
        description: `Your data has been updated`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "updated", errorMessage(error)),
          action: "UPDATE_ACTION",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const inactiveAction = createAsyncThunk(
  "INACTIVE_ACTION",
  async ({ id, status }, thunkAPI) => {
    let statusData = status === "ACTIVE" ? "inactivated" : "activated";
    try {
      const url = `/v1/dbs/api/action/activeInactivate/${id}`;
      const data = await userHttpService.activationWithMethodGet(url);
      const message = data.message;
      const successMessage = {
        title: "Successfull",
        description: `${message}`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), statusData, errorMessage(error)),
          action: "INACTIVE_ACTION",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const downloadAction = createAsyncThunk(
  "DOWNLOAD_ACTION",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/action/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI?.dispatch(
        validateError({ error: error, action: "DOWNLOAD_ACTION", back: false }),
      );
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

const actionSlice = createSlice({
  name: "action",
  initialState,
  extraReducers: {
    //get all action paginate reducer
    [getAllActionPaginate.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data = action.payload;
      state.loading = true;
    },

    [getAllActionPaginate.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = false;
    },
    [getAllActionPaginate.rejected]: (state, action) => {
      state.data = action.payload;
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = false;
    },

    //get action list
    [getActionList.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getActionList.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getActionList.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },

    //Create ACTION
    [createAction.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createAction.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createAction.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    //get detail
    [getDetailAction.pending]: (state) => {
      state.loading = true;
    },
    [getDetailAction.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailAction.rejected]: (state) => {
      state.loading = false;
    },

    // update action
    [updateAction.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [updateAction.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isSuccess = false;
    },
    [updateAction.rejected]: (state) => {
      state.isFailed = true;
    },

    // validate action
    [validateAction.pending]: (state) => {
      state.loading = true;
    },
    [validateAction.fulfilled]: (state) => {
      state.isSuccess = false;
    },
    [validateAction.rejected]: (state) => {
      state.isFailed = true;
    },
    // inactive master job
    [inactiveAction.pending]: (state) => {
      state.loading = true;
    },
    [inactiveAction.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveAction.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },

    //download

    [downloadAction.pending]: (state) => {
      state.loading = true;
    },
    [downloadAction.fulfilled]: (state, action) => {
      state.data_download = action.payload;
      // state.isSuccess = true;
      state.loading = false;
    },
    [downloadAction.rejected]: (state, action) => {
      // state.isFailed = true;
      state.data_download = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = actionSlice;
export default reducer;
