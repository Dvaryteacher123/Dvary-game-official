import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    const containerStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px 20px 100px'
    };

    const heroStyle = {
        textAlign: 'center',
        padding: '60px 20px',
        background: 'radial-gradient(ellipse at 30% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)',
        borderRadius: '20px',
        marginBottom: '40px'
    };

    const titleStyle = {
        fontSize: 'clamp(36px, 6vw, 64px)',
        fontWeight: 900,
        background: 'linear-gradient(135deg, #ffffff 0%, var(--accent) 50%, var(--accent-hover) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '10px'
    };

    const subtitleStyle = {
        fontSize: 'clamp(18px, 2.5vw, 30px)',
        fontWeight: 700,
        color: 'var(--text-secondary)',
        marginBottom: '20px',
        letterSpacing: '4px'
    };

    const descriptionStyle = {
        fontSize: 'clamp(16px, 1.2vw, 20px)',
        color: 'var(--text-secondary)',
        maxWidth: '700px',
        margin: '0 auto',
        lineHeight: '1.8'
    };

    const sectionStyle = {
        padding: '40px 0',
        borderBottom: '1px solid var(--glass-border)'
    };

    const sectionTitleStyle = {
        fontSize: 'clamp(28px, 3.5vw, 42px)',
        fontWeight: 800,
        textAlign: 'center',
        marginBottom: '20px',
        color: 'var(--text-primary)'
    };

    const cardStyle = {
        background: 'var(--bg-card)',
        border: '1px solid var(--glass-border)',
        borderRadius: '20px',
        padding: '35px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease'
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px'
    };

    const featureItemStyle = {
        background: 'var(--bg-card)',
        border: '1px solid var(--glass-border)',
        borderRadius: '16px',
        padding: '24px 20px',
        textAlign: 'center',
        transition: 'all 0.3s ease'
    };

    const features = [
        { icon: '🎮', title: 'GAME DISCOVERY', desc: 'Discover different games available on the platform.' },
        { icon: '🔥', title: 'TRENDING GAMES', desc: 'Find popular and trending games.' },
        { icon: '⭐', title: 'VIP GAMES', desc: 'Explore premium/VIP games.' },
        { icon: '🆓', title: 'FREE GAMES', desc: 'Discover games available for free.' },
        { icon: '🔍', title: 'GAME SEARCH', desc: 'Search for games quickly.' },
        { icon: '📂', title: 'GAME CATEGORIES', desc: 'Explore games by categories.' }
    ];

    const steps = [
        { number: '01', title: 'DISCOVER', desc: 'Open DVARY GAMES and explore the available games.' },
        { number: '02', title: 'SEARCH', desc: 'Use the search feature to find a specific game.' },
        { number: '03', title: 'EXPLORE', desc: 'Open the game card to view its information.' },
        { number: '04', title: 'CHOOSE', desc: 'Choose Free or VIP game.' },
        { number: '05', title: 'ENJOY', desc: 'Continue with the available game action.' }
    ];

    const socialLinks = [
        { icon: '🎵', name: 'TikTok', desc: 'Follow us for gaming content', url: 'https://www.tiktok.com/@dvary16' },
        { icon: '📢', name: 'WhatsApp Channel', desc: 'Get updates and announcements', url: 'https://whatsapp.com/channel/0029VbCRC9b5fM5cruU8PF2M' },
        { icon: '💬', name: 'WhatsApp Group', desc: 'Chat with other gamers', url: 'https://chat.whatsapp.com/L8WUWSCaPDJFNXupzUDVdP' }
    ];

    return (
        <div style={containerStyle}>
            {/* Hero */}
            <div style={heroStyle}>
                <h1 style={titleStyle}>🎮 ABOUT DVARY GAMES</h1>
                <div style={subtitleStyle}>PLAY. <span style={{ color: 'var(--accent)' }}>DISCOVER</span>. ENJOY.</div>
                <p style={descriptionStyle}>
                    Welcome to DVARY GAMES, a modern gaming platform created to make it easier for gamers to discover, 
                    explore and access different types of games from one place.
                </p>
                <p style={{ ...descriptionStyle, marginTop: '12px' }}>
                    DVARY GAMES is designed with a simple goal: to create a beautiful, easy-to-use and enjoyable gaming 
                    platform where users can discover new games, explore popular titles and find games that match their interests.
                </p>
            </div>

            {/* Who We Are */}
            <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>🎮 <span style={{ color: 'var(--accent)' }}>WHO WE ARE</span></h2>
                <div style={cardStyle}>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '16px' }}>
                        DVARY GAMES is a gaming platform focused on providing gamers with a simple and modern way to discover games.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '16px', marginTop: '12px' }}>
                        Instead of searching through many different places to find information about games, DVARY GAMES brings 
                        game discovery into one organized platform.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '16px', marginTop: '12px' }}>
                        Users can browse available games, explore different categories, search for games, discover trending titles 
                        and view detailed information about individual games.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '16px', marginTop: '12px' }}>
                        The platform is designed to work smoothly on mobile phones, tablets and desktop computers, giving users 
                        a consistent experience across different devices.
                    </p>
                </div>
            </div>

            {/* Mission */}
            <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>🚀 <span style={{ color: 'var(--accent)' }}>OUR MISSION</span></h2>
                <div style={cardStyle}>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '16px' }}>
                        Our mission is to build a simple, modern and accessible gaming platform for gamers.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '16px', marginTop: '12px' }}>
                        We want DVARY GAMES to become a place where users can easily discover interesting games without 
                        complicated navigation.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '16px', marginTop: '12px' }}>
                        Our goal is to continuously improve the platform, introduce better features and create a better 
                        experience for everyone who visits DVARY GAMES.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '16px', marginTop: '12px' }}>
                        We believe that finding a game should be simple, enjoyable and exciting.
                    </p>
                </div>
            </div>

            {/* Social Media */}
            <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>🌐 <span style={{ color: 'var(--accent)' }}>CONNECT WITH US</span></h2>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '30px' }}>
                    Join our community and stay updated
                </p>
                <div style={gridStyle}>
                    {socialLinks.map((social, index) => (
                        <a
                            key={index}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                ...featureItemStyle,
                                textDecoration: 'none',
                                color: 'var(--text-primary)',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>{social.icon}</div>
                            <div style={{ fontSize: '18px', fontWeight: 700 }}>{social.name}</div>
                            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>{social.desc}</div>
                            <span style={{
                                display: 'inline-block',
                                marginTop: '12px',
                                padding: '8px 24px',
                                borderRadius: '25px',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'white',
                                background: 'var(--accent)'
                            }}>Follow</span>
                        </a>
                    ))}
                </div>
            </div>

            {/* Features */}
            <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>✨ <span style={{ color: 'var(--accent)' }}>WHAT YOU CAN FIND</span></h2>
                <div style={gridStyle}>
                    {features.map((feature, index) => (
                        <div key={index} style={featureItemStyle}>
                            <div style={{ fontSize: '32px', display: 'block', marginBottom: '10px' }}>{feature.icon}</div>
                            <h4 style={{ fontSize: '17px', color: 'var(--text-primary)', marginBottom: '4px' }}>{feature.title}</h4>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* How It Works */}
            <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>⚡ <span style={{ color: 'var(--accent)' }}>HOW IT WORKS</span></h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '24px',
                    marginTop: '20px'
                }}>
                    {steps.map((step, index) => (
                        <div key={index} style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                background: 'var(--accent)',
                                color: 'white',
                                fontSize: '22px',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 12px',
                                boxShadow: '0 0 40px var(--accent-glow)'
                            }}>{step.number}</div>
                            <h4 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '4px' }}>{step.title}</h4>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Developer */}
            <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>👨‍💻 <span style={{ color: 'var(--accent)' }}>MEET THE DEVELOPER</span></h2>
                <div style={{
                    ...cardStyle,
                    textAlign: 'center',
                    maxWidth: '700px',
                    margin: '0 auto'
                }}>
                    <div style={{ fontSize: '64px', display: 'block', marginBottom: '12px' }}>👨‍💻</div>
                    <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)' }}>DVARY</div>
                    <div style={{ fontSize: '16px', color: 'var(--accent)', marginBottom: '12px' }}>Web Developer & Creator</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.8' }}>
                        DVARY is the developer and creator behind DVARY GAMES. The platform is created with a focus on modern 
                        web design, gaming experiences and continuously improving digital products.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
                        <a href="tel:0724525910" style={{
                            padding: '12px 28px',
                            borderRadius: '30px',
                            fontSize: '15px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            color: 'white',
                            background: 'var(--success)',
                            transition: 'all 0.3s ease'
                        }}>📞 CALL</a>
                        <a href="mailto:dullamanyama0@gmail.com" style={{
                            padding: '12px 28px',
                            borderRadius: '30px',
                            fontSize: '15px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            color: 'white',
                            background: 'var(--accent)',
                            transition: 'all 0.3s ease'
                        }}>📧 EMAIL</a>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                marginTop: '40px',
                background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-primary))',
                borderRadius: '20px',
                border: '1px solid var(--glass-border)'
            }}>
                <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, color: 'var(--text-primary)' }}>
                    READY TO EXPLORE <span style={{ color: 'var(--accent)' }}>DVARY GAMES</span>?
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(16px, 1.2vw, 20px)', maxWidth: '600px', margin: '20px auto' }}>
                    Discover games, explore categories and find your next gaming experience.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/profile" className="btn-primary">🎮 EXPLORE</Link>
                    <Link to="/" className="btn-secondary">🏠 HOME</Link>
                </div>
            </div>
        </div>
    );
};

export default About;
