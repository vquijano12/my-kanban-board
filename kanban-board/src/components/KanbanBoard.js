import React, { useRef, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useColumns } from "../utils/useColumns";
import { useTasks } from "../utils/useTasks";
import { useModals } from "../utils/useModals";
import { useMenus } from "../utils/useMenus";
import { getColumnKey } from "../utils/columnMapping";
import Column from "./Column";
import InfoModal from "./InfoModal";
import Modal from "./Modal";
import "../styles/KanbanBoard.css";
import "../styles/DropMenu.css";

function KanbanBoard({ searchQuery }) {
  const { openMenu, toggleMenu, closeMenu } = useMenus();
  const menuRef = useRef(null);

  const { tasks, addTask, deleteTask, editTask, moveTask, setTasks } =
    useTasks();

  const {
    showInfoModal,
    handleInfoClick,
    closeInfoModal,
    handleErrorModal,
    setError,
    showErrorModal,
    errorMessage,
    showDeleteConfirmModal,
    handleDeleteCancel,
    handleDeleteConfirm,
    showDeleteConfirmation,
    deleteType,
  } = useModals();

  const {
    columns,
    newColumnName,
    setNewColumnName,
    showModal,
    handleAddColumn,
    handleConfirmColumn,
    handleColumnDelete,
    handleColumnEdit,
    setShowModal,
  } = useColumns(setTasks, setError, showDeleteConfirmation);

  const handleTaskDelete = (column, taskId) => {
    showDeleteConfirmation(() => deleteTask(column, taskId), "task");
  };

  const filteredTasks = Object.keys(tasks).reduce((result, columnKey) => {
    result[columnKey] =
      tasks[columnKey]?.filter((task) =>
        task.title.toLowerCase().includes(searchQuery)
      ) || [];
    return result;
  }, {});

  const infoMessages = [
    "Add additional columns or delete existing ones.",
    "Add tasks by typing a title and description.",
    "Drag and drop tasks between the columns.",
    "Edit task titles and descriptions.",
    "Edit column names.",
    "Lock tasks to prevent changes.",
    "Filter tasks by title.",
    "Delete tasks when finished.",
  ];

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [closeMenu]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="KanbanBoard">
        <button className="info-button" onClick={handleInfoClick}>
          ℹ️ Info
        </button>
        {showInfoModal && (
          <InfoModal messages={infoMessages} onClose={closeInfoModal} />
        )}
        {columns.map((columnKey) => (
          <Column
            key={columnKey}
            title={columnKey}
            tasks={filteredTasks[getColumnKey(columnKey)] || []}
            addTask={(task) => addTask(task, getColumnKey(columnKey))}
            deleteTask={(column, taskId) => handleTaskDelete(column, taskId)}
            editTask={(column, taskId, updatedTask) =>
              editTask(column, taskId, updatedTask)
            }
            moveTask={(taskId, sourceColumn, targetColumn) =>
              moveTask(taskId, sourceColumn, targetColumn)
            }
            onDeleteColumn={(columnKey) => handleColumnDelete(columnKey)}
            onEditColumn={(oldColumnKey, newColumnKey, newName) =>
              handleColumnEdit(oldColumnKey, newColumnKey, newName)
            }
            openMenu={openMenu}
            toggleMenu={toggleMenu}
            closeMenu={closeMenu}
            menuRef={menuRef}
          />
        ))}

        {showModal && (
          <Modal
            title="Add New Column"
            message="Column name:"
            isInputModal={true}
            inputValues={[
              {
                label: "",
                value: newColumnName,
                onChange: (e) => setNewColumnName(e.target.value),
                placeholder: "",
              },
            ]}
            onConfirm={handleConfirmColumn}
            onClose={() => setShowModal(false)}
          />
        )}

        {showErrorModal && (
          <Modal
            title=""
            message={errorMessage}
            isInputModal={false}
            onClose={handleErrorModal}
          />
        )}

        {showDeleteConfirmModal && (
          <Modal
            title="Confirm Deletion"
            message={
              deleteType === "task"
                ? "Are you sure you want to delete this task?"
                : "Are you sure you want to delete this column?"
            }
            isInputModal={false}
            onConfirm={handleDeleteConfirm}
            onClose={handleDeleteCancel}
          />
        )}

        <button className="add-column-button" onClick={handleAddColumn}>
          +
        </button>
      </div>
    </DndProvider>
  );
}

export default KanbanBoard;
