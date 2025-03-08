import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import { useSelector } from "react-redux";

export const Kanban = () => {
  const { issues } = useSelector((state) => state.issues);
  const toDoIssues = issues.filter(
    (issue) => issue.state === "open" && !issue.assignees.length
  );
  const inProgressIssues = issues.filter(
    (issue) => issue.state === "open" && issue.assignees.length > 0
  );
  const doneIssues = issues.filter((issue) => issue.state === "closed");
  return (
    <Container fluid>
      <Row className="g-12">
        <Col xs={12} sm={4} md={4}>
          <Card
            style={{
              height: "700px",
              overflowY: "scroll",
              backgroundColor: "#b3b1b1",
            }}
          >
            <Card.Body>
              <Card.Title>To Do</Card.Title>
              {toDoIssues.length > 0 ? (
                toDoIssues.map((toDoIssue, index) => {
                  return (
                    <Card key={index}>
                      <Card.Body>
                        <Card.Title>{toDoIssue.title}</Card.Title>
                        <Card.Text>{toDoIssue.title}</Card.Text>
                      </Card.Body>
                    </Card>
                  );
                })
              ) : (
                <Card.Text>Немає завдань в To Do</Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={4} md={4}>
          <Card
            style={{
              height: "700px",
              overflowY: "scroll",
              backgroundColor: "#b3b1b1",
            }}
          >
            <Card.Body>
              <Card.Title>In Progress</Card.Title>
              {inProgressIssues.length > 0 ? (
                inProgressIssues.map((inProccesIssue, index) => {
                  return (
                    <Card key={index}>
                      <Card.Body>
                        <Card.Title>{inProccesIssue.title}</Card.Title>
                        <Card.Text>{inProccesIssue.title}</Card.Text>
                      </Card.Body>
                    </Card>
                  );
                })
              ) : (
                <Card.Text>Немає завдань в In Progress</Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={4} md={4}>
          <Card
            style={{
              height: "700px",
              overflowY: "scroll",
              backgroundColor: "#b3b1b1",
            }}
          >
            <Card.Body>
              <Card.Title>Done</Card.Title>
              {doneIssues.length > 0 ? (
                doneIssues.map((doneIssues, index) => {
                  return (
                    <Card key={index}>
                      <Card.Body>
                        <Card.Title>{doneIssues.title}</Card.Title>
                        <Card.Text>{doneIssues.title}</Card.Text>
                      </Card.Body>
                    </Card>
                  );
                })
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
