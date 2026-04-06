import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../../services/ratingBillingHttpService";
import { showModalSuccess, validateError } from "../../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../../utils";

const initialState = {
  data: [],
  pagination: {},
  data_detail: {},
  data_detail_draft: {},
  data_approval_history: {},
  data_by_month_year: [],
  data_holiday_type: [],
  dataListCategory: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  loading: false,
  loading_calendar: false,
  isFailed: false,
  isSuccess: false,
};

export const getListCalendar = createAsyncThunk(
  "LIST_CALENDAR",
  async ({ search, page, size, sort, isLoadMore }, thunkAPI) => {
    try {
      const sortArray = Array.isArray(sort) ? sort : [];

      const searchParams =
        search && typeof search === "object" && Object.keys(search).length > 0
          ? JSON.stringify(search)
          : "";

      const sortParams =
        sortArray.length > 0 ? sortArray.join("&sort=") : "createdDate~desc";

      const url = `/v1/dbs/api/calendar/list?${searchParams ? `searchs=${encodeURIComponent(searchParams)}&` : ""}page=${page}&size=${size}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.getPagination(url);
      return { ...response.data, isLoadMore };
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "LIST_CALENDAR",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  },
);

export const getApprovalHistory = createAsyncThunk(
  "GET_APPROVAL_HISTORY_CALENDAR",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/calendar/approval-history/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "GET_APPROVAL_HISTORY_CALENDAR",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  },
);

export const getAvailableApproval = createAsyncThunk(
  "GET_AVAILABLE_APPROVAL_CALENDAR",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/calendar/approval-hierarcy-list`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (response) {
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  },
);

export const getSelectedApproval = createAsyncThunk(
  "GET_SELECTED_APPROVAL_CALENDAR",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/calendar/apphier-detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (response) {
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  },
);

export const inactiveCalendar = createAsyncThunk(
  "INACTIVE_CALENDAR",
  async (body, thunkAPI) => {
    const status = body?.status === "INACTIVE" ? "activated" : "inactivated";
    try {
      const url = `/v1/dbs/api/calendar/inactive`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
      );
      const successMessage = {
        title: "Successful",
        description: response?.message || `Calendar has been ${status}.`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(response), status, errorMessage(response)),
          action: "INACTIVE_CALENDAR",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  },
);

export const getCalendarByMonthYear = createAsyncThunk(
  "GET_CALENDAR_BY_MONTH_YEAR",
  async ({ month, year }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/calendar/by-month-year?month=${month}&year=${year}`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "GET_CALENDAR_BY_MONTH_YEAR",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  },
);

export const downloadCalendar = createAsyncThunk(
  "DOWNLOAD_CALENDAR",
  async ({ sort, page, size, search }, thunkAPI) => {
    try {
      const sortArray = Array.isArray(sort) ? sort : [];

      const searchParams =
        search && typeof search === "object" && Object.keys(search).length > 0
          ? JSON.stringify(search)
          : "";

      const sortParams =
        sortArray.length > 0 ? sortArray.join("&sort=") : "createdDate~desc";

      const url = `/v1/dbs/api/calendar/download?${searchParams ? `searchs=${encodeURIComponent(searchParams)}&` : ""}page=${page}&size=${size}&sort=${sortParams}`;
      const response = await ratingBillingHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "DOWNLOAD_CALENDAR",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  },
);

export const getDetailCalendar = createAsyncThunk(
  "GET_DETAIL_CALENDAR",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/calendar/detail/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: response,
          action: "GET_DETAIL_CALENDAR",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  },
);

export const getDetailDraftCalendar = createAsyncThunk(
  "GET_DETAIL_DRAFT_CALENDAR",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/calendar/detail-draft/${id}`;
      const response = await ratingBillingHttpService.getDetail(url);
      return response.data;
    } catch (response) {
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  },
);

export const getHolidayType = createAsyncThunk(
  "GET_HOLIDAY_TYPE_CALENDAR",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/calendar/holiday-type`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (response) {
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  },
);

export const getAttachmentCategoryCalendar = createAsyncThunk(
  "GET_ATTACHMENT_CATEGORY_CALENDAR",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/calendar/category-list`;
      const response = await ratingBillingHttpService.getAll(url);
      return response.data;
    } catch (response) {
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  },
);

export const createCalendar = createAsyncThunk(
  "CREATE_CALENDAR",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/calendar/save`;
      const response = await ratingBillingHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: response?.message || "Calendar has been created.",
        return: true,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "created",
            errorMessage(response),
          ),
          action: "CREATE_CALENDAR",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  },
);

export const updateCalendar = createAsyncThunk(
  "UPDATE_CALENDAR",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/calendar/save`;
      const response = await ratingBillingHttpService.updateData(url, body);
      const successMessage = {
        title: "Successful",
        description: response?.message || "Calendar has been updated.",
        return: true,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            "updated",
            errorMessage(response),
          ),
          action: "UPDATE_CALENDAR",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  },
);

export const approveRejectCalendar = createAsyncThunk(
  "APPROVE_REJECT_CALENDAR",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/calendar/${body.id}/approve`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
      );
      const successMessage = {
        title: "Successful",
        description: `Your data has been ${
          body.action === "APPROVE" ? "approved" : "rejected"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            body.action === "APPROVE" ? "approved" : "rejected",
            errorMessage(response),
          ),
          action: "APPROVE_REJECT_CALENDAR",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  },
);

export const approveRejectInactiveCalendar = createAsyncThunk(
  "APPROVE_REJECT_INACTIVE_CALENDAR",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/calendar/${body.id}/approval-inactive`;
      const response = await ratingBillingHttpService.activationWithRemark(
        url,
        body,
      );
      const successMessage = {
        title: "Successful",
        description: `Your data has been ${
          body.action === "APPROVE" ? "approved" : "rejected"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(
            errorCode(response),
            body.action === "APPROVE" ? "approved" : "rejected",
            errorMessage(response),
          ),
          action: "APPROVE_REJECT_INACTIVE_CALENDAR",
          back: false,
        }),
      );
      return thunkAPI.rejectWithValue(response?.response?.data);
    }
  },
);

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  extraReducers: {
    // get list
    [getListCalendar.pending]: (state) => {
      state.isFailed = false;
      state.isSuccess = false;
      state.loading = true;
    },
    [getListCalendar.fulfilled]: (state, action) => {
      if (!action.payload) {
        state.loading = false;
        return;
      }
      const { isLoadMore, result, ...rest } = action.payload;
      if (isLoadMore) {
        state.data = [...(state.data || []), ...(result || [])];
      } else {
        state.data = result || [];
      }
      state.pagination = rest;
      state.loading = false;
      state.isFailed = false;
      state.isSuccess = false;
    },
    [getListCalendar.rejected]: (state) => {
      state.data = [];
      state.loading = false;
    },

    // approval history
    [getApprovalHistory.pending]: (state) => {
      state.loading = true;
    },
    [getApprovalHistory.fulfilled]: (state, action) => {
      state.data_approval_history = action.payload;
      state.loading = false;
    },
    [getApprovalHistory.rejected]: (state) => {
      state.data_approval_history = {};
      state.loading = false;
    },

    // available approval list
    [getAvailableApproval.pending]: (state) => {
      state.loading = true;
    },
    [getAvailableApproval.fulfilled]: (state, action) => {
      state.dataListAppHierId = action.payload || [];
      state.loading = false;
    },
    [getAvailableApproval.rejected]: (state) => {
      state.dataListAppHierId = [];
      state.loading = false;
    },

    // selected approval detail
    [getSelectedApproval.pending]: (state) => {
      state.loading = true;
    },
    [getSelectedApproval.fulfilled]: (state, action) => {
      state.dataListAppHierDetail = action.payload || [];
      state.loading = false;
    },
    [getSelectedApproval.rejected]: (state) => {
      state.dataListAppHierDetail = [];
      state.loading = false;
    },

    // inactive
    [inactiveCalendar.pending]: (state) => {
      state.loading = true;
    },
    [inactiveCalendar.fulfilled]: (state) => {
      state.loading = false;
    },
    [inactiveCalendar.rejected]: (state) => {
      state.isFailed = true;
      state.loading = false;
    },

    // download
    [downloadCalendar.pending]: (state) => {
      state.loading = true;
    },
    [downloadCalendar.fulfilled]: (state) => {
      state.loading = false;
    },
    [downloadCalendar.rejected]: (state) => {
      state.loading = false;
    },

    // get by month year
    [getCalendarByMonthYear.pending]: (state) => {
      state.loading_calendar = true;
    },
    [getCalendarByMonthYear.fulfilled]: (state, action) => {
      state.data_by_month_year = action.payload || [];
      state.loading_calendar = false;
    },
    [getCalendarByMonthYear.rejected]: (state) => {
      state.data_by_month_year = [];
      state.loading_calendar = false;
    },

    // get detail
    [getDetailCalendar.pending]: (state) => {
      state.loading = true;
    },
    [getDetailCalendar.fulfilled]: (state, action) => {
      state.data_detail = action.payload || {};
      state.loading = false;
    },
    [getDetailCalendar.rejected]: (state) => {
      state.data_detail = {};
      state.loading = false;
    },

    // get detail draft
    [getDetailDraftCalendar.pending]: (state) => {
      state.loading = true;
    },
    [getDetailDraftCalendar.fulfilled]: (state, action) => {
      state.data_detail_draft = action.payload || {};
      state.loading = false;
    },
    [getDetailDraftCalendar.rejected]: (state) => {
      state.data_detail_draft = {};
      state.loading = false;
    },

    // get holiday type
    [getHolidayType.pending]: (state) => {
      state.loading = true;
    },
    [getHolidayType.fulfilled]: (state, action) => {
      state.data_holiday_type = action.payload || [];
      state.loading = false;
    },
    [getHolidayType.rejected]: (state) => {
      state.data_holiday_type = [];
      state.loading = false;
    },

    // get attachment category
    [getAttachmentCategoryCalendar.pending]: (state) => {
      state.loading = true;
    },
    [getAttachmentCategoryCalendar.fulfilled]: (state, action) => {
      state.dataListCategory = (action.payload || []).map((item) => ({
        Id: item.id,
        text: item.name,
      }));
      state.loading = false;
    },
    [getAttachmentCategoryCalendar.rejected]: (state) => {
      state.dataListCategory = [];
      state.loading = false;
    },

    // create
    [createCalendar.pending]: (state) => {
      state.loading = true;
    },
    [createCalendar.fulfilled]: (state) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [createCalendar.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    // update
    [updateCalendar.pending]: (state) => {
      state.loading = true;
    },
    [updateCalendar.fulfilled]: (state) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [updateCalendar.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    // approve / reject
    [approveRejectCalendar.pending]: (state) => {
      state.loading = true;
    },
    [approveRejectCalendar.fulfilled]: (state) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [approveRejectCalendar.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },

    // approve / reject inactive
    [approveRejectInactiveCalendar.pending]: (state) => {
      state.loading = true;
    },
    [approveRejectInactiveCalendar.fulfilled]: (state) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [approveRejectInactiveCalendar.rejected]: (state) => {
      state.loading = false;
      state.isFailed = true;
    },
  },
});

export default calendarSlice.reducer;
