import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productPromoHttpService from "../../../services/productPromoHttpService";
import {
  setBodyError,
  showModalError,
  validateError,
} from "../../general_slice";
import { showModalSuccess } from "../../general_slice";

const initialState = {
  data: [],
  data_detail: [],
  data_detail_draft: [],
  data_attachment: [],
  data_header: [],
  data_approval: [],
  data_approval_list: [],
  data_criteria_list: [],
  data_select_criteria: [],
  data_price_code: [],
  dataListCategory: [],
  data_approval_history: [],
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
  data_budget: [],
  data_customerSegment: [],
  data_customer: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
  message: "",
  list_pricingRule: [],
  pagination_pricingRule: { totalPage: 0, totalElement: 0 },
  loading_listPricingRule: false,
  latestListReqId_pricingRule: null,
};

export const getAllPricingRulePaginate = createAsyncThunk(
  "GET_ALL_PRICING_RULE_PAGINATE",
  async ({ page, pageSize, sort, search, searchText, filters = [], filterRules = [], isLoadMore = false }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/list-pricing-rule`;
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

export const getHeaderPricingRule = createAsyncThunk(
  "GET_HEADER_PRICING_RULE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/view/header/${id}`;
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

export const getDetailPricingRule = createAsyncThunk(
  "GET_DETAIL_DRAFT_PRICING_RULE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/detail-draft/${id}`;
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

export const getDetailPricingRulePaginate = createAsyncThunk(
  "GET_DETAIL_PRICING_RULE_PAGINATE",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/pricingRule/view/detail/paging/${id}?search${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
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

export const getAttachmentListDetailPricingRule = createAsyncThunk(
  "GET_ATTACHMENT_LIST_DETAIL_PRICING_RULE",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/pricingRule/getAttachmentList/${id}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
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

export const approveOrRejectPricingRule = createAsyncThunk(
  "APPROVE_OR_REJECT_PRICING_RULE",
  async ({ body, responseSuccess }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/pricingRule/approve-pricing-rule";
      const response = await productPromoHttpService.activationWithRemark(
        url,
        body
      );
      thunkAPI.dispatch(showModalSuccess(responseSuccess));
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

export const approveOrRejectInactivePricingRule = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_PRICING_RULE",
  async ({ body, responseSuccess }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/pricingRule/approve-inactive-pricing-rule";
      const response = await productPromoHttpService.activationWithRemark(
        url,
        body
      );
      thunkAPI.dispatch(showModalSuccess(responseSuccess));
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

export const getListAppHier = createAsyncThunk(
  "GET_LIST_APP_HIER_PRICING_RULE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/pricingRule/getApprovalHierList";
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
  "GET_LIST_APP_HIER_DETAIL_PRICING_RULE",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getApprovalHierDetailById/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAllApprovalList = createAsyncThunk(
  "GET_ALL_APPROVAL_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getApprovalHierList`;
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

export const getListApprovalById = createAsyncThunk(
  "GET_LIST_APPROVAL_BY_ID",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getApprovalHierDetailById/${id}`;
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

export const getListCriteriaDetail = createAsyncThunk(
  "GET_LIST_CRITERIA_DETAIL",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/pricingRule/getCriteriaData/${id}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
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

export const getSelectCriteria = createAsyncThunk(
  "GET_SELECT_CRITERIA_PRICING_RULE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getCriteriaList`;
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

export const getListPriceCode = createAsyncThunk(
  "GET_LIST_PRICE_CODE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getListPriceCode`;
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

export const inactivePricingRule = createAsyncThunk(
  "INACTIVE_PRICING_RULE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/inactivate`;
      const response = await productPromoHttpService.activationWithRemark(
        url,
        body
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

export const getSelectCategory = createAsyncThunk(
  "GET_SELECT_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getAttachmentCategory`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => ({
        glbTypeValId: item.Id,
        name: item.text,
      }));
    } catch (error) {
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const createPricingRule = createAsyncThunk(
  "CREATE_PRICING_RULE",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/pricingRule/create";
      const response = await productPromoHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.flag === 1 ? "created" : "submitted"
        }.`,
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
              body.flag === 1 ? "created" : "submitted"
            }. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updatePricingRule = createAsyncThunk(
  "UPDATE_PRICING_RULE",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/pricingRule/update";
      const response = await productPromoHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.flag === 1 ? "updated" : "submitted"
        }.`,
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
              body.flag === 1 ? "updated" : "submitted"
            }. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getApprovalHistoryById/${id}`;
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

export const getProvinceList = createAsyncThunk(
  "GET_PROVINCE_LIST_PRICING_RULE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getProvince`;
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

export const getCountryList = createAsyncThunk(
  "GET_COUNTRY_LIST_PRICING_RULE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getCountry`;
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

export const getProvinceListByCountry = createAsyncThunk(
  "GET_PROVINCE_LIST_BY_COUNTRY_PRICING_RULE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getProvinceByCountry/${id}`;
      const response = await productPromoHttpService.getDetail(url);
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

export const getCityList = createAsyncThunk(
  "GET_CITY_LIST_PRICING_RULE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getCity/${id}`;
      const response = await productPromoHttpService.getDetail(url);
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

export const getCostCenterList = createAsyncThunk(
  "GET_COST_CENTER_LIST_PRICING_RULE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getArea`;
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

export const getSorList = createAsyncThunk(
  "GET_SOR_LIST_PRICING_RULE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getSor`;
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

export const getDistrictList = createAsyncThunk(
  "GET_DISTRICT_LIST_PRICING_RULE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getDistrict/${id}`;
      const response = await productPromoHttpService.getDetail(url);
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
  "GET_SUB_DISTRICT_LIST_PRICING_RULE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getSubDistrict/${id}`;
      const response = await productPromoHttpService.getDetail(url);
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
  "GET_GSIZE_LIST_PRICING_RULE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getGsizes`;
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

export const getIndustrialSectorList = createAsyncThunk(
  "GET_INDUSTRIAL_SECTOR_LIST_PRICING_RULE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getIndustrialSector`;
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
  "GET_SERVICE_TYPE_LIST_PRICING_RULE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getAccountClass`;
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

export const getAccountCategoryList = createAsyncThunk(
  "GET_ACCOUNT_CATEGORY_LIST_PRICING_RULE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getAccountCategory`;
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
  "GET_ACCOUNT_GROUP_LIST_PRICING_RULE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getAccountGroup/${id}`;
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
  "GET_BUDGET_LIST_PRICING_RULE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getBudget`;
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
  "GET_CUSTOMER_SEGMENT_LIST_PRICING_RULE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getCustomerSegment`;
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
  "GET_CUSTOMER_LIST_PRICING_RULE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/getCustomer`;
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

export const downloadPricingRule = createAsyncThunk(
  "DOWNLOAD_PRICING_RULE",
  async ({ page, pageSize, sort, search, searchText, filters = [], filterRules = [] }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/pricingRule/downloadFilter`;
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
        validateError({ error, action: "DOWNLOAD_PRICING_RULE", back: false })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

const pricingRuleSlice = createSlice({
  name: "pricingRule",
  initialState,
  extraReducers: {
    // Get All Pricing Rule Pagination
    [getAllPricingRulePaginate.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data = action.payload;
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listPricingRule = true;
        state.list_pricingRule = [];
        state.latestListReqId_pricingRule = action.meta.requestId;
      }
    },
    [getAllPricingRulePaginate.fulfilled]: (state, action) => {
      const { result, page, isLoadMore } = action.payload || {};
      // Drop stale replace responses (out-of-order race when filters/search
      // change quickly); only the most recent request owns the list.
      if (
        !isLoadMore &&
        action.meta.requestId !== state.latestListReqId_pricingRule
      )
        return;
      state.isFailed = false;
      state.isSuccess = false;
      state.data = action.payload;
      state.loading = false;
      state.loading_listPricingRule = false;
      if (Array.isArray(result)) {
        if (isLoadMore) {
          const existingIds = new Set(
            state.list_pricingRule.map((it) => it.id)
          );
          state.list_pricingRule = [
            ...state.list_pricingRule,
            ...result.filter((it) => !existingIds.has(it.id)),
          ];
        } else {
          state.list_pricingRule = result;
        }
      }
      state.pagination_pricingRule = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
      };
    },
    [getAllPricingRulePaginate.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.loading_listPricingRule = false;
    },

    // Get Header Pricing Rule
    [getHeaderPricingRule.pending]: (state, action) => {
      state.loading = true;
      state.data_header = action.payload;
    },
    [getHeaderPricingRule.fulfilled]: (state, action) => {
      state.data_header = action.payload;
      state.loading = false;
    },
    [getHeaderPricingRule.rejected]: (state, action) => {
      state.data_header = action.payload;
      state.loading = false;
    },

    // Get Detail Pricing Rule
    [getDetailPricingRule.pending]: (state, action) => {
      state.loading = true;
      state.data_detail_draft = action.payload;
    },
    [getDetailPricingRule.fulfilled]: (state, action) => {
      state.data_detail_draft = action.payload;
      state.loading = false;
    },
    [getDetailPricingRule.rejected]: (state, action) => {
      state.data_detail_draft = action.payload;
      state.loading = false;
    },

    // Get Detail Pricing Rule Pagination
    [getDetailPricingRulePaginate.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_detail = action.payload;
    },
    [getDetailPricingRulePaginate.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailPricingRulePaginate.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },

    // Get Attachment List Detail Pricing Rule
    [getAttachmentListDetailPricingRule.pending]: (state, action) => {
      state.loading = true;
      state.data_attachment = action.payload;
    },
    [getAttachmentListDetailPricingRule.fulfilled]: (state, action) => {
      state.data_attachment = action.payload;
      state.isSuccess = true;
      state.loading = false;
    },
    [getAttachmentListDetailPricingRule.rejected]: (state, action) => {
      state.data_attachment = action.payload;
      state.isFailed = true;
      state.loading = false;
    },

    // Approve Or Reject Pricing Rule
    [approveOrRejectPricingRule.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectPricingRule.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveOrRejectPricingRule.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    // Approve Or Reject Pricing Rule
    [approveOrRejectInactivePricingRule.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectInactivePricingRule.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveOrRejectInactivePricingRule.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    // Get Approve Hierarchy List
    [getAllApprovalList.pending]: (state, action) => {
      state.loading = true;
      state.data_approval = action.payload;
    },
    [getAllApprovalList.fulfilled]: (state, action) => {
      state.data_approval = action.payload;
      state.loading = false;
    },
    [getAllApprovalList.rejected]: (state, action) => {
      state.data_approval = action.payload;
      state.loading = false;
    },

    // Get List Approval By Id
    [getListApprovalById.pending]: (state, action) => {
      state.loading = true;
      state.data_approval_list = action.payload;
    },
    [getListApprovalById.fulfilled]: (state, action) => {
      state.data_approval_list = action.payload;
      state.loading = false;
    },
    [getListApprovalById.rejected]: (state, action) => {
      state.data_approval_list = action.payload;
      state.loading = false;
    },

    // Get Data List Criteria Pagination
    [getListCriteriaDetail.pending]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
      state.data_criteria_list = action.payload;
    },
    [getListCriteriaDetail.fulfilled]: (state, action) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.data_criteria_list = action.payload;
      state.loading = false;
    },
    [getListCriteriaDetail.rejected]: (state, action) => {
      state.data_criteria_list = action.payload;
      state.loading = false;
    },

    // Get Select Criteria
    [getSelectCriteria.pending]: (state, action) => {
      state.loading = true;
      state.data_select_criteria = action.payload;
    },
    [getSelectCriteria.fulfilled]: (state, action) => {
      state.data_select_criteria = action.payload;
      state.loading = false;
    },
    [getSelectCriteria.rejected]: (state, action) => {
      state.data_select_criteria = action.payload;
      state.loading = false;
    },

    // Get List Price Code
    [getListPriceCode.pending]: (state, action) => {
      state.loading = true;
      state.data_price_code = action.payload;
    },
    [getListPriceCode.fulfilled]: (state, action) => {
      state.data_price_code = action.payload;
      state.loading = false;
    },
    [getListPriceCode.rejected]: (state, action) => {
      state.data_price_code = action.payload;
      state.loading = false;
    },

    // Inactive Pricing Rule
    [inactivePricingRule.pending]: (state) => {
      state.loading = true;
    },
    [inactivePricingRule.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactivePricingRule.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    // Get Select Category
    [getSelectCategory.pending]: (state, action) => {
      state.loading = true;
      state.dataListCategory = action.payload;
    },
    [getSelectCategory.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },
    [getSelectCategory.rejected]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },

    // Create Pricing Rule
    [createPricingRule.pending]: (state) => {
      state.loading = true;
    },
    [createPricingRule.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
      state.data = action.payload;
    },
    [createPricingRule.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    // Update Pricing Rule
    [updatePricingRule.pending]: (state) => {
      state.loading = true;
    },
    [updatePricingRule.fulfilled]: (state, action) => {
      state.isSuccess = true;
      state.loading = false;
      state.data = action.payload;
    },
    [updatePricingRule.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    // Get Approval History
    [getApprovalHistory.pending]: (state, action) => {
      state.loading = true;
      state.data_approval_history = action.payload;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.data_approval_history = action.payload;
      state.loading = false;
    },
    [getApprovalHistory.rejected]: (state, action) => {
      state.data_approval_history = action.payload;
      state.loading = false;
    },

    // Get Province List
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

    // Get Province List By Country
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

    // Get Country List
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

    // Get City List
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

    // Get Cost Center List
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

    // Get Sor List
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

    // Get District List
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

    // Get Sub District List
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

    // Get G sizes List
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

    // Get Industrial Sector List
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

    // Get Service Type List
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

    // Get Account Category List
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

    // Get Account Group List
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

    // Get Budget List
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

    // Get Customer Segment
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

    // Get Customer
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

    // Download Pricing Rule
    [downloadPricingRule.pending]: (state) => {
      state.loading = true;
    },
    [downloadPricingRule.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadPricingRule.rejected]: (state) => {
      state.loading = false;
    },

    /** Get List AppHierId */
    [getListAppHier.pending]: (state, action) => {
      state.loading = true;
      state.dataListAppHierId = action.payload;
    },
    [getListAppHier.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    [getListAppHier.rejected]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    /** Get List AppHierDetail */
    [getListAppHierDetail.pending]: (state, action) => {
      state.loading = true;
      state.dataListAppHierDetail = action.payload;
    },
    [getListAppHierDetail.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },
    [getListAppHierDetail.rejected]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = pricingRuleSlice;
export default reducer;
