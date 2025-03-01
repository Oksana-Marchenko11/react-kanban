import React, { useState, useEffect } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import Kanban from "./Kanbans";

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [issues, setIssues] = useState([]);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = process.env.GITHUB_TOKEN;
    try {
      const response = await fetch(
        "https://api.github.com/repos/Oksana-Marchenko11/react-kanban/issues",
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      console.log(data);
      setIssues(data);
    } catch (error) {
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
      <Kanban issues={issues} />
    </>
  );
};

export default Search;
