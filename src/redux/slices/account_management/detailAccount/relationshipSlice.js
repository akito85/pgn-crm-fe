import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import {
  showModalError,
  showModalSuccess,
  validateError,
} from "../../general_slice";

const initialState = {
  // --- List ---
  loading_listRelationship: false,
  list_relationship: [],
  pagination_listRelationship: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 20,
  },

  // --- Approval List ---
  loading_listRelationshipApproval: false,
  list_relationshipApproval: [],
  pagination_listRelationshipApproval: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 20,
  },

  // --- Detail ---
  loading_detailRelationship: false,
  detail_relationship: {},
  loading_detailDraftRelationship: false,
  detailDraft_relationship: {},

  // --- Create / Update ---
  loading_createUpdateRelationship: false,

  // --- Approve / Reject ---
  loading_approveRejectRelationship: false,
  loading_approveRelationship: false,
  loading_rejectRelationship: false,

  // --- Inactivate ---
  loading_inactivateRelationship: false,

  // --- Form Options ---
  loading_listRelationshipType: false,
  list_relationshipType: [],
  loading_listRelationshipCategory: false,
  list_relationshipCategory: [],
  loading_listRelationshipApprovalHierarchy: false,
  list_relationshipApprovalHierarchy: [],
  loading_detailRelationshipApprovalHierarchy: false,
  detail_relationshipApprovalHierarchy: [],
  loading_listRelationshipAttachmentCategory: false,
  list_relationshipAttachmentCategory: [],

  // --- Related Object ---
  loading_listRelatedObject: false,
  list_relatedObject: [],
  pagination_listRelatedObject: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 20,
  },

  // --- History ---
  loading_relationshipApprovalHistory: false,
  detail_relationshipApprovalHistory: {},

  // --- Dynamic Search ---
  data_globalTypeCondition: [],
  data_globalTypeOperator: [],
  data_globalTypeColumn: [],
};

// Get Relationship List (POST)
export const getRelationships = createAsyncThunk(
  "GET_RELATIONSHIPS",
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

export const getRelationshipApprovals = createAsyncThunk(
  "GET_RELATIONSHIP_APPROVALS",
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
export const getRelationship = createAsyncThunk(
  "GET_RELATIONSHIP",
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
export const getRelationshipDraft = createAsyncThunk(
  "GET_RELATIONSHIP_DRAFT",
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
export const getRelationshipTypes = createAsyncThunk(
  "GET_RELATIONSHIP_TYPES",
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
export const getRelationshipCategories = createAsyncThunk(
  "GET_RELATIONSHIP_CATEGORIES",
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
export const getRelationshipApprovalHierarchies = createAsyncThunk(
  "GET_RELATION_APPROVAL_HIERARCHIES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/relationships/approval-hierarchies`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Approval Hierarchy Detail
export const getRelationshipApprovalHierarchy = createAsyncThunk(
  "GET_RELATIONSHIP_APPROVAL_HIERARCHY",
  async (appHierId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/relationships/approval-hierarchy/${appHierId}`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Approval History
export const getRelationshipApprovalHistory = createAsyncThunk(
  "GET_RELATIONSHIP_APPROVAL_HISTORY",
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
        description: `Relationship has been ${payload?.action === "draft" ? 'drafted' : 'submitted'}.`,
        return: false,
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
        description: `Relationship was not ${payload?.action === "draft" ? 'drafted' : 'submitted'}. ${message}`,
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
        description: `Relationship has been ${payload?.action === "draft" ? 'drafted' : 'submitted'}.`,
        return: false,
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
        description: `Relationship was not ${payload?.action === "draft" ? 'drafted' : 'submitted'}. ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Attachment Category
export const getRelationshipAttachmentCategories = createAsyncThunk(
  "GET_RELATIONSHIP_ATTACHMENT_CATEGORIES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/relationships/attachment-category`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Related Object Data (Customer or Account based on relationship type)
export const getRelatedObjects = createAsyncThunk(
  "GET_RELATED_OBJECTS",
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

// Approve or Reject All Relationship (active + inactive in one dispatch)
export const approveOrRejectAllRelationship = createAsyncThunk(
  "APPROVE_OR_REJECT_ALL_RELATIONSHIP",
  async ({ accountId, body, inactiveBody, action }, thunkAPI) => {
    try {
      const approveUrl = `/v1/dbs/api/accounts/${accountId}/relationships/approve`;
      const approveInactiveUrl = `/v1/dbs/api/accounts/${accountId}/relationships/approve-inactive`;

      await Promise.all(
        [
          body && body.length > 0
            ? accountManagementService.activationWithRemark(approveUrl, body, {
                headers: { Accept: "application/json" },
              })
            : null,
          inactiveBody && inactiveBody.length > 0
            ? accountManagementService.activationWithRemark(approveInactiveUrl, inactiveBody, {
                headers: { Accept: "application/json" },
              })
            : null,
        ].filter(Boolean)
      );

      const successBody = {
        title: "Successful",
        description: `Your data has been ${action === "APPROVE" ? "approved" : "rejected"}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return { body, inactiveBody, action };
    } catch (error) {
      let message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();

      if (Math.floor((error.response?.data?.code || 0) / 100) !== 4)
        message = "An unknown error occurred";

      const errorBody = {
        title: "Failed",
        description: `Your data was not ${action === "APPROVE" ? "approved" : "rejected"}. ${message}.`,
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
    [getRelationships.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listRelationship = true;
      }
    },
    [getRelationships.fulfilled]: (state, action) => {
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

      state.pagination_listRelationship = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 20,
      };
    },
    [getRelationships.rejected]: (state, action) => {
      state.loading_listRelationship = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_relationship = [];
        state.pagination_listRelationship = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 20,
        };
      }
    },

    // Get Relationship Approval List
    [getRelationshipApprovals.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listRelationshipApproval = true;
      }
    },
    [getRelationshipApprovals.fulfilled]: (state, action) => {
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

      state.pagination_listRelationshipApproval = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 20,
      };
    },
    [getRelationshipApprovals.rejected]: (state, action) => {
      state.loading_listRelationshipApproval = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_relationshipApproval = [];
        state.pagination_listRelationshipApproval = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 20,
        };
      }
    },

    // Get Relationship Detail
    [getRelationship.pending]: (state) => {
      state.loading_detailRelationship = true;
    },
    [getRelationship.fulfilled]: (state, action) => {
      state.detail_relationship = action.payload.result || {};
      state.loading_detailRelationship = false;
    },
    [getRelationship.rejected]: (state) => {
      state.loading_detailRelationship = false;
    },

    // Get Relationship Detail Draft
    [getRelationshipDraft.pending]: (state) => {
      state.loading_detailDraftRelationship = true;
    },
    [getRelationshipDraft.fulfilled]: (state, action) => {
      state.detailDraft_relationship = action.payload.result || {};
      state.loading_detailDraftRelationship = false;
    },
    [getRelationshipDraft.rejected]: (state) => {
      state.detailDraft_relationship = {};
      state.loading_detailDraftRelationship = false;
    },

    // Get Relationship Type
    [getRelationshipTypes.pending]: (state) => {
      state.loading_listRelationshipType = true;
    },
    [getRelationshipTypes.fulfilled]: (state, action) => {
      state.list_relationshipType= action.payload;
      state.loading_listRelationshipType = false;
    },
    [getRelationshipTypes.rejected]: (state) => {
      state.loading_listRelationshipType = false;
    },

    // Get Relationship Category
    [getRelationshipCategories.pending]: (state) => {
      state.loading_listRelationshipCategory = true;
    },
    [getRelationshipCategories.fulfilled]: (state, action) => {
      state.list_relationshipCategory = action.payload;
      state.loading_listRelationshipCategory = false;
    },
    [getRelationshipCategories.rejected]: (state) => {
      state.loading_listRelationshipCategory = false;
    },

    // Get Approval Hierarchies
    [getRelationshipApprovalHierarchies.pending]: (state) => {
      state.loading_listRelationshipApprovalHierarchy = true;
    },
    [getRelationshipApprovalHierarchies.fulfilled]: (state, action) => {
      state.list_relationshipApprovalHierarchy = action.payload;
      state.loading_listRelationshipApprovalHierarchy = false;
    },
    [getRelationshipApprovalHierarchies.rejected]: (state) => {
      state.loading_listRelationshipApprovalHierarchy = false;
    },

    // Get Approval Hierarchy Detail
    [getRelationshipApprovalHierarchy.pending]: (state) => {
      state.detail_relationshipApprovalHierarchy = [];
      state.loading_detailRelationshipApprovalHierarchy = true;
    },
    [getRelationshipApprovalHierarchy.fulfilled]: (state, action) => {
      state.detail_relationshipApprovalHierarchy = action.payload;
      state.loading_detailRelationshipApprovalHierarchy = false;
    },
    [getRelationshipApprovalHierarchy.rejected]: (state) => {
      state.loading_detailRelationshipApprovalHierarchy = false;
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
    [getRelationshipAttachmentCategories.pending]: (state) => {
      state.loading_listRelationshipAttachmentCategory = true;
    },
    [getRelationshipAttachmentCategories.fulfilled]: (state, action) => {
      state.list_relationshipAttachmentCategory = action.payload;
      state.loading_listRelationshipAttachmentCategory = false;
    },
    [getRelationshipAttachmentCategories.rejected]: (state) => {
      state.loading_listRelationshipAttachmentCategory = false;
    },

    // Get Related Object Data
    [getRelatedObjects.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listRelatedObject = true;
      }
    },
    [getRelatedObjects.fulfilled]: (state, action) => {
      state.loading_listRelatedObject = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_relatedObject.map((item) => item.accountId || item.customerId));
          const filteredResult = result.filter(
            (resultItem) => !currentIds.has(resultItem.accountId || resultItem.customerId)
          );
          state.list_relatedObject = [
            ...state.list_relatedObject,
            ...filteredResult,
          ];
        } else {
          state.list_relatedObject = result;
        }
      }

      state.pagination_listRelatedObject = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 20,
      };
    },
    [getRelatedObjects.rejected]: (state, action) => {
      state.loading_listRelatedObject = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_relatedObject = [];
        state.pagination_listRelatedObject = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 20,
        };
      }
    },

    // Get Approval History
    [getRelationshipApprovalHistory.pending]: (state) => {
      state.loading_relationshipApprovalHistory = true;
    },
    [getRelationshipApprovalHistory.fulfilled]: (state, action) => {
      state.detail_relationshipApprovalHistory = action.payload;
      state.loading_relationshipApprovalHistory = false;
    },
    [getRelationshipApprovalHistory.rejected]: (state) => {
      state.loading_relationshipApprovalHistory = false;
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

    // Approve or Reject All Relationship (combined)
    [approveOrRejectAllRelationship.pending]: (state, action) => {
      if (action.meta.arg?.action === "APPROVE") state.loading_approveRelationship = true;
      else if (action.meta.arg?.action === "REJECT") state.loading_rejectRelationship = true;
    },
    [approveOrRejectAllRelationship.fulfilled]: (state, action) => {
      if (action.meta.arg?.action === "APPROVE") state.loading_approveRelationship = false;
      else if (action.meta.arg?.action === "REJECT") state.loading_rejectRelationship = false;
    },
    [approveOrRejectAllRelationship.rejected]: (state, action) => {
      if (action.meta.arg?.action === "APPROVE") state.loading_approveRelationship = false;
      else if (action.meta.arg?.action === "REJECT") state.loading_rejectRelationship = false;
    },
  },
});

export default relationshipSlice.reducer;
