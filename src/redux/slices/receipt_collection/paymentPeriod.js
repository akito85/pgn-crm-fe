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
    dataListCategory: [],
};

const sanitizeSearchInput = (input) => {
    if (typeof input !== 'string') return '';
    return input.replace(/[<>"'&]/g, '');
};

const getSafeErrorMessage = (error) => {
    const safeMessages = ['invalid input', 'data not found', 'unauthorized', 'permission denied',
        'already exists', 'not valid', 'required', 'format', 'overlapping', 'active payment cycle',
        'pending document', 'not approved'];
    const message = error.response?.data?.message || error.message || 'An error occurred';
    if (safeMessages.some(safe => message.toLowerCase().includes(safe))) {
        return message;
    }
    return 'Terjadi kesalahan pada sistem. Silakan hubungi administrator.';
};

export const getPaginatePeriod = createAsyncThunk(
    "GET_ALL_PAYMENT_PERIOD",
    async ({ search, page, pageSize, sort }, thunkAPI) => {
        try {
            const searchParams = sanitizeSearchInput(search === undefined ? "" : search);
            const sortParams =
                sort === undefined || sort === "" ? "createdDate~desc" : sort;
            const url = `/v1/dbs/api/payment-period/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response.data;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const createPaymentPeriod = createAsyncThunk(
    "CREATE_PAYMENT_PERIOD",
    async (param, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-period/create-update`;
            const response = await receiptCollectionHttpService.createData(url, param);
            return response;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const uploadAttachmentPaymentPeriod = createAsyncThunk(
    "UPLOAD_ATTACHMENT_PAYMENT_PERIOD",
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

export const createValidasiPaymentPeriod = createAsyncThunk(
    "CREATE_VALIDASI_PAYMENT_PERIOD",
    async (param, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-period/validate-create-update`;
            const data = await receiptCollectionHttpService.createData(url, param);
            return data.data;
        } catch (error) {
            const message = getSafeErrorMessage(error);
            if (Math.floor((error.response?.data?.code || 0) / 100) === 4) {
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

export const getDetailPaymentPeriod = createAsyncThunk(
    "DETAIL_PAYMENT_PERIOD",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-period/detail-get/${id}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response.data;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const getDetailPaymentPeriodDraft = createAsyncThunk(
    "DETAIL_PAYMENT_PERIOD_DRAFT",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-period/draft/detail-get/${id}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response.data;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const inactivePaymentPeriod = createAsyncThunk(
    "INACTIVE_PAYMENT_PERIOD",
    async (param, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-period/active-inactive`;
            const response = await receiptCollectionHttpService.activationWithRemark(url, param);
            return response;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const approveOrRejectPaymentPeriod = createAsyncThunk(
    "APPROVE_REJECT_PAYMENT_PERIOD",
    async (param, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-period/approve-reject`;
            const response = await receiptCollectionHttpService.activationWithRemarkPost(url, param);
            return response;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const openClosePaymentPeriod = createAsyncThunk(
    "OPEN_CLOSE_PAYMENT_PERIOD",
    async (param, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-period/open-close`;
            const data = await receiptCollectionHttpService.activationWithRemark(url, param);
            const successBody = {
                title: "Successful",
                description: `Successfully ${param.statusOpen.toLowerCase()} period`,
                return: false,
            };
            thunkAPI.dispatch(showModalSuccess(successBody));
            return data;
        } catch (error) {
            const message = getSafeErrorMessage(error);
            const errorBody = {
                title: "Failed",
                description: message,
            };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const approveOrRejectInactivePaymentPeriod = createAsyncThunk(
    "APPROVE_REJECT_INACTIVE_PAYMENT_PERIOD",
    async (param, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-period/approve-inactive`;
            const response = await receiptCollectionHttpService.activationWithRemarkPost(url, param);
            return response;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const saveDraftPaymentPeriod = createAsyncThunk(
    "SAVE_DRAFT_PAYMENT_PERIOD",
    async (body, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-period/save-draft`;
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
                error.response?.data?.message ||
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

export const getApprovalHistoryPaymentPeriod = createAsyncThunk(
    "APPROVAL_HISTORY_PAYMENT_PERIOD",
    async (id, thunkAPI) => {
        try {
            const url = `/v1/dbs/api/payment-period/approval-history-get/${id}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response.data;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const getDownloadPaymentPeriod = createAsyncThunk(
    "DOWNLOAD_PAYMENT_PERIOD",
    async (param, thunkAPI) => {
        try {
            const searchParams = param.search === undefined ? "" : param.search;
            const sortParams =
                param.sort === undefined || param.sort === "" ? "createdDate~desc" : param.sort;
            const url = `/v1/dbs/api/payment-period/download-filter?searchs=${searchParams}&page=${param.page}&size=${param.pageSize}&sort=${sortParams}`;
            const response = await receiptCollectionHttpService.downloadData(url);
            return response.data;
        } catch (error) {
            if (!error.success) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
);

export const getAllApprovalListPeriod = createAsyncThunk(
    "GET_ALL_APPROVAL_LIST_PAYMENT_PERIOD",
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

export const getListApprovalByIdPeriod = createAsyncThunk(
    "GET_LIST_APPROVAL_BY_ID_PAYMENT_PERIOD",
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

export const getListCategoryPeriod = createAsyncThunk(
    "GET_LIST_CATEGORY_PAYMENT_PERIOD",
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

const paymentPeriodSlice = createSlice({
    name: "paymentPeriod",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPaginatePeriod.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPaginatePeriod.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getPaginatePeriod.rejected, (state) => {
                state.loading = false;
            })

            .addCase(createPaymentPeriod.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPaymentPeriod.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createPaymentPeriod.rejected, (state) => {
                state.loading = false;
            })

            .addCase(getDetailPaymentPeriod.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDetailPaymentPeriod.fulfilled, (state, action) => {
                state.loading = false;
                state.data_detail = action.payload;
            })
            .addCase(getDetailPaymentPeriod.rejected, (state) => {
                state.loading = false;
            })

            .addCase(getDetailPaymentPeriodDraft.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDetailPaymentPeriodDraft.fulfilled, (state, action) => {
                state.loading = false;
                state.data_detail_draft = action.payload;
            })
            .addCase(getDetailPaymentPeriodDraft.rejected, (state) => {
                state.loading = false;
            })

            .addCase(getApprovalHistoryPaymentPeriod.pending, (state) => {
                state.loading = true;
            })
            .addCase(getApprovalHistoryPaymentPeriod.fulfilled, (state, action) => {
                state.loading = false;
                state.dataApprovalHistory = action.payload;
            })
            .addCase(getApprovalHistoryPaymentPeriod.rejected, (state) => {
                state.loading = false;
            })

            .addCase(getAllApprovalListPeriod.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllApprovalListPeriod.fulfilled, (state, action) => {
                state.loading = false;
                state.dataListAppHierId = action.payload;
            })
            .addCase(getAllApprovalListPeriod.rejected, (state) => {
                state.loading = false;
            })

            .addCase(getListApprovalByIdPeriod.pending, (state) => {
                state.loading = true;
            })
            .addCase(getListApprovalByIdPeriod.fulfilled, (state, action) => {
                state.loading = false;
                state.dataListAppHierDetail = action.payload;
            })
            .addCase(getListApprovalByIdPeriod.rejected, (state) => {
                state.loading = false;
            })

            .addCase(getListCategoryPeriod.pending, (state) => {
                state.loading = true;
            })
            .addCase(getListCategoryPeriod.fulfilled, (state, action) => {
                state.loading = false;
                state.dataListCategory = action.payload;
            })
            .addCase(getListCategoryPeriod.rejected, (state) => {
                state.loading = false;
            })
            .addCase(saveDraftPaymentPeriod.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveDraftPaymentPeriod.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(saveDraftPaymentPeriod.rejected, (state) => {
                state.loading = false;
            })
            .addCase(openClosePaymentPeriod.pending, (state) => {
                state.loading = true;
            })
            .addCase(openClosePaymentPeriod.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(openClosePaymentPeriod.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default paymentPeriodSlice.reducer;

export const getListPaymentPeriod = getPaginatePeriod;
export const updatePaymentPeriod = createPaymentPeriod;
