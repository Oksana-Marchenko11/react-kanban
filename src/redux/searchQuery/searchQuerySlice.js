import { createSlice } from "@reduxjs/toolkit";
import { getRepo } from "../../helpers/githubApi";

const initialState = {
  searchQuery: {},
  isLoading: false,
  error: null,
};

const searchQuerySlice = createSlice({
  name: "searchQuery",
  initialState,
  // reducers: {
  //   getRepository: (state, action) => {
  //     state.searchQuery = action.payload;
  //   },
  // },
  extraReducers: (builder) => {
    builder
      .addCase(getRepo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRepo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchQuery = action.payload;
      })
      .addCase(getRepo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// export const { getRepository } = searchQuerySlice.actions;
export default searchQuerySlice.reducer;
