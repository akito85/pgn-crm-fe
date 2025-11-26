/* eslint-disable no-undef */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import { showModalError, showModalSuccess } from "../general_slice";
import DocViewer from "react-doc-viewer";
import { tokenHeader } from "../../../utils/tokenHeader";
import axios from "axios";

const initialState = {
  data: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
  message: "",
  stampingLoading: false,
  signingLoading: false,
  detailData: null,
  detailLoading: false,
  downloadLoading: false,
  previewLoading: false,
  logData: [],
  logLoading: false,
  logPageInfo: {
    size: 10,
    totalElements: 0,
    totalPages: 0,
    number: 0,
  },
  pageInfo: {
    size: 10,
    totalElements: 0,
    totalPages: 0,
    number: 0,
  },
};

const getFilenameFromHeader = (contentDisposition) => {
  if (!contentDisposition) return null;

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''(.+)/i);
  if (utf8Match) {
    return decodeURIComponent(utf8Match[1]);
  }

  const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
  if (filenameMatch) {
    return filenameMatch[1];
  }

  return null;
};

export const getAllEMeteraiInvoices = createAsyncThunk(
  "GET_ALL_EMETERAI_INVOICES",
  async ({ page, pageSize, search, sort, filters }, thunkAPI) => {
    try {
      const sortParams = sort || "billingPeriod~asc";
      const searchParams = search || "";
      let url = `/v1/dbs/api/rbi/invoice/stampsign?page=${page}&size=${pageSize}&sort=${sortParams}`;

      if (searchParams) {
        url += `&searchs=${searchParams}`;
      }

      if (filters) {
        if (filters.dateRange && filters.dateRange.length === 2) {
          const [startDate, endDate] = filters.dateRange;
          url += `&startDate=${startDate.format(
            "YYYY-MM-DD"
          )}&endDate=${endDate.format("YYYY-MM-DD")}`;
        }
        if (filters.stampStatus && filters.stampStatus !== "all") {
          url += `&stampStatus=${filters.stampStatus.toUpperCase()}`;
        }
        if (filters.signStatus && filters.signStatus !== "all") {
          url += `&signStatus=${filters.signStatus.toUpperCase()}`;
        }
      }

      const response = await ratingBillingHttpService.getPagination(url);

      return response.data;
    } catch (error) {
      console.error("❌ GET E-Meterai Invoices Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message
      );
      console.error("Error Code:", error?.response?.data?.code);
      console.error("=".repeat(80));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getInvoiceDetail = createAsyncThunk(
  "GET_INVOICE_DETAIL",
  async ({ invoiceNumber }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/stampsign/${invoiceNumber}`;

      const response = await ratingBillingHttpService.getDetail(url);

      return response.data;
    } catch (error) {
      console.error("❌ GET Invoice Detail Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message
      );
      console.error("Error Code:", error?.response?.data?.code);
      console.error("=".repeat(80));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getInvoiceActivityLogs = createAsyncThunk(
  "GET_INVOICE_ACTIVITY_LOGS",
  async ({ invoiceNumber, page = 0, pageSize = 10 }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/stampsign/logs/${invoiceNumber}?page=${page}&size=${pageSize}`;

      const response = await ratingBillingHttpService.getPagination(url);

      return response.data;
    } catch (error) {
      console.error("❌ GET Invoice Activity Logs Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message
      );
      console.error("Error Code:", error?.response?.data?.code);
      console.error("=".repeat(80));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const previewOriginalInvoice = createAsyncThunk(
  "PREVIEW_ORIGINAL_INVOICE",
  async ({ invoiceNumber }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        +`/v1/dbs/api/rbi/invoice/stampsign/download/original/${invoiceNumber}`,
        {
          headers: {
            ...tokenHeader(),
            "ngrok-skip-browser-warning": "true",
          },
          responseType: "arraybuffer",
        }
      );
      const responseBlob = await response.data;
      const blobText =
        responseBlob instanceof Blob ? await responseBlob.text() : responseBlob;
      const contentType = response.headers["content-type"];
      const blob = new Blob([blobText], {
        type: contentType ? "application/pdf" : "application/rtf",
      });
      const blobUrl = URL.createObjectURL(blob);
      const newTab = window.open(blobUrl, "_blank");

      if (newTab) {
        newTab.document.title = "PDF Preview";
        const viewerContainer = document.createElement("div");
        newTab.document.body.appendChild(viewerContainer);
        ReactDOM.render(
          <DocViewer documents={[{ uri: blobUrl, type: contentType }]} />,
          viewerContainer
        );
      }
    } catch (error) {
      console.error("❌ Preview Original Invoice Error:", error);
      console.error("=".repeat(80));
      return rejectWithValue(error);
    }
  }
);

export const previewStampedInvoice = createAsyncThunk(
  "PREVIEW_STAMPED_INVOICE",
  async ({ invoiceNumber }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        +`/v1/dbs/api/rbi/invoice/stampsign/download/stamped/${invoiceNumber}`,
        {
          headers: {
            ...tokenHeader(),
            "ngrok-skip-browser-warning": "true",
          },
          responseType: "arraybuffer",
        }
      );
      const responseBlob = await response.data;
      const blobText =
        responseBlob instanceof Blob ? await responseBlob.text() : responseBlob;
      const contentType = response.headers["content-type"];
      const blob = new Blob([blobText], {
        type: contentType ? "application/pdf" : "application/rtf",
      });
      const blobUrl = URL.createObjectURL(blob);
      const newTab = window.open(blobUrl, "_blank");

      if (newTab) {
        newTab.document.title = "PDF Preview";
        const viewerContainer = document.createElement("div");
        newTab.document.body.appendChild(viewerContainer);
        ReactDOM.render(
          <DocViewer documents={[{ uri: blobUrl, type: contentType }]} />,
          viewerContainer
        );
      }
    } catch (error) {
      console.error("❌ Preview Stamped Invoice Error:", error);
      console.error("=".repeat(80));
      return rejectWithValue(error);
    }
  }
);

export const downloadOriginalInvoice = createAsyncThunk(
  "DOWNLOAD_ORIGINAL_INVOICE",
  async ({ invoiceNumber }, thunkAPI) => {
    try {
      const response = await axios.get(
        +`/v1/dbs/api/rbi/invoice/stampsign/download/original/${invoiceNumber}`,
        {
          headers: {
            ...tokenHeader(),
            "ngrok-skip-browser-warning": "true",
          },
          responseType: "blob",
        }
      );

      const contentDisposition = response.headers["content-disposition"];
      let filename = getFilenameFromHeader(contentDisposition);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return response.data;
    } catch (error) {
      console.error("❌ Download Original Invoice Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message
      );
      console.error("Error Code:", error?.response?.data?.code);
      console.error("=".repeat(80));

      const message =
        error?.response?.data?.message || error.message || error.toString();

      const errorBody = {
        title: "Failed",
        description: `Failed to download original invoice. ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const downloadStampedInvoice = createAsyncThunk(
  "DOWNLOAD_STAMPED_INVOICE",
  async ({ invoiceNumber }, thunkAPI) => {
    try {
      const response = await axios.get(
        +`/v1/dbs/api/rbi/invoice/stampsign/download/stamped/${invoiceNumber}`,
        {
          headers: {
            ...tokenHeader(),
            "ngrok-skip-browser-warning": "true",
          },
          responseType: "blob",
        }
      );

      const contentDisposition = response.headers["content-disposition"];
      let filename = getFilenameFromHeader(contentDisposition);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return response.data;
    } catch (error) {
      console.error("❌ Download Stamped Invoice Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message
      );
      console.error("Error Code:", error?.response?.data?.code);
      console.error("=".repeat(80));

      const message =
        error?.response?.data?.message || error.message || error.toString();

      const errorBody = {
        title: "Failed",
        description: `Failed to download stamped invoice. ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const downloadSignedInvoice = createAsyncThunk(
  "DOWNLOAD_SIGNED_INVOICE",
  async ({ invoiceNumber }, thunkAPI) => {
    try {
      const response = await axios.get(
        +`/v1/dbs/api/rbi/invoice/stampsign/download/signed/${invoiceNumber}`,
        {
          headers: {
            ...tokenHeader(),
            "ngrok-skip-browser-warning": "true",
          },
          responseType: "blob",
        }
      );

      const contentDisposition = response.headers["content-disposition"];
      let filename = getFilenameFromHeader(contentDisposition);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return response.data;
    } catch (error) {
      console.error("❌ Download Signed Invoice Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message
      );
      console.error("Error Code:", error?.response?.data?.code);
      console.error("=".repeat(80));

      const message =
        error?.response?.data?.message || error.message || error.toString();

      const errorBody = {
        title: "Failed",
        description: `Failed to download signed invoice. ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const createStampingRequest = createAsyncThunk(
  "CREATE_STAMPING_REQUEST",
  async (
    {
      invoiceNumber,
      jenisDoc = "invoice",
      visLLX = "10",
      visLLY = "10",
      visURX = "500",
      visURY = "700",
      pageStamp = "1",
      jenisIdentitas,
      noIdentitas,
      namaIdentitas,
      kopur = "1",
      remark,
    },
    thunkAPI
  ) => {
    try {
      const body = {
        jenisDoc,
        visLLX,
        visLLY,
        visURX,
        visURY,
        pageStamp,
        jenisIdentitas,
        noIdentitas,
        namaIdentitas,
        kopur,
        remark,
      };

      const url = `/v1/dbs/api/rbi/invoice/stampsign/${invoiceNumber}/stamp/emeterai`;

      const response = await ratingBillingHttpService.createData(url, body);

      const successMessage = {
        title: "Successful",
        description:
          response?.message ||
          "E-Meterai stamping request has been submitted successfully",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));

      return response;
    } catch (error) {
      console.error("❌ POST E-Meterai Stamping Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message
      );
      console.error("Error Code:", error?.response?.data?.code);
      console.error("=".repeat(80));

      const message =
        error?.response?.data?.message || error.message || error.toString();

      const errorBody = {
        title: "Failed",
        description: `E-Meterai stamping request failed. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const uploadManualStamping = createAsyncThunk(
  "UPLOAD_MANUAL_STAMPING",
  async ({ invoiceNumber, file, remark }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("stampedFile", file);
      formData.append("remark", remark || "Manual stamping upload");

      const url = `/v1/dbs/api/rbi/invoice/stampsign/${invoiceNumber}/stamp/manual`;

      const response = await ratingBillingHttpService.uploadAttachment(
        url,
        formData
      );

      const successMessage = {
        title: "Successful",
        description:
          response?.message ||
          "Stamped document has been uploaded successfully",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));

      return response;
    } catch (error) {
      console.error("❌ POST Manual Stamping Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message
      );
      console.error("Error Code:", error?.response?.data?.code);
      console.error("=".repeat(80));

      const message =
        error?.response?.data?.message || error.message || error.toString();

      const errorBody = {
        title: "Failed",
        description: `Failed to upload stamped document. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const uploadManualSigning = createAsyncThunk(
  "UPLOAD_MANUAL_SIGNING",
  async ({ invoiceNumber, file, remark }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("signFile", file);
      formData.append("remark", remark || "Manual signing upload");

      const url = `/v1/dbs/api/rbi/invoice/stampsign/${invoiceNumber}/sign/manual`;

      const response = await ratingBillingHttpService.uploadAttachment(
        url,
        formData
      );

      const successMessage = {
        title: "Successful",
        description:
          response?.message || "Signed document has been uploaded successfully",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));

      return response;
    } catch (error) {
      console.error("❌ POST Manual Signing Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message
      );
      console.error("Error Code:", error?.response?.data?.code);
      console.error("=".repeat(80));

      const message =
        error?.response?.data?.message || error.message || error.toString();

      const errorBody = {
        title: "Failed",
        description: `Failed to upload signed document. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const emeteraiSlice = createSlice({
  name: "emeterai",
  initialState,
  reducers: {
    resetStampingState: (state) => {
      state.stampingLoading = false;
      state.isSuccess = false;
      state.isFailed = false;
      state.message = "";
    },
    resetDetailData: (state) => {
      state.detailData = null;
      state.detailLoading = false;
    },
    resetLogData: (state) => {
      state.logData = [];
      state.logLoading = false;
      state.logPageInfo = initialState.logPageInfo;
    },
  },
  extraReducers: {
    [getAllEMeteraiInvoices.pending]: (state) => {
      state.loading = true;
      state.isFailed = false;
    },
    [getAllEMeteraiInvoices.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload?.result || [];
      state.pageInfo = action.payload?.page || initialState.pageInfo;
      state.isSuccess = true;
    },
    [getAllEMeteraiInvoices.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.message =
        action.payload?.data?.message || "Failed to fetch invoices";
    },

    [getInvoiceDetail.pending]: (state) => {
      state.detailLoading = true;
      state.isFailed = false;
    },
    [getInvoiceDetail.fulfilled]: (state, action) => {
      state.detailLoading = false;
      state.detailData = action.payload;
      state.isSuccess = true;
    },
    [getInvoiceDetail.rejected]: (state, action) => {
      state.detailLoading = false;
      state.isFailed = true;
      state.message =
        action.payload?.data?.message || "Failed to fetch invoice detail";
    },

    [getInvoiceActivityLogs.pending]: (state) => {
      state.logLoading = true;
      state.isFailed = false;
    },
    [getInvoiceActivityLogs.fulfilled]: (state, action) => {
      state.logLoading = false;
      state.logData = action.payload?.result || [];
      state.logPageInfo = action.payload?.page || initialState.logPageInfo;
      state.isSuccess = true;
    },
    [getInvoiceActivityLogs.rejected]: (state, action) => {
      state.logLoading = false;
      state.isFailed = true;
      state.message =
        action.payload?.data?.message || "Failed to fetch activity logs";
    },

    [previewOriginalInvoice.pending]: (state) => {
      state.previewLoading = true;
    },
    [previewOriginalInvoice.fulfilled]: (state) => {
      state.previewLoading = false;
    },
    [previewOriginalInvoice.rejected]: (state, action) => {
      state.previewLoading = false;
      state.message =
        action.payload?.data?.message || "Failed to preview original invoice";
    },

    [previewStampedInvoice.pending]: (state) => {
      state.previewLoading = true;
    },
    [previewStampedInvoice.fulfilled]: (state) => {
      state.previewLoading = false;
    },
    [previewStampedInvoice.rejected]: (state, action) => {
      state.previewLoading = false;
      state.message =
        action.payload?.data?.message || "Failed to preview stamped invoice";
    },

    [downloadOriginalInvoice.pending]: (state) => {
      state.downloadLoading = true;
    },
    [downloadOriginalInvoice.fulfilled]: (state) => {
      state.downloadLoading = false;
    },
    [downloadOriginalInvoice.rejected]: (state, action) => {
      state.downloadLoading = false;
      state.message =
        action.payload?.data?.message || "Failed to download original invoice";
    },

    [downloadStampedInvoice.pending]: (state) => {
      state.downloadLoading = true;
    },
    [downloadStampedInvoice.fulfilled]: (state) => {
      state.downloadLoading = false;
    },
    [downloadStampedInvoice.rejected]: (state, action) => {
      state.downloadLoading = false;
      state.message =
        action.payload?.data?.message || "Failed to download stamped invoice";
    },

    [downloadSignedInvoice.pending]: (state) => {
      state.downloadLoading = true;
    },
    [downloadSignedInvoice.fulfilled]: (state) => {
      state.downloadLoading = false;
    },
    [downloadSignedInvoice.rejected]: (state, action) => {
      state.downloadLoading = false;
      state.message =
        action.payload?.data?.message || "Failed to download signed invoice";
    },

    [createStampingRequest.pending]: (state) => {
      state.stampingLoading = true;
      state.isFailed = false;
    },
    [createStampingRequest.fulfilled]: (state, action) => {
      state.stampingLoading = false;
      state.isSuccess = true;
      state.message =
        action.payload?.message || "Stamping request submitted successfully";
    },
    [createStampingRequest.rejected]: (state, action) => {
      state.stampingLoading = false;
      state.isFailed = true;
      state.message =
        action.payload?.data?.message || "Failed to submit stamping request";
    },

    [uploadManualStamping.pending]: (state) => {
      state.stampingLoading = true;
      state.isFailed = false;
    },
    [uploadManualStamping.fulfilled]: (state, action) => {
      state.stampingLoading = false;
      state.isSuccess = true;
      state.message =
        action.payload?.message || "Manual stamping uploaded successfully";
    },
    [uploadManualStamping.rejected]: (state, action) => {
      state.stampingLoading = false;
      state.isFailed = true;
      state.message =
        action.payload?.data?.message || "Failed to upload manual stamping";
    },

    [uploadManualSigning.pending]: (state) => {
      state.signingLoading = true;
      state.isFailed = false;
    },
    [uploadManualSigning.fulfilled]: (state, action) => {
      state.signingLoading = false;
      state.isSuccess = true;
      state.message =
        action.payload?.message || "Manual signing uploaded successfully";
    },
    [uploadManualSigning.rejected]: (state, action) => {
      state.signingLoading = false;
      state.isFailed = true;
      state.message =
        action.payload?.data?.message || "Failed to upload manual signing";
    },
  },
});

export const { resetStampingState, resetDetailData, resetLogData } =
  emeteraiSlice.actions;

const { reducer } = emeteraiSlice;
export default reducer;
