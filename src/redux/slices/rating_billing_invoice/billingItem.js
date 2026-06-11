import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showModalError, validateError } from "../general_slice";
import { showModalSuccess } from "../general_slice";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";

const initialState = {
  data_view: { result: [], page: {} },
  data_billingItemCategoryDdl: [],
  data_billingItemCategory: [],
  data_billType: [],
  data_typeList: [],
  data_categoryList: [],
  data_criteriaList: [],
  data_specialGLList: [],
  data_glAccountList: [],
  data_bankList: [],
  data_bankAccountList: [],
  data_glAccountBankList: [],
  data_classificationTypeList: [],
  data_accountTypeList: [],
  data_mappingItemTypeList: [],
  data_mappingItemTransactionMappingCode: [],
  data_itemMappingCategory: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  data_AttachmentTable: [],
  dataListCategory: [],
  data_BillingItemDetail: [],
  data_AttachmentDetail: [],
  detail_mapping_category: [],
  data_ApprovalHistory: [],
  downloadBillingItem: [],
  message: "",
  getConfigFile: {},
  loading: false,
  loadingDetail: false,
};

export const getBillingItemList = createAsyncThunk(
  "GET_BILLING_ITEM_LIST",
  async ({ page, pageSize, search, sort, isLoadMore = false }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billingitem/get-paging?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return { ...response.data, isLoadMore };
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_BILLING_ITEM_LIST" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getBillingItemCategory = createAsyncThunk(
  "GET_BILLING_ITEM_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingitem/get-mapping-category";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_BILLING_ITEM_LIST" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getBillType = createAsyncThunk(
  "GET_BILL_TYPE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingitem/get-billing-type";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_BILL_TYPE" }));
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getBillingItemCategoryDdl = createAsyncThunk(
  "GET_BILLING_ITEM_MAPPING_CATEGORY_DDL",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingitem/get-billing-category";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error,
          action: "GET_BILLING_ITEM_MAPPING_CATEGORY_DDL",
        }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getDetailMappingCategory = createAsyncThunk(
  "GET_DETAIL_MAPPING_CATEGORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/get-item-mapping/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_DETAIL_MAPPING_CATEGORY" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getAvailableApproval = createAsyncThunk(
  "GET_AVAILABLE_APPROVAL",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/approval-hierarchies-get`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_AVAILABLE_APPROVAL" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getSelectedApproval = createAsyncThunk(
  "GET_SELECTED_APPROVAL",
  async (arg, thunkAPI) => {
    try {
      if (!arg || !arg.id) {
        return [];
      }
      const url = `/v1/dbs/api/billingitem/approval-hierarchies-detail/${arg.id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_SELECTED_APPROVAL" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getAttachmentTable = createAsyncThunk(
  "GET_ATTACHMENT_TABLE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/attachment-list/?page=${page}&size=${pageSize}&search=${search}&sort=${sort}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_ATTACHMENT_TABLE" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getAttachmentCategory = createAsyncThunk(
  "GET_ATTACHMENT_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/category-attachment-get`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.map((item) => ({
        Id: item.id,
        text: item.text,
      }));
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_ATTACHMENT_CATEGORY" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getBillingItemDetail = createAsyncThunk(
  "GET_BILLING_ITEM_DETAIL",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_BILLING_ITEM_DETAIL" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getAttachmentDetail = createAsyncThunk(
  "GET_ATTACHMENT_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/attachment-list/${id}?page=0&size=1000`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_ATTACHMENT_DETAIL" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const inactiveBillingItem = createAsyncThunk(
  "INACTIVE_BILLING_ITEM",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/inactive`;
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
          thunkAPI.dispatch(
            validateError({ error, action: "INACTIVE_BILLING_ITEM" }),
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not submitted. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const requestActivateBillingItem = createAsyncThunk(
  "REQUEST_ACTIVATE_BILLING_ITEM",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/request-activate`;
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
          thunkAPI.dispatch(
            validateError({ error, action: "REQUEST_ACTIVATE_BILLING_ITEM" }),
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not submitted. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/approval-history-get/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        return thunkAPI.rejectWithValue(null);
      }
      thunkAPI.dispatch(
        validateError({ error, action: "GET_APPROVAL_HISTORY" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const downloadBillingItem = createAsyncThunk(
  "DOWNLOAD_BILLING_ITEM",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billingitem/download-filter?page=${page}&size=${pageSize}&searchs=${searchParams}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_BILLING_ITEM",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const createBillingItem = createAsyncThunk(
  "CREATE_BILLING_ITEM",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/create`;
      const response = await ratingBillingHttpService.createData(url, body);
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
            validateError({ error, action: "CREATE_BILLING_ITEM" }),
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${body.isSubmit ? "created" : "submitted"
              }. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const updateBillingItem = createAsyncThunk(
  "UPDATE_BILLING_ITEM",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/update`;
      const response = await ratingBillingHttpService.updateData(url, body);
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
            validateError({ error, action: "UPDATE_BILLING_ITEM" }),
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${body.isSubmit ? "updated" : "submitted"
              }. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const approvalRejectBillingItem = createAsyncThunk(
  "APPROVE_REJECT_BILLING_ITEM",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/approve`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
      );
      const successBody = {
        title: "Successful",
        description: `Your data has been ${body.action === "APPROVE" ? "approved" : "rejected"
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
        const errorBody = {
          title: "Failed",
          description: `Your data was not submitted. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const approvalInactiveBillingItem = createAsyncThunk(
  "APPROVAL_INACTIVE_BILLING_ITEM",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/approve-inactive`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
      );
      const successBody = {
        title: "Successful",
        description: "Your data has been inactived.",
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
            validateError({ error, action: "APPROVAL_INACTIVE_BILLING_ITEM" }),
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not submitted. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const approvalActivatedBillingItem = createAsyncThunk(
  "APPROVAL_ACTIVATED_BILLING_ITEM",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/approve-activated`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
      );
      const successBody = {
        title: "Successful",
        description: `Your data has been ${body.action === "APPROVE" ? "approved" : "rejected"
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
          thunkAPI.dispatch(
            validateError({ error, action: "APPROVAL_ACTIVATED_BILLING_ITEM" }),
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not submitted. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getConfigFileRBIBillingItem = createAsyncThunk(
  "GET_CONFIG_FILE_RBI_BILLING_ITEM",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingitem/attachment-config-file";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getBillingItemTypeList = createAsyncThunk(
  "GET_BILLING_ITEM_TYPE_LIST",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingitem/typelist";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.map((item) => ({
        id: item.Id,
        name: item.text,
        code: item.code,
      }));
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_BILLING_ITEM_TYPE_LIST" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getBillingItemCriteriaList = createAsyncThunk(
  "GET_BILLING_ITEM_CRITERIA_LIST",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingitem/criteria-list";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.map((item) => ({
        id: item.Id,
        name: item.text,
        code: item.code,
      }));
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_BILLING_ITEM_CRITERIA_LIST" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getBillingItemCategoryList = createAsyncThunk(
  "GET_BILLING_ITEM_CATEGORY_LIST",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingitem/category-list";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_BILLING_ITEM_CATEGORY_LIST" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const generateTransactionMappingCode = createAsyncThunk(
  "GENERATE_TRANSACTION_MAPPING_CODE",
  async ({ id, prefix }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingitem/generate-code";
      const response = await ratingBillingHttpService.createData(url, {
        id,
        prefix,
      });
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GENERATE_TRANSACTION_MAPPING_CODE" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getSpecialGLList = createAsyncThunk(
  "GET_SPECIAL_GL_LIST",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingitem/lov/special-gl";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.map((item) => ({
        id: item.glbTypeValId,
        name: item.name,
        value: item.glValue,
      }));
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_SPECIAL_GL_LIST" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getGLAccountList = createAsyncThunk(
  "GET_GL_ACCOUNT_LIST",
  async (params = {}, thunkAPI) => {
    try {
      const searchParam = params?.search?.trim?.();
      const url = searchParam
        ? `/v1/dbs/api/billingitem/get-gl-account?search=${encodeURIComponent(searchParam)}`
        : "/v1/dbs/api/billingitem/get-gl-account";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.map((item) => ({
        id: item.glAccountId,
        name: item.glAccountDesc,
        account: item.glAccount,
      }));
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_GL_ACCOUNT_LIST" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getBankList = createAsyncThunk(
  "GET_BANK_LIST",
  async (_, thunkAPI) => {
    try {
      const urls = ["/v1/dbs/api/billingitem/bank-list", "/bank-list"];

      let response;
      for (const url of urls) {
        try {
          response = await ratingBillingHttpService.getAll(url);
          break;
        } catch (error) {
          response = null;
        }
      }

      if (!response) {
        throw new Error("Failed to get bank list");
      }

      return (response.data || []).map((item) => ({
        bankId: item.bankId,
        bankCode: item.bankCode,
        bankName: item.bankName,
        bankShortName: item.bankShortName,
      }));
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_BANK_LIST" }));
      return thunkAPI.rejectWithValue(
        error?.response?.data?.code === 419 ? null : error?.response?.data,
      );
    }
  },
);

export const getBankAccountList = createAsyncThunk(
  "GET_BANK_ACCOUNT_LIST",
  async ({ bankId }, thunkAPI) => {
    try {
      const urls = [
        `/v1/dbs/api/billingitem/bank-account-list/${bankId}`,
        `/bank-account-list/${bankId}`,
      ];

      let response;
      for (const url of urls) {
        try {
          response = await ratingBillingHttpService.getAll(url);
          break;
        } catch (error) {
          response = null;
        }
      }

      if (!response) {
        throw new Error("Failed to get bank account list");
      }

      return (response.data || []).map((item) => ({
        id: item.id,
        bankId: item.bankId,
        accountNumber: item.accountNumber,
        accountName: item.accountName,
      }));
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_BANK_ACCOUNT_LIST" }),
      );
      return thunkAPI.rejectWithValue(
        error?.response?.data?.code === 419 ? null : error?.response?.data,
      );
    }
  },
);

export const getGlAccountBankById = createAsyncThunk(
  "GET_GL_ACCOUNT_BANK_BY_ID",
  async ({ id }, thunkAPI) => {
    try {
      const urls = [
        `/v1/dbs/api/billingitem/get-gl-account-bank/${id}`,
        `/get-gl-account-bank/${id}`,
      ];

      let response;
      for (const url of urls) {
        try {
          response = await ratingBillingHttpService.getAll(url);
          break;
        } catch (error) {
          response = null;
        }
      }

      if (!response) {
        throw new Error("Failed to get bank gl account");
      }

      return (response.data || []).map((item) => ({
        id: item.id,
        bankId: item.bankId,
        glNumber: item.glNumber,
        glDescription: item.glDescription,
      }));
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_GL_ACCOUNT_BANK_BY_ID" }),
      );
      return thunkAPI.rejectWithValue(
        error?.response?.data?.code === 419 ? null : error?.response?.data,
      );
    }
  },
);

export const getClassificationTypeList = createAsyncThunk(
  "GET_CLASSIFICATION_TYPE_LIST",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingitem/get-classification-type";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.map((item) => ({
        id: item.Id,
        name: item.text,
        code: item.code,
      }));
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_CLASSIFICATION_TYPE_LIST" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getAccountTypeList = createAsyncThunk(
  "GET_ACCOUNT_TYPE_LIST",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingitem/get-account-type";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.map((item) => ({
        id: item.Id,
        name: item.text,
        code: item.code,
      }));
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_ACCOUNT_TYPE_LIST" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getMappingItemTypeList = createAsyncThunk(
  "GET_MAPPING_ITEM_TYPE_LIST",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingitem/mapping-item/type";
      const response = await ratingBillingHttpService.getAll(url);
      return (response.data || []).map((item) => ({
        id: item?.id ?? item?.Id ?? item?.value ?? item?.code,
        name: item?.name ?? item?.text ?? item?.label ?? item?.code,
        code: item?.code ?? item?.value ?? item?.name ?? item?.text,
      }));
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_MAPPING_ITEM_TYPE_LIST" }),
      );
      return thunkAPI.rejectWithValue(
        error?.response?.data?.code === 419 ? null : error?.response?.data,
      );
    }
  },
);

export const getMappingItemTransactionMappingCode = createAsyncThunk(
  "GET_MAPPING_ITEM_TRANSACTION_MAPPING_CODE",
  async ({ type }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/mapping-item/transaction-mapping-code?type=${type}`;
      const response = await ratingBillingHttpService.getAll(url);
      return (response.data || []).map((item) => ({
        id: item?.id ?? item?.Id ?? item?.value ?? item?.code,
        type: item?.type ?? item?.mappingType ?? item?.transMappingType,
        transactionMappingCode:
          item?.transactionMappingCode ?? item?.billingItemCode ?? item?.code,
        name:
          item?.name ?? item?.billingItemName ?? item?.transactionMappingName,
        description: item?.description ?? item?.desc ?? item?.remark,
      }));
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error,
          action: "GET_MAPPING_ITEM_TRANSACTION_MAPPING_CODE",
        }),
      );
      return thunkAPI.rejectWithValue(
        error?.response?.data?.code === 419 ? null : error?.response?.data,
      );
    }
  },
);

const billingItemSlice = createSlice({
  name: "billing_item",
  initialState,

  reducers: {
    resetApprovalState: (state) => {
      state.dataListAppHierId = [];
      state.dataListAppHierDetail = [];
    },
  },

  extraReducers: {
    [getBillingItemList.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getBillingItemList.fulfilled]: (state, action) => {
      state.loading = false;
      const { isLoadMore, ...restPayload } = action.payload || {};
      const newData = restPayload?.result || [];

      if (isLoadMore) {
        const existingIds = new Set(
          (state.data_view?.result || []).map((item) => item.billingItemCode),
        );
        const uniqueNewData = newData.filter(
          (item) => !existingIds.has(item.billingItemCode),
        );
        state.data_view = {
          ...restPayload,
          result: [...(state.data_view?.result || []), ...uniqueNewData],
        };
      } else {
        state.data_view = restPayload;
      }
    },
    [getBillingItemList.rejected]: (state, action) => {
      state.loading = false;
      if (!action.meta.arg?.isLoadMore) {
        state.data_view = { result: [], page: {} };
      }
    },

    [getBillingItemCategory.pending]: (state) => {
      state.loading = true;
    },
    [getBillingItemCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_billingItemCategory = action.payload;
    },
    [getBillingItemCategory.rejected]: (state) => {
      state.loading = false;
    },

    [getBillingItemCategoryDdl.pending]: (state) => {
      state.loading = true;
    },
    [getBillingItemCategoryDdl.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_billingItemCategoryDdl = action.payload;
    },
    [getBillingItemCategoryDdl.rejected]: (state) => {
      state.loading = false;
    },

    [getBillType.pending]: (state) => {
      state.loading = true;
    },
    [getBillType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_billType = action.payload;
    },
    [getBillType.rejected]: (state) => {
      state.loading = false;
    },

    [getDetailMappingCategory.pending]: (state) => {
      state.loading = true;
    },
    [getDetailMappingCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.detail_mapping_category = action.payload;
    },
    [getDetailMappingCategory.rejected]: (state) => {
      state.loading = false;
    },

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

    [getAttachmentTable.pending]: (state) => {
      state.loading = true;
    },
    [getAttachmentTable.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_AttachmentTable = action.payload;
    },
    [getAttachmentTable.rejected]: (state) => {
      state.loading = false;
    },

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

    [getBillingItemDetail.pending]: (state) => {
      state.loadingDetail = true;
    },
    [getBillingItemDetail.fulfilled]: (state, action) => {
      state.loadingDetail = false;
      state.data_BillingItemDetail = action.payload;
    },
    [getBillingItemDetail.rejected]: (state) => {
      state.loadingDetail = false;
    },

    [getAttachmentDetail.pending]: (state) => {
      state.loading = true;
    },
    [getAttachmentDetail.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_AttachmentDetail = action.payload;
    },
    [getAttachmentDetail.rejected]: (state) => {
      state.loading = false;
    },

    [inactiveBillingItem.pending]: (state) => {
      state.loading = true;
    },
    [inactiveBillingItem.fulfilled]: (state) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [inactiveBillingItem.rejected]: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },

    [requestActivateBillingItem.pending]: (state) => {
      state.loading = true;
    },
    [requestActivateBillingItem.fulfilled]: (state) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [requestActivateBillingItem.rejected]: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },

    [getApprovalHistory.pending]: (state, action) => {
      state.data_ApprovalHistory = action.payload;
      state.loading = true;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_ApprovalHistory = action.payload;
    },
    [getApprovalHistory.rejected]: (state, action) => {
      state.data_ApprovalHistory = action.payload;
      state.loading = false;
    },

    [approvalRejectBillingItem.pending]: (state) => {
      state.loading = true;
    },
    [approvalRejectBillingItem.fulfilled]: (state) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [approvalRejectBillingItem.rejected]: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },

    [approvalInactiveBillingItem.pending]: (state) => {
      state.loading = true;
    },
    [approvalInactiveBillingItem.fulfilled]: (state) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [approvalInactiveBillingItem.rejected]: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },

    [approvalActivatedBillingItem.pending]: (state) => {
      state.loading = true;
    },
    [approvalActivatedBillingItem.fulfilled]: (state) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [approvalActivatedBillingItem.rejected]: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },

    [downloadBillingItem.pending]: (state) => {
      state.loading = true;
    },
    [downloadBillingItem.fulfilled]: (state, action) => {
      state.loading = false;
      state.download_BillingItem = action.payload;
    },
    [downloadBillingItem.rejected]: (state) => {
      state.loading = false;
    },

    [getConfigFileRBIBillingItem.pending]: (state) => {
      state.loading = true;
    },
    [getConfigFileRBIBillingItem.fulfilled]: (state, action) => {
      state.loading = false;
      state.getConfigFile = action.payload;
    },
    [getConfigFileRBIBillingItem.rejected]: (state) => {
      state.loading = false;
    },

    [getBillingItemTypeList.pending]: (state) => {
      state.loading = true;
    },
    [getBillingItemTypeList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_typeList = action.payload;
    },
    [getBillingItemTypeList.rejected]: (state) => {
      state.loading = false;
    },

    [getBillingItemCriteriaList.pending]: (state) => {
      state.loading = true;
    },
    [getBillingItemCriteriaList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_criteriaList = action.payload;
    },
    [getBillingItemCriteriaList.rejected]: (state) => {
      state.loading = false;
    },

    [getBillingItemCategoryList.pending]: (state) => {
      state.loading = true;
    },
    [getBillingItemCategoryList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_categoryList = action.payload;
    },
    [getBillingItemCategoryList.rejected]: (state) => {
      state.loading = false;
    },

    [getSpecialGLList.pending]: (state) => {
      state.loading = true;
    },
    [getSpecialGLList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_specialGLList = action.payload;
    },
    [getSpecialGLList.rejected]: (state) => {
      state.loading = false;
    },

    [getGLAccountList.pending]: (state) => {
      state.loading = true;
    },
    [getGLAccountList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_glAccountList = action.payload;
    },
    [getGLAccountList.rejected]: (state) => {
      state.loading = false;
    },

    [getBankList.pending]: (state) => {
      state.loading = true;
    },
    [getBankList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_bankList = action.payload;
    },
    [getBankList.rejected]: (state) => {
      state.loading = false;
      state.data_bankList = [];
    },

    [getBankAccountList.pending]: (state) => {
      state.loading = true;
    },
    [getBankAccountList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_bankAccountList = action.payload;
    },
    [getBankAccountList.rejected]: (state) => {
      state.loading = false;
      state.data_bankAccountList = [];
    },

    [getGlAccountBankById.pending]: (state) => {
      state.loading = true;
    },
    [getGlAccountBankById.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_glAccountBankList = action.payload;
    },
    [getGlAccountBankById.rejected]: (state) => {
      state.loading = false;
      state.data_glAccountBankList = [];
    },

    [getClassificationTypeList.pending]: (state) => {
      state.loading = true;
    },
    [getClassificationTypeList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_classificationTypeList = action.payload;
    },
    [getClassificationTypeList.rejected]: (state) => {
      state.loading = false;
    },

    [getAccountTypeList.pending]: (state) => {
      state.loading = true;
    },
    [getAccountTypeList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_accountTypeList = action.payload;
    },
    [getAccountTypeList.rejected]: (state) => {
      state.loading = false;
    },

    [getMappingItemTypeList.pending]: (state) => {
      state.loading = true;
    },
    [getMappingItemTypeList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_mappingItemTypeList = action.payload;
    },
    [getMappingItemTypeList.rejected]: (state) => {
      state.loading = false;
      state.data_mappingItemTypeList = [];
    },

    [getMappingItemTransactionMappingCode.pending]: (state) => {
      state.loading = true;
      state.data_mappingItemTransactionMappingCode = [];
    },
    [getMappingItemTransactionMappingCode.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_mappingItemTransactionMappingCode = action.payload;
    },
    [getMappingItemTransactionMappingCode.rejected]: (state) => {
      state.loading = false;
      state.data_mappingItemTransactionMappingCode = [];
    },
  },
});

export const { resetApprovalState } = billingItemSlice.actions;

const { reducer } = billingItemSlice;
export default reducer;
