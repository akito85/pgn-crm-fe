import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import { setBodyError, showModalError, showModalSuccess, validateError } from "../../general_slice";

const initialState = {
  loading: false,
  data_multiDestination: [],
  data_mdApprovalHierarchy: [],
  detail_mdApprovalHierarchy: [],
  data_mdAttachmentCategory: [],
  data_mdAccountStandard: [],
  detail_multiDestination: {},
  data_multiDestinationAttachment: [],
  data_mdApprovalHistory: {},
  data_globalTypeCondition: [],
  data_globalTypeOperator: [],
  data_globalTypeColumn: [],
};

export const getMultiDestination = createAsyncThunk(
  "GET_MULTI_DESTINATION",
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/multi-destination/list/${id}`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body, {
          headers: { "Accept": "application/json, text/plain, */*" }
        });
      return response.data;
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
      // const createUrl = "/v1/dbs/api/multi-destination/create";
      // const response = await accountManagementService.createData(createUrl, createBody);

      // const { id } = response.data;

      // const uploadUrl = `/v1/dbs/api/multi-destination/upload-attachment`;

      // const uploadPromises = attachments.map((attachment) => accountManagementService.uploadAttachment(uploadUrl, {
      //   files:  attachment.file,
      //   category: attachment.fileCategoryId,
      //   refId: id,
      // }));

      // await Promise.all(uploadPromises);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${createBody?.action === "DRAFT" ? 'drafted' : 'submitted'}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody))
      // return response.data;
      return {};
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
          description: `Your data was not ${createBody?.action === "DRAFT" ? 'drafted' : 'submitted'}. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${createBody?.action === "DRAFT" ? 'drafted' : 'submitted'}. An unknown error occured.`
        }
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const updateMultiDestination = createAsyncThunk(
  "UPDATE_MULTI_DESTINATION",
  async ({ id, body: updateBody, attachments = [] }, thunkAPI) => {
    try {
      // const updateUrl = `/v1/dbs/api/multi-destination/${id}`;
      // const response = await accountManagementService.updateData(updateUrl, updateBody);

      // const uploadUrl = `/v1/dbs/api/multi-destination/upload-attachment`;

      // const uploadPromises = attachments.map((attachment) => accountManagementService.uploadAttachment(
      //   uploadUrl,
      //   {
      //     files:  attachment.file,
      //     category: attachment.fileCategoryId,
      //     refId: id,
      //   }
      // ));

      // await Promise.all(uploadPromises);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${updateBody?.action === "DRAFT" ? 'drafted' : 'updated'}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody))
      // return response.data;
      return {};
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
          description: `Your data was not ${updateBody?.action === "DRAFT" ? 'drafted' : 'updated'}. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${updateBody?.action === "DRAFT" ? 'drafted' : 'submitted'}. An unknown error occured.`
        }
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDetailMultiDestination = createAsyncThunk(
  "GET_DETAIL_MULTI_DESTINATION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/multi-destination/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getMdApprovalHierarchy = createAsyncThunk(
  "GET_MD_APPROVAL_HIERARCHY",
  async (thunkAPI) => {
    try {
      // const url = `/v1/dbs/api/multi-destination/approval-hierarchies`;
      // const response = await accountManagementService.getAll(url);
      // return response.data;
      return [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getDetailMdApprovalHierarchy = createAsyncThunk(
  "GET_DETAIL_MD_APPROVAL_HIERARCHY",
  async ({ id }, thunkAPI) => {
    try {
      // const url = `/v1/dbs/api/multi-destination/approval-hierarchy/${id}`;
      // const response = await accountManagementService.getDetail(url);
      // return response.data;
      return {};
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getMdAttachmentCategory = createAsyncThunk(
  "GET_MD_ATTACHMENT_CATEGORY",
  async (thunkAPI) => {
    try {
      // const url = `/v1/dbs/api/multi-destination/attachment-category`;
      // const response = await accountManagementService.getAll(url);
      // return response.data;
      return [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getMdAccountStandard = createAsyncThunk(
  "GET_MD_ACCOUNT_STANDARD",
  async ({ page, pageSize, sort, search, id }, thunkAPI) => {
    try {
      // const searchParams = search === undefined ? "" : search;

      // const sortParams =
      //   sort === undefined || sort === "" ? "createdDate~desc" : sort;
      // const url = `/v1/dbs/api/multi-destination/list-account/${id}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      // const response = await accountManagementService.getPagination(url);
      // return response.data;
      return {};
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const approveOrRejectMultiDestination = createAsyncThunk(
  "APPROVE_OR_REJECT_MULTI_DESTINATION",
  async ({ body, action }, thunkAPI) => {
    try {
      // const url = "/v1/dbs/api/multi-destination/approve";
      // const response = await accountManagementService.activationWithRemark(url, body);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "approve" ? "approved" : "rejected"}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody))
      // return response.data;
      return {};
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

export const approveOrRejectInactiveMultiDestination = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_MULTI_DESTINATION",
  async ({ body, action }, thunkAPI) => {
    try {
      // const url = "/v1/dbs/api/multi-destination/approve-inactive";
      // const response = await accountManagementService.activationWithRemark(url, body);

      const successBody = {
        title: `Successful`,
        description: `Your data has been ${action === "approve" ? "approved" : "rejected"}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody))
      // return response.data;
      return {};
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

export const approveOrRejectAllMultiDestination = createAsyncThunk(
  "APPROVE_OR_REJECT_ALL_MULTI_DESTINATION",
  async ({ body, inactiveBody, action }, thunkAPI) => {
    try {
      // const url = "/v1/dbs/api/multi-destination/approve";
      // const inactiveUrl = "/v1/dbs/api/multi-destination/approve-inactive";
      
      // await Promise.all([
      //   body.length ? accountManagementService.activationWithRemark(url, body, {
      //     headers: {
      //       "Accept": "application/json"
      //     }
      //   }) : null,
      //   inactiveBody.length ? accountManagementService.activationWithRemark(inactiveUrl, inactiveBody, {
      //     headers: {
      //       "Accept": "application/json"
      //     }
      //   }) : null,
      // ]);

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
      if (Math.floor((error.response.data.code || 0) / 100) !== 4)
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
      // const url = "/v1/dbs/api/multi-destination/inactive";
      // const response = await accountManagementService.activationWithRemark(url, body);

      const successBody = {
        title: `Successful`,
        description: `Your data has been submitted`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody))
      // return response.data;
      return {};
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

export const downloadMultiDestination = createAsyncThunk(
  "DOWNLOAD_MULTI_DESTINATION",
  async ({ body, id, }, thunkAPI) => {
    try {
      // const url = `/v1/dbs/api/multi-destination/export-excel/${id}`;
      // const response = await accountManagementService.downloadDataAdvanced(url, body);
      // return response;
      return null;
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
      // const url = `/v1/dbs/api/multi-destination/approval-history/${id}`;
      // const response = await accountManagementService.getDetail(url);
      // return Array.isArray(response.data) ? null : response.data;
      return {};
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
  async (thunkAPI) => {
    try {
      // const url = "/v1/dbs/api/multi-destination/list-search-column";
      // const response = await accountManagementService.getAll(url);
      // return response.data;
      return [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getMdConditionApi = createAsyncThunk(
  "GET_MD_CONDITION_API",
  async (thunkAPI) => {
    try {
      // const url = "/v1/dbs/api/multi-destination/list-search-condition";
      // const response = await accountManagementService.getAll(url);
      // return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const getMdOperatorApi = createAsyncThunk(
  "GET_MD_OPERATOR_API",
  async (thunkAPI) => {
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
    [getMultiDestination.pending]: (state) => {
      state.loading = true;
    },
    [getMultiDestination.fulfilled]: (state, action) => {
      state.data_multiDestination = action.payload;
      state.loading = false;
    },
    [getMultiDestination.rejected]: (state) => {
      state.data_multiDestination = [];
      state.loading = false;
    },

    /** Get Detail Multi Destination */
    [getDetailMultiDestination.pending]: (state, action) => {
      state.detail_multiDestination = action.payload;
      state.loading = true;
    },
    [getDetailMultiDestination.fulfilled]: (state, action) => {
      state.detail_multiDestination = action.payload;
      state.loading = false;
    },
    [getDetailMultiDestination.rejected]: (state, action) => {
      state.detail_multiDestination = action.payload;
      state.loading = false;
    },

    /** Create Multi Destination */
    [createMultiDestination.pending]: (state) => {
      state.loading = true;
    },
    [createMultiDestination.fulfilled]: (state) => {
      state.loading = false;
    },
    [createMultiDestination.pending]: (state) => {
      state.loading = false;
    },

    /** Update Multi Destination */
    [updateMultiDestination.pending]: (state) => {
      state.loading = true;
    },
    [updateMultiDestination.fulfilled]: (state) => {
      state.loading = false;
    },
    [updateMultiDestination.pending]: (state) => {
      state.loading = false;
    },

    /** Get Multi Destination Approval Hierarchy */
    [getMdApprovalHierarchy.pending]: (state) => {
      state.loading = true;
    },
    [getMdApprovalHierarchy.fulfilled]: (state, action) => {
      state.data_mdApprovalHierarchy = action.payload;
      state.loading = false;
    },
    [getMdApprovalHierarchy.rejected]: (state) => {
      state.data_mdApprovalHierarchy = [];
      state.loading = false;
    },

    /** Get Multi Destination Detail Approval Hierarchy */
    [getDetailMdApprovalHierarchy.pending]: (state) => {
      state.loading = true;
    },
    [getDetailMdApprovalHierarchy.fulfilled]: (state, action) => {
      state.detail_mdApprovalHierarchy = action.payload;
      state.loading = false;
    },
    [getDetailMdApprovalHierarchy.rejected]: (state) => {
      state.detail_mdApprovalHierarchy = [];
      state.loading = false;
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
    [getMdAccountStandard.pending]: (state) => {
      state.loading = true;
    },
    [getMdAccountStandard.fulfilled]: (state, action) => {
      state.data_mdAccountStandard = action.payload;
      state.loading = false;
    },
    [getMdAccountStandard.rejected]: (state) => {
      state.data_mdAccountStandard = [];
      state.loading = false;
    },

    /** Get Multi Destination Attachment */
    [getMultiDestinationAttachment.pending]: (state) => {
      state.loading = true;
    },
    [getMultiDestinationAttachment.fulfilled]: (state, action) => {
      state.data_multiDestinationAttachment = action.payload;
      state.loading = false;
    },
    [getMultiDestinationAttachment.rejected]: (state) => {
      state.data_multiDestinationAttachment = [];
      state.loading = false;
    },

    /** Approve or Reject Multi Destination */
    [approveOrRejectMultiDestination.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectMultiDestination.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectMultiDestination.rejected]: (state) => {
      state.loading = false;
    },

    /** Approve or Reject Inactive Multi Destination */
    [approveOrRejectInactiveMultiDestination.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectInactiveMultiDestination.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectInactiveMultiDestination.rejected]: (state) => {
      state.loading = false;
    },

    /** Approve or Reject All Inactive Multi Destination */
    [approveOrRejectAllMultiDestination.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectAllMultiDestination.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectAllMultiDestination.rejected]: (state) => {
      state.loading = false;
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
