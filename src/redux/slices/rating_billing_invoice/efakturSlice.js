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

const buildSearchParams = (filters) => {
  const params = [];

  if (filters?.search) params.push(filters.search);
  if (filters?.efakturStatus)
    params.push(`efakturStatus~${filters.efakturStatus}`);
  if (filters?.invoiceNumber)
    params.push(`invoiceNumber~${filters.invoiceNumber}`);
  if (filters?.billingCode) params.push(`billingCode~${filters.billingCode}`);
  if (filters?.customerName)
    params.push(`customerName~${filters.customerName}`);

  return params.join(",");
};

const handleApiError = (
  error,
  thunkAPI,
  defaultMessage = "Terjadi kesalahan",
) => {
  const message =
    error?.response?.data?.message || error?.message || error?.toString();
  const errorCode = error?.response?.data?.code;

  if (errorCode === 500 || errorCode === 419) {
    thunkAPI.dispatch(setBodyError(error));
  } else {
    const errorBody = {
      title: "Failed",
      description: `${defaultMessage}: ${message}`,
    };
    thunkAPI.dispatch(showModalError(errorBody));
  }

  return thunkAPI.rejectWithValue(error.response?.data);
};

//initial state
const initialState = {
  list_efaktur: [],
  loading: false,
  loading_modal: false,
  loading_detail: false,
  loading_approval_history: false,
  loading_log: false,

  data_available_requested: [],
  loading_available_requested: false,
  error_available_requested: null,
  pagination_available_requested: {
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
  },
  dataListCategory: [],
  data_approval: [],
  data_approval_list: [],
  list_efaktur_approval: [],
  data_billingItem: [],
  detail_efaktur: null,
  log_activity: [],

  data_eligible_efaktur: [],
  loading_eligible: false,
  error_eligible: null,

  data_approval_history: {
    dataHistory: {},
    dataApprover: {},
  },

  loading_sync: false,

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
  dataListProductType: [],
  dataListUOM: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataListFakturType: [],
  dataListTaxPeriod: [],
  dataListCountry: [],
  dataListFakturCode: [],
  dataListTaxYears: [],
  dataListProductCode: [],
  dataDetail: null,
};

// GET - List Operations
export const getListEFaktur = createAsyncThunk(
  "EFAKTUR/GET_LIST_EFAKTUR",
  async (
    { page = 1, pageSize = 10, sort = "invoiceDate~desc", filters = {} },
    thunkAPI,
  ) => {
    try {
      const searchParam = buildSearchParams(filters);
      const url = `/v1/dbs/api/rbi/e-invoice?page=${page}&size=${pageSize}&sort=${sort}${
        searchParam ? `&search=${searchParam}` : ""
      }`;

      const response = await ratingBillingHttpService.getPagination(url);
      return response.data || { result: [], page: {} };
    } catch (error) {
      return handleApiError(error, thunkAPI, "Gagal mengambil list E-Faktur");
    }
  },
);

export const getListCategory = createAsyncThunk(
  "EFAKTUR/GET_LIST_CATEGORY",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/e-invoice/category-list";
      const response = await ratingBillingHttpService.getAll(url);

      return response.data.map((item) => ({
        Id: item.id,
        text: item.name,
      }));
    } catch (error) {
      return handleApiError(error, thunkAPI, "Gagal mengambil list kategori");
    }
  },
);

export const getAllApprovalList = createAsyncThunk(
  "EFAKTUR/GET_ALL_APPROVAL_LIST",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/e-invoice/approval-hierarchy-list";
      const response = await ratingBillingHttpService.getAll(url);

      return Array.isArray(response.data)
        ? response.data
        : response.data?.result || [];
    } catch (error) {
      return handleApiError(error, thunkAPI, "Gagal mengambil approval list");
    }
  },
);

export const getListApprovalById = createAsyncThunk(
  "EFAKTUR/GET_LIST_APPROVAL_BY_ID",
  async (appHierId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/e-invoice/apphier-detail/${appHierId}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data || [];
    } catch (error) {
      return handleApiError(error, thunkAPI, "Gagal mengambil detail approval");
    }
  },
);

export const getAllBillingItemPaginate = createAsyncThunk(
  "EFAKTUR/GET_ALL_BILLING_ITEM_PAGINATE",
  async (billingCode, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing/billing-item/${billingCode}?page=0&size=999&sort=lineNumber~asc`;
      const response = await ratingBillingHttpService.getPagination(url);

      return transformBillingItems(response.data?.result || []);
    } catch (error) {
      return handleApiError(error, thunkAPI, "Gagal mengambil billing items");
    }
  },
);

export const getDetailEFaktur = createAsyncThunk(
  "EFAKTUR/GET_DETAIL",
  async (efakturId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/e-invoice/${efakturId}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data || null;
    } catch (error) {
      if (error?.response?.status === 404) return null;
      return handleApiError(error, thunkAPI, "Gagal mengambil detail E-Faktur");
    }
  },
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
      if (error?.response?.status === 404) {
        return {
          result: [],
          page: { size: 10, totalElements: 0, totalPages: 0, number: 0 },
        };
      }
      return handleApiError(error, thunkAPI, "Gagal mengambil log aktivitas");
    }
  },
);

export const getApprovalHistory = createAsyncThunk(
  "EFAKTUR/GET_APPROVAL_HISTORY",
  async (efakturId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/e-invoice/approval-history/${efakturId}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data || { dataHistory: {}, dataApprover: {} };
    } catch (error) {
      if (error?.response?.status === 404) {
        return { dataHistory: {}, dataApprover: {} };
      }
      return handleApiError(
        error,
        thunkAPI,
        "Gagal mengambil approval history",
      );
    }
  },
);

// ========================================
// GET AVAILABLE REQUESTED LIST
// ========================================
export const getAvailableRequestedList = createAsyncThunk(
  "EFAKTUR/GET_AVAILABLE_REQUESTED_LIST",
  async (
    {
      page = 1,
      pageSize = 10,
      sort = "invoiceDate~desc",
      type = "",
      efakturDateFrom = "",
      efakturDateTo = "",
      search = "",
    },
    thunkAPI,
  ) => {
    try {
      let url = `/v1/dbs/api/rbi/e-invoice/available-requested-list?page=${page}&size=${pageSize}`;

      if (sort) url += `&sort=${sort}`;
      if (type) url += `&type=${type}`;
      if (efakturDateFrom) url += `&efakturDateFrom=${efakturDateFrom}`;
      if (efakturDateTo) url += `&efakturDateTo=${efakturDateTo}`;
      if (search) url += `&search=${search}`;

      const response = await ratingBillingHttpService.getPagination(url);
      return response.data || { result: [], page: {} };
    } catch (error) {
      return handleApiError(
        error,
        thunkAPI,
        "Gagal mengambil list E-Faktur available for request",
      );
    }
  },
);

// ========================================
// CREATE REQUEST APPROVAL E-FAKTUR
// ========================================
export const createRequestApprovalEFaktur = createAsyncThunk(
  "EFAKTUR/CREATE_REQUEST_APPROVAL",
  async ({ apphierId, efakturIds, remark }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/e-invoice/create";
      const requestBody = {
        apphierId: String(apphierId),
        efakturIds: efakturIds.map((id) => String(id)),
        remark: remark || "",
      };

      const response = await ratingBillingHttpService.createData(
        url,
        requestBody,
      );

      if (response.success) {
        thunkAPI.dispatch(
          showModalSuccess({
            title: "Success",
            description: response.message || "Request approval berhasil dibuat",
            return: false,
          }),
        );

        return {
          efakturIds,
          apphierId,
          remark,
          type: "normal",
        };
      } else {
        throw new Error(response.message || "Gagal membuat request approval");
      }
    } catch (error) {
      return handleApiError(
        error,
        thunkAPI,
        "Gagal membuat request approval E-Faktur",
      );
    }
  },
);

// ========================================
// CREATE REQUEST REPLACEMENT E-FAKTUR
// ========================================
export const createRequestReplacementEFaktur = createAsyncThunk(
  "EFAKTUR/CREATE_REQUEST_REPLACEMENT",
  async ({ apphierId, efakturIds, reason }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/e-invoice/replacement";
      const requestBody = {
        apphierId: String(apphierId),
        efakturIds: efakturIds.map((id) => String(id)),
        reason: reason || "",
      };

      const response = await ratingBillingHttpService.createData(
        url,
        requestBody,
      );

      if (response.success) {
        thunkAPI.dispatch(
          showModalSuccess({
            title: "Success",
            description:
              response.message ||
              "Success request replacement faktur, please wait for approval",
            return: false,
          }),
        );

        return {
          efakturIds,
          apphierId,
          reason,
          type: "replacement",
        };
      } else {
        throw new Error(
          response.message || "Gagal membuat request replacement",
        );
      }
    } catch (error) {
      return handleApiError(
        error,
        thunkAPI,
        "Gagal membuat request replacement E-Faktur",
      );
    }
  },
);

// ========================================
// CREATE REQUEST CANCELLATION E-FAKTUR
// ========================================
export const createRequestCancellationEFaktur = createAsyncThunk(
  "EFAKTUR/CREATE_REQUEST_CANCELLATION",
  async ({ apphierId, efakturIds, reason }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/e-invoice/cancellation";
      const requestBody = {
        apphierId: String(apphierId),
        efakturIds: efakturIds.map((id) => String(id)),
        reason: reason || "",
      };

      const response = await ratingBillingHttpService.createData(
        url,
        requestBody,
      );

      if (response.success) {
        thunkAPI.dispatch(
          showModalSuccess({
            title: "Success",
            description:
              response.message || "Success submit request cancellation efaktur",
            return: false,
          }),
        );

        return {
          efakturIds,
          apphierId,
          reason,
          type: "cancellation",
        };
      } else {
        throw new Error(
          response.message || "Gagal membuat request cancellation",
        );
      }
    } catch (error) {
      return handleApiError(
        error,
        thunkAPI,
        "Gagal membuat request cancellation E-Faktur",
      );
    }
  },
);

// POST - Create/Update Operations
export const generateEFakturWithAttachments = createAsyncThunk(
  "EFAKTUR/GENERATE_WITH_ATTACHMENTS",
  async ({ efakturData, attachments = [] }, thunkAPI) => {
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
        requestBody,
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
      const newAttachments = attachments.filter(
        (item) => item.dataType !== "exist",
      );

      if (newAttachments.length > 0) {
        for (let i = 0; i < newAttachments.length; i++) {
          const attachment = newAttachments[i];

          try {
            if (!attachment.file) {
              throw new Error(`File tidak ditemukan untuk attachment ${i + 1}`);
            }
            if (!attachment.fileCategoryId) {
              throw new Error(
                `Category tidak dipilih untuk attachment ${i + 1}`,
              );
            }

            const formData = new FormData();
            formData.append("files", attachment.file);
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
                    (30 / newAttachments.length) * (i + progressPercent / 100);
                  thunkAPI.dispatch(
                    updateUploadProgress(
                      Math.min(baseProgress + uploadProgress, 100),
                    ),
                  );
                },
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
              fileName: attachment.file?.name || "Unknown file",
              success: false,
              error:
                uploadError?.response?.data?.message ||
                uploadError?.message ||
                "Upload failed",
            });
          }
        }
      }

      // Step 3: Build success message
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

      thunkAPI.dispatch(
        showModalSuccess({
          title: "Success",
          description: successMessage,
          return: false,
        }),
      );

      return {
        efaktur: efakturResult,
        uploadResults,
        summary: {
          totalAttachments: uploadResults.length,
          successCount: successUploads.length,
          failedCount: failedUploads.length,
        },
      };
    } catch (error) {
      return handleApiError(error, thunkAPI, "Gagal generate E-Faktur");
    }
  },
);

export const uploadAttachment = createAsyncThunk(
  "EFAKTUR/UPLOAD_ATTACHMENT",
  async ({ einvoiceId, file, categoryId, onProgress }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("refId", einvoiceId);
      formData.append("categoryId", categoryId);

      const url = "/v1/dbs/api/rbi/e-invoice/upload-attachment";
      const response = await ratingBillingHttpService.uploadAttachment(
        url,
        formData,
        onProgress || (() => {}),
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
  },
);

export const getAllEFakturApprovePaginate = createAsyncThunk(
  "EFAKTUR/GET_ALL_EFAKTUR_APPROVE_PAGINATE",
  async ({ type = "normal" } = {}, thunkAPI) => {
    // ✅ Add type parameter
    try {
      // ✅ Add type query parameter
      const url = `/v1/dbs/api/rbi/e-invoice/approval-efaktur-list?type=${type}`;
      const response = await ratingBillingHttpService.getAll(url);

      // ✅ Fix: Backend returns array in data directly, not in data.result
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return handleApiError(
        error,
        thunkAPI,
        "Gagal mengambil list E-Faktur approval",
      );
    }
  },
);

export const approvedEfaktur = createAsyncThunk(
  "EFAKTUR/APPROVE_EFAKTUR",
  async ({ body, action: actionType }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/e-invoice/approval`;

      // ✅ Fix: Match exact API request structure
      const requestBody = {
        detailApproves: body.detailApproves.map((item) => ({
          approvalId: String(item.approvalId), // ✅ Ensure string
          efakturId: String(item.efakturId), // ✅ Ensure string
        })),
        action: body.action, // APPROVE or REJECT
        type: body.type.toLowerCase(), // ✅ Add type: normal, replacement, cancellation, manual_upload
        description: body.description || "",
      };

      const response = await ratingBillingHttpService.createData(
        url,
        requestBody,
      );

      if (response.success) {
        thunkAPI.dispatch(
          showModalSuccess({
            title: "Success",
            description:
              response.message || `E-Faktur berhasil di-${actionType}`,
            return: false,
          }),
        );

        return {
          action: body.action,
          type: body.type, // ✅ Return type for state update
          detailApproves: body.detailApproves,
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
        thunkAPI.dispatch(
          showModalError({
            title: "Failed",
            description: `Gagal ${actionType} E-Faktur: ${message}`,
          }),
        );
      }

      return thunkAPI.rejectWithValue({
        message,
        detailApproves: body.detailApproves,
      });
    }
  },
);

export const cancelEFaktur = createAsyncThunk(
  "EFAKTUR/CANCEL_EFAKTUR",
  async ({ efakturId, reason, appHierId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/e-invoice/${efakturId}/cancellation`;
      const requestBody = {
        reason,
        appHierId: 620,
      };

      const response = await ratingBillingHttpService.createData(
        url,
        requestBody,
      );

      if (response.success) {
        thunkAPI.dispatch(
          showModalSuccess({
            title: "Success",
            description: response.message || "E-Faktur berhasil dibatalkan",
            return: false,
          }),
        );

        return { efakturId };
      } else {
        throw new Error(response.message || "Gagal membatalkan E-Faktur");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();

      let errorMessage = message;
      if (message.toLowerCase().includes("already cancelled")) {
        errorMessage = "E-Faktur sudah dibatalkan sebelumnya";
      } else if (error?.response?.status === 500) {
        errorMessage =
          "Terjadi kesalahan pada server PJAP. Silakan coba lagi nanti.";
      }

      thunkAPI.dispatch(
        showModalError({
          title: "Failed",
          description: `Gagal membatalkan E-Faktur: ${errorMessage}`,
        }),
      );

      return thunkAPI.rejectWithValue({ message: errorMessage, efakturId });
    }
  },
);

export const replaceEFaktur = createAsyncThunk(
  "EFAKTUR/REPLACE_EFAKTUR",
  async ({ efakturId, reason, appHierId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/e-invoice/replacement`;
      const requestBody = {
        efakturId: String(efakturId),
        reason,
        appHierId: 620,
      };

      const response = await ratingBillingHttpService.createData(
        url,
        requestBody,
      );

      if (response.success) {
        thunkAPI.dispatch(
          showModalSuccess({
            title: "Success",
            description:
              response.message ||
              "Faktur pengganti berhasil dibuat, silakan tunggu proses selesai",
            return: false,
          }),
        );

        return { efakturId };
      } else {
        throw new Error(response.message || "Gagal membuat faktur pengganti");
      }
    } catch (error) {
      return handleApiError(error, thunkAPI, "Gagal membuat faktur pengganti");
    }
  },
);

export const generateXMLEFaktur = createAsyncThunk(
  "EFAKTUR/GENERATE_BULK_XML",
  async ({ efakturIds }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/e-invoice/generate-xml";
      const requestBody = {
        efakturIds: efakturIds.map((id) => String(id)),
      };

      const response = await ratingBillingHttpService.createData(
        url,
        requestBody,
      );

      // Extract XML content from response
      let xmlContent = "";

      if (typeof response === "string") {
        xmlContent = response;
      } else if (response?.data) {
        xmlContent =
          typeof response.data === "string"
            ? response.data
            : response.data?.xml || response.data || "";
      }

      // Validate XML
      const trimmedXml = xmlContent.trim();
      if (!trimmedXml || !trimmedXml.startsWith("<")) {
        throw new Error("Invalid XML format received from backend");
      }

      return {
        xmlContent,
        efakturIds,
        count: efakturIds.length,
      };
    } catch (error) {
      return handleApiError(error, thunkAPI, "Gagal generate bulk XML");
    }
  },
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
        () => {},
      );

      thunkAPI.dispatch(
        showModalSuccess({
          title: "Success",
          description: response.message || "E-Faktur manual berhasil diupload",
          return: false,
        }),
      );

      return response.data;
    } catch (error) {
      return handleApiError(error, thunkAPI, "Gagal upload manual E-Faktur");
    }
  },
);

export const downloadEFakturList = createAsyncThunk(
  "EFAKTUR/DOWNLOAD_LIST",
  async (
    { filters = {}, page = 1, pageSize = 10, sort = "invoiceDate~desc" },
    thunkAPI,
  ) => {
    try {
      const searchParam = buildSearchParams(filters);
      const url = `/v1/dbs/api/rbi/e-invoice/download?page=${
        page - 1
      }&size=${pageSize}&sort=${sort}${
        searchParam ? `&search=${searchParam}` : ""
      }`;

      const response = await ratingBillingHttpService.downloadDataPrabill(url);
      return response.data;
    } catch (error) {
      return handleApiError(error, thunkAPI, "Download gagal");
    }
  },
);

export const batchManualUploadEFaktur = createAsyncThunk(
  "EFAKTUR/BATCH_MANUAL_UPLOAD",
  async ({ apphierId, remark, dataItems }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("apphierId", String(apphierId));
      formData.append("remark", remark);

      // Append data array
      dataItems.forEach((item, index) => {
        formData.append(`data[${index}].efakturId`, String(item.efakturId));
        formData.append(`data[${index}].efakturNumber`, item.efakturNumber);
        formData.append(`data[${index}].efakturFile`, item.efakturFile);
      });

      const url = "/v1/dbs/api/rbi/e-invoice/batch-manual-upload";
      const response = await ratingBillingHttpService.uploadAttachment(
        url,
        formData,
        () => {},
      );

      if (response.success) {
        thunkAPI.dispatch(
          showModalSuccess({
            title: "Success",
            description: response.message || "All items uploaded successfully",
            return: false,
          }),
        );

        return {
          success: response.data?.success || [],
          errors: response.data?.errors || [],
          totalUploaded: dataItems.length,
        };
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error) {
      return handleApiError(
        error,
        thunkAPI,
        "Gagal upload manual E-Faktur bulk",
      );
    }
  },
);

/**
 * Get Eligible E-Faktur for Bulk Request Approval
 */
export const getEligibleEFakturForRequest = createAsyncThunk(
  "EFAKTUR/GET_ELIGIBLE_FOR_REQUEST",
  async (
    { page = 1, pageSize = 10, sort = "invoiceDate~desc", filters = {} },
    thunkAPI,
  ) => {
    try {
      const searchParam = buildSearchParams(filters);
      const url = `/v1/dbs/api/rbi/e-invoice/eligible-for-request?page=${page}&size=${pageSize}&sort=${sort}${
        searchParam ? `&search=${searchParam}` : ""
      }`;

      const response = await ratingBillingHttpService.getPagination(url);
      return response.data || { result: [], page: {} };
    } catch (error) {
      return handleApiError(
        error,
        thunkAPI,
        "Gagal mengambil list E-Faktur eligible",
      );
    }
  },
);

/**
 * Bulk Request Approval E-Faktur with Attachments
 */
export const bulkRequestApprovalEFaktur = createAsyncThunk(
  "EFAKTUR/BULK_REQUEST_APPROVAL",
  async ({ requestData, attachments = [] }, thunkAPI) => {
    try {
      // Step 1: Submit bulk request approval
      thunkAPI.dispatch(updateUploadProgress(30));

      const url = "/v1/dbs/api/rbi/e-invoice/bulk-request-approval";
      const requestBody = {
        efakturIds: requestData.efakturIds,
        apphierId: String(requestData.apphierId),
        remark: requestData.remark || "",
      };

      const response = await ratingBillingHttpService.createData(
        url,
        requestBody,
      );

      if (!response.success) {
        throw new Error(
          response.message || "Gagal submit bulk request approval",
        );
      }

      const result = response.data;
      const requestId = result.requestId;

      if (!requestId) {
        throw new Error("requestId tidak ditemukan di response");
      }

      thunkAPI.dispatch(updateUploadProgress(60));

      // Step 2: Upload attachments if any
      const uploadResults = [];
      const newAttachments = attachments.filter(
        (item) => item.dataType !== "exist",
      );

      if (newAttachments.length > 0) {
        const totalFiles = newAttachments.length;

        for (let i = 0; i < newAttachments.length; i++) {
          const attachment = newAttachments[i];

          try {
            if (!attachment.file) {
              throw new Error(`File tidak ditemukan untuk attachment ${i + 1}`);
            }
            if (!attachment.fileCategoryId) {
              throw new Error(
                `Category tidak dipilih untuk attachment ${i + 1}`,
              );
            }

            const formData = new FormData();
            formData.append("files", attachment.file);
            formData.append("refId", requestId);
            formData.append("categoryId", attachment.fileCategoryId);

            const uploadUrl =
              "/v1/dbs/api/rbi/e-invoice/bulk-request/upload-attachment";
            const uploadResponse =
              await ratingBillingHttpService.uploadAttachment(
                uploadUrl,
                formData,
                (progressPercent) => {
                  const baseProgress = 60;
                  const uploadProgress =
                    (40 / totalFiles) * (i + progressPercent / 100);
                  thunkAPI.dispatch(
                    updateUploadProgress(
                      Math.min(baseProgress + uploadProgress, 100),
                    ),
                  );
                },
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
              fileName: attachment.file?.name || "Unknown file",
              success: false,
              error:
                uploadError?.response?.data?.message ||
                uploadError?.message ||
                "Upload failed",
            });
          }

          const progress = 60 + ((i + 1) / totalFiles) * 40;
          thunkAPI.dispatch(updateUploadProgress(Math.floor(progress)));
        }
      }

      thunkAPI.dispatch(updateUploadProgress(100));

      // Step 3: Build success message
      const failedUploads = uploadResults.filter((r) => !r.success);
      const successUploads = uploadResults.filter((r) => r.success);

      let successMessage =
        response.message || "Bulk request approval berhasil disubmit";
      if (uploadResults.length > 0) {
        if (failedUploads.length === 0) {
          successMessage += ` dengan ${successUploads.length} attachment.`;
        } else if (successUploads.length > 0) {
          successMessage += `. ${successUploads.length} attachment berhasil, ${failedUploads.length} gagal.`;
        } else {
          successMessage += `, namun semua attachment gagal diupload.`;
        }
      }

      thunkAPI.dispatch(
        showModalSuccess({
          title: "Success",
          description: successMessage,
          return: false,
        }),
      );

      return {
        ...result,
        uploadResults,
        summary: {
          totalRequested:
            result.totalRequested || requestData.efakturIds.length,
          successCount: result.successCount || 0,
          failedCount: result.failedCount || 0,
          totalAttachments: uploadResults.length,
          attachmentSuccess: successUploads.length,
          attachmentFailed: failedUploads.length,
        },
      };
    } catch (error) {
      thunkAPI.dispatch(updateUploadProgress(0));
      return handleApiError(
        error,
        thunkAPI,
        "Gagal submit bulk request approval",
      );
    }
  },
);

// ========================================
// GET LIST PRODUCT TYPE (DUMMY)
// ========================================
export const getListProductType = createAsyncThunk(
  "EFAKTUR/GET_LIST_PRODUCT_TYPE",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/e-invoice/create/get-product-types";
      const response = await ratingBillingHttpService.getAll(url);

      return response.data || [];
    } catch (error) {
      return handleApiError(
        error,
        thunkAPI,
        "Gagal mengambil list product type",
      );
    }
  },
);

//  get list product code
export const getListProductCode = createAsyncThunk(
  "EFAKTUR/GET_LIST_PRODUCT_CODE",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/e-invoice/create/get-product-codes";
      const response = await ratingBillingHttpService.getAll(url);

      return response.data || [];
    } catch (error) {
      return handleApiError(
        error,
        thunkAPI,
        "Gagal mengambil list product code",
      );
    }
  },
);

// ========================================
// GET LIST UOM (DUMMY)
// ========================================
export const getListUOM = createAsyncThunk(
  "EFAKTUR/GET_LIST_UOM",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/e-invoice/create/get-uom-codes";
      const response = await ratingBillingHttpService.getAll(url);

      return response.data || [];
    } catch (error) {
      return handleApiError(error, thunkAPI, "Gagal mengambil list UOM");
    }
  },
);

// ========================================
// GET LIST APPROVAL HIERARCHY (DUMMY)
// ========================================
// export const getListApprovalHierarchy = createAsyncThunk(
//   "EFAKTUR/GET_LIST_APPROVAL_HIERARCHY",
//   async (_, thunkAPI) => {
//     try {
//       // TODO: Ganti dengan API call yang sebenarnya
//       // const url = "/v1/dbs/api/rbi/e-invoice/approval-hierarchy-list";
//       // const response = await ratingBillingHttpService.getAll(url);

//       // Data dummy
//       const dummyData = [
//         { appHierId: 1, approvalName: "Standard Approval" },
//         { appHierId: 2, approvalName: "Express Approval" },
//         { appHierId: 3, approvalName: "Special Approval" },
//       ];

//       return dummyData;
//     } catch (error) {
//       return handleApiError(
//         error,
//         thunkAPI,
//         "Gagal mengambil list approval hierarchy",
//       );
//     }
//   },
// );

// ========================================
// GET LIST APPROVAL HIERARCHY DETAIL (DUMMY)
// ========================================
// export const getListApprovalHierarchyDetail = createAsyncThunk(
//   "EFAKTUR/GET_LIST_APPROVAL_HIERARCHY_DETAIL",
//   async ({ id }, thunkAPI) => {
//     try {
//       // TODO: Ganti dengan API call yang sebenarnya
//       // const url = `/v1/dbs/api/rbi/e-invoice/approval-hierarchy-detail/${id}`;
//       // const response = await ratingBillingHttpService.getDetail(url);

//       // Data dummy
//       const dummyData = [
//         {
//           level: 1,
//           approvalName: "Supervisor",
//           employeeDetail: [
//             { employeeId: 1, employeeName: "John Doe", position: "Supervisor" },
//             {
//               employeeId: 2,
//               employeeName: "Jane Smith",
//               position: "Supervisor",
//             },
//           ],
//         },
//         {
//           level: 2,
//           approvalName: "Manager",
//           employeeDetail: [
//             { employeeId: 3, employeeName: "Bob Johnson", position: "Manager" },
//           ],
//         },
//       ];

//       return dummyData;
//     } catch (error) {
//       return handleApiError(
//         error,
//         thunkAPI,
//         "Gagal mengambil detail approval hierarchy",
//       );
//     }
//   },
// );

// ========================================
// GET LIST FAKTUR TYPE (DUMMY)
// ========================================
export const getListFakturType = createAsyncThunk(
  "EFAKTUR/GET_LIST_FAKTUR_TYPE",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/e-invoice/create/get-faktur-types";
      const response = await ratingBillingHttpService.getAll(url);

      return response.data || [];
    } catch (error) {
      return handleApiError(
        error,
        thunkAPI,
        "Gagal mengambil list faktur type",
      );
    }
  },
);

// faktur code
export const getListFakturCode = createAsyncThunk(
  "EFAKTUR/GET_LIST_FAKTUR_CODE",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/e-invoice/create/get-faktur-codes";
      const response = await ratingBillingHttpService.getAll(url);

      return response.data || [];
    } catch (error) {
      return handleApiError(
        error,
        thunkAPI,
        "Gagal mengambil list faktur code",
      );
    }
  },
);

// ========================================
// GET LIST TAX PERIOD (DUMMY)
// ========================================
export const getListTaxPeriod = createAsyncThunk(
  "EFAKTUR/GET_LIST_TAX_PERIOD",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/e-invoice/create/get-tax-periods";
      const response = await ratingBillingHttpService.getAll(url);

      return response.data || [];
    } catch (error) {
      return handleApiError(error, thunkAPI, "Gagal mengambil list tax period");
    }
  },
);

export const getListTaxYears = createAsyncThunk(
  "EFAKTUR/GET_LIST_TAX_YEARS",
  async (taxPeriod, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/e-invoice/create/get-tax-years/${taxPeriod}`;
      const response = await ratingBillingHttpService.getAll(url);

      return response.data || [];
    } catch (error) {
      return handleApiError(error, thunkAPI, "Gagal mengambil list tax years");
    }
  },
);

// ========================================
// GET LIST COUNTRY (DUMMY)
// ========================================
export const getListCountry = createAsyncThunk(
  "EFAKTUR/GET_LIST_COUNTRY",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/e-invoice/create/get-countries";
      const response = await ratingBillingHttpService.getAll(url);

      return response.data || [];
    } catch (error) {
      return handleApiError(error, thunkAPI, "Gagal mengambil list country");
    }
  },
);

// ========================================
// CREATE E-FAKTUR (DUMMY)
// ========================================
export const createEFakturManual = createAsyncThunk(
  "EFAKTUR/CREATE_MANUAL",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/e-invoice/create/manual";

      const response = await ratingBillingHttpService.createData(
        url,
        body 
      );

      if (response.success) {
        thunkAPI.dispatch(
          showModalSuccess({
            title: "Success",
            description: response.message || "E-Faktur berhasil dibuat",
            return: false,
          }),
        );

        return {
          ...response.data,
          efakturId: response.data.created_id,
        };
      } else {
        throw new Error(response.message || "Gagal membuat E-Faktur");
      }
    } catch (error) {
      return handleApiError(error, thunkAPI, "Gagal membuat E-Faktur");
    }
  },
);

// ========================================
// REQUEST SYNC DATA E-FAKTUR
// ========================================
export const requestSyncData = createAsyncThunk(
  "EFAKTUR/REQUEST_SYNC_DATA",
  async ({ efakturIds, reason, apphierId }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/e-invoice/request-sync-data";
      const requestBody = {
        efakturIds: efakturIds.map((id) => String(id)),
        reason: reason || "",
        apphierId: String(apphierId),
      };

      const response = await ratingBillingHttpService.createData(
        url,
        requestBody,
      );

      if (response.success) {
        thunkAPI.dispatch(
          showModalSuccess({
            title: "Success",
            description: response.message || "Request sync data berhasil dikirim",
            return: false,
          }),
        );
        return response.data;
      } else {
        throw new Error(response.message || "Gagal melakukan request sync data");
      }
    } catch (error) {
      return handleApiError(error, thunkAPI, "Gagal melakukan request sync data");
    }
  },
);

const efakturSlice = createSlice({
  name: "efaktur",
  initialState,
  reducers: {
    resetEFakturState: (state) => {
      Object.assign(state, initialState);
    },
    clearBillingItems: (state) => {
      state.data_billingItem = [];
    },
    clearTaxYears: (state) => {
      state.dataListTaxYears = [];
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
    // GET LIST E-FAKTUR
    [getListEFaktur.pending]: (state) => {
      state.loading = true;
    },
    [getListEFaktur.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_efaktur = action.payload.result || [];
      state.pagination = action.payload.page || initialState.pagination;
    },
    [getListEFaktur.rejected]: (state) => {
      state.loading = false;
      state.list_efaktur = [];
    },

    // BATCH MANUAL UPLOAD E-FAKTUR
    [batchManualUploadEFaktur.pending]: (state) => {
      state.loading_modal = true;
    },
    [batchManualUploadEFaktur.fulfilled]: (state, action) => {
      state.loading_modal = false;

      // Update status E-Faktur yang berhasil di-upload
      const successIds = action.payload.success.map((item) => item.efakturId);

      state.list_efaktur = state.list_efaktur.map((item) =>
        successIds.includes(String(item.efakturId))
          ? { ...item, efakturStatus: "AWAITING_APPROVAL" }
          : item,
      );

      state.data_available_requested = state.data_available_requested.map(
        (item) =>
          successIds.includes(String(item.efakturId))
            ? { ...item, status: "AWAITING_APPROVAL" }
            : item,
      );
    },
    [batchManualUploadEFaktur.rejected]: (state) => {
      state.loading_modal = false;
    },

    // GET BILLING ITEMS
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

    // GET ALL EFAKTUR APPROVE LIST
    [getAllEFakturApprovePaginate.pending]: (state) => {
      state.loading_modal = true; // ✅ Use loading_modal for modal
    },
    [getAllEFakturApprovePaginate.fulfilled]: (state, action) => {
      state.loading_modal = false;
      // ✅ Fix: Response is array directly
      state.list_efaktur_approval = Array.isArray(action.payload)
        ? action.payload
        : [];
    },
    [getAllEFakturApprovePaginate.rejected]: (state) => {
      state.loading_modal = false;
      state.list_efaktur_approval = [];
    },
    // GET DETAIL E-FAKTUR
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

    // CREATE REQUEST REPLACEMENT E-FAKTUR
    [createRequestReplacementEFaktur.pending]: (state) => {
      state.loading_modal = true;
    },
    [createRequestReplacementEFaktur.fulfilled]: (state, action) => {
      state.loading_modal = false;

      // Update status e-faktur yang berhasil di-request
      const requestedIds = action.payload.efakturIds;
      state.data_available_requested = state.data_available_requested.map(
        (item) =>
          requestedIds.includes(item.efakturId)
            ? { ...item, statusApproval: "AWAITING_APPROVAL" }
            : item,
      );
    },
    [createRequestReplacementEFaktur.rejected]: (state) => {
      state.loading_modal = false;
    },

    // CREATE REQUEST CANCELLATION E-FAKTUR
    [createRequestCancellationEFaktur.pending]: (state) => {
      state.loading_modal = true;
    },
    [createRequestCancellationEFaktur.fulfilled]: (state, action) => {
      state.loading_modal = false;

      // Update status e-faktur yang berhasil di-request
      const requestedIds = action.payload.efakturIds;
      state.data_available_requested = state.data_available_requested.map(
        (item) =>
          requestedIds.includes(item.efakturId)
            ? { ...item, statusApproval: "AWAITING_APPROVAL" }
            : item,
      );
    },
    [createRequestCancellationEFaktur.rejected]: (state) => {
      state.loading_modal = false;
    },

    // GET LOG ACTIVITY
    [getLogActivity.pending]: (state) => {
      state.loading_log = true;
    },
    [getLogActivity.fulfilled]: (state, action) => {
      state.loading_log = false;
      state.log_activity = action.payload.result || [];
      state.pagination_log = action.payload.page || initialState.pagination_log;
    },
    [getLogActivity.rejected]: (state) => {
      state.loading_log = false;
      state.log_activity = [];
      state.pagination_log = initialState.pagination_log;
    },

    // GET CATEGORIES
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

    // GET APPROVAL LIST
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

    // GET APPROVAL BY ID
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

    // GET APPROVAL HISTORY
    [getApprovalHistory.pending]: (state) => {
      state.loading_approval_history = true;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.loading_approval_history = false;
      state.data_approval_history = action.payload;
    },
    [getApprovalHistory.rejected]: (state) => {
      state.loading_approval_history = false;
      state.data_approval_history = { dataHistory: {}, dataApprover: {} };
    },

    // GENERATE E-FAKTUR WITH ATTACHMENTS
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
      state.list_efaktur = state.list_efaktur.map((item) =>
        item.billingCode === efakturResult.billingCode
          ? {
              ...item,
              efakturId: efakturResult.einvoiceId,
              efakturStatus: efakturResult.status,
              invoiceNumber: efakturResult.invoiceNumber,
            }
          : item,
      );
    },
    [generateEFakturWithAttachments.rejected]: (state) => {
      state.loading_modal = false;
      state.upload_progress = 0;
    },

    // APPROVE E-FAKTUR
    [approvedEfaktur.pending]: (state) => {
      state.loading_modal = true;
    },
    [approvedEfaktur.fulfilled]: (state, action) => {
      state.loading_modal = false;

      // ✅ Update list after approval/rejection
      const approvedIds = action.payload.detailApproves.map((d) => d.efakturId);
      const newStatus =
        action.payload.action === "APPROVE" ? "APPROVED" : "REJECTED";

      state.list_efaktur_approval = state.list_efaktur_approval.map((item) =>
        approvedIds.includes(String(item.efakturId))
          ? { ...item, statusApproval: newStatus }
          : item,
      );
    },
    [approvedEfaktur.rejected]: (state) => {
      state.loading_modal = false;
    },

    // CANCEL E-FAKTUR
    [cancelEFaktur.pending]: (state) => {
      state.loading_modal = true;
    },
    [cancelEFaktur.fulfilled]: (state, action) => {
      state.loading_modal = false;
      state.list_efaktur = state.list_efaktur.map((item) =>
        item.efakturId === action.payload.efakturId
          ? { ...item, efakturStatus: "CANCELLED" }
          : item,
      );
    },
    [cancelEFaktur.rejected]: (state) => {
      state.loading_modal = false;
    },

    // REPLACE E-FAKTUR
    [replaceEFaktur.pending]: (state) => {
      state.loading_modal = true;
    },
    [replaceEFaktur.fulfilled]: (state) => {
      state.loading_modal = false;
    },
    [replaceEFaktur.rejected]: (state) => {
      state.loading_modal = false;
    },

    // GENERATE XML
    [generateXMLEFaktur.pending]: (state) => {
      state.loading_modal = true;
    },
    [generateXMLEFaktur.fulfilled]: (state, action) => {
      state.loading_modal = false;

      // Optional: Update status di list jika perlu
      const processedIds = action.payload.efakturIds;
      state.list_efaktur = state.list_efaktur.map((item) =>
        processedIds.includes(String(item.efakturId))
          ? { ...item, lastXmlGenerated: new Date().toISOString() }
          : item,
      );
    },
    [generateXMLEFaktur.rejected]: (state) => {
      state.loading_modal = false;
    },

    // UPLOAD MANUAL
    [uploadManualEFaktur.pending]: (state) => {
      state.loading_modal = true;
    },
    [uploadManualEFaktur.fulfilled]: (state) => {
      state.loading_modal = false;
    },
    [uploadManualEFaktur.rejected]: (state) => {
      state.loading_modal = false;
    },

    // UPLOAD ATTACHMENT
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

    // DOWNLOAD LIST
    [downloadEFakturList.pending]: (state) => {
      state.loading = true;
    },
    [downloadEFakturList.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadEFakturList.rejected]: (state) => {
      state.loading = false;
    },

    // GET ELIGIBLE E-FAKTUR FOR REQUEST
    [getEligibleEFakturForRequest.pending]: (state) => {
      state.loading_eligible = true;
      state.error_eligible = null;
    },
    [getEligibleEFakturForRequest.fulfilled]: (state, action) => {
      state.loading_eligible = false;
      state.data_eligible_efaktur = action.payload.result || [];
      state.pagination = action.payload.page || initialState.pagination;
    },
    [getEligibleEFakturForRequest.rejected]: (state, action) => {
      state.loading_eligible = false;
      state.error_eligible = action.payload;
      state.data_eligible_efaktur = [];
    },

    // GET LIST PRODUCT TYPE
    [getListProductType.pending]: (state) => {
      state.loading = true;
    },
    [getListProductType.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListProductType = action.payload || [];
    },
    [getListProductType.rejected]: (state) => {
      state.loading = false;
      state.dataListProductType = [];
    },

    // GET LIST UOM
    [getListUOM.pending]: (state) => {
      state.loading = true;
    },
    [getListUOM.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListUOM = action.payload || [];
    },
    [getListUOM.rejected]: (state) => {
      state.loading = false;
      state.dataListUOM = [];
    },

    // GET LIST FAKTUR TYPE
    [getListFakturType.pending]: (state) => {
      state.loading = true;
    },
    [getListFakturType.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListFakturType = action.payload || [];
    },
    [getListFakturType.rejected]: (state) => {
      state.loading = false;
      state.dataListFakturType = [];
    },

    // GET LIST TAX PERIOD
    [getListTaxPeriod.pending]: (state) => {
      state.loading = true;
    },
    [getListTaxPeriod.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListTaxPeriod = action.payload || [];
    },
    [getListTaxPeriod.rejected]: (state) => {
      state.loading = false;
      state.dataListTaxPeriod = [];
    },

    // GET LIST COUNTRY
    [getListCountry.pending]: (state) => {
      state.loading = true;
    },
    [getListCountry.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListCountry = action.payload || [];
    },
    [getListCountry.rejected]: (state) => {
      state.loading = false;
      state.dataListCountry = [];
    },

    // GET LIST FAKTUR CODE
    [getListFakturCode.pending]: (state) => {
      state.loading = true;
    },
    [getListFakturCode.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListFakturCode = action.payload || [];
    },
    [getListFakturCode.rejected]: (state) => {
      state.loading = false;
      state.dataListFakturCode = [];
    },

    // GET LIST TAX YEARS
    [getListTaxYears.pending]: (state) => {
      state.loading = true;
    },
    [getListTaxYears.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListTaxYears = action.payload || [];
    },
    [getListTaxYears.rejected]: (state) => {
      state.loading = false;
      state.dataListTaxYears = [];
    },

    // GET LIST PRODUCT CODE
    [getListProductCode.pending]: (state) => {
      state.loading = true;
    },
    [getListProductCode.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListProductCode = action.payload || [];
    },
    [getListProductCode.rejected]: (state) => {
      state.loading = false;
      state.dataListProductCode = [];
    },

    // CREATE E-FAKTUR MANUAL
    [createEFakturManual.pending]: (state) => {
      state.loading_modal = true;
    },
    [createEFakturManual.fulfilled]: (state, action) => {
      state.loading_modal = false;
      state.dataDetail = action.payload;
    },
    [createEFakturManual.rejected]: (state) => {
      state.loading_modal = false;
    },

    // GET AVAILABLE REQUESTED LIST
    [getAvailableRequestedList.pending]: (state) => {
      state.loading_available_requested = true;
      state.error_available_requested = null;
    },
    [getAvailableRequestedList.fulfilled]: (state, action) => {
      state.loading_available_requested = false;
      state.data_available_requested = action.payload.result || [];
      state.pagination_available_requested =
        action.payload.page || initialState.pagination_available_requested;
    },
    [getAvailableRequestedList.rejected]: (state, action) => {
      state.loading_available_requested = false;
      state.error_available_requested = action.payload;
      state.data_available_requested = [];
    },

    // CREATE REQUEST APPROVAL E-FAKTUR
    [createRequestApprovalEFaktur.pending]: (state) => {
      state.loading_modal = true;
    },
    [createRequestApprovalEFaktur.fulfilled]: (state, action) => {
      state.loading_modal = false;

      // Update status e-faktur yang berhasil di-request
      const requestedIds = action.payload.efakturIds;
      state.data_available_requested = state.data_available_requested.map(
        (item) =>
          requestedIds.includes(item.efakturId)
            ? { ...item, statusApproval: "AWAITING_APPROVAL" }
            : item,
      );
    },
    [createRequestApprovalEFaktur.rejected]: (state) => {
      state.loading_modal = false;
    },

    // BULK REQUEST APPROVAL E-FAKTUR
    [bulkRequestApprovalEFaktur.pending]: (state) => {
      state.loading_modal = true;
      state.upload_progress = 0;
      state.upload_results = [];
    },
    [bulkRequestApprovalEFaktur.fulfilled]: (state, action) => {
      state.loading_modal = false;
      state.upload_progress = 100;
      state.upload_results = action.payload.uploadResults || [];

      // Update status e-faktur yang berhasil di-request
      if (action.payload.efakturRequests) {
        action.payload.efakturRequests.forEach((req) => {
          if (req.status === "AWAITING_APPROVAL") {
            state.list_efaktur = state.list_efaktur.map((item) =>
              item.efakturId === req.efakturId
                ? { ...item, efakturStatus: "AWAITING_APPROVAL" }
                : item,
            );
          }
        });
      }
    },
    [bulkRequestApprovalEFaktur.rejected]: (state) => {
      state.loading_modal = false;
      state.upload_progress = 0;
      state.upload_results = [];
    },

    // REQUEST SYNC DATA E-FAKTUR
    [requestSyncData.pending]: (state) => {
      state.loading_sync = true;
    },
    [requestSyncData.fulfilled]: (state) => {
      state.loading_sync = false;
    },
    [requestSyncData.rejected]: (state) => {
      state.loading_sync = false;
    },
  },
});

export const {
  resetEFakturState,
  clearBillingItems,
  updateUploadProgress,
  resetUploadProgress,
  clearTaxYears,
} = efakturSlice.actions;

export default efakturSlice.reducer;
