import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import debtAndCollectionHttpService from "../../services/debtAndCollectionHttpService";
import {
  showModalError,
  showModalSuccess,
  validateError
} from "../general_slice";

const initialState = {
  loading: false,
  dataGracePeriod: null,
  dataDetailGracePeriod: null,
  data:null
};

export const getAllGracePeriodPaginate = createAsyncThunk(
  "GET_ALL_GRACE_PERIOD_PAGINATE",
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/grace-period/get-list?page=${page}&size=${pageSize}&sort=${
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


export const getDetailGracePeriodPaginate = createAsyncThunk(
  "GET_DETAIL_GRACE_PERIOD_PAGINATE",
  async (id , thunkAPI) => {
    try {
      const url = `/v1/dbs/api/grace-period/detail-get/${id}`;
      const response = await debtAndCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      console.log(error, " = error slice");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const createUpdateGracePeriod = createAsyncThunk(
  "CREATE_UPDATE_GRACE_PERIOD",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/grace-period/create-update`;
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


export const validateCreateUpdateGracePeriod = createAsyncThunk(
  "VALIDATE_CREATE_UPDATE_GRACE_PERIOD",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/grace-period/validate-create-update`;
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
export const deleteGracePeriod = createAsyncThunk(
  "DELETE_GRACE_PERIOD",
  async ( {id} , thunkAPI) => {
    try {
      const url = `/v1/dbs/api/grace-period/hard-delete/${id}`;
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
          action: "DELETE_GRACE_PERIOD",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const gracePeriodSlice = createSlice({
  name: "gracePeriod",
  initialState,
  extraReducers: {
    // Get All Grace Period Paginate
    [getAllGracePeriodPaginate.pending]: (state, action) => {
      state.loading = true;
      state.dataGracePeriod = action.payload;
    },
    [getAllGracePeriodPaginate.fulfilled]: (state, action) => {
      state.dataGracePeriod = action.payload;
      state.loading = false;
    },
    [getAllGracePeriodPaginate.rejected]: (state, action) => {
      state.dataGracePeriod = action.payload;
      state.loading = false;
    },

    // Get Detail Grace Period Paginate
    [getDetailGracePeriodPaginate.pending]: (state, action) => {
      state.loading = true;
      state.dataDetailGracePeriod = action.payload;
    },
    [getDetailGracePeriodPaginate.fulfilled]: (state, action) => {
      state.dataDetailGracePeriod = action.payload;
      state.loading = false;
    },
    [getDetailGracePeriodPaginate.rejected]: (state, action) => {
      state.dataDetailGracePeriod = action.payload;
      state.loading = false;
    },

    // Create Update Grace Period
    [createUpdateGracePeriod.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [createUpdateGracePeriod.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [createUpdateGracePeriod.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // Validate Create Update Grace Period
    [validateCreateUpdateGracePeriod.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [validateCreateUpdateGracePeriod.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [validateCreateUpdateGracePeriod.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // Delete Grace Period
    [deleteGracePeriod.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [deleteGracePeriod.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [deleteGracePeriod.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
  }
});

const { reducer } = gracePeriodSlice;
export default reducer;