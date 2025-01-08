import React, { useState } from "react";
import { useDrop } from "react-dnd";
import Task from "./Task";
import { getColumnKey } from "../utils/columnMapping";
import Modal from "./Modal";
import { useModals } from "../utils/useModals";
import "../styles/Column.css";

function Column({
  title,
  tasks,
  addTask,
  deleteTask,
  moveTask,
  editTask,
  onDeleteColumn,
  onEditColumn,
  openMenu,
  toggleMenu,
  closeMenu,
  menuRef,
}) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newColumnName, setNewColumnName] = useState(title);

  const isMenuOpen = openMenu === `column-${title}`;

  const columnKey = getColumnKey(title);

  const { setError, showErrorModal, errorMessage, handleErrorModal } =
    useModals();

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      setError("Please input a task title.");
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
  };

  const handleEditColumn = () => {
    if (!newColumnName.trim()) {
      setError("Column name cannot be empty.");
      return;
    }

    const newColumnKey = getColumnKey(newColumnName);
    const oldColumnKey = columnKey;

    onEditColumn(oldColumnKey, newColumnKey, newColumnName);
    setIsEditModalOpen(false);
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
      </div>
      <div className="column-menu">
        <button
          className="menu-button"
          onClick={() => toggleMenu(`column-${title}`)}
        >
          ⋮
        </button>
        {isMenuOpen && (
          <div className="menu-dropdown" ref={menuRef}>
            <button
              onClick={() => {
                setIsEditModalOpen(true);
                closeMenu();
              }}
            >
              Edit
            </button>
            <button
              onClick={() => {
                handleDeleteColumn();
                closeMenu();
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            deleteTask={() => deleteTask(columnKey, task.id)}
            editTask={editTask}
            column={title}
            openMenu={openMenu}
            toggleMenu={toggleMenu}
            closeMenu={closeMenu}
            menuRef={menuRef}
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
          title=""
          message={errorMessage}
          isInputModal={false}
          onClose={handleErrorModal}
        />
      )}
    </div>
  );
}

export default Column;
