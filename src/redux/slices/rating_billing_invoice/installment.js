import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";
import {
  setBodyError,
  showModalError,
  showModalSuccess,
  validateError,
} from "../general_slice";

const initialState = {
  data: [],
  loading: false,
  data_list_installment: [],
  data_approval: [],
  data_approval_list: { result: [], page: {} },
  data_approval_detail: [],
  data_approval_header: {},
  data_account: [],
  data_account_detail: {},
  data_contacts: [],
  data_open_items: [],
  data_types: [],
  data_sources: [],
  data_detail: {},
  data_attachment_categories: [],
  data_attachments: { result: [], page: {} },
  dataListCategory: [],
  data_contact_type: [],
  data_input_type: [],
  data_country_code: [],
  data_country_zone: [],
  data_job: [],
  data_position: [],
  data_early_repayment: {},
  data_approval_history_installment: {},
  data_all_contacts: { result: [], page: {} },
};

export const getListInstallmentPaginate = createAsyncThunk(
  "GET_LIST_INSTALLMENT_PAGINATE",
  async ({ search, page, pageSize, sort, isLoadMore = false }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/installment/installments?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return {
        ...response.data,
        isLoadMore,
      };
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
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getDownloadList = createAsyncThunk(
  "DOWNLOAD_INSTALLMENT_LIST",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/installment/download-list?searchs=${encodeURIComponent(searchParams)}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_INSTALLMENT_LIST",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  },
);

export const getActiveAccounts = createAsyncThunk(
  "GET_ACTIVE_ACCOUNTS",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/installment/accounts`;
      const response = await ratingBillingHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getAccountDetail = createAsyncThunk(
  "GET_ACCOUNT_DETAIL",
  async (accountNumber, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/installment/account-detail/${accountNumber}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getContactsByAccount = createAsyncThunk(
  "GET_CONTACTS_BY_ACCOUNT",
  async (accountNumber, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/installment/contacts/${accountNumber}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const createContact = createAsyncThunk(
  "CREATE_CONTACT",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/installment/contacts`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Contact has been created successfully.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Failed to create contact. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getOpenItems = createAsyncThunk(
  "GET_OPEN_ITEMS",
  async (accountNumber, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/installment/open-item/${accountNumber}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getInstallmentTypes = createAsyncThunk(
  "GET_INSTALLMENT_TYPES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/installment/types`;
      const response = await ratingBillingHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getInstallmentSources = createAsyncThunk(
  "GET_INSTALLMENT_SOURCES",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/installment/sources`;
      const response = await ratingBillingHttpService.getAll(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const createInstallment = createAsyncThunk(
  "CREATE_INSTALLMENT",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/installment/create`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Installment has been created successfully.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Failed to create installment. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getAttachmentCategory = createAsyncThunk(
  "GET_INSTALLMENT_ATTACHMENT_CATEGORY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/billing-bucket/list-attachment-category`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.map((item) => ({
        Id: item.id,
        text: item.text,
      })) || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getAttachmentList = createAsyncThunk(
  "GET_INSTALLMENT_ATTACHMENT_LIST",
  async ({ installmentId, page, pageSize }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/installment/list-attachment/${installmentId}?page=${page}&size=${pageSize}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response?.data || { result: [], page: {} };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const uploadAttachment = createAsyncThunk(
  "UPLOAD_INSTALLMENT_ATTACHMENT",
  async ({ files, category, referenceId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/installment/upload-attachment`;
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("category", category);
      formData.append("referenceId", referenceId);
      
      const response = await ratingBillingHttpService.uploadAttachment(url, formData);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getApprovalHierarchy = createAsyncThunk(
  "GET_INSTALLMENT_APPROVAL_HIERARCHY",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/installment/approval-hierarchy-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response?.data || [];
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
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getApprovalInstallmentList = createAsyncThunk(
  "GET_INSTALLMENT_APPROVAL_LIST",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/installment/approval-installment-list?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return response?.data;
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
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const approveInstallment = createAsyncThunk(
  "APPROVE_INSTALLMENT",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/installment/approval-installment`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Installment has been approved successfully.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Failed to approve installment. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const rejectInstallment = createAsyncThunk(
  "REJECT_INSTALLMENT",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/installment/approval-installment`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Installment has been rejected successfully.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Failed to reject installment. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getApprovalHierarchyDetail = createAsyncThunk(
  "GET_INSTALLMENT_APPROVAL_HIERARCHY_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/installment/approval-hierarchy-detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response?.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getApprovalHierarchyHeader = createAsyncThunk(
  "GET_INSTALLMENT_APPROVAL_HIERARCHY_HEADER",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/installment/approval-hierarchy-header/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getDetailInstallment = createAsyncThunk(
  "GET_DETAIL_INSTALLMENT",
  async (installmentId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/installment/detail/${installmentId}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response?.data || {};
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const updateInstallment = createAsyncThunk(
  "UPDATE_INSTALLMENT",
  async ({ installmentId, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/installment/update/${installmentId}`;
      const response = await ratingBillingHttpService.updateData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Installment has been updated successfully.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Failed to update installment. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const createEarlyRepayment = createAsyncThunk(
  "CREATE_EARLY_REPAYMENT",
  async ({ installmentId, body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/installment/create-early-repayment`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Early repayment has been created successfully.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Failed to create early repayment. ${message}. Please try again.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getEarlyRepaymentByInstallmentId = createAsyncThunk(
  "GET_EARLY_REPAYMENT_BY_INSTALLMENT_ID",
  async (installmentId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/installment/early-repayment/${installmentId}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response?.data || {};
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getApprovalHistoryInstallment = createAsyncThunk(
  "GET_APPROVAL_HISTORY_INSTALLMENT",
  async (installmentId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/installment/approval-history/${installmentId}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response?.data || {};
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getContactType = createAsyncThunk(
  "GET_INSTALLMENT_CONTACT_TYPE",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/contact/getContactType`;
      const response = await ratingBillingHttpService.getAll(url);
      return response?.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getInputType = createAsyncThunk(
  "GET_INSTALLMENT_INPUT_TYPE",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/contact/getInputType`;
      const response = await ratingBillingHttpService.getAll(url);
      return response?.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getCountryCode = createAsyncThunk(
  "GET_INSTALLMENT_COUNTRY_CODE",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/contact/getCountry`;
      const response = await ratingBillingHttpService.getAll(url);
      return response?.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getCountryZone = createAsyncThunk(
  "GET_INSTALLMENT_COUNTRY_ZONE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/contact/getZone/${id}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response?.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getJob = createAsyncThunk(
  "GET_INSTALLMENT_JOB",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/contact/getJob`;
      const response = await ratingBillingHttpService.getAll(url);
      return response?.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getPosition = createAsyncThunk(
  "GET_INSTALLMENT_POSITION",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account/contact/getPosition`;
      const response = await ratingBillingHttpService.getAll(url);
      return response?.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

export const getAllContacts = createAsyncThunk(
  "GET_ALL_INSTALLMENT_CONTACTS",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/installment/all-contacts?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return response?.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Failed to get contacts. ${message}.`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error?.response);
    }
  },
);

const installmentSlice = createSlice({
  name: "installment",
  initialState,
  reducers: {
    clearInstallmentData: (state) => {
      state.data_list_installment = [];
      state.data = [];
    },
    clearAccountDetail: (state) => {
      state.data_account_detail = {};
    },
    clearContacts: (state) => {
      state.data_contacts = [];
    },
  clearOpenItems: (state) => {
    state.data_open_items = [];
  },
  clearDetailInstallment: (state) => {
    state.data_detail = {};
    state.data_approval_header = {};
    state.data_approval_history_installment = {};
  },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getListInstallmentPaginate.pending, (state, action) => {
        if (!action.meta.arg?.isLoadMore) {
          state.loading = true;
        }
      })
      .addCase(getListInstallmentPaginate.fulfilled, (state, action) => {
        state.loading = false;
        const newData = action.payload.result || [];
        const isLoadMore = action.payload.isLoadMore;

        if (isLoadMore) {
          const existingIds = new Set(
            (state.data_list_installment.result || []).map((item) => item.id),
          );
          const uniqueNewData = newData.filter(
            (item) => !existingIds.has(item.id),
          );
          state.data_list_installment = {
            ...action.payload,
            result: [
              ...(state.data_list_installment.result || []),
              ...uniqueNewData,
            ],
          };
        } else {
          state.data_list_installment = action.payload;
        }
        state.data = state.data_list_installment;
      })
      .addCase(getListInstallmentPaginate.rejected, (state, action) => {
        state.loading = false;
        if (!action.meta.arg?.isLoadMore) {
          state.data_list_installment = { result: [], page: {} };
          state.data = { result: [], page: {} };
        }
      });

    builder
      .addCase(getActiveAccounts.pending, (state) => {})
      .addCase(getActiveAccounts.fulfilled, (state, action) => {
        state.data_account = action.payload || [];
      })
      .addCase(getActiveAccounts.rejected, (state) => {
        state.data_account = [];
      });

    builder
      .addCase(getAccountDetail.pending, (state) => {})
      .addCase(getAccountDetail.fulfilled, (state, action) => {
        state.data_account_detail = action.payload || {};
      })
      .addCase(getAccountDetail.rejected, (state) => {
        state.data_account_detail = {};
      });

    builder
      .addCase(getContactsByAccount.pending, (state) => {})
      .addCase(getContactsByAccount.fulfilled, (state, action) => {
        state.data_contacts = action.payload || [];
      })
      .addCase(getContactsByAccount.rejected, (state) => {
        state.data_contacts = [];
      });

    builder
      .addCase(getOpenItems.pending, (state) => {})
      .addCase(getOpenItems.fulfilled, (state, action) => {
        state.data_open_items = action.payload || [];
      })
      .addCase(getOpenItems.rejected, (state) => {
        state.data_open_items = [];
      });

    builder
      .addCase(getInstallmentTypes.pending, (state) => {})
      .addCase(getInstallmentTypes.fulfilled, (state, action) => {
        state.data_types = action.payload || [];
      })
      .addCase(getInstallmentTypes.rejected, (state) => {
        state.data_types = [];
      });

    builder
      .addCase(getInstallmentSources.pending, (state) => {})
      .addCase(getInstallmentSources.fulfilled, (state, action) => {
        state.data_sources = action.payload || [];
      })
      .addCase(getInstallmentSources.rejected, (state) => {
        state.data_sources = [];
      });

    builder
      .addCase(getApprovalHierarchy.pending, (state) => {
        state.loading = true;
      })
      .addCase(getApprovalHierarchy.fulfilled, (state, action) => {
        state.loading = false;
        state.data_approval = action.payload || [];
      })
      .addCase(getApprovalHierarchy.rejected, (state) => {
        state.loading = false;
        state.data_approval = [];
      });

    builder
      .addCase(getApprovalInstallmentList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getApprovalInstallmentList.fulfilled, (state, action) => {
        state.loading = false;
        state.data_approval_list = action.payload || { result: [], page: {} };
      })
      .addCase(getApprovalInstallmentList.rejected, (state) => {
        state.loading = false;
        state.data_approval_list = { result: [], page: {} };
      });

    builder
      .addCase(approveInstallment.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveInstallment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(approveInstallment.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(rejectInstallment.pending, (state) => {
        state.loading = true;
      })
      .addCase(rejectInstallment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(rejectInstallment.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getApprovalHierarchyDetail.pending, (state) => {})
      .addCase(getApprovalHierarchyDetail.fulfilled, (state, action) => {
        state.data_approval_detail = action.payload || [];
      })
      .addCase(getApprovalHierarchyDetail.rejected, (state) => {
        state.data_approval_detail = [];
      });

    builder
      .addCase(getApprovalHierarchyHeader.pending, (state) => {})
      .addCase(getApprovalHierarchyHeader.fulfilled, (state, action) => {
        state.data_approval_header = action.payload || {};
      })
      .addCase(getApprovalHierarchyHeader.rejected, (state) => {
        state.data_approval_header = {};
      });

    builder
      .addCase(getAttachmentCategory.pending, (state) => {})
      .addCase(getAttachmentCategory.fulfilled, (state, action) => {
        state.data_attachment_categories = action.payload || [];
        state.dataListCategory = action.payload || [];
      })
      .addCase(getAttachmentCategory.rejected, (state) => {
        state.data_attachment_categories = [];
        state.dataListCategory = [];
      });

    builder
      .addCase(getAttachmentList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAttachmentList.fulfilled, (state, action) => {
        state.loading = false;
        state.data_attachments = action.payload || { result: [], page: {} };
      })
      .addCase(getAttachmentList.rejected, (state) => {
        state.loading = false;
        state.data_attachments = { result: [], page: {} };
      });

    builder
      .addCase(uploadAttachment.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadAttachment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadAttachment.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getDetailInstallment.pending, (state) => {})
      .addCase(getDetailInstallment.fulfilled, (state, action) => {
        state.data_detail = action.payload || {};
      })
      .addCase(getDetailInstallment.rejected, (state) => {
        state.data_detail = {};
      });

    builder
      .addCase(getContactType.pending, (state) => {})
      .addCase(getContactType.fulfilled, (state, action) => {
        const raw = action.payload || [];
        state.data_contact_type = raw.map((item) => ({
          id: item.key || item.id,
          text: item.value || item.text,
        }));
      })
      .addCase(getContactType.rejected, (state) => {
        state.data_contact_type = [];
      });

    builder
      .addCase(getInputType.pending, (state) => {})
      .addCase(getInputType.fulfilled, (state, action) => {
        const raw = action.payload || [];
        state.data_input_type = raw.map((item) => ({
          id: item.key || item.id,
          text: item.value || item.text,
        }));
      })
      .addCase(getInputType.rejected, (state) => {
        state.data_input_type = [];
      });

    builder
      .addCase(getCountryCode.pending, (state) => {})
      .addCase(getCountryCode.fulfilled, (state, action) => {
        const raw = action.payload || [];
        state.data_country_code = raw.map((item) => ({
          id: item.key || item.id,
          text: item.value || item.text,
        }));
      })
      .addCase(getCountryCode.rejected, (state) => {
        state.data_country_code = [];
      });

    builder
      .addCase(getCountryZone.pending, (state) => {})
      .addCase(getCountryZone.fulfilled, (state, action) => {
        const raw = action.payload || [];
        state.data_country_zone = raw.map((item) => ({
          id: item.key || item.id,
          text: item.value || item.text,
        }));
      })
      .addCase(getCountryZone.rejected, (state) => {
        state.data_country_zone = [];
      });

    builder
      .addCase(getJob.pending, (state) => {})
      .addCase(getJob.fulfilled, (state, action) => {
        const raw = action.payload || [];
        state.data_job = raw.map((item) => ({
          id: item.key || item.id,
          text: item.value || item.text,
        }));
      })
      .addCase(getJob.rejected, (state) => {
        state.data_job = [];
      });

    builder
      .addCase(getPosition.pending, (state) => {})
      .addCase(getPosition.fulfilled, (state, action) => {
        const raw = action.payload || [];
        state.data_position = raw.map((item) => ({
          id: item.key || item.id,
          text: item.value || item.text,
        }));
      })
      .addCase(getPosition.rejected, (state) => {
        state.data_position = [];
      });

    builder
      .addCase(getEarlyRepaymentByInstallmentId.pending, (state) => {})
      .addCase(getEarlyRepaymentByInstallmentId.fulfilled, (state, action) => {
        state.data_early_repayment = action.payload || {};
      })
      .addCase(getEarlyRepaymentByInstallmentId.rejected, (state) => {
        state.data_early_repayment = {};
      });

    builder
      .addCase(getApprovalHistoryInstallment.pending, (state) => {
        state.loading = true;
      })
      .addCase(getApprovalHistoryInstallment.fulfilled, (state, action) => {
        state.loading = false;
        state.data_approval_history_installment = action.payload || {};
      })
      .addCase(getApprovalHistoryInstallment.rejected, (state) => {
        state.loading = false;
        state.data_approval_history_installment = {};
      });

    builder
      .addCase(getAllContacts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.data_all_contacts = action.payload || { result: [], page: {} };
      })
      .addCase(getAllContacts.rejected, (state) => {
        state.loading = false;
        state.data_all_contacts = { result: [], page: {} };
      });
  },
});

export const {
  clearInstallmentData,
  clearAccountDetail,
  clearContacts,
  clearOpenItems,
  clearDetailInstallment,
} = installmentSlice.actions;

export default installmentSlice.reducer;
