import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import hc_deduction_list from "./temp_hardcoded_json/deduction/get-deduction-list.json";
import hc_customer_list from "./temp_hardcoded_json/deduction/get-customer-list.json";
import hc_customer_deduction_list from "./temp_hardcoded_json/deduction/get-customer-deduction-list.json";
import hc_deduction_detail from "./temp_hardcoded_json/deduction/get-detail-deduction.json";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import { setBodyError, showModalError, validateError } from "../general_slice";

import {
  showModalSuccess,
} from "../general_slice";

const initialState = {
  loading: false,
  data: {
    result: [],
    page: {
      totalElements: 0
    }
  },
  customerData: {
    result: [],
    page: {
      totalElements: 0
    }
  },
  data_detail: null,
  dataApprovalHistory: null,
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataListCategory: [],
  dataType: [],
  error: null,
  isSuccess: false,
  isFailed: false,
  message: null,
};



export const getDeductionList = createAsyncThunk(
  "deduction/getDeductionList",
  async ({ page = 1, pageSize = 10, search = "", sort = "" }, thunkAPI) => {
    try {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return {
        data: {
          result: hc_deduction_list.data.result.slice(start, end),
          page: {
            size: pageSize,
            totalElements: hc_deduction_list.data.result.length,
            totalPages: Math.ceil(hc_deduction_list.data.result.length / pageSize),
            number: page - 1
          }
        }
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const downloadDeductionList = createAsyncThunk(
  "deduction/downloadDeductionList",
  async (params, thunkAPI) => {
    try {
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteDeduction = createAsyncThunk(
  "deduction/deleteDeduction",
  async (id, thunkAPI) => {
    try {
      // Mock delete
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { id };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getApprovalHistory = createAsyncThunk(
  "deduction/getApprovalHistory",
  async ({ id }, thunkAPI) => {
    try {
      // Mock history
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        dataApprover: {
          DEDUCTION_CREATION: [
            {
              id: 1,
              name: "Approver 1",
              status: "APPROVED",
              date: "2023-01-21",
            },
          ],
        },
        dataHistory: {
          DEDUCTION_CREATION: [
            {
              id: 1,
              name: "Submitter",
              status: "SUBMITTED",
              date: "2023-01-20",
            },
          ],
        },
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const searchCustomerDeduction = createAsyncThunk(
  "deduction/searchCustomerDeduction",
  async ({ page = 1, pageSize = 10 }, thunkAPI) => {
    try {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      await new Promise(resolve => setTimeout(resolve, 500));
      const customerList = hc_customer_list.data.map(customer => ({
        ...customer,
        id: customer.receiptId
      }));
      return {
        data: {
          result: customerList.slice(start, end),
          allResult: customerList,
          page: {
            size: pageSize,
            totalElements: customerList.length,
            totalPages: Math.ceil(customerList.length / pageSize),
            number: page - 1
          }
        }
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getCustomerDeductionList = createAsyncThunk(
  "deduction/getCustomerDeductionList",
  async ({ page = 1, pageSize = 10 }, thunkAPI) => {
    try {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      
      // Filter from our new dummy data if needed, or just return paged slice
      const allResults = hc_customer_deduction_list.data.result;
      
      return {
        data: {
          result: allResults.slice(start, end),
          page: {
            size: pageSize,
            totalElements: allResults.length,
            totalPages: Math.ceil(allResults.length / pageSize),
            number: page - 1
          }
        }
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getTypeDDL = createAsyncThunk(
  "deduction/getTypeDDL",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/settings/list-type`;
      const data = await receiptCollectionHttpService.getAll(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getAllApprovalList = createAsyncThunk(
  "deduction/getAllApprovalList",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/apphier/get-list-approval-hierarchies`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListApprovalById = createAsyncThunk(
  "deduction/getListApprovalById",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/apphier/get-approval-hierarchies/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListCategory = createAsyncThunk(
  "deduction/getListCategory",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/attachment/list-category";
      const response = await receiptCollectionHttpService.getAll(url);
      return response?.data?.data?.map((item) => ({
        Id: item?.glbTypeValId,
        text: item?.name,
      }));
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getDetailDeduction = createAsyncThunk(
  "deduction/getDetailDeduction",
  async (id, thunkAPI) => {
    try {
      // For development, use dummy data
      return hc_deduction_detail.data;

      // Real API call:
      // const url = `/v1/dbs/api/settings/detail-get/${id}`;
      // const response = await receiptCollectionHttpService.getDetail(url);
      // return response.data;
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const approveOrRejectDeduction = createAsyncThunk(
  "deduction/approveOrRejectDeduction",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/settings/approve-reject";
      const response = await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      const message = response?.message;
      const successMessage = {
        title: "Successfull",
        description: `${message}`,
        return: true,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
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
          description: `Your data was not ${body.action === "APPROVE" ? "approved" : "rejected"}. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const deductionSlice = createSlice({
  name: "deduction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDeductionList.fulfilled, (state, action) => {
        state.data = action.payload.data;
      })
      .addCase(getDeductionList.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(searchCustomerDeduction.fulfilled, (state, action) => {
        state.customerData = action.payload.data;
      })
      .addCase(searchCustomerDeduction.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getCustomerDeductionList.fulfilled, (state, action) => {
        state.customerData = action.payload.data;
      })
      .addCase(getCustomerDeductionList.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getTypeDDL.fulfilled, (state, action) => {
        state.dataType = action.payload;
      })
      .addCase(getAllApprovalList.fulfilled, (state, action) => {
        state.dataListAppHierId = action.payload;
      })
      .addCase(getListApprovalById.fulfilled, (state, action) => {
        state.dataListAppHierDetail = action.payload;
      })
      .addCase(getListCategory.fulfilled, (state, action) => {
        state.dataListCategory = action.payload;
      })
      .addCase(getDetailDeduction.fulfilled, (state, action) => {
        state.data_detail = action.payload;
      })
      .addCase(getApprovalHistory.fulfilled, (state, action) => {
        state.dataApprovalHistory = action.payload;
      })
      .addCase(deleteDeduction.fulfilled, (state) => {
        state.isSuccess = true;
      })
      .addCase(approveOrRejectDeduction.fulfilled, (state) => {
        state.isSuccess = true;
      })
      .addCase(approveOrRejectDeduction.rejected, (state, action) => {
        state.isFailed = true;
        state.message = action.payload;
      })
      .addMatcher(
        (action) => action.type.startsWith("deduction/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.isSuccess = false;
          state.isFailed = false;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("deduction/") && (action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected")),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export default deductionSlice.reducer;
