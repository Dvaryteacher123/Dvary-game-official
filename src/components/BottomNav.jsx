import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
    const location = useLocation();

    return (
        <nav className="bottom-nav">
            <Link to="/main" className={`nav-item ${location.pathname === '/main' ? 'active' : ''}`}>
                <span className="nav-icon">🏠</span>
                Home
            </Link>
            <Link to="/games" className={`nav-item ${location.pathname === '/games' ? 'active' : ''}`}>
                <span className="nav-icon">🎮</span>
                Games
            </Link>
            <Link to="/graph" className={`nav-item ${location.pathname === '/graph' ? 'active' : ''}`}>
                <span className="nav-icon">📊</span>
                Stats
            </Link>
            <Link to="/main" className="nav-item">
                <span className="nav-icon">⭐</span>
                VIP
            </Link>
        </nav>
    );
};

export default BottomNav;
