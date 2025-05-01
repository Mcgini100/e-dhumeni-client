import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as farmersApi from '../../api/farmers.api';
import { handleApiError } from '../../utils/errorHandlers';

// Async thunks
export const fetchFarmers = createAsyncThunk(
  'farmers/fetchFarmers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await farmersApi.getFarmers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'Farmers API', 'Failed to fetch farmers'));
    }
  }
);

export const fetchFarmerById = createAsyncThunk(
  'farmers/fetchFarmerById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await farmersApi.getFarmerById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'Farmers API', 'Failed to fetch farmer details'));
    }
  }
);

export const fetchFarmersByRegion = createAsyncThunk(
  'farmers/fetchFarmersByRegion',
  async (regionId, { rejectWithValue }) => {
    try {
      const response = await farmersApi.getFarmersByRegion(regionId);
      return { regionId, farmers: response.data };
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'Farmers API', 'Failed to fetch farmers by region'));
    }
  }
);

export const fetchFarmersNeedingSupport = createAsyncThunk(
  'farmers/fetchFarmersNeedingSupport',
  async (_, { rejectWithValue }) => {
    try {
      const response = await farmersApi.getFarmersNeedingSupport();
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'Farmers API', 'Failed to fetch farmers needing support'));
    }
  }
);

export const createFarmer = createAsyncThunk(
  'farmers/createFarmer',
  async (farmerData, { rejectWithValue }) => {
    try {
      const response = await farmersApi.createFarmer(farmerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'Farmers API', 'Failed to create farmer'));
    }
  }
);

export const updateFarmer = createAsyncThunk(
  'farmers/updateFarmer',
  async ({ id, farmerData }, { rejectWithValue }) => {
    try {
      const response = await farmersApi.updateFarmer(id, farmerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'Farmers API', 'Failed to update farmer'));
    }
  }
);

export const updateFarmerSupportStatus = createAsyncThunk(
  'farmers/updateFarmerSupportStatus',
  async ({ id, needsSupport, reason }, { rejectWithValue }) => {
    try {
      const response = await farmersApi.updateFarmerSupportStatus(id, needsSupport, reason);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'Farmers API', 'Failed to update farmer support status'));
    }
  }
);

export const deleteFarmer = createAsyncThunk(
  'farmers/deleteFarmer',
  async (id, { rejectWithValue }) => {
    try {
      await farmersApi.deleteFarmer(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'Farmers API', 'Failed to delete farmer'));
    }
  }
);

export const calculateFarmerRiskScore = createAsyncThunk(
  'farmers/calculateFarmerRiskScore',
  async (id, { rejectWithValue }) => {
    try {
      const response = await farmersApi.calculateFarmerRiskScore(id);
      return { id, riskScore: response.data };
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'Farmers API', 'Failed to calculate farmer risk score'));
    }
  }
);

// Slice
const initialState = {
  farmers: [],
  currentFarmer: null,
  farmersByRegion: {},
  farmersNeedingSupport: [],
  riskScores: {},
  loading: false,
  error: null,
  filters: {
    searchTerm: '',
    region: '',
    province: '',
    supportStatus: ''
  },
  pagination: {
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  }
};

const farmersSlice = createSlice({
  name: 'farmers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentFarmer: (state) => {
      state.currentFarmer = null;
    },
    setFilter: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all farmers
      .addCase(fetchFarmers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmers.fulfilled, (state, action) => {
        state.loading = false;
        state.farmers = action.payload;
        // Update pagination if the API returns metadata
        if (action.payload.meta) {
          state.pagination = {
            page: action.payload.meta.currentPage,
            pageSize: action.payload.meta.pageSize,
            totalItems: action.payload.meta.totalItems,
            totalPages: action.payload.meta.totalPages
          };
        }
      })
      .addCase(fetchFarmers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch farmer by ID
      .addCase(fetchFarmerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFarmer = action.payload;
      })
      .addCase(fetchFarmerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch farmers by region
      .addCase(fetchFarmersByRegion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmersByRegion.fulfilled, (state, action) => {
        state.loading = false;
        state.farmersByRegion[action.payload.regionId] = action.payload.farmers;
      })
      .addCase(fetchFarmersByRegion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
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
      
      // Create farmer
      .addCase(createFarmer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFarmer.fulfilled, (state, action) => {
        state.loading = false;
        state.farmers.push(action.payload);
        state.currentFarmer = action.payload;
      })
      .addCase(createFarmer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update farmer
      .addCase(updateFarmer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFarmer.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFarmer = action.payload;
        
        // Update in farmers list
        const index = state.farmers.findIndex(farmer => farmer.id === action.payload.id);
        if (index !== -1) {
          state.farmers[index] = action.payload;
        }
        
        // Update in farmersByRegion if exists
        const regionId = action.payload.region.id;
        if (state.farmersByRegion[regionId]) {
          const regionIndex = state.farmersByRegion[regionId].findIndex(
            farmer => farmer.id === action.payload.id
          );
          if (regionIndex !== -1) {
            state.farmersByRegion[regionId][regionIndex] = action.payload;
          }
        }
        
        // Update in farmersNeedingSupport if necessary
        if (action.payload.needsSupport) {
          const supportIndex = state.farmersNeedingSupport.findIndex(
            farmer => farmer.id === action.payload.id
          );
          if (supportIndex === -1) {
            state.farmersNeedingSupport.push(action.payload);
          } else {
            state.farmersNeedingSupport[supportIndex] = action.payload;
          }
        } else {
          state.farmersNeedingSupport = state.farmersNeedingSupport.filter(
            farmer => farmer.id !== action.payload.id
          );
        }
      })
      .addCase(updateFarmer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update farmer support status
      .addCase(updateFarmerSupportStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFarmerSupportStatus.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update current farmer if it's the same
        if (state.currentFarmer && state.currentFarmer.id === action.payload.id) {
          state.currentFarmer = action.payload;
        }
        
        // Update in farmers list
        const index = state.farmers.findIndex(farmer => farmer.id === action.payload.id);
        if (index !== -1) {
          state.farmers[index] = action.payload;
        }
        
        // Update farmersNeedingSupport collection
        if (action.payload.needsSupport) {
          // Add to farmers needing support if not already there
          const existsInSupport = state.farmersNeedingSupport.some(
            farmer => farmer.id === action.payload.id
          );
          if (!existsInSupport) {
            state.farmersNeedingSupport.push(action.payload);
          } else {
            // Update existing entry
            const supportIndex = state.farmersNeedingSupport.findIndex(
              farmer => farmer.id === action.payload.id
            );
            state.farmersNeedingSupport[supportIndex] = action.payload;
          }
        } else {
          // Remove from farmers needing support
          state.farmersNeedingSupport = state.farmersNeedingSupport.filter(
            farmer => farmer.id !== action.payload.id
          );
        }
        
        // Update in farmersByRegion if exists
        const regionId = action.payload.region.id;
        if (state.farmersByRegion[regionId]) {
          const regionIndex = state.farmersByRegion[regionId].findIndex(
            farmer => farmer.id === action.payload.id
          );
          if (regionIndex !== -1) {
            state.farmersByRegion[regionId][regionIndex] = action.payload;
          }
        }
      })
      .addCase(updateFarmerSupportStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete farmer
      .addCase(deleteFarmer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFarmer.fulfilled, (state, action) => {
        state.loading = false;
        
        // Remove from farmers list
        state.farmers = state.farmers.filter(farmer => farmer.id !== action.payload);
        
        // Clear current farmer if it's the same
        if (state.currentFarmer && state.currentFarmer.id === action.payload) {
          state.currentFarmer = null;
        }
        
        // Remove from farmersNeedingSupport
        state.farmersNeedingSupport = state.farmersNeedingSupport.filter(
          farmer => farmer.id !== action.payload
        );
        
        // Remove from farmersByRegion collections
        Object.keys(state.farmersByRegion).forEach(regionId => {
          state.farmersByRegion[regionId] = state.farmersByRegion[regionId].filter(
            farmer => farmer.id !== action.payload
          );
        });
      })
      .addCase(deleteFarmer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Calculate farmer risk score
      .addCase(calculateFarmerRiskScore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateFarmerRiskScore.fulfilled, (state, action) => {
        state.loading = false;
        state.riskScores[action.payload.id] = action.payload.riskScore;
      })
      .addCase(calculateFarmerRiskScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearCurrentFarmer } = farmersSlice.actions;

export default farmersSlice.reducer;