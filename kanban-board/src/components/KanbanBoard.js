import React, { useState } from "react";
import Column from "./Column";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function KanbanBoard() {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="KanbanBoard">
        <Column
          title="To Do"
          tasks={tasks.todo}
          addTask={addTask}
          deleteTask={deleteTask}
          editTask={editTask}
          moveTask={moveTask}
        />
        <Column
          title="In Progress"
          tasks={tasks.inProgress}
          deleteTask={deleteTask}
          editTask={editTask}
          moveTask={moveTask}
        />
        <Column
          title="Done"
          tasks={tasks.done}
          deleteTask={deleteTask}
          editTask={editTask}
          moveTask={moveTask}
        />
      </div>
    </DndProvider>
  );
}

export default KanbanBoard;
