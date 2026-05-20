import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import { showModalError } from "../general_slice";

// Dummy JSON
import hc_offset_list from "./temp_hardcoded_json/offset/get-list-offset.json";
import hc_offset_detail from "./temp_hardcoded_json/offset/get-detail-offset.json";
import hc_customer_list from "./temp_hardcoded_json/offset/get-customer-list.json";

const initialState = {
    data: [],
    listCustomer: [],
    customerData: null,
    dataListAppHierId: [],
    dataListAppHierDetail: [],
    dataListCategory: [],
    data_detail: null,
    loading: false,
};

export const searchCustomerOffset = createAsyncThunk(
    "SEARCH_CUSTOMER_OFFSET",
    async ({ page, pageSize, search }, thunkAPI) => {
        try {
            // Using dummy data
            await new Promise(resolve => setTimeout(resolve, 500));
            const customerList = (hc_customer_list?.data || []).map((item) => ({
                ...item,
                key: item.id || item.customerNumber,
            }));
            return {
                ...hc_customer_list,
                data: customerList,
            };
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = { title: "Failed", description: `${message}` };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getAllOffsetListPaginate = createAsyncThunk(
    "GET_ALL_OFFSET_LIST_PAGINATE",
    async ({ page, pageSize, search, sort }, thunkAPI) => {
        try {
            // Using dummy data
            await new Promise(resolve => setTimeout(resolve, 500));
            return hc_offset_list;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = { title: "Failed", description: `${message}` };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getDetailOffset = createAsyncThunk(
    "GET_DETAIL_OFFSET",
    async (id, thunkAPI) => {
        try {
            // Using dummy data
            await new Promise(resolve => setTimeout(resolve, 500));
            return hc_offset_detail;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = { title: "Failed", description: `${message}` };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const approveOrRejectOffset = createAsyncThunk(
    "APPROVE_OR_REJECT_OFFSET",
    async ({ body }, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/approval/approve-reject`;
            const response = await receiptCollectionHttpService.post(url, body);
            return response.data;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = { title: "Failed", description: `${message}` };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getAllApprovalList = createAsyncThunk(
    "GET_ALL_APPROVAL_LIST_OFFSET",
    async (_, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/apphier/get-list-approval-hierarchies`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response.data;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = { title: "Failed", description: `${message}` };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getListApprovalById = createAsyncThunk(
    "GET_LIST_APPROVAL_BY_ID_OFFSET",
    async ({ id }, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/apphier/get-approval-hierarchies/${id}`;
            const response = await receiptCollectionHttpService.getDetail(url);
            return response.data;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = { title: "Failed", description: `${message}` };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getListCategory = createAsyncThunk(
    "GET_LIST_CATEGORY_OFFSET",
    async (_, thunkAPI) => {
        try {
            const url = "/v1/dbs/api/attachment/list-category";
            const response = await receiptCollectionHttpService.getAll(url);
            const mapsCategory = response?.data?.data?.map((item) => ({
                Id: item?.glbTypeValId,
                text: item?.name,
            }));
            return mapsCategory;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = { title: "Failed", description: `${message}` };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

const offsetSlice = createSlice({
    name: "offset",
    initialState,
    reducers: {
        resetDetail: (state) => {
            state.data_detail = null;
        }
    },
    extraReducers: {
        [getAllOffsetListPaginate.pending]: (state) => {
            state.loading = true;
        },
        [getAllOffsetListPaginate.fulfilled]: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
        [getAllOffsetListPaginate.rejected]: (state) => {
            state.loading = false;
        },

        [getDetailOffset.pending]: (state) => {
            state.loading = true;
        },
        [getDetailOffset.fulfilled]: (state, action) => {
            state.loading = false;
            state.data_detail = action.payload;
        },
        [getDetailOffset.rejected]: (state) => {
            state.loading = false;
        },

        [approveOrRejectOffset.pending]: (state) => {
            state.loading = true;
        },
        [approveOrRejectOffset.fulfilled]: (state) => {
            state.loading = false;
        },
        [approveOrRejectOffset.rejected]: (state) => {
            state.loading = false;
        },

        [searchCustomerOffset.pending]: (state) => {
            state.loading = true;
        },
        [searchCustomerOffset.fulfilled]: (state, action) => {
            state.loading = false;
            state.customerData = action.payload;
        },
        [searchCustomerOffset.rejected]: (state) => {
            state.loading = false;
        },

        // Approval List
        [getAllApprovalList.fulfilled]: (state, action) => {
            state.dataListAppHierId = action.payload;
        },

        // Approval Detail
        [getListApprovalById.fulfilled]: (state, action) => {
            state.dataListAppHierDetail = action.payload;
        },

        // Category List
        [getListCategory.fulfilled]: (state, action) => {
            state.dataListCategory = action.payload;
        },
    }
});

const { reducer, actions } = offsetSlice;
export const { resetDetail } = actions;
export default reducer;
