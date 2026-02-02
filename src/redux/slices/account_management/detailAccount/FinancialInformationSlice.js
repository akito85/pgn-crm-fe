import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import { setBodyError, showModalError, showModalSuccess, validateError } from "../../general_slice";

const initialState = {
  loading: false,
  data_withHoldingTax: [],
  data_taxIdentifier: [],
  data_taxRelation: [],
  data_paymentChannel: {},
  data_globalTypePaymentChannel: [],
  data_address_taxIdentifier: [],
  data_choose_taxRelation: [],
  data_taxImplication: [],
  data_billingBucket: [],
  data_accountingRule: {},
  data_globalTypeTaxIdentifier: [],
  list_paymentRelation: [],
  pagination_paymentRelation: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },
  list_paymentRelationApproval: [],
  pagination_paymentRelationApproval: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },
  list_invoiceRelation: [],
  pagination_invoiceRelation: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },
  data_firstIndexIdentifier: [],
  data_taxRelationFirstIndex: [],
  detail_taxImplication: {},
  data_prApprovalHistory: {},
  data_irApprovalHistory: {},
  data_globalTypeCondition: [],
  data_globalTypeOperator: [],
  data_globalTypeColumn: [],
};

export const getGlobalTypeTaxIdentifier= createAsyncThunk(
  "GET_GLOBAL_TYPE_TAX_IDENTIFIER",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-identifier/getTaxIdentifierType`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getWithHoldingTax = createAsyncThunk(
  "GET_WITHHOLDING_TAX",
  async ({ id, page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/withholding-tax/view/${id}?page=${page}&size=${pageSize}${
        sort ? `&sort=${sort}` : ""
      }${search ? `&searchs=${search}` : ""}`;
      // console.log(`${url} + ${id}`);
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);


export const getWithHoldingTaxFirstIndex = createAsyncThunk(
  "GET_WITHHOLDING_TAX_FIRST_INDEX",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/withholding-tax/view/${id}?page=1&size=10`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getTaxRelationFirstIndex = createAsyncThunk(
  "GET_TAX_RELATION_FIRST_INDEX",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-relation/listRelation/${id}?page=1&size=10`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const createWitholdingTax = createAsyncThunk(
  "CREATE_WITHHOLDING_TAX",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/withholding-tax/create`;
      const response = await accountManagementService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Your data has been updated.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      //if error code for with validation
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not updated. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const inActiveWitholdingTax = createAsyncThunk(
  "INACTIVE_WITHHOLDING_TAX",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/withholding-tax/inactive`;
      const response = await accountManagementService.updateData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Your data has been inactivate.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      //if error code for with validation
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not inactivate. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

//tax identifier
export const getTaxIdentifier = createAsyncThunk(
  "GET_TAX_IDENTIFIER",
  async ({ id, page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-identifier/listTax/${id}?page=${page}&size=${pageSize}${
        sort ? `&sort=${sort}` : ""
      }${search ? `&search=${search}` : ""}`;
      const response = await accountManagementService.getPagination(url);
      // console.log(`${url} + ${id}`);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const createTaxIdentifier = createAsyncThunk(
  "CREATE_TAX_IDENTIFIER",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-identifier/create`;
      const response = await accountManagementService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Your data has been created.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      //if error code for with validation
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not created. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// external
export const getListDetailAccountAddress = createAsyncThunk(
  "GET_LIST_DETAIL_ACCOUNT_ADDRESS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-identifier/getAddressTax/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

//payment Channel
export const getPaymentChannel = createAsyncThunk(
  "GET_PAYMENT_CHANNEL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/getPaymentChannel/${id}`;
      const response = await accountManagementService.getDetail(url);
      // console.log(`${response}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const updatePaymentChannel = createAsyncThunk(
  "UPDATE_PAYMENT_CHANNEL",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/updatePaymentChannel`;
      const response = await accountManagementService.updateData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Your data has been updated.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      //if error code for with validation
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not updated. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getGlobalTypePaymentChannel = createAsyncThunk(
  "GET_GLOBAL_TYPE_PAYMENT_CHANNEL",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/getPaymentChannelType`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

//tax relation
export const getTaxRelation = createAsyncThunk(
  "GET_TAX_RELATION",
  async ({ id, page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-relation/listRelation/${id}?page=${page}&size=${pageSize}${
        sort ? `&sort=${sort}` : ""
      }${search ? `&searchs=${search}` : ""}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getChooseTaxRelation = createAsyncThunk(
  "GET_CHOOSE_TAX_RELATION",
  async ({ id, page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-relation/ChooseTax/${id}?page=${page}&size=${pageSize}${
        sort ? `&sort=${sort}` : ""
      }${search ? `&search=${search}` : ""}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const createTaxRelation = createAsyncThunk(
  "CREATE_TAX_RELATION",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-relation/create`;
      const response = await accountManagementService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Your data has been created.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      //if error code for with validation
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not created. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const inActiveTaxRelation = createAsyncThunk(
  "INACTIVE_TAX_RELATION",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-relation/inactive`;
      const response = await accountManagementService.updateData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Your data has been inactivate.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      //if error code for with validation
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not inactivate. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getTaxImplication = createAsyncThunk(
  "GET_TAX_IMPLICATION",
  async ({id, page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/list/${id}?page=${page}&size=${pageSize}${
        sort ? `&sort=${sort}` : ""
      }${search ? `&searchs=${search}` : ""}`;
      const response = await accountManagementService.getPagination(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDetailTaxImplication = createAsyncThunk(
  "GET_DETAIL_TAX_IMPLICATION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getPaymentRelation = createAsyncThunk(
  "GET_PAYMENT_RELATION",
  async ({ id, body, isLoadMore }, thunkAPI) => {
    try {
      body = {
        ...body,
        listType: "all"
      }

      const url = `/v1/dbs/api/payment-relation/list/${id}`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body, {
          headers: { "Accept": "application/json, text/plain, */*" }
        });
      return {
        ...response.data,
        isLoadMore,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getPaymentRelationApproval = createAsyncThunk(
  "GET_PAYMENT_RELATION_APPROVAL",
  async ({ id, body, isLoadMore }, thunkAPI) => {
    try {
      body = {
        ...body,
        listType: "approval"
      }

      const url = `/v1/dbs/api/payment-relation/list/${id}`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body, {
          headers: { "Accept": "application/json, text/plain, */*" }
        });
      return {
        ...response.data,
        isLoadMore,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getInvoiceRelation = createAsyncThunk(
  "GET_INVOICE_RELATION",
  async ({ id, body, page, size, sort, searchs, listType }, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams;

      if (page)
        queryParams.append("page", page);
      if (size)
        queryParams.append("size", size);
      if (sort)
        queryParams.append("sort", sort);
      if (searchs)
        queryParams.append("searchs", searchs);
      if (listType)
        queryParams.append("listType", listType);

      let url = `/v1/dbs/api/invoice-relation/list/${id}`;

      if (queryParams.toString().length)
        url += `?${queryParams.toString()}`;

      const response = await accountManagementService.updateDataWithMethodPost(url, body, {
        headers: { "Accept": "application/json, text/plain, */*" }
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getBillingBucket = createAsyncThunk(
  "GET_BILLING_BUCKET",
  async ({ id, page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing-bucket/list/${id}?page=${page}&size=${pageSize}${
        sort ? `&sort=${sort}` : ""
      }${search ? `&searchs=${search}` : ""}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getAccountingRule = createAsyncThunk(
  "GET_ACCOUNTING_RULE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/accounting-rule/get/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const approveOrRejectAllPaymentRelation = createAsyncThunk(
  "APPROVE_OR_REJECT_ALL_PAYMENT_RELATION",
  async ({ body, inactiveBody, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-relation/approve";
      const inactiveUrl = "/v1/dbs/api/payment-relation/approve-inactive";
      
      await Promise.all([
        body.length ? accountManagementService.activationWithRemark(url, body, {
          headers: {
            "Accept": "application/json"
          }
        }) : null,
        inactiveBody.length ? accountManagementService.activationWithRemark(inactiveUrl, inactiveBody, {
          headers: {
            "Accept": "application/json"
          }
        }) : null,
      ]);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "APPROVE" ? 'approved' : 'rejected'}.`,
        return: false,
      };

      thunkAPI.dispatch(showModalSuccess(successBody))
      return null;
    } catch (error) {
      let message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) !== 4)
        message = "An unknown error occured"

      const errorBody = {
        title: "Failed",
        description: `Your data was not ${action === "APPROVE" ? 'approved' : 'rejected'}. ${message}.`,
      };

      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const inactivatePaymentRelation = createAsyncThunk(
  "INACTIVATE_PAYMENT_RELATION",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-relation/inactive";
      const response = await accountManagementService.activationWithRemark(url, body);

      const successBody = {
        title: `Successful`,
        description: `Your data has been submitted`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody))
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
        };
        thunkAPI.dispatch(showModalError(errorBody));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not submitted. An unknown error occured.`
        }
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const downloadPaymentRelation = createAsyncThunk(
  "DOWNLOAD_PAYMENT_RELATION",
  async ({ body, id, }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/export-excel/${id}`;
      const response = await accountManagementService.downloadDataAdvanced(url, body);
      return response;
    } catch (response) {
      thunkAPI.dispatch(validateError({ error: response, action: "DOWNLOAD_PAYMENT_RELATION", back: false }));
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const getPrApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_PAYMENT_RELATION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/approval-history/${id}`;
      const response = await accountManagementService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const approveOrRejectInvoiceRelation = createAsyncThunk(
  "APPROVE_OR_REJECT_INVOICE_RELATION",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/approve";
      const response = await accountManagementService.activationWithRemark(url, body);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "approve" ? 'approved' : 'rejected'}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody))
      return response.data;
    } catch (error) {
      let message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      if (Math.floor((error.response.data.code || 0) / 100) !== 4)
        message = "An unknown error occured";

      const errorBody = {
        title: "Failed",
        description: `Your data was not ${action === "approve" ? 'approved' : 'rejected'}. ${message}.`,
      };

      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const approveOrRejectInactiveInvoiceRelation = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_INVOICE_RELATION",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/approve-inactive";
      const response = await accountManagementService.activationWithRemark(url, body);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "approve" ? 'approved' : 'rejected'}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody))
      return response.data;
    } catch (error) {
      let message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      if (Math.floor((error.response.data.code || 0) / 100) !== 4)
        message = "An unknown error occured";

      const errorBody = {
        title: "Failed",
        description: `Your data was not ${action === "approve" ? 'approved' : 'rejected'}. ${message}.`,
      };

      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const approveOrRejectAllInvoiceRelation = createAsyncThunk(
  "APPROVE_OR_REJECT_ALL_INVOICE_RELATION",
  async ({ body, inactiveBody, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/approve";
      const inactiveUrl = "/v1/dbs/api/invoice-relation/approve-inactive";
      
      await Promise.all([
        body.length ? accountManagementService.activationWithRemark(url, body, {
          headers: {
            "Accept": "application/json"
          }
        }) : null,
        inactiveBody.length ? accountManagementService.activationWithRemark(inactiveUrl, inactiveBody, {
          headers: {
            "Accept": "application/json"
          }
        }) : null,
      ])

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "APPROVE" ? 'approved' : 'rejected'}.`,
        return: false,
      };

      thunkAPI.dispatch(showModalSuccess(successBody))
      return null;
    } catch (error) {
      let message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      if (Math.floor((error.response.data.code || 0) / 100) !== 4)
        message = "An unknown error occured";

      const errorBody = {
        title: "Failed",
        description: `Your data was not ${action === "APPROVE" ? 'approved' : 'rejected'}. ${message}.`,
      };

      thunkAPI.dispatch(showModalError(errorBody));
      
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const inactivateInvoiceRelation = createAsyncThunk(
  "INACTIVATE_INVOICE_RELATION",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/inactive";
      const response = await accountManagementService.activationWithRemark(url, body);

      const successBody = {
        title: `Successful`,
        description: `Your data has been submitted`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody))
      return response.data;
    } catch (error) {
      let message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      if (Math.floor((error.response.data.code || 0) / 100) !== 4)
        message = "An unknown error occured";

      const errorBody = {
        title: "Failed",
        description: `Your data was not submitted. ${message}.`,
      };

      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const downloadInvoiceRelation = createAsyncThunk(
  "DOWNLOAD_INVOICE_RELATION",
  async ({ searchs, page, size, sort, id, body }, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams;

      if (page)
        queryParams.append("page", page);
      if (size)
        queryParams.append("size", size);
      if (sort)
        queryParams.append("sort", sort);
      if (searchs)
        queryParams.append("searchs", searchs);

      const url = `/v1/dbs/api/invoice-relation/export-excel/${id}`;
      const response = await accountManagementService.downloadDataAdvanced(url, body);
      return response;
    } catch (response) {
      thunkAPI.dispatch(validateError({ error: response, action: "DOWNLOAD_INVOICE_RELATION", back: false }));
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const getIrApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_INVOICE_RELATION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/approval-history/${id}`;
      const response = await accountManagementService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const financialInformationSlice = createSlice({
  name: "financialInformation",
  initialState,
  extraReducers: {
    /** WitholdingTax */
    [getWithHoldingTax.pending]: (state, action) => {
      state.data_withHoldingTax = action.payload;
      state.loading = true;
    },
    [getWithHoldingTax.fulfilled]: (state, action) => {
      state.data_withHoldingTax = action.payload;
      state.loading = false;
    },
    [getWithHoldingTax.rejected]: (state, action) => {
      state.data_withHoldingTax = action.payload;
      state.loading = false;
    },

    [getWithHoldingTaxFirstIndex.pending]: (state, action) => {
      state.data_withHoldingTaxFirstIndex = action.payload;
      state.loading = true;
    },
    [getWithHoldingTaxFirstIndex.fulfilled]: (state, action) => {
      state.data_withHoldingTaxFirstIndex = action.payload;
      state.loading = false;
    },
    [getWithHoldingTaxFirstIndex.rejected]: (state, action) => {
      state.data_withHoldingTaxFirstIndex = action.payload;
      state.loading = false;
    },
    
    [getTaxRelationFirstIndex.pending]: (state, action) => {
      state.data_taxRelationFirstIndex = action.payload;
      state.loading = true;
    },
    [getTaxRelationFirstIndex.fulfilled]: (state, action) => {
      state.data_taxRelationFirstIndex = action.payload;
      state.loading = false;
    },
    [getTaxRelationFirstIndex.rejected]: (state, action) => {
      state.data_taxRelationFirstIndex = action.payload;
      state.loading = false;
    },

    /** Tax Identifier */
    [getTaxIdentifier.pending]: (state, action) => {
      state.data_taxIdentifier = action.payload;
      state.loading = true;
    },
    [getTaxIdentifier.fulfilled]: (state, action) => {
      state.data_taxIdentifier = action.payload;
      state.loading = false;
    },
    [getTaxIdentifier.rejected]: (state, action) => {
      state.data_taxIdentifier = action.payload;
      state.loading = false;
    },

    /** Tax Relation */
    [getTaxRelation.pending]: (state, action) => {
      state.data_taxRelation = action.payload;
      state.loading = true;
    },
    [getTaxRelation.fulfilled]: (state, action) => {
      state.data_taxRelation = action.payload;
      state.loading = false;
    },
    [getTaxRelation.rejected]: (state, action) => {
      state.data_taxRelation = action.payload;
      state.loading = false;
    },

    [getChooseTaxRelation.pending]: (state, action) => {
      state.data_choose_taxRelation = action.payload;
      state.loading = true;
    },
    [getChooseTaxRelation.fulfilled]: (state, action) => {
      state.data_choose_taxRelation = action.payload;
      state.loading = false;
    },
    [getChooseTaxRelation.rejected]: (state, action) => {
      state.data_choose_taxRelation = action.payload;
      state.loading = false;
    },
    //external
    [getListDetailAccountAddress.pending]: (state, action) => {
      state.data_address_taxIdentifier = action.payload;
      state.loading = true;
    },
    [getListDetailAccountAddress.fulfilled]: (state, action) => {
      state.data_address_taxIdentifier = action.payload;
      state.loading = false;
    },
    [getListDetailAccountAddress.rejected]: (state, action) => {
      state.data_address_taxIdentifier = action.payload;
      state.loading = false;
    },

    [getGlobalTypeTaxIdentifier.pending]: (state, action) => {
      state.data_globalTypeTaxIdentifier = action.payload;
      state.loading = true;
    },
    [getGlobalTypeTaxIdentifier.fulfilled]: (state, action) => {
      state.data_globalTypeTaxIdentifier = action.payload;
      state.loading = false;
    },
    [getGlobalTypeTaxIdentifier.rejected]: (state, action) => {
      state.ddata_globalTypeTaxIdentifier = action.payload;
      state.loading = false;
    },

    /** PaymentChannel */
    [getPaymentChannel.pending]: (state, action) => {
      state.data_paymentChannel = action.payload;
      state.loading = true;
    },
    [getPaymentChannel.fulfilled]: (state, action) => {
      state.data_paymentChannel = action.payload;
      state.loading = false;
    },
    [getPaymentChannel.rejected]: (state, action) => {
      state.ddata_paymentChannel = action.payload;
      state.loading = false;
    },
    [getGlobalTypePaymentChannel.pending]: (state, action) => {
      state.data_globalTypePaymentChannel = action.payload;
      state.loading = true;
    },
    [getGlobalTypePaymentChannel.fulfilled]: (state, action) => {
      state.data_globalTypePaymentChannel = action.payload;
      state.loading = false;
    },
    [getGlobalTypePaymentChannel.rejected]: (state, action) => {
      state.data_globalTypePaymentChannel = action.payload;
      state.loading = false;
    },

    /** Tax Implication */
    [getTaxImplication.pending]: (state, action) => {
      state.data_taxImplication = action.payload;
      state.loading = true;
    },
    [getTaxImplication.fulfilled]: (state, action) => {
      state.data_taxImplication = action.payload;
      state.loading = false;
    },
    [getTaxImplication.rejected]: (state, action) => {
      state.data_taxImplication = action.payload;
      state.loading = false;
    },

    /** Detail Tax Implication */
    [getDetailTaxImplication.pending]: (state, action) => {
      state.detail_taxImplication = action.payload;
      state.loading = true;
    },
    [getDetailTaxImplication.fulfilled]: (state, action) => {
      state.detail_taxImplication = action.payload;
      state.loading = false;
    },
    [getDetailTaxImplication.rejected]: (state, action) => {
      state.detail_taxImplication = action.payload;
      state.loading = false;
    },

    /** Get Payment Relation */
    [getPaymentRelation.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getPaymentRelation.fulfilled]: (state, action) => {
      state.loading = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_paymentRelation.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_paymentRelation = [
            ...state.list_paymentRelation,
            ...filteredResult,
          ];
        }
        else
          state.list_paymentRelation = result;        
      }

      state.pagination_paymentRelation = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getPaymentRelation.rejected]: (state, action) => {
      state.loading = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_paymentRelation = [];
        state.pagination_paymentRelation = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Get Payment Relation Approval */
    [getPaymentRelationApproval.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getPaymentRelationApproval.fulfilled]: (state, action) => {
      state.loading = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_paymentRelationApproval.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_paymentRelationApproval = [
            ...state.list_paymentRelationApproval,
            ...filteredResult,
          ];
        }
        else
          state.list_paymentRelationApproval = result;        
      }

      state.pagination_paymentRelationApproval = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getPaymentRelationApproval.rejected]: (state, action) => {
      state.loading = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_paymentRelationApproval = [];
        state.pagination_paymentRelationApproval = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Get Invoice Relation */
    [getInvoiceRelation.pending]: (state) => {
      state.loading = true;
    },
    [getInvoiceRelation.fulfilled]: (state, action) => {
      state.loading = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_invoiceRelation.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_invoiceRelation = [
            ...state.list_invoiceRelation,
            ...filteredResult,
          ];
        }
        else
          state.list_invoiceRelation = result;        
      }

      state.pagination_invoiceRelation = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getInvoiceRelation.rejected]: (state, action) => {
      state.loading = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_invoiceRelation = [];
        state.pagination_invoiceRelation = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    //billing bucket
    [getBillingBucket.pending]: (state, action) => {
      state.data_billingBucket = action.payload;
      state.loading = true;
    },
    [getBillingBucket.fulfilled]: (state, action) => {
      state.data_billingBucket = action.payload;
      state.loading = false;
    },
    [getBillingBucket.rejected]: (state, action) => {
      state.data_billingBucket = action.payload;
      state.loading = false;
    },

    //Accounting Rule
    [getAccountingRule.pending]: (state, action) => {
      state.data_accountingRule = action.payload;
      state.loading = true;
    },
    [getAccountingRule.fulfilled]: (state, action) => {
      state.data_accountingRule = action.payload;
      state.loading = false;
    },
    [getAccountingRule.rejected]: (state, action) => {
      state.data_accountingRule = action.payload;
      state.loading = false;
    },
    
    /** Approve or Reject All Inactive Payment Relation */
    [approveOrRejectAllPaymentRelation.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectAllPaymentRelation.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectAllPaymentRelation.rejected]: (state) => {
      state.loading = false;
    },

    /** Inactivate Payment Relation Attachment */
    [inactivatePaymentRelation.pending]: (state) => {
      state.loading = true;
    },
    [inactivatePaymentRelation.fulfilled]: (state) => {
      state.loading = false;
    },
    [inactivatePaymentRelation.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Payment Relation Approval History */
    [getPrApprovalHistory.pending]: (state) => {
      state.loading = true;
    },
    [getPrApprovalHistory.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_prApprovalHistory = action.payload;
    },
    [getPrApprovalHistory.rejected]: (state) => {
      state.loading = false;
    },

    /** Approve or Reject Invoice Relation */
    [approveOrRejectInvoiceRelation.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectInvoiceRelation.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectInvoiceRelation.rejected]: (state) => {
      state.loading = false;
    },

    /** Approve or Reject Inactive Invoice Relation */
    [approveOrRejectInactiveInvoiceRelation.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectInactiveInvoiceRelation.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectInactiveInvoiceRelation.rejected]: (state) => {
      state.loading = false;
    },

    /** Approve or Reject All Inactive Invoice Relation */
    [approveOrRejectAllInvoiceRelation.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectAllInvoiceRelation.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectAllInvoiceRelation.rejected]: (state) => {
      state.loading = false;
    },

    /** Inactivate Invoice Relation Attachment */
    [inactivateInvoiceRelation.pending]: (state) => {
      state.loading = true;
    },
    [inactivateInvoiceRelation.fulfilled]: (state) => {
      state.loading = false;
    },
    [inactivateInvoiceRelation.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Invoice Relation Approval History */
    [getIrApprovalHistory.pending]: (state) => {
      state.loading = true;
    },
    [getIrApprovalHistory.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_irApprovalHistory = action.payload;
    },
    [getIrApprovalHistory.rejected]: (state) => {
        state.loading = false;
    },
  },
});
const { reducer } = financialInformationSlice;
export default reducer;
