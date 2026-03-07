import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userHttpService from "../../services/userHttpService";
import { setBodyError, showModalError } from "../general_slice";

const DUMMY = {
  result: [
    {
      name: "Sample Job",
      code: "JOB-001",
      type: "BATCH",
      desc: "Sample job description",
      parameter: "{}",
      execType: "ASYNC",
      handlerClass: "com.example.JobHandler",
      timeout: 30,
      maxRetry: 3,
      createdBy: "admin",
      createdDate: "2026-01-01",
      updatedBy: "admin",
      updatedDate: "2026-01-01",
      module: "JOB",
      accessGroup: "ADMIN",
      parent: null,
    },
  ],
  page: { totalElements: 1 },
};

// TODO: replace URL with real endpoint once API is ready
export const getAllJobPaginate = createAsyncThunk(
  "jobManagement/getAllJobPaginate",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const url = `/job-management/dbs/api/v1/job?search=${search}&page=${page}&size=${pageSize}&sort=${sort}`;
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
      // Return dummy data so the table renders during development
      return DUMMY;
    }
  }
);

const jobManagementSlice = createSlice({
  name: "jobManagement",
  initialState: { data: DUMMY, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllJobPaginate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllJobPaginate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllJobPaginate.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default jobManagementSlice.reducer;
