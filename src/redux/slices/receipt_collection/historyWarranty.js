import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showModalError, validateError } from "../general_slice";

// Hard Code
import hc_history_warranty_list from "./temp_hardcoded_json/historyWarranty/get-list-historyWarranty.json";

export const getHistoryPaymentWarrantyListPaginate = createAsyncThunk(
    "GET_HISTORY_PAYMENT_WARRANTY_LIST_PAGINATE",
    async ({ page, pageSize, search, sort }, thunkAPI) => {
        try {
            // Simulate fetch
            const response = hc_history_warranty_list;
            await new Promise(resolve => setTimeout(resolve, 500));
            return response.data;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = {
                title: "Failed",
                description: `${message}`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const downloadHistoryPaymentWarranty = createAsyncThunk(
    "DOWNLOAD_HISTORY_PAYMENT_WARRANTY",
    async ({ page, pageSize, search, sort }, thunkAPI) => {
        try {
            // Simulator Download
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return true;
        } catch (error) {
            thunkAPI.dispatch(
                validateError({
                    error: error,
                    action: "DOWNLOAD_HISTORY_PAYMENT_WARRANTY",
                    back: false,
                })
            );
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    data: [],
    loading: false,
    message: "",
};

const historyWarrantySlice = createSlice({
    name: "historyWarranty",
    initialState,
    extraReducers: {
        // Get All Pagination
        [getHistoryPaymentWarrantyListPaginate.pending]: (state) => {
            state.loading = true;
        },
        [getHistoryPaymentWarrantyListPaginate.fulfilled]: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
        [getHistoryPaymentWarrantyListPaginate.rejected]: (state) => {
            state.loading = false;
        },

        // Download
        [downloadHistoryPaymentWarranty.pending]: (state) => {
            state.loading = true;
        },
        [downloadHistoryPaymentWarranty.fulfilled]: (state) => {
            state.loading = false;
        },
        [downloadHistoryPaymentWarranty.rejected]: (state) => {
            state.loading = false;
        },
    },
});

const { reducer } = historyWarrantySlice;
export default reducer;
