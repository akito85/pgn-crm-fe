import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
    showModalError,
    showModalSuccess,
    setBodyError,
    validateError,
} from "../general_slice";



export const submitTransferToCustomer = createAsyncThunk(
    "SUBMIT_TRANSFER_TO_CUSTOMER",
    async (body, thunkAPI) => {
        try {
            const url = "/v1/dbs/api/payment-warranty/transfer-to-customer";
            const response = await receiptCollectionHttpService.post(url, body);
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
            return thunkAPI.rejectWithValue(error?.response?.data);
        }
    }
);

export const getAllApprovalList = createAsyncThunk(
    "GET_ALL_APPROVAL_LIST_CUSTOMER",
    async (thunkAPI) => {
        try {
            const url = `/v1/dbs/api/apphier/get-list-approval-hierarchies`;
            const response = await receiptCollectionHttpService.getAll(url);
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
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getDetailTransferToCustomer = createAsyncThunk(
    "GET_DETAIL_TRANSFER_CUSTOMER",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-warranty/transfer-to-customer/get-detail/${id}`;
            const response = await receiptCollectionHttpService.getAll(url);
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
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const approveOrRejectTransferToCustomer = createAsyncThunk(
    "APPROVE_OR_REJECT_TRANSFER_CUSTOMER",
    async ({ body }, thunkAPI) => {
        try {
            const url = "/v1/dbs/api/payment-warranty/transfer-customer/approve-reject";
            const response = await receiptCollectionHttpService.createData(url, body);
            thunkAPI.dispatch(showModalSuccess({
                title: "Success",
                description: response?.message || "Success Approve Transfer To Customer"
            }));
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
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getListApprovalById = createAsyncThunk(
    "GET_LIST_APPROVAL_BY_ID_TRANSFER_CUSTOMER",
    async ({ id }, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/apphier/get-approval-hierarchies/${id}`;
            const response = await receiptCollectionHttpService.getAll(url);
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
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getApprovalHistoryTransferToCustomer = createAsyncThunk(
    "GET_APPROVAL_HISTORY_TRANSFER_CUSTOMER",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-warranty/transfer-to-customer/approval-history/${id}`;
            const response = await receiptCollectionHttpService.getAll(url);
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
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const deleteTransferToCustomer = createAsyncThunk(
    "DELETE_TRANSFER_TO_CUSTOMER",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-warranty/transfer-to-customer/delete/${id}`;
            const response = await receiptCollectionHttpService.deleteData(url);
            thunkAPI.dispatch(showModalSuccess({
                title: "Success",
                description: response?.message || "Success Delete Transfer To Customer",
                return: false,
            }));
            return id;
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
                    return: false,
                };
                thunkAPI.dispatch(showModalError(errorBody));
            }
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);



export const getListWarranty = createAsyncThunk(
    "GET_LIST_WARRANTY_CUSTOMER",
    async (customerId, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-warranty/warranties${customerId ? `?customerId=${customerId}` : ""}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response.data.customers;
        } catch (error) {
            const message =
                error?.response?.data?.message || error?.message || error?.toString();
            if (
                error?.response?.data?.code === 500 ||
                error?.response?.data?.code === 419
            ) {
                thunkAPI.dispatch(setBodyError(error));
            } else {
                thunkAPI.dispatch(
                    validateError({ error: error, action: "GET_LIST_WARRANTY_CUSTOMER" })
                );
            }
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getListFromCustomer = createAsyncThunk(
    "GET_LIST_FROM_CUSTOMER_CUSTOMER",
    async ({ search, page, pageSize, sort } = {}, thunkAPI) => {
        try {
            const searchParams = search === undefined ? "" : search;
            const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
            const url = `/v1/dbs/api/payment-warranty/customer/get-list?page=${page || 1}&size=${pageSize || 10}&sort=${sortParams}&searchs=${searchParams}`;
            const response = await receiptCollectionHttpService.getAll(url);
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
                thunkAPI.dispatch(
                    validateError({ error: error, action: "GET_LIST_FROM_CUSTOMER_CUSTOMER" })
                );
            }
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getCurrencyDDL = createAsyncThunk(
    "GET_LIST_CURRENCY_TRANSFER_CUSTOMER",
    async (_, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/receipt/list-payment-currency`;
            const response = await receiptCollectionHttpService.getAll(url);
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
                thunkAPI.dispatch(
                    validateError({ error: error, action: "GET_LIST_CURRENCY_TRANSFER_CUSTOMER" })
                );
            }
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getListCategory = createAsyncThunk(
    "GET_LIST_CATEGORY_TRANSFER_CUSTOMER",
    async (thunkAPI) => {
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
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);



export const getAllTransferToCustomerListPaginate = createAsyncThunk(
    "GET_ALL_TRANSFER_TO_CUSTOMER_LIST_PAGINATE",
    async ({ page, pageSize, search, sort }, thunkAPI) => {
        try {
            const searchParams = search === undefined ? "" : search;
            const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
            const url = `/v1/dbs/api/payment-warranty/transfer-to-customer/get-list?page=${page || 1}&size=${pageSize || 10}&sort=${sortParams}&searchs=${searchParams}`;
            const response = await receiptCollectionHttpService.getAll(url);
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
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const exportTransferToCustomerToExcel = createAsyncThunk(
    "EXPORT_TRANSFER_TO_CUSTOMER_LIST_EXCEL",
    async ({ search, page, pageSize, sort }, thunkAPI) => {
        try {
            const searchParams = search === undefined ? "" : search;
            const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
            const url = `/v1/dbs/api/payment-warranty/transfer-to-customer/export-to-excel?page=${page || 1}&size=${pageSize || 10}&sort=${sortParams}&searchs=${searchParams}`;
            const response = await receiptCollectionHttpService.downloadData(url);
            return response;
        } catch (error) {
            thunkAPI.dispatch(
                validateError({ error: error, action: "EXPORT_TRANSFER_TO_CUSTOMER_LIST_EXCEL" })
            );
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

const initialState = {
    data: [],
    listCustomer: [], // Store customer list from modal search
    dataListAppHierId: [],
    data_detail: null,
    dataListAppHierDetail: [],
    dataApprovalHistory: null,
    dataListCategory: [],
    loading: false,
    loadingApproval: false,
    isFailed: false,
    isSuccess: false,
    message: "",
    listWarranty: [],
    listFromCustomer: [],
    currencyDDL: [],
};


export const getListCustomer = createAsyncThunk(
    "GET_LIST_CUSTOMER",
    async ({ search, page, pageSize, sort } = {}, thunkAPI) => {
        try {
            const searchParams = search === undefined ? "" : search;
            const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
            const url = `/v1/dbs/api/payment-warranty/customer/get-list?page=${page || 1}&size=${pageSize || 10}&sort=${sortParams}&searchs=${searchParams}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response.data;
        } catch (error) {
            thunkAPI.dispatch(
                validateError({ error: error, action: "GET_LIST_CUSTOMER" })
            );
            return thunkAPI.rejectWithValue(error);
        }
    }
);


const transferToCustomerSlice = createSlice({
    name: "transferToCustomer",
    initialState,
    reducers: {
        clearApprovalHistory: (state) => {
            state.dataListAppHierDetail = [];
            state.dataApprovalHistory = null;
        },
    },
    extraReducers: {
        // Get List Warranty
        [getListWarranty.fulfilled]: (state, action) => {
            state.listWarranty = action.payload;
        },
        // Get List From Customer
        [getListFromCustomer.fulfilled]: (state, action) => {
            state.listFromCustomer = action.payload;
        },

        // Get Currency DDL
        [getCurrencyDDL.fulfilled]: (state, action) => {
            state.currencyDDL = action.payload;
        },


        // Get All Pagination
        [getAllTransferToCustomerListPaginate.pending]: (state) => {
            state.loading = true;
        },
        [getAllTransferToCustomerListPaginate.fulfilled]: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
        [getAllTransferToCustomerListPaginate.rejected]: (state) => {
            state.loading = false;
        },

        // Get List Customer
        [getListCustomer.pending]: (state) => {
            // state.loading = true; 
        },
        [getListCustomer.fulfilled]: (state, action) => {
            // state.loading = false;
            state.listCustomer = action.payload;
        },
        [getListCustomer.rejected]: (state) => {
            // state.loading = false;
        },


        // Submit
        [submitTransferToCustomer.pending]: (state) => {
            state.loading = true;
        },
        [submitTransferToCustomer.fulfilled]: (state) => {
            state.loading = false;
        },
        [submitTransferToCustomer.rejected]: (state) => {
            state.loading = false;
        },

        // Get All Approval List
        [getAllApprovalList.pending]: (state) => {
            // state.loading = true;
        },
        [getAllApprovalList.fulfilled]: (state, action) => {
            state.dataListAppHierId = action.payload;
        },
        [getAllApprovalList.rejected]: (state) => {
            // state.loading = false;
        },

        // Get Detail
        [getDetailTransferToCustomer.pending]: (state) => {
            state.loading = true;
        },
        [getDetailTransferToCustomer.fulfilled]: (state, action) => {
            state.data_detail = action.payload;
            state.loading = false;
        },
        [getDetailTransferToCustomer.rejected]: (state) => {
            state.loading = false;
        },

        // Approve Or Reject
        [approveOrRejectTransferToCustomer.pending]: (state) => {
            state.loading = true;
        },
        [approveOrRejectTransferToCustomer.fulfilled]: (state) => {
            state.loading = false;
        },
        [approveOrRejectTransferToCustomer.rejected]: (state) => {
            state.loading = false;
        },

        // Get List Approval By Id (appHierId → array of approval levels)
        [getListApprovalById.pending]: (state) => {
            state.loadingApproval = true;
        },
        [getListApprovalById.fulfilled]: (state, action) => {
            state.dataListAppHierDetail = action.payload;
            state.loadingApproval = false;
        },
        [getListApprovalById.rejected]: (state) => {
            state.loadingApproval = false;
        },

        // Get Approval History (transfer HDR id → {dataApprover, dataHistory})
        [getApprovalHistoryTransferToCustomer.pending]: (state) => {
            state.loadingApproval = true;
        },
        [getApprovalHistoryTransferToCustomer.fulfilled]: (state, action) => {
            state.dataApprovalHistory = action.payload;
            state.loadingApproval = false;
        },
        [getApprovalHistoryTransferToCustomer.rejected]: (state) => {
            state.loadingApproval = false;
        },

        // Get List Category
        [getListCategory.pending]: (state) => {
            // state.loading = true;
        },
        [getListCategory.fulfilled]: (state, action) => {
            state.dataListCategory = action.payload;
        },
        [getListCategory.rejected]: (state) => {
            // state.loading = false;
        },

        // Delete
        [deleteTransferToCustomer.pending]: (state) => {
            state.loading = true;
        },
        [deleteTransferToCustomer.fulfilled]: (state) => {
            state.loading = false;
        },
        [deleteTransferToCustomer.rejected]: (state) => {
            state.loading = false;
        },
    },
});


const { reducer, actions } = transferToCustomerSlice;
export const { clearApprovalHistory } = actions;
export default reducer;
