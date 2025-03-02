import { configureStore } from "@reduxjs/toolkit";
import issuesReducer from "./issues/issuesSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const issuesConfig = {
  key: "issues",
  storage,
};

export const persistedIssuesReducer = persistReducer(
  issuesConfig,
  issuesReducer
);

export const store = configureStore({
  reducer: {
    issues: persistedIssuesReducer,
  },
});

export const persistor = persistStore(store);
