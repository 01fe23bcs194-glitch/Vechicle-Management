import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const RegisterPage = ({ onSwitch }) => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                login(data.user, data.token);
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Could not reach registration server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-card decent-shadow">
            <div className="content-area">
                <h2>Join the Hub</h2>
                <p>Register to start booking professional services for your vehicle</p>

                {error && <div className="error-pill">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="e.g. Rahul Sharma"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="field">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="Min. 6 characters"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full mt-1" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="switch-msg">
                    Already a member? <button className="btn-inline" onClick={onSwitch}>Login here</button>
                </div>
            </div>

            <style jsx>{`
        .auth-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          width: 100%;
          max-width: 440px;
          border: 1px solid #e2e8f0;
          box-shadow: var(--shadow-premium);
        }
        .content-area { padding: 3.5rem; text-align: center; }
        h2 { font-size: 1.75rem; color: var(--primary); margin-bottom: 0.5rem; }
        p { color: var(--text-secondary); margin-bottom: 2.5rem; font-size: 0.95rem; }
        
        .field { text-align: left; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
        label { font-weight: 700; font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase; }
        input { padding: 0.9rem; border-radius: 10px; border: 1px solid #e2e8f0; background: #f8fafc; font-family: inherit; font-size: 1rem; }
        input:focus { outline: none; border-color: var(--accent); background: white; box-shadow: 0 0 0 3px var(--accent-soft); }
        
        .error-pill { background: #fee2e2; color: #dc2626; padding: 0.8rem; border-radius: 8px; margin-bottom: 1.5rem; font-size: 0.9rem; font-weight: 600; }
        .w-full { width: 100%; }
        .mt-1 { margin-top: 1rem; }
        .switch-msg { margin-top: 2rem; font-size: 0.9rem; color: var(--text-secondary); }
        .btn-inline { background: none; border: none; color: var(--accent); font-weight: 700; cursor: pointer; padding-left: 0.2rem; }
      `}</style>
        </div>
    );
};

export default RegisterPage;
