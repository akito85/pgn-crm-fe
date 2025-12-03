import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  showModalError,
  showModalSuccess,
  setBodyError,
  validateError,
} from "../../general_slice";
import ratingBillingHttpService from "../../../services/ratingBillingHttpService";

const initialState = {
  data: [],
  data_billing_item: [],
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

export const getAllBillingBucketPaginate = createAsyncThunk(
  "GET_ALL_BILLING_BUCKET_PAGINATE",
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    const searchParams = search === undefined ? "" : search;
    const sortParams =
      sort === undefined || sort === "" ? "createdDate~desc" : sort;
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/paging-billing-bucket?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
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
  },
);

export const getListBillingItem = createAsyncThunk(
  "GET_LIST_BILLING_ITEM",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/get-billing-item`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data.result;
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
  },
);

export const getListPriorityPeriod = createAsyncThunk(
  "GET_LIST_PRIORITY_PERIOD",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/priority-period`;
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
);

export const getDetailBillingBucket = createAsyncThunk(
  "GET_DETAIL_BILLING_BUCKET",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/detail/${id}`;
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
  },
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
  },
);

export const getAvailableApproval = createAsyncThunk(
  "GET_AVAILABLE_APPROVAL",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-available-hierarchy`;
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
  },
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
  },
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
  },
);

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/approval-history/${id}`;
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
  },
);

export const getListApprovalHierarchy = createAsyncThunk(
  "GET_LIST_APPROVAL_HIERARCHY_BILLING_BUCKET",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/billing-bucket/list-available-hierarchy";
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
  },
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
  },
);

export const inactiveBillingBucket = createAsyncThunk(
  "INACTIVE_BILLING_BUCKET",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/inactive-billing-bucket`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
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
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
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
  },
);

export const approveRejectBillingBucket = createAsyncThunk(
  "APPROVE_REJECT_BILLING_BUCKET",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/approval-billing-bucket`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
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
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
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
        return thunkAPI.rejectWithValue(error);
      }
    }
  },
);

export const approveRejectInactiveBillingBucket = createAsyncThunk(
  "APPROVE_REJECT_INACTIVE_BILLING_BUCKET",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/billing-bucket/approval-inactive";
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
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
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
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
        return thunkAPI.rejectWithValue(error);
      }
    }
  },
);

export const updateBillingBucket = createAsyncThunk(
  "UPDATE_BILLING_BUCKET",
  async ({ body }, thunkApi) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/update`;
      const response = await ratingBillingHttpService.updateData(url, body);
      const successMessage = {
        title: "Successful",
        description: `Your data has been ${
          body.isSubmit === false ? "updated" : "submitted"
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
              body.isSubmit === false ? "updated" : "submitted"
            }. ${message}.`,
          };
          thunkApi.dispatch(showModalError(errorBody));
        }
        return thunkApi.rejectWithValue(response.response.data);
      }
    }
  },
);

export const downloadBillingBucket = createAsyncThunk(
  "DOWNLOAD_BILLING_BUCKET",
  async ({ sort, page, pageSize, search }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rbi/billing-bucket/download-list?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_BILLING_BUCKET",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const createBillingBucket = createAsyncThunk(
  "CREATE_BILLING_BUCKET",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/billing-bucket/create-billing-bucket";
      const response = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.isSubmit === false ? "created" : "submitted"
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
              body.isSubmit === false ? "created" : "submitted"
            }. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  },
);

const billingBucketSlice = createSlice({
  name: "billing_bucket",
  initialState,
  extraReducers: {
    // get all
    [getAllBillingBucketPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllBillingBucketPaginate.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getAllBillingBucketPaginate.rejected]: (state) => {
      state.loading = true;
    },
    // get list billing item
    [getListBillingItem.pending]: (state) => {
      state.loading = true;
      // state.data_billing_item = action.payload;
    },
    [getListBillingItem.fulfilled]: (state, action) => {
      state.data_billing_item = action.payload;
      state.loading = false;
    },
    [getListBillingItem.rejected]: (state) => {
      // state.data_billing_item = action.payload;
      state.loading = false;
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
    // get priority period
    [getListPriorityPeriod.pending]: (state, action) => {
      state.loading = true;
      state.data_priority_period = action.payload;
    },
    [getListPriorityPeriod.fulfilled]: (state, action) => {
      state.data_priority_period = action.payload;
      state.loading = false;
    },
    [getListPriorityPeriod.rejected]: (state, action) => {
      state.data_priority_period = action.payload;
      state.loading = false;
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
    // get detail
    [getDetailBillingBucket.pending]: (state, action) => {
      state.loading = true;
      state.data_detail = action.payload;
    },
    [getDetailBillingBucket.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailBillingBucket.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
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
    // inactive billing bucket
    [inactiveBillingBucket.pending]: (state) => {
      state.loading = true;
    },
    [inactiveBillingBucket.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveBillingBucket.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },
    // get detail bagian detail
    [getDetailBillingBucket.pending]: (state, action) => {
      state.loading = true;
      state.data_detail = action.payload;
    },
    [getDetailBillingBucket.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailBillingBucket.rejected]: (state, action) => {
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
    // approve reject billing bucket
    [approveRejectBillingBucket.pending]: (state) => {
      state.loading = true;
    },
    [approveRejectBillingBucket.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveRejectBillingBucket.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },
    // approve reject inactive billing bucket
    [approveRejectInactiveBillingBucket.pending]: (state) => {
      state.loading = true;
    },
    [approveRejectInactiveBillingBucket.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveRejectInactiveBillingBucket.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },
  },
});

const { reducer } = billingBucketSlice;
export default reducer;
