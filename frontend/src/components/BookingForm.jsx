import React, { useState } from 'react';

const BookingForm = ({ selectedPackage, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    vehicleType: '',
    vehicleName: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      packageName: selectedPackage.packageName || selectedPackage.name
    });
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <div className="title-area">
        <h2>Book Appointment</h2>
        <p className="subtitle">Selected: <strong>{selectedPackage.packageName || selectedPackage.name}</strong></p>
      </div>

      <div className="form-group">
        <label htmlFor="customerName">Full Name</label>
        <input
          type="text"
          id="customerName"
          name="customerName"
          placeholder="e.g. Rahul Sharma"
          required
          value={formData.customerName}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="vehicleType">Vehicle Category</label>
          <input
            type="text"
            id="vehicleType"
            name="vehicleType"
            placeholder="e.g. Sedan / SUV"
            required
            value={formData.vehicleType}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="vehicleName">Model Name</label>
          <input
            type="text"
            id="vehicleName"
            name="vehicleName"
            placeholder="e.g. Tata Harrier"
            required
            value={formData.vehicleName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Special Requests</label>
        <textarea
          id="notes"
          name="notes"
          placeholder="Any specific issues we should know about?"
          rows="3"
          value={formData.notes}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-light" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Confirming...' : 'Confirm My Appointment'}
        </button>
      </div>

      <style jsx>{`
        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          color: var(--primary);
        }

        .title-area h2 { font-size: 1.5rem; margin-bottom: 0.2rem; }
        .subtitle { color: var(--text-secondary); font-size: 0.95rem; }
        .subtitle strong { color: var(--accent); }

        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        label {
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        input, textarea {
          padding: 0.9rem;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          font-family: inherit;
          background: #f8fafc;
          transition: 0.3s;
        }

        input:focus, textarea:focus {
          outline: none;
          background: #fff;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
        }

        .form-actions {
          display: flex;
          gap: 1.5rem;
          margin-top: 1.5rem;
          align-items: center;
        }

        .btn-light { border: none; background: #eaeff5; color: var(--primary); padding: 0.9rem 1.5rem; border-radius: 10px; font-weight: 600; cursor: pointer; }
        .btn-primary { flex: 1; padding: 1rem; border-radius: 12px; }

        @media (max-width: 500px) {
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </form>
  );
};

export default BookingForm;
