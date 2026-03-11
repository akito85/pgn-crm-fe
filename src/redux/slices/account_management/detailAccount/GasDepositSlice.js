import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import { setBodyError, showModalError, showModalSuccess, validateError } from "../../general_slice";

const initialState = {
  loading_listGd: false,
  list_gasDeposit: [],
  pagination_gasDeposit: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },
  loading_listGdApproval: false,
  list_gasDepositApproval: [],
  pagination_gasDepositApproval: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },
  loading_listGdApprovalOption: false,
  list_gdApprovalOptions: [],
  loading_listGdApprovalHierarchyDetail: false,
  list_gdApprovalHierarchyDetail: [],
  loading_listGdAttachmentCategory: false,
  data_gdAttachmentCategory: [],
  loading_listGdAccountStandard: false,
  list_gdAccountStandard: [],
  pagination_gdAccountStandard: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },
  loading_detailGd: false,
  detail_gasDeposit: {},
  loading_detailDraftGd: false,
  detailDraft_gasDeposit: {},
  loading_detailGdDetailAttachment: false,
  list_gdDetailAttachment: [],
  pagination_gdDetailAttachment: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },
  loading_gdApprovalHistory: false,
  data_gdApprovalHistory: {},
  loading_approveRejectGd: false,
  loading_inactivateGd: false,
};

export const getGasDeposit = createAsyncThunk(
  "GET_GAS_DEPOSIT",
  async ({ id, body, isLoadMore }, thunkAPI) => {
    try {
      body = {
        ...body,
        listType: "all"
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

export const getGasDepositApproval = createAsyncThunk(
  "GET_GAS_DEPOSIT_APPROVAL",
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

export const getGasDepositAttachment = createAsyncThunk(
  "GET_GAS_DEPOSIT_ATTACHMENT",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/list-attachment/${id}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getDetailGasDeposit = createAsyncThunk(
  "GET_DETAIL_GAS_DEPOSIT",
  async ({ id, subjectId, objectId }, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams;

      if (subjectId)
        queryParams.append("subjectId", subjectId);
      if (objectId)
        queryParams.append("objectId", objectId);

      let url = `/v1/dbs/api/gas-deposit/${id}`;

      if (queryParams.toString().length)
        url += `?${queryParams.toString()}`;

      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDetailDraftGasDeposit = createAsyncThunk(
  "GET_DETAIL_DRAFT_GAS_DEPOSIT",
  async ({ id, subjectId, objectId }, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams;

      if (subjectId)
        queryParams.append("subjectId", subjectId);
      if (objectId)
        queryParams.append("objectId", objectId);

      let url = `/v1/dbs/api/gas-deposit/detail-draft/${id}`;

      if (queryParams.toString().length)
        url += `?${queryParams.toString()}`;

      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getGdApprovalHierarchy = createAsyncThunk(
  "GET_GD_APPROVAL_HIERARCHY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/approval-hierarchies`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getDetailGdApprovalHierarchy = createAsyncThunk(
  "GET_DETAIL_GD_APPROVAL_HIERARCHY",
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

export const getGdAttachmentCategory = createAsyncThunk(
  "GET_GD_ATTACHMENT_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/attachment-category`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getGdAccountStandard = createAsyncThunk(
  "GET_GD_ACCOUNT_STANDARD",
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
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
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
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
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

export const approveOrRejectAllGasDeposit = createAsyncThunk(
  "APPROVE_OR_REJECT_ALL_GAS_DEPOSIT",
  async ({ body, inactiveBody, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/gas-deposit/approve";
      const inactiveUrl = "/v1/dbs/api/gas-deposit/approve-inactive";
      
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
      if (Math.floor((error.response.data.code || 0) / 100) !== 4)
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
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
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

export const getGdApprovalHistory = createAsyncThunk(
  "GET_GD_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gas-deposit/approval-history/${id}`;
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

const gasDepositSlice = createSlice({
  name: "gasDeposit",
  initialState,
  extraReducers: {
    /** Get Gas Deposit */
    [getGasDeposit.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listGd = true;
      }
    },
    [getGasDeposit.fulfilled]: (state, action) => {
      state.loading_listGd = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_gasDeposit.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_gasDeposit = [
            ...state.list_gasDeposit,
            ...filteredResult,
          ];
        }
        else
          state.list_gasDeposit = result;
      }

      state.pagination_gasDeposit = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getGasDeposit.rejected]: (state, action) => {
      state.loading_listGd = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_gasDeposit = [];
        state.pagination_gasDeposit = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Get Gas Deposit Approval */
    [getGasDepositApproval.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listGdApproval = true;
      }
    },
    [getGasDepositApproval.fulfilled]: (state, action) => {
      state.loading_listGdApproval = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_gasDepositApproval.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_gasDepositApproval = [
            ...state.list_gasDepositApproval,
            ...filteredResult,
          ];
        }
        else
          state.list_gasDepositApproval = result;
      }

      state.pagination_gasDepositApproval = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getGasDepositApproval.rejected]: (state, action) => {
      state.loading_listGdApproval = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_gasDepositApproval = [];
        state.pagination_gasDepositApproval = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Get Detail Gas Deposit */
    [getDetailGasDeposit.pending]: (state) => {
      state.detail_gasDeposit = {};
      state.loading_detailGd = true;
    },
    [getDetailGasDeposit.fulfilled]: (state, action) => {
      state.detail_gasDeposit = action.payload || {};
      state.loading_detailGd = false;
    },
    [getDetailGasDeposit.rejected]: (state) => {
      state.detail_gasDeposit = {};
      state.loading_detailGd = false;
    },

    /** Get Detail Draft Gas Deposit */
    [getDetailDraftGasDeposit.pending]: (state) => {
      state.detailDraft_gasDeposit = {};
      state.loading_detailDraftGd = true;
    },
    [getDetailDraftGasDeposit.fulfilled]: (state, action) => {
      state.detailDraft_gasDeposit = action.payload || {};
      state.loading_detailDraftGd = false;
    },
    [getDetailDraftGasDeposit.rejected]: (state) => {
      state.detailDraft_gasDeposit = {};
      state.loading_detailDraftGd = false;
    },

    /** Get Gas Deposit Approval Hierarchy */
    [getGdApprovalHierarchy.pending]: (state) => {
      state.list_gdApprovalOptions = [];
      state.loading_listGdApprovalOption = true;
    },
    [getGdApprovalHierarchy.fulfilled]: (state, action) => {
      state.list_gdApprovalOptions = action.payload;
      state.loading_listGdApprovalOption = false;
    },
    [getGdApprovalHierarchy.rejected]: (state) => {
      state.list_gdApprovalOptions = [];
      state.loading_listGdApprovalOption = false;
    },

    /** Get Gas Deposit Detail Approval Hierarchy */
    [getDetailGdApprovalHierarchy.pending]: (state) => {
      state.list_gdApprovalHierarchyDetail = [];
      state.loading_listGdApprovalHierarchyDetail = true;
    },
    [getDetailGdApprovalHierarchy.fulfilled]: (state, action) => {
      state.list_gdApprovalHierarchyDetail = action.payload;
      state.loading_listGdApprovalHierarchyDetail = false;
    },
    [getDetailGdApprovalHierarchy.rejected]: (state) => {
      state.list_gdApprovalHierarchyDetail = [];
      state.loading_listGdApprovalHierarchyDetail = false;
    },

    /** Get Gas Deposit Attachment Category */
    [getGdAttachmentCategory.pending]: (state) => {
      state.loading_listGdAttachmentCategory = true;
    },
    [getGdAttachmentCategory.fulfilled]: (state, action) => {
      state.data_gdAttachmentCategory = action.payload;
      state.loading_listGdAttachmentCategory = false;
    },
    [getGdAttachmentCategory.rejected]: (state) => {
      state.data_gdAttachmentCategory = [];
      state.loading_listGdAttachmentCategory = false;
    },

    /** Get Gas Deposit Account Standard */
    [getGdAccountStandard.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listGdAccountStandard = true;
      }
    },
    [getGdAccountStandard.fulfilled]: (state, action) => {
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

      state.pagination_gdAccountStandard = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getGdAccountStandard.rejected]: (state, action) => {
      state.loading_listGdAccountStandard = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_gdAccountStandard = [];
        state.pagination_gdAccountStandard = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Get Gas Deposit Attachment */
    [getGasDepositAttachment.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_detailGdDetailAttachment = true;
      }
    },
    [getGasDepositAttachment.fulfilled]: (state, action) => {
      state.loading_detailGdDetailAttachment = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_gdDetailAttachment.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_gdDetailAttachment = [
            ...state.list_gdDetailAttachment,
            ...filteredResult,
          ];
        }
        else
          state.list_gdDetailAttachment = result;
      }

      state.pagination_gdDetailAttachment = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getGasDepositAttachment.rejected]: (state, action) => {
      state.loading_detailGdDetailAttachment = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_gdDetailAttachment = [];
        state.pagination_gdDetailAttachment = {
          totalPages: 0,
          totalElements: 0,
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
    [approveOrRejectAllGasDeposit.pending]: (state) => {
      state.loading_approveRejectGd = true;
    },
    [approveOrRejectAllGasDeposit.fulfilled]: (state) => {
      state.loading_approveRejectGd = false;
    },
    [approveOrRejectAllGasDeposit.rejected]: (state) => {
      state.loading_approveRejectGd = false;
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
      state.data_gdApprovalHistory = action.payload;
    },
    [getGdApprovalHistory.rejected]: (state) => {
      state.loading_gdApprovalHistory = false;
    },
  },
});
const { reducer } = gasDepositSlice;
export default reducer;
