import React, { useState } from 'react';
import Column from './Column';

function KanbanBoard() {
  const [tasks, setTasks] = useState({
    todo: [
      { id: 1, title: 'Task 1', description: 'Description for Task 1' },
      { id: 2, title: 'Task 2', description: 'Description for Task 2' },
    ],
    inProgress: [
      { id: 3, title: 'Task 3', description: 'Description for Task 3' },
    ],
    done: [
      { id: 4, title: 'Task 4', description: 'Description for Task 4' },
    ],
  });

  return (
    <div className="KanbanBoard">
      <Column title="To Do" tasks={tasks.todo} />
      <Column title="In Progress" tasks={tasks.inProgress} />
      <Column title="Done" tasks={tasks.done} />
    </div>
  );
}

export default KanbanBoard;