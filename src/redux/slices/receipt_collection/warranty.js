import { createAsyncThunk, createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
  showModalError,
  setBodyError,
  showModalSuccess,
  validateError,
} from "../general_slice";

const warrantyAdapter = createEntityAdapter({
  selectId: (warranty) => warranty.id,
  sortComparer: (a, b) => b.createdAt - a.createdAt
});


const initialState = warrantyAdapter.getInitialState({
  data: null,
  data_detail: {},
  data_customer_info: [],
  data_warranty_info: [],
  data_refund_info: [],
  data_hold_info: [],
  data_release_info: [],
  data_attachment_info: [],
  data_approval_info: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataListCategory: [],
  dataApprovalHistory: null,

  dataMutation: null,
  dataDetailMutation: null,
  loadingMutation: false,
  loadingDetailMutation: false,

  dataPaymentWarrantyPartner: [],
  loadingPaymentWarrantyPartner: false,

  dataPaymentWarrantyPartnerBranch: [],
  loadingPaymentWarrantyPartnerBranch: false,

  dataWarrantyTypeOptions: [],
  dataMutationCategoryOptions: [],

  dataHoldList: null,
  dataReleaseList: null,
  dataRefundList: null,
  dataHoldDetailList: null,
  dataReleaseDetailList: null,
  dataRefundDetailList: null,

  data_upload_validation: null,
  loading_upload_validation: false,
  data_approval_list: null,
  loading_approval_list: false,
  loading_download_template: false,

  dataSummary: [],
  loadingSummary: false,

  loadingHoldList: false,
  loadingReleaseList: false,
  loadingRefundList: false,

  loading: false,
  loadingList: false,
  loadingDetail: false,
  loadingApproval: false,
  loadingCreate: false,
  isFailed: false,
  isSuccess: false,
  message: "",
});


export const getPaymentWarrantyPartnerList = createAsyncThunk(
  "GET_PAYMENT_WARRANTY_PARTNER_LIST",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty-partners/list`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return error;
    }
  }
);

export const getPaymentWarrantyPartnerBranchList = createAsyncThunk(
  "GET_PAYMENT_WARRANTY_PARTNER_BRANCH_LIST",
  async (partnerId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty-partner-branches/list/${partnerId}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return error;
    }
  }
);

export const getAllWarrantyListPaginate = createAsyncThunk(
  "GET_ALL_WARRANTY_LIST_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      // Default sort
      const sortValue = sort === undefined || sort === "" ? "updatedDate~desc" : sort;
      const [orderBy, order] = sortValue.split("~");


      const url = `/v1/dbs/api/payment-warranty/get-list?page=${page}&size=${pageSize}&order=${order || 'desc'}&orderBy=${orderBy || 'updatedDate'}&searchs=${searchParams}`;

      const response = await receiptCollectionHttpService.getPagination(url);
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
      return error;
    }
  }
);

export const getWarrantySummary = createAsyncThunk(
  "GET_WARRANTY_SUMMARY",
  async (search, thunkAPI) => {
    try {
      const searchParams = search ? encodeURIComponent(JSON.stringify(search)) : "";
      const url = `/v1/dbs/api/payment-warranty/get-summary${searchParams ? `?search=${searchParams}` : ""}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getDetailWarranty = createAsyncThunk(
  "GET_DETAIL_WARRANTY",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/detail-get/${id}`;
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
      return error;
    }
  }
);

export const getAllCustomerInfoPaginate = createAsyncThunk(
  "GET_ALL_CUSTOMER_INFO_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/payment-warranty/customer/get-list?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
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
      return error;
    }
  }
);

export const getDetailWarrantyMutation = createAsyncThunk(
  "GET_DETAIL_WARRANTY_MUTATION",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortValue = sort === undefined || sort === "" ? "updatedDate~desc" : sort;
      const [orderBy, order] = sortValue.split("~");

      const url = `/v1/dbs/api/payment-warranty/mutation/get-list/${id}?page=${page}&size=${pageSize}&order=${order || 'desc'}&orderBy=${orderBy || 'updatedDate'}&searchs=${searchParams}`;

      const response = await receiptCollectionHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message = error?.response?.data?.message || error?.message || error?.toString();
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}`, return: false }));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getAllWarrantyInfoPaginate = createAsyncThunk(
  "GET_ALL_WARRANTY_INFO_PAGINATE",
  async ({ page, pageSize, search, sort, transTypeName }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortValue = sort === undefined || sort === "" ? "updatedDate~desc" : sort;
      const [orderBy, order] = sortValue.split("~");

      let url = `/v1/dbs/api/payment-warranty/get-list?page=${page}&size=${pageSize}&order=${order || 'desc'}&orderBy=${orderBy || 'updatedDate'}&searchs=${searchParams}`;

      if (transTypeName) {
        url += `&transTypeName=${transTypeName}`;
      }

      const response = await receiptCollectionHttpService.getPagination(url);
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
      return error;
    }
  }
);

// New Action Thunks

export const getHoldListPaginate = createAsyncThunk(
  "GET_HOLD_LIST_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const url = `/v1/dbs/api/payment-warranty/hold/list?page=${page}&size=${pageSize}&searchs=${searchParams}`;
      const response = await receiptCollectionHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return error;
    }
  }
);

export const getReleaseListPaginate = createAsyncThunk(
  "GET_RELEASE_LIST_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const url = `/v1/dbs/api/payment-warranty/release/list?page=${page}&size=${pageSize}&searchs=${searchParams}`;
      const response = await receiptCollectionHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return error;
    }
  }
);

export const getRefundListPaginate = createAsyncThunk(
  "GET_REFUND_LIST_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const url = `/v1/dbs/api/payment-warranty/refund/list?page=${page}&size=${pageSize}&searchs=${searchParams}`;
      const response = await receiptCollectionHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return error;
    }
  }
);

export const getHoldDetailList = createAsyncThunk(
  "GET_HOLD_DETAIL_LIST",
  async ({ id, page, pageSize }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/hold/detail-list/${id}?page=${page}&size=${pageSize}`;
      const response = await receiptCollectionHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return error;
    }
  }
);

export const getReleaseDetailList = createAsyncThunk(
  "GET_RELEASE_DETAIL_LIST",
  async ({ id, page, pageSize }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/release/detail-list/${id}?page=${page}&size=${pageSize}`;
      const response = await receiptCollectionHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return error;
    }
  }
);

export const getRefundDetailList = createAsyncThunk(
  "GET_REFUND_DETAIL_LIST",
  async ({ id, page, pageSize }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/refund/detail-list/${id}?page=${page}&size=${pageSize}`;
      const response = await receiptCollectionHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return error;
    }
  }
);

export const submitHold = createAsyncThunk(
  "SUBMIT_HOLD_WARRANTY",
  async (data, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/hold/submit`;
      const response = await receiptCollectionHttpService.createData(url, data);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const submitRelease = createAsyncThunk(
  "SUBMIT_RELEASE_WARRANTY",
  async (data, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/release/submit`;
      const response = await receiptCollectionHttpService.createData(url, data);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const submitRefund = createAsyncThunk(
  "SUBMIT_REFUND_WARRANTY",
  async (data, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/refund/submit`;
      const response = await receiptCollectionHttpService.createData(url, data);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getMutationApprovalHistory = createAsyncThunk(
  "GET_MUTATION_APPROVAL_HISTORY",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/mutation/approval-history/${id}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return error;
    }
  }
);


export const getAllApprovalList = createAsyncThunk(
  "GET_ALL_APPROVAL_LIST_WARRANTY",
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


export const getListApprovalById = createAsyncThunk(
  "GET_LIST_APPROVAL_BY_ID_WARRANTY",
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

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_WARRANTY",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/approval-history-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response?.data ?? response;
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


export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/attachment/list-category";
      const response = await receiptCollectionHttpService.getAll(url);
      const mapsCategory = response?.data?.data?.map((item) => ({
        Id: item?.glbTypeValId,
        text: item?.name,
      }));
      return mapsCategory;
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

export const getWarrantyTypeOptions = createAsyncThunk(
  "GET_WARRANTY_TYPE_OPTIONS",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-warranty/warranty-type";
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return error;
    }
  }
);

export const getMutationCategoryOptions = createAsyncThunk(
  "GET_MUTATION_CATEGORY_OPTIONS",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-warranty/mutation-category";
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return error;
    }
  }
);

export const createPaymentWarranty = createAsyncThunk(
  "CREATE_PAYMENT_WARRANTY",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-warranty/create";
      const response = await receiptCollectionHttpService.createData(url, body);

      const successBody = {
        title: `Successful`,
        description: "Your request has been submitted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        error?.toString();

      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Submission failed. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const createMutation = createAsyncThunk(
  "CREATE_MUTATION_WARRANTY",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-warranty/mutation/create";
      const response = await receiptCollectionHttpService.createData(url, body);

      const successBody = {
        title: `Successful`,
        description: "Your mutation has been submitted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        error?.toString();

      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        if (message?.toLowerCase()?.includes('duplicate')) {
          thunkAPI.dispatch(showModalError({ 
            title: "Failed", 
            description: "Mutation Number sudah digunakan, silakan gunakan nomor lain" 
          }));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Submission failed. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const submitWarrantyRequest = createAsyncThunk(
  "SUBMIT_WARRANTY_REQUEST",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-warranty/request-submit";
      const response = await receiptCollectionHttpService.createData(url, body);

      const successBody = {
        title: `Successful`,
        description: "Your request has been submitted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        error?.toString();

      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Submission failed. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const submitApproval = createAsyncThunk(
  "SUBMIT_APPROVAL_WARRANTY",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-warranty/approval-submit";
      
      // Ensure we send a list (array) as required by backend V2
      const payload = Array.isArray(body) ? body : [body];
      const response = await receiptCollectionHttpService.createData(url, payload);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${payload[0]?.action === "APPROVE" ? "approved" : "rejected"
          }.`,
        return: true,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        error?.toString();

      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${body.action === "APPROVE" ? "approved" : "rejected"
            }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const downloadWarrantyList = createAsyncThunk(
  "DOWNLOAD_WARRANTY_LIST",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/payment-warranty/download?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_WARRANTY_LIST",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const downloadWarrantyListDetail = createAsyncThunk(
  "DOWNLOAD_WARRANTY_LIST_DETAIL",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/payment-warranty/download-detail-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_WARRANTY_LIST_DETAIL",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteWarranty = createAsyncThunk(
  "DELETE_WARRANTY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/delete/${id}`;
      const response = await receiptCollectionHttpService.deleteData(url);

      const successBody = {
        title: `Successful`,
        description: "Your data has been deleted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not deleted. ${message}. Please try again.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getDetailMutation = createAsyncThunk(
  "GET_DETAIL_MUTATION",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/mutation/detail-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message = error?.response?.data?.message || error?.message || error?.toString();
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}`, return: false }));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const deleteMutation = createAsyncThunk(
  "DELETE_MUTATION",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/mutation/delete/${id}`;
      const response = await receiptCollectionHttpService.deleteData(url);
      const successBody = {
        title: `Successful`,
        description: "Your mutation has been deleted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message = error?.response?.data?.message || error?.message || error?.toString();
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `Your mutation was not deleted. ${message}.`, return: false }));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const updateMutation = createAsyncThunk(
  "UPDATE_MUTATION_WARRANTY",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-warranty/mutation/update";
      const response = await receiptCollectionHttpService.updateDataPost(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your mutation has been updated.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message = error?.response?.data?.message || error?.message || error?.toString();
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `Update failed. ${message}.`, return: false }));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const updatePaymentWarranty = createAsyncThunk(
  "UPDATE_PAYMENT_WARRANTY",
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/update/${id}`;
      const response = await receiptCollectionHttpService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your warranty has been updated.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message = error?.response?.data?.message || error?.message || error?.toString();
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `Update failed. ${message}.`, return: false }));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const uploadWarrantyValidation = createAsyncThunk(
  "UPLOAD_WARRANTY_VALIDATION",
  async ({ file }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-warranty/upload-validation";
      const formData = new FormData();
      formData.append("file", file);
      const response = await receiptCollectionHttpService.uploadBulk(url, formData);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const saveWarrantyUpload = createAsyncThunk(
  "SAVE_WARRANTY_UPLOAD",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-warranty/save-upload";
      const response = await receiptCollectionHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Warranty upload has been saved.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListApprovalWarranty = createAsyncThunk(
  "GET_LIST_APPROVAL_WARRANTY",
  async ({ page, pageSize, isLoadMore }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/get-list?page=${page}&size=${pageSize}&status=Draft&approvalStatus=Draft`;
      const response = await receiptCollectionHttpService.getPagination(url);
      return { ...response.data, isLoadMore };
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getDownloadTemplate = createAsyncThunk(
  "GET_DOWNLOAD_TEMPLATE_WARRANTY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/download-template`;
      const response = await receiptCollectionHttpService.downloadXlsx(
        url,
        "guarantee_template",
      );
      return response;
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return error;
    }
  }
);

const warrantySlice = createSlice({
  name: "warranty",
  initialState,
  extraReducers: {
    // Get All GET_ALL_WARRANTY_LIST_PAGINATE Pagination
    [getAllWarrantyListPaginate.pending]: (state) => {
      state.loadingList = true;
    },
    [getAllWarrantyListPaginate.fulfilled]: (state, action) => {
      state.loadingList = false;
      state.data = action.payload;
      warrantyAdapter.setAll(state, action.payload?.result || []);
    },
    [getAllWarrantyListPaginate.rejected]: (state) => {
      state.loadingList = false;
    },

    // Get Detail GET_DETAIL_WARRANTY
    [getDetailWarranty.pending]: (state) => {
      state.loadingDetail = true;
    },
    [getDetailWarranty.fulfilled]: (state, action) => {
      state.loadingDetail = false;
      state.data_detail = action.payload;
    },
    [getDetailWarranty.rejected]: (state) => {
      state.loadingDetail = false;
    },

    // Get All GET_ALL_CUSTOMER_INFO_PAGINATE Pagination
    [getAllCustomerInfoPaginate.pending]: (state) => {
      state.loadingList = true;
    },
    [getAllCustomerInfoPaginate.fulfilled]: (state, action) => {
      state.loadingList = false;
      state.data_customer_info = action.payload;
    },
    [getAllCustomerInfoPaginate.rejected]: (state) => {
      state.loadingList = false;
    },

    // Get Mutation GET_DETAIL_WARRANTY_MUTATION
    [getDetailWarrantyMutation.pending]: (state) => {
      state.loadingMutation = true;
      state.dataMutation = null;
    },
    [getDetailWarrantyMutation.fulfilled]: (state, action) => {
      state.loadingMutation = false;
      state.dataMutation = action.payload;
    },
    [getDetailWarrantyMutation.rejected]: (state) => {
      state.loadingMutation = false;
      state.dataMutation = null;
    },

    // Get All GET_ALL_WARRANTY_INFO_PAGINATE Pagination
    [getAllWarrantyInfoPaginate.pending]: (state) => {
      state.loadingList = true;
    },
    [getAllWarrantyInfoPaginate.fulfilled]: (state, action) => {
      state.loadingList = false;
      state.data_warranty_info = action.payload;
    },
    [getAllWarrantyInfoPaginate.rejected]: (state) => {
      state.loadingList = false;
    },

    /** Get List Category */
    [getListCategory.pending]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingProduct = true;
    },
    [getListCategory.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingProduct = false;
    },
    [getListCategory.rejected]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingProduct = false;
    },

    // Get Payment Warranty Partner List
    [getPaymentWarrantyPartnerList.pending]: (state) => {
      state.loadingPaymentWarrantyPartner = true;
    },
    [getPaymentWarrantyPartnerList.fulfilled]: (state, action) => {
      state.loadingPaymentWarrantyPartner = false;
      state.dataPaymentWarrantyPartner = action.payload;
    },
    [getPaymentWarrantyPartnerList.rejected]: (state) => {
      state.loadingPaymentWarrantyPartner = false;
      state.dataPaymentWarrantyPartner = [];
    },

    // Get Payment Warranty Partner Branch List
    [getPaymentWarrantyPartnerBranchList.pending]: (state) => {
      state.loadingPaymentWarrantyPartnerBranch = true;
    },
    [getPaymentWarrantyPartnerBranchList.fulfilled]: (state, action) => {
      state.loadingPaymentWarrantyPartnerBranch = false;
      state.dataPaymentWarrantyPartnerBranch = action.payload;
    },
    [getPaymentWarrantyPartnerBranchList.rejected]: (state) => {
      state.loadingPaymentWarrantyPartnerBranch = false;
      state.dataPaymentWarrantyPartnerBranch = [];
    },

    /** Get Approval History */
    [getApprovalHistory.pending]: (state) => {
      state.loadingApproval = true;
      state.dataApprovalHistory = null;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.loadingApproval = false;
      state.dataApprovalHistory = action.payload;
    },
    [getApprovalHistory.rejected]: (state) => {
      state.loadingApproval = false;
      state.dataApprovalHistory = null;
    },

    /** Get Mutation Approval History */
    [getMutationApprovalHistory.pending]: (state) => {
      state.loadingApproval = true;
      state.dataApprovalHistory = null;
    },
    // Get Hold List Paginate
    [getHoldListPaginate.pending]: (state) => {
      state.loadingHoldList = true;
    },
    [getHoldListPaginate.fulfilled]: (state, action) => {
      state.loadingHoldList = false;
      state.dataHoldList = action.payload || null;
    },
    [getHoldListPaginate.rejected]: (state) => {
      state.loadingHoldList = false;
    },

    // Get Release List Paginate
    [getReleaseListPaginate.pending]: (state) => {
      state.loadingReleaseList = true;
    },
    [getReleaseListPaginate.fulfilled]: (state, action) => {
      state.loadingReleaseList = false;
      state.dataReleaseList = action.payload || null;
    },
    [getReleaseListPaginate.rejected]: (state) => {
      state.loadingReleaseList = false;
    },

    // Get Refund List Paginate
    [getRefundListPaginate.pending]: (state) => {
      state.loadingRefundList = true;
    },
    [getRefundListPaginate.fulfilled]: (state, action) => {
      state.loadingRefundList = false;
      state.dataRefundList = action.payload || null;
    },
    [getRefundListPaginate.rejected]: (state) => {
      state.loadingRefundList = false;
    },

    // Get Hold/Release/Refund Detail List
    [getHoldDetailList.fulfilled]: (state, action) => {
      state.dataHoldDetailList = action.payload?.result || action.payload?.data?.result || [];
    },
    [getReleaseDetailList.fulfilled]: (state, action) => {
      state.dataReleaseDetailList = action.payload?.result || action.payload?.data?.result || [];
    },
    [getRefundDetailList.fulfilled]: (state, action) => {
      state.dataRefundDetailList = action.payload?.result || action.payload?.data?.result || [];
    },
    [getMutationApprovalHistory.fulfilled]: (state, action) => {
      state.loadingApproval = false;
      state.dataApprovalHistory = action.payload;
      state.mutationApprovalHistory = action.payload?.data?.result || [];
    },
    [getMutationApprovalHistory.rejected]: (state) => {
      state.loadingApproval = false;
      state.dataApprovalHistory = null;
    },

    // Get Warranty Type Options
    [getWarrantyTypeOptions.fulfilled]: (state, action) => {
      state.dataWarrantyTypeOptions = action.payload;
    },

    // Get Mutation Category Options
    [getMutationCategoryOptions.pending]: (state) => {
      state.loadingMutation = true;
    },
    [getMutationCategoryOptions.fulfilled]: (state, action) => {
      state.loadingMutation = false;
      state.dataMutationCategoryOptions = action.payload;
    },
    [getMutationCategoryOptions.rejected]: (state) => {
      state.loadingMutation = false;
    },

    // Download Warranty
    [downloadWarrantyList.pending]: (state) => {
      state.loadingList = true;
    },
    [downloadWarrantyList.fulfilled]: (state) => {
      state.loadingList = false;
    },
    [downloadWarrantyList.rejected]: (state) => {
      state.loadingList = false;
    },

    // Download Warranty Detail
    [downloadWarrantyListDetail.pending]: (state) => {
      state.loadingList = true;
    },
    [downloadWarrantyListDetail.fulfilled]: (state) => {
      state.loadingList = false;
    },
    [downloadWarrantyListDetail.rejected]: (state) => {
      state.loadingList = false;
    },

    // Create Payment Warranty
    [createPaymentWarranty.pending]: (state) => {
      state.loadingCreate = true;
    },
    [createPaymentWarranty.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loadingCreate = false;
    },
    [createPaymentWarranty.rejected]: (state, action) => {
      state.loadingCreate = false;
      state.isFailed = true;
      state.result = action.payload;
    },

    // Submit Warranty Request (Unified Hold, Release, Refund)
    [submitWarrantyRequest.pending]: (state) => {
      state.loadingCreate = true;
    },
    [submitWarrantyRequest.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loadingCreate = false;
    },
    [submitWarrantyRequest.rejected]: (state, action) => {
      state.loadingCreate = false;
      state.isFailed = true;
      state.result = action.payload;
    },

    // Create Mutation
    [createMutation.pending]: (state) => {
      state.loadingCreate = true;
    },
    [createMutation.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loadingCreate = false;
    },
    [createMutation.rejected]: (state, action) => {
      state.loadingCreate = false;
      state.isFailed = true;
      state.result = action.payload;
    },

    // Submit Approval (Approve / Reject)
    [submitApproval.pending]: (state) => {
      state.loadingApproval = true;
    },
    [submitApproval.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loadingApproval = false;
    },
    [submitApproval.rejected]: (state, action) => {
      state.loadingApproval = false;
      state.isFailed = true;
      state.result = action.payload;
    },

    // Get All Approval List
    [getAllApprovalList.pending]: (state) => {
      state.loadingApproval = true;
    },
    [getAllApprovalList.fulfilled]: (state, action) => {
      state.loadingApproval = false;
      state.dataListAppHierId = action.payload;
    },
    [getAllApprovalList.rejected]: (state) => {
      state.loadingApproval = false;
    },

    // Get List Approval By Id
    [getListApprovalById.pending]: (state) => {
      state.loadingApproval = true;
    },
    [getListApprovalById.fulfilled]: (state, action) => {
      state.loadingApproval = false;
      state.dataListAppHierDetail = action.payload;
    },
    [getListApprovalById.rejected]: (state) => {
      state.loadingApproval = false;
    },

    [getApprovalHistory.rejected]: (state) => {
      state.loadingApproval = false;
      state.dataApprovalHistory = null;
    },

    // Get Mutation Detail
    [getDetailMutation.pending]: (state) => {
      state.loadingDetailMutation = true;
      state.dataDetailMutation = null;
    },
    [getDetailMutation.fulfilled]: (state, action) => {
      state.loadingDetailMutation = false;
      state.dataDetailMutation = action.payload;
    },
    [getDetailMutation.rejected]: (state) => {
      state.loadingDetailMutation = false;
    },

    // Delete Mutation
    [deleteMutation.pending]: (state) => {
      state.loadingMutation = true;
    },
    [deleteMutation.fulfilled]: (state) => {
      state.loadingMutation = false;
      state.isSuccess = true;
    },
    [deleteMutation.rejected]: (state) => {
      state.loadingMutation = false;
      state.isFailed = true;
    },

    // Update Mutation
    [updateMutation.pending]: (state) => {
      state.loadingMutation = true;
    },
    [updateMutation.fulfilled]: (state) => {
      state.loadingMutation = false;
      state.isSuccess = true;
    },
    [updateMutation.rejected]: (state) => {
      state.loadingMutation = false;
      state.isFailed = true;
    },

    // Update Payment Warranty
    [updatePaymentWarranty.pending]: (state) => {
      state.loadingCreate = true;
    },
    [updatePaymentWarranty.fulfilled]: (state) => {
      state.loadingCreate = false;
      state.isSuccess = true;
    },
    [updatePaymentWarranty.rejected]: (state) => {
      state.loadingCreate = false;
      state.isFailed = true;
    },

    // Upload Warranty Validation
    [uploadWarrantyValidation.pending]: (state) => {
      state.loading_upload_validation = true;
      state.data_upload_validation = null;
    },
    [uploadWarrantyValidation.fulfilled]: (state, action) => {
      state.loading_upload_validation = false;
      state.data_upload_validation = action.payload;
    },
    [uploadWarrantyValidation.rejected]: (state) => {
      state.loading_upload_validation = false;
    },

    // Save Warranty Upload
    [saveWarrantyUpload.pending]: (state) => {
      state.loadingCreate = true;
    },
    [saveWarrantyUpload.fulfilled]: (state) => {
      state.loadingCreate = false;
      state.isSuccess = true;
    },
    [saveWarrantyUpload.rejected]: (state) => {
      state.loadingCreate = false;
      state.isFailed = true;
    },

    // Get List Approval Warranty
    [getListApprovalWarranty.pending]: (state, action) => {
      if (!action.meta.arg.isLoadMore) {
        state.loading_approval_list = true;
      }
    },
    [getListApprovalWarranty.fulfilled]: (state, action) => {
      state.loading_approval_list = false;
      if (action.payload.isLoadMore) {
        state.data_approval_list = {
          ...action.payload,
          result: [...(state.data_approval_list?.result || []), ...(action.payload.result || [])],
        };
      } else {
        state.data_approval_list = action.payload;
      }
    },
    [getListApprovalWarranty.rejected]: (state) => {
      state.loading_approval_list = false;
    },

    // Get Download Template
    [getDownloadTemplate.pending]: (state) => {
      state.loading_download_template = true;
    },
    [getDownloadTemplate.fulfilled]: (state) => {
      state.loading_download_template = false;
    },
    [getDownloadTemplate.rejected]: (state) => {
      state.loading_download_template = false;
    },

    // Get Warranty Summary
    [getWarrantySummary.pending]: (state) => {
      state.loadingSummary = true;
    },
    [getWarrantySummary.fulfilled]: (state, action) => {
      state.loadingSummary = false;
      state.dataSummary = action.payload || [];
    },
    [getWarrantySummary.rejected]: (state) => {
      state.loadingSummary = false;
    },
  },
});


const { reducer } = warrantySlice;

export const {
  selectAll: selectAllWarranties,
  selectById: selectWarrantyById,
  selectIds: selectWarrantyIds,
  selectEntities: selectWarrantyEntities
} = warrantyAdapter.getSelectors(state => state.warranty);

export default reducer;
