import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import debtAndCollectionHttpService from "../../services/debtAndCollectionHttpService";
import {
  showModalError,
  showModalSuccess,
  validateError
} from "../general_slice";

const initialState = {
  loading: false,
  dataActivityName: null,
  dataDetailActivityName: null,
  data:null
};

export const getAllActivityNamePaginate = createAsyncThunk(
  "GET_ALL_ACTIVITY_NAME_PAGINATE",
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity-name/get-list?page=${page}&size=${pageSize}&sort=${
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


export const getDetailActivityNamePaginate = createAsyncThunk(
  "GET_DETAIL_ACTIVITY_NAME_PAGINATE",
  async (id , thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity-name/detail-get/${id}`;
      const response = await debtAndCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      console.log(error, " = error slice");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const createUpdateActivityName = createAsyncThunk(
  "CREATE_UPDATE_ACTIVITY_NAME",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity-name/create-update`;
      const data = await debtAndCollectionHttpService.createData(url, body);
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


export const validateCreateUpdateActivityName = createAsyncThunk(
  "VALIDATE_CREATE_UPDATE_ACTIVITY_NAME",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity-name/validate-create-update`;
      const data = await debtAndCollectionHttpService.createData(url, body);
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
          description: `Your data was not created. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Delete
export const deleteActivityName = createAsyncThunk(
  "DELETE_ACTIVITY_NAME",
  async ( {id} , thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity-name/hard-delete/${id}`;
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
          action: "DELETE_ACTIVITY_NAME",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const activityNameSlice = createSlice({
  name: "activityName",
  initialState,
  extraReducers: {
    // Get All Activity Name Paginate
    [getAllActivityNamePaginate.pending]: (state, action) => {
      state.loading = true;
      state.dataActivityName = action.payload;
    },
    [getAllActivityNamePaginate.fulfilled]: (state, action) => {
      state.dataActivityName = action.payload;
      state.loading = false;
    },
    [getAllActivityNamePaginate.rejected]: (state, action) => {
      state.dataActivityName = action.payload;
      state.loading = false;
    },

    // Get Detail Activity Name Paginate
    [getDetailActivityNamePaginate.pending]: (state, action) => {
      state.loading = true;
      state.dataDetailActivityName = action.payload;
    },
    [getDetailActivityNamePaginate.fulfilled]: (state, action) => {
      state.dataDetailActivityName = action.payload;
      state.loading = false;
    },
    [getDetailActivityNamePaginate.rejected]: (state, action) => {
      state.dataDetailActivityName = action.payload;
      state.loading = false;
    },

    // Create Update Activity Name
    [createUpdateActivityName.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [createUpdateActivityName.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [createUpdateActivityName.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // Validate Create Update Activity Name
    [validateCreateUpdateActivityName.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [validateCreateUpdateActivityName.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [validateCreateUpdateActivityName.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // Delete Activity Name
    [deleteActivityName.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [deleteActivityName.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [deleteActivityName.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
  }
});

const { reducer } = activityNameSlice;
export default reducer;