import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import { showModalError, showModalSuccess } from "../../general_slice";

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
  data_firstIndexIdentifier: [],
  data_taxRelationFirstIndex: [],
  data_prApprovalHierarchy: [],
  detail_prApprovalHierarchy: [],
  data_prAttachmentCategory: [],
  data_prAccountStandard: [],
  detail_taxImplication: {},
  detail_paymentRelation: {},
  isPrSuccess: false,
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
  async ({page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/list?page=${page}&size=${pageSize}${
        sort ? `&sort=${sort}` : ""
      }${search ? `&searchs=${search}` : ""}`;
      const response = await accountManagementService.getPagination(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const createPaymentRelation = createAsyncThunk(
  "CREATE_PAYMENT_RELATION",
  async ({ body: createBody, attachments = [] }, thunkAPI) => {
    try {
      const createUrl = "/v1/dbs/api/payment-relation/create";
      const response = await accountManagementService.createData(createUrl, createBody);

      const { id } = response.data;

      const uploadUrl = `v1/dbs/api/payment-relation/upload-attachment/${id}`;

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
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/${id}`;
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${body?.action === "DRAFT" ? 'drafted' : 'updated'}.`,
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
          description: `Your data was not ${body?.action === "DRAFT" ? 'drafted' : 'updated'}. ${message}.`,
        };
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
      const url = `/v1/dbs/api/payment-relation/${id}`;
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
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/account/list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
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
      state.data_paymentRelation = action.payload;
      state.loading = true;
    },
    [getDetailPaymentRelation.fulfilled]: (state, action) => {
      state.data_paymentRelation = action.payload;
      state.loading = false;
    },
    [getDetailPaymentRelation.rejected]: (state, action) => {
      state.data_paymentRelation = action.payload;
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
      state.isPrSuccess = false;
      state.loading = true;
    },
    [updatePaymentRelation.fulfilled]: (state) => {
      state.isPrSuccess = true;
      state.loading = false;
    },
    [updatePaymentRelation.pending]: (state) => {
      state.isPrSuccess = false;
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

    /** Get PR Approval Hierarchy */
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

    /** Get PR Detail Approval Hierarchy */
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

    /** Get PR Attachment Category */
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

    /** Get PR Account Standard */
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
  },
});
const { reducer } = financialInformationSlice;
export default reducer;
