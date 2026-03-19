import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError
} from "../../general_slice";

const initialState = {
  loading: false,
  loading_detailIr: false,
  loading_detailDraftIr: false,
  loading_createUpdateIr: false,
  loading_listIrAccountStandard: false,
  loading_detailIrDetailAttachment: false,
  loading_approveRejectIr: false,
  loading_listIrApprovalOption: false,
  loading_detailIrApprovalHierarchyDetails: false,
  list_irDetailAttachment: [],
  pagination_irDetailAttachment: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10
  },
  data_irApprovalHierarchy: [],
  detail_irApprovalHierarchy: [],
  data_irAttachmentCategory: [],
  list_irAccountStandard: [],
  pagination_irAccountStandard: {
    totalPage: 0,
    totalElement: 0,
    currentPage: 0,
    pageSize: 10
  },
  detail_invoiceRelation: {},
  detailDraft_invoiceRelation: {},
  data_irApprovalHistory: {}
};

export const createInvoiceRelation = createAsyncThunk(
  "CREATE_INVOICE_RELATION",
  async ({ body: createBody, attachments = [], action }, thunkAPI) => {
    try {
      const createUrl = "/v1/dbs/api/invoice-relation/create";
      const response = await accountManagementService.createData(
        createUrl,
        createBody
      );

      const { id } = response.data;

      const uploadUrl = `/v1/dbs/api/invoice-relation/upload-attachment`;

      const uploadPromises = attachments.map((attachment) =>
        accountManagementService.uploadAttachment(uploadUrl, {
          files: attachment.file,
          category: attachment.fileCategoryId,
          refId: id,
          action
        })
      );

      await Promise.all(uploadPromises);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${createBody?.action === "draft" ? "drafted" : "submitted"}.`,
        return: false
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
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
        description: `Your data was not ${createBody?.action === "draft" ? "drafted" : "submitted"}. ${message}.`
      };

      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const updateInvoiceRelation = createAsyncThunk(
  "UPDATE_INVOICE_RELATION",
  async ({ id, body: updateBody, attachments = [], action }, thunkAPI) => {
    try {
      const updateUrl = `/v1/dbs/api/invoice-relation/${id}`;
      const response = await accountManagementService.updateData(
        updateUrl,
        updateBody
      );

      const uploadUrl = `/v1/dbs/api/invoice-relation/upload-attachment`;

      const uploadPromises = attachments.map((attachment) =>
        accountManagementService.uploadAttachment(uploadUrl, {
          id: attachment.id,
          files: attachment.file,
          category: attachment.fileCategoryId,
          refId: id,
          action,
        })
      );

      await Promise.all(uploadPromises);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${updateBody?.action === "draft" ? "drafted" : "submitted"}.`,
        return: false
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
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
        description: `Your data was not ${updateBody?.action === "draft" ? "drafted" : "submitted"}. ${message}.`
      };

      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDetailInvoiceRelation = createAsyncThunk(
  "GET_DETAIL_INVOICE_RELATION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDetailDraftInvoiceRelation = createAsyncThunk(
  "GET_DETAIL_DRAFT_INVOICE_RELATION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/detail-draft/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getIrApprovalHierarchy = createAsyncThunk(
  "GET_IR_APPROVAL_HIERARCHY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/approval-hierarchies`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDetailIrApprovalHierarchy = createAsyncThunk(
  "GET_DETAIL_IR_APPROVAL_HIERARCHY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/approval-hierarchy/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getIrAttachmentCategory = createAsyncThunk(
  "GET_IR_ATTACHMENT_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/attachment-category`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getIrAccountStandard = createAsyncThunk(
  "GET_IR_ACCOUNT_STANDARD",
  async ({ id, body, isLoadMore }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/invoice-relation/list-account/${id}`;

      const response = await accountManagementService.updateDataWithMethodPost(
        url,
        body
      );
      return {
        ...response.data,
        isLoadMore
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const approveOrRejectInvoiceRelation = createAsyncThunk(
  "APPROVE_OR_REJECT_INVOICE_RELATION",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/approve";
      const response = await accountManagementService.activationWithRemark(
        url,
        body
      );

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "approve" ? "approved" : "rejected"}.`,
        return: false
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
          description: `Your data was not ${action === "approve" ? "approved" : "rejected"}. ${message}.`
        };
        thunkAPI.dispatch(showModalError(errorBody));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${action === "approve" ? "approved" : "rejected"}. An unknown error occured.`
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const approveOrRejectInactiveInvoiceRelation = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_INVOICE_RELATION",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/approve-inactive";
      const response = await accountManagementService.activationWithRemark(
        url,
        body
      );

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "approve" ? "approved" : "rejected"}.`,
        return: false
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
          description: `Your data was not ${action === "approve" ? "approved" : "rejected"}. ${message}.`
        };
        thunkAPI.dispatch(showModalError(errorBody));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${action === "approve" ? "approved" : "rejected"}. An unknown error occured.`
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const inactivateInvoiceRelation = createAsyncThunk(
  "INACTIVATE_INVOICE_RELATION",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/inactive";
      const response = await accountManagementService.activationWithRemark(
        url,
        body
      );

      const successBody = {
        title: `Successful`,
        description: `Your data has been submitted`,
        return: false
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
          description: `Your data was not submitted. ${message}.`
        };
        thunkAPI.dispatch(showModalError(errorBody));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not submitted. An unknown error occured.`
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getIrColumnApi = createAsyncThunk(
  "GET_IR_COLUMN_API",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/list-search-column";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getIrConditionApi = createAsyncThunk(
  "GET_IR_CONDITION_API",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/list-search-condition";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getIrOperatorApi = createAsyncThunk(
  "GET_IR_OPERATOR_API",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/invoice-relation/list-search-operator";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const invoiceRelationSlice = createSlice({
  name: "invoiceRelation",
  initialState,
  extraReducers: {
    /** Get Detail Invoice Relation */
    [getDetailInvoiceRelation.pending]: (state) => {
      state.loading_detailIr = true;
    },
    [getDetailInvoiceRelation.fulfilled]: (state, action) => {
      state.detail_invoiceRelation = action.payload?.result || {};
      state.loading_detailIr = false;
    },
    [getDetailInvoiceRelation.rejected]: (state, action) => {
      state.detail_invoiceRelation = {};
      state.loading_detailIr = false;
    },

    /** Get Detail Draft Invoice Relation */
    [getDetailDraftInvoiceRelation.pending]: (state) => {
      state.loading_detailDraftIr = true;
    },
    [getDetailDraftInvoiceRelation.fulfilled]: (state, action) => {
      state.detailDraft_invoiceRelation = action.payload?.result || {};
      state.loading_detailDraftIr = false;
    },
    [getDetailDraftInvoiceRelation.rejected]: (state) => {
      state.detailDraft_invoiceRelation = {};
      state.loading_detailDraftIr = false;
    },

    /** Create Invoice Relation */
    [createInvoiceRelation.pending]: (state) => {
      state.loading_createUpdateIr = true;
    },
    [createInvoiceRelation.fulfilled]: (state) => {
      state.loading_createUpdateIr = false;
    },
    [createInvoiceRelation.rejected]: (state) => {
      state.loading_createUpdateIr = false;
    },

    /** Update Invoice Relation */
    [updateInvoiceRelation.pending]: (state) => {
      state.loading_createUpdateIr = true;
    },
    [updateInvoiceRelation.fulfilled]: (state) => {
      state.loading_createUpdateIr = false;
    },
    [updateInvoiceRelation.rejected]: (state) => {
      state.loading_createUpdateIr = false;
    },

    /** Get Invoice Relation Approval Hierarchy */
    [getIrApprovalHierarchy.pending]: (state) => {
      state.loading_listIrApprovalOption = true;
    },
    [getIrApprovalHierarchy.fulfilled]: (state, action) => {
      state.data_irApprovalHierarchy = action.payload;
      state.loading_listIrApprovalOption = false;
    },
    [getIrApprovalHierarchy.rejected]: (state) => {
      state.data_irApprovalHierarchy = [];
      state.loading_listIrApprovalOption = false;
    },

    /** Get Invoice Relation Detail Approval Hierarchy */
    [getDetailIrApprovalHierarchy.pending]: (state) => {
      state.loading_detailIrApprovalHierarchyDetails = true;
    },
    [getDetailIrApprovalHierarchy.fulfilled]: (state, action) => {
      state.detail_irApprovalHierarchy = action.payload;
      state.loading_detailIrApprovalHierarchyDetails = false;
    },
    [getDetailIrApprovalHierarchy.rejected]: (state) => {
      state.detail_irApprovalHierarchy = [];
      state.loading_detailIrApprovalHierarchyDetails = false;
    },

    /** Get Invoice Relation Attachment Category */
    [getIrAttachmentCategory.pending]: (state) => {
      state.loading = true;
    },
    [getIrAttachmentCategory.fulfilled]: (state, action) => {
      state.data_irAttachmentCategory = action.payload;
      state.loading = false;
    },
    [getIrAttachmentCategory.rejected]: (state) => {
      state.data_irAttachmentCategory = [];
      state.loading = false;
    },

    /** Get Invoice Relation Account Standard */
    [getIrAccountStandard.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listIrAccountStandard = true;
      }
    },
    [getIrAccountStandard.fulfilled]: (state, action) => {
      state.loading_listIrAccountStandard = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        const resultWithIds = result.map((record) => ({
          ...record,
          id: record.id || record.accountId
        }));

        if (isLoadMore) {
          const currentIds = new Set(
            state.list_irAccountStandard.map((item) => item.accountId)
          );
          const filteredResult = resultWithIds.filter(
            (resultItem) => !currentIds.has(resultItem.accountId)
          );

          state.list_irAccountStandard = [
            ...state.list_irAccountStandard,
            ...filteredResult
          ];
        } else state.list_irAccountStandard = resultWithIds;
      }

      state.pagination_irAccountStandard = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10
      };
    },
    [getIrAccountStandard.rejected]: (state, action) => {
      state.loading_listIrAccountStandard = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_irAccountStandard = [];
        state.pagination_irAccountStandard = {
          totalPage: 0,
          totalElement: 0,
          currentPage: 0,
          pageSize: 10
        };
      }
    },

    /** Approve or Reject Invoice Relation */
    [approveOrRejectInvoiceRelation.pending]: (state) => {
      state.loading_approveRejectIr = true;
    },
    [approveOrRejectInvoiceRelation.fulfilled]: (state) => {
      state.loading_approveRejectIr = false;
    },
    [approveOrRejectInvoiceRelation.rejected]: (state) => {
      state.loading_approveRejectIr = false;
    },

    /** Approve or Reject Inactive Invoice Relation */
    [approveOrRejectInactiveInvoiceRelation.pending]: (state) => {
      state.loading_approveRejectIr = true;
    },
    [approveOrRejectInactiveInvoiceRelation.fulfilled]: (state) => {
      state.loading_approveRejectIr = false;
    },
    [approveOrRejectInactiveInvoiceRelation.rejected]: (state) => {
      state.loading_approveRejectIr = false;
    },

    /** Inactivate Invoice Relation Attachment */
    [inactivateInvoiceRelation.pending]: (state) => {
      state.loading = true;
    },
    [inactivateInvoiceRelation.fulfilled]: (state) => {
      state.loading = false;
    },
    [inactivateInvoiceRelation.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Invoice Relation Column API  */
    [getIrColumnApi.pending]: (state) => {
      state.loading = true;
    },
    [getIrColumnApi.fulfilled]: (state, action) => {
      state.data_globalTypeColumn = action.payload;
      state.loading = false;
    },
    [getIrColumnApi.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Invoice Relation Condition API  */
    [getIrConditionApi.pending]: (state) => {
      state.loading = true;
    },
    [getIrConditionApi.fulfilled]: (state, action) => {
      state.data_globalTypeCondition = action.payload;
      state.loading = false;
    },
    [getIrConditionApi.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Invoice Relation Operator API  */
    [getIrOperatorApi.pending]: (state) => {
      state.loading = true;
    },
    [getIrOperatorApi.fulfilled]: (state, action) => {
      state.data_globalTypeOperator = action.payload;
      state.loading = false;
    },
    [getIrOperatorApi.rejected]: (state) => {
      state.loading = false;
    }
  }
});
const { reducer } = invoiceRelationSlice;
export default reducer;

