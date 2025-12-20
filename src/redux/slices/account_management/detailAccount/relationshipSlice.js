import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import {
  showModalError,
  showModalSuccess,
  validateError,
} from "../../general_slice";

const initialState = {
  data_relationship: {},
  data_relationshipDetail: {},
  data_relationshipType: [],
  data_relationshipCategory: [],
  data_attachmentCategory: [],
  data_attachmentList: [],
  data_accountList: {},
  data_relatedObjectList: {},
  data_globalTypeCondition: [],
  data_globalTypeOperator: [],
  data_globalTypeColumn: [],
  data_approvalHierarchies: [],
  data_approvalHierarchyDetail: [],
  data_approvalHistory: {},
  loading: false,
  loadingDetail: false,
  loadingType: false,
  loadingCategory: false,
  loadingApprovalHierarchies: false,
  loadingApprovalHierarchyDetail: false,
  loadingRelatedObject: false,
  loadingApprovalHistory: false,
};

// Get Relationship List
export const getRelationshipList = createAsyncThunk(
  "GET_RELATIONSHIP_LIST",
  async ({ idAccount, page, pageSize, sort, search }, thunkAPI) => {
    try {
      const searchParam = search ? `&searchs=${search}` : "";
      const sortParam = sort ? `&sort=${sort}` : "";
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships?page=${page - 1}&size=${pageSize}${sortParam}${searchParam}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_RELATIONSHIP_LIST" })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Relationship List with Advanced Filter (POST)
export const getRelationshipListAdvanced = createAsyncThunk(
  "GET_RELATIONSHIP_LIST_ADVANCED",
  async ({ idAccount, page, pageSize, sort, search, body }, thunkAPI) => {
    try {
      const sortParam = sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const searchParam = search ? `&searchs=${search}` : "";
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_RELATIONSHIP_LIST_ADVANCED" })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Relationship Detail
export const getRelationshipDetail = createAsyncThunk(
  "GET_RELATIONSHIP_DETAIL",
  async ({ idAccount, idRelationship }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships/${idRelationship}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_RELATIONSHIP_DETAIL" })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Relationship Type Options
export const getRelationshipType = createAsyncThunk(
  "GET_RELATIONSHIP_TYPE",
  async ({ idAccount }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships/relationship-type`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_RELATIONSHIP_TYPE" })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Relationship Category Options
export const getRelationshipCategory = createAsyncThunk(
  "GET_RELATIONSHIP_CATEGORY",
  async ({ idAccount }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships/relationship-category`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_RELATIONSHIP_CATEGORY" })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Approval Hierarchies
export const getApprovalHierarchies = createAsyncThunk(
  "GET_APPROVAL_HIERARCHIES",
  async ({ idAccount }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships/approval-hierarchies`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_APPROVAL_HIERARCHIES" })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Approval Hierarchy Detail
export const getApprovalHierarchyDetail = createAsyncThunk(
  "GET_APPROVAL_HIERARCHY_DETAIL",
  async ({ idAccount, appHierId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships/approval-hierarchy/${appHierId}`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_APPROVAL_HIERARCHY_DETAIL" })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Approval History
export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY",
  async ({ idAccount, relationshipId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships/approval-history/${relationshipId}`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_APPROVAL_HISTORY" })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);



// Get Global Search Column
export const getGlobalSearchColumn = createAsyncThunk(
  "GET_GLOBAL_SEARCH_COLUMN_RELATIONSHIP",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/system-parameter/global-filter-column/RELATIONSHIP`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_GLOBAL_SEARCH_COLUMN_RELATIONSHIP",
        })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Global Search Operator
export const getGlobalSearchOperator = createAsyncThunk(
  "GET_GLOBAL_SEARCH_OPERATOR_RELATIONSHIP",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/system-parameter/global-filter-operator`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_GLOBAL_SEARCH_OPERATOR_RELATIONSHIP",
        })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Global Search Condition
export const getGlobalSearchCondition = createAsyncThunk(
  "GET_GLOBAL_SEARCH_CONDITION_RELATIONSHIP",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/system-parameter/global-filter-condition`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_GLOBAL_SEARCH_CONDITION_RELATIONSHIP",
        })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Activate/Inactivate Relationship
export const activateRelationship = createAsyncThunk(
  "ACTIVATE_RELATIONSHIP",
  async ({ idAccount, idRelationship, status }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships/${idRelationship}/${status}`;
      const response = await accountManagementService.updateData(url, {});
      const successMessage = {
        title: "Successful",
        description: `Relationship has been ${status === "activate" ? "activated" : "inactivated"}.`,
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
        description: `Failed to ${status === "activate" ? "activate" : "inactivate"} relationship: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Toggle Relationship Status (Active/Inactive)
export const toggleRelationshipStatus = createAsyncThunk(
  "TOGGLE_RELATIONSHIP_STATUS",
  async ({ relationshipId, remarks }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/relationships/active-inactive`;
      const payload = {
        relationshipId,
        remarks,
      };
      const response = await accountManagementService.updateData(url, payload);
      const successMessage = {
        title: "Successful",
        description: "Relationship status has been updated successfully.",
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
        description: `Failed to update relationship status: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Create Relationship
export const createRelationship = createAsyncThunk(
  "CREATE_RELATIONSHIP",
  async ({ idAccount, payload }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships/create`;
      const response = await accountManagementService.createData(url, payload);
      const successMessage = {
        title: "Successful",
        description: "Relationship has been created successfully.",
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
        description: `Failed to create relationship: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Update Relationship
export const updateRelationship = createAsyncThunk(
  "UPDATE_RELATIONSHIP",
  async ({ idAccount, idRelationship, payload }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships/${idRelationship}`;
      const response = await accountManagementService.updateData(url, payload);
      const successMessage = {
        title: "Successful",
        description: "Relationship has been updated successfully.",
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
        description: `Failed to update relationship: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Attachment Category
export const getAttachmentCategory = createAsyncThunk(
  "GET_ATTACHMENT_CATEGORY",
  async ({ idAccount }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships/attachment-category`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_ATTACHMENT_CATEGORY" })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Upload Attachment
export const uploadAttachment = createAsyncThunk(
  "UPLOAD_ATTACHMENT",
  async ({ idAccount, payload }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships/upload-attachment`;
      const response = await accountManagementService.uploadAttachment(
        url,
        payload
      );
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
        description: `Failed to upload attachment: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Attachment List
export const getAttachmentList = createAsyncThunk(
  "GET_ATTACHMENT_LIST",
  async ({ idAccount, idRelationship }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships/list-attachment/${idRelationship}`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_ATTACHMENT_LIST" })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Download Attachment
export const downloadAttachment = createAsyncThunk(
  "DOWNLOAD_ATTACHMENT",
  async ({ idAccount, idFile }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships/download-attachment/${idFile}`;
      const response = await accountManagementService.downloadData(url);
      return response;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "DOWNLOAD_ATTACHMENT" })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get All Accounts
export const getAllAccounts = createAsyncThunk(
  "GET_ALL_ACCOUNTS",
  async ({ page, size, search }, thunkAPI) => {
    try {
      // url example: /v1/dbs/api/account/list?page=1&size=1
      // Note: Assuming page coming from UI is 1-based. If API is 0-based, we might need page-1.
      // However, user specifically asked for page=1 in the URL.
      // I'll stick to passing 'page' directly for now, or check if I should do page-1.
      // Most of the other thunks in this file do page-1.
      // "page=${page - 1}"
      // I will assume consistency with other thunks and use page - 1 if the input `page` is 1-based from AntD.

      const searchParam = search ? `&searchs=${search}` : "";
      const url = `/v1/dbs/api/account/list?page=${page}&size=${size}${searchParam}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_ALL_ACCOUNTS" })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Related Object Data (Customer or Account based on relationship type)
export const getRelatedObjectData = createAsyncThunk(
  "GET_RELATED_OBJECT_DATA",
  async ({ idAccount, page, size, relationshipType, relationshipCategory }, thunkAPI) => {
    try {
      const pageParam = page ? page - 1 : 0; // Convert to 0-based
      const sizeParam = size || 10;
      const typeParam = relationshipType
        ? `&relationshipType=${relationshipType
          .trim()
          .toUpperCase()
          .replace(/\s+/g, "_")}`
        : "";
      const categoryParam = relationshipCategory ? `&relationshipCategory=${relationshipCategory?.toUpperCase()}` : "";

      const url = `/v1/dbs/api/accounts/${idAccount}/relationships/related-object-data?page=${pageParam}&size=${sizeParam}${typeParam}${categoryParam}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_RELATED_OBJECT_DATA" })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Approve or Reject Relationship
export const approveOrRejectRelationship = createAsyncThunk(
  "APPROVE_OR_REJECT_RELATIONSHIP",
  async ({ idAccount, body, action }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships/approve`;
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

const relationshipSlice = createSlice({
  name: "relationship",
  initialState,
  extraReducers: {
    // Get Relationship List
    [getRelationshipList.pending]: (state) => {
      state.loading = true;
    },
    [getRelationshipList.fulfilled]: (state, action) => {
      state.data_relationship = action.payload;
      state.loading = false;
    },
    [getRelationshipList.rejected]: (state) => {
      state.loading = false;
    },

    // Get Relationship List Advanced
    [getRelationshipListAdvanced.pending]: (state) => {
      state.loading = true;
    },
    [getRelationshipListAdvanced.fulfilled]: (state, action) => {
      state.data_relationship = action.payload;
      state.loading = false;
    },
    [getRelationshipListAdvanced.rejected]: (state) => {
      state.loading = false;
    },

    // Get Relationship Detail
    [getRelationshipDetail.pending]: (state) => {
      state.loadingDetail = true;
    },
    [getRelationshipDetail.fulfilled]: (state, action) => {
      state.data_relationshipDetail = action.payload;
      state.loadingDetail = false;
    },
    [getRelationshipDetail.rejected]: (state) => {
      state.loadingDetail = false;
    },

    // Get Relationship Type
    [getRelationshipType.pending]: (state) => {
      state.loadingType = true;
    },
    [getRelationshipType.fulfilled]: (state, action) => {
      state.data_relationshipType = action.payload;
      state.loadingType = false;
    },
    [getRelationshipType.rejected]: (state) => {
      state.loadingType = false;
    },

    // Get Relationship Category
    [getRelationshipCategory.pending]: (state) => {
      state.loadingCategory = true;
    },
    [getRelationshipCategory.fulfilled]: (state, action) => {
      state.data_relationshipCategory = action.payload;
      state.loadingCategory = false;
    },
    [getRelationshipCategory.rejected]: (state) => {
      state.loadingCategory = false;
    },

    // Get Approval Hierarchies
    [getApprovalHierarchies.pending]: (state) => {
      state.loadingApprovalHierarchies = true;
    },
    [getApprovalHierarchies.fulfilled]: (state, action) => {
      state.data_approvalHierarchies = action.payload;
      state.loadingApprovalHierarchies = false;
    },
    [getApprovalHierarchies.rejected]: (state) => {
      state.loadingApprovalHierarchies = false;
    },

    // Get Approval Hierarchy Detail
    [getApprovalHierarchyDetail.pending]: (state) => {
      state.loadingApprovalHierarchyDetail = true;
    },
    [getApprovalHierarchyDetail.fulfilled]: (state, action) => {
      state.data_approvalHierarchyDetail = action.payload;
      state.loadingApprovalHierarchyDetail = false;
    },
    [getApprovalHierarchyDetail.rejected]: (state) => {
      state.loadingApprovalHierarchyDetail = false;
    },

    // Get Global Search Column
    [getGlobalSearchColumn.pending]: (state) => {
      state.loading = true;
    },
    [getGlobalSearchColumn.fulfilled]: (state, action) => {
      state.data_globalTypeColumn = action.payload;
      state.loading = false;
    },
    [getGlobalSearchColumn.rejected]: (state) => {
      state.loading = false;
    },

    // Get Global Search Operator
    [getGlobalSearchOperator.pending]: (state) => {
      state.loading = true;
    },
    [getGlobalSearchOperator.fulfilled]: (state, action) => {
      state.data_globalTypeOperator = action.payload;
      state.loading = false;
    },
    [getGlobalSearchOperator.rejected]: (state) => {
      state.loading = false;
    },

    // Get Global Search Condition
    [getGlobalSearchCondition.pending]: (state) => {
      state.loading = true;
    },
    [getGlobalSearchCondition.fulfilled]: (state, action) => {
      state.data_globalTypeCondition = action.payload;
      state.loading = false;
    },
    [getGlobalSearchCondition.rejected]: (state) => {
      state.loading = false;
    },

    // Activate Relationship
    [activateRelationship.pending]: (state) => {
      state.loading = true;
    },
    [activateRelationship.fulfilled]: (state) => {
      state.loading = false;
    },
    [activateRelationship.rejected]: (state) => {
      state.loading = false;
    },

    // Toggle Relationship Status
    [toggleRelationshipStatus.pending]: (state) => {
      state.loading = true;
    },
    [toggleRelationshipStatus.fulfilled]: (state) => {
      state.loading = false;
    },
    [toggleRelationshipStatus.rejected]: (state) => {
      state.loading = false;
    },

    // Create Relationship
    [createRelationship.pending]: (state) => {
      state.loading = true;
    },
    [createRelationship.fulfilled]: (state) => {
      state.loading = false;
    },
    [createRelationship.rejected]: (state) => {
      state.loading = false;
    },

    // Update Relationship
    [updateRelationship.pending]: (state) => {
      state.loading = true;
    },
    [updateRelationship.fulfilled]: (state) => {
      state.loading = false;
    },
    [updateRelationship.rejected]: (state) => {
      state.loading = false;
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

    // Upload Attachment
    [uploadAttachment.pending]: (state) => {
      state.loading = true;
    },
    [uploadAttachment.fulfilled]: (state) => {
      state.loading = false;
    },
    [uploadAttachment.rejected]: (state) => {
      state.loading = false;
    },

    // Get Attachment List
    [getAttachmentList.pending]: (state) => {
      state.loading = true;
    },
    [getAttachmentList.fulfilled]: (state, action) => {
      state.data_attachmentList = action.payload?.data?.result || [];
      state.loading = false;
    },
    [getAttachmentList.rejected]: (state) => {
      state.loading = false;
    },

    // Get All Accounts (Choose Related)
    [getAllAccounts.pending]: (state) => {
      state.loading = true;
    },
    [getAllAccounts.fulfilled]: (state, action) => {
      state.data_accountList = action.payload;
      state.loading = false;
    },
    [getAllAccounts.rejected]: (state) => {
      state.loading = false;
    },

    // Get Related Object Data
    [getRelatedObjectData.pending]: (state) => {
      state.loadingRelatedObject = true;
    },
    [getRelatedObjectData.fulfilled]: (state, action) => {
      state.data_relatedObjectList = action.payload;
      state.loadingRelatedObject = false;
    },
    [getRelatedObjectData.rejected]: (state) => {
      state.loadingRelatedObject = false;
    },

    // Download Attachment
    [downloadAttachment.pending]: (state) => {
      state.loading = true;
    },
    [downloadAttachment.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadAttachment.rejected]: (state) => {
      state.loading = false;
    },

    // Get Approval History
    [getApprovalHistory.pending]: (state) => {
      state.loadingApprovalHistory = true;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.data_approvalHistory = action.payload;
      state.loadingApprovalHistory = false;
    },
    [getApprovalHistory.rejected]: (state) => {
      state.loadingApprovalHistory = false;
    },

    // Approve or Reject Relationship
    [approveOrRejectRelationship.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectRelationship.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectRelationship.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export default relationshipSlice.reducer;
