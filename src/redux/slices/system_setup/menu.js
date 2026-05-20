import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userHttpService from "../../services/userHttpService";
import { showModalSuccess, validateError } from "../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../utils";

const initialState = {
  data: null,
  data_detail: null,
  isFailed: false,
  data_actions: null,
};

export const getAllMenuPaginate = createAsyncThunk(
  "GET_ALL_MENU",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "menuId~desc" : sort;
      const url = `/v1/dbs/api/menus/paging?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_ALL_MENU", back: false })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getMenuDetail = createAsyncThunk(
  "GET_MENU_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/menus/${id}`;
      const data = await userHttpService.getDetail(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_MENU_DETAIL", back: false })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const downloadMenu = createAsyncThunk(
  "DOWNLOAD_MENU",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "menuId~desc" : sort;
      const url = `/v1/dbs/api/menus/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "DOWNLOAD_MENU", back: false })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const inactiveMenu = createAsyncThunk(
  "INACTIVE_MENU",
  async (body, thunkAPI) => {
    let statusData = body?.status === "ACTIVE" ? "inactivated" : "activated";
    try {
      const url = `/v1/dbs/api/menus/inactive/${body?.id}`;
      const data = await userHttpService.activationWithDelete(url);
      const message = data.message;
      const successMessage = {
        title: "Successfull",
        description: `${message}`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), statusData, errorMessage(error)),
          action: "INACTIVE_MENU",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateMenu = createAsyncThunk(
  "UPDATE_MENU",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/menus/`;
      const data = await userHttpService.updateData(url, body);
      const successBody = {
        title: "Successfull",
        description: `Your data has been Updated`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "updated", errorMessage(error)),
          action: "UPDATE_MENU",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getCreateMenu = createAsyncThunk(
  "CREATE_MENU",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/menus/`;
      const response = await userHttpService.createData(url, body);
      const successBody = {
        title: "Successfull",
        description: `Your data has been Created`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "CREATE_MENU",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getParent = createAsyncThunk(
  "GET_PARENT_MENU",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/menus/parent-menu";
      const data = await userHttpService.getAll(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_PARENT_MENU", back: false })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);
export const getActions = createAsyncThunk(
  "GET_ACTIONS",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/menus/all-action";
      const data = await userHttpService.getAll(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_ACTIONS", back: false })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const deleteMenu = createAsyncThunk(
  "DELETE_MENU",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/menus/${id}`;
      const response = await userHttpService.deleteData(url);
      const successBody = { title: "Successful", description: "Menu deleted successfully." };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: errorBody(errorCode(error), "deleted", errorMessage(error)), action: "DELETE_MENU", back: false })
      );
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

const mainMenuSlice = createSlice({
  name: "main_Menu",
  initialState,
  extraReducers: {
    [getAllMenuPaginate.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data = action.payload;
      state.loading = true;
    },
    [getAllMenuPaginate.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = false;
    },
    [getAllMenuPaginate.rejected]: (state) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = false;
    },

    // create
    [getCreateMenu.pending]: (state) => {
      state.loading = true;
    },
    [getCreateMenu.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [getCreateMenu.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },
    //update
    [updateMenu.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [updateMenu.pending]: (state) => {
      state.loading = true;
    },
    [updateMenu.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },

    // menu detail
    [getMenuDetail.pending]: (state) => {
      state.loading = true;
    },
    [getMenuDetail.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getMenuDetail.rejected]: (state) => {
      state.loading = false;
    },

    //inactive
    [inactiveMenu.pending]: (state) => {
      state.loading = true;
    },
    [inactiveMenu.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveMenu.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },
    [getParent.pending]: (state) => {
      state.loading = true;
    },
    [getParent.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getParent.rejected]: (state) => {
      state.loading = false;
    },
    // get actions
    [getActions.pending]: (state) => {
      state.loading = true;
    },
    [getActions.fulfilled]: (state, action) => {
      state.data_actions = action.payload;
      state.loading = false;
    },
    [getActions.rejected]: (state) => {
      state.loading = false;
    },
    //download

    [downloadMenu.pending]: (state) => {
      state.loading = true;
    },
    [downloadMenu.fulfilled]: (state, action) => {
      state.data_download = action.payload;
      state.isSuccess = true;
      state.loading = false;
    },
    [downloadMenu.rejected]: (state, action) => {
      // state.isFailed = true;
      state.data_download = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = mainMenuSlice;
export default reducer;
