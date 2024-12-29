import React, { useState } from "react";
import "../styles/Modal.css";

function Modal({
  title,
  message,
  onClose,
  isInputModal,
  onSubmitInput,
  inputPlaceholder,
}) {
  const [inputValue, setInputValue] = useState("");

  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      onSubmitInput(inputValue.trim());
      onClose();
    } else {
      alert("Input cannot be empty.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
        </div>
        <div className="modal-body">
          {isInputModal ? (
            <input
              type="text"
              placeholder={inputPlaceholder || "Enter value"}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          ) : (
            <p>{message}</p>
          )}
        </div>
        <div className="modal-footer">
          {isInputModal ? (
            <>
              <button onClick={handleInputSubmit}>Submit</button>
              <button onClick={onClose}>Cancel</button>
            </>
          ) : (
            <button onClick={onClose}>Close</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
