import React, { useState, useRef, useEffect } from 'react';
import { auth, onAuthStateChanged } from '../firebase';

const Ai = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: "Hello! I'm your gaming assistant. How can I help you today?"
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        setTimeout(() => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const sendMessage = async () => {
        const message = input.trim();
        if (!message) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: message
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();

            if (response.ok) {
                const botMessage = {
                    id: Date.now() + 1,
                    type: 'bot',
                    content: data.response || 'Sorry, I could not process that.'
                };
                setMessages(prev => [...prev, botMessage]);
            } else {
                const errorMessage = {
                    id: Date.now() + 1,
                    type: 'bot',
                    content: `❌ Error: ${data.error || 'Something went wrong'}`
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: '❌ Error connecting to server. Please make sure the server is running.'
            };
            setMessages(prev => [...prev, errorMessage]);
            console.error('AI Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleSuggestion = (text) => {
        setInput(text);
        setTimeout(() => sendMessage(), 100);
    };

    const containerStyle = {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px 20px 100px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 130px)'
    };

    const headerStyle = {
        marginBottom: '20px'
    };

    const titleStyle = {
        fontSize: '28px',
        fontWeight: 800,
        color: 'var(--text-primary)'
    };

    const subtitleStyle = {
        color: 'var(--text-secondary)',
        fontSize: '15px',
        marginTop: '4px'
    };

    const chatContainerStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-card)',
        border: '1px solid var(--glass-border)',
        borderRadius: '16px',
        overflow: 'hidden',
        minHeight: '400px'
    };

    const messagesStyle = {
        flex: 1,
        padding: '20px 24px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxHeight: '400px'
    };

    const msgStyle = (type) => ({
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '85%',
        alignSelf: type === 'user' ? 'flex-end' : 'flex-start',
        animation: 'msgFade 0.3s ease'
    });

    const labelStyle = (type) => ({
        fontSize: '11px',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        marginBottom: '4px',
        textAlign: type === 'user' ? 'right' : 'left'
    });

    const bubbleStyle = (type) => ({
        padding: '10px 16px',
        borderRadius: '14px',
        fontSize: '14px',
        lineHeight: '1.6',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        background: type === 'user' ? 'var(--accent)' : 'var(--bg-primary)',
        color: type === 'user' ? 'white' : 'var(--text-primary)',
        border: type === 'user' ? 'none' : '1px solid var(--glass-border)',
        borderBottomRightRadius: type === 'user' ? '4px' : '14px',
        borderBottomLeftRadius: type === 'user' ? '14px' : '4px'
    });

    const typingStyle = {
        display: 'flex',
        gap: '4px',
        padding: '6px 4px',
        minHeight: '30px',
        alignItems: 'center'
    };

    const dotStyle = {
        width: '8px',
        height: '8px',
        background: 'var(--text-secondary)',
        borderRadius: '50%',
        animation: 'typingBounce 1.4s infinite'
    };

    const suggestionsStyle = {
        padding: '10px 24px 14px',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        borderTop: '1px solid var(--glass-border)'
    };

    const suggestionBtnStyle = {
        padding: '6px 14px',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '20px',
        color: 'var(--text-secondary)',
        fontSize: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        whiteSpace: 'nowrap'
    };

    const inputAreaStyle = {
        padding: '12px 20px 16px',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        background: 'var(--glass-bg)'
    };

    const inputStyle = {
        flex: 1,
        padding: '10px 16px',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        color: 'var(--text-primary)',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.3s'
    };

    const sendBtnStyle = {
        padding: '10px 24px',
        background: 'var(--accent)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '14px',
        whiteSpace: 'nowrap',
        opacity: loading || !user ? 0.5 : 1,
        cursor: loading || !user ? 'not-allowed' : 'pointer'
    };

    const warningStyle = {
        padding: '8px 20px',
        background: 'rgba(239, 68, 68, 0.1)',
        borderTop: '1px solid rgba(239, 68, 68, 0.2)',
        textAlign: 'center',
        fontSize: '14px',
        color: 'var(--text-secondary)'
    };

    if (!user) {
        return (
            <div style={containerStyle}>
                <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                    <h2 style={{ fontSize: '32px', color: 'var(--text-primary)', marginBottom: '12px' }}>🔒 Please Login</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '20px' }}>You need to be logged in to use the AI assistant.</p>
                    <a href="/login" className="btn-primary">Login</a>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h2 style={titleStyle}>🤖 <span style={{ color: 'var(--accent)' }}>AI Gaming Assistant</span></h2>
                <p style={subtitleStyle}>Ask me anything about games, get recommendations, or just chat!</p>
            </div>

            <div style={chatContainerStyle}>
                <div style={messagesStyle}>
                    {messages.map((msg) => (
                        <div key={msg.id} style={msgStyle(msg.type)}>
                            <div style={labelStyle(msg.type)}>
                                {msg.type === 'user' ? '👤 You' : '🤖 DVARY AI'}
                            </div>
                            <div style={bubbleStyle(msg.type)}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div style={msgStyle('bot')}>
                            <div style={labelStyle('bot')}>🤖 DVARY AI</div>
                            <div style={{ ...bubbleStyle('bot'), ...typingStyle }}>
                                <span style={dotStyle}></span>
                                <span style={{ ...dotStyle, animationDelay: '0.2s' }}></span>
                                <span style={{ ...dotStyle, animationDelay: '0.4s' }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div style={suggestionsStyle}>
                    <button style={suggestionBtnStyle} onClick={() => handleSuggestion('Recommend me a good game')}>
                        🎮 Recommend a game
                    </button>
                    <button style={suggestionBtnStyle} onClick={() => handleSuggestion('What are the best FPS games?')}>
                        🔫 Best FPS games
                    </button>
                    <button style={suggestionBtnStyle} onClick={() => handleSuggestion('Tell me about DVARY GAMES')}>
                        ℹ️ About DVARY
                    </button>
                    <button style={suggestionBtnStyle} onClick={() => handleSuggestion('Tips for gaming beginners')}>
                        🆕 Beginner tips
                    </button>
                </div>

                <div style={inputAreaStyle}>
                    <input
                        type="text"
                        placeholder="Ask DVARY AI..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading || !user}
                        style={inputStyle}
                    />
                    <button 
                        onClick={sendMessage} 
                        disabled={loading || !user}
                        style={sendBtnStyle}
                    >
                        {loading ? '...' : 'Send'}
                    </button>
                </div>

                {!user && (
                    <div style={warningStyle}>
                        <span>🔒 Please <a href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>login</a> to use the AI assistant</span>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes msgFade {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes typingBounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-8px); }
                }
                .btn-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 36px;
                    background: linear-gradient(135deg, var(--accent), var(--accent-hover));
                    color: white;
                    border: none;
                    border-radius: 50px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    text-decoration: none;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 0 40px var(--accent-glow);
                }
                .btn-primary:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 60px var(--accent-glow);
                }
            `}</style>
        </div>
    );
};

export default Ai;
