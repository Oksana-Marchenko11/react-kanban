import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

export const Kanban = ({ issues }) => {
  console.log(issues);
  const toDoIssues = issues.filter(
    (issue) => (issue.state === "open") & !issue.assignees.length
  );
  const inProgressIssues = issues.filter(
    (issue) => (issue.state === "open") & (issue.assignees.length > 0)
  );
  const doneIssues = issues.filter((issue) => issue.state === "closed");
  console.log(toDoIssues);
  console.log(doneIssues);
  return (
    <Container fluid>
      <Row className="g-12">
        <Col xs={12} sm={4} md={4}>
          <Card style={{ height: "700px", backgroundColor: "#b3b1b1" }}>
            <Card.Body>
              <Card.Title>To Do</Card.Title>
              {toDoIssues.length > 0 ? (
                <Card.Text>
                  {toDoIssues.map((toDoIssue) => toDoIssue.title)}
                </Card.Text>
              ) : (
                <Card.Text>Немає завдань в To Do</Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={4} md={4}>
          <Card style={{ height: "700px", backgroundColor: "#b3b1b1" }}>
            <Card.Body>
              <Card.Title>In Progress</Card.Title>
              {inProgressIssues.length > 0 ? (
                <Card.Text>
                  {inProgressIssues.map((progressIssue) => progressIssue.title)}
                </Card.Text>
              ) : (
                <Card.Text>Немає завдань в In Progress</Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={4} md={4}>
          <Card style={{ height: "700px", backgroundColor: "#b3b1b1" }}>
            <Card.Body>
              <Card.Title>Done</Card.Title>
              {doneIssues.length > 0 ? (
                <Card.Text>
                  {doneIssues.map((doneIssue) => doneIssue.title)}
                </Card.Text>
              ) : (
                <Card.Text>Немає завдань в Done</Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default Kanban;
