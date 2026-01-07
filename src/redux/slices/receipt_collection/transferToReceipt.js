import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
  showModalError,
  setBodyError,
  showModalSuccess,
} from "../general_slice";

// Hard Code
import hc_transfer_to_receipt_list from "./temp_hardcoded_json/transferToReceipt/get-list-transferToReceipt.json"
import hc_list_receipt from "./temp_hardcoded_json/transferToReceipt/get-list-receipt.json";
import hc_ddl_deduction_period from "./temp_hardcoded_json/transferToReceipt/get-ddl-deduction-period.json";
import hc_ddl_type from "./temp_hardcoded_json/transferToReceipt/get-ddl-type.json";



export const submitTransferToReceipt = createAsyncThunk(
  "SUBMIT_TRANSFER_TO_RECEIPT",
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
      // Simulator Detail Transfer To Receipt
      const response = {
        data: {
          transferToReceipt: {
            deductionPeriod: "Jan 2025",
            type: "Gas",
            deductionDate: "2025-01-01",
            appHierId: 502,
            receiptList: hc_list_receipt.data,
            id: id,
            status: "DRAFT",
            statusApproval: "Draft",
            createdBy: "admin",
            createdDate: "2025-01-01T00:00:00.000+00:00",
            updatedBy: "admin",
            updatedDate: "2025-01-01T00:00:00.000+00:00",
          },
          attachmentDtoList: [],
          tApprovalDto: {
            approvalType: "TRANSFER_TO_RECEIPT",
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
  listReceipt: [], // Store receipt list from modal search
  ddlDeductionPeriod: [], // Store options for Deduction Period
  ddlType: [], // Store options for Type
  dataListAppHierId: [],
  data_detail: null,
  dataListAppHierDetail: [],
  dataListCategory: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
  message: "",
};

export const getAllTransferToReceiptListPaginate = createAsyncThunk(
  "GET_ALL_TRANSFER_TO_RECEIPT_LIST_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      // const searchParams = search === undefined ? "" : search;
      // const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
      // const url = `/v1/dbs/api/billing/list-billing-gas?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      // const response = await receiptCollectionHttpService.getPagination(url);
      const response = hc_transfer_to_receipt_list;
      // Simulate delay
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

export const getListReceipt = createAsyncThunk(
  "GET_LIST_RECEIPT",
  async (_, thunkAPI) => {
    try {
      const response = hc_list_receipt;
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

export const getDDLDeductionPeriod = createAsyncThunk(
  "GET_DDL_DEDUCTION_PERIOD",
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
  "GET_DDL_TYPE",
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

export const downloadTransferToReceiptList = createAsyncThunk(
  "DOWNLOAD_TRANSFER_TO_RECEIPT_LIST",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      // const searchParams = search === undefined ? "" : search;
      // const sortParams =
      //   sort === undefined || sort === "" ? "createdDate~desc" : sort;
      // const url = `/v1/dbs/api/billing/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      // const response = await receiptCollectionHttpService.downloadData(url);
      // return response.data;

      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;

    } catch (error) {
      // thunkAPI.dispatch(
      //   validateError({
      //     error: error,
      //     action: "DOWNLOAD_WARRANTY_LIST",
      //     back: false,
      //   })
      // );
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

    // Get List Receipt
    [getListReceipt.pending]: (state) => {
      // state.loading = true; // Optional: separate loading state if needed
    },
    [getListReceipt.fulfilled]: (state, action) => {
      // state.loading = false;
      state.listReceipt = action.payload;
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
  },
});

const { reducer } = transferToReceiptSlice;
export default reducer;
