import React from "react";
import { Card } from "react-bootstrap";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./KanbanConstants";
import "./Issue.css";

// Компонент завдання, яке можна переміщувати
const DraggableIssue = ({ issue, index, basket, handleDrop, moveIssue }) => {
  const ref = React.useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ISSUE, // Тип draggable елемента
    item: () => {
      // Вимірюємо розмір елемента перед початком перетягування
      const element = ref.current;
      const rect = element ? element.getBoundingClientRect() : null;

      return {
        id: issue.id, // id таски
        basket: basket, // колонка
        index: index, // індекс у списку columnsIssues
        size: rect ? { width: rect.width, height: rect.height } : null
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), // чи зараз тягнуть цю таску
    }),
  });

  // Додаємо можливість кидати інші таски на цю
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.ISSUE, // приймаємо тільки таски
    hover: (draggedItem, monitor) => {
      // Якщо таска тягнеться сама на себе в тій же колонці — нічого не робимо
      if (draggedItem.id === issue.id && draggedItem.basket === basket) return;

      // Визначаємо, чи перетягування ближче до верхньої чи нижньої частини елемента
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      if (!hoverBoundingRect) return;

      // Вертикальний центр елемента
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Позиція курсора відносно елемента
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      // Відстань від верху елемента до курсора
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Визначаємо, чи перетягування над або під центром елемента
      const isAboveMiddle = hoverClientY < hoverMiddleY;

      // Зберігаємо цю інформацію в draggedItem для використання в drop
      draggedItem.dropPosition = isAboveMiddle ? 'before' : 'after';

      // Міняємо порядок тасок у колонці
      moveIssue(draggedItem.index, index, basket);

      // Зберігаємо id таски, над якою зараз ховер
      draggedItem.hoveredId = issue.id;
    },
    drop: (item, monitor) => {
      // Оновлюємо інформацію перед дропом
      handleDrop({
        ...item,
        hoveredIssueId: issue.id,
        dropPosition: item.dropPosition || 'after'
      }, basket);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(), // чи зараз ховерять цю таску
      handlerId: monitor.getHandlerId(), // id елемента, над яким зараз ховер
      dropClassName: monitor.isOver({ shallow: true }) ? "drop-over" : "", // клас при ховері
    }),
  });

  // Визначаємо CSS класи для картки
  const cardClassName = `issue-card mb-3 ${isOver ? 'issue-card-drop-target drop-target' : ''} ${isDragging ? 'issue-card-dragging' : ''}`;

  return (
    <Card
      ref={(node) => {
        ref.current = node;
        drag(drop(node));
      }} // одночасно draggable і droppable
      onClick={() => console.log(issue)} // debug: клік по тасці
      className={cardClassName}
    >
      <Card.Body>
        <div className="issue-key">Key: {issue.id}</div>
        <Card.Title className="text_title">{issue.title}</Card.Title>
        <Card.Text className="text">{issue.title}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default DraggableIssue;
