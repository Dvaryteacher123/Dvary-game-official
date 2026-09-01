import React, { useState, useRef, useEffect } from 'react';
import { auth, onAuthStateChanged } from '../firebase';
import './Ai.css';

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

    // Check auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    // Scroll to bottom when messages change
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

        // Add user message
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

    return (
        <div className="ai-page">
            <div className="ai-header">
                <h2>🤖 <span>AI Gaming Assistant</span></h2>
                <p>Ask me anything about games, get recommendations, or just chat!</p>
            </div>

            <div className="ai-chat-container">
                <div className="ai-messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`ai-msg ${msg.type}`}>
                            <div className="ai-msg-label">
                                {msg.type === 'user' ? '👤 You' : '🤖 DVARY AI'}
                            </div>
                            <div className="ai-msg-bubble">
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="ai-msg bot">
                            <div className="ai-msg-label">🤖 DVARY AI</div>
                            <div className="ai-msg-bubble typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="ai-suggestions">
                    <button onClick={() => handleSuggestion('Recommend me a good game')}>
                        🎮 Recommend a game
                    </button>
                    <button onClick={() => handleSuggestion('What are the best FPS games?')}>
                        🔫 Best FPS games
                    </button>
                    <button onClick={() => handleSuggestion('Tell me about DVARY GAMES')}>
                        ℹ️ About DVARY
                    </button>
                    <button onClick={() => handleSuggestion('Tips for gaming beginners')}>
                        🆕 Beginner tips
                    </button>
                </div>

                <div className="ai-input-area">
                    <input
                        type="text"
                        placeholder="Ask DVARY AI..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading || !user}
                    />
                    <button 
                        onClick={sendMessage} 
                        disabled={loading || !user}
                    >
                        {loading ? '...' : 'Send'}
                    </button>
                </div>

                {!user && (
                    <div className="ai-login-warning">
                        <span>🔒 Please <a href="/login">login</a> to use the AI assistant</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Ai;
