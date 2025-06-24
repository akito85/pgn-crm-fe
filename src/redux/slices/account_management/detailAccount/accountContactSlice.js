import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showModalError } from "../../general_slice";
import { showModalSuccess } from "../../general_slice";
import accountManagementService from "../../../services/account_management/accountManagementService";

const initialState = {
  data: [],
  data_detail: {},
  data_choose_contact: [],
  data_job: [],
  data_position: [],
  data_contact_address: [],
  data_contactType: [],
  data_inputType: [],
  data_country_code: [],
  data_country_zone: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
  message: "",
  data_temp_zone: [],
};

// get list account contact
export const getListDetailAccountContact = createAsyncThunk(
  "GET_LIST_DETAIL_ACCOUNT_CONTACT",
  async ({ search, id, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? '' : search;
			const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/account/contact/viewList/${id}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get detail account contact
export const getDetailAccountContact = createAsyncThunk(
  "GET_DETAIL_ACCOUNT_CONTACT",
  async (accountContactId, thunkAPI) => {
    try {
      // const url = `/v1/dbs/api/account/contact/viewList/${id}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const url = `/v1/dbs/api/account/contact/detail/${accountContactId}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get List Choose Contact
export const getListChooseContact = createAsyncThunk(
  "GET_LIST_CHOOSE_ACCOUNT_CONTACT",
  async ({ id, search, page, pageSize, sort }, thunkAPI) => {
    try {      
			const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/contact/account/choose/${id}?sort=${sortParams}&searchs=${search}&size=${pageSize}&page=${page}`;
      const response = await accountManagementService.getPagination(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get detail after choose
export const getDetailContactAfterChoose = createAsyncThunk(
  "GET_DETAIL_CONTACT_AFTER_CHOOSE_ID",
  async (accountContactId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/contact/detailChoose/${accountContactId}`;
      const response = await accountManagementService.getPagination(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Activation contact
export const activationAccountContact = createAsyncThunk(
  "ACTIVATION_ACCOUNT_CONTACT",
  async ({body, title}, thunkAPI) => {
    console.log("🚀 ~ file: accountContactSlice.js:50 ~ body:", body)
    try {
      const url = `/v1/dbs/api/account/contact/inactive`;
      const response = await accountManagementService.updateData(
        url,
        body
      );
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${title}.`,
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
        const errorBody = { 
          title: "Failed",
          description: `Your data was not ${title}. ${message}. Please try again.`,
          return: false,
        };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Create Account Contact
export const createAccountContact = createAsyncThunk(
  "CREATE_ACCOUNT_CONTACT",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/account/contact/create";
      const response = await accountManagementService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been created.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response;
    } catch (error) {
      console.log("🚀 ~ file: accountContactSlice.js:118 ~ error:", error)
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
        if (Math.floor((error.response.data.code || 0) / 100) === 4) {
          const errorBody = {
            title: "Failed",
            description: `${message}`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


// Get Job
export const getJob = createAsyncThunk("GET_JOB", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/account/contact/getJob`;
    const response = await accountManagementService.getAll(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

// Get Position
export const getPosition = createAsyncThunk("GET_POSITION", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/account/contact/getPosition`;
    const response = await accountManagementService.getAll(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

// Get Contact Address
export const getContactAddress = createAsyncThunk("GET_CONTACT_ADDRESS", async (id, thunkAPI) => {
  try {
    const url = `/v1/dbs/api/account/contact/address/${id}`;
    const response = await accountManagementService.getAll(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

export const updateAccountContact = createAsyncThunk(
  "UPDATE_ACCOUNT_CONTACT",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/account/contact/update";
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been updated.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response;
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
            description: `${message}`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      // thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const getContactType = createAsyncThunk("GET_CONTACT_TYPE", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/account/contact/getContactType`;
    const response = await accountManagementService.getAll(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

export const getInputType = createAsyncThunk("GET_INPUT_TYPE", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/account/contact/getInputType`;
    const response = await accountManagementService.getAll(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

export const getCountryCode = createAsyncThunk(
  "GET_COUNTRY_CODE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/contact/getCountry`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getCountryZone = createAsyncThunk(
  "GET_COUNTRY_ZONE_CONTACT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/contact/getZone/${id}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const accountContactSlice = createSlice({
  name: "accountContact",
  initialState,
  // For Reset data Detail
  reducers: {
    resetDataDetail: (state) => {
      state.data_detail = {};
      state.data_temp_zone = [];
    },
  },
  extraReducers: {
    // Get All Account Contact Pagination
    [getListDetailAccountContact.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data = action.payload;
    },
    [getListDetailAccountContact.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data = action.payload;
      state.loading = false;
    },
    [getListDetailAccountContact.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // Get Detail Account Contact
    [getDetailAccountContact.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_detail = action.payload;
    },
    [getDetailAccountContact.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailAccountContact.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },

    // Acivation Account Contact
    [activationAccountContact.pending]: (state, action) => {
      state.loading = true;
    },
    [activationAccountContact.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [activationAccountContact.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    // Get List Choose Account Contact
    [getListChooseContact.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_choose_contact = action.payload;
    },
    [getListChooseContact.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_choose_contact = action.payload;
      state.loading = false;
    },
    [getListChooseContact.rejected]: (state, action) => {
      state.data_choose_contact = action.payload;
      state.loading = false;
    },

    // Get Detail Account Contact After Choose
    [getDetailContactAfterChoose.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_detail = action.payload;
    },
    [getDetailContactAfterChoose.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailContactAfterChoose.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },

    // Get Job
    [getJob.pending]: (state, action) => {
      state.loading = true;
      state.data_job = action.payload;
    },
    [getJob.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_job = action.payload;
    },
    [getJob.rejected]: (state, action) => {
      state.loading = false;
      state.data_job = action.payload;
    },

    // Get Position
    [getPosition.pending]: (state, action) => {
      state.loading = true;
      state.data_position = action.payload;
    },
    [getPosition.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_position = action.payload;
    },
    [getPosition.rejected]: (state, action) => {
      state.loading = false;
      state.data_position = action.payload;
    },

    // Get Contact Address
    [getContactAddress.pending]: (state, action) => {
      state.loading = true;
      state.data_contact_address = action.payload;
    },
    [getContactAddress.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_contact_address = action.payload;
    },
    [getContactAddress.rejected]: (state, action) => {
      state.loading = false;
      state.data_contact_address = action.payload;
    },

    // Create Account Contact
    [createAccountContact.pending]: (state, action) => {
      state.loading = true;
    },
    [createAccountContact.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [createAccountContact.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
    },

    // Update Account Contact
    [updateAccountContact.pending]: (state, action) => {
      state.loading = true;
    },
    [updateAccountContact.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [updateAccountContact.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
    },

    // Get Contact Type
    [getContactType.pending]: (state, action) => {
      state.loading = true;
      state.data_contactType = action.payload;
    },
    [getContactType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_contactType = action.payload;
    },
    [getContactType.rejected]: (state, action) => {
      state.loading = false;
      state.data_contactType = action.payload;
    },

    // Get Input Type
    [getInputType.pending]: (state, action) => {
      state.loading = true;
      state.data_inputType = action.payload;
    },
    [getInputType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_inputType = action.payload;
    },
    [getInputType.rejected]: (state, action) => {
      state.loading = false;
      state.data_inputType = action.payload;
    },

    // Get Country Code
    [getCountryCode.pending]: (state, action) => {
      state.loading = true;
      state.data_country_code = action.payload;
    },
    [getCountryCode.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_country_code = action.payload;
    },
    [getCountryCode.rejected]: (state, action) => {
      state.loading = false;
      state.data_country_code = action.payload;
    },

    // Get Country Zone
    [getCountryZone.pending]: (state, action) => {
      state.loading = true;
      state.data_country_zone = action.payload;
    },
    [getCountryZone.fulfilled]: (state, action) => {
      console.log("🚀 ~ action:", action)
      state.loading = false;
      state.data_country_zone = action.payload;
      state.data_temp_zone = [...state?.data_temp_zone, ...action?.payload]
    
    },
    [getCountryZone.rejected]: (state, action) => {
      state.loading = false;
      // state.data_country_zone = action.payload;
    },
  }
})

const { reducer } = accountContactSlice;
export const { resetDataDetail } = accountContactSlice.actions;
export default reducer;
