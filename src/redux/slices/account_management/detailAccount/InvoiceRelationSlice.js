import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError
} from "../../general_slice";

const initialState = {
  // --- Shared ---
  loading: false,

  // --- List ---
  loading_listIr: false,
  list_invoiceRelation: [],
  pagination_invoiceRelation: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10
  },

  // --- Detail ---
  loading_detailIr: false,
  detail_invoiceRelation: {},
  loading_detailDraftIr: false,
  detailDraft_invoiceRelation: {},
  loading_detailIrDetailAttachment: false,

  // --- Create / Update ---
  loading_createUpdateIr: false,

  // --- Approval List ---
  loading_listIrApproval: false,
  list_invoiceRelationApproval: [],
  pagination_invoiceRelationApproval: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10
  },

  // --- Approve / Reject ---
  loading_approveRejectIr: false,
  loading_approveIr: false,
  loading_rejectIr: false,

  // --- Inactivate ---
  loading_inactivateIr: false,

  // --- Form Options (approval hierarchy, attachment categories, account standard) ---
  loading_listIrApprovalOption: false,
  list_irApprovalHierarchy: [],
  loading_listIrApprovalHierarchyEmployee: false,
  loading_detailIrApprovalHierarchyDetails: false,
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

  // --- History ---
  data_irApprovalHistory: {}
};

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
 * Fetches the current (non-draft) detail of an invoice relation record.
 *
 * @param {number} id - Invoice relation ID.
 */
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

/**
 * Fetches the draft detail of an invoice relation record.
 *
 * @param {number} id - Invoice relation ID.
 */
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

/**
 * Fetches the list of approval hierarchy options for invoice relations.
 */
export const getIrApprovalHierarchy = createAsyncThunk(
  "GET_IR_APPROVAL_HIERARCHY",
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

/**
 * Fetches the list of attachment categories for invoice relations.
 */
export const getIrAttachmentCategory = createAsyncThunk(
  "GET_IR_ATTACHMENT_CATEGORY",
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
 * Fetches the paginated approval list for a given account's invoice relations.
 * Always injects `listType: "approval"` into the request body.
 * Supports infinite-scroll load-more.
 *
 * @param {object}  arg
 * @param {number}  arg.id          - Account ID.
 * @param {object}  arg.body        - Pagination / search / sort body.
 * @param {boolean} arg.isLoadMore  - If true, appends results; otherwise replaces the list.
 */
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

/**
 * Fetches the paginated invoice relation list for a given account.
 * Supports infinite-scroll load-more.
 *
 * @param {object}  arg
 * @param {number}  arg.id          - Account ID.
 * @param {object}  arg.body        - Pagination / search / sort body.
 * @param {boolean} arg.isLoadMore  - If true, appends results; otherwise replaces the list.
 */
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
      const url = `/v1/dbs/api/invoice-relation/download/${id}`;
      const response = await accountManagementService.downloadFile(url, body);
      return response.data;
    } catch (error) {
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
        description: `Your data has been ${action === "APPROVE" ? "approved" : body.action === "REJECT" ? "rejected" : ""}.`,
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
        description: `Your data was not ${action === "APPROVE" ? "approved" : body.action === "REJECT" ? "rejected" : ""}. ${message}.`
      };
      thunkAPI.dispatch(showModalError(errorBody));
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
