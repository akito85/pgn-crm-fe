import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setBodyError, showModalError, validateError } from "../general_slice";

// Hardcode
import hc_late_charge_list from "./temp_hardcoded_json/lateCharge/get-list-lateCharge.json";
import hc_customer_list from "./temp_hardcoded_json/lateCharge/get-list-customer.json";
import hc_late_charge_detail from "./temp_hardcoded_json/lateCharge/get-detail-lateCharge.json";

const initialState = {
  loading: false,
  data: null,
  data_detail: null,
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataListRecalculateType: [],
  dataListReplaceType: [],
  dataListReverseType: [],
};

export const getPagingLateCharge = createAsyncThunk(
  "GET_ALL_LATE_CHARGE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const response = hc_late_charge_list;
      await new Promise(resolve => setTimeout(resolve, 500));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_LATE_CHARGE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDetailLateChargePayment = createAsyncThunk(
  "GET_DETAIL_ITEM_LATE_CHARGE_PAYMENTS",
  async (id, thunkAPI) => {
    try {
      // Simulator
      const response = hc_late_charge_detail;
      await new Promise(resolve => setTimeout(resolve, 500));
      return response;
    } catch (error) {
      thunkAPI.dispatch(setBodyError(error));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const downloadLateCharge = createAsyncThunk(
  "DOWNLOAD_LATE_CHARGE_MANAGEMENT",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/latecharge/download?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "LATE_CHARGE_DOWNLOAD",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const searchCustomerLateCharge = createAsyncThunk(
  "SEARCH_CUSTOMER_LATE_CHARGE",
  async ({ page, pageSize }, thunkAPI) => {
    try {
      // Simulator
      const response = hc_customer_list;
      await new Promise(resolve => setTimeout(resolve, 500));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const submitLateCharge = createAsyncThunk(
  "SUBMIT_LATE_CHARGE",
  async (payload, thunkAPI) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { message: "Success" };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY_LATE_CHARGE",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/attachment/list-category";
      const response = await receiptCollectionHttpService.getAll(url);
      const mapsCategory = response?.data?.data?.map((item) => ({
        Id: item?.glbTypeValId,
        text: item?.name,
      }));
      return mapsCategory;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = { title: "Failed", description: `${message}` };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getAllApprovalList = createAsyncThunk(
  "GET_ALL_APPROVAL_LIST_LATE_CHARGE",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/apphier/get-list-approval-hierarchies`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = { title: "Failed", description: `${message}` };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListApprovalById = createAsyncThunk(
  "GET_LIST_APPROVAL_BY_ID_LATE_CHARGE",
  async ({ id }, thunkAPI) => {
    try {
      if (id === 1) {
        return [
          {
            approvalLevel: "1",
            approvalName: "Submitter",
            position: "Sales and Customer Management",
            employeeDetail: [
              { employeeName: "Jason Sutedja", key: 1 }
            ]
          },
          {
            approvalLevel: "2",
            approvalName: "Final Approver",
            position: "Sinergi01",
            employeeDetail: [
              { employeeName: "Asep Saepullah", key: 1 }
            ]
          }
        ];
      }
      const url = `/v1/dbs/api/apphier/get-approval-hierarchies/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = { title: "Failed", description: `${message}` };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const approveOrRejectLateCharge = createAsyncThunk(
  "APPROVE_OR_REJECT_LATE_CHARGE",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/approval/approve-reject`;
      const response = await receiptCollectionHttpService.post(url, body);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = { title: "Failed", description: `${message}` };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListRecalculateType = createAsyncThunk(
  "GET_LIST_RECALCULATE_TYPE",
  async (_, thunkAPI) => {
    try {
      // Simulator dummy data
      const data = [
        { label: "Illegal Action", value: "Illegal Action" },
        { label: "Other", value: "Other" },
      ];
      await new Promise((resolve) => setTimeout(resolve, 500));
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListReplaceType = createAsyncThunk(
  "GET_LIST_REPLACE_TYPE",
  async (_, thunkAPI) => {
    try {
      // Simulator dummy data
      const data = [
        { label: "Illegal Action", value: "Illegal Action" },
        { label: "Other", value: "Other" },
      ];
      await new Promise((resolve) => setTimeout(resolve, 500));
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListReverseType = createAsyncThunk(
  "GET_LIST_REVERSE_TYPE",
  async (_, thunkAPI) => {
    try {
      // Simulator dummy data
      const data = [
        { label: "Illegal Action", value: "Illegal Action" },
        { label: "Other", value: "Other" },
      ];
      await new Promise((resolve) => setTimeout(resolve, 500));
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

const lateCharge = createSlice({
  name: "late",
  initialState,
  reducers: {
    resetDetail: (state) => {
      state.data_detail = null;
    }
  },
  extraReducers: {
    //get all employee paginate reducer
    [getPagingLateCharge.pending]: (state) => {
      state.loading = true;
    },
    [getPagingLateCharge.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getPagingLateCharge.rejected]: (state) => {
      state.loading = false;
    },

    // get detail
    [getDetailLateChargePayment.pending]: (state) => {
      state.loading = true;
    },
    [getDetailLateChargePayment.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailLateChargePayment.rejected]: (state) => {
      state.loading = false;
    },

    //download
    [downloadLateCharge.fulfilled]: (state, action) => {
      state.data_download = action.payload;
      state.loading = false;
    },
    [downloadLateCharge.rejected]: (state, action) => {
      state.loading = false;
    },

    // search customer
    [searchCustomerLateCharge.pending]: (state) => {
      state.loading = true;
    },
    [searchCustomerLateCharge.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [searchCustomerLateCharge.rejected]: (state) => {
      state.loading = false;
    },

    // submit
    [submitLateCharge.pending]: (state) => {
      state.loading = true;
    },
    [submitLateCharge.fulfilled]: (state) => {
      state.loading = false;
    },
    [submitLateCharge.rejected]: (state) => {
      state.loading = false;
    },

    // approval
    [getAllApprovalList.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    [getListApprovalById.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },

    // approve or reject
    [approveOrRejectLateCharge.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectLateCharge.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectLateCharge.rejected]: (state) => {
      state.loading = false;
    },

    // category
    [getListCategory.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },
    // recalculate type
    [getListRecalculateType.fulfilled]: (state, action) => {
      state.dataListRecalculateType = action.payload;
      state.loading = false;
    },
    // replace type
    [getListReplaceType.fulfilled]: (state, action) => {
      state.dataListReplaceType = action.payload;
      state.loading = false;
    },
    // reverse type
    [getListReverseType.fulfilled]: (state, action) => {
      state.dataListReverseType = action.payload;
      state.loading = false;
    },
  },
});

const { reducer, actions } = lateCharge;
export const { resetDetail } = actions;
export default reducer;

