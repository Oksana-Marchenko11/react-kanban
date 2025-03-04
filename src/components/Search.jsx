import React, { useState } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  fetchIssuesStart,
  fetchIssuesSuccess,
  fetchIssuesFailure,
} from "../redux/issues/issuesSlice";
import { currentsearchQuery } from "../redux/searchQuery/searchQuerySlice";

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const searchString = e.target.value;
    function receiveUrlData(url) {
      const regex = /^https:\/\/github\.com\/([^\/]+)\/([^\/?]+)/;
      const match = url.match(regex);
      if (match) {
        return {
          user: match[1], // Логін користувача
          repo: match[2], // Репозиторій
        };
      } else {
        console.log("Invalid GitHub URL");
        return null;
      }
    }
    const searchUrl = receiveUrlData(searchString);
    function createApiUrl(user, repo) {
      return `https://api.github.com/repos/${user}/${repo}/issues?state=all`;
    }
    setSearchQuery(createApiUrl(searchUrl.user, searchUrl.repo));
  };
  console.log(searchQuery);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = process.env.GITHUB_TOKEN;
    dispatch(fetchIssuesStart());
    try {
      const response = await fetch(searchQuery, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      dispatch(fetchIssuesSuccess(data));
      dispatch(currentsearchQuery(searchQuery));
    } catch (error) {
      dispatch(fetchIssuesFailure(error.message));
      console.error("Failed to fetch current project IDs:", error);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} sm={9} md={9}>
            <Form.Control
              type="search"
              placeholder="Enter Repo URL"
              onChange={handleChange}
            />
          </Col>
          <Col xs={12} sm={3} md={3}>
            <Button type="submit" variant="outline-success">
              Load issues
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Search;
