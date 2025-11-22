import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import debtAndCollectionHttpService from "../../services/debtAndCollectionHttpService";
import {
  showModalError,
  showModalSuccess,
  validateError
} from "../general_slice";

const initialState = {
  loading: false,
  dataActivityAction: null,
  dataDetailActivityAction: null,
  data:null,
  dataActivityName:null
};

export const getAllActivityActionPaginate = createAsyncThunk(
  "GET_ALL_ACTIVITY_ACTION_PAGINATE",
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    try {
      const body ={
        page: page,
        size: pageSize,
        // sort: sort || "createdDate~desc",
        searchs: search 
      }
      const url = `/v1/dbs/api/collection-activity/result-option/get-list`;
      const response = await debtAndCollectionHttpService.getPaginationPost(url,body);
      return response.data;
    } catch (error) {
      console.log(error, " = error slice");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const getDetailActivityActionPaginate = createAsyncThunk(
  "GET_DETAIL_ACTIVITY_ACTION_PAGINATE",
  async (id , thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activity/result-option/${id}`;
      const response = await debtAndCollectionHttpService.getDetail(url);
      console.log("response detail activity action:", response);
      console.log("id detail activity action:", id);
      console.log("thunkAPI detail activity action:", thunkAPI);
      console.log("url detail activity action:", url);
      return response.data;
    } catch (error) {
      console.log(error, " = error slice");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const createActivityAction = createAsyncThunk(
  "CREATE_ACTIVITY_ACTION",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activity/result-option`;
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


export const validateCreateUpdateActivityAction = createAsyncThunk(
  "VALIDATE_CREATE_UPDATE_ACTIVITY_ACTION",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activity/result-option/validate-create-update`;
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
export const deleteActivityAction = createAsyncThunk(
  "DELETE_ACTIVITY_ACTION",
  async ( {id} , thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activity/result-option/${id}`;
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
          action: "DELETE_ACTIVITY_ACTION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);


export const updateActivityAction = createAsyncThunk(
  "UPDATE_ACTIVITY_ACTION",
  async ({body, id} , thunkAPI) => {
    try {
      console.log("body", body);
      console.log("id", id);
      console.log("thunkAPI", thunkAPI);
      const url = `/v1/dbs/api/collection-activity/result-option/${id}`;
      const data = await debtAndCollectionHttpService.updateData(url, body);
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

const activityActionSlice = createSlice({
  name: "activityAction",
  initialState,
  extraReducers: {
    // Get All Activity Action Paginate
    [getAllActivityActionPaginate.pending]: (state, action) => {
      state.loading = true;
      state.dataActivityAction = action.payload;
    },
    [getAllActivityActionPaginate.fulfilled]: (state, action) => {
      state.dataActivityAction = action.payload;
      state.loading = false;
    },
    [getAllActivityActionPaginate.rejected]: (state, action) => {
      state.dataActivityAction = action.payload;
      state.loading = false;
    },

    // Get Detail Activity Action Paginate
    [getDetailActivityActionPaginate.pending]: (state, action) => {
      state.loading = true;
      state.dataDetailActivityAction = action.payload;
    },
    [getDetailActivityActionPaginate.fulfilled]: (state, action) => {
      state.dataDetailActivityAction = action.payload;
      state.loading = false;
    },
    [getDetailActivityActionPaginate.rejected]: (state, action) => {
      state.dataDetailActivityAction = action.payload;
      state.loading = false;
    },

    // Create Update Activity Action
    [createActivityAction.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [createActivityAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [createActivityAction.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // Validate Create Update Activity Action
    [validateCreateUpdateActivityAction.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [validateCreateUpdateActivityAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [validateCreateUpdateActivityAction.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // Delete Activity Action
    [deleteActivityAction.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [deleteActivityAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [deleteActivityAction.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // Update Activity Action
    [updateActivityAction.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [updateActivityAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [updateActivityAction.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    
    // Get Activity Name List
    [getActivityNameList.pending]: (state, action) => {
      state.loading = true;
      state.dataActivityName = action.payload;
    },
    [getActivityNameList.fulfilled]: (state, action) => {
      state.dataActivityName = action.payload;
      state.loading = false;
    },
    [getActivityNameList.rejected]: (state, action) => {
      state.dataActivityName = action.payload;
      state.loading = false;
    },
  }
});

const { reducer } = activityActionSlice;
export default reducer;
