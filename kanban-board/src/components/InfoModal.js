import React from "react";
import "../styles/InfoModal.css";

function InfoModal({ messages, onClose }) {
  return (
    <div className="info-modal-overlay" onClick={onClose}>
      <div className="info-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="info-modal-header">
          <h2>How to Use</h2>
        </div>
        <div className="info-modal-body">
          {messages.map((message, index) => (
            <div key={index} className="info-modal-message">
              <span className="info-modal-message-number">{index + 1}. </span>
              {message}
            </div>
          ))}
        </div>
        <div className="info-modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default InfoModal;
