import React from "react";
import { Col, Card } from "react-bootstrap";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./KanbanConstants";
import DraggableIssue from "./Issue";
import "./KanbanColumn.css";

// Компонент колонки канбан-дошки
const KanbanColumn = ({
  title,
  basket,
  issues = [],
  handleDrop,
  moveIssue,
  emptyDropHover,
  setEmptyDropHover
}) => {
  // Додаємо можливість перетягувати таски на порожнє місце колонки
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.ISSUE,
    drop: (item, monitor) => {
      // Якщо вже був дроп на конкретне завдання - ігноруємо дроп на колонку
      if (monitor.didDrop()) {
        return;
      }

      // Інакше обробляємо дроп на порожньому просторі колонки
      handleDrop(item, basket);

      // Скидаємо стан ховеру після дропу
      setEmptyDropHover && setEmptyDropHover(null);
    },
    hover: (item, monitor) => {
      // Оновлюємо стан, щоб показати, що можна кинути в цю колонку
      setEmptyDropHover && setEmptyDropHover(basket);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  // Визначаємо класи для колонки при перетягуванні
  const columnClassName = `kanban-column ${isOver && canDrop ? 'kanban-column-drop' : ''}`;

  return (
    <Col>
      <Card ref={drop} className={`h-100 ${columnClassName}`} >
        <Card.Header className="kanban-column-title">{title}</Card.Header>
        <Card.Body className="d-flex flex-column">
          {issues.length > 0 ? (
            issues.map((issue, index) => (
              <DraggableIssue
                key={issue.id}
                issue={issue}
                index={index}
                basket={basket}
                handleDrop={handleDrop}
                moveIssue={moveIssue}
              />
            ))
          ) : (
            <div className={`empty-column-placeholder ${emptyDropHover === basket ? 'empty-column-drop-hover' : ''}`} >
              Перетягніть завдання сюди
            </div>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default KanbanColumn;
