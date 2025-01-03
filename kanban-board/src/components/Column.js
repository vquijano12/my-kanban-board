import React, { useState } from "react";
import Task from "./Task";
import { useDrop } from "react-dnd";
import "../styles/Column.css";
import { getColumnKey } from "../utils/ColumnMapping";
import Modal from "./Modal";

function Column({
  title,
  tasks,
  addTask,
  deleteTask,
  moveTask,
  editTask,
  onDeleteColumn,
  onEditColumn,
}) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [taskError, setTaskError] = useState("");
  const [newColumnName, setNewColumnName] = useState(title);

  const columnKey = getColumnKey(title);

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

  const handleEditColumn = () => {
    if (newColumnName.trim()) {
      onEditColumn(columnKey, newColumnName);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteColumn = () => {
    onDeleteColumn(columnKey);
  };

  const [, drop] = useDrop({
    accept: "TASK",
    drop: (item) => moveTask(item.id, item.column, columnKey),
  });

  return (
    <div className="Column" ref={drop}>
      <div className="column-actions">
        <button onClick={() => setIsEditModalOpen(true)}>Edit</button>
        <button onClick={handleDeleteColumn}>Delete</button>
      </div>
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

      <div className="add-task-button">
        {title === "To Do" && (
          <button onClick={() => setIsTaskModalOpen(true)}>+ Add Task</button>
        )}
      </div>

      {isTaskModalOpen && (
        <Modal
          title="Add New Task"
          isInputModal
          message="Enter the task details below:"
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

      {isEditModalOpen && (
        <Modal
          title="Edit"
          isInputModal
          message="Enter the new column name:"
          inputValues={[
            {
              label: "",
              value: newColumnName,
              onChange: (e) => setNewColumnName(e.target.value),
            },
          ]}
          onConfirm={handleEditColumn}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {taskError && (
        <Modal message={taskError} onClose={() => setTaskError("")} />
      )}
    </div>
  );
}

export default Column;
