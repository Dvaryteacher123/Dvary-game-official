import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword, onAuthStateChanged } from '../firebase';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/profile');
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
            navigate('/profile');
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

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 130px)',
        padding: '20px'
    };

    const formStyle = {
        background: 'var(--bg-card)',
        padding: '50px',
        borderRadius: '20px',
        border: '1px solid var(--glass-border)',
        width: '100%',
        maxWidth: '420px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
    };

    const logoStyle = {
        textAlign: 'center',
        marginBottom: '30px'
    };

    const titleStyle = {
        fontSize: '32px',
        color: 'var(--accent)'
    };

    const subtitleStyle = {
        color: 'var(--text-secondary)',
        marginTop: '5px'
    };

    const groupStyle = {
        marginBottom: '20px'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        color: 'var(--text-secondary)',
        fontWeight: 500,
        fontSize: '14px'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        color: 'var(--text-primary)',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.3s'
    };

    const btnStyle = {
        width: '100%',
        padding: '14px',
        background: 'var(--accent)',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginTop: '10px',
        opacity: loading ? 0.5 : 1,
        cursor: loading ? 'not-allowed' : 'pointer'
    };

    const errorStyle = {
        color: 'var(--danger)',
        fontSize: '14px',
        marginTop: '10px',
        padding: '10px',
        background: 'rgba(239, 68, 68, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(239, 68, 68, 0.2)'
    };

    const dividerStyle = {
        display: 'flex',
        alignItems: 'center',
        margin: '20px 0',
        color: 'var(--text-secondary)',
        fontSize: '13px'
    };

    const linkStyle = {
        textAlign: 'center',
        marginTop: '20px',
        color: 'var(--text-secondary)',
        fontSize: '14px'
    };

    return (
        <div style={containerStyle}>
            <div style={formStyle}>
                <div style={logoStyle}>
                    <h2 style={titleStyle}>🔑 Welcome Back</h2>
                    <p style={subtitleStyle}>Sign in to your DVARY GAMES account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={groupStyle}>
                        <label style={labelStyle}>Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={groupStyle}>
                        <label style={labelStyle}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>

                    {error && <div style={errorStyle}>{error}</div>}

                    <button type="submit" style={btnStyle} disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={dividerStyle}>
                    <span style={{ flex: 1, borderBottom: '1px solid var(--border)' }}></span>
                    <span style={{ padding: '0 15px' }}>or</span>
                    <span style={{ flex: 1, borderBottom: '1px solid var(--border)' }}></span>
                </div>

                <div style={linkStyle}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Create one now</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
