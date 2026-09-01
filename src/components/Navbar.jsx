import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth, onAuthStateChanged, signOut } from '../firebase';
import './Navbar.css';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <>
            <header className="top-header">
                <div className="header-left">
                    <Link to="/main" className="logo">
                        🎮 DVARY <span>GAMES</span>
                    </Link>
                </div>
                <div className="header-right">
                    <div className="search-wrapper">
                        <span className="search-icon">🔍</span>
                        <input type="text" placeholder="Search games..." />
                    </div>
                    {user ? (
                        <button className="header-btn" onClick={handleLogout}>
                            🚪
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="header-btn">🔑</Link>
                            <Link to="/signup" className="header-btn">📝</Link>
                        </>
                    )}
                    <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
                        ☰
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            <div className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={closeMobileMenu}></div>
            <nav className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <div className="drawer-logo">DVARY <span>GAMES</span></div>
                    <button className="drawer-close" onClick={closeMobileMenu}>✕</button>
                </div>
                <ul className="drawer-links">
                    <li><Link to="/main" onClick={closeMobileMenu}><span className="link-icon">🏠</span> Home</Link></li>
                    <li><Link to="/games" onClick={closeMobileMenu}><span className="link-icon">🎮</span> Games</Link></li>
                    <li><Link to="/community" onClick={closeMobileMenu}><span className="link-icon">💬</span> Community</Link></li>
                    <li><Link to="/graph" onClick={closeMobileMenu}><span className="link-icon">📊</span> Stats</Link></li>
                    <li><Link to="/about" onClick={closeMobileMenu}><span className="link-icon">ℹ️</span> About</Link></li>
                    {user && (
                        <>
                            <li><Link to="/profile" onClick={closeMobileMenu}><span className="link-icon">👤</span> Profile</Link></li>
                            <li><Link to="/settings" onClick={closeMobileMenu}><span className="link-icon">⚙️</span> Settings</Link></li>
                            <li><Link to="/admin" onClick={closeMobileMenu}><span className="link-icon">⚙️</span> Admin</Link></li>
                        </>
                    )}
                </ul>
                <div className="drawer-user">
                    <div className="user-name">{user?.displayName || 'Guest'}</div>
                    <div className="user-email">{user?.email || 'Please login'}</div>
                    {user ? (
                        <button className="logout-drawer" onClick={handleLogout}>🚪 Logout</button>
                    ) : (
                        <Link to="/login" className="logout-drawer" style={{ textAlign: 'center', textDecoration: 'none' }}>🔑 Login</Link>
                    )}
                </div>
            </nav>

            {/* Menu Bar */}
            <nav className="menu-bar">
                <Link to="/main" className={`menu-btn ${location.pathname === '/main' ? 'active' : ''}`}>🏠 Home</Link>
                <Link to="/games" className={`menu-btn ${location.pathname === '/games' ? 'active' : ''}`}>🎮 Games</Link>
                <Link to="/main" className="menu-btn">⭐ VIP</Link>
                <Link to="/main" className="menu-btn">🆓 Free</Link>
                <Link to="/main" className="menu-btn">🔥 Trending</Link>
                <Link to="/about" className={`menu-btn ${location.pathname === '/about' ? 'active' : ''}`}>ℹ️ About</Link>
            </nav>
        </>
    );
};

export default Navbar;

