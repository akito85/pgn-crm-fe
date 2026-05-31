import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userHttpService from "../../services/userHttpService";
import { validateError } from "../general_slice";

const initialState = {
  loading: false,
};

export const getAuditTrailPaging = createAsyncThunk(
  "GET_AUDIT_TRAIL_PAGING",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/audit-trail/paging?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await userHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_AUDIT_TRAIL_PAGING" }));
      return thunkAPI.rejectWithValue(
        error?.response?.data?.code === 419 ? null : error?.response?.data
      );
    }
  }
);

const auditTrailSlice = createSlice({
  name: "audit_trail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAuditTrailPaging.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAuditTrailPaging.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getAuditTrailPaging.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default auditTrailSlice.reducer;
