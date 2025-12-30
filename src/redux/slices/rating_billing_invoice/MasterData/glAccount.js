import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  showModalError,
  showModalSuccess,
  setBodyError,
  validateError,
} from "../../general_slice";
import ratingBillingHttpService from "../../../services/ratingBillingHttpService";

const initialState = {
  data: [],
  data_detail: {},
  data_approval_hierarchy: [],
  data_approval_hierarchy_detail: [],
  data_approval_history: [],
  data_category_list: [],
  data_special_gl_list: [],
  data_approval_list: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  isFailed: false,
  isSuccess: false,
  message: "",
  loading: false,
};

export const getAllGLAccountPaginate = createAsyncThunk(
  "GET_ALL_GL_ACCOUNT_PAGINATE",
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    const searchParams = search === undefined ? "" : search;
    const sortParams =
      sort === undefined || sort === "" ? "createdDate~desc" : sort;
    try {
      const url = `/v1/dbs/api/gl-account?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getDetailGLAccount = createAsyncThunk(
  "GET_DETAIL_GL_ACCOUNT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gl-account/detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getApprovalHierarchyList = createAsyncThunk(
  "GET_APPROVAL_HIERARCHY_LIST_GL_ACCOUNT",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gl-account/approval-hierarcy-list`;
      const response = await ratingBillingHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getApprovalHierarchyDetail = createAsyncThunk(
  "GET_APPROVAL_HIERARCHY_DETAIL_GL_ACCOUNT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gl-account/apphier-detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_GL_ACCOUNT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gl-account/approval-history/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getSpecialGLList = createAsyncThunk(
  "GET_SPECIAL_GL_LIST",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gl-account/lov/special-gl`;
      const response = await ratingBillingHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const uploadAttachment = createAsyncThunk(
  "UPLOAD_ATTACHMENT_GL_ACCOUNT",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gl-account/create-attachment`;
      const formData = new FormData();
      formData.append("files", body.files);
      formData.append("categoryId", body.categoryId);
      formData.append("referenceId", body.referenceId);

      const response = await ratingBillingHttpService.createData(url, formData);
      // Don't show modal success here to avoid multiple modals in loop
      // Success will be shown from create/update GL Account action
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
            description: `Attachment upload failed. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error);
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getCategoryList = createAsyncThunk(
  "GET_CATEGORY_LIST_GL_ACCOUNT",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gl-account/category-list`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.map((item) => ({
        Id: item.id,
        text: item.text,
      }));
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createGLAccount = createAsyncThunk(
  "CREATE_GL_ACCOUNT",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/gl-account/create";
      const response = await ratingBillingHttpService.createData(url, body);
      // Don't show modal here, will be shown after attachment upload in component
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateGLAccount = createAsyncThunk(
  "UPDATE_GL_ACCOUNT",
  async ({ body, id }, thunkApi) => {
    try {
      const url = `/v1/dbs/api/gl-account/update/${id}`;
      const response = await ratingBillingHttpService.updateData(url, body);
      // Don't show modal here, will be shown after attachment upload in component
      return response?.data;
    } catch (response) {
      const message =
        (response.response &&
          response.response.data &&
          response.response.data.message) ||
        response.message ||
        response.toString();
      if (Math.floor((response.response?.data?.code || 0) / 100) === 4) {
        if (response.response.data.code === 419) {
          thunkApi.dispatch(setBodyError(response));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${
              body.isSubmit === false ? "updated" : "submitted"
            }. ${message}.`,
          };
          thunkApi.dispatch(showModalError(errorBody));
        }
        return thunkApi.rejectWithValue(response.response.data);
      }
      return thunkApi.rejectWithValue(response.response?.data);
    }
  }
);

export const inactiveGLAccount = createAsyncThunk(
  "INACTIVE_GL_ACCOUNT",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gl-account/inactive`;
      const response = await ratingBillingHttpService.createData(url, body);
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
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not submitted. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error);
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const approveRejectGLAccount = createAsyncThunk(
  "APPROVE_REJECT_GL_ACCOUNT",
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gl-account/${id}/approve`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successApprove = {
        title: `Successful`,
        description: `Your data has been ${
          body.action === "APPROVE" ? "approved" : "rejected"
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
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const approveRejectInactiveGLAccount = createAsyncThunk(
  "APPROVE_REJECT_INACTIVE_GL_ACCOUNT",
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gl-account/${id}/approval-inactive`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successApprove = {
        title: `Successful`,
        description: `Your data has been ${
          body.action === "APPROVE" ? "approved" : "rejected"
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
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const downloadGLAccountAttachment = createAsyncThunk(
  "DOWNLOAD_GL_ACCOUNT_ATTACHMENT",
  async ({ id }, { rejectWithValue }) => {
    try {
      const url = `/v1/dbs/api/gl-account/download-attachment/${id}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (err) {
      rejectWithValue(err);
    }
  }
);

export const downloadGLAccount = createAsyncThunk(
  "DOWNLOAD_GL_ACCOUNT",
  async ({ sort, page, pageSize, search }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/gl-account/download?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_GL_ACCOUNT",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getAllGLAccountApprovalList = createAsyncThunk(
  "GET_ALL_GL_ACCOUNT_APPROVAL_LIST",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gl-account/approval-gl-account-list`;
      const response = await ratingBillingHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const bulkApproveGLAccount = createAsyncThunk(
  "BULK_APPROVE_GL_ACCOUNT",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/gl-account/bulk-approve`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successBody = {
        title: "Successful",
        description: `Your data has been ${action}.`,
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
      if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${action}. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error);
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const glAccountSlice = createSlice({
  name: "glAccount",
  initialState,
  reducers: {
    resetGLAccountState: (state) => {
      state.data_detail = {};
      state.data_approval_hierarchy_detail = [];
      state.isFailed = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // get all
      .addCase(getAllGLAccountPaginate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllGLAccountPaginate.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getAllGLAccountPaginate.rejected, (state) => {
        state.loading = false;
      })
      // get detail
      .addCase(getDetailGLAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDetailGLAccount.fulfilled, (state, action) => {
        state.data_detail = action.payload;
        state.loading = false;
      })
      .addCase(getDetailGLAccount.rejected, (state) => {
        state.loading = false;
      })
      // get approval hierarchy list
      .addCase(getApprovalHierarchyList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getApprovalHierarchyList.fulfilled, (state, action) => {
        state.data_approval_hierarchy = action.payload;
        state.dataListAppHierId = action.payload;
        state.loading = false;
      })
      .addCase(getApprovalHierarchyList.rejected, (state) => {
        state.loading = false;
      })
      // get approval hierarchy detail
      .addCase(getApprovalHierarchyDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getApprovalHierarchyDetail.fulfilled, (state, action) => {
        state.data_approval_hierarchy_detail = action.payload;
        state.dataListAppHierDetail = action.payload;
        state.loading = false;
      })
      .addCase(getApprovalHierarchyDetail.rejected, (state) => {
        state.loading = false;
      })
      // get approval history
      .addCase(getApprovalHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getApprovalHistory.fulfilled, (state, action) => {
        state.data_approval_history = action.payload;
        state.loading = false;
      })
      .addCase(getApprovalHistory.rejected, (state) => {
        state.loading = false;
      })
      // get special GL list
      .addCase(getSpecialGLList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSpecialGLList.fulfilled, (state, action) => {
        state.data_special_gl_list = action.payload;
        state.loading = false;
      })
      .addCase(getSpecialGLList.rejected, (state) => {
        state.loading = false;
      })
      // create
      .addCase(createGLAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGLAccount.fulfilled, (state) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(createGLAccount.rejected, (state, action) => {
        state.isFailed = true;
        state.loading = false;
        state.message = action.payload;
      })
      // update
      .addCase(updateGLAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGLAccount.fulfilled, (state) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(updateGLAccount.rejected, (state, action) => {
        state.isFailed = true;
        state.loading = false;
        state.message = action.payload;
      })
      // inactive
      .addCase(inactiveGLAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(inactiveGLAccount.fulfilled, (state) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(inactiveGLAccount.rejected, (state, action) => {
        state.isFailed = true;
        state.loading = false;
        state.message = action.payload;
      })
      // approve reject
      .addCase(approveRejectGLAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveRejectGLAccount.fulfilled, (state) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(approveRejectGLAccount.rejected, (state, action) => {
        state.isFailed = true;
        state.loading = false;
        state.message = action.payload;
      })
      // approve reject inactive
      .addCase(approveRejectInactiveGLAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveRejectInactiveGLAccount.fulfilled, (state) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(approveRejectInactiveGLAccount.rejected, (state, action) => {
        state.isFailed = true;
        state.loading = false;
        state.message = action.payload;
      })
      // upload attachment
      .addCase(uploadAttachment.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadAttachment.fulfilled, (state) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(uploadAttachment.rejected, (state, action) => {
        state.isFailed = true;
        state.loading = false;
        state.message = action.payload;
      })
      // get category list
      .addCase(getCategoryList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategoryList.fulfilled, (state, action) => {
        state.data_category_list = action.payload;
        state.loading = false;
      })
      .addCase(getCategoryList.rejected, (state) => {
        state.loading = false;
      })
      // download
      .addCase(downloadGLAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadGLAccount.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadGLAccount.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })

      .addCase(downloadGLAccountAttachment.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadGLAccountAttachment.fulfilled, (state) => {
        state.loading = false;
        state.isSuccess = true;
      })
      .addCase(downloadGLAccountAttachment.rejected, (state, action) => {
        state.loading = false;
        state.isFailed = true;
        state.message = action.payload;
      })

      // get approval list
      .addCase(getAllGLAccountApprovalList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllGLAccountApprovalList.fulfilled, (state, action) => {
        state.loading = false;
        state.data_approval_list = action.payload;
      })
      .addCase(getAllGLAccountApprovalList.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })

      // bulk approve
      .addCase(bulkApproveGLAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(bulkApproveGLAccount.fulfilled, (state) => {
        state.loading = false;
        state.isSuccess = true;
      })
      .addCase(bulkApproveGLAccount.rejected, (state, action) => {
        state.loading = false;
        state.isFailed = true;
        state.message = action.payload;
      });
  },
});

export const { resetGLAccountState } = glAccountSlice.actions;
const { reducer } = glAccountSlice;
export default reducer;
