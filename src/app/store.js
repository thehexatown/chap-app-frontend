import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../src/features/authSlice";
import socketReducer from "../../src/features/socketSlice";
import { combineReducers } from "redux";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
const persistedUserReducer = persistReducer(persistConfig, authReducer);
const persistedSocketReducer = persistReducer(persistConfig, socketReducer);

export default configureStore({
  reducer: { auth: persistedUserReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
