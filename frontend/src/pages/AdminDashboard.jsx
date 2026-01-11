import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = ({ packages, onUpdate, onDelete, onAdd }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAddingPkg, setIsAddingPkg] = useState(false);
    const [error, setError] = useState('');
    const [newPkg, setNewPkg] = useState({
        packageName: '',
        price: '',
        validity: '',
        servicesIncluded: '',
        status: 'Available',
        imageUrl: ''
    });
    const [editingPkgId, setEditingPkgId] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/bookings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setBookings(data.bookings);
        } catch (err) { console.error('Fetch bookings error:', err); }
    };

    const handleSavePackage = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const servicesArray = typeof newPkg.servicesIncluded === 'string'
                ? newPkg.servicesIncluded.split(',').map(s => s.trim()).filter(s => s !== '')
                : newPkg.servicesIncluded;

            const pkgData = { ...newPkg, servicesIncluded: servicesArray };
            const url = editingPkgId
                ? `http://localhost:5000/api/packages/${editingPkgId}`
                : 'http://localhost:5000/api/packages';

            const method = editingPkgId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(pkgData)
            });

            const data = await res.json();

            if (data.success) {
                if (editingPkgId) {
                    onUpdate(data.package);
                } else {
                    onAdd(data.package);
                }
                setIsAddingPkg(false);
                setEditingPkgId(null);
                setNewPkg({ packageName: '', price: '', validity: '', servicesIncluded: '', status: 'Available', imageUrl: '' });
            } else {
                setError(data.message || 'Failed to save package');
            }
        } catch (err) {
            setError('Server connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (pkg) => {
        setEditingPkgId(pkg._id || pkg.id);
        setNewPkg({
            packageName: pkg.packageName,
            price: pkg.price,
            validity: pkg.validity,
            servicesIncluded: Array.isArray(pkg.servicesIncluded) ? pkg.servicesIncluded.join(', ') : pkg.servicesIncluded,
            status: pkg.status,
            imageUrl: pkg.imageUrl || ''
        });
        setIsAddingPkg(true);
        setError('');
    };

    const deletePackage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this package?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/packages/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                onDelete(id);
            }
        } catch (err) { console.error('Delete package error:', err); }
    };

    return (
        <div className="admin-container">
            <div className="admin-header-lite">
                <div className="header-text">
                    <h2>Operation Management</h2>
                    <p>Manage services and view live customer requests</p>
                </div>
                <div className="tab-control">
                    <button className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>Bookings</button>
                    <button className={activeTab === 'packages' ? 'active' : ''} onClick={() => setActiveTab('packages')}>Packages</button>
                </div>
            </div>

            <div className="admin-content">
                {activeTab === 'bookings' ? (
                    <div className="bookings-view glass-panel">
                        <div className="view-header">
                            <h3>Active Requests</h3>
                            <button className="btn-secondary-outline" onClick={fetchBookings}>Refresh</button>
                        </div>
                        <div className="table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Q. No</th>
                                        <th>Customer</th>
                                        <th>Vehicle</th>
                                        <th>Package</th>
                                        <th>Scheduled</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(b => (
                                        <tr key={b._id || b.id}>
                                            <td><span className="q-badge">{b.queueNumber || 'Q-N'}</span></td>
                                            <td>
                                                <div className="name-cell">
                                                    <strong>{b.customerName}</strong>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="vehicle-cell">
                                                    <span>{b.vehicleName}</span>
                                                    <small>{b.vehicleType}</small>
                                                </div>
                                            </td>
                                            <td>{b.packageName}</td>
                                            <td><span className="time-badge">{b.serviceTime || 'TBD'}</span></td>
                                            <td><span className="stat-pill">Confirmed</span></td>
                                        </tr>
                                    ))}
                                    {bookings.length === 0 && (
                                        <tr><td colSpan="6" className="empty-row">No active bookings.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="packages-view">
                        <div className="view-header">
                            <h3>Service Catalog</h3>
                            <button className="btn-primary" onClick={() => { setIsAddingPkg(true); setEditingPkgId(null); setNewPkg({ packageName: '', price: '', validity: '', servicesIncluded: '', status: 'Available', imageUrl: '' }); }}>+ Add Package</button>
                        </div>

                        <div className="pkg-admin-grid">
                            {packages.map(pkg => (
                                <div key={pkg._id || pkg.id} className="pkg-admin-card">
                                    <img src={pkg.imageUrl || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800'} alt="" />
                                    <div className="pkg-details">
                                        <h4>{pkg.packageName}</h4>
                                        <p className="pkg-price-text">{pkg.price}</p>
                                        <div className="pkg-actions-row">
                                            <button className="btn-link" onClick={() => startEdit(pkg)}>Edit</button>
                                            <button className="btn-link delete" onClick={() => deletePackage(pkg._id || pkg.id)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {isAddingPkg && (
                <div className="modal-overlay">
                    <div className="admin-modal-card">
                        <h3>{editingPkgId ? 'Update Service' : 'New Service Package'}</h3>
                        <form onSubmit={handleSavePackage}>
                            <div className="form-grid">
                                <div className="field">
                                    <label>Package Name</label>
                                    <input type="text" value={newPkg.packageName} onChange={e => setNewPkg({ ...newPkg, packageName: e.target.value })} required placeholder="e.g. Fortuner Care" />
                                </div>
                                <div className="field">
                                    <label>Price</label>
                                    <input type="text" value={newPkg.price} onChange={e => setNewPkg({ ...newPkg, price: e.target.value })} required placeholder="e.g. ₹5,000" />
                                </div>
                                <div className="field">
                                    <label>Validity</label>
                                    <input type="text" value={newPkg.validity} onChange={e => setNewPkg({ ...newPkg, validity: e.target.value })} required placeholder="e.g. 1 Year" />
                                </div>
                                <div className="field">
                                    <label>Image URL</label>
                                    <input type="text" value={newPkg.imageUrl} onChange={e => setNewPkg({ ...newPkg, imageUrl: e.target.value })} placeholder="https://..." />
                                </div>
                                <div className="field full">
                                    <label>Included Services (comma separated)</label>
                                    <textarea value={newPkg.servicesIncluded} onChange={e => setNewPkg({ ...newPkg, servicesIncluded: e.target.value })} required placeholder="Service 1, Service 2..." />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                                <button type="button" className="btn-link" onClick={() => setIsAddingPkg(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .admin-container { padding: 2rem 0; }
                .admin-header-lite { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; }
                .header-text h2 { font-size: 1.8rem; color: var(--primary); margin-bottom: 0.3rem; }
                .header-text p { color: var(--text-secondary); }

                .tab-control { display: flex; background: #eaeff5; padding: 0.3rem; border-radius: 12px; }
                .tab-control button { padding: 0.6rem 1.4rem; border: none; background: transparent; border-radius: 9px; cursor: pointer; font-weight: 600; color: var(--text-secondary); transition: 0.2s; }
                .tab-control button.active { background: #fff; color: var(--primary); box-shadow: var(--shadow-sm); }

                .glass-panel { background: #fff; border-radius: var(--radius-md); border: 1px solid #e2e8f0; padding: 2rem; box-shadow: var(--shadow-sm); }
                .view-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                
                .table-wrapper { overflow-x: auto; }
                .admin-table { width: 100%; border-collapse: collapse; }
                .admin-table th { text-align: left; padding: 1.2rem; border-bottom: 2px solid #f1f5f9; color: var(--primary); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; }
                .admin-table td { padding: 1.2rem; border-bottom: 1px solid #f1f5f9; }
                
                .q-badge { background: var(--accent-dark); color: white; padding: 0.4rem 0.8rem; border-radius: 6px; font-weight: 700; font-family: monospace; }
                .name-cell strong { display: block; color: var(--primary); }
                .vehicle-cell span { display: block; color: var(--primary); }
                .vehicle-cell small { color: var(--text-secondary); font-size: 0.75rem; }
                .time-badge { background: #fff7ed; color: #c2410c; padding: 0.3rem 0.6rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600; border: 1px solid #ffedd5; }
                .stat-pill { color: var(--success); font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; }
                .empty-row { text-align: center; padding: 4rem; color: var(--text-secondary); opacity: 0.7; }

                .pkg-admin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 2rem; }
                .pkg-admin-card { background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; transition: 0.3s; }
                .pkg-admin-card img { width: 100%; height: 140px; object-fit: cover; }
                .pkg-details { padding: 1.2rem; }
                .pkg-details h4 { color: var(--primary); margin-bottom: 0.3rem; }
                .pkg-price-text { color: var(--accent); font-weight: 800; font-size: 1.2rem; margin-bottom: 1rem; }
                .pkg-actions-row { display: flex; gap: 1rem; }
                .btn-link { background: none; border: none; color: var(--accent); font-weight: 600; cursor: pointer; padding: 0; }
                .btn-link.delete { color: #ef4444; }

                .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2000; }
                .admin-modal-card { background: #fff; width: 100%; max-width: 550px; padding: 2.5rem; border-radius: 16px; box-shadow: var(--shadow-lg); }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin: 1.5rem 0; }
                .field { display: flex; flex-direction: column; gap: 0.4rem; }
                .field.full { grid-column: span 2; }
                .field label { font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; }
                .field input, .field textarea { padding: 0.8rem; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; }
                .field textarea { height: 80px; resize: none; }
                .modal-actions { display: flex; gap: 1.5rem; align-items: center; margin-top: 2rem; }
                
                .btn-secondary-outline { background: #fff; border: 1px solid #cbd5e1; padding: 0.6rem 1.2rem; border-radius: 8px; cursor: pointer; font-weight: 600; color: var(--text-main); }
                .btn-secondary-outline:hover { background: #f8fafc; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
