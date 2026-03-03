import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logoutTokenExpired } from "./user_management/auth";
import { errorBody, errorCode, errorMessage } from "../../utils";

const initialState = {
  bodyError: null,
  modalError: false,
  bodySuccess: null,
  modalSuccess: false,
  data_grant_access: null,
  isLeaving: false,
  isLoading: false,
  grant_access_detail: null,
};
// Serialize an AxiosError into a plain Redux-safe object.
// Preserves the paths that consumers depend on:
//   LayoutMenu:  errorCode(val) === 503  →  val.response.status
//   LayoutMenu:  val?.response?.data?.data?.isGranted
//   useGrantAccessHooks:  val?.isGranted  |  val?.actionList
const serializeGrantAccessError = (error) => {
  const errorData = error?.response?.data?.data;
  return {
    status: error?.response?.status,
    response: {
      status: error?.response?.status,
      data: {
        code: error?.response?.data?.code,
        data: {
          isGranted: errorData?.isGranted ?? false,
          actionList: errorData?.actionList || [],
        },
      },
    },
    isGranted: errorData?.isGranted ?? false,
    actionList: errorData?.actionList || [],
  };
};

export const validateError = createAsyncThunk(
  "VALIDATE_ERROR",
  async ({ error, action, back = false, load = false }, thunkAPI) => {
    const message = errorMessage(error);
    const errorLog = errorCode(error);
    if (errorLog === 401) {
      thunkAPI.dispatch(logoutTokenExpired());
    } else if (errorLog === 500 || errorLog === 419) {
      thunkAPI.dispatch(setBodyError({ ...error, action: action }));
    } else if (
      errorLog === 503 ||
      (errorLog === 404 && error?.response?.data?.data?.isGranted === false)
    ) {
      if (action !== "CHECK_GRANTED_ACCESS") {
        thunkAPI.dispatch(grantedAccessDetail(serializeGrantAccessError(error)));
      } else {
        thunkAPI.dispatch(grantedAccess(serializeGrantAccessError(error)));
      }
    } else if (errorLog === 204) {
      const errorBody = {
        title: "Failed",
        description: `Can't download data, data is empty`,
        code: errorLog,
      };
      thunkAPI.dispatch(showModalError(errorBody));
    } else if (message?.toLowerCase() === "network error") {
      const errorBody = {
        title: "Failed",
        message: `${message}`,
        code: 500,
      };
      thunkAPI.dispatch(setBodyError(errorBody));
    } else {
      const errorBody = {
        title: "Failed",
        description: message + " Please try again.",
        code: errorLog,
        return: back,
        loadPage: load,
        action: action || error?.action,
      };
      thunkAPI.dispatch(showModalError(errorBody));
    }
  }
);

export const validateCreateUpdate = createAsyncThunk(
  "VALIDATE_CREATE_UPDATE",
  async ({ body, services, endPoint, type }, thunkAPI) => {
    try {
      const response = await services?.createData(endPoint, body);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(error),
            type === "update" ? "updated" : "created",
            errorMessage(error)
          ),
          action: "VALIDATE_CREATE_UPDATE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const checkGrantedAccessDetail = createAsyncThunk('CHECK_GRANTED_ACCESS_DETAIL', async (_, thunkAPI) => {
  try {
    
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    showModalError: (state, action) => {
      state.modalError = true;
      state.bodyError = action.payload;
    },
    hideModalError: (state) => {
      state.modalError = false;
      state.bodyError = null;
    },
    showModalSuccess: (state, action) => {
      state.modalSuccess = true;
      state.bodySuccess = {
        return: true,
        ...action.payload,
      };
    },
    hideModalSuccess: (state) => {
      state.modalSuccess = false;
      state.bodySuccess = null;
    },
    grantedAccess: (state, action) => {
      state.data_grant_access = action.payload;
    },
    grantedAccessDetail: (state, action) => {
      state.grant_access_detail = action.payload;
    },
    userIsLeaving: (state) => {
      state.data_grant_access = true;
    },
    setBodyError: (state, action) => {
      state.bodyError = action.payload;
    },
    clearBodyMessage: (state) => {
      state.bodyError = null;
      state.bodySuccess = null;
    },
  },
  extraReducers: {
    [validateCreateUpdate.pending]: (state) => {
      state.isLoading = true;
    },
    [validateCreateUpdate.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [validateCreateUpdate.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const {
  showModalError,
  hideModalError,
  showModalSuccess,
  hideModalSuccess,
  grantedAccess,
  userIsLeaving,
  setBodyError,
  clearBodyMessage,
  grantedAccessDetail,
} = generalSlice.actions;
export default generalSlice.reducer;
