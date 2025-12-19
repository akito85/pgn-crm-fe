import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  showModalError,
  showModalSuccess,
  setBodyError,
  validateError,
} from "../../general_slice";
import ratingBillingHttpService from "../../../services/ratingBillingHttpService";

const initialState = {
  data: {
    result: [],
    page: {
      totalElements: 0,
      totalPages: 0,
      size: 10,
      number: 0,
    },
  },
  data_format: [],
  data_category: [],
  data_media: [],
  data_billing_item: [],
  dataListCategory: [],
  data_currency: [],
  data_priority_period: [],
  data_criteria: [],
  data_industrial_sector: [],
  data_Gsizes: [],
  data_cost_center: [],
  data_sor: [],
  data_customer_segment: [],
  data_account_group: [],
  data_account_category: [],
  data_province: [],
  data_city: [],
  data_district: [],
  data_sub_district: [],
  data_service_type: [],
  data_budget: [],
  data_customer: [],
  data_detail: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  data_AttachmentTable: [],
  data_AttachmentDetail: [],
  data_approval_history: [],
  data_detail_draft: [],
  isFailed: false,
  isSuccess: false,
  message: "",
  loading: false,
};

// Get Detail Draft Content Management
export const getDetailDraftContentManagement = createAsyncThunk(
  "GET_DETAIL_DRAFT_CONTENT_MANAGEMENT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/content/detail-draft/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getAllContentManagementPaginate = createAsyncThunk(
  "GET_ALL_CONTENT_MANAGEMENT_PAGINATE",
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    const searchParams = search === undefined ? "" : search;
    const sortParams =
      sort === undefined || sort === "" ? "createdDate~desc" : sort;
    try {
      const url = `/v1/dbs/api/content?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

// Get List Format
export const getListFormat = createAsyncThunk(
  "GET_LIST_FORMAT",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/content/list-format`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// Get List Category
export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/content/list-category`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// Get List Media
export const getListMedia = createAsyncThunk(
  "GET_LIST_MEDIA",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/content/list-media`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getListCurrency = createAsyncThunk(
  "GET_LIST_CURRENCY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-currency`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getCriteria = createAsyncThunk(
  "GET_CRITERIA",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/billing-bucket/list-criteria";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getIndustrialSector = createAsyncThunk(
  "GET_INDUSTRIAL_SECTOR",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-industrial-sector`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getGsizes = createAsyncThunk("GET_GSIZES", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/rbi/billing-bucket/list-g-size`;
    const response = await ratingBillingHttpService.getAll(url);
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || error?.message || error?.toString();
    if (
      error?.response?.data?.code === 500 ||
      error?.response?.data?.code === 419
    ) {
      thunkAPI.dispatch(setBodyError(error));
    } else {
      const errorBody = {
        title: "Failed",
        description: `${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
    }
  }
});

export const getCostCenter = createAsyncThunk(
  "GET_COST_CENTER",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-cost-center`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getSor = createAsyncThunk("GET_SOR", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/rbi/billing-bucket/list-sor`;
    const response = await ratingBillingHttpService.getAll(url);
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || error?.message || error?.toString();
    if (
      error?.response?.data?.code === 500 ||
      error?.response?.data?.code === 419
    ) {
      thunkAPI.dispatch(setBodyError(error));
    } else {
      const errorBody = {
        title: "Failed",
        description: `${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
    }
  }
});

export const getCustomerSegment = createAsyncThunk(
  "GET_CUSTOMER_SEGMENT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-customer-segment`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const updateContentManagement = createAsyncThunk(
  "UPDATE_CONTENT_MANAGEMENT",
  async ({ body, id }, thunkApi) => {
    try {
      const url = `/v1/dbs/api/content/update/${id || body.id}`;
      const response = await ratingBillingHttpService.updateData(url, body);
      const successMessage = {
        title: "Successful",
        description: `Your data has been ${
          body.type === "DRAFT" ? "updated" : "submitted"
        }.`,
      };
      thunkApi.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (response) {
      const message =
        (response.response &&
          response.response.data &&
          response.response.data.message) ||
        response.message ||
        response.toString();
      if (Math.floor((response.response.data.code || 0) / 100) === 4) {
        if (response.response.data.code === 419) {
          thunkApi.dispatch(setBodyError(response));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${
              body.type === "DRAFT" ? "updated" : "submitted"
            }. ${message}.`,
          };
          thunkApi.dispatch(showModalError(errorBody));
        }
        return thunkApi.rejectWithValue(response.response.data);
      }
    }
  }
);

export const getAccountGroup = createAsyncThunk(
  "GET_ACCOUNT_GROUP",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-account-group-type/${id}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getAccountCategory = createAsyncThunk(
  "GET_ACCOUNT_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-account-category`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getProvince = createAsyncThunk(
  "GET_PROVINCE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-province`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getCity = createAsyncThunk("GET_CITY", async (id, thunkAPI) => {
  try {
    const url = `/v1/dbs/api/rbi/billing-bucket/list-city/${id}`;
    const response = await ratingBillingHttpService.getDetail(url);
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || error?.message || error?.toString();
    if (
      error?.response?.data?.code === 500 ||
      error?.response?.data?.code === 419
    ) {
      thunkAPI.dispatch(setBodyError(error));
    } else {
      const errorBody = {
        title: "Failed",
        description: `${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
    }
  }
});

export const getDistrict = createAsyncThunk(
  "GET_DISTRICT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-district/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getSubDistrict = createAsyncThunk(
  "GET_SUB_DISTRICT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-sub-district/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getServiceType = createAsyncThunk(
  "GET_SERVICE_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-service-type`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getBudget = createAsyncThunk("GET_BUDGET", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/rbi/billing-bucket/list-budget`;
    const response = await ratingBillingHttpService.getAll(url);
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || error?.message || error?.toString();
    if (
      error?.response?.data?.code === 500 ||
      error?.response?.data?.code === 419
    ) {
      thunkAPI.dispatch(setBodyError(error));
    } else {
      const errorBody = {
        title: "Failed",
        description: `${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
    }
  }
});

export const getCustomer = createAsyncThunk(
  "GET_CUSTOMER",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-customer`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getDetailContentManagement = createAsyncThunk(
  "GET_DETAIL_CONTENT_MANAGEMENT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/content/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getDetailDraftBillingBucket = createAsyncThunk(
  "GET_DETAIL_DRAFT_BILLING_BUCKET",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/detail-draft/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getAvailableApproval = createAsyncThunk(
  "GET_AVAILABLE_APPROVAL",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/content/approval-hierarchy-list`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getSelectedApproval = createAsyncThunk(
  "GET_SELECTED_APPROVAL",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-selected-approval/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getAttachmentCategory = createAsyncThunk(
  "GET_ATTACHMENT_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-attachment-category`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.map((item) => ({
        Id: item.id,
        text: item.text,
      }));
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

// Get Approval History
export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/content/approval-history/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getListApprovalHierarchy = createAsyncThunk(
  "GET_LIST_APPROVAL_HIERARCHY_BILLING_BUCKET",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/content/approval-hierarchy-list";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getListApprovalHierarchyDetail = createAsyncThunk(
  "GET_LIST_APPROVAL_HIERARCHY_DETAIL_BILLING_BUCKET",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-selected-approval/${id}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const inactiveContentManagement = createAsyncThunk(
  "INACTIVE_CONTENT_MANAGEMENT",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/content/inactive`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body
      );
      const successBody = {
        title: "Successful",
        description: "Your data has been submitted.",
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
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not submitted. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  }
);

// Approve or Reject Content Management
export const approveRejectContentManagement = createAsyncThunk(
  "APPROVE_REJECT_CONTENT_MANAGEMENT",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/content/approve`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body
      );
      const successApprove = {
        title: `Successful`,
        description: `Your data has been ${
          body.action === "APPROVE" ? "approved" : "rejected"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successApprove));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${
              body.action === "APPROVE" ? "approved" : "rejected"
            }. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Approve or Reject Inactive Content Management
export const approveRejectInactiveContentManagement = createAsyncThunk(
  "APPROVE_REJECT_INACTIVE_CONTENT_MANAGEMENT",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/content/approve-inactive";
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body
      );
      const successMessage = {
        title: `Successful`,
        description: `Inactive request has been ${
          body.action === "APPROVE" ? "approved" : "rejected"
        } successfully.`,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Inactive request failed. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const createContentManagement = createAsyncThunk(
  "CREATE_CONTENT_MANAGEMENT",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/content/create";
      const response = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.type === "DRAFT" ? "created" : "submitted"
        }.`,
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
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${
              body.type === "DRAFT" ? "created" : "submitted"
            }. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  }
);

const contentManagementSlice = createSlice({
  name: "content_management",
  initialState,
  extraReducers: {
    // get all content management
    [getAllContentManagementPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllContentManagementPaginate.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getAllContentManagementPaginate.rejected]: (state) => {
      state.loading = false;
    },

    // Get List Format
    [getListFormat.pending]: (state) => {
      state.loading = true;
    },
    [getListFormat.fulfilled]: (state, action) => {
      state.data_format = action.payload;
      state.loading = false;
    },
    [getListFormat.rejected]: (state) => {
      state.loading = false;
    },

    // Get List Category
    [getListCategory.pending]: (state) => {
      state.loading = true;
    },
    [getListCategory.fulfilled]: (state, action) => {
      state.data_category = action.payload;
      state.loading = false;
    },
    [getListCategory.rejected]: (state) => {
      state.loading = false;
    },

    // Get List Media
    [getListMedia.pending]: (state) => {
      state.loading = true;
    },
    [getListMedia.fulfilled]: (state, action) => {
      state.data_media = action.payload;
      state.loading = false;
    },
    [getListMedia.rejected]: (state) => {
      state.loading = false;
    },

    // create
    [createContentManagement.pending]: (state) => {
      state.loading = true;
    },
    [createContentManagement.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [createContentManagement.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    // get list currency
    [getListCurrency.pending]: (state, action) => {
      state.loading = true;
      state.data_currency = action.payload;
    },
    [getListCurrency.fulfilled]: (state, action) => {
      state.data_currency = action.payload;
      state.loading = false;
    },
    [getListCurrency.rejected]: (state, action) => {
      state.data_currency = action.payload;
      state.loading = false;
    },
    // update content management
    [updateContentManagement.pending]: (state) => {
      state.loading = true;
    },
    [updateContentManagement.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [updateContentManagement.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },
    // get criteria
    [getCriteria.pending]: (state, action) => {
      state.loading = true;
      state.data_criteria = action.payload;
    },
    [getCriteria.fulfilled]: (state, action) => {
      state.data_criteria = action.payload;
      state.loading = false;
    },
    [getCriteria.rejected]: (state, action) => {
      state.data_criteria = action.payload;
      state.loading = false;
    },
    // get industrial sector
    [getIndustrialSector.pending]: (state, action) => {
      state.loading = true;
      state.data_industrial_sector = action.payload;
    },
    [getIndustrialSector.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_industrial_sector = action.payload;
    },
    [getIndustrialSector.rejected]: (state, action) => {
      state.loading = false;
      state.data_industrial_sector = action.payload;
    },
    // get g sizes
    [getGsizes.pending]: (state, action) => {
      state.loading = true;
      state.data_Gsizes = action.payload;
    },
    [getGsizes.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_Gsizes = action.payload;
    },
    [getGsizes.rejected]: (state, action) => {
      state.loading = false;
      state.data_Gsizes = action.payload;
    },
    // get cost center
    [getCostCenter.pending]: (state, action) => {
      state.loading = true;
      state.data_cost_center = action.payload;
    },
    [getCostCenter.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_cost_center = action.payload;
    },
    [getCostCenter.rejected]: (state, action) => {
      state.loading = false;
      state.data_cost_center = action.payload;
    },
    // get sor
    [getSor.pending]: (state, action) => {
      state.loading = true;
      state.data_sor = action.payload;
    },
    [getSor.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_sor = action.payload;
    },
    [getSor.rejected]: (state, action) => {
      state.loading = false;
      state.data_sor = action.payload;
    },
    // get customer segment
    [getCustomerSegment.pending]: (state, action) => {
      state.loading = true;
      state.data_customer_segment = action.payload;
    },
    [getCustomerSegment.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_customer_segment = action.payload;
    },
    [getCustomerSegment.rejected]: (state, action) => {
      state.loading = false;
      state.data_customer_segment = action.payload;
    },
    // get account group
    [getAccountGroup.pending]: (state, action) => {
      state.loading = true;
      state.data_account_group = action.payload;
    },
    [getAccountGroup.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_account_group = action.payload;
    },
    [getAccountGroup.rejected]: (state, action) => {
      state.loading = false;
      state.data_account_group = action.payload;
    },
    // get account category
    [getAccountCategory.pending]: (state, action) => {
      state.loading = true;
      state.data_account_Category = action.payload;
    },
    [getAccountCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_account_Category = action.payload;
    },
    [getAccountCategory.rejected]: (state, action) => {
      state.loading = false;
      state.data_account_Category = action.payload;
    },
    // get province
    [getProvince.pending]: (state, action) => {
      state.loading = true;
      state.data_province = action.payload;
    },
    [getProvince.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_province = action.payload;
    },
    [getProvince.rejected]: (state, action) => {
      state.loading = false;
      state.data_province = action.payload;
    },
    // get city
    [getCity.pending]: (state, action) => {
      state.loading = true;
      state.data_city = action.payload;
    },
    [getCity.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_city = action.payload;
    },
    [getCity.rejected]: (state, action) => {
      state.loading = false;
      state.data_city = action.payload;
    },
    // get district
    [getDistrict.pending]: (state, action) => {
      state.loading = true;
      state.data_district = action.payload;
    },
    [getDistrict.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_district = action.payload;
    },
    [getDistrict.rejected]: (state, action) => {
      state.loading = false;
      state.data_district = action.payload;
    },
    // get sub district
    [getSubDistrict.pending]: (state, action) => {
      state.loading = true;
      state.data_sub_district = action.payload;
    },
    [getSubDistrict.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_sub_district = action.payload;
    },
    [getSubDistrict.rejected]: (state, action) => {
      state.loading = false;
      state.data_sub_district = action.payload;
    },
    // get service type
    [getServiceType.pending]: (state, action) => {
      state.loading = true;
      state.data_service_type = action.payload;
    },
    [getServiceType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_service_type = action.payload;
    },
    [getServiceType.rejected]: (state, action) => {
      state.loading = false;
      state.data_service_type = action.payload;
    },
    // get budget
    [getBudget.pending]: (state, action) => {
      state.loading = true;
      state.data_budget = action.payload;
    },
    [getBudget.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_budget = action.payload;
    },
    [getBudget.rejected]: (state, action) => {
      state.loading = false;
      state.data_budget = action.payload;
    },
    // get customer
    [getCustomer.pending]: (state, action) => {
      state.loading = true;
      state.data_customer = action.payload;
    },
    [getCustomer.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_customer = action.payload;
    },
    [getCustomer.rejected]: (state, action) => {
      state.loading = false;
      state.data_customer = action.payload;
    },
    // get available approval
    [getAvailableApproval.pending]: (state) => {
      state.loading = true;
    },
    [getAvailableApproval.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListAppHierId = action.payload;
    },
    [getAvailableApproval.rejected]: (state) => {
      state.loading = false;
    },
    // get selected approval
    [getSelectedApproval.pending]: (state) => {
      state.loading = true;
    },
    [getSelectedApproval.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListAppHierDetail = action.payload;
    },
    [getSelectedApproval.rejected]: (state) => {
      state.loading = false;
    },
    // get attachment category
    [getAttachmentCategory.pending]: (state) => {
      state.loading = true;
    },
    [getAttachmentCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListCategory = action.payload;
    },
    [getAttachmentCategory.rejected]: (state) => {
      state.loading = false;
    },
    // get approval history
    [getApprovalHistory.pending]: (state, action) => {
      state.loading = true;
      state.data_approval_history = action.payload;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.data_approval_history = action.payload;
      state.loading = false;
    },
    [getApprovalHistory.rejected]: (state, action) => {
      state.data_approval_history = action.payload;
      state.loading = false;
    },
    // get list approval hierarchy
    [getListApprovalHierarchy.pending]: (state, action) => {
      state.loading = true;
      state.dataListAppHierId = action.payload;
    },
    [getListApprovalHierarchy.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListAppHierId = action.payload;
    },
    [getListApprovalHierarchy.rejected]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    // get list approval hierarchy detail
    [getListApprovalHierarchyDetail.pending]: (state, action) => {
      state.loading = true;
      state.dataListAppHierDetail = action.payload;
    },
    [getListApprovalHierarchyDetail.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },
    [getListApprovalHierarchyDetail.rejected]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },
    // inactive content management
    [inactiveContentManagement.pending]: (state) => {
      state.loading = true;
    },
    [inactiveContentManagement.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveContentManagement.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },
    // get detail content management
    [getDetailContentManagement.pending]: (state, action) => {
      state.loading = true;
      state.data_detail = action.payload;
    },
    [getDetailContentManagement.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailContentManagement.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    // get detail bagian draft
    [getDetailDraftBillingBucket.pending]: (state, action) => {
      state.loading = true;
      state.data_detail_draft = action.payload;
    },
    [getDetailDraftBillingBucket.fulfilled]: (state, action) => {
      state.data_detail_draft = action.payload;
      state.loading = false;
    },
    [getDetailDraftBillingBucket.rejected]: (state, action) => {
      state.data_detail_draft = action.payload;
      state.loading = false;
    },
    // approve reject content management
    [approveRejectContentManagement.pending]: (state) => {
      state.loading = true;
    },
    [approveRejectContentManagement.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveRejectContentManagement.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },
    // approve reject inactive content management
    [approveRejectInactiveContentManagement.pending]: (state) => {
      state.loading = true;
    },
    [approveRejectInactiveContentManagement.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveRejectInactiveContentManagement.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },
    // Get Detail Draft Content Management
    [getDetailDraftContentManagement.pending]: (state) => {
      state.loading = true;
    },
    [getDetailDraftContentManagement.fulfilled]: (state, action) => {
      state.data_detail_draft = action.payload;
      state.loading = false;
    },
    [getDetailDraftContentManagement.rejected]: (state) => {
      state.loading = false;
    },
  },
});

const { reducer } = contentManagementSlice;
export default reducer;
