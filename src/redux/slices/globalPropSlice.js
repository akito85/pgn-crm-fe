import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../services/ratingBillingHttpService";
import { showModalError, setBodyError } from "./general_slice";

const initialState = {
  globalProp: {},
  loading: false,
  error: null,
};

// Get Global Format Configuration
export const getGlobalFormatConfig = createAsyncThunk(
  "GET_GLOBAL_FORMAT_CONFIG",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing/get-global-value?propertiesName=FORMAT_NUMBER`;
      const response = await ratingBillingHttpService.getAll(url);

      // Transform array response ke object untuk mudah diakses
      const formatData = {};
      const rawData = response?.data?.data || response?.data || [];

      rawData.forEach((item) => {
        const key = item.key;
        let value = item.value;

        // Convert based on dataType
        switch (item.dataType) {
          case "INT":
            value = parseInt(value, 10);
            break;
          case "BOOL":
            value = value.toLowerCase() === "y" || value === "true";
            break;
          case "STR":
          default:
            break;
        }

        formatData[key] = value;
      });

      return formatData;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

const globalPropSlice = createSlice({
  name: "globalProp",
  initialState,
  reducers: {
    // Reset format config jika diperlukan
    resetGlobalProp: (state) => {
      state.globalProp = {};
      state.error = null;
    },
  },
  extraReducers: {
    [getGlobalFormatConfig.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getGlobalFormatConfig.fulfilled]: (state, action) => {
      state.loading = false;
      state.globalProp = action.payload;
    },
    [getGlobalFormatConfig.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.globalProp = {};
    },
  },
});

export const { resetGlobalProp } = globalPropSlice.actions;
const { reducer } = globalPropSlice;
export default reducer;