import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
    showModalError,
    setBodyError,
} from "../general_slice";

// Hard Code
import hc_transfer_to_customer_list from "./temp_hardcoded_json/transferToCustomer/get-list-transferToCustomer.json"
// Reusing some dropdowns from transferToReceipt or generic if possible, or create new if needed
import hc_ddl_deduction_period from "./temp_hardcoded_json/transferToReceipt/get-ddl-deduction-period.json";
import hc_ddl_type from "./temp_hardcoded_json/transferToReceipt/get-ddl-type.json";
import hc_list_warranty from "./temp_hardcoded_json/transferToCustomer/get-list-warranty.json";
import hc_list_from_customer from "./temp_hardcoded_json/transferToCustomer/get-list-from-customer.json";


export const submitTransferToCustomer = createAsyncThunk(
    "SUBMIT_TRANSFER_TO_CUSTOMER",
    async (body, thunkAPI) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return { status: 200, message: "Success Submit Data" };
        } catch (error) {
            const message =
                error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = {
                title: "Failed",
                description: `${message}`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
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
            const errorBody = {
                title: "Failed",
                description: `${message}`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

export const getDetailTransferToCustomer = createAsyncThunk(
    "GET_DETAIL_TRANSFER_CUSTOMER",
    async (id, thunkAPI) => {
        try {
            // Simulator Detail Transfer To Customer
            const response = {
                data: {
                    transferToCustomer: {
                        deductionPeriod: "Jan 2025",
                        type: "Gas",
                        deductionDate: "2025-01-01",
                        appHierId: 502,
                        customerList: hc_transfer_to_customer_list.data.result.slice(0, 1),
                        id: id,
                        status: "DRAFT",
                        statusApproval: "Draft",
                        createdBy: "admin",
                        createdDate: "2025-01-01T00:00:00.000+00:00",
                        updatedBy: "admin",
                        updatedDate: "2025-01-01T00:00:00.000+00:00",

                        // Transfer Info
                        fromCustomerId: "12345678",
                        fromCustomerName: "PT. SUMBER REJEKI",
                        areaCode: "01",

                        // Warranty Info
                        paymentWarrantyCode: "PW-2025-001",
                        warrantyAreaCode: "01",
                        areaName: "Medan",
                        customerId: "87654321",
                        customerName: "PT. GAS NEGARA",
                        customerSegment: "Industrial",
                        customerGroup: "Gold",
                        publisher: "Bank Mandiri",
                        currency: "IDR",
                        balance: 150000000,
                        rate: 1,
                        rateDate: "2025-01-01",
                        equivalent: 150000000,
                        documentNumber: "DOC-001/2025",
                        mutationDate: "2025-01-15",
                        effectiveDate: "2025-01-01",
                        expiringDate: "2026-01-01",
                        endDateClaim: "2026-02-01",
                    },
                    attachmentDtoList: [],
                    tApprovalDto: {
                        approvalType: "TRANSFER_TO_CUSTOMER",
                        status: "DRAFT",
                        isApprover: true
                    },
                }
            };

            await new Promise((resolve) => setTimeout(resolve, 500));
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

export const approveOrRejectTransferToCustomer = createAsyncThunk(
    "APPROVE_OR_REJECT_TRANSFER_CUSTOMER",
    async ({ body }, thunkAPI) => {
        try {
            // Customize endpoint if needed
            const url = `/v1/dbs/api/approval/approve-reject`;
            const response = await receiptCollectionHttpService.post(url, body);
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
    "GET_LIST_APPROVAL_BY_ID_TRANSFER_CUSTOMER",
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


export const getListWarranty = createAsyncThunk(
    "GET_LIST_WARRANTY_CUSTOMER",
    async (_, thunkAPI) => {
        try {
            const response = hc_list_warranty;
            await new Promise((resolve) => setTimeout(resolve, 500));
            return response.data.result;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = { title: "Failed", description: `${message}` };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getListFromCustomer = createAsyncThunk(
    "GET_LIST_FROM_CUSTOMER_CUSTOMER",
    async (_, thunkAPI) => {
        try {
            const response = hc_list_from_customer;
            await new Promise((resolve) => setTimeout(resolve, 500));
            return response.data.result;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = { title: "Failed", description: `${message}` };
            thunkAPI.dispatch(showModalError(errorBody));
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
            const errorBody = {
                title: "Failed",
                description: `${message}`,
            };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);



const initialState = {
    data: [],
    listCustomer: [], // Store customer list from modal search
    ddlDeductionPeriod: [],
    ddlType: [],
    dataListAppHierId: [],
    data_detail: null,
    dataListAppHierDetail: [],
    dataListCategory: [],
    loading: false,
    isFailed: false,
    isSuccess: false,
    message: "",
    listWarranty: [],
    listFromCustomer: [],
};

export const getAllTransferToCustomerListPaginate = createAsyncThunk(
    "GET_ALL_TRANSFER_TO_CUSTOMER_LIST_PAGINATE",
    async ({ page, pageSize, search, sort }, thunkAPI) => {
        try {
            // Simulate fetch
            const response = hc_transfer_to_customer_list;
            await new Promise(resolve => setTimeout(resolve, 500));
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
            return error;
        }
    }
);

export const getListCustomer = createAsyncThunk(
    "GET_LIST_CUSTOMER",
    async (_, thunkAPI) => {
        try {
            // Using the same list as sample for customers available to add
            const response = hc_transfer_to_customer_list;
            await new Promise((resolve) => setTimeout(resolve, 500));
            return response.data.result;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = { title: "Failed", description: `${message}` };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getDDLDeductionPeriod = createAsyncThunk(
    "GET_DDL_DEDUCTION_PERIOD_CUSTOMER",
    async (_, thunkAPI) => {
        try {
            const response = hc_ddl_deduction_period;
            await new Promise((resolve) => setTimeout(resolve, 500));
            return response.data;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = { title: "Failed", description: `${message}` };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getDDLType = createAsyncThunk(
    "GET_DDL_TYPE_CUSTOMER",
    async (_, thunkAPI) => {
        try {
            const response = hc_ddl_type;
            await new Promise((resolve) => setTimeout(resolve, 500));
            return response.data;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || error?.toString();
            const errorBody = { title: "Failed", description: `${message}` };
            thunkAPI.dispatch(showModalError(errorBody));
            return thunkAPI.rejectWithValue(error);
        }
    }
);

const transferToCustomerSlice = createSlice({
    name: "transferToCustomer",
    initialState,
    extraReducers: {
        // Get List Warranty
        [getListWarranty.fulfilled]: (state, action) => {
            state.listWarranty = action.payload;
        },
        // Get List From Customer
        [getListFromCustomer.fulfilled]: (state, action) => {
            state.listFromCustomer = action.payload;
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

        // Get DDL Deduction Period
        [getDDLDeductionPeriod.fulfilled]: (state, action) => {
            state.ddlDeductionPeriod = action.payload;
        },

        // Get DDL Type
        [getDDLType.fulfilled]: (state, action) => {
            state.ddlType = action.payload;
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

        // Get List Approval By Id
        [getListApprovalById.pending]: (state) => {
            // state.loading = true;
        },
        [getListApprovalById.fulfilled]: (state, action) => {
            state.dataListAppHierDetail = action.payload;
        },
        [getListApprovalById.rejected]: (state) => {
            // state.loading = false;
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
    },
});

const { reducer } = transferToCustomerSlice;
export default reducer;
