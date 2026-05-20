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
  dataType: [],
  dataPartner: [],
  dataCollectionAgent: [],
  dataBankList: [],
};

// ─── LIST (infinity scroll) ────────────────────────────────────────────────
export const getPaginatePartner = createAsyncThunk(
  "GET_ALL_PARTNER_CA",
  async ({ search, page, pageSize, sort, isLoadMore }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/partner-ca-mapping/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return { ...response.data, isLoadMore: isLoadMore ?? false };
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error,
          action: "GET_ALL_PARTNER_CA",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

// ─── VALIDATE CREATE / UPDATE ────────────────────────────────────────────────
export const createValidasiPartner = createAsyncThunk(
  "CREATE_MASTER_PARTNER_CA_VALIDASI",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/partner-ca-mapping/validate-create-update`;
      const data = await receiptCollectionHttpService.createData(url, body);
      return data.data;
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}.` }));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// ─── CREATE ─────────────────────────────────────────────────────────────────
export const createPartner = createAsyncThunk(
  "CREATE_PARTNER_CA",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/partner-ca-mapping/create-update`;
      const data = await receiptCollectionHttpService.createData(url, body);
      return data.data;
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      thunkAPI.dispatch(
        showModalError({ title: "Failed", data: error.response?.data?.data,
          description: `Your data was not created. ${message}.` })
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// ─── UPDATE ──────────────────────────────────────────────────────────────────
export const updatePartner = createAsyncThunk(
  "UPDATE_PARTNER_CA",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/partner-ca-mapping/create-update`;
      const data = await receiptCollectionHttpService.updateDataPost(url, body);
      return data.data;
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      thunkAPI.dispatch(
        showModalError({ title: "Failed", data: error.response?.data?.data,
          code: error.response?.data?.code,
          description: `Your data was not updated. ${message}. Please try again.` })
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// ─── DETAIL ───────────────────────────────────────────────────────────────────
export const getDetailPartner = createAsyncThunk(
  "GET_DETAIL_PARTNER_CA",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/partner-ca-mapping/detail-get/${id}`;
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
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

// ─── APPROVAL HIERARCHY LIST ─────────────────────────────────────────────────
export const getAllApprovalList = createAsyncThunk(
  "GET_ALL_APPROVAL_LIST_PARTNER_CA",
  async (_, thunkAPI) => {
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
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

// ─── APPROVAL BY ID ──────────────────────────────────────────────────────────
export const getListApprovalById = createAsyncThunk(
  "GET_LIST_APPROVAL_BY_ID_PARTNER_CA",
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
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

// ─── APPROVAL HISTORY ────────────────────────────────────────────────────────
export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_PARTNER_CA",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/partner-ca-mapping/approval-history-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_APPROVAL_HISTORY_PARTNER_CA", back: false })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

// ─── DOWNLOAD ────────────────────────────────────────────────────────────────
export const getDownloadPartner = createAsyncThunk(
  "DOWNLOAD_PARTNER_CA",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/partner-ca-mapping/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({ error: response, action: "DOWNLOAD_PARTNER_CA", back: false })
      );
      return thunkAPI.rejectWithValue(response.response);
    }
  }
);

// ─── APPROVE / REJECT ────────────────────────────────────────────────────────
export const approveOrRejectPartner = createAsyncThunk(
  "APPROVE_OR_REJECT_PARTNER_CA",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/partner-ca-mapping/approve-reject";
      const response =
        await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      thunkAPI.dispatch(
        showModalSuccess({ title: "Successfull", description: `${response?.message}`, return: true })
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
        thunkAPI.dispatch(
          showModalError({ title: "Failed",
            description: `Your data was not ${body.action === "APPROVE" ? "approved" : "rejected"}. ${message}.`,
            return: false })
        );
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// ─── ACTIVE / INACTIVE ───────────────────────────────────────────────────────
export const inactivePartnerCa = createAsyncThunk(
  "INACTIVE_PARTNER_CA",
  async ({ body }, thunkAPI) => {
    const status = body?.status === "Active" ? "Inactivate" : "Activate";
    try {
      const url = `/v1/dbs/api/partner-ca-mapping/active-inactive`;
      const response = await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      thunkAPI.dispatch(
        showModalSuccess({ title: "Successfull", description: "Your data has been submitted.", return: false })
      );
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error.response), status, errorMessage(error.response)),
          action: "INACTIVE_PARTNER_CA",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// ─── APPROVE INACTIVE ────────────────────────────────────────────────────────
export const approveOrRejectInactivePartnerCa = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_PARTNER_CA",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/partner-ca-mapping/approve-inactive";
      const response =
        await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      thunkAPI.dispatch(
        showModalSuccess({ title: "Successfull", description: `${response?.message}`, return: true })
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
        thunkAPI.dispatch(
          showModalError({ title: "Failed",
            description: `Your data was not ${body.action === "APPROVE" ? "approved" : "rejected"}. ${message}.`,
            return: false })
        );
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// ─── SAVE DRAFT ───────────────────────────────────────────────────────────────
export const saveDraftPartnerCa = createAsyncThunk(
  "SAVE_DRAFT_PARTNER_CA",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/partner-ca-mapping/save-draft`;
      const data = await receiptCollectionHttpService.createData(url, { ...body, isDraft: true });
      thunkAPI.dispatch(
        showModalSuccess({ title: "Successfull", description: `Your data has been saved as draft`, return: false })
      );
      return data.data;
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      thunkAPI.dispatch(
        showModalError({ title: "Failed", data: error.response?.data?.data,
          description: `Your draft was not saved. ${message}.` })
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// ─── DDL LISTS ─────────────────────────────────────────────────────────────
export const getTypeDDL = createAsyncThunk(
  "GET_LIST_TYPE_PARTNER_CA",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/partner-ca/list-type`;
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
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getPartnerList = createAsyncThunk(
  "GET_LIST_PARTNER_FOR_MAPPING",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/partner/list`;
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
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getCollectionAgentList = createAsyncThunk(
  "GET_LIST_COLLECTION_AGENT_FOR_MAPPING",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collecting-agent/list`;
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
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getBankListDDL = createAsyncThunk(
  "GET_LIST_BANK_FOR_MAPPING",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/partner-ca-mapping/bank-list`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY_PARTNER_CA",
  async (_, thunkAPI) => {
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
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

// ─── SLICE ───────────────────────────────────────────────────────────────────
const partnerCaSlice = createSlice({
  name: "partnerCa",
  initialState,
  extraReducers: {
    // get list (infinity scroll) – merge result when isLoadMore=true
    [getPaginatePartner.pending]: (state) => {
      state.loading = true;
    },
    [getPaginatePartner.fulfilled]: (state, action) => {
      const payload = action.payload;
      if (payload?.isLoadMore && state.data?.result) {
        state.data = {
          ...payload,
          result: [...state.data.result, ...(payload?.result ?? [])],
        };
      } else {
        state.data = payload;
      }
      state.loading = false;
    },
    [getPaginatePartner.rejected]: (state) => {
      state.loading = false;
    },

    [createValidasiPartner.pending]: (state) => { state.loading = true; },
    [createValidasiPartner.fulfilled]: (state, action) => { state.data = action.payload; state.loading = false; },
    [createValidasiPartner.rejected]: (state) => { state.loading = false; },

    [createPartner.pending]: (state) => { state.loading = true; },
    [createPartner.fulfilled]: (state) => { state.loading = false; },
    [createPartner.rejected]: (state) => { state.loading = false; },

    [updatePartner.pending]: (state) => { state.loading = true; },
    [updatePartner.fulfilled]: (state) => { state.loading = false; },
    [updatePartner.rejected]: (state) => { state.loading = false; },

    [getDetailPartner.pending]: (state) => { state.loading = true; },
    [getDetailPartner.fulfilled]: (state, action) => { state.data_detail = action.payload; state.loading = false; },
    [getDetailPartner.rejected]: (state) => { state.loading = false; },

    [getAllApprovalList.pending]: (state) => { state.loading = true; },
    [getAllApprovalList.fulfilled]: (state, action) => { state.dataListAppHierId = action.payload; state.loading = false; },
    [getAllApprovalList.rejected]: (state) => { state.loading = false; },

    [getListApprovalById.pending]: (state) => { state.loading = true; },
    [getListApprovalById.fulfilled]: (state, action) => { state.dataListAppHierDetail = action.payload; state.loading = false; },
    [getListApprovalById.rejected]: (state) => { state.loading = false; },

    [getApprovalHistory.pending]: (state) => { state.loading = true; state.dataApprovalHistory = null; },
    [getApprovalHistory.fulfilled]: (state, action) => { state.dataApprovalHistory = action.payload; state.loading = false; },
    [getApprovalHistory.rejected]: (state) => { state.loading = false; },

    [getDownloadPartner.fulfilled]: (state) => { state.loading = false; },
    [getDownloadPartner.rejected]: (state) => { state.loading = false; },

    [approveOrRejectPartner.pending]: (state) => { state.loading = true; },
    [approveOrRejectPartner.fulfilled]: (state) => { state.loading = false; },
    [approveOrRejectPartner.rejected]: (state) => { state.loading = false; },

    [inactivePartnerCa.pending]: (state) => { state.loading = true; },
    [inactivePartnerCa.fulfilled]: (state) => { state.loading = false; },
    [inactivePartnerCa.rejected]: (state) => { state.loading = false; },

    [approveOrRejectInactivePartnerCa.pending]: (state) => { state.loading = true; },
    [approveOrRejectInactivePartnerCa.fulfilled]: (state) => { state.loading = false; },
    [approveOrRejectInactivePartnerCa.rejected]: (state) => { state.loading = false; },

    [saveDraftPartnerCa.pending]: (state) => { state.loading = true; },
    [saveDraftPartnerCa.fulfilled]: (state) => { state.loading = false; },
    [saveDraftPartnerCa.rejected]: (state) => { state.loading = false; },

    [getPartnerList.pending]: (state) => { state.loading = true; },
    [getPartnerList.fulfilled]: (state, action) => { state.dataPartner = action.payload; state.loading = false; },
    [getPartnerList.rejected]: (state) => { state.loading = false; },

    [getCollectionAgentList.pending]: (state) => { state.loading = true; },
    [getCollectionAgentList.fulfilled]: (state, action) => { state.dataCollectionAgent = action.payload; state.loading = false; },
    [getCollectionAgentList.rejected]: (state) => { state.loading = false; },

    [getBankListDDL.pending]: (state) => { state.loading = true; },
    [getBankListDDL.fulfilled]: (state, action) => { state.dataBankList = action.payload; state.loading = false; },
    [getBankListDDL.rejected]: (state) => { state.loading = false; },

    [getListCategory.pending]: (state) => { state.dataListCategory = null; },
    [getListCategory.fulfilled]: (state, action) => { state.dataListCategory = action.payload; },
    [getListCategory.rejected]: (state) => { state.dataListCategory = null; },
  },
});

const { reducer } = partnerCaSlice;
export default reducer;
