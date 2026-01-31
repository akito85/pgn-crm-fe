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
};

// Get paginated list
export const getPaginateCollectingAgent = createAsyncThunk(
    "GET_ALL_COLLECTING_AGENT",
    async ({ search, page, pageSize, sort }, thunkAPI) => {
        try {
            const searchParams = search === undefined ? "" : search;
            const sortParams =
                sort === undefined || sort === "" ? "createdDate~desc" : sort;
            const url = `/v1/dbs/api/collecting-agent/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response.data;
        } catch (error) {
            thunkAPI.dispatch(
                validateError({
                    error: error,
                    action: "GET_ALL_COLLECTING_AGENT_PAGING",
                    back: false,
                })
            );
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

// Get detail by ID
export const getDetailCollectingAgent = createAsyncThunk(
    "GET_DETAIL_COLLECTING_AGENT",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/collecting-agent/detail-get/${id}`;
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
export const createValidasiCollectingAgent = createAsyncThunk(
    "CREATE_COLLECTING_AGENT_VALIDASI",
    async (body, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/collecting-agent/validate-create-update`;
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
export const createCollectingAgent = createAsyncThunk(
    "CREATE_COLLECTING_AGENT",
    async (body, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/collecting-agent/create-update`;
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
export const updateCollectingAgent = createAsyncThunk(
    "UPDATE_COLLECTING_AGENT",
    async (body, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/collecting-agent/create-update`;
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
export const getDownloadCollectingAgent = createAsyncThunk(
    "DOWNLOAD_COLLECTING_AGENT",
    async ({ search, page, pageSize, sort }, thunkAPI) => {
        try {
            const searchParams = search === undefined ? "" : search;
            const sortParams =
                sort === undefined || sort === "" ? "createdDate~desc" : sort;
            const url = `/v1/dbs/api/collecting-agent/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
            const response = await receiptCollectionHttpService.downloadData(url);
            return response.data;
        } catch (response) {
            thunkAPI.dispatch(
                validateError({
                    error: response,
                    action: "DOWNLOAD_COLLECTING_AGENT",
                    back: false,
                })
            );
            return thunkAPI.rejectWithValue(response.response);
        }
    }
);

// Get approval history
export const getApprovalHistoryCollectingAgent = createAsyncThunk(
    "GET_APPROVAL_HISTORY_COLLECTING_AGENT",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/collecting-agent/approval-history-get/${id}`;
            const response = await receiptCollectionHttpService.getDetail(url);
            return Array.isArray(response.data) ? null : response.data;
        } catch (error) {
            thunkAPI.dispatch(
                validateError({
                    error: error,
                    action: "GET_APPROVAL_HISTORY_COLLECTING_AGENT",
                    back: false,
                })
            );
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

// Approve or reject
export const approveOrRejectCollectingAgent = createAsyncThunk(
    "APPROVE_OR_REJECT_COLLECTING_AGENT",
    async ({ body }, thunkAPI) => {
        try {
            const url = "/v1/dbs/api/collecting-agent/approve-reject";
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

// Approve or reject inactive
export const approveOrRejectInactiveCollectingAgent = createAsyncThunk(
    "APPROVE_OR_REJECT_FOR_INACTIVE_COLLECTING_AGENT",
    async ({ body }, thunkAPI) => {
        try {
            const url = "/v1/dbs/api/collecting-agent/approve-inactive";
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

export const saveDraftCollectingAgent = createAsyncThunk(
    "SAVE_DRAFT_COLLECTING_AGENT",
    async (body, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/collecting-agent/save-draft`;
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

export const getDetailDraftCollectingAgent = createAsyncThunk(
    "GET_DETAIL_DRAFT_COLLECTING_AGENT",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/collecting-agent/draft-detail/${id}`;
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

// Get approval hierarchy list
export const getAllApprovalListCollectingAgent = createAsyncThunk(
    "GET_ALL_APPROVAL_LIST_COLLECTING_AGENT",
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
export const getListApprovalByIdCollectingAgent = createAsyncThunk(
    "GET_LIST_APPROVAL_BY_ID_COLLECTING_AGENT",
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
export const getListCategoryCollectingAgent = createAsyncThunk(
    "GET_LIST_CATEGORY_COLLECTING_AGENT",
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

// Inactive Collecting Agent
export const inactiveCollectingAgent = createAsyncThunk(
    "INACTIVE_COLLECTING_AGENT",
    async ({ body }, thunkAPI) => {
        let status = body?.status === "Active" ? "Inactivate" : "Activate";
        try {
            const url = `/v1/dbs/api/collecting-agent/active-inactive`;
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
                    action: "INACTIVE_COLLECTING_AGENT",
                    back: false,
                })
            );
            return thunkAPI.rejectWithValue(response.response.data);
        }
    }
);

const ViewCollectingAgentSlice = createSlice({
    name: "ViewCollectingAgent",
    initialState,
    extraReducers: {
        // Get all paginate
        [getPaginateCollectingAgent.pending]: (state, action) => {
            state.data = action.payload;
            state.loading = true;
        },
        [getPaginateCollectingAgent.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.loading = false;
        },
        [getPaginateCollectingAgent.rejected]: (state, action) => {
            state.data = action.payload;
            state.loading = true;
        },

        // Get detail
        [getDetailCollectingAgent.pending]: (state) => {
            state.loading = true;
        },
        [getDetailCollectingAgent.fulfilled]: (state, action) => {
            state.data_detail = action.payload;
            state.loading = false;
        },
        [getDetailCollectingAgent.rejected]: (state) => {
            state.loading = true;
        },

        // Get Approval History
        [getApprovalHistoryCollectingAgent.pending]: (state, action) => {
            state.dataApprovalHistory = action.payload;
            state.loading = true;
        },
        [getApprovalHistoryCollectingAgent.fulfilled]: (state, action) => {
            state.dataApprovalHistory = action.payload;
            state.loading = false;
        },
        [getApprovalHistoryCollectingAgent.rejected]: (state, action) => {
            state.dataApprovalHistory = action.payload;
            state.loading = false;
        },

        // Get Approval List
        [getAllApprovalListCollectingAgent.pending]: (state, action) => {
            state.loading = true;
            state.dataListAppHierId = action.payload;
        },
        [getAllApprovalListCollectingAgent.fulfilled]: (state, action) => {
            state.dataListAppHierId = action.payload;
            state.loading = false;
        },
        [getAllApprovalListCollectingAgent.rejected]: (state, action) => {
            state.dataListAppHierId = action.payload;
            state.loading = false;
        },

        // Get List Approval By Id
        [getListApprovalByIdCollectingAgent.pending]: (state, action) => {
            state.loading = true;
            state.dataListAppHierDetail = action.payload;
        },
        [getListApprovalByIdCollectingAgent.fulfilled]: (state, action) => {
            state.dataListAppHierDetail = action.payload;
            state.loading = false;
        },
        [getListApprovalByIdCollectingAgent.rejected]: (state, action) => {
            state.dataListAppHierDetail = action.payload;
            state.loading = false;
        },

        // Get List Category
        [getListCategoryCollectingAgent.pending]: (state, action) => {
            state.dataListCategory = action.payload;
            state.loading = true;
        },
        [getListCategoryCollectingAgent.fulfilled]: (state, action) => {
            state.dataListCategory = action.payload;
            state.loading = false;
        },
        [getListCategoryCollectingAgent.rejected]: (state, action) => {
            state.dataListCategory = action.payload;
            state.loading = false;
        },

        // Approve or Reject
        [approveOrRejectCollectingAgent.pending]: (state) => {
            state.loading = true;
        },
        [approveOrRejectCollectingAgent.fulfilled]: (state) => {
            state.isSuccess = true;
            state.loading = false;
        },
        [approveOrRejectCollectingAgent.rejected]: (state, action) => {
            state.isFailed = true;
            state.loading = false;
            state.message = action.payload;
        },

        // Approve or Reject Inactive
        [approveOrRejectInactiveCollectingAgent.pending]: (state) => {
            state.loading = true;
        },
        [approveOrRejectInactiveCollectingAgent.fulfilled]: (state) => {
            state.isSuccess = true;
            state.loading = false;
        },
        [approveOrRejectInactiveCollectingAgent.rejected]: (state, action) => {
            state.isFailed = true;
            state.loading = false;
            state.message = action.payload;
        },

        [saveDraftCollectingAgent.pending]: (state) => {
            state.loading = true;
        },
        [saveDraftCollectingAgent.fulfilled]: (state) => {
            state.loading = false;
        },
        [saveDraftCollectingAgent.rejected]: (state) => {
            state.loading = false;
        },

        [getDetailDraftCollectingAgent.pending]: (state) => {
            state.loading = true;
        },
        [getDetailDraftCollectingAgent.fulfilled]: (state, action) => {
            state.data_detail = action.payload;
            state.loading = false;
        },
        [getDetailDraftCollectingAgent.rejected]: (state) => {
            state.loading = false;
        },

        // Create
        [createCollectingAgent.pending]: (state, action) => {
            state.data = action.payload;
            state.loading = true;
        },
        [createCollectingAgent.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.loading = false;
        },
        [createCollectingAgent.rejected]: (state, action) => {
            state.data = action.payload;
            state.loading = false;
        },

        // Update
        [updateCollectingAgent.pending]: (state, action) => {
            state.data = action.payload;
            state.loading = true;
        },
        [updateCollectingAgent.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.isSuccess = false;
        },
        [updateCollectingAgent.rejected]: (state) => {
            state.isFailed = false;
        },

        // Download
        [getDownloadCollectingAgent.fulfilled]: (state, action) => {
            state.data_download = action.payload;
            state.loading = false;
        },
        [getDownloadCollectingAgent.rejected]: (state, action) => {
            state.isFailed = true;
            state.data_download = action.payload;
            state.loading = false;
        },

        // Validasi
        [createValidasiCollectingAgent.pending]: (state, action) => {
            state.data = action.payload;
            state.loading = true;
        },
        [createValidasiCollectingAgent.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.loading = false;
        },
        [createValidasiCollectingAgent.rejected]: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        // Inactive
        [inactiveCollectingAgent.pending]: (state) => {
            state.loading = true;
        },
        [inactiveCollectingAgent.fulfilled]: (state) => {
            state.isSuccess = true;
            state.loading = false;
        },
        [inactiveCollectingAgent.rejected]: (state) => {
            state.isFailed = true;
            state.loading = false;
        },
    },
});

const { reducer } = ViewCollectingAgentSlice;
export default reducer;
