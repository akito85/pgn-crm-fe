import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showModalError, showModalSuccess } from "../../general_slice";
import accountManagementService from "../../../services/account_management/accountManagementService";

const initialState = {
  // Standalone list
  list_workOrders: [],
  pagination_listWo: { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 },
  loading_listWo: false,

  // Approval
  list_woApprovals: [],
  pagination_listWoApprovals: { totalPage: 0, totalElement: 0 },
  loading_listWoApprovals: false,
  loading_approveWo: false,
  loading_rejectWo: false,

  // Detail / CRUD
  detail_workOrder: null,
  loading_detailWo: false,
  loading_createUpdateWo: false,
  loading_statusUpdateWo: false,

  // Activities
  list_woActivities: [],
  pagination_woActivities: { totalPage: 0, totalElement: 0 },
  loading_listWoActivities: false,

  // Data Requirements
  list_woDataRequirements: [],
  pagination_woDataRequirements: { totalPage: 0, totalElement: 0 },
  loading_listWoDataRequirements: false,
  list_woDataRequirementTypes: [],
  detail_woDataRequirementValues: {},

  // Closed WO list (for WO Reference modal)
  list_closedWorkOrders: [],
  pagination_closedWo: { totalPage: 0, totalElement: 0 },
  loading_closedWo: false,

  // Attachments (detail view)
  list_woAttachments: [],
  loading_listWoAttachments: false,

  // Progress history
  list_woProgress: [],
  loading_woProgress: false,

  // Dropdowns
  list_woCategories: [],
  list_woTypes: [],
  list_woPriorities: [],
  list_woGroups: [],
  list_woPicPositions: [],
  list_woPicUsers: {},
  list_woActivityStatuses: [],
  list_woApprovalHierarchy: [],
  detail_woApprovalHierarchy: [],
  loading_dropdowns: false,
};

// Helper: extract list + pagination from BE response
// BE returns: { data: [...], totalElements, totalPage, page, size }
// Fallback for legacy: { result: [...], page: { totalPages, totalElements, number, size } }
const extractListData = (payload) => {
  const items = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.result)
    ? payload.result
    : [];
  const totalPage = payload?.totalPage ?? payload?.page?.totalPages ?? 0;
  const totalElement = payload?.totalElements ?? payload?.page?.totalElements ?? 0;
  const currentPage = payload?.page ?? payload?.page?.number ?? 0;
  const pageSize = payload?.size ?? payload?.page?.size ?? 10;
  return { items, totalPage, totalElement, currentPage, pageSize };
};

// ─── MAIN CRUD ───────────────────────────────────────────────────────────────

export const getWorkOrders = createAsyncThunk(
  "GET_WORK_ORDERS",
  async ({ accountId, body, isLoadMore }, thunkAPI) => {
    try {
      const url = accountId
        ? `/v1/dbs/api/accounts/${accountId}/workorders/list`
        : `/v1/dbs/api/workorders/list`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body);
      return { ...response.data, isLoadMore };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getWorkOrder = createAsyncThunk(
  "GET_WORK_ORDER",
  async ({ woId, accountId }, thunkAPI) => {
    try {
      const response = await accountManagementService.getDetail(
        `/v1/dbs/api/accounts/${accountId}/workorders/${woId}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const createWorkOrder = createAsyncThunk(
  "CREATE_WORK_ORDER",
  async ({ accountId, body, attachments = [], action = "SUBMIT", successBodyExtra = {} }, thunkAPI) => {
    try {
      const response = await accountManagementService.createData(
        `/v1/dbs/api/accounts/${accountId}/workorders/create`,
        body
      );
      const { id } = response.data;
      const uploadUrl = "/v1/dbs/api/workorders/upload-attachment";
      await Promise.all(
        attachments.map((att) =>
          accountManagementService.uploadAttachment(uploadUrl, {
            files: att.file,
            refId: id,
            action,
          })
        )
      );
      const isDraft = body?.action === "DRAFT";
      const successBody = {
        title: "Successful",
        description: isDraft
          ? "Work Order draft has been saved."
          : "Work Order has been submitted.",
        ...successBodyExtra,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const isDraft = body?.action === "DRAFT";
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      thunkAPI.dispatch(
        showModalError({
          title: "Failed",
          description: isDraft
            ? `Work Order draft was not saved. ${message}. Please try again.`
            : `Work Order was not submitted. ${message}. Please try again.`,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const updateWorkOrder = createAsyncThunk(
  "UPDATE_WORK_ORDER",
  async ({ accountId, woId, body, attachments = [], action = "SUBMIT", successBodyExtra = {} }, thunkAPI) => {
    try {
      const response = await accountManagementService.updateData(
        `/v1/dbs/api/accounts/${accountId}/workorders/${woId}`,
        body
      );
      const uploadUrl = "/v1/dbs/api/workorders/upload-attachment";
      await Promise.all(
        attachments.map((att) =>
          accountManagementService.uploadAttachment(uploadUrl, {
            files: att.file,
            refId: woId,
            action,
          })
        )
      );
      const isDraft = body?.action === "DRAFT";
      const successBody = {
        title: "Successful",
        description: isDraft
          ? "Work Order draft has been saved."
          : "Work Order has been updated.",
        ...successBodyExtra,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      thunkAPI.dispatch(
        showModalError({
          title: "Failed",
          description: `Work Order was not updated. ${message}. Please try again.`,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// PATCH — body: { toStatus, remark, cancelApphierId }
export const updateWoStatus = createAsyncThunk(
  "UPDATE_WO_STATUS",
  async ({ accountId, woId, toStatus, remark, cancelApphierId = null }, thunkAPI) => {
    try {
      const patchFn =
        accountManagementService.patchData ||
        accountManagementService.updateData;
      const response = await patchFn(
        `/v1/dbs/api/accounts/${accountId}/workorders/${woId}/status`,
        { toStatus, remark, cancelApphierId }
      );
      thunkAPI.dispatch(showModalSuccess({ title: "Successful", description: "Work Order status updated." }));
      return response.data;
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: `Status not updated. ${message}.` }));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// ─── APPROVAL ────────────────────────────────────────────────────────────────

export const getWoApprovals = createAsyncThunk(
  "GET_WO_APPROVALS",
  async ({ accountId, body, isLoadMore }, thunkAPI) => {
    try {
      const response = await accountManagementService.updateDataWithMethodPost(
        `/v1/dbs/api/accounts/${accountId}/workorders/approvals/list`,
        body
      );
      return { ...response.data, isLoadMore };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const approveOrRejectWo = createAsyncThunk(
  "APPROVE_OR_REJECT_WO",
  async ({ accountId, body, action }, thunkAPI) => {
    try {
      await accountManagementService.updateDataWithMethodPost(
        `/v1/dbs/api/accounts/${accountId}/workorders/approvals/action`,
        body
      );
      thunkAPI.dispatch(
        showModalSuccess({
          title: "Successful",
          description: `Work Order has been ${action === "APPROVE" ? "approved" : "rejected"}.`,
        })
      );
      return { body, action };
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      thunkAPI.dispatch(
        showModalError({
          title: "Failed",
          description: `Work Order was not ${action === "APPROVE" ? "approved" : "rejected"}. ${message}.`,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// ─── CLOSED WO (for WO Reference picker) ─────────────────────────────────────

export const getClosedWorkOrders = createAsyncThunk(
  "GET_CLOSED_WORK_ORDERS",
  async ({ body, isLoadMore }, thunkAPI) => {
    try {
      const response = await accountManagementService.updateDataWithMethodPost(
        "/v1/dbs/api/workorders/references/list",
        body
      );
      return { ...response.data, isLoadMore };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// ─── ACTIVITIES ───────────────────────────────────────────────────────────────

export const getWoActivitiesByCategory = createAsyncThunk(
  "GET_WO_ACTIVITIES_BY_CATEGORY",
  async (categoryGlbId, thunkAPI) => {
    try {
      const response = await accountManagementService.getAll(
        `/v1/dbs/api/workorders/activities/templates?categoryGlbId=${categoryGlbId}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getWoActivities = createAsyncThunk(
  "GET_WO_ACTIVITIES",
  async ({ woId, body, isLoadMore }, thunkAPI) => {
    try {
      const response = await accountManagementService.updateDataWithMethodPost(
        `/v1/dbs/api/workorders/${woId}/activities/list`,
        body
      );
      return { ...response, isLoadMore };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// ─── DATA REQUIREMENTS ───────────────────────────────────────────────────────

export const getWoDataRequirements = createAsyncThunk(
  "GET_WO_DATA_REQUIREMENTS",
  async ({ woId, body, isLoadMore }, thunkAPI) => {
    try {
      const response = await accountManagementService.updateDataWithMethodPost(
        `/v1/dbs/api/workorders/${woId}/data-requirements/list`,
        body
      );
      return { ...response, isLoadMore };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getWoDataRequirementTypes = createAsyncThunk(
  "GET_WO_DATA_REQUIREMENT_TYPES",
  async (_, thunkAPI) => {
    try {
      const response = await accountManagementService.getAll(
        "/v1/dbs/api/dropdowns/workorders/datarequirements"
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getWoDataRequirementValues = createAsyncThunk(
  "GET_WO_DATA_REQUIREMENT_VALUES",
  async ({ typeValue, accountId }, thunkAPI) => {
    try {
      const response = await accountManagementService.getAll(
        `/v1/dbs/api/workorders/data-requirements/values?typeValue=${typeValue}&accountId=${accountId}`
      );
      return { typeValue, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// ─── PROGRESS HISTORY ─────────────────────────────────────────────────────────

export const getWoProgress = createAsyncThunk(
  "GET_WO_PROGRESS",
  async (woId, thunkAPI) => {
    try {
      const response = await accountManagementService.getAll(
        `/v1/dbs/api/workorders/${woId}/progress`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getWoAttachments = createAsyncThunk(
  "GET_WO_ATTACHMENTS",
  async ({ accountId, woId }, thunkAPI) => {
    try {
      const response = await accountManagementService.getAll(
        `/v1/dbs/api/accounts/${accountId}/workorders/${woId}/attachments`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// ─── DROPDOWNS ───────────────────────────────────────────────────────────────

const makeDropdownThunk = (actionType, url) =>
  createAsyncThunk(actionType, async (_, thunkAPI) => {
    try {
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  });

export const getWoCategories         = makeDropdownThunk("GET_WO_CATEGORIES",          "/v1/dbs/api/dropdowns/workorders/categories");
export const getWoTypes               = makeDropdownThunk("GET_WO_TYPES",               "/v1/dbs/api/dropdowns/workorders/types");
export const getWoPriorities          = makeDropdownThunk("GET_WO_PRIORITIES",          "/v1/dbs/api/dropdowns/workorders/priorities");
export const getWoGroups              = makeDropdownThunk("GET_WO_GROUPS",              "/v1/dbs/api/dropdowns/workorders/groups");
export const getWoActivityStatuses    = makeDropdownThunk("GET_WO_ACTIVITY_STATUSES",   "/v1/dbs/api/dropdowns/activities/statuses");
export const getWoPicPositions        = makeDropdownThunk("GET_WO_PIC_POSITIONS",       "/v1/dbs/api/workorders/pic-positions");
export const getWoApprovalHierarchies = makeDropdownThunk("GET_WO_APPROVAL_HIERARCHIES","/v1/dbs/api/workorders/approval-hierarchies");

export const getWoPicUsers = createAsyncThunk(
  "GET_WO_PIC_USERS",
  async (positionId, thunkAPI) => {
    try {
      const response = await accountManagementService.getAll(
        `/v1/dbs/api/workorders/pic-users?positionId=${positionId}`
      );
      return { positionId, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getWoApprovalHierarchy = createAsyncThunk(
  "GET_WO_APPROVAL_HIERARCHY",
  async (id, thunkAPI) => {
    try {
      const response = await accountManagementService.getAll(
        `/v1/dbs/api/workorders/approval-hierarchies/${id}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// ─── SLICE ────────────────────────────────────────────────────────────────────

const workOrderSlice = createSlice({
  name: "workOrder",
  initialState,
  reducers: {
    resetWoState: () => initialState,
    resetWoDetail: (state) => { state.detail_workOrder = null; },
    clearWoActivities: (state) => { state.list_woActivities = []; },
    clearWoDataRequirements: (state) => { state.list_woDataRequirements = []; },
  },
  extraReducers: {
    // getWorkOrders
    [getWorkOrders.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) state.loading_listWo = true;
    },
    [getWorkOrders.fulfilled]: (state, action) => {
      state.loading_listWo = false;
      const { items, totalPage, totalElement, currentPage, pageSize } = extractListData(action.payload);
      if (action.payload?.isLoadMore) {
        const ids = new Set(state.list_workOrders.map((i) => i.id));
        state.list_workOrders = [...state.list_workOrders, ...items.filter((i) => !ids.has(i.id))];
      } else {
        state.list_workOrders = items;
      }
      state.pagination_listWo = { totalPage, totalElement, currentPage, pageSize };
    },
    [getWorkOrders.rejected]: (state, action) => {
      state.loading_listWo = false;
      if (!action.meta.arg?.isLoadMore) {
        state.list_workOrders = [];
        state.pagination_listWo = { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 };
      }
    },

    // getWorkOrder
    [getWorkOrder.pending]: (state) => { state.loading_detailWo = true; },
    [getWorkOrder.fulfilled]: (state, action) => {
      state.loading_detailWo = false;
      state.detail_workOrder = action.payload;
    },
    [getWorkOrder.rejected]: (state) => { state.loading_detailWo = false; },

    // createWorkOrder / updateWorkOrder
    [createWorkOrder.pending]: (state) => { state.loading_createUpdateWo = true; },
    [createWorkOrder.fulfilled]: (state) => { state.loading_createUpdateWo = false; },
    [createWorkOrder.rejected]: (state) => { state.loading_createUpdateWo = false; },

    [updateWorkOrder.pending]: (state) => { state.loading_createUpdateWo = true; },
    [updateWorkOrder.fulfilled]: (state) => { state.loading_createUpdateWo = false; },
    [updateWorkOrder.rejected]: (state) => { state.loading_createUpdateWo = false; },

    // updateWoStatus
    [updateWoStatus.pending]: (state) => { state.loading_statusUpdateWo = true; },
    [updateWoStatus.fulfilled]: (state, action) => {
      state.loading_statusUpdateWo = false;
      if (state.detail_workOrder && action.payload) {
        state.detail_workOrder = {
          ...state.detail_workOrder,
          status: action.payload.status,
          ageHours: action.payload.ageHours,
        };
      }
    },
    [updateWoStatus.rejected]: (state) => { state.loading_statusUpdateWo = false; },

    // getWoApprovals
    [getWoApprovals.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) state.loading_listWoApprovals = true;
    },
    [getWoApprovals.fulfilled]: (state, action) => {
      state.loading_listWoApprovals = false;
      const { items, totalPage, totalElement } = extractListData(action.payload);
      if (action.payload?.isLoadMore) {
        const ids = new Set(state.list_woApprovals.map((i) => i.id));
        state.list_woApprovals = [...state.list_woApprovals, ...items.filter((i) => !ids.has(i.id))];
      } else {
        state.list_woApprovals = items;
      }
      state.pagination_listWoApprovals = { totalPage, totalElement };
    },
    [getWoApprovals.rejected]: (state) => { state.loading_listWoApprovals = false; },

    // approveOrRejectWo
    [approveOrRejectWo.pending]: (state, action) => {
      if (action.meta.arg?.action === "APPROVE") state.loading_approveWo = true;
      else state.loading_rejectWo = true;
    },
    [approveOrRejectWo.fulfilled]: (state) => {
      state.loading_approveWo = false;
      state.loading_rejectWo = false;
    },
    [approveOrRejectWo.rejected]: (state) => {
      state.loading_approveWo = false;
      state.loading_rejectWo = false;
    },

    // getClosedWorkOrders
    [getClosedWorkOrders.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) state.loading_closedWo = true;
    },
    [getClosedWorkOrders.fulfilled]: (state, action) => {
      state.loading_closedWo = false;
      const { items, totalPage, totalElement } = extractListData(action.payload);
      if (action.payload?.isLoadMore) {
        const ids = new Set(state.list_closedWorkOrders.map((i) => i.id));
        state.list_closedWorkOrders = [...state.list_closedWorkOrders, ...items.filter((i) => !ids.has(i.id))];
      } else {
        state.list_closedWorkOrders = items;
      }
      state.pagination_closedWo = { totalPage, totalElement };
    },
    [getClosedWorkOrders.rejected]: (state) => { state.loading_closedWo = false; },

    // getWoActivitiesByCategory
    [getWoActivitiesByCategory.pending]: (state) => { state.loading_listWoActivities = true; },
    [getWoActivitiesByCategory.fulfilled]: (state, action) => {
      state.loading_listWoActivities = false;
      const items = Array.isArray(action.payload) ? action.payload : (action.payload?.data || action.payload?.result || []);
      state.list_woActivities = items;
    },
    [getWoActivitiesByCategory.rejected]: (state) => { state.loading_listWoActivities = false; },

    // getWoActivities
    [getWoActivities.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) state.loading_listWoActivities = true;
    },
    [getWoActivities.fulfilled]: (state, action) => {
      state.loading_listWoActivities = false;
      const { items, totalPage, totalElement } = extractListData(action.payload);
      if (action.payload?.isLoadMore) {
        const ids = new Set(state.list_woActivities.map((i) => i.id));
        state.list_woActivities = [...state.list_woActivities, ...items.filter((i) => !ids.has(i.id))];
      } else {
        state.list_woActivities = items;
      }
      state.pagination_woActivities = { totalPage, totalElement };
    },
    [getWoActivities.rejected]: (state) => { state.loading_listWoActivities = false; },

    // getWoDataRequirements
    [getWoDataRequirements.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) state.loading_listWoDataRequirements = true;
    },
    [getWoDataRequirements.fulfilled]: (state, action) => {
      state.loading_listWoDataRequirements = false;
      const { items, totalPage, totalElement } = extractListData(action.payload);
      if (action.payload?.isLoadMore) {
        const ids = new Set(state.list_woDataRequirements.map((i) => i.id));
        state.list_woDataRequirements = [...state.list_woDataRequirements, ...items.filter((i) => !ids.has(i.id))];
      } else {
        state.list_woDataRequirements = items;
      }
      state.pagination_woDataRequirements = { totalPage, totalElement };
    },
    [getWoDataRequirements.rejected]: (state) => { state.loading_listWoDataRequirements = false; },

    // getWoDataRequirementTypes
    [getWoDataRequirementTypes.pending]: (state) => { state.loading_dropdowns = true; },
    [getWoDataRequirementTypes.fulfilled]: (state, action) => {
      state.loading_dropdowns = false;
      const items = Array.isArray(action.payload) ? action.payload : (action.payload?.data || action.payload?.result || []);
      state.list_woDataRequirementTypes = items;
    },
    [getWoDataRequirementTypes.rejected]: (state) => { state.loading_dropdowns = false; },

    // getWoDataRequirementValues
    [getWoDataRequirementValues.pending]: (state) => {},
    [getWoDataRequirementValues.fulfilled]: (state, action) => {
      const { typeValue, data } = action.payload;
      const items = Array.isArray(data) ? data : (data?.data || data?.result || []);
      state.detail_woDataRequirementValues = {
        ...state.detail_woDataRequirementValues,
        [typeValue]: items,
      };
    },
    [getWoDataRequirementValues.rejected]: (state) => {},

    // getWoAttachments
    [getWoAttachments.pending]: (state) => { state.loading_listWoAttachments = true; },
    [getWoAttachments.fulfilled]: (state, action) => {
      state.loading_listWoAttachments = false;
      state.list_woAttachments = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
    },
    [getWoAttachments.rejected]: (state) => { state.loading_listWoAttachments = false; },

    // getWoProgress
    [getWoProgress.pending]: (state) => { state.loading_woProgress = true; },
    [getWoProgress.fulfilled]: (state, action) => {
      state.loading_woProgress = false;
      state.list_woProgress = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
    },
    [getWoProgress.rejected]: (state) => { state.loading_woProgress = false; },

    // getWoPicUsers
    [getWoPicUsers.pending]: (state) => {},
    [getWoPicUsers.fulfilled]: (state, action) => {
      const { positionId, data } = action.payload;
      const items = Array.isArray(data) ? data : (data?.data || data?.result || []);
      state.list_woPicUsers = {
        ...state.list_woPicUsers,
        [positionId]: items,
      };
    },
    [getWoPicUsers.rejected]: (state) => {},

    // getWoApprovalHierarchy (detail)
    [getWoApprovalHierarchy.pending]: (state) => {},
    [getWoApprovalHierarchy.fulfilled]: (state, action) => {
      const items = Array.isArray(action.payload) ? action.payload : (action.payload?.data || action.payload?.result || []);
      state.detail_woApprovalHierarchy = items;
    },
    [getWoApprovalHierarchy.rejected]: (state) => {},

    // Simple dropdown thunks
    [getWoCategories.fulfilled]:          (state, a) => { state.list_woCategories         = Array.isArray(a.payload) ? a.payload : (a.payload?.data || a.payload?.result || []); },
    [getWoTypes.fulfilled]:               (state, a) => { state.list_woTypes              = Array.isArray(a.payload) ? a.payload : (a.payload?.data || a.payload?.result || []); },
    [getWoPriorities.fulfilled]:          (state, a) => { state.list_woPriorities         = Array.isArray(a.payload) ? a.payload : (a.payload?.data || a.payload?.result || []); },
    [getWoGroups.fulfilled]:              (state, a) => { state.list_woGroups             = Array.isArray(a.payload) ? a.payload : (a.payload?.data || a.payload?.result || []); },
    [getWoPicPositions.fulfilled]:        (state, a) => { state.list_woPicPositions       = Array.isArray(a.payload) ? a.payload : (a.payload?.data || a.payload?.result || []); },
    [getWoActivityStatuses.fulfilled]:    (state, a) => { state.list_woActivityStatuses   = Array.isArray(a.payload) ? a.payload : (a.payload?.data || a.payload?.result || []); },
    [getWoApprovalHierarchies.fulfilled]: (state, a) => { state.list_woApprovalHierarchy  = Array.isArray(a.payload) ? a.payload : (a.payload?.data || a.payload?.result || []); },
  },
});

export const { resetWoState, resetWoDetail, clearWoActivities, clearWoDataRequirements } = workOrderSlice.actions;
export default workOrderSlice.reducer;
