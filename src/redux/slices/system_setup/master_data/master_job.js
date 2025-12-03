import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userHttpService from "../../../services/userHttpService";
import { showModalSuccess, validateError } from "../../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../../utils";

const initialState = {
  data: [],
  data_detail: null,
  isFailed: false,
  isSuccess: false,
  message: "",
  loading: false,
};
export const getListMasterJob = createAsyncThunk(
  "GET_LIST_MASTER_JOB",
  async ({ search, page, pageSize, sort }, thunkApi) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/job/view/paging?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.getPagination(url);
      return response.data;
    } catch (response) {
      thunkApi.dispatch(
        validateError({
          error: response,
          action: "GET_LIST_MASTER_JOB",
          back: false,
        }),
      );
      return thunkApi.rejectWithValue(response.response.data);
    }
  },
);

export const getAllMasterJob = createAsyncThunk(
  "GET_ALL_LIST_MASTER_JOB",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/job/view`;
      const response = await userHttpService.getAll(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "GET_ALL_LIST_MASTER_JOB",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getDetailMasterJob = createAsyncThunk(
  "GET_DETAIL_MASTER_JOB",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/job/view/${id}`;
      const response = await userHttpService.getDetail(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "GET_DETAIL_MASTER_JOB",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const createMasterJob = createAsyncThunk(
  "CREATE_MASTER_JOB",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/job/create`;
      const response = await userHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
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
            errorMessage(response),
          ),
          action: "CREATE_MASTER_JOB",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const inactiveMasterJob = createAsyncThunk(
  "INACTIVE_MASTER_JOB",
  async ({ id, body }, thunkAPI) => {
    let statusData = body?.status === "Activate" ? "activated" : "inactivated";
    try {
      const url = `/v1/dbs/api/job/active/inactive/${id}`;
      const response = await userHttpService.activationWithRemark(url, body);
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
          action: "INACTIVE_MASTER_JOB",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const updateMasterJob = createAsyncThunk(
  "UPDATE_MASTER_JOB",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/job/update`;
      const response = await userHttpService.updateData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Your data has been updated",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "updated",
            errorMessage(response),
          ),
          action: "UPDATE_MASTER_JOB",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const downloadMasterJob = createAsyncThunk(
  "DOWNLOAD_MASTER_JOB",
  async ({ sort, page, pageSize, search }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/job/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_MASTER_JOB",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

const masterJobSlice = createSlice({
  name: "master_job",
  initialState,
  extraReducers: {
    // get list
    [getListMasterJob.pending]: (state) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
    },
    [getListMasterJob.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = false;
    },
    [getListMasterJob.rejected]: (state) => {
      state.loading = false;
    },
    // get all
    [getAllMasterJob.pending]: (state) => {
      state.loading = true;
    },
    [getAllMasterJob.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getAllMasterJob.rejected]: (state) => {
      state.loading = false;
    },
    // create
    [createMasterJob.pending]: (state) => {
      state.loading = true;
    },
    [createMasterJob.fulfilled]: (state) => {
      state.loading = false;
    },
    [createMasterJob.rejected]: (state) => {
      state.loading = false;
    },
    // get detail
    [getDetailMasterJob.pending]: (state) => {
      state.loading = true;
    },
    [getDetailMasterJob.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailMasterJob.rejected]: (state) => {
      state.loading = false;
    },
    // inactive master job
    [inactiveMasterJob.pending]: (state) => {
      state.loading = true;
    },
    [inactiveMasterJob.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveMasterJob.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },
    // update master job
    [updateMasterJob.pending]: (state) => {
      state.loading = true;
    },
    [updateMasterJob.fulfilled]: (state) => {
      state.loading = false;
    },
    [updateMasterJob.rejected]: (state) => {
      state.loading = false;
    },
    // download master job
    [downloadMasterJob.pending]: (state) => {
      // state.isSuccess = true;
      state.loading = true;
    },
    [downloadMasterJob.fulfilled]: (state, action) => {
      state.data_download = action.payload;
      // state.isSuccess = true;
      state.loading = false;
    },
    [downloadMasterJob.rejected]: (state, action) => {
      // state.isFailed = true;
      state.data_download = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = masterJobSlice;
export default reducer;
