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
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchContacts.pending, (state) => {
  //       state.contacts.isLoading = true;
  //     })
  //     .addCase(fetchContacts.fulfilled, (state, action) => {
  //       state.contacts.isLoading = false;
  //       state.contacts.items = action.payload;
  //     })
  //     .addCase(fetchContacts.rejected, (state, action) => {
  //       state.contacts.isLoading = false;
  //       state.contacts.error = action.payload;
  //     });
  // },
});

export const { fetchIssuesStart, fetchIssuesSuccess, fetchIssuesFailure } =
  issuesSlice.actions;
export default issuesSlice.reducer;
