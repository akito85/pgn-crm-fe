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
};

const BASE_URL = "/v1/dbs/api/rate-sources";

export const getPaginateRateSource = createAsyncThunk(
  "GET_ALL_RATE_SOURCE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `${BASE_URL}/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_RATE_SOURCE_PAGING",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getDownloadRateSource = createAsyncThunk(
  "DOWNLOAD_RATE_SOURCE",
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
        validateError({
          error: response,
          action: "DOWNLOAD_RATE_SOURCE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response);
    }
  }
);

export const createRateSource = createAsyncThunk(
  "CREATE_RATE_SOURCE",
  async (body, thunkAPI) => {
    try {
      const url = `${BASE_URL}/create-update`;
      const data = await receiptCollectionHttpService.createData(url, body);
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

export const updateRateSource = createAsyncThunk(
  "UPDATE_RATE_SOURCE",
  async (body, thunkAPI) => {
    try {
      const url = `${BASE_URL}/create-update`;
      const data = await receiptCollectionHttpService.updateDataPost(url, body);
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
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getDetailRateSource = createAsyncThunk(
  "GET_DETAIL_RATE_SOURCE",
  async (id, thunkAPI) => {
    try {
      const url = `${BASE_URL}/detail-get/${id}`;
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
  "GET_APPROVAL_HISTORY_RATE_SOURCE",
  async (id, thunkAPI) => {
    try {
      const url = `${BASE_URL}/approval-history-get/${id}`;
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

export const approveOrRejectRateSource = createAsyncThunk(
  "APPROVE_OR_REJECT_RATE_SOURCE",
  async ({ body }, thunkAPI) => {
    try {
      const url = `${BASE_URL}/approve-reject`;
      const response =
        await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      const message = response?.message;
      const successMessage = {
        title: "Successfull",
        description: `${message}`,
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

export const approveOrRejectInactiveRateSource = createAsyncThunk(
  "APPROVE_OR_REJECT_FOR_INACTIVE_RATE_SOURCE",
  async ({ body }, thunkAPI) => {
    try {
      const url = `${BASE_URL}/approve-inactive`;
      const response =
        await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      const message = response?.message;
      const successMessage = {
        title: "Successfull",
        description: `${message}`,
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

export const getAllApprovalList = createAsyncThunk(
  "GET_ALL_APPROVAL_LIST_RATE_SOURCE",
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
  "GET_LIST_APPROVAL_BY_ID_RATE_SOURCE",
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

export const activeInactiveRateSource = createAsyncThunk(
  "INACTIVE_RATE_SOURCE",
  async ({ body }, thunkAPI) => {
    let status = body?.status === "Active" ? "Inactivate" : "Activate";
    try {
      const url = `${BASE_URL}/active-inactive`;
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
          action: "INACTIVE_RATE_SOURCE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const saveDraftRateSource = createAsyncThunk(
  "SAVE_DRAFT_RATE_SOURCE",
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

export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY_RATE_SOURCE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/attachment/list-category`;
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


const rateSourceSlice = createSlice({
  name: "rateSource",
  initialState,
  extraReducers: {
    [getPaginateRateSource.pending]: (state) => {
      state.loading = true;
    },
    [getPaginateRateSource.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getPaginateRateSource.rejected]: (state) => {
      state.loading = false;
    },

    [getApprovalHistory.pending]: (state) => {
      state.loading = true;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loading = false;
    },
    [getApprovalHistory.rejected]: (state) => {
      state.loading = false;
    },

    [getDetailRateSource.pending]: (state) => {
      state.loading = true;
    },
    [getDetailRateSource.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailRateSource.rejected]: (state) => {
      state.loading = false;
    },

    [getAllApprovalList.pending]: (state) => {
      state.loading = true;
    },
    [getAllApprovalList.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    [getAllApprovalList.rejected]: (state) => {
      state.loading = false;
    },

    [getListApprovalById.pending]: (state) => {
      state.loading = true;
    },
    [getListApprovalById.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },
    [getListApprovalById.rejected]: (state) => {
      state.loading = false;
    },

    [createRateSource.pending]: (state) => {
      state.loading = true;
    },
    [createRateSource.fulfilled]: (state) => {
      state.loading = false;
    },
    [createRateSource.rejected]: (state) => {
      state.loading = false;
    },

    [updateRateSource.pending]: (state) => {
      state.loading = true;
    },
    [updateRateSource.fulfilled]: (state) => {
      state.loading = false;
    },
    [updateRateSource.rejected]: (state) => {
      state.loading = false;
    },

    [saveDraftRateSource.pending]: (state) => {
      state.loading = true;
    },
    [saveDraftRateSource.fulfilled]: (state) => {
      state.loading = false;
    },
    [saveDraftRateSource.rejected]: (state) => {
      state.loading = false;
    },

    [activeInactiveRateSource.pending]: (state) => {
      state.loading = true;
    },
    [activeInactiveRateSource.fulfilled]: (state) => {
      state.loading = false;
    },
    [activeInactiveRateSource.rejected]: (state) => {
      state.loading = false;
    },

    [getDownloadRateSource.fulfilled]: (state, action) => {
      state.data_download = action.payload;
      state.loading = false;
    },
    [getDownloadRateSource.rejected]: (state) => {
      state.loading = false;
    },

    [approveOrRejectInactiveRateSource.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectInactiveRateSource.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectInactiveRateSource.rejected]: (state) => {
      state.loading = false;
    },

    [getListCategory.pending]: (state) => {
      state.loading = true;
    },
    [getListCategory.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },
    [getListCategory.rejected]: (state) => {
      state.loading = false;
    },
  },
});

const { reducer } = rateSourceSlice;
export default reducer;
