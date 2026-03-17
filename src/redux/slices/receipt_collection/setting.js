import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
  dataMappingList: [],
};

export const getPaginatePayChannelConfig = createAsyncThunk(
  "GET_ALL_PAY_CHANNEL_CONFIG",
  async ({ search, page, pageSize, sort, isLoadMore }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/settings/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return { data: response.data, isLoadMore };
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_PAY_CHANNEL_CONFIG",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListMappingDDL = createAsyncThunk(
  "GET_LIST_MAPPING_DDL",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/settings/get-mapping-ddl`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = { title: "Failed", description: `${message}` };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const createValidasiPayChannelConfig = createAsyncThunk(
  "CREATE_PAY_CHANNEL_CONFIG_VALIDASI",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/settings/validate-create-update`;
      const data = await receiptCollectionHttpService.createData(url, body);
      return data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = { title: "Failed", description: `${message}.` };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getDownloadPayChannelConfig = createAsyncThunk(
  "DOWNLOAD_PAY_CHANNEL_CONFIG",
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
          action: "DOWNLOAD_PAY_CHANNEL_CONFIG",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response);
    }
  }
);

export const inactivePayChannelConfig = createAsyncThunk(
  "INACTIVE_PAY_CHANNEL_CONFIG",
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
          action: "INACTIVE_PAY_CHANNEL_CONFIG",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response?.data || response);
    }
  }
);


export const createPayChannelConfig = createAsyncThunk(
  "CREATE_PAY_CHANNEL_CONFIG",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/settings/create-update`;
      const data = await receiptCollectionHttpService.createData(url, body);
      return data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        data: error.response?.data?.data,
        description: `Your data was not created. ${message}.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response?.data || error);
    }
  }
);

export const updatePayChannelConfig = createAsyncThunk(
  "UPDATE_PAY_CHANNEL_CONFIG",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/settings/create-update`;
      const data = await receiptCollectionHttpService.updateDataPost(url, body);
      return data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        data: error.response?.data?.data,
        code: error.response?.data?.code,
        description: `Your data was not updated. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response?.data || error);
    }
  }
);

export const saveDraftPayChannelConfig = createAsyncThunk(
  "SAVE_DRAFT_PAY_CHANNEL_CONFIG",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/settings/save-draft`;
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
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        data: error.response?.data?.data,
        description: `Your draft was not saved. ${message}.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response?.data || error);
    }
  }
);

export const getDetailPayChannelConfig = createAsyncThunk(
  "GET_DETAIL_PAY_CHANNEL_CONFIG",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/settings/detail-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = { title: "Failed", description: `${message}` };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getDetailDraftPayChannelConfig = createAsyncThunk(
  "GET_DETAIL_DRAFT_PAY_CHANNEL_CONFIG",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/settings/detail-draft/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = { title: "Failed", description: `${message}` };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);



export const getAllApprovalListPayChannelConfig = createAsyncThunk(
  "GET_ALL_APPROVAL_LIST_METHOD_PAY_CHANNEL_CONFIG",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/apphier/get-list-approval-hierarchies`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = { title: "Failed", description: `${message}` };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getApprovalHistoryPayChannelConfig = createAsyncThunk(
  "GET_APPROVAL_HISTORY_METHOD_PAY_CHANNEL_CONFIG",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/settings/approval-history-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_APPROVAL_HISTORY_PAY_CHANNEL_CONFIG",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const approveOrRejectPayChannelConfig = createAsyncThunk(
  "APPROVE_OR_REJECT_PAY_CHANNEL_CONFIG",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/settings/approve-reject";
      const response = await receiptCollectionHttpService.activationWithRemarkPost(url, body);
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
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${body.action === "APPROVE" ? "approved" : "rejected"}. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getListApprovalByIdPayChannelConfig = createAsyncThunk(
  "GET_LIST_APPROVAL_BY_ID_METHOD_PAY_CHANNEL_CONFIG",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/apphier/get-approval-hierarchies/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = { title: "Failed", description: `${message}` };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListCategoryPayChannelConfig = createAsyncThunk(
  "GET_LIST_CATEGORY_PAY_CHANNEL_CONFIG",
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
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = { title: "Failed", description: `${message}` };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const approveOrRejectInactivePayChannelConfig = createAsyncThunk(
  "APPROVE_OR_REJECT_FOR_INACTIVE_PAY_CHANNEL_CONFIG",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/settings/approve-inactive";
      const response = await receiptCollectionHttpService.activationWithRemarkPost(url, body);
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
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${body.action === "APPROVE" ? "approved" : "rejected"}. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const settingSlice = createSlice({
  name: "setting",
  initialState,
  extraReducers: {
    [getPaginatePayChannelConfig.pending]: (state) => {
      state.loading = true;
    },
    [getPaginatePayChannelConfig.fulfilled]: (state, action) => {
      if (action.payload.isLoadMore) {
        state.data = {
          ...action.payload.data,
          result: [...(state.data?.result || []), ...(action.payload.data.result || [])],
        };
      } else {
        state.data = action.payload.data;
      }
      state.loading = false;
    },
    [getPaginatePayChannelConfig.rejected]: (state) => {
      state.loading = false;
    },

    [getListMappingDDL.pending]: (state, action) => {
      state.loading = true;
      state.dataMappingList = action.payload;
    },
    [getListMappingDDL.fulfilled]: (state, action) => {
      state.dataMappingList = action.payload;
      state.loading = false;
    },
    [getListMappingDDL.rejected]: (state, action) => {
      state.dataMappingList = action.payload;
      state.loading = false;
    },

    [getApprovalHistoryPayChannelConfig.pending]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loading = true;
    },
    [getApprovalHistoryPayChannelConfig.fulfilled]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loading = false;
    },
    [getApprovalHistoryPayChannelConfig.rejected]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loading = false;
    },

    [getDetailPayChannelConfig.pending]: (state) => {
      state.loading = true;
    },
    [getDetailPayChannelConfig.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailPayChannelConfig.rejected]: (state) => {
      state.loading = false;
    },

    [getDetailDraftPayChannelConfig.pending]: (state) => {
      state.loading = true;
    },
    [getDetailDraftPayChannelConfig.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailDraftPayChannelConfig.rejected]: (state) => {
      state.loading = false;
    },

    [getAllApprovalListPayChannelConfig.pending]: (state, action) => {
      state.loading = true;
      state.dataListAppHierId = action.payload;
    },
    [getAllApprovalListPayChannelConfig.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    [getAllApprovalListPayChannelConfig.rejected]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },

    [getListApprovalByIdPayChannelConfig.pending]: (state, action) => {
      state.loading = true;
      state.dataListAppHierDetail = action.payload;
    },
    [getListApprovalByIdPayChannelConfig.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },
    [getListApprovalByIdPayChannelConfig.rejected]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },

    [getListCategoryPayChannelConfig.pending]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = true;
    },
    [getListCategoryPayChannelConfig.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },
    [getListCategoryPayChannelConfig.rejected]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },

    [approveOrRejectPayChannelConfig.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectPayChannelConfig.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectPayChannelConfig.rejected]: (state) => {
      state.loading = false;
    },

    [approveOrRejectInactivePayChannelConfig.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectInactivePayChannelConfig.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectInactivePayChannelConfig.rejected]: (state) => {
      state.loading = false;
    },

    [createPayChannelConfig.pending]: (state) => {
      state.loading = true;
    },
    [createPayChannelConfig.fulfilled]: (state) => {
      state.loading = false;
    },
    [createPayChannelConfig.rejected]: (state) => {
      state.loading = false;
    },

    [updatePayChannelConfig.pending]: (state) => {
      state.loading = true;
    },
    [updatePayChannelConfig.fulfilled]: (state) => {
      state.loading = false;
    },
    [updatePayChannelConfig.rejected]: (state) => {
      state.loading = false;
    },

    [getDownloadPayChannelConfig.pending]: (state) => {
      state.loading = true;
    },
    [getDownloadPayChannelConfig.fulfilled]: (state) => {
      state.loading = false;
    },
    [getDownloadPayChannelConfig.rejected]: (state) => {
      state.loading = false;
    },

    [createValidasiPayChannelConfig.pending]: (state) => {
      state.loading = true;
    },
    [createValidasiPayChannelConfig.fulfilled]: (state) => {
      state.loading = false;
    },
    [createValidasiPayChannelConfig.rejected]: (state) => {
      state.loading = false;
    },

    [inactivePayChannelConfig.pending]: (state) => {
      state.loading = true;
    },
    [inactivePayChannelConfig.fulfilled]: (state) => {
      state.loading = false;
    },
    [inactivePayChannelConfig.rejected]: (state) => {
      state.loading = false;
    },

    [saveDraftPayChannelConfig.pending]: (state) => {
      state.loading = true;
    },
    [saveDraftPayChannelConfig.fulfilled]: (state) => {
      state.loading = false;
    },
    [saveDraftPayChannelConfig.rejected]: (state) => {
      state.loading = false;
    },

  },
});

const { reducer } = settingSlice;
export default reducer;
