import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showModalError, showModalSuccess } from "../../general_slice";
import accountManagementService from "../../../services/account_management/accountManagementService";

const initialState = {
  // List page state
  list_serviceRequest: [],
  pagination_listSr: null,
  loading_listSr: false,
  // Detail / Create state
  data: [],
  detail_serviceRequest: null,
  detailDraft_serviceRequest: null,
  loading_detailDraftSr: false,
  loading_createUpdateSr: false,
  loading_statusUpdateSr: false,
  list_srPrerequisites: [],
  list_srWorkOrders: [],
  list_srActivities: [],
  list_srDataRequirements: [],
  list_srAttachments: [],
  list_srContacts: [],
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
  // UI State
  loading: false,
  loading_detailSr: false,
  loading_listSrPrerequisites: false,
  loading_listSrWorkOrders: false,
  loading_listSrActivities: false,
  loading_listSrDataRequirements: false,
  loading_srDataRequirementValues: false,
  error_srDataRequirementValues: null,
  loading_dropdowns: false,
  isFailed: false,
  isSuccess: false,
  message: "",
};

// =====================================================
// SERVICE REQUEST - MAIN CRUD
// =====================================================

// Get Filtered Service Requests by Account (list page — infinite scroll)
export const getServiceRequests = createAsyncThunk(
  "GET_SERVICE_REQUESTS",
  async ({ idAccount, body = {}, isLoadMore = false }, thunkAPI) => {
    try {
      const { page = 1, size = 10, sort, searchs } = body;
      let url = `/v1/dbs/api/accounts/${idAccount}/servicerequests/list?page=${page}&size=${size}`;
      if (sort) url += `&sort=${sort}`;
      if (searchs && typeof searchs === "object") {
        Object.keys(searchs).forEach((key) => {
          if (searchs[key] !== undefined && searchs[key] !== null && searchs[key] !== "") {
            url += `&${key}=${encodeURIComponent(searchs[key])}`;
          }
        });
      }
      const response = await accountManagementService.getAll(url);
      return { data: response, isLoadMore };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Service Requests by Account
export const getSrListByAccount = createAsyncThunk(
  "GET_SR_LIST_BY_ACCOUNT",
  async ({ accountId, page = 1, size = 10, sort, search }, thunkAPI) => {
    try {
      let url = `/v1/dbs/api/accounts/${accountId}/servicerequests/list?page=${page}&size=${size}`;
      if (sort) url += `&sort=${sort}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Service Request Detail by Account and ID
export const getServiceRequest = createAsyncThunk(
  "GET_SERVICE_REQUEST",
  async ({ accountId, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${id}`;
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
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/detail-draft/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Create Service Request for Account
export const createSrForAccount = createAsyncThunk(
  "CREATE_SR_FOR_ACCOUNT",
  async ({ accountId, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests`;
      const response = await accountManagementService.createData(url, body);
      const successBody = {
        title: "Successful",
        description: "Service Request has been created.",
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
        description: `Service Request was not created. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Create Service Request with nested data
export const createServiceRequest = createAsyncThunk(
  "CREATE_SERVICE_REQUEST",
  async ({ accountId, body, successBodyExtra = {} }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/create`;
      const response = await accountManagementService.createData(url, body);
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

// Update Service Request for Account
export const updateSrForAccount = createAsyncThunk(
  "UPDATE_SR_FOR_ACCOUNT",
  async ({ accountId, id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${id}`;
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: "Successful",
        description: "Service Request has been updated.",
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
        description: `Service Request was not updated. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Update Service Request with composite data (supports draft/submit via triggerJson)
export const updateServiceRequest = createAsyncThunk(
  "UPDATE_SERVICE_REQUEST",
  async ({ accountId, id, body, successBodyExtra = {} }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${id}`;
      const response = await accountManagementService.updateData(url, body);
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

// Delete Service Request for Account
export const deleteSr = createAsyncThunk(
  "DELETE_SR",
  async ({ accountId, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${id}`;
      const response = await accountManagementService.deleteData(url);
      const successBody = {
        title: "Successful",
        description: "Service Request has been deleted.",
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
        description: `Service Request was not deleted. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get All Service Requests (Independent)
export const getAllSr = createAsyncThunk(
  "GET_ALL_SR",
  async ({ page = 1, size = 10, search, sort }, thunkAPI) => {
    try {
      let url = `/v1/dbs/api/servicerequests/list?page=${page}&size=${size}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (sort) url += `&sort=${sort}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
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
export const getSrPrerequisites = createAsyncThunk(
  "GET_SR_PREREQUISITES",
  async ({ accountId, srId, page = 1, size = 10 }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/prerequisites/list?page=${page}&size=${size}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
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
  async ({ accountId, srId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/contacts`;
      const response = await accountManagementService.getAll(url);
      return response.data;
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
  async ({ accountId, srId, page = 1, size = 10 }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/datarequirements/list?page=${page}&size=${size}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
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
  async ({ accountId, id, status, remark = "" }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${id}`;
      const response = await accountManagementService.updateData(url, {
        serviceRequestId: id,
        requestStatus: status,
        remark,
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
  },
  extraReducers: {
    // =====================================================
    // SERVICE REQUEST LIST
    // =====================================================
    [getServiceRequests.pending]: (state) => {
      state.loading_listSr = true;
      state.isFailed = false;
    },
    [getServiceRequests.fulfilled]: (state, action) => {
      state.loading_listSr = false;
      const { data: response, isLoadMore } = action.payload;
      // Unwrap outer envelope: { success, code, message, data: { result, page } }
      const responseData = response?.data ?? response;
      const rawItems = responseData?.result ?? responseData?.content ?? [];
      const pageInfo = responseData?.page;
      const totalElements = pageInfo?.totalElements ?? responseData?.totalElements ?? responseData?.totalElement ?? 0;
      const totalPages = pageInfo?.totalPages ?? Math.ceil(totalElements / (pageInfo?.size ?? 10));
      state.pagination_listSr = { totalElements, totalPages };
      // Normalize field names to match column dataIndex
      const items = rawItems.map((item) => ({
        ...item,
        serviceRequestNumber: item.requestNumber,
        serviceRequestReference: item.reference,
        type: item.requestType,
        category: item.requestCategory,
        subCategory: item.requestSubCategory,
        requestSource: item.source,
      }));
      if (isLoadMore) {
        state.list_serviceRequest = [...(state.list_serviceRequest || []), ...items];
      } else {
        state.list_serviceRequest = items;
      }
    },
    [getServiceRequests.rejected]: (state) => {
      state.loading_listSr = false;
      state.isFailed = true;
    },

    [getSrListByAccount.pending]: (state) => {
      state.loading = true;
      state.isFailed = false;
      state.isSuccess = false;
    },
    [getSrListByAccount.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getSrListByAccount.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
    },

    [getAllSr.pending]: (state) => {
      state.loading = true;
      state.isFailed = false;
      state.isSuccess = false;
    },
    [getAllSr.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getAllSr.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
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
      state.loading_detailSrDraftSr = true;
    },
    [getServiceRequestDraft.fulfilled]: (state, action) => {
      state.loading_detailSrDraftSr = false;
      state.detailDraft_serviceRequest = action.payload;
    },
    [getServiceRequestDraft.rejected]: (state) => {
      state.loading_detailSrDraftSr = false;
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
    [createSrForAccount.pending]: (state) => {
      state.loading = true;
    },
    [createSrForAccount.fulfilled]: (state, action) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [createSrForAccount.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    [createServiceRequest.pending]: (state) => {
      state.loading = true;
    },
    [createServiceRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [createServiceRequest.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    [updateSrForAccount.pending]: (state) => {
      state.loading = true;
    },
    [updateSrForAccount.fulfilled]: (state, action) => {
      state.loading = false;
      state.isSuccess = true;
      state.detail_serviceRequest = action.payload;
    },
    [updateSrForAccount.rejected]: (state) => {
      state.loading = false;
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

    [deleteSr.pending]: (state) => {
      state.loading = true;
    },
    [deleteSr.fulfilled]: (state) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [deleteSr.rejected]: (state) => {
      state.loading = false;
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

    [getSrApprovalHierarchies.fulfilled]: (state, action) => {
      state.list_srApprovalHierarchy = action.payload;
    },

    [getSrApprovalHierarchy.pending]: (state) => {
      state.detail_srApprovalHierarchy = [];
    },
    [getSrApprovalHierarchy.fulfilled]: (state, action) => {
      state.detail_srApprovalHierarchy = action.payload;
    },
    [getSrApprovalHierarchy.rejected]: (state) => {
      state.detail_srApprovalHierarchy = [];
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
    [getSrPrerequisites.pending]: (state) => {
      state.loading_listSrPrerequisites = true;
    },
    [getSrPrerequisites.fulfilled]: (state, action) => {
      state.loading_listSrPrerequisites = false;
      state.list_srPrerequisites = action.payload;
    },
    [getSrPrerequisites.rejected]: (state) => {
      state.loading_listSrPrerequisites = false;
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
    [getSrContacts.pending]: (state) => {
      state.loading_listSrContacts = true;
    },
    [getSrContacts.fulfilled]: (state, action) => {
      state.loading_listSrContacts = false;
      const raw = action.payload;
      state.list_srContacts = Array.isArray(raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
    },
    [getSrContacts.rejected]: (state) => {
      state.loading_listSrContacts = false;
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
    [getSrDataRequirements.pending]: (state) => {
      state.loading_listSrDataRequirements = true;
    },
    [getSrDataRequirements.fulfilled]: (state, action) => {
      state.loading_listSrDataRequirements = false;
      state.list_srDataRequirements = action.payload;
    },
    [getSrDataRequirements.rejected]: (state) => {
      state.loading_listSrDataRequirements = false;
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
} = serviceRequestSlice.actions;
export default reducer;
