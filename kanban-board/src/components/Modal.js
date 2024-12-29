import React from "react";
import "../styles/Modal.css";

function Modal({
  title,
  message,
  onClose,
  onConfirm,
  isInputModal = false,
  inputValues = [],
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
        </div>
        <div className="modal-body">
          <p>{message}</p>
          {isInputModal &&
            inputValues.map((input, index) => (
              <div key={index} className="modal-input-group">
                <label>{input.label}</label>
                <input
                  type="text"
                  value={input.value}
                  onChange={input.onChange}
                  placeholder={input.placeholder || ""}
                />
              </div>
            ))}
        </div>
        <div className="modal-footer">
          {isInputModal ? <button onClick={onConfirm}>Confirm</button> : null}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
