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
  dataPartnerList: [],
  dataCollectionAgentList: [],
  dataPaymentChannelList: [],
};

export const getPaginateSetting = createAsyncThunk(
  "GET_ALL_SETTINGS",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/settings/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_SETTINGS_PAGING",
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
      const url = `/v1/dbs/api/settings/list-type`;
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

export const createValidasiSetting = createAsyncThunk(
  "CREATE_MASTER_SETTINGS_VALIDASI",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/settings/validate-create-update`;
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

export const getDownloadSetting = createAsyncThunk(
  "DOWNLOAD_SETTINGS",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/settings/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_SETTINGS",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response);
    }
  }
);

export const inactiveSetting = createAsyncThunk(
  "INACTIVE_SETTINGS",
  async ({ body }, thunkAPI) => {
    let status = body?.status === "Active" ? "Inactivate" : "Activate";
    try {
      const url = `/v1/dbs/api/settings/active-inactive`;
      const response = await receiptCollectionHttpService.activationWithRemarkPost(
        url,
        body
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
          action: "CREATE_SETTINGS",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);


export const createSetting = createAsyncThunk(
  "CREATE_SETTINGS",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/settings/create-update`;
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

export const updateSetting = createAsyncThunk(
  "UPDATE_SETTINGS",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/settings/create-update`;
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

export const getDetailSetting = createAsyncThunk(
  "GET_DETAIL_SETTINGS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/settings/detail-get/${id}`;
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
      const url = `/v1/dbs/api/settings/approval-history-get/${id}`;
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



export const approveOrRejectSetting = createAsyncThunk(
  "APPROVE_OR_REJECT_SETTINGS",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/settings/approve-reject";
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
          description: `Your data was not ${body.action === "APPROVE" ? "approved" : "rejected"
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

export const approveOrRejectInactive = createAsyncThunk(
  "APPROVE_OR_REJECT_FOR_INACTIVE_SETTINGS",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/settings/approve-inactive";
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
          description: `Your data was not ${body.action === "APPROVE" ? "approved" : "rejected"
            }. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);



export const getPartnerList = createAsyncThunk(
  "GET_LIST_PARTNER",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/partner/list`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data
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

export const getCollectionAgentList = createAsyncThunk(
  "GET_LIST_COLLECTION_AGENT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collecting-agent/list`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data
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


export const getPaymentChannelList = createAsyncThunk(
  "GET_LIST_PAYMENT_CHANNEL",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-channel/list`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data
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


const settingSlice = createSlice({
  name: "setting",
  initialState,
  extraReducers: {
    //get all employee paginate reducer
    [getPaginateSetting.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [getPaginateSetting.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getPaginateSetting.rejected]: (state, action) => {
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
    [getDetailSetting.pending]: (state) => {
      state.loading = true;
    },
    [getDetailSetting.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailSetting.rejected]: (state) => {
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



    [approveOrRejectSetting.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectSetting.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveOrRejectSetting.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    [approveOrRejectInactive.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectInactive.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveOrRejectInactive.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },



    // create payment item
    [createSetting.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createSetting.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createSetting.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // update payment
    [updateSetting.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [updateSetting.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isSuccess = false;
    },
    [updateSetting.rejected]: (state) => {
      state.isFailed = false;
    },

    //download
    [getDownloadSetting.fulfilled]: (state, action) => {
      state.data_download = action.payload;
      // state.isSuccess = true;
      state.loading = false;
    },
    [getDownloadSetting.rejected]: (state, action) => {
      state.isFailed = true;
      state.data_download = action.payload;
      state.loading = false;
    },

    //validasi create payment method
    [createValidasiSetting.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createValidasiSetting.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createValidasiSetting.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },



    [inactiveSetting.pending]: (state) => {
      state.loading = true;
    },
    [inactiveSetting.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveSetting.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },

    [getPartnerList.pending]: (state, action) => {
      state.loading = true;
      state.dataPartnerList = action.payload;
    },
    [getPartnerList.fulfilled]: (state, action) => {
      state.dataPartnerList = action.payload;
      state.loading = false;
    },
    [getPartnerList.rejected]: (state, action) => {
      state.dataPartnerList = action.payload;
      state.loading = false;
    },

    [getCollectionAgentList.pending]: (state, action) => {
      state.loading = true;
      state.dataCollectionAgentList = action.payload;
    },
    [getCollectionAgentList.fulfilled]: (state, action) => {
      state.dataCollectionAgentList = action.payload;
      state.loading = false;
    },
    [getCollectionAgentList.rejected]: (state, action) => {
      state.dataCollectionAgentList = action.payload;
      state.loading = false;
    },

    [getPaymentChannelList.pending]: (state, action) => {
      state.loading = true;
      state.dataPaymentChannelList = action.payload;
    },
    [getPaymentChannelList.fulfilled]: (state, action) => {
      state.dataPaymentChannelList = action.payload;
      state.loading = false;
    },
    [getPaymentChannelList.rejected]: (state, action) => {
      state.dataPaymentChannelList = action.payload;
      state.loading = false;
    },

  },
});

const { reducer } = settingSlice;
export default reducer;
