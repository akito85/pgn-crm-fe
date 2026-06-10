import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showModalSuccess, validateError } from "../general_slice";
import userHttpService from "../../services/userHttpService";
import { errorBody, errorCode, errorMessage, hasValue } from "../../../utils";

const initialState = {
  loading: false,
  data_Delegation: [],
  detail_Delegation: [],
  position_Delegation: [],
  delegate_To: [],
};

export const getDelegationList = createAsyncThunk(
  "GET_DELEGATION_LIST",
  async ({ page, pageSize, search, sort }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/user-delegation/view-paging?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await userHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_DELEGATION_LIST" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const getDelegationDetail = createAsyncThunk(
  "GET_DELEGATION_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/user-delegation/detail/${id}`;
      const response = await userHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_DELEGATION_DETAIL" })
      );
      return thunkAPI.rejectWithValue(
        error.response.data.code === 419 ? null : error.response.data
      );
    }
  }
);

export const approveRejectDelegation = createAsyncThunk(
  "APPROVE_REJECT_DELEGATION",
  async ({ body }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/user-delegation/approval-user-delegation`;
      const response = await userHttpService.activationWithRemark(url, body);
      const successBody = {
        title: "Successful",
        description: `Your data has been ${
          body.action === "APPROVE" ? "approved" : "rejected"
        }.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "submitted", errorMessage(error)),
          action: "APPROVE_REJECT_DELEGATION",
          back: false,
        })
      );

      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getPositionDelegation = createAsyncThunk(
  "GET_POSITION_DELEGATION",
  async (_, thunkAPI) => {
    try {
      const url = "/v1/dbs/api/user-delegation/get-position";
      const response = await userHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_POSITION_DELEGATION" })
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.code === 419 ? null : error.response?.data
      );
    }
  }
);

export const getDelegateTo = createAsyncThunk(
  "GET_DELEGATE_TO",
  async (id, thunkAPI) => {
    try {
      if (hasValue(id)) {
        const url = `/v1/dbs/api/user-delegation/get-delegate-to/${id}`;
        const response = await userHttpService.getDetail(url);
        return response.data;
      }
      return [];
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_DELEGATE_TO" })
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.code === 419 ? null : error.response?.data
      );
    }
  }
);

export const createDelegation = createAsyncThunk(
  "CREATE_DELEGATION",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/user-delegation/create`;
      const response = await userHttpService.createData(url, body);
      const successBody = {
        title: "Successful",
        description: `Your data has been created.`,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "CREATE_DELEGATION",
          back: false,
        })
      );

      return thunkAPI.rejectWithValue(error);
    }
  }
);

const delegationSlice = createSlice({
  name: "delegation",
  initialState,
  extraReducers: {
    //GET DELEGATION LIST
    [getDelegationList.pending]: (state) => {
      state.loading = true;
    },
    [getDelegationList.fulfilled]: (state, action) => {
      state.loading = false;
      state.data_Delegation = action.payload;
    },
    [getDelegationList.rejected]: (state) => {
      state.loading = false;
    },
    //GET DETAIL DELEGATION LIST
    [getDelegationDetail.pending]: (state) => {
      state.loading = true;
    },
    [getDelegationDetail.fulfilled]: (state, action) => {
      state.loading = false;
      state.detail_Delegation = action.payload;
    },
    [getDelegationDetail.rejected]: (state) => {
      state.loading = false;
    },
    //GET POSITION
    [getPositionDelegation.pending]: (state) => {
      state.loading = true;
    },
    [getPositionDelegation.fulfilled]: (state, action) => {
      state.loading = false;
      state.position_Delegation = action.payload;
    },
    [getPositionDelegation.rejected]: (state) => {
      state.loading = false;
    },
    //GET DELEGATE TO
    [getDelegateTo.pending]: (state) => {
      state.loading = true;
    },
    [getDelegateTo.fulfilled]: (state, action) => {
      state.loading = false;
      state.delegate_To = action.payload;
    },
    [getDelegateTo.rejected]: (state) => {
      state.loading = false;
    },
    //APPROVE REJECT DELEGATION
    [approveRejectDelegation.pending]: (state) => {
      state.loading = true;
    },
    [approveRejectDelegation.fulfilled]: (state) => {
      state.loading = false;
    },
    [approveRejectDelegation.rejected]: (state) => {
      state.loading = false;
    },
    //CREATE DELEGATION
    [createDelegation.pending]: (state) => {
      state.loading = true;
    },
    [createDelegation.fulfilled]: (state) => {
      state.loading = false;
    },
    [createDelegation.rejected]: (state) => {
      state.loading = false;
    },
  },
});

const { reducer } = delegationSlice;
export default reducer;
