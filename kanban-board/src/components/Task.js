import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { useModals } from "../utils/useModals";
import { getColumnKey } from "../utils/columnMapping";
import Modal from "./Modal";
import "../styles/Task.css";

function Task({
  task,
  deleteTask,
  column,
  editTask,
  openMenu,
  toggleMenu,
  closeMenu,
  menuRef,
}) {
  const columnKey = getColumnKey(column);

  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id, column: columnKey },
    canDrag: !isEditing && !task.locked && !isDescriptionModalOpen,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const { setError, showErrorModal, errorMessage, handleErrorModal } =
    useModals();

  const handleEdit = () => {
    if (!editedTitle.trim()) {
      setError("Task title cannot be empty.");
      return;
    }
    editTask(columnKey, task.id, {
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setIsEditing(false);
  };

  const toggleLock = () => {
    editTask(columnKey, task.id, { locked: !task.locked });
  };

  useEffect(() => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
  }, [task]);

  const isMenuOpen = openMenu === `task-${task.id}`;

  return (
    <div ref={drag} className="Task" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div className="task-content">
        <h3>{task.title}</h3>
      </div>
      <div className="task-menu">
        <button
          className="menu-button"
          onClick={() => toggleMenu(`task-${task.id}`)}
        >
          ⋮
        </button>
        {isMenuOpen && (
          <div className="menu-dropdown" ref={menuRef}>
            <button
              onClick={() => {
                setIsDescriptionModalOpen(true);
                closeMenu();
              }}
            >
              View
            </button>
            <button
              onClick={() => {
                setIsEditing(true);
                closeMenu();
              }}
              disabled={task.locked}
            >
              Edit
            </button>

            <button
              onClick={() => {
                deleteTask();
                closeMenu();
              }}
              disabled={task.locked}
            >
              Delete
            </button>

            <button
              onClick={() => {
                toggleLock();
                closeMenu();
              }}
            >
              {task.locked ? "Unlock" : "Lock"}
            </button>
          </div>
        )}
      </div>

      {isDescriptionModalOpen && (
        <Modal
          title={`Task: ${task.title}`}
          message={task.description || "No description"}
          onClose={() => {
            setIsDescriptionModalOpen(false);
          }}
          onConfirm={() => {
            setIsDescriptionModalOpen(false);
          }}
        />
      )}

      {isEditing && (
        <Modal
          title="Edit Task"
          message=""
          onClose={handleCancelEdit}
          onConfirm={handleEdit}
          isInputModal={true}
          inputValues={[
            {
              label: "Title",
              value: editedTitle,
              onChange: (e) => setEditedTitle(e.target.value),
              placeholder: "",
            },
            {
              label: "Description",
              value: editedDescription,
              onChange: (e) => setEditedDescription(e.target.value),
              placeholder: "",
            },
          ]}
        />
      )}

      {showErrorModal && (
        <Modal message={errorMessage} onClose={handleErrorModal} />
      )}
    </div>
  );
}

export default Task;
