import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
    showModalError,
    setBodyError,
} from "../general_slice";

// Hard Code
import hc_restructure_list from "./temp_hardcoded_json/restructure/get-list-restructure.json";
import hc_customer_list from "./temp_hardcoded_json/restructure/get-list-customer-restructure.json";
import hc_account_list from "./temp_hardcoded_json/restructure/get-list-account-restructure.json";
import hc_bad_debt_list from "./temp_hardcoded_json/restructure/get-bad-debt.json";
import hc_restructure_detail from "./temp_hardcoded_json/restructure/get-detail-restructure.json";

const initialState = {
    data: [],
    listCustomer: [],
    listAccount: [],
    badDebtList: [],
    totalBadDebt: 0,
    dataListAppHierId: [],
    dataListAppHierDetail: [],
    dataListCategory: [],
    data_detail: null,
    dataApprovalHistory: null,
    loading: false,
    isFailed: false,
    isSuccess: false,
    message: "",
};

export const getListCustomerRestructure = createAsyncThunk(
    "GET_LIST_CUSTOMER_RESTRUCTURE",
    async (_, thunkAPI) => {
        try {
            const response = hc_customer_list;
            await new Promise((resolve) => setTimeout(resolve, 500));
            return response.data.result;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getBadDebtByAccount = createAsyncThunk(
    "GET_BAD_DEBT_BY_ACCOUNT",
    async (accountNumber, thunkAPI) => {
        try {
            const response = hc_bad_debt_list;
            await new Promise((resolve) => setTimeout(resolve, 500));
            const total = response.reduce((acc, curr) => acc + curr.totalAmount, 0);
            return { list: response, total };
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getListAccountRestructure = createAsyncThunk(
    "GET_LIST_ACCOUNT_RESTRUCTURE",
    async (_, thunkAPI) => {
        try {
            const response = hc_account_list;
            await new Promise((resolve) => setTimeout(resolve, 500));
            return response.data.result;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getAllRestructureListPaginate = createAsyncThunk(
    "GET_ALL_RESTRUCTURE_LIST_PAGINATE",
    async ({ page, pageSize, search, sort }, thunkAPI) => {
        try {
            const response = hc_restructure_list;
            await new Promise(resolve => setTimeout(resolve, 500));
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
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getAllApprovalList = createAsyncThunk(
    "GET_ALL_APPROVAL_LIST_RESTRUCTURE",
    async (_, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/apphier/get-list-approval-hierarchies`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response.data;
        } catch (error) {
            const message =
                error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = {
                title: "Failed",
                description: `${message}`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getListApprovalById = createAsyncThunk(
    "GET_LIST_APPROVAL_BY_ID_RESTRUCTURE",
    async ({ id }, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/apphier/get-approval-hierarchies/${id}`;
            const response = await receiptCollectionHttpService.getDetail(url);
            return response.data;
        } catch (error) {
            const message =
                error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = {
                title: "Failed",
                description: `${message}`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getListCategory = createAsyncThunk(
    "GET_LIST_CATEGORY_RESTRUCTURE",
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
            const message =
                error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = {
                title: "Failed",
                description: `${message}`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getApprovalHistory = createAsyncThunk(
    "GET_APPROVAL_HISTORY_RESTRUCTURE",
    async ({ id }, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/restructure/get-approval-history/${id}`;
            const response = await receiptCollectionHttpService.getDetail(url);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getDetailRestructure = createAsyncThunk(
    "GET_DETAIL_RESTRUCTURE",
    async (id, thunkAPI) => {
        try {
            const response = hc_restructure_detail;
            await new Promise((resolve) => setTimeout(resolve, 0));
            return response.data;
        } catch (error) {
            const message =
                error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = {
                title: "Failed",
                description: `${message}`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const approveOrRejectRestructure = createAsyncThunk(
    "APPROVE_OR_REJECT_RESTRUCTURE",
    async ({ body }, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/approval/approve-reject`;
            const response = await receiptCollectionHttpService.post(url, body);
            return response.data;
        } catch (error) {
            const message =
                error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = {
                title: "Failed",
                description: `${message}`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const deleteRestructure = createAsyncThunk(
    "DELETE_RESTRUCTURE",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/restructure/delete/${id}`;
            const response = await receiptCollectionHttpService.deleteData(url);
            return response.data;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = { title: "Failed", description: `${message}` };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

const restructureSlice = createSlice({
    name: "restructure",
    initialState,
    reducers: {
        resetBadDebt: (state) => {
            state.badDebtList = [];
            state.totalBadDebt = 0;
        },
    },
    extraReducers: {
        // Get Detail
        [getDetailRestructure.pending]: (state) => {
            state.loading = true;
        },
        [getDetailRestructure.fulfilled]: (state, action) => {
            state.loading = false;
            state.data_detail = action.payload;
            state.badDebtList = action.payload?.badDebtList || [];
            state.totalBadDebt = (action.payload?.badDebtList || []).reduce((acc, curr) => acc + curr.totalAmount, 0);
        },
        [getDetailRestructure.rejected]: (state) => {
            state.loading = false;
        },

        // Approve Or Reject
        [approveOrRejectRestructure.pending]: (state) => {
            state.loading = true;
        },
        [approveOrRejectRestructure.fulfilled]: (state) => {
            state.loading = false;
        },
        [approveOrRejectRestructure.rejected]: (state) => {
            state.loading = false;
        },

        // Delete
        [deleteRestructure.pending]: (state) => {
            state.loading = true;
        },
        [deleteRestructure.fulfilled]: (state) => {
            state.loading = false;
        },
        [deleteRestructure.rejected]: (state) => {
            state.loading = false;
        },

        // Get All Pagination
        [getAllRestructureListPaginate.pending]: (state) => {
            state.loading = true;
        },
        [getAllRestructureListPaginate.fulfilled]: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
        [getAllRestructureListPaginate.rejected]: (state) => {
            state.loading = false;
        },

        // Get List Customer
        [getListCustomerRestructure.fulfilled]: (state, action) => {
            state.listCustomer = action.payload;
        },

        // Get List Account
        [getListAccountRestructure.fulfilled]: (state, action) => {
            state.listAccount = action.payload;
        },

        // Get Bad Debt
        [getBadDebtByAccount.pending]: (state) => {
            state.loading = true;
        },
        [getBadDebtByAccount.fulfilled]: (state, action) => {
            state.loading = false;
            state.badDebtList = action.payload.list;
            state.totalBadDebt = action.payload.total;
        },
        [getBadDebtByAccount.rejected]: (state) => {
            state.loading = false;
        },

        // Get All Approval List
        [getAllApprovalList.fulfilled]: (state, action) => {
            state.dataListAppHierId = action.payload;
        },

        // Get List Approval By Id
        [getListApprovalById.fulfilled]: (state, action) => {
            state.dataListAppHierDetail = action.payload;
        },

        // Get Approval History
        [getApprovalHistory.pending]: (state) => {
            state.loading = true;
        },
        [getApprovalHistory.fulfilled]: (state, action) => {
            state.loading = false;
            state.dataApprovalHistory = action.payload;
        },
        [getApprovalHistory.rejected]: (state) => {
            state.loading = false;
        },

        // Get List Category
        [getListCategory.fulfilled]: (state, action) => {
            state.dataListCategory = action.payload;
        },
    },
});

const { reducer, actions } = restructureSlice;
export const { resetBadDebt } = actions;
export default reducer;
