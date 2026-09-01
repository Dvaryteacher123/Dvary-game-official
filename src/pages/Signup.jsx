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
} from '../firebase/firebase';
import './Signup.css';

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
                navigate('/main');
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
            // Create user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update profile with username
            await updateProfile(user, {
                displayName: username
            });

            // Save user data to Firestore
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

            navigate('/main');
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

    return (
        <div className="signup-page">
            <div className="signup-container">
                <div className="signup-logo">
                    <h2>📝 Create Account</h2>
                    <p>Join DVARY GAMES today!</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

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
                            placeholder="Min 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="password-requirements">
                            <span id="lengthReq">❌ At least 6 characters</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="signup-btn" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="signup-login-link">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
