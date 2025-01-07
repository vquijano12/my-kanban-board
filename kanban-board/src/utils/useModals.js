import { useState } from "react";

export const useModals = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
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

  const showDeleteConfirmation = (callback) => {
    setConfirmDeleteCallback(() => callback);
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
    handleInfoClick,
    closeInfoModal,
    handleErrorModal,
    setError,
    showDeleteConfirmation,
    handleDeleteCancel,
    handleDeleteConfirm,
  };
};
