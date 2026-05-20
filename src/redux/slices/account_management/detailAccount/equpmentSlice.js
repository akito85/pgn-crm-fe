import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { validateError } from "../../general_slice";
import { showModalSuccess } from "../../general_slice";
import accountManagementService from "../../../services/account_management/accountManagementService";
import { errorBody, errorCode, errorMessage } from "../../../../utils";

const initialState = {
  data: [],
  data_detail: {},
  loading: false,
  message: "",
  ddlNameEquipment: [],
  ddlTypeEquipment: [],
  ddlBrandEquipment: [],
  ddlQtyEquipment: [],
  ddlCapacityEquipment: [],
  ddlEnergyEquipment: [],
  ddlGasConversionEquipment: [],
  ddlFuelTypeEquipment: [],
  list_equipment: [],
  pagination_equipment: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },
};

// Get list pagination equpment
export const getListEqupment = createAsyncThunk(
  "GET_LIST_EQUIPMENT",
  async ({ id, page, pageSize, search, sort, isLoadMore }, thunkAPI) => {
    try {
      const searchParams = search === undefined ? "" : search;
      const sortParams =
        sort === undefined || sort === "" ? "createdDate~desc" : sort;
      const url = `/v1/dbs/api/account-detail/equipment/view-paging/${id}?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await accountManagementService.getPagination(url);
      return {
        ...response.data,
        isLoadMore,
      };
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_LIST_EQUIPMENT",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Detail Equipment
export const getDetailEquipment = createAsyncThunk(
  "GET_DETAIL_EQUIPMENT",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/equipment/view-detail/${id}`;
      const response = await accountManagementService.getDetail(url);
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DETAIL_EQUIPMENT",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

//Create Equipment
export const createEqupment = createAsyncThunk(
  "CREATE_EQUIPMENT",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/equipment/create-update`;
      const response = await accountManagementService.createData(url, body);
      const successBody = {
        title: `Successful`,
        description: body?.id ? "Your data has been updated." : "Your data has been created.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: errorBody(errorCode(error), "created", errorMessage(error)),
          action: "CREATE_EQUIPMENT",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const deleteEquipment = createAsyncThunk(
  "DELETE_EQUIPMENT",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/equipment/soft-delete/${id}`;
      const response = await accountManagementService.deleteData(url);
      const successBody = {
        title: `Successful`,
        description: "Your data has been deleted.",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      return response.data;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "DELETE_EQUIPMENT",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

/* ================= 
Drop Down List 
===============*/

// Get Ddl Name Equipment
export const getDdlNameEquipment = createAsyncThunk(
  "GET_DDL_NAME_EQUIPMENT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/equipment/drop-down-list/name`;
      const response = await accountManagementService.getAll(url);
      const result = response.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      return result;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DDL_NAME_EQUIPMENT",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Ddl Type Equipment
export const getDdlTypeEquipment = createAsyncThunk(
  "GET_DDL_TYPE_EQUIPMENT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/equipment/drop-down-list/type`;
      const response = await accountManagementService.getAll(url);
      const result = response.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      return result;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DDL_TYPE_EQUIPMENT",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Ddl Brand Equipment
export const getDdlBrandEquipment = createAsyncThunk(
  "GET_DDL_BRAND_EQUIPMENT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/equipment/drop-down-list/brand`;
      const response = await accountManagementService.getAll(url);
      const result = response.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      return result;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DDL_BRAND_EQUIPMENT",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Ddl Qty Uom Equipment
export const getDdlQtyEquipment = createAsyncThunk(
  "GET_DDL_QTY_EQUIPMENT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/equipment/drop-down-list/quantity-uom`;
      const response = await accountManagementService.getAll(url);
      const result = response.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      return result;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DDL_QTY_EQUIPMENT",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Ddl Capacity Uom Equipment
export const getDdlCapacityEquipment = createAsyncThunk(
  "GET_DDL_CAPACITY_EQUIPMENT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/equipment/drop-down-list/capacity-uom`;
      const response = await accountManagementService.getAll(url);
      const result = response.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      return result;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DDL_CAPACITY_EQUIPMENT",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Ddl Energy Uom Equipment
export const getDdlEnergyEquipment = createAsyncThunk(
  "GET_DDL_ENERGY_EQUIPMENT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/equipment/drop-down-list/energy-consumption-uom`;
      const response = await accountManagementService.getAll(url);
      const result = response.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      return result;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DDL_ENERGY_EQUIPMENT",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Ddl Gas Conversion Uom Equipment
export const getDdlGasConversionEquipment = createAsyncThunk(
  "GET_DDL_GAS_CONVERSION_EQUIPMENT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/equipment/drop-down-list/gas-conversion-uom`;
      const response = await accountManagementService.getAll(url);
      const result = response.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      return result;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DDL_GAS_CONVERSION_EQUIPMENT",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

// Get Ddl Fuel Type Equipment
export const getDdlFuelTypeEquipment = createAsyncThunk(
  "GET_DDL_FUEL_TYPE_EQUIPMENT",
  async (thunkAPI) => {
    try {
      const url = `/v1/dbs/api/account-detail/equipment/drop-down-list/fuel-type`;
      const response = await accountManagementService.getAll(url);
      const result = response.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      return result;
    } catch (error) {
      thunkAPI.dispatch(
        validateError({
          error: error,
          action: "GET_DDL_FUEL_TYPE_EQUIPMENT",
          back: false,
        })
      );
      return thunkAPI.rejectWithValue(error?.response);
    }
  }
);

const accountEquipmentSlice = createSlice({
  name: "accountEquipment",
  initialState,
  extraReducers: {
    // Get Pagination Equipment
    [getListEqupment.pending]: (state, action) => {
      if (!action.meta.arg?.isLoadMore) {
        state.loading = true;
      }
    },
    [getListEqupment.rejected]: (state, action) => {
      state.loading = false;

      if (!action.meta.arg?.isLoadMore) {
        state.list_equipment = [];
        state.pagination_equipment = {
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          pageSize: 10,
        };
      }
    },
    [getListEqupment.fulfilled]: (state, action) => {
      state.loading = false;
      const { result, page, isLoadMore } = action.payload;

      if (Array.isArray(result)) {
        if (isLoadMore) {
          const currentIds = new Set(state.list_equipment.map((item) => item.id));
          const filteredResult = result.filter(
            (resultItem) => !currentIds.has(resultItem.id)
          );

          state.list_equipment = [
            ...state.list_equipment,
            ...filteredResult,
          ];
        } else {
          state.list_equipment = result;
        }
      }

      state.pagination_equipment = {
        totalPages: page?.totalPages || 0,
        totalElements: page?.totalElements || 0,
        currentPage: page?.number || 0,
        pageSize: page?.size || 10,
      };
    },

    // Get Detail Equipment
    [getDetailEquipment.pending]: (state) => {
      state.loading = true;
    },
    [getDetailEquipment.rejected]: (state) => {
      state.loading = false;
    },
    [getDetailEquipment.fulfilled]: (state, action) => {
      state.data_detail = action.payload;
      state.loading = false;
    },

    // Get Ddl Name Equipment
    [getDdlNameEquipment.pending]: (state) => {
      state.loading = true;
    },
    [getDdlNameEquipment.rejected]: (state) => {
      state.loading = false;
    },
    [getDdlNameEquipment.fulfilled]: (state, action) => {
      state.ddlNameEquipment = action.payload;
      state.loading = false;
    },

    // Get Ddl Type Equipment
    [getDdlTypeEquipment.pending]: (state) => {
      state.loading = true;
    },
    [getDdlTypeEquipment.rejected]: (state) => {
      state.loading = false;
    },
    [getDdlTypeEquipment.fulfilled]: (state, action) => {
      state.ddlTypeEquipment = action.payload;
      state.loading = false;
    },

    // Get Ddl Brand Equipment
    [getDdlBrandEquipment.pending]: (state) => {
      state.loading = true;
    },
    [getDdlBrandEquipment.rejected]: (state) => {
      state.loading = false;
    },
    [getDdlBrandEquipment.fulfilled]: (state, action) => {
      state.ddlBrandEquipment = action.payload;
      state.loading = false;
    },

    // Get Ddl Quantity
    [getDdlQtyEquipment.pending]: (state) => {
      state.loading = true;
    },
    [getDdlQtyEquipment.rejected]: (state) => {
      state.loading = false;
    },
    [getDdlQtyEquipment.fulfilled]: (state, action) => {
      state.ddlQtyEquipment = action.payload;
      state.loading = false;
    },

    // Get Ddl Capacity
    [getDdlCapacityEquipment.pending]: (state) => {
      state.loading = true;
    },
    [getDdlCapacityEquipment.rejected]: (state) => {
      state.loading = false;
    },
    [getDdlCapacityEquipment.fulfilled]: (state, action) => {
      state.ddlCapacityEquipment = action.payload;
      state.loading = false;
    },

    // Get Ddl Energy
    [getDdlEnergyEquipment.pending]: (state) => {
      state.loading = true;
    },
    [getDdlEnergyEquipment.rejected]: (state) => {
      state.loading = false;
    },
    [getDdlEnergyEquipment.fulfilled]: (state, action) => {
      state.ddlEnergyEquipment = action.payload;
      state.loading = false;
    },

    // Get Ddl Gas Conversion
    [getDdlGasConversionEquipment.pending]: (state) => {
      state.loading = true;
    },
    [getDdlGasConversionEquipment.rejected]: (state) => {
      state.loading = false;
    },
    [getDdlGasConversionEquipment.fulfilled]: (state, action) => {
      state.ddlGasConversionEquipment = action.payload;
      state.loading = false;
    },

    // Get Ddl Fuel TYpe
    [getDdlFuelTypeEquipment.pending]: (state) => {
      state.loading = true;
    },
    [getDdlFuelTypeEquipment.rejected]: (state) => {
      state.loading = false;
    },
    [getDdlFuelTypeEquipment.fulfilled]: (state, action) => {
      state.ddlFuelTypeEquipment = action.payload;
      state.loading = false;
    },

    // Create Equipment
    [createEqupment.pending]: (state) => {
      state.loading = true;
    },
    [createEqupment.rejected]: (state) => {
      state.loading = false;
    },
    [createEqupment.fulfilled]: (state) => {
      state.loading = false;
    },

    // Delete Equipment
    [deleteEquipment.pending]: (state) => {
      state.loading = true;
    },
    [deleteEquipment.rejected]: (state) => {
      state.loading = false;
    },
    [deleteEquipment.fulfilled]: (state) => {
      state.loading = false;
    },
  },
});

const { reducer } = accountEquipmentSlice;
export default reducer;
