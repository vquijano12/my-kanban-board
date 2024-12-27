import React, { useState } from "react";
import { useDrag } from "react-dnd";
import "../styles/Task.css";

function Task({ task, deleteTask, column, editTask }) {
  const columnKey = {
    "To Do": "todo",
    "In Progress": "inProgress",
    Done: "done",
  }[column];

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id, column: columnKey },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleEdit = () => {
    editTask(columnKey, task.id, {
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const toggleLock = () => {
    editTask(columnKey, task.id, { locked: !task.locked });
  };

  return (
    <div ref={drag} className="Task" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <input
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
          <button onClick={handleEdit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <button onClick={() => setIsEditing(true)} disabled={task.locked}>
            Edit
          </button>
          <button onClick={deleteTask} disabled={task.locked}>
            Delete
          </button>
          <button onClick={toggleLock}>
            {task.locked ? "Unlock" : "Lock"}
          </button>
        </>
      )}
    </div>
  );
}

export default Task;
