import { createAsyncThunk } from "@reduxjs/toolkit";
const apiUrl = "https://api.github.com";

export const getRepo = createAsyncThunk(
  //https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-a-repository
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

export const getIssues = createAsyncThunk(
  // https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#list-repository-issues
  "issues/getIssues",
  async (url, thunkAPI) => {
    const endpoint = `${apiUrl}/repos/${url.user}/${url.repo}/issues?state=all`;
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
