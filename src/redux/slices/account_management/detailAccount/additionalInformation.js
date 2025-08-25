import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setBodyError, showModalError, showModalSuccess, validateError } from "../../general_slice";
import accountManagementService from "../../../services/account_management/accountManagementService";

const initialState = {
  data: [],
  data_category: [],
  data_value: [],
  loading: false,
};

export const getAccountAdditionalInfo = createAsyncThunk(
  "GET_ACCOUNT_ADDITIONAL_INFO",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/additional-information/view/${id}`;
      const response = await accountManagementService.getPagination(url);
      return response.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getCategoryAdditionalInfoList = createAsyncThunk(
  "GET_CATEGORY_ADDITIONAL_INFO_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/additional-information/ddl/category`;
      const response = await accountManagementService.getPagination(url);
      return response.data?.map((item) => {
        return {
          value: item.id,
          label: item.name,
          isAnyChild: item.isAnyChild,
        }
      })
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_CATEGORY_ADDITIONAL_INFO_LIST", back : false }));
      return thunkAPI.rejectWithValue(error.response.data.code === 419 ? null : error.response.data);
    }
  }
);

export const getValueAdditionalInfoList = createAsyncThunk(
  "GET_VALUE_ADDITIONAL_INFO_LIST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/additional-information/ddl/value/${id}`;
      const response = await accountManagementService.getPagination(url);
      return response.data?.map((item) => {
        return {
          value: item.id,
          label: item.name,
        }
      });
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_VALUE_ADDITIONAL_INFO_LIST", back : false }));
      return thunkAPI.rejectWithValue(error.response.data.code === 419 ? null : error.response.data);
    }
  }
);

export const createUpdateAdditionalInfo = createAsyncThunk(
  "CREATE_UPDATE_ADDITIONAL_INFO",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/account-detail/additional-information/create-update";
      const response = await accountManagementService.createData(url, body);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was ${
            body?.id ? "created" : "updated"
          }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteAdditonalInfo = createAsyncThunk(
  "DELETE_ADDITIONAL_INFO",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/additional-information/soft-delete/${id}`;
      const response = await accountManagementService.activationWithRemark(url);
      const successMessage = {
        title: "Successful",
        description: `Your data has been deleted.`,
        return: false,
        icon: "icon_error_delete",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      //if error code for with validation
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(
            validateError({ error, action: "DELETE_ADDITIONAL_INFO" })
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not deleted. ${message}.`,
            return: false,
            icon: "icon_error_delete",
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error.response.data.code === 419 ? null : error.response.data);
    }
  }
);

const additionalInformation = createSlice({
  name: "additionalInformation",
  initialState,
  extraReducers: {
    /** Get Detail General */
    [getAccountAdditionalInfo.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [getAccountAdditionalInfo.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getAccountAdditionalInfo.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    [getCategoryAdditionalInfoList.pending]: (state, action) => {
      state.data_category = action.payload;
      state.loading = true;
    },
    [getCategoryAdditionalInfoList.fulfilled]: (state, action) => {
      state.data_category = action.payload;
      state.loading = false;
    },
    [getCategoryAdditionalInfoList.rejected]: (state, action) => {
      state.data_category = action.payload;
      state.loading = false;
    },

    [getValueAdditionalInfoList.pending]: (state, action) => {
      state.data_value = action.payload;
      state.loading = true;
    },
    [getValueAdditionalInfoList.fulfilled]: (state, action) => {
      state.data_value = action.payload;
      state.loading = false;
    },
    [getValueAdditionalInfoList.rejected]: (state, action) => {
      state.data_value = action.payload;
      state.loading = false;
    },
  },
});
const { reducer } = additionalInformation;
export default reducer;
