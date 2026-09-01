import React, { useState, useEffect } from 'react';
import { 
    auth, 
    onAuthStateChanged, 
    db, 
    doc, 
    getDoc, 
    updateDoc,
    collection,
    query,
    where,
    getDocs
} from '../firebase/firebase';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        gamesAdded: 0,
        totalGames: 0,
        daysActive: 0
    });
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        username: '',
        avatarEmoji: '👤'
    });

    const emojis = ['👤', '😀', '😎', '🤩', '🥳', '😂', '🔥', '🎮', '👾', '🦾', '🚀', '⚽', '🏎️', '👑'];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                await loadUserData(user);
            } else {
                setUser(null);
                setUserData(null);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const loadUserData = async (user) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserData(data);
                setEditForm({
                    username: data.username || '',
                    avatarEmoji: data.avatarEmoji || '👤'
                });
            }

            const userGamesQuery = query(
                collection(db, 'games'),
                where('createdBy', '==', user.uid)
            );
            const userGamesSnapshot = await getDocs(userGamesQuery);
            const gamesAdded = userGamesSnapshot.size;

            const allGamesSnapshot = await getDocs(collection(db, 'games'));
            const totalGames = allGamesSnapshot.size;

            const createdAt = userData?.createdAt ? new Date(userData.createdAt) : new Date();
            const now = new Date();
            const daysActive = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));

            setStats({
                gamesAdded,
                totalGames,
                daysActive: daysActive || 0
            });

        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            const updates = {};
            if (editForm.username !== userData.username) {
                updates.username = editForm.username;
            }
            if (editForm.avatarEmoji !== userData.avatarEmoji) {
                updates.avatarEmoji = editForm.avatarEmoji;
            }

            if (Object.keys(updates).length > 0) {
                await updateDoc(doc(db, 'users', user.uid), updates);
                setUserData({ ...userData, ...updates });
            }

            setEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="profile-page">
                <div className="profile-not-logged-in">
                    <h2>🔒 Please Login</h2>
                    <p>You need to be logged in to view your profile.</p>
                    <a href="/login" className="btn-primary">Login</a>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {userData?.photoURL ? (
                            <img src={userData.photoURL} alt={userData.username} />
                        ) : (
                            <span className="avatar-emoji">{userData?.avatarEmoji || '👤'}</span>
                        )}
                    </div>
                    <div className="profile-info">
                        <h2>{userData?.username || userData?.displayName || 'User'}</h2>
                        <div className="profile-email">{user?.email}</div>
                        <div className="profile-member-since">
                            Member since: {formatDate(userData?.createdAt)}
                        </div>
                        <div className="profile-role">
                            {userData?.role === 'admin' ? '👑 Admin' : '🎮 Gamer'}
                        </div>
                        <button 
                            className="btn-edit-profile"
                            onClick={() => setEditing(!editing)}
                        >
                            {editing ? 'Cancel' : '✏️ Edit Profile'}
                        </button>
                    </div>
                </div>

                {editing && (
                    <div className="profile-edit-form">
                        <h3>Edit Profile</h3>
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    value={editForm.username}
                                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Choose Avatar</label>
                                <div className="emoji-grid">
                                    {emojis.map((emoji) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            className={`emoji-option ${editForm.avatarEmoji === emoji ? 'active' : ''}`}
                                            onClick={() => setEditForm({ ...editForm, avatarEmoji: emoji })}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className="btn-save-profile">💾 Save Changes</button>
                        </form>
                    </div>
                )}

                <div className="profile-stats">
                    <div className="stat-card">
                        <div className="stat-number">{stats.gamesAdded}</div>
                        <div className="stat-label">Games Added</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.totalGames}</div>
                        <div className="stat-label">Total Games</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.daysActive}</div>
                        <div className="stat-label">Days Active</div>
                    </div>
                </div>

                <div className="profile-details">
                    <h3>📋 Account Details</h3>
                    <div className="detail-row">
                        <span className="label">User ID</span>
                        <span className="value">{user?.uid}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Email Address</span>
                        <span className="value">{user?.email}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Username</span>
                        <span className="value">{userData?.username || userData?.displayName || 'User'}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Account Created</span>
                        <span className="value">{formatDate(userData?.createdAt)}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Last Login</span>
                        <span className="value">{formatDate(userData?.lastSeen)}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Role</span>
                        <span className="value">{userData?.role === 'admin' ? '👑 Admin' : '🎮 User'}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Avatar</span>
                        <span className="value">{userData?.avatarEmoji || '👤'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
