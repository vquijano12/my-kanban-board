import React, { useState } from "react";
import KanbanBoard from "./components/KanbanBoard";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) =>
    setSearchQuery(e.target.value.toLowerCase());

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kanban Board</h1>
      </header>
      <div className="App-search">
        <input
          type="text"
          placeholder="Search tasks by title..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <main className="App-main">
        <KanbanBoard searchQuery={searchQuery} />
      </main>
    </div>
  );
}

export default App;
