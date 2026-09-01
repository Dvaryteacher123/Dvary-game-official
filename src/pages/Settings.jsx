import React, { useState, useEffect } from 'react';
import { auth, onAuthStateChanged, db, doc, getDoc, updateDoc } from '../firebase/firebase';
import './Settings.css';

const Settings = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState('dark');
    const [accentColor, setAccentColor] = useState('#6366f1');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [historyEnabled, setHistoryEnabled] = useState(true);
    const [notificationSettings, setNotificationSettings] = useState({
        gameUpdates: true,
        communityMessages: true,
        promotions: false
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    const accentColors = [
        { name: 'Indigo', color: '#6366f1' },
        { name: 'Purple', color: '#8b5cf6' },
        { name: 'Pink', color: '#ec4899' },
        { name: 'Orange', color: '#f59e0b' },
        { name: 'Green', color: '#10b981' },
        { name: 'Blue', color: '#3b82f6' }
    ];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                await loadUserSettings(user);
            } else {
                setUser(null);
                setUserData(null);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const loadUserSettings = async (user) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserData(data);
                
                // Load settings from user data or localStorage
                const savedTheme = localStorage.getItem('dvary-theme') || data.theme || 'dark';
                const savedAccent = localStorage.getItem('dvary-accent') || data.accentColor || '#6366f1';
                const savedSound = localStorage.getItem('dvary-sound') !== null ? 
                    localStorage.getItem('dvary-sound') === 'true' : true;
                const savedHistory = localStorage.getItem('dvary-history') !== null ? 
                    localStorage.getItem('dvary-history') === 'true' : true;

                setTheme(savedTheme);
                setAccentColor(savedAccent);
                setSoundEnabled(savedSound);
                setHistoryEnabled(savedHistory);
                setNotificationSettings({
                    gameUpdates: data.notifications?.gameUpdates !== undefined ? data.notifications.gameUpdates : true,
                    communityMessages: data.notifications?.communityMessages !== undefined ? data.notifications.communityMessages : true,
                    promotions: data.notifications?.promotions || false
                });
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('dvary-theme', newTheme);
        showMessage(`Theme changed to ${newTheme} mode`, 'success');
    };

    const handleAccentChange = (color) => {
        setAccentColor(color);
        document.documentElement.style.setProperty('--accent', color);
        document.documentElement.style.setProperty('--accent-glow', color + '44');
        localStorage.setItem('dvary-accent', color);
        showMessage('Accent color updated!', 'success');
    };

    const handleToggle = (setting, setter, value) => {
        setter(value);
        localStorage.setItem(`dvary-${setting}`, value.toString());
        showMessage(`${setting.charAt(0).toUpperCase() + setting.slice(1)} ${value ? 'enabled' : 'disabled'}`, 'info');
    };

    const handleNotificationChange = async (key, value) => {
        const newSettings = { ...notificationSettings, [key]: value };
        setNotificationSettings(newSettings);
        
        if (user) {
            try {
                await updateDoc(doc(db, 'users', user.uid), {
                    [`notifications.${key}`]: value
                });
                showMessage('Notification settings updated!', 'success');
            } catch (error) {
                console.error('Error updating notification settings:', error);
                showMessage('Failed to update settings', 'error');
            }
        }
    };

    const resetSettings = () => {
        if (!confirm('Are you sure you want to reset all settings to default?')) {
            return;
        }

        localStorage.removeItem('dvary-theme');
        localStorage.removeItem('dvary-accent');
        localStorage.removeItem('dvary-sound');
        localStorage.removeItem('dvary-history');

        setTheme('dark');
        setAccentColor('#6366f1');
        setSoundEnabled(true);
        setHistoryEnabled(true);
        setNotificationSettings({
            gameUpdates: true,
            communityMessages: true,
            promotions: false
        });

        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.style.setProperty('--accent', '#6366f1');
        document.documentElement.style.setProperty('--accent-glow', '#6366f144');

        showMessage('Settings reset to default!', 'success');
        setTimeout(() => window.location.reload(), 1000);
    };

    if (loading) {
        return (
            <div className="settings-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading settings...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="settings-page">
                <div className="settings-not-logged-in">
                    <h2>🔒 Please Login</h2>
                    <p>You need to be logged in to access settings.</p>
                    <a href="/login" className="btn-primary">Login</a>
                </div>
            </div>
        );
    }

    return (
        <div className="settings-page">
            <div className="settings-container">
                <div className="settings-header">
                    <h1>⚙️ <span>Settings</span></h1>
                    <p>Customize your DVARY GAMES experience</p>
                </div>

                {message.text && (
                    <div className={`settings-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                {/* Appearance */}
                <div className="settings-section">
                    <h3><span className="icon">🎨</span> Appearance</h3>
                    
                    <div className="setting-item">
                        <div className="info">
                            <div className="title">Theme Mode</div>
                            <div className="description">Switch between dark and light theme</div>
                        </div>
                        <div className="theme-options">
                            <button 
                                className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                                onClick={() => handleThemeChange('dark')}
                            >
                                🌙 Dark
                            </button>
                            <button 
                                className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                                onClick={() => handleThemeChange('light')}
                            >
                                ☀️ Light
                            </button>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="info">
                            <div className="title">Accent Color</div>
                            <div className="description">Choose your primary color</div>
                        </div>
                        <div className="color-options">
                            {accentColors.map(({ name, color }) => (
                                <button
                                    key={name}
                                    className={`color-option ${accentColor === color ? 'active' : ''}`}
                                    style={{ background: color }}
                                    onClick={() => handleAccentChange(color)}
                                    title={name}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chat Settings */}
                <div className="settings-section">
                    <h3><span className="icon">💬</span> Chat Settings</h3>
                    
                    <div className="setting-item">
                        <div className="info">
                            <div className="title">Sound Effects</div>
                            <div className="description">Play sound when AI or messages arrive</div>
                        </div>
                        <button 
                            className={`toggle-btn ${soundEnabled ? 'active' : ''}`}
                            onClick={() => handleToggle('sound', setSoundEnabled, !soundEnabled)}
                        >
                            {soundEnabled ? '🔊 On' : '🔇 Off'}
                        </button>
                    </div>

                    <div className="setting-item">
                        <div className="info">
                            <div className="title">Save Chat History</div>
                            <div className="description">Keep your chat messages saved</div>
                        </div>
                        <button 
                            className={`toggle-btn ${historyEnabled ? 'active' : ''}`}
                            onClick={() => handleToggle('history', setHistoryEnabled, !historyEnabled)}
                        >
                            {historyEnabled ? '✅ On' : '❌ Off'}
                        </button>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="settings-section">
                    <h3><span className="icon">🔔</span> Notifications</h3>
                    
                    <div className="setting-item">
                        <div className="info">
                            <div className="title">Game Updates</div>
                            <div className="description">Get notified when new games are added</div>
                        </div>
                        <button 
                            className={`toggle-btn ${notificationSettings.gameUpdates ? 'active' : ''}`}
                            onClick={() => handleNotificationChange('gameUpdates', !notificationSettings.gameUpdates)}
                        >
                            {notificationSettings.gameUpdates ? '✅ On' : '❌ Off'}
                        </button>
                    </div>

                    <div className="setting-item">
                        <div className="info">
                            <div className="title">Community Messages</div>
                            <div className="description">Get notified about community activity</div>
                        </div>
                        <button 
                            className={`toggle-btn ${notificationSettings.communityMessages ? 'active' : ''}`}
                            onClick={() => handleNotificationChange('communityMessages', !notificationSettings.communityMessages)}
                        >
                            {notificationSettings.communityMessages ? '✅ On' : '❌ Off'}
                        </button>
                    </div>

                    <div className="setting-item">
                        <div className="info">
                            <div className="title">Promotions & Offers</div>
                            <div className="description">Receive promotional notifications</div>
                        </div>
                        <button 
                            className={`toggle-btn ${notificationSettings.promotions ? 'active' : ''}`}
                            onClick={() => handleNotificationChange('promotions', !notificationSettings.promotions)}
                        >
                            {notificationSettings.promotions ? '✅ On' : '❌ Off'}
                        </button>
                    </div>
                </div>

                {/* Account */}
                <div className="settings-section">
                    <h3><span className="icon">👤</span> Account</h3>
                    
                    <div className="setting-item">
                        <div className="info">
                            <div className="title">Email</div>
                            <div className="description">{user?.email}</div>
                        </div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Verified</span>
                    </div>

                    <div className="setting-item">
                        <div className="info">
                            <div className="title">Username</div>
                            <div className="description">{userData?.username || userData?.displayName || 'User'}</div>
                        </div>
                        <a href="/profile" className="btn-edit">✏️ Edit</a>
                    </div>
                </div>

                {/* Reset */}
                <div className="settings-section reset-section">
                    <h3><span className="icon">🔄</span> Reset Settings</h3>
                    
                    <div className="setting-item">
                        <div className="info">
                            <div className="title">Reset All Settings</div>
                            <div className="description">Restore all settings to default values</div>
                        </div>
                        <button className="btn-reset" onClick={resetSettings}>
                            🔄 Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
