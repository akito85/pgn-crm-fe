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
  data_ApprovalHistory: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  data_promoDiscountDetail: [],
  data_promoDiscountDetailDraft: [],
  data_listAttachment: [],
  data_ApprovalHistory: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
  message: "",
  data_budget: [],
  data_province: [],
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
  data_product: [],
  data_customerSegment: [],
  data_customer: [],
  data_adjustment_type: [],
  dataListCategory: [],
  dataListCriteria: [],
  data_condition_name: [],
  data_condition_operator: [],
  data_condition_type: [],
  data_promo_type: [],
  data_promotion_type: [],
  data_promo_category: [],
  data_from_item: [],
  data_tiering: [],
  data_uom: [],
  data_product: [],
};

export const getAllPromoPaginate = createAsyncThunk(
  "GET_ALL_PROMO_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/product-promo/list-product-promo?page=${page}&size=${pageSize}&searchs=${searchParams}&sort=${sortParams}`;
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

export const getDetailPromo = createAsyncThunk(
  "GET_DETAIL_PROMO",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/detail/${id}`;
      const data = await productPromoHttpService.getDetail(url);
      return data?.data?.data;
    } catch (error) {
      //if error code for with validation
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDetailPromoDraft = createAsyncThunk(
  "GET_DETAIL_PROMO_DRAFT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/detail-draft/${id}`;
      const data = await productPromoHttpService.getDetail(url);
      return data?.data;
    } catch (error) {
      //if error code for with validation
      if (error.response.data.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const approvePromo = createAsyncThunk(
  "APPROVE_PROMO",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/approve-product-promo`;
      const response = await productPromoHttpService.activationWithRemark(
        url,
        body
      );
      const successBody = {
        title: "Successful",
        description: `Your data has been ${body?.action ? "approved" : "rejected"}`,
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
          thunkAPI.dispatch(validateError({ error, action: "APPROVE_PROMO" }));
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

export const inactiveApprovePromo = createAsyncThunk(
  "INACTIVE_APPROVE_PROMO",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/INACTIVE_approve-inactive`;
      const response = await productPromoHttpService.activationWithRemark(
        url,
        body
      );
      const successBody = {
        title: "Successful",
        description: `Your data has been ${body?.action ? "approved" : "rejected"}`,
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
          thunkAPI.dispatch(validateError({ error, action: "INACTIVE_APPROVE_PROMO" }));
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


export const createPromo = createAsyncThunk(
  "CREATE_PROMO",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/product-promo/create-product-promo";
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
              body.action === "DRAFT" ? "created" : "submitted"
            }. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updatePromo = createAsyncThunk(
  "UPDATE_PROMO",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/product-promo/update-product-promo";
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
              body.action === "DRAFT" ? "updated" : "submitted"
            }. ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getPromoAttachment = createAsyncThunk(
  "GET_ATTACHMENT_PROMO",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/list-attachment/${id}`;
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_ATTACHMENT_PROMO" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const downloadPromo = createAsyncThunk(
  "DOWNLOAD_PROMO",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/product-promo/download-filter?page=${page}&size=${pageSize}&searchs=${searchParams}&sort=${sortParams}`;
      const response = await productPromoHttpService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "DOWNLOAD_PROMO", back : false }));
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getPromoApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_PROMO",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/approval-history/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_APPROVAL_HISTORY_PROMO" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getAvailableApprovalPromo = createAsyncThunk(
  "GET_AVAILABLE_APPROVAL_PROMO",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/list-apphier`;
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_AVAILABLE_APPROVAL_PROMO" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getSelectedApprovalPromo = createAsyncThunk(
  "GET_SELECTED_APPROVAL_PROMO",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/list-apphier/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_SELECTED_APPROVAL_PROMO" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getAttachmentCategoryPromo = createAsyncThunk(
  "GET_ATTACHMENT_CATEGORY_PROMO",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/list-category`;
      const response = await productPromoHttpService.getAll(url);
      return response.data?.map((data) => {
        return {
          Id: data.id,
          text: data.text,
        };
      });
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_ATTACHMENT_CATEGORY_PROMO" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getListCriteriaPromo = createAsyncThunk(
  "GET_CRITERIA_PROMO",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/list-criteria`;
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_CRITERIA_PROMO" }));
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getListPromoType = createAsyncThunk(
  "GET_PROMO_TYPE_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/promo-type`;
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_PROMO_TYPE_LIST" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getListPromotionType = createAsyncThunk(
  "GET_PROMOTION_TYPE_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/promotion-type`;
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_PROMOTION_TYPE_LIST" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getListPromoCategory = createAsyncThunk(
  "GET_PROMO_CATEGORY_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/promo-category`;
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_PROMO_CATEGORY_LIST" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const inactivePromo = createAsyncThunk(
  "INACTIVE_PROMO",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/inactive-product-promo`;
      const response = await productPromoHttpService.activationWithRemark(
        url,
        body
      );
      const successBody = {
        title: "Successful",
        description: "Your data inactivated.",
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
          thunkAPI.dispatch(validateError({ error, action: "INACTIVE_PROMO" }));
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

//List criteria

export const getProductList = createAsyncThunk(
  "GET_PRODUCT_PROMO",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/product`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.data?.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
    });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getBudgetList = createAsyncThunk(
  "GET_BUDGET_PROMO",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/get-budget`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
          return {
            value: item.id,
            label: item.text,
          };
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getSubDistrictList = createAsyncThunk(
  "GET_SUB_DISTRICT_PROMO",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/sub-district/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
    });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getDistrictList = createAsyncThunk(
  "GET_DISTRICT_PROMO",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/district/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
    });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getCityList = createAsyncThunk(
  "GET_CITY_PROMO",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/city/${id}`;
      const response = await productPromoHttpService.getDetail(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
    });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getProvinceList = createAsyncThunk(
  "GET_PROVINCE_PROMO",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/province`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
    });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getCostCenterList = createAsyncThunk(
  "GET_COST_CENTER_PROMO",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/area`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
    });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getSorList = createAsyncThunk("GET_SOR_PROMO", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/product-promo/get-sor`;
    const response = await productPromoHttpService.getAll(url);
    return response.data.map((item) => {
      return {
        value: item.id,
        label: item.text,
      };
  });
  } catch (error) {
    const message =
      error?.response?.data?.message || error?.message || error?.toString();
    if (
      error?.response?.data?.code === 500 ||
      error?.response?.data?.code === 419
    ) {
      thunkAPI.dispatch(setBodyError(error));
    } else {
      const errorBody = {
        title: "Failed",
        description: `${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
    }
  }
});

export const getIndustrialSectorList = createAsyncThunk(
  "GET_INDUSTRIAL_SECTOR_PROMO",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/get-industrial-sector`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
    });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getGsizesList = createAsyncThunk(
  "GET_GSIZES_PROMO",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/get-gsizes`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
    });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getCustomerSegmentList = createAsyncThunk(
  "GET_CUSTOMER_SEGMENT_PROMO",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/get-customer-segment`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
    });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getAccountGroupList = createAsyncThunk(
  "GET_ACCOUNT_GROUP_PROMO",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/get-account-group/${id}`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
    });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getAccountCategoryList = createAsyncThunk(
  "GET_ACCOUNT_CATEGORY_PROMO",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/get-account-category`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
    });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getServiceTypeList = createAsyncThunk(
  "GET_SERVICE_TYPE_PROMO",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/get-service-type`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
    });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getCustomerList = createAsyncThunk(
  "GET_CUSTOMER_PROMO",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/get-customer`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
    });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getConditionName = createAsyncThunk(
  "GET_CONDITION_NAME_PROMO",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/product-promo/condition-name";
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getConditionOperator = createAsyncThunk(
  "GET_CONDITION_OPERATOR_PROMO",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/product-promo/condition-operator";
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getConditionType = createAsyncThunk(
  "GET_CONDITION_TYPE_PROMO",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/product-promo/condition-type";
      const response = await productPromoHttpService.getAll(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getAdjustmentTypeList = createAsyncThunk(
  "GET_ADJUSTMENT_TYPE_PROMO",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/adjustment-type`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
    });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getUomList = createAsyncThunk("GET_UOM_PROMO", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/product-promo/list-uom`;
    const response = await productPromoHttpService.getAll(url);
    return response.data.map((item) => {
      return {
        value: item.id,
        label: item.text,
      };
  });
  } catch (error) {
    const message =
      error?.response?.data?.message || error?.message || error?.toString();
    if (
      error?.response?.data?.code === 500 ||
      error?.response?.data?.code === 419
    ) {
      thunkAPI.dispatch(setBodyError(error));
    } else {
      const errorBody = {
        title: "Failed",
        description: `${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
    }
  }
});

export const getFromItemList = createAsyncThunk(
  "GET_FROM_ITEM_PROMO",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/from-item`;
      const response = await productPromoHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
    });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

export const getTieringList = createAsyncThunk(
  "GET_TIERING_PROMO",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product-promo/tiering`;
      const response = await productPromoHttpService.updateDataWithMethodPost(url, body);
      return response.data?.map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
    }
  }
);

const promoSlice = createSlice({
  name: "promoSlice",
  initialState,
  extraReducers: {
    // Get All Promo Pagination
    [getAllPromoPaginate.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllPromoPaginate.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getAllPromoPaginate.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // Get Detail Promo
    [getDetailPromo.pending]: (state, action) => {
      state.loading = true;
      state.data_promoDiscountDetail = action.payload;
    },
    [getDetailPromo.fulfilled]: (state, action) => {
      state.data_promoDiscountDetail = action.payload;
      state.loading = false;
    },
    [getDetailPromo.rejected]: (state, action) => {
      state.data_promoDiscountDetail = action.payload;
      state.loading = false;
    },

    [getDetailPromoDraft.pending]: (state, action) => {
      state.loading = true;
      state.data_promoDiscountDetailDraft = action.payload;
    },
    [getDetailPromoDraft.fulfilled]: (state, action) => {
      state.data_promoDiscountDetailDraft = action.payload;
      state.loading = false;
    },
    [getDetailPromoDraft.rejected]: (state, action) => {
      state.data_promoDiscountDetailDraft = action.payload;
      state.loading = false;
    },

    [getPromoApprovalHistory.pending]: (state, action) => {
      state.loading = true;
      state.data_ApprovalHistory = action.payload;
    },
    [getPromoApprovalHistory.fulfilled]: (state, action) => {
      state.data_ApprovalHistory = action.payload;
      state.loading = false;
    },
    [getPromoApprovalHistory.rejected]: (state, action) => {
      state.data_ApprovalHistory = action.payload;
      state.loading = false;
    },

    //GET AVAILABLE APPROVAL
    [getAvailableApprovalPromo.pending]: (state, action) => {
      state.loading = true;
    },
    [getAvailableApprovalPromo.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListAppHierId = action.payload;
    },
    [getAvailableApprovalPromo.rejected]: (state, action) => {
      state.loading = false;
    },
    //GET SELECTED APPROVAL
    [getSelectedApprovalPromo.pending]: (state, action) => {
      state.loading = true;
    },
    [getSelectedApprovalPromo.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListAppHierDetail = action.payload;
    },
    [getSelectedApprovalPromo.rejected]: (state, action) => {
      state.loading = false;
    },

    //LIST ATTAHCHMENT
    [getPromoAttachment.pending]: (state, action) => {
      state.loading = true;
    },
    [getPromoAttachment.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_listAttachment= action.payload;
    },
    [getPromoAttachment.rejected]: (state, action) => {
      state.loading = false;
    },

    [getAttachmentCategoryPromo.pending]: (state, action) => {
      state.loading = true;
    },
    [getAttachmentCategoryPromo.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListCategory = action.payload;
    },
    [getAttachmentCategoryPromo.rejected]: (state, action) => {
      state.loading = false;
    },

    [getListCriteriaPromo.pending]: (state, action) => {
      state.loading = true;
    },
    [getListCriteriaPromo.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListCriteria = action.payload;
    },
    [getListCriteriaPromo.rejected]: (state, action) => {
      state.loading = false;
    },

    //LIST CRITERIA
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

    //LIST CONDITION
    [getConditionName.pending]: (state, action) => {
      state.loading = true;
    },
    [getConditionName.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_condition_name = action.payload;
    },
    [getConditionName.rejected]: (state, action) => {
      state.loading = false;
      state.data_condition_name = action.payload;
    },

    [getConditionOperator.pending]: (state, action) => {
      state.loading = true;
    },
    [getConditionOperator.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_condition_operator = action.payload;
    },
    [getConditionOperator.rejected]: (state, action) => {
      state.loading = false;
      state.data_condition_operator = action.payload;
    },

    [getConditionType.pending]: (state, action) => {
      state.loading = true;
    },
    [getConditionType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_condition_type = action.payload;
    },
    [getConditionType.rejected]: (state, action) => {
      state.loading = false;
      state.data_condition_type = action.payload;
    },

    [getListPromoType.pending]: (state, action) => {
      state.loading = true;
    },
    [getListPromoType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_promo_type = action.payload;
    },
    [getListPromoType.rejected]: (state, action) => {
      state.loading = false;
      state.data_promo_type = action.payload;
    },

    [getListPromotionType.pending]: (state) => {
      state.loading = true;
    },
    [getListPromotionType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_promotion_type = action.payload;
    },
    [getListPromotionType.rejected]: (state, action) => {
      state.loading = false;
      state.data_promotion_type = action.payload;
    },

    [getListPromoCategory.pending]: (state) => {
      state.loading = true;
    },
    [getListPromoCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_promo_category = action.payload;
    },
    [getListPromoCategory.rejected]: (state, action) => {
      state.loading = false;
      state.data_promo_category = action.payload;
    },

    [getAdjustmentTypeList.pending]: (state, action) => {
      state.loading = true;
    },
    [getAdjustmentTypeList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_adjustment_type = action.payload;
    },
    [getAdjustmentTypeList.rejected]: (state, action) => {
      state.loading = false;
      state.data_adjustment_type = action.payload;
    },

    [getUomList.pending]: (state, action) => {
      state.loading = true;
    },
    [getUomList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_uom = action.payload;
    },
    [getUomList.rejected]: (state, action) => {
      state.loading = false;
      state.data_uom = action.payload;
    },

    [getFromItemList.pending]: (state, action) => {
      state.loading = true;
    },
    [getFromItemList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_from_item = action.payload;
    },
    [getFromItemList.rejected]: (state, action) => {
      state.loading = false;
      state.data_from_item = action.payload;
    },

    [getTieringList.pending]: (state, action) => {
      state.loading = true;
    },
    [getTieringList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_tiering = action.payload;
    },
    [getTieringList.rejected]: (state, action) => {
      state.loading = false;
      state.data_tiering = action.payload;
    },
  },
});

const { reducer } = promoSlice;
export default reducer;
