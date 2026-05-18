import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
    showModalError,
    setBodyError,
} from "../general_slice";

const sanitizeSearchInput = (input) => {
    if (typeof input !== 'string') return '';
    return input.replace(/[<>"'&;]/g, '').replace(/--/g, '');
};

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
    data_approval_list_er: null,
    loading_approval_list_er: false,
    loading: false,
    loadingHistory: false,
    isFailed: false,
    isSuccess: false,
    message: "",
    isApprover: false,
    data_upload_validation: null,
    loading_upload_validation: false,
    loading_download_template: false,
    restructureTypes: [],
    restructureSources: [],
    restructureContacts: [],
    allContacts: [],
    rePlanReasons: [],
    cancelReasons: [],
    loadingCancelReasons: false,
    openItemDetail: null,
    loadingOpenItemDetail: false,
    paymentPlanDetail: null,
    loadingPaymentPlanDetail: false,
};

export const getListCustomerRestructure = createAsyncThunk(
    "GET_LIST_CUSTOMER_RESTRUCTURE",
    async (search, thunkAPI) => {
        try {
            const sanitizedSearch = sanitizeSearchInput(search);
            const params = sanitizedSearch ? `?search=${encodeURIComponent(sanitizedSearch)}` : "";
            const url = `/v1/dbs/api/restructure/get-list-customer${params}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response?.data?.result || [];
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
                thunkAPI.dispatch(setBodyError(error));
            } else {
                thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
            }
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
            const message = error?.response?.data?.message || error?.message || error?.toString();
            if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
                thunkAPI.dispatch(setBodyError(error));
            } else {
                thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
            }
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
            const message = error?.response?.data?.message || error?.message || error?.toString();
            if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
                thunkAPI.dispatch(setBodyError(error));
            } else {
                thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
            }
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getAllRestructureListPaginate = createAsyncThunk(
    "GET_ALL_RESTRUCTURE_LIST_PAGINATE",
    async ({ page, pageSize, search, sort }, thunkAPI) => {
        try {
            const searchParams = sanitizeSearchInput(search === undefined ? "" : search);
            const sortValue = sort === undefined || sort === "" ? "id~desc" : sort;
            const url = `/v1/dbs/api/restructure/get-list?page=${page}&pageSize=${pageSize}&sort=${sortValue}&searchs=${searchParams}`;
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
            const searchObj = search ? JSON.parse(decodeURIComponent(search)) : {};
            searchObj.statusApproval = "Pending";
            const searchParams = encodeURIComponent(JSON.stringify(searchObj));
            const url = `/v1/dbs/api/restructure/get-list?page=${page}&size=${pageSize}&searchs=${searchParams}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return { ...response?.data, isLoadMore };
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getListApprovalEarlyRepayment = createAsyncThunk(
    "GET_LIST_APPROVAL_EARLY_REPAYMENT",
    async ({ statusApproval = "Pending", isLoadMore = false } = {}, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/early-repayment/get-list?statusApproval=${encodeURIComponent(statusApproval)}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return { data: response?.data, isLoadMore };
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

export const getDetailEarlyRepayment = createAsyncThunk(
    "GET_DETAIL_EARLY_REPAYMENT",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/early-repayment/detail-get/${id}`;
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

export const getRestructureTypes = createAsyncThunk(
    "GET_RESTRUCTURE_TYPES",
    async (_, thunkAPI) => {
        try {
            const url = "/v1/dbs/api/restructure/get-types";
            const response = await receiptCollectionHttpService.getAll(url);
            return response?.data || [];
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getRestructureSources = createAsyncThunk(
    "GET_RESTRUCTURE_SOURCES",
    async (_, thunkAPI) => {
        try {
            const url = "/v1/dbs/api/restructure/get-sources";
            const response = await receiptCollectionHttpService.getAll(url);
            return response?.data || [];
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getRePlanReasons = createAsyncThunk(
    "GET_REPLAN_REASONS",
    async (_, thunkAPI) => {
        try {
            const url = "/v1/dbs/api/restructure/get-reasons";
            const response = await receiptCollectionHttpService.getAll(url);
            return response?.data || [];
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getCancelReasons = createAsyncThunk(
    "GET_CANCEL_REASONS",
    async (_, thunkAPI) => {
        try {
            const url = "/v1/dbs/api/restructure/get-cancel-reasons";
            const response = await receiptCollectionHttpService.getAll(url);
            return response?.data || [];
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getContactsByAccount = createAsyncThunk(
    "GET_CONTACTS_BY_ACCOUNT",
    async (accountNumber, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/restructure/contacts/${accountNumber}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response?.data || [];
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getAllContactsRestructure = createAsyncThunk(
    "GET_ALL_CONTACTS_RESTRUCTURE",
    async (_, thunkAPI) => {
        try {
            const url = "/v1/dbs/api/restructure/all-contacts";
            const response = await receiptCollectionHttpService.getAll(url);
            return response?.data || [];
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const downloadListRestructure = createAsyncThunk(
    "DOWNLOAD_LIST_RESTRUCTURE",
    async ({ search, sort }, thunkAPI) => {
        try {
            const searchParams = sanitizeSearchInput(search === undefined ? "" : search);
            const sortValue = sort === undefined || sort === "" ? "id~desc" : sort;
            const url = `/v1/dbs/api/restructure/download-list?searchs=${searchParams}&sort=${sortValue}`;
            const response = await receiptCollectionHttpService.downloadXlsx(
                url,
                "restructure_list",
            );
            return response;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
                thunkAPI.dispatch(setBodyError(error));
            } else {
                thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
            }
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getSa = createAsyncThunk(
    "GET_SA",
    async (accountNumber, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/restructure/get-sa/${accountNumber}`;
            const response = await receiptCollectionHttpService.getDetail(url);
            return response?.data || null;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getPrimaryContact = createAsyncThunk(
    "GET_PRIMARY_CONTACT",
    async (accountNumber, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/restructure/get-primary-contact/${accountNumber}`;
            const response = await receiptCollectionHttpService.getDetail(url);
            return response?.data || null;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const approveOrRejectRestructure = createAsyncThunk(
    "APPROVE_OR_REJECT_RESTRUCTURE",
    async ({ body }, thunkAPI) => {
        try {
            const category = body.category || "RESTRUCTURE";
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

export const bulkApproveOrRejectRestructure = createAsyncThunk(
    "BULK_APPROVE_OR_REJECT_RESTRUCTURE",
    async ({ body }, thunkAPI) => {
        try {
            const category = body.category || "RESTRUCTURE";
            const url = `/v1/dbs/api/approval/bulk-approve-reject?category=${category}`;
            const response = await receiptCollectionHttpService.createData(url, { items: body.items });
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

export const cancelRestructure = createAsyncThunk(
    "CANCEL_RESTRUCTURE",
    async ({ id, body }, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/restructure/cancel/${id}`;
            const response = await receiptCollectionHttpService.updateData(url, body);
            return response?.data;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = { title: "Failed", description: `${message}` };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getOpenItemDetail = createAsyncThunk(
    "GET_OPEN_ITEM_DETAIL",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/restructure/open-item/${id}`;
            const response = await receiptCollectionHttpService.getDetail(url);
            return response?.data;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getPaymentPlanDetail = createAsyncThunk(
    "GET_PAYMENT_PLAN_DETAIL",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/restructure/payment-plan/${id}`;
            const response = await receiptCollectionHttpService.getDetail(url);
            return response?.data;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
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
        resetOpenItemDetail: (state) => {
            state.openItemDetail = null;
        },
        resetPaymentPlanDetail: (state) => {
            state.paymentPlanDetail = null;
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
            state.badDebtList = action.payload?.data?.badDebtList || action.payload?.badDebtList || [];
            state.totalBadDebt = (state.badDebtList).reduce((acc, curr) => acc + (curr.totalAmount || curr.amount || 0), 0);
        },
        [getDetailRestructure.rejected]: (state) => {
            state.loading = false;
        },

        [getDetailEarlyRepayment.pending]: (state) => {
            state.loading = true;
        },
        [getDetailEarlyRepayment.fulfilled]: (state, action) => {
            state.loading = false;
            state.data_detail = {
                ...state.data_detail,
                ...action.payload,
                earlyRepayment: action.payload?.earlyRepayment || action.payload
            };
        },
        [getDetailEarlyRepayment.rejected]: (state) => {
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

        // Bulk Approve Or Reject
        [bulkApproveOrRejectRestructure.pending]: (state) => {
            state.loading = true;
        },
        [bulkApproveOrRejectRestructure.fulfilled]: (state) => {
            state.loading = false;
        },
        [bulkApproveOrRejectRestructure.rejected]: (state) => {
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
        [getListApprovalById.pending]: (state) => {
            state.loading_approval_detail = true;
        },
        [getListApprovalById.fulfilled]: (state, action) => {
            state.loading_approval_detail = false;
            state.dataListAppHierDetail = action.payload;
        },
        [getListApprovalById.rejected]: (state) => {
            state.loading_approval_detail = false;
        },

        // Get Approval History
        [getApprovalHistory.pending]: (state) => {
            state.loading = true;
            state.loadingHistory = true;
            state.dataApprovalHistory = null;
        },
        [getApprovalHistory.fulfilled]: (state, action) => {
            state.loading = false;
            state.loadingHistory = false;
            state.dataApprovalHistory = action.payload;
        },
        [getApprovalHistory.rejected]: (state) => {
            state.loading = false;
            state.loadingHistory = false;
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

        // Get Early Repayment Approval List
        [getListApprovalEarlyRepayment.pending]: (state) => {
            state.loading_approval_list_er = true;
        },
        [getListApprovalEarlyRepayment.fulfilled]: (state, action) => {
            state.loading_approval_list_er = false;
            const payload = action.payload?.data;
            if (action.payload?.isLoadMore) {
                const oldResult = state.data_approval_list_er?.result || [];
                const newResult = payload?.result || [];
                state.data_approval_list_er = { ...payload, result: [...oldResult, ...newResult] };
            } else {
                state.data_approval_list_er = payload;
            }
        },
        [getListApprovalEarlyRepayment.rejected]: (state) => {
            state.loading_approval_list_er = false;
        },

        // Get List Category
        [getListCategory.fulfilled]: (state, action) => {
            state.dataListCategory = action.payload;
        },

        // Upload Validation
        [uploadRestructureValidation.pending]: (state) => {
            state.loading_upload_validation = true;
        },
        [uploadRestructureValidation.fulfilled]: (state, action) => {
            state.loading_upload_validation = false;
            state.data_upload_validation = action.payload?.data || action.payload;
        },
        [uploadRestructureValidation.rejected]: (state) => {
            state.loading_upload_validation = false;
            state.data_upload_validation = null;
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
        // Types
        [getRestructureTypes.fulfilled]: (state, action) => {
            state.restructureTypes = action.payload;
        },
        // Sources
        [getRestructureSources.fulfilled]: (state, action) => {
            state.restructureSources = action.payload;
        },
        // Reasons
        [getRePlanReasons.fulfilled]: (state, action) => {
            state.rePlanReasons = action.payload;
        },
        // Cancel Reasons
        [getCancelReasons.pending]: (state) => {
            state.loadingCancelReasons = true;
        },
        [getCancelReasons.fulfilled]: (state, action) => {
            state.loadingCancelReasons = false;
            state.cancelReasons = action.payload;
        },
        [getCancelReasons.rejected]: (state) => {
            state.loadingCancelReasons = false;
        },
        // Contacts
        [getContactsByAccount.pending]: (state) => {
            state.loading = true;
        },
        [getContactsByAccount.fulfilled]: (state, action) => {
            state.loading = false;
            state.restructureContacts = action.payload;
        },
        [getContactsByAccount.rejected]: (state) => {
            state.loading = false;
        },
        // All Contacts
        [getAllContactsRestructure.pending]: (state) => {
            state.loading = true;
        },
        [getAllContactsRestructure.fulfilled]: (state, action) => {
            state.loading = false;
            state.allContacts = action.payload;
        },
        [getAllContactsRestructure.rejected]: (state) => {
            state.loading = false;
        },
        // Get Open Item Detail
        [getOpenItemDetail.pending]: (state) => {
            state.loadingOpenItemDetail = true;
        },
        [getOpenItemDetail.fulfilled]: (state, action) => {
            state.loadingOpenItemDetail = false;
            state.openItemDetail = action.payload;
        },
        [getOpenItemDetail.rejected]: (state) => {
            state.loadingOpenItemDetail = false;
        },
        // Get Payment Plan Detail
        [getPaymentPlanDetail.pending]: (state) => {
            state.loadingPaymentPlanDetail = true;
        },
        [getPaymentPlanDetail.fulfilled]: (state, action) => {
            state.loadingPaymentPlanDetail = false;
            state.paymentPlanDetail = action.payload;
        },
        [getPaymentPlanDetail.rejected]: (state) => {
            state.loadingPaymentPlanDetail = false;
        },
    },
});

const { reducer, actions } = restructureSlice;
export const { resetBadDebt, resetDetail, resetOpenItemDetail, resetPaymentPlanDetail } = actions;
export default reducer;
