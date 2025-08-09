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

      const issuesData = {
        issues: {},
        count: 0,
        columns: {
          toDoIssues: [],
          inProgressIssues: [],
          doneIssues: [],
        },
      };

      const position = {
        toDoIssues: 0,
        inProgressIssues: 0,
        doneIssues: 0,
      };

      data.forEach((issue) => {
        issuesData.issues[issue.id] = { ...issue };
        if (issue.state === "closed") {
          position.doneIssues++;
          issuesData.issues[issue.id]["_column"] = "doneIssues";
          issuesData.issues[issue.id]["_position"] = position.doneIssues - 1;

          issuesData.columns.doneIssues.push(issue.id);
        } else if (issue.assignees.length) {
          position.inProgressIssues++;
          issuesData.issues[issue.id]["_column"] = "inProgressIssues";
          issuesData.issues[issue.id]["_position"] = position.inProgressIssues - 1;

          issuesData.columns.inProgressIssues.push(issue.id);
        } else {
          position.toDoIssues++;
          issuesData.issues[issue.id]["_column"] = "toDoIssues";
          issuesData.issues[issue.id]["_position"] = position.toDoIssues - 1;

          issuesData.columns.toDoIssues.push(issue.id);
        }
        issuesData.count++;
        // console.log(issuesData);
      });

      // if (issuesData.issues.length) {
      issuesData.issues["placeholder"] = {
        id: "placeholder",
        title: "Drop here",
        _column: "",
        _position: 0,
      };
      // }

      console.log(issuesData);

      return issuesData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
