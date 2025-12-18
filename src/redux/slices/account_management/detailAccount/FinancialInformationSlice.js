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
  data_paymentRelation: [],
  data_invoiceRelation: [],
  data_firstIndexIdentifier: [],
  data_taxRelationFirstIndex: [],
  data_prApprovalHierarchy: [],
  detail_prApprovalHierarchy: [],
  data_prAttachmentCategory: [],
  data_prAccountStandard: [],
  data_irApprovalHierarchy: [],
  detail_irApprovalHierarchy: [],
  data_irAttachmentCategory: [],
  data_irAccountStandard: [],
  detail_taxImplication: {},
  detail_paymentRelation: {},
  data_paymentRelationAttachment: [],
  detail_invoiceRelation: {},
  data_invoiceRelationAttachment: [],
  data_prApprovalHistory: {},
  data_irApprovalHistory: {},
  data_globalTypeCondition: [],
  data_globalTypeOperator: [],
  data_globalTypeColumn: [],
  data_irApprovalHistory: {},
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
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/list/${id}`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body, {
          headers: { "Accept": "application/json, text/plain, */*" }
        });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getPaymentRelationAttachment = createAsyncThunk(
  "GET_PAYMENT_RELATION_ATTACHMENT",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/list-attachment/${id}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const createPaymentRelation = createAsyncThunk(
  "CREATE_PAYMENT_RELATION",
  async ({ body: createBody, attachments = [] }, thunkAPI) => {
    try {
      const createUrl = "/v1/dbs/api/payment-relation/create";
      const response = await accountManagementService.createData(createUrl, createBody);

      const { id } = response.data;

      const uploadUrl = `/v1/dbs/api/payment-relation/upload-attachment`;

      const uploadPromises = attachments.map((attachment) => accountManagementService.uploadAttachment(uploadUrl, {
        files:  attachment.file,
        category: attachment.fileCategoryId,
        refId: id,
      }));

      await Promise.all(uploadPromises);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${createBody?.action === "DRAFT" ? 'drafted' : 'submitted'}.`,
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
          description: `Your data was not ${createBody?.action === "DRAFT" ? 'drafted' : 'submitted'}. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${createBody?.action === "DRAFT" ? 'drafted' : 'submitted'}. An unknown error occured.`
        }
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const updatePaymentRelation = createAsyncThunk(
  "UPDATE_PAYMENT_RELATION",
  async ({ id, body: updateBody, attachments = [] }, thunkAPI) => {
    try {
      const updateUrl = `/v1/dbs/api/payment-relation/${id}`;
      const response = await accountManagementService.updateData(updateUrl, updateBody);

      const uploadUrl = `/v1/dbs/api/payment-relation/upload-attachment`;

      const uploadPromises = attachments.map((attachment) => accountManagementService.uploadAttachment(
        uploadUrl,
        {
          files:  attachment.file,
          category: attachment.fileCategoryId,
          refId: id,
        }
      ));

      await Promise.all(uploadPromises);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${updateBody?.action === "DRAFT" ? 'drafted' : 'updated'}.`,
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
          description: `Your data was not ${updateBody?.action === "DRAFT" ? 'drafted' : 'updated'}. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${updateBody?.action === "DRAFT" ? 'drafted' : 'submitted'}. An unknown error occured.`
        }
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDetailPaymentRelation = createAsyncThunk(
  "GET_DETAIL_PAYMENT_RELATION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getInvoiceRelation = createAsyncThunk(
  "GET_INVOICE_RELATION",
  async ({ id, body, page, size, sort, searchs }, thunkAPI) => {
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

export const getInvoiceRelationAttachment = createAsyncThunk(
  "GET_INVOICE_RELATION_ATTACHMENT",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/list-attachment/${id}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const createInvoiceRelation = createAsyncThunk(
  "CREATE_INVOICE_RELATION",
  async ({ body: createBody, attachments = [] }, thunkAPI) => {
    try {
      const createUrl = "/v1/dbs/api/invoice-relation/create";
      const response = await accountManagementService.createData(createUrl, createBody);

      const { id } = response.data;

      const uploadUrl = `v1/dbs/api/invoice-relation/upload-attachment/${id}`;

      const uploadPromises = attachments.map((attachment) => accountManagementService.uploadAttachment(
        uploadUrl,
        {
          file:  attachment.file,
          category: attachment.fileCategoryId,
        }
      ));

      await Promise.all(uploadPromises);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${createBody?.action === "DRAFT" ? 'drafted' : 'submitted'}.`,
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
        description: `Your data was not ${createBody?.action === "DRAFT" ? 'drafted' : 'submitted'}. ${message}.`,
      };
      
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const updateInvoiceRelation = createAsyncThunk(
  "UPDATE_INVOICE_RELATION",
  async ({ id, body: updateBody, attachments = [] }, thunkAPI) => {
    try {
      const updateUrl = `/v1/dbs/api/invoice-relation/${id}`;
      const response = await accountManagementService.updateData(updateUrl, updateBody);

      const uploadUrl = `v1/dbs/api/invoice-relation/upload-attachment/${id}`;

      const uploadPromises = attachments.map((attachment) => accountManagementService.uploadAttachment(
        uploadUrl,
        {
          file:  attachment.file,
          category: attachment.fileCategoryId,
        }
      ));

      await Promise.all(uploadPromises);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${updateBody?.action === "DRAFT" ? 'drafted' : 'updated'}.`,
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
        description: `Your data was not ${updateBody?.action === "DRAFT" ? 'drafted' : 'submitted'}. ${message}.`,
      };
      
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDetailInvoiceRelation = createAsyncThunk(
  "GET_DETAIL_INVOICE_RELATION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/detail/${id}`;
      const response = await accountManagementService.getDetail(url);
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

export const getPrApprovalHierarchy = createAsyncThunk(
  "GET_PR_APPROVAL_HIERARCHY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/approval-hierarchies`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getDetailPrApprovalHierarchy = createAsyncThunk(
  "GET_DETAIL_PR_APPROVAL_HIERARCHY",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/approval-hierarchy/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getPrAttachmentCategory = createAsyncThunk(
  "GET_PR_ATTACHMENT_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/attachment-category`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getPrAccountStandard = createAsyncThunk(
  "GET_PR_ACCOUNT_STANDARD",
  async ({ page, pageSize, sort, search, id }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;

      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/payment-relation/list-account/${id}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getIrApprovalHierarchy = createAsyncThunk(
  "GET_IR_APPROVAL_HIERARCHY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/approval-hierarchies`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getDetailIrApprovalHierarchy = createAsyncThunk(
  "GET_DETAIL_IR_APPROVAL_HIERARCHY",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/approval-hierarchy/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getIrAttachmentCategory = createAsyncThunk(
  "GET_IR_ATTACHMENT_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/attachment-category`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getIrAccountStandard = createAsyncThunk(
  "GET_IR_ACCOUNT_STANDARD",
  async ({ page, pageSize, sort, search, id }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;

      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/invoice-relation/list-account/${id}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
)

export const approveOrRejectPaymentRelation = createAsyncThunk(
  "APPROVE_OR_REJECT_PAYMENT_RELATION",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-relation/approve";
      const response = await accountManagementService.activationWithRemark(url, body);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "approve" ? "approved" : "rejected"}.`,
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
          description: `Your data was not ${action === "approve" ? "approved" : "rejected"}. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${action === "approve" ? "approved" : "rejected"}. An unknown error occured.`
        }
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const approveOrRejectInactivePaymentRelation = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_PAYMENT_RELATION",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-relation/approve-inactive";
      const response = await accountManagementService.activationWithRemark(url, body);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "approve" ? "approved" : "rejected"}.`,
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
          description: `Your data was not ${action === "approve" ? "approved" : "rejected"}. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${action === "approve" ? "approved" : "rejected"}. An unknown error occured.`
        }
        thunkAPI.dispatch(showModalError(errorBody));
      }
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
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/export-excel?search=${search}&page=
      ${page}&size=${pageSize}&sort=${sort}`;
      const response = await accountManagementService.downloadData(url, {
        headers: { "Accept": "application/json" }
      });
      return response.data;
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

export const getPrColumnApi = createAsyncThunk(
  "GET_PR_COLUMN_API",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-relation/list-search-column";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getPrConditionApi = createAsyncThunk(
  "GET_PR_CONDITION_API",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-relation/list-search-condition";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getPrOperatorApi = createAsyncThunk(
  "GET_PR_OPERATOR_API",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-relation/list-search-operator";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

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
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/export-excel?search=${search}&page=
      ${page}&size=${pageSize}&sort=${sort}`;
      const response = await accountManagementService.downloadData(url, {
        headers: { "Accept": "application/json" }
      });
      return response.data;
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

export const getIrColumnApi = createAsyncThunk(
  "GET_IR_COLUMN_API",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/list-search-column";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getIrConditionApi = createAsyncThunk(
  "GET_IR_CONDITION_API",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/list-search-condition";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getIrOperatorApi = createAsyncThunk(
  "GET_IR_OPERATOR_API",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/list-search-operator";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

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
    [getPaymentRelation.pending]: (state) => {
      state.loading = true;
    },
    [getPaymentRelation.fulfilled]: (state, action) => {
      state.data_paymentRelation = action.payload;
      state.loading = false;
    },
    [getPaymentRelation.rejected]: (state) => {
      state.data_paymentRelation = [];
      state.loading = false;
    },

    /** Get Detail Payment Relation */
    [getDetailPaymentRelation.pending]: (state, action) => {
      state.detail_paymentRelation = action.payload;
      state.loading = true;
    },
    [getDetailPaymentRelation.fulfilled]: (state, action) => {
      state.detail_paymentRelation = action.payload;
      state.loading = false;
    },
    [getDetailPaymentRelation.rejected]: (state, action) => {
      state.detail_paymentRelation = action.payload;
      state.loading = false;
    },

    /** Create Payment Relation */
    [createPaymentRelation.pending]: (state) => {
      state.loading = true;
    },
    [createPaymentRelation.fulfilled]: (state) => {
      state.loading = false;
    },
    [createPaymentRelation.pending]: (state) => {
      state.loading = false;
    },

    /** Update Payment Relation */
    [updatePaymentRelation.pending]: (state) => {
      state.loading = true;
    },
    [updatePaymentRelation.fulfilled]: (state) => {
      state.loading = false;
    },
    [updatePaymentRelation.pending]: (state) => {
      state.loading = false;
    },

    /** Get Invoice Relation */
    [getInvoiceRelation.pending]: (state) => {
      state.loading = true;
    },
    [getInvoiceRelation.fulfilled]: (state, action) => {
      state.data_invoiceRelation = action.payload;
      state.loading = false;
    },
    [getInvoiceRelation.rejected]: (state) => {
      state.data_invoiceRelation = [];
      state.loading = false;
    },

    /** Get Detail Invoice Relation */
    [getDetailInvoiceRelation.pending]: (state) => {
      state.loading = true;
    },
    [getDetailInvoiceRelation.fulfilled]: (state, action) => {
      state.detail_invoiceRelation = action.payload;
      state.loading = false;
    },
    [getDetailInvoiceRelation.rejected]: (state) => {
      state.loading = false;
    },

    /** Create Invoice Relation */
    [createInvoiceRelation.pending]: (state) => {
      state.loading = true;
    },
    [createInvoiceRelation.fulfilled]: (state) => {
      state.loading = false;
    },
    [createInvoiceRelation.pending]: (state) => {
      state.loading = false;
    },

    /** Update Invoice Relation */
    [updateInvoiceRelation.pending]: (state) => {
      state.loading = true;
    },
    [updateInvoiceRelation.fulfilled]: (state) => {
      state.loading = false;
    },
    [updateInvoiceRelation.pending]: (state) => {
      state.loading = false;
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

    /** Get Payment Relation Approval Hierarchy */
    [getPrApprovalHierarchy.pending]: (state) => {
      state.loading = true;
    },
    [getPrApprovalHierarchy.fulfilled]: (state, action) => {
      state.data_prApprovalHierarchy = action.payload;
      state.loading = false;
    },
    [getPrApprovalHierarchy.rejected]: (state) => {
      state.data_prApprovalHierarchy = [];
      state.loading = false;
    },

    /** Get Payment Relation Detail Approval Hierarchy */
    [getDetailPrApprovalHierarchy.pending]: (state) => {
      state.loading = true;
    },
    [getDetailPrApprovalHierarchy.fulfilled]: (state, action) => {
      state.detail_prApprovalHierarchy = action.payload;
      state.loading = false;
    },
    [getDetailPrApprovalHierarchy.rejected]: (state) => {
      state.detail_prApprovalHierarchy = [];
      state.loading = false;
    },

    /** Get Payment Relation Attachment Category */
    [getPrAttachmentCategory.pending]: (state) => {
      state.loading = true;
    },
    [getPrAttachmentCategory.fulfilled]: (state, action) => {
      state.data_prAttachmentCategory = action.payload;
      state.loading = false;
    },
    [getPrAttachmentCategory.rejected]: (state) => {
      state.data_prAttachmentCategory = [];
      state.loading = false;
    },

    /** Get Payment Relation Account Standard */
    [getPrAccountStandard.pending]: (state) => {
      state.loading = true;
    },
    [getPrAccountStandard.fulfilled]: (state, action) => {
      state.data_prAccountStandard = action.payload;
      state.loading = false;
    },
    [getPrAccountStandard.rejected]: (state) => {
      state.data_prAccountStandard = [];
      state.loading = false;
    },

    /** Get Payment Relation Attachment */
    [getPaymentRelationAttachment.pending]: (state) => {
      state.loading = true;
    },
    [getPaymentRelationAttachment.fulfilled]: (state, action) => {
      state.data_paymentRelationAttachment = action.payload;
      state.loading = false;
    },
    [getPaymentRelationAttachment.rejected]: (state) => {
      state.data_paymentRelationAttachment = [];
      state.loading = false;
    },

    /** Approve or Reject Payment Relation */
    [approveOrRejectPaymentRelation.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectPaymentRelation.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectPaymentRelation.rejected]: (state) => {
      state.loading = false;
    },

    /** Approve or Reject Inactive Payment Relation */
    [approveOrRejectInactivePaymentRelation.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectInactivePaymentRelation.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectInactivePaymentRelation.rejected]: (state) => {
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

    /** Get Invoice Relation Approval Hierarchy */
    [getIrApprovalHierarchy.pending]: (state) => {
      state.loading = true;
    },
    [getIrApprovalHierarchy.fulfilled]: (state, action) => {
      state.data_irApprovalHierarchy = action.payload;
      state.loading = false;
    },
    [getIrApprovalHierarchy.rejected]: (state) => {
      state.data_irApprovalHierarchy = [];
      state.loading = false;
    },

    /** Get Invoice Relation Detail Approval Hierarchy */
    [getDetailIrApprovalHierarchy.pending]: (state) => {
      state.loading = true;
    },
    [getDetailIrApprovalHierarchy.fulfilled]: (state, action) => {
      state.detail_irApprovalHierarchy = action.payload;
      state.loading = false;
    },
    [getDetailIrApprovalHierarchy.rejected]: (state) => {
      state.detail_irApprovalHierarchy = [];
      state.loading = false;
    },

    /** Get Invoice Relation Attachment */
    [getInvoiceRelationAttachment.pending]: (state) => {
      state.loading = true;
    },
    [getInvoiceRelationAttachment.fulfilled]: (state, action) => {
      state.data_invoiceRelationAttachment = action.payload;
      state.loading = false;
    },
    [getInvoiceRelationAttachment.rejected]: (state) => {
      state.data_invoiceRelationAttachment = [];
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
    /** Get Payment Relation Column API  */
    [getPrColumnApi.pending]: (state) => {
      state.loading = true;
    },
    [getPrColumnApi.fulfilled]: (state, action) => {
      state.data_globalTypeColumn = action.payload;
      state.loading = false;
    },
    [getPrColumnApi.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Payment Relation Condition API  */
    [getPrConditionApi.pending]: (state) => {
      state.loading = true;
    },
    [getPrConditionApi.fulfilled]: (state, action) => {
      state.data_globalTypeCondition = action.payload;
      state.loading = false;
    },
    [getPrConditionApi.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Payment Relation Operator API  */
    [getPrOperatorApi.pending]: (state) => {
      state.loading = true;
    },
    [getPrOperatorApi.fulfilled]: (state, action) => {
      state.data_globalTypeOperator = action.payload;
      state.loading = false;
    },
    [getPrOperatorApi.rejected]: (state) => {
      state.loading = false
    },

    /** Get Invoice Relation Attachment Category */
    [getIrAttachmentCategory.pending]: (state) => {
      state.loading = true;
    },
    [getIrAttachmentCategory.fulfilled]: (state, action) => {
      state.data_irAttachmentCategory = action.payload;
      state.loading = false;
    },
    [getIrAttachmentCategory.rejected]: (state) => {
      state.data_irAttachmentCategory = [];
      state.loading = false;
    },

    /** Get Invoice Relation Account Standard */
    [getIrAccountStandard.pending]: (state) => {
      state.loading = true;
    },
    [getIrAccountStandard.fulfilled]: (state, action) => {
      state.data_irAccountStandard = action.payload;
      state.loading = false;
    },
    [getIrAccountStandard.rejected]: (state) => {
      state.data_irAccountStandard = [];
      state.loading = false;
    },

    /** Get Invoice Relation Column API  */
    [getIrColumnApi.pending]: (state) => {
      state.loading = true;
    },
    [getIrColumnApi.fulfilled]: (state, action) => {
      state.data_globalTypeColumn = action.payload;
      state.loading = false;
    },
    [getIrColumnApi.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Invoice Relation Condition API  */
    [getIrConditionApi.pending]: (state) => {
      state.loading = true;
    },
    [getIrConditionApi.fulfilled]: (state, action) => {
      state.data_globalTypeCondition = action.payload;
      state.loading = false;
    },
    [getIrConditionApi.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Invoice Relation Operator API  */
    [getIrOperatorApi.pending]: (state) => {
      state.loading = true;
    },
    [getIrOperatorApi.fulfilled]: (state, action) => {
      state.data_globalTypeOperator = action.payload;
      state.loading = false;
    },
    [getIrOperatorApi.rejected]: (state) => {
      state.loading = false
    },
  },
});
const { reducer } = financialInformationSlice;
export default reducer;
