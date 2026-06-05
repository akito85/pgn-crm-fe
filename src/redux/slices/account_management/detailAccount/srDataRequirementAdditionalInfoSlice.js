import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";

const initialState = {
  data: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
};

export const getSrDataRequirementAdditionalInfo = createAsyncThunk(
  "GET_SR_DATA_REQUIREMENT_ADDITIONAL_INFO",
  async (accountId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/datarequirements/additional-information`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const srDataRequirementAdditionalInfoSlice = createSlice({
  name: "srDataRequirementAdditionalInfo",
  initialState,
  reducers: {
    resetSrDataRequirementAdditionalInfo: (state) => {
      state.data = [];
      state.isFailed = false;
      state.isSuccess = false;
    },
  },
  extraReducers: {
    [getSrDataRequirementAdditionalInfo.pending]: (state) => {
      state.loading = true;
      state.isFailed = false;
      state.isSuccess = false;
    },
    [getSrDataRequirementAdditionalInfo.fulfilled]: (state, action) => {
      state.loading = false;
      state.isSuccess = true;
      state.data = action.payload;
    },
    [getSrDataRequirementAdditionalInfo.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.data = action.payload;
    },
  },
});

const { reducer } = srDataRequirementAdditionalInfoSlice;
export const { resetSrDataRequirementAdditionalInfo } = srDataRequirementAdditionalInfoSlice.actions;
export default reducer;
