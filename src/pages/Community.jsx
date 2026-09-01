import React, { useState, useEffect, useRef } from 'react';
import { 
    db, 
    collection, 
    query, 
    orderBy, 
    onSnapshot, 
    addDoc, 
    serverTimestamp,
    auth,
    onAuthStateChanged,
    doc,
    getDoc,
    updateDoc,
    storage,
    ref,
    uploadBytes,
    getDownloadURL
} from '../firebase/firebase';
import './Community.css';

const Community = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [onlineCount, setOnlineCount] = useState(0);
    const [memberCount, setMemberCount] = useState(0);
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    // Emoji list
    const emojis = ['😊', '😂', '❤️', '🔥', '🎮', '👍', '👋', '🤣', '😍', '🥳', '😎', '🤔', '🤯', '🥺', '😅', '🎯', '🏆', '💀', '👾', '🤖', '👽', '🚀', '⚡', '💯', '🦾', '⚽', '🏎️', '👑'];

    // Auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                await loadUserData(user);
            } else {
                setUser(null);
                setUserData(null);
            }
        });
        return () => unsubscribe();
    }, []);

    // Load user data
    const loadUserData = async (user) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            } else {
                const newUserData = {
                    username: user.displayName || 'User',
                    email: user.email,
                    photoURL: user.photoURL || null,
                    avatarEmoji: '👤',
                    uid: user.uid,
                    lastSeen: new Date().toISOString()
                };
                await updateDoc(doc(db, 'users', user.uid), newUserData);
                setUserData(newUserData);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    // Load messages (real-time)
    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, 'community_messages'), orderBy('createdAt', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = [];
            snapshot.forEach((doc) => {
                msgs.push({ id: doc.id, ...doc.data() });
            });
            setMessages(msgs);
            setLoading(false);
            scrollToBottom();
        }, (error) => {
            console.error('Error loading messages:', error);
            setLoading(false);
        });

        // Update online status
        updateOnlineStatus();
        updateMemberCount();

        // Update last seen periodically
        const interval = setInterval(() => {
            if (user) {
                updateDoc(doc(db, 'users', user.uid), {
                    lastSeen: new Date().toISOString()
                }).catch(() => {});
                updateOnlineStatus();
                updateMemberCount();
            }
        }, 30000);

        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, [user]);

    // Scroll to bottom
    const scrollToBottom = () => {
        setTimeout(() => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    // Update online status
    const updateOnlineStatus = async () => {
        try {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            const querySnapshot = await getDocs(collection(db, 'users'));
            let online = 0;
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.lastSeen && new Date(data.lastSeen) > fiveMinutesAgo) {
                    online++;
                }
            });
            setOnlineCount(online);
        } catch (error) {
            console.error('Error updating online status:', error);
        }
    };

    // Update member count
    const updateMemberCount = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            setMemberCount(querySnapshot.size);
        } catch (error) {
            console.error('Error updating member count:', error);
        }
    };

    // Send message
    const sendMessage = async () => {
        if (!newMessage.trim() && !imageFile) return;
        if (!user || !userData) {
            alert('Please login to send messages');
            return;
        }

        try {
            const messageData = {
                userId: user.uid,
                username: userData.username || 'User',
                displayName: userData.displayName || userData.username || 'User',
                photoURL: userData.photoURL || null,
                avatarEmoji: userData.avatarEmoji || '👤',
                message: newMessage.trim() || '',
                createdAt: serverTimestamp(),
                type: 'text',
                reactions: {}
            };

            if (replyTo) {
                messageData.replyTo = replyTo;
                setReplyTo(null);
            }

            // Upload image if exists
            if (imageFile) {
                setUploading(true);
                const storageRef = ref(storage, `community_images/${Date.now()}_${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                const downloadURL = await getDownloadURL(storageRef);
                messageData.imageUrl = downloadURL;
                messageData.type = 'image';
                setImageFile(null);
                setUploading(false);
            }

            await addDoc(collection(db, 'community_messages'), messageData);
            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
            setUploading(false);
        }
    };

    // Add reaction
    const addReaction = async (messageId, emoji) => {
        if (!user) {
            alert('Please login to react');
            return;
        }

        try {
            const msgRef = doc(db, 'community_messages', messageId);
            const msgDoc = await getDoc(msgRef);
            if (!msgDoc.exists()) return;

            const data = msgDoc.data();
            const reactions = data.reactions || {};
            
            if (!reactions[emoji]) {
                reactions[emoji] = [];
            }

            const userId = user.uid;
            const index = reactions[emoji].indexOf(userId);
            if (index > -1) {
                reactions[emoji].splice(index, 1);
                if (reactions[emoji].length === 0) {
                    delete reactions[emoji];
                }
            } else {
                reactions[emoji].push(userId);
            }

            await updateDoc(msgRef, { reactions });
        } catch (error) {
            console.error('Error adding reaction:', error);
        }
    };

    // Reply to message
    const replyToMessage = (messageId, username) => {
        setReplyTo({ id: messageId, username });
        document.getElementById('messageInput').focus();
    };

    // Insert emoji
    const insertEmoji = (emoji) => {
        setNewMessage(prev => prev + emoji);
        setEmojiPickerOpen(false);
        document.getElementById('messageInput').focus();
    };

    // Format time
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Format date
    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const today = new Date();
        if (date.toDateString() === today.toDateString()) return 'Today';
        return date.toLocaleDateString();
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert('Image too large. Maximum size is 5MB.');
            return;
        }
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }
        setImageFile(file);
        e.target.value = '';
    };

    // Cancel image upload
    const cancelImageUpload = () => {
        setImageFile(null);
    };

    // Handle enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Toggle emoji picker
    const toggleEmojiPicker = () => {
        setEmojiPickerOpen(!emojiPickerOpen);
    };

    // Render message
    const renderMessage = (msg) => {
        const isOwn = msg.userId === user?.uid;
        const avatar = msg.photoURL || msg.avatarEmoji || '👤';
        const displayName = msg.displayName || msg.username || 'User';
        const hasImage = msg.imageUrl || msg.type === 'image';
        const reactions = msg.reactions || {};
        const hasReactions = Object.keys(reactions).length > 0;

        return (
            <div key={msg.id} className={`msg-wrapper ${isOwn ? 'own' : ''}`}>
                <div className="avatar">
                    {avatar.startsWith('http') ? (
                        <img src={avatar} alt={displayName} />
                    ) : (
                        avatar
                    )}
                </div>
                <div className="msg-content">
                    <div className="sender">{displayName}</div>
                    <div className="bubble">
                        {msg.replyTo && (
                            <div className="reply-to">
                                ↩️ Replying to: {msg.replyTo.username || 'User'}
                            </div>
                        )}
                        {hasImage && (
                            <img src={msg.imageUrl} alt="Image" className="msg-image" />
                        )}
                        {msg.message}
                        <span className="msg-time">{formatTime(msg.createdAt)}</span>
                        
                        {hasReactions && (
                            <div className="msg-reactions">
                                {Object.entries(reactions).map(([emoji, users]) => (
                                    <span 
                                        key={emoji} 
                                        className="reaction" 
                                        onClick={() => addReaction(msg.id, emoji)}
                                    >
                                        {emoji} {users.length}
                                    </span>
                                ))}
                            </div>
                        )}
                        
                        <div className="msg-actions">
                            <button onClick={() => addReaction(msg.id, '❤️')}>❤️</button>
                            <button onClick={() => addReaction(msg.id, '🔥')}>🔥</button>
                            <button onClick={() => addReaction(msg.id, '👍')}>👍</button>
                            <button onClick={() => replyToMessage(msg.id, displayName)}>↩️</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render date separator
    const renderDateSeparator = (msg, index) => {
        if (index === 0) return true;
        const prevDate = messages[index - 1].createdAt;
        const currentDate = msg.createdAt;
        if (!prevDate || !currentDate) return false;
        const prev = prevDate.toDate ? prevDate.toDate() : new Date(prevDate);
        const curr = currentDate.toDate ? currentDate.toDate() : new Date(currentDate);
        return prev.toDateString() !== curr.toDateString();
    };

    // Group messages by date
    const groupedMessages = [];
    messages.forEach((msg, index) => {
        const date = msg.createdAt ? formatDate(msg.createdAt) : 'Unknown';
        const dateKey = date;
        const lastGroup = groupedMessages[groupedMessages.length - 1];
        if (lastGroup && lastGroup.date === dateKey) {
            lastGroup.messages.push(msg);
        } else {
            groupedMessages.push({ date: dateKey, messages: [msg] });
        }
    });

    // Check if message has reactions
    const hasReactions = (msg) => {
        return msg.reactions && Object.keys(msg.reactions).length > 0;
    };

    return (
        <div className="community-page">
            {/* Community Info */}
            <div className="community-info">
                <div className="info-left">
                    <div className="title">🎮 <span>DVARY GAMES</span> COMMUNITY</div>
                    <div className="online-status">
                        <span className="dot"></span>
                        <span id="onlineCount">{onlineCount}</span> online
                    </div>
                </div>
                <div className="info-right">
                    <span>👥 {memberCount}</span>
                </div>
            </div>

            {/* Login Required */}
            {!user && (
                <div className="login-required">
                    <span className="icon">🔒</span>
                    <h2>Login to Join</h2>
                    <p>Sign in to chat with other gamers in the community.</p>
                    <a href="/login" className="btn-login">🔑 Login to Chat</a>
                </div>
            )}

            {/* Chat Messages */}
            {user && (
                <div className="chat-messages-container" ref={chatContainerRef}>
                    {loading ? (
                        <div className="chat-loading">
                            <div className="spinner"></div>
                            <p>Loading messages...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="chat-empty">
                            <span className="icon">🎮</span>
                            <h3>Welcome to DVARY Community</h3>
                            <p>Start a conversation with other gamers.</p>
                        </div>
                    ) : (
                        <div className="messages-wrapper">
                            {groupedMessages.map((group, groupIndex) => (
                                <React.Fragment key={groupIndex}>
                                    <div className="date-separator">
                                        <span>{group.date}</span>
                                    </div>
                                    {group.messages.map((msg) => renderMessage(msg))}
                                </React.Fragment>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            )}

            {/* Chat Composer */}
            {user && (
                <div className="chat-composer">
                    <div className="composer-wrapper">
                        <button className="composer-btn" onClick={toggleEmojiPicker}>😊</button>
                        <textarea
                            id="messageInput"
                            rows="1"
                            placeholder={replyTo ? `Replying to ${replyTo.username}...` : "Type a message..."}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={uploading}
                        />
                        <button className="composer-btn" onClick={() => document.getElementById('imageInput').click()}>
                            📎
                        </button>
                        <input
                            type="file"
                            id="imageInput"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                        {imageFile && (
                            <div className="image-preview">
                                <span>📷 {imageFile.name}</span>
                                <button onClick={cancelImageUpload}>✕</button>
                            </div>
                        )}
                    </div>
                    <button 
                        className="send-btn" 
                        onClick={sendMessage}
                        disabled={uploading}
                    >
                        ➤
                    </button>
                </div>
            )}

            {/* Emoji Picker */}
            {emojiPickerOpen && (
                <div className="emoji-picker">
                    {emojis.map((emoji) => (
                        <span key={emoji} className="emoji" onClick={() => insertEmoji(emoji)}>
                            {emoji}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Community;
