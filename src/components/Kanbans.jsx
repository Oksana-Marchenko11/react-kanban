import React, { useRef } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";
import { updateColumns, updateIssuesSlice } from "../redux/issues/issuesSlice";
import "./Kanbans.css";
import { hover } from "@testing-library/user-event/dist/hover";

const ItemTypes = {
  ISSUE: "issue",
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Функція для оновлення позицій завдань
const updateIssue = (issuesArray, clonedIssuesWithDraggedId) => {
  if (!clonedIssuesWithDraggedId) {
    return issuesArray;
  }
  const normalizeId = (id) => (typeof id === "string" ? parseInt(id, 10) : id);

  const dragged = { ...clonedIssuesWithDraggedId }; // розпилюємо таску яку тягнемо
  const updatedIssues = [...issuesArray];
  // console.log(issuesArray);
  // console.log(updatedIssues);

  // Оновлюємо перетягуваний елемент у масиві
  const idx = updatedIssues.findIndex((i) => normalizeId(i.id) === normalizeId(dragged.id));
  if (idx !== -1) {
    updatedIssues[idx] = dragged;
  } else {
    updatedIssues.push(dragged);
  }
  return updatedIssues;
};
//////////////////////////////////////////////////////////////////////////////////////////////////////

export const Kanban = () => {
  const dispatch = useDispatch();
  const { issues, columns } = useSelector((state) => ({
    issues: state.issues.issues,
    columns: state.issues.columns,
  }));
  const clonedIssues = JSON.parse(JSON.stringify(issues));
  const clonedColumns = JSON.parse(JSON.stringify(columns));
  // console.log(clonedIssues);
  // console.log(clonedColumns);

  const placeholder = {
    title: "",
    id: "placeholder",
  };

  // тут ід усіх тасок в колонці
  const toDoIssues = columns.toDoIssues || [];
  // console.log(toDoIssues);
  const inProgressIssues = columns.inProgressIssues || [];
  const doneIssues = columns.doneIssues || [];

  const handleDrop = (item, column) => {
    if (Number(item.id) === Number(item.hoveredIssueId) && item.basket === column) {
      return;
    }

    const draggedId = item.id;
    const dragged = issues[draggedId];

    const targetId = item.hoveredIssueId;
    const target = targetId ? issues[targetId] : null; // сама таска над якою або після, повна інфа

    const dropPosition = item.dropPosition || "after";
    const isDropToEmptyColumn = item.dropToEmptyColumn || false;

    if (!dragged) {
      return;
    }

    const clonedIssuesWithDraggedId = { ...clonedIssues[draggedId] };
    const clonedIssuesWithTargetId = target ? { ...clonedIssues[targetId] } : null;

    if (item.hoveredIssueId === placeholder.id) {
      delete clonedIssues["placeholder"];
      const filteredBasketColumnn = clonedColumns[item.basket].filter((issue) => Number(issue) !== Number(item.id));
      clonedColumns[item.basket] = filteredBasketColumnn;
      const indexPlaceholder = clonedColumns[column].indexOf("placeholder");
      clonedColumns[column].splice(indexPlaceholder, 1, item.id);

      console.log(clonedIssues);
      console.log(clonedColumns);

      dispatch(
        updateColumns({
          issues: { ...clonedIssues },
          columns: { ...clonedColumns },
        })
      );
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Обробка випадку, коли кидаємо в ПОРОЖНЮ КОЛОНКУ або коли явно вказано dropToEmptyColumn
    else if (isDropToEmptyColumn || (!clonedIssuesWithTargetId && (!columns[column] || columns[column].length === 0))) {
      // const updatedColumns = { ...columns }; // копія колонки зі стейту
      // Тут я стираю взагалі таску, яку тягну за id з усіх тасок
      Object.keys(clonedColumns).forEach((key) => {
        if (clonedColumns[key] === item.id) {
          return;
        }
        if (clonedColumns[key] && Array.isArray(clonedColumns[key])) {
          clonedColumns[key] = clonedColumns[key].filter((id) => id !== parseInt(draggedId));
        }
      });

      // Додаю id до нової колонки
      if (!clonedColumns[column]) {
        clonedColumns[column] = [];
      }
      clonedColumns[column].push(parseInt(draggedId));

      dispatch(
        updateColumns({
          issues: { ...clonedIssues },
          columns: { ...clonedColumns },
        })
      );
      return;
    } else if (item.hoveredIssueId !== placeholder.id) {
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////
      const issuesArray = Object.values(clonedIssues);
      // Оновлюю позиції тасок
      const updatedIssuesArray = updateIssue(issuesArray, clonedIssuesWithDraggedId);
      console.log(updatedIssuesArray);

      // Перетворюю масив назад в об'єкт з id як ключами
      const updatedIssuesObj = {};
      updatedIssuesArray.forEach((issue) => {
        updatedIssuesObj[issue.id] = issue;
      });

      Object.keys(clonedColumns).forEach((key) => {
        if (clonedColumns[key] && Array.isArray(clonedColumns[key])) {
          console.log(clonedColumns[key]);
          clonedColumns[key] = clonedColumns[key].filter((id) => id !== parseInt(draggedId));
          console.log(clonedColumns[key]);
        }
      });

      // Якщо target є, додаю dragged до колонки target
      if (clonedIssuesWithTargetId) {
        const targetColumn = Object.keys(clonedColumns).find((key) => clonedColumns[key] && clonedColumns[key].includes(parseInt(targetId)));
        // console.log(targetColumn);

        if (targetColumn) {
          const targetIndex = clonedColumns[targetColumn].indexOf(parseInt(targetId));
          // const insertIndex = dropPosition === "after" ? targetIndex + 1 : targetIndex;
          // console.log(draggedId);

          clonedColumns[targetColumn].splice(targetIndex, 0, parseInt(draggedId));
        }
      } else {
        // Якщо таргета немає, додаємо в кінець вказаної колонки
        if (!clonedColumns[column]) {
          clonedColumns[column] = [];
        }
        clonedColumns[column].push(parseInt(draggedId));
      }
      console.log(updatedIssuesObj);
      console.log(clonedColumns);

      dispatch(
        updateColumns({
          issues: updatedIssuesObj,
          columns: clonedColumns,
        })
      );
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Draggable компонент для Kanban

  const DraggableIssue = ({ issue, index, basket, issuesAllinBasket }) => {
    const ref = useRef(null);
    // console.log(issue.title);
    // console.log(basket);
    // console.log(issuesAllinBasket);

    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.ISSUE,
      item: () => {
        const element = ref.current;
        const rect = element ? element.getBoundingClientRect() : null;
        return {
          id: issue.id,
          basket: basket,
          index: index,
          size: rect ? { width: rect.width, height: rect.height } : null,
        };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [{ isOver }, drop] = useDrop({
      accept: ItemTypes.ISSUE,
      hover: (item, monitor) => {
        // console.log(item);

        if (clonedColumns[basket].includes("placeholder") && item.hoveredIssueId !== "placeholder") {
          const indexOfPlaceHolder = clonedColumns[basket].indexOf("placeholder");
          clonedColumns[basket].splice(indexOfPlaceHolder, 1);
          dispatch(updateColumns({ columns: { ...clonedColumns } }));
        }

        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        if (!hoverBoundingRect) return;

        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Позиція курсора відносно елемента
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;

        // Відстань від верху елемента до курсора
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Визначаю чи перетягування над або під центром елемента
        const isAboveMiddle = hoverClientY < hoverMiddleY;

        // Зберігаємо цю інформацію в draggedItem для використання в drop
        item.dropPosition = isAboveMiddle ? "before" : "after";
        item.hoveredIssueId = issue.id;

        // const updatedDone = columns.doneIssues.includes(placeholder.id || placeholder.key) ? columns.doneIssues : [...columns.doneIssues, placeholder.id];
        if (item.id === item.hoveredIssueId) {
          return;
        }
        if (item.hoveredIssueId && !issuesAllinBasket.includes("placeholder")) {
          const hoveredIssue = issues[item.hoveredIssueId];
          // console.log(hoveredIssue);
          const hoveredBasket = basket;
          const hoveredBasketIssues = [...issuesAllinBasket];
          // console.log(hoveredBasket);
          // console.log(hoveredBasketIssues);
          // console.log(index);
          // console.log(placeholder);
          // console.log(columns);
          hoveredBasketIssues.splice(index, 0, placeholder.id);
          // console.log(hoveredBasketIssues);
          const newColumn = {
            ...columns,
            [hoveredBasket]: [...hoveredBasketIssues],
          };
          // console.log(newColumn);
          const newIssues = {
            ...issues,
            placeholder,
          };
          // console.log(newIssues);
          dispatch(
            updateColumns({
              issues: {
                ...newIssues,
              },
              columns: { ...newColumn },
            })
          );
        }
      },
      drop: (item, monitor) => {
        // Оновляю інформацію перед дропом
        handleDrop(
          {
            ...item,
            hoveredIssueId: issue.id,
            hoveredIssueBasket: issue.basket,
            dropPosition: item.dropPosition || "after",
          },
          basket
        );
        if (item.id === issue.id && item.basket === basket) return;
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        handlerId: monitor.getHandlerId(), // id елемента, над яким зараз ховер
        dropClassName: monitor.isOver({ shallow: true }) ? "drop-over" : "",
      }),
    });

    const cardClassName = `issue-card mb-3 ${isOver ? "issue-card-drop-target drop-target" : ""} ${isDragging ? "issue-card-dragging" : ""}`;

    return (
      <Card
        ref={(node) => {
          ref.current = node;
          drag(drop(node));
        }}
        // onClick={() => console.log(issue)} // debug: клік по тасці
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

  // Колонка, куди можна кидати таски
  const DroppableColumn = ({ title, columnsIssues, onDrop, basket }) => {
    const columnRef = useRef(null);
    const issueRefs = useRef({});

    // Дроп на всю колонку (для зміни basket)
    const [{ isOver, canDrop, dragItem, clientOffset }, drop] = useDrop({
      accept: ItemTypes.ISSUE,
      hover: (item, monitor) => {
        if (columnsIssues.length === 0) {
          item.dropToEmptyColumn = true;
          return;
        }

        let closestIssue = null;
        let closestDistance = Infinity;
        let position = "before";

        Object.entries(issueRefs.current).forEach(([id, ref]) => {
          if (!ref || !clientOffset) return;

          const rect = ref.getBoundingClientRect();
          const issueMiddleY = rect.top + rect.height / 2;

          const distance = Math.abs(clientOffset.y - issueMiddleY);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIssue = id;
            position = clientOffset.y < issueMiddleY ? "before" : "after";
          }
        });

        if (closestIssue) {
          item.hoveredIssueId = closestIssue;
          item.dropPosition = position;
          item.dropToEmptyColumn = false;
        }
      },
      drop: (item, monitor) => {
        if (monitor.didDrop()) {
          return;
        }

        // Коли дроп відбувся на саму колонку або це порожня коло передаємо інформацію про дроп до загального обробника
        onDrop(
          {
            ...item,
            dropToEmptyColumn: item.dropToEmptyColumn || columnsIssues.length === 0,
          },
          basket
        );
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
        dragItem: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
      }),
    });

    // Розрахунок позиції дроп-плейсхолдера
    const getPlaceholderPosition = () => {
      if (!columnRef.current || !clientOffset || !dragItem) {
        return { top: 0 };
      }

      const columnRect = columnRef.current.getBoundingClientRect();

      // Якщо немає елементів у колонці, розміщую плейсхолдер вгорі колонки
      if (columnsIssues.length === 0) {
        return {
          top: 60,
          left: 10,
          right: 10,
          width: dragItem.size?.width || 100,
          height: dragItem.size?.height || 100,
        };
      }

      // Знаходимо, перед/після якого елемента розмістити плейсхолдер
      const hoveredIssueId = dragItem.hoveredIssueId;
      const position = dragItem.dropPosition || "after";

      if (hoveredIssueId && issueRefs.current[hoveredIssueId]) {
        const rect = issueRefs.current[hoveredIssueId].getBoundingClientRect();

        if (position === "before") {
          return {
            top: rect.top - columnRect.top - 3,
            left: 10,
            right: 10,
            height: dragItem.size?.height || 100,
            width: dragItem.size?.width || 100,
          };
        } else {
          return {
            top: rect.bottom - columnRect.top + 10,
            right: 10,
            height: dragItem.size?.height || 100,
            width: dragItem.size?.width || 100,
          };
        }
      }

      // Якщо не знайдено елемент, розміщуємо за курсором
      const offsetY = clientOffset.y - columnRect.top;
      return {
        top: offsetY,
        left: 10,
        right: 10,
        height: 6,
        width: "calc(100% - 20px)",
      };
    };

    const columnClassName = `column-drop-preview ${isOver && canDrop ? "column-drop-preview-active" : ""}`;

    // Функція для збереження refs елементів
    const setIssueRef = (id, node) => {
      if (node) {
        issueRefs.current[id] = node;
      }
    };

    // Створюємо плейсхолдер для порожньої колонки
    const renderEmptyColumnPlaceholder = () => {
      if (!isOver || !canDrop || !dragItem || columnsIssues.length > 0) return null;

      return (
        <div className="empty-column-drop-placeholder" style={{ height: dragItem.size?.height || 100 }}>
          <span>
            Переміщення '{dragItem.id}' в колонку "{title}"
          </span>
        </div>
      );
    };

    return (
      <Card
        ref={(node) => {
          columnRef.current = node;
          drop(node);
        }}
        className={columnClassName}
        lu
      >
        <Card.Body className="my-custom-card">
          <Card.Title>{title}</Card.Title>
          {/* Відображаємо всі таски в колонці */}
          {columnsIssues.length > 0 ? (
            columnsIssues.map((issue, index) =>
              issue === "placeholder" ? (
                <div className="my-placeholder" key={issue} ref={(node) => setIssueRef(issue, node)}>
                  {/* <DraggableIssue className="my-placeholder" issue={issues[issue]} index={index} basket={basket} issuesAllinBasket={columnsIssues} /> */}
                </div>
              ) : (
                <div key={issue} ref={(node) => setIssueRef(issue, node)}>
                  <DraggableIssue issue={issues[issue]} index={index} basket={basket} issuesAllinBasket={columnsIssues} />
                </div>
              )
            )
          ) : (
            <Card.Text>Немає завдань в {title}</Card.Text>
          )}
          {/* Відображаємо плейсхолдер для порожньої колонки */}
          {renderEmptyColumnPlaceholder()}
          {/* Стандартний плейсхолдер для вставки між елементами */}
          {/* {isOver && canDrop && dragItem && columnsIssues.length > 0 && (
            <div className="drop-placeholder" style={getPlaceholderPosition()}>
              <div className="drop-placeholder-line"></div>
            </div>
          )} */}
        </Card.Body>
      </Card>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container fluid className="px-4">
        <Row className="g-4">
          <Col xs={12} sm={4} md={4}>
            <DroppableColumn title="To Do" columnsIssues={toDoIssues} onDrop={handleDrop} basket="toDoIssues" />
          </Col>
          <Col xs={12} sm={4} md={4}>
            <DroppableColumn title="In Progress" columnsIssues={inProgressIssues} onDrop={handleDrop} basket="inProgressIssues" />
          </Col>
          <Col xs={12} sm={4} md={4}>
            <DroppableColumn title="Done" columnsIssues={doneIssues} onDrop={handleDrop} basket="doneIssues" />
          </Col>
        </Row>
      </Container>
    </DndProvider>
  );
};

export default Kanban;
