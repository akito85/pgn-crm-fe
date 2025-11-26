import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { validateError } from "./general_slice";
import { hasValue } from "../../utils";

const initialState = {
  loading_criteria: false,
  stored: false,
  data_criteria: [],
  data_country: [],
  data_province: [],
  data_city: [],
  data_district: [],
  data_subdistrict: [],
  data_cost_center: [],
  data_sor: [],
  data_gsize: [],
  data_serivce_type: [],
  data_account_category: [],
  data_account: [],
  data_account_group_type: [],
  data_industrial_sector: [],
  data_budget: [],
  data_budget_type: [],
  data_customer_segment: [],
  data_product: [],
  data_sa_type: [],
  data_account_number: [],
  data_account_segment: [],
  data_account_type: [],
  data_classification_type: [],
};

// ddl data
export const getSelectCriteria = createAsyncThunk(
  "GET_SELECT_CRITERIA",
  async ({ services, urls }, thunkAPI) => {
    try {
      const response = await services.getAll(urls);
      return (response?.data || []).map((item) => ({
        label: item.text,
        value: item.id,
        code: item?.code,
      }));
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_SELECT_CRITERIA",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);

export const getCountry = createAsyncThunk(
  "GET_COUNTRY",
  async ({ services, urls }, thunkAPI) => {
    try {
      const response = await services.getAll(urls);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_COUNTRY", back: false })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);

export const getProvince = createAsyncThunk(
  "GET_PROVINCE",
  async ({ services, urls, id }, thunkAPI) => {
    try {
      let url;
      if (hasValue(id)) {
        url = urls + id;
      } else {
        url = urls;
      }
      const response = await services.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_PROVINCE", back: false })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);

export const getCity = createAsyncThunk(
  "GET_CITY",
  async ({ services, urls, id }, thunkAPI) => {
    try {
      const url = urls + id;
      const response = await services.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_CITY", back: false })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);

export const getDistrict = createAsyncThunk(
  "GET_DISTRICT",
  async ({ services, urls, id }, thunkAPI) => {
    try {
      const url = urls + id;
      const response = await services.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_DISTRICT", back: false })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);

export const getSubDistrict = createAsyncThunk(
  "GET_SUBDISTRICT",
  async ({ services, urls, id }, thunkAPI) => {
    try {
      const url = urls + id;
      const response = await services.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_SUBDISTRICT", back: false })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getCostCenter = createAsyncThunk(
  "GET_COST_CENTER",
  async ({ services, urls }, thunkAPI) => {
    try {
      const response = await services.getAll(urls);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_COST_CENTER", back: false })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getSor = createAsyncThunk(
  "GET_SOR",
  async ({ services, urls }, thunkAPI) => {
    try {
      const response = await services.getAll(urls);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_SOR", back: false })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getGsize = createAsyncThunk(
  "GET_GSIZE",
  async ({ services, urls }, thunkAPI) => {
    try {
      const response = await services.getAll(urls);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_GSIZE", back: false })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getServiceType = createAsyncThunk(
  "GET_SERVICE_TYPE",
  async ({ services, urls }, thunkAPI) => {
    try {
      const response = await services.getAll(urls);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_SERVICE_TYPE", back: false })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getAccountCategory = createAsyncThunk(
  "GET_ACCOUNT_CATEFORY",
  async ({ services, urls }, thunkAPI) => {
    try {
      const response = await services.getAll(urls);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ACCOUNT_CATEFORY",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getAccount = createAsyncThunk(
  "GET_ACCOUNT",
  async ({ services, urls }, thunkAPI) => {
    try {
      const response = await services.getAll(urls);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_ACCOUNT", back: false })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getAccountGroupType = createAsyncThunk(
  "GET_ACCOUNT_GROUP_TYPE",
  async ({ services, urls, id }, thunkAPI) => {
    try {
      const url = urls + id;
      const response = await services.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ACCOUNT_GROUP_TYPE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getIndustrialSector = createAsyncThunk(
  "GET_INDUSTRIAL_SECTOR",
  async ({ services, urls }, thunkAPI) => {
    try {
      const response = await services.getAll(urls);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_INDUSTRIAL_SECTOR",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);

export const getBudget = createAsyncThunk(
  "GET_BUDGET",
  async ({ services, urls }, thunkAPI) => {
    try {
      const response = await services.getAll(urls);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_BUDGET", back: false })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getBudgetType = createAsyncThunk(
  "GET_BUDGET_TYPE",
  async ({ services, urls }, thunkAPI) => {
    try {
      const response = await services.getAll(urls);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_BUDGET_TYPE", back: false })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getCustomerSegment = createAsyncThunk(
  "GET_CUSTOMER_SEGMENT",
  async ({ services, urls }, thunkAPI) => {
    try {
      const response = await services.getAll(urls);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_CUSTOMER_SEGMENT",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getProduct = createAsyncThunk(
  "GET_PRODUCT",
  async ({ services, urls }, thunkAPI) => {
    try {
      const response = await services.getAll(urls);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_PRODUCT", back: false })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getSAType = createAsyncThunk(
  "GET_SA_TYPE",
  async ({ services, urls }, thunkAPI) => {
    try {
      const response = await services.getAll(urls);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_SA_TYPE", back: false })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getAccountNumber = createAsyncThunk(
  "GET_ACCOUNT_NUMBER",
  async ({ services, urls }, thunkAPI) => {
    try {
      const response = await services.getAll(urls);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ACCOUNT_NUMBER",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getAccountSegment = createAsyncThunk(
  "GET_ACCOUNT_SEGMENT",
  async ({ services, urls }, thunkAPI) => {
    try {
      const response = await services.getAll(urls);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ACCOUNT_SEGMENT",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getAccountType = createAsyncThunk(
  "GET_ACCOUNT_TYPE",
  async ({ services, urls }, thunkAPI) => {
    try {
      const response = await services.getAll(urls);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_ACCOUNT_TYPE", back: false })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const getClassificationType = createAsyncThunk(
  "GET_CLASSIFICATION_TYPE",
  async ({ services, urls }, thunkAPI) => {
    try {
      const response = await services.getAll(urls);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_ACCOUNT_TYPE", back: false })
      );
      return thunkAPI.rejectWithValue([]);
    }
  }
);

const criteriaSlice = createSlice({
  name: "criteria_slice",
  initialState,
  reducers: {
    setStored: (state, action) => {
      state.stored = action?.payload;
    },
    resetAllStateCriteria: (state) => {
      state.loading_criteria = false;
      state.stored = false;
      state.data_criteria = [];
      state.data_country = [];
      state.data_province = [];
      state.data_city = [];
      state.data_district = [];
      state.data_subdistrict = [];
      state.data_cost_center = [];
      state.data_sor = [];
      state.data_gsize = [];
      state.data_serivce_type = [];
      state.data_account_category = [];
      state.data_account = [];
      state.data_account_group_type = [];
      state.data_industrial_sector = [];
      state.data_budget = [];
      state.data_budget_type = [];
      state.data_customer_segment = [];
      state.data_product = [];
      state.data_sa_type = [];
      state.data_account_number = [];
      state.data_account_segment = [];
      state.data_account_type = [];
      state.data_classification_type = [];
    },
  },
  extraReducers: {
    [getSelectCriteria.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getSelectCriteria.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_criteria = action?.payload;
    },
    [getSelectCriteria.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_criteria = action?.payload;
    },
    [getCountry.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getCountry.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_country = action?.payload;
    },
    [getCountry.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_country = action?.payload;
    },
    [getProvince.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getProvince.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_province = action?.payload;
    },
    [getProvince.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_province = action?.payload;
    },
    [getCity.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getCity.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_city = action?.payload;
    },
    [getCity.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_city = action?.payload;
    },
    [getDistrict.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getDistrict.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_district = action?.payload;
    },
    [getDistrict.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_district = action?.payload;
    },
    [getSubDistrict.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getSubDistrict.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_subdistrict = action?.payload;
    },
    [getSubDistrict.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_subdistrict = action?.payload;
    },
    [getCostCenter.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getCostCenter.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_cost_center = action?.payload;
    },
    [getCostCenter.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_cost_center = action?.payload;
    },
    [getSor.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getSor.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_sor = action?.payload;
    },
    [getSor.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_sor = action?.payload;
    },
    [getGsize.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getGsize.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_gsize = action?.payload;
    },
    [getGsize.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_gsize = action?.payload;
    },
    [getServiceType.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getServiceType.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_serivce_type = action?.payload;
    },
    [getServiceType.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_serivce_type = action?.payload;
    },
    [getAccountCategory.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getAccountCategory.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_account_category = action?.payload;
    },
    [getAccountCategory.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_account_category = action?.payload;
    },
    [getAccount.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getAccount.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_account = action?.payload;
    },
    [getAccount.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_account = action?.payload;
    },
    [getAccountGroupType.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getAccountGroupType.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_account_group_type = action?.payload;
    },
    [getAccountGroupType.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_account_group_type = action?.payload;
    },
    [getIndustrialSector.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getIndustrialSector.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_industrial_sector = action?.payload;
    },
    [getIndustrialSector.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_industrial_sector = action?.payload;
    },
    [getBudget.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getBudget.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_budget = action?.payload;
    },
    [getBudget.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_budget = action?.payload;
    },
    [getBudgetType.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getBudgetType.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_budget_type = action?.payload;
    },
    [getBudgetType.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_budget_type = action?.payload;
    },
    [getCustomerSegment.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getCustomerSegment.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_customer_segment = action?.payload;
    },
    [getCustomerSegment.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_customer_segment = action?.payload;
    },
    [getProduct.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getProduct.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_product = action?.payload;
    },
    [getProduct.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_product = action?.payload;
    },
    [getSAType.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getSAType.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_sa_type = action?.payload;
    },
    [getSAType.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_sa_type = action?.payload;
    },
    [getAccountNumber.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getAccountNumber.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_account_number = action?.payload;
    },
    [getAccountNumber.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_account_number = action?.payload;
    },
    [getAccountSegment.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getAccountSegment.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_account_segment = action?.payload;
    },
    [getAccountSegment.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_account_segment = action?.payload;
    },
    [getAccountType.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getAccountType.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_account_type = action?.payload;
    },
    [getAccountType.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_account_type = action?.payload;
    },
    [getClassificationType.pending]: (state) => {
      state.loading_criteria = true;
    },
    [getClassificationType.rejected]: (state, action) => {
      state.loading_criteria = false;
      state.data_classification_type = action?.payload;
    },
    [getClassificationType.fulfilled]: (state, action) => {
      state.loading_criteria = false;
      state.data_classification_type = action?.payload;
    },
  },
});

export const { setStored, resetAllStateCriteria } = criteriaSlice.actions;
export default criteriaSlice.reducer;
