import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/dashboard" className="navbar-brand">
                        <span className="brand-icon">📈</span>
                        <span className="brand-text">Stock & Crypto Trader</span>
                    </Link>

                    <div className="navbar-links">
                        <Link to="/dashboard" className={isActive('/dashboard') ? 'nav-link active' : 'nav-link'}>
                            Dashboard
                        </Link>
                        <Link to="/portfolio" className={isActive('/portfolio') ? 'nav-link active' : 'nav-link'}>
                            Portfolio
                        </Link>
                        <Link to="/crypto" className={isActive('/crypto') ? 'nav-link active' : 'nav-link'}>
                            Crypto
                        </Link>
                        <Link to="/watchlist" className={isActive('/watchlist') ? 'nav-link active' : 'nav-link'}>
                            Watchlist
                        </Link>
                        <Link to="/transactions" className={isActive('/transactions') ? 'nav-link active' : 'nav-link'}>
                            Transactions
                        </Link>
                        <Link to="/news" className={isActive('/news') ? 'nav-link active' : 'nav-link'}>
                            News
                        </Link>
                    </div>

                    <div className="navbar-user">
                        <div className="user-info">
                            <img src={user?.avatar} alt={user?.name} className="user-avatar" />
                            <span className="user-name">{user?.name}</span>
                        </div>
                        <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
