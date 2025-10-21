import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import {
  showModalError,
  showModalSuccess,
  validateError,
  setBodyError,
} from "../../general_slice";

const initialState = {
  data_customer: [],
  data_customerDetail: {},
  data_customerDetailAccount: [],
  data_customerDetailAddress: [],
  data_customerDetailContact: [],
  data_customerDetailAttachment: [],
  data_globalCustomerType: [],
  data_globalIdentificationType: [],
  data_globalSex: [],
  data_globalMartialStatus: [],
  dataListCategory: [],
  loadingAccount: false,
  data_customer_advanced: [],
  data_globalTypeCondition: [],
  data_globalTypeOperator: [],
  data_globalTypeColumn: [],
};

//Customer
export const getCustomerAccount = createAsyncThunk(
  "GET_CUSTOMER_LIST_ACCOUNT_MANAGEMENT",
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-info/paging-customer?search=${search}&page=${page}&size=${pageSize}&sort=${sort}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const getCustomerAccountAdvancedFilter = createAsyncThunk(
  "GET_CUSTOMER_LIST_ACCOUNT_MANAGEMENT_ADVANCED",
  async ({ page, pageSize, sort, search, body }, thunkAPI) => {
    try {
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/account-info/paging-customer?searchs=${search}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.updateDataWithMethodPost(
        url,
        body,
      );
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const getCustomerDetail = createAsyncThunk(
  "GET_CUSTOMER_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-info/detail-customer/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const inActiveCustomer = createAsyncThunk(
  "INACTIVE_CUSTOMER",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-info/customer/active-inactive`;
      const response = await accountManagementService.updateData(url, body);
      const successMessage = {
        title: "Successful",
        description: `${response?.message}`,
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
  },
);

export const getListCustomerAccount = createAsyncThunk(
  "GET_LIST_CUSTOMER_ACCOUNT",
  async ({ id, page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-info/paging-customer-account/${id}?search=${search}&page=
      ${page}&size=${pageSize}&sort=${sort}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const getListCustomerAddress = createAsyncThunk(
  "GET_LIST_CUSTOMER_ADDRESS",
  async ({ id, page, pageSize, sort, search }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/account-info/paging-customer-address/${id}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
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

export const getListCustomerContact = createAsyncThunk(
  "GET_LIST_CUSTOMER_CONTACT",
  async ({ id, page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-info/paging-customer-contact/${id}?search=${search}&page=
      ${page}&size=${pageSize}&sort=${sort}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const downloadCustomer = createAsyncThunk(
  "DOWNLOAD_CUSTOMER",
  async ({ search, page, pageSize, sort, body }, thunkAPI) => {
    try {
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/account-info/download-customer?searchs=${search}&page=
      ${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.downloadDataAdvanced(
        url,
        body,
      );
      if (response?.status === 204) {
        thunkAPI.dispatch(
          validateError({
            error: response,
            action: "DOWNLOAD_CUSTOMER",
            back: false,
          }),
        );
      } else {
        return response;
      }
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_CUSTOMER",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getCustomerAttachment = createAsyncThunk(
  "GET_CUSTOMER_LIST_ATTACHMENT",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-info/paging-customer-attachment/${id}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const updateCustomer = createAsyncThunk(
  "UPDATE_CUSTOMER",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-info/update-customer`;
      const response = await accountManagementService.updateData(url, body);
      // const successMessage = {
      //   title: "Successful",
      //   description: `${response?.message}`
      // };
      // thunkAPI.dispatch(showModalSuccess(successMessage));
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
  },
);

export const getListCategoryFile = createAsyncThunk(
  "GET_LIST_CATEGORY_FILE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/customer/attachment-category";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getGlobalCustomerType = createAsyncThunk(
  "GET_GLOBAL_CUSTOMER_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-info/global-type/14`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getGlobalIdentificationType = createAsyncThunk(
  "GET_GLOBAL_IDENTIFICATION_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-info/global-type/15`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getGlobalSex = createAsyncThunk(
  "GET_GLOBAL_SEX",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-info/global-type/16`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getGlobalMartialStatus = createAsyncThunk(
  "GET_GLOBAL_MARTIAL_STATUS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-info/global-type/17`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getGlobalSearchCondition = createAsyncThunk(
  "GET_GLOBAL_SEARCH_CONDITION",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-info/list-search-condition`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getGlobalSearchOperator = createAsyncThunk(
  "GET_GLOBAL_SEARCH_OPERATOR",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-info/list-search-operator`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getGlobalSearchColumn = createAsyncThunk(
  "GET_GLOBAL_SEARCH_COLUMN",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-info/list-search-cus-acc-column`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

const customerAccountSlice = createSlice({
  name: "customerAccount",
  initialState,
  extraReducers: {
    //service point
    [getCustomerAccount.pending]: (state, action) => {
      state.data_customer = action.payload;
      state.loading = true;
    },
    [getCustomerAccount.fulfilled]: (state, action) => {
      state.data_customer = action.payload;
      state.loading = false;
    },
    [getCustomerAccount.rejected]: (state, action) => {
      state.data_customer = action.payload;
      state.loading = false;
    },

    [getCustomerDetail.pending]: (state, action) => {
      state.data_customerDetail = action.payload;
      state.loading = true;
    },
    [getCustomerDetail.fulfilled]: (state, action) => {
      state.data_customerDetail = action.payload;
      state.loading = false;
    },
    [getCustomerDetail.rejected]: (state, action) => {
      state.data_customerDetail = action.payload;
      state.loading = false;
    },

    [getListCustomerAccount.pending]: (state, action) => {
      state.data_customerDetailAccount = action.payload;
      state.loadingAccount = true;
    },
    [getListCustomerAccount.fulfilled]: (state, action) => {
      state.data_customerDetailAccount = action.payload;
      state.loadingAccount = false;
    },
    [getListCustomerAccount.rejected]: (state, action) => {
      state.data_customerDetailAccount = action.payload;
      state.loadingAccount = false;
    },

    [getListCustomerAddress.pending]: (state, action) => {
      state.data_customerDetailAddress = action.payload;
      state.loading = true;
    },
    [getListCustomerAddress.fulfilled]: (state, action) => {
      state.data_customerDetailAddress = action.payload;
      state.loading = false;
    },
    [getListCustomerAddress.rejected]: (state, action) => {
      state.data_customerDetailAddress = action.payload;
      state.loading = false;
    },

    [getListCustomerContact.pending]: (state, action) => {
      state.data_customerDetailContact = action.payload;
      state.loading = true;
    },
    [getListCustomerContact.fulfilled]: (state, action) => {
      state.data_customerDetailContact = action.payload;
      state.loading = false;
    },
    [getListCustomerContact.rejected]: (state, action) => {
      state.data_customerDetailContact = action.payload;
      state.loading = false;
    },

    [getCustomerAttachment.pending]: (state, action) => {
      state.data_customerDetailAttachment = action.payload;
      state.loading = true;
    },
    [getCustomerAttachment.fulfilled]: (state, action) => {
      state.data_customerDetailAttachment = action.payload;
      state.loading = false;
    },
    [getCustomerAttachment.rejected]: (state, action) => {
      state.data_customerDetailAttachment = action.payload;
      state.loading = false;
    },

    [getListCategoryFile.pending]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = true;
    },
    [getListCategoryFile.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },
    [getListCategoryFile.rejected]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },

    //GLOBAL
    [getGlobalCustomerType.pending]: (state, action) => {
      state.data_globalCustomerType = action.payload;
      state.loading = true;
    },
    [getGlobalCustomerType.fulfilled]: (state, action) => {
      state.data_globalCustomerType = action.payload;
      state.loading = false;
    },
    [getGlobalCustomerType.rejected]: (state, action) => {
      state.data_globalCustomerType = action.payload;
      state.loading = false;
    },

    [getGlobalIdentificationType.pending]: (state, action) => {
      state.data_globalIdentificationType = action.payload;
      state.loading = true;
    },
    [getGlobalIdentificationType.fulfilled]: (state, action) => {
      state.data_globalIdentificationType = action.payload;
      state.loading = false;
    },
    [getGlobalIdentificationType.rejected]: (state, action) => {
      state.data_globalIdentificationType = action.payload;
      state.loading = false;
    },

    [getGlobalSex.pending]: (state, action) => {
      state.data_globalSex = action.payload;
      state.loading = true;
    },
    [getGlobalSex.fulfilled]: (state, action) => {
      state.data_globalSex = action.payload;
      state.loading = false;
    },
    [getGlobalSex.rejected]: (state, action) => {
      state.data_globalSex = action.payload;
      state.loading = false;
    },

    [getGlobalMartialStatus.pending]: (state, action) => {
      state.data_globalMartialStatus = action.payload;
      state.loading = true;
    },
    [getGlobalMartialStatus.fulfilled]: (state, action) => {
      state.data_globalMartialStatus = action.payload;
      state.loading = false;
    },
    [getGlobalMartialStatus.rejected]: (state, action) => {
      state.data_globalMartialStatus = action.payload;
      state.loading = false;
    },

    [getCustomerAccountAdvancedFilter.pending]: (state, action) => {
      state.data_customer = action.payload;
      state.loading = true;
    },
    [getCustomerAccountAdvancedFilter.fulfilled]: (state, action) => {
      state.data_customer = action.payload;
      state.loading = false;
    },
    [getCustomerAccountAdvancedFilter.rejected]: (state, action) => {
      state.data_customer = action.payload;
      state.loading = false;
    },

    //advanced
    [getGlobalSearchColumn.pending]: (state, action) => {
      state.data_globalTypeColumn = action.payload;
      state.loading = true;
    },
    [getGlobalSearchColumn.fulfilled]: (state, action) => {
      state.data_globalTypeColumn = action.payload;
      state.loading = false;
    },
    [getGlobalSearchColumn.rejected]: (state, action) => {
      state.data_globalTypeColumn = action.payload;
      state.loading = false;
    },

    [getGlobalSearchCondition.pending]: (state, action) => {
      state.data_globalTypeCondition = action.payload;
      state.loading = true;
    },
    [getGlobalSearchCondition.fulfilled]: (state, action) => {
      state.data_globalTypeCondition = action.payload;
      state.loading = false;
    },
    [getGlobalSearchCondition.rejected]: (state, action) => {
      state.data_globalTypeCondition = action.payload;
      state.loading = false;
    },

    [getGlobalSearchOperator.pending]: (state, action) => {
      state.data_globalTypeOperator = action.payload;
      state.loading = true;
    },
    [getGlobalSearchOperator.fulfilled]: (state, action) => {
      state.data_globalTypeOperator = action.payload;
      state.loading = false;
    },
    [getGlobalSearchOperator.rejected]: (state, action) => {
      state.data_globalTypeOperator = action.payload;
      state.loading = false;
    },

    /* Download Customers */
    [downloadCustomer.pending]: (state, action) => {
      state.loading = true;
    },
    [downloadCustomer.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [downloadCustomer.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});
const { reducer } = customerAccountSlice;
export default reducer;
