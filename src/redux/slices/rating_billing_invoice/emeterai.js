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

const formatFilename = (invoiceNumber, type, timestamp = new Date()) => {
  const day = String(timestamp.getDate()).padStart(2, "0");
  const month = timestamp
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase();
  const year = timestamp.getFullYear();
  const formattedDate = `${day}${month}${year}`;

  return `${invoiceNumber}-(${type})-${formattedDate}.pdf`;
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

      console.log("=".repeat(80));
      console.log("📡 GET E-Meterai Invoices Request");
      console.log("=".repeat(80));
      console.log("URL:", url);
      console.log("Parameters:", {
        page,
        pageSize,
        search: searchParams,
        sort: sortParams,
        filters,
      });
      console.log("Timestamp:", new Date().toLocaleString("id-ID"));
      console.log("=".repeat(80));

      const response = await ratingBillingHttpService.getPagination(
        url,
        process.env.REACT_APP_BASE_URL_NGROK
      );

      console.log("✅ GET E-Meterai Invoices Response:");
      console.log("Total Elements:", response?.data?.page?.totalElements);
      console.log("Total Pages:", response?.data?.page?.totalPages);
      console.log("Current Page:", response?.data?.page?.number);
      console.log("Data Count:", response?.data?.result?.length);
      console.log("=".repeat(80));

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

      console.log("=".repeat(80));
      console.log("📡 GET Invoice Detail Request");
      console.log("=".repeat(80));
      console.log("URL:", url);
      console.log("Invoice Number:", invoiceNumber);
      console.log("Timestamp:", new Date().toLocaleString("id-ID"));
      console.log("=".repeat(80));

      const response = await ratingBillingHttpService.getDetail(
        url,
        process.env.REACT_APP_BASE_URL_NGROK
      );

      console.log("✅ GET Invoice Detail Response:");
      console.log("Success:", response?.success);
      console.log("Customer:", response?.data?.customerName);
      console.log("Invoice Number:", response?.data?.invoiceNumber);
      console.log("Has Original URL:", !!response?.data?.invoiceUrl);
      console.log("Has Stamped URL:", !!response?.data?.invoiceStampedUrl);
      console.log("Has Signed URL:", !!response?.data?.invoiceSignedUrl);
      console.log("=".repeat(80));

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

      console.log("=".repeat(80));
      console.log("📡 GET Invoice Activity Logs Request");
      console.log("=".repeat(80));
      console.log("URL:", url);
      console.log("Invoice Number:", invoiceNumber);
      console.log("Page:", page, "Size:", pageSize);
      console.log("Timestamp:", new Date().toLocaleString("id-ID"));
      console.log("=".repeat(80));

      const response = await ratingBillingHttpService.getPagination(
        url,
        process.env.REACT_APP_BASE_URL_NGROK
      );

      console.log("✅ GET Invoice Activity Logs Response:");
      console.log("Total Elements:", response?.data?.page?.totalElements);
      console.log("Log Count:", response?.data?.result?.length);
      console.log("=".repeat(80));

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
      console.log("=".repeat(80));
      console.log("📡 Preview Original Invoice Request");
      console.log("Invoice Number:", invoiceNumber);
      console.log("=".repeat(80));

      const response = await axios.get(
        process.env.REACT_APP_BASE_URL_NGROK +
          `/v1/dbs/api/rbi/invoice/stampsign/download/original/${invoiceNumber}`,
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
      console.log("✅ Preview Original Invoice Success");
      console.log("=".repeat(80));
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
      console.log("=".repeat(80));
      console.log("📡 Preview Stamped Invoice Request");
      console.log("Invoice Number:", invoiceNumber);
      console.log("=".repeat(80));

      const response = await axios.get(
        process.env.REACT_APP_BASE_URL_NGROK +
          `/v1/dbs/api/rbi/invoice/stampsign/download/stamped/${invoiceNumber}`,
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
      console.log("✅ Preview Stamped Invoice Success");
      console.log("=".repeat(80));
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
        process.env.REACT_APP_BASE_URL_NGROK +
          `/v1/dbs/api/rbi/invoice/stampsign/download/original/${invoiceNumber}`,
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

      if (!filename) {
        filename = formatFilename(invoiceNumber, "original");
        console.warn(
          "⚠️ Filename not found in header, using fallback:",
          filename
        );
      } else {
        console.log("✅ Filename from header:", filename);
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      console.log("✅ Download Original Invoice Success");
      console.log("=".repeat(80));

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
      console.log("=".repeat(80));
      console.log("📥 Download Stamped Invoice Request");
      console.log("Invoice Number:", invoiceNumber);
      console.log("=".repeat(80));

      const response = await axios.get(
        process.env.REACT_APP_BASE_URL_NGROK +
          `/v1/dbs/api/rbi/invoice/stampsign/download/stamped/${invoiceNumber}`,
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

      if (!filename) {
        filename = formatFilename(invoiceNumber, "stamped");
        console.warn(
          "⚠️ Filename not found in header, using fallback:",
          filename
        );
      } else {
        console.log("✅ Filename from header:", filename);
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      console.log("✅ Download Stamped Invoice Success");
      console.log("=".repeat(80));

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
      console.log("=".repeat(80));
      console.log("📥 Download Signed Invoice Request");
      console.log("Invoice Number:", invoiceNumber);
      console.log("=".repeat(80));

      const response = await axios.get(
        process.env.REACT_APP_BASE_URL_NGROK +
          `/v1/dbs/api/rbi/invoice/stampsign/download/signed/${invoiceNumber}`,
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

      if (!filename) {
        filename = formatFilename(invoiceNumber, "signed");
        console.warn(
          "⚠️ Filename not found in header, using fallback:",
          filename
        );
      } else {
        console.log("✅ Filename from header:", filename);
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      console.log("✅ Download Signed Invoice Success");
      console.log("=".repeat(80));

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

      console.log("=".repeat(80));
      console.log("📡 POST E-Meterai Stamping Request");
      console.log("=".repeat(80));
      console.log("URL:", url);
      console.log("Invoice Number:", invoiceNumber);
      console.log("Payload:", JSON.stringify(body, null, 2));
      console.log("Timestamp:", new Date().toLocaleString("id-ID"));
      console.log("=".repeat(80));

      const response = await ratingBillingHttpService.createData(
        url,
        body,
        process.env.REACT_APP_BASE_URL_NGROK
      );

      console.log("✅ POST E-Meterai Stamping Response:");
      console.log("Success:", response?.success);
      console.log("Message:", response?.message);
      console.log("=".repeat(80));

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

      console.log("=".repeat(80));
      console.log("📡 POST Manual Stamping Upload");
      console.log("=".repeat(80));
      console.log("URL:", url);
      console.log("Invoice Number:", invoiceNumber);
      console.log("Remark:", remark || "Manual stamping upload");
      console.log("File Details:", {
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleString("id-ID"),
      });
      console.log("Timestamp:", new Date().toLocaleString("id-ID"));
      console.log("=".repeat(80));

      console.log("📦 FormData Contents:");
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`  ${pair[0]}:`, {
            name: pair[1].name,
            size: `${(pair[1].size / 1024).toFixed(2)} KB`,
            type: pair[1].type,
          });
        } else {
          console.log(`  ${pair[0]}: ${pair[1]}`);
        }
      }
      console.log("=".repeat(80));

      const response = await ratingBillingHttpService.uploadAttachment(
        url,
        formData,
        (progress) => {
          console.log(`⏳ Upload Progress: ${progress}%`);
        },
        process.env.REACT_APP_BASE_URL_NGROK
      );

      console.log("✅ POST Manual Stamping Response:");
      console.log("Success:", response?.success);
      console.log("Message:", response?.message);
      console.log("Code:", response?.code);
      console.log("=".repeat(80));

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

      console.log("=".repeat(80));
      console.log("📡 POST Manual Signing Upload");
      console.log("=".repeat(80));
      console.log("URL:", url);
      console.log("Invoice Number:", invoiceNumber);
      console.log("Remark:", remark || "Manual signing upload");
      console.log("File Details:", {
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleString("id-ID"),
      });
      console.log("Timestamp:", new Date().toLocaleString("id-ID"));
      console.log("=".repeat(80));

      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`  ${pair[0]}:`, {
            name: pair[1].name,
            size: `${(pair[1].size / 1024).toFixed(2)} KB`,
            type: pair[1].type,
          });
        } else {
          console.log(`  ${pair[0]}: ${pair[1]}`);
        }
      }

      const response = await ratingBillingHttpService.uploadAttachment(
        url,
        formData,
        (progress) => {
          console.log(`⏳ Upload Progress: ${progress}%`);
        },
        process.env.REACT_APP_BASE_URL_NGROK
      );

      console.log("✅ POST Manual Signing Response:");
      console.log("Success:", response?.success);
      console.log("Message:", response?.message);
      console.log("Code:", response?.code);
      console.log("=".repeat(80));

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
