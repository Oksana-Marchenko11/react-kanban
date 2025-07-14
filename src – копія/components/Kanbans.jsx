import { useRef, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";
import { updateColumns } from "../redux/issues/issuesSlice";
import "./Kanbans.css";

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

  const dragged = { ...clonedIssuesWithDraggedId };
  const updatedIssues = [...issuesArray];

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

  console.log(clonedIssues);

  const placeholder = {
    title: "",
    id: "placeholder",
  };

  // тут ід усіх тасок в колонці
  // const toDoIssues = columns.toDoIssues || [];
  // const inProgressIssues = columns.inProgressIssues || [];
  // const doneIssues = columns.doneIssues || [];

  const toDoIssues = Object.values(clonedIssues).filter((task) => task._column === "toDoIssues") || [];
  const inProgressIssues = Object.values(clonedIssues).filter((task) => task._column === "inProgressIssues") || [];
  const doneIssues = Object.values(clonedIssues).filter((task) => task._column === "doneIssues") || [];

  console.log(toDoIssues);

  const handleDrop = (item, column) => {
    if (Number(item.id) === Number(item.hoveredIssueId) && item.basket === column) {
      return;
    }

    const draggedId = item.id;
    const dragged = issues[draggedId];

    const targetId = item.hoveredIssueId;
    const target = targetId ? issues[targetId] : null;

    // const dropPosition = item.dropPosition || "after";
    const isDropToEmptyColumn = item.dropToEmptyColumn || false;

    if (!dragged) {
      return;
    }

    const clonedIssuesWithDraggedId = { ...clonedIssues[draggedId] };
    const clonedIssuesWithTargetId = target ? { ...clonedIssues[targetId] } : null;

    // якщо над плейсхолдером дроп
    if (item.hoveredIssueId === placeholder.id) {
      delete clonedIssues["placeholder"];
      const filteredBasketColumnn = clonedColumns[item.basket].filter((issue) => Number(issue) !== Number(item.id));
      clonedColumns[item.basket] = filteredBasketColumnn;
      const indexPlaceholder = clonedColumns[column].indexOf("placeholder");
      clonedColumns[column].splice(indexPlaceholder, 1, item.id);
      dispatch(
        updateColumns({
          issues: { ...clonedIssues },
          columns: { ...clonedColumns },
        })
      );
    }
    // Обробка випадку, коли кидаємо в ПОРОЖНЮ КОЛОНКУ або коли явно вказано dropToEmptyColumn
    else if (isDropToEmptyColumn || (!clonedIssuesWithTargetId && (!columns[column] || columns[column].length === 0))) {
      Object.keys(clonedColumns).forEach((key) => {
        if (clonedColumns[key] === item.id) {
          return;
        }
        // стираю таску з колонки з якої тягнула
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
      // якщо ховер змістився з плейсхолдера
    } else if (item.hoveredIssueId !== placeholder.id) {
      const issuesArray = Object.values(clonedIssues);
      // Оновлюю позиції тасок
      const updatedIssuesArray = updateIssue(issuesArray, clonedIssuesWithDraggedId);
      // console.log(updatedIssuesArray);

      // Перетворюю масив назад в об'єкт з id як ключами
      const updatedIssuesObj = {};
      updatedIssuesArray.forEach((issue) => {
        updatedIssuesObj[issue.id] = issue;
      });

      Object.keys(clonedColumns).forEach((key) => {
        if (clonedColumns[key] && Array.isArray(clonedColumns[key])) {
          // console.log(clonedColumns[key]);
          clonedColumns[key] = clonedColumns[key].filter((id) => id !== parseInt(draggedId));
          // console.log(clonedColumns[key]);
        }
      });

      // Якщо target є, додаю dragged до колонки target
      if (clonedIssuesWithTargetId) {
        const targetColumn = Object.keys(clonedColumns).find((key) => clonedColumns[key] && clonedColumns[key].includes(parseInt(targetId)));
        // console.log(targetColumn);

        if (targetColumn) {
          const targetIndex = clonedColumns[targetColumn].indexOf(parseInt(targetId));
          // const insertIndex = dropPosition === "after" ? targetIndex + 1 : targetIndex;
          clonedColumns[targetColumn].splice(targetIndex, 0, parseInt(draggedId));
        }
      }
      // Якщо таргета немає, додаємо в кінець вказаної колонки
      else if (!clonedColumns[column]) {
        clonedColumns[column] = [];
        clonedColumns[column].push(parseInt(draggedId));
      }
      // console.log(updatedIssuesObj);
      // console.log(clonedColumns);

      dispatch(
        updateColumns({
          issues: updatedIssuesObj,
          columns: clonedColumns,
        })
      );
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
        console.log(issue.id);
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
          console.log(indexOfPlaceHolder);
          console.log(clonedColumns[basket]);
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
          <div className="issue-key">Key: {issue.id}</div>
          <Card.Title className="text_title">{issue.title}</Card.Title>
          <Card.Text className="text">{issue.title}</Card.Text>
        </Card.Body>
      </Card>
    );
  };

  const DroppableColumn = ({ title, columnsIssues, onDrop, basket }) => {
    const columnRef = useRef(null);
    const issueRefs = useRef({});
    const prevBasket = useRef(basket);
    // console.log(columnsIssues);

    // Дроп на всю колонку (для зміни basket)
    const [{ isOver, canDrop, dragItem, clientOffset }, drop] = useDrop({
      accept: ItemTypes.ISSUE,
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
        dragItem: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
      }),
      hover: (item, monitor) => {
        /// щоб зявився плейсхолдер знизу на basket
        if (basket && isOver && clonedColumns[basket].indexOf("placeholder") === -1) {
          console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa");
          const updatedColumn = [...clonedColumns[basket], "placeholder"];
          const newColumns = {
            ...clonedColumns,
            [basket]: updatedColumn,
          };
          dispatch(updateColumns({ columns: newColumns }));
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
    });

    const columnClassName = `myCard  column-drop-preview ${isOver && canDrop ? "column-drop-preview-active" : ""}`;

    // Функція для збереження refs елементів
    const setIssueRef = (id, node) => {
      if (node) {
        issueRefs.current[id] = node;
      }
    };
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
              console.log(issue);

              // нижче потрібно переробити

              // columnsIssues.map((issue, index) =>
              // issue.id === "placeholder" ? (
              //   <div className="my-placeholder" key={issue.id} ref={(node) => setIssueRef(issue, node)}>
              //     <span>Переміщення в колонку "{title}"</span>
              //   </div>
              // ) : (
              return (
                <div className="div_question" key={issue.id} ref={(node) => setIssueRef(issue, node)} style={{ width: "100%" }}>
                  <DraggableIssue issue={issue} index={issue._position} basket={issue._column} issuesAllinBasket={columnsIssues} />
                </div>
              );
            })
          ) : (
            <Card.Text>Немає завдань в {title}</Card.Text>
          )}
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
