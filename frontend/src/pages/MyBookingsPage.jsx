import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const MyBookingsPage = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/my-bookings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setBookings(data.bookings);
            }
        } catch (err) {
            console.error('Fetch bookings error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bookings-container animate-fade-in">
            <div className="bookings-header">
                <h2>My Bookings</h2>
                <p>Track the status of your vehicle service appointments</p>
            </div>

            <div className="bookings-content glass-panel">
                {loading ? (
                    <div className="loading-state">Loading your bookings...</div>
                ) : (
                    <div className="table-wrapper">
                        <table className="bookings-table">
                            <thead>
                                <tr>
                                    <th>Ref ID</th>
                                    <th>Vehicle</th>
                                    <th>Package</th>
                                    <th>Schedule</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b._id || b.id}>
                                        <td><span className="ref-badge">{b.queueNumber || 'REF-N/A'}</span></td>
                                        <td>
                                            <div className="vehicle-cell">
                                                <strong>{b.vehicleName}</strong>
                                                <small>{b.vehicleType}</small>
                                            </div>
                                        </td>
                                        <td>{b.packageName}</td>
                                        <td>
                                            <div className="time-cell">
                                                <span className="date">{new Date(b.bookingDate).toLocaleDateString()}</span>
                                                <span className="time-badge">{b.serviceTime || 'TBD'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-pill ${b.status?.toLowerCase()}`}>
                                                {b.status || 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {bookings.length === 0 && (
                                    <tr><td colSpan="5" className="empty-row">No bookings found. Book a service first!</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style jsx>{`
                .bookings-container { padding: 4rem 0; max-width: 1000px; margin: 0 auto; }
                .bookings-header { margin-bottom: 3rem; text-align: center; }
                .bookings-header h2 { font-size: 2.5rem; color: #000; text-transform: uppercase; font-weight: 900; margin-bottom: 0.5rem; }
                .bookings-header p { color: #555; font-size: 1.1rem; }

                .glass-panel { background: #fff; border: 1px solid #000; padding: 2rem; }
                
                .table-wrapper { overflow-x: auto; }
                .bookings-table { width: 100%; border-collapse: collapse; }
                .bookings-table th { text-align: left; padding: 1.2rem; border-bottom: 4px solid #000; color: #000; font-size: 0.9rem; text-transform: uppercase; font-weight: 800; }
                .bookings-table td { padding: 1.2rem; border-bottom: 1px solid #eee; }
                
                .ref-badge { background: #000; color: white; padding: 0.3rem 0.6rem; font-family: monospace; font-weight: 700; font-size: 0.9rem; }
                .vehicle-cell strong { display: block; color: #000; font-size: 1.1rem; }
                .vehicle-cell small { color: #666; text-transform: uppercase; font-size: 0.75rem; }
                
                .time-cell { display: flex; flex-direction: column; gap: 0.2rem; }
                .time-cell .date { font-weight: 600; color: #000; }
                .time-badge { color: #666; font-size: 0.85rem; }

                .status-pill { font-weight: 800; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px; }
                .status-pill.confirmed { color: #059669; }
                .status-pill.pending { color: #d97706; }
                .status-pill.completed { color: #2563eb; }
                .status-pill.cancelled { color: #dc2626; }

                .empty-row { text-align: center; padding: 4rem; color: #888; font-style: italic; }
                .loading-state { text-align: center; padding: 3rem; color: #666; font-weight: 600; }
            `}</style>
        </div>
    );
};

export default MyBookingsPage;
