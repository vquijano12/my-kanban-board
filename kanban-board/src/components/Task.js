import React from 'react';
import { useDrag } from 'react-dnd';

function Task({ task, deleteTask, column }) {
  const columnKey = {
    "To Do": "todo",
    "In Progress": "inProgress",
    "Done": "done"
  }[column];

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, column: columnKey },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <div ref={drag} className="Task" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <button onClick={deleteTask}>Delete</button>
    </div>
  );
}

export default Task;