import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";
import {
  updateIssueBasket,
  updateIssueOrder,
} from "../redux/issues/issuesSlice";

const ItemTypes = {
  ISSUE: "issue",
};

export const Kanban = () => {
  const dispatch = useDispatch();
  const { issues } = useSelector((state) => state.issues);

  const DraggableIssue = ({ issue, index, basket }) => {
    console.log(basket);
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.ISSUE,
      item: {
        id: issue.id,
        index,
        state: issue.state,
        title: issue.title,
        _basket: issue._basket,
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [{ isOver }, drop] = useDrop({
      accept: ItemTypes.ISSUE,
      hover: (draggedItem) => {
        if (draggedItem.index === index) return; // нічого не міняємо

        moveIssue(draggedItem.index, index, basket);
        draggedItem.index = index; // оновлюємо індекс перетягуваного елемента
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });
    return (
      <Card
        ref={(node) => drag(drop(node))}
        style={{
          opacity: isDragging ? 0.9 : 1,
          backgroundColor: isOver ? "red" : "white",
          padding: "20px",
        }}
        className="mb-3"
      >
        <Card.Body>
          <Card.Title className="text_title">{issue.title}</Card.Title>
          <Card.Text className="text">{issue.title}</Card.Text>
        </Card.Body>
      </Card>
    );
  };

  const DroppableColumn = ({ title, issues, onDrop, basket }) => {
    const [_, drop] = useDrop({
      accept: ItemTypes.ISSUE,
      drop: (item, monitor) => {
        // console.log(issues);
        // console.log(item);
        onDrop(item, title);
      },
       });
    return (
      <Card ref={drop}>
        <Card.Body className="my-custom-card">
          <Card.Title>{title}</Card.Title>
          {issues.length > 0 ? (
            issues.map((issue, index) => (
              <DraggableIssue
                issues={issues}
                issue={issue}
                key={issue.id}
                index={index}
                basket={basket}
              />
            ))
          ) : (
            <Card.Text>Немає завдань в {title}</Card.Text>
          )}
        </Card.Body>
      </Card>
    );
  };

  const handleDrop = (item, column) => {
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

  const moveIssue = (dragIndex, hoverIndex, basket) => {
    dispatch(updateIssueOrder({ dragIndex, hoverIndex, basket }));
  };

  const toDoIssues = issues.filter((issue) => issue._basket === "todo");
  const inProgressIssues = issues.filter(
    (issue) => issue._basket === "in-progress"
  );
  const doneIssues = issues.filter((issue) => issue._basket === "done");

  return (
    <DndProvider backend={HTML5Backend}>
      <Container fluid className="px-4">
        <Row className="g-4">
          <Col xs={12} sm={4} md={4}>
            <DroppableColumn
              title="To Do"
              issues={toDoIssues}
              onDrop={handleDrop}
              moveIssue={moveIssue}
              basket="todo"
            />
          </Col>
          <Col xs={12} sm={4} md={4}>
            <DroppableColumn
              title="In Progress"
              issues={inProgressIssues}
              onDrop={handleDrop}
              moveIssue={moveIssue}
              basket="in-progress"
            />
          </Col>
          <Col xs={12} sm={4} md={4}>
            <DroppableColumn
              title="Done"
              issues={doneIssues}
              onDrop={handleDrop}
              moveIssue={moveIssue}
              basket="done"
            />
          </Col>
        </Row>
      </Container>
    </DndProvider>
  );
};

export default Kanban;
