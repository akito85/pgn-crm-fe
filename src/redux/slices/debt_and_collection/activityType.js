import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import debtAndCollectionHttpService from "../../services/debtAndCollectionHttpService";
import {
  showModalError,
  showModalSuccess,
  validateError
} from "../general_slice";

const initialState = {
  loading: false,
  dataActivityType: null,
  dataDetailActivityType: null,
  data:null
};

export const getAllActivityTypePaginate = createAsyncThunk(
  "GET_ALL_ACTIVITY_TYPE_PAGINATE",
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity/type/get-list?page=${page}&size=${pageSize}&sort=${
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


export const getDetailActivityTypePaginate = createAsyncThunk(
  "GET_DETAIL_ACTIVITY_TYPE_PAGINATE",
  async (id , thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity/type/detail-get/${id}`;
      const response = await debtAndCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      console.log(error, " = error slice");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const createUpdateActivityType = createAsyncThunk(
  "CREATE_UPDATE_ACTIVITY_TYPE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity/type/create-update`;
      const data = await debtAndCollectionHttpService.createData(url, body);
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
          description: `Your data was not created or Update. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);


export const validateCreateUpdateActivityType = createAsyncThunk(
  "VALIDATE_CREATE_UPDATE_ACTIVITY_TYPE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity/type/validate-create-update`;
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
export const deleteActivityType = createAsyncThunk(
  "DELETE_ACTIVITY_TYPE",
  async ( {id} , thunkAPI) => {
    try {
      const url = `/v1/dbs/api/activity/type/delete/${id}`;
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
          action: "DELETE_ACTIVITY_TYPE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const activityTypeSlice = createSlice({
  name: "activityType",
  initialState,
  extraReducers: {
    // Get All Activity Type Paginate
    [getAllActivityTypePaginate.pending]: (state, action) => {
      state.loading = true;
      state.dataActivityType = action.payload;
    },
    [getAllActivityTypePaginate.fulfilled]: (state, action) => {
      state.dataActivityType = action.payload;
      state.loading = false;
    },
    [getAllActivityTypePaginate.rejected]: (state, action) => {
      state.dataActivityType = action.payload;
      state.loading = false;
    },

    // Get Detail Activity Type Paginate
    [getDetailActivityTypePaginate.pending]: (state, action) => {
      state.loading = true;
      state.dataDetailActivityType = action.payload;
    },
    [getDetailActivityTypePaginate.fulfilled]: (state, action) => {
      state.dataDetailActivityType = action.payload;
      state.loading = false;
    },
    [getDetailActivityTypePaginate.rejected]: (state, action) => {
      state.dataDetailActivityType = action.payload;
      state.loading = false;
    },

    // Create Update Activity Type
    [createUpdateActivityType.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [createUpdateActivityType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [createUpdateActivityType.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // Validate Create Update Activity Type
    [validateCreateUpdateActivityType.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [validateCreateUpdateActivityType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [validateCreateUpdateActivityType.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // Delete Activity Type
    [deleteActivityType.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [deleteActivityType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [deleteActivityType.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
  }
});

const { reducer } = activityTypeSlice;
export default reducer;