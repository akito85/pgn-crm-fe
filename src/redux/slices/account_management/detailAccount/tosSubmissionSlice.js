import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showModalError, showModalSuccess } from "../../general_slice";
import accountManagementService from "../../../services/account_management/accountManagementService";

const initialState = {
  data: {},
  dataDetail: {},
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataListAppHierIdForm: [],
  dataListAppHierDetailForm: [],
  dataListCategory: [],
  dataSelect: {},
  dataStatus: {},
  dataApprovalHistory: {},
  loading: false,
  message: "",
};

/**Get list tos submission Paginate*/
export const getListTosSubmissionPaging = createAsyncThunk(
  "GET_LIST_TOS_SUBMISSION",
  async ({ id, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "createdDate~desc";
      const url = `/v1/dbs/api/tossubmission/list-tos-submission/${id}?page=${page}&size=${pageSize}&searchs=${searchParams}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getListAppHier = createAsyncThunk(
  "GET_LIST_APP_HIER_TOS_SUBMISSION",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tossubmission/get-list-approval-hierarchies";
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getListAppHierInactive = createAsyncThunk(
  "GET_LIST_APP_HIER_INACTIVE_TOS_SUBMISSION",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tossubmission/get-list-approval-hierarchies";
      const response = await accountManagementService.getAll(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getListAppHierDetail = createAsyncThunk(
  "GET_LIST_APP_HIER_DETAIL_TOS_SUBMISSION",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tossubmission/get-approval-hierarchies/${id}`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, indexDetail) => ({
          ...b,
          key: indexDetail + 1,
        })),
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getListAppHierDetailInactive = createAsyncThunk(
  "GET_LIST_APP_HIER_DETAIL_INACTIVE_TOS_SUBMISSION",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tossubmission/get-approval-hierarchies/${id}`;
      const response = await accountManagementService.getAll(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY_TOS_SUBMISSION",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tossubmission/list-category";
      const response = await accountManagementService.getAll(url);
      return response.data.map((category) => ({
        glbTypeValId: category?.id,
        name: category?.text,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const inactiveTosSubmission = createAsyncThunk(
  "INACTIVE_TOS_SUBMISSION",
  async ({ data }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tossubmission/inactivate`;
      const response = await accountManagementService.activationWithRemark(
        url,
        data,
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
        error?.response?.data?.message || error.message || error.toString();
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

export const deleteDraftTosSubmission = createAsyncThunk(
  "DELETE_DRAFT_TOS_SUBMISSION",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tossubmission/delete-tos-submission/${id}`;
      const response = await accountManagementService.deleteData(url);
      const successBody = {
        title: "Successful",
        description: "Your data has been deleted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not deleted. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

/**Get list select tos submission Paginate*/
export const getListSelectTosSubmissionPaging = createAsyncThunk(
  "GET_LIST_SELECT_TOS_SUBMISSION",
  async ({ id, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "createdDate~desc";
      const url = `/v1/dbs/api/tossubmission/choose-tos-submission/${id}?page=${page}&size=${pageSize}&search=${searchParams}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getDetailTosSubmission = createAsyncThunk(
  "GET_DETAIL_TOS_SUBMISSION",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tossubmission/get-detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const createTosSubmissionBody = createAsyncThunk(
  "CREATE_TOS_SUBMISSION",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tossubmission/create";
      const response = await accountManagementService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body?.flag === 1 ? "created" : "submitted"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${
            body?.flag === 1 ? "created" : "submitted"
          }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const updateTosSubmissionBody = createAsyncThunk(
  "UPDATE_TOS_SUBMISSION",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tossubmission/update";
      const response = await accountManagementService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body?.flag === 1 ? " updated" : "submitted"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${
            body?.flag === 1 ? " updated" : "submitted"
          }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const approvalCreateTosSubmission = createAsyncThunk(
  "APPROVAL_CREATE_TOS_SUBMISSION",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tossubmission/approve-tos-submission`;
      const response = await accountManagementService.activationWithRemark(
        url,
        body,
      );
      const successBody = {
        title: "Successful",
        description: `Your data has been ${
          body.action === "APPROVE" ? "approved" : "rejected"
        }.`,
        alertDescription:
          body.action === "REJECT"
            ? "Warning! if you reject this data, you will need to request approval again."
            : undefined,
        width: body.action === "REJECT" ? 700 : 500,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
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

export const approvalInactiveTosSubmission = createAsyncThunk(
  "APPROVAL_INACTIVE_TOS_SUBMISSION",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tossubmission/approve-inactive-tos-submission`;
      const response = await accountManagementService.activationWithRemark(
        url,
        body,
      );
      const successBody = {
        title: "Successful",
        description: `Your data has been ${
          body.action === "APPROVE" ? "approved" : "rejected"
        }.`,
        alertDescription:
          body.action === "REJECT"
            ? "Warning! if you reject this data, you will need to request approval again."
            : undefined,
        width: body.action === "REJECT" ? 700 : 500,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
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

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_TOS_SUBMISSION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tossubmission/approval-history/${id}`;
      const response = await accountManagementService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const validateOverlapTos = createAsyncThunk(
  "VALIDATE_OVERLAP_TOS_SUBMISSION",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tossubmission/date-validation`;
      const response = await accountManagementService.createData(url, body);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

const tosSubmissionSlice = createSlice({
  name: "tosSubmission",
  initialState,
  extraReducers: {
    // Get List Tos Submission
    [getListTosSubmissionPaging.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [getListTosSubmissionPaging.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getListTosSubmissionPaging.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    /** Get List AppHierId */
    [getListAppHier.pending]: (state, action) => {
      state.dataListAppHierIdForm = action.payload;
      state.loading = true;
    },
    [getListAppHier.fulfilled]: (state, action) => {
      state.dataListAppHierIdForm = action.payload;
      state.loading = false;
    },
    [getListAppHier.rejected]: (state, action) => {
      state.dataListAppHierIdForm = action.payload;
      state.loading = false;
    },
    /** Get List AppHierDetail */
    [getListAppHierDetail.pending]: (state, action) => {
      state.dataListAppHierDetailForm = action.payload;
      state.loading = true;
    },
    [getListAppHierDetail.fulfilled]: (state, action) => {
      state.dataListAppHierDetailForm = action.payload;
      state.loading = false;
    },
    [getListAppHierDetail.rejected]: (state, action) => {
      state.dataListAppHierDetailForm = action.payload;
      state.loading = false;
    },
    /** Get List AppHierId Inactive */
    [getListAppHierInactive.pending]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = true;
    },
    [getListAppHierInactive.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    [getListAppHierInactive.rejected]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    /** Get List AppHierDetail */
    [getListAppHierDetailInactive.pending]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = true;
    },
    [getListAppHierDetailInactive.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },
    /** Get List Category */
    [getListCategory.pending]: (state, action) => {
      state.loading = true;
      state.dataListCategory = action.payload;
    },
    [getListCategory.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },
    [getListCategory.rejected]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },
    /** Inactive Tos Submission */
    [inactiveTosSubmission.pending]: (state) => {
      state.loading = true;
    },
    [inactiveTosSubmission.fulfilled]: (state) => {
      state.loading = false;
    },
    [inactiveTosSubmission.rejected]: (state) => {
      state.loading = false;
    },
    /** Delete Draft Tos Submission */
    [deleteDraftTosSubmission.pending]: (state) => {
      state.loading = true;
    },
    [deleteDraftTosSubmission.fulfilled]: (state) => {
      state.loading = false;
    },
    [deleteDraftTosSubmission.rejected]: (state) => {
      state.loading = false;
    },
    // Get List Select Tos Submission
    [getListSelectTosSubmissionPaging.pending]: (state, action) => {
      state.loading = true;
      state.dataSelect = action.payload;
    },
    [getListSelectTosSubmissionPaging.fulfilled]: (state, action) => {
      state.dataSelect = action.payload;
      state.loading = false;
    },
    [getListSelectTosSubmissionPaging.rejected]: (state, action) => {
      state.dataSelect = action.payload;
      state.loading = false;
    },
    // Get Detail Tos SUbmission
    [getDetailTosSubmission.pending]: (state, action) => {
      state.loading = true;
      state.dataDetail = action.payload;
    },
    [getDetailTosSubmission.fulfilled]: (state, action) => {
      state.dataDetail = action.payload;
      state.loading = false;
    },
    [getDetailTosSubmission.rejected]: (state, action) => {
      state.dataDetail = action.payload;
      state.loading = false;
    },
    /** Create TOS Submission */
    [createTosSubmissionBody.pending]: (state, action) => {
      state.loading = true;
      state.dataStatus = action.payload;
    },
    [createTosSubmissionBody.fulfilled]: (state, action) => {
      state.dataStatus = action.payload;
      state.loading = false;
    },
    [createTosSubmissionBody.rejected]: (state, action) => {
      state.dataStatus = action.payload;
      state.loading = false;
    },
    /** Update TOS Submission */
    [updateTosSubmissionBody.pending]: (state, action) => {
      state.loading = true;
      state.dataStatus = action.payload;
    },
    [updateTosSubmissionBody.fulfilled]: (state, action) => {
      state.dataStatus = action.payload;
      state.loading = false;
    },
    [updateTosSubmissionBody.rejected]: (state, action) => {
      state.dataStatus = action.payload;
      state.loading = false;
    },
    /** Approve/Reject Create Tos Submission */
    [approvalCreateTosSubmission.pending]: (state) => {
      state.loading = true;
    },
    [approvalCreateTosSubmission.fulfilled]: (state) => {
      state.loading = false;
    },
    [approvalCreateTosSubmission.rejected]: (state) => {
      state.loading = false;
    },
    /** Approve/Reject Inactive Tos Submission */
    [approvalInactiveTosSubmission.pending]: (state) => {
      state.loading = true;
    },
    [approvalInactiveTosSubmission.fulfilled]: (state) => {
      state.loading = false;
    },
    [approvalInactiveTosSubmission.rejected]: (state) => {
      state.loading = false;
    },
    /** Get Approval History */
    [getApprovalHistory.pending]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loading = true;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loading = false;
    },
    [getApprovalHistory.rejected]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loading = false;
    },
    /** Overlap validate TOS */
    [validateOverlapTos.pending]: (state) => {
      state.loading = true;
    },
    [validateOverlapTos.fulfilled]: (state) => {
      state.loading = false;
    },
    [validateOverlapTos.rejected]: (state) => {
      state.loading = false;
    },
  },
});

const { reducer } = tosSubmissionSlice;
export default reducer;
