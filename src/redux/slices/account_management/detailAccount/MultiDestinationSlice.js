import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import { setBodyError, showModalError, showModalSuccess, validateError } from "../../general_slice";

const initialState = {
  // --- Shared ---
  loading: false,

  // --- List ---
  loading_listMd: false,
  list_multiDestination: [],
  pagination_multiDestination: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10,
  },

  // --- Approval List ---
  loading_listMdApproval: false,
  list_multiDestinationApproval: [],
  pagination_multiDestinationApproval: {
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
  loading_listMdApprovalOption: false,
  list_mdApprovalOptions: [],
  loading_listMdApprovalHierarchyDetail: false,
  list_mdApprovalHierarchyDetail: [],
  list_mdAttachmentCategory: [],
  loading_listMdAccountStandard: false,
  list_mdAccountStandard: [],
  pagination_mdAccountStandard: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10,
  },

  // --- History ---
  data_mdApprovalHistory: {},

  // --- Dynamic Search ---
  data_globalTypeCondition: [],
  data_globalTypeOperator: [],
  data_globalTypeColumn: [],
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
export const getMultiDestination = createAsyncThunk(
  "GET_MULTI_DESTINATION",
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
export const getMultiDestinationApproval = createAsyncThunk(
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
 * Fetches the current (non-draft) detail of a multi destination record.
 *
 * @param {number} id - Multi destination ID.
 */
export const getDetailMultiDestination = createAsyncThunk(
  "GET_DETAIL_MULTI_DESTINATION",
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
export const getDetailDraftMultiDestination = createAsyncThunk(
  "GET_DETAIL_DRAFT_MULTI_DESTINATION",
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
 * Fetches the list of approval hierarchy options for multi destinations.
 */
export const getMdApprovalHierarchy = createAsyncThunk(
  "GET_MD_APPROVAL_HIERARCHY",
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
export const getDetailMdApprovalHierarchy = createAsyncThunk(
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
export const getMdAttachmentCategory = createAsyncThunk(
  "GET_MD_ATTACHMENT_CATEGORY",
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
export const getMdAccountStandard = createAsyncThunk(
  "GET_MD_ACCOUNT_STANDARD",
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

/**
 * Fetches the list of searchable columns for the multi destination dynamic search.
 */
export const getMdColumnApi = createAsyncThunk(
  "GET_MD_COLUMN_API",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/multi-destination/list-search-column";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

/**
 * Fetches the list of search condition types for the multi destination dynamic search.
 */
export const getMdConditionApi = createAsyncThunk(
  "GET_MD_CONDITION_API",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/multi-destination/list-search-condition";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

/**
 * Fetches the list of search operator types for the multi destination dynamic search.
 */
export const getMdOperatorApi = createAsyncThunk(
  "GET_MD_OPERATOR_API",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/multi-destination/list-search-operator";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

const multiDestinationSlice = createSlice({
  name: "multiDestination",
  initialState,
  extraReducers: {
    /** Get Multi Destination */
    [getMultiDestination.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listMd = true;
      }
    },
    [getMultiDestination.fulfilled]: (state, action) => {
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

      state.pagination_multiDestination = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getMultiDestination.rejected]: (state, action) => {
      state.loading_listMd = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_multiDestination = [];
        state.pagination_multiDestination = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Get Multi Destination Approval */
    [getMultiDestinationApproval.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listMdApproval = true;
      }
    },
    [getMultiDestinationApproval.fulfilled]: (state, action) => {
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

      state.pagination_multiDestinationApproval = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getMultiDestinationApproval.rejected]: (state, action) => {
      state.loading_listMdApproval = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_multiDestinationApproval = [];
        state.pagination_multiDestinationApproval = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Get Detail Multi Destination */
    [getDetailMultiDestination.pending]: (state) => {
      state.loading_detailMd = true;
    },
    [getDetailMultiDestination.fulfilled]: (state, action) => {
      state.detail_multiDestination = action.payload?.result || {};
      state.loading_detailMd = false;
    },
    [getDetailMultiDestination.rejected]: (state) => {
      state.detail_multiDestination = {};
      state.loading_detailMd = false;
    },

    /** Get Detail Draft Multi Destination */
    [getDetailDraftMultiDestination.pending]: (state) => {
      state.loading_detailDraftMd = true;
    },
    [getDetailDraftMultiDestination.fulfilled]: (state, action) => {
      state.detailDraft_multiDestination = action.payload?.result || {};
      state.loading_detailDraftMd = false;
    },
    [getDetailDraftMultiDestination.rejected]: (state) => {
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
    [getMdApprovalHierarchy.pending]: (state) => {
      state.loading_listMdApprovalOption = true;
    },
    [getMdApprovalHierarchy.fulfilled]: (state, action) => {
      state.list_mdApprovalOptions = action.payload;
      state.loading_listMdApprovalOption = false;
    },
    [getMdApprovalHierarchy.rejected]: (state) => {
      state.list_mdApprovalOptions = [];
      state.loading_listMdApprovalOption = false;
    },

    /** Get Multi Destination Detail Approval Hierarchy */
    [getDetailMdApprovalHierarchy.pending]: (state) => {
      state.loading_listMdApprovalHierarchyDetail = true;
    },
    [getDetailMdApprovalHierarchy.fulfilled]: (state, action) => {
      state.list_mdApprovalHierarchyDetail = action.payload;
      state.loading_listMdApprovalHierarchyDetail = false;
    },
    [getDetailMdApprovalHierarchy.rejected]: (state) => {
      state.list_mdApprovalHierarchyDetail = [];
      state.loading_listMdApprovalHierarchyDetail = false;
    },

    /** Get Multi Destination Attachment Category */
    [getMdAttachmentCategory.pending]: (state) => {
      state.loading = true;
    },
    [getMdAttachmentCategory.fulfilled]: (state, action) => {
      state.list_mdAttachmentCategory = action.payload;
      state.loading = false;
    },
    [getMdAttachmentCategory.rejected]: (state) => {
      state.list_mdAttachmentCategory = [];
      state.loading = false;
    },

    /** Get Multi Destination Account Standard */
    [getMdAccountStandard.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listMdAccountStandard = true;
      }
    },
    [getMdAccountStandard.fulfilled]: (state, action) => {
      state.loading_listMdAccountStandard = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        const resultWithIds = result.map((record) => ({
          ...record,
          id: record.id || record.accountId
        }));

        if (isLoadMore) {
          const currentIds = new Set(state.list_mdAccountStandard.map((item) => item.accountId));
          const filteredResult = resultWithIds.filter((resultItem) => !currentIds.has(resultItem.accountId));

          state.list_mdAccountStandard = [
            ...state.list_mdAccountStandard,
            ...filteredResult,
          ];
        }
        else
          state.list_mdAccountStandard = resultWithIds;
      }

      state.pagination_mdAccountStandard = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getMdAccountStandard.rejected]: (state, action) => {
      state.loading_listMdAccountStandard = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_mdAccountStandard = [];
        state.pagination_mdAccountStandard = {
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
      state.loading = true;
    },
    [getMdApprovalHistory.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_mdApprovalHistory = action.payload;
    },
    [getMdApprovalHistory.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Multi Destination Column API  */
    [getMdColumnApi.pending]: (state) => {
      state.loading = true;
    },
    [getMdColumnApi.fulfilled]: (state, action) => {
      state.data_globalTypeColumn = action.payload;
      state.loading = false;
    },
    [getMdColumnApi.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Multi Destination Condition API  */
    [getMdConditionApi.pending]: (state) => {
      state.loading = true;
    },
    [getMdConditionApi.fulfilled]: (state, action) => {
      state.data_globalTypeCondition = action.payload;
      state.loading = false;
    },
    [getMdConditionApi.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Multi Destination Operator API  */
    [getMdOperatorApi.pending]: (state) => {
      state.loading = true;
    },
    [getMdOperatorApi.fulfilled]: (state, action) => {
      state.data_globalTypeOperator = action.payload;
      state.loading = false;
    },
    [getMdOperatorApi.rejected]: (state) => {
      state.loading = false
    },
  },
});
const { reducer } = multiDestinationSlice;
export default reducer;
