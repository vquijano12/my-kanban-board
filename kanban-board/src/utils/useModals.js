import { useState } from "react";

export const useModals = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteType, setDeleteType] = useState(null); // Tracks type of deletion
  const [confirmDeleteCallback, setConfirmDeleteCallback] = useState(null);

  const handleInfoClick = () => setShowInfoModal(true);

  const closeInfoModal = () => setShowInfoModal(false);

  const handleErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const setError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const showDeleteConfirmation = (callback, type = "column") => {
    setConfirmDeleteCallback(() => callback);
    setDeleteType(type); // Tracks whether it's "task" or "column"
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteCancel = () => setShowDeleteConfirmModal(false);

  const handleDeleteConfirm = () => {
    if (confirmDeleteCallback) {
      confirmDeleteCallback();
    }
    setShowDeleteConfirmModal(false);
  };

  return {
    showInfoModal,
    showErrorModal,
    errorMessage,
    showDeleteConfirmModal,
    deleteType, // Expose deleteType for conditional rendering
    handleInfoClick,
    closeInfoModal,
    handleErrorModal,
    setError,
    showDeleteConfirmation,
    handleDeleteCancel,
    handleDeleteConfirm,
  };
};
