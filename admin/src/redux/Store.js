import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "redux";
import authReducer from "./AuthSlice";

const persistConfig = {
  key: "root",
  //   storage: AsyncStorage,
  storage,
  whitelist: ["auth"], // only auth state will be persisted
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

export const persistor = persistStore(store);
