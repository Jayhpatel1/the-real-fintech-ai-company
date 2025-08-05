import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import propertySlice from './slices/propertySlice';
import bookingSlice from './slices/bookingSlice';
import chatSlice from './slices/chatSlice';
import notificationSlice from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    properties: propertySlice,
    bookings: bookingSlice,
    chat: chatSlice,
    notifications: notificationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;