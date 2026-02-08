import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import { showModalError, showModalSuccess } from "../general_slice";

const initialState = {
    loading: false,
    data: [],
    data_detail: null,
    data_detail_draft: [],
    dataApprovalHistory: [],
    dataListAppHierId: [],
    dataListAppHierDetail: [],
    data_time_unit: [],
    dataListCategory: [],
    dataEndBegin: [],
};

export const getTimeUnit = createAsyncThunk(
    "GET_DATA_TIME_UNIT_PAYMENT_CYCLE",
    async (thunkAPI) => {
        try {
            const url = `/v1/dbs/api/timeunit/get`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response.data;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const getPaginateCycle = createAsyncThunk(
    "GET_ALL_PAYMENT_CYCLE",
    async ({ search, page, pageSize, sort }, thunkAPI) => {
        try {
            const searchParams = search === undefined ? "" : search;
            const sortParams =
                sort === undefined || sort === "" ? "createdDate~desc" : sort;
            const url = `/v1/dbs/api/payment-cycle/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
            console.log('[DEBUG] getPaginateCycle params:', { search, page, pageSize, sort });
            console.log('[DEBUG] getPaginateCycle URL:', url);
            const response = await receiptCollectionHttpService.getAll(url);
            console.log('[DEBUG] getPaginateCycle response:', response.data);
            return response.data;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const createPaymentCycle = createAsyncThunk(
    "CREATE_PAYMENT_CYCLE",
    async (param, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-cycle/create-update`;
            const response = await receiptCollectionHttpService.createData(url, param);
            return response;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const uploadAttachmentPaymentCycle = createAsyncThunk(
    "UPLOAD_ATTACHMENT_PAYMENT_CYCLE",
    async (param, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/attachment/upload/v1`;
            const response = await receiptCollectionHttpService.uploadImage(url, param);
            return response;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const createValidasiPaymentCycle = createAsyncThunk(
    "CREATE_VALIDASI_PAYMENT_CYCLE",
    async (param, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-cycle/validate-create-update`;
            const response = await receiptCollectionHttpService.createData(url, param);
            return response;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const getDetailPaymentCycle = createAsyncThunk(
    "DETAIL_PAYMENT_CYCLE",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-cycle/detail-get/${id}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response.data;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const getDetailPaymentCycleDraft = createAsyncThunk(
    "DETAIL_PAYMENT_CYCLE_DRAFT",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-cycle/draft/detail-get/${id}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response.data;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const inactivePaymentCycle = createAsyncThunk(
    "INACTIVE_PAYMENT_CYCLE",
    async (param, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-cycle/active-inactive`;
            const response = await receiptCollectionHttpService.activationWithRemark(url, param);
            return response;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const approveOrRejectPaymentCycle = createAsyncThunk(
    "APPROVE_REJECT_PAYMENT_CYCLE",
    async (param, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-cycle/approve-reject`;
            const response = await receiptCollectionHttpService.activationWithRemarkPost(url, param);
            return response;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const approveOrRejectInactivePaymentCycle = createAsyncThunk(
    "APPROVE_REJECT_INACTIVE_PAYMENT_CYCLE",
    async (param, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-cycle/approve-inactive`;
            const response = await receiptCollectionHttpService.activationWithRemarkPost(url, param);
            return response;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const saveDraftPaymentCycle = createAsyncThunk(
    "SAVE_DRAFT_PAYMENT_CYCLE",
    async (body, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-cycle/save-draft`;
            const data = await receiptCollectionHttpService.createData(url, body);
            const successBody = {
                title: "Successful",
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

export const getApprovalHistory = createAsyncThunk(
    "APPROVAL_HISTORY_PAYMENT_CYCLE",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-cycle/approval-history-get/${id}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response.data;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const getDownloadPaymentCycle = createAsyncThunk(
    "DOWNLOAD_PAYMENT_CYCLE",
    async (param, thunkAPI) => {
        try {
            const searchParams = param.search === undefined ? "" : param.search;
            const sortParams =
                param.sort === undefined || param.sort === "" ? "createdDate~desc" : param.sort;
            const url = `/v1/dbs/api/payment-cycle/download-filter?searchs=${searchParams}&page=${param.page}&size=${param.pageSize}&sort=${sortParams}`;
            const response = await receiptCollectionHttpService.downloadData(url);
            return response.data;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const getAllApprovalList = createAsyncThunk(
    "GET_ALL_APPROVAL_LIST_PAYMENT_CYCLE",
    async (thunkAPI) => {
        try {
            const url = `/v1/dbs/api/apphier/get-list-approval-hierarchies`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response.data;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const getListApprovalById = createAsyncThunk(
    "GET_LIST_APPROVAL_BY_ID_PAYMENT_CYCLE",
    async ({ id }, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/apphier/get-approval-hierarchies/${id}`;
            const response = await receiptCollectionHttpService.getDetail(url);
            return response.data;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const getListCategory = createAsyncThunk(
    "GET_LIST_CATEGORY_PAYMENT_CYCLE",
    async (thunkAPI) => {
        try {
            const url = "/v1/dbs/api/attachment/list-category";
            const response = await receiptCollectionHttpService.getAll(url);
            const mappCategory = response.data?.data?.map((item) => ({
                Id: item.glbTypeValId,
                text: item?.name,
            }));
            return mappCategory;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const getAllBeginEnd = createAsyncThunk(
    "GET_ALL_BEGINANDEND_CYCLE_CALENDER",
    async (thunkAPI) => {
        try {
            const url = `/v1/dbs/api/calendar/begin-end-cycle-list`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response.data;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

const paymentCycleSlice = createSlice({
    name: "paymentCycle",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPaginateCycle.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPaginateCycle.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getPaginateCycle.rejected, (state) => {
                state.loading = false;
            })

            .addCase(createPaymentCycle.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPaymentCycle.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createPaymentCycle.rejected, (state) => {
                state.loading = false;
            })

            .addCase(getDetailPaymentCycle.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDetailPaymentCycle.fulfilled, (state, action) => {
                state.loading = false;
                state.data_detail = action.payload;
            })
            .addCase(getDetailPaymentCycle.rejected, (state) => {
                state.loading = false;
            })

            .addCase(getDetailPaymentCycleDraft.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDetailPaymentCycleDraft.fulfilled, (state, action) => {
                state.loading = false;
                state.data_detail_draft = action.payload;
            })
            .addCase(getDetailPaymentCycleDraft.rejected, (state) => {
                state.loading = false;
            })

            .addCase(getApprovalHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(getApprovalHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.dataApprovalHistory = action.payload;
            })
            .addCase(getApprovalHistory.rejected, (state) => {
                state.loading = false;
            })

            .addCase(getAllApprovalList.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllApprovalList.fulfilled, (state, action) => {
                state.loading = false;
                state.dataListAppHierId = action.payload;
            })
            .addCase(getAllApprovalList.rejected, (state) => {
                state.loading = false;
            })

            .addCase(getListApprovalById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getListApprovalById.fulfilled, (state, action) => {
                state.loading = false;
                state.dataListAppHierDetail = action.payload;
            })
            .addCase(getListApprovalById.rejected, (state) => {
                state.loading = false;
            })

            .addCase(getTimeUnit.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTimeUnit.fulfilled, (state, action) => {
                state.loading = false;
                state.data_time_unit = action.payload;
            })
            .addCase(getTimeUnit.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getListCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(getListCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.dataListCategory = action.payload;
            })
            .addCase(getListCategory.rejected, (state) => {
                state.loading = false;
            })
            .addCase(saveDraftPaymentCycle.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveDraftPaymentCycle.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(saveDraftPaymentCycle.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getAllBeginEnd.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllBeginEnd.fulfilled, (state, action) => {
                state.loading = false;
                state.dataEndBegin = action.payload;
            })
            .addCase(getAllBeginEnd.rejected, (state, action) => {
                state.loading = false;
            });
    },
});

export default paymentCycleSlice.reducer;

export const getListPaymentCycle = getPaginateCycle;
export const updatePaymentCycle = createPaymentCycle;
