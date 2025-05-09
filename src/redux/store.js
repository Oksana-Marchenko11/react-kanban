import { configureStore } from "@reduxjs/toolkit";
import issuesReducer from "./issues/issuesSlice";
import searchQueryReducer from "./searchQuery/searchQuerySlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import logger from "redux-logger";

const issuesConfig = {
  key: "issues",
  storage,
};

const searchQueryConfig = {
  key: "searchQuery",
  storage,
};
export const persistedIssuesReducer = persistReducer(
  issuesConfig,
  issuesReducer
);

export const persistedSearchQueryReducer = persistReducer(
  searchQueryConfig,
  searchQueryReducer
);

export const store = configureStore({
  reducer: {
    issues: persistedIssuesReducer,
    searchQuery: persistedSearchQueryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
});

export const persistor = persistStore(store);
