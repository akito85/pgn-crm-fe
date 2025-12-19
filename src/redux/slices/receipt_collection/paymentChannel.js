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
import { data } from "autoprefixer";

const initialState = {
  loading: false,
  data: null,
  data_detail: null,
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataListCategory: [],
  dataApprovalHistory: [],
  dataType: [],
  dataCategory: []
};

export  const getPaginatePaymentChannel = createAsyncThunk(
  "GET_ALL_PAYMENT_CHANNEL",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/payment-channel/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_PAYMENT_CHANNEL_PAGING",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getTypeDDL = createAsyncThunk(
  "GET_LIST_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-channel/list-type`;
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

export const createValidasiPaymentChannel = createAsyncThunk(
  "CREATE_MASTER_PAYMENT_CHANNEL_VALIDASI",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-channel/validate-create-update`;
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
  }
);

export const getDownloadPaymentChannel = createAsyncThunk(
  "DOWNLOAD_PAYMENT_CHANNEL",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/payment-channel/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_PAYMENT_CHANNEL",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response);
    }
  }
);


export const createPaymentChannel = createAsyncThunk(
  "CREATE_PAYMENT_CHANNEL",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-channel/create-update`;
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
  }
);

export const updatePaymentChannel = createAsyncThunk(
  "UPDATE_PAYMENT_CHANNEL",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-channel/create-update`;
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
  }
);

export const getDetailPaymentChannel = createAsyncThunk(
  "GET_DETAIL_PAYMENT_CHANNEL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-channel/detail-get/${id}`;
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
  }
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
      const url = `/v1/dbs/api/payment-channel/approval-history-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_APPROVAL_HISTORY",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);



export const approveOrRejectPaymentChannel = createAsyncThunk(
  "APPROVE_OR_REJECT_PAYMENT_CHANNEL",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-channel/approve-reject";
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
  }
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


export const getCategoryPayment = createAsyncThunk(
  "GET_LIST_CATEGORY_PAYMENT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-channel/list-category`;
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

const paymentChannelSlice = createSlice({
  name: "paymentChannel",
  initialState,
  extraReducers: {
    //get all employee paginate reducer
    [getPaginatePaymentChannel.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [getPaginatePaymentChannel.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getPaginatePaymentChannel.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },

    // get type ddl
    [getTypeDDL.pending]: (state, action) => {
      state.loading = true;
      state.dataType = action.payload;
    },
    [getTypeDDL.fulfilled]: (state, action) => {
      state.dataType = action.payload;
      state.loading = false;
    },
    [getTypeDDL.rejected]: (state, action) => {
      state.dataType = action.payload;
      state.loading = false;
    },

    [getCategoryPayment.pending]: (state, action) => {
      state.loading = true;
      state.dataCategory = action.payload;
    },
    [getCategoryPayment.fulfilled]: (state, action) => {
      state.dataCategory = action.payload;
      state.loading = false;
    },
    [getCategoryPayment.rejected]: (state, action) => {
      state.dataCategory = action.payload;
      state.loading = false;
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

    // get detail
    [getDetailPaymentChannel.pending]: (state) => {
      state.loading = true;
    },
    [getDetailPaymentChannel.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailPaymentChannel.rejected]: (state) => {
      state.loading = true;
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

    

    [approveOrRejectPaymentChannel.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectPaymentChannel.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveOrRejectPaymentChannel.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    

    // create payment item
    [createPaymentChannel.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createPaymentChannel.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createPaymentChannel.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // update payment
    [updatePaymentChannel.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [updatePaymentChannel.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isSuccess = false;
    },
    [updatePaymentChannel.rejected]: (state) => {
      state.isFailed = false;
    },

    //download
    [getDownloadPaymentChannel.fulfilled]: (state, action) => {
      state.data_download = action.payload;
      // state.isSuccess = true;
      state.loading = false;
    },
    [getDownloadPaymentChannel.rejected]: (state, action) => {
      state.isFailed = true;
      state.data_download = action.payload;
      state.loading = false;
    },

    //validasi create payment method
    [createValidasiPaymentChannel.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createValidasiPaymentChannel.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createValidasiPaymentChannel.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = paymentChannelSlice;
export default reducer;
