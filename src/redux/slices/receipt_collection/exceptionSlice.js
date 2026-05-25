import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import { showModalSuccess, validateError } from "../general_slice";

const initialState = {
  loading: false,
  data: null,
  data_detail: null,
  approval_list_data: null,
  approval_list_loading: false,
  dataApprovalHistory: null,
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataBillingCycle: [],
  dataBillingPeriod: [],
  dataActivity: [],
  dataCriteriaOptions: [],
  dataAccountSearch: null,
  dataCriteriaAccountSearch: null,
  dataListCategory: [],
};

// ── List ─────────────────────────────────────────────────────────────────────

export const getPaginateException = createAsyncThunk(
  "exception/getPaginateException",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/exception?searchs=${search ?? ""}&page=${page - 1}&size=${pageSize}&sort=${sort || "exceptionId~desc"}`;
      const response = await receiptCollectionHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_PAGINATE_EXCEPTION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ── Detail ────────────────────────────────────────────────────────────────────

export const getExceptionDetail = createAsyncThunk(
  "exception/getExceptionDetail",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/exception/by-account/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_DETAIL_EXCEPTION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getExceptionDetailByHeaderId = createAsyncThunk(
  "exception/getExceptionDetailByHeaderId",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/exception/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_DETAIL_EXCEPTION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ── Create / Update ───────────────────────────────────────────────────────────

export const createValidasiException = createAsyncThunk(
  "exception/createValidasiException",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/exception/validate`;
      const response = await receiptCollectionHttpService.createData(url, body);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "VALIDATE_EXCEPTION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const createException = createAsyncThunk(
  "exception/createException",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/exception/create`;
      const response = await receiptCollectionHttpService.createData(url, body);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "CREATE_EXCEPTION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const updateException = createAsyncThunk(
  "exception/updateException",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/exception/update`;
      const response = await receiptCollectionHttpService.updateData(url, body);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "UPDATE_EXCEPTION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ── Activate / Inactivate ─────────────────────────────────────────────────────

export const inactiveException = createAsyncThunk(
  "exception/inactiveException",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/exception/inactive`;
      const response = await receiptCollectionHttpService.updateData(url, body);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "INACTIVE_EXCEPTION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ── Approval History ──────────────────────────────────────────────────────────

export const getApprovalHistoryException = createAsyncThunk(
  "exception/getApprovalHistoryException",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/exception/approval-history/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_APPROVAL_HISTORY_EXCEPTION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ── Download ──────────────────────────────────────────────────────────────────

export const getDownloadException = createAsyncThunk(
  "exception/getDownloadException",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/exception/download?searchs=${search ?? ""}&page=${page - 1}&size=${pageSize}&sort=${sort || "createdDate~desc"}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "DOWNLOAD_EXCEPTION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ── Approval Hierarchy ────────────────────────────────────────────────────────

export const getAllApprovalListException = createAsyncThunk(
  "exception/getAllApprovalListException",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/apphier/get-list-approval-hierarchies`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_ALL_APPROVAL_EXCEPTION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getListApprovalByIdException = createAsyncThunk(
  "exception/getListApprovalByIdException",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/apphier/get-approval-hierarchies/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_APPROVAL_BY_ID_EXCEPTION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ── Master Data Dropdowns ─────────────────────────────────────────────────────

export const getBillingCycleList = createAsyncThunk(
  "exception/getBillingCycleList",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/exception/billing-cycle`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_BILLING_CYCLE_EXCEPTION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getBillingPeriodList = createAsyncThunk(
  "exception/getBillingPeriodList",
  async (billingCycleId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/exception/billing-period?billingCycleId=${billingCycleId}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_BILLING_PERIOD_EXCEPTION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getActivityList = createAsyncThunk(
  "exception/getActivityList",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/exception/activity`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_ACTIVITY_EXCEPTION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getCriteriaOptionsList = createAsyncThunk(
  "exception/getCriteriaOptionsList",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/exception/criteria-options`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_CRITERIA_OPTIONS_EXCEPTION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const searchAccountForException = createAsyncThunk(
  "exception/searchAccountForException",
  async ({ activityId, billingCycleId, billingPeriodId, page = 0, pageSize = 10, filters = {} }, thunkAPI) => {
    try {
      let url = `/v1/dbs/api/exception/search-account?activityId=${activityId ?? ""}&billingCycleId=${billingCycleId ?? ""}&billingPeriodId=${billingPeriodId ?? ""}&page=${page}&size=${pageSize}`;
      if (filters.customerNumber) url += `&customerNumber=${encodeURIComponent(filters.customerNumber)}`;
      if (filters.customerName)   url += `&customerName=${encodeURIComponent(filters.customerName)}`;
      if (filters.accountNumber)  url += `&accountNumber=${encodeURIComponent(filters.accountNumber)}`;
      if (filters.accountName)    url += `&accountName=${encodeURIComponent(filters.accountName)}`;
      const response = await receiptCollectionHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "SEARCH_ACCOUNT_EXCEPTION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ── Search Account By Criteria (F1: criteria-based preview) ──────────────────

export const searchAccountByCriteriaForException = createAsyncThunk(
  "exception/searchAccountByCriteriaForException",
  async ({ criteriaRows, page = 0, size = 10 }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/exception/search-account-by-criteria`;
      const response = await receiptCollectionHttpService.createData(url, { criteriaRows, page, size });
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "SEARCH_ACCOUNT_BY_CRITERIA_EXCEPTION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ── Bulk Approve ─────────────────────────────────────────────────────────────

export const getPaginateExceptionForApproval = createAsyncThunk(
  "exception/getPaginateExceptionForApproval",
  async ({ search = {}, page = 1, pageSize = 100, sort = "exceptionId~desc" }, thunkAPI) => {
    try {
      const merged = { ...search, statusApproval: "Waiting Approval" };
      const url = `/v1/dbs/api/exception?searchs=${encodeURIComponent(JSON.stringify(merged))}&page=${page - 1}&size=${pageSize}&sort=${sort}`;
      const response = await receiptCollectionHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_PAGINATE_EXCEPTION_FOR_APPROVAL" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const bulkApproveException = createAsyncThunk(
  "exception/bulkApproveException",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/exception/bulk-approve`;
      const response = await receiptCollectionHttpService.createData(url, body);
      const action = body.action === "APPROVE" ? "approved" : "rejected";
      thunkAPI.dispatch(showModalSuccess({ title: "Success", description: `Exceptions have been ${action} successfully`, return: false }));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "BULK_APPROVE_EXCEPTION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const checkDuplicateException = createAsyncThunk(
  "exception/checkDuplicate",
  async (payload, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/exception/check-duplicate`;
      const response = await receiptCollectionHttpService.createData(url, payload);
      return response?.data?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ── Attachment Category ───────────────────────────────────────────────────────

export const getListCategory = createAsyncThunk(
  "exception/getListCategoryException",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/attachment/list-category`;
      const response = await receiptCollectionHttpService.getAll(url);
      const mappCategory = response.data?.data?.map((item) => ({
        Id: item.glbTypeValId,
        text: item?.name,
      }));
      return mappCategory;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_LIST_CATEGORY_EXCEPTION" }));
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const exceptionSlice = createSlice({
  name: "exception",
  initialState,
  reducers: {
    resetBillingPeriod: (state) => {
      state.dataBillingPeriod = [];
    },
    resetAccountSearch: (state) => {
      state.dataAccountSearch = null;
    },
    resetDetail: (state) => {
      state.data_detail = null;
    },
  },
  extraReducers: (builder) => {
      // getPaginateException
    builder
      .addCase(getPaginateException.pending, (state) => { state.loading = true; })
      .addCase(getPaginateException.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getPaginateException.rejected, (state) => { state.loading = false; });

    // getExceptionDetail
    builder
      .addCase(getExceptionDetail.pending, (state) => { state.loading = true; })
      .addCase(getExceptionDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.data_detail = action.payload;
      })
      .addCase(getExceptionDetail.rejected, (state) => { state.loading = false; });

    // getExceptionDetailByHeaderId
    builder
      .addCase(getExceptionDetailByHeaderId.pending, (state) => { state.loading = true; })
      .addCase(getExceptionDetailByHeaderId.fulfilled, (state, action) => {
        state.loading = false;
        state.data_detail = action.payload;
      })
      .addCase(getExceptionDetailByHeaderId.rejected, (state) => { state.loading = false; });

    // createValidasiException
    builder
      .addCase(createValidasiException.pending, (state) => { state.loading = true; })
      .addCase(createValidasiException.fulfilled, (state) => { state.loading = false; })
      .addCase(createValidasiException.rejected, (state) => { state.loading = false; });

    // createException
    builder
      .addCase(createException.pending, (state) => { state.loading = true; })
      .addCase(createException.fulfilled, (state) => { state.loading = false; })
      .addCase(createException.rejected, (state) => { state.loading = false; });

    // updateException
    builder
      .addCase(updateException.pending, (state) => { state.loading = true; })
      .addCase(updateException.fulfilled, (state) => { state.loading = false; })
      .addCase(updateException.rejected, (state) => { state.loading = false; });

    // inactiveException
    builder
      .addCase(inactiveException.pending, (state) => { state.loading = true; })
      .addCase(inactiveException.fulfilled, (state) => { state.loading = false; })
      .addCase(inactiveException.rejected, (state) => { state.loading = false; });

    // getApprovalHistoryException
    builder
      .addCase(getApprovalHistoryException.pending, (state) => { state.loading = true; })
      .addCase(getApprovalHistoryException.fulfilled, (state, action) => {
        state.loading = false;
        state.dataApprovalHistory = action.payload;
      })
      .addCase(getApprovalHistoryException.rejected, (state) => { state.loading = false; });

    // getDownloadException
    builder
      .addCase(getDownloadException.pending, (state) => { state.loading = true; })
      .addCase(getDownloadException.fulfilled, (state) => { state.loading = false; })
      .addCase(getDownloadException.rejected, (state) => { state.loading = false; });

    // getAllApprovalListException
    builder
      .addCase(getAllApprovalListException.pending, (state) => { state.loading = true; })
      .addCase(getAllApprovalListException.fulfilled, (state, action) => {
        state.loading = false;
        state.dataListAppHierId = action.payload ?? [];
      })
      .addCase(getAllApprovalListException.rejected, (state) => { state.loading = false; });

    // getListApprovalByIdException
    builder
      .addCase(getListApprovalByIdException.pending, (state) => { state.loading = true; })
      .addCase(getListApprovalByIdException.fulfilled, (state, action) => {
        state.loading = false;
        state.dataListAppHierDetail = action.payload ?? [];
      })
      .addCase(getListApprovalByIdException.rejected, (state) => { state.loading = false; });

    // getBillingCycleList
    builder
      .addCase(getBillingCycleList.pending, (state) => { state.loading = true; })
      .addCase(getBillingCycleList.fulfilled, (state, action) => {
        state.loading = false;
        state.dataBillingCycle = action.payload ?? [];
      })
      .addCase(getBillingCycleList.rejected, (state) => { state.loading = false; });

    // getBillingPeriodList
    builder
      .addCase(getBillingPeriodList.pending, (state) => { state.loading = true; })
      .addCase(getBillingPeriodList.fulfilled, (state, action) => {
        state.loading = false;
        state.dataBillingPeriod = action.payload ?? [];
      })
      .addCase(getBillingPeriodList.rejected, (state) => { state.loading = false; });

    // getActivityList
    builder
      .addCase(getActivityList.pending, (state) => { state.loading = true; })
      .addCase(getActivityList.fulfilled, (state, action) => {
        state.loading = false;
        state.dataActivity = action.payload ?? [];
      })
      .addCase(getActivityList.rejected, (state) => { state.loading = false; });

    // getCriteriaOptionsList
    builder
      .addCase(getCriteriaOptionsList.pending, (state) => { state.loading = true; })
      .addCase(getCriteriaOptionsList.fulfilled, (state, action) => {
        state.loading = false;
        state.dataCriteriaOptions = action.payload ?? [];
      })
      .addCase(getCriteriaOptionsList.rejected, (state) => { state.loading = false; });

    // searchAccountForException
    builder
      .addCase(searchAccountForException.pending, (state) => { state.loading = true; })
      .addCase(searchAccountForException.fulfilled, (state, action) => {
        state.loading = false;
        state.dataAccountSearch = action.payload;
      })
      .addCase(searchAccountForException.rejected, (state) => { state.loading = false; });

    // searchAccountByCriteriaForException
    builder
      .addCase(searchAccountByCriteriaForException.pending, (state) => { state.loading = true; })
      .addCase(searchAccountByCriteriaForException.fulfilled, (state, action) => {
        state.loading = false;
        state.dataCriteriaAccountSearch = action.payload;
      })
      .addCase(searchAccountByCriteriaForException.rejected, (state) => { state.loading = false; });

    // getListCategoryException
    builder
      .addCase(getListCategory.pending, (state) => { state.loading = true; })
      .addCase(getListCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.dataListCategory = action.payload ?? [];
      })
      .addCase(getListCategory.rejected, (state) => { state.loading = false; });

    // getPaginateExceptionForApproval
    builder
      .addCase(getPaginateExceptionForApproval.pending, (state) => { state.approval_list_loading = true; })
      .addCase(getPaginateExceptionForApproval.fulfilled, (state, action) => {
        state.approval_list_loading = false;
        state.approval_list_data = action.payload;
      })
      .addCase(getPaginateExceptionForApproval.rejected, (state) => { state.approval_list_loading = false; });

    // bulkApproveException
    builder
      .addCase(bulkApproveException.pending, (state) => { state.loading = true; })
      .addCase(bulkApproveException.fulfilled, (state) => { state.loading = false; })
      .addCase(bulkApproveException.rejected, (state) => { state.loading = false; });
  },
});

export const { resetBillingPeriod, resetAccountSearch, resetDetail } = exceptionSlice.actions;
export default exceptionSlice.reducer;
