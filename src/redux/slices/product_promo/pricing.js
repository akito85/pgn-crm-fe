import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productPromoHttpService from "../../services/productPromoHttpService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../general_slice";

const initialState = {
  dataPricing: {},
  dataDetailPricingGeneral: {},
  dataDetailDraftPricingGeneral: {},
  dataListCurrency: [],
  dataListUom: [],
  dataListCriteria: [],
  dataListCategory: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  data_province: [],
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
  dataStatus: {},
  loadingPricing: false,
  dataListAttachment: {},
  dataListPricingDetail: {},
  dataListCriteriaValue: {},
  dataApprovalHistory: {},
  endDateHistoryList: [],
  priceAdjustListById: [],
  message: "",
  list_pricing: [],
  pagination_pricing: { totalPage: 0, totalElement: 0 },
  loading_listPricing: false,
};

export const getAllPricingPaginate = createAsyncThunk(
  "GET_ALL_PRICING_PAGINATE",
  async ({ page, pageSize, sort, search, filters = [], filterRules = [], isLoadMore = false }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/list-pricing?page=${page}&size=${pageSize}&sort=${
        sort || "createdDate~desc"
      }&searchs=${search}&filters=${encodeURIComponent(JSON.stringify(filters))}&filterRules=${encodeURIComponent(JSON.stringify(filterRules))}`;
      const response = await productPromoHttpService.getPagination(url);
      return { ...response.data, isLoadMore };
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getDetailPricingGeneral = createAsyncThunk(
  "GET_DETAIL_PRICING_GENERAL",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/detail/${id}`;
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

export const getDetailDraftPricingGeneral = createAsyncThunk(
  "GET_DETAIL_DRAFT_PRICING_GENERAL",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/detail-draft/${id}`;
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

export const getListCurrency = createAsyncThunk(
  "GET_LIST_CURRENCY",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/maintain-pricing/list-currency";
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

export const getListCriteria = createAsyncThunk(
  "GET_LIST_CRITERIA",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/maintain-pricing/list-criteria";
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

export const getListUom = createAsyncThunk("GET_LIST_UOM", async (thunkAPI) => {
  try {
    const url = "/v1/dbs/api/maintain-pricing/list-uom";
    const response = await productPromoHttpService.getAll(url);
    return response.data;
  } catch (error) {
    if (error.response.data.code === 419) {
      thunkAPI.dispatch(setBodyError(error));
    }
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getListAppHier = createAsyncThunk(
  "GET_LIST_APP_HIER_PRICING",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/maintain-pricing/list-apphier";
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
  "GET_LIST_APP_HIER_DETAIL_PRICING",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/list-approvalhierarchydtl/${id}`;
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

export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/maintain-pricing/list-category";
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

export const createPricingBody = createAsyncThunk(
  "CREATE_PRICING",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/maintain-pricing/create-pricing";
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
              body.submit ? "created" : "submitted"
            }. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updatePricingBody = createAsyncThunk(
  "UPDATE_PRICING",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/maintain-pricing/update-pricing";
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
              body.submit ? "updated" : "submitted"
            }. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getProvinceList = createAsyncThunk(
  "GET_PROVINCE_LIST_PRICING",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/province`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.data.map((item) => {
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
  "GET_CITY_LIST_PRICING",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/city/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return response.data.data.map((item) => {
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
  "GET_COST_CENTER_LIST_PRICING",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/sor-areanumber?ccType=AREA`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.data.map((item) => {
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
  "GET_SOR_LIST_PRICING",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/sor-areanumber?ccType=SOR`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.data.map((item) => {
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
  "GET_DISTRICT_LIST_PRICING",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/district/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return response.data.data.map((item) => {
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
  "GET_SUB_DISTRICT_LIST_PRICING",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/sub-district/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return response.data.data.map((item) => {
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
  "GET_GSIZE_LIST_PRICING",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/gsizes`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
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
  "GET_INDUSTRIAL_SECTOR_LIST_PRICING",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/industrialsector`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
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
  "GET_SERVICE_TYPE_LIST_PRICING",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/servicetype`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
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
  "GET_ACCOUNT_CATEGORY_LIST_PRICING",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/accountcategory`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
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
  "GET_ACCOUNT_GROUP_LIST_PRICING",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/accountgroup/${id}`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
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
  "GET_BUDGET_LIST_PRICING",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/budgetnumber`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.data.map((item) => {
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
  "GET_CUSTOMER_SEGMENT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/customersegment`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
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
  "GET_CUSTOMER_LIST_CRITERIA",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/getCustomer`;
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

export const getAllAttachmentPaginate = createAsyncThunk(
  "GET_ALL_ATTACHMENT_PAGINATE",
  async ({ id, page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/list-attachment/${id}?page=${page}&size=${pageSize}&sort=${
        sort || "createdDate~desc"
      }&search=${search || ""}`;
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

export const getAllPricingDetailPaginate = createAsyncThunk(
  "GET_ALL_PRICING_DETAIL_PAGINATE",
  async ({ id, page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/list-pricingdetail/${id}?page=${page}&size=${pageSize}&sort=${
        sort || "createdDate~desc"
      }&search=${search || ""}`;
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

export const getAllCriteriaValuesPaginate = createAsyncThunk(
  "GET_ALL_CRITERIA_VALUES_PAGINATE",
  async ({ id, page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/list-criteriavalue/${id}?page=${page}&size=${pageSize}&sort=${
        sort || "createdDate~desc"
      }&search=${search || ""}`;
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

export const inactivePricing = createAsyncThunk(
  "INACTIVE_PRICING",
  async ({ data }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/inactivate-pricing`;
      const response = await productPromoHttpService.updateData(url, data);
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

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_PRICING",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/approvalhistory/${id}`;
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

export const approvalCreatePricing = createAsyncThunk(
  "APPROVAL_CREATE_PRICING",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/approve-pricing`;
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

export const approvalInactivePricing = createAsyncThunk(
  "APPROVAL_INACTIVE_PRICING",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/approve-inactive-pricing`;
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

export const downloadPricing = createAsyncThunk(
  "DOWNLOAD_PRICING",
  async ({ search, page, pageSize, sort, filters = [], filterRules = [] }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/maintain-pricing/download-filter?page=${page}&size=${pageSize}&searchs=${searchParams}&sort=${sortParams}&filters=${encodeURIComponent(JSON.stringify(filters))}&filterRules=${encodeURIComponent(JSON.stringify(filterRules))}`;
      const response = await productPromoHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "DOWNLOAD_PRICING", back: false })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getEndDateHistory = createAsyncThunk(
  "END_DATE_HISTORY_PRICING_DETAIL",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/maintain-pricing/getEndDateHistory/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getPriceAdjustByIdPricingDetail = createAsyncThunk(
  "GET_PRICE_ADJUST_LIST_BY_ID_PRICING_DETAIL",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/price-adjustment/list-pricing-adjustment/${id}`;
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

const pricingSlice = createSlice({
  name: "pricing",
  initialState,
  extraReducers: {
    /** Get Pricing List Paginate */
    [getAllPricingPaginate.pending]: (state, action) => {
      state.loadingPricing = true;
      state.dataPricing = action.payload;
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listPricing = true;
        state.list_pricing = [];
      }
    },
    [getAllPricingPaginate.fulfilled]: (state, action) => {
      state.dataPricing = action.payload;
      state.loadingPricing = false;
      state.loading_listPricing = false;
      const { result, page, isLoadMore } = action.payload || {};
      if (Array.isArray(result)) {
        state.list_pricing = isLoadMore
          ? [...state.list_pricing, ...result]
          : result;
      }
      state.pagination_pricing = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
      };
    },
    [getAllPricingPaginate.rejected]: (state, action) => {
      state.dataPricing = action.payload;
      state.loadingPricing = false;
      state.loading_listPricing = false;
    },
    /** Get Detail Pricing General */
    [getDetailPricingGeneral.pending]: (state, action) => {
      state.loadingPricing = true;
      state.dataDetailPricingGeneral = action.payload;
    },
    [getDetailPricingGeneral.fulfilled]: (state, action) => {
      state.dataDetailPricingGeneral = action.payload;
      state.loadingPricing = false;
    },
    [getDetailPricingGeneral.rejected]: (state, action) => {
      state.dataDetailPricingGeneral = action.payload;
      state.loadingPricing = false;
    },
    /** Get Detail Pricing General */
    [getDetailDraftPricingGeneral.pending]: (state, action) => {
      state.loadingPricing = true;
      state.dataDetailDraftPricingGeneral = action.payload;
    },
    [getDetailDraftPricingGeneral.fulfilled]: (state, action) => {
      state.dataDetailDraftPricingGeneral = action.payload;
      state.loadingPricing = false;
    },
    [getDetailDraftPricingGeneral.rejected]: (state, action) => {
      state.dataDetailDraftPricingGeneral = action.payload;
      state.loadingPricing = false;
    },
    /** Get List Currency */
    [getListCurrency.pending]: (state, action) => {
      state.loadingPricing = true;
      state.dataListCurrency = action.payload;
    },
    [getListCurrency.fulfilled]: (state, action) => {
      state.dataListCurrency = action.payload;
      state.loadingPricing = false;
    },
    [getListCurrency.rejected]: (state, action) => {
      state.dataListCurrency = action.payload;
      state.loadingPricing = false;
    },
    /** Get List Criteria */
    [getListCriteria.pending]: (state, action) => {
      state.loadingPricing = true;
      state.dataListCriteria = action.payload;
    },
    [getListCriteria.fulfilled]: (state, action) => {
      state.dataListCriteria = action.payload;
      state.loadingPricing = false;
    },
    [getListCriteria.rejected]: (state, action) => {
      state.dataListCriteria = action.payload;
      state.loadingPricing = false;
    },
    /** Get List Uom */
    [getListUom.pending]: (state, action) => {
      state.loadingPricing = true;
      state.dataListUom = action.payload;
    },
    [getListUom.fulfilled]: (state, action) => {
      state.dataListUom = action.payload;
      state.loadingPricing = false;
    },
    [getListUom.rejected]: (state, action) => {
      state.dataListUom = action.payload;
      state.loadingPricing = false;
    },
    /** Get List AppHierId */
    [getListAppHier.pending]: (state, action) => {
      state.loadingPricing = true;
      state.dataListAppHierId = action.payload;
    },
    [getListAppHier.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loadingPricing = false;
    },
    [getListAppHier.rejected]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loadingPricing = false;
    },
    /** Get List Category */
    [getListCategory.pending]: (state, action) => {
      state.loadingPricing = true;
      state.dataListCategory = action.payload;
    },
    [getListCategory.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingPricing = false;
    },
    [getListCategory.rejected]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingPricing = false;
    },
    /** Get List AppHierDetail */
    [getListAppHierDetail.pending]: (state, action) => {
      state.loadingPricing = true;
      state.dataListAppHierDetail = action.payload;
    },
    [getListAppHierDetail.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loadingPricing = false;
    },
    [getListAppHierDetail.rejected]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loadingPricing = false;
    },
    /** Create Pricing */
    [createPricingBody.pending]: (state, action) => {
      state.loadingPricing = true;
      state.dataStatus = action.payload;
    },
    [createPricingBody.fulfilled]: (state, action) => {
      state.dataStatus = action.payload;
      state.loadingPricing = false;
    },
    [createPricingBody.rejected]: (state, action) => {
      state.dataStatus = action.payload;
      state.loadingPricing = false;
    },
    /** Update Pricing */
    [updatePricingBody.pending]: (state, action) => {
      state.loadingPricing = true;
      state.dataStatus = action.payload;
    },
    [updatePricingBody.fulfilled]: (state, action) => {
      state.dataStatus = action.payload;
      state.loadingPricing = false;
    },
    [updatePricingBody.rejected]: (state, action) => {
      state.dataStatus = action.payload;
      state.loadingPricing = false;
    },

    // Get Province List
    [getProvinceList.pending]: (state, action) => {
      state.loadingPricing = true;
      state.data_province = action.payload;
    },
    [getProvinceList.fulfilled]: (state, action) => {
      state.loadingPricing = false;
      state.data_province = action.payload;
    },
    [getProvinceList.rejected]: (state, action) => {
      state.loadingPricing = false;
      state.data_province = action.payload;
    },

    // Get City List
    [getCityList.pending]: (state, action) => {
      state.loadingPricing = true;
      state.data_city = action.payload;
    },
    [getCityList.fulfilled]: (state, action) => {
      state.loadingPricing = false;
      state.data_city = action.payload;
    },
    [getCityList.rejected]: (state, action) => {
      state.loadingPricing = false;
      state.data_city = action.payload;
    },

    // Get Cost Center List
    [getCostCenterList.pending]: (state, action) => {
      state.loadingPricing = true;
      state.data_cost_center = action.payload;
    },
    [getCostCenterList.fulfilled]: (state, action) => {
      state.loadingPricing = false;
      state.data_cost_center = action.payload;
    },
    [getCostCenterList.rejected]: (state, action) => {
      state.loadingPricing = false;
      state.data_cost_center = action.payload;
    },

    // Get Sor List
    [getSorList.pending]: (state, action) => {
      state.loadingPricing = true;
      state.data_sor = action.payload;
    },
    [getSorList.fulfilled]: (state, action) => {
      state.loadingPricing = false;
      state.data_sor = action.payload;
    },
    [getSorList.rejected]: (state, action) => {
      state.loadingPricing = false;
      state.data_sor = action.payload;
    },

    // Get District List
    [getDistrictList.pending]: (state, action) => {
      state.loadingPricing = true;
      state.data_district = action.payload;
    },
    [getDistrictList.fulfilled]: (state, action) => {
      state.loadingPricing = false;
      state.data_district = action.payload;
    },
    [getDistrictList.rejected]: (state, action) => {
      state.loadingPricing = false;
      state.data_district = action.payload;
    },

    // Get Sub District List
    [getSubDistrictList.pending]: (state, action) => {
      state.loadingPricing = true;
      state.data_sub_district = action.payload;
    },
    [getSubDistrictList.fulfilled]: (state, action) => {
      state.loadingPricing = false;
      state.data_sub_district = action.payload;
    },
    [getSubDistrictList.rejected]: (state, action) => {
      state.loadingPricing = false;
      state.data_sub_district = action.payload;
    },

    // Get G sizes List
    [getGsizesList.pending]: (state, action) => {
      state.loadingPricing = true;
      state.data_Gsizes = action.payload;
    },
    [getGsizesList.fulfilled]: (state, action) => {
      state.loadingPricing = false;
      state.data_Gsizes = action.payload;
    },
    [getGsizesList.rejected]: (state, action) => {
      state.loadingPricing = false;
      state.data_Gsizes = action.payload;
    },

    // Get Industrial Sector List
    [getIndustrialSectorList.pending]: (state, action) => {
      state.loadingPricing = true;
      state.data_industrial_sector = action.payload;
    },
    [getIndustrialSectorList.fulfilled]: (state, action) => {
      state.loadingPricing = false;
      state.data_industrial_sector = action.payload;
    },
    [getIndustrialSectorList.rejected]: (state, action) => {
      state.loadingPricing = false;
      state.data_industrial_sector = action.payload;
    },

    // Get Service Type List
    [getServiceTypeList.pending]: (state, action) => {
      state.loadingPricing = true;
      state.data_service_type = action.payload;
    },
    [getServiceTypeList.fulfilled]: (state, action) => {
      state.loadingPricing = false;
      state.data_service_type = action.payload;
    },
    [getServiceTypeList.rejected]: (state, action) => {
      state.loadingPricing = false;
      state.data_service_type = action.payload;
    },

    // Get Account Category List
    [getAccountCategoryList.pending]: (state, action) => {
      state.loadingPricing = true;
      state.data_account_Category = action.payload;
    },
    [getAccountCategoryList.fulfilled]: (state, action) => {
      state.loadingPricing = false;
      state.data_account_Category = action.payload;
    },
    [getAccountCategoryList.rejected]: (state, action) => {
      state.loadingPricing = false;
      state.data_account_Category = action.payload;
    },

    // Get Account Group List
    [getAccountGroupList.pending]: (state, action) => {
      state.loadingPricing = true;
      state.data_account_group = action.payload;
    },
    [getAccountGroupList.fulfilled]: (state, action) => {
      state.loadingPricing = false;
      state.data_account_group = action.payload;
    },
    [getAccountGroupList.rejected]: (state, action) => {
      state.loadingPricing = false;
      state.data_account_group = action.payload;
    },

    // Get Customer Segment List
    [getCustomerSegmentList.pending]: (state, action) => {
      state.loadingPricing = true;
      state.data_customerSegment = action.payload;
    },
    [getCustomerSegmentList.fulfilled]: (state, action) => {
      state.loadingPricing = false;
      state.data_customerSegment = action.payload;
    },
    [getCustomerSegmentList.rejected]: (state, action) => {
      state.loadingPricing = false;
      state.data_customerSegment = action.payload;
    },

    // Get Customer Segment List
    [getCustomerList.pending]: (state, action) => {
      state.loadingPricing = true;
      state.data_customer = action.payload;
    },
    [getCustomerList.fulfilled]: (state, action) => {
      state.loadingPricing = false;
      state.data_customer = action.payload;
    },
    [getCustomerList.rejected]: (state, action) => {
      state.loadingPricing = false;
      state.data_customer = action.payload;
    },

    // Get Budget List
    [getBudgetList.pending]: (state, action) => {
      state.loadingPricing = true;
      state.data_budget = action.payload;
    },
    [getBudgetList.fulfilled]: (state, action) => {
      state.loadingPricing = false;
      state.data_budget = action.payload;
    },
    [getBudgetList.rejected]: (state, action) => {
      state.loadingPricing = false;
      state.data_budget = action.payload;
    },
    /** Get All Attachment Paginate */
    [getAllAttachmentPaginate.pending]: (state, action) => {
      state.loadingPricing = true;
      state.dataListAttachment = action.payload;
    },
    [getAllAttachmentPaginate.fulfilled]: (state, action) => {
      state.loadingPricing = false;
      state.dataListAttachment = action.payload;
    },
    [getAllAttachmentPaginate.rejected]: (state, action) => {
      state.loadingPricing = false;
      state.dataListAttachment = action.payload;
    },
    /** Get All Pricing Detail Paginate */
    [getAllPricingDetailPaginate.pending]: (state, action) => {
      state.loadingPricing = true;
      state.dataListPricingDetail = action.payload;
    },
    [getAllPricingDetailPaginate.fulfilled]: (state, action) => {
      state.loadingPricing = false;
      state.dataListPricingDetail = action.payload;
    },
    [getAllPricingDetailPaginate.rejected]: (state, action) => {
      state.loadingPricing = false;
      state.dataListPricingDetail = action.payload;
    },
    /** Get All Criterias Value Paginate */
    [getAllCriteriaValuesPaginate.pending]: (state, action) => {
      state.loadingPricing = true;
      state.dataListCriteriaValue = action.payload;
    },
    [getAllCriteriaValuesPaginate.fulfilled]: (state, action) => {
      state.loadingPricing = false;
      state.dataListCriteriaValue = action.payload;
    },
    [getAllCriteriaValuesPaginate.rejected]: (state, action) => {
      state.loadingPricing = false;
      state.dataListCriteriaValue = action.payload;
    },
    /** Inactive Pricing */
    [inactivePricing.pending]: (state) => {
      state.loadingPricing = true;
    },
    [inactivePricing.fulfilled]: (state) => {
      state.loadingPricing = false;
    },
    [inactivePricing.rejected]: (state) => {
      state.loadingPricing = false;
    },

    /** Get Approval History */
    [getApprovalHistory.pending]: (state, action) => {
      state.loadingPricing = true;
      state.dataApprovalHistory = action.payload;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loadingPricing = false;
    },
    [getApprovalHistory.rejected]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loadingPricing = false;
    },

    /** Download Pricing */
    [downloadPricing.pending]: (state) => {
      state.loadingPricing = true;
    },
    [downloadPricing.fulfilled]: (state) => {
      state.loadingPricing = false;
    },
    [downloadPricing.rejected]: (state) => {
      state.loadingPricing = false;
    },
    /** Get List AppHierId */
    [getEndDateHistory.pending]: (state, action) => {
      state.loadingPricing = true;
      state.endDateHistoryList = action.payload;
    },
    [getEndDateHistory.fulfilled]: (state, action) => {
      state.endDateHistoryList = action.payload;
      state.loadingPricing = false;
    },
    [getEndDateHistory.rejected]: (state, action) => {
      state.endDateHistoryList = action.payload;
      state.loadingPricing = false;
    },
    /** Get List Price Adjust by Id Pricing Detail */
    [getPriceAdjustByIdPricingDetail.pending]: (state, action) => {
      state.loadingPricing = true;
      state.priceAdjustListById = action.payload;
    },
    [getPriceAdjustByIdPricingDetail.fulfilled]: (state, action) => {
      state.priceAdjustListById = action.payload;
      state.loadingPricing = false;
    },
    [getPriceAdjustByIdPricingDetail.rejected]: (state, action) => {
      state.priceAdjustListById = action.payload;
      state.loadingPricing = false;
    },
    /** Approve/Reject Create Pricing */
    [approvalCreatePricing.pending]: (state) => {
      state.loadingPricing = true;
    },
    [approvalCreatePricing.fulfilled]: (state) => {
      state.loadingPricing = false;
    },
    [approvalCreatePricing.rejected]: (state) => {
      state.loadingPricing = false;
    },
    /** Approve/Reject Inactive Pricing */
    [approvalInactivePricing.pending]: (state) => {
      state.loadingPricing = true;
    },
    [approvalInactivePricing.fulfilled]: (state) => {
      state.loadingPricing = false;
    },
    [approvalInactivePricing.rejected]: (state) => {
      state.loadingPricing = false;
    },
  },
});

const { reducer } = pricingSlice;
export default reducer;
