import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productPromoHttpService from "../../services/productPromoHttpService";
import {
  grantedAccessDetail,
  showModalError,
  showModalSuccess,
  validateError,
} from "../general_slice";

const initialState = {
  dataProduct: {},
  dataStatus: {},
  loadingProduct: false,
  list_product: [],
  pagination_product: { totalPage: 0, totalElement: 0 },
  loading_listProduct: false,
  latestListReqId_product: null,
  dataListProductType: [],
  dataListProductClass: [],
  dataListServiceType: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataListAppHierIdForm: [],
  dataListAppHierDetailForm: [],
  dataListCategory: [],
  dataListPaymentType: [],
  dataListChargeMethod: [],
  dataListName: [],
  dataListNameProductDetail: [],
  dataListNameCalculationRule: [],
  dataListUnit: [],
  dataListUnitTos: [],
  dataListFromItem: [],
  dataListCalculationType: [],
  dataListSelectCriteria: [],
  // dataCriteriaProvince: [],
  // dataCriteriaCity: [],
  // dataCriteriaCostCenter: [],
  // dataCriteriaSor: [],
  // dataCriteriaDistrict: [],
  // dataCriteriaSubDistrict: [],
  // dataCriteriaGsizes: [],
  // dataCriteriaIndustrialSector: [],
  // dataCriteriaServiceType: [],
  // dataCriteriaAccountCategory: [],
  // dataCriteriaAccountGroup: [],
  // dataCriteriaBudget: [],
  // dataCriteriaCustomerSegment: [],
  // dataCriteriaCustomer: [],
  dataListPricingRule: [],
  dataListPriceCode: [],
  dataListTos: [],
  dataPricingRuleDetail: {},
  dataPricingAdjustment: {},
  dataListTosAttribute: [],
  dataListDiscountType: [],
  dataActiveProduct: [],
  dataApprovalHistoryProduct: {},
  dataApprovalHistoryProductVersion: {},
  dataDetailProduct: {},
  dataDetailProductVersion: {},
  dataListLockHistory: [],
  dataListExtendTerminateHistory: [],
  dataListProductVersion: [],
  dataListPricingDetail: [],
  dataGlobalPropAttachment: {},
  message: "",
  data_grant_access: {},
  data_budget: [],
  data_province: [],
  data_country: [],
  data_city: [],
  data_industrial_sector: [],
  data_district: [],
  data_sub_district: [],
  data_account_Category: [],
  data_service_type: [],
  data_account_group: [],
  data_sor: [],
  data_cost_center: [],
  data_Gsizes: [],
  data_customerSegment: [],
  data_customer: [],
};

export const getGrantedAccessProduct = createAsyncThunk(
  "CHECK_GRANTED_PRODUCT",
  async (body, thunkAPI) => {
    try {
      const data = await productPromoHttpService.checkGrantedAccessProduct(
        body
      );
      thunkAPI.dispatch(grantedAccessDetail(body?.body));
      return data?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "CHECK_GRANTED_PRODUCT" })
      );
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getGlobalPropertiesAttachment = createAsyncThunk(
  "GET_GLOBAL_PROPERTIES_ATTACHMENT",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/config-file";
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAllProductPaginate = createAsyncThunk(
  "GET_ALL_PRODUCT_PAGINATE",
  async ({ page, pageSize, sort, search, searchText, filters = [], filterRules = [], isLoadMore = false }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/list-product`;
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
      console.log(error, " = error slice");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAllProductActivePaginate = createAsyncThunk(
  "GET_ALL_PRODUCT_ACTIVE_PAGINATE",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getListProductActive${
        id ? `/${id}` : ""
      }`;
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getListProductType = createAsyncThunk(
  "GET_LIST_PRODUCT_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getProductType`;
      const response = await productPromoHttpService.getAll(url);
      return (response?.data || []).map((item) => ({
        label: item.text,
        value: item.id,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getListProductClass = createAsyncThunk(
  "GET_LIST_PRODUCT_CLASS",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getProductClass`;
      const response = await productPromoHttpService.getAll(url);
      return (response?.data || []).map((item) => ({
        label: item.name,
        value: item.productClassId,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getListServiceType = createAsyncThunk(
  "GET_LIST_SERVICE_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getServiceType`;
      const response = await productPromoHttpService.getAll(url);
      return (response?.data || []).map((item) => ({
        label: item.text,
        value: item.id,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getListAppHier = createAsyncThunk(
  "GET_LIST_APP_HIER",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/product/getApprovalHierList";
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getListAppHierInactive = createAsyncThunk(
  "GET_LIST_APP_HIER_INACTIVE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/product/getApprovalHierList";
      const response = await productPromoHttpService.getAll(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getListAppHierDetail = createAsyncThunk(
  "GET_LIST_APP_HIER_DETAIL",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getApprovalHierDetailById/${id}`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getListAppHierDetailInactive = createAsyncThunk(
  "GET_LIST_APP_HIER_DETAIL_INACTIVE",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getApprovalHierDetailById/${id}`;
      const response = await productPromoHttpService.getAll(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/product/getAttachmentCategory";
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => ({
        glbTypeValId: item.Id,
        name: item.text,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getListPaymentType = createAsyncThunk(
  "GET_LIST_PAYMENT_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getPaymentType`;
      const response = await productPromoHttpService.getAll(url);
      return (response?.data || []).map((item) => ({
        label: item.text,
        value: item.id,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getListChargingMethod = createAsyncThunk(
  "GET_LIST_CHARGE_METHOD",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getChargingType`;
      const response = await productPromoHttpService.getAll(url);
      return (response?.data || []).map((item) => ({
        label: item.text,
        value: item.id,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getListCalculationType = createAsyncThunk(
  "GET_LIST_CALCULATION_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getCalculationType`;
      const response = await productPromoHttpService.getAll(url);
      return (response?.data || []).map((item) => ({
        label: item.text,
        value: item.id,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getSelectCriteria = createAsyncThunk(
  "GET_SELECT_CRITERIA",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getCriteriaSelectList`;
      const response = await productPromoHttpService.getAll(url);
      return (response?.data || []).map((item) => ({
        label: item.text,
        value: item.id,
        code: item?.code,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/** Get List Criteria */
export const getProvinceList = createAsyncThunk(
  "GET_PROVINCE_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getProvince`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getProvinceListByCountry = createAsyncThunk(
  "GET_PROVINCE_LIST_BY_COUNTRY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getProvinceByCountry/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getCountryList = createAsyncThunk(
  "GET_COUNTRY_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getCountry`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getCityList = createAsyncThunk(
  "GET_CITY_LIST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getCity/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getCostCenterList = createAsyncThunk(
  "GET_COST_CENTER_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getArea`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
          label: item.name,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getSorList = createAsyncThunk("GET_SOR_LIST", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/product/getSor`;
    const response = await productPromoHttpService.getAll(url);
    return (response.data || []).map((item) => {
      return {
        value: item.Id,
        label: item.name,
      };
    });
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response);
  }
});

export const getDistrictList = createAsyncThunk(
  "GET_DISTRICT_LIST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getDistrict/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getSubDistrictList = createAsyncThunk(
  "GET_SUB_DISTRICT_LIST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getSubDistrict/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getGsizesList = createAsyncThunk(
  "GET_GSIZE_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getGsizes`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getIndustrialSectorList = createAsyncThunk(
  "GET_INDUSTRIAL_SECTOR_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getIndustrialSector`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getCustomerSegment = createAsyncThunk(
  "GET_CUSTOMER_SEGMENT_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getCustomerSegment`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getServiceTypeList = createAsyncThunk(
  "GET_SERVICE_TYPE_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getAccountClass`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getAccountCategoryList = createAsyncThunk(
  "GET_ACCOUNT_CATEGORY_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getAccountCategory`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getAccountGroupList = createAsyncThunk(
  "GET_ACCOUNT_GROUP_LIST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getAccountGroup/${id}`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getBudgetList = createAsyncThunk(
  "GET_BUDGET_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getBudget`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getCustomerList = createAsyncThunk(
  "GET_CUSTOMER_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getCustomer`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
          label: item.name,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getPricingRuleList = createAsyncThunk(
  "GET_PRICING_RULE_LIST",
  async (tasCriteria, thunkAPI) => {
    try {
      const param = {
        tasCrit: tasCriteria,
      };
      const url = `/v1/dbs/api/product/getPricingRuleList`;
      const response = await productPromoHttpService.updateDataWithMethodPost(
        url,
        param
      );
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getPriceCodeList = createAsyncThunk(
  "GET_PRICE_CODE_LIST",
  async (tasCriteria, thunkAPI) => {
    try {
      const param = {
        tasCrit: tasCriteria,
      };
      const url = `/v1/dbs/api/product/getPricingHeaderList`;
      const response = await productPromoHttpService.updateDataWithMethodPost(
        url,
        param
      );
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getTosList = createAsyncThunk(
  "GET_TOS_LIST",
  async (tasCriteria, thunkAPI) => {
    try {
      const param = {
        tasCrit: tasCriteria,
      };
      const url = `/v1/dbs/api/product/getTermOfServiceList`;
      const response = await productPromoHttpService.updateDataWithMethodPost(
        url,
        param
      );
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getListName = createAsyncThunk(
  "GET_NAME_COLUMN_LIST",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getAllGlobalTypeDetailById/${id}`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => ({
        ...item,
        value: item.Id,
        label: item.text,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getListNameProductDetail = createAsyncThunk(
  "GET_NAME_COLUMN_LIST_PRODUCT_DETAIL",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getProductDetailNameList`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => ({
        ...item,
        value: item.id,
        label: item.text,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getListNameCalculationRule = createAsyncThunk(
  "GET_NAME_COLUMN_LIST_CALCULATION_RULE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getCalculationRuleNameList`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => ({
        ...item,
        value: item.id,
        label: item.text,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getListUnit = createAsyncThunk(
  "GET_UNIT_COLUMN_LIST",
  async ({ id }, thunkAPI) => {
    try {
      if (id === null) {
        return [];
      } else {
        const url = `/v1/dbs/api/product/getAllGlobalTypeDetailById/${id}`;
        const response = await productPromoHttpService.getAll(url);
        return (response.data || []).map((item) => ({
          ...item,
          value: item.Id,
          label: item.text,
        }));
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getListUnitVAT = createAsyncThunk(
  "GET_UNIT_VAT_COLUMN_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getVat`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => ({
        ...item,
        value: item.id,
        label: item.text,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getListUnitWithHoldTax = createAsyncThunk(
  "GET_UNIT_HOLD_TAX_COLUMN_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getWithholdingTax`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => ({
        ...item,
        value: item.id,
        label: item.text,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getListUnitTOS = createAsyncThunk(
  "GET_UNIT_COLUMN_LIST_TOS",
  async ({ id }, thunkAPI) => {
    try {
      if (id === 0) {
        return [];
      }
      const url = `/v1/dbs/api/product/getUnitList`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => ({
        ...item,
        value: item.id,
        label: item.text,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getListFromItemTos = createAsyncThunk(
  "GET_FROM_ITEM_LIST_TOS",
  async ({ id }, thunkAPI) => {
    try {
      if (id === 0) {
        return [];
      }
      const url = `/v1/dbs/api/product/getFromItemList`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => ({
        ...item,
        value: item.id,
        label: item.text,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getPricingRuleDetail = createAsyncThunk(
  "GET_ALL_PRICING_RULE_DETAIL",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getListPricingRuleDetail/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getPricingAdjustment = createAsyncThunk(
  "GET_ALL_PRICING_ADJUSTMENT_DETAIL",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getPricingAdjustmentListByDtlPricingId/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAttributeTos = createAsyncThunk(
  "GET_ATTRIBUTE_TOS_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/get-tos-attribute`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => ({
        ...item,
        value: item.Id,
        label: item.text,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDiscountType = createAsyncThunk(
  "GET_ATTRIBUTE_DISCOUNT_TYPE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getDiscountType`;
      const response = await productPromoHttpService.getAll(url);
      return (response.data || []).map((item) => ({
        ...item,
        value: item.id,
        label: item.text,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const downloadProduct = createAsyncThunk(
  "DOWNLOAD_PRODUCT",
  async ({ page, pageSize, sort, search, searchText, filters = [], filterRules = [] }, thunkAPI) => {
    try {
      const url = '/v1/dbs/api/product/downloadFilter';
      const body = {
        page,
        size: pageSize,
        sort: sort || "createdDate~desc",
        search: searchText || null,
        searchs: search || {},
        filters,
        filterRules,
      }
      const response = await productPromoHttpService.downloadDataPost(url, body);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "DOWNLOAD_PRODUCT", back: false })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const lockProduct = createAsyncThunk(
  "LOCK_PRODUCT",
  async ({ data }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/lockProduct`;
      const response = await productPromoHttpService.activationWithRemark(
        url,
        data
      );
      const successBody = {
        title: "Successful",
        description: `Your data has been ${
          data.lockType === "LOCK" ? "locked" : "unlocked"
        }.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${
            data.lockType === "LOCK" ? "locked" : "unlocked"
          }. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const inactiveProduct = createAsyncThunk(
  "INACTIVE_PRODUCT",
  async ({ data }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/inactiveProduct`;
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
        error?.response?.data?.message || error.message || error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not submitted. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getApprovalHistoryProduct = createAsyncThunk(
  "GET_APPROVAL_HISTORY_PRODUCT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getApprovalHistoryProductById/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getApprovalHistoryProductVersion = createAsyncThunk(
  "GET_APPROVAL_HISTORY_PRODUCT_VERSION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getApprovalHistoryProductVersionById/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const createProductBody = createAsyncThunk(
  "CREATE_PRODUCT",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/product/create";
      const response = await productPromoHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.save === "DRAFT" ? "created" : "submitted"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${
            body.save === "DRAFT" ? "created" : "submitted"
          }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateProductBody = createAsyncThunk(
  "UPDATE_PRODUCT",
  async ({ body, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/update-product/${id}`;
      const response = await productPromoHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.save === "DRAFT" ? "updated" : "submitted"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${
            body.save === "DRAFT" ? "updated" : "submitted"
          }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createProductVersionBody = createAsyncThunk(
  "CREATE_PRODUCT_VERSION",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/product/create-product-version";
      const response = await productPromoHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.save === "DRAFT" ? "created" : "submitted"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${
            body.save === "DRAFT" ? "created" : "submitted"
          }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateProductVersionBody = createAsyncThunk(
  "UPDATE_PRODUCT_VERSION",
  async ({ body, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/update-product-version/${id}`;
      const response = await productPromoHttpService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.save === "DRAFT" ? "updated" : "submitted"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${
            body.save === "DRAFT" ? "updated" : "submitted"
          }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getDetailProduct = createAsyncThunk(
  "GET_DETAIL_PRODUCT",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getProductInformation/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getDetailProductVersion = createAsyncThunk(
  "GET_DETAIL_PRODUCT_VERSION",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getProductVersionInformation/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getLockHistory = createAsyncThunk(
  "GET_LOCK_HISTORY",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/lockHistory/${id}`;
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getExtendTerminateHistory = createAsyncThunk(
  "GET_EXTEND_TERMINATE_HISTORY",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getExtendTerminateHistory/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getProductVersionList = createAsyncThunk(
  "GET_PRODUCT_VERSION_LIST",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/listVersion/${id}`;
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getPricingDetailList = createAsyncThunk(
  "GET_PRICING_DETAIL_LIST_PRODUCT",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getPriceCodeDetailList/${id}`;
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const releaseProduct = createAsyncThunk(
  "RELEASE_PRODUCT",
  async ({ data }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/release-product`;
      const response = await productPromoHttpService.activationWithRemark(
        url,
        data
      );
      const successBody = {
        title: "Successful",
        description: "Your data has been released.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not released. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const extendProductVersion = createAsyncThunk(
  "EXTEND_PRODUCT_VERSION",
  async ({ data }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/extend-product`;
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
        error?.response?.data?.message || error.message || error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not submitted. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const terminateProductVersion = createAsyncThunk(
  "TERMINATE_PRODUCT_VERSION",
  async ({ data }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/terminate-product`;
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
        error?.response?.data?.message || error?.message || error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not submitted. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const approvalInactiveProduct = createAsyncThunk(
  "APPROVAL_INACTIVE_PRODUCT",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/approval-inactive-product`;
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
        error?.response?.data?.message || error?.message || error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${
            body.action === "APPROVE" ? "approved" : "rejected"
          }. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const approvalProductVersion = createAsyncThunk(
  "APPROVAL_PRODUCT_VERSION",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/approval-product-version`;
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
        error?.response?.data?.message || error?.message || error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${
            body.action === "APPROVE" ? "approved" : "rejected"
          }. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const approvalExtendProductVersion = createAsyncThunk(
  "APPROVAL_EXTEND_PRODUCT_VERSION",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/approval-extend-product`;
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
        error?.response?.data?.message || error?.message || error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${
            body.action === "APPROVE" ? "approved" : "rejected"
          }. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const approvalTerminateProductVersion = createAsyncThunk(
  "APPROVAL_TERMINATE_PRODUCT_VERSION",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/approval-terminate-product`;
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
        error?.response?.data?.message || error?.message || error.toString();
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${
            body.action === "APPROVE" ? "approved" : "rejected"
          }. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  extraReducers: {
    /** Attribute Global Properties for Attachment */
    [getGlobalPropertiesAttachment.pending]: (state, action) => {
      state.loadingProduct = true;
      state.dataGlobalPropAttachment = action.payload;
    },
    [getGlobalPropertiesAttachment.fulfilled]: (state, action) => {
      state.dataGlobalPropAttachment = action.payload;
      state.loadingProduct = false;
    },
    [getGlobalPropertiesAttachment.rejected]: (state, action) => {
      state.dataGlobalPropAttachment = action.payload;
      state.loadingProduct = false;
    },
    /** List Product Pagination */
    [getAllProductPaginate.pending]: (state, action) => {
      state.loadingProduct = true;
      state.dataProduct = action.payload;
      if (!action.meta.arg?.isLoadMore) {
        state.loading_listProduct = true;
        state.list_product = [];
        state.latestListReqId_product = action.meta.requestId;
      }
    },
    [getAllProductPaginate.fulfilled]: (state, action) => {
      const { result, page, isLoadMore } = action.payload || {};
      // Drop stale replace responses (out-of-order race when filters/search
      // change quickly); only the most recent request owns the list.
      if (!isLoadMore && action.meta.requestId !== state.latestListReqId_product)
        return;
      state.dataProduct = action.payload;
      state.loadingProduct = false;
      state.loading_listProduct = false;
      if (Array.isArray(result)) {
        if (isLoadMore) {
          const existingIds = new Set(state.list_product.map((it) => it.id));
          state.list_product = [
            ...state.list_product,
            ...result.filter((it) => !existingIds.has(it.id)),
          ];
        } else {
          state.list_product = result;
        }
      }
      state.pagination_product = {
        totalPage: page?.totalPages || 0,
        totalElement: page?.totalElements || 0,
      };
    },
    [getAllProductPaginate.rejected]: (state, action) => {
      state.dataProduct = action.payload;
      state.loadingProduct = false;
      state.loading_listProduct = false;
    },
    /** List Product Pagination */
    [getAllProductActivePaginate.pending]: (state, action) => {
      state.loadingProduct = true;
      state.dataActiveProduct = action.payload;
    },
    [getAllProductActivePaginate.fulfilled]: (state, action) => {
      state.dataActiveProduct = action.payload;
      state.loadingProduct = false;
    },
    [getAllProductActivePaginate.rejected]: (state, action) => {
      state.dataActiveProduct = action.payload;
      state.loadingProduct = false;
    },
    /** List Product Type */
    [getListProductType.pending]: (state, action) => {
      state.dataListProductType = action.payload;
      state.loadingProduct = true;
    },
    [getListProductType.fulfilled]: (state, action) => {
      state.dataListProductType = action.payload;
      state.loadingProduct = false;
    },
    [getListProductType.rejected]: (state, action) => {
      state.dataListProductType = action.payload;
      state.loadingProduct = false;
    },
    /** List Product Class */
    [getListProductClass.pending]: (state, action) => {
      state.dataListProductClass = action.payload;
      state.loadingProduct = true;
    },
    [getListProductClass.fulfilled]: (state, action) => {
      state.dataListProductClass = action.payload;
      state.loadingProduct = false;
    },
    [getListProductClass.rejected]: (state, action) => {
      state.dataListProductClass = action.payload;
      state.loadingProduct = false;
    },
    /** List Service Type */
    [getListServiceType.pending]: (state, action) => {
      state.dataListServiceType = action.payload;
      state.loadingProduct = true;
    },
    [getListServiceType.fulfilled]: (state, action) => {
      state.dataListServiceType = action.payload;
      state.loadingProduct = false;
    },
    [getListServiceType.rejected]: (state, action) => {
      state.dataListServiceType = action.payload;
      state.loadingProduct = false;
    },
    /** Get List AppHierId */
    [getListAppHier.pending]: (state, action) => {
      state.dataListAppHierIdForm = action.payload;
      state.loadingProduct = true;
    },
    [getListAppHier.fulfilled]: (state, action) => {
      state.dataListAppHierIdForm = action.payload;
      state.loadingProduct = false;
    },
    [getListAppHier.rejected]: (state, action) => {
      state.dataListAppHierIdForm = action.payload;
      state.loadingProduct = false;
    },
    /** Get List AppHierDetail */
    [getListAppHierDetail.pending]: (state, action) => {
      state.dataListAppHierDetailForm = action.payload;
      state.loadingProduct = true;
    },
    [getListAppHierDetail.fulfilled]: (state, action) => {
      state.dataListAppHierDetailForm = action.payload;
      state.loadingProduct = false;
    },
    [getListAppHierDetail.rejected]: (state, action) => {
      state.dataListAppHierDetailForm = action.payload;
      state.loadingProduct = false;
    },
    /** Get List AppHierId Inactive */
    [getListAppHierInactive.pending]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loadingProduct = true;
    },
    [getListAppHierInactive.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loadingProduct = false;
    },
    [getListAppHierInactive.rejected]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loadingProduct = false;
    },
    /** Get List AppHierDetail */
    [getListAppHierDetailInactive.pending]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loadingProduct = true;
    },
    [getListAppHierDetailInactive.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loadingProduct = false;
    },
    [getListAppHierDetailInactive.rejected]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loadingProduct = false;
    },
    /** Get List Category */
    [getListCategory.pending]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingProduct = true;
    },
    [getListCategory.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingProduct = false;
    },
    [getListCategory.rejected]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loadingProduct = false;
    },
    /** List Payment Type */
    [getListPaymentType.pending]: (state, action) => {
      state.dataListPaymentType = action.payload;
      state.loadingProduct = true;
    },
    [getListPaymentType.fulfilled]: (state, action) => {
      state.dataListPaymentType = action.payload;
      state.loadingProduct = false;
    },
    [getListPaymentType.rejected]: (state, action) => {
      state.dataListPaymentType = action.payload;
      state.loadingProduct = false;
    },
    /** List Charging Method */
    [getListChargingMethod.pending]: (state, action) => {
      state.dataListChargeMethod = action.payload;
      state.loadingProduct = true;
    },
    [getListChargingMethod.fulfilled]: (state, action) => {
      state.dataListChargeMethod = action.payload;
      state.loadingProduct = false;
    },
    [getListChargingMethod.rejected]: (state, action) => {
      state.dataListChargeMethod = action.payload;
      state.loadingProduct = false;
    },
    /** List Calculation Type */
    [getListCalculationType.pending]: (state, action) => {
      state.dataListCalculationType = action.payload;
      state.loadingProduct = true;
    },
    [getListCalculationType.fulfilled]: (state, action) => {
      state.dataListCalculationType = action.payload;
      state.loadingProduct = false;
    },
    [getListCalculationType.rejected]: (state, action) => {
      state.dataListCalculationType = action.payload;
      state.loadingProduct = false;
    },
    /** List Select Criteria */
    [getSelectCriteria.pending]: (state, action) => {
      state.dataListSelectCriteria = action.payload;
      state.loadingProduct = true;
    },
    [getSelectCriteria.fulfilled]: (state, action) => {
      state.dataListSelectCriteria = action.payload;
      state.loadingProduct = false;
    },
    [getSelectCriteria.rejected]: (state, action) => {
      state.dataListSelectCriteria = action.payload;
      state.loadingProduct = false;
    },

    // Get Province List
    [getProvinceList.pending]: (state, action) => {
      state.loadingProduct = true;
      state.data_province = action.payload;
    },
    [getProvinceList.fulfilled]: (state, action) => {
      state.loadingProduct = false;
      state.data_province = action.payload;
    },
    [getProvinceList.rejected]: (state, action) => {
      state.loadingProduct = false;
      state.data_province = action.payload;
    },

    // Get Province List By Country
    [getProvinceListByCountry.pending]: (state, action) => {
      state.loadingProduct = true;
      state.data_province = action.payload;
    },
    [getProvinceListByCountry.fulfilled]: (state, action) => {
      state.loadingProduct = false;
      state.data_province = action.payload;
    },
    [getProvinceListByCountry.rejected]: (state, action) => {
      state.loadingProduct = false;
      state.data_province = action.payload;
    },

    // Get Country List
    [getCountryList.pending]: (state, action) => {
      state.loadingProduct = true;
      state.data_country = action.payload;
    },
    [getCountryList.fulfilled]: (state, action) => {
      state.loadingProduct = false;
      state.data_country = action.payload;
    },
    [getCountryList.rejected]: (state, action) => {
      state.loadingProduct = false;
      state.data_country = action.payload;
    },

    // Get City List
    [getCityList.pending]: (state, action) => {
      state.loadingProduct = true;
      state.data_city = action.payload;
    },
    [getCityList.fulfilled]: (state, action) => {
      state.loadingProduct = false;
      state.data_city = action.payload;
    },
    [getCityList.rejected]: (state, action) => {
      state.loadingProduct = false;
      state.data_city = action.payload;
    },

    // Get Cost Center List
    [getCostCenterList.pending]: (state, action) => {
      state.loadingProduct = true;
      state.data_cost_center = action.payload;
    },
    [getCostCenterList.fulfilled]: (state, action) => {
      state.loadingProduct = false;
      state.data_cost_center = action.payload;
    },
    [getCostCenterList.rejected]: (state, action) => {
      state.loadingProduct = false;
      state.data_cost_center = action.payload;
    },

    // Get Sor List
    [getSorList.pending]: (state, action) => {
      state.loadingProduct = true;
      state.data_sor = action.payload;
    },
    [getSorList.fulfilled]: (state, action) => {
      state.loadingProduct = false;
      state.data_sor = action.payload;
    },
    [getSorList.rejected]: (state, action) => {
      state.loadingProduct = false;
      state.data_sor = action.payload;
    },

    // Get District List
    [getDistrictList.pending]: (state, action) => {
      state.loadingProduct = true;
      state.data_district = action.payload;
    },
    [getDistrictList.fulfilled]: (state, action) => {
      state.loadingProduct = false;
      state.data_district = action.payload;
    },
    [getDistrictList.rejected]: (state, action) => {
      state.loadingProduct = false;
      state.data_district = action.payload;
    },

    // Get Sub District List
    [getSubDistrictList.pending]: (state, action) => {
      state.loadingProduct = true;
      state.data_sub_district = action.payload;
    },
    [getSubDistrictList.fulfilled]: (state, action) => {
      state.loadingProduct = false;
      state.data_sub_district = action.payload;
    },
    [getSubDistrictList.rejected]: (state, action) => {
      state.loadingProduct = false;
      state.data_sub_district = action.payload;
    },

    // Get G sizes List
    [getGsizesList.pending]: (state, action) => {
      state.loadingProduct = true;
      state.data_Gsizes = action.payload;
    },
    [getGsizesList.fulfilled]: (state, action) => {
      state.loadingProduct = false;
      state.data_Gsizes = action.payload;
    },
    [getGsizesList.rejected]: (state, action) => {
      state.loadingProduct = false;
      state.data_Gsizes = action.payload;
    },

    // Get Industrial Sector List
    [getIndustrialSectorList.pending]: (state, action) => {
      state.loadingProduct = true;
      state.data_industrial_sector = action.payload;
    },
    [getIndustrialSectorList.fulfilled]: (state, action) => {
      state.loadingProduct = false;
      state.data_industrial_sector = action.payload;
    },
    [getIndustrialSectorList.rejected]: (state, action) => {
      state.loadingProduct = false;
      state.data_industrial_sector = action.payload;
    },

    // Get Service Type List
    [getServiceTypeList.pending]: (state, action) => {
      state.loadingProduct = true;
      state.data_service_type = action.payload;
    },
    [getServiceTypeList.fulfilled]: (state, action) => {
      state.loadingProduct = false;
      state.data_service_type = action.payload;
    },
    [getServiceTypeList.rejected]: (state, action) => {
      state.loadingProduct = false;
      state.data_service_type = action.payload;
    },

    // Get Account Category List
    [getAccountCategoryList.pending]: (state, action) => {
      state.loadingProduct = true;
      state.data_account_Category = action.payload;
    },
    [getAccountCategoryList.fulfilled]: (state, action) => {
      state.loadingProduct = false;
      state.data_account_Category = action.payload;
    },
    [getAccountCategoryList.rejected]: (state, action) => {
      state.loadingProduct = false;
      state.data_account_Category = action.payload;
    },

    // Get Account Group List
    [getAccountGroupList.pending]: (state, action) => {
      state.loadingProduct = true;
      state.data_account_group = action.payload;
    },
    [getAccountGroupList.fulfilled]: (state, action) => {
      state.loadingProduct = false;
      state.data_account_group = action.payload;
    },
    [getAccountGroupList.rejected]: (state, action) => {
      state.loadingProduct = false;
      state.data_account_group = action.payload;
    },

    // Get Budget List
    [getBudgetList.pending]: (state, action) => {
      state.loadingProduct = true;
      state.data_budget = action.payload;
    },
    [getBudgetList.fulfilled]: (state, action) => {
      state.loadingProduct = false;
      state.data_budget = action.payload;
    },
    [getBudgetList.rejected]: (state, action) => {
      state.loadingProduct = false;
      state.data_budget = action.payload;
    },

    // Get Customer List
    [getCustomerList.pending]: (state, action) => {
      state.loadingProduct = true;
      state.data_customer = action.payload;
    },
    [getCustomerList.fulfilled]: (state, action) => {
      state.loadingProduct = false;
      state.data_customer = action.payload;
    },
    [getCustomerList.rejected]: (state, action) => {
      state.loadingProduct = false;
      state.data_customer = action.payload;
    },

    // Get Customer Segment
    [getCustomerSegment.pending]: (state, action) => {
      state.loadingProduct = true;
      state.data_customerSegment = action.payload;
    },
    [getCustomerSegment.fulfilled]: (state, action) => {
      state.loadingProduct = false;
      state.data_customerSegment = action.payload;
    },
    [getCustomerSegment.rejected]: (state, action) => {
      state.loadingProduct = false;
      state.data_customerSegment = action.payload;
    },

    /** Get List Pricing Rule */
    [getPricingRuleList.pending]: (state, action) => {
      state.dataListPricingRule = action.payload;
      state.loadingProduct = true;
    },
    [getPricingRuleList.fulfilled]: (state, action) => {
      state.dataListPricingRule = action.payload;
      state.loadingProduct = false;
    },
    [getPricingRuleList.rejected]: (state, action) => {
      state.dataListPricingRule = action.payload;
      state.loadingProduct = false;
    },

    /** Get List Price Code */
    [getPriceCodeList.pending]: (state, action) => {
      state.dataListPriceCode = action.payload;
      state.loadingProduct = true;
    },
    [getPriceCodeList.fulfilled]: (state, action) => {
      state.dataListPriceCode = action.payload;
      state.loadingProduct = false;
    },
    [getPriceCodeList.rejected]: (state, action) => {
      state.dataListPriceCode = action.payload;
      state.loadingProduct = false;
    },

    /** Get List Term of Service */
    [getTosList.pending]: (state, action) => {
      state.dataListTos = action.payload;
      state.loadingProduct = true;
    },
    [getTosList.fulfilled]: (state, action) => {
      state.dataListTos = action.payload;
      state.loadingProduct = false;
    },
    [getTosList.rejected]: (state, action) => {
      state.dataListTos = action.payload;
      state.loadingProduct = false;
    },
    /** List Name Column Global Type */
    [getListName.pending]: (state, action) => {
      state.dataListName = action.payload;
      state.loadingProduct = true;
    },
    [getListName.fulfilled]: (state, action) => {
      state.dataListName = action.payload;
      state.loadingProduct = false;
    },
    [getListName.rejected]: (state, action) => {
      state.dataListName = action.payload;
      state.loadingProduct = false;
    },
    /** List Name Column Product Detail */
    [getListNameProductDetail.pending]: (state, action) => {
      state.dataListNameProductDetail = action.payload;
      state.loadingProduct = true;
    },
    [getListNameProductDetail.fulfilled]: (state, action) => {
      state.dataListNameProductDetail = action.payload;
      state.loadingProduct = false;
    },
    [getListNameProductDetail.rejected]: (state, action) => {
      state.dataListNameProductDetail = action.payload;
      state.loadingProduct = false;
    },
    /** List Name Column Calculation Rule */
    [getListNameCalculationRule.pending]: (state, action) => {
      state.dataListNameCalculationRule = action.payload;
      state.loadingProduct = true;
    },
    [getListNameCalculationRule.fulfilled]: (state, action) => {
      state.dataListNameCalculationRule = action.payload;
      state.loadingProduct = false;
    },
    [getListNameCalculationRule.rejected]: (state, action) => {
      state.dataListNameCalculationRule = action.payload;
      state.loadingProduct = false;
    },
    /** List Unit Column Global Type */
    [getListUnit.pending]: (state, action) => {
      state.dataListUnit = action.payload;
      state.loadingProduct = true;
    },
    [getListUnit.fulfilled]: (state, action) => {
      state.dataListUnit = action.payload;
      state.loadingProduct = false;
    },
    [getListUnit.rejected]: (state) => {
      state.dataListUnit = [];
      state.loadingProduct = false;
    },
    /** List Unit VAT Column Global Type */
    [getListUnitVAT.pending]: (state, action) => {
      state.dataListUnit = action.payload;
      state.loadingProduct = true;
    },
    [getListUnitVAT.fulfilled]: (state, action) => {
      state.dataListUnit = action.payload;
      state.loadingProduct = false;
    },
    [getListUnitVAT.rejected]: (state) => {
      state.dataListUnit = [];
      state.loadingProduct = false;
    },
    /** List Unit WithHoldingTax Column Global Type */
    [getListUnitWithHoldTax.pending]: (state, action) => {
      state.dataListUnit = action.payload;
      state.loadingProduct = true;
    },
    [getListUnitWithHoldTax.fulfilled]: (state, action) => {
      state.dataListUnit = action.payload;
      state.loadingProduct = false;
    },
    [getListUnitWithHoldTax.rejected]: (state) => {
      state.dataListUnit = [];
      state.loadingProduct = false;
    },

    /** List Unit Column for Tos */
    [getListUnitTOS.pending]: (state, action) => {
      state.dataListUnitTos = action.payload;
      state.loadingProduct = true;
    },
    [getListUnitTOS.fulfilled]: (state, action) => {
      state.dataListUnitTos = action.payload;
      state.loadingProduct = false;
    },
    [getListUnitTOS.rejected]: (state) => {
      state.dataListUnitTos = [];
      state.loadingProduct = false;
    },

    /** List From Item Tos */
    [getListFromItemTos.pending]: (state, action) => {
      state.dataListFromItem = action.payload;
      state.loadingProduct = true;
    },
    [getListFromItemTos.fulfilled]: (state, action) => {
      state.dataListFromItem = action.payload;
      state.loadingProduct = false;
    },
    [getListFromItemTos.rejected]: (state) => {
      state.dataListFromItem = [];
      state.loadingProduct = false;
    },

    /** List Pricing Rule Detail Pagination */
    [getPricingRuleDetail.pending]: (state, action) => {
      state.loadingProduct = true;
      state.dataPricingRuleDetail = action.payload;
    },
    [getPricingRuleDetail.fulfilled]: (state, action) => {
      state.dataPricingRuleDetail = action.payload;
      state.loadingProduct = false;
    },
    [getPricingRuleDetail.rejected]: (state, action) => {
      state.dataPricingRuleDetail = action.payload;
      state.loadingProduct = false;
    },

    /** List Pricing Rule Detail Pagination */
    [getPricingAdjustment.pending]: (state, action) => {
      state.loadingProduct = true;
      state.dataPricingAdjustment = action.payload;
    },
    [getPricingAdjustment.fulfilled]: (state, action) => {
      state.dataPricingAdjustment = action.payload;
      state.loadingProduct = false;
    },
    [getPricingAdjustment.rejected]: (state, action) => {
      state.dataPricingAdjustment = action.payload;
      state.loadingProduct = false;
    },

    /** List TOS Attribute */
    [getAttributeTos.pending]: (state, action) => {
      state.dataListTosAttribute = action.payload;
      state.loadingProduct = true;
    },
    [getAttributeTos.fulfilled]: (state, action) => {
      state.dataListTosAttribute = action.payload;
      state.loadingProduct = false;
    },
    [getAttributeTos.rejected]: (state, action) => {
      state.dataListTosAttribute = action.payload;
      state.loadingProduct = false;
    },

    /** List Discount Type */
    [getDiscountType.pending]: (state, action) => {
      state.dataListDiscountType = action.payload;
      state.loadingProduct = true;
    },
    [getDiscountType.fulfilled]: (state, action) => {
      state.dataListDiscountType = action.payload;
      state.loadingProduct = false;
    },
    [getDiscountType.rejected]: (state, action) => {
      state.dataListDiscountType = action.payload;
      state.loadingProduct = false;
    },
    /** Download Product */
    [downloadProduct.pending]: (state) => {
      state.loadingProduct = true;
    },
    [downloadProduct.fulfilled]: (state) => {
      state.loadingProduct = false;
    },
    [downloadProduct.rejected]: (state) => {
      state.loadingProduct = false;
    },
    /** Lock Product */
    [lockProduct.pending]: (state) => {
      state.loadingProduct = true;
    },
    [lockProduct.fulfilled]: (state) => {
      state.loadingProduct = false;
    },
    [lockProduct.rejected]: (state) => {
      state.loadingProduct = false;
    },

    /** Inactive Product */
    [inactiveProduct.pending]: (state) => {
      state.loadingProduct = true;
    },
    [inactiveProduct.fulfilled]: (state) => {
      state.loadingProduct = false;
    },
    [inactiveProduct.rejected]: (state) => {
      state.loadingProduct = false;
    },
    /** Get Approval History Product */
    [getApprovalHistoryProduct.pending]: (state, action) => {
      state.loadingProduct = true;
      state.dataApprovalHistoryProduct = action.payload;
    },
    [getApprovalHistoryProduct.fulfilled]: (state, action) => {
      state.dataApprovalHistoryProduct = action.payload;
      state.loadingProduct = false;
    },
    [getApprovalHistoryProduct.rejected]: (state, action) => {
      state.dataApprovalHistoryProduct = action.payload;
      state.loadingProduct = false;
    },
    /** Get Approval History Product Version */
    [getApprovalHistoryProductVersion.pending]: (state, action) => {
      state.loadingProduct = true;
      state.dataApprovalHistoryProductVersion = action.payload;
    },
    [getApprovalHistoryProductVersion.fulfilled]: (state, action) => {
      state.dataApprovalHistoryProductVersion = action.payload;
      state.loadingProduct = false;
    },
    [getApprovalHistoryProductVersion.rejected]: (state, action) => {
      state.dataApprovalHistoryProductVersion = action.payload;
      state.loadingProduct = false;
    },
    /** Create Product */
    [createProductBody.pending]: (state, action) => {
      state.loadingProduct = true;
      state.dataStatus = action.payload;
    },
    [createProductBody.fulfilled]: (state, action) => {
      state.dataStatus = action.payload;
      state.loadingProduct = false;
    },
    [createProductBody.rejected]: (state, action) => {
      state.dataStatus = action.payload;
      state.loadingProduct = false;
    },
    /** Update Product */
    [updateProductBody.pending]: (state, action) => {
      state.loadingProduct = true;
      state.dataStatus = action.payload;
    },
    [updateProductBody.fulfilled]: (state, action) => {
      state.dataStatus = action.payload;
      state.loadingProduct = false;
    },
    [updateProductBody.rejected]: (state, action) => {
      state.dataStatus = action.payload;
      state.loadingProduct = false;
    },
    /** Create Product Version */
    [createProductVersionBody.pending]: (state, action) => {
      state.loadingProduct = true;
      state.dataStatus = action.payload;
    },
    [createProductVersionBody.fulfilled]: (state, action) => {
      state.dataStatus = action.payload;
      state.loadingProduct = false;
    },
    [createProductVersionBody.rejected]: (state, action) => {
      state.dataStatus = action.payload;
      state.loadingProduct = false;
    },
    /** Update Product Version */
    [updateProductVersionBody.pending]: (state, action) => {
      state.loadingProduct = true;
      state.dataStatus = action.payload;
    },
    [updateProductVersionBody.fulfilled]: (state, action) => {
      state.dataStatus = action.payload;
      state.loadingProduct = false;
    },
    [updateProductVersionBody.rejected]: (state, action) => {
      state.dataStatus = action.payload;
      state.loadingProduct = false;
    },
    /** Get Product Object*/
    [getDetailProduct.pending]: (state, action) => {
      state.loadingProduct = true;
      state.dataDetailProduct = action.payload;
    },
    [getDetailProduct.fulfilled]: (state, action) => {
      state.dataDetailProduct = action.payload;
      state.loadingProduct = false;
    },
    [getDetailProduct.rejected]: (state, action) => {
      state.dataDetailProduct = action.payload;
      state.loadingProduct = false;
    },
    /** Get Product Version Object */
    [getDetailProductVersion.pending]: (state, action) => {
      state.loadingProduct = true;
      state.dataDetailProductVersion = action.payload;
    },
    [getDetailProductVersion.fulfilled]: (state, action) => {
      state.dataDetailProductVersion = action.payload;
      state.loadingProduct = false;
    },
    [getDetailProductVersion.rejected]: (state, action) => {
      state.dataDetailProductVersion = action.payload;
      state.loadingProduct = false;
    },
    /** Get Lock History List */
    [getLockHistory.pending]: (state, action) => {
      state.loadingProduct = true;
      state.dataListLockHistory = action.payload;
    },
    [getLockHistory.fulfilled]: (state, action) => {
      state.dataListLockHistory = action.payload;
      state.loadingProduct = false;
    },
    [getLockHistory.rejected]: (state, action) => {
      state.dataListLockHistory = action.payload;
      state.loadingProduct = false;
    },
    /** Get Extend Terminate History */
    [getExtendTerminateHistory.pending]: (state, action) => {
      state.loadingProduct = true;
      state.dataListExtendTerminateHistory = action.payload;
    },
    [getExtendTerminateHistory.fulfilled]: (state, action) => {
      state.dataListExtendTerminateHistory = action.payload;
      state.loadingProduct = false;
    },
    [getExtendTerminateHistory.rejected]: (state, action) => {
      state.dataListExtendTerminateHistory = action.payload;
      state.loadingProduct = false;
    },
    /** Get List Product Version */
    [getProductVersionList.pending]: (state, action) => {
      state.loadingProduct = true;
      state.dataListProductVersion = action.payload;
    },
    [getProductVersionList.fulfilled]: (state, action) => {
      state.dataListProductVersion = action.payload;
      state.loadingProduct = false;
    },
    [getProductVersionList.rejected]: (state, action) => {
      state.dataListProductVersion = action.payload;
      state.loadingProduct = false;
    },
    /** Get List Pricing Detail */
    [getPricingDetailList.pending]: (state, action) => {
      state.loadingProduct = true;
      state.dataListPricingDetail = action.payload;
    },
    [getPricingDetailList.fulfilled]: (state, action) => {
      state.dataListPricingDetail = action.payload;
      state.loadingProduct = false;
    },
    [getPricingDetailList.rejected]: (state, action) => {
      state.dataListPricingDetail = action.payload;
      state.loadingProduct = false;
    },
    /** Release Product */
    [releaseProduct.pending]: (state) => {
      state.loadingProduct = true;
    },
    [releaseProduct.fulfilled]: (state) => {
      state.loadingProduct = false;
    },
    [releaseProduct.rejected]: (state) => {
      state.loadingProduct = false;
    },
    /** Extend Product */
    [extendProductVersion.pending]: (state) => {
      state.loadingProduct = true;
    },
    [extendProductVersion.fulfilled]: (state) => {
      state.loadingProduct = false;
    },
    [extendProductVersion.rejected]: (state) => {
      state.loadingProduct = false;
    },
    /** Terminate Product */
    [terminateProductVersion.pending]: (state) => {
      state.loadingProduct = true;
    },
    [terminateProductVersion.fulfilled]: (state) => {
      state.loadingProduct = false;
    },
    [terminateProductVersion.rejected]: (state) => {
      state.loadingProduct = false;
    },
    /** Approve/Reject Inactive Product */
    [approvalInactiveProduct.pending]: (state) => {
      state.loadingPricing = true;
    },
    [approvalInactiveProduct.fulfilled]: (state) => {
      state.loadingPricing = false;
    },
    [approvalInactiveProduct.rejected]: (state) => {
      state.loadingPricing = false;
    },
    /** Approve/Reject Product Version*/
    [approvalProductVersion.pending]: (state) => {
      state.loadingPricing = true;
    },
    [approvalProductVersion.fulfilled]: (state) => {
      state.loadingPricing = false;
    },
    [approvalProductVersion.rejected]: (state) => {
      state.loadingPricing = false;
    },
    /** Approve/Reject Extend Product Version */
    [approvalExtendProductVersion.pending]: (state) => {
      state.loadingPricing = true;
    },
    [approvalExtendProductVersion.fulfilled]: (state) => {
      state.loadingPricing = false;
    },
    [approvalExtendProductVersion.rejected]: (state) => {
      state.loadingPricing = false;
    },
    /** Approve/Reject Terminate Product Version */
    [approvalTerminateProductVersion.pending]: (state) => {
      state.loadingPricing = true;
    },
    [approvalTerminateProductVersion.fulfilled]: (state) => {
      state.loadingPricing = false;
    },
    [approvalTerminateProductVersion.rejected]: (state) => {
      state.loadingPricing = false;
    },
    //Access
    [getGrantedAccessProduct.pending]: (state, action) => {
      state.data_grant_access = action.payload;
      state.loading = true;
    },
    [getGrantedAccessProduct.fulfilled]: (state, action) => {
      state.data_grant_access = action.payload;
      state.loading = false;
    },
    [getGrantedAccessProduct.rejected]: (state, action) => {
      state.data_grant_access = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = productSlice;
export default reducer;
