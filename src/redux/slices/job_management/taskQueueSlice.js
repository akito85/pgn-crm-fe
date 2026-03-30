import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userHttpService from "../../services/userHttpService";
import { configApp } from "../../../constants/configApp";

const JOB_BASE = configApp.JOB_SERVICE;

export const fetchTaskQueues = createAsyncThunk(
  "taskQueue/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await userHttpService.getAll("/v1/api/job/queues", JOB_BASE);
      return response ?? [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data ?? error.message);
    }
  }
);

const taskQueueSlice = createSlice({
  name: "taskQueue",
  initialState: {
    queues: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskQueues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskQueues.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.queues = payload;
      })
      .addCase(fetchTaskQueues.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default taskQueueSlice.reducer;
