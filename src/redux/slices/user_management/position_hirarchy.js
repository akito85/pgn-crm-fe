import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userHttpService from "../../services/userHttpService";
import { showModalSuccess, validateError } from "../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../utils";

const initialState = {
  data: null,
  data_detail: null,
  loading: false,
  data_position: null,
  data_employee: null,
};

// pagination position hierarchy
export const getPositionHierarchyPaginate = createAsyncThunk(
  "GET_POSITION_HIERARCHY_PAGINATE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      let url = `/v1/dbs/api/positionhierarchy/paging?page=${page}&size=${pageSize}&searchs=${searchParams}&sort=${sortParams}`;
      const response = await userHttpService.getPagination(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_POSITION_HIERARCHY_PAGINATE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);

// pagination position hierarchy
export const getPosition = createAsyncThunk(
  "GET_POSITION",
  async (_, thunkAPI) => {
    try {
      let url = "/v1/dbs/api/positionhierarchy/position";
      const response = await userHttpService.getAll(url);
      const mappingPosition = response?.data?.map((item) => ({
        ...item,
        name: item?.text,
      }));
      return mappingPosition;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_POSITION", back: false })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// detail position hierarchy
export const getDetailHierarchy = createAsyncThunk(
  "GET_DETAIL_HIERARCHY",
  async (id, thunkAPI) => {
    try {
      let url = `/v1/dbs/api/positionhierarchy/detail/${id}`;
      const response = await userHttpService.getDetail(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DETAIL_HIERARCHY",
          back: true,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// get detail position
export const getDetailPosition = createAsyncThunk(
  "GET_DETAIL_POSITION",
  async (id, thunkAPI) => {
    try {
      let url = `/v1/dbs/api/positionhierarchy/employee/${id}`;
      const response = await userHttpService.getDetail(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DETAIL_POSITION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// create func
export const createPositionHierarchy = createAsyncThunk(
  "CREATE_POSITION_HIERARCHY",
  async (body, thunkAPI) => {
    try {
      let url = "/v1/dbs/api/positionhierarchy/create";
      const response = await userHttpService.createData(url, body);
      const bodyMessage = {
        title: "Successfull",
        description: `Your data has been Created`,
      };
      thunkAPI.dispatch(showModalSuccess(bodyMessage));
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "CREATE_POSITION_HIERARCHY",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// update func
export const updatePositionHierarchy = createAsyncThunk(
  "UPDATE_POSITION_HIERARCHY",
  async (body, thunkAPI) => {
    try {
      let url = "/v1/dbs/api/positionhierarchy/update";
      const response = await userHttpService.updateData(url, body);
      const bodyMessage = {
        title: "Successfull",
        description: `Your data has been Updated`,
      };
      thunkAPI.dispatch(showModalSuccess(bodyMessage));
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "updated", errorMessage(error)),
          action: "UPDATE_POSITION_HIERARCHY",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// duplicate func
export const duplicatePositionHierarchy = createAsyncThunk(
  "DUPLICATE_POSITION_HIERARCHY",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/positionhierarchy/duplicate";
      const response = await userHttpService?.createData(url, body);
      const bodyMessage = {
        title: "Successfull",
        description: `Your data has been Duplicated`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(bodyMessage));
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "duplicated", errorMessage(error)),
          action: "DUPLICATE_POSITION_HIERARCHY",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// activation hierarchy
export const activationPositionHierarchy = createAsyncThunk(
  "ACTIVATION_POSITION_HIERARCHY",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/positionhierarchy/active";
      const response = await userHttpService?.createData(url, body);
      const bodyMessage = {
        title: "Successfull",
        description: response?.data?.message,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(bodyMessage));
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "activated", errorMessage(error)),
          action: "ACTIVATION_POSITION_HIERARCHY",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// download hierarchy
export const downloadPositionHierarchy = createAsyncThunk(
  "DOWNLOAD_POSITION_HIERARCHY",
  async ({ sort, page, pageSize, search }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/positionhierarchy/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error,
          action: "DOWNLOAD_POSITION_HIERARCHY",
          back: false,
        })
      );

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const positionHierarchySlice = createSlice({
  name: "position_hierarchy",
  initialState,
  extraReducers: {
    // get pagination
    [getPositionHierarchyPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getPositionHierarchyPaginate.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getPositionHierarchyPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // get position
    [getPosition.pending]: (state) => {
      state.loading = true;
    },
    [getPosition.rejected]: (state, action) => {
      state.loading = false;
      state.data_position = action.payload;
    },
    [getPosition.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_position = action.payload;
    },

    // get detail hierarchy
    [getDetailHierarchy.pending]: (state) => {
      state.loading = true;
    },
    [getDetailHierarchy.rejected]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    [getDetailHierarchy.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },

    // get detail position (employee list for a position node)
    [getDetailPosition.pending]: (state) => {
      state.loading = true;
    },
    [getDetailPosition.rejected]: (state, action) => {
      state.loading = false;
      state.data_employee = action.payload;
    },
    [getDetailPosition.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_employee = action.payload;
    },

    // create position hierarchy
    [createPositionHierarchy.pending]: (state) => {
      state.loading = true;
    },
    [createPositionHierarchy.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [createPositionHierarchy.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // update position hierarchy
    [updatePositionHierarchy.pending]: (state) => {
      state.loading = true;
    },
    [updatePositionHierarchy.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [updatePositionHierarchy.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // duplicate position hierarchy
    [duplicatePositionHierarchy.pending]: (state) => {
      state.loading = true;
    },
    [duplicatePositionHierarchy.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [duplicatePositionHierarchy.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // activation position hierarchy
    [activationPositionHierarchy.pending]: (state) => {
      state.loading = true;
    },
    [activationPositionHierarchy.rejected]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [activationPositionHierarchy.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    // download position hierarchy
    [downloadPositionHierarchy.pending]: (state) => {
      state.loading = true;
    },
    [downloadPositionHierarchy.rejected]: (state) => {
      state.loading = false;
      // state.data = action.payload;
    },
    [downloadPositionHierarchy.fulfilled]: (state) => {
      state.loading = false;
      // state.data = action.payload;
    },
  },
});

const { reducer } = positionHierarchySlice;
export default reducer;
