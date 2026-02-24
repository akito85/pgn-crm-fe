import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../../services/ratingBillingHttpService";
import { showModalSuccess, validateError } from "../../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../../utils";

const initialState = {
  data: [],
  pagination: {},
  data_detail: {},
  data_detail_draft: {},
  data_download: [],
  dataApprovalHistory: {},
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
  status: "",
};

export const getListBillingItemCategory = createAsyncThunk(
  "LIST_BILLING_ITEM_CATEGORY",
  async ({ search, page, size, sort, isLoadMore }, thunkAPI) => {
    try {
      const sortArray = Array.isArray(sort) ? sort : [];

      // Build search params as JSON string
      const searchParams =
        search && typeof search === "object" && Object.keys(search).length > 0
          ? JSON.stringify(search)
          : "";

      const sortParams =
        sortArray.length > 0 ? sortArray.join("&sort=") : "createdDate~desc";

      const url = `/v1/dbs/api/billing-item-category/get-paging?${searchParams ? `searchs=${encodeURIComponent(searchParams)}&` : ""}page=${page}&size=${size}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return { ...response.data, isLoadMore };
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "LIST_BILLING_ITEM_CATEGORY",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getDetailBillingItemCategory = createAsyncThunk(
  "GET_DETAIL_BILLING_ITEM_CATEGORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing-item-category/detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "GET_DETAIL_BILLING_ITEM_CATEGORY",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getDetailDraftBillingItemCategory = createAsyncThunk(
  "GET_DETAIL_DRAFT_BILLING_ITEM_CATEGORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing-item-category/detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (response) {
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const createBillingItemCategory = createAsyncThunk(
  "CREATE_BILLING_ITEM_CATEGORY",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing-item-category/create`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Your data has been created",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "created",
            errorMessage(response),
          ),
          action: "CREATE_BILLING_ITEM_CATEGORY",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const inactiveBillingItemCategory = createAsyncThunk(
  "INACTIVE_BILLING_ITEM_CATEGORY",
  async (body, thunkAPI) => {
    let status = body?.status === "INACTIVE" ? "activated" : "inactivated";
    try {
      const url = `/v1/dbs/api/billing-item-category/active/inactive`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
      );
      const successMessage = {
        title: "Successful",
        description: response?.message,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(response), status, errorMessage(response)),
          action: "INACTIVE_BILLING_ITEM_CATEGORY",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const updateBillingItemCategory = createAsyncThunk(
  "UPDATE_BILLING_ITEM_CATEGORY",
  async ({ body }, thunkApi) => {
    try {
      const url = `/v1/dbs/api/billing-item-category/update/${body.id}`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: body.isSubmit
          ? "Your data has been submitted"
          : "Your data has been saved as draft",
      };
      thunkApi.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (response) {
      thunkApi.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "updated",
            errorMessage(response),
          ),
          action: "UPDATE_BILLING_ITEM_CATEGORY",
          back: false,
        }),
      );
      return thunkApi.rejectWithValue(response.response.data);
    }
  },
);

export const getAvailableApproval = createAsyncThunk(
  "GET_AVAILABLE_APPROVAL_BILLING_ITEM_CATEGORY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing-item-category/approval-hierarcy-list`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (response) {
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getSelectedApproval = createAsyncThunk(
  "GET_SELECTED_APPROVAL_BILLING_ITEM_CATEGORY",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing-item-category/apphier-detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (response) {
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const approveRejectBillingItemCategory = createAsyncThunk(
  "APPROVE_REJECT_BILLING_ITEM_CATEGORY",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing-item-category/approve`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description:
          body.action === "APPROVE"
            ? "Data has been approved"
            : "Data has been rejected",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            body.action === "APPROVE" ? "approved" : "rejected",
            errorMessage(response),
          ),
          action: "APPROVE_REJECT_BILLING_ITEM_CATEGORY",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const requestInactiveBillingItemCategory = createAsyncThunk(
  "REQUEST_INACTIVE_BILLING_ITEM_CATEGORY",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing-item-category/request-inactive`;
      const response = await ratingBillingHttpService.createData(url, body);
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
          action: "REQUEST_INACTIVE_BILLING_ITEM_CATEGORY",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const approveRejectInactiveBillingItemCategory = createAsyncThunk(
  "APPROVE_REJECT_INACTIVE_BILLING_ITEM_CATEGORY",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing-item-category/approve-inactive`;
      const response = await ratingBillingHttpService.createData(url, body);
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
            body.action === "APPROVE" ? "approved" : "rejected",
            errorMessage(response),
          ),
          action: "APPROVE_REJECT_INACTIVE_BILLING_ITEM_CATEGORY",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getDownloadBillingItemCategory = createAsyncThunk(
  "DOWNLOAD_BILLING_ITEM_CATEGORY",
  async ({ sort, page, size, search }, thunkAPI) => {
    try {
      const sortArray = Array.isArray(sort) ? sort : [];

      // Build search params as JSON string
      const searchParams =
        search && typeof search === "object" && Object.keys(search).length > 0
          ? JSON.stringify(search)
          : "";

      const sortParams =
        sortArray.length > 0 ? sortArray.join("&sort=") : "createdDate~desc";

      const url = `/v1/dbs/api/billing-item-category/download-filter?${searchParams ? `searchs=${encodeURIComponent(searchParams)}&` : ""}page=${page}&size=${size}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_BILLING_ITEM_CATEGORY",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_BILLING_ITEM_CATEGORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billing-item-category/approval-history/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "GET_APPROVAL_HISTORY_BILLING_ITEM_CATEGORY",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

const billingItemCategorySlice = createSlice({
  name: "billingItemCategory",
  initialState,
  extraReducers: {
    // get all
    [getListBillingItemCategory.pending]: (state) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
    },
    [getListBillingItemCategory.fulfilled]: (state, action) => {
      const { isLoadMore, page, result, ...rest } = action.payload;

      if (isLoadMore) {
        // Append new data for load more
        state.data = [...(state.data || []), ...(result || [])];
      } else {
        // Replace data for initial load or refresh
        state.data = result || [];
      }

      state.pagination = { page, ...rest };
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = false;
    },
    [getListBillingItemCategory.rejected]: (state, action) => {
      state.data = [];
      state.loading = false;
    },
    // detail
    [getDetailBillingItemCategory.pending]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = true;
    },
    [getDetailBillingItemCategory.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailBillingItemCategory.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    // inactive
    [inactiveBillingItemCategory.pending]: (state) => {
      state.loading = true;
    },
    [inactiveBillingItemCategory.fulfilled]: (state, action) => {
      state.data = action?.payload;
      state.loading = false;
    },
    [inactiveBillingItemCategory.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },
    // create
    [createBillingItemCategory.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [createBillingItemCategory.pending]: (state) => {
      state.loading = true;
    },
    [createBillingItemCategory.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },
    // update
    [updateBillingItemCategory.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [updateBillingItemCategory.pending]: (state) => {
      state.loading = true;
    },
    [updateBillingItemCategory.rejected]: (state, action) => {
      state.isFailed = true;
      state.data = action.payload;
      state.loading = false;
    },
    // download
    [getDownloadBillingItemCategory.pending]: (state) => {
      state.loading = true;
    },
    [getDownloadBillingItemCategory.fulfilled]: (state, action) => {
      state.data_download = action.payload;
      state.loading = false;
    },
    [getDownloadBillingItemCategory.rejected]: (state, action) => {
      state.isFailed = true;
      state.data_download = action.payload;
      state.loading = false;
    },
    // approval history
    [getApprovalHistory.pending]: (state) => {
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
    // detail draft
    [getDetailDraftBillingItemCategory.pending]: (state) => {
      state.loading = true;
    },
    [getDetailDraftBillingItemCategory.fulfilled]: (state, action) => {
      state.data_detail_draft = action.payload;
      state.loading = false;
    },
    [getDetailDraftBillingItemCategory.rejected]: (state, action) => {
      state.data_detail_draft = action.payload;
      state.loading = false;
    },
    // available approval
    [getAvailableApproval.pending]: (state) => {
      state.loading = true;
    },
    [getAvailableApproval.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    [getAvailableApproval.rejected]: (state) => {
      state.loading = false;
    },
    // selected approval
    [getSelectedApproval.pending]: (state) => {
      state.loading = true;
    },
    [getSelectedApproval.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },
    [getSelectedApproval.rejected]: (state) => {
      state.loading = false;
    },
    // approve/reject
    [approveRejectBillingItemCategory.pending]: (state) => {
      state.loading = true;
    },
    [approveRejectBillingItemCategory.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveRejectBillingItemCategory.rejected]: (state) => {
      state.loading = false;
    },
    // request inactive
    [requestInactiveBillingItemCategory.pending]: (state) => {
      state.loading = true;
    },
    [requestInactiveBillingItemCategory.fulfilled]: (state) => {
      state.loading = false;
    },
    [requestInactiveBillingItemCategory.rejected]: (state) => {
      state.loading = false;
    },
    // approve/reject inactive
    [approveRejectInactiveBillingItemCategory.pending]: (state) => {
      state.loading = true;
    },
    [approveRejectInactiveBillingItemCategory.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveRejectInactiveBillingItemCategory.rejected]: (state) => {
      state.loading = false;
    },
  },
});

const { reducer } = billingItemCategorySlice;
export default reducer;
