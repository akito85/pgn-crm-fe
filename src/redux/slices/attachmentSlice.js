import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productPromoHttpService from "../services/productPromoHttpService";
import ratingBillingHttpService from "../services/ratingBillingHttpService";

const initialState = {
  dataConfigMaster: {},
  dataConfigRBIData: {},
  dataConfigRBIInvoice: {},
  dataConfigRBIGeneralTemplate: {},
  dataDownloadAttachment: null,
  loading: false,
  downloadLoading: false,
  error: null,
};

// Product
export const getConfigFileMaster = createAsyncThunk(
  "GET_CONFIG_FILE_MASTER",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/config-file";
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// RBI Data (excel, png)
export const getConfigFileRBIData = createAsyncThunk(
  "GET_CONFIG_FILE_RBI_DATA",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/config-file-data";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// RBI
export const getConfigFileRBIInvoice = createAsyncThunk(
  "GET_CONFIG_FILE_RBI_INVOICE",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/config-file-invoice";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// RBI MASTER GENERAL TEMPLATE
export const getConfigFileRBIGeneralTemplate = createAsyncThunk(
  "GET_CONFIG_FILE_RBI_GENERAL_TEMPLATE",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/config-file-generaltemplateatt";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// ✅ Master efaktur code - Download Attachment
export const getDownloadAttachmentFakturCode = createAsyncThunk(
  "GET_DOWNLOAD_ATTACHMENT_FAKTUR_CODE",
  async (id, { rejectWithValue }) => {
    try {
      const url = `/v1/dbs/api/faktur-code/download-attachment/${id}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const attachmentSlice = createSlice({
  name: "attachment",
  initialState,
  reducers: {
    // ✅ Reset download state
    resetDownloadAttachment: (state) => {
      state.dataDownloadAttachment = null;
      state.downloadLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Master
      .addCase(getConfigFileMaster.pending, (state) => {
        state.loading = true;
      })
      .addCase(getConfigFileMaster.fulfilled, (state, action) => {
        state.dataConfigMaster = action.payload;
        state.loading = false;
      })
      .addCase(getConfigFileMaster.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // RBI DATA
      .addCase(getConfigFileRBIData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getConfigFileRBIData.fulfilled, (state, action) => {
        state.dataConfigRBIData = action.payload;
        state.loading = false;
      })
      .addCase(getConfigFileRBIData.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // RBI INVOICE
      .addCase(getConfigFileRBIInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(getConfigFileRBIInvoice.fulfilled, (state, action) => {
        state.dataConfigRBIInvoice = action.payload;
        state.loading = false;
      })
      .addCase(getConfigFileRBIInvoice.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // RBI GENERAL TEMPLATE
      .addCase(getConfigFileRBIGeneralTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getConfigFileRBIGeneralTemplate.fulfilled, (state, action) => {
        state.dataConfigRBIGeneralTemplate = action.payload;
        state.loading = false;
      })
      .addCase(getConfigFileRBIGeneralTemplate.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // ✅ DOWNLOAD ATTACHMENT FAKTUR CODE
      .addCase(getDownloadAttachmentFakturCode.pending, (state) => {
        state.downloadLoading = true;
        state.error = null;
      })
      .addCase(getDownloadAttachmentFakturCode.fulfilled, (state, action) => {
        state.dataDownloadAttachment = action.payload;
        state.downloadLoading = false;
      })
      .addCase(getDownloadAttachmentFakturCode.rejected, (state, action) => {
        state.error = action.payload;
        state.downloadLoading = false;
        state.dataDownloadAttachment = null;
      });
  },
});

export const { resetDownloadAttachment } = attachmentSlice.actions;
const { reducer } = attachmentSlice;
export default reducer;
