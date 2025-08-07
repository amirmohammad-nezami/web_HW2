import React, { useState } from 'react';
import { authAPI } from '../services/api';

interface SignupProps {
    onSignup: (token: string, username: string) => void;
    onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup, onSwitchToLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.signup({ username, password, email });
            onSignup(response.data.token, response.data.username);
        } catch (err) {
            setError('Username or email already exists');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="error">{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>
            <p>
                Already have an account?{' '}
                <button onClick={onSwitchToLogin} className="link-button">
                    Login
                </button>
            </p>
        </div>
    );
};

export default Signup; 