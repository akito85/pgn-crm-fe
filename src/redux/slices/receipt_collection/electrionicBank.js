import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import { setBodyError, showModalError, validateError } from "../general_slice";

const initialState = {
  loading: false,
  data: null,
  data_detail: null,
  data_match: null,
  data_force: null,
  data_sundry: null,
  data_reverse: null,
  data_parsing: null,
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  data_bank: [],
  data_type: [],
  dataListCategory: [],
  data_force_select: [],
  data_sundry_select: [],
  data_reverse_select: [],
  data_customer: [],
  dataRequest: null,
  dataApprove: null,
  loadingModal: false,
  message: {},
  bankDDL: [],
  loadingApprove: false,
  loadingModalReq: false,
  data_type_ci: [],
  data_partner: [],
  userRole: {
    isSubmitter: false,
    isApprover: false,
  },
};

export const getEceletricBankPaging = createAsyncThunk(
  "GET_ALL_ELECTRONIC_STATMENT_BANK",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/bank/statement/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
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

export const getBankDDLMaintain = createAsyncThunk(
  "GET_LIST_BANK_RECEIPTS_UPLOADS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/receipt/list-bank`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data;
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

export const getElectronicDetail = createAsyncThunk(
  "GET_ELECTRONIC_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/statement/detail-get/${id}`;
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

export const getListBank = createAsyncThunk(
  "GET_LIST_Bank",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/name/combo-box`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data;
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

export const getListType = createAsyncThunk(
  "GET_LIST_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/receipt/list-receipt-channel`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data;
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

export const getCustomerInfo = createAsyncThunk(
  "GET_LIST_CUSTOMER_INFO",
  async ({ search, page, pageSize, sort }) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/receipt/account/combo-box?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data;
    } catch (error) {
      return error;
    }
  }
);

export const getTableMatch = createAsyncThunk(
  "GET_ALL_TABLE_MATCH",
  async ({ id, search, page, pageSize, sort }) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/receipt/reconcile/get-list-v1-MATCH-${id}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return error;
    }
  }
);
export const getTableForce = createAsyncThunk(
  "GET_ALL_TABLE_FORCE",
  async ({ id, search, page, pageSize, sort }) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/receipt/reconcile/get-list-v1-FORCE-${id}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;

      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return error;
    }
  }
);
export const getTableSundry = createAsyncThunk(
  "GET_ALL_TABLE_SUNDRY",
  async ({ id, search, page, pageSize, sort }) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~asc" : sort;
      const url = `/v1/dbs/api/receipt/reconcile/get-list-v1-SUNDRY-${id}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return error;
    }
  }
);
export const getTableReverse = createAsyncThunk(
  "GET_ALL_TABLE_REVERSE",
  async ({ id, search, page, pageSize, sort }) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~asc" : sort;
      const url = `/v1/dbs/api/receipt/reconcile/get-list-v1-REVERSE-${id}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return error;
    }
  }
);
export const getTableParsing = createAsyncThunk(
  "GET_ALL_TABLE_PARSING",
  async ({ id, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/receipt/reconcile/get-list-v1--${id}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
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

export const uploadBank = createAsyncThunk(
  "UPLOAD_BANK",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/bank/statement/upload-bulk";
      const data = await receiptCollectionHttpService.uploadImage(url, body);
      // const successMessage = {
      //   title: "Successfull",
      //   description: `${message}`,
      //   return: false,
      // };
      // thunkAPI.dispatch(showModalSuccess(successMessage));
      return data;
    } catch (e) {
      const message =
        (e.response && e.response.data && e.response.data.message) ||
        e.message ||
        e.toString();
      const errorBody = {
        title: "Failed",
        description: `${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(e?.response);
    }
  }
);
// export const getDownloadReceipt = createAsyncThunk(
//   "DOWNLOAD_RECEIPT",
//   async ({ search, page, pageSize, sort }, thunkAPI) => {
//     try {
//       const searchParams = search === undefined ? "" : search;
//       const sortParams =
//         sort === undefined || sort === "" ? "createdDate~desc" : sort;
//       const url = `/v1/dbs/api/receipt/download-filter?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
//       const response = await receiptCollectionHttpService.downloadData(url);
//       return response.data;
//     } catch (response) {
//       return thunkAPI.rejectWithValue(response.response.data);
//     }
//   }
// );
export const getAllApprovalList = createAsyncThunk(
  "GET_ALL_APPROVAL_LIST_ELECTRONIC",
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

// export const approveOrRejectStatment = createAsyncThunk(
//   "APPROVE_OR_REJECT_TRANSCALENDER_DETAIL",
//   async ({ body }, thunkAPI) => {
//     try {
//       const url = "/v1/dbs/api/receipt/reconcile-approve-v1";
//       const response =
//         await receiptCollectionHttpService.activationWithRemarkPost(url, body);
//       const message = response?.message;
//       const successMessage = {
//         title: "Successfull",
//         description: `${message}`,
//         return: false,
//       };
//       thunkAPI.dispatch(showModalSuccess(successMessage));
//       return response.data;
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       if (Math.floor((error.response.data.code || 0) / 100) === 4) {
//         const errorBody = {
//           title: "Failed",
//           description: `Your data was not ${
//             body.action === "APPROVE" ? "approved" : "rejected"
//           }. ${message}.`,
//           return: false,
//         };
//         thunkAPI.dispatch(showModalError(errorBody));
//       }
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );

export const requestApprove = createAsyncThunk(
  "APPROVE_OR_REJECT_STATEMENT",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/receipt/reconcile-approve-v1";
      const response = await receiptCollectionHttpService.createData(url, body);
      return response.data;
    } catch (error) {
      // const message =
      //   (error.response &&
      //     error.response.data &&
      //     error.response.data.message) ||
      //   error.message ||
      //   error.toString();
      // if (Math.floor((error.response.data.code || 0) / 100) === 4) {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `Your data was not created. ${message}.`,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody));
      // }
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "APPROVE_OR_REJECT_STATEMENT",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const requestModal = createAsyncThunk(
  "REQUEST_STATEMENT_BANK",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/receipt/reconcile-request";
      const response = await receiptCollectionHttpService.createData(url, body);
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
          description: `Your data was not created. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getListApprovalById = createAsyncThunk(
  "GET_LIST_APPROVAL_BY_ID_ELECTRONIC",
  async (id, thunkAPI) => {
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
export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY_BANK",
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

export const getTableForceSelect = createAsyncThunk(
  "GET_ALL_TABLE_FORCE_SELECT",
  async ({ id, search, sort, page, pageSize, boolean }) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/receipt/reconcile/approval-list-FORCE-${id}-${boolean}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

export const getTableReverseSelect = createAsyncThunk(
  "GET_ALL_TABLE_REVERSE_SELECT",
  async ({ id, search, sort, page, pageSize, boolean }) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/receipt/reconcile/approval-list-REVERSE-${id}-${boolean}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

export const getTableSundrySelect = createAsyncThunk(
  "GET_ALL_TABLE_SUNDRY_SELECT",
  async ({ id, search, sort, page, pageSize, boolean }) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/receipt/reconcile/approval-list-SUNDRY-${id}-${boolean}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return error;
    }
  }
);


export const getListTypeCi = createAsyncThunk(
  "GET_LIST_TYPE_CI",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-channel/list`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data
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

export const getListPartner = createAsyncThunk(
  "GET_LIST_PARTNER",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/partner/list`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data
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

export const getListTypeCiByPartner = createAsyncThunk(
  "GET_LIST_TYPE_CI_BY_PARTNER",
  async ({ partnerId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/payment-channel/list-by-partner/${partnerId}`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data
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

export const checkUserRole = createAsyncThunk(
  "CHECK_USER_ROLE",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/receipt/check-user-role`;
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

const electronicSlice = createSlice({
  name: "Electronic_Bank_Statment",
  initialState,
  extraReducers: {
    //get all employee paginate reducer
    [getEceletricBankPaging.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [getEceletricBankPaging.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getEceletricBankPaging.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },

    // get detail
    [getElectronicDetail.pending]: (state) => {
      state.loading = true;
    },
    [getElectronicDetail.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getElectronicDetail.rejected]: (state) => {
      state.loading = true;
    },
    //DETAIL MATCH TABLE
    [getTableMatch.pending]: (state) => {
      state.loading = true;
    },
    [getTableMatch.fulfilled]: (state, action) => {
      state.data_match = action.payload;
      state.loading = false;
    },
    [getTableMatch.rejected]: (state) => {
      state.loading = true;
    },

    //DETAIL MATCH FORCE
    [getTableForce.pending]: (state) => {
      state.loading = true;
    },
    [getTableForce.fulfilled]: (state, action) => {
      state.data_force = action.payload;
      state.loading = false;
    },
    [getTableForce.rejected]: (state) => {
      state.loading = true;
    },
    //DETAIL MATCH FORCE
    [getTableForceSelect.pending]: (state) => {
      state.loading = true;
    },
    [getTableForceSelect.fulfilled]: (state, action) => {
      state.data_force_select = action.payload;
      state.loading = false;
    },
    [getTableForceSelect.rejected]: (state) => {
      state.loading = true;
    },
    //DETAIL MATCH REVERSE
    [getTableReverse.pending]: (state) => {
      state.loading = true;
    },
    [getTableReverse.fulfilled]: (state, action) => {
      state.data_reverse = action.payload;
      state.loading = false;
    },
    [getTableReverse.rejected]: (state) => {
      state.loading = true;
    },
    // bank upload
    [getBankDDLMaintain.pending]: (state, action) => {
      state.loading = true;
      state.bankDDL = action.payload;
    },
    [getBankDDLMaintain.fulfilled]: (state, action) => {
      state.bankDDL = action.payload;
      state.loading = false;
    },
    [getBankDDLMaintain.rejected]: (state, action) => {
      state.bankDDL = action.payload;
      state.loading = false;
    },

    //DETAIL MATCH SUNDRY
    [getTableSundry.pending]: (state) => {
      state.loading = true;
    },
    [getTableSundry.fulfilled]: (state, action) => {
      state.data_sundry = action.payload;
      state.loading = false;
    },
    [getTableSundry.rejected]: (state) => {
      state.loading = true;
    },
    //DETAIL MATCH pasrsing
    [getTableParsing.pending]: (state) => {
      state.loading = true;
    },
    [getTableParsing.fulfilled]: (state, action) => {
      state.data_parsing = action.payload;
      state.loading = false;
    },
    [getTableParsing.rejected]: (state) => {
      state.loading = true;
    },

    //Get list  bank
    [getListBank.pending]: (state) => {
      state.loading = true;
    },
    [getListBank.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.data_bank = action.payload;
      state.loading = false;
    },
    [getListBank.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },
    //Get list  type
    [getListType.pending]: (state) => {
      state.loading = true;
    },
    [getListType.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.data_type = action.payload;
      state.loading = false;
    },
    [getListType.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },
    // Get Approve Hierarchy List
    [getAllApprovalList.pending]: (state, action) => {
      state.loading = true;
      state.dataListAppHierId = action.payload;
    },
    [getAllApprovalList.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    [getAllApprovalList.rejected]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },

    // Get List Approval By Id
    [getListApprovalById.pending]: (state, action) => {
      state.loading = true;
      state.dataListAppHierDetail = action.payload;
    },
    [getListApprovalById.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },
    [getListApprovalById.rejected]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },

    // upload Bank
    [uploadBank.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [uploadBank.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [uploadBank.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    /** Get List Category */
    [getListCategory.pending]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingProduct = true;
    },
    [getListCategory.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingProduct = false;
    },
    [getListCategory.rejected]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingProduct = false;
    },

    //DETAIL MATCH Reverse SElect
    [getTableReverseSelect.pending]: (state) => {
      state.loading = true;
    },
    [getTableReverseSelect.fulfilled]: (state, action) => {
      state.data_reverse_select = action.payload;
      state.loading = false;
    },
    [getTableReverseSelect.rejected]: (state) => {
      state.loading = true;
    },

    //DETAIL MATCH Sundry SElect
    [getTableSundrySelect.pending]: (state, action) => {
      state.data_sundry_select = action.payload;
      state.loadingApprove = true;
    },
    [getTableSundrySelect.fulfilled]: (state, action) => {
      state.data_sundry_select = action.payload;
      state.loadingApprove = false;
    },
    [getTableSundrySelect.rejected]: (state, action) => {
      state.data_sundry_select = action.payload;
      state.loadingApprove = true;
    },

    //Get customer info
    [getCustomerInfo.pending]: (state) => {
      state.loading = true;
    },
    [getCustomerInfo.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.data_customer = action.payload;
      state.loading = false;
    },
    [getCustomerInfo.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },
    /** request MODAL */
    [requestModal.pending]: (state, action) => {
      state.loadingModalReq = true;
      state.dataRequest = action.payload;
    },
    [requestModal.fulfilled]: (state, action) => {
      state.dataRequest = action.payload;
      state.loadingModalReq = false;
    },
    [requestModal.rejected]: (state, action) => {
      state.dataRequest = action.payload;
      state.loadingModalReq = false;
    },

    //approve and reject

    [requestApprove.pending]: (state, action) => {
      state.loadingModal = true;
      state.dataApprove = action.payload;
    },
    [requestApprove.fulfilled]: (state, action) => {
      state.dataApprove = action.payload;
      state.loadingModal = false;
    },
    [requestApprove.rejected]: (state, action) => {
      state.dataApprove = action.payload;
      state.loadingModal = false;
    },

    [getListTypeCi.pending]: (state) => {
      state.loading = true;
    },
    [getListTypeCi.fulfilled]: (state, action) => {
      state.data_type_ci = action.payload;
      state.loading = false;
    },
    [getListTypeCi.rejected]: (state) => {
      state.loading = true;
    },

    [getListTypeCiByPartner.pending]: (state) => {
      state.loading = true;
    },
    [getListTypeCiByPartner.fulfilled]: (state, action) => {
      state.data_type_ci = action.payload;
      state.loading = false;
    },
    [getListTypeCiByPartner.rejected]: (state) => {
      state.loading = true;
    },

    [getListPartner.pending]: (state) => {
      state.loading = true;
    },
    [getListPartner.fulfilled]: (state, action) => {
      state.data_partner = action.payload;
      state.loading = false;
    },
    [getListPartner.rejected]: (state) => {
      state.loading = true;
    },

    // Check User Role
    [checkUserRole.pending]: (state) => {
      state.loading = true;
    },
    [checkUserRole.fulfilled]: (state, action) => {
      state.userRole = action.payload;
      state.loading = false;
    },
    [checkUserRole.rejected]: (state) => {
      state.loading = false;
    },
  },
});

const { reducer } = electronicSlice;
export default reducer;
