import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import hc_writeOff_list from "./temp_hardcoded_json/writeOff/get-writeOff-list.json";
import hc_customer_list from "./temp_hardcoded_json/writeOff/get-customer-list.json";
import hc_writeOff_detail from "./temp_hardcoded_json/writeOff/get-detail-writeOff.json";
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
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataListCategory: [],
  dataType: [],
  error: null,
  isSuccess: false,
  isFailed: false,
  message: null,
};



export const getWriteOffList = createAsyncThunk(
  "writeOff/getWriteOffList",
  async ({ page = 1, pageSize = 10, search = "", sort = "" }, thunkAPI) => {
    try {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return {
        data: {
          result: hc_writeOff_list.data.result.slice(start, end),
          page: {
            size: pageSize,
            totalElements: hc_writeOff_list.data.result.length,
            totalPages: Math.ceil(hc_writeOff_list.data.result.length / pageSize),
            number: page - 1
          }
        }
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const downloadWriteOffList = createAsyncThunk(
  "writeOff/downloadWriteOffList",
  async (params, thunkAPI) => {
    try {
      console.log("Download triggered with params:", params);
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const searchCustomerWriteOff = createAsyncThunk(
  "writeOff/searchCustomerWriteOff",
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

export const getTypeDDL = createAsyncThunk(
  "writeOff/getTypeDDL",
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
  "writeOff/getAllApprovalList",
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
  "writeOff/getListApprovalById",
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
  "writeOff/getListCategory",
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

export const getDetailWriteOff = createAsyncThunk(
  "writeOff/getDetailWriteOff",
  async (id, thunkAPI) => {
    try {
      // For development, use dummy data
      return hc_writeOff_detail.data;

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

export const approveOrRejectWriteOff = createAsyncThunk(
  "writeOff/approveOrRejectWriteOff",
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

const writeOffSlice = createSlice({
  name: "writeOff",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWriteOffList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWriteOffList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(getWriteOffList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchCustomerWriteOff.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchCustomerWriteOff.fulfilled, (state, action) => {
        state.loading = false;
        state.customerData = action.payload.data;
      })
      .addCase(searchCustomerWriteOff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTypeDDL.fulfilled, (state, action) => {
        state.dataType = action.payload;
        state.loading = false;
      })
      .addCase(getAllApprovalList.fulfilled, (state, action) => {
        state.dataListAppHierId = action.payload;
        state.loading = false;
      })
      .addCase(getListApprovalById.fulfilled, (state, action) => {
        state.dataListAppHierDetail = action.payload;
        state.loading = false;
      })
      .addCase(getListCategory.fulfilled, (state, action) => {
        state.dataListCategory = action.payload;
        state.loading = false;
      })
      .addCase(getDetailWriteOff.fulfilled, (state, action) => {
        state.data_detail = action.payload;
        state.loading = false;
      })
      .addCase(approveOrRejectWriteOff.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveOrRejectWriteOff.fulfilled, (state) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(approveOrRejectWriteOff.rejected, (state, action) => {
        state.isFailed = true;
        state.loading = false;
        state.message = action.payload;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export default writeOffSlice.reducer;
