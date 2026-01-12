import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [portfolio, setPortfolio] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [portfolioRes, transactionsRes, statsRes] = await Promise.all([
                axios.get('/api/portfolio'),
                axios.get('/api/transactions'),
                axios.get('/api/transactions/stats')
            ]);

            setPortfolio(portfolioRes.data.slice(0, 5));
            setTransactions(transactionsRes.data.slice(0, 5));
            setStats(statsRes.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculatePortfolioValue = () => {
        return portfolio.reduce((total, holding) => {
            return total + (holding.quantity * holding.purchasePrice);
        }, 0);
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container" style={{ padding: '2rem' }}>
                    <div className="loading">Loading dashboard...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container dashboard-container">
                <div className="dashboard-header fade-in">
                    <h1>Dashboard</h1>
                    <p className="text-muted">Welcome back! Here's your portfolio overview</p>
                </div>

                <div className="stats-grid grid grid-4 fade-in">
                    <div className="stat-card card">
                        <div className="stat-icon">💼</div>
                        <div className="stat-content">
                            <p className="stat-label">Portfolio Value</p>
                            <h3 className="stat-value">${calculatePortfolioValue().toFixed(2)}</h3>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-content">
                            <p className="stat-label">Total Transactions</p>
                            <h3 className="stat-value">{stats?.totalTransactions || 0}</h3>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-content">
                            <p className="stat-label">Total Invested</p>
                            <h3 className="stat-value">${stats?.totalBuys?.toFixed(2) || '0.00'}</h3>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className={`stat-icon ${stats?.profitLoss >= 0 ? 'text-success' : 'text-danger'}`}>
                            {stats?.profitLoss >= 0 ? '📈' : '📉'}
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Profit/Loss</p>
                            <h3 className={`stat-value ${stats?.profitLoss >= 0 ? 'text-success' : 'text-danger'}`}>
                                ${stats?.profitLoss?.toFixed(2) || '0.00'}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="dashboard-content grid grid-2">
                    <div className="card fade-in">
                        <div className="card-header">
                            <h3>Recent Holdings</h3>
                        </div>
                        {portfolio.length > 0 ? (
                            <div className="holdings-list">
                                {portfolio.map((holding) => (
                                    <div key={holding._id} className="holding-item">
                                        <div>
                                            <p className="holding-symbol">{holding.symbol}</p>
                                            <p className="text-muted">{holding.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="holding-quantity">{holding.quantity} shares</p>
                                            <p className="text-muted">${holding.purchasePrice.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted text-center">No holdings yet. Start building your portfolio!</p>
                        )}
                    </div>

                    <div className="card fade-in">
                        <div className="card-header">
                            <h3>Recent Transactions</h3>
                        </div>
                        {transactions.length > 0 ? (
                            <div className="transactions-list">
                                {transactions.map((transaction) => (
                                    <div key={transaction._id} className="transaction-item">
                                        <div>
                                            <p className="transaction-symbol">{transaction.symbol}</p>
                                            <p className="text-muted">{new Date(transaction.transactionDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`badge ${transaction.action === 'buy' ? 'badge-success' : 'badge-danger'}`}>
                                                {transaction.action.toUpperCase()}
                                            </span>
                                            <p className="text-muted">${transaction.total.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted text-center">No transactions yet. Record your first trade!</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
