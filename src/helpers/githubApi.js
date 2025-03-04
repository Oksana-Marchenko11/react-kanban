import { createAsyncThunk } from "@reduxjs/toolkit";
import { authInstance } from "redux/auth/operations";

const apiUrl = "https://api.github.com";

//TODO: collect all needed git endpoints

export const getRepo = createAsyncThunk(
  //https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-a-repository

  async (login, repo) => {
    const endpoint = `${apiUrl}/repos/${login}/${repo}/`;
    try {
      const { data } = await authInstance.get(endpoint);
      return data;
    } catch (e) {
      return e.message;
    }
  } /*
  returned object {
  ...
  "forks_count": 9,
  "forks": 9,
  "stargazers_count": 80, // repo stars 
  "watchers_count": 80,
  "watchers": 80,
  "size": 108,
  ...
  }
  */
);
