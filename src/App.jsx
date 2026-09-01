import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

// Pages
import About from './pages/About';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Ai from './pages/Ai';

const App = () => {
    return (
        <Router>
            <Navbar />
            <main style={{ paddingTop: '130px', minHeight: '100vh' }}>
                <Routes>
                    <Route path="/" element={<Navigate to="/profile" />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/ai" element={<Ai />} />
                </Routes>
            </main>
        </Router>
    );
};

export default App;
