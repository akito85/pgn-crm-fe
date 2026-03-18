import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { configApp } from "../../../constants/configApp";
import { showModalError } from "../general_slice";

const JOB_GROUP_BASE = `${configApp.JOB_SERVICE}/v1/api/job-group`;

const getHeaders = () => {
  const token = JSON.parse(
    localStorage.getItem("token") || sessionStorage.getItem("token") || "{}"
  );
  return { Authorization: token?.accessToken };
};

// Map backend JobGroupResponse → frontend row shape for parent table
const toGroupRow = (g) => ({
  ...g,
  desc: g.description,    // jobGroupManagementColumns reads 'desc'
  accessGroup: g.accessGroupId ? String(g.accessGroupId) : (g.accessGroup != null ? String(g.accessGroup) : null),
});

// Map backend JobResponse → frontend row shape for child table
// Mirrors toFrontend in jobApiSlice but for the child context
const toJobRow = (job) => ({
  id:          job.jobId,
  name:        job.jobName,
  code:        job.jobCode,
  type:        job.jobType,
  desc:        job.description,
  execType:    job.execType,
  handlerClass: job.handlerClass,
  timeout:     job.timeoutSeconds,
  maxRetry:    job.maxRetry,
  createdBy:   job.createdBy,
  createdDate: job.createdAt,
  updatedBy:   job.updatedBy,
  updatedDate: job.updatedAt,
  module:      job.moduleName,
  accessGroup: job.accessGroupName ?? (job.accessGroupId ? String(job.accessGroupId) : null),
  parent:      job.parentJobId   ? String(job.parentJobId)   : null,
  parameters:  (() => {
    if (!job.inputSchema) return [];
    try {
      const s = typeof job.inputSchema === 'string' ? JSON.parse(job.inputSchema) : job.inputSchema;
      return s?.parameters ?? [];
    } catch { return []; }
  })(),
  status:      job.status,
});

const DUMMY = {
  result: [],
  page: { totalElements: 0, totalPages: 0 },
};

// Fetch JobGroup paginated list
// Uses POST /job/v1/api/job-group → envoy rewrites to /v1/api/job-group at JobrunrManagement (port 8913)
export const getAllJobGroupPaginate = createAsyncThunk(
  "jobGroup/getAllJobGroupPaginate",
  async ({ page = 0, pageSize = 20, sort = "" } = {}, thunkAPI) => {
    try {
      const payload = {
        page: page - 1, // frontend is 1-indexed, backend is 0-indexed
        size: pageSize,
        sortBy: sort ? sort.split("~")[0] : "groupName",
        sortDir: sort ? (sort.split("~")[1] || "asc").toUpperCase() : "ASC",
      };
      const res = await axios.post(JOB_GROUP_BASE, payload, {
        headers: getHeaders(),
      });
      // Map backend PageResponse → slice-friendly shape
      const d = res.data;
      return {
        result: (d.content ?? []).map(toGroupRow),
        page: {
          totalElements: d.totalElements ?? 0,
          totalPages: d.totalPages ?? 0,
        },
      };
    } catch (error) {
      thunkAPI.dispatch(
        showModalError({
          title: "Failed to load job groups",
          description:
            error?.response?.data?.message ?? error?.message ?? "Unknown error",
        })
      );
      return DUMMY;
    }
  }
);

// Lazy-load jobs for a specific job group
// Uses POST /job/v1/api/job-group/{groupId}/jobs → envoy rewrites to /v1/api/job-group/{groupId}/jobs
export const getJobsByGroupId = createAsyncThunk(
  "jobGroup/getJobsByGroupId",
  async ({ groupId, page = 0, pageSize = 20 }, thunkAPI) => {
    try {
      const payload = { page, size: pageSize };
      const res = await axios.post(
        `${JOB_GROUP_BASE}/${groupId}/jobs`,
        payload,
        { headers: getHeaders() }
      );
      const d = res.data;
      return {
        groupId,
        jobs: (d.content ?? []).map(toJobRow),
        page: {
          totalElements: d.totalElements ?? 0,
          totalPages: d.totalPages ?? 0,
        },
      };
    } catch (error) {
      thunkAPI.dispatch(
        showModalError({
          title: "Failed to load jobs for group",
          description:
            error?.response?.data?.message ?? error?.message ?? "Unknown error",
        })
      );
      return { groupId, jobs: [], page: {} };
    }
  }
);

const jobGroupSlice = createSlice({
  name: "jobGroup",
  initialState: {
    data: { result: [], page: { totalElements: 0, totalPages: 0 } },
    loading: false,
    jobsByGroupId: {}, // Cache: { [groupId]: { loading, data, error } }
    expandedRowKeys: [],
  },
  reducers: {
    /**
     * Track which job group rows are expanded
     * Persists while on page, resets on page navigation
     */
    setExpandedRows: (state, action) => {
      state.expandedRowKeys = action.payload;
    },

    /**
     * Clear cached jobs for a specific group (when data is stale)
     */
    clearJobCache: (state, action) => {
      const { groupId } = action.payload;
      if (groupId) {
        delete state.jobsByGroupId[groupId];
      } else {
        // Clear all cache if no groupId provided
        state.jobsByGroupId = {};
      }
    },

    /**
     * Reset expanded state (call on page navigation away)
     */
    resetExpandedState: (state) => {
      state.expandedRowKeys = [];
    },
  },
  extraReducers: (builder) => {
    // getAllJobGroupPaginate handlers
    builder
      .addCase(getAllJobGroupPaginate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllJobGroupPaginate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllJobGroupPaginate.rejected, (state) => {
        state.loading = false;
      });

    // getJobsByGroupId handlers
    builder
      .addCase(getJobsByGroupId.pending, (state, action) => {
        const { groupId } = action.meta.arg;
        state.jobsByGroupId[groupId] = {
          loading: true,
          data: [],
          error: null,
        };
      })
      .addCase(getJobsByGroupId.fulfilled, (state, action) => {
        const { groupId, jobs, page } = action.payload;
        state.jobsByGroupId[groupId] = {
          loading: false,
          data: jobs,
          page,
          error: null,
        };
      })
      .addCase(getJobsByGroupId.rejected, (state, action) => {
        const { groupId } = action.meta.arg;
        state.jobsByGroupId[groupId] = {
          loading: false,
          data: [],
          error: action.error.message || "Failed to load jobs",
        };
      });
  },
});

export const { setExpandedRows, clearJobCache, resetExpandedState } =
  jobGroupSlice.actions;

export default jobGroupSlice.reducer;
