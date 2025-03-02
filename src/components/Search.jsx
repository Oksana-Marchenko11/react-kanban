import React, { useState } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  fetchIssuesStart,
  fetchIssuesSuccess,
  fetchIssuesFailure,
} from "../redux/issues/issuesSlice";

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

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
    } catch (error) {
      dispatch(fetchIssuesFailure(error.message));
      console.error("Failed to fetch current project IDs:", error);
    }
    console.log("hi");
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} sm={9} md={9}>
            <Form.Control
              type="search"
              placeholder="Enter Repo URL"
              value={searchQuery}
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
