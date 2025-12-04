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
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  isFailed: false,
  isSuccess: false,
  message: "",
  loading: false,
};

export const getAllEfakturCodePaginate = createAsyncThunk(
  "GET_ALL_EFAKTUR_CODE_PAGINATE",
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    const searchParams = search === undefined ? "" : search;
    const sortParams =
      sort === undefined || sort === "" ? "createdDate~desc" : sort;
    try {
      const url = `/v1/dbs/api/faktur-code/list?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
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

export const getDetailEfakturCode = createAsyncThunk(
  "GET_DETAIL_EFAKTUR_CODE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/faktur-code/detail/${id}`;
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
  "GET_APPROVAL_HIERARCHY_LIST",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/faktur-code/approval-hierarcy-list`;
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
  "GET_APPROVAL_HIERARCHY_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/faktur-code/apphier-detail/${id}`;
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
  "GET_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/faktur-code/approval-history/${id}`;
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

export const uploadAttachment = createAsyncThunk(
  "UPLOAD_ATTACHMENT_EFAKTUR_CODE",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/faktur-code/create-attachment`;
      const formData = new FormData();
      formData.append("files", body.files);
      formData.append("categoryId", body.categoryId);
      formData.append("referenceId", body.referenceId);

      const response = await ratingBillingHttpService.createData(url, formData);
      const successBody = {
        title: "Successful",
        description: "Attachment has been uploaded successfully.",
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
  "GET_CATEGORY_LIST",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/faktur-code/category-list`;
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

export const createEfakturCode = createAsyncThunk(
  "CREATE_EFAKTUR_CODE",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/faktur-code/save";
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

export const updateEfakturCode = createAsyncThunk(
  "UPDATE_EFAKTUR_CODE",
  async ({ body, id }, thunkApi) => {
    try {
      const url = `/v1/dbs/api/faktur-code/update/${id}`;
      const response = await ratingBillingHttpService.updateData(url, body);
      const successMessage = {
        title: "Successful",
        description: `Your data has been ${
          body.isSubmit === false ? "updated" : "submitted"
        }.`,
      };
      thunkApi.dispatch(showModalSuccess(successMessage));
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

export const inactiveEfakturCode = createAsyncThunk(
  "INACTIVE_EFAKTUR_CODE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/faktur-code/inactive`;
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

export const approveRejectEfakturCode = createAsyncThunk(
  "APPROVE_REJECT_EFAKTUR_CODE",
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/faktur-code/${id}/approve`;
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

export const approveRejectInactiveEfakturCode = createAsyncThunk(
  "APPROVE_REJECT_INACTIVE_EFAKTUR_CODE",
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/faktur-code/${id}/approval-inactive`;
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

export const downloadEfakturCodeAttachment = createAsyncThunk(
  "DOWNLOAD_EFAKTUR_CODE_ATTACHMENT",
  async ({ id }, { rejectWithValue }) => {
    try {
      const url = `/v1/dbs/api/faktur-code/download-attachment/${id}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (err) {
      rejectWithValue(err);
    }
  }
);

export const downloadEfakturCode = createAsyncThunk(
  "DOWNLOAD_EFAKTUR_CODE",
  async ({ sort, page, pageSize, search }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/faktur-code/download?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_EFAKTUR_CODE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

const efakturCodeSlice = createSlice({
  name: "masterEfakturCode",
  initialState,
  reducers: {
    resetEfakturCodeState: (state) => {
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
      .addCase(getAllEfakturCodePaginate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllEfakturCodePaginate.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getAllEfakturCodePaginate.rejected, (state) => {
        state.loading = false;
      })
      // get detail
      .addCase(getDetailEfakturCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDetailEfakturCode.fulfilled, (state, action) => {
        state.data_detail = action.payload;
        state.loading = false;
      })
      .addCase(getDetailEfakturCode.rejected, (state) => {
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
      // create
      .addCase(createEfakturCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEfakturCode.fulfilled, (state) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(createEfakturCode.rejected, (state, action) => {
        state.isFailed = true;
        state.loading = false;
        state.message = action.payload;
      })
      // update
      .addCase(updateEfakturCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEfakturCode.fulfilled, (state) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(updateEfakturCode.rejected, (state, action) => {
        state.isFailed = true;
        state.loading = false;
        state.message = action.payload;
      })
      // inactive
      .addCase(inactiveEfakturCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(inactiveEfakturCode.fulfilled, (state) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(inactiveEfakturCode.rejected, (state, action) => {
        state.isFailed = true;
        state.loading = false;
        state.message = action.payload;
      })
      // approve reject
      .addCase(approveRejectEfakturCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveRejectEfakturCode.fulfilled, (state) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(approveRejectEfakturCode.rejected, (state, action) => {
        state.isFailed = true;
        state.loading = false;
        state.message = action.payload;
      })
      // approve reject inactive
      .addCase(approveRejectInactiveEfakturCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveRejectInactiveEfakturCode.fulfilled, (state) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(approveRejectInactiveEfakturCode.rejected, (state, action) => {
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
      .addCase(downloadEfakturCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadEfakturCode.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadEfakturCode.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      });
  },
});

export const { resetEfakturCodeState } = efakturCodeSlice.actions;
const { reducer } = efakturCodeSlice;
export default reducer;
