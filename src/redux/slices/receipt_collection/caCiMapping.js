import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../general_slice";

const BASE_URL = "/v1/dbs/api/ca-ci-mapping";

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
  dataCollectingAgentList: [],
  dataDeliveryChannelList: [],
};

export const getPaginateCaCiMapping = createAsyncThunk(
  "GET_ALL_CA_CI_MAPPING",
  async ({ search, page, pageSize, sort, isLoadMore }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `${BASE_URL}/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return { ...response.data, isLoadMore: !!isLoadMore };
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_ALL_CA_CI_MAPPING_PAGING", back: false })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getDownloadCaCiMapping = createAsyncThunk(
  "DOWNLOAD_CA_CI_MAPPING",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `${BASE_URL}/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({ error: response, action: "DOWNLOAD_CA_CI_MAPPING", back: false })
      );
      return thunkAPI.rejectWithValue(response.response);
    }
  }
);

export const createCaCiMapping = createAsyncThunk(
  "CREATE_CA_CI_MAPPING",
  async (body, thunkAPI) => {
    try {
      const url = `${BASE_URL}/create-update`;
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const updateCaCiMapping = createAsyncThunk(
  "UPDATE_CA_CI_MAPPING",
  async (body, thunkAPI) => {
    try {
      const url = `${BASE_URL}/create-update`;
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const createValidasiCaCiMapping = createAsyncThunk(
  "VALIDATE_CA_CI_MAPPING",
  async (body, thunkAPI) => {
    try {
      const url = `${BASE_URL}/validate-create-update`;
      const data = await receiptCollectionHttpService.createData(url, body);
      return data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
        const errorBody = { title: "Failed", description: `${message}.` };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getDetailCaCiMapping = createAsyncThunk(
  "GET_DETAIL_CA_CI_MAPPING",
  async (id, thunkAPI) => {
    try {
      const url = `${BASE_URL}/detail-get/${id}`;
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

export const getDetailDraftCaCiMapping = createAsyncThunk(
  "GET_DETAIL_DRAFT_CA_CI_MAPPING",
  async (id, thunkAPI) => {
    try {
      const url = `${BASE_URL}/draft-detail/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = { title: "Failed", description: `${message}` };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const saveDraftCaCiMapping = createAsyncThunk(
  "SAVE_DRAFT_CA_CI_MAPPING",
  async (body, thunkAPI) => {
    try {
      const url = `${BASE_URL}/save-draft`;
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const approveOrRejectCaCiMapping = createAsyncThunk(
  "APPROVE_REJECT_CA_CI_MAPPING",
  async ({ body }, thunkAPI) => {
    try {
      const url = `${BASE_URL}/approve-reject`;
      const response = await receiptCollectionHttpService.createData(url, body);
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
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Your data was not ${body.action === "APPROVE" ? "approved" : "rejected"}. ${message}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const approveOrRejectInactiveCaCiMapping = createAsyncThunk(
  "APPROVE_REJECT_INACTIVE_CA_CI_MAPPING",
  async ({ body }, thunkAPI) => {
    try {
      const url = `${BASE_URL}/approve-inactive`;
      const response = await receiptCollectionHttpService.createData(url, body);
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
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Your data was not ${body.action === "APPROVE" ? "approved" : "rejected"}. ${message}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const inactiveCaCiMapping = createAsyncThunk(
  "INACTIVE_CA_CI_MAPPING",
  async ({ body }, thunkAPI) => {
    const action = body?.status === "Active" ? "Inactivate" : "Activate";
    try {
      const url = `${BASE_URL}/active-inactive`;
      const response = await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      const successMessage = {
        title: "Successfull",
        description: "Your data has been submitted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorObj = { title: "Failed", description: `Your data was not ${action}d. ${message}.` };
      thunkAPI.dispatch(showModalError(errorObj));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getApprovalHistoryCaCiMapping = createAsyncThunk(
  "GET_APPROVAL_HISTORY_CA_CI_MAPPING",
  async (id, thunkAPI) => {
    try {
      const url = `${BASE_URL}/approval-history-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getAllApprovalListCaCiMapping = createAsyncThunk(
  "GET_ALL_APPROVAL_LIST_CA_CI_MAPPING",
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

export const getListApprovalByIdCaCiMapping = createAsyncThunk(
  "GET_LIST_APPROVAL_BY_ID_CA_CI_MAPPING",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/apphier/get-approval-hierarchies/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = { title: "Failed", description: `${message}` };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getTypeDDLCaCiMapping = createAsyncThunk(
  "GET_TYPE_DDL_CA_CI_MAPPING",
  async (thunkAPI) => {
    try {
      const url = `${BASE_URL}/list-type`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = { title: "Failed", description: `${message}` };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListPartnerDDL = createAsyncThunk(
  "GET_LIST_PARTNER_DDL_CA_CI_MAPPING",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/partner/list`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = { title: "Failed", description: `${message}` };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListCollectingAgentDDL = createAsyncThunk(
  "GET_LIST_COLLECTING_AGENT_DDL_CA_CI_MAPPING",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collecting-agent/list`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = { title: "Failed", description: `${message}` };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListDeliveryChannelDDL = createAsyncThunk(
  "GET_LIST_DELIVERY_CHANNEL_DDL_CA_CI_MAPPING",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-channel/list`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = { title: "Failed", description: `${message}` };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListCategoryCaCiMapping = createAsyncThunk(
  "GET_LIST_CATEGORY_CA_CI_MAPPING",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/attachment/list-category";
      const response = await receiptCollectionHttpService.getAll(url);
      return response?.data?.data?.map((item) => ({
        Id: item?.glbTypeValId,
        text: item?.name,
      }));
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = { title: "Failed", description: `${message}` };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

const caCiMappingSlice = createSlice({
  name: "caCiMapping",
  initialState,
  extraReducers: {
    // get paginate list
    [getPaginateCaCiMapping.pending]: (state) => {
      state.loading = true;
    },
    [getPaginateCaCiMapping.fulfilled]: (state, action) => {
      const { isLoadMore, ...rest } = action.payload || {};
      if (isLoadMore && state.data?.result) {
        const existingIds = new Set(state.data.result.map((item) => item.id));
        const newItems = (rest.result || []).filter((item) => !existingIds.has(item.id));
        state.data = { ...rest, result: [...state.data.result, ...newItems] };
      } else {
        state.data = rest;
      }
      state.loading = false;
    },
    [getPaginateCaCiMapping.rejected]: (state) => {
      state.loading = false;
    },

    // get detail
    [getDetailCaCiMapping.pending]: (state) => {
      state.loading = true;
    },
    [getDetailCaCiMapping.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailCaCiMapping.rejected]: (state) => {
      state.loading = false;
    },

    // get detail draft
    [getDetailDraftCaCiMapping.pending]: (state) => {
      state.loading = true;
    },
    [getDetailDraftCaCiMapping.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailDraftCaCiMapping.rejected]: (state) => {
      state.loading = false;
    },

    // create
    [createCaCiMapping.pending]: (state) => {
      state.loading = true;
    },
    [createCaCiMapping.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createCaCiMapping.rejected]: (state) => {
      state.loading = false;
    },

    // update
    [updateCaCiMapping.pending]: (state) => {
      state.loading = true;
    },
    [updateCaCiMapping.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [updateCaCiMapping.rejected]: (state) => {
      state.loading = false;
    },

    // validate
    [createValidasiCaCiMapping.pending]: (state) => {
      state.loading = true;
    },
    [createValidasiCaCiMapping.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createValidasiCaCiMapping.rejected]: (state) => {
      state.loading = false;
    },

    // save draft
    [saveDraftCaCiMapping.pending]: (state) => {
      state.loading = true;
    },
    [saveDraftCaCiMapping.fulfilled]: (state) => {
      state.loading = false;
    },
    [saveDraftCaCiMapping.rejected]: (state) => {
      state.loading = false;
    },

    // approve reject
    [approveOrRejectCaCiMapping.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectCaCiMapping.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectCaCiMapping.rejected]: (state) => {
      state.loading = false;
    },

    // approve reject inactive
    [approveOrRejectInactiveCaCiMapping.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectInactiveCaCiMapping.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectInactiveCaCiMapping.rejected]: (state) => {
      state.loading = false;
    },

    // inactive
    [inactiveCaCiMapping.pending]: (state) => {
      state.loading = true;
    },
    [inactiveCaCiMapping.fulfilled]: (state) => {
      state.loading = false;
    },
    [inactiveCaCiMapping.rejected]: (state) => {
      state.loading = false;
    },

    // approval history
    [getApprovalHistoryCaCiMapping.pending]: (state) => {
      state.loading = true;
    },
    [getApprovalHistoryCaCiMapping.fulfilled]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loading = false;
    },
    [getApprovalHistoryCaCiMapping.rejected]: (state) => {
      state.loading = false;
    },

    // approval list
    [getAllApprovalListCaCiMapping.pending]: (state) => {
      state.loading = true;
    },
    [getAllApprovalListCaCiMapping.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    [getAllApprovalListCaCiMapping.rejected]: (state) => {
      state.loading = false;
    },

    // approval list by id
    [getListApprovalByIdCaCiMapping.pending]: (state) => {
      state.loading = true;
    },
    [getListApprovalByIdCaCiMapping.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },
    [getListApprovalByIdCaCiMapping.rejected]: (state) => {
      state.loading = false;
    },

    // type DDL
    [getTypeDDLCaCiMapping.fulfilled]: (state, action) => {
      state.dataType = action.payload;
      state.loading = false;
    },

    // partner DDL
    [getListPartnerDDL.fulfilled]: (state, action) => {
      state.dataPartnerList = action.payload;
      state.loading = false;
    },

    // collecting agent DDL
    [getListCollectingAgentDDL.fulfilled]: (state, action) => {
      state.dataCollectingAgentList = action.payload;
      state.loading = false;
    },

    // delivery channel DDL
    [getListDeliveryChannelDDL.fulfilled]: (state, action) => {
      state.dataDeliveryChannelList = action.payload;
      state.loading = false;
    },

    // list category
    [getListCategoryCaCiMapping.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },

    // download
    [getDownloadCaCiMapping.fulfilled]: (state, action) => {
      state.data_download = action.payload;
      state.loading = false;
    },
    [getDownloadCaCiMapping.rejected]: (state) => {
      state.loading = false;
    },
  },
});

const { reducer } = caCiMappingSlice;
export default reducer;
