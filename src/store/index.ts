import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './api/authApi';
import { loanApi } from './api/loanApi';
import { adminApi } from './api/adminApi';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    // RTK Query APIs
    [authApi.reducerPath]: authApi.reducer,
    [loanApi.reducerPath]: loanApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    
    // Regular slices
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore these action types
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    })
      .concat(authApi.middleware)
      .concat(loanApi.middleware)
      .concat(adminApi.middleware),
});

// Enable listener behavior for the store
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export hooks
export { useAppDispatch, useAppSelector } from './hooks';