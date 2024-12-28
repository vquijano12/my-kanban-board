import React from "react";
import "../styles/InfoModal.css";

function InfoModal({ messages, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>How to Use</h2>
        </div>
        <div className="modal-body">
          {messages.map((message, index) => (
            <div key={index} className="info-message">
              <span className="message-number">{index + 1}. </span>
              {message}
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default InfoModal;
