import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  setBodyError,
  showModalError,
  validateError,
} from "../../general_slice";
import { showModalSuccess } from "../../general_slice";
import ratingBillingHttpService from "../../../services/ratingBillingHttpService";

const initialState = {
  loading: false,
  data_category: [],
  data_criteria: [],
  data_customer_segment: [],
  data_account_group: [],
  data: [],
  data_approval_history: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  data_detail: {},
  data_detail_draft: [],
  data_condition_name: [],
  data_condition_operator: [],
  data_condition_type: [],
  dataForm: [],
  dataListCategory: [],
};

export const getCategory = createAsyncThunk(
  "GET_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tax-code/get-category";
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
      const url = "/v1/dbs/api/tax-code/category-attachment";
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

export const getCriteria = createAsyncThunk(
  "GET_CRITERIA",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tax-code/get-criteria";
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

export const getCustomerSegment = createAsyncThunk(
  "GET_CUSTOMER_SEGMENT",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tax-code/get-customer-segment";
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
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tax-code/get-account-group/1";
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

export const getConditionName = createAsyncThunk(
  "GET_CONDITION_NAME",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tax-code/get-conditon-name";
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

export const getConditionOperator = createAsyncThunk(
  "GET_CONDITION_OPERATOR",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tax-code/get-conditon-operator";
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

export const getConditionType = createAsyncThunk(
  "GET_CONDITION_TYPE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tax-code/get-conditon-type";
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

export const getTaxCodePaginate = createAsyncThunk(
  "GET_TAX_CODE_PAGINATE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "taxCodeId~desc" : sort;
      const url = `/v1/dbs/api/tax-code/list-tax-code?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
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

export const downloadTaxCode = createAsyncThunk(
  "DOWNLOAD_TAX_CODE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "taxCodeId~desc" : sort;
      const url = `/v1/dbs/api/tax-code/download-filter?page=${page}&size=${pageSize}&searchs=${searchParams}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(validateError({ error: response, action: "DOWNLOAD_ACCOUNT_STANDARD", back: false }))
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const getDetailTaxCode = createAsyncThunk(
  "GET_DETAIL_TAX_CODE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-code/detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data.data;
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

export const getDetailDraftTaxCode = createAsyncThunk(
  "GET_DETAIL_DRAFT_TAX_CODE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-code/detail-draft/${id}`;
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

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-code/approval-history/${id}`;
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

export const getListApprovalHierarchy = createAsyncThunk(
  "GET_LIST_APPROVAL_HIERARCHY_TAX_CODE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tax-code/list-apphier";
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
  "GET_LIST_APPROVAL_HIERARCHY_DETAIL_TAX_CODE",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pos/list-apphier/${id}`;
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

export const inactiveTaxCode = createAsyncThunk(
  "INACTIVE_TAX_CODE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-code/inactive`;
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
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
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
  }
);

export const createTaxCode = createAsyncThunk(
  "CREATE_TAX_CODE",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tax-code/create";
      const response = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.action === "DRAFT" ? "created" : "submitted"
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
        if (error?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${
              body.action === "DRAFT" ? "created" : "submitted"
            }. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  }
);

export const updateTaxCode = createAsyncThunk(
  "UPDATE_TAX_CODE",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tax-code/update";
      const response = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.action === "DRAFT" ? "updated" : "submitted"
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
        if (error?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${
              body.action === "DRAFT" ? "updated" : "submitted"
            }. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  }
);

export const approvalInactiveTaxCode = createAsyncThunk(
  "APPROVAL_INACTIVE_TAX_CODE",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-code/approve-inactive`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body
      );
      const successBody = {
        title: "Successful",
        description: `Your data has been ${
          body.action === "APPROVE" ? "approved" : "rejected"
        }`,
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
          thunkAPI.dispatch(
            validateError({ error, action: "APPROVAL_INACTIVE_TAX_CODE" })
          );
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
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const approvalRejectTaxCode = createAsyncThunk(
  "APPROVE_REJECT_TAX_CODE",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-code/approve`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body
      );
      const successBody = {
        title: "Successful",
        description: `Your data has been ${
          body.action === "APPROVE" ? "approved" : "rejected"
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
              body.action === "APPROVE" ? "approved" : "rejected"
            }. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  }
);

const taxCodeSlice = createSlice({
  name: "tax_code",
  initialState,
  extraReducers: {
    //get category
    [getCategory.pending]: (state, action) => {
      state.loading = true;
      state.data_category = action.payload;
    },
    [getCategory.fulfilled]: (state, action) => {
      state.data_category = action.payload;
      state.loading = false;
    },
    [getCategory.rejected]: (state, action) => {
      state.data_category = action.payload;
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

    // get customer segment
    [getCustomerSegment.pending]: (state, action) => {
      state.loading = true;
      state.data_customer_segment = action.payload;
    },
    [getCustomerSegment.fulfilled]: (state, action) => {
      state.data_customer_segment = action.payload;
      state.loading = false;
    },
    [getCustomerSegment.rejected]: (state, action) => {
      state.data_customer_segment = action.payload;
      state.loading = false;
    },

    // get account group
    [getAccountGroup.pending]: (state, action) => {
      state.loading = true;
      state.data_account_group = action.payload;
    },
    [getAccountGroup.fulfilled]: (state, action) => {
      state.data_account_group = action.payload;
      state.loading = false;
    },
    [getAccountGroup.rejected]: (state, action) => {
      state.data_account_group = action.payload;
      state.loading = false;
    },

    // get condition name
    [getConditionName.pending]: (state, action) => {
      state.loading = true;
    },
    [getConditionName.fulfilled]: (state, action) => {
      state.data_condition_name = action.payload;
      state.loading = false;
    },
    [getConditionName.rejected]: (state, action) => {
      state.loading = false;
    },

    // get condition operator
    [getConditionOperator.pending]: (state, action) => {
      state.loading = true;
    },
    [getConditionOperator.fulfilled]: (state, action) => {
      state.data_condition_operator = action.payload;
      state.loading = false;
    },
    [getConditionOperator.rejected]: (state, action) => {
      state.loading = false;
    },

    // get condition type
    [getConditionType.pending]: (state, action) => {
      state.loading = true;
    },
    [getConditionType.fulfilled]: (state, action) => {
      state.data_condition_type = action.payload;
      state.loading = false;
    },
    [getConditionType.rejected]: (state, action) => {
      state.loading = false;
    },

    // get pagination list
    [getTaxCodePaginate.pending]: (state, action) => {
      state.loading = true;
    },
    [getTaxCodePaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getTaxCodePaginate.rejected]: (state, action) => {
      state.loading = false;
    },

    // get attachment category
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

    //get detail
    [getDetailTaxCode.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailTaxCode.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    [getDetailTaxCode.rejected]: (state, action) => {
      state.loading = false;
    },

    // Get Detail Draft
    [getDetailDraftTaxCode.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailDraftTaxCode.fulfilled]: (state, action) => {
      state.data_detail_draft = action.payload;
      state.loading = false;
    },
    [getDetailDraftTaxCode.rejected]: (state, action) => {
      state.loading = false;
    },

    /* Download Tax Code */
    [downloadTaxCode.pending]: (state, action) => {
      state.loading = true;
    },
    [downloadTaxCode.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [downloadTaxCode.rejected]: (state, action) => {
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

    // Inactive Tax Code
    [inactiveTaxCode.pending]: (state, action) => {
      state.loading = true;
    },
    [inactiveTaxCode.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveTaxCode.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    // Create Tax Code
    [createTaxCode.pending]: (state, action) => {
      state.loading = true;
    },
    [createTaxCode.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataForm = action.payload;
    },
    [createTaxCode.rejected]: (state, action) => {
      state.loading = false;
    },

    // Update Tax Code
    [updateTaxCode.pending]: (state, action) => {
      state.loading = true;
    },
    [updateTaxCode.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataForm = action.payload;
    },
    [updateTaxCode.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

const { reducer } = taxCodeSlice;
export default reducer;
