import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    db, 
    collection, 
    getDocs, 
    query, 
    orderBy, 
    onSnapshot,
    where 
} from '../firebase/firebase';
import './Main.css';

const Main = () => {
    const [allGames, setAllGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentTab, setCurrentTab] = useState('home');

    // Load games from Firestore
    useEffect(() => {
        const q = query(collection(db, 'games'), orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const games = [];
            const seenNames = new Set();
            
            snapshot.forEach((doc) => {
                const game = doc.data();
                game.id = doc.id;
                
                const name = (game.name || '').toLowerCase().trim();
                if (name && !seenNames.has(name)) {
                    seenNames.add(name);
                    games.push(game);
                }
            });
            
            setAllGames(games);
            setLoading(false);
        }, (error) => {
            console.error('Error loading games:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Filter games based on tab
    const getFilteredGames = () => {
        let filtered = [...allGames];
        
        switch(currentTab) {
            case 'home':
                break;
            case 'vip':
                filtered = filtered.filter(g => g.tier === 'vip' || g.isVip === true);
                break;
            case 'free':
                filtered = filtered.filter(g => g.tier === 'free' || g.isFree === true);
                break;
            case 'trending':
                filtered = filtered.filter(g => g.isTrending === true);
                break;
            default:
                break;
        }
        
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(g => 
                g.name?.toLowerCase().includes(query) ||
                g.genre?.toLowerCase().includes(query) ||
                g.description?.toLowerCase().includes(query)
            );
        }
        
        return filtered;
    };

    const filteredGames = getFilteredGames();
    
    // Get games for sections
    const featuredGames = allGames.filter(g => g.isFeatured === true).slice(0, 3);
    const trendingGames = allGames.filter(g => g.isTrending === true).slice(0, 3);
    const latestGames = [...allGames].slice(0, 3);

    const renderGameCards = (games) => {
        if (!games || games.length === 0) {
            return (
                <div className="no-games">
                    <p>🎮 No games found</p>
                    <p style={{ fontSize: '14px', marginTop: '8px', color: 'var(--text-secondary)' }}>
                        Check back soon for new games!
                    </p>
                </div>
            );
        }

        return games.map((game) => {
            const badge = getBadge(game);
            const icon = getGameIcon(game.name || '');
            const stars = game.rating ? '⭐'.repeat(Math.round(game.rating)) : '';
            const downloadLinks = game.downloadLinks || [];
            const firstLink = downloadLinks.length > 0 ? downloadLinks[0] : '#';
            const fileSize = game.fileSize || 'Unknown';
            const description = game.description || 'No description available';
            const released = game.released || 'Release date not specified';
            const platform = game.platform || 'Multi-platform';
            const hasVideo = game.videoUrl || game.trailerUrl || false;
            const videoUrl = game.videoUrl || game.trailerUrl || '';
            const gameId = game.id || 'game-' + Date.now() + Math.random();

            return (
                <div className="game-card" key={gameId}>
                    <div className="card-image">
                        {game.imageUrl ? (
                            <img src={game.imageUrl} alt={game.name} />
                        ) : (
                            icon
                        )}
                        {badge && (
                            <span className={`card-badge ${badge.class}`}>
                                {badge.text}
                            </span>
                        )}
                    </div>
                    <div className="card-body">
                        <div className="name">{game.name || 'Unnamed Game'}</div>
                        <div className="genre">{game.genre || 'General'}</div>
                        <div className="description" id={`desc-${gameId}`}>
                            {description}
                        </div>
                        <button 
                            className="read-more-btn" 
                            onClick={() => toggleReadMore(gameId)}
                            id={`readmore-${gameId}`}
                        >
                            Read More ↓
                        </button>
                        {game.rating && (
                            <div className="rating">
                                <span className="stars">{stars}</span> {game.rating}/5
                            </div>
                        )}
                        {released && <div className="released">📅 {released}</div>}
                        {platform && (
                            <div className="platform">🖥️ <span>{platform}</span></div>
                        )}
                        {hasVideo && (
                            <div className="video-container">
                                <iframe 
                                    src={videoUrl} 
                                    allowFullScreen 
                                    loading="lazy"
                                    title={`${game.name} trailer`}
                                />
                            </div>
                        )}
                    </div>
                    <div className="card-footer">
                        {downloadLinks.length > 0 ? (
                            <a href={firstLink} className="download-btn" target="_blank" rel="noopener noreferrer">
                                ⬇️ Download <span className="arrow">↓</span>
                            </a>
                        ) : (
                            <span className="no-links">No download links available</span>
                        )}
                        
                        {downloadLinks.length > 1 && (
                            <div className="download-links-small">
                                {downloadLinks.slice(1).map((link, i) => (
                                    <a key={i} href={link} className="dl-link" target="_blank" rel="noopener noreferrer">
                                        ⬇️ Link {i + 2}
                                    </a>
                                ))}
                            </div>
                        )}
                        
                        <div className="game-size">📦 {fileSize}</div>
                    </div>
                </div>
            );
        });
    };

    const getBadge = (game) => {
        if (game.tier === 'vip' || game.isVip) return { text: 'VIP', class: 'badge-vip' };
        if (game.tier === 'premium' || game.isPremium) return { text: 'PREMIUM', class: 'badge-premium' };
        if (game.isFree || game.tier === 'free') return { text: 'FREE', class: 'badge-free' };
        return null;
    };

    const getGameIcon = (name) => {
        const icons = ['🎮', '⚔️', '🏎️', '🧙', '🚀', '🏆', '🎯', '👾', '🤖', '👽', '🕹️', '🎲'];
        const index = (name || '').length % icons.length;
        return icons[index] || '🎮';
    };

    const toggleReadMore = (gameId) => {
        const desc = document.getElementById(`desc-${gameId}`);
        const btn = document.getElementById(`readmore-${gameId}`);
        
        if (desc.classList.contains('expanded')) {
            desc.classList.remove('expanded');
            btn.textContent = 'Read More ↓';
        } else {
            desc.classList.add('expanded');
            btn.textContent = 'Read Less ↑';
        }
    };

    const switchTab = (tab) => {
        setCurrentTab(tab);
    };

    if (loading) {
        return (
            <div className="main-content">
                <div className="games-grid">
                    <div className="loading-card"></div>
                    <div className="loading-card"></div>
                    <div className="loading-card"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-content">
            {/* Featured Games */}
            <div className="section-title">
                🔥 <span>Featured</span> Games
                <span className="see-all" onClick={() => switchTab('games')}>See all →</span>
            </div>
            <div className="games-grid">
                {featuredGames.length > 0 ? renderGameCards(featuredGames) : renderGameCards(allGames.slice(0, 3))}
            </div>

            {/* Categories */}
            <div className="section-title">📂 <span>Categories</span></div>
            <div className="categories-grid" id="categoriesGrid">
                {['Action', 'Racing', 'Sports', 'Adventure', 'Shooter', 'Puzzle'].map((cat, i) => {
                    const icons = ['🎮', '🏎️', '⚽', '🔫', '🧩', '⚔️'];
                    return (
                        <div className="category-item" key={i}>
                            <span className="cat-icon">{icons[i]}</span>
                            <div className="cat-name">{cat}</div>
                        </div>
                    );
                })}
            </div>

            {/* Trending Games */}
            <div className="section-title">
                📈 <span>Trending</span> Games
                <span className="see-all" onClick={() => switchTab('trending')}>See all →</span>
            </div>
            <div className="games-grid">
                {trendingGames.length > 0 ? renderGameCards(trendingGames) : renderGameCards(allGames.slice(0, 3))}
            </div>

            {/* Latest Games */}
            <div className="section-title">
                🆕 <span>Latest</span> Games
                <span className="see-all" onClick={() => switchTab('games')}>See all →</span>
            </div>
            <div className="games-grid">
                {renderGameCards(latestGames)}
            </div>
        </div>
    );
};

export default Main;
