import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  showModalError,
  showModalSuccess,
  setBodyError,
  validateError,
} from "../../general_slice";
import ratingBillingHttpService from "../../../services/ratingBillingHttpService";

const initialState = {
  data: [],
  data_list: [],
  data_pagination: null,
  dataForm: [],
  data_detail: [],
  data_approval_history: [],
  data_detail_draft: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataListCategory: [],
  data_invoiceType: [],
  data_meterai: [],
  data_signature: [],
  data_template: [],
  data_criteria: [],
  data_budget: [],
  data_province: [],
  data_city: [],
  data_industrial_sector: [],
  data_district: [],
  data_sub_district: [],
  data_account_Category: [],
  data_service_type: [],
  data_account_group: [],
  data_sor: [],
  data_cost_center: [],
  data_Gsizes: [],
  data_product: [],
  data_customerSegment: [],
  data_customer: [],
  loading: false,
  message: "",
};

export const createInvoiceTemplate = createAsyncThunk(
  "CREATE_INVOICE_TEMPLATE",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-template/create";
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
      if (error?.data?.code === 500 || error?.data?.code === 419) {
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
);

export const updateInvoiceTemplate = createAsyncThunk(
  "UPDATE_INVOICE_TEMPLATE",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-template/update";
      const response = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.isSubmit === false ? "updated" : "submitted"
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
      if (error?.data?.code === 500 || error?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${
            body.isSubmit === false ? "updated" : "submitted"
          }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getInvoiceTemplatePaginate = createAsyncThunk(
  "GET_INVOICE_TEMPLATE_PAGINATE",
  async ({ search, page, pageSize, sort, isLoadMore = false }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/invoice-template/get-list?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return { ...response.data, isLoadMore };
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

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-template/approval-history-get/${id}`;
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

export const inactiveInvoiceTemplate = createAsyncThunk(
  "INACTIVE_INVOICE_TEMPLATE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-template/inactive`;
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
      if (error?.data?.code === 500 || error?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not submitted. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const approveOrRejectInvoiceTemplate = createAsyncThunk(
  "APPROVE_OR_REJECT_INVOICE_TEMPLATE",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-template/approve-reject";
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
      if (error?.data?.code === 500 || error?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${
            body.action === "APPROVE" ? "approved" : "rejected"
          }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const approveOrRejectInactiveInvoiceTemplate = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_INVOICE_TEMPLATE",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-template/approve-inactive";
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
      if (error?.data?.code === 500 || error?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${
            body.action === "APPROVE" ? "approved" : "rejected"
          }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const downloadInvoiceTemplate = createAsyncThunk(
  "DOWNLOAD_INVOICE_TEMPLATE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/invoice-template/download-filter?page=${page}&size=${pageSize}&search=${searchParams}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_INVOICE_TEMPLATE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const previewInvoiceTemplate = createAsyncThunk(
  "PREVIEW_INVOICE_TEMPLATE",
  async ({ id, extension, filename }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-template/preview-template/${id}`;
      const response = await ratingBillingHttpService.downloadRtfFile(
        url,
        extension,
        filename
      );
      return response.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getDetailInvoiceTemplate = createAsyncThunk(
  "GET_DETAIL_INVOICE_TEMPLATE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-template/detail-get/${id}`;
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

export const getDetailDraftInvoiceTemplate = createAsyncThunk(
  "GET_DETAIL_DRAFT_INVOICE_TEMPLATE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-template/draft-detail-get/${id}`;
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

export const getInvoiceType = createAsyncThunk(
  "GET_INVOICE_TYPE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-template/invoice-type/get";
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

export const getMeterai = createAsyncThunk("GET_METERAI", async (thunkAPI) => {
  try {
    const url = "/v1/dbs/api/invoice-template/meterai-get";
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

export const getSignature = createAsyncThunk(
  "GET_SIGNATURE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-template/signature-get";
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

export const getTemplate = createAsyncThunk(
  "GET_TEMPLATE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-template/general-template/get";
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
      const url = "/v1/dbs/api/invoice-template/get-criteria";
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

export const getListApprovalHierarchy = createAsyncThunk(
  "GET_LIST_APPROVAL_HIERARCHY_INVOICE_TEMPLATE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-template/approval-hierarchies-get";
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
  "GET_LIST_APPROVAL_HIERARCHY_DETAIL_INVOICE_TEMPLATE",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-template/approval-hierarchies-detail/${id}`;
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

export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-template/category-attachment-get";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.map((item) => ({
        Id: item.id,
        text: item.name,
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

// API GET CRITERIA
export const getBudget = createAsyncThunk("GET_BUDGET", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/invoice-template/get-budget`;
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

export const getSubDistrict = createAsyncThunk(
  "GET_SUB_DISTRICT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-template/sub-district/${id}`;
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

export const getDistrict = createAsyncThunk(
  "GET_DISTRICT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-template/district/${id}`;
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

export const getCity = createAsyncThunk("GET_CITY", async (id, thunkAPI) => {
  try {
    const url = `/v1/dbs/api/invoice-template/city/${id}`;
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

export const getProvince = createAsyncThunk(
  "GET_PROVINCE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-template/province`;
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

export const getCostCenter = createAsyncThunk(
  "GET_COST_CENTER",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-template/area`;
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
    const url = `/v1/dbs/api/invoice-template/get-sor`;
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

export const getIndustrialSector = createAsyncThunk(
  "GET_INDUSTRIAL_SECTOR",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-template/get-industrial-sector`;
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
    const url = `/v1/dbs/api/invoice-template/get-gsizes`;
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
      const url = `/v1/dbs/api/invoice-template/get-customer-segment`;
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

export const getAccountGroup = createAsyncThunk(
  "GET_ACCOUNT_GROUP",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-template/get-account-group/${id}`;
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
      const url = `/v1/dbs/api/invoice-template/get-account-category`;
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

export const getServiceType = createAsyncThunk(
  "GET_SERVICE_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-template/get-service-type`;
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

export const getCustomer = createAsyncThunk(
  "GET_CUSTOMER",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-template/get-customer`;
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

const invoiceTemplateSlice = createSlice({
  name: "invoice_template",
  initialState,
  reducers: {
    resetInvoiceTemplateList: (state) => {
      state.data_list = [];
      state.data_pagination = null;
    },
  },
  extraReducers: {
    // Create Invoice Template
    [createInvoiceTemplate.pending]: (state) => {
      state.loading = true;
    },
    [createInvoiceTemplate.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataForm = action.payload;
    },
    [createInvoiceTemplate.rejected]: (state) => {
      state.loading = false;
    },

    // Create Invoice Template
    [updateInvoiceTemplate.pending]: (state) => {
      state.loading = true;
    },
    [updateInvoiceTemplate.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataForm = action.payload;
    },
    [updateInvoiceTemplate.rejected]: (state) => {
      state.loading = false;
    },

    // Inactive Pricing Rule
    [inactiveInvoiceTemplate.pending]: (state) => {
      state.loading = true;
    },
    [inactiveInvoiceTemplate.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveInvoiceTemplate.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    // Approve Or Reject Pricing Rule
    [approveOrRejectInvoiceTemplate.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectInvoiceTemplate.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveOrRejectInvoiceTemplate.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    // Approve Or Reject Inactive Pricing Rule
    [approveOrRejectInactiveInvoiceTemplate.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectInactiveInvoiceTemplate.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveOrRejectInactiveInvoiceTemplate.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    // get pagination calculation
    [getInvoiceTemplatePaginate.pending]: (state) => {
      state.loading = true;
    },
    [getInvoiceTemplatePaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      const newResults = action.payload?.result || [];
      if (action.payload?.isLoadMore) {
        state.data_list = [...state.data_list, ...newResults];
      } else {
        state.data_list = newResults;
      }
      state.data_pagination = action.payload?.page || null;
    },
    [getInvoiceTemplatePaginate.rejected]: (state) => {
      state.loading = false;
    },

    /* Download Invoice Template */
    [downloadInvoiceTemplate.pending]: (state) => {
      state.loading = true;
    },
    [downloadInvoiceTemplate.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadInvoiceTemplate.rejected]: (state) => {
      state.loading = false;
    },

    /* Preview Invoice Template */
    [previewInvoiceTemplate.pending]: (state) => {
      state.loading = true;
    },
    [previewInvoiceTemplate.fulfilled]: (state) => {
      state.loading = false;
    },
    [previewInvoiceTemplate.rejected]: (state) => {
      state.loading = false;
    },

    // Get Detail Detail
    [getDetailInvoiceTemplate.pending]: (state, action) => {
      state.loading = true;
      state.data_detail = action.payload;
    },
    [getDetailInvoiceTemplate.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailInvoiceTemplate.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },

    // Get Detail Draft
    [getDetailDraftInvoiceTemplate.pending]: (state, action) => {
      state.loading = true;
      state.data_detail_draft = action.payload;
    },
    [getDetailDraftInvoiceTemplate.fulfilled]: (state, action) => {
      state.data_detail_draft = action.payload;
      state.loading = false;
    },
    [getDetailDraftInvoiceTemplate.rejected]: (state, action) => {
      state.data_detail_draft = action.payload;
      state.loading = false;
    },

    /* Get Invoice Type */
    [getInvoiceType.pending]: (state, action) => {
      state.loading = true;
      state.data_invoiceType = action.payload;
    },
    [getInvoiceType.fulfilled]: (state, action) => {
      state.data_invoiceType = action.payload;
      state.loading = false;
    },
    [getInvoiceType.rejected]: (state, action) => {
      state.data_invoiceType = action.payload;
      state.loading = false;
    },

    /* Get Meterai */
    [getMeterai.pending]: (state, action) => {
      state.loading = true;
      state.data_meterai = action.payload;
    },
    [getMeterai.fulfilled]: (state, action) => {
      state.data_meterai = action.payload;
      state.loading = false;
    },
    [getMeterai.rejected]: (state, action) => {
      state.data_meterai = action.payload;
      state.loading = false;
    },

    /* Get Signature */
    [getSignature.pending]: (state, action) => {
      state.loading = true;
      state.data_signature = action.payload;
    },
    [getSignature.fulfilled]: (state, action) => {
      state.data_signature = action.payload;
      state.loading = false;
    },
    [getSignature.rejected]: (state, action) => {
      state.data_signature = action.payload;
      state.loading = false;
    },

    /* Get Template */
    [getTemplate.pending]: (state, action) => {
      state.loading = true;
      state.data_template = action.payload;
    },
    [getTemplate.fulfilled]: (state, action) => {
      state.data_template = action.payload;
      state.loading = false;
    },
    [getTemplate.rejected]: (state, action) => {
      state.data_template = action.payload;
      state.loading = false;
    },

    /* Get Criteria */
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

    // Get List Approval Hierarchy
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

    // Get List Approval Hierarchy Detail
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

    // Get Approval History
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

    /* Get List Category */
    [getListCategory.pending]: (state, action) => {
      state.loading = true;
      state.dataListCategory = action.payload;
    },
    [getListCategory.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },
    [getListCategory.rejected]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },

    // List Criteria
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

    [getCustomerSegment.pending]: (state, action) => {
      state.loading = true;
      state.data_customerSegment = action.payload;
    },
    [getCustomerSegment.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_customerSegment = action.payload;
    },
    [getCustomerSegment.rejected]: (state, action) => {
      state.loading = false;
      state.data_customerSegment = action.payload;
    },

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
  },
});

const { reducer, actions } = invoiceTemplateSlice;
export const { resetInvoiceTemplateList } = actions;
export default reducer;
