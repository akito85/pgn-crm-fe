import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showModalError, validateError } from "../../general_slice";
import { showModalSuccess } from "../../general_slice";
import accountManagementService from "../../../services/account_management/accountManagementService";

const initialState = {
  data: [],
  data_create: [],
  data_address: [],
  data_contact: [],
  data_account: [],
  data_customerType: [],
  data_identificationType: [],
  data_maritalStatus: [],
  data_sex: [],
  data_MRC: [],
  data_accountCategory: [],
  data_accountSegment: [],
  data_accountType: [],
  data_classificationType: [],
  data_priority: [],
  data_industrialSector: [],
  data_budgetYear: [],
  data_budget: [],
  data_teritory: [],
  data_categoryAttachment: [],
  data_accountGroupType: [],
  data_country: [],
  data_province: [],
  data_city: [],
  data_district: [],
  data_subDistrict: [],
  data_postalCode: [],
  data_type: [],
  data_businessPurpose: [],
  data_job: [],
  data_position: [],
  data_contactType: [],
  data_inputType: [],
  data_countryCode: [],
  data_countryZone: [],
  data_productName: [],
  data_paymentChannel: [],
  data_taxIdentifierType: [],
  data_financialInfo: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
  message: "",
  data_accountStandard: [],
  data_accountOneTime: [],
  data_customerOneTime: [],
  data_detailCustomerOnetime: [],
  IsPremiseAlready: {}
};

export const getAllAccountStandardPaginate = createAsyncThunk(
  "GET_ALL_ACCOUNT_STANDARD_PAGINATE",
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/account-info/paging-account-standart?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getAllAccountOneTimePaginate = createAsyncThunk(
  "GET_ALL_ACCOUNT_ONETIME_PAGINATE",
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/account-info/paging-account-one-time?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getAllContactPaginate = createAsyncThunk(
  "GET_ALL_CONTACT_PAGINATE",
  async ({ customerId, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const isId = customerId ? `&customerId=${customerId}` : ""
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/account/list-contact?${isId}&page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await accountManagementService.getPagination(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getAllAddressPaginate = createAsyncThunk(
  "GET_ALL_ADDRESS_PAGINATE",
  async ({ customerId, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/account/list-address?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}${customerId ? `&customerId=${customerId}` : ""}`;
      const response = await accountManagementService.getPagination(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getAllAccountPaginate = createAsyncThunk(
  "GET_ALL_ACCOUNT_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/tax-relation/ChooseAllTax?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await accountManagementService.getPagination(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getAllCustomerOneTimePaginate = createAsyncThunk(
  "GET_ALL_CUSTOMER_ONE_TIME_PAGINATE",
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/account-standart/list-one-time?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const checkCustomer = createAsyncThunk(
  "CHECK_CUSTOMER",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-standart/is-customer-exist`;
      const response = await accountManagementService.createData(url, body);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getFinancialInfo = createAsyncThunk(
  "GET_FINANCIAL_INFO",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-standart/get-financial-info`;
      const response = await accountManagementService.createData(url, body);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const createAccount = createAsyncThunk(
  "CREATE_ACCOUNT",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/account-standart/create-account-standart";
      const response = await accountManagementService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been created.",
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
        description: `Your data was not created. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getCustomerType = createAsyncThunk(
  "GET_CUSTOMER_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-standart/customer-type`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getIdentificationType = createAsyncThunk(
  "GET_IDENTIFICATION_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-standart/identification-type`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getSex = createAsyncThunk("GET_SEX_TYPE", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/account/sex`;
    const response = await accountManagementService.getAll(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

export const getMaritalStatus = createAsyncThunk(
  "GET_MARITAL_STATUS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/martial-status`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getMeterReadingCode = createAsyncThunk(
  "GET_METER_READING_CODE_STATUS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/meter-reading-code`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getAccountCategory = createAsyncThunk(
  "GET_ACCOUNT_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/account-category`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getAccountSegment = createAsyncThunk(
  "GET_ACCOUNT_SEGMENT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/account-segment`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getAccountGroupType = createAsyncThunk(
  "GET_ACCOUNT_GROUP_TYPE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/account-group-type/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getAccountType = createAsyncThunk(
  "GET_ACCOUNT_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/account-type`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getClassificationType = createAsyncThunk(
  "GET_CLASSIFICATION_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/classification-type`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getPriority = createAsyncThunk(
  "GET_PRIORITY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/account-priority`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getIndustrialSector = createAsyncThunk(
  "GET_INDUSTRIAL_SECTOR",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/industrial-sector`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getBudgetYear = createAsyncThunk(
  "GET_BUDGET_YEAR",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/budget-year`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getBudget = createAsyncThunk("GET_BUDGET", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/account/account-budget`;
    const response = await accountManagementService.getAll(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

export const getTeritory = createAsyncThunk(
  "GET_TERITORY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/account-teritory`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getCategoryAttachment = createAsyncThunk(
  "GET_CATEGORY_ATTACHMENT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/customer/attachment-category`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getCountry = createAsyncThunk("GET_COUNTRY", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/master/location/country`;
    const response = await accountManagementService.getAll(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

export const getProvince = createAsyncThunk(
  "GET_PROVINCE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/location/province/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getCity = createAsyncThunk("GET_CITY", async (id, thunkAPI) => {
  try {
    const url = `/v1/dbs/api/master/location/city/${id}`;
    const response = await accountManagementService.getDetail(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

export const getDistrict = createAsyncThunk(
  "GET_DISTRICT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/location/district/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getSubDistrict = createAsyncThunk(
  "GET_SUB_DISTRICT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/location/sub-district/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getPostalCode = createAsyncThunk(
  "GET_POSTAL_CODE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/location/postal-code/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getType = createAsyncThunk("GET_TYPE", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/account/home-type`;
    const response = await accountManagementService.getAll(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

export const getBusinessPurpose = createAsyncThunk(
  "GET_BUSINESS_PURPOSE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/business-purpose`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getJob = createAsyncThunk("GET_JOB", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/account/job`;
    const response = await accountManagementService.getAll(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

export const getPosition = createAsyncThunk(
  "GET_POSITION",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/position`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getContactType = createAsyncThunk(
  "GET_CONTACT_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/contact-type`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getInputType = createAsyncThunk(
  "GET_INPUT_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/input-type`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getCountryCode = createAsyncThunk(
  "GET_COUNTRY_CODE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/country-code`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getCountryZone = createAsyncThunk(
  "GET_COUNTRY_ZONE_CREATE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/contact/getZone/${id}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getProductName = createAsyncThunk(
  "GET_PRODUCT_NAME",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/distribution-media/getDistributionMedia`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getTaxIdentifierType = createAsyncThunk(
  "GET_TAX_IDENTIFIER_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/tax-identifier-type`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getPaymentChannel = createAsyncThunk(
  "GET_PAYMENT_CHANNEL",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/payment-channel-type`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDetailCustomerOneTime = createAsyncThunk(
  "GET_DETAIL_CUSTOMER_ONE_TIME",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-standart/detail-one-time/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const downloadAccountStandard = createAsyncThunk(
  "DOWNLOAD_ACCOUNT_STANDARD",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-info/download-filter-standart?search=${search}&page=
      ${page}&size=${pageSize}&sort=${sort}`;
      const response = await accountManagementService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(validateError({ error: response, action: "DOWNLOAD_ACCOUNT_STANDARD", back: false }))
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const downloadAccountOneTime = createAsyncThunk(
  "DOWNLOAD_ACCOUNT_ONE_TIME",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-info/download-filter-one-time?search=${search}&page=
      ${page}&size=${pageSize}&sort=${sort}`;
      const response = await accountManagementService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(validateError({ error: response, action: "DOWNLOAD_ACCOUNT_ONE_TIME", back: false }))
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const checkContactExist = createAsyncThunk(
  "CHECK_CONTACT_EXIST",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-standart/is-contact-exist`;
      const response = await accountManagementService.activationWithRemark(url, body);
      return response;
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
          description: `${message}`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const checkRegistrationNumber = createAsyncThunk(
  "CHECK_REGISTRATION_NUMBER",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-standart/is-registration-number-exist`;
      const response = await accountManagementService.activationWithRemark(url, body);
      return response;
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
          description: `${message}`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const checkIsPremiseAlready = createAsyncThunk(
  "CHECK IS PREMISE ALREADY",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-standart/check-premise-address`;
      const response = await accountManagementService.createData(url, body);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const accountSlice = createSlice({
  name: "accountSlice",
  initialState,
  extraReducers: {
    // Get All Standard Pagination
    [getAllAccountStandardPaginate.pending]: (state, action) => {
      state.loading = true;
      state.data_accountStandard = action.payload;
    },
    [getAllAccountStandardPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_accountStandard = action.payload;
    },
    [getAllAccountStandardPaginate.rejected]: (state, action) => {
      state.loading = false;
      state.data_accountStandard = action.payload;
    },

    // Get All One Time Pagination
    [getAllAccountOneTimePaginate.pending]: (state, action) => {
      state.loading = true;
      state.data_accountOneTime = action.payload;
    },
    [getAllAccountOneTimePaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_accountOneTime = action.payload;
    },
    [getAllAccountOneTimePaginate.rejected]: (state, action) => {
      state.loading = false;
      state.data_accountOneTime = action.payload;
    },

    // Get All Contact Pagination
    [getAllContactPaginate.pending]: (state, action) => {
      state.loading = true;
      state.data_contact = action.payload;
    },
    [getAllContactPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_contact = action.payload;
    },
    [getAllContactPaginate.rejected]: (state, action) => {
      state.loading = false;
      state.data_contact = action.payload;
    },

    // Get All Address Pagination
    [getAllAddressPaginate.pending]: (state, action) => {
      state.loading = true;
      state.data_address = action.payload;
    },
    [getAllAddressPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_address = action.payload;
    },
    [getAllAddressPaginate.rejected]: (state, action) => {
      state.loading = false;
      state.data_address = action.payload;
    },

    // Get All Account Pagination
    [getAllAccountPaginate.pending]: (state, action) => {
      state.loading = true;
      state.data_account = action.payload;
    },
    [getAllAccountPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_account = action.payload;
    },
    [getAllAccountPaginate.rejected]: (state, action) => {
      state.loading = false;
      state.data_account = action.payload;
    },

    // Get All Customer One Time Pagination
    [getAllCustomerOneTimePaginate.pending]: (state, action) => {
      state.loading = true;
      state.data_customerOneTime = action.payload;
    },
    [getAllCustomerOneTimePaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_customerOneTime = action.payload;
    },
    [getAllCustomerOneTimePaginate.rejected]: (state, action) => {
      state.loading = false;
      state.data_customerOneTime = action.payload;
    },

    // Create Gas Source
    [createAccount.pending]: (state, action) => {
      state.loading = true;
      state.data_create = action.payload;
    },
    [createAccount.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
      state.data_create = action.payload;
    },
    [createAccount.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.data_create = action.payload;
    },

    // Check Customer
    [checkCustomer.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [checkCustomer.fulfilled]: (state, action) => {
      state.loading = false;
      state.isSuccess = true;
      state.data = action.payload;
    },
    [checkCustomer.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.data = action.payload;
    },

    // Check Customer
    [getFinancialInfo.pending]: (state, action) => {
      state.loading = true;
      state.data_financialInfo = action.payload;
    },
    [getFinancialInfo.fulfilled]: (state, action) => {
      state.loading = false;
      state.isSuccess = true;
      state.data_financialInfo = action.payload;
    },
    [getFinancialInfo.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.data_financialInfo = action.payload;
    },

    // Get Customer Type
    [getCustomerType.pending]: (state, action) => {
      state.loading = true;
      state.data_customerType = action.payload;
    },
    [getCustomerType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_customerType = action.payload;
    },
    [getCustomerType.rejected]: (state, action) => {
      state.loading = false;
      state.data_customerType = action.payload;
    },

    // Get Identification Type
    [getIdentificationType.pending]: (state, action) => {
      state.loading = true;
      state.data_identificationType = action.payload;
    },
    [getIdentificationType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_identificationType = action.payload;
    },
    [getIdentificationType.rejected]: (state, action) => {
      state.loading = false;
      state.data_identificationType = action.payload;
    },

    // Get Sex
    [getSex.pending]: (state, action) => {
      state.loading = true;
      state.data_sex = action.payload;
    },
    [getSex.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_sex = action.payload;
    },
    [getSex.rejected]: (state, action) => {
      state.loading = false;
      state.data_sex = action.payload;
    },

    // Get Marital Status
    [getMaritalStatus.pending]: (state, action) => {
      state.loading = true;
      state.data_maritalStatus = action.payload;
    },
    [getMaritalStatus.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_maritalStatus = action.payload;
    },
    [getMaritalStatus.rejected]: (state, action) => {
      state.loading = false;
      state.data_maritalStatus = action.payload;
    },

    // Get Meter Reading Code
    [getMeterReadingCode.pending]: (state, action) => {
      state.loading = true;
      state.data_MRC = action.payload;
    },
    [getMeterReadingCode.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_MRC = action.payload;
    },
    [getMeterReadingCode.rejected]: (state, action) => {
      state.loading = false;
      state.data_MRC = action.payload;
    },

    // Get Account Category
    [getAccountCategory.pending]: (state, action) => {
      state.loading = true;
      state.data_accountCategory = action.payload;
    },
    [getAccountCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_accountCategory = action.payload;
    },
    [getAccountCategory.rejected]: (state, action) => {
      state.loading = false;
      state.data_accountCategory = action.payload;
    },

    // Get Account Segment
    [getAccountSegment.pending]: (state, action) => {
      state.loading = true;
      state.data_accountSegment = action.payload;
    },
    [getAccountSegment.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_accountSegment = action.payload;
    },
    [getAccountSegment.rejected]: (state, action) => {
      state.loading = false;
      state.data_accountSegment = action.payload;
    },

    // Get Account Group Type
    [getAccountGroupType.pending]: (state, action) => {
      state.loading = true;
      state.data_accountGroupType = action.payload;
    },
    [getAccountGroupType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_accountGroupType = action.payload;
    },
    [getAccountGroupType.rejected]: (state, action) => {
      state.loading = false;
      state.data_accountGroupType = action.payload;
    },

    // Get Account Type
    [getAccountType.pending]: (state, action) => {
      state.loading = true;
      state.data_accountType = action.payload;
    },
    [getAccountType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_accountType = action.payload;
    },
    [getAccountType.rejected]: (state, action) => {
      state.loading = false;
      state.data_accountType = action.payload;
    },

    // Get Classification Type
    [getClassificationType.pending]: (state, action) => {
      state.loading = true;
      state.data_classificationType = action.payload;
    },
    [getClassificationType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_classificationType = action.payload;
    },
    [getClassificationType.rejected]: (state, action) => {
      state.loading = false;
      state.data_classificationType = action.payload;
    },

    // Get Priority
    [getPriority.pending]: (state, action) => {
      state.loading = true;
      state.data_priority = action.payload;
    },
    [getPriority.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_priority = action.payload;
    },
    [getPriority.rejected]: (state, action) => {
      state.loading = false;
      state.data_priority = action.payload;
    },

    // Get Industrial Sector
    [getIndustrialSector.pending]: (state, action) => {
      state.loading = true;
      state.data_industrialSector = action.payload;
    },
    [getIndustrialSector.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_industrialSector = action.payload;
    },
    [getIndustrialSector.rejected]: (state, action) => {
      state.loading = false;
      state.data_industrialSector = action.payload;
    },

    // Get Budget Year
    [getBudgetYear.pending]: (state, action) => {
      state.loading = true;
      state.data_budgetYear = action.payload;
    },
    [getBudgetYear.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_budgetYear = action.payload;
    },
    [getBudgetYear.rejected]: (state, action) => {
      state.loading = false;
      state.data_budgetYear = action.payload;
    },

    // Get Budget
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

    // Get Teritory
    [getTeritory.pending]: (state, action) => {
      state.loading = true;
      state.data_teritory = action.payload;
    },
    [getTeritory.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_teritory = action.payload;
    },
    [getTeritory.rejected]: (state, action) => {
      state.loading = false;
      state.data_teritory = action.payload;
    },

    // Get Category Attachment
    [getCategoryAttachment.pending]: (state, action) => {
      state.loading = true;
      state.data_categoryAttachment = action.payload;
    },
    [getCategoryAttachment.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_categoryAttachment = action.payload;
    },
    [getCategoryAttachment.rejected]: (state, action) => {
      state.loading = false;
      state.data_categoryAttachment = action.payload;
    },

    // Get Country
    [getCountry.pending]: (state, action) => {
      state.loading = true;
      state.data_country = action.payload;
    },
    [getCountry.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_country = action.payload;
    },
    [getCountry.rejected]: (state, action) => {
      state.loading = false;
      state.data_country = action.payload;
    },

    // Get Province
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

    // Get City
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

    // Get District
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

    // Get Sub District
    [getSubDistrict.pending]: (state, action) => {
      state.loading = true;
      state.data_subDistrict = action.payload;
    },
    [getSubDistrict.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_subDistrict = action.payload;
    },
    [getSubDistrict.rejected]: (state, action) => {
      state.loading = false;
      state.data_subDistrict = action.payload;
    },

    // Get Postal Code
    [getPostalCode.pending]: (state, action) => {
      state.loading = true;
      state.data_postalCode = action.payload;
    },
    [getPostalCode.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_postalCode = action.payload;
    },
    [getPostalCode.rejected]: (state, action) => {
      state.loading = false;
      state.data_postalCode = action.payload;
    },

    // Get Type
    [getType.pending]: (state, action) => {
      state.loading = true;
      state.data_type = action.payload;
    },
    [getType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_type = action.payload;
    },
    [getType.rejected]: (state, action) => {
      state.loading = false;
      state.data_type = action.payload;
    },

    // Get Business Purpose
    [getBusinessPurpose.pending]: (state, action) => {
      state.loading = true;
      state.data_businessPurpose = action.payload;
    },
    [getBusinessPurpose.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_businessPurpose = action.payload;
    },
    [getBusinessPurpose.rejected]: (state, action) => {
      state.loading = false;
      state.data_businessPurpose = action.payload;
    },

    // Get Job
    [getJob.pending]: (state, action) => {
      state.loading = true;
      state.data_job = action.payload;
    },
    [getJob.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_job = action.payload;
    },
    [getJob.rejected]: (state, action) => {
      state.loading = false;
      state.data_job = action.payload;
    },

    // Get Position
    [getPosition.pending]: (state, action) => {
      state.loading = true;
      state.data_position = action.payload;
    },
    [getPosition.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_position = action.payload;
    },
    [getPosition.rejected]: (state, action) => {
      state.loading = false;
      state.data_position = action.payload;
    },

    // Get Contact Type
    [getContactType.pending]: (state, action) => {
      state.loading = true;
      state.data_contactType = action.payload;
    },
    [getContactType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_contactType = action.payload;
    },
    [getContactType.rejected]: (state, action) => {
      state.loading = false;
      state.data_contactType = action.payload;
    },

    // Get Input Type
    [getInputType.pending]: (state, action) => {
      state.loading = true;
      state.data_inputType = action.payload;
    },
    [getInputType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_inputType = action.payload;
    },
    [getInputType.rejected]: (state, action) => {
      state.loading = false;
      state.data_inputType = action.payload;
    },

    // Get Country Code
    [getCountryCode.pending]: (state, action) => {
      state.loading = true;
      state.data_countryCode = action.payload;
    },
    [getCountryCode.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_countryCode = action.payload;
    },
    [getCountryCode.rejected]: (state, action) => {
      state.loading = false;
      state.data_countryCode = action.payload;
    },

    // Get Country Zone
    [getCountryZone.pending]: (state, action) => {
      state.loading = true;
      state.data_countryZone = action.payload;
    },
    [getCountryZone.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_countryZone = action.payload;
    },
    [getCountryZone.rejected]: (state, action) => {
      state.loading = false;
      state.data_countryZone = action.payload;
    },

    // Get Product Name
    [getProductName.pending]: (state, action) => {
      state.loading = true;
      state.data_productName = action.payload;
    },
    [getProductName.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_productName = action.payload;
    },
    [getProductName.rejected]: (state, action) => {
      state.loading = false;
      state.data_productName = action.payload;
    },

    // Get Tax Identifier Type
    [getTaxIdentifierType.pending]: (state, action) => {
      state.loading = true;
      state.data_taxIdentifierType = action.payload;
    },
    [getTaxIdentifierType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_taxIdentifierType = action.payload;
    },
    [getTaxIdentifierType.rejected]: (state, action) => {
      state.loading = false;
      state.data_taxIdentifierType = action.payload;
    },

    // Get Payment Channel
    [getPaymentChannel.pending]: (state, action) => {
      state.loading = true;
      // state.data_paymentChannel = action.payload;
    },
    [getPaymentChannel.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_paymentChannel = action.payload;
    },
    [getPaymentChannel.rejected]: (state, action) => {
      state.loading = false;
      // state.data_paymentChannel = action.payload;
    },

    // Get Detail Customer One Time
    [getDetailCustomerOneTime.pending]: (state, action) => {
      state.loading = true;
      state.data_detailCustomerOnetime = action.payload;
    },
    [getDetailCustomerOneTime.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detailCustomerOnetime = action.payload;
    },
    [getDetailCustomerOneTime.rejected]: (state, action) => {
      state.loading = false;
      state.data_detailCustomerOnetime = action.payload;
    },

    // Check if 
    [checkIsPremiseAlready.pending]: (state, action) => {
      state.loading = true;
      state.isPremiseAlready = action.payload;
    },
    [checkIsPremiseAlready.fulfilled]: (state, action) => {
      state.loading = false;
      state.isPremiseAlready = action.payload;
    },
    [checkIsPremiseAlready.rejected]: (state, action) => {
      state.loading = false;
      state.isPremiseAlready = action.payload;
    },
    
  },
});

const { reducer } = accountSlice;
export default reducer;
