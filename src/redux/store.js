import { configureStore } from '@reduxjs/toolkit';
import { userDataApi } from '../services/dataService';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    [userDataApi.reducerPath]: userDataApi.reducer,
  },
  // middleware for caching and network requests
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userDataApi.middleware),
});

setupListeners(store.dispatch);
