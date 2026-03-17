import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showModalError, showModalSuccess } from "../../general_slice";
import accountManagementService from "../../../services/account_management/accountManagementService";

const initialState = {
  // List page state
  serviceRequests: [],
  pagination: null,
  loadingList: false,
  // Detail / Create state
  data: [],
  data_detail: null,
  data_detail_draft: null,
  loading_detail_draft: false,
  loading_update: false,
  loading_status_update: false,
  data_prerequisites: [],
  data_work_orders: [],
  data_activities: [],
  data_data_requirements: [],
  data_attachments: [],
  data_contacts: [],
  // Dropdowns
  data_types: [],
  data_categories: [],
  data_subcategories: [],
  data_priorities: [],
  data_channels: [],
  data_sources: [],
  data_approval_hierarchy: [],
  data_approval_hierarchy_detail: [],
  data_work_order_types: [],
  data_work_order_statuses: [],
  data_prerequisite_types: [],
  data_activity_statuses: [],
  data_data_requirement_types: [],
  data_data_requirement_values: {},
  // Payment related
  data_payment_plans: [],
  data_installments: [],
  data_schedules: [],
  data_billing_items: [],
  // UI State
  loading: false,
  loading_detail: false,
  loading_prerequisites: false,
  loading_work_orders: false,
  loading_activities: false,
  loading_data_requirements: false,
  loading_data_requirement_values: false,
  error_data_requirement_values: null,
  loading_dropdowns: false,
  isFailed: false,
  isSuccess: false,
  message: "",
};

// =====================================================
// SERVICE REQUEST - MAIN CRUD
// =====================================================

// Get Filtered Service Requests by Account (list page — infinite scroll)
export const getFilteredServiceRequests = createAsyncThunk(
  "GET_FILTERED_SERVICE_REQUESTS",
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
export const getServiceRequestsByAccount = createAsyncThunk(
  "GET_SERVICE_REQUESTS_BY_ACCOUNT",
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
export const getServiceRequestDetailByAccount = createAsyncThunk(
  "GET_SERVICE_REQUEST_DETAIL_BY_ACCOUNT",
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
export const getDetailDraftServiceRequest = createAsyncThunk(
  "GET_DETAIL_DRAFT_SERVICE_REQUEST",
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
export const createServiceRequestForAccount = createAsyncThunk(
  "CREATE_SERVICE_REQUEST_FOR_ACCOUNT",
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
export const createCompleteServiceRequest = createAsyncThunk(
  "CREATE_COMPLETE_SERVICE_REQUEST",
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
export const updateServiceRequestForAccount = createAsyncThunk(
  "UPDATE_SERVICE_REQUEST_FOR_ACCOUNT",
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
export const updateCompleteServiceRequest = createAsyncThunk(
  "UPDATE_COMPLETE_SERVICE_REQUEST",
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
export const deleteServiceRequestForAccount = createAsyncThunk(
  "DELETE_SERVICE_REQUEST_FOR_ACCOUNT",
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
export const getAllServiceRequests = createAsyncThunk(
  "GET_ALL_SERVICE_REQUESTS",
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
export const getServiceRequestById = createAsyncThunk(
  "GET_SERVICE_REQUEST_BY_ID",
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
export const getServiceRequestTypes = createAsyncThunk(
  "GET_SERVICE_REQUEST_TYPES",
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
export const getServiceRequestCategories = createAsyncThunk(
  "GET_SERVICE_REQUEST_CATEGORIES",
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
export const getServiceRequestSubcategories = createAsyncThunk(
  "GET_SERVICE_REQUEST_SUBCATEGORIES",
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
export const getServiceRequestPriorities = createAsyncThunk(
  "GET_SERVICE_REQUEST_PRIORITIES",
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
export const getServiceRequestChannels = createAsyncThunk(
  "GET_SERVICE_REQUEST_CHANNELS",
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
export const getServiceRequestSources = createAsyncThunk(
  "GET_SERVICE_REQUEST_SOURCES",
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
export const getWorkOrderTypes = createAsyncThunk(
  "GET_WORK_ORDER_TYPES",
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
export const getWorkOrderStatuses = createAsyncThunk(
  "GET_WORK_ORDER_STATUSES",
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
export const getServiceRequestPrerequisites = createAsyncThunk(
  "GET_SERVICE_REQUEST_PREREQUISITES",
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
export const getServiceRequestDataRequirements = createAsyncThunk(
  "GET_SERVICE_REQUEST_DATA_REQUIREMENTS",
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
export const getServiceRequestApprovalHierarchies = createAsyncThunk(
  "GET_SERVICE_REQUEST_APPROVAL_HIERARCHIES",
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
export const getServiceRequestApprovalHierarchyDetail = createAsyncThunk(
  "GET_SERVICE_REQUEST_APPROVAL_HIERARCHY_DETAIL",
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
export const getDataRequirementValuesByType = createAsyncThunk(
  "GET_DATA_REQUIREMENT_VALUES_BY_TYPE",
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
export const getActivityStatuses = createAsyncThunk(
  "GET_ACTIVITY_STATUSES",
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
export const getPrerequisitesByServiceRequest = createAsyncThunk(
  "GET_PREREQUISITES_BY_SERVICE_REQUEST",
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
export const createPrerequisiteForServiceRequest = createAsyncThunk(
  "CREATE_PREREQUISITE_FOR_SERVICE_REQUEST",
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
export const updatePrerequisiteForServiceRequest = createAsyncThunk(
  "UPDATE_PREREQUISITE_FOR_SERVICE_REQUEST",
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
export const deletePrerequisiteForServiceRequest = createAsyncThunk(
  "DELETE_PREREQUISITE_FOR_SERVICE_REQUEST",
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
// WORK ORDERS
// =====================================================

// Get Work Orders by Service Request
export const getWorkOrdersByServiceRequest = createAsyncThunk(
  "GET_WORK_ORDERS_BY_SERVICE_REQUEST",
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
export const createWorkOrderForServiceRequest = createAsyncThunk(
  "CREATE_WORK_ORDER_FOR_SERVICE_REQUEST",
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
export const getActivitiesByWorkOrder = createAsyncThunk(
  "GET_ACTIVITIES_BY_WORK_ORDER",
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
export const getDataRequirementsByServiceRequest = createAsyncThunk(
  "GET_DATA_REQUIREMENTS_BY_SERVICE_REQUEST",
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
export const createDataRequirementForServiceRequest = createAsyncThunk(
  "CREATE_DATA_REQUIREMENT_FOR_SERVICE_REQUEST",
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
export const createPaymentPlan = createAsyncThunk(
  "CREATE_PAYMENT_PLAN",
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
export const getPaymentPlansByInstallment = createAsyncThunk(
  "GET_PAYMENT_PLANS_BY_INSTALLMENT",
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
export const createInstallment = createAsyncThunk(
  "CREATE_INSTALLMENT",
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
export const getInstallmentDetail = createAsyncThunk(
  "GET_INSTALLMENT_DETAIL",
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
export const getInstallmentPaymentSchedule = createAsyncThunk(
  "GET_INSTALLMENT_PAYMENT_SCHEDULE",
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

// =====================================================
// SLICE DEFINITION
// =====================================================

const serviceRequestSlice = createSlice({
  name: "serviceRequest",
  initialState,
  reducers: {
    resetServiceRequestState: (state) => {
      return initialState;
    },
    resetServiceRequestDetail: (state) => {
      state.data_detail = null;
    },
    clearPrerequisites: (state) => {
      state.data_prerequisites = [];
    },
    clearWorkOrders: (state) => {
      state.data_work_orders = [];
    },
    clearActivities: (state) => {
      state.data_activities = [];
    },
    clearDataRequirements: (state) => {
      state.data_data_requirements = [];
    },
    resetDetailDraft: (state) => {
      state.data_detail_draft = null;
    },
  },
  extraReducers: {
    // =====================================================
    // SERVICE REQUEST LIST
    // =====================================================
    [getFilteredServiceRequests.pending]: (state) => {
      state.loadingList = true;
      state.isFailed = false;
    },
    [getFilteredServiceRequests.fulfilled]: (state, action) => {
      state.loadingList = false;
      const { data: response, isLoadMore } = action.payload;
      // Unwrap outer envelope: { success, code, message, data: { result, page } }
      const responseData = response?.data ?? response;
      const rawItems = responseData?.result ?? responseData?.content ?? [];
      const pageInfo = responseData?.page;
      const totalElements = pageInfo?.totalElements ?? responseData?.totalElements ?? responseData?.totalElement ?? 0;
      const totalPages = pageInfo?.totalPages ?? Math.ceil(totalElements / (pageInfo?.size ?? 10));
      state.pagination = { totalElements, totalPages };
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
        state.serviceRequests = [...(state.serviceRequests || []), ...items];
      } else {
        state.serviceRequests = items;
      }
    },
    [getFilteredServiceRequests.rejected]: (state) => {
      state.loadingList = false;
      state.isFailed = true;
    },

    [getServiceRequestsByAccount.pending]: (state) => {
      state.loading = true;
      state.isFailed = false;
      state.isSuccess = false;
    },
    [getServiceRequestsByAccount.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getServiceRequestsByAccount.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
    },

    [getAllServiceRequests.pending]: (state) => {
      state.loading = true;
      state.isFailed = false;
      state.isSuccess = false;
    },
    [getAllServiceRequests.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getAllServiceRequests.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
    },

    // =====================================================
    // SERVICE REQUEST DETAIL
    // =====================================================
    [getServiceRequestDetailByAccount.pending]: (state) => {
      state.loading_detail = true;
      state.isFailed = false;
      state.isSuccess = false;
    },
    [getServiceRequestDetailByAccount.fulfilled]: (state, action) => {
      state.loading_detail = false;
      state.data_detail = action.payload;
    },
    [getServiceRequestDetailByAccount.rejected]: (state, action) => {
      state.loading_detail = false;
      state.isFailed = true;
    },

    [getDetailDraftServiceRequest.pending]: (state) => {
      state.loading_detail_draft = true;
    },
    [getDetailDraftServiceRequest.fulfilled]: (state, action) => {
      state.loading_detail_draft = false;
      state.data_detail_draft = action.payload;
    },
    [getDetailDraftServiceRequest.rejected]: (state) => {
      state.loading_detail_draft = false;
      state.data_detail_draft = null;
    },

    [getServiceRequestById.pending]: (state) => {
      state.loading_detail = true;
      state.isFailed = false;
      state.isSuccess = false;
    },
    [getServiceRequestById.fulfilled]: (state, action) => {
      state.loading_detail = false;
      state.data_detail = action.payload;
    },
    [getServiceRequestById.rejected]: (state, action) => {
      state.loading_detail = false;
      state.isFailed = true;
    },

    // =====================================================
    // SERVICE REQUEST CRUD
    // =====================================================
    [createServiceRequestForAccount.pending]: (state) => {
      state.loading = true;
    },
    [createServiceRequestForAccount.fulfilled]: (state, action) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [createServiceRequestForAccount.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    [createCompleteServiceRequest.pending]: (state) => {
      state.loading = true;
    },
    [createCompleteServiceRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [createCompleteServiceRequest.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    [updateServiceRequestForAccount.pending]: (state) => {
      state.loading = true;
    },
    [updateServiceRequestForAccount.fulfilled]: (state, action) => {
      state.loading = false;
      state.isSuccess = true;
      state.data_detail = action.payload;
    },
    [updateServiceRequestForAccount.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    [updateCompleteServiceRequest.pending]: (state) => {
      state.loading_update = true;
    },
    [updateCompleteServiceRequest.fulfilled]: (state, action) => {
      state.loading_update = false;
      state.isSuccess = true;
    },
    [updateCompleteServiceRequest.rejected]: (state) => {
      state.loading_update = false;
      state.isFailed = true;
    },

    [updateServiceRequestStatus.pending]: (state) => {
      state.loading_status_update = true;
    },
    [updateServiceRequestStatus.fulfilled]: (state, action) => {
      state.loading_status_update = false;
      state.isSuccess = true;
    },
    [updateServiceRequestStatus.rejected]: (state) => {
      state.loading_status_update = false;
      state.isFailed = true;
    },

    [deleteServiceRequestForAccount.pending]: (state) => {
      state.loading = true;
    },
    [deleteServiceRequestForAccount.fulfilled]: (state) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [deleteServiceRequestForAccount.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    // =====================================================
    // DROPDOWNS
    // =====================================================
    [getServiceRequestTypes.pending]: (state) => {
      state.loading_dropdowns = true;
    },
    [getServiceRequestTypes.fulfilled]: (state, action) => {
      state.loading_dropdowns = false;
      state.data_types = action.payload;
    },
    [getServiceRequestTypes.rejected]: (state) => {
      state.loading_dropdowns = false;
    },

    [getServiceRequestCategories.fulfilled]: (state, action) => {
      state.data_categories = action.payload;
    },

    [getServiceRequestSubcategories.fulfilled]: (state, action) => {
      state.data_subcategories = action.payload;
    },

    [getServiceRequestPriorities.fulfilled]: (state, action) => {
      state.data_priorities = action.payload;
    },

    [getServiceRequestChannels.fulfilled]: (state, action) => {
      state.data_channels = action.payload;
    },

    [getServiceRequestSources.fulfilled]: (state, action) => {
      state.data_sources = action.payload;
    },

    [getServiceRequestApprovalHierarchies.fulfilled]: (state, action) => {
      state.data_approval_hierarchy = action.payload;
    },

    [getServiceRequestApprovalHierarchyDetail.pending]: (state) => {
      state.data_approval_hierarchy_detail = [];
    },
    [getServiceRequestApprovalHierarchyDetail.fulfilled]: (state, action) => {
      state.data_approval_hierarchy_detail = action.payload;
    },
    [getServiceRequestApprovalHierarchyDetail.rejected]: (state) => {
      state.data_approval_hierarchy_detail = [];
    },

    [getWorkOrderTypes.fulfilled]: (state, action) => {
      state.data_work_order_types = action.payload;
    },

    [getWorkOrderStatuses.fulfilled]: (state, action) => {
      state.data_work_order_statuses = action.payload;
    },

    [getServiceRequestPrerequisites.fulfilled]: (state, action) => {
      state.data_prerequisite_types = action.payload;
    },

    [getServiceRequestDataRequirements.fulfilled]: (state, action) => {
      state.data_data_requirement_types = action.payload;
    },

    [getDataRequirementValuesByType.pending]: (state) => {
      state.loading_data_requirement_values = true;
      state.error_data_requirement_values = null;
    },
    [getDataRequirementValuesByType.fulfilled]: (state, action) => {
      state.loading_data_requirement_values = false;
      state.data_data_requirement_values[action.payload.typeValue] = action.payload.data;
    },
    [getDataRequirementValuesByType.rejected]: (state, action) => {
      state.loading_data_requirement_values = false;
      state.error_data_requirement_values = action.payload;
    },

    [getActivityStatuses.fulfilled]: (state, action) => {
      state.data_activity_statuses = action.payload;
    },

    // =====================================================
    // PREREQUISITES
    // =====================================================
    [getPrerequisitesByServiceRequest.pending]: (state) => {
      state.loading_prerequisites = true;
    },
    [getPrerequisitesByServiceRequest.fulfilled]: (state, action) => {
      state.loading_prerequisites = false;
      state.data_prerequisites = action.payload;
    },
    [getPrerequisitesByServiceRequest.rejected]: (state) => {
      state.loading_prerequisites = false;
    },

    [createPrerequisiteForServiceRequest.pending]: (state) => {
      state.loading = true;
    },
    [createPrerequisiteForServiceRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [createPrerequisiteForServiceRequest.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    // =====================================================
    // WORK ORDERS
    // =====================================================
    [getWorkOrdersByServiceRequest.pending]: (state) => {
      state.loading_work_orders = true;
    },
    [getWorkOrdersByServiceRequest.fulfilled]: (state, action) => {
      state.loading_work_orders = false;
      state.data_work_orders = action.payload;
    },
    [getWorkOrdersByServiceRequest.rejected]: (state) => {
      state.loading_work_orders = false;
    },

    // =====================================================
    // ACTIVITIES
    // =====================================================
    [getActivitiesByWorkOrder.pending]: (state) => {
      state.loading_activities = true;
    },
    [getActivitiesByWorkOrder.fulfilled]: (state, action) => {
      state.loading_activities = false;
      state.data_activities = action.payload;
    },
    [getActivitiesByWorkOrder.rejected]: (state) => {
      state.loading_activities = false;
    },

    // =====================================================
    // DATA REQUIREMENTS
    // =====================================================
    [getDataRequirementsByServiceRequest.pending]: (state) => {
      state.loading_data_requirements = true;
    },
    [getDataRequirementsByServiceRequest.fulfilled]: (state, action) => {
      state.loading_data_requirements = false;
      state.data_data_requirements = action.payload;
    },
    [getDataRequirementsByServiceRequest.rejected]: (state) => {
      state.loading_data_requirements = false;
    },

    // =====================================================
    // PAYMENT PLANS & INSTALLMENTS
    // =====================================================
    [getPaymentPlansByInstallment.fulfilled]: (state, action) => {
      state.data_payment_plans = action.payload;
    },

    [getInstallmentDetail.fulfilled]: (state, action) => {
      state.data_installments = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
    },

    [getInstallmentPaymentSchedule.fulfilled]: (state, action) => {
      state.data_schedules = action.payload;
    },
  },
});

export const updateServiceRequestStatus = createAsyncThunk(
  "UPDATE_SERVICE_REQUEST_STATUS",
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

const { reducer } = serviceRequestSlice;
export const {
  resetServiceRequestState,
  resetServiceRequestDetail,
  clearPrerequisites,
  clearWorkOrders,
  clearActivities,
  clearDataRequirements,
  resetDetailDraft,
} = serviceRequestSlice.actions;
export default reducer;
