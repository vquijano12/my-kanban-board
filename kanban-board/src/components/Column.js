import React from 'react';
import Task from './Task';

function Column({ title, tasks }) {
  return (
    <div className="Column">
      <h2>{title}</h2>
      <div className="task-list">
        {tasks.map((task, index) => (
          <Task key={index} title={task.title} description={task.description} />
        ))}
      </div>
    </div>
  );
}

export default Column;