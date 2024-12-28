import React, { useState } from "react";
import Column from "./Column";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../styles/KanbanBoard.css";
import { getColumnKey } from "../utils/ColumnMapping";
import InfoModal from "./InfoModal";

function KanbanBoard() {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [showInfoModal, setShowInfoModal] = useState(false);

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
      // Check if source and target columns are the same
      if (sourceColumn === targetColumn) {
        console.warn(`Task ${taskId} is already in column ${targetColumn}`);
        return prevTasks; // No changes to state
      }

      if (!prevTasks[sourceColumn] || !prevTasks[targetColumn]) {
        console.error(
          `One of the columns ${sourceColumn} or ${targetColumn} does not exist`
        );
        return prevTasks;
      }

      // Find the task to move
      const taskToMove = prevTasks[sourceColumn].find(
        (task) => task.id === taskId
      );
      if (!taskToMove) {
        console.error(`Task ${taskId} not found in column ${sourceColumn}`);
        return prevTasks;
      }

      // Perform the move
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
    setShowInfoModal(true); // Show the info modal
  };

  const closeInfoModal = () => {
    setShowInfoModal(false); // Close the info modal
  };

  const infoMessages = [
    "Add tasks by typing a title and description.",
    "Drag and drop tasks between the columns (To Do, In Progress, Done).",
    "Edit task titles and descriptions.",
    "Lock tasks to prevent changes.",
    "Delete tasks when finished.",
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="KanbanBoard">
        <button className="info-button" onClick={handleInfoClick}>
          ℹ️ Info
        </button>
        {showInfoModal && (
          <InfoModal messages={infoMessages} onClose={closeInfoModal} />
        )}

        {["To Do", "In Progress", "Done"].map((columnName) => (
          <Column
            key={columnName}
            title={columnName}
            tasks={tasks[getColumnKey(columnName)]}
            addTask={addTask}
            deleteTask={deleteTask}
            editTask={editTask}
            moveTask={moveTask}
          />
        ))}
      </div>
    </DndProvider>
  );
}

export default KanbanBoard;
