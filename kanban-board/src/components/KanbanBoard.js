import React, { useRef, useState } from "react";
import Column from "./Column";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../styles/KanbanBoard.css";
import { getColumnKey } from "../utils/ColumnMapping";
import InfoModal from "./InfoModal";
import Modal from "./Modal";

function KanbanBoard({ searchQuery }) {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  const [columns, setColumns] = useState(["To Do", "In Progress", "Done"]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const boardRef = useRef(null);

  const handleScroll = (event, offsetY) => {
    const container = boardRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScrollLeft = scrollWidth - clientWidth;

    const buffer = 50;

    if (offsetY < buffer && scrollLeft > 0) {
      container.scrollLeft -= 15;
    } else if (
      offsetY > window.innerHeight - buffer &&
      scrollLeft < maxScrollLeft
    ) {
      container.scrollLeft += 15;
    }
  };

  const onDragOver = (event) => {
    event.preventDefault();
    const { clientY } = event;
    handleScroll(event, clientY);
  };

  const filteredTasks = Object.keys(tasks).reduce((result, columnKey) => {
    result[columnKey] =
      tasks[columnKey]?.filter((task) =>
        task.title.toLowerCase().includes(searchQuery)
      ) || [];
    return result;
  }, {});

  const addTask = (task) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      todo: [...prevTasks.todo, task],
    }));
  };

  const deleteTask = (column, taskId) => {
    setTasks((prevTasks) => {
      if (!prevTasks[column]) {
        console.error(`Column ${column} does not exist`);
        return prevTasks;
      }
      return {
        ...prevTasks,
        [column]: prevTasks[column].filter((task) => task.id !== taskId),
      };
    });
  };

  const editTask = (column, taskId, updatedTask) => {
    setTasks((prevTasks) => {
      if (!prevTasks[column]) {
        console.error(`Column ${column} does not exist`);
        return prevTasks;
      }
      return {
        ...prevTasks,
        [column]: prevTasks[column].map((task) =>
          task.id === taskId ? { ...task, ...updatedTask } : task
        ),
      };
    });
  };

  const moveTask = (taskId, sourceColumn, targetColumn) => {
    setTasks((prevTasks) => {
      if (sourceColumn === targetColumn) {
        console.warn(`Task ${taskId} is already in column ${targetColumn}`);
        return prevTasks;
      }

      if (!prevTasks[sourceColumn] || !prevTasks[targetColumn]) {
        console.error(
          `One of the columns ${sourceColumn} or ${targetColumn} does not exist`
        );
        return prevTasks;
      }

      const taskToMove = prevTasks[sourceColumn].find(
        (task) => task.id === taskId
      );
      if (!taskToMove) {
        console.error(`Task ${taskId} not found in column ${sourceColumn}`);
        return prevTasks;
      }

      const sourceTasks = prevTasks[sourceColumn].filter(
        (task) => task.id !== taskId
      );
      const targetTasks = [...prevTasks[targetColumn], taskToMove];

      return {
        ...prevTasks,
        [sourceColumn]: sourceTasks,
        [targetColumn]: targetTasks,
      };
    });
  };

  const handleInfoClick = () => {
    setShowInfoModal(true);
  };

  const closeInfoModal = () => {
    setShowInfoModal(false);
  };

  const infoMessages = [
    "Add tasks by typing a title and description.",
    "Drag and drop tasks between the columns (To Do, In Progress, Done).",
    "Edit task titles and descriptions.",
    "Lock tasks to prevent changes.",
    "Delete tasks when finished.",
  ];

  const handleAddColumn = () => {
    setShowModal(true);
  };

  const handleConfirmColumn = () => {
    const columnKey = getColumnKey(newColumnName);

    if (newColumnName.trim() && !columns.includes(newColumnName)) {
      setColumns((prevColumns) => [...prevColumns, newColumnName]);

      setTasks((prevTasks) => ({
        ...prevTasks,
        [columnKey]: [],
      }));

      setNewColumnName("");
      setShowModal(false);
      setErrorMessage("");
    } else {
      setErrorMessage("Column name is empty or already exists!");
      setShowErrorModal(true);
    }
  };

  const handleColumnEdit = (columnKey, newName) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        getColumnKey(column) === columnKey ? newName : column
      )
    );
  };

  const handleColumnDelete = (columnKey) => {
    setColumns((prevColumns) =>
      prevColumns.filter((column) => getColumnKey(column) !== columnKey)
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="KanbanBoard" onDragOver={onDragOver} ref={boardRef}>
        <button className="info-button" onClick={handleInfoClick}>
          ℹ️ Info
        </button>
        {showInfoModal && (
          <InfoModal messages={infoMessages} onClose={closeInfoModal} />
        )}

        {columns.map((columnName) => (
          <Column
            key={columnName}
            title={columnName}
            tasks={filteredTasks[getColumnKey(columnName)] || []}
            addTask={addTask}
            deleteTask={deleteTask}
            editTask={editTask}
            moveTask={moveTask}
            onDeleteColumn={handleColumnDelete}
            onEditColumn={handleColumnEdit}
          />
        ))}

        {showModal && (
          <Modal
            title="Add New Column"
            message="New column name:"
            isInputModal={true}
            inputValues={[
              {
                label: "",
                value: newColumnName,
                onChange: (e) => setNewColumnName(e.target.value),
                placeholder: "",
              },
            ]}
            onConfirm={handleConfirmColumn}
            onClose={() => setShowModal(false)}
          />
        )}

        {showErrorModal && (
          <Modal
            title="Error"
            message={errorMessage}
            isInputModal={false}
            onClose={() => setShowErrorModal(false)}
          />
        )}

        <button className="add-column-button" onClick={handleAddColumn}>
          +
        </button>
      </div>
    </DndProvider>
  );
}

export default KanbanBoard;
