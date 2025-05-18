import { createSlice } from "@reduxjs/toolkit";
import { getIssues } from "../../helpers/githubApi";

const initialState = {
  columns: {},
  count: 0,
  issues: {},
  loading: false,
  error: null,
};

const issuesSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    updateColumns: (state, action) => {
      if (action.payload.columns) {
        state.columns = action.payload.columns;
      }
      if (action.payload.issues) {
        state.issues = action.payload.issues;
      }
    },
    // updateIssuesSlice: (state, action) => {
    //   state.issues = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIssues.pending, (state) => {
        state.loading = true;
      })
      .addCase(getIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = action.payload.issues;
        state.columns = action.payload.columns;
      })
      .addCase(getIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateColumns, updateIssuesSlice } = issuesSlice.actions;
export default issuesSlice.reducer;
