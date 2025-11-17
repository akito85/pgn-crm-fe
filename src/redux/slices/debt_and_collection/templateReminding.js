import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import debtAndCollectionHttpService from "../../services/debtAndCollectionHttpService";
import {
  showModalError,
  showModalSuccess,
  validateError
} from "../general_slice";

const initialState = {
  loading: false,
  dataTemplateReminding: null,
  dataDetailTemplateReminding: null,
  data:null
};

export const getAllTemplateRemindingPaginate = createAsyncThunk(
  "GET_ALL_TEMPLATE_REMINDING_PAGINATE",
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/template-reminding/get-list?page=${page}&size=${pageSize}&sort=${
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


export const getDetailTemplateRemindingPaginate = createAsyncThunk(
  "GET_DETAIL_TEMPLATE_REMINDING_PAGINATE",
  async (id , thunkAPI) => {
    try {
      const url = `/v1/dbs/api/template-reminding/detail-get/${id}`;
      const response = await debtAndCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      console.log(error, " = error slice");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const createUpdateTemplateReminding = createAsyncThunk(
  "CREATE_UPDATE_TEMPLATE_REMINDING",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/template-reminding/create-update`;
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


export const validateCreateUpdateTemplateReminding = createAsyncThunk(
  "VALIDATE_CREATE_UPDATE_TEMPLATE_REMINDING",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/template-reminding/validate-create-update`;
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
export const deleteTemplateReminding = createAsyncThunk(
  "DELETE_TEMPLATE_REMINDING",
  async ( {id} , thunkAPI) => {
    try {
      const url = `/v1/dbs/api/template-reminding/hard-delete/${id}`;
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
          action: "DELETE_TEMPLATE_REMINDING",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const templateRemindingSlice = createSlice({
  name: "templateReminding",
  initialState,
  extraReducers: {
    // Get All Template Reminding Paginate
    [getAllTemplateRemindingPaginate.pending]: (state, action) => {
      state.loading = true;
      state.dataTemplateReminding = action.payload;
    },
    [getAllTemplateRemindingPaginate.fulfilled]: (state, action) => {
      state.dataTemplateReminding = action.payload;
      state.loading = false;
    },
    [getAllTemplateRemindingPaginate.rejected]: (state, action) => {
      state.dataTemplateReminding = action.payload;
      state.loading = false;
    },

    // Get Detail Template Reminding Paginate
    [getDetailTemplateRemindingPaginate.pending]: (state, action) => {
      state.loading = true;
      state.dataDetailTemplateReminding = action.payload;
    },
    [getDetailTemplateRemindingPaginate.fulfilled]: (state, action) => {
      state.dataDetailTemplateReminding = action.payload;
      state.loading = false;
    },
    [getDetailTemplateRemindingPaginate.rejected]: (state, action) => {
      state.dataDetailTemplateReminding = action.payload;
      state.loading = false;
    },

    // Create Update Template Reminding
    [createUpdateTemplateReminding.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [createUpdateTemplateReminding.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [createUpdateTemplateReminding.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // Validate Create Update Template Reminding
    [validateCreateUpdateTemplateReminding.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [validateCreateUpdateTemplateReminding.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [validateCreateUpdateTemplateReminding.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // Delete Template Reminding
    [deleteTemplateReminding.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [deleteTemplateReminding.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [deleteTemplateReminding.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
  }
});

const { reducer } = templateRemindingSlice;
export default reducer;