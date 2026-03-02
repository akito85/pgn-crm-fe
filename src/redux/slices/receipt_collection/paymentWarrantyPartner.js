import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import receiptCollectionHttpService from "../../services/receiptCollectionHttpService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../utils";

const initialState = {
  loading: false,
  data: null,
  data_detail: null,
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataListCategory: [],
  dataApprovalHistory: [],
  dataListParent: [],
  dataListPartnerType: [],
  dataListRating: [],
  dataListCriteria: [],
  partnerCode: "",
  data_rating: null,
  data_branch: null,
  data_detail_rating: null,
  data_detail_branch: null,
  data_history_rating: [],
  data_history_branch: [],
};

const BASE_URL = "/v1/dbs/api/payment-warranty-partners";

// --- RATING THUNKS ---
export const getPaginatePaymentWarrantyPartnerRating = createAsyncThunk(
  "GET_ALL_PAYMENT_WARRANTY_PARTNER_RATING",
  async ({ partnerId, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `${BASE_URL}/rating/get-list/${partnerId}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(
          validateError({
            error: error,
            action: "GET_ALL_PAYMENT_WARRANTY_PARTNER_RATING",
            back: false,
          })
        );
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const createPaymentWarrantyPartnerRating = createAsyncThunk(
  "CREATE_PAYMENT_WARRANTY_PARTNER_RATING",
  async (body, thunkAPI) => {
    try {
      const url = `${BASE_URL}/rating/create-update`;
      const data = await receiptCollectionHttpService.createData(url, body);
      return data.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message = error?.response?.data?.message || error?.message || error?.toString();
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `Your data was not saved. ${message}.` }));
      }
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getDetailPaymentWarrantyPartnerRating = createAsyncThunk(
  "GET_DETAIL_PAYMENT_WARRANTY_PARTNER_RATING",
  async (id, thunkAPI) => {
    try {
      const url = `${BASE_URL}/rating/detail-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message = error?.response?.data?.message || error?.message || error?.toString();
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const approveOrRejectPaymentWarrantyPartnerRating = createAsyncThunk(
  "APPROVE_OR_REJECT_PAYMENT_WARRANTY_PARTNER_RATING",
  async ({ body }, thunkAPI) => {
    try {
      const url = `${BASE_URL}/rating/approve-reject`;
      const response = await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      thunkAPI.dispatch(showModalSuccess({ title: "Successfull", description: `${response?.message}`, return: false }));
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message = error?.response?.data?.message || error?.message || error?.toString();
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `Your data was not updated. ${message}.`, return: false }));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getHistoryPaymentWarrantyPartnerRating = createAsyncThunk(
  "GET_HISTORY_PAYMENT_WARRANTY_PARTNER_RATING",
  async (id, thunkAPI) => {
    try {
      const url = `${BASE_URL}/rating/approval-history-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(
          validateError({
            error: error,
            action: "GET_HISTORY_PAYMENT_WARRANTY_PARTNER_RATING",
            back: false,
          })
        );
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const inactivatePaymentWarrantyPartnerRating = createAsyncThunk(
  "INACTIVATE_PAYMENT_WARRANTY_PARTNER_RATING",
  async ({ body }, thunkAPI) => {
    try {
      const url = `${BASE_URL}/rating/inactivate`;
      const response = await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      thunkAPI.dispatch(showModalSuccess({ title: "Successfull", description: "Your inactivation request has been submitted.", return: false }));
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message = error?.response?.data?.message || error?.message || error?.toString();
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `Inactivation request failed. ${message}.`, return: false }));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// --- BRANCH THUNKS ---
export const getPaginatePaymentWarrantyPartnerBranch = createAsyncThunk(
  "GET_ALL_PAYMENT_WARRANTY_PARTNER_BRANCH",
  async ({ partnerId, search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `${BASE_URL}/branch/get-list/${partnerId}?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(
          validateError({
            error: error,
            action: "GET_ALL_PAYMENT_WARRANTY_PARTNER_BRANCH",
            back: false,
          })
        );
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const createPaymentWarrantyPartnerBranch = createAsyncThunk(
  "CREATE_PAYMENT_WARRANTY_PARTNER_BRANCH",
  async (body, thunkAPI) => {
    try {
      const url = `${BASE_URL}/branch/create-update`;
      const data = await receiptCollectionHttpService.createData(url, body);
      return data.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message = error?.response?.data?.message || error?.message || error?.toString();
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `Your data was not saved. ${message}.` }));
      }
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getDetailPaymentWarrantyPartnerBranch = createAsyncThunk(
  "GET_DETAIL_PAYMENT_WARRANTY_PARTNER_BRANCH",
  async (id, thunkAPI) => {
    try {
      const url = `${BASE_URL}/branch/detail-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message = error?.response?.data?.message || error?.message || error?.toString();
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `${message}` }));
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const approveOrRejectPaymentWarrantyPartnerBranch = createAsyncThunk(
  "APPROVE_OR_REJECT_PAYMENT_WARRANTY_PARTNER_BRANCH",
  async ({ body }, thunkAPI) => {
    try {
      const url = `${BASE_URL}/branch/approve-reject`;
      const response = await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      thunkAPI.dispatch(showModalSuccess({ title: "Successfull", description: `${response?.message}`, return: false }));
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message = error?.response?.data?.message || error?.message || error?.toString();
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `Your data was not updated. ${message}.`, return: false }));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getHistoryPaymentWarrantyPartnerBranch = createAsyncThunk(
  "GET_HISTORY_PAYMENT_WARRANTY_PARTNER_BRANCH",
  async (id, thunkAPI) => {
    try {
      const url = `${BASE_URL}/branch/approval-history-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(
          validateError({
            error: error,
            action: "GET_HISTORY_PAYMENT_WARRANTY_PARTNER_BRANCH",
            back: false,
          })
        );
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const inactivatePaymentWarrantyPartnerBranch = createAsyncThunk(
  "INACTIVATE_PAYMENT_WARRANTY_PARTNER_BRANCH",
  async ({ body }, thunkAPI) => {
    try {
      const url = `${BASE_URL}/branch/inactivate`;
      const response = await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      thunkAPI.dispatch(showModalSuccess({ title: "Successfull", description: "Your inactivation request has been submitted.", return: false }));
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message = error?.response?.data?.message || error?.message || error?.toString();
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `Inactivation request failed. ${message}.`, return: false }));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// --- PARTNER THUNKS ---
export const getPaginatePaymentWarrantyPartner = createAsyncThunk(
  "GET_ALL_PAYMENT_WARRANTY_PARTNER",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `${BASE_URL}/get-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(
          validateError({
            error: error,
            action: "GET_ALL_PAYMENT_WARRANTY_PARTNER_PAGING",
            back: false,
          })
        );
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getDownloadPaymentWarrantyPartner = createAsyncThunk(
  "DOWNLOAD_PAYMENT_WARRANTY_PARTNER",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `${BASE_URL}/download-filter?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await receiptCollectionHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      if (response?.response?.data?.code === 500 || response?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(response));
      } else {
        thunkAPI.dispatch(
          validateError({
            error: response,
            action: "DOWNLOAD_PAYMENT_WARRANTY_PARTNER",
            back: false,
          })
        );
      }
      return thunkAPI.rejectWithValue(response.response);
    }
  }
);

export const createPaymentWarrantyPartner = createAsyncThunk(
  "CREATE_PAYMENT_WARRANTY_PARTNER",
  async (body, thunkAPI) => {
    try {
      const url = `${BASE_URL}/create-update`;
      const data = await receiptCollectionHttpService.createData(url, body);
      return data.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        const errorBody = {
          title: "Failed",
          data: error.response.data.data,
          description: `Your data was not created. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updatePaymentWarrantyPartner = createAsyncThunk(
  "UPDATE_PAYMENT_WARRANTY_PARTNER",
  async (body, thunkAPI) => {
    try {
      const url = `${BASE_URL}/create-update`;
      const data = await receiptCollectionHttpService.updateDataPost(url, body);
      return data.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        const errorBody = {
          title: "Failed",
          data: error.response.data.data,
          code: error.response.data.code,
          description: `Your data was not updated. ${message}. Please try again.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getDetailPaymentWarrantyPartner = createAsyncThunk(
  "GET_DETAIL_PAYMENT_WARRANTY_PARTNER",
  async (id, thunkAPI) => {
    try {
      const url = `${BASE_URL}/detail-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message =
          error?.response?.data?.message || error?.message || error?.toString();
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

export const approveOrRejectPaymentWarrantyPartner = createAsyncThunk(
  "APPROVE_OR_REJECT_PAYMENT_WARRANTY_PARTNER",
  async ({ body }, thunkAPI) => {
    try {
      const url = `${BASE_URL}/approve-reject`;
      const response =
        await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      const message = response?.message;
      const successMessage = {
        title: "Successfull",
        description: `${message}`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        if (Math.floor((error.response.data.code || 0) / 100) === 4) {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${body.action === "APPROVE" ? "approved" : "rejected"
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

export const approveOrRejectInactivePaymentWarrantyPartner = createAsyncThunk(
  "APPROVE_OR_REJECT_FOR_INACTIVE_PAYMENT_WARRANTY_PARTNER",
  async ({ body }, thunkAPI) => {
    try {
      const url = `${BASE_URL}/approve-inactive`;
      const response =
        await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      const message = response?.message;
      const successMessage = {
        title: "Successfull",
        description: `${message}`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        if (Math.floor((error.response.data.code || 0) / 100) === 4) {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${body.action === "APPROVE" ? "approved" : "rejected"
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

export const inactivePaymentWarrantyPartner = createAsyncThunk(
  "INACTIVE_PAYMENT_WARRANTY_PARTNER",
  async ({ body }, thunkAPI) => {
    let status = body?.status === "Active" ? "Inactivate" : "Activate";
    try {
      const url = `${BASE_URL}/active-inactive`;
      const response = await receiptCollectionHttpService.activationWithRemarkPost(
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
    } catch (response) {
      if (response?.response?.data?.code === 500 || response?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(response));
      } else {
        thunkAPI.dispatch(
          validateError({
            error: errorBody(errorCode(response), status, errorMessage(response)),
            action: "INACTIVE_PAYMENT_WARRANTY_PARTNER",
            back: false,
          })
        );
      }
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const saveDraftPaymentWarrantyPartner = createAsyncThunk(
  "SAVE_DRAFT_PAYMENT_WARRANTY_PARTNER",
  async (body, thunkAPI) => {
    try {
      const url = `${BASE_URL}/save-draft`;
      const data = await receiptCollectionHttpService.createData(url, body);
      const successBody = {
        title: "Successfull",
        description: `Your data has been saved as draft`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return data.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        const errorBody = {
          title: "Failed",
          data: error.response.data.data,
          description: `Your draft was not saved. ${message}.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const approveOrRejectGlobal = createAsyncThunk(
  "APPROVE_OR_REJECT_GLOBAL",
  async ({ body }, thunkAPI) => {
    try {
      const url = `${BASE_URL}/global/approve-reject`;
      const response = await receiptCollectionHttpService.activationWithRemarkPost(url, body);
      thunkAPI.dispatch(showModalSuccess({ title: "Successfull", description: `${response?.message}`, return: false }));
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message = error?.response?.data?.message || error?.message || error?.toString();
        thunkAPI.dispatch(showModalError({ title: "Failed", description: `Global approval failed. ${message}.`, return: false }));
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_PAYMENT_WARRANTY_PARTNER",
  async (id, thunkAPI) => {
    try {
      const url = `${BASE_URL}/approval-history-get/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(
          validateError({
            error: error,
            action: "GET_APPROVAL_HISTORY",
            back: false,
          })
        );
      }
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

// --- GLOBAL THUNKS ---
export const getListParent = createAsyncThunk(
  "GET_LIST_PARENT_PAYMENT_WARRANTY_PARTNER",
  async (thunkAPI) => {
    try {
      const url = `${BASE_URL}/get-list-parent`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message =
          error?.response?.data?.message || error?.message || error?.toString();
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

export const getListPartnerType = createAsyncThunk(
  "GET_LIST_PARTNER_TYPE_PAYMENT_WARRANTY_PARTNER",
  async (thunkAPI) => {
    try {
      const url = `${BASE_URL}/partner-type`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message =
          error?.response?.data?.message || error?.message || error?.toString();
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

export const getPartnerCode = createAsyncThunk(
  "GET_PARTNER_CODE_PAYMENT_WARRANTY_PARTNER",
  async (thunkAPI) => {
    try {
      const url = `${BASE_URL}/partner-code`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data?.partnerCode || "";
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message =
          error?.response?.data?.message || error?.message || error?.toString();
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

export const getListRating = createAsyncThunk(
  "GET_LIST_RATING_PAYMENT_WARRANTY_PARTNER",
  async (thunkAPI) => {
    try {
      const url = `${BASE_URL}/rating`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message =
          error?.response?.data?.message || error?.message || error?.toString();
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
  "GET_LIST_CRITERIA_PAYMENT_WARRANTY_PARTNER",
  async (thunkAPI) => {
    try {
      const url = `${BASE_URL}/criteria`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message =
          error?.response?.data?.message || error?.message || error?.toString();
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
  "GET_ALL_APPROVAL_LIST_PAYMENT_WARRANTY_PARTNER",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/apphier/get-list-approval-hierarchies`;
      const response = await receiptCollectionHttpService.getAll(url);
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message =
          error?.response?.data?.message || error?.message || error?.toString();
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

export const getListApprovalById = createAsyncThunk(
  "GET_LIST_APPROVAL_BY_ID_PAYMENT_WARRANTY_PARTNER",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/apphier/get-approval-hierarchies/${id}`;
      const response = await receiptCollectionHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message =
          error?.response?.data?.message || error?.message || error?.toString();
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

export const getListCategory = createAsyncThunk(
  "GET_LIST_CATEGORY_PAYMENT_WARRANTY_PARTNER",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/attachment/list-category";
      const response = await receiptCollectionHttpService.getAll(url);
      const mapsCategory = response?.data?.data?.map((item) => ({
        Id: item?.glbTypeValId,
        text: item?.name,
      }));
      return mapsCategory;
    } catch (error) {
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const message =
          error?.response?.data?.message || error?.message || error?.toString();
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

const paymentWarrantyPartnerSlice = createSlice({
  name: "paymentWarrantyPartner",
  initialState,
  extraReducers: {
    [getPaginatePaymentWarrantyPartner.pending]: (state) => {
      state.loading = true;
    },
    [getPaginatePaymentWarrantyPartner.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getPaginatePaymentWarrantyPartner.rejected]: (state) => {
      state.loading = false;
    },

    [getApprovalHistory.pending]: (state) => {
      state.loading = true;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.dataApprovalHistory = action.payload;
      state.loading = false;
    },
    [getApprovalHistory.rejected]: (state) => {
      state.loading = false;
    },

    [getDetailPaymentWarrantyPartner.pending]: (state) => {
      state.loading = true;
    },
    [getDetailPaymentWarrantyPartner.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getDetailPaymentWarrantyPartner.rejected]: (state) => {
      state.loading = false;
    },

    [getAllApprovalList.pending]: (state) => {
      state.loading = true;
    },
    [getAllApprovalList.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload;
      state.loading = false;
    },
    [getAllApprovalList.rejected]: (state) => {
      state.loading = false;
    },

    [getListApprovalById.pending]: (state) => {
      state.loading = true;
    },
    [getListApprovalById.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload;
      state.loading = false;
    },
    [getListApprovalById.rejected]: (state) => {
      state.loading = false;
    },

    [getListCategory.pending]: (state) => {
      state.loading = true;
    },
    [getListCategory.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },
    [getListCategory.rejected]: (state) => {
      state.loading = false;
    },

    [createPaymentWarrantyPartner.pending]: (state) => {
      state.loading = true;
    },
    [createPaymentWarrantyPartner.fulfilled]: (state) => {
      state.loading = false;
    },
    [createPaymentWarrantyPartner.rejected]: (state) => {
      state.loading = false;
    },

    [updatePaymentWarrantyPartner.pending]: (state) => {
      state.loading = true;
    },
    [updatePaymentWarrantyPartner.fulfilled]: (state) => {
      state.loading = false;
    },
    [updatePaymentWarrantyPartner.rejected]: (state) => {
      state.loading = false;
    },

    [saveDraftPaymentWarrantyPartner.pending]: (state) => {
      state.loading = true;
    },
    [saveDraftPaymentWarrantyPartner.fulfilled]: (state) => {
      state.loading = false;
    },
    [saveDraftPaymentWarrantyPartner.rejected]: (state) => {
      state.loading = false;
    },

    [inactivePaymentWarrantyPartner.pending]: (state) => {
      state.loading = true;
    },
    [inactivePaymentWarrantyPartner.fulfilled]: (state) => {
      state.loading = false;
    },
    [inactivePaymentWarrantyPartner.rejected]: (state) => {
      state.loading = false;
    },

    [getListParent.pending]: (state) => {
      state.loading = true;
    },
    [getListParent.fulfilled]: (state, action) => {
      state.dataListParent = action.payload;
      state.loading = false;
    },
    [getListParent.rejected]: (state) => {
      state.loading = false;
    },

    [getListPartnerType.pending]: (state) => {
      state.loading = true;
    },
    [getListPartnerType.fulfilled]: (state, action) => {
      state.dataListPartnerType = action.payload;
      state.loading = false;
    },
    [getListPartnerType.rejected]: (state) => {
      state.loading = false;
    },

    [getListRating.pending]: (state) => {
      state.loading = true;
    },
    [getListRating.fulfilled]: (state, action) => {
      state.dataListRating = action.payload;
      state.loading = false;
    },
    [getListRating.rejected]: (state) => {
      state.loading = false;
    },

    [getListCriteria.pending]: (state) => {
      state.loading = true;
    },
    [getListCriteria.fulfilled]: (state, action) => {
      state.dataListCriteria = action.payload;
      state.loading = false;
    },
    [getListCriteria.rejected]: (state) => {
      state.loading = false;
    },

    [getPartnerCode.pending]: (state) => {
      state.loading = true;
    },
    [getPartnerCode.fulfilled]: (state, action) => {
      state.partnerCode = action.payload;
      state.loading = false;
    },
    [getPartnerCode.rejected]: (state) => {
      state.loading = false;
    },
    
    [getDownloadPaymentWarrantyPartner.fulfilled]: (state, action) => {
      state.data_download = action.payload;
      state.loading = false;
    },
    [getDownloadPaymentWarrantyPartner.rejected]: (state) => {
      state.loading = false;
    },

    [getPaginatePaymentWarrantyPartnerRating.pending]: (state) => {
      state.loading = true;
    },
    [getPaginatePaymentWarrantyPartnerRating.fulfilled]: (state, action) => {
      state.data_rating = action.payload;
      state.loading = false;
    },
    [getPaginatePaymentWarrantyPartnerRating.rejected]: (state) => {
      state.loading = false;
    },
    [createPaymentWarrantyPartnerRating.pending]: (state) => {
      state.loading = true;
    },
    [createPaymentWarrantyPartnerRating.fulfilled]: (state) => {
      state.loading = false;
    },
    [createPaymentWarrantyPartnerRating.rejected]: (state) => {
      state.loading = false;
    },
    [approveOrRejectPaymentWarrantyPartnerRating.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectPaymentWarrantyPartnerRating.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectPaymentWarrantyPartnerRating.rejected]: (state) => {
      state.loading = false;
    },

    [getDetailPaymentWarrantyPartnerRating.pending]: (state) => {
      state.loading = true;
    },
    [getDetailPaymentWarrantyPartnerRating.fulfilled]: (state, action) => {
      state.data_detail_rating = action.payload;
      state.loading = false;
    },
    [getDetailPaymentWarrantyPartnerRating.rejected]: (state) => {
      state.loading = false;
    },

    [getPaginatePaymentWarrantyPartnerBranch.pending]: (state) => {
      state.loading = true;
    },
    [getPaginatePaymentWarrantyPartnerBranch.fulfilled]: (state, action) => {
      state.data_branch = action.payload;
      state.loading = false;
    },
    [getPaginatePaymentWarrantyPartnerBranch.rejected]: (state) => {
      state.loading = false;
    },
    [createPaymentWarrantyPartnerBranch.pending]: (state) => {
      state.loading = true;
    },
    [createPaymentWarrantyPartnerBranch.fulfilled]: (state) => {
      state.loading = false;
    },
    [createPaymentWarrantyPartnerBranch.rejected]: (state) => {
      state.loading = false;
    },
    [approveOrRejectPaymentWarrantyPartnerBranch.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectPaymentWarrantyPartnerBranch.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectPaymentWarrantyPartnerBranch.rejected]: (state) => {
      state.loading = false;
    },

    [getDetailPaymentWarrantyPartnerBranch.pending]: (state) => {
      state.loading = true;
    },
    [getDetailPaymentWarrantyPartnerBranch.fulfilled]: (state, action) => {
      state.data_detail_branch = action.payload;
      state.loading = false;
    },
    [getDetailPaymentWarrantyPartnerBranch.rejected]: (state) => {
      state.loading = false;
    },

    [approveOrRejectInactivePaymentWarrantyPartner.pending]: (state) => {
      state.loading = true;
    },
    [approveOrRejectInactivePaymentWarrantyPartner.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveOrRejectInactivePaymentWarrantyPartner.rejected]: (state) => {
      state.loading = false;
    },
    [getHistoryPaymentWarrantyPartnerRating.pending]: (state) => {
      state.loading = true;
    },
    [getHistoryPaymentWarrantyPartnerRating.fulfilled]: (state, action) => {
      state.data_history_rating = action.payload;
      state.loading = false;
    },
    [getHistoryPaymentWarrantyPartnerRating.rejected]: (state, action) => {
      state.loading = false;
    },
    [getHistoryPaymentWarrantyPartnerBranch.pending]: (state) => {
      state.loading = true;
    },
    [getHistoryPaymentWarrantyPartnerBranch.fulfilled]: (state, action) => {
      state.data_history_branch = action.payload;
      state.loading = false;
    },
    [getHistoryPaymentWarrantyPartnerBranch.rejected]: (state, action) => {
      state.loading = false;
    },
    [inactivatePaymentWarrantyPartnerRating.pending]: (state) => {
      state.loading = true;
    },
    [inactivatePaymentWarrantyPartnerRating.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [inactivatePaymentWarrantyPartnerRating.rejected]: (state, action) => {
      state.loading = false;
    },
    [inactivatePaymentWarrantyPartnerBranch.pending]: (state) => {
      state.loading = true;
    },
    [inactivatePaymentWarrantyPartnerBranch.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [inactivatePaymentWarrantyPartnerBranch.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

const { reducer } = paymentWarrantyPartnerSlice;
export default reducer;
