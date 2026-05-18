import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showModalError, showModalSuccess } from "../../general_slice";
import accountManagementService from "../../../services/account_management/accountManagementService";

const initialState = {
  dataWarrantyInfo: {},        // WARRANTY INFORMATION list response
  dataWarrantyTerm: {},        // WARRANTY TERM list response
  dataDetail: {},              // single warranty term detail
  dataApprovalHistory: {},     // approval history modal data
  dataListAppHierId: [],       // approval hierarchies for inactivate
  dataListAppHierDetail: [],   // hierarchy detail for inactivate
  dataListAppHierIdForm: [],   // approval hierarchies for create form
  dataListAppHierDetailForm: [], // hierarchy detail for create form
  dataAttachmentCategory: [],  // attachment categories for create form
  loading: false,
  loadingDownload: false,
  message: "",
};

// TODO: confirm endpoint URL
export const getListWarrantyInfo = createAsyncThunk(
  "GET_LIST_WARRANTY_INFO",
  async (idSA, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/warranty/list-warranty-info/${idSA}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Warranty term Info
export const getListWarrantyTermPaging = createAsyncThunk(
  "GET_LIST_WARRANTY_TERM_PAGING",
  async ({ id, page = 1, size = 10, sort = "createdDate~desc", body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/warranty-term/list/${id}?page=${page}&size=${size}&sort=${sort}`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// TODO: confirm endpoint URL
export const downloadWarrantyTermList = createAsyncThunk(
  "DOWNLOAD_WARRANTY_TERM_LIST",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/warranty-term/download/${id}`;
      const response = await accountManagementService.downloadData(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// TODO: confirm endpoint URL
export const approvalWarrantyTerm = createAsyncThunk(
  "APPROVAL_WARRANTY_TERM",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/warranty-term/approve`;
      const response = await accountManagementService.activationWithRemark(url, body);
      const successBody = {
        title: "Successful",
        description: `Your data has been ${body.action === "APPROVE" ? "approved" : "rejected"}.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || error.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${body.action === "APPROVE" ? "approved" : "rejected"}. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// TODO: confirm endpoint URL
export const createWarrantyTerm = createAsyncThunk(
  "CREATE_WARRANTY_TERM",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/warranty-term/create`;
      const response = await accountManagementService.createData(url, body);
      const successBody = {
        title: "Successful",
        description: `Your data has been ${body?.flag === 1 ? "created" : "submitted"}.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${body?.flag === 1 ? "created" : "submitted"}. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// TODO: confirm endpoint URL
export const updateWarrantyTerm = createAsyncThunk(
  "UPDATE_WARRANTY_TERM",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/warranty-term/update`;
      const response = await accountManagementService.createData(url, body);
      const successBody = {
        title: "Successful",
        description: `Your data has been ${body?.flag === 1 ? "updated" : "submitted"}.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${body?.flag === 1 ? "updated" : "submitted"}. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// TODO: confirm endpoint URL
export const getDetailWarrantyTerm = createAsyncThunk(
  "GET_DETAIL_WARRANTY_TERM",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/warranty-term/detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// TODO: confirm endpoint URL
export const getApprovalHistoryWarranty = createAsyncThunk(
  "GET_APPROVAL_HISTORY_WARRANTY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/warranty-term/approval-history/${id}`;
      const response = await accountManagementService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// TODO: confirm endpoint URL
export const getListAppHierWarranty = createAsyncThunk(
  "GET_LIST_APP_HIER_WARRANTY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/warranty-term/approval-hierarchies`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// TODO: confirm endpoint URL
export const getListAppHierDetailWarranty = createAsyncThunk(
  "GET_LIST_APP_HIER_DETAIL_WARRANTY",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/warranty-term/approval-hierarchy/${id}`;
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
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// TODO: confirm endpoint URL
export const getListAppHierWarrantyInactive = createAsyncThunk(
  "GET_LIST_APP_HIER_WARRANTY_INACTIVE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/warranty-term/approval-hierarchies`;
      const response = await accountManagementService.getAll(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// TODO: confirm endpoint URL
export const getListAppHierDetailWarrantyInactive = createAsyncThunk(
  "GET_LIST_APP_HIER_DETAIL_WARRANTY_INACTIVE",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/warranty-term/get-approval-hierarchies/${id}`;
      const response = await accountManagementService.getAll(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// TODO: confirm endpoint URL
export const inactiveWarrantyTerm = createAsyncThunk(
  "INACTIVE_WARRANTY_TERM",
  async ({ data }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/warranty-term/inactivate`;
      const response = await accountManagementService.activationWithRemark(url, data);
      const successBody = {
        title: "Successful",
        description: "Your data has been submitted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || error.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not submitted. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// TODO: confirm endpoint URL
export const deleteDraftWarrantyTerm = createAsyncThunk(
  "DELETE_DRAFT_WARRANTY_TERM",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/warranty-term/delete/${id}`;
      const response = await accountManagementService.deleteData(url);
      const successBody = {
        title: "Successful",
        description: "Your data has been deleted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || error.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not deleted. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getListAttachmentCategory = createAsyncThunk(
  "GET_LIST_ATTACHMENT_CATEGORY_WARRANTY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/warranty-term/attachment-category`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((category) => ({
        glbTypeValId: category?.id,
        name: category?.text,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

const saWarrantySlice = createSlice({
  name: "saWarranty",
  initialState,
  extraReducers: {
    // Get List Warranty Info
    [getListWarrantyInfo.pending]: (state) => {
      state.loading = true;
    },
    [getListWarrantyInfo.fulfilled]: (state, action) => {
      state.dataWarrantyInfo = action.payload;
      state.loading = false;
    },
    [getListWarrantyInfo.rejected]: (state, action) => {
      state.dataWarrantyInfo = {};
      state.loading = false;
      state.message = action.error.message;
    },
    // Get List Warranty Term Paging
    [getListWarrantyTermPaging.pending]: (state) => {
      state.loading = true;
    },
    [getListWarrantyTermPaging.fulfilled]: (state, action) => {
      state.dataWarrantyTerm = action.payload;
      state.loading = false;
    },
    [getListWarrantyTermPaging.rejected]: (state, action) => {
      state.dataWarrantyTerm = {};
      state.loading = false;
      state.message = action.error.message;
    },
    // Download Warranty Term List — uses loadingDownload, NOT loading
    [downloadWarrantyTermList.pending]: (state) => {
      state.loadingDownload = true;
    },
    [downloadWarrantyTermList.fulfilled]: (state) => {
      state.loadingDownload = false;
    },
    [downloadWarrantyTermList.rejected]: (state, action) => {
      state.loadingDownload = false;
      state.message = action.error.message;
    },
    // Approval Warranty Term
    [approvalWarrantyTerm.pending]: (state) => {
      state.loading = true;
    },
    [approvalWarrantyTerm.fulfilled]: (state) => {
      state.loading = false;
    },
    [approvalWarrantyTerm.rejected]: (state, action) => {
      state.loading = false;
      state.message = action.error.message;
    },
    // Create Warranty Term
    [createWarrantyTerm.pending]: (state) => {
      state.loading = true;
    },
    [createWarrantyTerm.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [createWarrantyTerm.rejected]: (state, action) => {
      state.loading = false;
      state.message = action.error.message;
    },
    // Update Warranty Term
    [updateWarrantyTerm.pending]: (state) => {
      state.loading = true;
    },
    [updateWarrantyTerm.fulfilled]: (state) => {
      state.loading = false;
    },
    [updateWarrantyTerm.rejected]: (state, action) => {
      state.loading = false;
      state.message = action.error.message;
    },
    // Get Detail Warranty Term
    [getDetailWarrantyTerm.pending]: (state) => {
      state.loading = true;
    },
    [getDetailWarrantyTerm.fulfilled]: (state, action) => {
      state.dataDetail = action.payload;
      state.loading = false;
    },
    [getDetailWarrantyTerm.rejected]: (state, action) => {
      state.dataDetail = {};
      state.loading = false;
      state.message = action.error.message;
    },
    // Get Approval History Warranty
    [getApprovalHistoryWarranty.pending]: (state) => {
      state.loading = true;
    },
    [getApprovalHistoryWarranty.fulfilled]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loading = false;
    },
    [getApprovalHistoryWarranty.rejected]: (state, action) => {
      state.dataApprovalHistory = {};
      state.loading = false;
      state.message = action.error.message;
    },
    // Get List AppHier Warranty (for create form)
    [getListAppHierWarranty.pending]: (state) => {
      state.loading = true;
    },
    [getListAppHierWarranty.fulfilled]: (state, action) => {
      state.dataListAppHierIdForm = action.payload;
      state.loading = false;
    },
    [getListAppHierWarranty.rejected]: (state, action) => {
      state.dataListAppHierIdForm = [];
      state.loading = false;
      state.message = action.error.message;
    },
    // Get List AppHier Detail Warranty (for create form)
    [getListAppHierDetailWarranty.pending]: (state) => {
      state.loading = true;
    },
    [getListAppHierDetailWarranty.fulfilled]: (state, action) => {
      state.dataListAppHierDetailForm = action.payload;
      state.loading = false;
    },
    [getListAppHierDetailWarranty.rejected]: (state, action) => {
      state.dataListAppHierDetailForm = [];
      state.loading = false;
      state.message = action.error.message;
    },
    // Get List AppHier Warranty Inactive
    [getListAppHierWarrantyInactive.pending]: (state) => {
      state.loading = true;
    },
    [getListAppHierWarrantyInactive.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    [getListAppHierWarrantyInactive.rejected]: (state, action) => {
      state.dataListAppHierId = [];
      state.loading = false;
      state.message = action.error.message;
    },
    // Get List AppHier Detail Warranty Inactive
    [getListAppHierDetailWarrantyInactive.pending]: (state) => {
      state.loading = true;
    },
    [getListAppHierDetailWarrantyInactive.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },
    [getListAppHierDetailWarrantyInactive.rejected]: (state, action) => {
      state.dataListAppHierDetail = [];
      state.loading = false;
      state.message = action.error.message;
    },
    // Inactive Warranty Term
    [inactiveWarrantyTerm.pending]: (state) => {
      state.loading = true;
    },
    [inactiveWarrantyTerm.fulfilled]: (state) => {
      state.loading = false;
    },
    [inactiveWarrantyTerm.rejected]: (state) => {
      state.loading = false;
    },
    // Delete Draft Warranty Term
    [deleteDraftWarrantyTerm.pending]: (state) => {
      state.loading = true;
    },
    [deleteDraftWarrantyTerm.fulfilled]: (state) => {
      state.loading = false;
    },
    [deleteDraftWarrantyTerm.rejected]: (state) => {
      state.loading = false;
    },
    // Get List Attachment Category
    [getListAttachmentCategory.pending]: (state) => {
      state.loading = true;
    },
    [getListAttachmentCategory.fulfilled]: (state, action) => {
      state.dataAttachmentCategory = action.payload;
      state.loading = false;
    },
    [getListAttachmentCategory.rejected]: (state, action) => {
      state.dataAttachmentCategory = [];
      state.loading = false;
      state.message = action.error.message;
    },
  },
});

export default saWarrantySlice.reducer;
