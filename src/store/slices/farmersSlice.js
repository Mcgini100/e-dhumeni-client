import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as farmersApi from '../../api/farmers.api';

// Async thunks
export const fetchFarmers = createAsyncThunk(
  'farmers/fetchFarmers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await farmersApi.getFarmers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch farmers' });
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
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch farmer details' });
    }
  }
);

export const fetchFarmersByRegion = createAsyncThunk(
  'farmers/fetchFarmersByRegion',
  async (regionId, { rejectWithValue }) => {
    try {
      const response = await farmersApi.getFarmersByRegion(regionId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch farmers by region' });
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
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch farmers needing support' });
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
      return rejectWithValue(error.response?.data || { message: 'Failed to create farmer' });
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
      return rejectWithValue(error.response?.data || { message: 'Failed to update farmer' });
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
      return rejectWithValue(error.response?.data || { message: 'Failed to update farmer support status' });
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
      return rejectWithValue(error.response?.data || { message: 'Failed to delete farmer' });
    }
  }
);

// Slice
const initialState = {
  farmers: [],
  currentFarmer: null,
  farmersByRegion: {},
  farmersNeedingSupport: [],
  loading: false,
  error: null,
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
        state.farmersByRegion[action.meta.arg] = action.payload;
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
        const index = state.farmers.findIndex(farmer => farmer.id === action.payload.id);
        if (index !== -1) {
          state.farmers[index] = action.payload;
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
        if (state.currentFarmer && state.currentFarmer.id === action.payload.id) {
          state.currentFarmer = action.payload;
        }
        const index = state.farmers.findIndex(farmer => farmer.id === action.payload.id);
        if (index !== -1) {
          state.farmers[index] = action.payload;
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
        state.farmers = state.farmers.filter(farmer => farmer.id !== action.payload);
        if (state.currentFarmer && state.currentFarmer.id === action.payload) {
          state.currentFarmer = null;
        }
      })
      .addCase(deleteFarmer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentFarmer } = farmersSlice.actions;

export default farmersSlice.reducer;