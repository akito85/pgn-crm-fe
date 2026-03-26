import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import { setBodyError, showModalError, showModalSuccess, validateError } from "../../general_slice";

const initialState = {
  // --- Shared ---
  loading: false,

  // --- List ---
  loading_listMd: false,
  list_multiDestination: [],
  pagination_multiDestination: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },

  // --- Approval List ---
  loading_listMdApproval: false,
  list_multiDestinationApproval: [],
  pagination_multiDestinationApproval: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },

  // --- Detail ---
  loading_detailMd: false,
  detail_multiDestination: {},
  loading_detailDraftMd: false,
  detailDraft_multiDestination: {},

  // --- Create / Update ---
  loading_createUpdateMd: false,

  // --- Approve / Reject ---
  loading_approveRejectMd: false,

  // --- Form Options (approval hierarchy, attachment categories, account standard) ---
  loading_listMdApprovalOption: false,
  list_mdApprovalOptions: [],
  loading_listMdApprovalHierarchyDetail: false,
  list_mdApprovalHierarchyDetail: [],
  data_mdAttachmentCategory: [],
  loading_listMdAccountStandard: false,
  list_mdAccountStandard: [],
  pagination_mdAccountStandard: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },

  // --- Attachment ---
  loading_detailMdDetailAttachment: false,
  list_mdDetailAttachment: [],
  pagination_mdDetailAttachment: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },

  // --- History ---
  data_mdApprovalHistory: {},

  // --- Dynamic Search ---
  data_globalTypeCondition: [],
  data_globalTypeOperator: [],
  data_globalTypeColumn: [],
};

export const getMultiDestination = createAsyncThunk(
  "GET_MULTI_DESTINATION",
  async ({ id, body, isLoadMore }, thunkAPI) => {
    try {
      body = {
        ...body,
        listType: "all"
      }

      const url = `/v1/dbs/api/multi-destination/list/${id}`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body, {
          headers: { "Accept": "application/json, text/plain, */*" }
        });
      return {
        ...response.data,
        isLoadMore,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getMultiDestinationApproval = createAsyncThunk(
  "GET_MULTI_DESTINATION_APPROVAL",
  async ({ id, body, isLoadMore }, thunkAPI) => {
    try {
      body = {
        ...body,
        listType: "approval"
      }

      const url = `/v1/dbs/api/multi-destination/list/${id}`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body, {
          headers: { "Accept": "application/json, text/plain, */*" }
        });
      return {
        ...response.data,
        isLoadMore,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getMultiDestinationAttachment = createAsyncThunk(
  "GET_MULTI_DESTINATION_ATTACHMENT",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/multi-destination/list-attachment/${id}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const createMultiDestination = createAsyncThunk(
  "CREATE_MULTI_DESTINATION",
  async ({ body: createBody, attachments = [] }, thunkAPI) => {
    try {
      const createUrl = "/v1/dbs/api/multi-destination/create";
      const response = await accountManagementService.createData(createUrl, createBody);

      const { id } = response.data;

      const uploadUrl = `/v1/dbs/api/multi-destination/upload-attachment`;

      const uploadPromises = attachments.map((attachment) => accountManagementService.uploadAttachment(uploadUrl, {
        files:  attachment.file,
        category: attachment.fileCategoryId,
        refId: id,
      }));

      await Promise.all(uploadPromises);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${createBody?.action === "DRAFT" ? 'drafted' : 'submitted'}.`,
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

      if (Math.floor((error.response?.data?.code || 0) / 100) !== 4)
        message = "An unknown error occured";

      const errorBody = {
        title: "Failed",
        description: `Your data was not ${createBody?.action === "DRAFT" ? 'drafted' : 'submitted'}. ${message}.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const updateMultiDestination = createAsyncThunk(
  "UPDATE_MULTI_DESTINATION",
  async ({ id, body: updateBody, attachments = [] }, thunkAPI) => {
    try {
      const updateUrl = `/v1/dbs/api/multi-destination/${id}`;
      const response = await accountManagementService.updateData(updateUrl, updateBody);

      const uploadUrl = `/v1/dbs/api/multi-destination/upload-attachment`;

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
        description: `Your data has been ${updateBody?.action === "DRAFT" ? 'drafted' : 'updated'}.`,
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

      if (Math.floor((error.response?.data?.code || 0) / 100) !== 4)
        message = "An unknown error occured";

      const errorBody = {
        title: "Failed",
        description: `Your data was not ${updateBody?.action === "DRAFT" ? 'drafted' : 'updated'}. ${message}.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDetailMultiDestination = createAsyncThunk(
  "GET_DETAIL_MULTI_DESTINATION",
  async ({ id, subjectId, objectId }, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams;

      if (subjectId)
        queryParams.append("subjectId", subjectId);
      if (objectId)
        queryParams.append("objectId", objectId);

      let url = `/v1/dbs/api/multi-destination/${id}`;

      if (queryParams.toString().length)
        url += `?${queryParams.toString()}`;

      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDetailDraftMultiDestination = createAsyncThunk(
  "GET_DETAIL_DRAFT_MULTI_DESTINATION",
  async ({ id, subjectId, objectId }, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams;

      if (subjectId)
        queryParams.append("subjectId", subjectId);
      if (objectId)
        queryParams.append("objectId", objectId);

      let url = `/v1/dbs/api/multi-destination/detail-draft/${id}`;

      if (queryParams.toString().length)
        url += `?${queryParams.toString()}`;

      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getMdApprovalHierarchy = createAsyncThunk(
  "GET_MD_APPROVAL_HIERARCHY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/multi-destination/approval-hierarchies`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getDetailMdApprovalHierarchy = createAsyncThunk(
  "GET_DETAIL_MD_APPROVAL_HIERARCHY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/multi-destination/approval-hierarchy/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getMdAttachmentCategory = createAsyncThunk(
  "GET_MD_ATTACHMENT_CATEGORY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/multi-destination/attachment-category`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getMdAccountStandard = createAsyncThunk(
  "GET_MD_ACCOUNT_STANDARD",
  async ({ id, body, isLoadMore }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/multi-destination/list-account/${id}`;
      
      const response = await accountManagementService.updateDataWithMethodPost(url, body);
      return {
        ...response.data,
        isLoadMore,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const approveOrRejectMultiDestination = createAsyncThunk(
  "APPROVE_OR_REJECT_MULTI_DESTINATION",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/multi-destination/approve";
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
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
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

export const approveOrRejectInactiveMultiDestination = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_MULTI_DESTINATION",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/multi-destination/approve-inactive";
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
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
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

export const approveOrRejectAllMultiDestination = createAsyncThunk(
  "APPROVE_OR_REJECT_ALL_MULTI_DESTINATION",
  async ({ body, inactiveBody, action }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/multi-destination/approve";
      const inactiveUrl = "/v1/dbs/api/multi-destination/approve-inactive";
      
      await Promise.all([
        body.length ? accountManagementService.activationWithRemark(url, body, {
          headers: {
            "Accept": "application/json"
          }
        }) : null,
        inactiveBody.length ? accountManagementService.activationWithRemark(inactiveUrl, inactiveBody, {
          headers: {
            "Accept": "application/json"
          }
        }) : null,
      ]);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "APPROVE" ? 'approved' : 'rejected'}.`,
        return: false,
      };

      thunkAPI.dispatch(showModalSuccess(successBody))
      return null;
    } catch (error) {
      let message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response?.data?.code || 0) / 100) !== 4)
        message = "An unknown error occured"

      const errorBody = {
        title: "Failed",
        description: `Your data was not ${action === "APPROVE" ? 'approved' : 'rejected'}. ${message}.`,
      };

      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const inactivateMultiDestination = createAsyncThunk(
  "INACTIVATE_MULTI_DESTINATION",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/multi-destination/inactive";
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
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
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

export const downloadMultiDestination = createAsyncThunk(
  "DOWNLOAD_MULTI_DESTINATION",
  async ({ body, id, }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/multi-destination/export-excel/${id}`;
      const response = await accountManagementService.downloadDataAdvanced(url, body);
      return response;
    } catch (response) {
      thunkAPI.dispatch(validateError({ error: response, action: "DOWNLOAD_MULTI_DESTINATION", back: false }));
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const getMdApprovalHistory = createAsyncThunk(
  "GET_MD_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/multi-destination/approval-history/${id}`;
      const response = await accountManagementService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getMdColumnApi = createAsyncThunk(
  "GET_MD_COLUMN_API",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/multi-destination/list-search-column";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getMdConditionApi = createAsyncThunk(
  "GET_MD_CONDITION_API",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/multi-destination/list-search-condition";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getMdOperatorApi = createAsyncThunk(
  "GET_MD_OPERATOR_API",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/multi-destination/list-search-operator";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

const multiDestinationSlice = createSlice({
  name: "multiDestination",
  initialState,
  extraReducers: {
    /** Get Multi Destination */
    [getMultiDestination.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listMd = true;
      }
    },
    [getMultiDestination.fulfilled]: (state, action) => {
      state.loading_listMd = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_multiDestination.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_multiDestination = [
            ...state.list_multiDestination,
            ...filteredResult,
          ];
        }
        else
          state.list_multiDestination = result;
      }

      state.pagination_multiDestination = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getMultiDestination.rejected]: (state, action) => {
      state.loading_listMd = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_multiDestination = [];
        state.pagination_multiDestination = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Get Multi Destination Approval */
    [getMultiDestinationApproval.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listMdApproval = true;
      }
    },
    [getMultiDestinationApproval.fulfilled]: (state, action) => {
      state.loading_listMdApproval = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_multiDestinationApproval.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_multiDestinationApproval = [
            ...state.list_multiDestinationApproval,
            ...filteredResult,
          ];
        }
        else
          state.list_multiDestinationApproval = result;
      }

      state.pagination_multiDestinationApproval = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getMultiDestinationApproval.rejected]: (state, action) => {
      state.loading_listMdApproval = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_multiDestinationApproval = [];
        state.pagination_multiDestinationApproval = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Get Detail Multi Destination */
    [getDetailMultiDestination.pending]: (state) => {
      state.detail_multiDestination = {};
      state.loading_detailMd = true;
    },
    [getDetailMultiDestination.fulfilled]: (state, action) => {
      state.detail_multiDestination = action.payload || {};
      state.loading_detailMd = false;
    },
    [getDetailMultiDestination.rejected]: (state) => {
      state.detail_multiDestination = {};
      state.loading_detailMd = false;
    },

    /** Get Detail Draft Multi Destination */
    [getDetailDraftMultiDestination.pending]: (state) => {
      state.detailDraft_multiDestination = {};
      state.loading_detailDraftMd = true;
    },
    [getDetailDraftMultiDestination.fulfilled]: (state, action) => {
      state.detailDraft_multiDestination = action.payload || {};
      state.loading_detailDraftMd = false;
    },
    [getDetailDraftMultiDestination.rejected]: (state) => {
      state.detailDraft_multiDestination = {};
      state.loading_detailDraftMd = false;
    },

    /** Create Multi Destination */
    [createMultiDestination.pending]: (state) => {
      state.loading_createUpdateMd = true;
    },
    [createMultiDestination.fulfilled]: (state) => {
      state.loading_createUpdateMd = false;
    },
    [createMultiDestination.rejected]: (state) => {
      state.loading_createUpdateMd = false;
    },

    /** Update Multi Destination */
    [updateMultiDestination.pending]: (state) => {
      state.loading_createUpdateMd = true;
    },
    [updateMultiDestination.fulfilled]: (state) => {
      state.loading_createUpdateMd = false;
    },
    [updateMultiDestination.rejected]: (state) => {
      state.loading_createUpdateMd = false;
    },

    /** Get Multi Destination Approval Hierarchy */
    [getMdApprovalHierarchy.pending]: (state) => {
      state.list_mdApprovalOptions = [];
      state.loading_listMdApprovalOption = true;
    },
    [getMdApprovalHierarchy.fulfilled]: (state, action) => {
      state.list_mdApprovalOptions = action.payload;
      state.loading_listMdApprovalOption = false;
    },
    [getMdApprovalHierarchy.rejected]: (state) => {
      state.list_mdApprovalOptions = [];
      state.loading_listMdApprovalOption = false;
    },

    /** Get Multi Destination Detail Approval Hierarchy */
    [getDetailMdApprovalHierarchy.pending]: (state) => {
      state.list_mdApprovalHierarchyDetail = [];
      state.loading_listMdApprovalHierarchyDetail = true;
    },
    [getDetailMdApprovalHierarchy.fulfilled]: (state, action) => {
      state.list_mdApprovalHierarchyDetail = action.payload;
      state.loading_listMdApprovalHierarchyDetail = false;
    },
    [getDetailMdApprovalHierarchy.rejected]: (state) => {
      state.list_mdApprovalHierarchyDetail = [];
      state.loading_listMdApprovalHierarchyDetail = false;
    },

    /** Get Multi Destination Attachment Category */
    [getMdAttachmentCategory.pending]: (state) => {
      state.loading = true;
    },
    [getMdAttachmentCategory.fulfilled]: (state, action) => {
      state.data_mdAttachmentCategory = action.payload;
      state.loading = false;
    },
    [getMdAttachmentCategory.rejected]: (state) => {
      state.data_mdAttachmentCategory = [];
      state.loading = false;
    },

    /** Get Multi Destination Account Standard */
    [getMdAccountStandard.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listMdAccountStandard = true;
      }
    },
    [getMdAccountStandard.fulfilled]: (state, action) => {
      state.loading_listMdAccountStandard = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_mdAccountStandard.map((item) => item.accountId));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.accountId));

          state.list_mdAccountStandard = [
            ...state.list_mdAccountStandard,
            ...filteredResult,
          ];
        }
        else
          state.list_mdAccountStandard = result;
      }

      state.pagination_mdAccountStandard = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getMdAccountStandard.rejected]: (state, action) => {
      state.loading_listMdAccountStandard = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_mdAccountStandard = [];
        state.pagination_mdAccountStandard = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Get Multi Destination Attachment */
    [getMultiDestinationAttachment.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading_detailMdDetailAttachment = true;
      }
    },
    [getMultiDestinationAttachment.fulfilled]: (state, action) => {
      state.loading_detailMdDetailAttachment = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_mdDetailAttachment.map((item) => item.id));
          const filteredResult = result.filter((resultItem) => !currentIds.has(resultItem.id));

          state.list_mdDetailAttachment = [
            ...state.list_mdDetailAttachment,
            ...filteredResult,
          ];
        }
        else
          state.list_mdDetailAttachment = result;
      }

      state.pagination_mdDetailAttachment = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      }
    },
    [getMultiDestinationAttachment.rejected]: (state, action) => {
      state.loading_detailMdDetailAttachment = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_mdDetailAttachment = [];
        state.pagination_mdDetailAttachment = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 10,
        }
      }
    },

    /** Approve or Reject Multi Destination */
    [approveOrRejectMultiDestination.pending]: (state) => {
      state.loading_approveRejectMd = true;
    },
    [approveOrRejectMultiDestination.fulfilled]: (state) => {
      state.loading_approveRejectMd = false;
    },
    [approveOrRejectMultiDestination.rejected]: (state) => {
      state.loading_approveRejectMd = false;
    },

    /** Approve or Reject Inactive Multi Destination */
    [approveOrRejectInactiveMultiDestination.pending]: (state) => {
      state.loading_approveRejectMd = true;
    },
    [approveOrRejectInactiveMultiDestination.fulfilled]: (state) => {
      state.loading_approveRejectMd = false;
    },
    [approveOrRejectInactiveMultiDestination.rejected]: (state) => {
      state.loading_approveRejectMd = false;
    },

    /** Approve or Reject All Inactive Multi Destination */
    [approveOrRejectAllMultiDestination.pending]: (state) => {
      state.loading_approveRejectMd = true;
    },
    [approveOrRejectAllMultiDestination.fulfilled]: (state) => {
      state.loading_approveRejectMd = false;
    },
    [approveOrRejectAllMultiDestination.rejected]: (state) => {
      state.loading_approveRejectMd = false;
    },

    /** Inactivate Multi Destination Attachment */
    [inactivateMultiDestination.pending]: (state) => {
      state.loading = true;
    },
    [inactivateMultiDestination.fulfilled]: (state) => {
      state.loading = false;
    },
    [inactivateMultiDestination.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Multi Destination Approval History */
    [getMdApprovalHistory.pending]: (state) => {
      state.loading = true;
    },
    [getMdApprovalHistory.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_mdApprovalHistory = action.payload;
    },
    [getMdApprovalHistory.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Multi Destination Column API  */
    [getMdColumnApi.pending]: (state) => {
      state.loading = true;
    },
    [getMdColumnApi.fulfilled]: (state, action) => {
      state.data_globalTypeColumn = action.payload;
      state.loading = false;
    },
    [getMdColumnApi.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Multi Destination Condition API  */
    [getMdConditionApi.pending]: (state) => {
      state.loading = true;
    },
    [getMdConditionApi.fulfilled]: (state, action) => {
      state.data_globalTypeCondition = action.payload;
      state.loading = false;
    },
    [getMdConditionApi.rejected]: (state) => {
      state.loading = false;
    },

    /** Get Multi Destination Operator API  */
    [getMdOperatorApi.pending]: (state) => {
      state.loading = true;
    },
    [getMdOperatorApi.fulfilled]: (state, action) => {
      state.data_globalTypeOperator = action.payload;
      state.loading = false;
    },
    [getMdOperatorApi.rejected]: (state) => {
      state.loading = false
    },
  },
});
const { reducer } = multiDestinationSlice;
export default reducer;
