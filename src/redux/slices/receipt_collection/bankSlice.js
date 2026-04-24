import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../general_slice";
import accountManagementService from "../../services/account_management/accountManagementService";

const initialState = {
  loading: false,
  data: null,
  data_detail: null,
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataListCategory: [],
  dataBankNotBranch: [],
  data_contact: [],
  data_position: [],
  data_job: [],
  data_countryCode: [],
  data_countryZone: [],
  data_contactType: [],
  data_inputType: [],
  dataEntity: [],
  dataCurrency: [],
  data_type_detail: [],
  dataAccountInfoPaging: [],
  data_detail_draft: [],
  data_modal: [],
  dataVA: [],
  dataApprovalHistory: [],

  //criteria

  data_select_criteria: [],
  dataListCurrency: [],
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
  dataListAttachment: {},
  dataListCriteriaValue: {},
  message: "",

  // GL Account (Existing)
  data_list_gl: null,
  
  // --- TAMBAHAN STATE BARU UNTUK BANK FORM ---
  dataGLAccount: [],
  dataGLType: [],
  data_contactAddress: [],
  // Category Information
  data_va_category: [],
  data_nomenklatur1: [],
  data_nomenklatur2: [],
  data_display: [],
  data_billing_item: [],
  // VA Account / VA Transaction sub-tabs
  dataVAAccount: [],
  dataVATransaction: [],
  // OP Account / OP Transaction / OP Custom sub-tabs
  dataOPAccount: [],
  dataOPTransaction: [],
  dataOPCustom: [],
  // ------------------------------------------
  dataCriteriaView: [],
  data_parent_options: [],
  parentOptionsLoading: false,
};

export const createAccountInformation = createAsyncThunk(
  "CREATE_MASTER_BANK_ACCOUNT",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account-information/create`;
      const data = await receiptCollectionHttpService.createData(url, body);
      return data.data;
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const updateBankAccountInfo = createAsyncThunk(
  "UPDATE_BANK_ACCOUNT_INFO",
  async ({ id, data }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank-accounts/${id}`;
      const res = await receiptCollectionHttpService.updateData(url, data);
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const updateBankAccountNomenklatur = createAsyncThunk(
  "UPDATE_BANK_ACCOUNT_NOMENKLATUR",
  async ({ id, data }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank-accounts/${id}/nomenklatur`;
      const res = await receiptCollectionHttpService.updateData(url, data);
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const updateBankAccountGLAccounts = createAsyncThunk(
  "UPDATE_BANK_ACCOUNT_GL",
  async ({ id, data }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank-accounts/${id}/gl-accounts`;
      const res = await receiptCollectionHttpService.updateData(url, data);
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const updateBankAccountCriteria = createAsyncThunk(
  "UPDATE_BANK_ACCOUNT_CRITERIA",
  async ({ id, data }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank-accounts/${id}/criteria`;
      const res = await receiptCollectionHttpService.updateData(url, data);
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(showModalError({ title: "Failed", description: message }));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getAccountInformationPaging = createAsyncThunk(
  "GET_ALL_ACCOUNT_INFORMATION",
  async ({ id, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/bank/account-information/get-list/${id}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getPaginateBank = createAsyncThunk(
  "GET_ALL_BANK",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/bank/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "GET_ALL_BANK",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const getAccountVApagging = createAsyncThunk(
  "GET_ALL_VA_INFORMATION",
  async ({ id, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/bank/account/va/get-list/${id}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getVAAccountList = createAsyncThunk(
  "GET_VA_ACCOUNT_LIST",
  async ({ id, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "activationDate~desc" : sort;
      const url = `/v1/dbs/api/bank/va-account/get-list/${id}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getVATransactionList = createAsyncThunk(
  "GET_VA_TRANSACTION_LIST",
  async ({ id, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "activationDate~desc" : sort;
      const url = `/v1/dbs/api/bank/va-transaction/get-list/${id}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getOPAccountList = createAsyncThunk(
  "GET_OP_ACCOUNT_LIST",
  async ({ id, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "activationDate~desc" : sort;
      const url = `/v1/dbs/api/bank/op-account/get-list/${id}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getOPTransactionList = createAsyncThunk(
  "GET_OP_TRANSACTION_LIST",
  async ({ id, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "activationDate~desc" : sort;
      const url = `/v1/dbs/api/bank/op-transaction/get-list/${id}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getOPCustomList = createAsyncThunk(
  "GET_OP_CUSTOM_LIST",
  async ({ id, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "activationDate~desc" : sort;
      const url = `/v1/dbs/api/bank/op-custom/get-list/${id}?search=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const approveVaActivation = createAsyncThunk(
  "APPROVE_VA_ACTIVATION",
  async ({ bankId, vaNumbers, attachments }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/virtual-accounts/${bankId}/approve`;
      const response = await receiptCollectionHttpService.createData(url, {
        vaNumbers,
        attachments,
      });
      thunkAPI.dispatch(
        showModalSuccess({
          title: "Success",
          description: "VA Account activation approved successfully.",
        })
      );
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getDetailAccountInformation = createAsyncThunk(
  "GET_DETAIL_ACCOUNT_INFORMATION_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account-information/detail-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getBankDetail = createAsyncThunk(
  "GET_BANK_SLICE_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/detail-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DETAIL_MASTER_BANK",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const getBankDetailDraft = createAsyncThunk(
  "GET_BANK_SLICE_DETAIL_DRAFT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/draft/detail-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return Array.isArray(response?.data) ? null : response?.data;
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getDownloadBank = createAsyncThunk(
  "DOWNLOAD_MASTER_DATA_BANK",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/bank/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_ACTION",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const getDownloadBankStatement = createAsyncThunk(
  "DOWNLOAD_BANKT_STATMENT",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/bank/statement/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_ACTION_STATMENT_BAN",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response);
    }
  }
);

export const inactiveBank = createAsyncThunk(
  "INACTIVE_BANK",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/update-status`;
      const response = await receiptCollectionHttpService.activationWithRemark(
        url,
        body
      );
      const successMessage = {
        title: "Successfull",
        description: "Your data has been submitted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const inactiveBankAccount = createAsyncThunk(
  "INACTIVE_BANK_ACCOUNTS",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account-inactive`;
      const response =
        await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      const successMessage = {
        title: "Successfull",
        description: "Your data has been submitted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getAllApprovalList = createAsyncThunk(
  "GET_ALL_APPROVAL_LIST",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/apphier/get-list-approval-hierarchies`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getAllBankNotBranch = createAsyncThunk(
  "GET_ALL_BANK_NOT_BRANCH",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/not-branch`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getJobContact = createAsyncThunk(
  "GET_ALL_JOB_CONTACT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/contact-job/get`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getPositionContact = createAsyncThunk(
  "GET_ALL_POSITION_CONTACT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/contact-position/get`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getZoneContact = createAsyncThunk(
  "GET_ALL_ZONE_CONTACT_BANKS",
  async (id, thunkAPI) => {
    if (id !== undefined) {
      try {
        const url = `/v1/dbs/api/account/contact/getZone/${id}`;
        const response = await accountManagementService.getAll(url);
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
        return thunkAPI.rejectWithValue(error.response);
      }
    }
  }
);

export const getContryContact = createAsyncThunk(
  "GET_ALL_COUNTRY_CONTACT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/country-code`;
      const response = await accountManagementService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getAllContactPaginate = createAsyncThunk(
  "GET_ALL_CONTACT",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/contact/bank/choose?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await accountManagementService.getPagination(url);
      return response;
    } catch (error) {
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        const errorBody = {
          title: "Failed",
          description: `Terdapat kesalahan saat mencoba untuk mendapatkan data kontak.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Terdapat kesalahan saat mencoba untuk mendapatkan data kontak.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListApprovalById = createAsyncThunk(
  "GET_LIST_APPROVAL_BY_ID",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/apphier/get-approval-hierarchies/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const approveOrRejectInactiveBank = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_BANK",
  async ({ body }, thunkAPI) => {
    try {
      let url = "";
      if (body.type.toLowerCase() === "bank") {
        url = "/v1/dbs/api/bank/approve-reject";
      } else {
        url = "/v1/dbs/api/bank/approve-inactive";
      }
      const response =
        await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      const message = response?.message;
      const successMessage = {
        title: "Successfull",
        description: `${message}`,
        return: true,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
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

export const approveOrRejectInactiveBankAccount = createAsyncThunk(
  "APPROVE_OR_REJECT_INACTIVE_BANK_ACCOUNTS",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/bank/account-approve-inactive";
      const response =
        await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      const message = response?.message;
      thunkAPI.dispatch(showModalSuccess(message));
      return response.data;
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

export const approveOrRejectBankAccount = createAsyncThunk(
  "APPROVE_OR_REJECT_ACCOUNT_BANK_DETAIL",
  async ({ body }, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/bank/account/approve";
      const response =
        await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      const messageBody = {
        title: `Successful`,
        description: `Your data has been ${
          body.action === "APPROVED" ? "Approved" : "Rejected"
        }.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(messageBody));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `Your data was not ${
            body.action === "APPROVED" ? "Approve" : "Reject"
          }. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY_TRANSACTION",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/attachment/list-category";
      const response = await receiptCollectionHttpService.getAll(url);
      const mappCategory = response.data?.data?.map((item) => ({
        Id: item.glbTypeValId,
        text: item?.name,
      }));
      return mappCategory;
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getInputType = createAsyncThunk(
  "GET_LIST_INPUT_TYPE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/account/input-type";
      const response = await accountManagementService.getAll(url);
      return response;
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getInputTypeContact = createAsyncThunk(
  "GET_LIST_INPUT_TYPE_CONTACT",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/account/contact-type";
      const response = await accountManagementService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const createMasterBank = createAsyncThunk(
  "CREATE_MASTER_BANK",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/create-update`;
      const data = await receiptCollectionHttpService.createData(url, body);
      return data.data;
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
          description: `Your data was not created. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createValidasiBank = createAsyncThunk(
  "CREATE_MASTER_BANK_VALIDASI",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/validate-create-update`;
      const data = await receiptCollectionHttpService.createData(url, body);
      return data.data;
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
          description: `Your data was not created. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createValidasiBankAccount = createAsyncThunk(
  "CREATE_BANK_VALIDASI_BANK_ACCOUNT",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/validate-create-bank-account`;
      const data = await receiptCollectionHttpService.createData(url, body);
      return data.data;
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
          description: `Your data was not created. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const UpdateValidasiBankAccount = createAsyncThunk(
  "UPDATE_BANK_VALIDASI_BANK_ACCOUNT",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/validate-update-bank-account`;
      const data = await receiptCollectionHttpService.createData(url, body);
      return data.data;
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
          description: `Your data was not created. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getTypeList = createAsyncThunk(
  "GET_LIST_TYPE_DETAIL",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/bank/account-type/get";
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListCriteria = createAsyncThunk(
  "GET_LIST_CRITERIA",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/bank/account-criteria-list/get";
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getProvinceList = createAsyncThunk(
  "GET_PROVINCE_LIST_BANK",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account-province/get`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getCityList = createAsyncThunk(
  "GET_CITY_LIST_BANK",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account-city-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getDistrictList = createAsyncThunk(
  "GET_DISTRICT_LIST_BANK",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account-district-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getSubDistrictList = createAsyncThunk(
  "GET_SUB_DISTRICT_LIST_BANK",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account-subdistrict-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getProductList = createAsyncThunk(
  "GET_PRODUCT_LIST_BANK",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account-product/get`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getCostCenterList = createAsyncThunk(
  "GET_AREA",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account-area/get`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getSorList = createAsyncThunk(
  "GET_SOR_LIST_BANK",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account-sor/get`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getGsizesList = createAsyncThunk(
  "GET_GSIZE_LIST_PRICING",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account-gsizes/get`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getCustomerSegment = createAsyncThunk(
  "GET_CUSTOMER_SEGMENT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account-customer-segment/get`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getIndustrialSectorList = createAsyncThunk(
  "GET_INDUSTRIAL_SECTOR_LIST_BANK",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account-industrial-sector/get`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getServiceTypeList = createAsyncThunk(
  "GET_SERVICE_TYPE_LIST_BANK",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account-class/get`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getAccountCategoryList = createAsyncThunk(
  "GET_ACCOUNT_CATEGORY_LIST_BANK",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account-category/get`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getAccountGroupList = createAsyncThunk(
  "GET_ACCOUNT_GROUP_LIST_BANK",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account-group-get/${id}`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListCurrency = createAsyncThunk(
  "GET_CURRENCY_LIST_BANK",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/currency/get`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getListEntity = createAsyncThunk(
  "GET_ENTITY_LIST_BANK",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/entity/get`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getCustomer = createAsyncThunk(
  "GET_CUSTOMER_LIST_CRITERIA",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account-customer/get`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getBudgetList = createAsyncThunk(
  "GET_BUDGET_LIST_BANK",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account-budget/get`;
      const response = await receiptCollectionHttpService.getAll(url);
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_BANK_MASTER",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/approval-history-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_APPROVAL_HISTORY_BANK_MASTER",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getApprovalHistoryBankAccount = createAsyncThunk(
  "GET_APPROVAL_HISTORY_BANK_MASTER_ACCOUNT",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account/approval-history-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
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
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

// Existing get GL Account
export const getGLAccount = createAsyncThunk(
  "GET_GL_ACCOUNT",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/bank/gl-account/get";
      const response = await receiptCollectionHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, actions: "GET_GL_ACCOUNT", back: false })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// --- TAMBAHAN BARU UNTUK BANK FORM (GET ALL GL ACCOUNT & GET ALL GL TYPE) ---
export const getAllGLAccount = createAsyncThunk(
  "GET_ALL_GL_ACCOUNT",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/bank/gl-account/get";
      const response = await receiptCollectionHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, actions: "GET_ALL_GL_ACCOUNT", back: false })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getAllGLType = createAsyncThunk(
  "GET_ALL_GL_TYPE",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/bank/gl-type/get";
      const response = await receiptCollectionHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, actions: "GET_ALL_GL_TYPE", back: false })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getContactAddress = createAsyncThunk(
  "GET_CONTACT_ADDRESS",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/bank/contact-address/get";
      const response = await receiptCollectionHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, actions: "GET_CONTACT_ADDRESS", back: false })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
// --- CATEGORY INFORMATION THUNKS ---
export const getVACategoryOptions = createAsyncThunk(
  "GET_VA_CATEGORY_OPTIONS",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/bank/va-category/get";
      const response = await receiptCollectionHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, actions: "GET_VA_CATEGORY_OPTIONS", back: false })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getNomenklatur1Options = createAsyncThunk(
  "GET_NOMENKLATUR1_OPTIONS",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/bank/nomenklatur1/get";
      const response = await receiptCollectionHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, actions: "GET_NOMENKLATUR1_OPTIONS", back: false })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getNomenklatur2Options = createAsyncThunk(
  "GET_NOMENKLATUR2_OPTIONS",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/bank/nomenklatur2/get";
      const response = await receiptCollectionHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, actions: "GET_NOMENKLATUR2_OPTIONS", back: false })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getDisplayOptions = createAsyncThunk(
  "GET_DISPLAY_OPTIONS",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/bank/display/get";
      const response = await receiptCollectionHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, actions: "GET_DISPLAY_OPTIONS", back: false })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getBillingItemOptions = createAsyncThunk(
  "GET_BILLING_ITEM_OPTIONS",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/bank/billing-item/get";
      const response = await receiptCollectionHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, actions: "GET_BILLING_ITEM_OPTIONS", back: false })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getBillingItemOptionsByCategory = createAsyncThunk(
  "GET_BILLING_ITEM_OPTIONS_BY_CATEGORY",
  async (categoryId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/billing-item/get-by-category?categoryId=${categoryId}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, actions: "GET_BILLING_ITEM_OPTIONS_BY_CATEGORY", back: false })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
// ------------------------------------

export const getAccountCriteriaView = createAsyncThunk(
  "GET_ACCOUNT_CRITERIA_VIEW",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account-criteria-view/get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response?.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, actions: "GET_ACCOUNT_CRITERIA_VIEW", back: false })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const getParentAccountOptions = createAsyncThunk(
  "GET_PARENT_ACCOUNT_OPTIONS",
  async (bankId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/bank/account-information/parent-options/${bankId}`;
      const data = await receiptCollectionHttpService.getDetail(url);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const bankSlice = createSlice({
  name: "bank",
  initialState,
  extraReducers: {
    
    /** Get Approval History */
    [getApprovalHistory.pending]: (state, action) => {
      state.loading = true;
      state.dataApprovalHistory = action.payload;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loading = false;
    },
    [getApprovalHistory.rejected]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loading = false;
    },

    /** Get Approval History bank account */
    [getApprovalHistoryBankAccount.pending]: (state, action) => {
      state.loadingCalender = true;
      state.dataApprovalHistoryBankAccount = action.payload;
    },
    [getApprovalHistoryBankAccount.fulfilled]: (state, action) => {
      state.dataApprovalHistoryBankAccount = action.payload;
      state.loadingCalender = false;
    },
    [getApprovalHistoryBankAccount.rejected]: (state, action) => {
      state.dataApprovalHistoryBankAccount = action.payload;
      state.loadingCalender = false;
    },

    //get all employee paginate reducer
    [getPaginateBank.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [getPaginateBank.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getPaginateBank.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },

    // getAccountInformationPaging

    [getAccountInformationPaging.pending]: (state, action) => {
      state.dataAccountInfoPaging = action.payload;
      state.loading = true;
    },
    [getAccountInformationPaging.fulfilled]: (state, action) => {
      state.dataAccountInfoPaging = action.payload;
      state.loading = false;
    },
    [getAccountInformationPaging.rejected]: (state, action) => {
      state.dataAccountInfoPaging = action.payload;
      state.loading = true;
    },

    // getAccount VA

    [getAccountVApagging.pending]: (state, action) => {
      state.dataVA = action.payload;
      state.loading = true;
    },
    [getAccountVApagging.fulfilled]: (state, action) => {
      state.dataVA = action.payload;
      state.loading = false;
    },
    [getAccountVApagging.rejected]: (state, action) => {
      state.dataVA = action.payload;
      state.loading = true;
    },

    // get detail akun information
    [getDetailAccountInformation.pending]: (state) => {
      state.loading = true;
    },
    [getDetailAccountInformation.fulfilled]: (state, action) => {
      state.data_modal = action.payload;
      state.loading = false;
    },
    [getDetailAccountInformation.rejected]: (state) => {
      state.loading = true;
    },

    // get detail
    [getBankDetail.pending]: (state) => {
      state.loading = true;
    },
    [getBankDetail.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getBankDetail.rejected]: (state) => {
      state.loading = true;
    },

    //draft detail
    [getBankDetailDraft.pending]: (state) => {
      state.loading = true;
    },
    [getBankDetailDraft.fulfilled]: (state, action) => {
      state.data_detail_draft = action.payload;
      state.loading = false;
    },
    [getBankDetailDraft.rejected]: (state) => {
      state.loading = true;
    },

    // inactive app
    [inactiveBank.pending]: (state) => {
      state.loading = true;
    },
    [inactiveBank.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveBank.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },

    //inactve bank account
    [inactiveBankAccount.pending]: (state) => {
      state.loading = true;
    },
    [inactiveBankAccount.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [inactiveBankAccount.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },

    // Get Approve Hierarchy List
    [getAllApprovalList.pending]: (state, action) => {
      state.loading = true;
      state.dataListAppHierId = action.payload;
    },
    [getAllApprovalList.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    [getAllApprovalList.rejected]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },

    // Get List Approval By Id
    [getListApprovalById.pending]: (state, action) => {
      state.loading = true;
      state.dataListAppHierDetail = action.payload;
    },
    [getListApprovalById.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },
    [getListApprovalById.rejected]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
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

    // Approve Or Reject BANK
    [approveOrRejectInactiveBank.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectInactiveBank.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveOrRejectInactiveBank.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },
    // Approve Or Reject BANK account
    [approveOrRejectInactiveBankAccount.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectInactiveBankAccount.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveOrRejectInactiveBankAccount.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    //approve reject bak account
    [approveOrRejectBankAccount.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectBankAccount.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [approveOrRejectBankAccount.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    /** Get All Bank not branch */
    [getAllBankNotBranch.pending]: (state, action) => {
      state.dataBankNotBranch = action.payload;
      state.loadingProduct = true;
    },
    [getAllBankNotBranch.fulfilled]: (state, action) => {
      state.dataBankNotBranch = action.payload;
      state.loadingProduct = false;
    },
    [getAllBankNotBranch.rejected]: (state, action) => {
      state.dataBankNotBranch = action.payload;
      state.loadingProduct = false;
    },

    //get all contact paginate reducer
    [getAllContactPaginate.pending]: (state, action) => {
      state.data_contact = action.payload;
      state.loading = true;
    },
    [getAllContactPaginate.fulfilled]: (state, action) => {
      state.data_contact = action.payload;
      state.loading = false;
    },
    [getAllContactPaginate.rejected]: (state, action) => {
      state.data_contact = action.payload;
      state.loading = true;
    },

    /** Get All Position */
    [getPositionContact.pending]: (state, action) => {
      state.data_position = action.payload;
      state.loadingProduct = true;
    },
    [getPositionContact.fulfilled]: (state, action) => {
      state.data_position = action.payload;
      state.loadingProduct = false;
    },
    [getPositionContact.rejected]: (state, action) => {
      state.data_position = action.payload;
      state.loadingProduct = false;
    },
    /** Get All Job */
    [getJobContact.pending]: (state, action) => {
      state.data_job = action.payload;
      state.loadingProduct = true;
    },
    [getJobContact.fulfilled]: (state, action) => {
      state.data_job = action.payload;
      state.loadingProduct = false;
    },
    [getJobContact.rejected]: (state, action) => {
      state.data_job = action.payload;
      state.loadingProduct = false;
    },
    /** Get All Zone */
    [getZoneContact.pending]: (state, action) => {
      state.data_countryZone = action.payload;
      state.loadingProduct = true;
    },
    [getZoneContact.fulfilled]: (state, action) => {
      state.data_countryZone = action.payload;
      state.loadingProduct = false;
    },
    [getZoneContact.rejected]: (state, action) => {
      state.data_countryZone = action.payload;
      state.loadingProduct = false;
    },
    /** Get All counrty code  */
    [getContryContact.pending]: (state, action) => {
      state.data_countryCode = action.payload;
      state.loadingProduct = true;
    },
    [getContryContact.fulfilled]: (state, action) => {
      state.data_countryCode = action.payload;
      state.loadingProduct = false;
    },
    [getContryContact.rejected]: (state, action) => {
      state.data_countryCode = action.payload;
      state.loadingProduct = false;
    },

    // Get Input Type
    [getInputType.pending]: (state, action) => {
      state.loading = true;
      state.data_inputType = action.payload;
    },
    [getInputType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_inputType = action.payload;
    },
    [getInputType.rejected]: (state, action) => {
      state.loading = false;
      state.data_inputType = action.payload;
    },

    // Get Contact Type
    [getInputTypeContact.pending]: (state, action) => {
      state.loading = true;
      state.data_contactType = action.payload;
    },
    [getInputTypeContact.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_contactType = action.payload;
    },
    [getInputTypeContact.rejected]: (state, action) => {
      state.loading = false;
      state.data_contactType = action.payload;
    },
    // create bank
    [createMasterBank.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createMasterBank.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createMasterBank.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    //validasi create bank
    [createValidasiBank.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createValidasiBank.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createValidasiBank.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // create bank account
    [createAccountInformation.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createAccountInformation.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createAccountInformation.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // validasi updatea and creaet
    [createValidasiBankAccount.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createValidasiBankAccount.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createValidasiBankAccount.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    // validasi updatea and creaet
    [UpdateValidasiBankAccount.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [UpdateValidasiBankAccount.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [UpdateValidasiBankAccount.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // criteriaaa

    /** Get List Criteria */
    [getListCriteria.pending]: (state, action) => {
      state.loading = true;
      state.data_select_criteria = action.payload;
    },
    [getListCriteria.fulfilled]: (state, action) => {
      state.data_select_criteria = action.payload;
      state.loading = false;
    },
    [getListCriteria.rejected]: (state, action) => {
      state.data_select_criteria = action.payload;
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
      state.loadingPricing = false;
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
      state.loadingPricing = false;
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

    // Get Customer Segment List
    [getCustomerSegment.pending]: (state, action) => {
      state.loading = true;
      state.data_customerSegment = action.payload;
    },
    [getCustomerSegment.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_customerSegment = action.payload;
    },
    [getCustomerSegment.rejected]: (state, action) => {
      state.loading = false;
      state.data_customerSegment = action.payload;
    },

    // Get Customer Segment List
    [getCustomer.pending]: (state, action) => {
      state.loading = true;
      state.data_customer = action.payload;
    },
    [getCustomer.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_customer = action.payload;
    },
    [getCustomer.rejected]: (state, action) => {
      state.loading = false;
      state.data_customer = action.payload;
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
    // list curency
    [getListCurrency.pending]: (state, action) => {
      state.loading = true;
      state.dataCurrency = action.payload;
    },
    [getListCurrency.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataCurrency = action.payload;
    },
    [getListCurrency.rejected]: (state, action) => {
      state.loading = false;
      state.dataCurrency = action.payload;
    },
    // entity
    [getListEntity.pending]: (state, action) => {
      state.loading = true;
      state.dataEntity = action.payload;
    },
    [getListEntity.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataEntity = action.payload;
    },
    [getListEntity.rejected]: (state, action) => {
      state.loading = false;
      state.dataEntity = action.payload;
    },

    // typee
    [getTypeList.pending]: (state, action) => {
      state.loading = true;
      state.data_type_detail = action.payload;
    },
    [getTypeList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_type_detail = action.payload;
    },
    [getTypeList.rejected]: (state, action) => {
      state.loading = false;
      state.data_type_detail = action.payload;
    },

    //download
    [getDownloadBank.fulfilled]: (state, action) => {
      state.data_download = action.payload;
      state.loading = false;
    },
    [getDownloadBank.rejected]: (state, action) => {
      state.isFailed = true;
      state.data_download = action.payload;
      state.loading = false;
    },
    [getDownloadBankStatement.fulfilled]: (state, action) => {
      state.data_download_statement = action.payload;
      state.loading = false;
    },
    [getDownloadBankStatement.rejected]: (state, action) => {
      state.isFailed = true;
      state.data_download_statement = action.payload;
      state.loading = false;
    },
    
    // Existing GL Account (Dibiarkan supaya gak merusak logic lain)
    [getGLAccount.pending]: (state) => {
      state.loading = true;
    },
    [getGLAccount.rejected]: (state) => {
      state.loading = false;
    },
    [getGLAccount.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_list_gl = action.payload;
    },

    // --- TAMBAHAN REDUCER UNTUK BANK FORM ---
    [getAllGLAccount.pending]: (state) => {
      state.loading = true;
    },
    [getAllGLAccount.rejected]: (state) => {
      state.loading = false;
    },
    [getAllGLAccount.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataGLAccount = action.payload; 
    },

    [getAllGLType.pending]: (state) => {
      state.loading = true;
    },
    [getAllGLType.rejected]: (state) => {
      state.loading = false;
    },
    [getAllGLType.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataGLType = action.payload; 
    },
    [getContactAddress.pending]: (state) => {
      state.loading = true;
    },
    [getContactAddress.fulfilled]: (state, action) => {
      state.loading = false;
      // Karena di thunk return-nya response?.data, action.payload ini bakal langsung berisi data balikan API
      state.data_contactAddress = action.payload; 
    },
    [getContactAddress.rejected]: (state) => {
      state.loading = false;
      state.data_contactAddress = [];
    },
    // Category Information
    [getVACategoryOptions.pending]: (state) => { state.loading = true; },
    [getVACategoryOptions.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_va_category = action.payload ?? [];
    },
    [getVACategoryOptions.rejected]: (state) => { state.loading = false; },

    [getNomenklatur1Options.pending]: (state) => { state.loading = true; },
    [getNomenklatur1Options.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_nomenklatur1 = action.payload ?? [];
    },
    [getNomenklatur1Options.rejected]: (state) => { state.loading = false; },

    [getNomenklatur2Options.pending]: (state) => { state.loading = true; },
    [getNomenklatur2Options.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_nomenklatur2 = action.payload ?? [];
    },
    [getNomenklatur2Options.rejected]: (state) => { state.loading = false; },

    [getDisplayOptions.pending]: (state) => { state.loading = true; },
    [getDisplayOptions.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_display = action.payload ?? [];
    },
    [getDisplayOptions.rejected]: (state) => { state.loading = false; },

    [getBillingItemOptions.pending]: (state) => { state.loading = true; },
    [getBillingItemOptions.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_billing_item = action.payload ?? [];
    },
    [getBillingItemOptions.rejected]: (state) => { state.loading = false; },

    [getAccountCriteriaView.pending]: (state) => { state.loading = true; },
    [getAccountCriteriaView.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataCriteriaView = action.payload ?? [];
    },
    [getAccountCriteriaView.rejected]: (state) => {
      state.loading = false;
      state.dataCriteriaView = [];
    },

    // VA Account sub-tab
    [getVAAccountList.pending]: (state) => { state.loading = true; },
    [getVAAccountList.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataVAAccount = action.payload;
    },
    [getVAAccountList.rejected]: (state) => { state.loading = false; },

    // VA Transaction sub-tab
    [getVATransactionList.pending]: (state) => { state.loading = true; },
    [getVATransactionList.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataVATransaction = action.payload;
    },
    [getVATransactionList.rejected]: (state) => { state.loading = false; },

    // OP Account sub-tab
    [getOPAccountList.pending]: (state) => { state.loading = true; },
    [getOPAccountList.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataOPAccount = action.payload;
    },
    [getOPAccountList.rejected]: (state) => { state.loading = false; },

    // OP Transaction sub-tab
    [getOPTransactionList.pending]: (state) => { state.loading = true; },
    [getOPTransactionList.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataOPTransaction = action.payload;
    },
    [getOPTransactionList.rejected]: (state) => { state.loading = false; },

    // OP Custom sub-tab
    [getOPCustomList.pending]: (state) => { state.loading = true; },
    [getOPCustomList.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataOPCustom = action.payload;
    },
    [getOPCustomList.rejected]: (state) => { state.loading = false; },

    // Approve VA Activation
    [approveVaActivation.pending]: (state) => { state.loading = true; },
    [approveVaActivation.fulfilled]: (state) => { state.loading = false; },
    [approveVaActivation.rejected]: (state) => { state.loading = false; },

    // Parent account options — gunakan parentOptionsLoading agar tidak mempengaruhi
    // global loading spinner yang digunakan komponen lain
    [getParentAccountOptions.pending]: (state) => { state.parentOptionsLoading = true; },
    [getParentAccountOptions.fulfilled]: (state, action) => {
      state.parentOptionsLoading = false;
      state.data_parent_options = action.payload ?? [];
    },
    [getParentAccountOptions.rejected]: (state) => { state.parentOptionsLoading = false; },
    // ----------------------------------------
  },
});

const { reducer } = bankSlice;
export default reducer;