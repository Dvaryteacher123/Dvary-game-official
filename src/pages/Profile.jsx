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
    getDocs,
    signOut
} from '../firebase/firebase';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        gamesAdded: 0,
        totalGames: 0,
        daysActive: 0
    });

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

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
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

    const containerStyle = {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px 20px 100px'
    };

    const cardStyle = {
        background: 'var(--bg-card)',
        border: '1px solid var(--glass-border)',
        borderRadius: '20px',
        padding: '35px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
    };

    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '30px',
        paddingBottom: '25px',
        borderBottom: '1px solid var(--glass-border)',
        flexWrap: 'wrap'
    };

    const avatarStyle = {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'var(--accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        color: 'white',
        flexShrink: 0,
        overflow: 'hidden',
        border: '3px solid var(--accent-glow)'
    };

    const infoStyle = {
        flex: 1
    };

    const nameStyle = {
        fontSize: '28px',
        color: 'var(--text-primary)'
    };

    const emailStyle = {
        color: 'var(--text-secondary)',
        fontSize: '16px',
        marginTop: '4px'
    };

    const memberStyle = {
        color: 'var(--text-secondary)',
        fontSize: '14px',
        marginTop: '4px'
    };

    const roleStyle = {
        display: 'inline-block',
        background: 'var(--accent)',
        color: 'white',
        padding: '3px 14px',
        borderRadius: '15px',
        fontSize: '13px',
        fontWeight: 600,
        marginTop: '8px'
    };

    const statsGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        margin: '25px 0'
    };

    const statCardStyle = {
        background: 'var(--bg-primary)',
        border: '1px solid var(--glass-border)',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center'
    };

    const statNumberStyle = {
        fontSize: '28px',
        fontWeight: 800,
        color: 'var(--accent)'
    };

    const statLabelStyle = {
        fontSize: '14px',
        color: 'var(--text-secondary)',
        marginTop: '4px'
    };

    const detailsStyle = {
        marginTop: '10px'
    };

    const detailsTitleStyle = {
        fontSize: '18px',
        color: 'var(--text-primary)',
        marginBottom: '16px'
    };

    const rowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '1px solid var(--glass-border)'
    };

    const labelStyle = {
        color: 'var(--text-secondary)',
        fontSize: '14px'
    };

    const valueStyle = {
        color: 'var(--text-primary)',
        fontWeight: 500,
        fontSize: '14px',
        wordBreak: 'break-all',
        textAlign: 'right',
        maxWidth: '60%'
    };

    const logoutBtnStyle = {
        marginTop: '20px',
        padding: '10px 30px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '10px',
        color: 'var(--danger)',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 600,
        transition: 'all 0.3s ease',
        width: '100%'
    };

    const notLoggedInStyle = {
        textAlign: 'center',
        padding: '80px 20px'
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid var(--border)',
                        borderTop: '4px solid var(--accent)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 15px'
                    }}></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={containerStyle}>
                <div style={notLoggedInStyle}>
                    <h2 style={{ fontSize: '32px', color: 'var(--text-primary)', marginBottom: '12px' }}>🔒 Please Login</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '20px' }}>You need to be logged in to view your profile.</p>
                    <a href="/login" className="btn-primary">Login</a>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={headerStyle}>
                    <div style={avatarStyle}>
                        {userData?.photoURL ? (
                            <img src={userData.photoURL} alt={userData.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span>{userData?.avatarEmoji || '👤'}</span>
                        )}
                    </div>
                    <div style={infoStyle}>
                        <h2 style={nameStyle}>{userData?.username || userData?.displayName || 'User'}</h2>
                        <div style={emailStyle}>{user?.email}</div>
                        <div style={memberStyle}>Member since: {formatDate(userData?.createdAt)}</div>
                        <div style={roleStyle}>{userData?.role === 'admin' ? '👑 Admin' : '🎮 Gamer'}</div>
                    </div>
                </div>

                <div style={statsGridStyle}>
                    <div style={statCardStyle}>
                        <div style={statNumberStyle}>{stats.gamesAdded}</div>
                        <div style={statLabelStyle}>Games Added</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statNumberStyle}>{stats.totalGames}</div>
                        <div style={statLabelStyle}>Total Games</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statNumberStyle}>{stats.daysActive}</div>
                        <div style={statLabelStyle}>Days Active</div>
                    </div>
                </div>

                <div style={detailsStyle}>
                    <h3 style={detailsTitleStyle}>📋 Account Details</h3>
                    <div style={rowStyle}>
                        <span style={labelStyle}>User ID</span>
                        <span style={valueStyle}>{user?.uid}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Email Address</span>
                        <span style={valueStyle}>{user?.email}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Username</span>
                        <span style={valueStyle}>{userData?.username || userData?.displayName || 'User'}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Account Created</span>
                        <span style={valueStyle}>{formatDate(userData?.createdAt)}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Last Login</span>
                        <span style={valueStyle}>{formatDate(userData?.lastSeen)}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Role</span>
                        <span style={valueStyle}>{userData?.role === 'admin' ? '👑 Admin' : '🎮 User'}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Avatar</span>
                        <span style={valueStyle}>{userData?.avatarEmoji || '👤'}</span>
                    </div>
                </div>

                <button style={logoutBtnStyle} onClick={handleLogout}>🚪 Logout</button>
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Profile;

