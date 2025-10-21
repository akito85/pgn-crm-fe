import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../../general_slice";
import {
  errorBody,
  errorCode,
  errorMessage,
  hasValue,
} from "../../../../utils";

const initialState = {
  data: null,
  loading: false,
  data_detail: null,
  message: "",
  data_job: [],
  data_position: [],
  data_contact_address: [],
  data_contactType: [],
  data_inputType: [],
  data_country_code: [],
  data_country_zone: [],
  temp_country_zone: null,
};

export const getContactPaginate = createAsyncThunk(
  "GET_CONTACT_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/contact/viewList?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response.data;
    } catch (error) {
      // const message =
      //     error?.response?.data?.message || error?.message || error?.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //     thunkAPI.dispatch(setBodyError(error));
      // } else {
      //     const errorBody = {
      //         title: "Failed",
      //         description: `${message}`,
      //     };
      //     thunkAPI.dispatch(showModalError(errorBody))
      // }
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_CONTACT_PAGINATE" }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const downloadContact = createAsyncThunk(
  "DOWNLOAD_CONTACT",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/contact/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({ error: response, action: "DOWNLOAD_CONTACT" }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getDetailContact = createAsyncThunk(
  "GET_DETAIL_CONTACT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/contact/detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      // const message =
      //     error?.response?.data?.message || error?.message || error?.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //     thunkAPI.dispatch(setBodyError(error));
      // } else {
      //     const errorBody = {
      //         title: "Failed",
      //         description: `${message}`,
      //     };
      //     thunkAPI.dispatch(showModalError(errorBody))
      // }
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_DETAIL_CONTACT" }),
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);
export const createContact = createAsyncThunk(
  "CREATE_CONTACT",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/contact/create";
      const response = await accountManagementService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been created.",
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "CREATE_CONTACT",
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
export const updateContact = createAsyncThunk(
  "UPDATE_CONTACT",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/contact/update";
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been updated.",
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "updated", errorMessage(error)),
          action: "UPDATE_CONTACT",
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
export const activationContact = createAsyncThunk(
  "ACTIVATION_CONTACT",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/contact/active-inactive";
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: response?.message,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      // const message =
      //     (error.response &&
      //         error.response.data &&
      //         error.response.data.message) ||
      //     error.message ||
      //     error.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //     thunkAPI.dispatch(setBodyError(error));
      // } else {
      //     const errorBody = {
      //         title: "Failed",
      //         description: `Your data was not updated. ${message}. Please try again.`,
      //         return: false,
      //     };
      //     thunkAPI.dispatch(showModalError(errorBody));
      // }
      thunkAPI.dispatch(
        validateError({ error: error, action: "ACTIVATION_CONTACT" }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getListJob = createAsyncThunk(
  "GET_LIST_JOB",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/account/contact/getJob";
      const response = await accountManagementService.getAll(url);
      const responseMap = response?.data?.map((item) => ({
        value: item?.id,
        name: item?.text,
      }));
      return responseMap;
    } catch (error) {
      // const message =
      //     error?.response?.data?.message || error?.message || error?.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //     thunkAPI.dispatch(setBodyError(error));
      // } else {
      //     const errorBody = {
      //         title: "Failed",
      //         description: `${message}`,
      //     };
      //     thunkAPI.dispatch(showModalError(errorBody))
      // }
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_LIST_JOB" }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const getListPosition = createAsyncThunk(
  "GET_LIST_POSITION",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/account/contact/getPosition";
      const response = await accountManagementService.getAll(url);
      const responseMap = response?.data?.map((item) => ({
        value: item?.id,
        name: item?.text,
      }));
      return responseMap;
    } catch (error) {
      // const message =
      //     error?.response?.data?.message || error?.message || error?.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //     thunkAPI.dispatch(setBodyError(error));
      // } else {
      //     const errorBody = {
      //         title: "Failed",
      //         description: `${message}`,
      //     };
      //     thunkAPI.dispatch(showModalError(errorBody))
      // }
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_LIST_POSITION" }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getInputType = createAsyncThunk(
  "GET_INPUT_TYPE",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/input-type`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_INPUT_TYPE" }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getContactType = createAsyncThunk(
  "GET_CONTACT_TYPE",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/contact-type`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_CONTACT_TYPE" }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getCountryCode = createAsyncThunk(
  "GET_COUNTRY_CODE",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/country-code`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_COUNTRY_CODE" }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getCountryZone = createAsyncThunk(
  "GET_COUNTRY_ZONE",
  async (id, thunkAPI) => {
    try {
      if (hasValue(id)) {
        const url = `/v1/dbs/api/account/contact/getZone/${id}`;
        const response = await accountManagementService.getAll(url);
        return response.data;
      }
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_COUNTRY_ZONE" }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

const contactSlice = createSlice({
  name: "contact_slice",
  initialState,
  reducers: {
    resetDataDetail: (state) => {
      state.data_detail = null;
      state.temp_country_zone = [];
    },
  },
  extraReducers: {
    // pagination
    [getContactPaginate.pending]: (state, action) => {
      state.loading = true;
    },
    [getContactPaginate.rejected]: (state, action) => {
      state.loading = false;
    },
    [getContactPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // download
    [downloadContact.pending]: (state, action) => {
      state.loading = true;
    },
    [downloadContact.rejected]: (state, action) => {
      state.loading = false;
    },
    [downloadContact.fulfilled]: (state, action) => {
      state.loading = false;
      // state.data = action.payload;
    },
    // detail
    [getDetailContact.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailContact.rejected]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    [getDetailContact.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    // create
    [createContact.pending]: (state, action) => {
      state.loading = true;
    },
    [createContact.rejected]: (state, action) => {
      state.loading = false;
    },
    [createContact.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // update
    [updateContact.pending]: (state, action) => {
      state.loading = true;
    },
    [updateContact.rejected]: (state, action) => {
      state.loading = false;
    },
    [updateContact.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // activation
    [activationContact.pending]: (state, action) => {
      state.loading = true;
    },
    [activationContact.rejected]: (state, action) => {
      state.loading = false;
    },
    [activationContact.fulfilled]: (state, action) => {
      state.loading = false;
      // state.data = action.payload;
    },
    // get ddl job
    [getListJob.pending]: (state, action) => {
      state.loading = true;
    },
    [getListJob.rejected]: (state, action) => {
      state.loading = false;
    },
    [getListJob.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_job = action.payload;
    },
    // get ddl position
    [getListPosition.pending]: (state, action) => {
      state.loading = true;
    },
    [getListPosition.rejected]: (state, action) => {
      state.loading = false;
    },
    [getListPosition.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_position = action.payload;
    },

    // get input type
    [getInputType.pending]: (state, action) => {
      state.loading = true;
    },
    [getInputType.rejected]: (state, action) => {
      state.loading = false;
    },
    [getInputType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_inputType = action.payload;
    },
    // get contact type
    [getContactType.pending]: (state, action) => {
      state.loading = true;
    },
    [getContactType.rejected]: (state, action) => {
      state.loading = false;
    },
    [getContactType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_contactType = action.payload;
    },
    // get contact type
    [getCountryCode.pending]: (state, action) => {
      state.loading = true;
    },
    [getCountryCode.rejected]: (state, action) => {
      state.loading = false;
    },
    [getCountryCode.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_country_code = action.payload;
    },
    // Get Country Zone
    [getCountryZone.pending]: (state, action) => {
      state.loading = true;
      state.data_country_zone = action.payload;
    },
    [getCountryZone.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_country_zone = action.payload;
      const uniqueItems = new Set(
        state.temp_country_zone?.map((item) => item.id),
      );
      const filteredItems = action.payload.filter(
        (item) => !uniqueItems.has(item.id),
      );
      state.temp_country_zone = [...state?.temp_country_zone, ...filteredItems];
    },
    [getCountryZone.rejected]: (state, action) => {
      state.loading = false;
      // state.data_country_zone = action.payload;
    },
  },
});

const { reducer } = contactSlice;
export default reducer;
export const { resetDataDetail } = contactSlice.actions;
