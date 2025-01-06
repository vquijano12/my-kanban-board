import { useState } from "react";
import { getColumnKey } from "./columnMapping";

export const useColumns = (setTasks, setError) => {
  const [columns, setColumns] = useState(["To Do", "In Progress", "Done"]);
  const [newColumnName, setNewColumnName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleAddColumn = () => setShowModal(true);

  const handleConfirmColumn = () => {
    if (newColumnName.trim() && !columns.includes(newColumnName)) {
      setColumns((prev) => [...prev, newColumnName]);
      setNewColumnName("");
      setShowModal(false);
    } else {
      setError("Column name is empty or already exists!");
    }
  };

  const handleColumnDelete = (columnKey) => {
    setColumns((prev) =>
      prev.filter((column) => getColumnKey(column) !== columnKey)
    );
  };

  const handleColumnEdit = (oldColumnKey, newColumnKey, newName) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        getColumnKey(column) === oldColumnKey ? newName : column
      )
    );

    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      if (prevTasks[oldColumnKey]) {
        updatedTasks[newColumnKey] = updatedTasks[oldColumnKey];
        delete updatedTasks[oldColumnKey];
      }
      return updatedTasks;
    });
  };

  return {
    columns,
    newColumnName,
    setNewColumnName,
    showModal,
    handleAddColumn,
    handleConfirmColumn,
    handleColumnDelete,
    handleColumnEdit,
    setShowModal,
  };
};
