import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError
} from "../../general_slice";

const initialState = {
  loading: false,
  loading_detailIr: false,
  loading_detailDraftIr: false,
  loading_createUpdateIr: false,
  loading_detailIrDetailAttachment: false,
  loading_detailIrApprovalHierarchyDetails: false,
  loading_listIrApproval: false,
  list_irDetailAttachment: [],
  pagination_irDetailAttachment: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10
  },

  // --- Actions (approve / reject / inactivate) ---
  loading_approveRejectIr: false,
  loading_approveIr: false,
  loading_rejectIr: false,
  loading_inactivateIr: false,

  // --- Supporting / Form Options ---
  loading_listIrApprovalOption: false,
  list_irApprovalHierarchy: [],
  loading_listIrApprovalHierarchyEmployee: false,
  detail_irApprovalHierarchy: [],
  list_irAttachmentCategory: [],
  loading_listIrAccountStandard: false,
  list_irAccountStandard: [],
  pagination_irAccountStandard: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10
  },
  list_invoiceRelation: [],
  pagination_invoiceRelation: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10
  },
  list_invoiceRelationApproval: [],
  pagination_invoiceRelationApproval: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10
  },
  detail_invoiceRelation: {},
  detailDraft_invoiceRelation: {},
  data_irApprovalHistory: {}
};

export const createInvoiceRelation = createAsyncThunk(
  "CREATE_INVOICE_RELATION",
  async ({ body: createBody, attachments = [], action }, thunkAPI) => {
    try {
      const createUrl = "/v1/dbs/api/invoice-relation/create";
      const response = await accountManagementService.createData(
        createUrl,
        createBody
      );

      const { id } = response.data;

      const uploadUrl = `/v1/dbs/api/invoice-relation/upload-attachment`;

      const uploadPromises = attachments.map((attachment) =>
        accountManagementService.uploadAttachment(uploadUrl, {
          files: attachment.file,
          category: attachment.fileCategoryId,
          refId: id,
          action
        })
      );

      await Promise.all(uploadPromises);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${createBody?.action === "draft" ? "drafted" : "submitted"}.`,
        return: false
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      let message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      if (Math.floor((error.response.data.code || 0) / 100) !== 4)
        message = "An unknown error occured";

      const errorBody = {
        title: "Failed",
        description: `Your data was not ${createBody?.action === "draft" ? "drafted" : "submitted"}. ${message}.`
      };

      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const updateInvoiceRelation = createAsyncThunk(
  "UPDATE_INVOICE_RELATION",
  async ({ id, body: updateBody, attachments = [], action }, thunkAPI) => {
    try {
      const updateUrl = `/v1/dbs/api/invoice-relation/${id}`;
      const response = await accountManagementService.updateData(
        updateUrl,
        updateBody
      );

      const uploadUrl = `/v1/dbs/api/invoice-relation/upload-attachment`;

      const uploadPromises = attachments.map((attachment) =>
        accountManagementService.uploadAttachment(uploadUrl, {
          id: attachment.id,
          files: attachment.file,
          category: attachment.fileCategoryId,
          refId: id,
          action,
        })
      );

      await Promise.all(uploadPromises);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${updateBody?.action === "draft" ? "drafted" : "submitted"}.`,
        return: false
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      let message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      if (Math.floor((error.response.data.code || 0) / 100) !== 4)
        message = "An unknown error occured";

      const errorBody = {
        title: "Failed",
        description: `Your data was not ${updateBody?.action === "draft" ? "drafted" : "submitted"}. ${message}.`
      };

      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDetailInvoiceRelation = createAsyncThunk(
  "GET_DETAIL_INVOICE_RELATION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDetailDraftInvoiceRelation = createAsyncThunk(
  "GET_DETAIL_DRAFT_INVOICE_RELATION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/detail-draft/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getIrApprovalHierarchy = createAsyncThunk(
  "GET_IR_APPROVAL_HIERARCHY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/approval-hierarchies`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDetailIrApprovalHierarchy = createAsyncThunk(
  "GET_DETAIL_IR_APPROVAL_HIERARCHY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/approval-hierarchy/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getIrAttachmentCategory = createAsyncThunk(
  "GET_IR_ATTACHMENT_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/attachment-category`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getIrAccountStandard = createAsyncThunk(
  "GET_IR_ACCOUNT_STANDARD",
  async ({ id, body, isLoadMore }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/list-account/${id}`;

      const response = await accountManagementService.updateDataWithMethodPost(
        url,
        body
      );
      return {
        ...response.data,
        isLoadMore
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const approveOrRejectInvoiceRelation = createAsyncThunk(
  "APPROVE_OR_REJECT_INVOICE_RELATION",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/approve";
      const response = await accountManagementService.activationWithRemark(
        url,
        body
      );

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "approve" ? "approved" : "rejected"}.`,
        return: false
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
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${action === "approve" ? "approved" : "rejected"}. ${message}.`
        };
        thunkAPI.dispatch(showModalError(errorBody));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${action === "approve" ? "approved" : "rejected"}. An unknown error occured.`
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const approveOrRejectInactiveInvoiceRelation = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_INVOICE_RELATION",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/approve-inactive";
      const response = await accountManagementService.activationWithRemark(
        url,
        body
      );

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "approve" ? "approved" : "rejected"}.`,
        return: false
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
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${action === "approve" ? "approved" : "rejected"}. ${message}.`
        };
        thunkAPI.dispatch(showModalError(errorBody));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${action === "approve" ? "approved" : "rejected"}. An unknown error occured.`
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const inactivateInvoiceRelation = createAsyncThunk(
  "INACTIVATE_INVOICE_RELATION",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/inactive";
      const response = await accountManagementService.activationWithRemark(
        url,
        body
      );

      const successBody = {
        title: `Successful`,
        description: `Your data has been submitted`,
        return: false
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
        const errorBody = {
          title: "Failed",
          description: `Your data was not submitted. ${message}.`
        };
        thunkAPI.dispatch(showModalError(errorBody));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not submitted. An unknown error occured.`
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getIrColumnApi = createAsyncThunk(
  "GET_IR_COLUMN_API",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/list-search-column";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getIrConditionApi = createAsyncThunk(
  "GET_IR_CONDITION_API",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/list-search-condition";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getIrOperatorApi = createAsyncThunk(
  "GET_IR_OPERATOR_API",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/list-search-operator";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getInvoiceRelationApproval = createAsyncThunk(
  "GET_INVOICE_RELATION_APPROVAL",
  async ({ id, body, isLoadMore }, thunkAPI) => {
    try {
      body = {
        ...body,
        listType: "approval"
      }

      const url = `/v1/dbs/api/invoice-relation/list/${id}`;
      const response = await accountManagementService.updateDataWithMethodPost(
        url,
        body
      );
      return {
        ...response.data,
        isLoadMore
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getInvoiceRelation = createAsyncThunk(
  "GET_INVOICE_RELATION",
  async ({ id, body, isLoadMore }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/list/${id}`;
      const response = await accountManagementService.updateDataWithMethodPost(
        url,
        body
      );
      return {
        ...response.data,
        isLoadMore
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const downloadInvoiceRelation = createAsyncThunk(
  "DOWNLOAD_INVOICE_RELATION",
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/download/${id}`;
      const response = await accountManagementService.downloadFile(url, body);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const approveOrRejectAllInvoiceRelation = createAsyncThunk(
  "APPROVE_OR_REJECT_ALL_INVOICE_RELATION",
  async ({ body, inactiveBody, action }, thunkAPI) => {
    try {
      // Process active invoice relations
      if (body && body.length > 0) {
        const approveUrl = "/v1/dbs/api/invoice-relation/approve";
        await accountManagementService.activationWithRemark(approveUrl, body);
      }

      // Process inactive invoice relations
      if (inactiveBody && inactiveBody.length > 0) {
        const approveInactiveUrl = "/v1/dbs/api/invoice-relation/approve-inactive";
        await accountManagementService.activationWithRemark(approveInactiveUrl, inactiveBody);
      }

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action}.`,
        return: false
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      
      return { body, inactiveBody, action };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        description: `Your data was not ${action}. ${message}.`
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getIrApprovalHistory = createAsyncThunk(
  "GET_IR_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/approval-history/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const invoiceRelationSlice = createSlice({
  name: "invoiceRelation",
  initialState,
  extraReducers: {
    /** Get Detail Invoice Relation */
    [getDetailInvoiceRelation.pending]: (state) => {
      state.loading_detailIr = true;
    },
    [getDetailInvoiceRelation.fulfilled]: (state, action) => {
      state.detail_invoiceRelation = action.payload?.result || {};
      state.loading_detailIr = false;
    },
    [getDetailInvoiceRelation.rejected]: (state, action) => {
      state.detail_invoiceRelation = {};
      state.loading_detailIr = false;
    },

    /** Get Detail Draft Invoice Relation */
    [getDetailDraftInvoiceRelation.pending]: (state) => {
      state.loading_detailDraftIr = true;
    },
    [getDetailDraftInvoiceRelation.fulfilled]: (state, action) => {
      state.detailDraft_invoiceRelation = action.payload?.result || {};
      state.loading_detailDraftIr = false;
    },
    [getDetailDraftInvoiceRelation.rejected]: (state) => {
      state.detailDraft_invoiceRelation = {};
      state.loading_detailDraftIr = false;
    },

    /** Create Invoice Relation */
    [createInvoiceRelation.pending]: (state) => {
      state.loading_createUpdateIr = true;
    },
    [createInvoiceRelation.fulfilled]: (state) => {
      state.loading_createUpdateIr = false;
    },
    [createInvoiceRelation.rejected]: (state) => {
      state.loading_createUpdateIr = false;
    },

    /** Update Invoice Relation */
    [updateInvoiceRelation.pending]: (state) => {
      state.loading_createUpdateIr = true;
    },
    [updateInvoiceRelation.fulfilled]: (state) => {
      state.loading_createUpdateIr = false;
    },
    [updateInvoiceRelation.rejected]: (state) => {
      state.loading_createUpdateIr = false;
    },

    /** Get Invoice Relation Approval Hierarchy */
    [getIrApprovalHierarchy.pending]: (state) => {
      state.loading_listIrApprovalOption = true;
    },
    [getIrApprovalHierarchy.fulfilled]: (state, action) => {
      state.list_irApprovalHierarchy = action.payload;
      state.loading_listIrApprovalOption = false;
    },
    [getIrApprovalHierarchy.rejected]: (state) => {
      state.list_irApprovalHierarchy = [];
      state.loading_listIrApprovalOption = false;
    },

    /** Get Invoice Relation Detail Approval Hierarchy */
    [getDetailIrApprovalHierarchy.pending]: (state) => {
      state.loading_listIrApprovalHierarchyEmployee = true;
    },
    [getDetailIrApprovalHierarchy.fulfilled]: (state, action) => {
      state.detail_irApprovalHierarchy = action.payload;
      state.loading_listIrApprovalHierarchyEmployee = false;
    },
    [getDetailIrApprovalHierarchy.rejected]: (state) => {
      state.detail_irApprovalHierarchy = [];
      state.loading_listIrApprovalHierarchyEmployee = false;
    },

    /** Get Invoice Relation Attachment Category */
    [getIrAttachmentCategory.pending]: (state) => {
      state.loading = true;
    },
    [getIrAttachmentCategory.fulfilled]: (state, action) => {
      state.list_irAttachmentCategory = action.payload;
      state.loading = false;
    },
    [getIrAttachmentCategory.rejected]: (state) => {
      state.list_irAttachmentCategory = [];
      state.loading = false;
    },

    /** Get Invoice Relation Account Standard */
    [getIrAccountStandard.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listIrAccountStandard = true;
      }
    },
    [getIrAccountStandard.fulfilled]: (state, action) => {
      state.loading_listIrAccountStandard = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        const resultWithIds = result.map((record) => ({
          ...record,
          id: record.id || record.accountId
        }));

        if (isLoadMore) {
          const currentIds = new Set(
            state.list_irAccountStandard.map((item) => item.accountId)
          );
          const filteredResult = resultWithIds.filter(
            (resultItem) => !currentIds.has(resultItem.accountId)
          );

          state.list_irAccountStandard = [
            ...state.list_irAccountStandard,
            ...filteredResult
          ];
        } else state.list_irAccountStandard = resultWithIds;
      }

      state.pagination_irAccountStandard = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10
      };
    },
    [getIrAccountStandard.rejected]: (state, action) => {
      state.loading_listIrAccountStandard = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_irAccountStandard = [];
        state.pagination_irAccountStandard = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10
        };
      }
    },

    /** Approve or Reject Invoice Relation */
    [approveOrRejectInvoiceRelation.pending]: (state) => {
      state.loading_approveRejectIr = true;
    },
    [approveOrRejectInvoiceRelation.fulfilled]: (state) => {
      state.loading_approveRejectIr = false;
    },
    [approveOrRejectInvoiceRelation.rejected]: (state) => {
      state.loading_approveRejectIr = false;
    },

    /** Approve or Reject Inactive Invoice Relation */
    [approveOrRejectInactiveInvoiceRelation.pending]: (state) => {
      state.loading_approveRejectIr = true;
    },
    [approveOrRejectInactiveInvoiceRelation.fulfilled]: (state) => {
      state.loading_approveRejectIr = false;
    },
    [approveOrRejectInactiveInvoiceRelation.rejected]: (state) => {
      state.loading_approveRejectIr = false;
    },

    /** Inactivate Invoice Relation */
    [inactivateInvoiceRelation.pending]: (state) => {
      state.loading_inactivateIr = true;
    },
    [inactivateInvoiceRelation.fulfilled]: (state) => {
      state.loading_inactivateIr = false;
    },
    [inactivateInvoiceRelation.rejected]: (state) => {
      state.loading_inactivateIr = false;
    },

    /** Get Invoice Relation Column API  */
    [getIrColumnApi.pending]: (state) => {
      state.loading = true;
    },
    [getIrColumnApi.fulfilled]: (state, action) => {
      state.data_globalTypeColumn = action.payload;
      state.loading = false;
    },
    [getIrColumnApi.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Invoice Relation Condition API  */
    [getIrConditionApi.pending]: (state) => {
      state.loading = true;
    },
    [getIrConditionApi.fulfilled]: (state, action) => {
      state.data_globalTypeCondition = action.payload;
      state.loading = false;
    },
    [getIrConditionApi.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Invoice Relation Operator API  */
    [getIrOperatorApi.pending]: (state) => {
      state.loading = true;
    },
    [getIrOperatorApi.fulfilled]: (state, action) => {
      state.data_globalTypeOperator = action.payload;
      state.loading = false;
    },
    [getIrOperatorApi.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Invoice Relation Approval */
    [getInvoiceRelationApproval.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listIrApproval = true;
      }
    },
    [getInvoiceRelationApproval.fulfilled]: (state, action) => {
      state.loading_listIrApproval = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          state.list_invoiceRelationApproval = [
            ...state.list_invoiceRelationApproval,
            ...result
          ];
        } else {
          state.list_invoiceRelationApproval = result;
        }
      }

      state.pagination_invoiceRelationApproval = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10
      };
    },
    [getInvoiceRelationApproval.rejected]: (state, action) => {
      state.loading_listIrApproval = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_invoiceRelationApproval = [];
        state.pagination_invoiceRelationApproval = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10
        };
      }
    },

    /** Get Invoice Relation */
    [getInvoiceRelation.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listIr = true;
      }
    },
    [getInvoiceRelation.fulfilled]: (state, action) => {
      state.loading_listIr = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          state.list_invoiceRelation = [
            ...state.list_invoiceRelation,
            ...result
          ];
        } else {
          state.list_invoiceRelation = result;
        }
      }

      state.pagination_invoiceRelation = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10
      };
    },
    [getInvoiceRelation.rejected]: (state, action) => {
      state.loading_listIr = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_invoiceRelation = [];
        state.pagination_invoiceRelation = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10
        };
      }
    },

    /** Download Invoice Relation */
    [downloadInvoiceRelation.pending]: (state) => {
      state.loading = true;
    },
    [downloadInvoiceRelation.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadInvoiceRelation.rejected]: (state) => {
      state.loading = false;
    },

    /** Approve or Reject All Invoice Relation */
    [approveOrRejectAllInvoiceRelation.pending]: (state) => {
      state.loading_approveIr = true;
      state.loading_rejectIr = true;
    },
    [approveOrRejectAllInvoiceRelation.fulfilled]: (state) => {
      state.loading_approveIr = false;
      state.loading_rejectIr = false;
    },
    [approveOrRejectAllInvoiceRelation.rejected]: (state) => {
      state.loading_approveIr = false;
      state.loading_rejectIr = false;
    },

    /** Get Invoice Relation Approval History */
    [getIrApprovalHistory.pending]: (state) => {
      state.loading = true;
    },
    [getIrApprovalHistory.fulfilled]: (state, action) => {
      state.data_irApprovalHistory = action.payload;
      state.loading = false;
    },
    [getIrApprovalHistory.rejected]: (state) => {
      state.data_irApprovalHistory = {};
      state.loading = false;
    }
  }
});
const { reducer } = invoiceRelationSlice;
export default reducer;

