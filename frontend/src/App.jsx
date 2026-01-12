import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Crypto from './pages/Crypto';
import Watchlist from './pages/Watchlist';
import Transactions from './pages/Transactions';
import News from './pages/News';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/portfolio" element={
                        <ProtectedRoute>
                            <Portfolio />
                        </ProtectedRoute>
                    } />

                    <Route path="/crypto" element={
                        <ProtectedRoute>
                            <Crypto />
                        </ProtectedRoute>
                    } />

                    <Route path="/watchlist" element={
                        <ProtectedRoute>
                            <Watchlist />
                        </ProtectedRoute>
                    } />

                    <Route path="/transactions" element={
                        <ProtectedRoute>
                            <Transactions />
                        </ProtectedRoute>
                    } />

                    <Route path="/news" element={
                        <ProtectedRoute>
                            <News />
                        </ProtectedRoute>
                    } />

                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
