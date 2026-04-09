import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import { setBodyError, showModalError, showModalSuccess, validateError } from "../../general_slice";

const initialState = {
  // --- List ---
  loading_listMd: false,
  list_multiDestination: [],
  pagination_listMd: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10,
  },

  // --- Approval List ---
  loading_listMdApproval: false,
  list_multiDestinationApproval: [],
  pagination_listMdApproval: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10,
  },

  // --- Detail ---
  loading_detailMd: false,
  detail_multiDestination: {},
  loading_detailDraftMd: false,
  detailDraft_multiDestination: {},

  // --- Create / Update ---
  loading_createUpdateMd: false,

  // --- Approve / Reject ---
  loading_approveRejectMd: false,
  loading_approveMd: false,
  loading_rejectMd: false,

  // --- Inactivate ---
  loading_inactivateMd: false,

  // --- Form Options (approval hierarchy, attachment categories, account standard) ---
  loading_listMdApprovalHierarchy: false,
  list_mdApprovalHierarchy: [],
  loading_detailMdApprovalHierarchy: false,
  detail_mdApprovalHierarchy: [],
  loading_listMdAttachmentCategory: false,
  list_mdAttachmentCategory: [],
  loading_listMdAccount: false,
  list_mdAccount: [],
  pagination_listMdAccount: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10,
  },

  // --- History ---
  loading_mdApprovalHistory: false,
  detail_mdApprovalHistory: {},
};

/**
 * Fetches the paginated multi destination list for a given account.
 * Supports infinite-scroll load-more.
 *
 * @param {object}  arg
 * @param {number}  arg.id          - Account ID.
 * @param {object}  arg.body        - Pagination / search / sort body.
 * @param {boolean} arg.isLoadMore  - If true, appends results; otherwise replaces the list.
 */
export const getMultiDestinations = createAsyncThunk(
  "GET_MULTI_DESTINATIONS",
  async ({ id, body, isLoadMore }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/multi-destination/list/${id}`;
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
 * Fetches the paginated approval list for a given account's multi destinations.
 * Always injects `listType: "approval"` into the request body.
 * Supports infinite-scroll load-more.
 *
 * @param {object}  arg
 * @param {number}  arg.id          - Account ID.
 * @param {object}  arg.body        - Pagination / search / sort body.
 * @param {boolean} arg.isLoadMore  - If true, appends results; otherwise replaces the list.
 */
export const getMultiDestinationApprovals = createAsyncThunk(
  "GET_MULTI_DESTINATION_APPROVAL",
  async ({ id, body, isLoadMore }, thunkAPI) => {
    try {
      body = {
        ...body,
        listType: "approval"
      }

      const url = `/v1/dbs/api/multi-destination/list/${id}`;
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
 * Fetches the current (non-draft) detail of a multi destination record.
 *
 * @param {number} id - Multi destination ID.
 */
export const getMultiDestination = createAsyncThunk(
  "GET_MULTI_DESTINATION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/multi-destination/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Fetches the draft detail of a multi destination record.
 *
 * @param {number} id - Multi destination ID.
 */
export const getMultiDestinationDraft = createAsyncThunk(
  "GET_MULTI_DESTINATION_DRAFT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/multi-destination/detail-draft/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Creates a new multi destination record, then uploads any attachments in parallel.
 * Dispatches a success or error modal on completion.
 *
 * @param {object}   arg
 * @param {object}   arg.body                - Request body for the create API.
 * @param {object[]} [arg.attachments=[]]    - Attachments to upload after creation.
 * @param {string}   arg.action              - `"DRAFT"` or `"SUBMIT"` — used in the upload payload.
 */
export const createMultiDestination = createAsyncThunk(
  "CREATE_MULTI_DESTINATION",
  async ({ body: createBody, attachments = [], action }, thunkAPI) => {
    try {
      const createUrl = "/v1/dbs/api/multi-destination/create";
      const response = await accountManagementService.createData(createUrl, createBody);

      const { id } = response.data;

      const uploadUrl = `/v1/dbs/api/multi-destination/upload-attachment`;

      const uploadPromises = attachments.map((attachment) => accountManagementService.uploadAttachment(uploadUrl, {
        files:  attachment.file,
        category: attachment.fileCategoryId,
        refId: id,
        action,
      }));

      await Promise.all(uploadPromises);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${createBody?.action === "DRAFT" ? 'drafted' : 'submitted'}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody))
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
        description: `Your data was not ${createBody?.action === "DRAFT" ? 'drafted' : 'submitted'}. ${message}.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Updates an existing multi destination record, then uploads any attachments in parallel.
 * Dispatches a success or error modal on completion.
 *
 * @param {object}   arg
 * @param {number}   arg.id                  - ID of the multi destination to update.
 * @param {object}   arg.body                - Request body for the update API.
 * @param {object[]} [arg.attachments=[]]    - Attachments to upload after update.
 * @param {string}   arg.action              - `"DRAFT"` or `"SUBMIT"` — used in the upload payload.
 */
export const updateMultiDestination = createAsyncThunk(
  "UPDATE_MULTI_DESTINATION",
  async ({ id, body: updateBody, attachments = [], action }, thunkAPI) => {
    try {
      const updateUrl = `/v1/dbs/api/multi-destination/${id}`;
      const response = await accountManagementService.updateData(updateUrl, updateBody);

      const uploadUrl = `/v1/dbs/api/multi-destination/upload-attachment`;

      const uploadPromises = attachments.map((attachment) => accountManagementService.uploadAttachment(
        uploadUrl,
        {
          id: attachment.id,
          files:  attachment.file,
          category: attachment.fileCategoryId,
          refId: id,
          action,
        }
      ));

      await Promise.all(uploadPromises);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${updateBody?.action === "DRAFT" ? 'drafted' : 'updated'}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody))
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
        description: `Your data was not ${updateBody?.action === "DRAFT" ? 'drafted' : 'updated'}. ${message}.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Fetches the list of approval hierarchy options for multi destinations.
 */
export const getMdApprovalHierarchies = createAsyncThunk(
  "GET_MD_APPROVAL_HIERARCHIES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/multi-destination/approval-hierarchies`;
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
export const getMdApprovalHierarchy = createAsyncThunk(
  "GET_DETAIL_MD_APPROVAL_HIERARCHY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/multi-destination/approval-hierarchy/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

/**
 * Fetches the list of attachment categories for multi destinations.
 */
export const getMdAttachmentCategories = createAsyncThunk(
  "GET_MD_ATTACHMENT_CATEGORIES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/multi-destination/attachment-category`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

/**
 * Fetches a paginated list of account standards eligible for multi destination.
 * Supports infinite-scroll load-more by appending to the existing list when `isLoadMore` is true.
 *
 * @param {object}  arg
 * @param {number}  arg.id          - Account ID used to scope the list.
 * @param {object}  arg.body        - Pagination / search body.
 * @param {boolean} arg.isLoadMore  - If true, appends results; otherwise replaces the list.
 */
export const getMdAccounts = createAsyncThunk(
  "GET_MD_ACCOUNT",
  async ({ id, body, isLoadMore }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/multi-destination/list-account/${id}`;

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
 * Approves or rejects an active multi destination record.
 * Dispatches a success or error modal on completion.
 *
 * @param {object} arg
 * @param {object} arg.body    - Request body (IDs, remark, hierarchy).
 * @param {string} arg.action  - `"approve"` or `"reject"`.
 */
export const approveOrRejectMultiDestination = createAsyncThunk(
  "APPROVE_OR_REJECT_MULTI_DESTINATION",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/multi-destination/approve";
      const response = await accountManagementService.activationWithRemark(url, body);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "approve" ? "approved" : "rejected"}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody))
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
 * Approves or rejects an inactive multi destination record (inactivation request).
 * Dispatches a success or error modal on completion.
 *
 * @param {object} arg
 * @param {object} arg.body    - Request body (IDs, remark, hierarchy).
 * @param {string} arg.action  - `"approve"` or `"reject"`.
 */
export const approveOrRejectInactiveMultiDestination = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_MULTI_DESTINATION",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/multi-destination/approve-inactive";
      const response = await accountManagementService.activationWithRemark(url, body);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "approve" ? "approved" : "rejected"}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody))
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

export const approveOrRejectAllMultiDestination = createAsyncThunk(
  "APPROVE_OR_REJECT_ALL_MULTI_DESTINATION",
  async ({ body, inactiveBody, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/multi-destination/approve";
      const inactiveUrl = "/v1/dbs/api/multi-destination/approve-inactive";

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
        description: `Your data has been ${action === "APPROVE" ? 'approved' : 'rejected'}.`,
        return: false,
      };

      thunkAPI.dispatch(showModalSuccess(successBody))
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
        description: `Your data was not ${action === "APPROVE" ? 'approved' : 'rejected'}. ${message}.`,
      };

      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Submits an inactivation request for a multi destination record.
 * Dispatches a success or error modal on completion.
 *
 * @param {object} arg
 * @param {object} arg.body - Request body (ID, remark, hierarchy).
 */
export const inactivateMultiDestination = createAsyncThunk(
  "INACTIVATE_MULTI_DESTINATION",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/multi-destination/inactive";
      const response = await accountManagementService.activationWithRemark(url, body);

      const successBody = {
        title: `Successful`,
        description: `Your data has been submitted`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody))
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

export const downloadMultiDestination = createAsyncThunk(
  "DOWNLOAD_MULTI_DESTINATION",
  async ({ body, id, }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/multi-destination/export-excel/${id}`;
      const response = await accountManagementService.downloadDataAdvanced(url, body);
      return response;
    } catch (response) {
      thunkAPI.dispatch(validateError({ error: response, action: "DOWNLOAD_MULTI_DESTINATION", back: false }));
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const getMdApprovalHistory = createAsyncThunk(
  "GET_MD_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/multi-destination/approval-history/${id}`;
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

const multiDestinationSlice = createSlice({
  name: "multiDestination",
  initialState,
  extraReducers: {
    /** Get Multi Destination */
    [getMultiDestinations.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listMd = true;
      }
    },
    [getMultiDestinations.fulfilled]: (state, action) => {
      state.loading_listMd = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_multiDestination.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_multiDestination = [
            ...state.list_multiDestination,
            ...filteredResult,
          ];
        }
        else
          state.list_multiDestination = result;
      }

      state.pagination_listMd = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getMultiDestinations.rejected]: (state, action) => {
      state.loading_listMd = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_multiDestination = [];
        state.pagination_listMd = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Get Multi Destination Approval */
    [getMultiDestinationApprovals.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listMdApproval = true;
      }
    },
    [getMultiDestinationApprovals.fulfilled]: (state, action) => {
      state.loading_listMdApproval = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_multiDestinationApproval.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_multiDestinationApproval = [
            ...state.list_multiDestinationApproval,
            ...filteredResult,
          ];
        }
        else
          state.list_multiDestinationApproval = result;
      }

      state.pagination_listMdApproval = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getMultiDestinationApprovals.rejected]: (state, action) => {
      state.loading_listMdApproval = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_multiDestinationApproval = [];
        state.pagination_listMdApproval = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Get Detail Multi Destination */
    [getMultiDestination.pending]: (state) => {
      state.loading_detailMd = true;
    },
    [getMultiDestination.fulfilled]: (state, action) => {
      state.detail_multiDestination = action.payload?.result || {};
      state.loading_detailMd = false;
    },
    [getMultiDestination.rejected]: (state) => {
      state.detail_multiDestination = {};
      state.loading_detailMd = false;
    },

    /** Get Detail Draft Multi Destination */
    [getMultiDestinationDraft.pending]: (state) => {
      state.loading_detailDraftMd = true;
    },
    [getMultiDestinationDraft.fulfilled]: (state, action) => {
      state.detailDraft_multiDestination = action.payload?.result || {};
      state.loading_detailDraftMd = false;
    },
    [getMultiDestinationDraft.rejected]: (state) => {
      state.detailDraft_multiDestination = {};
      state.loading_detailDraftMd = false;
    },

    /** Create Multi Destination */
    [createMultiDestination.pending]: (state) => {
      state.loading_createUpdateMd = true;
    },
    [createMultiDestination.fulfilled]: (state) => {
      state.loading_createUpdateMd = false;
    },
    [createMultiDestination.rejected]: (state) => {
      state.loading_createUpdateMd = false;
    },

    /** Update Multi Destination */
    [updateMultiDestination.pending]: (state) => {
      state.loading_createUpdateMd = true;
    },
    [updateMultiDestination.fulfilled]: (state) => {
      state.loading_createUpdateMd = false;
    },
    [updateMultiDestination.rejected]: (state) => {
      state.loading_createUpdateMd = false;
    },

    /** Get Multi Destination Approval Hierarchy */
    [getMdApprovalHierarchies.pending]: (state) => {
      state.loading_listMdApprovalHierarchy = true;
    },
    [getMdApprovalHierarchies.fulfilled]: (state, action) => {
      state.list_mdApprovalHierarchy = action.payload;
      state.loading_listMdApprovalHierarchy = false;
    },
    [getMdApprovalHierarchies.rejected]: (state) => {
      state.list_mdApprovalHierarchy = [];
      state.loading_listMdApprovalHierarchy = false;
    },

    /** Get Multi Destination Detail Approval Hierarchy */
    [getMdApprovalHierarchy.pending]: (state) => {
      state.loading_detailMdApprovalHierarchy = true;
    },
    [getMdApprovalHierarchy.fulfilled]: (state, action) => {
      state.detail_mdApprovalHierarchy = action.payload;
      state.loading_detailMdApprovalHierarchy = false;
    },
    [getMdApprovalHierarchy.rejected]: (state) => {
      state.detail_mdApprovalHierarchy = [];
      state.loading_detailMdApprovalHierarchy = false;
    },

    /** Get Multi Destination Attachment Category */
    [getMdAttachmentCategories.pending]: (state) => {
      state.loading_listMdAttachmentCategory = true;
    },
    [getMdAttachmentCategories.fulfilled]: (state, action) => {
      state.list_mdAttachmentCategory = action.payload;
      state.loading_listMdAttachmentCategory = false;
    },
    [getMdAttachmentCategories.rejected]: (state) => {
      state.list_mdAttachmentCategory = [];
      state.loading_listMdAttachmentCategory = false;
    },

    /** Get Multi Destination Account Standard */
    [getMdAccounts.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listMdAccount = true;
      }
    },
    [getMdAccounts.fulfilled]: (state, action) => {
      state.loading_listMdAccount = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        const resultWithIds = result.map((record) => ({
          ...record,
          id: record.id || record.accountId
        }));

        if (isLoadMore) {
          const currentIds = new Set(state.list_mdAccount.map((item) => item.accountId));
          const filteredResult = resultWithIds.filter((resultItem) => !currentIds.has(resultItem.accountId));

          state.list_mdAccount = [
            ...state.list_mdAccount,
            ...filteredResult,
          ];
        }
        else
          state.list_mdAccount = resultWithIds;
      }

      state.pagination_listMdAccount = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getMdAccounts.rejected]: (state, action) => {
      state.loading_listMdAccount = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_mdAccount = [];
        state.pagination_listMdAccount = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Approve or Reject Multi Destination */
    [approveOrRejectMultiDestination.pending]: (state) => {
      state.loading_approveRejectMd = true;
    },
    [approveOrRejectMultiDestination.fulfilled]: (state) => {
      state.loading_approveRejectMd = false;
    },
    [approveOrRejectMultiDestination.rejected]: (state) => {
      state.loading_approveRejectMd = false;
    },

    /** Approve or Reject Inactive Multi Destination */
    [approveOrRejectInactiveMultiDestination.pending]: (state) => {
      state.loading_approveRejectMd = true;
    },
    [approveOrRejectInactiveMultiDestination.fulfilled]: (state) => {
      state.loading_approveRejectMd = false;
    },
    [approveOrRejectInactiveMultiDestination.rejected]: (state) => {
      state.loading_approveRejectMd = false;
    },

    /** Approve or Reject All Multi Destination */
    [approveOrRejectAllMultiDestination.pending]: (state, action) => {
      if (action.meta.arg?.action === "APPROVE")
        state.loading_approveMd = true;
      else if (action.meta.arg?.action === "REJECT")
        state.loading_rejectMd = true;
    },
    [approveOrRejectAllMultiDestination.fulfilled]: (state, action) => {
      if (action.meta.arg?.action === "APPROVE")
        state.loading_approveMd = false;
      else if (action.meta.arg?.action === "REJECT")
        state.loading_rejectMd = false;
    },
    [approveOrRejectAllMultiDestination.rejected]: (state, action) => {
      if (action.meta.arg?.action === "APPROVE")
        state.loading_approveMd = false;
      else if (action.meta.arg?.action === "REJECT")
        state.loading_rejectMd = false;
    },

    /** Inactivate Multi Destination */
    [inactivateMultiDestination.pending]: (state) => {
      state.loading_inactivateMd = true;
    },
    [inactivateMultiDestination.fulfilled]: (state) => {
      state.loading_inactivateMd = false;
    },
    [inactivateMultiDestination.rejected]: (state) => {
      state.loading_inactivateMd = false;
    },

    /** Get Multi Destination Approval History */
    [getMdApprovalHistory.pending]: (state) => {
      state.loading_mdApprovalHistory = true;
    },
    [getMdApprovalHistory.fulfilled]: (state, action) => {
      state.loading_mdApprovalHistory = false;
      state.detail_mdApprovalHistory = action.payload;
    },
    [getMdApprovalHistory.rejected]: (state) => {
      state.loading_mdApprovalHistory = false;
    },
  },
});
const { reducer } = multiDestinationSlice;
export default reducer;
