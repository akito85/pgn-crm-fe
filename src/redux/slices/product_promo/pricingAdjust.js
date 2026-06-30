import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productPromoHttpService from "../../services/productPromoHttpService";
import {
  grantedAccessDetail,
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../general_slice";

const initialState = {
  dataPricingAdjust: {},
  dataDetailPricingAdjustGeneral: {},
  dataDetailDraftPricingAdjustGeneral: {},
  dataStatus: {},
  loadingPricingAdjust: false,
  list_pricingAdjust: [],
  pagination_pricingAdjust: { totalPage: 0, totalElement: 0 },
  loading_listPricingAdjust: false,
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataApprovalHistory: {},
  dataListPricingDetailActive: {},
  dataListCriteria: [],
  data_province: [],
  data_country: [],
  data_city: [],
  data_cost_center: [],
  data_sor: [],
  data_district: [],
  data_sub_district: [],
  data_Gsizes: [],
  data_industrial_sector: [],
  data_service_type: [],
  data_account_Category: [],
  data_account_group: [],
  data_customerSegment: [],
  data_customer: [],
  data_budget: [],
  data_adjustment_type: [],
  dataDetailPricing: {},
  dataListCategory: [],
  message: "",
  data_grant_access: {},
};

export const getGrantedAccessPriceAdjust = createAsyncThunk(
  "CHECK_GRANTED_PRICE_ADJUSTMENT",
  async (body, thunkAPI) => {
    try {
      const data = await productPromoHttpService.checkGrantedAccessProduct(
        body
      );
      thunkAPI.dispatch(grantedAccessDetail(body?.body));
      return data?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "CHECK_GRANTED_PRICE_ADJUSTMENT",
        })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllPricingAdjustPaginate = createAsyncThunk(
  "GET_ALL_PRICING_ADJUST_PAGINATE",
  async ({ page, pageSize, sort, search, searchText, filters = [], filterRules = [], isLoadMore = false }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/list-pricing-adjustment`;
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
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getDetailPricingAdjustGeneral = createAsyncThunk(
  "GET_DETAIL_PRICING_ADJUST_GENERAL",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/detail/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return response.data.data;
    } catch (error) {
      // console.log(error, " = error slice");
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getDetailDraftPricingAdjustGeneral = createAsyncThunk(
  "GET_DETAIL_DRAFT_PRICING_ADJUST_GENERAL",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/detail-draft/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const inactivePricingAdjust = createAsyncThunk(
  "INACTIVE_PRICING_ADJUST",
  async ({ data }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/inactivate`;
      const response = await productPromoHttpService.activationWithRemark(
        url,
        data
      );
      const successBody = {
        title: "Successful",
        description: "Your data has been submitted.",
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
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not submitted. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getListAppHier = createAsyncThunk(
  "GET_LIST_APP_HIER_PRICE_ADJUST",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/price-adjustment/list-apphier";
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getListAppHierDetail = createAsyncThunk(
  "GET_LIST_APP_HIER_DETAIL_PRICE_ADJUST",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/list-approval-hierarchy-detail/${id}`;
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_PRICE_ADJUST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/approval-history/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const downloadPriceAdjust = createAsyncThunk(
  "DOWNLOAD_PRICE_ADJUST",
  async ({ search, searchText, page, pageSize, sort, filters = [], filterRules = [] }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/download-filter`;
      const body = {
        page,
        size: pageSize,
        sort: sort || "createdDate~desc",
        search: searchText || null,
        searchs: search || {},
        filters,
        filterRules,
      };
      const response = await productPromoHttpService.downloadDataPost(url, body);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "DOWNLOAD_PRICE_ADJUST", back: false })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getAllPricingDetailActive = createAsyncThunk(
  "GET_ALL_PRICING_DETAIL_ACTIVE_PRICE_ADJUST",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/list-pricing-detail/${id}`;
      const response = await productPromoHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getListCriteria = createAsyncThunk(
  "GET_LIST_CRITERIA_PRICE_ADJUST",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/price-adjustment/list-criteria";
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).filter(
        (item) => item.glbTypeValId !== 24
      );
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getProvinceList = createAsyncThunk(
  "GET_PROVINCE_LIST_PRICING",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/province`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data.data || []).map((item) => {
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
  "GET_PROVINCE_LIST_BY_COUNTRY_PRICE_ADJUST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/province/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return (response.data.data || []).map((item) => {
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
  "GET_COUNTRY_LIST_PRICE_ADJUST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/country`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data.data || []).map((item) => {
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

export const getCityList = createAsyncThunk(
  "GET_CITY_LIST_PRICE_ADJUST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/city/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return (response.data.data || []).map((item) => {
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
  "GET_COST_CENTER_LIST_PRICE_ADJUST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/sor-areanumber?ccType=AREA`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data.data || []).map((item) => {
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

export const getSorList = createAsyncThunk(
  "GET_SOR_LIST_PRICE_ADJUST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/sor-areanumber?ccType=SOR`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data.data || []).map((item) => {
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

export const getDistrictList = createAsyncThunk(
  "GET_DISTRICT_LIST_PRICE_ADJUST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/district/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return (response.data.data || []).map((item) => {
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

export const getSubDistrictList = createAsyncThunk(
  "GET_SUB_DISTRICT_LIST_PRICE_ADJUST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/sub-district/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return (response.data.data || []).map((item) => {
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

export const getGsizesList = createAsyncThunk(
  "GET_GSIZE_LIST_PRICE_ADJUST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/gsizes`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
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

export const getIndustrialSectorList = createAsyncThunk(
  "GET_INDUSTRIAL_SECTOR_LIST_PRICE_ADJUST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/industrialsector`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
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
  "GET_SERVICE_TYPE_LIST_PRICE_ADJUST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/servicetype`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
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

export const getAccountCategoryList = createAsyncThunk(
  "GET_ACCOUNT_CATEGORY_LIST_PRICE_ADJUST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/accountcategory`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
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
  "GET_ACCOUNT_GROUP_LIST_PRICE_ADJUST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/accountgroup/${id}`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
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

export const getBudgetList = createAsyncThunk(
  "GET_BUDGET_LIST_PRICE_ADJUST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/budgetnumber`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data.data || []).map((item) => {
        return {
          value: item.glbTypeValId,
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

export const getCustomerSegmentList = createAsyncThunk(
  "GET_CUSTOMER_SEGMENT_LIST_PRICE_ADJUST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/customer-segment`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
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
  "GET_CUSTOMER_LIST_PRICE_ADJUST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api//price-adjustment/list-customer`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => {
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

export const getAdjustmentTypeList = createAsyncThunk(
  "GET_ADJUSTMENT_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/adjustment-type`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
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

export const getDetailPricing = createAsyncThunk(
  "GET_DETAIL_PRICING_PRICE_ADJUST",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/pricing-detail/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return response.data.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY_PRICE_ADJUST",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/price-adjustment/list-category";
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => ({
        glbTypeValId: item.Id,
        name: item.text,
      }));
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createPriceAdjustBody = createAsyncThunk(
  "CREATE_PRICE_ADJUST",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/price-adjustment/create-pricing-adjustment";
      const response = await productPromoHttpService.createData(url, body);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${
              !body.submit ? "created" : "submitted"
            }. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updatePriceAdjustBody = createAsyncThunk(
  "UPDATE_PRICE_ADJUST",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/price-adjustment/update-pricing-adjustment";
      const response = await productPromoHttpService.createData(url, body);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${
              !body.submit ? "updated" : "submitted"
            }. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const approvalCreatePriceAdjust = createAsyncThunk(
  "APPROVAL_CREATE_PRICE_ADJUST",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/approve-pricing-adjustment`;
      const response = await productPromoHttpService.activationWithRemark(
        url,
        body
      );
      const successBody = {
        title: "Successful",
        description: `Your data has been ${
          body.action === "APPROVE" ? "approved" : "rejected"
        }.`,
        alertDescription:
          body.action === "REJECT"
            ? "Warning! if you reject this data, you will need to request approval again."
            : undefined,
        width: body.action === "REJECT" ? 700 : 500,
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
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${
              body.action === "APPROVE" ? "approved" : "rejected"
            }. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const approvalInactivePriceAdjust = createAsyncThunk(
  "APPROVAL_INACTIVE_PRICE_ADJUST",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/approve-inactive-pricing-adjustment`;
      const response = await productPromoHttpService.activationWithRemark(
        url,
        body
      );
      const successBody = {
        title: "Successful",
        description: `Your data has been ${
          body.action === "APPROVE" ? "approved" : "rejected"
        }.`,
        alertDescription:
          body.action === "REJECT"
            ? "Warning! if you reject this data, you will need to request approval again."
            : undefined,
        width: body.action === "REJECT" ? 700 : 500,
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
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${
              body.action === "APPROVE" ? "approved" : "rejected"
            }. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const pricingAdjustSlice = createSlice({
  name: "pricingAdjust",
  initialState,
  extraReducers: {
    /** Get Pricing Adjust List Paginate */
    [getAllPricingAdjustPaginate.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.dataPricingAdjust = action.payload;
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listPricingAdjust = true;
        state.list_pricingAdjust = [];
      }
    },
    [getAllPricingAdjustPaginate.fulfilled]: (state, action) => {
      state.dataPricingAdjust = action.payload;
      state.loadingPricingAdjust = false;
      state.loading_listPricingAdjust = false;
      const { result, page, isLoadMore } = action.payload || {};
      if (Array.isArray(result)) {
        state.list_pricingAdjust = isLoadMore
          ? [...state.list_pricingAdjust, ...result]
          : result;
      }
      state.pagination_pricingAdjust = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
      };
    },
    [getAllPricingAdjustPaginate.rejected]: (state, action) => {
      state.dataPricingAdjust = action.payload;
      state.loadingPricingAdjust = false;
      state.loading_listPricingAdjust = false;
    },
    /** Get Detail Pricing General */
    [getDetailPricingAdjustGeneral.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.dataDetailPricingAdjustGeneral = action.payload;
    },
    [getDetailPricingAdjustGeneral.fulfilled]: (state, action) => {
      state.dataDetailPricingAdjustGeneral = action.payload;
      state.loadingPricingAdjust = false;
    },
    [getDetailPricingAdjustGeneral.rejected]: (state, action) => {
      state.dataDetailPricingAdjustGeneral = action.payload;
      state.loadingPricingAdjust = false;
    },
    /** Get Detail Pricing General */
    [getDetailDraftPricingAdjustGeneral.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.dataDetailDraftPricingAdjustGeneral = action.payload;
    },
    [getDetailDraftPricingAdjustGeneral.fulfilled]: (state, action) => {
      state.dataDetailDraftPricingAdjustGeneral = action.payload;
      state.loadingPricingAdjust = false;
    },
    [getDetailDraftPricingAdjustGeneral.rejected]: (state, action) => {
      state.dataDetailDraftPricingAdjustGeneral = action.payload;
      state.loadingPricingAdjust = false;
    },
    /** Inactive Pricing */
    [inactivePricingAdjust.pending]: (state) => {
      state.loadingPricingAdjust = true;
    },
    [inactivePricingAdjust.fulfilled]: (state) => {
      state.loadingPricingAdjust = false;
    },
    [inactivePricingAdjust.rejected]: (state) => {
      state.loadingPricingAdjust = false;
    },
    /** Get List AppHierId */
    [getListAppHier.pending]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loadingPricingAdjust = true;
    },
    [getListAppHier.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loadingPricingAdjust = false;
    },
    [getListAppHier.rejected]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loadingPricingAdjust = false;
    },
    /** Get List AppHierDetail */
    [getListAppHierDetail.pending]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loadingPricingAdjust = true;
    },
    [getListAppHierDetail.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loadingPricingAdjust = false;
    },
    [getListAppHierDetail.rejected]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loadingPricingAdjust = false;
    },
    /** Get Approval History */
    [getApprovalHistory.pending]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loadingPricingAdjust = true;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loadingPricingAdjust = false;
    },
    [getApprovalHistory.rejected]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loadingPricingAdjust = false;
    },
    /** Download Price Adjust*/
    [downloadPriceAdjust.pending]: (state) => {
      state.loadingPricingAdjust = true;
    },
    [downloadPriceAdjust.fulfilled]: (state) => {
      state.loadingPricingAdjust = false;
    },
    [downloadPriceAdjust.rejected]: (state) => {
      state.loadingPricingAdjust = false;
    },
    /** Get All Pricing Detail Paginate */
    [getAllPricingDetailActive.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.dataListPricingDetailActive = action.payload;
    },
    [getAllPricingDetailActive.fulfilled]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.dataListPricingDetailActive = action.payload;
    },
    [getAllPricingDetailActive.rejected]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.dataListPricingDetailActive = action.payload;
    },

    /** Get List Criteria */
    [getListCriteria.pending]: (state, action) => {
      state.dataListCriteria = action.payload;
      state.loadingPricingAdjust = true;
    },
    [getListCriteria.fulfilled]: (state, action) => {
      state.dataListCriteria = action.payload;
      state.loadingPricingAdjust = false;
    },
    [getListCriteria.rejected]: (state, action) => {
      state.dataListCriteria = action.payload;
      state.loadingPricingAdjust = false;
    },

    // Get Province List
    [getProvinceList.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.data_province = action.payload;
    },
    [getProvinceList.fulfilled]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_province = action.payload;
    },
    [getProvinceList.rejected]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_province = action.payload;
    },

    // Get Province List By Country
    [getProvinceListByCountry.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.data_province = action.payload;
    },
    [getProvinceListByCountry.fulfilled]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_province = action.payload;
    },
    [getProvinceListByCountry.rejected]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_province = action.payload;
    },

    // Get Country List
    [getCountryList.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.data_country = action.payload;
    },
    [getCountryList.fulfilled]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_country = action.payload;
    },
    [getCountryList.rejected]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_country = action.payload;
    },

    // Get City List
    [getCityList.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.data_city = action.payload;
    },
    [getCityList.fulfilled]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_city = action.payload;
    },
    [getCityList.rejected]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_city = action.payload;
    },

    // Get Cost Center List
    [getCostCenterList.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.data_cost_center = action.payload;
    },
    [getCostCenterList.fulfilled]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_cost_center = action.payload;
    },
    [getCostCenterList.rejected]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_cost_center = action.payload;
    },

    // Get Sor List
    [getSorList.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.data_sor = action.payload;
    },
    [getSorList.fulfilled]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_sor = action.payload;
    },
    [getSorList.rejected]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_sor = action.payload;
    },

    // Get District List
    [getDistrictList.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.data_district = action.payload;
    },
    [getDistrictList.fulfilled]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_district = action.payload;
    },
    [getDistrictList.rejected]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_district = action.payload;
    },

    // Get Sub District List
    [getSubDistrictList.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.data_sub_district = action.payload;
    },
    [getSubDistrictList.fulfilled]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_sub_district = action.payload;
    },
    [getSubDistrictList.rejected]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_sub_district = action.payload;
    },

    // Get G sizes List
    [getGsizesList.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.data_Gsizes = action.payload;
    },
    [getGsizesList.fulfilled]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_Gsizes = action.payload;
    },
    [getGsizesList.rejected]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_Gsizes = action.payload;
    },

    // Get Industrial Sector List
    [getIndustrialSectorList.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.data_industrial_sector = action.payload;
    },
    [getIndustrialSectorList.fulfilled]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_industrial_sector = action.payload;
    },
    [getIndustrialSectorList.rejected]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_industrial_sector = action.payload;
    },

    // Get Service Type List
    [getServiceTypeList.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.data_service_type = action.payload;
    },
    [getServiceTypeList.fulfilled]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_service_type = action.payload;
    },
    [getServiceTypeList.rejected]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_service_type = action.payload;
    },

    // Get Account Category List
    [getAccountCategoryList.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.data_account_Category = action.payload;
    },
    [getAccountCategoryList.fulfilled]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_account_Category = action.payload;
    },
    [getAccountCategoryList.rejected]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_account_Category = action.payload;
    },

    // Get Account Group List
    [getAccountGroupList.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.data_account_group = action.payload;
    },
    [getAccountGroupList.fulfilled]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_account_group = action.payload;
    },
    [getAccountGroupList.rejected]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_account_group = action.payload;
    },

    // Get Customer Segment List
    [getCustomerSegmentList.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.data_customerSegment = action.payload;
    },
    [getCustomerSegmentList.fulfilled]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_customerSegment = action.payload;
    },
    [getCustomerSegmentList.rejected]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_customerSegment = action.payload;
    },

    // Get Customer List
    [getCustomerList.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.data_customer = action.payload;
    },
    [getCustomerList.fulfilled]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_customer = action.payload;
    },
    [getCustomerList.rejected]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_customer = action.payload;
    },

    // Get Budget List
    [getBudgetList.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.data_budget = action.payload;
    },
    [getBudgetList.fulfilled]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_budget = action.payload;
    },
    [getBudgetList.rejected]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_budget = action.payload;
    },

    // Get Adjustment Type List
    [getAdjustmentTypeList.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.data_adjustment_type = action.payload;
    },
    [getAdjustmentTypeList.fulfilled]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_adjustment_type = action.payload;
    },
    [getAdjustmentTypeList.rejected]: (state, action) => {
      state.loadingPricingAdjust = false;
      state.data_adjustment_type = action.payload;
    },

    /** Get Detail Pricing General */
    [getDetailPricing.pending]: (state, action) => {
      state.dataDetailPricing = action.payload;
      state.loadingPricingAdjust = true;
    },
    [getDetailPricing.fulfilled]: (state, action) => {
      state.dataDetailPricing = action.payload;
      state.loadingPricingAdjust = false;
    },
    [getDetailPricing.rejected]: (state, action) => {
      state.dataDetailPricing = action.payload;
      state.loadingPricingAdjust = false;
    },
    /** Get List Category */
    [getListCategory.pending]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingPricingAdjust = true;
    },
    [getListCategory.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingPricingAdjust = false;
    },
    [getListCategory.rejected]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingPricingAdjust = false;
    },
    /** Create Pricing */
    [createPriceAdjustBody.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.dataStatus = action.payload;
    },
    [createPriceAdjustBody.fulfilled]: (state, action) => {
      state.dataStatus = action.payload;
      state.loadingPricingAdjust = false;
    },
    [createPriceAdjustBody.rejected]: (state, action) => {
      state.dataStatus = action.payload;
      state.loadingPricingAdjust = false;
    },
    /** Update Pricing */
    [updatePriceAdjustBody.pending]: (state, action) => {
      state.loadingPricingAdjust = true;
      state.dataStatus = action.payload;
    },
    [updatePriceAdjustBody.fulfilled]: (state, action) => {
      state.dataStatus = action.payload;
      state.loadingPricingAdjust = false;
    },
    [updatePriceAdjustBody.rejected]: (state, action) => {
      state.dataStatus = action.payload;
      state.loadingPricingAdjust = false;
    },
    /** Approve/Reject Create Price Adjust */
    [approvalCreatePriceAdjust.pending]: (state) => {
      state.loadingPricingAdjust = true;
    },
    [approvalCreatePriceAdjust.fulfilled]: (state) => {
      state.loadingPricingAdjust = false;
    },
    [approvalCreatePriceAdjust.rejected]: (state) => {
      state.loadingPricingAdjust = false;
    },
    /** Approve/Reject Inactive Price Adjust */
    [approvalInactivePriceAdjust.pending]: (state) => {
      state.loadingPricingAdjust = true;
    },
    [approvalInactivePriceAdjust.fulfilled]: (state) => {
      state.loadingPricingAdjust = false;
    },
    [approvalInactivePriceAdjust.rejected]: (state) => {
      state.loadingPricingAdjust = false;
    },

    //Access
    [getGrantedAccessPriceAdjust.pending]: (state, action) => {
      state.data_grant_access = action.payload;
      state.loading = true;
    },
    [getGrantedAccessPriceAdjust.fulfilled]: (state, action) => {
      state.data_grant_access = action.payload;
      state.loading = false;
    },
    [getGrantedAccessPriceAdjust.rejected]: (state, action) => {
      state.data_grant_access = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = pricingAdjustSlice;
export default reducer;
