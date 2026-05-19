import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accountManagementService from "../../services/account_management/accountManagementService";

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
    },
});

const { reducer } = preRequisiteTemplateSlice;
export default reducer;
