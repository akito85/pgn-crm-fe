import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
  showModalError,
  setBodyError,
  showModalSuccess,
  validateError,
} from "../general_slice";


const initialState = {
  data: [],
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

  dataMutationInfo: null,
  dataDetailMutation: null,
  loadingMutation: false,
  loadingDetailMutation: false,

  dataPaymentWarrantyPartner: [],
  loadingPaymentWarrantyPartner: false,

  dataPaymentWarrantyPartnerBranch: [],
  loadingPaymentWarrantyPartnerBranch: false,

  dataWarrantyTypeOptions: [],
  dataMutationCategoryOptions: [],

  loading: false,
  loadingList: false,
  loadingDetail: false,
  loadingApproval: false,
  loadingCreate: false,
  isFailed: false,
  isSuccess: false,
  message: "",
};

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

export const getMutationApprovalHistory = createAsyncThunk(
  "GET_MUTATION_APPROVAL_HISTORY",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/mutation/approval-history-get/${id}`;
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
      const response = await receiptCollectionHttpService.createData(url, body);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${body.action === "APPROVE" ? "approved" : "rejected"
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
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-warranty/update";
      const response = await receiptCollectionHttpService.updateDataPost(url, body);
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
      state.dataMutationInfo = null;
    },
    [getDetailWarrantyMutation.fulfilled]: (state, action) => {
      state.loadingMutation = false;
      state.dataMutationInfo = action.payload;
    },
    [getDetailWarrantyMutation.rejected]: (state) => {
      state.loadingMutation = false;
      state.dataMutationInfo = null;
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
    [getMutationApprovalHistory.fulfilled]: (state, action) => {
      state.loadingApproval = false;
      state.dataApprovalHistory = action.payload;
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
  },
});

const { reducer } = warrantySlice;
export default reducer;

