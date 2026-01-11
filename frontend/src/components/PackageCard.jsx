import React from 'react';

const PackageCard = ({ pkg, onBook }) => {
  const name = pkg.packageName || pkg.name;
  const services = Array.isArray(pkg.servicesIncluded)
    ? pkg.servicesIncluded
    : (pkg.servicesIncluded ? pkg.servicesIncluded.split(',') : []);

  const isAvailable = pkg.status === 'Available';

  return (
    <div className={`package-card ${!isAvailable ? 'expired' : ''}`}>
      <div className="card-image-wrapper">
        <img src={pkg.imageUrl || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800'} alt={name} className="pkg-image" />
        {!isAvailable && <div className="unavailable-banner">Currently Full</div>}
      </div>

      <div className="card-content">
        <div className="content-top">
          <span className="price-label">Starts at</span>
          <h3 className="pkg-name">{name}</h3>
          <div className="pkg-price">{pkg.price}</div>
        </div>

        <div className="pkg-services">
          <p className="services-title">Service Details:</p>
          <ul>
            {services.slice(0, 4).map((service, index) => (
              <li key={index}>
                <span className="check-icon">✓</span> {service.trim()}
              </li>
            ))}
            {services.length > 4 && <li className="more-info">+ {services.length - 4} more services</li>}
          </ul>
        </div>

        <div className="card-footer">
          <div className="validity-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            {pkg.validity}
          </div>
          <button
            className="book-now-btn"
            onClick={() => onBook(pkg)}
            disabled={!isAvailable}
          >
            {isAvailable ? 'Book Appointment' : 'Sold Out'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .package-card {
          background: #ffffff;
          border-radius: var(--radius-md);
          border: 1px solid #e2e8f0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          height: 100%;
        }
        .package-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-premium);
          border-color: var(--accent);
        }
        .package-card.expired { opacity: 0.7; }
        
        .card-image-wrapper { height: 180px; position: relative; overflow: hidden; }
        .pkg-image { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
        .package-card:hover .pkg-image { transform: scale(1.05); }
        .unavailable-banner { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.6); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; text-transform: uppercase; }

        .card-content { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
        
        .price-label { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
        .pkg-name { font-size: 1.3rem; color: var(--primary); margin: 0.2rem 0 0.5rem; }
        .pkg-price { font-size: 1.6rem; font-weight: 800; color: var(--accent); margin-bottom: 1.2rem; }

        .pkg-services { flex: 1; margin-bottom: 1.5rem; }
        .services-title { font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.8rem; text-transform: uppercase; }
        .pkg-services ul { list-style: none; padding: 0; }
        .pkg-services li { font-size: 0.95rem; color: var(--text-main); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.6rem; }
        .check-icon { color: var(--success); font-weight: bold; }
        .more-info { font-style: italic; color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.4rem; }

        .card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid #f1f5f9; }
        .validity-badge { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; color: var(--text-secondary); background: #f8fafc; padding: 0.3rem 0.6rem; border-radius: 6px; }
        
        .book-now-btn { 
          background: var(--primary); color: white; border: none; 
          padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 600; 
          cursor: pointer; transition: 0.2s;
        }
        .book-now-btn:hover:not(:disabled) { background: var(--accent); }
        .book-now-btn:disabled { background: #cbd5e1; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default PackageCard;
