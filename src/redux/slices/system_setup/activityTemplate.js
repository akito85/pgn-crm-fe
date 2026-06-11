// src/redux/slices/system_setup/activityTemplate.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accountManagementService from "../../services/account_management/accountManagementService";
import { showModalError, showModalSuccess } from "../general_slice";

const initialState = {
    // List
    loading_list_at: false,
    list_at: [],
    pagination_at: {
        totalPage: 0,
        totalElement: 0,
        currentPage: 0,
        pageSize: 10,
    },
    // Detail
    loading_detail_at: false,
    detail_at: {},
    // Create/Update
    loading_create_update_at: false,
    // Inactive
    loading_inactive_at: false,
    // Dropdowns
    loading_wo_category: false,
    wo_category_list: [],
    loading_wo_type: false,
    wo_type_list: [],
    loading_sr_sub_category: false,
    sr_sub_category_list: [],
};

export const getActivityTemplate = createAsyncThunk(
    "GET_ACTIVITY_TEMPLATE",
    async ({ body, isLoadMore }, thunkAPI) => {
        try {
            const url = '/v1/dbs/api/activity-template/list';
            const response = await accountManagementService.updateDataWithMethodPost(url, body);
            return { ...response.data, isLoadMore };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getDetailActivityTemplate = createAsyncThunk(
    "GET_DETAIL_ACTIVITY_TEMPLATE",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/activity-template/detail/${id}`;
            const response = await accountManagementService.getDetail(url);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const createActivityTemplate = createAsyncThunk(
    "CREATE_ACTIVITY_TEMPLATE",
    async (body, thunkAPI) => {
        try {
            const url = '/v1/dbs/api/activity-template/create';
            const response = await accountManagementService.createData(url, body);
            const successBody = {
                title: "Successful",
                description: "Your activity template has been created successfully.",
                return: true,
            };
            thunkAPI.dispatch(showModalSuccess(successBody));
            return response.data;
        } catch (error) {
            let message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message || error.toString();
            if (Math.floor((error.response?.data?.code || 0) / 100) !== 4) message = "An unknown error occurred";
            const errorBody = {
                title: "Failed",
                description: `Your activity template failed to be created. ${message}`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error?.response);
        }
    }
);

export const updateActivityTemplate = createAsyncThunk(
    "UPDATE_ACTIVITY_TEMPLATE",
    async ({ id, body }, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/activity-template/update/${id}`;
            const response = await accountManagementService.updateData(url, body);
            const successBody = {
                title: "Successful",
                description: "Your activity template has been updated successfully.",
                return: true,
            };
            thunkAPI.dispatch(showModalSuccess(successBody));
            return response.data;
        } catch (error) {
            let message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message || error.toString();
            if (Math.floor((error.response?.data?.code || 0) / 100) !== 4) message = "An unknown error occurred";
            const errorBody = {
                title: "Failed",
                description: `Your activity template failed to be updated. ${message}`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error?.response);
        }
    }
);

export const inactiveActivityTemplate = createAsyncThunk(
    "INACTIVE_ACTIVITY_TEMPLATE",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/activity-template/inactivate/${id}`;
            const response = await accountManagementService.updateData(url);
            const successBody = {
                title: "Successful",
                description: "Your activity template has been inactivated successfully.",
                return: false,
            };
            thunkAPI.dispatch(showModalSuccess(successBody));
            return response.data;
        } catch (error) {
            let message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message || error.toString();
            if (Math.floor((error.response?.data?.code || 0) / 100) !== 4) message = "An unknown error occurred";
            const errorBody = {
                title: "Failed",
                description: `Your activity template failed to be inactivated. ${message}`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error?.response);
        }
    }
);

export const getWOCategory = createAsyncThunk(
    "GET_WO_CATEGORY",
    async (_, thunkAPI) => {
        try {
            const url = '/v1/dbs/api/activity-template/list-wo-category';
            const response = await accountManagementService.getDetail(url);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getWOType = createAsyncThunk(
    "GET_WO_TYPE",
    async (_, thunkAPI) => {
        try {
            const url = '/v1/dbs/api/activity-template/list-wo-type';
            const response = await accountManagementService.getDetail(url);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getSRSubCategory = createAsyncThunk(
    "GET_SR_SUB_CATEGORY_AT",
    async (_, thunkAPI) => {
        try {
            const url = '/v1/dbs/api/activity-template/list-sr-sub-category';
            const response = await accountManagementService.getDetail(url);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

const activityTemplateSlice = createSlice({
    name: "activityTemplate",
    initialState,
    extraReducers: {
        // List
        [getActivityTemplate.pending]: (state, action) => {
            if (!action.meta.arg?.isLoadMore) {
                state.loading_list_at = true;
            }
        },
        [getActivityTemplate.fulfilled]: (state, action) => {
            state.loading_list_at = false;
            const { result, page, isLoadMore } = action.payload;
            if (Array.isArray(result)) {
                if (isLoadMore) {
                    const currentIds = new Set(state.list_at.map((item) => item.id));
                    const filteredResult = result.filter((item) => !currentIds.has(item.id));
                    state.list_at = [...state.list_at, ...filteredResult];
                } else {
                    state.list_at = result;
                }
            }
            state.pagination_at = {
                totalPage: page?.totalPages || 0,
                totalElement: page?.totalElements || 0,
                currentPage: page?.number || 0,
                pageSize: page?.size || 10,
            };
        },
        [getActivityTemplate.rejected]: (state, action) => {
            state.loading_list_at = false;
            if (!action.meta.arg?.isLoadMore) {
                state.list_at = [];
                state.pagination_at = { totalPage: 0, totalElement: 0, currentPage: 0, pageSize: 10 };
            }
        },
        // Detail
        [getDetailActivityTemplate.pending]: (state) => {
            state.detail_at = {};
            state.loading_detail_at = true;
        },
        [getDetailActivityTemplate.fulfilled]: (state, action) => {
            state.detail_at = action.payload || {};
            state.loading_detail_at = false;
        },
        [getDetailActivityTemplate.rejected]: (state) => {
            state.detail_at = {};
            state.loading_detail_at = false;
        },
        // Create
        [createActivityTemplate.pending]: (state) => { state.loading_create_update_at = true; },
        [createActivityTemplate.fulfilled]: (state) => { state.loading_create_update_at = false; },
        [createActivityTemplate.rejected]: (state) => { state.loading_create_update_at = false; },
        // Update
        [updateActivityTemplate.pending]: (state) => { state.loading_create_update_at = true; },
        [updateActivityTemplate.fulfilled]: (state) => { state.loading_create_update_at = false; },
        [updateActivityTemplate.rejected]: (state) => { state.loading_create_update_at = false; },
        // Inactive
        [inactiveActivityTemplate.pending]: (state) => { state.loading_inactive_at = true; },
        [inactiveActivityTemplate.fulfilled]: (state) => { state.loading_inactive_at = false; },
        [inactiveActivityTemplate.rejected]: (state) => { state.loading_inactive_at = false; },
        // WO Category
        [getWOCategory.pending]: (state) => { state.wo_category_list = []; state.loading_wo_category = true; },
        [getWOCategory.fulfilled]: (state, action) => { state.wo_category_list = action.payload || []; state.loading_wo_category = false; },
        [getWOCategory.rejected]: (state) => { state.wo_category_list = []; state.loading_wo_category = false; },
        // WO Type
        [getWOType.pending]: (state) => { state.wo_type_list = []; state.loading_wo_type = true; },
        [getWOType.fulfilled]: (state, action) => { state.wo_type_list = action.payload || []; state.loading_wo_type = false; },
        [getWOType.rejected]: (state) => { state.wo_type_list = []; state.loading_wo_type = false; },
        // SR Sub Category
        [getSRSubCategory.pending]: (state) => { state.sr_sub_category_list = []; state.loading_sr_sub_category = true; },
        [getSRSubCategory.fulfilled]: (state, action) => { state.sr_sub_category_list = action.payload || []; state.loading_sr_sub_category = false; },
        [getSRSubCategory.rejected]: (state) => { state.sr_sub_category_list = []; state.loading_sr_sub_category = false; },
    },
});

const { reducer } = activityTemplateSlice;
export default reducer;
