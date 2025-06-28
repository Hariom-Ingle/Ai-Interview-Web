// src/store.js (Example)
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import authReducer from '../features/auth/authSlice'; // Your auth slice
import interviewReducer from '../features/interview/interviewSlice';
import themeReducer from '../features/theme/themeSlice';

const rootReducer = combineReducers({
  auth: authReducer,
   interview: interviewReducer, 
   theme:themeReducer
  // ... other reducers if you have any
});

const persistConfig = {
  key: 'root', // This is the key for your whole persisted store in localStorage
  version: 1,
  storage,
  whitelist: ['auth','theme'], // ONLY persist the 'auth' slice
  // blacklist: ['loading', 'error', 'successMessage'], // Optional: If you explicitly don't want these transient states to persist, but often it's fine.
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// In your main index.js or App.js:
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { store, persistor } from './store';

// <Provider store={store}>
//   <PersistGate loading={null} persistor={persistor}>
//     <App />
//   </PersistGate>
// </Provider>