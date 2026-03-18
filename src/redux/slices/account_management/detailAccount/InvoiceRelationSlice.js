import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError
} from "../../general_slice";

const initialState = {
  // --- List ---
  loading_listIr: false,
  list_invoiceRelation: [],
  pagination_invoiceRelation: { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 },
  loading_listIrApproval: false,
  list_invoiceRelationApproval: [],
  pagination_invoiceRelationApproval: { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 },

  // --- Detail / CRUD ---
  loading_detailIr: false,
  detail_invoiceRelation: {},
  loading_detailDraftIr: false,
  detailDraft_invoiceRelation: {},
  loading_createUpdateIr: false,
  loading_detailIrDetailAttachment: false,
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
  data_irApprovalHierarchy: [],
  loading_detailIrApprovalHierarchyDetails: false,
  detail_irApprovalHierarchy: [],
  data_irAttachmentCategory: [],
  loading_listIrAccountStandard: false,
  list_irAccountStandard: [],
  pagination_irAccountStandard: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10
  },

  // --- History & Shared Loading ---
  loading: false, // shared: attachment category, column/condition/operator, approval history
  data_irApprovalHistory: {},
};

// --- List ---

/**
 * Fetches a paginated list of invoice relations for a given account.
 * Supports incremental load-more pagination.
 * @param {{ id: string, body: object, isLoadMore: boolean }} args
 */
export const getInvoiceRelation = createAsyncThunk(
  "GET_INVOICE_RELATION",
  async ({ id, body, isLoadMore }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/list/${id}`;

      const response = await accountManagementService.updateDataWithMethodPost(url, body, {
        headers: { "Accept": "application/json, text/plain, */*" }
      });
      return {
        ...response.data,
        isLoadMore,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Fetches a paginated list of invoice relations pending approval for a given account.
 * Supports incremental load-more pagination.
 * @param {{ id: string, body: object, isLoadMore: boolean }} args
 */
export const getInvoiceRelationApproval = createAsyncThunk(
  "GET_INVOICE_RELATION_APPROVAL",
  async ({ id, body, isLoadMore }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/list/${id}`;

      body = {
        ...body,
        listType: "approval",
      }

      const response = await accountManagementService.updateDataWithMethodPost(url, body, {
        headers: { "Accept": "application/json, text/plain, */*" }
      });
      return {
        ...response.data,
        isLoadMore,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// --- Detail / CRUD ---

/**
 * Fetches the detail of a submitted invoice relation by ID.
 * @param {string} id
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
 * Fetches the detail of a draft invoice relation by ID.
 * @param {string} id
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
 * Creates a new invoice relation and uploads any provided attachments.
 * @param {{ body: object, attachments: Array, action: string }} args
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

/**
 * Updates an existing invoice relation and re-uploads any provided attachments.
 * @param {{ id: string, body: object, attachments: Array, action: string }} args
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

// --- Actions (approve / reject / inactivate) ---

/**
 * Approves or rejects a single invoice relation.
 * @param {{ body: object, action: string }} args
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

/**
 * Approves or rejects an inactive invoice relation.
 * @param {{ body: object, action: string }} args
 */
export const approveOrRejectInactiveInvoiceRelation = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_INVOICE_RELATION",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/approve-inactive";
      await accountManagementService.activationWithRemark(
        url,
        body
      );

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "approve" ? "approved" : "rejected"}.`,
        return: false
      };

      thunkAPI.dispatch(showModalSuccess(successBody));
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

/**
 * Bulk-approves or bulk-rejects invoice relations, handling both active and inactive records.
 * @param {{ body: Array, inactiveBody: Array, action: string }} args
 */
export const approveOrRejectAllInvoiceRelation = createAsyncThunk(
  "APPROVE_OR_REJECT_ALL_INVOICE_RELATION",
  async ({ body, inactiveBody, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/approve";
      const inactiveUrl = "/v1/dbs/api/invoice-relation/approve-inactive";

      await Promise.all([
        body.length ? accountManagementService.activationWithRemark(url, body, {
          headers: {
            "Accept": "application/json"
          }
        }) : null,
        inactiveBody.length ? accountManagementService.activationWithRemark(inactiveUrl, inactiveBody, {
          headers: {
            "Accept": "application/json"
          }
        }) : null,
      ])

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action}.`,
        return: false,
      };

      thunkAPI.dispatch(showModalSuccess(successBody))

      return {
        action
      };
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
        description: `Your data was not ${action === "APPROVE" ? 'approved' : 'rejected'}. ${message}.`,
      };

      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Submits an inactivation request for an invoice relation.
 * @param {{ body: object }} args
 */
export const inactivateInvoiceRelation = createAsyncThunk(
  "INACTIVATE_INVOICE_RELATION",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/inactive";

      await accountManagementService.activationWithRemark(
        url,
        body
      );

      const successBody = {
        title: `Successful`,
        description: `Your data has been submitted`,
        return: false
      };

      thunkAPI.dispatch(showModalSuccess(successBody));
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

// --- Supporting / Form Options ---

/**
 * Fetches the list of approval hierarchies available for invoice relations.
 */
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

/**
 * Fetches the detail of a specific approval hierarchy by ID.
 * @param {string} id
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

/**
 * Fetches a paginated list of account standards for a given invoice relation.
 * Supports incremental load-more pagination.
 * @param {{ id: string, body: object, isLoadMore: boolean }} args
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
 * Fetches the list of searchable columns for invoice relation search filters.
 */
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

/**
 * Fetches the list of search conditions for invoice relation search filters.
 */
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

/**
 * Fetches the list of search operators for invoice relation search filters.
 */
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

// --- History & Export ---

/**
 * Fetches the approval history for a specific invoice relation.
 * @param {string} id
 */
export const getIrApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_INVOICE_RELATION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/approval-history/${id}`;
      const response = await accountManagementService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Downloads invoice relation data as an Excel file.
 * @param {{ searchs: string, page: number, size: number, sort: string, id: string, body: object }} args
 */
export const downloadInvoiceRelation = createAsyncThunk(
  "DOWNLOAD_INVOICE_RELATION",
  async ({ searchs, page, size, sort, id, body }, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams;

      if (page)
        queryParams.append("page", page);
      if (size)
        queryParams.append("size", size);
      if (sort)
        queryParams.append("sort", sort);
      if (searchs)
        queryParams.append("searchs", searchs);

      const url = `/v1/dbs/api/invoice-relation/export-excel/${id}`;
      const response = await accountManagementService.downloadDataAdvanced(url, body);
      return response;
    } catch (response) {
      thunkAPI.dispatch(validateError({ error: response, action: "DOWNLOAD_INVOICE_RELATION", back: false }));
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

// --- Slice ---

const invoiceRelationSlice = createSlice({
  name: "invoiceRelation",
  initialState,
  extraReducers: {
    // ── List ──
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
          const currentIds = new Set(state.list_invoiceRelation.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_invoiceRelation = [
            ...state.list_invoiceRelation,
            ...filteredResult,
          ];
        }
        else
          state.list_invoiceRelation = result;
      }

      state.pagination_invoiceRelation = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getInvoiceRelation.rejected]: (state, action) => {
      state.loading_listIr = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_invoiceRelation = [];
        state.pagination_invoiceRelation = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

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
          const currentIds = new Set(state.list_invoiceRelationApproval.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_invoiceRelationApproval = [
            ...state.list_invoiceRelationApproval,
            ...filteredResult,
          ];
        }
        else
          state.list_invoiceRelationApproval = result;
      }

      state.pagination_invoiceRelationApproval = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getInvoiceRelationApproval.rejected]: (state, action) => {
      state.loading_listIrApproval = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_invoiceRelationApproval = [];
        state.pagination_invoiceRelationApproval = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    // --- Detail / CRUD ---
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

    [createInvoiceRelation.pending]: (state) => {
      state.loading_createUpdateIr = true;
    },
    [createInvoiceRelation.fulfilled]: (state) => {
      state.loading_createUpdateIr = false;
    },
    [createInvoiceRelation.rejected]: (state) => {
      state.loading_createUpdateIr = false;
    },

    [updateInvoiceRelation.pending]: (state) => {
      state.loading_createUpdateIr = true;
    },
    [updateInvoiceRelation.fulfilled]: (state) => {
      state.loading_createUpdateIr = false;
    },
    [updateInvoiceRelation.rejected]: (state) => {
      state.loading_createUpdateIr = false;
    },

    // --- Actions (approve / reject / inactivate) ---
    [approveOrRejectInvoiceRelation.pending]: (state) => {
      state.loading_approveRejectIr = true;
    },
    [approveOrRejectInvoiceRelation.fulfilled]: (state) => {
      state.loading_approveRejectIr = false;
    },
    [approveOrRejectInvoiceRelation.rejected]: (state) => {
      state.loading_approveRejectIr = false;
    },

    [approveOrRejectInactiveInvoiceRelation.pending]: (state) => {
      state.loading_approveRejectIr = true;
    },
    [approveOrRejectInactiveInvoiceRelation.fulfilled]: (state) => {
      state.loading_approveRejectIr = false;
    },
    [approveOrRejectInactiveInvoiceRelation.rejected]: (state) => {
      state.loading_approveRejectIr = false;
    },

    [approveOrRejectAllInvoiceRelation.pending]: (state, action) => {
      if (action.meta.arg?.action === "approved")
        state.loading_approveIr = true;
      else if (action.meta.arg?.action === "rejected")
        state.loading_rejectIr = true;
    },
    [approveOrRejectAllInvoiceRelation.fulfilled]: (state, action) => {
      if (action.meta.arg?.action === "approved")
        state.loading_approveIr = false;
      else if (action.meta.arg?.action === "rejected")
        state.loading_rejectIr = false;
    },
    [approveOrRejectAllInvoiceRelation.rejected]: (state, action) => {
      if (action.meta.arg?.action === "approved")
        state.loading_approveIr = false;
      else if (action.meta.arg?.action === "rejected")
        state.loading_rejectIr = false;
    },

    [inactivateInvoiceRelation.pending]: (state) => {
      state.loading_inactivateIr = true;
    },
    [inactivateInvoiceRelation.fulfilled]: (state) => {
      state.loading_inactivateIr = false;
    },
    [inactivateInvoiceRelation.rejected]: (state) => {
      state.loading_inactivateIr = false;
    },

    // --- Supporting / Form Options ---
    [getIrApprovalHierarchy.pending]: (state) => {
      state.loading_listIrApprovalOption = true;
    },
    [getIrApprovalHierarchy.fulfilled]: (state, action) => {
      state.data_irApprovalHierarchy = action.payload;
      state.loading_listIrApprovalOption = false;
    },
    [getIrApprovalHierarchy.rejected]: (state) => {
      state.data_irApprovalHierarchy = [];
      state.loading_listIrApprovalOption = false;
    },

    [getDetailIrApprovalHierarchy.pending]: (state) => {
      state.loading_detailIrApprovalHierarchyDetails = true;
    },
    [getDetailIrApprovalHierarchy.fulfilled]: (state, action) => {
      state.detail_irApprovalHierarchy = action.payload;
      state.loading_detailIrApprovalHierarchyDetails = false;
    },
    [getDetailIrApprovalHierarchy.rejected]: (state) => {
      state.detail_irApprovalHierarchy = [];
      state.loading_detailIrApprovalHierarchyDetails = false;
    },

    [getIrAttachmentCategory.pending]: (state) => {
      state.loading = true;
    },
    [getIrAttachmentCategory.fulfilled]: (state, action) => {
      state.data_irAttachmentCategory = action.payload;
      state.loading = false;
    },
    [getIrAttachmentCategory.rejected]: (state) => {
      state.data_irAttachmentCategory = [];
      state.loading = false;
    },

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

    // --- History & Export ---
    [getIrApprovalHistory.pending]: (state) => {
      state.loading = true;
    },
    [getIrApprovalHistory.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_irApprovalHistory = action.payload;
    },
    [getIrApprovalHistory.rejected]: (state) => {
      state.loading = false;
    },

    [downloadInvoiceRelation.pending]: (state) => {},
    [downloadInvoiceRelation.fulfilled]: (state) => {},
    [downloadInvoiceRelation.rejected]: (state) => {},
  }
});

const { reducer } = invoiceRelationSlice;
export default reducer;
