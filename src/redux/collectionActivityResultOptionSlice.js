import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CollectionActivityResultOptionService from '../services/collectionActivityResultOptionService';

const initialState = {
  data: [],
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 0,
  },
  loading: false,
  error: null,
  selected: null, // To hold the single record for the form
};

// Async Thunks
export const fetchResultOptions = createAsyncThunk(
  'collectionActivityResultOption/fetchResultOptions',
  async (pagingRequest, { rejectWithValue }) => {
    try {
      const response = await CollectionActivityResultOptionService.getList(pagingRequest);
      const result = response.data;
      return {
        content: result.result,
        totalElements: result.page.totalElements,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch data');
    }
  }
);

// NEW THUNK: Fetch a single record by ID
export const fetchResultOptionById = createAsyncThunk(
  'collectionActivityResultOption/fetchResultOptionById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await CollectionActivityResultOptionService.getById(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch item');
    }
  }
);

export const createResultOption = createAsyncThunk(
  'collectionActivityResultOption/createResultOption',
  async (data, { rejectWithValue }) => {
    try {
      const response = await CollectionActivityResultOptionService.create(data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create item');
    }
  }
);

export const updateResultOption = createAsyncThunk(
  'collectionActivityResultOption/updateResultOption',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await CollectionActivityResultOptionService.update(id, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update item');
    }
  }
);

export const deleteResultOption = createAsyncThunk(
  'collectionActivityResultOption/deleteResultOption',
  async (id, { rejectWithValue }) => {
    try {
      await CollectionActivityResultOptionService.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete item');
    }
  }
);

const collectionActivityResultOptionSlice = createSlice({
  name: 'collectionActivityResultOption',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchResultOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResultOptions.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.data = action.payload.content;
          state.pagination.total = action.payload.totalElements;
        }
      })
      .addCase(fetchResultOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch By ID
      .addCase(fetchResultOptionById.pending, (state) => {
        state.loading = true;
        state.selected = null;
        state.error = null;
      })
      .addCase(fetchResultOptionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload.data;
      })
      .addCase(fetchResultOptionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create, Update, Delete
      .addMatcher(
        (action) => [createResultOption.pending, updateResultOption.pending, deleteResultOption.pending].includes(action.type),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => [createResultOption.fulfilled, updateResultOption.fulfilled, deleteResultOption.fulfilled].includes(action.type),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => [createResultOption.rejected, updateResultOption.rejected, deleteResultOption.rejected].includes(action.type),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default collectionActivityResultOptionSlice.reducer;
