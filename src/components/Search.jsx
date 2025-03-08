import React, { useState } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  fetchIssuesStart,
  fetchIssuesSuccess,
  fetchIssuesFailure,
} from "../redux/issues/issuesSlice";
import { getRepo } from "../helpers/githubApi";

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState({});
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const searchString = e.target.value;

    function receiveUrlData(url) {
      const regex = /^https:\/\/github\.com\/([^\/]+)\/([^\/?]+)/;
      const match = url.match(regex);
      if (match) {
        return {
          user: match[1],
          repo: match[2],
        };
      } else {
        console.log("Invalid GitHub URL");
        return null;
      }
    }

    const urlData = receiveUrlData(searchString);
    if (urlData) {
      setSearchQuery(urlData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!searchQuery.user || !searchQuery.repo) {
      console.error("Invalid repository URL");
      return;
    }

    const token = process.env.GITHUB_TOKEN;
    dispatch(fetchIssuesStart());

    const url = `https://api.github.com/repos/${searchQuery.user}/${searchQuery.repo}/issues?state=all`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: { token },
        },
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      dispatch(fetchIssuesSuccess(data));
      dispatch(getRepo(searchQuery));
    } catch (error) {
      dispatch(fetchIssuesFailure(error.message));
    }
  };

  return (
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
  );
};

export default Search;
