import { useState } from "react";

export const useModals = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  return {
    showInfoModal,
    showErrorModal,
    errorMessage,
    handleInfoClick,
    closeInfoModal,
    handleErrorModal,
    setError,
  };
};
