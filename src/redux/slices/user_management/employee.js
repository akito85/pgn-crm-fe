import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import userHttpService from "../../services/userHttpService";
import {
  showModalSuccess,
  validateError,
} from "../general_slice";
import { errorBody, errorCode, errorMessage, hasValue } from "../../../utils";

const initialState = {
  data: null,
  data_detail: {},
  data_ass: {},
  // data_info: [],
  data_emp: [],
  data_job: {},
  data_post: [],
  data_pending: [],
  data_to: [],
  data_forward_emp: [],
  loading: false,
  message: null,
  isFailed: false,
  isSuccess: false,
  dataUpload: null,
  data_list_upload: null,
  data_status: null,
};

export const getAllEmployeePaginate = createAsyncThunk(
  "GET_ALL_EMPLOYEE_PAGINATE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/employees/viewPaging?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_EMPLOYEE_PAGINATE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const downloadEmployee = createAsyncThunk(
  "DOWNLOAD_ACTION",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/employees/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_ACTION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response);
    }
  }
);
export const getEmployeeDetail = createAsyncThunk(
  "GET_EMPLOYEE_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/employees/employeeDetail/${id}`;
      const response = await userHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_EMPLOYEE_DETAIL",
          back: true
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAssignmentDetail = createAsyncThunk(
  "GET_ASSIGNMENT_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/employees/assignmentDetail/${id}`;
      const response = await userHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ASSIGNMENT_DETAIL",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getForwardTaskDetail = createAsyncThunk(
  "GET_FORWARD_TASK_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/forward-task/detail/${id}`;
      const response = await userHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_FORWARD_TASK_DETAIL" })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getPendingTask = createAsyncThunk(
  "GET_PENDING_TASK",
  async (id, thunkAPI) => {
    // console.log(typeof employeeCode, "employeeCode !!");
    try {
      // const searchParams = search === undefined ? "" : search;
      // const sortParams =
      //   sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/forward-task/pending/${id}`;
      const response = await userHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_PENDING_TASK" }));
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getTo = createAsyncThunk("GET_TO", async (id, thunkAPI) => {
  try {
    const url = `/v1/dbs/api/forward-task/forward-to/${id}`;
    if (hasValue(id)) {
      const response = await userHttpService.getDetail(url);
      return response?.data?.toPosition?.map(item => (
        {
          ...item,
          uniqueId: item?.employeeCodeForward + item?.positionIdForward
        }
      ))
    }
  } catch (error) {
    thunkAPI.dispatch(validateError({ error, action: "GET_TO" }));
    return thunkAPI.rejectWithValue(
      error.response.data.code === 419 ? null : error.response.data
    );
  }
});

export const createForwardTask = createAsyncThunk(
  "CREATE_FORWARD_TASK",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/forward-task/forward`;
      const data = await userHttpService.createData(url, body);
      const successBody = {
        title: "Successfull",
        description: `Your data has been created`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: errorBody(errorCode(error), 'created', errorMessage(error)), action: "CREATE_FORWARD_TASK", back: false }))
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// export const getForwardTaskByEmp = createAsyncThunk(
//   "GET_FORWARD_TASK_BY_EMPLOYEE",
//   async ({ search, page, pageSize, sort }, thunkAPI) => {
//     try {
//       const searchParams = search === undefined ? "" : search;
//       const sortParams = sort === undefined || sort === "" ? "id~desc" : sort;
//       const url = `/v1/dbs/api/forward-task?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
//       const response = await userHttpService.getPagination(url);
//       return response.data;
//     } catch (error) {
//       thunkAPI.dispatch(
//         validateError({ error, action: "GET_FORWARD_TASK_BY_EMPLOYEE" })
//       );
//       return thunkAPI.rejectWithValue(
//         error.response.data.code === 419 ? null : error.response.data
//       );
//     }
//   }
// );

export const createEmployee = createAsyncThunk(
  "CREATE_EMPLOYEE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/employees/createNewEmployee`;
      const data = await userHttpService.createData(url, body);
      const successBody = {
        title: "Successfull",
        description: `Your data has been created`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: errorBody(errorCode(error), 'created', errorMessage(error)), action: "CREATE_EMPLOYEE", back: false }))
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "UPDATE_EMPLOYEE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/employees/updateEmployee`;
      const data = await userHttpService.updateData(url, body);
      const successBody = {
        title: "Successfull",
        description: `Your data has been updated`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: errorBody(errorCode(error), 'updated', errorMessage(error)), action: "UPDATE_EMPLOYEE", back: false }))
      return thunk.rejectWithValue(error.response.data);
    }
  }
);

export const terminateEmployee = createAsyncThunk(
  "TERMINATE_EMPLOYEE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/employees/terminateEmployee`;
      const response = await userHttpService.terminateData(url, body);
      const successMessage = {
        title: "Successfull",
        description: "Your data has been terminate",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: errorBody(errorCode(error), 'terminated', errorMessage(error)), action: "TERMINATE_EMPLOYEE", back: false }))
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListEmpType = createAsyncThunk(
  "GET_LIST_EMPLOYEE_TYPE",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/employees/ListEmpType`;
      const data = await userHttpService.getAll(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_LIST_EMPLOYEE_TYPE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListJob = createAsyncThunk(
  "GET_LIST_EMPLOYEE_JOB",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/employees/ListJob`;
      const data = await userHttpService.getAll(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_LIST_EMPLOYEE_JOB",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);
export const getListPosition = createAsyncThunk(
  "GET_LIST_EMPLOYEE_Position",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/employees/ListPosition`;
      const data = await userHttpService.getAll(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_LIST_EMPLOYEE_Position",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const downloadEmpTemlpate = createAsyncThunk(
  "DOWNLOAD_TEMPLATE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/employees/downloadEmpTemplate`;
      const data = await userHttpService.downloadData(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_TEMPLATE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const uploadEmployee = createAsyncThunk(
  "UPLOAD_EMPLOYEE",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/employees/UploadTemplate";
      const onProgress = body.onProgress;
      const formData = new FormData();
      formData.append("document", body?.image);
      const dataRequest = formData;
      const data = await userHttpService.uploadImage(
        url,
        dataRequest,
        onProgress
      );
      return data;
    } catch (e) {
      thunkAPI.dispatch(validateError({ error: errorBody(errorCode(e), 'updated', errorMessage(e)), action: "UPLOAD_EMPLOYEE", back: false }))
      return thunkAPI.rejectWithValue(e?.response);
    }
  }
);

export const saveUploadEmployee = createAsyncThunk(
  "SAVE_UPLOAD_EMPLOYEE",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/employees/uploadTemplate/Save";
      const data = await userHttpService.createData(url, body);
      const successBody = {
        title: "Successful",
        description: `Your file has been uploaded`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: errorBody(errorCode(error), 'uploaded', errorMessage(error)), action: "SAVE_UPLOAD_EMPLOYEE", back: false }))
      return thunk.rejectWithValue(error.response.data);
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setClearDataUpload: (state, action) => {
      state.data_list_upload = null;
    },
  },
  extraReducers: {
    //get all employee paginate reducer
    [getAllEmployeePaginate.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data = action.payload;
      state.loading = true;
    },
    [getAllEmployeePaginate.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = false;
    },
    [getAllEmployeePaginate.rejected]: (state, action) => {
      state.data = action.payload;
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = false;
    },
    // // get all employee
    // [getAllEmployee.pending]: (state, action) => {
    //   state.data = action.payload;
    //   state.loading = true;
    // },
    // [getAllEmployee.fulfilled]: (state, action) => {
    //   state.data = action.payload;
    //   state.loading = false;
    // },
    // [getAllEmployee.rejected]: (state, action) => {
    //   state.data = action.payload;
    //   state.loading = true;
    // },

    // get employee detail
    [getEmployeeDetail.pending]: (state, action) => {
      state.loading = true;
    },
    [getEmployeeDetail.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getEmployeeDetail.rejected]: (state, action) => {
      state.loading = false;
    },

    // get assignment detail
    [getAssignmentDetail.pending]: (state, action) => {
      state.loading = true;
    },
    [getAssignmentDetail.fulfilled]: (state, action) => {
      state.data_ass = action.payload;
      state.loading = false;
    },
    [getAssignmentDetail.rejected]: (state, action) => {
      state.loading = false;
    },

    // get detail forward task
    [getForwardTaskDetail.pending]: (state, action) => {
      state.loading = true;
    },
    [getForwardTaskDetail.fulfilled]: (state, action) => {
      state.data_info = action.payload;
      state.loading = false;
    },
    [getForwardTaskDetail.rejected]: (state, action) => {
      state.loading = false;
    },

    // get Pending forward task
    [getPendingTask.pending]: (state, action) => {
      state.loading = true;
    },
    [getPendingTask.fulfilled]: (state, action) => {
      state.data_pending = action.payload;
      state.loading = false;
    },
    [getPendingTask.rejected]: (state, action) => {
      state.loading = false;
    },

    // get To Forward Task
    [getTo.pending]: (state, action) => {
      state.loading = true;
    },
    [getTo.fulfilled]: (state, action) => {
      state.data_to = action.payload;
      state.loading = false;
    },
    [getTo.rejected]: (state, action) => {
      state.loading = false;
    },

    // terminate employee
    [terminateEmployee.pending]: (state, action) => {
      state.loading = true;
    },
    [terminateEmployee.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [terminateEmployee.rejected]: (state, action) => {
      state.data_status = action.payload;
      state.isFailed = true;
      state.loading = false;
    },

    // create empolyee
    [createEmployee.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createEmployee.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createEmployee.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // update action
    [updateEmployee.pending]: (state, action) => {
      state.loading = true;
    },
    [updateEmployee.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isSuccess = false;
    },
    [updateEmployee.rejected]: (state, action) => {
      state.loading = false;
    },

    //download

    [downloadEmployee.fulfilled]: (state, action) => {
      state.data_download = action.payload;
      // state.isSuccess = true;
      state.loading = false;
    },
    [downloadEmployee.rejected]: (state, action) => {
      state.isFailed = true;
      state.data_download = action.payload;
      state.loading = false;
    },
    [downloadEmployee.pending]: (state, action) => {
      state.loading = true;
    },
    //DOWNLOAD TEMPLATE
    [downloadEmpTemlpate.fulfilled]: (state, action) => {
      state.data_downloadTemp = action.payload;
      // state.isSuccess = true;
      state.loading = false;
    },
    [downloadEmpTemlpate.rejected]: (state, action) => {
      state.isFailed = true;
      state.data_downloadTemp = action.payload;
      state.loading = false;
    },
    [downloadEmpTemlpate.pending]: (state, action) => {
      state.loading = true;
    },

    //Get list  employee
    [getListEmpType.pending]: (state, action) => {
      state.loading = true;
    },
    [getListEmpType.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.data_emp = action.payload;
      state.loading = false;
    },
    [getListEmpType.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
    },

    //Get list  position
    [getListPosition.pending]: (state, action) => {
      state.loading = true;
    },
    [getListPosition.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.data_post = action.payload;
      state.loading = false;
    },
    [getListPosition.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
    },
    //Get list  job
    [getListJob.pending]: (state, action) => {
      state.loading = true;
    },
    [getListJob.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.data_job = action.payload;
      state.loading = false;
    },
    [getListJob.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
    },

    // upload employee
    [uploadEmployee.pending]: (state, action) => {
      state.data_list_upload = action.payload;
      // state.loading = true;
    },
    [uploadEmployee.fulfilled]: (state, action) => {
      state.data_list_upload = action.payload;
      state.loading = false;
    },
    [uploadEmployee.rejected]: (state, action) => {
      state.data_list_upload = action.payload;
      state.loading = false;
    },
    // save upload employee
    [saveUploadEmployee.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [saveUploadEmployee.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [saveUploadEmployee.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = employeeSlice;
export default reducer;
export const { setClearDataUpload } = employeeSlice.actions;
