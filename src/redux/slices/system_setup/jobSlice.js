import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userHttpService from "../../services/userHttpService";
import {
  showModalSuccess,
  setBodyError,
  showModalError,
} from "../general_slice";

const initialState = {
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
  list_job_type: [],
  list_parent_job: [],
  pagination: {
    pageNumber: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
  },
};

const NGROK_BASE_URL = "https://6db0aac26041.ngrok-free.app";

export const getJobs = createAsyncThunk("job/getJobs", async (_, thunkAPI) => {
  try {
    const url = "/v1/dbs/api/job/list";
    const response = await userHttpService.getAll(url, NGROK_BASE_URL);

    if (
      response &&
      response.success &&
      response.data &&
      Array.isArray(response.data.content)
    ) {
      return {
        jobs: response.data.content,
        pagination: {
          pageNumber: response.data.pageable?.pageNumber || 0,
          pageSize: response.data.pageable?.pageSize || 10,
          totalPages: response.data.totalPages || 0,
          totalElements: response.data.totalElements || 0,
        },
      };
    } else {
      throw new Error("Invalid API response structure");
    }
  } catch (error) {
    console.error("GetJobs Error:", error);
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
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

// Get job by ID
export const getJobById = createAsyncThunk(
  "job/getJobById",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/job/view/${id}`;
      const response = await userHttpService.getDetail(url, NGROK_BASE_URL);

      if (response && response.success) {
        return response.data;
      } else {
        throw new Error("Failed to fetch job details");
      }
    } catch (error) {
      console.error("GetJobById Error:", error);
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Get job types LOV
export const getListJobType = createAsyncThunk(
  "job/getListJobType",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/job-type/list`;
      const response = await userHttpService.getAll(url, NGROK_BASE_URL);

      if (response && response.success && response.data) {
        return response.data.content || response.data;
      }
      return response.data || response;
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Get parent jobs LOV
export const getListParentJob = createAsyncThunk(
  "job/getListParentJob",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/job/list`;
      const response = await userHttpService.getAll(url, NGROK_BASE_URL);

      if (
        response &&
        response.success &&
        response.data &&
        Array.isArray(response.data.content)
      ) {
        return response.data.content;
      }
      return response.data || response;
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Create job
export const createJob = createAsyncThunk(
  "job/createJob",
  async (data, thunkAPI) => {
    try {
      const payload = {
        code: data.code,
        procedureName: data.procedure_name,
        listingNo: parseInt(data.listing_no) || 0,
        isParallel: data.is_parallel || "N",
        parallelDegree: parseInt(data.parallel_degree) || 0,
        isFinish: data.is_finish || "N",
        pjobTypeId: data.p_job_type_id ? parseInt(data.p_job_type_id) : null,
        isCancelledProcess: data.is_cancelled_process || "N",
        isReprocess: data.is_reprocess || "N",
        parentId: data.parent_id ? parseInt(data.parent_id) : null,
        cancelParentId: data.cancel_parent_id
          ? parseInt(data.cancel_parent_id)
          : null,
        controlTableName: data.control_table_name,
        description: data.description,
        updateBy: "admin",
      };

      const url = "/v1/dbs/api/job/create";
      const response = await userHttpService.createData(
        url,
        payload,
        NGROK_BASE_URL
      );

      if (response && response.success) {
        const successBody = {
          title: "Successful",
          description: response.message || "Job created successfully",
          return: false,
        };
        thunkAPI.dispatch(showModalSuccess(successBody));
        return response.data;
      } else {
        throw new Error(response?.message || "Failed to create job");
      }
    } catch (error) {
      console.error("CreateJob Error:", error);
      const message =
        error?.response?.data?.message || error?.message || error?.toString();

      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        if (error?.response?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not created. ${message}`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error.response?.data);
      }
      const errorBody = {
        title: "Failed",
        description: `Failed to create job. ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: {
    // Get Jobs
    [getJobs.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getJobs.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.jobs = action.payload.jobs || [];
      state.pagination = action.payload.pagination || state.pagination;
    },
    [getJobs.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch jobs";
      state.jobs = [];
    },

    // Get Job By ID
    [getJobById.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getJobById.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.currentJob = action.payload;
    },
    [getJobById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch job details";
    },

    // Get List Job Type
    [getListJobType.pending]: (state) => {
      state.loading = true;
    },
    [getListJobType.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_job_type = action.payload;
    },
    [getListJobType.rejected]: (state) => {
      state.loading = false;
    },

    // Get List Parent Job
    [getListParentJob.pending]: (state) => {
      state.loading = true;
    },
    [getListParentJob.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_parent_job = action.payload;
    },
    [getListParentJob.rejected]: (state) => {
      state.loading = false;
    },

    // Create Job
    [createJob.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [createJob.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      if (action.payload) {
        state.jobs.unshift(action.payload);
      }
    },
    [createJob.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to create job";
    },
  },
});

export const { clearError, resetCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;
