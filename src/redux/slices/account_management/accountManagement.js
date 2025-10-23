import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../services/account_management/accountManagementService";
import { grantedAccessDetail, showModalError, showModalSuccess, validateError } from "../general_slice";

const initialState = {
  data: [],
  data_detail: {},
  data_withHoldingTax: [],
  data_accountDetail: {},
  data_ServiceAggrementTOS: {},
  access_account:{},
  access_account_extend:{}
};

export const getAccountDetail = createAsyncThunk(
  "GET_ACCOUNT_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/serviceAgremeent/view/detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getAccountStandardDetail = createAsyncThunk(
  "GET_ACCOUNT_STANDARD_DETAIL",
  async ({ idCustomer, idAccount }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-info/detail-standart/${idCustomer}/${idAccount}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getAccountOneTimeDetail = createAsyncThunk(
  "GET_ACCOUNT_ONE_TIME_DETAIL",
  async ({ idCustomer, idAccount }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-info/detail-onetime/${idCustomer}/${idAccount}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const updateAccount = createAsyncThunk(
  "UPDATE_ACCOUNT",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-info/update-account`;
      const response = await accountManagementService.updateDataWithMethodPost(url, body);
      const successMessage = {
        title: "Successful",
        description: "Your data has been updated.",
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
        const errorBody = {
          title: "Failed",
          description: `Your data was not updated ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

//Needs to be moved
export const getServiceAggrementTOS = createAsyncThunk(
  "GET_SERVICE_AGGREMENT_TOS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/sa-get-detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

// Access for account detail
export const getGrantedAccessAccount = createAsyncThunk("CHECK_GRANTED_ACCESS_ACCOUNT", async (body, thunkAPI) => {
  try {
    const data = await accountManagementService.checkGrantedAccessAccount(body)
    thunkAPI.dispatch(grantedAccessDetail(data?.data))
		return data?.data;
	} catch (error) {
		thunkAPI.dispatch(validateError({ error: error, action:'CHECK_GRANTED_ACCESS_ACCOUNT'}))
		return thunkAPI.rejectWithValue(error);
	}
});
export const getGrantedAccessAccountExtend = createAsyncThunk("CHECK_GRANTED_ACCESS_ACCOUNT_EXTEND", async (body, thunkAPI) => {
  try {
    const data = await accountManagementService.checkGrantedAccessAccount(body)
    thunkAPI.dispatch(grantedAccessDetail(data?.data))
		return data?.data;
	} catch (error) {
		thunkAPI.dispatch(validateError({ error: error, action:'CHECK_GRANTED_ACCESS_ACCOUNT_EXTEND'}))
		return thunkAPI.rejectWithValue(error);
	}
});

const accountSlice = createSlice({
  name: "accountManagement",
  initialState,
  extraReducers: {
    /** Get Detail General */
    [getAccountDetail.pending]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = true;
    },
    [getAccountDetail.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getAccountDetail.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },

    /** Get Detail Account */
    [getAccountStandardDetail.pending]: (state, action) => {
      state.data_accountDetail = action.payload;
      state.loading = true;
    },
    [getAccountStandardDetail.fulfilled]: (state, action) => {
      state.data_accountDetail = action.payload;
      state.loading = false;
    },
    [getAccountStandardDetail.rejected]: (state, action) => {
      state.data_accountDetail = action.payload;
      state.loading = false;
    },

    [getAccountOneTimeDetail.pending]: (state, action) => {
      state.data_accountDetail = action.payload;
      state.loading = true;
    },
    [getAccountOneTimeDetail.fulfilled]: (state, action) => {
      state.data_accountDetail = action.payload;
      state.loading = false;
    },
    [getAccountOneTimeDetail.rejected]: (state, action) => {
      state.data_accountDetail = action.payload;
      state.loading = false;
    },

    //SA TOS
    [getServiceAggrementTOS.pending]: (state, action) => {
      state.data_ServiceAggrementTOS = action.payload;
      state.loading = true;
    },
    [getServiceAggrementTOS.fulfilled]: (state, action) => {
      state.data_ServiceAggrementTOS = action.payload;
      state.loading = false;
    },
    [getServiceAggrementTOS.rejected]: (state, action) => {
      state.data_ServiceAggrementTOS = action.payload;
      state.loading = false;
    },

    //Grated Access Account
    [getGrantedAccessAccount.pending]: (state, action) => {
      state.access_account = action.payload;
      state.loading = true;
    },
    [getGrantedAccessAccount.fulfilled]: (state, action) => {
      state.access_account = action.payload;
      state.loading = false;
    },
    [getGrantedAccessAccount.rejected]: (state, action) => {
      state.access_account = action.payload;
      state.loading = false;
    },

    //Grated Access Account Extend
    [getGrantedAccessAccountExtend.pending]: (state, action) => {
      state.access_account_extend = action.payload;
      state.loading = true;
    },
    [getGrantedAccessAccountExtend.fulfilled]: (state, action) => {
      state.access_account_extend = action.payload;
      state.loading = false;
    },
    [getGrantedAccessAccountExtend.rejected]: (state, action) => {
      state.access_account_extend = action.payload;
      state.loading = false;
    },
  },
});
const { reducer } = accountSlice;
export default reducer;
