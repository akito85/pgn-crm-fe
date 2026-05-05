import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setBodyError, showModalError } from "../general_slice";
import { configApp } from "../../../constants/configApp";
import { tokenHeader } from "../../../utils/tokenHeader";

const MONITOR_BASE = `${configApp.JOB_SERVICE}/v1/api/job/monitor/schedules`;
const DEFINITION_BASE = `${configApp.JOB_SERVICE}/v1/api/job/definitions/schedules`;

const getHeaders = () => tokenHeader();

// ─── List ─────────────────────────────────────────────────────────────────────

export const getAllSchedulesPaginate = createAsyncThunk(
  "jobSchedule/getAllSchedulesPaginate",
  async ({ status, isPaused, scheduleType, page, pageSize }, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (status !== null && status !== undefined) params.append("status", status);
      if (isPaused !== null && isPaused !== undefined) params.append("isPaused", isPaused);
      if (scheduleType !== null && scheduleType !== undefined) params.append("scheduleType", scheduleType);
      if (page !== null && page !== undefined) params.append("page", page - 1);
      if (pageSize !== null && pageSize !== undefined) params.append("size", pageSize);

      const query = params.toString();
      const url = query ? `${MONITOR_BASE}?${query}` : MONITOR_BASE;
      const response = await axios.get(url, { headers: getHeaders() });
      return response?.data ?? { content: [], totalElements: 0, totalPages: 0 };
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(showModalError({
          title: "Failed to load schedules",
          description: error?.response?.data?.message ?? error?.message ?? "Unknown error",
        }));
      }
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  }
);

// ─── Detail ───────────────────────────────────────────────────────────────────

export const getScheduleById = createAsyncThunk(
  "jobSchedule/getScheduleById",
  async (scheduleId, thunkAPI) => {
    try {
      const response = await axios.get(`${MONITOR_BASE}/${scheduleId}`, { headers: getHeaders() });
      return response?.data ?? null;
    } catch (error) {
      thunkAPI.dispatch(showModalError({
        title: "Failed to load schedule detail",
        description: error?.response?.data?.message ?? error?.message ?? "Unknown error",
      }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ─── Actions ──────────────────────────────────────────────────────────────────

export const activateSchedule = createAsyncThunk(
  "jobSchedule/activateSchedule",
  async (scheduleId, thunkAPI) => {
    try {
      const response = await axios.post(
        `${DEFINITION_BASE}/${scheduleId}/activate`,
        {},
        { headers: getHeaders() }
      );
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(showModalError({
        title: "Failed to activate schedule",
        description: error?.response?.data?.message ?? error?.message ?? "Unknown error",
      }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const pauseSchedule = createAsyncThunk(
  "jobSchedule/pauseSchedule",
  async (scheduleId, thunkAPI) => {
    try {
      const response = await axios.post(
        `${DEFINITION_BASE}/${scheduleId}/pause`,
        {},
        { headers: getHeaders() }
      );
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(showModalError({
        title: "Failed to pause schedule",
        description: error?.response?.data?.message ?? error?.message ?? "Unknown error",
      }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const deleteSchedule = createAsyncThunk(
  "jobSchedule/deleteSchedule",
  async (scheduleId, thunkAPI) => {
    try {
      await axios.delete(`${DEFINITION_BASE}/${scheduleId}`, { headers: getHeaders() });
      return;
    } catch (error) {
      thunkAPI.dispatch(showModalError({
        title: "Failed to delete schedule",
        description: error?.response?.data?.message ?? error?.message ?? "Unknown error",
      }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const jobScheduleSlice = createSlice({
  name: "jobSchedule",
  initialState: {
    data: { content: [], totalElements: 0, totalPages: 0 },
    loading: false,
    actionLoading: false,
    detail: null,
    detailLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List
      .addCase(getAllSchedulesPaginate.pending, (state) => { state.loading = true; })
      .addCase(getAllSchedulesPaginate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllSchedulesPaginate.rejected, (state) => { state.loading = false; })
      // Detail
      .addCase(getScheduleById.pending,   (state) => { state.detailLoading = true; state.detail = null; })
      .addCase(getScheduleById.fulfilled, (state, action) => { state.detailLoading = false; state.detail = action.payload; })
      .addCase(getScheduleById.rejected,  (state) => { state.detailLoading = false; })
      // Actions (matchers must come after all addCase calls)
      .addMatcher(
        (action) => [
          activateSchedule.pending.type,
          pauseSchedule.pending.type,
          deleteSchedule.pending.type,
        ].includes(action.type),
        (state) => { state.actionLoading = true; }
      )
      .addMatcher(
        (action) => [
          activateSchedule.fulfilled.type,
          pauseSchedule.fulfilled.type,
          deleteSchedule.fulfilled.type,
          activateSchedule.rejected.type,
          pauseSchedule.rejected.type,
          deleteSchedule.rejected.type,
        ].includes(action.type),
        (state) => { state.actionLoading = false; }
      );
  },
});

export default jobScheduleSlice.reducer;
