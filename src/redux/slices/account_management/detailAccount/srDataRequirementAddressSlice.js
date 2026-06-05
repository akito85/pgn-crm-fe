import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";

const initialState = {
  data: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
};

export const getSrDataRequirementAddress = createAsyncThunk(
  "GET_SR_DATA_REQUIREMENT_ADDRESS",
  async (accountId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/datarequirements/addresses`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const srDataRequirementAddressSlice = createSlice({
  name: "srDataRequirementAddress",
  initialState,
  reducers: {
    resetSrDataRequirementAddress: (state) => {
      state.data = [];
      state.isFailed = false;
      state.isSuccess = false;
    },
  },
  extraReducers: {
    [getSrDataRequirementAddress.pending]: (state) => {
      state.loading = true;
      state.isFailed = false;
      state.isSuccess = false;
    },
    [getSrDataRequirementAddress.fulfilled]: (state, action) => {
      state.loading = false;
      state.isSuccess = true;
      state.data = action.payload;
    },
    [getSrDataRequirementAddress.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.data = action.payload;
    },
  },
});

const { reducer } = srDataRequirementAddressSlice;
export const { resetSrDataRequirementAddress } = srDataRequirementAddressSlice.actions;
export default reducer;
