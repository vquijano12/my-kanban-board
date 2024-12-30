import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import "../styles/Task.css";
import { getColumnKey } from "../utils/ColumnMapping";
import Modal from "./Modal";

function Task({ task, deleteTask, column, editTask }) {
  const columnKey = getColumnKey(column);

  // Store the editing state and original task values
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [originalTitle, setOriginalTitle] = useState(task.title);
  const [originalDescription, setOriginalDescription] = useState(
    task.description
  );
  const [errorMessage, setErrorMessage] = useState("");

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id, column: columnKey },
    canDrag: !isEditing && !task.locked,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Handle saving the edited task
  const handleEdit = () => {
    if (!editedTitle.trim()) {
      setErrorMessage("Task title cannot be empty");
      return;
    }
    editTask(columnKey, task.id, {
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  // Handle canceling the edit, revert to original values
  const handleCancelEdit = () => {
    setEditedTitle(originalTitle); // Revert to original title
    setEditedDescription(originalDescription); // Revert to original description
    setIsEditing(false); // Exit editing mode
  };

  const toggleLock = () => {
    editTask(columnKey, task.id, { locked: !task.locked });
  };

  useEffect(() => {
    // Update the original title and description whenever the task data changes
    setOriginalTitle(task.title);
    setOriginalDescription(task.description);
  }, [task]);

  return (
    <div ref={drag} className="Task" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <h3>{task.title}</h3>
      <button onClick={() => setIsDescriptionModalOpen(true)}>View</button>
      <button onClick={() => setIsEditing(true)} disabled={task.locked}>
        Edit
      </button>
      <button onClick={deleteTask} disabled={task.locked}>
        Delete
      </button>
      <button onClick={toggleLock}>{task.locked ? "Unlock" : "Lock"}</button>
      {isDescriptionModalOpen && (
        <Modal
          title={`Task: ${task.title}`}
          message={task.description || "No description"}
          onClose={() => setIsDescriptionModalOpen(false)}
          onConfirm={() => setIsDescriptionModalOpen(false)}
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

      {errorMessage && (
        <Modal message={errorMessage} onClose={() => setErrorMessage("")} />
      )}
    </div>
  );
}

export default Task;
