import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import { setBodyError, showModalError, showModalSuccess, validateError } from "../../general_slice";

const initialState = {
  loading_listGd: false,
  list_gasDeposit: [],
  pagination_listGd: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10,
  },
  loading_listGdApproval: false,
  list_gasDepositApproval: [],
  pagination_listGdApproval: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10,
  },
  loading_listGdHistory: false,
  list_gasDepositHistory: [],
  pagination_listGdHistory: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10,
  },
  loading_listGdApprovalHierarchy: false,
  list_gdApprovalHierarchy: [],
  loading_detailGdApprovalHierarchy: false,
  detail_gdApprovalHierarchy: [],
  loading_listGdAttachmentCategory: false,
  list_gdAttachmentCategory: [],
  loading_listGdAccountStandard: false,
  list_gdAccountStandard: [],
  pagination_listGdAccount: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10,
  },
  loading_detailGd: false,
  detail_gasDeposit: {},
  loading_detailDraftGd: false,
  detailDraft_gasDeposit: {},
  loading_detailGdHistory: false,
  detail_gasDepositHistory: {},
  loading_gdApprovalHistory: false,
  detail_gdApprovalHistory: {},
  loading_approveRejectGd: false,
  loading_approveGd: false,
  loading_rejectGd: false,
  loading_inactivateGd: false,
  loading_recalculateExpireGd: false,
};

/**
 * Fetches a paginated list of gas deposits, optionally scoped to an account.
 * Always injects `listType: "all"` into the request body.
 * Supports infinite-scroll load-more by appending to the existing list when `isLoadMore` is true.
 *
 * @param {object}  arg
 * @param {number}  [arg.accountId]  - Account ID to scope the list. Omit to fetch all.
 * @param {object}  arg.body         - Pagination / search / sort body.
 * @param {boolean} arg.isLoadMore   - If true, appends results; otherwise replaces the list.
 */
export const getGasDeposits = createAsyncThunk(
  "GET_GAS_DEPOSITS",
  async ({ accountId, body, isLoadMore }, thunkAPI) => {
    try {
      body = {
        ...body,
        listType: "all"
      };

      const url = "/v1/dbs/api/gas-deposit/list" + (accountId ? `/${accountId}` : "");
      const response = await accountManagementService.updateDataWithMethodPost(url, body);
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
 * Fetches the paginated approval list for a given account's gas deposits.
 * Always injects `listType: "approval"` into the request body.
 * Supports infinite-scroll load-more.
 *
 * @param {object}  arg
 * @param {number}  arg.id          - Account ID.
 * @param {object}  arg.body        - Pagination / search / sort body.
 * @param {boolean} arg.isLoadMore  - If true, appends results; otherwise replaces the list.
 */
export const getGasDepositApprovals = createAsyncThunk(
  "GET_GAS_DEPOSIT_APPROVALS",
  async ({ id, body, isLoadMore }, thunkAPI) => {
    try {
      body = {
        ...body,
        listType: "approval"
      }

      const url = `/v1/dbs/api/gas-deposit/list/${id}`;
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
 * Fetches the paginated detail list nested under a gas deposit record.
 * Results are stored at `state[listKey][index]` or `state[parentKey]` when `parentKey` is provided.
 * Supports infinite-scroll load-more.
 *
 * @param {object}  arg
 * @param {number}  arg.id                              - Gas deposit ID.
 * @param {number}  [arg.index]                         - Position of the parent record in `listKey`.
 * @param {object}  arg.body                            - Pagination body.
 * @param {boolean} arg.isLoadMore                      - If true, appends results; otherwise replaces.
 * @param {string}  [arg.listKey="list_gasDeposit"]     - Redux state key of the parent list.
 * @param {string}  [arg.parentKey]                     - Redux state key if parent is a top-level record (e.g. `"detail_gasDeposit"`).
 */
export const getGasDepositDetails = createAsyncThunk(
  "GET_GAS_DEPOSIT_DETAILS",
  async ({ id, index, body, isLoadMore, listKey = "list_gasDeposit", parentKey }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/detail-list/${id}`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body);
      return {
        ...response.data,
        index,
        isLoadMore,
        listKey,
        parentKey,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Fetches the paginated mutation list nested under a gas deposit detail record.
 * Results are stored at `state[listKey][index].list_gasDepositDetail[detailIndex]`.
 * Supports infinite-scroll load-more.
 *
 * @param {object}  arg
 * @param {number}  arg.detailId                        - Gas deposit detail ID.
 * @param {number}  [arg.index]                         - Position of the parent gas deposit in `listKey`.
 * @param {number}  arg.detailIndex                     - Position of the detail record in `list_gasDepositDetail`.
 * @param {object}  arg.body                            - Pagination body.
 * @param {boolean} arg.isLoadMore                      - If true, appends results; otherwise replaces.
 * @param {string}  [arg.listKey="list_gasDeposit"]     - Redux state key of the parent list.
 * @param {string}  [arg.parentKey]                     - Redux state key if parent is a top-level record.
 */
export const getGasDepositDetailMutations = createAsyncThunk(
  "GET_GAS_DEPOSIT_DETAIL_MUTATIONS",
  async ({ detailId, index, detailIndex, body, isLoadMore, listKey = "list_gasDeposit", parentKey }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/detail-mutation-list/${detailId}`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body);
      return {
        ...response.data,
        index,
        detailIndex,
        isLoadMore,
        listKey,
        parentKey,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Fetches a paginated list of gas deposit recalculate / expire request history.
 * Supports infinite-scroll load-more by appending to the existing list when `isLoadMore` is true.
 *
 * @param {object}  arg
 * @param {number}  [arg.accountId]  - Account ID to scope the list. Omit to fetch all.
 * @param {object}  arg.body         - Pagination / search / sort body.
 * @param {boolean} arg.isLoadMore   - If true, appends results; otherwise replaces the list.
 */
export const getGasDepositHistories = createAsyncThunk(
  "GET_GAS_DEPOSIT_HISTORIES",
  async ({ accountId, body, isLoadMore }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/gas-deposit/request-history" + (accountId ? `/${accountId}` : "");
      const response = await accountManagementService.getPagination(url, body);
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
 * Fetches the current (non-draft) detail of a gas deposit record.
 *
 * @param {object} arg
 * @param {number} arg.id - Gas deposit ID.
 */
export const getGasDeposit = createAsyncThunk(
  "GET_GAS_DEPOSIT",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/detail/${id}`;

      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Fetches the draft detail of a gas deposit record.
 *
 * @param {object} arg
 * @param {number} arg.id - Gas deposit ID.
 */
export const getGasDepositDraft = createAsyncThunk(
  "GET_GAS_DEPOSIT_DRAFT",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/detail-draft/${id}`;

      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Fetches the detail of a single gas deposit history record.
 *
 * @param {object} arg
 * @param {number} arg.id - Gas deposit history ID.
 */
export const getGasDepositHistory = createAsyncThunk(
  "GET_GAS_DEPOSIT_HISTORY",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit-history/${id}`;

      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Submits a recalculate request for a gas deposit, then uploads any new attachments in parallel.
 * Dispatches a success or error modal on completion.
 *
 * @param {object}   arg
 * @param {object}   arg.body                - Request body for the recalculate API.
 * @param {object[]} [arg.attachments=[]]    - Attachments to upload after submission.
 * @param {string}   arg.action              - `"draft"` or `"submit"` — used in the upload payload.
 */
export const recalculateGasDeposit = createAsyncThunk(
  "RECALCULATE_GAS_DEPOSIT",
  async ({ body: recalculateBody, attachments = [], action }, thunkAPI) => {
    try {
      const recalculateUrl = "/v1/dbs/api/gas-deposit/recalculate";
      const response = await accountManagementService.createData(
        recalculateUrl,
        recalculateBody
      );

      const { id } = response.data;

      const uploadUrl = `/v1/dbs/api/gas-deposit/upload-attachment`;

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
        description: `Your data has been ${recalculateBody?.action === "draft" ? "saved as draft" : "submitted"}.`,
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
        description: `Your data was not ${recalculateBody?.action === "draft" ? "saved as draft" : "submitted"}. ${message}.`
      };

      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Submits an expire request for a gas deposit, then uploads any new attachments in parallel.
 * Dispatches a success or error modal on completion.
 *
 * @param {object}   arg
 * @param {object}   arg.body                - Request body for the expire API.
 * @param {object[]} [arg.attachments=[]]    - Attachments to upload after submission.
 * @param {string}   arg.action              - `"draft"` or `"submit"` — used in the upload payload.
 */
export const expireGasDeposit = createAsyncThunk(
  "EXPIRE_GAS_DEPOSIT",
  async ({ body: expireBody, attachments = [], action }, thunkAPI) => {
    try {
      const expireUrl = "/v1/dbs/api/gas-deposit/expire";
      const response = await accountManagementService.createData(
        expireUrl,
        expireBody
      );

      const { id } = response.data;

      const uploadUrl = `/v1/dbs/api/gas-deposit/upload-attachment`;

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
        description: `Your data has been ${expireBody?.action === "draft" ? "saved as draft" : "submitted"}.`,
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
        description: `Your data was not ${expireBody?.action === "draft" ? "saved as draft" : "submitted"}. ${message}.`
      };

      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/**
 * Fetches the list of approval hierarchy options for gas deposits.
 */
export const getGdApprovalHierarchies = createAsyncThunk(
  "GET_GD_APPROVAL_HIERARCHIES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/approval-hierarchies`;
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
export const getGdApprovalHierarchy = createAsyncThunk(
  "GET_GD_APPROVAL_HIERARCHY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/approval-hierarchy/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

/**
 * Fetches the list of attachment categories for gas deposits.
 */
export const getGdAttachmentCategories = createAsyncThunk(
  "GET_GD_ATTACHMENT_CATEGORY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/attachment-category`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

/**
 * Fetches a paginated list of accounts eligible for gas deposit.
 * Supports infinite-scroll load-more by appending to the existing list when `isLoadMore` is true.
 *
 * @param {object}  arg
 * @param {number}  arg.id          - Account ID used to scope the list.
 * @param {object}  arg.body        - Pagination / search body.
 * @param {boolean} arg.isLoadMore  - If true, appends results; otherwise replaces the list.
 */
export const getGdAccounts = createAsyncThunk(
  "GET_GD_ACCOUNTS",
  async ({ id, body, isLoadMore }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/list-account/${id}`;
      
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
 * Approves or rejects an active gas deposit record.
 * Dispatches a success or error modal on completion.
 *
 * @param {object} arg
 * @param {object} arg.body    - Request body (IDs, remark, hierarchy).
 * @param {string} arg.action  - `"approve"` or `"reject"`.
 */
export const approveOrRejectGasDeposit = createAsyncThunk(
  "APPROVE_OR_REJECT_GAS_DEPOSIT",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/gas-deposit/approve";
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
 * Approves or rejects an inactive gas deposit record (inactivation request).
 * Dispatches a success or error modal on completion.
 *
 * @param {object} arg
 * @param {object} arg.body    - Request body (IDs, remark, hierarchy).
 * @param {string} arg.action  - `"approve"` or `"reject"`.
 */
export const approveOrRejectInactiveGasDeposit = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_GAS_DEPOSIT",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/gas-deposit/approve-inactive";
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
 * Batch-approves or batch-rejects a mixed set of recalculate and expire gas deposits.
 * Calls the recalculate-approve and expire-approve endpoints in parallel based on which bodies are provided.
 * Dispatches a success or error modal on completion.
 *
 * @param {object}   arg
 * @param {object[]} [arg.recalculateBody]  - Recalculate gas deposit records to process.
 * @param {object[]} [arg.expireBody]       - Expire gas deposit records to process.
 * @param {string}   arg.action             - `"APPROVE"` or `"REJECT"` — drives the loading state and modal message.
 */
export const approveOrRejectAllGasDeposit = createAsyncThunk(
  "APPROVE_OR_REJECT_ALL_GAS_DEPOSIT",
  async ({ recalculateBody, expireBody, action }, thunkAPI) => {
    try {
      const recalculateUrl = "/v1/dbs/api/gas-deposit/approve";
      const expireUrl = "/v1/dbs/api/gas-deposit/approve-expire";

      await Promise.all([
        recalculateBody ? accountManagementService.activationWithRemark(recalculateUrl, recalculateBody, {
          headers: {
            "Accept": "application/json"
          }
        }) : null,
        expireBody ? accountManagementService.activationWithRemark(expireUrl, expireBody, {
          headers: {
            "Accept": "application/json"
          }
        }) : null,
      ].filter(Boolean));

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
 * Submits an inactivation request for a gas deposit record.
 * Dispatches a success or error modal on completion.
 *
 * @param {object} arg
 * @param {object} arg.body - Request body (ID, remark, hierarchy).
 */
export const inactivateGasDeposit = createAsyncThunk(
  "INACTIVATE_GAS_DEPOSIT",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/gas-deposit/inactive";
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

/**
 * Downloads the gas deposit list as an Excel file for a given record.
 *
 * @param {object} arg
 * @param {number} arg.id   - Gas deposit ID.
 * @param {object} arg.body - Search / sort / filter body.
 */
export const downloadGasDeposit = createAsyncThunk(
  "DOWNLOAD_GAS_DEPOSIT",
  async ({ body, id, }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/export-excel/${id}`;
      const response = await accountManagementService.downloadDataAdvanced(url, body);
      return response;
    } catch (response) {
      thunkAPI.dispatch(validateError({ error: response, action: "DOWNLOAD_GAS_DEPOSIT", back: false }));
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

/**
 * Fetches the approval history for a given gas deposit record.
 * Returns `null` if the API response is an array (no history available).
 * Handles HTTP 419 by dispatching `setBodyError`.
 *
 * @param {number} id - Gas deposit ID.
 */
export const getGdApprovalHistory = createAsyncThunk(
  "GET_GD_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/approval-history/${id}`;
      const response = await accountManagementService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      if (error.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const gasDepositSlice = createSlice({
  name: "gasDeposit",
  initialState,
  extraReducers: {
    /** Get Gas Deposits */
    [getGasDeposits.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listGd = true;
      }
    },
    [getGasDeposits.fulfilled]: (state, action) => {
      state.loading_listGd = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_gasDeposit.map((item) => item.id));
          const filteredResult = result.filter((item) => !currentIds.has(item.id));
          const mappedResult = filteredResult.map(item => ({
            ...item,
            list_gasDepositDetail: [],
            pagination_listGdDetail: {
              totalPage: 0,
              totalElement: 0,
              currentPage: 0,
              pageSize: 10,
            },
            loading_listGdDetail: false
          }));

          state.list_gasDeposit = [
            ...state.list_gasDeposit,
            ...mappedResult,
          ];
        }
        else
          state.list_gasDeposit = result.map(item => ({
            ...item,
            list_gasDepositDetail: [],
            pagination_listGdDetail: {
              totalPage: 0,
              totalElement: 0,
              currentPage: 0,
              pageSize: 10,
            },
            loading_listGdDetail: false
          }));
      }

      state.pagination_listGd = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getGasDeposits.rejected]: (state, action) => {
      if (action.meta.aborted) return;
      state.loading_listGd = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_gasDeposit = [];
        state.pagination_listGd = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Get Gas Deposit Approvals */
    [getGasDepositApprovals.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listGdApproval = true;
      }
    },
    [getGasDepositApprovals.fulfilled]: (state, action) => {
      state.loading_listGdApproval = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        const withNested = (item) => ({
          ...item,
          list_gasDepositDetail: [],
          pagination_listGdDetail: { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 },
          loading_listGdDetail: false,
        });

        if (isLoadMore) {
          const currentIds = new Set(state.list_gasDepositApproval.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_gasDepositApproval = [
            ...state.list_gasDepositApproval,
            ...filteredResult.map(withNested),
          ];
        }
        else
          state.list_gasDepositApproval = result.map(withNested);
      }

      state.pagination_listGdApproval = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getGasDepositApprovals.rejected]: (state, action) => {
      state.loading_listGdApproval = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_gasDepositApproval = [];
        state.pagination_listGdApproval = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Get Gas Deposit Details */
    [getGasDepositDetails.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        const { parentKey, listKey = "list_gasDeposit", index } = action.meta.arg || {};
        const parent = parentKey ? state[parentKey] : state[listKey][index];
        parent.loading_listGdDetail = true;
      }
    },
    [getGasDepositDetails.fulfilled]: (state, action) => {
      const { result, page, isLoadMore, index, listKey = "list_gasDeposit", parentKey } = action.payload;

      const parent = parentKey ? state[parentKey] : state[listKey][index];
      const gasDeposit = parent;
      gasDeposit.loading_listGdDetail = false;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(gasDeposit.list_gasDepositDetail.map((item) => item.id));
          const filteredResult = result.filter((item) => !currentIds.has(item.id));
          const mappedResult = filteredResult.map(item => ({
            ...item,
            list_gasDepositDetailMutation: [],
            pagination_listGdDetailMutation: {
              totalPage: 0,
              totalElement: 0,
              currentPage: 0,
              pageSize: 10,
            },
            loading_listGdDetailMutation: false
          }));
          

          gasDeposit.list_gasDepositDetail = [
            ...gasDeposit.list_gasDepositDetail,
            ...mappedResult,
          ];
        }
        else
          gasDeposit.list_gasDepositDetail = result.map(item => ({
            ...item,
            list_gasDepositDetailMutation: [],
            pagination_listGdDetailMutation: {
              totalPage: 0,
              totalElement: 0,
              currentPage: 0,
              pageSize: 10,
            },
            loading_listGdDetailMutation: false
          }));
      }

      gasDeposit.pagination_listGdDetail = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getGasDepositDetails.rejected]: (state, action) => {
      const { parentKey, listKey = "list_gasDeposit", index } = action.meta.arg || {};
      const gasDeposit = parentKey ? state[parentKey] : state[listKey][index];
      gasDeposit.loading_listGdDetail = false;

      if (!action.meta.arg?.isLoadMore) {
        gasDeposit.list_gasDepositDetail = [];
        gasDeposit.pagination_listGdDetail = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Get Gas Deposit Detail Mutations */
    [getGasDepositDetailMutations.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        const { parentKey, listKey = "list_gasDeposit", index, detailIndex } = action.meta.arg || {};
        const parent = parentKey ? state[parentKey] : state[listKey][index];
        const gasDepositDetail = parent.list_gasDepositDetail[detailIndex];
        gasDepositDetail.loading_listGdDetailMutation = true;
      }
    },
    [getGasDepositDetailMutations.fulfilled]: (state, action) => {
      const { result, page, isLoadMore, index, detailIndex, listKey = "list_gasDeposit", parentKey } = action.payload;
      const gasDeposit = parentKey ? state[parentKey] : state[listKey][index]
      const gasDepositDetail = gasDeposit.list_gasDepositDetail[detailIndex];
      gasDepositDetail.loading_listGdDetailMutation = false;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(gasDepositDetail.list_gasDepositDetailMutation.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          gasDepositDetail.list_gasDepositDetailMutation = [
            ...gasDepositDetail.list_gasDepositDetailMutation,
            ...filteredResult,
          ];
        }
        else
          gasDepositDetail.list_gasDepositDetailMutation = result;
      }

      gasDepositDetail.pagination_listGdDetailMutation = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getGasDepositDetailMutations.rejected]: (state, action) => {
      const { parentKey, listKey = "list_gasDeposit", index, detailIndex } = action.meta.arg || {};
      const gasDeposit = parentKey ? state[parentKey] : state[listKey][index];
      const gasDepositDetail = gasDeposit.list_gasDepositDetail[detailIndex];
      gasDepositDetail.loading_listGdDetailMutation = false;

      if (!action.meta.arg?.isLoadMore) {
        gasDepositDetail.list_gasDepositDetailMutation = [];
        gasDepositDetail.pagination_listGdDetailMutation = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Get Gas Deposit History */
    [getGasDepositHistories.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listGdHistory = true;
      }
    },
    [getGasDepositHistories.fulfilled]: (state, action) => {
      state.loading_listGdHistory = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_gasDepositHistory.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_gasDepositHistory = [
            ...state.list_gasDepositHistory,
            ...filteredResult,
          ];
        }
        else
          state.list_gasDepositHistory = result;
      }

      state.pagination_listGdHistory = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getGasDepositHistories.rejected]: (state, action) => {
      if (action.meta.aborted) return;
      state.loading_listGdHistory = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_gasDepositHistory = [];
        state.pagination_listGdHistory = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Get Detail Gas Deposit */
    [getGasDeposit.pending]: (state) => {
      state.detail_gasDeposit = {};
      state.loading_detailGd = true;
    },
    [getGasDeposit.fulfilled]: (state, action) => {
      state.detail_gasDeposit = {
        ...(action.payload.result || {}),
        list_gasDepositDetail: state.detail_gasDeposit.list_gasDepositDetail ?? [],
        pagination_listGdDetail: state.detail_gasDeposit.pagination_listGdDetail ?? { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 },
        loading_listGdDetail: state.detail_gasDeposit.loading_listGdDetail ?? false,
      };
      state.loading_detailGd = false;
    },
    [getGasDeposit.rejected]: (state) => {
      state.detail_gasDeposit = {};
      state.loading_detailGd = false;
    },

    /** Get Detail Draft Gas Deposit */
    [getGasDepositDraft.pending]: (state) => {
      state.detailDraft_gasDeposit = {};
      state.loading_detailDraftGd = true;
    },
    [getGasDepositDraft.fulfilled]: (state, action) => {
      state.detailDraft_gasDeposit = {
        ...(action.payload.result || {}),
        list_gasDepositDetail: state.detailDraft_gasDeposit.list_gasDepositDetail ?? [],
        pagination_listGdDetail: state.detailDraft_gasDeposit.pagination_listGdDetail ?? { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 },
        loading_listGdDetail: state.detailDraft_gasDeposit.loading_listGdDetail ?? false,
      };
      state.loading_detailDraftGd = false;
    },
    [getGasDepositDraft.rejected]: (state) => {
      state.detailDraft_gasDeposit = {};
      state.loading_detailDraftGd = false;
    },

    /** Get Detail Gas Deposit */
    [getGasDepositHistory.pending]: (state) => {
      state.detail_gasDepositHistory = {};
      state.loading_detailGdHistory = true;
    },
    [getGasDepositHistory.fulfilled]: (state, action) => {
      state.detail_gasDepositHistory = action.payload || {};
      state.loading_detailGdHistory = false;
    },
    [getGasDepositHistory.rejected]: (state) => {
      state.detail_gasDepositHistory = {};
      state.loading_detailGdHistory = false;
    },

    [recalculateGasDeposit.pending]: (state) => {
      state.loading_recalculateExpireGd = true;
    },
    [recalculateGasDeposit.fulfilled]: (state) => {
      state.loading_recalculateExpireGd = false;
    },
    [recalculateGasDeposit.rejected]: (state) => {
      state.loading_recalculateExpireGd = false;
    },

    [expireGasDeposit.pending]: (state) => {
      state.loading_recalculateExpireGd = true;
    },
    [expireGasDeposit.fulfilled]: (state) => {
      state.loading_recalculateExpireGd = false;
    },
    [expireGasDeposit.rejected]: (state) => {
      state.loading_recalculateExpireGd = false;
    },

    /** Get Gas Deposit Approval Hierarchy */
    [getGdApprovalHierarchies.pending]: (state) => {
      state.list_gdApprovalHierarchy = [];
      state.loading_listGdApprovalHierarchy = true;
    },
    [getGdApprovalHierarchies.fulfilled]: (state, action) => {
      state.list_gdApprovalHierarchy = action.payload;
      state.loading_listGdApprovalHierarchy = false;
    },
    [getGdApprovalHierarchies.rejected]: (state) => {
      state.list_gdApprovalHierarchy = [];
      state.loading_listGdApprovalHierarchy = false;
    },

    /** Get Gas Deposit Detail Approval Hierarchy */
    [getGdApprovalHierarchy.pending]: (state) => {
      state.detail_gdApprovalHierarchy = [];
      state.loading_detailGdApprovalHierarchy = true;
    },
    [getGdApprovalHierarchy.fulfilled]: (state, action) => {
      state.detail_gdApprovalHierarchy = action.payload;
      state.loading_detailGdApprovalHierarchy = false;
    },
    [getGdApprovalHierarchy.rejected]: (state) => {
      state.detail_gdApprovalHierarchy = [];
      state.loading_detailGdApprovalHierarchy = false;
    },

    /** Get Gas Deposit Attachment Category */
    [getGdAttachmentCategories.pending]: (state) => {
      state.loading_listGdAttachmentCategory = true;
    },
    [getGdAttachmentCategories.fulfilled]: (state, action) => {
      state.list_gdAttachmentCategory = action.payload;
      state.loading_listGdAttachmentCategory = false;
    },
    [getGdAttachmentCategories.rejected]: (state) => {
      state.list_gdAttachmentCategory = [];
      state.loading_listGdAttachmentCategory = false;
    },

    /** Get Gas Deposit Account Standard */
    [getGdAccounts.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listGdAccountStandard = true;
      }
    },
    [getGdAccounts.fulfilled]: (state, action) => {
      state.loading_listGdAccountStandard = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_gdAccountStandard.map((item) => item.accountId));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.accountId));

          state.list_gdAccountStandard = [
            ...state.list_gdAccountStandard,
            ...filteredResult,
          ];
        }
        else
          state.list_gdAccountStandard = result;
      }

      state.pagination_listGdAccount = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getGdAccounts.rejected]: (state, action) => {
      state.loading_listGdAccountStandard = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_gdAccountStandard = [];
        state.pagination_listGdAccount = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Approve or Reject Gas Deposit */
    [approveOrRejectGasDeposit.pending]: (state) => {
      state.loading_approveRejectGd = true;
    },
    [approveOrRejectGasDeposit.fulfilled]: (state) => {
      state.loading_approveRejectGd = false;
    },
    [approveOrRejectGasDeposit.rejected]: (state) => {
      state.loading_approveRejectGd = false;
    },

    /** Approve or Reject Inactive Gas Deposit */
    [approveOrRejectInactiveGasDeposit.pending]: (state) => {
      state.loading_approveRejectGd = true;
    },
    [approveOrRejectInactiveGasDeposit.fulfilled]: (state) => {
      state.loading_approveRejectGd = false;
    },
    [approveOrRejectInactiveGasDeposit.rejected]: (state) => {
      state.loading_approveRejectGd = false;
    },

    /** Approve or Reject All Inactive Gas Deposit */
    [approveOrRejectAllGasDeposit.pending]: (state, action) => {
      if (action.meta.arg?.action === "APPROVE")
        state.loading_approveGd = true;
      else if (action.meta.arg?.action === "REJECT")
        state.loading_rejectGd = true;
    },
    [approveOrRejectAllGasDeposit.fulfilled]: (state, action) => {
      if (action.meta.arg?.action === "APPROVE")
        state.loading_approveGd = false;
      else if (action.meta.arg?.action === "REJECT")
        state.loading_rejectGd = false;
    },
    [approveOrRejectAllGasDeposit.rejected]: (state, action) => {
      if (action.meta.arg?.action === "APPROVE")
        state.loading_approveGd = false;
      else if (action.meta.arg?.action === "REJECT")
        state.loading_rejectGd = false;
    },

    /** Inactivate Gas Deposit Attachment */
    [inactivateGasDeposit.pending]: (state) => {
      state.loading_inactivateGd = true;
    },
    [inactivateGasDeposit.fulfilled]: (state) => {
      state.loading_inactivateGd = false;
    },
    [inactivateGasDeposit.rejected]: (state) => {
      state.loading_inactivateGd = false;
    },

    /** Get Gas Deposit Approval History */
    [getGdApprovalHistory.pending]: (state) => {
      state.loading_gdApprovalHistory = true;
    },
    [getGdApprovalHistory.fulfilled]: (state, action) => {
      state.loading_gdApprovalHistory = false;
      state.detail_gdApprovalHistory = action.payload;
    },
    [getGdApprovalHistory.rejected]: (state) => {
      state.loading_gdApprovalHistory = false;
    },
  },
});
const { reducer } = gasDepositSlice;
export default reducer;
