import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../../services/ratingBillingHttpService";
import thunk from "redux-thunk";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../../general_slice";

const initialState = {
  loading: false,
  message: "",
  data: [],
  data_list_billing_cycle: [],
  list_time_unit: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  list_attachment: [],
  dataListCategory: [],
  dataInfoDetail: [],
  dataInfoDetailDraft: [],
  dataBillingCyclePeriod: [],
  dataApprovalHistory: [],
  dataApproveReject: [],
  dataForm: [],
  data_detail: [],
  dataHistory: [],
};

export const getBillingCycleList = createAsyncThunk(
  "GET_BILLING_CYCLE_LIST",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort || "createdDate~desc";
      const url = `/v1/dbs/api/billingcycle/get-list?size=${pageSize}&page=${page}&searchs=${searchParams}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getTimeUnit = createAsyncThunk(
  "GET_TIME_UNIT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingcycle/timeunit-get`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const downloadBillingCycle = createAsyncThunk(
  "DOWNLOAD_BILLING_CYCLE_TEMPLATE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billingcycle/download-filter?page=${page}&size=${pageSize}&search=${searchParams}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_BILLING_CYCLE_TEMPLATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getApprovalHierarchy = createAsyncThunk(
  "GET_APPROVAL_HIERARCHY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingcycle/approval-hierarchies-get`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getDetailApproval = createAsyncThunk(
  "GET_DETAIL_APPROVAL",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingcycle/approval-hierarchies-detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingcycle/approval-history-get/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getListAttachment = createAsyncThunk(
  "GET_LIST_ATTACHMENT",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingcycle/attachment-list/1?page=${page}&size=${pageSize}&search=${search}&sort=${sort}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const inactiveBillingCycle = createAsyncThunk(
  "INACTIVE_BILLING_CYCLE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingcycle/inactive`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
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
          description: `Your data was not submitted. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getListCategoryFile = createAsyncThunk(
  "GET_LIST_CATEGORY_FILE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingcycle/category-attachment-get";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.map((item) => ({
        Id: item.id,
        text: item.text,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getInfoDetail = createAsyncThunk(
  "GET_INFO_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingcycle/detail-get/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getInfoDetailDraft = createAsyncThunk(
  "GET_INFO_DETAIL_DRAFT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingcycle/draft/detail-get/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getBillingPeriodList = createAsyncThunk(
  "GET_BILLING_PERIOD_LIST",
  async ({ id, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort || "createdDate~desc";
      const url = `/v1/dbs/api/billingperiod/get-list/${id}?size=${pageSize}&page=${page}&searchs=${searchParams}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const approveRejectBillingCycle = createAsyncThunk(
  "APPROVE_OR_REJECT_BILLING_CYCLE",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingcycle/approve";
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
      );
      const successApprove = {
        title: `Successful`,
        description: `Your data has been ${
          body.action === "APPROVE" ? "Approved" : "Rejected"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successApprove));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${
              body.action === "APPROVE" ? "Approved" : "Rejected"
            }. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  },
);

export const createBillingCycle = createAsyncThunk(
  "CREATE_BILLING_CYCLE",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingcycle/create";
      const response = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.isSubmit === false ? "created" : "submitted"
        }.`,
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
          description: `Your data was not ${
            body.isSubmit === false ? "created" : "submitted"
          }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const updateBillingCycle = createAsyncThunk(
  "UPDATE_BILLING_CYCLE",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingcycle/update";
      const response = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.isSubmit === false ? "updated" : "submitted"
        }.`,
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
          description: `Your data was not ${
            body.isSubmit === false ? "created" : "submitted"
          }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const approveOrRejectInactiveBillingCycle = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_BILLING_CYCLE",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingcycle/approve-inactive";
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
      );
      const successApprove = {
        title: `Successful`,
        description: `Your data has been ${
          body.action === "APPROVE" ? "Approved" : "Rejected"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successApprove));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(
            validateError({
              error,
              action: "APPROVE_OR_REJECT_INACTIVE_BILLING_CYCLE",
            }),
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${
              body.action === "APPROVE" ? "Approved" : "Rejected"
            }. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const updatePeriodInformation = createAsyncThunk(
  "UPDATE_PERIOD_INFORMATION",
  async ({ body, api }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingperiod/update`;
      const data = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: "Successfull",
        description: `Your data has been updated`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return data;
    } catch (error) {
      // console.log(error);
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
        return: false,
        index: 1,
        api: api,
        loadPage: true,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunk.rejectWithValue(error.response.data);
    }
  },
);

export const createPeriodInformation = createAsyncThunk(
  "CREATE_PERIOD_INFORMATION",
  async ({ body, api }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingperiod/create`;
      const data = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: "Successful",
        description: `Your data has been created`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return data.data;
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
        description: `Your data was not created. ${message}. Please try again.`,
        return: false,
        index: 1,
        api: api,
        loadPage: true,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunk.rejectWithValue(error);
    }
  },
);

export const getDetailPeriod = createAsyncThunk(
  "GET_DETAIL_TRANSACTION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingperiod/detail-get/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getHistoryPeriod = createAsyncThunk(
  "GET_HISTORY_PERIOD",
  async ({ id, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort || "createdDate~desc";
      const url = `/v1/dbs/api/billingperiod/history-list/${id}?size=${pageSize}&page=${page}&searchs=${searchParams}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const openClosePeriodBilling = createAsyncThunk(
  "OPEN_CLOSE_PERIOD_BILLING",
  async ({ id, remark, isOpen }, thunkAPI) => {
    try {
      let reqBody = {
        id: id,
        remark: remark,
        isOpen: isOpen,
      };
      const url = `/v1/dbs/api/billingperiod/open-close`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        reqBody,
      );
      const message = isOpen ? "opened" : "closed";
      const successBody = {
        title: "Successful",
        description: `Your data has been ${message}`,
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
  },
);

const billingCycleSlice = createSlice({
  name: "billingCycle",
  initialState,
  extraReducers: {
    // getBillingCycleList
    [getBillingCycleList.pending]: (state) => {
      state.loading = true;
    },
    [getBillingCycleList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_list_billing_cycle = action.payload;
    },
    [getBillingCycleList.rejected]: (state) => {
      state.loading = false;
    },

    // getTimeUnit
    [getTimeUnit.pending]: (state) => {
      state.loading = true;
    },
    [getTimeUnit.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_time_unit = action.payload;
    },
    [getTimeUnit.rejected]: (state) => {
      state.loading = false;
    },

    // getApprovalHierarchy
    [getApprovalHierarchy.pending]: (state) => {
      state.loading = true;
    },
    [getApprovalHierarchy.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListAppHierId = action.payload;
    },
    [getApprovalHierarchy.rejected]: (state) => {
      state.loading = false;
    },

    // getDetailApproval
    [getDetailApproval.pending]: (state) => {
      state.loading = true;
    },
    [getDetailApproval.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListAppHierDetail = action.payload;
    },
    [getDetailApproval.rejected]: (state) => {
      state.loading = false;
    },

    // downloadBillingCycle
    [downloadBillingCycle.pending]: (state) => {
      state.loading = true;
    },
    [downloadBillingCycle.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadBillingCycle.rejected]: (state) => {
      state.loading = false;
    },

    // inactiveBillingCycle
    [inactiveBillingCycle.pending]: (state) => {
      state.loading = true;
    },
    [inactiveBillingCycle.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveBillingCycle.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    // getApprovalHistory
    [getApprovalHistory.pending]: (state) => {
      state.loading = true;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataApprovalHistory = action.payload;
    },
    [getApprovalHistory.rejected]: (state) => {
      state.dataInfoDetail = false;
    },

    // getListAttachment
    [getListAttachment.pending]: (state) => {
      state.loading = true;
    },
    [getListAttachment.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_attachment = action.payload;
    },
    [getListAttachment.rejected]: (state) => {
      state.loading = false;
    },

    // getListCategoryFile
    [getListCategoryFile.pending]: (state) => {
      state.loading = true;
    },
    [getListCategoryFile.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListCategory = action.payload;
    },
    [getListCategoryFile.rejected]: (state) => {
      state.loading = false;
    },

    // getInfoDetail
    [getInfoDetail.pending]: (state) => {
      state.loading = true;
    },
    [getInfoDetail.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataInfoDetail = action.payload;
    },
    [getInfoDetail.rejected]: (state) => {
      state.dataInfoDetail = false;
    },

    // getInfoDetailDraft
    [getInfoDetailDraft.pending]: (state) => {
      state.loading = true;
    },
    [getInfoDetailDraft.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataInfoDetailDraft = action.payload;
    },
    [getInfoDetailDraft.rejected]: (state) => {
      state.dataInfoDetail = false;
    },

    // getBillingPeriodList
    [getBillingPeriodList.pending]: (state) => {
      state.loading = true;
    },
    [getBillingPeriodList.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataBillingCyclePeriod = action.payload;
    },
    [getBillingPeriodList.rejected]: (state) => {
      state.dataInfoDetail = false;
    },
    [createBillingCycle.pending]: (state) => {
      state.loading = true;
    },
    [createBillingCycle.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataForm = action.payload;
    },
    [createBillingCycle.rejected]: (state) => {
      state.loading = false;
    },

    // update Billing Cycle
    [updateBillingCycle.pending]: (state) => {
      state.loading = true;
    },
    [updateBillingCycle.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataForm = action.payload;
    },
    [updateBillingCycle.rejected]: (state) => {
      state.loading = false;
    },

    // create Billing Period Information
    [createPeriodInformation.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createPeriodInformation.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isSuccess = false;
    },
    [createPeriodInformation.rejected]: (state) => {
      state.isFailed = false;
    },

    // update Billing Period Information
    [updatePeriodInformation.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [updatePeriodInformation.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isSuccess = false;
    },
    [updatePeriodInformation.rejected]: (state) => {
      state.isFailed = false;
    },

    //get detail period
    [getDetailPeriod.pending]: (state) => {
      state.loading = true;
    },
    [getDetailPeriod.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailPeriod.rejected]: (state) => {
      state.loading = true;
    },

    //history period information
    [getHistoryPeriod.pending]: (state) => {
      state.loading = true;
    },
    [getHistoryPeriod.fulfilled]: (state, action) => {
      state.dataHistory = action.payload;
      state.loading = false;
    },
    [getHistoryPeriod.rejected]: (state) => {
      state.loading = true;
    },

    // open close
    [openClosePeriodBilling.pending]: (state) => {
      state.loading = true;
    },
    [openClosePeriodBilling.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [openClosePeriodBilling.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },
  },
});

const { reducer } = billingCycleSlice;
export default reducer;
