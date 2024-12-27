import React, { useState } from "react";
import Task from "./Task";
import { useDrop } from "react-dnd";

function Column({ title, tasks, addTask, deleteTask, moveTask, editTask }) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  const handleAddTask = () => {
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      description: newTaskDescription,
      locked: false,
    };
    addTask(newTask);
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  const columnKey = {
    "To Do": "todo",
    "In Progress": "inProgress",
    Done: "done",
  }[title];

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
        <>
          <input
            type="text"
            placeholder="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Task Description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          />
          <button onClick={handleAddTask}>Add Task</button>
        </>
      )}
    </div>
  );
}

export default Column;
