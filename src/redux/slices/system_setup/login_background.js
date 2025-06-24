import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userHttpService from "../../services/userHttpService";
import {
  validateError,
  showModalError,
  showModalSuccess,
  setBodyError,
} from "../general_slice";
import { errorBody, errorMessage } from "../../../utils";

const initialState = {
  data: [],
  data_Background: [],
  inactive_Background: [],
  detail_Background: [],
  create_Background: [],
  update_Background: [],
  isFailed: false,
  isSuccess: false,
  message: "",
  loading: false,
};

export const getPagingBackground = createAsyncThunk(
  "GET_PAGING_LOGIN_BACKGROUND",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/background/paging?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await userHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_PAGING_LOGIN_BACKGROUND" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const inactiveBackground = createAsyncThunk(
  "INACTIVE_BACKGROUND",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/background/inactive/active`;
      const response = await userHttpService.activationWithRemark(url, body);
      const successBody = {
        title: "Successful",
        description: `Your data has been ${
          action === "INACTIVE" ? "activated" : "inactivated"
        }`,
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
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(
            validateError({ error, action: "INACTIVE_BACKGROUND" })
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${
              action === "INACTIVE" ? "inactivated" : "activated"
            } ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getDetailBackground = createAsyncThunk(
  "GET_DETAIL_BACKGROUND",
  async (id, thunkAPI) => {
    console.log("test");
    try {
      const url = `/v1/dbs/api/background/detail/${id}`;
      const response = await userHttpService.getDetail(url);
      console.log("Response:", response);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const createBackground = createAsyncThunk(
  "CREATE_BACKGROUND",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/background/create`;
      const response = await userHttpService.createData(url, body);
      const successMessage = {
        title: "Successfull",
        description: "Your data has been created",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: errorBody(error, 'created', errorMessage(error)), action:"CREATE_BACKGROUND", back : false}))
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const updateBackground = createAsyncThunk(
  "UPDATE_BACKGROUND",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/background/update`;
      const response = await userHttpService.updateData(url, body);
      const successBody = {
        title: "Successful",
        description: `Your data has been updated.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: errorBody(error, 'updated', errorMessage(error)), action: "UPDATE_BACKGROUND", back: false }))
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const downloadLoginBackground = createAsyncThunk(
  "DOWNLOAD_LOGIN_BACKGROUND",
  async ({ sort, page, pageSize, search }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/background/download-filter?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await userHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_LOGIN_BACKGROUND",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// check login backgroun on login page
export const checkLoginBackground = createAsyncThunk(
  "CHECK_LOGIN_BACKGROUN",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/auth/login-background";
      const response = await userHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI?.dispatch(
        validateError({
          error: error,
          action: "CHECK_LOGIN_BACKGROUN",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const loginBackgroundSlice = createSlice({
  name: "login_background",
  initialState,
  extraReducers: {
    // paging login background
    [getPagingBackground.pending]: (state, action) => {
      state.loading = true;
    },
    [getPagingBackground.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_Background = action.payload;
    },
    [getPagingBackground.rejected]: (state, action) => {
      state.loading = false;
    },
    // inactive login background
    [inactiveBackground.pending]: (state, action) => {
      state.loading = true;
    },
    [inactiveBackground.fulfilled]: (state, action) => {
      state.loading = false;
      state.inactive_Background = action.payload;
    },
    [inactiveBackground.rejected]: (state, action) => {
      state.loading = false;
    },
    // detail login background
    [getDetailBackground.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [getDetailBackground.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.detail_Background = action.payload;
      state.loading = false;
    },
    [getDetailBackground.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    // create login background
    [createBackground.pending]: (state, action) => {
      state.loading = true;
    },
    [createBackground.fulfilled]: (state, action) => {
      state.loading = false;
      state.create_Background = action.payload;
    },
    [createBackground.rejected]: (state, action) => {
      state.loading = false;
    },
    // update login background
    [updateBackground.pending]: (state, action) => {
      state.loading = true;
    },
    [updateBackground.fulfilled]: (state, action) => {
      state.loading = false;
      state.update_Background = action.payload;
    },
    [updateBackground.rejected]: (state, action) => {
      state.loading = false;
    },
    // check login background
    [checkLoginBackground.pending]: (state, action) => {
      state.loading = true;
    },
    [checkLoginBackground.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [checkLoginBackground.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

const { reducer } = loginBackgroundSlice;
export default reducer;
