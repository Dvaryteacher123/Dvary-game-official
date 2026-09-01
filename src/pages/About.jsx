import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            {/* ============================================================
            HERO SECTION
            ============================================================ */}
            <section className="about-hero">
                <div className="about-hero-bg"></div>
                <div className="about-hero-content">
                    <h1 className="about-hero-title">🎮 ABOUT DVARY GAMES</h1>
                    <div className="about-hero-subtitle">PLAY. <span>DISCOVER</span>. ENJOY.</div>
                    <p className="about-hero-description">
                        Welcome to DVARY GAMES, a modern gaming platform created to make it easier for gamers to discover, 
                        explore and access different types of games from one place.
                    </p>
                    <p className="about-hero-description" style={{ marginTop: '12px' }}>
                        DVARY GAMES is designed with a simple goal: to create a beautiful, easy-to-use and enjoyable gaming 
                        platform where users can discover new games, explore popular titles and find games that match their interests.
                    </p>
                </div>
            </section>

            {/* ============================================================
            WHO WE ARE
            ============================================================ */}
            <section className="about-section">
                <div className="about-section-header">
                    <h2>🎮 <span>WHO WE ARE</span></h2>
                </div>
                <div className="about-card">
                    <p>
                        DVARY GAMES is a gaming platform focused on providing gamers with a simple and modern way to discover games.
                    </p>
                    <p style={{ marginTop: '12px' }}>
                        Instead of searching through many different places to find information about games, DVARY GAMES brings 
                        game discovery into one organized platform.
                    </p>
                    <p style={{ marginTop: '12px' }}>
                        Users can browse available games, explore different categories, search for games, discover trending titles 
                        and view detailed information about individual games.
                    </p>
                    <p style={{ marginTop: '12px' }}>
                        The platform is designed to work smoothly on mobile phones, tablets and desktop computers, giving users 
                        a consistent experience across different devices.
                    </p>
                </div>
            </section>

            {/* ============================================================
            OUR MISSION
            ============================================================ */}
            <section className="about-section about-section-dark">
                <div className="about-section-header">
                    <h2>🚀 <span>OUR MISSION</span></h2>
                </div>
                <div className="about-card">
                    <p>
                        Our mission is to build a simple, modern and accessible gaming platform for gamers.
                    </p>
                    <p style={{ marginTop: '12px' }}>
                        We want DVARY GAMES to become a place where users can easily discover interesting games without 
                        complicated navigation.
                    </p>
                    <p style={{ marginTop: '12px' }}>
                        Our goal is to continuously improve the platform, introduce better features and create a better 
                        experience for everyone who visits DVARY GAMES.
                    </p>
                    <p style={{ marginTop: '12px' }}>
                        We believe that finding a game should be simple, enjoyable and exciting.
                    </p>
                </div>
            </section>

            {/* ============================================================
            SOCIAL MEDIA SECTION
            ============================================================ */}
            <section className="about-section" id="social">
                <div className="about-section-header">
                    <h2>🌐 <span>CONNECT WITH US</span></h2>
                    <p>Join our community and stay updated</p>
                </div>
                
                <div className="social-grid">
                    {/* TikTok */}
                    <a href="https://www.tiktok.com/@dvary16?_r=1&_t=ZS-99MbpLtv92j" target="_blank" rel="noopener noreferrer" className="social-card">
                        <span className="social-icon">🎵</span>
                        <div className="social-name">TikTok</div>
                        <div className="social-desc">Follow us for gaming content</div>
                        <span className="social-btn tiktok">Follow @dvary16</span>
                    </a>
                    
                    {/* WhatsApp Channel */}
                    <a href="https://whatsapp.com/channel/0029VbCRC9b5fM5cruU8PF2M" target="_blank" rel="noopener noreferrer" className="social-card">
                        <span className="social-icon">📢</span>
                        <div className="social-name">WhatsApp Channel</div>
                        <div className="social-desc">Get updates and announcements</div>
                        <span className="social-btn whatsapp">Join Channel</span>
                    </a>
                    
                    {/* WhatsApp Group */}
                    <a href="https://chat.whatsapp.com/L8WUWSCaPDJFNXupzUDVdP?s=sh&p=a&ilr=0" target="_blank" rel="noopener noreferrer" className="social-card">
                        <span className="social-icon">💬</span>
                        <div className="social-name">WhatsApp Group</div>
                        <div className="social-desc">Chat with other gamers</div>
                        <span className="social-btn group">Join Group</span>
                    </a>
                </div>
            </section>

            {/* ============================================================
            FEATURES
            ============================================================ */}
            <section className="about-section about-section-dark">
                <div className="about-section-header">
                    <h2>✨ <span>WHAT YOU CAN FIND</span></h2>
                    <p>Explore the features available on DVARY GAMES</p>
                </div>
                <div className="features-grid">
                    <div className="feature-item">
                        <span className="icon">🎮</span>
                        <h4>GAME DISCOVERY</h4>
                        <p>Discover different games available on the platform and explore new gaming experiences.</p>
                    </div>
                    <div className="feature-item">
                        <span className="icon">🔥</span>
                        <h4>TRENDING GAMES</h4>
                        <p>Find popular and trending games that are getting attention from gamers.</p>
                    </div>
                    <div className="feature-item">
                        <span className="icon">⭐</span>
                        <h4>VIP GAMES</h4>
                        <p>Explore premium/VIP games available on the platform.</p>
                    </div>
                    <div className="feature-item">
                        <span className="icon">🆓</span>
                        <h4>FREE GAMES</h4>
                        <p>Discover games available for free.</p>
                    </div>
                    <div className="feature-item">
                        <span className="icon">🔍</span>
                        <h4>GAME SEARCH</h4>
                        <p>Search for games quickly using the search feature.</p>
                    </div>
                    <div className="feature-item">
                        <span className="icon">📂</span>
                        <h4>GAME CATEGORIES</h4>
                        <p>Explore games according to categories and genres.</p>
                    </div>
                    <div className="feature-item">
                        <span className="icon">📱</span>
                        <h4>MOBILE FRIENDLY</h4>
                        <p>DVARY GAMES is designed to provide a smooth experience on mobile devices.</p>
                    </div>
                    <div className="feature-item">
                        <span className="icon">⚡</span>
                        <h4>MODERN DESIGN</h4>
                        <p>The platform uses a modern gaming interface with a dark theme, glowing elements and clean navigation.</p>
                    </div>
                </div>
            </section>

            {/* ============================================================
            HOW IT WORKS
            ============================================================ */}
            <section className="about-section">
                <div className="about-section-header">
                    <h2>⚡ <span>HOW IT WORKS</span></h2>
                    <p>Get started in five simple steps</p>
                </div>
                <div className="steps-grid">
                    <div className="step-item">
                        <div className="number">01</div>
                        <h4>DISCOVER</h4>
                        <p>Open DVARY GAMES and explore the available games.</p>
                    </div>
                    <div className="step-item">
                        <div className="number">02</div>
                        <h4>SEARCH</h4>
                        <p>Use the search feature to find a specific game.</p>
                    </div>
                    <div className="step-item">
                        <div className="number">03</div>
                        <h4>EXPLORE</h4>
                        <p>Open the game card to view its information, category, rating and available options.</p>
                    </div>
                    <div className="step-item">
                        <div className="number">04</div>
                        <h4>CHOOSE</h4>
                        <p>Choose the game you are interested in, whether it is a Free or VIP game.</p>
                    </div>
                    <div className="step-item">
                        <div className="number">05</div>
                        <h4>ENJOY</h4>
                        <p>Continue with the available game action provided on the platform.</p>
                    </div>
                </div>
            </section>

            {/* ============================================================
            DEVELOPER SECTION
            ============================================================ */}
            <section className="about-section about-section-dark" id="developer">
                <div className="about-section-header">
                    <h2>👨‍💻 <span>MEET THE DEVELOPER</span></h2>
                </div>
                <div className="developer-card">
                    <span className="dev-avatar">👨‍💻</span>
                    <div className="dev-name">DVARY</div>
                    <div className="dev-title">Web Developer & Creator of DVARY GAMES</div>
                    <p className="dev-desc">
                        DVARY is the developer and creator behind DVARY GAMES. The platform is created with a focus on modern 
                        web design, gaming experiences and continuously improving digital products. The goal is to build useful 
                        and attractive digital platforms that are easy for users to understand and enjoy. DVARY GAMES is one 
                        of the projects created under the DVARY brand.
                    </p>
                    <div className="dev-contact-buttons">
                        <a href="tel:0724525910" className="btn-dev phone">📞 CALL DEVELOPER</a>
                        <a href="mailto:dullamanyama0@gmail.com" className="btn-dev email">📧 EMAIL DEVELOPER</a>
                    </div>
                </div>
            </section>

            {/* ============================================================
            CONTACT DEVELOPER
            ============================================================ */}
            <section className="about-section" id="contact">
                <div className="about-section-header">
                    <h2>📞 <span>CONTACT THE DEVELOPER</span></h2>
                    <p>Have a question, suggestion, problem or feedback about DVARY GAMES?</p>
                </div>
                <div className="contact-grid">
                    <div className="contact-card">
                        <h3>👨‍💻 <span>DVARY</span></h3>
                        <p style={{ fontSize: '18px', margin: '8px 0' }}>📞 0724525910</p>
                        <a href="tel:0724525910" className="btn-dev phone">📞 CALL DEVELOPER</a>
                    </div>
                    <div className="contact-card">
                        <h3>📧 <span>Email</span></h3>
                        <p style={{ fontSize: '18px', margin: '8px 0' }}>📧 dullamanyama0@gmail.com</p>
                        <a href="mailto:dullamanyama0@gmail.com" className="btn-dev email">📧 EMAIL DEVELOPER</a>
                    </div>
                </div>
            </section>

            {/* ============================================================
            FINAL CTA
            ============================================================ */}
            <section className="about-cta">
                <h2>READY TO EXPLORE <span>DVARY GAMES</span>?</h2>
                <p>Discover games, explore categories and find your next gaming experience.</p>
                <div className="about-cta-buttons">
                    <Link to="/main" className="btn-primary">🎮 EXPLORE GAMES <span className="arrow">→</span></Link>
                    <Link to="/" className="btn-secondary">🏠 BACK TO HOME</Link>
                </div>
            </section>
        </div>
    );
};

export default About;
