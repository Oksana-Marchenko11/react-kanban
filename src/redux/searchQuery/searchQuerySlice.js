import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: " ",
};

const searchQuerySlice = createSlice({
  name: "searchQuery",
  initialState,
  reducers: {
    currentsearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { currentsearchQuery } = searchQuerySlice.actions;
export default searchQuerySlice.reducer;
