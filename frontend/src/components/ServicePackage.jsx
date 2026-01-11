import React from 'react';
import './ServicePackage.css';

/**
 * ServicePackage Component
 * Displays individual service package with details and booking option
 */
const ServicePackage = ({ package: pkg, onBookService, isSelected }) => {
    const { name, price, services, validity, status } = pkg;

    // Determine status styling
    const statusClass = status === 'Available' ? 'status-available' : 'status-expired';

    return (
        <div className={`service-package ${isSelected ? 'selected' : ''}`}>
            {/* Package Header */}
            <div className="package-header">
                <h3 className="package-name">{name}</h3>
                <span className={`package-status ${statusClass}`}>
                    {status}
                </span>
            </div>

            {/* Price */}
            <div className="package-price">
                <span className="currency">₹</span>
                <span className="amount">{price.toLocaleString()}</span>
            </div>

            {/* Services Included */}
            <div className="services-section">
                <h4 className="section-title">Services Included:</h4>
                <ul className="services-list">
                    {services.map((service, index) => (
                        <li key={index} className="service-item">
                            <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {service}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Validity */}
            <div className="validity-section">
                <svg className="calendar-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="validity-text">Valid for {validity}</span>
            </div>

            {/* Book Service Button */}
            <button
                className="book-button"
                onClick={() => onBookService(pkg)}
                disabled={status === 'Expired'}
            >
                {status === 'Expired' ? 'Package Expired' : 'Book Service'}
            </button>
        </div>
    );
};

export default ServicePackage;
