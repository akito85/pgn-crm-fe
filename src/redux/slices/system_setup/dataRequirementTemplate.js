import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accountManagementService from "../../services/account_management/accountManagementService";
import { showModalSuccess, validateError } from "../general_slice";

const initialState = {
  data: [],
  data_list: [],
  data_pagination: null,
  data_detail: null,
  data_filter: null,
  data_sr_filter_list: [],
  data_sr_filter_pagination: null,
  loading_sr_filter: false,
  loading_filter: false,
  loading: false,
  message: "",
  success: false,
};

export const getDataRequirementTemplatePaginate = createAsyncThunk(
  "GET_DATA_REQUIREMENT_TEMPLATE_PAGINATE",
  async ({ page, size, sort, searchs, isLoadMore }, thunkAPI) => {
    try {
      const sortParams = (Array.isArray(sort) ? sort[0] : sort) || "id~desc";
      const searchParams =
        searchs && Object.keys(searchs).length > 0
          ? JSON.stringify(searchs)
          : "";
      const url = `/v1/dbs/api/data-requirement/template/paging?page=${page}&size=${size}&sort=${sortParams}${searchParams ? `&searchs=${encodeURIComponent(searchParams)}` : ""}`;
      const response = await accountManagementService.getPagination(url);
      return { ...response, isLoadMore };
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "GET_DATA_REQUIREMENT_TEMPLATE_PAGINATE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  }
);

export const getDataRequirementTemplateDetail = createAsyncThunk(
  "GET_DATA_REQUIREMENT_TEMPLATE_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/data-requirement/template/detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "GET_DATA_REQUIREMENT_TEMPLATE_DETAIL",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  }
);

export const getDataRequirementTemplateByFilter = createAsyncThunk(
  "GET_DATA_REQUIREMENT_TEMPLATE_BY_FILTER",
  async ({ sourceType, type, category, subCategory }, thunkAPI) => {
    try {
      let url = `/v1/dbs/api/data-requirement/template/detail?sourceType=${sourceType}&type=${type}&category=${category}`;
      if (subCategory) {
        url += `&subCategory=${subCategory}`;
      }
      const response = await accountManagementService.getAll(url);
      return response;
    } catch (response) {
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  }
);

export const getDataRequirementTemplatePaginateBySrFilter = createAsyncThunk(
  "GET_DATA_REQUIREMENT_TEMPLATE_PAGINATE_BY_SR_FILTER",
  async ({ type, category, subCategory, page, size, sort, searchs, isLoadMore }, thunkAPI) => {
    try {
      const sortParams = (Array.isArray(sort) ? sort[0] : sort) || "id~desc";
      const searchParams =
        searchs && Object.keys(searchs).length > 0
          ? JSON.stringify(searchs)
          : "";
      let url = `/v1/dbs/api/data-requirement/template/paging?page=${page}&size=${size}&sort=${sortParams}&sourceType=${encodeURIComponent("Service Request")}&type=${type}&category=${category}&subCategory=${subCategory}`;
      if (searchParams) url += `&searchs=${encodeURIComponent(searchParams)}`;
      const response = await accountManagementService.getPagination(url);
      return { ...response, isLoadMore };
    } catch (response) {
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  }
);

export const createDataRequirementTemplate = createAsyncThunk(
  "CREATE_DATA_REQUIREMENT_TEMPLATE",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/data-requirement/template/create";
      const response = await accountManagementService.createData(url, body);
      thunkAPI.dispatch(
        showModalSuccess({
          return: false,
          title: "Successful",
          description: "Data Requirement Template has been created",
        })
      );
      return response;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "CREATE_DATA_REQUIREMENT_TEMPLATE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  }
);

export const updateDataRequirementTemplate = createAsyncThunk(
  "UPDATE_DATA_REQUIREMENT_TEMPLATE",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/data-requirement/template/update";
      const response = await accountManagementService.updateData(url, body);
      thunkAPI.dispatch(
        showModalSuccess({
          return: false,
          title: "Successful",
          description: "Data Requirement Template has been updated",
        })
      );
      return response;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "UPDATE_DATA_REQUIREMENT_TEMPLATE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  }
);

export const deleteDataRequirementTemplate = createAsyncThunk(
  "DELETE_DATA_REQUIREMENT_TEMPLATE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/data-requirement/template/delete/${id}`;
      const response = await accountManagementService.deleteData(url);
      thunkAPI.dispatch(
        showModalSuccess({
          return: false,
          title: "Successful",
          description: "Data Requirement Template has been deleted",
        })
      );
      return response;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DELETE_DATA_REQUIREMENT_TEMPLATE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  }
);

export const activeInactiveDataRequirementTemplate = createAsyncThunk(
  "ACTIVE_INACTIVE_DATA_REQUIREMENT_TEMPLATE",
  async (id, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/data-requirement/template/active-inactive";
      const response = await accountManagementService.updateData(url, { id });
      thunkAPI.dispatch(
        showModalSuccess({
          return: false,
          title: "Successful",
          description: response?.message || "Status has been updated",
        })
      );
      return response;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "ACTIVE_INACTIVE_DATA_REQUIREMENT_TEMPLATE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  }
);

export const createDetailItem = createAsyncThunk(
  "CREATE_DETAIL_ITEM",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/data-requirement/template/detail-item/create";
      const response = await accountManagementService.createData(url, body);
      return response;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "CREATE_DETAIL_ITEM",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  }
);

export const updateDetailItem = createAsyncThunk(
  "UPDATE_DETAIL_ITEM",
  async (body, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/data-requirement/template/detail-item/update";
      const response = await accountManagementService.updateData(url, body);
      return response;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "UPDATE_DETAIL_ITEM",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  }
);

export const deleteDetailItem = createAsyncThunk(
  "DELETE_DETAIL_ITEM",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/data-requirement/template/detail-item/delete/${id}`;
      const response = await accountManagementService.deleteData(url);
      return response;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DELETE_DETAIL_ITEM",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  }
);

const dataRequirementTemplateSlice = createSlice({
  name: "dataRequirementTemplate",
  initialState,
  reducers: {
    resetDataRequirementTemplate: (state) => {
      state.data = [];
      state.data_detail = null;
      state.data_filter = null;
      state.message = "";
      state.success = false;
    },
    resetPagination: (state) => {
      state.data_list = [];
      state.data_pagination = null;
    },
    resetSrFilterData: (state) => {
      state.data_sr_filter_list = [];
      state.data_sr_filter_pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDataRequirementTemplatePaginate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDataRequirementTemplatePaginate.fulfilled, (state, action) => {
        state.loading = false;
        const result = action.payload?.data?.result || [];
        if (action.payload?.isLoadMore) {
          state.data_list = [...(state.data_list || []), ...result];
        } else {
          state.data_list = result;
        }
        state.data_pagination = action.payload?.data?.page || null;
      })
      .addCase(getDataRequirementTemplatePaginate.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getDataRequirementTemplateDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDataRequirementTemplateDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.data_detail = action.payload?.data || null;
      })
      .addCase(getDataRequirementTemplateDetail.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getDataRequirementTemplateByFilter.pending, (state) => {
        state.loading_filter = true;
      })
      .addCase(getDataRequirementTemplateByFilter.fulfilled, (state, action) => {
        state.loading_filter = false;
        state.data_filter = action.payload?.data || null;
      })
      .addCase(getDataRequirementTemplateByFilter.rejected, (state) => {
        state.loading_filter = false;
        state.data_filter = null;
      })
      .addCase(getDataRequirementTemplatePaginateBySrFilter.pending, (state) => {
        state.loading_sr_filter = true;
      })
      .addCase(getDataRequirementTemplatePaginateBySrFilter.fulfilled, (state, action) => {
        state.loading_sr_filter = false;
        const result = action.payload?.data?.result || [];
        if (action.payload?.isLoadMore) {
          state.data_sr_filter_list = [...(state.data_sr_filter_list || []), ...result];
        } else {
          state.data_sr_filter_list = result;
        }
        state.data_sr_filter_pagination = action.payload?.data?.page || null;
      })
      .addCase(getDataRequirementTemplatePaginateBySrFilter.rejected, (state) => {
        state.loading_sr_filter = false;
        state.data_sr_filter_list = [];
        state.data_sr_filter_pagination = null;
      })
      .addCase(createDataRequirementTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDataRequirementTemplate.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createDataRequirementTemplate.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateDataRequirementTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDataRequirementTemplate.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateDataRequirementTemplate.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteDataRequirementTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDataRequirementTemplate.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteDataRequirementTemplate.rejected, (state) => {
        state.loading = false;
      })
      .addCase(activeInactiveDataRequirementTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(activeInactiveDataRequirementTemplate.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(activeInactiveDataRequirementTemplate.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetDataRequirementTemplate, resetPagination, resetSrFilterData } =
  dataRequirementTemplateSlice.actions;

export default dataRequirementTemplateSlice.reducer;
