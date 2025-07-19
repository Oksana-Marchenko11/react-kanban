import { useRef } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";
import { updateIssuesSlice } from "../redux/issues/issuesSlice";
import "./Kanbans.css";

const ItemTypes = {
  ISSUE: "issue",
};

const DroppableColumn = ({ title, columnsIssues, column }) => {
  const columnRef = useRef(null);
  const dispatch = useDispatch();
  const issues = useSelector((state) => state.issues.issues);

  const [, drop] = useDrop({
    accept: ItemTypes.ISSUE,
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
    hover: (item, monitor) => {
      if (issues.placeholder._column === column && issues.placeholder._position === 100) return;
      if (item._column === column) return;

      setTimeout(() => {
        const clonedIssues = JSON.parse(JSON.stringify(issues));
        if (clonedIssues.placeholder._column !== column) {
          clonedIssues.placeholder._position = 100;
          clonedIssues.placeholder._column = column;
          dispatch(updateIssuesSlice(clonedIssues));
        }
      }, 10);
    },
  });

  // const columnClassName = `column-drop-preview ${isOver && canDrop ? "column-drop-preview-active" : ""}`;

  return (
    <Card
      ref={(node) => {
        columnRef.current = node;
        drop(node);
      }}
      className={"card_wrapper"}
    >
      <Card.Body className="card_body">
        <Card.Title className="column_card_title">{title}</Card.Title>
        {columnsIssues.length > 0 ? (
          columnsIssues.map((issue) => {
            return <DraggableIssue target={issue} key={issue.id} />;
          })
        ) : (
          <Card.Text>Немає завдань в {title}</Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};

const DraggableIssue = ({ target }) => {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const issues = useSelector((state) => state.issues.issues);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ISSUE,
    item: () => {
      const data = {
        id: target.id,
        _column: target._column,
        _position: target._position,
      };
      return data;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      setTimeout(() => {
        const dropRezult = monitor.getDropResult();
        const clonedIssues = JSON.parse(JSON.stringify(issues));
        if (dropRezult === null) {
          clonedIssues.placeholder._column = "";
          dispatch(updateIssuesSlice(clonedIssues));
        }
      }, 10);
    },
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.ISSUE,
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
    hover: (item, monitor) => {
      if (item.id === target.id) return;
      if (item.id === "placeholder") return;

      const clonedIssues = JSON.parse(JSON.stringify(issues));

      if (target.id !== "placeholder") {
        clonedIssues.placeholder._column = target._column;
        clonedIssues.placeholder._position = target._position - 0.5;
      }
      dispatch(updateIssuesSlice(clonedIssues));
    },
    drop: (item, monitor) => {
      setTimeout(() => {
        const updatedIssues = JSON.parse(JSON.stringify(issues));

        if (target.id === "placeholder") {
          updatedIssues[item.id]._column = issues.placeholder._column;
          updatedIssues[item.id]._position = issues.placeholder._position;
          updatedIssues.placeholder._column = "";
        } else {
          updatedIssues.placeholder._column = "";
        }
        dispatch(updateIssuesSlice(updatedIssues));
      }, 20);
    },
  });

  const cardClassName = `issue-card issue_card mb-3 ${isOver ? "issue-card-drop-target drop-target" : ""} ${isDragging ? "issue-card-dragging" : ""}`;

  return (
    <Card
      ref={(node) => {
        ref.current = node;
        drag(drop(node));
      }}
      className={cardClassName}
    >
      <Card.Body className="issue_body">
        <Card.Title className="text_title">{target.title}</Card.Title>
        <Card.Text className="text">{target.title}</Card.Text>
      </Card.Body>
      {/* <div className="issue-key">Key: {target.id}</div> */}
    </Card>
  );
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const Kanban = () => {
  const { issues } = useSelector((state) => ({
    issues: state.issues.issues,
  }));
  const clonedIssues = JSON.parse(JSON.stringify(issues));

  const toDoIssues =
    Object.values(clonedIssues)
      .filter((task) => task && task._column === "toDoIssues")
      .sort((a, b) => a._position - b._position) || [];

  const inProgressIssues =
    Object.values(clonedIssues)
      .filter((task) => task && task._column === "inProgressIssues")
      .sort((a, b) => a._position - b._position) || [];

  const doneIssues =
    Object.values(clonedIssues)
      .filter((task) => task && task._column === "doneIssues")
      .sort((a, b) => a._position - b._position) || [];

  return (
    <DndProvider backend={HTML5Backend}>
      <Container fluid className="px-4">
        <Row className="g-4">
          <Col xs={12} sm={4} md={4} className="column">
            <DroppableColumn title="To Do" columnsIssues={toDoIssues} column="toDoIssues" />
          </Col>
          <Col xs={12} sm={4} md={4} className="column">
            <DroppableColumn title="In Progress" columnsIssues={inProgressIssues} column="inProgressIssues" />
          </Col>
          <Col xs={12} sm={4} md={4} className="column">
            <DroppableColumn title="Done" columnsIssues={doneIssues} column="doneIssues" />
          </Col>
        </Row>
      </Container>
    </DndProvider>
  );
};

export default Kanban;
