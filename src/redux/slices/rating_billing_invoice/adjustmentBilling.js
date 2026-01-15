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
  dataForm: [],
  dataDetail: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  data_approval_history: [],
  dataListCategory: [],
  dataListAccount: [],
  dataListAccountDetail: [],
  dataListType: [],
  dataListBillingCycle: [],
  dataListBillingPeriod: [],
  dataListInvoice: [],
  dataListAdjustmentReason: [],
  dataListInvoiceInformation: [],
  dataCurrency: [],
  dataTermsOfPayment: [],
  dataListSelectTOP: [],
  dataListItem: [],
  dataDetailType: [],
  dataListRateType: [],
  dataInvoiceInfo: null,
  dataBillingItemList: [],
  loading: false,
  message: "",
};

export const createAdjustmentBilling = createAsyncThunk(
  "CREATE_ADJUSTMENT_BILLING",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/adjustment/create-adjustment";
      const response = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.submit === false ? "created" : "submitted"
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
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error?.response?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${
              body.isSubmit === false ? "created" : "submitted"
            }. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  }
);

export const updateAdjustmentBilling = createAsyncThunk(
  "UPDATE_ADJUSTMENT_BILLING",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/adjustment/update-adjustment";
      const response = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.submit === false ? "updated" : "submitted"
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
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error?.response?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${
              body.isSubmit === false ? "updated" : "submitted"
            }. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  }
);

export const getAdjustmentBillingPaginate = createAsyncThunk(
  "GET_ADJUSTMENT_BILLING_PAGINATE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rbi/adjustment/get-adjustment-billing-list?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
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
    }
  }
);

export const getListApprovalHierarchy = createAsyncThunk(
  "GET_LIST_APPROVAL_HIERARCHY_AB",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/adjustment/getApprovalHierList";
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
    }
  }
);

export const getListApprovalHierarchyDetail = createAsyncThunk(
  "GET_LIST_APPROVAL_HIERARCHY_DETAIL_AB",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/adjustment/getApprovalHierDetailById/${id}`;
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
    }
  }
);

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/adjustment/getApprovalHistory/${id}`;
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
    }
  }
);

export const deleteAdjustmentBilling = createAsyncThunk(
  "DELETE_ADJUSTMENT_BILLING",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/adjustment/delete-adjustment-billing/${id}`;
      const response = await ratingBillingHttpService.deleteData(url);
      const successBody = {
        title: "Successful",
        description: "Your data has been deleted.",
        return: false,
        icon: "icon_error_delete",
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
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not deleted. ${message}.`,
            return: false,
            icon: "icon_error_delete",
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  }
);

export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/adjustment/get-category-attachment";
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
    }
  }
);

export const downloadAdjustmentBilling = createAsyncThunk(
  "DOWNLOAD_ADJUSTMENT_BILLING",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rbi/adjustment/downloadFilter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_ADJUSTMENT_BILLING",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getListAccount = createAsyncThunk(
  "GET_LIST_ACCOUNT",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/adjustment/get-account-list";
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
    }
  }
);

export const getListAccountDetail = createAsyncThunk(
  "GET_LIST_ACCOUNT_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/adjustment/get-account-detail/${id}`;
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
    }
  }
);

export const getListType = createAsyncThunk(
  "GET_LIST_TYPE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/adjustment/getAdjustmentTypeList";
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
    }
  }
);

export const getListDetailType = createAsyncThunk(
  "GET_LIST_DETAIL_TYPE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/adjustment/adjustment-detail-type";
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
    }
  }
);

export const getListBillingCycle = createAsyncThunk(
  "GET_LIST_BILLING_CYCLE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/adjustment/get-billing-cycle-list";
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
    }
  }
);

export const getListBillingPeriod = createAsyncThunk(
  "GET_LIST_BILLING_PERIOD",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/adjustment/get-billing-period-list?cycleId=${id}`;
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
    }
  }
);

export const getListInvoice = createAsyncThunk(
  "GET_LIST_INVOICE",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/adjustment/get-invoice-list`;
      const response = await ratingBillingHttpService.createData(url, body);
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
    }
  }
);

export const getListInvoiceInformation = createAsyncThunk(
  "GET_LIST_INVOICE_INFORMATION",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/adjustment/get-invoice-information/${id}`;
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
    }
  }
);

export const getListAdjustmentReason = createAsyncThunk(
  "GET_LIST_ADJUSTMENT_REASON",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/adjustment/get-adjustment-reason-list";
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
    }
  }
);

export const getListCurrency = createAsyncThunk(
  "GET_LIST_CURRENCY",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/adjustment/get-currency-list";
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
    }
  }
);

export const getListRateType = createAsyncThunk(
  "GET_LIST_RATE_TYPE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/daily-rate/list-rate-type";
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
    }
  }
);

export const getListTermsOfPayment = createAsyncThunk(
  "GET_LIST_TERMS_OF_PAYMENT",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/adjustment/term-of-payment-data";
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
    }
  }
);

export const getInvoiceInformation = createAsyncThunk(
  "GET_INVOICE_INFORMATION",
  async (invoiceNumber, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/adjustment/get-invoice-information/${invoiceNumber}`;
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
    }
  }
);

export const getInvoiceBillingItemList = createAsyncThunk(
  "GET_INVOICE_BILLING_ITEM_LIST",
  async (billingNumber, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/adjustment/get-invoice-billing-item-list/${billingNumber}`;
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
    }
  }
);

export const getSelectTOP = createAsyncThunk(
  "GET_SELECT_TOP",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/adjustment/get-terms-of-payment-list";
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
    }
  }
);

export const getListItem = createAsyncThunk(
  "GET_LIST_ITEM",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/adjustment/get-item-type/${id}`;
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
    }
  }
);

export const getDetailAdjustmentBilling = createAsyncThunk(
  "GET_DETAIL_ADJUSTMENT_BILLING",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/adjustment/get-adjustment-billing-detail/${id}`;
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
    }
  }
);

export const approveOrRejectAdjustmentBilling = createAsyncThunk(
  "APPROVE_OR_REJECT_ADJUSTMENT_BILLING",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/adjustment/approval-adjustment";
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body
      );
      const successApprove = {
        title: `Successful`,
        description: `Your data has been ${
          body.action === "APPROVE" ? "approved" : "rejected"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successApprove));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${
              body.action === "APPROVE" ? "approved" : "rejected"
            }. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  }
);

const adjustmentBillingSlice = createSlice({
  name: "adjustment_billing",
  initialState,
  extraReducers: {
    // Create Adjustment Billing
    [createAdjustmentBilling.pending]: (state) => {
      state.loading = true;
    },
    [createAdjustmentBilling.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataForm = action.payload;
    },
    [createAdjustmentBilling.rejected]: (state) => {
      state.loading = false;
    },

    // Update Adjustment Billing
    [updateAdjustmentBilling.pending]: (state) => {
      state.loading = true;
    },
    [updateAdjustmentBilling.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataForm = action.payload;
    },
    [updateAdjustmentBilling.rejected]: (state) => {
      state.loading = false;
    },

    // get pagination calculation
    [getAdjustmentBillingPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAdjustmentBillingPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getAdjustmentBillingPaginate.rejected]: (state) => {
      state.loading = false;
    },

    // Get List Approval Hierarchy
    [getListApprovalHierarchy.pending]: (state, action) => {
      state.loading = true;
      state.dataListAppHierId = action.payload;
    },
    [getListApprovalHierarchy.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListAppHierId = action.payload;
    },
    [getListApprovalHierarchy.rejected]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },

    // Get List Approval Hierarchy Detail
    [getListApprovalHierarchyDetail.pending]: (state, action) => {
      state.loading = true;
      state.dataListAppHierDetail = action.payload;
    },
    [getListApprovalHierarchyDetail.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },
    [getListApprovalHierarchyDetail.rejected]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },

    // Get Approval History
    [getApprovalHistory.pending]: (state, action) => {
      state.loading = true;
      state.data_approval_history = action.payload;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.data_approval_history = action.payload;
      state.loading = false;
    },
    [getApprovalHistory.rejected]: (state, action) => {
      state.data_approval_history = action.payload;
      state.loading = false;
    },

    // Inactive Pricing Rule
    [deleteAdjustmentBilling.pending]: (state) => {
      state.loading = true;
    },
    [deleteAdjustmentBilling.fulfilled]: (state) => {
      state.loading = false;
    },
    [deleteAdjustmentBilling.rejected]: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },

    /* Get List Category */
    [getListCategory.pending]: (state, action) => {
      state.loading = true;
      state.dataListCategory = action.payload;
    },
    [getListCategory.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },
    [getListCategory.rejected]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },

    /* Download Pricing */
    [downloadAdjustmentBilling.pending]: (state) => {
      state.loading = true;
    },
    [downloadAdjustmentBilling.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadAdjustmentBilling.rejected]: (state) => {
      state.loading = false;
    },

    /* Get List Account */
    [getListAccount.pending]: (state, action) => {
      state.loading = true;
      state.dataListAccount = action.payload;
    },
    [getListAccount.fulfilled]: (state, action) => {
      state.dataListAccount = action.payload;
      state.loading = false;
    },
    [getListAccount.rejected]: (state, action) => {
      state.dataListAccount = action.payload;
      state.loading = false;
    },

    /* Get List Account Detail */
    [getListAccountDetail.pending]: (state, action) => {
      state.loading = true;
      state.dataListAccountDetail = action.payload;
    },
    [getListAccountDetail.fulfilled]: (state, action) => {
      state.dataListAccountDetail = action.payload;
      state.loading = false;
    },
    [getListAccountDetail.rejected]: (state, action) => {
      state.dataListAccountDetail = action.payload;
      state.loading = false;
    },

    /* Get List Type */
    [getListType.pending]: (state, action) => {
      state.loading = true;
      state.dataListType = action.payload;
    },
    [getListType.fulfilled]: (state, action) => {
      state.dataListType = action.payload;
      state.loading = false;
    },
    [getListType.rejected]: (state, action) => {
      state.dataListType = action.payload;
      state.loading = false;
    },

    /* Get List Detail Type */
    [getListDetailType.pending]: (state, action) => {
      state.loading = true;
      state.dataDetailType = action.payload;
    },
    [getListDetailType.fulfilled]: (state, action) => {
      state.dataDetailType = action.payload;
      state.loading = false;
    },
    [getListDetailType.rejected]: (state, action) => {
      state.dataDetailType = action.payload;
      state.loading = false;
    },

    /* Get List Billing Cycle */
    [getListBillingCycle.pending]: (state, action) => {
      state.loading = true;
      state.dataListBillingCycle = action.payload;
    },
    [getListBillingCycle.fulfilled]: (state, action) => {
      state.dataListBillingCycle = action.payload;
      state.loading = false;
    },
    [getListBillingCycle.rejected]: (state, action) => {
      state.dataListBillingCycle = action.payload;
      state.loading = false;
    },

    /* Get List Billing Cycle */
    [getListBillingPeriod.pending]: (state, action) => {
      state.loading = true;
      state.dataListBillingPeriod = action.payload;
    },
    [getListBillingPeriod.fulfilled]: (state, action) => {
      state.dataListBillingPeriod = action.payload;
      state.loading = false;
    },
    [getListBillingPeriod.rejected]: (state, action) => {
      state.dataListBillingPeriod = action.payload;
      state.loading = false;
    },

    /* Get List Invoice */
    [getListInvoice.pending]: (state, action) => {
      state.loading = true;
      state.dataListInvoice = action.payload;
    },
    [getListInvoice.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListInvoice = action.payload;
    },
    [getListInvoice.rejected]: (state, action) => {
      state.loading = false;
      state.dataListInvoice = action.payload;
    },

    /* Get List Invoice Information */
    [getListInvoiceInformation.pending]: (state, action) => {
      state.loading = true;
      state.dataListInvoiceInformation = action.payload;
    },
    [getListInvoiceInformation.fulfilled]: (state, action) => {
      state.dataListInvoiceInformation = action.payload;
      state.loading = false;
    },
    [getListInvoiceInformation.rejected]: (state, action) => {
      state.dataListInvoiceInformation = action.payload;
      state.loading = false;
    },

    /* Get List Adjustment Reason */
    [getListAdjustmentReason.pending]: (state, action) => {
      state.loading = true;
      state.dataListAdjustmentReason = action.payload;
    },
    [getListAdjustmentReason.fulfilled]: (state, action) => {
      state.dataListAdjustmentReason = action.payload;
      state.loading = false;
    },
    [getListAdjustmentReason.rejected]: (state, action) => {
      state.dataListAdjustmentReason = action.payload;
      state.loading = false;
    },

    /* Get List Currency */
    [getListCurrency.pending]: (state, action) => {
      state.loading = true;
      state.dataCurrency = action.payload;
    },
    [getListCurrency.fulfilled]: (state, action) => {
      state.dataCurrency = action.payload;
      state.loading = false;
    },
    [getListCurrency.rejected]: (state, action) => {
      state.dataCurrency = action.payload;
      state.loading = false;
    },

    /* Get List Rate Type */
    [getListRateType.pending]: (state, action) => {
      state.loading = true;
      state.dataListRateType = action.payload;
    },
    [getListRateType.fulfilled]: (state, action) => {
      state.dataListRateType = action.payload;
      state.loading = false;
    },
    [getListRateType.rejected]: (state, action) => {
      state.dataListRateType = action.payload;
      state.loading = false;
    },

    /* Get List Terms Of Payment */
    [getListTermsOfPayment.pending]: (state, action) => {
      state.loading = true;
      state.dataTermsOfPayment = action.payload;
    },
    [getListTermsOfPayment.fulfilled]: (state, action) => {
      state.dataTermsOfPayment = action.payload;
      state.loading = false;
    },
    [getListTermsOfPayment.rejected]: (state, action) => {
      state.dataTermsOfPayment = action.payload;
      state.loading = false;
    },

    /* Get Select List Terms Of Payment */
    [getSelectTOP.pending]: (state, action) => {
      state.loading = true;
      state.dataListSelectTOP = action.payload;
    },
    [getSelectTOP.fulfilled]: (state, action) => {
      state.dataListSelectTOP = action.payload;
      state.loading = false;
    },
    [getSelectTOP.rejected]: (state, action) => {
      state.dataListSelectTOP = action.payload;
      state.loading = false;
    },

    /* Get List Item */
    [getListItem.pending]: (state, action) => {
      state.loading = true;
      state.dataListItem = action.payload;
    },
    [getListItem.fulfilled]: (state, action) => {
      state.dataListItem = action.payload;
      state.loading = false;
    },
    [getListItem.rejected]: (state, action) => {
      state.dataListItem = action.payload;
      state.loading = false;
    },

    // Get Detail Adjustment Billing
    [getDetailAdjustmentBilling.pending]: (state, action) => {
      state.loading = true;
      state.dataDetail = action.payload;
    },
    [getDetailAdjustmentBilling.fulfilled]: (state, action) => {
      state.dataDetail = action.payload;
      state.loading = false;
    },
    [getDetailAdjustmentBilling.rejected]: (state, action) => {
      state.dataDetail = action.payload;
      state.loading = false;
    },

    // Approve Or Reject Adjustment Billing
    [approveOrRejectAdjustmentBilling.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectAdjustmentBilling.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectAdjustmentBilling.rejected]: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },

    // Get Invoice Information
    [getInvoiceInformation.pending]: (state) => {
      state.loading = true;
      state.dataInvoiceInfo = null;
    },
    [getInvoiceInformation.fulfilled]: (state, action) => {
      state.dataInvoiceInfo = action.payload;
      state.loading = false;
    },
    [getInvoiceInformation.rejected]: (state) => {
      state.dataInvoiceInfo = null;
      state.loading = false;
    },

    // Get Invoice Billing Item List
    [getInvoiceBillingItemList.pending]: (state) => {
      state.loading = true;
      state.dataBillingItemList = [];
    },
    [getInvoiceBillingItemList.fulfilled]: (state, action) => {
      state.dataBillingItemList = action.payload;
      state.loading = false;
    },
    [getInvoiceBillingItemList.rejected]: (state) => {
      state.dataBillingItemList = [];
      state.loading = false;
    },
  },
});

const { reducer } = adjustmentBillingSlice;
export default reducer;
