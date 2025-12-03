import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../../services/ratingBillingHttpService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../../general_slice";

const initialState = {
  data_list: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
  data_type: [],
  message: "",
  data_detail: {},
  data_detail_draft: [],
  data_rate: [],
  dataApprovalHistory: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataListCategory: [],

  //criteria
  data_select_criteria: [],
  dataListCurrency: [],
  data_province: [],
  data_city: [],
  data_cost_center: [],
  data_sor: [],
  data_district: [],
  data_sub_district: [],
  data_Gsizes: [],
  data_industrial_sector: [],
  data_service_type: [],
  data_account_Category: [],
  data_account_group: [],
  data_customerSegment: [],
  data_customer: [],
  data_budget: [],
  dataListAttachment: {},
  dataListCriteriaValue: {},
};

export const getTopPaginate = createAsyncThunk(
  "GET_DAILYRATE__PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rbi/top/view?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
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
          description: `Your data was not created. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getDetailTOP = createAsyncThunk(
  "GET_DETAIL_TOPS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/top/detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
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
          description: `Your data was not created. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//get type create
export const getTopDDL = createAsyncThunk(
  "GET_RATE_TYPE_TOP_DDL",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/top/type`;
      const response = await ratingBillingHttpService.getAll(url);
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
          description: `Your data was not created. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getDetailDraftTOP = createAsyncThunk(
  "GET_DETAIL_TOP_DRAFT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/top/detail-draft/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return Array.isArray(response?.data) ? null : response?.data;
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
          description: `Your data was not created. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//list approval hierarchy
export const getAllApprovalList = createAsyncThunk(
  "GET_ALL_APPROVAL_LIST_TOP",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/top/available-hier`;
      const response = await ratingBillingHttpService.getAll(url);
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
          description: `Your data was not created. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getListApprovalById = createAsyncThunk(
  "GET_LIST_APPROVAL_BY_ID_TOP",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/top/list-selected-approval/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
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
          description: `Your data was not created. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY_TOPS",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/billing-bucket/list-attachment-category";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.map((item) => ({
        Id: item?.id,
        text: item?.text,
      }));
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
          description: `Your data was not created. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//create
export const createTOP = createAsyncThunk(
  "CREATE_MASTER_DATA_TOPS",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/top/create`;
      const data = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.isSubmit === false ? "created" : "submitted"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return data.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
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
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

//update
export const updateTOP = createAsyncThunk(
  "UPDATE_MASTER_TOPS",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/top/update`;
      const data = await ratingBillingHttpService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.isSubmit === false ? "updated" : "submitted"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return data.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
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
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const downloadTOPS = createAsyncThunk(
  "DOWNLOAD_TOPS",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rbi/top/download-list?page=${page}&size=${pageSize}&searchs=${searchParams}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_TOPS",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const inactiveTOP = createAsyncThunk(
  "INACTIVE_BANK",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/top/inactive-top`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
      );

      const successMessage = {
        title: "Successfull",
        description: "Your data has been submitted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
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
      return error;
    }
  },
);

export const approveInactive = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_TOPS",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/top/approval-inactive";
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
      );
      const message = response?.message;
      const successMessage = {
        title: "Successfull",
        description: `${message}`,
        return: true,
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
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          data: error.response.data.data,
          description: `Your data was not created. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const approveCreateUpdateTOP = createAsyncThunk(
  "APPROVE_OR_REJECT_CREATE_TOPS",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/top/approval-top";
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
      );
      const message = response?.message;
      const successMessage = {
        title: "Successfull",
        description: `${message}`,
        return: true,
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
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          data: error.response.data.data,
          description: `Your data was not created. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getApprovalHistoryTOP = createAsyncThunk(
  "GET_APPROVAL_HISTORY_TOPS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/top/get-approval-history/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

//criteria

export const getListCriteriaTOP = createAsyncThunk(
  "GET_LIST_CRITERIA",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/billing-bucket/list-criteria";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getProvinceList = createAsyncThunk(
  "GET_PROVINCE_LIST_TOPS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-province`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getCityList = createAsyncThunk(
  "GET_CITY_TOPS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-city/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getDistrictList = createAsyncThunk(
  "GET_DISTRICT_LIST_TOPS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-district/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getSubDistrictList = createAsyncThunk(
  "GET_SUB_DISTRICT_LIST_TOPS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-sub-district/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

// export const getProductList = createAsyncThunk(
//   "GET_PRODUCT_LIST_TOP",
//   async (thunkAPI) => {
//     try {
//       const url = `/v1/dbs/api/bank/account-product/get`;
//       const response = await ratingBillingHttpService.getAll(url);
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error?.response);
//     }
//   }
// );

export const getBudgetList = createAsyncThunk(
  "GET_BUDGET_LIST_TOP",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-budget`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getCustomer = createAsyncThunk(
  "GET_CUSTOMER_LIST_CRITERIA_TOPS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-customer`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getCostCenterList = createAsyncThunk(
  "GET_COST_CENTER_TOPS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-cost-center`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getSorList = createAsyncThunk(
  "GET_SOR_LIST_TOPS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-sor`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getGsizesList = createAsyncThunk(
  "GET_GSIZE_LIST_TOPS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-g-size`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getCustomerSegment = createAsyncThunk(
  "GET_CUSTOMER_SEGMENT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-customer-segment`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getIndustrialSectorList = createAsyncThunk(
  "GET_INDUSTRIAL_SECTOR_LIST_TOP",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-industrial-sector`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getAccountCategoryList = createAsyncThunk(
  "GET_ACCOUNT_CATEGORY_LIST_TOPS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-account-category`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getAccountGroupList = createAsyncThunk(
  "GET_ACCOUNT_GROUP_LIST_TOPS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-account-group-type/${id}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getListCurrency = createAsyncThunk(
  "GET_CURRENCY_LIST_BANK",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-currency`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getServiceTypeList = createAsyncThunk(
  "GET_SERVICE_TYPE_TOPs",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-service-type`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

const termsofPaymentSlice = createSlice({
  name: "top",
  initialState,
  extraReducers: {
    // Get All Rate Type Pagination
    [getTopPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getTopPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_list = action.payload;
    },
    [getTopPaginate.rejected]: (state, action) => {
      state.loading = false;
      state.data_list = action.payload;
    },

    /* Download Invoice Template */
    [downloadTOPS.pending]: (state) => {
      state.loading = true;
    },
    [downloadTOPS.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadTOPS.rejected]: (state) => {
      state.loading = false;
    },

    // update TOP
    [updateTOP.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [updateTOP.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [updateTOP.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // get detail
    [getDetailTOP.pending]: (state) => {
      state.loading = true;
    },
    [getDetailTOP.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailTOP.rejected]: (state) => {
      state.loading = true;
    },

    // get detail draft
    [getDetailDraftTOP.pending]: (state) => {
      state.loading = true;
    },
    [getDetailDraftTOP.fulfilled]: (state, action) => {
      state.data_detail_draft = action.payload;
      state.loading = false;
    },
    [getDetailDraftTOP.rejected]: (state) => {
      state.loading = true;
    },

    //get ddl type
    [getTopDDL.pending]: (state, action) => {
      state.data_type = action.payload;
      state.loadingType = true;
    },
    [getTopDDL.fulfilled]: (state, action) => {
      state.data_type = action.payload;
      state.loadingType = false;
    },
    [getTopDDL.rejected]: (state, action) => {
      state.data_type = action.payload;
      state.loadingType = false;
    },

    // Get Approve Hierarchy List
    [getAllApprovalList.pending]: (state, action) => {
      state.loading = true;
      state.dataListAppHierId = action.payload;
    },
    [getAllApprovalList.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    [getAllApprovalList.rejected]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },

    // Get List Approval By Id
    [getListApprovalById.pending]: (state, action) => {
      state.loading = true;
      state.dataListAppHierDetail = action.payload;
    },
    [getListApprovalById.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },
    [getListApprovalById.rejected]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },

    // inactive app
    [inactiveTOP.pending]: (state) => {
      state.loading = true;
    },
    [inactiveTOP.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveTOP.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },

    // Approve Or Reject Inactive
    [approveInactive.pending]: (state) => {
      state.loading = true;
    },
    [approveInactive.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveInactive.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    // Approve Or Reject Create
    [approveCreateUpdateTOP.pending]: (state) => {
      state.loading = true;
    },
    [approveCreateUpdateTOP.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveCreateUpdateTOP.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    /** Get List Category */
    [getListCategory.pending]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingDR = true;
    },
    [getListCategory.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingDR = false;
    },
    [getListCategory.rejected]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingDR = false;
    },

    // create top
    [createTOP.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createTOP.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createTOP.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // criteriaaa

    /** Get List Criteria */
    [getListCriteriaTOP.pending]: (state, action) => {
      state.loading = true;
      state.data_select_criteria = action.payload;
    },
    [getListCriteriaTOP.fulfilled]: (state, action) => {
      state.data_select_criteria = action.payload;
      state.loading = false;
    },
    [getListCriteriaTOP.rejected]: (state, action) => {
      state.data_select_criteria = action.payload;
      state.loading = false;
    },

    // Get Province List
    [getProvinceList.pending]: (state, action) => {
      state.loading = true;
      state.data_province = action.payload;
    },
    [getProvinceList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_province = action.payload;
    },
    [getProvinceList.rejected]: (state, action) => {
      state.loading = false;
      state.data_province = action.payload;
    },

    // Get City List
    [getCityList.pending]: (state, action) => {
      state.loading = true;
      state.data_city = action.payload;
    },
    [getCityList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_city = action.payload;
    },
    [getCityList.rejected]: (state, action) => {
      state.loading = false;
      state.data_city = action.payload;
    },

    // Get Cost Center List
    [getCostCenterList.pending]: (state, action) => {
      state.loading = true;
      state.data_cost_center = action.payload;
    },
    [getCostCenterList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_cost_center = action.payload;
    },
    [getCostCenterList.rejected]: (state, action) => {
      state.loadingPricing = false;
      state.data_cost_center = action.payload;
    },

    // Get Sor List
    [getSorList.pending]: (state, action) => {
      state.loading = true;
      state.data_sor = action.payload;
    },
    [getSorList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_sor = action.payload;
    },
    [getSorList.rejected]: (state, action) => {
      state.loadingPricing = false;
      state.data_sor = action.payload;
    },

    // Get District List
    [getDistrictList.pending]: (state, action) => {
      state.loading = true;
      state.data_district = action.payload;
    },
    [getDistrictList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_district = action.payload;
    },
    [getDistrictList.rejected]: (state, action) => {
      state.loading = false;
      state.data_district = action.payload;
    },

    // Get Sub District List
    [getSubDistrictList.pending]: (state, action) => {
      state.loading = true;
      state.data_sub_district = action.payload;
    },
    [getSubDistrictList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_sub_district = action.payload;
    },
    [getSubDistrictList.rejected]: (state, action) => {
      state.loading = false;
      state.data_sub_district = action.payload;
    },

    // Get G sizes List
    [getGsizesList.pending]: (state, action) => {
      state.loading = true;
      state.data_Gsizes = action.payload;
    },
    [getGsizesList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_Gsizes = action.payload;
    },
    [getGsizesList.rejected]: (state, action) => {
      state.loading = false;
      state.data_Gsizes = action.payload;
    },

    // Get Industrial Sector List
    [getIndustrialSectorList.pending]: (state, action) => {
      state.loading = true;
      state.data_industrial_sector = action.payload;
    },
    [getIndustrialSectorList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_industrial_sector = action.payload;
    },
    [getIndustrialSectorList.rejected]: (state, action) => {
      state.loading = false;
      state.data_industrial_sector = action.payload;
    },

    // Get Service Type List
    [getServiceTypeList.pending]: (state, action) => {
      state.loading = true;
      state.data_service_type = action.payload;
    },
    [getServiceTypeList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_service_type = action.payload;
    },
    [getServiceTypeList.rejected]: (state, action) => {
      state.loading = false;
      state.data_service_type = action.payload;
    },

    // Get Account Category List
    [getAccountCategoryList.pending]: (state, action) => {
      state.loading = true;
      state.data_account_Category = action.payload;
    },
    [getAccountCategoryList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_account_Category = action.payload;
    },
    [getAccountCategoryList.rejected]: (state, action) => {
      state.loading = false;
      state.data_account_Category = action.payload;
    },

    // Get Account Group List
    [getAccountGroupList.pending]: (state, action) => {
      state.loading = true;
      state.data_account_group = action.payload;
    },
    [getAccountGroupList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_account_group = action.payload;
    },
    [getAccountGroupList.rejected]: (state, action) => {
      state.loading = false;
      state.data_account_group = action.payload;
    },

    // Get Customer Segment List
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

    // Get Customer Segment List

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

    // Get Budget List

    [getBudgetList.pending]: (state, action) => {
      state.loading = true;
      state.data_budget = action.payload;
    },
    [getBudgetList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_budget = action.payload;
    },
    [getBudgetList.rejected]: (state, action) => {
      state.loading = false;
      state.data_budget = action.payload;
    },

    // list curency
    [getListCurrency.pending]: (state, action) => {
      state.loading = true;
      state.dataCurrency = action.payload;
    },
    [getListCurrency.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataCurrency = action.payload;
    },
    [getListCurrency.rejected]: (state, action) => {
      state.loading = false;
      state.dataCurrency = action.payload;
    },

    // entity
    // [getListEntity.pending]: (state, action) => {
    //   state.loading = true;
    //   state.dataEntity = action.payload;
    // },
    // [getListEntity.fulfilled]: (state, action) => {
    //   state.loading = false;
    //   state.dataEntity = action.payload;
    // },
    // [getListEntity.rejected]: (state, action) => {
    //   state.loading = false;
    //   state.dataEntity = action.payload;
    // },

    /** Get Approval History */
    [getApprovalHistoryTOP.pending]: (state, action) => {
      state.loadingCalender = true;
      state.dataApprovalHistory = action.payload;
    },
    [getApprovalHistoryTOP.fulfilled]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loadingCalender = false;
    },
    [getApprovalHistoryTOP.rejected]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loadingCalender = false;
    },
  },
});

const { reducer } = termsofPaymentSlice;
export default reducer;
