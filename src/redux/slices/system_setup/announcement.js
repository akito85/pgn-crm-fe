import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { validateError, showModalError } from "../general_slice";
import { setBodyError, showModalSuccess } from "../general_slice";
import userHttpService from "../../services/userHttpService";
import { errorBody, errorCode, errorMessage } from "../../../utils";

const initialState = {
  loading: false,
  data_Announcement: [],
  detail_Announcement: [],
  create_Announcement: [],
  update_Announcement: [],
  inactive_Announcement: [],
  download_Announcement: [],
  allow_file: [],
};

export const getAnnouncementList = createAsyncThunk(
  "GET_ANNOUNCEMENT_LIST",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/announcement/paging?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await userHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_ANNOUNCEMENT_LIST" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getAnnouncementDetail = createAsyncThunk(
  "GET_ANNOUNCEMENT_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/announcement/detail/${id}`;
      const response = await userHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error, action: "GET_ANNOUNCEMENT_DETAIL" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const inactiveAnnouncement = createAsyncThunk(
  "INACTIVE_ANNOUNCEMENT",
  async ({ body, action }, thunkAPI) => {
    let status = action === "INACTIVE" ? "inactivated" : "activated";
    try {
      const url = `/v1/dbs/api/announcement/activeInactive`;
      const response = await userHttpService.activationWithRemark(url, body);
      const successBody = {
        title: "Successful",
        description: `Your data has been ${action === "INACTIVE" ? "activated" : "inactivated"
          }`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: errorBody(errorCode(error), status, errorMessage(error)), action: "INACTIVE_ANNOUNCEMENT", back: false }))
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const createHtmlAnnouncement = createAsyncThunk(
  "CREATE_HTML_ANNOUNCEMENT",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/announcement/create`;
      const response = await userHttpService.createData(url, body);
      const successBody = {
        title: "Successful",
        description: `Your data has been created.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(validateError({ error: errorBody(errorCode(error), 'created', errorMessage(error)), action: "CREATE_HTML_ANNOUNCEMENT", back: false }))
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createImageAnnouncement = createAsyncThunk(
  "CREATE_IMAGE_ANNOUNCEMENT",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/announcement/create`;
      const response = await userHttpService.createData(url, body);
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
            validateError({ error, action: "CREATE_IMAGE_ANNOUNCEMENT" })
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${body.isSubmit ? "created" : "submitted"
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

export const updateHtmlAnnouncement = createAsyncThunk(
  "UPDATE_HTML_ANNOUNCEMENT",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/announcement/update`;
      const response = await userHttpService.updateData(url, body);
      const successBody = {
        title: "Successful",
        description: `Your data has been updated.`,
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
            validateError({ error, action: "UPDATE_HTML_ANNOUNCEMENT" })
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not updated ${message}.`,
          };
          thunkAPI.dispatch(showModalError(errorBody));
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateImageAnnouncement = createAsyncThunk(
  "UPDATE_IMAGE_ANNOUNCEMENT",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/announcement/update`;
      const response = await userHttpService.updateData(url, body);
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
            validateError({ error, action: "UPDATE_IMAGE_ANNOUNCEMENT" })
          );
        } else {
          const errorBody = {
            title: "Failed",
            description: `Your data was not ${body.isSubmit ? "updated" : "submitted"
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

export const checkAllowingFile = createAsyncThunk("CHECK_ALLOWING_FILE",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/announcement/config-file`;
      const data = await userHttpService.getAll(url);
      return data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      if (error?.response?.data?.code === 500 || error?.response?.data?.code === 419) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        const errorBody = {
          title: "Failed",
          description: `${message}. Please try again.`,
        };
        thunkAPI.dispatch(showModalError(errorBody));
      }
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
)

export const downloadAnnouncement = createAsyncThunk(
  "DOWNLOAD_ANNOUNCEMENT",
  async ({ search, page, pageSize, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/announcement/download-filter?page=${page}&size=${pageSize}&searchs=${searchParams}&sort=${sortParams}`;
      const response = await userHttpService.downloadData(url);
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({ response, action: "DOWNLOAD_ANNOUNCEMENT" })
      );
      return thunkAPI.rejectWithValue(
        response.response.data.code === 419 ? null : response.response.data
      );
    }
  }
);

const announcementSlice = createSlice({
  name: "announcement",
  initialState,
  extraReducers: {
    //GET ANNOUNCEMENT LIST
    [getAnnouncementList.pending]: (state, action) => {
      state.loading = true;
    },
    [getAnnouncementList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_Announcement = action.payload;
    },
    [getAnnouncementList.rejected]: (state, action) => {
      state.loading = false;
    },

    //GET ANNOUNCEMENT DETAIL
    [getAnnouncementDetail.pending]: (state, action) => {
      state.loading = true;
    },
    [getAnnouncementDetail.fulfilled]: (state, action) => {
      state.loading = false;
      state.detail_Announcement = action.payload;
    },
    [getAnnouncementDetail.rejected]: (state, action) => {
      state.loading = false;
    },

    //CREATE ANNOUNCEMENT 
    [createHtmlAnnouncement.pending]: (state, action) => {
      state.loading = true;
    },
    [createHtmlAnnouncement.fulfilled]: (state, action) => {
      state.loading = false;
      state.create_Announcement = action.payload;
    },
    [createHtmlAnnouncement.rejected]: (state, action) => {
      state.loading = false;
    },

    //UPDATE ANNOUNCEMENT 
    [updateHtmlAnnouncement.pending]: (state, action) => {
      state.loading = true;
    },
    [updateHtmlAnnouncement.fulfilled]: (state, action) => {
      state.loading = false;
      state.update_Announcement = action.payload;
    },
    [updateHtmlAnnouncement.rejected]: (state, action) => {
      state.loading = false;
    },

    //INACTIVE ANNOUNCEMENT
    [inactiveAnnouncement.pending]: (state, action) => {
      state.loading = true;
    },
    [inactiveAnnouncement.fulfilled]: (state, action) => {
      state.loading = false;
      state.inactive_Announcement = action.payload;
    },
    [inactiveAnnouncement.rejected]: (state, action) => {
      state.loading = false;
    },

    // check allowing file
    [checkAllowingFile.pending]: (state, action) => {
      state.loading = true;
    },
    [checkAllowingFile.fulfilled]: (state, action) => {
      state.loading = false;
      state.allow_file = action.payload;
    },
    [checkAllowingFile.rejected]: (state, action) => {
      state.loading = false;
      state.allow_file = action.payload;
    },

    //DOWNLOAD ANNOUNCEMENT
    [downloadAnnouncement.pending]: (state, action) => {
      state.loading = true;
    },
    [downloadAnnouncement.fulfilled]: (state, action) => {
      state.loading = false;
      state.download_Announcement = action.payload;
    },
    [downloadAnnouncement.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

const { reducer } = announcementSlice;
export default reducer;
