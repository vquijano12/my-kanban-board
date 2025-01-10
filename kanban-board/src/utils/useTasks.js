import { useState } from "react";

export const useTasks = (showDeleteConfirmation) => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  const addTask = (task, columnKey) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [columnKey]: [...(prevTasks[columnKey] || []), task],
    }));
  };

  const deleteTask = (column, taskId) => {
    showDeleteConfirmation(() => {
      setTasks((prevTasks) => ({
        ...prevTasks,
        [column]: prevTasks[column].filter((task) => task.id !== taskId),
      }));
    }, "task");
  };

  const editTask = (column, taskId, updatedTask) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [column]: prevTasks[column].map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      ),
    }));
  };

  const moveTask = (taskId, sourceColumn, targetColumn) => {
    setTasks((prevTasks) => {
      if (!prevTasks[targetColumn]) {
        prevTasks[targetColumn] = [];
      }

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

  return {
    tasks,
    setTasks,
    addTask,
    deleteTask,
    editTask,
    moveTask,
  };
};
