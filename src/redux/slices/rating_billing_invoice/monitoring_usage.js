import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../general_slice";
import { errorMessage } from "../../../utils";

const initialState = {
  data: [],
  loading: false,
  data_list_usage: [],
  data_list_batch: [],
  data_approval: [],
  detail_batch: [],
  list_approval: [],
  list_approval_by_id: [],
  list_usage_type: [],
  data_upload: [],
  data_approve_reject: [],
  data_asset_type: [],
  data_account_number: [],
  data_source: [],
  data_approval_history: [],
  updatedData: [],
  deletedData: [],
};

export const updateSingleUsage = createAsyncThunk(
  "UPDATE_SINGLE_USAGE",
  async ({ recordId, data }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/usage/detail-batch/${recordId}`;
      const response = await ratingBillingHttpService.updateData(url, data);
      const successMessage = {
        title: "Successful",
        description: "Your data has been updated successfully.",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      const message =
        (response.response &&
          response.response.data &&
          response.response.data.message) ||
        response.message ||
        response.toString();
      const errorBody = {
        title: "Failed",
        data: response.response?.data?.data,
        description: `Failed to update data. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(response.response?.data);
    }
  }
);

export const deleteSingleUsage = createAsyncThunk(
  "DELETE_SINGLE_USAGE",
  async (recordId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/usage/detail-batch/${recordId}`;
      const response = await ratingBillingHttpService.deleteData(url);
      const successMessage = {
        title: "Successful",
        description: "Your data has been deleted successfully.",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return { recordId, data: response.data };
    } catch (response) {
      const message =
        (response.response &&
          response.response.data &&
          response.response.data.message) ||
        response.message ||
        response.toString();
      const errorBody = {
        title: "Failed",
        data: response.response?.data?.data,
        description: `Failed to delete data. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(response.response?.data);
    }
  }
);

export const deleteBatch = createAsyncThunk(
  "DELETE_BATCH",
  async (batchId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/usage/delete-batch/${batchId}`;
      const response = await ratingBillingHttpService.deleteData(url);
      const successMessage = {
        title: "Successful",
        description: "Batch has been deleted successfully.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return { batchId, data: response.data };
    } catch (response) {
      const message =
        (response.response &&
          response.response.data &&
          response.response.data.message) ||
        response.message ||
        response.toString();
      const errorBody = {
        title: "Failed",
        data: response.response?.data?.data,
        description: `Failed to delete batch. ${message}. Please try again.`,
        return: false,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(response.response?.data);
    }
  }
);

export const getListUsagePaginate = createAsyncThunk(
  "GET_MONITORING_USAGE_PAGINATE",
  async ({ search, page, pageSize, sort, isLoadMore = false }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/usage/paging?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return {
        ...response.data,
        isLoadMore, // Pass the flag to reducer
      };
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
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
export const getListBatchPaginate = createAsyncThunk(
  "GET_MONITORING_BATCH_PAGINATE",
  async ({ search, page, pageSize, sort, isLoadMore = false }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/usage/list-batch?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return {
        ...response.data,
        isLoadMore, // Pass the flag to reducer
      };
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
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// list approval
export const getListApproval = createAsyncThunk(
  "GET_LIST_APPROVAL",
  async ({ page, pageSize, isLoadMore = false }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/usage/get-approval?page=${page}&size=${pageSize}`;
      const response = await ratingBillingHttpService.getListPagination(url);
      return {
        ...response?.data,
        isLoadMore, // Pass the flag to reducer
      };
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
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getApprovalHierarchy = createAsyncThunk(
  "GET_APPROVAL_HIERARCHY",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "createdDate~desc";
      // const params = { searchParams, page, pageSize, sortParams };
      const url = `/v1/dbs/api/usage/list-available-approval?size=${pageSize}&search=${searchParams}&page=${page}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.getListPagination(url);
      return response?.data;
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
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getListApprovalById = createAsyncThunk(
  "GET_LIST_APPROVAL_BY_ID",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/usage/selectedapproval/${id}`;
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
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/usage/approval-history/${id}`;
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
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDetailBatch = createAsyncThunk(
  "GET_DETAIL_BATCH",
  async (
    { batchId, page, pageSize, search, sort, isLoadMore = false },
    thunkAPI
  ) => {
    try {
      const searchParams = search || "";
      const sortParams = sort || "createdDate~desc";
      const url = `/v1/dbs/api/usage/detail-batch/${batchId}?size=${pageSize}&searchs=${searchParams}&page=${page}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return {
        ...response.data,
        isLoadMore, // Pass the flag to reducer
      };
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
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getFormatUsageType = createAsyncThunk(
  "GET_FORMAT_USAGE_TYPE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/usage/format-usage-type";
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getAssetType = createAsyncThunk(
  "GET_ASSET_TYPE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/usage/assettype";
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getSource = createAsyncThunk("GET_SOURCE", async (thunkAPI) => {
  try {
    const url = "/v1/dbs/api/usage/list-source";
    const response = await ratingBillingHttpService.getDetail(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

export const getAccountNumber = createAsyncThunk(
  "GET_ACCOUNT_NUMBER",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/usage/account-number";
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const approveRejectData = createAsyncThunk(
  "APPROVE_REJECT_DATA",
  async (data, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/usage/approve-reject-usage";
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        data
      );
      const successMessage = {
        title: "Successfull",
        description: `Your data has been ${
          data?.action === "APPROVE" ? "approved" : "rejected"
        }`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      const message =
        (response.response &&
          response.response.data &&
          response.response.data.message) ||
        response.message ||
        response.toString();
      const errorBody = {
        title: "Failed",
        data: response.response.data.data,
        description: `Your data was not ${
          data?.action === "APPROVE" ? "approved" : "rejected"
        }. ${message}. Please try again.`,
        return: false,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const saveSubmitData = createAsyncThunk(
  "SAVE_SUBMIT_DATA",
  async (data, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/usage/save-usage";
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        data
      );
      const successMessage = {
        title: "Successful",
        description: `Your data has been ${
          data?.isSubmit ? "submitted" : "updated"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      const message =
        (response.response &&
          response.response.data &&
          response.response.data.message) ||
        response.message ||
        response.toString();

      // Custom handling untuk apphierId null error
      let errorDescription = `Your data was not ${
        data?.isSubmit ? "submitted" : "updated"
      }. ${message}. Please try again.`;

      if (
        message.toLowerCase().includes("apphierid") ||
        message.toLowerCase().includes("null")
      ) {
        errorDescription =
          "Please select an Approval Hierarchy in the Approval tab before submitting.";
      }

      const errorBody = {
        title: "Failed",
        data: response.response?.data?.data,
        description: errorDescription,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(response.response?.data);
    }
  }
);

export const getDownloadList = createAsyncThunk(
  "DOWNLOAD_MONITORING_USAGE_LIST",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/usage/download-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_MONITORING_USAGE_LIST",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const getDownloadTemplate = createAsyncThunk(
  "DOWNLOAD_MONITORING_USAGE_TEMPLATE",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/usage/download-template`;

      const response = await ratingBillingHttpService.downloadXlsx(
        url,
        "monitoring_usage_template"
      );

      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();

      thunkAPI.dispatch(
        validateError({
          error: error?.response,
          action: "DOWNLOAD_MONITORING_USAGE_TEMPLATE",
          back: false,
        })
      );

      const errorBody = {
        title: "Failed",
        description: `Failed to download template. ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));

      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getDownloadFailed = createAsyncThunk(
  "DOWNLOAD_MONITORING_USAGE_FAILED",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/usage/download-failed-data/${id}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_MONITORING_USAGE_FAILED",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const uploadMonitoringUsage = createAsyncThunk(
  "UPLOAD_MONITORING_USAGE",
  async (payload, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/usage/upload-validation";
      const onProgress = payload.onProgress;
      const formData = new FormData();
      formData.append("document", payload?.document);
      formData.append("calculationType", payload?.calculationType);
      const dataRequest = formData;
      const data = await ratingBillingHttpService.uploadAttachment(
        url,
        dataRequest,
        onProgress
      );
      const successMessage = {
        title: "Successfull",
        description: "Your data has been uploaded",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return data;
    } catch (e) {
      let message = errorMessage(e);
      const errorBody = {
        title: "Failed",
        description: message + ". Please try again!",
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(e?.response);
    }
  }
);

const monitoringUsageSlice = createSlice({
  name: "monitoring_usage",
  initialState,
  reducers: {
    setClearData: (state) => {
      state.data_upload = null;
      state.data_submit = null;
    },
    clearUpdated: (state) => {
      state.updatedData = [];
    },
    clearUpdatedDeleted: (state) => {
      state.updatedData = [];
      state.deletedData = [];
    },
  },
  extraReducers: (builder) => {
    // pagination monitoring usage list
    builder
      .addCase(getListUsagePaginate.pending, (state, action) => {
        // Only show loading on initial fetch, not on load more
        if (!action.meta.arg?.isLoadMore) {
          state.loading = true;
        }
      })
      .addCase(getListUsagePaginate.fulfilled, (state, action) => {
        state.loading = false;
        const newData = action.payload.result || [];
        const isLoadMore = action.payload.isLoadMore;

        // If it's load more, append data. Otherwise, replace data
        if (isLoadMore) {
          state.data_list_usage = {
            ...action.payload,
            result: [...(state.data_list_usage.result || []), ...newData],
          };
        } else {
          state.data_list_usage = action.payload;
        }
        state.data = state.data_list_usage;
      })
      .addCase(getListUsagePaginate.rejected, (state, action) => {
        state.loading = false;
        // Only clear data on initial fetch failure, not on load more failure
        if (!action.meta.arg?.isLoadMore) {
          state.data_list_usage = { result: [], page: {} };
          state.data = { result: [], page: {} };
        }
      });

    // pagination monitoring batch list
    builder
      .addCase(getListBatchPaginate.pending, (state, action) => {
        // Only show loading on initial fetch, not on load more
        if (!action.meta.arg?.isLoadMore) {
          state.loading = true;
        }
      })
      .addCase(getListBatchPaginate.fulfilled, (state, action) => {
        state.loading = false;
        const newData = action.payload.result || [];
        const isLoadMore = action.payload.isLoadMore;

        // If it's load more, append data. Otherwise, replace data
        if (isLoadMore) {
          state.data_list_batch = {
            ...action.payload,
            result: [...(state.data_list_batch.result || []), ...newData],
          };
        } else {
          state.data_list_batch = action.payload;
        }
        state.data = state.data_list_batch;
      })
      .addCase(getListBatchPaginate.rejected, (state, action) => {
        state.loading = false;
        // Only clear data on initial fetch failure, not on load more failure
        if (!action.meta.arg?.isLoadMore) {
          state.data_list_batch = { result: [], page: {} };
          state.data = { result: [], page: {} };
        }
      });

    // pagination monitoring approval list
    builder
      .addCase(getListApproval.pending, (state, action) => {
        // Only show loading on initial fetch, not on load more
        if (!action.meta.arg?.isLoadMore) {
          state.loading = true;
        }
      })
      .addCase(getListApproval.fulfilled, (state, action) => {
        state.loading = false;
        const newData = action.payload.result || [];
        const isLoadMore = action.payload.isLoadMore;

        // If it's load more, append data. Otherwise, replace data
        if (isLoadMore) {
          state.data_approval = {
            ...action.payload,
            result: [...(state.data_approval.result || []), ...newData],
          };
        } else {
          state.data_approval = action.payload;
        }
      })
      .addCase(getListApproval.rejected, (state, action) => {
        state.loading = false;
        // Only clear data on initial fetch failure, not on load more failure
        if (!action.meta.arg?.isLoadMore) {
          state.data_approval = { result: [], page: {} };
        }
      });

    // detail batch
    builder
      .addCase(getDetailBatch.pending, (state, action) => {
        if (!action.meta.arg?.isLoadMore) {
          state.loading = true;
        }
      })
      .addCase(getDetailBatch.fulfilled, (state, action) => {
        state.loading = false;

        const newData = action.payload.usageList?.result || [];
        const isLoadMore = action.payload.isLoadMore;

        if (isLoadMore) {
          state.detail_batch = {
            ...action.payload,
            usageList: {
              ...action.payload.usageList,
              result: [
                ...(state.detail_batch?.usageList?.result || []),
                ...newData,
              ],
            },
          };
        } else {
          state.detail_batch = action.payload;
        }
      })
      .addCase(getDetailBatch.rejected, (state, action) => {
        state.loading = false;
        if (!action.meta.arg?.isLoadMore) {
          state.detail_batch = {};
        }
      });
    builder
      .addCase(getDownloadList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDownloadList.fulfilled, (state, action) => {
        state.data_download = action.payload;
        state.loading = false;
      })
      .addCase(getDownloadList.rejected, (state, action) => {
        state.isFailed = true;
        state.data_download = action.payload;
        state.loading = false;
      });

    builder
      .addCase(getApprovalHierarchy.pending, (state) => {
        state.loading = true;
      })
      .addCase(getApprovalHierarchy.fulfilled, (state, action) => {
        state.list_approval = action.payload;
        state.loading = false;
      })
      .addCase(getApprovalHierarchy.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getListApprovalById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getListApprovalById.fulfilled, (state, action) => {
        state.list_approval_by_id = action.payload;
        state.loading = false;
      })
      .addCase(getListApprovalById.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(getFormatUsageType.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFormatUsageType.fulfilled, (state, action) => {
        state.list_usage_type = action.payload;
        state.loading = false;
      })
      .addCase(getFormatUsageType.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(uploadMonitoringUsage.pending, (state, action) => {
        state.data_upload = action.payload;
      })
      .addCase(uploadMonitoringUsage.fulfilled, (state, action) => {
        state.data_upload = action.payload;
        state.loading = false;
      })
      .addCase(uploadMonitoringUsage.rejected, (state, action) => {
        state.loading = false;
        state.data_upload = action.payload;
      });
    builder
      .addCase(deleteBatch.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBatch.fulfilled, (state, action) => {
        state.loading = false;
        // Remove batch dari list
        if (state.data_list_batch?.result) {
          state.data_list_batch.result = state.data_list_batch.result.filter(
            (item) => item.batchId !== action.payload.batchId
          );
          // Update total count
          if (state.data_list_batch.page?.totalElements) {
            state.data_list_batch.page.totalElements -= 1;
          }
          // IMPORTANT: Update state.data reference agar perubahan terlihat di UI
          state.data = state.data_list_batch;
        }
      })
      .addCase(deleteBatch.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(saveSubmitData.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveSubmitData.fulfilled, (state, action) => {
        state.loading = false;
        state.data_submit = action.payload;
      })
      .addCase(saveSubmitData.rejected, (state, action) => {
        state.loading = false;
        state.data_submit = action.payload;
      });
    builder
      .addCase(updateSingleUsage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSingleUsage.fulfilled, (state, action) => {
        state.loading = false;
        // Update data di detail_batch.usageList jika ada
        if (state.detail_batch?.usageList?.result) {
          const index = state.detail_batch.usageList.result.findIndex(
            (item) => item.recordId === action.meta.arg.recordId
          );
          if (index !== -1) {
            state.detail_batch.usageList.result[index] = {
              ...state.detail_batch.usageList.result[index],
              ...action.meta.arg.data,
              status: "SUCCESS",
            };
          }
        }
      })
      .addCase(updateSingleUsage.rejected, (state) => {
        state.loading = false;
      });

    // Delete single usage
    builder
      .addCase(deleteSingleUsage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSingleUsage.fulfilled, (state, action) => {
        state.loading = false;
        // Remove data dari detail_batch.usageList
        if (state.detail_batch?.usageList?.result) {
          state.detail_batch.usageList.result =
            state.detail_batch.usageList.result.filter(
              (item) => item.recordId !== action.payload.recordId
            );
          // Update total count
          if (state.detail_batch.usageList.totalElements) {
            state.detail_batch.usageList.totalElements -= 1;
          }
        }
      })
      .addCase(deleteSingleUsage.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(approveRejectData.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveRejectData.fulfilled, (state, action) => {
        state.loading = false;
        state.data_approve_reject = action.payload;
      })
      .addCase(approveRejectData.rejected, (state, action) => {
        state.loading = false;
        state.data_approve_reject = action.payload;
      });
    builder
      .addCase(getAssetType.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAssetType.fulfilled, (state, action) => {
        state.loading = false;
        state.data_asset_type = action.payload;
      })
      .addCase(getAssetType.rejected, (state, action) => {
        state.loading = false;
        state.data_asset_type = action.payload;
      });
    builder
      .addCase(getAccountNumber.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAccountNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.data_account_number = action.payload;
      })
      .addCase(getAccountNumber.rejected, (state, action) => {
        state.loading = false;
        state.data_account_number = action.payload;
      });
    builder
      .addCase(getSource.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSource.fulfilled, (state, action) => {
        state.loading = false;
        state.data_source = action.payload;
      })
      .addCase(getSource.rejected, (state, action) => {
        state.loading = false;
        state.data_source = action.payload;
      });
    builder
      .addCase(getApprovalHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getApprovalHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.data_approval_history = action.payload;
      })
      .addCase(getApprovalHistory.rejected, (state, action) => {
        state.loading = false;
        state.data_approval_history = action.payload;
      });
  },
});

const { reducer } = monitoringUsageSlice;
export default reducer;
export const { setClearData, clearUpdated, clearUpdatedDeleted } =
  monitoringUsageSlice.actions;
