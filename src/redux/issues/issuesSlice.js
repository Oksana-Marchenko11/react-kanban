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
  reducers: {
    updateIssueBasket: (state, action) => {
      state.issues = action.payload;
    },
    updateIssueOrder: (state, action) => {
      const { dragIndex, hoverIndex, basket } = action.payload;
      const newIssues = [...state.issues];

      const basketIssues = newIssues.filter(
        (issue) => issue._basket === basket
      );

      if (
        dragIndex === hoverIndex ||
        dragIndex >= basketIssues.length ||
        hoverIndex >= basketIssues.length
      ) {
        return;
      }

      const draggedIssue = basketIssues[dragIndex];

      const draggedIssueIndex = newIssues.findIndex(
        (issue) => issue.id === draggedIssue.id
      );
      newIssues.splice(draggedIssueIndex, 1);
      const basketIssuesAfterRemoval = newIssues.filter(
        (issue) => issue._basket === basket
      );

      const targetIssue = basketIssuesAfterRemoval[hoverIndex];
      const targetIndex = targetIssue
        ? newIssues.findIndex((issue) => issue.id === targetIssue.id)
        : newIssues.length;
      newIssues.splice(targetIndex, 0, draggedIssue);

      state.issues = newIssues;
    },
  },
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

export const { updateIssueBasket, updateIssueOrder } = issuesSlice.actions;
export default issuesSlice.reducer;
