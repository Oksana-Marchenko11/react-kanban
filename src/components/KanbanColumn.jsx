import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { Card } from "react-bootstrap";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./KanbanConstants";
import DraggableIssue from "./Issue";
import { updateIssuesSlice } from "../redux/issues/issuesSlice";
import "./KanbanColumn.css";

export const DroppableColumn = ({ title, columnsIssues, column }) => {
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
