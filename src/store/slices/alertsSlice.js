import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as alertsApi from '../../api/alerts.api';

// Async thunks
export const fetchFarmersNeedingSupport = createAsyncThunk(
  'alerts/fetchFarmersNeedingSupport',
  async (_, { rejectWithValue }) => {
    try {
      const response = await alertsApi.getAllFarmersNeedingSupport();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch farmers needing support' });
    }
  }
);

export const fetchFarmersNeedingSupportByRegion = createAsyncThunk(
  'alerts/fetchFarmersNeedingSupportByRegion',
  async (regionId, { rejectWithValue }) => {
    try {
      const response = await alertsApi.getFarmersNeedingSupportByRegion(regionId);
      return { regionId, farmers: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch farmers needing support by region' });
    }
  }
);

export const fetchFarmersWithRepaymentIssues = createAsyncThunk(
  'alerts/fetchFarmersWithRepaymentIssues',
  async (_, { rejectWithValue }) => {
    try {
      const response = await alertsApi.getFarmersWithRepaymentIssues();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch farmers with repayment issues' });
    }
  }
);

export const fetchAtRiskContracts = createAsyncThunk(
  'alerts/fetchAtRiskContracts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await alertsApi.getAtRiskContracts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch at-risk contracts' });
    }
  }
);

export const fetchAlertSummary = createAsyncThunk(
  'alerts/fetchAlertSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await alertsApi.getAlertSummary();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch alert summary' });
    }
  }
);

export const runSupportAssessment = createAsyncThunk(
  'alerts/runSupportAssessment',
  async (_, { rejectWithValue }) => {
    try {
      const response = await alertsApi.runSupportAssessment();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to run support assessment' });
    }
  }
);

export const markFarmerForSupport = createAsyncThunk(
  'alerts/markFarmerForSupport',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await alertsApi.markFarmerForSupport(id, reason);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to mark farmer for support' });
    }
  }
);

export const resolveFarmerSupport = createAsyncThunk(
  'alerts/resolveFarmerSupport',
  async ({ id, resolutionNotes }, { rejectWithValue }) => {
    try {
      const response = await alertsApi.resolveFarmerSupport(id, resolutionNotes);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to resolve farmer support' });
    }
  }
);

// Slice
const initialState = {
  farmersNeedingSupport: [],
  farmersNeedingSupportByRegion: {},
  farmersWithRepaymentIssues: [],
  atRiskContracts: [],
  alertSummary: null,
  loading: false,
  error: null,
  assessmentInProgress: false,
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch farmers needing support
      .addCase(fetchFarmersNeedingSupport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmersNeedingSupport.fulfilled, (state, action) => {
        state.loading = false;
        state.farmersNeedingSupport = action.payload;
      })
      .addCase(fetchFarmersNeedingSupport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch farmers needing support by region
      .addCase(fetchFarmersNeedingSupportByRegion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmersNeedingSupportByRegion.fulfilled, (state, action) => {
        state.loading = false;
        state.farmersNeedingSupportByRegion[action.payload.regionId] = action.payload.farmers;
      })
      .addCase(fetchFarmersNeedingSupportByRegion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch farmers with repayment issues
      .addCase(fetchFarmersWithRepaymentIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmersWithRepaymentIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.farmersWithRepaymentIssues = action.payload;
      })
      .addCase(fetchFarmersWithRepaymentIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch at-risk contracts
      .addCase(fetchAtRiskContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAtRiskContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.atRiskContracts = action.payload;
      })
      .addCase(fetchAtRiskContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch alert summary
      .addCase(fetchAlertSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlertSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.alertSummary = action.payload;
      })
      .addCase(fetchAlertSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Run support assessment
      .addCase(runSupportAssessment.pending, (state) => {
        state.assessmentInProgress = true;
        state.error = null;
      })
      .addCase(runSupportAssessment.fulfilled, (state, action) => {
        state.assessmentInProgress = false;
        state.alertSummary = action.payload.summary;
        // We'll need to refresh the lists after an assessment
      })
      .addCase(runSupportAssessment.rejected, (state, action) => {
        state.assessmentInProgress = false;
        state.error = action.payload;
      })
      
      // Mark farmer for support
      .addCase(markFarmerForSupport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markFarmerForSupport.fulfilled, (state, action) => {
        state.loading = false;
        // Add to farmers needing support if not already there
        const existingIndex = state.farmersNeedingSupport.findIndex(f => f.id === action.payload.id);
        if (existingIndex === -1) {
          state.farmersNeedingSupport.push(action.payload);
        } else {
          state.farmersNeedingSupport[existingIndex] = action.payload;
        }
        
        // Update in farmersNeedingSupportByRegion if applicable
        const regionId = action.payload.region.id;
        if (state.farmersNeedingSupportByRegion[regionId]) {
          const regionIndex = state.farmersNeedingSupportByRegion[regionId].findIndex(
            f => f.id === action.payload.id
          );
          if (regionIndex === -1) {
            state.farmersNeedingSupportByRegion[regionId].push(action.payload);
          } else {
            state.farmersNeedingSupportByRegion[regionId][regionIndex] = action.payload;
          }
        }
      })
      .addCase(markFarmerForSupport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Resolve farmer support
      .addCase(resolveFarmerSupport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resolveFarmerSupport.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from farmers needing support
        state.farmersNeedingSupport = state.farmersNeedingSupport.filter(
          f => f.id !== action.payload.id
        );
        
        // Remove from farmersNeedingSupportByRegion
        const regionId = action.payload.region.id;
        if (state.farmersNeedingSupportByRegion[regionId]) {
          state.farmersNeedingSupportByRegion[regionId] = state.farmersNeedingSupportByRegion[regionId].filter(
            f => f.id !== action.payload.id
          );
        }
      })
      .addCase(resolveFarmerSupport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = alertsSlice.actions;

export default alertsSlice.reducer;