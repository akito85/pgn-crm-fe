import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  showModalError,
  showModalSuccess,
  setBodyError,
  validateError,
} from "../general_slice";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";

const initialState = {
  data: [],
  pagination: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },
  dataDetail: null,
  dataListAccount: [],
  dataAccountDetail: null,
  dataListBillingCycle: [],
  dataListBillingPeriod: [],
  dataListTermOfPayment: [],
  dataListInvoice: [],
  dataInvoiceDetail: null,
  dataListApprovalHierarchy: [],
  dataListApprovalHierarchyDetail: [],
  dataApprovalHistory: null,
  dataListCategory: [],
  dataListAttachment: [],
  dataListAdjustmentReason: [],
  loading: false,
  loadingDetail: false,
  message: "",
};

// Get List Account
export const getListAccountInvoiceAdjustment = createAsyncThunk(
  "GET_LIST_ACCOUNT_INVOICE_ADJUSTMENT",
  async ({ search = "" }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice-adjustment/list-account?search=${search}`;
      const response = await ratingBillingHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Account Detail
export const getAccountDetailInvoiceAdjustment = createAsyncThunk(
  "GET_ACCOUNT_DETAIL_INVOICE_ADJUSTMENT",
  async (accountNumber, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice-adjustment/list-account/${accountNumber}`;
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Billing Cycle List
export const getBillingCycleInvoiceAdjustment = createAsyncThunk(
  "GET_BILLING_CYCLE_INVOICE_ADJUSTMENT",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice-adjustment/billing-cycle`;
      const response = await ratingBillingHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Billing Period List
export const getBillingPeriodInvoiceAdjustment = createAsyncThunk(
  "GET_BILLING_PERIOD_INVOICE_ADJUSTMENT",
  async (cycleId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice-adjustment/billing-period/${cycleId}`;
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Term of Payment List
export const getTermOfPaymentInvoiceAdjustment = createAsyncThunk(
  "GET_TERM_OF_PAYMENT_INVOICE_ADJUSTMENT",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice-adjustment/term-of-payment`;
      const response = await ratingBillingHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Adjustment Reason List
export const getAdjustmentReasonInvoiceAdjustment = createAsyncThunk(
  "GET_ADJUSTMENT_REASON_INVOICE_ADJUSTMENT",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice-adjustment/get-adjustment-reason-list`;
      const response = await ratingBillingHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Invoice List
export const getInvoiceListInvoiceAdjustment = createAsyncThunk(
  "GET_INVOICE_LIST_INVOICE_ADJUSTMENT",
  async ({ accountNumber, billingCycle, billingPeriod }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice-adjustment/invoice-list?accountNumber=${accountNumber}&billingCycle=${billingCycle}&billingPeriod=${billingPeriod}`;
      const response = await ratingBillingHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Invoice Detail
export const getInvoiceDetailInvoiceAdjustment = createAsyncThunk(
  "GET_INVOICE_DETAIL_INVOICE_ADJUSTMENT",
  async (invoiceNumber, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice-adjustment/invoice-detail/${invoiceNumber}`;
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Create Invoice Adjustment
export const createInvoiceAdjustment = createAsyncThunk(
  "CREATE_INVOICE_ADJUSTMENT",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/invoice-adjustment";
      const response = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.isSubmit === "Y" ? "submitted" : "created"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
        if (error?.response?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${
              body.isSubmit === "Y" ? "submitted" : "created"
            }. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  }
);

// Update Invoice Adjustment
export const updateInvoiceAdjustment = createAsyncThunk(
  "UPDATE_INVOICE_ADJUSTMENT",
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice-adjustment/update-invoice-adjustment/${id}`;
      const response = await ratingBillingHttpService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.isSubmit === "Y" ? "submitted" : "updated"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
        if (error?.response?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${
              body.isSubmit === "Y" ? "submitted" : "updated"
            }. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  }
);

// Get Invoice Adjustment Detail
export const getDetailInvoiceAdjustment = createAsyncThunk(
  "GET_DETAIL_INVOICE_ADJUSTMENT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice-adjustment/detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get List Invoice Adjustment
export const getInvoiceAdjustmentPaginate = createAsyncThunk(
  "GET_INVOICE_ADJUSTMENT_PAGINATE",
  async (
    { page = 1, size = 100, sort = [], search = [], isLoadMore = false },
    thunkAPI
  ) => {
    try {
      const sortParams = sort.length > 0 ? sort.join(",") : "createdDate~desc";
      const searchParams =
        search.length > 0
          ? `&search=${encodeURIComponent(search.join(","))}`
          : "";
      const url = `/v1/dbs/api/rbi/invoice-adjustment?page=${page}&size=${size}&sort=${sortParams}${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);

      // Return response data with isLoadMore flag (same pattern as Prabilling)
      return {
        ...response.data,
        isLoadMore,
      };
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Approve Invoice Adjustment
export const approveInvoiceAdjustment = createAsyncThunk(
  "APPROVE_INVOICE_ADJUSTMENT",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/invoice-adjustment/approve";
      const response = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Invoice Adjustment approved successfully.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
        if (error.response?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Invoice Adjustment was not approved. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  }
);

// Reject Invoice Adjustment
export const rejectInvoiceAdjustment = createAsyncThunk(
  "REJECT_INVOICE_ADJUSTMENT",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/invoice-adjustment/reject";
      const response = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Invoice Adjustment rejected successfully.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
        if (error.response?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Invoice Adjustment was not rejected. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  }
);

// Get Approval History
export const getApprovalHistoryInvoiceAdjustment = createAsyncThunk(
  "GET_APPROVAL_HISTORY_INVOICE_ADJUSTMENT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice-adjustment/approval-history/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);

      // Handle new nested structure with dataHistory and dataApprover
      if (response.data && !Array.isArray(response.data)) {
        return response.data;
      }
      return null;
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Approval Hierarchies
export const getApprovalHierarchiesInvoiceAdjustment = createAsyncThunk(
  "GET_APPROVAL_HIERARCHIES_INVOICE_ADJUSTMENT",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice-adjustment/approval-hierarchi-list`;
      const response = await ratingBillingHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Approval Hierarchy Details
export const getApprovalHierarchyDetailsInvoiceAdjustment = createAsyncThunk(
  "GET_APPROVAL_HIERARCHY_DETAILS_INVOICE_ADJUSTMENT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice-adjustment/approval-hierarchi-list/${id}`;
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get List Category for Attachment
export const getListCategoryInvoiceAdjustment = createAsyncThunk(
  "GET_LIST_CATEGORY_INVOICE_ADJUSTMENT",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/invoice-adjustment/list-attachment-category";
      const response = await ratingBillingHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get List Attachment by Reference ID
export const getListAttachmentInvoiceAdjustment = createAsyncThunk(
  "GET_LIST_ATTACHMENT_INVOICE_ADJUSTMENT",
  async (referenceId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice-adjustment/list-attachment/${referenceId}`;
      const response = await ratingBillingHttpService.getDetail(url);
      // Return array directly, handle if response.data is not an array
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Download Attachment by File ID
export const downloadAttachmentInvoiceAdjustment = createAsyncThunk(
  "DOWNLOAD_ATTACHMENT_INVOICE_ADJUSTMENT",
  async (fileId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice-adjustment/download-attachment/${fileId}`;
      const response = await ratingBillingHttpService.downloadData(url);
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Upload Attachment with multipart/form-data
export const uploadAttachmentInvoiceAdjustment = createAsyncThunk(
  "UPLOAD_ATTACHMENT_INVOICE_ADJUSTMENT",
  async ({ formData, onProgress }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice-adjustment/upload-attachment`;
      const response = await ratingBillingHttpService.uploadAttachment(
        url,
        formData,
        onProgress || (() => {})
      );
      return response;
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
          description: `Attachment upload failed. ${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Validate Create Invoice Adjustment
export const validateCreateInvoiceAdjustment = createAsyncThunk(
  "VALIDATE_CREATE_INVOICE_ADJUSTMENT",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/invoice-adjustment/validate-create";
      const response = await ratingBillingHttpService.createData(url, body);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// Download Invoice Adjustment
export const downloadInvoiceAdjustment = createAsyncThunk(
  "DOWNLOAD_INVOICE_ADJUSTMENT",
  async ({ page = 1, size = 1000, sort = [], search = [] }, thunkAPI) => {
    try {
      const sortParams = sort.length > 0 ? sort.join(",") : "createdDate~desc";
      const searchParams =
        search.length > 0
          ? `&search=${encodeURIComponent(search.join(","))}`
          : "";
      const url = `/v1/dbs/api/rbi/invoice-adjustment/download-filter?page=${page}&size=${size}&sort=${sortParams}${searchParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_INVOICE_ADJUSTMENT",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// Delete Invoice Adjustment
export const deleteInvoiceAdjustment = createAsyncThunk(
  "DELETE_INVOICE_ADJUSTMENT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice-adjustment/delete/${id}`;
      const response = await ratingBillingHttpService.deleteData(url);
      const successMessage = {
        title: "Successful",
        description: "Your data has been deleted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return { id, data: response.data };
    } catch (response) {
      const message =
        (response.response &&
          response.response.data &&
          response.response.data.message) ||
        response.message ||
        response.toString();
      const errorBody = {
        title: "Failed",
        data: response.response?.data?.data,
        description: `Your data was not deleted. ${message}. Please try again.`,
        return: false,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(response.response?.data);
    }
  }
);

const adjustmentInvoiceSlice = createSlice({
  name: "adjustment_invoice",
  initialState,
  reducers: {
    clearInvoiceAdjustmentDetail: (state) => {
      state.dataDetail = null;
    },
    clearAccountDetail: (state) => {
      state.dataAccountDetail = null;
    },
    clearInvoiceDetail: (state) => {
      state.dataInvoiceDetail = null;
    },
    clearBillingPeriod: (state) => {
      state.dataListBillingPeriod = [];
    },
    clearInvoiceList: (state) => {
      state.dataListInvoice = [];
    },
  },
  extraReducers: {
    // Get List Account
    [getListAccountInvoiceAdjustment.pending]: (state) => {
      state.loading = true;
    },
    [getListAccountInvoiceAdjustment.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListAccount = action.payload;
    },
    [getListAccountInvoiceAdjustment.rejected]: (state) => {
      state.loading = false;
    },

    // Get Account Detail
    [getAccountDetailInvoiceAdjustment.pending]: (state) => {
      state.loading = true;
    },
    [getAccountDetailInvoiceAdjustment.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataAccountDetail = action.payload;
    },
    [getAccountDetailInvoiceAdjustment.rejected]: (state) => {
      state.loading = false;
    },

    // Get Billing Cycle
    [getBillingCycleInvoiceAdjustment.pending]: (state) => {
      state.loading = true;
    },
    [getBillingCycleInvoiceAdjustment.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListBillingCycle = action.payload;
    },
    [getBillingCycleInvoiceAdjustment.rejected]: (state) => {
      state.loading = false;
    },

    // Get Billing Period
    [getBillingPeriodInvoiceAdjustment.pending]: (state) => {
      state.loading = true;
    },
    [getBillingPeriodInvoiceAdjustment.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListBillingPeriod = action.payload;
    },
    [getBillingPeriodInvoiceAdjustment.rejected]: (state) => {
      state.loading = false;
    },

    // Get Term of Payment
    [getTermOfPaymentInvoiceAdjustment.pending]: (state) => {
      state.loading = true;
    },
    [getTermOfPaymentInvoiceAdjustment.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListTermOfPayment = action.payload;
    },
    [getTermOfPaymentInvoiceAdjustment.rejected]: (state) => {
      state.loading = false;
    },

    // Get Adjustment Reason
    [getAdjustmentReasonInvoiceAdjustment.pending]: (state) => {
      state.loading = true;
    },
    [getAdjustmentReasonInvoiceAdjustment.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListAdjustmentReason = action.payload;
    },
    [getAdjustmentReasonInvoiceAdjustment.rejected]: (state) => {
      state.loading = false;
    },

    // Get Invoice List
    [getInvoiceListInvoiceAdjustment.pending]: (state) => {
      state.loading = true;
    },
    [getInvoiceListInvoiceAdjustment.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListInvoice = action.payload;
    },
    [getInvoiceListInvoiceAdjustment.rejected]: (state) => {
      state.loading = false;
    },

    // Get Invoice Detail
    [getInvoiceDetailInvoiceAdjustment.pending]: (state) => {
      state.loading = true;
    },
    [getInvoiceDetailInvoiceAdjustment.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataInvoiceDetail = action.payload;
    },
    [getInvoiceDetailInvoiceAdjustment.rejected]: (state) => {
      state.loading = false;
    },

    // Create Invoice Adjustment
    [createInvoiceAdjustment.pending]: (state) => {
      state.loading = true;
    },
    [createInvoiceAdjustment.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [createInvoiceAdjustment.rejected]: (state) => {
      state.loading = false;
    },

    // Update Invoice Adjustment
    [updateInvoiceAdjustment.pending]: (state) => {
      state.loading = true;
    },
    [updateInvoiceAdjustment.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [updateInvoiceAdjustment.rejected]: (state) => {
      state.loading = false;
    },

    // Get Detail Invoice Adjustment
    [getDetailInvoiceAdjustment.pending]: (state) => {
      state.loadingDetail = true;
    },
    [getDetailInvoiceAdjustment.fulfilled]: (state, action) => {
      state.loadingDetail = false;
      state.dataDetail = action.payload;
    },
    [getDetailInvoiceAdjustment.rejected]: (state) => {
      state.loadingDetail = false;
    },

    // Get Invoice Adjustment Paginate
    [getInvoiceAdjustmentPaginate.pending]: (state, action) => {
      // Only show loading on initial fetch, not on load more
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getInvoiceAdjustmentPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      const newData = action.payload.result || [];
      const isLoadMore = action.payload.isLoadMore;

      // If it's load more, append data. Otherwise, replace data
      if (isLoadMore) {
        state.data = [...state.data, ...newData];
      } else {
        state.data = newData;
      }

      state.pagination = {
        totalPages: action.payload.page?.totalPages || 0,
        totalElements: action.payload.page?.totalElements || 0,
        currentPage: action.payload.page?.number || 0,
        pageSize: action.payload.page?.size || 10,
      };
    },
    [getInvoiceAdjustmentPaginate.rejected]: (state, action) => {
      state.loading = false;
      // Only clear data on initial fetch failure, not on load more failure
      if (!action.meta.arg?.isLoadMore) {
        state.data = [];
        state.pagination = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 10,
        };
      }
    },

    // Approve Invoice Adjustment
    [approveInvoiceAdjustment.pending]: (state) => {
      state.loading = true;
    },
    [approveInvoiceAdjustment.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveInvoiceAdjustment.rejected]: (state) => {
      state.loading = false;
    },

    // Reject Invoice Adjustment
    [rejectInvoiceAdjustment.pending]: (state) => {
      state.loading = true;
    },
    [rejectInvoiceAdjustment.fulfilled]: (state) => {
      state.loading = false;
    },
    [rejectInvoiceAdjustment.rejected]: (state) => {
      state.loading = false;
    },

    // Get Approval History
    [getApprovalHistoryInvoiceAdjustment.pending]: (state) => {
      state.loading = true;
    },
    [getApprovalHistoryInvoiceAdjustment.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataApprovalHistory = action.payload;
    },
    [getApprovalHistoryInvoiceAdjustment.rejected]: (state) => {
      state.loading = false;
    },

    // Get Approval Hierarchies
    [getApprovalHierarchiesInvoiceAdjustment.pending]: (state) => {
      state.loading = true;
    },
    [getApprovalHierarchiesInvoiceAdjustment.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListApprovalHierarchy = action.payload;
    },
    [getApprovalHierarchiesInvoiceAdjustment.rejected]: (state) => {
      state.loading = false;
    },

    // Get Approval Hierarchy Details
    [getApprovalHierarchyDetailsInvoiceAdjustment.pending]: (state) => {
      state.loading = true;
    },
    [getApprovalHierarchyDetailsInvoiceAdjustment.fulfilled]: (
      state,
      action
    ) => {
      state.loading = false;
      state.dataListApprovalHierarchyDetail = action.payload;
    },
    [getApprovalHierarchyDetailsInvoiceAdjustment.rejected]: (state) => {
      state.loading = false;
    },

    // Get List Category
    [getListCategoryInvoiceAdjustment.pending]: (state) => {
      state.loading = true;
    },
    [getListCategoryInvoiceAdjustment.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListCategory = action.payload;
    },
    [getListCategoryInvoiceAdjustment.rejected]: (state) => {
      state.loading = false;
    },

    // Get List Attachment
    [getListAttachmentInvoiceAdjustment.pending]: (state) => {
      state.loading = true;
    },
    [getListAttachmentInvoiceAdjustment.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListAttachment = action.payload;
    },
    [getListAttachmentInvoiceAdjustment.rejected]: (state) => {
      state.loading = false;
      state.dataListAttachment = [];
    },

    // Validate Create
    [validateCreateInvoiceAdjustment.pending]: (state) => {
      state.loading = true;
    },
    [validateCreateInvoiceAdjustment.fulfilled]: (state) => {
      state.loading = false;
    },
    [validateCreateInvoiceAdjustment.rejected]: (state) => {
      state.loading = false;
    },

    // Download
    [downloadInvoiceAdjustment.pending]: (state) => {
      state.loading = true;
    },
    [downloadInvoiceAdjustment.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadInvoiceAdjustment.rejected]: (state) => {
      state.loading = false;
    },

    // Delete Invoice Adjustment
    [deleteInvoiceAdjustment.pending]: (state) => {
      state.loading = true;
    },
    [deleteInvoiceAdjustment.fulfilled]: (state) => {
      state.loading = false;
    },
    [deleteInvoiceAdjustment.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export const {
  clearInvoiceAdjustmentDetail,
  clearAccountDetail,
  clearInvoiceDetail,
  clearBillingPeriod,
  clearInvoiceList,
} = adjustmentInvoiceSlice.actions;

const { reducer } = adjustmentInvoiceSlice;
export default reducer;
