import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://192.168.35.24:8080/v1/dbs/api';

const axiosConfig = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export const getLogActivities = createAsyncThunk(
  'log/getLogActivities', 
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/log/view-activity`, axiosConfig);
      console.log('GetLogActivities Response:', response.data);
      
      if (response.data && response.data.status && Array.isArray(response.data.payload)) {
        return response.data.payload;
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (error) {
      console.error('GetLogActivities Error:', error);
      return rejectWithValue(error.response?.data?.messages?.[0] || error.message);
    }
  }
);

// Get log activity details by ID
export const getLogActivityDetails = createAsyncThunk(
  'log/getLogActivityDetails', 
  async (activityId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/log/view-activity-detail/${activityId}`, axiosConfig);
      console.log('GetLogActivityDetails Response:', response.data);
      
      if (response.data && response.data.status && Array.isArray(response.data.payload)) {
        return {
          activityId,
          details: response.data.payload
        };
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (error) {
      console.error('GetLogActivityDetails Error:', error);
      return rejectWithValue(error.response?.data?.messages?.[0] || error.message);
    }
  }
);

const prabillingLog = createSlice({
  name: 'log',
  initialState: {
    activities: [],
    activityDetails: {},
    loading: false,
    detailsLoading: {},
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearActivityDetails: (state) => {
      state.activityDetails = {};
      state.detailsLoading = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLogActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLogActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.activities = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getLogActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch log activities';
        state.activities = [];
      });
      
    // Get Log Activity Details
    builder
      .addCase(getLogActivityDetails.pending, (state, action) => {
        const activityId = action.meta.arg;
        state.detailsLoading[activityId] = true;
        state.error = null;
      })
      .addCase(getLogActivityDetails.fulfilled, (state, action) => {
        const { activityId, details } = action.payload;
        state.detailsLoading[activityId] = false;
        state.error = null;
        state.activityDetails[activityId] = details;
        console.log(`Activity details for ${activityId} updated:`, details);
      })
      .addCase(getLogActivityDetails.rejected, (state, action) => {
        const activityId = action.meta.arg;
        state.detailsLoading[activityId] = false;
        state.error = action.payload || 'Failed to fetch activity details';
      });
  },
});

export const { clearError, clearActivityDetails } = prabillingLog.actions;
export default prabillingLog.reducer;