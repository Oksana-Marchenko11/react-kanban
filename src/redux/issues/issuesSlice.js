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

      // Знаходимо індекси задач у загальному масиві для конкретної колонки
      const basketIssues = newIssues.filter(
        (issue) => issue._basket === basket
      );
      const draggedIssue = basketIssues[dragIndex];

      // Видаляємо задачу з поточної позиції
      const draggedIssueIndex = newIssues.findIndex(
        (issue) => issue.id === draggedIssue.id
      );
      newIssues.splice(draggedIssueIndex, 1);

      // Знаходимо нову позицію для вставки
      const targetIssue = basketIssues[hoverIndex];
      const targetIssueIndex = newIssues.findIndex(
        (issue) => issue.id === targetIssue.id
      );

      // Вставляємо задачу на нову позицію
      newIssues.splice(targetIssueIndex, 0, draggedIssue);

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
