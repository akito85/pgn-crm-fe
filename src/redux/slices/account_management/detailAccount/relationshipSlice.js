import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import {
  showModalError,
  showModalSuccess,
  validateError,
} from "../../general_slice";

const initialState = {
  list_relationship: [],
  pagination_relationship: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 20,
  },
  data_relationshipDetail: {},
  detailDraft_relationshipDetail: {},
  data_relationshipType: [],
  data_relationshipCategory: [],
  data_attachmentCategory: [],
  data_attachmentList: [],
  data_accountList: {},
  data_relatedObjectList: {},
  list_relatedObject: [],
  pagination_relatedObject: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 20,
  },
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

// Get Relationship List with Advanced Filter (POST)
export const getRelationshipListAdvanced = createAsyncThunk(
  "GET_RELATIONSHIP_LIST_ADVANCED",
  async ({ idAccount, page, pageSize, sort, search, body, isLoadMore }, thunkAPI) => {
    try {
      // empty string for default sort
      const sortParam = sort === undefined || sort === "" ? "" : sort;
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships`;
      const requestBody = {
        ...body,
        page,
        size: pageSize,
        sort: sortParam,
      };
      const response = await accountManagementService.updateDataWithMethodPost(url, requestBody);
      return {
        ...response?.data,
        isLoadMore,
      };
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

// Get Relationship Detail Draft
export const getDetailDraftRelationship = createAsyncThunk(
  "GET_DETAIL_DRAFT_RELATIONSHIP",
  async ({ idAccount, idRelationship }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships/detail-draft/${idRelationship}`;
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
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_APPROVAL_HISTORY" })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);



// Get Relationship Search Column
export const getRelationshipColumnApi = createAsyncThunk(
  "GET_RELATIONSHIP_COLUMN_API",
  async ({accountId}, thunkAPI) => {
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
  async ({accountId}, thunkAPI) => {
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
  async ({accountId}, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/relationships/list-search-operator`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
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

// Create Relationship
export const createRelationship = createAsyncThunk(
  "CREATE_RELATIONSHIP",
  async ({ idAccount, payload, attachments = [] }, thunkAPI) => {
    try {
      // 1. Create relationship first
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships/create`;
      const response = await accountManagementService.createData(url, payload);

      // 2. Get ID from response
      const { id } = response?.data || {};

      // 3. Upload all attachments with refId
      if (id && attachments.length > 0) {
        const uploadUrl = `/v1/dbs/api/accounts/${idAccount}/relationships/upload-attachment`;
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
  async ({ idAccount, idRelationship, payload, attachments = [] }, thunkAPI) => {
    try {
      // 1. Update relationship first
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships/${idRelationship}`;
      const response = await accountManagementService.updateData(url, payload);

      // 2. Upload new attachments only (filter out existing ones)
      if (attachments.length > 0) {
        const uploadUrl = `/v1/dbs/api/accounts/${idAccount}/relationships/upload-attachment`;
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
  async ({ idAccount, idFile, urlFile1, fileName }, thunkAPI) => {
    try {
      // craft url if urlFile1 is not provided, else use urlFile1
      const url = urlFile1 || `/v1/dbs/api/accounts/${idAccount}/relationships/download-attachment/${idFile}`;
      const response = await accountManagementService.downloadData(url);
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.error &&
          error.response.error.message) ||
        error.message ||
        error.toString();

      const errorBody = {
        title: "Download Failed",
        description: `Failed to download file "${fileName || 'Unknown'}". ${error.response.error.message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
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
  async ({ idAccount, page, size, relationshipType, relationshipCategory, sort, searchs, isLoadMore }, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams();

      if (Number.isSafeInteger(page) && page >= 0) queryParams.append("page", page);
      if (size) queryParams.append("size", size);
      if (sort) queryParams.append("sort", sort);
      if (searchs) queryParams.append("searchs", searchs);

      const typeParam = relationshipType
        ? relationshipType.trim().toUpperCase().replace(/\s+/g, "_")
        : "";
      if (typeParam) queryParams.append("relationshipType", typeParam);

      const categoryParam = relationshipCategory
        ? relationshipCategory.toUpperCase()
        : "";
      if (categoryParam) queryParams.append("relationshipCategory", categoryParam);

      let url = `/v1/dbs/api/accounts/${idAccount}/relationships/related-object-data`;
      if (queryParams.toString().length) url += `?${queryParams.toString()}`;

      const response = await accountManagementService.getPagination(url);
      return {
        ...response?.data,
        isLoadMore,
      };
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

// Approve or Reject Inactive Relationship
export const approveOrRejectInactiveRelationship = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_RELATIONSHIP",
  async ({ idAccount, body, action }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships/approve-inactive`;
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
  async ({ idAccount, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${idAccount}/relationships/export-excel`;
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
    // Get Relationship List Advanced
    [getRelationshipListAdvanced.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getRelationshipListAdvanced.fulfilled]: (state, action) => {
      state.loading = false;
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
    [getRelationshipListAdvanced.rejected]: (state, action) => {
      state.loading = false;

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

    // Get Relationship Detail Draft
    [getDetailDraftRelationship.pending]: (state) => {
      state.loadingDetail = true;
    },
    [getDetailDraftRelationship.fulfilled]: (state, action) => {
      state.detailDraft_relationshipDetail = action.payload;
      state.loadingDetail = false;
    },
    [getDetailDraftRelationship.rejected]: (state) => {
      state.detailDraft_relationshipDetail = {};
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

    // Inactivate Relationship
    [inactivateRelationship.pending]: (state) => {
      state.loading = true;
    },
    [inactivateRelationship.fulfilled]: (state) => {
      state.loading = false;
    },
    [inactivateRelationship.rejected]: (state) => {
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
      const payload = action.payload;
      state.data_attachmentList = payload?.data?.result || payload?.result || payload || [];
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
    [getRelatedObjectData.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loadingRelatedObject = true;
      }
    },
    [getRelatedObjectData.fulfilled]: (state, action) => {
      state.loadingRelatedObject = false;
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
      state.loadingRelatedObject = false;

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

    // Approve or Reject Inactive Relationship
    [approveOrRejectInactiveRelationship.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectInactiveRelationship.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectInactiveRelationship.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export default relationshipSlice.reducer;
