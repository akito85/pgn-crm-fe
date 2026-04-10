import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  showModalError,
  showModalSuccess,
  setBodyError,
} from "../general_slice";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";

const initialState = {
  data: null,
  loading: false,
  message: "",
  distributeMediaList: [],
  contactList: [],
  approvalHierarchyList: [],
  approvalHierarchyDetail: [],
  dataListCategory: [],
  dataDetail: null,
};

export const getTaxExemptionDetail = createAsyncThunk(
  "GET_TAX_EXEMPTION_DETAIL",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-exemption/detail/${id}`;
      const response = await ratingBillingHttpService.getAll(url);
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
        thunkAPI.dispatch(
          showModalError({ title: "Failed", description: `${message}` }),
        );
      }
    }
  },
);

export const getTaxExemptionPaginate = createAsyncThunk(
  "GET_TAX_EXEMPTION_PAGINATE",
  async ({ search, page, pageSize, sort, isLoadMore }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/tax-exemption/get-paging?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return { ...response.data, isLoadMore };
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
  },
);

export const getDistributeMedia = createAsyncThunk(
  "GET_DISTRIBUTE_MEDIA",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-exemption/distribute-media`;
      const response = await ratingBillingHttpService.getAll(url);
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
        thunkAPI.dispatch(
          showModalError({ title: "Failed", description: `${message}` }),
        );
      }
    }
  },
);

export const getApprovalHierarchyList = createAsyncThunk(
  "GET_TAX_EXEMPTION_APPROVAL_HIERARCHY_LIST",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-exemption/approval-hierarcy-list`;
      const response = await ratingBillingHttpService.getAll(url);
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
        thunkAPI.dispatch(
          showModalError({ title: "Failed", description: `${message}` }),
        );
      }
    }
  },
);

export const getApprovalHierarchyDetail = createAsyncThunk(
  "GET_TAX_EXEMPTION_APPROVAL_HIERARCHY_DETAIL",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-exemption/apphier-detail/${id}`;
      const response = await ratingBillingHttpService.getAll(url);
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
        thunkAPI.dispatch(
          showModalError({ title: "Failed", description: `${message}` }),
        );
      }
    }
  },
);

export const getContactByAccount = createAsyncThunk(
  "GET_CONTACT_BY_ACCOUNT",
  async ({ accountNumber }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-exemption/get-contact/${accountNumber}`;
      const response = await ratingBillingHttpService.getAll(url);
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
        thunkAPI.dispatch(
          showModalError({ title: "Failed", description: `${message}` }),
        );
      }
    }
  },
);

export const getApprovalHistoryTaxExemption = createAsyncThunk(
  "GET_APPROVAL_HISTORY_TAX_EXEMPTION",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-exemption/approval-history/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      if (response.data && !Array.isArray(response.data)) {
        return response.data;
      }
      return null;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(
          showModalError({ title: "Failed", description: `${message}` }),
        );
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const downloadTaxExemption = createAsyncThunk(
  "DOWNLOAD_TAX_EXEMPTION",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/tax-exemption/download-filter?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      await ratingBillingHttpService.downloadXlsx(url, "tax_exemption_list");
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(
        showModalError({ title: "Failed", description: `${message}` }),
      );
    }
  },
);

export const createTaxExemption = createAsyncThunk(
  "CREATE_TAX_EXEMPTION",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-exemption/create`;
      const response = await ratingBillingHttpService.createData(url, body);
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
        thunkAPI.dispatch(
          showModalError({ title: "Failed", description: `${message}` }),
        );
      }
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const uploadTaxExemptionAttachment = createAsyncThunk(
  "UPLOAD_TAX_EXEMPTION_ATTACHMENT",
  async ({ referenceId, files, categoryId }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-exemption/upload-evidence`;
      const formData = new FormData();
      formData.append("files", files);
      formData.append("categoryId", categoryId);
      formData.append("referenceId", referenceId);
      const response = await ratingBillingHttpService.uploadAttachment(
        url,
        formData,
        () => {},
      );
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(
        showModalError({ title: "Failed", description: `${message}` }),
      );
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const approveOrRejectTaxExemption = createAsyncThunk(
  "APPROVE_OR_REJECT_TAX_EXEMPTION",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/tax-exemption/approve`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
      );
      const successBody = {
        title: "Successful",
        description: `Your data has been ${
          body.action === "APPROVE" ? "approved" : "rejected"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
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
        thunkAPI.dispatch(
          showModalError({
            title: "Failed",
            description: `Your data was not ${
              body.action === "APPROVE" ? "approved" : "rejected"
            }. ${message}.`,
          }),
        );
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getCategoryListTaxExemption = createAsyncThunk(
  "GET_CATEGORY_LIST_TAX_EXEMPTION",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/adjustment/get-category-attachment`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.map((item) => ({
        Id: item.id,
        text: item.text,
      }));
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(
        showModalError({ title: "Failed", description: `${message}` }),
      );
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

const taxExemptionSlice = createSlice({
  name: "taxExemption",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTaxExemptionPaginate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTaxExemptionPaginate.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const { isLoadMore, ...rest } = action.payload;
          if (isLoadMore && state.data?.result) {
            state.data = {
              ...rest,
              result: [...(state.data.result || []), ...(rest.result || [])],
            };
          } else {
            state.data = rest;
          }
        }
      })
      .addCase(getTaxExemptionPaginate.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getDistributeMedia.fulfilled, (state, action) => {
        state.distributeMediaList = action.payload || [];
      })
      .addCase(getContactByAccount.fulfilled, (state, action) => {
        state.contactList = action.payload?.result || [];
      })
      .addCase(getApprovalHierarchyList.fulfilled, (state, action) => {
        state.approvalHierarchyList = action.payload || [];
      })
      .addCase(getApprovalHierarchyDetail.fulfilled, (state, action) => {
        state.approvalHierarchyDetail = action.payload || [];
      })
      .addCase(getCategoryListTaxExemption.fulfilled, (state, action) => {
        state.dataListCategory = action.payload || [];
      })
      .addCase(getTaxExemptionDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTaxExemptionDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.dataDetail = action.payload || null;
      })
      .addCase(getTaxExemptionDetail.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default taxExemptionSlice.reducer;
