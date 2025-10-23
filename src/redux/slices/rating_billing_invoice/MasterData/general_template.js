import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../../services/ratingBillingHttpService";
import {
  showModalError,
  showModalSuccess,
  validateError,
} from "../../general_slice";
// import { showModalError } from "../../general_slice";
// import { showModalSuccess } from "../../general_slice";

const initialState = {
  data_list: [],
  loading: false,
  isFailed: false,
  isSuccess: false,
  message: "",
  data_detail: {},
  data_detail_draft: {},
  dataListAppHierId: [], //ddl
  dataListAppHierDetail: {}, //table approval
  data_approval_history: [],
  data_template_type: [],
  dataListCategory: [],
  dataConfigRBIDataGeneralTemplate : {},
};

export const getAllGeneralTemplatePaginate = createAsyncThunk(
  "GET_ALL_GENERAL_PAGINATE",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rbi/invoice/template/list-general-template?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_ALL_GENERAL_PAGINATE" })
      );

      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getDetailGeneralTemplate = createAsyncThunk(
  "GET_DETAIL_GENERAL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/template/detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error, action: "GET_DETAIL_GENERAL" }));
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getDetailDraftGeneralTemplate = createAsyncThunk(
  "GET_DETAIL_DRAFT_GENERAL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/template/detail-draft/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_DETAIL_DRAFT_GENERAL" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getApprovalHistoryGeneralTemplate = createAsyncThunk(
  "GET_APPROVAL_HISTORY_GENERAL_TEMPLATE",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/template/approval-history/${id}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error,
          action: "GET_APPROVAL_HISTORY_GENERAL_TEMPLATE",
        })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

//file
export const getListCategoryFile = createAsyncThunk(
  "GET_LIST_CATEGORY_FILE",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/invoice/template/category-list";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data.map((item) => {
        return {
          Id: item.id,
          text: item.name,
        };
      });
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_LIST_CATEGORY_FILE" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getGeneralTemplateType = createAsyncThunk(
  "GET_GENERAL_TEMPLATE_LIST_TEMPLATE_TYPE",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/invoice/template/type";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data?.map((data) => ({
        id: data.glbTypeValId,
        value: data.name,
      }));
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error,
          action: "GET_GENERAL_TEMPLATE_LIST_TEMPLATE_TYPE",
        })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getApprovalList = createAsyncThunk(
  "GET_GENERAL_TEMPLATE_APPROVAL_LIST",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/invoice/template/apphier-list";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error,
          action: "GET_GENERAL_TEMPLATE_APPROVAL_LIST",
        })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getApprovalListDetail = createAsyncThunk(
  "GET_GENERAL_TEMPLATE_APPROVAL_LIST_DETAIL",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/template/apphier-detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error,
          action: "GET_GENERAL_TEMPLATE_APPROVAL_LIST_DETAIL",
        })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const createGeneralTemplate = createAsyncThunk(
  "CREATE_GENERAL_TEMPLATE",
  async (body, thunkAPI) => {
    try {
      // console.log("body", body);
      const url = `/v1/dbs/api/rbi/invoice/template/create-generaltemplate`;
      const response = await ratingBillingHttpService.uploadAttachment(
        url,
        body
      );
      // const successMessage = {
      //   title: "Successful",
      //   description: `Your data has been ${
      //     body.isSubmit === false ? "created" : "submitted"
      //   }.`,
      // };
      // thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      // if error code for with validation
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(
            validateError({
              error,
              action: "CREATE_GENERAL_TEMPLATE",
            })
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not created. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateGeneralTemplate = createAsyncThunk(
  "UPDATE_GENERAL_TEMPLATE",
  async ({ body, id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/template/update-generaltemplate/${id}`;
      const response = await ratingBillingHttpService.uploadAttachment(
        url,
        body
      );
      // const successMessage = {
      //   title: "Successful",
      //   description: `Your data has been ${
      //     body.isSubmit === false ? "updated" : "submitted"
      //   }.`,
      // };
      // thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      //if error code for with validation
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(
            validateError({
              error,
              action: "UPDATE_GENERAL_TEMPLATE",
            })
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not updated. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const approveInactiveGeneralTemplate = createAsyncThunk(
  "APPROVE_INACTIVE_GENERAL_TEMPLATE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/template/approval-inactive`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body
      );
      const successMessage = {
        title: "Successful",
        description: `Your data has been ${
          body.action === "APPROVE" ? "approved" : "rejected"
        }.`,
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
      //if error code for with validation
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(
            validateError({
              error,
              action: "APPROVE_INACTIVE_GENERAL_TEMPLATE",
            })
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

export const approveGeneralTemplate = createAsyncThunk(
  "APPROVE_GENERAL_TEMPLATE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/template/approval-template`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body
      );
      const successMessage = {
        title: "Successful",
        description: `Your data has been ${
          body.action === "APPROVE" ? "approved" : "rejected"
        }.`,
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
      //if error code for with validation
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(
            validateError({
              error,
              action: "APPROVE_GENERAL_TEMPLATE",
            })
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not created. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const activationGeneralTemplate = createAsyncThunk(
  "ACTIVATION_GENERAL_TEMPLATE",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/rbi/invoice/template/update-status`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body
      );
      const successMessage = {
        title: "Successful",
        description: `Your data has been submitted.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response?.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      //if error code for with validation
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(
            validateError({
              error,
              action: "ACTIVATION_GENERAL_TEMPLATE",
            })
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not inactivate. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getDownloadGeneralTemplateList = createAsyncThunk(
  "DOWNLOAD_GENERAL_TEMPLATE_LIST",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/rbi/invoice/template/download-filter?page=${page}&size=${pageSize}&sort=${sortParams}&search=${searchParams}`;

      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(validateError({ error: response, action: "DOWNLOAD_GENERAL_TEMPLATE_LIST", back: false }))
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

export const previewGeneralTemplate = createAsyncThunk(
  "PREVIEW_GENERAL_TEMPLATE",
  async ({ url, extension, filename }, thunkAPI) => {
    try {
      // const url = `/v1/dbs/api/invoice-template/preview-template/${id}`;
      const response = await ratingBillingHttpService.downloadRtfFile(
        url,
        extension,
        filename
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      //if error code for with validation
      if (Math.floor((error.response.data.code || 0) / 100) === 4) {
        if (error.response.data.code === 419) {
          thunkAPI.dispatch(
            validateError({
              error,
              action: "ACTIVATION_GENERAL_TEMPLATE",
            })
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not inactivate. ${message}.`,
            return: false,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getConfigFileRBIDataGeneralTemplate = createAsyncThunk(
  "GET_CONFIG_FILE_RBI_DATA_GENERAL_TEMPLATE",
  async (_,thunkAPI) => {
    try {
      const url = "/v1/dbs/api/rbi/config-file-generaltemplate";
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error,
          action: "GET_CONFIG_FILE_RBI_DATA_GENERAL_TEMPLATE",
        })
      );
      return thunkAPI.rejectWithValue(error.response.data.code === 419 ? null : error.response.data);
    }
  }
);
const generalTemplateSlice = createSlice({
  name: "general_template",
  initialState,
  extraReducers: {
    // Get All Billing Item Pagination
    [getAllGeneralTemplatePaginate.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllGeneralTemplatePaginate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_list = action.payload;
    },
    [getAllGeneralTemplatePaginate.rejected]: (state, action) => {
      state.loading = false;
      state.data_list = action.payload;
    },

    [getDetailGeneralTemplate.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailGeneralTemplate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },
    [getDetailGeneralTemplate.rejected]: (state, action) => {
      state.loading = false;
      state.data_detail = action.payload;
    },

    [getDetailDraftGeneralTemplate.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailDraftGeneralTemplate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_detail_draft = action.payload;
    },
    [getDetailDraftGeneralTemplate.rejected]: (state, action) => {
      state.loading = false;
      state.data_detail_draft = action.payload;
    },

    [getApprovalHistoryGeneralTemplate.pending]: (state, action) => {
      state.loading = true;
    },
    [getApprovalHistoryGeneralTemplate.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_approval_history = action.payload;
    },
    [getApprovalHistoryGeneralTemplate.rejected]: (state, action) => {
      state.loading = false;
      state.data_approval_history = action.payload;
    },

    [getListCategoryFile.pending]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = true;
    },
    [getListCategoryFile.fulfilled]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },
    [getListCategoryFile.rejected]: (state, action) => {
      state.dataListCategory = action.payload;
      state.loading = false;
    },

    [getGeneralTemplateType.pending]: (state, action) => {
      state.loading = true;
    },
    [getGeneralTemplateType.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_template_type = action.payload;
    },
    [getGeneralTemplateType.rejected]: (state, action) => {
      state.loading = false;
      state.data_template_type = action.payload;
    },

    [getApprovalList.pending]: (state, action) => {
      state.loading = true;
    },
    [getApprovalList.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListAppHierId = action.payload;
    },
    [getApprovalList.rejected]: (state, action) => {
      state.loading = false;
      state.dataListAppHierId = action.payload;
    },

    [getApprovalListDetail.pending]: (state, action) => {
      state.loading = true;
    },
    [getApprovalListDetail.fulfilled]: (state, action) => {
      state.loading = false;
      state.dataListAppHierDetail = action.payload;
    },
    [getApprovalListDetail.rejected]: (state, action) => {
      state.loading = false;
      state.dataListAppHierDetail = action.payload;
    },

    [getConfigFileRBIDataGeneralTemplate.pending]: (state, action) => {
      state.loading = true;
      state.dataConfigRBIDataGeneralTemplate = action.payload;
    },
    [getConfigFileRBIDataGeneralTemplate.fulfilled]: (state, action) => {
      state.dataConfigRBIDataGeneralTemplate = action.payload;
      state.loading = false;
    },
    [getConfigFileRBIDataGeneralTemplate.rejected]: (state, action) => {
      state.dataConfigRBIDataGeneralTemplate = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = generalTemplateSlice;
export default reducer;
