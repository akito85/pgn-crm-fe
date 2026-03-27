import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userHttpService from "../../services/userHttpService";
import { setBodyError, showModalError } from "../general_slice";

const DUMMY = {
  result: [
    {
      name: "Sample Job Group",
      code: "JG-001",
      type: "GROUP",
      desc: "Sample job group description",
      parameter: "{}",
      execType: "SYNC",
      handlerClass: "com.example.GroupHandler",
      timeout: 60,
      maxRetry: 5,
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
export const getAllJobGroupPaginate = createAsyncThunk(
  "jobGroup/getAllJobGroupPaginate",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const url = `/job-management/dbs/api/v1/job-group?search=${search}&page=${page}&size=${pageSize}&sort=${sort}`;
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

const jobGroupSlice = createSlice({
  name: "jobGroup",
  initialState: { data: DUMMY, loading: false },
  reducers: {},
  extraReducers: (builder) => {
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
  },
});

export default jobGroupSlice.reducer;
