import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
    showModalError,
    setBodyError,
} from "../general_slice";

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
    data_approval_list: null,
    loading_approval_list: false,
    loading: false,
    isFailed: false,
    isSuccess: false,
    message: "",
    isApprover: false,
    loading_upload_validation: false,
    loading_download_template: false,
};

export const getListCustomerRestructure = createAsyncThunk(
    "GET_LIST_CUSTOMER_RESTRUCTURE",
    async (search, thunkAPI) => {
        try {
            const params = search ? `?search=${encodeURIComponent(search)}` : "";
            const url = `/v1/dbs/api/restructure/get-list-customer${params}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response?.data?.result || [];
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getBadDebtByAccount = createAsyncThunk(
    "GET_BAD_DEBT_BY_ACCOUNT",
    async (accountNumber, thunkAPI) => {
        try {
            const params = accountNumber ? `?accountNumber=${encodeURIComponent(accountNumber)}` : "";
            const url = `/v1/dbs/api/restructure/bad-debt${params}`;
            const response = await receiptCollectionHttpService.getAll(url);
            const list = response?.data || [];
            const total = list.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
            return { list, total };
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getListAccountRestructure = createAsyncThunk(
    "GET_LIST_ACCOUNT_RESTRUCTURE",
    async (customerNumber, thunkAPI) => {
        try {
            const params = customerNumber ? `?customerNumber=${encodeURIComponent(customerNumber)}` : "";
            const url = `/v1/dbs/api/restructure/get-list-account${params}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response?.data?.result || [];
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getAllRestructureListPaginate = createAsyncThunk(
    "GET_ALL_RESTRUCTURE_LIST_PAGINATE",
    async ({ page, pageSize, search, sort }, thunkAPI) => {
        try {
            const params = new URLSearchParams();
            if (page !== undefined) params.append("page", page);
            if (pageSize !== undefined) params.append("pageSize", pageSize);
            if (search) params.append("searchs", typeof search === "string" ? search : JSON.stringify(search));
            if (sort) params.append("sort", sort);
            const url = `/v1/dbs/api/restructure/get-list?${params.toString()}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response?.data;
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

export const getListApprovalRestructure = createAsyncThunk(
    "GET_LIST_APPROVAL_RESTRUCTURE",
    async ({ page, pageSize, search, isLoadMore }, thunkAPI) => {
        try {
            const params = new URLSearchParams();
            params.append("page", page);
            params.append("size", pageSize);
            
            // Filter for items waiting for approval
            // According to backend logic, statusApproval = 'Pending' for submitted items
            const searchObj = search ? JSON.parse(decodeURIComponent(search)) : {};
            searchObj.statusApproval = "Pending";
            params.append("searchs", JSON.stringify(searchObj));

            const url = `/v1/dbs/api/restructure/get-list?${params.toString()}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return { ...response?.data, isLoadMore };
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
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
            const url = `/v1/dbs/api/restructure/detail-get/${id}`;
            const response = await receiptCollectionHttpService.getDetail(url);
            return response?.data;
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

export const saveRestructure = createAsyncThunk(
    "SAVE_RESTRUCTURE",
    async ({ body }, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/restructure/save`;
            const response = await receiptCollectionHttpService.createData(url, body);
            return response?.data;
        } catch (error) {
            const message =
                error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = { title: "Failed", description: `${message}` };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const updateRestructure = createAsyncThunk(
    "UPDATE_RESTRUCTURE",
    async ({ id, body }, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/restructure/update/${id}`;
            const response = await receiptCollectionHttpService.updateData(url, body);
            return response?.data;
        } catch (error) {
            const message =
                error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = { title: "Failed", description: `${message}` };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const saveEarlyRepayment = createAsyncThunk(
    "SAVE_EARLY_REPAYMENT",
    async ({ body }, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/early-repayment/save`;
            const response = await receiptCollectionHttpService.createData(url, body);
            return response?.data;
        } catch (error) {
            const message =
                error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = { title: "Failed", description: `${message}` };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const updateEarlyRepayment = createAsyncThunk(
    "UPDATE_EARLY_REPAYMENT",
    async ({ id, body }, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/early-repayment/update/${id}`;
            const response = await receiptCollectionHttpService.updateData(url, body);
            return response?.data;
        } catch (error) {
            const message =
                error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = { title: "Failed", description: `${message}` };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const uploadRestructureValidation = createAsyncThunk(
    "UPLOAD_RESTRUCTURE_VALIDATION",
    async ({ file }, thunkAPI) => {
        try {
            const url = "/v1/dbs/api/restructure/upload-validation";
            const formData = new FormData();
            formData.append("file", file);
            const response = await receiptCollectionHttpService.uploadBulk(url, formData);
            return response.data;
        } catch (error) {
            thunkAPI.dispatch(setBodyError(error));
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const saveRestructureUpload = createAsyncThunk(
    "SAVE_RESTRUCTURE_UPLOAD",
    async ({ body }, thunkAPI) => {
        try {
            const url = "/v1/dbs/api/restructure/save-upload";
            const response = await receiptCollectionHttpService.createData(url, body);
            return response.data;
        } catch (error) {
            thunkAPI.dispatch(setBodyError(error));
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getDownloadTemplateRestructure = createAsyncThunk(
    "GET_DOWNLOAD_TEMPLATE_RESTRUCTURE",
    async (_, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/restructure/download-template`;
            const response = await receiptCollectionHttpService.downloadXlsx(
                url,
                "restructure_template",
            );
            return response;
        } catch (error) {
            thunkAPI.dispatch(setBodyError(error));
            return error;
        }
    }
);

export const approveOrRejectRestructure = createAsyncThunk(
    "APPROVE_OR_REJECT_RESTRUCTURE",
    async ({ body }, thunkAPI) => {
        try {
            const category = body.category || "INSTALLMENT";
            const url = `/v1/dbs/api/approval/approve-reject?category=${category}`;
            const response = await receiptCollectionHttpService.createData(url, body);
            return response?.data;
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
            return response?.data;
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
        resetDetail: (state) => {
            state.data_detail = null;
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
            state.totalBadDebt = (action.payload?.badDebtList || []).reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
        },
        [getDetailRestructure.rejected]: (state) => {
            state.loading = false;
        },

        // Save Restructure
        [saveRestructure.pending]: (state) => { state.loading = true; },
        [saveRestructure.fulfilled]: (state) => { state.loading = false; state.isSuccess = true; },
        [saveRestructure.rejected]: (state) => { state.loading = false; state.isFailed = true; },

        // Update Restructure
        [updateRestructure.pending]: (state) => { state.loading = true; },
        [updateRestructure.fulfilled]: (state) => { state.loading = false; state.isSuccess = true; },
        [updateRestructure.rejected]: (state) => { state.loading = false; state.isFailed = true; },

        // Save Early Repayment
        [saveEarlyRepayment.pending]: (state) => { state.loading = true; },
        [saveEarlyRepayment.fulfilled]: (state) => { state.loading = false; state.isSuccess = true; },
        [saveEarlyRepayment.rejected]: (state) => { state.loading = false; state.isFailed = true; },

        // Update Early Repayment
        [updateEarlyRepayment.pending]: (state) => { state.loading = true; },
        [updateEarlyRepayment.fulfilled]: (state) => { state.loading = false; state.isSuccess = true; },
        [updateEarlyRepayment.rejected]: (state) => { state.loading = false; state.isFailed = true; },

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

        // Get Approval List
        [getListApprovalRestructure.pending]: (state) => {
            state.loading_approval_list = true;
        },
        [getListApprovalRestructure.fulfilled]: (state, action) => {
            state.loading_approval_list = false;
            if (action.payload.isLoadMore) {
                const oldResult = state.data_approval_list?.result || [];
                const newResult = action.payload?.result || [];
                state.data_approval_list = {
                    ...action.payload,
                    result: [...oldResult, ...newResult],
                };
            } else {
                state.data_approval_list = action.payload;
            }
        },
        [getListApprovalRestructure.rejected]: (state) => {
            state.loading_approval_list = false;
        },

        // Get List Category
        [getListCategory.fulfilled]: (state, action) => {
            state.dataListCategory = action.payload;
        },

        // Upload Validation
        [uploadRestructureValidation.pending]: (state) => {
            state.loading_upload_validation = true;
        },
        [uploadRestructureValidation.fulfilled]: (state) => {
            state.loading_upload_validation = false;
        },
        [uploadRestructureValidation.rejected]: (state) => {
            state.loading_upload_validation = false;
        },

        // Save Upload
        [saveRestructureUpload.pending]: (state) => {
            state.loading = true;
        },
        [saveRestructureUpload.fulfilled]: (state) => {
            state.loading = false;
        },
        [saveRestructureUpload.rejected]: (state) => {
            state.loading = false;
        },

        // Download Template
        [getDownloadTemplateRestructure.pending]: (state) => {
            state.loading_download_template = true;
        },
        [getDownloadTemplateRestructure.fulfilled]: (state) => {
            state.loading_download_template = false;
        },
        [getDownloadTemplateRestructure.rejected]: (state) => {
            state.loading_download_template = false;
        },
    },
});

const { reducer, actions } = restructureSlice;
export const { resetBadDebt, resetDetail } = actions;
export default reducer;
