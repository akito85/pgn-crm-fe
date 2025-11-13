import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import {
  showModalSuccess,
  setBodyError,
  showModalError,
} from "../general_slice";

const transformBillingItems = (items) => {
  if (!items || items.length === 0) return [];

  return items.map((item) => ({
    key: item.id,
    lineNumber: item.lineNumber,
    productName: item.item,
    description: item.description,
    quantity: item.quantity,
    uom: item.uom || "-",
    currency: item.currency,
    unitPrice: item.priceReal || 0,
    total: item.totalAmountReal || 0,
    amount: item.amountReal || 0,
    discountAmount: item.discountAmountReal || 0,
    priceCode: item.priceCode,
    typeBasis: item.typeBasis,
    reference: item.reference,
  }));
};

const initialState = {
  list_approved_billing: [],
  loading: false,
  loading_modal: false,
  loading_detail: false,
  dataListCategory: [],
  data_approval: [],
  data_approval_list: [],
  data_billingItem: [],
  detail_efaktur: null,
  log_activity: [],
  data_approval_history: {
    dataHistory: {},
    dataApprover: {},
  },
  loading_approval_history: false,
  upload_progress: 0,
  upload_results: [],
  pagination: {
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
  },
  pagination_log: {
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
  },
  list_log_aktivitas: [],
  loading_log: false,
};

export const getListApprovedBilling = createAsyncThunk(
  "EFAKTUR/GET_LIST_APPROVED_BILLING",
  async ({ page, pageSize, sort, filters }, thunkAPI) => {
    try {
      const searchParams = [];

      if (filters?.search) {
        searchParams.push(filters.search);
      }
      if (filters?.efakturStatus) {
        searchParams.push(`efakturStatus~${filters.efakturStatus}`);
      }
      if (filters?.invoiceNumber) {
        searchParams.push(`invoiceNumber~${filters.invoiceNumber}`);
      }
      if (filters?.billingCode) {
        searchParams.push(`billingCode~${filters.billingCode}`);
      }
      if (filters?.customerName) {
        searchParams.push(`customerName~${filters.customerName}`);
      }

      const sortParams = sort || "invoiceDate~desc";
      const searchParam = searchParams.length > 0 ? searchParams.join(",") : "";

      const url = `/v1/dbs/api/rbi/e-invoice?page=${
        page - 1
      }&size=${pageSize}&sort=${sortParams}${
        searchParam ? `&search=${searchParam}` : ""
      }`;

      const response = await ratingBillingHttpService.getPagination(url);

      return response.data || { result: [], page: {} };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = { title: "Failed", description: `${message}` };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getListCategory = createAsyncThunk(
  "EFAKTUR/GET_LIST_CATEGORY",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/e-invoice/category-list";
      const response = await ratingBillingHttpService.getAll(url);

      return response.data || [];
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = { title: "Failed", description: `${message}` };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getAllApprovalList = createAsyncThunk(
  "EFAKTUR/GET_ALL_APPROVAL_LIST",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/e-invoice/approval-hierarchy-list";
      const response = await ratingBillingHttpService.getAll(url);

      const approvalList = Array.isArray(response.data)
        ? response.data
        : response.data?.result || [];

      return approvalList;
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

export const getListApprovalById = createAsyncThunk(
  "GET_LIST_APPROVAL_BY_ID",
  async (appHierId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/e-invoice/apphier-detail/${appHierId}`;
      const response = await ratingBillingHttpService.getDetail(url);

      return response.data || [];
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

export const getAllBillingItemPaginate = createAsyncThunk(
  "GET_ALL_BILLING_ITEM_PAGINATE",
  async (billingCode, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing/billing-item/${billingCode}?page=0&size=999&sort=lineNumber~asc`;

      const response = await ratingBillingHttpService.getPagination(url);

      const transformedItems = transformBillingItems(
        response.data?.result || []
      );

      return transformedItems;
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
          description: `Gagal mengambil billing items: ${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getDetailEFaktur = createAsyncThunk(
  "EFAKTUR/GET_DETAIL",
  async (billingCode, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/e-invoice/${billingCode}`;

      const response = await ratingBillingHttpService.getDetail(url);

      return response.data || null;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();

      if (error?.response?.status === 404) {
        return null;
      }

      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Gagal mengambil detail E-Faktur: ${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getLogActivity = createAsyncThunk(
  "EFAKTUR/GET_LOG_ACTIVITY",
  async ({ efakturId, page = 1, size = 10 }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/e-invoice/logs/${efakturId}?page=${
        page - 1
      }&size=${size}`;

      const response = await ratingBillingHttpService.getPagination(url);

      return response.data || { result: [], page: {} };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();

      if (error?.response?.status === 404) {
        return {
          result: [],
          page: { size: 10, totalElements: 0, totalPages: 0, number: 0 },
        };
      }

      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Gagal mengambil log aktivitas: ${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }

      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const uploadAttachment = createAsyncThunk(
  "EFAKTUR/UPLOAD_ATTACHMENT",
  async ({ einvoiceId, file, categoryId, onProgress }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("refId", einvoiceId);
      formData.append("categoryId", categoryId);

      const url = "/v1/dbs/api/rbi/e-invoice/upload-attachment";
      const response = await ratingBillingHttpService.uploadAttachment(
        url,
        formData,
        onProgress || (() => {})
      );

      return {
        success: true,
        message: response?.message || "Success",
        fileName: file.name,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue({
        fileName: file.name,
        error:
          error?.response?.data?.message || error?.message || "Upload failed",
      });
    }
  }
);

export const generateEFakturWithAttachments = createAsyncThunk(
  "EFAKTUR/GENERATE_WITH_ATTACHMENTS",
  async ({ efakturData, attachments }, thunkAPI) => {
    try {
      const createUrl = "/v1/dbs/api/rbi/e-invoice/create-or-update";
      const requestBody = {
        apphierId: String(efakturData.apphierId),
        billingCode: efakturData.billingCode,
        remark: efakturData.remark || "",
        status: efakturData.status || "SUBMIT",
      };

      const createResponse = await ratingBillingHttpService.createData(
        createUrl,
        requestBody
      );

      if (!createResponse.success) {
        throw new Error(createResponse.message || "Gagal membuat E-Faktur");
      }

      const efakturResult = createResponse.data;
      const einvoiceId = efakturResult.einvoiceId;

      if (!einvoiceId) {
        throw new Error("einvoiceId tidak ditemukan di response");
      }

      const uploadResults = [];

      if (attachments && attachments.length > 0) {
        for (let i = 0; i < attachments.length; i++) {
          const attachment = attachments[i];

          try {
            if (!attachment.file) {
              throw new Error(`File tidak ditemukan untuk attachment ${i + 1}`);
            }
            if (!attachment.fileCategoryId) {
              throw new Error(
                `Category tidak dipilih untuk attachment ${i + 1}`
              );
            }

            const formData = new FormData();
            formData.append("file", attachment.file);
            formData.append("refId", einvoiceId);
            formData.append("categoryId", attachment.fileCategoryId);

            const uploadUrl = "/v1/dbs/api/rbi/e-invoice/upload-attachment";
            const uploadResponse =
              await ratingBillingHttpService.uploadAttachment(
                uploadUrl,
                formData,
                (progressPercent) => {
                  const baseProgress = 70;
                  const uploadProgress =
                    (30 / attachments.length) * (i + progressPercent / 100);
                  const totalProgress = baseProgress + uploadProgress;

                  thunkAPI.dispatch(
                    updateUploadProgress(Math.min(totalProgress, 100))
                  );
                }
              );

            uploadResults.push({
              index: i + 1,
              fileName: attachment.file.name,
              success: true,
              message: uploadResponse?.message || "Success",
            });
          } catch (uploadError) {
            uploadResults.push({
              index: i + 1,
              fileName: attachment.file.name,
              success: false,
              error:
                uploadError?.response?.data?.message ||
                uploadError?.message ||
                "Upload failed",
            });
          }
        }
      }

      const failedUploads = uploadResults.filter((r) => !r.success);
      const successUploads = uploadResults.filter((r) => r.success);

      let successMessage = createResponse.message || "E-Faktur berhasil dibuat";

      if (uploadResults.length > 0) {
        if (failedUploads.length === 0) {
          successMessage += ` dengan ${successUploads.length} attachment.`;
        } else if (successUploads.length > 0) {
          successMessage += `. ${successUploads.length} attachment berhasil, ${failedUploads.length} gagal.`;
        } else {
          successMessage += `, namun semua attachment gagal diupload.`;
        }
      }

      const successBody = {
        title: "Success",
        description: successMessage,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));

      return {
        efaktur: efakturResult,
        uploadResults: uploadResults,
        summary: {
          totalAttachments: uploadResults.length,
          successCount: successUploads.length,
          failedCount: failedUploads.length,
        },
      };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();

      const errorBody = {
        title: "Failed",
        description: `Gagal generate E-Faktur: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue({
        message: message,
        error: error?.response?.data || error,
      });
    }
  }
);

export const approvedEfaktur = createAsyncThunk(
  "EFAKTUR/APPROVE_EFAKTUR",
  async ({ body, action: actionType }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/e-invoice/approval`;

      const requestBody = {
        detailApproves: [
          {
            approvalId: body.approvalId,
            efakturId: body.efakturId,
          },
        ],
        action: body.action,
        description: body.description || "",
      };

      const response = await ratingBillingHttpService.createData(
        url,
        requestBody
      );

      if (response.success) {
        const successBody = {
          title: "Success",
          description: response.message || `E-Faktur berhasil di-${actionType}`,
          return: false,
        };
        thunkAPI.dispatch(showModalSuccess(successBody));

        return {
          billingCode: body.billingCode,
          efakturId: body.efakturId,
          action: body.action,
        };
      } else {
        throw new Error(response.message || `Gagal ${actionType} E-Faktur`);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();

      if (
        !error?.response ||
        Math.floor((error?.response?.data?.code || 0) / 100) !== 5
      ) {
        const errorBody = {
          title: "Failed",
          description: `Gagal ${actionType} E-Faktur: ${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }

      return thunkAPI.rejectWithValue({
        message: message,
        billingCode: body.billingCode,
        efakturId: body.efakturId,
      });
    }
  }
);

export const generateXMLEFaktur = createAsyncThunk(
  "EFAKTUR/GENERATE_XML",
  async (efakturId, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/e-invoice/generate-xml";
      const requestBody = { efakturId };

      const response = await ratingBillingHttpService.createData(
        url,
        requestBody
      );

      const successBody = {
        title: "Success",
        description: "XML E-Faktur berhasil di-generate",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));

      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();

      const errorBody = {
        title: "Failed",
        description: `Gagal generate XML: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const uploadManualEFaktur = createAsyncThunk(
  "EFAKTUR/UPLOAD_MANUAL",
  async ({ efakturId, efakturFile, efakturDate, efakturNo }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("efakturFile", efakturFile);
      formData.append("efakturDate", efakturDate);
      formData.append("efakturNo", efakturNo);

      const url = `/v1/dbs/api/rbi/e-invoice/manual-upload/${efakturId}`;

      const response = await ratingBillingHttpService.uploadAttachment(
        url,
        formData,
        () => {}
      );

      const successBody = {
        title: "Success",
        description: response.message || "E-Faktur manual berhasil diupload",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));

      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();

      const errorBody = {
        title: "Failed",
        description: `Gagal upload manual E-Faktur: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const downloadEFakturList = createAsyncThunk(
  "EFAKTUR/DOWNLOAD_LIST",
  async ({ filters, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = [];
      if (filters?.search) searchParams.push(filters.search);
      if (filters?.efakturStatus)
        searchParams.push(`efakturStatus~${filters.efakturStatus}`);
      if (filters?.invoiceNumber)
        searchParams.push(`invoiceNumber~${filters.invoiceNumber}`);

      const sortParams = sort || "invoiceDate~desc";
      const searchParam = searchParams.length > 0 ? searchParams.join(",") : "";
      const url = `/v1/dbs/api/rbi/e-invoice/download?page=${
        page - 1
      }&size=${pageSize}&sort=${sortParams}${
        searchParam ? `&search=${searchParam}` : ""
      }`;

      const response = await ratingBillingHttpService.downloadDataPrabill(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();

      const errorBody = {
        title: "Failed",
        description: `Download gagal: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getApprovalHistory = createAsyncThunk(
  "EFAKTUR/GET_APPROVAL_HISTORY",
  async (efakturId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/e-invoice/approval-history/${efakturId}`;

      const response = await ratingBillingHttpService.getDetail(url);

      return response.data || { dataHistory: {}, dataApprover: {} };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();

      if (error?.response?.status === 404) {
        return { dataHistory: {}, dataApprover: {} };
      }

      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Gagal mengambil approval history: ${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

const efakturSlice = createSlice({
  name: "efaktur",
  initialState,
  reducers: {
    resetEFakturState: (state) => {
      state.list_log_aktivitas = [];
      state.data_billingItem = [];
      state.upload_progress = 0;
      state.upload_results = [];
      state.detail_efaktur = null;
      state.log_activity = [];
    },
    clearBillingItems: (state) => {
      state.data_billingItem = [];
    },
    updateUploadProgress: (state, action) => {
      state.upload_progress = action.payload;
    },
    resetUploadProgress: (state) => {
      state.upload_progress = 0;
      state.upload_results = [];
    },
  },
  extraReducers: {
    [getListApprovedBilling.pending]: (state) => {
      state.loading = true;
    },
    [getListApprovedBilling.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_approved_billing = action.payload.result || [];
      state.pagination = action.payload.page || {
        totalElements: 0,
        totalPages: 0,
        size: 10,
        number: 0,
      };
    },
    [getListApprovedBilling.rejected]: (state) => {
      state.loading = false;
      state.list_approved_billing = [];
    },

    [getAllBillingItemPaginate.pending]: (state) => {
      state.loading_detail = true;
      state.data_billingItem = [];
    },
    [getAllBillingItemPaginate.fulfilled]: (state, action) => {
      state.loading_detail = false;
      state.data_billingItem = action.payload;
    },
    [getAllBillingItemPaginate.rejected]: (state) => {
      state.loading_detail = false;
      state.data_billingItem = [];
    },

    [getListCategory.pending]: (state) => {
      state.loading = true;
    },
    [getListCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListCategory = action.payload || [];
    },
    [getListCategory.rejected]: (state) => {
      state.loading = false;
      state.dataListCategory = [];
    },

    [getAllApprovalList.pending]: (state) => {
      state.loading = true;
    },
    [getAllApprovalList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_approval = action.payload || [];
    },
    [getAllApprovalList.rejected]: (state) => {
      state.loading = false;
      state.data_approval = [];
    },

    [getListApprovalById.pending]: (state) => {
      state.loading = true;
    },
    [getListApprovalById.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_approval_list = action.payload || [];
    },
    [getListApprovalById.rejected]: (state) => {
      state.loading = false;
      state.data_approval_list = [];
    },

    [getDetailEFaktur.pending]: (state) => {
      state.loading_detail = true;
    },
    [getDetailEFaktur.fulfilled]: (state, action) => {
      state.loading_detail = false;
      state.detail_efaktur = action.payload;
    },
    [getDetailEFaktur.rejected]: (state) => {
      state.loading_detail = false;
      state.detail_efaktur = null;
    },

    [getLogActivity.pending]: (state) => {
      state.loading_log = true;
    },
    [getLogActivity.fulfilled]: (state, action) => {
      state.loading_log = false;
      state.log_activity = action.payload.result || [];
      state.pagination_log = action.payload.page || {
        size: 10,
        totalElements: 0,
        totalPages: 0,
        number: 0,
      };
    },
    [getLogActivity.rejected]: (state) => {
      state.loading_log = false;
      state.log_activity = [];
      state.pagination_log = {
        size: 10,
        totalElements: 0,
        totalPages: 0,
        number: 0,
      };
    },

    [generateEFakturWithAttachments.pending]: (state) => {
      state.loading_modal = true;
      state.upload_progress = 0;
      state.upload_results = [];
    },
    [generateEFakturWithAttachments.fulfilled]: (state, action) => {
      state.loading_modal = false;
      state.upload_progress = 100;
      state.upload_results = action.payload.uploadResults || [];

      const efakturResult = action.payload.efaktur;
      state.list_approved_billing = state.list_approved_billing.map((item) =>
        item.billingCode === efakturResult.billingCode
          ? {
              ...item,
              efakturId: efakturResult.einvoiceId,
              efakturStatus: efakturResult.status,
              invoiceNumber: efakturResult.invoiceNumber,
            }
          : item
      );
    },
    [generateEFakturWithAttachments.rejected]: (state) => {
      state.loading_modal = false;
      state.upload_progress = 0;
    },

    [uploadAttachment.pending]: (state) => {
      state.loading_modal = true;
    },
    [uploadAttachment.fulfilled]: (state, action) => {
      state.loading_modal = false;
      state.upload_results.push(action.payload);
    },
    [uploadAttachment.rejected]: (state, action) => {
      state.loading_modal = false;
      state.upload_results.push(action.payload);
    },

    [approvedEfaktur.pending]: (state) => {
      state.loading_modal = true;
    },
    [approvedEfaktur.fulfilled]: (state, action) => {
      state.loading_modal = false;

      state.list_approved_billing = state.list_approved_billing.map((item) =>
        item.efakturId === action.payload.efakturId
          ? {
              ...item,
              efakturStatus:
                action.payload.action === "APPROVE" ? "APPROVED" : "REJECTED",
            }
          : item
      );
    },
    [approvedEfaktur.rejected]: (state) => {
      state.loading_modal = false;
    },

    [generateXMLEFaktur.pending]: (state) => {
      state.loading_modal = true;
    },
    [generateXMLEFaktur.fulfilled]: (state) => {
      state.loading_modal = false;
    },
    [generateXMLEFaktur.rejected]: (state) => {
      state.loading_modal = false;
    },

    [uploadManualEFaktur.pending]: (state) => {
      state.loading_modal = true;
    },
    [uploadManualEFaktur.fulfilled]: (state) => {
      state.loading_modal = false;
    },
    [uploadManualEFaktur.rejected]: (state) => {
      state.loading_modal = false;
    },

    [getApprovalHistory.pending]: (state) => {
      state.loading_approval_history = true;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.loading_approval_history = false;
      state.data_approval_history = action.payload;
    },
    [getApprovalHistory.rejected]: (state) => {
      state.loading_approval_history = false;
      state.data_approval_history = {
        dataHistory: {},
        dataApprover: {},
      };
    },

    [downloadEFakturList.pending]: (state) => {
      state.loading = true;
    },
    [downloadEFakturList.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadEFakturList.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export const {
  resetEFakturState,
  clearBillingItems,
  updateUploadProgress,
  resetUploadProgress,
} = efakturSlice.actions;

export default efakturSlice.reducer;
