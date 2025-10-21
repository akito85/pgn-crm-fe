import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import {
  showModalError,
  showModalSuccess,
  validateError,
} from "../../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../../utils";

const initialState = {
  data: null,
  loading: false,
  data_detail: null,
  dataListCriteriaOpt: [],
  dataListCurrency: [],
  accountCategoryList: [],
  saTypeList: [],
  accountTypeList: [],
  accountSegmentList: [],
  accountGroupTypeList: [],
  accountNumberList: [],
  classificationTypeList: [],
  sorList: [],
  costCenterList: [],
  premiseCountryList: [],
  premiseProvinceList: [],
  premiseCityList: [],
  premiseDistrictList: [],
  premiseSubdistrictList: [],
  data_tax_implication_rule: null,
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataListCategory: [],
  dataApprovalHistory: {},
  conditionNameList: [],
  operationFormulaList: [],
  operationConditionList: [],
  dataImplicationType: [],
  data_detail_tax_implication_rule: null,
  data_detail_draft_tax_implicatio_rule: null,
  message: "",
  categoryList: [],
  serviceTypeList: [],
  transactionCodeData: [],
};

export const getTaxImplicationPaginate = createAsyncThunk(
  "GET_TAX_IMPLICATION_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/tax-implication/pagingTaxImplication?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getDetailTaxImplication = createAsyncThunk(
  "GET_DETAIL_TAX_IMPLICATION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/detailTaxImplication/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const downloadTaxImplication = createAsyncThunk(
  "DOWNLOAD_TAX_IMPLICATION",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/tax-implication/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_TAX_IMPLICATION",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);
// v1/dbs/api/tax-implication/download-filter?page=1&size=10&search=&sort=
export const activeInactiveTaxImplication = createAsyncThunk(
  "ACTIVE_INACTIVE_TAX_IMPLICATION",
  async ({ body, activeOrInactive }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tax-implication/inactive-taximplication";
      const response = await accountManagementService.activationWithOutRemark(
        url,
        body,
      );
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${activeOrInactive}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${activeOrInactive}. ${message}. Please try again.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);
export const createTaxImplication = createAsyncThunk(
  "CREATE_TAX_IMPLICATION",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tax-implication/create-taximplication";
      const response = await accountManagementService.createData(url, body);
      // const successBody = {
      //   title: `Successful`,
      //   description: "Your data has been created.",
      // };
      // thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      // const message =
      //   error?.response?.data?.message || error.message || error.toString();
      // if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
      //   const errorBody = {
      //     title: "Failed",
      //     description: `Your data was not created. ${message}.`,
      //   };
      //   thunkAPI.dispatch(showModalError(errorBody));
      // }
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "updated", errorMessage(error)),
          action: "CREATE_TAX_IMPLICATION",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error);
    }
  },
);
export const updateTaxImplication = createAsyncThunk(
  "UPDATE_TAX_IMPLICATION",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tax-implication/update-taximplication";
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been updated.",
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
        description: `Your data was not updated. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
export const activationTaxImplication = createAsyncThunk(
  "ACTIVATION_TAX_IMPLICATION",
  async ({ body, activeOrInactive }, thunkAPI) => {
    try {
      const url = "";
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: `Your data has been ${activeOrInactive}.`,
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
        description: `Your data was not ${activeOrInactive}. ${message}. Please try again.`,
        return: false,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getTaxImplicationRulePaginate = createAsyncThunk(
  "GET_IMPICATION_RULE_PAGINATE",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/tax-implication/view-pagingTaxImplication-rule/${id}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getListAppHier = createAsyncThunk(
  "GET_LIST_APP_HIER_TAX_IMPLICATION_RULE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tax-implication/list-approval-header";
      const response = await accountManagementService.getAll(url);
      return response.data;
      // return (response.data || []).map((item) => {
      //   return {
      //     value: item.appHierId,
      //     name: item.approvalName,
      //   };
      // });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const getListAppHierDetail = createAsyncThunk(
  "GET_LIST_APP_HIER_DETAIL_TAX_IMPLICATION_RULE",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/list-selected-approval-header/${id}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

/** Get List Criteria */
export const getCountryList = createAsyncThunk(
  "GET_COUNTRY_TAX_IMPLICATION_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/list-premise-country`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getProvinceList = createAsyncThunk(
  "GET_PROVINCE_TAX_IMPLICATION_LIST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/list-premise-province/${id}`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getCityList = createAsyncThunk(
  "GET_CITY_TAX_IMPLICATION_LIST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/list-premise-city/${id}`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getCostCenterList = createAsyncThunk(
  "GET_COST_CENTER_TAX_IMPLICATION_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/list-cost-center`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getSorList = createAsyncThunk(
  "GET_SOR_TAX_IMPLICATION_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/list-sor`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getDistrictList = createAsyncThunk(
  "GET_DISTRICT_TAX_IMPLICATION_LIST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/list-premise-district/${id}`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getSubDistrictList = createAsyncThunk(
  "GET_SUB_DISTRICT_TAX_IMPLICATION_LIST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/list-premise-sub-district/${id}`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getAccountNumberList = createAsyncThunk(
  "GET_ACCOUNT_NUMBER_TAX_IMPLICATION_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/list-account-number`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getClassificationTypeList = createAsyncThunk(
  "GET_CLASSIFICATION_TYPE_TAX_IMPLICATION_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/list-classification-type`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getAccountSegment = createAsyncThunk(
  "GET_ACCOUNT_SEGMENT_TAX_IMPLICATION_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/list-account-segment`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getSATypeList = createAsyncThunk(
  "GET_SA_TYPE_TAX_IMPLICATION_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/list-sa-type`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getAccountCategoryList = createAsyncThunk(
  "GET_ACCOUNT_CATEGORY_TAX_IMPLICATION_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/product/getAccountCategory`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.Id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getAccountGroupList = createAsyncThunk(
  "GET_ACCOUNT_GROUP_TAX_IMPLICATION_LIST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/list-account-group-type/${id}`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getAccountTypeList = createAsyncThunk(
  "GET_ACCOUNT_TYPE_TAX_IMPLICATION_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/list-account-type`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

/** Get List Category */
export const getCategoryList = createAsyncThunk(
  "GET_CATEGORY_TAX_IMPLICATION_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/list-category`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

/** Get List Service Type */
export const getServiceTypeList = createAsyncThunk(
  "GET_SERVICE_TYPE_TAX_IMPLICATION_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/list-service-type`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getSelectCriteria = createAsyncThunk(
  "GET_SELECT_CRITERIA_TAX_IMPLICATION",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/get-criteria`;
      const response = await accountManagementService.getAll(url);
      return (response?.data || []).map((item) => ({
        label: item.text,
        value: item.id,
        code: item?.code,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getConditionNameList = createAsyncThunk(
  "GET_CONDITION_VARIABLE_NAME_TAX_IMLICATION_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/list-condition-name`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const getOperatorConditionList = createAsyncThunk(
  "GET_OPERATOR_CONDITION_TAX_IMLICATION_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/list-operator`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getImplicationTypeList = createAsyncThunk(
  "GET_IMPLICATION_TYPE_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/implication-type`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.id,
          label: item.text,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const getOperationFormulaList = createAsyncThunk(
  "GET_OPERATION_FORMULA_TAX_IMPLICATION_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/list-operator`;
      const response = await accountManagementService.getAll(url);
      return (response.data || []).map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY_ATTACHMENT",
  async (thunkAPI) => {
    try {
      // const url = `/v1/dbs/api/master/late-charge/list-category`
      const url = "/v1/dbs/api/master/late-charge/list-category";
      const response = await accountManagementService.getAll(url);
      return response.data.map((item) => {
        return {
          glbTypeValId: item.id,
          name: item.name,
        };
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const createTaxImplicationRuleBody = createAsyncThunk(
  "CREATE_TAX_IMPLICATION_RULE",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tax-implication/create-taximplication-rule";
      const response = await accountManagementService.createData(url, body);
      // const successBody = {
      //   title: `Successful`,
      //   description: `Your data has been ${
      //     body.isSubmit ? "created" : "submitted"
      //   }.`,
      // };
      // thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${
            body.isSubmit ? "created" : "submitted"
          }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const updateTaxImplicationRuleBody = createAsyncThunk(
  "UPDATE_TAX_IMPLICATION_RULE",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/tax-implication/update-taximplication-rule";
      const response = await accountManagementService.updateData(url, body);
      // const successBody = {
      //   title: `Successful`,
      //   description: `Your data has been ${
      //     body.isSubmit ? "updated" : "submitted"
      //   }.`,
      // };
      // thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${
            body.isSubmit ? "updated" : "submitted"
          }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getDetailTaxImplicationRule = createAsyncThunk(
  "GET_DETAIL_TAX_IMPLICATION_RULE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/detail-tax-rule/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const getDetailDraftTaxImplicationRule = createAsyncThunk(
  "GET_DETAIL_DRAFT_TAX_IMPLICATION_RULE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/detail-tax-rule-draft/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const approvalCreateTaxImplicationRule = createAsyncThunk(
  "APPROVAL_CREATE_TAX_IMPLICATION_RULE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/approve-taximplication-rule`;
      const response = await accountManagementService.activationWithRemark(
        url,
        body,
      );
      const successBody = {
        title: "Successful",
        description: `Your data has been ${
          body.action === "APPROVE" ? "approved" : "rejected"
        }.`,
        // alertDescription:
        //   body.action === "REJECT"
        //     ? "Warning! if you reject this data, you will need to request approval again."
        //     : undefined,
        width: body.action === "REJECT" ? 700 : 500,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
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
  },
);

export const approvalInactiveTaxImplicationRule = createAsyncThunk(
  "APPROVAL_INACTIVE_TAX_IMPLICATION_RULE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/approve-inactive-taximplication-rule`;
      const response = await accountManagementService.activationWithRemark(
        url,
        body,
      );
      const successBody = {
        title: "Successful",
        description: `Your data has been ${
          body.action === "APPROVE" ? "approved" : "rejected"
        }.`,
        // alertDescription:
        //   body.action === "REJECT"
        //     ? "Warning! if you reject this data, you will need to request approval again."
        //     : undefined,
        width: body.action === "REJECT" ? 700 : 500,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
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
  },
);

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_TAX_IMPLICATION_RULE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/approvalhistory/${id}`;
      const response = await accountManagementService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);
export const getTransactionCode = createAsyncThunk(
  "GET_TRANSACTION_CODE",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/get-facture-codes`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const inactiveTaxImplicationRule = createAsyncThunk(
  "INACTIVE_TAX_IMPLICATION_RULE",
  async ({ data }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/inactive-taximplication-rule`;
      const response = await accountManagementService.activationWithOutRemark(
        url,
        data,
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
        error?.response?.data?.message || error?.message || error?.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not submitted. ${message}.`,
          return: false,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const deleteTaxImplicationRule = createAsyncThunk(
  "DELETE_TAX_IMPLICATION_RULE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/delete-draft/${id}`;
      const response = await accountManagementService.deleteData(url);
      const successBody = {
        title: `Successful`,
        description: `Your data has been deleted.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not delete. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const checkStartDate = createAsyncThunk(
  "CHECK_STARTDATE_TAX_IMPLICATION_RULE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-implication/check-start-date`;
      const response = await accountManagementService.createData(url, body);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

const taxImplicationSlice = createSlice({
  name: "tax_implication_slice",
  initialState,
  extraReducers: {
    // pagination
    [getTaxImplicationPaginate.pending]: (state, action) => {
      state.loading = true;
    },
    [getTaxImplicationPaginate.rejected]: (state, action) => {
      state.loading = false;
    },
    [getTaxImplicationPaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // download
    [downloadTaxImplication.pending]: (state, action) => {
      state.loading = true;
    },
    [downloadTaxImplication.rejected]: (state, action) => {
      state.loading = false;
    },
    [downloadTaxImplication.fulfilled]: (state, action) => {
      state.loading = false;
      // state.data = action.payload;
    },
    // detail
    [getDetailTaxImplication.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailTaxImplication.rejected]: (state, action) => {
      state.loading = false;
    },
    [getDetailTaxImplication.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    // detail list tax implication rule
    [getTaxImplicationRulePaginate.pending]: (state, action) => {
      state.loading = true;
    },
    [getTaxImplicationRulePaginate.rejected]: (state, action) => {
      state.loading = false;
    },
    [getTaxImplicationRulePaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_tax_implication_rule = action.payload;
    },
    // create
    [createTaxImplication.pending]: (state, action) => {
      state.loading = true;
    },
    [createTaxImplication.rejected]: (state, action) => {
      state.loading = false;
    },
    [createTaxImplication.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // update
    [updateTaxImplication.pending]: (state, action) => {
      state.loading = true;
    },
    [updateTaxImplication.rejected]: (state, action) => {
      state.loading = false;
    },
    [updateTaxImplication.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // activation
    [activationTaxImplication.pending]: (state, action) => {
      state.loading = true;
    },
    [activationTaxImplication.rejected]: (state, action) => {
      state.loading = false;
    },
    [activationTaxImplication.fulfilled]: (state, action) => {
      state.loading = false;
      // state.data = action.payload;
    },

    /** List Premise Country */
    [getCountryList.pending]: (state, action) => {
      state.loading = true;
    },
    [getCountryList.fulfilled]: (state, action) => {
      state.premiseCountryList = action.payload;
      state.loading = false;
    },
    [getCountryList.rejected]: (state, action) => {
      state.premiseCountryList = [];
      state.loading = false;
    },
    /** List Premise Province */
    [getProvinceList.pending]: (state, action) => {
      state.loading = true;
    },
    [getProvinceList.fulfilled]: (state, action) => {
      state.premiseProvinceList = action.payload;
      state.loading = false;
    },
    [getProvinceList.rejected]: (state, action) => {
      state.premiseProvinceList = [];
      state.loading = false;
    },
    /** List Premise City */
    [getCityList.pending]: (state, action) => {
      state.loading = true;
    },
    [getCityList.fulfilled]: (state, action) => {
      state.premiseCityList = action.payload;
      state.loading = false;
    },
    [getCityList.rejected]: (state, action) => {
      state.premiseCityList = [];
      state.loading = false;
    },
    /** List Premise District */
    [getDistrictList.pending]: (state, action) => {
      state.loading = true;
    },
    [getDistrictList.fulfilled]: (state, action) => {
      state.premiseDistrictList = action.payload;
      state.loading = false;
    },
    [getDistrictList.rejected]: (state, action) => {
      state.premiseDistrictList = [];
      state.loading = false;
    },
    /** List Premise Subdistrict */
    [getSubDistrictList.pending]: (state, action) => {
      state.loading = true;
    },
    [getSubDistrictList.fulfilled]: (state, action) => {
      state.premiseSubdistrictList = action.payload;
      state.loading = false;
    },
    [getSubDistrictList.rejected]: (state, action) => {
      state.premiseSubdistrictList = [];
      state.loading = false;
    },
    /** List Cost Center */
    [getCostCenterList.pending]: (state, action) => {
      state.loading = true;
    },
    [getCostCenterList.fulfilled]: (state, action) => {
      state.costCenterList = action.payload;
      state.loading = false;
    },
    [getCostCenterList.rejected]: (state, action) => {
      state.costCenterList = [];
      state.loading = false;
    },
    /** List Sor */
    [getSorList.pending]: (state, action) => {
      state.loading = true;
    },
    [getSorList.fulfilled]: (state, action) => {
      state.sorList = action.payload;
      state.loading = false;
    },
    [getSorList.rejected]: (state, action) => {
      state.sorList = [];
      state.loading = false;
    },
    /** List Account Number */
    [getAccountNumberList.pending]: (state, action) => {
      state.loading = true;
    },
    [getAccountNumberList.fulfilled]: (state, action) => {
      state.accountNumberList = action.payload;
      state.loading = false;
    },
    [getAccountNumberList.rejected]: (state, action) => {
      state.accountNumberList = [];
      state.loading = false;
    },
    /** List Classification Type */
    [getClassificationTypeList.pending]: (state, action) => {
      state.loading = true;
    },
    [getClassificationTypeList.fulfilled]: (state, action) => {
      state.classificationTypeList = action.payload;
      state.loading = false;
    },
    [getClassificationTypeList.rejected]: (state, action) => {
      state.classificationTypeList = [];
      state.loading = false;
    },
    /** List Account Segment */
    [getAccountSegment.pending]: (state, action) => {
      state.loading = true;
    },
    [getAccountSegment.fulfilled]: (state, action) => {
      state.accountSegmentList = action.payload;
      state.loading = false;
    },
    [getAccountSegment.rejected]: (state, action) => {
      state.accountSegmentList = [];
      state.loading = false;
    },
    /** List SA Type */
    [getSATypeList.pending]: (state, action) => {
      state.loading = true;
    },
    [getSATypeList.fulfilled]: (state, action) => {
      state.saTypeList = action.payload;
      state.loading = false;
    },
    [getSATypeList.rejected]: (state, action) => {
      state.saTypeList = [];
      state.loading = false;
    },
    /** List Account Category */
    [getAccountCategoryList.pending]: (state, action) => {
      state.loading = true;
    },
    [getAccountCategoryList.fulfilled]: (state, action) => {
      state.accountCategoryList = action.payload;
      state.loading = false;
    },
    [getAccountCategoryList.rejected]: (state, action) => {
      state.accountCategoryList = [];
      state.loading = false;
    },
    /** List Account Group Type */
    [getAccountGroupList.pending]: (state, action) => {
      state.loading = true;
    },
    [getAccountGroupList.fulfilled]: (state, action) => {
      state.accountGroupTypeList = action.payload;
      state.loading = false;
    },
    [getAccountGroupList.rejected]: (state, action) => {
      state.accountGroupTypeList = [];
      state.loading = false;
    },
    /** List Account Type */
    [getAccountTypeList.pending]: (state, action) => {
      state.loading = true;
    },
    [getAccountTypeList.fulfilled]: (state, action) => {
      state.accountTypeList = action.payload;
      state.loading = false;
    },
    [getAccountTypeList.rejected]: (state, action) => {
      state.accountTypeList = [];
      state.loading = false;
    },

    /** List Select Criteria */
    [getSelectCriteria.pending]: (state, action) => {
      state.loading = true;
    },
    [getSelectCriteria.fulfilled]: (state, action) => {
      state.dataListCriteriaOpt = action.payload;
      state.loading = false;
    },
    [getSelectCriteria.rejected]: (state, action) => {
      state.dataListCriteriaOpt = [];
      state.loading = false;
    },
    /** List Category list */
    [getCategoryList.pending]: (state, action) => {
      state.loading = true;
    },
    [getCategoryList.fulfilled]: (state, action) => {
      state.categoryList = action.payload;
      state.loading = false;
    },
    [getCategoryList.rejected]: (state, action) => {
      state.categoryList = [];
      state.loading = false;
    },
    /** List Service Type list */
    [getServiceTypeList.pending]: (state, action) => {
      state.loading = true;
    },
    [getServiceTypeList.fulfilled]: (state, action) => {
      state.serviceTypeList = action.payload;
      state.loading = false;
    },
    [getServiceTypeList.rejected]: (state, action) => {
      state.serviceTypeList = [];
      state.loading = false;
    },
    /** Get List AppHierId */
    [getListAppHier.pending]: (state, action) => {
      state.loading = true;
    },
    [getListAppHier.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    [getListAppHier.rejected]: (state, action) => {
      state.dataListAppHierId = [];
      state.loading = false;
    },
    /** Get List AppHierDetail */
    [getListAppHierDetail.pending]: (state, action) => {
      state.loading = true;
    },
    [getListAppHierDetail.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },
    [getListAppHierDetail.rejected]: (state, action) => {
      state.dataListAppHierDetail = [];
      state.loading = false;
    },
    /** List Variable Name */
    [getConditionNameList.pending]: (state, action) => {
      state.loading = true;
    },
    [getConditionNameList.fulfilled]: (state, action) => {
      state.conditionNameList = action.payload;
      state.loading = false;
    },
    [getConditionNameList.rejected]: (state, action) => {
      state.conditionNameList = [];
      state.loading = false;
    },
    /** List Formula Condition */
    [getOperatorConditionList.pending]: (state, action) => {
      state.loading = true;
    },
    [getOperatorConditionList.fulfilled]: (state, action) => {
      state.operationConditionList = action.payload;
      state.loading = false;
    },
    [getOperatorConditionList.rejected]: (state, action) => {
      state.operationConditionList = [];
      state.loading = false;
    },
    /** List Data Type Condition */
    [getImplicationTypeList.pending]: (state, action) => {
      state.loading = true;
    },
    [getImplicationTypeList.fulfilled]: (state, action) => {
      state.dataImplicationType = action.payload;
      state.loading = false;
    },
    [getImplicationTypeList.rejected]: (state, action) => {
      state.dataImplicationType = [];
      state.loading = false;
    },
    /** List Formula Operation */
    [getOperationFormulaList.pending]: (state, action) => {
      state.loading = true;
    },
    [getOperationFormulaList.fulfilled]: (state, action) => {
      state.operationFormulaList = action.payload;
      state.loading = false;
    },
    [getOperationFormulaList.rejected]: (state, action) => {
      state.operationFormulaList = [];
      state.loading = false;
    },
    /** Get List Category */
    [getListCategory.pending]: (state, action) => {
      state.loading = true;
    },
    [getListCategory.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },
    [getListCategory.rejected]: (state, action) => {
      state.dataListCategory = [];
      state.loading = false;
    },
    /**detail tax implication rule*/
    [getDetailTaxImplicationRule.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailTaxImplicationRule.rejected]: (state, action) => {
      state.loading = false;
      state.data_detail_tax_implication_rule = null;
    },
    [getDetailTaxImplicationRule.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail_tax_implication_rule = action.payload;
    },
    /**detail draft tax implication rule*/
    [getDetailDraftTaxImplicationRule.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailDraftTaxImplicationRule.rejected]: (state, action) => {
      state.loading = false;
      state.data_detail_draft_tax_implication_rule = null;
    },
    [getDetailDraftTaxImplicationRule.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail_draft_tax_implication_rule = action.payload;
    },
    /** Approve Tax Implication Rule */
    [approvalCreateTaxImplicationRule.pending]: (state, action) => {
      state.loading = true;
    },
    [approvalCreateTaxImplicationRule.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [approvalCreateTaxImplicationRule.rejected]: (state, action) => {
      state.loading = false;
    },
    /** Approve Inactive Tax Implication Rule */
    [approvalInactiveTaxImplicationRule.pending]: (state, action) => {
      state.loading = true;
    },
    [approvalInactiveTaxImplicationRule.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [approvalInactiveTaxImplicationRule.rejected]: (state, action) => {
      state.loading = false;
    },
    /** Get Approval History */
    [getApprovalHistory.pending]: (state, action) => {
      state.loading = true;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loading = false;
    },
    [getApprovalHistory.rejected]: (state, action) => {
      state.dataApprovalHistory = {};
      state.loading = false;
    },
    /** Inactive tax implication Rule */
    [inactiveTaxImplicationRule.pending]: (state, action) => {
      state.loading = true;
    },
    [inactiveTaxImplicationRule.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [inactiveTaxImplicationRule.rejected]: (state, action) => {
      state.loading = false;
    },

    /** delete tax implciation Rule */
    [deleteTaxImplicationRule.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteTaxImplicationRule.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [deleteTaxImplicationRule.rejected]: (state, action) => {
      state.loading = false;
    },

    // get transaction code
    [getTransactionCode.pending]: (state, action) => {
      state.loading = true;
    },
    [getTransactionCode.fulfilled]: (state, action) => {
      state.loading = false;
      state.transactionCodeData = action.payload;
    },
    [getTransactionCode.rejected]: (state, action) => {
      state.loading = false;
      state.transactionCodeData = action.payload;
    },
  },
});

const { reducer } = taxImplicationSlice;
export default reducer;
