import React, { useState, useEffect } from 'react';
import { 
    db, 
    collection, 
    getDocs, 
    query, 
    orderBy, 
    onSnapshot,
    where 
} from '../firebase/firebase';
import './Games.css';

const Games = () => {
    const [allGames, setAllGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [genres, setGenres] = useState([]);

    // Load games from Firestore
    useEffect(() => {
        const q = query(collection(db, 'games'), orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const games = [];
            const seenNames = new Set();
            const genreSet = new Set();
            
            snapshot.forEach((doc) => {
                const game = doc.data();
                game.id = doc.id;
                
                const name = (game.name || '').toLowerCase().trim();
                if (name && !seenNames.has(name)) {
                    seenNames.add(name);
                    games.push(game);
                    if (game.genre) {
                        genreSet.add(game.genre);
                    }
                }
            });
            
            setAllGames(games);
            setGenres([...genreSet]);
            setLoading(false);
            applyFilters(games, searchQuery, selectedGenre, selectedType);
        }, (error) => {
            console.error('Error loading games:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Apply filters
    const applyFilters = (games, query, genre, type) => {
        let filtered = [...games];
        
        // Search filter
        if (query) {
            const q = query.toLowerCase();
            filtered = filtered.filter(g => 
                g.name?.toLowerCase().includes(q) ||
                g.genre?.toLowerCase().includes(q) ||
                g.description?.toLowerCase().includes(q)
            );
        }
        
        // Genre filter
        if (genre !== 'all') {
            filtered = filtered.filter(g => g.genre === genre);
        }
        
        // Type filter (Free, VIP, Premium)
        if (type === 'free') {
            filtered = filtered.filter(g => g.isFree === true || g.tier === 'free');
        } else if (type === 'vip') {
            filtered = filtered.filter(g => g.isVip === true || g.tier === 'vip');
        } else if (type === 'premium') {
            filtered = filtered.filter(g => g.isPremium === true || g.tier === 'premium');
        }
        
        setFilteredGames(filtered);
    };

    // Handle search
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        applyFilters(allGames, query, selectedGenre, selectedType);
    };

    // Handle genre filter
    const handleGenreChange = (e) => {
        const genre = e.target.value;
        setSelectedGenre(genre);
        applyFilters(allGames, searchQuery, genre, selectedType);
    };

    // Handle type filter
    const handleTypeChange = (e) => {
        const type = e.target.value;
        setSelectedType(type);
        applyFilters(allGames, searchQuery, selectedGenre, type);
    };

    // Reset filters
    const resetFilters = () => {
        setSearchQuery('');
        setSelectedGenre('all');
        setSelectedType('all');
        applyFilters(allGames, '', 'all', 'all');
    };

    // Render game cards
    const renderGameCards = (games) => {
        if (!games || games.length === 0) {
            return (
                <div className="games-no-results">
                    <p>🎮 No games found</p>
                    <p style={{ fontSize: '14px', marginTop: '8px', color: 'var(--text-secondary)' }}>
                        Try adjusting your filters or search term
                    </p>
                    <button className="btn-secondary" onClick={resetFilters} style={{ marginTop: '16px' }}>
                        🔄 Reset Filters
                    </button>
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

    if (loading) {
        return (
            <div className="games-page">
                <div className="games-header">
                    <h1>🎮 <span>All Games</span></h1>
                </div>
                <div className="games-grid">
                    <div className="loading-card"></div>
                    <div className="loading-card"></div>
                    <div className="loading-card"></div>
                    <div className="loading-card"></div>
                    <div className="loading-card"></div>
                    <div className="loading-card"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="games-page">
            <div className="games-header">
                <h1>🎮 <span>All Games</span></h1>
                <span className="games-count">{filteredGames.length} games</span>
            </div>

            {/* Filters */}
            <div className="games-filters">
                <div className="filter-group">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="🔍 Search games..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
                <div className="filter-group">
                    <select className="filter-select" value={selectedGenre} onChange={handleGenreChange}>
                        <option value="all">All Genres</option>
                        {genres.map((genre, i) => (
                            <option key={i} value={genre}>{genre}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-group">
                    <select className="filter-select" value={selectedType} onChange={handleTypeChange}>
                        <option value="all">All Types</option>
                        <option value="free">🆓 Free</option>
                        <option value="vip">⭐ VIP</option>
                        <option value="premium">💎 Premium</option>
                    </select>
                </div>
                {(searchQuery || selectedGenre !== 'all' || selectedType !== 'all') && (
                    <button className="btn-secondary" onClick={resetFilters}>
                        🔄 Reset
                    </button>
                )}
            </div>

            {/* Games Grid */}
            <div className="games-grid">
                {renderGameCards(filteredGames)}
            </div>
        </div>
    );
};

export default Games;
