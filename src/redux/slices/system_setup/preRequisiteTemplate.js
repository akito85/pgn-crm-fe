import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accountManagementService from "../../services/account_management/accountManagementService";
import { showModalSuccess } from "../general_slice";

const initialState = {
    // List Pre-requisite Template
    loading_list_prt: false,
    list_prt: [],
    pagination_prt: {
        totalPage: 0,
        totalElement: 0,
        currentPage: 0,
        pageSize: 10,
    },

    // Detail Pre-requisite Template
    loading_detail_prt: false,
    detail_prt: {},

    // Create/Update Pre-requisite Template
    loading_create_update_prt: false,

    // source type
    loading_source_type: false,
    list_source_type: [],

    // sr category
    loading_sr_category: false,
    list_sr_category: [],

    // sr sub category
    loading_sr_sub_category: false,
    list_sr_sub_category: [],

    // criteria
    loading_criteria: false,
    list_criteria: [],

    // account group type
    loading_account_group_type: false,
    list_account_group_type: [],

    // account segment
    loading_account_segment: false,
    list_account_segment: [],

    // pre requisite type
    loading_pre_requisite_type: false,
    list_pre_requisite_type: [],
};

export const getPreRequisiteTemplate = createAsyncThunk(
    "GET_PRE_REQUISITE_TEMPLATE",
    async ({ body, isLoadMore }, thunkAPI) => {
        try {
            const url = '/v1/dbs/api/pre-requisite-template/list';
            const response = await accountManagementService.updateDataWithMethodPost(
                url,
                body,
            );
            return {
                ...response.data,
                isLoadMore
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getDetailPreRequisiteTemplate = createAsyncThunk(
    "GET_DETAIL_PRE_REQUISITE_TEMPLATE",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/pre-requisite-template/detail/${id}`;
            const response = await accountManagementService.getDetail(url);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const createPreRequisiteTemplate = createAsyncThunk(
    "CREATE_PRE_REQUISITE_TEMPLATE",
    async (body, thunkAPI) => {
        try {
            const url = '/v1/dbs/api/pre-requisite-template/create';
            const response = await accountManagementService.createData(url, body);
            const successBody = {
                title: "Successful",
                description: "Your pre-requisite template has been created successfully.",
                return: false,
            };
            thunkAPI.dispatch(showModalSuccess(successBody));
            return response.data;
        } catch (error) {
            let message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message || error.toString();
            if (Math.floor((error.response?.data?.code || 0) /100) !== 4) message = "An unknown error occurred";
            const errorBody = {
                title: "Failed",
                description: `Your pre-requisite template failed to be created. ${message}`,
            };
            thunkAPI.dispatch(showModalSuccess(errorBody));
            return thunkAPI.rejectWithValue(error?.response);
        }
    }
);

export const getSourceType = createAsyncThunk(
    "GET_SOURCE_TYPE",
    async (_, thunkAPI) => {
        try {
            const url = '/v1/dbs/api/pre-requisite-template/list-source-type';
            const response = await accountManagementService.getDetail(url);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getSrCategory = createAsyncThunk(
    "GET_SR_CATEGORY",
    async (_, thunkAPI) => {
        try {
            const url = '/v1/dbs/api/pre-requisite-template/list-sr-category';
            const response = await accountManagementService.getDetail(url);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getSrSubCategory = createAsyncThunk(
    "GET_SR_SUB_CATEGORY",
    async (_, thunkAPI) => {
        try {
            const url = '/v1/dbs/api/pre-requisite-template/list-sr-sub-category';
            const response = await accountManagementService.getDetail(url);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getCriteria = createAsyncThunk(
    "GET_CRITERIA",
    async (_, thunkAPI) => {
        try {
            const url = '/v1/dbs/api/pre-requisite-template/list-criteria';
            const response = await accountManagementService.getDetail(url);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getAccountGroupType = createAsyncThunk(
    "GET_ACCOUNT_GROUP_TYPE",
    async (_, thunkAPI) => {
        try {
            const url = '/v1/dbs/api/pre-requisite-template/list-account-group-type';
            const response = await accountManagementService.getDetail(url);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getAccountSegment = createAsyncThunk(
    "GET_ACCOUNT_SEGMENT",
    async (_, thunkAPI) => {
        try {
            const url = '/v1/dbs/api/pre-requisite-template/list-account-segment';
            const response = await accountManagementService.getDetail(url);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getPreRequisiteType = createAsyncThunk(
    "GET_PRE_REQUISITE_TYPE",
    async (_, thunkAPI) => {
        try {
            const url = '/v1/dbs/api/pre-requisite-template/list-pre-requisite-type';
            const response = await accountManagementService.getDetail(url);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

const preRequisiteTemplateSlice = createSlice({
    name: "preRequisiteTemplate",
    initialState,
    extraReducers: {
        // List Pre-requisite Template
        [getPreRequisiteTemplate.pending]: (state, action) => {
            if (!action.meta.arg?.isLoadMore) {
                state.loading_list_prt = true;
            }
        },
        [getPreRequisiteTemplate.fulfilled]: (state, action) => {
            state.loading_list_prt = false;
            const { result, page, isLoadMore } = action.payload;

            if (Array.isArray(result)) {
                if (isLoadMore) {
                    const currentIds = new Set(state.list_prt.map((item) => item.id));
                    const filteredResult = result.filter((item) => !currentIds.has(item.id));
                    state.list_prt = [
                        ...state.list_prt,
                        ...filteredResult
                    ];
                } else {
                    state.list_prt = result;
                }
            }

            state.pagination_prt = {
                totalPage: page?.totalPages || 0,
                totalElement: page?.totalElements || 0,
                currentPage: page?.number || 0,
                pageSize: page?.size || 10,
            };
            state.loading_list_prt = false;
        },
        [getPreRequisiteTemplate.rejected]: (state, action) => {
            state.loading_list_prt = false;

            if (!action.meta.arg?.isLoadMore) {
                state.list_prt = [];
                state.pagination_prt = {
                    totalPage: 0,
                    totalElement: 0,
                    currentPage: 0,
                    pageSize: 10,
                };
            }
        },
        // Detail Pre-requisite Template
        [getDetailPreRequisiteTemplate.pending]: (state) => {
            state.detail_prt = {};
            state.loading_detail_prt = true;
        },
        [getDetailPreRequisiteTemplate.fulfilled]: (state, action) => {
            state.detail_prt = action.payload || {};
            state.loading_detail_prt = false;
        },
        [getDetailPreRequisiteTemplate.rejected]: (state) => {
            state.detail_prt = {};
            state.loading_detail_prt = false;
        },
        // Create Pre-requisite Template
        [createPreRequisiteTemplate.pending]: (state) => {
            state.loading_create_update_prt = true;
        },
        [createPreRequisiteTemplate.fulfilled]: (state) => {
            state.loading_create_update_prt = false;
        },
        [createPreRequisiteTemplate.rejected]: (state) => {
            state.loading_create_update_prt = false;
        },
        // Source Type
        [getSourceType.pending]: (state) => {
            state.list_source_type = [];
            state.loading_source_type = true;
        },
        [getSourceType.fulfilled]: (state, action) => {
            state.list_source_type = action.payload || [];
            state.loading_source_type = false;
        },
        [getSourceType.rejected]: (state) => {
            state.list_source_type = [];
            state.loading_source_type = false;
        },
        // SR Category
        [getSrCategory.pending]: (state) => {
            state.list_sr_category = [];
            state.loading_sr_category = true;
        },
        [getSrCategory.fulfilled]: (state, action) => {
            state.list_sr_category = action.payload || [];
            state.loading_sr_category = false;
        },
        [getSrCategory.rejected]: (state) => {
            state.list_sr_category = [];
            state.loading_sr_category = false;
        },
        // SR Sub Category
        [getSrSubCategory.pending]: (state) => {
            state.list_sr_sub_category = [];
            state.loading_sr_sub_category = true;
        },
        [getSrSubCategory.fulfilled]: (state, action) => {
            state.list_sr_sub_category = action.payload || [];
            state.loading_sr_sub_category = false;
        },
        [getSrSubCategory.rejected]: (state) => {
            state.list_sr_sub_category = [];
            state.loading_sr_sub_category = false;
        },
        // Criteria
        [getCriteria.pending]: (state) => {
            state.list_criteria = [];
            state.loading_criteria = true;
        },
        [getCriteria.fulfilled]: (state, action) => {
            state.list_criteria = action.payload || [];
            state.loading_criteria = false;
        },
        [getCriteria.rejected]: (state) => {
            state.list_criteria = [];
            state.loading_criteria = false;
        },
        // Account Group Type
        [getAccountGroupType.pending]: (state) => {
            state.list_account_group_type = [];
            state.loading_account_group_type = true;
        },
        [getAccountGroupType.fulfilled]: (state, action) => {
            state.list_account_group_type = action.payload || [];
            state.loading_account_group_type = false;
        },
        [getAccountGroupType.rejected]: (state) => {
            state.list_account_group_type = [];
            state.loading_account_group_type = false;
        },
        // Account Segment
        [getAccountSegment.pending]: (state) => {
            state.list_account_segment = [];
            state.loading_account_segment = true;
        },
        [getAccountSegment.fulfilled]: (state, action) => {
            state.list_account_segment = action.payload || [];
            state.loading_account_segment = false;
        },
        [getAccountSegment.rejected]: (state) => {
            state.list_account_segment = [];
            state.loading_account_segment = false;
        },
        // Pre Requisite Type
        [getPreRequisiteType.pending]: (state) => {
            state.list_pre_requisite_type = [];
            state.loading_pre_requisite_type = true;
        },
        [getPreRequisiteType.fulfilled]: (state, action) => {
            state.list_pre_requisite_type = action.payload || [];
            state.loading_pre_requisite_type = false;
        },
        [getPreRequisiteType.rejected]: (state) => {
            state.list_pre_requisite_type = [];
            state.loading_pre_requisite_type = false;
        },
    },
});

const { reducer } = preRequisiteTemplateSlice;
export default reducer;
