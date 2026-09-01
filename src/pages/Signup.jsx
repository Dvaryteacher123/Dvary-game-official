import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    auth, 
    createUserWithEmailAndPassword, 
    updateProfile,
    onAuthStateChanged,
    db,
    setDoc,
    doc
} from '../firebase';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

        if (!username || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (username.length < 3) {
            setError('Username must be at least 3 characters');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: username
            });

            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                username: username,
                email: user.email,
                displayName: username,
                photoURL: null,
                avatarEmoji: '👤',
                role: 'user',
                createdAt: new Date().toISOString(),
                lastSeen: new Date().toISOString()
            });

            navigate('/profile');
        } catch (err) {
            let errorMsg = 'Signup failed. Please try again.';
            if (err.code === 'auth/email-already-in-use') {
                errorMsg = 'This email is already registered. Please login instead.';
            } else if (err.code === 'auth/invalid-email') {
                errorMsg = 'Invalid email address format.';
            } else if (err.code === 'auth/weak-password') {
                errorMsg = 'Password is too weak. Use at least 6 characters.';
            } else if (err.code === 'auth/operation-not-allowed') {
                errorMsg = 'Email/password accounts are not enabled.';
            }
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Styles
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

    const reqStyle = {
        fontSize: '12px',
        color: 'var(--text-secondary)',
        marginTop: '5px'
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
                    <h2 style={titleStyle}>📝 Create Account</h2>
                    <p style={subtitleStyle}>Join DVARY GAMES today!</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={groupStyle}>
                        <label style={labelStyle}>Username</label>
                        <input
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>

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
                            placeholder="Min 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            required
                        />
                        <div style={reqStyle}>❌ At least 6 characters</div>
                    </div>

                    <div style={groupStyle}>
                        <label style={labelStyle}>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>

                    {error && <div style={errorStyle}>{error}</div>}

                    <button type="submit" style={btnStyle} disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div style={linkStyle}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
