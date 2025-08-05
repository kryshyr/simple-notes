import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import authSlice from './authSlice';
import notesSlice from './notesSlice';

const persistConfig = {
    key: 'root', // key for the persisted state
    storage: AsyncStorage, // storage engine to use
};

// combine reducers
const rootReducer = combineReducers({
    auth: authSlice,
    notes: notesSlice,
});

// to enable persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// creating the Redux store with the persisted reducer
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            //to ignore certain actions for serializability checks
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

// create the persistor to manage the persisted state
export const persistor = persistStore(store);

// type for the root state of the Redux store
export type RootState = ReturnType<typeof rootReducer>;
// type for the dispatch function of the store
export type AppDispatch = typeof store.dispatch;
