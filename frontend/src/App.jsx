import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { API_URL } from '../config';
import PackageList from './components/PackageList';
import BookingForm from './components/BookingForm';
import AdminDashboard from './pages/AdminDashboard';
import BookingModal from './components/BookingModal';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const { user, logout, loading: authLoading } = useAuth();
  const [view, setView] = useState('home');
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authView, setAuthView] = useState('login');

  const fetchPackages = async () => {
    try {
      setPackagesLoading(true);
      const response = await fetch(`${API_URL}/api/packages`);
      const data = await response.json();
      if (data.success) {
        setPackages(data.packages);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setPackagesLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handlePackageUpdate = (updatedPkg) => {
    setPackages(prev => prev.map(p => {
      const pid = p._id || p.id;
      const upid = updatedPkg._id || updatedPkg.id;
      return pid === upid ? updatedPkg : p;
    }));
  };

  const handlePackageDelete = (id) => {
    setPackages(prev => prev.filter(p => (p._id || p.id) !== id));
  };

  const handlePackageAdd = (newPkg) => {
    setPackages(prev => [...prev, newPkg]);
  };

  const handleBookPackage = (pkg) => {
    setSelectedPackage(pkg);
    setBookingResult(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
    setBookingResult(null);
  };

  const handleBookingSubmit = async (bookingData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/bookService`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...bookingData,
          packageName: selectedPackage.packageName || selectedPackage.name
        }),
      });

      const data = await response.json();
      if (data.success) {
        setBookingResult(data);
      } else {
        alert(data.message || 'Booking failed');
      }
    } catch (error) {
      alert('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="loading-screen">Preparing your experience...</div>;

  if (!user) {
    return (
      <div className="auth-outer">
        <div className="auth-brand">
          <h1>🚗 Keep Hubli <span className="blue">Cars Service</span></h1>
        </div>
        {authView === 'login' ? (
          <LoginPage onSwitch={() => setAuthView('register')} />
        ) : (
          <RegisterPage onSwitch={() => setAuthView('login')} />
        )}
        <style jsx>{`
          .auth-outer { 
            min-height: 100vh; 
            background: #f8fafc; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            padding: 2rem;
          }
          .auth-brand { margin-bottom: 2rem; text-align: center; }
          .auth-brand h1 { font-size: 2rem; color: #0f172a; }
          .auth-brand .blue { color: #3b82f6; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header glass">
        <div className="container">
          <div className="header-nav">
            <div className="header-content" onClick={() => setView('home')} style={{ cursor: 'pointer' }}>
              <h1 className="logo-text">🚗 Keep Hubli <span className="accent">Cars Service</span></h1>
            </div>
            <div className="user-nav">
              {user.role === 'admin' && (
                <button
                  className={`nav-link ${view === 'admin' ? 'active' : ''}`}
                  onClick={() => setView(view === 'admin' ? 'home' : 'admin')}
                >
                  {view === 'admin' ? 'Customer View' : 'Admin Console'}
                </button>
              )}
              <div className="user-info">
                <span className="user-greeting">Hi, <strong>{user.name}</strong></span>
                <button className="logout-btn" onClick={logout} title="Logout">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container animate-fade-in">
        {view === 'admin' && user.role === 'admin' ? (
          <AdminDashboard
            packages={packages}
            onUpdate={handlePackageUpdate}
            onDelete={handlePackageDelete}
            onAdd={handlePackageAdd}
          />
        ) : (
          <>
            <section className="decenent-hero">
              <div className="hero-text-side">
                <span className="badge">Welcome to Hubli's Trusted Care</span>
                <h2>Expert Service for <br />Your <span className="hubli-text">Favorite Cars</span></h2>
                <p>Specialized care for BMW, Toyota Fortuner, Mahindra Thar, Hyundai Creta, and more. Quality maintenance that keeps you moving.</p>
                <div className="hero-actions">
                  <button className="btn-primary" onClick={() => document.getElementById('packages-section').scrollIntoView({ behavior: 'smooth' })}>Explore Services</button>
                  <div className="hero-stats-lite">
                    <span><strong>10k+</strong> Happy Clients</span>
                    <span><strong>★ 4.9</strong> Rated Service</span>
                  </div>
                </div>
              </div>
              <div className="hero-image-side">
                <img src="https://images.unsplash.com/photo-1555214144-8488e34892c9?auto=format&fit=crop&q=80&w=1200" alt="BMW M-Performance" className="main-car-img" />
              </div>
            </section>

            <div id="packages-section" className="section-title">
              <h3>Our Service Packages</h3>
              <p>Tailored solutions for your vehicle's specific needs</p>
            </div>

            {packagesLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Syncing latest service rates...</span>
              </div>
            ) : (
              <PackageList
                packages={packages}
                onBookPackage={handleBookPackage}
              />
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col" style={{ maxWidth: '400px' }}>
              <h2 className="logo-text">🚗 Keep Hubli <span className="accent">Cars Service</span></h2>
              <p>Providing top-tier automotive maintenance and protection services in Hubli-Dharwad. We specialize in SUV and family car excellence.</p>
            </div>
            <div className="footer-col">
              <h4>Direct Support</h4>
              <p>📍 Gokul Road, Hubli</p>
              <p>📞 +91 98765 43210</p>
              <p>✉️ service@keephublicars.com</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Keep Hubli Cars Service. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <BookingModal isOpen={isModalOpen} onClose={closeModal}>
        {!bookingResult ? (
          <BookingForm
            selectedPackage={selectedPackage}
            onSubmit={handleBookingSubmit}
            onCancel={closeModal}
            loading={loading}
          />
        ) : (
          <div className="booking-success-view">
            <div className="success-icon">✓</div>
            <h2>Booking Successful!</h2>
            <p>Your appointment has been confirmed for the <strong>{selectedPackage?.packageName || selectedPackage?.name}</strong>.</p>

            <div className="confirmation-grid">
              <div className="conf-item">
                <small>Queue Number</small>
                <strong>{bookingResult.booking?.queueNumber || 'N/A'}</strong>
              </div>
              <div className="conf-item">
                <small>Est. Service Time</small>
                <strong>{bookingResult.booking?.serviceTime || '9:30 AM'}</strong>
              </div>
            </div>

            <div className="location-info">
              <strong>Service Location:</strong>
              <p>{bookingResult.booking?.address || '123 Service Hub, Gokul Road, Hubli'}</p>
            </div>

            <button className="btn-primary w-full mt-2" onClick={closeModal}>Got it, thanks!</button>
          </div>
        )}
      </BookingModal>

      <style jsx>{`
        .app-container { min-height: 100vh; display: flex; flex-direction: column; }
        
        .app-header { 
          position: sticky; top: 0; z-index: 1000;
          padding: 1rem 0; background: var(--glass) !important;
          backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .header-nav { display: flex; justify-content: space-between; align-items: center; }
        .logo-text { font-size: 1.4rem; color: var(--primary); margin: 0; }
        .accent { color: var(--accent); }
        
        .user-nav { display: flex; align-items: center; gap: 1.5rem; }
        .nav-link { 
          background: var(--accent-soft); color: var(--accent-dark); border: none;
          padding: 0.6rem 1.2rem; border-radius: 10px; font-weight: 600; cursor: pointer; transition: 0.3s;
        }
        .nav-link:hover { background: var(--accent); color: white; }
        .nav-link.active { background: var(--primary); color: white; }
        
        .user-info { display: flex; align-items: center; gap: 0.8rem; padding-left: 1.5rem; border-left: 1px solid #e2e8f0; }
        .logout-btn { background: #fef2f2; color: #ef4444; border: none; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
        .logout-btn:hover { background: #ef4444; color: white; }

        .decenent-hero { 
          display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;
          padding: 5rem 0; margin-bottom: 2rem;
        }
        .badge { display: inline-block; padding: 0.4rem 1rem; background: var(--accent-soft); color: var(--accent); border-radius: 50px; font-size: 0.85rem; font-weight: 700; margin-bottom: 1.5rem; }
        .decenent-hero h2 { font-size: 3.2rem; line-height: 1.2; color: var(--primary); margin-bottom: 1.5rem; }
        .hubli-text { color: var(--accent); position: relative; }
        .decenent-hero p { font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 2.5rem; max-width: 500px; }
        
        .hero-actions { display: flex; align-items: center; gap: 2rem; }
        .hero-stats-lite { display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.9rem; color: var(--text-secondary); }
        .hero-stats-lite strong { color: var(--primary); }

        .hero-image-side { position: relative; }
        .main-car-img { width: 100%; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); transition: 0.5s; object-fit: cover; height: 400px; }
        .main-car-img:hover { transform: scale(1.02); }

        .section-title { text-align: center; margin-bottom: 4rem; margin-top: 2rem; }
        .section-title h3 { font-size: 2.2rem; margin-bottom: 0.5rem; }
        .section-title p { color: var(--text-secondary); }

        .app-footer { background: #fff; padding: 5rem 0 2rem; margin-top: auto; border-top: 1px solid #e2e8f0; }
        .footer-grid { display: flex; justify-content: space-between; gap: 4rem; padding-bottom: 3rem; }
        .footer-col h4 { margin-bottom: 1.5rem; color: var(--primary); }
        .footer-col p { color: var(--text-secondary); margin-bottom: 0.5rem; }
        .footer-bottom { border-top: 1px solid #f1f5f9; padding-top: 2rem; text-align: center; color: var(--text-secondary); font-size: 0.9rem; }

        .booking-success-view { text-align: center; padding: 1rem; }
        .success-icon { font-size: 3.5rem; color: #10b981; background: #ecfdf5; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; border-radius: 50%; margin: 0 auto 1.5rem; }
        .confirmation-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 2rem 0; }
        .conf-item { background: #f8fafc; padding: 1.2rem; border-radius: 15px; border: 1px solid #e2e8f0; }
        .conf-item small { display: block; color: var(--text-secondary); margin-bottom: 0.4rem; font-size: 0.8rem; text-transform: uppercase; }
        .conf-item strong { font-size: 1.4rem; color: var(--primary); }
        .location-info { text-align: left; background: #eff6ff; padding: 1.2rem; border-radius: 12px; margin-bottom: 2rem; border-left: 4px solid var(--accent); }
        
        .w-full { width: 100%; }
        .mt-2 { margin-top: 1rem; }

        @media (max-width: 968px) {
          .decenent-hero { grid-template-columns: 1fr; text-align: center; padding: 3rem 0; }
          .decenent-hero h2 { font-size: 2.5rem; }
          .decenent-hero p { margin: 0 auto 2rem; }
          .hero-actions { justify-content: center; flex-direction: column; }
          .footer-grid { flex-direction: column; gap: 2rem; text-align: center; align-items: center; }
          .main-car-img { height: 300px; }
        }
      `}</style>
    </div>
  );
}

export default App;
