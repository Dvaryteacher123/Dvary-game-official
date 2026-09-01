import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword, onAuthStateChanged } from '../firebase';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/main');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/main');
        } catch (err) {
            let errorMsg = 'Login failed. Please try again.';
            if (err.code === 'auth/user-not-found') {
                errorMsg = 'No account found with this email. Please sign up first.';
            } else if (err.code === 'auth/wrong-password') {
                errorMsg = 'Incorrect password. Please try again.';
            } else if (err.code === 'auth/invalid-email') {
                errorMsg = 'Invalid email address format.';
            } else if (err.code === 'auth/user-disabled') {
                errorMsg = 'This account has been disabled. Please contact support.';
            } else if (err.code === 'auth/too-many-requests') {
                errorMsg = 'Too many failed attempts. Please try again later.';
            }
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-logo">
                    <h2>🔑 Welcome Back</h2>
                    <p>Sign in to your DVARY GAMES account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="login-divider">or</div>

                <div className="login-signup-link">
                    Don't have an account? <Link to="/signup">Create one now</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
