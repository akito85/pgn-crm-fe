import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import { setBodyError, showModalError, showModalSuccess, validateError } from "../../general_slice";

const initialState = {
  loading: false,
  loading_detailPr: false,
  loading_detailDraftPr: false,
  loading_createUpdatePr: false,
  loading_listPrAccountStandard: false,
  loading_detailPrDetailAttachment: false,
  loading_approveRejectPr: false,
  list_prDetailAttachment: [],
  pagination_prDetailAttachment: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },
  loading_listPrApprovalOption: false,
  list_prApprovalOptions: [],
  loading_detailPrApprovalHierarchyDetails: false,
  list_prApprovalHierarchyDetail: [],
  data_prAttachmentCategory: [],
  list_prAccountStandard: [],
  pagination_prAccountStandard: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },
  detail_paymentRelation: {},
  detailDraft_paymentRelation: {},
  data_prApprovalHistory: {},
};

export const getPaymentRelationAttachment = createAsyncThunk(
  "GET_PAYMENT_RELATION_ATTACHMENT",
  async ({ id, page, size, sort, searchs, listType, isLoadMore }, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams;

      if (page)
        queryParams.append("page", page);
      if (size)
        queryParams.append("size", size);
      if (sort)
        queryParams.append("sort", sort);
      if (searchs)
        queryParams.append("searchs", searchs);
      if (listType)
        queryParams.append("listType", listType);

      let url = `/v1/dbs/api/payment-relation/list-attachment/${id}`;

      if (queryParams.toString().length)
        url += `?${queryParams.toString()}`;

      const response = await accountManagementService.getAll(url);
      return {
        ...response.data,
        isLoadMore
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const createPaymentRelation = createAsyncThunk(
  "CREATE_PAYMENT_RELATION",
  async ({ body: createBody, attachments = [] }, thunkAPI) => {
    try {
      const createUrl = "/v1/dbs/api/payment-relation/create";
      const response = await accountManagementService.createData(createUrl, createBody);

      const { id } = response.data;

      const uploadUrl = `/v1/dbs/api/payment-relation/upload-attachment`;

      const uploadPromises = attachments.map((attachment) => accountManagementService.uploadAttachment(uploadUrl, {
        files:  attachment.file,
        category: attachment.fileCategoryId,
        refId: id,
      }));

      await Promise.all(uploadPromises);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${createBody?.action === "draft" ? 'drafted' : 'submitted'}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody))
      return response.data;
    } catch (error) {
      let message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      if (Math.floor((error.response.data.code || 0) / 100) !== 4)
        message = "An unknown error occured";

      const errorBody = {
        title: "Failed",
        description: `Your data was not ${createBody?.action === "draft" ? 'drafted' : 'submitted'}. ${message}.`,
      };
      
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const updatePaymentRelation = createAsyncThunk(
  "UPDATE_PAYMENT_RELATION",
  async ({ id, body: updateBody, attachments = [] }, thunkAPI) => {
    try {
      const updateUrl = `/v1/dbs/api/payment-relation/${id}`;
      const response = await accountManagementService.updateData(updateUrl, updateBody);

      const uploadUrl = `/v1/dbs/api/payment-relation/upload-attachment`;

      const uploadPromises = attachments.map((attachment) => accountManagementService.uploadAttachment(
        uploadUrl,
        {
          files:  attachment.file,
          category: attachment.fileCategoryId,
          refId: id,
        }
      ));

      await Promise.all(uploadPromises);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${updateBody?.action === "draft" ? 'drafted' : 'submitted'}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody))
      return response.data;
    } catch (error) {
      let message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      if (Math.floor((error.response.data.code || 0) / 100) !== 4)
        message = "An unknown error occured";

      const errorBody = {
        title: "Failed",
        description: `Your data was not ${updateBody?.action === "draft" ? 'drafted' : 'submitted'}. ${message}.`,
      };
      
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDetailPaymentRelation = createAsyncThunk(
  "GET_DETAIL_PAYMENT_RELATION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDetailDraftPaymentRelation = createAsyncThunk(
  "GET_DETAIL_DRAFT_PAYMENT_RELATION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/detail-draft/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getPrApprovalHierarchy = createAsyncThunk(
  "GET_PR_APPROVAL_HIERARCHY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/approval-hierarchies`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getDetailPrApprovalHierarchy = createAsyncThunk(
  "GET_DETAIL_PR_APPROVAL_HIERARCHY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/approval-hierarchy/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getPrAttachmentCategory = createAsyncThunk(
  "GET_PR_ATTACHMENT_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-relation/attachment-category`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getPrAccountStandard = createAsyncThunk(
  "GET_PR_ACCOUNT_STANDARD",
  async ({ page, size, sort, searchs, id, isLoadMore }, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams;

      if (page)
        queryParams.append("page", page);
      if (size)
        queryParams.append("size", size);
      if (sort)
        queryParams.append("sort", sort);
      if (searchs)
        queryParams.append("searchs", searchs);

      let url = `/v1/dbs/api/payment-relation/list-account/${id}`;

      if (queryParams.toString().length)
        url += `?${queryParams.toString()}`;

      const response = await accountManagementService.getPagination(url);
      return {
        ...response.data,
        isLoadMore,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const approveOrRejectPaymentRelation = createAsyncThunk(
  "APPROVE_OR_REJECT_PAYMENT_RELATION",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-relation/approve";
      const response = await accountManagementService.activationWithRemark(url, body);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "approve" ? "approved" : "rejected"}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody))
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
          description: `Your data was not ${action === "approve" ? "approved" : "rejected"}. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${action === "approve" ? "approved" : "rejected"}. An unknown error occured.`
        }
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const approveOrRejectInactivePaymentRelation = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_PAYMENT_RELATION",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-relation/approve-inactive";
      const response = await accountManagementService.activationWithRemark(url, body);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "approve" ? "approved" : "rejected"}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody))
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
          description: `Your data was not ${action === "approve" ? "approved" : "rejected"}. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${action === "approve" ? "approved" : "rejected"}. An unknown error occured.`
        }
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const inactivatePaymentRelation = createAsyncThunk(
  "INACTIVATE_PAYMENT_RELATION",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-relation/inactive";
      const response = await accountManagementService.activationWithRemark(url, body);

      const successBody = {
        title: `Successful`,
        description: `Your data has been submitted`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody))
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
        };
        thunkAPI.dispatch(showModalError(errorBody));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not submitted. An unknown error occured.`
        }
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getPrColumnApi = createAsyncThunk(
  "GET_PR_COLUMN_API",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-relation/list-search-column";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getPrConditionApi = createAsyncThunk(
  "GET_PR_CONDITION_API",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-relation/list-search-condition";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getPrOperatorApi = createAsyncThunk(
  "GET_PR_OPERATOR_API",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/payment-relation/list-search-operator";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

const paymentRelationSlice = createSlice({
  name: "paymentRelation",
  initialState,
  extraReducers: {
    /** Get Detail Payment Relation */
    [getDetailPaymentRelation.pending]: (state, action) => {
      state.loading_detailPr = true;
    },
    [getDetailPaymentRelation.fulfilled]: (state, action) => {
      state.detail_paymentRelation = action.payload?.result || {};
      state.loading_detailPr = false;
    },
    [getDetailPaymentRelation.rejected]: (state, action) => {
      state.detail_paymentRelation = {};
      state.loading_detailPr = false;
    },

    /** Get Detail Draft Payment Relation */
    [getDetailDraftPaymentRelation.pending]: (state, action) => {
      state.loading_detailDraftPr = true;
    },
    [getDetailDraftPaymentRelation.fulfilled]: (state, action) => {
      state.detailDraft_paymentRelation = action.payload?.result || {};
      state.loading_detailDraftPr = false;
    },
    [getDetailDraftPaymentRelation.rejected]: (state, action) => {
      state.detailDraft_paymentRelation = {};
      state.loading_detailDraftPr = false;
    },

    /** Create Payment Relation */
    [createPaymentRelation.pending]: (state) => {
      state.loading_createUpdatePr = true;
    },
    [createPaymentRelation.fulfilled]: (state) => {
      state.loading_createUpdatePr = false;
    },
    [createPaymentRelation.rejected]: (state) => {
      state.loading_createUpdatePr = false;
    },

    /** Update Payment Relation */
    [updatePaymentRelation.pending]: (state) => {
      state.loading_createUpdatePr = true;
    },
    [updatePaymentRelation.fulfilled]: (state) => {
      state.loading_createUpdatePr = false;
    },
    [updatePaymentRelation.rejected]: (state) => {
      state.loading_createUpdatePr = false;
    },

    /** Get Payment Relation Approval Hierarchy */
    [getPrApprovalHierarchy.pending]: (state) => {
      state.list_prApprovalOptions = [];
      state.loading_listPrApprovalOption = true;
    },
    [getPrApprovalHierarchy.fulfilled]: (state, action) => {
      state.list_prApprovalOptions = action.payload;
      state.loading_listPrApprovalOption = false;
    },
    [getPrApprovalHierarchy.rejected]: (state) => {
      state.list_prApprovalOptions = [];
      state.loading_listPrApprovalOption = false;
    },

    /** Get Payment Relation Detail Approval Hierarchy */
    [getDetailPrApprovalHierarchy.pending]: (state) => {
      state.list_prApprovalHierarchyDetail = [];
      state.loading_detailPrApprovalHierarchyDetails = true;
    },
    [getDetailPrApprovalHierarchy.fulfilled]: (state, action) => {
      state.list_prApprovalHierarchyDetail = action.payload;
      state.loading_detailPrApprovalHierarchyDetails = false;
    },
    [getDetailPrApprovalHierarchy.rejected]: (state) => {
      state.list_prApprovalHierarchyDetail = [];
      state.loading_detailPrApprovalHierarchyDetails = false;
    },

    /** Get Payment Relation Attachment Category */
    [getPrAttachmentCategory.pending]: (state) => {
      state.loading = true;
    },
    [getPrAttachmentCategory.fulfilled]: (state, action) => {
      state.data_prAttachmentCategory = action.payload;
      state.loading = false;
    },
    [getPrAttachmentCategory.rejected]: (state) => {
      state.data_prAttachmentCategory = [];
      state.loading = false;
    },

    /** Get Payment Relation Account Standard */
    [getPrAccountStandard.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listPrAccountStandard = true;
      }
    },
    [getPrAccountStandard.fulfilled]: (state, action) => {
      state.loading_listPrAccountStandard = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_prAccountStandard.map((item) => item.accountId));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.accountId));

          state.list_prAccountStandard = [
            ...state.list_prAccountStandard,
            ...filteredResult,
          ];
        }
        else
          state.list_prAccountStandard = result;
      }

      state.pagination_prAccountStandard = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getPrAccountStandard.rejected]: (state, action) => {
      state.loading_listPrAccountStandard = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_prAccountStandard = [];
        state.pagination_prAccountStandard = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Get Payment Relation Attachment */
    [getPaymentRelationAttachment.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_detailPrDetailAttachment = true;
      }
    },
    [getPaymentRelationAttachment.fulfilled]: (state, action) => {
      state.loading_detailPrDetailAttachment = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_prDetailAttachment.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_prDetailAttachment = [
            ...state.list_prDetailAttachment,
            ...filteredResult,
          ];
        }
        else
          state.list_prDetailAttachment = result;
      }

      state.pagination_prDetailAttachment = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getPaymentRelationAttachment.rejected]: (state, action) => {
      state.loading_detailPrDetailAttachment = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_prDetailAttachment = [];
        state.pagination_prDetailAttachment = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Approve or Reject Payment Relation */
    [approveOrRejectPaymentRelation.pending]: (state) => {
      state.loading_approveRejectPr = true;
    },
    [approveOrRejectPaymentRelation.fulfilled]: (state) => {
      state.loading_approveRejectPr = false;
    },
    [approveOrRejectPaymentRelation.rejected]: (state) => {
      state.loading_approveRejectPr = false;
    },

    /** Approve or Reject Inactive Payment Relation */
    [approveOrRejectInactivePaymentRelation.pending]: (state) => {
      state.loading_approveRejectPr = true;
    },
    [approveOrRejectInactivePaymentRelation.fulfilled]: (state) => {
      state.loading_approveRejectPr = false;
    },
    [approveOrRejectInactivePaymentRelation.rejected]: (state) => {
      state.loading_approveRejectPr = false;
    },

    /** Inactivate Payment Relation Attachment */
    [inactivatePaymentRelation.pending]: (state) => {
      state.loading = true;
    },
    [inactivatePaymentRelation.fulfilled]: (state) => {
      state.loading = false;
    },
    [inactivatePaymentRelation.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Payment Relation Column API  */
    [getPrColumnApi.pending]: (state) => {
      state.loading = true;
    },
    [getPrColumnApi.fulfilled]: (state, action) => {
      state.data_globalTypeColumn = action.payload;
      state.loading = false;
    },
    [getPrColumnApi.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Payment Relation Condition API  */
    [getPrConditionApi.pending]: (state) => {
      state.loading = true;
    },
    [getPrConditionApi.fulfilled]: (state, action) => {
      state.data_globalTypeCondition = action.payload;
      state.loading = false;
    },
    [getPrConditionApi.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Payment Relation Operator API  */
    [getPrOperatorApi.pending]: (state) => {
      state.loading = true;
    },
    [getPrOperatorApi.fulfilled]: (state, action) => {
      state.data_globalTypeOperator = action.payload;
      state.loading = false;
    },
    [getPrOperatorApi.rejected]: (state) => {
      state.loading = false
    },
  },
});
const { reducer } = paymentRelationSlice;
export default reducer;
