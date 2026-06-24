/* eslint-disable no-undef */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import { showModalError, showModalSuccess } from "../general_slice";
import DocViewer from "react-doc-viewer";
import { tokenHeader } from "../../../utils/tokenHeader";
import axios from "axios";
import ReactDOM from "react-dom";

const initialState = {
  data: [],
  invoice_list: [],
  invoice_pagination: null,
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
  // Approval states
  data_approval_history: null,
  loading_approval_history: false,
  data_ready_request: [],
  loading_ready_request: false,
  data_approval_hierarchy: [],
  loading_approval_hierarchy: false,
  data_apphier_detail: null,
  loading_apphier_detail: false,
  data_approval_list: [],
  loading_approval_list: false,
  loading_modal: false,
};

export const getAllEMeteraiInvoices = createAsyncThunk(
  "GET_ALL_EMETERAI_INVOICES",
  async (
    { page, pageSize, search, sort, filters, isLoadMore = false },
    thunkAPI,
  ) => {
    try {
      const sortParams = sort || "billPeriod~asc";
      const searchParams = search || "";
      let url = `/v1/dbs/api/rbi/invoice/stampsign?page=${page}&size=${pageSize}&sort=${sortParams}`;

      if (searchParams) {
        url += `&searchs=${searchParams}`;
      }

      if (filters) {
        if (filters.dateRange && filters.dateRange.length === 2) {
          const [startDate, endDate] = filters.dateRange;
          url += `&startDate=${startDate.format(
            "YYYY-MM-DD",
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

      return { ...response.data, isLoadMore };
    } catch (error) {
      console.error("❌ GET E-Meterai Invoices Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message,
      );
      console.error("Error Code:", error?.response?.data?.code);
      console.error("=".repeat(80));
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
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
        error?.response?.data?.message || error.message,
      );
      console.error("Error Code:", error?.response?.data?.code);
      console.error("=".repeat(80));
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
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
        error?.response?.data?.message || error.message,
      );
      console.error("Error Code:", error?.response?.data?.code);
      console.error("=".repeat(80));
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const previewOriginalInvoice = createAsyncThunk(
  "PREVIEW_ORIGINAL_INVOICE",
  async ({ invoiceNumber }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/v1/dbs/api/rbi/invoice/stampsign/download/original/${invoiceNumber}`,
        {
          headers: {
            ...tokenHeader(),
            "ngrok-skip-browser-warning": "true",
          },
          responseType: "arraybuffer",
        },
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
          viewerContainer,
        );
      }
    } catch (error) {
      console.error("❌ Preview Original Invoice Error:", error);
      console.error("=".repeat(80));
      return rejectWithValue(error);
    }
  },
);

export const previewStampedInvoice = createAsyncThunk(
  "PREVIEW_STAMPED_INVOICE",
  async ({ invoiceNumber }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/v1/dbs/api/rbi/invoice/stampsign/download/stamped/${invoiceNumber}`,
        {
          headers: {
            ...tokenHeader(),
            "ngrok-skip-browser-warning": "true",
          },
          responseType: "arraybuffer",
        },
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
          viewerContainer,
        );
      }
    } catch (error) {
      console.error("❌ Preview Stamped Invoice Error:", error);
      console.error("=".repeat(80));
      return rejectWithValue(error);
    }
  },
);

export const downloadOriginalInvoice = createAsyncThunk(
  "DOWNLOAD_ORIGINAL_INVOICE",
  async ({ invoiceNumber }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/stampsign/download/original/${invoiceNumber}`;

      const response = await ratingBillingHttpService.downloadFile(url);

      return response.data;
    } catch (error) {
      console.error("❌ Download Original Invoice Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message,
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
  },
);

export const downloadStampedInvoice = createAsyncThunk(
  "DOWNLOAD_STAMPED_INVOICE",
  async ({ invoiceNumber }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/stampsign/download/stamped/${invoiceNumber}`;

      const response = await ratingBillingHttpService.downloadFile(url);

      return response.data;
    } catch (error) {
      console.error("❌ Download Stamped Invoice Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message,
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
  },
);

export const downloadSignedInvoice = createAsyncThunk(
  "DOWNLOAD_SIGNED_INVOICE",
  async ({ invoiceNumber }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/stampsign/download/signed/${invoiceNumber}`;

      const response = await ratingBillingHttpService.downloadFile(url);

      return response.data;
    } catch (error) {
      console.error("❌ Download Signed Invoice Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message,
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
  },
);

export const getApprovalHistory = createAsyncThunk(
  "GET_EMETERAI_APPROVAL_HISTORY",
  async ({ invoiceNumber }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/stampsign/approval-history/${invoiceNumber}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      console.error("\u274C GET E-Meterai Approval History Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message,
      );
      console.error("Error Code:", error?.response?.data?.code);
      console.error("=".repeat(80));
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getApprovalHierarchyList = createAsyncThunk(
  "GET_APPROVAL_HIERARCHY_LIST",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/stampsign/approval-hierarchy-list`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      console.error("❌ GET Approval Hierarchy List Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message,
      );
      console.error("Error Code:", error?.response?.data?.code);
      console.error("=".repeat(80));
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getApphierDetail = createAsyncThunk(
  "GET_APPHIER_DETAIL",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/stampsign/apphier-detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      console.error("❌ GET Apphier Detail Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message,
      );
      console.error("Error Code:", error?.response?.data?.code);
      console.error("=".repeat(80));
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

// Approval-related actions
export const getReadyForRequestList = createAsyncThunk(
  "GET_READY_FOR_REQUEST_LIST",
  async ({ type }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/stampsign/ready-request/${type}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      console.error("❌ GET Ready for Request List Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message,
      );
      console.error("Error Code:", error?.response?.data?.code);
      console.error("=".repeat(80));
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getApprovalListByType = createAsyncThunk(
  "GET_APPROVAL_LIST_BY_TYPE",
  async ({ type }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/stampsign/approval-list?type=${type}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      console.error("❌ GET Approval List Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message,
      );
      console.error("Error Code:", error?.response?.data?.code);
      console.error("=".repeat(80));
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const approveStampSign = createAsyncThunk(
  "APPROVE_STAMP_SIGN",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/stampsign/approval`;
      const response = await ratingBillingHttpService.createData(url, body);

      const successMessage = {
        title: "Successful",
        description:
          response?.message ||
          `Successfully ${
            body.action === "APPROVE" ? "approved" : "rejected"
          } the request`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));

      return response;
    } catch (error) {
      console.error("❌ POST Approval Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message,
      );
      console.error("Error Code:", error?.response?.data?.code);
      console.error("=".repeat(80));

      const message =
        error?.response?.data?.message || error.message || error.toString();

      const errorBody = {
        title: "Failed",
        description: `Failed to process approval. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const requestApprovalStampSign = createAsyncThunk(
  "REQUEST_APPROVAL_STAMP_SIGN",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/stampsign/stamp/${body.type}`;
      const response = await ratingBillingHttpService.createData(url, {
        ...body,
        type: undefined,
      });

      const successMessage = {
        title: "Successful",
        description:
          response?.message || "Request approval submitted successfully",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));

      return response;
    } catch (error) {
      console.error("❌ POST Request Approval Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message,
      );
      console.error("Error Code:", error?.response?.data?.code);
      console.error("=".repeat(80));

      const message =
        error?.response?.data?.message || error.message || error.toString();

      const errorBody = {
        title: "Failed",
        description: `Failed to request approval. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

// Digital stamping via new API: POST /v1/dbs/api/rbi/invoice/stampsign/request-stamping/:invoiceNumber
// Body: { id, remarks }
export const requestStampingDigital = createAsyncThunk(
  "REQUEST_STAMPING_DIGITAL",
  async ({ invoiceNumber, id, remarks }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/stampsign/request-stamping/${invoiceNumber}`;
      const body = { id, remarks };

      const response = await ratingBillingHttpService.createData(url, body);

      const successMessage = {
        title: "Successful",
        description:
          response?.message ||
          "E-Meterai stamping request submitted successfully",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));

      return response;
    } catch (error) {
      console.error("❌ POST Digital Stamping Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message,
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
  },
);

// Digital signing via new API: POST /v1/dbs/api/rbi/invoice/stampsign/request-signing/:invoiceNumber
// Body: { id, remarks }
export const requestSigningDigital = createAsyncThunk(
  "REQUEST_SIGNING_DIGITAL",
  async ({ invoiceNumber, id, remarks }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/stampsign/request-signing/${invoiceNumber}`;
      const body = { id, remarks };

      const response = await ratingBillingHttpService.createData(url, body);

      const successMessage = {
        title: "Successful",
        description:
          response?.message || "E-Sign request submitted successfully",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));

      return response;
    } catch (error) {
      console.error("❌ POST Digital Signing Error:");
      console.error(
        "Error Message:",
        error?.response?.data?.message || error.message,
      );
      console.error("Error Code:", error?.response?.data?.code);
      console.error("=".repeat(80));

      const message =
        error?.response?.data?.message || error.message || error.toString();

      const errorBody = {
        title: "Failed",
        description: `E-Sign request failed. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const uploadManualStamping = createAsyncThunk(
  "UPLOAD_MANUAL_STAMPING",
  async ({ invoiceNumber, file, remark, apphierId }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("apphierId", apphierId);
      formData.append("remark", remark || "Manual stamping upload");
      formData.append("data[0].invoiceNumber", invoiceNumber);
      formData.append("data[0].file", file);

      const url = `/v1/dbs/api/rbi/invoice/stampsign/stamp/manual`;

      const response = await ratingBillingHttpService.uploadAttachment(
        url,
        formData,
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
        error?.response?.data?.message || error.message,
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
  },
);

export const uploadManualSigning = createAsyncThunk(
  "UPLOAD_MANUAL_SIGNING",
  async ({ invoiceNumber, file, remark, apphierId }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("apphierId", apphierId);
      formData.append("remark", remark || "Manual signing upload");
      formData.append("data[0].invoiceNumber", invoiceNumber);
      formData.append("data[0].file", file);

      const url = `/v1/dbs/api/rbi/invoice/stampsign/sign/manual`;

      const response = await ratingBillingHttpService.uploadAttachment(
        url,
        formData,
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
        error?.response?.data?.message || error.message,
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
  },
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
    [getAllEMeteraiInvoices.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
      state.isFailed = false;
    },
    [getAllEMeteraiInvoices.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload?.result || [];
      const newResult = action.payload?.result || [];
      if (action.payload?.isLoadMore) {
        state.invoice_list = [...state.invoice_list, ...newResult];
      } else {
        state.invoice_list = newResult;
      }
      state.invoice_pagination = action.payload?.page || null;
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

    // Digital stamping (new API)
    [requestStampingDigital.pending]: (state) => {
      state.stampingLoading = true;
      state.isFailed = false;
    },
    [requestStampingDigital.fulfilled]: (state, action) => {
      state.stampingLoading = false;
      state.isSuccess = true;
      state.message =
        action.payload?.message || "Stamping request submitted successfully";
    },
    [requestStampingDigital.rejected]: (state, action) => {
      state.stampingLoading = false;
      state.isFailed = true;
      state.message =
        action.payload?.data?.message || "Failed to submit stamping request";
    },

    // Digital signing (new API)
    [requestSigningDigital.pending]: (state) => {
      state.signingLoading = true;
      state.isFailed = false;
    },
    [requestSigningDigital.fulfilled]: (state, action) => {
      state.signingLoading = false;
      state.isSuccess = true;
      state.message =
        action.payload?.message || "E-Sign request submitted successfully";
    },
    [requestSigningDigital.rejected]: (state, action) => {
      state.signingLoading = false;
      state.isFailed = true;
      state.message =
        action.payload?.data?.message || "Failed to submit E-Sign request";
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

    [getApprovalHierarchyList.pending]: (state) => {
      state.loading_approval_hierarchy = true;
      state.isFailed = false;
    },
    [getApprovalHierarchyList.fulfilled]: (state, action) => {
      state.loading_approval_hierarchy = false;
      if (Array.isArray(action.payload)) {
        state.data_approval_hierarchy = action.payload;
      } else {
        state.data_approval_hierarchy =
          action.payload?.result || action.payload?.data || [];
      }
      state.isSuccess = true;
    },
    [getApprovalHierarchyList.rejected]: (state, action) => {
      state.loading_approval_hierarchy = false;
      state.isFailed = true;
      state.data_approval_hierarchy = [];
      state.message =
        action.payload?.data?.message ||
        "Failed to fetch approval hierarchy list";
    },

    [getApphierDetail.pending]: (state) => {
      state.loading_apphier_detail = true;
      state.isFailed = false;
    },
    [getApphierDetail.fulfilled]: (state, action) => {
      state.loading_apphier_detail = false;
      if (Array.isArray(action.payload)) {
        state.data_apphier_detail = action.payload;
      } else {
        state.data_apphier_detail =
          action.payload?.result || action.payload?.data || [];
      }
      state.isSuccess = true;
    },
    [getApphierDetail.rejected]: (state, action) => {
      state.loading_apphier_detail = false;
      state.isFailed = true;
      state.data_apphier_detail = [];
      state.message =
        action.payload?.data?.message || "Failed to fetch approval detail";
    },

    [getReadyForRequestList.pending]: (state) => {
      state.loading_ready_request = true;
      state.isFailed = false;
    },
    [getReadyForRequestList.fulfilled]: (state, action) => {
      state.loading_ready_request = false;
      if (Array.isArray(action.payload)) {
        state.data_ready_request = action.payload;
      } else {
        state.data_ready_request =
          action.payload?.result || action.payload?.data || [];
      }
      state.isSuccess = true;
    },
    [getReadyForRequestList.rejected]: (state, action) => {
      state.loading_ready_request = false;
      state.isFailed = true;
      state.data_ready_request = [];
      state.message =
        action.payload?.data?.message || "Failed to fetch ready request list";
    },

    [getApprovalListByType.pending]: (state) => {
      state.loading_approval_list = true;
      state.isFailed = false;
    },
    [getApprovalListByType.fulfilled]: (state, action) => {
      state.loading_approval_list = false;
      if (Array.isArray(action.payload)) {
        state.data_approval_list = action.payload;
      } else {
        state.data_approval_list =
          action.payload?.result || action.payload?.data || [];
      }
      state.isSuccess = true;
    },
    [getApprovalListByType.rejected]: (state, action) => {
      state.loading_approval_list = false;
      state.isFailed = true;
      state.data_approval_list = [];
      state.message =
        action.payload?.data?.message || "Failed to fetch approval list";
    },

    [approveStampSign.pending]: (state) => {
      state.loading_modal = true;
      state.isFailed = false;
    },
    [approveStampSign.fulfilled]: (state, action) => {
      state.loading_modal = false;
      state.isSuccess = true;
      state.message =
        action.payload?.message || "Approval processed successfully";
    },
    [approveStampSign.rejected]: (state, action) => {
      state.loading_modal = false;
      state.isFailed = true;
      state.message =
        action.payload?.data?.message || "Failed to process approval";
    },

    [requestApprovalStampSign.pending]: (state) => {
      state.loading_modal = true;
      state.isFailed = false;
    },
    [requestApprovalStampSign.fulfilled]: (state, action) => {
      state.loading_modal = false;
      state.isSuccess = true;
      state.message =
        action.payload?.message || "Request approval submitted successfully";
    },
    [requestApprovalStampSign.rejected]: (state, action) => {
      state.loading_modal = false;
      state.isFailed = true;
      state.message =
        action.payload?.data?.message || "Failed to request approval";
    },

    [getApprovalHistory.pending]: (state) => {
      state.loading_approval_history = true;
      state.isFailed = false;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.loading_approval_history = false;
      state.data_approval_history = action.payload;
      state.isSuccess = true;
    },
    [getApprovalHistory.rejected]: (state, action) => {
      state.loading_approval_history = false;
      state.isFailed = true;
      state.data_approval_history = null;
      state.message =
        action.payload?.data?.message || "Failed to fetch approval history";
    },
  },
});

export const { resetStampingState, resetDetailData, resetLogData } =
  emeteraiSlice.actions;

const { reducer } = emeteraiSlice;
export default reducer;
