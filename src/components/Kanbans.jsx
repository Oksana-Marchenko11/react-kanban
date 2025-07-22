import { DroppableColumn } from "./KanbanColumn";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./Kanbans.css";

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
