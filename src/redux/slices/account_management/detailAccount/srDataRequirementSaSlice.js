import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";

const initialState = {
  data: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
};

export const getSrDataRequirementSa = createAsyncThunk(
  "GET_SR_DATA_REQUIREMENT_SA",
  async (accountId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/datarequirements/sa`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const srDataRequirementSaSlice = createSlice({
  name: "srDataRequirementSa",
  initialState,
  reducers: {
    resetSrDataRequirementSa: (state) => {
      state.data = [];
      state.isFailed = false;
      state.isSuccess = false;
    },
  },
  extraReducers: {
    [getSrDataRequirementSa.pending]: (state) => {
      state.loading = true;
      state.isFailed = false;
      state.isSuccess = false;
    },
    [getSrDataRequirementSa.fulfilled]: (state, action) => {
      state.loading = false;
      state.isSuccess = true;
      state.data = action.payload;
    },
    [getSrDataRequirementSa.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.data = action.payload;
    },
  },
});

const { reducer } = srDataRequirementSaSlice;
export const { resetSrDataRequirementSa } = srDataRequirementSaSlice.actions;
export default reducer;
