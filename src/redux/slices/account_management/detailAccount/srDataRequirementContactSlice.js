import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";

const initialState = {
  data: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
};

export const getSrDataRequirementContacts = createAsyncThunk(
  "GET_SR_DATA_REQUIREMENT_CONTACTS",
  async (accountId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/datarequirements/contacts`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const srDataRequirementContactSlice = createSlice({
  name: "srDataRequirementContact",
  initialState,
  reducers: {
    resetSrDataRequirementContacts: (state) => {
      state.data = [];
      state.isFailed = false;
      state.isSuccess = false;
    },
  },
  extraReducers: {
    [getSrDataRequirementContacts.pending]: (state) => {
      state.loading = true;
      state.isFailed = false;
      state.isSuccess = false;
    },
    [getSrDataRequirementContacts.fulfilled]: (state, action) => {
      state.loading = false;
      state.isSuccess = true;
      state.data = action.payload;
    },
    [getSrDataRequirementContacts.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.data = action.payload;
    },
  },
});

const { reducer } = srDataRequirementContactSlice;
export const { resetSrDataRequirementContacts } = srDataRequirementContactSlice.actions;
export default reducer;
