import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
  showModalError,
  setBodyError,
  showModalSuccess,
} from "../general_slice";
import getListTransferToReceipt from "./temp_hardcoded_json/transferToReceipt/get-list-transferToReceipt.json";
import getDetailTransferToReceiptMock from "./temp_hardcoded_json/transferToReceipt/get-detail-transferToReceipt.json";
import getApprovalHistoryMock from "./temp_hardcoded_json/transferToReceipt/get-approval-history.json";
import getListWarrantyMock from "./temp_hardcoded_json/transferToReceipt/get-list-warranty.json";
import getFromCustomerMock from "./temp_hardcoded_json/transferToReceipt/get-list-from-customer.json";
import getListReceiptMock from "./temp_hardcoded_json/transferToReceipt/get-list-receipt.json";

export const submitTransferToReceipt = createAsyncThunk(
  "SUBMIT_TRANSFER_TO_RECEIPT",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/transfer-receipt`;
      const response = await receiptCollectionHttpService.createData(url, body);
      return response.data;
    } catch (error) {
      let message =
        error?.response?.data?.message || error?.message || error?.toString();

      if (message && (message.includes("could not execute statement") || message.includes("ConstraintViolationException") || message.includes("SQL"))) {
        message = "Terjadi kesalahan pada sistem saat memproses data. Silakan coba beberapa saat lagi atau hubungi tim support.";
      }

      const errorBody = {
        title: "Failed",
        description: `${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getCashBalance = createAsyncThunk(
  "GET_CASH_BALANCE_TRANSFER",
  async (accountId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/${accountId}/cash-balance`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getWarrantyCashByAccountId = createAsyncThunk(
  "GET_WARRANTY_CASH_BY_ACCOUNT_TRANSFER",
  async (accountId, thunkAPI) => {
    try {
      // Fetch warranty for the selected account, then filter CASH and ACTIVE in frontend
      const searchParam = encodeURIComponent(JSON.stringify({
        accountId: accountId,
        warrantyType: "CASH"
      }));
      const url = `/v1/dbs/api/payment-warranty/get-list?page=1&size=1000&searchs=${searchParam}`;
      const response = await receiptCollectionHttpService.getPagination(url);

      // Data sudah difilter oleh backend, ambil array hasilnya
      const filtered = response?.data?.result || response?.data || [];


      return filtered;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getAllApprovalList = createAsyncThunk(
  "GET_ALL_APPROVAL_LIST_TRANSFER",
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

export const getDetailTransferToReceipt = createAsyncThunk(
  "GET_DETAIL_TRANSFER",
  async (id, thunkAPI) => {
    try {
      // USE EXTERNAL DUMMY DATA FOR SIMULATION
      const response = { data: getDetailTransferToReceiptMock };
      return response.data.data;
    } catch (error) {
      return error;
    }
  }
);

export const approveOrRejectTransferToReceipt = createAsyncThunk(
  "APPROVE_OR_REJECT_TRANSFER",
  async ({ body }, thunkAPI) => {
    try {
      // Customize endpoint if needed, for new reusing setting endpoint
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
  "GET_LIST_APPROVAL_BY_ID_TRANSFER",
    async ({ id }, thunkAPI) => {
        try {
            // Simulator dummy data from external JSON
            const response = { data: getApprovalHistoryMock };
            return response.data.data;
        } catch (error) {
            return error;
        }
    }
);

export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY_TRANSFER",
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
  listWarranty: [], // Store warranty list from modal search
  listFromCustomer: [], // Store list of from customers
  listReceipt: [], // Store receipt list from modal search
  ddlDeductionPeriod: [], // Store options for Deduction Period
  ddlType: [], // Store options for Type
  dataListAppHierId: [],
  data_detail: null,
  dataListAppHierDetail: [],
  dataListCategory: [],
  cashBalance: 0,
  listWarrantyCash: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
  message: "",
};

export const getAllTransferToReceiptListPaginate = createAsyncThunk(
  "GET_ALL_TRANSFER_TO_RECEIPT_LIST_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      // USE EXTERNAL DUMMY DATA FOR SIMULATION
      const response = { data: getListTransferToReceipt };
      return response.data.data;
    } catch (error) {
      return error;
    }
  }
);

export const getListWarranty = createAsyncThunk(
  "GET_LIST_WARRANTY",
  async (_, thunkAPI) => {
    try {
      // USE EXTERNAL DUMMY DATA FOR SIMULATION
      const response = { data: getListWarrantyMock };
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getListFromCustomer = createAsyncThunk(
  "GET_LIST_FROM_CUSTOMER",
  async (_, thunkAPI) => {
    try {
      // USE EXTERNAL DUMMY DATA FOR SIMULATION
      const response = { data: getFromCustomerMock };
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getListReceipt = createAsyncThunk(
  "GET_LIST_RECEIPT",
  async (_, thunkAPI) => {
    try {
      // USE EXTERNAL DUMMY DATA FOR SIMULATION
      const response = { data: getListReceiptMock };
      return response.data.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = { title: "Failed", description: `${message}` };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getDDLDeductionPeriod = createAsyncThunk(
  "GET_DDL_DEDUCTION_PERIOD",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-period/get-list`;
      const response = await receiptCollectionHttpService.getAll(url);
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
  "GET_DDL_TYPE",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/warranty-type`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = { title: "Failed", description: `${message}` };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteTransferToReceipt = createAsyncThunk(
  "DELETE_TRANSFER_TO_RECEIPT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/transfer-receipt/${id}`;
      const response = await receiptCollectionHttpService.deleteData(url);
      thunkAPI.dispatch(showModalSuccess({ title: "Success", description: "Data has been deleted successfully" }));
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const downloadTransferToReceiptList = createAsyncThunk(
  "DOWNLOAD_TRANSFER_TO_RECEIPT_LIST",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/payment-warranty/download-detail-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
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

const transferToReceiptSlice = createSlice({
  name: "transferToReceipt",
  initialState,
  extraReducers: {
    // Get All Pagination
    [getAllTransferToReceiptListPaginate.pending]: (state) => {
      state.loading = true;
    },
    [getAllTransferToReceiptListPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getAllTransferToReceiptListPaginate.rejected]: (state) => {
      state.loading = false;
    },
    // Get List Warranty
    [getListWarranty.pending]: (state) => {
    },
    [getListWarranty.fulfilled]: (state, action) => {
      state.listWarranty = action.payload?.result || action.payload || [];
    },
    [getListWarranty.rejected]: (state) => {
    },

    // Get List From Customer
    [getListFromCustomer.pending]: (state) => {
    },
    [getListFromCustomer.fulfilled]: (state, action) => {
      state.listFromCustomer = action.payload?.result || action.payload || [];
    },
    [getListFromCustomer.rejected]: (state) => {
    },

    // Get List Receipt
    [getListReceipt.pending]: (state) => {
      // state.loading = true; // Optional: separate loading state if needed
    },
    [getListReceipt.fulfilled]: (state, action) => {
      // state.loading = false;
      state.listReceipt = action.payload?.result || action.payload || [];
    },
    [getListReceipt.rejected]: (state) => {
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

    // Download
    [downloadTransferToReceiptList.pending]: (state) => {
      state.loading = true;
    },
    [downloadTransferToReceiptList.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadTransferToReceiptList.rejected]: (state) => {
      state.loading = false;
    },

    // Delete
    [deleteTransferToReceipt.pending]: (state) => {
      state.loading = true;
    },
    [deleteTransferToReceipt.fulfilled]: (state) => {
      state.loading = false;
    },
    [deleteTransferToReceipt.rejected]: (state) => {
      state.loading = false;
    },

    // Submit
    [submitTransferToReceipt.pending]: (state) => {
      state.loading = true;
    },
    [submitTransferToReceipt.fulfilled]: (state) => {
      state.loading = false;
    },
    [submitTransferToReceipt.rejected]: (state) => {
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
    [getDetailTransferToReceipt.pending]: (state) => {
      state.loading = true;
    },
    [getDetailTransferToReceipt.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailTransferToReceipt.rejected]: (state) => {
      state.loading = false;
    },

    // Approve Or Reject
    [approveOrRejectTransferToReceipt.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectTransferToReceipt.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectTransferToReceipt.rejected]: (state) => {
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

    // Get Cash Balance
    [getCashBalance.pending]: (state) => {
      // loading state if needed
    },
    [getCashBalance.fulfilled]: (state, action) => {
      state.cashBalance = action.payload?.cashBalance ?? action.payload?.data?.cashBalance ?? 0;
    },
    [getCashBalance.rejected]: (state) => {
      state.cashBalance = 0;
    },

    // Get Warranty Cash By Account
    [getWarrantyCashByAccountId.pending]: (state) => {
    },
    [getWarrantyCashByAccountId.fulfilled]: (state, action) => {
      state.listWarrantyCash = action.payload?.result || action.payload || [];
    },
    [getWarrantyCashByAccountId.rejected]: (state) => {
      state.listWarrantyCash = [];
    },
  },
});

const { reducer } = transferToReceiptSlice;
export default reducer;
