import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

export const Kanban = () => {
  return (
    <Container fluid>
      <Row className="g-12">
        {/* Перша картка - To Do */}
        <Col xs={12} sm={4} md={4}>
          <Card style={{ height: "700px", backgroundColor: "#b3b1b1" }}>
            <Card.Body>
              <Card.Title>To Do</Card.Title>
            </Card.Body>
          </Card>
        </Col>

        {/* Друга картка - In Progress */}
        <Col xs={12} sm={4} md={4}>
          <Card style={{ height: "700px", backgroundColor: "#b3b1b1" }}>
            <Card.Body>
              <Card.Title>In Progress</Card.Title>
            </Card.Body>
          </Card>
        </Col>

        {/* Третя картка - Done */}
        <Col xs={12} sm={4} md={4}>
          <Card style={{ height: "700px", backgroundColor: "#b3b1b1" }}>
            <Card.Body>
              <Card.Title>Done</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default Kanban;
