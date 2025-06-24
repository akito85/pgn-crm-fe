import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userHttpService from "../../services/userHttpService";
import { showModalError, showModalSuccess, validateError } from "../general_slice";
import { statusCode } from "../../../constants/statusCode";
import { errorBody, errorCode, errorMessage, hasValue } from "../../../utils";

const initialState = {
  data: null,
  loading: false,
  isFailed: false,
  data_detail: null,
  parentData: null,
  data_download: null,
  cost_center_data: null,
};
export const getDataAccessPaginate = createAsyncThunk(
  "GET_DATA_ACCESS_PAGINATE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/dah/paging/hierarchy?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const data = await userHttpService.getPagination(url);
      return data;
    } catch (error) {
      thunkAPI?.dispatch(validateError({ error: error, action: "GET_DATA_ACCESS_PAGINATE", back: false }))
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
export const getDetailDataAccess = createAsyncThunk(
  "GET_DETAIL_DATA_ACCESS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dah/detail/hierarchy/${id}`;
      const data = await userHttpService.getDetail(url);
      return data?.data;
    } catch (error) {
      thunkAPI?.dispatch(validateError({ error: error, action: "GET_DETAIL_DATA_ACCESS", back: false }))
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
export const downloadDataAccess = createAsyncThunk(
  "DOWNLOAD_DATA_ACCESS_VIEW",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/dah/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI?.dispatch(validateError({ error: error, action: "DOWNLOAD_DATA_ACCESS_VIEW", back: false }))
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
export const downloadDetail = createAsyncThunk(
  "DOWNLOAD_DATA_ACCESS",
  async ({ id, type }, thunkAPI) => {
    try {
      let url = ``;
      if (type === "excel") {
        url = `/v1/dbs/api/dah/download/${id}`;
      } else {
        url = `/v1/dbs/api/dah/download-pdf/${id}`;
      }
      const data = await userHttpService.downloadData(url);
      return data;
    } catch (error) {
      thunkAPI?.dispatch(validateError({ error: error, action: "DOWNLOAD_DATA_ACCESS", back: false }))
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const createDataAccess = createAsyncThunk(
  "CREATE_DATA_ACCESS",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/dah/create";
      const data = await userHttpService.createData(url, body);
      const successMessage = {
        title: "Successfull",
        description: data?.message,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: errorBody(errorCode(error), 'created', errorMessage(error)), action: "CREATE_DATA_ACCESS", back: false }))

      // if (statusCode?.includes(error?.response?.data?.code)) {
      //   thunkAPI?.dispatch(validateError({ error: error, action: "CREATE_DATA_ACCESS", back: false }))
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `Your data was not created. ${error?.response?.data?.message}. Please try again.`,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody));
      // }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const dupliacateDataAccess = createAsyncThunk(
  "DUPLICATION_DATA_ACCESS",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/dah/duplicate";
      const data = await userHttpService.createData(url, body);
      const successMessage = {
        title: "Successfull",
        description: data?.message,
        return: false
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: errorBody(errorCode(error), 'duplicated', errorMessage(error)), action: "DUPLICATION_DATA_ACCESS", back: false }))

      // if (statusCode?.includes(error?.response?.data?.code)) {
      //   thunkAPI?.dispatch(validateError({ error: error, action: "DUPLICATION_DATA_ACCESS", back: false }))
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `Your data was not duplicated. ${error?.response?.data?.message}. Please try again.`,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody));
      // }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
export const activationDataAccess = createAsyncThunk(
  "ACTIVATION_DATA_ACCESS",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/dah/active";
      const data = await userHttpService.updateData(url, body);
      const successMessage = {
        title: "Successfull",
        return: false,
        description: data?.message,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: errorBody(errorCode(error), 'activated', errorMessage(error)), action: "ACTIVATION_DATA_ACCESS", back: false }))

      // const errorLog = error?.response?.data?.code || error?.response?.status
      // if (statusCode?.includes(errorLog)) {
      //   thunkAPI?.dispatch(validateError({ error: error, action: "ACTIVATION_DATA_ACCESS", back: false }))
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `Your data was not activated. ${error?.response?.data?.message}. Please try again.`,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody));
      // }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);
export const updateDataAccess = createAsyncThunk(
  "UPDATE_DATA_ACCES",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/dah/update-hierarchy";
      const data = await userHttpService.updateData(url, body);
      const successMessage = {
        title: "Successfull",
        description: data?.message,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: errorBody(errorCode(error), 'updated', errorMessage(error)), action: "UPDATE_DATA_ACCES", back: false }))

      // if (statusCode?.includes(error?.response?.data?.code)) {
      //   thunkAPI?.dispatch(validateError({ error: error, action: "UPDATE_DATA_ACCES", back: false }))
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `Your data was not updated. ${error?.response?.data?.message}. Please try again.`,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody));
      // }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
export const getDetailCostCenter = createAsyncThunk(
  "GET_DETAIL_COST_CENTER",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/dah/detail/${id}`;
      const data = await userHttpService.getDetail(url);
      return data;
    } catch (error) {
      thunkAPI?.dispatch(validateError({ error: error, action: "GET_DETAIL_COST_CENTER", back: false }))
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);
export const activationCostCenter = createAsyncThunk(
  "ACTIVATION_COST_CENTER",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/dah/inactive";
      const data = await userHttpService.updateData(url, body);
      return data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: errorBody(errorCode(error), 'activated', errorMessage(error)), action: "ACTIVATION_COST_CENTER", back: false }))

      // if (statusCode?.includes(error?.response?.status) && hasValue(error?.response?.data) === false) {
      //   thunkAPI?.dispatch(validateError({ error: error, action: "ACTIVATION_COST_CENTER", back: false }))
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     code: errorCode(error),
      //     description: `Your data was not activated. ${error?.response?.data?.message}. Please try again.`,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody));
      // }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);
export const getAllCostCenter = createAsyncThunk(
  "GET_ALL_COST_CENTER",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/costcenter/getParentCostCenter";
      const data = await userHttpService.getAll(url);
      return data?.data;
    } catch (error) {
      thunkAPI?.dispatch(validateError({ error: error, action: "GET_ALL_COST_CENTER", back: false }))
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
const dataAccessSlice = createSlice({
  name: "data_access",
  initialState,
  extraReducers: {
    // download entity
    [downloadDataAccess.pending]: (state) => {
      state.loading = true;
    },
    [downloadDataAccess.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [downloadDataAccess.rejected]: (state) => {
      state.loading = false;
    },
    [downloadDetail.pending]: (state, action) => {
      state.loading = true;
    },
    [downloadDetail.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [downloadDetail.rejected]: (state, action) => {
      state.loading = false;
    },
    [getDataAccessPaginate.pending]: (state, action) => {
      state.loading = true;
    },
    [getDataAccessPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getDataAccessPaginate.rejected]: (state, action) => {
      state.loading = false;
    },
    [getDetailDataAccess.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailDataAccess.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailDataAccess.rejected]: (state, action) => {
      state.loading = false;
    },
    [createDataAccess.pending]: (state, action) => {
      state.loading = true;
    },
    [createDataAccess.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    [createDataAccess.rejected]: (state, action) => {
      state.loading = false;
    },
    [dupliacateDataAccess.pending]: (state, action) => {
      state.loading = true;
    },
    [dupliacateDataAccess.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    [dupliacateDataAccess.rejected]: (state, action) => {
      state.loading = false;
    },
    [activationDataAccess.pending]: (state, action) => {
      state.loading = true;
    },
    [activationDataAccess.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    [activationDataAccess.rejected]: (state, action) => {
      state.loading = false;
    },
    [updateDataAccess.pending]: (state, action) => {
      state.loading = true;
    },
    [updateDataAccess.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    [updateDataAccess.rejected]: (state, action) => {
      state.loading = false;
    },
    [getDetailCostCenter.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailCostCenter.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getDetailCostCenter.rejected]: (state, action) => {
      state.loading = false;
    },
    [activationCostCenter.pending]: (state, action) => {
      state.loading = true;
    },
    [activationCostCenter.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [activationCostCenter.rejected]: (state, action) => {
      state.loading = false;
    },
    [getAllCostCenter.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllCostCenter.fulfilled]: (state, action) => {
      state.loading = false;
      state.cost_center_data = action.payload;
    },
    [getAllCostCenter.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

const { reducer } = dataAccessSlice;
export default reducer;
