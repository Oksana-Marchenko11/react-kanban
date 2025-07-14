import React, { useState } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getRepo } from "../helpers/githubApi";
import { getIssues } from "../helpers/githubApi";
import "./Search.css";

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState({});
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const searchString = e.target.value;

    function receiveUrlData(url) {
      const regex = /^https:\/\/github\.com\/([^/]+)\/([^/?]+)/;
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
    dispatch(getIssues(searchQuery));
    dispatch(getRepo(searchQuery));
  };

  return (
    <Form onSubmit={handleSubmit} className="search-form">
      <Row className="row-spacing">
        <Col xs={12} sm={9} md={9}>
          <Form.Control
            type="search"
            placeholder="Enter Repo URL"
            onChange={handleChange}
          />
        </Col>
        <Col xs={12} sm={3} md={3} className="button-col">
          <Button type="submit" className="gradient-btn">
            Load issues
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Search;
