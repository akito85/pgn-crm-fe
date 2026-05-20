import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";

// Service Request API Async Thunks

// 1. Get Filtered Service Requests with Dynamic Search
export const getFilteredServiceRequests = createAsyncThunk(
  "serviceRequest/getFilteredServiceRequests",
  async ({ page = 1, size = 10, sort, search, filters = {} }, thunkAPI) => {
    try {
      // Use 1-based pagination as per documentation
      let url = `/v1/dbs/api/servicerequests/lists?page=${page}&size=${size}`;

      if (sort) url += `&sort=${sort}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      // Add filter parameters (using DTO field names per documentation)
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          url += `&${key}=${encodeURIComponent(filters[key])}`;
        }
      });

      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 2. Get Service Requests by Account
export const getServiceRequestsByAccount = createAsyncThunk(
  "serviceRequest/getServiceRequestsByAccount",
  async ({ accountId, page = 1, size = 10 }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/list?page=${page}&size=${size}`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 3. Get Service Request Detail by Account and ID
export const getServiceRequestDetailByAccount = createAsyncThunk(
  "serviceRequest/getServiceRequestDetailByAccount",
  async ({ accountId, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 4. Create Service Request for Account
export const createServiceRequestForAccount = createAsyncThunk(
  "serviceRequest/createServiceRequestForAccount",
  async ({ accountId, requestBody }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests`;
      const response = await accountManagementService.createData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 5. Create Service Request with nested data
export const createCompleteServiceRequest = createAsyncThunk(
  "serviceRequest/createCompleteServiceRequest",
  async ({ accountId, requestBody }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/create`;
      const response = await accountManagementService.createData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 6. Update Service Request for Account
export const updateServiceRequestForAccount = createAsyncThunk(
  "serviceRequest/updateServiceRequestForAccount",
  async ({ accountId, id, requestBody }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${id}`;
      const response = await accountManagementService.updateData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 7. Partial Update Service Request for Account
export const partialUpdateServiceRequestForAccount = createAsyncThunk(
  "serviceRequest/partialUpdateServiceRequestForAccount",
  async ({ accountId, id, requestBody }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${id}`;
      const response = await accountManagementService.updateData(url, requestBody); // PATCH would typically be handled by service
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 8. Delete Service Request for Account
export const deleteServiceRequestForAccount = createAsyncThunk(
  "serviceRequest/deleteServiceRequestForAccount",
  async ({ accountId, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${id}`;
      const response = await accountManagementService.deleteData(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 9. Get All Service Requests
export const getAllServiceRequests = createAsyncThunk(
  "serviceRequest/getAllServiceRequests",
  async ({ page = 1, size = 10, search, sort }, thunkAPI) => {
    try {
      let url = `/v1/dbs/api/servicerequests/list?page=${page}&size=${size}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (sort) url += `&sort=${sort}`;

      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 10. Get Service Request by ID
export const getServiceRequestById = createAsyncThunk(
  "serviceRequest/getServiceRequestById",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/servicerequests/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 11. Create Independent Service Request
export const createIndependentServiceRequest = createAsyncThunk(
  "serviceRequest/createIndependentServiceRequest",
  async (requestBody, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/servicerequests`;
      const response = await accountManagementService.createData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 12. Update Independent Service Request
export const updateIndependentServiceRequest = createAsyncThunk(
  "serviceRequest/updateIndependentServiceRequest",
  async ({ id, requestBody }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/servicerequests/${id}`;
      const response = await accountManagementService.updateData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 13. Partial Update Independent Service Request
export const partialUpdateIndependentServiceRequest = createAsyncThunk(
  "serviceRequest/partialUpdateIndependentServiceRequest",
  async ({ id, requestBody }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/servicerequests/${id}`;
      const response = await accountManagementService.updateData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 14. Delete Independent Service Request
export const deleteIndependentServiceRequest = createAsyncThunk(
  "serviceRequest/deleteIndependentServiceRequest",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/servicerequests/${id}`;
      const response = await accountManagementService.deleteData(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// Dropdown Endpoints

// 15. Get Service Request Types
export const getServiceRequestTypes = createAsyncThunk(
  "serviceRequest/getServiceRequestTypes",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/servicerequests/types`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 16. Get Service Request Categories
export const getServiceRequestCategories = createAsyncThunk(
  "serviceRequest/getServiceRequestCategories",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/servicerequests/categories`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 17. Get Service Request Subcategories
export const getServiceRequestSubcategories = createAsyncThunk(
  "serviceRequest/getServiceRequestSubcategories",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/servicerequests/subcategories`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 18. Get Service Request Priorities
export const getServiceRequestPriorities = createAsyncThunk(
  "serviceRequest/getServiceRequestPriorities",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/servicerequests/priorities`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 19. Get Service Request Channels
export const getServiceRequestChannels = createAsyncThunk(
  "serviceRequest/getServiceRequestChannels",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/servicerequests/channels`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 20. Get Service Request Sources
export const getServiceRequestSources = createAsyncThunk(
  "serviceRequest/getServiceRequestSources",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/servicerequests/sources`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 21. Get Work Order Types
export const getWorkOrderTypes = createAsyncThunk(
  "serviceRequest/getWorkOrderTypes",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/workorders/types`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 22. Get Work Order Statuses
export const getWorkOrderStatuses = createAsyncThunk(
  "serviceRequest/getWorkOrderStatuses",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/workorders/statuses`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 23. Get Prerequisite Types
export const getServiceRequestPrerequisites = createAsyncThunk(
  "serviceRequest/getServiceRequestPrerequisites",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/servicerequests/prerequisites`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const getServiceRequestDataRequirements = createAsyncThunk(
  "serviceRequest/getServiceRequestDataRequirements",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/servicerequests/datarequirements`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 24. Get Activity Statuses
export const getActivityStatuses = createAsyncThunk(
  "serviceRequest/getActivityStatuses",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dropdowns/activities/statuses`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// Prerequisite API Async Thunks

// 25. Get Filtered Prerequisites with Dynamic Search
export const getFilteredPrerequisites = createAsyncThunk(
  "serviceRequest/getFilteredPrerequisites",
  async ({ page = 1, size = 10, sort, search, filters = {} }, thunkAPI) => {
    try {
      let url = `/v1/dbs/api/prerequisites/lists?page=${page}&size=${size}`;

      if (sort) url += `&sort=${sort}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      // Add filter parameters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          url += `&${key}=${encodeURIComponent(filters[key])}`;
        }
      });

      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 26. Get Prerequisites by Service Request
export const getPrerequisitesByServiceRequest = createAsyncThunk(
  "serviceRequest/getPrerequisitesByServiceRequest",
  async ({ accountId, srId, page = 1, size = 10 }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/prerequisites/list?page=${page}&size=${size}`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 27. Get Prerequisite Detail by Service Request and ID
export const getPrerequisiteDetailByServiceRequest = createAsyncThunk(
  "serviceRequest/getPrerequisiteDetailByServiceRequest",
  async ({ accountId, srId, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/prerequisites/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 28. Create Prerequisite for Service Request
export const createPrerequisiteForServiceRequest = createAsyncThunk(
  "serviceRequest/createPrerequisiteForServiceRequest",
  async ({ accountId, srId, requestBody }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/prerequisites`;
      const response = await accountManagementService.createData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 29. Update Prerequisite for Service Request
export const updatePrerequisiteForServiceRequest = createAsyncThunk(
  "serviceRequest/updatePrerequisiteForServiceRequest",
  async ({ accountId, srId, id, requestBody }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/prerequisites/${id}`;
      const response = await accountManagementService.updateData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 30. Partial Update Prerequisite for Service Request
export const partialUpdatePrerequisiteForServiceRequest = createAsyncThunk(
  "serviceRequest/partialUpdatePrerequisiteForServiceRequest",
  async ({ accountId, srId, id, requestBody }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/prerequisites/${id}`;
      const response = await accountManagementService.updateData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 31. Delete Prerequisite for Service Request
export const deletePrerequisiteForServiceRequest = createAsyncThunk(
  "serviceRequest/deletePrerequisiteForServiceRequest",
  async ({ accountId, srId, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/prerequisites/${id}`;
      const response = await accountManagementService.deleteData(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// Work Order API Async Thunks

// 32. Get Filtered Work Orders with Dynamic Search
export const getFilteredWorkOrders = createAsyncThunk(
  "serviceRequest/getFilteredWorkOrders",
  async ({ page = 1, size = 10, sort, search, filters = {} }, thunkAPI) => {
    try {
      let url = `/v1/dbs/api/workorders/lists?page=${page}&size=${size}`;

      if (sort) url += `&sort=${sort}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      // Add filter parameters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          url += `&${key}=${encodeURIComponent(filters[key])}`;
        }
      });

      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 33. Get Work Orders by Service Request
export const getWorkOrdersByServiceRequest = createAsyncThunk(
  "serviceRequest/getWorkOrdersByServiceRequest",
  async ({ accountId, srId, page = 1, size = 10 }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/workorders/list?page=${page}&size=${size}`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 34. Get Work Order Detail by Service Request and ID
export const getWorkOrderDetailByServiceRequest = createAsyncThunk(
  "serviceRequest/getWorkOrderDetailByServiceRequest",
  async ({ accountId, srId, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/workorders/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 35. Create Work Order for Service Request
export const createWorkOrderForServiceRequest = createAsyncThunk(
  "serviceRequest/createWorkOrderForServiceRequest",
  async ({ accountId, srId, requestBody }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/workorders`;
      const response = await accountManagementService.createData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 36. Update Work Order for Service Request
export const updateWorkOrderForServiceRequest = createAsyncThunk(
  "serviceRequest/updateWorkOrderForServiceRequest",
  async ({ accountId, srId, id, requestBody }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/workorders/${id}`;
      const response = await accountManagementService.updateData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 37. Partial Update Work Order for Service Request
export const partialUpdateWorkOrderForServiceRequest = createAsyncThunk(
  "serviceRequest/partialUpdateWorkOrderForServiceRequest",
  async ({ accountId, srId, id, requestBody }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/workorders/${id}`;
      const response = await accountManagementService.updateData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 38. Delete Work Order for Service Request
export const deleteWorkOrderForServiceRequest = createAsyncThunk(
  "serviceRequest/deleteWorkOrderForServiceRequest",
  async ({ accountId, srId, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/workorders/${id}`;
      const response = await accountManagementService.deleteData(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// Activity API Async Thunks

// 39. Get Filtered Activities with Dynamic Search
export const getFilteredActivities = createAsyncThunk(
  "serviceRequest/getFilteredActivities",
  async ({ page = 1, size = 10, sort, search, filters = {} }, thunkAPI) => {
    try {
      let url = `/v1/dbs/api/activities/lists?page=${page}&size=${size}`;

      if (sort) url += `&sort=${sort}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      // Add filter parameters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          url += `&${key}=${encodeURIComponent(filters[key])}`;
        }
      });

      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 40. Get Activities by Work Order
export const getActivitiesByWorkOrder = createAsyncThunk(
  "serviceRequest/getActivitiesByWorkOrder",
  async ({ accountId, srId, woId, page = 1, size = 10 }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/workorders/${woId}/activities/list?page=${page}&size=${size}`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 41. Get Activity Detail by Work Order and ID
export const getActivityDetailByWorkOrder = createAsyncThunk(
  "serviceRequest/getActivityDetailByWorkOrder",
  async ({ accountId, srId, woId, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/workorders/${woId}/activities/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 42. Create Activity for Work Order
export const createActivityForWorkOrder = createAsyncThunk(
  "serviceRequest/createActivityForWorkOrder",
  async ({ accountId, srId, woId, requestBody }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/workorders/${woId}/activities`;
      const response = await accountManagementService.createData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 43. Update Activity for Work Order
export const updateActivityForWorkOrder = createAsyncThunk(
  "serviceRequest/updateActivityForWorkOrder",
  async ({ accountId, srId, woId, id, requestBody }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/workorders/${woId}/activities/${id}`;
      const response = await accountManagementService.updateData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 44. Partial Update Activity for Work Order
export const partialUpdateActivityForWorkOrder = createAsyncThunk(
  "serviceRequest/partialUpdateActivityForWorkOrder",
  async ({ accountId, srId, woId, id, requestBody }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/workorders/${woId}/activities/${id}`;
      const response = await accountManagementService.updateData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 45. Delete Activity for Work Order
export const deleteActivityForWorkOrder = createAsyncThunk(
  "serviceRequest/deleteActivityForWorkOrder",
  async ({ accountId, srId, woId, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/workorders/${woId}/activities/${id}`;
      const response = await accountManagementService.deleteData(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// Data Requirement API Async Thunks

// 46. Get Filtered Data Requirements with Dynamic Search
export const getFilteredDataRequirements = createAsyncThunk(
  "serviceRequest/getFilteredDataRequirements",
  async ({ page = 1, size = 10, sort, search, filters = {} }, thunkAPI) => {
    try {
      let url = `/v1/dbs/api/datarequirements/lists?page=${page}&size=${size}`;

      if (sort) url += `&sort=${sort}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      // Add filter parameters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          url += `&${key}=${encodeURIComponent(filters[key])}`;
        }
      });

      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 47. Get Data Requirements by Service Request
export const getDataRequirementsByServiceRequest = createAsyncThunk(
  "serviceRequest/GetDataRequirementsByServiceRequest",
  async ({ accountId, srId, page = 1, size = 10 }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/datarequirements/list?page=${page}&size=${size}`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 48. Get Data Requirement Detail by Service Request and ID
export const getDataRequirementDetailByServiceRequest = createAsyncThunk(
  "serviceRequest/GetDataRequirementDetailByServiceRequest",
  async ({ accountId, srId, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/datarequirements/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 49. Create Data Requirement for Service Request
export const createDataRequirementForServiceRequest = createAsyncThunk(
  "serviceRequest/createDataRequirementForServiceRequest",
  async ({ accountId, srId, requestBody }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/datarequirements`;
      const response = await accountManagementService.createData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 50. Update Data Requirement for Service Request
export const updateDataRequirementForServiceRequest = createAsyncThunk(
  "serviceRequest/updateDataRequirementForServiceRequest",
  async ({ accountId, srId, id, requestBody }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/datarequirements/${id}`;
      const response = await accountManagementService.updateData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 51. Partial Update Data Requirement for Service Request
export const partialUpdateDataRequirementForServiceRequest = createAsyncThunk(
  "serviceRequest/partialUpdateDataRequirementForServiceRequest",
  async ({ accountId, srId, id, requestBody }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/datarequirements/${id}`;
      const response = await accountManagementService.updateData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 52. Delete Data Requirement for Service Request
export const deleteDataRequirementForServiceRequest = createAsyncThunk(
  "serviceRequest/deleteDataRequirementForServiceRequest",
  async ({ accountId, srId, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/${srId}/datarequirements/${id}`;
      const response = await accountManagementService.deleteData(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// Payment Plan API Async Thunks

// 53. Create Payment Plan
export const createPaymentPlan = createAsyncThunk(
  "serviceRequest/createPaymentPlan",
  async (requestBody, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/paymentplan/create`;
      const response = await accountManagementService.createData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 54. Update Payment Plan
export const updatePaymentPlan = createAsyncThunk(
  "serviceRequest/updatePaymentPlan",
  async (requestBody, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/paymentplan/update`;
      const response = await accountManagementService.updateData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 55. Get Payment Plan Detail
export const getPaymentPlanDetail = createAsyncThunk(
  "serviceRequest/getPaymentPlanDetail",
  async (paymentPlanId, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/paymentplan/detail/${paymentPlanId}`;
      const response = await accountManagementService.getDetail(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 56. Get Payment Plans by Installment
export const getPaymentPlansByInstallment = createAsyncThunk(
  "serviceRequest/getPaymentPlansByInstallment",
  async (installmentId, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/paymentplan/installment/${installmentId}`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 57. Get Payment Plans by Plan Type
export const getPaymentPlansByPlanType = createAsyncThunk(
  "serviceRequest/getPaymentPlansByPlanType",
  async (planType, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/paymentplan/type/${planType}`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 58. Toggle Payment Plan Status
export const togglePaymentPlanStatus = createAsyncThunk(
  "serviceRequest/togglePaymentPlanStatus",
  async (paymentPlanId, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/paymentplan/toggle/${paymentPlanId}`;
      const response = await accountManagementService.updateData(url, {});
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// Installment API Async Thunks

// 59. Create Installment
export const createInstallment = createAsyncThunk(
  "serviceRequest/createInstallment",
  async (requestBody, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/installment/create`;
      const response = await accountManagementService.createData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 60. Update Installment
export const updateInstallment = createAsyncThunk(
  "serviceRequest/updateInstallment",
  async (requestBody, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/installment/update`;
      const response = await accountManagementService.updateData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 61. Get Installment Detail
export const getInstallmentDetail = createAsyncThunk(
  "serviceRequest/getInstallmentDetail",
  async (installmentId, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/installment/detail/${installmentId}`;
      const response = await accountManagementService.getDetail(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 62. Get Installment Payment Schedule
export const getInstallmentPaymentSchedule = createAsyncThunk(
  "serviceRequest/getInstallmentPaymentSchedule",
  async (installmentId, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/installment/schedule/${installmentId}`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 63. Link Installment to Service Request
export const linkInstallmentToServiceRequest = createAsyncThunk(
  "serviceRequest/linkInstallmentToServiceRequest",
  async ({ serviceRequestId, accountId, installmentId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/installment/link`;
      const requestBody = { serviceRequestId, accountId, installmentId };
      const response = await accountManagementService.createData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// Schedule API Async Thunks

// 64. Create Installment Schedule
export const createInstallmentSchedule = createAsyncThunk(
  "serviceRequest/createInstallmentSchedule",
  async (requestBody, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/schedule/create`;
      const response = await accountManagementService.createData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 65. Update Installment Schedule
export const updateInstallmentSchedule = createAsyncThunk(
  "serviceRequest/updateInstallmentSchedule",
  async (requestBody, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/schedule/update`;
      const response = await accountManagementService.updateData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 66. Get Schedule Detail
export const getScheduleDetail = createAsyncThunk(
  "serviceRequest/getScheduleDetail",
  async (scheduleId, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/schedule/detail/${scheduleId}`;
      const response = await accountManagementService.getDetail(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 67. Get Schedules by Installment
export const getSchedulesByInstallment = createAsyncThunk(
  "serviceRequest/getSchedulesByInstallment",
  async (installmentId, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/schedule/installment/${installmentId}`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 68. Get Schedules by Payment Status
export const getSchedulesByPaymentStatus = createAsyncThunk(
  "serviceRequest/getSchedulesByPaymentStatus",
  async (paymentStatus, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/schedule/status/${paymentStatus}`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 69. Record Payment for Schedule
export const recordPaymentForSchedule = createAsyncThunk(
  "serviceRequest/recordPaymentForSchedule",
  async ({ scheduleId, requestBody }, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/schedule/payment/${scheduleId}`;
      const response = await accountManagementService.updateData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 70. Toggle Schedule Status
export const toggleScheduleStatus = createAsyncThunk(
  "serviceRequest/toggleScheduleStatus",
  async (scheduleId, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/schedule/toggle/${scheduleId}`;
      const response = await accountManagementService.updateData(url, {});
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// Billing Item API Async Thunks

// 71. Create Billing Item
export const createBillingItem = createAsyncThunk(
  "serviceRequest/createBillingItem",
  async (requestBody, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/billingitem/create`;
      const response = await accountManagementService.createData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 72. Update Billing Item
export const updateBillingItem = createAsyncThunk(
  "serviceRequest/updateBillingItem",
  async (requestBody, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/billingitem/update`;
      const response = await accountManagementService.updateData(url, requestBody);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 73. Get Billing Item Detail
export const getBillingItemDetail = createAsyncThunk(
  "serviceRequest/getBillingItemDetail",
  async (billingItemId, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/billingitem/detail/${billingItemId}`;
      const response = await accountManagementService.getDetail(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 74. Get Billing Items by Installment
export const getBillingItemsByInstallment = createAsyncThunk(
  "serviceRequest/getBillingItemsByInstallment",
  async (installmentId, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/billingitem/installment/${installmentId}`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 75. Get Billing Items by Item Type
export const getBillingItemsByItemType = createAsyncThunk(
  "serviceRequest/getBillingItemsByItemType",
  async (itemType, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/billingitem/type/${itemType}`;
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 76. Toggle Billing Item Status
export const toggleBillingItemStatus = createAsyncThunk(
  "serviceRequest/toggleBillingItemStatus",
  async (billingItemId, thunkAPI) => {
    try {
      const url = `/v1/dbs/apiount/servicerequest/billingitem/toggle/${billingItemId}`;
      const response = await accountManagementService.updateData(url, {});
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  serviceRequests: [],
  serviceRequestDetail: null,
  prerequisites: [],
  workOrders: [],
  activities: [],
  dataRequirements: [],
  paymentPlans: [],
  installments: [],
  schedules: [],
  billingItems: [],
  dropdowns: {
    serviceRequestTypes: [],
    serviceRequestCategories: [],
    serviceRequestSubcategories: [],
    serviceRequestPriorities: [],
    serviceRequestChannels: [],
    serviceRequestSources: [],
    workOrderTypes: [],
    workOrderStatuses: [],
    prerequisiteTypes: [],
    activityStatuses: [],
  },
  loading: {
    serviceRequests: false,
    serviceRequestDetail: false,
    prerequisites: false,
    workOrders: false,
    activities: false,
    dataRequirements: false,
    paymentPlans: false,
    installments: false,
    schedules: false,
    billingItems: false,
    dropdowns: false,
  },
  errors: {
    serviceRequests: null,
    serviceRequestDetail: null,
    prerequisites: null,
    workOrders: null,
    activities: null,
    dataRequirements: null,
    paymentPlans: null,
    installments: null,
    schedules: null,
    billingItems: null,
  },
};

// Service Request Slice
const serviceRequestSlice = createSlice({
  name: 'serviceRequest',
  initialState,
  reducers: {
    clearServiceRequestDetail: (state) => {
      state.serviceRequestDetail = null;
    },
    clearPrerequisites: (state) => {
      state.prerequisites = [];
    },
    clearWorkOrders: (state) => {
      state.workOrders = [];
    },
    clearActivities: (state) => {
      state.activities = [];
    },
    clearDataRequirements: (state) => {
      state.dataRequirements = [];
    },
    clearPaymentPlans: (state) => {
      state.paymentPlans = [];
    },
    clearInstallments: (state) => {
      state.installments = [];
    },
    clearSchedules: (state) => {
      state.schedules = [];
    },
    clearBillingItems: (state) => {
      state.billingItems = [];
    },
    clearDropdowns: (state) => {
      state.dropdowns = {
        serviceRequestTypes: [],
        serviceRequestCategories: [],
        serviceRequestSubcategories: [],
        serviceRequestPriorities: [],
        serviceRequestChannels: [],
        serviceRequestSources: [],
        workOrderTypes: [],
        workOrderStatuses: [],
        prerequisiteTypes: [],
        activityStatuses: [],
      };
    },
  },
  extraReducers: (builder) => {
    // Get Filtered Service Requests
    builder
      .addCase(getFilteredServiceRequests.pending, (state) => {
        state.loading.serviceRequests = true;
        state.errors.serviceRequests = null;
      })
      .addCase(getFilteredServiceRequests.fulfilled, (state, action) => {
        state.loading.serviceRequests = false;
        state.serviceRequests = action.payload;
      })
      .addCase(getFilteredServiceRequests.rejected, (state, action) => {
        state.loading.serviceRequests = false;
        state.errors.serviceRequests = action.payload;
      });

    // Get Service Requests by Account
    builder
      .addCase(getServiceRequestsByAccount.pending, (state) => {
        state.loading.serviceRequests = true;
        state.errors.serviceRequests = null;
      })
      .addCase(getServiceRequestsByAccount.fulfilled, (state, action) => {
        state.loading.serviceRequests = false;
        state.serviceRequests = action.payload;
      })
      .addCase(getServiceRequestsByAccount.rejected, (state, action) => {
        state.loading.serviceRequests = false;
        state.errors.serviceRequests = action.payload;
      });

    // Get Service Request Detail by Account
    builder
      .addCase(getServiceRequestDetailByAccount.pending, (state) => {
        state.loading.serviceRequestDetail = true;
        state.errors.serviceRequestDetail = null;
      })
      .addCase(getServiceRequestDetailByAccount.fulfilled, (state, action) => {
        state.loading.serviceRequestDetail = false;
        state.serviceRequestDetail = action.payload;
      })
      .addCase(getServiceRequestDetailByAccount.rejected, (state, action) => {
        state.loading.serviceRequestDetail = false;
        state.errors.serviceRequestDetail = action.payload;
      });

    // Create Service Request for Account
    builder
      .addCase(createServiceRequestForAccount.fulfilled, (state, action) => {
        state.serviceRequests = state.serviceRequests ? [...state.serviceRequests, action.payload] : [action.payload];
      })
      .addCase(createServiceRequestForAccount.rejected, (state, action) => {
        state.errors.serviceRequests = action.payload;
      });

    // Update Service Request for Account
    builder
      .addCase(updateServiceRequestForAccount.fulfilled, (state, action) => {
        if (state.serviceRequestDetail && state.serviceRequestDetail.id === action.payload.id) {
          state.serviceRequestDetail = action.payload;
        }
        // Update in the list if it exists
        const index = state.serviceRequests.findIndex(sr => sr.id === action.payload.id);
        if (index !== -1) {
          state.serviceRequests[index] = action.payload;
        }
      })
      .addCase(updateServiceRequestForAccount.rejected, (state, action) => {
        state.errors.serviceRequests = action.payload;
      });

    // Delete Service Request for Account
    builder
      .addCase(deleteServiceRequestForAccount.fulfilled, (state, action) => {
        if (state.serviceRequestDetail && state.serviceRequestDetail.id === action.meta.arg.id) {
          state.serviceRequestDetail = null;
        }
        state.serviceRequests = state.serviceRequests.filter(sr => sr.id !== action.meta.arg.id);
      })
      .addCase(deleteServiceRequestForAccount.rejected, (state, action) => {
        state.errors.serviceRequests = action.payload;
      });

    // Get All Service Requests
    builder
      .addCase(getAllServiceRequests.pending, (state) => {
        state.loading.serviceRequests = true;
        state.errors.serviceRequests = null;
      })
      .addCase(getAllServiceRequests.fulfilled, (state, action) => {
        state.loading.serviceRequests = false;
        state.serviceRequests = action.payload;
      })
      .addCase(getAllServiceRequests.rejected, (state, action) => {
        state.loading.serviceRequests = false;
        state.errors.serviceRequests = action.payload;
      });

    // Service Request Dropdown Endpoints
    builder
      .addCase(getServiceRequestTypes.fulfilled, (state, action) => {
        state.dropdowns.serviceRequestTypes = action.payload;
      })
      .addCase(getServiceRequestCategories.fulfilled, (state, action) => {
        state.dropdowns.serviceRequestCategories = action.payload;
      })
      .addCase(getServiceRequestSubcategories.fulfilled, (state, action) => {
        state.dropdowns.serviceRequestSubcategories = action.payload;
      })
      .addCase(getServiceRequestPriorities.fulfilled, (state, action) => {
        state.dropdowns.serviceRequestPriorities = action.payload;
      })
      .addCase(getServiceRequestChannels.fulfilled, (state, action) => {
        state.dropdowns.serviceRequestChannels = action.payload;
      })
      .addCase(getServiceRequestSources.fulfilled, (state, action) => {
        state.dropdowns.serviceRequestSources = action.payload;
      })
      .addCase(getWorkOrderTypes.fulfilled, (state, action) => {
        state.dropdowns.workOrderTypes = action.payload;
      })
      .addCase(getWorkOrderStatuses.fulfilled, (state, action) => {
        state.dropdowns.workOrderStatuses = action.payload;
      })
      .addCase(getServiceRequestPrerequisites.fulfilled, (state, action) => {
        state.dropdowns.serviceRequestPrerequisites = action.payload;
      })
      .addCase(getServiceRequestDataRequirements.fulfilled, (state, action) => {
        state.dropdowns.serviceRequestDataRequirements = action.payload;
      })      .addCase(getActivityStatuses.fulfilled, (state, action) => {
        state.dropdowns.activityStatuses = action.payload;
      });

    // Prerequisites
    builder
      .addCase(getPrerequisitesByServiceRequest.pending, (state) => {
        state.loading.prerequisites = true;
        state.errors.prerequisites = null;
      })
      .addCase(getPrerequisitesByServiceRequest.fulfilled, (state, action) => {
        state.loading.prerequisites = false;
        state.prerequisites = action.payload;
      })
      .addCase(getPrerequisitesByServiceRequest.rejected, (state, action) => {
        state.loading.prerequisites = false;
        state.errors.prerequisites = action.payload;
      });

    // Work Orders
    builder
      .addCase(getWorkOrdersByServiceRequest.pending, (state) => {
        state.loading.workOrders = true;
        state.errors.workOrders = null;
      })
      .addCase(getWorkOrdersByServiceRequest.fulfilled, (state, action) => {
        state.loading.workOrders = false;
        state.workOrders = action.payload;
      })
      .addCase(getWorkOrdersByServiceRequest.rejected, (state, action) => {
        state.loading.workOrders = false;
        state.errors.workOrders = action.payload;
      });

    // Activities
    builder
      .addCase(getActivitiesByWorkOrder.pending, (state) => {
        state.loading.activities = true;
        state.errors.activities = null;
      })
      .addCase(getActivitiesByWorkOrder.fulfilled, (state, action) => {
        state.loading.activities = false;
        state.activities = action.payload;
      })
      .addCase(getActivitiesByWorkOrder.rejected, (state, action) => {
        state.loading.activities = false;
        state.errors.activities = action.payload;
      });

    // Data Requirements
    builder
      .addCase(getDataRequirementsByServiceRequest.pending, (state) => {
        state.loading.dataRequirements = true;
        state.errors.dataRequirements = null;
      })
      .addCase(getDataRequirementsByServiceRequest.fulfilled, (state, action) => {
        state.loading.dataRequirements = false;
        state.dataRequirements = action.payload;
      })
      .addCase(getDataRequirementsByServiceRequest.rejected, (state, action) => {
        state.loading.dataRequirements = false;
        state.errors.dataRequirements = action.payload;
      });

    // Payment Plans
    builder
      .addCase(getPaymentPlansByInstallment.pending, (state) => {
        state.loading.paymentPlans = true;
        state.errors.paymentPlans = null;
      })
      .addCase(getPaymentPlansByInstallment.fulfilled, (state, action) => {
        state.loading.paymentPlans = false;
        state.paymentPlans = action.payload;
      })
      .addCase(getPaymentPlansByInstallment.rejected, (state, action) => {
        state.loading.paymentPlans = false;
        state.errors.paymentPlans = action.payload;
      });

    // Installments
    builder
      .addCase(getInstallmentDetail.pending, (state) => {
        state.loading.installments = true;
        state.errors.installments = null;
      })
      .addCase(getInstallmentDetail.fulfilled, (state, action) => {
        state.loading.installments = false;
        state.installments = Array.isArray(action.payload) ? action.payload : [action.payload];
      })
      .addCase(getInstallmentDetail.rejected, (state, action) => {
        state.loading.installments = false;
        state.errors.installments = action.payload;
      });

    // Schedules
    builder
      .addCase(getSchedulesByInstallment.pending, (state) => {
        state.loading.schedules = true;
        state.errors.schedules = null;
      })
      .addCase(getSchedulesByInstallment.fulfilled, (state, action) => {
        state.loading.schedules = false;
        state.schedules = action.payload;
      })
      .addCase(getSchedulesByInstallment.rejected, (state, action) => {
        state.loading.schedules = false;
        state.errors.schedules = action.payload;
      });

    // Billing Items
    builder
      .addCase(getBillingItemsByInstallment.pending, (state) => {
        state.loading.billingItems = true;
        state.errors.billingItems = null;
      })
      .addCase(getBillingItemsByInstallment.fulfilled, (state, action) => {
        state.loading.billingItems = false;
        state.billingItems = action.payload;
      })
      .addCase(getBillingItemsByInstallment.rejected, (state, action) => {
        state.loading.billingItems = false;
        state.errors.billingItems = action.payload;
      });
  },
});

export const {
  clearServiceRequestDetail,
  clearPrerequisites,
  clearWorkOrders,
  clearActivities,
  clearDataRequirements,
  clearPaymentPlans,
  clearInstallments,
  clearSchedules,
  clearBillingItems,
  clearDropdowns,
} = serviceRequestSlice.actions;

export default serviceRequestSlice.reducer;
