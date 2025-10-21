import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productPromoHttpService from "../services/productPromoHttpService";
import ratingBillingHttpService from "../services/ratingBillingHttpService";

const initialState = {
  dataConfigMaster: {},
  dataConfigRBIData: {},
  dataConfigRBIInvoice: {},
  dataConfigRBIGeneralTemplate: {},
  loading: false,
};

// Product
export const getConfigFileMaster = createAsyncThunk(
  "GET_CONFIG_FILE_MASTER",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/config-file";
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// RBI Data (excel, png)
export const getConfigFileRBIData = createAsyncThunk(
  "GET_CONFIG_FILE_RBI_DATA",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/config-file-data";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// RBI
export const getConfigFileRBIInvoice = createAsyncThunk(
  "GET_CONFIG_FILE_RBI_INVOICE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/config-file-invoice";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// RBI MASTER GENERAL TEMPLATE
export const getConfigFileRBIGeneralTemplate = createAsyncThunk(
  "GET_CONFIG_FILE_RBI_GENERAL_TEMPLATE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/config-file-generaltemplateatt";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

const attachmentSlice = createSlice({
  name: "attachment",
  initialState,
  extraReducers: {
    // Master
    [getConfigFileMaster.pending]: (state, action) => {
      state.loading = true;
      state.dataConfigMaster = action.payload;
    },
    [getConfigFileMaster.fulfilled]: (state, action) => {
      state.dataConfigMaster = action.payload;
      state.loading = false;
    },
    [getConfigFileMaster.rejected]: (state, action) => {
      state.dataConfigMaster = action.payload;
      state.loading = false;
    },

    // RBI DATA
    [getConfigFileRBIData.pending]: (state, action) => {
      state.loading = true;
      state.dataConfigRBIData = action.payload;
    },
    [getConfigFileRBIData.fulfilled]: (state, action) => {
      state.dataConfigRBIData = action.payload;
      state.loading = false;
    },
    [getConfigFileRBIData.rejected]: (state, action) => {
      state.dataConfigRBIData = action.payload;
      state.loading = false;
    },

    // RBI INVOICE
    [getConfigFileRBIInvoice.pending]: (state, action) => {
      state.loading = true;
      state.dataConfigRBIInvoice = action.payload;
    },
    [getConfigFileRBIInvoice.fulfilled]: (state, action) => {
      state.dataConfigRBIInvoice = action.payload;
      state.loading = false;
    },
    [getConfigFileRBIInvoice.rejected]: (state, action) => {
      state.dataConfigRBIInvoice = action.payload;
      state.loading = false;
    },

    // RBI GENERAL TEMPLATE
    [getConfigFileRBIGeneralTemplate.pending]: (state, action) => {
      state.loading = true;
      state.dataConfigRBIGeneralTemplate = action.payload;
    },
    [getConfigFileRBIGeneralTemplate.fulfilled]: (state, action) => {
      state.dataConfigRBIGeneralTemplate = action.payload;
      state.loading = false;
    },
    [getConfigFileRBIGeneralTemplate.rejected]: (state, action) => {
      state.dataConfigRBIGeneralTemplate = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = attachmentSlice;
export default reducer;
