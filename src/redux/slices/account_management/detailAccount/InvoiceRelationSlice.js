import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import {
  setBodyError,
  showModalError,
  showModalSuccess
} from "../../general_slice";

const initialState = {
  // --- List ---
  loading_listIr: false,
  list_invoiceRelation: [],
  pagination_listIr: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10
  },
  
  // --- Approval List ---
  loading_listIrApproval: false,
  list_invoiceRelationApproval: [],
  pagination_listIrApproval: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10
  },
  loading_detailIr: false,
  detail_invoiceRelation: {},
  loading_detailDraftIr: false,
  detailDraft_invoiceRelation: {},

  // --- Create / Update ---
  loading_createUpdateIr: false,

  // --- Approve / Reject ---
  loading_approveRejectIr: false,
  loading_approveIr: false,
  loading_rejectIr: false,
  loading_inactivateIr: false,

  // --- Form Options (approval hierarchy, attachment categories, account standard) ---
  loading_listIrApprovalHierarchy: false,
  list_irApprovalHierarchy: [],
  loading_detailIrApprovalHierarchy: false,
  detail_irApprovalHierarchy: [],
  loading_listIrAttachmentCategory: false,
  list_irAttachmentCategory: [],
  loading_listIrAccount: false,
  list_irAccount: [],
  pagination_irAccount: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10
  },

  // --- History ---
  loading_irApprovalHistory: false,
  detail_irApprovalHistory: {}
};

/**
 * Fetches the paginated invoice relation list for a given account.
 * Supports infinite-scroll load-more.
 *
 * @param {object}  arg
 * @param {number}  arg.id          - Account ID.
 * @param {object}  arg.body        - Pagination / search / sort body.
 * @param {boolean} arg.isLoadMore  - If true, appends results; otherwise replaces the list.
 */
export const getInvoiceRelations = createAsyncThunk(
  "GET_INVOICE_RELATIONS",
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

/**
 * Fetches the paginated approval list for a given account's invoice relations.
 * Always injects `listType: "approval"` into the request body.
 * Supports infinite-scroll load-more.
 *
 * @param {object}  arg
 * @param {number}  arg.id          - Account ID.
 * @param {object}  arg.body        - Pagination / search / sort body.
 * @param {boolean} arg.isLoadMore  - If true, appends results; otherwise replaces the list.
 */
export const getInvoiceRelationApprovals = createAsyncThunk(
  "GET_INVOICE_RELATION_APPROVALS",
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

/**
 * Fetches the current (non-draft) detail of an invoice relation record.
 *
 * @param {number} id - Invoice relation ID.
 */
export const getInvoiceRelation = createAsyncThunk(
  "GET_INVOICE_RELATION",
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

/**
 * Fetches the draft detail of an invoice relation record.
 *
 * @param {number} id - Invoice relation ID.
 */
export const getInvoiceRelationDraft = createAsyncThunk(
  "GET_INVOICE_RELATION_DRAFT",
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

/**
 * Creates a new invoice relation record, then uploads any attachments in parallel.
 * Dispatches a success or error modal on completion.
 *
 * @param {object}   arg
 * @param {object}   arg.body                - Request body for the create API.
 * @param {object[]} [arg.attachments=[]]    - Attachments to upload after creation.
 * @param {string}   arg.action              - `"draft"` or `"submit"` — used in the upload payload.
 */
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

      if (Math.floor((error.response?.data?.code || 0) / 100) !== 4)
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

/**
 * Updates an existing invoice relation record, then uploads any attachments in parallel.
 * Dispatches a success or error modal on completion.
 *
 * @param {object}   arg
 * @param {number}   arg.id                  - ID of the invoice relation to update.
 * @param {object}   arg.body                - Request body for the update API.
 * @param {object[]} [arg.attachments=[]]    - Attachments to upload after update.
 * @param {string}   arg.action              - `"draft"` or `"submit"` — used in the upload payload.
 */
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

      if (Math.floor((error.response?.data?.code || 0) / 100) !== 4)
        message = "An unknown error occured";

      const errorBody = {
        title: "Failed",
        description: `Your data was not ${updateBody?.action === "draft" ? "drafted" : "submitted"}. ${message}.`
      };

      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

/**
 * Fetches the list of approval hierarchy options for invoice relations.
 */
export const getIrApprovalHierarchies = createAsyncThunk(
  "GET_IR_APPROVAL_HIERARCHIES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/approval-hierarchies`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Fetches the employee list for a specific approval hierarchy.
 *
 * @param {number} id - Approval hierarchy ID.
 */
export const getIrApprovalHierarchy = createAsyncThunk(
  "GET_IR_APPROVAL_HIERARCHY",
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

/**
 * Fetches the list of attachment categories for invoice relations.
 */
export const getIrAttachmentCategories = createAsyncThunk(
  "GET_IR_ATTACHMENT_CATEGORIES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/attachment-category`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Fetches a paginated list of account standards eligible for invoice relation.
 * Supports infinite-scroll load-more by appending to the existing list when `isLoadMore` is true.
 *
 * @param {object}  arg
 * @param {number}  arg.id          - Account ID used to scope the list.
 * @param {object}  arg.body        - Pagination / search body.
 * @param {boolean} arg.isLoadMore  - If true, appends results; otherwise replaces the list.
 */
export const getIrAccounts = createAsyncThunk(
  "GET_IR_ACCOUNTS",
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

/**
 * Approves or rejects an active invoice relation record.
 * Dispatches a success or error modal on completion.
 *
 * @param {object} arg
 * @param {object} arg.body    - Request body (IDs, remark, hierarchy).
 * @param {string} arg.action  - `"approve"` or `"reject"`.
 */
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
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
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

/**
 * Approves or rejects an inactive invoice relation record (inactivation request).
 * Dispatches a success or error modal on completion.
 *
 * @param {object} arg
 * @param {object} arg.body    - Request body (IDs, remark, hierarchy).
 * @param {string} arg.action  - `"approve"` or `"reject"`.
 */
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
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
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

/**
 * Batch-approves or batch-rejects a mixed set of active and inactive invoice relations.
 * Calls the active-approve and inactive-approve endpoints independently based on which arrays are populated.
 * Dispatches a success or error modal on completion.
 *
 * @param {object}   arg
 * @param {object[]} arg.body          - Active invoice relation records to process.
 * @param {object[]} arg.inactiveBody  - Inactive invoice relation records to process.
 * @param {string}   arg.action        - `"approved"` or `"rejected"` — drives the loading state and modal message.
 */
export const approveOrRejectAllInvoiceRelation = createAsyncThunk(
  "APPROVE_OR_REJECT_ALL_INVOICE_RELATION",
  async ({ body, inactiveBody, action }, thunkAPI) => {
    try {
      const approveUrl = "/v1/dbs/api/invoice-relation/approve";
      const approveInactiveUrl = "/v1/dbs/api/invoice-relation/approve-inactive";

      await Promise.all([
        body && body.length > 0
          ? accountManagementService.activationWithRemark(approveUrl, body)
          : null,
        inactiveBody && inactiveBody.length > 0
          ? accountManagementService.activationWithRemark(approveInactiveUrl, inactiveBody)
          : null,
      ].filter(Boolean));

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "APPROVE" ? "approved" : action === "REJECT" ? "rejected" : ""}.`,
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
        description: `Your data was not ${action === "APPROVE" ? "approved" : action === "REJECT" ? "rejected" : ""}. ${message}.`
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Submits an inactivation request for an invoice relation record.
 * Dispatches a success or error modal on completion.
*
* @param {object} arg
 * @param {object} arg.body - Request body (ID, remark, hierarchy).
 */
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
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
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

/**
 * Downloads the invoice relation list as a file for a given account.
 *
 * @param {object} arg
 * @param {number} arg.id   - Account ID.
 * @param {object} arg.body - Search / sort / filter body.
 */
export const downloadInvoiceRelation = createAsyncThunk(
  "DOWNLOAD_INVOICE_RELATION",
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/export-excel/${id}`;
      const response = await accountManagementService.downloadDataAdvanced(url, body);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Fetches the approval history for a given invoice relation record.
 * The raw response is reshaped in `InvoiceRelation.js` into `{ create, inactive }` buckets
 * before being stored in `dataApprovalHistoryFix`.
 *
 * @param {number} id - Invoice relation ID.
 */
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
    [getInvoiceRelation.pending]: (state) => {
      state.detail_invoiceRelation = {};
      state.loading_detailIr = true;
    },
    [getInvoiceRelation.fulfilled]: (state, action) => {
      state.detail_invoiceRelation = action.payload?.result || {};
      state.loading_detailIr = false;
    },
    [getInvoiceRelation.rejected]: (state, action) => {
      state.detail_invoiceRelation = {};
      state.loading_detailIr = false;
    },

    /** Get Detail Draft Invoice Relation */
    [getInvoiceRelationDraft.pending]: (state) => {
      state.detailDraft_invoiceRelation = {};
      state.loading_detailDraftIr = true;
    },
    [getInvoiceRelationDraft.fulfilled]: (state, action) => {
      state.detailDraft_invoiceRelation = action.payload?.result || {};
      state.loading_detailDraftIr = false;
    },
    [getInvoiceRelationDraft.rejected]: (state) => {
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
    [getIrApprovalHierarchies.pending]: (state) => {
      state.list_irApprovalHierarchy = [];
      state.loading_listIrApprovalHierarchy = true;
    },
    [getIrApprovalHierarchies.fulfilled]: (state, action) => {
      state.list_irApprovalHierarchy = action.payload;
      state.loading_listIrApprovalHierarchy = false;
    },
    [getIrApprovalHierarchies.rejected]: (state) => {
      state.list_irApprovalHierarchy = [];
      state.loading_listIrApprovalHierarchy = false;
    },

    /** Get Invoice Relation Detail Approval Hierarchy */
    [getIrApprovalHierarchy.pending]: (state) => {
      state.detail_irApprovalHierarchy = [];
      state.loading_detailIrApprovalHierarchy = true;
    },
    [getIrApprovalHierarchy.fulfilled]: (state, action) => {
      state.detail_irApprovalHierarchy = action.payload;
      state.loading_detailIrApprovalHierarchy = false;
    },
    [getIrApprovalHierarchy.rejected]: (state) => {
      state.detail_irApprovalHierarchy = [];
      state.loading_detailIrApprovalHierarchy = false;
    },

    /** Get Invoice Relation Attachment Category */
    [getIrAttachmentCategories.pending]: (state) => {
      state.loading_listIrAttachmentCategory = true;
    },
    [getIrAttachmentCategories.fulfilled]: (state, action) => {
      state.list_irAttachmentCategory = action.payload;
      state.loading_listIrAttachmentCategory = false;
    },
    [getIrAttachmentCategories.rejected]: (state) => {
      state.list_irAttachmentCategory = [];
      state.loading_listIrAttachmentCategory = false;
    },

    /** Get Invoice Relation Account Standard */
    [getIrAccounts.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listIrAccount = true;
      }
    },
    [getIrAccounts.fulfilled]: (state, action) => {
      state.loading_listIrAccount = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        const resultWithIds = result.map((record) => ({
          ...record,
          id: record.id || record.accountId
        }));

        if (isLoadMore) {
          const currentIds = new Set(
            state.list_irAccount.map((item) => item.accountId)
          );
          const filteredResult = resultWithIds.filter(
            (resultItem) => !currentIds.has(resultItem.accountId)
          );

          state.list_irAccount = [
            ...state.list_irAccount,
            ...filteredResult
          ];
        } else state.list_irAccount = resultWithIds;
      }

      state.pagination_irAccount = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10
      };
    },
    [getIrAccounts.rejected]: (state, action) => {
      state.loading_listIrAccount = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_irAccount = [];
        state.pagination_irAccount = {
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

    /** Get Invoice Relation Approval */
    [getInvoiceRelationApprovals.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listIrApproval = true;
      }
    },
    [getInvoiceRelationApprovals.fulfilled]: (state, action) => {
      state.loading_listIrApproval = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_invoiceRelationApproval.map((item) => item.id));
          const filteredResult = result.filter((item) => !currentIds.has(item.id));
          state.list_invoiceRelationApproval = [
            ...state.list_invoiceRelationApproval,
            ...filteredResult
          ];
        } else {
          state.list_invoiceRelationApproval = result;
        }
      }

      state.pagination_listIrApproval = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10
      };
    },
    [getInvoiceRelationApprovals.rejected]: (state, action) => {
      state.loading_listIrApproval = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_invoiceRelationApproval = [];
        state.pagination_listIrApproval = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10
        };
      }
    },

    /** Get Invoice Relation */
    [getInvoiceRelations.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listIr = true;
      }
    },
    [getInvoiceRelations.fulfilled]: (state, action) => {
      state.loading_listIr = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_invoiceRelation.map((item) => item.id));
          const filteredResult = result.filter((item) => !currentIds.has(item.id));
          state.list_invoiceRelation = [
            ...state.list_invoiceRelation,
            ...filteredResult
          ];
        } else {
          state.list_invoiceRelation = result;
        }
      }

      state.pagination_listIr = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10
      };
    },
    [getInvoiceRelations.rejected]: (state, action) => {
      state.loading_listIr = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_invoiceRelation = [];
        state.pagination_listIr = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10
        };
      }
    },

    /** Approve or Reject All Invoice Relation */
    [approveOrRejectAllInvoiceRelation.pending]: (state, action) => {
      if (action.meta.arg?.action === "APPROVE")
        state.loading_approveIr = true;
      else if (action.meta.arg?.action === "REJECT")
        state.loading_rejectIr = true;
    },
    [approveOrRejectAllInvoiceRelation.fulfilled]: (state, action) => {
      if (action.meta.arg?.action === "APPROVE")
        state.loading_approveIr = false;
      else if (action.meta.arg?.action === "REJECT")
        state.loading_rejectIr = false;
    },
    [approveOrRejectAllInvoiceRelation.rejected]: (state, action) => {
      if (action.meta.arg?.action === "APPROVE")
        state.loading_approveIr = false;
      else if (action.meta.arg?.action === "REJECT")
        state.loading_rejectIr = false;
    },

    /** Get Invoice Relation Approval History */
    [getIrApprovalHistory.pending]: (state) => {
      state.loading_irApprovalHistory = true;
    },
    [getIrApprovalHistory.fulfilled]: (state, action) => {
      state.detail_irApprovalHistory = action.payload;
      state.loading_irApprovalHistory = false;
    },
    [getIrApprovalHistory.rejected]: (state) => {
      state.detail_irApprovalHistory = {};
      state.loading_irApprovalHistory = false;
    }
  }
});
const { reducer } = invoiceRelationSlice;
export default reducer;
