import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../general_slice";
import { hasValue } from "../../../utils";

const initialState = {
  data_view: [],
  data_viewDetail: [],
  data_globalType: [],
  data_globalBillingCycle: [],
  data_globalBillingPeriod: [],
  data_globalCurrency: [],
  data_approvalList: [],
  data_approvalListDetail: [],
  dataListCategory: [],
  dataApprovalListPage: [],
  data_globalAccountNumber: [],
  data_globalTermsOfPayment: [],
  data_approvalHistory: {},
  data_globalTermsOfPaymentValue: [],
  data_globalProduct: [],
  data_globalBilling: [],
  data_calculate: {},
  data_rate: {},
  data_detailPos: {},
  loading: false,
  isFailed: false,
  isSuccess: false,
  loadingAccount: false,
  data_materai: {},
  data_rate_tax: {},
  data_attachment: [],
  data_account_segment: [],
  data_account_group_type: [],
  data_meter_reading_code: [],
  data_user_detail: {},
  data_sor_list: [],
  data_cost_center_list: [],
  loading_prospective: false,
};

export const getListPointOfSales = createAsyncThunk(
  "GET_LIST_POINT_OF_SALES",
  async ({ search, page, pageSize, sort, isLoadMore = false }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/pos/list-pos?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.getPagination(url);

      // Return data dengan flag isLoadMore
      return {
        ...response.data,
        isLoadMore, // Pass the flag to reducer
      };
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_LIST_POINT_OF_SALES" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getDetailListPointOfSales = createAsyncThunk(
  "GET_DETAIL_LIST_POINT_OF_SALES",
  async ({ id, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "posDetailId~asc" : sort;
      const url = `/v1/dbs/api/pos/list-pos-detail/${id}?sort=${sortParams}&size=${pageSize}&page=${page}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_DETAIL_LIST_POINT_OF_SALES" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const downloadPOS = createAsyncThunk(
  "DOWNLOAD_POS",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/pos/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "DOWNLOAD_POS", back: false }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const approvePOS = createAsyncThunk(
  "APPROVE_POS",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pos/approve-pos`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Your data has been approved",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (error) {
      // console.log(error, "error");
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      //if error code for with validation
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(validateError({ error, action: "APPROVE_POS" }));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not approved. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const rejectPOS = createAsyncThunk(
  "REJECT_POS",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pos/reject-pos`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Your data has been rejected",
        return: false,
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
      //if error code for with validation
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(validateError({ error, action: "REJECT_POS" }));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not rejected. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const createPOS = createAsyncThunk(
  "CREATE_POS",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pos/create-pos`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: `Your data has been ${
          body.submit === false ? "created" : "submitted"
        }.`,
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
      //if error code for with validation
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(validateError({ error, action: "CREATE_POS" }));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not created. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const updatePOS = createAsyncThunk(
  "UPDATE_POS",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pos/update-pos`;
      const response = await ratingBillingHttpService.updateData(url, body);
      const successMessage = {
        title: "Successful",
        description: `Your data has been ${
          body.submit === false ? "updated" : "submitted"
        }.`,
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
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(validateError({ error, action: "UPDATE_POS" }));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not updated. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const deletePOS = createAsyncThunk(
  "DELETE_POS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pos/delete/${id}`;
      const response = await ratingBillingHttpService.activationWithRemark(url);
      const successMessage = {
        title: "Successful",
        description: `Your data has been deleted.`,
        return: false,
        icon: "icon_error_delete",
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
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(validateError({ error, action: "DELETE_POS" }));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not deleted. ${message}.`,
            return: false,
            icon: "icon_error_delete",
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getMaterai = createAsyncThunk(
  "GET_MATERAI",
  async (transactionDate, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pos/meterai`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        transactionDate,
      );
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_MATERIA" }));
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getRate = createAsyncThunk(
  //coorporate
  "GET_RATE",
  async ({ invoiceDate, currency }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pos/daily-rate?transactionDate=${invoiceDate}&currencyId=${currency}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_RATE" }));
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);
export const getRateTax = createAsyncThunk(
  "GET_RATE_TAX",
  async ({ invoiceDate, currency }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pos/daily-rate-tax?transactionDate=${invoiceDate}&currencyId=${currency}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_RATE_TAX" }));
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pos/approval-history/${id}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_APPROVAL_HISTORY" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getGlobalTermsOfPaymentData = createAsyncThunk(
  "GET_GLOBAL_TERMS_OF_PAYMENT_DATA",
  async (accountId, thunkAPI) => {
    try {
      const url = hasValue(accountId)
        ? `/v1/dbs/api/pos/term-of-payment-data/${accountId}`
        : `/v1/dbs/api/pos/term-of-payment-data`;

      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_GLOBAL_TERMS_OF_PAYMENT_DATA" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getGlobalProductItem = createAsyncThunk(
  "GET_GLOBAL_PRODUCT",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/pos/product";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_GLOBAL_PRODUCT" }));
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getGlobalBillingItem = createAsyncThunk(
  "GET_GLOBAL_BILLING",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/pos/list-billing-item";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_GLOBAL_BILLING" }));
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getApprovalList = createAsyncThunk(
  "GET_APPROVAL_LIST",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/pos/list-apphier";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_APPROVAL_LIST" }));
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getListApprovalPage = createAsyncThunk(
  "GET_LIST_APPROVAL_PAGE",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/pos/get-all-pos-approve";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      thunkAPI.dispatch(
        validateError({ error, action: "GET_LIST_APPROVAL_PAGE" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getDetailPOS = createAsyncThunk(
  "GET_DETAIL_POS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pos/detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      thunkAPI.dispatch(validateError({ error, action: "GET_DETAIL_POS" }));
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getApprovalListDetail = createAsyncThunk(
  "GET_APPROVAL_LIST_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pos/list-apphier/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_APPROVAL_LIST_DETAIL" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

//global type
export const getGlobalType = createAsyncThunk(
  "GET_GLOBAL_LIST_TYPE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/pos/type?type=POS Type";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_GLOBAL_LIST_TYPE" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getGlobalBillingCycle = createAsyncThunk(
  "GET_GLOBAL_LIST_BILLING_CYCLE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/pos/billing-cycle";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_GLOBAL_LIST_BILLING_CYCLE" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getGlobalBillingPeriod = createAsyncThunk(
  "GET_GLOBAL_LIST_BILLING_PERIOD",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pos/billing-period?cycleId=${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_GLOBAL_LIST_BILLING_PERIOD" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getGlobalCurrency = createAsyncThunk(
  "GET_GLOBAL_LIST_CURRENCY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pos/currency?name=Currency`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_GLOBAL_LIST_CURRENCY" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getGlobalAccountNumber = createAsyncThunk(
  "GET_GLOBAL_ACCOUNT_NUMBER",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pos/account-number`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_GLOBAL_ACCOUNT_NUMBER" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getGlobalTermsOfPayment = createAsyncThunk(
  "GET_GLOBAL_TERMS_OF_PAYMENT",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pos/top?top=TOP Type`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_GLOBAL_TERMS_OF_PAYMENT" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getCalculate = createAsyncThunk(
  "GET_CALCULATE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pos/calculate-pos`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
      );
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_CALCULATE" }));
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getCalculateBilling = createAsyncThunk(
  "GET_CALCULATE_BILLING",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pos/calculate-pos-billing`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
      );
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_CALCULATE_BILLING" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

//file
export const getListCategoryFile = createAsyncThunk(
  "GET_LIST_CATEGORY_FILE",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/pos/list-category";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_LIST_CATEGORY_FILE" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const getAttachmentDetailPOS = createAsyncThunk(
  "GET_LIST_ATTACHMENT_FILE_POS_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pos/list-attachment/${id}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_LIST_ATTACHMENT_FILE_POS_DETAIL" }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : [],
      );
    }
  },
);

// Thunks untuk Prospective Customer
export const getAccountSegmentList = createAsyncThunk(
  "GET_ACCOUNT_SEGMENT_LIST",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/accountsegment`;
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const getAccountGroupTypeList = createAsyncThunk(
  "GET_ACCOUNT_GROUP_TYPE_LIST",
  async (segmentIds, thunkAPI) => {
    try {
      let queryParams = "";
      if (segmentIds && Array.isArray(segmentIds) && segmentIds.length > 0) {
        queryParams = segmentIds.map((id) => `idSegment=${id}`).join("&");
      }

      const url = `/v1/dbs/api/account-group-type/list${queryParams ? `?${queryParams}` : ""}`;
      const response = await ratingBillingHttpService.getAll(url);

      const accountGroups = Array.isArray(response)
        ? response
        : Array.isArray(response.data)
          ? response.data
          : [];
      return accountGroups;
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const getMeterReadingCodeList = createAsyncThunk(
  "GET_METER_READING_CODE_LIST",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/meterreadingcode`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
      );
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const getUserDetailForPOS = createAsyncThunk(
  "GET_USER_DETAIL_FOR_POS",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/user-detail`;
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const getSorList = createAsyncThunk(
  "GET_SOR_LIST_POS",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/sor?ccType=SOR`;
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const getCostCenterList = createAsyncThunk(
  "GET_COST_CENTER_LIST_POS",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/calculation/costcenter`;
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

const pointOfSalesSlice = createSlice({
  name: "pointOfSales",
  initialState,
  extraReducers: {
    // pagination view
    [getListPointOfSales.pending]: (state, action) => {
      // Hanya show loading saat initial fetch
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getListPointOfSales.fulfilled]: (state, action) => {
      state.loading = false;
      const isLoadMore = action.payload.isLoadMore;
      const newResult = action.payload?.result || [];

      if (isLoadMore) {
        // Append new data
        state.data_view = {
          ...action.payload,
          result: [...(state.data_view?.result || []), ...newResult],
        };
      } else {
        // Replace with new data
        state.data_view = action.payload;
      }
    },
    [getListPointOfSales.rejected]: (state, action) => {
      state.loading = false;
      // Jangan clear data saat load more gagal
      if (!action.meta.arg?.isLoadMore) {
        state.data_view = [];
      }
      state.data_view = action.payload;
    },

    [getCalculate.pending]: (state, action) => {
      state.loading = true;
      state.data_calculate = action.payload;
    },
    [getCalculate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_calculate = action.payload;
    },
    [getCalculate.rejected]: (state, action) => {
      state.loading = false;
      state.data_calculate = action.payload;
    },

    [getCalculateBilling.pending]: (state, action) => {
      state.loading = true;
      state.data_calculate = action.payload;
    },
    [getCalculateBilling.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_calculate = action.payload;
    },
    [getCalculateBilling.rejected]: (state, action) => {
      state.loading = false;
      state.data_calculate = action.payload;
    },

    [getDetailListPointOfSales.pending]: (state, action) => {
      state.loading = true;
      state.data_viewDetail = action.payload;
    },
    [getDetailListPointOfSales.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_viewDetail = action.payload;
    },
    [getDetailListPointOfSales.rejected]: (state, action) => {
      state.loading = false;
      state.data_viewDetail = action.payload;
    },

    [getDetailPOS.pending]: (state, action) => {
      state.loading = true;
      state.data_detailPos = action.payload;
    },
    [getDetailPOS.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detailPos = action.payload;
    },
    [getDetailPOS.rejected]: (state, action) => {
      state.loading = false;
      state.data_detailPos = action.payload;
    },

    [getApprovalList.pending]: (state, action) => {
      state.loading = true;
      state.data_approvalList = action.payload;
    },
    [getApprovalList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_approvalList = action.payload;
    },
    [getApprovalList.rejected]: (state, action) => {
      state.loading = false;
      state.data_approvalList = action.payload;
    },

    [getApprovalListDetail.pending]: (state, action) => {
      state.data_approvalListDetail = action.payload;
      state.loading = true;
    },
    [getApprovalListDetail.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_approvalListDetail = action.payload;
    },
    [getApprovalListDetail.rejected]: (state, action) => {
      state.loading = false;
      state.data_approvalListDetail = action.payload;
    },

    [getListApprovalPage.pending]: (state, action) => {
      state.loading = true;
      state.dataApprovalListPage = action.payload;
    },
    [getListApprovalPage.fulfilled]: (state, action) => {
      state.dataApprovalListPage = action.payload;
      state.loading = false;
    },
    [getListApprovalPage.rejected]: (state, action) => {
      state.dataApprovalListPage = action.payload;
      state.loading = false;
    },

    [getApprovalHistory.pending]: (state, action) => {
      state.data_approvalHistory = action.payload;
      state.loading = true;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.data_approvalHistory = action.payload;
      state.loading = false;
    },
    [getApprovalHistory.rejected]: (state, action) => {
      state.data_approvalHistory = action.payload;
      state.loading = false;
    },

    [getRate.pending]: (state, action) => {
      state.data_rate = action.payload;
      state.loading = true;
    },
    [getRate.fulfilled]: (state, action) => {
      state.data_rate = action.payload;
      state.loading = false;
    },
    [getRate.rejected]: (state, action) => {
      state.data_rate = action.payload;
      state.loading = false;
    },

    [getRateTax.pending]: (state, action) => {
      state.data_rate_tax = action.payload;
      state.loading = true;
    },
    [getRateTax.fulfilled]: (state, action) => {
      state.data_rate_tax = action.payload;
      state.loading = false;
    },
    [getRateTax.rejected]: (state, action) => {
      state.data_rate_tax = action.payload;
      state.loading = false;
    },

    [getMaterai.pending]: (state, action) => {
      state.data_materai = action.payload;
      state.loading = true;
    },
    [getMaterai.fulfilled]: (state, action) => {
      state.data_materai = action.payload;
      state.loading = false;
    },
    [getMaterai.rejected]: (state, action) => {
      state.data_materai = action.payload;
      state.loading = false;
    },

    //globa type
    [getGlobalType.pending]: (state, action) => {
      state.data_globalType = action.payload;
      state.loading = true;
    },
    [getGlobalType.fulfilled]: (state, action) => {
      state.data_globalType = action.payload;
      state.loading = false;
    },
    [getGlobalType.rejected]: (state, action) => {
      state.data_globalType = action.payload;
      state.loading = false;
    },

    [getGlobalBillingPeriod.pending]: (state, action) => {
      state.data_globalBillingPeriod = action.payload;
      state.loading = true;
    },
    [getGlobalBillingPeriod.fulfilled]: (state, action) => {
      state.data_globalBillingPeriod = action.payload;
      state.loading = false;
    },
    [getGlobalBillingPeriod.rejected]: (state, action) => {
      state.data_globalBillingPeriod = action.payload;
      state.loading = false;
    },

    [getGlobalBillingCycle.pending]: (state, action) => {
      state.data_globalBillingCycle = action.payload;
      state.loading = true;
    },
    [getGlobalBillingCycle.fulfilled]: (state, action) => {
      state.data_globalBillingCycle = action.payload;
      state.loading = false;
    },
    [getGlobalBillingCycle.rejected]: (state, action) => {
      state.data_globalBillingCycle = action.payload;
      state.loading = false;
    },

    [getGlobalCurrency.pending]: (state, action) => {
      state.data_globalCurrency = action.payload;
      state.loading = true;
    },
    [getGlobalCurrency.fulfilled]: (state, action) => {
      state.data_globalCurrency = action.payload;
      state.loading = false;
    },
    [getGlobalCurrency.rejected]: (state, action) => {
      state.data_globalCurrency = action.payload;
      state.loading = false;
    },

    [getGlobalAccountNumber.pending]: (state, action) => {
      state.data_globalAccountNumber = action.payload;
      state.loadingAccount = true;
    },
    [getGlobalAccountNumber.fulfilled]: (state, action) => {
      state.data_globalAccountNumber = action.payload;
      state.loadingAccount = false;
    },
    [getGlobalAccountNumber.rejected]: (state, action) => {
      state.data_globalAccountNumber = action.payload;
      state.loadingAccount = false;
    },

    [getGlobalTermsOfPayment.pending]: (state, action) => {
      state.data_globalTermsOfPayment = action.payload;
      state.loading = true;
    },
    [getGlobalTermsOfPayment.fulfilled]: (state, action) => {
      state.data_globalTermsOfPayment = action.payload;
      state.loading = false;
    },
    [getGlobalTermsOfPayment.rejected]: (state, action) => {
      state.data_globalTermsOfPayment = action.payload;
      state.loading = false;
    },

    [getGlobalTermsOfPaymentData.pending]: (state, action) => {
      state.data_globalTermsOfPaymentValue = action.payload;
      state.loading = true;
    },
    [getGlobalTermsOfPaymentData.fulfilled]: (state, action) => {
      state.data_globalTermsOfPaymentValue = action.payload;
      state.loading = false;
    },
    [getGlobalTermsOfPaymentData.rejected]: (state, action) => {
      state.data_globalTermsOfPaymentValue = action.payload;
      state.loading = false;
    },

    [getGlobalProductItem.pending]: (state, action) => {
      state.data_globalProduct = action.payload;
      state.loading = true;
    },
    [getGlobalProductItem.fulfilled]: (state, action) => {
      state.data_globalProduct = action.payload;
      state.loading = false;
    },
    [getGlobalProductItem.rejected]: (state, action) => {
      state.data_globalProduct = action.payload;
      state.loading = false;
    },

    [getGlobalBillingItem.pending]: (state, action) => {
      state.data_globalBilling = action.payload;
      state.loading = true;
    },
    [getGlobalBillingItem.fulfilled]: (state, action) => {
      state.data_globalBilling = action.payload;
      state.loading = false;
    },
    [getGlobalBillingItem.rejected]: (state, action) => {
      state.data_globalProduct = action.payload;
      state.loading = false;
    },

    //file
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

    [approvePOS.pending]: (state) => {
      state.loading = true;
    },
    [approvePOS.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approvePOS.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    [rejectPOS.pending]: (state) => {
      state.loading = true;
    },
    [rejectPOS.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [rejectPOS.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    [getAttachmentDetailPOS.pending]: (state, action) => {
      state.loading = true;
      state.data_attachment = action.payload;
    },
    [getAttachmentDetailPOS.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_attachment = action.payload;
    },
    [getAttachmentDetailPOS.rejected]: (state, action) => {
      state.loading = false;
      state.data_attachment = action.payload;
    },
    // Account Segment
    [getAccountSegmentList.pending]: (state) => {
      state.loading_prospective = true;
    },
    [getAccountSegmentList.fulfilled]: (state, action) => {
      state.loading_prospective = false;
      state.data_account_segment = action.payload?.Data || [];
    },
    [getAccountSegmentList.rejected]: (state) => {
      state.loading_prospective = false;
      state.data_account_segment = [];
    },

    // Account Group Type
    [getAccountGroupTypeList.pending]: (state) => {
      state.loading_prospective = true;
    },
    [getAccountGroupTypeList.fulfilled]: (state, action) => {
      state.loading_prospective = false;
      state.data_account_group_type = action.payload || [];
    },
    [getAccountGroupTypeList.rejected]: (state) => {
      state.loading_prospective = false;
      state.data_account_group_type = [];
    },

    // Meter Reading Code
    [getMeterReadingCodeList.pending]: (state) => {
      state.loading_prospective = true;
    },
    [getMeterReadingCodeList.fulfilled]: (state, action) => {
      state.loading_prospective = false;
      state.data_meter_reading_code = action.payload || [];
    },
    [getMeterReadingCodeList.rejected]: (state) => {
      state.loading_prospective = false;
      state.data_meter_reading_code = [];
    },

    // User Detail
    [getUserDetailForPOS.pending]: (state) => {
      state.loading_prospective = true;
    },
    [getUserDetailForPOS.fulfilled]: (state, action) => {
      state.loading_prospective = false;
      state.data_user_detail = action.payload || {};
    },
    [getUserDetailForPOS.rejected]: (state) => {
      state.loading_prospective = false;
      state.data_user_detail = {};
    },

    // SOR List
    [getSorList.pending]: (state) => {
      state.loading_prospective = true;
    },
    [getSorList.fulfilled]: (state, action) => {
      state.loading_prospective = false;
      state.data_sor_list = action.payload?.data || [];
    },
    [getSorList.rejected]: (state) => {
      state.loading_prospective = false;
      state.data_sor_list = [];
    },

    // Cost Center List
    [getCostCenterList.pending]: (state) => {
      state.loading_prospective = true;
    },
    [getCostCenterList.fulfilled]: (state, action) => {
      state.loading_prospective = false;
      state.data_cost_center_list = action.payload?.data || [];
    },
    [getCostCenterList.rejected]: (state) => {
      state.loading_prospective = false;
      state.data_cost_center_list = [];
    },
  },
});

const { reducer } = pointOfSalesSlice;
export default reducer;
