import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import hc_deduction_list from "./temp_hardcoded_json/deduction/get-deduction-list.json";
import hc_customer_list from "./temp_hardcoded_json/deduction/get-customer-list.json";

export const getDeductionList = createAsyncThunk(
  "deduction/getDeductionList",
  async ({ page = 1, pageSize = 10, search = "", sort = "" }, thunkAPI) => {
    try {
      // Simulate API call with dummy data
      // In a real scenario, this would be an API request
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      // For now, returning the hardcoded list directly, 
      // mimicking the structure expected by the ViewDeduction component
      // We can add simple filtering/sorting if needed, but for now just returning the data

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
      // Simulate download
      console.log("Download triggered with params:", params);
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);




export const searchCustomerDeduction = createAsyncThunk(
  "deduction/searchCustomerDeduction",
  async ({ page = 1, pageSize = 10 }, thunkAPI) => {
    try {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      // Simulating a network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const customerList = hc_customer_list.data.result;

      console.log("customerList", customerList);

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
  error: null,
};

const deductionSlice = createSlice({
  name: "deduction",
  initialState,
  reducers: {
    // Standard reducers if needed
  },
  extraReducers: (builder) => {
    builder
      // Get List
      .addCase(getDeductionList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDeductionList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(getDeductionList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Download
      .addCase(downloadDeductionList.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadDeductionList.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadDeductionList.rejected, (state) => {
        state.loading = false;
      })

      // Search Customer
      .addCase(searchCustomerDeduction.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchCustomerDeduction.fulfilled, (state, action) => {
        state.loading = false;
        state.customerData = action.payload.data;
      })
      .addCase(searchCustomerDeduction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default deductionSlice.reducer;
