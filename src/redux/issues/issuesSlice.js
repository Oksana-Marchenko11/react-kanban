import { createSlice } from "@reduxjs/toolkit";
import { getIssues } from "../../helpers/githubApi";

const initialState = {
  issues: [],
  loading: false,
  error: null,
};

const issuesSlice = createSlice({
  name: "issues",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(getIssues.pending, (state) => {
        state.loading = true;
      })
      .addCase(getIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = action.payload;
      })
      .addCase(getIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default issuesSlice.reducer;
