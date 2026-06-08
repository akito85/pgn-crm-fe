import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../services/account_management/accountManagementService";
import {
  showModalError,
  showModalSuccess,
  validateError,
} from "../general_slice";

const BASE = "/v1/dbs/api/relationships";
const HIER_BASE = "/v1/dbs/api/accounts/relationships";

const paginationDefault = { totalPages: 0, totalElements: 0, currentPage: 0, pageSize: 20 };

const initialState = {
  loading_listRelationship: false,
  list_relationship: [],
  pagination_listRelationship: { ...paginationDefault },

  loading_listRelationshipApproval: false,
  list_relationshipApproval: [],
  pagination_listRelationshipApproval: { ...paginationDefault },

  loading_detailRelationship: false,
  detail_relationship: {},
  loading_detailDraftRelationship: false,
  detailDraft_relationship: {},

  loading_createUpdateRelationship: false,
  loading_approveRejectRelationship: false,
  loading_approveRelationship: false,
  loading_rejectRelationship: false,
  loading_inactivateRelationship: false,

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

  loading_listRelatedObject: false,
  list_relatedObject: [],
  pagination_listRelatedObject: { ...paginationDefault },

  loading_relationshipApprovalHistory: false,
  detail_relationshipApprovalHistory: {},

  data_globalTypeCondition: [],
  data_globalTypeOperator: [],
  data_globalTypeColumn: [],

  loading_listSubjectAccounts: false,
  list_subjectAccounts: [],
  pagination_listSubjectAccounts: { ...paginationDefault },

  loading_listSubjectCustomers: false,
  list_subjectCustomers: [],
  pagination_listSubjectCustomers: { ...paginationDefault },
};

// ─── THUNKS ───────────────────────────────────────────────────────────────────

export const getStandaloneRelationships = createAsyncThunk(
  "STANDALONE/GET_RELATIONSHIPS",
  async ({ page, pageSize, sort, body, isLoadMore }, thunkAPI) => {
    try {
      const requestBody = { ...body, page, size: pageSize, sort: sort || "", listType: "all" };
      const response = await accountManagementService.updateDataWithMethodPost(BASE, requestBody);
      return { ...response?.data, isLoadMore };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getStandaloneRelationshipApprovals = createAsyncThunk(
  "STANDALONE/GET_RELATIONSHIP_APPROVALS",
  async ({ page, pageSize, sort, body, isLoadMore }, thunkAPI) => {
    try {
      const requestBody = { ...body, page, size: pageSize, sort: sort || "", listType: "approval" };
      const response = await accountManagementService.updateDataWithMethodPost(BASE, requestBody);
      return { ...response?.data, isLoadMore };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getStandaloneRelationship = createAsyncThunk(
  "STANDALONE/GET_RELATIONSHIP",
  async ({ id, subjectAccountId }, thunkAPI) => {
    try {
      const response = await accountManagementService.getDetail(
        `${BASE}/${id}?subjectAccountId=${subjectAccountId}`
      );
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getStandaloneRelationshipDraft = createAsyncThunk(
  "STANDALONE/GET_RELATIONSHIP_DRAFT",
  async ({ id, subjectAccountId }, thunkAPI) => {
    try {
      const response = await accountManagementService.getDetail(
        `${BASE}/detail-draft/${id}?subjectAccountId=${subjectAccountId}`
      );
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getStandaloneRelationshipTypes = createAsyncThunk(
  "STANDALONE/GET_RELATIONSHIP_TYPES",
  async (_, thunkAPI) => {
    try {
      const response = await accountManagementService.getAll(`${BASE}/relationship-type`);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getStandaloneRelationshipCategories = createAsyncThunk(
  "STANDALONE/GET_RELATIONSHIP_CATEGORIES",
  async (_, thunkAPI) => {
    try {
      const response = await accountManagementService.getAll(`${BASE}/relationship-category`);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getStandaloneRelationshipApprovalHierarchies = createAsyncThunk(
  "STANDALONE/GET_APPROVAL_HIERARCHIES",
  async (_, thunkAPI) => {
    try {
      const response = await accountManagementService.getAll(`${HIER_BASE}/approval-hierarchies`);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getStandaloneRelationshipApprovalHierarchy = createAsyncThunk(
  "STANDALONE/GET_APPROVAL_HIERARCHY",
  async (appHierId, thunkAPI) => {
    try {
      const response = await accountManagementService.getAll(`${HIER_BASE}/approval-hierarchy/${appHierId}`);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getStandaloneRelationshipAttachmentCategories = createAsyncThunk(
  "STANDALONE/GET_ATTACHMENT_CATEGORIES",
  async (_, thunkAPI) => {
    try {
      const response = await accountManagementService.getAll(`${HIER_BASE}/attachment-category`);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getStandaloneRelatedObjects = createAsyncThunk(
  "STANDALONE/GET_RELATED_OBJECTS",
  async ({ subjectAccountId, relationshipType, relationshipCategory, body, isLoadMore }, thunkAPI) => {
    try {
      const url = `${BASE}/related-object-data?subjectAccountId=${subjectAccountId}&relationshipType=${relationshipType}&relationshipCategory=${relationshipCategory}`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body);
      return { ...response?.data, isLoadMore };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getSubjectAccounts = createAsyncThunk(
  "STANDALONE/GET_SUBJECT_ACCOUNTS",
  async ({ body, isLoadMore }, thunkAPI) => {
    try {
      const response = await accountManagementService.updateDataWithMethodPost(`${BASE}/subject-accounts`, body);
      return { ...response?.data, isLoadMore };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getSubjectCustomers = createAsyncThunk(
  "STANDALONE/GET_SUBJECT_CUSTOMERS",
  async ({ body, isLoadMore }, thunkAPI) => {
    try {
      const response = await accountManagementService.updateDataWithMethodPost(`${BASE}/subject-customers`, body);
      return { ...response?.data, isLoadMore };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getStandaloneRelationshipApprovalHistory = createAsyncThunk(
  "STANDALONE/GET_APPROVAL_HISTORY",
  async ({ relationshipId }, thunkAPI) => {
    try {
      const response = await accountManagementService.getAll(`${BASE}/approval-history/${relationshipId}`);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const inactivateStandaloneRelationship = createAsyncThunk(
  "STANDALONE/INACTIVATE_RELATIONSHIP",
  async ({ body, onSuccess }, thunkAPI) => {
    try {
      const response = await accountManagementService.activationWithRemark(`${BASE}/inactive`, body);
      thunkAPI.dispatch(showModalSuccess({ title: "Success", description: "Relationship inactivated successfully." }));
      if (onSuccess) onSuccess();
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(showModalError({ title: "Error", description: error?.message || "Failed to inactivate." }));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createStandaloneRelationship = createAsyncThunk(
  "STANDALONE/CREATE_RELATIONSHIP",
  async ({ payload, getUploadUrl, newAttachments, onSuccess }, thunkAPI) => {
    try {
      const response = await accountManagementService.createData(`${BASE}/create`, payload);
      const refId = response?.data?.result?.id;
      if (newAttachments?.length > 0 && refId && getUploadUrl) {
        for (const att of newAttachments) {
          await accountManagementService.uploadAttachment(getUploadUrl(refId), {
            files: att.files,
            category: att.category,
            refId,
          });
        }
      }
      thunkAPI.dispatch(showModalSuccess({ title: "Success", description: "Relationship created successfully." }));
      if (onSuccess) onSuccess();
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(showModalError({ title: "Error", description: error?.message || "Failed to create." }));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateStandaloneRelationship = createAsyncThunk(
  "STANDALONE/UPDATE_RELATIONSHIP",
  async ({ id, payload, getUploadUrl, newAttachments, onSuccess }, thunkAPI) => {
    try {
      const response = await accountManagementService.updateData(`${BASE}/${id}`, payload);
      if (newAttachments?.length > 0 && getUploadUrl) {
        for (const att of newAttachments) {
          await accountManagementService.uploadAttachment(getUploadUrl(id), {
            files: att.files,
            category: att.category,
            refId: id,
          });
        }
      }
      thunkAPI.dispatch(showModalSuccess({ title: "Success", description: "Relationship updated successfully." }));
      if (onSuccess) onSuccess();
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(showModalError({ title: "Error", description: error?.message || "Failed to update." }));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const approveOrRejectStandaloneRelationship = createAsyncThunk(
  "STANDALONE/APPROVE_RELATIONSHIP",
  async ({ body, onSuccess }, thunkAPI) => {
    try {
      const response = await accountManagementService.activationWithRemark(`${BASE}/approve`, body);
      thunkAPI.dispatch(showModalSuccess({ title: "Success", description: "Action completed." }));
      if (onSuccess) onSuccess();
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(showModalError({ title: "Error", description: error?.message || "Action failed." }));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const approveOrRejectInactiveStandaloneRelationship = createAsyncThunk(
  "STANDALONE/APPROVE_INACTIVE_RELATIONSHIP",
  async ({ body, onSuccess }, thunkAPI) => {
    try {
      const response = await accountManagementService.activationWithRemark(`${BASE}/approve-inactive`, body);
      thunkAPI.dispatch(showModalSuccess({ title: "Success", description: "Action completed." }));
      if (onSuccess) onSuccess();
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(showModalError({ title: "Error", description: error?.message || "Action failed." }));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const approveOrRejectAllStandaloneRelationship = createAsyncThunk(
  "STANDALONE/APPROVE_ALL",
  async ({ body, inactiveBody, onSuccess }, thunkAPI) => {
    try {
      const calls = [];
      if (body?.length) calls.push(accountManagementService.activationWithRemark(`${BASE}/approve`, body));
      if (inactiveBody?.length) calls.push(accountManagementService.activationWithRemark(`${BASE}/approve-inactive`, inactiveBody));
      await Promise.all(calls);
      thunkAPI.dispatch(showModalSuccess({ title: "Success", description: "All actions completed." }));
      if (onSuccess) onSuccess();
    } catch (error) {
      thunkAPI.dispatch(showModalError({ title: "Error", description: error?.message || "Action failed." }));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const downloadStandaloneRelationship = createAsyncThunk(
  "STANDALONE/DOWNLOAD",
  async ({ body }, thunkAPI) => {
    try {
      await accountManagementService.downloadDataAdvanced(`${BASE}/export-excel`, body);
    } catch (error) {
      thunkAPI.dispatch(showModalError({ title: "Error", description: "Export failed." }));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const validateStandaloneStep = createAsyncThunk(
  "STANDALONE/VALIDATE_STEP",
  async ({ body }, thunkAPI) => {
    try {
      const response = await accountManagementService.createData(`${BASE}/validate-step`, body);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(validateError(error));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// ─── REDUCER HELPERS ──────────────────────────────────────────────────────────

const makeListReducers = (thunk, listKey, paginationKey, loadingKey, idKey = "id") => ({
  [thunk.pending]: (state, action) => {
    if (!action.meta.arg?.isLoadMore) state[loadingKey] = true;
  },
  [thunk.fulfilled]: (state, action) => {
    state[loadingKey] = false;
    const { result, page, isLoadMore } = action.payload;
    if (Array.isArray(result)) {
      if (isLoadMore) {
        const seen = new Set(state[listKey].map((item) => item[idKey]));
        state[listKey] = [...state[listKey], ...result.filter((r) => !seen.has(r[idKey]))];
      } else {
        state[listKey] = result;
      }
    }
    if (page) {
      state[paginationKey] = {
        totalPages: page.totalPages || 0,
        totalElements: page.totalElements || 0,
        currentPage: page.number || 0,
        pageSize: page.size || 20,
      };
    }
  },
  [thunk.rejected]: (state, action) => {
    state[loadingKey] = false;
    if (!action.meta.arg?.isLoadMore) {
      state[listKey] = [];
      state[paginationKey] = { ...paginationDefault };
    }
  },
});

// ─── SLICE ────────────────────────────────────────────────────────────────────

const standaloneRelationshipSlice = createSlice({
  name: "standaloneRelationship",
  initialState,
  extraReducers: {
    ...makeListReducers(getStandaloneRelationships, "list_relationship", "pagination_listRelationship", "loading_listRelationship"),
    ...makeListReducers(getStandaloneRelationshipApprovals, "list_relationshipApproval", "pagination_listRelationshipApproval", "loading_listRelationshipApproval"),
    ...makeListReducers(getStandaloneRelatedObjects, "list_relatedObject", "pagination_listRelatedObject", "loading_listRelatedObject", "accountId"),
    ...makeListReducers(getSubjectAccounts, "list_subjectAccounts", "pagination_listSubjectAccounts", "loading_listSubjectAccounts"),
    ...makeListReducers(getSubjectCustomers, "list_subjectCustomers", "pagination_listSubjectCustomers", "loading_listSubjectCustomers"),

    [getStandaloneRelationship.pending]: (state) => { state.loading_detailRelationship = true; },
    [getStandaloneRelationship.fulfilled]: (state, action) => { state.detail_relationship = action.payload?.result || {}; state.loading_detailRelationship = false; },
    [getStandaloneRelationship.rejected]: (state) => { state.loading_detailRelationship = false; },

    [getStandaloneRelationshipDraft.pending]: (state) => { state.loading_detailDraftRelationship = true; },
    [getStandaloneRelationshipDraft.fulfilled]: (state, action) => { state.detailDraft_relationship = action.payload?.result || {}; state.loading_detailDraftRelationship = false; },
    [getStandaloneRelationshipDraft.rejected]: (state) => { state.detailDraft_relationship = {}; state.loading_detailDraftRelationship = false; },

    [getStandaloneRelationshipTypes.pending]: (state) => { state.loading_listRelationshipType = true; },
    [getStandaloneRelationshipTypes.fulfilled]: (state, action) => { state.list_relationshipType = action.payload; state.loading_listRelationshipType = false; },
    [getStandaloneRelationshipTypes.rejected]: (state) => { state.loading_listRelationshipType = false; },

    [getStandaloneRelationshipCategories.pending]: (state) => { state.loading_listRelationshipCategory = true; },
    [getStandaloneRelationshipCategories.fulfilled]: (state, action) => { state.list_relationshipCategory = action.payload; state.loading_listRelationshipCategory = false; },
    [getStandaloneRelationshipCategories.rejected]: (state) => { state.loading_listRelationshipCategory = false; },

    [getStandaloneRelationshipApprovalHierarchies.pending]: (state) => { state.loading_listRelationshipApprovalHierarchy = true; },
    [getStandaloneRelationshipApprovalHierarchies.fulfilled]: (state, action) => { state.list_relationshipApprovalHierarchy = action.payload; state.loading_listRelationshipApprovalHierarchy = false; },
    [getStandaloneRelationshipApprovalHierarchies.rejected]: (state) => { state.loading_listRelationshipApprovalHierarchy = false; },

    [getStandaloneRelationshipApprovalHierarchy.pending]: (state) => { state.detail_relationshipApprovalHierarchy = []; state.loading_detailRelationshipApprovalHierarchy = true; },
    [getStandaloneRelationshipApprovalHierarchy.fulfilled]: (state, action) => { state.detail_relationshipApprovalHierarchy = action.payload; state.loading_detailRelationshipApprovalHierarchy = false; },
    [getStandaloneRelationshipApprovalHierarchy.rejected]: (state) => { state.loading_detailRelationshipApprovalHierarchy = false; },

    [getStandaloneRelationshipAttachmentCategories.pending]: (state) => { state.loading_listRelationshipAttachmentCategory = true; },
    [getStandaloneRelationshipAttachmentCategories.fulfilled]: (state, action) => { state.list_relationshipAttachmentCategory = action.payload; state.loading_listRelationshipAttachmentCategory = false; },
    [getStandaloneRelationshipAttachmentCategories.rejected]: (state) => { state.loading_listRelationshipAttachmentCategory = false; },

    [inactivateStandaloneRelationship.pending]: (state) => { state.loading_inactivateRelationship = true; },
    [inactivateStandaloneRelationship.fulfilled]: (state) => { state.loading_inactivateRelationship = false; },
    [inactivateStandaloneRelationship.rejected]: (state) => { state.loading_inactivateRelationship = false; },

    [createStandaloneRelationship.pending]: (state) => { state.loading_createUpdateRelationship = true; },
    [createStandaloneRelationship.fulfilled]: (state) => { state.loading_createUpdateRelationship = false; },
    [createStandaloneRelationship.rejected]: (state) => { state.loading_createUpdateRelationship = false; },

    [updateStandaloneRelationship.pending]: (state) => { state.loading_createUpdateRelationship = true; },
    [updateStandaloneRelationship.fulfilled]: (state) => { state.loading_createUpdateRelationship = false; },
    [updateStandaloneRelationship.rejected]: (state) => { state.loading_createUpdateRelationship = false; },

    [approveOrRejectStandaloneRelationship.pending]: (state) => { state.loading_approveRelationship = true; },
    [approveOrRejectStandaloneRelationship.fulfilled]: (state) => { state.loading_approveRelationship = false; },
    [approveOrRejectStandaloneRelationship.rejected]: (state) => { state.loading_approveRelationship = false; },

    [approveOrRejectInactiveStandaloneRelationship.pending]: (state) => { state.loading_rejectRelationship = true; },
    [approveOrRejectInactiveStandaloneRelationship.fulfilled]: (state) => { state.loading_rejectRelationship = false; },
    [approveOrRejectInactiveStandaloneRelationship.rejected]: (state) => { state.loading_rejectRelationship = false; },

    [approveOrRejectAllStandaloneRelationship.pending]: (state) => { state.loading_approveRelationship = true; },
    [approveOrRejectAllStandaloneRelationship.fulfilled]: (state) => { state.loading_approveRelationship = false; },
    [approveOrRejectAllStandaloneRelationship.rejected]: (state) => { state.loading_approveRelationship = false; },

    [getStandaloneRelationshipApprovalHistory.pending]: (state) => { state.loading_relationshipApprovalHistory = true; },
    [getStandaloneRelationshipApprovalHistory.fulfilled]: (state, action) => { state.detail_relationshipApprovalHistory = action.payload?.result || {}; state.loading_relationshipApprovalHistory = false; },
    [getStandaloneRelationshipApprovalHistory.rejected]: (state) => { state.loading_relationshipApprovalHistory = false; },
  },
});

export default standaloneRelationshipSlice.reducer;
