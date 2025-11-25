import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import debtAndCollectionHttpService from "../../services/debtAndCollectionHttpService";
import {
  showModalError,
  showModalSuccess,
  validateError
} from "../general_slice";

const initialState = {
  loading: false,
  dataAccount:  null,
  dataActivities: null,
  data:null,
  dataDetailActivities: null,
  dataCustomer: {
    success: true,
    code: 200,
    message: "OK",
    data: [
      { id: 1, name: "Jessica Felicia" },
      { id: 2, name: "Michael Adrianto" },
      { id: 3, name: "Sarah Novita" },
      { id: 4, name: "Daniel Wijaya" },
      { id: 5, name: "Rina Putri" }
    ]
  },
  dataPic: null,
  dataActivity: null,
  dataActivityAction: null

};

export const getAllAccountPaginate = createAsyncThunk(
  "GET_ALL_ACCOUNT_PAGINATE",
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity/get-list-account?page=${page}&size=${pageSize}&sort=${
        sort || "departmentId~desc"
      }&searchs=${search}`;
      const response = await debtAndCollectionHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      console.log(error, " = error slice");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAllActivityByAccountNumePaginate = createAsyncThunk(
  "GET_ALL_ACTIVITY_BY_ACCOUNT_NUM_PAGINATE",
  async ({ accountNum, page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity/get-list-by-account-num?accountNum=${accountNum}&page=${page}&size=${pageSize}&sort=${
        sort || "createdDate~desc"
      }&searchs=${search}`;
      const response = await debtAndCollectionHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      console.log(error, " = error slice");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getDetailActivity = createAsyncThunk(
  "GET_DETAIL_ACTIVITY",
  async ( id , thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity/detail-get/${id}`;
      const response = await debtAndCollectionHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      console.log(error, " = error slice");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createUpdateActivity = createAsyncThunk(
  "CREATE_UPDATE_ACTIVITY",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity/create-update`;
      const data = await debtAndCollectionHttpService.upload(url, body);
      const message = data.message;
      const successMessage = {
        title: "Successfull",
        description: `${message}`,
        // return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return data.data;
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
          description: `Your data was not created or Update. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);


export const validateCreateUpdateActivity = createAsyncThunk(
  "VALIDATE_CREATE_UPDATE_ACTIVITY",
  async (formData, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity/validate-create-update`;
      const data = await debtAndCollectionHttpService.upload(url, formData);
      return data.data; // SUCCESS
    } catch (error) {
      const errRes = error?.response?.data;

      // Backup message
      const defaultMsg =
        errRes?.message ||
        error?.message ||
        "Something went wrong";

      const beanErrors = Array.isArray(errRes?.data) ? errRes.data : null;

      if (beanErrors) {
        const messageList = beanErrors
          .map((e) => {
            const field = Object.keys(e)[0];
            const msg = e[field];
            return `${field}: ${msg}`;
          })
          .join("\n");

        thunkAPI.dispatch(
          showModalError({
            title: "Validation Error",
            description: messageList,
          })
        );
      } else {
        thunkAPI.dispatch(
          showModalError({
            title: "Failed",
            description: `Your data was not created. ${defaultMsg}`,
          })
        );
      }

      return thunkAPI.rejectWithValue(error);
    }
  }
);


// Delete
export const deleteActivity = createAsyncThunk(
  "DELETE_ACTIVITY",
  async ( {id} , thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity/hard-delete/${id}`;
      const response = await debtAndCollectionHttpService.deleteData(url);
      const successBody = {
        title: `Successful`,
        description: "Your data has been deleted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DELETE_ACTIVITY",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getActivityNameList = createAsyncThunk(
  "GET_ACTIVITY_NAME_LIST",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity-name/get-all`;
      const response = await debtAndCollectionHttpService.get(url);
      return response; // Return the whole response object
    } catch (error) {
      console.log(error, " = error slice");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const getActivityActionList = createAsyncThunk(
  "GET_ACTIVITY_ACTION_LIST",
  async (activityId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activity/result-option/get-all-by-activity-id/${activityId}`;
      const response = await debtAndCollectionHttpService.get(url);
      return response; // Return the whole response object
    } catch (error) {
      console.log(error, " = error slice");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getUserList = createAsyncThunk(
  "GET_USER_LIST",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity/get-user`;
      const response = await debtAndCollectionHttpService.get(url);
      return response; // Return the whole response object
    } catch (error) {
      console.log(error, " = error slice");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const downloadEvidence = createAsyncThunk(
  "DOWNLOAD_ACTIVITY",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity/download/${id}`;
      await debtAndCollectionHttpService.downloadData(url);

      // thunkAPI.dispatch(showModalSuccess({
      //   title: "Successful",
      //   description: "Your file has been downloaded.",
      //   return: false,
      // }));

      // return hanya serializable
      return { success: true };
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_ACTIVITY",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const downloadTemplateBulkActivity = createAsyncThunk(
  "DOWNLOAD_TEMPLATE_BULK_ACTIVITY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity/download-template-bulk-activity`;
      await debtAndCollectionHttpService.downloadData(url);

      // thunkAPI.dispatch(showModalSuccess({
      //   title: "Successful",
      //   description: "Your file has been downloaded.",
      //   return: false,
      // }));

      // return hanya serializable
      return { success: true };
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_TEMPLATE_BULK_ACTIVITY",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);


export const createBulkAcitivity = createAsyncThunk(
  "BULK_ACTIVITY",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity/insert-bulk-activity`;
      const data = await debtAndCollectionHttpService.upload(url, body);
      const message = data.message;
      const successMessage = {
        title: "Successfull",
        description: `${message}`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return data.data;
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
          description: `Your data was not bulk . ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);


export const validateBulkActivity = createAsyncThunk(
  "VALIDATE_BULK_ACTIVITY",
  async (formData, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity/validate-upload-bulk`;
      const data = await debtAndCollectionHttpService.upload(url, formData);
      return data.data; // SUCCESS
    } catch (error) {
      const errRes = error?.response?.data;

      // Backup message
      const defaultMsg =
        errRes?.message ||
        error?.message ||
        "Something went wrong";

      const beanErrors = Array.isArray(errRes?.data) ? errRes.data : null;

      if (beanErrors) {
        const messageList = beanErrors
          .map((e) => {
            const field = Object.keys(e)[0];
            const msg = e[field];
            return `${field}: ${msg}`;
          })
          .join("\n");

        thunkAPI.dispatch(
          showModalError({
            title: "Validation Error",
            description: messageList,
          })
        );
      } else {
        thunkAPI.dispatch(
          showModalError({
            title: "Failed",
            description: `Your data was not upload bulk. ${defaultMsg}`,
          })
        );
      }

      return thunkAPI.rejectWithValue(error);
    }
  }
);


const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  extraReducers: {

    [getAllAccountPaginate.pending]: (state, action) => {
      state.loading = true;
      state.dataAccount = action.payload;
    },
    [getAllAccountPaginate.fulfilled]: (state, action) => {
      state.dataAccount = action.payload;
      state.loading = false;
    },
    [getAllAccountPaginate.rejected]: (state, action) => {
      state.dataAccount = action.payload;
      state.loading = false;
    },


    [getAllActivityByAccountNumePaginate.pending]: (state, action) => {
      state.loading = true;
      state.dataActivities = action.payload;
    },
    [getAllActivityByAccountNumePaginate.fulfilled]: (state, action) => {
      state.dataActivities = action.payload;
      state.loading = false;
    },
    [getAllActivityByAccountNumePaginate.rejected]: (state, action) => {
      state.dataActivities = action.payload;
      state.loading = false;
    },


    [getDetailActivity.pending]: (state, action) => {
      state.loading = true;
      state.dataDetailActivities = action.payload;
    },
    [getDetailActivity.fulfilled]: (state, action) => {
      state.dataDetailActivities = action.payload;
      state.loading = false;
    },
    [getDetailActivity.rejected]: (state, action) => {
      state.dataDetailActivities = action.payload;
      state.loading = false;
    },

    // Create Update Activity 
    [createUpdateActivity.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [createUpdateActivity.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [createUpdateActivity.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // Validate Create Update Activity 
    [validateCreateUpdateActivity.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [validateCreateUpdateActivity.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [validateCreateUpdateActivity.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // Delete Activity 
    [deleteActivity.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [deleteActivity.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [deleteActivity.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // Get Activity Name List
    [getActivityNameList.pending]: (state, action) => {
      state.loading = true;
      state.dataActivity = action.payload;
    },
    [getActivityNameList.fulfilled]: (state, action) => {
      state.dataActivity = action.payload;
      state.loading = false;
    },
    [getActivityNameList.rejected]: (state, action) => {
      state.dataActivity = action.payload;
      state.loading = false;
    },

    // Get Activity Action List
    [getActivityActionList.pending]: (state, action) => {
      state.loading = true;
      state.dataActivityAction = action.payload;
    },
    [getActivityActionList.fulfilled]: (state, action) => {
      state.dataActivityAction = action.payload;
      state.loading = false;
    },
    [getActivityActionList.rejected]: (state, action) => {
      state.dataActivityAction = action.payload;
      state.loading = false;
    },


    // Get User
    [getUserList.pending]: (state, action) => {
      state.loading = true;
      state.dataPic = action.payload;
    },
    [getUserList.fulfilled]: (state, action) => {
      state.dataPic = action.payload;
      state.loading = false;
    },
    [getUserList.rejected]: (state, action) => {
      state.dataPic = action.payload;
      state.loading = false;
    },


    [downloadEvidence.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [downloadEvidence.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [downloadEvidence.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    [downloadTemplateBulkActivity.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [downloadTemplateBulkActivity.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [downloadTemplateBulkActivity.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },


    // Create Bulk Activity 
    [createBulkAcitivity.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [createBulkAcitivity.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [createBulkAcitivity.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // Validate Bulk Activity 
    [validateBulkActivity.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [validateBulkActivity.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [validateBulkActivity.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },


  }
});

const { reducer } = activitiesSlice;
export default reducer;