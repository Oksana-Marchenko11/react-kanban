import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { Card } from "react-bootstrap";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./KanbanConstants";
import { updateIssuesSlice } from "../redux/issues/issuesSlice";
import "./Issue.css";

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
      if (item.id === target.id) return; // сам над собою
      if (item.id === "placeholder") return; // не тягнемо плейсхолдер
      if (target.id === "placeholder") return; // не міняємо над плейсхолдером

      const clonedIssues = JSON.parse(JSON.stringify(issues));

      if (clonedIssues.placeholder._position < target._position) {
        clonedIssues.placeholder._position = target._position + 0.5;
      } else if (clonedIssues.placeholder._position > target._position) {
        clonedIssues.placeholder._position = target._position - 0.5;
      }
      clonedIssues.placeholder._column = target._column;

      //////////////////////////////////////////////////////////////////
      console.log(`t: ${target._position}; p: ${clonedIssues.placeholder._position};`);

      dispatch(updateIssuesSlice(clonedIssues));
    },
    drop: (item, monitor) => {
      console.log(target._position);
      setTimeout(() => {
        const updatedIssues = JSON.parse(JSON.stringify(issues));

        if (target.id === "placeholder") {
          updatedIssues[item.id]._column = issues.placeholder._column;
          updatedIssues[item.id]._position = issues.placeholder._position;
          updatedIssues.placeholder._column = "";
          updatedIssues.placeholder._position = "";

          let caunterA = 0;
          let caunterB = 0;
          let caunterC = 0;
          Object.values(updatedIssues)
            .sort((a, b) => a._position - b._position)
            .forEach((key, index) => {
              if (key.id !== "placeholder") {
                if (key._column === "toDoIssues") {
                  caunterA++;
                  key._position = caunterA;
                }
                if (key._column === "inProgressIssues") {
                  caunterB++;
                  key._position = caunterB;
                }
                if (key._column === "doneIssues") {
                  caunterC++;
                  key._position = caunterC;
                }
              }
            });
          dispatch(updateIssuesSlice(updatedIssues));

          caunterA = 0;
          caunterB = 0;
          caunterC = 0;
        }
      }, 20);
    },
  });

  const cardClassName = `issue_card mb-3 ${isOver ? "issue_card_drop_target" : ""} ${isDragging ? "issue_card_dragging" : ""}`;

  const issue = target.id === "placeholder" ? "issue_placeholder" : "issue_body";

  return (
    <Card
      ref={(node) => {
        ref.current = node;
        drag(drop(node));
      }}
      className={cardClassName}
    >
      <Card.Body className={issue}>
        <Card.Title className="text_title">{target.title}</Card.Title>
        <Card.Text className="text">{target.body}</Card.Text>
      </Card.Body>
      {/* <div className="issue-key">Key: {target.id}</div> */}
    </Card>
  );
};
export default DraggableIssue;
