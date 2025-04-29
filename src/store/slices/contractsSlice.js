import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as contractsApi from '../../api/contracts.api';

// Async thunks
export const fetchContracts = createAsyncThunk(
  'contracts/fetchContracts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await contractsApi.getContracts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch contracts' });
    }
  }
);

export const fetchContractById = createAsyncThunk(
  'contracts/fetchContractById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await contractsApi.getContractById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch contract details' });
    }
  }
);

export const fetchContractsByFarmer = createAsyncThunk(
  'contracts/fetchContractsByFarmer',
  async (farmerId, { rejectWithValue }) => {
    try {
      const response = await contractsApi.getContractsByFarmer(farmerId);
      return { farmerId, contracts: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch farmer contracts' });
    }
  }
);

export const fetchActiveContractsByFarmer = createAsyncThunk(
  'contracts/fetchActiveContractsByFarmer',
  async (farmerId, { rejectWithValue }) => {
    try {
      const response = await contractsApi.getActiveContractsByFarmer(farmerId);
      return { farmerId, contracts: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch active farmer contracts' });
    }
  }
);

export const fetchAtRiskContracts = createAsyncThunk(
  'contracts/fetchAtRiskContracts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await contractsApi.getAtRiskContracts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch at-risk contracts' });
    }
  }
);

export const createContract = createAsyncThunk(
  'contracts/createContract',
  async (contractData, { rejectWithValue }) => {
    try {
      const response = await contractsApi.createContract(contractData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create contract' });
    }
  }
);

export const updateContract = createAsyncThunk(
  'contracts/updateContract',
  async ({ id, contractData }, { rejectWithValue }) => {
    try {
      const response = await contractsApi.updateContract(id, contractData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update contract' });
    }
  }
);

export const deactivateContract = createAsyncThunk(
  'contracts/deactivateContract',
  async (id, { rejectWithValue }) => {
    try {
      const response = await contractsApi.deactivateContract(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to deactivate contract' });
    }
  }
);

export const deleteContract = createAsyncThunk(
  'contracts/deleteContract',
  async (id, { rejectWithValue }) => {
    try {
      await contractsApi.deleteContract(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete contract' });
    }
  }
);

// Slice
const initialState = {
  contracts: [],
  currentContract: null,
  contractsByFarmer: {},
  activeContractsByFarmer: {},
  atRiskContracts: [],
  loading: false,
  error: null,
};

const contractsSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentContract: (state) => {
      state.currentContract = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all contracts
      .addCase(fetchContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = action.payload;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch contract by ID
      .addCase(fetchContractById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContract = action.payload;
      })
      .addCase(fetchContractById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch contracts by farmer
      .addCase(fetchContractsByFarmer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractsByFarmer.fulfilled, (state, action) => {
        state.loading = false;
        state.contractsByFarmer[action.payload.farmerId] = action.payload.contracts;
      })
      .addCase(fetchContractsByFarmer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch active contracts by farmer
      .addCase(fetchActiveContractsByFarmer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveContractsByFarmer.fulfilled, (state, action) => {
        state.loading = false;
        state.activeContractsByFarmer[action.payload.farmerId] = action.payload.contracts;
      })
      .addCase(fetchActiveContractsByFarmer.rejected, (state, action) => {
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
      
      // Create contract
      .addCase(createContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts.push(action.payload);
        // Update the contracts by farmer list if applicable
        const farmerId = action.payload.farmer.id;
        if (state.contractsByFarmer[farmerId]) {
          state.contractsByFarmer[farmerId].push(action.payload);
        }
        if (action.payload.active && state.activeContractsByFarmer[farmerId]) {
          state.activeContractsByFarmer[farmerId].push(action.payload);
        }
      })
      .addCase(createContract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update contract
      .addCase(updateContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContract.fulfilled, (state, action) => {
        state.loading = false;
        // Update in main contracts list
        const index = state.contracts.findIndex(contract => contract.id === action.payload.id);
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
        // Update currentContract if it's the same
        if (state.currentContract && state.currentContract.id === action.payload.id) {
          state.currentContract = action.payload;
        }
        // Update in contractsByFarmer
        const farmerId = action.payload.farmer.id;
        if (state.contractsByFarmer[farmerId]) {
          const farmerContractIndex = state.contractsByFarmer[farmerId].findIndex(
            contract => contract.id === action.payload.id
          );
          if (farmerContractIndex !== -1) {
            state.contractsByFarmer[farmerId][farmerContractIndex] = action.payload;
          }
        }
        // Update in activeContractsByFarmer
        if (state.activeContractsByFarmer[farmerId]) {
          if (action.payload.active) {
            const activeContractIndex = state.activeContractsByFarmer[farmerId].findIndex(
              contract => contract.id === action.payload.id
            );
            if (activeContractIndex !== -1) {
              state.activeContractsByFarmer[farmerId][activeContractIndex] = action.payload;
            } else {
              state.activeContractsByFarmer[farmerId].push(action.payload);
            }
          } else {
            // Remove from active contracts if it's no longer active
            state.activeContractsByFarmer[farmerId] = state.activeContractsByFarmer[farmerId].filter(
              contract => contract.id !== action.payload.id
            );
          }
        }
      })
      .addCase(updateContract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Deactivate contract
      .addCase(deactivateContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateContract.fulfilled, (state, action) => {
        state.loading = false;
        // Update in main contracts list
        const index = state.contracts.findIndex(contract => contract.id === action.payload.id);
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
        // Update currentContract if it's the same
        if (state.currentContract && state.currentContract.id === action.payload.id) {
          state.currentContract = action.payload;
        }
        // Update in activeContractsByFarmer - remove it since it's now inactive
        const farmerId = action.payload.farmer.id;
        if (state.activeContractsByFarmer[farmerId]) {
          state.activeContractsByFarmer[farmerId] = state.activeContractsByFarmer[farmerId].filter(
            contract => contract.id !== action.payload.id
          );
        }
      })
      .addCase(deactivateContract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete contract
      .addCase(deleteContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContract.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from main contracts list
        state.contracts = state.contracts.filter(contract => contract.id !== action.payload);
        
        // If the deleted contract was the current contract, clear it
        if (state.currentContract && state.currentContract.id === action.payload) {
          state.currentContract = null;
        }
        
        // Remove from all farmersByContract lists
        Object.keys(state.contractsByFarmer).forEach(farmerId => {
          state.contractsByFarmer[farmerId] = state.contractsByFarmer[farmerId].filter(
            contract => contract.id !== action.payload
          );
              });
        
              // Remove from all activeContractsByFarmer lists
              Object.keys(state.activeContractsByFarmer).forEach(farmerId => {
                state.activeContractsByFarmer[farmerId] = state.activeContractsByFarmer[farmerId].filter(
                  contract => contract.id !== action.payload
                );
              });
            })
            .addCase(deleteContract.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
            });
        },
      });
      
      export default contractsSlice.reducer;