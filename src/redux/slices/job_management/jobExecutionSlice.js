import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setBodyError, showModalError } from "../general_slice";
import { configApp } from "../../../constants/configApp";
import { tokenHeader } from "../../../utils/tokenHeader";

const EXEC_BASE = `${configApp.JOB_SERVICE}/v1/api/job/executions`;

// jobApiSlice.js pattern: use axios directly (userHttpService defaults to the
// user-management base URL; job execution calls must go to JOB_SERVICE via Envoy)
const getHeaders = () => tokenHeader();

// ─── List ─────────────────────────────────────────────────────────────────────

export const getAllJobExecutionPaginate = createAsyncThunk(
  "jobExecution/getAllJobExecutionPaginate",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const url = `${EXEC_BASE}/search?page=${page - 1}&size=${pageSize}`;
      const response = await axios.post(url, { search, sort }, { headers: getHeaders() });
      return response?.data ?? { content: [], totalElements: 0, totalPages: 0 };
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(showModalError({
          title: "Failed to load execution list",
          description: error?.response?.data?.message ?? error?.message ?? "Something went wrong while retrieving the execution list. Please try again or contact support if the problem continues.",
        }));
      }
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  }
);

// ─── Actions ──────────────────────────────────────────────────────────────────

const makeActionThunk = (name, urlBuilder) =>
  createAsyncThunk(`jobExecution/${name}`, async (arg, thunkAPI) => {
    try {
      const url = urlBuilder(arg);
      const response = await axios.post(url, {}, { headers: getHeaders() });
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(showModalError({
        title: "Action failed",
        description: error?.response?.data?.message ?? error?.message ?? "Unknown error",
      }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  });

export const startExecution = createAsyncThunk(
  "jobExecution/startExecution",
  async ({ jobId, triggerType, scheduledAt, intervalSeconds, cronExpression, timezone, inputPayload }, thunkAPI) => {
    try {
      const body = { jobId, triggerType, scheduledAt, intervalSeconds, cronExpression, timezone, inputPayload };
      const response = await axios.post(EXEC_BASE, body, { headers: getHeaders() });
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(showModalError({
        title: "Failed to start job",
        description: error?.response?.data?.message ?? error?.message ?? "Unknown error",
      }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const stopExecution = makeActionThunk(
  "stopExecution",
  (executionId) => `${EXEC_BASE}/${executionId}/stop`
);

export const suspendExecution = makeActionThunk(
  "suspendExecution",
  (executionId) => `${EXEC_BASE}/${executionId}/suspend`
);

export const holdExecution = makeActionThunk(
  "holdExecution",
  (executionId) => `${EXEC_BASE}/${executionId}/hold`
);

export const cancelExecution = makeActionThunk(
  "cancelExecution",
  (executionId) => `${EXEC_BASE}/${executionId}/cancel`
);

export const restartExecution = makeActionThunk(
  "restartExecution",
  (executionId) => `${EXEC_BASE}/${executionId}/restart`
);

// ─── Detail & Logs ────────────────────────────────────────────────────────────

export const getJobExecutionById = createAsyncThunk(
  "jobExecution/getJobExecutionById",
  async (executionId, thunkAPI) => {
    try {
      const response = await axios.get(`${EXEC_BASE}/${executionId}`, { headers: getHeaders() });
      return response?.data ?? null;
    } catch (error) {
      thunkAPI.dispatch(showModalError({
        title: "Failed to load execution detail",
        description: error?.response?.data?.message ?? error?.message ?? "Unknown error",
      }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getJobExecutionLogs = createAsyncThunk(
  "jobExecution/getJobExecutionLogs",
  async (executionId, thunkAPI) => {
    try {
      const response = await axios.get(`${EXEC_BASE}/${executionId}/logs`, { headers: getHeaders() });
      return response?.data ?? [];
    } catch {
      // Logs are optional — silently return empty if endpoint is unavailable
      return [];
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const jobExecutionSlice = createSlice({
  name: "jobExecution",
  initialState: {
    data: { content: [], totalElements: 0, totalPages: 0 },
    loading: false,
    actionLoading: false,
    detail: null,
    detailLoading: false,
    logs: [],
    logsLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List
      .addCase(getAllJobExecutionPaginate.pending, (state) => { state.loading = true; })
      .addCase(getAllJobExecutionPaginate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllJobExecutionPaginate.rejected, (state) => { state.loading = false; })
      // Detail
      .addCase(getJobExecutionById.pending,   (state) => { state.detailLoading = true; state.detail = null; })
      .addCase(getJobExecutionById.fulfilled, (state, action) => { state.detailLoading = false; state.detail = action.payload; })
      .addCase(getJobExecutionById.rejected,  (state) => { state.detailLoading = false; })
      // Logs
      .addCase(getJobExecutionLogs.pending,   (state) => { state.logsLoading = true; })
      .addCase(getJobExecutionLogs.fulfilled, (state, action) => { state.logsLoading = false; state.logs = action.payload; })
      .addCase(getJobExecutionLogs.rejected,  (state) => { state.logsLoading = false; state.logs = []; })
      // Actions (matchers must come after all addCase calls)
      .addMatcher(
        (action) => [
          startExecution.pending.type, stopExecution.pending.type,
          suspendExecution.pending.type, holdExecution.pending.type,
          cancelExecution.pending.type, restartExecution.pending.type,
        ].includes(action.type),
        (state) => { state.actionLoading = true; }
      )
      .addMatcher(
        (action) => [
          startExecution.fulfilled.type, stopExecution.fulfilled.type,
          suspendExecution.fulfilled.type, holdExecution.fulfilled.type,
          cancelExecution.fulfilled.type, restartExecution.fulfilled.type,
          startExecution.rejected.type, stopExecution.rejected.type,
          suspendExecution.rejected.type, holdExecution.rejected.type,
          cancelExecution.rejected.type, restartExecution.rejected.type,
        ].includes(action.type),
        (state) => { state.actionLoading = false; }
      );
  },
});

export default jobExecutionSlice.reducer;
