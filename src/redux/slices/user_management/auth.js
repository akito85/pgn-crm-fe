import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/user_management/auth";
import { setData } from "../data_slice";
import userHttpService from "../../services/userHttpService";
import {
  grantedAccess,
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../utils";

// ─── Granted-access TTL cache ─────────────────────────────────────────────
// Avoids re-flashing the action-button skeleton on every route change.
// Fresh cache (within TTL) skips the network round-trip entirely.
// Stale cache (expired) falls through to a full refresh.
const GRANTED_ACCESS_CACHE_PREFIX = "granted-access:";
const GRANTED_ACCESS_TTL_MS = 15 * 60 * 1000; // 15 min

const hashToken = (token) => {
  if (!token) return "anon";
  let h = 0;
  for (let i = 0; i < token.length; i++) {
    h = ((h << 5) - h) + token.charCodeAt(i);
    h |= 0;
  }
  return h.toString(36);
};

const grantedAccessCacheKey = (pathname) => {
  const tok =
    (typeof localStorage !== "undefined" && localStorage.getItem("token")) ||
    (typeof sessionStorage !== "undefined" && sessionStorage.getItem("token")) ||
    "";
  return GRANTED_ACCESS_CACHE_PREFIX + hashToken(tok) + ":" + (pathname || "");
};

const readGrantedAccessCache = (pathname) => {
  try {
    const raw = sessionStorage.getItem(grantedAccessCacheKey(pathname));
    if (!raw) return null;
    const { payload, expiresAt } = JSON.parse(raw);
    if (!expiresAt || expiresAt < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
};

const writeGrantedAccessCache = (pathname, payload) => {
  try {
    sessionStorage.setItem(
      grantedAccessCacheKey(pathname),
      JSON.stringify({ payload, expiresAt: Date.now() + GRANTED_ACCESS_TTL_MS })
    );
  } catch {
    // sessionStorage quota or disabled — degrade gracefully
  }
};

export const clearGrantedAccessCache = () => {
  try {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith(GRANTED_ACCESS_CACHE_PREFIX)) {
        sessionStorage.removeItem(k);
      }
    }
  } catch {
    // ignore
  }
};

const initialState = {
  isLoggedIn: false,
  user: null,
  loading: false,
  selectedPosition: false,
  failedRequest: false,
  token:
    localStorage.getItem("token") || window.sessionStorage.getItem("token"),
  positions:
    localStorage.getItem("positions") ||
    window.sessionStorage.getItem("positions"),
  entities:
    localStorage.getItem("entities") ||
    window.sessionStorage.getItem("entities"),
  side_bar:
    localStorage.getItem("side_bar") ||
    window.sessionStorage.getItem("side_bar"),
  isAuthenticated: "",
  remember:
    localStorage.getItem("remember") ||
    window.sessionStorage.getItem("remember"),
  data_entities: null,
  data_check: null,
  data_entity: null,
  data_position: [],
  data_extended: null,
  data_switch: null,
  currentPosition: null, // Position info from switch-pos API { positionId, positionName }
};
let remember_me = "";
export const login = createAsyncThunk(
  "LOGIN",
  async ({ user, level, remember }, thunkAPI) => {
    try {
      const data = await authService.login(user, level);
      remember_me = remember;
      if (remember_me) {
        thunkAPI.dispatch(
          setData({ key: "token", data: data.data.token, storageType: "local" })
        );
        thunkAPI.dispatch(
          setData({ key: "remember", data: remember, storageType: "local" })
        );
        thunkAPI.dispatch(
          setData({
            key: "config",
            data: data.data.config,
            storageType: "local",
          })
        );
        if (
          data.data.token.userType === "Non Employee" ||
          data.data.token.userLevel === "Super User"
        ) {
          thunkAPI.dispatch(
            setData({
              key: "side_bar",
              data: data.data.side_bar,
              storageType: "local",
            })
          );
          // Super users also need entities for choose-entity page
          if (data.data.token.userLevel === "Super User") {
            thunkAPI.dispatch(
              setData({
                key: "entities",
                data: data.data.entityList,
                storageType: "local",
              })
            );
          }
        } else {
          level === "superuser" &&
          (data.data.token.userType === "Non Employee" ||
            data.data.token.userLevel === "Super User")
            ? thunkAPI.dispatch(
                setData({
                  key: "entities",
                  data: data.data.entityList,
                  storageType: "local",
                })
              )
            : thunkAPI.dispatch(
                setData({
                  key: "positions",
                  data: data.data.positionList,
                  storageType: "local",
                })
              );
        }
      } else {
        thunkAPI.dispatch(
          setData({
            key: "token",
            data: data.data.token,
            storageType: "session",
          })
        );
        thunkAPI.dispatch(
          setData({ key: "remember", data: remember, storageType: "session" })
        );
        thunkAPI.dispatch(
          setData({
            key: "config",
            data: data.data.config,
            storageType: "session",
          })
        );
        if (
          data.data.token.userType === "Non Employee" ||
          data.data.token.userLevel === "Super User"
        ) {
          thunkAPI.dispatch(
            setData({
              key: "side_bar",
              data: data.data.side_bar,
              storageType: "session",
            })
          );
          // Super users also need entities for choose-entity page
          if (data.data.token.userLevel === "Super User") {
            thunkAPI.dispatch(
              setData({
                key: "entities",
                data: data.data.entityList,
                storageType: "session",
              })
            );
          }
        } else {
          level === "superuser" &&
          (data.data.token.userType === "Non Employee" ||
            data.data.token.userLevel === "Super User")
            ? thunkAPI.dispatch(
                setData({
                  key: "entities",
                  data: data.data.entityList,
                  storageType: "session",
                })
              )
            : thunkAPI.dispatch(
                setData({
                  key: "positions",
                  data: data.data.positionList,
                  storageType: "session",
                })
              );
        }
      }
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        description: `${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const logout = createAsyncThunk("LOGOUT", async (_, thunkAPI) => {
  try {
    const data = await authService.logout();
    return data;
  } catch (error) {
    thunkAPI.dispatch(logoutTokenExpired());
    // if (error.response.data.code === 500 || error.response.data.code === 401) {
    // 	thunkAPI.dispatch(logoutTokenExpired())
    // } else {
    // 	const message =
    // 		(error.response &&
    // 			error.response.data &&
    // 			error.response.data.message) ||
    // 		error.message ||
    // 		error.toString();
    // 	const errorBody = {
    // 		title: "Failed",
    // 		description: `${message}. Please try again.`,
    // 		code: error.response.data.code
    // 	};
    // 	// thunkAPI.dispatch(showModalError(errorBody));
    // }
    return thunkAPI.rejectWithValue(error);
  }
});

export const logoutTokenExpired = createAsyncThunk(
  "INJECT_LOGOUT",
  async (thunkAPI) => {
    clearGrantedAccessCache();
    try {
      const data = await authService.injectLogout();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const choosePosition = createAsyncThunk(
  "CHOOSE_POSITION",
  async ({ id, remember }, thunkAPI) => {
    try {
      const data = await authService.choosePosition(id);
      if (remember === "true") {
        thunkAPI.dispatch(
          setData({ key: "token", data: data.data.token, storageType: "local" })
        );
        thunkAPI.dispatch(
          setData({
            key: "side_bar",
            data: data.data.side_bar,
            storageType: "local",
          })
        );
        thunkAPI.dispatch(
          setData({ key: "remember", data: remember, storageType: "local" })
        );
        thunkAPI.dispatch(
          setData({
            key: "config",
            data: data.data.config,
            storageType: "local",
          })
        );
      } else {
        thunkAPI.dispatch(
          setData({
            key: "token",
            data: data.data.token,
            storageType: "session",
          })
        );
        thunkAPI.dispatch(
          setData({
            key: "side_bar",
            data: data.data.side_bar,
            storageType: "session",
          })
        );
        thunkAPI.dispatch(
          setData({ key: "remember", data: remember, storageType: "session" })
        );
        thunkAPI.dispatch(
          setData({
            key: "config",
            data: data.data.config,
            storageType: "session",
          })
        );
      }
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "CHOOSE_POSITION", back: false })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const chooseEntity = createAsyncThunk(
  "CHOOSE_ENTITY",
  async ({ id, remember }, thunkAPI) => {
    try {
      const data = await authService.chooseEntity(id);
      if (remember === "true") {
        thunkAPI.dispatch(
          setData({ key: "token", data: data.data.token, storageType: "local" })
        );
        thunkAPI.dispatch(
          setData({
            key: "side_bar",
            data: data.data.side_bar,
            storageType: "local",
          })
        );
        thunkAPI.dispatch(
          setData({ key: "remember", data: remember, storageType: "local" })
        );
        thunkAPI.dispatch(
          setData({
            key: "config",
            data: data.data.config,
            storageType: "local",
          })
        );
      } else {
        thunkAPI.dispatch(
          setData({
            key: "token",
            data: data.data.token,
            storageType: "session",
          })
        );
        thunkAPI.dispatch(
          setData({
            key: "side_bar",
            data: data.data.side_bar,
            storageType: "session",
          })
        );
        thunkAPI.dispatch(
          setData({ key: "remember", data: remember, storageType: "session" })
        );
        thunkAPI.dispatch(
          setData({
            key: "config",
            data: data.data.config,
            storageType: "session",
          })
        );
      }
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "CHOOSE_ENTITY", back: false })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getEntities = createAsyncThunk(
  "GET_ENTITIES",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/auth/get-entity";
      const data = await userHttpService.getAll(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_ENTITY", back: false })
      );
      // const message =
      // 	error?.response?.data?.message || error?.message || error?.toString();
      // if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
      // 	thunkAPI.dispatch(setBodyError(error));
      // } else {
      // 	const errorBody = {
      // 		title: "Failed",
      // 		description: `${message}`,
      // 	};
      // 	thunkAPI.dispatch(showModalError(errorBody))
      // }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "FORGOT_PASSWORD_SUPER_USER",
  async ({ type, body }, thunkAPI) => {
    try {
      let url;
      if (type === "superuser") {
        url = "/v1/dbs/api/auth/forgot-password-su";
      } else {
        url = "/v1/dbs/api/auth/forgot-password-user";
      }
      const data = await userHttpService.createData(url, body);
      const successMessage = {
        title: "Link sent successfully",
        description: data?.message,
        return: true,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return data;
    } catch (error) {
      const errorBody = {
        title: "Failed",
        description: error?.response?.data?.message,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
export const confirmNewPassword = createAsyncThunk(
  "CONFIRM_PASSWORD",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/auth/confirm-password";
      const data = await userHttpService.createData(url, body);
      const successMessage = {
        title: "Success",
        description: "Password changed successfully!",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        description: `Your data was not updated. ${message}. Please try again.`,
        return: false,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const checkGrantedAccess = createAsyncThunk(
  "CHECK_GRANTED_ACCESS",
  async (pathname, thunkAPI) => {
    // Fresh cache hit — dispatch immediately and skip the network round-trip.
    // Permissions rarely change mid-session; the next page load after TTL
    // expires will refresh from the server.
    const cached = readGrantedAccessCache(pathname);
    if (cached) {
      thunkAPI.dispatch(grantedAccess(cached));
      return;
    }
    // No cache or expired — show skeleton while fetching.
    thunkAPI.dispatch(grantedAccess(null));
    try {
      const data = await authService.checkGrantedAccess(pathname);
      const payload = data?.data;
      writeGrantedAccessCache(pathname, payload);
      thunkAPI.dispatch(grantedAccess(payload));
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "CHECK_GRANTED_ACCESS" })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// get list entity
export const getListSwitchEntity = createAsyncThunk(
  "GET_LIST_ENTITY",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/auth/get-list-entity";
      const data = await userHttpService.getAll(url);
      return data?.data;
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
      thunkAPI.dispatch(grantedAccess(error?.response?.data?.data));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// change entity
export const changeEntity = createAsyncThunk(
  "CHANGE_ENTITY",
  async ({ entityId, remember }, thunkAPI) => {
    clearGrantedAccessCache();
    try {
      const url = "/v1/dbs/api/auth/switch-entity";
      const body = { entityId: entityId };
      const data = await userHttpService.createData(url, body);
      if (remember) {
        localStorage.removeItem("token");
        localStorage.removeItem("side_bar");
        thunkAPI.dispatch(
          setData({ key: "token", data: data.data.token, storageType: "local" })
        );
        thunkAPI.dispatch(
          setData({
            key: "side_bar",
            data: data.data.side_bar,
            storageType: "local",
          })
        );
      } else {
        window.sessionStorage.removeItem("token");
        window.sessionStorage.removeItem("side_bar");
        thunkAPI.dispatch(
          setData({
            key: "token",
            data: data.data.token,
            storageType: "session",
          })
        );
        thunkAPI.dispatch(
          setData({
            key: "side_bar",
            data: data.data.side_bar,
            storageType: "session",
          })
        );
      }
      return data?.data;
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);
// get list entity
export const getListSwitchPosition = createAsyncThunk(
  "GET_LIST_POSITION",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/auth/get-list-position";
      const data = await userHttpService.getAll(url);
      return data?.data;
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
      thunkAPI.dispatch(grantedAccess(error?.response?.data?.data));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// change position
export const changePosition = createAsyncThunk(
  "CHANGE_POSITION",
  async ({ positionId, remember }, thunkAPI) => {
    clearGrantedAccessCache();
    try {
      const url = "/v1/dbs/api/auth/switch-pos";
      const body = { positionId: positionId };
      const data = await userHttpService.createData(url, body);
      localStorage.removeItem("token") &&
        window.sessionStorage.removeItem("token");
      // localStorage.removeItem('side_bar') && window.sessionStorage.removeItem('side_bar');
      if (remember) {
        thunkAPI.dispatch(
          setData({ key: "token", data: data.data.token, storageType: "local" })
        );
        // thunkAPI.dispatch(setData({ key: 'side_bar', data: data.data.side_bar, storageType: "local" }))
      } else {
        thunkAPI.dispatch(
          setData({
            key: "token",
            data: data.data.token,
            storageType: "session",
          })
        );
        // thunkAPI.dispatch(setData({ key: 'side_bar', data: data.data.side_bar, storageType: "session" }))
      }
      return data?.data;
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// change verify email
export const verifyChangeEmail = createAsyncThunk(
  "VERIFY_CHANGE_EMAIL",
  async (params, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/auth/verify-email?verify=${params}`;
      const data = await userHttpService.getAll(url);
      return data?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
export const verifyChangePhone = createAsyncThunk(
  "VERIFY_CHANGE_PHONE",
  async (params, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/auth/verify-phone?verify=${params}`;
      const data = await userHttpService.getAll(url);
      return data?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
export const verifyChangeEmailPhone = createAsyncThunk(
  "VERIFY_CHANGE_EMAIL_PHONE",
  async (params, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/auth/verify-email-phone?verify=${params}`;
      const data = await userHttpService.getAll(url);
      return data?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
export const verifyChangePassword = createAsyncThunk(
  "VERIFY_CHANGE_EMAIL_PHONE",
  async (params, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/auth/verify-password?verify=${params}`;
      const data = await userHttpService.getAll(url);
      return data?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// check validate link
export const checkValidateLink = createAsyncThunk(
  "VALIDATE_LINK",
  async (params, thunkAPI) => {
    try {
      const x = encodeURIComponent(params);
      const url = `/v1/dbs/api/auth/check-expired?verify=${x}`;
      const data = await userHttpService.getAll(url);
      return data?.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      const errorBody = {
        title: "Failed",
        description: message,
      };
      thunkAPI?.dispatch(setBodyError(errorBody));
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// check creds
export const checkCredential = createAsyncThunk(
  "GET_CHECK_CREDS",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/auth/cek-credential";
      const response = await userHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// relogin
export const reLogin = createAsyncThunk(
  "RE_LOGIN",
  async ({ body, remember }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/auth/re-login";
      const response = await userHttpService.createData(url, body);
      localStorage.removeItem("token") &&
        window.sessionStorage.removeItem("token");
      localStorage.removeItem("side_bar") &&
        window.sessionStorage.removeItem("side_bar");
      localStorage.removeItem("config") &&
        window.sessionStorage.removeItem("config");
      if (remember) {
        thunkAPI.dispatch(
          setData({
            key: "token",
            data: response.data.token,
            storageType: "local",
          })
        );
        thunkAPI.dispatch(
          setData({
            key: "side_bar",
            data: response.data.side_bar,
            storageType: "local",
          })
        );
        thunkAPI.dispatch(
          setData({
            key: "config",
            data: response.data.config,
            storageType: "local",
          })
        );
      } else {
        thunkAPI.dispatch(
          setData({
            key: "token",
            data: response.data.token,
            storageType: "session",
          })
        );
        thunkAPI.dispatch(
          setData({
            key: "side_bar",
            data: response.data.side_bar,
            storageType: "session",
          })
        );
        thunkAPI.dispatch(
          setData({
            key: "config",
            data: response.data.config,
            storageType: "session",
          })
        );
      }
      window.location.reload();
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `${message}`,
        icon: "icon_error_inactivate",
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// take over
export const takeOverDelegation = createAsyncThunk(
  "TAKE_OVER_DELEGATION",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/auth/take-over-delegation`;
      const response = await userHttpService.createData(url, body);

      if (body?.remember === "true") {
        thunkAPI.dispatch(
          setData({
            key: "token",
            data: response.data.token,
            storageType: "local",
          })
        );
        thunkAPI.dispatch(
          setData({
            key: "side_bar",
            data: response.data.side_bar,
            storageType: "local",
          })
        );
        thunkAPI.dispatch(
          setData({
            key: "remember",
            data: body?.remember,
            storageType: "local",
          })
        );
        thunkAPI.dispatch(
          setData({
            key: "config",
            data: response.data.config,
            storageType: "local",
          })
        );
      } else {
        thunkAPI.dispatch(
          setData({
            key: "token",
            data: response.data.token,
            storageType: "session",
          })
        );
        thunkAPI.dispatch(
          setData({
            key: "side_bar",
            data: response.data.side_bar,
            storageType: "session",
          })
        );
        thunkAPI.dispatch(
          setData({
            key: "remember",
            data: body?.remember,
            storageType: "session",
          })
        );
        thunkAPI.dispatch(
          setData({
            key: "config",
            data: response.data.config,
            storageType: "session",
          })
        );
      }
      // return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "take over", errorMessage(error)),
          action: "TAKE_OVER_DELEGATION",
          back: false,
        })
      );

      return thunkAPI.rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setClearDataExtend: (state) => {
      state.data_extended = null;
    },
  },
  extraReducers: {
    // login
    [login.pending]: (state) => {
      state.loading = true;
      state.isLoggedIn = true;
      state.failedRequest = false;
    },
    [login.fulfilled]: (state, action) => {
      state.loading = false;
      state.isLoggedIn = true;
      state.logged = true;
      state.failedRequest = false;
      state.user = action.payload;
      state.token =
        localStorage.getItem("token") || window.sessionStorage.getItem("token");
      state.positions =
        localStorage.getItem("positions") ||
        window.sessionStorage.getItem("positions");
      state.entities =
        localStorage.getItem("entities") ||
        window.sessionStorage.getItem("entities");
      state.side_bar =
        localStorage.getItem("side_bar") ||
        window.sessionStorage.getItem("side_bar");
      state.remember =
        localStorage.getItem("remember") ||
        window.sessionStorage.getItem("remember");
    },
    [login.rejected]: (state, action) => {
      state.isLoggedIn = false;
      state.loading = false;
      state.user = action.payload;
    },
    // logout
    [logout.pending]: (state) => {
      state.isLoggedIn = true;
      state.loading = true;
    },
    [logout.fulfilled]: (state, action) => {
      state.isLoggedIn = false;
      state.loading = false;
      state.user = action.payload;
      // Clear notification userId and positionId persistence
      localStorage.removeItem("notification_userId");
      localStorage.removeItem("notification_positionId");
    },
    [logout.rejected]: (state, action) => {
      state.isLoggedIn = false;
      state.loading = false;
      state.user = action.payload;
    },
    // choose position
    [choosePosition.pending]: (state) => {
      state.selectedPosition = false;
      state.loading = true;
    },
    [choosePosition.fulfilled]: (state, action) => {
      state.loading = false;
      state.isFailed = false;
      state.token =
        localStorage.getItem("token") || window.sessionStorage.getItem("token");
      state.side_bar =
        localStorage.getItem("side_bar") ||
        window.sessionStorage.getItem("side_bar");
      // Persist positionId for notification system (survives page refresh/navigation)
      if (action.payload?.data?.position?.positionId) {
        state.currentPosition = action.payload.data.position;
        localStorage.setItem("notification_positionId", action.payload.data.position.positionId);
      }
    },
    [choosePosition.rejected]: (state) => {
      state.selectedPosition = false;
      state.loading = false;
    },
    // choose entity
    [chooseEntity.pending]: (state) => {
      state.loading = true;
    },
    [chooseEntity.fulfilled]: (state) => {
      state.loading = false;
      state.isFailed = false;
      state.token =
        localStorage.getItem("token") || window.sessionStorage.getItem("token");
      state.side_bar =
        localStorage.getItem("side_bar") ||
        window.sessionStorage.getItem("side_bar");
    },
    [chooseEntity.rejected]: (state) => {
      state.loading = false;
      // state.failedRequest = true;
    },
    // get entities
    [getEntities.pending]: (state) => {
      state.loading = true;
    },
    [getEntities.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_entities = action.payload;
    },
    [getEntities.rejected]: (state, action) => {
      state.loading = false;
      state.data_entities = action.payload;
    },
    // forgot password
    [forgotPassword.pending]: (state) => {
      state.loading = true;
    },
    [forgotPassword.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [forgotPassword.rejected]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    // confirm password
    [confirmNewPassword.pending]: (state) => {
      state.loading = true;
    },
    [confirmNewPassword.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [confirmNewPassword.rejected]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    // Inject logout
    [logoutTokenExpired.pending]: (state) => {
      state.loading = true;
    },
    [logoutTokenExpired.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [logoutTokenExpired.rejected]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    // check granted access
    [checkGrantedAccess.pending]: (state) => {
      state.loading = true;
    },
    [checkGrantedAccess.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.data_switch = null;
    },
    [checkGrantedAccess.rejected]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    // list entity
    [getListSwitchEntity.pending]: (state) => {
      state.loading = true;
    },
    [getListSwitchEntity.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_entity = action.payload;
    },
    [getListSwitchEntity.rejected]: (state) => {
      state.loading = false;
    },
    // change entity
    [changeEntity.pending]: (state) => {
      state.loading = true;
    },
    [changeEntity.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_switch = action.payload;
      state.side_bar =
        localStorage.getItem("side_bar") ||
        window.sessionStorage.getItem("side_bar");
    },
    [changeEntity.rejected]: (state) => {
      state.loading = false;
    },
    // list position
    [getListSwitchPosition.pending]: (state) => {
      state.loading = true;
    },
    [getListSwitchPosition.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_position = action.payload;
    },
    [getListSwitchPosition.rejected]: (state) => {
      state.loading = false;
    },
    // change entity
    [changePosition.pending]: (state) => {
      state.loading = true;
    },
    [changePosition.fulfilled]: (state, action) => {
      state.loading = false;
      state.isFailed = false;
      state.data_switch = action.payload;
      state.token =
        localStorage.getItem("token") || window.sessionStorage.getItem("token");
      state.side_bar =
        localStorage.getItem("side_bar") ||
        window.sessionStorage.getItem("side_bar");

      // Store position information for notification filtering
      // The token doesn't contain positionId, but the full response does at action.payload.position
      if (action.payload?.position) {
        state.currentPosition = action.payload.position;
        // Persist positionId for notification system (survives page refresh/navigation)
        localStorage.setItem("notification_positionId", action.payload.position.positionId);
      }
    },
    [changePosition.rejected]: (state) => {
      state.loading = false;
    },
    // verify email
    [verifyChangeEmail.pending]: (state) => {
      state.loading = true;
    },
    [verifyChangeEmail.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [verifyChangeEmail.rejected]: (state) => {
      state.loading = false;
    },
    // verify phone
    [verifyChangePhone.pending]: (state) => {
      state.loading = true;
    },
    [verifyChangePhone.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [verifyChangePhone.rejected]: (state) => {
      state.loading = false;
    },
    // verify email and phone
    [verifyChangeEmailPhone.pending]: (state) => {
      state.loading = true;
    },
    [verifyChangeEmailPhone.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [verifyChangeEmailPhone.rejected]: (state) => {
      state.loading = false;
    },
    // verify password
    [verifyChangePassword.pending]: (state) => {
      state.loading = true;
    },
    [verifyChangePassword.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [verifyChangePassword.rejected]: (state) => {
      state.loading = false;
    },
    // verify email and phone
    [checkValidateLink.pending]: (state) => {
      state.loading = true;
    },
    [checkValidateLink.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [checkValidateLink.rejected]: (state) => {
      state.loading = false;
    },
    // check creds
    [checkCredential.pending]: (state) => {
      state.loading = true;
    },
    [checkCredential.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [checkCredential.rejected]: (state) => {
      state.loading = false;
    },
    // check creds
    [reLogin.pending]: (state) => {
      state.loading = true;
    },
    [reLogin.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_extended = action.payload;
    },
    [reLogin.rejected]: (state, action) => {
      state.loading = false;
      state.data_extended = action.payload;
    },

    // take over
    [takeOverDelegation.pending]: (state) => {
      state.loading = true;
    },
    [takeOverDelegation.fulfilled]: (state) => {
      state.loading = false;
    },
    [takeOverDelegation.rejected]: (state) => {
      state.loading = false;
    },
  },
});
const { reducer } = authSlice;
export const { setClearDataExtend } = authSlice.actions;
export default reducer;
