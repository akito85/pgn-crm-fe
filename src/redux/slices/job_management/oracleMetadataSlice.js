import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userHttpService from "../../services/userHttpService";

const BASE = "/job/dbs/api/v1/oracle";

export const fetchSchemas = createAsyncThunk(
  "oracleMetadata/fetchSchemas",
  async (_, thunkAPI) => {
    try {
      const response = await userHttpService.getAll(`${BASE}/schemas`);
      return response?.data ?? [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data ?? error.message);
    }
  }
);

export const fetchProcedures = createAsyncThunk(
  "oracleMetadata/fetchProcedures",
  async (schema, thunkAPI) => {
    try {
      const response = await userHttpService.getAll(
        `${BASE}/schemas/${schema}/procedures`
      );
      return { schema, procedures: response?.data ?? [] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data ?? error.message);
    }
  }
);

export const fetchProcedureParameters = createAsyncThunk(
  "oracleMetadata/fetchProcedureParameters",
  async ({ schema, procedure }, thunkAPI) => {
    try {
      const response = await userHttpService.getAll(
        `${BASE}/schemas/${schema}/procedures/${procedure}/parameters`
      );
      return { schema, procedure, parameters: response?.data ?? [] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data ?? error.message);
    }
  }
);

const oracleMetadataSlice = createSlice({
  name: "oracleMetadata",
  initialState: {
    schemas: [],
    schemasLoading: false,
    procedures: {}, // keyed by schema name
    proceduresLoading: false,
    parameters: {}, // keyed by "schema/procedure"
    parametersLoading: false,
    error: null,
  },
  reducers: {
    clearProcedures(state) {
      state.procedures = {};
      state.parameters = {};
    },
    clearParameters(state) {
      state.parameters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchemas.pending, (state) => {
        state.schemasLoading = true;
        state.error = null;
      })
      .addCase(fetchSchemas.fulfilled, (state, { payload }) => {
        state.schemasLoading = false;
        state.schemas = payload;
      })
      .addCase(fetchSchemas.rejected, (state, { payload }) => {
        state.schemasLoading = false;
        state.error = payload;
      })
      .addCase(fetchProcedures.pending, (state) => {
        state.proceduresLoading = true;
        state.error = null;
      })
      .addCase(fetchProcedures.fulfilled, (state, { payload }) => {
        state.proceduresLoading = false;
        state.procedures[payload.schema] = payload.procedures;
      })
      .addCase(fetchProcedures.rejected, (state, { payload }) => {
        state.proceduresLoading = false;
        state.error = payload;
      })
      .addCase(fetchProcedureParameters.pending, (state) => {
        state.parametersLoading = true;
        state.error = null;
      })
      .addCase(fetchProcedureParameters.fulfilled, (state, { payload }) => {
        state.parametersLoading = false;
        state.parameters[`${payload.schema}/${payload.procedure}`] =
          payload.parameters;
      })
      .addCase(fetchProcedureParameters.rejected, (state, { payload }) => {
        state.parametersLoading = false;
        state.error = payload;
      });
  },
});

export const { clearProcedures, clearParameters } =
  oracleMetadataSlice.actions;
export default oracleMetadataSlice.reducer;
