import { configureStore } from "@reduxjs/toolkit";
import issuesReducer from "./issues/issuesSlice";

export const store = configureStore({
  reducer: {
    issues: issuesReducer,
  },
});

export default store;
