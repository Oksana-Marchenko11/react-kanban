import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import { useSelector, useDispatch } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";
import { updateIssueBasket } from "../redux/issues/issuesSlice";

const ItemTypes = {
  ISSUE: "issue",
};

const DraggableIssue = ({ issue, index }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ISSUE,
    item: {
      id: issue.id,
      index,
      state: issue.state,
      assignees: issue.assignees,
      _basket: issue._basket,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card>
        <Card.Body>
          <Card.Title>{issue.title}</Card.Title>
          <Card.Text>{issue.title}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

const DroppableColumn = ({ title, issues, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.ISSUE,
    drop: (item) => {
      onDrop(item, title);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <Card
      ref={drop}
      style={{
        height: "700px",
        overflowY: "scroll",
        backgroundColor: isOver ? "#d3d3d3" : "#b3b1b1",
      }}
    >
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        {issues.length > 0 ? (
          issues.map((issue, index) => (
            <DraggableIssue key={issue.id} issue={issue} index={index} />
          ))
        ) : (
          <Card.Text>Немає завдань в {title}</Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};

export const Kanban = () => {
  const dispatch = useDispatch();
  const { issues } = useSelector((state) => state.issues);

  const handleDrop = (item, column) => {
    console.log(item);
    console.log(column);
    const basketMap = {
      "To Do": "todo",
      "In Progress": "in-progress",
      Done: "done",
    };

    const newBasket = basketMap[column];
    const updatedIssues = issues.map((issue) =>
      issue.id === item.id ? { ...issue, _basket: newBasket } : issue
    );
    dispatch(updateIssueBasket(updatedIssues));
  };

  const toDoIssues = issues.filter((issue) => issue._basket === "todo");
  const inProgressIssues = issues.filter(
    (issue) => issue._basket === "in-progress"
  );
  const doneIssues = issues.filter((issue) => issue._basket === "done");

  return (
    <DndProvider backend={HTML5Backend}>
      <Container fluid>
        <Row className="g-12">
          <Col xs={12} sm={4} md={4}>
            <DroppableColumn
              title="To Do"
              issues={toDoIssues}
              onDrop={handleDrop}
            />
          </Col>
          <Col xs={12} sm={4} md={4}>
            <DroppableColumn
              title="In Progress"
              issues={inProgressIssues}
              onDrop={handleDrop}
            />
          </Col>
          <Col xs={12} sm={4} md={4}>
            <DroppableColumn
              title="Done"
              issues={doneIssues}
              onDrop={handleDrop}
            />
          </Col>
        </Row>
      </Container>
    </DndProvider>
  );
};

export default Kanban;
