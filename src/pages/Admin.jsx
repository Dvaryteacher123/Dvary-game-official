import React, { useState, useEffect } from 'react';
import { 
    db, 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    query, 
    orderBy, 
    onSnapshot,
    serverTimestamp,
    auth,
    onAuthStateChanged
} from '../firebase/firebase';
import './Admin.css';

const Admin = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [games, setGames] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [showNotificationForm, setShowNotificationForm] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        genre: '',
        platform: '',
        description: '',
        rating: '',
        released: '',
        imageUrl: '',
        downloadLinks: [''],
        fileSize: '',
        isFree: false,
        isVip: false,
        isPremium: false,
        isFeatured: false,
        isTrending: false,
        videoUrl: ''
    });

    // Notification form
    const [notifData, setNotifData] = useState({
        title: '',
        message: '',
        icon: '📢'
    });

    // Check auth
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Load games
    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, 'games'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const gamesList = [];
            snapshot.forEach((doc) => {
                gamesList.push({ id: doc.id, ...doc.data() });
            });
            setGames(gamesList);
        }, (error) => {
            console.error('Error loading games:', error);
        });

        return () => unsubscribe();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleLinkChange = (index, value) => {
        const newLinks = [...formData.downloadLinks];
        newLinks[index] = value;
        setFormData(prev => ({ ...prev, downloadLinks: newLinks }));
    };

    const addLinkField = () => {
        setFormData(prev => ({
            ...prev,
            downloadLinks: [...prev.downloadLinks, '']
        }));
    };

    const removeLinkField = (index) => {
        if (formData.downloadLinks.length <= 1) {
            showMessage('You need at least one download link', 'error');
            return;
        }
        const newLinks = formData.downloadLinks.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, downloadLinks: newLinks }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            showMessage('Please login first', 'error');
            return;
        }

        const { name, genre, description, downloadLinks } = formData;
        if (!name || !genre || !description) {
            showMessage('Please fill in all required fields', 'error');
            return;
        }

        const validLinks = downloadLinks.filter(link => link.trim() !== '');
        if (validLinks.length === 0) {
            showMessage('Please provide at least one download link', 'error');
            return;
        }

        setIsSubmitting(true);
        setMessage({ text: '', type: '' });

        try {
            const gameData = {
                ...formData,
                downloadLinks: validLinks,
                rating: formData.rating ? parseFloat(formData.rating) : null,
                tier: formData.isVip ? 'vip' : formData.isPremium ? 'premium' : formData.isFree ? 'free' : 'standard',
                createdAt: serverTimestamp(),
                createdBy: user.uid,
                createdByEmail: user.email,
                createdByName: user.displayName || 'User'
            };

            await addDoc(collection(db, 'games'), gameData);

            // Send notification about new game
            await addDoc(collection(db, 'notifications'), {
                title: '🎮 New Game Added!',
                message: `${name} has been added to DVARY GAMES. Check it out now!`,
                icon: '🎮',
                read: false,
                createdAt: serverTimestamp(),
                createdBy: user.uid,
                createdByEmail: user.email,
                createdByName: user.displayName || 'User'
            });

            showMessage(`✅ Game "${name}" added successfully!`, 'success');
            
            // Reset form
            setFormData({
                name: '',
                genre: '',
                platform: '',
                description: '',
                rating: '',
                released: '',
                imageUrl: '',
                downloadLinks: [''],
                fileSize: '',
                isFree: false,
                isVip: false,
                isPremium: false,
                isFeatured: false,
                isTrending: false,
                videoUrl: ''
            });

        } catch (error) {
            console.error('Error adding game:', error);
            showMessage('❌ Failed to add game: ' + error.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteGame = async (gameId, gameName) => {
        if (!confirm(`Are you sure you want to delete "${gameName}"? This action cannot be undone!`)) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'games', gameId));
            showMessage(`✅ "${gameName}" deleted successfully!`, 'success');
        } catch (error) {
            console.error('Error deleting game:', error);
            showMessage('❌ Failed to delete game: ' + error.message, 'error');
        }
    };

    const sendNotification = async (e) => {
        e.preventDefault();
        if (!user) {
            showMessage('Please login first', 'error');
            return;
        }

        const { title, message, icon } = notifData;
        if (!title || !message) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            await addDoc(collection(db, 'notifications'), {
                title: title,
                message: message,
                icon: icon || '📢',
                read: false,
                createdAt: serverTimestamp(),
                createdBy: user.uid,
                createdByEmail: user.email,
                createdByName: user.displayName || 'User'
            });

            showMessage('✅ Notification sent successfully!', 'success');
            setNotifData({ title: '', message: '', icon: '📢' });
            setShowNotificationForm(false);
        } catch (error) {
            console.error('Error sending notification:', error);
            showMessage('❌ Failed to send notification: ' + error.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };

    const getBadge = (game) => {
        if (game.tier === 'vip' || game.isVip) return { text: 'VIP', class: 'badge-vip' };
        if (game.tier === 'premium' || game.isPremium) return { text: 'PREMIUM', class: 'badge-premium' };
        if (game.isFree || game.tier === 'free') return { text: 'FREE', class: 'badge-free' };
        return null;
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="admin-page">
                <div className="admin-access-denied">
                    <h2>🔒 Please Login</h2>
                    <p>You need to be logged in to access the admin panel.</p>
                    <a href="/login" className="btn-primary">Login</a>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>⚙️ <span>Admin Panel</span></h1>
                <div className="admin-user">
                    <span className="admin-avatar">{user.displayName?.[0] || 'U'}</span>
                    <span className="admin-name">{user.displayName || 'User'}</span>
                    <span className="admin-email">{user.email}</span>
                </div>
            </div>

            {message.text && (
                <div className={`admin-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="admin-stats">
                <div className="stat-card">
                    <div className="stat-number">{games.length}</div>
                    <div className="stat-label">Total Games</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{games.filter(g => g.isVip || g.tier === 'vip').length}</div>
                    <div className="stat-label">VIP Games</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{games.filter(g => g.isFree || g.tier === 'free').length}</div>
                    <div className="stat-label">Free Games</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{games.filter(g => g.isTrending).length}</div>
                    <div className="stat-label">Trending Games</div>
                </div>
            </div>

            <div className="admin-tabs">
                <button 
                    className={`tab-btn ${!showNotificationForm ? 'active' : ''}`}
                    onClick={() => setShowNotificationForm(false)}
                >
                    ➕ Add Game
                </button>
                <button 
                    className={`tab-btn ${showNotificationForm ? 'active' : ''}`}
                    onClick={() => setShowNotificationForm(true)}
                >
                    🔔 Send Notification
                </button>
            </div>

            {/* Add Game Form */}
            {!showNotificationForm && (
                <div className="admin-form-container">
                    <h3>Add New Game</h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Game Name <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="e.g., Cyberpunk 2077"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Genre <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="genre"
                                    placeholder="e.g., Action, RPG"
                                    value={formData.genre}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Platform</label>
                                <input
                                    type="text"
                                    name="platform"
                                    placeholder="e.g., PC, PS5, Xbox"
                                    value={formData.platform}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Rating (1-5)</label>
                                <input
                                    type="number"
                                    name="rating"
                                    min="1"
                                    max="5"
                                    step="0.5"
                                    placeholder="e.g., 4.5"
                                    value={formData.rating}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description <span className="required">*</span></label>
                            <textarea
                                name="description"
                                placeholder="Describe the game..."
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows="3"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Release Date</label>
                                <input
                                    type="date"
                                    name="released"
                                    value={formData.released}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>File Size</label>
                                <input
                                    type="text"
                                    name="fileSize"
                                    placeholder="e.g., 2.5 GB"
                                    value={formData.fileSize}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Image URL</label>
                            <input
                                type="url"
                                name="imageUrl"
                                placeholder="https://example.com/game-image.jpg"
                                value={formData.imageUrl}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Video/Trailer URL</label>
                            <input
                                type="url"
                                name="videoUrl"
                                placeholder="https://www.youtube.com/embed/..."
                                value={formData.videoUrl}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Download Links <span className="required">*</span></label>
                            {formData.downloadLinks.map((link, index) => (
                                <div key={index} className="link-input-group">
                                    <input
                                        type="url"
                                        placeholder={`Link ${index + 1}`}
                                        value={link}
                                        onChange={(e) => handleLinkChange(index, e.target.value)}
                                        required={index === 0}
                                    />
                                    <button 
                                        type="button" 
                                        className="btn-remove-link"
                                        onClick={() => removeLinkField(index)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <button type="button" className="btn-add-link" onClick={addLinkField}>
                                ➕ Add Another Link
                            </button>
                        </div>

                        <div className="form-group">
                            <label>Game Type</label>
                            <div className="checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="isFree"
                                        checked={formData.isFree}
                                        onChange={handleInputChange}
                                    />
                                    🆓 Free Game
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="isVip"
                                        checked={formData.isVip}
                                        onChange={handleInputChange}
                                    />
                                    ⭐ VIP Game
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="isPremium"
                                        checked={formData.isPremium}
                                        onChange={handleInputChange}
                                    />
                                    💎 Premium
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleInputChange}
                                    />
                                    🔥 Featured
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="isTrending"
                                        checked={formData.isTrending}
                                        onChange={handleInputChange}
                                    />
                                    📈 Trending
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding game...' : '➕ Add Game'}
                        </button>
                    </form>
                </div>
            )}

            {/* Send Notification Form */}
            {showNotificationForm && (
                <div className="admin-form-container">
                    <h3>🔔 Send Notification</h3>
                    <form onSubmit={sendNotification} className="admin-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Title <span className="required">*</span></label>
                                <input
                                    type="text"
                                    placeholder="e.g., New Game Added!"
                                    value={notifData.title}
                                    onChange={(e) => setNotifData({ ...notifData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Icon</label>
                                <input
                                    type="text"
                                    placeholder="e.g., 🎮, 📢, ⭐"
                                    value={notifData.icon}
                                    onChange={(e) => setNotifData({ ...notifData, icon: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Message <span className="required">*</span></label>
                            <textarea
                                placeholder="Type your notification message here..."
                                value={notifData.message}
                                onChange={(e) => setNotifData({ ...notifData, message: e.target.value })}
                                required
                                rows="3"
                            />
                        </div>
                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : '📤 Send Notification'}
                        </button>
                    </form>
                </div>
            )}

            {/* Games List */}
            <div className="admin-games-list">
                <h3>📋 Manage Games</h3>
                {games.length === 0 ? (
                    <div className="no-games">
                        <p>No games added yet</p>
                    </div>
                ) : (
                    <div className="games-table">
                        {games.map((game) => {
                            const badge = getBadge(game);
                            return (
                                <div key={game.id} className="game-row">
                                    <div className="game-info">
                                        <div className="game-thumb">
                                            {game.imageUrl ? (
                                                <img src={game.imageUrl} alt={game.name} />
                                            ) : (
                                                '🎮'
                                            )}
                                        </div>
                                        <div className="game-details">
                                            <div className="game-name">{game.name || 'Unnamed'}</div>
                                            <div className="game-meta">
                                                <span>{game.genre || 'General'}</span>
                                                {badge && (
                                                    <span className={`badge-small ${badge.class}`}>
                                                        {badge.text}
                                                    </span>
                                                )}
                                                {game.rating && <span>⭐ {game.rating}/5</span>}
                                                {game.downloadLinks && (
                                                    <span>⬇️ {game.downloadLinks.length} links</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="game-actions">
                                        <button 
                                            className="btn-delete"
                                            onClick={() => deleteGame(game.id, game.name)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
