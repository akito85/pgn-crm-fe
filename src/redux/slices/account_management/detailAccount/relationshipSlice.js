import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import {
  showModalError,
  showModalSuccess,
  validateError,
} from "../../general_slice";

const initialState = {
  // --- Shared ---
  loading: false,

  // --- List ---
  loading_listRelationship: false,
  list_relationship: [],
  pagination_relationship: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 20,
  },

  // --- Approval List ---
  loading_listRelationshipApproval: false,
  list_relationshipApproval: [],
  pagination_relationshipApproval: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 20,
  },

  // --- Detail ---
  loading_detailRelationship: false,
  data_relationshipDetail: {},
  loading_detailDraftRelationship: false,
  detailDraft_relationshipDetail: {},

  // --- Create / Update ---
  loading_createUpdateRelationship: false,

  // --- Approve / Reject ---
  loading_approveRejectRelationship: false,

  // --- Inactivate ---
  loading_inactivateRelationship: false,

  // --- Form Options ---
  loading_listRelationshipType: false,
  data_relationshipType: [],
  loading_listRelationshipCategory: false,
  data_relationshipCategory: [],
  loading_listRelationshipApprovalOption: false,
  data_approvalHierarchies: [],
  loading_listRelationshipApprovalHierarchyDetail: false,
  data_approvalHierarchyDetail: [],
  data_attachmentCategory: [],
  data_attachmentList: [],
  loading_detailRelationshipAttachment: false,

  // --- Related Object ---
  loading_listRelatedObject: false,
  list_relatedObject: [],
  pagination_relatedObject: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 20,
  },

  // --- History ---
  loading_approvalHistoryRelationship: false,
  data_approvalHistory: {},

  // --- Dynamic Search ---
  data_globalTypeCondition: [],
  data_globalTypeOperator: [],
  data_globalTypeColumn: [],
};

// Get Relationship List (POST)
export const getRelationshipList = createAsyncThunk(
  "GET_RELATIONSHIP_LIST",
  async ({ accountId, page, pageSize, sort, search, body, isLoadMore }, thunkAPI) => {
    try {
      const sortParam = sort === undefined || sort === "" ? "" : sort;
      const url = `/v1/dbs/api/accounts/${accountId}/relationships`;
      const requestBody = {
        ...body,
        page,
        size: pageSize,
        sort: sortParam,
        listType: "all",
      };
      const response = await accountManagementService.updateDataWithMethodPost(url, requestBody);
      return {
        ...response?.data,
        isLoadMore,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getRelationshipApprovalList = createAsyncThunk(
  "GET_RELATIONSHIP_APPROVAL_LIST",
  async ({ accountId, page, pageSize, sort, search, body, isLoadMore }, thunkAPI) => {
    try {
      const sortParam = sort === undefined || sort === "" ? "" : sort;
      const url = `/v1/dbs/api/accounts/${accountId}/relationships`;
      const requestBody = {
        ...body,
        page,
        size: pageSize,
        sort: sortParam,
        listType: "approval",
      };
      const response = await accountManagementService.updateDataWithMethodPost(url, requestBody);
      return {
        ...response?.data,
        isLoadMore,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Relationship Detail
export const getRelationshipDetail = createAsyncThunk(
  "GET_RELATIONSHIP_DETAIL",
  async ({ accountId, idRelationship }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/relationships/${idRelationship}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Relationship Detail Draft
export const getDetailDraftRelationship = createAsyncThunk(
  "GET_DETAIL_DRAFT_RELATIONSHIP",
  async ({ accountId, idRelationship }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/relationships/detail-draft/${idRelationship}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Relationship Type Options
export const getRelationshipType = createAsyncThunk(
  "GET_RELATIONSHIP_TYPE",
  async ({ accountId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/relationships/relationship-type`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Relationship Category Options
export const getRelationshipCategory = createAsyncThunk(
  "GET_RELATIONSHIP_CATEGORY",
  async ({ accountId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/relationships/relationship-category`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Approval Hierarchies
export const getApprovalHierarchies = createAsyncThunk(
  "GET_APPROVAL_HIERARCHIES",
  async ({ accountId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/relationships/approval-hierarchies`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Approval Hierarchy Detail
export const getApprovalHierarchyDetail = createAsyncThunk(
  "GET_APPROVAL_HIERARCHY_DETAIL",
  async ({ accountId, appHierId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/relationships/approval-hierarchy/${appHierId}`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Approval History
export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY",
  async ({ accountId, relationshipId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/relationships/approval-history/${relationshipId}`;
      const response = await accountManagementService.getAll(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Relationship Search Column
export const getRelationshipColumnApi = createAsyncThunk(
  "GET_RELATIONSHIP_COLUMN_API",
  async ({ accountId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/relationships/list-search-column`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Relationship Search Condition
export const getRelationshipConditionApi = createAsyncThunk(
  "GET_RELATIONSHIP_CONDITION_API",
  async ({ accountId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/relationships/list-search-condition`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Relationship Search Operator
export const getRelationshipOperatorApi = createAsyncThunk(
  "GET_RELATIONSHIP_OPERATOR_API",
  async ({ accountId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/relationships/list-search-operator`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const inactivateRelationship = createAsyncThunk(
  "INACTIVATE_RELATIONSHIP",
  async ({ accountId, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/relationships/inactive`;
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
          description: `Your data was not submitted. An unknown error occured.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Create Relationship
export const createRelationship = createAsyncThunk(
  "CREATE_RELATIONSHIP",
  async ({ accountId, payload, attachments = [] }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/relationships/create`;
      const response = await accountManagementService.createData(url, payload);

      const { id } = response?.data || {};

      if (id && attachments.length > 0) {
        const uploadUrl = `/v1/dbs/api/accounts/${accountId}/relationships/upload-attachment`;
        const uploadPromises = attachments.map((attachment) =>
          accountManagementService.uploadAttachment(uploadUrl, {
            files: attachment.file,
            category: attachment.fileCategoryId,
            refId: id,
          })
        );
        await Promise.all(uploadPromises);
      }

      const successMessage = {
        title: "Successful",
        description: `Relationship has been ${payload?.action === "DRAFT" ? 'drafted' : 'submitted'}.`,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        description: `Relationship was not ${payload?.action === "DRAFT" ? 'drafted' : 'submitted'}. ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Update Relationship
export const updateRelationship = createAsyncThunk(
  "UPDATE_RELATIONSHIP",
  async ({ accountId, idRelationship, payload, attachments = [] }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/relationships/${idRelationship}`;
      const response = await accountManagementService.updateData(url, payload);

      if (attachments.length > 0) {
        const uploadUrl = `/v1/dbs/api/accounts/${accountId}/relationships/upload-attachment`;
        const uploadPromises = attachments.map((attachment) =>
          accountManagementService.uploadAttachment(uploadUrl, {
            files: attachment.file,
            category: attachment.fileCategoryId,
            refId: idRelationship,
          })
        );
        await Promise.all(uploadPromises);
      }

      const successMessage = {
        title: "Successful",
        description: `Relationship has been ${payload?.action === "DRAFT" ? 'drafted' : 'submitted'}.`,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        description: `Relationship was not ${payload?.action === "DRAFT" ? 'drafted' : 'submitted'}. ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Attachment Category
export const getAttachmentCategory = createAsyncThunk(
  "GET_ATTACHMENT_CATEGORY",
  async ({ accountId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/relationships/attachment-category`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Related Object Data (Customer or Account based on relationship type)
export const getRelatedObjectData = createAsyncThunk(
  "GET_RELATED_OBJECT_DATA",
  async ({ accountId, relationshipType, relationshipCategory, body, isLoadMore }, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams();

      if (relationshipType) queryParams.append("relationshipType", relationshipType);
      if (relationshipCategory) queryParams.append("relationshipCategory", relationshipCategory);

      let url = `/v1/dbs/api/accounts/${accountId}/relationships/related-object-data`;
      if (queryParams.toString().length) url += `?${queryParams.toString()}`;

      const response = await accountManagementService.updateDataWithMethodPost(url, body);
      return {
        ...response?.data,
        isLoadMore,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Approve or Reject Relationship
export const approveOrRejectRelationship = createAsyncThunk(
  "APPROVE_OR_REJECT_RELATIONSHIP",
  async ({ accountId, body, action }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/relationships/approve`;
      const response = await accountManagementService.activationWithRemark(url, body, {
        headers: {
          "Accept": "application/json"
        }
      });

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "APPROVE" ? 'approved' : 'rejected'}.`,
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
        message = "An unknown error occurred";

      const errorBody = {
        title: "Failed",
        description: `Your data was not ${action === "APPROVE" ? 'approved' : 'rejected'}. ${message}.`,
      };

      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Approve or Reject Inactive Relationship
export const approveOrRejectInactiveRelationship = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_RELATIONSHIP",
  async ({ accountId, body, action }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/relationships/approve-inactive`;
      const response = await accountManagementService.activationWithRemark(url, body, {
        headers: {
          "Accept": "application/json"
        }
      });

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "APPROVE" ? 'approved' : 'rejected'}.`,
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
        message = "An unknown error occurred";

      const errorBody = {
        title: "Failed",
        description: `Your data was not ${action === "APPROVE" ? 'approved' : 'rejected'}. ${message}.`,
      };

      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Download Relationship to Excel
export const downloadRelationship = createAsyncThunk(
  "DOWNLOAD_RELATIONSHIP",
  async ({ accountId, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/relationships/export-excel`;
      const response = await accountManagementService.downloadDataAdvanced(url, body);
      return response;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: error, action: "DOWNLOAD_RELATIONSHIP", back: false }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

const relationshipSlice = createSlice({
  name: "relationship",
  initialState,
  extraReducers: {
    // Get Relationship List
    [getRelationshipList.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listRelationship = true;
      }
    },
    [getRelationshipList.fulfilled]: (state, action) => {
      state.loading_listRelationship = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_relationship.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_relationship = [
            ...state.list_relationship,
            ...filteredResult,
          ];
        } else {
          state.list_relationship = result;
        }
      }

      state.pagination_relationship = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 20,
      };
    },
    [getRelationshipList.rejected]: (state, action) => {
      state.loading_listRelationship = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_relationship = [];
        state.pagination_relationship = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 20,
        };
      }
    },

    // Get Relationship Approval List
    [getRelationshipApprovalList.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listRelationshipApproval = true;
      }
    },
    [getRelationshipApprovalList.fulfilled]: (state, action) => {
      state.loading_listRelationshipApproval = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_relationshipApproval.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_relationshipApproval = [
            ...state.list_relationshipApproval,
            ...filteredResult,
          ];
        } else {
          state.list_relationshipApproval = result;
        }
      }

      state.pagination_relationshipApproval = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 20,
      };
    },
    [getRelationshipApprovalList.rejected]: (state, action) => {
      state.loading_listRelationshipApproval = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_relationshipApproval = [];
        state.pagination_relationshipApproval = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 20,
        };
      }
    },

    // Get Relationship Detail
    [getRelationshipDetail.pending]: (state) => {
      state.loading_detailRelationship = true;
    },
    [getRelationshipDetail.fulfilled]: (state, action) => {
      state.data_relationshipDetail = action.payload;
      state.loading_detailRelationship = false;
    },
    [getRelationshipDetail.rejected]: (state) => {
      state.loading_detailRelationship = false;
    },

    // Get Relationship Detail Draft
    [getDetailDraftRelationship.pending]: (state) => {
      state.loading_detailDraftRelationship = true;
    },
    [getDetailDraftRelationship.fulfilled]: (state, action) => {
      state.detailDraft_relationshipDetail = action.payload;
      state.loading_detailDraftRelationship = false;
    },
    [getDetailDraftRelationship.rejected]: (state) => {
      state.detailDraft_relationshipDetail = {};
      state.loading_detailDraftRelationship = false;
    },

    // Get Relationship Type
    [getRelationshipType.pending]: (state) => {
      state.loading_listRelationshipType = true;
    },
    [getRelationshipType.fulfilled]: (state, action) => {
      state.data_relationshipType = action.payload;
      state.loading_listRelationshipType = false;
    },
    [getRelationshipType.rejected]: (state) => {
      state.loading_listRelationshipType = false;
    },

    // Get Relationship Category
    [getRelationshipCategory.pending]: (state) => {
      state.loading_listRelationshipCategory = true;
    },
    [getRelationshipCategory.fulfilled]: (state, action) => {
      state.data_relationshipCategory = action.payload;
      state.loading_listRelationshipCategory = false;
    },
    [getRelationshipCategory.rejected]: (state) => {
      state.loading_listRelationshipCategory = false;
    },

    // Get Approval Hierarchies
    [getApprovalHierarchies.pending]: (state) => {
      state.loading_listRelationshipApprovalOption = true;
    },
    [getApprovalHierarchies.fulfilled]: (state, action) => {
      state.data_approvalHierarchies = action.payload;
      state.loading_listRelationshipApprovalOption = false;
    },
    [getApprovalHierarchies.rejected]: (state) => {
      state.loading_listRelationshipApprovalOption = false;
    },

    // Get Approval Hierarchy Detail
    [getApprovalHierarchyDetail.pending]: (state) => {
      state.data_approvalHierarchyDetail = [];
      state.loading_listRelationshipApprovalHierarchyDetail = true;
    },
    [getApprovalHierarchyDetail.fulfilled]: (state, action) => {
      state.data_approvalHierarchyDetail = action.payload;
      state.loading_listRelationshipApprovalHierarchyDetail = false;
    },
    [getApprovalHierarchyDetail.rejected]: (state) => {
      state.loading_listRelationshipApprovalHierarchyDetail = false;
    },

    // Get Relationship Search Column
    [getRelationshipColumnApi.pending]: (state) => {
      state.loading = true;
    },
    [getRelationshipColumnApi.fulfilled]: (state, action) => {
      state.data_globalTypeColumn = action.payload;
      state.loading = false;
    },
    [getRelationshipColumnApi.rejected]: (state) => {
      state.loading = false;
    },

    // Get Relationship Search Operator
    [getRelationshipOperatorApi.pending]: (state) => {
      state.loading = true;
    },
    [getRelationshipOperatorApi.fulfilled]: (state, action) => {
      state.data_globalTypeOperator = action.payload;
      state.loading = false;
    },
    [getRelationshipOperatorApi.rejected]: (state) => {
      state.loading = false;
    },

    // Get Relationship Search Condition
    [getRelationshipConditionApi.pending]: (state) => {
      state.loading = true;
    },
    [getRelationshipConditionApi.fulfilled]: (state, action) => {
      state.data_globalTypeCondition = action.payload;
      state.loading = false;
    },
    [getRelationshipConditionApi.rejected]: (state) => {
      state.loading = false;
    },

    // Inactivate Relationship
    [inactivateRelationship.pending]: (state) => {
      state.loading_inactivateRelationship = true;
    },
    [inactivateRelationship.fulfilled]: (state) => {
      state.loading_inactivateRelationship = false;
    },
    [inactivateRelationship.rejected]: (state) => {
      state.loading_inactivateRelationship = false;
    },

    // Create Relationship
    [createRelationship.pending]: (state) => {
      state.loading_createUpdateRelationship = true;
    },
    [createRelationship.fulfilled]: (state) => {
      state.loading_createUpdateRelationship = false;
    },
    [createRelationship.rejected]: (state) => {
      state.loading_createUpdateRelationship = false;
    },

    // Update Relationship
    [updateRelationship.pending]: (state) => {
      state.loading_createUpdateRelationship = true;
    },
    [updateRelationship.fulfilled]: (state) => {
      state.loading_createUpdateRelationship = false;
    },
    [updateRelationship.rejected]: (state) => {
      state.loading_createUpdateRelationship = false;
    },

    // Get Attachment Category
    [getAttachmentCategory.pending]: (state) => {
      state.loading = true;
    },
    [getAttachmentCategory.fulfilled]: (state, action) => {
      state.data_attachmentCategory = action.payload;
      state.loading = false;
    },
    [getAttachmentCategory.rejected]: (state) => {
      state.loading = false;
    },

    // Get Related Object Data
    [getRelatedObjectData.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listRelatedObject = true;
      }
    },
    [getRelatedObjectData.fulfilled]: (state, action) => {
      state.loading_listRelatedObject = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_relatedObject.map((item) => item.id || item.relatedObjectId));
          const filteredResult = result.filter(
            (resultItem) => !currentIds.has(resultItem.id || resultItem.relatedObjectId)
          );
          state.list_relatedObject = [
            ...state.list_relatedObject,
            ...filteredResult,
          ];
        } else {
          state.list_relatedObject = result;
        }
      }

      state.pagination_relatedObject = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 20,
      };
    },
    [getRelatedObjectData.rejected]: (state, action) => {
      state.loading_listRelatedObject = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_relatedObject = [];
        state.pagination_relatedObject = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 20,
        };
      }
    },

    // Get Approval History
    [getApprovalHistory.pending]: (state) => {
      state.loading_approvalHistoryRelationship = true;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.data_approvalHistory = action.payload;
      state.loading_approvalHistoryRelationship = false;
    },
    [getApprovalHistory.rejected]: (state) => {
      state.loading_approvalHistoryRelationship = false;
    },

    // Approve or Reject Relationship
    [approveOrRejectRelationship.pending]: (state) => {
      state.loading_approveRejectRelationship = true;
    },
    [approveOrRejectRelationship.fulfilled]: (state) => {
      state.loading_approveRejectRelationship = false;
    },
    [approveOrRejectRelationship.rejected]: (state) => {
      state.loading_approveRejectRelationship = false;
    },

    // Approve or Reject Inactive Relationship
    [approveOrRejectInactiveRelationship.pending]: (state) => {
      state.loading_approveRejectRelationship = true;
    },
    [approveOrRejectInactiveRelationship.fulfilled]: (state) => {
      state.loading_approveRejectRelationship = false;
    },
    [approveOrRejectInactiveRelationship.rejected]: (state) => {
      state.loading_approveRejectRelationship = false;
    },
  },
});

export default relationshipSlice.reducer;
