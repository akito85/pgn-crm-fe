import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ratingBillingHttpService from "../../../services/ratingBillingHttpService";
import { showModalSuccess, validateError } from "../../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../../utils";

const initialState = {
  data: [],
  pagination: {},
  data_detail: {},
  data_approval_history: {},
  data_by_month_year: [],
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
      const url = `/v1/dbs/api/calendar/active/inactive`;
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
  },
});

export default calendarSlice.reducer;
