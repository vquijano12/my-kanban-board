import React, { useState } from "react";
import Task from "./Task";
import { useDrop } from "react-dnd";
import "../styles/Column.css";
import { getColumnKey } from "../utils/ColumnMapping";
import Modal from "./Modal";

function Column({ title, tasks, addTask, deleteTask, moveTask, editTask }) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [taskError, setTaskError] = useState("");

  const handleOpenTaskModal = () => setIsTaskModalOpen(true);
  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      setTaskError("Please input a task title");
      return;
    }
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      description: newTaskDescription,
      locked: false,
    };
    addTask(newTask);
    handleCloseTaskModal();
    setTaskError("");
  };

  const columnKey = getColumnKey(title);

  const [, drop] = useDrop({
    accept: "TASK",
    drop: (item) => moveTask(item.id, item.column, columnKey),
  });

  return (
    <div className="Column" ref={drop}>
      <h2>{title}</h2>
      <div className="task-list">
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            deleteTask={() => deleteTask(columnKey, task.id)}
            editTask={editTask}
            column={title}
          />
        ))}
      </div>
      {title === "To Do" && (
        <button onClick={handleOpenTaskModal}>+ Add Task</button>
      )}

      {isTaskModalOpen && (
        <Modal
          title="Add New Task"
          isInputModal
          message="Enter the task details below:"
          placeholder="Task Title"
          inputValues={[
            {
              label: "Title",
              value: newTaskTitle,
              onChange: (e) => setNewTaskTitle(e.target.value),
            },
            {
              label: "Description",
              value: newTaskDescription,
              onChange: (e) => setNewTaskDescription(e.target.value),
            },
          ]}
          onConfirm={handleAddTask}
          onClose={handleCloseTaskModal}
        />
      )}

      {taskError && (
        <Modal
          message={taskError}
          onClose={() => setTaskError("")}
        />
      )}
    </div>
  );
}

export default Column;
