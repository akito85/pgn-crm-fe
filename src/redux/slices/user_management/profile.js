import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import userHttpService from "../../services/userHttpService";
import { setBodyError, showModalError, showModalSuccess, validateError } from "../general_slice";

const initialState = {
    data: null,
    data_upload: null,
    loading: false,
    requestFailed: false,
    data_update_password: null
}

export const getProfile = createAsyncThunk("GET_PROFILE", async (thunkAPI) => {
    try {
        const url = '/v1/dbs/api/profile/view-profile';
        const data = await userHttpService.getAll(url);
        return data;
    } catch (error) {
        thunkAPI.dispatch(validateError({ error: error, action: 'GET_PROFILE' }))
        return thunkAPI.rejectWithValue(error);
    }
})

export const updatePassword = createAsyncThunk("UPDATE_PASSWORD", async (body, thunkAPI) => {
    try {
        const url = '/v1/dbs/api/profile/change-password';
        const data = await userHttpService.updateData(url, body);
        const successMessage = {
            title: "Successful",
            description: data?.message,
            return: false,
            type: 'update-password'
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
        if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
            thunkAPI.dispatch(setBodyError(error));
        } else {
            const desc = message.toLowerCase().includes('ldap') ? 'Please contact administrator.' : 'Please try again.';
            const errorBody = {
                title: "Failed",
                description: `Your data was not updated. ${message}. ${desc}`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error)
    }
})

export const updateProfile = createAsyncThunk("UPDATE_PROFILE", async (body, thunkAPI) => {
    try {
        const url = '/v1/dbs/api/profile/update-profile';
        const data = await userHttpService.updateData(url, body);
        const successMessage = {
            title: "Successful",
            description: data?.message,
            return: false,
            type: "update-password"
        };
        thunkAPI.dispatch(showModalSuccess(successMessage));
        return data;
    } catch (error) {
        thunkAPI.dispatch(getProfile())
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
            thunkAPI.dispatch(setBodyError(error));
        } else {
            const desc = message.toLowerCase().includes('ldap') ? 'Please contact administrator.' : 'Please try again.';
            const errorBody = {
                title: "Failed",
                return: false,
                description: `Your data was not updated. ${message}. ${desc}`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error)
    }
})

export const uploadProfile = createAsyncThunk("UPLOAD_PROFILE", async (body, thunkAPI) => {
    try {
        const url = '/v1/dbs/api/profile/upload-image'
        const onProgress = body.onProgress;
        const formData = new FormData();
        formData.append('image', body?.image);
        const dataRequest = formData;
        const data = await userHttpService.uploadImage(url, dataRequest, onProgress);
        return data;
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
            thunkAPI.dispatch(setBodyError(error));
        } else {
            const errorBody = {
                title: "Failed",
                description: `${message}. Please try again.`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error)
    }
})

export const removePicture = createAsyncThunk('REMOVE_PICTURE', async (thunkAPI) => {
    try {
        const url = '/v1/dbs/api/profile/reset-image';
        const data = await userHttpService.removePicture(url);
        return data;
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
            thunkAPI.dispatch(setBodyError(error));
        } else {
            const errorBody = {
                title: "Failed",
                description: `${message}. Please try again.`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
        }
        return thunkAPI.rejectWithValue(error?.response);
    }
})

const profileSlice = createSlice({
    name: "profile",
    initialState,
    extraReducers: {
        [getProfile.pending]: (state, action) => {
            state.loading = true;
        },
        [getProfile.fulfilled]: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
        [getProfile.rejected]: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
        [updatePassword.pending]: (state, action) => {
            state.loading = true;
        },
        [updatePassword.fulfilled]: (state, action) => {
            state.loading = false;
            state.data_update_password = action.payload;
        },
        [updatePassword.rejected]: (state, action) => {
            state.loading = false;
            state.data_update_password = action.payload;
        },
        [updateProfile.pending]: (state, action) => {
            state.loading = true;
        },
        [updateProfile.fulfilled]: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
        [updateProfile.rejected]: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
        [removePicture.pending]: (state, action) => {
            state.loading = true;
        },
        [removePicture.fulfilled]: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
        [removePicture.rejected]: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
        [uploadProfile.pending]: (state, action) => {
            // state.loading = true;
        },
        [uploadProfile.fulfilled]: (state, action) => {
            state.loading = false;
            state.data_upload = action.payload;
        },
        [uploadProfile.rejected]: (state, action) => {
            state.loading = false;
            state.data_upload = action.payload;
        }
    }
})

const { reducer } = profileSlice;
export default reducer;