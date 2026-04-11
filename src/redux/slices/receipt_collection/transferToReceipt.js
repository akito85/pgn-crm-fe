import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
  showModalError,
  setBodyError,
  showModalSuccess,
} from "../general_slice";

export const submitTransferToReceipt = createAsyncThunk(
  "SUBMIT_TRANSFER_TO_RECEIPT",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/transfer-to-receipt/submit`;
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
      const url = `/v1/dbs/api/payment-warranty/transfer-to-receipt/get-detail/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      return thunkAPI.rejectWithValue(error?.response?.data);
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

// Called with appHierId — returns approval hierarchy chain (array of levels + employees)
// Used in: ListFormTransferToReceipt, ListDetailTransferToReceipt (step 2 approval selection)
export const getListApprovalById = createAsyncThunk(
  "GET_LIST_APPROVAL_BY_ID_TRANSFER",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/apphier/get-approval-hierarchies/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// Called with transfer HDR id — returns { dataApprover, dataHistory } for the history modal
// Used in: ViewTransferToReceipt (history popup)
export const getApprovalHistoryTransferToReceipt = createAsyncThunk(
  "GET_APPROVAL_HISTORY_TRANSFER_TO_RECEIPT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/transfer-to-receipt/approval-history-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      return thunkAPI.rejectWithValue(error?.response?.data);
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
  dataListAppHierDetail: [], // Hierarchy chain (array) — used by form/detail step 2
  dataApprovalHistory: null, // { dataApprover, dataHistory } — used by list view history modal
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
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/payment-warranty/transfer-to-receipt/get-list?page=${page || 1}&size=${pageSize || 10}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await receiptCollectionHttpService.getPagination(url);
      return response.data.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getListWarranty = createAsyncThunk(
  "GET_LIST_WARRANTY",
  async (customerId, thunkAPI) => {
    try {
      let url = `/v1/dbs/api/payment-warranty/warranties`;
      if (customerId) {
        url += `?customerId=${customerId}`;
      }
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getListFromCustomer = createAsyncThunk(
  "GET_LIST_FROM_CUSTOMER",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-warranty/warranties`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getListReceipt = createAsyncThunk(
  "GET_LIST_RECEIPT",
  async (customerNumber, thunkAPI) => {
    try {
      // TODO: remove hardcode after testing
      const custNum = customerNumber || "CST0000000070";
      const searchObj = { customer: custNum, statusApproval: "Approved" };
      const searchParam = encodeURIComponent(JSON.stringify(searchObj));
      const url = `/v1/dbs/api/receipt/get-list?page=1&size=1000&searchs=${searchParam}`;
      const response = await receiptCollectionHttpService.getAll(url);
      const allReceipts = response.data?.result || response.data || [];
      // TODO: uncomment unapplied filter after testing
      // const unappliedReceipts = allReceipts.filter(item => {
      //   const unappliedVal = item.unAppliedAmountReal || parseFloat(String(item.unAppliedAmount || "0").replace(/,/g, ""));
      //   return unappliedVal > 0;
      // });
      // return unappliedReceipts;
      return allReceipts;
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
      state.listWarranty = action.payload?.customers || action.payload?.result || action.payload || [];
    },
    [getListWarranty.rejected]: (state) => {
    },

    // Get List From Customer
    [getListFromCustomer.pending]: (state) => {
    },
    [getListFromCustomer.fulfilled]: (state, action) => {
      const allCustomers = action.payload?.customers || action.payload?.result || action.payload || [];
      // Deduplicate by customerNumber — one customer may have multiple warranties
      const uniqueMap = new Map();
      allCustomers.forEach(item => {
        if (!uniqueMap.has(item.customerNumber)) {
          uniqueMap.set(item.customerNumber, item);
        }
      });
      state.listFromCustomer = Array.from(uniqueMap.values());
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

    // Get Approval Hierarchy By Id (appHierId) — for form/detail step 2
    [getListApprovalById.pending]: (state) => {
    },
    [getListApprovalById.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload || [];
    },
    [getListApprovalById.rejected]: (state) => {
      state.dataListAppHierDetail = [];
    },

    // Get Approval History by transfer HDR id — for list view history modal
    [getApprovalHistoryTransferToReceipt.pending]: (state) => {
    },
    [getApprovalHistoryTransferToReceipt.fulfilled]: (state, action) => {
      state.dataApprovalHistory = action.payload;
    },
    [getApprovalHistoryTransferToReceipt.rejected]: (state) => {
      state.dataApprovalHistory = null;
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
