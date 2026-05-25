import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userHttpService from "../services/userHttpService";
import { validateError } from "./general_slice";

const initialState = {
  data: null,
  loading: false,
  isRequestFailed: false,
};

export const getMonitoringSession = createAsyncThunk(
  "GET_MONITORING_SESSION",
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    try {
      const searchParams = search ?? "";
      const sortParams = sort || "lastAccess~desc";
      const url = `/v1/dbs/api/monitoring/show-session?page=${page}&size=${pageSize}&searchs=${searchParams}&sort=${sortParams}`;
      const data = await userHttpService.getPagination(url);
      return data?.data;
    } catch (error) {
      thunkAPI?.dispatch(
        validateError({
          error: error,
          action: "GET_MONITORING_SESSION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
const monitoringSessionSlice = createSlice({
  name: "monitoring_session",
  initialState,
  extraReducers: {
    [getMonitoringSession.pending]: (state) => {
      state.loading = true;
    },
    [getMonitoringSession.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getMonitoringSession.rejected]: (state) => {
      state.loading = false;
      state.isRequestFailed = true;
    },
  },
});

const { reducer } = monitoringSessionSlice;
export default reducer;
