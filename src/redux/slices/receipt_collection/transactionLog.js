import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import { validateError } from "../general_slice";

const initialState = {
    loading: false,
    dataTransactionLog: null,
    dataDownload: null,
};

export const getTransactionLogPaging = createAsyncThunk(
    "GET_ALL_TRANSACTION_LOG",
    async ({ search, page, pageSize, sort }, thunkAPI) => {
        try {
            const searchParams = search === undefined ? "" : search;
            const sortParams =
                sort === undefined || sort === "" ? "createdDate~desc" : sort;
            const url = `/v1/dbs/api/transaction-log/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
            const response = await receiptCollectionHttpService.getAll(url);
            return response.data;
        } catch (error) {
            thunkAPI.dispatch(
                validateError({
                    error: error,
                    action: "GET_ALL_TRANSACTION_LOG_PAGING",
                    back: false,
                })
            );
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const downloadTransactionLog = createAsyncThunk(
    "DOWNLOAD_TRANSACTION_LOG",
    async ({ search, page, pageSize, sort }, thunkAPI) => {
        try {
            const searchParams = search === undefined ? "" : search;
            const sortParams =
                sort === undefined || sort === "" ? "createdDate~desc" : sort;
            const url = `/v1/dbs/api/transaction-log/download?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
            const response = await receiptCollectionHttpService.downloadData(url);
            return response.data;
        } catch (error) {
            thunkAPI.dispatch(
                validateError({
                    error: error,
                    action: "TRANSACTION_LOG_DOWNLOAD",
                    back: false,
                })
            );
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

const transactionLogReducer = createSlice({
    name: "transactionLog",
    initialState,
    extraReducers: {
        //get all transaction log paginate reducer
        [getTransactionLogPaging.pending]: (state, action) => {
            state.dataTransactionLog = action.payload;
            state.loading = true;
        },
        [getTransactionLogPaging.fulfilled]: (state, action) => {
            state.dataTransactionLog = action.payload;
            state.loading = false;
        },
        [getTransactionLogPaging.rejected]: (state, action) => {
            state.dataTransactionLog = action.payload;
            state.loading = false;
        },

        //download
        [downloadTransactionLog.fulfilled]: (state, action) => {
            state.dataDownload = action.payload;
            state.loading = false;
        },
        [downloadTransactionLog.rejected]: (state, action) => {
            state.dataDownload = action.payload;
            state.loading = false;
        },
    },
});

const { reducer } = transactionLogReducer;
export default reducer;
