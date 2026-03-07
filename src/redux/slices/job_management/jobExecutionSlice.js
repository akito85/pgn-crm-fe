import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userHttpService from "../../services/userHttpService";
import { setBodyError, showModalError } from "../general_slice";

const DUMMY = {
  result: [
    {
      name: "Sample Execution",
      code: "JE-001",
      type: "EXECUTION",
      desc: "Sample job execution description",
      parameter: "{}",
      execType: "ASYNC",
      handlerClass: "com.example.ExecutionHandler",
      timeout: 120,
      maxRetry: 1,
      createdBy: "admin",
      createdDate: "2026-01-01",
      updatedBy: "admin",
      updatedDate: "2026-01-01",
      module: "JOB",
      accessGroup: "ADMIN",
      parent: "JG-001",
    },
  ],
  page: { totalElements: 1 },
};

// TODO: replace URL with real endpoint once API is ready
export const getAllJobExecutionPaginate = createAsyncThunk(
  "jobExecution/getAllJobExecutionPaginate",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const url = `/job-management/dbs/api/v1/job-execution?search=${search}&page=${page}&size=${pageSize}&sort=${sort}`;
      const response = await userHttpService.getAll(url);
      return response?.data ?? DUMMY;
    } catch (error) {
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(
          showModalError({
            title: "Failed",
            description:
              error?.response?.data?.message ?? error?.message ?? "Unknown error",
          })
        );
      }
      return DUMMY;
    }
  }
);

const jobExecutionSlice = createSlice({
  name: "jobExecution",
  initialState: { data: DUMMY, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllJobExecutionPaginate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllJobExecutionPaginate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllJobExecutionPaginate.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default jobExecutionSlice.reducer;
