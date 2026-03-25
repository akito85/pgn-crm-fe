import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import { setBodyError, showModalError, showModalSuccess } from "../../general_slice";

const initialState = {
  // --- Shared ---
  loading: false,

  // --- List ---
  loading_listPr: false,
  list_paymentRelation: [],
  pagination_paymentRelation: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10,
  },

  // --- Detail ---
  loading_detailPr: false,
  detail_paymentRelation: {},
  loading_detailDraftPr: false,
  detailDraft_paymentRelation: {},

  // --- Create / Update ---
  loading_createUpdatePr: false,

  // --- Approval List ---
  loading_listPrApproval: false,
  list_paymentRelationApproval: [],
  pagination_paymentRelationApproval: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10,
  },

  // --- Approve / Reject ---
  loading_approveRejectPr: false,
  loading_approvePr: false,
  loading_rejectPr: false,

  // --- Inactivate ---
  loading_inactivatePr: false,

  // --- Form Options (approval hierarchy, attachment categories, account standard) ---
  loading_listPrApprovalOption: false,
  list_prApprovalOptions: [],
  loading_detailPrApprovalHierarchyDetails: false,
  list_prApprovalHierarchyDetail: [],
  data_prAttachmentCategory: [],
  loading_listPrAccountStandard: false,
  list_prAccountStandard: [],
  pagination_prAccountStandard: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10,
  },

  // --- History ---
  data_prApprovalHistory: {},
};

/**
 * Creates a new payment relation record, then uploads any attachments in parallel.
 * Dispatches a success or error modal on completion.
 *
 * @param {object}   arg
 * @param {object}   arg.body                - Request body for the create API.
 * @param {object[]} [arg.attachments=[]]    - Attachments to upload after creation.
 * @param {string}   arg.action              - `"draft"` or `"submit"` — used in the upload payload.
 */
export const createPaymentRelation = createAsyncThunk(
  "CREATE_PAYMENT_RELATION",
  async ({ body: createBody, attachments = [], action }, thunkAPI) => {
    try {
      const createUrl = "/v1/dbs/api/payment-relation/create";
      const response = await accountManagementService.createData(createUrl, createBody);

      const { id } = response.data;

      const uploadUrl = `/v1/dbs/api/payment-relation/upload-attachment`;

      const uploadPromises = attachments.map((attachment) => accountManagementService.uploadAttachment(uploadUrl, {
        files: attachment.file,
        category: attachment.fileCategoryId,
        refId: id,
        action,
      }));

      await Promise.all(uploadPromises);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${createBody?.action === "draft" ? 'drafted' : 'submitted'}.`,
        return: false,
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
        description: `Your data was not ${createBody?.action === "draft" ? 'drafted' : 'submitted'}. ${message}.`,
      };

      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Updates an existing payment relation record, then uploads any attachments in parallel.
 * Dispatches a success or error modal on completion.
 *
 * @param {object}   arg
 * @param {number}   arg.id                  - ID of the payment relation to update.
 * @param {object}   arg.body                - Request body for the update API.
 * @param {object[]} [arg.attachments=[]]    - Attachments to upload after update.
 * @param {string}   arg.action              - `"draft"` or `"submit"` — used in the upload payload.
 */
export const updatePaymentRelation = createAsyncThunk(
  "UPDATE_PAYMENT_RELATION",
  async ({ id, body: updateBody, attachments = [], action }, thunkAPI) => {
    try {
      const updateUrl = `/v1/dbs/api/payment-relation/${id}`;
      const response = await accountManagementService.updateData(updateUrl, updateBody);

      const uploadUrl = `/v1/dbs/api/payment-relation/upload-attachment`;

      const uploadPromises = attachments.map((attachment) => accountManagementService.uploadAttachment(
        uploadUrl,
        {
          id: attachment.id,
          files: attachment.file,
          category: attachment.fileCategoryId,
          refId: id,
          action,
        }
      ));

      await Promise.all(uploadPromises);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${updateBody?.action === "draft" ? 'drafted' : 'submitted'}.`,
        return: false,
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
        description: `Your data was not ${updateBody?.action === "draft" ? 'drafted' : 'submitted'}. ${message}.`,
      };

      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Fetches the current (non-draft) detail of a payment relation record.
 *
 * @param {number} id - Payment relation ID.
 */
export const getDetailPaymentRelation = createAsyncThunk(
  "GET_DETAIL_PAYMENT_RELATION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Fetches the draft detail of a payment relation record.
 *
 * @param {number} id - Payment relation ID.
 */
export const getDetailDraftPaymentRelation = createAsyncThunk(
  "GET_DETAIL_DRAFT_PAYMENT_RELATION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/detail-draft/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Fetches the list of approval hierarchy options for payment relations.
 */
export const getPrApprovalHierarchy = createAsyncThunk(
  "GET_PR_APPROVAL_HIERARCHY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/approval-hierarchies`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

/**
 * Fetches the employee list for a specific approval hierarchy.
 *
 * @param {number} id - Approval hierarchy ID.
 */
export const getDetailPrApprovalHierarchy = createAsyncThunk(
  "GET_DETAIL_PR_APPROVAL_HIERARCHY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/approval-hierarchy/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

/**
 * Fetches the list of attachment categories for payment relations.
 */
export const getPrAttachmentCategory = createAsyncThunk(
  "GET_PR_ATTACHMENT_CATEGORY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/attachment-category`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

/**
 * Fetches a paginated list of account standards eligible for payment relation.
 * Supports infinite-scroll load-more by appending to the existing list when `isLoadMore` is true.
 *
 * @param {object}  arg
 * @param {number}  arg.id          - Account ID used to scope the list.
 * @param {object}  arg.body        - Pagination / search body.
 * @param {boolean} arg.isLoadMore  - If true, appends results; otherwise replaces the list.
 */
export const getPrAccountStandard = createAsyncThunk(
  "GET_PR_ACCOUNT_STANDARD",
  async ({ id, body, isLoadMore }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/list-account/${id}`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body);
      return {
        ...response.data,
        isLoadMore,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

/**
 * Approves or rejects an active payment relation record.
 * Dispatches a success or error modal on completion.
 *
 * @param {object} arg
 * @param {object} arg.body    - Request body (IDs, remark, hierarchy).
 * @param {string} arg.action  - `"approve"` or `"reject"`.
 */
export const approveOrRejectPaymentRelation = createAsyncThunk(
  "APPROVE_OR_REJECT_PAYMENT_RELATION",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-relation/approve";
      const response = await accountManagementService.activationWithRemark(url, body);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "approve" ? "approved" : "rejected"}.`,
        return: false,
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
          description: `Your data was not ${action === "approve" ? "approved" : "rejected"}. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${action === "approve" ? "approved" : "rejected"}. An unknown error occured.`
        }
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Approves or rejects an inactive payment relation record (inactivation request).
 * Dispatches a success or error modal on completion.
 *
 * @param {object} arg
 * @param {object} arg.body    - Request body (IDs, remark, hierarchy).
 * @param {string} arg.action  - `"approve"` or `"reject"`.
 */
export const approveOrRejectInactivePaymentRelation = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_PAYMENT_RELATION",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-relation/approve-inactive";
      const response = await accountManagementService.activationWithRemark(url, body);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "approve" ? "approved" : "rejected"}.`,
        return: false,
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
          description: `Your data was not ${action === "approve" ? "approved" : "rejected"}. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${action === "approve" ? "approved" : "rejected"}. An unknown error occured.`
        }
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Submits an inactivation request for a payment relation record.
 * Dispatches a success or error modal on completion.
 *
 * @param {object} arg
 * @param {object} arg.body - Request body (ID, remark, hierarchy).
 */
export const inactivatePaymentRelation = createAsyncThunk(
  "INACTIVATE_PAYMENT_RELATION",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-relation/inactive";
      const response = await accountManagementService.activationWithRemark(url, body);

      const successBody = {
        title: `Successful`,
        description: `Your data has been submitted`,
        return: false,
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
          description: `Your data was not submitted. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not submitted. An unknown error occured.`
        }
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Fetches the paginated payment relation list for a given account.
 * Supports infinite-scroll load-more.
 *
 * @param {object}  arg
 * @param {number}  arg.id          - Account ID.
 * @param {object}  arg.body        - Pagination / search / sort body.
 * @param {boolean} arg.isLoadMore  - If true, appends results; otherwise replaces the list.
 */
export const getPaymentRelation = createAsyncThunk(
  "GET_PAYMENT_RELATION",
  async ({ id, body, isLoadMore }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/list/${id}`;
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
 * Fetches the paginated approval list for a given account's payment relations.
 * Always injects `listType: "approval"` into the request body.
 * Supports infinite-scroll load-more.
 *
 * @param {object}  arg
 * @param {number}  arg.id          - Account ID.
 * @param {object}  arg.body        - Pagination / search / sort body.
 * @param {boolean} arg.isLoadMore  - If true, appends results; otherwise replaces the list.
 */
export const getPaymentRelationApproval = createAsyncThunk(
  "GET_PAYMENT_RELATION_APPROVAL",
  async ({ id, body, isLoadMore }, thunkAPI) => {
    try {
      body = {
        ...body,
        listType: "approval"
      }

      const url = `/v1/dbs/api/payment-relation/list/${id}`;
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
 * Batch-approves or batch-rejects a mixed set of active and inactive payment relations.
 * Calls both endpoints concurrently via `Promise.all`, skipping either if its array is empty.
 * Dispatches a success or error modal on completion.
 *
 * @param {object}   arg
 * @param {object[]} arg.body          - Active payment relation records to process.
 * @param {object[]} arg.inactiveBody  - Inactive payment relation records to process.
 * @param {string}   arg.action        - `"approved"` or `"rejected"` — drives the loading state and modal message.
 */
export const approveOrRejectAllPaymentRelation = createAsyncThunk(
  "APPROVE_OR_REJECT_ALL_PAYMENT_RELATION",
  async ({ body, inactiveBody, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-relation/approve";
      const inactiveUrl = "/v1/dbs/api/payment-relation/approve-inactive";

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
      ]);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action}.`,
        return: false,
      };

      thunkAPI.dispatch(showModalSuccess(successBody));
      return null;
    } catch (error) {
      let message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response?.data?.code || 0) / 100) !== 4)
        message = "An unknown error occured"

      const errorBody = {
        title: "Failed",
        description: `Your data was not ${action}. ${message}.`,
      };

      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Downloads the payment relation list as a file for a given account.
 *
 * @param {object} arg
 * @param {number} arg.id   - Account ID.
 * @param {object} arg.body - Search / sort / filter body.
 */
export const downloadPaymentRelation = createAsyncThunk(
  "DOWNLOAD_PAYMENT_RELATION",
  async ({ body, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/export-excel/${id}`;
      const response = await accountManagementService.downloadFile(url, body);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Fetches the approval history for a given payment relation record.
 *
 * @param {number} id - Payment relation ID.
 */
export const getPrApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_PAYMENT_RELATION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/approval-history/${id}`;
      const response = await accountManagementService.getDetail(url);
      return Array.isArray(response.data) ? {} : response.data;
    } catch (error) {
      if (error.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const paymentRelationSlice = createSlice({
  name: "paymentRelation",
  initialState,
  extraReducers: {
    /** Get Detail Payment Relation */
    [getDetailPaymentRelation.pending]: (state) => {
      state.loading_detailPr = true;
    },
    [getDetailPaymentRelation.fulfilled]: (state, action) => {
      state.detail_paymentRelation = action.payload?.result || {};
      state.loading_detailPr = false;
    },
    [getDetailPaymentRelation.rejected]: (state) => {
      state.detail_paymentRelation = {};
      state.loading_detailPr = false;
    },

    /** Get Detail Draft Payment Relation */
    [getDetailDraftPaymentRelation.pending]: (state) => {
      state.loading_detailDraftPr = true;
    },
    [getDetailDraftPaymentRelation.fulfilled]: (state, action) => {
      state.detailDraft_paymentRelation = action.payload?.result || {};
      state.loading_detailDraftPr = false;
    },
    [getDetailDraftPaymentRelation.rejected]: (state) => {
      state.detailDraft_paymentRelation = {};
      state.loading_detailDraftPr = false;
    },

    /** Create Payment Relation */
    [createPaymentRelation.pending]: (state) => {
      state.loading_createUpdatePr = true;
    },
    [createPaymentRelation.fulfilled]: (state) => {
      state.loading_createUpdatePr = false;
    },
    [createPaymentRelation.rejected]: (state) => {
      state.loading_createUpdatePr = false;
    },

    /** Update Payment Relation */
    [updatePaymentRelation.pending]: (state) => {
      state.loading_createUpdatePr = true;
    },
    [updatePaymentRelation.fulfilled]: (state) => {
      state.loading_createUpdatePr = false;
    },
    [updatePaymentRelation.rejected]: (state) => {
      state.loading_createUpdatePr = false;
    },

    /** Get Payment Relation Approval Hierarchy */
    [getPrApprovalHierarchy.pending]: (state) => {
      state.list_prApprovalOptions = [];
      state.loading_listPrApprovalOption = true;
    },
    [getPrApprovalHierarchy.fulfilled]: (state, action) => {
      state.list_prApprovalOptions = action.payload;
      state.loading_listPrApprovalOption = false;
    },
    [getPrApprovalHierarchy.rejected]: (state) => {
      state.list_prApprovalOptions = [];
      state.loading_listPrApprovalOption = false;
    },

    /** Get Payment Relation Detail Approval Hierarchy */
    [getDetailPrApprovalHierarchy.pending]: (state) => {
      state.list_prApprovalHierarchyDetail = [];
      state.loading_detailPrApprovalHierarchyDetails = true;
    },
    [getDetailPrApprovalHierarchy.fulfilled]: (state, action) => {
      state.list_prApprovalHierarchyDetail = action.payload;
      state.loading_detailPrApprovalHierarchyDetails = false;
    },
    [getDetailPrApprovalHierarchy.rejected]: (state) => {
      state.list_prApprovalHierarchyDetail = [];
      state.loading_detailPrApprovalHierarchyDetails = false;
    },

    /** Get Payment Relation Attachment Category */
    [getPrAttachmentCategory.pending]: (state) => {
      state.loading = true;
    },
    [getPrAttachmentCategory.fulfilled]: (state, action) => {
      state.data_prAttachmentCategory = action.payload;
      state.loading = false;
    },
    [getPrAttachmentCategory.rejected]: (state) => {
      state.data_prAttachmentCategory = [];
      state.loading = false;
    },

    /** Get Payment Relation Account Standard */
    [getPrAccountStandard.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listPrAccountStandard = true;
      }
    },
    [getPrAccountStandard.fulfilled]: (state, action) => {
      state.loading_listPrAccountStandard = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_prAccountStandard.map((item) => item.accountId));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.accountId));

          state.list_prAccountStandard = [
            ...state.list_prAccountStandard,
            ...filteredResult,
          ];
        }
        else
          state.list_prAccountStandard = result;
      }

      state.pagination_prAccountStandard = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getPrAccountStandard.rejected]: (state, action) => {
      state.loading_listPrAccountStandard = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_prAccountStandard = [];
        state.pagination_prAccountStandard = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Approve or Reject Payment Relation */
    [approveOrRejectPaymentRelation.pending]: (state) => {
      state.loading_approveRejectPr = true;
    },
    [approveOrRejectPaymentRelation.fulfilled]: (state) => {
      state.loading_approveRejectPr = false;
    },
    [approveOrRejectPaymentRelation.rejected]: (state) => {
      state.loading_approveRejectPr = false;
    },

    /** Approve or Reject Inactive Payment Relation */
    [approveOrRejectInactivePaymentRelation.pending]: (state) => {
      state.loading_approveRejectPr = true;
    },
    [approveOrRejectInactivePaymentRelation.fulfilled]: (state) => {
      state.loading_approveRejectPr = false;
    },
    [approveOrRejectInactivePaymentRelation.rejected]: (state) => {
      state.loading_approveRejectPr = false;
    },

    /** Inactivate Payment Relation */
    [inactivatePaymentRelation.pending]: (state) => {
      state.loading_inactivatePr = true;
    },
    [inactivatePaymentRelation.fulfilled]: (state) => {
      state.loading_inactivatePr = false;
    },
    [inactivatePaymentRelation.rejected]: (state) => {
      state.loading_inactivatePr = false;
    },

    /** Get Payment Relation List */
    [getPaymentRelation.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listPr = true;
      }
    },
    [getPaymentRelation.fulfilled]: (state, action) => {
      state.loading_listPr = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_paymentRelation.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_paymentRelation = [
            ...state.list_paymentRelation,
            ...filteredResult,
          ];
        }
        else
          state.list_paymentRelation = result;
      }

      state.pagination_paymentRelation = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getPaymentRelation.rejected]: (state, action) => {
      state.loading_listPr = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_paymentRelation = [];
        state.pagination_paymentRelation = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Get Payment Relation Approval List */
    [getPaymentRelationApproval.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listPrApproval = true;
      }
    },
    [getPaymentRelationApproval.fulfilled]: (state, action) => {
      state.loading_listPrApproval = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_paymentRelationApproval.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_paymentRelationApproval = [
            ...state.list_paymentRelationApproval,
            ...filteredResult,
          ];
        }
        else
          state.list_paymentRelationApproval = result;
      }

      state.pagination_paymentRelationApproval = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getPaymentRelationApproval.rejected]: (state, action) => {
      state.loading_listPrApproval = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_paymentRelationApproval = [];
        state.pagination_paymentRelationApproval = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Approve or Reject All Payment Relation */
    [approveOrRejectAllPaymentRelation.pending]: (state, action) => {
      if (action.meta.arg?.action === "approved")
        state.loading_approvePr = true;
      else if (action.meta.arg?.action === "rejected")
        state.loading_rejectPr = true;
    },
    [approveOrRejectAllPaymentRelation.fulfilled]: (state, action) => {
      if (action.meta.arg?.action === "approved")
        state.loading_approvePr = false;
      else if (action.meta.arg?.action === "rejected")
        state.loading_rejectPr = false;
    },
    [approveOrRejectAllPaymentRelation.rejected]: (state, action) => {
      if (action.meta.arg?.action === "approved")
        state.loading_approvePr = false;
      else if (action.meta.arg?.action === "rejected")
        state.loading_rejectPr = false;
    },

    /** Download Payment Relation */
    [downloadPaymentRelation.pending]: (state) => {
      state.loading = true;
    },
    [downloadPaymentRelation.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadPaymentRelation.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Payment Relation Approval History */
    [getPrApprovalHistory.pending]: (state) => {
      state.loading = true;
    },
    [getPrApprovalHistory.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_prApprovalHistory = action.payload;
    },
    [getPrApprovalHistory.rejected]: (state) => {
      state.loading = false;
    },
  },
});
const { reducer } = paymentRelationSlice;
export default reducer;
