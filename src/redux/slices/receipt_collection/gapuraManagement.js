import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    showModalError,
} from "../general_slice";

// Hard Code
import hc_gapura_management_list from "./temp_hardcoded_json/gapuraManagement/get-list-gapuraManagement.json";
import hc_gapura_management_detail from "./temp_hardcoded_json/gapuraManagement/get-detail-gapuraManagement.json";

export const getAllGapuraManagementListPaginate = createAsyncThunk(
    "GET_ALL_GAPURA_MANAGEMENT_LIST_PAGINATE",
    async ({ page, pageSize, search, sort }, thunkAPI) => {
        try {
            // Simulate fetch
            const response = hc_gapura_management_list;
            await new Promise(resolve => setTimeout(resolve, 500));
            return response.data;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = {
                title: "Failed",
                description: `${message}`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getDetailGapuraManagement = createAsyncThunk(
    "GET_DETAIL_GAPURA_MANAGEMENT",
    async (id, thunkAPI) => {
        try {
            // Simulator Detail Gapura Management
            const response = hc_gapura_management_detail;
            await new Promise((resolve) => setTimeout(resolve, 500));
            return response.data;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = {
                title: "Failed",
                description: `${message}`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const inactivateGapuraManagement = createAsyncThunk(
    "INACTIVATE_GAPURA_MANAGEMENT",
    // ... (omitting previous thunks as they are the same)
    async (id, thunkAPI) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            return { id, status: "INACTIVE" };
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const activateGapuraManagement = createAsyncThunk(
    "ACTIVATE_GAPURA_MANAGEMENT",
    async (id, thunkAPI) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            return { id, status: "ACTIVE" };
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const openGapuraManagement = createAsyncThunk(
    "OPEN_GAPURA_MANAGEMENT",
    async (id, thunkAPI) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            return { id };
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const closeGapuraManagement = createAsyncThunk(
    "CLOSE_GAPURA_MANAGEMENT",
    async (id, thunkAPI) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            return { id };
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const downloadGapuraManagementList = createAsyncThunk(
    "DOWNLOAD_GAPURA_MANAGEMENT_LIST",
    async ({ page, pageSize, search, sort }, thunkAPI) => {
        try {
            // Simulator Download
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return true;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = {
                title: "Failed",
                description: `${message}`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error);
        }
    }
);

const initialState = {
    data: [],
    data_detail: null,
    loading: false,
    message: "",
};

const gapuraManagementSlice = createSlice({
    name: "gapuraManagement",
    initialState,
    extraReducers: {
        // Get All Pagination
        [getAllGapuraManagementListPaginate.pending]: (state) => {
            state.loading = true;
        },
        [getAllGapuraManagementListPaginate.fulfilled]: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
        [getAllGapuraManagementListPaginate.rejected]: (state) => {
            state.loading = false;
        },

        // Get Detail
        [getDetailGapuraManagement.pending]: (state) => {
            state.loading = true;
        },
        [getDetailGapuraManagement.fulfilled]: (state, action) => {
            state.loading = false;
            state.data_detail = action.payload;
        },
        [getDetailGapuraManagement.rejected]: (state) => {
            state.loading = false;
        },

        // Download
        [downloadGapuraManagementList.pending]: (state) => {
            state.loading = true;
        },
        [downloadGapuraManagementList.fulfilled]: (state) => {
            state.loading = false;
        },
        [downloadGapuraManagementList.rejected]: (state) => {
            state.loading = false;
        },
    },
});

const { reducer } = gapuraManagementSlice;
export default reducer;
