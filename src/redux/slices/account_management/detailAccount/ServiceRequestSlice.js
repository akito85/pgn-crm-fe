import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showModalError, showModalSuccess } from "../../general_slice";
import accountManagementService from "../../../services/account_management/accountManagementService";

const initialState = {
  // List page state
  list_serviceRequest: [],
  pagination_listSr: { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 },
  loading_listSr: false,
  // Approval modal state
  list_srApprovals: [],
  pagination_listSrApprovals: { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 },
  loading_listSrApprovals: false,
  loading_approveSr: false,
  loading_rejectSr: false,
  // Approval History
  detail_srApprovalHistory: null,
  loading_srApprovalHistory: false,
  // Detail / Create state
  data: [],
  detail_serviceRequest: null,
  detailDraft_serviceRequest: null,
  loading_detailDraftSr: false,
  loading_createUpdateSr: false,
  loading_listSrApprovalHierarchy: false,
  loading_detailSrApprovalHierarchy: false,
  loading_statusUpdateSr: false,
  list_srPrerequisites: [],
  pagination_listSrPrerequisites: { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 },
  list_srWorkOrders: [],
  list_srActivities: [],
  list_srDataRequirements: [],
  list_srAttachments: [],
  list_srAttachmentCategories: [],
  loading_listSrAttachmentCategories: false,
  list_srContacts: [],
  pagination_listSrContacts: { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 },
  loading_listSrContacts: false,
  loading_listSrAttachments: false,
  // Dropdowns
  list_srTypes: [],
  list_srCategories: [],
  list_srSubcategories: [],
  list_srPriorities: [],
  list_srChannels: [],
  list_srSources: [],
  list_srApprovalHierarchy: [],
  detail_srApprovalHierarchy: [],
  list_srWorkOrderTypes: [],
  list_srWorkOrderStatuses: [],
  list_srPrerequisiteTypes: [],
  list_srActivityStatuses: [],
  list_srDataRequirementTypes: [],
  detail_srDataRequirementValues: {},
  // Payment related
  list_srPaymentPlans: [],
  list_srInstallments: [],
  list_srSchedules: [],
  list_srBillingItems: [],
  // Action Logs
  list_srActionLogs: [],
  pagination_listSrActionLogs: { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 },
  loading_listSrActionLogs: false,
  // Create SR wizard state (persists across navigation to prereq create page)
  create_sr: {
    formData: null,
    prerequisites: [],
    attachments: [],
  },
  // Local overrides for API prerequisites (update flow edits, not sent to BE)
  edited_api_prerequisites: {},
  // UI State
  loading: false,
  loading_detailSr: false,
  loading_listSrPrerequisites: false,
  loading_listSrWorkOrders: false,
  loading_listSrActivities: false,
  loading_listSrDataRequirements: false,
  pagination_listSrDataRequirements: { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 },
  loading_srDataRequirementValues: false,
  error_srDataRequirementValues: null,
  loading_dropdowns: false,
  isFailed: false,
  isSuccess: false,
  message: "",
  // Pre Requisite Template
  loading_prerequisiteTemplate: false,
  list_prerequisiteTemplate: [],
  pagination_prerequisiteTemplate: { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 },
};

// =====================================================
// SERVICE REQUEST - MAIN CRUD
// =====================================================

// Get Filtered Service Requests by Account (list page — infinite scroll)
export const getServiceRequests = createAsyncThunk(
  "GET_SERVICE_REQUESTS",
  async ({ idAccount, body, isLoadMore }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/${idAccount}/service-request`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body);
      return { ...response.data, isLoadMore };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Service Request Approval List (pending approvals)
export const getServiceRequestApprovals = createAsyncThunk(
  "GET_SERVICE_REQUEST_APPROVALS",
  async ({ idAccount, body, isLoadMore }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/${idAccount}/service-request`;
      const response = await accountManagementService.updateDataWithMethodPost(url, {
        ...body,
        listType: "approval",
      });
      return { ...response.data, isLoadMore };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Approve or Reject Service Requests
export const approveOrRejectAllServiceRequest = createAsyncThunk(
  "APPROVE_OR_REJECT_ALL_SERVICE_REQUEST",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/service-request/approve";
      await accountManagementService.activationWithRemark(url, body);
      const successBody = {
        title: "Successful",
        description: `Your data has been ${action === "APPROVE" ? "approved" : "rejected"}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return { body, action };
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        description: `Your data was not ${action === "APPROVE" ? "approved" : "rejected"}. ${message}.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Service Request Detail by Account and ID
export const getServiceRequest = createAsyncThunk(
  "GET_SERVICE_REQUEST",
  async ({ accountId, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/${accountId}/service-request/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Service Request Draft Detail (from triggerJson)
export const getServiceRequestDraft = createAsyncThunk(
  "GET_SERVICE_REQUEST_DRAFT",
  async ({ accountId, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/${accountId}/service-request/${id}/draft`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Service Request Action Logs
export const getServiceRequestActionLogs = createAsyncThunk(
  "GET_SERVICE_REQUEST_ACTION_LOGS",
  async ({ serviceRequestId, body, isLoadMore }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/service-request/${serviceRequestId}/action-log`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body);
      return { ...response.data, isLoadMore };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Service Request Data Requirements
export const getServiceRequestDataRequirements = createAsyncThunk(
  "GET_SERVICE_REQUEST_DATA_REQUIREMENTS",
  async ({ serviceRequestId, body, isLoadMore }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/service-request/${serviceRequestId}/data-requirement`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body);
      return { ...response.data, isLoadMore };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Create Service Request with nested data
export const createServiceRequest = createAsyncThunk(
  "CREATE_SERVICE_REQUEST",
  async ({ accountId, body, attachments = [], action = "SUBMIT", successBodyExtra = {} }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/${accountId}/service-request/create`;
      const response = await accountManagementService.createData(url, body);
      const { id } = response.data;

      const uploadUrl = `/v1/dbs/api/service-request/upload-attachment`;
      await Promise.all(
        attachments.map((att) =>
          accountManagementService.uploadAttachment(uploadUrl, {
            files: att.file,
            category: att.fileCategoryId,
            refId: id,
            action,
          })
        )
      );

      const isDraft = Boolean(body?.isDraft) || body?.action === "DRAFT";
      const successBody = {
        title: "Successful",
        description: isDraft
          ? "Service Request draft has been saved."
          : "Service Request has been submitted.",
        ...successBodyExtra,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const isDraft = Boolean(body?.isDraft) || body?.action === "DRAFT";
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        description: isDraft
          ? `Service Request draft was not saved. ${message}. Please try again.`
          : `Service Request was not submitted. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Update Service Request with composite data (supports draft/submit via triggerJson)
export const updateServiceRequest = createAsyncThunk(
  "UPDATE_SERVICE_REQUEST",
  async ({ accountId, id, body, attachments = [], action = "SUBMIT", successBodyExtra = {} }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/${accountId}/service-request/${id}`;
      const response = await accountManagementService.updateData(url, body);

      const uploadUrl = `/v1/dbs/api/service-request/upload-attachment`;
      await Promise.all(
        attachments.map((att) =>
          accountManagementService.uploadAttachment(uploadUrl, {
            files: att.file,
            category: att.fileCategoryId,
            refId: id,
            action,
          })
        )
      );

      const isDraft = Boolean(body?.isDraft) || body?.action === "DRAFT";
      const successBody = {
        title: "Successful",
        description: isDraft
          ? "Service Request draft has been saved."
          : "Service Request has been submitted.",
        ...successBodyExtra,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const isDraft = Boolean(body?.isDraft) || body?.action === "DRAFT";
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        description: isDraft
          ? `Service Request draft was not saved. ${message}. Please try again.`
          : `Service Request was not submitted. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Service Request by ID (Independent)
export const getSrById = createAsyncThunk(
  "GET_SR_BY_ID",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/servicerequests/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// =====================================================
// DROPDOWN ENDPOINTS
// =====================================================

// Get Service Request Types
export const getSrTypes = createAsyncThunk(
  "GET_SR_TYPES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/servicerequests/types`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Service Request Categories
export const getSrCategories = createAsyncThunk(
  "GET_SR_CATEGORIES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/servicerequests/categories`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Service Request Subcategories
export const getSrSubcategories = createAsyncThunk(
  "GET_SR_SUBCATEGORIES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/servicerequests/subcategories`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Service Request Priorities
export const getSrPriorities = createAsyncThunk(
  "GET_SR_PRIORITIES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/servicerequests/priorities`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Service Request Channels
export const getSrChannels = createAsyncThunk(
  "GET_SR_CHANNELS",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/servicerequests/channels`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Service Request Sources
export const getSrSources = createAsyncThunk(
  "GET_SR_SOURCES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/servicerequests/sources`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Work Order Types
export const getSrWorkOrderTypes = createAsyncThunk(
  "GET_SR_WORK_ORDER_TYPES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/workorders/types`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Work Order Statuses
export const getSrWorkOrderStatuses = createAsyncThunk(
  "GET_SR_WORK_ORDER_STATUSES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/workorders/statuses`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Prerequisite Types
export const getSrPrerequisiteTypes = createAsyncThunk(
  "GET_SR_PREREQUISITE_TYPES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/servicerequests/prerequisites`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Data Requirements Types
export const getSrDataRequirementTypes = createAsyncThunk(
  "GET_SR_DATA_REQUIREMENT_TYPES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/servicerequests/datarequirements`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Approval Hierarchy List
export const getSrApprovalHierarchies = createAsyncThunk(
  "GET_SR_APPROVAL_HIERARCHIES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/service-request/approval-hierarchies`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Approval Hierarchy Detail
export const getSrApprovalHierarchy = createAsyncThunk(
  "GET_SR_APPROVAL_HIERARCHY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/service-request/approval-hierarchy/${id}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Attachment Categories for Service Request
export const getSrAttachmentCategories = createAsyncThunk(
  "GET_SR_ATTACHMENT_CATEGORIES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/service-request/attachment-category`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Data Requirement Values by Type and Account
export const getSrDataRequirementValues = createAsyncThunk(
  "GET_SR_DATA_REQUIREMENT_VALUES",
  async ({ typeValue, accountId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/datarequirements/values/${typeValue}`;
      const response = await accountManagementService.getAll(url);
      return { typeValue, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Activity Statuses
export const getSrActivityStatuses = createAsyncThunk(
  "GET_SR_ACTIVITY_STATUSES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/activities/statuses`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// =====================================================
// PREREQUISITES
// =====================================================

// Get Prerequisites by Service Request
export const getServiceRequestPreRequisites = createAsyncThunk(
  "GET_SERVICE_REQUEST_PREREQUISITES",
  async ({ accountId, serviceRequestId, body, isLoadMore = false }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/${accountId}/service-request/${serviceRequestId}/pre-requisite`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body);
      return { ...response.data, isLoadMore };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Create Prerequisite for Service Request
export const createSrPrerequisite = createAsyncThunk(
  "CREATE_SR_PREREQUISITE",
  async ({ accountId, srId, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/prerequisites`;
      const response = await accountManagementService.createData(url, body);
      const successBody = {
        title: "Successful",
        description: "Prerequisite has been created.",
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        description: `Prerequisite was not created. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Update Prerequisite for Service Request
export const updateSrPrerequisite = createAsyncThunk(
  "UPDATE_SR_PREREQUISITE",
  async ({ accountId, srId, id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/prerequisites/${id}`;
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: "Successful",
        description: "Prerequisite has been updated.",
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        description: `Prerequisite was not updated. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Delete Prerequisite for Service Request
export const deleteSrPrerequisite = createAsyncThunk(
  "DELETE_SR_PREREQUISITE",
  async ({ accountId, srId, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/prerequisites/${id}`;
      const response = await accountManagementService.deleteData(url);
      const successBody = {
        title: "Successful",
        description: "Prerequisite has been deleted.",
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        description: `Prerequisite was not deleted. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// =====================================================
// CONTACTS
// =====================================================

// Get Attachments by Service Request
export const getSrAttachments = createAsyncThunk(
  "GET_SR_ATTACHMENTS",
  async ({ accountId, srId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/attachments`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Contacts by Service Request
export const getSrContacts = createAsyncThunk(
  "GET_SR_CONTACTS",
  async ({ accountId, srId, body, isLoadMore }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/${accountId}/service-request/contact`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body);
      return { ...response.data, isLoadMore };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// =====================================================
// WORK ORDERS
// =====================================================

// Get Work Orders by Service Request
export const getSrWorkOrders = createAsyncThunk(
  "GET_SR_WORK_ORDERS",
  async ({ accountId, srId, page = 1, size = 10 }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/workorders/list?page=${page}&size=${size}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Create Work Order for Service Request
export const createSrWorkOrder = createAsyncThunk(
  "CREATE_SR_WORK_ORDER",
  async ({ accountId, srId, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/workorders`;
      const response = await accountManagementService.createData(url, body);
      const successBody = {
        title: "Successful",
        description: "Work Order has been created.",
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        description: `Work Order was not created. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// =====================================================
// ACTIVITIES
// =====================================================

// Get Activities by Work Order
export const getSrActivities = createAsyncThunk(
  "GET_SR_ACTIVITIES",
  async ({ accountId, srId, woId, page = 1, size = 10 }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/workorders/${woId}/activities/list?page=${page}&size=${size}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// =====================================================
// DATA REQUIREMENTS
// =====================================================

// Get Data Requirements by Service Request
export const getSrDataRequirements = createAsyncThunk(
  "GET_SR_DATA_REQUIREMENTS",
  async ({ accountId, serviceRequestId, body, isLoadMore = false }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/${accountId}/service-request/${serviceRequestId}/data-requirement`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body);
      return { ...response.data, isLoadMore };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Create Data Requirement for Service Request
export const createSrDataRequirement = createAsyncThunk(
  "CREATE_SR_DATA_REQUIREMENT",
  async ({ accountId, srId, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/datarequirements`;
      const response = await accountManagementService.createData(url, body);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// =====================================================
// PAYMENT PLANS & INSTALLMENTS
// =====================================================

// Create Payment Plan
export const createSrPaymentPlan = createAsyncThunk(
  "CREATE_SR_PAYMENT_PLAN",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/servicerequest/paymentplan/create`;
      const response = await accountManagementService.createData(url, body);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Payment Plans by Installment
export const getSrPaymentPlans = createAsyncThunk(
  "GET_SR_PAYMENT_PLANS",
  async (installmentId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/servicerequest/paymentplan/installment/${installmentId}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Create Installment
export const createSrInstallment = createAsyncThunk(
  "CREATE_SR_INSTALLMENT",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/servicerequest/installment/create`;
      const response = await accountManagementService.createData(url, body);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Installment Detail
export const getSrInstallment = createAsyncThunk(
  "GET_SR_INSTALLMENT",
  async (installmentId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/servicerequest/installment/detail/${installmentId}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Installment Payment Schedule
export const getSrInstallmentSchedule = createAsyncThunk(
  "GET_SR_INSTALLMENT_SCHEDULE",
  async (installmentId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/servicerequest/installment/schedule/${installmentId}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const updateSrStatus = createAsyncThunk(
  "UPDATE_SR_STATUS",
  async ({ accountId, id, status }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/${accountId}/service-request/${id}/status`;
      const response = await accountManagementService.patchData(url, {
        status,
      });
      thunkAPI.dispatch(showModalSuccess({
        title: "Successful",
        description: `Service Request status updated to ${status}.`,
        return: false,
      }));
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(showModalError({
        title: "Failed",
        description: `Status update failed. ${message}`,
      }));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Pre Requisite Template
export const getSrPrerequisiteTemplate = createAsyncThunk(
  "GET_SR_PREREQUISITE_TEMPLATE",
  async ({ accountId, body, isLoadMore }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/prerequisite-templates`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body);
      return { ...response.data, isLoadMore };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Approval History for a Service Request
export const getSrApprovalHistory = createAsyncThunk(
  "GET_SR_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/service-request/approval-history/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// =====================================================
// SLICE DEFINITION
// =====================================================

const serviceRequestSlice = createSlice({
  name: "serviceRequest",
  initialState,
  reducers: {
    resetSrState: (state) => {
      return initialState;
    },
    resetSrDetail: (state) => {
      state.detail_serviceRequest = null;
    },
    clearSrPrerequisites: (state) => {
      state.list_srPrerequisites = [];
    },
    clearSrWorkOrders: (state) => {
      state.list_srWorkOrders = [];
    },
    clearSrActivities: (state) => {
      state.list_srActivities = [];
    },
    clearSrDataRequirements: (state) => {
      state.list_srDataRequirements = [];
    },
    resetSrDetailDraft: (state) => {
      state.detailDraft_serviceRequest = null;
    },
    saveCreateSrFormData: (state, action) => {
      state.create_sr.formData = action.payload;
    },
    addCreateSrPrerequisite: (state, action) => {
      state.create_sr.prerequisites.push(action.payload);
    },
    removeCreateSrPrerequisite: (state, action) => {
      state.create_sr.prerequisites = state.create_sr.prerequisites.filter(
        (pr) => pr.key !== action.payload
      );
    },
    updateCreateSrPrerequisite: (state, action) => {
      state.create_sr.prerequisites = state.create_sr.prerequisites.map(
        (pr) => pr.key === action.payload.key ? { ...pr, ...action.payload } : pr
      );
    },
    saveEditedApiPrerequisite: (state, action) => {
      const id = action.payload.key ?? action.payload.id;
      state.edited_api_prerequisites[id] = action.payload;
    },
    removeEditedApiPrerequisite: (state, action) => {
      delete state.edited_api_prerequisites[action.payload];
    },
    clearEditedApiPrerequisites: (state) => {
      state.edited_api_prerequisites = {};
    },
    saveCreateSrAttachments: (state, action) => {
      state.create_sr.attachments = action.payload;
    },
    resetCreateSr: (state) => {
      state.create_sr = { formData: null, prerequisites: [], attachments: [] };
      state.edited_api_prerequisites = {};
    },
  },
  extraReducers: {
    // =====================================================
    // SERVICE REQUEST LIST
    // =====================================================
    [getServiceRequests.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) state.loading_listSr = true;
    },
    [getServiceRequests.fulfilled]: (state, action) => {
      state.loading_listSr = false;
      const { result, page, isLoadMore } = action.payload;
      if (Array.isArray(result)) {
        const normalized = result.map((item) => ({
          ...item,
          serviceRequestNumber: item.requestNumber,
          serviceRequestReference: item.reference,
          type: item.requestType,
          category: item.requestCategory,
          subCategory: item.requestSubCategory,
          requestSource: item.source,
        }));
        if (isLoadMore) {
          const currentIds = new Set(state.list_serviceRequest.map((i) => i.id));
          state.list_serviceRequest = [
            ...state.list_serviceRequest,
            ...normalized.filter((i) => !currentIds.has(i.id)),
          ];
        } else {
          state.list_serviceRequest = normalized;
        }
      }
      state.pagination_listSr = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      };
    },
    [getServiceRequests.rejected]: (state, action) => {
      state.loading_listSr = false;
      if (!action.meta.arg?.isLoadMore) {
        state.list_serviceRequest = [];
        state.pagination_listSr = { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 };
      }
    },

    // =====================================================
    // SERVICE REQUEST ACTION LOGS
    // =====================================================
    [getServiceRequestActionLogs.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) state.loading_listSrActionLogs = true;
    },
    [getServiceRequestActionLogs.fulfilled]: (state, action) => {
      state.loading_listSrActionLogs = false;
      const { result, page, isLoadMore } = action.payload;
      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_srActionLogs.map((i) => i.id));
          state.list_srActionLogs = [
            ...state.list_srActionLogs,
            ...result.filter((i) => !currentIds.has(i.id)),
          ];
        } else {
          state.list_srActionLogs = result;
        }
      }
      state.pagination_listSrActionLogs = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      };
    },
    [getServiceRequestActionLogs.rejected]: (state, action) => {
      state.loading_listSrActionLogs = false;
      if (!action.meta.arg?.isLoadMore) {
        state.list_srActionLogs = [];
        state.pagination_listSrActionLogs = { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 };
      }
    },

    // =====================================================
    // SERVICE REQUEST DETAIL
    // =====================================================
    [getServiceRequest.pending]: (state) => {
      state.loading_detailSr = true;
      state.isFailed = false;
      state.isSuccess = false;
    },
    [getServiceRequest.fulfilled]: (state, action) => {
      state.loading_detailSr = false;
      state.detail_serviceRequest = action.payload;
    },
    [getServiceRequest.rejected]: (state, action) => {
      state.loading_detailSr = false;
      state.isFailed = true;
    },

    [getServiceRequestDraft.pending]: (state) => {
      state.loading_detailDraftSr = true;
    },
    [getServiceRequestDraft.fulfilled]: (state, action) => {
      state.loading_detailDraftSr = false;
      state.detailDraft_serviceRequest = action.payload;
    },
    [getServiceRequestDraft.rejected]: (state) => {
      state.loading_detailDraftSr = false;
      state.detailDraft_serviceRequest = null;
    },

    [getSrById.pending]: (state) => {
      state.loading_detailSr = true;
      state.isFailed = false;
      state.isSuccess = false;
    },
    [getSrById.fulfilled]: (state, action) => {
      state.loading_detailSr = false;
      state.detail_serviceRequest = action.payload;
    },
    [getSrById.rejected]: (state, action) => {
      state.loading_detailSr = false;
      state.isFailed = true;
    },

    // =====================================================
    // SERVICE REQUEST CRUD
    // =====================================================
    [createServiceRequest.pending]: (state) => {
      state.loading_createUpdateSr = true;
    },
    [createServiceRequest.fulfilled]: (state, action) => {
      state.loading_createUpdateSr = false;
      state.isSuccess = true;
    },
    [createServiceRequest.rejected]: (state) => {
      state.loading_createUpdateSr = false;
      state.isFailed = true;
    },

    [updateServiceRequest.pending]: (state) => {
      state.loading_createUpdateSr = true;
    },
    [updateServiceRequest.fulfilled]: (state, action) => {
      state.loading_createUpdateSr = false;
      state.isSuccess = true;
    },
    [updateServiceRequest.rejected]: (state) => {
      state.loading_createUpdateSr = false;
      state.isFailed = true;
    },

    [updateSrStatus.pending]: (state) => {
      state.loading_statusUpdateSr = true;
    },
    [updateSrStatus.fulfilled]: (state, action) => {
      state.loading_statusUpdateSr = false;
      state.isSuccess = true;
    },
    [updateSrStatus.rejected]: (state) => {
      state.loading_statusUpdateSr = false;
      state.isFailed = true;
    },

    // =====================================================
    // DROPDOWNS
    // =====================================================
    [getSrTypes.pending]: (state) => {
      state.loading_dropdowns = true;
    },
    [getSrTypes.fulfilled]: (state, action) => {
      state.loading_dropdowns = false;
      state.list_srTypes = action.payload;
    },
    [getSrTypes.rejected]: (state) => {
      state.loading_dropdowns = false;
    },

    [getSrCategories.fulfilled]: (state, action) => {
      state.list_srCategories = action.payload;
    },

    [getSrSubcategories.fulfilled]: (state, action) => {
      state.list_srSubcategories = action.payload;
    },

    [getSrPriorities.fulfilled]: (state, action) => {
      state.list_srPriorities = action.payload;
    },

    [getSrChannels.fulfilled]: (state, action) => {
      state.list_srChannels = action.payload;
    },

    [getSrSources.fulfilled]: (state, action) => {
      state.list_srSources = action.payload;
    },

    [getSrApprovalHierarchies.pending]: (state) => {
      state.loading_listSrApprovalHierarchy = true;
    },
    [getSrApprovalHierarchies.fulfilled]: (state, action) => {
      state.loading_listSrApprovalHierarchy = false;
      state.list_srApprovalHierarchy = action.payload;
    },
    [getSrApprovalHierarchies.rejected]: (state) => {
      state.loading_listSrApprovalHierarchy = false;
    },

    [getSrApprovalHierarchy.pending]: (state) => {
      state.loading_detailSrApprovalHierarchy = true;
      state.detail_srApprovalHierarchy = [];
    },
    [getSrApprovalHierarchy.fulfilled]: (state, action) => {
      state.loading_detailSrApprovalHierarchy = false;
      state.detail_srApprovalHierarchy = action.payload;
    },
    [getSrApprovalHierarchy.rejected]: (state) => {
      state.loading_detailSrApprovalHierarchy = false;
      state.detail_srApprovalHierarchy = [];
    },

    [getSrAttachmentCategories.pending]: (state) => {
      state.loading_listSrAttachmentCategories = true;
    },
    [getSrAttachmentCategories.fulfilled]: (state, action) => {
      state.list_srAttachmentCategories = action.payload;
      state.loading_listSrAttachmentCategories = false;
    },
    [getSrAttachmentCategories.rejected]: (state) => {
      state.list_srAttachmentCategories = [];
      state.loading_listSrAttachmentCategories = false;
    },

    [getSrWorkOrderTypes.fulfilled]: (state, action) => {
      state.list_srWorkOrderTypes = action.payload;
    },

    [getSrWorkOrderStatuses.fulfilled]: (state, action) => {
      state.list_srWorkOrderStatuses = action.payload;
    },

    [getSrPrerequisiteTypes.fulfilled]: (state, action) => {
      state.list_srPrerequisiteTypes = action.payload;
    },

    [getSrDataRequirementTypes.fulfilled]: (state, action) => {
      state.list_srDataRequirementTypes = action.payload;
    },

    [getSrDataRequirementValues.pending]: (state) => {
      state.loading_srDataRequirementValues = true;
      state.error_srDataRequirementValues = null;
    },
    [getSrDataRequirementValues.fulfilled]: (state, action) => {
      state.loading_srDataRequirementValues = false;
      state.detail_srDataRequirementValues[action.payload.typeValue] = action.payload.data;
    },
    [getSrDataRequirementValues.rejected]: (state, action) => {
      state.loading_srDataRequirementValues = false;
      state.error_srDataRequirementValues = action.payload;
    },

    [getSrActivityStatuses.fulfilled]: (state, action) => {
      state.list_srActivityStatuses = action.payload;
    },

    // =====================================================
    // PREREQUISITES
    // =====================================================
    [getServiceRequestPreRequisites.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) state.loading_listSrPrerequisites = true;
    },
    [getServiceRequestPreRequisites.fulfilled]: (state, action) => {
      state.loading_listSrPrerequisites = false;
      const { result, page, isLoadMore } = action.payload;
      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_srPrerequisites.map((i) => i.id));
          state.list_srPrerequisites = [
            ...state.list_srPrerequisites,
            ...result.filter((i) => !currentIds.has(i.id)),
          ];
        } else {
          state.list_srPrerequisites = result;
        }
      }
      state.pagination_listSrPrerequisites = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      };
    },
    [getServiceRequestPreRequisites.rejected]: (state, action) => {
      state.loading_listSrPrerequisites = false;
      if (!action.meta.arg?.isLoadMore) {
        state.list_srPrerequisites = [];
        state.pagination_listSrPrerequisites = { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 };
      }
    },

    [createSrPrerequisite.pending]: (state) => {
      state.loading = true;
    },
    [createSrPrerequisite.fulfilled]: (state, action) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [createSrPrerequisite.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    // =====================================================
    // ATTACHMENTS
    // =====================================================
    [getSrAttachments.pending]: (state) => {
      state.loading_listSrAttachments = true;
    },
    [getSrAttachments.fulfilled]: (state, action) => {
      state.loading_listSrAttachments = false;
      const raw = action.payload;
      state.list_srAttachments = Array.isArray(raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
    },
    [getSrAttachments.rejected]: (state) => {
      state.loading_listSrAttachments = false;
    },

    // =====================================================
    // CONTACTS
    // =====================================================
    [getSrContacts.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) state.loading_listSrContacts = true;
    },
    [getSrContacts.fulfilled]: (state, action) => {
      state.loading_listSrContacts = false;
      const { result, page, isLoadMore } = action.payload;
      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_srContacts.map((i) => i.id));
          state.list_srContacts = [
            ...state.list_srContacts,
            ...result.filter((i) => !currentIds.has(i.id)),
          ];
        } else {
          state.list_srContacts = result;
        }
      }
      state.pagination_listSrContacts = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      };
    },
    [getSrContacts.rejected]: (state, action) => {
      state.loading_listSrContacts = false;
      if (!action.meta.arg?.isLoadMore) {
        state.list_srContacts = [];
        state.pagination_listSrContacts = { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 };
      }
    },

    // =====================================================
    // WORK ORDERS
    // =====================================================
    [getSrWorkOrders.pending]: (state) => {
      state.loading_listSrWorkOrders = true;
    },
    [getSrWorkOrders.fulfilled]: (state, action) => {
      state.loading_listSrWorkOrders = false;
      state.list_srWorkOrders = action.payload;
    },
    [getSrWorkOrders.rejected]: (state) => {
      state.loading_listSrWorkOrders = false;
    },

    // =====================================================
    // ACTIVITIES
    // =====================================================
    [getSrActivities.pending]: (state) => {
      state.loading_listSrActivities = true;
    },
    [getSrActivities.fulfilled]: (state, action) => {
      state.loading_listSrActivities = false;
      state.list_srActivities = action.payload;
    },
    [getSrActivities.rejected]: (state) => {
      state.loading_listSrActivities = false;
    },

    // =====================================================
    // DATA REQUIREMENTS
    // =====================================================
    [getSrDataRequirements.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) state.loading_listSrDataRequirements = true;
    },
    [getSrDataRequirements.fulfilled]: (state, action) => {
      state.loading_listSrDataRequirements = false;
      const { result, page, isLoadMore } = action.payload;
      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_srDataRequirements.map((i) => i.id));
          state.list_srDataRequirements = [
            ...state.list_srDataRequirements,
            ...result.filter((i) => !currentIds.has(i.id)),
          ];
        } else {
          state.list_srDataRequirements = result;
        }
      }
      state.pagination_listSrDataRequirements = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      };
    },
    [getSrDataRequirements.rejected]: (state, action) => {
      state.loading_listSrDataRequirements = false;
      if (!action.meta.arg?.isLoadMore) {
        state.list_srDataRequirements = [];
        state.pagination_listSrDataRequirements = { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 };
      }
    },

    // =====================================================
    // PAYMENT PLANS & INSTALLMENTS
    // =====================================================
    [getSrPaymentPlans.fulfilled]: (state, action) => {
      state.list_srPaymentPlans = action.payload;
    },

    [getSrInstallment.fulfilled]: (state, action) => {
      state.list_srInstallments = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
    },

    [getSrInstallmentSchedule.fulfilled]: (state, action) => {
      state.list_srSchedules = action.payload;
    },

    // =====================================================
    // SERVICE REQUEST APPROVALS
    // =====================================================
    [getServiceRequestApprovals.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) state.loading_listSrApprovals = true;
    },
    [getServiceRequestApprovals.fulfilled]: (state, action) => {
      state.loading_listSrApprovals = false;
      const { result, page, isLoadMore } = action.payload;
      if (Array.isArray(result)) {
        const normalized = result.map((item) => ({
          ...item,
          serviceRequestNumber: item.requestNumber,
          serviceRequestReference: item.reference,
          type: item.requestType,
          category: item.requestCategory,
          subCategory: item.requestSubCategory,
          requestSource: item.source,
        }));
        if (isLoadMore) {
          const currentIds = new Set(state.list_srApprovals.map((i) => i.id));
          state.list_srApprovals = [
            ...state.list_srApprovals,
            ...normalized.filter((i) => !currentIds.has(i.id)),
          ];
        } else {
          state.list_srApprovals = normalized;
        }
      }
      state.pagination_listSrApprovals = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      };
    },
    [getServiceRequestApprovals.rejected]: (state, action) => {
      state.loading_listSrApprovals = false;
      if (!action.meta.arg?.isLoadMore) {
        state.list_srApprovals = [];
        state.pagination_listSrApprovals = { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 };
      }
    },

    [approveOrRejectAllServiceRequest.pending]: (state, action) => {
      if (action.meta.arg.action === "APPROVE") {
        state.loading_approveSr = true;
      } else {
        state.loading_rejectSr = true;
      }
    },
    [approveOrRejectAllServiceRequest.fulfilled]: (state) => {
      state.loading_approveSr = false;
      state.loading_rejectSr = false;
    },
    [approveOrRejectAllServiceRequest.rejected]: (state) => {
      state.loading_approveSr = false;
      state.loading_rejectSr = false;
    },

    // Pre Requisite Template
    [getSrPrerequisiteTemplate.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) state.loading_prerequisiteTemplate = true;
    },
    [getSrPrerequisiteTemplate.fulfilled]: (state, action) => {
      state.loading_prerequisiteTemplate = false;
      const { result, page, isLoadMore } = action.payload;
      if (isLoadMore) {
        const currentIds = new Set(state.list_prerequisiteTemplate.map((i) => i.id));
        state.list_prerequisiteTemplate = [
          ...state.list_prerequisiteTemplate,
          ...result.filter((i) => !currentIds.has(i.id)),
        ];
      } else {
        state.list_prerequisiteTemplate = result;
      }
      state.pagination_prerequisiteTemplate = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      };
    },
    [getSrPrerequisiteTemplate.rejected]: (state, action) => {
      state.loading_prerequisiteTemplate = false;
      if (!action.meta.arg?.isLoadMore) {
        state.list_prerequisiteTemplate = [];
        state.pagination_prerequisiteTemplate = { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 };
      }
    },
    
    // =====================================================
    // SERVICE REQUEST APPROVAL HISTORY
    // =====================================================
    [getSrApprovalHistory.pending]: (state) => {
      state.detail_srApprovalHistory = null;
      state.loading_srApprovalHistory = true;
    },
    [getSrApprovalHistory.fulfilled]: (state, action) => {
      state.detail_srApprovalHistory = action.payload;
      state.loading_srApprovalHistory = false;
    },
    [getSrApprovalHistory.rejected]: (state) => {
      state.loading_srApprovalHistory = false;
      state.detail_srApprovalHistory = null;
    },

  },
});

const { reducer } = serviceRequestSlice;
export const {
  resetSrState,
  resetSrDetail,
  clearSrPrerequisites,
  clearSrWorkOrders,
  clearSrActivities,
  clearSrDataRequirements,
  resetSrDetailDraft,
  saveCreateSrFormData,
  addCreateSrPrerequisite,
  removeCreateSrPrerequisite,
  updateCreateSrPrerequisite,
  saveEditedApiPrerequisite,
  removeEditedApiPrerequisite,
  clearEditedApiPrerequisites,
  saveCreateSrAttachments,
  resetCreateSr,
} = serviceRequestSlice.actions;
export default reducer;
