import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, onAuthStateChanged } from './firebase/firebase';

// Components
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';

// Pages
import Main from './pages/Main';
import About from './pages/About';
import Community from './pages/Community';
import Games from './pages/Games';
import Ai from './pages/Ai';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Graph from './pages/Graph';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="loading-card" style={{ width: '100px', height: '100px', borderRadius: '50%' }}></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

const App = () => {
    return (
        <Router>
            <Navbar />
            <main className="main-content">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Navigate to="/main" />} />
                    <Route path="/main" element={<Main />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    
                    {/* Protected Routes */}
                    <Route path="/about" element={
                        <ProtectedRoute><About /></ProtectedRoute>
                    } />
                    <Route path="/community" element={
                        <ProtectedRoute><Community /></ProtectedRoute>
                    } />
                    <Route path="/games" element={
                        <ProtectedRoute><Games /></ProtectedRoute>
                    } />
                    <Route path="/ai" element={
                        <ProtectedRoute><Ai /></ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                        <ProtectedRoute><Admin /></ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute><Profile /></ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                        <ProtectedRoute><Settings /></ProtectedRoute>
                    } />
                    <Route path="/graph" element={
                        <ProtectedRoute><Graph /></ProtectedRoute>
                    } />
                </Routes>
            </main>
            <BottomNav />
        </Router>
    );
};

export default App;
