import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import farmersReducer from './slices/farmersSlice';
import contractsReducer from './slices/contractsSlice';
import alertsReducer from './slices/alertsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    farmers: farmersReducer,
    contracts: contractsReducer,
    alerts: alertsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['your/non-serializable/action'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
});

export default store;