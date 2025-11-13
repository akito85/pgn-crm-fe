import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showModalError, validateError } from "../general_slice";
import { showModalSuccess } from "../general_slice";
import ratingBillingHttpService from "../../services/ratingBillingHttpService";

const initialState = {
  data_view: [],
  data_billingItemCategoryDdl: [],
  data_billingItemCategory: [],
  data_billType: [],
  data_itemMappingCategory: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  data_AttachmentTable: [],
  dataListCategory: [],
  data_BillingItemDetail: [],
  data_AttachmentDetail: [],
  detail_mapping_category: [],
  data_ApprovalHistory: [],
  downloadBillingItem: [],
  message: "",
  data_detailDraft: [],
  getConfigFile: {},
  loading: false,
};

export const getBillingItemList = createAsyncThunk(
  "GET_BILLING_ITEM_LIST",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billingitem/get-paging?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_BILLING_ITEM_LIST" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getBillingItemCategory = createAsyncThunk(
  "GET_BILLING_ITEM_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingitem/get-mapping-category";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_BILLING_ITEM_LIST" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getBillType = createAsyncThunk(
  "GET_BILL_TYPE",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingitem/get-billing-type";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_BILL_TYPE" }));
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getBillingItemCategoryDdl = createAsyncThunk(
  "GET_BILLING_ITEM_MAPPING_CATEGORY_DDL",
  async (thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingitem/get-billing-category";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error,
          action: "GET_BILLING_ITEM_MAPPING_CATEGORY_DDL",
        })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getDetailMappingCategory = createAsyncThunk(
  "GET_DETAIL_MAPPING_CATEGORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/get-item-mapping/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_DETAIL_MAPPING_CATEGORY" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getAvailableApproval = createAsyncThunk(
  "GET_AVAILABLE_APPROVAL",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/approval-hierarchies-get`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_AVAILABLE_APPROVAL" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getSelectedApproval = createAsyncThunk(
  "GET_SELECTED_APPROVAL",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/approval-hierarchies-detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_SELECTED_APPROVAL" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getAttachmentTable = createAsyncThunk(
  "GET_ATTACHMENT_TABLE",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/attachment-list/?page=${page}&size=${pageSize}&search=${search}&sort=${sort}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_ATTACHMENT_TABLE" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getAttachmentCategory = createAsyncThunk(
  "GET_ATTACHMENT_CATEGORY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/category-attachment-get`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.map((item) => ({
        Id: item.id,
        text: item.text,
      }));
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_ATTACHMENT_CATEGORY" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getBillingItemDetail = createAsyncThunk(
  "GET_BILLING_ITEM_DETAIL",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_BILLING_ITEM_DETAIL" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getAttachmentDetail = createAsyncThunk(
  "GET_ATTACHMENT_DETAIL",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const url = `v1/dbs/api/billingitem/attachment-list/1?page=${page}&size=${pageSize}&search=${search}&sort=${sort}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_ATTACHMENT_DETAIL" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const inactiveBillingItem = createAsyncThunk(
  "INACTIVE_BILLING_ITEM",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/inactive`;
      const response = await ratingBillingHttpService.activationWithRemark(
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
          thunkAPI.dispatch(
            validateError({ error, action: "INACTIVE_BILLING_ITEM" })
          );
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
  "GET_APPROVAL_HISTORY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/approval-history-get/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_APPROVAL_HISTORY" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const downloadBillingItem = createAsyncThunk(
  "DOWNLOAD_BILLING_ITEM",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/billingitem/download-filter?page=${page}&size=${pageSize}&searchs=${searchParams}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_BILLING_ITEM",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const createBillingItem = createAsyncThunk(
  "CREATE_BILLING_ITEM",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/create`;
      const response = await ratingBillingHttpService.createData(url, body);
      // const successBody = {
      //   title: "Successful",
      //   description: `Your data has been submitted. ${
      //     body.isSubmit ? "created" : "submitted"
      //   }.`,
      //   return: false,
      // };
      // thunkAPI.dispatch(showModalSuccess(successBody));
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
          thunkAPI.dispatch(
            validateError({ error, action: "CREATE_BILLING_ITEM" })
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${
              body.isSubmit ? "created" : "submitted"
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

export const updateBillingItem = createAsyncThunk(
  "UPDATE_BILLING_ITEM",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/update`;
      const response = await ratingBillingHttpService.updateData(url, body);
      // const successBody = {
      //   title: "Successful",
      //   description: `Your data has been submitted. ${
      //     body.isSubmit ? "created" : "submitted"
      //   }.`,
      //   return: false,
      // };
      // thunkAPI.dispatch(showModalSuccess(successBody));
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
          thunkAPI.dispatch(
            validateError({ error, action: "UPDATE_BILLING_ITEM" })
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${
              body.isSubmit ? "updated" : "submitted"
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

export const approvalRejectBillingItem = createAsyncThunk(
  "APPROVE_REJECT_BILLING_ITEM",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/approve`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body
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
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
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

export const approvalInactiveBillingItem = createAsyncThunk(
  "APPROVAL_INACTIVE_BILLING_ITEM",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/approve-inactive`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body
      );
      const successBody = {
        title: "Successful",
        description: "Your data has been inactived.",
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
          thunkAPI.dispatch(
            validateError({ error, action: "APPROVAL_INACTIVE_BILLING_ITEM" })
          );
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

export const getDetailDraft = createAsyncThunk(
  "GET_DETAIL_DRAFT",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/billingitem/draft/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_DETAIL_DRAFT" }));
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

// RBI MASTER BILLING ITEM
export const getConfigFileRBIBillingItem = createAsyncThunk(
  "GET_CONFIG_FILE_RBI_BILLING_ITEM",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/billingitem/attachment-config-file";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

const billingItemSlice = createSlice({
  name: "billing_item",
  initialState,
  extraReducers: {
    //GET BILLING ITEM LIST
    [getBillingItemList.pending]: (state) => {
      state.loading = true;
    },
    [getBillingItemList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_view = action.payload;
    },
    [getBillingItemList.rejected]: (state) => {
      state.loading = false;
    },
    //GET BILLING ITEM CATEGORY
    [getBillingItemCategory.pending]: (state) => {
      state.loading = true;
    },
    [getBillingItemCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_billingItemCategory = action.payload;
    },
    [getBillingItemCategory.rejected]: (state) => {
      state.loading = false;
    },

    //GET BILLING ITEM CATEGORY DDL
    [getBillingItemCategoryDdl.pending]: (state) => {
      state.loading = true;
    },
    [getBillingItemCategoryDdl.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_billingItemCategoryDdl = action.payload;
    },
    [getBillingItemCategoryDdl.rejected]: (state) => {
      state.loading = false;
    },
    //GET BILL TYPE
    [getBillType.pending]: (state) => {
      state.loading = true;
    },
    [getBillType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_billType = action.payload;
    },
    [getBillType.rejected]: (state) => {
      state.loading = false;
    },
    //GET BILL TYPE
    [getDetailMappingCategory.pending]: (state) => {
      state.loading = true;
    },
    [getDetailMappingCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.detail_mapping_category = action.payload;
    },
    [getDetailMappingCategory.rejected]: (state) => {
      state.loading = false;
    },
    //GET AVAILABLE APPROVAL
    [getAvailableApproval.pending]: (state) => {
      state.loading = true;
    },
    [getAvailableApproval.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListAppHierId = action.payload;
    },
    [getAvailableApproval.rejected]: (state) => {
      state.loading = false;
    },
    //GET SELECTED APPROVAL
    [getSelectedApproval.pending]: (state) => {
      state.loading = true;
    },
    [getSelectedApproval.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListAppHierDetail = action.payload;
    },
    [getSelectedApproval.rejected]: (state) => {
      state.loading = false;
    },
    //GET ATTACHMENT TABLE
    [getAttachmentTable.pending]: (state) => {
      state.loading = true;
    },
    [getAttachmentTable.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_AttachmentTable = action.payload;
    },
    [getAttachmentTable.rejected]: (state) => {
      state.loading = false;
    },
    //GET ATTACHMENT CATEGORY
    [getAttachmentCategory.pending]: (state) => {
      state.loading = true;
    },
    [getAttachmentCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListCategory = action.payload;
    },
    [getAttachmentCategory.rejected]: (state) => {
      state.loading = false;
    },
    //GET BILLING ITEM DETAIL
    [getBillingItemDetail.pending]: (state) => {
      state.loading = true;
    },
    [getBillingItemDetail.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_BillingItemDetail = action.payload;
    },
    [getBillingItemDetail.rejected]: (state) => {
      state.loading = false;
    },
    //GET ATTACHMENT DETAIL
    [getAttachmentDetail.pending]: (state) => {
      state.loading = true;
    },
    [getAttachmentDetail.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_AttachmentDetail = action.payload;
    },
    [getAttachmentDetail.rejected]: (state) => {
      state.loading = false;
    },
    //GET INACTIVE
    [inactiveBillingItem.pending]: (state) => {
      state.loading = true;
    },
    [inactiveBillingItem.fulfilled]: (state) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [inactiveBillingItem.rejected]: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    //GET APPROVAL HISTORY
    [getApprovalHistory.pending]: (state, action) => {
      state.data_ApprovalHistory = action.payload;
      state.loading = true;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_ApprovalHistory = action.payload;
    },
    [getApprovalHistory.rejected]: (state, action) => {
      state.data_ApprovalHistory = action.payload;
      state.loading = false;
    },
    //DOWNLOAD BILLING ITEM
    [downloadBillingItem.pending]: (state) => {
      state.loading = true;
    },
    [downloadBillingItem.fulfilled]: (state, action) => {
      state.loading = false;
      state.download_BillingItem = action.payload;
    },
    [downloadBillingItem.rejected]: (state) => {
      state.loading = false;
    },
    //DOWNLOAD BILLING ITEM
    [getDetailDraft.pending]: (state) => {
      state.loading = true;
    },
    [getDetailDraft.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detailDraft = action.payload;
    },
    [getDetailDraft.rejected]: (state) => {
      state.loading = false;
    },
    //CONFIG FILE RBI BILLING ITEM
    [getConfigFileRBIBillingItem.pending]: (state) => {
      state.loading = true;
    },
    [getConfigFileRBIBillingItem.fulfilled]: (state, action) => {
      state.loading = false;
      state.getConfigFile = action.payload;
    },
    [getConfigFileRBIBillingItem.rejected]: (state) => {
      state.loading = false;
    },
  },
});

const { reducer } = billingItemSlice;
export default reducer;
