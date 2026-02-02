import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showModalError } from "../../general_slice";
import { showModalSuccess } from "../../general_slice";
import accountManagementService from "../../../services/account_management/accountManagementService";

const initialState = {
  data: [],
  data_detail: {},
  data_detail_draft: {},
  data_service_type: [],
  data_sa_type: [],
  data_pjbg: [],
  data_product: [],
  data_product_detail: {},
  data_approval_list: [],
  data_approval_detail: [],
  data_term_of_payment: [],
  data_billing_cycle: [],
  data_invoice_template: [],
  data_tax_implication: [],
  data_price_rule: [],
  data_price_code: [],
  data_pricing_rule_list: [],
  data_list_choose_tos: [],
  data_category_attachment: [],
  data_late_charge: [],
  dataApprovalHistory: {},
  dataListAppHierDetail: [],
  dataListAppHierId: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
  message: "",
  isValidateSa: {},
  dataGlobalPropAttachment: {},
};

// Get list pagination SA
export const getListServiceAgreement = createAsyncThunk(
  "GET_LIST_SERVICE_AGREEMENT",
  async ({ search, id, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/sa/view/${id}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Detail  SA
export const getDetailServiceAgreement = createAsyncThunk(
  "GET_DETAIL_SERVICE_AGREEMENT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/view/detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Detail  SA DRAFT
export const getDetailServiceAgreementDraft = createAsyncThunk(
  "GET_DETAIL_SERVICE_AGREEMENT_DRAFT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/view/detail/draft/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Inactivate SA
export const inactiveSa = createAsyncThunk(
  "INACTIVATE_SERVICE_AGREEMENT",
  async ({ body, activeOrInactive }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/sa/inactive";
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been submitted.`,
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
      const errorBody = {
        title: "Failed",
        description: `Your data was not ${activeOrInactive}. ${message}. Please try again.`,
        return: false,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Delete Draft  SA
export const deleteDraftSa = createAsyncThunk(
  "DELETE_DRAFT_SA",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/delete/${id}`;
      const response = await accountManagementService.deleteData(url);
      const successBody = {
        title: `Successful`,
        description: `Your data has been Deleted.`,
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
      const errorBody = {
        title: "Failed",
        description: `Your data was not Deleted. ${message}. Please try again.`,
        return: false,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// CREATE SA
export const createServiceAgreement = createAsyncThunk(
  "CREATE_SERVICE_AGREEMENT",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/sa/create";
      const response = await accountManagementService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body?.isDraft ? "created" : "submitted"
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
          description: `Your data was not ${
            body?.isDraft ? "created" : "submitted"
          }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// UPDATE SA
export const updateServiceAgreement = createAsyncThunk(
  "UPDATE_SERVICE_AGREEMENT",
  async ({ body }, thunkAPI) => {
    try {
      console.log(body, " body");

      const url = "/v1/dbs/api/sa/update";
      const response = await accountManagementService.updateDataWithMethodPost(
        url,
        body
      );
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body?.isSubmit ? "submitted" : "updated"
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
          description: `Your data was not ${
            body?.isSubmit ? "submitted" : "updated"
          }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Detail Product SA
export const getDetailProductSa = createAsyncThunk(
  "GET_DETAIL_PRODUCT_BY_ID",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/ddl/listVersion`;
      const response = await accountManagementService.createData(url, body);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Detail Product By Version
export const getDetailProductByVersion = createAsyncThunk(
  "GET_DETAIL_PRODUCT_BY_PRODUCT_VERSION",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/ddl/product/detail/${body.id}/${body.accountId}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Approval History
export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/get-list-approval-history/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const approveOrRejectInactiveServiceAgreement = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_SERVICE_AGREEMENT",
  async ({ body, responseSuccess }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/sa/approveInactive";
      const response = await accountManagementService.activationWithRemark(
        url,
        body
      );
      thunkAPI.dispatch(showModalSuccess(responseSuccess));
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
);

export const approveOrRejectServiceAgreement = createAsyncThunk(
  "APPROVE_OR_REJECT_SERVICE_AGREEMENT",
  async ({ body, responseSuccess }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/sa/approve";
      const response = await accountManagementService.activationWithRemark(
        url,
        body
      );
      thunkAPI.dispatch(showModalSuccess(responseSuccess));
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
);

// ========== Dropdown List ===========
// Get Service Type
export const getServiceType = createAsyncThunk(
  "GET_SERVICE_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/ddl/serviceType`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
// Get Service Agreement Type
export const getSaType = createAsyncThunk(
  "GET_SERVICE_AGREEMENT_TYPE",
  async ({ type, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/ddl/saType/${type}/${id}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
// Get Service Agreement Type
export const getPjbg = createAsyncThunk("GET_PJBG_TYPE", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/sa/ddl/pjbgType`;
    const response = await accountManagementService.getAll(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

// Get List Product
export const getListProduct = createAsyncThunk(
  "GET_LIST_PRODUCT",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/ddl/getProduct/${body.idAccount}/${body.idProductType}/${body.serviceTypeId}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get List Product
export const getApprovalList = createAsyncThunk(
  "GET_APPROVAL_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/get-list-approval-hierarchies`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Detail Approval
export const getDetailApproval = createAsyncThunk(
  "GET_DETAIL_APPROVAL",
  async (id, thunkAPI) => {
    if (id !== null) {
      try {
        const url = `/v1/dbs/api/sa/get-approval-hierarchies/${id}`;
        const response = await accountManagementService.getAll(url);
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error?.response);
      }
    }
  }
);

export const getDetailApprovalInactive = createAsyncThunk(
  "GET_DETAIL_APPROVAL_INACTIVE",
  async ({ id }, thunkAPI) => {
    if (id !== null) {
      try {
        const url = `/v1/dbs/api/sa/get-approval-hierarchies/${id}`;
        const response = await accountManagementService.getAll(url);
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error?.response);
      }
    }
  }
);

// Get List Term of Payment
export const getListTermOfPayment = createAsyncThunk(
  "GET_LIST_TOP",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/ddl/termOfPayment/${id}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get List Billing Cycle
export const getListBillingCycle = createAsyncThunk(
  "GET_LIST_BILLING_CYCLE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/ddl/billingCycle`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get List Invoice Template
export const getInvoiceTemplate = createAsyncThunk(
  "GET_LIST_INVOICE_TEMPLATE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/ddl/invoiceTemplate/${id}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get List Invoice Template
export const getTaxImplication = createAsyncThunk(
  "GET_TAX_IMPLICATION",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/ddl/getTaxImplication`;
      const response = await accountManagementService.createData(url, body);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get List Price Code
export const getPriceCode = createAsyncThunk(
  "GET_LIST_PRICE_CODE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/ddl/getListPriceCode/${id}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get List Price Rule
export const getPriceRule = createAsyncThunk(
  "GET_LIST_PRICE_RULE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/ddl/getListPriceRule/${id}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get List Price Rule
export const getListPriceRuleById = createAsyncThunk(
  "GET_LIST_PRICE_RULE_BY_ID",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/ddl/getListPriceRule/detail/${id}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get List Choose Those
export const getListChooseTos = createAsyncThunk(
  "GET_LIST_CHOOSE_TOS",
  async ({ id, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/sa/ddl/chooseTos/${id}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get List Category Attachment
export const getListCategoryAttachment = createAsyncThunk(
  "GET_LIST_CATEGORY_ATTAHCMENT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/ddl/list-category`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getGlobalPropertiesAttachment = createAsyncThunk(
  "GET_GLOBAL_PROPERTIES_ATTACHMENT",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/config-file";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Get List Late Charge
export const getListLateCharge = createAsyncThunk(
  "GET_LIST_LATE_CHARGE",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/ddl/getLatecharge`;
      const response = await accountManagementService.createData(url, body);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
// Get List Late Charge
export const checkValidateCreateSa = createAsyncThunk(
  "CHECK_VALIDATE_CREATE_SA",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/checkValidateCreateSa`;
      const response = await accountManagementService.createData(url, body);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Export Excel
export const downloadServiceAgreement = createAsyncThunk(
  "DOWNLOAD_SERVICE_AGREEMENT",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/sa/download`;
      const response = await accountManagementService.downloadDataAdvanced(url, body);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const accountServiceAgreementSlice = createSlice({
  name: "accountAgreement",
  initialState,
  reducers: {
    resetDataDetail: (state) => {
      state.data_product_detail = {};
      state.data_approval_detail = [];
    },
  },
  extraReducers: {
    // Get List Service Agreement
    [getListServiceAgreement.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data = action.payload;
    },
    [getListServiceAgreement.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data = action.payload;
      state.loading = false;
    },
    [getListServiceAgreement.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // Get Detail Service Agreement
    [getDetailServiceAgreement.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_detail = action.payload;
    },
    [getDetailServiceAgreement.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailServiceAgreement.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },

    // Get Detail Service Agreement Draft
    [getDetailServiceAgreementDraft.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_detail_draft = action.payload;
    },
    [getDetailServiceAgreementDraft.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_detail_draft = action.payload;
      state.loading = false;
    },
    [getDetailServiceAgreementDraft.rejected]: (state, action) => {
      state.data_detail_draft = action.payload;
      state.loading = false;
    },

    /* Inactive Service Agreement */
    [inactiveSa.pending]: (state) => {
      state.loading = true;
    },
    [inactiveSa.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveSa.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    /* Delete Draft Service Agreement */
    [deleteDraftSa.pending]: (state) => {
      state.loading = true;
    },
    [deleteDraftSa.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [deleteDraftSa.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    // Create Service Agreement
    [createServiceAgreement.pending]: (state) => {
      state.loading = true;
    },
    [createServiceAgreement.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
      state.data = action.payload;
    },
    [createServiceAgreement.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    // Update Service Agreement
    [updateServiceAgreement.pending]: (state) => {
      state.loading = true;
    },
    [updateServiceAgreement.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
      state.data = action.payload;
    },
    [updateServiceAgreement.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    // Get Detail Product By Id
    [getDetailProductSa.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_product_detail = action.payload;
    },
    [getDetailProductSa.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_product_detail = action.payload;
      state.loading = false;
    },
    [getDetailProductSa.rejected]: (state, action) => {
      state.data_product_detail = action.payload;
      state.loading = false;
    },

    // Get Detail Product By Product Version
    [getDetailProductByVersion.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_product_detail = action.payload;
    },
    [getDetailProductByVersion.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_product_detail = action.payload;
      state.loading = false;
    },
    [getDetailProductByVersion.rejected]: (state, action) => {
      state.data_product_detail = action.payload;
      state.loading = false;
    },

    // =========== Dropdown List ===========

    // Service Type
    [getServiceType.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_service_type = action.payload;
    },
    [getServiceType.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_service_type = action.payload;
      state.loading = false;
    },
    [getServiceType.rejected]: (state, action) => {
      state.data_service_type = action.payload;
      state.loading = false;
    },

    // Service Agreement Type
    [getSaType.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_sa_type = action.payload;
    },
    [getSaType.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_sa_type = action.payload;
      state.loading = false;
    },
    [getSaType.rejected]: (state, action) => {
      state.data_sa_type = action.payload;
      state.loading = false;
    },

    // PJBG Type
    [getPjbg.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_pjbg = action.payload;
    },
    [getPjbg.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_pjbg = action.payload;
      state.loading = false;
    },
    [getPjbg.rejected]: (state, action) => {
      state.data_pjbg = action.payload;
      state.loading = false;
    },

    // Product List
    [getListProduct.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_product = action.payload;
    },
    [getListProduct.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_product = action.payload;
      state.loading = false;
    },
    [getListProduct.rejected]: (state, action) => {
      state.data_product = action.payload;
      state.loading = false;
    },

    // Approval List
    [getApprovalList.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_approval_list = action.payload;
      state.dataListAppHierId = action.payload;
    },
    [getApprovalList.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_approval_list = action.payload;
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    [getApprovalList.rejected]: (state, action) => {
      state.data_approval_list = action.payload;
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },

    // Detial Approval
    [getDetailApproval.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_approval_detail = action.payload;
    },
    [getDetailApproval.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_approval_detail = action.payload;
      state.loading = false;
    },
    [getDetailApproval.rejected]: (state, action) => {
      state.data_approval_detail = action.payload;
      state.loading = false;
    },
    // get detail approval inactive
    [getDetailApprovalInactive.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.dataListAppHierDetail = action.payload;
    },
    [getDetailApprovalInactive.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },
    [getDetailApprovalInactive.rejected]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },

    // List Term of Payment
    [getListTermOfPayment.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_term_of_payment = action.payload;
    },
    [getListTermOfPayment.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_term_of_payment = action.payload;
      state.loading = false;
    },
    [getListTermOfPayment.rejected]: (state, action) => {
      state.data_term_of_payment = action.payload;
      state.loading = false;
    },

    // List Term of Payment
    [getListBillingCycle.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_billing_cycle = action.payload;
    },
    [getListBillingCycle.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_billing_cycle = action.payload;
      state.loading = false;
    },
    [getListBillingCycle.rejected]: (state, action) => {
      state.data_billing_cycle = action.payload;
      state.loading = false;
    },

    // List Invoice template
    [getInvoiceTemplate.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_invoice_template = action.payload;
    },
    [getInvoiceTemplate.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_invoice_template = action.payload;
      state.loading = false;
    },
    [getInvoiceTemplate.rejected]: (state, action) => {
      state.data_invoice_template = action.payload;
      state.loading = false;
    },

    // List Tax Implication
    [getTaxImplication.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_tax_implication = action.payload;
    },
    [getTaxImplication.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_tax_implication = action.payload;
      state.loading = false;
    },
    [getTaxImplication.rejected]: (state, action) => {
      state.data_tax_implication = action.payload;
      state.loading = false;
    },

    // List Price Rule
    [getPriceRule.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_price_rule = action.payload;
    },
    [getPriceRule.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_price_rule = action.payload;
      state.loading = false;
    },
    [getPriceRule.rejected]: (state, action) => {
      state.data_price_rule = action.payload;
      state.loading = false;
    },

    // List Price Code
    [getPriceCode.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_price_code = action.payload;
    },
    [getPriceCode.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_price_code = action.payload;
      state.loading = false;
    },
    [getPriceCode.rejected]: (state, action) => {
      state.data_price_code = action.payload;
      state.loading = false;
    },

    // Get List Price Code By Id
    [getListPriceRuleById.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_pricing_rule_list = action.payload;
    },
    [getListPriceRuleById.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_pricing_rule_list = action.payload;
      state.loading = false;
    },
    [getListPriceRuleById.rejected]: (state, action) => {
      state.data_pricing_rule_list = action.payload;
      state.loading = false;
    },

    // Get List Choose TOS
    [getListChooseTos.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_list_choose_tos = action.payload;
    },
    [getListChooseTos.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_list_choose_tos = action.payload;
      state.loading = false;
    },
    [getListChooseTos.rejected]: (state, action) => {
      state.data_list_choose_tos = action.payload;
      state.loading = false;
    },

    // Get Category Attachment
    [getListCategoryAttachment.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_category_attachment = action.payload;
    },
    [getListCategoryAttachment.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_category_attachment = action.payload;
      state.loading = false;
    },
    [getListCategoryAttachment.rejected]: (state, action) => {
      state.data_category_attachment = action.payload;
      state.loading = false;
    },

    // Get List Late Charge
    [getListLateCharge.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_late_charge = action.payload;
    },
    [getListLateCharge.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_late_charge = action.payload;
      state.loading = false;
    },
    [getListLateCharge.rejected]: (state, action) => {
      state.data_late_charge = action.payload;
      state.loading = false;
    },

    // Get APproval History
    [getApprovalHistory.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.dataApprovalHistory = action.payload;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.dataApprovalHistory = action.payload;
      state.loading = false;
    },
    [getApprovalHistory.rejected]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loading = false;
    },

    // Is Validate Sa
    [checkValidateCreateSa.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.isValidateSa = action.payload;
    },
    [checkValidateCreateSa.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.isValidateSa = action.payload;
      state.loading = false;
    },
    [checkValidateCreateSa.rejected]: (state, action) => {
      state.isValidateSa = action.payload;
      state.loading = false;
    },

    // Attachment Config
    [getGlobalPropertiesAttachment.pending]: (state, action) => {
      state.loadingProduct = true;
      state.dataGlobalPropAttachment = action.payload;
    },
    [getGlobalPropertiesAttachment.fulfilled]: (state, action) => {
      state.dataGlobalPropAttachment = action.payload;
      state.loadingProduct = false;
    },
    [getGlobalPropertiesAttachment.rejected]: (state, action) => {
      state.dataGlobalPropAttachment = action.payload;
      state.loadingProduct = false;
    },
  },
});

const { reducer } = accountServiceAgreementSlice;
export const { resetDataDetail } = accountServiceAgreementSlice.actions;
export default reducer;
