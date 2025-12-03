import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../utils";

const initialState = {
  loading: false,
  data: null,
  data_detail: null,
  data_GL: null,
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  data_detail_draft: [],
  dataListCategory: [],
  data_bank: [],
  data_GLAccount: [],
  dataApprovalHistory: [],
};

export const getPaginateItem = createAsyncThunk(
  "GET_ALL_PAYMENT_METHOD",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/payment/item/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_PAYMENT_METHOD",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const createValidasiPayMetohod = createAsyncThunk(
  "CREATE_MASTER_PAYMENT_METHOD_VALIDASI",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment/item/validate-create-update`;
      const data = await receiptCollectionHttpService.createData(url, body);
      return data.data;
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
          description: `${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getDownloadPaymentMethod = createAsyncThunk(
  "DOWNLOAD_PAYMENT_METHOD",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/payment/item/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_PAYMENT_METHOD",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response);
    }
  },
);

export const getGLInformation = createAsyncThunk(
  "GET_DATA_GL",
  async ({ id, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/payment/item/glInformation/paging-${id}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
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
  },
);

// export const inactiveTransaction = createAsyncThunk(
//   "INACTIVE_TRANSACTIOB_CALENDER",
//   async ({ data }, thunkAPI) => {
//     try {
//       const url = `/v1/dbs/api/payment/item/active-inactive`;
//       const response = await receiptCollectionHttpService.inactiveWithApproval(
//         url,
//         data
//       );
//       const successBody = {
//         title: "Successful",
//         description: "Your data has been submitted.",
//         return: false,
//       };
//       thunkAPI.dispatch(showModalSuccess(successBody));
//       return response.data;
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       if (Math.floor((error.response.data.code || 0) / 100) === 4) {
//         const errorBody = {
//           title: "Failed",
//           description: `Your data was not inactivated. ${message}.`,
//           return: false,
//         };
//         thunkAPI.dispatch(showModalError(errorBody));
//       }
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );

export const getBankAccount = createAsyncThunk(
  "GET_ALL_BANK_ACCOUNT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment/item/bank-account/get`;
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
  },
);

export const getGlAccountDDL = createAsyncThunk(
  "GET_ALL_GL_ACCOUNT_DDL",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment/item/gl-account/get`;
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
  },
);

export const createPaymentItem = createAsyncThunk(
  "CREATE_PAYMENT_ITEM",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment/item/create-update`;
      const data = await receiptCollectionHttpService.createData(url, body);
      // const successBody = {
      //   title: "Successfull",
      //   description: `Your data has been created`,
      // };
      // thunkAPI.dispatch(showModalSuccess(successBody));
      return data.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        data: error.response.data.data,
        description: `Your data was not created. ${message}.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const updatePaymentItem = createAsyncThunk(
  "UPDATE_PAYMENT_ITEM",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment/item/create-update`;
      const data = await receiptCollectionHttpService.updateDataPost(url, body);
      // const successBody = {
      //   title: "Successfull",
      //   description: `Your data has been updated`,
      // };
      // thunkAPI.dispatch(showModalSuccess(successBody));
      return data.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        data: error.response.data.data,
        code: error.response.data.code,
        description: `Your data was not updated. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunk.rejectWithValue(error.response.data);
    }
  },
);

export const inactivePaymentItem = createAsyncThunk(
  "INACTIVE_PAYMENT_METHOD",
  async ({ body }, thunkAPI) => {
    let status = body?.status === "Active" ? "Inactivate" : "Activate";
    try {
      const url = `/v1/dbs/api/payment/item/active-inactive`;
      const response = await receiptCollectionHttpService.activationWithRemark(
        url,
        body,
      );
      const successMessage = {
        title: "Successfull",
        description: "Your data has been submitted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(response), status, errorMessage(response)),
          action: "CREATE_PAYMENT_METHOD",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getDetailItem = createAsyncThunk(
  "GET_DETAIL_ITEM",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment/item/detail-get/${id}`;
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
  },
);

export const getDetailDraftItem = createAsyncThunk(
  "GET_DETAIL_ITEM_DRAFT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment/item/draft/detail-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return Array.isArray(response?.data) ? null : response?.data;
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
  },
);

export const getAllApprovalList = createAsyncThunk(
  "GET_ALL_APPROVAL_LIST_METHOD",
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
  },
);

// export const getApprovalHistory = createAsyncThunk(
//   "GET_APPROVAL_HISTORY_METHOD",
//   async (id, thunkAPI) => {
//     try {
//       const url = `/v1/dbs/api/payment/item/approval-history-get/${id}`;
//       const response = await receiptCollectionHttpService.getDetail(url);
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error?.response);
//     }
//   }
// );

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_METHOD",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment/item/approval-history-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_APPROVAL_HISTORY_METHOD",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const approveOrRejectPaymentInactive = createAsyncThunk(
  "APPROVE_OR_REJECT_FOR_INACTIVE_PAYMENT_METHOD",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment/item/approve-inactive";
      const response =
        await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      const message = response?.message;
      const successMessage = {
        title: "Successfull",
        description: `${message}`,
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
          description: `Your data was not ${
            body.action === "APPROVE" ? "approved" : "rejected"
          }. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const approveOrRejectPaymentItem = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_PAYMENT_METHODE",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment/item/approve-reject";
      const response =
        await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      const message = response?.message;
      const successMessage = {
        title: "Successfull",
        description: `${message}`,
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
          description: `Your data was not ${
            body.action === "APPROVE" ? "approved" : "rejected"
          }. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getListApprovalById = createAsyncThunk(
  "GET_LIST_APPROVAL_BY_ID_METHOD",
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
  },
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
  },
);

const itemSlice = createSlice({
  name: "item",
  initialState,
  extraReducers: {
    //get all employee paginate reducer
    [getPaginateItem.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [getPaginateItem.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getPaginateItem.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },

    /** Get Approval History */
    [getApprovalHistory.pending]: (state, action) => {
      state.loadingCalender = true;
      state.dataApprovalHistory = action.payload;
      state.loading = true;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loadingCalender = false;
      state.loading = false;
    },
    [getApprovalHistory.rejected]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loadingCalender = false;
      state.loading = false;
    },

    //get all employee paginate reducer
    [getGLInformation.pending]: (state, action) => {
      state.data_GL = action.payload;
      state.loading = true;
    },
    [getGLInformation.fulfilled]: (state, action) => {
      state.data_GL = action.payload;
      state.loading = false;
    },
    [getGLInformation.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },

    // get detail
    [getDetailItem.pending]: (state) => {
      state.loading = true;
    },
    [getDetailItem.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailItem.rejected]: (state) => {
      state.loading = true;
    },

    // get detail draft
    [getDetailDraftItem.pending]: (state) => {
      state.loading = true;
    },
    [getDetailDraftItem.fulfilled]: (state, action) => {
      state.data_detail_draft = action.payload;
      state.loading = false;
    },
    [getDetailDraftItem.rejected]: (state) => {
      state.loading = true;
    },

    // inactive app
    [inactivePaymentItem.pending]: (state) => {
      state.loading = true;
    },
    [inactivePaymentItem.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactivePaymentItem.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },
    // Get Approve Hierarchy List
    [getAllApprovalList.pending]: (state, action) => {
      state.loading = true;
      state.dataListAppHierId = action.payload;
    },
    [getAllApprovalList.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    [getAllApprovalList.rejected]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },

    // Get List Approval By Id
    [getListApprovalById.pending]: (state, action) => {
      state.loading = true;
      state.dataListAppHierDetail = action.payload;
    },
    [getListApprovalById.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },
    [getListApprovalById.rejected]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
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

    /** Get List Bank Account */
    [getBankAccount.pending]: (state, action) => {
      state.data_bank = action.payload;
      state.loadingProduct = true;
    },
    [getBankAccount.fulfilled]: (state, action) => {
      state.data_bank = action.payload;
      state.loadingProduct = false;
    },
    [getBankAccount.rejected]: (state, action) => {
      state.data_bank = action.payload;
      state.loadingProduct = false;
    },

    //get lis gl ddl
    [getGlAccountDDL.pending]: (state, action) => {
      state.data_GLAccount = action.payload;
      state.loadingProduct = true;
    },
    [getGlAccountDDL.fulfilled]: (state, action) => {
      state.data_GLAccount = action.payload;
      state.loadingProduct = false;
    },
    [getGlAccountDDL.rejected]: (state, action) => {
      state.data_GLAccount = action.payload;
      state.loadingProduct = false;
    },

    [approveOrRejectPaymentItem.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectPaymentItem.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveOrRejectPaymentItem.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    [approveOrRejectPaymentInactive.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectPaymentInactive.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveOrRejectPaymentInactive.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    // create payment item
    [createPaymentItem.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createPaymentItem.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createPaymentItem.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // update payment
    [updatePaymentItem.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [updatePaymentItem.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isSuccess = false;
    },
    [updatePaymentItem.rejected]: (state) => {
      state.isFailed = false;
    },

    //download
    [getDownloadPaymentMethod.fulfilled]: (state, action) => {
      state.data_download = action.payload;
      // state.isSuccess = true;
      state.loading = false;
    },
    [getDownloadPaymentMethod.rejected]: (state, action) => {
      state.isFailed = true;
      state.data_download = action.payload;
      state.loading = false;
    },
    [getDownloadPaymentMethod.fulfilled]: (state, action) => {
      state.data_download_statement = action.payload;
      // state.isSuccess = true;
      state.loading = false;
    },
    [getDownloadPaymentMethod.rejected]: (state, action) => {
      state.isFailed = true;
      state.data_download_statement = action.payload;
      state.loading = false;
    },

    //validasi create payment method
    [createValidasiPayMetohod.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createValidasiPayMetohod.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createValidasiPayMetohod.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = itemSlice;
export default reducer;
