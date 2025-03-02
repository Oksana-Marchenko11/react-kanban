import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  issues: [],
  loading: false,
  error: null,
};

const issuesSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    fetchIssuesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchIssuesSuccess: (state, action) => {
      state.loading = false;
      state.issues = action.payload;
    },
    fetchIssuesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchIssuesStart, fetchIssuesSuccess, fetchIssuesFailure } =
  issuesSlice.actions;
export default issuesSlice.reducer;
