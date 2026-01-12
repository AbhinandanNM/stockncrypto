import React, { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        symbol: '',
        name: '',
        type: 'stock',
        action: 'buy',
        quantity: '',
        price: '',
        notes: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/transactions');
            setTransactions(response.data);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/transactions', {
                ...formData,
                quantity: parseFloat(formData.quantity),
                price: parseFloat(formData.price)
            });
            setShowModal(false);
            setFormData({ symbol: '', name: '', type: 'stock', action: 'buy', quantity: '', price: '', notes: '' });
            fetchTransactions();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to record transaction');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this transaction?')) return;
        try {
            await api.delete(`/transactions/${id}`);
            fetchTransactions();
        } catch (error) {
            console.error('Failed to delete transaction:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: '2rem 0' }}>
                <div className="flex-between mb-2 fade-in">
                    <div>
                        <h1>Trading History</h1>
                        <p className="text-muted">Record and track your buy/sell transactions</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        + Record Transaction
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Loading transactions...</div>
                ) : transactions.length > 0 ? (
                    <div className="card fade-in">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Symbol</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Action</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx._id}>
                                        <td>{new Date(tx.transactionDate).toLocaleDateString()}</td>
                                        <td><strong>{tx.symbol}</strong></td>
                                        <td>{tx.name}</td>
                                        <td><span className={`badge badge-${tx.type === 'crypto' ? 'warning' : 'primary'}`}>{tx.type}</span></td>
                                        <td><span className={`badge badge-${tx.action === 'buy' ? 'success' : 'danger'}`}>{tx.action.toUpperCase()}</span></td>
                                        <td>{tx.quantity}</td>
                                        <td>${tx.price.toFixed(2)}</td>
                                        <td><strong>${tx.total.toFixed(2)}</strong></td>
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(tx._id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="card text-center fade-in">
                        <h3>No transactions yet</h3>
                        <p className="text-muted">Start recording your trades</p>
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>Record Transaction</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Symbol</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.symbol}
                                        onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                                        placeholder="AAPL, BTC, etc."
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Apple Inc., Bitcoin, etc."
                                        required
                                    />
                                </div>
                                <div className="grid grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Type</label>
                                        <select
                                            className="form-select"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option value="stock">Stock</option>
                                            <option value="crypto">Crypto</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Action</label>
                                        <select
                                            className="form-select"
                                            value={formData.action}
                                            onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                                        >
                                            <option value="buy">Buy</option>
                                            <option value="sell">Sell</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Quantity</label>
                                        <input
                                            type="number"
                                            step="0.00000001"
                                            className="form-input"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                            placeholder="10"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Price</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-input"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="150.00"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Notes (Optional)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="Additional notes..."
                                    />
                                </div>
                                <div className="flex gap-1">
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Record</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .modal-content {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }
      `}</style>
        </>
    );
};

export default Transactions;
