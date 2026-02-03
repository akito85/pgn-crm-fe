import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
    setBodyError,
    showModalError,
    showModalSuccess,
    validateError,
} from "../general_slice";

import { errorBody, errorCode, errorMessage } from "../../../utils";

const initialState = {
    loading: false,
    data: null,
    data_detail: null,
    dataListAppHierId: [],
    dataListAppHierDetail: [],
    dataListCategory: [],
    dataApprovalHistory: [],
    dataType: [],
    dataCollectionAgentList: [],
    dataPaymentChannelList: [],
    dataPartnerList: [],
    dataTypeList: [],
};

// Get paginated list
export const getPaginateCaPaymentChannel = createAsyncThunk(
    "GET_ALL_CA_PAYMENT_CHANNEL",
    async ({ search, page, pageSize, sort }, thunkAPI) => {
        try {
            const searchParams = search === undefined ? "" : search;
            const sortParams =
                sort === undefined || sort === "" ? "createdDate~desc" : sort;
            const url = `/v1/dbs/api/ca-payment-channel/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response.data;
        } catch (error) {
            thunkAPI.dispatch(
                validateError({
                    error: error,
                    action: "GET_ALL_CA_PAYMENT_CHANNEL_PAGING",
                    back: false,
                })
            );
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

// Get detail by ID
export const getDetailCaPaymentChannel = createAsyncThunk(
    "GET_DETAIL_CA_PAYMENT_CHANNEL",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/ca-payment-channel/detail-get/${id}`;
            const response = await receiptCollectionHttpService.getDetail(url);
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

// Validate before create/update
export const createValidasiCaPaymentChannel = createAsyncThunk(
    "CREATE_CA_PAYMENT_CHANNEL_VALIDASI",
    async (body, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/ca-payment-channel/validate-create-update`;
            const data = await receiptCollectionHttpService.createData(url, body);
            return data.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            if (Math.floor((error.response.data.code || 0) / 100) === 4) {
                const errorBody = {
                    title: "Failed",
                    description: `${message}.`,
                };
                thunkAPI.dispatch(showModalError(errorBody));
            }
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// Create new record
export const createCaPaymentChannel = createAsyncThunk(
    "CREATE_CA_PAYMENT_CHANNEL",
    async (body, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/ca-payment-channel/create-update`;
            const data = await receiptCollectionHttpService.createData(url, body);
            return data.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            const errorBody = {
                title: "Failed",
                data: error.response.data.data,
                description: `Your data was not created. ${message}.`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Update existing record
export const updateCaPaymentChannel = createAsyncThunk(
    "UPDATE_CA_PAYMENT_CHANNEL",
    async (body, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/ca-payment-channel/create-update`;
            const data = await receiptCollectionHttpService.updateDataPost(url, body);
            return data.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            const errorBody = {
                title: "Failed",
                data: error.response.data.data,
                code: error.response.data.code,
                description: `Your data was not updated. ${message}. Please try again.`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Download filtered list
export const getDownloadCaPaymentChannel = createAsyncThunk(
    "DOWNLOAD_CA_PAYMENT_CHANNEL",
    async ({ search, page, pageSize, sort }, thunkAPI) => {
        try {
            const searchParams = search === undefined ? "" : search;
            const sortParams =
                sort === undefined || sort === "" ? "createdDate~desc" : sort;
            const url = `/v1/dbs/api/ca-payment-channel/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
            const response = await receiptCollectionHttpService.downloadData(url);
            return response.data;
        } catch (response) {
            thunkAPI.dispatch(
                validateError({
                    error: response,
                    action: "DOWNLOAD_CA_PAYMENT_CHANNEL",
                    back: false,
                })
            );
            return thunkAPI.rejectWithValue(response.response);
        }
    }
);

// Get approval history
export const getApprovalHistoryCaPaymentChannel = createAsyncThunk(
    "GET_APPROVAL_HISTORY_CA_PAYMENT_CHANNEL",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/ca-payment-channel/approval-history-get/${id}`;
            const response = await receiptCollectionHttpService.getDetail(url);
            return Array.isArray(response.data) ? null : response.data;
        } catch (error) {
            thunkAPI.dispatch(
                validateError({
                    error: error,
                    action: "GET_APPROVAL_HISTORY_CA_PAYMENT_CHANNEL",
                    back: false,
                })
            );
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

// Approve or reject
export const approveOrRejectCaPaymentChannel = createAsyncThunk(
    "APPROVE_OR_REJECT_CA_PAYMENT_CHANNEL",
    async ({ body }, thunkAPI) => {
        try {
            const url = "/v1/dbs/api/ca-payment-channel/approve-reject";
            const response =
                await receiptCollectionHttpService.activationWithRemarkPost(url, body);
            const message = response?.message;
            const successMessage = {
                title: "Successfull",
                description: `${message}`,
                return: true,
            };
            thunkAPI.dispatch(showModalSuccess(successMessage));
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            if (Math.floor((error.response.data.code || 0) / 100) === 4) {
                const errorBody = {
                    title: "Failed",
                    description: `Your data was not ${body.statusApproval === "APPROVED" ? "approved" : "rejected"
                        }. ${message}.`,
                    return: false,
                };
                thunkAPI.dispatch(showModalError(errorBody));
            }
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// Get approval hierarchy list
export const getAllApprovalListCaPaymentChannel = createAsyncThunk(
    "GET_ALL_APPROVAL_LIST_CA_PAYMENT_CHANNEL",
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

// Get approval hierarchy by ID
export const getListApprovalByIdCaPaymentChannel = createAsyncThunk(
    "GET_LIST_APPROVAL_BY_ID_CA_PAYMENT_CHANNEL",
    async ({ id }, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/apphier/get-approval-hierarchies/${id}`;
            const response = await receiptCollectionHttpService.getDetail(url);
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

// Get list category for attachment
export const getListCategoryCaPaymentChannel = createAsyncThunk(
    "GET_LIST_CATEGORY_CA_PAYMENT_CHANNEL",
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

export const getCollectionAgentList = createAsyncThunk(
    "GET_LIST_COLLECTION_AGENT",
    async (thunkAPI) => {
        try {
            const url = `/v1/dbs/api/collecting-agent/list`;
            const data = await receiptCollectionHttpService.getAll(url);
            return data
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


export const getPaymentChannelList = createAsyncThunk(
    "GET_LIST_PAYMENT_CHANNEL",
    async (thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-channel/list`;
            const data = await receiptCollectionHttpService.getAll(url);
            return data
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

export const getType = createAsyncThunk(
    "GET_LIST_TYPE",
    async (thunkAPI) => {
        try {
            const url = `/v1/dbs/api/ca-payment-channel/list-type`;
            const data = await receiptCollectionHttpService.getAll(url);
            return data;
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

export const getPartnerList = createAsyncThunk(
    "GET_LIST_PARTNER",
    async (thunkAPI) => {
        try {
            const url = `/v1/dbs/api/partner/list`;
            const data = await receiptCollectionHttpService.getAll(url);
            return data
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

export const activeInactiveCaPaymentChannel = createAsyncThunk(
    "INACTIVE_CA_PAYMENT_CHANNEL",
    async ({ body }, thunkAPI) => {
        let status = body?.status === "Active" ? "Inactivate" : "Activate";
        try {
            const url = `/v1/dbs/api/ca-payment-channel/active-inactive`;
            const response = await receiptCollectionHttpService.activationWithRemarkPost(
                url,
                body
            );
            const successMessage = {
                title: "Successfull",
                description: "Your data has been submitted.",
                return: false,
            };
            thunkAPI.dispatch(showModalSuccess(successMessage));
            return response.data;
        } catch (response) {
            thunkAPI.dispatch(
                validateError({
                    error: errorBody(errorCode(response), status, errorMessage(response)),
                    action: "INACTIVE_CA_PAYMENT_CHANNEL",
                    back: false,
                })
            );
            return thunkAPI.rejectWithValue(response.response.data);
        }
    }
);

export const approveOrRejectInactiveCaPaymentChannel = createAsyncThunk(
    "APPROVE_OR_REJECT_FOR_INACTIVE_CA_PAYMENT_CHANNEL",
    async ({ body }, thunkAPI) => {
        try {
            const url = "/v1/dbs/api/ca-payment-channel/approve-inactive";
            const response =
                await receiptCollectionHttpService.activationWithRemarkPost(url, body);
            const message = response?.message;
            const successMessage = {
                title: "Successfull",
                description: `${message}`,
                return: true,
            };
            thunkAPI.dispatch(showModalSuccess(successMessage));
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            if (Math.floor((error.response.data.code || 0) / 100) === 4) {
                const errorBody = {
                    title: "Failed",
                    description: `Your data was not ${body.action === "APPROVE" ? "approved" : "rejected"
                        }. ${message}.`,
                    return: false,
                };
                thunkAPI.dispatch(showModalError(errorBody));
            }
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const saveDraftCaPaymentChannel = createAsyncThunk(
    "SAVE_DRAFT_CA_PAYMENT_CHANNEL",
    async (body, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/ca-payment-channel/save-draft`;
            const data = await receiptCollectionHttpService.createData(url, body);
            const successBody = {
                title: "Successfull",
                description: `Your data has been saved as draft`,
                return: false,
            };
            thunkAPI.dispatch(showModalSuccess(successBody));
            return data.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            const errorBody = {
                title: "Failed",
                data: error.response.data.data,
                description: `Your draft was not saved. ${message}.`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const caPaymentChannelSlice = createSlice({
    name: "caPaymentChannel",
    initialState,
    extraReducers: {
        // Get all paginate
        [getPaginateCaPaymentChannel.pending]: (state, action) => {
            state.data = action.payload;
            state.loading = true;
        },
        [getPaginateCaPaymentChannel.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.loading = false;
        },
        [getPaginateCaPaymentChannel.rejected]: (state, action) => {
            state.data = action.payload;
            state.loading = true;
        },

        // Get detail
        [getDetailCaPaymentChannel.pending]: (state) => {
            state.loading = true;
        },
        [getDetailCaPaymentChannel.fulfilled]: (state, action) => {
            state.data_detail = action.payload;
            state.loading = false;
        },
        [getDetailCaPaymentChannel.rejected]: (state) => {
            state.loading = true;
        },

        // Get Approval History
        [getApprovalHistoryCaPaymentChannel.pending]: (state, action) => {
            state.dataApprovalHistory = action.payload;
            state.loading = true;
        },
        [getApprovalHistoryCaPaymentChannel.fulfilled]: (state, action) => {
            state.dataApprovalHistory = action.payload;
            state.loading = false;
        },
        [getApprovalHistoryCaPaymentChannel.rejected]: (state, action) => {
            state.dataApprovalHistory = action.payload;
            state.loading = false;
        },

        // Get Approval List
        [getAllApprovalListCaPaymentChannel.pending]: (state, action) => {
            state.loading = true;
            state.dataListAppHierId = action.payload;
        },
        [getAllApprovalListCaPaymentChannel.fulfilled]: (state, action) => {
            state.dataListAppHierId = action.payload;
            state.loading = false;
        },
        [getAllApprovalListCaPaymentChannel.rejected]: (state, action) => {
            state.dataListAppHierId = action.payload;
            state.loading = false;
        },

        // Get List Approval By Id
        [getListApprovalByIdCaPaymentChannel.pending]: (state, action) => {
            state.loading = true;
            state.dataListAppHierDetail = action.payload;
        },
        [getListApprovalByIdCaPaymentChannel.fulfilled]: (state, action) => {
            state.dataListAppHierDetail = action.payload;
            state.loading = false;
        },
        [getListApprovalByIdCaPaymentChannel.rejected]: (state, action) => {
            state.dataListAppHierDetail = action.payload;
            state.loading = false;
        },

        // Get List Category
        [getListCategoryCaPaymentChannel.pending]: (state, action) => {
            state.dataListCategory = action.payload;
            state.loading = true;
        },
        [getListCategoryCaPaymentChannel.fulfilled]: (state, action) => {
            state.dataListCategory = action.payload;
            state.loading = false;
        },
        [getListCategoryCaPaymentChannel.rejected]: (state, action) => {
            state.dataListCategory = action.payload;
            state.loading = false;
        },

        // Approve or Reject
        [approveOrRejectCaPaymentChannel.pending]: (state) => {
            state.loading = true;
        },
        [approveOrRejectCaPaymentChannel.fulfilled]: (state) => {
            state.isSuccess = true;
            state.loading = false;
        },
        [approveOrRejectCaPaymentChannel.rejected]: (state, action) => {
            state.isFailed = true;
            state.loading = false;
            state.message = action.payload;
        },

        // Create
        [createCaPaymentChannel.pending]: (state, action) => {
            state.data = action.payload;
            state.loading = true;
        },
        [createCaPaymentChannel.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.loading = false;
        },
        [createCaPaymentChannel.rejected]: (state, action) => {
            state.data = action.payload;
            state.loading = false;
        },

        // Update
        [updateCaPaymentChannel.pending]: (state, action) => {
            state.data = action.payload;
            state.loading = true;
        },
        [updateCaPaymentChannel.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.isSuccess = false;
        },
        [updateCaPaymentChannel.rejected]: (state) => {
            state.isFailed = false;
        },

        // Download
        [getDownloadCaPaymentChannel.fulfilled]: (state, action) => {
            state.data_download = action.payload;
            state.loading = false;
        },
        [getDownloadCaPaymentChannel.rejected]: (state, action) => {
            state.isFailed = true;
            state.data_download = action.payload;
            state.loading = false;
        },

        // Validasi
        [createValidasiCaPaymentChannel.pending]: (state, action) => {
            state.data = action.payload;
            state.loading = true;
        },
        [createValidasiCaPaymentChannel.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.loading = false;
        },
        [createValidasiCaPaymentChannel.rejected]: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        // Get List Collection Agent
        [getCollectionAgentList.fulfilled]: (state, action) => {
            state.dataCollectionAgentList = action.payload;
            state.loading = false;
        },
        [getCollectionAgentList.rejected]: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        // Get List Payment Channel
        [getPaymentChannelList.fulfilled]: (state, action) => {
            state.dataPaymentChannelList = action.payload;
            state.loading = false;
        },
        [getPaymentChannelList.rejected]: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        // Get List Partner
        [getPartnerList.fulfilled]: (state, action) => {
            state.dataPartnerList = action.payload;
            state.loading = false;
        },
        [getPartnerList.rejected]: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        // Get List Type
        [getType.fulfilled]: (state, action) => {
            state.dataTypeList = action.payload;
            state.loading = false;
        },
        [getType.rejected]: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        [activeInactiveCaPaymentChannel.pending]: (state) => {
            state.loading = true;
        },
        [activeInactiveCaPaymentChannel.fulfilled]: (state) => {
            state.isSuccess = true;
            state.loading = false;
        },
        [activeInactiveCaPaymentChannel.rejected]: (state) => {
            state.isFailed = true;
            state.loading = false;
        },
        [approveOrRejectInactiveCaPaymentChannel.pending]: (state) => {
            state.loading = true;
        },
        [approveOrRejectInactiveCaPaymentChannel.fulfilled]: (state) => {
            state.isSuccess = true;
            state.loading = false;
        },
        [approveOrRejectInactiveCaPaymentChannel.rejected]: (state, action) => {
            state.isFailed = true;
            state.loading = false;
            state.message = action.payload;
        },
        [saveDraftCaPaymentChannel.pending]: (state) => {
            state.loading = true;
        },
        [saveDraftCaPaymentChannel.fulfilled]: (state) => {
            state.loading = false;
        },
        [saveDraftCaPaymentChannel.rejected]: (state) => {
            state.loading = false;
        },
    },
});

const { reducer } = caPaymentChannelSlice;
export default reducer;
