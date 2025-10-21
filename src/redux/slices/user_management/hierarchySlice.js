import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userHttpService from "../../services/userHttpService";
import { showModalSuccess, validateError } from "../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../utils";

const initialState = {
  data: [],
  data_detail: {},
  data_code: [],
  data_type: [],
  data_DDL: [],
  data_employee: null,
  loading: false,
};

export const inactiveAppHierarchy = createAsyncThunk(
  "INACTIVE_APPROVAL_HIERARCHY",
  async ({ id, body }, thunkAPI) => {
    let status = body?.status === "ACTIVE" ? "inactivated" : "activated";
    try {
      let reqBody = {
        id: id,
        remark: body.remark,
      };
      const url = `/v1/dbs/api/apphier/active/inactive/`;
      const response = await userHttpService.activationWithRemark(url, reqBody);
      const message = response.message;
      const successMessage = {
        title: "Successfull",
        description: `${message}`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(response), status, errorMessage(response)),
          action: "CREATE_APPROVAL_HIEARARCHY",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getApprovHierarchyPaginate = createAsyncThunk(
  "GET_ALL_APPROVAL_PAGINATE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/apphier/paging?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI?.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_APPROVAL_PAGINATE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const detailPositionHierarchy = createAsyncThunk(
  "GET_APPROVAL_HIERARCHY_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/apphier/${id}`;
      const response = await userHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI?.dispatch(
        validateError({
          error: error,
          action: "GET_APPROVAL_HIERARCHY_DETAIL",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getAppCode = createAsyncThunk(
  "GET_APPROVAL_HIERARCHY_CODE",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/apphier/code";
      const data = await userHttpService.getAll(url);
      return data;
    } catch (error) {
      thunkAPI?.dispatch(
        validateError({
          error: error,
          action: "GET_APPROVAL_HIERARCHY_CODE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const createHierarchy = createAsyncThunk(
  "CREATE_APPROVAL_HIEARARCHY",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/apphier/create";
      const data = await userHttpService.createData(url, body);
      const successBody = {
        title: "Successfull",
        description: `Your data has been Created`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "CREATE_APPROVAL_HIEARARCHY",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const downloadHierarchy = createAsyncThunk(
  "DOWNLOAD_APPROVAL",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/apphier/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI?.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_APPROVAL",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getPositionDDL = createAsyncThunk(
  "GET_POSITION _DDL",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/positionhierarchy/position";
      const data = await userHttpService.getAll(url);
      return data;
    } catch (error) {
      thunkAPI?.dispatch(
        validateError({ error: error, action: "GET_POSITION", back: false }),
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const getEmployeeByIdPosition = createAsyncThunk(
  "GET_EMPLOYEE_BY_ID",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/positionhierarchy/employee-positions/${id}`;
      const data = await userHttpService.getDetail(url);
      return data;
    } catch (error) {
      thunkAPI?.dispatch(
        validateError({
          error: error,
          action: "GET_EMPLOYEE_BY_ID",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const getAppType = createAsyncThunk(
  "GET_APPROVAL_HIERARCHY_TYPE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/apphier/type";
      const data = await userHttpService.getAll(url);
      return data;
    } catch (error) {
      thunkAPI?.dispatch(
        validateError({
          error: error,
          action: "GET_APPROVAL_HIERARCHY_TYPE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);
export const updateAppHier = createAsyncThunk(
  "UPDATE_APPHIER",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/apphier/update";
      const data = await userHttpService.updateData(url, body);
      const successBody = {
        title: "Successfull",
        description: `Your data has been updated`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "updated", errorMessage(error)),
          action: "UPDATE_APPHIER",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

const approvHierarchy = createSlice({
  name: "apphierarchy",
  initialState,
  extraReducers: {
    //get all Approval Hierarchy paginate
    [getApprovHierarchyPaginate.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data = action.payload;
      state.loading = true;
    },
    [getApprovHierarchyPaginate.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = false;
    },
    [getApprovHierarchyPaginate.rejected]: (state, action) => {
      state.data = action.payload;
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = false;
    },

    // inactive app
    [inactiveAppHierarchy.pending]: (state, action) => {
      state.loading = true;
    },
    [inactiveAppHierarchy.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveAppHierarchy.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
    },

    // detailPositionHierarchy
    [detailPositionHierarchy.pending]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = true;
    },
    [detailPositionHierarchy.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [detailPositionHierarchy.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    //Get app hierarchy code
    [getAppCode.pending]: (state, action) => {
      state.loading = true;
    },
    [getAppCode.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.data_code = action.payload;
      state.loading = false;
    },
    [getAppCode.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
    },

    [getAppType.pending]: (state, action) => {
      state.loading = true;
    },
    [getAppType.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.data_type = action.payload;
      state.loading = false;
    },
    [getAppType.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
    },

    //create
    [createHierarchy.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [createHierarchy.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createHierarchy.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    //detail ddl
    [getPositionDDL.pending]: (state, action) => {
      // state.data_DDL = action.payload;
      state.loading = true;
    },
    [getPositionDDL.fulfilled]: (state, action) => {
      state.data_DDL = action.payload;
      state.loading = false;
    },
    [getPositionDDL.rejected]: (state, action) => {
      state.data_DDL = action.payload;
      state.loading = false;
    },

    // detail employee by id
    [getEmployeeByIdPosition.pending]: (state, action) => {
      // state.data_DDL = action.payload;
      state.loading = true;
    },
    [getEmployeeByIdPosition.fulfilled]: (state, action) => {
      state.data_employee = action.payload;
      state.loading = false;
    },
    [getEmployeeByIdPosition.rejected]: (state, action) => {
      state.data_employee = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = approvHierarchy;
export default reducer;
