import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountManagementService from "../../../services/account_management/accountManagementService";
import {
  showModalError,
  showModalSuccess,
  validateError,
} from "../../general_slice";

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
  data_late_charge_rule: null,
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataListCategory: [],
  dataApprovalHistory: {},
  variableNameList: [],
  operationFormulaList: [],
  operationConditionList: [],
  dataTypeConditionList: [],
  data_detail_late_charge_rule: null,
  data_detail_draft_late_charge_rule: null,
  message: "",
};

export const getLateChargePaginate = createAsyncThunk(
  "GET_LATE_CHARGE_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/master/late-charge/view_master?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const downloadLateCharge = createAsyncThunk(
  "DOWNLOAD_LATE_CHARGE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/master/late-charge/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.downloadData(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_LATE_CHARGE",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getDetailLateCharge = createAsyncThunk(
  "GET_DETAIL_LATE_CHARGE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/detail-latecharge/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);
export const createLateCharge = createAsyncThunk(
  "CREATE_LATE_CHARGE",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/late-charge/create-master";
      const response = await accountManagementService.createData(url, body);
      // const successBody = {
      //   title: `Successful`,
      //   description: "Your data has been created.",
      // };
      // thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not created. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);
export const updateLateCharge = createAsyncThunk(
  "UPDATE_LATE_CHARGE",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/late-charge/update-header";
      const response = await accountManagementService.updateData(url, body);
      const successBody = {
        title: `Successful`,
        description: "Your data has been updated.",
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not updated. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);
export const activeInactiveLateCharge = createAsyncThunk(
  "ACTIVE_INACTIVE_LATE_CHARGE",
  async ({ body, activeOrInactive }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/late-charge/inactive-latecharge";
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

export const getSelectCriteria = createAsyncThunk(
  "GET_SELECT_CRITERIA_LATE_CHARGE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/get-criteria`;
      const response = await accountManagementService.getAll(url);
      return (response?.data || []).map((item) => ({
        label: item.text,
        value: item.id,
        code: item?.code,
      }));
      // return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getSelectCurrency = createAsyncThunk(
  "GET_SELECT_CURRENCY_LATE_CHARGE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/list-currency`;
      const response = await accountManagementService.getAll(url);
      return (response?.data || []).map((item) => ({
        label: item.text,
        value: item.id,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

/** Get List Criteria */
export const getCountryList = createAsyncThunk(
  "GET_COUNTRY_LATE_CHARGE_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/list-premise-country`;
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
  "GET_PROVINCE_LATE_CHARGE_LIST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/list-premise-province/${id}`;
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
  "GET_CITY_LATE_CHARGE_LIST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/list-premise-city/${id}`;
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
  "GET_COST_CENTER_LATE_CHARGE_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/list-cost-center`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getSorList = createAsyncThunk(
  "GET_SOR_LATE_CHARGE_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/list-sor`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getDistrictList = createAsyncThunk(
  "GET_DISTRICT_LATE_CHARGE_LIST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/list-premise-district/${id}`;
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

export const getSubDistrictList = createAsyncThunk(
  "GET_SUB_DISTRICT_LATE_CHARGE_LIST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/list-premise-sub-district/${id}`;
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

export const getAccountNumberList = createAsyncThunk(
  "GET_ACCOUNT_NUMBER_LATE_CHARGE_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/list-account-number`;
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
  "GET_CLASSIFICATION_TYPE_LATE_CHARGE_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/list-classification-type`;
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
  "GET_ACCOUNT_SEGMENT_LATE_CHARGE_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/list-account-segment`;
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

export const getSATypeList = createAsyncThunk(
  "GET_SA_TYPE_LATE_CHARGE_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/list-sa-type`;
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

export const getAccountCategoryList = createAsyncThunk(
  "GET_ACCOUNT_CATEGORY_LATE_CHARGE_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/list-account-category`;
      const response = await accountManagementService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getAccountGroupList = createAsyncThunk(
  "GET_ACCOUNT_GROUP_LATE_CHARGE_LIST",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/list-account-group-type/${id}`;
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
  "GET_ACCOUNT_TYPE_LATE_CHARGE_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/list-account-type`;
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

export const getLateChargeRulePaginate = createAsyncThunk(
  "GET_LATE_CHARGE_RULE_PAGINATE",
  async ({ id, page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/master/late-charge/view-latecharge-rule/${id}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getListAppHier = createAsyncThunk(
  "GET_LIST_APP_HIER_LATE_CHARGE_RULE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/late-charge/list-approval-header";
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const getListAppHierDetail = createAsyncThunk(
  "GET_LIST_APP_HIER_DETAIL_LATE_CHARGE_RULE",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/list-selected-approval-header/${id}`;
      const response = await accountManagementService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY_LATE_CHARGE_RULE",
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

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_LATE_CHARGE_RULE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/approvalhistory/${id}`;
      const response = await accountManagementService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const inactiveLateChargeRule = createAsyncThunk(
  "INACTIVE_LATE_CHARGE_RULE",
  async ({ data }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/inactive-latecharge-rule`;
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

export const getVariableNameList = createAsyncThunk(
  "GET_VARIABLE_NAME_LATE_CHARGE_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/list-variable-name`;
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
  "GET_OPERATION_FORMULA_LATE_CHARGE_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/list-formula-operation`;
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
  "GET_OPERATOR_CONDITION_LATE_CHARGE_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/list-condition-operator`;
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

export const getDataTypeConditionList = createAsyncThunk(
  "GET_DATA_TYPE_CONDITION_LATE_CHARGE_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/list-data-type`;
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

export const getDetailLateChargeRule = createAsyncThunk(
  "GET_DETAIL_LATE_CHARGE_RULE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/detail-latecharge-rule/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const getDetailDraftLateChargeRule = createAsyncThunk(
  "GET_DETAIL_DRAFT_LATE_CHARGE_RULE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/detail-latecharge-rule-draft/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const approvalCreateLateChargeRule = createAsyncThunk(
  "APPROVAL_CREATE_LATE_CHARGE_RULE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/approve-latecharge-rule`;
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

export const approvalInactiveLateChargeRule = createAsyncThunk(
  "APPROVAL_INACTIVE_LATE_CHARGE_RULE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/approve-inactive-latecharge-rule`;
      const response = await accountManagementService.activationWithRemark(
        url,
        body,
      );
      const successBody = {
        title: "Successful",
        description: `Your data has been late charge ${
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

export const createLateChargeRuleBody = createAsyncThunk(
  "CREATE_LATE_CHARGE_RULE",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/late-charge/create-rule";
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

export const updateLateChargeRuleBody = createAsyncThunk(
  "UPDATE_LATE_CHARGE_RULE",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/master/late-charge/update-late-charge-rule";
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
export const deleteLateChargeRule = createAsyncThunk(
  "DELETE_LATE_CHARGE_RULE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/delete-draft/${id}`;
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
  "CHECK_STARTDATE_LATE_CHARGE_RULE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/master/late-charge/check-start-date`;
      const response = await accountManagementService.createData(url, body);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

const lateChargeSlice = createSlice({
  name: "late_charge",
  initialState,
  extraReducers: {
    // pagination
    [getLateChargePaginate.pending]: (state, action) => {
      state.loading = true;
    },
    [getLateChargePaginate.rejected]: (state, action) => {
      state.loading = false;
    },
    [getLateChargePaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // download
    [downloadLateCharge.pending]: (state, action) => {
      state.loading = true;
    },
    [downloadLateCharge.rejected]: (state, action) => {
      state.loading = false;
    },
    [downloadLateCharge.fulfilled]: (state, action) => {
      state.loading = false;
    },
    // detail
    [getDetailLateCharge.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailLateCharge.rejected]: (state, action) => {
      state.loading = false;
    },
    [getDetailLateCharge.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    // create
    [createLateCharge.pending]: (state, action) => {
      state.loading = true;
    },
    [createLateCharge.rejected]: (state, action) => {
      state.loading = false;
    },
    [createLateCharge.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // update
    [updateLateCharge.pending]: (state, action) => {
      state.loading = true;
    },
    [updateLateCharge.rejected]: (state, action) => {
      state.loading = false;
    },
    [updateLateCharge.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    // activation
    [activeInactiveLateCharge.pending]: (state, action) => {
      state.loading = true;
    },
    [activeInactiveLateCharge.rejected]: (state, action) => {
      state.loading = false;
    },
    [activeInactiveLateCharge.fulfilled]: (state, action) => {
      state.loading = false;
      // state.data = action.payload;
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
    /** List Select Currency */
    [getSelectCurrency.pending]: (state, action) => {
      state.loading = true;
    },
    [getSelectCurrency.fulfilled]: (state, action) => {
      state.dataListCurrency = action.payload;
      state.loading = false;
    },
    [getSelectCurrency.rejected]: (state, action) => {
      state.dataListCurrency = [];
      state.loading = false;
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

    [getLateChargeRulePaginate.pending]: (state, action) => {
      state.loading = true;
    },
    [getLateChargeRulePaginate.rejected]: (state, action) => {
      state.loading = false;
    },
    [getLateChargeRulePaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_late_charge_rule = action.payload;
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
    /** Inactive Late Charge Rule */
    [inactiveLateChargeRule.pending]: (state, action) => {
      state.loading = true;
    },
    [inactiveLateChargeRule.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [inactiveLateChargeRule.rejected]: (state, action) => {
      state.loading = false;
    },
    /** List Variable Name */
    [getVariableNameList.pending]: (state, action) => {
      state.loading = true;
    },
    [getVariableNameList.fulfilled]: (state, action) => {
      state.variableNameList = action.payload;
      state.loading = false;
    },
    [getVariableNameList.rejected]: (state, action) => {
      state.variableNameList = [];
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
    [getDataTypeConditionList.pending]: (state, action) => {
      state.loading = true;
    },
    [getDataTypeConditionList.fulfilled]: (state, action) => {
      state.dataTypeConditionList = action.payload;
      state.loading = false;
    },
    [getDataTypeConditionList.rejected]: (state, action) => {
      state.dataTypeConditionList = [];
      state.loading = false;
    },
    /**detail late charge rule*/
    [getDetailLateChargeRule.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailLateChargeRule.rejected]: (state, action) => {
      state.loading = false;
      state.data_detail_late_charge_rule = null;
    },
    [getDetailLateChargeRule.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail_late_charge_rule = action.payload;
    },
    /**detail draft late charge rule*/
    [getDetailDraftLateChargeRule.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailDraftLateChargeRule.rejected]: (state, action) => {
      state.loading = false;
      state.data_detail_draft_late_charge_rule = null;
    },
    [getDetailDraftLateChargeRule.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail_draft_late_charge_rule = action.payload;
    },
    /** Approve Late Charge Rule */
    [approvalCreateLateChargeRule.pending]: (state, action) => {
      state.loading = true;
    },
    [approvalCreateLateChargeRule.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [approvalCreateLateChargeRule.rejected]: (state, action) => {
      state.loading = false;
    },
    /** Approve Inactive Late Charge Rule */
    [approvalInactiveLateChargeRule.pending]: (state, action) => {
      state.loading = true;
    },
    [approvalInactiveLateChargeRule.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [approvalInactiveLateChargeRule.rejected]: (state, action) => {
      state.loading = false;
    },
    /** delete late charge Rule */
    [deleteLateChargeRule.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteLateChargeRule.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [deleteLateChargeRule.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

const { reducer } = lateChargeSlice;
export default reducer;
