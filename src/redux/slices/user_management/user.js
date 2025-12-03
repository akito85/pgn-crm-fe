import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userHttpService from "../../services/userHttpService";
import { showModalSuccess, validateError } from "../general_slice";
import { errorBody, errorCode, errorMessage, hasValue } from "../../../utils";

const initialState = {
  data: null,
  data_status: null,
  data_detail: null,
  data_employee: null,
  data_user_level: null,
  data_group_access: null,
  data_auth_type: null,
  data_user_type: null,
  data_user: null,
  loading: false,
  data_employee_id: [],
  data_list_upload: null,
};

export const getListUser = createAsyncThunk(
  "GET_LIST_USER",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/mu/get-all";
      const response = await userHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_LIST_USER", back: false }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getDetailUser = createAsyncThunk(
  "GET_DETAIL_USER",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/mu/detail/${id}`;
      const data = await userHttpService.getDetail(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DETAIL_USER",
          back: true,
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const getDetailUpdateUser = createAsyncThunk(
  "GET_DETAIL_USER",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/mu/view-update/${id}`;
      const data = await userHttpService.getDetail(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DETAIL_USER",
          back: true,
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const createUser = createAsyncThunk(
  "CREATE_USER",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/mu/create-user";
      const response = await userHttpService.createData(url, body);
      const successMessage = {
        title: "Successfull",
        description: response?.message,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "CREATE_USER",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const updateUser = createAsyncThunk(
  "UPDATE_USER",
  async (data, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/mu/update-user";
      const response = await userHttpService.updateData(url, data);
      const successMessage = {
        title: "Successfull",
        description: "Your data has been updated",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "updated", errorMessage(error)),
          action: "UPDATE_USER",
          back: false,
        }),
      );

      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const inactiveUser = createAsyncThunk(
  "INACTIVE_USER",
  async (body, thunkAPI) => {
    let status = body?.activate === "ACTIVE" ? "inactivated" : "activated";
    try {
      const url = "/v1/dbs/api/mu/active-inactivate";
      const data = await userHttpService.activationWithRemark(url, body);
      const successMessage = {
        title: "Successfull",
        description: `Your data has been ${status}`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return data.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), status, errorMessage(error)),
          action: "INACTIVE_USER",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  },
);

export const donwloadedExcel = createAsyncThunk(
  "DOWNLOAD_USER_EXCEL",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/mu/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_USER_EXCEL",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const downloadTemplate = createAsyncThunk(
  "DOWNLOAD_TEMPLATE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/mu/downloadTemplate";
      const data = await userHttpService.downloadData(url);
      return data?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "DOWNLOAD_TEMPLATE", back: false }),
      );

      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const getAllUserPaginate = createAsyncThunk(
  "GET_ALL_USER_PAGINATE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "userId~desc" : sort;
      const url = `/v1/dbs/api/mu/view-paging?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_USER_PAGINATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue([]);
    }
  },
);

export const uploadUser = createAsyncThunk(
  "UPLOAD_USER",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/mu/upload/step1";
      const onProgress = body.onProgress;
      const formData = new FormData();
      formData.append("document", body?.image);
      const dataRequest = formData;
      const data = await userHttpService.uploadImage(
        url,
        dataRequest,
        onProgress,
      );
      return data;
    } catch (e) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(e), "updated", errorMessage(e)),
          action: "UPLOAD_USER",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(e?.response);
    }
  },
);
export const getDetailGroupAccess = createAsyncThunk(
  "GET_DETAIL_GROUP_ACCESS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/mu/detail/group-access/${id}`;
      const data = await userHttpService.getDetail(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DETAIL_GROUP_ACCESS",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue([]);
    }
  },
);

export const getAllEmployees = createAsyncThunk(
  "GET_ALL_EMPLOYEE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/mu/get-all-employee/${id}`;
      const data = await userHttpService.getAll(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_EMPLOYEE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue([]);
    }
  },
);
export const getAllGroupAccess = createAsyncThunk(
  "GET_ALL_GROUP_ACCES",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/mu/get-group-access-by-userlevel/${id}`;
      const data = await userHttpService.getAll(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_GROUP_ACCESS",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue([]);
    }
  },
);
export const getAllUserLevel = createAsyncThunk(
  "GET_ALL_USER_LEVEL",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/mu/get-user-level";
      const data = await userHttpService.getAll(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_USER_LEVEL",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue([]);
    }
  },
);
export const getAllAuthType = createAsyncThunk(
  "GET_ALL_AUTH_TYPE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/mu/get-auth-type";
      const data = await userHttpService.getAll(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_AUTH_TYPE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue([]);
    }
  },
);
export const getAllUserType = createAsyncThunk(
  "GET_ALL_USER_TYPE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/mu/get-user-type";
      const data = await userHttpService.getAll(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_USER_TYPE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue([]);
    }
  },
);

export const finalUploadUser = createAsyncThunk(
  "FINAL_UPLOAD_USER",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/mu/upload/step2";
      const data = await userHttpService.createData(url, body);
      const successMessage = {
        title: "Successfull",
        description: "Your data has been created",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return data?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "UPLOAD_USER",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const generatePasswordLink = createAsyncThunk(
  "GENERATE_PASSWORD_LINK",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/mu/generate-link";
      const data = await userHttpService.createData(url, body);
      return data?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "GENERATE_PASSWORD_LINK",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const getEmployeeById = createAsyncThunk(
  "GET_EMPLOYEE_BY_ID",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/mu/get-employee-by-id/${id}`;
      const response = await userHttpService.getDetail(url);
      return response;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_EMPLOYEE_BY_ID",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue([]);
    }
  },
);

export const changeAuthType = createAsyncThunk(
  "CHANGE_AUTH_TYPE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/mu/change-auth-type`;
      const response = await userHttpService.createData(url, body);
      const successMessage = {
        title: "Successfull",
        description: "Your data has been updated",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "CHANGE_AUTH_TYPE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getUserPositionTo = createAsyncThunk(
  "GET_USER_POSITION_TO",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/forward-task/forward-to/${id}`;
      if (hasValue(id)) {
        const response = await userHttpService.getDetail(url);
        if (errorMessage(response) === "No Position Can't Be Forward") {
          throw response;
        } else {
          return response.data;
        }
      }
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "forwaded", errorMessage(error)),
          action: "GET_USER_POSITION_TO",
        }),
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data,
      );
    }
  },
);

export const forwardTaskUser = createAsyncThunk(
  "FORWARD_TASK_USER",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/forward-task/forward`;
      const data = await userHttpService.createData(url, body);
      const successBody = {
        title: "Successfull",
        description: `Your data has been forwarded`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "forwarded", errorMessage(error)),
          action: "FORWARD_TASK_USER",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setClearData: (state) => {
      state.data_list_upload = null;
    },
  },
  extraReducers: {
    // get user reducer
    [getListUser.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [getListUser.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.data_employee_id = [];
      state.loading = false;
      state.isFailed = false;
    },
    [getListUser.rejected]: (state) => {
      state.loading = false;
    },

    // detail user reducers
    [getDetailUser.pending]: (state, action) => {
      state.data_user = action.payload;
      state.loading = true;
      state.isFailed = false;
    },
    [getDetailUser.fulfilled]: (state, action) => {
      state.data_user = action.payload;
      state.loading = false;
      state.isFailed = false;
    },
    [getDetailUser.rejected]: (state, action) => {
      state.data_user = action.payload;
      state.loading = false;
      state.isFailed = true;
    },
    // create user reducer
    [createUser.pending]: (state, action) => {
      state.data_status = action.payload;
      state.loading = true;
    },
    [createUser.fulfilled]: (state, action) => {
      state.data_status = action.payload;
      state.loading = false;
    },
    [createUser.rejected]: (state, action) => {
      state.data_status = action.payload;
      state.loading = false;
    },
    // update user reducer
    [updateUser.pending]: (state, action) => {
      state.data_status = action.payload;
      state.loading = true;
    },
    [updateUser.fulfilled]: (state, action) => {
      state.data_status = action.payload;
      state.loading = false;
    },
    [updateUser.rejected]: (state, action) => {
      state.data_status = action.payload;
      state.loading = false;
    },

    // inactive
    [inactiveUser.pending]: (state) => {
      state.loading = true;
    },
    [inactiveUser.fulfilled]: (state, action) => {
      state.data_status = action.payload;
      state.loading = false;
    },
    [inactiveUser.rejected]: (state, action) => {
      state.data_status = action.payload;
      state.loading = false;
      state.isFailed = true;
    },
    // download excel
    [donwloadedExcel.pending]: (state) => {
      state.loading = true;
    },
    [donwloadedExcel.fulfilled]: (state) => {
      state.loading = false;
    },
    [donwloadedExcel.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },
    // get all user paginate
    [getAllUserPaginate.pending]: (state, action) => {
      state.data = action.payload;
      state.data_employee_id = [];
      state.loading = true;
    },
    [getAllUserPaginate.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getAllUserPaginate.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    // upload user
    [uploadUser.pending]: (state, action) => {
      state.data_list_upload = action.payload;
      // state.loading = true;
    },
    [uploadUser.fulfilled]: (state, action) => {
      state.data_list_upload = action.payload;
      state.loading = false;
    },
    [uploadUser.rejected]: (state, action) => {
      state.data_list_upload = action.payload;
      state.loading = false;
    },
    // detail group access
    [getDetailGroupAccess.pending]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = true;
    },
    [getDetailGroupAccess.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailGroupAccess.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    // get all group access
    [getAllGroupAccess.pending]: (state, action) => {
      state.data_group_access = action.payload;
      state.loading = true;
    },
    [getAllGroupAccess.fulfilled]: (state, action) => {
      state.data_group_access = action.payload;
      state.loading = false;
    },
    [getAllGroupAccess.rejected]: (state, action) => {
      state.data_group_access = action.payload;
      state.loading = false;
    },
    // get all employee
    [getAllEmployees.pending]: (state, action) => {
      state.data_employee = action.payload;
      state.loading = true;
    },
    [getAllEmployees.fulfilled]: (state, action) => {
      state.data_employee = action.payload;
      state.loading = false;
    },
    [getAllEmployees.rejected]: (state, action) => {
      state.data_employee = action.payload;
      state.loading = false;
    },
    // get all user level
    [getAllUserLevel.pending]: (state, action) => {
      state.data_user_level = action.payload;
      state.loading = true;
    },
    [getAllUserLevel.fulfilled]: (state, action) => {
      state.data_user_level = action.payload;
      state.loading = false;
    },
    [getAllUserLevel.rejected]: (state, action) => {
      state.data_user_level = action.payload;
      state.loading = false;
    },
    // get all auth type
    [getAllAuthType.pending]: (state, action) => {
      state.data_auth_type = action.payload;
      state.loading = true;
    },
    [getAllAuthType.fulfilled]: (state, action) => {
      state.data_auth_type = action.payload;
      state.loading = false;
    },
    [getAllAuthType.rejected]: (state, action) => {
      state.data_auth_type = action.payload;
      state.loading = false;
    },
    // get all user type
    [getAllUserType.pending]: (state, action) => {
      state.data_user_type = action.payload;
      state.loading = true;
    },
    [getAllUserType.fulfilled]: (state, action) => {
      state.data_user_type = action.payload;
      state.loading = false;
    },
    [getAllUserType.rejected]: (state, action) => {
      state.data_user_type = action.payload;
      state.loading = false;
    },
    // generate link password
    [generatePasswordLink.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [generatePasswordLink.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isSuccess = true;
      state.loading = false;
    },
    [generatePasswordLink.rejected]: (state) => {
      state.loading = false;
    },
    // downlaod template
    [downloadTemplate.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [downloadTemplate.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [downloadTemplate.rejected]: (state) => {
      state.loading = false;
    },
    // final upload user
    [finalUploadUser.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [finalUploadUser.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [finalUploadUser.rejected]: (state) => {
      state.loading = false;
    },
    // get employee by id
    [getEmployeeById.pending]: (state) => {
      state.loading = true;
    },
    [getEmployeeById.fulfilled]: (state, action) => {
      state.data_employee_id = action.payload;
      state.loading = false;
    },
    [getEmployeeById.rejected]: (state) => {
      state.loading = false;
    },
    // get detail update uesr
    [getDetailUpdateUser.pending]: (state) => {
      state.loading = true;
    },
    [getDetailUpdateUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_user = action.payload;
    },
    [getDetailUpdateUser.rejected]: (state, action) => {
      state.loading = false;
      state.data_user = action.payload;
    },

    // get user position to
    [getUserPositionTo.pending]: (state) => {
      state.loading = true;
    },
    [getUserPositionTo.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_user = action.payload;
    },
    [getUserPositionTo.rejected]: (state, action) => {
      state.loading = false;
      state.data_user = action.payload;
    },

    // forward user
    [forwardTaskUser.pending]: (state) => {
      state.loading = true;
    },
    [forwardTaskUser.fulfilled]: (state) => {
      state.loading = false;
      // state.data_user = action.payload;
    },
    [forwardTaskUser.rejected]: (state) => {
      state.loading = false;
      // state.data_user = action.payload;
    },
  },
});

const { reducer } = userSlice;
export default reducer;
export const { setClearData } = userSlice.actions;
