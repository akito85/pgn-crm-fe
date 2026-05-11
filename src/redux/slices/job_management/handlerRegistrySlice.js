import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userHttpService from "../../services/userHttpService";
import { configApp } from "../../../constants/configApp";

const BASE = "/v1/api/handlers/grouped";
const JOB_BASE = configApp.JOB_SERVICE;

/**
 * Fetches all registered job handlers grouped by class.
 * Each entry has: handlerClass, displayName, description, producesFile, parameters, workers.
 * Uses GET /v1/api/handlers/grouped (server derives this from JOBRUNR_HANDLER_REGISTRY).
 */
export const fetchHandlers = createAsyncThunk(
  "handlerRegistry/fetchHandlers",
  async (_, thunkAPI) => {
    try {
      const response = await userHttpService.getAll(BASE, JOB_BASE);
      return response ?? [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data ?? error.message);
    }
  }
);

const handlerRegistrySlice = createSlice({
  name: "handlerRegistry",
  initialState: {
    handlers: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearHandlers(state) {
      state.handlers = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHandlers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHandlers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.handlers = payload;
      })
      .addCase(fetchHandlers.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.handlers = [];
      });
  },
});

export const { clearHandlers } = handlerRegistrySlice.actions;
export default handlerRegistrySlice.reducer;
