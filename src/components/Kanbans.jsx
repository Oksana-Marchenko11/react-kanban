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
  const clonedIssues = JSON.parse(JSON.stringify(issues));

  // Дроп на всю колонку (для зміни basket)
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.ISSUE,
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      // dragItem: monitor.getItem(),
      // clientOffset: monitor.getClientOffset(),
    }),
    hover: (item, monitor) => {
      clonedIssues.placeholder._position = 100;
      clonedIssues.placeholder._column = column;
      dispatch(
        updateIssuesSlice({
          ...clonedIssues,
        })
      );
    },
  });

  const columnClassName = `myCard  column-drop-preview ${isOver && canDrop ? "column-drop-preview-active" : ""}`;

  return (
    <Card
      ref={(node) => {
        columnRef.current = node;
        drop(node);
      }}
      className={columnClassName}
    >
      <Card.Body className="my-custom-card">
        <Card.Title>{title}</Card.Title>
        {/* Відображаємо всі таски в колонці */}
        {columnsIssues.length > 0 ? (
          columnsIssues.map((issue) => {
            return (
              // <div className="div_question" key={issue.id} style={{ width: "100%" }}>
              <DraggableIssue issue={issue} key={issue.id} />
              // </div>
            );
          })
        ) : (
          <Card.Text>Немає завдань в {title}</Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};

const DraggableIssue = ({ issue }) => {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const issues = useSelector((state) => state.issues.issues);
  const clonedIssues = JSON.parse(JSON.stringify(issues));

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ISSUE,
    item: () => {
      const data = {
        id: issue.id,
        _column: issue._column,
        _position: issue._position,
      };
      console.log("📦 drag item:", data); // <--- додай
      return data;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.ISSUE,
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
    hover: (item) => {
      if (item.id === issue.id) return;

      // const placeholder = clonedIssues.placeholder;
      if (clonedIssues.placeholder._position !== issue._position && clonedIssues.placeholder._column !== issue._column) {
        const hoveredIssue = issue;
        clonedIssues.placeholder._column = issue._column;
        clonedIssues.placeholder._position = issue._position;
        clonedIssues[hoveredIssue.id]._position += 0.5;
        dispatch(updateIssuesSlice(clonedIssues));
      }
    },
    drop: (item, monitor) => {
      // Drop тільки на placeholder
      if (monitor.didDrop()) {
        return; // Хтось вже спіймав drop
      }
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

      if (issue.id === "placeholder") {
        clonedIssues[item.id]._column = clonedIssues.placeholder._column;
        clonedIssues[item.id]._position = clonedIssues.placeholder._position;
        clonedIssues.placeholder._column = "";
        dispatch(updateIssuesSlice(clonedIssues));
      }
    },
  });

  const cardClassName = `issue-card card_wrapper mb-3 ${isOver ? "issue-card-drop-target drop-target" : ""} ${isDragging ? "issue-card-dragging" : ""}`;

  return (
    <Card
      ref={(node) => {
        ref.current = node;
        drag(drop(node));
      }}
      className={cardClassName}
      style={{ width: "100%" }}
    >
      <Card.Body className="card_exactly">
        <Card.Title className="text_title">{issue.title}</Card.Title>
        <Card.Text className="text">{issue.title}</Card.Text>
      </Card.Body>
      <div className="issue-key">Key: {issue.id}</div>
    </Card>
  );
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////

export const Kanban = () => {
  const { issues } = useSelector((state) => ({
    issues: state.issues.issues,
  }));
  const clonedIssues = JSON.parse(JSON.stringify(issues));

  // console.log(clonedIssues);

  const toDoIssues =
    Object.values(clonedIssues)
      .filter((task) => task._column === "toDoIssues")
      .sort((a, b) => a._position - b._position) || [];

  const inProgressIssues =
    Object.values(clonedIssues)
      .filter((task) => task._column === "inProgressIssues")
      .sort((a, b) => a._position - b._position) || [];

  const doneIssues =
    Object.values(clonedIssues)
      .filter((task) => task._column === "doneIssues")
      .sort((a, b) => a._position - b._position) || [];
  return (
    <DndProvider backend={HTML5Backend}>
      <Container fluid className="px-4">
        <Row className="g-4">
          <Col xs={12} sm={4} md={4}>
            <DroppableColumn title="To Do" columnsIssues={toDoIssues} column="toDoIssues" />
          </Col>
          <Col xs={12} sm={4} md={4}>
            <DroppableColumn title="In Progress" columnsIssues={inProgressIssues} column="inProgressIssues" />
          </Col>
          <Col xs={12} sm={4} md={4}>
            <DroppableColumn title="Done" columnsIssues={doneIssues} column="doneIssues" />
          </Col>
        </Row>
      </Container>
    </DndProvider>
  );
};

export default Kanban;
