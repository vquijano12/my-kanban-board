import React from 'react';

function Task({ title, description }) {
  return (
    <div className="Task">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default Task;