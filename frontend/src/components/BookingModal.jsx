import React from 'react';

const BookingModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass" onClick={e => e.stopPropagation()}>
                <button className="close-modal" onClick={onClose}>×</button>
                {children}
            </div>

            <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          width: 100%;
          max-width: 500px;
          padding: 2.5rem;
          border-radius: 16px;
          position: relative;
          box-shadow: var(--shadow-lg);
          background: white;
          animation: slideUp 0.3s ease;
        }

        .close-modal {
          position: absolute;
          top: 1rem;
          right: 1.5rem;
          font-size: 2rem;
          background: none;
          color: var(--text-secondary);
          padding: 0.5rem;
        }

        .close-modal:hover {
          color: var(--text-primary);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default BookingModal;
