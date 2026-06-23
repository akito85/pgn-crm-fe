import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../general_slice";
import productPromoHttpService from "../../services/productPromoHttpService";

const initialState = {
  data: [],
  data_detail: [],
  data_criteria_paging: [],
  data_criteria: [],
  data_attribute: [],
  message: "",
  loading: false,
  isFailed: false,
  isSuccess: false,
  list_tos: [],
  pagination_tos: { totalPage: 0, totalElement: 0 },
  loading_listTos: false,
  latestListReqId_tos: null,
  // data_criteria: [],

  // List Criteria
  data_province: [],
  data_city: [],
  data_country: [],
  data_cost_center: [],
  data_sor: [],
  data_district: [],
  data_sub_district: [],
  data_Gsizes: [],
  data_industrial_sector: [],
  data_service_type: [],
  data_account_Category: [],
  data_account_group: [],
  data_budget: [],
  data_customerSegment: [],
  data_product: [],
  data_customer: [],
};

export const getAllTosPaginate = createAsyncThunk(
  "GET_ALL_SEARCH_TOS",
  async ({ page, pageSize, sort, search, searchText, filters = [], filterRules = [], isLoadMore = false }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/list-tos`;
      const body = {
        page,
        size: pageSize,
        sort: sort || "createdDate~desc",
        search: searchText || null,
        searchs: search || {},
        filters,
        filterRules,
      };
      const response = await productPromoHttpService.createData(url, body);
      return { ...response.data, isLoadMore };
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getCriteriaPaging = createAsyncThunk(
  "GET_CRITERIA_PAGING",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/tos/get-criteriavalue/${id}?search${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await productPromoHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getTosCriteria = createAsyncThunk(
  "GET_TOS_CRITERIA",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/get-criteria`;
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(null);
    }
  }
);

export const getTosAttribute = createAsyncThunk(
  "GET_TOS_ATTRIBUTE",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/get-attribute`;
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(null);
    }
  }
);

export const getTosDetail = createAsyncThunk(
  "GET_TOS_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/detail/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return response?.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const createTOS = createAsyncThunk(
  "CREATE_TOS",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tos/create-tos";
      const response = await productPromoHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been created.",
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not created. ${message}. Please try again.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateTOS = createAsyncThunk(
  "UPDATE_TOS",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tos/update-tos";
      const response = await productPromoHttpService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been updated.",
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not updated. ${message}. Please try again.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const inactiveTos = createAsyncThunk(
  "INACTIVE_TOS",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/change-status-tos`;
      const response = await productPromoHttpService.updateData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Your data has been inactivated.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      const message =
        response?.response?.data?.message ||
        response?.message ||
        response?.toString();
      if (Math.floor((response?.response?.data?.code || 0) / 100) === 4) {
        if (response.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(response));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not inactivated. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(response);
    }
  }
);

export const downloadTOS = createAsyncThunk(
  "DOWNLOAD_TERMS_OF_SERVICE",
  async ({ page, pageSize, sort, search, searchText, filters = [], filterRules = [] }, thunkAPI) => {
    try {
      const body = {
        page,
        size: pageSize,
        sort: sort || "createdDate~desc",
        search: searchText || null,
        searchs: search || {},
        filters,
        filterRules,
      };
      const url = `/v1/dbs/api/tos/download-filter`;
      const response = await productPromoHttpService.downloadDataPost(url, body);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({ error: response, action: "DOWNLOAD_TOS", back: false })
      );
      if (response.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(response));
      }
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

// List Criteria

export const getBudgetList = createAsyncThunk(
  "GET_BUDGET_LIST_TOS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/get-budget`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
      });
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getSubDistrictList = createAsyncThunk(
  "GET_SUB_DISTRICT_LIST_TOS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/sub-district/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return response.data.data?.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(null);
    }
  }
);

export const getDistrictList = createAsyncThunk(
  "GET_DISTRICT_LIST_TOS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/district/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return response.data.data?.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(null);
    }
  }
);

export const getCityList = createAsyncThunk(
  "GET_CITY_LIST_TOS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/city/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return response.data.data?.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(null);
    }
  }
);

export const getProvinceList = createAsyncThunk(
  "GET_PROVINCE_LIST_TOS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/province`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.data?.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getProvinceListByCountry = createAsyncThunk(
  "GET_PROVINCE_LIST_BY_COUNTRY_TOS",
  async (countryId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/province/byCountry/${countryId}`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.data?.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getCountryList = createAsyncThunk(
  "GET_COUNTRY_LIST_TOS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/country`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.data?.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getCostCenterList = createAsyncThunk(
  "GET_COST_CENTER_LIST_TOS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/get-area`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.Id,
          label: item.name,
        };
      });
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getSorList = createAsyncThunk(
  "GET_SOR_LIST_TOS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/get-sor`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.Id,
          label: item.name,
        };
      });
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getProductList = createAsyncThunk(
  "GET_PRODUCT_LIST_TOS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/product`;
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getIndustrialSectorList = createAsyncThunk(
  "GET_INDUSTRIAL_SECTOR_LIST_TOS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/get-industrialsector`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
      });
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getGsizesList = createAsyncThunk(
  "GET_GSIZE_LIST_TOS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/get-gsizes`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
      });
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getCustomerSegmentList = createAsyncThunk(
  "GET_CUSTOMER_SEGMENT_LIST_TOS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/get-customersegment`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
      });
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getAccountGroupList = createAsyncThunk(
  "GET_ACCOUNT_GROUP_LIST_TOS",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/get-accountgroup/${id}`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
      });
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(null);
    }
  }
);

export const getAccountCategoryList = createAsyncThunk(
  "GET_ACCOUNT_CATEGORY_LIST_TOS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/get-accountcategory`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
      });
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getServiceTypeList = createAsyncThunk(
  "GET_SERVICE_TYPE_LIST_TOS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/get-servicetype`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
      });
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getCustomerList = createAsyncThunk(
  "GET_CUSTOMER_LIST_TOS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/get-customer`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.Id,
          label: item.name,
        };
      });
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getSelectCriteria = createAsyncThunk(
  "GET_SELECT_CRITERIA_TOS",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tos/get-criteria`;
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(null);
    }
  }
);

const tosSlice = createSlice({
  name: "tos",
  initialState,
  extraReducers: {
    // get all tos paginate
    [getAllTosPaginate.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listTos = true;
        state.list_tos = [];
        state.latestListReqId_tos = action.meta.requestId;
      }
    },
    [getAllTosPaginate.fulfilled]: (state, action) => {
      const { result, page, isLoadMore } = action.payload || {};
      // Drop stale replace responses (out-of-order race when filters/search
      // change quickly); only the most recent request owns the list.
      if (!isLoadMore && action.meta.requestId !== state.latestListReqId_tos)
        return;
      state.data = action.payload;
      state.loading = false;
      state.loading_listTos = false;
      if (Array.isArray(result)) {
        if (isLoadMore) {
          const existingIds = new Set(state.list_tos.map((it) => it.id));
          state.list_tos = [
            ...state.list_tos,
            ...result.filter((it) => !existingIds.has(it.id)),
          ];
        } else {
          state.list_tos = result;
        }
      }
      state.pagination_tos = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
      };
    },
    [getAllTosPaginate.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.loading_listTos = false;
    },

    // Get Criteria Paging
    [getCriteriaPaging.pending]: (state, action) => {
      state.data_criteria_paging = action.payload;
      state.loading = true;
    },
    [getCriteriaPaging.fulfilled]: (state, action) => {
      state.data_criteria_paging = action.payload;
      state.loading = false;
    },
    [getCriteriaPaging.rejected]: (state, action) => {
      state.data_criteria_paging = action.payload;
      state.loading = false;
    },

    //get criteria
    [getTosCriteria.pending]: (state, action) => {
      state.data_criteria = action.payload;
      state.loading = true;
    },
    [getTosCriteria.fulfilled]: (state, action) => {
      state.data_criteria = action.payload;
      state.loading = false;
    },
    [getTosCriteria.rejected]: (state, action) => {
      state.data_criteria = action.payload;
      state.loading = false;
    },

    //get attribute
    [getTosAttribute.pending]: (state, action) => {
      state.loading = true;
      state.data_attribute = action.payload;
    },
    [getTosAttribute.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_attribute = action.payload;
    },
    [getTosAttribute.rejected]: (state, action) => {
      state.loading = false;
      state.data_attribute = action.payload;
    },

    /** Get Detail General */
    [getTosDetail.pending]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = true;
    },
    [getTosDetail.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getTosDetail.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },

    // Inactive TOS
    [inactiveTos.pending]: (state) => {
      state.loading = true;
    },
    [inactiveTos.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveTos.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    // Create TOS
    [createTOS.pending]: (state) => {
      state.loading = true;
    },
    [createTOS.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [createTOS.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    // Update TOS
    [updateTOS.pending]: (state, action) => {
      state.loading = true;
      state.data = action.payload;
    },
    [updateTOS.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.isSuccess = true;
    },
    [updateTOS.rejected]: (state, action) => {
      state.loading = false;
      state.isFailed = true;
      state.data = action.payload;
    },

    // Get Select Criteria
    [getSelectCriteria.pending]: (state, action) => {
      state.loading = true;
      state.data_criteria = action.payload;
    },
    [getSelectCriteria.fulfilled]: (state, action) => {
      state.data_criteria = action.payload;
      state.loading = false;
    },
    [getSelectCriteria.rejected]: (state, action) => {
      state.data_criteria = action.payload;
      state.loading = false;
    },

    // List Criteria
    [getBudgetList.pending]: (state, action) => {
      state.loading = true;
      state.data_budget = action.payload;
    },
    [getBudgetList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_budget = action.payload;
    },
    [getBudgetList.rejected]: (state, action) => {
      state.loading = false;
      state.data_budget = action.payload;
    },

    [getSubDistrictList.pending]: (state, action) => {
      state.loading = true;
      state.data_sub_district = action.payload;
    },
    [getSubDistrictList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_sub_district = action.payload;
    },
    [getSubDistrictList.rejected]: (state, action) => {
      state.loading = false;
      state.data_sub_district = action.payload;
    },

    [getDistrictList.pending]: (state, action) => {
      state.loading = true;
      state.data_district = action.payload;
    },
    [getDistrictList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_district = action.payload;
    },
    [getDistrictList.rejected]: (state, action) => {
      state.loading = false;
      state.data_district = action.payload;
    },

    [getCityList.pending]: (state, action) => {
      state.loading = true;
      state.data_city = action.payload;
    },
    [getCityList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_city = action.payload;
    },
    [getCityList.rejected]: (state, action) => {
      state.loading = false;
      state.data_city = action.payload;
    },

    [getProvinceList.pending]: (state, action) => {
      state.loading = true;
      state.data_province = action.payload;
    },
    [getProvinceList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_province = action.payload;
    },
    [getProvinceList.rejected]: (state, action) => {
      state.loading = false;
      state.data_province = action.payload;
    },

    [getProvinceListByCountry.pending]: (state, action) => {
      state.loading = true;
      state.data_province = action.payload;
    },
    [getProvinceListByCountry.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_province = action.payload;
    },
    [getProvinceListByCountry.rejected]: (state, action) => {
      state.loading = false;
      state.data_province = action.payload;
    },

    [getCountryList.pending]: (state, action) => {
      state.loading = true;
      state.data_country = action.payload;
    },
    [getCountryList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_country = action.payload;
    },
    [getCountryList.rejected]: (state, action) => {
      state.loading = false;
      state.data_country = action.payload;
    },

    [getCostCenterList.pending]: (state, action) => {
      state.loading = true;
      state.data_cost_center = action.payload;
    },
    [getCostCenterList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_cost_center = action.payload;
    },
    [getCostCenterList.rejected]: (state, action) => {
      state.loading = false;
      state.data_cost_center = action.payload;
    },

    [getSorList.pending]: (state, action) => {
      state.loading = true;
      state.data_sor = action.payload;
    },
    [getSorList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_sor = action.payload;
    },
    [getSorList.rejected]: (state, action) => {
      state.loading = false;
      state.data_sor = action.payload;
    },

    [getProductList.pending]: (state, action) => {
      state.loading = true;
      state.data_product = action.payload;
    },
    [getProductList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_product = action.payload;
    },
    [getProductList.rejected]: (state, action) => {
      state.loading = false;
      state.data_product = action.payload;
    },

    [getIndustrialSectorList.pending]: (state, action) => {
      state.loading = true;
      state.data_industrial_sector = action.payload;
    },
    [getIndustrialSectorList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_industrial_sector = action.payload;
    },
    [getIndustrialSectorList.rejected]: (state, action) => {
      state.loading = false;
      state.data_industrial_sector = action.payload;
    },

    [getGsizesList.pending]: (state, action) => {
      state.loading = true;
      state.data_Gsizes = action.payload;
    },
    [getGsizesList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_Gsizes = action.payload;
    },
    [getGsizesList.rejected]: (state, action) => {
      state.loading = false;
      state.data_Gsizes = action.payload;
    },

    [getCustomerSegmentList.pending]: (state, action) => {
      state.loading = true;
      state.data_customerSegment = action.payload;
    },
    [getCustomerSegmentList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_customerSegment = action.payload;
    },
    [getCustomerSegmentList.rejected]: (state, action) => {
      state.loading = false;
      state.data_customerSegment = action.payload;
    },

    [getAccountGroupList.pending]: (state, action) => {
      state.loading = true;
      state.data_account_group = action.payload;
    },
    [getAccountGroupList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_account_group = action.payload;
    },
    [getAccountGroupList.rejected]: (state, action) => {
      state.loading = false;
      state.data_account_group = action.payload;
    },

    [getAccountCategoryList.pending]: (state, action) => {
      state.loading = true;
      state.data_account_Category = action.payload;
    },
    [getAccountCategoryList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_account_Category = action.payload;
    },
    [getAccountCategoryList.rejected]: (state, action) => {
      state.loading = false;
      state.data_account_Category = action.payload;
    },

    [getServiceTypeList.pending]: (state, action) => {
      state.loading = true;
      state.data_service_type = action.payload;
    },
    [getServiceTypeList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_service_type = action.payload;
    },
    [getServiceTypeList.rejected]: (state, action) => {
      state.loading = false;
      state.data_service_type = action.payload;
    },

    [getCustomerList.pending]: (state, action) => {
      state.loading = true;
      state.data_customer = action.payload;
    },
    [getCustomerList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_customer = action.payload;
    },
    [getCustomerList.rejected]: (state, action) => {
      state.loading = false;
      state.data_customer = action.payload;
    },
  },
});

const { reducer } = tosSlice;
export default reducer;
