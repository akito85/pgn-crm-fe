import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import debtAndCollectionHttpService from "../../../services/debtAndCollectionHttpService";
import { showModalSuccess, validateError } from "../../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../../utils";

const initialState = {
  data: [],
  pagination: {},
  data_detail: {},
  dataApprovalHistory: {},
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  data_activities: [],
  dataListCategory: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
};

export const getListCollectionTemplate = createAsyncThunk(
  "LIST_COLLECTION_TEMPLATE",
  async ({ search, page, size, sort, isLoadMore }, thunkAPI) => {
    try {
      const sortArray = Array.isArray(sort) ? sort : [];

      const searchParams =
        search && typeof search === "object" && Object.keys(search).length > 0
          ? JSON.stringify(search)
          : "";

      const sortParams =
        sortArray.length > 0 ? sortArray.join("&sort=") : "createdDate~desc";

      const url = `/v1/dbs/api/collection-management/collection-templates?${searchParams ? `searchs=${encodeURIComponent(searchParams)}&` : ""}page=${page}&size=${size}&sort=${sortParams}`;
      const response = await debtAndCollectionHttpService.getPagination(url);
      return { ...response.data, isLoadMore };
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "LIST_COLLECTION_TEMPLATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getDownloadCollectionTemplate = createAsyncThunk(
  "DOWNLOAD_COLLECTION_TEMPLATE",
  async ({ sort, page, size, search }, thunkAPI) => {
    try {
      const sortArray = Array.isArray(sort) ? sort : [];

      const searchParams =
        search && typeof search === "object" && Object.keys(search).length > 0
          ? JSON.stringify(search)
          : "";

      const sortParams =
        sortArray.length > 0 ? sortArray.join("&sort=") : "createdDate~desc";

      const url = `/v1/dbs/api/collection-management/collection-templates/download-list?${searchParams ? `searchs=${encodeURIComponent(searchParams)}&` : ""}page=${page}&size=${size}&sort=${sortParams}`;
      await debtAndCollectionHttpService.downloadData(url);
      return true;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_COLLECTION_TEMPLATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_COLLECTION_TEMPLATE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-management/collection-templates/${id}/approval-history`;
      const response = await debtAndCollectionHttpService.getDetail(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "GET_APPROVAL_HISTORY_COLLECTION_TEMPLATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getAvailableApproval = createAsyncThunk(
  "GET_AVAILABLE_APPROVAL_COLLECTION_TEMPLATE",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-management/collection-templates/approval-hierarchies`;
      const response = await debtAndCollectionHttpService.getAll(url);
      return response.data;
    } catch (response) {
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getSelectedApproval = createAsyncThunk(
  "GET_SELECTED_APPROVAL_COLLECTION_TEMPLATE",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-management/collection-templates/approval-hierarchies/${id}`;
      const response = await debtAndCollectionHttpService.getDetail(url);
      return response.data;
    } catch (response) {
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const requestInactiveCollectionTemplate = createAsyncThunk(
  "REQUEST_INACTIVE_COLLECTION_TEMPLATE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-management/collection-templates/request-inactive`;
      const response = await debtAndCollectionHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Inactive request has been submitted",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "submitted",
            errorMessage(response),
          ),
          action: "REQUEST_INACTIVE_COLLECTION_TEMPLATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const requestActivateCollectionTemplate = createAsyncThunk(
  "REQUEST_ACTIVATE_COLLECTION_TEMPLATE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-management/collection-templates/activate`;
      const response = await debtAndCollectionHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Activate request has been submitted",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "activated",
            errorMessage(response),
          ),
          action: "REQUEST_ACTIVATE_COLLECTION_TEMPLATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const approveCollectionTemplate = createAsyncThunk(
  "APPROVE_COLLECTION_TEMPLATE",
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-management/collection-templates/${id}/approval/approve`;
      const response = await debtAndCollectionHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Template has been approved",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "approved",
            errorMessage(response),
          ),
          action: "APPROVE_COLLECTION_TEMPLATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const rejectCollectionTemplate = createAsyncThunk(
  "REJECT_COLLECTION_TEMPLATE",
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-management/collection-templates/${id}/approval/reject`;
      const response = await debtAndCollectionHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Template has been rejected",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "rejected",
            errorMessage(response),
          ),
          action: "REJECT_COLLECTION_TEMPLATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const approveInactiveCollectionTemplate = createAsyncThunk(
  "APPROVE_INACTIVE_COLLECTION_TEMPLATE",
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-management/collection-templates/${id}/approval-inactive`;
      const response = await debtAndCollectionHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description:
          body.action === "APPROVE"
            ? "Inactive request has been approved"
            : "Inactive request has been rejected",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "approve/reject inactive",
            errorMessage(response),
          ),
          action: "APPROVE_INACTIVE_COLLECTION_TEMPLATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const approveActivatedCollectionTemplate = createAsyncThunk(
  "APPROVE_ACTIVATED_COLLECTION_TEMPLATE",
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-management/collection-templates/${id}/approval-activated`;
      const response = await debtAndCollectionHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description:
          body.action === "APPROVE"
            ? "Activate request has been approved"
            : "Activate request has been rejected",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "approve/reject activate",
            errorMessage(response),
          ),
          action: "APPROVE_ACTIVATED_COLLECTION_TEMPLATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const bulkApproveRejectCollectionTemplate = createAsyncThunk(
  "BULK_APPROVE_REJECT_COLLECTION_TEMPLATE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-management/collection-templates/bulk-approval`;
      const response = await debtAndCollectionHttpService.createData(url, body);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "bulk approve/reject",
            errorMessage(response),
          ),
          action: "BULK_APPROVE_REJECT_COLLECTION_TEMPLATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const createCollectionTemplate = createAsyncThunk(
  "CREATE_COLLECTION_TEMPLATE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-management/collection-templates`;
      const response = await debtAndCollectionHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Collection template has been saved",
        return: true,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "saved",
            errorMessage(response),
          ),
          action: "CREATE_COLLECTION_TEMPLATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const updateCollectionTemplate = createAsyncThunk(
  "UPDATE_COLLECTION_TEMPLATE",
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-management/collection-templates/${id}`;
      const response = await debtAndCollectionHttpService.updateData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Collection template has been updated",
        return: true,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "updated",
            errorMessage(response),
          ),
          action: "UPDATE_COLLECTION_TEMPLATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const addActivityToTemplate = createAsyncThunk(
  "ADD_ACTIVITY_TO_TEMPLATE",
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-management/collection-templates/${id}/details/activity`;
      const response = await debtAndCollectionHttpService.createData(url, body);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "add activity",
            errorMessage(response),
          ),
          action: "ADD_ACTIVITY_TO_TEMPLATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const addCriteriaToTemplate = createAsyncThunk(
  "ADD_CRITERIA_TO_TEMPLATE",
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-management/collection-templates/${id}/details/criteria`;
      const response = await debtAndCollectionHttpService.createData(url, body);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "add criteria",
            errorMessage(response),
          ),
          action: "ADD_CRITERIA_TO_TEMPLATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getTemplateDetailApprovalInfo = createAsyncThunk(
  "GET_TEMPLATE_DETAIL_APPROVAL_INFO",
  async (detailId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-management/collection-templates/details/${detailId}/approval-detail`;
      const response = await debtAndCollectionHttpService.getDetail(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "get detail approval info",
            errorMessage(response),
          ),
          action: "GET_TEMPLATE_DETAIL_APPROVAL_INFO",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const approveTemplateDetail = createAsyncThunk(
  "APPROVE_TEMPLATE_DETAIL",
  async ({ detailId, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-management/collection-templates/details/${detailId}/approval/approve`;
      const response = await debtAndCollectionHttpService.createData(url, body);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "approve detail",
            errorMessage(response),
          ),
          action: "APPROVE_TEMPLATE_DETAIL",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const rejectTemplateDetail = createAsyncThunk(
  "REJECT_TEMPLATE_DETAIL",
  async ({ detailId, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-management/collection-templates/details/${detailId}/approval/reject`;
      const response = await debtAndCollectionHttpService.createData(url, body);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "reject detail",
            errorMessage(response),
          ),
          action: "REJECT_TEMPLATE_DETAIL",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getDetailCollectionTemplate = createAsyncThunk(
  "GET_DETAIL_COLLECTION_TEMPLATE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-management/collection-templates/${id}`;
      const response = await debtAndCollectionHttpService.getDetail(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "GET_DETAIL_COLLECTION_TEMPLATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getCollectionActivityList = createAsyncThunk(
  "GET_COLLECTION_ACTIVITY_LIST",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-management/collection-activities`;
      const response = await debtAndCollectionHttpService.getAll(url);
      return response.data;
    } catch (response) {
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  },
);

export const getCollectionTemplateAttachmentCategory = createAsyncThunk(
  "GET_ATTACHMENT_CATEGORY_COLLECTION_TEMPLATE",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-management/collection-templates/list-attachment-category`;
      const response = await debtAndCollectionHttpService.getAll(url);
      return (response.data || []).map((item) => ({
        Id: item.id,
        text: item.text,
      }));
    } catch (response) {
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  },
);

const collectionTemplateSlice = createSlice({
  name: "collectionTemplate",
  initialState,
  extraReducers: {
    [getListCollectionTemplate.pending]: (state) => {
      state.loading = true;
      state.isFailed = false;
      state.isSuccess = false;
    },
    [getListCollectionTemplate.fulfilled]: (state, action) => {
      const { isLoadMore, page, result, ...rest } = action.payload;
      if (isLoadMore) {
        state.data = [...(state.data || []), ...(result || [])];
      } else {
        state.data = result || [];
      }
      state.pagination = { page, ...rest };
      state.loading = false;
    },
    [getListCollectionTemplate.rejected]: (state) => {
      state.data = [];
      state.loading = false;
    },
    [getDownloadCollectionTemplate.pending]: (state) => {
      state.loading = true;
    },
    [getDownloadCollectionTemplate.fulfilled]: (state) => {
      state.loading = false;
    },
    [getDownloadCollectionTemplate.rejected]: (state) => {
      state.loading = false;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.dataApprovalHistory = action.payload;
    },
    [getAvailableApproval.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload;
    },
    [getSelectedApproval.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
    },
    [approveCollectionTemplate.pending]: (state) => {
      state.loading = true;
    },
    [approveCollectionTemplate.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveCollectionTemplate.rejected]: (state) => {
      state.loading = false;
    },
    [rejectCollectionTemplate.pending]: (state) => {
      state.loading = true;
    },
    [rejectCollectionTemplate.fulfilled]: (state) => {
      state.loading = false;
    },
    [rejectCollectionTemplate.rejected]: (state) => {
      state.loading = false;
    },
    [approveInactiveCollectionTemplate.pending]: (state) => {
      state.loading = true;
    },
    [approveInactiveCollectionTemplate.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveInactiveCollectionTemplate.rejected]: (state) => {
      state.loading = false;
    },
    [approveActivatedCollectionTemplate.pending]: (state) => {
      state.loading = true;
    },
    [approveActivatedCollectionTemplate.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveActivatedCollectionTemplate.rejected]: (state) => {
      state.loading = false;
    },
    [bulkApproveRejectCollectionTemplate.pending]: (state) => {
      state.loading = true;
    },
    [bulkApproveRejectCollectionTemplate.fulfilled]: (state) => {
      state.loading = false;
    },
    [bulkApproveRejectCollectionTemplate.rejected]: (state) => {
      state.loading = false;
    },
    [requestInactiveCollectionTemplate.pending]: (state) => {
      state.loading = true;
    },
    [requestInactiveCollectionTemplate.fulfilled]: (state) => {
      state.loading = false;
    },
    [requestInactiveCollectionTemplate.rejected]: (state) => {
      state.loading = false;
    },
    [requestActivateCollectionTemplate.pending]: (state) => {
      state.loading = true;
    },
    [requestActivateCollectionTemplate.fulfilled]: (state) => {
      state.loading = false;
    },
    [requestActivateCollectionTemplate.rejected]: (state) => {
      state.loading = false;
    },
    [createCollectionTemplate.pending]: (state) => {
      state.loading = true;
    },
    [createCollectionTemplate.fulfilled]: (state) => {
      state.loading = false;
    },
    [createCollectionTemplate.rejected]: (state) => {
      state.loading = false;
    },
    [updateCollectionTemplate.pending]: (state) => {
      state.loading = true;
    },
    [updateCollectionTemplate.fulfilled]: (state) => {
      state.loading = false;
    },
    [updateCollectionTemplate.rejected]: (state) => {
      state.loading = false;
    },
    [getDetailCollectionTemplate.pending]: (state) => {
      state.loading = true;
    },
    [getDetailCollectionTemplate.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailCollectionTemplate.rejected]: (state) => {
      state.loading = false;
    },
    [getCollectionActivityList.fulfilled]: (state, action) => {
      state.data_activities = action.payload || [];
    },
    [getCollectionTemplateAttachmentCategory.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload || [];
    },
    [addActivityToTemplate.pending]: (state) => {
      state.loading = true;
    },
    [addActivityToTemplate.fulfilled]: (state) => {
      state.loading = false;
    },
    [addActivityToTemplate.rejected]: (state) => {
      state.loading = false;
    },
    [addCriteriaToTemplate.pending]: (state) => {
      state.loading = true;
    },
    [addCriteriaToTemplate.fulfilled]: (state) => {
      state.loading = false;
    },
    [addCriteriaToTemplate.rejected]: (state) => {
      state.loading = false;
    },
    [getTemplateDetailApprovalInfo.pending]: (state) => {
      state.loading = true;
    },
    [getTemplateDetailApprovalInfo.fulfilled]: (state) => {
      state.loading = false;
    },
    [getTemplateDetailApprovalInfo.rejected]: (state) => {
      state.loading = false;
    },
    [approveTemplateDetail.pending]: (state) => {
      state.loading = true;
    },
    [approveTemplateDetail.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveTemplateDetail.rejected]: (state) => {
      state.loading = false;
    },
    [rejectTemplateDetail.pending]: (state) => {
      state.loading = true;
    },
    [rejectTemplateDetail.fulfilled]: (state) => {
      state.loading = false;
    },
    [rejectTemplateDetail.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export default collectionTemplateSlice.reducer;
