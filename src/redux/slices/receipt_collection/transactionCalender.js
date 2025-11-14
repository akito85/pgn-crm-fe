import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../general_slice";

const initialState = {
  loading: false,
  data: [],
  data_detail: null,
  data_select_criteria: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataListCategory: [],
  dataApprovalHistory: [],
  data_period: [],
  data_time_unit: [],
  dataEndBegin: [],
  data_detail_draft: [],
};

export const getPaginateCycle = createAsyncThunk(
  "GET_ALL_TRANSACTION",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/calendar/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "GET_ALL_TRANSACTION_CALENDAR",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const createValidasiTransCal = createAsyncThunk(
  "CREATE_MASTER_TRANSACTION_CALENDAR_VALIDASI",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/calendar/validate-create-update`;
      const data = await receiptCollectionHttpService.createData(url, body);
      return data?.data;
    } catch (error) {
      const message =
        (error?.response &&
          error?.response?.data &&
          error?.response?.data?.message) ||
        error?.message ||
        error?.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
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

export const getTimeUnit = createAsyncThunk(
  "GET_DATA_TIME_UNIT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/timeunit/get`;
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

export const getListCriteria = createAsyncThunk(
  "GET_LIST_CRITERIA",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/bank/account-criteria-list/get";
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

export const inactiveTransaction = createAsyncThunk(
  "INACTIVE_TRANSACTIOB_CALENDER",
  async (data, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/calendar/active-inactive`;
      const response = await receiptCollectionHttpService.inactiveWithApproval(
        url,
        data
      );
      const successBody = {
        title: "Successful",
        description: "Your data has been submitted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
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
          description: `Your data was not inactivated. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const openCloseTransCalender = createAsyncThunk(
  "OPEN_CLOSE_TRANSACTION_CALENDER",
  async ({ id, remark, status }, thunkAPI) => {
    try {
      let reqBody = {
        id: id,
        remark: remark,
        status: status,
      };
      const url = `/v1/dbs/api/transactionperiod/open-close`;
      const response =
        await receiptCollectionHttpService.activationWithRemarkPost(
          url,
          reqBody
        );
      const successBody = {
        title: "Successful",
        description: `Transaction Period is ${
          reqBody?.status === "open" ? "Open" : "Close"
        }`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
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
          description: `Your data was not ${message} Please try again.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllBeginEnd = createAsyncThunk(
  "GET_ALL_BEGINANDEND_CYCLE_CALENDER",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/calendar/begin-end-cycle-list`;
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

export const getAllApprovalList = createAsyncThunk(
  "GET_ALL_APPROVAL_LIST_CALENDER",
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
  "GET_LIST_APPROVAL_BY_ID_CALENDER",
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

export const getDetailTransaction = createAsyncThunk(
  "GET_DETAIL_TRANSACTION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/calendar/detail-get/${id}`;
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

export const getDetailTransactionDraft = createAsyncThunk(
  "GET_DETAIL_TRANSACTION_DRAFT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/calendar/draft/detail-get/${id}`;
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
  }
);

export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY_TRANSACTION",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/attachment/list-category";
      const response = await receiptCollectionHttpService.getAll(url);
      const mappCategory = response.data?.data?.map((item) => ({
        Id: item.glbTypeValId,
        text: item?.name,
      }));
      return mappCategory;
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
  "GET_APPROVAL_HISTORY_CALENDAR",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/calendar/approval-history-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_APPROVAL_HISTORY_CALENDAR",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getTransPeriod = createAsyncThunk(
  "GET_TRANSACTION_PERIOD",
  async ({ id, search, page, pageSize, sort }) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~asc" : sort;
      const url = `/v1/dbs/api/transactionperiod/get-list/${id}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

export const updatePeriod = createAsyncThunk(
  "UPDATE_EMPLOYEE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/transactionperiod/update`;
      const data = await receiptCollectionHttpService.updateDataTransaction(
        url,
        body
      );
      const successBody = {
        title: "Successfull",
        description: `Your data has been updated`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return data;
    } catch (error) {
      console.log(error);
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

export const createTransPeriod = createAsyncThunk(
  "CREATE_TRANS_PERIOD",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/transactionperiod/create`;
      const data = await receiptCollectionHttpService.createData(url, body);
      const successBody = {
        title: "Successfull",
        description: `Your data has been created`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return data;
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

export const createTransactionCalender = createAsyncThunk(
  "CREATE_TRANS_CALENDER",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/calendar/create-update`;
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

export const approveOrRejectInactiveTrans = createAsyncThunk(
  "APPROVE_OR_REJECT_TRANSCALENDER_DETAIL",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/calendar/approve-transaction-calendar";
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

export const approveOrRejectInactiveTransInactive = createAsyncThunk(
  "APPROVE_OR_REJECT_TRANS_CALENDER_DETAIL",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/calendar/approve-inactive";
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

// export const getApprovalHistory = createAsyncThunk(
//   "GET_APPROVAL_HISTORY_TRANSACTION",
//   async (id, thunkAPI) => {
//     try {
//       const url = `/v1/dbs/api/maintain-pricing/approvalhistory/${id}`;
//       const response = await productPromoHttpService.getDetail(url);
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error?.response);
//     }
//   }
// );

export const getDownloadTrans = createAsyncThunk(
  "DOWNLOAD_TRANSACTION_CALENDER",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/calendar/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_ACTION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response);
    }
  }
);

const cycleSlice = createSlice({
  name: "cycle",
  initialState,
  extraReducers: {
    //get all employee paginate reducer
    [getPaginateCycle.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [getPaginateCycle.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getPaginateCycle.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    //criteria
    [getListCriteria.pending]: (state, action) => {
      state.data_select_criteria = action.payload;
      state.loading = true;
    },
    [getListCriteria.fulfilled]: (state, action) => {
      state.data_select_criteria = action.payload;
      state.loading = false;
    },
    [getListCriteria.rejected]: (state, action) => {
      state.data_select_criteria = action.payload;
      state.loading = true;
    },

    // get detail
    [getDetailTransaction.pending]: (state) => {
      state.loading = true;
    },
    [getDetailTransaction.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailTransaction.rejected]: (state) => {
      state.loading = true;
    },

    // get detail draft
    [getDetailTransactionDraft.pending]: (state) => {
      state.loading = true;
    },
    [getDetailTransactionDraft.fulfilled]: (state, action) => {
      state.data_detail_draft = action.payload;
      state.loading = false;
    },
    [getDetailTransactionDraft.rejected]: (state) => {
      state.loading = true;
    },
    // inactive app
    [inactiveTransaction.pending]: (state) => {
      state.loading = true;
    },
    [inactiveTransaction.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveTransaction.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },

    // open close
    [openCloseTransCalender.pending]: (state) => {
      state.loading = true;
    },
    [openCloseTransCalender.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [openCloseTransCalender.rejected]: (state) => {
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
    // Get List endcycle
    [getAllBeginEnd.pending]: (state, action) => {
      state.loading = true;
      state.dataEndBegin = action.payload;
    },
    [getAllBeginEnd.fulfilled]: (state, action) => {
      state.dataEndBegin = action.payload;
      state.loading = false;
    },
    [getAllBeginEnd.rejected]: (state, action) => {
      state.dataEndBegin = action.payload;
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
      state.loading = true;
    },
    [getListCategory.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },
    [getListCategory.rejected]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },
    /** Get Approval History */
    [getApprovalHistory.pending]: (state, action) => {
      state.loading = true;
      state.dataApprovalHistory = action.payload;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loading = false;
    },
    [getApprovalHistory.rejected]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loading = false;
    },

    [approveOrRejectInactiveTrans.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectInactiveTrans.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveOrRejectInactiveTrans.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    [approveOrRejectInactiveTransInactive.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectInactiveTransInactive.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveOrRejectInactiveTransInactive.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    // create trans period
    [createTransPeriod.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createTransPeriod.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createTransPeriod.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    //download
    [getDownloadTrans.fulfilled]: (state, action) => {
      state.data_download = action.payload;
      // state.isSuccess = true;
      state.loading = false;
    },
    [getDownloadTrans.rejected]: (state, action) => {
      state.isFailed = true;
      state.data_download = action.payload;
      state.loading = false;
    },

    //get trans period
    [getTransPeriod.pending]: (state, action) => {
      state.data_period = action.payload;
      state.loading = true;
    },
    [getTransPeriod.fulfilled]: (state, action) => {
      state.data_period = action.payload;
      state.loading = false;
    },
    [getTransPeriod.rejected]: (state, action) => {
      state.data_period = action.payload;
      state.loading = true;
    },

    // update
    [updatePeriod.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [updatePeriod.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isSuccess = false;
    },
    [updatePeriod.rejected]: (state) => {
      state.isFailed = false;
    },

    // create trans calender
    [createTransactionCalender.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createTransactionCalender.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createTransactionCalender.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    // get time unit
    [getTimeUnit.pending]: (state, action) => {
      state.data_time_unit = action.payload;
      state.loading = true;
    },
    [getTimeUnit.fulfilled]: (state, action) => {
      state.data_time_unit = action.payload;
      state.loading = false;
    },
    [getTimeUnit.rejected]: (state, action) => {
      state.data_time_unit = action.payload;
      state.loading = false;
    },

    //validasi create transcal
    [createValidasiTransCal.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createValidasiTransCal.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createValidasiTransCal.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = cycleSlice;
export default reducer;
