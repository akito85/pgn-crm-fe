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
    data: { result: [], page: {} },
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
    async ({ search, page, pageSize, sort, isLoadMore = false }, thunkAPI) => {
        try {
            const searchParams = search === undefined ? "" : search;
            const sortParams =
                sort === undefined || sort === "" ? "createdDate~desc" : sort;
            const url = `/v1/dbs/api/collecting-agent/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return { ...response.data, isLoadMore };
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
            if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
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
                data: error?.response?.data?.data,
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
                data: error?.response?.data?.data,
                code: error?.response?.data?.code,
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
            if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
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
            if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
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
    extraReducers: (builder) => {
        // Get all paginate
        builder
            .addCase(getPaginateCollectingAgent.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPaginateCollectingAgent.fulfilled, (state, action) => {
                const { isLoadMore, ...rest } = action.payload || {};
                if (isLoadMore) {
                    state.data = {
                        ...rest,
                        result: [...(state.data?.result || []), ...(rest?.result || [])],
                    };
                } else {
                    state.data = rest;
                }
                state.loading = false;
            })
            .addCase(getPaginateCollectingAgent.rejected, (state) => {
                state.loading = false;
            })

            // Get detail
            .addCase(getDetailCollectingAgent.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDetailCollectingAgent.fulfilled, (state, action) => {
                state.data_detail = action.payload;
                state.loading = false;
            })
            .addCase(getDetailCollectingAgent.rejected, (state) => {
                state.loading = false; // [CR-02] fix: was true (infinite loading bug)
            })

            // Get Approval History
            .addCase(getApprovalHistoryCollectingAgent.pending, (state) => {
                state.loading = true;
            })
            .addCase(getApprovalHistoryCollectingAgent.fulfilled, (state, action) => {
                state.dataApprovalHistory = action.payload;
                state.loading = false;
            })
            .addCase(getApprovalHistoryCollectingAgent.rejected, (state, action) => {
                state.dataApprovalHistory = action.payload;
                state.loading = false;
            })

            // Get Approval List
            .addCase(getAllApprovalListCollectingAgent.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllApprovalListCollectingAgent.fulfilled, (state, action) => {
                state.dataListAppHierId = action.payload;
                state.loading = false;
            })
            .addCase(getAllApprovalListCollectingAgent.rejected, (state) => {
                state.loading = false;
            })

            // Get List Approval By Id
            .addCase(getListApprovalByIdCollectingAgent.pending, (state) => {
                state.loading = true;
            })
            .addCase(getListApprovalByIdCollectingAgent.fulfilled, (state, action) => {
                state.dataListAppHierDetail = action.payload;
                state.loading = false;
            })
            .addCase(getListApprovalByIdCollectingAgent.rejected, (state) => {
                state.loading = false;
            })

            // Get List Category
            .addCase(getListCategoryCollectingAgent.pending, (state) => {
                state.loading = true;
            })
            .addCase(getListCategoryCollectingAgent.fulfilled, (state, action) => {
                state.dataListCategory = action.payload;
                state.loading = false;
            })
            .addCase(getListCategoryCollectingAgent.rejected, (state) => {
                state.loading = false;
            })

            // Approve or Reject
            .addCase(approveOrRejectCollectingAgent.pending, (state) => {
                state.loading = true;
            })
            .addCase(approveOrRejectCollectingAgent.fulfilled, (state) => {
                state.isSuccess = true;
                state.loading = false;
            })
            .addCase(approveOrRejectCollectingAgent.rejected, (state, action) => {
                state.isFailed = true;
                state.loading = false;
                state.message = action.payload;
            })

            // Approve or Reject Inactive
            .addCase(approveOrRejectInactiveCollectingAgent.pending, (state) => {
                state.loading = true;
            })
            .addCase(approveOrRejectInactiveCollectingAgent.fulfilled, (state) => {
                state.isSuccess = true;
                state.loading = false;
            })
            .addCase(approveOrRejectInactiveCollectingAgent.rejected, (state, action) => {
                state.isFailed = true;
                state.loading = false;
                state.message = action.payload;
            })

            // Save Draft
            .addCase(saveDraftCollectingAgent.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveDraftCollectingAgent.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(saveDraftCollectingAgent.rejected, (state) => {
                state.loading = false;
            })

            // Get Detail Draft
            .addCase(getDetailDraftCollectingAgent.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDetailDraftCollectingAgent.fulfilled, (state, action) => {
                state.data_detail = action.payload;
                state.loading = false;
            })
            .addCase(getDetailDraftCollectingAgent.rejected, (state) => {
                state.loading = false;
            })

            // Create — [CR-07]: jangan overwrite state.data di pending/rejected
            .addCase(createCollectingAgent.pending, (state) => {
                state.loading = true;
            })
            .addCase(createCollectingAgent.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(createCollectingAgent.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            // Update — [CR-03] fix fulfilled: isSuccess=true, loading=false; [CR-04] fix rejected: isFailed=true, loading=false; [CR-07] jangan overwrite state.data di pending
            .addCase(updateCollectingAgent.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCollectingAgent.fulfilled, (state, action) => {
                state.data = action.payload;
                state.isSuccess = true;   // [CR-03] fix: was false
                state.loading = false;    // [CR-03] fix: was missing
            })
            .addCase(updateCollectingAgent.rejected, (state, action) => {
                state.isFailed = true;    // [CR-04] fix: was false
                state.loading = false;    // [CR-04] fix: was missing
                state.error = action.payload;
            })

            // Download
            .addCase(getDownloadCollectingAgent.fulfilled, (state, action) => {
                state.data_download = action.payload;
                state.loading = false;
            })
            .addCase(getDownloadCollectingAgent.rejected, (state, action) => {
                state.isFailed = true;
                state.data_download = action.payload;
                state.loading = false;
            })

            // Validasi — [CR-07]: jangan overwrite state.data di pending/rejected
            .addCase(createValidasiCollectingAgent.pending, (state) => {
                state.loading = true;
            })
            .addCase(createValidasiCollectingAgent.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(createValidasiCollectingAgent.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            // Inactive
            .addCase(inactiveCollectingAgent.pending, (state) => {
                state.loading = true;
            })
            .addCase(inactiveCollectingAgent.fulfilled, (state) => {
                state.isSuccess = true;
                state.loading = false;
            })
            .addCase(inactiveCollectingAgent.rejected, (state) => {
                state.isFailed = true;
                state.loading = false;
            });
    },
});

const { reducer } = ViewCollectingAgentSlice;
export default reducer;
