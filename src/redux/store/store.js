import { configureStore } from '@reduxjs/toolkit';
import downloadReducer from '../slice/downloadSlice';
import userReducer from '../slice/userSlice';

export const store = configureStore({
  reducer: {
    downloads: downloadReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['downloads/startDownload', 'downloads/completeDownload'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['downloads.downloads'],
      },
    }),
});

export default store; 