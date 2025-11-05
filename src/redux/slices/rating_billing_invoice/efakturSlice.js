import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import {
  showModalSuccess,
  setBodyError,
  showModalError,
} from "../general_slice";

const CUSTOM_BASE_URL = process.env.REACT_APP_BASE_URL_NGROK;

// ==================== INITIAL STATE ====================
const initialState = {
  list_approved_billing: [],
  loading: false,
  loading_modal: false,
  loading_detail: false,
  dataListCategory: [],
  data_approval: [],
  data_approval_list: [],
  data_billingItem: [],
  
  upload_progress: 0,
  upload_results: [],
  
  pagination: {
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
  },
  list_log_aktivitas: [],
  loading_log: false,
};

// ==================== ASYNC THUNKS ====================

export const getAllApprovalList = createAsyncThunk(
  "GET_ALL_APPROVAL_LIST",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/e-invoice/approval-hierarchy-list";
      const response = await ratingBillingHttpService.getAll(url, CUSTOM_BASE_URL);
      return response.data;
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
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing/approval-hierarchy-detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
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
      return error;
    }
  }
);

export const getListApprovedBilling = createAsyncThunk(
  "EFAKTUR/GET_LIST_APPROVED_BILLING",
  async ({ page, pageSize, sort, filters }, thunkAPI) => {
    try {
      const searchParams = [];
      if (filters?.search) searchParams.push(filters.search);
      if (filters?.eFakturStatus) searchParams.push(`efakturStatus:${filters.eFakturStatus}`);
      if (filters?.startDate && filters?.endDate) {
        searchParams.push(`invoiceDate>=${filters.startDate}`);
        searchParams.push(`invoiceDate<=${filters.endDate}`);
      }

      const sortParams = sort || "invoiceDate~desc";
      const searchsParam = searchParams.length > 0 ? searchParams.join(",") : "";
      const url = `/v1/dbs/api/rbi/e-invoice?sort=${sortParams}&size=${pageSize}&page=${page - 1}&searchs=${searchsParam}`;

      // ✅ ADD: Pass CUSTOM_BASE_URL
      const response = await ratingBillingHttpService.getPagination(url, CUSTOM_BASE_URL);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = { title: "Failed", description: `${message}` };
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
      // ✅ ADD: Pass CUSTOM_BASE_URL
      const response = await ratingBillingHttpService.getPagination(url, CUSTOM_BASE_URL);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
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
      // ✅ ADD: Pass CUSTOM_BASE_URL
      const response = await ratingBillingHttpService.getAll(url, CUSTOM_BASE_URL);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = { title: "Failed", description: `${message}` };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const generateEFakturWithAttachments = createAsyncThunk(
  "EFAKTUR/GENERATE_WITH_ATTACHMENTS",
  async ({ efakturData, attachments }, thunkAPI) => {
    try {
      console.log("📤 Starting E-Faktur generation with attachments...");

      const createUrl = "/v1/dbs/api/rbi/e-invoice/create-or-update";
      const requestBody = {
        apphierId: String(efakturData.apphierId),
        billingCode: efakturData.billingCode,
        invoiceNumber: efakturData.invoiceNumber,
        invoiceDate: efakturData.invoiceDate,
        invoiceDueDate: efakturData.invoiceDueDate,
        dpp: Number(efakturData.dpp),
        ppn: Number(efakturData.ppn),
        totalAmount: Number(efakturData.totalAmount),
        remark: efakturData.remark || "",
        status: efakturData.status || "SUBMIT",
      };

      console.log("📤 Request Body E-Faktur:", requestBody);

      // ✅ ADD: Pass CUSTOM_BASE_URL
      const createResponse = await ratingBillingHttpService.createData(
        createUrl,
        requestBody,
        CUSTOM_BASE_URL
      );

      console.log("📥 Response E-Faktur:", createResponse);

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
        console.log(`📎 Uploading ${attachments.length} attachment(s)...`);

        for (let i = 0; i < attachments.length; i++) {
          const attachment = attachments[i];

          try {
            if (!attachment.file) {
              throw new Error(`File tidak ditemukan untuk attachment ${i + 1}`);
            }
            if (!attachment.fileCategoryId) {
              throw new Error(`Category tidak dipilih untuk attachment ${i + 1}`);
            }

            const formData = new FormData();
            formData.append("file", attachment.file);
            formData.append("refId", einvoiceId);
            formData.append("categoryId", attachment.fileCategoryId);

            console.log(`📤 Uploading attachment ${i + 1}/${attachments.length}:`, {
              fileName: attachment.file.name,
              refId: einvoiceId,
              categoryId: attachment.fileCategoryId,
            });

            const uploadUrl = "/v1/dbs/api/rbi/e-invoice/upload-attachment";
            // ✅ Note: uploadAttachment already handles customBaseUrl internally
            const uploadResponse = await ratingBillingHttpService.uploadAttachment(
              uploadUrl,
              formData,
              (progressPercent) => {
                const baseProgress = 70;
                const uploadProgress = (30 / attachments.length) * (i + (progressPercent / 100));
                const totalProgress = baseProgress + uploadProgress;
                
                thunkAPI.dispatch(
                  updateUploadProgress(Math.min(totalProgress, 100))
                );
              }
            );

            console.log(`✅ Attachment ${i + 1} uploaded:`, uploadResponse);

            uploadResults.push({
              index: i + 1,
              fileName: attachment.file.name,
              success: true,
              message: uploadResponse?.message || "Success",
            });

          } catch (uploadError) {
            console.error(`❌ Error uploading attachment ${i + 1}:`, uploadError);

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
      console.error("❌ Error in generateEFakturWithAttachments:", error);

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

// ✅ UPDATED: Approve/Reject E-Faktur dengan ngrok support
export const approvedEfaktur = createAsyncThunk(
  "EFAKTUR/APPROVE_EFAKTUR",
  async ({ body, action: actionType }, thunkAPI) => {
    try {
      // Endpoint baru tanpa ID di URL
      const url = `/v1/dbs/api/rbi/e-invoice/approval`;
      
      // Request body format baru dengan detailApproves array
      const requestBody = {
        detailApproves: [
          {
            approvalId: body.approvalId, // tappId dari list efaktur
            billingCode: body.billingCode,
            invoiceNumber: body.invoiceNumber,
          }
        ],
        action: body.action, // "APPROVE" atau "REJECT"
        description: body.description || "",
      };

      console.log("📤 Approval Request:", requestBody);

      // ✅ ADD: Pass CUSTOM_BASE_URL
      const response = await ratingBillingHttpService.createData(
        url, 
        requestBody,
        CUSTOM_BASE_URL
      );

      console.log("📥 Approval Response:", response);

      if (response.success) {
        const successBody = {
          title: "Success",
          description: response.message || `E-Faktur berhasil di-${actionType}`,
          return: false,
        };
        thunkAPI.dispatch(showModalSuccess(successBody));
        
        // Return data yang dibutuhkan untuk update state
        return {
          billingCode: body.billingCode,
          action: body.action,
          invoiceNumber: body.invoiceNumber,
        };
      } else {
        throw new Error(response.message || `Gagal ${actionType} E-Faktur`);
      }
    } catch (error) {
      const message = 
        error?.response?.data?.message || 
        error?.message || 
        error?.toString();
      
      const errorBody = {
        title: "Failed",
        description: `Gagal ${actionType} E-Faktur: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      
      return thunkAPI.rejectWithValue({
        message: message,
        billingCode: body.billingCode,
      });
    }
  }
);

// ✅ ADD: Download E-Faktur List (with ngrok support)
export const downloadEFakturList = createAsyncThunk(
  "EFAKTUR/DOWNLOAD_LIST",
  async ({ filters, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = [];
      if (filters?.search) searchParams.push(filters.search);
      if (filters?.eFakturStatus) searchParams.push(`efakturStatus:${filters.eFakturStatus}`);
      if (filters?.startDate && filters?.endDate) {
        searchParams.push(`invoiceDate>=${filters.startDate}`);
        searchParams.push(`invoiceDate<=${filters.endDate}`);
      }

      const sortParams = sort || "invoiceDate~desc";
      const searchsParam = searchParams.length > 0 ? searchParams.join(",") : "";
      const url = `/v1/dbs/api/rbi/e-invoice/download?sort=${sortParams}&size=${pageSize}&page=${page - 1}&searchs=${searchsParam}`;

      const response = await ratingBillingHttpService.downloadDataPrabill(
        url,
        CUSTOM_BASE_URL
      );
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

// ✅ ADD: Get Approval History (with ngrok support)
export const getApprovalHistory = createAsyncThunk(
  "EFAKTUR/GET_APPROVAL_HISTORY",
  async (billingCode, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/e-invoice/approval-history/${billingCode}`;
      const response = await ratingBillingHttpService.getDetail(url, CUSTOM_BASE_URL);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      
      console.error("Error fetching approval history:", message);
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// ✅ ADD: Get Billing Items by Code (alias for getAllBillingItemPaginate)
export const getBillingItemsByCode = createAsyncThunk(
  "EFAKTUR/GET_BILLING_ITEMS_BY_CODE",
  async (billingCode, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing/billing-item/${billingCode}?page=0&size=999&sort=lineNumber~asc`;
      const response = await ratingBillingHttpService.getPagination(url, CUSTOM_BASE_URL);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = { title: "Failed", description: `${message}` };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// ==================== SLICE ====================
const efakturSlice = createSlice({
  name: "efaktur",
  initialState,
  reducers: {
    resetEFakturState: (state) => {
      state.list_log_aktivitas = [];
      state.data_billingItem = [];
      state.upload_progress = 0;
      state.upload_results = [];
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
    },
    [getAllBillingItemPaginate.fulfilled]: (state, action) => {
      state.loading_detail = false;
      state.data_billingItem = action.payload;
    },
    [getAllBillingItemPaginate.rejected]: (state) => {
      state.loading_detail = false;
      state.data_billingItem = [];
    },

    // ✅ ADD: getBillingItemsByCode reducers (alias)
    [getBillingItemsByCode.pending]: (state) => {
      state.loading_detail = true;
    },
    [getBillingItemsByCode.fulfilled]: (state, action) => {
      state.loading_detail = false;
      // Store in a separate key to avoid conflict with getAllBillingItemPaginate
      state.billing_items_detail = action.payload;
    },
    [getBillingItemsByCode.rejected]: (state) => {
      state.loading_detail = false;
      state.billing_items_detail = [];
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

    [generateEFakturWithAttachments.pending]: (state) => {
      state.loading_modal = true;
      state.upload_progress = 0;
      state.upload_results = [];
    },
    [generateEFakturWithAttachments.fulfilled]: (state, action) => {
      state.loading_modal = false;
      state.upload_progress = 100;

      const { efaktur, uploadResults, summary } = action.payload;
      state.upload_results = uploadResults;

      state.list_approved_billing = state.list_approved_billing.map((item) =>
        item.billingCode === efaktur.billingCode
          ? {
              ...item,
              eFakturStatus: efaktur.status,
              eFakturNo: efaktur.efakturNo,
              einvoiceId: efaktur.einvoiceId,
              invoiceNumber: efaktur.invoiceNumber,
              eFakturGeneratedAt: efaktur.createdDtm,
              approvalStatus: efaktur.status,
              dpp: efaktur.dpp,
              ppn: efaktur.ppn,
              totalAmount: efaktur.totalAmount,
              attachmentSummary: summary,
            }
          : item
      );
    },
    [generateEFakturWithAttachments.rejected]: (state, action) => {
      state.loading_modal = false;
      state.upload_progress = 0;

      const billingCode = action.meta.arg?.efakturData?.billingCode;
      if (billingCode) {
        state.list_approved_billing = state.list_approved_billing.map((item) =>
          item.billingCode === billingCode
            ? {
                ...item,
                eFakturStatus: "FAILED",
                eFakturError: action.payload?.message || "Generate failed",
              }
            : item
        );
      }
    },

    [approvedEfaktur.pending]: (state) => {
      state.loading_modal = true;
    },
    [approvedEfaktur.fulfilled]: (state, action) => {
      state.loading_modal = false;
      const { billingCode, action: approvalAction } = action.payload;

      state.list_approved_billing = state.list_approved_billing.map((item) =>
        item.billingCode === billingCode
          ? {
              ...item,
              efakturStatus: approvalAction === "APPROVE" ? "APPROVED" : "REJECTED",
              approvalStatus: approvalAction === "APPROVE" ? "APPROVED" : "REJECTED",
            }
          : item
      );
    },
    [approvedEfaktur.rejected]: (state, action) => {
      state.loading_modal = false;
      
      const billingCode = action.payload?.billingCode;
      if (billingCode) {
        state.list_approved_billing = state.list_approved_billing.map((item) =>
          item.billingCode === billingCode
            ? {
                ...item,
                approvalError: action.payload?.message,
              }
            : item
        );
      }
    },

    // ✅ ADD: Download reducers
    [downloadEFakturList.pending]: (state) => {
      state.loading = true;
    },
    [downloadEFakturList.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadEFakturList.rejected]: (state) => {
      state.loading = false;
    },

    // ✅ ADD: Approval History reducers
    [getApprovalHistory.pending]: (state) => {
      state.loading = true;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_approval_history = action.payload;
    },
    [getApprovalHistory.rejected]: (state) => {
      state.loading = false;
      state.data_approval_history = null;
    },

    [getAllApprovalList.pending]: (state) => {
      state.loading = true;
    },
    [getAllApprovalList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_approval = action.payload;
    },
    [getAllApprovalList.rejected]: (state) => {
      state.loading = false;
    },

    [getListApprovalById.pending]: (state) => {
      state.loading = true;
    },
    [getListApprovalById.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_approval_list = action.payload;
    },
    [getListApprovalById.rejected]: (state) => {
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

const { reducer } = efakturSlice;
export default reducer;