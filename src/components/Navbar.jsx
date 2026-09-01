import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth, onAuthStateChanged, signOut } from '../firebase';

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

    // Navbar styles
    const navbarStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '12px 30px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.3s ease'
    };

    const logoStyle = {
        fontSize: '22px',
        fontWeight: 800,
        color: 'var(--text-primary)',
        textDecoration: 'none',
        letterSpacing: '-0.5px'
    };

    const logoSpanStyle = {
        color: 'var(--accent)'
    };

    const headerRightStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    };

    const searchWrapperStyle = {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    };

    const searchInputStyle = {
        padding: '8px 14px 8px 36px',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        color: 'var(--text-primary)',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.3s ease',
        width: '180px'
    };

    const searchIconStyle = {
        position: 'absolute',
        left: '12px',
        color: 'var(--text-secondary)',
        fontSize: '14px'
    };

    const headerBtnStyle = {
        background: 'none',
        border: 'none',
        color: 'var(--text-secondary)',
        fontSize: '20px',
        cursor: 'pointer',
        padding: '6px',
        borderRadius: '50%',
        transition: 'all 0.3s ease',
        textDecoration: 'none'
    };

    const mobileMenuBtnStyle = {
        background: 'none',
        border: 'none',
        color: 'var(--text-secondary)',
        fontSize: '24px',
        cursor: 'pointer',
        padding: '6px',
        borderRadius: '50%',
        transition: 'all 0.3s ease',
        display: 'none'
    };

    // Mobile overlay styles
    const overlayStyle = {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        zIndex: 500,
        opacity: mobileMenuOpen ? 1 : 0,
        pointerEvents: mobileMenuOpen ? 'all' : 'none',
        transition: 'opacity 0.4s ease'
    };

    const drawerStyle = {
        position: 'fixed',
        top: 0,
        right: mobileMenuOpen ? 0 : '-320px',
        width: '320px',
        maxWidth: '85vw',
        height: '100vh',
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--glass-border)',
        zIndex: 600,
        padding: '30px 24px',
        transition: 'right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
    };

    const drawerHeaderStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border)',
        marginBottom: '20px'
    };

    const drawerLogoStyle = {
        fontSize: '20px',
        fontWeight: 800
    };

    const drawerCloseStyle = {
        background: 'none',
        border: 'none',
        color: 'var(--text-secondary)',
        fontSize: '24px',
        cursor: 'pointer',
        padding: '4px'
    };

    const drawerLinksStyle = {
        listStyle: 'none',
        flex: 1
    };

    const drawerLinkStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '12px 16px',
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        fontSize: '15px',
        fontWeight: 500
    };

    const drawerUserStyle = {
        padding: '16px',
        background: 'var(--glass-bg)',
        borderRadius: '12px',
        border: '1px solid var(--glass-border)',
        marginTop: 'auto'
    };

    const logoutBtnStyle = {
        marginTop: '10px',
        padding: '8px 16px',
        background: 'rgba(239, 68, 68, 0.15)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '8px',
        color: 'var(--danger)',
        cursor: 'pointer',
        fontWeight: 600,
        width: '100%',
        transition: 'background 0.3s'
    };

    // Menu bar styles
    const menuBarStyle = {
        position: 'fixed',
        top: '72px',
        left: 0,
        right: 0,
        zIndex: 99,
        padding: '12px 30px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        transition: 'all 0.3s ease'
    };

    const menuBtnStyle = (isActive) => ({
        padding: '8px 20px',
        border: 'none',
        borderRadius: '30px',
        background: isActive ? 'var(--accent)' : 'transparent',
        color: isActive ? 'white' : 'var(--text-secondary)',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        whiteSpace: 'nowrap',
        textDecoration: 'none',
        boxShadow: isActive ? '0 0 30px var(--accent-glow)' : 'none'
    });

    const linkIconStyle = {
        fontSize: '20px',
        width: '28px',
        textAlign: 'center'
    };

    return (
        <>
            {/* Top Header */}
            <header style={navbarStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Link to="/" style={logoStyle}>
                        🎮 DVARY <span style={logoSpanStyle}>GAMES</span>
                    </Link>
                </div>
                <div style={headerRightStyle}>
                    <div style={searchWrapperStyle}>
                        <span style={searchIconStyle}>🔍</span>
                        <input type="text" placeholder="Search games..." style={searchInputStyle} />
                    </div>
                    {user ? (
                        <button style={headerBtnStyle} onClick={handleLogout}>🚪</button>
                    ) : (
                        <>
                            <Link to="/login" style={headerBtnStyle}>🔑</Link>
                            <Link to="/signup" style={headerBtnStyle}>📝</Link>
                        </>
                    )}
                    <button style={mobileMenuBtnStyle} onClick={toggleMobileMenu}>
                        ☰
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div style={overlayStyle} onClick={closeMobileMenu}></div>

            {/* Mobile Drawer */}
            <nav style={drawerStyle}>
                <div style={drawerHeaderStyle}>
                    <div style={drawerLogoStyle}>DVARY <span style={logoSpanStyle}>GAMES</span></div>
                    <button style={drawerCloseStyle} onClick={closeMobileMenu}>✕</button>
                </div>
                <ul style={drawerLinksStyle}>
                    <li><Link to="/" style={drawerLinkStyle} onClick={closeMobileMenu}><span style={linkIconStyle}>🏠</span> Home</Link></li>
                    <li><Link to="/profile" style={drawerLinkStyle} onClick={closeMobileMenu}><span style={linkIconStyle}>👤</span> Profile</Link></li>
                    <li><Link to="/about" style={drawerLinkStyle} onClick={closeMobileMenu}><span style={linkIconStyle}>ℹ️</span> About</Link></li>
                    <li><Link to="/ai" style={drawerLinkStyle} onClick={closeMobileMenu}><span style={linkIconStyle}>🤖</span> AI Chat</Link></li>
                    {user && (
                        <li><Link to="/profile" style={drawerLinkStyle} onClick={closeMobileMenu}><span style={linkIconStyle}>👤</span> Profile</Link></li>
                    )}
                </ul>
                <div style={drawerUserStyle}>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{user?.displayName || 'Guest'}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{user?.email || 'Please login'}</div>
                    {user ? (
                        <button style={logoutBtnStyle} onClick={handleLogout}>🚪 Logout</button>
                    ) : (
                        <Link to="/login" style={{ ...logoutBtnStyle, textAlign: 'center', textDecoration: 'none' }}>🔑 Login</Link>
                    )}
                </div>
            </nav>

            {/* Menu Bar */}
            <nav style={menuBarStyle}>
                <Link to="/" style={menuBtnStyle(location.pathname === '/')}>🏠 Home</Link>
                <Link to="/profile" style={menuBtnStyle(location.pathname === '/profile')}>👤 Profile</Link>
                <Link to="/about" style={menuBtnStyle(location.pathname === '/about')}>ℹ️ About</Link>
                <Link to="/ai" style={menuBtnStyle(location.pathname === '/ai')}>🤖 AI Chat</Link>
            </nav>
        </>
    );
};

export default Navbar;

