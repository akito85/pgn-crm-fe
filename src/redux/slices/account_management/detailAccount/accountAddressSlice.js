import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showModalError } from "../../general_slice";
import { showModalSuccess } from "../../general_slice";
import accountManagementService from "../../../services/account_management/accountManagementService";

const initialState = {
  data: [],
  data_detail: {},
  data_choose_address: [],
  data_country:[],
  data_province:[],
  data_city:[],
  data_district:[],
  data_subdistrict:[],
  data_postalcode:[],
  data_type:[],
  data_business_purpose:[],
  loading: false,
  isFailed: false,
  isSuccess: false,
  message: "",
};

// Get list pagination address 
export const getListDetailAccountAddress = createAsyncThunk(
  "GET_LIST_DETAIL_ACCOUNT_ADDRESS",
  async ({ search, id, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? '' : search;
			const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/account/address/view/${id}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// get list choose address
export const getListChooseAddress = createAsyncThunk(
  "GET_LIST_CHOOSE_ACCOUNT_ADDRESS",
  async ({ id, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? '' : search;
			const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/account/address/view/choose-address/${id}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get detail after choose
export const getDetailAddressAfterChoose = createAsyncThunk(
  "GET_DETAIL_ADDRESS_AFTER_CHOOSE_ID",
  async (addressId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/address/view/detailChoose/${addressId}`;
      const response = await accountManagementService.getPagination(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get detail
export const getDetailAddress = createAsyncThunk(
  "GET_DETAIL_ADDRESS_BY_ID",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/address/view/detail/${id}`;
      const response = await accountManagementService.getPagination(url);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const activationAccountAddress = createAsyncThunk(
  "ACTIVATION_ACCOUNT_ADDRESS",
  async ({body, title}, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/address/active/inactive`;
      const response = await accountManagementService.updateData(
        url,
        body
      );
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${title}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
        const errorBody = { 
          title: "Failed",
          description: `Your data was not ${title}. ${message}. Please try again.`,
          return: false,
        };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


// ===== GET LOCATION ===== //

// Get Country
export const getCountry = createAsyncThunk("GET_COUNTRY", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/master/location/country`;
    const response = await accountManagementService.getAll(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

// Get Province
export const getProvince = createAsyncThunk("GET_PROVINCE", async (id, thunkAPI) => {
  try {
    const url = `/v1/dbs/api/master/location/province/${id}`;
    const response = await accountManagementService.getAll(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

// Get City
export const getCity = createAsyncThunk("GET_CITY", async (id, thunkAPI) => {
  try {
    const url = `/v1/dbs/api/master/location/city/${id}`;
    const response = await accountManagementService.getAll(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

// Get District
export const getDistrict = createAsyncThunk("GET_DISTRICT", async (id, thunkAPI) => {
  try {
    const url = `/v1/dbs/api/master/location/district/${id}`;
    const response = await accountManagementService.getAll(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

// Get Subdistrict
export const getSubDistrict = createAsyncThunk("GET_SUB_DISTRICT", async (id, thunkAPI) => {
  try {
    const url = `/v1/dbs/api/master/location/sub-district/${id}`;
    const response = await accountManagementService.getAll(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

// Get Postal Code
export const getPostalCode = createAsyncThunk("GET_POSTAL_CODE", async (id, thunkAPI) => {
  try {
    const url = `/v1/dbs/api/master/location/postal-code/${id}`;
    const response = await accountManagementService.getAll(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

// Get Business Purpose
export const getBusinessPurpose = createAsyncThunk("GET_BUSINESS_PURPOSE", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/account/address/list/businessPurpose`;
    const response = await accountManagementService.getAll(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

// Get Type
export const getType = createAsyncThunk("GET_TYPE", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/account/address/list/type`;
    const response = await accountManagementService.getAll(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});


export const createAccountAddress = createAsyncThunk(
  "CREATE_ACCOUNT_ADDRESS",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/account/address";
      const response = await accountManagementService.createData(url, body);
      // const successBody = {
      //   title: `Successful`,
      //   description: "Your data has been created.",
      //   return : true,
      // };
      // thunkAPI.dispatch(showModalSuccess(successBody));
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      // const errorBody = {
      //   title: "Failed",
      //   description: `Your data was not created. ${message}.`,
      // };
      // thunkAPI.dispatch(showModalError(errorBody));
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateAccountAddress = createAsyncThunk(
  "UPDATE_ACCOUNT_ADDRESS",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/account/address/update";
      const response = await accountManagementService.updateData(url, body);
      // const successBody = {
      //   title: `Successful`,
      //   description: "Your data has been updated.",
      //   return : true,
      // };
      // thunkAPI.dispatch(showModalSuccess(successBody));
      return response;
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
            description: `${message}`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



const accountAddressSlice = createSlice({
  name: "accountAddress",
  initialState,
  extraReducers: {
    // Get All Pricing Rule Pagination
    [getListDetailAccountAddress.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data = action.payload;
    },
    [getListDetailAccountAddress.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data = action.payload;
      state.loading = false;
    },
    [getListDetailAccountAddress.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // Acivation Account Address
    [activationAccountAddress.pending]: (state, action) => {
      state.loading = true;
    },
    [activationAccountAddress.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [activationAccountAddress.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    // Get List Choose Account Address
    [getListChooseAddress.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_choose_address = action.payload;
    },
    [getListChooseAddress.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_choose_address = action.payload;
      state.loading = false;
    },
    [getListChooseAddress.rejected]: (state, action) => {
      state.data_choose_address = action.payload;
      state.loading = false;
    },

    // Get Detail Account Address After Choose
    [getDetailAddressAfterChoose.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_detail = action.payload;
    },
    [getDetailAddressAfterChoose.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailAddressAfterChoose.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    // Get Detail Account Address
    [getDetailAddress.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_detail = action.payload;
    },
    [getDetailAddress.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailAddress.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },

    
    // Get Country
    [getCountry.pending]: (state, action) => {
      state.loading = true;
      state.data_country = action.payload;
    },
    [getCountry.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_country = action.payload;
    },
    [getCountry.rejected]: (state, action) => {
      state.loading = false;
      state.data_country = action.payload;
    },
    
    // Get Province
    [getProvince.pending]: (state, action) => {
      state.loading = true;
      state.data_province = action.payload;
    },
    [getProvince.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_province = action.payload;
    },
    [getProvince.rejected]: (state, action) => {
      state.loading = false;
      state.data_province = action.payload;
    },
    
    // Get City
    [getCity.pending]: (state, action) => {
      state.loading = true;
      state.data_city = action.payload;
    },
    [getCity.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_city = action.payload;
    },
    [getCity.rejected]: (state, action) => {
      state.loading = false;
      state.data_city = action.payload;
    },
    
    // Get District
    [getDistrict.pending]: (state, action) => {
      state.loading = true;
      state.data_district = action.payload;
    },
    [getDistrict.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_district = action.payload;
    },
    [getDistrict.rejected]: (state, action) => {
      state.loading = false;
      state.data_district = action.payload;
    },
    
    // Get Sub District
    [getSubDistrict.pending]: (state, action) => {
      state.loading = true;
      state.data_subdistrict = action.payload;
    },
    [getSubDistrict.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_subdistrict = action.payload;
    },
    [getSubDistrict.rejected]: (state, action) => {
      state.loading = false;
      state.data_subdistrict = action.payload;
    },
    
    // Get Postal Code
    [getPostalCode.pending]: (state, action) => {
      state.loading = true;
      state.data_postalcode = action.payload;
    },
    [getPostalCode.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_postalcode = action.payload;
    },
    [getPostalCode.rejected]: (state, action) => {
      state.loading = false;
      state.data_postalcode = action.payload;
    },
    
    // Get Business Purpose
    [getBusinessPurpose.pending]: (state, action) => {
      state.loading = true;
      state.data_business_purpose = action.payload;
    },
    [getBusinessPurpose.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_business_purpose = action.payload;
    },
    [getBusinessPurpose.rejected]: (state, action) => {
      state.loading = false;
      state.data_business_purpose = action.payload;
    },
    // Update Account Address
    [updateAccountAddress.pending]: (state, action) => {
      state.loading = true;
    },
    [updateAccountAddress.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [updateAccountAddress.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
    },
    // Create Account Address
    [createAccountAddress.pending]: (state, action) => {
      state.loading = true;
    },
    [createAccountAddress.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [createAccountAddress.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
    },
    // Get Type
    [getType.pending]: (state, action) => {
      state.loading = true;
      state.data_type = action.payload;
    },
    [getType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_type = action.payload;
    },
    [getType.rejected]: (state, action) => {
      state.loading = false;
      state.data_type = action.payload;
    },
  }
})

const { reducer } = accountAddressSlice;
export default reducer;
