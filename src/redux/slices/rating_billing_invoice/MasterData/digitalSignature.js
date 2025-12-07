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
  data_list_employee: [],
  data_position_employee: [],
  isFailed: false,
  isSuccess: false,
  message: "",
  loading: false,
};

export const getAllDigitalSignaturePaginate = createAsyncThunk(
  "GET_ALL_DIGITAL_SIGNATURE_PAGINATE",
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    const searchParams = search === undefined ? "" : search;
    const sortParams =
      sort === undefined || sort === "" ? "createdDate~desc" : sort;
    try {
      const url = `/v1/dbs/api/signature/list?page=${page}&size=${pageSize}&sort=${sortParams}&searcsh=${searchParams}`;
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

export const getDetailDigitalSignature = createAsyncThunk(
  "GET_DETAIL_DIGITAL_SIGNATURE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/signature/detail/${id}`;
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
      const url = `/v1/dbs/api/signature/approval-hierarcy-list`;
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
      const url = `/v1/dbs/api/signature/apphier-detail/${id}`;
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
      const url = `/v1/dbs/api/signature/approval-history/${id}`;
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
  "UPLOAD_ATTACHMENT_DIGITAL_SIGNATURE",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/signature/create-attachment`;
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
      const url = `/v1/dbs/api/signature/category-list`;
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

export const createDigitalSignature = createAsyncThunk(
  "CREATE_DIGITAL_SIGNATURE",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/signature/create";
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

export const updateDigitalSignature = createAsyncThunk(
  "UPDATE_DIGITAL_SIGNATURE",
  async ({ body }, thunkApi) => {
    try {
      const url = `/v1/dbs/api/signature/update`;
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

export const inactiveDigitalSignature = createAsyncThunk(
  "INACTIVE_DIGITAL_SIGNATURE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/signature/inactive`;
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

export const approveRejectDigitalSignature = createAsyncThunk(
  "APPROVE_REJECT_DIGITAL_SIGNATURE",
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/signature/${id}/approve`;
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

export const approveRejectInactiveDigitalSignature = createAsyncThunk(
  "APPROVE_REJECT_INACTIVE_DIGITAL_SIGNATURE",
  async ({ id, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/signature/${id}/approval-inactive`;
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

export const downloadDigitalSignatureAttachment = createAsyncThunk(
  "DOWNLOAD_DIGITAL_SIGNATURE_ATTACHMENT",
  async ({ id }, { rejectWithValue }) => {
    try {
      const url = `/v1/dbs/api/signature/download-attachment/${id}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (err) {
      rejectWithValue(err);
    }
  }
);

export const downloadDigitalSignature = createAsyncThunk(
  "DOWNLOAD_DIGITAL_SIGNATURE",
  async ({ sort, page, pageSize, search }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/signature/download?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_DIGITAL_SIGNATURE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getListEmployee = createAsyncThunk(
  "GET_LIST_EMPLOYEE",
  async ({ search }, { rejectWithValue }) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const url = `/v1/dbs/api/signature/list-employee?searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getPositionEmployee = createAsyncThunk(
  "GET_POSITION_EMPLOYEE",
  async ({ employeeCode }, { rejectWithValue }) => {
    try {
      const url = `/v1/dbs/api/signature/position/${employeeCode}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const downloadDigitalSignatureFile = createAsyncThunk(
  "DOWNLOAD_DIGITAL_SIGNATURE_FILE",
  async ({ id }, { rejectWithValue }) => {
    try {
      const url = `/v1/dbs/api/signature/download-signature/${id}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (err) {
      rejectWithValue(err);
    }
  }
);

const digitalSignatureSlice = createSlice({
  name: "digitalSignature",
  initialState,
  reducers: {
    resetDigitalSignatureState: (state) => {
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
      .addCase(getAllDigitalSignaturePaginate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllDigitalSignaturePaginate.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getAllDigitalSignaturePaginate.rejected, (state) => {
        state.loading = false;
      })
      // get detail
      .addCase(getDetailDigitalSignature.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDetailDigitalSignature.fulfilled, (state, action) => {
        state.data_detail = action.payload;
        state.loading = false;
      })
      .addCase(getDetailDigitalSignature.rejected, (state) => {
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
      .addCase(createDigitalSignature.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDigitalSignature.fulfilled, (state) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(createDigitalSignature.rejected, (state, action) => {
        state.isFailed = true;
        state.loading = false;
        state.message = action.payload;
      })
      // update
      .addCase(updateDigitalSignature.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDigitalSignature.fulfilled, (state) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(updateDigitalSignature.rejected, (state, action) => {
        state.isFailed = true;
        state.loading = false;
        state.message = action.payload;
      })
      // inactive
      .addCase(inactiveDigitalSignature.pending, (state) => {
        state.loading = true;
      })
      .addCase(inactiveDigitalSignature.fulfilled, (state) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(inactiveDigitalSignature.rejected, (state, action) => {
        state.isFailed = true;
        state.loading = false;
        state.message = action.payload;
      })
      // approve reject
      .addCase(approveRejectDigitalSignature.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveRejectDigitalSignature.fulfilled, (state) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(approveRejectDigitalSignature.rejected, (state, action) => {
        state.isFailed = true;
        state.loading = false;
        state.message = action.payload;
      })
      // approve reject inactive
      .addCase(approveRejectInactiveDigitalSignature.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveRejectInactiveDigitalSignature.fulfilled, (state) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(
        approveRejectInactiveDigitalSignature.rejected,
        (state, action) => {
          state.isFailed = true;
          state.loading = false;
          state.message = action.payload;
        }
      )
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
      .addCase(downloadDigitalSignature.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadDigitalSignature.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadDigitalSignature.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })

      .addCase(downloadDigitalSignatureAttachment.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadDigitalSignatureAttachment.fulfilled, (state) => {
        state.loading = false;
        state.isSuccess = true;
      })
      .addCase(downloadDigitalSignatureAttachment.rejected, (state, action) => {
        state.loading = false;
        state.isFailed = true;
        state.message = action.payload;
      })

      // get list employee
      .addCase(getListEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(getListEmployee.fulfilled, (state, action) => {
        state.data_list_employee = action.payload;
        state.loading = false;
      })
      .addCase(getListEmployee.rejected, (state, action) => {
        state.loading = false;
        state.isFailed = true;
        state.message = action.payload;
      })

      // get position employee
      .addCase(getPositionEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPositionEmployee.fulfilled, (state, action) => {
        state.data_position_employee = action.payload;
        state.loading = false;
      })
      .addCase(getPositionEmployee.rejected, (state, action) => {
        state.loading = false;
        state.isFailed = true;
        state.message = action.payload;
      })

      // download digital signature file
      .addCase(downloadDigitalSignatureFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadDigitalSignatureFile.fulfilled, (state) => {
        state.loading = false;
        state.isSuccess = true;
      })
      .addCase(downloadDigitalSignatureFile.rejected, (state, action) => {
        state.loading = false;
        state.isFailed = true;
        state.message = action.payload;
      });
  },
});

export const { resetDigitalSignatureState } = digitalSignatureSlice.actions;
const { reducer } = digitalSignatureSlice;
export default reducer;
