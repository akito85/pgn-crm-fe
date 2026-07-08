import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import masterCostCenterService from "../../../services/system_setup/master_data/master_cost_center";
import userHttpService from "../../../services/userHttpService";
import { showModalSuccess, validateError } from "../../general_slice";
import { errorBody, errorCode, errorMessage } from "../../../../utils";

const initialState = {
  data: null,
  parentData: null,
  typeData: [],
  siblingsData: [],
  siblingsDataByParent: [],
  loading: false,
  data_detail: null,
};

// get all data cost center
export const getAllCostCenter = createAsyncThunk(
  "GET_ALL_MASTER_COST_CENTER",
  async ({ search, searchText, page, pageSize, sort, filters = [], filterRules = [] }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/costcenter/paging`;
      const body = {
        page,
        size: pageSize,
        sort: sort || "createdDate~desc",
        search: searchText || null,
        searchs: search || {},
        filters,
        filterRules,
      };
      const response = await userHttpService.createData(url, body);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_ALL_MASTER_COST_CENTER",
          back: false,
        })
      );

      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
// get update data cost center
export const getUpdateCostCenter = createAsyncThunk(
  "GET_UPDATE_COST_CENTER",
  async (id, thunkAPI) => {
    try {
      const response = await masterCostCenterService.getUpdateCostCenter(id);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_UPDATE_COST_CENTER",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// create data cost center
export const createCostCenter = createAsyncThunk(
  "CREATE_COST_CENTER",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/costcenter/`;
      const data = await userHttpService.createData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Your data has been created",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "CREATE_COST_CENTER",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

// update data cost center
export const updateCostCenter = createAsyncThunk(
  "UPDATE_COST_CENTER",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/costcenter/`;
      const data = await userHttpService.updateData(url, body);
      const successMessage = {
        title: "Successful",
        description: "Your data has been updated",
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "updated", errorMessage(error)),
          action: "UPDATE_COST_CENTER",
          back: false,
        })
      );

      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

// get Hierarchy
export const getHierarchy = createAsyncThunk(
  "GET_HIERARCHY",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/costcenter/getHierarchy`;
      const response = await userHttpService.getAll(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({ error: error, action: "GET_HIERARCHY", back: false })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

// get Parent Hierarchy
export const getParent = createAsyncThunk("GET_PARENT", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/costcenter/getParentCostCenter`;
    const response = await userHttpService.getAll(url);
    return response.data;
  } catch (error) {
    thunkAPI.dispatch(
      validateError({ error: error, action: "GET_PARENT", back: false })
    );
    return thunkAPI.rejectWithValue(error.response);
  }
});

// get Type
export const getType = createAsyncThunk("GET_TYPE", async (thunkAPI) => {
  try {
    const url = `/v1/dbs/api/costcenter/getTypeCostCenter`;
    const data = await userHttpService.getAll(url);
    return data;
  } catch (error) {
    thunkAPI.dispatch(
      validateError({ error: error, action: "GET_TYPE", back: false })
    );
    return thunkAPI.rejectWithValue(error.response);
  }
});

// get siblings by parent id
export const getSiblingByParent = createAsyncThunk(
  "GET_SIBLINGS_BY_PARENT_ID",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/costcenter/create/${id}/getSiblings`;
      const response = await userHttpService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_SIBLINGS_BY_PARENT_ID",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

// slices get detail cost center
export const getCostCenterDetail = createAsyncThunk(
  "GET_COST_CENTER_DETAIL",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/costcenter/getDetail/${id}`;
      const data = await userHttpService.getDetail(url);
      return data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_COST_CENTER_DETAIL",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

// slices get detail sibling
export const getSiblingDetail = createAsyncThunk(
  "GET_SIBLINGS_DETAIL",
  async (obj, thunkAPI) => {
    try {
      const response = await masterCostCenterService.getSiblingDetail(obj);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_SIBLINGS_DETAIL",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

// activate cost center slices
export const activateCostCenter = createAsyncThunk(
  "ACTIVATE_COST_CENTER",
  async (body, thunkAPI) => {
    let status = body?.status === "Activate" ? "activated" : "inactivated";
    try {
      const url = `/v1/dbs/api/costcenter/inactive/active`;
      const response = await userHttpService.activationWithRemark(url, body);
      const message = response.message;
      const successMessage = {
        title: "Successfull",
        description: `${message}`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successMessage));
      return response.data;
    } catch (response) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(response), status, errorMessage(response)),
          action: "ACTIVATE_COST_CENTER",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(response.response.data);
    }
  }
);

// delete cost center
export const deleteCostCenter = createAsyncThunk(
  "DELETE_GLOBAL_TYPE",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/costcenter/${id}/delete`;
      const response = await userHttpService.deleteData(url);
      return response.status;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DELETE_GLOBAL_TYPE",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

export const downloadMasterCostCenter = createAsyncThunk(
  "DOWNLOAD_MASTER_COST_CENTER",
  async ({ sort, page, pageSize, search, searchText, filters = [], filterRules = [] }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/costcenter/download-filter`;
      const body = {
        page,
        size: pageSize,
        sort: sort || "createdDate~desc",
        search: searchText || null,
        searchs: search || {},
        filters,
        filterRules,
      };
      const response = await userHttpService.downloadData(url, body);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DOWNLOAD_MASTER_COST_CENTER",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);
const masterCostCenterSlice = createSlice({
  name: "master_cost_center",
  initialState,
  extraReducers: {
    // get all
    [getAllCostCenter.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [getAllCostCenter.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getAllCostCenter.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // Detail cost center
    [getCostCenterDetail.pending]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = true;
    },
    [getCostCenterDetail.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },
    [getCostCenterDetail.rejected]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },

    // Get silings detail
    [getSiblingDetail.pending]: (state, action) => {
      state.siblingsData = action.payload;
      state.loading = true;
    },
    [getSiblingDetail.fulfilled]: (state, action) => {
      state.siblingsData = action.payload;
      state.loading = false;
    },
    [getSiblingDetail.rejected]: (state) => {
      state.loading = false;
    },

    // Activate cost center
    [activateCostCenter.pending]: (state) => {
      state.loading = true;
    },
    [activateCostCenter.fulfilled]: (state) => {
      state.isSuccess = true;
      state.loading = false;
    },
    [activateCostCenter.rejected]: (state, action) => {
      state.isFailed = true;
      state.loading = false;
      state.message = action.payload;
    },

    // Delete cost center
    [deleteCostCenter.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [deleteCostCenter.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [deleteCostCenter.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // Hierarchy
    [getHierarchy.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [getHierarchy.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getHierarchy.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // Get Parent
    [getParent.pending]: (state, action) => {
      state.parentData = action.payload;
      state.loading = true;
    },
    [getParent.fulfilled]: (state, action) => {
      state.parentData = action.payload;
      state.loading = false;
    },
    [getParent.rejected]: (state, action) => {
      state.parentData = action.payload;
      state.loading = false;
    },

    // Get Type
    [getType.pending]: (state, action) => {
      state.typeData = action.payload;
      state.loading = true;
    },
    [getType.fulfilled]: (state, action) => {
      state.typeData = action.payload;
      state.loading = false;
    },
    [getType.rejected]: (state, action) => {
      state.loading = false;
    },

    // Get siblings by id parent
    [getSiblingByParent.pending]: (state, action) => {
      state.siblingsDataByParent = action.payload;
      state.loading = true;
    },
    [getSiblingByParent.fulfilled]: (state, action) => {
      state.siblingsDataByParent = action.payload;
      state.loading = false;
    },
    [getSiblingByParent.rejected]: (state, action) => {
      state.siblingsDataByParent = action.payload;
      state.loading = false;
    },

    // Create Cost Center
    [createCostCenter.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [createCostCenter.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [createCostCenter.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // Get update Cost Center
    [getUpdateCostCenter.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [getUpdateCostCenter.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getUpdateCostCenter.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // Post update Cost Center
    [updateCostCenter.pending]: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    [updateCostCenter.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [updateCostCenter.rejected]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    // download
    [downloadMasterCostCenter.pending]: (state) => {
      state.loading = true;
    },
    [downloadMasterCostCenter.fulfilled]: (state) => {
      // state.data = action.payload;
      state.loading = false;
    },
    [downloadMasterCostCenter.rejected]: (state) => {
      // state.data = action.payload;
      state.loading = false;
    },
  },
});

const { reducer } = masterCostCenterSlice;
export default reducer;
