import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
  showModalError,
  showModalSuccess,
  validateError,
} from "../general_slice";
import { setBodyError } from "../general_slice";
import { errorBody, errorCode, errorMessage, hasValue } from "../../../utils";

const initialState = {
  loading: false,
  data: null,
  data_detail: null,
  data_allocation: null,
  data_table_allocation: null,
  data_selected_allocation: null,
  colAgentDDL: [],
  cusNumberDDL: [],
  payGatewayDDL: [],
  payTypeDDL: [],
  payDeliveryDDL: [],
  currencyDDL: [],
  bankDDL: [],
  rateTypeDDL: [],
  payMethodDDL: [],
  data_recomendation_allocation: null,
  dataAccountNumber: [],
  dataReceiptChannelDDL: [],
  dataAccNumber: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  data_converted_currency: null,
  data_customer_list: null,
};

export const getPaginateReceipt = createAsyncThunk(
  "GET_ALL_RECEIPT",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/receipt/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_ALL_RECEIPT" })
      );
      return error;
    }
  }
);

export const getReceiptDetail = createAsyncThunk(
  "GET_RECEIPT_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/receipt/detail-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_RECEIPT_DETAIL" })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAllocation = createAsyncThunk(
  "DATA_ALLOCATION",
  async ({ id, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/receipt/allocation/paging-${id}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "DATA_ALLOCATION" })
      );
      return error;
    }
  }
);

export const getReceiptCustomerList = createAsyncThunk(
  "GET_RECEIPT_CUSTOMER_LIST",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/receipt/customer/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_RECEIPT_CUSTOMER_LIST" })
      );
      return error;
    }
  }
);

export const getDownloadReceipt = createAsyncThunk(
  "DOWNLOAD_RECEIPT",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/receipt/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({ error: response, action: "DOWNLOAD_RECEIPT" })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const getCollectionAgentDDL = createAsyncThunk(
  "GET_LIST_COLL_AGENT_RECEIPT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collecting-agent/get-list`;
      const response = await receiptCollectionHttpService.getAll(url);
      const data = response?.data?.result;
      return { data };
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getAccountNumberDDL = createAsyncThunk(
  "GET_LIST_ACCOUNT_NUMBER_RECEIPT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/receipt/list-customername-area-segment/${id}`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data;
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getAccountDDL = createAsyncThunk(
  "GET_LIST_ACCOUNT_RECEIPTS_DDL_CREATE _RECEIPT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/receipt/list-account-number/${id}`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data;
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListApprovalByIdReceipt = createAsyncThunk(
  "GET_LIST_APPROVAL_BY_ID_RECEIPT_CREATE",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/apphier/get-approval-hierarchies/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListCategoryReceipt = createAsyncThunk(
  "GET_LIST_CATEGORY_RECEIPTSSS",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/attachment/list-category";
      const response = await receiptCollectionHttpService.getAll(url);
      const mappCategory = response.data?.data?.map((item) => ({
        Id: item.glbTypeValId,
        text: item?.name,
      }));
      return mappCategory;
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getReceiptChanelDDL = createAsyncThunk(
  "GET_LIST_RECEIPT_CH?ANNEL_RECEIPT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/receipt/list-receipt-channel`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data;
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getPayMethodDDL = createAsyncThunk(
  "GET_LIST_PAYMENT_METHOD_RECEIPT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/receipt/list-payment-method`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data;
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getCusNumberDDL = createAsyncThunk(
  "GET_LIST_CUS_NUMBER_RECEIPTS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/receipt/list-customer-number`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data;
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getPayGetwayDDL = createAsyncThunk(
  "GET_LIST_PAY_GET_RECEIPTS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/partner/get-list`;
      const response = await receiptCollectionHttpService.getAll(url);
      const data = response?.data?.result?.map((item) => ({
        id: item?.id,
        name: item?.partnerName,
      }));
      return { data };
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getPayTypeDDL = createAsyncThunk(
  "GET_LIST_PAYMENT_TYPE_RECEIPTS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/receipt/list-payment-type`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data;
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getPayDeliverDDL = createAsyncThunk(
  "GET_LIST_PAYMENT_DELIVERY_RECEIPTS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-channel/get-list`;
      const response = await receiptCollectionHttpService.getAll(url);
      const data = response?.data?.result;
      return { data };
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getCurrencyDDL = createAsyncThunk(
  "GET_LIST_CURRENCY_RECEIPTS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/receipt/list-payment-currency`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data;
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getBankDDL = createAsyncThunk(
  "GET_LIST_BANK_RECEIPTS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/receipt/list-bank`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data;
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getRateTypeDDL = createAsyncThunk(
  "GET_LIST_RATE_TYPE_RECEIPTS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/receipt/list-rate-type`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data;
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getAllApprovalListReceipt = createAsyncThunk(
  "GET_ALL_APPROVAL_LIST_RECEIPT_CREATE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/apphier/get-list-approval-hierarchies`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

// get allocation
export const getAllocationRecomendationList = createAsyncThunk(
  "GET_ALLOCATION_LIST",
  async (
    { accountNumberSelected, balance, currencyId, rateAmount },
    thunkAPI
  ) => {
    try {
      // const searchParams = search === undefined ? "" : search;
      // const sortParams =
      //   sort === undefined || sort === "" ? "createdDate~desc" : sort;
      // let url = `/v1/dbs/api/receipt/recommendation-allocation-get/0000000000000528-${balance}`;
      let url = ``;

      // url = `/v1/dbs/api/receipt/recommendation-allocation-paging-get/${accountNumberSelected}-${balance}?page=${pageChoose}&size=${pageSizeChoose}&search=${searchParams}&sort=${sortParams}`;

      // if (hasValue(accountNumberSelected)) {
      //   url = `/v1/dbs/api/receipt/recommendation-allocation-paging-get/${accountNumberSelected}?page=${pageChoose}&size=${pageSizeChoose}&search=${searchParams}&sort=${sortParams}`;
      // } else {
      //   url = `/v1/dbs/api/receipt/recommendation-allocation-paging-get/0000000000000528-${balance}?page=${pageChoose}&size=${pageSizeChoose}&search=${searchParams}&sort=${sortParams}`;
      // }

      // list
      if (hasValue(accountNumberSelected) && hasValue(balance)) {
        url = `/v1/dbs/api/receipt/recommendation-allocation-get/${accountNumberSelected}-${balance}-${currencyId}-${rateAmount}`;
        const response = await receiptCollectionHttpService?.getPagination(url);
        return response?.data;
      }
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "allocation-list",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);

// get recommendation detail
export const getRecommendationDetailAllocation = createAsyncThunk(
  "GET_RECOMMENDATION_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/receipt/recommendation-allocation-not-exists-get/${id}`;
      const response = await receiptCollectionHttpService?.getPagination(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_RECOMMENDATION_DETAIL",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// create receipt
export const createReceipt = createAsyncThunk(
  "CREATE_RECEIPT",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/receipt/create";
      const response = await receiptCollectionHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: response?.message,
        // return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "CREATE_RECEIPT", back: false })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
// create receipt
export const createAllocation = createAsyncThunk(
  "CREATE_ALLOCATION",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/receipt/allocation-create";
      const response = await receiptCollectionHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: response?.message,
        // return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "CREATE_ALLOCATION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const approveOrRejectReceipt = createAsyncThunk(
  "APPROVE_OR_REJECT_CREATE_MANUAL RECEIPTS",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/receipt/approve-reject";
      const response =
        await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      const successMessage = {
        title: "Successfull",
        description: `Your data has been ${body.action === "APPROVED" ? "Approved" : "Rejected"
          }`,
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
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${body.action === "APPROVED" ? "approved" : "rejected"
            }. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// get converted currency
export const getConvertedCurrency = createAsyncThunk(
  "GET_CONVERTED_CURRENCY",
  async (body, thunkAPI) => {
    try {
      if (body) {
        const url = "/v1/dbs/api/receipt/converted-currency/get";
        const response = await receiptCollectionHttpService.createData(
          url,
          body
        );
        return response?.data;
      }
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_CONVERTED_CURRENCY",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// get approval history
export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/receipt/approval-history-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_APPROVAL_HISTORY",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// delete receipt
export const deleteReceipt = createAsyncThunk(
  "DELETE_RECEIPT",
  async (body, thunkAPI) => {
    try {
      if (body) {
        const url = "/v1/dbs/api/receipt/delete";
        const response = await receiptCollectionHttpService.createData(
          url,
          body
        );
        const successBody = {
          title: `Successful`,
          description: response?.message,
          return: false,
        };
        thunkAPI.dispatch(showModalSuccess(successBody));
        return response?.data;
      }
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "DELETE_RECEIPT", back: false })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const receiptSlice = createSlice({
  name: "receipt",
  initialState,
  reducers: {
    setDataAllocation: (state, action) => {
      state.data_selected_allocation = action?.payload;
    },
    resetDataAccountNumber: (state) => {
      state.dataAccountNumber = null;
    },
    resetConvertedAmount: (state) => {
      state.data_converted_currency = null;
    },
  },
  extraReducers: {
    //get all employee paginate reducer
    [getPaginateReceipt.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [getPaginateReceipt.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getPaginateReceipt.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },

    // Get rateType List
    [getRateTypeDDL.pending]: (state, action) => {
      state.loading = true;
      state.rateTypeDDL = action.payload;
    },
    [getRateTypeDDL.fulfilled]: (state, action) => {
      state.rateTypeDDL = action.payload;
      state.loading = false;
    },
    [getRateTypeDDL.rejected]: (state, action) => {
      state.rateTypeDDL = action.payload;
      state.loading = false;
    },

    // get populate data accounumber
    [getAccountNumberDDL.pending]: (state, action) => {
      state.loading = true;
      state.dataAccountNumber = action.payload;
    },
    [getAccountNumberDDL.fulfilled]: (state, action) => {
      state.dataAccountNumber = action.payload;
      state.loading = false;
    },
    [getAccountNumberDDL.rejected]: (state, action) => {
      state.dataAccountNumber = action.payload;
      state.loading = false;
    },

    // get populate data accounumber
    [getAccountDDL.pending]: (state, action) => {
      state.loading = true;
      state.dataAccNumber = action.payload;
    },
    [getAccountDDL.fulfilled]: (state, action) => {
      state.dataAccNumber = action.payload;
      state.loading = false;
    },
    [getAccountDDL.rejected]: (state, action) => {
      state.dataAccNumber = action.payload;
      state.loading = false;
    },

    // get receiptChannel
    [getReceiptChanelDDL.pending]: (state, action) => {
      state.loading = true;
      state.dataReceiptChannelDDL = action.payload;
    },
    [getReceiptChanelDDL.fulfilled]: (state, action) => {
      state.dataReceiptChannelDDL = action.payload;
      state.loading = false;
    },
    [getReceiptChanelDDL.rejected]: (state, action) => {
      state.dataReceiptChannelDDL = action.payload;
      state.loading = false;
    },

    // Get currency List
    [getCurrencyDDL.pending]: (state, action) => {
      state.loading = true;
      state.currencyDDL = action.payload;
    },
    [getCurrencyDDL.fulfilled]: (state, action) => {
      state.currencyDDL = action.payload;
      state.loading = false;
    },
    [getCurrencyDDL.rejected]: (state, action) => {
      state.currencyDDL = action.payload;
      state.loading = false;
    },

    // Get payment method List
    [getPayMethodDDL.pending]: (state, action) => {
      state.loading = true;
      state.payMethodDDL = action.payload;
    },
    [getPayMethodDDL.fulfilled]: (state, action) => {
      state.payMethodDDL = action.payload;
      state.loading = false;
    },
    [getPayMethodDDL.rejected]: (state, action) => {
      state.payMethodDDL = action.payload;
      state.loading = false;
    },

    // Get bank List
    [getBankDDL.pending]: (state, action) => {
      state.loading = true;
      state.bankDDL = action.payload;
    },
    [getBankDDL.fulfilled]: (state, action) => {
      state.bankDDL = action.payload;
      state.loading = false;
    },
    [getBankDDL.rejected]: (state, action) => {
      state.bankDDL = action.payload;
      state.loading = false;
    },

    // Get collection agent List
    [getCollectionAgentDDL.pending]: (state, action) => {
      state.loading = true;
      state.colAgentDDL = action.payload;
    },
    [getCollectionAgentDDL.fulfilled]: (state, action) => {
      state.colAgentDDL = action.payload;
      state.loading = false;
    },
    [getCollectionAgentDDL.rejected]: (state, action) => {
      state.colAgentDDL = action.payload;
      state.loading = false;
    },

    // Get payment type List
    [getPayDeliverDDL.pending]: (state, action) => {
      state.loading = true;
      state.payDeliveryDDL = action.payload;
    },
    [getPayDeliverDDL.fulfilled]: (state, action) => {
      state.payDeliveryDDL = action.payload;
      state.loading = false;
    },
    [getPayDeliverDDL.rejected]: (state, action) => {
      state.payDeliveryDDL = action.payload;
      state.loading = false;
    },

    // Get payment type List
    [getPayTypeDDL.pending]: (state, action) => {
      state.loading = true;
      state.payTypeDDL = action.payload;
    },
    [getPayTypeDDL.fulfilled]: (state, action) => {
      state.payTypeDDL = action.payload;
      state.loading = false;
    },
    [getPayTypeDDL.rejected]: (state, action) => {
      state.payTypeDDL = action.payload;
      state.loading = false;
    },

    // Get payment Gatway List
    [getPayGetwayDDL.pending]: (state, action) => {
      state.loading = true;
      state.payGatewayDDL = action.payload;
    },
    [getPayGetwayDDL.fulfilled]: (state, action) => {
      state.payGatewayDDL = action.payload;
      state.loading = false;
    },
    [getPayGetwayDDL.rejected]: (state, action) => {
      state.payGatewayDDL = action.payload;
      state.loading = false;
    },

    // Get cus number List
    [getCusNumberDDL.pending]: (state, action) => {
      state.loading = true;
      state.cusNumberDDL = action.payload;
    },
    [getCusNumberDDL.fulfilled]: (state, action) => {
      state.cusNumberDDL = action.payload;
      state.loading = false;
    },
    [getCusNumberDDL.rejected]: (state, action) => {
      state.cusNumberDDL = action.payload;
      state.loading = false;
    },

    // get detail
    [getReceiptDetail.pending]: (state) => {
      state.loading = true;
    },
    [getReceiptDetail.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getReceiptDetail.rejected]: (state) => {
      state.loading = true;
    },
    // get eallocation
    [getAllocation.pending]: (state) => {
      state.loading = true;
    },
    [getAllocation.fulfilled]: (state, action) => {
      state.data_allocation = action.payload;
      state.loading = false;
    },
    [getAllocation.rejected]: (state) => {
      state.loading = true;
    },

    //download
    [getDownloadReceipt.fulfilled]: (state, action) => {
      state.data_download = action.payload;
      // state.isSuccess = true;
      state.loading = false;
    },
    [getDownloadReceipt.rejected]: (state, action) => {
      state.isFailed = true;
      state.data_download = action.payload;
      state.loading = false;
    },

    // get allocation
    [getAllocationRecomendationList.rejected]: (state, action) => {
      state.isFailed = true;
      state.data_recomendation_allocation = action.payload;
      state.loading = false;
    },
    [getAllocationRecomendationList.pending]: (state, action) => {
      state.isFailed = true;
      state.data_recomendation_allocation = action.payload;
      state.loading = true;
    },
    [getAllocationRecomendationList.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.data_recomendation_allocation = action.payload;
      state.loading = false;
    },

    /** Get List Category */
    [getListCategoryReceipt.pending]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = true;
    },
    [getListCategoryReceipt.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },
    [getListCategoryReceipt.rejected]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },
    // Get List Approval By Id
    [getListApprovalByIdReceipt.pending]: (state, action) => {
      state.loading = true;
      state.dataListAppHierDetail = action.payload;
    },
    [getListApprovalByIdReceipt.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },
    [getListApprovalByIdReceipt.rejected]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },

    [approveOrRejectReceipt.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectReceipt.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveOrRejectReceipt.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    // Get Approve Hierarchy List
    [getAllApprovalListReceipt.pending]: (state, action) => {
      state.loading = true;
      state.dataListAppHierId = action.payload;
    },
    [getAllApprovalListReceipt.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    [getAllApprovalListReceipt.rejected]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    // Create Receipt
    [createReceipt.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [createReceipt.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createReceipt.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    // Create Allocation Detail
    [createAllocation.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [createAllocation.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createAllocation.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    // Get Converted Currency
    [getConvertedCurrency.pending]: (state, action) => {
      state.loading = true;
      state.data_converted_currency = action.payload;
    },
    [getConvertedCurrency.fulfilled]: (state, action) => {
      state.data_converted_currency = action.payload;
      state.loading = false;
    },
    [getConvertedCurrency.rejected]: (state, action) => {
      state.data_converted_currency = action.payload;
      state.loading = false;
    },
    // Get Approval History
    [getApprovalHistory.pending]: (state, action) => {
      state.loading = true;
      state.data_detail = action.payload;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getApprovalHistory.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    // get recommendation detail
    [getRecommendationDetailAllocation.rejected]: (state, action) => {
      state.isFailed = true;
      state.data_recomendation_allocation = action.payload;
      state.loading = false;
    },
    [getRecommendationDetailAllocation.pending]: (state, action) => {
      state.isFailed = true;
      state.data_recomendation_allocation = action.payload;
      state.loading = true;
    },
    [getRecommendationDetailAllocation.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.data_recomendation_allocation = action.payload;
      state.loading = false;
    },
    // Get Receipt Customer List
    [getReceiptCustomerList.pending]: (state, action) => {
      state.loading = true;
      state.data_customer_list = action.payload;
    },
    [getReceiptCustomerList.fulfilled]: (state, action) => {
      state.data_customer_list = action.payload;
      state.loading = false;
    },
    [getReceiptCustomerList.rejected]: (state, action) => {
      state.data_customer_list = action.payload;
      state.loading = false;
    },
    // Get Receipt Customer List
    [getReceiptCustomerList.pending]: (state, action) => {
      state.loading = true;
      state.data_customer_list = action.payload;
    },
    [getReceiptCustomerList.fulfilled]: (state, action) => {
      state.data_customer_list = action.payload;
      state.loading = false;
    },
    [getReceiptCustomerList.rejected]: (state, action) => {
      state.data_customer_list = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = receiptSlice;
export default reducer;
export const {
  setDataAllocation,
  resetDataAccountNumber,
  resetConvertedAmount,
} = receiptSlice.actions;
