import { createAsyncThunk } from "@reduxjs/toolkit";
const apiUrl = "https://api.github.com";

//https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-a-repository
export const getRepo = createAsyncThunk(
  "issues/getRepo",
  async (url, thunkAPI) => {
    const endpoint = `${apiUrl}/repos/${url.user}/${url.repo}`;
    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
