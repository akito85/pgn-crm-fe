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
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataListCategory: [],
  dataApprovalHistory: [],
  dataType: [],
};

export const getPaginatePartner = createAsyncThunk(
  "GET_ALL_PARTNER",
  async ({ search, page, pageSize, sort, isLoadMore }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/partner/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return { ...response.data, isLoadMore: !!isLoadMore };
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_PARTNER_PAGING",
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
      const url = `/v1/dbs/api/partner/list-type`;
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

export const createValidasiPartner = createAsyncThunk(
  "CREATE_MASTER_PARTNER_VALIDASI",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/partner/validate-create-update`;
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

export const getDownloadPartner = createAsyncThunk(
  "DOWNLOAD_PARTNER",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/partner/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_PARTNER",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response);
    }
  }
);


export const createPartner = createAsyncThunk(
  "CREATE_PARTNER",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/partner/create-update`;
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

export const updatePartner = createAsyncThunk(
  "UPDATE_PARTNER",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/partner/create-update`;
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

export const getDetailPartner = createAsyncThunk(
  "GET_DETAIL_PARTNER",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/partner/detail-get/${id}`;
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
      const url = `/v1/dbs/api/partner/approval-history-get/${id}`;
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



export const approveOrRejectPartner = createAsyncThunk(
  "APPROVE_OR_REJECT_PARTNER",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/partner/approve-reject";
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


export const inactivePartner = createAsyncThunk(
  "INACTIVE_PARTNER",
  async ({ body }, thunkAPI) => {
    let status = body?.status === "Active" ? "Inactivate" : "Activate";
    try {
      const url = `/v1/dbs/api/partner/active-inactive`;
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
          action: "INACTIVE_PARTNER",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const approveOrRejectInactivePartner = createAsyncThunk(
  "APPROVE_OR_REJECT_FOR_INACTIVE_PARTNER",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/partner/approve-inactive";
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

export const saveDraftPartner = createAsyncThunk(
  "SAVE_DRAFT_PARTNER",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/partner/save-draft`;
      const data = await receiptCollectionHttpService.createData(url, body);
      const successBody = {
        title: "Successfull",
        description: `Your data has been saved as draft`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
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
        description: `Your draft was not saved. ${message}.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getDetailDraftPartner = createAsyncThunk(
  "GET_DETAIL_DRAFT_PARTNER",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/partner/draft-detail/${id}`;
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

const partnerSlice = createSlice({
  name: "partner",
  initialState,
  extraReducers: {
    //get all employee paginate reducer
    [getPaginatePartner.pending]: (state) => {
      state.loading = true;
    },
    [getPaginatePartner.fulfilled]: (state, action) => {
      const { isLoadMore, ...rest } = action.payload || {};
      if (isLoadMore && state.data?.result) {
        const existingIds = new Set(state.data.result.map((item) => item.id));
        const newItems = (rest.result || []).filter((item) => !existingIds.has(item.id));
        state.data = {
          ...rest,
          result: [...state.data.result, ...newItems],
        };
      } else {
        state.data = rest;
      }
      state.loading = false;
    },
    [getPaginatePartner.rejected]: (state, action) => {
      state.loading = false;
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
    [getDetailPartner.pending]: (state) => {
      state.loading = true;
    },
    [getDetailPartner.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailPartner.rejected]: (state) => {
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



    [approveOrRejectPartner.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    [approveOrRejectInactivePartner.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectInactivePartner.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveOrRejectInactivePartner.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    [saveDraftPartner.pending]: (state) => {
      state.loading = true;
    },
    [saveDraftPartner.fulfilled]: (state) => {
      state.loading = false;
    },
    [saveDraftPartner.rejected]: (state) => {
      state.loading = false;
    },

    [getDetailDraftPartner.pending]: (state) => {
      state.loading = true;
    },
    [getDetailDraftPartner.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailDraftPartner.rejected]: (state) => {
      state.loading = false;
    },



    // create payment item
    [createPartner.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createPartner.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createPartner.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // update payment
    [updatePartner.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [updatePartner.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isSuccess = true;
      state.loading = false;
    },
    [updatePartner.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },

    //download
    [getDownloadPartner.fulfilled]: (state, action) => {
      state.data_download = action.payload;
      // state.isSuccess = true;
      state.loading = false;
    },
    [getDownloadPartner.rejected]: (state, action) => {
      state.isFailed = true;
      state.data_download = action.payload;
      state.loading = false;
    },

    //validasi create payment method
    [createValidasiPartner.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createValidasiPartner.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createValidasiPartner.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    [inactivePartner.pending]: (state) => {
      state.loading = true;
    },
    [inactivePartner.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactivePartner.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },
  },
});

const { reducer } = partnerSlice;
export default reducer;
