import React, { useState } from "react";
import Task from "./Task";
import { useDrop } from "react-dnd";
import "../styles/Column.css";
import { getColumnKey } from "../utils/columnMapping";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newColumnName, setNewColumnName] = useState(title);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  const columnKey = getColumnKey(title);

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      setErrorMessage("Please input a task title.");
      setShowErrorModal(true);
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
    setErrorMessage("");
  };

  const handleEditColumn = () => {
    if (!newColumnName.trim()) {
      setErrorMessage("Column name cannot be empty.");
      setShowErrorModal(true);
      return;
    }

    const newColumnKey = getColumnKey(newColumnName);
    const oldColumnKey = columnKey;

    onEditColumn(oldColumnKey, newColumnKey, newColumnName);
    setIsEditModalOpen(false);
    setErrorMessage("");
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
      <div className="column-header">
        <h2>{title}</h2>
        <div className="column-menu">
          <button
            className="menu-button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            ⋮
          </button>
          {isMenuOpen && (
            <div className="menu-dropdown">
              <button
                onClick={() => {
                  setIsEditModalOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                Edit
              </button>
              <button
                onClick={() => {
                  handleDeleteColumn();
                  setIsMenuOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

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
        {title && (
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

      {showErrorModal && (
        <Modal
          title="Error"
          message={errorMessage}
          isInputModal={false}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
}

export default Column;
