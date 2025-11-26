import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userHttpService from "../../services/userHttpService";
import { showModalSuccess, validateError } from "../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../utils";
const initialState = {
  data: [],
  data_detail: null,
  data_tax: null,
  loading: false,
  allow_file: null,
};

export const getListEntity = createAsyncThunk(
  "GET_LIST_ENTITY",
  async (_, thunkAPI) => {
    try {
      const url = `/api/entity/get`;
      const response = await userHttpService.getAll(url);
      return response;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_LIST_ENTITY", back: false })
      );

      return thunkAPI.rejectWithValue(error.response);
    }
  }
);
export const getAllEntityPaginate = createAsyncThunk(
  "GET_ALL_ENTITY_PAGINATE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/entity/paging?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_ENTITY_PAGINATE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);
export const createEntity = createAsyncThunk(
  "CREATE_ENTITY",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/entity/create`;
      const response = await userHttpService.createData(url, body);
      const successMessage = {
        title: "Successfull",
        description: "Your data has been created",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "CREATE_ENTITY",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);
export const inactiveEntity = createAsyncThunk(
  "INACTIVE_ENTITY",
  async (body, thunkAPI) => {
    let status = body?.status === "ACTIVE" ? "inactivated" : "activated";
    try {
      const url = `/v1/dbs/api/entity/inactive/active`;
      const data = await userHttpService.activationWithRemark(url, body);
      const successMessage = {
        title: "Successfull",
        description: data?.message,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), status, errorMessage(error)),
          action: "INACTIVE_ENTITY",
          back: false,
        })
      );

      // const message =
      //   (error.response &&
      //     error.response.data &&
      //     error.response.data.message) ||
      //   error.message ||
      //   error.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //   thunkAPI.dispatch(setBodyError(error));
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `Your data was not ${status}. ${message}. Please try again.`,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody));
      // }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
export const getDetailEntity = createAsyncThunk(
  "GET_DETAIL_ENTITY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/entity/detail/${id}`;
      const data = await userHttpService.getDetail(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DETAIL_ENTITY",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);
export const deleteEntity = createAsyncThunk(
  "DELETE_ENTITY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/entity/${id}/delete`;
      const response = await userHttpService.deleteData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "DELETE_ENTITY", back: false })
      );

      // const message =
      //   (error.response && error.response.data && error.response.data.message) ||
      //   error.message ||
      //   error.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //   thunkAPI.dispatch(setBodyError(error));
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `${message}. Please try again.`,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody));
      // }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);
export const updateEntity = createAsyncThunk(
  "UPDATE_ENTITY",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/entity/update`;
      const data = await userHttpService.updateData(url, body);
      const successMessage = {
        title: "Successfull",
        description: "Your data has been updated",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "updated", errorMessage(error)),
          action: "UPDATE_ENTITY",
          back: false,
        })
      );

      // const message =
      //   (error.response &&
      //     error.response.data &&
      //     error.response.data.message) ||
      //   error.message ||
      //   error.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      // thunkAPI.dispatch(validateError({ error: error, action:"UPDATE_ENTITY", back: false}))
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `Your data was not updated. ${error?.response?.data?.message}. Please try again.`,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody));
      // }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);
export const downloadExcel = createAsyncThunk(
  "DOWNLOAD_ENTITY_EXCEL",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/entity/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI?.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_ENTITY_EXCEL",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);
export const getDetailTaxEntity = createAsyncThunk(
  "DETAIL_TAX_ENTITY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/entity/taxDetail/${id}`;
      const data = await userHttpService.getDetail(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DETAIL_TAX_ENTITY",
          back: false,
        })
      );

      // const message =
      //   (error.response && error.response.data && error.response.data.message) ||
      //   error.message ||
      //   error.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //   thunkAPI.dispatch(setBodyError(error));
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `${message}. Please try again.`,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody));
      // }
      thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const inactiveTax = createAsyncThunk(
  "INACTIVE_TAX",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/entity/inactivateTax/${id}`;
      const data = await userHttpService.deleteData(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "updated", errorMessage(error)),
          action: "INACTIVE_TAX",
          back: false,
        })
      );

      // const message =
      //   (error.response && error.response.data && error.response.data.message) ||
      //   error.message ||
      //   error.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //   thunkAPI.dispatch(setBodyError(error));
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `Your data was not updated. ${message}. Please try again.`,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody));
      // }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const checkAllowingFile = createAsyncThunk(
  "CHECK_ALLOWING_FILE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/entity/config-file`;
      const data = await userHttpService.getAll(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "CHECK_ALLOWING_FILE",
          back: false,
        })
      );

      // const message =
      //   (error.response && error.response.data && error.response.data.message) ||
      //   error.message ||
      //   error.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      //   thunkAPI.dispatch(setBodyError(error));
      // } else {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `${message}. Please try again.`,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody));
      // }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
const entitySlice = createSlice({
  name: "entity",
  initialState,
  extraReducers: {
    // get all entity
    [getListEntity.fulfilled]: (state, action) => {
      state.data = action.payload.result;
      state.loading = false;
    },
    [getListEntity.rejected]: (state) => {
      state.data = null;
      state.loading = false;
    },
    [getListEntity.pending]: (state) => {
      state.loading = true;
    },
    // get all entity paginate
    [getAllEntityPaginate.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [getAllEntityPaginate.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getAllEntityPaginate.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    // create entity
    [createEntity.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [createEntity.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createEntity.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    // inactive entity
    [inactiveEntity.pending]: (state) => {
      state.loading = true;
    },
    [inactiveEntity.fulfilled]: (state) => {
      state.loading = false;
    },
    [inactiveEntity.rejected]: (state) => {
      state.loading = false;
    },
    // detail entity
    [getDetailEntity.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [getDetailEntity.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailEntity.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    // delete entity
    [deleteEntity.pending]: (state) => {
      state.loading = true;
    },
    [deleteEntity.fulfilled]: (state) => {
      state.loading = false;
    },
    [deleteEntity.rejected]: (state) => {
      state.loading = false;
    },
    // update entity
    [updateEntity.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [updateEntity.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [updateEntity.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    // download entity
    [downloadExcel.pending]: (state) => {
      state.loading = true;
    },
    [downloadExcel.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadExcel.rejected]: (state) => {
      state.loading = false;
    },
    // detail tax entity
    [getDetailTaxEntity.pending]: (state) => {
      state.loading = true;
    },
    [getDetailTaxEntity.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_tax = action.payload;
    },
    [getDetailTaxEntity.rejected]: (state) => {
      state.loading = false;
    },
    [inactiveTax.pending]: (state) => {
      state.loading = true;
    },
    [inactiveTax.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_tax = action.payload;
    },
    [inactiveTax.rejected]: (state) => {
      state.loading = false;
    },

    // check allowing file
    [checkAllowingFile.pending]: (state) => {
      state.loading = true;
    },
    [checkAllowingFile.fulfilled]: (state, action) => {
      state.loading = false;
      state.allow_file = action.payload;
    },
    [checkAllowingFile.rejected]: (state, action) => {
      state.loading = false;
      state.allow_file = action.payload;
    },
  },
});

const { reducer } = entitySlice;
export default reducer;
